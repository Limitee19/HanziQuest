import { course } from '@/data/course';
import type { CourseWord } from '@/data/course.types';
import { meaningOf } from '@/data/course.types';
import { selectSql } from '@/db/client';
import { getActiveUserId } from '@/services/auth/classAuthService';
import { supabase } from '@/services/sync/supabaseClient';

export interface OutpostStats {
  level: number;
  total: number;
  due: number;
  mastered: number;
}

export interface LeechItem {
  id: string;
  wordId: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  level: number;
  fails: number;
  note: string;
  updatedAt: number;
}

function getQuestStorageKey(): string {
  return `omnilife_quest_progress_${getActiveUserId()}`;
}

function getMnemonicStorageKey(): string {
  return `omnilife_mnemonics_${getActiveUserId()}`;
}

function getLeechStorageKey(): string {
  return `omnilife_leeches_${getActiveUserId()}`;
}

// ── Outpost Stats per HSK Level ─────────────────────────────────────────

let isSyncInProgress = false;
let lastSyncTimestamp = 0;

/**
 * Sinkronisasi progres petualangan kartu Hanzi (Pos 1 s/d Pos 6) 
 * secara dua arah (bidirectional merge) antara perangkat lokal dan Supabase Cloud.
 */
export async function syncStudentQuestProgress(force = false): Promise<void> {
  const userId = getActiveUserId();
  if (!supabase || userId === 'usr_guest') return;

  const now = Date.now();
  if (!force && isSyncInProgress) return;
  if (!force && now - lastSyncTimestamp < 3500) return;

  isSyncInProgress = true;
  lastSyncTimestamp = now;

  try {
    const scopedKey = getQuestStorageKey();

    // 1. Ambil data lokal
    const localMap: Record<string, { id: string; word_id?: string; hanzi?: string; stage: string; due_date: string; review_count: number; updated_at: number }> = {};

    // a) LocalStorage per user
    try {
      const raw = localStorage.getItem(scopedKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        Object.assign(localMap, parsed);
      }
    } catch {}

    // b) Legacy localStorage fallback
    try {
      const legacyRaw = localStorage.getItem('omnilife_quest_progress');
      if (legacyRaw) {
        const legacyParsed = JSON.parse(legacyRaw);
        for (const [id, item] of Object.entries(legacyParsed)) {
          if (!localMap[id]) {
            localMap[id] = item as any;
          }
        }
      }
    } catch {}

    // c) SQLite lokal
    try {
      const rows = await selectSql<{ id: string; stage: string; due_date: string; review_count?: number; updated_at?: number }>(
        `SELECT id, stage, due_date, review_count, updated_at FROM chinese_program_progress;`
      );
      rows.forEach((r) => {
        if (!localMap[r.id]) {
          localMap[r.id] = {
            id: r.id,
            word_id: r.id,
            stage: r.stage,
            due_date: r.due_date,
            review_count: r.review_count || 1,
            updated_at: r.updated_at || now,
          };
        }
      });
    } catch {}

    // 2. Ambil data cloud (student_quest_progress & student_quest_meta)
    const cloudProgressMap: Record<string, { word_id: string; hanzi?: string; stage: string; due_date: string; review_count: number; updated_at: number }> = {};

    // a) student_quest_progress (paginasi per 1000 agar tidak terpotong batasan max_rows)
    try {
      let page = 0;
      const PAGE_SIZE = 1000;
      while (true) {
        const { data, error } = await supabase
          .from('student_quest_progress')
          .select('word_id, hanzi, stage, due_date, review_count, updated_at')
          .eq('user_id', userId)
          .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
        if (error || !data || data.length === 0) break;
        for (const row of data) {
          cloudProgressMap[row.word_id] = {
            word_id: row.word_id,
            hanzi: row.hanzi,
            stage: row.stage,
            due_date: row.due_date,
            review_count: row.review_count || 1,
            updated_at: Number(row.updated_at) || 0,
          };
        }
        if (data.length < PAGE_SIZE) break;
        page++;
      }
    } catch (e) {
      console.warn('Fetch student_quest_progress error:', e);
    }

    // b) student_quest_meta (snapshot backup & leech words)
    let metaSnapshot: any = null;
    let existingNotes: Record<string, any> = {};
    let cloudLeechWords: LeechItem[] = [];
    try {
      const { data: meta } = await supabase
        .from('student_quest_meta')
        .select('leech_words, mnemonic_notes')
        .eq('user_id', userId)
        .maybeSingle();
      if (meta) {
        existingNotes = meta.mnemonic_notes || {};
        metaSnapshot = existingNotes.__quest_progress || (meta as any).quest_progress || null;
        cloudLeechWords = Array.isArray(meta.leech_words) ? meta.leech_words : [];

        if (metaSnapshot && typeof metaSnapshot === 'object') {
          for (const [id, item] of Object.entries(metaSnapshot) as any) {
            if (!cloudProgressMap[id]) {
              cloudProgressMap[id] = {
                word_id: id,
                hanzi: item.hanzi,
                stage: item.stage,
                due_date: item.due_date,
                review_count: item.review_count || 1,
                updated_at: Number(item.updated_at) || 0,
              };
            }
          }
        }
      }
    } catch (e) {
      console.warn('Fetch student_quest_meta error:', e);
    }

    // 3. Bidirectional Merge
    const stageRank = (s?: string) => {
      if (s === 'production') return 3;
      if (s === 'recognition') return 2;
      if (s === 'learning') return 1;
      return 0;
    };

    const mergedMap: Record<string, any> = { ...localMap };
    const toUploadList: any[] = [];
    let hasLocalChanges = false;

    // Gabungkan semua ID kata yang ada di cloud dan lokal
    const allWordIds = new Set([...Object.keys(localMap), ...Object.keys(cloudProgressMap)]);

    for (const wordId of allWordIds) {
      const localItem = localMap[wordId];
      const cloudItem = cloudProgressMap[wordId];

      if (localItem && !cloudItem) {
        // Ada di lokal tapi belum di cloud -> jadwalkan upload ke cloud
        toUploadList.push(localItem);
      } else if (!localItem && cloudItem) {
        // Ada di cloud tapi belum di lokal -> update ke lokal
        mergedMap[wordId] = {
          id: cloudItem.word_id,
          word_id: cloudItem.word_id,
          hanzi: cloudItem.hanzi,
          stage: cloudItem.stage,
          due_date: cloudItem.due_date,
          review_count: cloudItem.review_count,
          updated_at: cloudItem.updated_at,
        };
        hasLocalChanges = true;
      } else if (localItem && cloudItem) {
        // Ada di kedua sisi -> pilih yang progresnya paling maju / terbaru
        const localScore = stageRank(localItem.stage);
        const cloudScore = stageRank(cloudItem.stage);
        const localCount = localItem.review_count || 1;
        const cloudCount = cloudItem.review_count || 1;
        const localTs = localItem.updated_at || 0;
        const cloudTs = cloudItem.updated_at || 0;

        let localIsBetter = false;
        let cloudIsBetter = false;

        if (localScore > cloudScore) {
          localIsBetter = true;
        } else if (cloudScore > localScore) {
          cloudIsBetter = true;
        } else if (localCount > cloudCount) {
          localIsBetter = true;
        } else if (cloudCount > localCount) {
          cloudIsBetter = true;
        } else if (localTs > cloudTs) {
          localIsBetter = true;
        } else if (cloudTs > localTs) {
          cloudIsBetter = true;
        }

        if (cloudIsBetter) {
          mergedMap[wordId] = {
            id: cloudItem.word_id,
            word_id: cloudItem.word_id,
            hanzi: cloudItem.hanzi || localItem.hanzi,
            stage: cloudItem.stage,
            due_date: cloudItem.due_date,
            review_count: cloudItem.review_count,
            updated_at: cloudItem.updated_at,
          };
          hasLocalChanges = true;
        } else if (localIsBetter) {
          toUploadList.push(localItem);
        }
      }
    }

    // 4. Upload ke Cloud jika ada data baru / lebih maju dari lokal
    if (toUploadList.length > 0) {
      for (let i = 0; i < toUploadList.length; i += 200) {
        const batch = toUploadList.slice(i, i + 200).map((item) => ({
          user_id: userId,
          word_id: item.word_id || item.id,
          hanzi: item.hanzi || '',
          stage: item.stage || 'learning',
          due_date: item.due_date || new Date().toISOString().slice(0, 10),
          review_count: item.review_count || 1,
          updated_at: item.updated_at || Date.now(),
        }));
        await supabase.from('student_quest_progress').upsert(batch);
      }
    }

    // Selalu simpan snapshot cadangan ke student_quest_meta agar 100% aman
    const updatedNotes = { ...existingNotes, __quest_progress: mergedMap };
    await supabase.from('student_quest_meta').upsert({
      user_id: userId,
      mnemonic_notes: updatedNotes,
      updated_at: Date.now(),
    });

    // 5. Simpan hasil merge ke LocalStorage
    localStorage.setItem(scopedKey, JSON.stringify(mergedMap));

    // Sinkronkan Leech words jika cloud memiliki catatan yang lebih baru
    if (cloudLeechWords.length > 0) {
      const localLeeches = getLeechItems();
      const leechMap = new Map<string, LeechItem>();
      localLeeches.forEach((l) => leechMap.set(l.wordId, l));
      cloudLeechWords.forEach((l) => {
        if (!leechMap.has(l.wordId) || (l.updatedAt && l.updatedAt > (leechMap.get(l.wordId)?.updatedAt || 0))) {
          leechMap.set(l.wordId, l);
        }
      });
      localStorage.setItem(getLeechStorageKey(), JSON.stringify(Array.from(leechMap.values())));
    }

    // Sinkronkan ke SQLite chinese_program_progress
    try {
      const { executeSql } = await import('@/db/client');
      for (const item of Object.values(mergedMap)) {
        if (item.stage === 'production' || item.stage === 'recognition' || (item.review_count && item.review_count >= 1)) {
          await executeSql(
            `INSERT INTO chinese_program_progress (id, stage, due_date, last_interval, review_count, updated_at)
             VALUES (?, ?, ?, 1, ?, ?)
             ON CONFLICT(id) DO UPDATE SET
               stage = excluded.stage,
               due_date = excluded.due_date,
               review_count = excluded.review_count,
               updated_at = excluded.updated_at;`,
            [item.id || item.word_id, item.stage, item.due_date || '2026-12-31', item.review_count || 1, item.updated_at || now]
          );
        }
      }
    } catch {}

    if (toUploadList.length > 0 || hasLocalChanges) {
      window.dispatchEvent(new CustomEvent('omnilife_db_updated'));
    }
  } catch (err) {
    console.warn('syncStudentQuestProgress failed:', err);
  } finally {
    isSyncInProgress = false;
  }
}

export async function fetchOutpostStats(): Promise<Record<number, { total: number; due: number; mastered: number }>> {
  // Jalankan sinkronisasi cloud terlebih dahulu
  try {
    await syncStudentQuestProgress();
  } catch {}

  const result: Record<number, { total: number; due: number; mastered: number }> = {};
  for (let l = 1; l <= 6; l++) {
    const wordsInLevel = course.words.filter((w) => w.level === String(l));
    result[l] = {
      total: wordsInLevel.length,
      due: 0,
      mastered: 0,
    };
  }

  try {
    const todayStr = new Date().toISOString().slice(0, 10);
    const progressMap = new Map<string, { id: string; stage: string; due_date: string; review_count?: number }>();
    const scopedKey = getQuestStorageKey();

    // 1) Ambil dari localStorage per-user (sudah disinkronkan & dimerge)
    try {
      const rawLocal = localStorage.getItem(scopedKey);
      if (rawLocal) {
        const localMap = JSON.parse(rawLocal);
        for (const [id, item] of Object.entries(localMap)) {
          progressMap.set(id, item as any);
        }
      }
    } catch {}

    // 2) Ambil dari SQLite jika ada kata tambahan
    try {
      const rows = await selectSql<{ id: string; stage: string; due_date: string; review_count?: number }>(
        `SELECT id, stage, due_date, review_count FROM chinese_program_progress;`
      );
      rows.forEach((r) => {
        if (!progressMap.has(r.id)) progressMap.set(r.id, r);
      });
    } catch {}

    // 3) Fallback legacy jika ada
    try {
      const legacyRaw = localStorage.getItem('omnilife_quest_progress');
      if (legacyRaw) {
        const legacyMap = JSON.parse(legacyRaw);
        for (const [id, item] of Object.entries(legacyMap)) {
          if (!progressMap.has(id)) {
            progressMap.set(id, item as any);
          }
        }
      }
    } catch {}

    for (const w of course.words) {
      const lv = parseInt(w.level, 10);
      if (lv >= 1 && lv <= 6) {
        const prog = progressMap.get(w.id) || progressMap.get(w.hanzi);
        if (prog) {
          if (prog.due_date <= todayStr && prog.due_date !== '9999-12-31') {
            result[lv].due += 1;
          }
          if (
            prog.due_date === '9999-12-31' ||
            prog.stage === 'production' ||
            prog.stage === 'recognition' ||
            (prog.review_count && prog.review_count >= 1)
          ) {
            result[lv].mastered += 1;
          }
        }
      }
    }

    // Default: jika pos 1 belum pernah dipelajari sama sekali, sediakan 25 kata jatuh tempo pertama
    if (result[1].due === 0 && result[1].mastered === 0) {
      result[1].due = Math.min(25, result[1].total);
    }
  } catch {
    result[1].due = 25;
  }

  return result;
}

// ── Mnemonik & Ruang Leech (Kata Bandel) ─────────────────────────────────

export function getMnemonicNotes(): Record<string, string> {
  try {
    const raw = localStorage.getItem(getMnemonicStorageKey());
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveMnemonicNote(wordId: string, note: string): void {
  try {
    const notes = getMnemonicNotes();
    if (note.trim()) {
      notes[wordId] = note.trim();
    } else {
      delete notes[wordId];
    }
    localStorage.setItem(getMnemonicStorageKey(), JSON.stringify(notes));

    // Sync ke Supabase student_quest_meta jika terhubung dan bukan akun tamu
    const userId = getActiveUserId();
    if (supabase && userId !== 'usr_guest') {
      void Promise.resolve(
        (async () => {
          const { data: existing } = await supabase
            .from('student_quest_meta')
            .select('leech_words, mnemonic_notes')
            .eq('user_id', userId)
            .maybeSingle();
          const mergedNotes = { ...(existing?.mnemonic_notes || {}), ...notes };
          await supabase.from('student_quest_meta').upsert({
            user_id: userId,
            mnemonic_notes: mergedNotes,
            leech_words: existing?.leech_words || getLeechItems(),
            updated_at: Date.now(),
          });
        })()
      ).catch(() => {});
    }
  } catch {}
}

function getWordFailsStorageKey(): string {
  return `omnilife_word_fails_${getActiveUserId()}`;
}

export function getWordFailsMap(): Record<string, number> {
  try {
    const raw = localStorage.getItem(getWordFailsStorageKey());
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getLeechItems(): LeechItem[] {
  try {
    const raw = localStorage.getItem(getLeechStorageKey());
    const list: LeechItem[] = raw ? JSON.parse(raw) : [];
    const notes = getMnemonicNotes();
    return list.map((item) => ({ ...item, note: notes[item.wordId] || item.note || '' }));
  } catch {
    return [];
  }
}

export function addLeechRecord(word: CourseWord, fails: number = 1): void {
  try {
    const userId = getActiveUserId();
    const isGuest = userId === 'usr_guest';
    const items = getLeechItems();
    const existingIdx = items.findIndex((i) => i.wordId === word.id || i.hanzi === word.hanzi);
    const notes = getMnemonicNotes();

    // Hitung kesalahan secara real per kata (bukan di-hardcode 3)
    const failsMap = getWordFailsMap();
    const prevFails = failsMap[word.id] !== undefined
      ? failsMap[word.id]
      : (existingIdx >= 0 ? items[existingIdx].fails : 0);
    const currentFails = prevFails + Math.max(1, fails);
    failsMap[word.id] = currentFails;
    localStorage.setItem(getWordFailsStorageKey(), JSON.stringify(failsMap));

    const entry: LeechItem = {
      id: `leech_${word.id}`,
      wordId: word.id,
      hanzi: word.hanzi,
      pinyin: word.pinyin,
      meaning: meaningOf(word),
      level: parseInt(word.level, 10) || 1,
      fails: currentFails,
      note: notes[word.id] || '',
      updatedAt: Date.now(),
    };

    if (existingIdx >= 0) {
      items[existingIdx] = entry;
    } else {
      items.unshift(entry);
    }

    localStorage.setItem(getLeechStorageKey(), JSON.stringify(items));

    // Sync ke Supabase student_quest_meta jika bukan tamu
    if (supabase && !isGuest) {
      void Promise.resolve(
        (async () => {
          const { data: existing } = await supabase
            .from('student_quest_meta')
            .select('mnemonic_notes')
            .eq('user_id', userId)
            .maybeSingle();
          await supabase.from('student_quest_meta').upsert({
            user_id: userId,
            leech_words: items,
            mnemonic_notes: existing?.mnemonic_notes || getMnemonicNotes(),
            updated_at: Date.now(),
          });
        })()
      ).catch(() => {});
    }
  } catch {}
}

export function removeLeechRecord(wordId: string): void {
  try {
    const userId = getActiveUserId();
    const isGuest = userId === 'usr_guest';
    const items = getLeechItems().filter((i) => i.wordId !== wordId && i.id !== wordId);
    localStorage.setItem(getLeechStorageKey(), JSON.stringify(items));

    // Reset fail count untuk kata yang sudah jinak
    const failsMap = getWordFailsMap();
    delete failsMap[wordId];
    localStorage.setItem(getWordFailsStorageKey(), JSON.stringify(failsMap));

    if (supabase && !isGuest) {
      void Promise.resolve(
        (async () => {
          const { data: existing } = await supabase
            .from('student_quest_meta')
            .select('mnemonic_notes')
            .eq('user_id', userId)
            .maybeSingle();
          await supabase.from('student_quest_meta').upsert({
            user_id: userId,
            leech_words: items,
            mnemonic_notes: existing?.mnemonic_notes || getMnemonicNotes(),
            updated_at: Date.now(),
          });
        })()
      ).catch(() => {});
    }
  } catch {}
}

export async function fetchMasteredWords(): Promise<CourseWord[]> {
  try {
    await syncStudentQuestProgress();
  } catch {}

  const masteredIds = new Set<string>();
  const scopedKey = getQuestStorageKey();

  // 1. Ambil dari localStorage terisolasi per siswa (sudah disinkronkan)
  try {
    const rawLocal = localStorage.getItem(scopedKey);
    if (rawLocal) {
      const localMap = JSON.parse(rawLocal);
      for (const [id, item] of Object.entries(localMap) as any) {
        if (
          item.stage === 'production' ||
          item.stage === 'recognition' ||
          item.due_date === '9999-12-31' ||
          (item.review_count && item.review_count >= 1)
        ) {
          masteredIds.add(id);
        }
      }
    }
  } catch {}

  // 2. Ambil dari SQLite jika ada
  try {
    const rows = await selectSql<{ id: string; stage: string; review_count?: number }>(
      `SELECT id, stage, review_count FROM chinese_program_progress WHERE stage IN ('production', 'recognition') OR due_date = '9999-12-31' OR review_count >= 1;`
    );
    rows.forEach((r) => masteredIds.add(r.id));
  } catch {}

  // 3. Fallback legacy jika ada
  try {
    const legacyRaw = localStorage.getItem('omnilife_quest_progress');
    if (legacyRaw) {
      const legacyMap = JSON.parse(legacyRaw);
      for (const [id, item] of Object.entries(legacyMap) as any) {
        if (
          item.stage === 'production' ||
          item.stage === 'recognition' ||
          item.due_date === '9999-12-31' ||
          (item.review_count && item.review_count >= 1)
        ) {
          masteredIds.add(id);
        }
      }
    }
  } catch {}

  return course.words.filter((w) => masteredIds.has(w.id) || masteredIds.has(w.hanzi));
}

// ── Drill Aksara Mirip (Tone, Radical, Visual) ──────────────────────────

export type DrillKind = 'tone' | 'radical' | 'visual';

function sharedCharactersCount(a: string, b: string): number {
  const sa = Array.from(a);
  const sb = new Set(Array.from(b));
  return sa.filter((c) => sb.has(c)).length;
}

export function getSimilarDistractors(
  target: CourseWord,
  pool: CourseWord[],
  kind: DrillKind,
  count = 3
): CourseWord[] {
  const candidates = pool.filter((w) => w.id !== target.id && w.hanzi !== target.hanzi);
  let ranked: { word: CourseWord; score: number }[] = [];

  if (kind === 'tone') {
    // Pinyin base sama, tapi nada berbeda
    const targetBase = target.pinyinNum.replace(/[1-5]/g, '').trim().toLowerCase();
    ranked = candidates.map((w) => {
      const wBase = w.pinyinNum.replace(/[1-5]/g, '').trim().toLowerCase();
      const sameSound = targetBase && wBase === targetBase;
      return { word: w, score: sameSound ? 10 : 0 };
    });
  } else if (kind === 'visual') {
    // Memiliki karakter yang mirip / berbagi aksara
    ranked = candidates.map((w) => ({
      word: w,
      score: sharedCharactersCount(target.hanzi, w.hanzi),
    }));
  } else {
    // Radical / kategori sama
    ranked = candidates.map((w) => ({
      word: w,
      score: w.pos === target.pos ? 2 : 1,
    }));
  }

  ranked.sort((a, b) => b.score - a.score || Math.random() - 0.5);
  const selected = ranked.filter((r) => r.score > 0).slice(0, count).map((r) => r.word);

  // Jika kurang, lengkapi dengan kata acak
  if (selected.length < count) {
    const remaining = candidates.filter((w) => !selected.some((s) => s.id === w.id));
    while (selected.length < count && remaining.length > 0) {
      const randIdx = Math.floor(Math.random() * remaining.length);
      selected.push(remaining.splice(randIdx, 1)[0]);
    }
  }

  return selected;
}

// ── Record Quest Word SRS Review ────────────────────────────────────────

export async function recordQuestWordReview(
  word: CourseWord,
  rating: 'again' | 'hard' | 'good' | 'easy'
): Promise<void> {
  const now = new Date();
  let nextDays = 1;

  if (rating === 'again') {
    nextDays = 0;
    addLeechRecord(word, 1);
  } else if (rating === 'hard') {
    nextDays = 1;
  } else if (rating === 'good') {
    nextDays = 3;
  } else if (rating === 'easy') {
    nextDays = 7;
  }

  const nextDue = new Date(now.getTime() + nextDays * 24 * 60 * 60 * 1000);
  const nextDueStr = nextDue.toISOString().slice(0, 10);
  const stage = rating === 'easy' ? 'production' : rating === 'good' ? 'recognition' : 'learning';
  const userId = getActiveUserId();

  // 1. Simpan ke localStorage per siswa
  const scopedKey = getQuestStorageKey();
  let nextReviewCount = 1;
  const updateTimestamp = Date.now();
  try {
    const rawLocal = localStorage.getItem(scopedKey);
    const localMap = rawLocal ? JSON.parse(rawLocal) : {};
    const prevCount = localMap[word.id]?.review_count || 0;
    nextReviewCount = prevCount + 1;
    localMap[word.id] = {
      id: word.id,
      word_id: word.id,
      hanzi: word.hanzi,
      stage,
      due_date: nextDueStr,
      review_count: nextReviewCount,
      updated_at: updateTimestamp,
    };
    localStorage.setItem(scopedKey, JSON.stringify(localMap));
  } catch {}

  // 2. Simpan langsung ke Supabase student_quest_progress jika terhubung dan bukan akun tamu
  if (supabase && userId !== 'usr_guest') {
    try {
      await supabase.from('student_quest_progress').upsert({
        user_id: userId,
        word_id: word.id,
        hanzi: word.hanzi,
        stage,
        due_date: nextDueStr,
        review_count: nextReviewCount,
        updated_at: updateTimestamp,
      });

      // Update juga snapshot cadangan di student_quest_meta
      const rawCurrent = localStorage.getItem(scopedKey);
      if (rawCurrent) {
        const fullCurrentMap = JSON.parse(rawCurrent);
        void Promise.resolve(
          supabase.from('student_quest_meta').upsert({
            user_id: userId,
            mnemonic_notes: {
              ...getMnemonicNotes(),
              __quest_progress: fullCurrentMap,
            },
            updated_at: updateTimestamp,
          })
        ).catch(() => {});
      }
    } catch (e: any) {
      console.warn('Supabase quest progress sync warning:', e);
    }
  }

  // 3. Simpan ke SQLite
  try {
    const { executeSql } = await import('@/db/client');
    await executeSql(`
      CREATE TABLE IF NOT EXISTS chinese_program_progress (
        id TEXT PRIMARY KEY,
        stage TEXT NOT NULL DEFAULT 'learning',
        due_date TEXT NOT NULL,
        last_interval INTEGER DEFAULT 1,
        ease_factor REAL DEFAULT 2.5,
        review_count INTEGER DEFAULT 0,
        updated_at INTEGER NOT NULL
      );
    `);

    await executeSql(
      `
      INSERT INTO chinese_program_progress (id, stage, due_date, last_interval, review_count, updated_at)
      VALUES (?, ?, ?, ?, 1, ?)
      ON CONFLICT(id) DO UPDATE SET
        stage = excluded.stage,
        due_date = excluded.due_date,
        last_interval = ?,
        review_count = chinese_program_progress.review_count + 1,
        updated_at = excluded.updated_at;
    `,
      [word.id, stage, nextDueStr, nextDays, Date.now(), nextDays]
    );

    window.dispatchEvent(new CustomEvent('omnilife_db_updated'));
    window.dispatchEvent(new CustomEvent('db_mutation'));
  } catch (err) {
    console.warn('Failed to record quest word review in SQLite:', err);
    window.dispatchEvent(new CustomEvent('omnilife_db_updated'));
    window.dispatchEvent(new CustomEvent('db_mutation'));
  }
}

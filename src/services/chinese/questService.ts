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

export async function fetchOutpostStats(): Promise<Record<number, { total: number; due: number; mastered: number }>> {
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
    const userId = getActiveUserId();

    // 1) Ambil dari Supabase cloud jika tersedia untuk user aktif
    if (supabase) {
      try {
        const { data } = await supabase
          .from('student_quest_progress')
          .select('word_id, stage, due_date, review_count')
          .eq('user_id', userId);
        if (data && data.length > 0) {
          data.forEach((r: any) => {
            progressMap.set(r.word_id, {
              id: r.word_id,
              stage: r.stage,
              due_date: r.due_date,
              review_count: r.review_count,
            });
          });
        }
      } catch {}
    }

    // 2) Ambil dari SQLite jika tersedia
    try {
      const rows = await selectSql<{ id: string; stage: string; due_date: string; review_count?: number }>(
        `SELECT id, stage, due_date, review_count FROM chinese_program_progress;`
      );
      rows.forEach((r) => {
        if (!progressMap.has(r.id)) progressMap.set(r.id, r);
      });
    } catch {}

    // 3) Ambil dari localStorage per-user
    try {
      const scopedKey = getQuestStorageKey();
      let rawLocal = localStorage.getItem(scopedKey);
      // Migrasi data legacy jika user key belum ada tapi ada omnilife_quest_progress lama
      if (!rawLocal && localStorage.getItem('omnilife_quest_progress')) {
        rawLocal = localStorage.getItem('omnilife_quest_progress');
        if (rawLocal) localStorage.setItem(scopedKey, rawLocal);
      }
      if (rawLocal) {
        const localMap = JSON.parse(rawLocal);
        for (const [id, item] of Object.entries(localMap)) {
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
        supabase.from('student_quest_meta').upsert({
          user_id: userId,
          mnemonic_notes: notes,
          updated_at: Date.now(),
        })
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
        supabase.from('student_quest_meta').upsert({
          user_id: userId,
          leech_words: items,
          updated_at: Date.now(),
        })
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
        supabase.from('student_quest_meta').upsert({
          user_id: userId,
          leech_words: items,
          updated_at: Date.now(),
        })
      ).catch(() => {});
    }
  } catch {}
}

export async function fetchMasteredWords(): Promise<CourseWord[]> {
  const masteredIds = new Set<string>();
  const userId = getActiveUserId();

  // 1. Ambil dari Supabase cloud untuk siswa aktif
  if (supabase) {
    try {
      const { data } = await supabase
        .from('student_quest_progress')
        .select('word_id, stage, due_date, review_count')
        .eq('user_id', userId);
      if (data && data.length > 0) {
        data.forEach((r: any) => {
          if (
            r.stage === 'production' ||
            r.stage === 'recognition' ||
            r.due_date === '9999-12-31' ||
            (r.review_count && r.review_count >= 1)
          ) {
            masteredIds.add(r.word_id);
          }
        });
      }
    } catch {}
  }

  // 2. Ambil dari SQLite
  try {
    const rows = await selectSql<{ id: string; stage: string; review_count?: number }>(
      `SELECT id, stage, review_count FROM chinese_program_progress WHERE stage IN ('production', 'recognition') OR due_date = '9999-12-31' OR review_count >= 1;`
    );
    rows.forEach((r) => masteredIds.add(r.id));
  } catch {}

  // 3. Ambil dari localStorage terisolasi per siswa
  try {
    const scopedKey = getQuestStorageKey();
    let rawLocal = localStorage.getItem(scopedKey);
    if (!rawLocal && localStorage.getItem('omnilife_quest_progress')) {
      rawLocal = localStorage.getItem('omnilife_quest_progress');
    }
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
  try {
    const scopedKey = getQuestStorageKey();
    const rawLocal = localStorage.getItem(scopedKey);
    const localMap = rawLocal ? JSON.parse(rawLocal) : {};
    const prevCount = localMap[word.id]?.review_count || 0;
    localMap[word.id] = {
      id: word.id,
      hanzi: word.hanzi,
      stage,
      due_date: nextDueStr,
      review_count: prevCount + 1,
      updated_at: Date.now(),
    };
    localStorage.setItem(scopedKey, JSON.stringify(localMap));
  } catch {}

  // 2. Simpan ke Supabase student_quest_progress jika terhubung dan bukan akun tamu
  if (supabase && userId !== 'usr_guest') {
    try {
      void Promise.resolve(
        supabase.from('student_quest_progress').upsert({
          user_id: userId,
          word_id: word.id,
          hanzi: word.hanzi,
          stage,
          due_date: nextDueStr,
          review_count: 1,
          updated_at: Date.now(),
        })
      ).catch((e: any) => console.warn('Supabase quest progress sync warning:', e));
    } catch {}
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

import { course } from '@/data/course';
import type { CourseWord } from '@/data/course.types';
import { meaningOf } from '@/data/course.types';
import { selectSql } from '@/db/client';

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

const STORAGE_MNEMONICS_KEY = 'omnilife_mnemonics';
const STORAGE_LEECH_KEY = 'omnilife_leeches';

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

    // 1) Ambil dari SQLite jika tersedia
    try {
      const rows = await selectSql<{ id: string; stage: string; due_date: string; review_count?: number }>(
        `SELECT id, stage, due_date, review_count FROM chinese_program_progress;`
      );
      rows.forEach((r) => progressMap.set(r.id, r));
    } catch {}

    // 2) Ambil dari localStorage (offline/browser fallback)
    try {
      const rawLocal = localStorage.getItem('omnilife_quest_progress');
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
    const raw = localStorage.getItem(STORAGE_MNEMONICS_KEY);
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
    localStorage.setItem(STORAGE_MNEMONICS_KEY, JSON.stringify(notes));
  } catch {}
}

export function getLeechItems(): LeechItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_LEECH_KEY);
    const list: LeechItem[] = raw ? JSON.parse(raw) : [];
    const notes = getMnemonicNotes();
    return list.map((item) => ({ ...item, note: notes[item.wordId] || item.note || '' }));
  } catch {
    return [];
  }
}

export function addLeechRecord(word: CourseWord, fails: number = 3): void {
  try {
    const items = getLeechItems();
    const existingIdx = items.findIndex((i) => i.wordId === word.id || i.hanzi === word.hanzi);
    const notes = getMnemonicNotes();

    const entry: LeechItem = {
      id: `leech_${word.id}`,
      wordId: word.id,
      hanzi: word.hanzi,
      pinyin: word.pinyin,
      meaning: meaningOf(word),
      level: parseInt(word.level, 10) || 1,
      fails: existingIdx >= 0 ? items[existingIdx].fails + 1 : fails,
      note: notes[word.id] || '',
      updatedAt: Date.now(),
    };

    if (existingIdx >= 0) {
      items[existingIdx] = entry;
    } else {
      items.unshift(entry);
    }

    localStorage.setItem(STORAGE_LEECH_KEY, JSON.stringify(items));
  } catch {}
}

export function removeLeechRecord(wordId: string): void {
  try {
    const items = getLeechItems().filter((i) => i.wordId !== wordId && i.id !== wordId);
    localStorage.setItem(STORAGE_LEECH_KEY, JSON.stringify(items));
  } catch {}
}

export async function fetchMasteredWords(): Promise<CourseWord[]> {
  const masteredIds = new Set<string>();

  try {
    const rows = await selectSql<{ id: string; stage: string; review_count?: number }>(
      `SELECT id, stage, review_count FROM chinese_program_progress WHERE stage IN ('production', 'recognition') OR due_date = '9999-12-31' OR review_count >= 1;`
    );
    rows.forEach((r) => masteredIds.add(r.id));
  } catch {}

  try {
    const rawLocal = localStorage.getItem('omnilife_quest_progress');
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
    addLeechRecord(word);
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

  // Simpan juga ke localStorage agar progres selalu instan terbaca di web browser
  try {
    const rawLocal = localStorage.getItem('omnilife_quest_progress');
    const localMap = rawLocal ? JSON.parse(rawLocal) : {};
    localMap[word.id] = {
      id: word.id,
      hanzi: word.hanzi,
      stage,
      due_date: nextDueStr,
      review_count: (localMap[word.id]?.review_count || 0) + 1,
      updated_at: Date.now(),
    };
    localStorage.setItem('omnilife_quest_progress', JSON.stringify(localMap));
  } catch {}

  try {
    const { executeSql } = await import('@/db/client');
    // Ensure table exists
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

    // Trigger update notification
    window.dispatchEvent(new CustomEvent('omnilife_db_updated'));
    window.dispatchEvent(new CustomEvent('db_mutation'));
  } catch (err) {
    console.warn('Failed to record quest word review in SQLite:', err);
    // Masih kirim notifikasi karena localStorage sudah berhasil disimpan
    window.dispatchEvent(new CustomEvent('omnilife_db_updated'));
    window.dispatchEvent(new CustomEvent('db_mutation'));
  }
}

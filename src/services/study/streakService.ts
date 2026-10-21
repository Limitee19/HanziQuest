import { selectSql, executeSql } from '@/db/client';
import { autoSyncRecordToSupabase } from '../sync/syncService';

/**
 * Study Streak Engine
 * ───────────────────
 * The streak counts DAYS on which the user actually did a study activity
 * (flashcard review, hanzi practice, etc.), NOT a synthetic formula.
 *
 * Rules:
 *  - +1 on the first study activity of a calendar day.
 *  - Day boundaries follow WIB (Asia/Jakarta, UTC+7), reset at 00:00 WIB.
 *  - Continuous: if a full WIB day is missed (yesterday has no activity while
 *    today already started), the streak drops back to 0 and starts fresh.
 *
 * Persistence lives in `app_metadata` (synced to Supabase), so desktop and
 * Android share the same streak through cloud sync.
 */

const KEY_LAST_DAY = 'study_streak_last_day';      // YYYY-MM-DD (WIB) of last activity
const KEY_STREAK = 'study_streak_current';         // current streak length
const KEY_BEST = 'study_streak_best';              // best streak ever
const KEY_TOTAL_DAYS = 'study_streak_total_days';  // total active study days

/** Current calendar date in WIB (Asia/Jakarta, UTC+7) as YYYY-MM-DD. */
export function getWibDateStr(now: Date = new Date()): string {
  const wib = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  return wib.toISOString().slice(0, 10);
}

async function readMeta(key: string, fallback: string): Promise<string> {
  try {
    const rows = await selectSql<any>(`SELECT value FROM app_metadata WHERE key = ?;`, [key]);
    return rows && rows.length > 0 ? String(rows[0].value) : fallback;
  } catch {
    return fallback;
  }
}

async function upsertMeta(key: string, value: string): Promise<void> {
  const now = new Date().toISOString();
  await executeSql(
    `INSERT INTO app_metadata (key, value, created_at, updated_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at;`,
    [key, value, now, now]
  );
  try {
    await autoSyncRecordToSupabase('app_metadata', { key, value, updated_at: now }, 'upsert');
  } catch {
    // Sync is best-effort; local streak still works offline.
  }
}

export interface StudyStreak {
  currentStreak: number;
  bestStreak: number;
  totalActiveDays: number;
  activeToday: boolean;
  lastActiveDay: string | undefined; // YYYY-MM-DD WIB
}

export async function fetchStudyStreak(): Promise<StudyStreak> {
  const today = getWibDateStr();
  const [lastDay, currentRaw, bestRaw, totalRaw] = await Promise.all([
    readMeta(KEY_LAST_DAY, ''),
    readMeta(KEY_STREAK, '0'),
    readMeta(KEY_BEST, '0'),
    readMeta(KEY_TOTAL_DAYS, '0'),
  ]);

  const current = parseInt(currentRaw, 10) || 0;
  const best = parseInt(bestRaw, 10) || 0;
  const total = parseInt(totalRaw, 10) || 0;

  // The stored streak is only valid if the last active day is today OR yesterday (WIB).
  // Otherwise a full day was missed and the streak has reset to 0.
  const activeToday = lastDay === today;
  const activeYesterday = lastDay === getWibDateStr(new Date(Date.now() - 24 * 60 * 60 * 1000));
  const effectiveCurrent = activeToday || activeYesterday ? current : 0;

  return {
    currentStreak: effectiveCurrent,
    bestStreak: best,
    totalActiveDays: total,
    activeToday,
    lastActiveDay: lastDay || undefined,
  };
}

/**
 * Record one study activity (call on every reviewed card / completed practice).
 * The +1 day increment happens only on the FIRST activity of the WIB day.
 */
export async function recordStudyActivity(): Promise<void> {
  const today = getWibDateStr();
  const lastDay = await readMeta(KEY_LAST_DAY, '');

  if (lastDay === today) return; // already counted today — nothing to do

  const yesterday = getWibDateStr(new Date(Date.now() - 24 * 60 * 60 * 1000));
  const [currentRaw, bestRaw, totalRaw] = await Promise.all([
    readMeta(KEY_STREAK, '0'),
    readMeta(KEY_BEST, '0'),
    readMeta(KEY_TOTAL_DAYS, '0'),
  ]);

  const previous = parseInt(currentRaw, 10) || 0;
  const best = parseInt(bestRaw, 10) || 0;
  const total = parseInt(totalRaw, 10) || 0;

  // Continuous only if the previous active day was yesterday; otherwise restart at 1
  const nextStreak = lastDay === yesterday ? previous + 1 : 1;
  const nextBest = Math.max(best, nextStreak);

  await Promise.all([
    upsertMeta(KEY_LAST_DAY, today),
    upsertMeta(KEY_STREAK, String(nextStreak)),
    upsertMeta(KEY_BEST, String(nextBest)),
    upsertMeta(KEY_TOTAL_DAYS, String(total + 1)),
  ]);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('omnilife_db_updated', { detail: { table: 'app_metadata', action: 'update' } }));
  }
}

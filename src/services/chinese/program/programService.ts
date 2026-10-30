// ====================================================================
// OmniLife Chinese — Program Harian: Mesin Kurikulum + SRS Bertangga
//
// Mesin TERPISAH dari Anki (opsi B): punya penjadwal & tabel sendiri.
// Alur satu kata: kenalan (kartu pengenalan) → kenali (recognition)
// → ingat (recall) → kuasai (game Arena) → produksi (susun kalimat).
//
// Tangga interval (jawaban BENAR):
//   new → recognition D+1 → recall D+3 → mastery D+7
//       → production D+14 → ulang D+30 → LULUS (graduated)
// Jawaban SALAH: reset D+1, stage turun 1, lapses++, streak kata = 0.
//
// Hari bolong: ulangan menumpuk sebagai "utang ulasan" (due_date lewat
// tetap muncul sampai dibayar) — tanpa penalti, cukup saran kurangi
// target kata baru.
// ====================================================================
import { executeSql, selectSql } from '@/db/client';
import type { ChineseWord } from '@/services/chinese/chineseDataset';
import type { GameSentence } from '@/services/chinese/games/gameService';
import { tokenizeSentence } from '@/services/chinese/games/gameService';
import { getCurriculumOrder, getCurriculumWord } from './curriculumOrder';
import { getActiveUserId } from '@/services/auth/classAuthService';
import { rawIdFromScopedRowId, scopedPrefKey, scopedRowId } from '@/services/auth/accountScope';
import { supabase } from '@/services/sync/supabaseClient';

// ── Tipe ────────────────────────────────────────────────────────────────

export type ProgramStage = 'new' | 'recognition' | 'recall' | 'mastery' | 'production';

export interface ProgramProgress {
  id: string; // = wordId mentah (row-id SQLite berprefiks `${uid}::${wordId}`)
  order_index: number;
  stage: ProgramStage;
  interval_days: number;
  /** YYYY-MM-DD. '9999-12-31' = sudah lulus (graduated). */
  due_date: string;
  streak: number;
  lapses: number;
  introduced_on: string | null;
  last_reviewed_at: string | null;
}

export interface ProgramSettings {
  daily_new_target: number;
  program_started_on: string | null;
  streak_days: number;
  last_completed_on: string | null;
}

export type QuizMode = 'meaning' | 'reverse' | 'listen';

export type SessionItem =
  | { kind: 'intro'; progressId: string; word: ChineseWord }
  | { kind: 'quiz'; mode: QuizMode; progressId: string; word: ChineseWord }
  | { kind: 'mastery'; progressId: string; word: ChineseWord }
  | { kind: 'production'; progressId: string; word: ChineseWord; sentence: GameSentence };

export interface DailyPlan {
  date: string;
  started: boolean;
  /** Kartu pengenalan (dipelajari dulu, tidak dinilai). */
  items: SessionItem[];
  newCount: number;
  reviewCount: number;
  /** Ulasan yang melewati tanggalnya (hari bolong) — "utang ulasan". */
  debtCount: number;
}

export interface ProgramSummary {
  started: boolean;
  target: number;
  streakDays: number;
  dueCount: number;
  newDoneTotal: number;
  masteredCount: number;
  debtCount: number;
  totalCurriculum: number;
  /** Prediksi beban ulasan 7 hari ke depan (indeks 0 = hari ini). */
  forecast: { date: string; count: number }[];
}

export interface SessionResult {
  introduced: number;
  reviewed: number;
  correct: number;
  total: number;
  durationSeconds: number;
}

// ── Util tanggal (lokal, YYYY-MM-DD) ────────────────────────────────────

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d + days);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

const GRADUATED_DUE = '9999-12-31';

/**
 * Tangga muncul-ulang kata (jawaban BENAR), ditambatkan ke HARI PENGENALAN
 * (introduced_on) sesuai desain: recognition muncul D+1, recall D+3,
 * mastery D+7, production D+14, lalu ulang D+30. `interval_days` di baris
 * progress menyimpan offset tangga ini.
 */
const STAGE_LADDER: Record<ProgramStage, { next: ProgramStage; interval: number }> = {
  new: { next: 'recognition', interval: 1 },
  recognition: { next: 'recall', interval: 3 },
  recall: { next: 'mastery', interval: 7 },
  mastery: { next: 'production', interval: 14 },
  production: { next: 'production', interval: 30 },
};

function stageDown(stage: ProgramStage): ProgramStage {
  const order: ProgramStage[] = ['new', 'recognition', 'recall', 'mastery', 'production'];
  const i = order.indexOf(stage);
  return order[Math.max(0, i - 1)];
}

// ── Settings (per-akun: localStorage + snapshot cloud student_quest_meta) ──

const DEFAULT_SETTINGS: ProgramSettings = {
  daily_new_target: 10,
  program_started_on: null,
  streak_days: 0,
  last_completed_on: null,
};

const SETTINGS_LOCAL_BASE = 'omnilife_program_settings';
const SETTINGS_CLOUD_SNAPSHOT_KEY = '__program_settings';

export async function destroyProgramData(userId: string): Promise<void> {
  try {
    localStorage.removeItem(scopedPrefKey(SETTINGS_LOCAL_BASE, userId));
  } catch {}
}

async function pushProgramSnapshotToCloud(
  userId: string,
  settings: ProgramSettings
): Promise<void> {
  if (!supabase || userId === 'usr_guest') return;
  try {
    const { data } = await supabase
      .from('student_quest_meta')
      .select('mnemonic_notes')
      .eq('user_id', userId)
      .maybeSingle();
    const notes: Record<string, any> = { ...(data?.mnemonic_notes || {}) };
    notes[SETTINGS_CLOUD_SNAPSHOT_KEY] = { ...settings, snapshot_at: Date.now() };
    await supabase.from('student_quest_meta').upsert({
      user_id: userId,
      mnemonic_notes: notes,
      updated_at: Date.now(),
    });
  } catch {}
}

async function persistSettings(userId: string, settings: ProgramSettings): Promise<void> {
  try {
    localStorage.setItem(scopedPrefKey(SETTINGS_LOCAL_BASE, userId), JSON.stringify(settings));
  } catch {}
  void Promise.resolve(pushProgramSnapshotToCloud(userId, settings)).catch(() => {});
}

/** Muat settings Program Harian milik akun aktif (fallback: cloud → legacy SQLite). */
export async function loadSettings(): Promise<ProgramSettings> {
  const userId = getActiveUserId();
  let settings: ProgramSettings | null = null;

  // 1. localStorage scoped-per-akun (sumber utama)
  try {
    const raw = localStorage.getItem(scopedPrefKey(SETTINGS_LOCAL_BASE, userId));
    if (raw) settings = JSON.parse(raw);
  } catch {}

  // 2. Snapshot cloud milik akun (HP ↔ PC sinkron)
  if (!settings && supabase && userId !== 'usr_guest') {
    try {
      const { data } = await supabase
        .from('student_quest_meta')
        .select('mnemonic_notes')
        .eq('user_id', userId)
        .maybeSingle();
      const snap = data?.mnemonic_notes?.[SETTINGS_CLOUD_SNAPSHOT_KEY];
      if (snap?.program_started_on) {
        settings = {
          daily_new_target: snap.daily_new_target ?? 10,
          program_started_on: snap.program_started_on ?? null,
          streak_days: snap.streak_days ?? 0,
          last_completed_on: snap.last_completed_on ?? null,
        };
      }
    } catch {}
  }

  // 3. Legacy global SQLite row id=1 (data lama device — diadopsi ke akun aktif)
  if (!settings) {
    try {
      const rows = await selectSql<any>(
        'SELECT * FROM chinese_program_settings WHERE id = 1 LIMIT 1;'
      );
      if (rows.length > 0) {
        const r = rows[0];
        settings = {
          daily_new_target: r.daily_new_target ?? 10,
          program_started_on: r.program_started_on ?? null,
          streak_days: r.streak_days ?? 0,
          last_completed_on: r.last_completed_on ?? null,
        };
      }
    } catch {}
  }

  if (!settings) return { ...DEFAULT_SETTINGS };

  // Adopt: simpan sebagai milik akun aktif agar tidak dibaca ulang tiap kali
  if (settings.program_started_on || settings.streak_days > 0 || settings.last_completed_on) {
    void persistSettings(userId, settings);
  }
  return settings;
}

/** Mulai program: simpan target harian + tanggal mulai (hari ini). */
export async function startProgram(dailyNewTarget: number): Promise<void> {
  const userId = getActiveUserId();
  const settings = await loadSettings();
  const next: ProgramSettings = {
    ...settings,
    daily_new_target: dailyNewTarget,
    program_started_on: todayISO(),
  };
  await persistSettings(userId, next);
  void Promise.resolve(pushProgramSnapshotToCloud(userId, next)).catch(() => {});
}

export async function updateDailyTarget(dailyNewTarget: number): Promise<void> {
  const userId = getActiveUserId();
  const settings = await loadSettings();
  const next: ProgramSettings = { ...settings, daily_new_target: dailyNewTarget };
  await persistSettings(userId, next);
}

// ── Progress rows (per-akun: row id `${uid}::${wordId}`) ────────────────

async function loadAllProgress(): Promise<ProgramProgress[]> {
  const userId = getActiveUserId();
  const rows = await selectSql<any>(
    `SELECT * FROM chinese_program_progress WHERE user_id = ? AND (source IS NULL OR source = '' OR source = 'program') ORDER BY order_index ASC;`,
    [userId]
  );
  return rows.map((r) => ({
    id: r.word_id || rawIdFromScopedRowId(r.id),
    order_index: r.order_index ?? 0,
    stage: (r.stage || 'new') as ProgramStage,
    interval_days: r.interval_days ?? 1,
    due_date: r.due_date || GRADUATED_DUE,
    streak: r.streak ?? 0,
    lapses: r.lapses ?? 0,
    introduced_on: r.introduced_on ?? null,
    last_reviewed_at: r.last_reviewed_at ?? null,
  }));
}

async function insertProgress(wordId: string, orderIndex: number, today: string): Promise<void> {
  const userId = getActiveUserId();
  const now = new Date().toISOString();
  // due_date = hari pengenalan: bila sesi ditinggal setelah kartu pengenalan,
  // kata tetap muncul lagi (tidak hilang) pada rencana berikutnya.
  await executeSql(
    `INSERT OR REPLACE INTO chinese_program_progress
     (id, user_id, word_id, order_index, stage, interval_days, due_date, streak, lapses, introduced_on, last_reviewed_at, source, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'new', 1, ?, 0, 0, ?, ?, 'program', ?, ?);`,
    [
      scopedRowId(wordId),
      userId,
      wordId,
      orderIndex,
      today,
      today,
      null,
      now,
      now,
    ]
  );
}

// ── Rencana harian ──────────────────────────────────────────────────────

/** Pilih bentuk latihan sesuai stage — makin tinggi tangga, makin produktif. */
function makeReviewItem(progressId: string, word: ChineseWord, stage: ProgramStage): SessionItem {
  if (stage === 'mastery') return { kind: 'mastery', progressId, word };
  if (stage === 'production') {
    const s = word.exampleSentences?.[0];
    const parsed = s ? tokenizeSentence(`${word.id}_p`, s.hanzi, s.pinyin, s.meaning) : null;
    if (parsed) return { kind: 'production', progressId, word, sentence: parsed };
    return { kind: 'quiz', mode: 'reverse', progressId, word };
  }
  if (stage === 'recall') return { kind: 'quiz', mode: 'reverse', progressId, word };
  // recognition & new: campur kenali arti & kuis dengar.
  return Math.random() < 0.3
    ? { kind: 'quiz', mode: 'listen', progressId, word }
    : { kind: 'quiz', mode: 'meaning', progressId, word };
}

/**
 * Susun rencana sesi untuk `date` (default hari ini):
 * kartu pengenalan dulu, lalu campuran latihan (kata baru hari ini +
 * semua ulasan yang jatuh tempo, termasuk utang hari bolong).
 */
export async function getDailyPlan(date?: string): Promise<DailyPlan> {
  const day = date || todayISO();
  const settings = await loadSettings();
  const empty: DailyPlan = {
    date: day,
    started: Boolean(settings.program_started_on),
    items: [],
    newCount: 0,
    reviewCount: 0,
    debtCount: 0,
  };
  if (!settings.program_started_on) return empty;

  const [progress, curriculum] = await Promise.all([loadAllProgress(), Promise.resolve(getCurriculumOrder())]);
  const progressById = new Map(progress.map((p) => [p.id, p]));
  const introducedToday = progress.filter((p) => p.introduced_on === day);
  const newQuota = Math.max(0, settings.daily_new_target - introducedToday.length);

  // Kata baru berikutnya dari kurikulum (yang belum punya progress).
  const newEntries = curriculum
    .filter((e) => !progressById.has(e.wordId))
    .slice(0, newQuota);

  // Ulasan: semua kata yang due_date ≤ hari ini (termasuk utang hari bolong).
  // Stage 'new' tetap disertakan — kata yang kuis pertamanya salah pun harus
  // muncul lagi besok (jangan sampai hilang dari radar).
  const dueRows = progress.filter(
    (p) => p.due_date <= day && p.due_date !== GRADUATED_DUE
  );
  const debtCount = dueRows.filter((p) => p.due_date < day).length;

  const items: SessionItem[] = [];

  // 1) Kartu pengenalan kata baru (urutan kurikulum).
  for (const e of newEntries) {
    const word = getCurriculumWord(e.wordId);
    if (word) items.push({ kind: 'intro', progressId: e.wordId, word });
  }

  // 2) Kuis pertama untuk kata baru hari ini (kenalan → kenali).
  for (const e of newEntries) {
    const word = getCurriculumWord(e.wordId);
    if (word) items.push({ kind: 'quiz', mode: 'meaning', progressId: e.wordId, word });
  }

  // 3) Campuran ulasan yang jatuh tempo (acak agar tidak monoton).
  const reviewItems: SessionItem[] = [];
  for (const p of dueRows) {
    const word = getCurriculumWord(p.id);
    if (word) reviewItems.push(makeReviewItem(p.id, word, p.stage));
  }
  for (let i = reviewItems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [reviewItems[i], reviewItems[j]] = [reviewItems[j], reviewItems[i]];
  }
  items.push(...reviewItems);

  return {
    date: day,
    started: true,
    items,
    newCount: newEntries.length,
    reviewCount: dueRows.length,
    debtCount,
  };
}

/** Catat satu kata baru sebagai "diperkenalkan hari ini" (dipanggil saat kartu pengenalan selesai). */
export async function introduceWord(progressId: string, date?: string): Promise<void> {
  const entry = getCurriculumOrder().find((e) => e.wordId === progressId);
  await insertProgress(progressId, entry?.orderIndex ?? 0, date || todayISO());
}

// ── Jawaban & penjadwalan ───────────────────────────────────────────────

/**
 * Catat jawaban satu kata & majukan/reset tangga SRS-nya.
 * Benar  → naik stage, due = D + interval tangga.
 * Salah  → reset D+1, stage turun 1, lapses++, streak kata = 0.
 * Lulus  → production benar saat interval sudah 30 → graduated.
 */
export async function answer(progressId: string, correct: boolean, date?: string): Promise<void> {
  const day = date || todayISO();
  const userId = getActiveUserId();
  const rowPk = scopedRowId(progressId);
  const rows = await selectSql<any>(
    'SELECT * FROM chinese_program_progress WHERE id = ? LIMIT 1;',
    [rowPk]
  );
  if (rows.length === 0) return;
  const row = rows[0];
  const stage: ProgramStage = row.stage || 'new';
  const now = new Date().toISOString();
  const graduated = row.due_date === GRADUATED_DUE;

  let nextStage: ProgramStage;
  let nextInterval: number;
  let nextDue: string;
  let nextStreak: number;
  let lapses: number = row.lapses ?? 0;

  if (correct) {
    if (graduated) {
      // Sudah lulus — jawaban benar hanya menyegarkan streak kata.
      nextStage = 'production';
      nextInterval = 30;
      nextDue = GRADUATED_DUE;
      nextStreak = (row.streak ?? 0) + 1;
    } else if (stage === 'production' && (row.interval_days ?? 0) >= 30) {
      // Ulang D+30 benar → LULUS.
      nextStage = 'production';
      nextInterval = 9999;
      nextDue = GRADUATED_DUE;
      nextStreak = (row.streak ?? 0) + 1;
    } else if (stage === 'production' && (row.interval_days ?? 0) >= 14) {
      // Production pertama benar (D+14) → jadwal ulang D+30 dari pengenalan.
      nextStage = 'production';
      nextInterval = 30;
      const anchor = row.introduced_on || day;
      nextDue = addDaysISO(anchor, 30);
      if (nextDue <= day) nextDue = addDaysISO(day, 30);
      nextStreak = (row.streak ?? 0) + 1;
    } else {
      // Naik tangga: due ditambatkan ke hari pengenalan (D+1/D+3/D+7/D+14).
      // Ulang produksi (production → production) pakai offset 30.
      const step = STAGE_LADDER[stage];
      nextStage = step.next;
      nextInterval = step.interval;
      const anchor = row.introduced_on || day;
      nextDue = addDaysISO(anchor, step.interval);
      if (nextDue <= day) nextDue = addDaysISO(day, 1); // review sangat terlambat → drill besok
      nextStreak = (row.streak ?? 0) + 1;
    }
  } else {
    nextStage = graduated ? 'production' : stageDown(stage);
    nextInterval = 1;
    nextDue = addDaysISO(day, 1);
    nextStreak = 0;
    lapses = (row.lapses ?? 0) + 1;
  }

  await executeSql(
    `UPDATE chinese_program_progress
     SET stage = ?, interval_days = ?, due_date = ?, streak = ?, lapses = ?, last_reviewed_at = ?, updated_at = ?
     WHERE id = ? AND user_id = ?;`,
    [nextStage, nextInterval, nextDue, nextStreak, lapses, now, now, rowPk, userId]
  );
}

// ── Akhir sesi: log + streak harian ─────────────────────────────────────

export async function completeSession(result: SessionResult, date?: string): Promise<void> {
  const day = date || todayISO();
  const now = new Date().toISOString();
  const userId = getActiveUserId();

  await executeSql(
    `INSERT OR REPLACE INTO chinese_program_log
     (id, user_id, log_date, words_introduced, words_reviewed, accuracy, duration_seconds, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      `plog_${userId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      userId,
      day,
      result.introduced,
      result.reviewed,
      result.total > 0 ? result.correct / result.total : 0,
      result.durationSeconds,
      now,
    ]
  );

  // Streak program: naik bila kemarin juga selesai, reset bila bolong.
  const settings = await loadSettings();
  if (settings.last_completed_on === day) return; // sesi kedua di hari sama — streak tetap
  const yesterday = addDaysISO(day, -1);
  const nextStreak = settings.last_completed_on === yesterday ? settings.streak_days + 1 : 1;
  await persistSettings(userId, {
    ...settings,
    streak_days: nextStreak,
    last_completed_on: day,
  });
}

// ── Ringkasan program ───────────────────────────────────────────────────

export async function getProgramSummary(date?: string): Promise<ProgramSummary> {
  const day = date || todayISO();
  const [settings, progress, curriculum] = await Promise.all([
    loadSettings(),
    loadAllProgress(),
    Promise.resolve(getCurriculumOrder()),
  ]);

  const active = progress.filter((p) => p.due_date !== GRADUATED_DUE);
  const dueRows = active.filter((p) => p.due_date <= day);
  const debtCount = dueRows.filter((p) => p.due_date < day).length;

  const forecast = Array.from({ length: 7 }, (_, i) => {
    const d = addDaysISO(day, i);
    return { date: d, count: active.filter((p) => p.due_date === d).length };
  });

  return {
    started: Boolean(settings.program_started_on),
    target: settings.daily_new_target,
    streakDays: settings.streak_days,
    dueCount: dueRows.length,
    newDoneTotal: progress.length,
    masteredCount: progress.filter((p) => p.due_date === GRADUATED_DUE).length,
    debtCount,
    totalCurriculum: curriculum.length,
    forecast,
  };
}

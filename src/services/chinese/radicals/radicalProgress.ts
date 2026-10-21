import { executeSql, selectSql } from '@/db/client';

/**
 * Preferensi & progres fitur Radikal.
 * ─────────────────────────────────────────────
 * Disimpan di tabel `app_metadata` (ikut tersinkron ke Supabase), sehingga
 * pilihan mode dan progres kuis tidak reset antar sesi maupun antar device.
 */

export type RadicalIndexMode = 'strokes' | 'learning';

const MODE_KEY = 'radical_index_mode';
const QUIZ_KEY = 'radical_quiz_unlocked';

const CJK_RE = /[\u4e00-\u9fff]/;

async function readMeta(key: string): Promise<string | null> {
  const rows = await selectSql<{ value: string }>(
    `SELECT value FROM app_metadata WHERE key = ? LIMIT 1;`,
    [key]
  );
  return rows && rows.length > 0 ? rows[0].value : null;
}

async function upsertMeta(key: string, value: string): Promise<void> {
  const now = new Date().toISOString();
  const existing = await selectSql<any>(`SELECT key FROM app_metadata WHERE key = ? LIMIT 1;`, [key]);
  if (existing && existing.length > 0) {
    await executeSql(`UPDATE app_metadata SET value = ?, updated_at = ? WHERE key = ?;`, [value, now, key]);
  } else {
    await executeSql(
      `INSERT INTO app_metadata (key, value, created_at, updated_at) VALUES (?, ?, ?, ?);`,
      [key, value, now, now]
    );
  }
}

// ── Mode indeks (goresan / urutan belajar) ─────────────────────────────────

export async function loadRadicalIndexMode(): Promise<RadicalIndexMode> {
  try {
    const v = await readMeta(MODE_KEY);
    return v === 'learning' ? 'learning' : 'strokes';
  } catch {
    return 'strokes';
  }
}

export async function saveRadicalIndexMode(mode: RadicalIndexMode): Promise<void> {
  await upsertMeta(MODE_KEY, mode);
}

// ── Tier kuis yang sudah terbuka ────────────────────────────────────────────

export async function loadQuizUnlockedTier(): Promise<number> {
  try {
    const v = await readMeta(QUIZ_KEY);
    const n = v ? parseInt(v, 10) : NaN;
    return Number.isFinite(n) && n >= 1 && n <= 3 ? n : 1;
  } catch {
    return 1;
  }
}

export async function saveQuizUnlockedTier(tier: number): Promise<void> {
  await upsertMeta(QUIZ_KEY, String(Math.max(1, Math.min(3, tier))));
}

// ── Hanzi yang sudah dikuasai ───────────────────────────────────────────────

/**
 * Set karakter yang kartu flashcard-nya sudah mencapai status `mastered`
 * (SRS Anki). Karakter diekstrak dari isi depan/belakang kartu, sehingga
 * kartu custom Anki (di luar dataset HSK) tetap terhitung selama karakternya
 * dikenali indeks radikal.
 */
export async function getMasteredHanziSet(): Promise<Set<string>> {
  const out = new Set<string>();
  try {
    const rows = await selectSql<{ front_content: string; back_content: string }>(
      `SELECT front_content, back_content FROM flashcard_cards WHERE study_status = 'mastered';`
    );
    for (const row of rows) {
      for (const text of [row.front_content, row.back_content]) {
        if (!text) continue;
        for (const ch of text) {
          if (CJK_RE.test(ch)) out.add(ch);
        }
      }
    }
  } catch (err) {
    console.warn('Gagal memuat hanzi mastered:', err);
  }
  return out;
}

// ── Riwayat skor kuis ───────────────────────────────────────────────────────

export type QuizScope = 'tier' | 'radical';

export interface QuizScoreRecord {
  scope: QuizScope;
  /** '1'..'3' untuk kuis tier; String(radicalId) untuk kuis per radikal. */
  key: string;
  score: number;
  total: number;
  pct: number;
  /** Epoch ms saat ronde diselesaikan. */
  ts: number;
}

const HISTORY_KEY = 'radical_quiz_history';
const HISTORY_CAP = 120;

function isValidRecord(r: unknown): r is QuizScoreRecord {
  if (!r || typeof r !== 'object') return false;
  const rec = r as Record<string, unknown>;
  return (
    (rec.scope === 'tier' || rec.scope === 'radical') &&
    typeof rec.key === 'string' &&
    typeof rec.score === 'number' &&
    typeof rec.total === 'number' &&
    typeof rec.pct === 'number' &&
    typeof rec.ts === 'number'
  );
}

export async function loadQuizScoreHistory(): Promise<QuizScoreRecord[]> {
  try {
    const v = await readMeta(HISTORY_KEY);
    if (!v) return [];
    const arr = JSON.parse(v);
    return Array.isArray(arr) ? arr.filter(isValidRecord) : [];
  } catch {
    return [];
  }
}

/** Simpan satu hasil ronde kuis; mengembalikan riwayat terbaru. */
export async function addQuizScore(
  rec: Omit<QuizScoreRecord, 'pct' | 'ts'>
): Promise<QuizScoreRecord[]> {
  const entry: QuizScoreRecord = {
    ...rec,
    pct: rec.total > 0 ? Math.round((rec.score / rec.total) * 100) : 0,
    ts: Date.now(),
  };
  const history = await loadQuizScoreHistory();
  const next = [...history, entry].slice(-HISTORY_CAP);
  try {
    await upsertMeta(HISTORY_KEY, JSON.stringify(next));
  } catch (err) {
    console.warn('Gagal menyimpan riwayat skor kuis:', err);
  }
  return next;
}

/** Riwayat satu scope+kunci, urut terbaru-dulu, maksimal `limit` entri. */
export function filterScoreHistory(
  history: QuizScoreRecord[],
  scope: QuizScope,
  key: string,
  limit = 8
): QuizScoreRecord[] {
  return history
    .filter((r) => r.scope === scope && r.key === key)
    .slice(-limit)
    .reverse();
}

// ── SRS: penjadwalan soal yang salah ───────────────────────────────────────

/**
 * Spaced repetition sederhana untuk jawaban yang salah: soal dijadwalkan
 * muncul lagi di ronde berikutnya (10 menit — cukup untuk memulai ronde baru)
 * lalu intervalnya memanjang setiap kali masih salah
 * (10 mnt → 1 hari → 3 hari → 7 hari → 30 hari), dan dihapus begitu
 * dijawab benar.
 */
export type SrsScope = 'radical' | 'hanzi';

export interface WrongAnswerRecord {
  scope: SrsScope;
  /** String(radicalId) untuk kuis tier; karakter hanzi untuk kuis per radikal. */
  key: string;
  /** Interval menit berikutnya sebelum due lagi. */
  intervalMin: number;
  /** Epoch ms kapan item ini due untuk di-review. */
  dueTs: number;
  /** Epoch ms terakhir kali dijawab salah. */
  lastTs: number;
  /** Berapa kali item ini sudah dijawab salah. */
  lapses: number;
}

const SRS_KEY = 'radical_srs_schedule';
const SRS_STEPS_MIN = [10, 24 * 60, 3 * 24 * 60, 7 * 24 * 60, 30 * 24 * 60];

function nextIntervalMinutes(lapses: number): number {
  const idx = Math.min(Math.max(0, lapses - 1), SRS_STEPS_MIN.length - 1);
  return SRS_STEPS_MIN[idx];
}

function isValidSrsRecord(r: unknown): r is WrongAnswerRecord {
  if (!r || typeof r !== 'object') return false;
  const rec = r as Record<string, unknown>;
  return (
    (rec.scope === 'radical' || rec.scope === 'hanzi') &&
    typeof rec.key === 'string' &&
    typeof rec.intervalMin === 'number' &&
    typeof rec.dueTs === 'number' &&
    typeof rec.lastTs === 'number' &&
    typeof rec.lapses === 'number'
  );
}

export async function loadSrsSchedule(): Promise<WrongAnswerRecord[]> {
  try {
    const v = await readMeta(SRS_KEY);
    if (!v) return [];
    const arr = JSON.parse(v);
    return Array.isArray(arr) ? arr.filter(isValidSrsRecord) : [];
  } catch {
    return [];
  }
}

async function saveSrsSchedule(schedule: WrongAnswerRecord[]): Promise<void> {
  try {
    await upsertMeta(SRS_KEY, JSON.stringify(schedule));
  } catch (err) {
    console.warn('Gagal menyimpan jadwal SRS:', err);
  }
}

/** Item salah lagi — majukan intervalnya dan jadwalkan ulang. */
export async function rescheduleWrong(scope: SrsScope, key: string): Promise<WrongAnswerRecord[]> {
  const schedule = await loadSrsSchedule();
  const now = Date.now();
  const existing = schedule.find((r) => r.scope === scope && r.key === key);
  const lapses = (existing?.lapses || 0) + 1;
  const intervalMin = nextIntervalMinutes(lapses);
  const record: WrongAnswerRecord = {
    scope,
    key,
    intervalMin,
    dueTs: now + intervalMin * 60 * 1000,
    lastTs: now,
    lapses,
  };
  const next = existing
    ? schedule.map((r) => (r.scope === scope && r.key === key ? record : r))
    : [...schedule, record];
  await saveSrsSchedule(next);
  return next;
}

/** Item dijawab benar — hapus dari jadwal review. */
export async function clearWrong(scope: SrsScope, key: string): Promise<WrongAnswerRecord[]> {
  const schedule = await loadSrsSchedule();
  const next = schedule.filter((r) => !(r.scope === scope && r.key === key));
  if (next.length !== schedule.length) await saveSrsSchedule(next);
  return next;
}

/** ID/kunci yang sudah jatuh tempo untuk direview sekarang. */
export function dueKeys(schedule: WrongAnswerRecord[], scope: SrsScope, now = Date.now()): Set<string> {
  const out = new Set<string>();
  for (const r of schedule) {
    if (r.scope === scope && r.dueTs <= now) out.add(r.key);
  }
  return out;
}

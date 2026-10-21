// ====================================================================
// OmniLife Chinese Arena — mesin bersama untuk mini-game kosakata.
//
// Semua game memakai dataset HSK 1–3 yang sudah ada (FULL_HSK_DATASET)
// sehingga 100% offline dan konsisten dengan modul lain. Yang disimpan
// di localStorage hanya progres ringan: rekor + peta kata yang sering
// salah (untuk pembobotan Time Attack).
// ====================================================================
import { FULL_HSK_DATASET } from '@/services/chinese/chineseDataset';

// ── Tipe ────────────────────────────────────────────────────────────────

export type GameId = 'memory' | 'timeattack' | 'sentence' | 'expressions';

export interface GameWord {
  id: string;
  hanzi: string;
  pinyin: string;
  /** Arti utama Bahasa Indonesia (tanpa makna gramatikal dalam tanda kurung). */
  meaning: string;
  emoji?: string;
  hskLevel: number;
}

export interface GameSentence {
  id: string;
  /** Kalimat asli lengkap dengan tanda baca. */
  fullHanzi: string;
  fullPinyin: string;
  meaning: string;
  /** Token kata berurutan (tanpa tanda baca) — hasil alignment hanzi ↔ pinyin. */
  tokens: string[];
  /** Pinyin tiap token, sejajar dengan `tokens`. */
  pinyinTokens: string[];
}

export interface BestRecord {
  /** Nilai utama (skor atau jumlah langkah, tergantung game). */
  value: number;
  /** Nilai pendamping, mis. durasi ms untuk Memory Match. */
  secondary?: number;
  date: string;
}

// ── Pool kata ───────────────────────────────────────────────────────────

const MEANING_BLACKLIST = /^[([（]/;

/**
 * Kumpulan kata layak-main: arti Indonesia nyata (bukan keterangan
 * gramatikal seperti "(partikel)") dan tidak mengandung karakter aneh.
 */
export function getGamePool(levels: number[] = [1, 2, 3]): GameWord[] {
  const levelSet = new Set(levels);
  const out: GameWord[] = [];
  const seenHanzi = new Set<string>();

  for (const w of FULL_HSK_DATASET) {
    if (!levelSet.has(w.hskLevel)) continue;
    if (!w.hanzi || !w.pinyin) continue;
    const meaning = (w.meanings?.[0] || '').trim();
    if (!meaning || MEANING_BLACKLIST.test(meaning)) continue;
    if (meaning.length > 34) continue; // arti kepanjangan → opsi ganda terpotong
    if (seenHanzi.has(w.hanzi)) continue;
    seenHanzi.add(w.hanzi);
    out.push({
      id: w.id,
      hanzi: w.hanzi,
      pinyin: w.pinyin,
      meaning,
      emoji: w.emoji,
      hskLevel: w.hskLevel,
    });
  }
  return out;
}

/** Pool unik per-arti — penting untuk opsi ganda (distraktor harus beda arti). */
export function getUniqueMeaningPool(levels: number[] = [1, 2, 3]): GameWord[] {
  const seen = new Set<string>();
  return getGamePool(levels).filter((w) => {
    const key = w.meaning.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ── Utilitas acak ───────────────────────────────────────────────────────

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sampleN<T>(arr: readonly T[], n: number): T[] {
  return shuffle(arr).slice(0, Math.max(0, n));
}

/** Pilih satu item dengan bobot (untuk memunculkan kata yang sering salah). */
export function pickWeighted<T>(items: readonly T[], weightOf: (item: T) => number): T {
  if (items.length === 0) throw new Error('pickWeighted: daftar kosong');
  let total = 0;
  const weights = items.map((it) => {
    const w = Math.max(0.0001, weightOf(it));
    total += w;
    return w;
  });
  let roll = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return items[i];
  }
  return items[items.length - 1];
}

// ── Rekor (localStorage) ────────────────────────────────────────────────

const BEST_KEY_PREFIX = 'omnilife_game_best_v1:';

function bestKey(game: GameId, variant: string): string {
  return `${BEST_KEY_PREFIX}${game}:${variant}`;
}

export function loadBest(game: GameId, variant: string): BestRecord | null {
  try {
    const raw = localStorage.getItem(bestKey(game, variant));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BestRecord;
    if (typeof parsed?.value !== 'number' || !Number.isFinite(parsed.value)) return null;
    return parsed;
  } catch (err) {
    console.warn('Gagal membaca rekor game:', err);
    return null;
  }
}

/**
 * Simpan rekor baru. `lowerIsBetter` dipakai Memory Match (langkah/waktu).
 * Mengembalikan true jika ini rekor baru.
 */
export function saveBest(
  game: GameId,
  variant: string,
  value: number,
  lowerIsBetter: boolean,
  secondary?: number
): boolean {
  const prev = loadBest(game, variant);
  const better = !prev || (lowerIsBetter ? value < prev.value : value > prev.value);
  if (!better) return false;
  const rec: BestRecord = { value, secondary, date: new Date().toISOString() };
  try {
    localStorage.setItem(bestKey(game, variant), JSON.stringify(rec));
  } catch (err) {
    console.warn('Gagal menyimpan rekor game:', err);
    return false;
  }
  return true;
}

// ── Peta kata lemah (untuk pembobotan Time Attack) ──────────────────────

const WEAK_KEY = 'omnilife_game_weak_v1';
const WEAK_CAP = 40;

interface WeakEntry {
  wrong: number;
  right: number;
}

function loadWeakMap(): Record<string, WeakEntry> {
  try {
    const raw = localStorage.getItem(WEAK_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, WeakEntry>) : {};
  } catch (err) {
    console.warn('Gagal membaca peta kata lemah:', err);
    return {};
  }
}

function persistWeakMap(map: Record<string, WeakEntry>): void {
  try {
    localStorage.setItem(WEAK_KEY, JSON.stringify(map));
  } catch (err) {
    console.warn('Gagal menyimpan peta kata lemah:', err);
  }
}

/** Catat hasil jawaban satu kata (dipanggil Time Attack & kuis ungkapan). */
export function recordWordResult(wordId: string, correct: boolean): void {
  const map = loadWeakMap();
  const entry = map[wordId] || { wrong: 0, right: 0 };
  if (correct) {
    entry.right = Math.min(entry.right + 1, WEAK_CAP);
    entry.wrong = Math.max(0, entry.wrong - 1); // pulih perlahan saat sudah benar
  } else {
    entry.wrong = Math.min(entry.wrong + 1, WEAK_CAP);
  }
  map[wordId] = entry;
  persistWeakMap(map);
}

export function getWeakScore(wordId: string): number {
  const entry = loadWeakMap()[wordId];
  return entry ? entry.wrong : 0;
}

export function getWeakWordIds(minWrong = 2): string[] {
  const map = loadWeakMap();
  return Object.entries(map)
    .filter(([, v]) => v.wrong >= minWrong)
    .sort((a, b) => b[1].wrong - a[1].wrong)
    .map(([id]) => id);
}

/** Bobot kemunculan: kata yang sering salah muncul lebih sering. */
export function wordWeight(word: GameWord): number {
  return 1 + Math.min(getWeakScore(word.id) * 1.5, 7);
}

/** Statistik ringkas untuk hub: jumlah kata yang perlu diperkuat. */
export function getWeakStats(): { weakCount: number; trackedCount: number } {
  const map = loadWeakMap();
  const ids = Object.keys(map);
  return {
    weakCount: ids.filter((id) => (map[id]?.wrong || 0) >= 2).length,
    trackedCount: ids.length,
  };
}

// ── Tokenizer kalimat (alignment hanzi ↔ pinyin) ────────────────────────

const HANZI_RE = /[\u4e00-\u9fff]/;
const PINYIN_VOWELS = /[aāáǎàeēéěèiīíǐìoōóǒòuūúǔùüǖǘǚǜ]+/gi;

function countSyllables(pinyinToken: string): number {
  const cleaned = pinyinToken.replace(/[.,!?;:。，！？、：；""''「」『』()（）]/g, '');
  if (!cleaned) return 0;
  // Apostrof menandai batas suku kata (mis. nǚ'ér) → hitung terpisah.
  const parts = cleaned.split(/['’]/).filter(Boolean);
  let count = 0;
  for (const part of parts) {
    const matches = part.match(PINYIN_VOWELS);
    count += matches ? matches.length : 0;
  }
  return count;
}

/**
 * Ubah satu kalimat contoh dataset menjadi token kata.
 * Strategi: jumlah suku kata tiap kata pinyin = jumlah karakter hanzi kata itu.
 * Jika total tidak cocok, kalimat dilewati (bukan ditebak).
 */
export function tokenizeSentence(
  id: string,
  hanzi: string,
  pinyin: string,
  meaning: string
): GameSentence | null {
  const hanziChars = [...hanzi].filter((c) => HANZI_RE.test(c));
  if (hanziChars.length < 2) return null;

  const pinyinWords = pinyin
    .replace(/[.,!?;:。，！？、：；""''「」『』()（）]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  if (pinyinWords.length < 2) return null;

  const syllables = pinyinWords.map(countSyllables);
  const total = syllables.reduce((a, b) => a + b, 0);
  if (total !== hanziChars.length) return null;
  if (syllables.some((s) => s < 1 || s > 4)) return null;

  const tokens: string[] = [];
  const pinyinTokens: string[] = [];
  let offset = 0;
  for (let i = 0; i < pinyinWords.length; i++) {
    const tok = hanziChars.slice(offset, offset + syllables[i]).join('');
    offset += syllables[i];
    if (!tok) return null;
    tokens.push(tok);
    pinyinTokens.push(pinyinWords[i]);
  }

  return {
    id,
    fullHanzi: hanzi,
    fullPinyin: pinyin,
    meaning,
    tokens,
    pinyinTokens,
  };
}

/**
 * Kumpulan kalimat siap-main dari dataset (dedupe, panjang 3–8 token,
 * diurut dari yang pendek agar pemain pemula tidak langsung kewalahan).
 */
export function getSentencePool(maxTokens = 8): GameSentence[] {
  const out: GameSentence[] = [];
  const seen = new Set<string>();

  for (const w of FULL_HSK_DATASET) {
    if (!w.exampleSentences) continue;
    for (let i = 0; i < w.exampleSentences.length; i++) {
      const s = w.exampleSentences[i];
      if (!s?.hanzi || !s?.pinyin || !s?.meaning) continue;
      const key = s.hanzi.trim();
      if (seen.has(key)) continue;
      const parsed = tokenizeSentence(`${w.id}_s${i}`, s.hanzi, s.pinyin, s.meaning);
      if (!parsed) continue;
      if (parsed.tokens.length < 3 || parsed.tokens.length > maxTokens) continue;
      seen.add(key);
      out.push(parsed);
    }
  }

  out.sort((a, b) => a.tokens.length - b.tokens.length);
  return out;
}

// ── Format waktu ────────────────────────────────────────────────────────

export function formatDuration(ms: number): string {
  const totalSec = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

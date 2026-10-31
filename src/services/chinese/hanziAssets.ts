import { HanziStrokeData } from './hanziStrokeData';

/**
 * hanziAssets — akses ke aset Mandarin OFFLINE yang dibundle di /public/hanzi.
 *
 * Data dihasilkan oleh `scripts/buildHanziAssets.mjs`:
 *  - GORESAN RESMI: paket npm `hanzi-writer-data` (data proyek Makemeahanzi,
 *    lisensi Arphic Public License) — path outline SVG + median (garis tengah)
 *    tiap goresan, 1024×1024, sistem koordinat matematis (Y ke ATAS).
 *  - AUDIO: MP3 Mandarin (zh-CN) per kata/kalimat/pinyin/karakter dataset.
 *
 * File dibagi menjadi bucket JSON kecil dan diunduh sekali, lalu di-cache
 * di memori. Semua fungsi aman dipanggil kapan pun: jika aset belum siap
 * (atau gagal diunduh), aplikasi tetap berjalan dengan data lama/TTS.
 */

export interface ResidentHanziData {
  /** Path outline (bentuk pulau) tiap goresan — koordinat asli Y-ke-atas. */
  strokes: string[];
  /** Garis tengah tiap goresan: [[x,y], …] — urutan resmi penulisan. */
  medians: [number, number][][];
}

interface HanziManifest {
  version: number;
  generatedAt: string;
  hanzi: Record<string, string>; // char → nama file bucket
  audio: Record<string, string>; // teks → nama file bucket audio
}

/** Karakter pengisi sel matriks nada (hasil build script). */
export interface PinyinFillerEntry {
  id: string;
  hanzi: string;
  pinyin: string;
  basePinyin: string;
  tone: 1 | 2 | 3 | 4;
  meaning: string;
}

let pinyinFillers: PinyinFillerEntry[] | null = null;

/** Muat daftar pengisi sel matriks nada (sekali, cache). */
export async function getPinyinFillers(): Promise<PinyinFillerEntry[]> {
  if (pinyinFillers) return pinyinFillers;
  await ensureHanziAssets();
  const data = await fetchJson<{ version: number; fillers: PinyinFillerEntry[] }>(
    `${BASE}hanzi/pinyin_fillers.json`
  );
  pinyinFillers = data?.fillers ?? [];
  return pinyinFillers;
}

const BASE = import.meta.env.BASE_URL || '/';

let manifest: HanziManifest | null = null;
let manifestPromise: Promise<HanziManifest | null> | null = null;
const hanziChunks = new Map<string, Record<string, ResidentHanziData>>();
const audioChunks = new Map<string, Record<string, string>>();
const hanziPending = new Map<string, Promise<ResidentHanziData | null>>();
const convertedCache = new Map<string, HanziStrokeData | null>();

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Pastikan manifest terunduh. Idempotent; gagal → null (app tetap jalan). */
export function ensureHanziAssets(): Promise<HanziManifest | null> {
  if (manifest) return Promise.resolve(manifest);
  if (!manifestPromise) {
    manifestPromise = fetchJson<HanziManifest>(`${BASE}hanzi/assets_manifest.json`).then((m) => {
      manifest = m;
      manifestPromise = null;
      return m;
    });
  }
  return manifestPromise;
}

/** Stat ringan untuk UI (jumlah karakter Dan teks audio yang tersedia). */
export function hanziAssetsStats(): { characters: number; audioTexts: number } {
  if (!manifest) return { characters: 0, audioTexts: 0 };
  return {
    characters: Object.keys(manifest.hanzi).length,
    audioTexts: Object.keys(manifest.audio).length,
  };
}

async function loadHanziChunk(file: string): Promise<Record<string, ResidentHanziData> | null> {
  const cached = hanziChunks.get(file);
  if (cached) return cached;
  const loaded = await fetchJson<Record<string, ResidentHanziData>>(`${BASE}hanzi/${file}`);
  if (loaded) hanziChunks.set(file, loaded);
  return loaded;
}

/**
 * Data mentah resmi per karakter (outline + median, koordinat asli).
 * Mengunduh bucket-nya bila belum ada.
 */
export async function getResidentHanzi(ch: string): Promise<ResidentHanziData | null> {
  await ensureHanziAssets();
  const file = manifest?.hanzi[ch];
  if (!file) return null;
  // Cek chunk yang sudah dimuat
  for (const chunk of hanziChunks.values()) {
    if (chunk[ch]) return chunk[ch];
  }
  let p = hanziPending.get(file);
  if (!p) {
    p = loadHanziChunk(file).then((c) => c?.[ch] ?? null);
    hanziPending.set(file, p);
  }
  return p;
}

/** Ambil audio MP3 (data URL) untuk sebuah teks persis, bila tersedia offline. */
export async function getAudioDataUrl(text: string): Promise<string | null> {
  await ensureHanziAssets();
  const file = manifest?.audio[text];
  if (!file) return null;
  let chunk = audioChunks.get(file);
  if (!chunk) {
    const loaded = await fetchJson<Record<string, string>>(`${BASE}hanzi/${file}`);
    if (loaded) {
      audioChunks.set(file, loaded);
      chunk = loaded;
    }
  }
  return chunk?.[text] ?? null;
}

// ── Konversi koordinat resmi → SVG layar (Y ke bawah) ───────────────────────

/** Sistem koordinat Makemeahanzi: 1024×1024, Y ke atas → y_layar = 900 − y. */
const RAW_SIZE = 900;

function yFlip(y: number): number {
  return RAW_SIZE - y;
}

/** Gabungkan path outline (bisa multi-subpath M…Z) menjadi satu path SVG dalam koordinat layar. */
export function svgOutlineToPath(d: string): string {
  const tokens = d.match(/[MLQCZ]|-?\d+(?:\.\d+)?(?:e-?\d+)?/gi) || [];
  let out = '';
  let i = 0;
  while (i < tokens.length) {
    const t = tokens[i];
    if (/^m$/i.test(t)) {
      out += `${out ? ' ' : ''}M ${tokens[i + 1]},${yFlip(parseFloat(tokens[i + 2]))}`;
      i += 3;
    } else if (/^l$/i.test(t)) {
      out += ` L ${tokens[i + 1]},${yFlip(parseFloat(tokens[i + 2]))}`;
      i += 3;
    } else if (/^q$/i.test(t)) {
      out += ` Q ${tokens[i + 1]},${yFlip(parseFloat(tokens[i + 2]))} ${tokens[i + 3]},${yFlip(parseFloat(tokens[i + 4]))}`;
      i += 5;
    } else if (/^c$/i.test(t)) {
      out += ` C ${tokens[i + 1]},${yFlip(parseFloat(tokens[i + 2]))} ${tokens[i + 3]},${yFlip(parseFloat(tokens[i + 4]))} ${tokens[i + 5]},${yFlip(parseFloat(tokens[i + 6]))}`;
      i += 7;
    } else if (/^z$/i.test(t)) {
      out += ' Z';
      i += 1;
    } else {
      i += 1; // token tak dikenal — lewati
    }
  }
  return out;
}

/**
 * Data goresan resmi siap render untuk satu karakter:
 * strokeCount dihitung dari data (BUKAN metadata), path sudah dikonversi
 * ke koordinat layar, dan tiap goresan membawa median resminya.
 */
export async function getOfficialStrokeData(
  ch: string,
  meta?: { pinyin?: string; meaning?: string; radical?: string }
): Promise<HanziStrokeData | null> {
  await ensureHanziAssets();
  if (!manifest?.hanzi[ch]) return null;

  if (convertedCache.has(ch)) return convertedCache.get(ch)!;

  const raw = await getResidentHanzi(ch);
  if (!raw || raw.strokes.length === 0) {
    convertedCache.set(ch, null);
    return null;
  }

  const data: HanziStrokeData = {
    character: ch,
    pinyin: meta?.pinyin ?? '',
    meaning: meta?.meaning ?? '',
    radical: meta?.radical,
    strokeCount: raw.strokes.length,
    viewBox: '0 0 1024 1024',
    source: 'makemeahanzi',
    strokes: raw.strokes.map((d, i) => ({
      path: svgOutlineToPath(d),
      median: (raw.medians[i] ?? []).map(([x, y]) => [x, yFlip(y)] as [number, number]),
    })),
  };
  convertedCache.set(ch, data);
  return data;
}

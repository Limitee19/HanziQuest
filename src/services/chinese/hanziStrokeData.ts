export interface StrokeInfo {
  path: string;
  strokeType?: string;
  /**
   * Garis tengah (median) resmi goresan ini — [[x,y], …] dalam koordinat
   * viewBox. Digunakan untuk animasi arah penarikan & evaluasi penulisan.
   */
  median?: [number, number][];
}

export interface HanziStrokeData {
  character: string;
  pinyin: string;
  meaning: string;
  strokeCount: number;
  viewBox: string; // e.g. "0 0 1024 1024"
  strokes: StrokeInfo[];
  radical?: string;
  /** Sumber data: 'makemeahanzi' (resmi) | 'legacy' (manual lama). */
  source?: 'makemeahanzi' | 'legacy';
}

/**
 * Dataset lama (manual, koordinat 1024) — hanya fallback bila aset resmi
 * belum termuat. Data resmi dimuat asinkron lewat `hanziAssets.ts`.
 */
export const LOCAL_HANZI_STROKE_DATA: Record<string, HanziStrokeData> = {};

export function getHanziStrokeData(character: string): HanziStrokeData | null {
  return LOCAL_HANZI_STROKE_DATA[character] || null;
}

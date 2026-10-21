export interface CourseWord {
  id: string;
  hanzi: string;
  /** pinyin dengan tonemark, dipisah spasi per suku kata */
  pinyin: string;
  /** pinyin bernomor ala "zhe4 ge5" */
  pinyinNum: string;
  trad: string;
  /** '1'..'6' atau '7-9' */
  level: string;
  pos: string;
  freq: number;
  meanEn: string[];
  /** arti Bahasa Indonesia (patch manual untuk 154 kata) */
  meanId: string;
}

export interface CourseMeta {
  standard: string;
  levelAllocation: string;
  generatedAt: string;
  docs: string[];
  meaningLanguages: string[];
  limitations: string;
}

export interface Course {
  meta: CourseMeta;
  counts: Record<string, number>;
  words: CourseWord[];
  groups: Group[];
}

export interface Group {
  /** kode unik group mis. "g1-0001" */
  id: string
  level: string;
  idx: number;
  title: string;
  wordIds: string[];
}

/** Pilihan tampilan arti: ID jika ada, fallback EN, else kosong */
export function meaningOf(w: { meanId: string; meanEn: string[] }): string {
  return w.meanId || w.meanEn[0] || '';
}

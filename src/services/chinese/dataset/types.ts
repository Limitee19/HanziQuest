import { normalizePinyin, getToneFromPinyin } from '../pinyinEngine';

export interface ChineseWord {
  id: string;
  hanzi: string;
  pinyin: string; // Canonical e.g. "nǐ"
  pinyinNormalized: string; // e.g. "ni"
  tone: 1 | 2 | 3 | 4 | 5;
  meanings: string[]; // Arti utama — Bahasa Indonesia
  exampleSentences?: {
    hanzi: string;
    pinyin: string;
    meaning: string; // Bahasa Indonesia
  }[];
  hskLevel: number; // 1..6
  partOfSpeech?: string;
  tags?: string[];
  /** Emoji ilustratif yang nyambung dengan arti (kata konkret). */
  emoji?: string;
  /** Judul artikel Wikipedia (EN) untuk gambar ilustratif, hanya konsep konkret. */
  imageKey?: string;
  /** Arti Inggris sekunder (dipakai juga untuk pencarian). */
  secondaryMeanings?: string[];
}

export type ExampleSeed = [hanzi: string, pinyin: string, meaning: string];

/**
 * Factory ringkas satu kata HSK: menghitung pinyinNormalized & tone otomatis.
 * Contoh: w('hsk1_001', 1, '你', 'nǐ', ['kamu'], [['你好！','Nǐ hǎo!','Halo!']], { pos:'pron', emoji:'👋' })
 */
export function w(
  id: string,
  hskLevel: 1 | 2 | 3,
  hanzi: string,
  pinyin: string,
  meanings: string[],
  example: ExampleSeed | null,
  opts?: { pos?: string; emoji?: string; imageKey?: string; en?: string[] }
): ChineseWord {
  return {
    id,
    hanzi,
    pinyin,
    pinyinNormalized: normalizePinyin(pinyin),
    tone: getToneFromPinyin(pinyin),
    meanings,
    exampleSentences: example ? [{ hanzi: example[0], pinyin: example[1], meaning: example[2] }] : undefined,
    hskLevel,
    partOfSpeech: opts?.pos,
    emoji: opts?.emoji,
    imageKey: opts?.imageKey,
    secondaryMeanings: opts?.en,
  };
}

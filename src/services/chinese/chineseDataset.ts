import { PinyinToneNumber } from './pinyinEngine';

// Dataset lengkap kini terbagi per level di ./dataset/ — file ini tetap menjadi
// pintu masuk utama (API kompatibel) untuk semua pemakai lama.
export {
  HSK1_WORDS,
  HSK2_WORDS,
  HSK3_WORDS,
  buildToneFillers,
  FULL_HSK_DATASET,
} from './dataset';
import { FULL_HSK_DATASET } from './dataset';

export interface ChineseWord {
  id: string;
  hanzi: string;
  pinyin: string; // Canonical e.g. "nǐ"
  pinyinNormalized: string; // e.g. "ni"
  tone: PinyinToneNumber; // 1..5
  meanings: string[]; // e.g. ["kamu", "Anda", "you"]
  exampleSentences?: {
    hanzi: string;
    pinyin: string;
    meaning: string;
  }[];
  hskLevel: number; // 1..6 (0 = di luar HSK, pengisi nada)
  partOfSpeech?: string;
  tags?: string[];
  emoji?: string;
  imageKey?: string;
  secondaryMeanings?: string[];
}

// Dataset lama 7 kata kini digantikan dataset lengkap HSK 1–3 + tone fillers.
// Nama lama dipertahankan agar seluruh pemakai (review queue, practice engine,
// search provider) otomatis mendapat dataset penuh.
export const STARTER_CHINESE_DATASET: ChineseWord[] = FULL_HSK_DATASET;

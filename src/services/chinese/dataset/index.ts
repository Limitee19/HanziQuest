import { ChineseWord } from './types';
import { HSK1_WORDS } from './hsk1';
import { HSK2_WORDS } from './hsk2';
import { HSK3_WORDS } from './hsk3';
import { buildToneFillers } from './toneFillers';

export type { ChineseWord };
export { HSK1_WORDS, HSK2_WORDS, HSK3_WORDS, buildToneFillers };

/** Dataset lengkap HSK 1–3 + pengisi nada (di luar HSK). */
export const FULL_HSK_DATASET: ChineseWord[] = [
  ...HSK1_WORDS,
  ...HSK2_WORDS,
  ...HSK3_WORDS,
  ...buildToneFillers(),
];

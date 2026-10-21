export type PinyinToneNumber = 1 | 2 | 3 | 4 | 5; // 5 is neutral tone

const TONE_MARKS: Record<string, string[]> = {
  a: ['a', 'ā', 'á', 'ǎ', 'à', 'a'],
  e: ['e', 'ē', 'é', 'ě', 'è', 'e'],
  i: ['i', 'ī', 'í', 'ǐ', 'ì', 'i'],
  o: ['o', 'ō', 'ó', 'ǒ', 'ò', 'o'],
  u: ['u', 'ū', 'ú', 'ǔ', 'ù', 'u'],
  v: ['ü', 'ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'], // ü
  ü: ['ü', 'ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'],
};

/**
 * Strips tone marks from a Pinyin string (e.g. "nǐ" -> "ni", "hǎo" -> "hao")
 */
export function removeToneMarks(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/v/g, 'ü')
    .toLowerCase();
}

/**
 * Normalizes Pinyin for comparison (lowercased, diacritics removed, trimmed)
 */
export function normalizePinyin(text: string): string {
  if (!text) return '';
  return removeToneMarks(text).replace(/[^a-zü]/g, '').trim();
}

/**
 * Applies a Pinyin tone (1..5) to a plain Latin Pinyin syllable (e.g. "ni", 3 -> "nǐ")
 * Follows standard Chinese Pinyin tone mark placement rules:
 * 1. If syllable contains 'a' or 'e', mark 'a' or 'e'.
 * 2. If syllable contains 'ou', mark 'o'.
 * 3. Otherwise, mark the last vowel in the syllable.
 */
export function applyToneToSyllable(syllable: string, tone: PinyinToneNumber): string {
  const clean = syllable.trim().toLowerCase().replace(/v/g, 'ü');
  if (!clean || tone === 5) return clean;

  const vowels = ['a', 'e', 'o', 'u', 'i', 'ü'];

  // Rule 1: 'a' or 'e'
  if (clean.includes('a')) {
    const mark = TONE_MARKS['a'][tone];
    return clean.replace('a', mark);
  }
  if (clean.includes('e')) {
    const mark = TONE_MARKS['e'][tone];
    return clean.replace('e', mark);
  }

  // Rule 2: 'ou'
  if (clean.includes('ou')) {
    const mark = TONE_MARKS['o'][tone];
    return clean.replace('o', mark);
  }

  // Rule 3: Otherwise mark the last vowel
  let lastVowelIdx = -1;
  let lastVowelChar = '';

  for (let i = clean.length - 1; i >= 0; i--) {
    const char = clean[i];
    if (vowels.includes(char)) {
      lastVowelIdx = i;
      lastVowelChar = char;
      break;
    }
  }

  if (lastVowelIdx !== -1 && TONE_MARKS[lastVowelChar]) {
    const mark = TONE_MARKS[lastVowelChar][tone];
    return clean.substring(0, lastVowelIdx) + mark + clean.substring(lastVowelIdx + 1);
  }

  return clean;
}

/**
 * Extracts tone number from a tone-marked Pinyin string (returns 1..4 or 5 for neutral)
 */
/**
 * Cek apakah query pinyin (latin, tanpa/t dengan tanda nada) cocok dengan
 * suku kata pinyin target — pembandingan PER SUKU KATA, bukan substring bebas.
 * "ai" cocok dengan "ài"/"ai" tapi TIDAK dengan "shuō" atau kata Inggris "said".
 */
export function pinyinSyllablesMatch(query: string, targetPinyin: string): boolean {
  const qTokens = normalizePinyin(query)
    .replace(/[^a-zü]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  if (qTokens.length === 0) return false;

  const tTokens = normalizePinyin(targetPinyin)
    .replace(/[^a-zü]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  if (tTokens.length === 0) return false;

  // Semua token query harus cocok dengan SALAH SATU suku kata target
  return qTokens.every((q) =>
    tTokens.some((t) => t === q || (q.length >= 2 && t.startsWith(q) && q.length <= t.length))
  );
}

export function getToneFromPinyin(pinyin: string): PinyinToneNumber {
  if (!pinyin) return 5;
  if (/[\u0101\u0113\u012b\u014d\u016b\u01d6]/i.test(pinyin)) return 1;
  if (/[\u00e1\u00e9\u00ed\u00f3\u00fa\u01d8]/i.test(pinyin)) return 2;
  if (/[\u01ce\u011b\u01d0\u01d2\u01d4\u01da]/i.test(pinyin)) return 3;
  if (/[\u00e0\u00e8\u00ec\u00f2\u00f9\u01dc]/i.test(pinyin)) return 4;
  return 5;
}

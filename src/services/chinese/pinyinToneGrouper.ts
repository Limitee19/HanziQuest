import { LearnedCardItem } from './flashcardService';
import { removeToneMarks, applyToneToSyllable } from './pinyinEngine';

export interface PinyinCardItem {
  id: string;
  hanzi: string;
  pinyin: string;
  basePinyin: string;
  tone: 1 | 2 | 3 | 4;
  meaning: string;
  deckName: string;
  studyStatus: string;
  rawCard: LearnedCardItem;
}

export interface PinyinToneGroup {
  basePinyin: string;
  tones: {
    1: PinyinCardItem[];
    2: PinyinCardItem[];
    3: PinyinCardItem[];
    4: PinyinCardItem[];
  };
  totalCount: number;
}

// Map of tone diacritics to tone numbers
const TONE_CHAR_MAP: Record<string, 1 | 2 | 3 | 4> = {
  'ā': 1, 'ē': 1, 'ī': 1, 'ō': 1, 'ū': 1, 'ǖ': 1,
  'á': 2, 'é': 2, 'í': 2, 'ó': 2, 'ú': 2, 'ǘ': 2,
  'ǎ': 3, 'ě': 3, 'ǐ': 3, 'ǒ': 3, 'ǔ': 3, 'ǚ': 3,
  'à': 4, 'è': 4, 'ì': 4, 'ò': 4, 'ù': 4, 'ǜ': 4,
};

/**
 * Detects tone number (1..4) from a pinyin syllable with diacritics or number.
 */
function detectTone(syllable: string): (1 | 2 | 3 | 4) | null {
  for (const [char, tone] of Object.entries(TONE_CHAR_MAP)) {
    if (syllable.includes(char)) {
      return tone;
    }
  }
  const matchNum = syllable.match(/([1-4])$/);
  if (matchNum) {
    return parseInt(matchNum[1], 10) as 1 | 2 | 3 | 4;
  }
  return null;
}

/**
 * Extracts clean Hanzi, Pinyin, Tone, and Meaning from a LearnedCardItem.
 */
export function extractPinyinAndTone(card: LearnedCardItem): PinyinCardItem | null {
  const frontClean = (card.frontContent || '').replace(/<[^>]*>/g, ' ').trim();
  const backClean = (card.backContent || '').replace(/<[^>]*>/g, ' ').trim();
  const combined = `${frontClean} ${backClean}`;

  // 1. Extract Target Hanzi (Unicode 4E00-9FFF) - STRICTLY 1 HANZI ONLY
  // Prioritas 1: Jika kartu Anki memiliki container khusus kata seperti <div class="hanzi">...</div> atau <b>...</b>
  let targetWord = '';
  const mHanziDiv = (card.frontContent || '').match(/class=["']?hanzi["']?>([^<]+)</i) ||
                    (card.backContent || '').match(/class=["']?hanzi["']?>([^<]+)</i);
  if (mHanziDiv) {
    targetWord = mHanziDiv[1].trim();
  }

  // Prioritas 2: Jika tidak ada class="hanzi", periksa teks depan sebelum elemen pemisah seperti <hr>, <br>, atau kalimat
  if (!targetWord) {
    // Ambil baris pertama sebelum <hr> atau baris baru
    const frontParts = (card.frontContent || '').split(/<hr[^>]*>|<br\s*\/?>|\n/i);
    const firstPart = frontParts[0].replace(/<[^>]*>/g, ' ').trim();
    const hanziInFirstPart = firstPart.match(/[\u4e00-\u9fa5]+/);
    if (hanziInFirstPart) {
      targetWord = hanziInFirstPart[0];
    }
  }

  // Prioritas 3: Fallback ke seluruh frontClean jika pendek
  if (!targetWord) {
    const allFrontHanzi = frontClean.match(/[\u4e00-\u9fa5]+/);
    if (allFrontHanzi) {
      targetWord = allFrontHanzi[0];
    }
  }

  if (!targetWord) return null;

  // Bersihkan dari karakter non-Hanzi
  const cleanHanziChars = Array.from(targetWord.replace(/[^\u4e00-\u9fa5]/g, ''));
  
  // Jika kata target memiliki lebih dari 1 Hanzi (misal 没有, 现在, 喜欢, 时候), SKIP!
  if (cleanHanziChars.length !== 1) {
    return null;
  }
  const singleHanzi = cleanHanziChars[0];

  // 2. Extract Pinyin
  let pinyinCandidate = '';

  // Prioritas 1: class="pinyin" jika ada di back atau front
  const mPinyinDiv = (card.backContent || '').match(/class=["']?pinyin["']?>([^<]+)</i) ||
                     (card.frontContent || '').match(/class=["']?pinyin["']?>([^<]+)</i);
  if (mPinyinDiv) {
    const rawP = mPinyinDiv[1].replace(/<[^>]*>/g, '').trim();
    if (rawP && !rawP.toLowerCase().includes('<br')) {
      pinyinCandidate = rawP;
    }
  }

  // Prioritas 2: Check brackets [pīnyīn] or (pīnyīn) or /pīnyīn/
  if (!pinyinCandidate) {
    const bracketMatch = combined.match(/\[([a-zA-Zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ\s1-4]+)\]/) ||
                         combined.match(/\(([a-zA-Zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ\s1-4]+)\)/) ||
                         combined.match(/\/([a-zA-Zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ\s1-4]+)\//);
    if (bracketMatch) {
      const cand = bracketMatch[1].trim();
      // Kandidat harus punya tanda/angka nada — kalau tidak, itu arti dalam kurung
      // (mis. "pendek (badan)") yang selama ini mencuri slot pinyin dan membuat parse NULL.
      const firstTok = cand.split(/[\s,·\/\-]+/)[0] || '';
      if (detectTone(firstTok)) {
        pinyinCandidate = cand;
      }
    }
  }

  // Prioritas 3: Kata pertama dengan diakritik nada (e.g. "nà", "nǎ", "shí")
  if (!pinyinCandidate) {
    const toneWordMatch = combined.match(/[a-zA-Z]*[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ][a-zA-Z]*/i);
    if (toneWordMatch) {
      pinyinCandidate = toneWordMatch[0].trim();
    }
  }

  // Prioritas 4: Suku kata dengan angka nada (e.g. "shi4", "na3")
  if (!pinyinCandidate) {
    const numWordMatch = combined.match(/\b([a-zA-Z]{1,6})([1-4])\b/);
    if (numWordMatch) {
      pinyinCandidate = numWordMatch[0].trim();
    }
  }

  if (!pinyinCandidate) return null;

  // Ambil suku kata pertama
  const syllables = pinyinCandidate.split(/[\s,·\/\-]+/);
  const firstSyllable = syllables[0].trim();
  if (!firstSyllable) return null;

  const tone = detectTone(firstSyllable);
  if (!tone) return null;

  // Base pinyin (tanpa tanda nada / angka)
  let cleanSyllable = firstSyllable.replace(/[1-4]$/, '');
  const basePinyin = removeToneMarks(cleanSyllable).replace(/[^a-z]/gi, '').toLowerCase();
  if (!basePinyin) return null;

  // Display pinyin bertanda nada yang rapi
  let displayPinyin = firstSyllable;
  if (/([1-4])$/.test(firstSyllable)) {
    displayPinyin = applyToneToSyllable(basePinyin, tone);
  }

  // 3. Extract clean Meaning
  let meaning = '';
  // Prioritas 1: class="english" atau class="meaning"
  const mMeaningDiv = (card.backContent || '').match(/class=["']?(english|meaning)["']?>([^<]+)</i);
  if (mMeaningDiv) {
    meaning = mMeaningDiv[2].replace(/<[^>]*>/g, '').trim();
  }

  if (!meaning) {
    meaning = backClean
      .replace(/\[[^\]]*\]/g, '')
      .replace(/\([^\)]*\)/g, '')
      .replace(/\/[^\/]*\//g, '')
      .replace(new RegExp(displayPinyin, 'gi'), '')
      .replace(new RegExp(basePinyin, 'gi'), '')
      .replace(/[\u4e00-\u9fa5]+/g, '')
      .replace(/[;,\n]+/g, ', ')
      .trim();
  }

  if (!meaning && frontClean && !/^[\u4e00-\u9fa5]+$/.test(frontClean)) {
    meaning = frontClean;
  }
  if (!meaning) meaning = '–';
  if (meaning.length > 50) meaning = meaning.substring(0, 47) + '...';

  return {
    id: card.id,
    hanzi: singleHanzi,
    pinyin: displayPinyin,
    basePinyin,
    tone,
    meaning,
    deckName: card.deckName,
    studyStatus: card.studyStatus,
    rawCard: card,
  };
}

/**
 * Groups cards into PinyinToneGroups (one row per base Pinyin with 4 tone slots).
 */
export function groupCardsByPinyinTones(cards: LearnedCardItem[]): PinyinToneGroup[] {
  const groupsMap = new Map<string, PinyinToneGroup>();

  for (const card of cards) {
    const item = extractPinyinAndTone(card);
    if (!item) continue;

    if (!groupsMap.has(item.basePinyin)) {
      groupsMap.set(item.basePinyin, {
        basePinyin: item.basePinyin,
        tones: { 1: [], 2: [], 3: [], 4: [] },
        totalCount: 0,
      });
    }

    const group = groupsMap.get(item.basePinyin)!;
    // Avoid exact duplicate cards in the same tone slot
    if (!group.tones[item.tone].some((existing) => existing.id === item.id)) {
      group.tones[item.tone].push(item);
      group.totalCount += 1;
    }
  }

  // Sort base pinyin alphabetically (a..z)
  return Array.from(groupsMap.values()).sort((a, b) => a.basePinyin.localeCompare(b.basePinyin));
}

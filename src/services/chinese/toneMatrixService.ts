import { LearnedCardItem } from './flashcardService';
import { ChineseWord } from './chineseDataset';
import { FULL_HSK_DATASET } from './dataset';
import { MANDARIN_VALID_TONES } from './dataset/toneFillers';
import { getPinyinFillers } from './hanziAssets';
import {
  PinyinCardItem,
  extractPinyinAndTone,
  PinyinToneGroup,
} from './pinyinToneGrouper';

export type ToneNumber = 1 | 2 | 3 | 4;

export interface ToneSlotItem {
  /** Sumber data sel: kartu Anki milik user, kata dataset, atau pengisi kamus. */
  source: 'anki' | 'dataset' | 'filler';
  hanzi: string;
  pinyin: string;
  meaning: string;
  emoji?: string;
  /** '0' berarti di luar HSK (tone filler). */
  hskLevel: number;
  /** Hanya untuk source anki. */
  ankiCard?: LearnedCardItem;
  /** Untuk source dataset. */
  word?: ChineseWord;
}

export interface ToneMatrixRow {
  basePinyin: string;
  slots: Record<ToneNumber, ToneSlotItem[]>;
  /** Nada yang secara linguistik valid untuk suku kata ini. */
  validTones: ToneNumber[];
  totalCount: number;
  ankiCount: number;
  /** Kartu Anki yang tidak muat ke baris mana pun (pinyin tidak terbaca). */
  hasUnparsed: boolean;
}

const TONES: ToneNumber[] = [1, 2, 3, 4];

/** Nada valid untuk suku kata; default semua valid bila tak tercatat. */
function validTonesFor(base: string): ToneNumber[] {
  const listed = MANDARIN_VALID_TONES[base];
  if (!listed) return TONES;
  return TONES.filter((t) => listed.includes(t));
}

function datasetToSlot(word: ChineseWord): ToneSlotItem {
  return {
    source: 'dataset',
    hanzi: word.hanzi,
    pinyin: word.pinyin,
    meaning: word.meanings[0] || '',
    emoji: word.emoji,
    hskLevel: word.hskLevel,
    word,
  };
}

/** Slot dari pengisi kamus (karakter resmi pemenuh sel kosong). */
function fillerToSlot(f: { hanzi: string; pinyin: string; meaning: string }): ToneSlotItem {
  return {
    source: 'filler',
    hanzi: f.hanzi,
    pinyin: f.pinyin,
    meaning: f.meaning || 'karakter perwakilan',
    hskLevel: 0,
  };
}

/**
 * Membangun matriks 4 nada gabungan:
 * - Baris = suku kata dari kartu Anki user (diutamakan) + seluruh kosakata dataset HSK 1–6 + filler.
 * - Sel = kartu Anki user lebih dulu (audio MP3 asli), lalu kata dataset,
 *   lalu pengisi kamus (karakter resmi Makemeahanzi dari build script).
 * - Slot pada nada yang secara linguistik tidak ada tetap kosong dan ditandai validTones.
 */
export async function buildToneMatrix(userCards: LearnedCardItem[]): Promise<{
  rows: ToneMatrixRow[];
  unparsedCards: LearnedCardItem[];
}> {
  const rowsMap = new Map<string, ToneMatrixRow>();

  // Guard: kartu harus array (defensif terhadap bentuk data tak terduga).
  const cards: LearnedCardItem[] = Array.isArray(userCards) ? userCards : [];

  const ensureRow = (base: string): ToneMatrixRow => {
    let row = rowsMap.get(base);
    if (!row) {
      row = {
        basePinyin: base,
        slots: { 1: [], 2: [], 3: [], 4: [] },
        validTones: validTonesFor(base),
        totalCount: 0,
        ankiCount: 0,
        hasUnparsed: false,
      };
      rowsMap.set(base, row);
    }
    return row;
  };

  const pushSlot = (row: ToneMatrixRow, tone: ToneNumber, item: ToneSlotItem) => {
    // Cegah Hanzi yang sama dua kali di slot yang sama
    if (row.slots[tone].some((s) => s.hanzi === item.hanzi)) return;
    row.slots[tone].push(item);
    row.totalCount += 1;
    if (item.source === 'anki') row.ankiCount += 1;
  };

  // 1) Kartu Anki user lebih dulu — mereka adalah "pemilik" sel
  const unparsedCards: LearnedCardItem[] = [];
  for (const card of cards) {
    const parsed = extractPinyinAndTone(card);
    if (!parsed) {
      unparsedCards.push(card);
      continue;
    }
    const row = ensureRow(parsed.basePinyin);
    pushSlot(row, parsed.tone, {
      source: 'anki',
      hanzi: parsed.hanzi,
      pinyin: parsed.pinyin,
      meaning: parsed.meaning,
      hskLevel: 0,
      ankiCard: card,
    });
  }

  // 2) Seluruh dataset HSK 1–6 + filler mengisi slot kosong
  for (const word of FULL_HSK_DATASET) {
    const item = extractPinyinAndTone({
      id: word.id,
      noteId: word.id,
      deckId: 'dataset',
      deckName: `HSK ${word.hskLevel || 'Luar'}`,
      sourceCardOrdinal: 0,
      cardType: 'basic',
      frontContent: word.hanzi,
      backContent: `${word.pinyin} — ${word.meanings.join(', ')}`,
      studyStatus: 'not_started',
      intervalDays: 0,
      easeFactor: 2.5,
      repetitions: 0,
      lapses: 0,
      createdAt: '',
      updatedAt: '',
    });
    if (!item) continue;
    const row = ensureRow(item.basePinyin);
    pushSlot(row, item.tone, datasetToSlot(word));
  }

  // 2b) Pengisi sel kosong: karakter resmi perwakilan (aset build script).
  //     Satu karakter per sel (suku kata × nada) yang belum terisi apa pun.
  const fillers = await getPinyinFillers();
  for (const f of fillers) {
    const row = rowsMap.get(f.basePinyin);
    if (!row) continue; // baris tidak ditampilkan → tidak perlu diisi
    if (row.slots[f.tone].length > 0) continue;
    pushSlot(row, f.tone, fillerToSlot(f));
  }

  // 3) Urutkan isi slot: HSK menaik, lalu abjad arti (filler paling akhir)
  const rows = Array.from(rowsMap.values());
  for (const row of rows) {
    for (const t of TONES) {
      row.slots[t].sort((a, b) => {
        const la = a.source === 'filler' ? 90 : a.hskLevel || 9;
        const lb = b.source === 'filler' ? 90 : b.hskLevel || 9;
        if (la !== lb) return la - lb;
        return a.meaning.localeCompare(b.meaning);
      });
    }
  }

  rows.sort((a, b) => {
    // Baris dengan kartu user dulu, lalu abjad
    if ((b.ankiCount > 0) !== (a.ankiCount > 0)) return b.ankiCount > 0 ? 1 : -1;
    return a.basePinyin.localeCompare(b.basePinyin);
  });

  return { rows, unparsedCards };
}

/** Statistik ringkas untuk header matriks. */
export function toneMatrixStats(rows: ToneMatrixRow[]) {
  let totalSlots = 0;
  let filledSlots = 0;
  let ankiSlots = 0;
  let invalidSlots = 0;
  for (const row of rows) {
    for (const t of [1, 2, 3, 4] as ToneNumber[]) {
      if (!row.validTones.includes(t)) {
        invalidSlots += 1;
        continue;
      }
      totalSlots += 1;
      if (row.slots[t].length > 0) filledSlots += 1;
      if (row.slots[t].some((s) => s.source === 'anki')) ankiSlots += 1;
    }
  }
  return { totalSlots, filledSlots, ankiSlots, invalidSlots };
}

/** Tipe re-export untuk komponen UI. */
export type { PinyinCardItem, PinyinToneGroup };

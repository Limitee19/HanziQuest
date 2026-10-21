import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  BookOpen,
  PenTool,
  Volume2,
  Layers,
  ChevronRight,
  X,
  Clock,
  LayoutGrid,
  SlidersHorizontal,
  Languages,
  Ban,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  fetchAllLearnedCards,
  fetchDecks,
  LearnedCardItem,
  DeckItem,
  decodeHtmlEntities,
} from '@/services/chinese/flashcardService';
import {
  buildToneMatrix,
  toneMatrixStats,
  ToneMatrixRow,
  ToneNumber,
} from '@/services/chinese/toneMatrixService';
import { translateCardContentToIndonesian } from '@/services/chinese/ankiTranslation';
import { executeSql } from '@/db/client';
import { ChineseWord } from '@/services/chineseLearningService';
import { chineseAudioPlayer } from '@/services/chinese/chineseAudioPlayer';
import { VocabularyDetailModal } from '../VocabularyDetailModal';
import { HanziPracticeView } from '../HanziPracticeView';

const TONE_STYLES: Record<1 | 2 | 3 | 4, {
  label: string;
  name: string;
  badge: string;
  text: string;
  card: string;
}> = {
  1: {
    label: 'Nada 1 (ˉ)',
    name: 'Tinggi Datar',
    badge: 'bg-blue-500 text-white',
    text: 'text-blue-600 dark:text-blue-400',
    card: 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-200/80 dark:border-blue-800/60 hover:border-blue-400',
  },
  2: {
    label: 'Nada 2 (ˊ)',
    name: 'Naik',
    badge: 'bg-emerald-500 text-white',
    text: 'text-emerald-600 dark:text-emerald-400',
    card: 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/60 hover:border-emerald-400',
  },
  3: {
    label: 'Nada 3 (ˇ)',
    name: 'Turun-Naik',
    badge: 'bg-amber-500 text-white',
    text: 'text-amber-600 dark:text-amber-400',
    card: 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-800/60 hover:border-amber-400',
  },
  4: {
    label: 'Nada 4 (ˋ)',
    name: 'Turun Hentak',
    badge: 'bg-rose-500 text-white',
    text: 'text-rose-600 dark:text-rose-400',
    card: 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-800/60 hover:border-rose-400',
  },
};

/** Baris matriks: satu suku kata × 4 slot nada (kartu Anki user + dataset HSK 1–3). */
function MatrixRowCard({
  row,
  onOpenAnki,
  onOpenWord,
  onPlayAnki,
  onPlayWord,
}: {
  row: ToneMatrixRow;
  onOpenAnki: (card: LearnedCardItem) => void;
  onOpenWord: (word: ChineseWord) => void;
  onPlayAnki: (card: LearnedCardItem) => void;
  onPlayWord: (word: ChineseWord) => void;
}) {
  return (
    <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-xs p-3.5 sm:p-4 rounded-2xl space-y-2.5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
      {/* Header Baris Suku Kata */}
      <div className="flex items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-2 py-0.5 rounded-md text-xs font-black font-mono tracking-wider bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 uppercase shrink-0">
            {row.basePinyin}
          </span>
          <span className="text-xs text-zinc-500 font-medium truncate">
            Suku kata: <strong className="text-zinc-800 dark:text-zinc-200 font-mono">{row.basePinyin}</strong>
          </span>
          {row.ankiCount > 0 && (
            <span className="hidden md:inline px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
              {row.ankiCount} kartumu
            </span>
          )}
        </div>
        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium shrink-0">{row.totalCount} Hanzi</span>
      </div>

      {/* 4 Kolom Nada */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 pt-0.5">
        {([1, 2, 3, 4] as ToneNumber[]).map((toneNum) => {
          const items = row.slots[toneNum];
          const style = TONE_STYLES[toneNum];

          /* Nada ini secara linguistik tidak dipakai untuk suku kata ini */
          if (!row.validTones.includes(toneNum)) {
            return (
              <div
                key={toneNum}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/30 dark:bg-zinc-900/10 text-zinc-300 dark:text-zinc-700 select-none"
                title={`Suku kata "${row.basePinyin}" tidak memiliki nada ${toneNum} dalam bahasa Mandarin standar`}
              >
                <span className="font-bold font-mono text-xs">{toneNum}.</span>
                <Ban className="w-3 h-3 shrink-0" />
                <span className="text-[10px] font-medium">nada tak dipakai</span>
              </div>
            );
          }

          /* Slot valid tapi masih kosong */
          if (items.length === 0) {
            return (
              <div
                key={toneNum}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/20 text-zinc-400 dark:text-zinc-600 font-mono text-xs sm:text-sm select-none"
              >
                <span className="font-bold text-zinc-400 dark:text-zinc-500">{toneNum}.</span>
                <span className="font-bold text-base text-zinc-300 dark:text-zinc-700">–</span>
              </div>
            );
          }

          const rawPinyin = items[0].pinyin;
          const displayPinyin = rawPinyin ? rawPinyin.charAt(0).toUpperCase() + rawPinyin.slice(1) : '';
          const ankiAudioCard = items.find((i) => i.source === 'anki')?.ankiCard;
          const firstWord = items.find((i) => i.word)?.word;

          return (
            <div
              key={toneNum}
              className={`flex flex-col justify-between px-3 py-2 rounded-xl border transition-all gap-1.5 shadow-2xs ${style.card}`}
            >
              {/* Header Slot Nada: Nomor, Pinyin, dan Tombol Audio */}
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500">{toneNum}.</span>
                  <span className={`text-sm sm:text-base font-extrabold ${style.text}`}>{displayPinyin}</span>
                </div>
                {ankiAudioCard ? (
                  <button
                    type="button"
                    onClick={() => onPlayAnki(ankiAudioCard)}
                    className="p-1 rounded-md text-zinc-400 hover:text-blue-600 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    title={`Dengarkan nada ${toneNum} (${displayPinyin}) — audio MP3 kartumu`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  firstWord && (
                    <button
                      type="button"
                      onClick={() => onPlayWord(firstWord)}
                      className="p-1 rounded-md text-zinc-400 hover:text-blue-600 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                      title={`Dengarkan nada ${toneNum} (${displayPinyin})`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )
                )}
              </div>

              {/* Daftar Hanzi pada slot ini */}
              <div className="flex items-center gap-1 flex-wrap pt-0.5">
                {items.map((item, idx) => (
                  <span key={`${item.source}-${item.hanzi}-${item.pinyin}`} className="inline-flex items-center gap-1">
                    {idx > 0 && (
                      <span className="text-zinc-400 dark:text-zinc-600 font-bold text-sm px-0.5 select-none">/</span>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (item.source === 'anki' && item.ankiCard) onOpenAnki(item.ankiCard);
                        else if (item.word) onOpenWord(item.word);
                      }}
                      className={`group inline-flex items-center gap-1 px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                        item.source === 'anki'
                          ? 'bg-white dark:bg-zinc-800 border-zinc-200/80 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-xs'
                          : 'bg-white/70 dark:bg-zinc-800/50 border-zinc-200/60 dark:border-zinc-700/60 hover:border-zinc-400 dark:hover:border-zinc-600'
                      }`}
                      title={`${item.hanzi} [${item.pinyin}] — ${item.meaning}${
                        item.source === 'anki'
                          ? ' (Kartumu — klik untuk detail)'
                          : item.source === 'filler'
                            ? ' (pengisi sel — karakter perwakilan kamus)'
                            : ` (HSK ${item.hskLevel > 0 ? item.hskLevel : 'luar'})`
                      }`}
                    >
                      <span className={`text-base sm:text-lg font-bold transition-colors ${
                        item.source === 'filler'
                          ? 'text-zinc-500 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                          : 'text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                      }`}>
                        {item.hanzi}
                      </span>
                      {item.source === 'anki' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" title="Dari kartu Anki-mu (audio MP3 asli)" />
                      )}
                      {item.source === 'filler' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600 shrink-0" title="Pengisi sel — karakter perwakilan kamus" />
                      )}
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 max-w-[80px] sm:max-w-[95px] truncate hidden sm:inline">
                        ({item.meaning})
                      </span>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/**
 * Ekstrak tampilan ringkas kartu: HANZI SEKALI + arti Indonesia.
 * Kartu Anki lama sering menampilkan hanzi dobel (di front DAN di back)
 * sehingga boros tempat. Di sini hanzi cukup 1x, lalu baris artinya.
 */
function extractCardDisplay(card: LearnedCardItem): {
  hanzi: string;
  pinyin: string;
  meaning: string;
} {
  const plainOf = (html: string) =>
    decodeHtmlEntities(
      (html || '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/&[a-z]+;/gi, ' ')
    )
      .replace(/\s+/g, ' ')
      .trim();

  const frontPlain = plainOf(card.frontContent);
  const backPlain = plainOf(card.backContent);

  const cjkRun = (text: string) => text.match(/[\u4e00-\u9fff][\u4e00-\u9fff\u3007]*/);
  const hanzi =
    card.hanziExtract?.match(/[\u4e00-\u9fff]+/)?.[0] ||
    cjkRun(frontPlain)?.[0] ||
    cjkRun(backPlain)?.[0] ||
    '';

  // Dari back: buang repetisi hanzi di awal, buang pinyin bertanda nada /
  // bernomor nada — sisanya adalah arti (Indonesia) + keterangan lain.
  let meaning = backPlain
    .replace(/^\s*[\u4e00-\u9fff][\u4e00-\u9fff\u3007]*\s*/, '')
    .replace(/[\u4e00-\u9fff][\u4e00-\u9fff\u3007]*/g, ' ')
    .replace(/[a-züàáǎãāèéěêìíǐīòóǒôūúǔùǖǘǚǜ][a-züàáǎãāèéěêìíǐīòóǒôūúǔùǖǘǚǜ]*(?:\s\d)?/gi, (m) =>
      /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/.test(m) ? ' ' : m === m.toLowerCase() ? m : m
    )
    .replace(/\b[a-z]{1,7}[1-5]\b/gi, ' ')
    .replace(/[.…·•]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Pinyin: ambil dari back (kata bertanda nada) bila ada.
  // Angka nada di ekor ("juede4") dibuang agar tampil prototeksnya.
  const pinyin = (
    backPlain.match(/[a-zü]+[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ][a-zü]*/i)?.[0] ||
    backPlain.match(/\b[a-z]{1,7}[1-5]\b/i)?.[0]?.replace(/[1-5]$/, '') ||
    ''
  );

  if (!meaning) meaning = frontPlain.replace(/[\u4e00-\u9fff][\u4e00-\u9fff\u3007]*/g, ' ').trim();
  // Arti inti saja: potong kalimat contoh (setelah titik/koma ganda),
  // buang sisa token audio, batasi 80 char.
  meaning = meaning
    .replace(/\[sound:[^\]]+\]/gi, ' ')
    .replace(/\b[\w-]+\.(mp3|wav|ogg|m4a)\b/gi, ' ')
    .split(/[.;!?|\n]+/)[0]
    .replace(/\s+/g, ' ')
    .trim();
  if (meaning.length > 80) meaning = meaning.slice(0, 77).trimEnd() + '...';
  return { hanzi, pinyin, meaning };
}

export function LearnedVocabularyView() {
  const [cards, setCards] = useState<LearnedCardItem[]>([]);
  const [decks, setDecks] = useState<DeckItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & View Mode
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeckId, setSelectedDeckId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'pinyin_tones'>('grid');

  // Detail Modal & Writing Practice
  const [selectedCard, setSelectedCard] = useState<LearnedCardItem | null>(null);
  const [selectedWord, setSelectedWord] = useState<ChineseWord | null>(null);
  const [activeWritingCharacter, setActiveWritingCharacter] = useState<{
    character: string;
    pinyin: string;
    meaning: string;
  } | null>(null);
  // Matriks: tampilkan hanya baris dengan kartu user, atau semua (default)
  const [matrixScope, setMatrixScope] = useState<'full' | 'mine'>('full');
  const [visibleRows, setVisibleRows] = useState(40);
  const [translating, setTranslating] = useState(false);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedCard) setSelectedCard(null);
        if (selectedWord) setSelectedWord(null);
        if (activeWritingCharacter) setActiveWritingCharacter(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCard, selectedWord, activeWritingCharacter]);

  const loadData = async () => {
    setLoading(true);
    const [cList, dList] = await Promise.all([
      fetchAllLearnedCards({
        deckId: selectedDeckId,
        status: selectedStatus,
        search: searchQuery,
      }),
      fetchDecks(),
    ]);
    setCards(cList);
    setDecks(dList);
    setLoading(false);
  };

  useEffect(() => {
    loadData();

    const handleDbUpdate = () => {
      loadData();
    };
    window.addEventListener('omnilife_db_updated', handleDbUpdate);
    return () => window.removeEventListener('omnilife_db_updated', handleDbUpdate);
  }, [selectedDeckId, selectedStatus, searchQuery]);

  // Matriks 4 nada gabungan: kartu user + dataset HSK 1–6 + pengisi kamus
  const [toneMatrix, setToneMatrix] = useState<{ rows: ToneMatrixRow[]; unparsedCards: LearnedCardItem[] }>({ rows: [], unparsedCards: [] });
  useEffect(() => {
    let alive = true;
    buildToneMatrix(cards).then((m) => {
      if (alive) setToneMatrix(m);
    });
    return () => {
      alive = false;
    };
  }, [cards]);
  const matrixStats = useMemo(() => toneMatrixStats(toneMatrix.rows), [toneMatrix]);
  const visibleMatrixRows = useMemo(() => {
    const all = toneMatrix.rows;
    const scoped = matrixScope === 'mine' ? all.filter((r) => r.ankiCount > 0) : all;
    return scoped.slice(0, visibleRows);
  }, [toneMatrix, matrixScope, visibleRows]);
  const scopedRowCount = matrixScope === 'mine'
    ? toneMatrix.rows.filter((r) => r.ankiCount > 0).length
    : toneMatrix.rows.length;

  // Audio Playback — prioritas: MP3 asli kartu Anki user → MP3 offline
  // bawaan (chineseAudioPlayer) → TTS sebagai fallback terakhir.
  const playCardAudio = (card: LearnedCardItem) => {
    const plain = card.frontContent.replace(/<[^>]*>/g, '').trim();
    try {
      if (card.audioUrls && card.audioUrls.length > 0) {
        const audio = new Audio(card.audioUrls[0]);
        audio.play().catch(() => chineseAudioPlayer.playText(plain));
        return;
      }
    } catch (_) {
      /* lanjut ke audio offline */
    }
    chineseAudioPlayer.playText(plain, chineseAudioPlayer.getSpeed());
  };

  const playDatasetAudio = (word: ChineseWord) => {
    try {
      // MP3 offline untuk kata & kalimat sudah dibundle lewat build script;
      // chineseAudioPlayer otomatis fallback ke TTS bila file belum ada.
      chineseAudioPlayer.playText(word.hanzi, chineseAudioPlayer.getSpeed());
    } catch (_) {}
  };

  /** Terjemahkan kartu Anki lama (masih berbahasa Inggris) ke Indonesia, sekali jalan. */
  const handleTranslateAllCards = async () => {
    if (translating) return;
    setTranslating(true);
    try {
      const all = await fetchAllLearnedCards({ deckId: 'all', status: 'all', search: '' });
      let changed = 0;
      for (const card of all) {
        const translatedBack = translateCardContentToIndonesian(card.backContent);
        const translatedFront = translateCardContentToIndonesian(card.frontContent);
        if (translatedBack !== card.backContent || translatedFront !== card.frontContent) {
          await executeSql(
            `UPDATE flashcard_cards SET front_content = ?, back_content = ?, updated_at = ? WHERE id = ?;`,
            [translatedFront, translatedBack, new Date().toISOString(), card.id]
          );
          changed += 1;
        }
      }
      if (changed > 0) await loadData();
      alert(`Selesai: ${changed} kartu diperbarui ke Bahasa Indonesia.`);
    } finally {
      setTranslating(false);
    }
  };

  // Status Badge Colors
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'mastered':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Mastered</span>;
      case 'review':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">Review SRS</span>;
      case 'learning':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Learning</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">Baru (New)</span>;
    }
  };

  // Count by status
  const counts = useMemo(() => {
    return {
      all: cards.length,
      mastered: cards.filter((c) => c.studyStatus === 'mastered').length,
      review: cards.filter((c) => c.studyStatus === 'review').length,
      learning: cards.filter((c) => c.studyStatus === 'learning').length,
      new: cards.filter((c) => c.studyStatus === 'not_started').length,
    };
  }, [cards]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Header & Summary Stats */}
      <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 rounded-2xl sm:rounded-3xl">
        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1">
            <h3 className="font-display text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" /> Kosakata & Hanzi dari Anki Decks
            </h3>
            <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400">
              Daftar seluruh kartu dan karakter Hanzi yang telah diimpor dan dipelajari melalui Anki SRS.
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer shrink-0 ${
                selectedStatus === 'all'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              Semua ({counts.all})
            </button>
            <button
              onClick={() => setSelectedStatus('not_started')}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer shrink-0 ${
                selectedStatus === 'not_started'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
              }`}
            >
              Baru ({counts.new})
            </button>
            <button
              onClick={() => setSelectedStatus('learning')}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer shrink-0 ${
                selectedStatus === 'learning'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
              }`}
            >
              Belajar ({counts.learning})
            </button>
            <button
              onClick={() => setSelectedStatus('review')}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer shrink-0 ${
                selectedStatus === 'review'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400'
              }`}
            >
              Review ({counts.review})
            </button>
            <button
              onClick={() => setSelectedStatus('mastered')}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer shrink-0 ${
                selectedStatus === 'mastered'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              Mastered ({counts.mastered})
            </button>
            <button
              type="button"
              onClick={handleTranslateAllCards}
              disabled={translating}
              className="ml-auto px-2.5 py-1 rounded-full text-[11px] font-bold border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1 shrink-0"
              title="Terjemahkan isi kartu Anki yang masih berbahasa Inggris ke Bahasa Indonesia (sekali jalan)"
            >
              <Languages className="w-3.5 h-3.5" />
              {translating ? 'Menerjemahkan…' : 'Terjemahkan ke Indonesia'}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 2. Filters, Search Bar & View Mode Switcher */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 sm:gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
          {/* Search Bar */}
          <div className="relative w-full sm:w-72 md:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari Hanzi, Pinyin, atau Arti..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>

          {/* Deck Dropdown Filter */}
          <div className="w-full sm:w-auto flex items-center gap-2">
            <Layers className="w-4 h-4 text-zinc-400 shrink-0" />
            <select
              value={selectedDeckId}
              onChange={(e) => setSelectedDeckId(e.target.value)}
              className="w-full sm:w-56 md:w-64 px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs truncate"
            >
              <option value="all">Semua Koleksi Deck</option>
              {decks.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.cardCount} kartu)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl border border-zinc-200/80 dark:border-zinc-700/80 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid Kartu</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('pinyin_tones')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'pinyin_tones'
                ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
            title="Kelompokkan per suku kata Pinyin dan 4 Nada (Nada 1-4)"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Grup 4 Nada Pinyin</span>
            {toneMatrix.rows.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                {toneMatrix.rows.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 3. Cards Grid or Pinyin Tone Matrix View */}
      {loading ? (
        <div className="p-12 text-center text-xs text-zinc-400">Memuat kosakata Anki...</div>
      ) : cards.length === 0 && viewMode === 'grid' ? (
        <Card className="p-12 text-center bg-white dark:bg-zinc-900 border-dashed border-zinc-300 dark:border-zinc-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Belum Ada Kartu / Kosakata</h4>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Impor deck .apkg dari Anki atau buat deck baru untuk mulai menambahkan kosakata Mandarin.
          </p>
        </Card>
      ) : viewMode === 'pinyin_tones' ? (
        /* ══ MATRIKS 4 NADA — DATASET HSK 1–3 + KARTU ANKI ═══════════════════ */
        <div className="space-y-4">
          {/* Header Info, Statistik & Sakelar Cakupan */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/40">
            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Matriks 4 Nada — HSK 1–3 lengkap + kartumu
              </h4>
              <p className="text-[11px] text-blue-700/80 dark:text-blue-300/80">
                {matrixStats.filledSlots} dari {matrixStats.totalSlots} sel terisi
                {' · '}{matrixStats.ankiSlots} sel dari kartumu (audio MP3 asli)
                {' · '}{matrixStats.invalidSlots} sel ditandai "nada tak dipakai"
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <div className="flex items-center bg-white dark:bg-zinc-900 border border-blue-200 dark:border-blue-900/60 rounded-xl p-0.5">
                <button
                  type="button"
                  onClick={() => { setMatrixScope('full'); setVisibleRows(40); }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${matrixScope === 'full' ? 'bg-blue-600 text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
                >
                  Semua suku kata
                </button>
                <button
                  type="button"
                  onClick={() => { setMatrixScope('mine'); setVisibleRows(40); }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${matrixScope === 'mine' ? 'bg-blue-600 text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
                >
                  Hanya kartuku
                </button>
              </div>
              {([1, 2, 3, 4] as const).map((tNum) => (
                <span
                  key={tNum}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${TONE_STYLES[tNum].badge}`}
                >
                  {TONE_STYLES[tNum].label}
                </span>
              ))}
            </div>
          </div>

          {scopedRowCount === 0 ? (
            <Card className="p-12 text-center bg-white dark:bg-zinc-900 border-dashed border-zinc-300 dark:border-zinc-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Belum Ada Kartu Hanzi Tunggal</h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                {matrixScope === 'mine'
                  ? 'Koleksimu belum punya kartu Hanzi tunggal — ganti ke "Semua suku kata" untuk menjelajah seluruh HSK 1–3.'
                  : 'Impor deck .apkg — kartu dengan Hanzi 1 karakter akan muncul otomatis di matriks ini.'}
              </p>
            </Card>
          ) : (
            <>
              {visibleMatrixRows.map((row) => (
                <MatrixRowCard
                  key={row.basePinyin}
                  row={row}
                  onOpenAnki={(card) => setSelectedCard(card)}
                  onOpenWord={(word) => setSelectedWord(word)}
                  onPlayAnki={(card) => playCardAudio(card)}
                  onPlayWord={(word) => playDatasetAudio(word)}
                />
              ))}
              {visibleMatrixRows.length < scopedRowCount && (
                <Button
                  variant="outline"
                  onClick={() => setVisibleRows((v) => v + 40)}
                  className="w-full cursor-pointer text-xs"
                >
                  Tampilkan lagi ({scopedRowCount - visibleMatrixRows.length} baris tersisa)
                </Button>
              )}
            </>
          )}
        </div>
      ) : (
        /* ══ STANDARD CARDS GRID VIEW ═════════════════════════════════════════ */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => {
            const hanziChars = card.hanziExtract ? Array.from(card.hanziExtract) : [];

            return (
              <Card
                key={card.id}
                className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 hover:border-blue-500/50 transition-all p-4 space-y-3 flex flex-col justify-between shadow-xs group"
              >
                <div className="space-y-2">
                  {/* Top Bar: Deck Name & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 truncate max-w-[140px]">
                      {card.deckName}
                    </span>
                    {getStatusBadge(card.studyStatus)}
                  </div>

                  {/* HANZI + PINYIN + ARTI (hanzi cuma 1x, arti Indonesia) */}
                  {(() => {
                    const disp = extractCardDisplay(card);
                    return disp.hanzi ? (
                      <div className="pt-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight break-words">
                            {disp.hanzi}
                            {disp.pinyin && (
                              <span className="block text-sm font-bold text-purple-600 dark:text-purple-400 font-mono tracking-normal">
                                {disp.pinyin}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => playCardAudio(card)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors shrink-0 cursor-pointer"
                            title="Dengarkan Pengucapan Audio"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                        {disp.meaning && (
                          <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium line-clamp-2 leading-snug">
                            {disp.meaning}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="pt-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div
                            className="anki-card-content text-lg font-bold text-zinc-900 dark:text-zinc-100 max-w-none line-clamp-2 leading-snug w-full"
                            dangerouslySetInnerHTML={{ __html: card.frontContent }}
                          />
                          <button
                            type="button"
                            onClick={() => playCardAudio(card)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors shrink-0 cursor-pointer"
                            title="Dengarkan Pengucapan Audio"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div
                          className="anki-card-content text-xs text-zinc-600 dark:text-zinc-300 font-medium line-clamp-2 max-w-none w-full"
                          dangerouslySetInnerHTML={{ __html: card.backContent }}
                        />
                      </div>
                    );
                  })()}
                </div>

                {/* Bottom Actions & SRS Info */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>Reps: {card.repetitions}</span>
                    <span>•</span>
                    <span>{card.intervalDays} hr</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* If contains Hanzi character, allow Writing Practice */}
                    {hanziChars.length > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setActiveWritingCharacter({
                            character: hanziChars.join(''),
                            pinyin: '',
                            meaning: card.backContent.replace(/<[^>]*>/g, '').trim().slice(0, 80),
                          });
                        }}
                        className="h-7 px-2 text-[11px] text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                        title={hanziChars.length > 1 ? `Latihan semua hanzi (${hanziChars.join('')}) satu per satu` : 'Latihan Menulis Hanzi'}
                      >
                        <PenTool className="w-3 h-3 mr-1" /> Tulis ({hanziChars.join('')})
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedCard(card)}
                      className="h-7 px-2 text-[11px] text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer"
                    >
                      Detail <ChevronRight className="w-3 h-3 ml-0.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* 4. Responsive Card Detail Modal (Fixed for Mobile & Desktop) */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCard(null);
          }}
        >
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl sm:rounded-3xl max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
            {/* Modal Header - Sticky & Always Visible on Mobile */}
            <div className="sticky top-0 z-10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-4 sm:px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 truncate max-w-[160px]">
                  {selectedCard.deckName}
                </span>
                {getStatusBadge(selectedCard.studyStatus)}
              </div>
              <button
                type="button"
                onClick={() => setSelectedCard(null)}
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer shrink-0"
                aria-label="Tutup detail modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Depan (Front)</span>
                <div
                  className="text-xl font-bold text-zinc-900 dark:text-zinc-100 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800/80 prose dark:prose-invert max-w-none break-words"
                  dangerouslySetInnerHTML={{ __html: selectedCard.frontContent }}
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Belakang (Back)</span>
                <div
                  className="text-sm font-medium text-zinc-800 dark:text-zinc-200 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800/80 prose dark:prose-invert max-w-none break-words"
                  dangerouslySetInnerHTML={{ __html: selectedCard.backContent }}
                />
              </div>

              {/* SRS Stats */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-center">
                <div>
                  <span className="text-[10px] sm:text-[11px] text-zinc-500 block">Repetisi</span>
                  <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">{selectedCard.repetitions} kali</span>
                </div>
                <div>
                  <span className="text-[10px] sm:text-[11px] text-zinc-500 block">Interval</span>
                  <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">{selectedCard.intervalDays} hari</span>
                </div>
                <div>
                  <span className="text-[10px] sm:text-[11px] text-zinc-500 block">Ease Factor</span>
                  <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">{selectedCard.easeFactor.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer - Sticky Bottom */}
            <div className="sticky bottom-0 z-10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-4 sm:px-5 py-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2 shrink-0 pb-safe">
              <Button
                variant="outline"
                size="sm"
                onClick={() => playCardAudio(selectedCard)}
                className="text-xs cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 mr-1" /> Putar Audio
              </Button>
              <Button
                size="sm"
                onClick={() => setSelectedCard(null)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer px-4"
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 4b. Detail Kata Dataset (dari Matriks 4 Nada) */}
      {selectedWord && (
        <VocabularyDetailModal
          word={selectedWord}
          onClose={() => setSelectedWord(null)}
          onStartHanziWriting={(w2) => {
            setSelectedWord(null);
            setActiveWritingCharacter({ character: w2.hanzi, pinyin: w2.pinyin, meaning: w2.meanings[0] || '' });
          }}
        />
      )}

      {/* 5. Hanzi Stroke Practice Modal */}
      {activeWritingCharacter && (
        <HanziPracticeView
          character={activeWritingCharacter.character}
          pinyin={activeWritingCharacter.pinyin}
          meaning={activeWritingCharacter.meaning}
          onClose={() => setActiveWritingCharacter(null)}
        />
      )}
    </div>
  );
}

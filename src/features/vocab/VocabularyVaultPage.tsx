import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Volume2,
  BookOpen,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  PenTool,
} from 'lucide-react';
import { course } from '@/data/course';
import type { CourseWord } from '@/data/course.types';
import { meaningOf } from '@/data/course.types';
import { StrokeOrderViewer } from '@/features/chinese/StrokeOrderViewer';
import { speakHanzi, clickTick } from '@/lib/fx';
import { usePrefs } from '@/lib/prefs';

const WORDS_PER_PAGE = 36;

function stripTone(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ü/g, 'v')
    .toLowerCase();
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getLevelNumber(levelStr: string): number {
  if (levelStr === '7-9') return 7;
  const n = Number(levelStr);
  return Number.isNaN(n) ? 99 : n;
}

function scoreWord(w: CourseWord, rawQuery: string): number {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return 0;
  const qToneFree = stripTone(q);

  let score = 0;

  // 1. Hanzi exact or partial match
  if (w.hanzi === q) score += 2000;
  else if (w.hanzi.startsWith(q)) score += 1200;
  else if (w.hanzi.includes(q)) score += 800;

  // 2. Traditional Hanzi
  if (w.trad && w.trad !== w.hanzi) {
    if (w.trad === q) score += 1800;
    else if (w.trad.startsWith(q)) score += 1000;
    else if (w.trad.includes(q)) score += 600;
  }

  // 3. Pinyin matching (tone-free and tone-aware)
  const pinyinFree = stripTone(w.pinyin);
  const syllables = pinyinFree.split(/\s+/).filter(Boolean);

  if (pinyinFree === qToneFree) {
    score += 1500;
  } else if (syllables.includes(qToneFree)) {
    score += 1000;
    if (syllables[0] === qToneFree) score += 200; // Prioritize first syllable match
  } else if (pinyinFree.startsWith(qToneFree)) {
    score += 700;
  } else if (syllables.some((s) => s.startsWith(qToneFree))) {
    score += 500;
  } else if (pinyinFree.includes(qToneFree)) {
    score += 200;
  }

  // 4. Indonesian Meaning match
  if (w.meanId) {
    const meanIdLower = w.meanId.toLowerCase();
    const wordBoundaryRegex = new RegExp('(?:\\b|^|\\s|[;,])' + escapeRegExp(q) + '(?:\\b|$|\\s|[;,])', 'i');
    if (wordBoundaryRegex.test(meanIdLower)) {
      score += 600;
    } else if (meanIdLower.includes(q)) {
      score += 150;
    }
  }

  // 5. English Meaning match
  // Crucial: for short queries (<= 3 chars, e.g. "bu"), require word boundaries to avoid matching "but" or "buy"
  if (w.meanEn && Array.isArray(w.meanEn)) {
    for (const en of w.meanEn) {
      const enLower = en.toLowerCase();
      const wordBoundaryRegex = new RegExp('(?:\\b|^|\\s|[;,])' + escapeRegExp(q) + '(?:\\b|$|\\s|[;,])', 'i');
      if (wordBoundaryRegex.test(enLower)) {
        score += q.length <= 3 ? 100 : 300;
        break;
      } else if (q.length > 3 && enLower.includes(q)) {
        score += 50;
        break;
      }
    }
  }

  return score;
}

interface VocabularyVaultPageProps {
  initialQuery?: string;
  initialWordId?: string;
}

export function VocabularyVaultPage({ initialQuery = '', initialWordId }: VocabularyVaultPageProps) {
  const { sound } = usePrefs();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'freq' | 'pinyin' | 'level_asc' | 'level_desc'>(
    initialQuery ? 'relevance' : 'freq'
  );
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Stroke Order Modal State
  const [strokeModalWord, setStrokeModalWord] = useState<CourseWord | null>(null);
  const [activeCharIndex, setActiveCharIndex] = useState<number>(0);

  // If initialWordId is provided, open its stroke order modal on load
  useEffect(() => {
    if (initialWordId) {
      const target = course.words.find((w) => w.id === initialWordId);
      if (target) {
        setStrokeModalWord(target);
        setActiveCharIndex(0);
      }
    }
  }, [initialWordId]);

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
      setSortBy('relevance');
    }
  }, [initialQuery]);

  // Reset to page 1 on filter or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedLevel, sortBy]);

  // Filtered and sorted word list
  const filteredWords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    // 1. Filter by Level and Search Query
    const matched: { word: CourseWord; score: number }[] = [];

    for (const w of course.words) {
      if (selectedLevel !== 'all' && w.level !== selectedLevel) {
        continue;
      }

      if (!q) {
        matched.push({ word: w, score: 0 });
      } else {
        const score = scoreWord(w, q);
        if (score > 0) {
          matched.push({ word: w, score });
        }
      }
    }

    // 2. Sort results
    matched.sort((a, b) => {
      // If there is an active search query and sortBy is 'relevance', sort by score desc first
      if (q && sortBy === 'relevance') {
        const scoreDiff = b.score - a.score;
        if (scoreDiff !== 0) return scoreDiff;
        return (a.word.freq || 999999) - (b.word.freq || 999999);
      }

      if (sortBy === 'freq') {
        return (a.word.freq || 999999) - (b.word.freq || 999999);
      }

      if (sortBy === 'pinyin') {
        const cleanA = stripTone(a.word.pinyin);
        const cleanB = stripTone(b.word.pinyin);
        const comp = cleanA.localeCompare(cleanB);
        return comp !== 0 ? comp : a.word.pinyin.localeCompare(b.word.pinyin);
      }

      if (sortBy === 'level_asc') {
        const lvA = getLevelNumber(a.word.level);
        const lvB = getLevelNumber(b.word.level);
        if (lvA !== lvB) return lvA - lvB;
        return (a.word.freq || 999999) - (b.word.freq || 999999);
      }

      if (sortBy === 'level_desc') {
        const lvA = getLevelNumber(a.word.level);
        const lvB = getLevelNumber(b.word.level);
        if (lvA !== lvB) return lvB - lvA;
        return (a.word.freq || 999999) - (b.word.freq || 999999);
      }

      // Default fallback: when search query is active, sort by relevance
      if (q) {
        const scoreDiff = b.score - a.score;
        if (scoreDiff !== 0) return scoreDiff;
      }
      return (a.word.freq || 999999) - (b.word.freq || 999999);
    });

    return matched.map((item) => item.word);
  }, [searchQuery, selectedLevel, sortBy]);

  // Pagination calculation
  const totalItems = filteredWords.length;
  const totalPages = Math.ceil(totalItems / WORDS_PER_PAGE) || 1;
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedWords = useMemo(() => {
    const start = (validCurrentPage - 1) * WORDS_PER_PAGE;
    return filteredWords.slice(start, start + WORDS_PER_PAGE);
  }, [filteredWords, validCurrentPage]);

  // Open Stroke Order Modal
  const handleOpenStrokeModal = (w: CourseWord) => {
    clickTick(sound);
    setStrokeModalWord(w);
    setActiveCharIndex(0);
  };

  const handleCloseStrokeModal = () => {
    setStrokeModalWord(null);
    setActiveCharIndex(0);
  };

  // Split word into individual Hanzi characters for stroke viewer
  const wordChars = useMemo(() => {
    if (!strokeModalWord) return [];
    // Filter only Chinese character glyphs
    const chars = strokeModalWord.hanzi.split('').filter((c) => /[\u4e00-\u9fa5]/.test(c));
    return chars.length > 0 ? chars : strokeModalWord.hanzi.split('');
  }, [strokeModalWord]);

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* ── HEADER BANNER ── */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#881337] via-[#9F1239] to-[#C0392B] p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-bold text-rose-100 backdrop-blur-xs border border-white/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Perpustakaan Aksara & Kosakata Mandarin</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Gudang Kosakata Lengkap
          </h1>
          <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
            Jelajahi <b>{course.words.length.toLocaleString()} kata</b> kurikulum HSK 1–6 dengan pelafalan Putonghua, arti bahasa Indonesia, dan <b>animasi urutan goresan stroke resmi</b> setiap karakter.
          </p>
        </div>

        {/* Decorative Seal Background Glyph */}
        <div className="absolute right-4 -bottom-6 font-serif text-[130px] font-black text-white/5 select-none pointer-events-none">
          字
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ── */}
      <div className="bg-[#FFFDF9] dark:bg-[#151E32] border border-zinc-200 dark:border-[#24324E] rounded-3xl p-4 sm:p-6 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari hanzi, pinyin (misal 'ni' / 'nǐ'), atau arti bahasa Indonesia..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-zinc-200 dark:border-[#2D3D60] bg-white dark:bg-[#0B111E] text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-[#C0392B] dark:focus:border-[#FB7185] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center justify-between md:justify-start gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 shrink-0">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="flex-1 md:flex-none px-3 py-2.5 rounded-2xl border border-zinc-200 dark:border-[#2D3D60] bg-white dark:bg-[#0B111E] text-zinc-900 dark:text-zinc-100 text-xs font-bold focus:outline-hidden cursor-pointer"
            >
              {searchQuery.trim() && <option value="relevance">Paling Relevan (Pencarian)</option>}
              <option value="freq">Paling Populer (Frekuensi)</option>
              <option value="pinyin">Alfabetis Pinyin (A-Z)</option>
              <option value="level_asc">Tingkat HSK (Rendah ➔ Tinggi)</option>
              <option value="level_desc">Tingkat HSK (Tinggi ➔ Rendah)</option>
            </select>
          </div>
        </div>

        {/* HSK Level Pills Filter */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 shrink-0 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Level:
          </span>
          <button
            type="button"
            onClick={() => {
              clickTick(sound);
              setSelectedLevel('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
              selectedLevel === 'all'
                ? 'bg-[#C0392B] text-white border-[#A93226] shadow-xs'
                : 'bg-white dark:bg-[#1C2742] text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-[#2D3D60] hover:bg-zinc-50 dark:hover:bg-[#253252]'
            }`}
          >
            Semua HSK ({course.words.length.toLocaleString()})
          </button>

          {['1', '2', '3', '4', '5', '6', '7-9'].map((lv) => {
            const count = course.counts[lv] || course.words.filter((w) => w.level === lv).length;
            const isSelected = selectedLevel === lv;
            return (
              <button
                key={lv}
                type="button"
                onClick={() => {
                  clickTick(sound);
                  setSelectedLevel(lv);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                  isSelected
                    ? 'bg-[#C0392B] text-white border-[#A93226] shadow-xs'
                    : 'bg-white dark:bg-[#1C2742] text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-[#2D3D60] hover:bg-zinc-50 dark:hover:bg-[#253252]'
                }`}
              >
                HSK {lv} ({count.toLocaleString()})
              </button>
            );
          })}
        </div>
      </div>

      {/* ── STATUS BAR & RESULTS COUNT ── */}
      <div className="flex items-center justify-between px-2 text-xs font-bold text-zinc-500 dark:text-zinc-400">
        <div>
          Menampilkan <span className="text-zinc-900 dark:text-zinc-100 font-extrabold">{totalItems.toLocaleString()}</span> kosakata ditemukan
        </div>
        <div>
          Halaman <span className="text-zinc-900 dark:text-zinc-100">{validCurrentPage}</span> dari {totalPages}
        </div>
      </div>

      {/* ── VOCABULARY CARD GRID ── */}
      {paginatedWords.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-[#FFFDF9] dark:bg-[#151E32] rounded-3xl border border-zinc-200 dark:border-[#24324E] p-8">
          <div className="text-4xl">🔍</div>
          <h3 className="font-serif text-lg font-bold text-zinc-800 dark:text-zinc-200">Tidak ada kosakata yang cocok</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
            Coba cari dengan kata kunci lain atau ubah filter tingkat HSK.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedLevel('all');
            }}
            className="px-4 py-2 rounded-xl bg-[#C0392B] text-white font-bold text-xs cursor-pointer shadow-xs hover:bg-[#a93226]"
          >
            Reset Pencarian
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedWords.map((w) => {
            const indonesianMeaning = meaningOf(w);

            return (
              <div
                key={w.id}
                className="group relative bg-[#FFFDF9] dark:bg-[#151E32] border border-zinc-200 dark:border-[#24324E] rounded-3xl p-4 sm:p-5 flex flex-col justify-between space-y-3 transition-all hover:-translate-y-1 hover:border-[#C0392B]/50 dark:hover:border-[#FB7185]/50 shadow-xs"
              >
                {/* Card Top: Badges & Audio */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-50 dark:bg-rose-950/60 text-[#C0392B] dark:text-[#FB7185] border border-rose-200 dark:border-rose-900">
                      HSK {w.level}
                    </span>
                    {w.pos && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                        {w.pos}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakHanzi(w.hanzi);
                    }}
                    className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-[#1C2742] text-zinc-600 dark:text-zinc-300 hover:text-[#C0392B] dark:hover:text-[#FB7185] hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    title={`Dengarkan pelafalan ${w.hanzi}`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Card Middle: Hanzi & Pinyin */}
                <div className="text-center py-1 space-y-1">
                  <div className="font-serif text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-wide group-hover:text-[#C0392B] dark:group-hover:text-[#FB7185] transition-colors">
                    {w.hanzi}
                  </div>
                  <div className="font-mono text-xs sm:text-sm font-bold text-indigo-700 dark:text-indigo-400">
                    {w.pinyin}
                  </div>
                  {w.trad && w.trad !== w.hanzi && (
                    <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-serif">
                      Tradisional: {w.trad}
                    </div>
                  )}
                </div>

                {/* Card Meaning */}
                <div className="p-2.5 rounded-2xl bg-zinc-50/70 dark:bg-[#0B111E] border border-zinc-100 dark:border-[#24324E] text-center min-h-[48px] flex items-center justify-center">
                  <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 leading-snug break-words">
                    {indonesianMeaning}
                  </p>
                </div>

                {/* Card Bottom: Stroke Order Button */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => handleOpenStrokeModal(w)}
                    className="w-full py-2 px-3 rounded-xl bg-white dark:bg-[#1C2742] border border-zinc-200 dark:border-[#2D3D60] hover:bg-rose-50 dark:hover:bg-rose-950/30 text-zinc-700 dark:text-zinc-200 hover:text-[#C0392B] dark:hover:text-[#FB7185] hover:border-rose-200 dark:hover:border-rose-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <PenTool className="w-3.5 h-3.5 text-[#C0392B] dark:text-[#FB7185]" />
                    <span>Lihat Urutan Goresan</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── PAGINATION CONTROLS ── */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 px-2">
          <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
            Halaman {validCurrentPage} dari {totalPages} ({totalItems.toLocaleString()} kosakata)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={validCurrentPage <= 1}
              onClick={() => {
                clickTick(sound);
                setCurrentPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-2 rounded-xl border border-zinc-200 dark:border-[#2D3D60] bg-white dark:bg-[#1C2742] text-zinc-700 dark:text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-[#253252] cursor-pointer"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Quick page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
              let pageNum = validCurrentPage - 2 + idx;
              if (validCurrentPage <= 3) pageNum = idx + 1;
              if (validCurrentPage >= totalPages - 2) pageNum = totalPages - 4 + idx;
              if (pageNum < 1 || pageNum > totalPages) return null;

              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => {
                    clickTick(sound);
                    setCurrentPage(pageNum);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-8 h-8 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                    validCurrentPage === pageNum
                      ? 'bg-[#C0392B] text-white shadow-xs'
                      : 'bg-white dark:bg-[#1C2742] text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-[#2D3D60] hover:bg-zinc-50 dark:hover:bg-[#253252]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              disabled={validCurrentPage >= totalPages}
              onClick={() => {
                clickTick(sound);
                setCurrentPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-2 rounded-xl border border-zinc-200 dark:border-[#2D3D60] bg-white dark:bg-[#1C2742] text-zinc-700 dark:text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-[#253252] cursor-pointer"
              title="Halaman Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── STROKE ORDER MODAL (Interactive Hanzi Animation) ── */}
      {strokeModalWord && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={handleCloseStrokeModal}
        >
          <div
            className="w-full max-w-lg bg-[#FFFDF9] dark:bg-[#151E32] border border-zinc-300 dark:border-[#24324E] rounded-3xl p-5 sm:p-7 space-y-5 shadow-2xl relative animate-in zoom-in-95 duration-200 text-zinc-900 dark:text-zinc-100 my-auto"
            style={{ boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.4)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-[#C0392B] dark:text-[#FB7185] border border-rose-300 dark:border-rose-800 flex items-center justify-center font-bold text-lg">
                  笔
                </span>
                <div>
                  <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                    Urutan Goresan Aksara (笔顺)
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Animasi goresan pena resmi standar Makemeahanzi
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseStrokeModal}
                className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#1C2742] hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Character Info Strip */}
            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-[#0B111E] border border-zinc-200 dark:border-[#24324E] flex items-center justify-between gap-3">
              <div>
                <span className="text-xs text-zinc-400 block font-bold">Kosakata:</span>
                <span className="font-serif text-xl font-bold text-[#C0392B] dark:text-[#FB7185]">
                  {strokeModalWord.hanzi}
                </span>
                <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-400 ml-2">
                  [{strokeModalWord.pinyin}]
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => speakHanzi(strokeModalWord.hanzi)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1C2742] border border-zinc-200 dark:border-[#2D3D60] text-zinc-700 dark:text-zinc-200 hover:text-[#C0392B] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Putar
                </button>
              </div>
            </div>

            {/* Multi-Character Tab Switcher (if word has >1 character, e.g. 学习) */}
            {wordChars.length > 1 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Pilih Karakter untuk Dilihat Goresannya:
                </span>
                <div className="flex items-center gap-2">
                  {wordChars.map((ch, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        clickTick(sound);
                        setActiveCharIndex(idx);
                      }}
                      className={`px-4 py-2 rounded-2xl font-serif text-lg font-bold border transition-all cursor-pointer flex-1 ${
                        activeCharIndex === idx
                          ? 'bg-[#C0392B] text-white border-[#A93226] shadow-sm'
                          : 'bg-white dark:bg-[#1C2742] text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-[#2D3D60] hover:bg-zinc-50'
                      }`}
                    >
                      {ch} <span className="text-xs font-sans opacity-80">(Karakter {idx + 1})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stroke Order Visualizer Canvas */}
            <div className="flex flex-col items-center justify-center p-4 bg-zinc-50/50 dark:bg-[#0B111E] rounded-3xl border border-zinc-200 dark:border-[#24324E]">
              {wordChars[activeCharIndex] && (
                <StrokeOrderViewer
                  character={wordChars[activeCharIndex]}
                  pinyin={strokeModalWord.pinyin}
                  meaning={meaningOf(strokeModalWord)}
                />
              )}
            </div>

            {/* Meaning & Details Footer */}
            <div className="space-y-1 text-center">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                <b>Arti:</b> {meaningOf(strokeModalWord)}
              </div>
              {strokeModalWord.meanEn?.length > 0 && (
                <div className="text-[11px] text-zinc-400 dark:text-zinc-500 italic">
                  Inggris: {strokeModalWord.meanEn.slice(0, 3).join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

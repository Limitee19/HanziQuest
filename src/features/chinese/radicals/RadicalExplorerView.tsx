import { useEffect, useMemo, useState } from 'react';
import { Search, X, ChevronLeft, PenLine, LayoutGrid, GraduationCap, Trophy, CheckCircle2, Play } from 'lucide-react';
import {
  KANGXI_RADICALS,
  groupRadicalsByStrokes,
  groupRadicalsByLearningOrder,
  RadicalLearningGroup,
  RadicalEntry,
} from '@/services/chinese/radicals/radicalTable';
import {
  getHanziForRadical,
  getRadicalHanziCount,
  findRadicalsForHanzi,
  getWordsContaining,
  getExampleSentence,
  searchRadicals,
  getRadicalStats,
  HanziRadicalMatch,
} from '@/services/chinese/radicals/radicalMap';
import {
  loadRadicalIndexMode,
  saveRadicalIndexMode,
  loadQuizUnlockedTier,
  saveQuizUnlockedTier,
  getMasteredHanziSet,
  loadQuizScoreHistory,
  filterScoreHistory,
  QuizScoreRecord,
  RadicalIndexMode,
} from '@/services/chinese/radicals/radicalProgress';
import { ScoreTrend } from './ScoreTrend';
import { HanziPracticeView } from '../HanziPracticeView';
import { SpeakButton } from '../SpeakButton';
import { RadicalQuizView } from './RadicalQuizView';
import { RadicalHanziQuiz } from './RadicalHanziQuiz';

/**
 * RadicalExplorerView — Indeks Hanzi berdasarkan 214 Radikal Kangxi.
 * Gaya indeks kamus: padat informasi, visual tenang, tanpa kartu berlebihan.
 */
export function RadicalExplorerView() {
  const [selectedRadicalId, setSelectedRadicalId] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [practiceChar, setPracticeChar] = useState<{ char: string; pinyin: string; meaning: string } | null>(null);
  const [indexMode, setIndexModeState] = useState<RadicalIndexMode>('strokes');
  const [mastered, setMastered] = useState<Set<string>>(new Set());
  const [quizUnlockedTier, setQuizUnlockedTier] = useState(1);
  const [showQuiz, setShowQuiz] = useState(false);
  const [hanziQuiz, setHanziQuiz] = useState(false);
  const [scoreHistory, setScoreHistory] = useState<QuizScoreRecord[]>([]);

  // Muat preferensi Dan progres tersimpan: mode indeks, tier kuis, hanzi mastered
  useEffect(() => {
    let alive = true;
    (async () => {
      const [mode, tier, masteredSet, scores] = await Promise.all([
        loadRadicalIndexMode(),
        loadQuizUnlockedTier(),
        getMasteredHanziSet(),
        loadQuizScoreHistory(),
      ]);
      if (!alive) return;
      setIndexModeState(mode);
      setQuizUnlockedTier(tier);
      setMastered(masteredSet);
      setScoreHistory(scores);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const setIndexMode = (mode: RadicalIndexMode) => {
    setIndexModeState(mode);
    saveRadicalIndexMode(mode).catch(() => {});
  };

  const unlockTier = (tier: number) => {
    setQuizUnlockedTier(tier);
    saveQuizUnlockedTier(tier).catch(() => {});
  };

  /** Progres mastery satu radikal: berapa hanzi-nya yang sudah dikuasai di flashcard. */
  const masteredInRadical = (radicalId: number): { done: number; total: number } => {
    const list = getHanziForRadical(radicalId);
    const done = list.filter((m) => mastered.has(m.hanzi)).length;
    return { done, total: list.length };
  };

  const stats = useMemo(() => getRadicalStats(), []);
  const strokeGroups = useMemo(() => groupRadicalsByStrokes(), []);
  const learningGroups = useMemo(() => groupRadicalsByLearningOrder(getRadicalHanziCount), []);
  const searchResults = useMemo(
    () => (query.trim() ? searchRadicals(query) : null),
    [query]
  );

  const selectedRadical = selectedRadicalId !== null
    ? KANGXI_RADICALS.find((r) => r.id === selectedRadicalId) || null
    : null;
  const selectedHanzi = selectedRadical ? getHanziForRadical(selectedRadical.id) : [];

  const selectedMasteryPct = useMemo(() => {
    if (!selectedRadical || selectedHanzi.length === 0) return 0;
    const done = selectedHanzi.filter((m) => mastered.has(m.hanzi)).length;
    return Math.round((done / selectedHanzi.length) * 100);
  }, [selectedRadical, selectedHanzi, mastered]);

  // Riwayat skor kuis hafalan radikal yang sedang dibuka
  const selectedQuizHistory = useMemo(
    () => (selectedRadical ? filterScoreHistory(scoreHistory, 'radical', String(selectedRadical.id)) : []),
    [selectedRadical, scoreHistory]
  );

  // Keluar dari kuis hafalan saat pindah radikal
  useEffect(() => {
    setHanziQuiz(false);
  }, [selectedRadicalId]);

  // ── Mode latihan menulis ──
  if (practiceChar) {
    return (
      <HanziPracticeView
        character={practiceChar.char}
        pinyin={practiceChar.pinyin}
        meaning={practiceChar.meaning}
        onClose={() => setPracticeChar(null)}
      />
    );
  }

  // ── Mode kuis hafalan satu radikal ──
  if (hanziQuiz && selectedRadical) {
    return (
      <div className="space-y-4">
        <RadicalHanziQuiz radical={selectedRadical} onExit={() => setHanziQuiz(false)} />
      </div>
    );
  }

  const openPractice = (hanzi: string, pinyin: string, meaning: string) => {
    setPracticeChar({ char: hanzi, pinyin, meaning });
  };

  // ── Mode kuis radikal ──
  if (showQuiz) {
    return (
      <RadicalQuizView
        unlockedTier={quizUnlockedTier}
        onUnlockTier={unlockTier}
        onExit={() => setShowQuiz(false)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header ringkas + aksi */}
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            Indeks Radikal
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            214 radikal Kangxi · {stats.mappedHanzi} hanzi terpetakan · {stats.multiRadicalHanzi} hanzi multi-radikal
          </p>
          {mastered.size > 0 && (
            <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {mastered.size} hanzi dikuasai dari flashcard
            </p>
          )}
        </div>
        <button
          onClick={() => setShowQuiz(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 cursor-pointer transition-all self-center"
        >
          <Trophy className="w-3.5 h-3.5" />
          Kuis radikal
        </button>
      </div>

      {/* Search dua arah: hanzi / pinyin / arti / nomor radikal */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari hanzi, pinyin, arti (Indonesia), atau nomor radikal…"
          className="w-full pl-9 pr-9 py-2.5 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ── Hasil pencarian ── */}
      {searchResults && (
        <div className="space-y-5">
          {searchResults.radicals.length > 0 && (
            <section>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                Radikal ({searchResults.radicals.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {searchResults.radicals.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setQuery('');
                      setSelectedRadicalId(r.id);
                    }}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all cursor-pointer"
                  >
                    <span className="text-lg leading-none text-zinc-900 dark:text-zinc-100">{r.radical}</span>
                    <span className="text-left">
                      <span className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 leading-tight">{r.meaning}</span>
                      <span className="block text-[10px] text-zinc-400 leading-tight">№{r.id} · {getRadicalHanziCount(r.id)} hanzi</span>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {searchResults.hanziMatches.length > 0 && (
            <section>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                Hanzi ({searchResults.hanziMatches.length})
              </h3>
              <HanziResultList
                matches={searchResults.hanziMatches}
                onOpenPractice={openPractice}
                onSelectRadical={(id) => {
                  setQuery('');
                  setSelectedRadicalId(id);
                }}
              />
            </section>
          )}

          {searchResults.radicals.length === 0 && searchResults.hanziMatches.length === 0 && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 py-8 text-center">
              Tidak ada hasil untuk "{query}".
            </p>
          )}
        </div>
      )}

      {/* ── Detail radikal terpilih ── */}
      {!searchResults && selectedRadical && (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedRadicalId(null)}
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Kembali ke indeks
          </button>

          <div className="flex items-start gap-4 pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <span className="text-5xl leading-none text-zinc-900 dark:text-zinc-100">{selectedRadical.radical}</span>
            <div className="min-w-0">
              <p className="font-mono text-sm font-bold text-red-600 dark:text-red-400">{selectedRadical.pinyin}</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 capitalize">{selectedRadical.meaning}</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                №{selectedRadical.id} · {selectedRadical.strokes} goresan
                {selectedRadical.variants.length > 0 && ` · varian: ${selectedRadical.variants.join(' ')}`}
              </p>
              {selectedRadical.semanticHint && (
                <p className="mt-2 max-w-2xl text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {selectedRadical.semanticHint}
                </p>
              )}
            </div>
          </div>

          {selectedHanzi.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  {selectedHanzi.length} karakter memakai radikal ini
                </h3>
                <div className="flex items-center gap-2">
                  {selectedQuizHistory.length > 0 && (
                    <ScoreTrend
                      records={selectedQuizHistory}
                      compact
                      describe={() => `Kuis ${selectedRadical?.radical || ''}`}
                    />
                  )}
                  <span className="h-1.5 w-20 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                    <span
                      className={`block h-full transition-all ${selectedMasteryPct === 100 ? 'bg-emerald-500' : 'bg-emerald-400/70'}`}
                      style={{ width: `${selectedMasteryPct}%` }}
                    />
                  </span>
                  <span
                    className={`text-[10px] font-semibold whitespace-nowrap ${
                      selectedMasteryPct === 100
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-zinc-400 dark:text-zinc-500'
                    }`}
                  >
                    {selectedMasteryPct}% dikuasai
                  </span>
                  <span className="text-[10px] text-zinc-300 dark:text-zinc-600 whitespace-nowrap">
                    · urut HSK 1 → 3 · lalu abjad
                  </span>
                  {selectedHanzi.length >= 2 && (
                    <button
                      onClick={() => setHanziQuiz(true)}
                      className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 cursor-pointer transition-all whitespace-nowrap"
                    >
                      <Play className="w-3 h-3" />
                      Kuis hafalan
                    </button>
                  )}
                </div>
              </div>
              <RadicalLearnTable matches={selectedHanzi} mastered={mastered} onOpenPractice={openPractice} onSelectRadical={setSelectedRadicalId} />
            </div>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 py-6 text-center">
              Belum ada hanzi di dataset HSK 1–3 yang memakai radikal ini.
            </p>
          )}
        </div>
      )}

      {/* ── Grid indeks radikal: mode goresan / urutan belajar ── */}
      {!searchResults && !selectedRadical && (
        <div className="space-y-5">
          {/* Toggle mode indeks */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/70 w-fit">
            <button
              onClick={() => setIndexMode('strokes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                indexMode === 'strokes'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Urutan goresan
            </button>
            <button
              onClick={() => setIndexMode('learning')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                indexMode === 'learning'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Urutan belajar
            </button>
          </div>

          {(indexMode === 'strokes' ? strokeGroups : learningGroups).map((group) => {
            const isStrokes = indexMode === 'strokes';
            const lg = group as RadicalLearningGroup;
            const title = isStrokes ? `${(group as { strokes: number }).strokes} goresan` : lg.title;
            const subtitle = isStrokes ? undefined : lg.subtitle;
            const progress = isStrokes
              ? null
              : (group.radicals as RadicalEntry[]).reduce(
                  (acc, r) => {
                    const p = masteredInRadical(r.id);
                    return { done: acc.done + p.done, total: acc.total + p.total };
                  },
                  { done: 0, total: 0 }
                );

            return (
              <section key={isStrokes ? `s-${(group as { strokes: number }).strokes}` : `t-${lg.tier}`}>
                <div className="mb-2">
                  <div className="flex items-center gap-3">
                    {isStrokes ? (
                      <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
                        {title}
                      </h3>
                    ) : (
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-200 whitespace-nowrap flex items-center gap-1.5">
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                          lg.tier === 1
                            ? 'bg-blue-600 text-white'
                            : lg.tier === 2
                              ? 'bg-zinc-400 dark:bg-zinc-600 text-white'
                              : 'bg-transparent border border-zinc-300 dark:border-zinc-600 text-zinc-400 dark:text-zinc-500'
                        }`}>
                          {lg.tier}
                          </span>
                        {title}
                      </h3>
                    )}
                    <div className="h-px flex-1 bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800" />
                    <span className="text-[10px] text-zinc-300 dark:text-zinc-600">
                      {group.radicals.length} radikal
                    </span>
                  </div>
                  {subtitle && (
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1 max-w-2xl">{subtitle}</p>
                  )}
                  {!isStrokes && progress && progress.total > 0 && (
                    <div className="flex items-center gap-2 mt-1.5 max-w-sm">
                      <span className="h-1.5 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                        <span
                          className={`block h-full transition-all ${progress.done === progress.total ? 'bg-emerald-500' : 'bg-blue-500'}`}
                          style={{ width: `${Math.round((progress.done / progress.total) * 100)}%` }}
                        />
                      </span>
                      <span
                        className={`text-[10px] font-semibold whitespace-nowrap ${
                          progress.done === progress.total
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-zinc-400 dark:text-zinc-500'
                        }`}
                      >
                        {progress.done}/{progress.total} dikuasai
                      </span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-1.5">
                  {group.radicals.map((r) => {
                    const count = getRadicalHanziCount(r.id);
                    const prog = count > 0 ? masteredInRadical(r.id) : { done: 0, total: 0 };
                    const isFull = prog.total > 0 && prog.done === prog.total;
                    return (
                      <button
                        key={r.id}
                        onClick={() => setSelectedRadicalId(r.id)}
                        disabled={count === 0}
                        title={`${r.radical} · ${r.meaning} · ${count} hanzi${prog.total > 0 ? ` · ${prog.done}/${prog.total} dikuasai` : ''}`}
                        className={`group relative flex flex-col items-center py-2 rounded-lg border transition-all cursor-pointer ${
                          count === 0
                            ? 'border-transparent opacity-30 cursor-default'
                            : isFull
                              ? 'border-emerald-400/70 dark:border-emerald-700/70 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                              : 'border-zinc-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30'
                        }`}
                      >
                        <span
                          className={`text-xl leading-none text-zinc-900 dark:text-zinc-100 ${
                            isFull
                              ? 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                              : 'group-hover:text-blue-600 dark:group-hover:text-blue-400'
                          }`}
                        >
                          {r.radical}
                        </span>
                        <span className="text-[10px] text-zinc-400 mt-1 leading-none">
                          №{r.id}
                        </span>
                        {count > 0 && (
                          <span className="absolute top-1 right-1 text-[9px] font-bold text-blue-600 dark:text-blue-400">
                            {count}
                          </span>
                        )}
                        {prog.total > 0 && (
                          <span className="flex items-center gap-1 w-full px-1.5 mt-0.5">
                            <span className="h-1 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                              <span
                                className={`block h-full ${isFull ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                style={{ width: `${Math.round((prog.done / prog.total) * 100)}%` }}
                              />
                            </span>
                            {prog.done > 0 && (
                              <CheckCircle2
                                className={`w-2.5 h-2.5 shrink-0 ${isFull ? 'text-emerald-500' : 'text-blue-400'}`}
                              />
                            )}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* ── Panel detail karakter (nested di bawah daftar) ── */}
      {/* ditangani oleh HanziResultList → baris expandable */}
    </div>
  );
}

/** Daftar baris hanzi: hanzi besar + pinyin merah + arti Indonesia + chips radikal pembentuk. */
function HanziResultList({
  matches,
  onOpenPractice,
  onSelectRadical,
}: {
  matches: HanziRadicalMatch[];
  onOpenPractice: (hanzi: string, pinyin: string, meaning: string) => void;
  onSelectRadical: (radicalId: number) => void;
}) {
  const [expandedChar, setExpandedChar] = useState<string | null>(null);

  return (
    <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
      {matches.map((m) => {
        const words = getWordsContaining(m.hanzi);
        const radicals = findRadicalsForHanzi(m.hanzi);
        const isExpanded = expandedChar === m.hanzi;
        const primaryWord = m.words[0];
        const meaning = primaryWord ? primaryWord.meanings.join(', ') : '';

        return (
          <div key={m.hanzi}>
            <div
              role="button"
              tabIndex={0}
              onClick={() => setExpandedChar(isExpanded ? null : m.hanzi)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setExpandedChar(isExpanded ? null : m.hanzi);
              }}
              className="flex items-center gap-3 py-2.5 px-1 -mx-1 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer transition-all"
            >
              <span className="text-2xl leading-none text-zinc-900 dark:text-zinc-100 w-9 text-center shrink-0">
                {m.hanzi}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-mono text-sm font-bold text-red-600 dark:text-red-400">{m.pinyin}</span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{meaning}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                    HSK {m.hskLevel}
                  </span>
                  {radicals.map((r) => (
                    <span key={r.id} className="text-[10px] text-zinc-400 dark:text-zinc-500">
                      {r.radical}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPractice(m.hanzi, m.pinyin, meaning);
                }}
                title="Latihan tulis hanzi ini"
                className="p-2 rounded-lg text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 cursor-pointer transition-all shrink-0"
              >
                <PenLine className="w-4 h-4" />
              </button>
            </div>

            {/* Expanded: kata-kata dataset yang memuat karakter + chips radikal */}
            {isExpanded && (
              <div className="pb-3 pl-12 pr-2 space-y-2">
                {radicals.length > 1 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Terdeteksi oleh {radicals.length} radikal:</span>
                    {radicals.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => onSelectRadical(r.id)}
                        className="text-[11px] px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 text-zinc-600 dark:text-zinc-300 cursor-pointer transition-all"
                      >
                        {r.radical} {r.meaning}
                      </button>
                    ))}
                  </div>
                )}
                {words.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Kata yang memuat:</span>
                    {words.slice(0, 6).map((w) => (
                      <div key={w.id} className="flex items-baseline gap-2 text-xs">
                        <span className="text-sm text-zinc-900 dark:text-zinc-100">{w.hanzi}</span>
                        <span className="font-mono text-red-500 dark:text-red-400">{w.pinyin}</span>
                        <span className="text-zinc-500 dark:text-zinc-400">{w.meanings.join(', ')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Tabel belajar satu radikal — gaya kamus:
 * Hanzi · Pinyin · Arti · Contoh kalimat · Pinyin · Arti kalimat.
 * Desktop: tabel 6 kolom. Layar sempit: kalimat turun ke baris kedua.
 * Baris expand menampilkan dekomposisi radikal + kata yang memuat karakter.
 */
function RadicalLearnTable({
  matches,
  mastered,
  onOpenPractice,
  onSelectRadical,
}: {
  matches: HanziRadicalMatch[];
  mastered: Set<string>;
  onOpenPractice: (hanzi: string, pinyin: string, meaning: string) => void;
  onSelectRadical: (radicalId: number) => void;
}) {
  const [expandedChar, setExpandedChar] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      matches.map((m) => ({
        m,
        sentence: getExampleSentence(m.hanzi),
        words: getWordsContaining(m.hanzi),
        radicals: findRadicalsForHanzi(m.hanzi),
      })),
    [matches]
  );

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      {/* Header kolom (desktop) */}
      <div className="hidden md:grid grid-cols-[3rem_minmax(5rem,0.8fr)_minmax(8rem,1.4fr)_minmax(10rem,1.6fr)_minmax(9rem,1.3fr)_2.5rem] gap-x-3 bg-zinc-50 dark:bg-zinc-800/60 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        <span>Hanzi</span>
        <span>Pinyin</span>
        <span>Arti</span>
        <span>Contoh kalimat</span>
        <span>Pinyin · arti</span>
        <span />
      </div>

      <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
        {rows.map(({ m, sentence, words, radicals }, i) => {
          const isExpanded = expandedChar === m.hanzi;
          // Arti dari kata mandiri (mis. 你 → kamu); jika tak ada, kata pertama yang memuatnya
          const standalone = m.words.find((w) => w.hanzi === m.hanzi);
          const meaning = standalone ? standalone.meanings.join(', ') : m.words[0]?.meanings.join(', ') || '';

          const penButton = (extra: string) => (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenPractice(m.hanzi, m.pinyin, meaning);
              }}
              title="Latihan tulis hanzi ini"
              className={`p-1.5 rounded-md text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer transition-all ${extra}`}
            >
              <PenLine className="w-4 h-4" />
            </button>
          );

          return (
            <div
              key={`${m.hanzi}-${i}`}
              className={`${isExpanded ? 'bg-blue-50/50 dark:bg-blue-950/20' : i % 2 === 1 ? 'bg-zinc-50/60 dark:bg-zinc-800/25' : ''} transition-colors`}
            >
              {/* Baris utama — klik untuk expand dekomposisi */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => setExpandedChar(isExpanded ? null : m.hanzi)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setExpandedChar(isExpanded ? null : m.hanzi);
                }}
                className="cursor-pointer hover:bg-blue-50/60 dark:hover:bg-blue-950/25 transition-colors"
              >
                {/* Desktop: grid 6 kolom sesuai header */}
                <div className="hidden md:grid grid-cols-[3rem_minmax(5rem,0.8fr)_minmax(8rem,1.4fr)_minmax(10rem,1.6fr)_minmax(9rem,1.3fr)_2.5rem] gap-x-3 items-center px-3 py-2">
                  <span className="relative text-2xl leading-none text-zinc-900 dark:text-zinc-100 text-center flex items-center justify-center gap-1">
                    {m.hanzi}
                    <SpeakButton text={m.hanzi} className="w-3.5 h-3.5" title={`Dengarkan ${m.hanzi}`} />
                    {mastered.has(m.hanzi) && (
                      <CheckCircle2 className="absolute -top-1 -right-2.5 w-3 h-3 text-emerald-500" />
                    )}
                  </span>
                  <span className="font-mono text-sm font-bold text-red-600 dark:text-red-400 whitespace-nowrap">{m.pinyin}</span>
                  <span className="text-xs text-zinc-600 dark:text-zinc-300 leading-snug">{meaning}</span>
                  {sentence ? (
                    <span className="text-sm text-zinc-900 dark:text-zinc-100 leading-snug flex items-center gap-1.5">
                      {sentence.hanzi}
                      <SpeakButton text={sentence.hanzi} />
                    </span>
                  ) : (
                    <span className="text-[11px] text-zinc-300 dark:text-zinc-600 italic">—</span>
                  )}
                  {sentence ? (
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-red-500 dark:text-red-400 leading-snug">{sentence.pinyin}</p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">{sentence.meaning}</p>
                    </div>
                  ) : (
                    <span />
                  )}
                  <span className="justify-self-end">{penButton('')}</span>
                </div>

                {/* Mobile: stack dua baris */}
                <div className="md:hidden px-3 py-2.5">
                  <div className="flex items-center gap-3">
                    <span className="relative text-2xl leading-none text-zinc-900 dark:text-zinc-100 w-8 text-center shrink-0 flex flex-col items-center">
                      <span>{m.hanzi}</span>
                      <SpeakButton text={m.hanzi} className="w-3 h-3 mt-0.5" title={`Dengarkan ${m.hanzi}`} />
                      {mastered.has(m.hanzi) && (
                        <CheckCircle2 className="absolute -top-1 -right-1.5 w-3 h-3 text-emerald-500" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="font-mono text-sm font-bold text-red-600 dark:text-red-400">{m.pinyin}</span>
                        <span className="text-xs text-zinc-600 dark:text-zinc-300">{meaning}</span>
                      </div>
                    </div>
                    {penButton('shrink-0')}
                  </div>
                  {sentence && (
                    <div className="mt-1.5 pl-11">
                      <p className="text-sm text-zinc-900 dark:text-zinc-100 leading-snug flex items-center gap-1.5">
                        {sentence.hanzi}
                        <SpeakButton text={sentence.hanzi} />
                      </p>
                      <p className="font-mono text-[11px] text-red-500 dark:text-red-400 mt-0.5">{sentence.pinyin}</p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug mt-0.5">{sentence.meaning}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded: dekomposisi radikal + kata yang memuat + latihan mobile */}
              {isExpanded && (
                <div className="px-3 pb-3 pl-14 space-y-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Terbentuk dari {radicals.length} radikal:</span>
                    {radicals.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => onSelectRadical(r.id)}
                        className="text-[11px] px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 text-zinc-600 dark:text-zinc-300 cursor-pointer transition-all"
                      >
                        {r.radical} {r.meaning}
                      </button>
                    ))}
                  </div>
                  {words.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Kata yang memuat:</span>
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {words.slice(0, 6).map((w) => (
                          <span key={w.id} className="flex items-baseline gap-1.5 text-xs">
                            <span className="text-sm text-zinc-900 dark:text-zinc-100">{w.hanzi}</span>
                            <span className="font-mono text-red-500 dark:text-red-400">{w.pinyin}</span>
                            <span className="text-zinc-500 dark:text-zinc-400">{w.meanings.join(', ')}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useState, useEffect, useMemo } from 'react';
import { course } from '@/data/course';
import type { CourseWord } from '@/data/course.types';
import { meaningOf } from '@/data/course.types';
import { DrillKind, getSimilarDistractors } from '@/services/chinese/questService';
import { clickTick, playErrorBuzz, playSuccessChime, speakHanzi } from '@/lib/fx';

interface DrillModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLevel?: number;
  initialKind?: DrillKind;
  soundEnabled?: boolean;
}

const DRILL_TABS: { id: DrillKind; name: string; hint: string; icon: string }[] = [
  { id: 'tone', name: 'Jebakan Nada', hint: 'Bunyi serupa, beda nada', icon: 'ph-music-notes' },
  { id: 'visual', name: 'Kembaran Mirip', hint: 'Bentuk aksara mirip', icon: 'ph-eye' },
  { id: 'radical', name: 'Satu Atap', hint: 'Golongan kelas kata sama', icon: 'ph-puzzle-piece' },
];

export function DrillModal({ isOpen, onClose, initialLevel = 1, initialKind = 'tone', soundEnabled = true }: DrillModalProps) {
  const [level, setLevel] = useState(initialLevel);
  const [kind, setKind] = useState<DrillKind>(initialKind);
  const [roundIdx, setRoundIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    setLevel(initialLevel);
    setKind(initialKind);
    setRoundIdx(0);
    setScore(0);
    setSelectedWordId(null);
    setIsAnswered(false);
  }, [isOpen, initialLevel, initialKind]);

  const pool = useMemo(() => {
    return course.words.filter((w) => w.level === String(level));
  }, [level]);

  // Generate 10 rounds of drill targets
  const rounds = useMemo(() => {
    if (pool.length < 4) return [];
    const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
    const targets = shuffledPool.slice(0, 10);

    return targets.map((target) => {
      const distractors = getSimilarDistractors(target, pool, kind, 3);
      const options = [target, ...distractors].sort(() => Math.random() - 0.5);
      return { target, options };
    });
  }, [pool, kind]);

  if (!isOpen) return null;

  const curRound = rounds[roundIdx];
  const isFinished = roundIdx >= rounds.length && rounds.length > 0;

  const handlePick = (picked: CourseWord) => {
    if (isAnswered || !curRound) return;
    setSelectedWordId(picked.id);
    setIsAnswered(true);

    const isCorrect = picked.id === curRound.target.id;
    if (isCorrect) {
      setScore((s) => s + 1);
      playSuccessChime(soundEnabled);
      speakHanzi(curRound.target.hanzi);
    } else {
      playErrorBuzz(soundEnabled);
    }
  };

  const handleNext = () => {
    clickTick(soundEnabled);
    setSelectedWordId(null);
    setIsAnswered(false);
    setRoundIdx((prev) => prev + 1);
  };

  const handleRestart = () => {
    clickTick(soundEnabled);
    setRoundIdx(0);
    setScore(0);
    setSelectedWordId(null);
    setIsAnswered(false);
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#FFFDF9] dark:bg-[#151E32] border-2 border-[#231F20] dark:border-[#24324E] rounded-3xl p-5 sm:p-7 space-y-5 shadow-2xl relative max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: '0 8px 0 #231F20' }}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b-2 border-zinc-200 dark:border-[#24324E] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700/60 flex items-center justify-center font-bold text-lg">
              ⚡
            </span>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Drill Aksara Mirip · HSK {level}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Latih ketajaman visual, nada, dan arti agar tidak tertukar.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-zinc-300 dark:border-[#24324E] flex items-center justify-center font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-[#1C2742] cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Level & Kind Selector */}
        <div className="flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center">
          <div className="flex gap-1 bg-[#F1F5F9] dark:bg-[#0B111E] p-1 rounded-2xl overflow-x-auto no-scrollbar">
            {DRILL_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setKind(tab.id);
                  handleRestart();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  kind === tab.id
                    ? 'bg-white dark:bg-[#1C2742] text-rose-600 dark:text-rose-400 shadow-[0_2px_4px_rgba(0,0,0,0.08)]'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          <div className="flex gap-1 justify-end">
            {[1, 2, 3, 4, 5, 6].map((lv) => (
              <button
                key={lv}
                type="button"
                onClick={() => {
                  setLevel(lv);
                  handleRestart();
                }}
                className={`w-7 h-7 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  level === lv
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-zinc-100 dark:bg-[#1C2742] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-[#253252]'
                }`}
              >
                H{lv}
              </button>
            ))}
          </div>
        </div>

        {/* Drill Play Arena */}
        {!isFinished && curRound ? (
          <div className="space-y-5">
            {/* Round indicator */}
            <div className="flex items-center justify-between text-xs font-bold text-zinc-500 dark:text-zinc-400">
              <span>Pertanyaan {roundIdx + 1} dari {rounds.length}</span>
              <span className="text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                Skor: {score}
              </span>
            </div>

            {/* Target Card Prompt */}
            <div className="p-6 rounded-3xl bg-linear-to-b from-[#FFFDF9] to-[#FDF8EE] dark:from-[#1C2742] dark:to-[#151E32] border-2 border-[#231F20] dark:border-[#24324E] text-center space-y-2 shadow-[0_4px_0_#231F20] dark:shadow-[0_4px_0_#0D1424]">
              <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                Cari Aksara yang Tepat untuk:
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 font-serif">
                "{meaningOf(curRound.target)}"
              </h2>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-[#0B111E] text-xs font-mono font-bold text-indigo-700 dark:text-indigo-400 border border-zinc-200 dark:border-[#24324E]">
                <span>Pinyin: {curRound.target.pinyin}</span>
                <button
                  type="button"
                  onClick={() => speakHanzi(curRound.target.hanzi)}
                  className="hover:scale-110 text-indigo-600 dark:text-indigo-400 cursor-pointer"
                  title="Dengarkan pengucapan"
                >
                  🔊
                </button>
              </div>
            </div>

            {/* 4 Interactive Choice Cards */}
            <div className="grid grid-cols-2 gap-3">
              {curRound.options.map((opt) => {
                const isChosen = selectedWordId === opt.id;
                const isTarget = opt.id === curRound.target.id;

                let btnStyle = 'bg-white dark:bg-[#1C2742] border-zinc-300 dark:border-[#24324E] text-zinc-900 dark:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-500';
                if (isAnswered) {
                  if (isTarget) {
                    btnStyle = 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-black shadow-[0_3px_0_#059669]';
                  } else if (isChosen) {
                    btnStyle = 'bg-rose-100 dark:bg-rose-950/60 border-rose-500 text-rose-950 dark:text-rose-200 shadow-[0_3px_0_#E11D48]';
                  } else {
                    btnStyle = 'opacity-40 bg-zinc-100 dark:bg-[#0B111E] border-zinc-200 dark:border-[#24324E] text-zinc-400 dark:text-zinc-600';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handlePick(opt)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${btnStyle} shadow-[0_3px_0_#231F20] dark:shadow-[0_3px_0_#0D1424] ${
                      !isAnswered ? 'hover:-translate-y-1 hover:shadow-[0_6px_0_#231F20] dark:hover:shadow-[0_6px_0_#0D1424]' : ''
                    } active:translate-y-0.5 active:shadow-[0_1px_0_#231F20]`}
                  >
                    <span className="font-serif text-3xl font-bold">{opt.hanzi}</span>
                    {isAnswered ? (
                      <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 font-bold">{opt.pinyin}</span>
                    ) : (
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-semibold">Tebak Aksara</span>
                    )}
                    {isAnswered && (
                      <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium truncate max-w-full">
                        {meaningOf(opt)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            {isAnswered && (
              <div className="flex justify-end pt-2 animate-in fade-in">
                <button
                  type="button"
                  onClick={handleNext}
                  className="py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs border-2 border-[#231F20] shadow-[0_4px_0_#231F20] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_0_#231F20] transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>{roundIdx + 1 >= rounds.length ? 'Lihat Hasil' : 'Lanjut Pertanyaan'}</span>
                  <span>→</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Finished Screen */
          <div className="py-8 text-center space-y-4">
            <div className="text-5xl">🏆</div>
            <h3 className="font-serif text-2xl font-bold text-zinc-900">Drill Selesai!</h3>
            <p className="text-sm text-zinc-600">
              Kamu berhasil menjawab <b>{score}</b> dari <b>{rounds.length}</b> pertanyaan dengan benar.
            </p>
            <div className="flex justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={handleRestart}
                className="py-2.5 px-5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs border-2 border-[#231F20] shadow-[0_3px_0_#231F20] hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer"
              >
                Ulangi Drill
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-5 rounded-2xl bg-white text-zinc-800 font-bold text-xs border-2 border-[#231F20] shadow-[0_3px_0_#231F20] hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

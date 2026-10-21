import { useState, useMemo, useCallback, useEffect } from 'react';
import { X, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { evaluateHanziWriting, UserStroke, WritingEvaluationResult } from '@/services/chinese/hanziWritingEvaluator';
import { getOfficialStrokeData } from '@/services/chinese/hanziAssets';
import { HanziStrokeData } from '@/services/chinese/hanziStrokeData';
import { useOfficialStrokeData } from './useOfficialStrokeData';
import { StrokeOrderViewer } from './StrokeOrderViewer';
import { HanziWritingCanvas } from './HanziWritingCanvas';
import { AudioPlayerBar } from './AudioPlayerBar';
import { Button } from '@/components/ui/Button';
import { recordPracticeResult } from '@/services/chineseLearningService';

interface HanziPracticeViewProps {
  character: string;
  pinyin?: string;
  meaning?: string;
  wordId?: string;
  onClose: () => void;
  /**
   * Karakter aktif untuk pratinjau judul & evaluasi bebas — Word Multi-
   * karakter dari VocabularyDetailModal memakai karakter kedua dst.
   */
  focusCharacter?: string;
}

export function HanziPracticeView({
  character: characterProp,
  pinyin = '',
  meaning = '',
  wordId,
  focusCharacter,
  onClose,
}: HanziPracticeViewProps) {
  const activeWord = useMemo(() => {
    const src = focusCharacter && Array.from(focusCharacter).length > 0 ? focusCharacter : characterProp;
    const chars = Array.from(src || '');
    const hanziOnly = chars.filter((c) => /[\u4e00-\u9fff]/.test(c));
    return hanziOnly.length > 0 ? hanziOnly : chars;
  }, [characterProp, focusCharacter]);
  const character = activeWord[0] || characterProp;
  const [activeTab, setActiveTab] = useState<'order' | 'guided' | 'free'>('order');
  const [userStrokes, setUserStrokes] = useState<UserStroke[]>([]);
  const [evaluationResult, setEvaluationResult] = useState<WritingEvaluationResult | null>(null);
  const [orderCharIdx, setOrderCharIdx] = useState<number>(0);
  const [activeFreeChar, setActiveFreeChar] = useState<string | null>(null);
  const [activeFreeData, setActiveFreeData] = useState<HanziStrokeData | null>(null);
  const handleActiveCharChange = useCallback((ch: string, data: HanziStrokeData | null) => {
    setActiveFreeChar((prev) => (prev === ch ? prev : ch));
    setActiveFreeData(data);
  }, []);

  useEffect(() => {
    setOrderCharIdx(0);
    setActiveFreeChar(null);
    setActiveFreeData(null);
    setEvaluationResult(null);
    setUserStrokes([]);
  }, [characterProp, focusCharacter, activeTab]);

  // Data goresan RESMI (Makemeahanzi) — dimuat asinkron dari aset offline.
  const { strokeData } = useOfficialStrokeData(character, { pinyin, meaning });
  const displayPinyin = pinyin || strokeData?.pinyin || '';

  // Word Multi-karakter (mis. 觉得, 没关系): SELURUH karakter ditutorial
  // satu per satu — bukan hanya karakter pertama.
  const allCharacters = activeWord.length > 0 ? activeWord : [character];
  const isMultiChar = allCharacters.length > 1;
  const orderActiveChar = isMultiChar
    ? allCharacters[Math.min(orderCharIdx, allCharacters.length - 1)]
    : character;
  const loadCharacterData = useCallback(
    (ch: string) => getOfficialStrokeData(ch, { pinyin, meaning }),
    [pinyin, meaning]
  );

  const handleEvaluate = async () => {
    const evalData = isMultiChar ? (activeFreeData ?? strokeData) : strokeData;
    const res = evaluateHanziWriting(evalData, userStrokes);
    setEvaluationResult(res);

    if (wordId && (res.status === 'Good' || res.status === 'Very Good')) {
      await recordPracticeResult(wordId, true);
    }
  };

  /** Tutorial terpandu selesai (semua goresan benar urutan) → rekam sebagai praktik berhasil. */
  const handleTutorialComplete = async () => {
    if (wordId) {
      await recordPracticeResult(wordId, true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-6 max-w-lg w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-4 sm:space-y-6 relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Character Title Display */}
        <div className="text-center pt-2 space-y-1">
          <h2 className="text-5xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {/* Word multi-karakter: tampilkan hanzi aktif, dengan sisanya samar */}
            {isMultiChar
              ? allCharacters.map((ch, i) => (
                  <span
                    key={`${ch}-${i}`}
                    className={
                      i === (activeTab === 'order' ? orderCharIdx : 0)
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-zinc-400 dark:text-zinc-500'
                    }
                  >
                    {ch}
                  </span>
                ))
              : character}
          </h2>
          {displayPinyin && <p className="text-sm font-bold text-red-600 dark:text-red-400 font-mono">[{displayPinyin}]</p>}
          {meaning && <p className="text-xs text-zinc-500 dark:text-zinc-400">{meaning}</p>}
          {/* Audio pengucapan asli (MP3 offline) */}
          <AudioPlayerBar
            text={isMultiChar ? allCharacters.join('') : character}
            pinyin={displayPinyin}
            className="mt-2"
          />
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center justify-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/60 p-1 rounded-xl">
          <button
            onClick={() => {
              setActiveTab('order');
              setEvaluationResult(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'order'
                ? 'bg-white dark:bg-zinc-900 text-red-600 shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50'
            }`}
          >
            1. Urutan Goresan
          </button>
          <button
            onClick={() => {
              setActiveTab('guided');
              setEvaluationResult(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'guided'
                ? 'bg-white dark:bg-zinc-900 text-red-600 shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50'
            }`}
          >
            2. Tutorial Terpandu
          </button>
          <button
            onClick={() => {
              setActiveTab('free');
              setEvaluationResult(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'free'
                ? 'bg-white dark:bg-zinc-900 text-red-600 shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50'
            }`}
          >
            3. Latihan Bebas
          </button>
        </div>

        {/* Active Tab View */}
        {activeTab === 'order' && (
          <div className="space-y-4">
            {isMultiChar && (
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                {allCharacters.map((ch, i) => (
                  <button
                    key={`${ch}-${i}`}
                    type="button"
                    onClick={() => setOrderCharIdx(i)}
                    className={`w-10 h-10 rounded-lg border-2 text-xl font-bold flex items-center justify-center transition-all cursor-pointer ${
                      i === orderCharIdx
                        ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                        : 'border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500'
                    }`}
                    title={`${ch} — lihat urutan goresan`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            )}
            <StrokeOrderViewer key={orderActiveChar} character={orderActiveChar} pinyin={displayPinyin} meaning={meaning} />
            <div className="text-center pt-2">
              <Button
                onClick={() => setActiveTab('guided')}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold cursor-pointer"
              >
                Mulai Tutorial Terpandu →
              </Button>
            </div>
          </div>
        )}

        {(activeTab === 'guided' || activeTab === 'free') && (
          <div className="space-y-4">
            {isMultiChar && activeTab === 'free' && activeFreeChar && (
              <p className="text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Evaluasi untuk karakter <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{activeFreeChar}</span> — ganti karakter lewat tombol di atas kanvas.
              </p>
            )}
            <HanziWritingCanvas
              strokeData={strokeData}
              targetCharacter={character}
              mode={activeTab}
              onStrokesUpdated={(s) => setUserStrokes(s)}
              onTutorialComplete={handleTutorialComplete}
              onActiveCharChange={handleActiveCharChange}
              {...(isMultiChar ? { characters: allCharacters, loadCharacter: loadCharacterData } : {})}
            />

            {!evaluationResult ? (
              <div className="pt-2 text-center">
                <Button
                  onClick={handleEvaluate}
                  disabled={userStrokes.length === 0}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 cursor-pointer w-full"
                >
                  Evaluasi Hasil Menulis
                </Button>
              </div>
            ) : (
              <div
                className={`p-4 rounded-xl border space-y-2 ${
                  evaluationResult.status === 'Very Good' || evaluationResult.status === 'Good'
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200/80 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-100'
                    : 'bg-amber-50 dark:bg-amber-950/50 border-amber-200/80 dark:border-amber-800/80 text-amber-900 dark:text-amber-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold flex items-center gap-1.5">
                    Status: {evaluationResult.status}
                  </span>
                  <span className="text-xs font-semibold">
                    {evaluationResult.userStrokeCount} / {evaluationResult.expectedStrokeCount} Goresan
                  </span>
                </div>
                <p className="text-xs font-medium">{evaluationResult.feedbackMessage}</p>
                <p className="text-[11px] opacity-80 italic">{evaluationResult.advice}</p>

                {/* Rincian per goresan: urutan, arah, bentuk */}
                {evaluationResult.perStrokeResults && evaluationResult.perStrokeResults.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {evaluationResult.perStrokeResults.map((r) => (
                      <span
                        key={r.index}
                        title={
                          r.pass
                            ? 'Goresan benar: posisi awal, arah, dan bentuk sesuai'
                            : 'Belum pas — cermati titik mulai dan arah tarikan'
                        }
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                          r.pass
                            ? 'bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                            : 'bg-amber-100/80 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {r.pass ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        Goresan {r.index + 1}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEvaluationResult(null);
                      setUserStrokes([]);
                    }}
                    className="cursor-pointer text-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" />
                    Coba Lagi
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

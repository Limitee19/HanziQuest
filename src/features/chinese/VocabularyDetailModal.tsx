import { useEffect, useState } from 'react';
import { X, Play, BookOpen, PenTool } from 'lucide-react';
import { ChineseWord, UserLearningRecord, ReviewState } from '@/services/chineseLearningService';
import { calculateLearningStatus, getStatusBadgeStyle } from '@/services/chinese/learningStatusCalculator';
import { getRelativeDateLabel } from '@/services/chinese/reviewScheduler';
import { AudioPlayerBar } from './AudioPlayerBar';
import { Button } from '@/components/ui/Button';
import { fetchWikiImage } from '@/services/chinese/wikiImageService';

interface VocabularyDetailModalProps {
  word: ChineseWord | null;
  userRecord?: UserLearningRecord;
  reviewState?: ReviewState;
  onClose: () => void;
  onStartPractice?: (word: ChineseWord) => void;
  /**
   * Mulai latihan menulis hanzi. `character` opsional: Word Hanzi Multi
   * karakter (mis. 觉得) bisa menunjuk karakter tertentu yang akan ditulis.
   */
  onStartHanziWriting?: (word: ChineseWord, character?: string) => void;
}

export function VocabularyDetailModal({
  word,
  userRecord,
  reviewState,
  onClose,
  onStartPractice,
  onStartHanziWriting,
}: VocabularyDetailModalProps) {
  // Gambar ilustratif Wikipedia (lazy, cache) — fallback emoji bila tidak ada.
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageState, setImageState] = useState<'loading' | 'ready' | 'none'>('none');

  useEffect(() => {
    let alive = true;
    if (!word?.imageKey) {
      setImageUrl(null);
      setImageState('none');
      return;
    }
    setImageState('loading');
    fetchWikiImage(word.imageKey).then((url) => {
      if (!alive) return;
      setImageUrl(url);
      setImageState(url ? 'ready' : 'none');
    });
    return () => {
      alive = false;
    };
  }, [word?.imageKey]);

  if (!word) return null;

  const status = calculateLearningStatus(userRecord);
  const statusStyle = getStatusBadgeStyle(status);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] sm:max-h-[85vh] flex flex-col border border-zinc-200 dark:border-zinc-800 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Sticky Header with Close Button */}
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
          >
            ● {status}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer shrink-0"
            aria-label="Tutup detail modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Header Display */}
          <div className="text-center pt-1 space-y-2">
            <h2 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{word.hanzi}</h2>
            <p className="text-lg sm:text-xl font-bold text-red-600 dark:text-red-400 font-mono">[{word.pinyin}]</p>
            <AudioPlayerBar text={word.hanzi} pinyin={word.pinyin} className="mt-2" />
            {imageState === 'ready' && imageUrl && (
              <div className="mt-3 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                <img src={imageUrl} alt={word.hanzi} className="w-full max-h-44 object-cover" loading="lazy" />
                <p className="px-3 py-1.5 text-[10px] text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-900/60 text-left">
                  Ilustrasi: {word.imageKey} · Wikipedia
                </p>
              </div>
            )}
            {imageState === 'loading' && (
              <div className="mt-3 h-28 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 animate-pulse" />
            )}
            {imageState !== 'ready' && word.emoji && (
              <div className="text-4xl mt-1 select-none" aria-hidden>{word.emoji}</div>
            )}
          </div>

        {/* Meanings Section */}
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-700/60 space-y-2">
          <h4 className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Accepted Translations (Arti)</h4>
          <div className="flex flex-wrap gap-2">
            {word.meanings.map((m, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 shadow-2xs"
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Example Sentences */}
        {word.exampleSentences && word.exampleSentences.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold tracking-wider text-zinc-400 uppercase flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              Example Sentences (Contoh Kalimat)
            </h4>
            <div className="space-y-2">
              {word.exampleSentences.map((ex, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-1">
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{ex.hanzi}</p>
                  <p className="text-xs font-medium text-red-600 dark:text-red-400 font-mono">[{ex.pinyin}]</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 italic">{ex.meaning}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Statistics Summary */}
        <div className="grid grid-cols-4 gap-2 text-center pt-2">
          <div className="p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <p className="text-[11px] text-zinc-400">Practiced</p>
            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{userRecord?.timesSeen || 0} times</p>
          </div>
          <div className="p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <p className="text-[11px] text-zinc-400">Accuracy</p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {userRecord ? `${Math.round((userRecord.mastery || 0) * 100)}%` : '0%'}
            </p>
          </div>
          <div className="p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <p className="text-[11px] text-zinc-400">Next Review</p>
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400 truncate">
              {reviewState?.nextReviewAt ? getRelativeDateLabel(reviewState.nextReviewAt) : 'Hari Ini'}
            </p>
          </div>
          <div className="p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <p className="text-[11px] text-zinc-400">HSK Level</p>
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">HSK {word.hskLevel}</p>
          </div>
        </div>
      </div>
      {/* End of Scrollable Body */}

        {/* Action Buttons - Sticky Footer */}
        <div className="sticky bottom-0 z-10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-5 py-3 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-2 gap-2 shrink-0 pb-safe">
          {onStartPractice && (
            <Button
              onClick={() => {
                onStartPractice(word);
                onClose();
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 cursor-pointer flex items-center justify-center gap-1.5 text-xs"
            >
              <Play className="w-3.5 h-3.5" />
              Latihan Pinyin & Quiz
            </Button>
          )}

          {onStartHanziWriting && (
            <Button
              onClick={() => {
                onStartHanziWriting(word, word.hanzi);
                onClose();
              }}
              variant="outline"
              className="border-zinc-300 dark:border-zinc-700 font-semibold py-2.5 cursor-pointer flex items-center justify-center gap-1.5 text-xs text-zinc-900 dark:text-zinc-100"
              title={Array.from(word.hanzi).length > 1 ? `Semua hanzi (${word.hanzi}) ditutorial satu per satu` : 'Latihan menulis hanzi'}
            >
              <PenTool className="w-3.5 h-3.5 text-red-600" />
              {Array.from(word.hanzi).length > 1 ? `Tulis ${word.hanzi}` : 'Tulis Hanzi'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

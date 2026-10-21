import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ClassifiedReviewQueue } from '@/services/chinese/reviewQueue';
import { ReviewState, getRelativeDateLabel } from '@/services/chinese/reviewScheduler';
import { ChineseWord } from '@/services/chinese/chineseDataset';
import { Clock, CheckCircle2, AlertCircle, ArrowRight, BookOpen } from 'lucide-react';
import { t } from '@/services/localizationService';

interface ReviewDashboardViewProps {
  queue: ClassifiedReviewQueue;
  reviewStates: Record<string, ReviewState>;
  onStartReviewSession: (words: ChineseWord[]) => void;
  onSelectWord: (word: ChineseWord) => void;
}

export function ReviewDashboardView({
  queue,
  reviewStates,
  onStartReviewSession,
  onSelectWord,
}: ReviewDashboardViewProps) {
  const hasDueReviews = queue.overdue.length > 0 || queue.dueToday.length > 0;

  return (
    <div className="space-y-6">
      {/* Review Queue — header tenang (§02.4, §13.2) */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <h3 className="font-display text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{t('cl.reviewTab')}</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md">
            Antrean review dijadwalkan otomatis berdasarkan akurasi recall kamu.
          </p>
        </div>

        <Button
          onClick={() => onStartReviewSession(queue.allQueue)}
          disabled={queue.allQueue.length === 0}
          className="cursor-pointer shrink-0"
        >
          {t('cl.startDailyReview')} ({queue.allQueue.length})
        </Button>
      </div>

      {/* Review Queue Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Overdue Card */}
        <Card className={`border-zinc-200/80 dark:border-zinc-800 ${queue.overdue.length > 0 ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300/80' : 'bg-white dark:bg-zinc-900'}`}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{t('cl.overdue')}</p>
              <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100">{queue.overdue.length} words</h3>
            </div>
          </CardContent>
        </Card>

        {/* Due Today Card */}
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{t('cl.dueToday')}</p>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{queue.dueToday.length} words</h3>
            </div>
          </CardContent>
        </Card>

        {/* New Learning Items Card */}
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{t('cl.newLearningItems')}</p>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{queue.newItems.length} words</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Due Review Queue List */}
      <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800">
        <CardHeader className="px-4 pb-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Due Review Queue (Antrean Review Jatuh Tempo)
          </CardTitle>
          <span className="text-xs text-zinc-400 font-mono">{queue.allQueue.length} Total Queue</span>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {!hasDueReviews && queue.newItems.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{t('cl.allReviewsComplete')}</p>
              <p className="text-xs text-zinc-500">{t('cl.noReviewsDue')}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {queue.allQueue.map((w) => {
                const st = reviewStates[w.id];
                const dateLabel = getRelativeDateLabel(st?.nextReviewAt);

                return (
                  <div
                    key={w.id}
                    onClick={() => onSelectWord(w)}
                    className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex items-center justify-between gap-4 hover:border-red-500/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 transition-colors">
                        {w.hanzi}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-red-600 dark:text-red-400 font-mono">[{w.pinyin}]</p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">{w.meanings.join(', ')}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                        ● {dateLabel}
                      </span>
                      <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-red-500 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

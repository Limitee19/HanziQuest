import { useEffect, useState } from 'react';
import { Blocks, ChevronRight, CheckCircle2, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import {
  groupRadicalsByLearningOrder,
  RadicalEntry,
} from '@/services/chinese/radicals/radicalTable';
import {
  getRadicalHanziCount,
  getHanziForRadical,
} from '@/services/chinese/radicals/radicalMap';
import {
  getMasteredHanziSet,
  loadQuizScoreHistory,
  QuizScoreRecord,
} from '@/services/chinese/radicals/radicalProgress';
import { ScoreTrend } from './ScoreTrend';

interface NextUp {
  radical: RadicalEntry;
  done: number;
  total: number;
  preview: string[];
}

/**
 * RadicalMasteryCard — Ringkasan mastery radikal untuk dashboard Chinese Learning.
 * ────────────────────────────────────────────────────────────────────────────
 * Menampilkan progres hanzi dikuasai per tier (dari riwayat review flashcard),
 * plus "pelajari berikutnya": radikal belum dikuasai dengan hanzi terbanyak
 * di tier terendah yang belum tuntas.
 */
export function RadicalMasteryCard({ onOpenRadicals }: { onOpenRadicals: () => void }) {
  const [mastered, setMastered] = useState<Set<string>>(new Set());
  const [scoreHistory, setScoreHistory] = useState<QuizScoreRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    Promise.all([getMasteredHanziSet(), loadQuizScoreHistory()]).then(([s, scores]) => {
      if (!alive) return;
      setMastered(s);
      setScoreHistory(scores);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  const groups = groupRadicalsByLearningOrder(getRadicalHanziCount);

  // Progres per tier + radikal "berikutnya" dari tier pertama yang belum tuntas
  const tierStats = groups.map((g) => {
    let done = 0;
    let total = 0;
    for (const r of g.radicals) {
      const list = getHanziForRadical(r.id);
      total += list.length;
      done += list.filter((m) => mastered.has(m.hanzi)).length;
    }
    return { tier: g.tier, title: g.title, done, total };
  });

  let nextUp: NextUp | null = null;
  for (const g of groups) {
    const candidates = g.radicals
      .map((r) => {
        const list = getHanziForRadical(r.id);
        const d = list.filter((m) => mastered.has(m.hanzi)).length;
        return { radical: r, done: d, total: list.length };
      })
      .filter((c) => c.total > 0 && c.done < c.total)
      .sort((a, b) => b.total - a.total);
    if (candidates.length > 0) {
      const c = candidates[0];
      nextUp = {
        radical: c.radical,
        done: c.done,
        total: c.total,
        preview: getHanziForRadical(c.radical.id)
          .filter((m) => !mastered.has(m.hanzi))
          .slice(0, 6)
          .map((m) => m.hanzi),
      };
      break;
    }
  }

  const overallDone = tierStats.reduce((s, t) => s + t.done, 0);
  const overallTotal = tierStats.reduce((s, t) => s + t.total, 0);

  // Tren skor kuis tier (ronde terakhir semua tier, kronologis)
  const tierQuizHistory = scoreHistory.filter((r) => r.scope === 'tier').slice(-8);

  return (
    <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-xs">
      <div className="px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5 pt-0.5">
          <Blocks className="w-4 h-4 text-[#C0392B] shrink-0" />
          <span className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100">
            Progres Radikal
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenRadicals}
          className="text-xs font-bold text-[#C0392B] hover:text-[#a93226] cursor-pointer flex items-center gap-1 transition-colors"
        >
          <span>Buka Indeks</span>
          <span>→</span>
        </button>
      </div>

      <CardContent className="p-5 space-y-4">
        {loading ? (
          <p className="text-xs text-zinc-400 dark:text-zinc-500 py-2">Memuat progres…</p>
        ) : overallTotal === 0 ? (
          <p className="text-xs text-zinc-400 dark:text-zinc-500 py-2">
            Belum ada hanzi yang dikuasai — mulai dari review flashcard, lalu progres radikal muncul di sini.
          </p>
        ) : (
          <>
            {/* Progres per tier */}
            <div className="space-y-2.5">
              {tierStats.map((t) => {
                const pct = t.total > 0 ? Math.round((t.done / t.total) * 100) : 0;
                const complete = t.total > 0 && t.done === t.total;
                return (
                  <div key={t.tier} className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold shrink-0 ${
                        t.tier === 1
                          ? 'bg-blue-600 text-white'
                          : t.tier === 2
                            ? 'bg-zinc-400 dark:bg-zinc-600 text-white'
                            : 'border border-zinc-300 dark:border-zinc-600 text-zinc-400 dark:text-zinc-500'
                      }`}
                    >
                      {t.tier}
                    </span>
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200 w-20 shrink-0">
                      {t.title}
                    </span>
                    <span className="h-1.5 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                      <span
                        className={`block h-full transition-all ${complete ? 'bg-emerald-500' : 'bg-blue-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                    <span
                      className={`text-[10px] font-semibold w-20 text-right shrink-0 ${
                        complete ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400 dark:text-zinc-500'
                      }`}
                    >
                      {t.done}/{t.total}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Pelajari berikutnya */}
            {nextUp && (
              <div
                role="button"
                tabIndex={0}
                onClick={onOpenRadicals}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onOpenRadicals();
                }}
                className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/60 dark:hover:bg-blue-950/25 cursor-pointer transition-all"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Pelajari berikutnya
                  </p>
                  <p className="text-xs text-zinc-700 dark:text-zinc-200 mt-0.5">
                    <span className="text-lg text-zinc-900 dark:text-zinc-100 mr-1.5">{nextUp.radical.radical}</span>
                    <span className="font-mono font-bold text-red-600 dark:text-red-400 mr-1">{nextUp.radical.pinyin}</span>
                    <span className="text-zinc-500 dark:text-zinc-400">
                      {nextUp.radical.meaning} · {nextUp.done}/{nextUp.total} dikuasai
                    </span>
                  </p>
                  {nextUp.preview.length > 0 && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 tracking-wide">
                      {nextUp.preview.join(' ')}
                    </p>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 shrink-0" />
              </div>
            )}

            {/* Tren skor kuis tier */}
            {tierQuizHistory.length > 0 && (
              <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800">
                <ScoreTrend
                  records={tierQuizHistory}
                  label={`Tren kuis radikal · ${tierQuizHistory.length} ronde terakhir`}
                  describe={(r) => `Tier ${r.key}`}
                />
              </div>
            )}

            {/* Total */}
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              {overallDone}/{overallTotal} hanzi dikuasai di seluruh tier
              {overallDone === overallTotal && (
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> semua tuntas!
                </span>
              )}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

import { TrendingUp } from 'lucide-react';
import { QuizScoreRecord } from '@/services/chinese/radicals/radicalProgress';

/**
 * ScoreTrend — bar mini tren skor kuis.
 * `records` terurut KRONOLOGIS (lama → baru); satu batang = satu ronde.
 * Biru (atau `accent`) = lulus (≥70%), abu = belum lulus.
 */
export function ScoreTrend({
  records,
  accent = 'bg-blue-600',
  compact = false,
  label,
  describe,
}: {
  records: QuizScoreRecord[];
  accent?: string;
  /** Mode kecil untuk header tabel / kartu ringkas. */
  compact?: boolean;
  label?: string;
  /** Keterangan tambahan per batang pada tooltip. */
  describe?: (r: QuizScoreRecord) => string;
}) {
  if (records.length === 0) return null;
  const max = Math.max(...records.map((r) => r.pct), 100);
  const best = Math.max(...records.map((r) => r.pct));
  const avg = Math.round(records.reduce((s, r) => s + r.pct, 0) / records.length);

  return (
    <div>
      {label && (
        <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2 flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" />
          {label}
        </p>
      )}
      <div className={`flex items-end gap-1.5 ${compact ? 'h-5' : 'h-10'}`}>
        {records.map((r, i) => (
          <div
            key={r.ts + '-' + i}
            className={`${compact ? 'w-1.5' : 'w-2'} rounded-t-sm shrink-0`}
            style={{ height: `${Math.max(compact ? 20 : 12, (r.pct / max) * 100)}%` }}
            title={`${describe ? describe(r) + ' · ' : ''}Skor ${r.score}/${r.total} (${r.pct}%)`}
          >
            <div
              className={`w-full h-full rounded-t-sm ${r.pct >= 70 ? accent : 'bg-zinc-300 dark:bg-zinc-600'}`}
            />
          </div>
        ))}
        {!compact && (
          <div className="ml-1.5 leading-tight">
            <p className="text-[10px] font-bold text-zinc-600 dark:text-zinc-300">{best}% terbaik</p>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500">{avg}% rata-rata</p>
          </div>
        )}
        {compact && (
          <span className="ml-1 text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 leading-none">
            {best}%
          </span>
        )}
      </div>
    </div>
  );
}

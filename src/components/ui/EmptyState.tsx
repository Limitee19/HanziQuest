import React from 'react';
import { cn } from '@/lib/utils';
import { Inbox, Search, FileX2, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'inbox' | 'search' | 'file' | 'alert' | React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const ICONS: Record<string, React.ElementType> = {
  inbox: Inbox,
  search: Search,
  file: FileX2,
  alert: AlertCircle,
};

export function EmptyState({ icon = 'inbox', title, description, action, className }: EmptyStateProps) {
  const ResolvedIcon = typeof icon === 'string' ? (ICONS[icon] ?? Inbox) : icon;
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-12 px-6', className)}>
      {/* V3: kotak ber-border (bukan lingkaran) — aksen brutalist */}
      <div className="flex items-center justify-center w-14 h-14 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 mb-4">
        <ResolvedIcon className="w-6 h-6 text-zinc-400 dark:text-zinc-500" />
      </div>
      <h3 className="font-display text-[15px] font-bold text-zinc-800 dark:text-zinc-200 mb-1">{title}</h3>
      {description && (
        <p className="text-[13px] text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton / loading placeholders
// ─────────────────────────────────────────────────────────────────────────────

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('rounded-lg bg-zinc-200/70 dark:bg-zinc-800/60 animate-pulse', className)} />;
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2.5', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn('h-3.5', i === lines - 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-5 space-y-4', className)}>
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/5" />
          <Skeleton className="h-3 w-3/5" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  );
}

export function SkeletonList({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70">
          <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
import React from 'react';
import { cn } from '@/lib/utils';

/**
 * V4 "Editorial Desk" Card — kertas datar di atas meja.
 * Tidak ada bayangan blur, tidak ada glow: hirarki dibangun dari
 * border 1px yang tegas + permukaan solid. Aksen khas: judul blok
 * memakai pola "eyebrow" (label mono uppercase bergaris) — lihat halaman.
 */
export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

/** Label kecil khas V4: mono uppercase, tracking lebar, warna redup — "stempel arsip". */
export function CardEyebrow({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-[10px] font-mono font-medium uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

/** Garis pemisah seksi dalam kartu — pengganti spacing kosong ala template. */
export function CardRule({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('h-px bg-zinc-100 dark:bg-zinc-800', className)} {...props} />;
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col space-y-1.5 mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('font-display text-base font-bold tracking-tight', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-xs text-zinc-500 dark:text-zinc-400', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('pt-0', className)} {...props}>
      {children}
    </div>
  );
}

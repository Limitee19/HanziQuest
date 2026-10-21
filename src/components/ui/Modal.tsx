import React, { useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Clickable Backdrop overlay */}
      <div className="fixed inset-0 cursor-pointer" onClick={onClose} aria-label="Close on backdrop click" />

      <div
        className={cn(
          'relative w-full max-w-lg rounded-t-3xl sm:rounded-2xl bg-white dark:bg-zinc-900 border-t-[1.5px] sm:border border-zinc-200 dark:border-zinc-700 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] pb-safe animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-2 duration-250 z-10',
          className
        )}
      >
        {/* Mobile Drag/Close Indicator Bar */}
        <div 
          className="sm:hidden pt-3 pb-1.5 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors" 
          onClick={onClose}
          title="Tarik ke bawah atau klik untuk menutup"
        >
          <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 mb-1" />
          <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-0.5">
            <ChevronDown className="w-3 h-3" /> Tutup
          </span>
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 dark:border-zinc-800/80 shrink-0">
          <h3 className="font-display text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight truncate pr-2">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content with proper mobile touch scrolling */}
        <div className="p-4 sm:p-5 overflow-y-auto overscroll-contain touch-pan-y flex-1" style={{ WebkitOverflowScrolling: 'touch' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

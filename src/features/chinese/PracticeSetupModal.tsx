import React, { useState } from 'react';
import { X, Play, Sliders } from 'lucide-react';
import { PracticeSessionConfig } from '@/services/chinese/chineseQuestionGenerator';
import { Button } from '@/components/ui/Button';

interface PracticeSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSession: (config: PracticeSessionConfig) => void;
}

export function PracticeSetupModal({ isOpen, onClose, onStartSession }: PracticeSetupModalProps) {
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [mode, setMode] = useState<'mixed' | 'pinyin' | 'meaning' | 'hanzi'>('mixed');
  const [isToneAware, setIsToneAware] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartSession({
      questionCount,
      mode,
      isToneAware,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 max-w-md w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Display */}
        <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Practice Session Setup</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Configure your Mandarin practice session.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Question Count Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Number of Questions (Jumlah Soal):</label>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 20].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setQuestionCount(cnt)}
                  className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    questionCount === cnt
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {cnt} Questions
                </button>
              ))}
            </div>
          </div>

          {/* Mode Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Practice Mode (Mode Latihan):</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'mixed', label: '🔀 Mixed Types' },
                { id: 'pinyin', label: '🔤 Pinyin Recall' },
                { id: 'meaning', label: '💬 Meaning Recall' },
                { id: 'hanzi', label: '✍️ Hanzi Writing' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMode(item.id as any)}
                  className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${
                    mode === item.id
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tone Awareness Toggle */}
          <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Tone-Aware Pinyin Mode</p>
              <p className="text-[11px] text-zinc-500">Require exact tone selection (1–4 Dan neutral)</p>
            </div>
            <input
              type="checkbox"
              checked={isToneAware}
              onChange={(e) => setIsToneAware(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded cursor-pointer"
            />
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Begin Session (Mulai Latihan)
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

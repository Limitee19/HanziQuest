import { useState, useEffect } from 'react';
import { Volume2, VolumeX, RotateCcw, Sliders } from 'lucide-react';
import { chineseAudioPlayer, PlaybackStatus } from '@/services/chinese/chineseAudioPlayer';
import { Button } from '@/components/ui/Button';

interface AudioPlayerBarProps {
  text: string;
  pinyin?: string;
  className?: string;
  autoPlay?: boolean;
}

export function AudioPlayerBar({ text, pinyin, className = '', autoPlay = false }: AudioPlayerBarProps) {
  const [status, setStatus] = useState<PlaybackStatus>('idle');
  const [speed, setSpeed] = useState<number>(chineseAudioPlayer.getSpeed());

  useEffect(() => {
    const unsubscribe = chineseAudioPlayer.subscribeStatus((s) => setStatus(s));
    if (autoPlay && text) {
      chineseAudioPlayer.playText(text, speed);
    }
    return () => unsubscribe();
  }, [text]);

  const handlePlay = () => {
    if (status === 'playing') {
      chineseAudioPlayer.stop();
    } else {
      chineseAudioPlayer.playText(text, speed);
    }
  };

  const handleSpeedToggle = () => {
    const nextSpeed = speed === 1.0 ? 0.75 : speed === 0.75 ? 1.25 : 1.0;
    setSpeed(nextSpeed);
    chineseAudioPlayer.setSpeed(nextSpeed);
  };

  return (
    <div className={`p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          onClick={handlePlay}
          className={`rounded-full p-2.5 cursor-pointer transition-all ${
            status === 'playing'
              ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
              : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-black'
          }`}
        >
          {status === 'playing' ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{text}</span>
            {pinyin && <span className="text-xs font-semibold text-red-600 dark:text-red-400 font-mono">[{pinyin}]</span>}
          </div>
          <p className="text-[11px] text-zinc-500">
            {status === 'playing' ? 'Playing audio...' : status === 'error' ? 'Audio unavailable' : 'Click to hear pronunciation'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={handleSpeedToggle}
          className="px-2.5 py-1 rounded-lg text-[11px] font-bold border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 cursor-pointer flex items-center gap-1"
        >
          <Sliders className="w-3 h-3 text-red-500" />
          {speed}x
        </button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => chineseAudioPlayer.playText(text, speed)}
          className="cursor-pointer text-zinc-500 p-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

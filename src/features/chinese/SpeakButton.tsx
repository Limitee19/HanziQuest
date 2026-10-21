import { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { chineseAudioPlayer } from '@/services/chinese/chineseAudioPlayer';

/**
 * SpeakButton — tombol kecil untuk mengucapkan teks Mandarin.
 * Memutar audio MP3 asli yang dibundle offline (hasil build script),
 * dengan fallback ke TTS bawaan sistem bila audio belum tersedia.
 */
export function SpeakButton({
  text,
  className = 'w-3.5 h-3.5',
  title = 'Dengarkan pengucapan',
}: {
  text: string;
  className?: string;
  title?: string;
}) {
  const [busy, setBusy] = useState(false);

  const speak = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      await chineseAudioPlayer.playText(text, chineseAudioPlayer.getSpeed());
    } catch (_) {
      /* TTS/audio tidak tersedia — abaikan */
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={speak}
      title={title}
      className={`inline-flex shrink-0 items-center justify-center p-0.5 rounded transition-all ${busy ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400'} cursor-pointer ${className}`}
    >
      <Volume2 className={`w-full h-full ${busy ? 'animate-pulse' : ''}`} />
    </button>
  );
}

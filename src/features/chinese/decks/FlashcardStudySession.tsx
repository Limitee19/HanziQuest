import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Trophy,
  CheckCircle2,
  Layers,
  ChevronLeft,
  RotateCcw,
  PenTool,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { HanziPracticeView } from '../HanziPracticeView';
import {
  FlashcardItem,
  ReviewRating,
  rateCard,
  calculateIntervalPreviews,
  fetchDeckStudyQueue,
} from '@/services/chinese/flashcardService';

/**
 * Memeriksa apakah backContent kartu Anki sudah mencakup pertanyaan (frontContent),
 * seperti pada kartu template HSK/Anki di mana sisi jawaban (Back) sudah
 * memuat kembali Hanzi dan kalimat contoh lengkap dengan pinyin dan artinya.
 * Jika ya, sisi jawaban tidak perlu menampilkan frontContent lagi agar tidak dobel.
 */
function backContainsFront(front: string, back: string): boolean {
  if (!front || !back) return false;

  // 1. Tag standar Anki untuk pemisah jawaban (FrontSide + hr + Back)
  if (/<hr[^>]*id=["']?answer["']?[^>]*>/i.test(back)) return true;

  // 2. Cek karakter Hanzi: jika kartu berbahasa Mandarin dan seluruh Hanzi di front sudah termuat di back
  const fHanzi = (front.match(/[\u4e00-\u9fa5]+/g) || []).join('');
  const bHanzi = (back.match(/[\u4e00-\u9fa5]+/g) || []).join('');
  if (fHanzi.length > 0 && bHanzi.length > 0 && bHanzi.includes(fHanzi)) {
    return true;
  }

  // 3. Cek teks polos (Latin/Umum): apakah teks polos pertanyaan termuat di jawaban
  const strip = (s: string) =>
    s
      .replace(/<[^>]*>/g, ' ')
      .replace(/\[sound:[^\]]+\]/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();

  const fPlain = strip(front);
  const bPlain = strip(back);
  if (fPlain.length > 0 && bPlain.length > 0 && bPlain.includes(fPlain)) {
    return true;
  }

  return false;
}

interface FlashcardStudySessionProps {
  deckId: string;
  deckName: string;
  onExit: () => void;
  /** Mulai dalam mode "Belajar Ulang" (semua kartu deck diacak, abaikan SRS). */
  initialRelearn?: boolean;
}

export function FlashcardStudySession({ deckId, deckName, onExit, initialRelearn }: FlashcardStudySessionProps) {
  const [queue, setQueue] = useState<FlashcardItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  });

  // Mode "Belajar Ulang" (relearn) — semua kartu deck diacak, mengabaikan SRS.
  // Disimpan di ref agar restart sesi (dari layar selesai) tidak perlu remount.
  const isRelearnRef = useRef<boolean>(initialRelearn === true);

  // Load Queue
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchDeckStudyQueue(deckId, 20, 50, { relearn: isRelearnRef.current }).then((cards) => {
      if (isMounted) {
        setQueue(cards);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [deckId]);

  const currentCard = queue[currentIndex];
  const backAlreadyContainsFront = useMemo(() => {
    if (!currentCard?.frontContent || !currentCard?.backContent) return false;
    return backContainsFront(currentCard.frontContent, currentCard.backContent);
  }, [currentCard]);
  const cardHanzi = useMemo(() => {
    if (!currentCard) return '';
    const html = `${currentCard.frontContent || ''} ${currentCard.backContent || ''}`;
    const plain = html.replace(/<[^>]*>/g, ' ');
    return (plain.match(/[\u4e00-\u9fff]+/g) || []).join('').slice(0, 8);
  }, [currentCard]);
  const [writingOpen, setWritingOpen] = useState(false);
  useEffect(() => {
    setWritingOpen(false);
  }, [currentIndex, deckId]);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioFailed, setAudioFailed] = useState(false);

  // Mode senyap (mute) — preferensi disimpan agar bertahan antar sesi belajar
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ankiStudyMuted') === '1';
    } catch (_) {
      return false;
    }
  });
  const mutedRef = useRef(isMuted);

  // Stop any playing audio
  const stopAudio = () => {
    if (activeAudioRef.current) {
      try {
        activeAudioRef.current.onended = null;
        activeAudioRef.current.onerror = null;
        activeAudioRef.current.pause();
      } catch (_) { /* ignore */ }
      activeAudioRef.current = null;
    }
    setIsPlayingAudio(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // ── Audio unlock (Android WebView) ────────────────────────────────────
  // WebView Android memblokir play() tanpa gesture pengguna terlebih dulu.
  // Setelah gesture PERTAMA, mainkan audio senyap super-pendek agar
  // auto-play kartu berikutnya diizinkan.
  const audioUnlockedRef = useRef(false);
  useEffect(() => {
    if (audioUnlockedRef.current) return;
    const unlock = () => {
      if (audioUnlockedRef.current) return;
      audioUnlockedRef.current = true;
      try {
        const silent = document.createElement('audio');
        silent.src = 'data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA=Maylu//////+AAAAAAAF9eAA=May';
        silent.volume = 0;
        const p = silent.play();
        if (p && p.catch) p.catch(() => { /* best-effort */ });
      } catch (_) { /* best-effort */ }
    };
    window.addEventListener('pointerdown', unlock, { once: true, capture: true });
    window.addEventListener('keydown', unlock, { once: true, capture: true });
    return () => {
      window.removeEventListener('pointerdown', unlock, { capture: true });
      window.removeEventListener('keydown', unlock, { capture: true });
    };
  }, []);

  // Toggle mode senyap: hentikan audio yang sedang berbunyi Dan simpan preferensi
  const toggleMute = () => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setIsMuted(next);
    try {
      localStorage.setItem('ankiStudyMuted', next ? '1' : '0');
    } catch (_) {}
    if (next) stopAudio();
  };  // Speak via SpeechSynthesis (TTS fallback) — SELALU dicoba saat MP3 gagal.
  const speakTts = (text: string) => {
    try {
      if (mutedRef.current) return;
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const plainText = text.replace(/<[^>]*>/g, '').replace(/\[sound:[^\]]+\]/gi, '').trim();
        // Ambil hanya bagian Hanzi agar TTS membaca pengucapan, bukan arti.
        const hanzi = plainText.match(/[\u4e00-\u9fff]+/g)?.join('') || plainText.slice(0, 40);
        const utterance = new SpeechSynthesisUtterance(hanzi);

        utterance.lang = 'zh-CN';
        utterance.rate = 0.85;
        utterance.onerror = () => setAudioFailed(true);
        window.speechSynthesis.speak(utterance);
      } else {
        setAudioFailed(true);
      }
    } catch (_) {
      setAudioFailed(true);
    }
  };

  // Play audio track (MP3 Data URL or fallback to TTS).
  // PENTING (fix suara Android): setiap kegagalan play()/error WAJIB jatuh ke
  // TTS fallback — sebelumnya banyak catch kosong yang menelan error sehingga
  // kartu terdiam total di perangkat mobile.
  const playAudio = useCallback((audioUrl?: string, textFallback?: string) => {
    stopAudio();
    setAudioFailed(false);
    if (mutedRef.current) return;

    if (audioUrl) {
      try {
        const audio = new Audio(audioUrl);
        activeAudioRef.current = audio;
        setIsPlayingAudio(true);
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => {
          setIsPlayingAudio(false);
          if (textFallback) speakTts(textFallback);
          else setAudioFailed(true);
        };
        audio.play().catch(() => {
          setIsPlayingAudio(false);
          if (textFallback) speakTts(textFallback);
          else setAudioFailed(true);
        });
        return;
      } catch (_) {
        setIsPlayingAudio(false);
        if (textFallback) speakTts(textFallback);
        else setAudioFailed(true);
        return;
      }
    }

    if (textFallback) {
      speakTts(textFallback);
    } else {
      setAudioFailed(true);
    }
  }, []);

  // Replay audio for active state (Word vs Sentence)
  const handleReplayAudio = () => {
    if (!currentCard) return;
    const audios = currentCard.audioUrls || [];
    if (isRevealed && audios.length > 1) {
      playAudio(audios[1], currentCard.backContent);
    } else if (audios.length > 0) {
      playAudio(audios[0], currentCard.frontContent);
    } else {
      speakTts(isRevealed ? currentCard.backContent : currentCard.frontContent);
    }
  };

  // Auto-play front audio when card changes
  useEffect(() => {
    if (!currentCard) return;
    const frontAudios = currentCard.audioUrls || [];
    if (frontAudios.length > 0) {
      playAudio(frontAudios[0], currentCard.frontContent);
    }
  }, [currentIndex, currentCard]);

  // Auto-play sentence / back audio on reveal
  useEffect(() => {
    if (!currentCard || !isRevealed) return;
    const audios = currentCard.audioUrls || [];
    if (audios.length > 1) {
      playAudio(audios[1], currentCard.backContent);
    } else if (audios.length > 0) {
      playAudio(audios[0], currentCard.backContent);
    }
  }, [isRevealed, currentCard]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // Keyboard Shortcuts (Space to reveal, 1-4 to rate, R to replay audio, Esc to exit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (sessionCompleted) return;

      if (e.key === 'Escape') {
        stopAudio();
        onExit();
      } else if (e.key === 'r' || e.key === 'R') {
        handleReplayAudio();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!isRevealed) {
          setIsRevealed(true);
        }
      } else if (isRevealed) {
        if (e.key === '1') handleRate('again');
        else if (e.key === '2') handleRate('hard');
        else if (e.key === '3') handleRate('good');
        else if (e.key === '4') handleRate('easy');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRevealed, sessionCompleted, currentIndex, queue, currentCard]);

  const handleRate = async (rating: ReviewRating) => {
    if (!currentCard) return;

    setStats((prev) => ({ ...prev, [rating]: prev[rating] + 1 }));

    // Rate in database
    await rateCard(currentCard.id, rating);

    // If 'again', optionally re-insert card at end of session queue
    if (rating === 'again') {
      setQueue((prev) => [...prev, currentCard]);
    }

    if (currentIndex + 1 >= queue.length && rating !== 'again') {
      setSessionCompleted(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setIsRevealed(false);
    }
  };

  // Muat ulang antrean dari awal — dipakai tombol "Belajar Ulang".
  // relearn=true → semua kartu deck diacak (deck yang sudah selesai tetap bisa dibuka).
  const restartQueue = useCallback(
    (relearn: boolean) => {
      isRelearnRef.current = relearn;
      stopAudio();
      setCurrentIndex(0);
      setIsRevealed(false);
      setSessionCompleted(false);
      setStats({ again: 0, hard: 0, good: 0, easy: 0 });
      setQueue([]);
      setLoading(true);
      fetchDeckStudyQueue(deckId, 20, 50, { relearn }).then((cards) => {
        setQueue(cards);
        setLoading(false);
      });
    },
    [deckId]
  );

  const startRelearnSession = useCallback(() => restartQueue(true), [restartQueue]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="text-center space-y-3 text-white">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold">Menyiapkan Sesi Belajar Flashcard...</p>
        </div>
      </div>
    );
  }

  // If no cards due
  if (!loading && queue.length === 0 && !sessionCompleted) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 select-none">
        <Card className="max-w-md w-full p-8 bg-zinc-900 border-zinc-800 text-center space-y-5 rounded-3xl shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-white">Semua Kartu Sudah Selesai!</h3>
            <p className="text-xs text-zinc-400">
              Tidak ada kartu baru/jatuh tempo di deck <strong>{deckName}</strong> saat ini — tapi kamu tetap bisa meninjaunya kembali.
            </p>
          </div>
          <div className="space-y-2">
            <Button onClick={startRelearnSession} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer">
              <RotateCcw className="w-4 h-4 mr-1.5" /> Belajar Ulang Semua Kartu
            </Button>
            <Button onClick={onExit} variant="outline" className="w-full font-bold cursor-pointer">
              Kembali ke Koleksi Deck
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Session Completed Screen
  if (sessionCompleted) {
    const totalReviewed = stats.again + stats.hard + stats.good + stats.easy;
    const accuracy = totalReviewed > 0 ? Math.round(((stats.good + stats.easy) / totalReviewed) * 100) : 100;

    return (
      <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 select-none">
        <Card className="max-w-md w-full p-8 bg-zinc-900 border-zinc-800 text-center space-y-6 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
          <Trophy className="w-10 h-10 text-amber-500 mx-auto" />

          <div className="space-y-1.5">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
              Sesi Belajar Selesai!
            </span>
            <h3 className="text-2xl font-bold text-white pt-2">Luar Biasa!</h3>
            <p className="text-xs text-zinc-400">
              Anda telah menyelesaikan {totalReviewed} kartu di deck <strong>{deckName}</strong>.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-900/60 text-center">
              <p className="text-[11px] text-rose-400 font-bold uppercase">Again</p>
              <p className="text-lg font-bold text-rose-300">{stats.again}</p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-900/60 text-center">
              <p className="text-[11px] text-amber-400 font-bold uppercase">Hard</p>
              <p className="text-lg font-bold text-amber-300">{stats.hard}</p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-900/60 text-center">
              <p className="text-[11px] text-emerald-400 font-bold uppercase">Good</p>
              <p className="text-lg font-bold text-emerald-300">{stats.good}</p>
            </div>
            <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-900/60 text-center">
              <p className="text-[11px] text-blue-400 font-bold uppercase">Easy</p>
              <p className="text-lg font-bold text-blue-300">{stats.easy}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-between text-xs">
            <span className="text-zinc-400">Tingkat Akurasi Sesi:</span>
            <span className="font-bold text-emerald-400 text-sm">{accuracy}%</span>
          </div>

          <div className="space-y-2">
            <Button
              onClick={startRelearnSession}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 mr-1.5" /> Belajar Ulang Deck Ini
            </Button>
            <Button onClick={onExit} variant="outline" className="w-full py-3 cursor-pointer">
              Selesai Dan Kembali ke Koleksi Deck
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const intervalPreviews = currentCard ? calculateIntervalPreviews(currentCard) : [];
  const progressPercent = queue.length > 0 ? Math.round(((currentIndex) / queue.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 text-white flex flex-col justify-between select-none overflow-hidden">
      {/* 1. TOP HEADER Dan PROGRESS */}
      <div className="pt-safe px-3 sm:px-6 py-2.5 sm:py-4 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between gap-2 sm:gap-4 shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          <button
            onClick={() => {
              stopAudio();
              onExit();
            }}
            className="p-1.5 sm:p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
            title="Keluar Sesi (Esc)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 truncate">
              <Layers className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate max-w-[120px] sm:max-w-xs">{deckName}</span>
            </h4>
            <p className="text-[11px] sm:text-[11px] text-zinc-400">
              Kartu {currentIndex + 1} / {queue.length}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="w-20 sm:w-32 md:w-48 h-1.5 sm:h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <button
            onClick={toggleMute}
            className={`p-1.5 sm:p-2 rounded-lg transition-colors cursor-pointer ${
              isMuted
                ? 'text-rose-400 hover:text-rose-300 bg-rose-950/40'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
            title={isMuted ? 'Nyalakan Suara (M)' : 'Matikan Suara (M)'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
          <button
            onClick={() => {
              stopAudio();
              onExit();
            }}
            className="p-1 sm:p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* 2. FLASHCARD CONTAINER */}
      <div className="flex-1 min-h-0 flex p-2.5 sm:p-4 md:p-8 max-w-4xl w-full mx-auto overflow-y-auto">
        <div
          onClick={() => !isRevealed && setIsRevealed(true)}
          className={`m-auto w-full max-h-full bg-[#101726]/95 border border-[#24324E] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 shadow-2xl flex flex-col min-h-[250px] sm:min-h-[340px] md:min-h-[440px] transition-all duration-200 ${
            !isRevealed ? 'cursor-pointer hover:border-[#334155]' : ''
          }`}
        >
          {/* Audio Controls Bar */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center shrink-0 pb-3 sm:pb-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleReplayAudio();
              }}
              className={`p-2 sm:p-3 rounded-full transition-all cursor-pointer shadow-md flex items-center gap-1.5 sm:gap-2 ${
                isMuted
                  ? 'opacity-40 bg-zinc-800 text-zinc-500'
                  : isPlayingAudio
                    ? 'bg-[#C0392B] text-white animate-pulse shadow-rose-900/40'
                    : 'bg-[#C0392B]/15 hover:bg-[#C0392B]/25 text-rose-300'
              }`}
              title={isMuted ? 'Suara sedang dimatikan (M)' : 'Dengarkan Pelafalan (R)'}
            >
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#FB7185]" />
              <span className="text-[11px] sm:text-xs font-bold">
                {currentCard.audioUrls && currentCard.audioUrls.length > 1
                  ? isRevealed ? 'Putar Kalimat (R)' : 'Putar Kata (R)'
                  : 'Putar Audio (R)'}
              </span>
            </button>

            {/* Extra button if both Word Audio Dan Sentence Audio exist */}
            {isRevealed && currentCard.audioUrls && currentCard.audioUrls.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playAudio(currentCard.audioUrls![0], currentCard.frontContent);
                }}
                className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer text-[11px] sm:text-xs font-bold flex items-center gap-1.5 border border-zinc-700"
                title="Dengarkan Kata (Depan)"
              >
                <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-400" /> Putar Kata
              </button>
            )}

            {/* Indikator kegagalan audio */}
            {audioFailed && !isMuted && (
              <span className="text-[11px] text-amber-400 font-medium">
                Suara tidak tersedia di perangkat ini
              </span>
            )}

            {cardHanzi && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setWritingOpen(true);
                }}
                className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 hover:text-rose-200 transition-all cursor-pointer text-[11px] sm:text-xs font-bold flex items-center gap-1.5 border border-rose-700/60"
                title={`Tutorial urutan goresan + papan tulis (${cardHanzi})`}
              >
                <PenTool className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Tulis {cardHanzi.length > 4 ? `${cardHanzi.slice(0, 4)}…` : cardHanzi}
              </button>
            )}
          </div>

          {/* Card Content */}
          <div className="flex-1 min-h-0 overflow-y-auto w-full">
            <div className="min-h-full space-y-4 sm:space-y-6 flex flex-col items-center justify-center text-center py-1">
              {!isRevealed ? (
                /* 1. Sisi Depan */
                <div
                  className="anki-card-content text-xl sm:text-2xl md:text-4xl font-bold text-white leading-relaxed tracking-wide max-w-none w-full break-words"
                  dangerouslySetInnerHTML={{ __html: currentCard.frontContent }}
                />
              ) : backAlreadyContainsFront ? (
                /* 2. Sisi Belakang Mandiri */
                <div
                  className="anki-card-content text-xl sm:text-2xl md:text-3xl font-bold text-white leading-relaxed max-w-none w-full break-words animate-in fade-in duration-200"
                  dangerouslySetInnerHTML={{ __html: currentCard.backContent }}
                />
              ) : (
                /* 3. Sisi Belakang Kombinasi */
                <div className="w-full space-y-4 sm:space-y-6">
                  <div
                    className="anki-card-content text-xl sm:text-2xl md:text-4xl font-bold text-white leading-relaxed tracking-wide max-w-none w-full break-words"
                    dangerouslySetInnerHTML={{ __html: currentCard.frontContent }}
                  />
                  <div className="w-full pt-4 sm:pt-6 border-t border-zinc-800 animate-in fade-in slide-in-from-bottom-3 duration-200 space-y-3 sm:space-y-4">
                    <div
                      className="anki-card-content text-sm sm:text-lg md:text-2xl font-bold text-rose-100 leading-relaxed max-w-none w-full break-words"
                      dangerouslySetInnerHTML={{ __html: currentCard.backContent }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Flip Hint (When front only) */}
          {!isRevealed && (
            <div className="pt-6 sm:pt-8 text-center shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-zinc-800/80 text-zinc-400 text-[11px] sm:text-xs font-semibold hover:text-white hover:bg-zinc-700 transition-colors">
                <span>Klik kartu untuk melihat jawaban</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. BOTTOM ACTION BAR (4 Anki Buttons) */}
      <div className="pb-safe pb-4 p-3 sm:p-4 md:p-6 border-t border-zinc-800/80 bg-slate-950/95 backdrop-blur-md shrink-0 relative z-10">
        <div className="max-w-3xl mx-auto">
          {!isRevealed ? (
            <Button
              onClick={() => setIsRevealed(true)}
              className="w-full py-3.5 sm:py-4 text-sm sm:text-base font-bold bg-[#C0392B] hover:bg-[#a93226] text-white rounded-xl sm:rounded-2xl shadow-lg shadow-rose-900/30 cursor-pointer"
            >
              Tampilkan Jawaban (Spasi)
            </Button>
          ) : (
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2 md:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-150">
              {intervalPreviews.map((btn, idx) => {
                const colorMap = {
                  again: 'bg-rose-950/80 hover:bg-rose-900 border-rose-800/60 text-rose-200 focus:ring-rose-500',
                  hard: 'bg-amber-950/80 hover:bg-amber-900 border-amber-800/60 text-amber-200 focus:ring-amber-500',
                  good: 'bg-emerald-950/80 hover:bg-emerald-900 border-emerald-800/60 text-emerald-200 focus:ring-emerald-500',
                  easy: 'bg-indigo-950/80 hover:bg-indigo-900 border-indigo-800/60 text-indigo-200 focus:ring-indigo-500',
                };

                return (
                  <button
                    key={btn.rating}
                    onClick={() => handleRate(btn.rating)}
                    className={`p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl border flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer shadow-lg min-w-0 ${colorMap[btn.rating]}`}
                  >
                    <span className="hidden sm:inline text-[11px] md:text-xs opacity-70 font-mono">[{idx + 1}]</span>
                    <span className="text-[11px] sm:text-xs md:text-base font-bold tracking-tight leading-tight break-words w-full text-center">{btn.label}</span>
                    <span className="text-[10px] sm:text-[11px] md:text-xs opacity-80 mt-0.5 leading-tight break-words w-full text-center">{btn.intervalText}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {writingOpen && cardHanzi && (
        <HanziPracticeView
          character={cardHanzi}
          meaning={(currentCard?.backContent || '').replace(/<[^>]*>/g, ' ').trim().slice(0, 80)}
          onClose={() => setWritingOpen(false)}
        />
      )}
    </div>
  );
}

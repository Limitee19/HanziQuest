import React, { useState, useEffect } from 'react';
import { Sparkles, Flame, Volume2, VolumeX, EyeOff } from 'lucide-react';
import confetti from 'canvas-confetti';
import { course } from '@/data/course';
import type { CourseWord } from '@/data/course.types';
import { meaningOf } from '@/data/course.types';
import { speakHanzi, playSuccessChime, playErrorBuzz, clickTick } from '@/lib/fx';
import { usePrefs } from '@/lib/prefs';
import { recordQuestWordReview, saveMnemonicNote, getMnemonicNotes, syncStudentQuestProgress } from '@/services/chinese/questService';
import { formatPartOfSpeech } from '@/services/chinese/dictionaryService';
import { getWordExampleSentence } from '@/services/chinese/exampleSentenceService';

interface SessionPageProps {
  initialLevel?: number;
  onBackToMap?: () => void;
}

const OUTPOST_INFO: Record<number, { name: string; icon: string; subtitle: string; desc: string }> = {
  1: { name: 'Pos 1: Gerbang Desa', icon: '⛩️', subtitle: 'HSK 1 (500 kata)', desc: 'Lembah Permulaan · Kosakata dasar sehari-hari' },
  2: { name: 'Pos 2: Jembatan Bambu', icon: '🎋', subtitle: 'HSK 2 (772 kata)', desc: 'Hutan Bambu Dan Sungai · Percakapan dasar dan hubungan sosial' },
  3: { name: 'Pos 3: Paviliun Teh', icon: '🍵', subtitle: 'HSK 3 (973 kata)', desc: 'Air Terjun Dan Sakura · Tata bahasa menengah dan kerja rutin' },
  4: { name: 'Pos 4: Menara Lentera', icon: '🏮', subtitle: 'HSK 4 (1.000 kata)', desc: 'Ngarai Lentera Senja · Diskusi topik umum Dan opini' },
  5: { name: 'Pos 5: Gunung Berkabut', icon: '⛰️', subtitle: 'HSK 5 (1.071 kata)', desc: 'Tebing Awan Dan Salju · Artikel, koran, dan film Mandarin' },
  6: { name: 'Pos 6: Pagoda Puncak', icon: '🏯', subtitle: 'HSK 6 (1.140 kata)', desc: 'Istana Awan Emas · Kemahiran tingkat lanjut Dan sastra' },
};

export const SessionPage: React.FC<SessionPageProps> = ({ initialLevel = 1, onBackToMap }) => {
  const { sound, arcade, target, hidePinyinAudio, toggleHidePinyinAudio } = usePrefs();
  const [level, setLevel] = useState<number>(initialLevel);
  const [studyMode, setStudyMode] = useState<'flashcard' | 'quiz'>('flashcard');
  const [sessionTarget] = useState<number>(target || 10);

  // Kata-kata yang dipelajari pada sesi ini
  const [sessionWords, setSessionWords] = useState<CourseWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Flashcard state
  const [isRevealed, setIsRevealed] = useState(false);
  const [mnemonics, setMnemonics] = useState<Record<string, string>>({});
  const [isEditingMnemonic, setIsEditingMnemonic] = useState(false);
  const [mnemonicDraft, setMnemonicDraft] = useState('');

  // Quiz state
  const [quizOptions, setQuizOptions] = useState<CourseWord[]>([]);
  const [selectedQuizIdx, setSelectedQuizIdx] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);

  // Session stats Dan Arcade
  const [streak, setStreak] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [reviewedWordsCount, setReviewedWordsCount] = useState(0);
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  // Inisialisasi daftar kata sesi berdasarkan level
  useEffect(() => {
    const pool = course.words.filter((w) => parseInt(w.level, 10) === level);
    // Shuffle pool untuk variasi
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, sessionTarget);
    setSessionWords(selected);
    setCurrentIndex(0);
    setIsRevealed(false);
    setReviewedWordsCount(0);
    setIsSessionComplete(false);
    setMnemonics(getMnemonicNotes());
  }, [level, sessionTarget]);

  const currentWord: CourseWord | undefined = sessionWords[currentIndex];
  const currentExample = currentWord
    ? getWordExampleSentence(currentWord.hanzi, meaningOf(currentWord), currentWord.pinyin)
    : null;

  // Siapkan opsi kuis pilihan ganda jika mode kuis aktif
  useEffect(() => {
    if (!currentWord || studyMode !== 'quiz') return;
    const pool = course.words.filter((w) => w.id !== currentWord.id && parseInt(w.level, 10) === level);
    const distractors = [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [currentWord, ...distractors].sort(() => Math.random() - 0.5);
    setQuizOptions(options);
    setSelectedQuizIdx(null);
    setQuizAnswered(false);
  }, [currentWord, studyMode, level]);

  // Otomatis lafalkan jika kartu baru muncul, suara aktif, DAN tidak dalam mode ingatan (sembunyikan pinyin/suara)
  useEffect(() => {
    if (currentWord && sound && !isRevealed && !isSessionComplete && !hidePinyinAudio) {
      speakHanzi(currentWord.hanzi);
    }
  }, [currentWord, sound, isRevealed, isSessionComplete, hidePinyinAudio]);

  // Handler SRS Rating Flashcard
  const handleRate = async (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentWord) return;
    clickTick(sound);

    if (rating === 'again') {
      playErrorBuzz(sound);
      setStreak(0);
    } else {
      playSuccessChime(sound);
      const newStreak = streak + 1;
      setStreak(newStreak);
      const bonus = arcade ? (rating === 'easy' ? 30 : 20) + newStreak * 2 : 10;
      setXpEarned((prev) => prev + bonus);

      if (arcade && newStreak % 3 === 0) {
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
      }
    }

    await recordQuestWordReview(currentWord, rating);

    setReviewedWordsCount((prev) => prev + 1);

    if (currentIndex + 1 >= sessionWords.length) {
      if (arcade) {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      }
      setIsSessionComplete(true);
      syncStudentQuestProgress(true).catch(() => {});
    } else {
      setCurrentIndex((prev) => prev + 1);
      setIsRevealed(false);
      setIsEditingMnemonic(false);
    }
  };

  // Handler Pilihan Kuis
  const handleSelectQuiz = async (idx: number) => {
    if (quizAnswered || !currentWord) return;
    setSelectedQuizIdx(idx);
    setQuizAnswered(true);

    const isCorrect = quizOptions[idx]?.id === currentWord.id;

    if (isCorrect) {
      playSuccessChime(sound);
      const newStreak = streak + 1;
      setStreak(newStreak);
      const bonus = arcade ? 25 + newStreak * 3 : 15;
      setXpEarned((prev) => prev + bonus);

      if (arcade && newStreak % 3 === 0) {
        confetti({ particleCount: 35, spread: 65, origin: { y: 0.7 } });
      }
      await recordQuestWordReview(currentWord, 'good');
    } else {
      playErrorBuzz(sound);
      setStreak(0);
      await recordQuestWordReview(currentWord, 'again');
    }

    setReviewedWordsCount((prev) => prev + 1);
  };

  const handleNextQuiz = () => {
    clickTick(sound);
    if (currentIndex + 1 >= sessionWords.length) {
      if (arcade) {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      }
      setIsSessionComplete(true);
      syncStudentQuestProgress(true).catch(() => {});
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedQuizIdx(null);
      setQuizAnswered(false);
    }
  };

  // Keyboard shortcut listener (Space untuk reveal, 1-4 untuk rate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSessionComplete || isEditingMnemonic) return;
      if (studyMode === 'flashcard') {
        if (!isRevealed && (e.code === 'Space' || e.code === 'Enter')) {
          e.preventDefault();
          setIsRevealed(true);
          clickTick(sound);
        } else if (isRevealed) {
          if (e.key === '1') handleRate('again');
          else if (e.key === '2') handleRate('hard');
          else if (e.key === '3') handleRate('good');
          else if (e.key === '4') handleRate('easy');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRevealed, isSessionComplete, isEditingMnemonic, studyMode]);

  const handleSaveMnemonic = () => {
    if (!currentWord) return;
    saveMnemonicNote(currentWord.id, mnemonicDraft);
    setMnemonics((prev) => ({ ...prev, [currentWord.id]: mnemonicDraft }));
    setIsEditingMnemonic(false);
    clickTick(sound);
  };

  const outpost = OUTPOST_INFO[level] || OUTPOST_INFO[1];
  const progressPct = sessionWords.length > 0 ? Math.round((currentIndex / sessionWords.length) * 100) : 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-300">
      {/* ── Top Header Navigation Bar ── */}
      <div 
        className="bg-[#FFFDF9] dark:bg-[#151E32] border border-zinc-300 dark:border-[#24324E] rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ boxShadow: '0 10px 24px -4px rgba(35, 31, 32, 0.08)' }}
      >
        <div className="flex items-center gap-3">
          {onBackToMap && (
            <button
              type="button"
              onClick={() => {
                clickTick(sound);
                onBackToMap();
              }}
              className="p-2 sm:p-2.5 rounded-2xl border-2 border-zinc-300 dark:border-[#24324E] bg-white dark:bg-[#1C2742] hover:bg-zinc-100 dark:hover:bg-[#253252] text-zinc-800 dark:text-zinc-200 font-bold text-xs sm:text-sm cursor-pointer shadow-xs transition-transform active:scale-95 shrink-0"
              title="Kembali ke Peta Petualangan"
            >
              ← Peta
            </button>
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xl shrink-0">{outpost.icon}</span>
              <h1 className="font-serif text-base sm:text-xl font-bold text-[#231F20] dark:text-zinc-100">
                {outpost.name}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-[11px] sm:text-xs font-bold border border-amber-300 dark:border-amber-700/60">
                {outpost.subtitle}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {outpost.desc}
            </p>
          </div>
        </div>

        {/* Level Selector Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[1, 2, 3, 4, 5, 6].map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => {
                clickTick(sound);
                setLevel(l);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                level === l
                  ? 'bg-[#C0392B] border-[#78281F] text-white shadow-xs'
                  : 'bg-white dark:bg-[#1C2742] border-zinc-200 dark:border-[#24324E] text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-500'
              }`}
            >
              Pos {l}
            </button>
          ))}
        </div>
      </div>

      {/* ── Session Progress Dan Mode Bar ── */}
      <div 
        className="bg-white dark:bg-[#151E32] border border-zinc-200 dark:border-[#24324E] rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4"
        style={{ boxShadow: '0 4px 12px -2px rgba(15, 23, 42, 0.05)' }}
      >
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 shrink-0">
            Kartu {Math.min(currentIndex + 1, sessionWords.length)} / {sessionWords.length}
          </span>
          <div className="flex-1 sm:w-48 h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700">
            <div
              className="h-full bg-linear-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto">
          {arcade && (
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700/60 text-amber-800 dark:text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> +{xpEarned} XP
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-600" /> {streak} Streak
              </span>
            </div>
          )}

          {/* Mode Tabs */}
          <div className="bg-zinc-100 dark:bg-[#0B111E] p-1 rounded-xl flex items-center gap-1 border border-zinc-200 dark:border-[#24324E]">
            <button
              type="button"
              onClick={() => {
                clickTick(sound);
                setStudyMode('flashcard');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                studyMode === 'flashcard' ? 'bg-white dark:bg-[#1C2742] text-zinc-900 dark:text-zinc-100 shadow-xs' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Kartu Pintar (SRS)
            </button>
            <button
              type="button"
              onClick={() => {
                clickTick(sound);
                setStudyMode('quiz');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                studyMode === 'quiz' ? 'bg-white dark:bg-[#1C2742] text-zinc-900 dark:text-zinc-100 shadow-xs' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Kuis Pilihan Ganda
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Session Area ── */}
      {isSessionComplete ? (
        /* Completion Card */
        <div 
          className="bg-[#FFFDF9] dark:bg-[#151E32] border border-zinc-300 dark:border-[#24324E] rounded-3xl p-8 sm:p-12 text-center space-y-6 animate-in zoom-in-95 duration-300"
          style={{ boxShadow: '0 12px 32px -4px rgba(35, 31, 32, 0.08)' }}
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 border-3 border-emerald-500 text-4xl flex items-center justify-center animate-bounce shadow-md">
            🎉
          </div>
          <div>
            <h2 className="font-serif text-3xl font-extrabold text-[#231F20]">
              Sesi Pos {level} Berhasil Dituntaskan!
            </h2>
            <p className="text-zinc-600 text-sm mt-1 max-w-md mx-auto">
              Kamu telah melatih <strong>{reviewedWordsCount} aksara</strong> hari ini. Terus siram setiap hari agar bunga aksaramu mekar sempurna di Kebun Petualangan!
            </p>
          </div>

          {arcade && (
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-amber-50 rounded-2xl border border-amber-300 text-amber-900 font-bold text-base shadow-xs">
              <span>Total XP Diperoleh: +{xpEarned} XP</span>
              <span>Streak Tertinggi: {streak}</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => {
                clickTick(sound);
                // Restart new batch
                const pool = course.words.filter((w) => parseInt(w.level, 10) === level);
                const shuffled = [...pool].sort(() => Math.random() - 0.5);
                setSessionWords(shuffled.slice(0, sessionTarget));
                setCurrentIndex(0);
                setIsRevealed(false);
                setIsSessionComplete(false);
              }}
              className="px-6 py-3 rounded-2xl bg-[#C0392B] hover:bg-[#a93226] text-white font-bold text-sm cursor-pointer shadow-xs transition-transform active:scale-95"
            >
              Lanjut 10 Kartu Lagi ➔
            </button>
            {onBackToMap && (
              <button
                type="button"
                onClick={() => {
                  clickTick(sound);
                  onBackToMap();
                }}
                className="px-6 py-3 rounded-2xl bg-white dark:bg-[#1C2742] border border-zinc-300 dark:border-[#24324E] hover:bg-zinc-100 dark:hover:bg-[#253252] text-zinc-800 dark:text-zinc-200 font-bold text-sm cursor-pointer shadow-xs"
              >
                Kembali ke Peta
              </button>
            )}
          </div>
        </div>
      ) : !currentWord ? (
        <div className="bg-white dark:bg-[#151E32] p-12 rounded-3xl border-2 border-zinc-200 dark:border-[#24324E] text-center">
          <p className="text-zinc-500 dark:text-zinc-400">Memuat materi aksara...</p>
        </div>
      ) : studyMode === 'flashcard' ? (
        /* ── FLASHCARD SRS MODE ── */
        <div 
          className="bg-[#FFFDF9] dark:bg-[#151E32] border border-zinc-300 dark:border-[#24324E] rounded-3xl p-6 sm:p-10 space-y-8 relative overflow-hidden"
          style={{ boxShadow: '0 12px 32px -4px rgba(35, 31, 32, 0.08), 0 2px 6px -1px rgba(35, 31, 32, 0.04)' }}
        >
          {/* Top Word Level Badge Dan Memory Mode Toggle */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 text-xs font-bold">
                Pos {level} · HSK {level}
              </span>
              <button
                type="button"
                onClick={() => {
                  clickTick(sound);
                  toggleHidePinyinAudio();
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs ${
                  hidePinyinAudio
                    ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700/60 text-rose-800 dark:text-rose-200 ring-1 ring-rose-400/30'
                    : 'bg-zinc-100 dark:bg-[#1C2742] border-zinc-200 dark:border-[#24324E] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-[#253252]'
                }`}
                title="Sembunyikan Pinyin dan Audio saat menebak untuk melatih daya ingat"
              >
                {hidePinyinAudio ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    <span>Mode Ingatan: Pinyin Dan Suara Nonaktif</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Pinyin Dan Suara: Aktif</span>
                  </>
                )}
              </button>
            </div>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
              Frekuensi rank #{currentWord.freq || '-'}
            </span>
          </div>

          {/* Grand Hanzi Character Display */}
          <div className="text-center space-y-4 py-4">
            <div className="inline-block relative">
              <span 
                className="font-serif text-7xl sm:text-8xl font-black text-[#C0392B] dark:text-[#FB7185] select-none block tracking-wide"
                style={{ textShadow: '0 2px 0 rgba(192, 57, 43, 0.2)' }}
              >
                {currentWord.hanzi}
              </span>
            </div>

            {/* Pinyin with Audio Pronunciation Button */}
            {!hidePinyinAudio || isRevealed ? (
              <div className="flex items-center justify-center gap-3 animate-in fade-in duration-200">
                <span className="font-mono text-2xl sm:text-3xl font-bold text-indigo-700 dark:text-indigo-400 tracking-wider">
                  {currentWord.pinyin}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    clickTick(sound);
                    speakHanzi(currentWord.hanzi);
                  }}
                  className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 flex items-center justify-center font-bold text-lg cursor-pointer shadow-xs transition-transform active:scale-95"
                  title="Dengarkan pelafalan audio"
                >
                  🔊
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 py-1">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-[#0B111E] border border-dashed border-zinc-300 dark:border-[#24324E] text-zinc-500 dark:text-zinc-400 text-xs font-medium select-none">
                  <EyeOff className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Pinyin Dan Suara disembunyikan (fokus ingat aksara)</span>
                </div>
              </div>
            )}
          </div>

          {/* Reveal or Meaning Section */}
          {!isRevealed ? (
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => {
                  clickTick(sound);
                  setIsRevealed(true);
                }}
                className="w-full py-4 px-6 rounded-2xl bg-[#C0392B] hover:bg-[#a93226] text-white font-extrabold text-base cursor-pointer transition-all active:scale-98 shadow-xs"
              >
                Buka Makna Dan Jawaban (Spasi / Klik)
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Meaning Dan Details Card */}
              <div className="p-5 bg-amber-50/70 dark:bg-amber-950/40 border-2 border-amber-200 dark:border-amber-800/60 rounded-2xl space-y-2">
                <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
                  Arti Bahasa Indonesia:
                </span>
                <p className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                  {meaningOf(currentWord)}
                </p>
                {currentWord.pos && (
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 text-xs font-semibold">
                    Kelas Kata: {formatPartOfSpeech(currentWord.pos)}
                  </span>
                )}
              </div>

              {/* 💬 Example Sentence Card */}
              {currentExample && (
                <div className="p-5 bg-sky-50/70 dark:bg-sky-950/30 border-2 border-sky-200 dark:border-sky-800/60 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                      💬 Contoh Kalimat:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        clickTick(sound);
                        speakHanzi(currentExample.hanzi);
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-sky-100 dark:bg-sky-900/50 hover:bg-sky-200 dark:hover:bg-sky-800/60 text-sky-800 dark:text-sky-300 text-xs font-bold cursor-pointer transition-transform active:scale-95 shadow-2xs"
                      title="Dengarkan pelafalan kalimat contoh"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Dengarkan</span>
                    </button>
                  </div>
                  <p className="font-serif text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                    {currentExample.hanzi}
                  </p>
                  <p className="font-mono text-xs sm:text-sm font-semibold text-indigo-700 dark:text-indigo-400">
                    {currentExample.pinyin}
                  </p>
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 italic pt-0.5">
                    "{currentExample.meaning}"
                  </p>
                </div>
              )}

              {/* Mnemonic / Personal Note */}
              <div className="p-4 bg-zinc-50 dark:bg-[#0B111E] border border-zinc-200 dark:border-[#24324E] rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300 flex items-center gap-1">
                    💡 Jembatan Keledai (Mnemonik):
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingMnemonic(!isEditingMnemonic);
                      setMnemonicDraft(mnemonics[currentWord.id] || '');
                    }}
                    className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    {isEditingMnemonic ? 'Tutup' : mnemonics[currentWord.id] ? 'Ubah' : '+ Tulis Mnemonik'}
                  </button>
                </div>

                {isEditingMnemonic ? (
                  <div className="space-y-2 pt-1">
                    <textarea
                      rows={2}
                      value={mnemonicDraft}
                      onChange={(e) => setMnemonicDraft(e.target.value)}
                      placeholder="Trik asosiasi caramu mengingat karakter ini..."
                      className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-[#24324E] bg-white dark:bg-[#151E32] text-zinc-900 dark:text-zinc-100 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={handleSaveMnemonic}
                        className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                      >
                        Simpan
                      </button>
                    </div>
                  </div>
                ) : mnemonics[currentWord.id] ? (
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 italic">
                    "{mnemonics[currentWord.id]}"
                  </p>
                ) : (
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 italic">
                    Belum ada catatan pribadi. Tambahkan mnemonik untuk memperkuat daya ingatmu!
                  </p>
                )}
              </div>

              {/* 4 Tactile SRS Rating Buttons */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 text-center block">
                  Berapa mudah kamu mengingat kata ini?
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleRate('again')}
                    className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 font-bold text-xs cursor-pointer transition-transform active:scale-95 text-center space-y-0.5 shadow-xs"
                  >
                    <div className="font-extrabold text-sm">🔴 Ulang</div>
                    <div className="text-[10px] text-rose-600 dark:text-rose-400">&lt; 1 mnt (1)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRate('hard')}
                    className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 font-bold text-xs cursor-pointer transition-transform active:scale-95 text-center space-y-0.5 shadow-xs"
                  >
                    <div className="font-extrabold text-sm">🟠 Sukar</div>
                    <div className="text-[10px] text-amber-600 dark:text-amber-400">12 jam (2)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRate('good')}
                    className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs cursor-pointer transition-transform active:scale-95 text-center space-y-0.5 shadow-xs"
                  >
                    <div className="font-extrabold text-sm">🟢 Bagus</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400">1 hari (3)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRate('easy')}
                    className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-900/60 text-indigo-800 dark:text-indigo-300 font-bold text-xs cursor-pointer transition-transform active:scale-95 text-center space-y-0.5 shadow-xs"
                  >
                    <div className="font-extrabold text-sm">🔵 Mudah</div>
                    <div className="text-[10px] text-indigo-600 dark:text-indigo-400">4 hari (4)</div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ── QUIZ MULTIPLE CHOICE MODE ── */
        <div 
          className="bg-[#FFFDF9] dark:bg-[#151E32] border border-zinc-300 dark:border-[#24324E] rounded-3xl p-6 sm:p-10 space-y-8"
          style={{ boxShadow: '0 12px 32px -4px rgba(35, 31, 32, 0.08)' }}
        >
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Tebak Arti yang Benar:
            </span>
            <div className="font-serif text-6xl sm:text-7xl font-black text-[#C0392B] dark:text-[#FB7185]">
              {currentWord.hanzi}
            </div>
            {!hidePinyinAudio || quizAnswered ? (
              <div className="flex items-center justify-center gap-2 animate-in fade-in duration-200">
                <span className="font-mono text-xl font-bold text-indigo-700 dark:text-indigo-400">
                  {currentWord.pinyin}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    clickTick(sound);
                    speakHanzi(currentWord.hanzi);
                  }}
                  className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 flex items-center justify-center cursor-pointer shadow-xs text-sm"
                  title="Dengarkan pelafalan audio"
                >
                  🔊
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center py-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-[#0B111E] text-zinc-400 text-xs font-medium">
                  <VolumeX className="w-3.5 h-3.5" /> Pinyin Dan Suara tersembunyi
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {quizOptions.map((opt, idx) => {
              const isSelected = selectedQuizIdx === idx;
              const isCorrect = opt.id === currentWord.id;

              let btnStyle = 'bg-white dark:bg-[#1C2742] border-zinc-200 dark:border-[#2D3D60] text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-400 shadow-xs';
              if (quizAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold shadow-xs';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-100 dark:bg-rose-950/60 border-rose-400 text-rose-900 dark:text-rose-200 font-bold shadow-xs';
                }
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={quizAnswered}
                  onClick={() => handleSelectQuiz(idx)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${btnStyle}`}
                >
                  <div className="text-xs text-zinc-400 dark:text-zinc-500 font-bold mb-1">
                    Pilihan {idx + 1}
                  </div>
                  <div className="text-sm font-semibold leading-snug">
                    {meaningOf(opt)}
                  </div>
                </button>
              );
            })}
          </div>

          {quizAnswered && currentExample && (
            <div className="p-4 bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 rounded-2xl space-y-1.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                  💬 Contoh Kalimat:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    clickTick(sound);
                    speakHanzi(currentExample.hanzi);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-sky-100 dark:bg-sky-900/50 hover:bg-sky-200 dark:hover:bg-sky-800/60 text-sky-800 dark:text-sky-300 text-xs font-bold cursor-pointer transition-transform active:scale-95 shadow-2xs"
                  title="Dengarkan kalimat"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Dengarkan
                </button>
              </div>
              <p className="font-serif text-base font-bold text-zinc-900 dark:text-zinc-100">
                {currentExample.hanzi}
              </p>
              <p className="font-mono text-xs font-semibold text-indigo-700 dark:text-indigo-400">
                {currentExample.pinyin}
              </p>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 italic">
                "{currentExample.meaning}"
              </p>
            </div>
          )}

          {quizAnswered && (
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNextQuiz}
                className="px-6 py-3 rounded-2xl bg-[#C0392B] hover:bg-[#a93226] text-white font-bold text-sm cursor-pointer shadow-xs transition-transform active:scale-95"
              >
                Lanjut ke Soal Berikutnya ➔
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

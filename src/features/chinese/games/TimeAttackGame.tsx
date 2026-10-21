// ====================================================================
// OmniLife Chinese Arena — Time Attack 60 detik
//
// Kuis cepat: hanzi → pilih arti yang benar dari 4 opsi. Combo
// multiplier tiap jawaban benar beruntun, 3 nyawa. Kata yang sering
// salah diprioritaskan muncul (bobot dari peta kata lemah).
// ====================================================================
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Heart, Play, Trophy, Volume2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { speakChineseOnline } from '@/services/chinese/passiveLearningService';
import {
  GameWord,
  formatDuration,
  getUniqueMeaningPool,
  loadBest,
  pickWeighted,
  recordWordResult,
  saveBest,
  sampleN,
  shuffle,
  wordWeight,
} from '@/services/chinese/games/gameService';

const ROUND_MS = 60_000;
const MAX_LIVES = 3;

interface Question {
  word: GameWord;
  options: GameWord[];
}

function makeQuestion(pool: GameWord[]): Question {
  const word = pickWeighted(pool, wordWeight);
  const distractors = sampleN(
    pool.filter((w) => w.id !== word.id && w.meaning !== word.meaning),
    3
  );
  return { word, options: shuffle([word, ...distractors]) };
}

interface Props {
  onExit: () => void;
  /** Opsional: batasi pool ke daftar id kata (mis. kata due Program Harian). */
  poolWordIds?: string[];
}

export function TimeAttackGame({ onExit, poolWordIds }: Props) {
  const [screen, setScreen] = useState<'idle' | 'play' | 'over'>('idle');
  const [question, setQuestion] = useState<Question | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [remainingMs, setRemainingMs] = useState(ROUND_MS);
  const [newRecord, setNewRecord] = useState(false);

  const deadlineRef = useRef<number>(0);
  const poolRef = useRef<GameWord[]>([]);
  const feedbackLockRef = useRef(false);

  // Timer countdown.
  useEffect(() => {
    if (screen !== 'play') return;
    const iv = window.setInterval(() => {
      const left = deadlineRef.current - Date.now();
      setRemainingMs(Math.max(0, left));
      if (left <= 0) setScreen('over');
    }, 250);
    return () => window.clearInterval(iv);
  }, [screen]);

  const startGame = useCallback(() => {
    let pool = getUniqueMeaningPool([1, 2, 3]);
    // Scoped pool (mis. dari Program Harian) — butuh ≥4 kata agar distraktor cukup.
    if (poolWordIds && poolWordIds.length >= 4) {
      const ids = new Set(poolWordIds);
      const scoped = pool.filter((w) => ids.has(w.id));
      if (scoped.length >= 4) pool = scoped;
    }
    poolRef.current = pool;
    if (poolRef.current.length < 8) return;
    deadlineRef.current = Date.now() + ROUND_MS;
    setRemainingMs(ROUND_MS);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setLives(MAX_LIVES);
    setCorrectCount(0);
    setWrongCount(0);
    setNewRecord(false);
    setPicked(null);
    feedbackLockRef.current = false;
    setQuestion(makeQuestion(poolRef.current));
    setScreen('play');
  }, [poolWordIds]);

  const handleAnswer = (option: GameWord) => {
    if (!question || feedbackLockRef.current || screen !== 'play') return;
    feedbackLockRef.current = true;
    setPicked(option.id);

    const isCorrect = option.id === question.word.id;
    if (isCorrect) {
      const bonus = Math.min(streak, 10) * 2; // +2 per streak, maks +20
      setScore((s) => s + 10 + bonus);
      setStreak((st) => {
        const next = st + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
      setCorrectCount((c) => c + 1);
      recordWordResult(question.word.id, true);
      // TTS diputar tanpa menahan aliran kuis — lock dibuka oleh timer di bawah.
      speakChineseOnline(question.word.hanzi).catch(() => undefined);
    } else {
      setWrongCount((w) => w + 1);
      setStreak(0);
      recordWordResult(question.word.id, false);
      const nextLives = lives - 1;
      setLives(nextLives);
      if (nextLives <= 0) {
        window.setTimeout(() => setScreen('over'), 900);
        return;
      }
    }

    window.setTimeout(() => {
      setPicked(null);
      feedbackLockRef.current = false;
      if (deadlineRef.current - Date.now() > 0) {
        setQuestion(makeQuestion(poolRef.current));
      }
    }, isCorrect ? 350 : 900);
  };

  // Simpan rekor saat ronde selesai (sekali).
  useEffect(() => {
    if (screen !== 'over' || score <= 0) return;
    const isNew = saveBest('timeattack', 'hsk123', score, false);
    setNewRecord(isNew);
  }, [screen, score]);

  const best = loadBest('timeattack', 'hsk123');

  if (screen === 'idle') {
    return (
      <div className="space-y-5">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-blue-600 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Arena
        </button>

        <div className="text-center space-y-2 py-2">
          <div className="text-5xl">⚡</div>
          <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Time Attack
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
            60 detik, jawab sebanyak mungkin hanzi → arti. Combo memberi poin bonus, tiga kali
            salah = tamat. Kata yang sering kamu salah akan lebih sering muncul.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 max-w-xs mx-auto">
          {best && (
            <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-semibold">
              <Trophy className="w-3.5 h-3.5" /> Rekor: {best.value} poin
            </div>
          )}
          <Button onClick={startGame} className="w-full justify-center">
            <Play className="w-4 h-4 mr-1.5 fill-white" /> Mulai (60 detik)
          </Button>
        </div>
      </div>
    );
  }

  if (screen === 'over') {
    const total = correctCount + wrongCount;
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    return (
      <div className="space-y-5">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-blue-600 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Arena
        </button>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 text-center space-y-4">
          <div className="text-4xl">{newRecord ? '🏆' : '⏱️'}</div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            {newRecord ? 'Rekor baru!' : 'Waktu habis!'}
          </h4>
          <p className="text-3xl font-black text-blue-600 dark:text-blue-400 tabular-nums">
            {score} poin
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
              <div className="font-bold text-emerald-700 dark:text-emerald-300">{correctCount}</div>
              <div className="text-emerald-600/70 dark:text-emerald-400/70">Benar</div>
            </div>
            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40">
              <div className="font-bold text-red-700 dark:text-red-300">{wrongCount}</div>
              <div className="text-red-600/70 dark:text-red-400/70">Salah</div>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40">
              <div className="font-bold text-amber-700 dark:text-amber-300">x{bestStreak}</div>
              <div className="text-amber-600/70 dark:text-amber-400/70">Combo terbaik</div>
            </div>
          </div>
          {total > 0 && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Akurasi: <span className="font-bold text-zinc-700 dark:text-zinc-200">{accuracy}%</span>
              {' • '}Durasi: {formatDuration(ROUND_MS - Math.max(0, remainingMs))}
            </p>
          )}
          <div className="flex items-center justify-center gap-2">
            <Button onClick={startGame} size="sm">
              <Play className="w-3.5 h-3.5 mr-1" /> Main lagi
            </Button>
            <Button onClick={() => setScreen('idle')} size="sm" variant="outline">
              Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── PLAY SCREEN ────────────────────────────────────────────────────────
  const secondsLeft = Math.ceil(remainingMs / 1000);
  const multiplier = 1 + Math.min(streak, 10) * 0.2;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-blue-600 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Keluar
        </button>

        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="flex items-center gap-0.5">
            {Array.from({ length: MAX_LIVES }, (_, i) => (
              <Heart
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < lives
                    ? 'fill-red-500 text-red-500'
                    : 'text-zinc-300 dark:text-zinc-700'
                }`}
              />
            ))}
          </span>
          <span className="tabular-nums text-zinc-600 dark:text-zinc-300">{score} poin</span>
          <span
            className={`tabular-nums font-black ${
              secondsLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-zinc-900 dark:text-zinc-100'
            }`}
          >
            {secondsLeft}s
          </span>
        </div>
      </div>

      {/* Progress waktu */}
      <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            secondsLeft <= 10 ? 'bg-red-500' : 'bg-blue-500'
          }`}
          style={{ width: `${(remainingMs / ROUND_MS) * 100}%` }}
        />
      </div>

      {streak >= 3 && (
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
          <Zap className="w-3.5 h-3.5 fill-amber-500" /> Combo x{streak} — poin ×
          {multiplier.toFixed(1)}
        </div>
      )}

      {question && (
        <div className="space-y-4">
          {/* Kartu soal */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-100 tracking-wide">
                {question.word.hanzi}
              </div>
            </div>
            <button
              onClick={() => {
                speakChineseOnline(question.word.hanzi).catch(() => undefined);
              }}
              title="Dengarkan"
              className="p-2.5 rounded-xl text-zinc-400 hover:text-blue-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 shrink-0 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Opsi jawaban */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {question.options.map((opt) => {
              const isPicked = picked === opt.id;
              const isAnswer = opt.id === question.word.id;
              const reveal = picked !== null;
              let tone = 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-blue-400 active:scale-[0.98]';
              if (reveal && isAnswer) tone = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40';
              else if (reveal && isPicked && !isAnswer) tone = 'border-red-500 bg-red-50 dark:bg-red-950/40';
              else if (reveal) tone = 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 opacity-50';
              return (
                <button
                  key={opt.id}
                  onClick={() => handleAnswer(opt)}
                  disabled={reveal}
                  className={`p-3.5 rounded-xl border text-left text-sm font-semibold transition-all cursor-pointer disabled:cursor-default ${tone}`}
                >
                  <span className={reveal && isAnswer ? 'text-emerald-700 dark:text-emerald-300' : reveal && isPicked ? 'text-red-700 dark:text-red-300' : 'text-zinc-800 dark:text-zinc-200'}>
                    {opt.meaning}
                  </span>
                  {reveal && isAnswer && (
                    <span className="block text-[11px] font-medium text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
                      {opt.hanzi} • {opt.pinyin}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

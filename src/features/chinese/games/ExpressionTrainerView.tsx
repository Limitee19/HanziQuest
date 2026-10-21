// ====================================================================
// OmniLife Chinese Arena — "Ucap!" Ungkapan Sehari-hari
//
// Tiga mode: Kartu Kilat (flashcard frasa Indonesia → Mandarin),
// Kuis (pilihan ganda hanzi), dan SmartTranslate (AI, panel terpisah).
// Status hafalan & koleksi tersimpan lokal via expressionService.
// ====================================================================
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, RotateCcw, Sparkles, Volume2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { speakChineseOnline } from '@/services/chinese/passiveLearningService';
import {
  DailyExpression,
  REGISTER_LABEL,
} from '@/services/chinese/expressions/dailyExpressions';
import {
  deleteCustomExpression,
  getAllExpressions,
  getCategoriesWithData,
  getExpressionProgress,
  markExpression,
} from '@/services/chinese/expressions/expressionService';
import { shuffle } from '@/services/chinese/games/gameService';
import { SmartTranslatePanel } from './SmartTranslatePanel';

type Mode = 'cards' | 'quiz' | 'ai';

const QUIZ_LENGTH = 10;

function RegisterBadge({ register }: { register: string }) {
  const tone =
    register === 'gaul'
      ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
      : register === 'formal'
        ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
        : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300';
  const label = REGISTER_LABEL[register as keyof typeof REGISTER_LABEL] || 'Netral';
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tone}`}>{label}</span>
  );
}

interface Props {
  onExit: () => void;
}

export function ExpressionTrainerView({ onExit }: Props) {
  const [mode, setMode] = useState<Mode>('cards');
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState('Semua');
  const [deck, setDeck] = useState<DailyExpression[]>([]);
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [progress, setProgress] = useState(getExpressionProgress());
  const [audioFailed, setAudioFailed] = useState(false);

  // Kuis
  const [quizDeck, setQuizDeck] = useState<DailyExpression[]>([]);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizPicked, setQuizPicked] = useState<string | null>(null);
  const [quizCorrect, setQuizCorrect] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  // Bangun deck kartu saat masuk mode cards / ganti kategori.
  useEffect(() => {
    if (mode !== 'cards') return;
    const all = getAllExpressions();
    setCategories(['Semua', ...getCategoriesWithData()]);
    const filtered =
      category === 'Semua' ? all : all.filter((e) => e.category === category);
    setDeck(shuffle(filtered));
    setCardIdx(0);
    setFlipped(false);
  }, [mode, category]);

  const refreshProgress = useCallback(() => {
    setProgress(getExpressionProgress());
  }, []);

  // ── KARTU KILAT ────────────────────────────────────────────────────────
  const currentCard = deck[cardIdx];

  const markAndAdvance = useCallback(
    (status: 'known' | 'review') => {
      if (!currentCard) return;
      markExpression(currentCard.id, status);
      refreshProgress();
      setFlipped(false);
      setCardIdx((i) => i + 1);
    },
    [currentCard, refreshProgress]
  );

  // ── KUIS ───────────────────────────────────────────────────────────────
  const startQuiz = useCallback(() => {
    const all = shuffle(getAllExpressions()).slice(0, QUIZ_LENGTH);
    setQuizDeck(all);
    setQuizIdx(0);
    setQuizPicked(null);
    setQuizCorrect(0);
    setQuizDone(false);
    setMode('quiz');
  }, []);

  const currentQuiz = quizDeck[quizIdx];
  const quizOptions = useMemo(() => {
    if (!currentQuiz) return [];
    const all = getAllExpressions();
    const sameCat = shuffle(
      all.filter((e) => e.id !== currentQuiz.id && e.hanzi !== currentQuiz.hanzi && e.category === currentQuiz.category)
    );
    const others = shuffle(
      all.filter((e) => e.id !== currentQuiz.id && e.hanzi !== currentQuiz.hanzi && e.category !== currentQuiz.category)
    );
    const distractors = [...sameCat, ...others].slice(0, 3);
    return shuffle([currentQuiz, ...distractors]);
    // Dep pada objek currentQuiz: identitas baru hanya saat quizIdx berubah.
  }, [currentQuiz]);

  const answerQuiz = (opt: DailyExpression) => {
    if (!currentQuiz || quizPicked) return;
    setQuizPicked(opt.id);
    const correct = opt.id === currentQuiz.id;
    if (correct) setQuizCorrect((c) => c + 1);
    markExpression(currentQuiz.id, correct ? 'known' : 'review');
    speakChineseOnline(currentQuiz.hanzi).catch(() => setAudioFailed(true));
    window.setTimeout(() => {
      refreshProgress();
      setQuizPicked(null);
      if (quizIdx + 1 >= quizDeck.length) setQuizDone(true);
      else setQuizIdx((i) => i + 1);
    }, 1100);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => {
            if (mode === 'ai') setMode('cards');
            else onExit();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-blue-600 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {mode === 'ai' ? 'Kembali ke latihan' : 'Kembali ke Arena'}
        </button>
        <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
          ✅ {progress.known} hafal • 🔁 {progress.review} ulang • {progress.total} total
        </div>
      </div>

      {/* Judul */}
      <div className="text-center space-y-1.5">
        <div className="text-4xl">💬</div>
        <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Ungkapan Sehari-hari
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          Cara orang Indonesia ngomong → padanan Mandarin yang natural. Belajar lewat kartu,
          kuis, atau minta AI menerjemahkan frasa apa pun.
        </p>
      </div>

      {/* Mode switcher */}
      <div className="grid grid-cols-3 gap-2">
        {(
          [
            { id: 'cards', label: '🃏 Kartu Kilat' },
            { id: 'quiz', label: '⚡ Kuis' },
            { id: 'ai', label: '🤖 SmartTranslate' },
          ] as { id: Mode; label: string }[]
        ).map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === m.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:border-blue-400'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* ── MODE: KARTU ── */}
      {mode === 'cards' && (
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  category === c
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:border-blue-400'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {deck.length === 0 ? (
            <p className="text-center text-xs text-zinc-400 py-8">Tidak ada ungkapan di kategori ini.</p>
          ) : cardIdx >= deck.length ? (
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 text-center space-y-3">
              <div className="text-4xl">🎉</div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Deck "{category}" selesai!
              </h4>
              <Button
                size="sm"
                onClick={() => {
                  setDeck(shuffle(getAllExpressions().filter((e) => category === 'Semua' || e.category === category)));
                  setCardIdx(0);
                  setFlipped(false);
                }}
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Ulangi deck
              </Button>
            </div>
          ) : (
            currentCard && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400">
                  <span>
                    Kartu {cardIdx + 1}/{deck.length}
                  </span>
                  <span>{currentCard.category}</span>
                </div>

                <button
                  onClick={() => setFlipped((f) => !f)}
                  className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 min-h-[150px] flex flex-col items-center justify-center gap-2 text-center cursor-pointer active:scale-[0.99] transition-transform"
                >
                  {!flipped ? (
                    <>
                      <p className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                        "{currentCard.indo}"
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-1">Ketuk untuk melihat jawaban</p>
                    </>
                  ) : (
                    <>
                      <p className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                        {currentCard.hanzi}
                      </p>
                      {currentCard.pinyin && (
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                          {currentCard.pinyin}
                        </p>
                      )}
                      {currentCard.literal && (
                        <p className="text-[11px] text-zinc-400 italic">
                          harfiah: {currentCard.literal}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <RegisterBadge register={currentCard.register} />
                      </div>
                      {currentCard.note && (
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">
                          💡 {currentCard.note}
                        </p>
                      )}
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    title="Dengarkan"
                    onClick={() =>
                      speakChineseOnline(currentCard.hanzi)
                        .then((ok) => {
                          if (!ok) setAudioFailed(true);
                        })
                        .catch(() => setAudioFailed(true))
                    }
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 justify-center"
                    onClick={() => markAndAdvance('review')}
                    disabled={!flipped}
                  >
                    🔁 Ulangi lagi
                  </Button>
                  <Button className="flex-1 justify-center" onClick={() => markAndAdvance('known')} disabled={!flipped}>
                    ✅ Hafal!
                  </Button>
                </div>

                {audioFailed && (
                  <p className="text-[11px] text-zinc-400 text-center">
                    Audio online tidak tersedia saat ini.
                  </p>
                )}
              </div>
            )
          )}
        </div>
      )}

      {/* ── MODE: KUIS ── */}
      {mode === 'quiz' && (
        <div className="space-y-4">
          {quizDeck.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 text-center space-y-3">
              <div className="text-4xl">⚡</div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
                {QUIZ_LENGTH} soal acak: frasa Indonesia → pilih hanzi yang benar. Yang salah
                otomatis ditandai "ulang".
              </p>
              <Button onClick={startQuiz} className="w-full justify-center">
                <Zap className="w-4 h-4 mr-1.5" /> Mulai Kuis
              </Button>
            </div>
          ) : quizDone && quizPicked === null ? (
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 text-center space-y-4">
              <div className="text-4xl">{quizCorrect >= QUIZ_LENGTH * 0.7 ? '🏆' : '⚡'}</div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Kuis selesai — {quizCorrect}/{quizDeck.length} benar
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Jawaban salah otomatis ditandai "ulang" supaya muncul lebih dulu di Kartu Kilat.
              </p>
              <div className="flex items-center justify-center gap-2">
                <Button size="sm" onClick={startQuiz}>
                  <Zap className="w-3.5 h-3.5 mr-1" /> Kuis lagi
                </Button>
                <Button size="sm" variant="outline" onClick={() => setMode('cards')}>
                  Ke Kartu
                </Button>
              </div>
            </div>
          ) : currentQuiz ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400">
                <span>
                  Soal {quizIdx + 1}/{quizDeck.length}
                </span>
                <span>✅ {quizCorrect}</span>
              </div>

              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 text-center space-y-1">
                <p className="text-[11px] text-zinc-400 uppercase tracking-wider font-bold">
                  Apa bahasa Mandarinnya?
                </p>
                <p className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  "{currentQuiz.indo}"
                </p>
                <span className="inline-block mt-1">
                  <RegisterBadge register={currentQuiz.register} />
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quizOptions.map((opt) => {
                  const reveal = quizPicked !== null;
                  const isAnswer = opt.id === currentQuiz.id;
                  const isPicked = quizPicked === opt.id;
                  let tone = 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-blue-400';
                  if (reveal && isAnswer) tone = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40';
                  else if (reveal && isPicked) tone = 'border-red-500 bg-red-50 dark:bg-red-950/40';
                  else if (reveal) tone = 'border-zinc-200 dark:border-zinc-800 opacity-50';
                  return (
                    <button
                      key={opt.id}
                      onClick={() => answerQuiz(opt)}
                      disabled={reveal}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer disabled:cursor-default ${tone}`}
                    >
                      <span className="block text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        {opt.hanzi}
                      </span>
                      {reveal && isAnswer && opt.pinyin && (
                        <span className="block text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
                          {opt.pinyin}
                        </span>
                      )}
                    </button>
                  );                })}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* ── MODE: SMARTTRANSLATE ── */}
      {mode === 'ai' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Frasa bebas → Mandarin natural. Hasil tersimpan otomatis masuk latihan.
          </div>
          <SmartTranslatePanel />
          {/* Koleksi kustom */}
          <CustomCollection />
        </div>
      )}
    </div>
  );
}

/** Daftar "Koleksi Saya" — hasil simpanan SmartTranslate, bisa dihapus. */
function CustomCollection() {
  const [items, setItems] = useState<DailyExpression[]>([]);

  useEffect(() => {
    setItems(getAllExpressions().filter((e) => e.category === 'Koleksi Saya'));
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-2">
      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
        Koleksi Saya ({items.length})
      </p>
      {items.map((e) => (
        <div
          key={e.id}
          className="flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 group"
        >
          <button
            onClick={() => speakChineseOnline(e.hanzi).catch(() => undefined)}
            className="min-w-0 text-left cursor-pointer"
          >
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{e.hanzi}</span>
            <span className="block text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
              {e.indo}
            </span>
          </button>
          <button
            onClick={() => {
              deleteCustomExpression(e.id);
              setItems((prev) => prev.filter((x) => x.id !== e.id));
            }}
            title="Hapus dari koleksi"
            className="text-[11px] font-bold text-zinc-300 dark:text-zinc-600 hover:text-red-500 shrink-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Hapus
          </button>
        </div>
      ))}
    </div>
  );
}

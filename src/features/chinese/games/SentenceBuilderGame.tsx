// ====================================================================
// OmniLife Chinese Arena — Susun Kalimat
//
// Kalimat contoh dari dataset HSK dipecah menjadi tile kata; susun
// kembali urutan yang benar. Token berasal dari alignment jumlah suku
// kata pinyin ↔ karakter hanzi (lihat gameService.tokenizeSentence).
// ====================================================================
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Play, RotateCcw, Star, Trophy, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { speakChineseOnline } from '@/services/chinese/passiveLearningService';
import {
  GameSentence,
  formatDuration,
  getSentencePool,
  loadBest,
  saveBest,
  shuffle,
} from '@/services/chinese/games/gameService';

const SENTENCES_PER_SESSION = 8;

interface RoundResult {
  stars: number;
  mistakes: number;
  seconds: number;
}

function starsFor(mistakes: number): number {
  if (mistakes === 0) return 3;
  if (mistakes === 1) return 2;
  return 1;
}

function shuffleTiles(sentence: GameSentence): number[] {
  let order = shuffle(sentence.tokens.map((_, i) => i));
  // Jangan kebetulan memberi urutan yang sudah benar.
  if (order.every((v, i) => v === i)) {
    order = [...order.slice(1), order[0]];
  }
  return order;
}

interface Props {
  onExit: () => void;
}

export function SentenceBuilderGame({ onExit }: Props) {
  const [screen, setScreen] = useState<'idle' | 'play' | 'done'>('idle');
  const [sentences, setSentences] = useState<GameSentence[]>([]);
  const [roundIdx, setRoundIdx] = useState(0);
  const [placed, setPlaced] = useState<number[]>([]);
  const [poolOrder, setPoolOrder] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [roundWrong, setRoundWrong] = useState(false);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [showPinyin, setShowPinyin] = useState(true);
  const [audioFailed, setAudioFailed] = useState(false);
  const [newRecord, setNewRecord] = useState(false);

  const roundStartRef = useRef<number>(Date.now());
  const checkingRef = useRef(false);

  const round = sentences[roundIdx];
  const best = loadBest('sentence', 'hsk123');

  const startSession = useCallback(() => {
    const pool = getSentencePool(7);
    if (pool.length < SENTENCES_PER_SESSION) return;
    // Ambil acak tapi seimbang: separuh pendek, separuh lebih panjang.
    const short = shuffle(pool.filter((s) => s.tokens.length <= 5));
    const long = shuffle(pool.filter((s) => s.tokens.length > 5));
    const picked = [...short.slice(0, 5), ...long.slice(0, 3)];
    setSentences(shuffle(picked));
    setRoundIdx(0);
    setResults([]);
    setMistakes(0);
    setNewRecord(false);
    setScreen('play');
  }, []);

  useEffect(() => {
    if (screen === 'play' && round) {
      setPoolOrder(shuffleTiles(round));
      setPlaced([]);
      setMistakes(0);
      setRoundWrong(false);
      roundStartRef.current = Date.now();
      checkingRef.current = false;
    }
  }, [screen, round]);

  const finishRound = useCallback(
    (totalMistakes: number) => {
      const seconds = Math.round((Date.now() - roundStartRef.current) / 1000);
      const stars = starsFor(totalMistakes);
      setResults((prev) => [...prev, { stars, mistakes: totalMistakes, seconds }]);
      speakChineseOnline(round?.fullHanzi || '')
        .then((ok) => {
          if (!ok) setAudioFailed(true);
        })
        .catch(() => setAudioFailed(true));
      if (roundIdx + 1 >= sentences.length) {
        setScreen('done');
      }
    },
    [round?.fullHanzi, roundIdx, sentences.length]
  );

  const checkAnswer = useCallback(() => {
    if (!round || checkingRef.current) return;
    if (placed.length !== round.tokens.length) return;
    checkingRef.current = true;
    const correct = placed.every((tokenIdx, pos) => tokenIdx === pos);
    if (correct) {
      finishRound(mistakes);
    } else {
      const nextMistakes = mistakes + 1;
      setMistakes(nextMistakes);
      setRoundWrong(true);
      window.setTimeout(() => setRoundWrong(false), 800);
    }
    checkingRef.current = false;
  }, [round, placed, mistakes, finishRound]);

  const nextRound = useCallback(() => {
    setRoundIdx((i) => i + 1);
  }, []);

  // Simpan rekor saat sesi selesai.
  const totalStars = useMemo(() => results.reduce((a, r) => a + r.stars, 0), [results]);
  useEffect(() => {
    if (screen !== 'done' || totalStars <= 0) return;
    const isNew = saveBest('sentence', 'hsk123', totalStars, false);
    setNewRecord(isNew);
  }, [screen, totalStars]);

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
          <div className="text-5xl">🧩</div>
          <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Susun Kalimat
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
            {SENTENCES_PER_SESSION} kalimat dari kosakata HSK diacak jadi tile kata. Susun
            urutannya, lalu dengarkan ucapannya. Makin sedikit salah, makin banyak bintang.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 max-w-xs mx-auto">
          {best && (
            <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-semibold">
              <Trophy className="w-3.5 h-3.5" /> Rekor: {best.value} bintang
            </div>
          )}
          <Button onClick={startSession} className="w-full justify-center">
            <Play className="w-4 h-4 mr-1.5 fill-white" /> Mulai
          </Button>
        </div>
      </div>
    );
  }

  if (screen === 'done') {
    return (
      <div className="space-y-5">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-blue-600 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Arena
        </button>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 text-center space-y-4">
          <div className="text-4xl">{newRecord ? '🏆' : '🧩'}</div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            {newRecord ? 'Rekor baru!' : 'Sesi selesai!'}
          </h4>
          <div className="flex items-center justify-center gap-1">
            {Array.from({ length: SENTENCES_PER_SESSION * 3 }, (_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < totalStars ? 'fill-amber-400 text-amber-400' : 'text-zinc-200 dark:text-zinc-700'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {totalStars} / {SENTENCES_PER_SESSION * 3} bintang •{' '}
            {results.reduce((a, r) => a + r.seconds, 0)} detik total
          </p>
          <div className="flex items-center justify-center gap-2">
            <Button onClick={startSession} size="sm">
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Main lagi
            </Button>
            <Button onClick={() => setScreen('idle')} size="sm" variant="outline">
              Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!round) return null;

  // ── PLAY SCREEN ────────────────────────────────────────────────────────
  const roundSolved = results.length > roundIdx;
  const complete = placed.length === round.tokens.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-blue-600 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Keluar
        </button>

        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="text-zinc-600 dark:text-zinc-300">
            Kalimat {roundIdx + 1}/{sentences.length}
          </span>
          <button
            onClick={() => setShowPinyin((v) => !v)}
            title="Petunjuk pinyin"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
          >
            {showPinyin ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            onClick={() => {
              speakChineseOnline(round.fullHanzi).catch(() => setAudioFailed(true));
            }}
            title="Dengarkan kalimat"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {audioFailed && (
        <p className="text-[11px] text-zinc-400">Audio online tidak tersedia — permainan tetap jalan.</p>
      )}

      {/* Arti target */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-1.5">
        <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Arti kalimat</p>
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-relaxed">
          {round.meaning}
        </p>
        {showPinyin && (
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{round.fullPinyin}</p>
        )}
      </div>

      {/* Area jawaban */}
      <div
        className={`min-h-[64px] rounded-2xl border-2 border-dashed p-2.5 flex flex-wrap gap-2 items-start transition-colors ${
          roundWrong
            ? 'border-red-400 bg-red-50/50 dark:bg-red-950/20'
            : 'border-zinc-300 dark:border-zinc-700'
        }`}
      >
        {placed.length === 0 && (
          <span className="text-xs text-zinc-400 self-center mx-auto">
            Ketik tile di bawah untuk menyusun kalimat…
          </span>
        )}
        {placed.map((tokenIdx, pos) => (
          <button
            key={`${tokenIdx}-${pos}`}
            onClick={() => {
              if (roundSolved) return;
              setPlaced((prev) => prev.filter((_, i) => i !== pos));
              setPoolOrder((prev) => [...prev, tokenIdx]);
            }}
            className={`px-3 py-2 rounded-xl border text-lg font-bold transition-all cursor-pointer ${
              roundWrong
                ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200'
                : 'border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 text-zinc-900 dark:text-zinc-100'
            }`}
          >
            {round.tokens[tokenIdx]}
          </button>
        ))}
      </div>

      {/* Pool tile */}
      <div className="flex flex-wrap gap-2">
        {poolOrder.map((tokenIdx) => (
          <button
            key={tokenIdx}
            onClick={() => {
              if (roundSolved) return;
              setPlaced((prev) => [...prev, tokenIdx]);
              setPoolOrder((prev) => prev.filter((i) => i !== tokenIdx));
            }}
            className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-lg font-bold text-zinc-900 dark:text-zinc-100 hover:border-blue-400 active:scale-95 transition-all cursor-pointer"
          >
            {round.tokens[tokenIdx]}
          </button>
        ))}
      </div>

      {/* Kontrol */}
      <div className="flex items-center gap-2">
        {!roundSolved ? (
          <Button
            onClick={checkAnswer}
            disabled={!complete}
            className="flex-1 justify-center"
          >
            Periksa
          </Button>
        ) : (
          <Button onClick={nextRound} className="flex-1 justify-center" disabled={roundIdx + 1 >= sentences.length}>
            {roundIdx + 1 >= sentences.length ? 'Selesai ✓' : 'Kalimat berikutnya →'}
          </Button>
        )}
        {!roundSolved && (
          <Button
            variant="outline"
            onClick={() => {
              setPoolOrder(shuffleTiles(round));
              setPlaced([]);
            }}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}
      </div>

      {roundWrong && (
        <p className="text-xs text-red-600 dark:text-red-400 font-semibold text-center animate-pulse">
          Belum tepat — coba tukar urutannya. Kesalahan: {mistakes}
        </p>
      )}

      {roundSolved && (
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 3 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < starsFor(mistakes) ? 'fill-amber-400 text-amber-400' : 'text-emerald-200 dark:text-emerald-800'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
              {formatDuration((Date.now() - roundStartRef.current))}
            </span>
          </div>
          <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">{round.fullHanzi}</p>
          <p className="text-xs text-emerald-700 dark:text-emerald-300">{round.fullPinyin}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">{round.meaning}</p>
        </div>
      )}
    </div>
  );
}

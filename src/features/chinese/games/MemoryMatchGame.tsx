// ====================================================================
// OmniLife Chinese Arena — Memory Match "Cari Pasangan"
//
// Buka 2 kartu untuk mencocokkan hanzi ↔ arti (atau hanzi ↔ pinyin).
// 100% offline; TTS otomatis saat pasangan ketemu.
// ====================================================================
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Play, RotateCcw, Trophy, Volume2, VolumeX, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { speakChineseOnline } from '@/services/chinese/passiveLearningService';
import {
  BestRecord,
  GameWord,
  formatDuration,
  getGamePool,
  loadBest,
  saveBest,
  shuffle,
} from '@/services/chinese/games/gameService';

type MemoryLevel = 'santai' | 'sedang' | 'sulit';
type MatchMode = 'hanzi-arti' | 'hanzi-pinyin';

const LEVELS: { id: MemoryLevel; label: string; pairs: number }[] = [
  { id: 'santai', label: 'Santai', pairs: 6 },
  { id: 'sedang', label: 'Sedang', pairs: 8 },
  { id: 'sulit', label: 'Sulit', pairs: 12 },
];

const MODES: { id: MatchMode; label: string }[] = [
  { id: 'hanzi-arti', label: 'Hanzi ↔ Arti' },
  { id: 'hanzi-pinyin', label: 'Hanzi ↔ Pinyin' },
];

interface MemoryCard {
  key: string;
  pairId: string;
  /** Teks yang tampil saat kartu terbuka. */
  label: string;
  face: 'hanzi' | 'meaning' | 'pinyin';
  word: GameWord;
}

function buildDeck(pairs: number, mode: MatchMode, poolWordIds?: string[]): { cards: MemoryCard[]; pool: GameWord[] } {
  let pool = shuffle(getGamePool([1, 2, 3]));
  // Scoped pool (mis. dari Program Harian): hanya kata yang sedang due.
  if (poolWordIds && poolWordIds.length > 0) {
    const ids = new Set(poolWordIds);
    const scoped = pool.filter((w) => ids.has(w.id));
    if (scoped.length > 0) pool = scoped;
  }
  const selected = pool.slice(0, Math.min(pairs, pool.length));
  const cards: MemoryCard[] = [];
  for (const word of selected) {
    cards.push({
      key: `${word.id}-h`,
      pairId: word.id,
      label: word.hanzi,
      face: 'hanzi',
      word,
    });
    cards.push({
      key: `${word.id}-${mode === 'hanzi-arti' ? 'a' : 'p'}`,
      pairId: word.id,
      label: mode === 'hanzi-arti' ? word.meaning : word.pinyin,
      face: mode === 'hanzi-arti' ? 'meaning' : 'pinyin',
      word,
    });
  }
  return { cards: shuffle(cards), pool };
}

interface Props {
  onExit: () => void;
  /** Opsional: batasi pool ke daftar id kata (mis. kata due Program Harian). */
  poolWordIds?: string[];
}

export function MemoryMatchGame({ onExit, poolWordIds }: Props) {
  const [screen, setScreen] = useState<'setup' | 'play'>('setup');
  const [level, setLevel] = useState<MemoryLevel>('santai');
  const [mode, setMode] = useState<MatchMode>('hanzi-arti');
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [combo, setCombo] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [won, setWon] = useState(false);
  const [newRecord, setNewRecord] = useState<BestRecord | null>(null);
  const [audioFailed, setAudioFailed] = useState(false);

  const startedAtRef = useRef<number | null>(null);
  const lockRef = useRef(false);

  const levelCfg = LEVELS.find((l) => l.id === level) || LEVELS[0];
  const bestKey = `${mode}-${level}`;

  // Timer berjalan sejak kartu pertama dibuka.
  useEffect(() => {
    if (screen !== 'play' || won) return;
    const iv = window.setInterval(() => {
      if (startedAtRef.current !== null) {
        setElapsedMs(Date.now() - startedAtRef.current);
      }
    }, 500);
    return () => window.clearInterval(iv);
  }, [screen, won]);

  const startGame = useCallback(() => {
    const { cards: deck } = buildDeck(levelCfg.pairs, mode, poolWordIds);
    setCards(deck);
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setCombo(0);
    setElapsedMs(0);
    setWon(false);
    setNewRecord(null);
    setAudioFailed(false);
    startedAtRef.current = null;
    lockRef.current = false;
    setScreen('play');
  }, [levelCfg.pairs, mode, poolWordIds]);

  const finishGame = useCallback(
    (finalMoves: number) => {
      const timeMs = startedAtRef.current !== null ? Date.now() - startedAtRef.current : 0;
      setWon(true);
      const isNew = saveBest('memory', bestKey, finalMoves, true, timeMs);
      if (isNew) setNewRecord(loadBest('memory', bestKey));
    },
    [bestKey]
  );

  const handleFlip = (card: MemoryCard) => {
    if (lockRef.current || won) return;
    if (matched.has(card.pairId) || flipped.includes(card.key)) return;

    if (startedAtRef.current === null) startedAtRef.current = Date.now();

    const next = [...flipped, card.key];
    setFlipped(next);
    if (next.length < 2) return;

    const [a, b] = next.map((key) => cards.find((c) => c.key === key)!);
    const nextMoves = moves + 1;
    setMoves(nextMoves);
    lockRef.current = true;

    if (a.pairId === b.pairId) {
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setMatched((prev) => {
        const s = new Set(prev);
        s.add(a.pairId);
        return s;
      });
      setFlipped([]);
      lockRef.current = false;
      // Ucapkan hanzi saat pasangan ketemu (fire-and-forget dengan laporan).
      speakChineseOnline(a.word.hanzi)
        .then((ok) => {
          if (!ok) setAudioFailed(true);
        })
        .catch(() => setAudioFailed(true));
      if (matched.size + 1 >= cards.length / 2) {
        window.setTimeout(() => finishGame(nextMoves), 350);
      }
    } else {
      setCombo(0);
      window.setTimeout(() => {
        setFlipped([]);
        lockRef.current = false;
      }, 750);
    }
  };

  const best = loadBest('memory', bestKey);

  if (screen === 'setup') {
    return (
      <div className="space-y-5">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-blue-600 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Arena
        </button>

        <div className="text-center space-y-2 py-2">
          <div className="text-5xl">🃏</div>
          <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Memory Match
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
            Buka dua kartu untuk mencocokkan pasangan. Kartu akan mengucapkan hanzi-nya saat
            pasangan ketemu.
          </p>
        </div>

        <div className="space-y-3 max-w-md mx-auto">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Tingkat
            </p>
            <div className="grid grid-cols-3 gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLevel(l.id)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    level === l.id
                      ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-blue-400'
                  }`}
                >
                  <div>{l.label}</div>
                  <div className={`text-[10px] font-medium ${level === l.id ? 'text-blue-100' : 'text-zinc-400'}`}>
                    {l.pairs} pasang
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Mode
            </p>
            <div className="grid grid-cols-2 gap-2">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    mode === m.id
                      ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-blue-400'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {best && (
            <div className="flex items-center justify-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-semibold">
              <Trophy className="w-3.5 h-3.5" />
              Rekor: {best.value} langkah
              {best.secondary !== undefined && <> • {formatDuration(best.secondary)}</>}
            </div>
          )}

          <Button onClick={startGame} className="w-full justify-center">
            <Play className="w-4 h-4 mr-1.5 fill-white" /> Mulai
          </Button>
        </div>
      </div>
    );
  }

  // ── PLAY SCREEN ────────────────────────────────────────────────────────
  const matchedCount = matched.size;
  const totalPairs = cards.length / 2;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setScreen('setup')}
          className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-blue-600 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Setup
        </button>

        <div className="flex items-center gap-2 sm:gap-3 text-xs font-bold">
          <span className="text-zinc-600 dark:text-zinc-300">
            {matchedCount}/{totalPairs} pasang
          </span>
          <span className="text-zinc-400">{moves} langkah</span>
          <span className="text-zinc-400 tabular-nums">{formatDuration(elapsedMs)}</span>
          {combo >= 2 && (
            <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 animate-pulse">
              <Zap className="w-3.5 h-3.5 fill-amber-500" /> x{combo}
            </span>
          )}
          <button
            onClick={startGame}
            title="Acak ulang"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {audioFailed && (
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
          <VolumeX className="w-3.5 h-3.5" /> Audio online tidak tersedia — permainan tetap jalan.
        </div>
      )}

      {/* Papan kartu */}
      <div
        className={`grid gap-2 sm:gap-2.5 ${
          levelCfg.pairs === 12 ? 'grid-cols-4 sm:grid-cols-6' : 'grid-cols-4'
        }`}
      >
        {cards.map((card) => {
          const isOpen = flipped.includes(card.key) || matched.has(card.pairId);
          const isMatched = matched.has(card.pairId);
          return (
            <button
              key={card.key}
              onClick={() => handleFlip(card)}
              disabled={isMatched}
              className={`relative rounded-xl border transition-all duration-200 select-none cursor-pointer ${
                card.face === 'hanzi' ? 'aspect-[3/3.4]' : 'aspect-[3/3.4]'
              } ${
                isMatched
                  ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 opacity-70'
                  : isOpen
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 shadow-sm'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-blue-400 active:scale-95'
              }`}
            >
              {isOpen ? (
                <span
                  className={`absolute inset-0 flex items-center justify-center p-1 text-center ${
                    card.face === 'hanzi'
                      ? 'text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100'
                      : 'text-[11px] sm:text-xs font-semibold text-blue-700 dark:text-blue-300 leading-tight'
                  } ${isMatched ? 'text-emerald-700 dark:text-emerald-300' : ''}`}
                >
                  {card.label}
                </span>
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-zinc-300 dark:text-zinc-700 text-xl font-black">
                  汉
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Kemenangan */}
      {won && (
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 p-5 text-center space-y-3">
          <div className="text-4xl">🎉</div>
          <h4 className="text-base font-bold text-emerald-800 dark:text-emerald-200">
            Semua pasangan ketemu!
          </h4>
          <p className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
            {moves} langkah • {formatDuration(elapsedMs)} • combo terakhir x{combo}
          </p>
          {newRecord && (
            <p className="text-xs text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" /> Rekor baru!
            </p>
          )}
          <div className="flex items-center justify-center gap-2 pt-1">
            <Button onClick={startGame} size="sm">
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Main lagi
            </Button>
            <Button onClick={() => setScreen('setup')} size="sm" variant="outline">
              <Volume2 className="w-3.5 h-3.5 mr-1" /> Ganti mode
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ====================================================================
// OmniLife Chinese Arena — hub mini-game untuk momen gabut.
//
// Empat permainan yang benar-benar terasa "main", bukan kuis biasa:
// Memory Match, Time Attack, Susun Kalimat, dan Ungkapan Sehari-hari
// (dengan SmartTranslate AI). Semua memakai dataset HSK yang sudah ada.
// ====================================================================
import { useState } from 'react';
import { Gamepad2, Layers, Timer, Puzzle, MessageSquare } from 'lucide-react';
import { loadBest, getWeakStats } from '@/services/chinese/games/gameService';
import { getExpressionProgress } from '@/services/chinese/expressions/expressionService';
import { MemoryMatchGame } from './MemoryMatchGame';
import { TimeAttackGame } from './TimeAttackGame';
import { SentenceBuilderGame } from './SentenceBuilderGame';
import { ExpressionTrainerView } from './ExpressionTrainerView';

type ActiveGame = 'memory' | 'timeattack' | 'sentence' | 'expressions' | null;

interface GamesHubProps {
  /** Deep-link dari Program Harian: langsung buka game ini. */
  initialGame?: Exclude<ActiveGame, null>;
  /** Pool kata ter-scope (kata due Program Harian). */
  poolWordIds?: string[];
}

interface GameMeta {
  id: Exclude<ActiveGame, null>;
  icon: React.ReactNode;
  iconBg: string;
  name: string;
  desc: string;
  tag: string;
  tagTone: string;
  stat: () => string;
}

export function GamesHubView({ initialGame, poolWordIds }: GamesHubProps) {
  const [active, setActive] = useState<ActiveGame>(initialGame ?? null);

  if (active === 'memory') return <MemoryMatchGame onExit={() => setActive(null)} poolWordIds={poolWordIds} />;
  if (active === 'timeattack') return <TimeAttackGame onExit={() => setActive(null)} poolWordIds={poolWordIds} />;
  if (active === 'sentence') return <SentenceBuilderGame onExit={() => setActive(null)} />;
  if (active === 'expressions') return <ExpressionTrainerView onExit={() => setActive(null)} />;

  const weakStats = getWeakStats();
  const exprProgress = getExpressionProgress();

  const games: GameMeta[] = [
    {
      id: 'memory',
      icon: <Layers className="w-6 h-6 text-[#C0392B]" />,
      iconBg: 'bg-rose-50 border-rose-200/80',
      name: 'Memory Match',
      desc: 'Cari pasangan hanzi ↔ arti. Bisa juga hanzi ↔ pinyin.',
      tag: 'Offline',
      tagTone: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300',
      stat: () => {
        const b = loadBest('memory', 'hanzi-arti-santai');
        return b ? `Rekor: ${b.value} langkah` : '6 / 8 / 12 pasang';
      },
    },
    {
      id: 'timeattack',
      icon: <Timer className="w-6 h-6 text-amber-600" />,
      iconBg: 'bg-amber-50 border-amber-200/80',
      name: 'Time Attack',
      desc: '60 detik! Pilih arti yang benar, combo memberi poin bonus.',
      tag: 'Offline',
      tagTone: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300',
      stat: () => {
        const b = loadBest('timeattack', 'hsk123');
        const weak =
          weakStats.weakCount > 0 ? ` • ${weakStats.weakCount} kata perlu diperkuat` : '';
        return b ? `Rekor: ${b.value} poin${weak}` : `Kata lemah diprioritaskan${weak}`;
      },
    },
    {
      id: 'sentence',
      icon: <Puzzle className="w-6 h-6 text-emerald-600" />,
      iconBg: 'bg-emerald-50 border-emerald-200/80',
      name: 'Susun Kalimat',
      desc: 'Tile kata dari kalimat contoh HSK — susun urutannya.',
      tag: 'Offline',
      tagTone: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300',
      stat: () => {
        const b = loadBest('sentence', 'hsk123');
        return b ? `Rekor: ${b.value} bintang` : 'Rating bintang per kalimat';
      },
    },
    {
      id: 'expressions',
      icon: <MessageSquare className="w-6 h-6 text-indigo-600" />,
      iconBg: 'bg-indigo-50 border-indigo-200/80',
      name: 'Ucap! — Ungkapan Sehari-hari',
      desc: 'Bahasa gaul Dan frasa nyata + SmartTranslate AI untuk frasa bebas.',
      tag: 'AI + Online',
      tagTone: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300',
      stat: () =>
        `${exprProgress.total} ungkapan • ${exprProgress.known} hafal`,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Header */}
      <div className="text-center space-y-2 py-2">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 border border-rose-200 text-[#C0392B] flex items-center justify-center shadow-xs">
          <Gamepad2 className="w-7 h-7" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Arena Mandarin
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          Gabut sambil belajar: main game singkat yang tetap mengobrolkan kosakata HSK ke
          otakmu. Rekor tersimpan otomatis di perangkat ini.
        </p>
      </div>

      {/* Grid game */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {games.map((g) => (
          <button
            key={g.id}
            onClick={() => setActive(g.id)}
            className="text-left p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400 hover:shadow-xs active:scale-[0.99] transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className={`w-12 h-12 rounded-xl border ${g.iconBg} flex items-center justify-center shadow-xs`}>
                {g.icon}
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${g.tagTone}`}>
                {g.tag}
              </span>
            </div>
            <h4 className="mt-3.5 font-serif text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#C0392B] transition-colors">
              {g.name}
            </h4>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {g.desc}
            </p>
            <p className="mt-3 text-xs font-bold text-zinc-700 dark:text-zinc-300">
              {g.stat()}
            </p>
          </button>
        ))}
      </div>

      {/* Info kecil */}
      <p className="text-[11px] text-zinc-400 text-center flex items-center justify-center gap-1.5 pt-2">
        <Gamepad2 className="w-3.5 h-3.5 text-zinc-400" />
        Kata yang sering salah di Time Attack otomatis muncul lebih sering — semacam SRS terselubung.
      </p>
    </div>
  );
}

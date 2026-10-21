// ====================================================================
// OmniLife Chinese — Program Harian: Tampilan Kurikulum Terpandu
//
// Empat layar: (1) Onboarding pilih target kata baru/hari, (2) Dasbor
// program (streak, utang ulasan, prediksi 7 hari), (3) Sesi satu item
// per layar: kartu pengenalan → kuis → game → produksi, (4) Selesai.
// ====================================================================
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Ear,
  Flame,
  Gamepad2,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Target,
  Volume2,
  XCircle,
  Feather,
  Compass,
  BookOpen,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StrokeOrderViewer } from '@/features/chinese/StrokeOrderViewer';
import { speakChineseOnline } from '@/services/chinese/passiveLearningService';
import {
  GameWord,
  getUniqueMeaningPool,
  sampleN,
  shuffle,
} from '@/services/chinese/games/gameService';
import type { ChineseWord } from '@/services/chinese/chineseDataset';
import {
  DailyPlan,
  ProgramSummary,
  SessionItem,
  answer,
  completeSession,
  getDailyPlan,
  getProgramSummary,
  introduceWord,
  startProgram,
  updateDailyTarget,
} from '@/services/chinese/program/programService';

type Screen = 'loading' | 'onboarding' | 'ready' | 'session' | 'done';

interface Props {
  /** Deep-link ke tab Arena (dengan pool kata yang sedang due). */
  onOpenArena: (gameId: 'memory' | 'timeattack', poolWordIds: string[]) => void;
}

// ── Pilihan target onboarding ───────────────────────────────────────────

const TARGET_OPTIONS = [
  { value: 5, label: 'Santai', desc: '5 kata/hari', icon: <Feather className="w-5 h-5 text-emerald-600" />, minutes: '±5 mnt' },
  { value: 10, label: 'Normal', desc: '10 kata/hari', icon: <Compass className="w-5 h-5 text-blue-600" />, minutes: '±10 mnt' },
  { value: 15, label: 'Serius', desc: '15 kata/hari', icon: <BookOpen className="w-5 h-5 text-purple-600" />, minutes: '±15 mnt' },
  { value: 20, label: 'Intens', desc: '20 kata/hari', icon: <Flame className="w-5 h-5 text-rose-600" />, minutes: '±20 mnt' },
];

const STAGE_LABELS: Record<string, string> = {
  new: 'Kenalan',
  recognition: 'Kenali',
  recall: 'Ingat',
  mastery: 'Kuasai',
  production: 'Produksi',
};

// ── Komponen utama ──────────────────────────────────────────────────────

export function ProgramHarianView({ onOpenArena }: Props) {
  const [screen, setScreen] = useState<Screen>('loading');
  const [summary, setSummary] = useState<ProgramSummary | null>(null);
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [chosenTarget, setChosenTarget] = useState(10);
  const [doneStats, setDoneStats] = useState({ correct: 0, total: 0, seconds: 0, newCount: 0 });
  const [targetSaving, setTargetSaving] = useState(false);
  const sessionStartRef = useRef(Date.now());

  const refresh = useCallback(async () => {
    const s = await getProgramSummary();
    setSummary(s);
    setScreen(s.started ? 'ready' : 'onboarding');
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /** Ubah target kata baru/hari tanpa mengganggu progres & streak yang ada. */
  const handleTargetChange = useCallback(
    async (newTarget: number) => {
      setTargetSaving(true);
      try {
        await updateDailyTarget(newTarget);
        setSummary((prev) => (prev ? { ...prev, target: newTarget } : prev));
      } finally {
        setTargetSaving(false);
      }
    },
    []
  );

  const startSession = async () => {
    sessionStartRef.current = Date.now();
    const p = await getDailyPlan();
    setPlan(p);
    setScreen('session');
  };

  const finishSession = async (correct: number, total: number, newCount: number) => {
    const seconds = plan ? Math.round((Date.now() - sessionStartRef.current) / 1000) : 0;
    if (plan) {
      await completeSession({
        introduced: newCount,
        reviewed: Math.max(0, total - newCount),
        correct,
        total,
        durationSeconds: seconds,
      });
    }
    setDoneStats({ correct, total, seconds, newCount });
    const s = await getProgramSummary();
    setSummary(s);
    setScreen('done');
  };

  if (screen === 'loading') {
    return (
      <div className="p-10 text-center text-xs text-zinc-400">Memuat Program Harian…</div>
    );
  }

  if (screen === 'onboarding' && summary) {
    return (
      <OnboardingView
        target={chosenTarget}
        onTarget={setChosenTarget}
        totalWords={summary.totalCurriculum}
        onStart={async () => {
          await startProgram(chosenTarget);
          await refresh();
        }}
      />
    );
  }

  if (screen === 'session' && plan) {
    return (
      <SessionView
        plan={plan}
        onOpenArena={onOpenArena}
        onFinish={finishSession}
        onCancel={() => {
          setPlan(null);
          setScreen('ready');
        }}
      />
    );
  }

  if (screen === 'done') {
    return (
      <DoneView
        stats={doneStats}
        summary={summary}
        onBack={() => {
          setPlan(null);
          setScreen('ready');
        }}
      />
    );
  }

  // ── READY: dasbor program ──
  if (!summary) return null;

  return (
    <div className="space-y-4">
      {/* Header status */}
      <div className="text-center space-y-1.5 py-2">
        <div className="text-4xl">🎯</div>
        <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Program Harian
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          Kurikulum terpandu {summary.target} kata baru/hari dengan pengulangan bertangga:
          kenalan → kenali → ingat → kuasai → produksi.
        </p>
      </div>

      {/* Kartu streak & progres */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <StatTile icon={<Flame className="w-4 h-4" />} tone="amber" label="Streak" value={`${summary.streakDays} hari`} />
        <StatTile icon={<Target className="w-4 h-4" />} tone="blue" label="Dipelajari" value={`${summary.newDoneTotal} kata`} />
        <StatTile icon={<BookOpenCheck className="w-4 h-4" />} tone="emerald" label="Dikuasai" value={`${summary.masteredCount} kata`} />
        <StatTile icon={<RotateCcw className="w-4 h-4" />} tone="purple" label="Due hari ini" value={`${summary.dueCount} kata`} />
      </div>

      {/* Pengaturan target harian — bisa diubah kapan saja */}
      <TargetSettings target={summary.target} onChangeTarget={handleTargetChange} saving={targetSaving} />

      {/* Peringatan utang ulasan (hari bolong) */}
      {summary.debtCount > 0 && (
        <div className="p-3.5 rounded-2xl border border-amber-300/60 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 text-xs space-y-1">
          <p className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" /> Utang ulasan: {summary.debtCount} kata
          </p>
          <p className="text-amber-700/80 dark:text-amber-300/80 leading-relaxed">
            Ada kata yang melewati jadwalnya. Semua tetap muncul sampai dibayar — pertimbangkan
            menurunkan target kata baru sementara agar sesi tidak kepanjangan.
          </p>
        </div>
      )}

      {/* CTA mulai sesi */}
      <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-xs">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Sesi hari ini</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Kata baru + ulasan yang jatuh tempo, ±5–15 menit.
              </p>
            </div>
            <span className="text-2xl">📚</span>
          </div>
          <Button onClick={startSession} className="w-full justify-center">
            <Sparkles className="w-4 h-4 mr-1.5" /> Mulai Sesi Hari Ini
          </Button>
        </CardContent>
      </Card>

      {/* Prediksi beban 7 hari */}
      <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-xs">
        <CardContent className="p-4 space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            Prediksi beban ulasan 7 hari
          </p>
          <div className="flex items-end gap-1.5 h-20">
            {summary.forecast.map((f, i) => {
              const max = Math.max(1, ...summary.forecast.map((x) => x.count));
              return (
                <div key={f.date} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t-md ${i === 0 ? 'bg-blue-500' : 'bg-blue-300 dark:bg-blue-800'}`}
                    style={{ height: `${Math.max(4, (f.count / max) * 56)}px` }}
                    title={`${f.count} ulasan`}
                  />
                  <span className="text-[9px] text-zinc-400">{i === 0 ? 'Hari ini' : `+${i}`}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Sub-komponen: tile statistik ────────────────────────────────────────

function StatTile({ icon, tone, label, value }: { icon: React.ReactNode; tone: string; label: string; value: string }) {
  const tones: Record<string, string> = {
    amber: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
    blue: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
    purple: 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
  };
  return (
    <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-xs">
      <CardContent className="p-3 flex items-center gap-2.5">
        <div className={`p-2 rounded-xl shrink-0 ${tones[tone] || tones.blue}`}>{icon}</div>
        <div className="min-w-0">
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{label}</p>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Pengaturan target harian ────────────────────────────────────────────

function TargetSettings({
  target,
  onChangeTarget,
  saving,
}: {
  target: number;
  onChangeTarget: (n: number) => Promise<void>;
  saving: boolean;
}) {
  return (
    <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-xs">
      <CardContent className="p-4 space-y-3">
        <div>
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Target kata baru per hari</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Bisa diubah kapan saja — progres, streak, dan jadwal ulangan yang sudah ada tidak terganggu.
          </p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {TARGET_OPTIONS.map((o) => {
            const active = target === o.value;
            return (
              <button
                key={o.value}
                disabled={saving || active}
                onClick={() => onChangeTarget(o.value).catch(() => undefined)}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer disabled:cursor-default ${
                  active
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 shadow-sm'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-blue-400'
                }`}
              >
                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{o.value}</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400">{o.label}</div>
              </button>
            );
          })}
        </div>
        {saving && <p className="text-[11px] text-blue-600 dark:text-blue-400">Menyimpan…</p>}
      </CardContent>
    </Card>
  );
}

// ── Onboarding: pilih target ────────────────────────────────────────────

function OnboardingView({
  target,
  onTarget,
  totalWords,
  onStart,
}: {
  target: number;
  onTarget: (n: number) => void;
  totalWords: number;
  onStart: () => void;
}) {
  return (
    <div className="space-y-6 max-w-xl mx-auto py-4">
      <div className="text-center space-y-2 py-3">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 border border-rose-200 text-[#C0392B] flex items-center justify-center shadow-xs">
          <Target className="w-7 h-7" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Mulai Program Harian
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          Kurikulum HSK 1–3 terurut pedagogis — mulai dari bertahan hidup. Setiap kata naik
          tangga: D+1, D+3, D+7, D+14, D+30 dengan bentuk latihan yang berubah.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {TARGET_OPTIONS.map((o) => (
          <button
            key={o.value}
            onClick={() => onTarget(o.value)}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              target === o.value
                ? 'border-[#C0392B] bg-rose-50/50 dark:bg-rose-950/20 shadow-xs'
                : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-2 shadow-xs">
              {o.icon}
            </div>
            <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{o.label}</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">{o.desc}</div>
            <div className="mt-1 text-[10px] font-bold text-[#C0392B] dark:text-rose-400">
              ±{o.minutes} per sesi
            </div>
          </button>
        ))}
      </div>

      <p className="text-center text-[11px] text-zinc-400">
        Total kurikulum: {totalWords} kata HSK 1–3. Target bisa diubah kapan saja.
      </p>

      <Button onClick={onStart} className="w-full justify-center">
        <ArrowRight className="w-4 h-4 mr-1.5" /> Mulai Program
      </Button>
    </div>
  );
}

// ── Sesi: satu item per layar ───────────────────────────────────────────

function SessionView({
  plan,
  onOpenArena,
  onFinish,
  onCancel,
}: {
  plan: DailyPlan;
  onOpenArena: Props['onOpenArena'];
  onFinish: (correct: number, total: number, newCount: number) => void;
  onCancel: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);

  const items = plan.items;
  const item = items[index];
  const newIds = useMemo(() => new Set(items.filter((i) => i.kind === 'intro').map((i) => i.progressId)), [items]);

  const advance = useCallback(
    async (wasCorrect: boolean) => {
      const nextCorrect = correct + (wasCorrect ? 1 : 0);
      const nextAnswered = answered + (item.kind === 'intro' ? 0 : 1);
      setCorrect(nextCorrect);
      setAnswered(nextAnswered);
      // Catat jawaban ke mesin SRS — kartu pengenalan tidak dinilai.
      if (item.kind !== 'intro') {
        await answer(item.progressId, wasCorrect);
      }
      if (index + 1 >= items.length) {
        onFinish(nextCorrect, nextAnswered, newIds.size);
      } else {
        setIndex((i) => i + 1);
      }
    },
    [index, items.length, item, correct, answered, newIds.size, onFinish]
  );

  // Selesai: item terakhir adalah kartu pengenalan (tidak dinilai).
  useEffect(() => {
    if (items.length === 0) {
      onFinish(0, 0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (items.length === 0) {
    return (
      <div className="p-10 text-center space-y-3">
        <div className="text-4xl">🎉</div>
        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
          Tidak ada yang perlu dipelajari hari ini
        </p>
        <Button onClick={onCancel} variant="outline" size="sm">
          Kembali
        </Button>
      </div>
    );
  }

  const progressPct = Math.round((index / items.length) * 100);

  return (
    <div className="space-y-4">
      {/* Header sesi */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-blue-600 cursor-pointer"
        >
          ← Akhiri sesi
        </button>
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-300">
          <span>{index + 1}/{items.length}</span>
          {item.kind !== 'intro' && (
            <span className="text-emerald-600 dark:text-emerald-400">
              {correct}/{answered} benar
            </span>
          )}
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        <div className="h-full rounded-full bg-blue-500 transition-all duration-300" style={{ width: `${progressPct}%` }} />
      </div>

      {/* key={index} wajib: tanpa ini React memakai ulang instance komponen saat
          dua soal berurutan berjenis sama, sehingga state `picked`/opsi soal
          sebelumnya ikut terbawa dan sesi bisa mentok. */}
      {item.kind === 'intro' && <IntroCard key={index} item={item} onNext={() => advance(false)} />}
      {item.kind === 'quiz' && <QuizExercise key={index} item={item} onDone={advance} />}
      {item.kind === 'mastery' && (
        <MasteryCard key={index} item={item} dueWordIds={items.map((i) => i.progressId)} onOpenArena={onOpenArena} onDone={advance} />
      )}
      {item.kind === 'production' && <ProductionExercise key={index} item={item} onDone={advance} />}
    </div>
  );
}

/** Pool distraktor kuis — dimuat sekali per modul. */
let QUIZ_POOL: GameWord[] | null = null;
function loadQuizPool(): GameWord[] {
  if (!QUIZ_POOL) QUIZ_POOL = getUniqueMeaningPool([1, 2, 3]);
  return QUIZ_POOL;
}

// ── Kartu pengenalan ────────────────────────────────────────────────────

function IntroCard({ item, onNext }: { item: Extract<SessionItem, { kind: 'intro' }>; onNext: () => void }) {
  const { word } = item;
  const [playing, setPlaying] = useState(false);

  const speak = async () => {
    setPlaying(true);
    await speakChineseOnline(word.hanzi);
    setTimeout(() => setPlaying(false), 600);
  };

  return (
    <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-xs">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
            Kata baru • HSK {word.hskLevel}
          </span>
          <button
            onClick={speak}
            title="Dengarkan"
            className="p-2.5 rounded-xl text-zinc-400 hover:text-blue-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <Volume2 className={`w-5 h-5 ${playing ? 'animate-pulse text-blue-500' : ''}`} />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="min-w-0">
            <div className="text-5xl sm:text-6xl font-bold text-zinc-900 dark:text-zinc-100 tracking-wide">
              {word.hanzi}
            </div>
            <div className="mt-1 text-base font-semibold text-blue-600 dark:text-blue-400">{word.pinyin}</div>
          </div>
          {word.emoji && <div className="text-4xl shrink-0">{word.emoji}</div>}
        </div>

        <div>
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{word.meanings.join(', ')}</p>
          {word.partOfSpeech && (
            <p className="text-[11px] text-zinc-400 mt-0.5">({word.partOfSpeech})</p>
          )}
        </div>

        {/* Animasi urutan goresan karakter pertama */}
        {word.hanzi.length > 0 && (
          <div className="flex justify-center rounded-2xl bg-zinc-50 dark:bg-zinc-950/40 p-3">
            <StrokeOrderViewer character={word.hanzi[0]} pinyin={word.pinyin} meaning={word.meanings[0]} />
          </div>
        )}

        {word.exampleSentences?.[0] && (
          <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {word.exampleSentences[0].hanzi}
              </p>
              <button
                onClick={() => speakChineseOnline(word.exampleSentences![0].hanzi)}
                className="p-1 rounded text-zinc-400 hover:text-blue-600 shrink-0 cursor-pointer"
                title="Dengarkan kalimat"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{word.exampleSentences[0].pinyin}</p>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">{word.exampleSentences[0].meaning}</p>
          </div>
        )}

        <Button
          onClick={async () => {
            await introduceWord(item.progressId);
            onNext();
          }}
          className="w-full justify-center"
        >
          Sudah Kenalan <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </CardContent>
    </Card>
  );
}

// ── Kuis pilihan ganda (meaning / reverse / listen) ─────────────────────

interface QuizQuestion {
  word: ChineseWord;
  options: GameWord[];
}

function buildQuiz(word: ChineseWord): QuizQuestion {
  const pool = loadQuizPool();
  const primary = word.meanings[0] || '';
  const distractors = sampleN(
    pool.filter((w) => w.id !== word.id && w.meaning.toLowerCase() !== primary.toLowerCase()),
    3
  );
  const self: GameWord = {
    id: word.id,
    hanzi: word.hanzi,
    pinyin: word.pinyin,
    meaning: primary,
    emoji: word.emoji,
    hskLevel: word.hskLevel,
  };
  return { word, options: shuffle([self, ...distractors]) };
}

function QuizExercise({
  item,
  onDone,
}: {
  item: Extract<SessionItem, { kind: 'quiz' }>;
  onDone: (correct: boolean) => void;
}) {
  const { word, mode } = item;
  const [question] = useState<QuizQuestion>(() => buildQuiz(word));
  const [picked, setPicked] = useState<string | null>(null);
  const playedRef = useRef(false);

  // Kuis dengar: putar TTS otomatis sekali saat item muncul.
  useEffect(() => {
    if (mode === 'listen' && !playedRef.current) {
      playedRef.current = true;
      speakChineseOnline(word.hanzi).catch(() => undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePick = (optId: string) => {
    if (picked) return;
    setPicked(optId);
    const isCorrect = optId === word.id;
    if (isCorrect) speakChineseOnline(word.hanzi).catch(() => undefined);
    setTimeout(() => onDone(isCorrect), isCorrect ? 650 : 1200);
  };

  const prompt = mode === 'meaning' ? word.hanzi : word.meanings[0];

  return (
    <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-xs">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300">
            {STAGE_LABELS.recognition} •{' '}
            {mode === 'meaning' ? 'Pilih arti' : mode === 'reverse' ? 'Pilih hanzi' : 'Kuis dengar'}
          </span>
          {mode === 'listen' ? (
            <button
              onClick={() => speakChineseOnline(word.hanzi)}
              className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 cursor-pointer"
              title="Putar ulang"
            >
              <Ear className="w-5 h-5" />
            </button>
          ) : (
            <span className="text-xs text-zinc-400">HSK {word.hskLevel}</span>
          )}
        </div>

        <div className="text-center py-2">
          <div className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-100 tracking-wide">
            {prompt}
          </div>
          {mode === 'listen' && <p className="mt-2 text-xs text-zinc-400">🎧 Dengarkan lalu pilih hanzi yang benar</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {question.options.map((opt) => {
            const isAnswer = opt.id === word.id;
            const isPicked = picked === opt.id;
            const reveal = picked !== null;
            let tone = 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-blue-400 active:scale-[0.98]';
            if (reveal && isAnswer) tone = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40';
            else if (reveal && isPicked && !isAnswer) tone = 'border-red-500 bg-red-50 dark:bg-red-950/40';
            else if (reveal) tone = 'opacity-50 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900';
            return (
              <button
                key={opt.id}
                onClick={() => handlePick(opt.id)}
                disabled={reveal}
                className={`p-3.5 rounded-xl border text-left text-sm font-semibold transition-all cursor-pointer disabled:cursor-default ${tone}`}
              >
                {mode === 'meaning' ? opt.meaning : opt.hanzi}
                {reveal && isAnswer && (
                  <span className="block text-[11px] font-medium text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
                    {opt.hanzi} • {opt.pinyin} • {opt.meaning}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Mastery: perkuat lewat Arena ────────────────────────────────────────

function MasteryCard({
  item,
  dueWordIds,
  onOpenArena,
  onDone,
}: {
  item: Extract<SessionItem, { kind: 'mastery' }>;
  dueWordIds: string[];
  onOpenArena: Props['onOpenArena'];
  onDone: (correct: boolean) => void;
}) {
  const { word } = item;
  return (
    <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-xs">
      <CardContent className="p-6 space-y-4 text-center">
        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
          {STAGE_LABELS.mastery} • waktu main!
        </span>
        <div className="text-5xl font-bold text-zinc-900 dark:text-zinc-100">{word.hanzi}</div>
        <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">{word.pinyin}</div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
          Tahap penguatan: mainkan game Arena dengan pool kata yang sedang due — kata masuk
          otomatis ke permainan.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <Button onClick={() => onOpenArena('memory', dueWordIds)} className="justify-center">
            <Gamepad2 className="w-4 h-4 mr-1.5" /> Mainkan di Arena
          </Button>
          <Button onClick={() => onDone(true)} variant="outline" className="justify-center">
            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Sudah Hafal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Produksi: susun kalimat dari kalimat contoh kata ────────────────────

function ProductionExercise({
  item,
  onDone,
}: {
  item: Extract<SessionItem, { kind: 'production' }>;
  onDone: (correct: boolean) => void;
}) {
  const { sentence } = item;
  const [tiles] = useState(() => shuffle(sentence.tokens.map((t, i) => ({ t, i }))));
  const [selected, setSelected] = useState<number[]>([]);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);

  const expected = sentence.tokens;

  const tapTile = (tileIndex: number) => {
    if (gaveUp || selected.includes(tileIndex)) return;
    const nextPos = selected.length;
    const ok = tiles[tileIndex].t === expected[nextPos];
    if (!ok) {
      setWrongFlash(true);
      setTimeout(() => setWrongFlash(false), 500);
      return;
    }
    const next = [...selected, tileIndex];
    setSelected(next);
    if (next.length === expected.length) {
      setTimeout(() => onDone(true), 500);
    }
  };

  return (
    <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-xs">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300">
            {STAGE_LABELS.production} • susun kalimat
          </span>
          <span className="text-xs text-zinc-400">
            {selected.length}/{expected.length}
          </span>
        </div>

        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{sentence.meaning}</p>

        {/* Slot jawaban */}
        <div
          className={`min-h-[3rem] p-2.5 rounded-2xl border-2 border-dashed flex flex-wrap gap-1.5 ${
            wrongFlash ? 'border-red-400 bg-red-50/50 dark:bg-red-950/20' : 'border-zinc-200 dark:border-zinc-700'
          }`}
        >
          {selected.map((tileIndex) => (
            <span
              key={tileIndex}
              className="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-bold"
            >
              {tiles[tileIndex].t}
            </span>
          ))}
        </div>

        {/* Tile kata acak */}
        <div className="flex flex-wrap gap-1.5">
          {tiles.map((tile, i) => (
            <button
              key={i}
              onClick={() => tapTile(i)}
              disabled={selected.includes(i) || gaveUp}
              className={`px-3 py-2 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                selected.includes(i)
                  ? 'opacity-25 border-zinc-200 dark:border-zinc-800'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-blue-400 active:scale-95'
              }`}
            >
              {tile.t}
            </button>
          ))}
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Susun urutan hanzi sesuai arti: “{sentence.fullPinyin}”
        </p>

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => {
              setGaveUp(true);
              setTimeout(() => onDone(false), 900);
            }}
            variant="outline"
            className="justify-center"
            disabled={gaveUp}
          >
            <XCircle className="w-4 h-4 mr-1.5" /> Tidak Ingat
          </Button>
          <Button onClick={() => onDone(true)} className="justify-center" disabled={!gaveUp && selected.length !== expected.length}>
            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Selesai
          </Button>
        </div>

        {gaveUp && (
          <p className="text-center text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            Jawaban: {sentence.tokens.join(' ')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ── Selesai ─────────────────────────────────────────────────────────────

function DoneView({
  stats,
  summary,
  onBack,
}: {
  stats: { correct: number; total: number; seconds: number; newCount: number };
  summary: ProgramSummary | null;
  onBack: () => void;
}) {
  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 100;
  const m = Math.floor(stats.seconds / 60);
  const s = stats.seconds % 60;
  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="text-center space-y-2 py-4">
        <div className="text-5xl">🏆</div>
        <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-100">Sesi Selesai!</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Kata baru hari ini dijadwalkan ulang besok (D+1) — sampai jumpa lagi!
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40">
          <div className="text-lg font-black text-emerald-700 dark:text-emerald-300">{accuracy}%</div>
          <div className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 font-semibold">Akurasi</div>
        </div>
        <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40">
          <div className="text-lg font-black text-blue-700 dark:text-blue-300">
            {m}:{String(s).padStart(2, '0')}
          </div>
          <div className="text-[10px] text-blue-600/70 dark:text-blue-400/70 font-semibold">Durasi</div>
        </div>
        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40">
          <div className="text-lg font-black text-amber-700 dark:text-amber-300">
            {summary?.streakDays ?? 0} 🔥
          </div>
          <div className="text-[10px] text-amber-600/70 dark:text-amber-400/70 font-semibold">Streak</div>
        </div>
      </div>

      {stats.newCount > 0 && (
        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
          +{stats.newCount} kata baru diperkenalkan • {stats.total - stats.newCount} ulasan selesai
        </p>
      )}

      <Button onClick={onBack} className="w-full justify-center">
        Kembali ke Dasbor
      </Button>
    </div>
  );
}

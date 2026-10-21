import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, X, Lock, RotateCcw, Trophy, ChevronRight, TrendingUp } from 'lucide-react';
import {
  groupRadicalsByLearningOrder,
  RadicalLearningGroup,
  RadicalEntry,
} from '@/services/chinese/radicals/radicalTable';
import {
  getRadicalHanziCount,
  getHanziForRadical,
  findRadicalsForHanzi,
} from '@/services/chinese/radicals/radicalMap';
import { RADICAL_BY_ID } from '@/services/chinese/radicals/radicalTable';
import {
  addQuizScore,
  filterScoreHistory,
  loadQuizScoreHistory,
  QuizScoreRecord,
  clearWrong,
  dueKeys,
  loadSrsSchedule,
  rescheduleWrong,
  WrongAnswerRecord,
} from '@/services/chinese/radicals/radicalProgress';

/**
 * RadicalQuizView — Kuis radikal berurutan.
 * ────────────────────────────────────────────
 * Tier Fondasi → Perluas → Lengkapi. Tier berikutnya terbuka setelah skor
 * ≥ PASS_RATIO pada tier saat ini. Tiga tipe soal diacak:
 *   1. arti  → radikal   2. radikal → arti   3. radikal → hanzi pembentuk
 */

const PASS_RATIO = 0.7;
const QUESTIONS_PER_ROUND = 8;

type QuestionKind = 'meaning2radical' | 'radical2meaning' | 'radical2hanzi';

interface QuizOption {
  label: string;
  sub?: string;
}

interface QuizQuestion {
  kind: QuestionKind;
  prompt: string;
  displayChar?: string;
  options: QuizOption[];
  correctIndex: number;
  radicalId: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestion(
  radical: RadicalEntry,
  kind: QuestionKind,
  peers: RadicalEntry[]
): QuizQuestion | null {
  if (kind === 'radical2meaning') {
    const distractors = shuffle(peers.filter((p) => p.id !== radical.id && p.meaning !== radical.meaning))
      .slice(0, 3)
      .map((p) => p.meaning);
    if (distractors.length < 3) return null;
    const options = shuffle([radical.meaning, ...distractors]);
    return {
      kind,
      prompt: 'Apa arti radikal ini?',
      displayChar: radical.radical,
      options: options.map((o) => ({ label: o })),
      correctIndex: options.indexOf(radical.meaning),
      radicalId: radical.id,
    };
  }

  if (kind === 'meaning2radical') {
    const distractors = shuffle(peers.filter((p) => p.id !== radical.id && p.meaning !== radical.meaning))
      .slice(0, 3)
      .map((p) => ({ label: p.radical, sub: p.pinyin }));
    if (distractors.length < 3) return null;
    const options = shuffle([{ label: radical.radical, sub: radical.pinyin }, ...distractors]);
    return {
      kind,
      prompt: `Radikal mana yang berarti "${radical.meaning}"?`,
      options,
      correctIndex: options.findIndex((o) => o.label === radical.radical),
      radicalId: radical.id,
    };
  }

  // radical2hanzi
  const hanziPool = getHanziForRadical(radical.id);
  if (hanziPool.length === 0) return null;
  const target = hanziPool[Math.floor(Math.random() * hanziPool.length)];
  const peerHanzi = shuffle(
    peers
      .filter((p) => p.id !== radical.id)
      .flatMap((p) => getHanziForRadical(p.id))
      .filter((h) => !findRadicalsForHanzi(h.hanzi).some((r) => r.id === radical.id) && h.hanzi !== target.hanzi)
  ).slice(0, 3);
  if (peerHanzi.length < 3) return null;

  const mkOption = (h: { hanzi: string; pinyin: string }): QuizOption => ({
    label: h.hanzi,
    sub: h.pinyin,
  });
  const options = shuffle([mkOption(target), ...peerHanzi.map(mkOption)]);
  return {
    kind,
    prompt: `Hanzi mana yang menggunakan radikal ${radical.radical} (${radical.meaning})?`,
    displayChar: radical.radical,
    options,
    correctIndex: options.findIndex((o) => o.label === target.hanzi),
    radicalId: radical.id,
  };
}

/** Bar mini tren skor: satu batang = satu ronde terakhir. */
function ScoreTrend({
  records,
  accent = 'bg-blue-600',
}: {
  records: QuizScoreRecord[];
  accent?: string;
}) {
  if (records.length === 0) return null;
  const max = Math.max(...records.map((r) => r.pct), 100);
  const best = Math.max(...records.map((r) => r.pct));
  const avg = Math.round(records.reduce((s, r) => s + r.pct, 0) / records.length);
  return (
    <div className="flex items-end gap-1.5 h-10" title={`Tren skor: ${records.length} ronde terakhir`}>
      {records.map((r, i) => (
        <div
          key={r.ts + '-' + i}
          className="w-2 rounded-t-sm transition-all"
          style={{ height: `${Math.max(12, (r.pct / max) * 100)}%` }}
          title={`Skor ${r.score}/${r.total} (${r.pct}%)`}
        >
          <div
            className={`w-full h-full rounded-t-sm ${
              r.pct >= 70 ? accent : 'bg-zinc-300 dark:bg-zinc-600'
            }`}
          />
        </div>
      ))}
      <div className="ml-1.5 mb-0 leading-tight">
        <p className="text-[10px] font-bold text-zinc-600 dark:text-zinc-300">{best}% terbaik</p>
        <p className="text-[10px] text-zinc-400 dark:text-zinc-500">{avg}% rata-rata</p>
      </div>
    </div>
  );
}

function buildRound(tier: number, groups: RadicalLearningGroup[], dueIds: Set<string>): QuizQuestion[] {
  const group = groups.find((g) => g.tier === tier);
  if (!group) return [];
  const candidates = group.radicals.filter((r) => getRadicalHanziCount(r.id) > 0);
  if (candidates.length < 4) return [];

  const kinds: QuestionKind[] = ['meaning2radical', 'radical2hanzi', 'radical2meaning'];
  // SRS: radikal yang jatuh tempo review didahulukan, sisanya diacak
  const dueFirst = shuffle(candidates.filter((r) => dueIds.has(String(r.id))));
  const rest = shuffle(candidates.filter((r) => !dueIds.has(String(r.id))));
  const picks = [...dueFirst, ...rest];
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < QUESTIONS_PER_ROUND; i++) {
    const radical = picks[i % picks.length];
    const q = buildQuestion(radical, kinds[i % kinds.length], candidates);
    if (q) questions.push(q);
  }
  return questions;
}

export function RadicalQuizView({
  unlockedTier,
  onUnlockTier,
  onExit,
}: {
  unlockedTier: number;
  onUnlockTier: (tier: number) => void;
  onExit: () => void;
}) {
  const groups = useMemo(() => groupRadicalsByLearningOrder(getRadicalHanziCount), []);
  const [activeTier, setActiveTier] = useState<number | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [wrongList, setWrongList] = useState<QuizQuestion[]>([]);
  const [history, setHistory] = useState<QuizScoreRecord[]>([]);
  const [srs, setSrs] = useState<WrongAnswerRecord[]>([]);

  useEffect(() => {
    Promise.all([loadQuizScoreHistory(), loadSrsSchedule()]).then(([h, s]) => {
      setHistory(h);
      setSrs(s);
    });
  }, []);

  const dueIds = useMemo(() => dueKeys(srs, 'radical'), [srs]);

  const startRound = (tier: number) => {
    const qs = buildRound(tier, groups, dueIds);
    if (qs.length === 0) return;
    setActiveTier(tier);
    setQuestions(qs);
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setWrongList([]);
  };

  // ── Pemilihan tier ──
  if (activeTier === null) {
    return (
      <div className="space-y-4">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke indeks
        </button>

        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Kuis Radikal</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {QUESTIONS_PER_ROUND} soal per ronde · skor ≥ {Math.round(PASS_RATIO * 100)}% membuka tier berikutnya
          </p>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          {groups.map((g) => {
            const locked = g.tier > unlockedTier;
            const hanziTotal = g.radicals.reduce((s, r) => s + getRadicalHanziCount(r.id), 0);
            const dueCount = g.radicals.filter((r) => dueIds.has(String(r.id))).length;
            return (
              <button
                key={g.tier}
                disabled={locked}
                onClick={() => startRound(g.tier)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all ${
                  locked
                    ? 'opacity-45 cursor-not-allowed'
                    : 'hover:bg-blue-50/60 dark:hover:bg-blue-950/25 cursor-pointer'
                }`}
              >
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 ${
                    g.tier === 1
                      ? 'bg-blue-600 text-white'
                      : g.tier === 2
                        ? 'bg-zinc-400 dark:bg-zinc-600 text-white'
                        : 'border border-zinc-300 dark:border-zinc-600 text-zinc-400 dark:text-zinc-500'
                  }`}
                >
                  {g.tier}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {g.title}
                    {locked && <Lock className="inline w-3.5 h-3.5 ml-2 text-zinc-400" />}
                  </p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                    {locked
                      ? `Selesaikan tier ${g.tier - 1} dengan skor ≥ ${Math.round(PASS_RATIO * 100)}%`
                      : `${g.radicals.length} radikal · ${hanziTotal} hanzi`}
                    {dueCount > 0 && !locked && (
                      <span className="ml-1.5 font-semibold text-amber-600 dark:text-amber-400">
                        · {dueCount} perlu review
                      </span>
                    )}
                  </p>
                </div>
                {!locked && <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Hasil ronde ──
  if (finished) {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const passed = pct >= Math.round(PASS_RATIO * 100);
    const nextTier = activeTier < 3 ? activeTier + 1 : null;
    const canUnlock = passed && nextTier !== null && activeTier === unlockedTier && nextTier > unlockedTier;
    const tierHistory = filterScoreHistory(history, 'tier', String(activeTier));

    return (
      <div className="space-y-6 py-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <span
            className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${
              passed ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
            }`}
          >
            {passed ? <Trophy className="w-7 h-7" /> : <X className="w-7 h-7" />}
          </span>
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {score}/{questions.length}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {passed
              ? canUnlock
                ? `Hebat! Tier ${nextTier} (${groups.find((g) => g.tier === nextTier)?.title}) terbuka.`
                : 'Kamu sudah menguasai tier ini.'
              : `Butuh skor ≥ ${Math.round(PASS_RATIO * 100)}% untuk membuka tier berikutnya. Pelajari lagi, lalu coba!`}
          </p>
        </div>

        {/* Tren skor ronde-ronde tier ini */}
        {tierHistory.length > 0 && (
          <div className="max-w-xl mx-auto rounded-lg border border-zinc-200 dark:border-zinc-800 px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Tren skor tier {activeTier} · {tierHistory.length} ronde terakhir
            </p>
            <ScoreTrend records={tierHistory} />
          </div>
        )}

        <div className="flex items-center justify-center gap-2 flex-wrap">
          <button
            onClick={() => startRound(activeTier)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Ulangi tier {activeTier}
          </button>
          {canUnlock && nextTier !== null && (
            <button
              onClick={() => {
                onUnlockTier(nextTier);
                startRound(nextTier);
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 cursor-pointer transition-all"
            >
              Lanjut ke tier {nextTier}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setActiveTier(null)}
            className="px-4 py-2 text-sm font-semibold rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-all"
          >
            Pilih tier lain
          </button>
        </div>

        {/* Review jawaban yang salah: radikal + contoh hanzi pembentuk */}
        {wrongList.length > 0 && (
          <div className="space-y-2 max-w-xl mx-auto">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Perlu diulang ({wrongList.length})
            </p>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              {wrongList.map((wq, i) => {
                const radical = RADICAL_BY_ID.get(wq.radicalId);
                const examples = radical ? getHanziForRadical(radical.id).slice(0, 6) : [];
                const correctLabel = wq.options[wq.correctIndex]?.label || '';
                return (
                  <div key={`${wq.radicalId}-${i}`} className="flex items-start gap-3 px-3 py-2.5">
                    <span className="text-2xl leading-none text-zinc-900 dark:text-zinc-100 w-9 text-center shrink-0">
                      {radical?.radical || '?'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs">
                        <span className="font-mono font-bold text-red-600 dark:text-red-400 mr-1.5">
                          {radical?.pinyin || ''}
                        </span>
                        <span className="text-zinc-600 dark:text-zinc-300">{radical?.meaning || correctLabel}</span>
                      </p>
                      {examples.length > 0 && (
                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1 leading-relaxed">
                          Contoh hanzi:{' '}
                          {examples.map((h) => (
                            <span key={h.hanzi} className="mr-1.5" title={h.pinyin}>
                              {h.hanzi}
                            </span>
                          ))}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Soal berjalan ──
  const q = questions[current];
  const group = groups.find((g) => g.tier === activeTier);
  if (!q || !group) return null;

  const answer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const key = String(q.radicalId);
    if (idx === q.correctIndex) {
      setScore((s) => s + 1);
      // SRS: benar → hapus dari jadwal review
      clearWrong('radical', key).then(setSrs);
    } else {
      setWrongList((l) => [...l, q]);
      // SRS: salah → jadwalkan muncul lagi di ronde berikutnya
      rescheduleWrong('radical', key).then(setSrs);
    }
  };

  const next = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
      void finishRound();
      const finalScore = score;
      const pct = (finalScore / questions.length) * 100;
      if (pct >= PASS_RATIO * 100 && activeTier === unlockedTier && activeTier < 3) {
        onUnlockTier(activeTier + 1);
      }
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  const finishRound = async () => {
    if (activeTier === null || !q || questions.length === 0) return;
    const updated = await addQuizScore({
      scope: 'tier',
      key: String(activeTier),
      score,
      total: questions.length,
    });
    setHistory(updated);
  };

  return (
    <div className="space-y-5">
      {/* Progres ronde */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTier(null)}
          className="p-1.5 -ml-1.5 rounded-md text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-all"
          title="Pilih tier lain"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          Tier {activeTier} · {group.title} — Soal {current + 1}/{questions.length}
        </span>
        <span className="ml-auto text-xs font-bold text-blue-600 dark:text-blue-400">{score} benar</span>
      </div>
      <div className="h-1 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${(current / questions.length) * 100}%` }}
        />
      </div>

      {/* Pertanyaan */}
      <div className="text-center py-2">
        {q.displayChar && (
          <p className="text-6xl leading-none text-zinc-900 dark:text-zinc-100 mb-4 select-none">{q.displayChar}</p>
        )}
        <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">{q.prompt}</p>
      </div>

      {/* Opsi */}
      <div className={`grid gap-2 ${q.kind === 'radical2meaning' ? 'sm:grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
        {q.options.map((opt, idx) => {
          const isCorrect = idx === q.correctIndex;
          const isPicked = idx === selected;
          const revealed = selected !== null;
          return (
            <button
              key={idx}
              onClick={() => answer(idx)}
              disabled={revealed}
              className={`flex flex-col items-center justify-center py-4 px-2 min-h-[4.5rem] rounded-lg border text-center transition-all ${
                !revealed
                  ? 'border-zinc-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 cursor-pointer'
                  : isCorrect
                    ? 'border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 cursor-default'
                    : isPicked
                      ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/25 cursor-default'
                      : 'border-zinc-100 dark:border-zinc-800 opacity-50 cursor-default'
              }`}
            >
              <span
                className={`${q.kind === 'radical2meaning' ? 'text-sm' : 'text-3xl leading-none'} ${
                  revealed && isCorrect
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : revealed && isPicked
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-zinc-900 dark:text-zinc-100'
                }`}
              >
                {opt.label}
              </span>
              {opt.sub && (
                <span className="font-mono text-[11px] text-zinc-400 mt-1">{opt.sub}</span>
              )}
              {revealed && isCorrect && <Check className="w-3.5 h-3.5 text-emerald-500 mt-1" />}
              {revealed && isPicked && !isCorrect && <X className="w-3.5 h-3.5 text-red-400 mt-1" />}
            </button>
          );
        })}
      </div>

      {/* Feedback + lanjut */}
      {selected !== null && (
        <div className="flex items-center justify-between gap-3">
          <p className={`text-xs font-semibold ${selected === q.correctIndex ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
            {selected === q.correctIndex ? 'Benar!' : `Kurang tepat — jawaban: ${q.options[q.correctIndex].label}${q.options[q.correctIndex].sub ? ` (${q.options[q.correctIndex].sub})` : ''}`}
          </p>
          <button
            onClick={next}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer transition-all"
          >
            {current + 1 >= questions.length ? 'Lihat hasil' : 'Lanjut'}
          </button>
        </div>
      )}
    </div>
  );
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, X, RotateCcw, TrendingUp } from 'lucide-react';
import { RadicalEntry } from '@/services/chinese/radicals/radicalTable';
import { HanziRadicalMatch, getExampleSentence, getHanziForRadical } from '@/services/chinese/radicals/radicalMap';
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
import { ScoreTrend } from './ScoreTrend';
import { SpeakButton } from '../SpeakButton';
import { playCorrectSfx, playWrongSfx, playFinishSfx, speakChinese } from '@/services/chinese/quizSfx';

/**
 * RadicalHanziQuiz — Latihan menghafal hanzi dari SATU radikal.
 * ─────────────────────────────────────────────────────────────
 * Semua soal & opsi diambil dari daftar hanzi radikal itu sendiri
 * (mis. radikal 口 → 喝, 叫, 吃, 号, …). Dua tipe soal bergantian:
 *   1. hanzi  → arti       2. arti → hanzi
 * Setiap jawaban menampilkan contoh kalimat dari dataset untuk penguatan.
 */

const BATCH_SIZE = 6;

interface QuizItem {
  m: HanziRadicalMatch;
  meaning: string;
  options: HanziRadicalMatch[];
  kind: 'hanzi2meaning' | 'meaning2hanzi';
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function meaningOf(m: HanziRadicalMatch): string {
  const standalone = m.words.find((w) => w.hanzi === m.hanzi);
  return standalone ? standalone.meanings.join(', ') : m.words[0]?.meanings.join(', ') || '';
}

interface Round {
  pool: HanziRadicalMatch[];
  items: QuizItem[];
  /** Jumlah hanzi radikal ini yang due review saat ronde dimulai. */
  dueCount: number;
}

export function RadicalHanziQuiz({
  radical,
  onExit,
}: {
  radical: RadicalEntry;
  onExit: () => void;
}) {
  const [round, setRound] = useState<Round | null>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [wrongList, setWrongList] = useState<HanziRadicalMatch[]>([]);
  const [finished, setFinished] = useState(false);
  const [history, setHistory] = useState<QuizScoreRecord[]>([]);
  // Jadwal SRS dibaca via ref: update setelah menjawab TIDAK boleh
  // memicu regenerasi soal di tengah ronde (sumber bug reshuffle).
  const srsRef = useRef<WrongAnswerRecord[]>([]);

  /**
   * Bangun satu ronde: batch hanzi diacak SEKALI lalu dibekukan di state.
   * Sebelumnya soal dibangun via useMemo yang bergantung pada state SRS —
   * saat user menjawab, jadwal SRS ter-update → memo jalan ulang → opsi
   * ter-shuffle dan jawaban "berubah sendiri". Sekarang ronde stabil.
   */
  const buildRound = useCallback(async () => {
    const schedule = await loadSrsSchedule();
    srsRef.current = schedule;
    const due = dueKeys(schedule, 'hanzi');
    const pl = shuffle(getHanziForRadical(radical.id)).slice(0, Math.min(BATCH_SIZE, 12));
    // SRS: hanzi jatuh tempo review didahulukan
    const ordered = [
      ...shuffle(pl.filter((m) => due.has(m.hanzi))),
      ...shuffle(pl.filter((m) => !due.has(m.hanzi))),
    ].slice(0, Math.min(BATCH_SIZE, 12));
    const items = ordered.map((m, i) => {
      const meaning = meaningOf(m);
      // Distraktor harus bermakna berbeda — dua opsi bertulisan sama membuat soal ambigu
      const distractors = shuffle(
        pl.filter((p) => p.hanzi !== m.hanzi && meaningOf(p) !== meaning)
      ).slice(0, 3);
      return {
        m,
        meaning,
        // Kedua tipe soal memakai 4 opsi (1 benar + 3 pengalih); bedanya hanya tampilan
        options: shuffle([m, ...distractors]),
        kind: i % 2 === 0 ? ('hanzi2meaning' as const) : ('meaning2hanzi' as const),
      };
    });
    setRound({ pool: pl, items, dueCount: due.size });
  }, [radical.id]);

  // Riwayat skor untuk tren di layar hasil
  useEffect(() => {
    loadQuizScoreHistory().then(setHistory);
  }, []);

  // Ronde baru saat mount & saat radikal berganti; reset semua state jawaban
  useEffect(() => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setWrongList([]);
    setFinished(false);
    setRound(null);
    void buildRound();
  }, [buildRound]);

  const saveScore = async (total: number) => {
    const updated = await addQuizScore({
      scope: 'radical',
      key: String(radical.id),
      score,
      total,
    });
    setHistory(updated);
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setWrongList([]);
    setFinished(false);
    void buildRound();
  };

  // Ronde selesai → fanfare kecil
  useEffect(() => {
    if (finished) playFinishSfx();
  }, [finished]);

  const items = round?.items ?? [];

  // ── Hasil ──
  if (finished && round) {
    const perfect = score === round.items.length;
    const radicalHistory = filterScoreHistory(history, 'radical', String(radical.id));
    return (
      <div className="space-y-5">
        <div className="flex flex-col items-center gap-2 text-center py-6">
          <span
            className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${
              perfect
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
            }`}
          >
            <Check className="w-7 h-7" />
          </span>
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {score}/{round.items.length}
          </p>
          {round.dueCount > 0 && (
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              {round.dueCount} hanzi jatuh tempo review
            </p>
          )}
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {perfect
              ? `Sempurna! Semua hanzi radikal ${radical.radical} sudah kamu hafal.`
              : 'Hampir! Ulangi untuk menguatkan yang masih terlewat.'}
          </p>
        </div>

        {/* Tren skor ronde-ronde radikal ini */}
        {radicalHistory.length > 0 && (
          <div className="max-w-xl mx-auto rounded-lg border border-zinc-200 dark:border-zinc-800 px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Tren skor radikal {radical.radical} · {radicalHistory.length} ronde terakhir
            </p>
            <ScoreTrend records={radicalHistory} />
          </div>
        )}

        {wrongList.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Perlu diulang ({wrongList.length})
            </p>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              {wrongList.map((w) => {
                const sentence = getExampleSentence(w.hanzi);
                return (
                  <div key={w.hanzi} className="flex items-center gap-3 px-3 py-2.5">
                    <span className="text-2xl leading-none text-zinc-900 dark:text-zinc-100 w-9 text-center">
                      {w.hanzi}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs">
                        <span className="font-mono font-bold text-red-600 dark:text-red-400 mr-1.5">{w.pinyin}</span>
                        <span className="text-zinc-500 dark:text-zinc-400">{meaningOf(w)}</span>
                      </p>
                      {sentence && (
                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 flex items-center gap-1">
                          {sentence.hanzi}
                          <SpeakButton text={sentence.hanzi} className="w-3 h-3" />
                          <span className="font-mono text-blue-600/70 dark:text-blue-400/70"> ({sentence.pinyin})</span>
                          <span className="text-zinc-400 dark:text-zinc-500"> — {sentence.meaning}</span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-2">
          <button
            onClick={restart}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Ulangi kuis
          </button>
          <button
            onClick={onExit}
            className="px-4 py-2 text-sm font-semibold rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-all"
          >
            Kembali ke tabel
          </button>
        </div>
      </div>
    );
  }

  // Ronde sedang dibangun
  if (!round) {
    return (
      <div className="space-y-4 py-6 text-center">
        <p className="text-xs text-zinc-400 dark:text-zinc-500">Menyiapkan soal…</p>
      </div>
    );
  }

  const item = round.items[index];
  if (!item) {
    return (
      <div className="space-y-4 py-6 text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Radikal ini punya kurang dari 2 hanzi — belum bisa dibuat kuis.
        </p>
        <button
          onClick={onExit}
          className="px-4 py-2 text-sm font-semibold rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-all"
        >
          Kembali ke tabel
        </button>
      </div>
    );
  }

  const answer = (m: HanziRadicalMatch) => {
    if (selected !== null) return;
    setSelected(m.hanzi);
    const correct = m.hanzi === item.m.hanzi;
    if (correct) {
      setScore((s) => s + 1);
      // SRS: benar → hapus dari jadwal review (via ref, tanpa re-render soal)
      clearWrong('hanzi', item.m.hanzi).then((s) => {
        srsRef.current = s;
      });
    } else {
      setWrongList((l) => [...l, item.m]);
      // SRS: salah → jadwalkan muncul lagi di ronde berikutnya
      rescheduleWrong('hanzi', item.m.hanzi).then((s) => {
        srsRef.current = s;
      });
    }
    // SFX benar/salah, lalu suara Mandarin hanzi soal (penguat audio)
    if (correct) playCorrectSfx();
    else playWrongSfx();
    window.setTimeout(() => void speakChinese(item.m.hanzi), correct ? 420 : 620);
  };

  const sentence = getExampleSentence(item.m.hanzi);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onExit}
          className="p-1.5 -ml-1.5 rounded-md text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-all"
          title="Kembali ke tabel"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          Kuis {radical.radical} ({radical.meaning}) — Soal {index + 1}/{round.items.length}
        </span>
        <span className="ml-auto text-xs font-bold text-blue-600 dark:text-blue-400">{score} benar</span>
      </div>
      <div className="h-1 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${(index / round.items.length) * 100}%` }}
        />
      </div>

      {/* Pertanyaan */}
      <div className="text-center py-2">
        {item.kind === 'hanzi2meaning' ? (
          <p className="text-6xl leading-none text-zinc-900 dark:text-zinc-100 mb-4 select-none">{item.m.hanzi}</p>
        ) : (
          <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 select-none">{item.meaning}</p>
        )}
        <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
          {item.kind === 'hanzi2meaning' ? 'Apa arti hanzi ini?' : 'Hanzi mana yang berarti ini?'}
        </p>
      </div>

      {/* Opsi */}
      <div className={`grid gap-2 ${item.kind === 'hanzi2meaning' ? 'sm:grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
        {item.options.map((opt) => {
          const isCorrect = opt.hanzi === item.m.hanzi;
          const isPicked = selected === opt.hanzi;
          const revealed = selected !== null;
          return (
            <button
              key={opt.hanzi}
              onClick={() => answer(opt)}
              disabled={revealed}
              className={`flex flex-col items-center justify-center py-3.5 px-2 min-h-[4rem] rounded-lg border text-center transition-all ${
                !revealed
                  ? 'border-zinc-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 cursor-pointer'
                  : isCorrect
                    ? 'border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 cursor-default'
                    : isPicked
                      ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/25 cursor-default'
                      : 'border-zinc-100 dark:border-zinc-800 opacity-50 cursor-default'
              }`}
            >
              {item.kind === 'hanzi2meaning' ? (
                <span className="text-xs text-zinc-900 dark:text-zinc-100 text-left leading-snug">{meaningOf(opt)}</span>
              ) : (
                <>
                  <span
                    className={`text-3xl leading-none ${
                      revealed && isCorrect
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : revealed && isPicked
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-zinc-900 dark:text-zinc-100'
                    }`}
                  >
                    {opt.hanzi}
                  </span>
                  <span className="font-mono text-[11px] text-zinc-400 mt-1">{opt.pinyin}</span>
                </>
              )}
              {revealed && isCorrect && <Check className="w-3.5 h-3.5 text-emerald-500 mt-1" />}
              {revealed && isPicked && !isCorrect && <X className="w-3.5 h-3.5 text-red-400 mt-1" />}
            </button>
          );
        })}
      </div>

      {/* Feedback + penguat kalimat */}
      {selected !== null && (
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <p
              className={`text-xs font-semibold ${
                selected === item.m.hanzi
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-500 dark:text-red-400'
              }`}
            >
              {item.m.hanzi} · {item.m.pinyin} — {item.meaning}
            </p>
            {sentence && (
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 flex items-center gap-1">
                {sentence.hanzi}
                <SpeakButton text={sentence.hanzi} className="w-3 h-3" />
                <span className="font-mono text-blue-600/70 dark:text-blue-400/70"> ({sentence.pinyin})</span>
                <span className="text-zinc-400 dark:text-zinc-500"> — {sentence.meaning}</span>
              </p>
            )}
          </div>
          <button
            onClick={() => {
              if (index + 1 >= round.items.length) {
                setFinished(true);
                void saveScore(round.items.length);
              } else {
                setIndex((i) => i + 1);
                setSelected(null);
              }
            }}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer transition-all"
          >
            {index + 1 >= items.length ? 'Lihat hasil' : 'Lanjut'}
          </button>
        </div>
      )}
    </div>
  );
}

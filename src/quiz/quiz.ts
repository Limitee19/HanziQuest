import type { CourseWord } from '../data/course.types';
import { meaningOf } from '../data/course.types';

export interface QuizStep {
  kind: 'meaning' | 'reverse' | 'tone' | 'listen';
  wordId: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  /** optional pinyin hint besar ditampilkan saat prompt hanzi (for 'meaning') */
  pinyinHint?: string;
  /** audio tersimpan pada step 'listen' — string hanzi untuk TTS */
  listenHanzi?: string;
}

function randInt(n: number): number {
  return Math.floor(Math.random() * n);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 3 distraktor level-sama, arti berbeda */
function others(pool: CourseWord[], exclude: string, n = 3): CourseWord[] {
  return shuffle(pool.filter((x) => x.id !== exclude && meaningOf(x))).slice(0, n);
}

export function buildQuiz(words: CourseWord[], pool: CourseWord[]): QuizStep[] {
  const steps: QuizStep[] = [];

  for (const w of words) {
    const mean = meaningOf(w);
    if (!mean) continue;
    const o = others(pool, w.id);

    steps.push({
      kind: 'meaning',
      wordId: w.id,
      prompt: w.hanzi,
      options: shuffle([mean, ...o.map(meaningOf)]),
      answerIndex: 0,
      pinyinHint: w.pinyin,
    });
    const optsMean = [mean, ...o.map(meaningOf)];
    steps[steps.length - 1].options = shuffle(optsMean);
    steps[steps.length - 1].answerIndex = steps[steps.length - 1].options.indexOf(mean);

    const revOpts = shuffle([w.hanzi, ...o.map((x) => x.hanzi)]);
    steps.push({
      kind: 'reverse',
      wordId: w.id,
      prompt: mean,
      options: revOpts,
      answerIndex: revOpts.indexOf(w.hanzi),
    });

    const firstSyl = w.pinyin.split(/\s+/)[0] ?? '';
    const toneDigit = (w.pinyinNum.split(/\s+/)[0]?.slice(-1) as '1' | '2' | '3' | '4' | '5') ?? '5';
    const toneOpts = shuffle(['1', '2', '3', '4']);
    steps.push({
      kind: 'tone',
      wordId: w.id,
      prompt: `Nada dari "${firstSyl}" · kriteria kata (1–4)`,
      options: toneOpts,
      answerIndex: toneOpts.indexOf(String(toneDigit)),
    });

    // listening: dengarkan → pilih hanzi
    const listenOpts = shuffle([w.hanzi, ...o.map((x) => x.hanzi)]);
    steps.push({
      kind: 'listen',
      wordId: w.id,
      prompt: 'Dengarkan lalu pilih yang benar',
      options: listenOpts,
      answerIndex: listenOpts.indexOf(w.hanzi),
      listenHanzi: w.hanzi,
    });
  }

  return steps;
}

/** acak urut antar group (tiap 1 langkah) biar ritmenya tercampur */
export function mixSteps(steps: QuizStep[]): QuizStep[] {
  const pairs: QuizStep[][] = [];
  for (let i = 0; i < steps.length; i += 3) pairs.push(steps.slice(i, i + 3));
  return pairs.flatMap((g) => shuffle(g));
}

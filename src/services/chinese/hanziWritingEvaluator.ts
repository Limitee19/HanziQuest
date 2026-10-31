import { HanziStrokeData } from './hanziStrokeData';

export interface Point2D {
  x: number;
  y: number;
}

export interface UserStroke {
  points: Point2D[];
}

export type WritingEvaluationStatus = 'Not Enough Data' | 'Needs Practice' | 'Good' | 'Very Good';

/** Hasil pemeriksaan SATU goresan terhadap goresan target. */
export interface StrokeCheckResult {
  index: number;
  pass: boolean;
  /** Galat titik awal (0..1, dinormalisasi). */
  startErr: number;
  /** Galat titik akhir (0..1) — menangkap arah goresan. */
  endErr: number;
  /** Rata-rata jarak bentuk (0..1). */
  coverageErr: number;
}

export interface WritingEvaluationResult {
  status: WritingEvaluationStatus;
  userStrokeCount: number;
  expectedStrokeCount: number;
  feedbackMessage: string;
  advice: string;
  /** Per goresan: apakah urutan, arah, dan bentuknya cocok dengan target. */
  perStrokeResults?: StrokeCheckResult[];
  /** Banyak goresan yang lolos pemeriksaan urutan+bentuk. */
  orderCorrectCount?: number;
}

// ── Sampler path SVG (M/L/Q/C) → titik-titik ternormalisasi 0..1 ───────────

const PATH_SIZE = 1024; // Sistem koordinat dataset hanziStrokeData

/**
 * Ubah median resmi (garis tengah goresan, [[x,y],…]) menjadi path SVG
 * polyline agar bisa disampel dengan sampler yang sama.
 */
export function medianToPath(median: [number, number][]): string {
  if (median.length === 0) return '';
  if (median.length === 1) {
    const [x, y] = median[0];
    return `M ${x},${y} L ${x + 0.5},${y}`;
  }
  return `M ${median.map(([x, y]) => `${x},${y}`).join(' L ')}`;
}

function parsePathNumbers(path: string): { cmd: string; nums: number[] }[] {
  const out: { cmd: string; nums: number[] }[] = [];
  const re = /([MLQCZmlqc])|(-?\d+(?:\.\d+)?)/g;
  let cmd = '';
  let nums: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(path)) !== null) {
    if (m[1]) {
      if (cmd && nums.length > 0) out.push({ cmd, nums });
      cmd = m[1];
      nums = [];
    } else {
      nums.push(parseFloat(m[2]));
    }
  }
  if (cmd && nums.length > 0) out.push({ cmd, nums });
  return out;
}

interface RawSeg { kind: 'L' | 'Q' | 'C'; pts: Point2D[]; approxLen: number }

/**
 * Sampel path SVG menjadi N titik ternormalisasi (0..1) mengikuti panjang
 * kurva Mendekati: tiap segmen L/Q/C dibagi proporsional panjang kasarnya.
 */
export function samplePathPoints(path: string, samples = 32): Point2D[] {
  const segs = parsePathNumbers(path);
  const normalized: Point2D[] = [];
  let cursor: Point2D = { x: 0, y: 0 };

  const raw: RawSeg[] = [];
  for (const s of segs) {
    const c = s.cmd.toUpperCase();
    if (c === 'M') {
      cursor = { x: s.nums[0] / PATH_SIZE, y: s.nums[1] / PATH_SIZE };
      normalized.push({ ...cursor });
    } else if (c === 'L') {
      const p = { x: s.nums[0] / PATH_SIZE, y: s.nums[1] / PATH_SIZE };
      raw.push({ kind: 'L', pts: [cursor, p], approxLen: dist(cursor, p) });
      cursor = p;
    } else if (c === 'Q') {
      const c1 = { x: s.nums[0] / PATH_SIZE, y: s.nums[1] / PATH_SIZE };
      const p = { x: s.nums[2] / PATH_SIZE, y: s.nums[3] / PATH_SIZE };
      raw.push({
        kind: 'Q',
        pts: [cursor, c1, p],
        approxLen: dist(cursor, c1) + dist(c1, p),
      });
      cursor = p;
    } else if (c === 'C') {
      const c1 = { x: s.nums[0] / PATH_SIZE, y: s.nums[1] / PATH_SIZE };
      const c2 = { x: s.nums[2] / PATH_SIZE, y: s.nums[3] / PATH_SIZE };
      const p = { x: s.nums[4] / PATH_SIZE, y: s.nums[5] / PATH_SIZE };
      raw.push({
        kind: 'C',
        pts: [cursor, c1, c2, p],
        approxLen: dist(cursor, c1) + dist(c1, c2) + dist(c2, p),
      });
      cursor = p;
    } else if (c === 'Z') {
      // Tutup path — jarang ada di dataset goresan; abaikan
    }
  }

  const totalLen = raw.reduce((s, r) => s + r.approxLen, 0) || 1;
  let emitted = normalized.length > 0 ? 1 : 0; // titik awal M sudah masuk
  for (const seg of raw) {
    const n = Math.max(2, Math.round((seg.approxLen / totalLen) * samples));
    for (let i = 1; i <= n; i++) {
      const t = i / n;
      normalized.push(lerpSeg(seg, t));
      emitted++;
    }
  }
  if (emitted < 2 && normalized.length >= 1) {
    normalized.push({ x: normalized[0].x + 0.01, y: normalized[0].y });
  }
  return normalized;
}

function lerpSeg(seg: RawSeg, t: number): Point2D {
  const p = seg.pts;
  if (seg.kind === 'L') {
    return { x: p[0].x + (p[1].x - p[0].x) * t, y: p[0].y + (p[1].y - p[0].y) * t };
  }
  if (seg.kind === 'Q') {
    // De Casteljau kuadratik
    const ax = p[0].x + (p[1].x - p[0].x) * t;
    const ay = p[0].y + (p[1].y - p[0].y) * t;
    const bx = p[1].x + (p[2].x - p[1].x) * t;
    const by = p[1].y + (p[2].y - p[1].y) * t;
    return { x: ax + (bx - ax) * t, y: ay + (by - ay) * t };
  }
  // Kubik
  const ax = p[0].x + (p[1].x - p[0].x) * t;
  const ay = p[0].y + (p[1].y - p[0].y) * t;
  const bx = p[1].x + (p[2].x - p[1].x) * t;
  const by = p[1].y + (p[2].y - p[1].y) * t;
  const cx = p[2].x + (p[3].x - p[2].x) * t;
  const cy = p[2].y + (p[3].y - p[2].y) * t;
  const dx = ax + (bx - ax) * t;
  const dy = ay + (by - ay) * t;
  const ex = bx + (cx - bx) * t;
  const ey = by + (cy - by) * t;
  return { x: dx + (ex - dx) * t, y: dy + (ey - dy) * t };
}

function dist(a: Point2D, b: Point2D): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// ── Pemeriksaan satu goresan ────────────────────────────────────────────────

const START_END_TOL = 0.15; // ~15% kotak tulis
const COVER_MEAN_TOL = 0.12;
const FAR_RATIO_TOL = 0.4;

/**
 * Cocokkan satu goresan user (koordinat kanvas) dengan path target
 * (koordinat 1024). Keduanya dinormalisasi 0..1 dulu.
 * Arah diperiksa lewat titik awal Dan akhir: mulai dekat awal target dan
 * berakhir dekat akhir target.
 */
export function evaluateSingleStroke(
  expectedPath: string,
  userPoints: Point2D[],
  canvasSize: number,
  expectedMedian?: [number, number][]
): StrokeCheckResult {
  const res: StrokeCheckResult = { index: 0, pass: false, startErr: 1, endErr: 1, coverageErr: 1 };
  if (!userPoints || userPoints.length < 2) return res;

  const user = userPoints.map((p) => ({ x: p.x / canvasSize, y: p.y / canvasSize }));
  // Median resmi (garis tengah = jalur pena) lebih representatif untuk
  // pemeriksaan arah/urutan; outline dipakai sebagai fallback.
  const target =
    expectedMedian && expectedMedian.length >= 2
      ? samplePathPoints(medianToPath(expectedMedian), 40)
      : samplePathPoints(expectedPath, 40);

  const userStart = user[0];
  const userEnd = user[user.length - 1];
  const tStart = target[0];
  const tEnd = target[target.length - 1];

  res.startErr = dist(userStart, tStart);
  res.endErr = dist(userEnd, tEnd);

  // Cakupan bentuk: rata-rata jarak tiap titik target ke titik user terdekat
  let sum = 0;
  let far = 0;
  for (const tp of target) {
    let best = Infinity;
    for (const up of user) {
      const d = dist(tp, up);
      if (d < best) best = d;
    }
    sum += best;
    if (best > COVER_MEAN_TOL) far++;
  }
  res.coverageErr = sum / target.length;
  const farRatio = far / target.length;

  res.pass =
    res.startErr <= START_END_TOL &&
    res.endErr <= START_END_TOL &&
    res.coverageErr <= COVER_MEAN_TOL &&
    farRatio <= FAR_RATIO_TOL;

  return res;
}

// ── Evaluasi seluruh tulisan ────────────────────────────────────────────────

/**
 * Evaluator deterministik untuk goresan hanzi buatan user.
 * Memeriksa: jumlah goresan, lalu (bila jumlahnya cocok) urutan, arah,
 * dan bentuk tiap goresan secara berpasangan (goresan ke-i user vs target ke-i).
 */
export function evaluateHanziWriting(
  targetData: HanziStrokeData | null,
  userStrokes: UserStroke[],
  canvasSize = 512
): WritingEvaluationResult {
  if (!userStrokes || userStrokes.length === 0) {
    return {
      status: 'Not Enough Data',
      userStrokeCount: 0,
      expectedStrokeCount: targetData?.strokeCount || 0,
      feedbackMessage: 'Belum ada goresan yang digambar.',
      advice: 'Gunakan mouse atau layar sentuh untuk mulai menulis di kanvas.',
    };
  }

  const expectedCount = targetData?.strokeCount || 0;
  const expectedStrokes = targetData?.strokes || [];
  const userCount = userStrokes.length;

  const validUserStrokes = userStrokes.filter((s) => s.points && s.points.length >= 2);
  if (validUserStrokes.length === 0) {
    return {
      status: 'Not Enough Data',
      userStrokeCount: 0,
      expectedStrokeCount: expectedCount,
      feedbackMessage: 'Goresan terlalu pendek atau tidak terdeteksi.',
      advice: 'Cobalah menggambar garis goresan yang jelas dan penuh.',
    };
  }

  const countDiff = Math.abs(userCount - expectedCount);

  // Jumlah goresan pas → periksa urutan, arah, dan bentuk per pasangan
  if (countDiff === 0 && expectedStrokes.length === userCount) {
    const perStrokeResults = expectedStrokes.map((st, i) => {
      const r = evaluateSingleStroke(st.path, validUserStrokes[i].points, canvasSize, st.median);
      r.index = i;
      return r;
    });
    const correct = perStrokeResults.filter((r) => r.pass).length;

    if (correct === userCount) {
      return {
        status: 'Very Good',
        userStrokeCount: userCount,
        expectedStrokeCount: expectedCount,
        feedbackMessage: `Sempurna! ${userCount}/${expectedCount} goresan — urutan, arah, dan bentuk semua benar.`,
        advice: 'Penulisanmu sangat baik. Uji ingatanmu di Latihan Bebas secara berkala.',
        perStrokeResults,
        orderCorrectCount: correct,
      };
    }
    if (correct >= Math.ceil(userCount * 0.6)) {
      const firstFail = perStrokeResults.find((r) => !r.pass);
      return {
        status: 'Good',
        userStrokeCount: userCount,
        expectedStrokeCount: expectedCount,
        feedbackMessage: `Urutan Dan bentuk benar ${correct}/${userCount} goresan.`,
        advice: firstFail
          ? `Perbaiki goresan ke-${firstFail.index + 1}${
              firstFail.startErr > START_END_TOL
                ? ' — titik mulainya masih jauh dari posisi resmi.'
                : firstFail.endErr > START_END_TOL
                  ? ' — arah tarikannya belum sesuai (perhatikan titik akhir).'
                  : ' — bentuknya perlu menyentuh jalur target.'
            }`
          : 'Sedikit lagi menuju sempurna.',
        perStrokeResults,
        orderCorrectCount: correct,
      };
    }
    return {
      status: 'Needs Practice',
      userStrokeCount: userCount,
      expectedStrokeCount: expectedCount,
      feedbackMessage: `Jumlah goresan tepat (${userCount}), tetapi urutan/bentuk baru ${correct} yang cocok.`,
      advice: 'Gunakan Tutorial Terpandu: gambar goresan demi goresan mengikuti urutan resmi.',
      perStrokeResults,
      orderCorrectCount: correct,
    };
  }

  // Jumlah goresan tidak pas
  if (countDiff <= 2) {
    return {
      status: 'Good',
      userStrokeCount: userCount,
      expectedStrokeCount: expectedCount,
      feedbackMessage: `Digambar ${userCount} goresan (target: ${expectedCount}).`,
      advice: 'Jumlahnya belum pas — cermati jumlah goresan resmi di Urutan Goresan.',
    };
  }
  return {
    status: 'Needs Practice',
    userStrokeCount: userCount,
    expectedStrokeCount: expectedCount,
    feedbackMessage: `Memerlukan lebih banyak latihan (${userCount} vs ${expectedCount} goresan).`,
    advice: 'Lihat kembali animasi Urutan Goresan, lalu coba Tutorial Terpandu.',
  };
}

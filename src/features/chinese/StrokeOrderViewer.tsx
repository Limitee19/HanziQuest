import { useState, useEffect, useMemo } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useOfficialStrokeData } from './useOfficialStrokeData';
import { Button } from '@/components/ui/Button';

/**
 * StrokeOrderViewer — animasi URUTAN GORESAN RESMI per karakter.
 *
 * Data resmi dari Makemeahanzi (via hanzi-writer-data, lisensi Arphic):
 * setiap goresan punya outline (bentuk akhir) dan median (garis tengah =
 * jalur pena resmi). Animasi: bentuk goresan "digambar" progresif
 * mengikuti median + panah arah tarikan + nomor urut goresan.
 */

interface StrokeOrderViewerProps {
  character: string;
  pinyin?: string;
  meaning?: string;
}

/** Path SVG garis tengah (median) untuk animasi pena. */
function medianPath(median: [number, number][] | undefined): string {
  if (!median || median.length === 0) return '';
  if (median.length === 1) {
    const [x, y] = median[0];
    return `M ${x},${y} L ${x + 0.5},${y}`;
  }
  return `M ${median.map(([x, y]) => `${x},${y}`).join(' L ')}`;
}

/** Perkiraan panjang polyline median (untuk stroke-dasharray). */
function medianLength(median: [number, number][] | undefined): number {
  if (!median || median.length < 2) return 1;
  let len = 0;
  for (let i = 1; i < median.length; i++) {
    len += Math.hypot(median[i][0] - median[i - 1][0], median[i][1] - median[i - 1][1]);
  }
  return Math.max(len, 1);
}

/** Posisi Dan sudut panah arah di ujung median. */
function arrowTip(median: [number, number][] | undefined): { x: number; y: number; angle: number } | null {
  if (!median || median.length < 2) return null;
  const [x1, y1] = median[median.length - 2];
  const [x2, y2] = median[median.length - 1];
  if (Math.hypot(x2 - x1, y2 - y1) < 1) {
    if (median.length < 3) return null;
    const [px1, py1] = median[median.length - 3];
    return { x: x2, y: y2, angle: (Math.atan2(y2 - py1, x2 - px1) * 180) / Math.PI };
  }
  return { x: x2, y: y2, angle: (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI };
}

/** Deteksi tema gelap (class .dark + preferensi OS). */
function useDarkMode(): boolean {
  const [dark, setDark] = useState<boolean>(
    () =>
      typeof document !== 'undefined' &&
      (document.documentElement.classList.contains('dark') ||
        window.matchMedia?.('(prefers-color-scheme: dark)').matches)
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const compute = () =>
      setDark(document.documentElement.classList.contains('dark') || mq.matches);
    compute();
    mq.addEventListener?.('change', compute);
    const observer = new MutationObserver(compute);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      mq.removeEventListener?.('change', compute);
      observer.disconnect();
    };
  }, []);
  return dark;
}

export function StrokeOrderViewer({ character, pinyin, meaning }: StrokeOrderViewerProps) {
  const { strokeData, loading } = useOfficialStrokeData(character, { pinyin, meaning });
  const [step, setStep] = useState<number>(0); // 0 = kosong; k = goresan 1..k tergambar
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const dark = useDarkMode();

  // Reset animasi saat karakter berganti
  useEffect(() => {
    setStep(0);
    setIsPlaying(false);
  }, [character]);

  const totalStrokes = strokeData?.strokes.length || 0;

  // Animasi otomatis: tiap langkah = gambar progresif (450ms) + jeda
  useEffect(() => {
    if (!isPlaying || totalStrokes === 0) return;
    if (step >= totalStrokes) {
      const t = window.setTimeout(() => setIsPlaying(false), 400);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setStep((s) => Math.min(totalStrokes, s + 1)), 750);
    return () => window.clearTimeout(t);
  }, [isPlaying, step, totalStrokes]);

  const medians = useMemo(
    () => (strokeData?.strokes || []).map((st) => st.median),
    [strokeData]
  );

  const stepIdx = step - 1; // goresan aktif (0-based); -1 = belum ada
  const activeMedian = stepIdx >= 0 ? medians[stepIdx] : undefined;
  const dashLen = medianLength(activeMedian);
  const tip = stepIdx >= 0 && stepIdx < totalStrokes ? arrowTip(activeMedian) : null;

  // Progres pena 0→1 tiap kali goresan aktif berganti (animasi dashoffset)
  const [penProgress, setPenProgress] = useState<number>(1);
  useEffect(() => {
    if (stepIdx < 0) {
      setPenProgress(1);
      return;
    }
    setPenProgress(0);
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setPenProgress(1)));
    return () => cancelAnimationFrame(raf);
  }, [stepIdx]);

  const ink = dark ? '#f4f4f5' : '#18181b';
  const ghost = dark ? '#3f3f46' : '#d4d4d8';

  if (loading) {
    return (
      <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-center space-y-3">
        <h2 className="text-6xl font-bold text-zinc-900 dark:text-zinc-100">{character}</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium inline-flex items-center gap-1.5 justify-center">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Memuat data urutan goresan resmi…
        </p>
      </div>
    );
  }

  if (!strokeData || totalStrokes === 0) {
    return (
      <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-center space-y-2">
        <h2 className="text-6xl font-bold text-zinc-900 dark:text-zinc-100">{character}</h2>
        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
          Data urutan goresan resmi untuk karakter ini belum tersedia.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4 max-w-sm mx-auto w-full min-w-0">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{strokeData.character}</span>
          {(pinyin || strokeData.pinyin) && (
            <span className="text-xs font-bold text-red-600 dark:text-red-400 font-mono">[{pinyin || strokeData.pinyin}]</span>
          )}
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-600 border border-blue-200/80">
          {totalStrokes} Goresan
        </span>
      </div>

      {/* Tianzige SVG Grid Canvas */}
      <div
        className="relative mx-auto border-2 border-red-500/40 rounded-xl bg-red-50/20 dark:bg-zinc-950/80 overflow-hidden shadow-inner flex items-center justify-center"
        style={{ width: '100%', maxWidth: '16rem', aspectRatio: '1 / 1' }}
      >
        {/* Grid 田字格 */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 1024 1024">
          <line x1="512" y1="0" x2="512" y2="1024" stroke="#ef4444" strokeWidth="2" strokeDasharray="8,8" />
          <line x1="0" y1="512" x2="1024" y2="512" stroke="#ef4444" strokeWidth="2" strokeDasharray="8,8" />
          <line x1="0" y1="0" x2="1024" y2="1024" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,4" />
          <line x1="1024" y1="0" x2="0" y2="1024" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,4" />
        </svg>

        {/* Goresan resmi */}
        <svg className="w-full h-full" viewBox={strokeData.viewBox}>
          {/* Goresan yang sudah selesai */}
          {strokeData.strokes.map((st, idx) => {
            if (idx >= stepIdx) return null;
            return (
              <path
                key={`done-${idx}`}
                d={st.path}
                fill={ink}
                stroke={ink}
                strokeWidth="8"
                strokeLinejoin="round"
              />
            );
          })}

          {/* Goresan aktif: bayangan bentuk akhir + pena progresif */}
          {stepIdx >= 0 && stepIdx < totalStrokes && (
            <>
              <path
                key={`ghost-${stepIdx}`}
                d={strokeData.strokes[stepIdx].path}
                fill={ghost}
                stroke={ghost}
                strokeWidth="8"
                strokeLinejoin="round"
                opacity="0.45"
              />
              {activeMedian && (
                <path
                  key={`pen-${stepIdx}`}
                  d={medianPath(activeMedian)}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="46"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    strokeDasharray: dashLen,
                    strokeDashoffset: dashLen * (1 - penProgress),
                    transition: 'stroke-dashoffset 450ms linear',
                  }}
                />
              )}
              {/* Panah arah tarikan */}
              {tip && (
                <polygon
                  points="-30,-20 36,0 -30,20"
                  transform={`translate(${tip.x},${tip.y}) rotate(${tip.angle})`}
                  fill="#ef4444"
                />
              )}
              {/* Nomor urut goresan di titik mulai */}
              {activeMedian && activeMedian[0] && (
                <g>
                  <circle cx={activeMedian[0][0]} cy={activeMedian[0][1]} r="34" fill="#ef4444" opacity="0.95" />
                  <text
                    x={activeMedian[0][0]}
                    y={activeMedian[0][1] + 13}
                    textAnchor="middle"
                    fontSize="40"
                    fontWeight="700"
                    fill="#ffffff"
                    fontFamily="system-ui, sans-serif"
                  >
                    {stepIdx + 1}
                  </text>
                </g>
              )}
            </>
          )}
        </svg>

        {/* Step Indicator Badge */}
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[11px] font-bold bg-zinc-900/80 text-white backdrop-blur-xs">
          Goresan {step} / {totalStrokes}
        </div>
      </div>

      {/* Keterangan legenda */}
      <p className="text-center text-[11px] text-zinc-500 dark:text-zinc-400 -mt-1">
        <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1 align-middle" />
        Merah = jalur Dan arah penarikan goresan resmi
      </p>

      {/* Animation Dan Step Control Buttons */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setIsPlaying(false);
            setStep((p) => Math.max(0, p - 1));
          }}
          disabled={step === 0}
          className="cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          onClick={() => {
            if (step >= totalStrokes) setStep(0);
            setIsPlaying(!isPlaying);
          }}
          className="bg-red-600 hover:bg-red-700 text-white cursor-pointer px-4 flex items-center gap-1.5"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span className="text-xs font-semibold">{isPlaying ? 'Pause' : 'Play Order'}</span>
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setIsPlaying(false);
            setStep((p) => Math.min(totalStrokes, p + 1));
          }}
          disabled={step >= totalStrokes}
          className="cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setIsPlaying(false);
            setStep(0);
          }}
          className="cursor-pointer text-zinc-500"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

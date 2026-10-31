import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { RotateCcw, Trash2, Eye, EyeOff, CheckCircle2, XCircle, Lightbulb, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { UserStroke, Point2D, evaluateSingleStroke } from '@/services/chinese/hanziWritingEvaluator';
import { HanziStrokeData } from '@/services/chinese/hanziStrokeData';

interface HanziWritingCanvasProps {
  strokeData: HanziStrokeData | null;
  targetCharacter: string;
  mode: 'guided' | 'free';
  onStrokesUpdated?: (strokes: UserStroke[]) => void;
  /** Dipanggil sekali saat semua goresan tutorial selesai dengan benar. */
  onTutorialComplete?: () => void;
  /**
   * Mode tulis multi-karakter: daftar karakter yang masing-masing
   * ditutorial lengkap (mis. 觉得 → [觉, 得], 没关系 → [没, 关, 系]).
   * Diberikan → targetCharacter diabaikan, kanvas berganti otomatis.
   */
  characters?: string[];
  /** Pemanggil memuat data goresan per karakter (hook useOfficialStrokeData). */
  loadCharacter?: (ch: string) => Promise<HanziStrokeData | null>;
  /** Laporkan karakter aktif + datanya ke pemanggil (untuk evaluasi mode bebas). */
  onActiveCharChange?: (ch: string, data: HanziStrokeData | null) => void;
}

const CANVAS_SIZE = 512;

/** Titik awal (M x,y) dari path SVG goresan. */
function pathStart(path: string): { x: number; y: number } | null {
  const nums = path.match(/-?\d+(?:\.\d+)?/g);
  if (!nums || nums.length < 2) return null;
  return { x: parseFloat(nums[0]), y: parseFloat(nums[1]) };
}

export function HanziWritingCanvas({
  strokeData,
  targetCharacter,
  mode,
  onStrokesUpdated,
  onTutorialComplete,
  characters,
  loadCharacter,
  onActiveCharChange,
}: HanziWritingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [strokes, setStrokes] = useState<UserStroke[]>([]);
  const [currentPoints, setCurrentPoints] = useState<Point2D[]>([]);
  const [showGridGuide, setShowGridGuide] = useState<boolean>(true);
  const [dark, setDark] = useState<boolean>(false);

  // ── Mode tutorial terpandu (urutan goresan) ──
  // Aktif hanya di mode 'guided': user WAJIB menggambar goresan berurutan.
  // Goresan yang diterima langsung dirender ulang sebagai jejak SVG resmi;
  // tinta user hanya tampak saat percobaan berjalan/salah.
  const [tutorialIdx, setTutorialIdx] = useState<number>(0);
  const [strokeFeedback, setStrokeFeedback] = useState<'pending' | 'ok' | 'wrong'>('pending');
  const [hintOn, setHintOn] = useState<boolean>(true);

  // ── Mode multi-karakter: latihan seluruh karakter kata, satu per satu ──
  // Contoh: 觉得 (jué de) → kanvas pertama menuntun semua goresan 觉,
  // lalu otomatis pindah ke kanvas 得 — setiap karakter ditutorial lengkap.
  const charQueue = useMemo(
    () => (characters && characters.length > 0 ? characters : Array.from(targetCharacter || [])),
    [characters, targetCharacter]
  );
  const multiMode = charQueue.length > 1;
  const [charIdx, setCharIdx] = useState<number>(0);
  const [multiData, setMultiData] = useState<HanziStrokeData | null>(null);
  const [charCompleted, setCharCompleted] = useState<boolean[]>(() => charQueue.map(() => false));
  const [showCharOverview, setShowCharOverview] = useState<boolean>(false);

  const activeChar = multiMode ? charQueue[Math.min(charIdx, charQueue.length - 1)] : targetCharacter;
  const effectiveData = multiMode ? multiData : strokeData;
  const allCharsDone = multiMode && charCompleted.length > 0 && charCompleted.every(Boolean);

  useEffect(() => {
    onActiveCharChange?.(activeChar, effectiveData ?? null);
  }, [activeChar, effectiveData, onActiveCharChange]);

  // Muat data goresan karakter aktif saat berganti (multi-mode)
  useEffect(() => {
    if (!multiMode || !loadCharacter) return;
    let alive = true;
    setMultiData(null);
    loadCharacter(charQueue[charIdx] || targetCharacter).then((d) => {
      if (!alive) return;
      setMultiData(d);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiMode, charIdx, loadCharacter]);

  // Selesai semua karakter → callback pemanggil (sekali)
  const notifiedRef = useRef(false);
  useEffect(() => {
    if (multiMode && allCharsDone && !notifiedRef.current) {
      notifiedRef.current = true;
      onTutorialComplete?.();
    }
    if (!multiMode) notifiedRef.current = false;
  }, [multiMode, allCharsDone, onTutorialComplete]);

  const totalStrokes = effectiveData?.strokes.length || 0;
  const tutorialActive = mode === 'guided' && totalStrokes > 0;
  const tutorialDone = tutorialActive && tutorialIdx >= totalStrokes;

  // Deteksi tema untuk warna tinta Dan panduan (ikut class dark + preferensi OS)
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

  // Reset tutorial saat mode / karakter berganti
  useEffect(() => {
    setTutorialIdx(0);
    setStrokeFeedback('pending');
    setStrokes([]);
    setCurrentPoints([]);
  }, [mode, targetCharacter]);

  // Reset ulang saat karakter aktif multi-mode berganti
  useEffect(() => {
    if (!multiMode) return;
    setTutorialIdx(0);
    setStrokeFeedback('pending');
    setStrokes([]);
    setCurrentPoints([]);
  }, [multiMode, charIdx]);

  // ── Rendering kanvas ──
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // Tinta menyesuaikan tema: putih di gelap, hitam di terang
    ctx.strokeStyle = dark ? '#f4f4f5' : '#18181b';

    const drawPolyline = (pts: Point2D[]) => {
      if (pts.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
    };

    strokes.forEach((stroke) => drawPolyline(stroke.points));
    drawPolyline(currentPoints);
  }, [strokes, currentPoints, dark]);

  useEffect(() => {
    redrawCanvas();
    if (onStrokesUpdated) onStrokesUpdated(strokes);
  }, [redrawCanvas, onStrokesUpdated, strokes]);

  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point2D => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (strokeFeedback !== 'pending') return; // tunggu reset setelah salah
    if (tutorialDone) return; // semua goresan selesai
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    const pt = getCanvasPoint(e);
    setCurrentPoints([pt]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const pt = getCanvasPoint(e);
    setCurrentPoints((prev) => [...prev, pt]);
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentPoints.length < 2) {
      setCurrentPoints([]);
      return;
    }
    setStrokes((prev) => [...prev, { points: currentPoints }]);

    // ── Pemeriksaan langsung di tutorial terpandu ──
    if (tutorialActive && effectiveData) {
      const target = effectiveData.strokes[tutorialIdx];
      if (!target) return;
      const check = evaluateSingleStroke(
        target.path,
        currentPoints,
        canvasRef.current?.width || CANVAS_SIZE,
        target.median
      );
      if (check.pass) {
        // Benar: hapus tinta user — jejak dirender ulang sebagai SVG resmi
        setStrokeFeedback('ok');
        setStrokes([]);
        window.setTimeout(() => {
          setTutorialIdx((i) => {
            const next = i + 1;
            if (next >= totalStrokes) {
              // Multi-karakter: tandai karakter ini selesai,lalu pindah ke
              // karakter berikutnya. Callback onTutorialComplete dipanggil
              // otomatis oleh effect setelah SEMUA karakter selesai.
              if (multiMode) {
                setCharCompleted((prev) => {
                  const cp = [...prev];
                  cp[Math.min(charIdx, cp.length - 1)] = true;
                  const isLast = charIdx + 1 >= charQueue.length;
                  if (!isLast) {
                    window.setTimeout(() => setCharIdx((c) => c + 1), 120);
                  }
                  return cp;
                });
              } else {
                onTutorialComplete?.();
              }
            }
            return next;
          });
          setStrokeFeedback('pending');
        }, 350);
      } else {
        // Salah: biarkan terlihat sebentar sebagai umpan balik, lalu bersihkan
        setStrokeFeedback('wrong');
        window.setTimeout(() => {
          setStrokes([]);
          setStrokeFeedback('pending');
        }, 950);
      }
    }
    setCurrentPoints([]);
  };

  const handleClear = () => {
    setStrokes([]);
    setCurrentPoints([]);
    if (tutorialActive) {
      setTutorialIdx(0);
      setStrokeFeedback('pending');
    }
  };

  const skipTutorialStroke = () => {
    if (!tutorialActive || tutorialDone) return;
    setStrokeFeedback('ok');
    window.setTimeout(() => {
      setTutorialIdx((i) => i + 1);
      setStrokeFeedback('pending');
    }, 250);
  };

  const activeStroke = tutorialActive && !tutorialDone ? effectiveData?.strokes[tutorialIdx] : null;
  const activeStart = activeStroke ? pathStart(activeStroke.path) : null;

  return (
    <div className="space-y-4 max-w-sm mx-auto">
      {/* Header multi-karakter: pilih karakter mana yang sedang/nud dilatih */}
      {multiMode && (
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          {charQueue.map((ch, idx) => {
            const isDone = charCompleted[idx];
            const isActive = idx === charIdx;
            return (
              <button
                key={`${ch}-${idx}`}
                type="button"
                onClick={() => setCharIdx(idx)}
                className={`w-10 h-10 rounded-lg border-2 text-xl font-bold flex items-center justify-center transition-all cursor-pointer ${
                  isActive
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 scale-105'
                    : isDone
                      ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500'
                }`}
                title={
                  isDone
                    ? `${ch} — tutorial selesai (klik untuk mengulang)`
                    : isActive
                      ? `${ch} — sedang ditutorial`
                      : `${ch} — klik untuk latihan karakter ini`
                }
              >
                {ch}
              </button>
            );
          })}
        </div>
      )}

      {multiMode && (
        <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
          <button
            type="button"
            onClick={() => setShowCharOverview((v) => !v)}
            className="inline-flex items-center gap-1 cursor-pointer hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            {showCharOverview ? 'Sembunyikan urutan' : 'Tampilkan urutan penuh'}
          </button>
          <span>•</span>
          <span>
            Karakter {charIdx + 1} / {charQueue.length}
            {allCharsDone ? ' — semuanya selesai ✓' : ''}
          </span>
        </div>
      )}

      {/* Overview utuh seluruh kata (multi-karakter) */}
      {multiMode && showCharOverview && (
        <div className="text-center py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <div className="inline-flex items-center gap-2 flex-wrap justify-center">
            {charQueue.map((ch, idx) => (
              <span
                key={`ov-${ch}-${idx}`}
                className={`text-3xl font-bold ${
                  charCompleted[idx]
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : idx === charIdx
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-zinc-400 dark:text-zinc-500'
                }`}
              >
                {ch}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Banner tutorial terpandu */}
      {tutorialActive && (
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold ${
            tutorialDone
              ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
              : strokeFeedback === 'wrong'
                ? 'border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                : 'border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
          }`}
        >
          {tutorialDone ? (
            <>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              Semua {totalStrokes} goresan benar urutan Dan arahnya! Uji lagi di Latihan Bebas.
            </>
          ) : strokeFeedback === 'wrong' ? (
            <>
              <XCircle className="w-4 h-4 shrink-0" />
              Goresan ke-{tutorialIdx + 1} belum sesuai — cermati titik mulai (hijau) dan arah tarikan.
            </>
          ) : (
            <>
              <Lightbulb className="w-4 h-4 shrink-0" />
              Gambar goresan ke-{tutorialIdx + 1} dari {totalStrokes} mengikuti jalur berkedip.
            </>
          )}
        </div>
      )}

      {/* Tianzige Canvas Container */}
      <div className="relative w-72 h-72 mx-auto border-2 border-red-500/40 rounded-2xl bg-white dark:bg-zinc-950 overflow-hidden shadow-md flex items-center justify-center">
        {/* Tianzige Grid Guide (田字格) */}
        {showGridGuide && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 1024 1024">
            <line x1="512" y1="0" x2="512" y2="1024" stroke="#ef4444" strokeWidth="2" strokeDasharray="8,8" />
            <line x1="0" y1="512" x2="1024" y2="512" stroke="#ef4444" strokeWidth="2" strokeDasharray="8,8" />
            <line x1="0" y1="0" x2="1024" y2="1024" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,4" />
            <line x1="1024" y1="0" x2="0" y2="1024" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,4" />
          </svg>
        )}

        {/* ── Panduan tracing (guided): jalur PUCAT + jejak goresan selesai ── */}
        {tutorialActive && effectiveData && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox={effectiveData.viewBox}
            style={{ zIndex: 1 }}
          >
            {/* Goresan yang sudah diterima: jejak abu tenang */}
            {effectiveData.strokes.map((st, idx) => {
              if (idx >= tutorialIdx) return null;
              return (
                <path
                  key={`done-${idx}`}
                  d={st.path}
                  fill="none"
                  stroke={dark ? '#52525b' : '#d4d4d8'}
                  strokeWidth="30"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}
            {/* Jalur target berikutnya: panduan PUCAT berkedip lembut */}
            {activeStroke && (
              <path
                d={activeStroke.path}
                fill="none"
                stroke={dark ? '#d4d4d8' : '#e4e4e7'}
                strokeWidth="38"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="hanzi-guide-pulse"
              />
            )}
            {/* Preview goresan selanjutnya (samar) saat hint menyala */}
            {hintOn &&
              effectiveData.strokes.map((st, idx) => {
                if (idx <= tutorialIdx || tutorialDone) return null;
                return (
                  <path
                    key={`next-${idx}`}
                    d={st.path}
                    fill="none"
                    stroke={dark ? '#3f3f46' : '#ececec'}
                    strokeWidth="30"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.6"
                  />
                );
              })}
            {/* Titik MULAI goresan aktif — penunjuk arah tarikan */}
            {activeStart && (
              <circle
                cx={activeStart.x}
                cy={activeStart.y}
                r="13"
                fill="#22c55e"
                opacity="0.9"
              />
            )}
          </svg>
        )}

        {/* Free Mode Faint Character Watermark */}
        {mode === 'free' && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5 select-none text-9xl font-bold text-zinc-900 dark:text-white">
            {activeChar}
          </div>
        )}

        {/* HTML5 Drawing Canvas */}
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full h-full cursor-crosshair touch-none relative z-10"
        />
      </div>

      {/* Kontrol tutorial */}
      {tutorialActive && !tutorialDone && (
        <div className="flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setHintOn(!hintOn)}
            className="cursor-pointer text-xs text-zinc-500 flex items-center gap-1"
          >
            {hintOn ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {hintOn ? 'Sembunyikan preview' : 'Tampilkan preview'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={skipTutorialStroke}
            className="cursor-pointer text-xs flex items-center gap-1"
          >
            <SkipForward className="w-3.5 h-3.5" />
            Lewati goresan
          </Button>
        </div>
      )}

      {/* Canvas Toolbar Controls */}
      <div className="flex items-center justify-between gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setStrokes((prev) => prev.slice(0, -1))}
          disabled={strokes.length === 0 || tutorialActive}
          title={tutorialActive ? 'Tidak perlu di mode tutorial — goresan salah dibersihkan otomatis' : undefined}
          className="cursor-pointer flex items-center gap-1 text-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Undo ({strokes.length})
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowGridGuide(!showGridGuide)}
          className="cursor-pointer text-xs text-zinc-500 flex items-center gap-1"
        >
          {showGridGuide ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {showGridGuide ? 'Hide Grid' : 'Show Grid'}
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={handleClear}
          disabled={strokes.length === 0 && !tutorialActive}
          className="cursor-pointer flex items-center gap-1 text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear
        </Button>
      </div>

      {/* Multi-karakter: mulai ulang seluruh kata dari karakter pertama */}
      {multiMode && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setCharIdx(0);
            setCharCompleted(charQueue.map(() => false));
            setTutorialIdx(0);
            setStrokeFeedback('pending');
            setStrokes([]);
            notifiedRef.current = false;
          }}
          className="cursor-pointer text-xs text-zinc-500 w-full"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Mulai ulang semua karakter
        </Button>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Map as MapIcon, LayoutGrid } from 'lucide-react';
import { clickTick } from '@/lib/fx';
import { FLAVOR, Landmark, LandmarkSvg, OUTPOST_NAME, Plum } from '@/lib/landmark';
import { course } from '@/data/course';
import { fetchOutpostStats } from '@/services/chinese/questService';

interface GameWorldMapProps {
  counts?: Record<number, { total: number; due: number; mastered: number }>;
  soundEnabled?: boolean;
  currentActiveStage?: number;
  onSelectStage?: (level: number) => void;
  onStartStudy?: (level: number) => void;
  onDrill?: (level: number) => void;
  onOpenDeck?: (level: number) => void;
}

interface PosCoord {
  level: number;
  x: number; // SVG viewBox x (out of 1000)
  y: number; // SVG viewBox y (out of 750)
  name: string;
  subtitle: string;
  biome: string;
  color: string;
  desc: string;
}

const POS_COORDS: PosCoord[] = [
  { level: 1, x: 190, y: 640, name: 'Pos 1: Gerbang Desa', subtitle: 'HSK 1 · Lembah Permulaan', biome: 'village', color: '#E11D48', desc: 'Kosakata dasar sehari-hari' },
  { level: 2, x: 500, y: 550, name: 'Pos 2: Jembatan Bambu', subtitle: 'HSK 2 · Hutan Bambu & Sungai', biome: 'river', color: '#10B981', desc: 'Percakapan dasar & aktivitas harian' },
  { level: 3, x: 250, y: 400, name: 'Pos 3: Paviliun Teh', subtitle: 'HSK 3 · Air Terjun & Sakura', biome: 'falls', color: '#059669', desc: 'Topik menengah & kerja rutin' },
  { level: 4, x: 670, y: 330, name: 'Pos 4: Menara Lentera', subtitle: 'HSK 4 · Ngarai Lentera Senja', biome: 'canyon', color: '#F59E0B', desc: 'Diskusi umum & opini' },
  { level: 5, x: 380, y: 200, name: 'Pos 5: Gunung Berkabut', subtitle: 'HSK 5 · Tebing Awan & Salju', biome: 'mountain', color: '#6366F1', desc: 'Artikel, koran & percakapan bebas' },
  { level: 6, x: 770, y: 110, name: 'Pos 6: Pagoda Puncak', subtitle: 'HSK 6 · Istana Awan Emas', biome: 'summit', color: '#D97706', desc: 'Sastra & kefasihan tingkat lanjut' },
];

export function GameWorldMap({
  counts: propCounts,
  soundEnabled = true,
  currentActiveStage = 1,
  onSelectStage,
  onStartStudy,
  onDrill,
  onOpenDeck,
}: GameWorldMapProps) {
  // Mode tampilan: 'map' (Peta interaktif bernyawa) atau 'grid' (Tampilan kisi pos)
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('map');
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [internalCounts, setInternalCounts] = useState<Record<number, { total: number; due: number; mastered: number }>>(propCounts || {});

  useEffect(() => {
    if (propCounts && Object.keys(propCounts).length > 0) {
      setInternalCounts(propCounts);
    }
  }, [propCounts]);

  useEffect(() => {
    const refresh = () => {
      fetchOutpostStats().then((res) => {
        setInternalCounts(res);
      });
    };
    if (!propCounts || Object.keys(propCounts).length === 0) {
      refresh();
    }
    window.addEventListener('omnilife_db_updated', refresh);
    window.addEventListener('db_mutation', refresh);
    return () => {
      window.removeEventListener('omnilife_db_updated', refresh);
      window.removeEventListener('db_mutation', refresh);
    };
  }, [propCounts]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedLevel(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const effectiveCounts = (propCounts && Object.keys(propCounts).length > 0) ? propCounts : internalCounts;
  const selPos = selectedLevel !== null ? POS_COORDS.find((p) => p.level === selectedLevel) ?? null : null;
  const levelWordCount = selectedLevel !== null ? course.words.filter((w) => w.level === String(selectedLevel)).length : 0;
  const rawSelStats = (selectedLevel !== null && effectiveCounts[selectedLevel]) ? effectiveCounts[selectedLevel] : undefined;
  const selStats = {
    total: rawSelStats?.total || levelWordCount || 301,
    due: rawSelStats?.due ?? 0,
    mastered: rawSelStats?.mastered ?? 0,
  };
  const selPct = selStats.total ? Math.round((selStats.mastered / selStats.total) * 100) : 0;
  const selBloomed = Math.min(5, Math.round((selPct / 100) * 5));
  const isPlayable = selStats.due > 0 || (selectedLevel === 1 && selStats.total > 0);

  const handleSelect = (lv: number) => {
    setSelectedLevel(lv);
    clickTick(soundEnabled);
  };

  const handleClose = () => {
    setSelectedLevel(null);
    clickTick(soundEnabled);
  };

  return (
    <div className="game-map-container relative w-full space-y-4">
      {/* ── View Mode Switcher Header ── */}
      <div className="flex items-center justify-between gap-2 flex-wrap px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Tampilan Petualangan:
          </span>
        </div>

        <div className="bg-[#FFFDF9] dark:bg-[#151E32] border-2 border-[#231F20] dark:border-[#334155] p-1 rounded-2xl flex items-center gap-1 shadow-xs">
          <button
            type="button"
            onClick={() => {
              clickTick(soundEnabled);
              setViewMode('map');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'map'
                ? 'bg-[#C0392B] text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Peta Petualangan</span>
          </button>
          <button
            type="button"
            onClick={() => {
              clickTick(soundEnabled);
              setViewMode('grid');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'grid'
                ? 'bg-[#C0392B] text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Kisi Pos</span>
          </button>
        </div>
      </div>

      {/* ── MODE 1: LIVING ANIMATED MAP VIEW ── */}
      {viewMode === 'map' && (
        <div className="game-map-canvas-wrapper w-full max-w-4xl mx-auto relative overflow-hidden rounded-3xl border-2 border-[#231F20] dark:border-[#334155] bg-[#FAF5E8] dark:bg-[#0B101D] shadow-md">
          <svg
            viewBox="0 0 1000 750"
            className="game-map-svg w-full h-auto block select-none"
            preserveAspectRatio="xMidYMid meet"
            aria-label="Peta Petualangan HSK Interaktif"
          >
            <defs>
              <style>{`
                @keyframes pulseTrailFlow {
                  0% { stroke-dashoffset: 0; }
                  100% { stroke-dashoffset: -96; }
                }
                @keyframes boatFloating {
                  0%, 100% { transform: translateY(0px) rotate(0deg); }
                  50% { transform: translateY(-4px) rotate(2deg); }
                }
                @keyframes cranesFlying {
                  0% { transform: translate(-80px, 80px) scale(0.8); opacity: 0; }
                  15% { opacity: 0.85; }
                  85% { opacity: 0.85; }
                  100% { transform: translate(1050px, 20px) scale(0.8); opacity: 0; }
                }
                @keyframes compassGentleDrift {
                  0%, 100% { transform: rotate(0deg); }
                  50% { transform: rotate(5deg); }
                }
                .anim-trail-glow {
                  animation: pulseTrailFlow 2.6s linear infinite;
                }
                .anim-sampan {
                  animation: boatFloating 3.6s ease-in-out infinite;
                  transform-origin: center;
                }
                .anim-sampan-2 {
                  animation: boatFloating 4.2s ease-in-out -2s infinite;
                  transform-origin: center;
                }
                .anim-cranes {
                  animation: cranesFlying 24s linear infinite;
                }
                .anim-compass {
                  animation: compassGentleDrift 7s ease-in-out infinite;
                  transform-origin: 75px 65px;
                }
              `}</style>

              {/* Vignette */}
              <radialGradient id="mapVignette" cx="50%" cy="50%" r="65%">
                <stop offset="0%" stopColor="#FFFDF7" />
                <stop offset="70%" stopColor="#FAF5E8" />
                <stop offset="100%" stopColor="#EFE5CD" />
              </radialGradient>

              {/* River Gradient */}
              <linearGradient id="riverFlow" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0284C7" stopOpacity="0.95" />
              </linearGradient>

              {/* Glowing Golden Energy Trail */}
              <linearGradient id="goldenPathGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#F43F5E" />
                <stop offset="25%" stopColor="#10B981" />
                <stop offset="55%" stopColor="#F59E0B" />
                <stop offset="85%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#FCD34D" />
              </linearGradient>

              {/* Filter glow */}
              <filter id="pathGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* 1. Base Terrain Map Background */}
            <rect x="0" y="0" width="1000" height="750" rx="20" fill="url(#mapVignette)" />

            {/* Oriental Double Golden Frame with Knot Flourishes */}
            <rect x="14" y="14" width="972" height="722" rx="14" fill="none" stroke="#D4AF37" strokeWidth="2.5" opacity="0.6" />
            <rect x="22" y="22" width="956" height="706" rx="10" fill="none" stroke="#C59B27" strokeWidth="1" strokeDasharray="8 6" opacity="0.45" />

            {/* Corner Calligraphy Knot Motifs */}
            <g stroke="#92400E" strokeWidth="1.6" fill="none" opacity="0.4">
              <path d="M 22 42 C 32 42, 42 32, 42 22 M 22 34 C 28 34, 34 28, 34 22" />
              <path d="M 978 42 C 968 42, 958 32, 958 22 M 978 34 C 972 34, 966 28, 966 22" />
              <path d="M 22 708 C 32 708, 42 718, 42 728 M 22 716 C 28 716, 34 722, 34 728" />
              <path d="M 978 708 C 968 708, 958 718, 958 728 M 978 716 C 972 716, 966 722, 966 728" />
            </g>

            {/* 2. Shanshui Ink Mountain Silhouettes in Background */}
            <g opacity="0.25">
              <path
                d="M 0 240 Q 140 120, 320 160 T 640 110 T 1000 130 L 1000 380 L 0 380 Z"
                fill="#94A3B8"
              />
              <path
                d="M 120 280 Q 280 190, 420 230 T 780 180 T 1000 220 L 1000 480 L 120 480 Z"
                fill="#64748B"
                opacity="0.45"
              />
            </g>

            {/* 3. Winding River & Cascading Waterfall */}
            <g>
              <path
                d="M 150 360 Q 170 390, 180 430 Q 190 470, 210 500"
                stroke="#BAE6FD"
                strokeWidth="20"
                fill="none"
                strokeLinecap="round"
                opacity="0.8"
              />
              <path
                d="M 155 365 Q 175 395, 185 435 M 165 370 Q 180 400, 195 450"
                stroke="#FFFFFF"
                strokeWidth="2"
                fill="none"
                strokeDasharray="6 6"
                opacity="0.85"
              />
              <path
                id="riverMainPath"
                d="M 180 500 C 250 550, 400 520, 480 580 C 560 630, 520 680, 680 700 C 780 710, 890 720, 1000 730 L 1000 750 L 760 750 C 620 720, 480 670, 410 610 C 340 550, 210 540, 150 510 Z"
                fill="url(#riverFlow)"
              />

              {/* Animated Floating Sampan Boats */}
              <g className="anim-sampan" transform="translate(680, 680)">
                <ellipse cx="0" cy="0" rx="18" ry="6" fill="#78350F" />
                <path d="M -12 -1 Q 0 -6, 12 -1" fill="#D97706" />
                <line x1="0" y1="-6" x2="0" y2="-16" stroke="#451A03" strokeWidth="1.6" />
                <polygon points="0,-16 11,-11 0,-6" fill="#FEF3C7" opacity="0.9" />
              </g>

              <g className="anim-sampan-2" transform="translate(860, 710)">
                <ellipse cx="0" cy="0" rx="15" ry="5" fill="#78350F" />
                <path d="M -10 -1 Q 0 -5, 10 -1" fill="#B45309" />
                <line x1="0" y1="-5" x2="0" y2="-13" stroke="#451A03" strokeWidth="1.5" />
                <polygon points="0,-13 8,-9 0,-5" fill="#FEF3C7" opacity="0.85" />
              </g>
            </g>

            {/* 4. Animated Flying Cranes in the Sky */}
            <g className="anim-cranes">
              <g transform="translate(0, 0)">
                <path d="M 0 0 Q 10 -12, 20 0 Q 30 -12, 40 0 Q 20 -5, 0 0 Z" fill="#FFFFFF" opacity="0.9" />
                <circle cx="20" cy="-3" r="2" fill="#EF4444" />
              </g>
              <g transform="translate(32, 20) scale(0.75)">
                <path d="M 0 0 Q 10 -12, 20 0 Q 30 -12, 40 0 Q 20 -5, 0 0 Z" fill="#FFFFFF" opacity="0.85" />
                <circle cx="20" cy="-3" r="2" fill="#EF4444" />
              </g>
            </g>

            {/* 5. Bamboo Grove Biome */}
            <g opacity="0.75">
              {[460, 480, 500, 520, 600, 620, 640].map((bx, i) => (
                <g key={`bamboo-${bx}-${i}`} transform={`translate(${bx}, ${510 + (i % 3) * 8})`}>
                  <line x1="0" y1="0" x2="0" y2="48" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
                  <line x1="0" y1="12" x2="6" y2="8" stroke="#10B981" strokeWidth="2" />
                  <line x1="0" y1="26" x2="-6" y2="22" stroke="#10B981" strokeWidth="2" />
                </g>
              ))}
            </g>

            {/* 6. Cherry Blossom Grove Biome */}
            <g opacity="0.85">
              <circle cx="160" cy="420" r="22" fill="#FDA4AF" opacity="0.8" />
              <circle cx="172" cy="408" r="18" fill="#F43F5E" opacity="0.75" />
              <circle cx="148" cy="412" r="16" fill="#FECDD3" opacity="0.9" />
              <path d="M 160 432 L 160 458" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
            </g>

            {/* 7. Wavy Animated Golden Path Connecting Outposts */}
            <g>
              <path
                d="M 190 640 C 320 640, 400 580, 500 550 C 380 470, 320 440, 250 400 C 430 380, 560 360, 670 330 C 530 270, 450 240, 380 200 C 540 160, 650 140, 770 110"
                fill="none"
                stroke="#D97706"
                strokeWidth="12"
                strokeLinecap="round"
                opacity="0.25"
              />
              <path
                d="M 190 640 C 320 640, 400 580, 500 550 C 380 470, 320 440, 250 400 C 430 380, 560 360, 670 330 C 530 270, 450 240, 380 200 C 540 160, 650 140, 770 110"
                fill="none"
                stroke="url(#goldenPathGrad)"
                strokeWidth="6"
                strokeDasharray="16 12"
                strokeLinecap="round"
                className="anim-trail-glow"
                filter="url(#pathGlowFilter)"
              />
            </g>

            {/* 8. Outpost Landmark Nodes (HSK 1 - 6) */}
            {POS_COORDS.map((pos) => {
              const posLevelCount = course.words.filter((w) => w.level === String(pos.level)).length;
              const rawS = effectiveCounts[pos.level];
              const s = {
                total: rawS?.total || posLevelCount || 301,
                due: rawS?.due ?? 0,
                mastered: rawS?.mastered ?? 0,
              };
              const isSelected = selectedLevel === pos.level;
              const pct = s.total ? Math.round((s.mastered / s.total) * 100) : 0;
              const bloomedCount = Math.min(5, Math.round((pct / 100) * 5));
              const hasDue = s.due > 0;

              return (
                <g
                  key={pos.level}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={() => handleSelect(pos.level)}
                  className="cursor-pointer group"
                  style={{ transition: 'all 0.25s ease' }}
                >
                  {/* Active Ripple Aura if Stage Has Due Words or is Active Stage */}
                  {(hasDue || currentActiveStage === pos.level) && (
                    <circle
                      cx="0"
                      cy="0"
                      r="58"
                      fill="none"
                      stroke="#E11D48"
                      strokeWidth="2.5"
                      strokeDasharray="6 5"
                      opacity="0.75"
                      className="animate-spin"
                      style={{ animationDuration: '14s' }}
                    />
                  )}

                  {/* Island Platform Base */}
                  <ellipse
                    cx="0"
                    cy="16"
                    rx="48"
                    ry="18"
                    fill="#1F2937"
                    opacity="0.14"
                  />
                  <ellipse
                    cx="0"
                    cy="10"
                    rx="44"
                    ry="16"
                    fill="#FAF5E8"
                    stroke="#D4AF37"
                    strokeWidth="2"
                  />

                  {/* Circular Node Frame with Contained Landmark */}
                  <g transform="translate(0, -14)">
                    <circle
                      cx="0"
                      cy="0"
                      r="36"
                      fill="#FFFFFF"
                      stroke={isSelected ? '#E11D48' : '#231F20'}
                      strokeWidth={isSelected ? '3.5' : '2'}
                      style={{
                        filter: isSelected
                          ? 'drop-shadow(0 0 12px rgba(225, 29, 72, 0.45))'
                          : 'drop-shadow(0 3px 5px rgba(0,0,0,0.12))',
                      }}
                    />

                    {/* Centered Landmark inside foreignObject (strictly contained in circle) */}
                    <foreignObject x="-24" y="-24" width="48" height="48" className="pointer-events-none overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center p-0.5">
                        <LandmarkSvg level={pos.level} />
                      </div>
                    </foreignObject>

                    {/* Level Number Ribbon */}
                    <g transform="translate(20, 20)">
                      <circle cx="0" cy="0" r="11" fill="#231F20" />
                      <text
                        x="0"
                        y="3.5"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="9.5"
                        fontWeight="900"
                        fontFamily="var(--font-sans)"
                      >
                        H{pos.level}
                      </text>
                    </g>
                  </g>

                  {/* Outpost Title Banner Plate */}
                  <g transform="translate(0, 42)">
                    <rect
                      x="-70"
                      y="0"
                      width="140"
                      height="24"
                      rx="12"
                      fill="#FFFFFF"
                      stroke="#231F20"
                      strokeWidth="1.6"
                      style={{ filter: 'drop-shadow(0 2px 0 #231F20)' }}
                    />
                    <text
                      x="0"
                      y="15"
                      textAnchor="middle"
                      fill="#18181B"
                      fontSize="10.5"
                      fontWeight="800"
                      fontFamily="var(--font-serif)"
                    >
                      {OUTPOST_NAME[pos.level]}
                    </text>
                  </g>

                  {/* Blossom Stars Badge */}
                  <g transform="translate(0, 72)">
                    <rect
                      x="-48"
                      y="-3"
                      width="96"
                      height="16"
                      rx="8"
                      fill="#FFFDF7"
                      stroke="#E5E7EB"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="8"
                      textAnchor="middle"
                      fill="#78350F"
                      fontSize="8.5"
                      fontWeight="700"
                    >
                      🌸 {bloomedCount}/5 Bunga
                    </text>
                  </g>
                </g>
              );
            })}

            {/* 9. Floating Compass Rose */}
            <g className="anim-compass" transform="translate(75, 65)">
              <circle cx="0" cy="0" r="26" fill="#FAF5E8" stroke="#D4AF37" strokeWidth="2" />
              <path d="M 0 -20 L 5 -5 L 20 0 L 5 5 L 0 20 L -5 5 L -20 0 L -5 -5 Z" fill="#C0392B" opacity="0.85" />
              <circle cx="0" cy="0" r="3.5" fill="#FEF3C7" />
              <text x="0" y="-9" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="bold">N</text>
            </g>
          </svg>
        </div>
      )}

      {/* ── MODE 2: BENTO GRID VIEW ── */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in duration-200">
          {POS_COORDS.map((pos) => {
            const posLevelCount = course.words.filter((w) => w.level === String(pos.level)).length;
            const rawS = effectiveCounts[pos.level];
            const s = {
              total: rawS?.total || posLevelCount || 301,
              due: rawS?.due ?? 0,
              mastered: rawS?.mastered ?? 0,
            };
            const pct = s.total ? Math.round((s.mastered / s.total) * 100) : 0;
            const bloomedCount = Math.min(5, Math.round((pct / 100) * 5));

            return (
              <div
                key={pos.level}
                className="bg-[#FFFDF9] dark:bg-[#151E32] border border-zinc-300 dark:border-[#24324E] rounded-3xl p-5 space-y-4 transition-transform hover:-translate-y-1 shadow-xs dark:shadow-none"
                style={{ boxShadow: '0 4px 16px -2px rgba(35, 31, 32, 0.08), 0 2px 6px -1px rgba(35, 31, 32, 0.04)' }}
              >
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50/70 dark:bg-[#1C2742] border border-zinc-300 dark:border-[#2D3D60] flex items-center justify-center p-2 shrink-0">
                    <Landmark level={pos.level} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                        HSK {pos.level}
                      </span>
                      <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 truncate">
                        {pos.subtitle.split('·')[1] || pos.subtitle}
                      </span>
                    </div>
                    <h3 className="font-serif text-base font-bold text-zinc-900 dark:text-zinc-100 truncate mt-0.5">
                      {OUTPOST_NAME[pos.level]}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-300 italic bg-amber-50/50 dark:bg-amber-950/30 p-2.5 sm:p-3 rounded-xl border border-amber-200/50 dark:border-amber-900/40 leading-relaxed min-h-[52px] flex items-center">
                  "{FLAVOR[pos.level]}"
                </p>

                {/* Progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-zinc-600 dark:text-zinc-300">
                    <span>Mekar: {s.mastered}/{s.total} aksara</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{pct}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700">
                    <div
                      className="h-full bg-linear-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-zinc-500 dark:text-zinc-400 pt-0.5">
                    <span>{bloomedCount}/5 Bunga Mekar</span>
                    {s.due > 0 ? (
                      <span className="font-bold text-rose-600 dark:text-rose-400">{s.due} kata jatuh tempo</span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Siap belajar</span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => {
                      clickTick(soundEnabled);
                      onStartStudy?.(pos.level);
                      onSelectStage?.(pos.level);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-[#C0392B] hover:bg-[#a93226] text-white font-bold text-xs cursor-pointer shadow-xs transition-transform active:scale-95 text-center flex items-center justify-center"
                  >
                    Belajar Pos {pos.level}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      clickTick(soundEnabled);
                      onDrill?.(pos.level);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-white dark:bg-[#1C2742] border border-zinc-300 dark:border-[#2D3D60] hover:bg-zinc-50 dark:hover:bg-[#253252] text-zinc-800 dark:text-zinc-200 font-bold text-xs cursor-pointer text-center shadow-xs transition-transform active:scale-95"
                  >
                    Drill Pos
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── POPUP INFO POS (Matching Hanzi Quest Aesthetic) ── */}
      {selectedLevel !== null && selPos && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={handleClose}
        >
          <div
            className="w-full max-w-lg bg-[#FFFDF9] dark:bg-[#151E32] border border-zinc-300 dark:border-[#24324E] rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl relative animate-in zoom-in-95 duration-200 text-zinc-900 dark:text-zinc-100"
            style={{ boxShadow: '0 16px 40px -8px rgba(35, 31, 32, 0.18), 0 0 0 1px rgba(35, 31, 32, 0.08)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-[#1C2742] border-2 border-[#231F20] dark:border-[#2D3D60] flex items-center justify-center p-2.5 shrink-0 shadow-xs">
                  <Landmark level={selPos.level} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-900">
                      HSK {selPos.level}
                    </span>
                    <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                      {selPos.subtitle}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-extrabold text-[#231F20] dark:text-zinc-100 mt-1">
                    {OUTPOST_NAME[selPos.level]}
                  </h3>
                  <div className="text-xs text-zinc-600 dark:text-zinc-300 mt-0.5">
                    {selStats.due > 0 ? (
                      <b className="text-rose-600 dark:text-rose-400">{selStats.due} kata jatuh tempo</b>
                    ) : (
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">🌸 Semua kata telah diulang!</span>
                    )}{' '}
                    · {selStats.mastered}/{selStats.total} mekar ({selPct}%)
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#1C2742] hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 font-bold cursor-pointer"
                onClick={handleClose}
              >
                ✕
              </button>
            </div>

            {/* Flavor Lore */}
            <p className="text-xs text-zinc-700 dark:text-zinc-300 italic bg-amber-50/70 dark:bg-amber-950/30 p-3.5 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 leading-relaxed">
              "{FLAVOR[selPos.level]}"
            </p>

            {/* Progress & Blossoms */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
                <span>Progres Bunga Mekar Pos Ini:</span>
                <span className="text-emerald-700 dark:text-emerald-400">{selPct}%</span>
              </div>
              <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700">
                <div
                  className="h-full bg-linear-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${selPct}%` }}
                />
              </div>
              <div className="flex justify-end gap-1 pt-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-6 h-6">
                    <Plum bloomed={i < selBloomed} />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                className="col-span-2 py-3 px-4 rounded-2xl bg-[#C0392B] hover:bg-[#a93226] text-white font-bold text-sm shadow-sm hover:shadow transition-all cursor-pointer flex items-center justify-center"
                onClick={() => {
                  handleClose();
                  onStartStudy?.(selPos.level);
                  onSelectStage?.(selPos.level);
                }}
              >
                <span>{isPlayable ? `Mulai Sesi Belajar Pos ${selPos.level}` : `Buka & Pelajari Pos ${selPos.level}`}</span>
              </button>

              <button
                type="button"
                className="py-2.5 px-3 rounded-2xl bg-white dark:bg-[#1C2742] border border-zinc-300 dark:border-[#2D3D60] hover:bg-zinc-50 dark:hover:bg-[#253252] text-zinc-800 dark:text-zinc-200 font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center"
                onClick={() => {
                  handleClose();
                  onDrill?.(selPos.level);
                }}
              >
                <span>Drill Nada & Mirip</span>
              </button>

              <button
                type="button"
                className="py-2.5 px-3 rounded-2xl bg-white dark:bg-[#1C2742] border border-zinc-300 dark:border-[#2D3D60] hover:bg-zinc-50 dark:hover:bg-[#253252] text-zinc-800 dark:text-zinc-200 font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center"
                onClick={() => {
                  handleClose();
                  onOpenDeck?.(selPos.level);
                }}
              >
                <span>Koleksi Kartu</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

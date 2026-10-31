import React, { useEffect, useState } from 'react';
import { Droplets } from 'lucide-react';
import { speakHanzi, clickTick } from '@/lib/fx';
import { fetchMasteredWords, fetchOutpostStats } from '@/services/chinese/questService';
import type { CourseWord } from '@/data/course.types';
import { meaningOf } from '@/data/course.types';
import { course } from '@/data/course';
import { usePrefs } from '@/lib/prefs';

interface GardenPageProps {
  onBackToMap?: () => void;
  onStartSession?: (level?: number) => void;
}

export const GardenPage: React.FC<GardenPageProps> = ({ onBackToMap, onStartSession }) => {
  const [masteredWords, setMasteredWords] = useState<CourseWord[]>([]);
  const [outpostStats, setOutpostStats] = useState<Record<number, { total: number; due: number; mastered: number }>>({});
  const [selectedWord, setSelectedWord] = useState<CourseWord | null>(null);
  const [activeLevelFilter, setActiveLevelFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { sound } = usePrefs();

  useEffect(() => {
    const loadGarden = () => {
      Promise.all([fetchMasteredWords(), fetchOutpostStats()]).then(([mastered, stats]) => {
        setMasteredWords(mastered);
        setOutpostStats(stats);
      });
    };
    loadGarden();

    window.addEventListener('omnilife_db_updated', loadGarden);
    window.addEventListener('db_mutation', loadGarden);
    return () => {
      window.removeEventListener('omnilife_db_updated', loadGarden);
      window.removeEventListener('db_mutation', loadGarden);
    };
  }, []);

  const totalWords = course.words.length;
  const totalMastered = masteredWords.length;
  const totalDue = Object.values(outpostStats).reduce((acc, s) => acc + s.due, 0);

  const filteredFlowers = masteredWords.filter((w) => {
    const matchLevel = activeLevelFilter === 'all' || parseInt(w.level, 10) === activeLevelFilter;
    const matchSearch = !searchQuery.trim() || 
      w.hanzi.includes(searchQuery.trim()) || 
      w.pinyin.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      meaningOf(w).toLowerCase().includes(searchQuery.trim().toLowerCase());
    return matchLevel && matchSearch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div 
        className="bg-[#FFFDF9] dark:bg-[#151E32] border border-zinc-300 dark:border-[#24324E] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        style={{ boxShadow: '0 12px 32px -4px rgba(35, 31, 32, 0.08), 0 2px 6px -1px rgba(35, 31, 32, 0.04)' }}
      >
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-xs shrink-0">
            🌸
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="font-serif text-lg sm:text-2xl md:text-3xl font-extrabold text-[#231F20] dark:text-zinc-100 tracking-tight break-words [overflow-wrap:anywhere] leading-tight">
                Kebun Aksara Dan Statistik Petualangan
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold shrink-0">
                Tumbuh Subur
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl leading-relaxed break-words [overflow-wrap:anywhere]">
              Setiap aksara Mandarin yang berhasil kamu kuasai (mastered) mekar menjadi bunga Meihua di kebun ini. Siram dan tinjau setiap hari agar tidak layu!
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto sm:justify-end shrink-0">
          {onBackToMap && (
            <button
              type="button"
              onClick={() => {
                clickTick(sound);
                onBackToMap();
              }}
              className="px-4 py-2.5 rounded-2xl border border-zinc-300 dark:border-[#24324E] bg-white dark:bg-[#1C2742] hover:bg-zinc-100 dark:hover:bg-[#253252] text-zinc-800 dark:text-zinc-200 font-bold text-xs sm:text-sm cursor-pointer shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>←</span> Peta Petualangan
            </button>
          )}

          {totalDue > 0 && onStartSession && (
            <button
              type="button"
              onClick={() => {
                clickTick(sound);
                onStartSession(1);
              }}
              className="px-5 py-2.5 rounded-2xl bg-[#C0392B] hover:bg-[#a93226] text-white font-bold text-xs sm:text-sm cursor-pointer transition-transform active:scale-95 shadow-xs flex items-center justify-center gap-2"
            >
              <Droplets className="w-4 h-4 fill-white shrink-0" />
              <span>Siram {totalDue} Aksara Jatuh Tempo</span>
            </button>
          )}
        </div>
      </div>

      {/* Metric Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        <div 
          className="p-3 sm:p-4.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 transition-transform hover:-translate-y-0.5 overflow-hidden min-w-0 flex flex-col justify-between min-h-[120px] sm:min-h-[136px]"
          style={{ boxShadow: '0 4px 14px -2px rgba(225, 29, 72, 0.08)' }}
        >
          <span className="text-[10.5px] sm:text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider leading-tight min-h-[28px] sm:min-h-[32px] flex items-center">
            Jatuh Tempo Hari Ini
          </span>
          <div className="text-xl sm:text-2xl md:text-3xl font-black text-[#C0392B] dark:text-[#FB7185] my-1 flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="shrink-0 text-base sm:text-2xl">⏳</span>
            <span className="truncate">{totalDue}</span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug break-words">Aksara yang butuh ditinjau</span>
        </div>

        <div 
          className="p-3 sm:p-4.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 transition-transform hover:-translate-y-0.5 overflow-hidden min-w-0 flex flex-col justify-between min-h-[120px] sm:min-h-[136px]"
          style={{ boxShadow: '0 4px 14px -2px rgba(217, 119, 6, 0.08)' }}
        >
          <span className="text-[10.5px] sm:text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider leading-tight min-h-[28px] sm:min-h-[32px] flex items-center">
            Aksara Mekar (Mastered)
          </span>
          <div className="text-xl sm:text-2xl md:text-3xl font-black text-amber-700 dark:text-amber-400 my-1 flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="shrink-0 text-base sm:text-2xl">🌸</span>
            <span className="truncate">{totalMastered}</span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug break-words">Telah mendarah daging</span>
        </div>

        <div 
          className="p-3 sm:p-4.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 transition-transform hover:-translate-y-0.5 overflow-hidden min-w-0 flex flex-col justify-between min-h-[120px] sm:min-h-[136px]"
          style={{ boxShadow: '0 4px 14px -2px rgba(5, 150, 105, 0.08)' }}
        >
          <span className="text-[10.5px] sm:text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider leading-tight min-h-[28px] sm:min-h-[32px] flex items-center">
            Kamus Bank Kosakata
          </span>
          <div className="text-xl sm:text-2xl md:text-3xl font-black text-emerald-800 dark:text-emerald-400 my-1 flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="shrink-0 text-base sm:text-2xl">📚</span>
            <span className="truncate tracking-tight">{totalWords.toLocaleString()}</span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug break-words">Standar HSK 3.0 (Pos 1–6)</span>
        </div>

        <div 
          className="p-3 sm:p-4.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 transition-transform hover:-translate-y-0.5 overflow-hidden min-w-0 flex flex-col justify-between min-h-[120px] sm:min-h-[136px]"
          style={{ boxShadow: '0 4px 14px -2px rgba(79, 70, 229, 0.08)' }}
        >
          <span className="text-[10.5px] sm:text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider leading-tight min-h-[28px] sm:min-h-[32px] flex items-center">
            Tingkat Penguasaan
          </span>
          <div className="text-xl sm:text-2xl md:text-3xl font-black text-indigo-800 dark:text-indigo-400 my-1 flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="shrink-0 text-base sm:text-2xl">🎯</span>
            <span className="truncate">{totalWords > 0 ? Math.round((totalMastered / totalWords) * 100) : 0}%</span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug break-words">Persentase keseluruhan</span>
        </div>
      </div>

      {/* Selected Hanzi Preview Banner */}
      {selectedWord && (
        <div 
          className="p-5 bg-[#FAF9F6] dark:bg-[#151E32] border border-zinc-300 dark:border-[#24324E] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-200"
          style={{ boxShadow: '0 8px 24px -4px rgba(35, 31, 32, 0.08), 0 2px 6px -1px rgba(35, 31, 32, 0.04)' }}
        >
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                clickTick(sound);
                speakHanzi(selectedWord.hanzi);
              }}
              className="w-16 h-16 rounded-2xl bg-white dark:bg-[#1C2742] border-2 border-amber-300 dark:border-amber-700/60 flex items-center justify-center font-serif text-3xl font-black text-[#C0392B] dark:text-[#FB7185] hover:bg-amber-50 dark:hover:bg-[#253252] cursor-pointer shadow-xs shrink-0"
              title="Dengarkan pengucapan"
            >
              {selectedWord.hanzi}
            </button>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-lg font-bold text-indigo-700 dark:text-indigo-400">
                  {selectedWord.pinyin}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-xs font-bold">
                  Pos {selectedWord.level} (HSK {selectedWord.level})
                </span>
                <button
                  type="button"
                  onClick={() => speakHanzi(selectedWord.hanzi)}
                  className="text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm cursor-pointer"
                >
                  🔊
                </button>
              </div>
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-1">
                {meaningOf(selectedWord)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onStartSession && (
              <button
                type="button"
                onClick={() => {
                  clickTick(sound);
                  onStartSession(parseInt(selectedWord.level, 10) || 1);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Latih Pos {selectedWord.level}
              </button>
            )}
            <button
              type="button"
              onClick={() => setSelectedWord(null)}
              className="px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-[#24324E] bg-white dark:bg-[#1C2742] hover:bg-zinc-100 dark:hover:bg-[#253252] text-zinc-700 dark:text-zinc-200 font-bold text-xs cursor-pointer"
            >
              Tutup Info
            </button>
          </div>
        </div>
      )}

      {/* Petak Bunga Aksara (The Blooming Garden Interactive Bed) */}
      <div 
        className="bg-[#FFFDF9] dark:bg-[#151E32] border border-zinc-300 dark:border-[#24324E] rounded-3xl p-6 sm:p-8 space-y-5"
        style={{ boxShadow: '0 10px 28px -4px rgba(35, 31, 32, 0.08), 0 2px 6px -1px rgba(35, 31, 32, 0.03)' }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-[#24324E]">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#231F20] dark:text-zinc-100 flex items-center gap-2">
              <span>🌸</span> Petak Bunga Aksara ({filteredFlowers.length} Mekar)
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Klik bunga untuk mendengarkan lafal pinyin dan melihat artinya.
            </p>
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari aksara, pinyin, arti..."
              className="w-full px-3.5 py-2 rounded-xl border-2 border-zinc-300 dark:border-[#24324E] bg-white dark:bg-[#0B111E] text-zinc-900 dark:text-zinc-100 text-xs font-semibold focus:outline-hidden focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mr-1">Filter Pos:</span>
          {(['all', 1, 2, 3, 4, 5, 6] as const).map((lvl) => (
            <button
              key={String(lvl)}
              type="button"
              onClick={() => {
                clickTick(sound);
                setActiveLevelFilter(lvl);
              }}
              className={`px-3 py-1.5 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${
                activeLevelFilter === lvl
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                  : 'bg-white dark:bg-[#1C2742] text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-[#24324E] hover:border-zinc-300 dark:hover:border-zinc-500'
              }`}
            >
              {lvl === 'all' ? 'Semua Pos' : `Pos ${lvl}`}
            </button>
          ))}
        </div>

        {/* Flowerbed Tiles */}
        <div className="min-h-[220px] max-h-[380px] overflow-y-auto p-4 bg-[#FBF9F5] dark:bg-[#0B111E] border-2 border-dashed border-zinc-300 dark:border-[#24324E] rounded-2xl flex flex-wrap gap-2.5 content-start">
          {filteredFlowers.length === 0 ? (
            <div className="w-full py-12 text-center text-zinc-400 text-sm italic">
              Tidak ada bunga aksara mekar yang sesuai kriteria pencarian.
            </div>
          ) : (
            filteredFlowers.map((w) => {
              const isSelected = selectedWord?.id === w.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => {
                    setSelectedWord(w);
                    speakHanzi(w.hanzi);
                    clickTick(sound);
                  }}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 dark:border-amber-600 scale-105 shadow-md'
                      : 'bg-white dark:bg-[#151E32] border-zinc-200 dark:border-[#24324E] hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 shadow-xs'
                  }`}
                >
                  <span className="text-base">🌸</span>
                  <span className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-none">
                    {w.hanzi}
                  </span>
                  <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                    {w.pinyin}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Progress per HSK Outpost 1 - 6 */}
      <div 
        className="bg-[#FFFDF9] dark:bg-[#151E32] border border-zinc-300 dark:border-[#24324E] rounded-3xl p-6 sm:p-8 space-y-5"
        style={{ boxShadow: '0 10px 28px -4px rgba(35, 31, 32, 0.08), 0 2px 6px -1px rgba(35, 31, 32, 0.03)' }}
      >
        <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-[#24324E]">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#231F20] dark:text-zinc-100 flex items-center gap-2">
              <span>🚩</span> Penguasaan Pos Petualangan HSK 1 — 6
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Progres kemajuan hafalan tiap pos dari Gerbang Desa hingga Pagoda Puncak.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { lvl: 1, name: 'Gerbang Desa', icon: '⛩️' },
            { lvl: 2, name: 'Jembatan Bambu', icon: '🎋' },
            { lvl: 3, name: 'Paviliun Teh', icon: '🍵' },
            { lvl: 4, name: 'Menara Lentera', icon: '🏮' },
            { lvl: 5, name: 'Gunung Berkabut', icon: '⛰️' },
            { lvl: 6, name: 'Pagoda Puncak', icon: '🏯' },
          ].map(({ lvl, name, icon }) => {
            const stat = outpostStats[lvl] || { total: 0, due: 0, mastered: 0 };
            const masteredInLvl = masteredWords.filter((w) => parseInt(w.level, 10) === lvl).length;
            const totalForLvl = stat.total > 0 ? stat.total : 150;
            const pct = Math.min(100, Math.round((masteredInLvl / totalForLvl) * 100));

            return (
              <div
                key={lvl}
                className="p-4 bg-white dark:bg-[#1C2742] border border-zinc-200 dark:border-[#2D3D60] rounded-2xl space-y-3 transition-transform hover:-translate-y-0.5"
                style={{ boxShadow: '0 4px 12px -2px rgba(15, 23, 42, 0.05)' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{icon}</span>
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Pos {lvl}: {name}</h4>
                      <span className="text-[11px] text-zinc-400 font-medium">HSK 3.0 Level {lvl}</span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    {pct}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700">
                  <div
                    className="h-full transition-all duration-500 rounded-full"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: pct >= 80 ? '#059669' : pct >= 40 ? '#D97706' : '#DC2626',
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {masteredInLvl} / {totalForLvl} aksara
                  </span>
                  {onStartSession && (
                    <button
                      type="button"
                      onClick={() => {
                        clickTick(sound);
                        onStartSession(lvl);
                      }}
                      className="font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 hover:underline cursor-pointer"
                    >
                      Buka Pos →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

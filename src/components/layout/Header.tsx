import { useState, useEffect } from 'react';
import { Moon, Sun, Search, Globe, Menu, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import type { NavTab } from '@/types';
import { getCurrentLanguage, setLanguage, subscribeLanguageChange, Language } from '@/services/localizationService';
import { clickTick } from '@/lib/fx';

interface HeaderProps {
  activeTab: NavTab;
  theme: 'dark' | 'light' | 'system';
  toggleTheme: () => void;
  onOpenGlobalSearch?: () => void;
  onOpenMobileMenu?: () => void;
}

const tabTitles: Record<NavTab, { title: string; subtitle: string; domain: string }> = {
  dashboard: { title: 'Beranda Mandarin', subtitle: 'Peta Petualangan HSK & statistik belajar.', domain: 'Utama' },
  drill: { title: 'Drill Aksara & Nada', subtitle: 'Latih diskriminasi nada, radikal, dan bentuk visual mirip.', domain: 'Latihan' },
  leech: { title: 'Karantina Kata Bandel', subtitle: 'Jebak kata yang sering salah dan tambahkan mnemonik.', domain: 'Evaluasi' },
  garden: { title: 'Kebun Aksara', subtitle: 'Setiap aksara yang dikuasai mekar menjadi bunga Meihua.', domain: 'Progres' },
  vocab: { title: 'Gudang Kosakata', subtitle: 'Pencarian & urutan goresan resmi 11.073 kata HSK.', domain: 'Kamus' },
  session: { title: 'Sesi Belajar HSK', subtitle: 'Petualangan pos belajar bertingkat dengan spaced repetition.', domain: 'Belajar' },
  chinese_learning: { title: 'Belajar Mandarin · 中文', subtitle: 'HSK, Hanzi, Listening & Program Harian.', domain: 'Bahasa' },
  ai_assistant: { title: 'Asisten AI', subtitle: 'Tanya apa saja — belajar, 语法, 翻译.', domain: 'Kecerdasan' },
  settings: { title: 'Pengaturan', subtitle: 'Tampilan, TTS, backup & sinkronisasi cloud.', domain: 'Sistem' },
};

export function Header({ activeTab, theme, toggleTheme, onOpenGlobalSearch, onOpenMobileMenu }: HeaderProps) {
  const info = tabTitles[activeTab] || tabTitles.dashboard;
  const todayStr = format(new Date(), 'EEEE, d MMMM yyyy').toUpperCase();
  const [lang, setLangState] = useState<Language>(getCurrentLanguage());
  const [soundOn, setSoundOn] = useState(() => localStorage.getItem('omnilife_sound_enabled') !== 'false');
  const [arcadeMode, setArcadeMode] = useState(() => localStorage.getItem('omnilife_arcade_mode') === 'true');

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    localStorage.setItem('omnilife_sound_enabled', String(next));
    clickTick(next);
  };

  const toggleArcade = () => {
    const next = !arcadeMode;
    setArcadeMode(next);
    localStorage.setItem('omnilife_arcade_mode', String(next));
    clickTick(soundOn);
    window.dispatchEvent(new CustomEvent('omnilife_arcade_toggled', { detail: { arcade: next } }));
  };

  useEffect(() => {
    return subscribeLanguageChange((newLang) => setLangState(newLang));
  }, []);

  const toggleLanguage = () => {
    const nextLang: Language = lang === 'en' ? 'id' : 'en';
    setLanguage(nextLang);
  };

  return (
    <header className="min-h-14 h-[calc(3.5rem+env(safe-area-inset-top,0px))] pt-[env(safe-area-inset-top,0px)] px-3 sm:px-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-between gap-3 shrink-0 select-none z-30 transition-colors">
      {/* Kiri: stamp indeks + judul */}
      <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1 mr-2 sm:mr-0">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 -ml-1 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer shrink-0"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Chinese Chop Seal Badge */}
          <div className="chop shrink-0 select-none shadow-sm" title="OmniLife Mandarin · 汉字探索">
            字
          </div>
          <div className="flex flex-col min-w-0 leading-tight flex-1">
            <h1 className="font-display text-[16px] sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight truncate">
              {info.title}
            </h1>
            <p className="hidden sm:block text-[11px] text-zinc-400 dark:text-zinc-500 truncate">
              {info.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Kanan: utilitas */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Global Search Trigger */}
        {onOpenGlobalSearch && (
          <>
            <button
              onClick={onOpenGlobalSearch}
              className="hidden sm:flex items-center gap-2 px-2.5 h-8 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors cursor-pointer group"
              title="Open Global Search (Ctrl + K)"
            >
              <Search className="w-3.5 h-3.5 group-hover:text-blue-500 transition-colors" />
              <span>Cari modul &amp; data…</span>
              <kbd className="px-1.5 py-0.5 text-[10px] rounded-md bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 font-mono border border-zinc-200 dark:border-zinc-700">
                Ctrl K
              </kbd>
            </button>

            <button
              onClick={onOpenGlobalSearch}
              className="sm:hidden p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Language Switch (ID / EN) */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1 px-2 h-8 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-600 active:scale-95 transition-all cursor-pointer"
          title={`Switch Language (Current: ${lang.toUpperCase()})`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="text-[11px] font-mono font-semibold tracking-wide">{lang.toUpperCase()}</span>
        </button>

        {/* Date — stamp mono, desktop saja */}
        <div className="hidden lg:flex items-center h-8 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
          <span className="text-[10px] font-mono font-medium tracking-[0.1em] text-zinc-500 dark:text-zinc-400 uppercase">
            {todayStr}
          </span>
        </div>

        {/* Sound Toggle (Tactile Audio FX) */}
        <button
          onClick={toggleSound}
          title={soundOn ? 'Efek Suara Aktif (Klik untuk matikan)' : 'Efek Suara Bisu (Klik untuk aktifkan)'}
          aria-label="Toggle sound"
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-600 active:scale-95 transition-all cursor-pointer"
        >
          {soundOn ? <Volume2 className="w-4 h-4 text-rose-500" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Arcade Mode Toggle */}
        <button
          onClick={toggleArcade}
          title={arcadeMode ? 'Mode Arkade Aktif (Penuh energi & animasi)' : 'Mode Tenang (Santai & fokus)'}
          aria-label="Toggle arcade mode"
          className={`flex items-center gap-1 px-2 h-8 rounded-lg border transition-all cursor-pointer ${
            arcadeMode
              ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700 font-bold'
              : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${arcadeMode ? 'text-amber-600 dark:text-amber-400' : ''}`} />
          <span className="hidden sm:inline text-[11px] font-mono font-semibold">
            {arcadeMode ? 'ARKADE' : 'TENANG'}
          </span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle theme"
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-600 active:scale-95 transition-all cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}

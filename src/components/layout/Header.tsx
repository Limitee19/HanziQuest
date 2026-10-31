import { useState, useEffect } from 'react';
import { Moon, Sun, Search, Globe, Menu, Users, LogOut } from 'lucide-react';
import { format } from 'date-fns';
import type { NavTab } from '@/types';
import { getCurrentLanguage, setLanguage, subscribeLanguageChange, Language } from '@/services/localizationService';
import { clickTick } from '@/lib/fx';
import { getActiveUser, logoutUser, onAuthStateChange, StudentUser } from '@/services/auth/classAuthService';
import { ClassManagementModal } from '@/components/auth/ClassManagementModal';
import { CustomAvatar } from '@/components/common/CustomAvatar';
import { LogoutConfirmModal } from '@/components/auth/LogoutConfirmModal';

interface HeaderProps {
  activeTab: NavTab;
  theme: 'dark' | 'light' | 'system';
  toggleTheme: () => void;
  onOpenGlobalSearch?: () => void;
  onOpenMobileMenu?: () => void;
}

const tabTitles: Record<NavTab, { title: string; subtitle: string; domain: string }> = {
  dashboard: { title: 'Beranda Mandarin', subtitle: 'Peta Petualangan HSK Dan statistik belajar.', domain: 'Utama' },
  drill: { title: 'Drill Aksara Dan Nada', subtitle: 'Latih diskriminasi nada, radikal, dan bentuk visual mirip.', domain: 'Latihan' },
  leech: { title: 'Karantina Kata Bandel', subtitle: 'Jebak kata yang sering salah dan tambahkan mnemonik.', domain: 'Evaluasi' },
  garden: { title: 'Kebun Aksara', subtitle: 'Setiap aksara yang dikuasai mekar menjadi bunga Meihua.', domain: 'Progres' },
  vocab: { title: 'Gudang Kosakata', subtitle: 'Pencarian Dan urutan goresan resmi 11.073 kata HSK.', domain: 'Kamus' },
  session: { title: 'Sesi Belajar HSK', subtitle: 'Petualangan pos belajar bertingkat dengan spaced repetition.', domain: 'Belajar' },
  chinese_learning: { title: 'Belajar Mandarin · 中文', subtitle: 'HSK, Hanzi, Listening Dan Program Harian.', domain: 'Bahasa' },
  ai_assistant: { title: 'Asisten AI', subtitle: 'Tanya apa saja — belajar, 语法, 翻译.', domain: 'Kecerdasan' },
  settings: { title: 'Pengaturan', subtitle: 'Tampilan, TTS, backup Dan sinkronisasi cloud.', domain: 'Sistem' },
};

export function Header({ activeTab, theme, toggleTheme, onOpenGlobalSearch, onOpenMobileMenu }: HeaderProps) {
  const info = tabTitles[activeTab] || tabTitles.dashboard;
  const todayStr = format(new Date(), 'EEEE, d MMMM yyyy').toUpperCase();
  const [lang, setLangState] = useState<Language>(getCurrentLanguage());
  const [soundOn] = useState(() => localStorage.getItem('omnilife_sound_enabled') !== 'false');

  const [currentUser, setCurrentUser] = useState<StudentUser | null>(() => getActiveUser());
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    return onAuthStateChange((u) => setCurrentUser(u));
  }, []);

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
              <span>Cari modul Dan data…</span>
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

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle theme"
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-600 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Separator */}
        <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-700 mx-0.5 hidden sm:block" />

        {/* Admin: Kelola Siswa Button */}
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => {
              clickTick(soundOn);
              setIsClassModalOpen(true);
            }}
            className="flex items-center justify-center gap-1.5 px-2 md:px-2.5 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 active:scale-95 transition-all cursor-pointer text-xs font-bold shadow-2xs shrink-0"
            title="Buka Panel Manajemen Siswa Dan Kelas"
          >
            <Users className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden md:inline">Kelola Siswa</span>
          </button>
        )}

        {/* User Profile Chip Dan Logout */}
        {currentUser && (
          <div className="flex items-center gap-1 pl-0.5 sm:pl-1 shrink-0">
            <div
              className="flex items-center gap-1.5 px-2 sm:px-2.5 h-8 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200"
              title={`Login sebagai @${currentUser.username} (${currentUser.role === 'admin' ? 'Guru' : 'Siswa'}: ${currentUser.displayName})`}
            >
              <CustomAvatar
                id={currentUser.avatar || (currentUser.role === 'admin' ? 'avatar_master' : 'avatar_panda')}
                size="xs"
                className="w-5 h-5 shrink-0 rounded-md"
              />
              <span className="hidden sm:inline max-w-[90px] md:max-w-[120px] truncate">{currentUser.nickname || currentUser.displayName}</span>
            </div>

            <button
              onClick={() => {
                clickTick(soundOn);
                setIsLogoutModalOpen(true);
              }}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-900 active:scale-95 transition-all cursor-pointer shrink-0"
              title="Keluar / Ganti Akun Siswa"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Teacher Class Management Modal */}
      <ClassManagementModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          setIsLogoutModalOpen(false);
          logoutUser();
        }}
        user={currentUser}
      />
    </header>
  );
}

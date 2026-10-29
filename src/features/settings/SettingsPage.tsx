import { useEffect, useState } from 'react';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Music,
  Trash2,
  Bell,
  Sparkles,
  CheckCircle2,
  User,
  KeyRound,
  Smile,
  ShieldCheck,
  Check,
  AlertCircle,
  LogOut,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { isQuizSfxEnabled, setQuizSfxEnabled } from '@/services/chinese/sfxSettings';
import { getTtsCacheInfo, clearTtsCache, TtsCacheInfo } from '@/services/chinese/passiveLearningService';
import { getActiveUser, updateUserProfile, logoutUser, StudentUser } from '@/services/auth/classAuthService';
import { clickTick, playSuccessChime, playErrorBuzz } from '@/lib/fx';
import { NotificationSettingsModal } from './NotificationSettingsModal';
import { CustomAvatar, AVATAR_COLLECTION } from '@/components/common/CustomAvatar';
import { LogoutConfirmModal } from '@/components/auth/LogoutConfirmModal';

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [isNotifSettingsOpen, setIsNotifSettingsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [quizSfxOn, setQuizSfxOn] = useState<boolean>(() => isQuizSfxEnabled());

  // Profil & Akun states
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(() => getActiveUser());
  const [nicknameInput, setNicknameInput] = useState(() => currentUser?.nickname || '');
  const [displayNameInput, setDisplayNameInput] = useState(() => currentUser?.displayName || '');
  const [usernameInput, setUsernameInput] = useState(() => currentUser?.username || '');
  const [pinInput, setPinInput] = useState('');
  const [avatarChoice, setAvatarChoice] = useState(() => currentUser?.avatar || (currentUser?.role === 'admin' ? 'avatar_master' : 'avatar_panda'));
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Cache audio TTS (belajar pasif) — ukuran + tombol hapus
  const [ttsInfo, setTtsInfo] = useState<TtsCacheInfo | null>(null);
  const [ttsBusy, setTtsBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    getTtsCacheInfo().then((info) => {
      if (alive) setTtsInfo(info);
    });
    return () => {
      alive = false;
    };
  }, []);

  const formatBytes = (b: number): string => {
    if (!b || b <= 0) return '0 KB';
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
    return `${(b / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleClearTtsCache = async () => {
    setTtsBusy(true);
    try {
      const info = await clearTtsCache();
      setTtsInfo(info);
    } finally {
      setTtsBusy(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    clickTick(true);
    setProfileFeedback(null);
    setProfileSaving(true);

    try {
      const res = await updateUserProfile({
        nickname: nicknameInput,
        displayName: displayNameInput,
        username: usernameInput,
        pin: pinInput || undefined,
        avatar: avatarChoice,
      });

      if (res.success && res.user) {
        playSuccessChime(true);
        setCurrentUser(res.user);
        setPinInput('');
        setProfileFeedback({
          type: 'success',
          msg: 'Profil & nama panggilan berhasil diperbarui!',
        });
      } else {
        playErrorBuzz(true);
        setProfileFeedback({
          type: 'error',
          msg: res.error || 'Gagal memperbarui profil.',
        });
      }
    } catch {
      playErrorBuzz(true);
      setProfileFeedback({
        type: 'error',
        msg: 'Terjadi kendala saat menyimpan profil.',
      });
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
              <SettingsIcon className="w-5 h-5" />
            </span>
            Pengaturan Aplikasi Mandarin
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Sesuaikan mode tampilan tema visual, efek suara latihan aksara, notifikasi pengingat, dan cache audio offline.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Profile & Account Identity Settings */}
        <Card className="p-6 rounded-3xl border-2 border-zinc-200 dark:border-zinc-800 bg-[#FFFDF9] dark:bg-[#151E32] shadow-sm">
          <CardHeader className="p-0 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-serif">
                  <User className="w-4 h-4 text-rose-500" />
                  Profil &amp; Identitas Pengguna
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Atur nama panggilan sapaan, identitas akun, avatar emoji, dan ganti PIN login Anda
                </CardDescription>
              </div>

              {currentUser && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-center shrink-0 bg-white dark:bg-[#0B111E] border-zinc-200 dark:border-zinc-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1"></span>
                  <span>{currentUser.role === 'admin' ? 'Guru / Master Admin' : currentUser.role === 'guest' ? 'Akun Tamu (Offline)' : 'Siswa Kelas'}</span>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0 pt-2 space-y-4">
            {/* Feedback Alert */}
            {profileFeedback && (
              <div
                className={`p-3 rounded-2xl border text-xs flex items-center gap-2.5 animate-in fade-in duration-200 ${
                  profileFeedback.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                }`}
              >
                {profileFeedback.type === 'success' ? (
                  <Check className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                )}
                <span className="font-semibold">{profileFeedback.msg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Avatar Selector Gallery */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Smile className="w-3.5 h-3.5 text-amber-500" />
                    <span>Pilih Karakter Avatar Petualang</span>
                  </span>
                  <span className="text-[11px] text-zinc-400 font-normal">
                    Ilustrasi oriental eksklusif (bukan emoji bawaan)
                  </span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {AVATAR_COLLECTION.map((av) => {
                    const isSelected = avatarChoice === av.id;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => {
                          clickTick(true);
                          setAvatarChoice(av.id);
                        }}
                        className={`p-2.5 rounded-2xl border-2 transition-all cursor-pointer text-left flex items-center gap-2.5 relative group ${
                          isSelected
                            ? 'bg-rose-50/80 dark:bg-rose-950/60 border-[#C0392B] ring-2 ring-rose-300 dark:ring-rose-800 shadow-md'
                            : 'bg-white dark:bg-[#0B111E] border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700'
                        }`}
                      >
                        <CustomAvatar id={av.id} size="sm" className="shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block truncate">
                            {av.name}
                          </span>
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block truncate">
                            {av.title}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grid Form Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. Nama Panggilan (Nickname untuk Sapaan Dashboard) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Nama Panggilan (Sapaan Dashboard)</span>
                  </label>
                  <input
                    type="text"
                    value={nicknameInput}
                    onChange={(e) => setNicknameInput(e.target.value)}
                    placeholder="misal: Xiao Long, Budi, atau Lin"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0B111E] border border-zinc-200 dark:border-[#24324E] text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#C0392B]"
                  />
                  <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400">
                    Digunakan untuk menyapa ramah di Dashboard ("Selamat Pagi, Xiao Long!").
                  </p>
                </div>

                {/* 2. Nama Lengkap / Tampilan */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Nama Lengkap Siswa</span>
                  </label>
                  <input
                    type="text"
                    value={displayNameInput}
                    onChange={(e) => setDisplayNameInput(e.target.value)}
                    placeholder="Nama lengkap di rapor/kelas"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0B111E] border border-zinc-200 dark:border-[#24324E] text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#C0392B]"
                  />
                  <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400">
                    Nama resmi siswa yang terdaftar di sistem kelas.
                  </p>
                </div>

                {/* 3. Username Login */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Username Login</span>
                  </label>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    disabled={currentUser?.role === 'guest'}
                    placeholder="Username login"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0B111E] border border-zinc-200 dark:border-[#24324E] text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#C0392B] disabled:opacity-60"
                  />
                  <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400">
                    {currentUser?.role === 'guest'
                      ? 'Username mode tamu bersifat otomatis.'
                      : 'Digunakan bersama PIN saat masuk ke aplikasi.'}
                  </p>
                </div>

                {/* 4. PIN Baru */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-rose-500" />
                    <span>Ganti PIN Rahasia</span>
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={8}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    disabled={currentUser?.role === 'guest'}
                    placeholder={currentUser?.role === 'guest' ? 'Tidak perlu PIN di mode tamu' : 'Kosongkan jika tidak ingin ganti PIN'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0B111E] border border-zinc-200 dark:border-[#24324E] text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#C0392B] disabled:opacity-60"
                  />
                  <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400">
                    Minimal 4 digit angka rahasia baru.
                  </p>
                </div>
              </div>

              {/* Submit Button & Switch Account */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-zinc-200 dark:border-zinc-800">
                <Button
                  type="submit"
                  disabled={profileSaving}
                  className="bg-[#C0392B] hover:bg-[#A93226] text-white font-bold text-xs py-2.5 px-5 rounded-xl cursor-pointer"
                >
                  {profileSaving ? 'Menyimpan Profil…' : 'Simpan Perubahan Profil'}
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    clickTick(true);
                    setIsLogoutModalOpen(true);
                  }}
                  className="text-xs font-bold text-zinc-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 flex items-center justify-center gap-1.5 py-2 cursor-pointer transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar / Ganti Akun Lain</span>
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Appearance Settings with Rich Visual Previews */}
        <Card className="p-6 rounded-3xl border-2 border-zinc-200 dark:border-zinc-800 bg-[#FFFDF9] dark:bg-[#151E32] shadow-sm">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-serif">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Tema & Tampilan Visual
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
              Pilih atmosfer antarmuka: Kertas Oriental Hangat (Terang) atau Tinta Langit Malam (Gelap)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Light Mode Card */}
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-left flex flex-col gap-3 relative group ${
                  theme === 'light'
                    ? 'border-[#C0392B] bg-linear-to-b from-rose-50/70 to-amber-50/50 shadow-md ring-2 ring-rose-200'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-[#0F1626]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm text-zinc-900 dark:text-zinc-200">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>Mode Terang (Eastern Parchment)</span>
                  </div>
                  {theme === 'light' && (
                    <CheckCircle2 className="w-5 h-5 text-[#C0392B] shrink-0" />
                  )}
                </div>

                {/* Visual Mini Preview */}
                <div className="w-full h-20 rounded-xl bg-[#FAF9F6] border border-zinc-200 p-2.5 flex flex-col justify-between overflow-hidden shadow-inner">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-md bg-[#C0392B] flex items-center justify-center text-[9px] text-white font-bold">字</div>
                    <div className="h-2 w-16 bg-zinc-300 rounded" />
                  </div>
                  <div className="flex gap-1.5">
                    <div className="h-6 flex-1 bg-white border border-zinc-200 rounded-lg flex items-center px-2 text-[10px] text-zinc-700 font-bold">你好</div>
                    <div className="h-6 w-12 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-center text-[10px] text-rose-700 font-bold">Drill</div>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Nuansa hangat kertas perkamen kaligrafi Tiongkok kuno dengan aksen merah cinnabar.
                </p>
              </button>

              {/* Dark Mode Card */}
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-left flex flex-col gap-3 relative group ${
                  theme === 'dark'
                    ? 'border-indigo-500 bg-linear-to-b from-indigo-950/40 to-slate-900/60 shadow-md ring-2 ring-indigo-500/30'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-[#0F1626]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    <Moon className="w-4 h-4 text-indigo-400" />
                    <span>Mode Gelap (Celestial Midnight)</span>
                  </div>
                  {theme === 'dark' && (
                    <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                  )}
                </div>

                {/* Visual Mini Preview */}
                <div className="w-full h-20 rounded-xl bg-[#090D16] border border-[#24324E] p-2.5 flex flex-col justify-between overflow-hidden shadow-inner">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-md bg-rose-500 flex items-center justify-center text-[9px] text-white font-bold">字</div>
                    <div className="h-2 w-16 bg-[#24324E] rounded" />
                  </div>
                  <div className="flex gap-1.5">
                    <div className="h-6 flex-1 bg-[#151E32] border border-[#24324E] rounded-lg flex items-center px-2 text-[10px] text-zinc-200 font-bold">你好</div>
                    <div className="h-6 w-12 bg-rose-950/50 border border-rose-800/60 rounded-lg flex items-center justify-center text-[10px] text-rose-300 font-bold">Drill</div>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Nuansa malam tinta temaram yang elegan, nyaman di mata saat belajar malam hari.
                </p>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Chinese Learning — Efek Suara Kuis */}
        <Card className="p-5 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-[#FFFDF9] dark:bg-[#151E32]">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
              {quizSfxOn ? (
                <Volume2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <VolumeX className="w-4 h-4 text-zinc-400 shrink-0" />
              )}
              Efek Suara Kuis & Latihan Hanzi
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
              Bunyi notifikasi benar/salah, suara klik aksara, dan fanfare kemenangan
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-1 text-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="font-semibold block text-zinc-900 dark:text-zinc-100">Audio Efek Suara (SFX)</span>
                <span className="text-zinc-500 dark:text-zinc-400 text-[11.5px]">
                  {quizSfxOn
                    ? 'Aktif — nada instrumen tradisional benar/salah dan tepuk tangan dibunyikan'
                    : 'Mati — latihan berjalan hening (pelafalan audio aksara tetap dapat diputar)'}
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={quizSfxOn}
                onClick={() => {
                  const next = !quizSfxOn;
                  setQuizSfxOn(next);
                  setQuizSfxEnabled(next);
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                  quizSfxOn ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    quizSfxOn ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Notifications & App Lock PIN */}
        <Card className="p-5 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-[#FFFDF9] dark:bg-[#151E32]">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
              <Bell className="w-4 h-4 text-indigo-500 shrink-0" />
              Pengaturan Notifikasi & Jadwal Belajar
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
              Pengingat jadwal latihan harian, jatuh tempo kartu SRS, dan proteksi PIN
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-1 text-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="font-semibold block text-zinc-900 dark:text-zinc-100">Pengingat Harian & Keamanan PIN</span>
                <span className="text-zinc-500 dark:text-zinc-400 text-[11.5px]">Atur jam pengingat harian dan PIN sandi aplikasi</span>
              </div>
              <Button
                size="sm"
                onClick={() => setIsNotifSettingsOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold w-full sm:w-auto text-xs cursor-pointer truncate"
              >
                Atur Notifikasi & PIN
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cache Audio TTS (Belajar Pasif) */}
        <Card className="p-5 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-[#FFFDF9] dark:bg-[#151E32]">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
              <Music className="w-4 h-4 text-fuchsia-500 shrink-0" />
              Cache Suara & Audio Offline
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
              Audio pelafalan hanzi & arti bahasa Indonesia — tersimpan lokal agar dapat diputar lancar tanpa internet
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-1 space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="font-semibold block text-zinc-900 dark:text-zinc-100">Kapasitas Audio Tersimpan</span>
                <span className="text-zinc-500 dark:text-zinc-400 text-[11.5px]">
                  {ttsInfo
                    ? `${ttsInfo.entries} file audio (${formatBytes(ttsInfo.bytes)})${ttsInfo.diskAvailable ? ` · disk ${formatBytes(ttsInfo.diskBytes)}` : ''}`
                    : 'Menghitung ukuran cache…'}
                </span>
              </div>
              <Button
                size="sm"
                onClick={handleClearTtsCache}
                disabled={ttsBusy || !ttsInfo}
                className="bg-rose-600 hover:bg-rose-700 text-white w-full sm:w-auto text-xs cursor-pointer truncate shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                {ttsBusy ? 'Menghapus…' : 'Bersihkan Cache Audio'}
              </Button>
            </div>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
              Membersihkan cache tidak akan menghapus progres belajar Anda — suara akan otomatis di-cache kembali saat kartu diputar.
            </p>
          </CardContent>
        </Card>
      </div>

      <NotificationSettingsModal
        isOpen={isNotifSettingsOpen}
        onClose={() => setIsNotifSettingsOpen(false)}
      />

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          setIsLogoutModalOpen(false);
          logoutUser();
        }}
        user={currentUser}
      />
    </div>
  );
}


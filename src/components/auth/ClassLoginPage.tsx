import React, { useState } from 'react';
import { Lock, User, LogIn, AlertCircle, Sparkles, BookOpen, Compass } from 'lucide-react';
import { loginUser, loginGuestUser } from '@/services/auth/classAuthService';
import { clickTick, playSuccessChime, playErrorBuzz } from '@/lib/fx';

interface ClassLoginPageProps {
  onLoginSuccess: () => void;
}

export const ClassLoginPage: React.FC<ClassLoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clickTick(true);
    setErrorMsg('');

    if (!username.trim()) {
      setErrorMsg('Masukkan username atau nomor absen Anda.');
      return;
    }
    if (!pin.trim()) {
      setErrorMsg('Masukkan PIN Anda.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginUser(username, pin);
      if (res.success) {
        playSuccessChime(true);
        onLoginSuccess();
      } else {
        playErrorBuzz(true);
        setErrorMsg(res.error || 'Username atau PIN salah.');
      }
    } catch {
      playErrorBuzz(true);
      setErrorMsg('Terjadi kendala saat login. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    clickTick(true);
    playSuccessChime(true);
    loginGuestUser();
    onLoginSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAF9F6] dark:bg-[#090D16] text-[#0F172A] dark:text-[#F8FAFC] p-4 sm:p-6 overflow-y-auto select-none font-sans">
      {/* Background Decorative Seals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5 dark:opacity-10">
        <div className="absolute -top-12 -left-12 font-serif text-[180px] font-black text-[#C0392B]">
          学
        </div>
        <div className="absolute -bottom-16 -right-12 font-serif text-[220px] font-black text-[#C0392B]">
          汉
        </div>
      </div>

      <div className="relative w-full max-w-md bg-[#FFFDF9] dark:bg-[#151E32] border-2 border-zinc-200 dark:border-[#24324E] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-300">
        {/* Header Seal & Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center">
            <div
              className="chop shadow-xl transition-transform hover:scale-105"
              style={{
                width: 64,
                height: 64,
                fontSize: 36,
                boxShadow: '0 12px 30px rgba(192, 57, 43, 0.35)',
              }}
            >
              字
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Portal Kelas Mandarin</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#231F20] dark:text-zinc-100 tracking-tight">
              Hanzi Quest · 汉字探索
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Masuk untuk melanjutkan petualangan dan merawat kebun aksaramu.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span className="font-medium leading-snug">{errorMsg}</span>
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <span>Username / No. Absen</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="misal: budi atau absen01"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-[#0B111E] border border-zinc-200 dark:border-[#24324E] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#C0392B] dark:focus:ring-rose-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-zinc-400" />
              <span>PIN Rahasia (4-6 Angka)</span>
            </label>
            <div className="relative">
              <input
                type="password"
                inputMode="numeric"
                maxLength={8}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="• • • •"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-[#0B111E] border border-zinc-200 dark:border-[#24324E] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 text-base font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#C0392B] dark:focus:ring-rose-500 transition-all text-center"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#C0392B] hover:bg-[#A93226] text-white font-bold text-sm tracking-wide shadow-lg shadow-rose-900/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Memeriksa Akun…</span>
              </span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Masuk ke Kelas</span>
              </>
            )}
          </button>
        </form>

        {/* Divider Atau Mode Tamu */}
        <div className="relative flex py-1 items-center">
          <div className="grow border-t border-zinc-200 dark:border-zinc-800" />
          <span className="shrink mx-3 text-zinc-400 dark:text-zinc-500 text-[11px] uppercase font-bold tracking-wider">
            atau
          </span>
          <div className="grow border-t border-zinc-200 dark:border-zinc-800" />
        </div>

        {/* Guest Login Button */}
        <div>
          <button
            type="button"
            onClick={handleGuestLogin}
            className="w-full py-3 px-4 rounded-2xl bg-zinc-100 hover:bg-zinc-200/80 dark:bg-[#1E293B] dark:hover:bg-[#2A3B54] text-zinc-800 dark:text-zinc-100 font-bold text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer border border-zinc-200 dark:border-zinc-700 active:scale-98 shadow-xs"
          >
            <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Masuk sebagai Tamu (Mode Bebas)</span>
          </button>
          <p className="text-[10.5px] text-zinc-400 dark:text-zinc-500 text-center mt-1.5 leading-tight">
            Mode Tamu tidak menyimpan data ke cloud server &amp; tidak memakan database.
          </p>
        </div>

        {/* Notice: No Public Register */}
        <div className="pt-2 border-t border-zinc-200 dark:border-[#24324E]/80 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            <BookOpen className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Akun &amp; PIN resmi dibagikan oleh guru kelas.</span>
          </div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-relaxed">
            Tidak ada pendaftaran publik mandiri. Hubungi guru jika Anda belum menerima akun atau lupa PIN.
          </p>
        </div>
      </div>
    </div>
  );
};

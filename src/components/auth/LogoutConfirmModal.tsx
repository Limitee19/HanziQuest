import React from 'react';
import { LogOut, X } from 'lucide-react';
import { CustomAvatar } from '@/components/common/CustomAvatar';
import { StudentUser } from '@/services/auth/classAuthService';
import { clickTick } from '@/lib/fx';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: StudentUser | null;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  user,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FFFDF9] dark:bg-[#151E32] border-2 border-zinc-300 dark:border-[#24324E] rounded-3xl p-6 sm:p-7 shadow-2xl relative space-y-5 animate-in zoom-in-95 duration-200"
        style={{
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(192, 57, 43, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol Tutup Silang di Kanan Atas */}
        <button
          type="button"
          onClick={() => {
            clickTick(true);
            onClose();
          }}
          className="absolute top-5 right-5 w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#1C2742] hover:bg-zinc-100 dark:hover:bg-[#253252] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Modal */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-[#C0392B] dark:text-rose-400 flex items-center justify-center shrink-0 shadow-xs">
            <LogOut className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 font-mono">
              Konfirmasi Sesi Belajar
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 leading-tight">
              Keluar dari Akun?
            </h3>
          </div>
        </div>

        {/* Card Info Akun yang Sedang Aktif */}
        {user && (
          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-[#0B111E] border border-zinc-200 dark:border-[#24324E] flex items-center gap-3">
            <CustomAvatar id={user.avatar} size="sm" className="shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block truncate">
                {user.displayName} {user.nickname ? `(${user.nickname})` : ''}
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono block truncate">
                @{user.username} · {user.role === 'admin' ? 'Guru / Admin' : user.role === 'guest' ? 'Mode Tamu' : 'Siswa'}
              </span>
            </div>
          </div>
        )}

        {/* Pesan Keterangan */}
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Apakah Anda ingin mengakhiri sesi ini? Seluruh progres petualangan pos HSK, hafalan kebun aksara, dan catatan mnemonik Anda tersimpan dengan aman.
        </p>

        {/* Tombol Aksi */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              clickTick(true);
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl border border-zinc-300 dark:border-[#24324E] bg-white dark:bg-[#1C2742] hover:bg-zinc-100 dark:hover:bg-[#253252] text-zinc-700 dark:text-zinc-200 font-bold text-xs cursor-pointer transition-all active:scale-95 text-center"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={() => {
              clickTick(true);
              onConfirm();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white font-bold text-xs cursor-pointer shadow-md shadow-rose-950/20 transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Ya, Keluar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

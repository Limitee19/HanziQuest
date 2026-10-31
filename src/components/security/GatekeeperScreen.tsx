import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import {
  verifyAndUnlockGatekeeper,
  getGatekeeperPinLength,
} from '@/services/auth/gatekeeperService';
import { Lock, Delete, ShieldCheck } from 'lucide-react';

interface GatekeeperScreenProps {
  onUnlocked: () => void;
}

export const GatekeeperScreen: React.FC<GatekeeperScreenProps> = ({ onUnlocked }) => {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const pinLength = getGatekeeperPinLength();

  const handleVerify = useCallback(
    async (codeToVerify: string) => {
      setIsVerifying(true);
      setErrorMsg('');

      try {
        const result = await verifyAndUnlockGatekeeper(codeToVerify, rememberDevice);
        if (result.success) {
          onUnlocked();
        } else {
          setErrorMsg(result.message || 'PIN salah. Silakan coba lagi.');
          setPin('');
        }
      } catch (err: any) {
        setErrorMsg('Terjadi kesalahan verifikasi.');
        setPin('');
      } finally {
        setIsVerifying(false);
      }
    },
    [onUnlocked, rememberDevice]
  );

  const handleKeyPress = useCallback(
    (num: string) => {
      if (isVerifying) return;

      setPin((prev) => {
        if (prev.length >= pinLength) return prev;
        const next = prev + num;
        setErrorMsg('');

        if (next.length === pinLength) {
          // Trigger verify automatically once reached required length
          setTimeout(() => {
            handleVerify(next);
          }, 80);
        }
        return next;
      });
    },
    [pinLength, isVerifying, handleVerify]
  );

  const handleDelete = useCallback(() => {
    if (isVerifying) return;
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  }, [isVerifying]);

  const handleClear = useCallback(() => {
    if (isVerifying) return;
    setPin('');
    setErrorMsg('');
  }, [isVerifying]);

  // Physical keyboard listener (numpad + standard 0-9)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleDelete();
      } else if (e.key === 'Delete' || e.key === 'Escape') {
        e.preventDefault();
        handleClear();
      } else if (e.key === 'Enter' && pin.length >= 4) {
        e.preventDefault();
        handleVerify(pin);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress, handleDelete, handleClear, handleVerify, pin]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-radial from-[#151E32] to-[#090D16] text-white p-4 font-sans select-none overflow-y-auto">
      {/* Background Decorative Seals */}
      <div className="absolute top-8 left-8 text-rose-500/10 text-9xl font-serif pointer-events-none select-none">
        学
      </div>
      <div className="absolute bottom-8 right-8 text-rose-500/10 text-9xl font-serif pointer-events-none select-none">
        道
      </div>

      <Card className="w-full max-w-sm bg-[#0E1626]/90 border border-slate-800/80 shadow-2xl backdrop-blur-xl p-6 text-center space-y-6 relative overflow-hidden">
        {/* Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-[#E11D48] to-transparent" />

        {/* Seal Icon Dan Branding */}
        <div className="flex flex-col items-center space-y-3 pt-2">
          <div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E11D48] to-[#9F1239] border border-rose-400/40 flex items-center justify-center text-3xl font-serif font-black text-white shadow-lg shadow-rose-900/40 transition-transform hover:scale-105"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
          >
            字
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif tracking-tight text-slate-100 flex items-center justify-center gap-1.5">
              <span>OmniLife Mandarin</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Gerbang Akses Pribadi (Private Gate)</p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300 font-medium">
            <Lock className="w-3 h-3 text-rose-400" />
            <span>Masukkan PIN Anda</span>
          </div>
        </div>

        {/* PIN Dots Indicator */}
        <div className="flex items-center justify-center gap-3 py-1">
          {Array.from({ length: pinLength }).map((_, idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full border transition-all duration-200 ${
                pin.length > idx
                  ? 'bg-rose-500 border-rose-400 scale-125 shadow-md shadow-rose-500/60'
                  : 'bg-slate-800/80 border-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Error / Status Feedback */}
        {errorMsg ? (
          <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs font-semibold animate-shake">
            {errorMsg}
          </div>
        ) : (
          <p className="text-[11px] text-slate-400">
            Ketik di keyboard atau gunakan tombol angka di bawah
          </p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto text-lg font-bold">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              disabled={isVerifying}
              onClick={() => handleKeyPress(num)}
              className="w-16 h-14 rounded-xl bg-slate-800/70 hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center border border-slate-700/50 cursor-pointer mx-auto text-slate-100 font-serif active:border-rose-500/50"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            disabled={isVerifying}
            onClick={handleClear}
            className="w-16 h-14 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-xs font-semibold text-slate-400 transition-all flex items-center justify-center cursor-pointer mx-auto border border-slate-800/60"
          >
            Clear
          </button>
          <button
            type="button"
            disabled={isVerifying}
            onClick={() => handleKeyPress('0')}
            className="w-16 h-14 rounded-xl bg-slate-800/70 hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center border border-slate-700/50 cursor-pointer mx-auto text-slate-100 font-serif active:border-rose-500/50"
          >
            0
          </button>
          <button
            type="button"
            disabled={isVerifying}
            onClick={handleDelete}
            className="w-16 h-14 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 transition-all flex items-center justify-center cursor-pointer mx-auto border border-slate-800/60"
            title="Hapus"
          >
            <Delete className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Remember device checkbox */}
        <div className="pt-2 flex items-center justify-center">
          <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
            <input
              type="checkbox"
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.target.checked)}
              className="rounded border-slate-700 bg-slate-800 text-rose-500 focus:ring-rose-500/30 cursor-pointer"
            />
            <span>Ingat saya di perangkat ini</span>
          </label>
        </div>

        {/* Security watermark footer */}
        <div className="pt-1 border-t border-slate-800/60 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Database Dan Sinkronisasi Cloud Terproteksi</span>
        </div>
      </Card>
    </div>
  );
};

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { verifyPin, updateLastActiveTimestamp, isAppLockRequired, getExpectedPinLength } from '@/services/mobile/appLockService';
import { Lock, Delete } from 'lucide-react';

export function AppLockScreenModal() {
  const [isLocked, setIsLocked] = useState(false);
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [pinLength, setPinLength] = useState(6);

  const checkStatus = useCallback(() => {
    if (isAppLockRequired()) {
      setIsLocked(true);
      setPinLength(getExpectedPinLength());
    }
  }, []);

  const handleKeyPress = useCallback((num: string) => {
    setPin((prevPin) => {
      const maxLen = pinLength || 6;
      if (prevPin.length >= maxLen) return prevPin;
      const nextPin = prevPin + num;
      setErrorMsg('');

      if (nextPin.length === maxLen) {
        verifyPin(nextPin).then((isValid) => {
          if (isValid) {
            updateLastActiveTimestamp(true);
            setIsLocked(false);
            setErrorMsg('');
            setPin('');
          } else {
            setErrorMsg('PIN salah. Silakan coba lagi.');
            setPin('');
          }
        });
      }
      return nextPin;
    });
  }, [pinLength]);

  const handleDelete = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  }, []);

  // Initial check and periodic activity check
  useEffect(() => {
    checkStatus();

    const interval = setInterval(() => {
      checkStatus();
    }, 15000); // Check every 15s

    const handleFocus = () => {
      checkStatus();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [checkStatus]);

  // Global user activity tracker (resets 15-min inactivity timer on interaction)
  useEffect(() => {
    if (isLocked) return;

    const recordActivity = () => {
      updateLastActiveTimestamp();
    };

    window.addEventListener('pointerdown', recordActivity);
    window.addEventListener('keydown', recordActivity);
    window.addEventListener('scroll', recordActivity, { passive: true });
    window.addEventListener('touchstart', recordActivity, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', recordActivity);
      window.removeEventListener('keydown', recordActivity);
      window.removeEventListener('scroll', recordActivity);
      window.removeEventListener('touchstart', recordActivity);
    };
  }, [isLocked]);

  // Physical keyboard listener for PIN input
  useEffect(() => {
    if (!isLocked) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for numeric keys (0-9 and Numpad 0-9)
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        handleDelete();
      } else if (e.key === 'Escape') {
        setPin('');
        setErrorMsg('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked, handleKeyPress, handleDelete]);

  if (!isLocked) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/95 backdrop-blur-md text-white p-4 font-sans select-none animate-fade-in">
      <Card className="w-full max-w-sm bg-slate-900 border border-slate-800 shadow-2xl p-6 text-center space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <div className="p-3.5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold tracking-tight">OmniLife App Lock</h3>
          <p className="text-xs text-slate-400">
            Ketik PIN atau gunakan keypad untuk membuka ({pinLength} digit)
          </p>
        </div>

        {/* PIN Indicators */}
        <div className="flex items-center justify-center gap-3 py-2">
          {Array.from({ length: pinLength }).map((_, idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full border transition-all ${
                pin.length > idx
                  ? 'bg-blue-500 border-blue-400 scale-125 shadow-md shadow-blue-500/50'
                  : 'bg-slate-800 border-slate-700'
              }`}
            />
          ))}
        </div>

        {errorMsg && (
          <p className="text-xs text-rose-400 font-bold animate-shake">{errorMsg}</p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto text-lg font-bold">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num)}
              className="w-16 h-16 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center border border-slate-700/60 cursor-pointer mx-auto"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setPin('');
              setErrorMsg('');
            }}
            className="w-16 h-16 rounded-full bg-slate-800/40 hover:bg-slate-800 text-xs font-semibold text-slate-400 transition-all flex items-center justify-center cursor-pointer mx-auto"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="w-16 h-16 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center border border-slate-700/60 cursor-pointer mx-auto"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="w-16 h-16 rounded-full bg-slate-800/40 hover:bg-slate-800 text-slate-400 transition-all flex items-center justify-center cursor-pointer mx-auto"
            title="Hapus"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      </Card>
    </div>
  );
}

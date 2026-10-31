import { useState, useEffect } from 'react';
import { Smartphone, Download, X } from 'lucide-react';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-16 left-4 right-4 md:left-auto md:right-4 md:bottom-4 z-50 max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-3.5 rounded-xl shadow-lg flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
          <Smartphone className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
        </div>
        <div>
          <h5 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">Install OmniLife di HP</h5>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Akses cepat offline Dan jadwal kelas</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleInstallClick}
          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white font-semibold text-xs cursor-pointer flex items-center gap-1"
        >
          <Download className="w-3.5 h-3.5" /> Install
        </button>
        <button
          onClick={() => setShowPrompt(false)}
          className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

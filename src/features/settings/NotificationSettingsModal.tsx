import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  AppLockConfig,
  fetchAppLockConfig,
  saveAppLockConfig,
  setPinCode,
} from '@/services/mobile/appLockService';
import { Bell, Lock, X, Check, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface StudyReminderConfig {
  enabled: boolean;
  reminderTime: string; // HH:mm
  dailyGoalReminder: boolean;
  streakAlertEnabled: boolean;
}

const DEFAULT_STUDY_REMINDER: StudyReminderConfig = {
  enabled: true,
  reminderTime: '20:00',
  dailyGoalReminder: true,
  streakAlertEnabled: true,
};

const STORAGE_REMINDER_KEY = 'omnilife_mandarin_reminder_config';

export function getStudyReminderConfig(): StudyReminderConfig {
  try {
    const raw = localStorage.getItem(STORAGE_REMINDER_KEY);
    if (raw) return { ...DEFAULT_STUDY_REMINDER, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_STUDY_REMINDER;
}

export function saveStudyReminderConfig(cfg: StudyReminderConfig) {
  try {
    localStorage.setItem(STORAGE_REMINDER_KEY, JSON.stringify(cfg));
  } catch {}
}

export function NotificationSettingsModal({ isOpen, onClose }: NotificationSettingsModalProps) {
  const { success, info } = useToast();
  const [reminderConfig, setReminderConfig] = useState<StudyReminderConfig>(DEFAULT_STUDY_REMINDER);
  const [lockConfig, setLockConfig] = useState<AppLockConfig | null>(null);
  const [newPin, setNewPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReminderConfig(getStudyReminderConfig());
      setLockConfig(fetchAppLockConfig());
      if ('Notification' in window) {
        setHasPermission(Notification.permission === 'granted');
      }
    }
  }, [isOpen]);

  if (!isOpen || !lockConfig) return null;

  const pinExists = Boolean(lockConfig.pinHash);

  const handleEnablePermission = async () => {
    if (!('Notification' in window)) {
      info('Notifikasi sistem tidak didukung di peramban ini.');
      return;
    }
    const perm = await Notification.requestPermission();
    setHasPermission(perm === 'granted');
    if (perm === 'granted') {
      success('Izin notifikasi berhasil diaktifkan!');
    }
  };

  const handleSaveSettings = async () => {
    // Validasi PIN jika lock diaktifkan
    if (lockConfig.isEnabled) {
      if (!pinExists && (!newPin || newPin.length < 4)) {
        setPinError('PIN minimal 4 digit.');
        return;
      }
      if (newPin) {
        if (newPin.length < 4 || newPin.length > 8) {
          setPinError('PIN harus 4 sampai 8 digit angka.');
          return;
        }
        await setPinCode(newPin, lockConfig.timeout);
      } else {
        saveAppLockConfig(lockConfig);
      }
    } else {
      saveAppLockConfig(lockConfig);
    }

    saveStudyReminderConfig(reminderConfig);
    success('Pengaturan notifikasi Dan keamanan berhasil disimpan.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-lg bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl max-h-[85vh] sm:max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-500 shrink-0" />
            <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 truncate">
              Notifikasi Belajar Dan App Lock PIN
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer text-zinc-500 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-5">
          {/* Permission Request Banner */}
          {!hasPermission && (
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-indigo-900 dark:text-indigo-200 block">
                Izin Notifikasi Belum Aktif
              </span>
              <span className="text-indigo-700 dark:text-indigo-300">
                Aktifkan agar pengingat jadwal ulasan harian dapat muncul.
              </span>
            </div>
            <Button size="sm" onClick={handleEnablePermission} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shrink-0 text-xs">
              Aktifkan
            </Button>
          </div>
        )}

        {/* Section 1: Study Reminders */}
        <div className="space-y-3 text-xs">
          <h4 className="font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-500" /> Pengingat Belajar Harian
          </h4>

          <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 cursor-pointer">
            <div>
              <span className="font-bold text-zinc-900 dark:text-zinc-100 block">Pengingat Ulasan Harian</span>
              <span className="text-zinc-500">Notifikasi saat kartu atau ulasan program siap dipelajari</span>
            </div>
            <input
              type="checkbox"
              checked={reminderConfig.enabled}
              onChange={(e) => setReminderConfig({ ...reminderConfig, enabled: e.target.checked })}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            />
          </label>

          {reminderConfig.enabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-1">
              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Waktu Pengingat
                </label>
                <input
                  type="time"
                  value={reminderConfig.reminderTime}
                  onChange={(e) => setReminderConfig({ ...reminderConfig, reminderTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-bold"
                />
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 cursor-pointer text-[11px]">
                  <input
                    type="checkbox"
                    checked={reminderConfig.streakAlertEnabled}
                    onChange={(e) => setReminderConfig({ ...reminderConfig, streakAlertEnabled: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>Peringatan Jaga Streak</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: App Lock PIN */}
        <div className="space-y-3 text-xs pt-3 border-t border-zinc-200 dark:border-zinc-800">
          <h4 className="font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-500" /> Keamanan App Lock PIN
          </h4>

          <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 cursor-pointer">
            <div>
              <span className="font-bold text-zinc-900 dark:text-zinc-100 block">Kunci Layar Aplikasi (PIN)</span>
              <span className="text-zinc-500">Minta PIN angka saat aplikasi dibuka atau setelah jeda tidak aktif</span>
            </div>
            <input
              type="checkbox"
              checked={lockConfig.isEnabled}
              onChange={(e) => setLockConfig({ ...lockConfig, isEnabled: e.target.checked })}
              className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
            />
          </label>

          {lockConfig.isEnabled && (
            <div className="space-y-3 pl-1">
              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  {pinExists ? 'Ganti PIN (Opsional)' : 'Atur PIN Pengaman (4–8 Digit)'}
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  autoComplete="new-password"
                  maxLength={8}
                  placeholder={pinExists ? '•••••• (kosongkan jika tidak diganti)' : 'Masukkan 4–8 digit angka PIN...'}
                  value={newPin}
                  onChange={(e) => {
                    setNewPin(e.target.value.replace(/\D/g, ''));
                    setPinError('');
                  }}
                  className={`w-full px-3 py-2 rounded-xl border bg-white dark:bg-zinc-800 text-xs font-mono tracking-widest ${
                    pinError
                      ? 'border-rose-400 dark:border-rose-600'
                      : 'border-zinc-200 dark:border-zinc-700'
                  }`}
                />
                {pinError ? (
                  <p className="mt-1 text-[11px] font-bold text-rose-500">{pinError}</p>
                ) : (
                  <p className="mt-1 text-[11px] text-zinc-400">
                    {pinExists
                      ? 'PIN sudah terpasang Dan aktif. Isi kolom hanya bila ingin mengubah PIN.'
                      : 'Wajib diisi — App Lock membutuhkan PIN minimal 4 digit.'}
                  </p>
                )}
              </div>

              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Batas Waktu Otomatis Terkunci (Inactivity Lock)
                </label>
                <select
                  value={lockConfig.timeout}
                  onChange={(e) => setLockConfig({ ...lockConfig, timeout: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-bold"
                >
                  <option value="15m">15 Menit Tidak Aktif (Standar Rekomendasi)</option>
                  <option value="30m">30 Menit Tidak Aktif</option>
                  <option value="1h">1 Jam Tidak Aktif</option>
                  <option value="5m">5 Menit Tidak Aktif</option>
                  <option value="1m">1 Menit Tidak Aktif</option>
                  <option value="immediately">Segera Saat Aplikasi Ditutup / Pindah Tab</option>
                  <option value="never">Jangan Kunci Otomatis (Hanya Saat Restart)</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pinned Actions Footer */}
      <div className="p-3 sm:p-4 bg-zinc-50 dark:bg-zinc-900/90 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-2 shrink-0">
        <Button variant="outline" onClick={onClose} className="text-xs font-semibold cursor-pointer">
          Batal
        </Button>
        <Button
          onClick={handleSaveSettings}
          disabled={lockConfig.isEnabled && !lockConfig.pinHash && !newPin.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Check className="w-4 h-4 mr-1.5" /> Simpan Pengaturan
        </Button>
      </div>
    </Card>
  </div>
  );
}

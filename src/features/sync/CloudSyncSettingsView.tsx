import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  fetchSyncState,
  signInUser,
  signUpUser,
  signOutUser,
  pushPendingChanges,
  toggleOfflineMode,
  fetchOutboxItems,
  migrateLocalDataToSupabase,
  manualFullPullWithCooldown,
} from '@/services/sync/syncService';
import { getSupabaseConfig } from '@/services/sync/supabaseClient';
import { exportBackupData } from '@/services/backupService';
import { useToast } from '@/components/ui/Toast';
import { CheckCircle2, Clock, WifiOff, RefreshCw, LogOut, User, ShieldCheck, Database, HardDriveDownload, Server } from 'lucide-react';
import { t } from '@/services/localizationService';

export function CloudSyncSettingsView() {
  const { success } = useToast();
  const [syncState, setSyncState] = useState(fetchSyncState());
  const [isSyncing, setIsSyncing] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [migrationMsg, setMigrationMsg] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const outbox = fetchOutboxItems();

  const handleMigration = async () => {
    setIsMigrating(true);
    setMigrationMsg(null);
    const res = await migrateLocalDataToSupabase();
    setMigrationMsg(res.message);
    setIsMigrating(false);
    setSyncState(fetchSyncState());
  };

  const handlePullCloud = async () => {
    setIsPulling(true);
    setMigrationMsg(null);
    const res = await manualFullPullWithCooldown();
    setMigrationMsg(res.message);
    setIsPulling(false);
    setSyncState(fetchSyncState());
  };

  const handleSyncNow = async () => {
    setIsSyncing(true);
    await pushPendingChanges();
    setTimeout(() => {
      setSyncState(fetchSyncState());
      setIsSyncing(false);
    }, 600);
  };

  const handleToggleOffline = () => {
    toggleOfflineMode();
    setSyncState(fetchSyncState());
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    if (authMode === 'signin') {
      await signInUser(emailInput.trim(), passwordInput);
    } else {
      await signUpUser(emailInput.trim(), passwordInput);
    }
    setSyncState(fetchSyncState());
    setShowAuthModal(false);
    setEmailInput('');
    setPasswordInput('');
  };

  const handleSignOut = async () => {
    await signOutUser();
    setSyncState(fetchSyncState());
  };

  const getStatusBadge = () => {
    if (syncState.isOfflineMode) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
          <WifiOff className="w-3.5 h-3.5" />
          ○ Offline (Local-First)
        </span>
      );
    }
    if (isSyncing) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 animate-pulse">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ↻ {t('sync.syncing')}
        </span>
      );
    }
    if (syncState.pendingOutboxCount > 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200">
          <Clock className="w-3.5 h-3.5" />
          Pending ({syncState.pendingOutboxCount} items)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5" />
        ✓ {t('sync.synced')}
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header sinkronisasi — tenang, tanpa banner gradien (§02.4, §43) */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <h3 className="font-display text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {t('sync.title')}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Sinkronisasi offline-first antara OmniLife Desktop dan klien Android/PWA.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {getStatusBadge()}
          <Button
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="text-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
            {t('sync.syncNow')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Card */}
        <Card className="p-5 space-y-4 border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Account Credentials
            </h4>
            <span className="text-[11px] text-zinc-400 font-mono">Row Level Security</span>
          </div>

          {syncState.userEmail ? (
            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 space-y-1">
                <span className="text-[11px] text-zinc-400 uppercase font-semibold">Signed-in Account</span>
                <p className="text-xs font-bold font-mono text-zinc-900 dark:text-zinc-100">{syncState.userEmail}</p>
              </div>

              <div className="flex items-center justify-between text-xs">
                <Button size="sm" variant="outline" onClick={handleSignOut} className="text-rose-600 border-rose-200 cursor-pointer">
                  <LogOut className="w-3.5 h-3.5 mr-1" /> Sign Out
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-2 text-center py-4">
              <p className="text-xs text-zinc-500">Sign in to enable multi-device cloud synchronization.</p>
              <Button onClick={() => setShowAuthModal(true)} className="bg-blue-600 text-white text-xs cursor-pointer">
                Sign In / Register Account
              </Button>
            </div>
          )}
        </Card>

        {/* Sync Controls & Outbox */}
        <Card className="p-5 space-y-4 border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              Local Outbox Queue ({outbox.length})
            </h4>
            <Button
              size="sm"
              variant="outline"
              onClick={handleToggleOffline}
              className={`text-xs cursor-pointer ${syncState.isOfflineMode ? 'bg-amber-50 text-amber-800' : ''}`}
            >
              {syncState.isOfflineMode ? 'Disable Offline Mode' : 'Simulate Offline Mode'}
            </Button>
          </div>

          {outbox.length === 0 ? (
            <p className="text-xs text-zinc-500 p-4 text-center border border-dashed rounded-xl">
              All local changes are fully synchronized!
            </p>
          ) : (
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {outbox.map((item) => (
                <div key={item.id} className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 text-xs font-mono flex items-center justify-between">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{item.action.toUpperCase()} [{item.entityType}]</span>
                  <span className="text-[11px] text-zinc-400">{item.entityId}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Supabase Connection Status Card */}
      <Card className="p-5 space-y-3 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600" />
            Status Koneksi Supabase Cloud
          </h4>
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
            getSupabaseConfig().isConfigured
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-amber-100 text-amber-800 border border-amber-300'
          }`}>
            {getSupabaseConfig().isConfigured ? '🟢 Terhubung Supabase' : '🟡 Standby (Local-First Fallback)'}
          </span>
        </div>

        <div className="text-xs font-mono bg-zinc-50 dark:bg-zinc-800/60 p-3 rounded-xl space-y-1">
          <p><strong className="text-zinc-500">Project URL:</strong> {getSupabaseConfig().url}</p>
          <p><strong className="text-zinc-500">Anon Key:</strong> {getSupabaseConfig().key}</p>
          <p className="flex items-center gap-2">
            <strong className="text-zinc-500">Service Key (Bypass RLS):</strong>
            {getSupabaseConfig().serviceKeyConfigured ? (
              <span className="text-emerald-600 font-bold">✅ Terkonfigurasi</span>
            ) : (
              <span className="text-amber-600 font-bold">⚠️ Belum diisi</span>
            )}
          </p>
        </div>

        {/* Safe Anon Client Notice */}
        {getSupabaseConfig().isConfigured && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 rounded-xl text-xs space-y-1.5">
            <p className="font-bold text-emerald-900 dark:text-emerald-200">✅ Terhubung Aman via Public Anon Key</p>
            <p className="text-emerald-800 dark:text-emerald-300 text-[11.5px]">
              Klien menggunakan Supabase Anon Key yang aman untuk build web & Vercel. Pastikan seluruh skrip di <code className="font-mono bg-emerald-100 dark:bg-emerald-900/60 px-1 py-0.5 rounded">supabase_schema.sql</code> sudah dieksekusi di Supabase SQL Editor agar izin sinkronisasi terbuka.
            </p>
          </div>
        )}

        {/* Supabase Schema SQL Info */}
        <div className="p-3 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-200">
            <Database className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Sinkronisasi Lengkap Seluruh Modul OmniLife (52 Tabel + PIN)</span>
          </div>
          <p className="text-[11px] text-blue-800 dark:text-blue-300">
            Mencakup: <strong>Akademik, Transaksi & Keuangan, Kalender, Tugas & Rutinitas, Catatan, Pengingat, Goals, Proyek, Vault, hingga PIN Keamanan Aplikasi</strong>. Data otomatis dicadangkan ke Supabase saat online dan tersimpan di antrean saat offline.
          </p>
        </div>

        {/* Cloud Sync Actions: Push & Pull */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">1. Unggah Semua Data Lokal ke Supabase (Push / Master Backup)</h5>
              <p className="text-[11px] text-zinc-500">Upload seluruh 52 tabel database lokal (Akademik, Keuangan, Transaksi, PIN, Catatan, Tugas) ke Cloud Database.</p>
            </div>
            <Button
              onClick={handleMigration}
              disabled={isMigrating || isPulling || !getSupabaseConfig().isConfigured}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 cursor-pointer"
            >
              {isMigrating ? 'Mengunggah Data...' : 'Unggah ke Supabase'}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-dashed border-zinc-100 dark:border-zinc-800">
            <div>
              <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">2. Tarik Data Cloud ke Perangkat Ini (Pull / Master Restore)</h5>
              <p className="text-[11px] text-zinc-500">Unduh dan pulihkan seluruh data dan PIN dari Supabase Cloud langsung ke SQLite lokal perangkat ini (Desktop atau Android).</p>
            </div>
            <Button
              onClick={handlePullCloud}
              disabled={isMigrating || isPulling || !getSupabaseConfig().isConfigured}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shrink-0 cursor-pointer"
            >
              {isPulling ? 'Menarik Data...' : ' Tarik Data dari Cloud'}
            </Button>
          </div>

          {migrationMsg && (
            <div className={`p-3.5 rounded-xl text-xs font-medium select-text cursor-text ${
              migrationMsg.includes('Berhasil') || migrationMsg.includes('✅')
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-200 dark:border-emerald-800'
                : migrationMsg.includes('⚠️') || migrationMsg.includes('error')
                ? 'bg-amber-50 text-amber-900 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-200 dark:border-amber-800'
                : 'bg-rose-50 text-rose-900 border border-rose-200 dark:bg-rose-950/30 dark:text-rose-200 dark:border-rose-800'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 whitespace-pre-line select-text cursor-text">{migrationMsg}</div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(migrationMsg);
                    success('Pesan berhasil disalin ke clipboard!');
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition-colors shrink-0 cursor-pointer"
                  title="Salin pesan log ke clipboard"
                >
                  Salin Log
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Local Data Backup Section */}
      <Card className="p-5 space-y-3 border-zinc-200 dark:border-zinc-800">
        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <HardDriveDownload className="w-4 h-4 text-indigo-600" />
          Data Safety & Offline Backup
        </h4>
        <p className="text-xs text-zinc-500">
          OmniLife uses a local-first SQLite engine. Your data is always saved locally on your computer regardless of internet connectivity.
        </p>
        <div className="pt-1">
          <Button
            size="sm"
            variant="outline"
            onClick={async () => {
              try {
                await exportBackupData();
              } catch (err) {
                console.error('Backup export failed:', err);
              }
            }}
            className="text-xs cursor-pointer"
          >
            Export Local Data Backup (.json)
          </Button>
        </div>
      </Card>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 max-w-md w-full border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                {authMode === 'signin' ? 'Sign In to OmniLife Cloud' : 'Register New Account'}
              </h3>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Email Address *</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full h-9 rounded-md border border-zinc-300 dark:border-zinc-700 px-3 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Password *</label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-9 rounded-md border border-zinc-300 dark:border-zinc-700 px-3 text-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                  className="text-xs text-blue-600 hover:underline cursor-pointer"
                >
                  {authMode === 'signin' ? 'Need an account? Register' : 'Already have an account? Sign In'}
                </button>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowAuthModal(false)} className="cursor-pointer text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 text-white cursor-pointer text-xs">
                    {authMode === 'signin' ? 'Sign In' : 'Register'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

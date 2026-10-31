import React, { useState, useEffect } from 'react';
import {
  X,
  UserPlus,
  Users,
  KeyRound,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Shield,
  RefreshCw,
  Search,
} from 'lucide-react';
import {
  listAllStudents,
  createStudentAccount,
  resetStudentPin,
  deleteStudentAccount,
  StudentUser,
} from '@/services/auth/classAuthService';
import { clickTick, playSuccessChime, playErrorBuzz } from '@/lib/fx';

interface ClassManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClassManagementModal: React.FC<ClassManagementModalProps> = ({ isOpen, onClose }) => {
  const [students, setStudents] = useState<StudentUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'roster' | 'add'>('roster');

  // Form Tambah Siswa Baru
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPin, setNewPin] = useState('');
  const [formMsg, setFormMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset PIN State
  const [resetTargetUser, setResetTargetUser] = useState<StudentUser | null>(null);
  const [newResetPin, setNewResetPin] = useState('');
  const [resetMsg, setResetMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filter Search
  const [searchQuery, setSearchQuery] = useState('');

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const data = await listAllStudents();
      setStudents(data);
    } catch {
      /* ignore */
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadStudents();
      setFormMsg(null);
      setResetTargetUser(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    clickTick(true);
    setFormMsg(null);
    setIsSubmitting(true);

    try {
      const res = await createStudentAccount(newName, newUsername, newPin);
      if (res.success) {
        playSuccessChime(true);
        setFormMsg({ type: 'success', text: `Akun untuk "${newName}" berhasil dibuat!` });
        setNewName('');
        setNewUsername('');
        setNewPin('');
        await loadStudents();
        setTimeout(() => setActiveTab('roster'), 1200);
      } else {
        playErrorBuzz(true);
        setFormMsg({ type: 'error', text: res.error || 'Gagal membuat akun siswa.' });
      }
    } catch {
      playErrorBuzz(true);
      setFormMsg({ type: 'error', text: 'Terjadi kesalahan sistem.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTargetUser) return;
    clickTick(true);
    setResetMsg(null);

    try {
      const res = await resetStudentPin(resetTargetUser.id, newResetPin);
      if (res.success) {
        playSuccessChime(true);
        setResetMsg({ type: 'success', text: `PIN baru berhasil disimpan!` });
        setTimeout(() => {
          setResetTargetUser(null);
          setNewResetPin('');
          setResetMsg(null);
        }, 1200);
      } else {
        playErrorBuzz(true);
        setResetMsg({ type: 'error', text: res.error || 'Gagal reset PIN.' });
      }
    } catch {
      playErrorBuzz(true);
      setResetMsg({ type: 'error', text: 'Terjadi kesalahan sistem.' });
    }
  };

  const handleDeleteStudent = async (user: StudentUser) => {
    if (user.role === 'admin') {
      alert('Akun Guru/Master Admin tidak dapat dihapus.');
      return;
    }
    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus akun siswa "${user.displayName}" (@${user.username})?`);
    if (!confirmed) return;

    clickTick(true);
    const res = await deleteStudentAccount(user.id);
    if (res.success) {
      await loadStudents();
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#FFFDF9] dark:bg-[#151E32] border-2 border-zinc-200 dark:border-[#24324E] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-200 dark:border-[#24324E] flex items-center justify-between gap-4 shrink-0 bg-white/50 dark:bg-[#0B111E]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 flex items-center justify-center font-bold text-lg shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-extrabold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>Manajemen Siswa Dan Kelas</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold uppercase">
                  Panel Guru
                </span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Kelola akun anak, buat akun baru, atau reset PIN jika ada yang lupa.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              clickTick(true);
              onClose();
            }}
            className="w-9 h-9 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-6 pt-4 border-b border-zinc-200 dark:border-[#24324E] flex items-center gap-2 shrink-0 bg-zinc-50/50 dark:bg-[#0E1524]/50">
          <button
            onClick={() => {
              clickTick(true);
              setActiveTab('roster');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'roster'
                ? 'border-[#C0392B] text-[#C0392B] dark:text-rose-400 bg-white dark:bg-[#151E32]'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Daftar Siswa ({students.filter((s) => s.role === 'student').length})</span>
          </button>
          <button
            onClick={() => {
              clickTick(true);
              setActiveTab('add');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'add'
                ? 'border-[#C0392B] text-[#C0392B] dark:text-rose-400 bg-white dark:bg-[#151E32]'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Daftarkan Siswa Baru</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'roster' && (
            <div className="space-y-4">
              {/* Search Dan Refresh */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama atau username siswa…"
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-50 dark:bg-[#0B111E] border border-zinc-200 dark:border-[#24324E] text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#C0392B]"
                  />
                </div>
                <button
                  onClick={loadStudents}
                  disabled={isLoading}
                  className="px-3 py-2 rounded-xl bg-zinc-100 dark:bg-[#0B111E] border border-zinc-200 dark:border-[#24324E] text-zinc-600 dark:text-zinc-300 text-xs font-medium hover:bg-zinc-200 dark:hover:bg-[#1E293B] cursor-pointer flex items-center gap-1.5"
                  title="Segarkan data siswa"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {/* Student Table / Cards */}
              {filteredStudents.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3">
                  <Users className="w-8 h-8 text-zinc-400 mx-auto" />
                  <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400">
                    Belum ada siswa yang didaftarkan.
                  </p>
                  <button
                    onClick={() => setActiveTab('add')}
                    className="px-4 py-2 rounded-xl bg-[#C0392B] text-white text-xs font-bold hover:bg-[#A93226] cursor-pointer"
                  >
                    + Daftarkan Siswa Pertama
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-zinc-200 dark:divide-zinc-800/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-[#0B111E]">
                  {filteredStudents.map((s) => (
                    <div
                      key={s.id}
                      className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-zinc-50/70 dark:hover:bg-zinc-900/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-center text-base shrink-0">
                          {s.role === 'admin' ? '👑' : s.avatar || '🌱'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 truncate">
                              {s.displayName}
                            </span>
                            {s.role === 'admin' ? (
                              <span className="px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                                Guru
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.2 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-medium">
                                Siswa
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                            @{s.username}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            clickTick(true);
                            setResetTargetUser(s);
                            setNewResetPin('');
                            setResetMsg(null);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          title="Ganti atau reset PIN siswa"
                        >
                          <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                          <span className="hidden sm:inline">Reset PIN</span>
                        </button>

                        {s.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteStudent(s)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Hapus akun siswa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'add' && (
            <form onSubmit={handleCreateStudent} className="space-y-4 max-w-lg mx-auto">
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 text-xs space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Siswa tidak perlu mendaftar sendiri
                </span>
                <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 leading-relaxed">
                  Cukup buatkan nama, username (misal: nama panggilan atau nomor absen), dan PIN sederhana. Lalu bagikan ke siswa bersangkutan.
                </p>
              </div>

              {formMsg && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
                    formMsg.type === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                      : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                  }`}
                >
                  {formMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  )}
                  <span className="font-medium">{formMsg.text}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Nama Lengkap Siswa:
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="misal: Budi Santoso"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-[#0B111E] border border-zinc-200 dark:border-[#24324E] text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#C0392B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Username / ID Absen (Unik, huruf kecil tanpa spasi):
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="misal: budi atau absen07"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-[#0B111E] border border-zinc-200 dark:border-[#24324E] text-sm font-mono text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#C0392B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  PIN Awal (4-6 digit angka):
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="misal: 1234"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-[#0B111E] border border-zinc-200 dark:border-[#24324E] text-sm font-mono text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#C0392B]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white font-bold text-xs shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isSubmitting ? 'Mendaftarkan…' : 'Daftarkan Akun Siswa'}</span>
              </button>
            </form>
          )}

          {/* Reset PIN Prompt Modal */}
          {resetTargetUser && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50">
              <div className="w-full max-w-sm bg-white dark:bg-[#151E32] rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-amber-500" />
                    <span>Reset PIN Siswa</span>
                  </h3>
                  <button
                    onClick={() => setResetTargetUser(null)}
                    className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Masukkan PIN baru untuk <strong>{resetTargetUser.displayName}</strong> (@{resetTargetUser.username}):
                </p>

                {resetMsg && (
                  <div
                    className={`p-2.5 rounded-lg text-xs ${
                      resetMsg.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {resetMsg.text}
                  </div>
                )}

                <form onSubmit={handleResetPinSubmit} className="space-y-3">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={newResetPin}
                    onChange={(e) => setNewResetPin(e.target.value)}
                    placeholder="PIN baru (4 digit)"
                    required
                    autoFocus
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm font-mono text-center text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-[#C0392B]"
                  />
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setResetTargetUser(null)}
                      className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-600 dark:text-zinc-400"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-[#C0392B] text-white text-xs font-bold hover:bg-[#A93226]"
                    >
                      Simpan PIN
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

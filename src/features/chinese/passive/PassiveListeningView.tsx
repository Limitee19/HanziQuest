import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Headphones,
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  RotateCcw,
  Shuffle,
  Volume2,
  Bell,
  Sparkles,
  Timer,
  Waves,
  BookOpenText,
  Brain,
  Info,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  passiveLearning,
  PassiveSnapshot,
  PassiveSettings,
  PassiveMode,
  loadPassiveSettings,
  loadPassiveStats,
} from '@/services/chinese/passiveLearningService';

const MODES: { id: PassiveMode; label: string; desc: string; icon: typeof Waves }[] = [
  { id: 'flow', label: 'Aliran Kata', desc: 'Kata (2×) → arti. Untuk pemanasan & familiarisasi.', icon: Waves },
  { id: 'recall', label: 'Latihan Ingat', desc: 'Kata → jeda untuk mengingat → arti. Priming memori aktif-pasif.', icon: Brain },
  { id: 'sentence', label: 'Dalam Kalimat', desc: 'Kata → contoh kalimat → arti. Konteks pemakaian nyata.', icon: BookOpenText },
];

const GAPS = [2, 4, 6, 8];
const SESSIONS = [
  { min: 15, label: '15 mnt' },
  { min: 30, label: '30 mnt' },
  { min: 45, label: '45 mnt' },
  { min: 60, label: '1 jam' },
  { min: 90, label: '1,5 jam' },
  { min: 0, label: '∞' },
];

function fmtSec(total: number): string {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}j ${String(m).padStart(2, '0')}m`;
  return `${m}m ${String(s).padStart(2, '0')}d`;
}

export function PassiveListeningView() {
  const [settings, setSettings] = useState<PassiveSettings>(() => loadPassiveSettings());
  const [snap, setSnap] = useState<PassiveSnapshot>(() => passiveLearning.getSnapshot());
  const [stats, setStats] = useState(() => loadPassiveStats());
  const [showScience, setShowScience] = useState(false);

  // Interpolasi detik sesi agar tampilan berjalan halus antar pembaruan engine
  const [displayElapsed, setDisplayElapsed] = useState(0);
  const baseRef = useRef({ base: 0, at: 0 });

  useEffect(() => {
    const unsub = passiveLearning.subscribe((s) => {
      setSnap(s);
      baseRef.current = { base: s.sessionElapsedSec, at: Date.now() };
      setDisplayElapsed(s.sessionElapsedSec);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (snap.status !== 'playing') return;
    const iv = window.setInterval(() => {
      const { base, at } = baseRef.current;
      setDisplayElapsed(base + Math.floor((Date.now() - at) / 1000));
    }, 1000);
    return () => window.clearInterval(iv);
  }, [snap.status]);

  // Muat ulang statistik saat sesi berubah status
  useEffect(() => {
    if (snap.status === 'ended' || snap.status === 'idle') {
      const t = window.setTimeout(() => setStats(loadPassiveStats()), 300);
      return () => window.clearTimeout(t);
    }
  }, [snap.status]);

  const todayKey = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);
  const todayStat = stats[todayKey] || { sec: 0, items: 0 };
  const weekSec = useMemo(() => {
    let sum = 0;
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      sum += stats[k]?.sec || 0;
    }
    return sum;
  }, [stats]);

  const patch = (p: Partial<PassiveSettings>) => setSettings(passiveLearning.updateSettings(p));

  const toggleLevel = (lvl: number) => {
    const has = settings.hskLevels.includes(lvl);
    const next = has ? settings.hskLevels.filter((l) => l !== lvl) : [...settings.hskLevels, lvl].sort();
    if (next.length === 0) return; // minimal satu level
    patch({ hskLevels: next });
  };

  const startSession = () => {
    passiveLearning.start();
  };

  const requestNotify = async () => {
    try {
      if (typeof Notification === 'undefined') return;
      if (Notification.permission === 'default') {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') patch({ notifyHidden: !settings.notifyHidden });
        return;
      }
      patch({ notifyHidden: !settings.notifyHidden });
    } catch {
      /* abaikan */
    }
  };

  const isPlaying = snap.status === 'playing';
  const isPaused = snap.status === 'paused';
  const isEnded = snap.status === 'ended';
  const isActive = isPlaying || isPaused;
  const word = snap.word;
  const progressPct =
    snap.sessionLengthSec > 0 ? Math.min(100, (displayElapsed / snap.sessionLengthSec) * 100) : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 rounded-2xl sm:rounded-3xl">
        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="font-display text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Headphones className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" /> Mode Pasif — Belajar Sambil rebahan
            </h3>
            <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400">
              Tekan mulai, biarkan berjalan. Kosakata diputar otomatis dengan jeda terjadwal — tanpa interaksi apa pun.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-center">
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wide">Hari ini</p>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400">{fmtSec(todayStat.sec)} · {todayStat.items} kata</p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-center hidden sm:block">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">7 hari</p>
              <p className="text-xs font-bold text-zinc-600 dark:text-zinc-300">{fmtSec(weekSec)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {isActive && word ? (
        /* ── LAYAR AKTIF (ambient) ── */
        <Card className="bg-gradient-to-b from-blue-950/95 to-zinc-950 border-blue-900/60 rounded-3xl overflow-hidden">
          <CardContent className="p-5 sm:p-8 text-center space-y-5 select-none">
            {/* Fase */}
            <div className="flex items-center justify-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-blue-300">
                {snap.phase.label || 'Menyiapkan…'}
              </p>
            </div>

            {/* Hanzi raksasa — jangkar visual sekilas */}
            <div className="py-2 sm:py-4">
              <p className="font-display text-[72px] sm:text-[110px] leading-none text-white break-all">{word.hanzi}</p>
              <p className="mt-3 text-lg sm:text-2xl font-bold text-blue-300 tracking-wide">{word.pinyin}</p>
              <p className="mt-1.5 text-sm sm:text-base text-zinc-300">
                {word.emoji ? `${word.emoji} ` : ''}
                {word.meanings.filter(Boolean).slice(0, 2).join(', ')}
                {snap.phase.phase === 'recall' && <span className="block mt-1 text-xs text-zinc-500 italic">(coba ingat sebelum diucapkan…)</span>}
              </p>
            </div>

            {/* Progres sesi */}
            <div className="space-y-1.5">
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-1000"
                  style={{ width: `${snap.sessionLengthSec > 0 ? progressPct : 100 - (displayElapsed % 60) * 1.66}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] sm:text-xs text-zinc-400 font-semibold">
                <span>{snap.sessionLengthSec > 0 ? fmtSec(Math.max(0, snap.sessionLengthSec - displayElapsed)) + ' tersisa' : 'Tanpa batas'}</span>
                <span>
                  Item {snap.index}/{snap.total} · Putaran {snap.pass} · {snap.itemsHeard} kata didengar
                </span>
              </div>
            </div>

            {/* Kontrol besar (ramah sentuh) */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 pt-1">
              <button
                onClick={() => passiveLearning.skip(-1)}
                className="p-3.5 rounded-full bg-white/5 text-zinc-300 hover:bg-white/10 active:scale-95 transition cursor-pointer"
                title="Ulangi item sebelumnya"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={() => (isPlaying ? passiveLearning.pause() : passiveLearning.resume())}
                className="p-6 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-500 active:scale-95 transition cursor-pointer"
                title={isPlaying ? 'Jeda' : 'Lanjut'}
              >
                {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7" />}
              </button>
              <button
                onClick={() => passiveLearning.skip(1)}
                className="p-3.5 rounded-full bg-white/5 text-zinc-300 hover:bg-white/10 active:scale-95 transition cursor-pointer"
                title="Lewati ke kata berikutnya"
              >
                <SkipForward className="w-5 h-5" />
              </button>
              <button
                onClick={() => passiveLearning.stop('Sesi dihentikan.')}
                className="p-3.5 rounded-full bg-red-500/15 text-red-300 hover:bg-red-500/25 active:scale-95 transition cursor-pointer"
                title="Hentikan sesi"
              >
                <Square className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[10px] text-zinc-500">
              {isPaused
                ? 'Dijeda — tekan play untuk melanjutkan.'
                : 'Bebas lakukan aktivitas lain. Layar & audio tetap berjalan (wake lock aktif).'}
            </p>
          </CardContent>
        </Card>
      ) : (
        /* ── SETUP ── */
        <>
          <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 rounded-2xl sm:rounded-3xl">
            <CardContent className="p-4 sm:p-5 space-y-5">
              {/* Pilihan mode */}
              <div>
                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">Gaya sesi</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {MODES.map((m) => {
                    const Icon = m.icon;
                    const active = settings.mode === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => patch({ mode: m.id })}
                        className={`text-left p-3 rounded-2xl border transition cursor-pointer ${
                          active
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40'
                            : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400'}`} />
                          <span className={`text-xs font-bold ${active ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
                            {m.label}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] leading-snug text-zinc-500 dark:text-zinc-400">{m.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Level HSK */}
              <div>
                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">Level HSK</p>
                <div className="flex flex-wrap gap-1.5">
                  {[1, 2, 3, 4, 5, 6].map((lvl) => {
                    const active = settings.hskLevels.includes(lvl);
                    return (
                      <button
                        key={lvl}
                        onClick={() => toggleLevel(lvl)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                          active
                            ? 'bg-blue-600 text-white'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                        }`}
                      >
                        HSK {lvl}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pengaturan pacing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Timer className="w-3.5 h-3.5" /> Durasi sesi
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {SESSIONS.map((s) => (
                      <button
                        key={s.min}
                        onClick={() => patch({ sessionMin: s.min })}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                          settings.sessionMin === s.min
                            ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5" /> Jeda antar kata
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {GAPS.map((g) => (
                      <button
                        key={g}
                        onClick={() => patch({ gapSec: g })}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                          settings.gapSec === g
                            ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                        }`}
                      >
                        {g} dtk
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <ToggleRow
                  icon={<Volume2 className="w-4 h-4" />}
                  label="Ucapkan arti (TTS Indonesia)"
                  desc="Lewati otomatis bila perangkat tak punya voice Indonesia."
                  on={settings.speakMeaning}
                  onChange={() => patch({ speakMeaning: !settings.speakMeaning })}
                />
                <ToggleRow
                  icon={<Sparkles className="w-4 h-4" />}
                  label="Denting lembut antar kata"
                  desc="Menarik kembali perhatian tanpa mengganggu."
                  on={settings.chime}
                  onChange={() => patch({ chime: !settings.chime })}
                />
                <ToggleRow
                  icon={<Shuffle className="w-4 h-4" />}
                  label="Acak urutan tiap putaran"
                  desc="Mencegah hafalan posisi, bukan bunyi."
                  on={settings.shuffle}
                  onChange={() => patch({ shuffle: !settings.shuffle })}
                />
                <ToggleRow
                  icon={<Bell className="w-4 h-4" />}
                  label="Notifikasi saat app tidak terlihat"
                  desc="Ping kata di notifikasi sistem (desktop)."
                  on={settings.notifyHidden}
                  onChange={requestNotify}
                />
              </div>

              {/* Tombol mulai */}
              <Button
                onClick={startSession}
                className="w-full h-12 sm:h-14 text-sm sm:text-base font-bold rounded-2xl cursor-pointer"
              >
                <Play className="w-5 h-5 mr-2" />
                Mulai Sesi Pasif
              </Button>
              <p className="text-[11px] text-center text-zinc-400">
                Setelah mulai, tidak perlu interaksi apa pun. Di mobile, layar dijaga tetap menyala.
              </p>
            </CardContent>
          </Card>

          {/* Dasar ilmiah */}
          <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 rounded-2xl sm:rounded-3xl">
            <CardContent className="p-4 sm:p-5">
              <button
                onClick={() => setShowScience((v) => !v)}
                className="w-full flex items-center justify-between cursor-pointer group"
              >
                <span className="text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-500" /> Kenapa dengar pasif itu bekerja?
                </span>
                <span className="text-[11px] font-bold text-zinc-400 group-hover:text-zinc-600">
                  {showScience ? 'Tutup' : 'Baca'}
                </span>
              </button>
              {showScience && (
                <ul className="mt-3 space-y-2 text-[11px] sm:text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 list-disc pl-4">
                  <li>
                    <b>Priming pasif:</b> paparan berulang tanpa usaha membuat otak "siap" — kata yang sudah sering
                    didengar dipelajari lebih cepat saat kamu belajar aktif nanti (Univ. of Oregon, 2024).
                  </li>
                  <li>
                    <b>Spacing effect:</b> pemaparan berjarak (kata muncul lagi di putaran berikutnya, urutan diacak)
                    menghasilkan retensi jangka panjang jauh lebih tinggi daripada mengulang kata yang sama terus-menerus.
                  </li>
                  <li>
                    <b>Scripted listening:</b> dengar buta lemah — karena itu tiap kata disertai jangkar visual sekilas
                    (hanzi + pinyin + arti) dan arti terucap bila voice tersedia.
                  </li>
                  <li>
                    <b>Variasi konteks:</b> mode "Dalam Kalimat" memperkenalkan kata dalam pemakaian nyata — variasi
                    konteks memperkuat jejak memori.
                  </li>
                </ul>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Ringkasan sesi berakhir */}
      {isEnded && (
        <Card className="bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 rounded-2xl sm:rounded-3xl">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{snap.endedReason}</p>
              <p className="text-[11px] sm:text-xs text-emerald-600/70 dark:text-emerald-500/70 mt-0.5">
                {snap.itemsHeard} kata didengar · {fmtSec(snap.sessionElapsedSec)} sesi
              </p>
            </div>
            <Button onClick={startSession} variant="outline" className="shrink-0 rounded-xl cursor-pointer">
              <RotateCcw className="w-4 h-4 mr-1.5" /> Mulai lagi
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  desc,
  on,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  on: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`flex items-start gap-2.5 p-3 rounded-2xl border text-left transition cursor-pointer ${
        on ? 'border-blue-300 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30' : 'border-zinc-200 dark:border-zinc-800'
      }`}
    >
      <span className={`mt-0.5 shrink-0 ${on ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400'}`}>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className={`block text-xs font-bold ${on ? 'text-blue-700 dark:text-blue-300' : 'text-zinc-700 dark:text-zinc-300'}`}>
          {label}
        </span>
        <span className="block text-[10.5px] leading-snug text-zinc-400 mt-0.5">{desc}</span>
      </span>
      <span
        className={`mt-0.5 w-9 h-5 rounded-full relative shrink-0 transition ${
          on ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-700'
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
            on ? 'left-[18px]' : 'left-0.5'
          }`}
        />
      </span>
    </button>
  );
}

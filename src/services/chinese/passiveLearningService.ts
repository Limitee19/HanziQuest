import { FULL_HSK_DATASET } from './dataset';
import { ChineseWord } from './dataset/types';
import { chineseAudioPlayer } from './chineseAudioPlayer';

/**
 * passiveLearningService — MESIN BELAJAR PASIF.
 *
 * Pengguna menekan "Mulai" lalu TIDAK berinteraksi apa pun: app memutar
 * kosakata Mandarin (audio MP3 offline) berulang dengan jeda terjadwal,
 * sempoa pengulangan renggang antar putaran (spacing effect), dan jangkar
 * visual sekilas (hanzi + pinyin + arti) di layar.
 *
 * Prinsip riset yang diterapkan:
 *  - Passive exposure berulang mem-priming otak untuk pembelajaran berikutnya
 *    (Univ. of Oregon, 2024).
 *  - Spacing effect: pemaparan berjarak > pengulangan massal (retensi 80%+).
 *  - Scripted listening: audio dipasangkan konteks tulisan sekilas, bukan
 *    dengar buta (pasif murni tanpa jangkar lemah).
 *  - Variasi urutan antar putaran mencegah hafalan posisi, bukan bunyi.
 *
 * Teknis: SEMUA jeda diputar sebagai "audio hening" (WAV silence) sehingga
 * rantai pemutaran tetap hidup saat app diminimize / layar redup — timer
 * JS di-background di-throttle browser, audio tidak. Wake Lock menjaga
 * layar tetap menyala di mobile.
 */

export type PassiveMode = 'flow' | 'recall' | 'sentence';
export type PassiveStatus = 'idle' | 'playing' | 'paused' | 'ended';

export interface PassiveSettings {
  mode: PassiveMode;
  /** Level HSK yang disertakan (1–6). */
  hskLevels: number[];
  shuffle: boolean;
  /** Berapa kali audio hanzi diulang per kemunculan. */
  repeatWord: 1 | 2 | 3;
  /** Jeda antar item (detik). */
  gapSec: number;
  /** Ucapkan arti Indonesia via TTS (voice lokal; fallback TTS online bila tidak ada). */
  speakMeaning: boolean;
  /** denting lembut saat pindah item (menarik kembali perhatian pasif). */
  chime: boolean;
  /** Durasi sesi (menit); 0 = tanpa batas. */
  sessionMin: number;
  /** Notifikasi sistem saat app tidak terlihat (desktop). */
  notifyHidden: boolean;
}

export const PASSIVE_DEFAULT_SETTINGS: PassiveSettings = {
  mode: 'flow',
  hskLevels: [1, 2, 3],
  shuffle: true,
  repeatWord: 2,
  gapSec: 4,
  speakMeaning: true,
  chime: true,
  sessionMin: 30,
  notifyHidden: false,
};

export interface PassivePhaseInfo {
  phase: 'word' | 'recall' | 'meaning' | 'sentence' | 'gap';
  label: string;
}

export interface PassiveSnapshot {
  status: PassiveStatus;
  mode: PassiveMode;
  word: ChineseWord | null;
  phase: PassivePhaseInfo;
  /** Posisi dalam putaran saat ini (1-based). */
  index: number;
  total: number;
  /** Putaran ke-n (spacing pass). */
  pass: number;
  itemsHeard: number;
  sessionLengthSec: number;
  sessionElapsedSec: number;
  endedReason: string;
}

const SETTINGS_KEY = 'omnilife.passiveLearning.settings';
const STATS_KEY = 'omnilife.passiveLearning.stats';

// ── Settings & statistik (localStorage) ─────────────────────────────────────

export function loadPassiveSettings(): PassiveSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...PASSIVE_DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<PassiveSettings>;
    const merged: PassiveSettings = { ...PASSIVE_DEFAULT_SETTINGS, ...parsed };
    if (!Array.isArray(merged.hskLevels) || merged.hskLevels.length === 0) {
      merged.hskLevels = [...PASSIVE_DEFAULT_SETTINGS.hskLevels];
    }
    return merged;
  } catch {
    return { ...PASSIVE_DEFAULT_SETTINGS };
  }
}

export function savePassiveSettings(s: PassiveSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {
    /* abaikan */
  }
}

export interface PassiveDayStat {
  sec: number;
  items: number;
}

export type PassiveStats = Record<string, PassiveDayStat>; // 'YYYY-MM-DD' → stat

export function loadPassiveStats(): PassiveStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? (JSON.parse(raw) as PassiveStats) : {};
  } catch {
    return {};
  }
}

function todayKey(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

// ── Audio hening untuk jeda (tahan background throttling) ───────────────────

const silenceCache = new Map<number, string>();

function writeAscii(dv: DataView, offset: number, s: string) {
  for (let i = 0; i < s.length; i++) dv.setUint8(offset + i, s.charCodeAt(i));
}

/** WAV hening 8-bit mono 8 kHz — durasi 0.1 s granularity. */
function makeSilenceDataUrl(seconds: number): string {
  const rounded = Math.max(1, Math.round(seconds * 10)) / 10;
  const cached = silenceCache.get(rounded);
  if (cached) return cached;
  const sampleRate = 8000;
  const n = Math.round(rounded * sampleRate);
  const buf = new ArrayBuffer(44 + n);
  const dv = new DataView(buf);
  writeAscii(dv, 0, 'RIFF');
  dv.setUint32(4, 36 + n, true);
  writeAscii(dv, 8, 'WAVE');
  writeAscii(dv, 12, 'fmt ');
  dv.setUint32(16, 16, true);
  dv.setUint16(20, 1, true); // PCM
  dv.setUint16(22, 1, true); // mono
  dv.setUint32(24, sampleRate, true);
  dv.setUint32(28, sampleRate, true);
  dv.setUint16(32, 1, true); // block align
  dv.setUint16(34, 8, true); // bits
  writeAscii(dv, 36, 'data');
  dv.setUint32(40, n, true);
  new Uint8Array(buf, 44).fill(128); // 8-bit silence = 128
  let bin = '';
  const bytes = new Uint8Array(buf);
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + CHUNK)) as unknown as number[]);
  }
  const url = `data:audio/wav;base64,${btoa(bin)}`;
  silenceCache.set(rounded, url);
  return url;
}

// ── Chime lembut (Web Audio, tanpa file) ────────────────────────────────────

let audioCtx: AudioContext | null = null;

function playChime() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    if (!audioCtx) audioCtx = new Ctx();
    if (audioCtx.state === 'suspended') {
      void audioCtx.resume();
    }
    const ctx = audioCtx;
    const now = ctx.currentTime;
    const notes: [number, number][] = [
      [659.25, 0], // E5
      [880.0, 0.18], // A5
    ];
    for (const [freq, delay] of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.06, now + delay + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.9);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + 1);
    }
  } catch {
    /* audio context tidak tersedia — abaikan */
  }
}

// ── Voice Indonesia untuk arti (opsional) ───────────────────────────────────

function findIndonesianVoice(): SpeechSynthesisVoice | null {
  try {
    if (typeof window === 'undefined' || !window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    return voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('id')) || null;
  } catch {
    return null;
  }
}

// ── TTS online (fallback bila voice Indonesia lokal tidak terpasang) ────────
//
// Provider: Sound of Text (api.soundoftext.com) — proxy resmi Google TTS dengan
// voice id-ID. Dipilih karena: (a) API create/poll-nya CORS-friendly,
// (b) translate.google.com langsung diblokir ORB oleh Chromium, dan
// (c) StreamElements sudah mematikan endpoint TTS gratisnya (HTTP 401).
//
// Audio yang berhasil diambil di-cache berlapis (hemat kuota: tiap arti hanya
// disintesis SEKALI):
//   1. Memori (Map)   — nol biaya antar item dalam satu sesi.
//   2. IndexedDB      — persisten di WebView (bertahan antar sesi & offline).
//   3. Disk Tauri     — di desktop, byte MP3 diunduh lewat core Rust (bebas
//                       CORS) lalu disimpan di app_data/tts_cache — sumber
//                       tertua & paling tahan lama.
// Di browser (non-Tauri) MP3 hanya bisa di-STREAM dari CDN-nya (byte-nya
// tidak terbaca JS karena CORS files.soundoftext.com tertutup).

let ttsAudio: HTMLAudioElement | null = null;

function stopOnlineTts() {
  try {
    ttsAudio?.pause();
  } catch {
    /* ignore */
  }
  ttsAudio = null;
}

// ── Cache IndexedDB (audio TTS) ─────────────────────────────────────────────

const TTS_DB_NAME = 'omnilife.ttsCache';
const TTS_STORE = 'audio';
const TTS_VERSION = 'v1'; // bump untuk membuang cache lama

let ttsDbPromise: Promise<IDBDatabase | null> | null = null;
const ttsMemoryCache = new Map<string, string>(); // key → data URL

/** true bila provider online terakhir GAGAL (agar diulang di sesi berikutnya). */
let ttsProviderFailed = false;

function openTtsDb(): Promise<IDBDatabase | null> {
  if (ttsDbPromise) return ttsDbPromise;
  ttsDbPromise = new Promise((resolve) => {
    try {
      if (typeof indexedDB === 'undefined') {
        resolve(null);
        return;
      }
      const req = indexedDB.open(TTS_DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(TTS_STORE)) db.createObjectStore(TTS_STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
      req.onblocked = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
  return ttsDbPromise;
}

function idbGetAudio(key: string): Promise<ArrayBuffer | null> {
  return openTtsDb().then(
    (db) =>
      new Promise((resolve) => {
        if (!db) {
          resolve(null);
          return;
        }
        try {
          const tx = db.transaction(TTS_STORE, 'readonly');
          const req = tx.objectStore(TTS_STORE).get(key);
          req.onsuccess = () => resolve((req.result as ArrayBuffer) ?? null);
          req.onerror = () => resolve(null);
        } catch {
          resolve(null);
        }
      })
  );
}

function idbPutAudio(key: string, buf: ArrayBuffer): void {
  void openTtsDb().then((db) => {
    if (!db) return;
    try {
      const tx = db.transaction(TTS_STORE, 'readwrite');
      tx.objectStore(TTS_STORE).put(buf, key);
    } catch {
      /* cache bersifat best-effort */
    }
  });
}

function arrayBufferToDataUrl(buf: ArrayBuffer, mime: string): string {
  const bytes = new Uint8Array(buf);
  let bin = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + CHUNK)) as unknown as number[]);
  }
  return `data:${mime};base64,${btoa(bin)}`;
}

// ── Sound of Text (proxy Google TTS, voice id-ID) ───────────────────────────

interface SotSound {
  id?: string;
  status?: string; // 'None' | 'Pending' | 'Done' | 'Error'
  location?: string;
}

/** Minta sintesis TTS → kembali ID sound (null bila gagal). */
async function createSoundOfText(text: string): Promise<string | null> {
  try {
    const res = await fetch('https://api.soundoftext.com/sounds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ engine: 'Google', data: { text, voice: 'id-ID' } }),
      signal: AbortSignal.timeout(9000),
    });
    if (!res.ok) return null;
    const j = (await res.json().catch(() => null)) as SotSound | null;
    return j?.id ?? null;
  } catch {
    return null;
  }
}

/** Polling status sound → URL MP3 (null bila gagal / timeout). */
async function pollSoundOfText(id: string): Promise<string | null> {
  try {
    for (let attempt = 0; attempt < 6; attempt++) {
      await new Promise((r) => setTimeout(r, attempt === 0 ? 900 : 700));
      const res = await fetch(`https://api.soundoftext.com/sounds/${id}`, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) return null;
      const j = (await res.json().catch(() => null)) as SotSound | null;
      if (j?.status === 'Done' && j.location) return j.location;
      if (j && j.status !== 'None' && j.status !== 'Pending') return null; // Error
    }
  } catch {
    /* fallthrough */
  }
  return null;
}

// ── Jembatan Tauri (unduh & cache MP3 di disk app, bebas CORS) ──────────────

function tauriInvoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T> | null {
  try {
    const w = window as unknown as {
      __TAURI_INTERNALS__?: { invoke?: <T>(cmd: string, args?: Record<string, unknown>) => Promise<T> };
    };
    const inv = w.__TAURI_INTERNALS__?.invoke;
    if (!inv) return null;
    return inv<T>(cmd, args);
  } catch {
    return null;
  }
}

async function readTauriDiskCache(key: string): Promise<ArrayBuffer | null> {
  const inv = tauriInvoke<number[]>('tts_read_cached_audio', { key });
  if (!inv) return null;
  try {
    const arr = await inv;
    if (!arr || arr.length === 0) return null;
    return Uint8Array.from(arr).buffer as ArrayBuffer;
  } catch {
    return null;
  }
}

async function fetchTauriBytes(url: string, key: string): Promise<ArrayBuffer | null> {
  const inv = tauriInvoke<string>('tts_fetch_bytes', { url, key });
  if (!inv) return null;
  try {
    await inv;
  } catch {
    return null;
  }
  return readTauriDiskCache(key);
}

function objectUrlFromBytes(buf: ArrayBuffer): string {
  return URL.createObjectURL(new Blob([buf], { type: 'audio/mpeg' }));
}

/** Reset status gagal provider agar sesi baru mencoba online lagi. */
export function resetTtsNetworkState(): void {
  ttsProviderFailed = false;
}

// ── Manajemen cache TTS (dipakai halaman Settings) ─────────────────────────

export interface TtsCacheInfo {
  /** Jumlah entri audio tercache. */
  entries: number;
  /** Total ukuran dalam byte. */
  bytes: number;
  /** Sumber cache disk Tauri tersedia (desktop). */
  diskAvailable: boolean;
  /** Ukuran cache disk Tauri dalam byte (0 bila tidak tersedia). */
  diskBytes: number;
}

/** Informasi ukuran cache audio TTS (IndexedDB + disk Tauri). */
export async function getTtsCacheInfo(): Promise<TtsCacheInfo> {
  let entries = 0;
  let bytes = 0;
  try {
    const db = await openTtsDb();
    if (db) {
      entries = await new Promise<number>((resolve) => {
        try {
          const tx = db.transaction(TTS_STORE, 'readonly');
          const req = tx.objectStore(TTS_STORE).count();
          req.onsuccess = () => resolve(req.result || 0);
          req.onerror = () => resolve(0);
        } catch {
          resolve(0);
        }
      });
      bytes = await new Promise<number>((resolve) => {
        try {
          const tx = db.transaction(TTS_STORE, 'readonly');
          const req = tx.objectStore(TTS_STORE).openCursor();
          let total = 0;
          req.onsuccess = () => {
            const cursor = req.result;
            if (cursor) {
              const v = cursor.value;
              if (v instanceof ArrayBuffer) total += v.byteLength;
              cursor.continue();
            } else {
              resolve(total);
            }
          };
          req.onerror = () => resolve(total);
        } catch {
          resolve(0);
        }
      });
    }
  } catch {
    /* cache tidak tersedia */
  }

  let diskAvailable = false;
  let diskBytes = 0;
  try {
    const inv = tauriInvoke<{ entries: number; bytes: number }>('tts_cache_info', {});
    if (inv) {
      const info = await inv;
      diskAvailable = true;
      diskBytes = info?.bytes || 0;
    }
  } catch {
    /* non-Tauri */
  }

  return { entries, bytes, diskAvailable, diskBytes };
}

/** Hapus seluruh cache audio TTS (IndexedDB + disk Tauri). */
export async function clearTtsCache(): Promise<TtsCacheInfo> {
  ttsMemoryCache.clear();
  try {
    const db = await openTtsDb();
    if (db) {
      await new Promise<void>((resolve) => {
        try {
          const tx = db.transaction(TTS_STORE, 'readwrite');
          tx.objectStore(TTS_STORE).clear();
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
          tx.onabort = () => resolve();
        } catch {
          resolve();
        }
      });
    }
  } catch {
    /* abaikan */
  }

  try {
    const inv = tauriInvoke<void>('tts_clear_cache', {});
    if (inv) await inv;
  } catch {
    /* non-Tauri */
  }

  return getTtsCacheInfo();
}

/** Putar satu URL TTS; resolve(true) bila selesai normal, false bila gagal. */
function playOnlineTts(url: string, timeoutMs: number): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      stopOnlineTts();
      const audio = new Audio(url);
      ttsAudio = audio;
      let settled = false;
      const done = (ok: boolean) => {
        if (!settled) {
          settled = true;
          if (ttsAudio === audio) ttsAudio = null;
          resolve(ok);
        }
      };
      audio.onended = () => done(true);
      audio.onerror = () => done(false);
      const p = audio.play();
      if (p) p.catch(() => done(false));
      // Watchdog: tidak ada event sampai batas waktu → anggap gagal agar
      // rantai fallback bisa mencoba provider berikutnya.
      window.setTimeout(() => done(false), timeoutMs);
    } catch {
      resolve(false);
    }
  });
}

/**
 * Ucapkan teks Mandarin via TTS online (Sound of Text, voice zh-CN).
 * Lapisan TERAKHIR rantai suara kartu: dipakai bila MP3 offline tidak ada
 * DAN speechSynthesis lokal gagal (voice Mandarin tak terpasang) — terutama
 * di Android/WebView. Hasilnya di-cache berlapis seperti arti Indonesia.
 * Resolve true bila terdengar.
 */
export async function speakChineseOnline(text: string): Promise<boolean> {
  if (ttsProviderFailed) return false;
  const clean = text.replace(/<[^>]*>/g, '').replace(/\[sound:[^\]]+\]/gi, '').trim();
  if (!clean) return false;
  const timeout = Math.max(6000, clean.length * 250);
  const key = `${TTS_VERSION}:sot-zh:${clean}`;

  try {
    // 1) Memori → 2) IndexedDB → 3) Disk Tauri
    const mem = ttsMemoryCache.get(key);
    if (mem && (await playOnlineTts(mem, timeout))) return true;
    const idb = await idbGetAudio(key);
    if (idb && idb.byteLength > 0) {
      const url = arrayBufferToDataUrl(idb, 'audio/mpeg');
      ttsMemoryCache.set(key, url);
      if (await playOnlineTts(url, timeout)) return true;
    }
    const disk = await readTauriDiskCache(key);
    if (disk && disk.byteLength > 0) {
      idbPutAudio(key, disk);
      const url = objectUrlFromBytes(disk);
      ttsMemoryCache.set(key, url);
      if (await playOnlineTts(url, timeout)) return true;
    }

    // 4) Sintesis online (voice zh-CN)
    const res = await fetch('https://api.soundoftext.com/sounds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ engine: 'Google', data: { text: clean, voice: 'zh-CN' } }),
      signal: AbortSignal.timeout(9000),
    });
    if (!res.ok) {
      ttsProviderFailed = true;
      return false;
    }
    const j = (await res.json().catch(() => null)) as SotSound | null;
    const soundId = j?.id ?? null;
    const location = soundId ? await pollSoundOfText(soundId) : null;
    if (!location) {
      ttsProviderFailed = true;
      return false;
    }
    if (isTauriWebView()) {
      const bytes = await fetchTauriBytes(location, key);
      if (bytes && bytes.byteLength > 0) {
        idbPutAudio(key, bytes);
        const url = objectUrlFromBytes(bytes);
        ttsMemoryCache.set(key, url);
        if (await playOnlineTts(url, timeout)) return true;
      }
      if (await playOnlineTts(location, timeout)) return true;
    } else {
      if (await playOnlineTts(location, timeout)) return true;
    }
    ttsProviderFailed = true;
    return false;
  } catch {
    return false;
  }
}

/**
 * Ucapkan arti Indonesia via TTS online — dipakai saat browser/WebView tidak
 * punya voice 'id' lokal (mis. Windows tanpa paket suara Indonesia).
 * Rantai: memori → IndexedDB → disk Tauri → sintesis Sound of Text
 * (di Tauri byte-nya diunduh lewat core Rust lalu di-cache ke disk).
 */
async function speakIndonesianOnline(text: string): Promise<void> {
  if (ttsProviderFailed) return; // offline / provider mati: jangan menunggu timeout tiap item
  const timeout = Math.max(6000, text.length * 250);
  const key = `${TTS_VERSION}:sot:${text}`;

  // 1) Memori
  const mem = ttsMemoryCache.get(key);
  if (mem && (await playOnlineTts(mem, timeout))) return;

  // 2) IndexedDB
  const cached = await idbGetAudio(key);
  if (cached && cached.byteLength > 0) {
    const url = arrayBufferToDataUrl(cached, 'audio/mpeg');
    ttsMemoryCache.set(key, url);
    if (await playOnlineTts(url, timeout)) return;
  }

  // 3) Disk cache Tauri (IndexedDB di WebView bisa ter-reset oleh OS)
  const disk = await readTauriDiskCache(key);
  if (disk && disk.byteLength > 0) {
    idbPutAudio(key, disk); // cermin ke IndexedDB
    const url = objectUrlFromBytes(disk);
    ttsMemoryCache.set(key, url);
    if (await playOnlineTts(url, timeout)) return;
  }

  // 4) Sintesis online via Sound of Text (voice id-ID)
  const soundId = await createSoundOfText(text);
  const location = soundId ? await pollSoundOfText(soundId) : null;
  if (location) {
    if (isTauriWebView()) {
      // Desktop: unduh byte lewat core Rust (bebas CORS) → disk + IndexedDB
      const bytes = await fetchTauriBytes(location, key);
      if (bytes && bytes.byteLength > 0) {
        idbPutAudio(key, bytes);
        const url = objectUrlFromBytes(bytes);
        ttsMemoryCache.set(key, url);
        if (await playOnlineTts(url, timeout)) return;
      }
      // Unduh gagal tapi koneksi ada → streaming langsung (play-only)
      if (await playOnlineTts(location, timeout)) return;
    } else {
      // Browser: byte MP3 tak terbaca JS (CORS) → streaming langsung
      if (await playOnlineTts(location, timeout)) return;
    }
  }

  ttsProviderFailed = true; // semua gagal → mode offline sampai sesi berikutnya
  console.warn('[passiveLearning] TTS online gagal — arti Indonesia tak terdengar (offline?).');
}

/** Tauri WebView (desktop) — voice lokal sering tak bisa dipercaya di sana. */
function isTauriWebView(): boolean {
  try {
    return typeof window !== 'undefined' &&
      ('__TAURI_INTERNALS__' in window || '__TAURI__' in window);
  } catch {
    return false;
  }
}

function speakIndonesian(text: string): Promise<void> {
  return new Promise((resolve) => {
    try {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        void speakIndonesianOnline(text).then(resolve);
        return;
      }
      const voice = findIndonesianVoice();
      // Di WebView Tauri, voice 'id' lokal sering terpasang tapi bisu / onend-nya
      // tak pernah terpanggil → langsung pakai TTS online (tercache) agar pasti
      // terdengar. Browser biasa tetap prioritaskan voice lokal.
      if (!voice || isTauriWebView()) {
        void speakIndonesianOnline(text).then(resolve);
        return;
      }
      const u = new SpeechSynthesisUtterance(text);
      u.voice = voice;
      u.lang = voice.lang;
      u.rate = 1;
      let settled = false;
      const done = () => {
        if (!settled) {
          settled = true;
          resolve();
        }
      };
      u.onend = done;
      u.onerror = done;
      window.speechSynthesis.speak(u);
      // Watchdog: WebView yang tak pernah memicu onend
      window.setTimeout(done, Math.max(2500, text.length * 120));
    } catch {
      resolve();
    }
  });
}

// ── Mesin ───────────────────────────────────────────────────────────────────

class PassiveLearningEngine {
  private listeners = new Set<(s: PassiveSnapshot) => void>();
  private token = 0;
  private gapAudio: HTMLAudioElement | null = null;

  private settings: PassiveSettings = loadPassiveSettings();
  private queue: ChineseWord[] = [];
  private cursor = 0;
  private pass = 1;

  private sessionStartedAt = 0;
  private pausedAccumMs = 0;
  private lastResumeAt = 0;
  private itemsHeard = 0;
  private endedReason = '';

  private snapshot: PassiveSnapshot = {
    status: 'idle',
    mode: PASSIVE_DEFAULT_SETTINGS.mode,
    word: null,
    phase: { phase: 'gap', label: '' },
    index: 0,
    total: 0,
    pass: 1,
    itemsHeard: 0,
    sessionLengthSec: 0,
    sessionElapsedSec: 0,
    endedReason: '',
  };

  public subscribe(listener: (s: PassiveSnapshot) => void): () => void {
    this.listeners.add(listener);
    listener(this.snapshot);
    return () => this.listeners.delete(listener);
  }

  public getSnapshot(): PassiveSnapshot {
    return this.snapshot;
  }

  public getSettings(): PassiveSettings {
    return this.settings;
  }

  public updateSettings(patch: Partial<PassiveSettings>): PassiveSettings {
    this.settings = { ...this.settings, ...patch };
    savePassiveSettings(this.settings);
    this.patch({});
    return this.settings;
  }

  private patch(p: Partial<PassiveSnapshot>) {
    this.snapshot = { ...this.snapshot, ...p };
    this.listeners.forEach((l) => l(this.snapshot));
  }

  private elapsedSec(): number {
    if (this.sessionStartedAt === 0) return 0;
    const running = this.snapshot.status === 'playing' ? Date.now() - this.lastResumeAt : 0;
    return Math.floor((this.pausedAccumMs + running) / 1000);
  }

  // ── Playlist ──────────────────────────────────────────────────────────────

  private buildQueue(): ChineseWord[] {
    const levels = new Set(this.settings.hskLevels);
    const pool = (FULL_HSK_DATASET as ChineseWord[]).filter((w) => levels.has(w.hskLevel));
    const list = [...pool];
    if (this.settings.shuffle) {
      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const a = list[i];
        const b = list[j];
        if (a && b) {
          list[i] = b;
          list[j] = a;
        }
      }
    }
    return list;
  }

  private nextItem(): ChineseWord | null {
    if (this.queue.length === 0) return null;
    if (this.cursor >= this.queue.length) {
      // Putaran baru: urutan diacak ulang → spacing + variasi konteks.
      this.pass += 1;
      this.cursor = 0;
      if (this.settings.shuffle) {
        for (let i = this.queue.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const a = this.queue[i];
          const b = this.queue[j];
          if (a && b) {
            this.queue[i] = b;
            this.queue[j] = a;
          }
        }
      }
    }
    const item = this.queue[this.cursor];
    this.cursor += 1;
    return item ?? null;
  }

  // ── Pemutaran ─────────────────────────────────────────────────────────────

  /** Jeda berbasis audio hening → tetap berjalan saat app di-background. */
  private gap(seconds: number, myToken: number): Promise<void> {
    return new Promise((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        this.gapAudio = null;
        resolve();
      };
      try {
        const audio = new Audio(makeSilenceDataUrl(seconds));
        this.gapAudio = audio;
        audio.onended = finish;
        audio.onerror = finish;
        const p = audio.play();
        if (p) p.catch(finish);
        // safety net: timeout 2x durasi (bila audio hening diblokir WebView)
        window.setTimeout(() => {
          if (!settled && this.token === myToken && this.snapshot.status !== 'paused') finish();
        }, seconds * 2000 + 1500);
      } catch {
        resolve();
      }
    });
  }

  private stopGapAudio() {
    try {
      this.gapAudio?.pause();
    } catch {
      /* ignore */
    }
    this.gapAudio = null;
  }

  private notifyIfHidden(word: ChineseWord) {
    if (!this.settings.notifyHidden) return;
    try {
      if (typeof document !== 'undefined' && !document.hidden) return;
      if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
      const meaning = (word.meanings[0] || '').slice(0, 60);
      new Notification(`${word.hanzi} · ${word.pinyin}`, {
        body: meaning,
        silent: true,
        tag: 'omnilife-passive',
      });
    } catch {
      /* abaikan */
    }
  }

  public start(settings?: Partial<PassiveSettings>): void {
    if (settings) this.updateSettings(settings);
    this.stopInternal('ganti sesi');

    const myToken = ++this.token;
    this.queue = this.buildQueue();
    if (this.queue.length === 0) {
      this.patch({ status: 'ended', endedReason: 'Tidak ada kata pada level yang dipilih.' });
      return;
    }
    this.cursor = 0;
    this.pass = 1;
    this.itemsHeard = 0;
    this.endedReason = '';
    this.sessionStartedAt = Date.now();
    this.pausedAccumMs = 0;
    this.lastResumeAt = Date.now();
    this.lastFlushedSec = 0;
    this.lastFlushedItems = 0;

    this.patch({
      status: 'playing',
      mode: this.settings.mode,
      word: null,
      index: 0,
      total: this.queue.length,
      pass: 1,
      itemsHeard: 0,
      sessionLengthSec: this.settings.sessionMin * 60,
      sessionElapsedSec: 0,
      endedReason: '',
    });

    void this.requestWakeLock();
    void this.loop(myToken);
  }

  private async loop(myToken: number): Promise<void> {
    const s = this.settings;
    while (!this.isCancelled(myToken)) {
      // Batas sesi
      if (s.sessionMin > 0 && this.elapsedSec() >= s.sessionMin * 60) {
        this.end(myToken, 'Sesi selesai. Istirahat yang baik! 🎧');
        return;
      }
      const word = this.nextItem();
      if (!word || this.isCancelled(myToken)) break;

      this.patch({
        word,
        index: this.cursor,
        pass: this.pass,
        phase: { phase: 'word', label: `Dengarkan (${this.settings.repeatWord > 1 ? 'diulang ' + this.settings.repeatWord + '×' : 'sekali'})` },
        sessionElapsedSec: this.elapsedSec(),
      });
      this.notifyIfHidden(word);

      // 1) Hanzi — diulang sesuai pengaturan
      await chineseAudioPlayer.playText(word.hanzi);
      if (this.isCancelled(myToken)) break;
      if (s.repeatWord >= 2) {
        await this.gap(0.9, myToken);
        if (this.isCancelled(myToken)) break;
        await chineseAudioPlayer.playText(word.hanzi);
        if (this.isCancelled(myToken)) break;
      }
      if (s.repeatWord >= 3) {
        await this.gap(0.9, myToken);
        if (this.isCancelled(myToken)) break;
        await chineseAudioPlayer.playText(word.hanzi);
        if (this.isCancelled(myToken)) break;
      }

      const hasSentence = !!(word.exampleSentences && word.exampleSentences[0]);

      // 2) Konteks per mode
      if (s.mode === 'recall') {
        this.patch({ phase: { phase: 'recall', label: 'Ingat artinya…' }, sessionElapsedSec: this.elapsedSec() });
        await this.gap(Math.max(2, s.gapSec), myToken);
        if (this.isCancelled(myToken)) break;
        this.patch({ phase: { phase: 'meaning', label: 'Arti:' }, sessionElapsedSec: this.elapsedSec() });
        await this.speakMeaning(word);
      } else if (s.mode === 'sentence' && hasSentence) {
        const sent = word.exampleSentences![0]!;
        this.patch({ phase: { phase: 'sentence', label: 'Dalam kalimat:' }, sessionElapsedSec: this.elapsedSec() });
        await this.gap(0.5, myToken);
        if (this.isCancelled(myToken)) break;
        await chineseAudioPlayer.playText(sent.hanzi);
        if (this.isCancelled(myToken)) break;
        await this.speakMeaning(word);
      } else {
        // flow
        this.patch({ phase: { phase: 'meaning', label: 'Arti:' }, sessionElapsedSec: this.elapsedSec() });
        await this.gap(0.4, myToken);
        if (this.isCancelled(myToken)) break;
        await this.speakMeaning(word);
      }
      if (this.isCancelled(myToken)) break;

      this.itemsHeard += 1;
      if (this.itemsHeard % 10 === 0) this.flushStats();
      this.patch({ itemsHeard: this.itemsHeard, sessionElapsedSec: this.elapsedSec() });

      // 3) Jeda antar item
      if (s.chime) playChime();
      this.patch({ phase: { phase: 'gap', label: 'Jeda…' }, sessionElapsedSec: this.elapsedSec() });
      await this.gap(Math.max(1, s.gapSec), myToken);
    }

    if (!this.isCancelled(myToken)) {
      this.end(myToken, this.endedReason || 'Putaran selesai.');
    }
  }

  private async speakMeaning(word: ChineseWord): Promise<void> {
    if (!this.settings.speakMeaning) return;
    const meaning = word.meanings.filter(Boolean).slice(0, 2).join(', ');
    if (!meaning) return;
    await speakIndonesian(meaning);
  }

  private isCancelled(myToken: number): boolean {
    return this.token !== myToken;
  }

  private end(myToken: number, reason: string) {
    if (this.isCancelled(myToken)) return;
    this.token++; // batalkan loop
    this.stopGapAudio();
    chineseAudioPlayer.stop();
    stopOnlineTts();
    this.flushStats();
    this.releaseWakeLock();
    this.patch({
      status: 'ended',
      phase: { phase: 'gap', label: reason },
      endedReason: reason,
      sessionElapsedSec: this.elapsedSec(),
    });
  }

  private stopInternal(reason: string) {
    this.token++;
    this.stopGapAudio();
    chineseAudioPlayer.stop();
    stopOnlineTts();
    this.flushStats();
    this.releaseWakeLock();
    this.endedReason = reason;
  }

  // ── Kontrol publik ────────────────────────────────────────────────────────

  public pause(): void {
    if (this.snapshot.status !== 'playing') return;
    this.pausedAccumMs += Date.now() - this.lastResumeAt;
    chineseAudioPlayer.pause();
    this.stopGapAudio(); // jeda hening dibuang; loop lanjut setelah resume
    stopOnlineTts(); // arti Indonesia (TTS online) ikut berhenti saat dijeda
    this.patch({ status: 'paused', sessionElapsedSec: this.elapsedSec() });
  }

  public resume(): void {
    if (this.snapshot.status !== 'paused') return;
    this.lastResumeAt = Date.now();
    chineseAudioPlayer.resume();
    this.patch({ status: 'playing' });
    // Loop sedang menunggu playText/gap yang sudah "selesai" saat pause —
    // gap yang dibuang akan resolve via safety net; audio berikutnya lanjut.
    // Untuk memastikan kelanjutan segera, dorong tick kecil:
    try {
      const myToken = this.token;
      window.setTimeout(() => {
        if (!this.isCancelled(myToken) && this.snapshot.status === 'playing') {
          this.patch({ sessionElapsedSec: this.elapsedSec() });
        }
      }, 250);
    } catch {
      /* ignore */
    }
  }

  public stop(reason = 'Sesi dihentikan.'): void {
    if (this.snapshot.status === 'idle') return;
    this.stopInternal(reason);
    this.patch({ status: 'ended', endedReason: reason, sessionElapsedSec: this.elapsedSec() });
  }

  public skip(direction: 1 | -1): void {
    if (this.snapshot.status === 'idle') return;
    this.cursor = Math.max(0, Math.min(this.queue.length, this.cursor + direction));
    this.stopGapAudio();
    chineseAudioPlayer.stop(); // memotong audio saat ini → loop lanjut ke item berikut
    stopOnlineTts();
  }

  // ── Wake Lock (mobile: layar tetap menyala) ───────────────────────────────

  private wakeLock: { release: () => Promise<void> } | null = null;

  private async requestWakeLock(): Promise<void> {
    try {
      const nav = navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<{ release: () => Promise<void>; addEventListener?: (e: string, cb: () => void) => void }> } };
      if (!nav.wakeLock || this.wakeLock) return;
      const lock = await nav.wakeLock.request('screen');
      this.wakeLock = lock;
      lock.addEventListener?.('release', () => {
        this.wakeLock = null;
      });
    } catch {
      /* wake lock tidak tersedia — abaikan */
    }
  }

  private releaseWakeLock(): void {
    try {
      void this.wakeLock?.release();
    } catch {
      /* ignore */
    }
    this.wakeLock = null;
  }

  /** Panggil saat halaman kembali terlihat — wake lock perlu di-request ulang. */
  public reacquireWakeLockIfPlaying(): void {
    if (this.snapshot.status === 'playing') void this.requestWakeLock();
  }

  // ── Statistik (akumulasi delta agar banyak sesi per hari terjumlah benar) ─

  private lastFlushedSec = 0;
  private lastFlushedItems = 0;

  public flushStats(): void {
    try {
      const elapsed = this.elapsedSec();
      const dSec = Math.max(0, elapsed - this.lastFlushedSec);
      const dItems = Math.max(0, this.itemsHeard - this.lastFlushedItems);
      if (dSec === 0 && dItems === 0) return;
      this.lastFlushedSec = elapsed;
      this.lastFlushedItems = this.itemsHeard;
      const stats = loadPassiveStats();
      const key = todayKey();
      const prev = stats[key] || { sec: 0, items: 0 };
      stats[key] = { sec: prev.sec + dSec, items: prev.items + dItems };
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch {
      /* abaikan */
    }
  }
}

export const passiveLearning = new PassiveLearningEngine();

// Re-acquire wake lock ketika tab kembali terlihat
if (typeof document !== 'undefined') {
  try {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) passiveLearning.reacquireWakeLockIfPlaying();
    });
  } catch {
    /* ignore */
  }
}

/**
 * speechService — voice I/O for OmniLife AI.
 *
 * STT: Groq Whisper (whisper-large-v3) via the OpenAI-compatible
 * /audio/transcriptions endpoint, dengan FALLBACK Gemini (inline audio)
 * bila key Groq kosong / kuota habis (HTTP 429) — cukup satu API key gratis
 * untuk tetap bisa pakai mic.
 * TTS: built-in Web Speech API (works in Android WebView; already proven
 * in this app by the Chinese vocabulary pronunciation feature).
 */

const GROQ_TRANSCRIPTIONS_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';

/** MIME type of a recorded MediaRecorder blob (empty string when unknown). */
function blobMimeType(blob: Blob): string {
  return (blob as Blob & { type?: string }).type || '';
}

/** Blob → base64 (tanpa prefix data URL) untuk inline_data Gemini. */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      const idx = result.indexOf(',');
      resolve(idx >= 0 ? result.slice(idx + 1) : result);
    };
    reader.onerror = () => reject(new Error('Gagal membaca rekaman audio.'));
    reader.readAsDataURL(blob);
  });
}

/**
 * STT via Gemini: kirim rekaman sebagai inline_data, minta transkrip verbatim.
 * Dipakai sebagai fallback saat Groq tidak tersedia (tanpa key / HTTP 429).
 */
async function transcribeWithGemini(blob: Blob, apiKey: string, model = 'gemini-flash-lite-latest'): Promise<string> {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('Tidak ada API key untuk transkripsi (Groq maupun Gemini). Buka Settings AI.');
  }
  const mime = blobMimeType(blob) || 'audio/webm';
  const base64 = await blobToBase64(blob);
  const url = `${GEMINI_BASE}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey.trim())}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        role: 'user',
        parts: [
          { text: 'Transcribe this audio recording verbatim. The speech is most likely Indonesian. Reply with ONLY the transcript text, no commentary, no punctuation added.' },
          { inlineData: { mimeType: mime, data: base64 } },
        ],
      }],
      generationConfig: { temperature: 0 },
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`Transkripsi Gemini gagal (HTTP ${response.status}): ${errText.slice(0, 180)}`);
  }
  const data = await response.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const text = parts.map((p: any) => p.text || '').join('').trim();
  if (!text) throw new Error('Gemini tidak mendeteksi ucapan. Coba bicara lebih dekat ke mikrofon.');
  return text;
}

/**
 * Transcribes a recorded audio blob using Groq's free-tier Whisper model.
 * `model` defaults to whisper-large-v3; whisper-large-v3-turbo is a faster
 * alternative also available on the free tier.
 *
 * Opsi `fallback`: bila key Groq kosong ATAU Groq menolak (429/401),
 * dan Gemini key tersedia → transkripsi via Gemini sehingga mic tetap jalan.
 */
export async function transcribeAudio(
  blob: Blob,
  apiKey: string,
  model = 'whisper-large-v3',
  fallback?: { geminiApiKey?: string; geminiModel?: string }
): Promise<string> {
  const geminiKey = fallback?.geminiApiKey?.trim() || '';
  const geminiModel = fallback?.geminiModel?.trim() || 'gemini-flash-lite-latest';
  const groqKey = apiKey?.trim() || '';

  // Tanpa key Groq → langsung Gemini (jika ada).
  if (!groqKey) {
    return transcribeWithGemini(blob, geminiKey, geminiModel);
  }

  const ext = (() => {
    const mime = blobMimeType(blob);
    return mime.includes('webm') ? 'webm' : mime.includes('ogg') ? 'ogg' : mime.includes('mp4') ? 'mp4' : 'webm';
  })();

  const form = new FormData();
  form.append('file', blob, `recording.${ext}`);
  form.append('model', model);
  form.append('response_format', 'json');
  // Indonesian is the dominant language; hinting it improves accuracy without
  // disabling code-switching to English terms.
  form.append('language', 'id');

  const response = await fetch(GROQ_TRANSCRIPTIONS_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${groqKey}` },
    body: form,
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    // Kuota/kunci Groq bermasalah → coba Gemini bila tersedia.
    if ((response.status === 429 || response.status === 401 || response.status === 403) && geminiKey) {
      return transcribeWithGemini(blob, geminiKey, geminiModel);
    }
    throw new Error(`Transkripsi gagal (HTTP ${response.status}): ${errText.slice(0, 180)}`);
  }

  const data = (await response.json()) as { text?: string };
  const text = (data.text || '').trim();
  if (!text) throw new Error('Tidak ada ucapan yang terdeteksi. Coba bicara lebih dekat ke mikrofon.');
  return text;
}

/**
 * True when this WebView/environment supports mic recording via MediaRecorder.
 *
 * Android WebView (wry): `navigator.mediaDevices` baru eksis setelah WebView
 * siap penuh — pengecekan sekali saat mount bisa false negatif. Fungsi ini
 * selalu mengecek ulang saat dipanggil (tidak pernah di-cache), dan
 * `waitForMicSupport()` memberi grace period singkat sebelum menyatakan
 * tidak didukung.
 */
export function isMicSupported(): boolean {
  try {
    return typeof navigator !== 'undefined'
      && !!navigator.mediaDevices
      && typeof navigator.mediaDevices.getUserMedia === 'function'
      && typeof (window as any).MediaRecorder === 'function';
  } catch {
    return false;
  }
}

/**
 * Tunggu hingga mediaDevices tersedia (Android WebView bisa terlambat
 * meng-inisialisasi). Resolve true bila siap dalam `timeoutMs`, false jika
 * tetap tidak ada.
 */
export async function waitForMicSupport(timeoutMs = 1500): Promise<boolean> {
  if (isMicSupported()) return true;
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    await new Promise((r) => setTimeout(r, 120));
    if (isMicSupported()) return true;
  }
  return false;
}

/** One-shot mic recording helper: request permission, record, stop → blob. */
export class MicRecorder {
  private stream: MediaStream | null = null;
  private recorder: MediaRecorder | null = null;
  private chunks: BlobPart[] = [];

  async start(): Promise<void> {
    // WebView Android bisa lambat mengekspos mediaDevices — tunggu sebentar.
    if (!isMicSupported()) {
      const ready = await waitForMicSupport();
      if (!ready) {
        throw new Error('Perekaman tidak didukung WebView ini. Perbarui WebView/System WebView Android lalu coba lagi.');
      }
    }
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
    } catch (err) {
      // NotAllowedError = izin OS/browser ditolak; NotFoundError = tidak ada mic.
      if (err instanceof Error) throw err;
      throw new Error('Mikrofon tidak dapat diakses. Coba lagi.');
    }
    this.chunks = [];
    // Pick a mime the Android WebView actually supports, in order of preference.
    const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'];
    const mimeType = candidates.find((t) => MediaRecorder.isTypeSupported?.(t));
    this.recorder = mimeType ? new MediaRecorder(this.stream, { mimeType }) : new MediaRecorder(this.stream);
    this.recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) this.chunks.push(e.data);
    };
    this.recorder.start(250);
  }

  /** Stops recording and resolves with the encoded audio blob. */
  stop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.recorder) {
        reject(new Error('Perekaman belum dimulai.'));
        return;
      }
      this.recorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: this.recorder?.mimeType || 'audio/webm' });
        this.cleanup();
        resolve(blob);
      };
      this.recorder.onerror = () => {
        this.cleanup();
        reject(new Error('Perekaman gagal. Coba lagi.'));
      };
      try {
        this.recorder.stop();
      } catch (err) {
        this.cleanup();
        reject(err instanceof Error ? err : new Error('Perekaman gagal dihentikan.'));
      }
    });
  }

  cancel(): void {
    try { this.recorder?.stop(); } catch { /* already stopped */ }
    this.cleanup();
  }

  private cleanup(): void {
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.recorder = null;
    this.chunks = [];
  }
}

/* ------------------------------------------------------------------ */
/* TTS — read AI answers aloud with the built-in Web Speech API        */
/* ------------------------------------------------------------------ */

/** True when speech synthesis is available (Android WebView: yes). */
export function isTtsSupported(): boolean {
  try {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  } catch {
    return false;
  }
}

/** Finds an Indonesian voice when installed, else falls back to the default. */
function pickVoice(utterance: SpeechSynthesisUtterance): void {
  const voices = window.speechSynthesis.getVoices();
  const idVoice = voices.find((v) => v.lang?.toLowerCase().startsWith('id'));
  if (idVoice) utterance.voice = idVoice;
  utterance.lang = idVoice?.lang || 'id-ID';
}

/** Strips markdown noise so TTS reads prose, not symbols. */
function speakableText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' (blok kode) ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~>|]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Speaks the given text. Resolves when speech finishes or is superseded.
 * Only one utterance plays at a time — calling again cancels the previous.
 */
export function speakText(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!isTtsSupported()) {
      reject(new Error('Text-to-speech tidak didukung perangkat ini.'));
      return;
    }
    const clean = speakableText(text);
    if (!clean) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.02;
    utterance.pitch = 1;
    // getVoices() may be empty until voiceschanged fires; pick lazily.
    pickVoice(utterance);
    if (!utterance.voice) {
      const onVoices = () => {
        pickVoice(utterance);
        window.speechSynthesis.onvoiceschanged = null;
      };
      window.speechSynthesis.onvoiceschanged = onVoices;
    }
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve(); // user-interrupted speech is not an error
    window.speechSynthesis.speak(utterance);
  });
}

/** Stops any ongoing speech. */
export function stopSpeaking(): void {
  try {
    window.speechSynthesis.cancel();
  } catch { /* not supported */ }
}

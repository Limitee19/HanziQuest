import { getAudioDataUrl } from './hanziAssets';
import { speakChineseOnline } from './passiveLearningService';

export interface ChineseAudio {
  audioId: string;
  contentId: string;
  contentType: 'word' | 'sentence';
  text: string; // e.g. "你" or "你好"
  pinyin?: string;
  speed: number; // 0.75, 1.0, 1.25
}

export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

/**
 * ChineseAudioPlayerService — memutar audio Mandarin dengan strategi:
 *  1) Audio MP3 ASLI yang dibundle offline (public/hanzi, hasil build script).
 *     Tidak butuh internet Dan tidak bergantung voice Mandarin perangkat.
 *  2) Fallback: TTS bawaan (speechSynthesis zh-CN) bila MP3 belum tersedia.
 */
class ChineseAudioPlayerService {
  private currentStatus: PlaybackStatus = 'idle';
  private currentSpeed: number = 1.0;
  private currentAudio: HTMLAudioElement | null = null;
  private currentObjectUrl: string | null = null;
  private listeners: Set<(status: PlaybackStatus) => void> = new Set();

  public subscribeStatus(listener: (status: PlaybackStatus) => void): () => void {
    this.listeners.add(listener);
    listener(this.currentStatus);
    return () => this.listeners.delete(listener);
  }

  private notifyStatus(status: PlaybackStatus) {
    this.currentStatus = status;
    this.listeners.forEach((l) => l(status));
  }

  public getStatus(): PlaybackStatus {
    return this.currentStatus;
  }

  public getSpeed(): number {
    return this.currentSpeed;
  }

  public setSpeed(speed: number) {
    this.currentSpeed = speed;
  }

  private cleanupAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    if (this.currentObjectUrl) {
      URL.revokeObjectURL(this.currentObjectUrl);
      this.currentObjectUrl = null;
    }
  }

  public stop() {
    this.cleanupAudio();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.notifyStatus('idle');
  }

  /** Jeda pemutaran saat ini (audio MP3 / TTS). Aman dipanggil kapan pun. */
  public pause() {
    try {
      this.currentAudio?.pause();
    } catch {
      /* ignore */
    }
    try {
      window.speechSynthesis?.pause();
    } catch {
      /* ignore */
    }
    if (this.currentStatus === 'playing') this.notifyStatus('paused');
  }

  /** Lanjutkan pemutaran yang dijeda. */
  public resume() {
    try {
      void this.currentAudio?.play();
    } catch {
      /* ignore */
    }
    try {
      window.speechSynthesis?.resume();
    } catch {
      /* ignore */
    }
    if (this.currentStatus === 'paused') this.notifyStatus('playing');
  }

  /** Pemutaran via <audio> dengan elemen Web Audio opsional (mengubah laju). */
  public playText(text: string, speed: number = this.currentSpeed): Promise<void> {
    this.currentSpeed = speed;
    return new Promise((resolve) => {
      this.cleanupAudio();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      this.notifyStatus('loading');

      let settled = false;
      const finish = (status: PlaybackStatus) => {
        if (settled) return;
        settled = true;
        this.notifyStatus(status);
        resolve();
      };

      const finishError = () => {
        if (settled) return;
        // LAPISAN TERAKHIR: TTS online zh-CN (Sound of Text via proxy Rust,
        // tercache). Menyelamatkan perangkat tanpa voice Mandarin lokal.
        speakChineseOnline(text).then((ok) => finish(ok ? 'idle' : 'error'));
      };

      const fallbackToTts = () => {
        if (typeof window === 'undefined' || !window.speechSynthesis) {
          finishError();
          return;
        }
        try {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'zh-CN';
          utterance.rate = speed;
          utterance.pitch = 1.0;
          utterance.onstart = () => this.notifyStatus('playing');
          utterance.onend = () => finish('idle');
          utterance.onerror = () => finishError();
          window.speechSynthesis.speak(utterance);
          // Beberapa WebView tidak pernah memicu onstart/onend — watchdog:
          // jangan finish('error') selagi speechSynthesis SEDANG bicara/pending,
          // dan beri waktu lebih longgar (2.5s) — mobile lambat memulai voice.
          window.setTimeout(() => {
            if (!settled && !window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
              finishError();
            }
          }, 2500);
        } catch {
          finishError();
        }
      };

      getAudioDataUrl(text)
        .then((dataUrl) => {
          if (settled) return;
          if (!dataUrl) {
            fallbackToTts();
            return;
          }
          try {
            // Konversi data URL → object URL agar aman untuk audio besar.
            const byteStr = atob(dataUrl.slice(dataUrl.indexOf(',') + 1));
            const bytes = new Uint8Array(byteStr.length);
            for (let i = 0; i < byteStr.length; i++) bytes[i] = byteStr.charCodeAt(i);
            const blob = new Blob([bytes], { type: 'audio/mpeg' });
            this.currentObjectUrl = URL.createObjectURL(blob);
            const audio = new Audio(this.currentObjectUrl);
            this.currentAudio = audio;
            audio.playbackRate = Math.max(0.5, Math.min(2, speed));
            audio.onended = () => finish('idle');
            audio.onerror = () => fallbackToTts();
            const p = audio.play();
            if (p) p.catch(() => fallbackToTts());
            // Autoplay ditolak WebView (belum ada gesture) — fallback TTS dijalankan
            // lewat catch di atas; status 'playing' baru setelah play() benar-benar sukses.
            if (!p) {
              this.notifyStatus('playing');
            } else {
              p.then(() => this.notifyStatus('playing')).catch(() => { /* fallback sudah jalan */ });
            }
          } catch {
            fallbackToTts();
          }
        })
        .catch(() => fallbackToTts());
    });
  }
}

export const chineseAudioPlayer = new ChineseAudioPlayerService();

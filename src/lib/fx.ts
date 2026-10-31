/**
 * Audio FX Dan Tactile Feedback for Hanzi Quest style
 */

let activeAudioPlayer: HTMLAudioElement | null = null;

/** Native Mandarin Chinese pronunciation with multi-tier fallback (Google TTS -> Youdao -> Web Speech) */
export function speakHanzi(text: string) {
  if (!text || typeof window === 'undefined') return;

  // Bersihkan tag HTML dan tanda petik
  const clean = text.replace(/<[^>]*>/g, '').replace(/[“”"']/g, '').trim();
  if (!clean) return;

  try {
    // Hentikan audio sebelumnya jika sedang berjalan
    if (activeAudioPlayer) {
      activeAudioPlayer.pause();
      activeAudioPlayer.currentTime = 0;
      activeAudioPlayer = null;
    }

    const encoded = encodeURIComponent(clean);
    // 1. Google Translate TTS zh-CN (sangat stabil untuk kata tunggal maupun kalimat panjang)
    const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=zh-CN&client=tw-ob&q=${encoded}`;
    const audio = new Audio(googleUrl);
    activeAudioPlayer = audio;
    audio.playbackRate = 0.95;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // 2. Fallback Youdao dictvoice
        const youdaoUrl = `https://dict.youdao.com/dictvoice?audio=${encoded}&le=zh`;
        const ydAudio = new Audio(youdaoUrl);
        activeAudioPlayer = ydAudio;
        ydAudio.playbackRate = 0.95;
        const ydPromise = ydAudio.play();
        if (ydPromise !== undefined) {
          ydPromise.catch(() => {
            fallbackSpeechSynthesis(clean);
          });
        }
      });
    }
  } catch {
    fallbackSpeechSynthesis(clean);
  }
}

function fallbackSpeechSynthesis(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    u.rate = 0.85;
    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find((v) => v.lang.startsWith('zh') || v.lang.includes('Chinese'));
    if (zhVoice) u.voice = zhVoice;
    window.speechSynthesis.speak(u);
  } catch {
    /* ignore */
  }
}

export function clickTick(enabled: boolean = true) {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(580, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(840, ctx.currentTime + 0.05);
    g.gain.setValueAtTime(0.08, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.06);
    setTimeout(() => ctx.close().catch(() => {}), 100);
  } catch {
    /* ignore */
  }
}

export function playSuccessChime(enabled: boolean = true) {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.value = freq;
      const start = ctx.currentTime + idx * 0.07;
      g.gain.setValueAtTime(0.06, start);
      g.gain.exponentialRampToValueAtTime(0.001, start + 0.18);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(start);
      o.stop(start + 0.19);
    });
    setTimeout(() => ctx.close().catch(() => {}), 600);
  } catch {
    /* ignore */
  }
}

export function playErrorBuzz(enabled: boolean = true) {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(220, ctx.currentTime);
    o.frequency.linearRampToValueAtTime(160, ctx.currentTime + 0.12);
    g.gain.setValueAtTime(0.06, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.14);
    setTimeout(() => ctx.close().catch(() => {}), 200);
  } catch {
    /* ignore */
  }
}

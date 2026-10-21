/**
 * Audio FX & Tactile Feedback for Hanzi Quest style
 */

/** Native Mandarin Chinese pronunciation with multi-tier fallback */
export function speakHanzi(text: string) {
  if (!text || typeof window === 'undefined') return;

  try {
    const encoded = encodeURIComponent(text.trim());
    const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encoded}&le=zh`;
    const audio = new Audio(audioUrl);
    audio.playbackRate = 0.95;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        fallbackSpeechSynthesis(text);
      });
    }
  } catch {
    fallbackSpeechSynthesis(text);
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

/**
 * quizSfx — efek suara Dan audio Mandarin untuk kuis (offine-first).
 *
 *  - SFX benar/salah: dibangkitkan lokal via Web Audio API (oscillator)
 *    → tidak butuh file Dan tidak butuh internet, selalu tersedia.
 *  - Suara hanzi: memutar MP3 offline lewat chineseAudioPlayer (data set
 *    build script), fallback otomatis ke TTS bila file belum ada.
 */
import { chineseAudioPlayer } from './chineseAudioPlayer';
import { isQuizSfxEnabled } from './sfxSettings';

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

/** Nada desakan pendek (jadul "correct"). */
function blip(c: AudioContext, freq: number, start: number, dur: number, gain = 0.18, type: OscillatorType = 'sine') {
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime + start);
  g.gain.setValueAtTime(0.0001, c.currentTime + start);
  g.gain.exponentialRampToValueAtTime(gain, c.currentTime + start + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
  osc.connect(g).connect(c.destination);
  osc.start(c.currentTime + start);
  osc.stop(c.currentTime + start + dur + 0.05);
}

/** SFX jawaban BENAR — dua nada naik ceria. */
export function playCorrectSfx(): void {
  if (!isQuizSfxEnabled()) return;
  try {
    const c = getCtx();
    if (!c) return;
    blip(c, 880, 0, 0.12);
    blip(c, 1318.5, 0.1, 0.18); // E6
  } catch {
    /* audio tidak tersedia — abaikan */
  }
}

/** SFX jawaban SALAH — nada rendah ganda "mencoba lagi". */
export function playWrongSfx(): void {
  if (!isQuizSfxEnabled()) return;
  try {
    const c = getCtx();
    if (!c) return;
    blip(c, 220, 0, 0.16, 0.16, 'triangle');
    blip(c, 174.6, 0.13, 0.22, 0.16, 'triangle'); // F3
  } catch {
    /* audio tidak tersedia — abaikan */
  }
}

/** SFX ronde selesai — fanfare pendek naik 3 nada. */
export function playFinishSfx(): void {
  if (!isQuizSfxEnabled()) return;
  try {
    const c = getCtx();
    if (!c) return;
    blip(c, 659.3, 0, 0.12); // E5
    blip(c, 784, 0.12, 0.12); // G5
    blip(c, 1046.5, 0.24, 0.25); // C6
  } catch {
    /* audio tidak tersedia — abaikan */
  }
}

/** Ucapkan teks Mandarin (hanzi/kalimat) — MP3 offline dulu, fallback TTS. */
export function speakChinese(text: string): Promise<void> {
  return chineseAudioPlayer.playText(text, chineseAudioPlayer.getSpeed());
}

/**
 * sfxSettings — preferensi efek suara kuis (benar/salah/selesai).
 * Tersimpan di localStorage agar persisten antar sesi.
 * Default: AKTIF.
 */

const KEY = 'omnilife.quizSfxEnabled';

export function isQuizSfxEnabled(): boolean {
  try {
    const v = localStorage.getItem(KEY);
    return v === null ? true : v === '1';
  } catch {
    return true;
  }
}

export function setQuizSfxEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(KEY, enabled ? '1' : '0');
  } catch {
    /* penyimpanan tidak tersedia — abaikan */
  }
}

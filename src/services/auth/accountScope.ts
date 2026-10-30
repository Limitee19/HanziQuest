/**
 * accountScope.ts
 * ────────────────
 * Sumber tunggal aturan partisi data per-akun (multi-akun & multi-device).
 *
 * Semua data pembelajaran (progres, streak, runtutan hari / Program Harian,
 * flashcard SRS, preferensi belajar) WAJIB terikat pada akun yang sedang
 * aktif, sehingga login di PC / HP / browser lain menghasilkan data yang sama.
 *
 * Aturan:
 *  - SQLite (mandarin.db) TABEL SCOPED  → kolom `user_id` + row id terprefiks
 *    `${uid}::${id}` agar PK unik lintas akun pada satu device.
 *  - localStorage                       → key base + suffix `-${uid}`.
 *  - Supabase                           → kolom `user_id` (tabel scoped).
 *  - Akun tamu (usr_guest)              → TIDAK menyentuh cloud, tetap scoped
 *    lokal dengan uid 'usr_guest'.
 */

import { getActiveUserId } from './classAuthService';

/** Separator row-id scoped di SQLite/Supabase. */
export const SCOPED_ROW_SEPARATOR = '::';

/** Tabel SQLite/Supabase yang berisi data khusus per akun. */
export const USER_SCOPED_TABLES = [
  'chinese_program_progress',
  'chinese_program_log',
  'learning_decks',
  'flashcard_notes',
  'flashcard_cards',
] as const;

export function isUserScopedTable(table: string): boolean {
  return (USER_SCOPED_TABLES as readonly string[]).includes(table);
}

/** Id akun aktif saat ini ('usr_guest' bila tamu). */
export function currentUserId(): string {
  return getActiveUserId();
}

/** Apakah akun aktif saat ini adalah tamu (tanpa cloud). */
export function isGuestActive(): boolean {
  return currentUserId() === 'usr_guest';
}

/** Bungkus id mentah menjadi row-id milik akun aktif. */
export function scopedRowId(rawId: string, userId?: string): string {
  const uid = userId || currentUserId();
  if (!rawId || rawId.includes(SCOPED_ROW_SEPARATOR)) return rawId;
  return `${uid}${SCOPED_ROW_SEPARATOR}${rawId}`;
}

/** Ambil id mentah dari row-id berprefiks — legacy tanpa prefiks tetap valid. */
export function rawIdFromScopedRowId(rowId: string | null | undefined): string {
  if (!rowId) return '';
  const idx = rowId.indexOf(SCOPED_ROW_SEPARATOR);
  return idx >= 0 ? rowId.slice(idx + SCOPED_ROW_SEPARATOR.length) : rowId;
}

/** Baca uid pemilik dari row-id berprefiks. */
export function ownerFromScopedRowId(rowId: string | null | undefined): string | null {
  if (!rowId) return null;
  const idx = rowId.indexOf(SCOPED_ROW_SEPARATOR);
  return idx >= 0 ? rowId.slice(0, idx) : null;
}

/** Key localStorage berprefiks akun aktif (legacy global tetap dipakai fallback). */
export function scopedPrefKey(base: string, userId?: string): string {
  return `${base}__${userId || currentUserId()}`;
}

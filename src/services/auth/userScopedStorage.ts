/**
 * userScopedStorage.ts
 * ─────────────────────
 * Helper localStorage per-akun untuk preferensi belajar (target sesi,
 * suara, arcade, dsb). Logika baca:
 *   1. Key scoped-per-akun (`base__<uid>`) menang bila ada.
 *   2. Fallback ke legacy key global (data lama di device ini), sehingga
 *      nilai yang sudah ada sebelum pembaruan tidak hilang.
 * Tulis SELALU ke key scoped — mulai saat diubah, nilainya menjadi
 * eksklusif milik akun yang sedang login.
 */

import { currentUserId, scopedPrefKey } from './accountScope';

export function prefGet(base: string, fallback: string | null = null): string | null {
  try {
    const scoped = localStorage.getItem(scopedPrefKey(base));
    if (scoped !== null) return scoped;
    return localStorage.getItem(base);
  } catch {
    return fallback;
  }
}

export function prefSet(base: string, value: string | null): void {
  try {
    const key = scopedPrefKey(base);
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {}
}

export function prefGetJSON<T>(base: string, fallback: T | null = null): T | null {
  const raw = prefGet(base);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function prefSetJSON(base: string, value: unknown): void {
  try {
    prefSet(base, JSON.stringify(value));
  } catch {}
}

/** Key berprefiks akun untuk prefix-style keys (mis. rank game). */
export function uidSuffix(userId?: string): string {
  return `${userId || currentUserId()}`;
}

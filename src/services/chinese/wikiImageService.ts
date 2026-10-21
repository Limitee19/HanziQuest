/**
 * wikiImageService — gambar ilustratif dari Wikipedia untuk kata konkret.
 *
 * Fetch ringan via REST summary API (CORS terbuka), lalu di-cache di memori
 * + localStorage sehingga satu kata hanya di-fetch sekali sepanjang hidup app.
 * Bila offline / artikel tak punya gambar → null, dan UI jatuh ke emoji.
 */

const LS_KEY = 'omnilife_wiki_image_cache_v1';
const MAX_PERSISTED = 600;

const memory = new Map<string, string | null>();
let loaded = false;

function loadPersisted(): void {
  if (loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const obj = JSON.parse(raw) as Record<string, string | null>;
    for (const [k, v] of Object.entries(obj)) memory.set(k, v);
  } catch {
    /* cache rusak — mulai segar */
  }
}

function persist(): void {
  try {
    const obj: Record<string, string | null> = {};
    let n = 0;
    for (const [k, v] of memory) {
      obj[k] = v;
      if (++n >= MAX_PERSISTED) break;
    }
    localStorage.setItem(LS_KEY, JSON.stringify(obj));
  } catch {
    /* storage penuh — abaikan */
  }
}

/**
 * Ambil URL gambar ilustratif untuk judul artikel Wikipedia (EN).
 * Mengembalikan null bila tidak ada gambar atau sedang offline
 * (hasil gagal di-cache agar tidak membanjiri jaringan dengan retry).
 */
export async function fetchWikiImage(imageKey: string): Promise<string | null> {
  loadPersisted();
  if (memory.has(imageKey)) return memory.get(imageKey) ?? null;

  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(imageKey)}?redirect=true`,
      { headers: { Accept: 'application/json' } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const url: string | null = data?.thumbnail?.source ?? data?.originalimage?.source ?? null;
    memory.set(imageKey, url);
    persist();
    return url;
  } catch {
    memory.set(imageKey, null);
    persist();
    return null;
  }
}

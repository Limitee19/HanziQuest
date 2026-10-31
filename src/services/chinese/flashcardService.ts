import { executeSql, selectSql } from '@/db/client';
import { autoSyncRecordToSupabase } from '@/services/sync/syncService';
import { resolveCardMedia, resolveAudioUrls } from './ankiMedia';
import { pinyinSyllablesMatch } from './pinyinEngine';
import { repairMixedTranslation } from './ankiTranslation';
import { recordStudyActivity, fetchStudyStreak } from '../study/streakService';

// FIX-E: deklarasi kanal invoke internal Tauri (desktop/Android) sebagai global
// typed — akses window.__TAURI_INTERNALS__.invoke tanpa inline cast.
declare global {
  interface Window {
    __TAURI_INTERNALS__?: { invoke?: TauriInvoke };
  }
}

/** Decode entity HTML umum + numerik (&#x89C9; / &#22088;) ke karakter aslinya. */
export function decodeHtmlEntities(text: string): string {
  return (text || '').replace(
    /&(#x?[0-9a-fA-F]+|[a-z]+);/gi,
    (ent, body: string) => {
      if (body[0] === '#' || body[0] === 'x' || /x[0-9a-fA-F]/.test(body)) {
        const code = /^#x/i.test(body)
          ? parseInt(body.slice(2), 16)
          : /^#\d+$/.test(body)
            ? parseInt(body.slice(1), 10)
            : /^x/i.test(body)
              ? parseInt(body.slice(1), 16)
              : 0;
        if (!Number.isNaN(code) && code > 0) return String.fromCodePoint(code);
      }
      const named = (body as string).toLowerCase();
      const table: Record<string, string> = {
        amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', hellip: '…', mdash: '—', ndash: '–',
      };
      return table[named] ?? ent;
    }
  );
}

/** Buang tag HTML + decode minimal, untuk pencarian teks polos. */
function stripHtmlForSearch(html: string): string {
  return decodeHtmlEntities((html || '').replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ');
}

/**
 * Buang duplikasi isi kartu warisan impor Anki.
 * Template lama memakai {{FrontSide}} sehingga seluruh isi depan (hanzi/
 * kalimat) ikut tersimpan di back_content sebelum <hr id=answer> — akibatnya
 * tampil dua kali saat jawaban dibuka. App menyajikan isi depan sendiri di
 * atas jawaban, jadi bagian ter-inline itu dibuang saat kartu dibaca.
 */
export function dedupeCardContent(front: string, back: string): { frontContent: string; backContent: string } {
  const f = (front || '').trim();
  const b = (back || '').trim();
  if (!f || !b) return { frontContent: f, backContent: b };

  const plain = (s: string) => stripHtmlForSearch(s).replace(/\s+/g, ' ').trim().toLowerCase();

  const hrAnswerRe = /<hr[^>]*id=["']?answer["']?[^>]*>/i;
  let cleanedBack = b;

  const hrMatch = b.match(hrAnswerRe);
  if (hrMatch && hrMatch.index !== undefined) {
    // Konvensi Anki: semua sebelum <hr id=answer> adalah salinan FrontSide → buang.
    cleanedBack = b.slice(hrMatch.index).replace(hrAnswerRe, '').trim();
  } else {
    // Template tanpa <hr id=answer>: buang node-node awal back yang
    // secara kumulatif menyalin isi depan kartu.
    cleanedBack = stripLeadingFrontCopy(f, b, plain);
  }

  // Kartu yang seluruh back-nya identik dengan front (impor reversal)
  if (!cleanedBack || plain(cleanedBack) === plain(f)) {
    cleanedBack = '';
  }

  return { frontContent: f, backContent: cleanedBack };
}

/**
 * Fallback tanpa <hr id=answer>: parse back sebagai DOM, lalu buang node
 * teratas selama teks polos kumulatifnya masih prefiks persis dari teks
 * polos front dan berhenti tepat saat salinan FrontSide selesai.
 */
function stripLeadingFrontCopy(
  front: string,
  back: string,
  plain: (s: string) => string
): string {
  try {
    if (typeof DOMParser === 'undefined') return back;
    const frontPlain = plain(front);
    if (!frontPlain) return back;
    const doc = new DOMParser().parseFromString(`<div id="__dedup_root">${back}</div>`, 'text/html');
    const root = doc.getElementById('__dedup_root');
    if (!root) return back;

    const children = Array.from(root.childNodes);
    let acc = '';
    let matched = 0;
    let fullCopy = false;
    for (const node of children) {
      const nodeHtml = node.nodeType === 1 ? (node as Element).innerHTML : (node.textContent || '');
      const nodePlain = plain(nodeHtml);
      const candidate = `${acc} ${nodePlain}`.replace(/\s+/g, ' ').trim();
      if (candidate === frontPlain) {
        matched += 1;
        fullCopy = true;
        break;
      }
      if (candidate.length < frontPlain.length && frontPlain.startsWith(candidate)) {
        acc = candidate;
        matched += 1;
        continue;
      }
      break;
    }
    if (fullCopy && matched > 0) {
      for (let i = 0; i < matched; i++) children[i]?.remove();
      return root.innerHTML.trim();
    }
    return back;
  } catch {
    return back;
  }
}

/**
 * Filter hasil pencarian latin (pinyin/arti) di sisi JS.
 * Query pinyin dicocokkan PER SUKU KATA (bukan substring), sehingga "ai"
 * mengenai kartu ài/āi/ái/ǎi — bukan shuō atau kata Inggris "said".
 * Query non-pinyin (arti, mis. "cinta") dicocokkan per kata utuh.
 *
 * PENTING (fix hasil pencarian "san" → juede):
 * Kalimat contoh pada sisi belakang kartu TIDAK ikut dicocokkan. Kalimat
 * sering memuat pinyin/arti dari kata lain (mis. kartu 觉得 berkalimat
 * “…sangat…”), sehingga pencarian "san"/"tiga" menarik kartu yang salah.
 * Bagian yang diperiksa hanya: front (hanzi) + pinyin/arti inti di back.
 */
function filterCardsByLatinSearch(items: LearnedCardItem[], term: string): LearnedCardItem[] {
  const q = term.trim().toLowerCase();
  if (!q) return items;
  const qPlain = q.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zü0-9\s]/g, ' ').trim();
  if (!qPlain) return items;

  const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const meaningRe = new RegExp(`(^|\\s)${escapeRe(qPlain)}`, 'i');

  /**
   * Pisahkan elemen inti kartu (pinyin/arti) dari kalimat contoh.
   * Blok yang dianggap kalimat contoh DILEPAS dari pencarian:
   *  - <div>/<p>/<li> yang isinya mengandung gabungan CJK besar (kalimat hanzi),
   *  - elemen dengan class khas kalimat contoh (anki-sentence / example),
   *  - elemen setelah divider <hr> pada back (biasanya blok contoh).
   */
  const isExampleBlock = (cls: string, cjkCount: number, latinCount: number) =>
    /(?:^|\s)(?:anki-sentence|example|sentence-example)(?:\s|$)/.test(cls) ||
    (cjkCount >= 6 && latinCount >= 8);

  const splitCoreVsExample = (html: string): { core: string; examples: string } => {
    try {
      if (typeof DOMParser === 'undefined') return { core: html, examples: '' };
      const doc = new DOMParser().parseFromString(`<div id="__core_root">${html}</div>`, 'text/html');
      const root = doc.getElementById('__core_root');
      if (!root) return { core: html, examples: '' };
      let core = '';
      let examples = '';
      let afterDivider = false;
      for (const node of Array.from(root.childNodes)) {
        const isEl = node.nodeType === 1;
        const cls = isEl ? ((node as Element).getAttribute('class') || '') : '';
        const inner = isEl ? (node as Element).innerHTML : node.textContent || '';
        const plainInner = stripHtmlForSearch(inner).trim();
        if (isEl && (node as Element).tagName === 'HR') {
          afterDivider = true;
          continue;
        }
        const cjk = (plainInner.match(/[\u4e00-\u9fff]/g) || []).length;
        const latin = plainInner.replace(/[\u4e00-\u9fff\s]/g, '').length;
        if (afterDivider || isExampleBlock(cls, cjk, latin)) {
          examples += ` ${plainInner}`;
          continue;
        }
        core += ` ${plainInner}`;
      }
      return { core: core.trim(), examples: examples.trim() };
    } catch {
      return { core: html, examples: '' };
    }
  };

  return items.filter((item) => {
    // Core = front + bagian back inti (tanpa blok kalimat contoh).
    // Front ikut penuh (hanzi + pinyin murni), contoh kalimat biasanya
    // sudah tergeser ke back; bila front punya blok contoh, dilepas juga.
    const front = splitCoreVsExample(item.frontContent).core;
    const back = splitCoreVsExample(item.backContent).core;
    const plain = `${stripHtmlForSearch(front)} ${stripHtmlForSearch(back)}`.toLowerCase();

    // 1) Kandidat pinyin: kata bertanda nada (shuō, ài) atau bernomor nada (shuo1, ai4)
    const pinyinCandidates = [
      ...(plain.match(/[a-zü]+[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ][a-zü]*/gi) || []),
      ...(plain.match(/\b[a-z]{1,6}[1-5]\b/gi) || []),
    ];
    for (const cand of pinyinCandidates) {
      if (pinyinSyllablesMatch(q, cand)) return true;
    }

    // 2) Arti / kata utuh di teks kartu (word-boundary, bukan substring)
    if (meaningRe.test(plain)) return true;

    return false;
  });
}

// ============================================================
// Read-time media resolution
// ------------------------------------------------------------
// Persisted card content/audio_urls use lightweight tokens
// ([sound:file] / __media__/file). Base64 media lives ONLY in the
// local imported_media_assets table. These helpers lazily build a
// fileName -> dataUrl map once and resolve tokens for display.
// ============================================================

let mediaMapPromise: Promise<Map<string, string>> | null = null;

function getMediaMap(): Promise<Map<string, string>> {
  if (!mediaMapPromise) {
    mediaMapPromise = (async () => {
      const map = new Map<string, string>();
      try {
        const rows = await selectSql<{ source_file_name: string; data_base64: string }>(
          `SELECT source_file_name, data_base64 FROM imported_media_assets;`
        );
        for (const row of rows || []) {
          if (row?.source_file_name && row?.data_base64) {
            map.set(row.source_file_name, row.data_base64);
            const lower = row.source_file_name.toLowerCase();
            if (!map.has(lower)) map.set(lower, row.data_base64);
          }
        }
      } catch (err) {
        console.warn('Anki media map unavailable:', err);
      }
      return map;
    })();
  }
  return mediaMapPromise;
}

/** Invalidate the cached media map (call after a new Anki import). */
export function invalidateAnkiMediaCache(): void {
  mediaMapPromise = null;
  mediaFileCache.clear();
}

// ── FIX-E: file-first media loading ─────────────────────────────────
// Payload Anki diekspor ke file biasa di {app_data}/anki_media/. Pembacaan
// via command Rust `anki_media_read` (pattern sama dgn tts_read_cached_audio),
// lalu diubah menjadi data URL di sini. Cache per-nama supaya satu file hanya
// dibaca/di-encode sekali per sesi runtime.
type TauriInvoke = <T>(cmd: string, args?: Record<string, unknown>) => Promise<T>;

const MIME_BY_EXT: Record<string, string> = {
  mp3: 'audio/mpeg', m4a: 'audio/mp4', wav: 'audio/wav', ogg: 'audio/ogg',
  oga: 'audio/ogg', flac: 'audio/flac', aac: 'audio/aac', webm: 'audio/webm',
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif',
  webp: 'image/webp', bmp: 'image/bmp', svg: 'image/svg+xml',
};

const mediaFileCache = new Map<string, Promise<string | null>>();

/** Baca satu file media Anki dari disk; null bila gagal/tidak ada/bukan Tauri. */
function resolveAnkiMediaFile(fileName: string): Promise<string | null> {
  let p = mediaFileCache.get(fileName);
  if (!p) {
    p = (async () => {
      const inv: TauriInvoke | undefined =
        typeof window === 'object' && '__TAURI_INTERNALS__' in window
          ? window.__TAURI_INTERNALS__?.invoke
          : undefined;
      if (!inv) return null;
      try {
        const arr = await inv<number[]>('anki_media_read', { fileName });
        if (!arr || arr.length === 0) return null;
        const bytes = Uint8Array.from(arr);
        const ext = (fileName.split('.').pop() || '').toLowerCase();
        const mime = MIME_BY_EXT[ext] || 'application/octet-stream';
        let bin = '';
        const chunk = 8192;
        for (let i = 0; i < bytes.length; i += chunk) {
          bin += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)) as unknown as number[]);
        }
        return `data:${mime};base64,${btoa(bin)}`;
      } catch {
        return null; // file belum diekspor / nama tidak valid — jatuh ke DB base64
      }
    })();
    mediaFileCache.set(fileName, p);
  }
  return p;
}

function makeMediaResolver(): (fileName: string) => Promise<string | null> {
  return async (fileName: string) => {
    if (!fileName) return null;
    if (fileName.startsWith('data:')) return fileName; // legacy inline payload
    // FIX-E dual-mode: payload sekarang juga hidup sebagai file di
    // {app_data}/anki_media/<safe_file_name>. Coba file dulu (murah, tanpa
    // query 52MB base64); bila tidak ada, fallback ke DB via getMediaMap()
    // sehingga perangkat/backup lama yang masih menaruh base64 tetap valid.
    const viaFile = await resolveAnkiMediaFile(fileName);
    if (viaFile) return viaFile;
    const map = await getMediaMap();
    return map.get(fileName) || map.get(fileName.toLowerCase()) || null;
  };
}

function hasMediaToken(html: string): boolean {
  return !!html && (html.includes('[sound:') || html.includes('__media__/'));
}

function cardNeedsMediaResolution(item: FlashcardItem): boolean {
  return (
    (item.audioUrls?.length ?? 0) > 0 ||
    hasMediaToken(item.frontContent) ||
    hasMediaToken(item.backContent)
  );
}

/** Resolve tokens in a card item IN PLACE so UI layers need no changes. */
async function applyCardMediaResolution(
  item: FlashcardItem,
  resolveFn: (fileName: string) => Promise<string | null>
): Promise<void> {
  if (item.audioUrls && item.audioUrls.length > 0) {
    item.audioUrls = await resolveAudioUrls(item.audioUrls, resolveFn);
  }
  if (hasMediaToken(item.frontContent)) {
    item.frontContent = await resolveCardMedia(item.frontContent, resolveFn);
  }
  if (hasMediaToken(item.backContent)) {
    item.backContent = await resolveCardMedia(item.backContent, resolveFn);
  }
}

export interface DeckItem {
  id: string;
  name: string;
  parentDeckId?: string | null;
  source: 'anki_import' | 'native';
  sourcePackageFingerprint?: string;
  cardCount: number;
  newCount: number;
  learnCount: number;
  dueCount: number;
  masteredCount: number;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
  subdecks?: DeckItem[];
}

export interface FlashcardItem {
  id: string;
  noteId: string;
  deckId: string;
  deckName?: string;
  sourceCardOrdinal: number;
  cardType: 'basic' | 'reversed' | 'cloze' | 'custom_mapped';
  frontContent: string;
  backContent: string;
  sourceTemplateName?: string;
  audioUrls?: string[];
  imageUrls?: string[];
  studyStatus: 'not_started' | 'learning' | 'review' | 'mastered' | 'suspended';
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  lapses: number;
  lastReviewedAt?: string;
  nextReviewAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';

export interface ReviewSchedulePreview {
  rating: ReviewRating;
  label: string;
  intervalText: string;
  nextIntervalDays: number;
}

/**
 * Calculates next intervals preview for grading buttons
 */
export function calculateIntervalPreviews(card: FlashcardItem): ReviewSchedulePreview[] {
  const currentInterval = card.intervalDays || 0;
  const ease = card.easeFactor || 2.5;

  // Again: reset to 1 day
  const againDays = 1;
  // Hard: 1.2x
  const hardDays = Math.max(1, Math.round(Math.max(1, currentInterval) * 1.2));
  // Good: normal step
  let goodDays = 1;
  if (card.repetitions === 0) goodDays = 1;
  else if (card.repetitions === 1) goodDays = 3;
  else goodDays = Math.max(2, Math.round(currentInterval * ease));
  // Easy: bonus step
  let easyDays = 4;
  if (card.repetitions > 0) easyDays = Math.max(4, Math.round(goodDays * 1.3));

  return [
    {
      rating: 'again',
      label: 'Again',
      intervalText: '< 1 hari',
      nextIntervalDays: againDays,
    },
    {
      rating: 'hard',
      label: 'Hard',
      intervalText: `${hardDays} hr`,
      nextIntervalDays: hardDays,
    },
    {
      rating: 'good',
      label: 'Good',
      intervalText: `${goodDays} hr`,
      nextIntervalDays: goodDays,
    },
    {
      rating: 'easy',
      label: 'Easy',
      intervalText: `${easyDays} hr`,
      nextIntervalDays: easyDays,
    },
  ];
}

/**
 * 1. Fetch All Decks with SRS Counts Dan Hierarchical Subdeck Tree
 */
export async function fetchDecks(): Promise<DeckItem[]> {
  try {
    const rawDecks = await selectSql<any>(`SELECT * FROM learning_decks WHERE status = 'active' ORDER BY name ASC;`);
    const allCards = await selectSql<any>(`SELECT id, deck_id, study_status, next_review_at FROM flashcard_cards;`);

    const now = new Date();
    now.setHours(23, 59, 59, 999);
    const nowIso = now.toISOString();

    const deckMap = new Map<string, DeckItem>();

    for (const d of rawDecks) {
      deckMap.set(d.id, {
        id: d.id,
        name: d.name,
        parentDeckId: d.parent_deck_id || null,
        source: d.source || 'native',
        sourcePackageFingerprint: d.source_package_fingerprint || undefined,
        cardCount: 0,
        newCount: 0,
        learnCount: 0,
        dueCount: 0,
        masteredCount: 0,
        status: d.status || 'active',
        createdAt: d.created_at,
        updatedAt: d.updated_at,
        subdecks: [],
      });
    }

    // Tally cards into decks
    for (const c of allCards) {
      const deck = deckMap.get(c.deck_id);
      if (deck) {
        deck.cardCount += 1;
        const status = c.study_status || 'not_started';
        const nextReview = c.next_review_at;

        if (status === 'not_started') {
          deck.newCount += 1;
        } else if (status === 'mastered') {
          deck.masteredCount += 1;
          if (nextReview && nextReview <= nowIso) {
            deck.dueCount += 1;
          }
        } else if (status === 'learning') {
          deck.learnCount += 1;
          if (!nextReview || nextReview <= nowIso) {
            deck.dueCount += 1;
          }
        } else if (status === 'review') {
          if (!nextReview || nextReview <= nowIso) {
            deck.dueCount += 1;
          }
        }
      }
    }

    // Build hierarchy (nested subdecks)
    const rootDecks: DeckItem[] = [];
    for (const d of deckMap.values()) {
      if (d.parentDeckId && deckMap.has(d.parentDeckId)) {
        deckMap.get(d.parentDeckId)!.subdecks!.push(d);
      } else {
        rootDecks.push(d);
      }
    }

    return rootDecks;
  } catch (err) {
    console.error('Failed to fetch decks:', err);
    return [];
  }
}

/** Opsi tambahan antrean belajar: mode 'relearn' mengambil SEMUA kartu deck (diacak). */
export interface StudyQueueOptions {
  /** Belajar ulang: abaikan status SRS, ambil semua kartu deck dalam urutan acak. */
  relearn?: boolean;
}

/**
 * 2. Fetch Deck Study Queue (Daily New + Due Cards)
 *
 * Mode biasa: kartu jatuh tempo dulu, lalu kartu baru.
 * Mode `relearn`: SEMUA kartu deck diacak — dipakai tombol "Belajar Ulang"
 * agar deck yang sudah selesai tetap bisa dibuka kembali.
 */
export async function fetchDeckStudyQueue(deckId: string, maxNew: number = 20, maxReview: number = 50, options?: StudyQueueOptions): Promise<FlashcardItem[]> {
  try {
    // Get all deck IDs including subdecks
    const allDecks = await selectSql<any>(`SELECT id, parent_deck_id FROM learning_decks WHERE status = 'active';`);
    const targetDeckIds = new Set<string>([deckId]);

    // Add child decks
    let added = true;
    while (added) {
      added = false;
      for (const d of allDecks) {
        if (d.parent_deck_id && targetDeckIds.has(d.parent_deck_id) && !targetDeckIds.has(d.id)) {
          targetDeckIds.add(d.id);
          added = true;
        }
      }
    }

    const placeholders = Array.from(targetDeckIds).map(() => '?').join(',');
    const cards = await selectSql<any>(
      `SELECT * FROM flashcard_cards WHERE deck_id IN (${placeholders}) ORDER BY created_at ASC;`,
      Array.from(targetDeckIds)
    );

    const now = new Date();
    now.setHours(23, 59, 59, 999);
    const nowIso = now.toISOString();

    const dueCards: FlashcardItem[] = [];
    const newCards: FlashcardItem[] = [];
    const relearnCards: FlashcardItem[] = [];
    const isRelearn = options?.relearn === true;

    for (const c of cards) {
      const item: FlashcardItem = {
        id: c.id,
        noteId: c.note_id,
        deckId: c.deck_id,
        sourceCardOrdinal: c.source_card_ordinal || 0,
        cardType: c.card_type || 'basic',
        frontContent: c.front_content,
        backContent: c.back_content,
        sourceTemplateName: c.source_template_name,
        audioUrls: c.audio_urls ? (() => { try { return JSON.parse(c.audio_urls); } catch (_) { return []; } })() : [],
        imageUrls: c.image_urls ? (() => { try { return JSON.parse(c.image_urls); } catch (_) { return []; } })() : [],
        studyStatus: c.study_status || 'not_started',
        intervalDays: c.interval_days || 0,
        easeFactor: c.ease_factor || 2.5,
        repetitions: c.repetitions || 0,
        lapses: c.lapses || 0,
        lastReviewedAt: c.last_reviewed_at,
        nextReviewAt: c.next_review_at,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      };

      // Kartu impor lama membawa salinan FrontSide di back_content → buang
      const dedup = dedupeCardContent(item.frontContent, item.backContent);
      item.frontContent = dedup.frontContent;
      // Arti warisan impor yang tercampur Indonesia–Inggris diperbaiki saat dibaca
      item.backContent = repairMixedTranslation(dedup.backContent);

      if (isRelearn) {
        relearnCards.push(item);
      } else if (item.studyStatus === 'not_started') {
        if (newCards.length < maxNew) {
          newCards.push(item);
        }
      } else {
        if (!item.nextReviewAt || item.nextReviewAt <= nowIso) {
          if (dueCards.length < maxReview) {
            dueCards.push(item);
          }
        }
      }
    }

    if (isRelearn) {
      // Acak urutan agar belajar ulang tidak sekadar mengulang urutan impor
      for (let i = relearnCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const a = relearnCards[i];
        const b = relearnCards[j];
        if (a && b) {
          relearnCards[i] = b;
          relearnCards[j] = a;
        }
      }
    }

    // Combine Due cards first, then New cards
    const allItems = isRelearn ? relearnCards : [...dueCards, ...newCards];

    // Resolve media tokens/names to playable data URLs (local media only)
    if (allItems.some(cardNeedsMediaResolution)) {
      const resolveFn = makeMediaResolver();
      for (const item of allItems) {
        await applyCardMediaResolution(item, resolveFn);
      }
    }

    return allItems;
  } catch (err) {
    console.error('Failed to fetch study queue:', err);
    return [];
  }
}

/**
 * 3. Process Card Review Rating with Anki SRS Algorithm
 */
export async function rateCard(cardId: string, rating: ReviewRating): Promise<FlashcardItem> {
  const rows = await selectSql<any>(`SELECT * FROM flashcard_cards WHERE id = ? LIMIT 1;`, [cardId]);
  if (!rows || rows.length === 0) {
    throw new Error('Kartu tidak ditemukan.');
  }

  const c = rows[0];
  const now = new Date();
  const nowIso = now.toISOString();

  let intervalDays = c.interval_days || 0;
  let easeFactor = c.ease_factor || 2.5;
  let repetitions = c.repetitions || 0;
  let lapses = c.lapses || 0;
  let studyStatus: FlashcardItem['studyStatus'] = c.study_status || 'not_started';

  if (rating === 'again') {
    repetitions = 0;
    lapses += 1;
    intervalDays = 1;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
    studyStatus = 'learning';
  } else if (rating === 'hard') {
    repetitions += 1;
    intervalDays = Math.max(1, Math.round(Math.max(1, intervalDays) * 1.2));
    easeFactor = Math.max(1.3, easeFactor - 0.15);
    studyStatus = 'learning';
  } else if (rating === 'good') {
    repetitions += 1;
    if (repetitions === 1) intervalDays = 1;
    else if (repetitions === 2) intervalDays = 3;
    else intervalDays = Math.max(2, Math.round(intervalDays * easeFactor));
    studyStatus = intervalDays >= 21 ? 'mastered' : 'review';
  } else if (rating === 'easy') {
    repetitions += 1;
    if (repetitions === 1) intervalDays = 4;
    else intervalDays = Math.max(4, Math.round(intervalDays * easeFactor * 1.3));
    easeFactor = Math.min(3.0, easeFactor + 0.15);
    studyStatus = intervalDays >= 21 ? 'mastered' : 'review';
  }

  // Calculate midnight-aligned next review date
  const nextDate = new Date(now);
  nextDate.setDate(nextDate.getDate() + intervalDays);
  nextDate.setHours(0, 0, 0, 0);
  const nextReviewAt = nextDate.toISOString();

  await executeSql(
    `UPDATE flashcard_cards 
     SET study_status = ?, interval_days = ?, ease_factor = ?, repetitions = ?, lapses = ?, last_reviewed_at = ?, next_review_at = ?, updated_at = ?
     WHERE id = ?;`,
    [
      studyStatus,
      intervalDays,
      easeFactor,
      repetitions,
      lapses,
      nowIso,
      nextReviewAt,
      nowIso,
      cardId,
    ]
  );

  autoSyncRecordToSupabase('flashcard_cards', {
    id: cardId,
    study_status: studyStatus,
    interval_days: intervalDays,
    ease_factor: easeFactor,
    repetitions,
    lapses,
    last_reviewed_at: nowIso,
    next_review_at: nextReviewAt,
    updated_at: nowIso,
  });

  // Every graded review counts as real study activity for the daily streak
  try {
    await recordStudyActivity();
  } catch (streakErr) {
    console.warn('Study streak recording failed:', streakErr);
  }

  return {
    id: c.id,
    noteId: c.note_id,
    deckId: c.deck_id,
    sourceCardOrdinal: c.source_card_ordinal || 0,
    cardType: c.card_type || 'basic',
    frontContent: c.front_content,
    backContent: c.back_content,
    sourceTemplateName: c.source_template_name,
    studyStatus,
    intervalDays,
    easeFactor,
    repetitions,
    lapses,
    lastReviewedAt: nowIso,
    nextReviewAt,
    createdAt: c.created_at,
    updatedAt: nowIso,
  };
}

/**
 * 4. Create New Native Deck
 */
export async function createDeck(name: string, parentDeckId?: string): Promise<DeckItem> {
  const id = `deck_native_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  await executeSql(
    `INSERT INTO learning_decks (id, owner_id, name, parent_deck_id, source, card_count, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [id, 'usr_local_default', name.trim(), parentDeckId || null, 'native', 0, 'active', now, now]
  );

  autoSyncRecordToSupabase('learning_decks', {
    id,
    name: name.trim(),
    parent_deck_id: parentDeckId || null,
    source: 'native',
    card_count: 0,
    status: 'active',
    created_at: now,
    updated_at: now,
  });

  return {
    id,
    name: name.trim(),
    parentDeckId: parentDeckId || null,
    source: 'native',
    cardCount: 0,
    newCount: 0,
    learnCount: 0,
    dueCount: 0,
    masteredCount: 0,
    status: 'active',
    createdAt: now,
    updatedAt: now,
    subdecks: [],
  };
}

/**
 * 5. Delete Deck and its associated cards
 */
export async function deleteDeck(deckId: string): Promise<void> {
  await executeSql(`DELETE FROM flashcard_cards WHERE deck_id = ?;`, [deckId]);
  await executeSql(`DELETE FROM flashcard_notes WHERE deck_id = ?;`, [deckId]);
  await executeSql(`DELETE FROM learning_decks WHERE id = ?;`, [deckId]);
}

/**
 * 6. Add Custom Card to Deck
 */
export async function createCard(
  deckId: string,
  frontContent: string,
  backContent: string,
  cardType: 'basic' | 'reversed' | 'cloze' = 'basic'
): Promise<FlashcardItem> {
  const noteId = `fn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const cardId = `fc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  await executeSql(
    `INSERT INTO flashcard_notes (id, deck_id, source_note_identifier, note_type_name, fields, tags, import_status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      noteId,
      deckId,
      noteId,
      cardType === 'cloze' ? 'Cloze' : 'Basic',
      JSON.stringify({ Front: frontContent, Back: backContent }),
      JSON.stringify([]),
      'supported',
      now,
      now,
    ]
  );

  await executeSql(
    `INSERT INTO flashcard_cards (id, note_id, deck_id, source_card_ordinal, card_type, front_content, back_content, study_status, interval_days, ease_factor, repetitions, lapses, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      cardId,
      noteId,
      deckId,
      0,
      cardType,
      frontContent,
      backContent,
      'not_started',
      0,
      2.5,
      0,
      0,
      now,
      now,
    ]
  );

  // Update card count in deck
  await executeSql(`UPDATE learning_decks SET card_count = card_count + 1, updated_at = ? WHERE id = ?;`, [now, deckId]);

  return {
    id: cardId,
    noteId,
    deckId,
    sourceCardOrdinal: 0,
    cardType,
    frontContent,
    backContent,
    studyStatus: 'not_started',
    intervalDays: 0,
    easeFactor: 2.5,
    repetitions: 0,
    lapses: 0,
    createdAt: now,
    updatedAt: now,
  };
}

export interface LearnedCardItem extends FlashcardItem {
  deckName: string;
  hanziExtract?: string;
}

/**
 * 7. Fetch all cards with deck names and extracted Hanzi characters for Learned Vocabulary view
 */
export async function fetchAllLearnedCards(filters?: {
  deckId?: string;
  status?: string;
  search?: string;
}): Promise<LearnedCardItem[]> {
  let query = `
    SELECT c.*, d.name as deck_name 
    FROM flashcard_cards c
    LEFT JOIN learning_decks d ON c.deck_id = d.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (filters?.deckId && filters.deckId !== 'all') {
    query += ` AND c.deck_id = ?`;
    params.push(filters.deckId);
  }

  if (filters?.status && filters.status !== 'all') {
    query += ` AND c.study_status = ?`;
    params.push(filters.status);
  }

  let latinSearchTerm = '';
  if (filters?.search && filters.search.trim()) {
    const term = filters.search.trim();
    if (/[\u4e00-\u9fa5]/.test(term)) {
      // Query Hanzi: LIKE langsung akurat
      query += ` AND (c.front_content LIKE ? OR c.back_content LIKE ?)`;
      const termLike = `%${term}%`;
      params.push(termLike, termLike);
    } else {
      // Query latin (pinyin/arti): filter presisi di JS (per suku kata / per kata)
      latinSearchTerm = term;
    }
  }

  query += ` ORDER BY c.updated_at DESC LIMIT ${latinSearchTerm ? '2000' : '500'};`;

  const rows = await selectSql<any>(query, params);

  const items: LearnedCardItem[] = rows.map((r) => {
    // Kata target = run Hanzi pertama di front. Jangan gabung semua run
    // (contoh kalimat di back ikut kejebak jadi 1 kalimat full).
    const frontText = (r.front_content || '').replace(/<[^>]*>/g, ' ');
    const backText = (r.back_content || '').replace(/<[^>]*>/g, ' ');
    const hanziExtract =
      frontText.match(/[\u4e00-\u9fa5]+/)?.[0] ||
      backText.match(/[\u4e00-\u9fa5]+/)?.[0] ||
      undefined;

    const dedup = dedupeCardContent(r.front_content || '', r.back_content || '');

    return {
      id: r.id,
      noteId: r.note_id,
      deckId: r.deck_id,
      deckName: r.deck_name || 'Tanpa Deck',
      sourceCardOrdinal: r.source_card_ordinal || 0,
      cardType: r.card_type || 'basic',
      frontContent: dedup.frontContent,
      backContent: repairMixedTranslation(dedup.backContent),
      sourceTemplateName: r.source_template_name,
      audioUrls: r.audio_urls ? (() => { try { return JSON.parse(r.audio_urls); } catch (_) { return []; } })() : [],
      imageUrls: r.image_urls ? (() => { try { return JSON.parse(r.image_urls); } catch (_) { return []; } })() : [],
      studyStatus: r.study_status || 'not_started',
      intervalDays: r.interval_days || 0,
      easeFactor: r.ease_factor || 2.5,
      repetitions: r.repetitions || 0,
      lapses: r.lapses || 0,
      lastReviewedAt: r.last_reviewed_at,
      nextReviewAt: r.next_review_at,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      hanziExtract,
    };
  });

  // Resolve media tokens/names to playable data URLs (local media only)
  if (items.some(cardNeedsMediaResolution)) {
    const resolveFn = makeMediaResolver();
    for (const item of items) {
      await applyCardMediaResolution(item, resolveFn);
    }
  }

  return latinSearchTerm ? filterCardsByLatinSearch(items, latinSearchTerm) : items;
}

export interface AnkiLearningOverview {
  totalDecks: number;
  totalCards: number;
  newCards: number;
  learningCards: number;
  reviewDueCards: number;
  masteredCards: number;
  totalReviewsDone: number;
  currentStreak: number;
}

/**
 * 8. Fetch Overview Stats for Dashboard
 */
export async function fetchAnkiLearningOverviewStats(): Promise<AnkiLearningOverview> {
  const [deckRows, cardRows, dueRows, reviewStats] = await Promise.all([
    selectSql<any>(`SELECT COUNT(*) as count FROM learning_decks WHERE status = 'active';`),
    selectSql<any>(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN study_status = 'not_started' THEN 1 ELSE 0 END) as new_count,
        SUM(CASE WHEN study_status = 'learning' THEN 1 ELSE 0 END) as learn_count,
        SUM(CASE WHEN study_status = 'mastered' THEN 1 ELSE 0 END) as mastered_count
      FROM flashcard_cards;
    `),
    selectSql<any>(`
      SELECT COUNT(*) as due_count 
      FROM flashcard_cards 
      WHERE study_status IN ('learning', 'review') 
        AND (next_review_at IS NULL OR next_review_at <= datetime('now'));
    `),
    selectSql<any>(`SELECT SUM(repetitions) as total_reps FROM flashcard_cards;`),
  ]);

  const totalDecks = deckRows[0]?.count || 0;
  const cStats = cardRows[0] || {};
  const totalCards = cStats.total || 0;
  const newCards = cStats.new_count || 0;
  const learningCards = cStats.learn_count || 0;
  const masteredCards = cStats.mastered_count || 0;
  const reviewDueCards = dueRows[0]?.due_count || 0;
  const totalReviewsDone = reviewStats[0]?.total_reps || 0;

  // Real activity-based streak (WIB day boundaries, +1 on first study of the day)
  let currentStreak = 0;
  try {
    currentStreak = (await fetchStudyStreak()).currentStreak;
  } catch {
    currentStreak = 0;
  }

  return {
    totalDecks,
    totalCards,
    newCards,
    learningCards,
    reviewDueCards,
    masteredCards,
    totalReviewsDone,
    currentStreak,
  };
}

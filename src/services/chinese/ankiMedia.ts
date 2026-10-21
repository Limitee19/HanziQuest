// ============================================================
// Anki Media Pipeline
// ------------------------------------------------------------
// Local-first media strategy for Anki flashcards:
//   • Base64 media (audio/images) lives ONLY in local SQLite
//     (`imported_media_assets`) — never synced to Supabase.
//   • Card content persisted in the DB (and synced to cloud)
//     uses LIGHTWEIGHT TOKENS instead of embedded data URLs:
//       – audio : [sound:filename.mp3]   (native Anki format)
//       – image : src="__media__/filename.jpg"
//   • Tokens are resolved back to playable data URLs at READ
//     time via resolveCardMedia() (see flashcardService).
//
// repairAnkiCardMedia() is a one-time migration that converts
// legacy cards (which embedded raw data URLs in content and
// often had empty audio_urls) into the token format, so their
// audio plays again AND their cloud rows shrink massively.
// ============================================================

import { executeSql, selectSql } from '@/db/client';
import { autoSyncRecordToSupabase } from '@/services/sync/syncService';
import { audioMimeFromDataUrl } from './ankiMediaMime';

const MEDIA_TOKEN_PREFIX = '__media__/';

// Matches base64 data-URL payloads the legacy importer persisted:
// `data:<mime>;base64,<bytes>` — used for repair mapping and detection.
const DATA_URL_RE = /data:[a-zA-Z0-9.+-]+\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+/g;

/** Wrap a media data URL into a styled inline audio player div. */
export function buildAudioPlayerHtml(dataUrl: string): string {
  const mime = audioMimeFromDataUrl(dataUrl);
  return `<div class="anki-audio-player my-2.5 flex items-center justify-center gap-2">
        <audio controls preload="auto" class="h-8 max-w-[280px] rounded-lg shadow-sm" src="${dataUrl}">
          <source src="${dataUrl}" type="${mime}">
        </audio>
      </div>`;
}

/**
 * Replace embedded data URLs in card HTML with lightweight tokens.
 * - audio data URLs  -> [sound:originalFileName] (empty player shells removed)
 * - image data URLs  -> src="__media__/originalFileName"
 * Unknown data URLs (no mapping) are left untouched (safety).
 */
export function tokenizeCardHtml(html: string, dataUrlToFileName: Map<string, string>): string {
  if (!html) return html;

  // 1) <img src="data:..."> -> <img src="__media__/name">
  let result = html.replace(/(<img[^>]*?\ssrc=["'])(data:[^"']+)(["'])/gi, (m, pre: string, url: string, post: string) => {
    const fname = dataUrlToFileName.get(url);
    if (!fname) return m;
    return `${pre}${MEDIA_TOKEN_PREFIX}${fname}${post}`;
  });

  // 2) Whole importer-built audio player shells -> single [sound:] token.
  //    (The shell is `<div class="anki-audio-player ..."><audio ...><source .../></audio></div>`;
  //     replacing it wholesale avoids nested-player artifacts.)
  result = result.replace(
    /<div class="anki-audio-player[^>]*>[\s\S]*?<audio[^>]*>\s*(?:<source[^>]*>\s*)?<\/audio>\s*<\/div>/gi,
    (shell) => {
      const urlMatch = shell.match(/src=["'](data:[^"']+)["']/i);
      if (urlMatch) {
        const fname = dataUrlToFileName.get(urlMatch[1]);
        if (fname) return `[sound:${fname}]`;
      }
      return shell;
    }
  );

  // 3) Any remaining bare data URL in a src attribute
  result = result.replace(/(\ssrc=["'])(data:[^"']+)(["'])/gi, (m, pre: string, url: string, post: string) => {
    const fname = dataUrlToFileName.get(url);
    if (!fname) return m;
    // Audio-ish URLs become sound tokens; anything else becomes a media token.
    if (/^data:audio\//i.test(url)) return `${pre}[sound:${fname}]${post}`;
    return `${pre}${MEDIA_TOKEN_PREFIX}${fname}${post}`;
  });

  return result;
}

/**
 * Resolve tokens in card HTML back to playable data URLs using a
 * fileName -> dataUrl lookup. Missing media is dropped gracefully
 * (e.g. on a second device that never imported the .apkg).
 *
 * Implemented sequentially (not via String.replace) so async
 * resolution is safe.
 */
export async function resolveCardMedia(
  html: string,
  resolveFn: (fileName: string) => Promise<string | null>
): Promise<string> {
  if (!html) return html;

  // Pass 1: [sound:x] tokens -> inline audio player HTML
  let out = '';
  let lastIndex = 0;
  const audioRe = /\[sound:([^\]]+)\]/gi;
  let m: RegExpExecArray | null;
  while ((m = audioRe.exec(html)) !== null) {
    out += html.slice(lastIndex, m.index);
    const dataUrl = await resolveFn(m[1].trim());
    if (dataUrl) out += buildAudioPlayerHtml(dataUrl);
    lastIndex = m.index + m[0].length;
  }
  out += html.slice(lastIndex);

  // Pass 2: __media__/x tokens -> data URL in src attribute (unresolved -> remove src value)
  let out2 = '';
  lastIndex = 0;
  const mediaRe = /(src=["'])(__media__\/[^"']+)(["'])/gi;
  while ((m = mediaRe.exec(out)) !== null) {
    out2 += out.slice(lastIndex, m.index);
    const fname = m[2].slice(MEDIA_TOKEN_PREFIX.length);
    const dataUrl = await resolveFn(fname);
    out2 += `${m[1]}${dataUrl || ''}${m[3]}`;
    lastIndex = m.index + m[0].length;
  }
  out2 += out.slice(lastIndex);

  return out2;
}

/**
 * Resolve a list of audioUrl entries (file names, or legacy data URLs)
 * into playable data URLs. Legacy `data:` entries pass through.
 */
export async function resolveAudioUrls(
  entries: string[],
  resolveFn: (fileName: string) => Promise<string | null>
): Promise<string[]> {
  const out: string[] = [];
  for (const entry of entries || []) {
    if (!entry) continue;
    if (typeof entry === 'string' && entry.startsWith('data:')) {
      out.push(entry); // legacy data URL — playable as-is
      continue;
    }
    const dataUrl = await resolveFn(String(entry));
    if (dataUrl) out.push(dataUrl);
  }
  return out;
}

/** Extract [sound:...] file names from raw note fields JSON. */
function extractSoundFileNames(fieldsJson: string | null | undefined): string[] {
  if (!fieldsJson) return [];
  const names: string[] = [];
  try {
    const fields = typeof fieldsJson === 'string' ? JSON.parse(fieldsJson) : fieldsJson;
    const audioTokenRe = /\[sound:([^\]]+)\]/gi;
    for (const val of Object.values(fields || {})) {
      if (typeof val !== 'string') continue;
      let m: RegExpExecArray | null;
      audioTokenRe.lastIndex = 0;
      while ((m = audioTokenRe.exec(val)) !== null) {
        const n = m[1].trim();
        if (n && !names.includes(n)) names.push(n);
      }
    }
  } catch {
    // corrupt JSON — ignore
  }
  return names;
}

/** Extract [sound:...] file names from card HTML content. */
function extractSoundFileNamesFromHtml(html: string | null | undefined): string[] {
  if (!html) return [];
  const names: string[] = [];
  const re = /\[sound:([^\]]+)\]/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const n = m[1].trim();
    if (n && !names.includes(n)) names.push(n);
  }
  return names;
}

const REPAIR_MARKER_KEY = 'anki_card_media_repair_v1';

/**
 * ONE-TIME startup migration: convert legacy Anki cards into the
 * token format.
 *
 * 1. Build dataUrl -> fileName map from imported_media_assets.
 * 2. For every flashcard:
 *    - tokenize embedded data URLs in front/back content
 *    - rebuild audio_urls as file names (deriving missing ones
 *      from raw flashcard_notes.fields, which still contain the
 *      original [sound:...] tags)
 *    - write back ONLY changed rows (SRS progress untouched)
 * 3. Marker in app_metadata makes this idempotent.
 */
export async function repairAnkiCardMedia(): Promise<{ cardsFixed: number; cardsScanned: number }> {
  const stats = { cardsFixed: 0, cardsScanned: 0 };

  try {
    // Already repaired? Skip silently.
    const marker = await selectSql<{ value: string }>(
      `SELECT value FROM app_metadata WHERE key = ? LIMIT 1;`,
      [REPAIR_MARKER_KEY]
    );
    if (marker && marker.length > 0 && marker[0].value === '1') {
      return stats;
    }

    console.log('🔧 Anki card media repair: starting one-time migration...');

    // ---- Build dataUrl -> fileName map from local media assets ----
    const mediaRows = await selectSql<{ source_file_name: string; data_base64: string }>(
      `SELECT source_file_name, data_base64 FROM imported_media_assets;`
    );
    const dataUrlToFileName = new Map<string, string>();
    for (const row of mediaRows || []) {
      if (row?.data_base64 && row?.source_file_name) {
        dataUrlToFileName.set(row.data_base64, row.source_file_name);
      }
    }
    console.log(`🔧 Media map built: ${dataUrlToFileName.size} assets`);

    // ---- Load notes fields for audio derivation (keyed by note id) ----
    const noteRows = await selectSql<{ id: string; fields: string }>(
      `SELECT id, fields FROM flashcard_notes;`
    );
    const noteFieldsById = new Map<string, string>();
    for (const row of noteRows || []) {
      if (row?.id) noteFieldsById.set(row.id, row.fields);
    }

    // ---- Scan and repair cards ----
    const cards = await selectSql<{
      id: string;
      note_id: string;
      front_content: string;
      back_content: string;
      audio_urls: string | null;
    }>(`SELECT id, note_id, front_content, back_content, audio_urls FROM flashcard_cards;`);

    const nowIso = new Date().toISOString();

    for (const card of cards || []) {
      stats.cardsScanned++;
      const front: string = card.front_content || '';
      const back: string = card.back_content || '';
      DATA_URL_RE.lastIndex = 0;
      const hadDataUrls = DATA_URL_RE.test(front) || DATA_URL_RE.test(back);

      // --- Derive audio file names from multiple sources ---
      const fileNames: string[] = [];

      // a) From current audio_urls (file names or legacy data URLs)
      let storedAudio: string[] = [];
      try {
        storedAudio = card.audio_urls ? JSON.parse(card.audio_urls) : [];
      } catch {
        storedAudio = [];
      }
      for (const entry of storedAudio || []) {
        if (!entry) continue;
        if (typeof entry === 'string' && entry.startsWith('data:')) {
          const fname = dataUrlToFileName.get(entry);
          if (fname && !fileNames.includes(fname)) fileNames.push(fname);
        } else if (!fileNames.includes(entry)) {
          fileNames.push(entry);
        }
      }

      // b) From note fields JSON (authoritative [sound:] tags)
      const noteFields = noteFieldsById.get(card.note_id);
      for (const fname of extractSoundFileNames(noteFields)) {
        if (!fileNames.includes(fname)) fileNames.push(fname);
      }

      // c) From tokens already present in content
      for (const fname of extractSoundFileNamesFromHtml(front)) {
        if (!fileNames.includes(fname)) fileNames.push(fname);
      }
      for (const fname of extractSoundFileNamesFromHtml(back)) {
        if (!fileNames.includes(fname)) fileNames.push(fname);
      }

      // --- Tokenize content ---
      const newFront = hadDataUrls ? tokenizeCardHtml(front, dataUrlToFileName) : front;
      const newBack = hadDataUrls ? tokenizeCardHtml(back, dataUrlToFileName) : back;

      // --- Compare with original row ---
      const newAudioJson = JSON.stringify(fileNames);
      const contentChanged = newFront !== front || newBack !== back;
      const audioChanged = newAudioJson !== (card.audio_urls || '[]');

      if (contentChanged || audioChanged) {
        await executeSql(
          `UPDATE flashcard_cards SET front_content = ?, back_content = ?, audio_urls = ?, updated_at = ? WHERE id = ?;`,
          [newFront, newBack, newAudioJson, nowIso, card.id],
          true // skipSyncHook: batch job — cloud push handled explicitly below
        );
        stats.cardsFixed++;
      }
    }

    // ---- Push repaired rows to cloud (token content is small) ----
    if (stats.cardsFixed > 0) {
      try {
        const repairedIds = await selectSql<{ id: string }>(
          `SELECT id FROM flashcard_cards WHERE updated_at = ?;`,
          [nowIso]
        );
        for (const row of repairedIds || []) {
          const full = await selectSql<any>(`SELECT * FROM flashcard_cards WHERE id = ? LIMIT 1;`, [row.id]);
          if (full && full.length > 0) {
            // EGRESS GUARD: never push any field that still carries base64
            // payloads (e.g. data URLs that could not be mapped because the
            // media was imported on another device). Dropping those fields
            // makes Supabase upsert preserve its existing column values.
            const payload: Record<string, any> = { ...full[0] };
            for (const [k, v] of Object.entries(payload)) {
              if (typeof v === 'string' && v.includes(';base64,')) {
                delete payload[k];
              }
            }
            payload._localOnlyPayload = true; // skip full-row re-fetch in autoSyncRecordToSupabase
            autoSyncRecordToSupabase('flashcard_cards', payload);
          }
        }
      } catch (pushErr) {
        console.warn('Anki media repair: cloud push of repaired cards failed (will retry via outbox):', pushErr);
      }
    }

    // ---- Set idempotency marker ----
    await executeSql(
      `INSERT OR REPLACE INTO app_metadata (key, value, created_at, updated_at) VALUES (?, ?, ?, ?);`,
      [REPAIR_MARKER_KEY, '1', nowIso, nowIso],
      true
    );

    console.log(`🔧 Anki card media repair complete: ${stats.cardsFixed}/${stats.cardsScanned} cards updated.`);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('omnilife_db_updated', { detail: { table: 'flashcard_cards' } }));
    }
  } catch (err) {
    // Never block app startup on this migration.
    console.warn('Anki card media repair skipped due to error:', err);
  }

  return stats;
}

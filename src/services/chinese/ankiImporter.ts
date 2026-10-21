import JSZip from 'jszip';
// @ts-ignore
import initSqlJsAsm from 'sql.js/dist/sql-asm.js';
import type { Database, SqlJsStatic } from 'sql.js';
import { executeSql, selectSql, flushWebDbSnapshot } from '@/db/client';
import { autoSyncRecordToSupabase } from '@/services/sync/syncService';
import { translateCardContentToIndonesian, translateDeckNameToIndonesian } from './ankiTranslation';
import { getMimeType, audioMimeFromDataUrl } from './ankiMediaMime';
import { tokenizeCardHtml } from './ankiMedia';
import { invalidateAnkiMediaCache } from './flashcardService';

export interface ExtractedDeck {
  id: string;
  sourceId: string;
  name: string;
  parentName?: string;
  cardCount: number;
  noteCount: number;
  isSubdeck: boolean;
}

export interface ExtractedField {
  name: string;
  value: string;
}

export interface ExtractedCard {
  id: string;
  noteId: string;
  deckId: string;
  deckName: string;
  sourceCardOrdinal: number;
  cardType: 'basic' | 'reversed' | 'cloze' | 'custom_mapped';
  frontContent: string;
  backContent: string;
  sourceTemplateName: string;
  audioUrls: string[];
  imageUrls: string[];
  tags: string[];
}

export interface ExtractedNote {
  id: string;
  deckId: string;
  sourceNoteIdentifier: string;
  noteTypeName: string;
  fields: Record<string, string>;
  tags: string[];
  importStatus: 'supported' | 'needs_mapping' | 'unsupported';
}

export interface ExtractedMedia {
  sourceFileName: string;
  safeFileName: string;
  mediaType: 'image' | 'audio';
  mimeType: string;
  dataBase64: string;
}

export interface AnkiPackagePreview {
  packageFingerprint: string;
  fileName: string;
  fileSize: number;
  totalDecks: number;
  totalNotes: number;
  totalCards: number;
  totalAudio: number;
  totalImages: number;
  decks: ExtractedDeck[];
  fieldsDetected: string[];
  cardTypesDetected: string[];
  warnings: string[];
  notes: ExtractedNote[];
  cards: ExtractedCard[];
  mediaAssets: ExtractedMedia[];
}

export interface AnkiImportResult {
  success: boolean;
  decksImported: number;
  notesImported: number;
  cardsCreated: number;
  mediaImported: number;
  skippedDuplicates: number;
  warnings: string[];
}

let sqlJsPromise: Promise<SqlJsStatic> | null = null;

/**
 * Pure JavaScript SQLite engine initialization (Zero WASM file dependencies).
 * Works 100% reliably in Desktop, Android WebView, and offline environments.
 */
async function getSqlJs(): Promise<SqlJsStatic> {
  if (!sqlJsPromise) {
    sqlJsPromise = (async () => {
      try {
        const sql = await initSqlJsAsm();
        return sql as unknown as SqlJsStatic;
      } catch (e) {
        console.error('Failed to initialize SQLite ASM engine:', e);
        throw e;
      }
    })();
  }
  return sqlJsPromise;
}

/**
 * Strict HTML Sanitizer - Removes all scripts, styles, objects, and event handlers
 */
export function sanitizeCardHtml(rawHtml: string): string {
  if (!rawHtml) return '';

  let clean = rawHtml;

  // Remove script tags and contents
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  // Remove style tags and contents
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  // Remove iframes, objects, embeds, forms
  clean = clean.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  clean = clean.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  clean = clean.replace(/<embed\b[^>]*>/gi, '');
  clean = clean.replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '');

  // Strip on* event handlers
  clean = clean.replace(/\son\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');
  // Strip javascript: URLs
  clean = clean.replace(/href\s*=\s*(?:'javascript:[^']*'|"javascript:[^"]*")/gi, 'href="#"');
  clean = clean.replace(/src\s*=\s*(?:'javascript:[^']*'|"javascript:[^"]*")/gi, '');

  return clean.trim();
}

/**
 * Escapes regex special characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Renders an Anki card template (qfmt/afmt) with field values, conditional sections, and FrontSide.
 */
function renderAnkiTemplate(
  templateStr: string,
  fields: Record<string, string>
): string {
  if (!templateStr) return '';

  let output = templateStr;

  // 1. Conditional sections: {{#Field}}...{{/Field}}
  output = output.replace(/\{\{#([^}]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (_match, fieldName, inner) => {
    const val = fields[fieldName];
    if (val && val.trim().length > 0) {
      return inner;
    }
    return '';
  });

  // 2. Inverted conditional sections: {{^Field}}...{{/Field}}
  output = output.replace(/\{\{\^([^}]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (_match, fieldName, inner) => {
    const val = fields[fieldName];
    if (!val || val.trim().length === 0) {
      return inner;
    }
    return '';
  });

  // 3. Replace standard field placeholders: {{Field}}, {{cloze:Field}}, {{text:Field}}, {{hint:Field}}
  for (const [fName, fVal] of Object.entries(fields)) {
    const regex = new RegExp(`\\{\\{(?:cloze:|text:|hint:)?${escapeRegex(fName)}\\}\\}`, 'gi');
    output = output.replace(regex, fVal || '');
  }

  // 4. {{FrontSide}} tidak di-inline lagi — app menyajikan isi depan kartu
  // sendiri di atas jawaban, inline hanya menduplikasi hanzi/kalimat.
  output = output.replace(/\{\{FrontSide\}\}/gi, '');

  // 5. Clean any remaining unmatched {{Field}} placeholders
  output = output.replace(/\{\{[^}]+\}\}/g, '');

  return output;
}

/**
 * Replaces sound tags ([sound:xxx.mp3]) and images with embedded media players and data URLs.
 */
function processMediaInContent(
  content: string,
  actualToDataUrl: Map<string, string>,
  collectedAudio: string[],
  collectedImages: string[]
): string {
  let result = content;

  // 1. Replace [sound:xxx.mp3]
  const soundRegex = /\[sound:([^\]]+)\]/gi;
  result = result.replace(soundRegex, (_match, soundFile) => {
    const trimmed = soundFile.trim();
    const dataUrl =
      actualToDataUrl.get(trimmed) ||
      actualToDataUrl.get(decodeURIComponent(trimmed)) ||
      actualToDataUrl.get(encodeURIComponent(trimmed)) ||
      actualToDataUrl.get(trimmed.toLowerCase());

    if (dataUrl) {
      collectedAudio.push(dataUrl);
      const mime = audioMimeFromDataUrl(dataUrl);
      return `<div class="anki-audio-player my-2.5 flex items-center justify-center gap-2">
        <audio controls preload="auto" class="h-8 max-w-[280px] rounded-lg shadow-sm" src="${dataUrl}">
          <source src="${dataUrl}" type="${mime}">
        </audio>
      </div>`;
    }
    return '';
  });

  // 2. Check for loose audio filenames in text (e.g. if field contained raw audio filename)
  actualToDataUrl.forEach((dataUrl, fname) => {
    if (fname.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/i)) {
      const looseRegex = new RegExp(`(?<!src=["']|["'>])\\b${escapeRegex(fname)}\\b`, 'gi');
      if (looseRegex.test(result)) {
        collectedAudio.push(dataUrl);
        const mime = audioMimeFromDataUrl(dataUrl);
        result = result.replace(
          looseRegex,
          `<div class="anki-audio-player my-2.5 flex items-center justify-center gap-2">
            <audio controls preload="auto" class="h-8 max-w-[280px] rounded-lg shadow-sm" src="${dataUrl}">
              <source src="${dataUrl}" type="${mime}">
            </audio>
          </div>`
        );
      }
    }
  });

  // 3. Collect image URLs from <img src="xxx">
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let matchImg: RegExpExecArray | null;
  while ((matchImg = imgRegex.exec(result)) !== null) {
    const imgSrc = matchImg[1].trim();
    const dataUrl =
      actualToDataUrl.get(imgSrc) ||
      actualToDataUrl.get(decodeURIComponent(imgSrc)) ||
      actualToDataUrl.get(encodeURIComponent(imgSrc));
    if (dataUrl) {
      collectedImages.push(dataUrl);
    }
  }

  // Embed image data URLs
  actualToDataUrl.forEach((dataUrl, fname) => {
    if (fname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      result = result.replace(
        new RegExp(`src=["']?${escapeRegex(fname)}["']?`, 'gi'),
        `src="${dataUrl}" class="max-w-full rounded-xl my-2 mx-auto shadow-md"`
      );
      result = result.replace(
        new RegExp(`src=["']?${escapeRegex(encodeURIComponent(fname))}["']?`, 'gi'),
        `src="${dataUrl}" class="max-w-full rounded-xl my-2 mx-auto shadow-md"`
      );
    }
  });

  return result;
}

/**
 * Parses Cloze deletion markup: {{c1::answer::hint}} or {{c1::answer}}
 */
function parseClozeContent(text: string, clozeOrd: number = 1): { front: string; back: string } {
  const clozeRegex = /\{\{c(\d+)::([^:]+?)(?:::([^}]+?))?\}\}/g;

  // Front: replace matching cloze with hint or [...]
  const front = text.replace(clozeRegex, (_match, num, answer, hint) => {
    if (parseInt(num, 10) === clozeOrd) {
      return `<span class="cloze-gap px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold border border-dashed border-blue-400">[ ${hint || '...'} ]</span>`;
    }
    return answer;
  });

  // Back: highlight the active cloze
  const back = text.replace(clozeRegex, (_match, num, answer) => {
    if (parseInt(num, 10) === clozeOrd) {
      return `<span class="cloze-active px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-800 text-amber-950 dark:text-amber-100 font-bold">${answer}</span>`;
    }
    return answer;
  });

  return { front: sanitizeCardHtml(front), back: sanitizeCardHtml(back) };
}

/**
 * Computes simple SHA256 string for duplicate checking
 */
async function computeSha256(buffer: ArrayBuffer): Promise<string> {
  try {
    if (window.crypto && window.crypto.subtle) {
      const hashBuf = await window.crypto.subtle.digest('SHA-256', buffer);
      return Array.from(new Uint8Array(hashBuf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
  } catch (_) {}
  return `apkg_fp_${buffer.byteLength}_${Date.now()}`;
}

/**
 * 1. Safe Read-Only Analysis & Package Preview Generator
 */
export interface ParseAnkiOptions {
  /** Terjemahkan teks Inggris ke Bahasa Indonesia (Hanzi & pinyin tetap) */
  translateToIndonesian?: boolean;
}

export async function parseAnkiPackage(file: File | ArrayBuffer, fileName: string = 'deck.apkg', options: ParseAnkiOptions = {}): Promise<AnkiPackagePreview> {
  const buffer = file instanceof File ? await file.arrayBuffer() : file;
  const fileSize = buffer.byteLength;

  if (fileSize < 100) {
    throw new Error('File .apkg tidak valid atau korup (ukuran file terlalu kecil).');
  }

  const fingerprint = await computeSha256(buffer);
  const zip = await JSZip.loadAsync(buffer);

  // Check for collection.anki2 or collection.anki21 SQLite database
  const ankiDbFile = zip.file('collection.anki21') || zip.file('collection.anki2');
  if (!ankiDbFile) {
    if (zip.file('collection.anki21b') || zip.file('collection.anki2b')) {
      throw new Error('File ini menggunakan format Zstandard Anki terbaru yang belum didukung.');
    }
    throw new Error('Format package tidak dikenali: collection.anki2 tidak ditemukan di dalam arsip.');
  }

  const ankiDbBytes = await ankiDbFile.async('uint8array');
  const SQL = await getSqlJs();
  const db: Database = new SQL.Database(ankiDbBytes);

  const warnings: string[] = [];

  // 1. Read 'col' table: models (note types) & decks
  const colRows = db.exec(`SELECT models, decks FROM col LIMIT 1;`);
  if (!colRows.length || !colRows[0].values.length) {
    throw new Error('Database Anki tidak memiliki tabel col yang valid.');
  }

  const rawModelsStr = colRows[0].values[0][0] as string;
  const rawDecksStr = colRows[0].values[0][1] as string;

  const rawModels: Record<string, any> = JSON.parse(rawModelsStr || '{}');
  const rawDecks: Record<string, any> = JSON.parse(rawDecksStr || '{}');

  // Build deck hierarchy & mapping
  const deckMap: Map<string, ExtractedDeck> = new Map();
  const deckNameToId: Map<string, string> = new Map();

  for (const [did, d] of Object.entries(rawDecks)) {
    if (d.name === 'Default' && Object.keys(rawDecks).length > 1) {
      // Skip empty default deck if other decks exist
      continue;
    }
    const deckName = options.translateToIndonesian
      ? translateDeckNameToIndonesian(d.name || 'Unnamed Deck')
      : (d.name || 'Unnamed Deck');
    const isSubdeck = deckName.includes('::');
    const parentName = isSubdeck ? deckName.split('::').slice(0, -1).join('::') : undefined;
    const internalId = `deck_${fingerprint.substring(0, 8)}_${did}`;

    deckMap.set(did, {
      id: internalId,
      sourceId: did,
      name: deckName,
      parentName,
      cardCount: 0,
      noteCount: 0,
      isSubdeck,
    });
    deckNameToId.set(deckName, internalId);
  }

  // 2. Read media dictionary
  const mediaJsonFile = zip.file('media');
  const mediaMap: Map<string, string> = new Map(); // numericKey -> actualFileName
  const actualToDataUrl: Map<string, string> = new Map(); // actualFileName -> dataUrl
  const extractedMediaAssets: ExtractedMedia[] = [];

  if (mediaJsonFile) {
    try {
      const mediaJsonStr = await mediaJsonFile.async('string');
      const parsedMedia = JSON.parse(mediaJsonStr || '{}');
      for (const [key, fname] of Object.entries(parsedMedia)) {
        if (typeof fname === 'string') {
          mediaMap.set(key, fname);
        }
      }

      // Extract media items
      for (const [key, fname] of mediaMap.entries()) {
        const itemFile = zip.file(key);
        if (itemFile) {
          const { mimeType, mediaType } = getMimeType(fname);
          const base64Data = await itemFile.async('base64');
          const dataUrl = `data:${mimeType};base64,${base64Data}`;
          actualToDataUrl.set(fname, dataUrl);
          // Alias lowercase agar lookup nama file case-insensitive (fix suara tidak muncul)
          const lowerFname = fname.toLowerCase();
          if (!actualToDataUrl.has(lowerFname)) actualToDataUrl.set(lowerFname, dataUrl);

          extractedMediaAssets.push({
            sourceFileName: fname,
            safeFileName: fname.replace(/[^a-zA-Z0-9._-]/g, '_'),
            mediaType,
            mimeType,
            dataBase64: dataUrl,
          });
        }
      }
    } catch (e) {
      warnings.push('Beberapa file media di dalam .apkg tidak dapat diekstrak sepenuhnya.');
    }
  }

  // 3. Read notes table
  const noteRows = db.exec(`SELECT id, mid, tags, flds FROM notes;`);
  const notesMap: Map<string, ExtractedNote> = new Map();
  const allFieldsSet = new Set<string>();

  if (noteRows.length && noteRows[0].values.length) {
    for (const row of noteRows[0].values) {
      const nid = String(row[0]);
      const mid = String(row[1]);
      const tagsStr = (row[2] as string) || '';
      const fldsStr = (row[3] as string) || '';

      const model = rawModels[mid];
      const modelName = model?.name || 'Basic';
      const modelFields: string[] = model?.flds?.map((f: any) => f.name) || [];

      modelFields.forEach((f) => allFieldsSet.add(f));

      const fieldValues = fldsStr.split('\x1f');
      const fieldsObj: Record<string, string> = {};

      modelFields.forEach((fName, idx) => {
        fieldsObj[fName] = fieldValues[idx] || '';
      });

      // Split tags by space
      const tags = tagsStr.trim() ? tagsStr.trim().split(/\s+/).filter(Boolean) : [];

      notesMap.set(nid, {
        id: `fn_${fingerprint.substring(0, 8)}_${nid}`,
        deckId: '', // Will be assigned by cards
        sourceNoteIdentifier: nid,
        noteTypeName: modelName,
        fields: fieldsObj,
        tags,
        importStatus: 'supported',
      });
    }
  }

  // 4. Read cards table
  const cardRows = db.exec(`SELECT id, nid, did, ord, type FROM cards;`);
  const extractedCards: ExtractedCard[] = [];
  const cardTypesSet = new Set<string>();

  if (cardRows.length && cardRows[0].values.length) {
    for (const row of cardRows[0].values) {
      const cid = String(row[0]);
      const nid = String(row[1]);
      const did = String(row[2]);
      const ord = Number(row[3]) || 0;

      const note = notesMap.get(nid);
      let deck = deckMap.get(did);
      if (!deck && deckMap.size > 0) {
        deck = Array.from(deckMap.values())[0];
      }

      if (!note || !deck) continue;

      note.deckId = deck.id;
      deck.cardCount += 1;

      const modelMid = Object.entries(rawModels).find(([_, m]) => m.name === note.noteTypeName)?.[0];
      const activeModel = modelMid ? rawModels[modelMid] : undefined;
      const template = activeModel?.tmpls?.[ord] || activeModel?.tmpls?.[0];

      let frontContent = '';
      let backContent = '';
      let cardType: 'basic' | 'reversed' | 'cloze' | 'custom_mapped' = 'basic';
      const cardAudioUrls: string[] = [];
      const cardImageUrls: string[] = [];

      const isClozeModel = activeModel?.type === 1 || note.noteTypeName.toLowerCase().includes('cloze');

      if (isClozeModel) {
        cardType = 'cloze';
        cardTypesSet.add('Cloze');
        const textToCloze = Object.values(note.fields).find((v) => v.includes('{{c')) || Object.values(note.fields)[0] || '';
        const parsed = parseClozeContent(textToCloze, ord + 1);
        frontContent = processMediaInContent(parsed.front, actualToDataUrl, cardAudioUrls, cardImageUrls);
        backContent = processMediaInContent(parsed.back, actualToDataUrl, cardAudioUrls, cardImageUrls);
      } else {
        // Basic / Reversed / Field-based
        if (template?.qfmt && template?.afmt) {
          const renderedFront = renderAnkiTemplate(template.qfmt, note.fields);
          // JANGAN inline {{FrontSide}} ke back: app sudah menampilkan isi depan
          // kartu sendiri di atas jawaban, jadi inline menbuat hanzi/kalimat
          // tampil dua kali saat "melihat jawaban". Isi depan yang butuh di
          // belakang (mis. gambar soal) tetap ada lewat field yang sama.
          const renderedBack = renderAnkiTemplate(template.afmt, note.fields);
          frontContent = processMediaInContent(renderedFront, actualToDataUrl, cardAudioUrls, cardImageUrls);
          backContent = processMediaInContent(renderedBack, actualToDataUrl, cardAudioUrls, cardImageUrls);
        } else {
          // Heuristic fallback: Hanzi/Front -> Back
          const fieldKeys = Object.keys(note.fields);
          const frontKey = fieldKeys.find((k) => /hanzi|simplified|front|question|chinese/i.test(k)) || fieldKeys[0] || '';
          const backKey = fieldKeys.find((k) => /meaning|back|answer|english|indonesian|sentence/i.test(k)) || fieldKeys[1] || '';

          const rawFront = note.fields[frontKey] || '';
          const rawBack = note.fields[backKey] || Object.values(note.fields).slice(1).join(' - ');
          frontContent = processMediaInContent(rawFront, actualToDataUrl, cardAudioUrls, cardImageUrls);
          backContent = processMediaInContent(rawBack, actualToDataUrl, cardAudioUrls, cardImageUrls);
        }

        if (ord > 0 || note.noteTypeName.toLowerCase().includes('reverse')) {
          cardType = 'reversed';
          cardTypesSet.add('Reversed');
        } else {
          cardType = 'basic';
          cardTypesSet.add('Basic');
        }
      }

      // FIX SUARA TIDAK MUNCUL: fallback — kumpulkan [sound:] dari SEMUA field
      // yang belum tampil di kartu (mis. field "Audio" tidak dirender template Anki),
      // lalu tempelkan pemutar audio di bagian belakang kartu.
      {
        const fallbackSoundRegex = /\[sound:([^\]]+)\]/gi;
        for (const fVal of Object.values(note.fields)) {
          if (!fVal) continue;
          let sm: RegExpExecArray | null;
          fallbackSoundRegex.lastIndex = 0;
          while ((sm = fallbackSoundRegex.exec(fVal)) !== null) {
            const trimmed = sm[1].trim();
            const dataUrl =
              actualToDataUrl.get(trimmed) ||
              actualToDataUrl.get(decodeURIComponent(trimmed)) ||
              actualToDataUrl.get(encodeURIComponent(trimmed)) ||
              actualToDataUrl.get(trimmed.toLowerCase());
            if (dataUrl && !backContent.includes(dataUrl) && !frontContent.includes(dataUrl)) {
              const mime = audioMimeFromDataUrl(dataUrl);
              backContent += `\n<div class="anki-audio-player my-2.5 flex items-center justify-center gap-2">
                <audio controls preload="auto" class="h-8 max-w-[280px] rounded-lg shadow-sm" src="${dataUrl}">
                  <source src="${dataUrl}" type="${mime}">
                </audio>
              </div>`;
              cardAudioUrls.push(dataUrl);
            }
          }
        }
      }

      extractedCards.push({
        id: `fc_${fingerprint.substring(0, 8)}_${cid}`,
        noteId: note.id,
        deckId: deck.id,
        deckName: deck.name,
        sourceCardOrdinal: ord,
        cardType,
        frontContent: sanitizeCardHtml(options.translateToIndonesian ? translateCardContentToIndonesian(frontContent) : frontContent),
        backContent: sanitizeCardHtml(options.translateToIndonesian ? translateCardContentToIndonesian(backContent) : backContent),
        sourceTemplateName: template?.name || 'Standard',
        audioUrls: Array.from(new Set(cardAudioUrls)),
        imageUrls: Array.from(new Set(cardImageUrls)),
        tags: note.tags,
      });
    }
  }

  // Count notes per deck
  for (const d of deckMap.values()) {
    d.noteCount = extractedCards.filter((c) => c.deckId === d.id).length;
  }

  db.close();

  const totalAudio = extractedMediaAssets.filter((m) => m.mediaType === 'audio').length;
  const totalImages = extractedMediaAssets.filter((m) => m.mediaType === 'image').length;

  return {
    packageFingerprint: fingerprint,
    fileName,
    fileSize,
    totalDecks: deckMap.size,
    totalNotes: notesMap.size,
    totalCards: extractedCards.length,
    totalAudio,
    totalImages,
    decks: Array.from(deckMap.values()),
    fieldsDetected: Array.from(allFieldsSet),
    cardTypesDetected: Array.from(cardTypesSet),
    warnings,
    notes: Array.from(notesMap.values()),
    cards: extractedCards,
    mediaAssets: extractedMediaAssets,
  };
}

/**
 * Convert a data-URL list (audio) into original file names for persistence.
 * Content-embedded [sound:tokens] that refer to known media are included so
 * audio_urls stays the authoritative list even when template rendering
 * dropped the audio field (legacy playback bug).
 */
function collectAudioFileNames(
  audioDataUrls: string[],
  frontTokenized: string,
  backTokenized: string,
  dataUrlToFileName: Map<string, string>
): string[] {
  const names: string[] = [];

  // a) Known audio data URLs -> original file names
  for (const entry of audioDataUrls || []) {
    if (!entry) continue;
    if (entry.startsWith('data:')) {
      const fname = dataUrlToFileName.get(entry);
      if (fname && !names.includes(fname)) names.push(fname);
    } else if (!names.includes(entry)) {
      names.push(entry); // already a file name
    }
  }

  // b) [sound:x] tokens present in persisted (tokenized) content
  const tokenRe = /\[sound:([^\]]+)\]/gi;
  for (const html of [frontTokenized, backTokenized]) {
    let m: RegExpExecArray | null;
    tokenRe.lastIndex = 0;
    while ((m = tokenRe.exec(html)) !== null) {
      const fname = m[1].trim();
      if (fname && !names.includes(fname)) names.push(fname);
    }
  }

  return names;
}

/**
 * Convert a data-URL list (images) into original file names for persistence.
 * Unknown entries pass through unchanged.
 */
function mapMediaListToNames(entries: string[], dataUrlToFileName: Map<string, string>): string[] {
  const out: string[] = [];
  for (const entry of entries || []) {
    if (!entry) continue;
    if (entry.startsWith('data:')) {
      const fname = dataUrlToFileName.get(entry);
      if (fname && !out.includes(fname)) out.push(fname);
    } else if (!out.includes(entry)) {
      out.push(entry);
    }
  }
  return out;
}

/**
 * 2. Commit Importer: Writes preview content transactionally into SQLite & Syncs to Supabase
 */
export async function commitAnkiImport(
  preview: AnkiPackagePreview,
  selectedDeckIds?: string[]
): Promise<AnkiImportResult> {
  const now = new Date().toISOString();
  const selectedDecks = selectedDeckIds
    ? preview.decks.filter((d) => selectedDeckIds.includes(d.id))
    : preview.decks;

  const validDeckIds = new Set(selectedDecks.map((d) => d.id));
  const cardsToImport = preview.cards.filter((c) => validDeckIds.has(c.deckId));
  const validNoteIds = new Set(cardsToImport.map((c) => c.noteId));
  const notesToImport = preview.notes.filter((n) => validNoteIds.has(n.id));

  let skippedDuplicates = 0;
  let cardsCreated = 0;
  let notesImported = 0;
  let decksImported = 0;
  let mediaImported = 0;

  // 1. Insert Decks
  for (const d of selectedDecks) {
    try {
      const existing = await selectSql<any>(`SELECT id FROM learning_decks WHERE id = ? LIMIT 1;`, [d.id]);
      if (existing.length === 0) {
        await executeSql(
          `INSERT INTO learning_decks (id, owner_id, name, parent_deck_id, source, source_package_fingerprint, card_count, status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            d.id,
            'usr_local_default',
            d.name,
            d.parentName ? `deck_${preview.packageFingerprint.substring(0, 8)}_${d.parentName}` : null,
            'anki_import',
            preview.packageFingerprint,
            d.cardCount,
            'active',
            now,
            now,
          ]
        );
        autoSyncRecordToSupabase('learning_decks', {
          id: d.id,
          name: d.name,
          source: 'anki_import',
          source_package_fingerprint: preview.packageFingerprint,
          card_count: d.cardCount,
          status: 'active',
          created_at: now,
          updated_at: now,
        });
        decksImported += 1;
      }
    } catch (err) {
      console.warn('Error inserting deck:', err);
    }
  }

  // 2. Insert Notes
  for (const n of notesToImport) {
    try {
      const existing = await selectSql<any>(`SELECT id FROM flashcard_notes WHERE id = ? LIMIT 1;`, [n.id]);
      if (existing.length === 0) {
        await executeSql(
          `INSERT INTO flashcard_notes (id, deck_id, source_note_identifier, note_type_name, fields, tags, import_status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            n.id,
            n.deckId,
            n.sourceNoteIdentifier,
            n.noteTypeName,
            JSON.stringify(n.fields),
            JSON.stringify(n.tags),
            n.importStatus,
            now,
            now,
          ]
        );
        autoSyncRecordToSupabase('flashcard_notes', {
          id: n.id,
          deck_id: n.deckId,
          source_note_identifier: n.sourceNoteIdentifier,
          note_type_name: n.noteTypeName,
          fields: n.fields,
          tags: n.tags,
          import_status: n.importStatus,
          created_at: now,
          updated_at: now,
        });
        notesImported += 1;
      }
    } catch (err) {
      console.warn('Error inserting note:', err);
    }
  }

  // Pre-compute data URL -> original file name mapping (for content tokenization).
  // Media itself stays local-only; persisted content uses lightweight tokens.
  const dataUrlToFileName = new Map<string, string>();
  for (const m of preview.mediaAssets) {
    if (m.dataBase64) dataUrlToFileName.set(m.dataBase64, m.sourceFileName);
  }

  // 3. Insert / Update Cards
  for (const c of cardsToImport) {
    try {
      // Tokenize content & audio for persistence (base64 media stays local-only)
      const frontTokenized = tokenizeCardHtml(c.frontContent, dataUrlToFileName);
      const backTokenized = tokenizeCardHtml(c.backContent, dataUrlToFileName);
      const audioFileNames = collectAudioFileNames(c.audioUrls || [], frontTokenized, backTokenized, dataUrlToFileName);
      const imageFileNames = mapMediaListToNames(c.imageUrls || [], dataUrlToFileName);

      const existing = await selectSql<any>(`SELECT id FROM flashcard_cards WHERE id = ? LIMIT 1;`, [c.id]);
      if (existing.length > 0) {
        // Upgrade existing card content and audio URLs while preserving SRS progress
        await executeSql(
          `UPDATE flashcard_cards 
           SET front_content = ?, back_content = ?, audio_urls = ?, image_urls = ?, updated_at = ?
           WHERE id = ?;`,
          [
            frontTokenized,
            backTokenized,
            JSON.stringify(audioFileNames),
            JSON.stringify(imageFileNames),
            now,
            c.id,
          ]
        );
        skippedDuplicates += 1;
        continue;
      }

      await executeSql(
        `INSERT INTO flashcard_cards (id, note_id, deck_id, source_card_ordinal, card_type, front_content, back_content, audio_urls, image_urls, source_template_name, study_status, interval_days, ease_factor, repetitions, lapses, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          c.id,
          c.noteId,
          c.deckId,
          c.sourceCardOrdinal,
          c.cardType,
          frontTokenized,
          backTokenized,
          JSON.stringify(audioFileNames),
          JSON.stringify(imageFileNames),
          c.sourceTemplateName,
          'not_started',
          0,
          2.5,
          0,
          0,
          now,
          now,
        ]
      );

      autoSyncRecordToSupabase('flashcard_cards', {
        id: c.id,
        note_id: c.noteId,
        deck_id: c.deckId,
        source_card_ordinal: c.sourceCardOrdinal,
        card_type: c.cardType,
        front_content: frontTokenized,
        back_content: backTokenized,
        audio_urls: JSON.stringify(audioFileNames),
        image_urls: JSON.stringify(imageFileNames),
        source_template_name: c.sourceTemplateName,
        study_status: 'not_started',
        interval_days: 0,
        ease_factor: 2.5,
        repetitions: 0,
        lapses: 0,
        created_at: now,
        updated_at: now,
      });

      cardsCreated += 1;
    } catch (err) {
      console.warn('Error inserting card:', err);
    }
  }

  // 4. Insert Media Assets
  for (const m of preview.mediaAssets) {
    try {
      const mediaId = `media_${preview.packageFingerprint.substring(0, 8)}_${m.safeFileName}`;
      const existing = await selectSql<any>(`SELECT id FROM imported_media_assets WHERE id = ? LIMIT 1;`, [mediaId]);
      if (existing.length === 0) {
        await executeSql(
          `INSERT INTO imported_media_assets (id, owner_id, source_package_fingerprint, source_file_name, safe_file_name, media_type, mime_type, data_base64, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            mediaId,
            'usr_local_default',
            preview.packageFingerprint,
            m.sourceFileName,
            m.safeFileName,
            m.mediaType,
            m.mimeType,
            m.dataBase64,
            now,
          ]
        );
        mediaImported += 1;
      }
    } catch (err) {
      console.warn('Error inserting media asset:', err);
    }
  }

  // Refresh the read-time media cache so newly imported files resolve immediately
  invalidateAnkiMediaCache();

  // 5. Trigger Immediate Outbox Flush to Supabase Cloud if Online
  // NOTE: only pushes the pending record mutations (decks/notes/cards).
  // A full migrateLocalDataToSupabase() upload here was the cause of massive
  // redundant cloud uploads after every Anki import (storage/egress bloat).
  try {
    const { pushPendingChanges } = await import('@/services/sync/syncService');
    await pushPendingChanges();
  } catch (syncErr) {
    console.warn('Outbox flush after Anki import notice:', syncErr);
  }

  try {
    await flushWebDbSnapshot();
  } catch (flushErr) {
    console.warn('Snapshot flush warning:', flushErr);
  }

  try {
    window.dispatchEvent(new CustomEvent('omnilife_db_updated'));
    window.dispatchEvent(new CustomEvent('db_mutation'));
  } catch {}

  return {
    success: true,
    decksImported,
    notesImported,
    cardsCreated,
    mediaImported,
    skippedDuplicates,
    warnings: preview.warnings,
  };
}

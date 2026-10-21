// ankiTranslationRepair.ts
// ---------------------------------------------------------------------------
// ONE-TIME startup migration: memperbaiki kartu deck HSK yang artinya masih
// tercampur Indonesia–Inggris akibat impor dengan kamus terjemahan lama.
//
// Strategi (akurat, bukan tebak-tebakan):
//   1. Konten Inggris ASLI masih utuh di flashcard_notes.fields — sumber
//      kebenaran. Field "Meaning" dipetakan EKSAK via GLOSS_INDO, field
//      "SentenceMeaning" via SENTENCE_INDO (lihat ankiGlossIndonesian.ts).
//   2. Untuk tiap kartu, perbarui hanya blok terjemahan di back_content:
//      <div class=english>…</div>  (arti kartu) dan
//      <div class=meaningSent>…</div> (arti kalimat contoh).
//      Hanzi, pinyin, [sound:], gambar, dan SRS tidak disentuh.
//   3. Kartu tanpa field notes yang cocok tetap diperbaiki lewat
//      repairMixedTranslation() (jaring pengaman berbasis kamus).
//   4. Idempoten via marker app_metadata; hanya baris berubah yang ditulis.
// ---------------------------------------------------------------------------

import { executeSql, selectSql } from '@/db/client';
import { autoSyncRecordToSupabase } from '@/services/sync/syncService';
import { GLOSS_INDO, SENTENCE_INDO, POS_INDO, normalizeGlossKey } from './ankiGlossIndonesian';
import { repairMixedTranslation } from './ankiTranslation';

const TRANSLATION_REPAIR_MARKER = 'anki_translation_repair_v2';

interface NoteRow {
  id: string;
  fields: string;
}

interface CardRow {
  id: string;
  note_id: string;
  front_content: string;
  back_content: string;
}

/** Ganti isi elemen HTML pertama `<tag class=cls>…</tag>` (body mengandung nested div hanya pada meaningSent lama). */
function replaceBlockContent(html: string, tag: string, cls: string, newBody: string): { html: string; changed: boolean; found: boolean } {
  const openRe = new RegExp(`<${tag}(\\s[^>]*?)?class=(['\"]?)${cls}\\2[^>]*>`, 'i');
  const open = openRe.exec(html);
  if (!open) return { html, changed: false, found: false };
  const start = open.index + open[0].length;
  // Cari tag penutup yang seimbang (bisa ada <div> bersarang di kartu lama).
  let depth = 1;
  const tagRe = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'gi');
  tagRe.lastIndex = start;
  let m: RegExpExecArray | null;
  let end = -1;
  while ((m = tagRe.exec(html)) !== null) {
    if (m[0][1] === '/') {
      depth--;
      if (depth === 0) {
        end = m.index;
        break;
      }
    } else if (!m[0].endsWith('/>')) {
      depth++;
    }
  }
  if (end < 0) return { html, changed: false, found: false };
  const body = html.slice(start, end);
  if (body === newBody) return { html, changed: false, found: true };
  return {
    html: html.slice(0, start) + newBody + html.slice(end),
    changed: true,
    found: true,
  };
}

/** Lookup glosarium dengan beberapa variasi key (verbatim, &nbsp;→spasi, dan sebaliknya). */
function lookupGloss(raw: string): string | null {
  if (!raw) return null;
  const candidates = [
    normalizeGlossKey(raw),
    normalizeGlossKey(raw.replace(/&nbsp;/gi, ' ')),
    normalizeGlossKey(raw).replace(/ /g, '&nbsp;'),
  ];
  for (const key of candidates) {
    if (GLOSS_INDO[key] !== undefined) return GLOSS_INDO[key];
  }
  return null;
}

function lookupSentence(raw: string): string | null {
  if (!raw) return null;
  const plain = normalizeGlossKey(raw.replace(/<[^>]*>/g, ''));
  // Kartu lama membungkus kalimat dalam nested <div> → coba juga bentuk bersarang.
  const nestedVariants = new Set<string>([plain]);
  const divWrap = raw.match(/<div>([\s\S]*)<\/div>/i);
  if (divWrap) {
    nestedVariants.add(normalizeGlossKey(`<div>${divWrap[1]}</div>`));
  }
  for (const key of nestedVariants) {
    if (SENTENCE_INDO[key] !== undefined) return SENTENCE_INDO[key];
  }
  return null;
}

/** Label kelas kata ( Inggris → Indonesia) bila dikenali; null → biarkan. */
function lookupPos(raw: string): string | null {
  if (!raw) return null;
  const key = normalizeGlossKey(raw);
  return POS_INDO[key] ?? null;
}

/**
 * Perbaiki satu kartu: kembalikan back_content yang sudah diperbaiki,
 * atau null jika tidak ada perubahan.
 */
function repairCardBack(
  backContent: string,
  meaningEn: string | null,
  sentenceEn: string | null,
  posEn: string | null
): string | null {
  let html = backContent;
  let changed = false;

  // 1) Arti kartu — prioritas: mapping EKSAK dari field asli.
  if (meaningEn) {
    const indo = lookupGloss(meaningEn);
    if (indo) {
      const r = replaceBlockContent(html, 'div', 'english', indo);
      if (r.changed) {
        html = r.html;
        changed = true;
      }
    }
  }

  // 2) Arti kalimat — mapping EKSAK dari field asli.
  if (sentenceEn) {
    const indo = lookupSentence(sentenceEn);
    if (indo) {
      const r = replaceBlockContent(html, 'div', 'meaningSent', indo);
      if (r.changed) {
        html = r.html;
        changed = true;
      }
    }
  }

  // 3) Kelas kata — mapping EKSAK (verb → verba (kata kerja), dst).
  if (posEn) {
    const indo = lookupPos(posEn);
    if (indo) {
      const r = replaceBlockContent(html, 'div', 'description', indo);
      if (r.changed) {
        html = r.html;
        changed = true;
      }
    }
  }

  // 4) Jaring pengaman: sisa campuran (termasuk kartu tanpa mapping) dipoles kamus.
  const polished = repairMixedTranslation(html);
  if (polished !== html) {
    html = polished;
    changed = true;
  }

  return changed ? html : null;
}

/**
 * ONE-TIME startup migration (idempoten). Memperbaiki terjemahan campuran
 * di seluruh flashcard_cards. Tidak pernah melempar error ke pemanggil.
 */
export async function repairDeckTranslations(): Promise<{ cardsFixed: number; cardsScanned: number; exactMeaning: number; exactSentence: number }> {
  const stats = { cardsFixed: 0, cardsScanned: 0, exactMeaning: 0, exactSentence: 0 };

  try {
    const marker = await selectSql<{ value: string }>(
      `SELECT value FROM app_metadata WHERE key = ? LIMIT 1;`,
      [TRANSLATION_REPAIR_MARKER]
    );
    if (marker && marker.length > 0 && marker[0].value === '1') {
      return stats;
    }

    console.log('🔧 Translation repair: starting one-time migration...');

    // ---- Field notes asli (Inggris) per note ----
    const notes = await selectSql<NoteRow>(`SELECT id, fields FROM flashcard_notes;`);
    const meaningByNote = new Map<string, string>();
    const sentenceByNote = new Map<string, string>();
    const posByNote = new Map<string, string>();
    for (const n of notes || []) {
      if (!n?.fields) continue;
      try {
        const fl = JSON.parse(n.fields) as Record<string, string>;
        if (typeof fl['Meaning'] === 'string' && fl['Meaning'].trim()) meaningByNote.set(n.id, fl['Meaning']);
        if (typeof fl['SentenceMeaning'] === 'string' && fl['SentenceMeaning'].trim()) sentenceByNote.set(n.id, fl['SentenceMeaning']);
        if (typeof fl['Part of speech'] === 'string' && fl['Part of speech'].trim()) posByNote.set(n.id, fl['Part of speech']);
      } catch {
        /* fields bukan JSON valid — lewati */
      }
    }
    console.log(`🔧 Translation repair: ${meaningByNote.size} notes dengan Meaning, ${sentenceByNote.size} dengan SentenceMeaning.`);

    // ---- Pindai semua kartu ----
    const cards = await selectSql<CardRow>(
      `SELECT id, note_id, front_content, back_content FROM flashcard_cards;`
    );
    const nowIso = new Date().toISOString();

    for (const card of cards || []) {
      stats.cardsScanned++;
      const repaired = repairCardBack(
        card.back_content || '',
        meaningByNote.get(card.note_id) || null,
        sentenceByNote.get(card.note_id) || null,
        posByNote.get(card.note_id) || null
      );
      if (repaired !== null) {
        if (meaningByNote.has(card.note_id) && lookupGloss(meaningByNote.get(card.note_id)!)) stats.exactMeaning++;
        if (sentenceByNote.has(card.note_id) && lookupSentence(sentenceByNote.get(card.note_id)!)) stats.exactSentence++;
        await executeSql(
          `UPDATE flashcard_cards SET back_content = ?, updated_at = ? WHERE id = ?;`,
          [repaired, nowIso, card.id],
          true // skipSyncHook: push eksplisit di bawah
        );
        stats.cardsFixed++;
      }
    }

    // ---- Push baris yang diperbaiki ke cloud (konten token kecil) ----
    if (stats.cardsFixed > 0) {
      try {
        const repairedIds = await selectSql<{ id: string }>(
          `SELECT id FROM flashcard_cards WHERE updated_at = ?;`,
          [nowIso]
        );
        for (const row of repairedIds || []) {
          const full = await selectSql<any>(`SELECT * FROM flashcard_cards WHERE id = ? LIMIT 1;`, [row.id]);
          if (full && full.length > 0) {
            const payload: Record<string, any> = { ...full[0] };
            for (const [k, v] of Object.entries(payload)) {
              if (typeof v === 'string' && v.includes(';base64,')) delete payload[k];
            }
            payload._localOnlyPayload = true;
            autoSyncRecordToSupabase('flashcard_cards', payload);
          }
        }
      } catch (pushErr) {
        console.warn('Translation repair: cloud push failed (will retry via outbox):', pushErr);
      }
    }

    await executeSql(
      `INSERT OR REPLACE INTO app_metadata (key, value, created_at, updated_at) VALUES (?, ?, ?, ?);`,
      [TRANSLATION_REPAIR_MARKER, '1', nowIso, nowIso],
      true
    );

    console.log(`🔧 Translation repair complete: ${stats.cardsFixed}/${stats.cardsScanned} cards updated (exact meaning: ${stats.exactMeaning}, exact sentence: ${stats.exactSentence}).`);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('omnilife_db_updated', { detail: { table: 'flashcard_cards' } }));
    }
  } catch (err) {
    console.warn('Translation repair skipped due to error:', err);
  }

  return stats;
}

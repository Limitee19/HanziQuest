// scripts/simulateTranslationRepair.mjs
// Simulasi lokal (tanpa Tauri): jalankan logika perbaikan terjemahan terhadap
// salinan DB nyata (plm_audit.db) memakai sql.js, lalu laporkan hasil.
// Pemakaian: node scripts/simulateTranslationRepair.mjs <path-db>
import initSqlJs from 'sql.js';
import fs from 'fs';

const dbPath = process.argv[2] || './plm_audit.db';
if (!fs.existsSync(dbPath)) {
  console.error('DB not found:', dbPath);
  process.exit(1);
}

const SQL = await initSqlJs();
const db = new SQL.Database(fs.readFileSync(dbPath));

// ---- Muat peta terjemahan dari modul TS (dinamis via strip tipe sederhana) ----
const glossSrc = fs.readFileSync('./src/services/chinese/ankiGlossIndonesian.ts', 'utf8');
function extractMap(name) {
  const start = glossSrc.indexOf(`export const ${name}`);
  const objStart = glossSrc.indexOf('{', start);
  let depth = 0, i = objStart;
  for (; i < glossSrc.length; i++) {
    if (glossSrc[i] === '{') depth++;
    else if (glossSrc[i] === '}') { depth--; if (depth === 0) break; }
  }
  const body = glossSrc.slice(objStart, i + 1);
  // key bisa 'x' atau "x" atau bare; nilai selalu string quote ' atau "
  const map = {};
  const re = /(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"|([A-Za-z0-9_.]+))\s*:\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)')/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    const key = m[1] !== undefined ? m[1] : m[2] !== undefined ? m[2] : m[3];
    const val = m[4] !== undefined ? m[4] : m[5];
    map[key.replace(/\\'/g, "'").replace(/\\"/g, '"')] = val;
  }
  return map;
}
const GLOSS = extractMap('GLOSS_INDO');
const SENT = extractMap('SENTENCE_INDO');
console.log(`Maps loaded: GLOSS=${Object.keys(GLOSS).length} SENTENCE=${Object.keys(SENT).length}`);

const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

function lookupGloss(raw) {
  for (const key of [norm(raw), norm(raw.replace(/&nbsp;/gi, ' ')), norm(raw).replace(/ /g, '&nbsp;')]) {
    if (GLOSS[key] !== undefined) return GLOSS[key];
  }
  return null;
}
function lookupSentence(raw) {
  const plain = norm(String(raw ?? '').replace(/<[^>]*>/g, ''));
  const keys = new Set([plain]);
  const divWrap = raw.match(/<div>([\s\S]*)<\/div>/i);
  if (divWrap) keys.add(norm(`<div>${divWrap[1]}</div>`));
  for (const k of keys) if (SENT[k] !== undefined) return SENT[k];
  return null;
}

function replaceBlockContent(html, tag, cls, newBody) {
  const openRe = new RegExp(`<${tag}(\\s[^>]*?)?class=(['"]?)${cls}\\2[^>]*>`, 'i');
  const open = openRe.exec(html);
  if (!open) return { html, changed: false, found: false };
  const start = open.index + open[0].length;
  let depth = 1;
  const tagRe = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'gi');
  tagRe.lastIndex = start;
  let m, end = -1;
  while ((m = tagRe.exec(html)) !== null) {
    if (m[0][1] === '/') { depth--; if (depth === 0) { end = m.index; break; } }
    else if (!m[0].endsWith('/>')) depth++;
  }
  if (end < 0) return { html, changed: false, found: false };
  const body = html.slice(start, end);
  if (body === newBody) return { html, changed: false, found: true };
  return { html: html.slice(0, start) + newBody + html.slice(end), changed: true, found: true };
}

// ---- Baca notes & cards ----
const notes = db.exec('SELECT id, fields FROM flashcard_notes')[0].values;
const meaningByNote = new Map(), sentenceByNote = new Map();
for (const [id, f] of notes) {
  try {
    const fl = JSON.parse(f);
    if (typeof fl['Meaning'] === 'string' && fl['Meaning'].trim()) meaningByNote.set(id, fl['Meaning']);
    if (typeof fl['SentenceMeaning'] === 'string' && fl['SentenceMeaning'].trim()) sentenceByNote.set(id, fl['SentenceMeaning']);
  } catch {}
}

const cards = db.exec('SELECT id, note_id, back_content FROM flashcard_cards')[0].values;
let fixed = 0, exactMeaning = 0, exactSentence = 0, missMeaning = 0, missSentence = 0;
const samples = [];
const updates = [];

for (const [id, noteId, back] of cards) {
  let html = String(back ?? '');
  let changed = false;
  const mEn = meaningByNote.get(noteId) || null;
  const sEn = sentenceByNote.get(noteId) || null;

  if (mEn) {
    const indo = lookupGloss(mEn);
    if (indo) {
      const r = replaceBlockContent(html, 'div', 'english', indo);
      if (r.changed) { html = r.html; changed = true; exactMeaning++; }
      else if (!r.found) missMeaning++;
    } else missMeaning++;
  }
  if (sEn) {
    const indo = lookupSentence(sEn);
    if (indo) {
      const r = replaceBlockContent(html, 'div', 'meaningSent', indo);
      if (r.changed) { html = r.html; changed = true; exactSentence++; }
      else if (!r.found) missSentence++;
    } else missSentence++;
  }

  if (changed) { fixed++; if (samples.length < 6) samples.push({ id, before: back.slice(0, 200), after: html.slice(0, 200) }); updates.push([html, id]); }
}

console.log(`Cards scanned: ${cards.length}`);
console.log(`Cards to fix:  ${fixed}`);
console.log(`Exact meaning hits: ${exactMeaning} | misses: ${missMeaning}`);
console.log(`Exact sentence hits: ${exactSentence} | misses: ${missSentence}`);
for (const s of samples) {
  console.log('---\nBEFORE:', s.before.replace(/\n/g, '⏎'));
  console.log('AFTER: ', s.after.replace(/\n/g, '⏎'));
}

// Terapkan update ke DB hasil simulasi bila flag --apply
if (process.argv.includes('--apply')) {
  for (const [html, id] of updates) {
    db.run('UPDATE flashcard_cards SET back_content = ? WHERE id = ?', [html, id]);
  }
  const out = dbPath.replace(/\.db$/, '') + '.repaired.db';
  fs.writeFileSync(out, Buffer.from(db.export()));
  console.log('Applied. Written to', out);
}

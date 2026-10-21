// scripts/auditCardTranslations.mjs
// Audit kartu flashcard: laporkan kartu yang artinya masih mengandung sisa
// bahasa Inggris (Indo–English mix). Dipakai untuk memverifikasi migrasi
// repairDeckTranslations. Pemakaian:
//   node scripts/auditCardTranslations.mjs <path-db> [--all]
// Tanpa --all hanya deck HSK yang dicek (nama deck mengandung 'HSK').
import initSqlJs from 'sql.js';
import fs from 'fs';

const dbPath = process.argv[2];
if (!dbPath || !fs.existsSync(dbPath)) {
  console.error('Pemakaian: node scripts/auditCardTranslations.mjs <path-db> [--all]');
  process.exit(1);
}
const onlyHsk = !process.argv.includes('--all');

const SQL = await initSqlJs();
const db = new SQL.Database(fs.readFileSync(dbPath));

// ---- Kamus kata Inggris yang tidak boleh tersisa ----
const ENGLISH_WORDS = new Set([
  // kata fungsi (tidak ada padanan langsung di teks Indonesia hasil terjemahan)
  'the','of','to','in','for','with','on','at','by','from','is','are','was','were','be','been','being',
  'have','has','had','do','does','did','will','would','can','could','should','must','may','might',
  'this','that','these','those','there','here','it','its','as','than','then','so','if','or','but',
  'because','while','when','where','who','whom','which','what','how','not','a','an','and','am',
  'into','onto','about','over','under','again','further','once','very','too','also','just','now',
  'going','want','need','make','made','get','got','take','took','put','let','say','said','tell',
  // sisa frasa/word glosarium (subset yang relevan untuk kartu)
  'commutes','commute','foot','disassembling','fingernails','overcoat','pedestrians','passport',
  'climbing','sunrise','walking','waiting','watching','studying','smiling','supermarket','library',
  'yours','mine','hers','theirs','ours','myself','yourself','himself','herself','itself','themselves',
]);
// Kata yang sah dalam bahasa Indonesia walau juga ada di Inggris:
const ID_WHITELIST = new Set(['air','di','ke','ini','itu','sama','ada','sir','mau','masa','nota','fasih','supermarket','jogging','as']);

const stripHtml = (s) => String(s ?? '')
  .replace(/<[^>]*>/g, ' ')
  .replace(/\[sound:[^\]]+\]/gi, ' ')
  .replace(/__media__\/[^\s"']+/g, ' ')
  .replace(/&nbsp;/gi, ' ')
  .replace(/&[a-z]+;/gi, ' ');

// Segmen Latin tanpa pinyin bertanda (pinyin = konten China, sah).
const CJK = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/;
const PINYIN = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/i;

function findLeftoverEnglish(plain) {
  const hits = [];
  for (const seg of plain.split(/[\n.;·|]+/)) {
    const s = seg.trim();
    if (!s || CJK.test(s) || PINYIN.test(s)) continue;
    const words = s.split(/[^A-Za-z']+/).filter(Boolean);
    for (const w of words) {
      const lw = w.toLowerCase();
      if (ID_WHITELIST.has(lw)) continue;
      if (ENGLISH_WORDS.has(lw)) hits.push(w);
    }
  }
  return hits;
}

const decks = db.exec('SELECT id, name FROM learning_decks')[0]?.values ?? [];
const hskDecks = new Set(decks.filter(([, n]) => String(n).toUpperCase().includes('HSK')).map(([id]) => id));

const cards = db.exec('SELECT id, deck_id, front_content, back_content FROM flashcard_cards')[0]?.values ?? [];
let flagged = 0, scanned = 0;
const perDeck = new Map();

for (const [id, deckId, front, back] of cards) {
  if (onlyHsk && !hskDecks.has(deckId)) continue;
  scanned++;
  const hits = [...findLeftoverEnglish(stripHtml(front)), ...findLeftoverEnglish(stripHtml(back))];
  if (hits.length > 0) {
    flagged++;
    perDeck.set(deckId, (perDeck.get(deckId) || 0) + 1);
    if (flagged <= 20) {
      const deckName = (decks.find(([d]) => d === deckId) || [deckId, deckId])[1];
      console.log(`⚠  [${deckName}] ${id} → ${hits.join(', ')}`);
    }
  }
}

console.log('----------------------------------------');
console.log(`Scanned: ${scanned} cards | Flagged: ${flagged}`);
for (const [deckId, n] of perDeck) {
  const deckName = (decks.find(([d]) => d === deckId) || [deckId, deckId])[1];
  console.log(`  ${deckName}: ${n} kartu masih bercampur`);
}
if (flagged === 0) console.log('✅ Semua kartu bersih — tidak ada sisa Inggris terdeteksi.');

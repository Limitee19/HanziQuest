#!/usr/bin/env node
/**
 * buildHanziAssets.mjs — Siapkan aset Mandarin offline untuk OmniLife.
 *
 * 1) DATA GORESAN RESMI
 *    Sumber: paket npm "hanzi-writer-data" (via CDN jsDelivr) yang datanya
 *    berasal dari proyek Makemeahanzi (https://github.com/skishore/makemeahanzi),
 *    lisensi Arphic Public License (font data bebas didistribusikan).
 *    Setiap karakter: { strokes: string[] (path SVG outline 1024px),
 *                       medians: number[][] (jalur tengah tiap goresan) }.
 *
 * 2) AUDIO MP3 MANDARIN
 *    Sumber: endpoint TTS Google (translate_tts, voice zh-CN) per teks.
 *    Audio diputar lewat <Audio> bawaan WebView sehingga TIDAK bergantung
 *    voice Mandarin pada speechSynthesis perangkat.
 *
 * Output (public/hanzi/):
 *    - hanzi/chunk_<n>.json   → karakter goresan (bucket)
 *    - audio/chunk_<n>.json   → data URL audio mp3 (bucket)
 *    - assets_manifest.json   → indeks: char → bucket, teks → bucket
 *
 * Jalankan: node scripts/buildHanziAssets.mjs [--limit N]
 * Semua file sudah di-commit, jadi build ini hanya perlu diulang jika
 * dataset HSK berubah.
 */
import { build } from 'esbuild';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/** Karakter tambahan dari filler matriks yang perlu data goresan */
const strokeExtraChars = new Set();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'hanzi');
const CHUNK_HANZI = 300; // karakter per bucket goresan
const CHUNK_AUDIO = 40; // teks per bucket audio (data URL besar)

const args = process.argv.slice(2);
const limitIdx = args.indexOf('--limit');
const LIMIT = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) : 0;

// ── 1. Baca dataset HSK dari TypeScript (di-bundle via esbuild) ────────────
async function loadDataset() {
  const result = await build({
    entryPoints: [path.join(__dirname, 'hanziAssetsEntry.ts')],
    bundle: true,
    write: false,
    format: 'cjs',
    platform: 'node',
    external: [],
  });
  const mod = { exports: {} };
  new Function('module', 'exports', result.outputFiles[0].text)(mod, mod.exports);
  return mod.exports.default;
}

// ── Util fetch dengan retry ringan ──────────────────────────────────────────
async function fetchRetry(url, opts = {}, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { ...opts, signal: AbortSignal.timeout(20000) });
      if (res.ok) return res;
      if (res.status === 404) throw new Error('NOT_FOUND');
      throw new Error(`HTTP ${res.status}`);
    } catch (e) {
      if (e.message === 'NOT_FOUND') throw e;
      if (i === tries - 1) throw e;
      await new Promise((r) => setTimeout(r, 600 * (i + 1)));
    }
  }
}

/**
 * Pengisi sel matriks nada — dipilih dari kamus Makemeahanzi (MIT/Arphic).
 * Sel kosong diisi SATU karakter yang pinyin-nya (suku kata + nada) pas.
 */
async function buildPinyinFillers(dataset, chars) {
  // 1) Sel yang sudah terisi dari dataset (hanzi tunggal saja, seperti aturan matriks)
  const filled = new Set();
  const perSyllable = new Map(); // base → Set<nada>
  for (const w0 of dataset) {
    if (!w0?.hanzi || !w0?.pinyin) continue;
    const hanziChars = Array.from(w0.hanzi).filter((c) => /\p{Script=Han}/u.test(c));
    if (hanziChars.length !== 1) continue; // matriks hanya terima hanzi tunggal
    const syl = (w0.pinyin || '').trim().split(/[\s,·\/\-]+/)[0] || '';
    const base = syl.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z]/g, '').toLowerCase();
    const tone = toneOf(syl);
    if (!base || tone === 5) continue;
    filled.add(base + tone);
    if (!perSyllable.has(base)) perSyllable.set(base, new Set());
    perSyllable.get(base).add(tone);
  }

  // 2) Muat kamus lengkap Makemeahanzi (pinyin per karakter)
  let dict = [];
  try {
    const res = await fetchRetry('https://cdn.jsdelivr.net/gh/skishore/makemeahanzi@master/dictionary.txt');
    dict = (await res.text())
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        try { return JSON.parse(l); } catch { return null; }
      })
      .filter(Boolean);
  } catch (e) {
    console.warn('Kamus Makemeahanzi gagal dimuat — filler dilewati: ' + e.message);
    return [];
  }

  // 3) Sel-sel yang valid secara linguistik per suku kata (dari dataset runtime)
  const { MANDARIN_VALID_TONES } = await import('./tone-fillers-shared.mjs');
  const ALL = [1, 2, 3, 4];
  const validTonesFor = (base) => {
    const listed = MANDARIN_VALID_TONES[base];
    if (!listed) return ALL;
    return ALL.filter((t) => listed.includes(t));
  };

  // 4) Kandidat karakter per (base, tone) — prioritaskan frekuensi tinggi
  const toStr = (v) => (Array.isArray(v) ? v.join(',') : typeof v === 'string' ? v : '');
  const byKey = new Map();
  for (const e of dict) {
    const ch = e.character;
    if (!ch || chars.has(ch)) continue; // sudah ada di dataset — bukan filler
    const firstSyl = toStr(e.pinyin).trim().split(/[\s,·\/\-]+/)[0] || '';
    const base = firstSyl.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z]/g, '').toLowerCase();
    const tone = toneOf(firstSyl);
    if (!base || tone === 5) continue;
    const key = base + tone;
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push({ ch, base, pinyin: firstSyl, freq: e.frequency || 99999, gloss: (toStr(e.definition) || '').split(',')[0].trim() });
  }

  // 5) Tentukan sel kosong: gabungan suku kata dari dataset + kamus (yang ada di matriks nanti)
  //    Matriks runtime memakai sel dari dataset user + FULL dataset — jadi kandidat sel =
  //    semua (base,tone) yang VALID dan punya kandidat karakter di kamus.
  const fillers = [];
  const seenBase = new Set(perSyllable.keys());
  for (const e of dict) {
    const firstSyl = toStr(e.pinyin).trim().split(/[\s,·\/\-]+/)[0] || '';
    const base = firstSyl.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z]/g, '').toLowerCase();
    if (base && !seenBase.has(base)) seenBase.add(base);
  }
  for (const base of seenBase) {
    for (const tone of validTonesFor(base)) {
      const key = base + tone;
      if (filled.has(key)) continue; // sel sudah terisi
      const cands = (byKey.get(key) || []).sort((a, b) => a.freq - b.freq);
      const pick = cands[0];
      if (!pick) continue;
      fillers.push({
        id: 'pf_' + base + tone,
        hanzi: pick.ch,
        pinyin: pick.pinyin,
        basePinyin: base,
        tone,
        meaning: pick.gloss || '',
        frequency: pick.freq,
      });
    }
  }
  fillers.sort((a, b) => a.basePinyin.localeCompare(b.basePinyin) || a.tone - b.tone);
  console.log('Pengisi sel matriks nada: ' + fillers.length + ' sel kosong diisi karakter resmi.');
  return fillers;
}

/**
 * Muat kosakata HSK 4–6 dari complete-hsk-vocabulary (MIT, via jsDelivr).
 * Mengembalikan ChineseWord ringkas yang digabung ke dataset utama.
 * Sudah ada di dataset (hanzi sama) → lewati agar tidak duplikat.
 */
async function loadHsk456(existing) {
  const seen = new Set(existing.map((w) => w.hanzi));
  const out = [];
  for (const level of [4, 5, 6]) {
    try {
      const res = await fetchRetry('https://cdn.jsdelivr.net/gh/drkameleon/complete-hsk-vocabulary@main/wordlists/inclusive/old/' + level + '.json');
      const words = await res.json();
      let added = 0;
      for (const w of words) {
        const hanzi = (w.simplified || '').trim();
        const pinyin = w?.forms?.[0]?.transcriptions?.pinyin || '';
        const meanings = w?.forms?.[0]?.meanings || [];
        if (!hanzi || !pinyin || seen.has(hanzi)) continue;
        seen.add(hanzi);
        out.push({
          id: 'hsk' + level + '_' + added.toString().padStart(3, '0'),
          hanzi,
          pinyin,
          pinyinNormalized: pinyin.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z]/g, '').toLowerCase(),
          tone: toneOf(pinyin),
          meanings: meanings.slice(0, 2).map((m) => String(m).split(';')[0].trim()).filter(Boolean),
          hskLevel: level,
          pos: (w.pos || [])[0],
        });
        added++;
      }
      console.log('HSK ' + level + ': ' + added + ' kata baru.');
    } catch (e) {
      console.warn('HSK ' + level + ' gagal dimuat: ' + e.message);
    }
  }
  return out;
}

/** Nada dari pinyin bertanda (ā→1, á→2, ǎ→3, à→4, tanpa tanda→5). */
function toneOf(pinyin) {
  if (/[\u0101\u0113\u012b\u014d\u016b\u01d6]/.test(pinyin)) return 1;
  if (/[\u00e1\u00e9\u00ed\u00f3\u00fa\u01d8]/.test(pinyin)) return 2;
  if (/[\u01ce\u011b\u01d0\u01d2\u01d4\u01da]/.test(pinyin)) return 3;
  if (/[\u00e0\u00e8\u00ec\u00f2\u00f9\u01dc]/.test(pinyin)) return 4;
  return 5;
}

// ── 2. Unduh data goresan ───────────────────────────────────────────────────
/** Worker pool sederhana: jalankan `worker(i)` untuk tiap indeks dengan batas konkurensi. */
async function runPool(n, worker, concurrency = 6) {
  let next = 0;
  let done = 0;
  const lanes = Array.from({ length: concurrency }, async () => {
    while (true) {
      const i = next++;
      if (i >= n) return;
      await worker(i);
      done++;
      if (done % 100 === 0 || done === n) worker.progress?.(done, n);
    }
  });
  await Promise.all(lanes);
}

async function downloadStrokes(chars) {
  const out = {};
  let ok = 0, miss = 0, fail = 0;
  console.log(`Mengunduh data goresan resmi untuk ${chars.length} karakter…`);
  const report = (done, n) => console.log(`  goresan ${done}/${n} (ok=${ok} miss=${miss} fail=${fail})`);
  await runPool(
    chars.length,
    async (i) => {
      const ch = chars[i];
      try {
        const res = await fetchRetry(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/${encodeURIComponent(ch)}.json`);
        const data = await res.json();
        if (Array.isArray(data.strokes) && data.strokes.length > 0 && Array.isArray(data.medians)) {
          out[ch] = { strokes: data.strokes, medians: data.medians };
          ok++;
        } else miss++;
      } catch (e) {
        if (e.message === 'NOT_FOUND') { miss++; }
        else { fail++; if (fail <= 3) console.warn(`  gagal ${ch}: ${e.message}`); }
      }
    },
    8
  );
  report(chars.length, chars.length);
  console.log(`Goresan selesai: ok=${ok} miss=${miss} fail=${fail}`);
  return out;
}

// ── 3. Unduh audio TTS ──────────────────────────────────────────────────────
async function downloadAudio(texts) {
  const out = {};
  let ok = 0, fail = 0;
  const list = [...texts];
  console.log(`Mengunduh audio Mandarin untuk ${list.length} teks…`);
  const report = (done, n) => console.log(`  audio ${done}/${n} (ok=${ok} fail=${fail})`);
  await runPool(
    list.length,
    async (i) => {
      const text = list[i];
      try {
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=zh-CN&q=${encodeURIComponent(text)}`;
        const res = await fetchRetry(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length > 500) { // tolak respons error yang kecil
          out[text] = `data:audio/mpeg;base64,${buf.toString('base64')}`;
          ok++;
        } else fail++;
      } catch (e) {
        fail++;
        if (fail <= 5) console.warn(`  gagal audio "${text}": ${e.message}`);
      }
      await new Promise((r) => setTimeout(r, 60)); // sopan pada server
    },
    4
  );
  report(list.length, list.length);
  console.log(`Audio selesai: ok=${ok} fail=${fail}`);
  return out;
}

// ── 4. Tulis bucket + manifest ──────────────────────────────────────────────
function writeChunks(prefix, obj, chunkSize) {
  const keys = Object.keys(obj);
  const map = {};
  for (let i = 0; i < keys.length; i += chunkSize) {
    const name = `${prefix}chunk_${Math.floor(i / chunkSize)}.json`;
    const slice = {};
    for (const k of keys.slice(i, i + chunkSize)) slice[k] = obj[k];
    writeFileSync(path.join(OUT_DIR, name), JSON.stringify(slice));
    for (const k of keys.slice(i, i + chunkSize)) map[k] = name;
  }
  return map;
}

// ── main ────────────────────────────────────────────────────────────────────
const dataset = await loadDataset();
if (LIMIT > 0) dataset.length = Math.min(dataset.length, LIMIT);

const chars = new Set();
const texts = new Set();
for (const w of dataset) {
  if (!w?.hanzi) continue;
  for (const ch of w.hanzi) if (/\p{Script=Han}/u.test(ch)) chars.add(ch);
  if (w.hanzi) texts.add(w.hanzi);
  if (w.pinyin) texts.add(w.pinyin);
  for (const ex of w.exampleSentences || []) {
    if (ex.hanzi) texts.add(ex.hanzi);
    if (ex.pinyin) texts.add(ex.pinyin);
  }
}
// Karakter tone-filler (perwakilan sel nada) ikut punya audio
for (const ch of [...chars]) texts.add(ch);

// ── HSK 4–6 (tanpa kalimat): dari complete-hsk-vocabulary (MIT) ──
const hsk456 = await loadHsk456(dataset);
for (const word of hsk456) {
  dataset.push(word);
  for (const ch of word.hanzi) if (/\p{Script=Han}/u.test(ch)) chars.add(ch);
  texts.add(word.hanzi);
  if (word.pinyin) texts.add(word.pinyin);
}

// ── Pengisi sel Matriks 4 Nada untuk suku kata khas HSK 4–6 ──
// Sel = (suku kata tanpa nada × nada). Setelah HSK 1–6 masuk dataset,
// beberapa sel (mis. xiū1, wǔ2, diān3) masih kosong karena tidak ada kata
// hanzi-tunggal. Kita pilih SATU karakter resmi per sel kosong dari kamus
// Makemeahanzi (data goresan yang sama), lalu simpan sebagai aset terpisah
// `pinyin_fillers.json` — dipakai matriks saat runtime.
const pinyinFillers = await buildPinyinFillers(dataset, chars);
for (const f of pinyinFillers) {
  if (!chars.has(f.hanzi)) {
    chars.add(f.hanzi);
    strokeExtraChars.add(f.hanzi);
  }
  texts.add(f.hanzi);
  texts.add(f.pinyin);
}

console.log(`Dataset: ${dataset.length} kata, ${chars.size} karakter unik, ${texts.size} teks audio.`);

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(path.join(OUT_DIR, 'audio'), { recursive: true });

const charList = [...chars].sort();
const strokeData = await downloadStrokes(LIMIT > 0 ? charList.slice(0, LIMIT) : charList);
const audioData = await downloadAudio([...texts].slice(0, LIMIT > 0 ? LIMIT * 4 : Infinity));

const hanziMap = writeChunks('hanzi_', strokeData, CHUNK_HANZI);
const audioMap = writeChunks('audio/', audioData, CHUNK_AUDIO);

// Asistensi matriks nada: daftar sel kosong yang kini terwakili
writeFileSync(
  path.join(OUT_DIR, 'pinyin_fillers.json'),
  JSON.stringify({ version: 1, fillers: pinyinFillers })
);

const manifest = {
  version: 1,
  generatedAt: new Date().toISOString(),
  hanzi: hanziMap,
  audio: audioMap,
};
writeFileSync(path.join(OUT_DIR, 'assets_manifest.json'), JSON.stringify(manifest));

const audioSize = Object.values(audioData).join('').length / 1024 / 1024;
const strokeCount = Object.values(strokeData).reduce((s, v) => s + v.strokes.length, 0);
console.log(`Selesai: ${Object.keys(strokeData).length} karakter (${strokeCount} goresan resmi), ${Object.keys(audioData).length} audio (~${audioSize.toFixed(1)} MB).`);
console.log(`Manifest: ${Object.keys(hanziMap).length} entri goresan, ${Object.keys(audioMap).length} entri audio.`);

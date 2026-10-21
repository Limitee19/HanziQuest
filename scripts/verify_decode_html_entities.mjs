/**
 * Sanity-check decodeHtmlEntities:
 * 1. Ekstrak fungsi dari src/services/chinese/flashcardService.ts (TypeScript)
 * 2. Strip anotasi TS ringan, eval, dan uji output yang diharapkan.
 * Jalankan: node scripts/verify_decode_html_entities.mjs
 */
import { readFileSync } from 'node:fs';

const src = readFileSync('src/services/chinese/flashcardService.ts', 'utf8');
const m = src.match(/export function decodeHtmlEntities[\s\S]*?\n}/);
if (!m) {
  console.error('FUNC NOT FOUND');
  process.exit(1);
}
// Strip tipe: (text: string) -> (text), (ent, body: string) -> (ent, body), Record<..> -> any
let fn = m[0]
  .replace('export function decodeHtmlEntities', 'function decodeHtmlEntities')
  .replace(/\(text: string\)/, '(text)')
  .replace(/\(ent, body: string\)/, '(ent, body)')
  .replace(/: string\s*=\s*/, ' = ')
  .replace(/Record<string, string>/g, 'Object')
  .replace(/const table: Object =/, 'const table =')
  .replace(/\): string\s*\{/, ') {')
  .replace(/\s+as string\b/, '');
const decodeHtmlEntities = new Function(`${fn}; return decodeHtmlEntities;`)();

let failed = 0;
const expect = (input, output) => {
  const got = decodeHtmlEntities(input);
  const ok = got === output;
  if (!ok) failed++;
  console.log(`${ok ? 'OK  ' : 'FAIL'}  ${JSON.stringify(input)} -> ${JSON.stringify(got)}`);
};

expect('&#x89C9;&#x5F97;', '觉得');            // hex numeric entities
expect('&#35273;', '觉');                      // decimal numeric entity (U+89C9)
expect('div&amp;tag&lt;end&gt;', 'div&tag<end>'); // named
expect('&hellip;', '…');                       // named ellipsis
expect('&unknownxyz;', '&unknownxyz;');        // unknown named -> noop
expect('sudah&baik', 'sudah&baik');           // tanpa entity tidak berubah
expect('', '');

if (failed > 0) {
  console.error(`${failed} check gagal`);
  process.exit(1);
}
console.log('Semua check lulus ✅');

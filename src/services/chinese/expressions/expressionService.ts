// ====================================================================
// OmniLife Chinese Arena — service ungkapan sehari-hari.
//
// Lokal-first: ungkapan bawaan dari dailyExpressions.ts, koleksi hasil
// SmartTranslate disimpan di localStorage. Terjemahan bebas memakai
// provider AI yang sudah aktif (Groq/Gemini) TANPA tool-calling —
// pola yang sama dengan studyMaterialService.
// ====================================================================
import {
  DAILY_EXPRESSIONS,
  DailyExpression,
  ExpressionCategory,
  ExpressionRegister,
} from './dailyExpressions';
import { fetchAISettings, getActiveProvider } from '@/services/ai/aiService';
import { AIMessage } from '@/services/ai/aiTypes';

const CUSTOM_KEY = 'omnilife_expressions_custom_v1';
const STATUS_KEY = 'omnilife_expressions_status_v1';

// ── Koleksi (bawaan + kustom) ───────────────────────────────────────────

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Gagal membaca data "${key}":`, err);
    return fallback;
  }
}

function writeJson(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`Gagal menyimpan data "${key}":`, err);
    return false;
  }
}

export function getCustomExpressions(): DailyExpression[] {
  return readJson<DailyExpression[]>(CUSTOM_KEY, []);
}

export function getAllExpressions(): DailyExpression[] {
  return [...DAILY_EXPRESSIONS, ...getCustomExpressions()];
}

export function getExpressionById(id: string): DailyExpression | undefined {
  return getAllExpressions().find((e) => e.id === id);
}

export function getCategoriesWithData(): ExpressionCategory[] {
  const all = getAllExpressions();
  const counts = new Map<ExpressionCategory, number>();
  for (const e of all) counts.set(e.category, (counts.get(e.category) || 0) + 1);
  return [...counts.keys()];
}

export interface SaveExpressionInput {
  indo: string;
  hanzi: string;
  pinyin: string;
  register?: ExpressionRegister;
  category?: ExpressionCategory;
  note?: string;
  literal?: string;
}

/** Simpan ungkapan ke "Koleksi Saya". Mengembalikan entri tersimpan. */
export function saveCustomExpression(input: SaveExpressionInput): DailyExpression {
  if (!input.indo.trim() || !input.hanzi.trim()) {
    throw new Error('Frasa Indonesia dan Mandarin wajib diisi.');
  }
  const entry: DailyExpression = {
    id: `cexp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    indo: input.indo.trim(),
    hanzi: input.hanzi.trim(),
    pinyin: (input.pinyin || '').trim(),
    literal: input.literal?.trim() || undefined,
    register: input.register || 'netral',
    category: input.category || 'Koleksi Saya',
    note: input.note?.trim() || undefined,
  };
  const list = getCustomExpressions();
  // Idempoten per frasa yang sama persis (huruf besar/kecil diabaikan).
  const dup = list.findIndex(
    (e) => e.hanzi.toLowerCase() === entry.hanzi.toLowerCase() &&
           e.indo.toLowerCase() === entry.indo.toLowerCase()
  );
  if (dup >= 0) list[dup] = entry;
  else list.push(entry);
  if (!writeJson(CUSTOM_KEY, list)) {
    throw new Error('Gagal menyimpan ke penyimpanan lokal.');
  }
  return entry;
}

export function deleteCustomExpression(id: string): void {
  const list = getCustomExpressions().filter((e) => e.id !== id);
  writeJson(CUSTOM_KEY, list);
  const statuses = readJson<Record<string, ExpressionStatus>>(STATUS_KEY, {});
  if (statuses[id]) {
    delete statuses[id];
    writeJson(STATUS_KEY, statuses);
  }
}

// ── Status hafalan ──────────────────────────────────────────────────────

export type ExpressionStatus = 'known' | 'review';

export function getExpressionStatuses(): Record<string, ExpressionStatus> {
  return readJson<Record<string, ExpressionStatus>>(STATUS_KEY, {});
}

export function markExpression(id: string, status: ExpressionStatus | null): void {
  const statuses = getExpressionStatuses();
  if (status === null) delete statuses[id];
  else statuses[id] = status;
  writeJson(STATUS_KEY, statuses);
}

export function getExpressionProgress(): { known: number; review: number; total: number } {
  const all = getAllExpressions();
  const statuses = getExpressionStatuses();
  let known = 0;
  let review = 0;
  for (const e of all) {
    if (statuses[e.id] === 'known') known++;
    else if (statuses[e.id] === 'review') review++;
  }
  return { known, review, total: all.length };
}

// ── SmartTranslate (AI) ─────────────────────────────────────────────────

export interface TranslationVariant {
  hanzi: string;
  pinyin: string;
  register: string;
  when: string;
}

export interface SmartTranslation {
  indo: string;
  hanzi: string;
  pinyin: string;
  literal?: string;
  register: ExpressionRegister;
  variants: TranslationVariant[];
  note?: string;
}

function extractJsonObject(text: string): any | null {
  let t = text.trim();
  // Buang code fence ```json ... ``` bila ada.
  t = t.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(t.slice(start, end + 1));
  } catch {
    return null;
  }
}

function normalizeRegister(raw: unknown): ExpressionRegister {
  const s = String(raw ?? '').toLowerCase();
  if (s.includes('gaul') || s.includes('slang') || s.includes('casual')) return 'gaul';
  if (s.includes('formal')) return 'formal';
  return 'netral';
}

function normalizeVariants(raw: unknown): TranslationVariant[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((v) => v && typeof v === 'object' && typeof v.hanzi === 'string' && v.hanzi.trim())
    .slice(0, 4)
    .map((v) => ({
      hanzi: String(v.hanzi).trim(),
      pinyin: String(v.pinyin ?? '').trim(),
      register: String(v.register ?? 'netral'),
      when: String(v.when ?? '').trim(),
    }));
}

/**
 * Terjemahkan frasa Indonesia bebas → Mandarin natural + variasi.
 * Melempar Error dengan pesan ramah bila AI tidak tersedia.
 */
export async function translateExpression(input: string): Promise<SmartTranslation> {
  const phrase = input.trim();
  if (!phrase) throw new Error('Ketik dulu frasa yang mau diterjemahkan.');
  if (phrase.length > 200) throw new Error('Frasa terlalu panjang (maksimal 200 karakter).');

  const settings = await fetchAISettings();
  if (settings.activeProvider === 'groq' && !settings.groqApiKey) {
    throw new Error(
      'API Key Groq belum diatur. Buka AI Assistant → Config, atau pakai API key Gemini.'
    );
  }
  if (settings.activeProvider === 'gemini' && !settings.geminiApiKey) {
    throw new Error(
      'API Key Gemini belum diatur. Buka AI Assistant → Config untuk memasukkannya.'
    );
  }
  if (settings.activeProvider === 'local') {
    throw new Error('SmartTranslate butuh model online (Groq/Gemini), bukan model lokal.');
  }

  const systemMsg: AIMessage = {
    id: 'sys_smarttranslate',
    role: 'system',
    content: [
      'Kamu adalah penerjemah percakapan Indonesia → Mandarin (Putonghua) untuk aplikasi belajar bahasa.',
      'Terjemahkan frasa seperti orang Tiongkok sungguhan berbicara (bukan terjemahan kaku kata-per-kata).',
      'Balas HANYA satu objek JSON valid tanpa penjelasan lain, bentuknya:',
      '{"indo": string, "hanzi": string, "pinyin": string (dengan tanda nada), "literal": string (arti harfiah), "register": "gaul"|"netral"|"formal", "note": string (kapan/di mana frasa ini dipakai), "variants": [{"hanzi": string, "pinyin": string, "register": string, "when": string}]}',
      'variants berisi 2-3 cara ucap lain (satu gaul, satu formal) jika relevan; boleh array kosong.',
      'Gunakan tanda baca Tionghoa (，！？。) pada hanzi.',
    ].join('\n'),
    timestamp: new Date().toISOString(),
  };

  const userMsg: AIMessage = {
    id: `usr_smarttranslate_${Date.now()}`,
    role: 'user',
    content: `Frasa Indonesia: "${phrase}"`,
    timestamp: new Date().toISOString(),
  };

  let responseText = '';
  try {
    const provider = getActiveProvider(settings);
    const response = await provider.sendMessage({
      messages: [systemMsg, userMsg],
      temperature: 0.4,
    });
    responseText = response.message.content || '';
  } catch (err: any) {
    const raw = String(err?.message || '');
    if (raw.includes('401') || raw.includes('unauthorized')) {
      throw new Error('API key tidak valid. Periksa di AI Assistant → Config.');
    }
    if (raw.includes('429') || raw.includes('rate_limit')) {
      throw new Error('Kuota AI sedang penuh. Tunggu satu menit lalu coba lagi.');
    }
    throw new Error(raw || 'Gagal menghubungi AI.');
  }

  const parsed = extractJsonObject(responseText);
  if (!parsed || typeof parsed.hanzi !== 'string' || !parsed.hanzi.trim()) {
    console.warn('SmartTranslate: respons AI tidak bisa diparse:', responseText.slice(0, 400));
    throw new Error(
      'AI tidak mengembalikan format yang diharapkan. Coba ulangi atau ganti frasa lebih sederhana.'
    );
  }

  return {
    indo: typeof parsed.indo === 'string' && parsed.indo.trim() ? parsed.indo.trim() : phrase,
    hanzi: parsed.hanzi.trim(),
    pinyin: typeof parsed.pinyin === 'string' ? parsed.pinyin.trim() : '',
    literal: typeof parsed.literal === 'string' && parsed.literal.trim() ? parsed.literal.trim() : undefined,
    register: normalizeRegister(parsed.register),
    variants: normalizeVariants(parsed.variants),
    note: typeof parsed.note === 'string' && parsed.note.trim() ? parsed.note.trim() : undefined,
  };
}

/** Simpan hasil SmartTranslate ke "Koleksi Saya" agar masuk mode latihan. */
export function saveSmartTranslation(result: SmartTranslation): DailyExpression {
  return saveCustomExpression({
    indo: result.indo,
    hanzi: result.hanzi,
    pinyin: result.pinyin,
    literal: result.literal,
    register: result.register,
    note: result.note,
  });
}

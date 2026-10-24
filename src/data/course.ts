import raw from './course.json';
import type { Course, CourseWord, Group } from './course.types';
import { getAccurateIndonesianMeaning } from '@/services/chinese/dictionaryService';

const data = raw as unknown as {
  meta: Course['meta'];
  counts: Record<string, number>;
  words: CourseWord[];
};

const ALL_WORDS = data.words;
// Pastikan setiap kata memiliki arti Bahasa Indonesia yang akurat dan tepat
for (let i = 0; i < ALL_WORDS.length; i++) {
  const w = ALL_WORDS[i];
  w.meanId = getAccurateIndonesianMeaning(w.hanzi, w.meanId, w.meanEn);
}
/** Jumlah kata per lesson/group. Bite-sized ala benchmark (5-7 kata). */
const WORDS_PER_GROUP = 5;
/** Level yang dimuat di MVP: 1-6. 7-9 bisa diaktifkan belakangan. */
export const MVP_LEVELS = ['1', '2', '3', '4', '5', '6'] as const;

const wordMap = new Map<string, CourseWord>(ALL_WORDS.map((w) => [w.id, w]));

/** urutan kata per level: freq asc → id numeric, biar kata umum dulu */
const byLevel = new Map<string, CourseWord[]>();
for (const lv of MVP_LEVELS) {
  const list = ALL_WORDS.filter((w) => w.level === lv);
  list.sort((a, b) => a.freq - b.freq || a.id.localeCompare(b.id, 'en', { numeric: true }));
  byLevel.set(lv, list);
}

const groups: Group[] = [];
for (const lv of MVP_LEVELS) {
  const list = byLevel.get(lv) ?? [];
  for (let i = 0; i < list.length; i += WORDS_PER_GROUP) {
    groups.push({
      id: `g${lv}-${String(Math.floor(i / WORDS_PER_GROUP) + 1).padStart(4, '0')}`,
      level: lv,
      idx: i / WORDS_PER_GROUP,
      title: `${lv} · ${Math.floor(i / WORDS_PER_GROUP) + 1}`,
      wordIds: list.slice(i, i + WORDS_PER_GROUP).map((w) => w.id),
    });
  }
}

const groupsByLevel = new Map<string, Group[]>();
for (const g of groups) {
  const arr = groupsByLevel.get(g.level) ?? [];
  arr.push(g);
  groupsByLevel.set(g.level, arr);
}

export const course: Course = {
  meta: data.meta,
  counts: data.counts,
  words: ALL_WORDS,
  groups,
};

export function word(id: string): CourseWord | undefined {
  return wordMap.get(id);
}

export function levels(): { level: string; groups: Group[]; words: number }[] {
  return MVP_LEVELS.map((lv) => ({
    level: lv,
    groups: groupsByLevel.get(lv) ?? [],
    words: (byLevel.get(lv) ?? []).length,
  }));
}

export function groupById(id: string): Group | undefined {
  return groups.find((g) => g.id === id);
}

export function wordsOfGroup(g: Group): CourseWord[] {
  return g.wordIds.map((id) => wordMap.get(id)).filter((w): w is CourseWord => !!w);
}

/** Semua kata yang sifatnya vocab aktif di peta (L1-L6) */
export function activeWords(): CourseWord[] {
  return MVP_LEVELS.flatMap((lv) => byLevel.get(lv) ?? []);
}

/** alias untuk digunakan oleh quiz pool */
export const allWordsOfLevels = activeWords;

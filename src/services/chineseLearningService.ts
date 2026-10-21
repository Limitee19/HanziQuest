import { executeSql, selectSql } from '@/db/client';
import { ChineseWord, STARTER_CHINESE_DATASET } from './chinese/chineseDataset';
import { ReviewState, ReviewItemType, calculateNextReview } from './chinese/reviewScheduler';
import { recordStudyActivity } from './study/streakService';

export type { ChineseWord, ReviewState, ReviewItemType };

export interface UserLearningRecord {
  id: string;
  wordId: string;
  timesSeen: number;
  correctCount: number;
  wrongCount: number;
  mastery: number; // 0.0 to 1.0
  lastReviewedAt?: string;
  nextReviewAt?: string;
  updatedAt: string;
}

export interface ChineseVocabulary {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  exampleSentence?: string;
  examplePinyin?: string;
  exampleMeaning?: string;
  hskLevel?: number;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface HanziCharacter {
  id: string;
  character: string;
  pinyin: string;
  meaning: string;
  strokeCount?: number;
  radical?: string;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export type ChineseNoteCategory = 
  | 'Vocabulary' 
  | 'Grammar' 
  | 'Hanzi' 
  | 'Listening' 
  | 'Reading' 
  | 'Speaking' 
  | 'Culture' 
  | 'Class Notes' 
  | 'Other';

export interface ChineseNote {
  id: string;
  title: string;
  content: string;
  category: ChineseNoteCategory;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LearningProgress {
  vocabularyCount: number;
  hanziCount: number;
  studyMinutes: number;
  completedSessions: number;
  currentStreak: number;
  lastStudyDate?: string;
}

export interface StudySession {
  id: string;
  startedAt: string;
  endedAt?: string;
  durationMinutes: number;
  activityType: 'Vocabulary' | 'Hanzi' | 'Flashcards' | 'Listening' | 'Reading' | 'Speaking' | 'Grammar' | 'General';
  notes?: string;
}

// In-memory fallback stores
let memoryVocabs: ChineseVocabulary[] = [];
let memoryHanzi: HanziCharacter[] = [];
let memoryNotes: ChineseNote[] = [];
let memorySessions: StudySession[] = [];

// --- 1. VOCABULARY persistence ---
export async function fetchVocabularies(): Promise<ChineseVocabulary[]> {
  try {
    const rows = await selectSql<any>(`SELECT * FROM chinese_vocabularies ORDER BY created_at DESC;`);
    if (rows && rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        hanzi: r.hanzi,
        pinyin: r.pinyin,
        meaning: r.meaning,
        exampleSentence: r.example_sentence || '',
        examplePinyin: r.example_pinyin || '',
        exampleMeaning: r.example_meaning || '',
        hskLevel: r.hsk_level ? Number(r.hsk_level) : 1,
        notes: r.notes || '',
        tags: r.tags ? String(r.tags).split(',') : [],
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }));
    }
  } catch (_) {}
  return memoryVocabs;
}

export async function createVocabulary(
  data: Omit<ChineseVocabulary, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ChineseVocabulary> {
  const id = `cl_vocab_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  const vocab: ChineseVocabulary = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await executeSql(
      `INSERT INTO chinese_vocabularies (id, hanzi, pinyin, meaning, example_sentence, example_pinyin, example_meaning, hsk_level, notes, tags, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        id,
        vocab.hanzi,
        vocab.pinyin,
        vocab.meaning,
        vocab.exampleSentence || '',
        vocab.examplePinyin || '',
        vocab.exampleMeaning || '',
        vocab.hskLevel || 1,
        vocab.notes || '',
        vocab.tags ? vocab.tags.join(',') : '',
        now,
        now,
      ]
    );
  } catch (_) {
    memoryVocabs.unshift(vocab);
  }

  return vocab;
}

// --- 2. HANZI CHARACTER persistence ---
export async function fetchHanziCharacters(): Promise<HanziCharacter[]> {
  try {
    const rows = await selectSql<any>(`SELECT * FROM chinese_hanzi ORDER BY created_at DESC;`);
    if (rows && rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        character: r.character,
        pinyin: r.pinyin,
        meaning: r.meaning,
        strokeCount: r.stroke_count ? Number(r.stroke_count) : undefined,
        radical: r.radical || '',
        notes: r.notes || '',
        tags: r.tags ? String(r.tags).split(',') : [],
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }));
    }
  } catch (_) {}
  return memoryHanzi;
}

export async function createHanziCharacter(
  data: Omit<HanziCharacter, 'id' | 'createdAt' | 'updatedAt'>
): Promise<HanziCharacter> {
  const id = `cl_hanzi_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  const hanzi: HanziCharacter = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await executeSql(
      `INSERT INTO chinese_hanzi (id, character, pinyin, meaning, stroke_count, radical, notes, tags, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        id,
        hanzi.character,
        hanzi.pinyin,
        hanzi.meaning,
        hanzi.strokeCount || 0,
        hanzi.radical || '',
        hanzi.notes || '',
        hanzi.tags ? hanzi.tags.join(',') : '',
        now,
        now,
      ]
    );
  } catch (_) {
    memoryHanzi.unshift(hanzi);
  }

  return hanzi;
}

// --- 3. CHINESE NOTES persistence ---
export async function fetchChineseNotes(): Promise<ChineseNote[]> {
  try {
    const rows = await selectSql<any>(`SELECT * FROM chinese_notes ORDER BY created_at DESC;`);
    if (rows && rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        content: r.content,
        category: r.category as ChineseNoteCategory,
        tags: r.tags ? String(r.tags).split(',') : [],
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }));
    }
  } catch (_) {}
  return memoryNotes;
}

export async function createChineseNote(
  data: Omit<ChineseNote, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ChineseNote> {
  const id = `cl_note_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  const note: ChineseNote = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await executeSql(
      `INSERT INTO chinese_notes (id, title, content, category, tags, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [id, note.title, note.content, note.category || 'General', note.tags ? note.tags.join(',') : '', now, now]
    );
  } catch (_) {
    memoryNotes.unshift(note);
  }

  return note;
}

// --- 0. SYSTEM DATASET & USER LEARNING RECORD ---
let memoryRecords: Map<string, UserLearningRecord> = new Map();

export async function fetchSystemWords(): Promise<ChineseWord[]> {
  return STARTER_CHINESE_DATASET;
}

export async function fetchUserLearningRecord(wordId: string): Promise<UserLearningRecord> {
  const existing = memoryRecords.get(wordId);
  if (existing) return existing;

  const newRec: UserLearningRecord = {
    id: `rec_${wordId}`,
    wordId,
    timesSeen: 0,
    correctCount: 0,
    wrongCount: 0,
    mastery: 0.0,
    updatedAt: new Date().toISOString(),
  };
  memoryRecords.set(wordId, newRec);
  return newRec;
}

// --- 5. REVIEW STATE & SRS PERSISTENCE ---
let memoryReviewStates: Map<string, ReviewState> = new Map();

export async function fetchReviewState(itemId: string, itemType: ReviewItemType = 'vocabulary'): Promise<ReviewState> {
  const existing = memoryReviewStates.get(itemId);
  if (existing) return existing;

  const newState: ReviewState = {
    itemId,
    itemType,
    status: 'New',
    reviewCount: 0,
    correctCount: 0,
    incorrectCount: 0,
    intervalDays: 1,
    updatedAt: new Date().toISOString(),
  };
  memoryReviewStates.set(itemId, newState);
  return newState;
}

export async function saveReviewState(state: ReviewState): Promise<ReviewState> {
  memoryReviewStates.set(state.itemId, state);
  return state;
}

export async function recordPracticeResult(wordId: string, isCorrect: boolean): Promise<UserLearningRecord> {
  const rec = await fetchUserLearningRecord(wordId);
  rec.timesSeen += 1;
  if (isCorrect) {
    rec.correctCount += 1;
  } else {
    rec.wrongCount += 1;
  }
  rec.mastery = rec.timesSeen > 0 ? Number((rec.correctCount / rec.timesSeen).toFixed(2)) : 0.0;
  rec.lastReviewedAt = new Date().toISOString();
  rec.updatedAt = new Date().toISOString();
  memoryRecords.set(wordId, rec);

  // Hanzi practice counts as real study activity for the daily streak
  try {
    await recordStudyActivity();
  } catch (streakErr) {
    console.warn('Study streak recording failed:', streakErr);
  }

  // Automatically update SRS ReviewState as well
  const currentRevState = await fetchReviewState(wordId, 'vocabulary');
  const updatedRevState = calculateNextReview(currentRevState, isCorrect);
  await saveReviewState(updatedRevState);

  return rec;
}

// --- 4. LEARNING PROGRESS & SUMMARY ---
export async function fetchLearningProgress(): Promise<LearningProgress> {
  const vocabs = await fetchVocabularies();
  const hanzi = await fetchHanziCharacters();
  const systemWords = await fetchSystemWords();

  return {
    vocabularyCount: systemWords.length + vocabs.length,
    hanziCount: hanzi.length + systemWords.length,
    studyMinutes: 0,
    completedSessions: memorySessions.length,
    currentStreak: 0,
    lastStudyDate: vocabs.length > 0 ? vocabs[0].createdAt.substring(0, 10) : undefined,
  };
}

import { ChineseWord } from './chineseDataset';

export type PracticeQuestionType = 
  | 'hanziToPinyin' 
  | 'hanziToMeaning' 
  | 'pinyinToHanzi' 
  | 'meaningToHanzi';

export interface PracticeQuestion {
  id: string;
  wordId: string;
  questionType: PracticeQuestionType;
  promptText: string;
  expectedCanonicalAnswer: string;
  acceptedAnswers: string[];
  targetWord: ChineseWord;
}

export interface PracticeSessionConfig {
  questionCount: number;
  mode: 'mixed' | 'pinyin' | 'meaning' | 'hanzi';
  isToneAware?: boolean;
}

/**
 * Generates a randomized list of PracticeQuestions from an available ChineseWord pool
 */
export function generatePracticeSession(
  availableWords: ChineseWord[],
  config: PracticeSessionConfig
): PracticeQuestion[] {
  if (!availableWords || availableWords.length === 0) return [];

  const count = Math.min(config.questionCount || 10, availableWords.length * 3); // Allow repetition if pool is small
  const questions: PracticeQuestion[] = [];

  // Shuffle pool helper
  const shuffledWords = [...availableWords].sort(() => Math.random() - 0.5);

  for (let i = 0; i < count; i++) {
    const word = shuffledWords[i % shuffledWords.length];

    let qType: PracticeQuestionType;
    if (config.mode === 'pinyin') {
      qType = 'hanziToPinyin';
    } else if (config.mode === 'meaning') {
      qType = 'hanziToMeaning';
    } else if (config.mode === 'hanzi') {
      qType = Math.random() > 0.5 ? 'pinyinToHanzi' : 'meaningToHanzi';
    } else {
      // Mixed mode
      const types: PracticeQuestionType[] = [
        'hanziToPinyin',
        'hanziToMeaning',
        'pinyinToHanzi',
        'meaningToHanzi',
      ];
      qType = types[Math.floor(Math.random() * types.length)];
    }

    let promptText = '';
    let expectedCanonicalAnswer = '';
    let acceptedAnswers: string[] = [];

    switch (qType) {
      case 'hanziToPinyin':
        promptText = word.hanzi;
        expectedCanonicalAnswer = word.pinyin;
        acceptedAnswers = [word.pinyin, word.pinyinNormalized];
        break;
      case 'hanziToMeaning':
        promptText = word.hanzi;
        expectedCanonicalAnswer = word.meanings[0];
        acceptedAnswers = word.meanings;
        break;
      case 'pinyinToHanzi':
        promptText = word.pinyin;
        expectedCanonicalAnswer = word.hanzi;
        acceptedAnswers = [word.hanzi];
        break;
      case 'meaningToHanzi':
        promptText = word.meanings.join(' / ');
        expectedCanonicalAnswer = word.hanzi;
        acceptedAnswers = [word.hanzi];
        break;
    }

    questions.push({
      id: `pq_${Date.now()}_${i}_${word.id}`,
      wordId: word.id,
      questionType: qType,
      promptText,
      expectedCanonicalAnswer,
      acceptedAnswers,
      targetWord: word,
    });
  }

  return questions;
}

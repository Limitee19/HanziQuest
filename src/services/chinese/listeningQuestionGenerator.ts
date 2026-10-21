import { ChineseWord } from './chineseDataset';
import { PracticeQuestion, PracticeQuestionType } from './chineseQuestionGenerator';

export type ListeningQuestionType = 'audioToMeaning' | 'audioToHanzi' | 'audioToPinyin';

/**
 * Generates randomized Listening PracticeQuestions from system vocabulary
 */
export function generateListeningSession(
  availableWords: ChineseWord[],
  questionCount: number = 10
): PracticeQuestion[] {
  if (!availableWords || availableWords.length === 0) return [];

  const count = Math.min(questionCount, availableWords.length * 3);
  const questions: PracticeQuestion[] = [];
  const shuffledWords = [...availableWords].sort(() => Math.random() - 0.5);

  const listeningTypes: PracticeQuestionType[] = [
    'hanziToMeaning', // Used for Audio -> Meaning
    'pinyinToHanzi',  // Used for Audio -> Hanzi
    'hanziToPinyin',  // Used for Audio -> Pinyin
  ];

  for (let i = 0; i < count; i++) {
    const word = shuffledWords[i % shuffledWords.length];
    const qType = listeningTypes[i % listeningTypes.length];

    let promptText = word.hanzi;
    let expectedCanonicalAnswer = '';
    let acceptedAnswers: string[] = [];

    switch (qType) {
      case 'hanziToMeaning':
        expectedCanonicalAnswer = word.meanings[0];
        acceptedAnswers = word.meanings;
        break;
      case 'pinyinToHanzi':
        expectedCanonicalAnswer = word.hanzi;
        acceptedAnswers = [word.hanzi];
        break;
      case 'hanziToPinyin':
        expectedCanonicalAnswer = word.pinyin;
        acceptedAnswers = [word.pinyin, word.pinyinNormalized];
        break;
    }

    questions.push({
      id: `lq_${Date.now()}_${i}_${word.id}`,
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

import { PracticeQuestion } from './chineseQuestionGenerator';
import {
  validatePinyinAnswer,
  validateHanziAnswer,
  validateMeaningAnswer,
  ValidationResult,
} from './chineseAnswerValidator';
import { recordPracticeResult } from '../chineseLearningService';
import { PinyinToneNumber } from './pinyinEngine';

export interface PracticeAttempt {
  questionId: string;
  wordId: string;
  userAnswer: string;
  isCorrect: boolean;
  isSkipped: boolean;
  validationResult?: ValidationResult;
  answeredAt: string;
}

export interface PracticeSessionSummary {
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  accuracyPercentage: number;
  completedAt: string;
}

export class PracticeSessionManager {
  private questions: PracticeQuestion[];
  private currentIndex: number = 0;
  private attempts: PracticeAttempt[] = [];
  private isSubmitted: boolean = false;
  private isToneAware: boolean = false;

  constructor(questions: PracticeQuestion[], isToneAware: boolean = false) {
    this.questions = questions;
    this.isToneAware = isToneAware;
  }

  public getCurrentQuestion(): PracticeQuestion | null {
    if (this.currentIndex >= this.questions.length) return null;
    return this.questions[this.currentIndex];
  }

  public getCurrentIndex(): number {
    return this.currentIndex;
  }

  public getTotalCount(): number {
    return this.questions.length;
  }

  public getIsSubmitted(): boolean {
    return this.isSubmitted;
  }

  public async evaluateSubmission(
    userAnswerText: string,
    selectedTone?: PinyinToneNumber
  ): Promise<ValidationResult> {
    const q = this.getCurrentQuestion();
    if (!q || this.isSubmitted) {
      throw new Error('No active question or question already submitted.');
    }

    let validationRes: ValidationResult;

    switch (q.questionType) {
      case 'hanziToPinyin':
        validationRes = validatePinyinAnswer(
          q.targetWord.pinyin,
          userAnswerText,
          selectedTone,
          this.isToneAware
        );
        break;
      case 'hanziToMeaning':
        validationRes = validateMeaningAnswer(q.acceptedAnswers, userAnswerText);
        break;
      case 'pinyinToHanzi':
      case 'meaningToHanzi':
        validationRes = validateHanziAnswer(q.targetWord.hanzi, userAnswerText);
        break;
    }

    this.isSubmitted = true;

    // Record attempt
    this.attempts.push({
      questionId: q.id,
      wordId: q.wordId,
      userAnswer: userAnswerText,
      isCorrect: validationRes.isValid,
      isSkipped: false,
      validationResult: validationRes,
      answeredAt: new Date().toISOString(),
    });

    // Auto-update UserLearningRecord
    await recordPracticeResult(q.wordId, validationRes.isValid);

    return validationRes;
  }

  public skipQuestion(): void {
    const q = this.getCurrentQuestion();
    if (!q || this.isSubmitted) return;

    this.isSubmitted = true;
    this.attempts.push({
      questionId: q.id,
      wordId: q.wordId,
      userAnswer: '',
      isCorrect: false,
      isSkipped: true,
      answeredAt: new Date().toISOString(),
    });
  }

  public nextQuestion(): boolean {
    if (this.currentIndex < this.questions.length) {
      this.currentIndex += 1;
      this.isSubmitted = false;
    }
    return this.currentIndex < this.questions.length;
  }

  public getSummary(): PracticeSessionSummary {
    const total = this.questions.length;
    const correct = this.attempts.filter((a) => a.isCorrect).length;
    const skipped = this.attempts.filter((a) => a.isSkipped).length;
    const incorrect = this.attempts.filter((a) => !a.isCorrect && !a.isSkipped).length;

    const answeredCount = correct + incorrect;
    const accuracy = answeredCount > 0 ? Math.round((correct / answeredCount) * 100) : 0;

    return {
      totalQuestions: total,
      correctCount: correct,
      incorrectCount: incorrect,
      skippedCount: skipped,
      accuracyPercentage: accuracy,
      completedAt: new Date().toISOString(),
    };
  }
}

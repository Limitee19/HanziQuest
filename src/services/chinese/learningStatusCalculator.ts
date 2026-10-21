import { UserLearningRecord } from '../chineseLearningService';

export type VocabularyLearningStatus = 'New' | 'Learning' | 'Familiar' | 'Mastered';

/**
 * Calculates user-facing Learning Status from UserLearningRecord
 * Rules:
 * - timesSeen === 0 -> New
 * - timesSeen > 0 && mastery < 0.5 -> Learning
 * - mastery >= 0.5 && mastery < 0.85 -> Familiar
 * - mastery >= 0.85 -> Mastered
 */
export function calculateLearningStatus(record?: UserLearningRecord): VocabularyLearningStatus {
  if (!record || record.timesSeen === 0) {
    return 'New';
  }
  if (record.mastery < 0.5) {
    return 'Learning';
  }
  if (record.mastery < 0.85) {
    return 'Familiar';
  }
  return 'Mastered';
}

export function getStatusBadgeStyle(status: VocabularyLearningStatus): {
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case 'New':
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/50',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200/80 dark:border-blue-800/80',
      };
    case 'Learning':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/50',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200/80 dark:border-amber-800/80',
      };
    case 'Familiar':
      return {
        bg: 'bg-purple-50 dark:bg-purple-950/50',
        text: 'text-purple-700 dark:text-purple-300',
        border: 'border-purple-200/80 dark:border-purple-800/80',
      };
    case 'Mastered':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/50',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-200/80 dark:border-emerald-800/80',
      };
  }
}

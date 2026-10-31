export type ReviewStatus = 'New' | 'Learning' | 'Review' | 'Mastered';
export type ReviewItemType = 'vocabulary' | 'hanzi';

export interface ReviewState {
  itemId: string;
  itemType: ReviewItemType;
  status: ReviewStatus;
  reviewCount: number;
  correctCount: number;
  incorrectCount: number;
  lastReviewedAt?: string;
  nextReviewAt?: string;
  intervalDays: number;
  updatedAt: string;
}

const INTERVAL_TIERS = [1, 3, 7, 14, 30, 60, 120, 180, 365];

/**
 * Deterministic Spaced Repetition Scheduler
 * Calculates next review interval Dan nextReviewAt date based on local timezone
 */
export function calculateNextReview(currentState: ReviewState, isCorrect: boolean): ReviewState {
  const now = new Date();
  const nowIso = now.toISOString();

  let nextInterval: number;
  let newStatus: ReviewStatus = currentState.status;

  if (isCorrect) {
    // Find next tier in interval ladder
    const currentTierIdx = INTERVAL_TIERS.findIndex((t) => t >= currentState.intervalDays);
    if (currentTierIdx === -1 || currentTierIdx >= INTERVAL_TIERS.length - 1) {
      nextInterval = 365; // Max 1 year limit
    } else {
      nextInterval = INTERVAL_TIERS[currentTierIdx + 1];
    }

    if (nextInterval >= 14) {
      newStatus = 'Mastered';
    } else if (nextInterval >= 3) {
      newStatus = 'Review';
    } else {
      newStatus = 'Learning';
    }
  } else {
    // Shorten interval on mistake
    const currentTierIdx = INTERVAL_TIERS.findIndex((t) => t >= currentState.intervalDays);
    if (currentTierIdx <= 0) {
      nextInterval = 1;
    } else {
      nextInterval = INTERVAL_TIERS[Math.max(0, currentTierIdx - 1)];
    }
    newStatus = 'Learning';
  }

  // Calculate local midnight-aligned next review date
  const nextDate = new Date(now);
  nextDate.setDate(nextDate.getDate() + nextInterval);
  nextDate.setHours(0, 0, 0, 0);

  return {
    ...currentState,
    status: newStatus,
    reviewCount: currentState.reviewCount + 1,
    correctCount: currentState.correctCount + (isCorrect ? 1 : 0),
    incorrectCount: currentState.incorrectCount + (isCorrect ? 0 : 1),
    lastReviewedAt: nowIso,
    nextReviewAt: nextDate.toISOString(),
    intervalDays: nextInterval,
    updatedAt: nowIso,
  };
}

/**
 * Formats user-friendly relative review date string (e.g., "Hari Ini", "Besok", "Terlambat 2 Hari", "15 Ags")
 */
export function getRelativeDateLabel(nextReviewAtStr?: string): string {
  if (!nextReviewAtStr) return 'Belum Di-review';

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const target = new Date(nextReviewAtStr);
  target.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `Terlambat ${Math.abs(diffDays)} Hari`;
  }
  if (diffDays === 0) {
    return 'Hari Ini';
  }
  if (diffDays === 1) {
    return 'Besok';
  }
  if (diffDays <= 7) {
    return `${diffDays} Hari Lagi`;
  }

  return target.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
}

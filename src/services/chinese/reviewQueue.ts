import { ChineseWord } from './chineseDataset';
import { ReviewState } from './reviewScheduler';

export interface ClassifiedReviewQueue {
  overdue: ChineseWord[];
  dueToday: ChineseWord[];
  newItems: ChineseWord[];
  allQueue: ChineseWord[];
}

/**
 * Builds and prioritizes due review queues from system vocabulary items
 * Priority Order: Overdue -> Due Today -> New Items
 */
export function buildReviewQueue(
  words: ChineseWord[],
  reviewStates: Record<string, ReviewState>
): ClassifiedReviewQueue {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const overdue: ChineseWord[] = [];
  const dueToday: ChineseWord[] = [];
  const newItems: ChineseWord[] = [];

  words.forEach((w) => {
    const st = reviewStates[w.id];
    if (!st || !st.nextReviewAt) {
      newItems.push(w);
      return;
    }

    const reviewDate = new Date(st.nextReviewAt);
    reviewDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((reviewDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      overdue.push(w);
    } else if (diffDays === 0) {
      dueToday.push(w);
    }
  });

  // Sort overdue items by oldest due date first
  overdue.sort((a, b) => {
    const dateA = new Date(reviewStates[a.id]?.nextReviewAt || 0).getTime();
    const dateB = new Date(reviewStates[b.id]?.nextReviewAt || 0).getTime();
    return dateA - dateB;
  });

  // Combine into single prioritized queue: Overdue -> Due Today -> New Items
  const allQueue = [...overdue, ...dueToday, ...newItems];

  return {
    overdue,
    dueToday,
    newItems,
    allQueue,
  };
}

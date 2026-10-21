# OmniLife — Chinese Learning CL-05 Architecture Specification

**Project:** OmniLife  
**Module:** Chinese Learning (CL-05 — Review & Spaced Repetition Foundation)  
**Date:** August 14, 2026  

---

## 1. Executive Overview

Phase **CL-05** introduces the first **Spaced Repetition System (SRS) Foundation** inside OmniLife. It features a pluggable `ReviewScheduler` abstraction, local timezone-aware date calculations (`nextReviewAt`), a `ReviewQueue` manager (`reviewQueue.ts`), an interactive **Review Dashboard** (`ReviewDashboardView.tsx`), integration with CL-03's Practice Engine, and supportive "No Guilt" UX.

---

## 2. Architectural Pipeline

```text
                                SRS REVIEW PIPELINE
                                         │
  ┌───────────────────┬──────────────────┴──────────────────┬───────────────────┐
  ▼                   ▼                                     ▼                   ▼
Review Dashboard    Review Queue Manager                Review Scheduler    Review State Update
(ReviewDashboard-   (reviewQueue.ts orders              (reviewScheduler.ts (recordPracticeResult
 View.tsx counters   Overdue -> Due Today ->             interval ladder     updates ReviewState &
 & daily triggers)   New Items)                          1d -> 3d -> 7d)     UserLearningRecord)
```

---

## 3. Spaced Repetition Interval Progression

- **Interval Tiers**: `[1, 3, 7, 14, 30, 60, 120, 180, 365]` days.
- **Correct Answer**: Advances `intervalDays` to next tier, sets `nextReviewAt` to local midnight-aligned date.
- **Incorrect Answer**: Shortens `intervalDays` for prompt re-study.
- Canonical `ChineseWord` and `HanziCharacter` content are **100% protected and never modified**.

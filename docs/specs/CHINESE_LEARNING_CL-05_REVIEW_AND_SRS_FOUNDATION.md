# OmniLife — Chinese Learning CL-05
## Chinese Review & Spaced Repetition Foundation

**Project:** OmniLife  
**Module:** Chinese Learning  
**Tier:** Tier 1 — Learning Intelligence Foundation  
**Phase:** CL-05  
**Status:** Implementation Ready  
**Implementation Target:** Antigravity AI Agent  
**Depends On:** CL-01 — Chinese Learning Foundation  
**Depends On:** CL-01A — Chinese Dataset & Pinyin Learning Engine  
**Depends On:** CL-02 — Chinese Vocabulary Library & Learning Interface  
**Depends On:** CL-03 — Chinese Practice & Quiz Engine  
**Depends On:** CL-04 — Hanzi Writing & Stroke Practice

---

# 1. Objective

Implement the first dedicated review and spaced-repetition foundation for OmniLife Chinese Learning.

Until CL-04, the system can:

    provide content
        ↓
    teach vocabulary
        ↓
    test recall
        ↓
    practice Hanzi writing

CL-05 introduces:

    Learning History
        ↓
    Review Scheduling
        ↓
    Review Queue
        ↓
    Due Reviews
        ↓
    Recall
        ↓
    Updated Learning State
        ↓
    Next Review

The main goal is to ensure the user does not have to manually decide:

    "What should I review today?"

Instead, OmniLife should eventually be able to determine:

    "These are the Chinese items that are due for review."

---

# 2. Core Product Philosophy

The system should follow the principle:

    Learn
      ↓
    Forget a little
      ↓
    Recall
      ↓
    Strengthen
      ↓
    Review later
      ↓
    Repeat

The goal is not:

    Review everything every day.

The goal is:

    Review the right things at the right time.

---

# 3. Important Architecture Rule

Do NOT tightly couple the review system to one specific SRS algorithm.

The architecture must separate:

    Learning Data
        ↓
    Review State
        ↓
    Scheduling Algorithm
        ↓
    Review Queue
        ↓
    Review UI

This is extremely important.

The scheduling algorithm must be replaceable.

---

# 4. Why the Algorithm Must Be Replaceable

Future versions of OmniLife may use:

    Simple Interval Scheduling
    SM-2
    FSRS
    Custom Learning Algorithm

CL-05 should therefore introduce an abstraction such as:

    ReviewScheduler

or equivalent.

The UI must not know whether the scheduling algorithm is:

    simple interval
    SM-2
    FSRS

The UI should only receive:

    due item
    review state
    next review

---

# 5. Existing Application Must Not Break

Before implementation:

1. Inspect CL-01.
2. Inspect CL-01A.
3. Inspect CL-02.
4. Inspect CL-03.
5. Inspect CL-04.
6. Inspect UserLearningRecord.
7. Inspect PracticeAttempt.
8. Inspect HanziWritingResult.
9. Inspect LearningStatusCalculator.
10. Inspect persistence.
11. Inspect state management.
12. Inspect localization.
13. Inspect navigation.
14. Inspect design system.
15. Inspect date/time handling.

Follow existing OmniLife architecture.

Do not rewrite unrelated systems.

---

# 6. Reviewable Learning Item

The SRS system should not be restricted to vocabulary.

The architecture should use a generic concept:

    ReviewableItem

A ReviewableItem may eventually represent:

    Vocabulary
    Hanzi
    Pinyin
    Grammar
    Sentence
    Listening Item
    Reading Item

CL-05 should primarily support:

    Vocabulary
    Hanzi

---

# 7. Review Item Identity

Every review item must have a stable identity.

Conceptually:

    ReviewItemId

Example:

    vocabulary:你

or:

    hanzi:你

The exact ID strategy must follow OmniLife's data architecture.

Do not use array indexes as permanent IDs.

---

# 8. Important Separation

Canonical content:

    ChineseWord
    HanziCharacter

must remain separate from user-specific review state.

Conceptually:

    ChineseWord
        │
        └── canonical content

    ReviewState
        │
        └── user-specific learning state

Do not store personal review scheduling directly inside canonical content.

---

# 9. Review State

Create a dedicated review state model.

Conceptually:

    ReviewState
        │
        ├── itemId
        ├── itemType
        ├── status
        ├── reviewCount
        ├── correctCount
        ├── incorrectCount
        ├── lastReviewedAt
        ├── nextReviewAt
        └── schedulingMetadata

The exact fields should follow existing OmniLife architecture.

---

# 10. Review State Status

Use a simple state model.

Recommended:

    New
    Learning
    Review
    Mastered

Do not confuse:

    learning status

with:

    scheduling state

They are related but not necessarily identical.

---

# 11. New

A review item is:

    New

when the user has not meaningfully reviewed it.

Example:

    New vocabulary
    New Hanzi

The item may have been viewed in the Vocabulary Library without becoming an active review item.

---

# 12. Learning

An item enters:

    Learning

after the user begins actively studying it.

Examples:

    first practice
    first writing session
    first meaningful recall

---

# 13. Review

An item enters:

    Review

after it has progressed beyond initial learning and is now being maintained through scheduled reviews.

---

# 14. Mastered

Mastered should represent:

    strong and consistently successful recall

It must NOT simply mean:

    user has seen this many times.

Do not automatically mark an item mastered based only on views.

---

# 15. Review Card

Create a reusable review-card abstraction.

Conceptually:

    ReviewCard
        │
        ├── item
        ├── prompt
        ├── answer
        ├── reviewState
        └── scheduling information

This should integrate with CL-03's Practice Engine.

Do NOT create a second answer-validation engine.

---

# 16. Critical Integration With CL-03

CL-05 should reuse:

    PracticeEngine

for review sessions.

The flow becomes:

    Review Queue
        ↓
    PracticeEngine
        ↓
    Question
        ↓
    User Answer
        ↓
    Answer Validation
        ↓
    Review Result
        ↓
    Review Scheduler
        ↓
    Next Review

This prevents duplicate quiz logic.

---

# 17. Critical Integration With CL-04

Hanzi writing practice may also contribute to review state.

Example:

    Hanzi:
    你

    User completes writing practice.

The system may record:

    writing interaction
    writing result
    review activity

Do not create a separate SRS system for Hanzi writing.

Use the same ReviewScheduler architecture.

---

# 18. Review Scheduler

Create a replaceable scheduling abstraction.

Conceptually:

    ReviewScheduler

with responsibilities such as:

    scheduleNewItem()
    scheduleCorrectReview()
    scheduleIncorrectReview()
    calculateNextReview()
    getReviewState()

The exact method names may differ.

The important requirement is separation from UI.

---

# 19. Initial Scheduling Algorithm

CL-05 should use a simple deterministic scheduling algorithm.

Do NOT implement a complex SRS algorithm yet unless the existing project already contains one.

A simple starting model may use intervals such as:

    New
      ↓
    1 day
      ↓
    3 days
      ↓
    7 days
      ↓
    14 days
      ↓
    30 days

These values are implementation defaults, not scientifically fixed requirements.

Document the actual values chosen by Antigravity.

---

# 20. Incorrect Answer Scheduling

An incorrect review should shorten the next interval.

Example:

    Current interval:
    7 days

User fails:

    Next review:
    sooner than 7 days

The exact interval must be determined by the scheduler.

Do not permanently reset all progress to zero unless the architecture explicitly calls for it.

---

# 21. Correct Answer Scheduling

A correct answer should increase the review interval.

Example:

    Current:
    3 days

Correct:

    Next:
    7 days

Again, the scheduler determines the actual value.

---

# 22. Repeated Correct Answers

Repeated successful recall should gradually increase the interval.

Example:

    1 day
    ↓
    3 days
    ↓
    7 days
    ↓
    14 days
    ↓
    30 days

Do not increase indefinitely without limits.

Use a reasonable maximum interval for the initial scheduler.

---

# 23. Maximum Interval

The initial scheduler should define a maximum review interval.

Example:

    365 days

This does NOT mean the user must wait a year.

It simply prevents uncontrolled interval growth.

The exact value should be configurable.

---

# 24. Review Result

Create a review-specific result abstraction.

Conceptually:

    ReviewResult

with:

    itemId
    result
    reviewedAt
    previousState
    nextState
    previousReviewDate
    nextReviewDate

It may also contain:

    answerQuality

if needed later.

---

# 25. Review Quality

Prepare the architecture for a future quality scale.

Possible future values:

    Again
    Hard
    Good
    Easy

However:

CL-05 does NOT need to implement a full four-button FSRS interface yet.

The initial system may derive scheduling from:

    Correct
    Incorrect

The architecture should remain expandable.

---

# 26. Future FSRS Compatibility

The architecture should eventually support:

    Again
    Hard
    Good
    Easy

without requiring the UI to be rewritten.

Prepare the abstraction now.

Do not implement FSRS mathematics unless specifically requested.

---

# 27. Review Queue

Create:

    ReviewQueue

The queue represents items currently due for review.

Conceptually:

    ReviewQueue
        │
        ├── Due Today
        ├── Overdue
        └── New Items

The user should be able to start a review session from this queue.

---

# 28. Due Review

An item is due when:

    nextReviewAt <= currentTime

Use the application's existing date/time abstraction if available.

Do not compare dates using UI-formatted strings.

---

# 29. Overdue Review

An item is overdue when:

    nextReviewAt < now

Overdue items should remain available until reviewed.

Do NOT discard overdue items.

---

# 30. Future Review

An item with:

    nextReviewAt > now

is not currently due.

It should not be included in the normal due queue.

---

# 31. New Items

New vocabulary/Hanzi that have never been reviewed may be offered as:

    New Learning

but should not be incorrectly treated as overdue.

Keep:

    New

separate from:

    Due Review

---

# 32. Review Queue Ordering

The default queue should prioritize:

    1. Overdue items
    2. Due today
    3. New learning items

Within the same category:

    older due date first

is a reasonable default.

---

# 33. Review Queue Size

Do not force the user to review everything at once.

Provide a manageable daily review queue.

Possible default:

    20 review items

If more are due:

    show:

    20 due now

    with remaining count visible.

The user may continue if desired.

---

# 34. Review Dashboard

Create a dedicated review entry point.

Conceptually:

    Chinese Learning
        ↓
    Review

The screen may show:

    Review Today

    Due:
    12

    Overdue:
    3

    New:
    5

    [ Start Review ]

---

# 35. Review Dashboard Information

Display only useful information.

Recommended:

    Due Reviews
    Overdue
    New Learning
    Total Available

Do not build advanced analytics yet.

---

# 36. Empty Review State

If there are no due items:

### Indonesian

    Tidak ada review yang perlu dilakukan sekarang.

### English

    No reviews are due right now.

Optionally show:

    Next review:
    Tomorrow

if available.

---

# 37. Overdue State

If overdue items exist, communicate them clearly.

Example:

    3 Overdue

Do not use alarmist language.

The purpose is to encourage the user to continue, not create guilt.

---

# 38. Review Session

A review session should use the same interaction model as CL-03.

Flow:

    Review Dashboard
        ↓
    Start Review
        ↓
    Review Question
        ↓
    Answer
        ↓
    Feedback
        ↓
    Schedule Next Review
        ↓
    Next Review
        ↓
    Summary

---

# 39. Review Question Types

Reuse CL-03 question types:

    Hanzi → Pinyin
    Hanzi → Meaning
    Pinyin → Hanzi
    Meaning → Hanzi

Do not create duplicate question models.

---

# 40. Review Question Selection

A review item may generate one of the supported question types.

For CL-05, random selection is acceptable.

Future versions may select question type based on weakness.

Do not implement adaptive question-type selection yet.

---

# 41. Review and Practice Difference

The system should distinguish conceptually:

    Practice

from:

    Review

Practice:

    learning-oriented
    may contain new material
    may be freely started

Review:

    scheduled
    driven by review state
    intended to reinforce previously learned material

Both may use:

    PracticeEngine

---

# 42. Review Completion

When a review question is answered:

    validate answer
        ↓
    calculate result
        ↓
    update ReviewState
        ↓
    calculate nextReviewAt
        ↓
    persist
        ↓
    continue

The update must happen exactly once.

---

# 43. Review Transaction Integrity

A single submitted review must not update the review state multiple times.

Protect against:

    double taps
    repeated submissions
    screen rebuilds
    navigation events

The operation should be idempotent where practical.

---

# 44. Learning Record Integration

Review events should update:

    UserLearningRecord

and:

    ReviewState

without duplicating information unnecessarily.

If the current model already contains:

    correctCount
    wrongCount
    timesSeen

reuse those values.

Only add new fields required for scheduling.

---

# 45. Scheduling Metadata

The scheduler may require metadata such as:

    interval
    repetitionCount
    easeFactor

However:

Do NOT add algorithm-specific fields unless they are actually required by the chosen algorithm.

For the simple initial scheduler, keep the state minimal.

---

# 46. Avoid Algorithm Leakage

Do not expose fields such as:

    fsrsStability
    fsrsDifficulty

in the core UI model unless FSRS is actually implemented.

The UI should care about:

    due
    learning
    review
    next review

not algorithm internals.

---

# 47. Date and Time Handling

Review scheduling must use a consistent time source.

Use:

    current DateTime

through the application's existing date/time abstraction if available.

Avoid directly scattering:

    DateTime.now()

throughout the codebase if OmniLife already has a clock abstraction.

---

# 48. Time Zone

Review dates must respect the user's local time zone.

The user should not see:

    tomorrow's review

appear unexpectedly because of UTC conversion.

Use local date boundaries for user-facing review scheduling.

---

# 49. Day Boundary

Define a clear day boundary.

For example:

    review due date:
    2026-08-15

means the item is due according to the user's local calendar date.

Do not rely solely on a UTC date string.

---

# 50. Review Date Display

Display human-friendly dates.

Examples:

### Indonesian

    Hari ini
    Besok
    Terlambat 2 hari
    15 Agustus

### English

    Today
    Tomorrow
    2 days overdue
    August 15

Use localization.

---

# 51. Next Review Display

On vocabulary detail, optionally show:

    Next Review
    Tomorrow

or:

    Next Review
    15 August

Only display this if the item has an actual review state.

---

# 52. Review Status on Vocabulary Detail

Extend CL-02 vocabulary detail with:

    Learning Status
    Review Status
    Next Review

Example:

    Status
    Learning

    Next Review
    Tomorrow

Do not overload the detail page.

---

# 53. Review Status on Hanzi Detail

Likewise, Hanzi detail may show:

    Learning Status
    Next Review

This should use the same ReviewState system.

---

# 54. Review Progress

During a review session display:

    4 / 20

or:

    4 of 20

Do not expose complex scheduler metadata.

---

# 55. Review Session Summary

At the end:

    Review Complete

    18 / 20 Correct

    Accuracy
    90%

    Reviewed:
    20

    Next Review:
    Tomorrow

The summary should be concise.

---

# 56. Daily Review Overview

Prepare the architecture for a daily review dashboard.

Possible structure:

    Chinese Review

    ┌─────────────────────────────┐
    │ Due Today             12    │
    │ Overdue                3    │
    │ New                    5    │
    └─────────────────────────────┘

    [ Start Review ]

Do not add unnecessary charts.

---

# 57. Daily Review Completion

After the user completes all currently queued reviews:

    show a completion state

Example:

### Indonesian

    Semua review saat ini sudah selesai.

### English

    All current reviews are complete.

Optionally show:

    Next review:
    Tomorrow

---

# 58. No Guilt UX

Do NOT use:

    "You failed your review streak!"
    "You missed your study goal!"
    "You are falling behind!"

The system should remain supportive.

Use:

    "3 review masih tertunda."

rather than:

    "You failed to review 3 items."

---

# 59. Review Streak

Do NOT implement streaks in CL-05.

Streaks create additional product behavior and analytics requirements.

A future phase may decide whether:

    daily streaks
    weekly consistency
    study streak

are appropriate.

---

# 60. Notifications

Do NOT implement notifications in CL-05.

Future OmniLife reminders may integrate with:

    Review Scheduler
        ↓
    OmniLife Reminder System

This should be handled later.

---

# 61. Calendar Integration

Do NOT implement full Calendar integration yet.

However, the architecture should allow future integration:

    ReviewState.nextReviewAt
        ↓
    Calendar / Reminder

This can later connect Chinese Learning with OmniLife's broader life-management system.

---

# 62. Task Integration

Do NOT create Tasks for every review.

Review is a learning system, not a generic task list.

Future integration may optionally allow:

    "Review Mandarin"

as a daily planning item.

Do not implement that now.

---

# 63. Review Limits

The scheduler should not create an unreasonable amount of work.

If thousands of items become due:

    the queue should still be usable.

Future phases may implement:

    daily limits
    new-card limits
    review limits

CL-05 only needs basic queue management.

---

# 64. Review Queue Pagination / Lazy Loading

If the dataset becomes large:

    avoid loading unnecessary content.

Use:

    lazy loading
    efficient queries

where appropriate.

Do not overengineer if the current dataset is small.

---

# 65. Persistence

Review state must persist across:

    application restarts
    navigation
    device sleep

Example:

    User reviews 你

Then closes OmniLife.

When reopened:

    你

must retain its:

    review state
    nextReviewAt

---

# 66. Persistence Failure

If saving a review fails:

    do not silently pretend it succeeded.

Provide a recoverable error.

Do not corrupt the user's existing review state.

---

# 67. Offline Requirement

CL-05 must work offline.

The user should be able to:

- see due reviews
- start review
- answer questions
- update review state
- schedule next review
- see review summary

without internet.

---

# 68. No AI Dependency

CL-05 must NOT require:

    Groq
    OpenAI
    Gemini
    local LLM
    external AI API

The review system must be deterministic and local.

---

# 69. No External SRS API

Do not rely on:

    external review scheduling service

The scheduler belongs inside OmniLife.

---

# 70. Localization

All user-facing strings must use OmniLife localization.

Required:

    Indonesian
    English

Examples:

### Indonesian

    Review
    Review Hari Ini
    Perlu Review
    Terlambat
    Baru
    Mulai Review
    Review Selesai
    Review Berikutnya
    Hari Ini
    Besok
    Semua Review Selesai
    Belum Ada Review

### English

    Review
    Review Today
    Due
    Overdue
    New
    Start Review
    Review Complete
    Next Review
    Today
    Tomorrow
    All Reviews Complete
    No Reviews Due

Do not hardcode UI strings.

---

# 71. Responsive Design

The review dashboard and session must work on:

    Mobile
    Tablet
    Desktop

Mobile should prioritize:

    review count
    start button
    current question
    answer input
    feedback
    next

---

# 72. Accessibility

Ensure:

- clear review status labels
- keyboard navigation
- accessible buttons
- screen-reader-friendly text
- clear focus states
- non-color-only due/overdue indication

Do not communicate:

    due
    overdue
    mastered

only through color.

---

# 73. Error Handling

Handle:

- no review state
- missing content
- invalid review state
- scheduler failure
- persistence failure
- corrupted dates
- invalid nextReviewAt
- empty queue

Do not crash OmniLife.

---

# 74. Review State Recovery

If review state is malformed:

    do not destroy all learning history.

Prefer:

    safe fallback

or:

    migration/default state

depending on the existing persistence architecture.

---

# 75. Migration

If CL-05 requires changes to existing models:

    implement a safe migration.

Do not invalidate existing:

    UserLearningRecord

or:

    PracticeAttempt

data.

If the app already has production-like local data, migration must preserve it.

---

# 76. Testing Strategy

CL-05 must include thorough unit and integration tests.

---

## 76.1 New Item Test

Given:

    no ReviewState

the system should classify the item as:

    New

---

## 76.2 First Review Test

After first successful review:

    ReviewState

must be created.

---

## 76.3 Due Date Test

Given:

    nextReviewAt <= now

the item must be:

    Due

---

## 76.4 Future Date Test

Given:

    nextReviewAt > now

the item must not appear in:

    Due Queue

---

## 76.5 Overdue Test

Given:

    nextReviewAt < now

the item must be:

    Overdue

---

## 76.6 Correct Scheduling Test

Given a correct answer:

    nextReviewAt

must move forward according to the scheduler.

---

## 76.7 Incorrect Scheduling Test

Given an incorrect answer:

    nextReviewAt

must become sooner than it would have been after a successful review.

---

## 76.8 Interval Growth Test

Repeated successful reviews should produce increasing intervals.

Example:

    1
    <
    3
    <
    7
    <
    14

The exact intervals depend on the chosen implementation.

---

## 76.9 Maximum Interval Test

The scheduler must not exceed its configured maximum interval.

---

## 76.10 Queue Ordering Test

Verify:

    Overdue

comes before:

    Due Today

and:

    Due

comes before:

    New

according to the selected queue policy.

---

## 76.11 Duplicate Prevention Test

The same review item should not appear twice in the same review queue unless intentionally allowed.

---

## 76.12 Review Completion Test

Verify:

    final review
        ↓
    completed state
        ↓
    summary

---

## 76.13 Double Submission Test

Submitting the same review twice must not update:

    reviewCount
    correctCount
    nextReviewAt

twice.

---

## 76.14 Persistence Test

Save review state.

Restart/reload.

Verify:

    state remains intact.

---

## 76.15 Time Zone Test

Verify review dates are interpreted according to the user's local time.

---

## 76.16 Empty Queue Test

If no items are due:

    review queue = empty

and the UI displays the appropriate empty state.

---

## 76.17 Migration Test

If a schema migration is required:

    old learning data

must remain intact.

---

## 76.18 Localization Test

Verify Indonesian and English review UI.

---

# 77. Definition of Done

CL-05 is complete only when:

- [ ] ReviewState exists.
- [ ] ReviewableItem abstraction exists or equivalent architecture is established.
- [ ] ReviewScheduler exists.
- [ ] Scheduler is separated from UI.
- [ ] Initial deterministic scheduling algorithm works.
- [ ] New items are supported.
- [ ] Learning state is supported.
- [ ] Review state is supported.
- [ ] Mastered state is supported.
- [ ] Due reviews are detected.
- [ ] Overdue reviews are detected.
- [ ] Future reviews are excluded.
- [ ] ReviewQueue exists.
- [ ] Review queue ordering works.
- [ ] Review dashboard exists.
- [ ] Start Review works.
- [ ] Review uses CL-03 PracticeEngine.
- [ ] Review uses CL-03 answer validation.
- [ ] Pinyin validation works in review.
- [ ] Meaning validation works in review.
- [ ] Hanzi validation works in review.
- [ ] Review result updates learning data.
- [ ] Review result updates ReviewState.
- [ ] Next review date is calculated.
- [ ] Review state persists.
- [ ] Review survives application restart.
- [ ] Review session summary exists.
- [ ] Empty review state exists.
- [ ] Overdue state exists.
- [ ] Offline review works.
- [ ] No AI is required.
- [ ] No external SRS API is required.
- [ ] Indonesian localization works.
- [ ] English localization works.
- [ ] Mobile layout works.
- [ ] Desktop layout works.
- [ ] Relevant tests pass.
- [ ] `flutter analyze` passes.
- [ ] Existing CL-01 through CL-04 functionality continues to work.
- [ ] Existing OmniLife modules continue to work.

---

# 78. Expected Architecture After CL-05

The conceptual architecture should now be:

    OmniLife
    │
    └── Chinese Learning
        │
        ├── Dashboard
        │
        ├── Vocabulary
        │   │
        │   ├── Vocabulary Library
        │   └── Vocabulary Detail
        │
        ├── Hanzi
        │   │
        │   ├── Hanzi Library
        │   ├── Hanzi Detail
        │   ├── Stroke Order Viewer
        │   └── Writing Practice
        │
        ├── Practice
        │   │
        │   ├── Practice Setup
        │   ├── Practice Session
        │   └── Session Summary
        │
        ├── Review
        │   │
        │   ├── Review Dashboard
        │   ├── Review Queue
        │   ├── Review Session
        │   └── Review Summary
        │
        ├── Chinese Content
        │   │
        │   ├── ChineseWord
        │   ├── HanziCharacter
        │   └── ExampleSentence
        │
        ├── Learning Data
        │   │
        │   ├── UserLearningRecord
        │   ├── PracticeAttempt
        │   └── ReviewState
        │
        └── Learning Engine
            │
            ├── PinyinEngine
            ├── ChineseAnswerValidator
            ├── PracticeEngine
            ├── PracticeQuestionGenerator
            ├── LearningStatusCalculator
            ├── HanziWritingEvaluator
            ├── ReviewScheduler
            └── ReviewQueue

---

# 79. Future Architecture Direction

CL-05 should make this possible:

    New Vocabulary
        ↓
    Practice
        ↓
    Learning
        ↓
    Review Scheduler
        ↓
    Due Review
        ↓
    Recall
        ↓
    Review Again
        ↓
    Longer Interval
        ↓
    Long-Term Retention

Future scheduler:

    ReviewScheduler
        │
        ├── SimpleScheduler
        │
        └── FSRS Scheduler
                ↓
            Advanced Review

The UI should not need to know which scheduler is active.

---

# 80. Future SRS Upgrade

A future phase may replace the initial scheduler with:

    FSRS

or another scientifically grounded scheduling algorithm.

When that happens:

    ReviewScheduler

should remain the stable interface.

Only the implementation behind it should change where possible.

Do not build CL-05 in a way that makes future SRS replacement require rewriting:

    Review UI
    Practice Engine
    Vocabulary Library
    Hanzi Library

---

# 81. Future Review Difficulty

Future versions may introduce:

    Again
    Hard
    Good
    Easy

This may allow the scheduler to estimate:

    difficulty
    stability
    retrievability

Do not implement those concepts unless explicitly required.

---

# 82. Future Daily Review

Future phases may add:

    Daily Review Goal

Example:

    20 reviews/day

This should eventually integrate with OmniLife:

    Calendar
    Tasks
    Routines
    Reminders

CL-05 should not implement those integrations yet.

---

# 83. Future Notifications

Future:

    ReviewScheduler
        ↓
    Reminder System
        ↓
    Notification

Example:

    "12 Mandarin reviews are ready."

Do not implement notifications now.

---

# 84. Future Analytics

Future analytics may show:

    retention
    accuracy
    review consistency
    difficult vocabulary
    weak Hanzi
    average interval
    study time
    review load

CL-05 only establishes the data needed to make those features possible.

---

# 85. Future Learning Intelligence

Eventually:

    Practice
        +
    Writing
        +
    Listening
        +
    Reading
        +
    Speaking
        +
    Review

could contribute to a unified:

    Chinese Learning Mastery Model

CL-05 should not attempt to build that complete model.

---

# 86. Final Instruction to Antigravity

CL-05 is the phase that turns OmniLife Chinese Learning into a long-term retention system.

The user should be able to:

    learn vocabulary
        ↓
    practice vocabulary
        ↓
    practice Hanzi
        ↓
    have OmniLife remember the learning state
        ↓
    return later
        ↓
    see what is due
        ↓
    review
        ↓
    receive feedback
        ↓
    automatically schedule the next review

Prioritize:

    Correct Scheduling
    >
    Data Integrity
    >
    Learning UX
    >
    Reusability
    >
    Future SRS Compatibility
    >
    Performance

Critical rules:

1. Do not tightly couple the UI to an SRS algorithm.
2. Create a replaceable ReviewScheduler abstraction.
3. Keep canonical Chinese content separate from user review state.
4. Reuse CL-03 PracticeEngine.
5. Reuse CL-03 Answer Validation.
6. Reuse CL-04 Hanzi Writing results.
7. Reuse UserLearningRecord where appropriate.
8. Do not duplicate learning statistics unnecessarily.
9. Do not implement FSRS mathematics yet unless explicitly required.
10. Do not implement notifications.
11. Do not implement streaks.
12. Do not implement cloud synchronization.
13. Do not require AI.
14. Do not require internet access.
15. Keep review scheduling deterministic.
16. Handle local timezone correctly.
17. Persist nextReviewAt reliably.
18. Prevent duplicate review submissions.
19. Handle overdue reviews gracefully.
20. Do not create guilt-driven UX.

The most important architectural principle is:

    Review UI
        ↓
    Review Engine
        ↓
    Review Scheduler
        ↓
    Review State

The UI must never directly calculate:

    nextReviewAt

The scheduler owns scheduling decisions.

---

# End of CL-05

Next planned phase:

CL-06 — Chinese Listening & Audio Learning Foundation
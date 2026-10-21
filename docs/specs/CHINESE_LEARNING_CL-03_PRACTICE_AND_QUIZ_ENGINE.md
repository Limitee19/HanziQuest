# OmniLife — Chinese Learning CL-03
## Chinese Practice & Quiz Engine

**Project:** OmniLife  
**Module:** Chinese Learning  
**Tier:** Tier 1 — Core Learning  
**Phase:** CL-03  
**Status:** Implementation Ready  
**Implementation Target:** Antigravity AI Agent  
**Depends On:** CL-01 — Chinese Learning Foundation  
**Depends On:** CL-01A — Chinese Dataset & Pinyin Learning Engine  
**Depends On:** CL-02 — Chinese Vocabulary Library & Learning Interface

---

# 1. Objective

Implement the first real Mandarin learning practice system inside OmniLife.

CL-01 established the Chinese Learning foundation.

CL-01A established:

- system-provided Chinese content
- canonical linguistic data
- Pinyin normalization
- Pinyin tone generation
- tone-aware validation
- accepted meanings
- PinyinToneInput
- UserLearningRecord foundation

CL-02 established:

- Vocabulary Library
- Vocabulary Detail
- Search
- Filters
- Learning Status
- Vocabulary browsing

CL-03 now introduces the actual learning interaction:

    Vocabulary
        ↓
    Practice
        ↓
    Question
        ↓
    User Answer
        ↓
    Answer Validation
        ↓
    Feedback
        ↓
    Learning Record Update

The goal is to create a reusable Practice & Quiz Engine that can later support:

- vocabulary review
- HSK practice
- Hanzi practice
- Pinyin practice
- meaning recall
- grammar exercises
- listening exercises
- spaced repetition
- progress tracking

This phase must establish the engine without implementing every future learning mode.

---

# 2. Core Product Philosophy

The practice system should prioritize:

    Active Recall
    >
    Clear Feedback
    >
    Low Friction
    >
    Consistent Progress Tracking
    >
    Future Extensibility

The user should not merely read vocabulary.

The user should actively retrieve information.

Example:

    Hanzi shown:

    你

    User must recall:

    ni

or:

    Hanzi shown:

    你

    User must recall:

    kamu

or:

    Meaning shown:

    kamu

    User must recall:

    你

The system should therefore support multiple question directions.

---

# 3. Important Architecture Rule

Do NOT create a separate quiz architecture disconnected from:

    CL-01
    CL-01A
    CL-02

Reuse:

    ChineseWord
    UserLearningRecord
    PinyinEngine
    ChineseAnswerValidator
    PinyinToneInput
    Vocabulary Repository
    Localization
    Design System
    State Management

Do not duplicate existing functionality.

---

# 4. Existing Application Must Not Break

Before implementation:

1. Inspect CL-01.
2. Inspect CL-01A.
3. Inspect CL-02.
4. Inspect ChineseWord.
5. Inspect UserLearningRecord.
6. Inspect PinyinEngine.
7. Inspect ChineseAnswerValidator.
8. Inspect PinyinToneInput.
9. Inspect vocabulary repository.
10. Inspect persistence.
11. Inspect state management.
12. Inspect localization.
13. Inspect navigation.
14. Inspect responsive UI conventions.

Follow existing OmniLife conventions.

Do not rewrite unrelated modules.

---

# 5. Practice Engine Concept

Create a reusable practice engine.

Conceptually:

    PracticeEngine
        │
        ├── PracticeSession
        │
        ├── PracticeQuestion
        │
        ├── AnswerSubmission
        │
        ├── AnswerResult
        │
        └── SessionResult

The exact names may differ depending on OmniLife conventions.

The architecture must separate:

    Question Generation

from:

    Answer Validation

and:

    Learning Progress Update

---

# 6. Practice Session

A practice session represents one continuous learning activity.

Example:

    Chinese Vocabulary Practice

    10 Questions

    Question 1 / 10

The session should maintain:

    sessionId
    questionCount
    currentQuestionIndex
    correctCount
    incorrectCount
    skippedCount
    startedAt
    completedAt

Only implement fields that fit the existing architecture.

---

# 7. Practice Question

A practice question should contain enough information for the UI to render the question without needing to understand the underlying database implementation.

Conceptually:

    PracticeQuestion
    │
    ├── id
    ├── contentId
    ├── questionType
    ├── prompt
    ├── expectedAnswerType
    ├── options
    └── metadata

The question must reference canonical content rather than copying all content unnecessarily.

---

# 8. Question Types

CL-03 should implement the following initial question types.

## Type A — Hanzi → Pinyin

Example:

    你

    ?

User answers:

    ni

or:

    ni + Tone 3

---

## Type B — Hanzi → Meaning

Example:

    你

    ?

User answers:

    kamu

---

## Type C — Pinyin → Hanzi

Example:

    nǐ

    ?

User answers:

    你

---

## Type D — Meaning → Hanzi

Example:

    kamu

    ?

User answers:

    你

---

# 9. Question Type Architecture

Use a reusable enum or equivalent:

    PracticeQuestionType

Possible values:

    hanziToPinyin
    hanziToMeaning
    pinyinToHanzi
    meaningToHanzi

Do not hardcode question types as arbitrary strings throughout the UI.

The architecture must allow future types to be added without rewriting the entire engine.

---

# 10. Question Generation

Create a reusable question generator.

Conceptually:

    PracticeQuestionGenerator

Responsibilities:

- select content
- determine question type
- construct prompt
- construct expected answer
- provide optional answer choices
- prevent invalid question states

Do not put question generation logic directly inside widgets.

---

# 11. Question Selection

For CL-03, support at least:

    Random Vocabulary Practice

The user should be able to start a practice session from the Vocabulary Library or another Chinese Learning entry point.

Future selection strategies may include:

    New vocabulary
    Learning vocabulary
    Weak vocabulary
    HSK level
    Topic
    Review due

Do not implement sophisticated selection algorithms yet.

---

# 12. Practice Size

Allow a reasonable session size.

Recommended options:

    5
    10
    20

The user may select a session size before starting.

If the available vocabulary is smaller than the requested number:

    use the available content

Do not create duplicate questions unless necessary.

---

# 13. Minimum Vocabulary Requirement

Do not allow a practice session to start if there is insufficient content.

Example:

    Requested:
    20 questions

    Available:
    4 vocabulary items

The system should gracefully explain the limitation.

Possible message:

### Indonesian

    Belum ada cukup kosakata untuk latihan ini.

### English

    There isn't enough vocabulary for this practice yet.

Do not crash.

---

# 14. Question Presentation

The practice screen should have a strong visual hierarchy.

Conceptually:

    ┌──────────────────────────────────────┐
    │                                      │
    │              Question 1 / 10        │
    │                                      │
    │                    你                │
    │                                      │
    │              [ Your Answer ]         │
    │                                      │
    │                 [ Check ]            │
    │                                      │
    └──────────────────────────────────────┘

The exact design must follow OmniLife's existing design system.

---

# 15. Progress Indicator

Show the user's current position.

Example:

    1 / 10

or:

    Question 1 of 10

A progress bar may also be used.

Do not make the progress indicator visually dominant.

---

# 16. Answer Input Types

Different question types require different input methods.

---

## 16.1 Pinyin Input

For:

    Hanzi → Pinyin

use the existing:

    PinyinToneInput

from CL-01A.

Do NOT create another Pinyin input component.

---

## 16.2 Hanzi Input

For:

    Pinyin → Hanzi

and:

    Meaning → Hanzi

use a normal text input that accepts Chinese characters.

The user should be able to paste or type Hanzi.

Do not implement handwriting recognition in CL-03.

---

## 16.3 Meaning Input

For:

    Hanzi → Meaning

use a normal text input.

Meaning validation should use the accepted answers established in CL-01A.

---

# 17. Pinyin Answer Behavior

The user should not be forced to type tone marks.

Example:

    Question:

    你

    User:

    ni

The system should be able to accept:

    ni

as correct when the exercise is configured as:

    Pinyin Without Tone

---

# 18. Tone-Aware Pinyin Practice

The practice engine must also support tone-aware Pinyin questions.

Example:

    Question:

    你

    User:

    ni

    Selected tone:

    3

Generated:

    nǐ

Result:

    Correct

If:

    Selected tone:

    2

Generated:

    ní

Result:

    Incorrect

This must reuse the CL-01A Pinyin Engine and Answer Validator.

---

# 19. Pinyin Practice Modes

Prepare the architecture for:

    Pinyin Without Tone

and:

    Pinyin With Tone

The initial practice UI may allow the mode to be selected before a session.

Example:

    Pinyin Mode

    [ Without Tone ]
    [ With Tone ]

If implementation simplicity is preferred, the default may be:

    Without Tone

with tone-aware practice available through the architecture.

---

# 20. Meaning Answer Validation

Meaning answers must support accepted meanings.

Example:

    Target:
    你

    Accepted:
    kamu
    Anda
    you

User:

    kamu

Result:

    Correct

The validator should tolerate reasonable differences in:

- capitalization
- surrounding spaces
- repeated whitespace

Do not use uncontrolled fuzzy matching.

---

# 21. Hanzi Answer Validation

Hanzi answers should be comparatively strict.

Example:

    Target:

    你

    User:

    你

    Correct

Example:

    Target:

    你

    User:

    您

    Incorrect

Do not automatically accept visually similar Hanzi.

---

# 22. Answer Submission

The user should submit an answer using:

    Check

or an equivalent action.

The system should:

1. capture answer
2. normalize where appropriate
3. validate
4. produce AnswerResult
5. update learning record
6. display feedback
7. allow user to continue

---

# 23. Answer Result

Create a reusable result model.

Conceptually:

    AnswerResult
    │
    ├── isCorrect
    ├── userAnswer
    ├── correctAnswer
    ├── questionType
    └── explanation

Optional fields may include:

    normalizedUserAnswer
    normalizedCorrectAnswer
    acceptedAnswers

The exact model must follow existing architecture.

---

# 24. Correct Feedback

When the answer is correct:

    ✓ Correct

The feedback should be positive but not overly distracting.

Example:

    Correct!

    你
    nǐ
    kamu

The user should be able to continue.

---

# 25. Incorrect Feedback

When the answer is incorrect:

    Incorrect

Show the correct answer.

Example:

    Your answer:
    ni

    Correct answer:
    nǐ

or:

    Your answer:
    saya

    Correct answer:
    kamu / Anda

Do not hide the correct answer.

The purpose is learning, not punishment.

---

# 26. Feedback State

Do not immediately move to the next question after submission.

The user should have a short feedback state.

Flow:

    Answer
       ↓
    Check
       ↓
    Feedback
       ↓
    Next

This allows the user to understand mistakes.

---

# 27. Next Question

After feedback, show:

    Next

The button should be clearly available.

Keyboard accessibility should be supported on desktop where appropriate.

---

# 28. Prevent Accidental Double Submission

After an answer is submitted:

    Check

must not submit the same answer multiple times.

Disable or lock submission while the result is being processed.

Do not increment:

    correctCount

or:

    wrongCount

more than once.

---

# 29. Skipping

Prepare support for:

    Skip

A user may skip a difficult question.

If implemented in CL-03:

    Skip

should not count as:

    Correct

or:

    Incorrect

Track:

    skippedCount

The system should then move to the next question.

---

# 30. Session Completion

After the final question, show a session summary.

Example:

    Practice Complete

    8 / 10 Correct

    Accuracy
    80%

    ✓ Correct: 8
    ✗ Incorrect: 2

    [ Practice Again ]
    [ Back to Vocabulary ]

The exact UI must follow OmniLife's design system.

---

# 31. Session Summary

The session summary should show at least:

    total questions
    correct answers
    incorrect answers
    skipped answers
    accuracy

Do not create advanced analytics yet.

---

# 32. Accuracy

Calculate:

    accuracy =
    correctCount / answeredQuestionCount

Do not divide by zero.

If the user answers zero questions:

    accuracy = 0

or another safe representation.

---

# 33. Learning Record Update

Every answered question should update the relevant:

    UserLearningRecord

At minimum:

Correct answer:

    timesSeen += 1
    correctCount += 1

Incorrect answer:

    timesSeen += 1
    wrongCount += 1

Skipped:

    do not count as answered

The exact fields should follow the existing CL-01A model.

---

# 34. Important Data Rule

Do NOT modify canonical Chinese content after a user answers.

For example:

    User answer:
    ni

must NOT modify:

    ChineseWord.pinyin

The canonical value remains:

    nǐ

Only:

    UserLearningRecord

should change.

---

# 35. Learning Status Update

After an answer, the system should recalculate the simple learning status from CL-02.

Possible progression:

    New
      ↓
    Learning
      ↓
    Familiar
      ↓
    Mastered

Do not implement spaced repetition.

Do not make mastery artificially increase simply because the user opened a vocabulary item.

Practice performance is the relevant input.

---

# 36. Question History

During a session, maintain enough information to generate the session summary.

Conceptually:

    PracticeAttempt
    │
    ├── questionId
    ├── contentId
    ├── questionType
    ├── userAnswer
    ├── correctAnswer
    ├── isCorrect
    └── answeredAt

This may be stored permanently or kept session-local depending on existing architecture.

Do not create permanent history if OmniLife does not yet require it.

---

# 37. Practice Session State

The session should have clear states.

Recommended:

    idle
    loading
    active
    feedback
    completed
    error

Do not create complicated state machines unless required by existing architecture.

---

# 38. Navigation

The flow should be:

    Chinese Learning
        ↓
    Vocabulary
        ↓
    Vocabulary Detail
        ↓
    Start Practice
        ↓
    Practice Setup
        ↓
    Practice Session
        ↓
    Session Summary

The user should also be able to start practice from another Chinese Learning entry point in the future.

---

# 39. Practice Setup Screen

Implement a lightweight setup screen before starting practice.

Possible options:

    Number of Questions

    [ 5 ] [ 10 ] [ 20 ]

    Question Types

    [ Pinyin ]
    [ Meaning ]
    [ Hanzi ]

The exact configuration may be simplified if necessary.

Do not create dozens of settings.

---

# 40. Default Practice Configuration

Provide a sensible default.

Recommended:

    Questions:
    10

    Question Types:
    Mixed

    Pinyin:
    Without Tone

The user should be able to start quickly.

---

# 41. Mixed Practice

Support a mixed mode where the engine selects among supported question types.

For example:

    Question 1
    Hanzi → Pinyin

    Question 2
    Hanzi → Meaning

    Question 3
    Pinyin → Hanzi

The distribution does not need to be perfectly balanced in CL-03.

---

# 42. Question Randomization

Questions should be randomized for normal practice.

Do not always show:

    你
    我
    他
    她

in the same order.

Use a deterministic randomization mechanism suitable for testing.

---

# 43. Duplicate Prevention

Within one session:

    avoid showing the same content repeatedly

when enough unique content exists.

If the vocabulary pool is smaller than the requested question count:

    allow controlled reuse

rather than failing.

---

# 44. Question Type Randomization

When using Mixed mode, question types may be randomized.

Do not produce impossible combinations.

For example:

    A question requiring Pinyin

must have valid Pinyin data.

A question requiring Meaning

must have at least one accepted meaning.

---

# 45. Missing Content Handling

If a vocabulary item lacks the required field:

Example:

    Question type:
    Hanzi → Meaning

but:

    meanings = empty

Do not generate the question.

The generator must select another compatible item.

---

# 46. Practice Engine Independence

The engine must not depend on UI widgets.

The following should be testable independently:

    question generation
    answer validation
    session state
    score calculation
    learning record update

This is essential for future expansion.

---

# 47. Future Question Types

Design the architecture so future question types can be added:

    Hanzi → Pinyin
    Hanzi → Meaning
    Pinyin → Hanzi
    Meaning → Hanzi

Future:

    Audio → Hanzi
    Audio → Meaning
    Hanzi → Audio
    Hanzi → Stroke Order
    Sentence → Missing Word
    Grammar → Answer
    Image → Vocabulary

Do not implement future types now.

---

# 48. Future Learning Modes

The engine should eventually support:

    Practice
    Review
    Quiz
    Exam
    HSK Practice
    Daily Review
    Weak Vocabulary Review

CL-03 only needs to create a clean foundation for these.

---

# 49. Localization

All user-facing strings must use OmniLife's localization system.

Required languages:

    Indonesian
    English

Examples:

### Indonesian

    Latihan
    Mulai Latihan
    Jumlah Soal
    Campuran
    Periksa
    Benar
    Salah
    Jawaban Kamu
    Jawaban Benar
    Berikutnya
    Lewati
    Latihan Selesai
    Akurasi
    Latihan Lagi
    Kembali ke Kosakata

### English

    Practice
    Start Practice
    Number of Questions
    Mixed
    Check
    Correct
    Incorrect
    Your Answer
    Correct Answer
    Next
    Skip
    Practice Complete
    Accuracy
    Practice Again
    Back to Vocabulary

Do not hardcode strings inside widgets.

---

# 50. Responsive Design

The practice interface must work on:

    Mobile
    Tablet
    Desktop

Mobile should prioritize:

    question
    input
    check button
    feedback
    next button

Desktop may provide more whitespace but must maintain the same hierarchy.

---

# 51. Keyboard Interaction

Where appropriate on desktop:

    Enter

may submit an answer.

After feedback:

    Enter

may continue to the next question.

Do not interfere with text input behavior.

For Pinyin input, ensure keyboard interaction does not accidentally submit before the user finishes typing.

---

# 52. Accessibility

Ensure:

- screen-reader-friendly labels
- clear focus states
- keyboard navigation
- accessible tone buttons
- adequate touch targets
- feedback that is not color-only
- clear correct/incorrect text

Do not communicate correctness only using:

    green
    red

Use icons/text as well.

---

# 53. Error Handling

Handle:

- insufficient vocabulary
- missing content
- invalid question
- persistence failure
- unexpected state
- session initialization failure

Do not crash OmniLife.

Show a recoverable error state where appropriate.

---

# 54. Offline Requirement

CL-03 must work offline.

The user should be able to:

- start practice
- answer questions
- receive feedback
- update local progress
- complete a session

without an internet connection.

---

# 55. No AI Dependency

CL-03 must NOT require:

    Groq
    OpenAI
    Gemini
    local LLM
    any external AI API

Question generation and validation must be deterministic.

AI-powered learning will be introduced later.

---

# 56. No Advanced SRS

Do NOT implement:

    SM-2
    FSRS
    spaced repetition scheduling
    adaptive interval algorithms
    complex retention prediction

The UserLearningRecord must only receive basic interaction statistics.

A dedicated future phase will design the review algorithm.

---

# 57. Testing Strategy

CL-03 must include unit and integration tests appropriate to the existing project.

---

## 57.1 Question Generation Test

Verify:

    hanziToPinyin

produces a valid question.

Verify:

    hanziToMeaning

produces a valid question.

Verify:

    pinyinToHanzi

produces a valid question.

Verify:

    meaningToHanzi

produces a valid question.

---

## 57.2 Missing Data Test

If:

    meanings = empty

a:

    hanziToMeaning

question must not be generated from that item.

---

## 57.3 Pinyin Validation Test

Test:

    Target:
    nǐ

    User:
    ni

    Mode:
    no-tone

    Result:
    correct

---

## 57.4 Tone Validation Test

Test:

    Target:
    nǐ

    User:
    ni

    Tone:
    3

    Result:
    correct

Test:

    Tone:
    2

    Result:
    incorrect

---

## 57.5 Meaning Validation Test

Test:

    Target meanings:
    kamu
    Anda
    you

User:

    kamu

Result:

    correct

---

## 57.6 Hanzi Validation Test

Test:

    Target:
    你

    User:
    你

Result:

    correct

Test:

    Target:
    你

    User:
    您

Result:

    incorrect

---

## 57.7 Session Score Test

Example:

    10 total
    8 correct
    2 incorrect

Expected:

    accuracy = 80%

---

## 57.8 Zero Answer Test

If:

    answeredQuestionCount = 0

the system must not divide by zero.

---

## 57.9 Duplicate Submission Test

Submitting the same answer twice must not:

    increment correctCount twice

or:

    update learning progress twice.

---

## 57.10 Learning Record Test

Correct:

    timesSeen + 1
    correctCount + 1

Incorrect:

    timesSeen + 1
    wrongCount + 1

Skipped:

    no answered count increment

---

## 57.11 Question Randomization Test

Verify that the question generator can produce different ordering.

Do not write a flaky test requiring a specific random sequence.

---

## 57.12 Session Completion Test

Verify:

    final question
        ↓
    completed state
        ↓
    session summary

---

# 58. Definition of Done

CL-03 is complete only when:

- [ ] Practice Engine exists.
- [ ] Practice Session exists.
- [ ] Practice Question exists.
- [ ] Answer Result exists.
- [ ] Question generation is separated from UI.
- [ ] Answer validation is separated from UI.
- [ ] Hanzi → Pinyin works.
- [ ] Hanzi → Meaning works.
- [ ] Pinyin → Hanzi works.
- [ ] Meaning → Hanzi works.
- [ ] PinyinToneInput is reused.
- [ ] Pinyin without tone mode works.
- [ ] Tone-aware Pinyin mode works.
- [ ] Meaning accepted answers work.
- [ ] Hanzi validation works.
- [ ] Correct feedback works.
- [ ] Incorrect feedback works.
- [ ] Correct answer is revealed after incorrect submission.
- [ ] Next question works.
- [ ] Skip works if implemented.
- [ ] Session progress is displayed.
- [ ] Session score is calculated.
- [ ] Session completion screen exists.
- [ ] UserLearningRecord updates after answered questions.
- [ ] Canonical Chinese content is never modified by answers.
- [ ] Learning status can update from practice results.
- [ ] Question randomization works.
- [ ] Duplicate questions are minimized.
- [ ] Missing-data questions are prevented.
- [ ] Indonesian localization works.
- [ ] English localization works.
- [ ] Mobile layout works.
- [ ] Desktop layout works.
- [ ] Offline practice works.
- [ ] Relevant tests pass.
- [ ] `flutter analyze` passes.
- [ ] Existing OmniLife features continue to work.

---

# 59. Expected Architecture After CL-03

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
        ├── Practice
        │   │
        │   ├── Practice Setup
        │   ├── Practice Session
        │   └── Session Summary
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
        │   └── PracticeAttempt
        │
        └── Learning Engine
            │
            ├── PinyinEngine
            ├── ChineseAnswerValidator
            ├── PracticeEngine
            ├── PracticeQuestionGenerator
            └── LearningStatusCalculator

Future:

    Practice
        ↓
    Review
        ↓
    Spaced Repetition
        ↓
    Daily Review
        ↓
    Weak Vocabulary
        ↓
    HSK Practice

And eventually:

    Chinese Learning
        │
        ├── Vocabulary
        ├── Hanzi
        ├── Pinyin
        ├── Grammar
        ├── Listening
        ├── Reading
        ├── Speaking
        ├── Review
        ├── Progress
        └── AI Tutor

---

# 60. Final Instruction to Antigravity

CL-03 is the first phase where Chinese Learning becomes an actual interactive learning system.

The user must be able to:

    choose practice
        ↓
    receive a question
        ↓
    answer
        ↓
    receive immediate feedback
        ↓
    learn from mistakes
        ↓
    continue
        ↓
    finish the session
        ↓
    see results
        ↓
    have learning progress updated

Prioritize:

    Correctness
    >
    Learning UX
    >
    Reusability
    >
    Data Integrity
    >
    Maintainability
    >
    Future Extensibility

Important:

1. Reuse CL-01A's PinyinEngine.
2. Reuse CL-01A's ChineseAnswerValidator.
3. Reuse CL-01A's PinyinToneInput.
4. Reuse CL-02's UserLearningRecord integration.
5. Do not duplicate validation logic.
6. Do not modify canonical Chinese content based on user answers.
7. Do not introduce AI.
8. Do not introduce internet dependencies.
9. Do not implement SRS yet.
10. Do not implement listening/speaking yet.
11. Do not implement handwriting recognition yet.
12. Do not implement advanced analytics yet.

The engine must be designed so future question types can be added without rewriting the practice system.

The most important architectural separation is:

    Question Generation
            ↓
    Answer Validation
            ↓
    Learning Record Update
            ↓
    UI Feedback

These responsibilities should remain independent.

Do not turn CL-03 into a monolithic widget or screen.

---

# End of CL-03

Next planned phase:

CL-04 — Hanzi Writing & Stroke Practice
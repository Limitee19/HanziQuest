# OmniLife — Chinese Learning CL-04
## Hanzi Writing & Stroke Practice

**Project:** OmniLife  
**Module:** Chinese Learning  
**Tier:** Tier 1 — Core Learning  
**Phase:** CL-04  
**Status:** Implementation Ready  
**Implementation Target:** Antigravity AI Agent  
**Depends On:** CL-01 — Chinese Learning Foundation  
**Depends On:** CL-01A — Chinese Dataset & Pinyin Learning Engine  
**Depends On:** CL-02 — Chinese Vocabulary Library & Learning Interface  
**Depends On:** CL-03 — Chinese Practice & Quiz Engine

---

# 1. Objective

Implement the first Hanzi writing and stroke-learning system inside OmniLife.

The purpose of CL-04 is to allow the user to actively practice writing Chinese characters rather than only recognizing them.

The system should introduce:

- Hanzi character study
- stroke count
- stroke order information
- stroke-by-stroke visualization
- writing canvas
- guided writing practice
- free writing practice
- basic writing evaluation
- writing progress integration

The core learning loop becomes:

    Learn Character
        ↓
    Observe Stroke Order
        ↓
    Practice Writing
        ↓
    Receive Feedback
        ↓
    Repeat
        ↓
    Save Learning Progress

This phase should establish the foundation for future:

- advanced handwriting recognition
- stroke accuracy scoring
- character recognition
- writing analytics
- Hanzi mastery
- AI-assisted handwriting feedback

---

# 2. Core Product Philosophy

Hanzi learning should not only ask:

    "Do you recognize this character?"

It should also teach:

    "Can you produce this character?"

The experience should therefore emphasize:

    Observe
        ↓
    Understand
        ↓
    Trace
        ↓
    Write
        ↓
    Recall
        ↓
    Repeat

The system should avoid making writing practice feel like an examination.

The first goal is:

    correct learning

not:

    perfect scoring

---

# 3. Important Architecture Rule

Do NOT create a separate Chinese Learning architecture.

Reuse the systems established by:

    CL-01
    CL-01A
    CL-02
    CL-03

Especially reuse:

    HanziCharacter
    ChineseWord
    UserLearningRecord
    PracticeEngine
    Localization
    Design System
    Persistence
    State Management

The Hanzi Writing system must integrate with the existing Chinese Learning architecture.

---

# 4. Existing Application Must Not Break

Before implementation:

1. Inspect CL-01.
2. Inspect CL-01A.
3. Inspect CL-02.
4. Inspect CL-03.
5. Inspect HanziCharacter.
6. Inspect ChineseWord.
7. Inspect UserLearningRecord.
8. Inspect persistence.
9. Inspect state management.
10. Inspect navigation.
11. Inspect localization.
12. Inspect design system.
13. Inspect responsive behavior.
14. Inspect existing testing conventions.

Follow existing OmniLife architecture.

Do not rewrite unrelated modules.

---

# 5. Hanzi Character Foundation

CL-04 should make the existing Hanzi data actually useful for learning.

A Hanzi character should conceptually be able to provide:

    character
    pinyin
    meanings
    strokeCount
    strokeData
    strokeOrder
    exampleWords

Only implement fields that actually exist or can be cleanly introduced.

Do not fabricate linguistic information.

---

# 6. Stroke Data

The system requires structured stroke data.

Conceptually:

    Hanzi
       ↓
    Character
       ↓
    Stroke 1
    Stroke 2
    Stroke 3
    ...
    Stroke N

Each stroke should contain enough information to render or animate it.

Possible representation:

    SVG path data

or another appropriate vector representation.

Use the approach most compatible with the Flutter architecture and available Hanzi data.

---

# 7. Stroke Data Source

If the project does not currently contain stroke data:

Antigravity should evaluate the most appropriate static/local dataset or open-source stroke data source.

The dataset must be:

- local
- deterministic
- usable offline
- legally appropriate for the project
- suitable for commercial/personal use according to its license

Do not make an external API call every time the user practices a character.

Do not depend on an online service for basic Hanzi writing.

Document the chosen dataset and its license in the project documentation.

---

# 8. Initial Character Scope

Do NOT attempt to include every Chinese character in CL-04 immediately.

Start with the characters already present in the OmniLife Chinese Learning dataset.

If the current dataset is small, use that dataset.

Future phases can expand the Hanzi library.

---

# 9. Hanzi Detail Integration

Extend the Vocabulary Detail experience from CL-02.

A vocabulary containing Hanzi should provide an entry point such as:

    Practice Hanzi

Example:

    你

    nǐ

    kamu / Anda

    [ Practice Hanzi ]

This should open the Hanzi Writing experience.

---

# 10. Hanzi Learning Screen

Create a dedicated Hanzi learning screen.

Conceptually:

    ┌─────────────────────────────────────┐
    │                                     │
    │                你                   │
    │               nǐ                    │
    │            kamu / Anda              │
    │                                     │
    │       Stroke Count: 7               │
    │                                     │
    │       [ View Stroke Order ]         │
    │                                     │
    │       [ Practice Writing ]          │
    │                                     │
    └─────────────────────────────────────┘

The exact design must follow OmniLife's existing design system.

---

# 11. Stroke Count

Display the total number of strokes when data is available.

Example:

    Stroke Count
    7

The count must come from actual stroke data.

Do not manually hardcode stroke counts in UI widgets.

---

# 12. Stroke Order Viewer

Implement a stroke-order visualization.

The user should be able to see:

    Stroke 1
    ↓
    Stroke 2
    ↓
    Stroke 3
    ↓
    ...

The viewer should clearly communicate the sequence.

---

# 13. Stroke Animation

The user should be able to play an animation showing the character being written stroke by stroke.

Example:

    Empty
      ↓
    Stroke 1
      ↓
    Stroke 2
      ↓
    Stroke 3
      ↓
    Complete Character

Provide controls such as:

    Play
    Pause
    Replay

The exact controls should follow OmniLife conventions.

---

# 14. Stroke Step Controls

Where practical, allow manual stepping.

Example:

    [ Previous ]
    Stroke 3 / 7
    [ Next ]

This is useful for deliberate study.

The user should not be forced to repeatedly replay the entire animation.

---

# 15. Stroke Number Indicators

When displaying stroke order, optionally show:

    1
    2
    3
    4
    ...

Use subtle visual indicators.

Do not overcrowd the character.

---

# 16. Stroke Order Information

If the dataset contains stroke metadata, use it.

Do not attempt to infer stroke order from the user's drawing.

The canonical stroke order should come from the structured character data.

---

# 17. Writing Practice

Implement a writing canvas.

The user should be able to draw with:

    Mouse
    Touch
    Stylus where supported

The canvas must work on:

    Desktop
    Tablet
    Mobile

---

# 18. Writing Canvas

The writing area should be visually clear.

Conceptually:

    ┌─────────────────────────────┐
    │                             │
    │                             │
    │           Canvas            │
    │                             │
    │                             │
    └─────────────────────────────┘

Controls:

    [ Clear ]
    [ Undo ]

Optional:

    [ Redo ]

Do not overload the writing area with UI elements.

---

# 19. Writing Grid

The writing canvas should optionally provide a traditional Chinese writing guide.

Possible guide:

    ┌───────────┐
    │     │     │
    │─────┼─────│
    │     │     │
    │─────┼─────│
    │     │     │
    └───────────┘

This should resemble a:

    田字格

where appropriate.

The guide should be subtle enough that the user's writing remains visible.

---

# 20. Writing Guide Modes

Prepare the architecture for:

    No Guide
    Basic Grid
    Character Guide

Initial implementation may use:

    Basic Grid

and:

    Character Guide

where technically feasible.

---

# 21. Guided Writing

Implement a guided mode where the target Hanzi is displayed as a faint background.

Example:

    Target:

          你

The user traces over the character.

The guide should be visually subtle.

Do not simply place a giant opaque Hanzi over the user's writing.

---

# 22. Free Writing

Implement a free-writing mode.

The target character may be shown separately:

    Write:

    你

The canvas itself should be empty except for optional writing guides.

This mode tests actual recall more strongly than tracing.

---

# 23. Writing Practice Modes

The architecture should support:

    Guided
    Free

Future:

    Exam
    Timed
    Random Character
    Memory Recall

Do not implement future modes yet.

---

# 24. Practice Flow

Recommended flow:

    Character Detail
        ↓
    Stroke Order
        ↓
    Guided Practice
        ↓
    Free Practice
        ↓
    Result
        ↓
    Continue / Retry

The user should be able to skip directly to practice if desired.

---

# 25. Canvas Input

The canvas must support continuous pointer input.

Handle:

    pointer down
    pointer move
    pointer up

The implementation must avoid unnecessary lag.

Use an appropriate Flutter drawing architecture.

Do not store every frame as a database record.

---

# 26. Stroke Capture

The system should capture user strokes as vector-like point sequences.

Conceptually:

    UserStroke
       │
       ├── points
       ├── startTime
       └── endTime

The exact model may be simplified.

The captured stroke should be sufficient for basic evaluation.

---

# 27. Clear

The user must be able to clear the entire canvas.

After:

    Clear

all current drawing data should be removed.

Do not modify learning progress simply because the user clears the canvas.

---

# 28. Undo

Provide:

    Undo

where practical.

Undo should remove the most recent user stroke.

Example:

    Stroke 1
    Stroke 2
    Stroke 3

After Undo:

    Stroke 1
    Stroke 2

Do not erase the entire canvas.

---

# 29. Redo

If the project's architecture supports it, implement:

    Redo

Otherwise:

    do not add a complicated redo architecture solely for CL-04.

Undo is higher priority.

---

# 30. Basic Writing Evaluation

CL-04 should include basic evaluation.

However:

DO NOT attempt to build a sophisticated handwriting recognition AI.

The first evaluation system should focus on simple measurable properties.

Possible checks:

    Did the user draw anything?
    How many strokes did they draw?
    Is the approximate drawing located inside the expected character region?
    Is the number of strokes reasonably close?
    Does the stroke trajectory roughly correspond to the expected stroke?

Only implement checks that are technically reliable.

---

# 31. Writing Evaluation Philosophy

The evaluation should be:

    Helpful

not:

    Punitive

If the system is uncertain:

    do not confidently say the character is wrong.

Prefer:

    "Looks good — try comparing it with the stroke order."

or:

    "Your writing is close. Try again and pay attention to stroke order."

The system should not falsely claim perfect handwriting recognition.

---

# 32. Evaluation Levels

Use simple feedback states.

Recommended:

    Not Enough Data
    Needs Practice
    Good
    Very Good

Avoid presenting an exact numerical score if the evaluation is not sufficiently accurate.

---

# 33. Evaluation Confidence

If the system cannot confidently determine correctness:

    return uncertain

rather than:

    incorrect

This is important.

Do not create a false sense of precision.

---

# 34. Stroke Count Evaluation

If the target has:

    7 strokes

and the user draws:

    0 strokes

Result:

    Not Enough Data

If the user draws:

    7 strokes

this does not automatically mean correct.

Stroke count is only one evaluation signal.

---

# 35. Stroke Order Evaluation

If the captured strokes can reasonably be compared to canonical stroke data:

    compare their sequence

Possible result:

    Stroke order looks correct.

If the comparison is not reliable:

    do not pretend to recognize stroke order.

---

# 36. Character Shape Evaluation

If technically feasible, compare the user's drawing against the canonical character geometry.

However:

DO NOT implement a large machine-learning model for handwriting recognition in CL-04.

Prefer:

    deterministic geometric comparison

or:

    a reliable existing local library

if available.

---

# 37. Evaluation Architecture

Separate evaluation from the UI.

Conceptually:

    HanziWritingEvaluator
        │
        ├── evaluateStrokeCount()
        ├── evaluateStrokeOrder()
        ├── evaluateShape()
        └── produceWritingResult()

The exact API may differ.

Do not place evaluation calculations inside the widget.

---

# 38. Writing Result

Create a reusable result model.

Conceptually:

    HanziWritingResult
        │
        ├── status
        ├── strokeCountResult
        ├── strokeOrderResult
        ├── shapeResult
        └── feedback

Not every field needs to be shown to the user.

---

# 39. Result Feedback

After writing practice:

Example:

    Writing Practice Complete

    Good!

    You used 7 strokes.

    Try paying attention to:
    Stroke order

    [ Try Again ]
    [ Continue ]

The feedback should remain concise.

---

# 40. Do Not Over-Score

Do not display:

    87.42%

unless the evaluation is actually meaningful.

For early CL-04, qualitative feedback is preferred.

---

# 41. Learning Record Integration

Writing practice should update the existing:

    UserLearningRecord

when a meaningful practice attempt is completed.

Possible fields:

    writingPracticeCount
    writingSuccessCount

Only add new fields if they are architecturally appropriate.

Do not duplicate existing learning statistics unnecessarily.

---

# 42. Important Data Separation

Do NOT modify:

    ChineseWord
    HanziCharacter

when the user writes a character.

The user's writing is an interaction.

It is not canonical linguistic content.

User activity belongs in:

    UserLearningRecord

or:

    PracticeAttempt

or an appropriate user-specific learning model.

---

# 43. Writing Progress

CL-04 should provide basic progress information.

For example:

    Hanzi practiced:
    12

    Characters needing practice:
    5

Do not build a complete analytics dashboard yet.

---

# 44. Mastery Integration

Writing practice may contribute to overall Hanzi learning status.

However:

writing once should NOT automatically mark a character:

    Mastered

Use the existing learning-status architecture.

If the current model is not sufficient to represent writing-specific mastery, extend it cleanly rather than creating a second unrelated mastery system.

---

# 45. Character Practice Entry Points

The user should be able to access Hanzi practice from:

    Vocabulary Detail
    Hanzi Learning
    Chinese Learning Dashboard

At minimum CL-04 must support:

    Vocabulary Detail
        ↓
    Practice Hanzi

---

# 46. Hanzi Library

If the current Chinese Learning navigation already supports a Hanzi section, connect CL-04 to it.

If not, add a lightweight:

    Hanzi

entry point.

Do not create a second vocabulary system.

Hanzi should remain connected to the same canonical Chinese data.

---

# 47. Hanzi Search

If a Hanzi Library is introduced, allow search by:

    Hanzi
    Pinyin
    Meaning

Reuse CL-02 search logic where appropriate.

Do not duplicate search normalization.

---

# 48. Hanzi Detail Information

A Hanzi detail screen should be capable of showing:

    Character
    Pinyin
    Meaning
    Stroke Count
    Stroke Order
    Example Words
    Writing Practice

Only show fields supported by actual data.

---

# 49. Example Words

If a Hanzi appears in vocabulary:

    你

possible related vocabulary:

    你好
    你们

The system may display example words.

Do not generate example words dynamically.

Use actual dataset relationships.

---

# 50. Writing Practice Session

A single writing session may contain:

    1 character

or:

    several characters

For CL-04, prioritize:

    one character at a time

This makes the learning loop clearer.

Future phases may implement:

    5 characters
    10 characters
    HSK writing practice

---

# 51. Retry

The user should be able to retry immediately.

Example:

    [ Try Again ]

Retry should:

    clear the canvas
    reset the evaluation
    preserve the same target character

It should not create a duplicate persistent vocabulary record.

---

# 52. Continue

After a successful or completed attempt:

    [ Continue ]

should move to the next appropriate character.

For CL-04, the next character can be selected from:

    current vocabulary set

or:

    the user's selected practice set.

---

# 53. Random Hanzi Practice

If enough Hanzi data exists, allow:

    Random Practice

Example:

    Random Hanzi

The user receives a random character.

Do not implement sophisticated weak-character selection yet.

---

# 54. Future Weak Character Selection

Prepare the architecture for future:

    Practice Weak Hanzi

based on:

    writing success
    writing mistakes
    stroke-order errors
    review history

Do not implement this algorithm in CL-04.

---

# 55. Stroke Animation Performance

Stroke animation should be smooth.

Avoid:

- rebuilding the entire page for every animation frame
- unnecessary database access
- expensive parsing on every frame

Preprocess or cache stroke data where appropriate.

---

# 56. Stroke Data Caching

If the same character is practiced repeatedly:

    reuse parsed stroke data

Do not repeatedly parse the same large SVG/vector data if unnecessary.

Use an appropriate local cache or in-memory cache.

---

# 57. Offline Requirement

CL-04 must work offline.

The user must be able to:

- view stroke order
- animate strokes
- open writing practice
- draw
- clear
- undo
- receive local evaluation
- update local learning progress

without an internet connection.

---

# 58. No AI Dependency

CL-04 must NOT require:

    Groq
    OpenAI
    Gemini
    local LLM
    external AI APIs

for normal writing practice.

The basic writing system must work locally.

AI handwriting feedback may be explored in a future phase.

---

# 59. No Cloud Dependency

Do not require cloud storage for:

    stroke data
    writing practice
    basic evaluation

Local persistence is sufficient for CL-04.

---

# 60. Localization

All user-facing strings must use OmniLife's localization architecture.

Required:

    Indonesian
    English

Examples:

### Indonesian

    Hanzi
    Latihan Hanzi
    Urutan Goresan
    Jumlah Goresan
    Mulai Menulis
    Latihan Terpandu
    Latihan Bebas
    Hapus
    Urungkan
    Lanjut
    Coba Lagi
    Bagus
    Perlu Latihan
    Belum Cukup Data
    Latihan Menulis Selesai

### English

    Hanzi
    Hanzi Practice
    Stroke Order
    Stroke Count
    Start Writing
    Guided Practice
    Free Practice
    Clear
    Undo
    Next
    Try Again
    Good
    Needs Practice
    Not Enough Data
    Writing Practice Complete

Do not hardcode strings inside UI widgets.

---

# 61. Responsive Design

The writing interface must be usable on:

    Mobile
    Tablet
    Desktop

---

# 62. Mobile Writing UX

On mobile:

- writing canvas should receive most of the screen
- controls should be reachable by thumb
- canvas must respond well to touch
- accidental navigation should be minimized

---

# 63. Desktop Writing UX

On desktop:

- mouse input must work
- keyboard navigation should work where appropriate
- canvas should remain large enough for writing
- the UI should not become excessively wide

---

# 64. Tablet / Stylus

Where Flutter platform support permits:

    stylus input

should work naturally.

Do not implement specialized stylus hardware support unless needed.

Use normal pointer input architecture where possible.

---

# 65. Orientation

The writing canvas should remain usable in both:

    portrait

and:

    landscape

where the platform allows it.

Do not force orientation globally for OmniLife.

---

# 66. Accessibility

Ensure:

- clear controls
- readable labels
- adequate touch targets
- keyboard accessibility
- visible focus states
- non-color-only feedback

The writing canvas itself should have an accessible description.

Example:

    "Hanzi writing canvas for character 你"

---

# 67. Error Handling

Handle:

- missing stroke data
- invalid character data
- unsupported character
- canvas initialization failure
- evaluation failure
- persistence failure

If stroke data is unavailable:

    show the Hanzi

and explain:

    Stroke order data is not available for this character yet.

Do not crash.

---

# 68. Missing Stroke Data

If a character does not have stroke data:

Do NOT:

    invent stroke order

Do NOT:

    generate fake stroke paths

Instead:

    disable stroke animation

and provide an appropriate fallback.

Example:

### Indonesian

    Data urutan goresan untuk karakter ini belum tersedia.

### English

    Stroke-order data for this character is not available yet.

---

# 69. Data Validation

Before rendering stroke data:

verify:

    character exists
    stroke data exists
    stroke count matches data
    stroke paths are valid

If inconsistent:

    fail gracefully

Do not crash the entire Chinese Learning module.

---

# 70. Testing Strategy

CL-04 must include unit and integration tests appropriate to the project.

---

## 70.1 Stroke Data Test

Verify that a supported character has valid stroke data.

---

## 70.2 Stroke Count Test

Verify:

    strokeCount

matches the number of canonical strokes.

---

## 70.3 Stroke Animation Test

Verify that animation progresses:

    0
    →
    1
    →
    2
    →
    ...
    →
    N

without invalid states.

---

## 70.4 Canvas Test

Verify:

    pointer down
    pointer move
    pointer up

creates a user stroke.

---

## 70.5 Clear Test

Verify:

    Clear

removes all user strokes.

---

## 70.6 Undo Test

Given:

    Stroke 1
    Stroke 2
    Stroke 3

After Undo:

    Stroke 1
    Stroke 2

---

## 70.7 Empty Drawing Test

If the user submits with no strokes:

    result = Not Enough Data

The system must not crash.

---

## 70.8 Stroke Count Evaluation Test

Verify that the evaluator can detect:

    0 strokes
    expected number of strokes
    significantly different stroke counts

without producing invalid results.

---

## 70.9 Writing Result Test

Verify that:

    HanziWritingResult

is produced correctly.

---

## 70.10 Learning Record Test

Verify that completing a meaningful writing attempt updates the appropriate learning record.

Do not update progress multiple times for one attempt.

---

## 70.11 Retry Test

Verify:

    Try Again

resets:

    canvas
    evaluation state
    current attempt

while preserving:

    target character

---

## 70.12 Missing Stroke Data Test

Verify that missing stroke data produces a graceful fallback.

---

## 70.13 Localization Test

Verify Indonesian and English strings.

---

## 70.14 Responsive Test

Verify the writing screen on:

    mobile
    desktop

using the project's existing testing approach.

---

# 71. Definition of Done

CL-04 is complete only when:

- [ ] Hanzi Writing module exists.
- [ ] Hanzi detail can open writing practice.
- [ ] Hanzi stroke count is displayed.
- [ ] Stroke data is available for supported characters.
- [ ] Stroke order visualization works.
- [ ] Stroke animation works.
- [ ] Play works.
- [ ] Replay works.
- [ ] Stroke stepping works where implemented.
- [ ] Writing canvas works.
- [ ] Mouse input works.
- [ ] Touch input works.
- [ ] Guided writing works.
- [ ] Free writing works.
- [ ] Basic writing evaluation exists.
- [ ] Evaluation is separated from UI.
- [ ] Clear works.
- [ ] Undo works.
- [ ] Writing feedback exists.
- [ ] Retry works.
- [ ] Continue works.
- [ ] Learning progress is updated appropriately.
- [ ] Canonical Hanzi data is never modified by user writing.
- [ ] Missing stroke data is handled gracefully.
- [ ] Offline operation works.
- [ ] AI is not required.
- [ ] Indonesian localization works.
- [ ] English localization works.
- [ ] Mobile layout works.
- [ ] Desktop layout works.
- [ ] Relevant tests pass.
- [ ] `flutter analyze` passes.
- [ ] Existing Chinese Learning features continue to work.
- [ ] Existing OmniLife modules continue to work.

---

# 72. Expected Architecture After CL-04

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
            ├── LearningStatusCalculator
            └── HanziWritingEvaluator

---

# 73. Future Architecture Direction

CL-04 should make the following future flow possible:

    Hanzi
       ↓
    Learn Stroke Order
       ↓
    Guided Writing
       ↓
    Free Writing
       ↓
    Writing Evaluation
       ↓
    Learning Record
       ↓
    Mastery

Future:

    Writing
       ↓
    Stroke Accuracy
       ↓
    Weak Stroke Detection
       ↓
    Targeted Practice

Future:

    Hanzi
       ↓
    Writing
       ↓
    Listening
       ↓
    Reading
       ↓
    Speaking
       ↓
    Full Vocabulary Mastery

---

# 74. Future AI Integration

AI is explicitly NOT part of CL-04.

However, architecture should not prevent a future AI layer.

Future possibilities:

    User handwriting
        ↓
    Local evaluation
        ↓
    AI-assisted feedback

Example:

    "Your overall shape is close,
     but the second stroke is too short."

This belongs to a future phase.

Do not implement it now.

---

# 75. Final Instruction to Antigravity

CL-04 should make Hanzi writing a real learning activity inside OmniLife.

The user should be able to:

    see a Hanzi
        ↓
    understand its stroke order
        ↓
    watch it being written
        ↓
    trace it
        ↓
    write it independently
        ↓
    receive feedback
        ↓
    retry
        ↓
    continue learning

Prioritize:

    Learning UX
    >
    Input Responsiveness
    >
    Data Accuracy
    >
    Maintainability
    >
    Future Extensibility

Important:

1. Reuse existing Chinese Learning architecture.
2. Reuse HanziCharacter.
3. Reuse ChineseWord relationships.
4. Reuse UserLearningRecord.
5. Reuse existing localization.
6. Reuse existing design system.
7. Keep stroke data local.
8. Keep basic writing functionality offline.
9. Do not require AI.
10. Do not require an external API.
11. Do not invent stroke data.
12. Do not modify canonical Hanzi data from user writing.
13. Do not implement advanced handwriting AI.
14. Do not implement complex mastery algorithms.
15. Do not implement cloud synchronization.
16. Keep evaluation modular.

Most importantly:

    The writing evaluator must never pretend to be more accurate than it actually is.

If the system cannot confidently determine whether a character is correct:

    return uncertainty

rather than:

    falsely claiming incorrectness or correctness.

The user is learning Mandarin.

The system should encourage practice, not punish imperfect handwriting.

---

# End of CL-04

Next planned phase:

CL-05 — Chinese Review & Spaced Repetition Foundation
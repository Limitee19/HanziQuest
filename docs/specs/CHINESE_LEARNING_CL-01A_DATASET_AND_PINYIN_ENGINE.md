# OmniLife — Chinese Learning CL-01A
## Chinese Dataset & Pinyin Learning Engine

**Project:** OmniLife  
**Module:** Chinese Learning  
**Tier:** Tier 1 — Foundation Extension  
**Phase:** CL-01A  
**Status:** Implementation Ready  
**Implementation Target:** Antigravity AI Agent  
**Depends On:** CL-01 — Chinese Learning Foundation

---

## 1. Objective

Extend the existing Chinese Learning foundation so that Mandarin learning content is provided by the application instead of requiring the user to manually enter linguistic information.

The system must transition from:

    User manually creates vocabulary
            ↓
    Hanzi
    Pinyin
    Meaning
    Example Sentence

into:

    Chinese Learning Dataset
            ↓
    Vocabulary / Hanzi Content
            ↓
    Learning Engine
            ↓
    User practices
            ↓
    User submits answer
            ↓
    Answer Normalization
            ↓
    Answer Validation
            ↓
    Learning Progress

The primary goal of CL-01A is to establish the data and answer-validation foundation required for future vocabulary practice, quizzes, review, and other Mandarin-learning features.

This phase does NOT implement the complete quiz engine.

---

# 2. Core Product Principle

OmniLife Chinese Learning should behave as a **learning system**, not merely as a vocabulary note-taking system.

The application should provide the linguistic content.

The user should focus on:

- learning
- practicing
- answering
- reviewing
- improving

The user should NOT be required to manually enter basic linguistic information such as:

- Hanzi
- Pinyin
- Pinyin tone
- Meaning
- Example sentence

for system-provided vocabulary.

---

# 3. Existing Application Must Not Break

Before implementation:

1. Inspect the current OmniLife architecture.
2. Inspect the completed CL-01 implementation.
3. Inspect current Chinese Learning models.
4. Inspect persistence/database architecture.
5. Inspect state management.
6. Inspect localization.
7. Inspect existing design system.
8. Inspect current navigation and routing.
9. Inspect existing test conventions.

Follow the existing OmniLife architecture wherever possible.

Do NOT create a second persistence architecture.

Do NOT introduce a second state-management architecture without a strong technical reason.

Do NOT rewrite unrelated modules.

---

# 4. Important Architectural Change

CL-01 introduced a basic `Vocabulary` model.

CL-01A must evolve the conceptual model.

The application must distinguish between:

    Chinese Content

and:

    User Learning Data

These are NOT the same thing.

---

# 5. Chinese Content vs User Learning Data

## 5.1 Chinese Content

This represents linguistic information supplied by the application.

Examples:

    你
    nǐ
    ni
    kamu / Anda
    你好吗？
    Nǐ hǎo ma?
    Apa kabar?

This data should not belong to an individual user's learning progress.

---

## 5.2 User Learning Data

This represents how the user interacts with the content.

Examples:

    timesSeen
    timesCorrect
    timesWrong
    mastery
    lastReviewedAt
    nextReviewAt

The architecture should allow:

    Chinese Content
            +
    User Learning Data

without duplicating the actual linguistic content unnecessarily.

---

# 6. Recommended Conceptual Architecture

Use the following conceptual relationship:

    Chinese Content
          │
          ├── ChineseWord
          ├── HanziCharacter
          └── ExampleSentence
                  │
                  ▼
           Learning Record
                  │
                  ├── timesSeen
                  ├── correctCount
                  ├── wrongCount
                  ├── mastery
                  └── review information

The exact implementation must follow the existing OmniLife architecture.

Do not blindly create every entity as a separate database table if the existing architecture has a better equivalent.

---

# 7. Chinese Word Model

Create or refactor the existing vocabulary model into a system-oriented Chinese word/content model.

Suggested conceptual structure:

    ChineseWord
    │
    ├── id
    ├── hanzi
    ├── pinyin
    ├── pinyinNormalized
    ├── tone
    ├── meanings
    ├── exampleSentences
    ├── hskLevel
    ├── partOfSpeech
    ├── tags
    ├── createdAt
    └── updatedAt

Not every field must be mandatory.

The architecture must remain extensible.

---

# 8. Pinyin Representation

Pinyin must be stored in multiple useful representations.

Example:

    Hanzi:
    你

    Canonical Pinyin:
    nǐ

    Normalized Pinyin:
    ni

    Tone:
    3

The canonical Pinyin is the linguistically correct representation.

The normalized Pinyin is intended for answer comparison.

Do NOT replace canonical Pinyin with normalized Pinyin.

---

# 9. Pinyin Tone Model

The system must support the five practical tone states:

    Tone 1
    Tone 2
    Tone 3
    Tone 4
    Neutral Tone

Represent them in a stable internal form.

Suggested conceptual enum:

    PinyinTone
    ├── tone1
    ├── tone2
    ├── tone3
    ├── tone4
    └── neutral

Use the project's existing enum/model conventions where applicable.

---

# 10. Tone Input Engine

Implement a reusable Pinyin Tone Input Engine.

This is one of the most important features of CL-01A.

The purpose is to allow the user to type ordinary Latin letters without requiring tone marks.

Example:

    User types:

    ni

    User selects:

    Tone 3

    System produces:

    nǐ

The user does NOT need to type:

    nǐ

manually.

---

# 11. Tone Input UI

The reusable input component should conceptually provide:

    Tone

    [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ Neutral ]

    Pinyin

    [ ni________________ ]

    Preview

    nǐ

    [ Check ]

The exact visual design must follow the existing OmniLife design system.

Do not hardcode colors or styles that conflict with OmniLife's current theme.

---

# 12. Tone Selection Behavior

When the user selects Tone 1:

    hao

should preview as:

    hāo

When the user selects Tone 2:

    hao

should preview as:

    háo

When the user selects Tone 3:

    hao

should preview as:

    hǎo

When the user selects Tone 4:

    hao

should preview as:

    hào

When the user selects Neutral:

    ma

should remain:

    ma

The engine must use correct Pinyin tone-mark placement rules.

Do NOT simply append a tone symbol to the end of the string.

---

# 13. Real-Time Preview

The Pinyin Tone Input Engine should provide real-time preview when practical.

Example:

    User input:
    ni

    Selected tone:
    3

    Preview:
    nǐ

If the input is incomplete or invalid:

    Preview:
    —

or another appropriate non-error placeholder.

Do not crash.

---

# 14. Tone Mark Placement

The engine must account for standard Pinyin tone-mark placement.

For example:

    hao + Tone 3
    ↓
    hǎo

    ni + Tone 3
    ↓
    nǐ

    xue + Tone 2
    ↓
    xué

Do not implement a simplistic "accent the last vowel" algorithm.

Use proper Pinyin vowel-priority rules.

The implementation should be isolated into a reusable utility/service so it can be tested independently.

---

# 15. Pinyin Normalization

Implement a reusable Pinyin normalization function.

Its purpose is to make answer validation tolerant of tone-mark differences.

Example:

    nǐ
    ↓
    ni

The canonical stored value remains:

    nǐ

The normalized comparison value becomes:

    ni

---

# 16. Normalization Rules

At minimum, normalization should:

1. Convert text to lowercase.
2. Normalize Unicode representation where appropriate.
3. Remove Pinyin tone marks.
4. Trim unnecessary whitespace.
5. Normalize repeated whitespace where appropriate.
6. Produce a stable comparison representation.

Example:

    Nǐ
    nǐ
    NI
    ni

should normalize to:

    ni

Do not modify the original user-visible text.

Normalization must be used only for comparison.

---

# 17. Pinyin Answer Validation

Create a reusable answer validator for Pinyin.

Example:

    Target:

    nǐ

    User:

    ni

Result:

    Correct

Another example:

    Target:

    nǐ

    User:

    NI

Result:

    Correct

The validator should compare normalized representations when the current exercise does not require tone.

---

# 18. Tone-Aware Validation

The architecture must also support a stricter tone-aware mode.

Example:

    Target:

    nǐ

    User input:

    ni

    Selected tone:

    3

Generated answer:

    nǐ

Result:

    Correct

If the user chooses Tone 2:

    ní

Result:

    Incorrect

Correct answer:

    nǐ

This capability will be used by future quiz/practice systems.

---

# 19. Validation Modes

Prepare the architecture for at least these modes:

### Mode A — Pinyin Without Tone

User only needs to provide the correct alphabetic Pinyin.

Example:

    Target:
    nǐ

    User:
    ni

    Result:
    Correct

---

### Mode B — Pinyin With Tone

User must provide:

    Pinyin letters
    +
    correct tone

Example:

    Target:
    nǐ

    User:
    ni

    Tone:
    3

    Result:
    Correct

---

### Mode C — Future Extension

The architecture should remain open for future input types such as:

    tone number input
    tone mark input
    keyboard input
    voice input

Do not implement voice input in CL-01A.

---

# 20. Hanzi Validation

Hanzi answers must be stricter than Pinyin.

Example:

    Target:
    你

    User:
    你

    Result:
    Correct

But:

    Target:
    你

    User:
    您

    Result:
    Incorrect

Do not treat visually similar but different Hanzi as automatically correct.

---

# 21. Meaning Validation

Meaning validation should allow multiple accepted meanings.

Example:

    Chinese:
    你

    Accepted meanings:

    kamu
    Anda
    you

A user answer matching one of the accepted meanings should be considered correct.

Comparison should be tolerant of:

- capitalization
- surrounding whitespace
- minor formatting differences

Do not make the system excessively permissive.

---

# 22. Accepted Answers

The architecture should support explicit accepted answers.

Example:

    ChineseWord
        hanzi:
        你

        pinyin:
        nǐ

        meanings:
        - kamu
        - Anda
        - you

This allows future vocabulary to have multiple legitimate translations.

Do not rely exclusively on a single string comparison for meanings.

---

# 23. Example Sentences

Example sentences should be part of the system-provided Chinese content.

Example:

    Hanzi:
    你

    Pinyin:
    nǐ

    Meaning:
    kamu / Anda

    Example:
    你好吗？

    Example Pinyin:
    Nǐ hǎo ma?

    Example Meaning:
    Apa kabar?

The user should not need to manually create this information for system-provided content.

---

# 24. Dataset Strategy

The dataset must be treated as application content.

The initial implementation should support seeded/static dataset content using the project's existing architecture.

The dataset should NOT be generated randomly by an AI model every time the application starts.

The application needs deterministic linguistic content.

Future dataset expansion may support:

    local JSON
    bundled assets
    database seed
    migration
    remote dataset import

Use whichever approach best fits the existing OmniLife architecture.

Do not add an external API dependency merely to provide the initial dataset.

---

# 25. Initial Dataset

Implement a small starter dataset sufficient to verify the architecture.

Do NOT attempt to manually create thousands of vocabulary entries in this phase.

The starter dataset should contain enough examples to test:

- different Pinyin tones
- neutral tone
- multiple meanings
- example sentences
- Hanzi validation
- Pinyin normalization

Include representative examples such as:

    你
    我
    他
    她
    好
    学
    生

Additional entries may be added if needed for testing.

The exact dataset size should remain small and maintainable.

---

# 26. Dataset Quality

Do not fabricate linguistic information merely to increase dataset size.

For the initial implementation:

- use carefully verified entries
- ensure Hanzi and Pinyin correspond
- ensure tone values correspond to canonical Pinyin
- ensure example sentences are valid
- ensure translations are reasonable

If a larger authoritative dataset is required later, that should be handled as a dedicated dataset preparation phase.

---

# 27. Content vs Progress

Do not store user learning progress directly inside the canonical Chinese content object if doing so would make the content user-specific.

Conceptually:

    ChineseWord
        ↓
    UserLearningRecord

Example:

    ChineseWord
        id: 001
        hanzi: 你
        pinyin: nǐ
        meaning: kamu / Anda

    UserLearningRecord
        wordId: 001
        timesSeen: 12
        correctCount: 10
        wrongCount: 2
        mastery: 0.82

This allows the same content architecture to support future users or datasets without contaminating canonical content with personal progress.

---

# 28. User Learning Record

Create or prepare a model for user-specific learning state.

Suggested conceptual model:

    UserLearningRecord
    │
    ├── id
    ├── contentId
    ├── timesSeen
    ├── correctCount
    ├── wrongCount
    ├── mastery
    ├── lastReviewedAt
    ├── nextReviewAt
    └── updatedAt

Do not implement a sophisticated spaced-repetition algorithm yet.

The model only needs to be ready for future phases.

---

# 29. Mastery

The system may maintain a simple mastery representation.

For CL-01A, it may be:

    0.0 → 1.0

or another representation already used by OmniLife.

Do not over-engineer mastery calculations.

If mastery is not yet used by any feature, it may remain initialized to:

    0

The actual learning algorithm belongs to a future phase.

---

# 30. No Manual Linguistic Data Entry

For system-provided vocabulary, do NOT present a form requiring the user to enter:

    Hanzi
    Pinyin
    Meaning
    Example Sentence

The user should interact with the data through learning activities instead.

If OmniLife later supports personal/custom vocabulary, that may be implemented separately.

Custom vocabulary must remain conceptually distinct from the canonical system dataset.

---

# 31. Custom Vocabulary Compatibility

The architecture should remain open for a future feature:

    My Vocabulary

This may allow the user to add:

    Hanzi
    Pinyin
    Meaning
    Notes

However, CL-01A does NOT need to implement custom vocabulary entry.

Do not allow custom vocabulary requirements to complicate the system-provided dataset architecture.

---

# 32. Pinyin Engine API Concept

Create a reusable service/util layer conceptually similar to:

    PinyinEngine

Potential responsibilities:

    normalizePinyin()
    removeToneMarks()
    applyTone()
    generateToneMarkedPinyin()
    validatePinyin()
    comparePinyin()

Use the project's existing architecture and naming conventions.

Do not expose unnecessary implementation details to UI components.

The UI should call the engine rather than implementing tone logic itself.

---

# 33. Answer Validator API Concept

Create a reusable validation layer conceptually similar to:

    ChineseAnswerValidator

Potential responsibilities:

    validatePinyin()
    validateToneAwarePinyin()
    validateHanzi()
    validateMeaning()
    normalizeAnswer()

The exact architecture should follow existing OmniLife conventions.

Do not duplicate validation logic across multiple screens.

---

# 34. Pinyin Engine Testing

Create unit tests for:

### Tone 1

    hao → hāo

### Tone 2

    hao → háo

### Tone 3

    hao → hǎo

### Tone 4

    hao → hào

### Neutral

    ma → ma

Also test:

    ni + tone 3 → nǐ

and other representative syllables.

Test tone placement rules, not just one hardcoded example.

---

# 35. Normalization Testing

Test:

    nǐ → ni
    Nǐ → ni
    NI → ni
    ni → ni

Also test whitespace normalization.

Ensure canonical Pinyin is not permanently modified.

---

# 36. Answer Validation Testing

Test:

    Target: nǐ
    User: ni
    Mode: no-tone
    Result: correct

Test:

    Target: nǐ
    User: ni
    Tone: 3
    Result: correct

Test:

    Target: nǐ
    User: ni
    Tone: 2
    Result: incorrect

Test Hanzi:

    Target: 你
    User: 你
    Result: correct

    Target: 你
    User: 您
    Result: incorrect

Test meanings:

    Target meanings:
    kamu
    Anda
    you

    User:
    kamu

    Result:
    correct

---

# 37. Localization

All new user-facing strings must use OmniLife's localization architecture.

At minimum:

    Indonesian
    English

Possible UI strings include:

    Tone
    Neutral
    Pinyin
    Preview
    Correct
    Incorrect
    Try Again
    Your Answer
    Correct Answer

Do not hardcode these strings into widgets.

---

# 38. UI Requirements

CL-01A should implement only the reusable UI needed to demonstrate the engine.

The primary component should be:

    PinyinToneInput

It should support:

    tone selection
    alphabetic Pinyin input
    real-time preview
    clear/reset behavior
    validation state

It does NOT need to become a complete quiz screen.

---

# 39. Input Behavior

The user should be able to:

1. Select a tone.
2. Type normal Latin alphabet Pinyin.
3. See the tone-marked preview.
4. Change the tone.
5. See the preview update.
6. Clear the input.
7. Submit the answer when used by a future learning screen.

Example:

    User enters:
    ni

    Selects:
    3

    Preview:
    nǐ

Change to:

    2

Preview:

    ní

---

# 40. Input Restrictions

Do not make the keyboard require special Unicode characters.

The primary input should accept normal alphabetic characters.

The system itself generates tone marks.

This is a deliberate UX decision.

---

# 41. Mobile Compatibility

The Pinyin input system must work on:

    Desktop
    Mobile
    Tablet

The user should not be required to access a special Chinese keyboard just to enter Pinyin.

---

# 42. Accessibility

Tone buttons must have:

- accessible labels
- clear selected state
- keyboard accessibility where applicable
- adequate touch targets
- visible focus state

Do not communicate tone selection only through color.

---

# 43. Performance

Pinyin normalization and tone generation should be lightweight.

Do not perform expensive operations on every keystroke if unnecessary.

The implementation should remain responsive during real-time input.

---

# 44. Error Handling

Invalid or incomplete input must not crash the application.

Examples:

    Empty input
    Invalid characters
    Unsupported syllable
    Invalid tone combination

The engine should return a safe result or validation state.

Do not throw unhandled exceptions into the UI.

---

# 45. What CL-01A Must NOT Implement

Explicitly out of scope:

    ❌ Complete vocabulary quiz engine
    ❌ Spaced repetition algorithm
    ❌ HSK progression system
    ❌ Listening engine
    ❌ Speech recognition
    ❌ Pronunciation scoring
    ❌ AI Tutor
    ❌ AI-generated lessons
    ❌ AI-generated vocabulary
    ❌ Complete Hanzi writing board
    ❌ Advanced analytics
    ❌ Full Chinese grammar system
    ❌ Full Chinese dataset
    ❌ Remote Chinese content API

These belong to later phases.

---

# 46. Integration With CL-01

CL-01A must build upon the existing CL-01 foundation.

Do NOT discard working CL-01 functionality unnecessarily.

Existing components that remain useful should be preserved.

Refactor only where necessary to support:

    system-provided content
    learning records
    Pinyin engine
    answer validation

---

# 47. Implementation Procedure

Antigravity must follow this order.

### Step 1 — Inspect

Inspect the completed CL-01 implementation.

Identify:

- Vocabulary model
- Hanzi model
- Chinese Note model
- Learning Progress
- Study Session
- persistence
- localization
- navigation
- design system
- state management
- tests

---

### Step 2 — Refactor Content Architecture

Separate:

    Chinese Content

from:

    User Learning Data

Do not duplicate existing architecture unnecessarily.

---

### Step 3 — Implement ChineseWord

Implement or refactor the vocabulary model according to the requirements in this document.

Ensure support for:

    hanzi
    pinyin
    pinyinNormalized
    tone
    meanings
    example sentences

---

### Step 4 — Implement Learning Record

Create the foundation for user-specific learning progress.

---

### Step 5 — Implement Pinyin Tone Model

Implement the five tone states:

    1
    2
    3
    4
    Neutral

---

### Step 6 — Implement Pinyin Engine

Implement:

    normalizePinyin()
    removeToneMarks()
    applyTone()
    generateToneMarkedPinyin()

Use correct Pinyin tone-placement rules.

---

### Step 7 — Implement Answer Validator

Implement:

    Pinyin validation
    Tone-aware Pinyin validation
    Hanzi validation
    Meaning validation

---

### Step 8 — Implement Starter Dataset

Add a small deterministic dataset.

Ensure the dataset is sufficient to test:

    multiple tones
    neutral tone
    multiple meanings
    example sentences
    Pinyin normalization

---

### Step 9 — Implement PinyinToneInput

Create the reusable UI component.

---

### Step 10 — Localization

Add all new strings to the existing localization system.

---

### Step 11 — Tests

Add unit tests for:

    data models
    tone conversion
    tone placement
    normalization
    validation
    accepted meanings

---

### Step 12 — Static Analysis

Run:

    flutter analyze

Resolve all errors and warnings introduced by CL-01A.

---

### Step 13 — Tests

Run the existing project test suite.

---

### Step 14 — Application Test

Run OmniLife and manually verify:

    Chinese Learning
        ↓
    Pinyin input component
        ↓
    Tone selection
        ↓
    Preview
        ↓
    Validation

---

### Step 15 — Regression Check

Verify that:

- existing OmniLife modules still work
- CL-01 functionality still works
- localization still works
- persistence still works
- navigation still works

---

# 48. Definition of Done

CL-01A is complete only when:

- [ ] Chinese content is separated conceptually from user learning progress.
- [ ] System-provided vocabulary exists.
- [ ] User does not need to manually enter basic linguistic data for system vocabulary.
- [ ] ChineseWord supports canonical Pinyin.
- [ ] ChineseWord supports normalized Pinyin.
- [ ] ChineseWord supports tone information.
- [ ] Multiple meanings are supported.
- [ ] Example sentences are supported.
- [ ] UserLearningRecord foundation exists.
- [ ] Tone 1 exists.
- [ ] Tone 2 exists.
- [ ] Tone 3 exists.
- [ ] Tone 4 exists.
- [ ] Neutral tone exists.
- [ ] Pinyin tone generation works.
- [ ] Tone placement follows proper Pinyin rules.
- [ ] Pinyin normalization works.
- [ ] Pinyin answer validation works.
- [ ] Tone-aware validation works.
- [ ] Hanzi validation works.
- [ ] Meaning validation supports accepted answers.
- [ ] PinyinToneInput exists.
- [ ] Real-time preview works.
- [ ] Indonesian localization works.
- [ ] English localization works.
- [ ] Unit tests pass.
- [ ] `flutter analyze` passes.
- [ ] Existing OmniLife features continue to work.
- [ ] Application runs successfully.

---

# 49. Final Architecture After CL-01A

The conceptual architecture should now be:

    OmniLife
    │
    └── Chinese Learning
        │
        ├── Chinese Content
        │   │
        │   ├── ChineseWord
        │   ├── HanziCharacter
        │   └── ExampleSentence
        │
        ├── Learning Data
        │   │
        │   └── UserLearningRecord
        │
        ├── Learning Engine Foundation
        │   │
        │   ├── PinyinEngine
        │   └── ChineseAnswerValidator
        │
        └── UI Foundation
            │
            └── PinyinToneInput

Future:

    Chinese Content
          ↓
    Learning Engine
          ↓
    Practice
          ↓
    Quiz
          ↓
    Review
          ↓
    Progress
          ↓
    AI Tutor

---

# 50. Final Instruction to Antigravity

CL-01A is a **foundation extension**, not a feature-complete learning system.

Prioritize:

    Correctness
    >
    Maintainability
    >
    Reusability
    >
    Data Integrity
    >
    User Experience
    >
    Future Extensibility

Most importantly:

The user should NOT need to manually provide the linguistic fundamentals of system-provided Chinese vocabulary.

The application should provide:

    Hanzi
    Pinyin
    Tone
    Meaning
    Example Sentence

The user should then interact with the content through learning activities.

The Pinyin input system must make tone input easy:

    User types:
    ni

    User selects:
    Tone 3

    System produces:
    nǐ

The tone engine and answer validator must be reusable by future learning modes.

Do not implement future systems prematurely.

Do not modify unrelated OmniLife modules unless required for integration.

---

# End of CL-01A

Next planned phase:

CL-02 — Chinese Vocabulary Library & Learning Interface
# OmniLife — Chinese Learning CL-02
## Chinese Vocabulary Library & Learning Interface

**Project:** OmniLife  
**Module:** Chinese Learning  
**Tier:** Tier 1 — Core Learning  
**Phase:** CL-02  
**Status:** Implementation Ready  
**Implementation Target:** Antigravity AI Agent  
**Depends On:** CL-01 — Chinese Learning Foundation  
**Depends On:** CL-01A — Chinese Dataset & Pinyin Learning Engine

---

## 1. Objective

Implement the first fully usable Chinese Learning content interface.

CL-01 established the Chinese Learning foundation.

CL-01A established:

- system-provided Chinese content
- separation between content and user learning data
- Pinyin normalization
- Pinyin tone generation
- tone-aware validation
- accepted meanings
- PinyinToneInput
- UserLearningRecord foundation

CL-02 now turns that foundation into a usable learning interface.

The main goal is to allow the user to:

- browse Chinese vocabulary
- search vocabulary
- inspect vocabulary details
- understand each word
- see Hanzi
- see Pinyin
- see tone
- see meanings
- see example sentences
- see learning status
- begin learning/practice from vocabulary
- distinguish new vocabulary from learned vocabulary

This phase is still NOT the complete quiz/review system.

---

# 2. Core Product Philosophy

Chinese Learning should feel like:

    A personal Mandarin learning environment

not:

    A dictionary
    +
    A notes application

The user should be able to open Chinese Learning and immediately understand:

    What am I learning?

    What vocabulary do I have?

    What do I already know?

    What should I learn next?

The interface must remain simple despite the eventual complexity of the Chinese Learning module.

---

# 3. Important Architecture Rule

Do NOT create a new architecture for CL-02.

Use the architecture established by:

    CL-01
        +
    CL-01A

Especially preserve:

    Chinese Content
            +
    User Learning Data
            ↓
    Learning Interface

Do not put personal progress directly into canonical Chinese content.

---

# 4. Existing Application Must Not Break

Before implementation:

1. Inspect completed CL-01.
2. Inspect completed CL-01A.
3. Inspect ChineseWord.
4. Inspect HanziCharacter.
5. Inspect UserLearningRecord.
6. Inspect PinyinEngine.
7. Inspect ChineseAnswerValidator.
8. Inspect PinyinToneInput.
9. Inspect persistence.
10. Inspect state management.
11. Inspect localization.
12. Inspect design system.
13. Inspect routing/navigation.
14. Inspect existing responsive conventions.

Follow existing OmniLife patterns.

Do not rewrite unrelated systems.

---

# 5. Vocabulary Library

Create a dedicated:

    Vocabulary Library

inside:

    Chinese Learning

The Vocabulary Library is the main place where the user can browse the Chinese content provided by OmniLife.

Conceptual navigation:

    Chinese Learning
        ↓
    Vocabulary
        ↓
    Vocabulary Library

---

# 6. Vocabulary Library Goals

The library must allow the user to quickly:

- browse vocabulary
- search vocabulary
- filter vocabulary
- sort vocabulary
- identify learning status
- open vocabulary details
- begin studying a word

The library should eventually support a large dataset.

Design it to scale beyond the small starter dataset.

---

# 7. Vocabulary List

Display vocabulary using a reusable list/card component.

A vocabulary item should show enough information to identify the word without overwhelming the user.

Suggested layout:

    ┌──────────────────────────────────────┐
    │ 你                                   │
    │ nǐ                                   │
    │ kamu / Anda                          │
    │                                      │
    │ ● New                                │
    └──────────────────────────────────────┘

The exact visual design must follow OmniLife's design system.

Do not blindly copy this layout.

---

# 8. Vocabulary Card Information

The vocabulary card may show:

    Hanzi
    Pinyin
    Primary meaning
    Learning status

Optional information:

    HSK level
    Part of speech
    tags

Do not overcrowd the card.

Detailed information belongs on the vocabulary detail screen.

---

# 9. Vocabulary Detail Screen

Create a dedicated detail screen for each vocabulary item.

Example conceptual structure:

    ┌─────────────────────────────────────────┐
    │                                         │
    │                  你                     │
    │                                         │
    │                 nǐ                      │
    │                                         │
    │            kamu / Anda                  │
    │                                         │
    ├─────────────────────────────────────────┤
    │                                         │
    │ Example                                 │
    │                                         │
    │ 你好吗？                                │
    │ Nǐ hǎo ma?                              │
    │ Apa kabar?                              │
    │                                         │
    ├─────────────────────────────────────────┤
    │                                         │
    │ Learning Status                         │
    │ New                                     │
    │                                         │
    ├─────────────────────────────────────────┤
    │                                         │
    │ [ Start Practice ]                      │
    │                                         │
    └─────────────────────────────────────────┘

The exact design should follow the existing OmniLife design language.

---

# 10. Vocabulary Detail Information

Where available, display:

    Hanzi
    Pinyin
    Meaning
    Example sentence
    Example Pinyin
    Example translation
    HSK level
    Part of speech
    Tags
    Learning status

Do not display empty fields unnecessarily.

If a field does not exist:

    hide it

or:

    show an intentional empty state

Do not show:

    null
    undefined
    empty labels

---

# 11. Pinyin Display

Canonical Pinyin should be displayed with tone marks.

Example:

    nǐ

NOT:

    ni

The normalized Pinyin representation is for comparison and validation.

It should not replace the canonical representation in normal learning UI.

---

# 12. Pinyin Interaction

Where appropriate, allow the user to access the existing PinyinToneInput component.

However:

CL-02 does NOT implement the complete quiz engine.

The PinyinToneInput should only be used where it makes sense as a learning interaction or preview.

Do not create duplicate Pinyin input logic.

---

# 13. Meaning Display

A word may contain multiple meanings.

Example:

    你

    Meanings:
    - kamu
    - Anda
    - you

The UI should display multiple meanings cleanly.

Do not force the user to select one "official" translation when the dataset contains multiple valid meanings.

---

# 14. Example Sentences

Example sentences are part of the provided Chinese content.

Display:

    Hanzi sentence

    Pinyin sentence

    Translation

Example:

    你好吗？

    Nǐ hǎo ma?

    Apa kabar?

The UI should make the hierarchy obvious.

---

# 15. Search

Implement vocabulary search.

The user should be able to search using at least:

    Hanzi
    Pinyin
    Meaning

Examples:

Searching:

    你

should find:

    你

Searching:

    ni

should find:

    你

Searching:

    kamu

should find:

    你

---

# 16. Search Behavior

Search should be tolerant of Pinyin tone differences.

For example:

    nǐ

and:

    ni

should be able to identify the same vocabulary.

Use the normalization functionality from CL-01A.

Do not duplicate normalization logic inside the UI.

---

# 17. Search Input

Create a clear search field.

Suggested placeholder:

### Indonesian

    Cari Hanzi, Pinyin, atau arti...

### English

    Search Hanzi, Pinyin, or meaning...

Use localization.

Do not hardcode strings.

---

# 18. Search Performance

The library may eventually contain thousands of vocabulary items.

Avoid performing unnecessarily expensive operations on every keystroke.

Follow the existing application's data-access patterns.

If the existing persistence layer supports efficient querying:

    use it.

If the current dataset is small:

    in-memory filtering is acceptable.

Do not prematurely introduce a search engine.

---

# 19. Filtering

Prepare vocabulary filters.

At minimum, support:

    All
    New
    Learning
    Familiar
    Mastered

The exact implementation may use tabs, chips, segmented controls, dropdowns, or another existing OmniLife component.

Follow the design system.

---

# 20. Learning Status

Introduce a simple user-facing learning status.

Recommended states:

    New
    Learning
    Familiar
    Mastered

These states represent a simple learning progression.

They are NOT a complete spaced repetition algorithm.

---

# 21. Status Definitions

### New

The user has not meaningfully studied the vocabulary yet.

Conceptually:

    timesSeen = 0

---

### Learning

The user has started encountering the word but has not demonstrated strong retention.

---

### Familiar

The user has demonstrated repeated successful recall.

---

### Mastered

The user has demonstrated strong and consistent knowledge.

The exact thresholds should be simple and deterministic for CL-02.

Do not implement complex adaptive algorithms yet.

---

# 22. Status Calculation

Create a reusable status calculation layer rather than scattering conditions across UI widgets.

Conceptually:

    LearningStatusCalculator

or equivalent architecture.

The exact implementation must follow OmniLife conventions.

Example conceptual logic:

    No interactions
        ↓
    New

    Some interactions
        ↓
    Learning

    Repeated successful answers
        ↓
    Familiar

    Strong consistent performance
        ↓
    Mastered

The exact thresholds may be kept simple.

Document any chosen thresholds in code or architecture documentation.

---

# 23. User Learning Record Integration

CL-02 should consume the existing:

    UserLearningRecord

from CL-01A.

The UI should derive status from learning data.

Do not duplicate:

    timesSeen
    correctCount
    wrongCount

inside the vocabulary card.

The card should receive the calculated state.

---

# 24. Learning Progress

The Vocabulary Library should show lightweight progress information.

Possible examples:

    12 New
    8 Learning
    4 Familiar
    2 Mastered

Do not create an advanced analytics dashboard yet.

The purpose is simply to provide orientation.

---

# 25. Vocabulary Overview

At the top of the library, provide a lightweight overview.

Conceptually:

    Chinese Vocabulary

    26 words

    12 New
    8 Learning
    4 Familiar
    2 Mastered

The actual values must come from real data.

Never fabricate statistics.

---

# 26. Empty State

If the dataset is unavailable:

    No vocabulary available yet.

Provide an appropriate explanation.

If the dataset exists but a filter has no results:

    No vocabulary matches this filter.

If search has no results:

    No vocabulary found.

Do not show a blank page.

---

# 27. Vocabulary Sorting

Prepare sorting options.

Recommended:

    Recently Added
    Alphabetical / Hanzi
    Learning Status
    HSK Level

Not every option must be implemented if the underlying dataset does not yet support it.

Do not create fake sorting.

---

# 28. HSK Level

If the dataset includes HSK information, allow the library to filter or group by HSK level.

Possible future structure:

    HSK 1
    HSK 2
    HSK 3
    HSK 4
    HSK 5
    HSK 6
    HSK 7-9

Do not require the entire HSK dataset in CL-02.

Do not fabricate HSK classifications.

---

# 29. Part of Speech

If available, display part of speech.

Examples:

    noun
    verb
    adjective
    adverb
    pronoun
    measure word

Use the dataset's actual data.

Do not generate linguistic classifications dynamically with AI.

---

# 30. Tags

If the dataset supports tags, allow vocabulary to display relevant tags.

Examples:

    Daily Life
    School
    Family
    Food
    Travel
    Basic
    Grammar

Do not make tagging a major feature of CL-02.

---

# 31. Start Practice Action

Vocabulary detail should provide:

    Start Practice

This action should integrate with the future practice architecture.

For CL-02, it may:

- open a prepared placeholder practice screen
- or show a clearly labeled "Practice coming next" state

Do NOT build a full quiz engine inside CL-02.

Do NOT create fake quiz behavior.

---

# 32. Learning Action

The user should be able to mark or begin learning vocabulary in a controlled manner.

However, do not create manual "Mastered" toggles that bypass the learning system unless there is a strong UX reason.

The preferred future flow is:

    Study
        ↓
    Practice
        ↓
    Answer
        ↓
    Learning Record
        ↓
    Status

CL-02 should prepare the UI for this flow.

---

# 33. Vocabulary Detail — Learning Information

The detail page should show the user's current learning status.

Example:

    Learning Status

    ● Learning

Optional future information:

    Times practiced
    Accuracy
    Last reviewed
    Next review

Only show values that are actually available.

Do not expose internal technical fields unnecessarily.

---

# 34. Responsive Design

The Vocabulary Library must work on:

    Desktop
    Tablet
    Mobile

Desktop may use:

    Sidebar
    Search
    Filter row
    Multi-column vocabulary cards

Mobile may use:

    Compact header
    Search field
    Horizontal filter chips
    Single-column list

Follow OmniLife's existing responsive patterns.

---

# 35. Mobile Priority

The mobile layout should not be treated as a compressed desktop layout.

The primary interactions must remain easy:

    Search
    Filter
    Open vocabulary
    Read Hanzi
    Read Pinyin
    Start learning

Do not make important controls too small.

---

# 36. Hanzi Presentation

Hanzi is the primary visual element.

Use typography that:

- supports Chinese characters correctly
- remains readable
- works across supported platforms
- supports appropriate CJK fallback

Do not use an oversized Hanzi font everywhere.

The detail page may use a larger display size.

---

# 37. Visual Hierarchy

Recommended hierarchy:

    Hanzi
        ↓
    Pinyin
        ↓
    Meaning
        ↓
    Example
        ↓
    Metadata
        ↓
    Learning Status

The interface should make this hierarchy visually obvious.

---

# 38. Design System

Use the existing OmniLife:

- typography
- spacing
- color system
- cards
- buttons
- chips
- icons
- navigation
- dialogs
- theme
- responsive rules

Do not introduce an unrelated design system.

Chinese Learning should feel like OmniLife.

---

# 39. Localization

All user-facing text must use OmniLife's localization architecture.

Required:

    Indonesian
    English

Examples:

### Indonesian

    Kosakata
    Cari Hanzi, Pinyin, atau arti...
    Baru
    Sedang Dipelajari
    Familiar
    Dikuasai
    Mulai Latihan

### English

    Vocabulary
    Search Hanzi, Pinyin, or meaning...
    New
    Learning
    Familiar
    Mastered
    Start Practice

Do not hardcode these strings.

---

# 40. Accessibility

Ensure:

- readable text
- sufficient contrast
- accessible search
- accessible filter controls
- accessible buttons
- keyboard navigation where appropriate
- semantic labels
- sufficient touch targets

Do not rely only on color to communicate learning status.

---

# 41. Performance

The Vocabulary Library should be able to scale to thousands of vocabulary entries.

Use:

- lazy lists where appropriate
- efficient state updates
- efficient filtering
- efficient database access

Do not load unnecessary data for every card if the architecture supports partial retrieval.

---

# 42. Persistence

Vocabulary content should use the persistence/content architecture established in CL-01A.

Learning status must use:

    UserLearningRecord

Ensure that:

- opening a vocabulary does not accidentally modify progress
- browsing does not automatically mark a word as mastered
- state changes are persisted correctly

---

# 43. Data Integrity

Canonical Chinese content must not be accidentally overwritten by user learning interactions.

For example:

    User answers:
    ni

This must NOT modify:

    ChineseWord.pinyin

The canonical value remains:

    nǐ

Only the user's interaction/progress should change.

---

# 44. Error Handling

Handle:

- missing vocabulary
- deleted/invalid content
- failed persistence
- search failures
- invalid filters
- unexpected learning records

Do not crash the entire application.

Provide user-friendly error states.

---

# 45. No AI Dependency

CL-02 must NOT require an AI API.

The Vocabulary Library must work fully offline using the local Chinese dataset.

Do not call:

    Groq
    OpenAI
    Gemini
    local LLM
    any external AI API

for normal vocabulary browsing.

AI integration belongs to a future Chinese Learning phase.

---

# 46. No Internet Dependency

The basic Vocabulary Library should work without an internet connection.

The user must be able to:

- open vocabulary
- search vocabulary
- filter vocabulary
- inspect details

while offline.

---

# 47. Testing

Implement appropriate tests.

## 47.1 Vocabulary List Test

Verify that vocabulary from the dataset appears.

---

## 47.2 Search Test

Verify:

    你

finds:

    你

Verify:

    ni

can find:

    你

Verify:

    kamu

can find:

    你

---

## 47.3 Pinyin Search Test

Verify tone normalization.

For example:

    nǐ

and:

    ni

should resolve to the same vocabulary.

Use the CL-01A normalization engine.

---

## 47.4 Filter Test

Verify:

    All
    New
    Learning
    Familiar
    Mastered

return the correct vocabulary.

---

## 47.5 Detail Test

Verify that opening a vocabulary displays:

    Hanzi
    Pinyin
    Meaning
    Example
    Learning status

where available.

---

## 47.6 Learning Record Test

Verify that vocabulary detail correctly reads associated UserLearningRecord data.

---

## 47.7 Localization Test

Verify Indonesian and English UI strings.

---

## 47.8 Responsive Test

Verify the library remains usable on:

    Desktop
    Mobile

using the project's existing testing approach.

---

# 48. What CL-02 Must NOT Implement

Explicitly out of scope:

    ❌ Full Quiz Engine
    ❌ Full Review Engine
    ❌ Spaced Repetition Algorithm
    ❌ Advanced Learning Algorithm
    ❌ Listening System
    ❌ Speech Recognition
    ❌ Pronunciation Scoring
    ❌ AI Tutor
    ❌ AI-generated lessons
    ❌ Full HSK Dataset
    ❌ Full Grammar System
    ❌ Full Hanzi Writing System
    ❌ Advanced Analytics
    ❌ Cloud synchronization

These belong to later phases.

---

# 49. Implementation Procedure

Antigravity must follow this order.

### Step 1 — Inspect Existing Implementation

Inspect:

    CL-01
    CL-01A

Verify the current architecture before making changes.

---

### Step 2 — Inspect Data

Verify:

    ChineseWord
    HanziCharacter
    ExampleSentence
    UserLearningRecord

and the starter dataset.

---

### Step 3 — Implement Vocabulary Repository/Access Layer

Use the existing OmniLife persistence architecture.

The UI should not directly manipulate database internals.

Follow existing repository/service patterns.

---

### Step 4 — Implement Vocabulary Library

Create:

    Vocabulary Library Screen

with:

    search
    filters
    sorting where supported
    vocabulary cards/list

---

### Step 5 — Implement Search

Support:

    Hanzi
    Pinyin
    Meaning

Use the CL-01A normalization system.

---

### Step 6 — Implement Filters

Implement:

    All
    New
    Learning
    Familiar
    Mastered

---

### Step 7 — Implement Learning Status

Create or use a reusable status calculator.

Do not duplicate status logic inside widgets.

---

### Step 8 — Implement Vocabulary Detail

Create the detail screen.

Display all available canonical information.

---

### Step 9 — Implement Learning Action

Add:

    Start Practice

Connect it to the future practice flow without implementing the complete quiz engine.

---

### Step 10 — Localization

Add all new strings to:

    Indonesian
    English

---

### Step 11 — Responsive UI

Verify:

    Desktop
    Tablet
    Mobile

---

### Step 12 — Testing

Add and run tests.

---

### Step 13 — Static Analysis

Run:

    flutter analyze

Resolve all issues introduced by CL-02.

---

### Step 14 — Application Test

Run OmniLife and manually test:

    Chinese Learning
        ↓
    Vocabulary
        ↓
    Search
        ↓
    Filter
        ↓
    Open vocabulary
        ↓
    View details
        ↓
    Start Practice

---

### Step 15 — Regression Check

Verify:

- CL-01 still works
- CL-01A still works
- PinyinToneInput still works
- persistence still works
- localization still works
- existing OmniLife modules still work

---

# 50. Definition of Done

CL-02 is complete only when:

- [ ] Vocabulary Library exists.
- [ ] System-provided vocabulary is displayed.
- [ ] Vocabulary cards/list are implemented.
- [ ] Vocabulary detail screen exists.
- [ ] Hanzi is displayed.
- [ ] Canonical Pinyin is displayed.
- [ ] Meanings are displayed.
- [ ] Example sentences are displayed.
- [ ] Example Pinyin is displayed where available.
- [ ] Example translations are displayed where available.
- [ ] Search supports Hanzi.
- [ ] Search supports Pinyin.
- [ ] Search supports Meaning.
- [ ] Pinyin search is tone-tolerant.
- [ ] Learning status exists.
- [ ] New status exists.
- [ ] Learning status exists.
- [ ] Familiar status exists.
- [ ] Mastered status exists.
- [ ] Filters work.
- [ ] Learning progress is based on actual UserLearningRecord data.
- [ ] Start Practice action exists.
- [ ] No fake learning statistics are displayed.
- [ ] Indonesian localization works.
- [ ] English localization works.
- [ ] Desktop layout works.
- [ ] Mobile layout works.
- [ ] Relevant tests pass.
- [ ] `flutter analyze` passes.
- [ ] Existing OmniLife features continue to work.

---

# 51. Expected Architecture After CL-02

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
        └── Learning Engine Foundation
            │
            ├── PinyinEngine
            ├── ChineseAnswerValidator
            └── PinyinToneInput

Future:

    Vocabulary
        ↓
    Practice
        ↓
    Quiz
        ↓
    Review
        ↓
    Spaced Repetition
        ↓
    Progress
        ↓
    Listening / Speaking / Reading / Writing
        ↓
    AI Tutor

---

# 52. Final Instruction to Antigravity

CL-02 should make Chinese Learning genuinely usable for browsing and studying vocabulary.

Do not turn it into a giant feature dump.

Prioritize:

    Simplicity
    >
    Discoverability
    >
    Readability
    >
    Data Integrity
    >
    Reusability
    >
    Future Extensibility

The user should be able to open Chinese Learning and immediately understand the vocabulary available to study.

The user should NOT need to manually populate the system-provided vocabulary.

The canonical linguistic data must remain protected.

User learning activity should update:

    UserLearningRecord

not:

    ChineseWord

The Pinyin normalization and tone engine from CL-01A must be reused.

Do not duplicate logic.

Do not implement the full quiz/review engine yet.

Do not introduce an AI or internet dependency.

Do not modify unrelated OmniLife modules unless required for integration.

---

# End of CL-02

Next planned phase:

CL-03 — Chinese Practice & Quiz Engine
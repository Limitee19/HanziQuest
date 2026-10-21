# OmniLife — Chinese Learning CL-01
## Chinese Learning Foundation

**Project:** OmniLife  
**Module:** Chinese Learning  
**Tier:** Tier 1 — Foundation  
**Phase:** CL-01  
**Status:** Implementation Ready  
**Implementation Target:** Antigravity AI Agent

---

## 1. Objective

Implement the foundational architecture for a new OmniLife module called:

> **Chinese Learning**

Indonesian display name:

> **Belajar Bahasa Mandarin**

Chinese display name:

> **中文学习**

The module is intended to support the user's long-term Mandarin learning journey as a university student majoring in Mandarin Education.

This phase is **NOT** intended to implement the complete Chinese Learning system.

The purpose of this phase is to establish a clean and scalable foundation so future features can be added without restructuring the module.

---

## 2. Important Implementation Rule

Do NOT implement all Chinese Learning features yet.

This phase only establishes:

- module structure
- navigation
- routing
- architecture
- data models
- persistence foundation
- localization foundation
- reusable UI components
- empty states
- basic module dashboard shell

Do NOT implement:

- AI Tutor
- AI conversation
- HSK system
- spaced repetition algorithm
- advanced listening
- speech recognition
- pronunciation analysis
- advanced Hanzi recognition
- stroke-order engine
- advanced analytics

Those belong to later phases.

---

## 3. Product Philosophy

Chinese Learning must feel like a **native part of OmniLife**, not a separate application embedded inside it.

The module should eventually connect with:

    Chinese Learning
    │
    ├── Vocabulary
    ├── Hanzi
    ├── Pinyin
    ├── Grammar
    ├── Listening
    ├── Reading
    ├── Speaking
    ├── Notes
    ├── Review
    └── Progress
           │
           ▼
        OmniLife
           │
       ┌───┼───┐
       ▼   ▼   ▼
     Tasks Calendar Routines

The architecture must therefore be designed for future integration.

---

## 4. Existing Application Must Not Break

Before implementation:

1. Inspect the existing OmniLife architecture.
2. Inspect current navigation.
3. Inspect current routing.
4. Inspect existing design system.
5. Inspect existing localization system.
6. Inspect existing persistence/database architecture.
7. Inspect existing state-management patterns.
8. Inspect existing module conventions.

Follow existing OmniLife conventions wherever appropriate.

Do NOT introduce an unnecessary second architecture.

Do NOT replace existing infrastructure simply because another approach is technically possible.

---

## 5. Navigation

Add a new primary module:

> **Chinese Learning**

Suggested icon:

> `translate` / `menu_book` / equivalent existing icon.

Do not introduce a new icon library if OmniLife already has an icon system.

Navigation label:

### Indonesian

    Belajar Mandarin

### English

    Chinese Learning

### Chinese

    中文学习

Use the existing OmniLife localization architecture.

Do not hardcode user-facing strings.

---

## 6. Module Structure

Create a dedicated Chinese Learning module.

Suggested conceptual structure:

    Chinese Learning
    │
    ├── Dashboard
    ├── Vocabulary
    ├── Hanzi
    ├── Flashcards
    ├── Notes
    └── Progress

Only the Dashboard needs to be functional in this phase.

Other sections may be represented as placeholder/coming-soon states.

---

## 7. Dashboard Shell

Create the first Chinese Learning dashboard.

The dashboard should be clean and lightweight.

Do NOT create an overly complicated dashboard yet.

Suggested structure:

    ┌──────────────────────────────────────────┐
    │ 中文学习                                  │
    │ Chinese Learning                         │
    │                                          │
    │ Improve your Mandarin every day.         │
    │                                          │
    ├──────────────────────────────────────────┤
    │                                          │
    │ Today's Learning                         │
    │                                          │
    │ No learning activities yet               │
    │                                          │
    │ Start building your Chinese learning     │
    │ system.                                  │
    │                                          │
    │ [Add Vocabulary]                         │
    │                                          │
    ├──────────────────────────────────────────┤
    │                                          │
    │ Quick Access                             │
    │                                          │
    │ Vocabulary   Hanzi   Notes   Flashcards │
    │                                          │
    └──────────────────────────────────────────┘

The exact visual design should follow the existing OmniLife design system.

---

## 8. Dashboard Cards

Prepare reusable cards for future data.

The following cards should exist architecturally.

### Today's Learning

Future data:

- vocabulary review
- Hanzi practice
- listening
- reading
- speaking
- study session

For now, show an appropriate empty state.

---

### Vocabulary Overview

Prepare the component for future statistics:

    Vocabulary

    0 words

---

### Hanzi Overview

Prepare:

    Hanzi

    0 characters

---

### Learning Streak

Prepare:

    🔥 0 day streak

---

### Study Progress

Prepare a placeholder:

    Learning Progress

    No learning data yet.

Do not fake statistics.

---

## 9. Quick Actions

Create reusable quick-action buttons.

Initial actions:

    + Add Vocabulary
    Practice Hanzi
    Study Flashcards
    Add Note

Only actions whose underlying feature exists should be fully functional.

For features not yet implemented:

- show an appropriate placeholder
- or disable the action

Do NOT create fake functionality.

---

## 10. Vocabulary Data Model

Create the foundation for a Vocabulary entity.

Suggested conceptual model:

    Vocabulary
    │
    ├── id
    ├── hanzi
    ├── pinyin
    ├── meaning
    ├── exampleSentence
    ├── examplePinyin
    ├── exampleMeaning
    ├── notes
    ├── tags
    ├── createdAt
    └── updatedAt

Important:

The model should be extensible.

Future fields may include:

    hskLevel
    partOfSpeech
    audio
    pronunciation
    difficulty
    reviewState
    reviewHistory
    mistakes

Do NOT implement advanced review logic in this phase.

---

## 11. Hanzi Data Model

Create a foundation for individual Hanzi.

Suggested conceptual model:

    HanziCharacter
    │
    ├── id
    ├── character
    ├── pinyin
    ├── meaning
    ├── notes
    ├── tags
    ├── createdAt
    └── updatedAt

Future support should be possible for:

    strokeCount
    strokeOrder
    radical
    components
    relatedCharacters
    writingAttempts

Do not implement these advanced fields unless they naturally fit the existing architecture.

---

## 12. Learning Note Data Model

Create a dedicated Chinese Learning Note model.

Conceptually:

    ChineseNote
    │
    ├── id
    ├── title
    ├── content
    ├── category
    ├── tags
    ├── createdAt
    └── updatedAt

Possible categories:

    Vocabulary
    Grammar
    Hanzi
    Listening
    Reading
    Speaking
    Culture
    Class Notes
    Other

The category system should be extensible.

---

## 13. Learning Progress Foundation

Create a lightweight model capable of tracking future progress.

Conceptually:

    LearningProgress
    │
    ├── vocabularyCount
    ├── hanziCount
    ├── studyMinutes
    ├── completedSessions
    ├── currentStreak
    └── lastStudyDate

Do not build advanced analytics yet.

Do not fabricate progress values.

If no data exists, use:

    0

or an appropriate empty state.

---

## 14. Learning Session Foundation

Prepare a basic structure for future study sessions.

Conceptually:

    StudySession
    │
    ├── id
    ├── startedAt
    ├── endedAt
    ├── duration
    ├── activityType
    └── notes

Possible activity types:

    Vocabulary
    Hanzi
    Flashcards
    Listening
    Reading
    Speaking
    Grammar
    General

No advanced session timer is required in CL-01.

---

## 15. Persistence

All Chinese Learning data must use the existing OmniLife persistence architecture where possible.

Do NOT create an unrelated database system.

Data must persist between application launches.

The architecture should support future:

    Create
    Read
    Update
    Delete

operations.

---

## 16. Localization

Chinese Learning must follow OmniLife's existing localization system.

Required languages:

    Indonesian
    English

If the existing OmniLife localization architecture already supports additional language metadata, Chinese labels may be included where appropriate.

At minimum, all new user-facing strings must be localization-ready.

Do NOT hardcode user-facing strings if OmniLife already has a localization mechanism.

Use the existing localization mechanism instead.

---

## 17. Design System

The Chinese Learning module must inherit the existing OmniLife design system.

Do NOT create a separate visual identity.

Use existing:

- typography
- spacing
- colors
- cards
- buttons
- dialogs
- navigation
- icons
- responsive layout
- dark/light theme

Chinese characters should render correctly across supported platforms.

Ensure the selected fonts have appropriate CJK fallback support.

---

## 18. Responsive Design

The module must be designed for future:

    Desktop
    Tablet
    Mobile

Do not design the UI exclusively around a desktop screen.

Desktop may use:

    Sidebar
    Content area
    Multi-column cards

Mobile may use:

    Bottom navigation / compact navigation
    Single-column cards
    Scrollable sections

Follow existing OmniLife responsive conventions.

---

## 19. Empty States

Empty states are important.

For example:

    No vocabulary yet.

    Start building your personal Mandarin vocabulary.

    [Add Vocabulary]

Another:

    No learning activity yet.

    Your learning progress will appear here once you start studying.

Empty states should feel intentional and polished.

Do not show blank screens.

---

## 20. Error Handling

All new operations should handle:

- invalid data
- failed persistence
- missing records
- unexpected states

Do not allow an exception to crash the entire application.

Follow OmniLife's existing error handling architecture.

---

## 21. Accessibility

Ensure:

- sufficient text contrast
- readable Hanzi
- accessible buttons
- adequate touch targets
- keyboard navigation where applicable
- semantic labels where supported

Do not rely on color alone to communicate state.

---

## 22. Performance

The module should remain lightweight.

Avoid:

- unnecessary rebuilds
- unnecessary database queries
- large synchronous operations
- loading future datasets prematurely

The architecture should be able to scale to potentially thousands of vocabulary and Hanzi records.

---

## 23. Testing

Add appropriate tests for the new foundation.

At minimum:

### Data Model Tests

Verify that:

    Vocabulary
    HanziCharacter
    ChineseNote
    LearningProgress
    StudySession

can be created and serialized/persisted using the project's existing patterns.

### Navigation Test

Verify:

    OmniLife
        ↓
    Chinese Learning
        ↓
    Dashboard

works correctly.

### Localization Test

Verify Indonesian and English strings resolve correctly.

### Persistence Test

Verify Chinese Learning data survives application restart if supported by the current test architecture.

---

## 24. Do Not Implement Yet

The following are explicitly OUT OF SCOPE for CL-01:

    ❌ AI Tutor
    ❌ AI Conversation
    ❌ AI Writing Correction
    ❌ AI Exercise Generator
    ❌ HSK Dataset
    ❌ Spaced Repetition
    ❌ Advanced Flashcard Engine
    ❌ Listening Engine
    ❌ Speech Recognition
    ❌ Pronunciation Analysis
    ❌ Stroke Order Engine
    ❌ Hanzi Recognition
    ❌ Advanced Analytics
    ❌ Chinese Learning Graph

These belong to future phases.

---

## 25. Architecture Goal

After CL-01 is completed, the project should conceptually look like:

    OmniLife
    │
    ├── Existing Modules
    │
    └── Chinese Learning
        │
        ├── Dashboard
        │
        ├── Vocabulary
        │   └── Vocabulary Model
        │
        ├── Hanzi
        │   └── Hanzi Model
        │
        ├── Flashcards
        │
        ├── Notes
        │   └── ChineseNote Model
        │
        ├── Progress
        │   └── LearningProgress Model
        │
        └── Study Sessions
            └── StudySession Model

This structure must remain open for future expansion.

---

## 26. Implementation Procedure

Antigravity must follow this order.

### Step 1 — Inspect Existing Architecture

Inspect the existing OmniLife architecture before making changes.

### Step 2 — Identify Existing Systems

Identify:

- routing
- navigation
- design system
- localization
- persistence
- state management
- testing conventions

### Step 3 — Create Module

Create the Chinese Learning module according to existing project conventions.

### Step 4 — Implement Data Models

Implement the required foundational models.

### Step 5 — Implement Persistence

Integrate the models with the existing persistence architecture.

### Step 6 — Implement Navigation

Add Chinese Learning to OmniLife navigation and routing.

### Step 7 — Implement Dashboard

Implement the initial Chinese Learning dashboard shell.

### Step 8 — Implement Empty States

Add polished empty states for unavailable data.

### Step 9 — Implement Localization

Ensure Indonesian and English localization works.

### Step 10 — Add Tests

Add relevant unit, widget, navigation, localization, and persistence tests according to existing project conventions.

### Step 11 — Run Static Analysis

Run:

    flutter analyze

Resolve all errors and warnings introduced by this implementation.

### Step 12 — Run Tests

Run the project's existing test suite.

### Step 13 — Run Application

Run the application on the primary development platform.

### Step 14 — Regression Check

Verify that existing OmniLife functionality has not regressed.

---

## 27. Definition of Done

CL-01 is complete only when all applicable items below are satisfied:

- [ ] Chinese Learning module exists.
- [ ] Chinese Learning is accessible from OmniLife navigation.
- [ ] Dashboard exists.
- [ ] Dashboard follows OmniLife design system.
- [ ] Empty states are implemented.
- [ ] Vocabulary model exists.
- [ ] Hanzi model exists.
- [ ] Chinese Note model exists.
- [ ] Learning Progress foundation exists.
- [ ] Study Session foundation exists.
- [ ] Persistence is integrated.
- [ ] Localization is integrated.
- [ ] Indonesian UI works.
- [ ] English UI works.
- [ ] Responsive layout works.
- [ ] No existing OmniLife module is broken.
- [ ] `flutter analyze` passes.
- [ ] Relevant tests pass.
- [ ] Application runs successfully.

---

## 28. Final Instruction to Antigravity

Do not over-engineer this phase.

Do not implement future features prematurely.

The goal is to create a **stable, clean, scalable foundation** for Chinese Learning inside OmniLife.

Prioritize:

    Architecture
    >
    Maintainability
    >
    Integration
    >
    Persistence
    >
    Localization
    >
    UX Foundation
    >
    Future Extensibility

The next implementation phases will build on this foundation incrementally.

**Do not modify unrelated OmniLife modules unless required for integration.**

---

# End of CL-01

**Next planned phase:**

> `CL-02 — Chinese Learning Dashboard & Core Navigation`
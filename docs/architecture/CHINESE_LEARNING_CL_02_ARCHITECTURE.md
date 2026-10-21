# OmniLife — Chinese Learning CL-02 Architecture Specification

**Project:** OmniLife  
**Module:** Chinese Learning (CL-02 — Vocabulary Library & Learning Interface)  
**Date:** August 13, 2026  

---

## 1. Executive Overview

Phase **CL-02** transforms the Chinese Learning dataset and answer-validation engine into an interactive **Vocabulary Library & Learning Interface**. Users can browse, search (tone-tolerant Pinyin), filter, sort, and inspect detailed linguistic information (Hanzi, canonical Pinyin, accepted translations, example sentences) while tracking their learning status (`New`, `Learning`, `Familiar`, `Mastered`) computed cleanly from `UserLearningRecord`.

---

## 2. Learning Status Calculator Architecture (`learningStatusCalculator.ts`)

```text
                                USER LEARNING RECORD STATUS FLOW
                                                │
         ┌──────────────────────┬───────────────┴───────────────┬──────────────────────┐
         ▼                      ▼                               ▼                      ▼
  timesSeen === 0       mastery < 0.5                  mastery < 0.85          mastery >= 0.85
       STATUS                 STATUS                          STATUS                 STATUS
      [ New ]              [ Learning ]                    [ Familiar ]           [ Mastered ]
```

---

## 3. Vocabulary Library & Filter Integration (`ChineseLearningPage.tsx`)

- **Tone-Tolerant Search**: Uses `normalizePinyin` from CL-01A so searching `ni` or `nǐ` finds `你` (`nǐ`).
- **Status Filter Chips**: `All`, `New`, `Learning`, `Familiar`, `Mastered`.
- **HSK Level Dropdown**: Filter by `HSK 1` or `HSK 2`.
- **Vocabulary Detail Modal (`VocabularyDetailModal.tsx`)**: Displays large Hanzi, canonical Pinyin, accepted meanings list, example sentences, practice accuracy, and "Start Practice" action.

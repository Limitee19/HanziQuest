# OmniLife — Chinese Learning CL-01A Architecture Specification

**Project:** OmniLife  
**Module:** Chinese Learning (CL-01A — Chinese Dataset & Pinyin Learning Engine)  
**Date:** August 13, 2026  

---

## 1. Executive Overview

Phase **CL-01A** extends OmniLife's Chinese Learning module by separating **System-Provided Content** (`ChineseWord`) from **User Learning Data** (`UserLearningRecord`). It implements a Pinyin Tone Placement & Normalization Engine (`pinyinEngine.ts`), an Answer Validation Engine (`chineseAnswerValidator.ts`), an HSK starter dataset (`chineseDataset.ts`), and a reusable `PinyinToneInput` UI component.

---

## 2. Core Architecture & Separation of Concerns

```text
                           CHINESE CONTENT vs USER LEARNING DATA
                                            │
         ┌──────────────────────────────────┴──────────────────────────────────┐
         ▼                                                                     ▼
   CHINESE CONTENT (System Seeded)                                   USER LEARNING DATA (Per User)
   - `ChineseWord`                                                   - `UserLearningRecord`
     (id, hanzi, canonical pinyin,                                     (wordId, timesSeen, correctCount,
      normalized pinyin, tone, meanings,                                wrongCount, mastery: 0.0..1.0,
      exampleSentences, hskLevel)                                       lastReviewedAt, nextReviewAt)
```

---

## 3. Pinyin Engine & Tone Placement Rules (`pinyinEngine.ts`)

1. **Vowel Priority Placement**:
   - Rule 1: Mark `a` or `e` if present (e.g. `ni` + Tone 3 -> `nǐ`, `hao` + Tone 3 -> `hǎo`).
   - Rule 2: Mark `o` in `ou`.
   - Rule 3: Mark the last vowel in the syllable.
2. **Normalization (`normalizePinyin`)**:
   - Converts `nǐ`, `Nǐ`, `NI` into clean lowercase `ni` for comparison.

---

## 4. Answer Validation Engine (`chineseAnswerValidator.ts`)

- **Mode A (Tone-blind Pinyin)**: Compares normalized strings (`normalizePinyin(user) === normalizePinyin(target)`).
- **Mode B (Tone-aware Pinyin)**: Generates tone-marked string with `applyToneToSyllable(syllable, tone)` and compares strictly against target.
- **Hanzi Validation**: Strict character matching.
- **Meaning Validation**: Matches input against accepted translations array (e.g. `['kamu', 'Anda', 'you']`).

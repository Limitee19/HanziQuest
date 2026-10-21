# OmniLife — Chinese Learning CL-03 Architecture Specification

**Project:** OmniLife  
**Module:** Chinese Learning (CL-03 — Practice & Quiz Engine)  
**Date:** August 13, 2026  

---

## 1. Executive Overview

Phase **CL-03** introduces the first interactive **Mandarin Practice & Quiz Engine** inside OmniLife. It features an architectural separation of concerns between Question Generation (`chineseQuestionGenerator.ts`), Answer Validation (`chineseAnswerValidator.ts`), Learning Progress Updates (`chineseLearningService.ts`), and UI Session Feedback (`PracticeSessionView.tsx`).

---

## 2. Architectural Pipeline

```text
                                PRACTICE ENGINE PIPELINE
                                            │
  ┌───────────────────────┬─────────────────┴─────────────────┬───────────────────────┐
  ▼                       ▼                                   ▼                       ▼
Question Generation   Answer Validation               Record Update               UI Feedback
(chineseQuestion-     (chineseAnswerValidator.ts &     (recordPracticeResult      (PracticeSessionView.tsx
 Generator.ts)         pinyinEngine.ts)                 updates UserLearning-      instant banners & final
                                                        Record)                    summary)
```

---

## 3. Question Types Supported

1. `hanziToPinyin`: Prompt `你` -> Expects Pinyin `nǐ` / `ni` (reuses `PinyinToneInput`).
2. `hanziToMeaning`: Prompt `好` -> Expects Meaning `baik` / `bagus`.
3. `pinyinToHanzi`: Prompt `wǒ` -> Expects Hanzi `我`.
4. `meaningToHanzi`: Prompt `belajar` -> Expects Hanzi `学`.

---

## 4. User Progress Integration & Safety

- Correct submissions automatically call `recordPracticeResult(wordId, true)` (increments `timesSeen`, `correctCount`, recalculates `mastery`).
- Incorrect submissions automatically call `recordPracticeResult(wordId, false)` (increments `timesSeen`, `wrongCount`, recalculates `mastery`).
- Canonical `ChineseWord` content is **100% protected and never modified**.

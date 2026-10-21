# OmniLife — Chinese Learning Architecture Specification

**Project:** OmniLife  
**Module:** Chinese Learning (CL-01 — Foundation)  
**Date:** August 13, 2026  

---

## 1. Overview

The **Chinese Learning** module (`Belajar Bahasa Mandarin` / `中文学习`) provides a dedicated personal learning workspace designed for a university student majoring in Mandarin Education. It operates 100% offline, local-first, and integrates smoothly into OmniLife's **STUDY** domain hub.

---

## 2. Architecture & Extensible Data Models

```text
                                  CHINESE LEARNING (CL-01)
                                             │
         ┌───────────────────┬───────────────┼───────────────┬───────────────────┐
         ▼                   ▼               ▼               ▼                   ▼
  ChineseVocabulary    HanziCharacter   ChineseNote   LearningProgress     StudySession
  (hanzi, pinyin,      (character,      (title,       (vocabCount,         (startedAt,
   meaning, HSK,        pinyin,          category,     hanziCount,          duration,
   examples)            radical)         content)      streak)              activityType)
```

### Data Model Definitions (`chineseLearningService.ts`):

- `ChineseVocabulary`: `id`, `hanzi`, `pinyin`, `meaning`, `exampleSentence`, `examplePinyin`, `exampleMeaning`, `hskLevel`, `notes`, `tags`, `createdAt`, `updatedAt`
- `HanziCharacter`: `id`, `character`, `pinyin`, `meaning`, `strokeCount`, `radical`, `notes`, `tags`, `createdAt`, `updatedAt`
- `ChineseNote`: `id`, `title`, `content`, `category`, `tags`, `createdAt`, `updatedAt`
- `LearningProgress`: `vocabularyCount`, `hanziCount`, `studyMinutes`, `completedSessions`, `currentStreak`, `lastStudyDate`
- `StudySession`: `id`, `startedAt`, `endedAt`, `durationMinutes`, `activityType`, `notes`

---

## 3. Localization & Global Search

- **Bilingual Keys**: `tab.chinese_learning`, `chinese.title` (`中文学习`), `chinese.subtitle`, `chinese.todaysLearning`, `chinese.vocabOverview`, `chinese.hanziOverview`.
- **Search Provider**: `ChineseLearningSearchProvider.ts` indexes Chinese Learning hub, vocabularies, Hanzi characters, and Mandarin notes in Global Search (`Ctrl + K`).

# OmniLife — Chinese Learning CL-04 Architecture Specification

**Project:** OmniLife  
**Module:** Chinese Learning (CL-04 — Hanzi Writing & Stroke Practice)  
**Date:** August 14, 2026  

---

## 1. Executive Overview

Phase **CL-04** introduces the first **Hanzi Writing & Stroke Practice** system inside OmniLife. It features an architectural separation of concerns between Local Stroke Data (`hanziStrokeData.ts`), Stroke Order Step-Animation (`StrokeOrderViewer.tsx`), Pointer Drawing Canvas (`HanziWritingCanvas.tsx`), Deterministic Writing Evaluation (`hanziWritingEvaluator.ts`), and Hanzi Practice View (`HanziPracticeView.tsx`).

---

## 2. Architectural Pipeline

```text
                                HANZI WRITING PIPELINE
                                          │
  ┌─────────────────────┬─────────────────┴─────────────────┬─────────────────────┐
  ▼                     ▼                                   ▼                     ▼
Stroke Order Viewer   Pointer Drawing Canvas        Writing Evaluator         User Progress
(StrokeOrderViewer.   (HanziWritingCanvas.tsx       (hanziWritingEvaluator.  (recordPracticeResult
 tsx Tianzige step    Guided Tracing & Free          ts deterministic count   updates UserLearning-
 animation)            Recall modes)                 & geometric checks)      Record)
```

---

## 3. Supported Practice Modes

1. **Stroke Order Visualization**: Tianzige (`田字格`) grid canvas with Play/Pause/Replay and step-by-step navigation (`Step 1 / 7`).
2. **Guided Tracing Practice**: Faint background SVG stroke guide for guided tracing overlay.
3. **Free Recall Practice**: Independent recall canvas with Tianzige grid guide.

---

## 4. Deterministic Writing Evaluation

- Evaluates drawn stroke count and geometry against target Hanzi stroke data without fake numerical precision ("87.42%").
- Returns qualitative status: `Not Enough Data`, `Needs Practice`, `Good`, `Very Good`.
- Updates `UserLearningRecord` upon completing a successful practice attempt.
- Canonical `HanziCharacter` and `ChineseWord` content are **100% protected and never modified**.

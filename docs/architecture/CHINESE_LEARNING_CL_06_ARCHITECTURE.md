# OmniLife — Chinese Learning CL-06 Architecture Specification

**Project:** OmniLife  
**Module:** Chinese Learning (CL-06 — Chinese Listening & Audio Learning Foundation)  
**Date:** August 14, 2026  

---

## 1. Executive Overview

Phase **CL-06** introduces the **Chinese Listening & Audio Learning Foundation** inside OmniLife. It features a Web Speech / Audio Synthesis engine (`chineseAudioPlayer.ts`), adjustable playback speeds (`0.75x`, `1.0x`, `1.25x`), a global audio playback lock (stopping overlapping speech), 3 audio question types (`audioToMeaning`, `audioToHanzi`, `audioToPinyin`), a dedicated **Listening Practice** view (`ListeningPracticeView.tsx`), and seamless integration with CL-03's Practice Engine and CL-05's SRS Review Scheduler.

---

## 2. Architectural Pipeline

```text
                             AUDIO & LISTENING PIPELINE
                                         │
  ┌───────────────────┬──────────────────┴──────────────────┬───────────────────┐
  ▼                   ▼                                     ▼                   ▼
Mandarin Audio Engine Inline Audio Bar              Listening Question  SRS & Progress Sync
(chineseAudioPlayer. (AudioPlayerBar.tsx            Generator           (recordPracticeResult
 ts Web Speech zh-CN  speed toggle 0.75x/           (listeningQuestion- updates UserLearning-
 & global lock)       1.0x/1.25x)                    Generator.ts)       Record & ReviewState)
```

---

## 3. Supported Listening Question Types

1. **Audio -> Meaning**: Plays Mandarin speech prompt -> User identifies canonical translation (e.g. `you` / `kamu`).
2. **Audio -> Hanzi**: Plays Mandarin speech prompt -> User identifies Hanzi character (e.g. `你`).
3. **Audio -> Pinyin**: Plays Mandarin speech prompt -> User identifies Pinyin (e.g. `nǐ`).
- Canonical `ChineseWord` and `HanziCharacter` content are **100% protected and never modified**.

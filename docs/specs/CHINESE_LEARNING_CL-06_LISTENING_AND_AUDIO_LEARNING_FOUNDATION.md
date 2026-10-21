# OmniLife — Chinese Learning CL-06
## Chinese Listening & Audio Learning Foundation

**Project:** OmniLife  
**Module:** Chinese Learning  
**Tier:** Tier 1 — Listening Foundation  
**Phase:** CL-06  
**Status:** Implementation Ready  
**Implementation Target:** Antigravity AI Agent

**Depends On:**
- CL-01 — Chinese Learning Foundation
- CL-01A — Chinese Dataset & Pinyin Learning Engine
- CL-02 — Chinese Vocabulary Library & Learning Interface
- CL-03 — Chinese Practice & Quiz Engine
- CL-04 — Hanzi Writing & Stroke Practice
- CL-05 — Chinese Review & SRS Foundation

---

# 1. Objective

Implement the foundational **Chinese Listening & Audio Learning** system for OmniLife.

CL-06 expands Chinese Learning from:

Reading  
Hanzi  
Pinyin  
Meaning  
Writing  
Review

into:

Listening  
↓  
Hear Chinese  
↓  
Understand Sound  
↓  
Connect Sound → Pinyin  
↓  
Connect Sound → Hanzi  
↓  
Connect Sound → Meaning

The goal is to create a reusable audio-learning foundation that can later support:

- vocabulary listening
- sentence listening
- listening quizzes
- dictation
- tone recognition
- pronunciation practice
- conversation listening
- HSK listening preparation
- AI-generated listening exercises

---

# 2. Important Scope Rule

This phase establishes the **audio and listening foundation**.

Do NOT attempt to build the complete Mandarin listening system yet.

## Implement

- audio data model
- audio asset abstraction
- audio player
- playback controls
- replay
- playback speed
- listening practice foundation
- listening question foundation
- audio state
- localization
- persistence where appropriate
- integration with Vocabulary
- integration with Practice Engine
- integration with Review Engine

## Do NOT implement yet

- speech recognition
- pronunciation scoring
- AI conversation
- advanced dictation
- real-time transcription
- voice recording analysis
- native-speaker similarity scoring
- advanced listening analytics
- automatic audio generation
- cloud TTS dependency

Those belong to later phases.

---

# 3. Product Philosophy

Listening should not feel like:

> "There is a speaker icon next to the word."

It should eventually become a complete learning skill.

The long-term model is:

Listen  
↓  
Understand  
↓  
Recall  
↓  
Identify  
↓  
Transcribe  
↓  
Speak

CL-06 establishes the first three layers.

---

# 4. Existing Application Must Not Break

Before implementation:

1. Inspect CL-01.
2. Inspect CL-01A.
3. Inspect CL-02.
4. Inspect CL-03.
5. Inspect CL-04.
6. Inspect CL-05.
7. Inspect current audio/media dependencies.
8. Inspect current asset management.
9. Inspect current persistence.
10. Inspect current localization.
11. Inspect current design system.
12. Inspect current state management.
13. Inspect current navigation.

Follow existing OmniLife conventions.

Do not introduce a second architecture unnecessarily.

---

# 5. Audio Architecture

Create a reusable abstraction for Chinese audio.

Conceptually:

ChineseAudio
│
├── audioId
├── contentId
├── contentType
├── audioSource
├── duration
├── language
└── metadata

The exact field names may follow OmniLife conventions.

---

# 6. Audio Source

Audio should not be tightly coupled to one storage provider.

Support an abstraction such as:

AudioSource

Possible future implementations:

- LocalAssetAudio
- RemoteAudio
- GeneratedAudio
- CachedAudio

CL-06 should primarily use:

LocalAssetAudio

where practical.

---

# 7. Why Local Audio First

The first implementation should prioritize:

- offline usage
- reliability
- predictable playback
- no API dependency
- no API cost
- fast startup

Do not make basic listening dependent on:

- Groq
- OpenAI
- Gemini
- Internet connection

---

# 8. Audio Content Relationship

Audio should connect to existing Chinese content.

Example:

ChineseWord
│
├── Hanzi
├── Pinyin
├── Meaning
├── Example Sentence
└── Audio

Do not duplicate vocabulary information inside the audio object.

The audio object should reference canonical content.

---

# 9. Sentence Audio

Prepare the architecture for sentence audio.

Example:

ExampleSentence
│
├── Chinese
├── Pinyin
├── Meaning
└── Audio

CL-06 may initially support vocabulary audio first.

Sentence audio should be architecturally possible.

---

# 10. Audio Player

Create a reusable:

ChineseAudioPlayer

or equivalent component.

It should support:

- Play
- Pause
- Replay
- Stop
- Seek
- Playback Speed
- Loading
- Error
- Completed

Do not duplicate audio-player implementations across screens.

---

# 11. Minimal Player UI

The default vocabulary audio UI should remain simple.

Example:

你

[ 🔊 ]

nǐ

Meaning:

you

The speaker control should be immediately understandable.

---

# 12. Player States

The audio player must support:

- Idle
- Loading
- Playing
- Paused
- Completed
- Error

Do not make UI state dependent on assumptions such as:

"button clicked = audio playing"

The actual player state should drive the UI.

---

# 13. Replay

The user should be able to replay audio immediately.

Replay should not require:

stop  
then play

A single replay interaction should restart the audio.

---

# 14. Multiple Replay

Allow unlimited replay during normal learning.

Do not artificially limit replay count.

Listening practice should encourage:

Listen  
Replay  
Listen again  
Understand

---

# 15. Playback Speed

Provide a small set of useful playback speeds.

Recommended:

- 0.75×
- 1.0×
- 1.25×

Optionally:

- 1.5×

Do not initially expose a complicated speed selector.

---

# 16. Default Speed

Default:

1.0×

The user should not have to change speed every session.

---

# 17. Slow Listening

0.75× should be positioned as:

Slow

not:

Beginner Mode

The user should be able to use slower audio without feeling that the system is judging their level.

---

# 18. Audio Completion

When playback reaches the end:

Playing  
↓  
Completed

The player should allow immediate replay.

Do not automatically replay forever.

---

# 19. Audio Error

If audio cannot be loaded:

Indonesian:

Audio tidak dapat diputar.

English:

Audio could not be played.

Provide a retry action where appropriate.

Do not crash the application.

---

# 20. Missing Audio

Some Chinese content may not have audio yet.

Do not show a broken player.

Instead:

Audio belum tersedia.

or:

Audio unavailable.

The rest of the vocabulary detail must remain usable.

---

# 21. Vocabulary Integration

Update vocabulary detail to support audio.

Example:

你

Pinyin:

nǐ

Meaning:

you

[ 🔊 Play ]

Example:

你好吗？

Nǐ hǎo ma?

How are you?

The audio player should feel like part of the vocabulary card.

---

# 22. Pinyin Must Remain Visible

Listening should not force the user to memorize the sound without context.

Vocabulary detail should retain:

- Hanzi
- Pinyin
- Meaning

Audio supplements the content.

It does not replace it.

---

# 23. Tone Awareness

The audio system must preserve tone information.

Example:

你  
nǐ

The user should hear the correct pronunciation and tone.

Do not strip tone metadata from Chinese content.

---

# 24. Audio and Pinyin Relationship

The architecture should preserve:

Audio  
↕  
Pinyin  
↕  
Hanzi  
↕  
Meaning

This relationship will be important for future listening exercises.

---

# 25. Listening Practice

Introduce a dedicated listening practice type.

Conceptually:

ListeningPractice

It should reuse:

PracticeEngine

from CL-03.

Do NOT create a separate practice engine.

---

# 26. Listening Question Type

Initial listening question:

Audio → Meaning

Example:

🔊

[Play]

What does this mean?

A. hello  
B. thank you  
C. goodbye  
D. sorry

The system validates the answer using the existing Practice Engine.

---

# 27. Second Listening Question

Prepare architecture for:

Audio → Hanzi

Example:

🔊

Which Hanzi did you hear?

A. 你  
B. 他  
C. 我  
D. 她

This may be implemented if it fits naturally within the existing CL-03 question model.

---

# 28. Third Listening Question

Prepare architecture for:

Audio → Pinyin

Example:

🔊

Which Pinyin did you hear?

A. nǐ  
B. wǒ  
C. tā  
D. nín

Do not duplicate answer validation.

---

# 29. Listening Question Generation

Listening questions should be generated from existing Chinese content.

Conceptually:

ChineseWord  
↓  
Audio  
↓  
QuestionGenerator  
↓  
ListeningQuestion

Use existing question-generation infrastructure whenever possible.

---

# 30. Distractors

For multiple-choice listening questions, distractors should be:

- valid Chinese vocabulary
- reasonably similar difficulty
- not obviously unrelated
- preferably from the same learning level

Do not generate nonsensical choices.

---

# 31. Avoid Ambiguous Distractors

Avoid questions where:

two answers could reasonably be correct

For example:

Audio:

你好

Possible answers:

hello  
hi

would be ambiguous.

The question generator must avoid this.

---

# 32. Listening Practice Flow

The intended flow:

Chinese Learning  
↓  
Practice  
↓  
Listening  
↓  
Question  
↓  
Play Audio  
↓  
Answer  
↓  
Feedback  
↓  
Next

---

# 33. Audio Replay During Quiz

The user may replay the audio before answering.

Do not restrict replay in CL-06.

Future exam mode may impose restrictions.

---

# 34. Listening Quiz Feedback

After answering:

## Correct

Correct!

你  
nǐ  
you

## Incorrect

Not quite.

Correct answer:

你  
nǐ  
you

The user should have the option to replay the audio.

---

# 35. Review Integration

Listening should eventually contribute to CL-05 Review.

For example:

Review Item:

你

Review Type:

Listening

Audio:

🔊

Question:

What did you hear?

The same:

- ReviewState
- ReviewScheduler
- ReviewQueue

must be reused.

Do NOT create:

ListeningSRS

as a separate system.

---

# 36. Review Result

A listening review result should update the same learning state.

Conceptually:

Listening Result  
↓  
ReviewResult  
↓  
ReviewState  
↓  
ReviewScheduler

---

# 37. Listening vs Reading Strength

Prepare the architecture for future skill-specific mastery.

Eventually an item could have:

- Reading mastery
- Listening mastery
- Writing mastery
- Speaking mastery

CL-06 does NOT need to implement this complete mastery system.

Do not duplicate mastery models prematurely.

---

# 38. Audio Interaction Tracking

Track useful events where the existing analytics architecture supports them.

Potential events:

- audio_played
- audio_completed
- audio_replayed
- audio_speed_changed
- listening_question_answered

Do not introduce a large analytics system solely for CL-06.

Reuse OmniLife's existing analytics/event architecture.

---

# 39. Listening Session Statistics

At the end of a listening practice session, show:

Listening Complete

Questions:

10

Correct:

8

Accuracy:

80%

Do not yet show:

- tone recognition score
- pronunciation score
- speech similarity

Those belong to later features.

---

# 40. Listening Dashboard

Add a listening entry point inside Chinese Learning.

Possible structure:

Chinese Learning

┌─────────────────────────────┐
│ Vocabulary                  │
│ Hanzi                       │
│ Practice                    │
│ Review                      │
│ Listening                   │
└─────────────────────────────┘

Do not overcrowd the primary navigation.

Follow the existing OmniLife navigation architecture.

---

# 41. Listening Home

The listening section may show:

Listening

Practice listening to:

- Vocabulary
- Sentences

[ Start Listening Practice ]

Only show options that are actually implemented.

---

# 42. Listening Difficulty

Do not create a complicated level system yet.

Possible future levels:

- Beginner
- Elementary
- Intermediate
- Advanced

CL-06 may simply use:

Current Learning Content

as the source.

---

# 43. Audio Content Selection

Listening practice should use content the user has already learned where possible.

Priority:

Learned Vocabulary  
↓  
Recently Learned  
↓  
Review Due

Do not overwhelm the user with completely unknown vocabulary.

---

# 44. Listening + Review Synergy

A future ideal flow:

User learns:

你

Practice:

Hanzi → Meaning

Later:

Review:

Audio → Meaning

Later:

Review:

Audio → Hanzi

Later:

Listening:

Sentence → Meaning

This creates multiple retrieval pathways.

CL-06 should establish the architecture for this progression.

---

# 45. Audio Cache

If the existing app architecture supports caching:

Audio may be cached locally after first use.

The goal is:

First use  
↓  
Load audio  
↓  
Cache  
↓  
Future playback  
↓  
Fast/offline

Do not implement an unnecessarily complex cache manager if the audio package already provides suitable functionality.

---

# 46. Offline Requirement

Basic listening must work offline for bundled/local audio.

The user should be able to:

- open vocabulary
- play audio
- replay audio
- change speed
- practice listening
- complete listening questions

without internet when the relevant audio assets are locally available.

---

# 47. No Mandatory TTS API

Do not make external TTS mandatory.

Do not require:

- Google Cloud TTS
- Azure TTS
- OpenAI TTS
- ElevenLabs

for CL-06.

---

# 48. Future TTS Architecture

The architecture should allow a future provider abstraction:

ChineseAudioProvider  
│  
├── LocalAssetProvider  
├── CachedAudioProvider  
└── TTSProvider

Future TTS can then be added without rewriting the learning UI.

---

# 49. Future AI Audio

Future AI may generate:

Example Sentence  
↓  
TTS  
↓  
Audio  
↓  
Listening Practice

or:

AI Tutor  
↓  
Generate dialogue  
↓  
TTS  
↓  
Listening

CL-06 only prepares the architecture.

Do not connect AI APIs yet.

---

# 50. Audio Asset Strategy

Do not manually create hundreds of duplicate audio files.

The implementation should establish a scalable asset naming convention.

Example:

assets/audio/chinese/vocabulary/ni3.mp3

or an equivalent architecture.

The exact naming strategy should follow the project's asset conventions.

---

# 51. Tone Audio Assets

When using pre-recorded audio, preserve the correct tone.

For example:

nǐ

must not accidentally use audio for:

ní  
nǐ  
nì

Audio metadata should remain associated with the correct canonical Chinese content.

---

# 52. Pinyin Tone Compatibility

CL-01A's Pinyin system should remain the canonical source of:

- tone number
- tone marks
- normalized pinyin

CL-06 must reuse that system.

Do not create a second Pinyin parser.

---

# 53. Pinyin Input

Listening practice may eventually ask the user to type:

ni

for:

nǐ

This should reuse the existing CL-01A normalization rules.

The user should not be forced to type tone marks unless a future exercise explicitly requires them.

---

# 54. Tone Button Compatibility

The existing tone-button concept from CL-01A should remain compatible.

Future listening dictation could allow:

n  
i

plus:

- Tone 1
- Tone 2
- Tone 3
- Tone 4
- Neutral

CL-06 does not need to implement this advanced dictation interface yet.

---

# 55. Localization

All user-facing text must use OmniLife localization.

Required languages:

- Indonesian
- English

## Indonesian

- Listening
- Mendengarkan
- Putar
- Jeda
- Ulangi
- Kecepatan
- Audio tidak tersedia
- Audio tidak dapat diputar
- Mulai Latihan Listening
- Jawaban Benar
- Jawaban Salah
- Latihan Selesai

## English

- Listening
- Play
- Pause
- Replay
- Speed
- Audio unavailable
- Audio could not be played
- Start Listening Practice
- Correct
- Incorrect
- Practice Complete

Do not hardcode strings.

---

# 56. Responsive Design

Listening UI must work on:

- Mobile
- Tablet
- Desktop

Mobile priority:

- Audio Player
- Question
- Answer Options
- Feedback
- Next

Desktop may use additional spacing and contextual information.

---

# 57. Accessibility

Ensure:

- accessible audio controls
- keyboard controls
- clear focus state
- screen-reader labels
- replay button with accessible description
- playback speed accessible to keyboard users
- audio state not communicated only through color

Example screen-reader label:

Play Chinese pronunciation for 你

---

# 58. Audio Control Design

Do not make the player visually dominant.

The learning content remains the focus.

Recommended hierarchy:

Chinese  
↓  
Pinyin  
↓  
Audio  
↓  
Meaning

or:

Chinese  
↓  
Audio + Pinyin  
↓  
Meaning

Follow the existing OmniLife design system.

---

# 59. Do Not Overdesign

Avoid creating:

- giant audio waveform
- unnecessary animations
- music-player style UI
- complex equalizers
- visualizers

The app is for language learning.

Audio controls should be functional and calm.

---

# 60. Audio Loading UX

During loading:

Loading audio...

Use a subtle loading indicator.

Do not block the entire screen.

---

# 61. Audio Error Recovery

If audio fails:

Audio could not be played.

[ Retry ]

Retry should attempt to reload the audio.

---

# 62. Audio Session Behavior

When leaving the page:

The audio should stop or pause according to normal mobile UX.

Do not allow audio to unexpectedly continue playing after leaving a vocabulary screen unless the app intentionally supports background playback.

---

# 63. Multiple Audio Players

Avoid allowing multiple Chinese audio clips to play simultaneously.

If a new audio starts:

Audio A playing  
↓  
Play Audio B  
↓  
Audio A stops/pauses  
↓  
Audio B plays

This prevents confusing overlapping Chinese speech.

---

# 64. Resource Management

Dispose audio player resources correctly.

Avoid:

- memory leaks
- unreleased audio controllers
- multiple player instances

Especially important on mobile.

---

# 65. State Management

Follow the existing OmniLife state management pattern.

Do not introduce a new state-management library.

Audio state should be reactive where appropriate.

---

# 66. Persistence

Playback speed may optionally persist as a user preference.

Example:

Preferred listening speed:

1.0×

If OmniLife already has settings/preferences storage, reuse it.

Do not create a dedicated database table for one preference if unnecessary.

---

# 67. Practice Persistence

Listening practice results should integrate with existing:

- PracticeAttempt
- UserLearningRecord
- ReviewState

Do not create duplicate statistics.

---

# 68. Data Integrity

A listening answer should update learning data exactly once.

Protect against:

- double taps
- repeated submission
- navigation
- rebuild
- retry

---

# 69. Error Handling

Handle:

- missing audio
- invalid audio path
- unsupported audio format
- player initialization failure
- playback failure
- practice generation failure
- missing vocabulary
- missing translation
- missing Pinyin
- persistence failure

The application must not crash.

---

# 70. Testing Strategy

CL-06 must include unit, widget, and integration tests where appropriate.

## 70.1 Audio Model Test

Verify:

ChineseAudio

correctly associates:

- contentId
- audioSource
- metadata

## 70.2 Audio Player State Test

Verify transitions:

Idle  
→ Loading  
→ Playing  
→ Paused  
→ Playing  
→ Completed

## 70.3 Replay Test

Verify:

Completed  
→ Replay  
→ Playing

## 70.4 Playback Speed Test

Verify supported speeds:

- 0.75×
- 1.0×
- 1.25×

and any additional selected speed.

## 70.5 Missing Audio Test

If no audio exists:

The app must show an appropriate unavailable state.

## 70.6 Audio Error Test

Simulate playback failure.

Verify:

Error State  
+  
Retry

works.

## 70.7 Multiple Player Test

Start:

Audio A

then:

Audio B

Verify that Audio A does not continue playing simultaneously.

## 70.8 Listening Question Test

Generate:

Audio → Meaning

and verify the correct answer.

## 70.9 Hanzi Listening Test

If implemented in CL-06:

Audio → Hanzi

must correctly validate the answer.

## 70.10 Pinyin Listening Test

If implemented:

Audio → Pinyin

must use the existing Pinyin normalization engine.

## 70.11 Practice Integration Test

Verify listening questions run through:

PracticeEngine

rather than a second practice implementation.

## 70.12 Review Integration Test

Verify a listening review updates:

ReviewState

through:

ReviewScheduler

## 70.13 Persistence Test

Verify:

- practice result
- review state

survive application restart.

## 70.14 Offline Test

Verify local audio playback works without network access.

## 70.15 Localization Test

Verify Indonesian and English.

## 70.16 Accessibility Test

Verify:

- keyboard navigation
- focus state
- screen-reader labels
- audio button labels

---

# 71. Definition of Done

CL-06 is complete only when:

- [ ] ChineseAudio model exists.
- [ ] Audio source abstraction exists.
- [ ] Local audio assets are supported.
- [ ] Reusable audio player exists.
- [ ] Play works.
- [ ] Pause works.
- [ ] Replay works.
- [ ] Audio completion works.
- [ ] Playback speed works.
- [ ] Missing audio is handled.
- [ ] Playback error is handled.
- [ ] Retry works.
- [ ] Multiple simultaneous audio playback is prevented.
- [ ] Vocabulary integrates with audio.
- [ ] Pinyin remains connected to audio.
- [ ] Tone information is preserved.
- [ ] Listening Practice exists.
- [ ] Listening questions use PracticeEngine.
- [ ] Audio → Meaning works.
- [ ] Audio → Hanzi works if implemented.
- [ ] Audio → Pinyin works if implemented.
- [ ] Listening feedback works.
- [ ] Listening session summary exists.
- [ ] Listening results integrate with learning history.
- [ ] Listening reviews integrate with ReviewState.
- [ ] ReviewScheduler remains the scheduling authority.
- [ ] Offline playback works for local assets.
- [ ] No external API is required.
- [ ] No AI dependency exists.
- [ ] No TTS dependency exists.
- [ ] Indonesian localization works.
- [ ] English localization works.
- [ ] Mobile UI works.
- [ ] Desktop UI works.
- [ ] Accessibility requirements are met.
- [ ] Tests pass.
- [ ] flutter analyze passes.
- [ ] CL-01 through CL-05 remain functional.
- [ ] Existing OmniLife modules remain functional.

---

# 72. Expected Architecture After CL-06

The conceptual architecture should now be:

OmniLife
│
└── Chinese Learning
    │
    ├── Dashboard
    │
    ├── Vocabulary
    │   ├── Vocabulary Library
    │   └── Vocabulary Detail
    │
    ├── Hanzi
    │   ├── Hanzi Library
    │   ├── Hanzi Detail
    │   ├── Stroke Order
    │   └── Writing Practice
    │
    ├── Practice
    │   ├── Practice Setup
    │   ├── Practice Session
    │   ├── Listening Practice
    │   └── Session Summary
    │
    ├── Review
    │   ├── Review Dashboard
    │   ├── Review Queue
    │   ├── Review Session
    │   └── Review Summary
    │
    ├── Audio
    │   ├── ChineseAudio
    │   ├── AudioSource
    │   ├── AudioPlayer
    │   └── AudioProvider
    │
    ├── Chinese Content
    │   ├── ChineseWord
    │   ├── HanziCharacter
    │   └── ExampleSentence
    │
    ├── Learning Data
    │   ├── UserLearningRecord
    │   ├── PracticeAttempt
    │   └── ReviewState
    │
    └── Learning Engine
        ├── PinyinEngine
        ├── ChineseAnswerValidator
        ├── PracticeEngine
        ├── PracticeQuestionGenerator
        ├── ListeningQuestionGenerator
        ├── LearningStatusCalculator
        ├── HanziWritingEvaluator
        ├── ReviewScheduler
        └── ReviewQueue

---

# 73. Future Architecture Direction

After CL-06, the learning loop should be capable of:

Vocabulary  
↓  
Read  
↓  
Listen  
↓  
Practice  
↓  
Review  
↓  
Listen Again  
↓  
Long-Term Retention

The next skills can then build on this foundation:

Listening  
↓  
Dictation  
↓  
Speaking  
↓  
Pronunciation  
↓  
Conversation

---

# 74. Future Listening Features

Do NOT implement these now, but ensure the architecture can eventually support:

- Audio → Meaning
- Audio → Hanzi
- Audio → Pinyin
- Audio → Tone
- Audio → Sentence
- Audio → Dictation
- Audio → Word Segmentation
- Audio → Listening Comprehension

---

# 75. Future Dictation

A later phase may allow:

🔊

User hears:

你好

User types:

ni hao

Then:

Pinyin normalization  
+  
tone selection  
+  
Hanzi recognition

can evaluate the response.

The existing CL-01A tone-input architecture should be reused.

---

# 76. Future Tone Recognition

A later phase may ask:

Which tone did you hear?

A. 1  
B. 2  
C. 3  
D. 4

This should eventually connect:

Audio  
↓  
Pinyin  
↓  
Tone

Do not implement tone-recognition exercises in CL-06.

---

# 77. Future Speaking

A later phase may introduce:

Listen  
↓  
Speak  
↓  
Record  
↓  
Speech Recognition  
↓  
Pronunciation Analysis

This requires a separate architecture.

Do not mix speech recognition into CL-06.

---

# 78. Future AI / TTS

Future AI functionality may support:

Generate Example Sentence  
↓  
Generate Chinese Audio  
↓  
Listening Practice

or:

AI Tutor  
↓  
Generate dialogue  
↓  
TTS  
↓  
Listening

CL-06 must remain independent from these systems.

---

# 79. Final Instruction to Antigravity

CL-06 establishes the **audio layer of OmniLife Chinese Learning**.

The key objective is not to create a fancy audio player.

The objective is to establish a reusable learning architecture where:

Chinese Content  
↓  
Audio  
↓  
Listening Practice  
↓  
PracticeEngine  
↓  
Learning History  
↓  
ReviewState  
↓  
ReviewScheduler

## Critical Rules

1. Do not create a second PracticeEngine.
2. Reuse CL-03 PracticeEngine.
3. Reuse CL-01A Pinyin normalization.
4. Reuse CL-01A tone infrastructure.
5. Reuse CL-05 ReviewState.
6. Reuse CL-05 ReviewScheduler.
7. Keep audio independent from any specific provider.
8. Prefer local/offline audio.
9. Do not require internet.
10. Do not require AI.
11. Do not require external TTS.
12. Do not implement speech recognition.
13. Do not implement pronunciation scoring.
14. Do not implement advanced dictation.
15. Do not implement HSK listening exams.
16. Do not duplicate canonical Chinese content.
17. Do not duplicate answer validation.
18. Do not allow multiple audio players to play simultaneously.
19. Handle missing and failed audio gracefully.
20. Keep the audio UI simple and learning-focused.
21. Preserve tone information.
22. Keep Indonesian and English localization complete.
23. Make the audio layer replaceable and extensible.
24. Ensure all existing OmniLife features continue working.

The most important architecture principle is:

Chinese Content  
↓  
ChineseAudio  
↓  
AudioPlayer  
↓  
Listening Question  
↓  
PracticeEngine  
↓  
ReviewState  
↓  
ReviewScheduler

Do not allow the Listening UI to own learning logic or scheduling logic.

---

# End of CL-06

**Next planned phase:**

CL-07 — Chinese Grammar & Sentence Learning Foundation
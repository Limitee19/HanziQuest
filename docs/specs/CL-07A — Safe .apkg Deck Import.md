# OmniLife — Chinese Learning CL-07A
## Safe Anki `.apkg` Deck Import Foundation

**Status:** Implementation Ready  
**Depends On:** CL-01 through CL-06  
**Depends On:** SYN-01 — Secure Cloud Sync Foundation  
**Goal:** Safely import user-provided Anki deck packages (`.apkg`) into OmniLife as structured learning content, without executing untrusted deck code or duplicating the Chinese Learning/SRS architecture.

## 1. Objective

Allow the user to choose an `.apkg` file and import its learning content into OmniLife.

```text
.apkg file
        ↓
Safe read-only analysis
        ↓
Deck preview
        ↓
Field/template compatibility check
        ↓
User confirmation
        ↓
Structured OmniLife Deck Library
```

The importer must support:

```text
Decks and subdecks
Notes
Cards
Note fields
Tags
Basic templates
Cloze cards
Images
Audio
```

## 2. Core Safety Rule

An `.apkg` file is untrusted input.

Never:

```text
Execute JavaScript from a card template
Run Anki add-ons
Run embedded scripts
Open external links automatically
Trust imported HTML/CSS
Trust imported scheduling data
```

The importer reads content only.

## 3. Supported File Type

Accept:

```text
Anki Deck Package (.apkg)
```

Reject or explain:

```text
Collection package (.colpkg)
collection.apkg package
Unknown archive types
Corrupted package
Password-protected/unsupported package
```

If the user attempts to import an entire Anki collection package, show:

```text
File ini adalah koleksi Anki penuh, bukan deck yang dapat diimpor langsung.

Ekspor deck tertentu dari Anki sebagai file .apkg, lalu impor file tersebut ke OmniLife.
```

Do not overwrite OmniLife data from any imported file.

## 4. Import Flow

```text
Choose .apkg file
        ↓
Validate file safety
        ↓
Analyze package in read-only mode
        ↓
Show preview and warnings
        ↓
User selects decks to import
        ↓
User confirms import
        ↓
Write structured learning content transactionally
        ↓
Show import result
```

No user data is written during preview.

## 5. File Safety Validation

Before parsing:

```text
Validate extension and file signature
Validate archive structure
Validate configurable file-size limit
Validate configurable extracted-size limit
Validate archive entry count
Detect suspicious compression ratio
Reject path traversal entries
Reject unsupported executable content
```

Requirements:

- Parse in a background worker/process where available.
- Do not block the application interface during a large import.
- Allow the user to cancel analysis safely.
- A cancelled or failed import must leave no partial deck data.
- Do not upload the original `.apkg` file to cloud sync.

## 6. Content to Read

Extract equivalent content concepts:

```text
Deck
Subdeck hierarchy
Note type
Field names
Note values
Card templates
Card ordering
Tags
Media references
```

Preserve source identity for future duplicate detection.

```text
ImportedDeckSource
- sourcePackageFingerprint
- sourceDeckIdentifier
- sourceDeckName
- sourceNoteIdentifier
- sourceCardOrdinal
```

Do not use displayed card text as the only duplicate identifier.

## 7. OmniLife Data Model

Create or adapt equivalent models.

```text
LearningDeck
- id
- ownerId
- name
- parentDeckId (optional)
- source: anki_import | native
- sourcePackageFingerprint
- status: active | archived
- createdAt
- updatedAt

FlashcardNote
- id
- deckId
- sourceNoteIdentifier
- noteTypeName
- fields
- tags
- importStatus: supported | needs_mapping | unsupported
- createdAt
- updatedAt

FlashcardCard
- id
- noteId
- deckId
- sourceCardOrdinal
- cardType: basic | reversed | cloze | custom_mapped
- frontContent
- backContent
- sourceTemplateName
- studyStatus: not_started | available | suspended
- createdAt
- updatedAt

ImportedMediaAsset
- id
- ownerId
- sourcePackageFingerprint
- sourceFileName
- safeFileName
- mediaType: image | audio
- mimeType
- storageReference
- createdAt
```

All entities must use stable IDs and SYN-01 ownership/sync metadata.

## 8. Deck and Subdeck Handling

Preserve imported deck hierarchy.

Example:

```text
HSK 1
├── Lesson 1
├── Lesson 2
└── Listening
```

In OmniLife:

```text
Chinese Learning
└── Imported Decks
    └── HSK 1
        ├── Lesson 1
        ├── Lesson 2
        └── Listening
```

The user may choose:

```text
Import all decks
Import selected decks only
Import a parent deck and its child decks
```

Do not flatten the hierarchy without user confirmation.

## 9. Field Preview and Mapping

Before import, display detected fields.

Example:

```text
Detected fields

Hanzi
Pinyin
Meaning
Example
Audio
Image
```

For common decks, suggest mapping:

```text
Hanzi   → Front
Pinyin  → Supporting text
Meaning → Back
Audio   → Playable media
Example → Additional content
```

The user may adjust field roles.

Supported roles:

```text
Question
Answer
Supporting text
Hint
Audio
Image
Extra information
```

Never discard fields merely because they are not displayed on the first card layout.

## 10. Card-Type Support

### Required Initial Support

```text
Basic card
Basic card with reverse direction
Cloze deletion
```

### Basic Card

```text
Front
→ reveal
Back
```

### Reversed Card

```text
Hanzi → Meaning
Meaning → Hanzi
```

### Cloze Card

```text
我 {{c1::喜欢}} 学习中文。
```

The importer should convert supported Cloze items into structured question variants.

### Unsupported Custom Templates

If a deck uses a complex custom template:

```text
Import the note fields safely
Mark related cards as “Needs mapping”
Do not execute custom code
Do not silently create broken study cards
```

## 11. Safe Content Rendering

Imported content may contain HTML.

Use a strict sanitization policy.

Allowed content may include:

```text
Paragraphs
Line breaks
Basic formatting
Lists
Tables where readable
Safe image references
Safe audio references
```

Block or remove:

```text
JavaScript
Inline event handlers
Iframes
Forms
External scripts
Remote tracking pixels
Auto-playing media
Unsafe embedded objects
```

Imported styling must be scoped so it cannot damage OmniLife’s interface.

## 12. Media Handling

Support imported:

```text
Images
Audio files
```

Requirements:

- Copy only supported media into OmniLife-managed storage.
- Validate file type and file size.
- Preserve valid links between card fields and media.
- Show a warning if referenced media is missing.
- Do not automatically fetch missing media from the internet.
- Do not render unsafe SVG or executable-style media.
- Audio should use the existing Chinese Learning audio player where compatible.

Example warning:

```text
3 kartu memiliki audio yang tidak ditemukan.
Kartu tetap dapat diimpor tanpa audio tersebut.
```

## 13. Scheduling and Imported Progress

CL-07A imports content, not Anki scheduling state.

Default behavior:

```text
Imported cards
→ studyStatus: not_started
→ no imported review history
→ no imported due dates
→ no imported interval
```

Reason:

```text
OmniLife must use the existing ReviewScheduler architecture.
```

Do not create an `AnkiScheduler` separate from CL-05 Review/SRS.

An optional migration of historical Anki progress may be considered only in CL-07D.

## 14. Import Preview

The preview must show:

```text
Deck name and hierarchy
Number of notes
Number of cards
Detected note types
Detected fields
Supported card types
Media count
Missing-media count
Custom-template warnings
Potential duplicate count
```

Example:

```text
HSK 1 Vocabulary

Cards: 500
Notes: 250
Audio files: 250
Images: 0

Supported:
✓ Basic
✓ Reversed

Needs review:
⚠ 12 cards use custom templates
⚠ 3 audio files are missing
```

## 15. Duplicate Protection

When importing the same deck again:

```text
Same source package + same source note/card identity
        ↓
Do not create duplicate cards
```

For CL-07A:

```text
Existing identical cards
→ skip and report

New cards from the package
→ import

Changed cards
→ report as update candidate
→ do not overwrite automatically
```

Full deck-update policy belongs to CL-07D.

## 16. Import Result

After a successful import, show:

```text
Import complete

Decks imported: 3
Notes imported: 250
Cards created: 500
Media imported: 250
Skipped duplicates: 0
Warnings: 3

[ Open Deck ]
[ View Import Report ]
```

The report must remain available in import history.

## 17. Sync and Backup

Rules:

```text
Original .apkg file
→ stays local unless the user explicitly saves it elsewhere
→ is not uploaded through OmniLife sync

Imported structured content
→ syncs through SYN-01

Imported approved media
→ syncs through approved OmniLife media storage
```

Requirements:

- Respect source ownership and licensing.
- Keep imported deck content available on Desktop, PWA, and Android after sync.
- Do not duplicate cards/media during sync retries.
- Include imported deck content in OmniLife backup/restore.
- Do not include the original `.apkg` package in backups by default.

## 18. Course and Chinese Learning Integration

After import, a deck can be linked to:

```text
Chinese Learning Library
Course
Course Class
Academic Event
```

Example:

```text
Chinese Comprehensive 1
→ HSK 1 Vocabulary deck
```

This creates a relationship only.

Do not automatically mark imported cards as learned, add them to review, or generate academic tasks.

## 19. Explicitly Out of Scope

Do not implement in CL-07A:

```text
AnkiWeb synchronization
Importing Anki collection packages
Running Anki add-ons
Executing custom JavaScript templates
Exact migration of Anki review history
Anki’s full card browser
Again/Hard/Good/Easy study interface
FSRS/Anki scheduling emulation
Public deck sharing
Automatic web download of media
```

## 20. Testing Requirements

Test at minimum:

```text
1. Import a basic Chinese vocabulary .apkg deck.
2. Import a deck containing Hanzi, Pinyin, Meaning, and audio.
3. Import nested decks/subdecks.
4. Import Basic, Reversed, and Cloze card types.
5. Detect a custom-template deck without executing its code.
6. Detect missing media without failing the whole import.
7. Reject malformed/corrupted package files safely.
8. Reject suspicious archive content safely.
9. Cancel import during analysis with no partial content written.
10. Re-import the same package without duplicate cards.
11. Sync imported structured content to another signed-in device.
12. Confirm imported card content is readable offline after synchronization.
```

## 21. Acceptance Criteria

CL-07A is complete when:

1. The user can choose and preview a valid `.apkg` deck.
2. Decks, subdecks, fields, tags, cards, images, and audio are safely imported.
3. Basic, Reversed, and Cloze cards are supported.
4. Unsupported templates produce actionable warnings, not broken cards.
5. Imported code and scripts are never executed.
6. Imported scheduling history is excluded.
7. Duplicate re-imports do not create duplicate cards.
8. Imported content syncs safely through SYN-01.
9. Imported content can be linked to Chinese Learning and Academic courses.
10. A failed/cancelled import does not change user data.

## 22. Next Phase

After CL-07A is complete:

```text
CL-07B — Anki-Style Review Session & SRS Integration
```

This phase will add:

```text
Deck dashboard
New / Learn / Due counts
Show question → reveal answer
Again / Hard / Good / Easy
Daily limits
Review queue
Progress statistics
```

All review scheduling will reuse OmniLife’s existing CL-05 `ReviewScheduler`.
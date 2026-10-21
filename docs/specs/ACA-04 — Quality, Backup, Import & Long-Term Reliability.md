# OmniLife — ACA-04  
## Quality, Backup, Import & Long-Term Reliability

**Status:** Implementation Ready  
**Depends On:** ACA-02A through ACA-03  
**Depends On:** SYN-01, MOBILE-01, and MOBILE-02 where available  
**Goal:** Protect OmniLife academic data through safe backup/restore, controlled import, migration safety, testing, observability, and long-term reliability practices.

## 1. Core Principle

Academic data is personal and difficult to recreate.

```text
Course history
KRS
Schedules
Tasks
Notes
Study activity
Chinese Learning progress
Grades
Curriculum
        ↓
Must remain recoverable, portable, and trustworthy
```

No migration, import, sync retry, update, or restore may silently delete or overwrite meaningful user data.

## 2. ACA-04 Subphases

```text
ACA-04A — Backup & Restore Foundation
ACA-04B — Safe Import & Data Migration
ACA-04C — Audit, Integrity & Recovery
ACA-04D — Quality, Performance & Accessibility
```

Implement in that order.

## 3. Backup Scope

A full personal backup must include user-owned OmniLife data:

```text
Academic terms
Period profiles
Rooms
Lecturers
Courses
RPS/syllabus data
KRS and schedule data
Calendar events and exceptions
Course links
Tasks
Notes
Study records
Chinese Learning records
Curriculum
Course attempts
Grades
KHS/transcript records
User preferences relevant to data
```

A backup must not include:

```text
Passwords
Session tokens
Authentication credentials
Cloud administrator keys
Device-specific secret keys
Temporary sync locks
```

## 4. Backup Format

Use a versioned, portable backup structure.

```text
OmniLife Backup Archive
├── manifest.json
├── data/
│   ├── academic.json
│   ├── tasks.json
│   ├── notes.json
│   ├── study.json
│   ├── chinese-learning.json
│   └── other supported modules
├── metadata/
│   ├── schema-version
│   ├── export-time
│   ├── application-version
│   └── checksums
└── optional attachments/
```

Requirements:

- Include a schema version.
- Include record counts by entity type.
- Include integrity checksums.
- Preserve stable IDs and relationships.
- Preserve timestamps where useful.
- Exclude temporary UI state.
- Support future migration between backup schema versions.

Do not invent custom encryption algorithms.

## 5. Encrypted Backups

Full backups may contain sensitive notes and grades.

Provide two clearly separated options:

```text
Standard Backup
- Portable archive
- User warned to store it safely

Encrypted Backup
- Uses established, well-vetted encryption support
- User chooses a strong password
- Password is never stored by OmniLife
```

Requirements:

- Explain that a forgotten encryption password cannot be recovered.
- Do not export passwords or access tokens.
- Do not falsely claim encryption if only file obfuscation is used.
- Require explicit confirmation before creating an unencrypted full backup.

## 6. Backup Interface

Provide a dedicated Data Safety area.

```text
Data Safety
├── Create Full Backup
├── Create Selected Backup
├── Verify Backup
├── Restore from Backup
├── Import Data
├── Export Readable Data
└── Backup History
```

Selected backup categories may include:

```text
Academic only
Tasks and Notes
Chinese Learning
Academic Records
All personal data
```

Desktop should use an explicit save location chosen by the user.

Mobile should use the platform’s supported file-save/share flow.

## 7. Automatic Safety Checkpoints

Before high-risk operations, create a local recovery checkpoint.

Examples:

```text
Schema migration
Bulk import
Bulk curriculum edit
Bulk grade update
Full restore
Large sync reconciliation
```

Rules:

- A checkpoint must be created before changes begin.
- A failed operation must leave source data intact.
- Checkpoints should expire only under a documented retention policy.
- Do not consume unlimited storage silently.
- Clearly display the last successful checkpoint.

## 8. Restore Principles

Restore must be preview-first.

```text
Choose backup
        ↓
Validate archive and schema
        ↓
Open restore preview
        ↓
Show additions, changes, conflicts, invalid data
        ↓
User chooses action
        ↓
Apply safely
        ↓
Verify result
```

Do not immediately overwrite the current dataset after a user selects a backup file.

## 9. Restore Modes

Support these restore modes:

```text
Preview Only
Merge Missing Data
Restore Selected Categories
Restore into New/Empty Local Profile
Replace Current Data — Advanced, explicit confirmation only
```

Default recommendation:

```text
Preview Only
```

Rules:

- “Replace Current Data” requires a fresh safety checkpoint.
- Restore must preserve data added after the backup unless the user explicitly chooses replacement.
- Cloud-synced restore changes must pass through SYN-01 revision/conflict rules.
- Do not silently overwrite newer cloud data with an older backup.
- Show unresolved restore conflicts for review.

## 10. Backup Verification

A user must be able to verify a backup without restoring it.

Verification checks:

```text
Archive structure exists
Manifest is readable
Schema version is recognized
Checksums match
Required entities can be parsed
Referenced IDs are structurally valid
Record counts are available
```

Example result:

```text
Backup verified

Created: 15 August 2026
Academic terms: 4
Courses: 52
Course attempts: 36
Notes: 128
Tasks: 74
```

## 11. Readable Exports

Provide separate readable exports for personal review.

Examples:

```text
Transcript-style PDF/CSV
KHS-style PDF/CSV
Course list CSV/XLSX
Schedule PNG/JPG/PDF
Task list CSV
Notes export where existing Notes rules permit
```

Readable exports are not full backups.

They must not be presented as a restorable replacement for a full backup.

## 12. Safe Import Scope

Imports must be user-initiated and limited to supported data types.

Initial supported import targets:

```text
Course catalog
Curriculum requirements
Historical KHS/course attempts
Grades
Rooms
Lecturers
Academic Calendar events
```

Initial accepted file formats:

```text
CSV
XLSX, where reliable parser support exists
```

Do not support arbitrary undocumented files.

Do not scrape, log into, or automatically pull data from UM SIAKAD.

## 13. Import Workflow

Use a staged import process.

```text
Select file
        ↓
Choose import type
        ↓
Preview columns
        ↓
Map fields
        ↓
Validate rows
        ↓
Show errors/warnings/duplicates
        ↓
User confirms
        ↓
Create safety checkpoint
        ↓
Import transaction
        ↓
Show result report
```

Requirements:

- Never import directly into production data without preview.
- Import valid rows only when the user explicitly chooses partial import.
- Clearly identify invalid rows and their reasons.
- Provide a downloadable error report where useful.
- Preserve the original uploaded file only with user consent.

## 14. Import Field Mapping

Example KHS/course-attempt mapping:

```text
Source column             OmniLife field
------------------------------------------------
Semester                  Academic term
Kode Mata Kuliah          Course code
Nama Mata Kuliah          Course name
SKS                       Credits snapshot
Nilai Huruf               Grade letter
Nilai Angka               Numeric score
Status                    Course attempt status
```

Requirements:

- Allow the user to map columns manually.
- Save reusable mapping templates only with user approval.
- Never infer a grade scale without showing the assumption.
- Validate SKS as numeric values.
- Validate grade letters against the chosen Grade Scale.
- Create unmatched Courses only after preview confirmation.

## 15. Duplicate Detection

Imports must detect potential duplicates before writing data.

Potential matching signals:

```text
Stable external import ID, if supplied
Academic term + course code
Course code + course name
Existing linked StudyPlanItem
Existing CourseAttempt
```

Rules:

- Never use course name alone as a guaranteed unique identifier.
- Show confidence and matching reason.
- Let the user choose:

```text
Skip existing
Update existing
Create separate record
Review manually
```

- Repeated courses must not be incorrectly treated as accidental duplicates.

## 16. Transaction and Rollback Rules

For each import or migration:

```text
Validation
        ↓
Safety checkpoint
        ↓
Atomic write where practical
        ↓
Post-import validation
        ↓
Success report or rollback
```

Requirements:

- A failed import must not leave a partial invisible state.
- If partial import is chosen, report exactly which rows succeeded and failed.
- Preserve an operation log for recovery.
- Do not delete original source data during import.

## 17. Data Integrity Checks

Create automated integrity checks for:

```text
Broken foreign-key-like references
Missing course/class relationships
Invalid academic-term references
Invalid period ranges
Invalid grade scales
Invalid KRS credit snapshots
Orphaned AcademicResourceLinks
Duplicate stable IDs
Invalid sync ownership
Missing sync revisions
```

Provide a Data Health view:

```text
Data Health

✓ Academic references valid
✓ Backup verified
⚠ 2 Course Classes missing room
⚠ 1 grade needs verification
```

Each issue must have a non-destructive repair path.

## 18. Audit History

Provide concise audit history for meaningful academic changes.

Track at minimum:

```text
KRS status changes
KRS class add/drop actions
Schedule exceptions
Curriculum changes
CourseAttempt creation/edit
Grade changes
Bulk imports
Restores
Conflict resolutions
```

Audit entries should contain:

```text
Action
Date/time
Device/source where available
Affected entity
Result
```

Do not store excessive private content in audit logs, such as full note bodies, unless necessary for a user-requested restore feature.

## 19. Crash and Sync Recovery

Test and handle interruption safely.

Scenarios:

```text
App closes during offline edit
App closes during sync
Network disconnects during upload
Device restarts during scheduled import
PWA update occurs with pending outbox changes
Mobile background process stops
```

Requirements:

- Pending changes survive restart.
- Sync retries are idempotent.
- Duplicate records are prevented.
- App startup identifies incomplete operations and resumes or rolls back safely.
- The user sees a clear recovery message only when action is needed.

## 20. Database and Schema Migration Safety

Every data-schema change must include:

```text
Schema version
Migration script
Migration test
Pre-migration backup/checkpoint
Post-migration validation
Rollback/recovery strategy
Release note
```

Rules:

- Do not alter user tables manually in production.
- Do not ship destructive migrations without backup verification.
- Test migrations on representative anonymized data.
- Keep old app versions from corrupting newer data formats.
- Clearly prompt users when a migration is required.

## 21. Performance and Scalability

Optimize for realistic long-term personal use:

```text
Multiple academic terms
Hundreds of course records
Many notes and tasks
Years of calendar history
Cross-device synchronization
Large RPS reference lists
```

Requirements:

- Use indexed queries for common views.
- Paginate or incrementally load long transcripts and notes.
- Do not store every generated recurring class occurrence permanently.
- Keep Dashboard and Today’s Schedule fast from local data.
- Keep sync incremental rather than repeatedly uploading all data.
- Measure performance before introducing heavy caching or background jobs.

## 22. Accessibility and UX Quality

Test key academic workflows for:

```text
Keyboard navigation on Desktop
Touch navigation on Android
Screen reader labels
Readable contrast
Text scaling
Indonesian language clarity
Chinese/Hanzi/Pinyin rendering
Clear empty/error/offline states
```

Critical flows that must remain understandable:

```text
Create KRS
Resolve schedule conflict
Add grade
Read KHS
Export schedule
Create backup
Preview restore
Import historical course records
```

## 23. Privacy and Diagnostics

Reliability diagnostics must respect privacy.

```text
Allowed:
- Anonymous error category
- App version
- Device platform
- Sync operation status

Not allowed by default:
- Note contents
- Academic grades
- Course details
- User email
- Authentication credentials
```

Any optional diagnostic reporting requires clear user consent.

## 24. Documentation

Maintain user-facing documentation for:

```text
How sync works
How to create a backup
How to verify a backup
How to restore safely
How to import KHS/course data
What personal-record labels mean
How grade and repeat-course policies affect IPS/IPK
```

Maintain technical documentation for:

```text
Data dictionary
Backup format version
Migration history
Import templates
Sync contract
Recovery procedures
Release checklist
```

## 25. Explicitly Out of Scope

Do not implement:

```text
Automatic UM SIAKAD scraping/import
Official transcript verification
Automatic cloud storage account access
Public data sharing
Multi-user collaboration
Undocumented third-party file parsing
Automatic deletion of old backups
AI-based grade or graduation predictions
```

## 26. Testing Requirements

Test at minimum:

```text
1. Create and verify a full backup.
2. Restore a backup in Preview Only mode.
3. Merge selected restored records without deleting newer records.
4. Confirm replacement restore requires explicit confirmation and checkpoint.
5. Import valid KHS CSV/XLSX data through mapping preview.
6. Detect invalid SKS, grades, and academic terms before import.
7. Handle duplicate and repeated-course rows correctly.
8. Interrupt an import and confirm recovery/rollback behavior.
9. Interrupt sync and confirm outbox survives restart.
10. Run a schema migration against representative data.
11. Verify historical grades remain unchanged after grade-scale edits.
12. Test Data Health repair actions without destructive side effects.
13. Test backup/restore across Desktop, PWA, and Android.
14. Test PDF/CSV readable exports for expected academic records.
```

## 27. Acceptance Criteria

ACA-04 is complete when:

1. The user can create and verify a full backup.
2. Backup files are portable, versioned, and integrity-checked.
3. Sensitive backups can be encrypted using established technology.
4. Restore always begins with a preview and does not silently overwrite data.
5. Imports use mapping, validation, duplicate detection, checkpointing, and reporting.
6. Schema migrations have safe backup and validation procedures.
7. Sync, crash, and interrupted-operation recovery are tested.
8. Data Health can identify and guide repair of broken relationships.
9. Meaningful academic changes have concise audit history.
10. Core academic workflows are tested for accessibility, performance, and long-term use.

## 28. Academic Roadmap Completion

After ACA-04, the core Academic roadmap is complete:

```text
Academic Foundation
→ Secure Sync
→ RPS/Course Detail
→ KRS & Conflict Detection
→ Academic Calendar
→ Academic Dashboard
→ Study/Tasks/Notes/Chinese Learning Integration
→ Beautiful Schedule Export
→ Mobile PWA
→ Native Android Features
→ Curriculum, KHS, IPS/IPK, Transcript
→ Backup, Import, Reliability
```

Future work should be selected from real daily usage feedback rather than adding features by default.
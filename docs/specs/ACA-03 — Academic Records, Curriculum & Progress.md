# OmniLife — ACA-03  
## Academic Records, Curriculum & Progress

**Status:** Implementation Ready  
**Depends On:** ACA-02A through ACA-02G  
**Depends On:** SYN-01 — Secure Cloud Sync Foundation  
**Depends On:** MOBILE-01 / MOBILE-02 where available  
**Goal:** Build a personal academic-record system for curriculum tracking, course attempts, grades, KHS, IPS, IPK, transcript, and graduation progress.

## 1. Product Boundary

All academic records in OmniLife are personal records.

```text
Official UM SIAKAD
        ↓
User verifies information
        ↓
OmniLife personal academic record
```

OmniLife may store:

```text
Grades
KHS data
IPS
IPK
Course completion
Curriculum progress
Transcript-style history
```

OmniLife must not claim that these values are official unless the user manually verifies them against official records.

Use clear labels:

```text
Personal record
Manually entered
Verified by user
Needs verification
```

## 2. Core Data Principle

Separate:

```text
Curriculum requirement
        ≠
Course catalog
        ≠
KRS plan
        ≠
Course attempt
        ≠
Final grade
```

Example:

```text
Course
= Chinese Comprehensive 1

KRS item
= planned/selected Class B in Odd 2026/2027

Course attempt
= the user actually took the course in Odd 2026/2027

Grade
= final result for that attempt
```

Do not treat a planned KRS item as a final academic result.

## 3. ACA-03 Subphases

```text
ACA-03A — Curriculum Foundation
ACA-03B — Course Attempts, Grades & KHS
ACA-03C — Transcript, IPS/IPK & Progress Dashboard
```

Implement in that order.

## 4. Curriculum Foundation

Create curriculum versions so academic requirements can change without damaging historical records.

```text
Curriculum
- id
- programName
- curriculumName
- versionLabel
- effectiveFromTermId (optional)
- totalRequiredCredits
- status: draft | active | archived
- createdAt
- updatedAt
```

A curriculum contains structured requirements.

```text
CurriculumRequirement
- id
- curriculumId
- categoryId
- courseId (optional)
- requirementType: specific_course | elective_group | credit_minimum
- title
- minimumCredits
- required
- sortOrder
- note
```

Categories may include:

```text
University courses
Faculty courses
Program courses
Required courses
Elective courses
Internship / practicum
Thesis / final project
```

Do not assume a fixed UM curriculum structure. The user must be able to configure it.

## 5. Course Equivalency Preparation

Courses may be renamed, replaced, or treated as equivalent in different curriculum versions.

Prepare an equivalency model:

```text
CourseEquivalency
- id
- sourceCourseId
- equivalentCourseId
- equivalencyType: equivalent | replacement | transferred
- note
```

Do not automatically apply equivalencies to progress until the user confirms the mapping.

## 6. Course Attempt Model

Create a dedicated academic-record entity.

```text
CourseAttempt
- id
- academicTermId
- courseId
- linkedStudyPlanItemId (optional)
- courseCodeSnapshot
- courseNameSnapshot
- creditsSnapshot
- status: in_progress | completed | failed | withdrawn | incomplete
- gradeScaleId (optional)
- gradeLetter (optional)
- numericScore (optional)
- gradePointSnapshot (optional)
- countsTowardGpa
- countsCompletedCredits
- source: manual | migrated | imported
- verificationStatus: unverified | user_verified
- note (optional)
- createdAt
- updatedAt
```

Rules:

- Course snapshots protect historical records if a Course name/code later changes.
- A CourseAttempt may link to a KRS item but must remain valid when the KRS changes.
- A user can create historical attempts for semesters before OmniLife existed.
- A KRS item may create or link to an `in_progress` attempt only after explicit user confirmation.
- Do not create multiple attempts accidentally from one KRS item.

## 7. Grade Scale Configuration

Do not hardcode grade letters, score intervals, grade points, passing values, or GPA policies.

Create configurable grade scales.

```text
GradeScale
- id
- name
- institution/program context (optional)
- isActive
- createdAt
- updatedAt

GradeScaleItem
- id
- gradeScaleId
- letter
- minimumScore (optional)
- maximumScore (optional)
- gradePoint
- isPassing
- countsTowardGpa
- countsCompletedCredits
- sortOrder
```

Support non-standard outcomes:

```text
A, A-, B+, B, B-, C+, C, D, E
P / Pass
T / Incomplete
W / Withdrawn
Other institution-specific values
```

A grade point is stored as a snapshot in the CourseAttempt once assigned. Later grade-scale edits must not silently change historical IPS/IPK.

## 8. Grade Entry and Verification

Allow two entry methods:

```text
Letter grade entry
Numeric score entry
```

When a numeric score maps to a configured grade scale:

```text
Numeric score
        ↓
Grade scale lookup
        ↓
Suggested letter grade and grade point
```

The user may review before saving.

Show source and verification clearly:

```text
Source: Manually entered
Status: Needs verification
```

After checking official information:

```text
Status: Verified by user
```

Do not imply external verification or official university approval.

## 9. KHS View

Create a KHS-style personal view for each academic term.

```text
KHS
├── Academic term
├── Course attempts
├── Course code
├── Course name
├── SKS
├── Grade
├── Grade point
├── Status
└── Semester GPA / IPS
```

KHS rules:

- Show only CourseAttempts associated with the selected term.
- Mark incomplete or ungraded attempts clearly.
- Do not include ungraded courses in IPS unless grade policy says otherwise.
- Preserve withdrawn/failed attempts according to the chosen policy.
- Keep the personal-record label visible but unobtrusive.

## 10. IPS Calculation

Use a configurable calculation policy.

Default conceptual formula:

```text
IPS
=
sum(credits × grade point for GPA-counting attempts)
/
sum(credits for GPA-counting attempts)
```

Requirements:

- Use raw numeric values for calculations.
- Round only at display time.
- Display IPS to a consistent precision, such as two decimal places.
- If there are no eligible graded credits, display:

```text
Belum ada IPS yang dapat dihitung.
```

- Clearly show which courses are excluded from the calculation.

## 11. IPK Calculation

IPK is calculated from all eligible CourseAttempts according to a configurable repeat policy.

Supported repeat policies:

```text
Latest attempt counts
Highest grade counts
All attempts count
Manual review required
```

Do not assume the university’s official repeat-course policy.

The selected policy must be visible in settings and progress explanations.

Default recommendation:

```text
Manual review required
```

until the user confirms how their institution treats repeated courses.

## 12. Transcript View

Create a transcript-style personal history.

```text
Academic Transcript
├── Academic term
├── Course code
├── Course name
├── SKS
├── Grade
├── Grade point
├── Completion status
└── Verification status
```

Features:

```text
Filter by term
Filter by completed/in-progress
Search course name or code
Show only verified records
Show repeat attempts
```

Do not label it as an official transcript.

## 13. Curriculum Progress

Use Curriculum Requirements and verified CourseAttempts to calculate progress.

```text
Curriculum Requirement
        ↓
Matched CourseAttempt
        ↓
Completed credits / unmet credits
        ↓
Progress display
```

Example:

```text
Required Program Courses
28 / 40 SKS completed

Elective Courses
6 / 12 SKS completed

Overall
98 / 144 SKS completed
```

Rules:

- Count credits only when the attempt has a passing/completed status under the active grade policy.
- Do not count planned KRS credits as completed credits.
- Show in-progress credits separately.
- If a requirement mapping is incomplete, show “Needs mapping” rather than inaccurate progress.
- Do not hide failed, withdrawn, or incomplete attempts.

## 14. Academic Progress Interface

Create these main views:

```text
Curriculum
- Active curriculum
- Requirement categories
- Required/elective course mapping
- Credits completed/in progress/remaining

Academic Records
- KHS by term
- Add/edit Course Attempt
- Grade verification

Transcript
- Full personal academic history
- Filters and search

Progress
- Overall SKS completion
- Category progress
- In-progress courses
- Requirements needing attention
```

The Academic Dashboard from ACA-02E may later display verified progress summaries.

## 15. Integration with Existing Academic Features

```text
KRS
→ may link to in-progress CourseAttempt after confirmation

Course Workspace
→ may show course-attempt status and grade after entry

Academic Dashboard
→ may show verified SKS progress and latest IPS/IPK

Academic Calendar
→ remains independent of final grade records

Tasks / Notes / Study / Chinese Learning
→ remain linked to course context, not to copied grade data
```

Do not overwrite historical academic records when KRS, Course details, or RPS data changes.

## 16. Synchronization and Safety

All ACA-03 entities must use SYN-01.

Requirements:

```text
Offline grade entry
        ↓
Local save
        ↓
Sync after reconnection
        ↓
No duplicate CourseAttempt
```

Additional rules:

- Grade updates must keep revision history through sync metadata.
- Conflicting grade edits from different devices must require review.
- Curriculum edits must not silently recalculate historical results using new grade values.
- Back up before bulk migration/import.

## 17. Optional Import Preparation

Prepare a safe import path for future user-provided CSV/XLSX data.

Potential supported fields:

```text
Academic term
Course code
Course name
SKS
Grade
Status
```

For ACA-03:

```text
Manual entry is required.
Import preview and final import may be implemented only if reliable mapping and rollback are available.
```

Do not scrape, log into, or automatically import from UM SIAKAD.

## 18. Explicitly Out of Scope

Do not implement:

```text
Official UM SIAKAD connection
Official KHS/transcript verification
Automatic GPA policy inference
Graduation eligibility decision
Scholarship eligibility calculation
Academic prediction/AI recommendation
Public transcript sharing
Native file import from unknown external systems
```

## 19. Testing Requirements

Test at minimum:

```text
1. Create an active curriculum with required and elective requirements.
2. Record a historical CourseAttempt manually.
3. Link an in-progress KRS item to one CourseAttempt without duplication.
4. Enter a numeric score and verify grade-scale mapping.
5. Enter a manual letter grade.
6. Calculate IPS with eligible and excluded courses.
7. Calculate IPK using each repeat-course policy.
8. Confirm grade-scale changes do not alter historical grade-point snapshots.
9. Confirm curriculum progress excludes planned but unfinished KRS credits.
10. Confirm progress counts verified passing credits correctly.
11. Sync a grade entered offline without duplicate records.
12. Create an intentional competing grade edit and verify conflict handling.
```

## 20. Acceptance Criteria

ACA-03 is complete when:

1. The user can configure one or more curriculum versions.
2. Curriculum requirements support required, elective, and credit-based rules.
3. Historical and current CourseAttempts can be recorded safely.
4. Grades use configurable scales rather than hardcoded assumptions.
5. KHS-style personal records are available per term.
6. IPS and IPK calculate transparently from configured policies.
7. A personal transcript view is searchable and filterable.
8. Curriculum progress shows completed, in-progress, remaining, and unmapped requirements.
9. All data synchronizes safely across Desktop, PWA, and Android.
10. OmniLife never presents these records as official UM data.

## 21. Next Phase

After ACA-03 is complete:

```text
ACA-04 — Quality, Backup, Import & Long-Term Reliability
```

This phase focuses on backup/restore, safe imports, audit history, accessibility, performance, migration testing, and long-term data integrity.
# OmniLife — ACA-02C  
## Personal KRS & Schedule Intelligence

**Status:** Implementation Ready  
**Depends On:** ACA-02A — Academic Data & UM Schedule Foundation  
**Depends On:** SYN-01 — Secure Cloud Sync Foundation  
**Depends On:** ACA-02B — Course Detail, RPS & Lecturer Information  
**Goal:** Build a personal KRS system with course-class selection, SKS tracking, advisor status tracking, and reliable schedule-conflict detection.

## 1. Product Boundary

OmniLife KRS is a **personal planning and tracking system** inspired by SIAKAD.

It may record:

```text
Planned course classes
Selected SKS
Personal KRS status
Dosen PA information
Personal approval/revision notes
```

It must not claim to submit, approve, or alter official UM SIAKAD records.

Any approval status shown in OmniLife is clearly labelled:

```text
Personal tracking only
Update manually based on official SIAKAD or Dosen PA information.
```

## 2. Core Flow

```text
Choose Academic Term
        ↓
Create Study Plan / KRS
        ↓
Browse Course Classes
        ↓
Select Class
        ↓
Validate SKS, schedule, duplicate course, and incomplete data
        ↓
Resolve conflicts if necessary
        ↓
Mark as ready / submitted personally
        ↓
Track Dosen PA status
        ↓
View final weekly schedule
```

## 3. Required Data Model

Create equivalent models following the existing OmniLife architecture.

```text
StudyPlan
- id
- academicTermId
- title
- status
- advisorLecturerId (optional)
- maximumCredits (optional)
- targetCredits (optional)
- submittedAt (optional)
- reviewedAt (optional)
- advisorNote (optional)
- personalTrackingDisclaimerAcknowledged
- createdAt
- updatedAt

StudyPlanItem
- id
- studyPlanId
- courseClassId
- courseIdSnapshot
- courseNameSnapshot
- courseCodeSnapshot
- creditsSnapshot
- status: selected | dropped | completed
- note (optional)
- conflictOverrideReason (optional)
- createdAt
- updatedAt

StudyPlanStatusHistory
- id
- studyPlanId
- previousStatus
- nextStatus
- changedAt
- note (optional)
```

Use synchronized ownership and metadata from SYN-01.

## 4. KRS Status Model

Use clear personal tracking statuses:

```text
Draft
Ready for Review
Personally Submitted
Waiting for Dosen PA
Approved — Personal Record
Revision Requested
Rejected — Personal Record
Cancelled
```

Requirements:

- Status changes must be visible in a history timeline.
- A user may record the Dosen PA and a related note.
- Do not imply a real Dosen PA has logged in or approved inside OmniLife.
- Do not automatically mark a KRS approved.
- “Approved” must display the personal-tracking disclaimer.

## 5. Course-Class Selection

The user selects a **Course Class**, not only a Course.

Example:

```text
Chinese Comprehensive 1
Code: PMDR236001
Class: B
Credits: 3 SKS
Lecturer: …
Schedule:
Monday · Period 3–4 · Room A301
Wednesday · Period 1–2 · Room A301
```

The class picker must support:

```text
Search by course name
Search by course code
Filter by semester
Filter by course group
Filter by available / selected class
```

Before adding a class to the plan, OmniLife must run validation.

## 6. Credit / SKS Intelligence

Show live KRS totals:

```text
Selected: 20 SKS
Target: 20 SKS
Maximum: 24 SKS
Remaining: 4 SKS
```

Rules:

- Credits come from the selected Course/Class snapshot.
- Never calculate SKS using display strings.
- The maximum-credit value is user-configurable or entered from official information.
- Do not infer an official KRS limit from GPA unless that official rule is explicitly implemented later.
- A plan exceeding its configured maximum shows a blocking warning.
- A plan without a configured maximum remains usable but informs the user that no limit is set.

## 7. Schedule Resolution

A Study Plan must resolve every selected Course Class into its `ClassMeeting` records.

```text
StudyPlanItem
        ↓
CourseClass
        ↓
ClassMeeting
        ↓
Day + Period Range + Room
```

The weekly schedule view must use UM periods 1–14 and the active period profile of the academic term.

```text
Academic Term
        ↓
Active schedule profile
        ↓
Regular or Ramadan period timings
        ↓
Weekly KRS grid
```

Do not hardcode displayed times. Resolve them from `AcademicPeriodProfile` and `AcademicPeriod`.

## 8. Student Schedule Conflict Detection

A student schedule conflict exists when two selected class meetings have:

```text
Same academic term
Same day
Overlapping time range
```

For the standard UM period model, period ranges are inclusive.

Example:

```text
Chinese Comprehensive 1
Monday · Period 3–4

Kaligrafi Tiongkok
Monday · Period 4–5

Result:
Conflict at Period 4
```

The system must show:

```text
⚠ Schedule conflict

Chinese Comprehensive 1 — Class B
Monday · Period 3–4 · Room A301

conflicts with

Kaligrafi Tiongkok — Class A
Monday · Period 4–5 · Room B202
```

The conflict explanation must name:

- both course classes,
- overlapping day,
- overlapping periods,
- resolved time range where available,
- rooms.

## 9. Conflict Categories

Implement clear categories:

```text
Blocking
- Student has two selected classes at overlapping times.
- Invalid period range.
- Course class belongs to another academic term.
- Duplicate active selection of the same course class.
- Exceeds configured maximum SKS.

Warning
- Same course selected through two different classes.
- Selected class has no meeting schedule.
- Room data is missing.
- Lecturer data is missing.
- Schedule profile is incomplete.
- Room is double-booked among known course classes.
- Lecturer is assigned to overlapping known classes.
```

Room and lecturer collisions are data-quality warnings. They must not incorrectly block a student’s personal KRS unless they also cause a student schedule collision.

## 10. Conflict Resolution Policy

Rules:

```text
Draft
→ may be saved with warnings.

Ready for Review / Personally Submitted
→ cannot proceed while blocking conflicts remain.

Existing official schedule that appears conflicting
→ may be preserved as a draft with an explicit user explanation.
```

Do not silently allow a conflict and do not silently discard a selected class.

If an override is permitted for a special personal case, require:

```text
Conflict override reason
```

The override must remain visible in the KRS detail.

## 11. Duplicate Course Rule

Default behavior:

```text
One active Course selection per Study Plan.
```

If the user chooses another class for the same course:

```text
Offer:
- Replace currently selected class
- Keep as comparison only
- Cancel
```

Do not count two classes of the same course twice toward selected SKS by default.

Prepare the model for future repeated-course support, but do not implement it unless needed.

## 12. KRS Interface

Create these main screens.

```text
Rencana Studi / KRS List
- Academic term
- Status
- Selected SKS
- Conflict count
- Advisor status

KRS Detail
- Header: term, status, Dosen PA, SKS summary
- Selected classes
- Conflict warnings
- Approval/status timeline
- Personal notes
- Actions

Class Picker
- Search/filter
- Class schedule preview
- Lecturer and room
- SKS
- Conflict badge before selection

Weekly Schedule Preview
- Monday to Saturday/active academic days
- Period 1–14 grid
- Configured time labels
- Course name, class code, room
- Conflict highlighting
```

The weekly preview is functional and readable; polished export design belongs to ACA-02G.

## 13. Synchronization Requirements

KRS plans and KRS items must sync through SYN-01.

Required behavior:

```text
Create KRS draft on Desktop while offline
        ↓
Save locally
        ↓
Synchronize when connected
        ↓
Open the same KRS on Android/PWA later
```

After synchronization:

- Recalculate validation and conflict state locally.
- Do not trust an old cached conflict result permanently.
- Preserve unresolved edit conflicts using SYN-01’s conflict workflow.
- Never duplicate KRS items after sync retries.

## 14. Integration Boundaries

Prepare extension points only:

```text
KRS / Selected Class
  ├── Future Academic Calendar event generation
  ├── Future Task context
  ├── Future Study workspace
  ├── Future course notes
  └── Future Chinese Learning connection
```

Do not create those cross-module records in ACA-02C. They belong to ACA-02D and ACA-02F.

## 15. Explicitly Out of Scope

Do not implement:

```text
Official UM SIAKAD submission
Real Dosen PA login or approval
Academic Calendar generation
Academic Dashboard
Course notes or study workspace
Task creation
Chinese Learning automation
Schedule PNG/PDF export
Grades, KHS, IPS, IPK, or transcript
Android-specific UI
```

## 16. Testing Requirements

Test at minimum:

```text
1. Select a valid class
   → SKS increases correctly.

2. Select two classes that overlap at a period
   → blocking conflict is shown.

3. Select periods 3–4 and 4–5
   → conflict at period 4 is detected.

4. Select two meetings on different days
   → no student schedule conflict.

5. Select the same course via another class
   → replace/comparison flow appears.

6. Exceed configured maximum SKS
   → blocking warning is shown.

7. Save KRS while offline
   → it syncs after reconnection without duplicates.

8. Update KRS from another device
   → changed data appears and validation is recalculated.

9. Mark KRS as approved personally
   → disclaimer and status-history entry are visible.

10. Existing legacy or incomplete schedule data
    → remains visible as a warning, not deleted.
```

## 17. Acceptance Criteria

ACA-02C is complete when:

1. The user can create a KRS for an academic term.
2. The user selects specific course classes.
3. Selected SKS is calculated accurately.
4. Dosen PA can be linked as a personal academic advisor record.
5. Personal KRS status and history can be recorded.
6. Schedule conflicts are detected from day and period overlap.
7. Conflict messages explain exactly what overlaps.
8. A weekly period 1–14 schedule preview is available.
9. The KRS is safely synchronized across signed-in devices.
10. No official SIAKAD action is implied or attempted.

## 18. Next Phase

After ACA-02C is complete:

```text
ACA-02D — Academic Calendar & Class Event Integration
```

This phase will turn selected classes into managed academic calendar events, then connect UTS, UAS, holidays, registration windows, and academic deadlines.
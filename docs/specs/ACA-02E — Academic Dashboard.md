# OmniLife — ACA-02E  
## Academic Dashboard

**Status:** Implementation Ready  
**Depends On:** ACA-02A — Academic Data & UM Schedule Foundation  
**Depends On:** SYN-01 — Secure Cloud Sync Foundation  
**Depends On:** ACA-02B — Course Detail, RPS & Lecturer Information  
**Depends On:** ACA-02C — Personal KRS & Schedule Intelligence  
**Depends On:** ACA-02D — Academic Calendar & Class Event Integration  
**Goal:** Create a focused Academic Dashboard that summarizes the user’s current academic life from existing OmniLife data.

## 1. Core Principle

The Academic Dashboard is a **read model and action hub**, not a separate data store.

```text
KRS
Course Classes
Academic Calendar
Academic Events
Existing Tasks
Existing Study data
Sync state
        ↓
Academic Dashboard
```

Do not duplicate course, schedule, task, or calendar data into dashboard-specific records.

Every card must link back to its source.

## 2. Main User Question

When opening Academic, the dashboard should immediately answer:

```text
What is happening with my academic life today?
```

The dashboard must prioritize:

```text
Today’s classes
Next class
Upcoming academic events
KRS status
Important academic warnings
Current semester overview
```

## 3. Dashboard Layout

Recommended desktop layout:

```text
ACADEMIC
Odd Semester 2026/2027
Friday, 15 August 2026

[ Semester Overview ] [ KRS Status ] [ Sync Status ]

Today
[ Today’s Classes                  ] [ Next Academic Event ]

Upcoming
[ Upcoming Exams & Deadlines       ] [ Academic Tasks ]

Attention Needed
[ Conflict / Missing Schedule / KRS Warning ]

Quick Access
[ KRS ] [ Weekly Schedule ] [ Calendar ] [ Courses ] [ Lecturers ]
```

On smaller Android/PWA screens, show the same content in a single vertical order.

## 4. Semester Overview Card

Display only data that actually exists.

```text
Semester 3
Pendidikan Bahasa Mandarin

Selected This Term
20 SKS

KRS
Waiting for Dosen PA
```

Optional information when available:

```text
Academic advisor
Active period profile
Term start and end date
```

Do not show invented degree progress such as `20 / 144 SKS` unless curriculum and completed-credit data have been implemented.

Do not show IPK, IPS, KHS, or transcript data until ACA-03 provides real records.

## 5. KRS Status Card

Use the `StudyPlan` from ACA-02C.

Show:

```text
KRS status
Selected SKS
Configured maximum SKS, if available
Dosen PA, if assigned
Number of blocking conflicts
Last status update
```

Example:

```text
KRS
Waiting for Dosen PA

20 / 24 SKS
Advisor: Dr. …
No schedule conflicts

[ Open Rencana Studi ]
```

If the KRS is a personal record, preserve the disclaimer context without making the dashboard visually noisy.

## 6. Today’s Classes Card

Read class occurrences from ACA-02D.

Show all eligible class sessions for the current local date in `Asia/Jakarta`.

Each item should include:

```text
Resolved start–end time
Course name
Class code
Room
Cancelled/rescheduled status
```

Example:

```text
08:00–09:40
Chinese Comprehensive 1 — B
Room A301
```

Rules:

- Use the applicable Regular or Ramadan time profile for today.
- Show rescheduled classes at their replacement time.
- Show cancelled classes only when the user enables a cancelled-events filter.
- If there are no classes, use a calm empty state:

```text
Tidak ada kelas hari ini.
```

## 7. Next Class / Next Academic Event

Show the closest future academic occurrence.

Priority order:

```text
1. Next class session
2. Upcoming UTS/UAS/quiz
3. Upcoming academic deadline
4. Other manual academic event
```

Example:

```text
Next Class
Chinese Comprehensive 1 — B
Monday · 08:00–09:40
Room A301
In 2 days
```

The card must link to the source Course Class or Academic Calendar Event.

## 8. Upcoming Academic Events

Show a concise list of upcoming events from the Academic Calendar.

Recommended default window:

```text
Next 14 days
```

Include:

```text
UTS
UAS
Quiz
Assignment deadline
Registration/KRS window
Payment deadline
Holiday
Campus event
```

Each event should show:

```text
Date
Time or all-day label
Type
Course/class when linked
```

Do not display a long, overwhelming calendar list on the dashboard. Provide:

```text
[ Open Academic Calendar ]
```

## 9. Academic Tasks Card

Use existing task data only when it is already marked as academic or associated with academic context.

Show:

```text
Incomplete tasks
Nearest deadline
Overdue tasks
Course context when available
```

Example:

```text
⚠ Makalah Lintas Budaya
Due in 3 days
Course: Pemahaman Lintas Budaya
```

If task-to-course links do not yet exist, show academic-tagged tasks only.

Do not create or duplicate tasks in ACA-02E. Full Academic → Tasks integration belongs to ACA-02F.

## 10. Study and Chinese Learning Snapshot

Show only lightweight read-only summaries when existing data supports them.

Possible examples:

```text
Study
2 planned study sessions this week

Chinese Learning
5 review items due today
```

Rules:

- Do not create a second Study or Chinese Learning dashboard.
- Do not calculate new learning metrics in this phase.
- Hide cards whose source modules or data are unavailable.
- The card must link to the relevant existing module.

## 11. Attention Needed Card

Centralize important academic warnings:

```text
Blocking KRS schedule conflict
Configured SKS limit exceeded
Class meeting has missing room
Class meeting has no valid period profile
Academic event sync conflict
Pending synchronization problem
Upcoming overdue academic task
```

Prioritize:

```text
Blocking issue
        ↓
Warning
        ↓
Informational notice
```

Each warning must have a clear action:

```text
[ Resolve KRS Conflict ]
[ Complete Schedule Data ]
[ Review Sync Conflict ]
[ Open Task ]
```

Do not show irrelevant warnings when no action is needed.

## 12. Quick Access

Provide simple shortcuts:

```text
Rencana Studi / KRS
Weekly Schedule
Academic Calendar
Course Library
Lecturers
Academic Settings
```

Quick Access must navigate to existing modules. It must not duplicate their functionality inside the dashboard.

## 13. Dashboard State and Refresh

The dashboard should update when relevant local data changes:

```text
KRS change
Calendar exception change
Academic event change
Task change
Sync completion
```

Requirements:

- The dashboard remains usable offline using local data.
- Display the time of the latest successful sync when appropriate.
- Support manual refresh.
- Do not block dashboard rendering while every source is being refreshed from the cloud.
- Clearly distinguish “no data yet” from “data is loading.”

## 14. Empty and Error States

Examples:

```text
No active semester
→ “Select or create an active academic term to see your dashboard.”

No KRS yet
→ “Belum ada rencana studi untuk semester ini.”
   [ Create KRS ]

No classes today
→ “Tidak ada kelas hari ini.”

Offline
→ “Offline — perubahan tetap tersimpan di perangkat ini.”

Sync issue
→ “Some academic changes need sync attention.”
   [ Review Sync ]
```

Do not use empty states that imply missing official academic records are errors.

## 15. Privacy and Data Integrity

- The dashboard must respect the signed-in user’s data ownership from SYN-01.
- Never expose another user’s academic information.
- Do not store sensitive data solely for dashboard display.
- Do not modify KRS status, schedules, tasks, or calendar events merely because the dashboard is opened.

## 16. Explicitly Out of Scope

Do not implement:

```text
Grades, KHS, IPS, IPK, transcript
Curriculum graduation-progress calculation
Full Academic → Tasks integration
Automatic Study-session creation
Automatic Chinese Learning activity creation
Schedule export
Native Android-specific features
Push notifications
Google/Outlook calendar integration
Official UM SIAKAD integration
```

## 17. Testing Requirements

Test at minimum:

```text
1. Active semester and KRS summary render accurately.
2. Today’s classes use the correct date and period profile.
3. Rescheduled and cancelled class occurrences render correctly.
4. The next event links to the correct source.
5. Blocking KRS conflicts appear in Attention Needed.
6. Academic-tagged tasks appear without duplication.
7. Dashboard remains usable offline.
8. Dashboard refreshes after local or synchronized changes.
9. Empty states are shown when no term/KRS/classes exist.
10. Dashboard opening does not mutate source data.
```

## 18. Acceptance Criteria

ACA-02E is complete when:

1. Academic opens to a dedicated dashboard.
2. The dashboard shows the active term, KRS status, and selected SKS.
3. The user can see today’s classes and next academic event.
4. Upcoming exams, deadlines, and academic events are visible.
5. Important KRS, schedule, and sync issues are actionable.
6. Existing academic tasks and learning summaries appear only when source data exists.
7. Every card navigates to its real source data.
8. The dashboard works with offline local data.
9. No academic data is duplicated or silently modified.

## 19. Next Phase

After ACA-02E is complete:

```text
ACA-02F — Academic ↔ Study, Tasks, Notes & Chinese Learning Integration
```

This phase will connect each selected course to its study workspace, assignments, notes, exam preparation, and relevant Chinese Learning activity.
# OmniLife — ACA-01
## Academic & Study Integration

**Project:** OmniLife  
**Module:** Academic + Study  
**Phase:** ACA-01  
**Tier:** Academic System Foundation & Integration  
**Status:** Implementation Ready  
**Implementation Target:** Antigravity AI Agent

---

# 1. Objective

Refactor and integrate the existing OmniLife:

- Academic
- Study

systems into a unified personal academic management system.

The new system must be inspired by the structure and workflow of the user's university academic system, particularly the concept of:

- Semester
- Course
- Course Class
- KRS / Rencana Studi
- Academic Advisor / Dosen PA
- KRS approval
- Academic Schedule
- Academic Progress

However, OmniLife is NOT intended to become an exact clone of the university's SIAKAD.

Instead:

University Academic System
        ↓
Academic Data & Workflow Reference
        ↓
OmniLife Academic
        ↓
Personal Study Management
        ↓
Calendar / Tasks / Notes / Reminders / Exams / Learning

The objective is to make Academic and Study feel like two connected parts of one system.

---

# 2. Core Product Philosophy

The most important principle of ACA-01 is:

> A student should never need to enter the same academic information twice.

For example:

If a course exists in the current semester:

Chinese Comprehensif 1

the user should NOT need to separately create:

- a Study course
- a Calendar course
- a Task category
- an Exam course
- a Notes category

Instead:

Academic Course
      ↓
automatically becomes the canonical source
      ↓
Study
Calendar
Tasks
Assignments
Exams
Notes
Progress

All modules reference the same academic entity.

---

# 3. Academic vs Study

ACA-01 must clearly separate the concepts of:

## Academic

Academic represents the student's formal academic structure.

Examples:

- Student profile
- Program
- Semester
- Curriculum
- Course
- Course class
- KRS
- Academic advisor
- Academic status
- Academic history
- Grades
- KHS
- Transcript

## Study

Study represents what the student actually does to succeed academically.

Examples:

- Study sessions
- Study plans
- Notes
- Tasks
- Assignments
- Exam preparation
- Review
- Learning progress

The relationship:

Academic
    ↓
provides context
    ↓
Study

Study must NOT duplicate Academic data.

---

# 4. Existing Application Must Not Break

Before modifying anything:

1. Inspect the existing Academic module.
2. Inspect the existing Study module.
3. Inspect the existing Calendar.
4. Inspect the existing Tasks / To-Do system.
5. Inspect existing Notes.
6. Inspect existing Reminders.
7. Inspect existing Projects if relevant.
8. Inspect existing Chinese Learning.
9. Inspect existing localization.
10. Inspect existing persistence/database.
11. Inspect existing state management.
12. Inspect existing routing/navigation.
13. Inspect the current design system.

Follow existing OmniLife architecture and conventions.

Do NOT introduce a second architecture simply because another architecture might be technically possible.

Prefer refactoring existing systems over rebuilding them.

---

# 5. Critical Architecture Rule

Do NOT create duplicate sources of truth.

For example:

DO NOT create:

AcademicCourse
StudyCourse
CalendarCourse

if all three represent the same course.

Instead:

Course
    ↓
references from:
    ↓
Study
Calendar
Tasks
Notes
Exams

The Academic Course entity should be canonical.

---

# 6. High-Level Architecture

The intended architecture is:

OMNILIFE
│
├── Academic
│   │
│   ├── Overview
│   ├── Student Profile
│   ├── Semester
│   ├── Curriculum
│   ├── Courses
│   ├── Course Classes
│   ├── KRS
│   ├── Academic Advisor
│   ├── Schedule
│   ├── Attendance
│   ├── Exams
│   ├── KHS
│   ├── Transcript
│   ├── Academic Calendar
│   ├── Academic Services
│   └── Academic History
│
└── Study
    │
    ├── Study Dashboard
    ├── Study Sessions
    ├── Study Plans
    ├── Assignments
    ├── Notes
    ├── Tasks
    ├── Reminders
    ├── Exam Preparation
    └── Study Progress

Academic
    ↓
Context
    ↓
Study

Academic
    ↓
Calendar
Tasks
Notes
Reminders
Exams

Study
    ↓
Learning Activity
    ↓
Academic Progress

---

# 7. Semester

Introduce a canonical Semester entity.

A semester should contain at minimum:

- semesterId
- academicYear
- term
- displayName
- startDate
- endDate
- status

Example:

Gasal 2026/2027

or:

2026/2027 — Semester Ganjil

Possible statuses:

- Planned
- Active
- Completed
- Archived

---

# 8. Current Semester

The application must know which semester is currently active.

Example:

Current Semester:

Gasal 2026/2027

This should be used throughout:

- Academic
- Study
- Calendar
- Tasks
- Exams
- Dashboard
- Reports

The user should not have to repeatedly select the current semester.

---

# 9. Semester History

Previous semesters must remain accessible.

Example:

Academic History

├── Gasal 2026/2027
├── Genap 2026/2027
├── Gasal 2027/2028
└── ...

Selecting a semester should allow the user to inspect its academic data.

---

# 10. Student Academic Profile

Academic should have a student profile containing relevant academic information.

Possible fields:

- Student name
- Student ID
- Program
- Faculty
- Department
- Academic year / entry year
- Current semester
- Academic advisor
- Academic status

Do not duplicate general OmniLife personal profile data if it already exists.

Academic should reference the existing profile where possible.

---

# 11. Program / Study Program

Academic should support:

Program:

Pendidikan Bahasa Mandarin

and potentially:

- Faculty
- Department
- Degree level
- Curriculum year

The exact fields should follow the existing OmniLife data architecture.

---

# 12. Curriculum

Create a curriculum representation.

Conceptually:

Curriculum
│
├── Semester 1
│   ├── Course A
│   ├── Course B
│   └── Course C
│
├── Semester 2
│   ├── Course D
│   ├── Course E
│   └── Course F
│
└── ...

The curriculum represents the expected academic path.

---

# 13. Curriculum vs KRS

These are NOT the same.

Curriculum:

What the student is expected or allowed to take.

KRS:

What the student actually registers for a specific semester.

Example:

Curriculum
    ↓
Chinese Comprehensif 1

KRS Semester 1
    ↓
Chinese Comprehensif 1
    ↓
Selected

---

# 14. Course

Create a canonical Course entity.

A Course may contain:

- courseId
- courseCode
- courseName
- credits / SKS
- courseType
- semesterRecommendation
- prerequisites
- curriculum reference
- description

Example:

Course Code:

PMDR236001

Course Name:

Chinese Comprehensif 1

SKS:

8

---

# 15. Course Code

Course code must be unique within the academic context.

Example:

PMDR236001

Do not use course name as the primary identifier.

Course names may change.

Course code should be the stable academic reference where appropriate.

---

# 16. Course Class

A Course and Course Class are different concepts.

Example:

Course:

Chinese Comprehensif 1

Course Class:

B

Therefore:

Course
    ↓
Course Class

The Course Class may contain:

- classId
- courseId
- classCode
- lecturer
- room
- schedule
- capacity
- semester

---

# 17. Why Course Class Exists

The screenshot provided by the user shows:

Course
+
Class
+
SKS
+
Lecturer status
+
Action

Therefore the architecture must preserve this distinction.

Do not store class information directly inside Course if it can change every semester.

---

# 18. Lecturer

A course class may reference one or more lecturers.

Possible information:

- lecturerId
- name
- academic title
- contact information if provided
- role

Do not create duplicate lecturer records for each course.

---

# 19. Academic Advisor / Dosen PA

Academic must support:

Dosen PA / Academic Advisor

Possible data:

- advisorId
- name
- identifier if user chooses to store it
- program
- contact information
- notes

This person is associated with the student's academic profile.

---

# 20. KRS / Rencana Studi

Create a canonical KRS entity for each semester.

Example:

KRS
    ↓
Semester
    ↓
Gasal 2026/2027

A KRS contains selected courses/course classes.

---

# 21. KRS Structure

Conceptually:

KRS
│
├── Semester
├── Student
├── Selected Courses
├── Total SKS
├── Submission Status
├── Advisor Approval
└── Notes / History

---

# 22. KRS Status

KRS must support a clear lifecycle.

Recommended:

Not Started
    ↓
Draft
    ↓
Submitted
    ↓
Waiting for PA
    ↓
Approved
    ↓
Locked

Alternative branch:

Waiting for PA
    ↓
Revision Required
    ↓
Draft / Modification
    ↓
Resubmitted

---

# 23. KRS Status: Not Started

Meaning:

The student has not started preparing the KRS.

Display example:

KRS belum dibuat.

---

# 24. KRS Status: Draft

Meaning:

The student is currently preparing the KRS.

The student may:

- add courses
- remove courses
- change class
- inspect SKS
- review schedule

---

# 25. KRS Status: Submitted

Meaning:

The student submitted the KRS.

The student may no longer freely modify it depending on the university workflow.

---

# 26. KRS Status: Waiting for PA

Meaning:

The KRS has been submitted and is waiting for academic advisor approval.

This is directly inspired by the user's screenshot.

Example:

Status:

🟡 Menunggu Persetujuan Dosen PA

Display explanatory text:

Rencana studi telah dikirim dan sedang menunggu persetujuan Dosen PA.

---

# 27. KRS Status: Approved

Meaning:

The Dosen PA approved the KRS.

Display:

🟢 Disetujui

The system should record approval information where appropriate.

---

# 28. KRS Status: Revision Required

Meaning:

The Dosen PA requests changes.

Display:

🔴 Perlu Perbaikan

Show:

- advisor note
- requested modification
- date
- affected course if known

---

# 29. KRS Approval History

Do not simply overwrite status.

Preserve history where practical.

Example:

KRS History

2026-08-15
Submitted

2026-08-16
Revision Required

Note:
"Silakan mengganti mata kuliah X."

2026-08-17
Resubmitted

2026-08-18
Approved

This makes the system much more useful for personal records.

---

# 30. KRS Screenshot-Inspired Table

The KRS interface should support the information shown in the user's provided screenshot.

Recommended columns:

| # | Kode | Mata Kuliah | SKS | Kelas | Status PA | Action |
|---|---|---|---:|---|---|---|

Example:

| # | Kode | Mata Kuliah | SKS | Kelas | Status PA | Action |
|---|---|---|---:|---|---|---|
| 1 | PMDR236001 | Chinese Comprehensif 1 | 8 | B | Menunggu PA | Actions |
| 2 | PMDR236009 | Pemahaman Lintas Budaya | 2 | B | Menunggu PA | Actions |
| 3 | PMDR236010 | Kaligrafi Tiongkok | 2 | B | Menunggu PA | Actions |
| 4 | PMDR236026 | Kesenian Tiongkok | 2 | B | Menunggu PA | Actions |
| 5 | UNIV236001 | Pendidikan Agama Islam | 3 | B7 | Menunggu PA | Actions |
| 6 | UNIV236012 | Perkembangan Peserta Didik | 3 | B9 | Menunggu PA | Actions |

Bottom summary:

Total SKS:

20

The exact visual design should follow OmniLife's current design system.

---

# 31. KRS Action Menu

The Action menu may contain:

- View Course
- View Class
- View Schedule
- View Lecturer
- Add Note
- Remove Course
- Change Class
- View Related Tasks

Only show actions that are valid for the current KRS status.

---

# 32. KRS Modification

When status allows modification, support:

- Add course
- Remove course
- Change class

The system should recalculate:

Total SKS

automatically.

---

# 33. SKS Calculation

Total SKS must be calculated from selected Course records.

Example:

8
+
2
+
2
+
2
+
3
+
3

=

20 SKS

Do not allow the user to manually type the total.

---

# 34. SKS Validation

Prepare the system to support:

- minimum SKS
- maximum SKS
- prerequisite restrictions
- course conflicts
- schedule conflicts

The exact rules should be configurable.

Do not hardcode university-specific rules unless necessary.

---

# 35. Course Conflict

The system should be able to detect if two selected classes overlap.

Example:

Course A:

08:00–10:00

Course B:

09:00–11:00

Result:

⚠️ Schedule Conflict

---

# 36. Prerequisite Foundation

Prepare Course relationships for:

Course A
    ↓
Prerequisite
    ↓
Course B

Example:

Chinese Comprehensif 1
    ↓
prerequisite
    ↓
Chinese Comprehensif 2

Do not build an advanced prerequisite engine unless required.

---

# 37. Academic Schedule

Every selected Course Class may generate an academic schedule.

Example:

Chinese Comprehensif 1

Monday
08:00–11:20

Room:

...

Lecturer:

...

---

# 38. Schedule Integration

Academic Schedule must connect directly to OmniLife Calendar.

Do NOT create an isolated academic calendar.

The canonical relationship:

Course Class
    ↓
Recurring Schedule
    ↓
Calendar Event

---

# 39. Recurring Academic Events

Academic schedules are usually recurring.

Example:

Monday
08:00–11:20

repeat:

Weekly

until:

semester end

The calendar should support recurring events instead of creating 16 manually duplicated events.

---

# 40. Calendar Integration

When a course becomes active:

Course
    ↓
Course Class
    ↓
Schedule
    ↓
Calendar

The user should be able to see academic events in the existing OmniLife Calendar.

---

# 41. Calendar Event Metadata

Academic calendar events should reference:

- courseId
- courseClassId
- semesterId

This allows the user to open:

Calendar Event
    ↓
Course
    ↓
Course Detail

---

# 42. Attendance Foundation

Prepare the architecture for attendance.

Course
    ↓
Meeting
    ↓
Attendance

Possible status:

- Present
- Late
- Excused
- Absent
- Not Recorded

Do not implement external university attendance integration.

This is a personal tracker.

---

# 43. Attendance Dashboard

A course may eventually show:

Attendance:

12 / 14

Attendance Rate:

85.7%

This should be derived from attendance records.

---

# 44. Study Integration

Every active course must be usable as a Study context.

Example:

Chinese Comprehensif 1
    ↓
Study

The user can create:

- Study Session
- Task
- Assignment
- Note
- Exam preparation
- Reminder

without recreating the course.

---

# 45. Study Session

A Study Session should reference the Course.

Example:

Study Session

Course:

Chinese Comprehensif 1

Topic:

Chapter 3

Duration:

60 minutes

Status:

Completed

---

# 46. Study Session → Calendar

A study session may optionally become a Calendar event.

Example:

Wednesday
19:00–20:00

Study:

Chinese Comprehensif 1 — Chapter 3

The user should not have to duplicate the information.

---

# 47. Study Session → Task

A Study Session can be created from a Task.

Example:

Task:

Study Chapter 3

When scheduled:

Task
    ↓
Study Session

After completion:

Task Completed
+
Study Session Recorded

---

# 48. Assignments

Assignments must reference a Course.

Example:

Assignment

Course:

Pemahaman Lintas Budaya

Title:

Makalah Budaya Tiongkok

Due:

2026-09-10

Status:

In Progress

---

# 49. Assignment Integration

An assignment should automatically appear in:

- Study
- Tasks
- Calendar if a deadline exists
- Course detail

Do NOT duplicate the assignment.

---

# 50. Assignment Lifecycle

Support:

Not Started
    ↓
In Progress
    ↓
Submitted
    ↓
Completed

Optional:

Overdue

---

# 51. Assignment Reminder

Assignments with deadlines may create reminders.

Example:

Assignment due:

September 10

Reminder:

September 8

The reminder references the assignment.

---

# 52. Notes Integration

Notes should be able to reference a Course.

Example:

Note:

Chinese Comprehensif — Chapter 1

Course:

Chinese Comprehensif 1

This allows Course Detail to show:

Related Notes

---

# 53. Notes Must Not Be Duplicated

Do not create:

AcademicNotes

and

StudyNotes

if the existing OmniLife Notes system already supports linking.

Instead:

Existing Note
    ↓
linkedCourseId

---

# 54. Exam

Create a canonical academic Exam entity.

Possible types:

- Quiz
- UTS
- UAS
- Midterm
- Final
- Presentation
- Other

Each exam references:

- course
- semester
- date
- time
- location
- notes

---

# 55. Exam Integration

Exam should automatically connect to:

- Calendar
- Tasks
- Reminders
- Study
- Course

Example:

Exam
    ↓
Calendar Event

Exam
    ↓
Study Plan

Exam
    ↓
Reminder

---

# 56. Exam Preparation

The system should support preparation planning.

Example:

Exam:

UTS Chinese Comprehensif 1

Preparation:

H-14
Review Chapter 1

H-10
Review Chapter 2

H-7
Practice

H-3
Mock Test

H-1
Final Review

This may reuse the existing Task / Project / Routine infrastructure.

---

# 57. Grade / Nilai

Prepare a canonical Grade entity.

Possible fields:

- courseId
- semesterId
- gradeLetter
- gradePoint
- credits
- status
- publishedAt

Do not calculate or invent grades.

The user must explicitly enter or import them.

---

# 58. KHS

Create a KHS view per semester.

Example:

KHS
Semester:

Gasal 2026/2027

| Kode | Mata Kuliah | SKS | Nilai | Bobot |
|---|---|---:|---|---:|
| PMDR236001 | Chinese Comprehensif 1 | 8 | - | - |
| PMDR236009 | Pemahaman Lintas Budaya | 2 | - | - |

Summary:

Total SKS:

20

IPS:

-

IPK:

-

---

# 59. IPS

IPS represents semester performance.

Conceptually:

IPS =
Σ(SKS × Grade Point)
/
ΣSKS

Use the existing grading model if OmniLife already has one.

Do not duplicate calculation logic.

---

# 60. IPK

IPK represents cumulative academic performance.

It should be calculated from completed semesters.

Do not let the user manually enter IPK if it can be calculated from academic records.

---

# 61. Transcript

Create an academic Transcript view.

Transcript represents cumulative academic history.

It should include:

- all completed courses
- credits
- grades
- grade points
- cumulative SKS
- cumulative GPA/IPK

KHS and Transcript must remain conceptually different.

---

# 62. Academic Progress

Create a progress view.

Example:

Program Progress

████████░░░░░░░░

42 / 144 SKS

29%

Possible additional metrics:

- completed courses
- active courses
- remaining courses
- failed courses
- required courses
- elective courses

Only display metrics supported by available data.

---

# 63. Curriculum Progress

Curriculum should indicate course status.

Possible states:

- Planned
- Available
- Enrolled
- Passed
- Failed
- Waived
- Not Taken

Visual examples:

🟢 Passed

🔵 Enrolled

🟡 Planned

🔴 Failed

⚪ Not Taken

---

# 64. Academic Dashboard

Academic must have a useful dashboard.

Do NOT immediately dump the user into a large table.

Recommended:

Academic

Gasal 2026/2027

┌─────────────────────────────┐
│ IPK                         │
│ --                          │
└─────────────────────────────┘

┌─────────────────────────────┐
│ Current SKS                 │
│ 20                          │
└─────────────────────────────┘

┌─────────────────────────────┐
│ KRS                         │
│ 🟡 Menunggu Persetujuan PA  │
└─────────────────────────────┘

Then:

Today's Classes

Upcoming Assignments

Upcoming Exams

Study Progress

Academic Alerts

---

# 65. Academic Alerts

Academic should highlight important conditions.

Examples:

🟡 KRS menunggu persetujuan Dosen PA.

🔴 Assignment overdue.

🟡 Exam in 3 days.

🟢 KRS approved.

⚠️ Schedule conflict detected.

Do not overwhelm the dashboard.

Only show actionable alerts.

---

# 66. Academic Calendar

Create an Academic Calendar section.

It should support events such as:

- Registration
- KRS period
- KRS modification
- Approval period
- Lecture period
- UTS
- UAS
- Grade publication
- Academic holidays
- Semester end

The exact events and dates should be user-configurable.

Do not hardcode a specific university calendar permanently.

---

# 67. Academic Calendar → OmniLife Calendar

Academic Calendar events should be integrated into the existing OmniLife Calendar where appropriate.

Avoid duplicate calendar implementations.

---

# 68. Academic Services

Prepare an Academic Services section.

Potential services:

- Active Student Letter
- Academic Leave
- Reactivation
- Transcript Request
- Grade Appeal
- Other academic administration

Important:

This is a PERSONAL TRACKER.

OmniLife does NOT directly submit requests to the university unless a future official integration exists.

---

# 69. Service Request Tracker

A service request may have:

- serviceId
- type
- submissionDate
- status
- notes
- documents
- completionDate

Statuses:

Draft
Submitted
Processing
Need Revision
Approved
Rejected
Completed

---

# 70. Grade Appeal

Prepare support for a Grade Appeal record.

Example:

Course:

Chinese Comprehensif 1

Current Grade:

B

Reason:

...

Status:

Submitted

This is only a personal record unless official integration is later implemented.

---

# 71. Academic Financial Information

Prepare a lightweight academic financial status area.

Potential information:

- current tuition / UKT status
- payment status
- payment date
- semester
- payment notes

Do NOT build a payment gateway.

Do NOT claim payment information is synchronized with the university.

This is a personal academic record unless an official integration exists.

---

# 72. Academic Status

Academic profile should support statuses such as:

- Active
- Inactive
- Academic Leave
- Graduated
- Other

The system should not automatically infer these statuses from unrelated data.

---

# 73. Study Dashboard

The Study dashboard should be redesigned around Academic context.

Example:

Study

Current Semester:

Gasal 2026/2027

Today:

Chinese Comprehensif 1
Study Chapter 3

Upcoming:

Assignment — Pemahaman Lintas Budaya

Exam:

UTS — Chinese Comprehensif 1

---

# 74. Study by Course

Allow the user to view:

Study
    ↓
Courses

Each course displays:

- study progress
- pending assignments
- notes
- upcoming exams
- study sessions
- related tasks

---

# 75. Course Detail

Course Detail becomes the central academic workspace.

Example:

# Chinese Comprehensif 1

PMDR236001

8 SKS
Class B

Lecturer:
...

Schedule:
Monday
08:00–11:20

Tabs / sections:

Overview
Schedule
Assignments
Notes
Materials
Study
Exams
Attendance
Grades

---

# 76. Chinese Learning Integration

Chinese Learning must be able to reference Academic Courses.

This is especially important for:

Chinese Comprehensif 1
Chinese Comprehensif 2
Grammar
Listening
Reading
Speaking
etc.

A Chinese Learning item may optionally reference:

Related Course:

Chinese Comprehensif 1

---

# 77. Chinese Learning Example

Vocabulary:

你好

Pinyin:

nǐ hǎo

Meaning:

hello

Related Academic Course:

Chinese Comprehensif 1

The vocabulary remains inside Chinese Learning.

The course remains inside Academic.

The relationship connects them.

---

# 78. Chinese Learning → Study

A user can create:

Study Session

Course:

Chinese Comprehensif 1

Focus:

Vocabulary

The session can open Chinese Learning content.

---

# 79. Academic → Chinese Learning

Course Detail may show:

Chinese Learning

12 related vocabulary items

8 Hanzi

3 grammar topics

2 listening exercises

This is an optional integration layer.

Do not duplicate Chinese Learning content.

---

# 80. Task Integration

Every academic task must reference its source.

Example:

Task:

Finish Chapter 3 Assignment

Source:

Assignment

Course:

Chinese Comprehensif 1

Semester:

Gasal 2026/2027

This allows OmniLife to show context everywhere.

---

# 81. Reminder Integration

Reminders should reference their parent entity.

Example:

Reminder

"Submit Chinese Comprehensif assignment"

Parent:

Assignment

Course:

Chinese Comprehensif 1

Do not create disconnected reminders.

---

# 82. Search Integration

OmniLife's global search should eventually be able to find:

- course
- course code
- lecturer
- assignment
- exam
- note
- study session
- KRS
- semester

ACA-01 should prepare the data structure for this.

Do not necessarily redesign global search unless required.

---

# 83. Navigation

Simplify navigation.

Recommended:

Academic
│
├── Overview
├── Rencana Studi
├── Courses
├── Schedule
├── Grades
├── Curriculum
└── Services

Study
│
├── Overview
├── Tasks
├── Assignments
├── Study Sessions
└── Notes

Do not expose every sub-feature at the top-level navigation.

---

# 84. Academic Navigation Philosophy

The UI should not feel like a giant database.

Primary navigation should focus on:

1. What do I need to do?
2. What classes do I have?
3. What do I need to study?
4. What is due?
5. What are my results?

Advanced records should be accessible without dominating the main UI.

---

# 85. UX Rule

The user should be able to answer these questions quickly:

- What semester am I in?
- How many SKS am I taking?
- Is my KRS approved?
- What class do I have today?
- What assignment is due next?
- When is my next exam?
- What do I need to study?
- What is my current GPA/IPK?
- How far am I through my degree?

If the interface cannot answer these questions quickly, revise the UX.

---

# 86. Responsive UI

Academic must work on:

- Desktop
- Tablet
- Mobile

Desktop may use tables.

Mobile should transform dense tables into:

Course Cards

Example:

Chinese Comprehensif 1

PMDR236001

8 SKS · Class B

🟡 Menunggu PA

[View]

Do not force a huge horizontal table onto mobile.

---

# 87. Localization

All user-facing text must use OmniLife localization.

Required languages:

- Indonesian
- English

Example:

Indonesian:

Rencana Studi

English:

Study Plan

Indonesian:

Menunggu Persetujuan Dosen PA

English:

Waiting for Academic Advisor Approval

Do not hardcode user-facing strings.

---

# 88. Data Relationships

The following relationships should exist conceptually:

Student
    ↓
Program
    ↓
Curriculum
    ↓
Semester
    ↓
KRS
    ↓
Course Selection
    ↓
Course Class
    ↓
Schedule
    ↓
Calendar

Course
    ↓
Assignment
    ↓
Task
    ↓
Reminder

Course
    ↓
Exam
    ↓
Calendar
    ↓
Study Plan

Course
    ↓
Notes

Course
    ↓
Study Session

Course
    ↓
Grade
    ↓
KHS
    ↓
Transcript

Course
    ↓
Chinese Learning
    ↓
Vocabulary
Hanzi
Grammar
Listening
Review

---

# 89. Source of Truth Rules

The following must be canonical:

Semester
    → Academic

Course
    → Academic

Course Class
    → Academic

KRS
    → Academic

Schedule
    → Academic

Grade
    → Academic

Assignment
    → Assignment entity

Exam
    → Exam entity

Note
    → Existing Notes system

Task
    → Existing Tasks system

Calendar Event
    → Existing Calendar system

Reminder
    → Existing Reminder system

Chinese Vocabulary
    → Chinese Learning system

Do not duplicate these entities.

---

# 90. Referential Integrity

When deleting or modifying academic data:

Do not silently delete dependent personal records.

Example:

Deleting a Course should NOT automatically destroy:

- notes
- study sessions
- completed assignments
- historical grades

Use archival or soft-delete semantics where appropriate.

---

# 91. Historical Integrity

Completed semesters must be treated as historical records.

Example:

Gasal 2026/2027

After completion:

- KRS becomes historical
- courses remain
- grades remain
- study sessions remain
- notes remain
- assignments remain

Do not allow changing historical data accidentally.

---

# 92. Semester Archiving

At semester completion:

Current Semester
    ↓
Completed Semester
    ↓
Archived Academic Context

The user can still open it.

Archive means:

not actively editable by default

not:

deleted

---

# 93. Current Semester Switching

Allow the user to inspect another semester.

Example:

Current:

Gasal 2026/2027

User selects:

Genap 2026/2027

The UI changes context but must not accidentally change the actual active semester.

Distinguish:

Active Semester

from:

Viewing Semester

---

# 94. Academic Dashboard Context

Always show:

Viewing:

Gasal 2026/2027

If the user is viewing an old semester, make that clear.

---

# 95. Validation

Validate:

- duplicate course selection
- invalid SKS
- schedule conflict
- missing semester
- missing course
- missing class
- invalid grade
- duplicate KRS
- duplicate semester
- invalid date ranges

---

# 96. Error Handling

Never crash because academic data is incomplete.

Examples:

Missing lecturer:

Lecturer information unavailable.

Missing schedule:

Schedule not yet configured.

Missing grade:

Grade not published.

Missing KRS approval:

Approval status unavailable.

---

# 97. Offline-First Philosophy

Academic records should remain available offline.

The user should be able to inspect:

- courses
- KRS
- schedules
- notes
- assignments
- exams
- study sessions
- grades

without internet.

Do not require external university connectivity.

---

# 98. No Fake University Integration

This is extremely important.

ACA-01 is NOT a real-time SIAKAD connector.

Do NOT pretend OmniLife is synchronized with UM.

Do NOT implement fake:

- automatic PA approval
- automatic university grade retrieval
- automatic KRS submission
- fake university API

Unless a real official integration is added in a future phase.

---

# 99. Manual Academic Data

For now, academic information may be manually entered by the user.

The user can create:

Semester
Course
Class
Schedule
KRS
Assignment
Exam
Grade
etc.

This is acceptable.

---

# 100. Future Import Architecture

Prepare the architecture for future import.

Possible future sources:

- CSV
- Excel
- PDF
- official API
- university system export

But do NOT implement all import formats in ACA-01.

---

# 101. Future University Integration

A future integration could theoretically become:

Official University System
        ↓
Authenticated Integration
        ↓
OmniLife Academic Sync
        ↓
Local Academic Database

Potential synced data:

- Course
- KRS
- Schedule
- Grades
- Academic Calendar

However:

Only implement this if an official and legitimate integration mechanism is available.

---

# 102. Do Not Scrape SIAKAD

Do not implement:

- password scraping
- browser automation
- unauthorized scraping
- credential storage
- unofficial login interception

ACA-01 must remain a local personal academic manager.

---

# 103. Security

Academic data can contain sensitive personal information.

Protect:

- student ID
- lecturer information
- academic records
- grades
- documents

Follow existing OmniLife security architecture.

Do not log sensitive information unnecessarily.

---

# 104. Document Attachments

Academic entities may eventually support attachments.

Examples:

Assignment:
- PDF
- DOCX

Academic Service:
- supporting documents

Course:
- syllabus

Do not build a new file-management system if OmniLife already has one.

Reuse existing document/file infrastructure.

---

# 105. Academic Materials

Course Detail should eventually be able to reference:

- lecture materials
- PDFs
- links
- notes
- slides
- assignments

ACA-01 only needs to prepare the relationship.

---

# 106. Course Dashboard

Course Detail should become the central hub for a course.

Example:

# Chinese Comprehensif 1

8 SKS · B

Lecturer:
...

Schedule:
Monday · 08:00–11:20

---

Progress

Attendance:
12 / 14

Assignments:
4 / 5 completed

Study:
8 sessions

Exam:
UTS in 14 days

---

Quick Actions:

[Notes]
[Tasks]
[Study]
[Assignments]
[Exam]
[Calendar]

---

# 107. Academic Overview

Recommended layout:

Academic

Gasal 2026/2027

KRS
🟡 Menunggu PA

20 SKS

Today's Classes

Upcoming Assignments

Upcoming Exams

Academic Alerts

Progress

This should be the primary Academic landing page.

---

# 108. Study Overview

Recommended layout:

Study

Gasal 2026/2027

Today's Study

Upcoming Tasks

Upcoming Assignments

Upcoming Exams

Study Progress

Recent Notes

This should be the primary Study landing page.

---

# 109. Relationship Between Academic and Study

The relationship should be visually understandable.

Example:

Academic Course

Chinese Comprehensif 1

↓

Study

8 Study Sessions

↓

Tasks

3 Pending

↓

Assignments

1 Due Soon

↓

Exam

UTS in 14 days

This provides a complete academic context.

---

# 110. Academic → Task Example

Course:

Chinese Comprehensif 1

Assignment:

Chapter 3 Exercise

Due:

Friday

Task automatically becomes:

Complete Chapter 3 Exercise

Course:

Chinese Comprehensif 1

Due:

Friday

The task should not need the user to manually select the course again.

---

# 111. Academic → Calendar Example

Course:

Chinese Comprehensif 1

Schedule:

Monday
08:00–11:20

Calendar automatically displays:

Chinese Comprehensif 1

The event can open the Course Detail.

---

# 112. Academic → Study Example

Course:

Chinese Comprehensif 1

User presses:

Study

OmniLife creates:

Study Session

Course:

Chinese Comprehensif 1

The user chooses the topic.

---

# 113. Academic → Notes Example

Inside Course Detail:

Notes

[+ New Note]

The new note automatically gets:

Course:

Chinese Comprehensif 1

No additional selection is required.

---

# 114. Academic → Exam Example

Inside Course Detail:

Exams

[+ Add Exam]

The user enters:

UTS

Date

Time

Location

The system can then:

- display in Course
- display in Academic
- display in Calendar
- create reminder
- suggest Study Plan

---

# 115. Study → Academic Context

A Study Session created from a course must preserve its course context.

Example:

Study Session:

Review Chapter 4

Course:

Chinese Comprehensif 1

Semester:

Gasal 2026/2027

---

# 116. Academic Search

Search should eventually support:

"Chinese"

→ Chinese Comprehensif 1

"PMDR236001"

→ Course

"UTS"

→ Upcoming exam

"Makalah"

→ Assignment

This should use the existing global search architecture.

---

# 117. Testing Strategy

ACA-01 must include tests.

## 117.1 Semester Test

Create semester.

Verify:

- unique identity
- dates
- status
- current semester behavior

## 117.2 Course Test

Create course.

Verify:

- course code
- name
- SKS

## 117.3 Course Class Test

Verify:

Course
    ↓
Course Class

relationship.

## 117.4 KRS Test

Create KRS.

Add:

20 SKS.

Verify total:

20 SKS.

## 117.5 KRS Status Test

Verify:

Not Started
→ Draft
→ Submitted
→ Waiting for PA
→ Approved

## 117.6 Revision Test

Verify:

Waiting for PA
→ Revision Required
→ Draft
→ Submitted
→ Approved

## 117.7 KRS History Test

Verify status history remains accessible.

## 117.8 SKS Validation Test

Verify total SKS recalculates automatically.

## 117.9 Schedule Conflict Test

Create overlapping classes.

Verify conflict warning.

## 117.10 Calendar Integration Test

Create Course Class Schedule.

Verify Calendar event exists.

## 117.11 Recurring Schedule Test

Verify weekly schedule generates correctly without creating unnecessary duplicate entities.

## 117.12 Assignment Integration Test

Create Assignment.

Verify it is visible in:

- Course
- Study
- Tasks

## 117.13 Assignment Reminder Test

Verify reminder references the Assignment.

## 117.14 Exam Integration Test

Create Exam.

Verify:

- Course connection
- Calendar connection
- Study preparation capability

## 117.15 Notes Integration Test

Create Course Note.

Verify:

Course → Notes

relationship.

## 117.16 Study Session Test

Create Study Session from Course.

Verify course context is automatically attached.

## 117.17 Grade Test

Add grade.

Verify:

KHS

updates.

## 117.18 IPS Test

Verify semester GPA calculation.

## 117.19 IPK Test

Verify cumulative GPA calculation.

## 117.20 Transcript Test

Verify completed courses appear in transcript.

## 117.21 Semester Archive Test

Complete semester.

Verify:

- data remains accessible
- historical records remain intact
- current semester remains correct

## 117.22 Chinese Learning Integration Test

Link a Chinese Learning item to:

Chinese Comprehensif 1

Verify the relationship works without duplicating the vocabulary record.

## 117.23 Localization Test

Verify Indonesian.

Verify English.

## 117.24 Responsive Test

Verify:

- desktop
- tablet
- mobile

## 117.25 Existing Feature Regression Test

Verify all existing OmniLife functionality remains functional.

---

# 118. Definition of Done

ACA-01 is complete only when:

- [ ] Existing Academic architecture has been inspected.
- [ ] Existing Study architecture has been inspected.
- [ ] Existing Calendar architecture has been inspected.
- [ ] Existing Tasks architecture has been inspected.
- [ ] Existing Notes architecture has been inspected.
- [ ] Existing Chinese Learning architecture has been inspected.
- [ ] Existing systems are reused where possible.
- [ ] Semester entity exists.
- [ ] Current semester exists.
- [ ] Semester history exists.
- [ ] Academic profile exists or integrates with existing profile.
- [ ] Program is represented.
- [ ] Curriculum foundation exists.
- [ ] Course entity exists.
- [ ] Course Code exists.
- [ ] Course Class exists.
- [ ] Lecturer relationship exists.
- [ ] Dosen PA relationship exists.
- [ ] KRS exists.
- [ ] KRS course selection exists.
- [ ] KRS total SKS is calculated.
- [ ] KRS status lifecycle exists.
- [ ] Waiting for PA exists.
- [ ] Approved exists.
- [ ] Revision Required exists.
- [ ] KRS history is preserved.
- [ ] KRS modification is supported where status permits.
- [ ] Schedule exists.
- [ ] Schedule conflicts are detected.
- [ ] Recurring academic schedule is supported.
- [ ] Academic schedule integrates with Calendar.
- [ ] Course integrates with Study.
- [ ] Course integrates with Tasks.
- [ ] Course integrates with Assignments.
- [ ] Course integrates with Notes.
- [ ] Course integrates with Exams.
- [ ] Course integrates with Study Sessions.
- [ ] Grade entity exists.
- [ ] KHS exists.
- [ ] IPS calculation exists.
- [ ] IPK calculation exists.
- [ ] Transcript foundation exists.
- [ ] Curriculum progress exists.
- [ ] Academic Dashboard exists.
- [ ] Study Dashboard integrates academic context.
- [ ] Academic Calendar foundation exists.
- [ ] Academic Services foundation exists.
- [ ] Academic Service Tracker exists if supported by current architecture.
- [ ] Grade Appeal foundation exists if supported by current architecture.
- [ ] Academic financial status can be tracked without payment integration.
- [ ] Chinese Learning can reference Academic Courses.
- [ ] No duplicate source of truth is introduced.
- [ ] No fake university synchronization is implemented.
- [ ] No unauthorized SIAKAD scraping is implemented.
- [ ] Offline local functionality remains usable.
- [ ] Indonesian localization works.
- [ ] English localization works.
- [ ] Desktop UI works.
- [ ] Tablet UI works.
- [ ] Mobile UI works.
- [ ] Accessibility is maintained.
- [ ] Tests pass.
- [ ] `flutter analyze` passes.
- [ ] Existing OmniLife modules remain functional.

---

# 119. Critical Rules for Antigravity

The following rules are mandatory.

1. Do NOT rebuild OmniLife from scratch.

2. Do NOT create a second database architecture.

3. Do NOT create duplicate Course entities for Academic and Study.

4. Do NOT create a second Calendar system.

5. Do NOT create a second Task system.

6. Do NOT create a second Notes system.

7. Do NOT create a second Reminder system.

8. Reuse existing OmniLife infrastructure.

9. Academic Course must be the canonical source for course identity.

10. KRS must reference Courses and Course Classes.

11. KRS must have an explicit status lifecycle.

12. KRS must support the concept of Dosen PA approval.

13. KRS must support Revision Required.

14. Preserve KRS status history where possible.

15. Total SKS must be calculated, not manually entered.

16. Academic Schedule must integrate with the existing Calendar.

17. Assignments must integrate with the existing Tasks system.

18. Exams must integrate with Calendar and Study.

19. Notes must be linkable to Courses without duplicating Notes.

20. Study Sessions must be linkable to Courses.

21. Grades must feed KHS.

22. KHS must feed cumulative academic progress.

23. Transcript must represent cumulative academic history.

24. Completed semester data must not be accidentally deleted.

25. Academic data must remain usable offline.

26. Do not implement fake SIAKAD synchronization.

27. Do not implement unauthorized university scraping.

28. Do not store university login credentials.

29. Do not assume access to university APIs.

30. University-specific rules should be configurable rather than hardcoded where possible.

31. Do not hardcode Indonesian UI text.

32. Use OmniLife's existing localization system.

33. Use OmniLife's existing design system.

34. Make mobile layouts usable.

35. Do not expose every academic feature as a primary navigation item.

36. Keep Academic and Study conceptually distinct but deeply integrated.

37. Do not implement future features simply because the architecture allows them.

38. Avoid overengineering.

39. Prioritize working integration over visual complexity.

40. After implementation, verify the entire existing OmniLife application.

---

# 120. Final Target Architecture

The final conceptual relationship after ACA-01 should be:

                    OMNILIFE
                        │
        ┌───────────────┴────────────────┐
        │                                │
     ACADEMIC                           STUDY
        │                                │
        │                                │
     Semester                            │
        │                                │
     Curriculum                          │
        │                                │
      Course ────────────────────────────┤
        │                                │
    Course Class                         │
        │                                │
     Schedule ────────────────→ Calendar │
        │                                │
       KRS                               │
        │                                │
     Dosen PA                            │
        │                                │
     Approval                            │
                                         │
Course ────────────────→ Assignments ────┤
   │                                     │
   ├──────────────────→ Exams ───────────┤
   │                                     │
   ├──────────────────→ Notes ───────────┤
   │                                     │
   ├──────────────────→ Tasks ───────────┤
   │                                     │
   └──────────────────→ Study Sessions ──┘
                                         │
                                         ↓
                                  Study Progress

Course
   ↓
Grades
   ↓
KHS
   ↓
Transcript
   ↓
Academic Progress

Course
   ↓
Chinese Learning
   ↓
Vocabulary
Hanzi
Grammar
Listening
Review

---

# 121. Final Product Vision

After ACA-01, OmniLife should no longer feel like:

"An app that happens to have Academic and Study pages."

It should feel like:

"An integrated personal academic operating system."

The user enters their academic structure once.

From there:

KRS
↓
Courses
↓
Schedules
↓
Calendar
↓
Tasks
↓
Assignments
↓
Notes
↓
Study Sessions
↓
Exams
↓
Study Plans
↓
Grades
↓
KHS
↓
Transcript
↓
Academic Progress

And for Mandarin-related courses:

Course
↓
Chinese Learning
↓
Vocabulary
↓
Hanzi
↓
Pinyin
↓
Grammar
↓
Listening
↓
Review

The key principle is:

> ONE ACADEMIC DATA SOURCE → MANY CONNECTED OMNILIFE FEATURES

---

# 122. Implementation Strategy

Do NOT attempt to implement the entire architecture in one giant rewrite.

Implement in safe increments.

Recommended order:

## Step A — Audit

Inspect existing:

Academic
Study
Calendar
Tasks
Notes
Reminders
Chinese Learning
Database
Navigation

## Step B — Data Foundation

Implement/refactor:

Semester
Course
Course Class
Dosen PA
KRS

## Step C — KRS

Implement:

- KRS table
- SKS calculation
- status lifecycle
- PA approval state
- revision state
- KRS history

## Step D — Course Workspace

Implement:

Course Detail

with:

- Schedule
- Tasks
- Assignments
- Notes
- Exams
- Study

## Step E — Calendar Integration

Connect:

Course Schedule
Exam
Assignment Deadline
Study Session

to existing Calendar.

## Step F — Study Integration

Connect:

Course
Study Session
Task
Assignment
Notes

## Step G — Academic Results

Implement:

Grades
KHS
IPS
IPK
Transcript

## Step H — Curriculum

Implement:

Curriculum
Course Progress
SKS Progress

## Step I — Chinese Learning Integration

Allow:

Academic Course
    ↕
Chinese Learning Content

## Step J — UX Refinement

Simplify navigation and make the system understandable for a new user.

---

# 123. Final Verification

Before reporting ACA-01 as complete, Antigravity MUST verify:

1. Existing features still work.
2. Existing data remains accessible.
3. No duplicate entities were introduced unnecessarily.
4. KRS can be created.
5. Courses can be selected.
6. Total SKS calculates correctly.
7. KRS can be submitted.
8. KRS can enter Waiting for PA.
9. KRS can be Approved.
10. KRS can enter Revision Required.
11. KRS history remains available.
12. Course Detail works.
13. Schedule works.
14. Calendar integration works.
15. Tasks integration works.
16. Assignment integration works.
17. Notes integration works.
18. Exam integration works.
19. Study Session integration works.
20. Grades work.
21. KHS works.
22. IPS works.
23. IPK works.
24. Transcript works.
25. Curriculum progress works.
26. Chinese Learning integration works.
27. Mobile UI works.
28. Desktop UI works.
29. Localization works.
30. `flutter analyze` passes.
31. Tests pass.
32. No critical regression exists.

---

# 124. Expected Result

After ACA-01, the user should be able to open OmniLife and see:

## Academic

Gasal 2026/2027

KRS:
🟡 Menunggu Persetujuan PA

20 SKS

Today's Classes:
Chinese Comprehensif 1

Upcoming:
Assignment
Exam

Academic Progress:
29%

---

## Study

Today:

Chinese Comprehensif 1
Study Chapter 3

Pending:

1 Assignment

Upcoming:

UTS

Study Progress:

...

---

## Course

Chinese Comprehensif 1

PMDR236001

8 SKS · Class B

Lecturer:
...

Schedule:
Monday · 08:00–11:20

Quick Actions:

Notes
Tasks
Assignments
Study
Exams
Attendance
Grades

---

# 125. Final Instruction

ACA-01 is a structural integration phase.

Do not focus primarily on adding more features.

Focus on making the existing OmniLife ecosystem understand:

SEMESTER
    ↓
COURSE
    ↓
KRS
    ↓
CLASS
    ↓
SCHEDULE
    ↓
ACADEMIC CONTEXT
    ↓
STUDY
    ↓
TASKS
    ↓
ASSIGNMENTS
    ↓
EXAMS
    ↓
NOTES
    ↓
CALENDAR
    ↓
GRADES
    ↓
KHS
    ↓
TRANSCRIPT

And for Mandarin-related academic content:

COURSE
    ↓
CHINESE LEARNING
    ↓
VOCABULARY
    ↓
HANZI
    ↓
PINYIN
    ↓
GRAMMAR
    ↓
LISTENING
    ↓
REVIEW

The objective is not to build a copy of SIAKAD UM.

The objective is to build:

> **OmniLife Personal Academic Operating System**

inspired by the academic structure the user is familiar with, while providing much deeper integration with personal productivity and learning.

Do not proceed to the next Chinese Learning phase until ACA-01 has been implemented, tested, and verified by the user.

---

# End of ACA-01

**Next after verification:**

Return to the Chinese Learning roadmap.

**Next planned phase:**

CL-07 — Chinese Grammar & Sentence Learning Foundation
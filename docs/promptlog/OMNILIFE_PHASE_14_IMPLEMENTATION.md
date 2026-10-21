# OMNILIFE — PHASE 14 IMPLEMENTATION PROMPT
## Academic & College Management System

**Project:** OmniLife  
**Phase:** 14  
**Previous Phase:** Phase 13 — Tasks, To-Do & Projects  
**Status:** Implementation Phase

---

# 1. ROLE

You are the implementation agent for OmniLife.

Phase 14 focuses on:

> **Academic / College Management**

The objective is to make OmniLife capable of managing a user's academic life without creating a separate isolated school-management application.

The academic system must connect naturally with:

```text
Academic
   │
   ├── Courses
   ├── Assignments
   ├── Exams
   ├── Academic Tasks
   ├── Notes
   ├── Schedule
   ├── Reminders
   ├── Projects
   ├── Goals
   └── Global Search
```

The system must remain useful for a single student and must work locally/offline.

---

# 2. IMPORTANT PRE-IMPLEMENTATION RULE

Before implementing anything:

1. Inspect the current OmniLife architecture.
2. Inspect Phase 11 Global Search.
3. Inspect Phase 12 Calendar & Scheduling.
4. Inspect Phase 13 Tasks, To-Do & Projects.
5. Inspect existing Notes functionality.
6. Inspect existing Reminder functionality.
7. Inspect existing Goals functionality.
8. Inspect existing Dashboard functionality.
9. Inspect existing database models.
10. Inspect existing navigation.

Reuse existing infrastructure.

Do NOT create duplicate systems for:

```text
Tasks
Calendar
Reminders
Notes
Projects
Search
Goals
```

Academic should integrate with those systems.

---

# 3. CORE CONCEPT

The Academic system should represent:

```text
ACADEMIC PROFILE
       │
       ▼
   SEMESTER
       │
       ▼
    COURSE
       │
   ┌───┼───────────────┐
   ▼   ▼               ▼
TASK ASSIGNMENT       EXAM
       │               │
       ▼               ▼
     NOTE            NOTE
       │
       ▼
    CALENDAR
       │
       ▼
   REMINDER
```

Not every academic entity needs every relationship.

---

# 4. ACADEMIC MODULE SCOPE

Phase 14 should support:

```text
Academic Profile
Semesters
Courses
Course schedule
Assignments
Exams
Academic tasks
Academic notes integration
Grades / scores
Course progress
Academic dashboard
Calendar integration
Reminder integration
Task integration
Project integration where appropriate
Global Search integration
```

Do not implement advanced university administration features.

---

# 5. ACADEMIC PROFILE

If useful, provide an academic profile containing:

```text
Institution
Major / Program
Student ID
Current semester
Academic year
```

However:

> Do not store highly sensitive information unnecessarily.

If a field is not required for OmniLife functionality, do not force it.

---

# 6. SEMESTER

Create a Semester entity.

Conceptually:

```text
Semester

id
name
academicYear
term
startDate
endDate
status
createdAt
updatedAt
```

Example:

```text
2026/2027
Semester 1
```

Possible status:

```text
UPCOMING
ACTIVE
COMPLETED
ARCHIVED
```

Use the existing architecture's naming conventions.

---

# 7. SEMESTER MANAGEMENT

Users should be able to:

```text
Create semester
Edit semester
Activate semester
Complete semester
Archive semester
View semester
```

Do not automatically delete old semesters.

Historical academic information is valuable.

---

# 8. SEMESTER HISTORY

OmniLife should preserve previous semesters.

Example:

```text
Academic

2026/2027 — Semester 1
ACTIVE

2025/2026 — Semester 2
COMPLETED

2025/2026 — Semester 1
ARCHIVED
```

This supports long-term academic history.

---

# 9. COURSE

Create/adapt a Course entity.

Conceptually:

```text
Course

id
name
code
description

semesterId

credits
lecturer
room

color / visualIdentifier

status

createdAt
updatedAt
```

Do not force every field to be populated.

---

# 10. COURSE EXAMPLE

Example:

```text
Mathematics
MAT101

Semester:
2026/2027 — Semester 1

Credits:
3

Lecturer:
Dr. Example

Room:
A-203
```

The exact terminology can be adapted to the user's institution.

---

# 11. COURSE STATUS

Recommended:

```text
ACTIVE
COMPLETED
DROPPED
ARCHIVED
```

Avoid unnecessary complexity.

---

# 12. COURSE DASHBOARD

Course detail should provide a compact overview:

```text
Mathematics

Course information

Schedule
Assignments
Exams
Tasks
Notes
Grades
Projects
```

Only show sections that contain relevant information.

---

# 13. COURSE SCHEDULE

A course may have recurring class schedules.

Example:

```text
Mathematics
Monday
08:00–10:00
Room A-203
```

Another:

```text
Programming
Wednesday
13:00–15:00
Lab B
```

Use the existing Calendar recurrence architecture.

Do not create a second scheduling engine.

---

# 14. COURSE → CALENDAR

Course schedules should appear in the existing Calendar.

Concept:

```text
Course
   │
   ▼
Recurring Schedule
   │
   ▼
Calendar
```

Do not duplicate Calendar implementation.

---

# 15. CALENDAR SEMANTICS

Course schedules are:

```text
RECURRING ACADEMIC SCHEDULE
```

They are not ordinary one-time events.

The Calendar should distinguish them appropriately.

---

# 16. COURSE SCHEDULE EXCEPTIONS

The architecture should eventually allow:

```text
Class cancelled
Class moved
Special class
Holiday
Replacement class
```

Implement basic support if practical.

Do not build a university timetable synchronization system.

---

# 17. ASSIGNMENT

Assignments are one of the most important academic entities.

Conceptually:

```text
Assignment

id
title
description

courseId

assignedDate
dueDate

status
priority

taskId

grade
maxGrade

createdAt
updatedAt
```

Adapt to the existing Task architecture.

---

# 18. ASSIGNMENT ↔ TASK

An assignment should NOT become a completely separate task system.

Preferred:

```text
Assignment
     │
     ▼
 Task
```

Example:

```text
Assignment:
Mathematics Chapter 3

Task:
Finish Mathematics Chapter 3
```

The Task system should handle:

```text
status
priority
deadline
completion
reminders
scheduling
```

Academic should provide the academic context.

---

# 19. ASSIGNMENT CREATION

When creating an assignment, allow:

```text
Title
Description
Course
Assigned date
Due date
Priority
Reminder
```

Optional:

```text
Grade
Maximum grade
Attachment reference
```

Do not force the user to manually create a separate Task.

---

# 20. ASSIGNMENT AUTOMATIC TASK

When an assignment is created:

```text
Assignment
     ↓
Academic Service
     ↓
Task Service
     ↓
Task created
```

The task should reference the assignment.

Do NOT duplicate task state unnecessarily.

---

# 21. ASSIGNMENT COMPLETION

Completing the linked task should update the assignment's actionable status where appropriate.

Example:

```text
Assignment
"Finish report"

Task:
COMPLETED
```

Assignment:

```text
COMPLETED
```

Avoid conflicting states between the two systems.

---

# 22. ASSIGNMENT DEADLINE

Assignment due dates should be visible through:

```text
Academic
Tasks
Calendar
Dashboard
```

where appropriate.

Do not create separate deadline data in every module.

---

# 23. ASSIGNMENT → CALENDAR

An assignment deadline may be represented on Calendar.

Important:

```text
Deadline ≠ Scheduled work session
```

Example:

```text
Assignment:
Submit report

Due:
Friday 23:59
```

This does NOT automatically mean:

```text
Friday 22:00–23:59
```

unless the user explicitly schedules work.

---

# 24. ASSIGNMENT REMINDER

Allow:

```text
1 week before
3 days before
1 day before
1 hour before
Custom
```

Reuse the existing Reminder system.

Do not create AcademicReminderService if a global reminder service exists.

---

# 25. EXAM

Create/adapt an Exam entity.

Conceptually:

```text
Exam

id
title
courseId

examType

date
startTime
endTime

location

notes

grade
maxGrade

createdAt
updatedAt
```

Possible exam types:

```text
QUIZ
MIDTERM
FINAL
PRACTICAL
PRESENTATION
OTHER
```

Keep the list extensible.

---

# 26. EXAM → CALENDAR

Exam dates must integrate with Calendar.

Example:

```text
Mathematics Midterm
Thursday
09:00–11:00
Room A-203
```

The Calendar should link back to the Exam detail.

---

# 27. EXAM → REMINDER

Allow reminders.

Example:

```text
Exam:
Mathematics Midterm

Reminder:
7 days before
1 day before
1 hour before
```

Use the existing reminder engine.

---

# 28. EXAM → TASK

Do not automatically create an "Exam" task unless the user wants it.

However, the user should be able to create preparation tasks:

```text
Study Chapter 1
Study Chapter 2
Practice exercises
Review notes
```

These tasks can be associated with the exam/course.

---

# 29. STUDY PLAN COMPATIBILITY

The architecture should allow future study planning.

Example:

```text
Exam:
Mathematics Midterm
      │
      ├── Study Chapter 1
      ├── Study Chapter 2
      ├── Practice Questions
      └── Mock Test
```

Do not build a sophisticated automatic study planner in Phase 14.

---

# 30. COURSE NOTES

If OmniLife already has Notes:

Do NOT create:

```text
AcademicNotes
```

as an isolated note database.

Instead:

```text
Note
  │
  └── courseId
```

or another existing relationship mechanism.

---

# 31. NOTE EXAMPLE

A note could be:

```text
Title:
Derivatives

Course:
Mathematics

Content:
...
```

The same Note should remain accessible through Global Search.

---

# 32. COURSE NOTE VIEW

Course detail should provide:

```text
Notes

Derivatives
Chapter 2
Important formulas
Exam review
```

Clicking opens the existing Note detail.

Do not duplicate note editing UI unnecessarily.

---

# 33. COURSE PROJECTS

If a college project belongs to a course:

```text
Project
   │
   └── courseId
```

Example:

```text
Project:
Database Application

Course:
Database Systems
```

Reuse Phase 13 Project functionality.

---

# 34. COURSE TASKS

Tasks may reference:

```text
courseId
assignmentId
examId
projectId
```

only where appropriate.

Avoid unnecessary duplicated relationships.

---

# 35. TASK CONTEXT

Example:

```text
Task:
Finish Chapter 3

Context:

Course:
Mathematics

Assignment:
Chapter 3 Exercises

Due:
Friday
```

This context should make OmniLife significantly more useful than a generic to-do application.

---

# 36. COURSE TAGS

Courses may optionally use tags.

Examples:

```text
#programming
#math
#semester1
```

Reuse the existing Tag infrastructure.

---

# 37. GRADES

Support recording grades.

Example:

```text
Mathematics

Assignment:
Chapter 3
Score:
90 / 100
```

Exam:

```text
Midterm
Score:
85 / 100
```

Do not build a complicated grading engine initially.

---

# 38. GRADE MODEL

At minimum support:

```text
score
maxScore
```

Optional:

```text
weight
```

If weight is implemented, validate that the value is sensible.

Do not force users to configure grading weights if they do not need them.

---

# 39. COURSE GRADE SUMMARY

A course can display:

```text
Assessments
5

Average
87.5%
```

If weighted grades are supported:

```text
Weighted average
84.2%
```

Do not claim official GPA unless the required grading system is actually configured.

---

# 40. GPA

Do NOT implement a universal GPA calculation that assumes one grading system.

Different institutions use:

```text
4.0
4.3
5.0
percentage
letter grades
custom weighting
```

If GPA is implemented, create a configurable grading system.

Otherwise leave GPA for a later phase.

---

# 41. COURSE PROGRESS

Course progress should not simply mean "percentage of assignments completed."

Potential basic metrics:

```text
Assignments:
5 / 8 completed

Upcoming:
2

Overdue:
1

Exams:
1 upcoming
```

Keep metrics descriptive.

---

# 42. SEMESTER DASHBOARD

Provide a useful overview.

Example:

```text
Semester 1

Courses
6

Assignments
12 active

Upcoming exams
2

Overdue tasks
1

Today's classes
2
```

The exact dashboard depends on existing UI.

---

# 43. ACADEMIC DASHBOARD

If OmniLife has a global dashboard, provide an Academic section.

Example:

```text
ACADEMIC

Next class
Mathematics — 08:00

Upcoming assignment
Database report — Friday

Upcoming exam
Programming Midterm — Monday
```

Do not duplicate the entire Academic dashboard inside the global Dashboard.

---

# 44. TODAY ACADEMIC VIEW

The Today page should be capable of showing:

```text
Today's classes
Today's academic tasks
Assignments due today
Exams today
```

Use existing Task and Calendar queries.

---

# 45. UPCOMING ACADEMIC VIEW

Show:

```text
Upcoming classes
Assignments
Exams
Academic deadlines
```

Prefer a unified timeline rather than multiple redundant screens.

---

# 46. OVERDUE ACADEMIC ITEMS

Academic overdue state should derive from underlying entities.

Example:

```text
Assignment
Due:
Yesterday

Task:
Not completed
```

It becomes overdue.

Do not manually maintain separate overdue flags unless required.

---

# 47. SEMESTER ARCHIVE

When a semester is completed:

Do NOT delete:

```text
Courses
Assignments
Exams
Notes
Tasks
Grades
Projects
```

Historical information must remain accessible.

---

# 48. SEMESTER SWITCHING

Provide a way to switch academic context.

Example:

```text
Academic

Current:
2026/2027 — Semester 1

Previous:
2025/2026 — Semester 2
```

Current semester should be easy to identify.

---

# 49. ACTIVE SEMESTER

There should generally be only one active/current semester unless the architecture has a strong reason otherwise.

Validate state appropriately.

---

# 50. COURSE COLORS

If OmniLife already has color identifiers:

Allow courses to optionally use them.

Example:

```text
Mathematics  ●
Programming ●
Physics     ●
```

Do not make color the only distinguishing mechanism.

---

# 51. COURSE ICONS

Optional.

Use existing icon system if available.

Do not introduce an icon-management system.

---

# 52. GLOBAL SEARCH

Integrate Academic entities into Phase 11 Global Search.

Searchable entities:

```text
Semester
Course
Assignment
Exam
Academic Note
```

Example:

```text
Search:
Mathematics

COURSE
Mathematics

ASSIGNMENT
Chapter 3

EXAM
Mathematics Midterm

NOTE
Derivatives
```

---

# 53. SEARCH NAVIGATION

Every result must navigate to the correct existing entity detail.

Do not create special search-only detail pages.

---

# 54. CALENDAR NAVIGATION

From Calendar:

```text
Mathematics class
```

→ Course detail.

From Calendar:

```text
Mathematics Midterm
```

→ Exam detail.

From Calendar:

```text
Assignment deadline
```

→ Assignment detail.

Use existing deep-link routing.

---

# 55. TASK NAVIGATION

From a task:

```text
Course:
Mathematics
```

Clicking should open Course detail.

If linked:

```text
Assignment:
Chapter 3
```

should open Assignment detail.

---

# 56. COURSE → TASK NAVIGATION

Course detail should provide:

```text
Tasks
```

which queries Phase 13 Task Service.

Do not maintain a separate academic task list.

---

# 57. COURSE → NOTES NAVIGATION

Course detail should query existing Notes.

Do not duplicate note records.

---

# 58. COURSE → PROJECT NAVIGATION

Course detail should query existing Projects.

Example:

```text
Projects

Database Application
```

Click:

```text
Project detail
```

---

# 59. COURSE → CALENDAR

Provide a useful schedule view.

Example:

```text
Class schedule

Monday
08:00–10:00

Wednesday
13:00–15:00
```

Allow navigation to Calendar if appropriate.

---

# 60. ASSIGNMENT → PROJECT

An assignment may optionally relate to a larger Project.

Example:

```text
Course:
Software Engineering

Assignment:
Final application

Project:
OmniTenant
```

Do not force this relationship.

---

# 61. EXAM → PROJECT

Generally unnecessary.

Do not add an exam-project relationship unless there is a clear use case.

---

# 62. ACADEMIC TASK FILTER

Phase 13 Task filters should be able to filter:

```text
Course
Semester
Assignment
Exam
```

where technically appropriate.

---

# 63. ACADEMIC TASK VIEW

Example:

```text
Academic Tasks

○ Finish Mathematics assignment
○ Review Programming chapter 4
○ Prepare presentation
✓ Submit report
```

This is still the same Task system.

---

# 64. REMINDER INTEGRATION

Academic reminders must use the global Reminder service.

Supported:

```text
Assignment deadline
Exam
Class
Academic task
```

Do not create separate notification infrastructure.

---

# 65. NOTIFICATION SEMANTICS

Avoid notification spam.

For example:

```text
Exam in 7 days
Exam tomorrow
Exam in 1 hour
```

should only occur if the user configured those reminders.

Do not automatically create multiple reminders.

---

# 66. ACADEMIC ATTACHMENTS

If OmniLife already has attachment/file references:

Allow academic entities to reference them.

Potential:

```text
Assignment PDF
Course syllabus
Exam material
Project document
```

Do not build cloud file storage in this phase.

Local references are sufficient if supported.

---

# 67. OFFLINE-FIRST

The Academic module must work without internet.

Core operations:

```text
Create course
Create semester
Create assignment
Create exam
Create academic task
Create note
View schedule
View history
Record grade
Search
```

must work locally.

---

# 68. DATABASE RELATIONSHIPS

Preferred conceptual relationships:

```text
Semester
   │
   └── Courses
          │
          ├── Assignments
          │       │
          │       └── Task
          │
          ├── Exams
          │
          ├── Notes
          │
          ├── Projects
          │
          └── Tasks
```

Use foreign keys/references appropriately.

Do not duplicate full entity data.

---

# 69. SERVICE ARCHITECTURE

Preferred:

```text
Academic UI
     │
     ▼
Academic Service
     │
 ┌───┼─────────┬─────────┐
 ▼   ▼         ▼         ▼
Task Calendar Reminder Notes
Service Service Service Service
     │
     ▼
 Repository
     │
     ▼
 Database
```

The Academic UI must not directly modify Task/Calendar database tables.

---

# 70. ACADEMIC SERVICE

Conceptually expose operations such as:

```text
createSemester()
updateSemester()
archiveSemester()

createCourse()
updateCourse()
archiveCourse()

createAssignment()
updateAssignment()
completeAssignment()

createExam()
updateExam()

getCurrentSemester()
getCoursesForSemester()
getAssignmentsForCourse()
getExamsForCourse()
getAcademicItemsForToday()
getUpcomingAcademicItems()
```

Use project naming conventions.

---

# 71. TASK SERVICE INTEGRATION

Use Phase 13 Task Service:

```text
Academic Service
      ↓
Task Service
```

not:

```text
Academic Service
      ↓
Database
```

when creating/managing an academic task.

---

# 72. CALENDAR SERVICE INTEGRATION

Use Phase 12 Calendar Service.

Course schedule and exam schedule should be registered through existing calendar infrastructure.

---

# 73. SEARCH SERVICE INTEGRATION

Use Phase 11 Search infrastructure.

Do not add Academic-specific search logic to UI widgets.

---

# 74. GOAL INTEGRATION

Academic entities may optionally contribute toward goals.

Example:

```text
Goal:
Graduate with strong academic results

Semester:
2026/2027 Semester 1

Course:
Mathematics
```

Do not create complex automatic goal scoring.

Only establish clean relationships where useful.

---

# 75. ROUTINE INTEGRATION

Do not automatically convert:

```text
Class schedule
```

into:

```text
Routine
```

They are different concepts.

Course schedules are academic commitments.

Routines are personal recurring behaviors.

---

# 76. PROJECT INTEGRATION

Use Phase 13 Project Service.

Academic projects may optionally belong to a Course.

Example:

```text
Course:
Software Engineering

Project:
Final Application

Tasks:
Research
Implementation
Testing
Presentation
```

This should work without creating a second project system.

---

# 77. AI COMPATIBILITY

Do NOT implement AI commands in Phase 14.

However, make services ready for future AI usage.

Future examples:

```text
"Tambahkan ujian matematika hari Jumat jam 9."

"Deadline tugas database minggu depan."

"Apa tugas kuliahku minggu ini?"

"Jadwalkan belajar matematika sebelum ujian."
```

Future AI should use:

```text
Academic Service
Task Service
Calendar Service
Reminder Service
```

not directly manipulate the database.

---

# 78. MOBILE UX

Mobile priority:

```text
Today's academic schedule
Courses
Assignments
Exams
Quick task creation
Course detail
```

A student should be able to quickly check:

```text
"Besok aku ada apa?"
```

without navigating through many screens.

---

# 79. DESKTOP UX

Desktop may provide:

```text
Semester overview
Course list
Assignment list
Exam list
Academic calendar
Course details
Grade overview
```

Reuse the current design system.

Do not perform the final UI/UX overhaul.

---

# 80. QUICK ACTIONS

Provide useful quick actions where appropriate:

```text
+ Course
+ Assignment
+ Exam
+ Academic Task
```

The action should open a minimal creation flow.

Do not require excessive fields.

---

# 81. ACADEMIC HOME

The Academic module should have a clear landing screen.

Suggested structure:

```text
Academic

Current Semester
2026/2027 — Semester 1

Today's Classes

Upcoming Assignments

Upcoming Exams

Courses

Recent Notes
```

Keep it compact.

---

# 82. COURSE LIST

Course list should provide:

```text
Course name
Course code
Current status
Next class
Pending tasks
```

Do not overload cards.

---

# 83. COURSE DETAIL LAYOUT

Suggested:

```text
MATHEMATICS

Course information

Next class
Monday 08:00

Assignments
2 pending

Exams
1 upcoming

Tasks
5 active

Notes
8

Projects
1
```

Use tabs/sections if the current architecture supports them.

---

# 84. ASSIGNMENT LIST

Useful grouping:

```text
Overdue
Today
This Week
Upcoming
Completed
```

Reuse Phase 13 filtering/query logic.

---

# 85. EXAM LIST

Useful grouping:

```text
Upcoming
Past
```

Sort by date.

---

# 86. ACADEMIC TIMELINE

If practical, provide a unified academic timeline:

```text
MONDAY
08:00 Mathematics class

TUESDAY
Assignment due

THURSDAY
Programming Midterm

FRIDAY
Project submission
```

This should reuse Calendar data rather than duplicating it.

---

# 87. SEMESTER TIMELINE

Optional future-ready structure:

```text
Semester start
       ↓
Assignments
       ↓
Midterms
       ↓
Projects
       ↓
Final exams
       ↓
Semester end
```

Do not build a sophisticated academic Gantt chart.

---

# 88. BASIC STATISTICS

Provide simple academic metrics:

```text
Courses
Assignments completed
Assignments remaining
Exams completed
Upcoming exams
Current grade averages where available
```

Do not implement full Analytics yet.

---

# 89. DATA VALIDATION

Validate:

```text
Course must belong to a valid semester.
Assignment must reference a valid course.
Exam must reference a valid course.
Task references must remain valid.
Dates must be logically consistent.
```

Examples:

```text
Semester end < Semester start
```

must be rejected.

---

# 90. DELETION POLICY

Avoid destructive cascading deletes.

For example:

Deleting a Course should NOT silently destroy:

```text
Notes
Tasks
Projects
Assignments
Grades
```

Instead:

```text
Archive
Detach
Confirm destructive action
```

depending on the existing architecture.

---

# 91. MIGRATION

If the database requires schema changes:

1. Create migration.
2. Preserve existing data.
3. Preserve Tasks.
4. Preserve Calendar.
5. Preserve Notes.
6. Preserve Projects.
7. Preserve Reminders.
8. Test application startup after migration.

Never silently destroy existing OmniLife data.

---

# 92. PERFORMANCE

Use database-level filtering for:

```text
Current semester
Current courses
Upcoming assignments
Upcoming exams
Academic history
```

Avoid loading the entire academic history into memory unnecessarily.

---

# 93. TESTING

Create automated tests for:

### Semester

```text
create
update
archive
current semester
history
```

### Course

```text
create
update
semester relationship
schedule
archive
```

### Assignment

```text
create
update
course relationship
task relationship
deadline
completion
```

### Exam

```text
create
update
calendar integration
reminder integration
```

### Grades

```text
score
max score
average
validation
```

### Integration

```text
Calendar
Tasks
Projects
Notes
Reminders
Search
Goals
```

---

# 94. ACCEPTANCE TEST 1 — SEMESTER

Create:

```text
2026/2027 — Semester 1
```

Set:

```text
ACTIVE
```

Expected:

```text
Current semester shows correctly.
```

Restart app.

Expected:

```text
Semester remains active.
```

---

# 95. ACCEPTANCE TEST 2 — COURSE

Create:

```text
Mathematics
MAT101
Semester 1
```

Expected:

```text
Course appears in current semester.
```

---

# 96. ACCEPTANCE TEST 3 — COURSE SCHEDULE

Create:

```text
Mathematics
Monday
08:00–10:00
```

Expected:

```text
Calendar displays recurring class.
```

Click Calendar item.

Expected:

```text
Course detail opens.
```

---

# 97. ACCEPTANCE TEST 4 — ASSIGNMENT

Create:

```text
Assignment:
Chapter 3 Exercises

Course:
Mathematics

Due:
Friday
```

Expected:

```text
Assignment appears under Mathematics.
Task is created/linked through Task Service.
```

---

# 98. ACCEPTANCE TEST 5 — ASSIGNMENT COMPLETION

Complete the assignment's linked task.

Expected:

```text
Assignment becomes completed according to the established status model.
```

No duplicate task state should conflict with it.

---

# 99. ACCEPTANCE TEST 6 — EXAM

Create:

```text
Mathematics Midterm
Friday
09:00–11:00
```

Expected:

```text
Exam appears in Academic.
Exam appears in Calendar.
Calendar item opens Exam detail.
```

---

# 100. ACCEPTANCE TEST 7 — NOTES

Create:

```text
Note:
Derivatives

Course:
Mathematics
```

Expected:

```text
Note appears in Course detail.
Note appears in Global Search.
Existing Note system remains functional.
```

---

# 101. ACCEPTANCE TEST 8 — PROJECT

Create:

```text
Project:
Database Application

Course:
Database Systems
```

Expected:

```text
Project appears under Database Systems.
Existing Project system remains functional.
```

---

# 102. ACCEPTANCE TEST 9 — SEARCH

Search:

```text
Mathematics
```

Expected results may include:

```text
COURSE
ASSIGNMENT
EXAM
NOTE
TASK
```

Click each.

Expected:

```text
Correct detail screen opens.
```

---

# 103. ACCEPTANCE TEST 10 — REMINDER

Create:

```text
Exam:
Programming Midterm

Reminder:
1 day before
```

Expected:

```text
Existing Reminder system stores and handles the reminder.
```

No duplicate notification service should be created.

---

# 104. ACCEPTANCE TEST 11 — SEMESTER HISTORY

Create:

```text
Semester 1
```

Complete it.

Create:

```text
Semester 2
```

Set active.

Expected:

```text
Semester 1 remains accessible.
Semester 2 becomes current.
```

---

# 105. ACCEPTANCE TEST 12 — TASK FILTER

Create academic tasks for:

```text
Mathematics
Programming
Physics
```

Filter:

```text
Course = Mathematics
```

Expected:

```text
Only Mathematics tasks appear.
```

---

# 106. ACCEPTANCE TEST 13 — MOBILE

On Android verify:

```text
Open Academic
View current semester
Open course
View assignment
View exam
Create academic task
Open Calendar
```

Expected:

```text
All core functions work.
```

---

# 107. ACCEPTANCE TEST 14 — OFFLINE

Disable network.

Verify:

```text
Academic
Courses
Assignments
Exams
Notes
Tasks
Calendar
Search
```

Expected:

```text
Core functionality continues to work.
```

---

# 108. ACCEPTANCE TEST 15 — REGRESSION

Verify:

```text
Phase 11:
Global Search

Phase 12:
Calendar
Scheduling
Reminders

Phase 13:
Tasks
Projects
Subtasks
```

All must remain functional.

Do not mark Phase 14 complete if previous phases regress.

---

# 109. DOCUMENTATION

Create/update:

```text
docs/ACADEMIC_ARCHITECTURE.md
```

Document:

```text
Academic Profile
Semester
Course
Course Schedule
Assignment
Exam
Grades
Academic ↔ Tasks
Academic ↔ Calendar
Academic ↔ Reminder
Academic ↔ Notes
Academic ↔ Projects
Academic ↔ Goals
Academic ↔ Search
Database relationships
Service architecture
Migration
```

Update the main OmniLife architecture documentation if required.

---

# 110. ARCHITECTURE TARGET

Preferred:

```text
                  ACADEMIC UI
                       │
                       ▼
                Academic Service
                       │
        ┌──────────────┼───────────────┐
        ▼              ▼               ▼
      Course       Assignment         Exam
        │              │               │
        │              ▼               │
        │          Task Service        │
        │              │               │
        └──────────────┼───────────────┘
                       ▼
                Calendar Service
                       │
                       ▼
                Reminder Service

                Notes Service
                Project Service
                Search Service
                       │
                       ▼
                   Repository
                       │
                       ▼
                    Database
```

The Academic layer should orchestrate existing systems rather than replace them.

---

# 111. FUTURE AI COMPATIBILITY

Do not implement AI in this phase.

But the architecture should make future requests possible:

```text
"Besok aku ada kelas apa?"

"Apa tugas kuliahku minggu ini?"

"Tambahkan ujian matematika hari Jumat jam 9."

"Catat tugas ini sebagai assignment Programming."

"Buatkan task untuk belajar sebelum ujian."
```

Future AI must call application services.

AI must never directly write to the database.

---

# 112. FUTURE ANALYTICS COMPATIBILITY

Do not implement full analytics.

But preserve enough structured data for future:

```text
Course performance
Assignment completion
Exam performance
Task completion
Study patterns
Semester history
```

---

# 113. FUTURE KNOWLEDGE BASE COMPATIBILITY

Academic Notes should remain compatible with the future Knowledge Base.

Example future structure:

```text
Course
   │
   ├── Notes
   ├── Study materials
   ├── Concepts
   ├── References
   └── Knowledge Base entries
```

Do not implement the complete Knowledge Base now.

---

# 114. UI CONSTRAINT

Do NOT perform the final OmniLife UI/UX overhaul.

Do NOT:

```text
❌ Redesign the entire application
❌ Replace navigation
❌ Change global theme
❌ Remove features
❌ Merge modules prematurely
```

Only implement the UI required for Phase 14.

The final simplification will happen later.

---

# 115. SUCCESS DEFINITION

Phase 14 is successful when OmniLife can represent:

```text
SEMESTER
    │
    ├── COURSE
    │      │
    │      ├── CLASS SCHEDULE
    │      │
    │      ├── ASSIGNMENTS
    │      │      │
    │      │      └── TASKS
    │      │
    │      ├── EXAMS
    │      │
    │      ├── NOTES
    │      │
    │      ├── PROJECTS
    │      │
    │      └── GRADES
    │
    └── ACADEMIC HISTORY
```

while connecting naturally to:

```text
Calendar
Tasks
Projects
Notes
Reminders
Goals
Global Search
```

---

# 116. DO NOT MOVE TO PHASE 15 IF

Do not consider Phase 14 complete if:

```text
❌ Course schedules do not appear correctly in Calendar
❌ Assignment tasks duplicate Task data
❌ Exams cannot link to Calendar
❌ Academic Notes duplicate the global Notes system
❌ Search cannot find academic entities
❌ Semester history disappears
❌ Old academic data is destroyed
❌ Reminder integration creates a second notification system
❌ Task/Project functionality from Phase 13 regresses
❌ Calendar functionality from Phase 12 regresses
❌ Global Search from Phase 11 regresses
❌ Mobile academic functionality fails
❌ Offline functionality fails
❌ Database migration loses existing OmniLife data
```

Fix all regressions before proceeding.

---

# 117. FINAL IMPLEMENTATION REPORT

When implementation is complete, provide:

```text
OMNILIFE PHASE 14 REPORT

Status:
COMPLETED / PARTIAL / BLOCKED

Academic Profile:
- ...

Semester:
- ...

Courses:
- ...

Course schedules:
- ...

Assignments:
- ...

Assignment ↔ Task:
- ...

Exams:
- ...

Exam ↔ Calendar:
- ...

Academic Notes:
- ...

Grades:
- ...

Projects:
- ...

Goals:
- ...

Reminders:
- ...

Global Search:
- ...

Mobile:
- ...

Offline:
- ...

Database migration:
- ...

Tests:
- Passed: X
- Failed: X

Files created:
- ...

Files modified:
- ...

Known limitations:
- ...

Technical debt:
- ...

Recommended next phase:
- Phase 15
```

---

# FINAL PRINCIPLE

Phase 14 should make OmniLife understand:

> **"Apa yang sedang aku pelajari, di semester mana, kapan kelasnya, apa tugasnya, kapan deadline-nya, kapan ujiannya, berapa hasilnya, dan semua materi terkaitnya ada di mana?"**

The architecture should feel like:

```text
                    OMNILIFE
                       │
                 ┌─────┴─────┐
                 ▼           ▼
             PERSONAL     ACADEMIC
                             │
                       CURRENT SEMESTER
                             │
                  ┌──────────┼──────────┐
                  ▼          ▼          ▼
                COURSE     COURSE     COURSE
                  │
        ┌─────────┼────────────┐
        ▼         ▼            ▼
     CLASSES  ASSIGNMENTS     EXAMS
                  │            │
                  ▼            ▼
                TASKS       CALENDAR
                  │            │
                  └──────┬─────┘
                         ▼
                      REMINDER

Course
 ├── Notes
 ├── Projects
 ├── Tasks
 └── Grades

Everything
      │
      ▼
 GLOBAL SEARCH
```

The most important architectural principle is:

> **Academic is a context layer, not a second copy of OmniLife's existing systems.**

An Assignment should leverage the existing Task system.

A Class should leverage the existing Calendar system.

An Exam should leverage Calendar + Reminder.

A Course Note should leverage Notes.

A Course Project should leverage Projects.

Everything should remain discoverable through Global Search.

This keeps OmniLife modular now and makes the eventual **Phase 25 UI/UX simplification** much easier because we can simplify the presentation without having to rewrite the underlying systems.

Do not implement AI commands, cloud sync, multi-user functionality, or the final UI/UX overhaul in this phase.
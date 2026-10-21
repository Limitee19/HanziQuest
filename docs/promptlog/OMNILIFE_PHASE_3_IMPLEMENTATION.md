# OmniLife — Phase 3 Implementation Specification

**Project:** OmniLife  
**Phase:** 3 — College & Academic Management  
**Status:** Ready for Implementation  
**Implementation Agent:** Antigravity  
**Scope:** Phase 3 only

---

# 1. PURPOSE

Phase 1 established the daily-management foundation.

Phase 2 established productivity, projects, goals, knowledge, search, and timeline.

Phase 3 introduces the **College / Academic Management System**.

The purpose is to allow OmniLife to manage the user's academic life without becoming a completely separate application.

The core academic structure should be:

```text
College
   │
   ├── Semester
   │      │
   │      ├── Course
   │      │      ├── Assignments
   │      │      ├── Exams
   │      │      ├── Schedule
   │      │      ├── Notes
   │      │      └── Grades
   │      │
   │      └── Academic Goals
   │
   └── Academic Timeline
```

The academic system must integrate with existing OmniLife modules.

---

# 2. IMPORTANT IMPLEMENTATION RULE

This document defines the scope for **Phase 3 only**.

Do NOT implement future phases.

Do NOT implement:

```text
Finance
Budget
Income / Expenses
Subscriptions
Wishlist
Personal Inventory
Secure Vault
Password Manager
Document Vault
AI Assistant
Cloud Sync
Multi-user
Public Platform
Advanced Analytics
```

These belong to future phases.

---

# 3. SOURCE OF TRUTH

Before implementation:

1. Inspect the current OmniLife workspace.
2. Read the current architecture documentation.
3. Read `PHASE_1_IMPLEMENTATION_REPORT.md`.
4. Read `PHASE_2_IMPLEMENTATION_REPORT.md`.
5. Inspect the actual Phase 1 and Phase 2 implementations.
6. Understand the current data model.
7. Understand the existing persistence layer.
8. Understand the current design system and navigation.

The current codebase is the source of truth.

Do not blindly rebuild existing systems.

---

# 4. PHASE 3 PRODUCT GOAL

At the end of Phase 3, OmniLife should allow the user to manage their college life from one place.

The user should be able to answer:

```text
What courses am I taking?

What classes do I have today?

What assignments are due?

What exams are coming?

What do I need to study?

What have I completed?

What notes belong to this course?

How am I performing academically?
```

---

# 5. ACADEMIC SYSTEM ARCHITECTURE

Conceptually:

```text
                         COLLEGE
                            │
                         SEMESTER
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
       COURSE            GOALS              SCHEDULE
         │                                     │
    ┌────┼────┐                                │
    │    │    │                                │
Assignments Exams Grades                       Calendar
    │    │
    │    └──────────────┐
    │                   │
    ▼                   ▼
 Tasks              Reminders
    │
    ▼
 Daily Planner
```

And:

```text
Course
  │
  ├── Notes
  ├── Knowledge
  ├── Assignments
  ├── Exams
  └── Projects
```

---

# 6. FEATURE 1 — COLLEGE PROFILE

Implement a basic academic institution profile.

The user should be able to store:

```text
Institution Name
Optional Institution Logo
Program / Major
Student Identifier
Optional Campus
```

Do not build a public student profile.

This is private personal data.

---

# 7. COLLEGE PROFILE UI

Example:

```text
MY COLLEGE

Universitas Example

Computer Science

Campus:
Main Campus
```

Keep the interface simple.

Do not overbuild profile functionality during Phase 3.

---

# 8. FEATURE 2 — SEMESTERS

Implement semester management.

A semester should support:

```text
Semester Name
Start Date
End Date
Status
```

Suggested statuses:

```text
Upcoming
Active
Completed
Archived
```

Example:

```text
2026 / 2027 — Semester 1
Start: August 2026
End: January 2027
Status: Active
```

---

# 9. ACTIVE SEMESTER

OmniLife should identify one semester as the current active semester.

The user should not need to manually select the semester every time they open academic features.

Example:

```text
Academic
2026 / 2027 — Semester 1
```

The user should still be able to view previous and future semesters.

---

# 10. SEMESTER HISTORY

Completed semesters must remain available.

Example:

```text
Academic History

2025 / 2026 — Semester 2
Completed

2026 / 2027 — Semester 1
Active

2026 / 2027 — Semester 2
Upcoming
```

Do not delete old academic records simply because a semester ended.

---

# 11. FEATURE 3 — COURSES

Implement Course management.

A Course represents a subject/class within a semester.

Example:

```text
Programming Fundamentals
Calculus
Discrete Mathematics
English
Database Systems
```

---

# 12. COURSE PROPERTIES

At minimum:

```text
Course Name
Course Code
Credits
Instructor
Room
Semester
Status
Color / Visual Identifier
```

Optional:

```text
Description
Instructor Contact
Course Website
```

Do not require every field.

---

# 13. COURSE STATUS

Suggested:

```text
Upcoming
Active
Completed
Dropped
Archived
```

---

# 14. COURSE DETAIL

The course page should become a central hub.

Example:

```text
PROGRAMMING FUNDAMENTALS

CS101
3 Credits

Instructor
Dr. Example

Progress

Assignments
3 / 5 completed

Upcoming
Midterm — Sep 20

Notes
Lecture 01
Variables
Functions

Grades
Current average: --
```

---

# 15. FEATURE 4 — COURSE SCHEDULE

Courses should support recurring weekly class schedules.

Example:

```text
Monday
08:00 — 10:00
Programming Fundamentals
Room A101

Wednesday
13:00 — 15:00
Programming Fundamentals
Room A101
```

This is a recurring schedule.

Do not create infinite calendar records.

Use recurrence rules where possible.

---

# 16. COURSE SCHEDULE INTEGRATION

Course schedules must integrate with the existing OmniLife Calendar.

Conceptually:

```text
Course Schedule Rule
        ↓
Calendar Occurrence
        ↓
Today
        ↓
Daily Planner
```

The user should be able to see today's classes from the existing Today page.

---

# 17. COURSE SCHEDULE VS NORMAL SCHEDULE

Maintain a clear distinction:

```text
Normal Schedule
=
One specific event

Course Schedule
=
Recurring academic class rule
```

Do not duplicate course classes as manually-created schedules.

---

# 18. FEATURE 5 — ASSIGNMENTS

Implement academic assignments.

Examples:

```text
Homework
Lab Report
Essay
Presentation
Group Project
Programming Assignment
Quiz
```

---

# 19. ASSIGNMENT PROPERTIES

At minimum:

```text
Title
Course
Description
Created Date
Due Date
Priority
Status
```

Suggested status:

```text
Not Started
In Progress
Submitted
Completed
Overdue
Cancelled
```

---

# 20. ASSIGNMENT INTEGRATION WITH TASKS

This is mandatory.

An Assignment should integrate with the existing Task system.

Conceptually:

```text
Assignment
     ↓
Task
     ↓
Today / Calendar / Reminder
```

Do not build an entirely separate task engine.

The academic Assignment entity should provide academic-specific metadata while the existing Task system handles general task behavior.

---

# 21. ASSIGNMENT TASK EXAMPLE

Example:

```text
Assignment:
Finish Database Report

Course:
Database Systems

Due:
September 15

Task:
☐ Finish Database Report
```

The assignment should appear in:

```text
Course
Assignment list
Tasks
Calendar if dated
Today if relevant
Reminder system
```

---

# 22. ASSIGNMENT PROGRESS

Assignments should support progress where useful.

Example:

```text
Database Report

Status:
In Progress

Progress:
60%
```

This may optionally be represented through subtasks if the existing task system supports them.

Do not create a second independent progress engine unnecessarily.

---

# 23. FEATURE 6 — EXAMS

Implement exam management.

Exam types may include:

```text
Quiz
Midterm
Final Exam
Practical Exam
Presentation
Oral Exam
```

---

# 24. EXAM PROPERTIES

At minimum:

```text
Title
Course
Date
Start Time
Optional End Time
Location
Description
Exam Type
Status
```

---

# 25. EXAM CALENDAR INTEGRATION

Exam records must integrate with Calendar.

Example:

```text
September 20

10:00
Midterm — Programming Fundamentals
Room B204
```

The user should be able to click the calendar item and open the Exam detail.

---

# 26. EXAM REMINDERS

Allow reminders to be associated with exams.

Example:

```text
Exam:
Calculus Midterm
September 20

Reminder:
7 days before
1 day before
1 hour before
```

Use the existing OmniLife Reminder system.

Do not build a separate notification system.

---

# 27. EXAM PREPARATION

An Exam should be able to connect to:

```text
Tasks
Notes
Knowledge
Projects where appropriate
```

Example:

```text
Calculus Midterm
        │
        ├── Task: Review Chapter 1
        ├── Task: Review Chapter 2
        ├── Note: Formula Sheet
        └── Knowledge: Integration
```

Do not create duplicate content.

---

# 28. FEATURE 7 — GRADES

Implement a basic grade tracking system.

The system should allow the user to record academic results.

Examples:

```text
Assignment 1
Quiz 1
Midterm
Final
Project
Participation
```

---

# 29. GRADE ENTRY

A Grade Record should support:

```text
Name
Course
Category
Score
Maximum Score
Weight
Date
Optional Note
```

Example:

```text
Midterm
Score: 85
Maximum: 100
Weight: 30%
```

---

# 30. GRADE CALCULATION

Where enough information is available, calculate weighted course progress.

Example:

```text
Assignment 1
90 × 10%

Midterm
80 × 30%

Quiz
100 × 10%
```

The system may calculate:

```text
Current Weighted Score
```

Do not claim it is the final course grade if uncompleted components remain.

Use terminology such as:

```text
Current Average
Current Weighted Score
Estimated Grade
```

where appropriate.

---

# 31. GRADE CATEGORIES

Allow categories such as:

```text
Assignment
Quiz
Exam
Project
Participation
Other
```

Do not hard-code the system to only these categories.

---

# 32. COURSE GRADE OVERVIEW

Course detail should provide an overview.

Example:

```text
PROGRAMMING FUNDAMENTALS

Current Grade
87.5%

Assignments
90%

Quizzes
85%

Midterm
88%

Final
Not yet graded
```

If insufficient information exists:

```text
Current Grade
Not enough data
```

Do not fabricate calculations.

---

# 33. FEATURE 8 — ACADEMIC NOTES

Integrate existing Notes with Courses.

A user should be able to associate a Note with:

```text
Course
Semester
Exam
Assignment
```

where useful.

Example:

```text
Programming Fundamentals

Notes
├── Lecture 01
├── Variables
├── Functions
└── Midterm Review
```

---

# 34. COURSE KNOWLEDGE

Integrate Phase 2 Knowledge Base.

The user should be able to associate knowledge with a Course.

Example:

```text
Course:
Data Structures

Knowledge:
├── Linked List
├── Stack
├── Queue
└── Binary Tree
```

Do not create a second knowledge system.

Use the existing Knowledge Base.

---

# 35. COURSE PROJECTS

A Course may optionally connect to an existing Project.

Example:

```text
Course:
Software Engineering

Project:
Final Group Project
```

Use the existing Phase 2 Project system.

Do not create a second project engine.

---

# 36. FEATURE 9 — ACADEMIC DASHBOARD

Create an Academic dashboard.

Purpose:

> Give the user a quick overview of their current academic situation.

Example:

```text
ACADEMIC

Semester
2026 / 2027 — Semester 1

Courses
5 Active

TODAY

08:00
Programming Fundamentals

UPCOMING

Sep 15
Database Report
Due

Sep 20
Calculus Midterm

ACADEMIC TASKS

☐ Finish report
☐ Study chapter 4

CURRENT GRADES

Programming
87%

Calculus
--

Database
91%
```

Do not turn this into a giant analytics dashboard.

The focus is actionable academic information.

---

# 37. ACADEMIC DASHBOARD DATA

The dashboard should aggregate existing data.

It must not create duplicate versions of:

```text
Assignments
Tasks
Exams
Schedules
Grades
Notes
```

---

# 38. TODAY INTEGRATION

The existing Today page should now be aware of academic events.

Example:

```text
TODAY

08:00
📚 Programming Fundamentals

TASKS

☐ Finish Database Report
   Database Systems

REMINDERS

🔔 Calculus Midterm tomorrow
```

Academic information should feel naturally integrated.

Do not overwhelm Today with excessive academic metadata.

---

# 39. CALENDAR INTEGRATION

Academic records should appear in Calendar.

Relevant items:

```text
Course schedule
Assignment deadlines
Exams
Academic events
```

The calendar should allow the user to distinguish these visually.

Do not rely solely on colors.

---

# 40. TASK INTEGRATION

Academic Tasks should appear in the existing Tasks system.

Example:

```text
TASKS

☐ Finish Database Report
   Course: Database Systems
   Due: Sep 15

☐ Study Calculus Chapter 4
   Course: Calculus
   Due: Sep 18
```

Filtering by Course should be possible where practical.

---

# 41. REMINDER INTEGRATION

Use the existing Reminder infrastructure.

Possible reminder sources:

```text
Assignment
Exam
Course event
```

Do not create a separate Academic Reminder subsystem.

---

# 42. SEARCH INTEGRATION

Phase 2 Global Search must be extended.

Searchable academic entities:

```text
College
Semester
Course
Assignment
Exam
Grade
Academic Notes
```

Example:

```text
Search:
Calculus

Results:

COURSE
Calculus

ASSIGNMENT
Calculus Homework 2

EXAM
Calculus Midterm

NOTE
Integration Formula

KNOWLEDGE
Integration Techniques
```

---

# 43. TIMELINE INTEGRATION

Phase 2 Timeline should be extended with academic events.

Examples:

```text
Aug 20
Started semester

Aug 25
Programming Fundamentals class

Sep 10
Submitted Database Report

Sep 20
Completed Calculus Midterm
```

Timeline entries must reference original records.

Do not duplicate academic records.

---

# 44. ACADEMIC TIMELINE FILTER

Allow filtering:

```text
All
Courses
Assignments
Exams
Grades
Academic Events
```

Use the existing Timeline architecture.

---

# 45. SEMESTER ARCHIVING

When a semester is completed:

```text
Semester
 ↓
Completed / Archived
```

The following must remain accessible:

```text
Courses
Assignments
Exams
Grades
Notes
Knowledge relationships
Timeline history
```

Do not delete completed semester information.

---

# 46. SEMESTER TRANSITION

The architecture should support:

```text
Semester 1
     ↓
Semester 2
```

without losing previous data.

The user should be able to create a new semester and continue using OmniLife.

Do not automatically move courses between semesters unless explicitly requested.

---

# 47. ACADEMIC GOALS

Integrate academic goals with Phase 2 Goals.

Example:

```text
Goal:
Achieve GPA target

Projects:
Study Plan
Exam Preparation

Tasks:
Study Calculus
Complete Assignments
Review Notes
```

Do not create an independent Academic Goal system.

Reuse the existing Goal infrastructure.

---

# 48. ACADEMIC PROJECTS

Integrate with Phase 2 Projects.

Example:

```text
Course:
Software Engineering

Project:
Final Application

Tasks:
├── Research
├── Architecture
├── Implementation
└── Presentation
```

This should reuse existing Project and Task systems.

---

# 49. DATA MODEL PRINCIPLE

Do not duplicate existing entities.

Avoid:

```text
AcademicTask
ProjectTask
NormalTask
```

if one existing Task entity can represent the task and academic metadata can be attached.

Prefer:

```text
Task
  ↑
Assignment relationship
```

Similarly:

```text
Note
  ↑
Course relationship

Knowledge
  ↑
Course relationship

Project
  ↑
Course relationship
```

---

# 50. SAFE DELETE BEHAVIOR

Deleting academic metadata must not unexpectedly delete personal information.

Example:

Deleting a Course should not automatically destroy:

```text
Notes
Knowledge
Tasks
Projects
```

unless the user explicitly chooses a deliberate cleanup operation.

Prefer preserving data and removing the relationship.

---

# 51. UI / UX REQUIREMENTS

Continue the existing OmniLife design system.

The academic section should feel:

```text
Modern
Clean
Organized
Calm
Professional
Student-friendly
```

Avoid making it resemble:

```text
A corporate ERP
A school administration portal
A generic AI dashboard
```

This is a **personal academic manager**, not a university administration system.

---

# 52. NAVIGATION

Extend the existing navigation.

Conceptually:

```text
Today
Calendar
Tasks
Routines
Notes

Projects
Goals
Knowledge
Timeline

────────────

Academic

────────────

Search
Settings
```

If the current navigation architecture is different, adapt it rather than replacing it unnecessarily.

---

# 53. ACADEMIC NAVIGATION

The Academic section may contain:

```text
Academic Overview
Semesters
Courses
Assignments
Exams
Grades
```

Keep navigation shallow.

Do not force the user through many nested screens to access common information.

---

# 54. COURSE COLORS

Courses may have optional visual identifiers.

Example:

```text
Programming
Blue

Calculus
Green

Database
Orange
```

However:

**Color must not be the only method of identification.**

Use course names and icons/text as well.

---

# 55. EMPTY STATES

Provide meaningful empty states.

Examples:

```text
No active semester
→ "Create your current semester."

No courses
→ "Add your first course."

No assignments
→ "No assignments yet."

No exams
→ "No upcoming exams."

No grades
→ "Grades will appear here when you add them."
```

---

# 56. RESPONSIVE DESIGN

Preserve the existing responsive behavior.

Academic features must remain usable on supported platforms.

Avoid desktop-only layouts.

Course cards, tables, grade information, and assignment lists should adapt to smaller screens.

---

# 57. ACCESSIBILITY

Maintain existing accessibility practices.

Important:

```text
Do not rely only on color.
Use clear labels.
Maintain readable typography.
Provide clear touch targets.
Use meaningful icons.
Maintain keyboard navigation where applicable.
```

---

# 58. PERFORMANCE

Academic data may grow significantly over multiple semesters.

The system should remain responsive with:

```text
Many semesters
Many courses
Hundreds of assignments
Many exams
Many grades
Large note collections
Large knowledge collections
```

Use appropriate filtering and lazy loading where necessary.

Do not prematurely implement a complex analytics engine.

---

# 59. TESTING REQUIREMENTS

Add tests for:

```text
College profile
Semester creation
Semester activation
Semester archival
Course CRUD
Course schedule recurrence

Assignment CRUD
Assignment → Task relationship
Assignment due dates

Exam CRUD
Exam → Calendar relationship
Exam → Reminder relationship

Grade calculation
Weighted score calculation
Incomplete grade data

Course → Notes relationship
Course → Knowledge relationship
Course → Project relationship

Academic dashboard aggregation
Academic search
Academic timeline

Semester history
Safe deletion
Persistence
```

---

# 60. GRADE CALCULATION TESTS

Test at minimum:

```text
Score:
90 / 100
Weight:
10%

Expected contribution:
9%
```

Test multiple weighted components.

Also test incomplete data:

```text
Assignment = 90
Midterm = missing
Final = missing
```

The system must not incorrectly display a final grade.

---

# 61. RECURRENCE TESTS

Course schedules must be tested carefully.

Example:

```text
Every Monday
08:00 — Programming
```

Expected:

```text
Monday → appears
Tuesday → does not appear
Wednesday → does not appear
```

Changing the course schedule must not corrupt previous academic history.

---

# 62. REGRESSION TESTING

Phase 3 must not break Phase 1 or Phase 2.

Re-test:

```text
Calendar
Schedule
Tasks
Notes
Routines
Reminders
Today

Projects
Goals
Knowledge
Global Search
Timeline
```

Particularly verify:

```text
Task completion
Task date association
Routine recurrence
Reminder behavior
Project progress
Goal progress
Global search
Timeline generation
Persistence
```

---

# 63. IMPLEMENTATION ORDER

Do not implement everything in one uncontrolled generation.

Recommended sequence:

```text
Batch 1
Inspect Phase 1 + Phase 2 + Architecture

Batch 2
College Profile + Semester

Batch 3
Courses

Batch 4
Course Schedule Integration

Batch 5
Assignments + Task Integration

Batch 6
Exams + Calendar + Reminder Integration

Batch 7
Grades

Batch 8
Academic Notes / Knowledge / Projects integration

Batch 9
Academic Dashboard

Batch 10
Search + Timeline integration

Batch 11
Regression Testing + Polish
```

After each meaningful batch:

```text
Implement
 ↓
Analyze
 ↓
Test
 ↓
Review
 ↓
Continue
```

---

# 64. SCOPE CONTROL

If you discover useful features outside Phase 3:

DO NOT implement them.

Record them in:

```text
PHASE_3_DEFERRED_FEATURES.md
```

Examples:

```text
Advanced GPA analytics
AI study assistant
Automatic study plans
Cloud synchronization
Parent / teacher accounts
University API integration
Finance integration
```

---

# 65. ARCHITECTURAL ISSUES

If Phase 3 reveals limitations in Phase 1 or Phase 2:

Do not silently rewrite the architecture.

Document:

```text
Problem
Current behavior
Root cause
Possible solutions
Recommended solution
Migration impact
```

If the change is substantial, stop at the appropriate boundary for human review.

---

# 66. VALIDATION CHECKLIST

Before declaring Phase 3 complete:

```text
[ ] College profile works
[ ] Semester CRUD works
[ ] Active semester works
[ ] Semester history works
[ ] Course CRUD works
[ ] Course details work
[ ] Course schedule works
[ ] Course recurrence works

[ ] Assignments work
[ ] Assignment → Task integration works
[ ] Assignment due dates work
[ ] Assignment status works

[ ] Exams work
[ ] Exam → Calendar integration works
[ ] Exam → Reminder integration works

[ ] Grades work
[ ] Weighted calculations work
[ ] Incomplete grades handled correctly

[ ] Course → Notes works
[ ] Course → Knowledge works
[ ] Course → Project works

[ ] Academic dashboard works
[ ] Today integration works
[ ] Calendar integration works
[ ] Tasks integration works
[ ] Search integration works
[ ] Timeline integration works

[ ] Semester archival works
[ ] Historical data remains available
[ ] Safe deletion works
[ ] Persistence works

[ ] Phase 1 regression tests pass
[ ] Phase 2 regression tests pass
[ ] Responsive UI works
[ ] Accessibility checks pass
[ ] Static analysis passes
[ ] Tests pass
```

---

# 67. FINAL QUALITY CHECK

For Flutter projects, run the appropriate project validation commands, including where applicable:

```bash
flutter analyze
flutter test
```

Also validate all currently configured build targets.

Do not suppress analyzer warnings or errors merely to obtain a passing result.

---

# 68. IMPLEMENTATION REPORT

After completing Phase 3, create or update:

```text
PHASE_3_IMPLEMENTATION_REPORT.md
```

Include:

```text
1. Implementation Summary

2. Features Implemented

3. Files / Modules Changed

4. Data Model Changes

5. Academic Relationships Added

6. UI Changes

7. Calendar Integration

8. Task Integration

9. Reminder Integration

10. Search Integration

11. Timeline Integration

12. Grade Calculation Implementation

13. Tests Added

14. Phase 1 Regression Results

15. Phase 2 Regression Results

16. Validation Results

17. Known Issues

18. Deferred Features

19. Architectural Concerns

20. Recommended Next Phase
```

---

# 69. STOP CONDITION

When Phase 3 is complete:

**STOP.**

Do NOT automatically begin Phase 4.

Do NOT implement:

```text
Finance
Budget
Subscriptions
Wishlist
Inventory
Vault
AI
Cloud Sync
```

Wait for human review.

The human will manually test OmniLife and determine whether Phase 3 is accepted.

---

# 70. PHASE 3 SUCCESS CRITERIA

Phase 3 is successful when OmniLife can function as the user's personal academic manager.

The core workflow should be:

```text
Create Semester
      ↓
Add Courses
      ↓
Add Course Schedule
      ↓
Create Assignments
      ↓
Assignments become Tasks
      ↓
Tasks appear in Today / Calendar
      ↓
Create Exams
      ↓
Exams appear in Calendar
      ↓
Set Exam Reminders
      ↓
Create Study Notes / Knowledge
      ↓
Record Grades
      ↓
Monitor Academic Overview
```

And:

```text
Course
  ├── Schedule
  ├── Assignments
  ├── Exams
  ├── Grades
  ├── Notes
  ├── Knowledge
  └── Projects
```

Everything should remain part of the existing OmniLife ecosystem.

---

# 71. FINAL INSTRUCTION TO ANTIGRAVITY

Start by inspecting the current OmniLife workspace.

Read:

```text
Existing Architecture Documentation
PHASE_1_IMPLEMENTATION_REPORT.md
PHASE_2_IMPLEMENTATION_REPORT.md
Current Source Code
Current Data Models
Current Persistence Layer
Current Design System
Current Navigation
```

Then implement **ONLY OmniLife Phase 3** according to this specification.

Do not assume the project is empty.

Do not overwrite working Phase 1 or Phase 2 functionality blindly.

Do not implement future phases.

Do not introduce unrelated dependencies.

Do not silently change architecture.

Implement incrementally.

Test after each meaningful batch.

At the end, produce the Phase 3 implementation report.

Then STOP and wait for human review.
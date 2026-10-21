document id="60418" title="OmniLife Phase 16 — Goals & Personal Planning System"
# OMNILIFE — PHASE 16
## Goals & Personal Planning System

**Project:** OmniLife  
**Phase:** 16  
**Previous Phase:** Phase 15 — Knowledge Base & Personal Information Hub  
**Status:** Implementation Phase

---

## 1. Objective

Implement the **Goals & Personal Planning System** for OmniLife.

The system allows users to define meaningful goals and connect them with existing OmniLife modules:

- Tasks
- Projects
- Routines
- Calendar
- Reminders
- Academic
- Knowledge Base
- Notes

The goal is to allow the user to understand:

> What am I trying to achieve?

and:

> What should I do to achieve it?

and eventually:

> How close am I to achieving it?

---

# 2. Core Principle

Goals must **not** become another isolated task list.

The conceptual relationship should be:

```text
GOAL
 ├── PROJECTS
 ├── TASKS
 ├── ROUTINES
 ├── CALENDAR / SCHEDULE
 └── KNOWLEDGE
```

A **Goal** represents the desired outcome.

Projects, tasks, routines, schedules, and knowledge are supporting activities or resources.

---

# 3. Example

Example Goal:

```text
Goal:
Become Better at Programming
```

Connected items:

```text
Projects:
- OmniLife
- OmniTenant

Tasks:
- Learn Riverpod
- Build Authentication
- Study Database Architecture

Routines:
- Coding Practice — 1 hour/day

Knowledge:
- Flutter Architecture
- Dart Notes
- Database Design

Calendar:
- Monday 19:00 — Programming Study
```

The Goal should provide a high-level overview without duplicating any of these entities.

---

# 4. Goal Types

Support optional goal categories.

Recommended categories:

```text
PERSONAL
ACADEMIC
CAREER
HEALTH
FINANCE
PROJECT
LEARNING
OTHER
```

Do not hard-code the system around these categories.

The architecture should allow future customization.

---

# 5. Goal Model

Conceptually:

```text
Goal

id
title
description
category
status
priority
startDate
targetDate
progress
createdAt
updatedAt
completedAt
archivedAt
```

Use the existing project architecture and naming conventions.

Do not duplicate user/profile information.

---

# 6. Goal Status

Recommended statuses:

```text
ACTIVE
COMPLETED
PAUSED
CANCELLED
ARCHIVED
```

Default status:

```text
ACTIVE
```

---

# 7. Goal Priority

Support:

```text
LOW
MEDIUM
HIGH
```

Do not introduce unnecessarily complex priority levels.

---

# 8. Goal Dates

Goals may have:

```text
Start Date
Target Date
```

Both are optional.

Example without deadline:

```text
Goal:
Learn Chinese
```

Example with deadline:

```text
Goal:
Finish Semester Project

Target:
2026-12-20
```

Do not force users to assign deadlines.

---

# 9. Goal Progress

Represent progress as:

```text
0–100%
```

The system should support two approaches.

### Manual Progress

The user directly changes:

```text
Progress: 65%
```

### Computed Progress

Future versions may calculate progress from connected tasks, milestones, or other entities.

For Phase 16:

**Implement manual progress only.**

Prepare the architecture for future computed progress.

---

# 10. Progress Automation Rule

Do **not** automatically calculate something such as:

```text
Goal = 37%
```

simply because several tasks have been completed.

A completed task does not necessarily represent proportional progress toward the overall goal.

---

# 11. Goal Creation

Minimum creation fields:

```text
Goal Title
Category
Target Date
```

Optional:

```text
Description
Priority
Start Date
Progress
```

The creation flow must remain quick.

Do not create a long multi-step wizard.

---

# 12. Goal Detail Page

Suggested structure:

```text
Goal

[Progress]

Description

Target Date

Priority

Projects
Tasks
Routines
Calendar
Knowledge

Milestones

Activity
```

Only show sections that contain relevant data.

Avoid displaying empty sections.

---

# 13. Goals Home

Create a Goals landing page.

Suggested structure:

```text
Goals

Active Goals
    ├── Goal A
    ├── Goal B
    └── Goal C

Completed

Archived
```

Paused and Cancelled goals may be accessible through filters.

Do not display unnecessary statistics.

---

# 14. Goal Card

Goal cards should display:

```text
Goal Title
Category
Progress
Target Date
Priority
```

Example:

```text
Learn Flutter

Learning

████████░░ 80%

Target:
30 September 2026
```

Keep cards compact and readable.

---

# 15. Deadline Status

When a goal has a target date, calculate its deadline state.

Possible states:

```text
ON_TRACK
DUE_SOON
OVERDUE
COMPLETED
```

Example:

```text
On Track
24 days remaining
```

Do not create aggressive notifications automatically.

---

# 16. Overdue Goals

If:

```text
status = ACTIVE
```

and:

```text
targetDate < currentDate
```

show:

```text
OVERDUE
```

Do **not** automatically mark the goal as failed.

The user can decide to:

```text
Continue
Change Deadline
Pause
Complete
Cancel
```

---

# 17. Goal → Project

Allow Goals to connect to Projects.

Example:

```text
Goal:
Build My Own Software Products

Projects:
- OmniLife
- OmniTenant
```

Use references instead of duplicating Project data.

---

# 18. Goal → Task

Allow Tasks to be associated with Goals.

Example:

```text
Goal:
Learn Flutter

Tasks:
- Learn Riverpod
- Build CRUD Screen
- Build Authentication
```

The Task must remain a normal Task.

The Goal relationship is metadata.

---

# 19. Goal → Routine

Allow recurring Routines to contribute toward a Goal.

Example:

```text
Goal:
Improve Fitness

Routine:
Workout — Monday / Wednesday / Friday
```

Do not duplicate the Routine.

---

# 20. Goal → Calendar

Allow Calendar events to optionally reference a Goal.

Example:

```text
Calendar:
Tuesday 19:00
Flutter Study

Goal:
Learn Flutter
```

Do not create a second calendar event.

---

# 21. Goal → Knowledge Base

Allow Knowledge Base items to connect to Goals.

Example:

```text
Goal:
Learn Programming

Knowledge:
- Dart Fundamentals
- Flutter Architecture
- Riverpod
```

Use the Knowledge Base architecture from Phase 15.

---

# 22. Goal Relationships

Conceptually:

```text
Goal
 │
 ├── Project IDs
 ├── Task IDs
 ├── Routine IDs
 ├── Calendar Event IDs
 └── Knowledge IDs
```

Do not copy entity content into Goal records.

---

# 23. Goal Relation Model

If required by the architecture:

```text
GoalRelation

id
goalId
entityType
entityId
relationType
createdAt
```

Possible entity types:

```text
TASK
PROJECT
ROUTINE
CALENDAR_EVENT
NOTE
KNOWLEDGE
```

Reuse existing relationship infrastructure if available.

---

# 24. Relationship Type

Keep the initial relationship model simple.

Use:

```text
SUPPORTS
```

Example:

```text
Goal:
Learn Flutter

SUPPORTS:
- Project: OmniTenant
- Task: Learn Riverpod
- Routine: Coding Practice
- Knowledge: Flutter Architecture
```

Do not build a complicated relationship taxonomy.

---

# 25. Goal Hierarchy

Optionally support parent and child Goals.

Example:

```text
Become a Better Developer
│
├── Learn Flutter
├── Learn Backend
└── Build OmniTenant
```

However:

**Do not implement unlimited nesting in Phase 16.**

Maximum recommended hierarchy:

```text
Parent Goal
    └── Child Goal
```

If hierarchy significantly complicates the architecture, defer it.

---

# 26. Milestones

Introduce lightweight milestones.

Example:

```text
Goal:
Learn Flutter

Milestones:

[✓] Learn Dart Basics
[✓] Understand Flutter Widgets
[ ] Learn State Management
[ ] Build Complete Application
```

Milestones are significant checkpoints.

They are **not replacements for Tasks**.

---

# 27. Milestone Model

Conceptually:

```text
GoalMilestone

id
goalId
title
description
order
isCompleted
completedAt
createdAt
updatedAt
```

Keep milestones simple.

---

# 28. Milestone Progress

Display milestone completion separately.

Example:

```text
2 / 5 milestones completed
```

Do not automatically convert milestone completion into Goal percentage in Phase 16.

---

# 29. Goal Description / Notes

Allow an optional description for a Goal.

Example:

```text
Why:

I want to become comfortable building apps independently.

Success Criteria:

I can build and deploy a complete Flutter application.
```

Do not create another Notes system.

If the existing Notes system can be linked, prefer linking it.

---

# 30. Success Criteria

Optionally support:

```text
Success Criteria
```

Example:

```text
Goal:
Improve English

Success Criteria:

- Understand technical videos without subtitles.
- Write technical documentation comfortably.
```

Keep this lightweight.

---

# 31. Next Action

Allow each Goal to optionally identify a:

```text
Next Action
```

Example:

```text
Goal:
Build OmniTenant

Next Action:
Implement Inventory Module
```

Prefer linking to an existing Task.

Do not duplicate the Task content.

---

# 32. Goal Review

Allow the user to record a lightweight Goal review.

Suggested fields:

```text
Current Progress
What is going well?
What is blocking me?
Next Action
```

For Phase 16, this may simply be stored as a lightweight note/field.

Do not build a complete journaling system.

---

# 33. Goal Filters

Support:

```text
Active
Completed
Paused
Cancelled
Archived
```

Optional filters:

```text
Category
Priority
Deadline
```

Do not make the UI overwhelming.

---

# 34. Goal Sorting

Support:

```text
Priority
Target Date
Recently Updated
Progress
```

Default sorting should prioritize relevant active goals.

---

# 35. Goal Search

Integrate Goals into the existing **Global Search** from Phase 11.

Example search:

```text
Flutter
```

Possible results:

```text
GOAL
Learn Flutter

PROJECT
OmniTenant

TASK
Learn Riverpod

KNOWLEDGE
Flutter Architecture
```

Do not create a separate Goal search engine.

---

# 36. Global Search Filter

Add:

```text
Goals
```

to the existing Global Search filters.

Reuse existing search infrastructure.

---

# 37. Dashboard Integration

Add a small:

```text
Active Goals
```

section to the Dashboard if it fits the existing UI.

Example:

```text
Active Goals

Learn Flutter       70%
Build OmniTenant    45%
Improve Fitness     60%
```

Show a maximum of approximately 3–5 relevant goals.

Do not put every goal on the Dashboard.

---

# 38. Today Page Integration

Do not display entire Goals on the Today page.

Instead, if a Task, Event, or Routine belongs to a Goal, optionally show the context.

Example:

```text
Task:
Study Flutter

Goal:
Learn Flutter
```

This provides context without clutter.

---

# 39. Calendar Integration

Goal-linked Calendar events may be visually identifiable where appropriate.

Reuse the existing OmniLife calendar color/design conventions.

Do not introduce another calendar color system.

---

# 40. Task Integration

When viewing a Task:

```text
Task:
Build Login Screen

Goal:
Build OmniTenant
```

Support navigation:

```text
Task → Goal
Goal → Task
```

Only one Task object should exist.

---

# 41. Project Integration

When viewing a Project:

```text
Project:
OmniTenant

Goal:
Build My POS Product
```

Support:

```text
Project → Goal
Goal → Project
```

Do not duplicate Projects.

---

# 42. Routine Integration

When viewing a Routine:

```text
Routine:
Coding Practice

Goal:
Improve Programming
```

Support:

```text
Routine → Goal
Goal → Routine
```

The Routine remains independent.

---

# 43. Academic Integration

Academic entities may optionally connect to Goals.

Example:

```text
Goal:
Pass Semester Successfully

Course:
Database Systems

Assignment:
Database Project

Exam:
Final Exam
```

Do not duplicate Academic records.

---

# 44. Knowledge Integration

Use the Phase 15 Knowledge Base.

Example:

```text
Goal:
Learn Chinese

Knowledge:
- Chinese Grammar
- HSK Vocabulary
- Listening Notes
```

Do not duplicate Notes.

---

# 45. Goal Archive

Completed, cancelled, or abandoned Goals must remain stored.

Do not delete historical Goals automatically.

Archive them instead.

This is important for future analytics.

---

# 46. Historical Data

The architecture should preserve enough data for future questions such as:

```text
What goals did I have last year?

Which goals did I complete?

How long did they take?

Which Projects were associated with them?
```

Do not implement historical analytics yet.

Preserve the required data now.

---

# 47. Offline-First

Goals must work fully offline.

The following operations must work locally:

```text
Create
Edit
Delete
Archive
Complete
Pause
Resume
Connect
Disconnect
Search
```

---

# 48. Database Design

Potential new tables:

```text
Goal
GoalMilestone
GoalRelation
```

Reuse existing entities:

```text
Task
Project
Routine
CalendarEvent
Note
Knowledge
```

Do not duplicate entity data.

---

# 49. Service Architecture

Preferred architecture:

```text
Goals UI
    │
    ▼
Goal Service
    │
    ├── Goal Repository
    ├── Goal Relation Service
    │
    └── Existing Services
            ├── Task
            ├── Project
            ├── Routine
            ├── Calendar
            └── Knowledge
```

`GoalService` coordinates relationships.

It must not own unrelated entity data.

---

# 50. Service Operations

Conceptually support:

```text
createGoal()
updateGoal()
deleteGoal()
archiveGoal()
completeGoal()
pauseGoal()
resumeGoal()

createMilestone()
updateMilestone()
completeMilestone()

linkEntityToGoal()
unlinkEntityFromGoal()

getGoal()
getGoals()
getActiveGoals()
getCompletedGoals()

searchGoals()
```

Follow existing OmniLife service conventions.

---

# 51. Future AI Compatibility

Do **not** implement AI in Phase 16.

However, the domain layer should eventually support AI operations such as:

```text
createGoal()
updateGoal()
createMilestone()
linkTaskToGoal()
linkProjectToGoal()
getGoalProgress()
```

AI must never directly manipulate the database.

AI must call application services.

---

# 52. Future AI Examples

The architecture should eventually support commands such as:

```text
"Create a goal to learn Flutter by December."

"Show me my active goals."

"What tasks are related to learning Flutter?"

"What should I work on today to progress my goal?"

"Move this project under my programming goal."
```

Do not implement these AI interactions yet.

---

# 53. Mobile UX

Mobile priorities:

```text
Goals
Active Goals
Goal Detail
Progress
Milestones
Related Tasks
Related Projects
```

The user should be able to quickly inspect Goal progress.

---

# 54. Desktop UX

Desktop may provide:

```text
Goals
├── Active
├── Completed
├── Paused
└── Archived
```

Goal detail can display connected entities in organized sections.

Do not perform the final OmniLife UI/UX overhaul during Phase 16.

---

# 55. Quick Create

Recommended:

```text
+ New Goal
```

Minimum:

```text
Title
```

Optional:

```text
Category
Target Date
Priority
Description
```

Do not make Goal creation a long wizard.

---

# 56. Empty State

When no Goals exist:

```text
No goals yet.

Create your first goal and connect it
to the things you are already doing.
```

Provide:

```text
+ Create Goal
```

---

# 57. Goal Completion

When completing a Goal:

Show a simple confirmation.

Do **not** automatically:

```text
Delete related Tasks
Delete Projects
Delete Routines
Delete Notes
Delete Calendar Events
```

All related data must remain intact.

---

# 58. Paused Goals

Paused Goals remain visible under:

```text
Paused
```

Their associated Tasks, Projects, and Routines remain intact.

Do not automatically disable related entities.

---

# 59. Cancelled Goals

Cancelled Goals remain historically accessible.

Example:

```text
Goal:
Build Game X

Status:
Cancelled

Reason:
Project scope changed
```

The reason is optional.

---

# 60. Data Validation

Validate:

```text
Title cannot be empty.

Progress must be between 0 and 100.

Target date must be valid.

Milestone must belong to an existing Goal.

A Goal cannot relate to itself.

Duplicate relationships must be prevented.

Deleted entities must not create broken references.
```

---

# 61. Database Migration

If database changes are necessary:

1. Create migration.
2. Preserve all existing data.
3. Verify Notes.
4. Verify Tasks.
5. Verify Projects.
6. Verify Routines.
7. Verify Calendar.
8. Verify Academic.
9. Verify Knowledge Base.
10. Test application startup after migration.

No destructive migrations.

---

# 62. Testing

Test Goal operations:

```text
Create
Update
Delete
Archive
Complete
Pause
Resume
```

Test Progress:

```text
0%
50%
100%
Invalid values
```

Test Milestones:

```text
Create
Update
Complete
Uncomplete
Delete
```

Test relationships:

```text
Goal ↔ Task
Goal ↔ Project
Goal ↔ Routine
Goal ↔ Calendar
Goal ↔ Knowledge
```

---

# 63. Acceptance Test 1 — Basic Goal

Create:

```text
Goal:
Learn Flutter
```

Expected:

```text
Goal appears under Active Goals.
Progress = 0%.
```

---

# 64. Acceptance Test 2 — Progress

Change:

```text
Progress:
65%
```

Expected:

```text
Goal displays 65%.
```

---

# 65. Acceptance Test 3 — Milestones

Create:

```text
Learn Dart
Learn Widgets
Learn State Management
Build App
```

Complete:

```text
Learn Dart
Learn Widgets
```

Expected:

```text
2 / 4 milestones completed
```

Goal percentage must not automatically change.

---

# 66. Acceptance Test 4 — Task

Create:

```text
Task:
Learn Riverpod
```

Connect it to:

```text
Goal:
Learn Flutter
```

Expected:

```text
Goal → Task visible
Task → Goal visible
```

Only one Task exists.

---

# 67. Acceptance Test 5 — Project

Connect:

```text
Project:
OmniTenant

Goal:
Build My POS Product
```

Expected:

```text
Goal → Project
Project → Goal
```

No duplicated Project.

---

# 68. Acceptance Test 6 — Routine

Connect:

```text
Routine:
Coding Practice
```

to:

```text
Goal:
Improve Programming
```

Expected:

```text
Goal → Routine
Routine → Goal
```

---

# 69. Acceptance Test 7 — Knowledge

Connect:

```text
Knowledge:
Flutter Architecture
```

to:

```text
Goal:
Learn Flutter
```

Expected:

```text
Goal → Knowledge
Knowledge → Goal
```

Do not duplicate the Note.

---

# 70. Acceptance Test 8 — Search

Search:

```text
Flutter
```

Expected results can include:

```text
Goal:
Learn Flutter

Task:
Learn Riverpod

Project:
OmniTenant

Knowledge:
Flutter Architecture
```

---

# 71. Acceptance Test 9 — Offline

Disable internet.

Verify:

```text
Create Goal
Edit Goal
Create Milestone
Connect Task
Search Goal
Complete Goal
```

All must work locally.

---

# 72. Acceptance Test 10 — Regression

Verify all previous systems:

```text
Phase 11
Global Search

Phase 12
Calendar
Schedule
Reminders

Phase 13
Tasks
Projects

Phase 14
Academic

Phase 15
Knowledge Base
Topics
Tags
Relationships
References
```

No regressions are acceptable.

---

# 73. Acceptance Test 11 — Mobile

On Android verify:

```text
Open Goals
Create Goal
Open Goal
Change Progress
Add Milestone
Connect Task
Open Related Task
```

All operations must work.

---

# 74. Documentation

Create or update:

```text
docs/GOALS_ARCHITECTURE.md
```

Document:

```text
Goal model
Goal statuses
Goal milestones
Goal relationships
Task integration
Project integration
Routine integration
Calendar integration
Academic integration
Knowledge integration
Search integration
Database
Service architecture
Migration
Future AI compatibility
```

Update the main OmniLife architecture documentation.

---

# 75. UI Constraints

Do **not** perform the final UI/UX overhaul.

Do not:

```text
Redesign the entire OmniLife
Replace global navigation
Change the global theme
Remove existing features
Perform Indonesian/English localization
Merge modules prematurely
```

Only implement the UI required for Phase 16.

The major UI/UX simplification remains scheduled for the later final UI/UX phase.

---

# 76. Success Definition

Phase 16 is successful when OmniLife can represent:

```text
WHAT I WANT
      │
      ▼
     GOAL
      │
      ▼
 MILESTONES
      │
      ▼
SUPPORTING SYSTEM
      │
      ├── PROJECTS
      ├── TASKS
      ├── ROUTINES
      ├── CALENDAR
      └── KNOWLEDGE
```

The user should be able to understand the relationship between:

```text
Long-Term Goal
      ↓
Projects
      ↓
Tasks / Routines
      ↓
Daily Actions
```

without duplicating information.

---

# 77. Do Not Move Forward If

Do not consider Phase 16 complete if:

```text
Goals are isolated from existing OmniLife modules.

Tasks are duplicated.

Projects are duplicated.

Notes are duplicated.

Relationships are one-way or broken.

Progress cannot be edited.

Milestones do not work.

Goals disappear after completion.

Existing data is lost.

Global Search regresses.

Mobile operation fails.

Offline operation fails.

Phase 11–15 features regress.

AI is connected directly to the database.
```

Fix all issues before declaring Phase 16 complete.

---

# 78. Final Implementation Report

When implementation is complete, provide:

```text
OMNILIFE PHASE 16 REPORT

Status:
COMPLETED / PARTIAL / BLOCKED

Goals:
- ...

Milestones:
- ...

Progress:
- ...

Task Integration:
- ...

Project Integration:
- ...

Routine Integration:
- ...

Calendar Integration:
- ...

Academic Integration:
- ...

Knowledge Integration:
- ...

Global Search:
- ...

Mobile:
- ...

Offline:
- ...

Database Migration:
- ...

Tests:
- Passed: X
- Failed: X

Files Created:
- ...

Files Modified:
- ...

Known Limitations:
- ...

Technical Debt:
- ...

Recommended Next Phase:
- Phase 17
```

---

# FINAL ARCHITECTURAL PRINCIPLE

Do not think of Phase 16 as:

```text
"Build another To-Do List."
```

Think of it as:

```text
                    GOAL
                      │
              "What do I want?"
                      │
                      ▼
                 MILESTONES
                      │
             "What does success
                look like?"
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
      PROJECTS       TASKS      ROUTINES
          │           │           │
          └───────────┼───────────┘
                      ▼
                  CALENDAR
                      │
                      ▼
                  KNOWLEDGE
```

**Goals are the strategic layer of OmniLife.**

Tasks tell the user **what to do**.

Projects tell the user **what they are building**.

Routines tell the user **what they repeatedly do**.

Calendar tells the user **when they do it**.

Knowledge tells the user **what they know**.

Goals tell the user **why they are doing it**.

Keep the implementation:

- Simple
- Interconnected
- Offline-first
- Maintainable
- Ready for future AI orchestration

Do not implement the following in Phase 16:

- AI
- Cloud synchronization
- Multi-user functionality
- Financial management
- Secure Vault
- Final global UI/UX overhaul
- Indonesian/English localization

These belong to later phases.
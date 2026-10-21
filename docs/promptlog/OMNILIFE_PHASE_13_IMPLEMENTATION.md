# OMNILIFE — PHASE 13 IMPLEMENTATION PROMPT
## Tasks, To-Do & Projects 2.0

**Project:** OmniLife  
**Phase:** 13  
**Previous Phase:** Phase 12 — Calendar & Scheduling 2.0  
**Status:** Implementation Phase

---

# 1. ROLE

You are the implementation agent for OmniLife.

Phase 13 focuses on:

> **Tasks, To-Do, Projects & Personal Work Management**

The objective is to build a flexible task-management layer that can support:

- Simple daily to-do items
- Important tasks
- Deadlines
- Recurring tasks
- Projects
- Subtasks
- Task priorities
- Categories/tags
- Task scheduling
- Task ↔ Calendar integration
- Task ↔ Project integration
- Task ↔ Goal integration
- Task ↔ Academic integration
- Global Search integration

The system must remain useful for a single person.

Do not turn OmniLife into a corporate project-management application.

---

# 2. IMPORTANT PRE-IMPLEMENTATION RULE

Before changing anything:

1. Inspect the existing Task system.
2. Inspect existing To-Do functionality.
3. Inspect existing Project functionality.
4. Inspect existing Goal relationships.
5. Inspect Calendar Phase 12 implementation.
6. Inspect Reminder implementation.
7. Inspect Routine implementation.
8. Inspect Phase 11 Global Search.
9. Inspect existing database models.
10. Inspect existing navigation and design system.

Reuse existing infrastructure whenever possible.

Do not create duplicate task/project systems.

---

# 3. CORE CONCEPT

OmniLife should distinguish between:

```text
TASK
=
Something that needs to be done.

PROJECT
=
A larger outcome made of multiple tasks.

GOAL
=
A desired longer-term outcome.

CALENDAR EVENT
=
Something happening at a particular time.

ROUTINE
=
Something that repeats as part of a regular pattern.
```

These are related but NOT interchangeable.

---

# 4. TARGET STRUCTURE

The intended relationship is:

```text
                    GOAL
                     │
                     ▼
                  PROJECT
                     │
             ┌───────┼───────┐
             ▼       ▼       ▼
           TASK    TASK    TASK
             │       │
             ▼       ▼
          SUBTASK  SUBTASK
             │
             ▼
          CALENDAR
             │
             ▼
          REMINDER
```

Not every task needs a project.

Not every task needs a goal.

Not every task needs a calendar schedule.

---

# 5. TASK ENTITY

If the current model is insufficient, create/adapt a normalized Task model.

Conceptually:

```text
Task

id
title
description
status
priority
createdAt
updatedAt

dueDate
scheduledStart
scheduledEnd

projectId
goalId

parentTaskId

tags
category

recurrenceRule

completedAt

reminderReferences

createdFrom
```

Adapt naming to the existing architecture.

Do not blindly copy this structure if an equivalent already exists.

---

# 6. TASK STATUS

At minimum support:

```text
TODO
IN_PROGRESS
COMPLETED
```

Optionally:

```text
CANCELLED
```

Avoid creating excessive statuses.

The goal is clarity, not enterprise workflow management.

---

# 7. TASK PRIORITY

Support:

```text
LOW
MEDIUM
HIGH
```

Optional:

```text
URGENT
```

Do not make priority visually overwhelming.

Priority must not rely solely on color.

---

# 8. SIMPLE TASK CREATION

Creating a task should be fast.

Minimum:

```text
Title
```

Optional:

```text
Description
Due date
Priority
Project
Tags
Schedule
Reminder
```

A user should NOT be forced to fill out a large form for a simple:

```text
Buy milk
```

---

# 9. QUICK TASK CREATION

Provide a quick-create path.

Example:

```text
+ Add Task
```

Then:

```text
Buy groceries
```

Save.

The task should immediately exist.

Additional details can be added later.

---

# 10. TASK DESCRIPTION

Tasks may have additional details.

Example:

```text
Title:
Finish Mathematics Assignment

Description:
Complete exercises 1–20.
Review chapter 3 first.
```

Do not require descriptions.

---

# 11. TASK COMPLETION

Users should be able to mark a task completed quickly.

Expected behavior:

```text
TODO
 ↓
COMPLETED
```

Store:

```text
completedAt
```

when appropriate.

---

# 12. COMPLETED TASK HISTORY

Do not permanently delete completed tasks by default.

Completed tasks are useful for:

- History
- Analytics
- Project progress
- Productivity insights
- Personal timeline

Completed tasks should remain queryable.

---

# 13. UNDO COMPLETION

Provide an easy way to undo completion.

Example:

```text
Completed

Undo
```

or equivalent interaction.

The task returns to its previous active status.

---

# 14. TASK EDITING

Users should be able to edit:

```text
Title
Description
Status
Priority
Due date
Schedule
Project
Goal
Tags
Category
Reminder
Recurrence
```

Only expose fields that actually exist.

---

# 15. TASK DELETION

Allow task deletion.

Before destructive deletion, use the existing confirmation pattern.

Do not delete related Project or Goal entities accidentally.

If a task has subtasks, handle the relationship explicitly.

---

# 16. TASK ARCHIVING

If practical, support archiving separately from deletion.

Concept:

```text
Active
Archived
Deleted
```

However, do not introduce a complicated archive system if the current application does not need it.

Deletion must remain distinct from completion.

---

# 17. SUBTASKS

Support hierarchical tasks.

Example:

```text
Prepare presentation
│
├── Research topic
├── Create slides
├── Add references
└── Practice presentation
```

Conceptual:

```text
parentTaskId
```

should establish the relationship.

---

# 18. SUBTASK COMPLETION

A parent task may display progress:

```text
Prepare presentation

3 / 4 completed
```

Do not automatically mark the parent complete unless the user explicitly enables such behavior.

The default should preserve user control.

---

# 19. SUBTASK DEPTH

Avoid unlimited nesting if it creates unnecessary complexity.

Recommended:

```text
Task
 └── Subtask
```

or a small controlled depth.

Do not create a complicated project-management hierarchy.

---

# 20. TASK LISTS

Provide useful task views.

At minimum:

```text
All
Today
Upcoming
Overdue
Completed
```

Optional:

```text
Inbox
No Date
By Project
By Priority
```

Only implement views that fit the existing UX.

---

# 21. TODAY TASKS

A dedicated Today view should show:

```text
Tasks due today
Scheduled tasks today
Overdue tasks requiring attention
```

Do not automatically show every task in the database.

---

# 22. UPCOMING TASKS

Provide a query for future tasks.

Example:

```text
Upcoming

Tomorrow
• Mathematics assignment

Friday
• Submit project

Next week
• Study for exam
```

---

# 23. OVERDUE TASKS

A task is overdue when:

```text
dueDate < current date
AND
status != COMPLETED
```

Display overdue tasks clearly.

Do not automatically mark them completed or reschedule them.

---

# 24. OVERDUE TASK ACTIONS

The user should be able to:

```text
Complete
Reschedule
Edit
Delete
```

Do not silently modify the user's deadlines.

---

# 25. NO-DATE TASKS

Tasks do not always require dates.

Example:

```text
Learn Blender
Read about investing
Research laptop
Fix old project
```

These tasks should remain accessible through:

```text
No Date
```

or another suitable view.

Do not force every task into Calendar.

---

# 26. TASK DEADLINE VS SCHEDULE

This distinction is mandatory.

A task may have:

```text
Due:
Friday
```

without:

```text
Scheduled:
14:00–15:00
```

The system must not automatically turn every deadline into a calendar event.

---

# 27. SCHEDULED TASK

A task may optionally have:

```text
scheduledStart
scheduledEnd
```

Example:

```text
Study Mathematics
14:00–15:00
```

This should appear on Calendar.

---

# 28. CALENDAR INTEGRATION

Use the Phase 12 Calendar architecture.

Do NOT create a second calendar implementation.

Concept:

```text
Task
  │
  ├── Due Date
  │
  └── Schedule
        │
        ▼
     Calendar
```

Scheduled tasks should appear in Calendar as references to the actual Task entity.

---

# 29. TASK → CALENDAR NAVIGATION

From a Calendar scheduled task:

```text
Click task
 ↓
Task detail
```

Do not navigate to a duplicate calendar-event record.

---

# 30. CALENDAR → TASK NAVIGATION

From Task detail:

```text
Scheduled:
Friday 14:00–15:00

Open in Calendar
```

if practical.

Use Phase 11 deep-navigation infrastructure.

---

# 31. REMINDER INTEGRATION

Tasks may have reminders.

Reuse the existing Reminder service.

Do NOT create a TaskReminderService if a global reminder system already exists.

Example:

```text
Task:
Submit assignment

Reminder:
1 day before
```

---

# 32. RECURRING TASKS

Support recurring tasks where appropriate.

Examples:

```text
Review notes every Sunday
Clean room every Saturday
Pay subscription every month
```

Use the existing recurrence architecture from Phase 12 where possible.

Do not create a second recurrence engine.

---

# 33. RECURRING TASK COMPLETION

A recurring task should represent recurring occurrences rather than simply becoming permanently completed.

Example:

```text
Weekly:
Workout log

Monday
✓

Next Monday
TODO
```

Use occurrence-based behavior compatible with the Calendar recurrence architecture.

---

# 34. PROJECT ENTITY

If Project functionality already exists, improve it rather than creating a new Project model.

Conceptually:

```text
Project

id
name
description
status
priority
createdAt
updatedAt

startDate
targetDate

goalId

tags

archivedAt
```

Adapt to the existing architecture.

---

# 35. PROJECT STATUS

Recommended:

```text
PLANNED
ACTIVE
ON_HOLD
COMPLETED
ARCHIVED
```

Do not force users to use all statuses.

---

# 36. PROJECT PROGRESS

Calculate project progress from its tasks where possible.

Example:

```text
College Website

6 / 10 tasks complete

60%
```

Do not manually duplicate progress values unless necessary.

Prefer derived progress.

---

# 37. PROJECT COMPLETION

A project can be marked complete manually.

Do not automatically complete a project merely because all tasks are complete unless the architecture explicitly supports an opt-in behavior.

---

# 38. PROJECT TASKS

Project detail should expose its tasks.

Example:

```text
College Website

Progress: 60%

Tasks

✓ Research
✓ Wireframe
✓ Database design
○ Implement frontend
○ Testing
```

Users should be able to create tasks directly from the project.

---

# 39. PROJECT QUICK ADD

Inside a project:

```text
+ Add Task
```

should automatically associate the new task with that project.

Do not require the user to select the project again.

---

# 40. PROJECT DEADLINES

Projects may have:

```text
Start date
Target date
```

but this should not automatically create calendar events unless explicitly intended.

---

# 41. PROJECT → CALENDAR

Project-related tasks and events can appear on Calendar through their own relationships.

Do not duplicate the entire project as a calendar event.

---

# 42. PROJECT → GOAL

If Goals exist:

```text
Goal
 ↓
Project
```

A project may optionally contribute to a goal.

Example:

```text
Goal:
Build healthy lifestyle

Project:
12-week workout program
```

Do not require every project to have a goal.

---

# 43. PROJECT → SEARCH

Projects must be searchable through Phase 11 Global Search.

Example:

```text
Search:
OmniTenant

Result:
PROJECT
OmniTenant Development
```

Clicking should open the correct project detail.

---

# 44. TASK → SEARCH

Tasks must be searchable through Phase 11 Global Search.

Search result should identify:

```text
TASK
```

and navigate directly to the task.

---

# 45. TAGS

Support lightweight tags.

Examples:

```text
#college
#personal
#coding
#urgent
#finance
```

Tags should be reusable across tasks/projects where appropriate.

Do not create a complex tag management system.

---

# 46. CATEGORIES

If the application already has categories, reuse them.

Do not create duplicate category systems.

Possible categories:

```text
Personal
College
Work
Development
Health
Finance
```

The final taxonomy can evolve later.

---

# 47. TASK FILTERING

Support useful filters such as:

```text
Status
Priority
Project
Tag
Due date
Category
```

Do not overload the first version.

Filters should be composable where practical.

Example:

```text
Project = College
Status = TODO
Priority = HIGH
```

---

# 48. SORTING

Provide useful sorting:

```text
Due date
Priority
Created date
Updated date
Manual order
```

Default sorting should prioritize tasks needing attention.

Do not permanently modify task data when changing sort order unless explicitly intended.

---

# 49. MANUAL TASK ORDER

If the existing UX supports manual ordering:

```text
Drag
 ↓
Change order
```

Persist order where appropriate.

Do not introduce drag-and-drop if it significantly complicates the architecture.

---

# 50. TASK INBOX

If practical, provide an Inbox concept.

Purpose:

```text
Capture first.
Organize later.
```

Example:

```text
Inbox

Buy new mouse
Research scholarship
Fix Roblox project
Call someone
```

The user can later assign:

```text
Project
Date
Priority
Tag
```

Do not make Inbox mandatory for every task.

---

# 51. QUICK CAPTURE

A task should be creatable with minimal friction.

Example:

```text
+ Task

"Study Mandarin"
```

Save.

Then optionally enrich it.

This is especially important for mobile use.

---

# 52. TASK DETAIL

A task detail screen should show:

```text
Title
Status
Priority
Description

Due
Schedule

Project
Goal

Tags

Reminder

Subtasks

Related items
```

Only display sections that contain data.

Avoid showing empty blocks everywhere.

---

# 53. PROJECT DETAIL

Project detail should show:

```text
Project name
Description
Status
Progress
Target date

Tasks
Related goal
Related calendar items
Tags
```

Only show relevant data.

---

# 54. TASK ↔ PROJECT RELATIONSHIP

Use direct references where appropriate.

Conceptually:

```text
Task.projectId
```

Do not duplicate project information inside each task.

---

# 55. TASK ↔ GOAL RELATIONSHIP

If the architecture supports direct goal relationships:

```text
Task.goalId
```

Otherwise derive through Project.

Avoid redundant relationships.

---

# 56. TASK ↔ ACADEMIC

If Academic functionality already exists:

Tasks may relate to:

```text
Course
Assignment
Exam
Semester
```

Example:

```text
Course:
Mathematics

Assignment:
Chapter 3

Task:
Finish Chapter 3 exercises
```

Do not implement the Academic module in Phase 13.

Only integrate with existing models.

---

# 57. TASK ↔ ROUTINE

Tasks and routines are different.

Do NOT convert every recurring task into a routine.

Example:

```text
Routine:
Monday workout

Task:
Buy protein powder
```

These may coexist but should remain separate entities.

---

# 58. TASK ↔ GOAL SEMANTICS

A task should represent an actionable unit.

A goal should represent an outcome.

Example:

```text
Goal:
Improve fitness

Project:
12-week workout program

Task:
Complete Monday workout
```

Keep this conceptual separation in the data model.

---

# 59. PROJECT HIERARCHY

Avoid:

```text
Project
 ↓
Project
 ↓
Project
 ↓
Project
```

Projects should remain manageable.

If nested projects are already implemented, preserve them, but do not expand the hierarchy unnecessarily in Phase 13.

---

# 60. PROJECT TEMPLATES

Do NOT implement templates in this phase unless the current codebase already supports them.

Potential future examples:

```text
College Semester
Game Development
Personal Project
Trip Planning
```

Leave this for future phases.

---

# 61. DASHBOARD INTEGRATION

If OmniLife currently has a dashboard, expose useful task summaries:

```text
Today
Overdue
Upcoming
High Priority
```

Do not redesign the dashboard.

Only add the minimum required integration.

---

# 62. CALENDAR INTEGRATION SUMMARY

Calendar should be able to answer:

```text
What tasks are scheduled today?
What tasks are due today?
What tasks are overdue?
What project-related tasks are scheduled?
```

Task system should be able to answer:

```text
When is this task scheduled?
```

This should use service-level queries, not UI hacks.

---

# 63. TASK CONTEXT SERVICE

Create/adapt a reusable service that can answer:

```text
getTasksForToday()
getUpcomingTasks()
getOverdueTasks()
getTasksForProject(projectId)
getTasksForGoal(goalId)
getSubtasks(taskId)
getScheduledTasksForRange(start, end)
```

Use actual naming conventions.

---

# 64. PROJECT CONTEXT SERVICE

Create/adapt:

```text
getProjectTasks(projectId)
getProjectProgress(projectId)
getActiveProjects()
getUpcomingProjects()
```

where appropriate.

---

# 65. TASK STATISTICS

Provide basic derived metrics:

```text
Total tasks
Completed
Remaining
Overdue
Completion rate
```

Do not build the full Analytics module in this phase.

These metrics will later support Analytics.

---

# 66. PROJECT PROGRESS CALCULATION

Preferred:

```text
completedTasks / totalTasks
```

Example:

```text
8 / 10
=
80%
```

Handle:

```text
0 tasks
```

without division errors.

Do not report 100% for a project with zero tasks unless explicitly intended.

---

# 67. COMPLETION HISTORY

Keep enough information to later support:

```text
Tasks completed today
Tasks completed this week
Tasks completed this month
```

Do not build advanced analytics yet.

---

# 68. OFFLINE-FIRST

Everything in this phase must work locally.

Do not require:

```text
Internet
AI
Groq
Cloud API
```

for core task/project functionality.

---

# 69. DATA PERSISTENCE

Test:

```text
Create task
Close app
Reopen
```

Task remains.

Repeat for:

```text
Project
Subtask
Recurring task
Relationships
Completion
```

---

# 70. DATABASE MIGRATION

If schema changes are necessary:

1. Create a migration.
2. Preserve existing tasks.
3. Preserve existing projects.
4. Preserve relationships.
5. Test old data against the new schema.
6. Never silently delete user data.

---

# 71. PERFORMANCE

Do not load every task/project into memory if the database is capable of filtering.

Prefer:

```text
Repository queries
Indexes
Pagination
Range queries
```

Especially for:

```text
Completed history
Large projects
Long-term recurring tasks
```

---

# 72. MOBILE UX

Mobile should prioritize:

```text
Quick capture
Today
Upcoming
Task detail
Completion
Project progress
```

The user should be able to add a task quickly using one hand.

Do not simply shrink desktop task tables onto mobile.

---

# 73. DESKTOP UX

Desktop may provide:

```text
List
Project view
Filters
Sorting
Subtasks
Keyboard interaction
```

Use the existing design system.

Do not perform the Phase 25 redesign.

---

# 74. KEYBOARD SUPPORT

If the existing application has keyboard shortcuts:

Potential:

```text
Ctrl + K
Global Search

N
New Task
```

Only add shortcuts if they do not conflict with existing behavior.

Do not create a large shortcut system in this phase.

---

# 75. ACCESSIBILITY

Support:

```text
Keyboard navigation
Focus management
Readable labels
Accessible task controls
Semantic buttons
```

Do not use color as the sole representation of:

```text
Priority
Status
Overdue
Completed
```

---

# 76. SEARCH INTEGRATION

Use Phase 11:

```text
SearchProvider
SearchResult
EntityReference
RouteResolver
```

Do not create a second search implementation.

---

# 77. RELATED ITEMS

Task detail may show:

```text
Project
Goal
Calendar schedule
Reminder
Academic entity
```

only when related.

Example:

```text
Task:
Finish assignment

Related:
📁 Semester 1
📚 Mathematics
📅 Friday 15:00
```

Each should navigate through the existing routing system.

---

# 78. AI COMPATIBILITY

Do not implement new AI functionality.

However, task/project services must be designed so a future AI assistant can request structured operations.

For example:

```text
createTask(...)
completeTask(...)
rescheduleTask(...)
createProject(...)
getTasksForDate(...)
getOverdueTasks(...)
```

The AI must NOT directly manipulate database tables.

Future AI actions should use the same application services as the UI.

---

# 79. FUTURE AI EXAMPLE

Future user request:

```text
"Tambahkan task belajar matematika besok jam 7 malam."
```

Future architecture:

```text
AI
 ↓
Intent
 ↓
Task Service
 ↓
Validation
 ↓
Task created
 ↓
Calendar integration
```

Phase 13 only needs to ensure the service architecture can support this later.

Do not implement the AI command flow now.

---

# 80. NO CLOUD COLLABORATION

Do not implement:

```text
❌ Shared projects
❌ Multiple users
❌ Team members
❌ Comments
❌ Assigning tasks to other users
❌ Real-time collaboration
```

OmniLife remains personal/local-first.

---

# 81. TESTING

Create automated tests for:

### Tasks

```text
create
read
update
delete
complete
uncomplete
priority
status
due date
scheduled time
```

### Subtasks

```text
create
complete
parent relationship
progress
delete
```

### Projects

```text
create
update
archive
complete
task association
progress
```

### Recurrence

```text
daily
weekly
monthly
exceptions
```

### Integration

```text
Calendar
Reminder
Goal
Routine
Academic
Global Search
```

### Persistence

```text
restart application
```

---

# 82. ACCEPTANCE TEST 1 — BASIC TASK

Create:

```text
Task:
Buy groceries
```

Expected:

```text
Task appears immediately.
```

Restart application.

Expected:

```text
Task remains.
```

---

# 83. ACCEPTANCE TEST 2 — COMPLETE TASK

Mark:

```text
Buy groceries
```

completed.

Expected:

```text
Status = COMPLETED
completedAt is recorded
```

Undo completion.

Expected:

```text
Task becomes active again.
```

---

# 84. ACCEPTANCE TEST 3 — DUE DATE

Create:

```text
Submit assignment
Due:
Tomorrow
```

Expected:

```text
Appears in Upcoming.
```

---

# 85. ACCEPTANCE TEST 4 — OVERDUE

Create a task with a past due date.

Expected:

```text
Appears in Overdue.
```

Complete it.

Expected:

```text
No longer appears in active Overdue.
```

---

# 86. ACCEPTANCE TEST 5 — SCHEDULED TASK

Create:

```text
Study Mathematics
Friday
19:00–20:00
```

Expected:

```text
Task appears in Calendar.
```

Click it from Calendar.

Expected:

```text
Task detail opens.
```

---

# 87. ACCEPTANCE TEST 6 — PROJECT

Create:

```text
Project:
College Website
```

Create:

```text
Research
Create UI
Implement frontend
Testing
```

Associate them with the project.

Expected:

```text
College Website
0 / 4 completed
```

Complete two.

Expected:

```text
2 / 4
50%
```

---

# 88. ACCEPTANCE TEST 7 — SUBTASK

Create:

```text
Prepare Presentation
```

Add:

```text
Research
Create Slides
Practice
```

Complete two.

Expected:

```text
2 / 3 completed
```

Parent remains active.

---

# 89. ACCEPTANCE TEST 8 — RECURRING TASK

Create:

```text
Review notes
Every Sunday
```

Complete this Sunday's occurrence.

Expected:

```text
This occurrence = completed
Next Sunday = upcoming
```

Do not permanently eliminate future occurrences.

---

# 90. ACCEPTANCE TEST 9 — SEARCH

Search:

```text
College Website
```

Expected:

```text
PROJECT
College Website
```

Search:

```text
Create UI
```

Expected:

```text
TASK
Create UI
```

Click.

Expected:

```text
Correct detail page opens.
```

---

# 91. ACCEPTANCE TEST 10 — RELATIONSHIP

Open:

```text
Create UI
```

Expected:

```text
Related Project:
College Website
```

Click project.

Expected:

```text
College Website detail
```

---

# 92. ACCEPTANCE TEST 11 — CALENDAR

Create:

```text
Task:
Study
Schedule:
Saturday 15:00–16:00
```

Expected:

```text
Calendar shows Study at 15:00.
```

Delete task.

Expected:

```text
Task is removed from active calendar representation.
```

Do not leave an orphaned calendar record.

---

# 93. ACCEPTANCE TEST 12 — OFFLINE

Disable network.

Test:

```text
Create task
Complete task
Create project
Search task
Open task
```

Expected:

```text
All work.
```

---

# 94. ACCEPTANCE TEST 13 — MOBILE

On Android:

```text
Create task
Complete task
Create project
Open project
Add task
View subtasks
```

Expected:

```text
All core functionality works.
```

---

# 95. ACCEPTANCE TEST 14 — MIGRATION

If schema changes:

Use existing pre-Phase-13 data.

Expected:

```text
No task loss.
No project loss.
No relationship corruption.
```

---

# 96. ACCEPTANCE TEST 15 — REGRESSION

Verify Phase 11 and Phase 12:

```text
Global Search
Calendar
Reminders
Deep Navigation
```

still work.

Do not declare Phase 13 complete if previous phases regress.

---

# 97. DOCUMENTATION

Create/update:

```text
docs/TASK_PROJECT_ARCHITECTURE.md
```

Document:

```text
Task model
Project model
Subtasks
Task status
Priority
Due date
Schedule
Recurring tasks
Task ↔ Calendar
Task ↔ Project
Task ↔ Goal
Task ↔ Academic
Task ↔ Routine
Search integration
Service architecture
Persistence
Migration
```

Also update the main architecture document if required.

---

# 98. ARCHITECTURE TARGET

Preferred:

```text
                 TASK UI
                    │
                    ▼
             Task Controller
                    │
                    ▼
               Task Service
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
      Calendar   Reminder   Project
       Service    Service    Service
          │
          ▼
       Repository
          │
          ▼
        Database
```

The UI should not directly manipulate database records.

---

# 99. SERVICE API

Expose reusable operations conceptually:

```text
createTask()
updateTask()
completeTask()
uncompleteTask()
deleteTask()

getTasksForToday()
getUpcomingTasks()
getOverdueTasks()
getTasksForProject()
getTasksForGoal()

createSubtask()
getSubtasks()

createProject()
updateProject()
archiveProject()
getProjectProgress()
```

Use actual naming conventions from the project.

---

# 100. FUTURE EXTENSIBILITY

The architecture should eventually support:

```text
AI commands
Analytics
Dashboard
Academic management
Goals
Projects
Personal timeline
Notifications
Global Search
```

without rewriting the Task system.

---

# 101. UI CONSTRAINT

Do NOT perform the Phase 25 UI/UX overhaul.

Do NOT:

```text
❌ Replace the entire navigation
❌ Redesign every screen
❌ Change the global theme
❌ Remove features
❌ Collapse modules prematurely
```

Only implement the UI necessary for the Phase 13 functionality.

---

# 102. SUCCESS DEFINITION

Phase 13 is complete when:

```text
OmniLife can represent:

Simple tasks
    ↓
Tasks with deadlines
    ↓
Scheduled tasks
    ↓
Recurring tasks
    ↓
Subtasks
    ↓
Projects
    ↓
Project progress
    ↓
Goal relationships
    ↓
Calendar integration
    ↓
Reminder integration
    ↓
Global Search
    ↓
Deep Navigation
```

without duplicating the same data across modules.

---

# 103. DO NOT MOVE TO PHASE 14 IF

Do not consider Phase 13 complete if:

```text
❌ Tasks disappear after restart
❌ Completed tasks cannot be recovered/history
❌ Recurring tasks corrupt future occurrences
❌ Task schedules duplicate Calendar data incorrectly
❌ Project progress is inaccurate
❌ Subtasks corrupt parent tasks
❌ Global Search stops working
❌ Calendar integration breaks
❌ Existing Phase 11/12 functionality regresses
❌ Mobile core task management fails
❌ Database migration loses data
```

Fix regressions before continuing.

---

# 104. FINAL IMPLEMENTATION REPORT

When implementation is complete, provide:

```text
OMNILIFE PHASE 13 REPORT

Status:
COMPLETED / PARTIAL / BLOCKED

Existing Task system inspected:
- ...

Task functionality:
- ...

Subtasks:
- ...

Projects:
- ...

Project progress:
- ...

Recurring tasks:
- ...

Calendar integration:
- ...

Reminder integration:
- ...

Goal integration:
- ...

Academic integration:
- ...

Routine integration:
- ...

Global Search:
- ...

Deep navigation:
- ...

Offline:
- ...

Mobile:
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
- Phase 14
```

---

# FINAL PRINCIPLE

Phase 13 should make OmniLife understand:

> **What needs to be done, why it matters, when it needs to happen, and what larger thing it belongs to.**

The intended flow is:

```text
                     GOAL
                      │
                      ▼
                   PROJECT
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
        TASK        TASK        TASK
          │           │
       SUBTASK     SUBTASK
          │           │
          └─────┬─────┘
                │
                ▼
           SCHEDULE
                │
                ▼
             CALENDAR
                │
                ▼
            REMINDER
```

Keep these concepts separate.

A:

```text
Task
```

is not automatically a:

```text
Calendar Event
```

A:

```text
Project
```

is not a:

```text
Goal
```

A:

```text
Routine
```

is not a:

```text
Recurring Task
```

They should work together through clean relationships.

Build the task/project foundation as a reusable application service layer, not as UI-only functionality.

Do not implement AI commands in this phase.

Do not implement cloud synchronization.

Do not implement collaboration.

Do not redesign OmniLife's complete UX.

Keep OmniLife:

```text
Local-first
Offline-capable
Modular
Searchable
Cross-connected
Personal
Extensible
```

Phase 25 will later simplify how all these capabilities are presented to the user without removing functionality.
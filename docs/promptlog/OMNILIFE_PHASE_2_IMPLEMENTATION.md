# OmniLife — Phase 2 Implementation Specification

**Project:** OmniLife  
**Phase:** 2 — Productivity & Life Organization  
**Status:** Ready for Implementation  
**Implementation Agent:** Antigravity  
**Scope:** Phase 2 only

---

# 1. PURPOSE

Phase 1 established the core daily-management layer of OmniLife:

```text
Calendar
Schedule
Tasks
Notes
Recurring Routines
Reminders
Today / Daily Planner
```

Phase 2 builds the next layer:

```text
Projects
Goals
Knowledge Base
Cross-Module Search
Life Timeline
```

The purpose of Phase 2 is to transform OmniLife from a daily planner into a system that can organize **larger personal objectives, ongoing work, knowledge, and historical life information**.

The central relationship should become:

```text
Goal
  ↓
Project
  ↓
Tasks
  ↓
Calendar / Schedule
  ↓
Timeline
```

while:

```text
Notes
  ↓
Knowledge Base
  ↓
Search
```

provides the information layer around those activities.

---

# 2. IMPORTANT IMPLEMENTATION RULE

This document defines the implementation scope for **Phase 2 only**.

Do NOT implement future phases.

Do NOT implement:

```text
College / Courses / Assignments / Exams
Finance / Budget / Income / Expenses
Subscriptions
Wishlist
Personal Inventory
Important Documents
Secure Vault / Password Manager
AI Assistant
Cloud Sync
Cross-device Sync
Multi-user
Public Platform
```

These are future phases.

Phase 2 may prepare architecture for them where appropriate, but must not implement them as functional features.

---

# 3. SOURCE OF TRUTH

Before implementation:

1. Inspect the existing OmniLife project.
2. Read the existing architecture documentation.
3. Read the Phase 1 implementation report.
4. Inspect the actual Phase 1 implementation.
5. Understand the current data model and persistence layer.
6. Preserve existing working functionality.

Do not assume Phase 1 was implemented exactly as originally planned.

**The actual current OmniLife codebase is the source of truth for integration.**

Do not rewrite working Phase 1 systems unnecessarily.

---

# 4. PHASE 2 PRODUCT GOAL

At the end of Phase 2, OmniLife should be able to answer two different categories of questions:

### Daily management

```text
What do I need to do today?
```

### Life organization

```text
What am I working toward?
What projects am I working on?
Where are my notes and knowledge?
What happened in my life previously?
Can I quickly find something?
```

The resulting structure should resemble:

```text
                         OMNILIFE
                            │
                 PRODUCTIVITY SYSTEM
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
      GOALS              PROJECTS           KNOWLEDGE
        │                   │                   │
        │                Tasks              Notes
        │                Schedule           Knowledge
        │                Calendar            References
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                       LIFE TIMELINE
                            │
                            ▼
                     GLOBAL SEARCH
```

---

# 5. FEATURE 1 — PROJECTS

Implement a Project management system.

A Project represents a larger piece of work that can contain multiple tasks, notes, schedules, and future relationships.

Examples:

```text
OmniLife
OmniTenant
Roblox Game
Personal Website
Learning Flutter
```

---

# 6. PROJECT PROPERTIES

A Project should support at minimum:

```text
Title
Description
Status
Priority
Created Date
Start Date
Optional Target Date
Completion Date
```

Recommended statuses:

```text
Planning
Active
Paused
Completed
Archived
```

Do not make status values difficult to extend in the future.

---

# 7. PROJECT ORGANIZATION

Projects should provide a clear overview.

Example:

```text
OMNILIFE

Status:
Active

Progress:
██████░░░░ 60%

Tasks:
8 / 12 completed

Upcoming:
Finish Phase 2

Notes:
Architecture
Roadmap
Ideas
```

The exact UI can follow the existing OmniLife design system.

---

# 8. PROJECT-TASK RELATIONSHIP

Tasks created in Phase 1 should be attachable to a Project.

Example:

```text
Project
   │
   ├── Task
   ├── Task
   ├── Task
   └── Task
```

A Task should not be duplicated simply because it belongs to a Project.

There must remain one canonical Task record.

The Project should reference / associate with it.

---

# 9. PROJECT PROGRESS

Project progress should be derived from task completion where possible.

Example:

```text
Project:
OmniLife

Tasks:
10 total
6 completed

Progress:
60%
```

Do not require users to manually update a percentage if it can be calculated from actual task state.

The system should avoid inconsistent states such as:

```text
Project says 90%
Tasks indicate 20%
```

unless a deliberate manual-progress feature is later introduced.

---

# 10. PROJECT-NOTE RELATIONSHIP

A Note should optionally be associated with a Project.

Example:

```text
Project:
OmniLife

Notes:
Architecture
Ideas
Development Log
Phase Review
```

Do not create a second note system.

Reuse the Phase 1 Note entity and extend its relationships.

---

# 11. PROJECT-CALENDAR RELATIONSHIP

Projects should be able to surface relevant:

```text
Tasks
Schedules
Deadlines
```

inside the Project overview.

Do not duplicate calendar records.

The Project should reference existing records.

---

# 12. PROJECT DETAIL VIEW

A Project detail page should provide at least:

```text
Overview
Tasks
Schedule / relevant dates
Notes
Progress
```

Recommended conceptual layout:

```text
PROJECT
────────────────────────

OmniLife

Active
60%

Overview

Tasks
☑ Architecture
☑ Phase 1
☐ Phase 2
☐ Testing

Notes
• Architecture
• Ideas

Upcoming
• Phase 2 review
```

---

# 13. FEATURE 2 — GOALS

Implement a Goals system.

A Goal represents a meaningful outcome the user wants to achieve.

Examples:

```text
Learn Flutter
Build my first public app
Improve programming skills
Maintain consistent workout routine
Complete college preparation
```

A Goal is NOT simply a Task.

A Goal represents a larger desired outcome.

---

# 14. GOAL PROPERTIES

At minimum:

```text
Title
Description
Status
Priority
Created Date
Optional Target Date
Completion Date
```

Suggested statuses:

```text
Not Started
Active
Paused
Completed
Archived
```

---

# 15. GOAL → PROJECT RELATIONSHIP

Goals should be able to contain or associate with Projects.

Example:

```text
Goal
"Become better at app development"
       │
       ├── Project: OmniLife
       ├── Project: OmniTenant
       └── Project: Practice App
```

A Goal should not need to contain every Task directly if Tasks already belong to Projects.

Prefer:

```text
Goal
 ↓
Project
 ↓
Task
```

This provides cleaner hierarchy.

---

# 16. GOAL PROGRESS

Where practical, calculate progress from associated Projects.

Example:

```text
Goal:
Learn Flutter

Projects:
Flutter Fundamentals       100%
Build Practice App          70%
Build OmniLife              50%

Overall:
███████░░░ 73%
```

The exact calculation may be simplified during Phase 2 if a robust weighted system would create unnecessary complexity.

Do not build advanced analytics yet.

---

# 17. GOAL DETAIL VIEW

A Goal detail view should show:

```text
Goal title
Description
Status
Target date
Progress
Related projects
Related notes
```

Example:

```text
LEARN FLUTTER

Progress
███████░░░ 70%

Projects
☑ Flutter Fundamentals
◐ Build Practice App
◯ Advanced Flutter

Notes
• Flutter Notes
• Architecture Notes
```

---

# 18. FEATURE 3 — KNOWLEDGE BASE

Implement the foundation of a Knowledge Base.

The purpose is to distinguish:

```text
Temporary / everyday Notes
```

from:

```text
Long-term knowledge
```

For example:

### Notes

```text
"Remember to check this tomorrow."
```

### Knowledge

```text
Flutter
 ├── Widgets
 ├── State Management
 ├── Navigation
 └── Persistence
```

---

# 19. KNOWLEDGE BASE STRUCTURE

Knowledge should support organization through categories or collections.

Example:

```text
Knowledge

Programming
├── Flutter
├── Dart
├── C#
└── Git

Roblox
├── Luau
├── Studio
└── Game Design

Personal
├── Workflows
└── Useful Information
```

The exact hierarchy should follow the current data architecture and should not create unnecessary complexity.

---

# 20. KNOWLEDGE ENTRY

A Knowledge Entry should support at minimum:

```text
Title
Content
Created Date
Updated Date
Category / Collection
```

Optional future-ready relationships:

```text
Project
Goal
Course
Tag
```

Do not implement College relationships yet.

---

# 21. KNOWLEDGE VS NOTES

Do not duplicate the entire Notes feature.

If the existing architecture permits it, prefer a shared content model or a clean relationship between Notes and Knowledge Entries.

The important product distinction is:

```text
Note
=
Something I write down.

Knowledge
=
Something I want to retain and organize.
```

The technical implementation may use the existing Note infrastructure where appropriate.

---

# 22. KNOWLEDGE SEARCH

Knowledge entries must be searchable.

Search should support:

```text
Title
Content
Category
```

Search should be reasonably tolerant of normal user input.

---

# 23. FEATURE 4 — CROSS-MODULE SEARCH

Phase 2 introduces the first version of OmniLife global search.

The goal:

> Find information without needing to know which module contains it.

For example:

```text
Search:
Flutter
```

could return:

```text
Tasks
• Learn Flutter state management

Notes
• Flutter setup notes

Projects
• OmniLife

Knowledge
• Flutter Widgets
```

---

# 24. SEARCHABLE ENTITIES

At minimum, global search should cover:

```text
Tasks
Schedules
Notes
Projects
Goals
Knowledge Entries
```

Do not implement search for future modules that do not yet exist.

---

# 25. SEARCH RESULT DESIGN

Search results should clearly identify the source.

Example:

```text
Search: Flutter

TASK
Learn Flutter state management

NOTE
Flutter setup

PROJECT
OmniLife

KNOWLEDGE
Flutter Widgets
```

The user should be able to open the result directly.

---

# 26. SEARCH UX

Global search should be accessible from the main OmniLife shell.

Recommended:

```text
Keyboard shortcut
Search button
Search field
```

If the existing architecture supports a command palette, it may be used.

Do not make search visually overwhelming.

---

# 27. SEARCH PERFORMANCE

Do not scan every database record inefficiently on every keystroke if the persistence architecture provides a better query mechanism.

Use the existing persistence technology appropriately.

However, do not prematurely build a complex search engine.

Phase 2 needs a reliable personal-data search, not enterprise-scale search infrastructure.

---

# 28. FEATURE 5 — LIFE TIMELINE

Implement the first version of the OmniLife Life Timeline.

This is one of the most important long-term concepts in OmniLife.

The purpose is to answer:

> "What happened in my life around this time?"

---

# 29. TIMELINE PRINCIPLE

The Timeline should be a **derived view of existing data**.

Do NOT create duplicate copies of:

```text
Tasks
Notes
Schedules
Projects
Goals
```

Instead, Timeline entries should reference existing records.

Conceptually:

```text
Task
   ↓
Timeline representation

Note
   ↓
Timeline representation

Schedule
   ↓
Timeline representation
```

---

# 30. TIMELINE SOURCES

Phase 2 Timeline should include relevant events from:

```text
Calendar / Schedule
Tasks
Notes
Project activity where available
Goal activity where available
```

Do not implement Finance, College, Vault, or other future module timeline sources yet.

---

# 31. TIMELINE VIEW

Provide chronological navigation.

Example:

```text
AUGUST 2026

07 AUG
────────────
📅 Schedule
Study Flutter

📝 Note
Started working on OmniLife Phase 2

☑ Task
Completed Phase 1

08 AUG
────────────
📅 Schedule
...
```

The exact visual design can evolve, but chronology must remain clear.

---

# 32. TIMELINE FILTERING

Provide basic filtering by source.

Example:

```text
All
Tasks
Schedule
Notes
Projects
Goals
```

The filter system should be extensible for future modules.

---

# 33. TIMELINE NAVIGATION

Users should be able to:

```text
View recent history
Navigate by date
Navigate by month
Navigate by year
Open source item
```

Selecting a Timeline item should open the original entity.

Example:

```text
Timeline
 ↓
Task
 ↓
Task Detail
```

not a duplicate task page.

---

# 34. TIMELINE AND CALENDAR

Calendar and Timeline are related but different.

### Calendar

Answers:

> What is happening on this date?

### Timeline

Answers:

> What has happened over time?

Do not merge them into one confusing UI.

---

# 35. CROSS-MODULE RELATIONSHIP MODEL

Phase 2 should establish this conceptual structure:

```text
                         GOAL
                           │
                           ▼
                        PROJECT
                           │
                           ▼
                          TASK
                           │
                  ┌────────┼────────┐
                  ▼        ▼        ▼
              Calendar   Reminder  Timeline


                         PROJECT
                            │
                            ▼
                           NOTE
                            │
                            ▼
                       KNOWLEDGE
                            │
                            ▼
                          SEARCH
```

This is conceptual.

Follow the actual architecture when implementing relationships.

---

# 36. TODAY PAGE INTEGRATION

Do not rebuild the Today page.

Extend it where useful.

For example, Today may now identify:

```text
Task
   ↓
Project
```

or:

```text
Task
   ↓
Project
   ↓
Goal
```

Example:

```text
TODAY

Tasks

☐ Finish Flutter documentation
   Project: OmniLife
   Goal: Learn Flutter
```

This gives context without cluttering the interface.

---

# 37. PROJECT / GOAL TASK CREATION

When creating a task from inside a Project:

```text
Create Task
```

the Project relationship should automatically be populated.

Likewise, when creating a Project from a Goal:

```text
Create Project
```

the Goal relationship should be automatically populated where appropriate.

Avoid unnecessary repeated selection.

---

# 38. NAVIGATION

The main navigation should evolve to support Phase 2.

Potential conceptual navigation:

```text
Today
Calendar
Tasks
Routines
Notes

────────────

Projects
Goals
Knowledge

────────────

Timeline

────────────

Search
Settings
```

Use the existing OmniLife navigation architecture if already established.

Do not blindly replace the existing UI.

---

# 39. DASHBOARD / HOME INTEGRATION

If the current Today page already functions as the Home screen, preserve it.

Phase 2 may add subtle context such as:

```text
Active Projects
Current Goals
```

but the Today page must remain focused on daily life.

Do not turn it into an analytics dashboard.

---

# 40. DATA PERSISTENCE

All Phase 2 data must persist across application restarts.

Required:

```text
Projects
Goals
Knowledge
Relationships
Timeline-relevant data
```

must remain available after restarting OmniLife.

Use the existing Phase 1 persistence architecture.

Do not introduce cloud synchronization.

---

# 41. HISTORICAL INTEGRITY

Do not destroy historical data when:

```text
Completing a Project
Completing a Goal
Archiving a Project
Archiving a Goal
Deleting a relationship
```

Historical records should remain meaningful.

Be particularly careful with Timeline references.

---

# 42. DELETE BEHAVIOR

Relationships must be handled intentionally.

Example:

Deleting a Project must not automatically delete all its Tasks unless the user explicitly chooses such behavior and the architecture supports it.

Prefer safe behavior:

```text
Delete Project
        ↓
Tasks remain
        ↓
Project relationship removed
```

Similarly:

```text
Delete Goal
        ↓
Projects remain
        ↓
Goal relationship removed
```

Do not cascade-delete important personal information by default.

---

# 43. ARCHIVE BEHAVIOR

Projects and Goals should support archival.

Archived records should:

```text
Remain stored
Remain searchable where appropriate
Not clutter active lists
Remain accessible
```

This is especially important because OmniLife is intended to preserve personal history.

---

# 44. UI / UX REQUIREMENTS

Continue the OmniLife visual language from Phase 1.

The interface should remain:

```text
Modern
Clean
Calm
Professional
Personal
Minimal
Not overly "AI-looking"
```

Do not introduce a completely different design system.

Projects and Goals should feel like parts of OmniLife, not separate applications.

---

# 45. EMPTY STATES

Provide useful empty states.

Examples:

```text
Projects
"No active projects yet."

Goals
"What are you working toward?"

Knowledge
"Start building your personal knowledge base."

Timeline
"Your timeline will appear as you use OmniLife."
```

---

# 46. SEARCH EMPTY STATES

Examples:

```text
No results found.

Try another keyword.
```

Do not show misleading results.

---

# 47. RESPONSIVE BEHAVIOR

Preserve Phase 1 responsive behavior.

Phase 2 screens must remain usable on the currently supported target platforms.

Do not create separate implementations for each platform unless the architecture requires it.

---

# 48. ACCESSIBILITY

Maintain the Phase 1 accessibility standards:

```text
Readable text
Adequate contrast
Clear focus states
Touch-friendly controls
Meaningful labels
Icons are not the only source of meaning
```

---

# 49. PERFORMANCE

Phase 2 should remain responsive when the user has:

```text
Many tasks
Many notes
Many projects
Many knowledge entries
Many timeline records
```

Use appropriate filtering and pagination/lazy loading where necessary.

Do not over-engineer.

---

# 50. TESTING REQUIREMENTS

Add meaningful tests for:

```text
Project creation/edit/completion
Project-task relationship
Project-note relationship
Project progress calculation

Goal creation/edit/completion
Goal-project relationship
Goal progress calculation

Knowledge creation/edit/search

Global search
Search across multiple entity types

Timeline generation
Timeline chronological ordering
Timeline filtering
Timeline source navigation

Data persistence
Delete behavior
Archive behavior
```

---

# 51. RELATIONSHIP TESTS

Verify:

```text
Project → Task
Project → Note
Goal → Project
Timeline → Source Entity
Search → Source Entity
```

and ensure relationships do not create duplicate records.

---

# 52. PHASE 1 REGRESSION TESTING

Phase 2 must not break Phase 1.

Re-test:

```text
Calendar
Schedule
Tasks
Notes
Recurring Routines
Reminders
Today
```

Particularly verify:

```text
Task completion
Task date association
Routine recurrence
Routine history
Reminder behavior
Today aggregation
Historical dates
Persistence
```

---

# 53. IMPLEMENTATION ORDER

Do not implement everything in one uncontrolled generation.

Recommended sequence:

```text
Batch 1
Inspect Phase 1 + integrate architecture

Batch 2
Projects

Batch 3
Goals

Batch 4
Project / Goal relationships

Batch 5
Knowledge Base

Batch 6
Global Search

Batch 7
Life Timeline

Batch 8
Today / Navigation integration

Batch 9
Testing + Regression + Polish
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

# 54. SCOPE CONTROL

If a useful feature is discovered that belongs to a future phase:

DO NOT implement it.

Record it in the existing backlog system or:

```text
PHASE_2_DEFERRED_FEATURES.md
```

Examples:

```text
Finance integration
College integration
AI-generated insights
Cloud synchronization
Advanced analytics
```

---

# 55. ARCHITECTURAL ISSUES

If Phase 2 reveals architectural limitations from Phase 1:

Do not silently rewrite the project.

Document:

```text
Problem
Current behavior
Root cause
Possible solutions
Recommended solution
Affected features
Migration impact
```

If the change is substantial, stop at the appropriate boundary for human review.

---

# 56. VALIDATION

Before declaring Phase 2 complete, verify:

```text
[ ] Projects work
[ ] Project CRUD works
[ ] Project status works
[ ] Project progress works
[ ] Project-task relationship works
[ ] Project-note relationship works

[ ] Goals work
[ ] Goal CRUD works
[ ] Goal status works
[ ] Goal progress works
[ ] Goal-project relationship works

[ ] Knowledge Base works
[ ] Knowledge entries persist
[ ] Knowledge search works

[ ] Global Search works
[ ] Search covers Tasks
[ ] Search covers Schedules
[ ] Search covers Notes
[ ] Search covers Projects
[ ] Search covers Goals
[ ] Search covers Knowledge

[ ] Life Timeline works
[ ] Timeline is chronological
[ ] Timeline filtering works
[ ] Timeline items open source records

[ ] Today integration works
[ ] Navigation works

[ ] Phase 1 regression tests pass
[ ] Data persists after restart
[ ] Delete behavior is safe
[ ] Archive behavior works
[ ] Responsive layout works
[ ] Static analysis passes
[ ] Tests pass
```

---

# 57. FINAL QUALITY CHECK

For Flutter projects, run the appropriate project validation commands, including where applicable:

```bash
flutter analyze
flutter test
```

Also validate the relevant configured build targets.

Do not suppress analyzer warnings or errors merely to obtain a passing result.

---

# 58. IMPLEMENTATION REPORT

After completing Phase 2, create or update:

```text
PHASE_2_IMPLEMENTATION_REPORT.md
```

Include:

```text
1. Implementation Summary

2. Features Implemented

3. Files / Modules Changed

4. Data Model Changes

5. Relationships Added

6. UI Changes

7. Search Implementation

8. Timeline Implementation

9. Tests Added

10. Regression Test Results

11. Validation Results

12. Known Issues

13. Deferred Features

14. Architectural Concerns

15. Recommended Next Phase
```

---

# 59. STOP CONDITION

When Phase 2 is complete:

**STOP.**

Do NOT automatically begin Phase 3.

Do NOT implement:

```text
College
Courses
Assignments
Exams
Finance
Subscriptions
Wishlist
Inventory
Vault
AI
Sync
```

Wait for human review.

The human will manually test OmniLife and determine whether Phase 2 is accepted.

---

# 60. PHASE 2 SUCCESS CRITERIA

Phase 2 is successful when OmniLife has evolved from a daily planner into a broader personal productivity system.

The user should be able to:

```text
Create a Goal
      ↓
Create a Project
      ↓
Create Tasks
      ↓
Schedule work
      ↓
Attach Notes
      ↓
Track Project progress
      ↓
Search the information
      ↓
See relevant activity in the Timeline
```

And separately:

```text
Create Knowledge
      ↓
Organize Knowledge
      ↓
Search Knowledge
      ↓
Find it from Global Search
```

The result should feel like one connected application rather than several disconnected modules.

---

# 61. FINAL INSTRUCTION TO ANTIGRAVITY

Start by inspecting the current OmniLife workspace.

Read:

```text
Existing Architecture Documentation
Phase 1 Implementation Report
Current Source Code
Current Data Models
Current Persistence Layer
Current Design System
```

Then implement **ONLY OmniLife Phase 2** according to this specification.

Do not assume the project is empty.

Do not overwrite working Phase 1 functionality blindly.

Do not implement future phases.

Do not introduce unrelated dependencies.

Do not silently change architecture.

Implement incrementally.

Test after each meaningful batch.

At the end, produce the Phase 2 implementation report.

Then STOP and wait for human review.
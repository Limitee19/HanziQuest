# OMNILIFE — PHASE 12 IMPLEMENTATION PROMPT
## Calendar & Scheduling 2.0

**Project:** OmniLife  
**Phase:** 12  
**Previous Phase:** Phase 11 — Global Search & Cross-Module Navigation  
**Status:** Implementation Phase

---

# 1. ROLE

You are the implementation agent for OmniLife.

Phase 12 focuses on:

> **Calendar & Scheduling 2.0**

The objective is to evolve OmniLife's calendar from a basic date/event interface into a reliable personal scheduling system.

The calendar should become the primary representation of the user's time.

It should work naturally with:

```text
Calendar
Tasks
Reminders
Projects
Goals
Routines
College / Academic
Global Search
Cross-Module Relationships
```

Only integrate modules that actually exist in the current codebase.

---

# 2. IMPORTANT CONSTRAINT

Before implementing:

1. Inspect the current calendar implementation.
2. Inspect existing event models.
3. Inspect existing reminder models.
4. Inspect task/deadline models.
5. Inspect routine models.
6. Inspect project/goal relationships.
7. Inspect the Phase 11 search architecture.
8. Inspect the current database/storage implementation.
9. Inspect current routing/navigation.
10. Inspect current design-system components.

Do not rewrite working systems unnecessarily.

Do not assume a feature exists merely because it appears in the long-term roadmap.

---

# 3. PHASE 12 OBJECTIVE

The target is:

```text
                 OMNILIFE CALENDAR
                        │
        ┌───────────────┼────────────────┐
        │               │                │
       DATE           TIME            EVENTS
        │               │                │
        ▼               ▼                ▼
     Day/Week/       Time Blocks       Events
     Month View                       Tasks
                                      Reminders
                                      Routines
                                      Deadlines
        │                                │
        └────────────────┬───────────────┘
                         │
                         ▼
                Cross-Module Context
```

The calendar should answer:

> "What is happening in my life on this date/time?"

---

# 4. CORE CALENDAR ENTITY

If the existing architecture does not already provide a suitable event model, create or adapt one.

Conceptual structure:

```text
CalendarEvent

id
title
description
startDateTime
endDateTime
isAllDay
location
notes
color / category
recurrenceRule
reminderReferences
relatedEntityReferences
createdAt
updatedAt
```

Use the actual project's conventions.

Do not blindly copy this model if the current architecture already has an equivalent.

---

# 5. DATE RANGE

OmniLife must support calendar data from:

```text
Application start / earliest supported date
        ↓
Past
        ↓
Today
        ↓
Future
```

Do not hardcode a short calendar range such as:

```text
Current year only
```

The calendar should not become unusable when the year changes.

---

# 6. HISTORICAL DATA

Previously created events must remain accessible.

The user should be able to navigate to past dates and inspect historical scheduling information.

Do not automatically delete old calendar events merely because they are in the past.

---

# 7. CALENDAR VIEWS

Implement or improve these views where supported by the existing architecture:

```text
Month
Week
Day
```

Optional:

```text
Agenda / List
```

If the project already has a view system, extend it instead of replacing it.

---

# 8. MONTH VIEW

Month view should provide a high-level overview.

Conceptually:

```text
┌───────────────────────────────────────┐
│ August 2026                           │
│                                       │
│ Mon Tue Wed Thu Fri Sat Sun           │
│                                       │
│  3   4   5   6   7   8   9            │
│  •   •       •   •                    │
│                                       │
│ 10  11  12  13  14  15  16            │
│      •   •   •                         │
└───────────────────────────────────────┘
```

Do not overfill cells.

Indicators should communicate that information exists without displaying every detail.

---

# 9. DATE INDICATORS

Different states should be visually distinguishable.

At minimum:

```text
Today
Selected date
Date with events
Date with tasks/deadlines
Date with reminders
Date with no scheduled information
```

Use the existing design system.

Do not rely solely on color.

---

# 10. DATE DETAIL

Clicking/tapping a date should provide access to the information for that date.

Example:

```text
Friday, August 14

09:00
Mathematics Class

11:00
Project Meeting

15:00
Complete Assignment

20:00
Workout
```

The user must be able to inspect and interact with the day's items.

---

# 11. DAY VIEW

Day view should emphasize time.

Example:

```text
08:00
│
├── Mathematics Class
│
09:00
│
10:00
│
├── Project Meeting
│
11:00
│
...
```

Events should occupy their appropriate time range.

---

# 12. WEEK VIEW

Week view should provide a scheduling overview.

Example:

```text
        Mon   Tue   Wed   Thu   Fri
08:00
09:00
10:00
11:00
12:00
...
```

The implementation should remain usable on desktop and mobile.

Do not simply shrink desktop week view onto a narrow phone screen.

---

# 13. AGENDA VIEW

If practical, provide an agenda/list representation.

Example:

```text
Today

09:00  Mathematics
11:00  Project meeting
15:00  Assignment
```

This is particularly useful on mobile.

If an existing agenda view already exists, improve it instead of duplicating it.

---

# 14. TODAY ACTION

Provide a reliable way to jump to the current date.

Expected:

```text
Today
```

should immediately navigate the calendar to today's date.

---

# 15. DATE NAVIGATION

Support:

```text
Previous
Next
Today
Date picker
```

The user must be able to navigate across months/years without arbitrary limitations.

---

# 16. EVENT CREATION

Users must be able to create a calendar event.

Minimum fields:

```text
Title
Start
End
All-day
Description / Notes
Location
Reminder
```

Optional fields may include:

```text
Category
Color
Related entities
```

Do not make every field mandatory.

---

# 17. EVENT EDITING

Users must be able to edit existing events.

Changing:

```text
Title
Time
Date
Duration
Notes
Location
Reminder
Recurrence
```

must persist correctly.

---

# 18. EVENT DELETION

Users must be able to delete events.

For recurring events, provide appropriate options:

```text
Delete this occurrence
Delete this and following occurrences
Delete entire series
```

Only expose these options when applicable.

---

# 19. ALL-DAY EVENTS

Support events without a specific time.

Example:

```text
Birthday
Holiday
College registration
Deadline
Travel day
```

All-day events should appear separately from timed events where appropriate.

---

# 20. EVENT DURATION

Support:

```text
15 minutes
30 minutes
45 minutes
1 hour
2 hours
Multiple hours
Multiple days
```

Do not restrict events to fixed durations.

---

# 21. OVERNIGHT EVENTS

Support events crossing midnight.

Example:

```text
22:00
        ↓
01:00 next day
```

The event must correctly appear across the affected dates/views.

---

# 22. MULTI-DAY EVENTS

Support events spanning multiple days.

Example:

```text
August 10
    ↓
August 14
```

Do not create unrelated duplicate events unless the architecture requires a presentation-level representation.

---

# 23. EVENT CONFLICT DETECTION

Detect overlapping scheduled events.

Example:

```text
09:00–10:00
Mathematics

09:30–11:00
Project Meeting
```

Show a non-blocking warning such as:

```text
Schedule conflict detected.
```

Do not automatically prevent the user from saving the event.

The user remains in control.

---

# 24. CONFLICT DETAILS

If practical, show:

```text
Conflict with:
Mathematics
09:00–10:00
```

Do not make conflict detection overly complex.

---

# 25. RECURRING EVENTS

Implement recurring event support.

At minimum:

```text
Every day
Every week
Every month
Every year
Custom recurrence
```

Where possible, support:

```text
Specific weekdays
Interval
End date
Number of occurrences
```

---

# 26. WEEKLY RECURRENCE

Example:

```text
Every Monday
Every Monday and Wednesday
Every weekday
```

The recurrence engine must correctly calculate future occurrences.

---

# 27. MONTHLY RECURRENCE

Support examples such as:

```text
Every 1st day of the month
Every 15th day
```

If practical, also support:

```text
First Monday of every month
Last Friday of every month
```

Use a robust recurrence implementation rather than custom ad-hoc date calculations.

---

# 28. YEARLY RECURRENCE

Example:

```text
Birthday
Every year on August 20
```

Handle leap-year edge cases safely.

---

# 29. RECURRENCE RULE

Do not create thousands of future database rows just to represent a recurring event.

Prefer storing:

```text
Base event
+
Recurrence rule
+
Exceptions
```

and generate occurrences when needed.

If the existing architecture uses another proven strategy, preserve it if reliable.

---

# 30. RECURRENCE EXCEPTIONS

A recurring series must allow an individual occurrence to differ.

Example:

```text
Every Monday 08:00
```

but one Monday:

```text
08:00 → 10:00
```

The user should be able to modify that occurrence without unexpectedly changing the entire series.

---

# 31. REMINDERS

Calendar events should integrate with the existing reminder infrastructure.

Possible reminder times:

```text
At time of event
5 minutes before
10 minutes before
15 minutes before
30 minutes before
1 hour before
1 day before
Custom
```

Only implement options compatible with the existing notification system.

---

# 32. DO NOT DUPLICATE REMINDER SYSTEMS

If OmniLife already has a reminder service:

```text
Calendar
   ↓
Existing Reminder Service
```

Do not create:

```text
Calendar Reminder System
+
Global Reminder System
```

with duplicated logic.

There must be one coherent reminder architecture.

---

# 33. TASK INTEGRATION

If Tasks already exist, calendar should be able to display task deadlines or scheduled tasks.

Example:

```text
Friday

09:00 Mathematics Class

15:00
Task:
Complete Chapter 3
```

Do not duplicate the Task record as a second independent calendar record unless necessary.

---

# 34. TASK SCHEDULE VS DEADLINE

Keep these concepts distinct.

A task may have:

```text
Due date
```

without having:

```text
Scheduled start time
```

Example:

```text
Task:
Study Mathematics

Due:
Friday
```

This should not automatically imply a 14:00 calendar event.

Only display it as a deadline/unscheduled task according to the existing UX.

---

# 35. SCHEDULED TASKS

If the task system supports scheduling:

```text
Task
Start: 14:00
End: 15:00
```

the calendar should display the task as a scheduled item.

The calendar should reference the actual Task entity.

---

# 36. PROJECT INTEGRATION

If Projects exist:

Calendar items may reference:

```text
Project
```

Example:

```text
Project:
College Semester 1

Calendar:
Project meeting
```

Clicking the project reference should use Phase 11 deep navigation.

---

# 37. GOAL INTEGRATION

If Goals exist, allow appropriate calendar items to reference a Goal.

Do not force every event to have a goal.

Example:

```text
Goal:
Exercise consistently

Calendar:
Workout — Monday 18:00
```

---

# 38. ROUTINE INTEGRATION

If Routines exist:

A routine occurrence may be displayed on the calendar.

Example:

```text
Monday

18:00
Workout Routine
Chest + Triceps
```

Do not duplicate routine data into independent permanent calendar events.

The calendar should represent the occurrence of the routine.

---

# 39. COLLEGE INTEGRATION

If the Academic module exists:

Calendar should eventually be able to display:

```text
Classes
Exams
Assignment deadlines
Academic events
```

Do not implement Academic functionality in this phase.

Only provide integration hooks for modules that already exist.

---

# 40. CATEGORY / COLOR

If the existing design system supports event categories/colors, use them carefully.

Possible conceptual categories:

```text
Personal
College
Work
Workout
Important
```

Do not create an excessive color palette.

Color should not be the only way to identify category.

---

# 41. USER CUSTOMIZATION

If the architecture allows it, users may customize an event category/color.

Do not allow arbitrary styling that breaks the design system.

Phase 25 will handle visual consistency.

---

# 42. EVENT NOTES

Events should support notes/details.

Example:

```text
Mathematics Class

Notes:
Bring calculator.
Review chapter 2 beforehand.
```

The note should remain associated with the event.

---

# 43. LOCATION

Support optional location.

Example:

```text
Campus Building A
Coffee Shop
Online
```

Do not require maps integration.

A plain text location is sufficient for this phase.

---

# 44. TIMEZONE FOUNDATION

Calendar timestamps must be stored and handled consistently.

Do not scatter timezone conversion logic throughout UI widgets.

Create/use a centralized date/time abstraction.

At minimum:

```text
Storage representation
Display representation
Timezone conversion
```

must have clear responsibilities.

---

# 45. LOCAL TIME

For a local-first personal application:

User-facing calendar times should use the user's configured local timezone.

Do not unexpectedly display UTC timestamps.

---

# 46. DATE/TIME LIBRARY

Use the date/time library already present in the project if it is reliable.

If a dependency is required, choose a mature Flutter-compatible solution.

Do not introduce multiple competing date/time libraries.

---

# 47. DATE VALIDATION

Handle invalid ranges.

For example:

```text
End:
09:00

Start:
10:00
```

must not silently create an invalid event.

Display a clear validation message.

---

# 48. PAST EVENTS

Past events remain visible.

Do not automatically hide them.

Historical calendar data is part of OmniLife's long-term personal timeline.

---

# 49. FUTURE EVENTS

Future dates must work without a fixed end date.

The calendar should not require yearly migrations.

---

# 50. SEARCH INTEGRATION

Phase 11 Global Search must be able to find calendar events.

Search example:

```text
Mathematics
```

may return:

```text
CALENDAR
Mathematics Exam
```

Search result should navigate directly to the event.

Use the existing Phase 11 SearchProvider architecture.

Do not create a separate calendar search UI that duplicates Global Search.

---

# 51. ENTITY REFERENCE

Calendar events should support Phase 11's entity-reference architecture.

Conceptually:

```text
CalendarEvent
    │
    ├── Task
    ├── Project
    ├── Goal
    ├── Routine
    └── Academic entity
```

Only create references when an actual relationship exists.

---

# 52. CROSS-MODULE NAVIGATION

Example:

```text
Calendar
   ↓
Scheduled Task
   ↓
Task Detail
```

or:

```text
Calendar
   ↓
Routine occurrence
   ↓
Routine Detail
```

or:

```text
Calendar
   ↓
Exam
   ↓
Academic Detail
```

Use the Phase 11 routing/deep-navigation architecture.

---

# 53. CALENDAR AS A CONTEXT SOURCE

Create a reusable service that can answer:

```text
What is scheduled today?
What is scheduled tomorrow?
What is scheduled this week?
What events overlap?
What deadlines are approaching?
```

This service will be useful to future:

```text
Dashboard
Analytics
AI Context
Notifications
Planning
```

Do not add new AI functionality in Phase 12.

---

# 54. DAILY CONTEXT

Provide a clean internal representation such as:

```text
DaySchedule

date
events
tasks
reminders
routineOccurrences
deadlines
```

Only include fields corresponding to implemented modules.

---

# 55. UPCOMING EVENTS

Provide a reusable query/service for:

```text
Next event
Next 5 events
Today's remaining events
Tomorrow
This week
```

This will later support dashboard widgets.

---

# 56. CALENDAR QUERY API

Create or adapt a service similar to:

```text
CalendarService

getEventsForDay(date)

getEventsForRange(start, end)

getUpcomingEvents(limit)

getEventsForMonth(year, month)

getEventsForWeek(date)

getConflicts(event)

createEvent(event)

updateEvent(event)

deleteEvent(event)

getOccurrences(range)
```

Use actual project naming conventions.

Do not duplicate repository logic across UI screens.

---

# 57. PERFORMANCE

Do not load all historical calendar events into memory.

Use range-based queries:

```text
Month view
    ↓
Only query relevant range

Week view
    ↓
Only query relevant range

Day view
    ↓
Only query relevant day
```

Recurring events should be evaluated efficiently.

---

# 58. CACHING

If the existing architecture supports caching, cache appropriate date ranges.

Do not create a complicated caching system solely for this phase.

Correctness is more important than premature optimization.

---

# 59. OFFLINE-FIRST

Calendar must work without internet.

Creating, editing, deleting, and viewing local calendar data should not require:

```text
Groq
AI
Cloud API
Internet
```

---

# 60. DATA PERSISTENCE

After:

```text
Create event
Close application
Reopen application
```

the event must still exist.

The same applies to:

```text
Edit
Delete
Recurrence
Reminder
Relationships
```

---

# 61. DATA MIGRATION

If modifying existing calendar schemas:

1. Create a migration.
2. Preserve existing events.
3. Do not silently drop data.
4. Test migration on realistic existing data.

Never destroy user calendar history during development.

---

# 62. MOBILE UX

Mobile calendar should prioritize:

```text
Date selection
Agenda
Upcoming events
Quick event creation
Event details
```

Touch targets must be usable.

Do not force the desktop calendar layout onto mobile.

---

# 63. DESKTOP UX

Desktop may provide:

```text
Month
Week
Day
Agenda
```

with keyboard/mouse interaction.

Preserve the existing desktop design language.

---

# 64. QUICK EVENT CREATION

Provide a convenient way to create an event from the calendar.

Example:

```text
Click date
        ↓
Create Event
        ↓
Date pre-filled
```

For a timed view:

```text
Click 15:00
        ↓
Create Event
        ↓
Start time = 15:00
```

This should reduce unnecessary input.

---

# 65. DRAG & DROP

If practical and stable on the current desktop architecture, support:

```text
Drag event
    ↓
Change date/time
```

Example:

```text
Monday 14:00
     ↓ drag
Tuesday 16:00
```

If drag-and-drop introduces substantial complexity or instability, do not make it mandatory for Phase 12.

Document it as a future enhancement.

---

# 66. RESIZE EVENT

If practical on desktop, allow resizing an event's duration.

Example:

```text
14:00–15:00
     ↓
14:00–16:00
```

Again, this is optional if it conflicts with the existing architecture.

---

# 67. DO NOT OVERENGINEER

Do not implement:

```text
❌ Google Calendar synchronization
❌ Outlook synchronization
❌ Cloud calendar accounts
❌ Calendar sharing
❌ Multi-user calendars
❌ Complex collaboration
❌ Video meeting integration
❌ Maps integration
❌ AI scheduling
```

Those are outside Phase 12.

OmniLife remains local-first.

---

# 68. SECURITY

Calendar information is personal information.

Follow existing local data security practices.

Do not send calendar information externally.

Do not log sensitive event contents unnecessarily.

---

# 69. TESTING

Create automated tests for:

### Basic Event

```text
create
read
update
delete
```

### Date

```text
day
week
month
year boundary
```

### Time

```text
start/end
duration
midnight
overnight
```

### Recurrence

```text
daily
weekly
monthly
yearly
custom
exceptions
```

### Integration

```text
task
reminder
routine
project
goal
academic
search
```

### Persistence

```text
restart app
data remains
```

### Security

```text
no external network required
```

---

# 70. ACCEPTANCE TEST 1 — CREATE EVENT

Create:

```text
Title:
Mathematics Class

Date:
Tomorrow

Start:
09:00

End:
10:00
```

Expected:

```text
Event appears at 09:00–10:00.
```

Close and reopen OmniLife.

Expected:

```text
Event remains.
```

---

# 71. ACCEPTANCE TEST 2 — EDIT EVENT

Change:

```text
09:00–10:00
```

to:

```text
10:00–11:30
```

Expected:

```text
Calendar reflects new time.
```

---

# 72. ACCEPTANCE TEST 3 — DELETE EVENT

Delete the event.

Expected:

```text
Event no longer appears.
```

---

# 73. ACCEPTANCE TEST 4 — ALL DAY

Create:

```text
Birthday
All day
```

Expected:

```text
Appears as an all-day event.
```

---

# 74. ACCEPTANCE TEST 5 — RECURRING

Create:

```text
Workout
Every Monday
18:00–19:00
```

Expected:

```text
Every Monday displays the occurrence.
```

Do not create unnecessary duplicate permanent event records.

---

# 75. ACCEPTANCE TEST 6 — RECURRENCE EXCEPTION

Modify one Monday:

```text
18:00 → 20:00
```

Expected:

```text
Only that occurrence changes.
Other Mondays remain 18:00.
```

---

# 76. ACCEPTANCE TEST 7 — CONFLICT

Create:

```text
Event A
09:00–10:00

Event B
09:30–11:00
```

Expected:

```text
Conflict warning appears.
```

The user can still save both.

---

# 77. ACCEPTANCE TEST 8 — SEARCH

Create:

```text
Mathematics Exam
```

Search from Global Search:

```text
Mathematics
```

Expected:

```text
Calendar result appears.
```

Click it.

Expected:

```text
Correct event/date/detail opens.
```

---

# 78. ACCEPTANCE TEST 9 — TASK

If Tasks are implemented:

Create:

```text
Task:
Finish Mathematics Assignment

Due:
Friday
```

Expected:

```text
Task/deadline is represented appropriately on Friday.
```

Do not create a duplicate unrelated task.

---

# 79. ACCEPTANCE TEST 10 — ROUTINE

If Routines exist:

Create/use:

```text
Monday
Workout
18:00
```

Expected:

```text
Routine occurrence can be represented on Monday's schedule.
```

Do not duplicate the routine as an independent permanent event unless explicitly intended by the architecture.

---

# 80. ACCEPTANCE TEST 11 — HISTORICAL DATE

Navigate to a previous month/year.

Expected:

```text
Calendar remains functional.
Historical events remain accessible.
```

---

# 81. ACCEPTANCE TEST 12 — FUTURE DATE

Navigate several years into the future.

Expected:

```text
Calendar remains functional.
No artificial year limitation.
```

---

# 82. ACCEPTANCE TEST 13 — OFFLINE

Disable network.

Create/edit/view calendar events.

Expected:

```text
All core calendar functionality continues working.
```

---

# 83. ACCEPTANCE TEST 14 — MOBILE

On Android:

```text
Open calendar
Navigate date
Open event
Create event
Edit event
Delete event
```

Expected:

```text
All core interactions remain usable.
```

---

# 84. ACCEPTANCE TEST 15 — DATA SAFETY

Before/after migration if schema changes:

```text
Existing events
Existing tasks
Existing reminders
```

must remain intact.

No silent data loss.

---

# 85. DOCUMENTATION

Update existing architecture documentation.

Create or update:

```text
docs/CALENDAR_ARCHITECTURE.md
```

Document:

```text
Calendar model
Date/time handling
Recurrence
Exceptions
Reminder integration
Task integration
Routine integration
Search integration
Entity relationships
Query services
Offline behavior
Migration strategy
```

Follow the project's existing documentation naming conventions if different.

---

# 86. PHASE 11 COMPATIBILITY

Do not break:

```text
Global Search
SearchProvider
SearchResult
EntityReference
RouteResolver
Cross-module relationships
```

Calendar events must be searchable through the Phase 11 infrastructure.

---

# 87. PHASE 25 COMPATIBILITY

Do not lock the UI into a structure that prevents future redesign.

The Phase 25 UX overhaul will eventually simplify OmniLife's information architecture.

Therefore:

```text
UI
 ↓
Calendar Feature Layer
 ↓
Calendar Service
 ↓
Repository
 ↓
Storage
```

Keep business logic separated from presentation.

---

# 88. ARCHITECTURE PRINCIPLE

Calendar should not become a giant UI-specific system.

Prefer:

```text
Calendar UI
      ↓
Calendar Controller / ViewModel
      ↓
Calendar Service
      ↓
Repository
      ↓
Database
```

Relationships:

```text
Calendar Service
      ↓
Task Service
Reminder Service
Routine Service
Project Service
Goal Service
```

only where required by existing architecture.

---

# 89. SUCCESS DEFINITION

Phase 12 is complete when:

```text
Calendar
   ↓
Can display historical and future dates
   ↓
Can create/edit/delete events
   ↓
Supports all-day and timed events
   ↓
Supports recurring schedules
   ↓
Handles recurrence exceptions
   ↓
Detects conflicts
   ↓
Integrates reminders
   ↓
Integrates existing tasks/routines/etc.
   ↓
Works with Global Search
   ↓
Supports deep navigation
   ↓
Works offline
   ↓
Persists data safely
   ↓
Works on desktop and mobile
```

The calendar should now function as:

> **OmniLife's central time-management layer.**

---

# 90. DO NOT MOVE TO PHASE 13 YET IF

Do not consider Phase 12 complete if any of the following occurs:

```text
❌ Existing events disappear
❌ Recurring events corrupt dates
❌ Editing one recurrence modifies all occurrences unintentionally
❌ Search stops finding calendar events
❌ Deep navigation breaks
❌ Calendar requires internet
❌ Mobile calendar crashes
❌ Historical dates cannot be accessed
❌ Database migration loses data
❌ Existing Phase 11 functionality breaks
```

Fix regressions before moving forward.

---

# 91. FINAL IMPLEMENTATION REPORT

When implementation is complete, provide:

```text
OMNILIFE PHASE 12 REPORT

Status:
COMPLETED / PARTIAL / BLOCKED

Existing calendar functionality inspected:
- ...

New calendar functionality:
- ...

Event model:
- ...

Recurring event system:
- ...

Recurrence exceptions:
- ...

Reminder integration:
- ...

Task integration:
- ...

Routine integration:
- ...

Project/Goal integration:
- ...

Search integration:
- ...

Deep navigation:
- ...

Conflict detection:
- ...

Desktop:
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
- Phase 13 — Tasks / To-Do / Projects
```

---

# FINAL PRINCIPLE

Do not think of the calendar as merely:

```text
Month grid
```

Think of it as:

```text
                    TIME
                     │
        ┌────────────┼────────────┐
        │            │            │
      EVENTS        TASKS      ROUTINES
        │            │            │
      REMINDERS    DEADLINES   RECURRING
        │            │            │
        └────────────┼────────────┘
                     │
                     ▼
                 SCHEDULE
                     │
                     ▼
                 OMNILIFE
```

The purpose of Phase 12 is to make OmniLife understand:

> **what the user has planned, when it happens, and what other parts of their life are connected to that time.**

Build the foundation carefully.

Do not add AI scheduling.

Do not add cloud synchronization.

Do not redesign the entire UI.

Do not remove existing functionality.

Do not create duplicate task/routine/reminder systems.

Keep OmniLife local-first, modular, searchable, and ready for future cross-module integration.
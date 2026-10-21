document id="48217" title="OmniLife Phase 17 — Personal Analytics & Insights System"
# OMNILIFE — PHASE 17
## Personal Analytics & Insights System

**Project:** OmniLife  
**Phase:** 17  
**Previous Phase:** Phase 16 — Goals & Personal Planning System  
**Status:** Implementation Phase

---

# 1. Objective

Implement the **Personal Analytics & Insights System** for OmniLife.

Phase 17 transforms existing OmniLife data into useful summaries and insights.

OmniLife should begin answering questions such as:

```text
What did I accomplish?

What am I currently working on?

How consistent am I?

Where am I spending my time?

Which goals are progressing?

Which tasks remain unfinished?

Which routines are consistent?

What areas of my life require attention?
```

The purpose is not to create a generic analytics dashboard.

The purpose is to help the user **understand their own life-management data and make better decisions**.

---

# 2. Core Principle

Analytics must be:

- Useful
- Simple
- Understandable
- Action-oriented
- Privacy-first
- Offline-first

Do not create analytics simply because data exists.

Every metric should answer a meaningful question.

---

# 3. Data Sources

Analytics should reuse existing OmniLife modules.

Potential sources:

```text
Calendar
Tasks
Projects
Routines
Goals
Milestones
Academic
Knowledge Base
Notes
Reminders
```

Do not duplicate the underlying data.

Analytics should query existing repositories/services.

---

# 4. Analytics Architecture

Preferred architecture:

```text
                    OmniLife Data
                         │
       ┌─────────────────┼─────────────────┐
       ▼                 ▼                 ▼
     Tasks            Routines           Goals
       │                 │                 │
       ├────────────┬────┴───────┬─────────┤
       ▼            ▼            ▼
                   Analytics Service
                         │
                         ▼
                 Analytics Repository
                         │
                         ▼
                  Analytics UI
```

Analytics must be a **read-oriented layer**.

It should not become the owner of Task, Goal, Routine, or Calendar data.

---

# 5. Analytics Categories

Implement these initial categories:

```text
Overview
Tasks
Goals
Routines
Projects
Calendar
Academic
```

Knowledge Base analytics can remain lightweight.

Do not create unnecessary analytics for every module.

---

# 6. Analytics Home

Create a dedicated:

```text
Analytics
```

screen.

Suggested structure:

```text
Analytics

[This Week ▼]

Overview
├── Tasks
├── Goals
├── Routines
├── Projects
└── Schedule
```

The interface should remain simple.

---

# 7. Time Range Selector

Support:

```text
Today
This Week
Last Week
This Month
Last Month
This Year
Custom
```

Default:

```text
This Week
```

Use existing date utilities if available.

---

# 8. Overview

The Overview should provide a compact snapshot.

Example:

```text
This Week

Tasks
18 completed
6 remaining

Goals
3 active
1 completed

Routines
82% consistency

Projects
4 active

Schedule
31 events
```

Do not overload the screen.

---

# 9. Task Analytics

Provide:

```text
Tasks Completed
Tasks Created
Tasks Remaining
Tasks Overdue
Completion Rate
```

Example:

```text
This Week

Completed      18
Created        21
Remaining       6
Overdue         2
Completion     86%
```

---

# 10. Task Completion Rate

Calculate:

```text
completionRate =
completedTasks /
eligibleTasks
```

Define the exact calculation clearly in the implementation.

Avoid misleading calculations.

Cancelled or deleted tasks should not distort historical statistics.

---

# 11. Task Trend

Show a simple trend over time.

Example:

```text
Tasks Completed

Mon  ███
Tue  █████
Wed  ██
Thu  ██████
Fri  ████
Sat  █
Sun  ███
```

Use a simple visual representation.

Do not create overly complicated charts.

---

# 12. Task Status Distribution

Optionally show:

```text
Completed
Pending
Overdue
Cancelled
```

Avoid displaying too many categories simultaneously.

---

# 13. Overdue Task Analysis

Show:

```text
Overdue Tasks
```

Example:

```text
2 overdue tasks
```

Provide navigation:

```text
View Tasks
```

Analytics should lead back to actionable data.

---

# 14. Goal Analytics

Use Phase 16 Goals.

Display:

```text
Active Goals
Completed Goals
Paused Goals
Overdue Goals
Average Progress
```

Example:

```text
Goals

Active       4
Completed    2
Paused       1
Overdue      1
```

---

# 15. Goal Progress

Display active goals with progress.

Example:

```text
Learn Flutter
███████░░░ 70%

Build OmniTenant
█████░░░░░ 50%

Improve Fitness
████████░░ 80%
```

Allow tapping a Goal to navigate to its detail page.

---

# 16. Goal Progress Trend

If historical progress data exists, display progress over time.

If historical progress is not currently stored:

**Do not fake historical progress.**

Instead, only display the current progress.

Prepare architecture for future progress history.

---

# 17. Goal Deadline Analysis

Show:

```text
On Track
Due Soon
Overdue
Completed
```

Example:

```text
Goal Attention

2 goals are due soon.
1 goal is overdue.
```

Provide navigation to Goals.

---

# 18. Routine Analytics

Analyze recurring routines.

Show:

```text
Routine Completion
Consistency
Missed Occurrences
Current Streak
Best Streak
```

Example:

```text
Workout

This Week
3 / 4 completed

Consistency
75%
```

---

# 19. Routine Consistency

Calculate:

```text
consistency =
completedOccurrences /
scheduledOccurrences
```

Do not count days where the routine was not scheduled.

---

# 20. Routine Streak

If the current Routine architecture supports occurrence history, calculate:

```text
Current Streak
Best Streak
```

Example:

```text
Workout

Current Streak
4 days

Best Streak
12 days
```

Do not fabricate streaks if historical occurrence data is unavailable.

---

# 21. Routine Insights

Show useful information such as:

```text
Most Consistent Routine
Least Consistent Routine
Most Missed Routine
```

Example:

```text
Most Consistent
Morning Study — 94%

Needs Attention
Workout — 62%
```

Avoid negative or judgmental language.

Prefer:

```text
Needs Attention
```

over:

```text
Failure
```

---

# 22. Project Analytics

Show:

```text
Active Projects
Completed Projects
Archived Projects
Tasks per Project
```

Example:

```text
Projects

Active          4
Completed       8
Archived        3
```

---

# 23. Project Workload

Show projects with their active workload.

Example:

```text
OmniTenant
12 active tasks

OmniLife
7 active tasks

College Preparation
4 active tasks
```

This helps the user understand where their workload is concentrated.

---

# 24. Project Stagnation

Identify projects with:

```text
Active
AND
No meaningful activity for X days
```

Suggested threshold:

```text
14 days
```

Example:

```text
Projects needing attention

OmniTenant
No activity for 17 days
```

Do not automatically classify projects as abandoned.

---

# 25. Calendar Analytics

Analyze scheduled events.

Show:

```text
Events
Busy Days
Free Days
Scheduled Hours
```

Example:

```text
This Week

31 events
18 scheduled hours
```

If event duration is unavailable, count events instead.

Do not estimate duration.

---

# 26. Schedule Density

Identify days with high scheduling density.

Example:

```text
Schedule Density

Monday     ███
Tuesday    █████
Wednesday  ██
Thursday   ██████
Friday     ████
Saturday   █
Sunday     ██
```

Use this to help the user recognize overloaded days.

---

# 27. Calendar Overload

If the system can reliably calculate scheduled duration:

Show:

```text
High Schedule Load
```

Example:

```text
Thursday
7h 30m scheduled
```

Do not label a day "overloaded" unless a reasonable threshold exists.

Use a configurable threshold if possible.

---

# 28. Academic Analytics

Use existing Academic data.

Potential metrics:

```text
Assignments
Completed
Pending
Overdue

Exams
Upcoming
Completed

Courses
Active
```

Example:

```text
Academic

Assignments
8 completed
3 pending

Upcoming Exams
2
```

---

# 29. Academic Workload

Show upcoming academic workload.

Example:

```text
Next 14 Days

3 Assignments
2 Exams
```

Provide navigation to Academic.

Do not duplicate Academic entities.

---

# 30. Weekly Review

Implement a useful:

```text
Weekly Review
```

screen.

Example:

```text
Weekly Review

You completed:
18 tasks

Routine consistency:
82%

Goals progressed:
3

Projects active:
4

Upcoming:
2 important deadlines
```

This should be one of the most useful features of Phase 17.

---

# 31. Weekly Review Insights

Generate simple deterministic insights.

Examples:

```text
You completed more tasks than last week.

Your workout routine was consistent this week.

You have 2 upcoming deadlines.

One project has had no activity for more than 14 days.
```

Do not use AI.

These are rule-based insights.

---

# 32. Insight Engine

Create a lightweight deterministic:

```text
InsightEngine
```

Conceptually:

```text
Analytics Data
      │
      ▼
Insight Rules
      │
      ▼
Generated Insights
```

Do not connect an LLM.

---

# 33. Insight Categories

Potential categories:

```text
POSITIVE
ATTENTION
INFORMATION
DEADLINE
PROGRESS
CONSISTENCY
```

Example:

```text
POSITIVE:
You completed 18 tasks this week.

ATTENTION:
2 tasks are overdue.

DEADLINE:
You have an exam in 5 days.

PROGRESS:
Your Flutter goal is currently 70%.
```

---

# 34. Insight Rules

Examples:

### Rule A — Overdue Tasks

If:

```text
overdueTasks > 0
```

Generate:

```text
You have X overdue tasks.
```

---

### Rule B — Upcoming Deadline

If:

```text
deadline <= 7 days
```

Generate:

```text
You have X upcoming deadlines.
```

---

### Rule C — Routine Consistency

If:

```text
consistency >= 80%
```

Generate a positive insight.

---

### Rule D — Project Inactivity

If:

```text
activeProject
AND
no activity >= 14 days
```

Generate an attention insight.

---

# 35. Insight Priority

Use:

```text
HIGH
MEDIUM
LOW
```

High priority should be reserved for genuinely important information.

Examples:

```text
HIGH:
Exam tomorrow

MEDIUM:
Project inactive for 14 days

LOW:
Completed 18 tasks this week
```

---

# 36. Insight Language

Do not make analytics judgmental.

Avoid:

```text
You failed.
You were lazy.
You performed badly.
```

Prefer:

```text
Needs Attention
You have several unfinished tasks.
Your routine consistency decreased this week.
```

Analytics should assist rather than criticize.

---

# 37. Comparison

Allow comparisons:

```text
This Week vs Last Week
This Month vs Last Month
```

Example:

```text
Tasks Completed

This Week: 18
Last Week: 14

+4
```

Only show comparisons when enough data exists.

---

# 38. No Fake Comparisons

If there is insufficient historical data:

Do not display:

```text
+100%
```

when there was no previous period.

Instead:

```text
Not enough historical data
```

---

# 39. Personal Records

Optional lightweight records:

```text
Most Tasks Completed in One Week
Longest Routine Streak
Most Productive Day
Most Active Project
```

Only implement metrics that are reliably supported.

---

# 40. Most Productive Day

Define "productive" transparently.

Recommended initial definition:

```text
productiveDay =
numberOfCompletedTasks
```

Do not claim:

```text
You were most productive because you worked 8 hours.
```

unless time tracking actually exists.

---

# 41. Privacy

Analytics are personal data.

All analytics must remain local.

Do not send analytics data anywhere.

Do not add telemetry.

Do not add analytics tracking for OmniLife itself.

---

# 42. Offline-First

Analytics must work offline.

No internet connection should be required for:

```text
Overview
Task Analytics
Goal Analytics
Routine Analytics
Project Analytics
Calendar Analytics
Academic Analytics
Weekly Review
Insights
```

---

# 43. Performance

Analytics must not block the main UI.

Avoid recalculating expensive metrics unnecessarily.

Prefer:

```text
Repository queries
Cached calculations
Memoization
Lazy loading
```

where appropriate.

Do not prematurely optimize without evidence.

---

# 44. Analytics Data Layer

Preferred structure:

```text
Analytics UI
     │
     ▼
Analytics Service
     │
     ├── Task Analytics
     ├── Goal Analytics
     ├── Routine Analytics
     ├── Project Analytics
     ├── Calendar Analytics
     └── Academic Analytics
```

Each module should be independently testable.

---

# 45. Analytics Models

Conceptually:

```text
AnalyticsSummary

period
taskStats
goalStats
routineStats
projectStats
calendarStats
academicStats
insights
```

Do not store every calculated metric permanently unless necessary.

Prefer calculating from source data.

---

# 46. Historical Analytics

If a metric requires historical information, use existing timestamps and occurrence history.

Do not modify historical records simply to make analytics easier.

Do not fabricate missing history.

---

# 47. Future Analytics Storage

Prepare for future:

```text
AnalyticsSnapshot
```

but do not implement it unless required.

Future versions may store periodic snapshots for:

```text
Goal Progress History
Routine Consistency History
Weekly Reviews
Long-Term Trends
```

---

# 48. Dashboard Integration

Add a compact Analytics entry to the main navigation.

Do not put every statistic on the Dashboard.

The Dashboard should remain a daily-use interface.

Analytics is the place for deeper review.

---

# 49. Today Integration

Today may show a small summary such as:

```text
Today's Progress

4 / 6 Tasks
2 Routines
1 Goal-related task
```

Keep this optional and compact.

Do not turn Today into Analytics.

---

# 50. Goal Integration

Goal Detail may show:

```text
Progress
Milestones
Related Tasks
Related Projects
```

Analytics may later show deeper historical statistics.

Do not duplicate the entire Analytics screen inside Goal Detail.

---

# 51. Routine Integration

Routine Detail may show:

```text
Current Streak
Consistency
Recent Occurrences
```

Reuse Analytics calculations where possible.

Do not duplicate calculation logic.

---

# 52. Project Integration

Project Detail may show:

```text
Active Tasks
Completed Tasks
Last Activity
```

Reuse Analytics services.

---

# 53. Academic Integration

Academic Dashboard may show:

```text
Assignments
Exams
Upcoming Deadlines
```

Do not create a second Academic system.

---

# 54. Localization Preparation

Phase 17 does not implement the final localization system.

However:

- Do not hard-code analytics sentences throughout widgets.
- Keep user-facing strings centralized where practical.
- Prepare all text for future Indonesian/English localization.

Example:

```text
"3 overdue tasks"
```

should not be scattered as raw strings throughout business logic.

---

# 55. Accessibility

Ensure:

- Charts have textual equivalents.
- Icons are not the only way to communicate information.
- Important insights use text.
- Progress indicators are understandable without color.
- Touch targets remain accessible on mobile.

Never rely solely on:

```text
Red = bad
Green = good
```

---

# 56. Color Usage

Use the existing OmniLife design system.

Do not create a new color system.

Charts and progress indicators should follow existing theme tokens.

Avoid excessive colors.

---

# 57. Charts

Use charts only where they improve understanding.

Recommended:

```text
Task completion trend
Routine consistency
Goal progress
Schedule density
```

Avoid:

```text
Pie chart for every metric
3D charts
Decorative charts
Charts without meaningful data
```

---

# 58. Empty Analytics

If there is insufficient data:

```text
Not enough data yet.

Keep using OmniLife and your analytics
will become more useful over time.
```

Do not show meaningless:

```text
0%
0
0
0
```

everywhere.

---

# 59. Example Analytics Screen

Conceptually:

```text
Analytics
────────────────────────

This Week ▼

Overview

Tasks
18 completed
6 remaining

Goals
3 active
1 completed

Routines
82% consistency

Projects
4 active

────────────────────────

Insights

✓ You completed more tasks than last week.

! 2 tasks are overdue.

→ One project has been inactive for 14 days.

────────────────────────

[View Weekly Review]
```

Keep the hierarchy clear.

---

# 60. Testing

Test:

```text
Task statistics
Goal statistics
Routine statistics
Project statistics
Calendar statistics
Academic statistics
Weekly Review
Insight rules
Date ranges
Comparisons
Empty states
```

---

# 61. Acceptance Test 1 — Tasks

Create historical task data.

Verify:

```text
Completed
Pending
Overdue
Completion Rate
```

Expected values must match source data.

---

# 62. Acceptance Test 2 — Goals

Create:

```text
4 active goals
1 completed goal
1 paused goal
```

Verify analytics counts.

---

# 63. Acceptance Test 3 — Routines

Create a routine with:

```text
4 scheduled occurrences
3 completed occurrences
```

Expected:

```text
Consistency = 75%
```

---

# 64. Acceptance Test 4 — Projects

Create:

```text
Project A
12 active tasks

Project B
4 active tasks
```

Analytics must display the correct workload.

---

# 65. Acceptance Test 5 — Project Inactivity

Create an active project with no activity for:

```text
17 days
```

Expected:

```text
Project requires attention
```

Do not mark it as abandoned.

---

# 66. Acceptance Test 6 — Calendar

Create calendar events with known durations.

Verify:

```text
Event count
Scheduled duration
Busy days
```

Calculations must use actual event data.

---

# 67. Acceptance Test 7 — Academic

Create:

```text
3 upcoming assignments
2 upcoming exams
```

Verify:

```text
3 assignments
2 exams
```

---

# 68. Acceptance Test 8 — Weekly Review

Generate a weekly review.

Verify:

```text
Task completion
Goal activity
Routine consistency
Project activity
Upcoming deadlines
```

All data must correspond to the selected period.

---

# 69. Acceptance Test 9 — Comparison

Create two weeks of data.

Verify:

```text
This Week
vs
Last Week
```

Calculations must be accurate.

---

# 70. Acceptance Test 10 — Insufficient Data

When there is not enough historical information:

Expected:

```text
Not enough historical data
```

No misleading comparison.

---

# 71. Acceptance Test 11 — Offline

Disable internet.

Verify:

```text
Analytics
Weekly Review
Insights
Charts
Comparisons
```

All must continue working.

---

# 72. Acceptance Test 12 — Mobile

Android:

```text
Open Analytics
Change Time Range
Open Weekly Review
Open Insight
Navigate to related entity
```

All must work.

---

# 73. Acceptance Test 13 — Regression

Verify:

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

Phase 16
Goals
Milestones
Goal Relationships
```

No regressions.

---

# 74. Documentation

Create or update:

```text
docs/ANALYTICS_ARCHITECTURE.md
```

Document:

```text
Analytics architecture
Data sources
Metrics
Calculations
Date ranges
Insight engine
Insight rules
Historical data
Performance
Privacy
Future analytics snapshots
```

Update the main OmniLife architecture documentation.

---

# 75. UI Constraints

Do NOT perform the final global UI/UX overhaul.

Do not:

```text
Redesign the entire OmniLife
Replace navigation
Change the global theme
Remove features
Merge modules
Implement final localization
```

Only implement the UI required for Analytics.

The final UI/UX simplification remains a later phase.

---

# 76. Future AI Compatibility

Do not implement AI.

However, analytics should eventually be queryable by the future OmniLife AI.

Future examples:

```text
"How productive was I this week?"

"Which goals need attention?"

"How consistent was my workout routine this month?"

"What did I accomplish last week?"

"Which project has been inactive?"

"Compare this month with last month."
```

AI must use AnalyticsService.

AI must not directly query the database.

---

# 77. Success Definition

Phase 17 is successful when OmniLife can transform raw personal-management data into useful information:

```text
RAW DATA
   │
   ├── Tasks
   ├── Goals
   ├── Routines
   ├── Projects
   ├── Calendar
   └── Academic
          │
          ▼
   ANALYTICS SERVICE
          │
          ├── Statistics
          ├── Trends
          ├── Comparisons
          └── Insights
          │
          ▼
   USER UNDERSTANDING
```

The user should be able to open Analytics and quickly understand:

```text
What did I accomplish?

What is unfinished?

What is progressing?

What is falling behind?

Where is my workload concentrated?

What deserves my attention?
```

---

# 78. Do Not Move Forward If

Do not consider Phase 17 complete if:

```text
Analytics are based on fake data.

Metrics are inaccurate.

Historical data is fabricated.

Analytics modify source entities unexpectedly.

Analytics require internet access.

Insights are judgmental or misleading.

Charts have no textual alternative.

Empty states are confusing.

Global Search regresses.

Goals regress.

Tasks regress.

Routines regress.

Projects regress.

Calendar regresses.

Academic features regress.

Knowledge Base regresses.

Mobile analytics fails.

Performance becomes noticeably worse.
```

Fix all issues before declaring Phase 17 complete.

---

# 79. Final Implementation Report

When complete, provide:

```text
OMNILIFE PHASE 17 REPORT

Status:
COMPLETED / PARTIAL / BLOCKED

Analytics:
- ...

Task Analytics:
- ...

Goal Analytics:
- ...

Routine Analytics:
- ...

Project Analytics:
- ...

Calendar Analytics:
- ...

Academic Analytics:
- ...

Weekly Review:
- ...

Insight Engine:
- ...

Comparisons:
- ...

Mobile:
- ...

Offline:
- ...

Performance:
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
- Phase 18
```

---

# FINAL ARCHITECTURAL PRINCIPLE

Phase 17 is not about making OmniLife look like a business intelligence application.

It is about turning OmniLife into a system that can help the user **understand their own behavior and progress**.

The architecture should follow:

```text
                    OMNILIFE
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
          ACTIONS              GOALS
             │                   │
             ├── Tasks           ├── Progress
             ├── Routines        ├── Milestones
             ├── Projects        └── Deadlines
             └── Calendar
                    │
                    ▼
                ANALYTICS
                    │
             ┌──────┼──────┐
             ▼      ▼      ▼
          METRICS  TRENDS  INSIGHTS
             │      │      │
             └──────┼──────┘
                    ▼
              BETTER DECISIONS
```

**OmniLife should not merely remember what the user did.**

It should eventually help the user understand:

> **"Bagaimana hidup dan aktivitas saya berjalan dari waktu ke waktu?"**

Keep the implementation:

- Offline-first
- Deterministic
- Privacy-first
- Lightweight
- Action-oriented
- Maintainable
- Ready for future AI analysis

Do not implement AI, cloud synchronization, multi-user functionality, financial management, Secure Vault, or the final global UI/UX overhaul in Phase 17.
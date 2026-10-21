# OmniLife — Phase 6 Implementation Specification

**Project:** OmniLife  
**Phase:** 6 — Intelligence & Insights  
**Status:** Ready for Implementation  
**Implementation Agent:** Antigravity  
**Scope:** Phase 6 only

---

# 1. PURPOSE

Phase 6 introduces the first **Intelligence Layer** of OmniLife.

The objective is to transform OmniLife from:

```text
A collection of personal data
```

into:

```text
A system that can interpret personal data
and provide useful context to the user.
```

The Intelligence Layer should help answer questions such as:

```text
What do I need to do today?

What is becoming overdue?

What does my week look like?

How much have I spent?

What habits are consistent or inconsistent?

What academic deadlines are approaching?

What areas of my life require attention?

What patterns are emerging?
```

The system should provide useful insights without requiring an external AI service.

---

# 2. CORE PRINCIPLE

Phase 6 is NOT the full AI Assistant.

Do not attempt to build a ChatGPT-like assistant in this phase.

Instead:

```text
Existing OmniLife Data
        ↓
Rules
        ↓
Calculations
        ↓
Cross-module aggregation
        ↓
Pattern detection
        ↓
Insights
        ↓
User
```

This creates the foundation for the future AI Assistant.

---

# 3. INTELLIGENCE ARCHITECTURE

Conceptually:

```text
                    OMNILIFE DATA

Calendar ───────┐
Tasks ──────────┤
Projects ───────┤
Goals ──────────┤
Routines ───────┤
College ────────┤
Assignments ────┤
Exams ──────────┤
Finance ────────┤
Notes ──────────┤
Timeline ───────┤
Inventory ──────┤
                 ↓
        Intelligence Layer
                 ↓
       ┌─────────┼─────────┐
       ↓         ↓         ↓
   Aggregation  Rules   Patterns
       ↓         ↓         ↓
       └─────────┼─────────┘
                 ↓
              Insights
                 ↓
      Dashboard / Today / Modules
```

The Intelligence Layer should remain separate from UI components.

---

# 4. SOURCE OF TRUTH

Before implementation:

1. Inspect the current OmniLife workspace.
2. Read all existing architecture documentation.
3. Read Phase 1 implementation report.
4. Read Phase 2 implementation report.
5. Read Phase 3 implementation report.
6. Read Phase 4 implementation report.
7. Read Phase 5 implementation report.
8. Read `SECURITY_ARCHITECTURE.md`.
9. Inspect current data models.
10. Inspect persistence.
11. Inspect navigation.
12. Inspect the existing design system.

Do not assume previous implementations.

Do not rewrite stable systems without necessity.

---

# 5. INTELLIGENCE LAYER PRINCIPLE

The Intelligence Layer should consume data through application/domain services rather than directly coupling every insight to database internals.

Conceptually:

```text
Database
   ↓
Repositories
   ↓
Domain Services
   ↓
Intelligence Services
   ↓
Insight Models
   ↓
UI
```

Avoid:

```text
UI Widget
   ↓
Direct database query
   ↓
Custom calculation
```

---

# 6. INSIGHT MODEL

Create a common representation for generated insights.

Conceptually:

```text
Insight
├── id
├── type
├── title
├── description
├── severity / priority
├── source modules
├── createdAt
├── expiresAt
├── action
└── metadata
```

The exact implementation should follow the existing architecture.

---

# 7. INSIGHT TYPES

Initial insight types:

```text
Upcoming
Overdue
Conflict
Reminder
Progress
Warning
Financial
Academic
Routine
Productivity
Achievement
Planning
```

The architecture should allow future types.

---

# 8. INSIGHT PRIORITY

Use a simple priority system.

Example:

```text
Critical
High
Medium
Low
Informational
```

Avoid showing everything as urgent.

OmniLife should help reduce cognitive overload rather than create it.

---

# 9. TODAY INTELLIGENCE

Enhance the existing Today / daily overview.

The user should see a useful summary such as:

```text
Good morning.

Today

3 Tasks
2 Events
1 Assignment
Workout — Upper Body

Important
Assignment due tomorrow.

Finance
You spent Rp 45.000 today.

Progress
3 / 5 planned tasks completed.
```

The exact UI should follow OmniLife's existing design system.

---

# 10. TODAY PRIORITY

Determine today's most important items.

Potential signals:

```text
Due date
Overdue status
Priority
Deadline proximity
Project importance
Academic deadline
Scheduled event
User-defined importance
```

Do not use a complicated AI model.

Use deterministic rules initially.

---

# 11. OVERDUE INTELLIGENCE

Detect overdue:

```text
Tasks
Assignments
Projects
Other dated obligations
```

Example:

```text
⚠ Overdue

Submit Mathematics Assignment

Due:
Yesterday
```

Do not create duplicate reminders for the same item unnecessarily.

---

# 12. UPCOMING DEADLINES

Detect upcoming:

```text
Assignments
Exams
Tasks
Projects
Goals with deadlines
Events
```

Suggested windows:

```text
Today
Tomorrow
3 days
7 days
14 days
30 days
```

The exact windows should be configurable or centralized.

---

# 13. DEADLINE ESCALATION

An upcoming deadline should become more prominent as it approaches.

Conceptually:

```text
30 days away
    ↓
Normal

14 days
    ↓
Upcoming

7 days
    ↓
Important

3 days
    ↓
High attention

1 day
    ↓
Urgent

Overdue
    ↓
Critical
```

Do not make the UI excessively alarming.

---

# 14. SCHEDULE CONFLICT DETECTION

Detect obvious scheduling conflicts.

Example:

```text
10:00 — College
10:00 — Workout
```

Generate:

```text
Schedule Conflict

You have two activities scheduled at 10:00.
```

Potential future enhancement:

```text
Travel time
Buffer time
Location
```

Do not implement advanced travel optimization in Phase 6.

---

# 15. OVERBOOKED DAY DETECTION

Detect days containing unusually high workload.

Possible signals:

```text
Number of events
Number of tasks
Number of assignments
Estimated task duration
Workout
Other commitments
```

Example:

```text
Your Thursday looks unusually busy.

8 scheduled items
3 deadlines
2 major tasks
```

Do not make medical or psychological claims.

---

# 16. WORKLOAD ESTIMATION

Where task duration is available, estimate workload.

Example:

```text
Today's planned workload:

Tasks:
2h 30m

College:
3h

Workout:
1h

Total:
6h 30m
```

If duration data is unavailable:

```text
Do not invent duration.
```

---

# 17. TASK COMPLETION INSIGHTS

Track basic productivity metrics.

Examples:

```text
Tasks completed today
Tasks completed this week
Tasks overdue
Completion rate
Completed vs planned
```

Example:

```text
This Week

18 completed
22 planned

Completion:
82%
```

---

# 18. TASK BACKLOG INSIGHT

Detect growing unfinished work.

Example:

```text
Your unfinished task count has increased
for 3 consecutive days.
```

This should be presented as an observation, not judgment.

Avoid:

```text
You're being lazy.
You're unproductive.
```

Prefer:

```text
Your backlog is growing.
You may want to review your priorities.
```

---

# 19. TASK AGING

Detect tasks that remain incomplete for unusually long periods.

Example:

```text
Task:
Finish portfolio

Created:
12 days ago

Status:
Still pending
```

Generate a low-priority insight:

```text
This task has been waiting for 12 days.
Consider rescheduling or removing it.
```

---

# 20. ROUTINE INTELLIGENCE

Use recurring routines from the existing routine system.

Examples:

```text
Workout
Study
Reading
Planning
Cleaning
Weekly review
```

Track:

```text
Expected occurrences
Completed occurrences
Missed occurrences
Current streak
Completion rate
```

---

# 21. WEEKLY ROUTINE SUMMARY

Example:

```text
Workout

Mon ✓
Tue Rest
Wed ✓
Thu Rest
Fri ✓
Sat ✓
Sun Rest

This week:
4 / 4 planned sessions completed
```

Do not automatically create workout plans.

Use the user's configured routine.

---

# 22. ROUTINE CONSISTENCY

Calculate a simple consistency score.

Example:

```text
Workout consistency:
87%

Study routine:
72%

Weekly planning:
100%
```

Do not present this as a health score.

It is simply an application metric.

---

# 23. ROUTINE MISSED PATTERN

Detect repeated misses.

Example:

```text
Your Monday workout has been missed
3 weeks in a row.
```

Suggested action:

```text
Review Monday's schedule.
```

Do not automatically assume why it happened.

---

# 24. GOAL PROGRESS INTELLIGENCE

For goals with measurable progress:

```text
Current
Target
Deadline
Progress
```

Calculate:

```text
Progress percentage
Remaining amount
Time remaining
Required pace where mathematically possible
```

Example:

```text
Goal:
Save Rp 5.000.000

Current:
Rp 3.200.000

Progress:
64%

Remaining:
Rp 1.800.000
```

---

# 25. GOAL DEADLINE RISK

If a goal has both:

```text
Target
Deadline
Current progress
```

estimate whether the current pace may be insufficient.

Only do this when enough historical data exists.

Do not claim certainty.

Use language such as:

```text
At the current pace, this goal may require
additional progress before the deadline.
```

Not:

```text
You will fail.
```

---

# 26. FINANCIAL INTELLIGENCE

Phase 6 should introduce useful financial summaries based on Phase 4 finance data.

Initial insights:

```text
Income
Expenses
Net cash flow
Category spending
Budget progress
Recurring expenses
```

---

# 27. FINANCIAL PERIOD SUMMARY

Support:

```text
Today
This week
This month
Previous month
Custom period
```

Example:

```text
August

Income:
Rp 3.500.000

Expenses:
Rp 1.850.000

Net:
Rp 1.650.000
```

---

# 28. SPENDING CATEGORY ANALYSIS

Analyze categories such as:

```text
Food
Transport
Education
Entertainment
Shopping
Subscriptions
Other
```

Example:

```text
August Spending

Food        Rp 650k
Transport   Rp 300k
Education   Rp 250k
Other       Rp 150k
```

Use the user's actual categories.

Do not hard-code the category list unnecessarily.

---

# 29. SPENDING ANOMALY

Detect unusual spending relative to the user's own history.

Example:

```text
Food spending this week is significantly
higher than your recent average.
```

This should use historical data.

Do not label something "abnormal" without sufficient history.

---

# 30. FINANCIAL TREND

Show basic trends:

```text
Spending this month
vs
Previous month
```

Example:

```text
Food

July:
Rp 520.000

August:
Rp 680.000

Change:
+30.8%
```

---

# 31. RECURRING PAYMENT DETECTION

Where transactions provide enough historical data, identify potential recurring expenses.

Examples:

```text
Monthly subscription
Internet
Software
Membership
```

Do not automatically create a subscription record.

Instead:

```text
Potential recurring expense detected.
```

The user can confirm it.

---

# 32. BUDGET INTELLIGENCE

If budgeting exists:

```text
Budget:
Rp 1.000.000

Spent:
Rp 720.000

Remaining:
Rp 280.000
```

Calculate:

```text
Budget percentage used
Remaining budget
Days remaining
```

Only calculate projected spending when enough data exists.

---

# 33. FINANCIAL WARNINGS

Examples:

```text
You have reached 90% of your Food budget.

Your subscription expenses increased this month.

Your expenses exceeded your income this month.
```

Keep these neutral and factual.

---

# 34. ACADEMIC INTELLIGENCE

Use Phase 3 academic data.

Track:

```text
Upcoming assignments
Upcoming exams
Overdue assignments
Course workload
Academic schedule
```

---

# 35. ACADEMIC DEADLINE SUMMARY

Example:

```text
This Week

Mathematics
Assignment due Tuesday

Programming
Project checkpoint due Thursday

English
Presentation Friday
```

---

# 36. EXAM COUNTDOWN

If exam dates exist:

```text
Programming Exam
12 days remaining
```

Avoid unnecessary alarm.

---

# 37. ACADEMIC WORKLOAD

Estimate the user's academic workload based on:

```text
Assignments
Projects
Exams
Scheduled study sessions
```

Example:

```text
Academic workload this week:

4 assignments
1 project
2 exams
```

Do not infer academic performance from workload.

---

# 38. PROJECT INTELLIGENCE

For Projects:

```text
Tasks
Progress
Deadline
Overdue items
```

Generate:

```text
Project Progress
Project Risk
Project Backlog
Upcoming Project Deadline
```

---

# 39. PROJECT PROGRESS

Example:

```text
OmniTenant

18 / 30 tasks completed

60%
```

Use actual project/task relationships.

---

# 40. PROJECT RISK

Potential risk signals:

```text
Deadline approaching
Low task completion rate
Many overdue tasks
No recent activity
Large remaining workload
```

Example:

```text
OmniTenant

Deadline approaching in 7 days.

14 tasks remain.
```

Avoid declaring failure.

---

# 41. CROSS-MODULE INTELLIGENCE

One of Phase 6's most important capabilities is connecting modules.

Example:

```text
College Exam
      +
Calendar
      +
Tasks
      +
Study Routine
```

Could produce:

```text
Exam in 7 days.

You currently have no study sessions
scheduled for this subject.

Consider planning study time.
```

This is the type of intelligence OmniLife should eventually become known for.

---

# 42. CROSS-MODULE EXAMPLE — FINANCE

```text
Subscription
      +
Finance
      +
Recurring Transaction
```

Could produce:

```text
Your recurring software expenses
total Rp 250.000 this month.
```

---

# 43. CROSS-MODULE EXAMPLE — GOALS

```text
Goal
      +
Finance
```

Example:

```text
Goal:
Buy Laptop

Target:
Rp 10.000.000

Current:
Rp 4.000.000

Progress:
40%
```

If relevant, show financial progress without exposing unrelated data.

---

# 44. CROSS-MODULE EXAMPLE — WORKOUT

```text
Routine
      +
Calendar
      +
Tasks
```

Example:

```text
Wednesday

Workout:
Upper Body

Scheduled:
18:00

You also have:
2 high-priority tasks
```

The insight layer may highlight a busy evening.

Do not automatically modify the workout.

---

# 45. CROSS-MODULE EXAMPLE — COLLEGE + SCHEDULE

```text
Exam
+
Calendar
+
Tasks
```

Example:

```text
Programming exam in 5 days.

You have 3 unfinished study tasks.
```

This is useful because the user sees context rather than isolated data.

---

# 46. DAILY PLANNING ASSISTANCE

Introduce a basic daily planning engine.

Given:

```text
Events
Tasks
Deadlines
Routines
```

generate:

```text
Suggested focus
```

Example:

```text
Today's Focus

1. Finish Mathematics assignment
2. Attend Programming class
3. Workout
```

Do not automatically reorder user tasks without permission.

---

# 47. DAILY PRIORITY SCORE

A deterministic priority system may consider:

```text
Deadline proximity
User priority
Overdue status
Estimated effort
Project importance
Academic importance
```

Keep the algorithm explainable.

The user should be able to understand why something is considered important.

---

# 48. EXPLAINABLE INSIGHTS

Every generated insight should have a reason where appropriate.

Example:

```text
High Priority

Mathematics Assignment

Reason:
Due tomorrow and currently incomplete.
```

Avoid opaque "AI decided this" behavior.

---

# 49. INSIGHT ACTIONS

Insights should be actionable.

Possible actions:

```text
Open Task
Open Assignment
Open Project
Open Finance
Open Goal
Create Task
Schedule
Dismiss
Snooze
```

Example:

```text
Assignment due tomorrow.

[Open Assignment]
[Plan Study Time]
[Dismiss]
```

---

# 50. INSIGHT DISMISSAL

Users should be able to dismiss non-critical insights.

Example:

```text
Dismiss
```

Store dismissal state appropriately.

Do not repeatedly show the same dismissed insight unless its underlying condition materially changes.

---

# 51. INSIGHT SNOOZE

Where appropriate:

```text
Snooze until tomorrow
Snooze for 3 days
```

This is particularly useful for:

```text
Planning suggestions
Low-priority reminders
Financial observations
Routine observations
```

---

# 52. INSIGHT DEDUPLICATION

The Intelligence Layer must avoid generating duplicates.

Bad:

```text
Assignment due tomorrow.
Assignment due tomorrow.
Assignment due tomorrow.
```

Good:

```text
One insight
+
Updated state
```

Use stable identifiers where possible.

---

# 53. INSIGHT EXPIRATION

Insights should expire when they are no longer relevant.

Example:

```text
Assignment due tomorrow
```

After completion:

```text
Insight disappears.
```

Do not keep stale insights indefinitely.

---

# 54. INTELLIGENCE CACHE

If computationally useful, cache derived results.

However:

```text
Source data changed
      ↓
Invalidate affected intelligence
```

Do not allow stale calculations to persist indefinitely.

---

# 55. INTELLIGENCE REFRESH

The system should update intelligence when relevant data changes.

Examples:

```text
Task completed
      ↓
Refresh task insights

Transaction added
      ↓
Refresh financial insights

Assignment created
      ↓
Refresh academic insights
```

Do not rebuild the entire intelligence system for every tiny change if avoidable.

---

# 56. BACKGROUND PROCESSING

Do not introduce complex background processing in Phase 6 unless required by the existing architecture.

Prefer predictable local computation.

If background processing is required:

```text
Document:
Why
When
What data
Performance impact
Platform limitations
```

---

# 57. PRIVACY

All Phase 6 intelligence should be computed locally.

Do NOT send OmniLife personal data to external AI services.

Do NOT send:

```text
Tasks
Calendar
Finance
College
Goals
Notes
Routine data
```

to an external server in Phase 6.

---

# 58. VAULT ISOLATION

The Intelligence Layer must NOT inspect Vault secrets.

The Vault remains a separate security boundary.

Allowed:

```text
Vault contains:
"Roblox Account"
```

Not allowed:

```text
Intelligence Layer reads:
Roblox password
```

Do not use Vault secrets for recommendations.

---

# 59. GLOBAL SEARCH

Phase 6 may improve Search using metadata across modules.

Possible results:

```text
Task
Project
Goal
Assignment
Transaction
Routine
Vault item metadata
```

But Vault secret contents must remain excluded.

---

# 60. DASHBOARD INTELLIGENCE

Improve the OmniLife dashboard.

Potential sections:

```text
Good morning

Today's Schedule

Top Priorities

Upcoming Deadlines

Financial Snapshot

Goal Progress

Routine Progress

Important Insights
```

Do not display every metric simultaneously.

The dashboard should prioritize useful information.

---

# 61. DASHBOARD PERSONALIZATION

Use the user's actual activity.

If there are no finance records:

```text
Do not show empty financial warnings.
```

If there are no academic records:

```text
Do not show academic sections unnecessarily.
```

The UI should adapt to available data.

---

# 62. EMPTY STATES

Avoid meaningless:

```text
No data.
```

Use useful empty states.

Example:

```text
No upcoming deadlines.

You're clear for now.
```

Do not fabricate insights.

---

# 63. WEEKLY REVIEW

Introduce a Weekly Review.

Example:

```text
Weekly Review

Tasks
32 completed
38 planned

Goals
2 goals progressed

Workout
4 / 4 sessions

Finance
Rp 1.250.000 spent

Academic
2 assignments completed
```

The exact metrics should depend on available data.

---

# 64. MONTHLY REVIEW

Provide a basic monthly overview.

Possible sections:

```text
Productivity
Finance
Goals
Routines
College
Projects
```

Do not overload the user with charts.

---

# 65. PERSONAL TRENDS

Show trends based on sufficient historical data.

Examples:

```text
Task completion
Spending
Routine consistency
Goal progress
```

Only display trends when there is enough data.

Do not generate misleading conclusions from tiny datasets.

---

# 66. DATA SUFFICIENCY

Every statistical insight should consider whether enough historical data exists.

For example:

```text
1 transaction
```

is insufficient to determine a spending trend.

Prefer:

```text
Not enough data yet.
```

rather than inventing a trend.

---

# 67. TREND LANGUAGE

Use neutral language.

Good:

```text
Spending increased compared with last month.
```

Bad:

```text
You're spending irresponsibly.
```

Good:

```text
Task completion has improved over the past 4 weeks.
```

Bad:

```text
You're becoming more productive as a person.
```

OmniLife observes behavior; it does not judge the user.

---

# 68. ANALYTICS

Introduce basic local analytics models.

Potential metrics:

```text
Task completion rate
Overdue rate
Routine completion rate
Goal progress
Expense totals
Income totals
Net cash flow
Academic workload
Project progress
```

Keep metrics modular.

---

# 69. ANALYTICS TIME WINDOWS

Support:

```text
Today
This Week
This Month
Previous Month
Last 3 Months
Custom
```

Centralize date-range logic.

Avoid each module implementing different definitions of "week" and "month".

---

# 70. DATE / TIME CONSISTENCY

Use the application's centralized date/time utilities.

All intelligence calculations must respect:

```text
User locale
User timezone
Calendar conventions
```

Do not create ad-hoc date calculations throughout the application.

---

# 71. WEEK START

Respect OmniLife's existing calendar configuration.

If no configuration exists, use the application's established default.

Do not hard-code different week-start rules across modules.

---

# 72. CURRENCY

Financial intelligence must use the existing Finance module's currency configuration.

Do not assume:

```text
USD
```

or any other currency.

For the current local setup, Indonesian Rupiah may be used if that is already configured by the user.

---

# 73. NO FINANCIAL ADVICE

Phase 6 financial intelligence should remain informational.

It may say:

```text
Spending increased 22%.
```

It must not automatically say:

```text
You should invest in X.
Buy Y.
Take a loan.
```

Do not provide personalized financial advice in this phase.

---

# 74. NO MEDICAL / HEALTH CLAIMS

Workout and routine intelligence must not generate medical conclusions.

Allowed:

```text
You completed 4 of 4 planned workouts.
```

Not allowed:

```text
Your body is recovering poorly.
You are medically overtrained.
```

Unless a future feature explicitly handles health data with appropriate safeguards.

---

# 75. NO PSYCHOLOGICAL JUDGMENTS

Never infer:

```text
Lazy
Depressed
Burned out
Unmotivated
Addicted
```

from normal productivity data.

OmniLife should remain supportive and factual.

---

# 76. AI BOUNDARY

Phase 6 may use:

```text
Deterministic rules
Statistics
Aggregation
Pattern detection
Scoring
Scheduling logic
```

It should NOT require an external LLM.

The future AI Assistant can later consume the structured intelligence layer.

---

# 77. FUTURE AI ARCHITECTURE

Prepare the architecture conceptually for:

```text
OmniLife Data
      ↓
Intelligence Layer
      ↓
Structured Context
      ↓
Future AI Assistant
```

The future AI should not directly crawl random database tables.

It should consume controlled, privacy-aware context.

---

# 78. INTELLIGENCE SERVICE STRUCTURE

The exact architecture must follow the existing codebase, but conceptually consider:

```text
IntelligenceService

├── DailyIntelligence
├── TaskIntelligence
├── ScheduleIntelligence
├── RoutineIntelligence
├── GoalIntelligence
├── FinanceIntelligence
├── AcademicIntelligence
├── ProjectIntelligence
├── TrendIntelligence
└── CrossModuleIntelligence
```

Do not create unnecessary abstractions if the current project architecture suggests a better structure.

---

# 79. RULE ENGINE

Rules should be explicit and testable.

Conceptually:

```text
Rule
├── condition
├── priority
├── insight
└── action
```

Example:

```text
IF
assignment due <= 1 day
AND assignment incomplete

THEN
create UpcomingDeadline insight
```

Rules must be unit-testable.

---

# 80. RULE CONFIGURATION

Do not create a user-facing rule editor in Phase 6.

Rules can be defined in code/domain configuration.

A future advanced customization system can be added later.

---

# 81. INSIGHT GENERATION PIPELINE

Use a predictable pipeline:

```text
Collect relevant data
        ↓
Normalize
        ↓
Evaluate rules
        ↓
Calculate metrics
        ↓
Detect patterns
        ↓
Deduplicate
        ↓
Prioritize
        ↓
Filter stale insights
        ↓
Present
```

---

# 82. DATA NORMALIZATION

Where possible, normalize:

```text
Dates
IDs
Priorities
Statuses
Categories
Currency
Durations
Recurring patterns
```

before intelligence calculations.

---

# 83. ERROR ISOLATION

If one intelligence module fails:

```text
Finance Intelligence error
```

must not break:

```text
Today
Tasks
Calendar
College
```

The Intelligence Layer should degrade gracefully.

---

# 84. FAILURE BEHAVIOR

If intelligence cannot be calculated:

Do not fabricate results.

Example:

```text
Financial insights unavailable.
```

is better than an incorrect financial statement.

---

# 85. PERFORMANCE

Intelligence calculations should remain fast for normal personal-scale datasets.

Avoid expensive full-database scans on every UI rebuild.

Use:

```text
Memoization
Caching
Incremental refresh
Date-range filtering
```

where useful.

Do not prematurely over-engineer.

---

# 86. LARGE DATASET PREPARATION

Although OmniLife is currently personal/local, the architecture should remain capable of handling years of data.

Example:

```text
2026
2027
2028
2029
2030
...
```

Do not assume only the current year exists.

---

# 87. HISTORICAL DATA

Intelligence must respect OmniLife's long-term timeline.

Do not delete historical records merely because they are old.

Use historical information for trends where appropriate.

---

# 88. TIMELINE INTELLIGENCE

The Timeline may be used as a historical context source.

Examples:

```text
Project completed
Goal achieved
Important milestone
Major personal event
```

Do not expose Vault events or secrets.

---

# 89. ACHIEVEMENT INSIGHTS

Allow positive observations.

Example:

```text
Nice work.

You completed 18 tasks this week,
your highest weekly total so far.
```

Only generate when the historical comparison is valid.

Avoid excessive gamification.

---

# 90. MILESTONE DETECTION

Potential milestones:

```text
First completed goal
100 completed tasks
30-day routine streak
Project completed
Savings target reached
Course completed
```

Do not force gamification.

The user should be able to disable achievement-style insights later.

---

# 91. INSIGHT FREQUENCY

Do not flood the user.

Potential policy:

```text
Critical:
Always visible

High:
Visible prominently

Medium:
Visible in relevant module

Low:
Visible in insights/review

Informational:
Optional
```

The exact thresholds should be centralized.

---

# 92. INSIGHT FEEDBACK

Prepare for future user feedback:

```text
Useful
Not useful
Dismiss
Snooze
```

Do not implement machine learning from this feedback in Phase 6.

Simply design the model so feedback can be stored later if useful.

---

# 93. NOTIFICATIONS

Phase 6 may integrate intelligence with notifications.

However:

```text
Do not notify for every insight.
```

Only high-value time-sensitive insights should eventually become notifications.

Example:

```text
Assignment due tomorrow.
```

Not:

```text
You completed 3 tasks today.
```

unless explicitly configured.

---

# 94. NOTIFICATION PRIVACY

Notifications must not reveal sensitive information.

Never show:

```text
Password
API Key
Vault secret
Financial account credentials
```

---

# 95. USER CONTROL

Future settings should allow users to control:

```text
Enable Intelligence
Insight categories
Notification categories
Frequency
Quiet hours
```

Implement only the minimum necessary settings in Phase 6.

---

# 96. QUIET HOURS

If notification scheduling is implemented, respect existing reminder/notification settings.

Do not introduce conflicting scheduling systems.

---

# 97. DESIGN LANGUAGE

Intelligence UI should feel:

```text
Helpful
Calm
Clear
Human
Minimal
Contextual
```

Avoid:

```text
AI everywhere
"AI MAGIC"
Robotic language
Excessive badges
Too many charts
```

The user should feel that OmniLife is quietly helping rather than constantly talking.

---

# 98. NO ARTIFICIAL AI LABELS

Do not label every insight:

```text
✨ AI Insight
🤖 AI detected
```

The intelligence layer can work without AI.

Use natural UI language:

```text
Insight
Planning
Overview
Trend
Attention
```

---

# 99. VISUAL HIERARCHY

Prioritize:

```text
What matters now
        ↓
What needs attention
        ↓
What is coming
        ↓
What is improving
        ↓
Historical analytics
```

Do not prioritize vanity metrics.

---

# 100. DASHBOARD EXAMPLE

A possible final dashboard:

```text
Good morning, Nanbeyond

────────────────────────

TODAY

09:00
College

11:00
Programming Assignment

18:00
Workout

────────────────────────

FOCUS

Finish Programming Assignment

Due tomorrow

[Open]

────────────────────────

UPCOMING

Mathematics Exam
5 days

Project Deadline
8 days

────────────────────────

PROGRESS

Tasks
82% this week

Workout
4 / 4

Goal
64%

────────────────────────

FINANCE

August
Income     Rp 3.500.000
Expenses   Rp 1.850.000
Net        Rp 1.650.000

────────────────────────

INSIGHTS

Your food spending is higher
than your recent average.

[View Finance]

────────────────────────
```

This is an example of information hierarchy, not a requirement to reproduce the exact UI.

---

# 101. WEEKLY REVIEW EXAMPLE

```text
YOUR WEEK

Productivity
18 / 22 tasks completed

Routines
4 / 5 completed

Goals
2 goals progressed

College
3 assignments completed

Finance
Rp 1.250.000 spent

Highlights

✓ Best task completion week this month
✓ Workout routine maintained
⚠ One assignment carried over
```

---

# 102. MONTHLY REVIEW EXAMPLE

```text
AUGUST REVIEW

Productivity
78 tasks completed

Finance
Rp 1.850.000 spent

Goals
3 goals progressed

College
8 assignments completed

Routines
84% consistency

Notable Trends

Task completion ↑

Food spending ↑

Workout consistency →
```

Only show metrics that have valid data.

---

# 103. TESTING — DAILY INTELLIGENCE

Test:

```text
Task exists
Event exists
Deadline exists
Routine exists

Open Today

Verify:
correct items
correct priority
correct dates
no duplicates
```

---

# 104. TESTING — DEADLINES

Create:

```text
Task due today
Task due tomorrow
Task due in 7 days
Overdue task
Completed task
```

Verify each state.

---

# 105. TESTING — CONFLICTS

Create two overlapping events.

Verify:

```text
Conflict detected
```

Then modify one event.

Verify:

```text
Conflict disappears
```

---

# 106. TESTING — FINANCE

Create transactions.

Verify:

```text
Income
Expense
Category
Monthly totals
Net cash flow
Category analysis
```

Then modify/delete a transaction.

Verify intelligence updates correctly.

---

# 107. TESTING — ROUTINES

Create a weekly routine.

Record:

```text
Completed
Missed
Rest day
```

Verify:

```text
Consistency
Completion count
Streak
```

Do not treat configured Rest Days as missed workouts.

---

# 108. TESTING — GOALS

Create a measurable goal.

Test:

```text
0%
25%
50%
75%
100%
```

Verify progress calculations.

---

# 109. TESTING — ACADEMIC

Create:

```text
Course
Assignment
Exam
```

Verify:

```text
Upcoming deadlines
Academic workload
Exam countdown
```

---

# 110. TESTING — CROSS MODULE

Test at least:

```text
Assignment
+
Task
+
Calendar
```

and:

```text
Goal
+
Finance
```

and:

```text
Routine
+
Calendar
+
Task
```

Verify that the generated context is correct.

---

# 111. TESTING — DATA SUFFICIENCY

Verify that the system does NOT create fake trends from insufficient data.

Example:

```text
One financial transaction
```

must not produce:

```text
Your spending increased 40%.
```

---

# 112. TESTING — VAULT ISOLATION

Verify:

```text
Vault password exists
```

Then ensure:

```text
Intelligence
Search
Dashboard
Timeline
Analytics
```

cannot access the secret.

---

# 113. TESTING — HISTORICAL DATA

Create records across multiple months.

Verify:

```text
Monthly analytics
Weekly analytics
Trend calculations
Previous period comparison
```

remain correct.

---

# 114. TESTING — TIMEZONE

Verify date boundaries around midnight where practical.

Ensure:

```text
Today's tasks
Tomorrow's tasks
Upcoming deadlines
```

respect the application's configured timezone.

---

# 115. TESTING — PERFORMANCE

Test with a realistic personal dataset:

```text
Hundreds of tasks
Hundreds of calendar entries
Multiple projects
Multiple goals
Multiple transactions
Multiple routines
Academic records
Years of historical data
```

Verify that normal UI remains responsive.

---

# 116. REGRESSION TEST

After Phase 6:

```text
[ ] Phase 1 functionality works
[ ] Phase 2 functionality works
[ ] Phase 3 functionality works
[ ] Phase 4 functionality works
[ ] Phase 5 Vault remains functional
```

No intelligence feature should break existing functionality.

---

# 117. SECURITY REGRESSION

Especially verify Phase 5:

```text
[ ] Vault remains locked on restart
[ ] Vault secrets remain encrypted
[ ] Global Search does not expose secrets
[ ] Intelligence does not access secrets
[ ] Notifications do not expose secrets
[ ] Logs do not expose secrets
```

---

# 118. DOCUMENTATION

Create:

```text
PHASE_6_IMPLEMENTATION_REPORT.md
```

Include:

```text
1. Implementation Summary

2. Intelligence Architecture

3. Insight Model

4. Rules Implemented

5. Daily Intelligence

6. Task Intelligence

7. Schedule Intelligence

8. Routine Intelligence

9. Goal Intelligence

10. Finance Intelligence

11. Academic Intelligence

12. Project Intelligence

13. Cross-Module Intelligence

14. Analytics

15. Weekly Review

16. Monthly Review

17. Dashboard Changes

18. Performance

19. Privacy

20. Vault Isolation

21. Tests

22. Regression Results

23. Known Issues

24. Deferred Features

25. Recommended Phase 7
```

---

# 119. DEFERRED FEATURES

Create:

```text
PHASE_6_DEFERRED_FEATURES.md
```

Potential future features:

```text
LLM-powered assistant
Natural-language queries
AI daily planning
AI study assistant
AI financial assistant
Predictive scheduling
Automatic task decomposition
Natural language task creation
Voice assistant
Semantic search
Personalized recommendations
Cross-device intelligence
Cloud intelligence
```

Do not implement these automatically.

---

# 120. FUTURE AI ASSISTANT CONTRACT

The Intelligence Layer should eventually provide structured context to a future AI Assistant.

Conceptually:

```text
AI Assistant

"What should I focus on today?"

        ↓

Intelligence Layer

Today:
3 tasks
1 deadline
2 events
1 workout
1 financial warning

        ↓

AI Assistant

Natural-language response
```

The future AI should not need unrestricted database access.

---

# 121. OFFLINE-FIRST

Phase 6 must work entirely offline.

No internet connection should be required for:

```text
Insights
Analytics
Trends
Daily planning
Cross-module analysis
```

---

# 122. NO EXTERNAL AI

Do not add OpenAI, Gemini, Claude, or other external AI APIs in Phase 6.

The purpose of this phase is to establish the local intelligence foundation.

Future AI integration will be designed separately.

---

# 123. IMPLEMENTATION ORDER

Implement incrementally.

Recommended batches:

```text
Batch 1
Inspect existing architecture and data contracts

Batch 2
Create Intelligence domain models

Batch 3
Create shared date/time and aggregation utilities

Batch 4
Daily Intelligence

Batch 5
Task + Schedule Intelligence

Batch 6
Routine Intelligence

Batch 7
Goal Intelligence

Batch 8
Finance Intelligence

Batch 9
Academic Intelligence

Batch 10
Project Intelligence

Batch 11
Cross-Module Intelligence

Batch 12
Dashboard Intelligence

Batch 13
Weekly Review

Batch 14
Monthly Review

Batch 15
Trends and Historical Analytics

Batch 16
Insight prioritization / deduplication / expiration

Batch 17
Performance optimization

Batch 18
Security + Vault isolation review

Batch 19
Regression testing

Batch 20
Documentation
```

After each meaningful batch:

```text
Implement
   ↓
Run tests
   ↓
Inspect result
   ↓
Fix
   ↓
Continue
```

---

# 124. SCOPE CONTROL

If Antigravity discovers features outside Phase 6:

Do not implement them automatically.

Add them to:

```text
PHASE_6_DEFERRED_FEATURES.md
```

Do not begin Phase 7.

---

# 125. STOP CONDITION

When Phase 6 is complete:

**STOP.**

Do not automatically begin:

```text
AI Assistant
Cloud Sync
Cross-device synchronization
Multi-user
Publishing
```

Wait for human review.

---

# 126. FINAL QUALITY CHECK

Run:

```bash
flutter analyze
flutter test
```

Also test all currently configured build targets.

Do not suppress errors merely to obtain a clean result.

---

# 127. PHASE 6 SUCCESS CRITERIA

Phase 6 succeeds when OmniLife begins transforming raw personal records into useful context.

The architecture should become:

```text
                    OMNILIFE

Calendar ─────┐
Tasks ────────┤
Projects ─────┤
Goals ────────┤
Routines ─────┤
College ──────┤
Finance ──────┤
Timeline ─────┤
               ↓
       Intelligence Layer
               ↓
      ┌────────┼─────────┐
      ↓        ↓         ↓
   Metrics   Rules    Patterns
      ↓        ↓         ↓
      └────────┼─────────┘
               ↓
            Insights
               ↓
       ┌───────┼────────┐
       ↓       ↓        ↓
     Today  Dashboard  Reviews
```

The user should begin to feel:

```text
"I don't just record my life in OmniLife."

"OmniLife helps me understand what is happening."
```

---

# 128. FINAL INSTRUCTION TO ANTIGRAVITY

Start by inspecting the current OmniLife workspace.

Read all existing Phase 1–5 documentation and current implementation.

Implement **ONLY Phase 6 — Intelligence & Insights**.

Do not assume the project is empty.

Do not rewrite working modules unnecessarily.

Do not implement an external AI assistant.

Do not send OmniLife data to external services.

Do not access Vault secrets.

Do not create medical, psychological, or unsupported financial conclusions.

Prefer deterministic, explainable rules and local calculations.

Build the Intelligence Layer as a reusable foundation for future AI capabilities.

Implement incrementally.

Test after every meaningful batch.

Perform cross-module testing.

Perform Phase 5 security regression testing.

Create:

```text
PHASE_6_IMPLEMENTATION_REPORT.md
PHASE_6_DEFERRED_FEATURES.md
```

Run:

```bash
flutter analyze
flutter test
```

At the end, STOP and wait for human review.
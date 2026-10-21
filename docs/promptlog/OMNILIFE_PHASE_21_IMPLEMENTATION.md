document id="58321" title="OmniLife Phase 21 — Dashboard & Analytics System"
# OMNILIFE — PHASE 21
## Dashboard & Analytics System

**Project:** OmniLife  
**Phase:** 21  
**Previous Phase:** Phase 20 — Personal Inventory & Wishlist Management  
**Next Phase:** Phase 22 — Cross-Module Integration  
**Status:** Implementation Phase

---

# 1. Objective

Implement the **OmniLife Dashboard & Analytics System**.

The purpose of this phase is to transform data from existing OmniLife modules into a centralized, useful, and actionable overview.

OmniLife already contains multiple domains:

```text
Calendar
Schedule
Tasks
Reminders
Projects
Academic
Knowledge Base
Goals
Finance
Subscriptions
Inventory
Wishlist
```

Phase 21 must allow the user to understand their current situation without opening every module individually.

The Dashboard should answer questions such as:

```text
What do I need to do today?

What is coming next?

What tasks are overdue?

What reminders are approaching?

How are my finances doing?

What goals am I working toward?

What subscriptions are active?

What do I own?

What is on my wishlist?

What academic work is approaching?

What projects are active?

What requires my attention?
```

---

# 2. Core Principle

The Dashboard is an **aggregation layer**, not a new source of data.

The architecture should follow:

```text
Existing Modules
       │
       ├── Calendar
       ├── Tasks
       ├── Reminders
       ├── Goals
       ├── Finance
       ├── Academic
       ├── Projects
       ├── Subscriptions
       ├── Inventory
       └── Wishlist
              │
              ▼
       Dashboard Aggregation
              │
              ▼
       Dashboard Widgets
              │
              ▼
           Analytics
```

Do not duplicate domain data.

---

# 3. Architectural Rule

The Dashboard must never become the source of truth.

For example:

```text
Task data
→ Task system owns the data

Finance data
→ Finance system owns the data

Goal data
→ Goal system owns the data

Inventory data
→ Inventory system owns the data
```

The Dashboard only reads and aggregates.

Do not create duplicate models such as:

```text
DashboardTask
DashboardTransaction
DashboardGoal
DashboardInventory
```

unless absolutely required for caching or performance.

---

# 4. Scope

Phase 21 includes:

```text
Dashboard
Dashboard Layout
Dashboard Widgets
Today Overview
Upcoming Overview
Task Overview
Reminder Overview
Calendar Overview
Goal Overview
Finance Overview
Subscription Overview
Academic Overview
Project Overview
Inventory Overview
Wishlist Overview
Cross-Module Statistics
Trend Analytics
Basic Charts
Date Range Filters
Dashboard Preferences
Widget Visibility
Widget Ordering
Empty States
Loading States
Error States
Offline Behavior
Analytics Service
```

---

# 5. Out of Scope

Do not implement:

```text
Final Global UI/UX Overhaul
Indonesian/English Localization
Cloud Analytics
AI-generated Analytics
AI-generated Recommendations
Machine Learning
Predictive Financial Models
External Analytics Services
User Tracking
Telemetry
Multi-user Analytics
Cloud Synchronization
```

AI analytics can be considered in a later phase.

---

# 6. Dashboard Philosophy

The Dashboard should prioritize:

```text
Actionable
Relevant
Readable
Calm
Personal
Contextual
```

Avoid turning the Dashboard into a wall of statistics.

The user should immediately understand:

```text
NOW
NEXT
IMPORTANT
PROGRESS
```

---

# 7. Dashboard Information Hierarchy

Preferred conceptual hierarchy:

```text
LEVEL 1
Today / Immediate Actions

LEVEL 2
Upcoming / Important

LEVEL 3
Progress

LEVEL 4
Analytics

LEVEL 5
Additional Information
```

The most important information should appear first.

---

# 8. Main Dashboard Sections

The Dashboard should conceptually contain:

```text
Today
Upcoming
Tasks
Reminders
Goals
Finance
Academic
Projects
Subscriptions
Inventory
Wishlist
Analytics
```

Not every section must be visible simultaneously.

Widgets should be configurable.

---

# 9. Dashboard Header

The Dashboard header should provide:

```text
Greeting / Context
Current Date
Quick Add
Dashboard Settings
```

Example:

```text
Good morning

Wednesday, August 12

[ + Add ]
```

Do not overdesign the header.

---

# 10. Quick Add

The Dashboard should provide access to commonly used actions:

```text
Add Task
Add Reminder
Add Event
Add Note
Add Expense
Add Income
Add Goal
Add Wishlist
Add Inventory Item
```

Only show actions supported by existing modules.

Do not create duplicate creation flows.

---

# 11. Today Overview

The Dashboard should provide a Today overview.

Include:

```text
Today's Events
Today's Tasks
Today's Reminders
Today's Deadlines
Today's Academic Items
```

Example:

```text
Today

09:00
Class

11:30
Complete Assignment

15:00
Workout

20:00
Review Project
```

The Dashboard should link each item back to its original module.

---

# 12. Today Priority

Prioritize:

```text
Overdue
Due Today
Scheduled Today
High Priority
Time-sensitive
```

Do not automatically assign priority to everything.

---

# 13. Today Empty State

If there is nothing scheduled:

```text
Nothing urgent today.

You have a clear day.
```

The user should not feel that the app is broken.

---

# 14. Upcoming Widget

Display upcoming items from multiple modules.

Sources:

```text
Calendar
Tasks
Reminders
Academic
Projects
Goals
Subscriptions
Inventory
Wishlist
```

Example:

```text
Coming Up

Tomorrow
Math Assignment

Aug 15
Subscription Renewal

Aug 18
Project Deadline

Aug 20
Bicycle Maintenance
```

---

# 15. Upcoming Time Range

Default:

```text
Next 7 Days
```

Allow:

```text
7 Days
14 Days
30 Days
```

Avoid loading unlimited future records into the Dashboard.

---

# 16. Task Overview

Display:

```text
Total Active Tasks
Due Today
Overdue
Completed Today
High Priority
```

Example:

```text
Tasks

12 Active
3 Due Today
2 Overdue
5 Completed Today
```

---

# 17. Task Completion Rate

Calculate:

```text
Completed Tasks
-------------------------
Total Tasks for Period
```

Display as a percentage.

Example:

```text
Weekly Completion

78%
```

Do not include cancelled/deleted tasks in completion rate unless the existing task architecture explicitly defines them as completed.

---

# 18. Reminder Overview

Display:

```text
Upcoming Reminders
Overdue Reminders
Completed Reminders
```

Example:

```text
Reminders

4 Upcoming
1 Overdue
```

Clicking should open the relevant Reminder detail.

---

# 19. Calendar Overview

Display:

```text
Today's Events
Next Event
Number of Events Today
Number of Events This Week
```

Do not duplicate the Calendar interface.

The Dashboard provides only a summary.

---

# 20. Goal Overview

Display active goals.

For each selected goal:

```text
Goal Name
Progress
Target
Current Value
Deadline
```

Example:

```text
Buy New Laptop

Rp 8.000.000 / Rp 15.000.000

53%
```

Use the existing Goal system as the source of truth.

---

# 21. Goal Summary

Display:

```text
Active Goals
Completed Goals
Goals Near Deadline
Goals Behind Schedule
```

Do not invent progress data if the Goal system does not provide enough information.

---

# 22. Finance Overview

The Finance Dashboard should summarize:

```text
Income
Expenses
Net Cash Flow
Budget
Savings
```

for the selected period.

Default:

```text
Current Month
```

---

# 23. Finance Period Selector

Allow:

```text
This Week
This Month
Last Month
This Year
Custom Range
```

Do not create another date-range architecture if Finance already has one.

Reuse existing utilities.

---

# 24. Income Summary

Display:

```text
Total Income
```

for the selected period.

Example:

```text
Income

Rp 8.500.000
```

---

# 25. Expense Summary

Display:

```text
Total Expenses
```

for the selected period.

Example:

```text
Expenses

Rp 4.250.000
```

---

# 26. Net Cash Flow

Calculate:

```text
Net Cash Flow =
Income - Expenses
```

Example:

```text
Net Cash Flow

+ Rp 4.250.000
```

Use the existing Finance money representation.

Never use unsafe floating-point arithmetic for monetary values.

---

# 27. Expense Category Breakdown

Display categories such as:

```text
Food
Transport
Education
Entertainment
Shopping
Bills
Subscriptions
Other
```

Use the existing Finance categories.

Example:

```text
Expenses

Food           35%
Transport      15%
Education      20%
Entertainment  10%
Other          20%
```

---

# 28. Finance Trend

Provide a basic time-series chart.

Example:

```text
Daily Expenses
```

or:

```text
Monthly Expenses
```

depending on selected range.

The chart should remain readable on mobile.

---

# 29. Finance Budget Status

If a budget exists:

```text
Budget:
Rp 5.000.000

Spent:
Rp 3.500.000

Remaining:
Rp 1.500.000
```

If no budget exists:

```text
No budget configured.
```

Do not assume a default budget.

---

# 30. Subscription Overview

Display:

```text
Active Subscriptions
Upcoming Renewals
Monthly Recurring Cost
Yearly Recurring Cost
```

Example:

```text
Subscriptions

7 Active

Monthly:
Rp 350.000
```

Use existing Subscription data.

Do not duplicate subscription records.

---

# 31. Upcoming Subscription Renewals

Example:

```text
Coming Up

Netflix
Renews Aug 15

Cloud Storage
Renews Aug 20
```

Clicking should open the subscription detail.

---

# 32. Academic Overview

If Academic data exists, display:

```text
Today's Classes
Upcoming Classes
Upcoming Assignments
Upcoming Exams
Overdue Assignments
```

Example:

```text
Academic

2 Assignments Due Soon
1 Exam This Week
```

If there is no academic data, show a compact empty state.

---

# 33. Academic Deadline Widget

Prioritize:

```text
Overdue
Due Today
Due This Week
Exam Approaching
```

The Dashboard should not reproduce the entire academic module.

---

# 34. Project Overview

Display:

```text
Active Projects
Projects Near Deadline
Overdue Projects
Project Progress
```

Example:

```text
Projects

4 Active

OmniLife
72%

OmniTenant
45%
```

Use existing project data.

---

# 35. Project Progress

If a project has measurable task completion:

```text
Completed Tasks
-------------------------
Total Project Tasks
```

may be used as a progress indicator.

Do not override manually defined project progress if the existing Project system uses another source of truth.

---

# 36. Inventory Overview

Use Phase 20 data.

Display:

```text
Total Active Items
Estimated Current Value
Items Requiring Maintenance
Warranty Expiring Soon
```

Example:

```text
Inventory

124 Items

Estimated Value:
Rp 35.500.000
```

Only include items that qualify as active inventory.

---

# 37. Wishlist Overview

Display:

```text
Wishlist Items
Estimated Total
High Priority Items
Saved For Items
```

Example:

```text
Wishlist

12 Items

Estimated:
Rp 15.500.000
```

Wishlist value is not a Finance expense.

---

# 38. Attention Required Widget

Create a cross-module aggregation.

Potential sources:

```text
Overdue Tasks
Overdue Reminders
Upcoming Deadlines
Upcoming Exams
Expiring Subscriptions
Expiring Warranties
Maintenance Due
Goals Near Deadline
```

Example:

```text
Needs Attention

2 overdue tasks
1 exam in 3 days
1 warranty expires soon
```

This is one of the most important Dashboard widgets.

---

# 39. Attention Priority

Order attention items:

```text
1. Overdue
2. Due Today
3. Due Tomorrow
4. High Priority
5. Upcoming
```

Do not create arbitrary urgency scores unless explicitly required.

---

# 40. Analytics Overview

Create an Analytics section.

Analytics should provide aggregated historical information.

Examples:

```text
Task Completion
Financial Trends
Goal Progress
Academic Performance
Project Progress
Inventory Statistics
Wishlist Statistics
Subscription Spending
```

---

# 41. Analytics Date Range

Support:

```text
7 Days
30 Days
90 Days
6 Months
1 Year
Custom
```

Only show ranges that make sense for the selected metric.

---

# 42. Analytics Categories

Organize analytics into:

```text
Productivity
Finance
Goals
Academic
Projects
Inventory
Subscriptions
```

Do not create separate analytics implementations inside every module.

---

# 43. Productivity Analytics

Include:

```text
Tasks Created
Tasks Completed
Completion Rate
Overdue Tasks
Reminders Completed
```

Optional:

```text
Most Productive Days
```

Only implement if reliable data exists.

---

# 44. Finance Analytics

Include:

```text
Income
Expenses
Net Cash Flow
Expense Categories
Savings
Budget Utilization
```

Optional:

```text
Average Monthly Expense
```

---

# 45. Goal Analytics

Include:

```text
Active Goals
Completed Goals
Average Progress
Goals Near Deadline
```

Avoid fake predictions.

---

# 46. Academic Analytics

If academic data exists:

```text
Assignments Completed
Assignments Pending
Upcoming Exams
Course Progress
```

Do not invent grades or academic performance metrics if the data model does not contain them.

---

# 47. Project Analytics

Include:

```text
Active Projects
Completed Projects
Task Completion
Overdue Project Items
```

---

# 48. Inventory Analytics

Use Phase 20 data.

Include:

```text
Total Active Items
Items by Category
Purchase Value
Estimated Current Value
Items Under Warranty
Maintenance Due
```

---

# 49. Wishlist Analytics

Include:

```text
Total Wishlist Items
Estimated Total Cost
High Priority Value
Purchased Wishlist Items
Cancelled Wishlist Items
```

---

# 50. Subscription Analytics

Include:

```text
Active Subscriptions
Monthly Recurring Cost
Yearly Recurring Cost
Renewals
Subscriptions by Category
```

---

# 51. Cross-Module Correlation

Phase 21 may display simple deterministic relationships.

Examples:

```text
Wishlist
→ Estimated Future Spending

Subscriptions
→ Recurring Expenses

Inventory
→ Estimated Current Assets

Goals
→ Progress

Tasks
→ Productivity
```

Do not create speculative correlations.

---

# 52. No AI Insight Requirement

Do not implement statements such as:

```text
"You are spending too much."
"You should study more."
"You are likely to miss your goal."
"You will run out of money."
```

unless explicitly based on deterministic rules already defined.

AI-powered insights are not part of Phase 21.

---

# 53. Dashboard Widgets

Create a reusable widget architecture.

Conceptually:

```text
DashboardWidget
    │
    ├── Today
    ├── Upcoming
    ├── Tasks
    ├── Reminders
    ├── Goals
    ├── Finance
    ├── Subscriptions
    ├── Academic
    ├── Projects
    ├── Inventory
    └── Wishlist
```

Widgets should be modular.

---

# 54. Widget Configuration

Each widget should have:

```text
id
type
enabled
position
size
configuration
```

Follow the existing storage architecture.

---

# 55. Widget Visibility

Users should be able to hide widgets.

Example:

```text
Dashboard Settings

[x] Today
[x] Tasks
[x] Finance
[x] Goals
[ ] Inventory
[x] Academic
```

Do not remove the underlying feature.

---

# 56. Widget Ordering

Users should be able to change widget order.

Preferred behavior:

```text
Move Up
Move Down
```

or drag-and-drop where appropriate.

Do not make drag-and-drop mandatory on mobile.

---

# 57. Default Dashboard

Provide a sensible default configuration.

Recommended order:

```text
Today
Needs Attention
Upcoming
Tasks
Goals
Finance
Academic
Projects
Subscriptions
Inventory
Wishlist
```

The user may customize it afterward.

---

# 58. Dashboard Persistence

Dashboard preferences must persist across application restarts.

Store:

```text
Widget Visibility
Widget Order
Widget Configuration
```

Do not store duplicated domain data.

---

# 59. Loading States

Every widget must support:

```text
Loading
Loaded
Empty
Error
```

Do not block the entire Dashboard because one widget fails.

---

# 60. Widget Error Isolation

Example:

```text
Finance Widget
ERROR

Tasks Widget
WORKING

Goals Widget
WORKING
```

A failure in Finance must not make the whole Dashboard unusable.

---

# 61. Offline Behavior

Dashboard must work offline.

When offline:

```text
Local data
→ Dashboard
→ Analytics
```

must continue functioning.

No network connection should be required for existing local data.

---

# 62. Data Freshness

When a module changes:

```text
Task Created
Expense Added
Goal Updated
Wishlist Purchased
Inventory Updated
```

the Dashboard should refresh appropriately.

Avoid requiring the user to restart OmniLife.

---

# 63. Refresh Strategy

Use appropriate refresh mechanisms:

```text
Reactive state updates
Event notifications
Provider/state management
Repository invalidation
```

Use whatever state architecture OmniLife already established.

Do not introduce an unrelated state-management architecture.

---

# 64. Analytics Service

Create a centralized analytics aggregation layer.

Conceptually:

```text
DashboardService
      │
      ├── TaskRepository
      ├── ReminderRepository
      ├── CalendarRepository
      ├── GoalRepository
      ├── FinanceRepository
      ├── SubscriptionRepository
      ├── AcademicRepository
      ├── ProjectRepository
      ├── InventoryRepository
      └── WishlistRepository
```

The Dashboard should query through existing domain services/repositories where possible.

---

# 65. Dashboard Data Models

Prefer lightweight view models rather than duplicate database entities.

Examples:

```text
TodaySummary
TaskSummary
FinanceSummary
GoalSummary
InventorySummary
WishlistSummary
SubscriptionSummary
AcademicSummary
ProjectSummary
AttentionItem
AnalyticsDataPoint
```

These are presentation/aggregation models, not persistent domain duplicates unless necessary.

---

# 66. Performance

The Dashboard must not load the entire database unnecessarily.

Use:

```text
Aggregated queries
Filtered queries
Date-limited queries
Indexed fields
Cached summaries where appropriate
```

Avoid:

```text
Load everything
→ Iterate through everything
→ Calculate everything on every rebuild
```

---

# 67. Dashboard Startup

Dashboard startup should remain responsive even when the database grows.

Prioritize loading:

```text
Today
Needs Attention
Upcoming
```

before lower-priority analytics.

---

# 68. Large Dataset Handling

The architecture must remain usable when the user has:

```text
Thousands of Tasks
Thousands of Transactions
Hundreds of Goals
Hundreds of Inventory Items
Hundreds of Calendar Events
```

Do not assume a small dataset.

---

# 69. Charts

Charts must be:

```text
Simple
Readable
Responsive
Accessible
```

Possible charts:

```text
Expense Trend
Income vs Expense
Task Completion
Goal Progress
Expense Category Breakdown
Inventory Category Breakdown
```

Do not add charts simply for decoration.

---

# 70. Chart Accessibility

Never communicate information using color alone.

Example:

Bad:

```text
Red = High
Green = Low
```

Prefer:

```text
High
Low

with labels/icons/values
```

Charts must remain understandable in different themes.

---

# 71. Finance Accuracy

All financial analytics must use:

```text
Existing Finance source of truth
Existing currency representation
Existing transaction rules
```

Never reconstruct financial totals from unrelated Dashboard data.

---

# 72. Date and Time Accuracy

Use the existing OmniLife date/time utilities.

Do not create separate date logic.

Pay attention to:

```text
Today
Tomorrow
This Week
Month Boundaries
Year Boundaries
Timezone
```

---

# 73. Dashboard Search

Do not implement a separate Dashboard search.

Global Search remains the central search system.

---

# 74. Navigation

Every Dashboard item must be actionable when appropriate.

Examples:

```text
Click Task
→ Task Detail

Click Goal
→ Goal Detail

Click Expense
→ Finance Transaction

Click Warranty Alert
→ Inventory Item

Click Assignment
→ Academic Detail
```

Do not create duplicate detail pages.

---

# 75. Quick Add Navigation

After creating an object through Quick Add:

```text
Create
→ Save
→ Dashboard refreshes
```

Do not force unnecessary navigation.

---

# 76. Dashboard Privacy

Dashboard must not expose sensitive information unnecessarily.

For example:

```text
Vault passwords
Private credentials
Secure notes
```

must never appear in Dashboard widgets.

Finance data should follow existing privacy rules.

---

# 77. Secure Vault Rule

Do not display:

```text
Passwords
Authentication Codes
Private Credentials
Secure Vault Content
```

in Dashboard or Analytics.

---

# 78. Empty Data Handling

If a module has no data:

```text
Finance:
No transactions yet.

Goals:
No active goals.

Inventory:
No items yet.
```

Do not show:

```text
0%
Rp 0
N/A
```

without context when a friendly empty state is more appropriate.

---

# 79. Dashboard Customization Philosophy

Customization should not overwhelm the user.

Provide simple controls:

```text
Show / Hide
Reorder
Configure
Reset Dashboard
```

Do not build a full visual page builder.

---

# 80. Reset Dashboard

Provide:

```text
Reset Dashboard Layout
```

with confirmation.

Expected behavior:

```text
Custom Layout
      ↓
Reset
      ↓
Default Layout
```

Domain data must never be deleted.

---

# 81. Dashboard Preferences

Store preferences locally.

Example:

```text
DashboardPreferences

widgetVisibility
widgetOrder
widgetConfigurations
```

Do not mix preferences with domain entities.

---

# 82. Testing — Today

Create:

```text
1 Event
2 Tasks
1 Reminder
```

for the same date.

Expected:

```text
Today
→ Event visible
→ Tasks visible
→ Reminder visible
```

---

# 83. Testing — Overdue

Create:

```text
1 overdue Task
1 overdue Reminder
```

Expected:

```text
Needs Attention
→ 2 items
```

---

# 84. Testing — Finance

Create:

```text
Income:
Rp 8.000.000

Expenses:
Rp 3.000.000
```

Expected:

```text
Income:
Rp 8.000.000

Expenses:
Rp 3.000.000

Net:
Rp 5.000.000
```

---

# 85. Testing — Goals

Create:

```text
Goal:
Buy Laptop

Progress:
50%
```

Expected:

```text
Goals Widget
→ Buy Laptop
→ 50%
```

---

# 86. Testing — Inventory

Create:

```text
10 active items
2 sold items
```

Expected:

```text
Inventory:
10 active items
```

Sold items must remain in history.

---

# 87. Testing — Wishlist

Create:

```text
3 Wishlist Items

Total:
Rp 5.000.000
```

Expected:

```text
Wishlist:
3 Items

Estimated:
Rp 5.000.000
```

No Finance expense should be created.

---

# 88. Testing — Subscription

Create:

```text
3 active subscriptions
```

Expected:

```text
Subscription Widget:
3 Active
```

Monthly recurring cost must match existing Subscription calculations.

---

# 89. Testing — Academic

Create:

```text
1 assignment due tomorrow
1 exam due in 5 days
```

Expected:

```text
Academic Widget
→ Assignment
→ Exam
```

---

# 90. Testing — Project

Create:

```text
Project:
OmniLife

10 tasks
7 completed
```

Expected:

```text
Project Progress:
70%
```

if task completion is the project's defined progress source.

---

# 91. Testing — Widget Visibility

Hide:

```text
Inventory
```

Expected:

```text
Inventory Widget
→ Not visible
```

Inventory data must remain untouched.

---

# 92. Testing — Widget Ordering

Change:

```text
Finance
```

to the first position.

Restart the application.

Expected:

```text
Finance
→ Remains first
```

---

# 93. Testing — Widget Failure

Simulate Finance data loading failure.

Expected:

```text
Finance
→ Error state

Tasks
→ Still functional

Goals
→ Still functional

Dashboard
→ Still usable
```

---

# 94. Testing — Offline

Disable internet.

Verify:

```text
Dashboard
Analytics
Today
Upcoming
Tasks
Goals
Finance
Inventory
Wishlist
```

remain functional with local data.

---

# 95. Testing — Large Dataset

Test with a large dataset.

Verify:

```text
Dashboard remains responsive.
No unnecessary full-database scans.
Charts remain usable.
Scrolling remains smooth.
```

---

# 96. Testing — Regression

Verify all existing modules:

```text
Calendar
Schedule
Notes
Tasks
Recurring Routines
Reminders
Projects
Academic
Knowledge Base
Goals
Finance
Subscriptions
Inventory
Wishlist
Secure Vault
Global Search
```

remain functional.

No regression is acceptable.

---

# 97. Documentation

Create or update:

```text
docs/DASHBOARD_ANALYTICS_ARCHITECTURE.md
```

Document:

```text
Dashboard Architecture
Widget Architecture
Analytics Architecture
Data Aggregation
Dashboard Preferences
Widget State
Performance Strategy
Offline Behavior
Privacy Rules
Navigation Rules
Testing Strategy
```

Update the main OmniLife architecture documentation.

---

# 98. UI Constraints

Do NOT perform the final OmniLife UI/UX overhaul.

Do not:

```text
Redesign Global Navigation
Replace Global Theme
Remove Existing Features
Merge Modules
Implement Final Localization
```

Only build the Dashboard UI required for Phase 21.

The final simplification remains:

```text
Phase 25
```

---

# 99. Future AI Compatibility

Do not implement AI in this phase.

However, structure analytics services so future AI can safely query them.

Future commands may include:

```text
"How much did I spend this month?"

"What do I need to do today?"

"What are my most important tasks?"

"How are my goals progressing?"

"What subscriptions are coming up?"

"What do I need to pay attention to?"
```

Future AI must access read-only aggregation services.

AI must never directly manipulate the database.

---

# 100. Future Cross-Module Integration

Phase 21 should prepare the Dashboard for Phase 22.

Potential future interactions:

```text
Task
↔ Calendar

Goal
↔ Finance

Wishlist
↔ Goal

Inventory
↔ Finance

Subscription
↔ Finance

Academic
↔ Calendar

Project
↔ Tasks
```

Do not implement the full cross-module orchestration yet.

That belongs to:

```text
Phase 22
```

---

# 101. Success Definition

Phase 21 is successful when opening OmniLife gives the user a useful overview of their life without requiring them to manually open every module.

The Dashboard should answer:

```text
What is happening today?

What needs my attention?

What is coming next?

How productive have I been?

How are my finances?

How are my goals progressing?

What academic deadlines are approaching?

What projects are active?

What subscriptions are coming up?

What do I own?

What do I want to buy?
```

---

# 102. Final Dashboard Architecture

The intended architecture is:

```text
                         OMNILIFE
                            │
                            ▼
                       DASHBOARD
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
        TODAY           ATTENTION         UPCOMING
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                            ▼
                     DOMAIN SUMMARIES
                            │
       ┌────────┬──────────┼──────────┬────────┐
       ▼        ▼          ▼          ▼        ▼
     TASKS   FINANCE     GOALS     ACADEMIC PROJECTS
       │        │          │          │        │
       └────────┴──────────┼──────────┴────────┘
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
       SUBSCRIPTIONS    INVENTORY      WISHLIST
             │              │              │
             └──────────────┼──────────────┘
                            ▼
                        ANALYTICS
                            │
                            ▼
                    VISUAL INSIGHTS
```

---

# 103. Architectural Rules

The implementation must follow these rules:

```text
1. Dashboard is an aggregation layer.

2. Existing modules remain the source of truth.

3. Do not duplicate domain data.

4. Do not duplicate Finance calculations.

5. Do not duplicate Goal progress.

6. Do not duplicate Reminder logic.

7. Do not duplicate Calendar logic.

8. Do not expose Secure Vault information.

9. Do not implement AI.

10. Do not implement cloud analytics.

11. Do not require internet.

12. Do not break existing modules.

13. Do not perform the final UI/UX overhaul.

14. Do not implement final localization.

15. Keep the architecture ready for Phase 22.
```

---

# 104. Completion Checklist

Before declaring Phase 21 complete:

- [ ] Dashboard exists
- [ ] Today overview works
- [ ] Upcoming overview works
- [ ] Needs Attention works
- [ ] Task summary works
- [ ] Reminder summary works
- [ ] Calendar summary works
- [ ] Goal summary works
- [ ] Finance summary works
- [ ] Subscription summary works
- [ ] Academic summary works
- [ ] Project summary works
- [ ] Inventory summary works
- [ ] Wishlist summary works
- [ ] Analytics exists
- [ ] Basic charts work
- [ ] Date filters work
- [ ] Widget visibility works
- [ ] Widget ordering works
- [ ] Dashboard preferences persist
- [ ] Empty states work
- [ ] Loading states work
- [ ] Error states are isolated
- [ ] Offline behavior works
- [ ] Navigation to source modules works
- [ ] Finance calculations are accurate
- [ ] Inventory calculations are accurate
- [ ] Wishlist is not counted as spending
- [ ] Secure Vault data is never exposed
- [ ] Large datasets remain performant
- [ ] Mobile layout works
- [ ] Existing modules pass regression testing
- [ ] Documentation updated

---

# 105. Final Implementation Report

When implementation is complete, provide:

```text
OMNILIFE PHASE 21 REPORT

Status:
COMPLETED / PARTIAL / BLOCKED

Dashboard:
- ...

Today:
- ...

Upcoming:
- ...

Needs Attention:
- ...

Tasks:
- ...

Reminders:
- ...

Calendar:
- ...

Goals:
- ...

Finance:
- ...

Subscriptions:
- ...

Academic:
- ...

Projects:
- ...

Inventory:
- ...

Wishlist:
- ...

Analytics:
- ...

Charts:
- ...

Widget Customization:
- ...

Offline:
- ...

Performance:
- ...

Mobile:
- ...

Database Changes:
- ...

Files Created:
- ...

Files Modified:
- ...

Tests:
- Passed: X
- Failed: X

Known Limitations:
- ...

Technical Debt:
- ...

Recommended Next Phase:
- Phase 22 — Cross-Module Integration
```

---

# FINAL PRINCIPLE

Phase 21 should transform OmniLife from:

```text
A collection of useful modules
```

into:

```text
A unified personal command center.
```

The user should not need to think:

```text
"Which module should I open?"
```

Instead:

```text
Open OmniLife
      ↓
See what matters
      ↓
Understand current situation
      ↓
Take action
      ↓
Open the relevant module when necessary
```

The Dashboard should **summarize complexity, not expose complexity**.

Do not remove any existing capability.

Do not implement the final simplification yet.

The major UI/UX simplification and Indonesian/English localization remain scheduled for:

```text
PHASE 25
```

The immediate next phase after this is:

```text
PHASE 22
Cross-Module Integration
```
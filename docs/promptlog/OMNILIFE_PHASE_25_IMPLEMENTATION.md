document id="74163" title="OmniLife Phase 25 — UI/UX Overhaul, Information Architecture & Localization"}
# OMNILIFE — PHASE 25
## UI/UX Overhaul, Information Architecture Simplification & Indonesian/English Localization

**Project:** OmniLife  
**Phase:** 25  
**Previous Phase:** Phase 24 — Mobile, Responsive & Cross-Device Polish  
**Next Phase:** Phase 26 — Final QA & Release Preparation  
**Status:** Major Product Transformation  
**Priority:** CRITICAL

---

# 1. Executive Objective

Phase 25 is a major product-level transformation of OmniLife.

The application has now grown into a comprehensive Personal Life Manager containing many interconnected systems.

The primary problem is no longer:

> "Does OmniLife have enough features?"

The problem is:

> "Can a new user understand and comfortably use OmniLife without feeling overwhelmed?"

Therefore Phase 25 must transform OmniLife from:

```text
A feature-rich personal management application
```

into:

```text
A coherent personal operating system
that feels simple despite having substantial depth.
```

---

# 2. Core Product Principle

The most important rule of this phase:

```text
DO NOT REMOVE FUNCTIONALITY
```

OmniLife must preserve the complete feature set developed in previous phases.

Instead:

```text
Many Features
      ↓
Better Grouping
      ↓
Better Hierarchy
      ↓
Progressive Disclosure
      ↓
Better Navigation
      ↓
Simpler User Experience
```

The application must become **simpler to understand, not less powerful.**

---

# 3. Definition of Success

Phase 25 is successful if a new user can:

1. Open OmniLife.
2. Understand what the application is for within seconds.
3. Understand where their important information lives.
4. Find common actions quickly.
5. Create a task without learning the entire application.
6. Add a calendar event without understanding every module.
7. Record a financial transaction without navigating through complicated menus.
8. Understand the relationship between Tasks, Projects, Goals, Calendar, and Routines.
9. Discover advanced features gradually.
10. Change the application language between Indonesian and English.
11. Use OmniLife comfortably on both desktop and mobile.

At the same time:

```text
Advanced users must still have access to the complete system.
```

---

# 4. Product Philosophy

OmniLife should feel like:

```text
Calm
Personal
Organized
Modern
Reliable
Focused
Intelligent
```

It should NOT feel like:

```text
Enterprise ERP
Accounting software
Database administration panel
Developer dashboard
Feature marketplace
AI-generated UI
```

Avoid excessive visual decoration.

---

# 5. "Not Too AI" Principle

OmniLife must NOT visually resemble an AI-generated application.

Avoid:

```text
Excessive gradients
Generic glassmorphism everywhere
Huge glowing cards
Unnecessary neon effects
Excessive animations
Random decorative icons
AI-style empty dashboards
Overly rounded everything
```

AI may exist as an assistant, but the application itself must feel like a carefully designed human productivity product.

---

# 6. Design Direction

Target aesthetic:

```text
Modern Personal Productivity
+
Premium Utility
+
Calm Information Architecture
+
Subtle Personality
```

Visual references should be conceptually closer to:

```text
Modern productivity applications
Personal knowledge management tools
Calendar / task management software
Finance dashboards
Well-designed mobile utility apps
```

Do not clone another application's interface.

---

# 7. Design System Foundation

Create or consolidate a centralized OmniLife Design System.

The Design System must become the single source of truth for:

```text
Colors
Typography
Spacing
Radius
Elevation
Icons
Buttons
Inputs
Cards
Dialogs
Sheets
Navigation
Lists
Tables
Chips
Badges
Empty States
Loading States
Error States
```

---

# 8. Design Token Architecture

All major visual properties must use centralized tokens.

Conceptual structure:

```text
OmniLife Design Tokens
│
├── Color
├── Typography
├── Spacing
├── Radius
├── Elevation
├── Iconography
├── Motion
├── Component Sizes
└── Breakpoints
```

Do not scatter raw values throughout widgets.

---

# 9. Color System

Create semantic colors rather than assigning arbitrary colors to individual widgets.

Example conceptual categories:

```text
Primary
Secondary
Surface
Background
On Surface
Muted
Border
Success
Warning
Error
Info
```

Module-specific colors may exist where useful, but they must remain subordinate to the global design system.

---

# 10. Dark Mode

If dark mode already exists, normalize it through the design system.

If not fully implemented, prepare the design system so dark mode can be introduced cleanly.

Do not create a second independent color system.

---

# 11. Color Meaning

Colors should have semantic meaning.

Examples:

```text
Success
→ Completed / Positive

Warning
→ Attention required

Error
→ Failure / Dangerous action

Info
→ Neutral informational state

Primary
→ Main interaction
```

Do not use color only for decoration.

---

# 12. Accessibility

Color must never be the only method of communicating information.

For example:

```text
Red dot
```

should not be the only indication of an overdue task.

Use:

```text
Color
+
Icon
+
Text / Context
```

where necessary.

---

# 13. Typography

Create a clear typographic hierarchy.

At minimum define:

```text
Display
Page Title
Section Title
Card Title
Body
Secondary Body
Caption
Label
Button
Numeric / Financial
```

Typography should communicate hierarchy before decorative elements do.

---

# 14. Typography Rules

Avoid:

```text
Too many font sizes
Random font weights
Tiny metadata
Huge titles consuming screen space
```

The interface should remain readable and calm.

---

# 15. Spacing System

Create a consistent spacing scale.

Example concept:

```text
4
8
12
16
20
24
32
40
48
64
```

Do not necessarily use these exact values if an existing system is already established.

The important requirement is consistency.

---

# 16. Border Radius

Create a controlled radius system.

Avoid every element having a different radius.

Possible conceptual tokens:

```text
Small
Medium
Large
Pill
```

---

# 17. Elevation

Avoid excessive shadows.

Use elevation primarily for:

```text
Floating elements
Dialogs
Sheets
Important cards
Navigation layers
```

Flat surfaces should remain visually clean.

---

# 18. Iconography

Use one coherent icon family.

Do not mix unrelated icon styles.

Icons must:

```text
Communicate clearly
Have consistent stroke/weight
Have accessible labels where necessary
```

---

# 19. Navigation Overhaul

This is one of the most important tasks in Phase 25.

The existing navigation must be reviewed and reorganized around **mental models**, not database entities.

Users should not need to think:

> "Which module contains this feature?"

They should think:

> "What am I trying to accomplish?"

---

# 20. Proposed Top-Level Information Architecture

Use the following conceptual structure unless existing implementation evidence strongly indicates a better equivalent:

```text
HOME
│
├── Today
├── Upcoming
├── Quick Actions
└── Personal Overview


PLAN
│
├── Calendar
├── Tasks
├── Projects
├── Routines
└── Reminders


LIFE
│
├── Goals
├── Notes
├── Knowledge
├── Wishlist
└── Inventory


MONEY
│
├── Overview
├── Transactions
├── Budgets
├── Subscriptions
└── Analytics


STUDY
│
├── Courses
├── Assignments
├── Exams
├── Study Notes
└── Academic Calendar


SECURE
│
├── Vault
└── Important Information


SEARCH
│
└── Global Search


SETTINGS
│
├── Appearance
├── Language
├── Notifications
├── Security
├── Backup & Data
└── About
```

This is a conceptual hierarchy.

Adapt naming to the actual implemented modules.

---

# 21. Important Navigation Principle

Do not expose every feature as a first-level navigation destination.

Bad:

```text
Dashboard
Calendar
Tasks
Projects
Goals
Notes
Knowledge
Finance
Transactions
Budgets
Subscriptions
Inventory
Wishlist
Courses
Assignments
Exams
Study Notes
Vault
Analytics
Reminders
Routines
...
```

This creates navigation overload.

Instead:

```text
Home
Plan
Life
Money
Study
Secure
```

with secondary navigation underneath.

---

# 22. Navigation Depth Rule

Avoid excessive nesting.

Target:

```text
Top-level
→ Category
→ Feature
```

rather than:

```text
Top-level
→ Category
→ Subcategory
→ Subcategory
→ Feature
→ Detail
```

Use contextual navigation and search when necessary.

---

# 23. Mobile Navigation

Mobile should expose only the most important top-level destinations.

Recommended:

```text
Home
Plan
Life
Money
More
```

Inside "More":

```text
Study
Secure
Analytics
Knowledge
Settings
Other features
```

Do not permanently expose every module in bottom navigation.

---

# 24. Desktop Navigation

Desktop may expose more navigation because there is more horizontal space.

Recommended:

```text
Home
Plan
Life
Money
Study
Secure

----------------
Search
Settings
```

Navigation can collapse to icon-only mode where appropriate.

---

# 25. "More" Must Not Become a Junk Drawer

If a More menu is used, it must remain organized.

Group items:

```text
Study
Security
Knowledge
Advanced
System
```

Do not put 30 unrelated entries into one list.

---

# 26. Home as Command Center

Home is not simply another dashboard.

It should answer:

```text
What matters today?
What should I do next?
What is coming soon?
How am I doing?
```

---

# 27. Home Priority

The Home screen should prioritize:

```text
1. Today
2. Important Tasks
3. Upcoming Events
4. Reminders
5. Current Goals
6. Finance Snapshot
7. Study Snapshot
8. Other relevant information
```

Do not show every available dataset simultaneously.

---

# 28. Home Personalization

The user should eventually be able to control which widgets appear.

Provide a foundation for:

```text
Show / Hide Widget
Reorder Widget
```

Do not make configuration mandatory.

Default experience should already be excellent.

---

# 29. Quick Actions

The Home screen should provide a clear quick-action mechanism.

Examples:

```text
+ Task
+ Event
+ Note
+ Expense
+ Income
+ Reminder
```

The exact set may be adaptive.

---

# 30. Global Create Action

Consider a unified:

```text
+ Create
```

interaction.

Example:

```text
Create
├── Task
├── Event
├── Reminder
├── Note
├── Expense
├── Income
├── Goal
└── Other
```

This reduces the need to know where a feature lives.

---

# 31. Contextual Creation

Users should also be able to create from context.

Example:

```text
Goal
→ Add Task
```

```text
Calendar
→ Add Event
```

```text
Finance
→ Add Transaction
```

Both approaches should coexist.

---

# 32. Progressive Disclosure

Advanced options should not be shown immediately.

Example:

Basic Task:

```text
Title
Due Date
Priority
```

Advanced:

```text
Project
Goal
Reminder
Recurrence
Dependencies
Metadata
```

Use:

```text
More Options
```

where appropriate.

---

# 33. Progressive Disclosure Principle

The user should see:

```text
What they need now
```

not:

```text
Everything OmniLife knows how to do
```

---

# 34. Feature Discoverability

Simplification must NOT hide features permanently.

Every feature must remain discoverable through at least one logical path.

For example:

```text
Recurring Routine
→ Plan → Routines
```

and potentially:

```text
Home → Quick Action
```

where appropriate.

---

# 35. Search as a Safety Net

Global Search should become a first-class navigation mechanism.

Search should help users find:

```text
Pages
Tasks
Projects
Goals
Notes
Knowledge
Finance records
Academic records
Inventory
Wishlist
Subscriptions
```

---

# 36. Search Intent

Search should not require the user to know the exact module.

For example:

```text
"Calculus"
```

may return:

```text
Course
Note
Assignment
Exam
Task
```

if these entities contain the term.

---

# 37. Search Result Grouping

Results must be grouped logically.

Example:

```text
Calculus

Courses
  Calculus I

Tasks
  Finish calculus worksheet

Notes
  Calculus derivatives

Exams
  Calculus Midterm
```

---

# 38. Breadcrumbs

Use breadcrumbs only when they genuinely help.

Do not clutter simple screens.

Useful for:

```text
Knowledge Base
Deep settings
Complex projects
Nested academic structures
```

---

# 39. Page Structure

Every major page should follow a predictable structure:

```text
Page Header
↓
Context / Summary
↓
Primary Action
↓
Main Content
↓
Secondary Content
```

---

# 40. Page Header

Page headers should communicate:

```text
Where am I?
What can I do here?
```

Avoid enormous decorative titles.

---

# 41. Primary Action

Every major screen should have a visually obvious primary action.

Examples:

```text
Tasks → Add Task
Calendar → Add Event
Finance → Add Transaction
Notes → New Note
Goals → New Goal
```

---

# 42. Secondary Actions

Secondary actions should not compete with the primary action.

Use:

```text
Overflow menu
Text button
Secondary button
Context menu
```

depending on importance.

---

# 43. Cards

Cards should represent meaningful information groups.

Do NOT put every field inside a card.

Use cards for:

```text
Today summary
Goal progress
Finance summary
Upcoming event
Task group
```

---

# 44. List Design

Lists should emphasize:

```text
Primary information
Status
Important metadata
Action
```

Avoid showing every available property.

---

# 45. Detail Screens

Detail screens should separate:

```text
Primary information
Secondary information
Related information
Actions
```

Example:

```text
Task

Title
Status
Due Date

Description

Related Project
Related Goal

More
```

---

# 46. Empty States

Every major module needs a deliberate empty state.

Bad:

```text
No data.
```

Good:

```text
No tasks yet.

Add your first task to start organizing your day.

[Add Task]
```

Empty states should teach users what the module does.

---

# 47. Empty State Rules

Every empty state should answer:

```text
What is this?
Why is it empty?
What can I do next?
```

---

# 48. First-Use Experience

New users should not encounter an empty application with no guidance.

Provide lightweight onboarding.

Do NOT create a long tutorial.

---

# 49. Onboarding

Onboarding should communicate:

```text
OmniLife helps you organize:
Your time
Your tasks
Your goals
Your money
Your studies
Your important information
```

Then allow the user to enter the application quickly.

---

# 50. Onboarding Principle

Avoid:

```text
20-step tutorial
Mandatory feature tour
Long explanations
```

Prefer:

```text
Short introduction
Optional hints
Contextual guidance
```

---

# 51. First Dashboard

The first Home screen should be useful even when no data exists.

Example:

```text
Good morning.

Your day starts here.

[Create your first task]
[Add an event]

Upcoming
Nothing scheduled yet.

Goals
Create your first goal.
```

---

# 52. Contextual Hints

Use hints only when necessary.

Example:

```text
Your first project can organize multiple tasks.
```

Allow dismissal.

Do not repeatedly show the same hint.

---

# 53. Notification Design

Notifications must be meaningful.

Prioritize:

```text
Upcoming deadline
Reminder
Overdue task
Subscription renewal
Important academic event
```

Avoid notification spam.

---

# 54. Status Design

Create consistent status representations.

Examples:

```text
Task
→ Todo / In Progress / Done

Project
→ Active / Completed / Archived

Goal
→ Active / Completed / Paused

Subscription
→ Active / Cancelled

Academic
→ Upcoming / Completed / Overdue
```

Use consistent visual language.

---

# 55. Badges

Badges should be used sparingly.

Good uses:

```text
Overdue
New
Important
Completed
```

Do not decorate every item with badges.

---

# 56. Filters

Filters should be contextual.

Task filters:

```text
Status
Priority
Due Date
Project
```

Finance filters:

```text
Income / Expense
Category
Date
Account
```

Do not expose irrelevant filters.

---

# 57. Sorting

Default sorting should reflect user intent.

Examples:

Tasks:

```text
Urgency / Due Date
```

Transactions:

```text
Newest First
```

Notes:

```text
Recently Updated
```

---

# 58. Tables → Adaptive Views

Wide tables should be transformed into:

```text
Desktop:
Table

Mobile:
Cards / List
```

where appropriate.

Do not simply shrink columns until they become unreadable.

---

# 59. Finance UX Overhaul

Finance must feel approachable.

The user should immediately understand:

```text
Balance
Income
Expenses
Recent Transactions
```

without needing accounting knowledge.

---

# 60. Finance Dashboard

Recommended hierarchy:

```text
Current Balance
↓
Income / Expense Summary
↓
Quick Add Transaction
↓
Recent Transactions
↓
Category Breakdown
↓
Budget / Goals
```

---

# 61. Finance Transaction Creation

Keep the initial form simple.

Primary:

```text
Amount
Income / Expense
Category
Date
```

Secondary:

```text
Description
Account
Related Goal
Related Wishlist
Attachment
Notes
```

---

# 62. Calendar UX Overhaul

Calendar should answer:

```text
What is happening?
When is it happening?
What do I need to do?
```

Avoid turning the calendar into a dense database table.

---

# 63. Calendar Information Density

Use visual indicators for:

```text
Events
Tasks
Reminders
Academic deadlines
```

but avoid filling every date with excessive text.

---

# 64. Tasks UX Overhaul

Tasks should be actionable immediately.

Recommended structure:

```text
Today
Upcoming
Overdue
Completed
All
```

Additional filters remain available.

---

# 65. Projects UX

Projects should communicate:

```text
Purpose
Progress
Tasks
Deadline
Status
```

not just a collection of database fields.

---

# 66. Goals UX

Goals should feel motivating rather than administrative.

Focus on:

```text
Goal
Why
Progress
Target
Deadline
Next Actions
```

---

# 67. Routines UX

Recurring routines should feel different from dated tasks.

Clearly distinguish:

```text
Task:
Something to do on a specific occasion.

Routine:
Something I repeatedly do as part of my life.
```

This distinction must be visible in the UI.

---

# 68. Notes UX

Notes should remain fast.

Do not turn every note into a complicated knowledge management system.

Basic flow:

```text
New Note
→ Write
→ Save
```

Advanced metadata remains optional.

---

# 69. Knowledge Base UX

Knowledge should support deeper organization.

Provide:

```text
Search
Categories
Tags
Related content
```

without making basic note-taking dependent on these features.

---

# 70. Wishlist UX

Wishlist should focus on:

```text
What I want
How much it costs
How important it is
Whether I can afford it
```

Related financial information should be contextual rather than overwhelming.

---

# 71. Inventory UX

Inventory should focus on:

```text
What I own
Where it is
Its status
Important information
```

Advanced metadata can remain behind detail views.

---

# 72. Subscription UX

Subscription management should immediately show:

```text
What
How much
When it renews
How often
```

---

# 73. Academic UX

Academic management must feel like a dedicated study workspace.

Primary concepts:

```text
Semester
Course
Assignment
Exam
Schedule
Study Notes
```

Avoid mixing every academic record into the general task interface.

---

# 74. Secure Vault UX

Secure Vault must be visually distinct from normal notes.

The user should clearly understand:

```text
This information is sensitive.
```

Do not visually imply that normal notes and secure records have identical security characteristics.

---

# 75. Settings UX

Settings should be grouped.

Recommended:

```text
Appearance
├── Theme
├── Display
└── Interface

Language
├── Indonesian
└── English

Notifications
├── Reminders
└── Alerts

Security
├── Vault
└── Lock

Data
├── Backup
├── Import
└── Export

About
├── Version
└── Credits
```

---

# 76. Localization Architecture

Implement proper localization.

Supported languages:

```text
Indonesian
English
```

No other languages are required in Phase 25.

---

# 77. Localization Requirements

Every user-facing string must be localizable.

This includes:

```text
Navigation
Buttons
Dialogs
Errors
Empty states
Tooltips
Notifications
Settings
Validation
Onboarding
Search labels
Accessibility labels
```

---

# 78. No Hard-Coded User Strings

Do not leave:

```text
Text("Add Task")
```

throughout the codebase if the string is user-facing.

Use the project's localization mechanism.

---

# 79. Localization Source of Truth

Create a centralized localization system.

Recommended conceptual structure:

```text
Localization
├── English
└── Indonesian
```

Use the framework's standard localization architecture where possible.

Do not create a custom ad-hoc translation system.

---

# 80. Translation Keys

Keys should be semantic.

Good:

```text
task.add
task.delete
task.completed
finance.addTransaction
settings.language
```

Bad:

```text
text1
button2
string_004
```

---

# 81. Indonesian Language

Use natural Indonesian.

Avoid literal machine translation when it creates unnatural wording.

Example:

Prefer:

```text
Tambah Tugas
```

instead of:

```text
Tambahkan sebuah tugas
```

where concise UI language is more natural.

---

# 82. English Language

Use natural product English.

Avoid overly formal wording.

Example:

```text
Add Task
```

rather than:

```text
Create a Task Entry
```

unless context requires it.

---

# 83. Language Switching

Settings must provide:

```text
Bahasa / Language
```

with:

```text
Indonesia
English
```

The user should be able to switch languages without reinstalling the application.

---

# 84. Language Persistence

The selected language must persist after:

```text
App restart
Device restart
Navigation
```

where applicable.

---

# 85. Language Default

Use the device/system language where appropriate.

If the system language is unsupported:

```text
Fallback:
English
```

unless existing project requirements specify otherwise.

---

# 86. No Mixed Language UI

When Indonesian is selected, avoid:

```text
Tambah Task
Delete Catatan
Settings Pengguna
```

The interface should consistently use Indonesian.

The same principle applies to English.

---

# 87. User Content Must NOT Be Translated

Localization applies to OmniLife's UI.

Do NOT automatically translate:

```text
User Notes
Task Titles
Project Names
Goal Names
Personal Information
Knowledge Base Content
Descriptions
```

These are user-owned content.

---

# 88. Date Localization

Dates should adapt to language and locale.

Example Indonesian:

```text
12 Agustus 2026
```

English:

```text
August 12, 2026
```

Use locale-aware formatting.

---

# 89. Number Localization

Currency and numeric formatting should respect locale where appropriate.

Do not corrupt stored numeric values.

Storage:

```text
Canonical numeric value
```

Presentation:

```text
Localized formatting
```

---

# 90. Currency

The application should distinguish:

```text
Stored financial amount
```

from:

```text
Displayed currency formatting
```

Do not store formatted strings as financial values.

---

# 91. Relative Time

Support natural localized phrases such as:

Indonesian:

```text
Hari ini
Besok
Kemarin
2 hari lagi
```

English:

```text
Today
Tomorrow
Yesterday
In 2 days
```

---

# 92. Pluralization

Do not manually concatenate plural words.

Bad:

```text
"$count task"
```

Use proper localization pluralization.

---

# 93. Text Expansion

English and Indonesian strings may have different lengths.

The layout must tolerate:

```text
English string
→ shorter

Indonesian string
→ potentially longer
```

No fixed-width UI should assume one language's length.

---

# 94. Localization Testing

Every major screen must be tested in:

```text
Indonesian
English
```

Check:

```text
Overflow
Clipping
Button widths
Navigation
Dialogs
Cards
Lists
Empty states
Notifications
```

---

# 95. Translation Completeness

Create a localization audit.

No user-facing text should remain unintentionally untranslated.

Search the codebase for:

```text
Text(
label:
hintText:
tooltip:
SnackBar
Dialog
Error
```

and equivalent UI string sources.

---

# 96. UX Consistency

Every module should follow the same interaction language.

For example, creating an entity should consistently use:

```text
Add
Save
Cancel
Delete
Edit
```

rather than random alternatives.

---

# 97. Destructive Actions

Destructive actions must be visually and behaviorally consistent.

Examples:

```text
Delete
Remove
Reset
Clear
Erase
```

Use confirmation where data loss is significant.

---

# 98. Confirmation Design

Confirmation dialogs should explain:

```text
What will happen
Whether the action is reversible
What the user should choose
```

Avoid:

```text
Are you sure?
```

without context.

---

# 99. Undo

Where safe and technically appropriate, prefer:

```text
Delete
→ Undo
```

over unnecessarily aggressive confirmation dialogs.

Do not use Undo for irreversible or security-sensitive operations unless properly implemented.

---

# 100. Feedback

Every important user action should produce clear feedback.

Examples:

```text
Task created
Transaction saved
Note updated
Goal completed
Backup exported
```

Feedback may use:

```text
Snackbar
Toast
Inline status
Visual state change
```

Do not over-notify.

---

# 101. Loading UX

Use consistent loading behavior across modules.

Do not have:

```text
Spinner in one module
Skeleton in another
Blank screen in another
```

without a deliberate reason.

---

# 102. Error UX

Errors should be:

```text
Human-readable
Actionable
Localized
Non-technical
```

Example:

```text
Could not save the task.
Please try again.
```

Developer details may be logged separately.

---

# 103. Offline UX

Because OmniLife is local-first, offline state should not create unnecessary warnings.

Do not show:

```text
No Internet!
```

for functionality that does not require internet access.

---

# 104. Local-First Identity

The interface should communicate that OmniLife is primarily a personal/local system.

Do not introduce unnecessary:

```text
Account
Login
Cloud
Sync
```

flows unless they already exist in the architecture.

---

# 105. Motion System

Create a small motion language.

Use animation for:

```text
Navigation
State changes
Dialog opening
List updates
Expansion
```

Avoid animation for everything.

---

# 106. Motion Principles

Animations should be:

```text
Fast
Purposeful
Subtle
Consistent
Interruptible
```

Avoid long transitions.

---

# 107. Reduced Motion

Respect accessibility settings where possible.

If reduced motion is enabled:

```text
Reduce
or
Disable
non-essential animations.
```

---

# 108. Microinteractions

Good examples:

```text
Task completion
→ Subtle state transition

Save
→ Immediate feedback

Expand
→ Smooth transition

Navigation
→ Short transition
```

Avoid:

```text
Bouncing buttons
Continuous animations
Decorative particle effects
```

---

# 109. UX Hierarchy

Every screen should have:

```text
Primary
Secondary
Tertiary
```

visual priorities.

If everything looks important:

```text
Nothing looks important.
```

---

# 110. Visual Density

OmniLife contains a large amount of data.

Do not solve this by making everything smaller.

Instead:

```text
Reduce unnecessary information
Group information
Use hierarchy
Use progressive disclosure
Use whitespace strategically
```

---

# 111. Feature Grouping

Features should be grouped according to user intent.

Examples:

```text
Plan:
Calendar
Tasks
Projects
Routines
Reminders

Life:
Goals
Notes
Knowledge
Wishlist
Inventory

Money:
Finance
Subscriptions
Budgets
Analytics

Study:
Courses
Assignments
Exams
Study Notes
```

---

# 112. Relationship Visualization

Where modules are interconnected, show relationships contextually.

Example:

```text
Goal
│
├── Projects
├── Tasks
├── Wishlist
└── Finance
```

Do not force the user to navigate through every module manually.

---

# 113. Related Items

Detail pages should provide a "Related" section when useful.

Examples:

```text
Task
→ Project
→ Goal
→ Calendar
```

```text
Assignment
→ Course
→ Task
→ Calendar
```

---

# 114. Contextual Actions

If an object has a natural next action, expose it.

Example:

```text
Overdue Assignment
→ Complete
→ Reschedule
→ Create Study Session
```

Only show actions that actually exist in the implementation.

Do not fabricate functionality.

---

# 115. Avoid Feature Duplication

Do not create separate interfaces for the same concept.

For example:

```text
Task creation from Calendar
Task creation from Tasks
Task creation from Project
```

should use the same underlying task creation component/service where possible.

---

# 116. Consistent CRUD

All major entities should have predictable:

```text
Create
View
Edit
Delete
Archive
Restore
```

where applicable.

---

# 117. Keyboard Shortcuts

Desktop may expose useful shortcuts.

Potential examples:

```text
N
→ New item

/
→ Search

Esc
→ Close

Ctrl/Cmd + K
→ Quick action / command interface
```

Only implement shortcuts that do not conflict with text input.

---

# 118. Command / Quick Action Interface

If technically appropriate, create a foundation for a command palette.

Example:

```text
Search or command...

> Add task
> Add event
> Open Finance
> Open Calendar
> Search notes
```

This can dramatically improve advanced-user efficiency.

Do not make it mandatory.

---

# 119. Mobile Quick Actions

Mobile should use a touch-friendly equivalent rather than requiring keyboard shortcuts.

---

# 120. Dashboard Personalization

Provide a safe architecture for future customization:

```text
Widget Visibility
Widget Order
```

Store preferences separately from actual user data.

---

# 121. Settings Architecture

Settings must not become a single giant page.

Group by mental model:

```text
Personalization
Notifications
Security
Data
About
```

---

# 122. Appearance Settings

Include where supported:

```text
Theme
System
Light
Dark
```

Do not expose dozens of visual configuration options.

---

# 123. Language Settings

Language must be immediately understandable.

Example:

```text
Language
Bahasa Indonesia
English
```

The selected language must be clearly indicated.

---

# 124. Data Settings

Group:

```text
Backup
Import
Export
Storage
```

---

# 125. Security Settings

Group:

```text
Vault
Lock
Authentication
Security timeout
```

according to existing functionality.

---

# 126. Settings Search

If Settings becomes sufficiently large, provide settings search.

Do not create search merely for a small settings page.

---

# 127. Responsive UX Preservation

All Phase 24 responsive rules must remain intact.

Phase 25 must not regress:

```text
Mobile
Tablet
Desktop
```

layouts.

---

# 128. Design System Refactor

If the current project has inconsistent UI components, refactor them toward shared components.

Examples:

```text
OmniButton
OmniCard
OmniInput
OmniDialog
OmniSheet
OmniSection
OmniListTile
OmniEmptyState
OmniBadge
OmniPageHeader
```

Use naming consistent with the actual codebase.

Do not create duplicates if equivalent components already exist.

---

# 129. Component API Consistency

Shared components should have predictable APIs.

Avoid components where every module passes unrelated styling overrides.

---

# 130. Theme Architecture

Centralize:

```text
Light Theme
Dark Theme
Typography
Component Themes
```

---

# 131. No One-Off Styling

Avoid:

```text
Widget-specific random colors
Random padding
Random radius
Random font sizes
```

unless the component genuinely requires an exception.

---

# 132. UI Refactoring Rule

During refactoring:

```text
Preserve business logic
Preserve data
Preserve APIs
Preserve repositories
Preserve services
Preserve integrations
```

Change presentation first.

---

# 133. Architecture Boundary

Target:

```text
                 OMNILIFE
                    │
        ┌───────────┴───────────┐
        │                       │
      CORE                  PRESENTATION
        │                       │
 ┌──────┼──────┐        ┌───────┼────────┐
 │      │      │        │       │        │
Data  Domain Services Desktop Mobile Localization
 │      │      │        │       │        │
 └──────┴──────┴────────┴───────┴────────┘
```

Localization must belong to presentation/application infrastructure, not domain data.

---

# 134. User Data Separation

Never translate or alter stored user data simply because the UI language changes.

Example:

```text
Stored:
"Workout Senin"

Language = English

UI:
Monday

Stored user content:
"Workout Senin"
```

remains unchanged.

---

# 135. Database Integrity

Phase 25 must not require destructive database migrations merely for UI changes.

If localization metadata is required, use a safe migration.

---

# 136. Existing Data Regression

All existing user data must remain visible after the UI overhaul.

Verify:

```text
Tasks
Calendar
Notes
Projects
Goals
Finance
Academic
Vault
Wishlist
Inventory
Subscriptions
```

---

# 137. Migration Safety

Before major structural changes:

```text
Backup existing local database
```

Never perform destructive migrations without a recovery path.

---

# 138. No Mock Data

Do not replace real data with placeholder/demo data during UI implementation.

UI testing may use temporary fixtures, but production behavior must use actual repositories.

---

# 139. No Fake Functionality

Do not create buttons that look functional but do nothing.

Every visible action must:

```text
Work
or
Be clearly marked as unavailable / future functionality
```

---

# 140. No Feature Loss

After refactoring, compare the complete feature inventory from previous phases.

Every feature must remain reachable.

---

# 141. Feature Accessibility Audit

Create a matrix:

```text
Feature
Top-level location
Secondary location
Searchable?
Quick Action?
Mobile accessible?
Desktop accessible?
```

This becomes the definitive navigation audit.

---

# 142. UX Flow Audit

Test common user goals.

Scenario 1:

```text
"I want to remember something."
```

Expected:

```text
Quick Add
→ Note / Reminder
```

Scenario 2:

```text
"I need to do something tomorrow."
```

Expected:

```text
Task
→ Due Date
```

Scenario 3:

```text
"I have an exam next week."
```

Expected:

```text
Academic / Calendar
→ Exam
→ Optional Task / Reminder
```

Scenario 4:

```text
"I bought something."
```

Expected:

```text
Finance
→ Expense
→ Category
```

Scenario 5:

```text
"I want to work toward something."
```

Expected:

```text
Goal
→ Goal
→ Projects / Tasks
```

---

# 143. New User Test

Simulate a user who has never seen OmniLife.

Without explanation, test whether they can:

```text
Find Calendar
Create Task
Create Note
Record Expense
Create Goal
Find Settings
Change Language
Find Vault
Search for an item
```

If users repeatedly hesitate, improve navigation rather than adding instructions.

---

# 144. Five-Second Rule

Within approximately five seconds of opening OmniLife, the user should understand:

```text
Where they are
What matters today
How to perform a common action
```

---

# 145. Three-Click Rule

Do not obsess over an absolute click count, but common actions should generally be reachable quickly.

Target:

```text
Home
→ Quick Action
→ Create
```

or:

```text
Home
→ Relevant Section
→ Create
```

---

# 146. Complexity Budget

Every screen has a complexity budget.

If a screen contains too many:

```text
Buttons
Cards
Filters
Badges
Sections
```

reduce visible information.

Move secondary information into:

```text
Details
More
Expand
Secondary screens
```

---

# 147. Cognitive Load Rule

Do not force the user to remember:

```text
Which module contains X?
Which screen contains Y?
Which button creates Z?
```

The interface should communicate these relationships.

---

# 148. Information Architecture Deliverable

Create:

```text
docs/OMNILIFE_INFORMATION_ARCHITECTURE.md
```

It must document:

```text
Top-Level Navigation
Module Grouping
Feature Locations
Quick Actions
Search
Mobile Navigation
Desktop Navigation
Relationships
```

---

# 149. Design System Deliverable

Create or update:

```text
docs/OMNILIFE_DESIGN_SYSTEM.md
```

Document:

```text
Colors
Typography
Spacing
Radius
Elevation
Icons
Components
States
Responsive Rules
Accessibility
Motion
```

---

# 150. Localization Deliverable

Create or update:

```text
docs/OMNILIFE_LOCALIZATION.md
```

Document:

```text
Supported Languages
Localization Architecture
Translation Key Rules
Date Formatting
Number Formatting
Currency Formatting
Pluralization
Language Persistence
Testing
```

---

# 151. UX Audit Deliverable

Create:

```text
docs/OMNILIFE_UX_AUDIT_PHASE_25.md
```

Include:

```text
Previous UX Problems
Identified Complexity
Navigation Changes
Feature Grouping
Before / After Concept
Mobile Changes
Desktop Changes
Remaining Issues
```

---

# 152. UI Consistency Audit

Audit every major module for:

```text
Page Header
Primary Action
Secondary Actions
Cards
Lists
Forms
Dialogs
Empty States
Loading
Errors
Feedback
```

---

# 153. Localization Audit

Verify:

```text
Indonesian
English
```

for every screen.

Create a list of missing translation keys if any remain.

---

# 154. Accessibility Audit

Check:

```text
Contrast
Touch targets
Keyboard navigation
Semantic labels
Focus states
Text scaling
Reduced motion
```

---

# 155. Responsive Regression Audit

Repeat Phase 24 test matrix.

Minimum:

```text
Android small phone
Android medium phone
Android large phone
Android tablet
Windows 1280×720
Windows 1366×768
Windows 1920×1080
```

---

# 156. Performance Audit

Phase 25 must not significantly degrade performance.

Verify:

```text
Startup
Navigation
Scrolling
Search
Calendar
Finance
Large lists
Dashboard
Database operations
```

---

# 157. Visual QA

Every major screen must be manually inspected.

Look for:

```text
Alignment
Spacing
Typography
Hierarchy
Overflow
Inconsistent colors
Inconsistent radius
Inconsistent buttons
Inconsistent icons
```

---

# 158. UX QA

Do not only ask:

```text
Does it work?
```

Also ask:

```text
Is it obvious?
Is it fast?
Is it comfortable?
Is it understandable?
Is the next action clear?
```

---

# 159. Final UI Quality Standard

The application must look intentional.

There should be no obvious:

```text
Placeholder components
Random styling
Inconsistent terminology
Duplicate patterns
Unfinished screens
Broken empty states
Debug UI
Developer labels
```

---

# 160. Localization Quality Standard

There should be no:

```text
English text inside Indonesian UI
Indonesian text inside English UI
Machine-like translations
Untranslated error messages
Broken date formatting
Broken pluralization
```

---

# 161. Terminology Dictionary

Create a consistent terminology mapping.

Example:

| Concept | Indonesian | English |
|---|---|---|
| Task | Tugas | Task |
| Project | Proyek | Project |
| Goal | Tujuan | Goal |
| Reminder | Pengingat | Reminder |
| Routine | Rutinitas | Routine |
| Calendar | Kalender | Calendar |
| Note | Catatan | Note |
| Finance | Keuangan | Finance |
| Transaction | Transaksi | Transaction |
| Subscription | Langganan | Subscription |
| Wishlist | Daftar Keinginan | Wishlist |
| Inventory | Inventaris | Inventory |
| Course | Mata Kuliah | Course |
| Assignment | Tugas Kuliah | Assignment |
| Exam | Ujian | Exam |
| Vault | Brankas | Vault |
| Settings | Pengaturan | Settings |

This is a starting terminology guide.

Adapt terms if the existing application context makes another translation more natural.

---

# 162. Terminology Consistency

Once a term is selected, use it consistently.

Do not alternate:

```text
Task
To-do
Todo
To Do
```

unless these intentionally represent different concepts.

---

# 163. User-Facing Naming

Names should be understandable to ordinary users.

Avoid technical names such as:

```text
Entity
Repository
Record
Relation
Metadata
```

unless they genuinely belong in the user interface.

---

# 164. Advanced Information

Technical information may remain available in:

```text
Advanced
About
Diagnostics
Developer options
```

but should not dominate the normal experience.

---

# 165. Final Navigation Proposal

The target navigation should approximately feel like:

```text
OMNILIFE

HOME
  Today
  Upcoming
  Overview

PLAN
  Calendar
  Tasks
  Projects
  Routines
  Reminders

LIFE
  Goals
  Notes
  Knowledge
  Wishlist
  Inventory

MONEY
  Overview
  Transactions
  Budgets
  Subscriptions
  Analytics

STUDY
  Courses
  Assignments
  Exams
  Study Notes

SECURE
  Vault
  Important Information

-----------------------

SEARCH

SETTINGS
```

The actual implementation may adapt this hierarchy based on existing features.

---

# 166. Mobile Navigation Proposal

Target:

```text
HOME
PLAN
LIFE
MONEY
MORE
```

More:

```text
Study
Secure
Knowledge
Analytics
Settings
Other
```

---

# 167. Desktop Navigation Proposal

Target:

```text
Home
Plan
Life
Money
Study
Secure

Search
Settings
```

Use expandable groups where appropriate.

---

# 168. Command Center Concept

The application should feel like:

```text
                    OMNILIFE
                       │
             ┌─────────┴─────────┐
             │                   │
           TODAY              LIFE
             │                   │
       What matters?       What am I building?
             │                   │
       What next?           What do I own?
             │                   │
             └─────────┬─────────┘
                       │
                     MONEY
                       │
                  STUDY
                       │
                    SECURE
```

OmniLife is not merely a collection of modules.

It is a connected representation of the user's life.

---

# 169. Cross-Module UX

Make relationships visible without forcing them.

Example:

```text
Goal
  ↓
Project
  ↓
Task
  ↓
Calendar
  ↓
Reminder
```

Another:

```text
Wishlist
  ↓
Purchase
  ↓
Finance
  ↓
Inventory
```

Another:

```text
Course
  ↓
Assignment
  ↓
Task
  ↓
Calendar
  ↓
Reminder
```

---

# 170. "One Action, Multiple Systems"

OmniLife should eventually allow one action to connect multiple systems.

Example:

```text
Create Assignment

Automatically available relationships:
Course
Deadline
Task
Calendar
Reminder
```

Do not force duplicate manual entry where the architecture already supports relationships.

---

# 171. Avoid Over-Automation

Do not automatically create excessive records without user intent.

For example:

Creating a note should NOT automatically create:

```text
Task
Reminder
Calendar Event
Goal
```

unless explicitly requested.

---

# 172. Smart Defaults

Use sensible defaults.

Examples:

```text
New Task
→ Default status = Todo

New Transaction
→ Date = Today

New Note
→ Date = Today

New Reminder
→ Date = Today
```

Defaults should reduce friction but remain editable.

---

# 173. User Control

Automation must never remove user control.

Every automatic behavior should be:

```text
Predictable
Reversible where appropriate
Visible
```

---

# 174. Final UI Review

Before completion, review OmniLife as if it were a commercial product.

Ask:

```text
Would a stranger understand this?
Would a student understand this?
Would a non-technical user understand this?
Would the interface still feel comfortable after months of use?
```

---

# 175. No "AI Slop" Standard

Before completion, remove visual patterns that make the application feel automatically generated.

Specifically inspect:

```text
Overuse of cards
Overuse of rounded corners
Overuse of gradients
Overuse of icons
Excessive whitespace
Excessive animations
Redundant dashboard widgets
Repeated labels
Generic empty states
```

The UI should feel curated.

---

# 176. Final Phase 25 Checklist

## Information Architecture

- [ ] Navigation hierarchy redesigned
- [ ] Features grouped logically
- [ ] Navigation overload reduced
- [ ] Mobile navigation simplified
- [ ] Desktop navigation optimized
- [ ] Search integrated into navigation
- [ ] Feature accessibility audit completed
- [ ] Cross-module relationships remain discoverable

## Design System

- [ ] Design tokens centralized
- [ ] Colors standardized
- [ ] Typography standardized
- [ ] Spacing standardized
- [ ] Radius standardized
- [ ] Elevation standardized
- [ ] Icons standardized
- [ ] Buttons standardized
- [ ] Inputs standardized
- [ ] Cards standardized
- [ ] Dialogs standardized
- [ ] Empty states standardized
- [ ] Loading states standardized
- [ ] Error states standardized
- [ ] Motion standardized

## UX

- [ ] Home redesigned
- [ ] Quick actions improved
- [ ] Progressive disclosure implemented
- [ ] Empty states improved
- [ ] First-use experience improved
- [ ] Task UX improved
- [ ] Calendar UX improved
- [ ] Project UX improved
- [ ] Goal UX improved
- [ ] Routine UX improved
- [ ] Notes UX improved
- [ ] Knowledge UX improved
- [ ] Finance UX improved
- [ ] Subscription UX improved
- [ ] Wishlist UX improved
- [ ] Inventory UX improved
- [ ] Academic UX improved
- [ ] Secure Vault UX improved
- [ ] Settings UX improved
- [ ] Search UX improved

## Localization

- [ ] Indonesian implemented
- [ ] English implemented
- [ ] Language switch implemented
- [ ] Language persistence implemented
- [ ] User-facing strings externalized
- [ ] Translation keys standardized
- [ ] Date localization implemented
- [ ] Number localization implemented
- [ ] Currency formatting reviewed
- [ ] Pluralization reviewed
- [ ] No mixed-language UI
- [ ] User content remains unchanged
- [ ] Localization documentation created

## Responsive

- [ ] Mobile verified
- [ ] Tablet verified
- [ ] Desktop verified
- [ ] Portrait verified
- [ ] Landscape verified
- [ ] Phase 24 behavior preserved
- [ ] No overflow
- [ ] No clipping
- [ ] No broken dialogs
- [ ] Keyboard handling preserved

## Accessibility

- [ ] Touch targets reviewed
- [ ] Contrast reviewed
- [ ] Keyboard navigation reviewed
- [ ] Focus states reviewed
- [ ] Semantic labels reviewed
- [ ] Text scaling reviewed
- [ ] Reduced motion reviewed

## Data Safety

- [ ] Existing data preserved
- [ ] No destructive migration
- [ ] Backup tested
- [ ] Import tested
- [ ] Export tested
- [ ] Secure Vault preserved
- [ ] No mock data in production
- [ ] No feature removed

## Quality

- [ ] Flutter analyze passes
- [ ] Flutter tests pass
- [ ] Windows build passes
- [ ] Android build passes
- [ ] No critical runtime errors
- [ ] No obvious UI inconsistencies
- [ ] No obvious unfinished screens
- [ ] Performance regression reviewed
- [ ] Final UX audit completed

---

# 177. Required Documentation

At minimum create/update:

```text
docs/OMNILIFE_INFORMATION_ARCHITECTURE.md
docs/OMNILIFE_DESIGN_SYSTEM.md
docs/OMNILIFE_LOCALIZATION.md
docs/OMNILIFE_UX_AUDIT_PHASE_25.md
```

---

# 178. Required Implementation Report

When Phase 25 is complete, provide:

```text
OMNILIFE PHASE 25 REPORT

Status:
COMPLETED / PARTIAL / BLOCKED

Executive Summary:
...

Information Architecture:
...

Navigation:
...

Home:
...

Design System:
...

Responsive UI:
...

Localization:
...

Indonesian:
...

English:
...

Search:
...

Quick Actions:
...

Task UX:
...

Calendar UX:
...

Finance UX:
...

Academic UX:
...

Secure Vault UX:
...

Other Modules:
...

Accessibility:
...

Performance:
...

Data Safety:
...

Tests:
Passed:
Failed:

Known Issues:
...

Technical Debt:
...

Files Created:
...

Files Modified:
...

Screens / Modules Reviewed:
...

Recommended Next Phase:
Phase 26 — Final QA & Release Preparation
```

---

# 179. Definition of Done

Phase 25 is complete only when all of the following are true:

```text
OmniLife is easier to understand
        +
OmniLife is easier to navigate
        +
OmniLife looks visually consistent
        +
OmniLife feels intentional
        +
OmniLife supports Indonesian
        +
OmniLife supports English
        +
OmniLife works on mobile
        +
OmniLife works on desktop
        +
ALL EXISTING FEATURES REMAIN AVAILABLE
        +
ALL EXISTING DATA REMAINS SAFE
```

---

# 180. Final Product Principle

The final result must follow this principle:

```text
                OMNILIFE
                   │
        ┌──────────┴──────────┐
        │                     │
     SIMPLE                 POWERFUL
        │                     │
        └──────────┬──────────┘
                   │
              OMNILIFE UX
                   │
       ┌───────────┼───────────┐
       │           │           │
      PLAN        LIFE        MONEY
       │           │           │
     STUDY      SECURE      ANALYTICS
                   │
                   ▼
             ONE CONNECTED
              PERSONAL SYSTEM
```

The application must **look simple at first glance while remaining powerful underneath.**

A new user should not need to understand the architecture of OmniLife.

They only need to understand:

```text
What do I need to do?
Where is my information?
What matters today?
What should I do next?
```

Everything else should progressively reveal itself as the user becomes more familiar with the application.

---

# 181. CRITICAL INSTRUCTION TO IMPLEMENTATION AGENT

Do not rush Phase 25.

This is a major UX transformation.

Before changing code:

1. Inspect the entire existing UI.
2. Inspect the existing navigation.
3. Inspect all existing modules.
4. Inspect the current design system.
5. Inspect the existing localization state.
6. Inspect the responsive implementation from Phase 24.
7. Inspect the existing data architecture.
8. Build an inventory of existing screens and features.
9. Identify duplicated UI patterns.
10. Identify navigation overload.
11. Identify confusing terminology.
12. Identify inconsistent components.
13. Identify localization gaps.
14. Identify mobile/desktop inconsistencies.
15. Then implement the redesign.

Do NOT blindly replace the UI based only on this document.

This document defines the **target product principles and architecture**.

The existing codebase remains the source of truth for what functionality actually exists.

---

# 182. CRITICAL SAFETY RULE

Before major refactoring:

```text
BACKUP
→ ANALYZE
→ PLAN
→ IMPLEMENT
→ TEST
→ VERIFY
```

Never:

```text
DELETE
→ REBUILD
→ HOPE
```

No existing feature, user data, database table, repository, integration, or business logic may be removed simply because it is inconvenient to redesign.

---

# 183. Final Acceptance Standard

Do not declare Phase 25 complete merely because:

```text
flutter analyze
```

passes.

Technical correctness is necessary but insufficient.

Phase 25 requires:

```text
Technical QA
+
Visual QA
+
UX QA
+
Responsive QA
+
Localization QA
+
Accessibility QA
+
Regression QA
```

Only when all seven areas are acceptable may Phase 25 be marked:

```text
COMPLETED
```

---

# 184. Phase Boundary

Do not begin Phase 26 until Phase 25 has been manually reviewed.

Phase 26 will focus on:

```text
FINAL QA
REGRESSION TESTING
DATA SAFETY
BUILD VALIDATION
RELEASE PREPARATION
```

Phase 25 is the final major **product experience transformation**.

After this phase, OmniLife should no longer feel like:

> "A project where we kept adding features."

It should feel like:

> **"A complete personal life management system that was designed as one product from the beginning."**

# END OF OMNILIFE PHASE 25
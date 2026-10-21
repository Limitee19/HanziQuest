document id="74136" title="OmniLife Phase 22 — Cross-Module Integration System"
# OMNILIFE — PHASE 22
## Cross-Module Integration System

**Project:** OmniLife  
**Phase:** 22  
**Previous Phase:** Phase 21 — Dashboard & Analytics System  
**Next Phase:** Phase 23 — Backup / Import / Export  
**Status:** Implementation Phase

---

# 1. Objective

Implement the **OmniLife Cross-Module Integration System**.

The goal of this phase is to connect existing OmniLife modules so that information entered in one module can meaningfully interact with other modules.

OmniLife should evolve from:

```text
Independent Personal Modules
```

into:

```text
Connected Personal Life Management System
```

The user should not have to manually duplicate the same information across multiple modules.

---

# 2. Core Principle

Cross-module integration must use:

```text
Relationships
References
Events
Shared Services
Domain Integration
```

and must NOT rely on:

```text
Duplicate Data
Duplicate Entities
Duplicate Business Logic
Manual Synchronization
```

---

# 3. Existing Modules

The integration system must account for the existing OmniLife modules:

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
Dashboard
Analytics
Global Search
```

Only integrate modules that actually exist in the current codebase.

Do not invent modules that have not been implemented.

---

# 4. Architectural Principle

Existing modules remain the source of truth.

Example:

```text
Task
→ Task module owns Task data

Goal
→ Goal module owns Goal data

Finance Transaction
→ Finance module owns Transaction data

Wishlist Item
→ Wishlist module owns Wishlist data

Inventory Item
→ Inventory module owns Inventory data

Calendar Event
→ Calendar module owns Event data
```

Cross-module relationships should reference these entities.

---

# 5. Integration Layer

Create a dedicated conceptual integration layer:

```text
                   OmniLife
                       │
                       ▼
              Integration Layer
                       │
       ┌───────────────┼───────────────┐
       │               │               │
       ▼               ▼               ▼
 Relationships      Events         Services
       │               │               │
       └───────────────┼───────────────┘
                       ▼
                 Existing Modules
```

The exact implementation should follow the current OmniLife architecture.

Do not introduce a completely unrelated architectural pattern.

---

# 6. Integration Types

Support these integration types:

```text
Reference Integration
Event Integration
Creation Integration
Navigation Integration
Display Integration
Aggregation Integration
Dependency Integration
```

---

# 7. Reference Integration

A module should be able to reference another module's entity.

Example:

```text
Goal
→ linked Wishlist Item
```

or:

```text
Project
→ linked Tasks
```

The referenced entity remains owned by its original module.

---

# 8. Event Integration

When an important event occurs in one module, other modules may react.

Examples:

```text
Task Completed
→ Dashboard updates

Expense Added
→ Finance Analytics updates

Subscription Renewed
→ Finance updates

Assignment Created
→ Dashboard updates

Wishlist Item Purchased
→ Wishlist updates
→ Finance may receive a transaction
```

Events must be deterministic.

---

# 9. Creation Integration

One module may offer a shortcut to create an entity in another module.

Example:

```text
Academic Assignment
→ Create Task
```

or:

```text
Goal
→ Add Wishlist Item
```

The user should not have to manually copy information.

---

# 10. Navigation Integration

Every cross-module reference should provide navigation.

Example:

```text
Goal
→ Linked Wishlist Item
→ Open Wishlist Detail
```

and:

```text
Task
→ Source Project
→ Open Project Detail
```

---

# 11. Display Integration

Related information may be shown inside another module.

Example:

```text
Goal Detail

Progress
Target
Deadline

Linked Wishlist:
Laptop
```

Do not embed the entire other module.

Display a compact related-data section.

---

# 12. Aggregation Integration

Dashboard and Analytics should consume cross-module relationships.

Example:

```text
Project
→ Tasks
→ Completion %

Goal
→ Linked Tasks
→ Progress

Subscription
→ Finance
→ Recurring Expense
```

Avoid recalculating data differently in every module.

---

# 13. Relationship Model

Where appropriate, use lightweight relationship references.

Conceptual structure:

```text
EntityRelationship

id
sourceEntityType
sourceEntityId
targetEntityType
targetEntityId
relationshipType
createdAt
metadata
```

Do not implement this exact model if the existing architecture already has a better relationship mechanism.

The principle is what matters.

---

# 14. Relationship Types

Possible relationships include:

```text
Project → Task
Goal → Task
Goal → Wishlist
Goal → Finance Transaction
Academic Course → Assignment
Academic Assignment → Task
Academic Exam → Reminder
Subscription → Finance Transaction
Inventory Item → Finance Transaction
Wishlist Item → Finance Transaction
Calendar Event → Task
Calendar Event → Project
Calendar Event → Academic Item
```

Only implement relationships that make semantic sense.

---

# 15. Relationship Ownership

Relationships must not change entity ownership.

Example:

```text
Goal
owns Goal

Wishlist
owns Wishlist Item

Integration Layer
owns relationship
```

The Integration Layer must not become a replacement for domain repositories.

---

# 16. Project ↔ Tasks

Projects should integrate with Tasks.

A project should be able to contain or reference tasks.

Example:

```text
Project:
OmniLife

Tasks:
- Implement Dashboard
- Implement Analytics
- Test Finance
```

---

# 17. Project Progress

Where appropriate:

```text
Project Progress =
Completed Project Tasks
/
Total Project Tasks
```

Use the existing Project progress model if one already exists.

Do not override manually defined project progress without respecting its architecture.

---

# 18. Project Task Creation

Inside a Project:

```text
Add Task
```

should create a Task associated with that Project.

The Task remains a normal Task and must still appear in the main Task module.

---

# 19. Task Source

A Task may optionally display:

```text
Project:
OmniLife
```

or:

```text
Goal:
Buy Laptop
```

or:

```text
Academic:
Mathematics Assignment
```

The user should understand where the Task originated.

---

# 20. Task ↔ Calendar

Tasks may optionally have:

```text
Due Date
Scheduled Date
Start Time
End Time
```

Where appropriate, these should integrate with Calendar.

Do not automatically convert every Task into a full Calendar Event unless the existing design explicitly defines that behavior.

---

# 21. Task Calendar Representation

A Task with scheduling information may appear in Calendar as:

```text
Task
```

rather than becoming a duplicated Calendar Event.

Prefer a shared reference/view model where possible.

---

# 22. Task ↔ Reminder

Allow users to create a Reminder from a Task.

Example:

```text
Task:
Submit Assignment

[Add Reminder]

Reminder:
"Submit Assignment"
```

The Reminder should optionally reference the Task.

---

# 23. Reminder Completion

Do not automatically complete a Task when its Reminder is dismissed unless explicitly configured.

Default behavior:

```text
Reminder Completed
≠
Task Completed
```

This prevents accidental state changes.

---

# 24. Goal ↔ Tasks

Goals should be able to reference Tasks.

Example:

```text
Goal:
Learn Mandarin

Tasks:
- Study vocabulary
- Practice listening
- Review HSK material
```

Task completion may be used as progress only if the Goal architecture supports task-based progress.

---

# 25. Goal ↔ Wishlist

Goals may reference Wishlist items.

Example:

```text
Goal:
Save for New Laptop

Wishlist:
MacBook / Laptop
```

The relationship should make the intention clear.

---

# 26. Goal ↔ Finance

Goals may optionally reference financial progress.

Example:

```text
Goal:
Buy Laptop

Target:
Rp 15.000.000

Current:
Rp 8.000.000
```

The implementation must NOT automatically interpret every transaction as goal progress.

Only transactions explicitly associated with a Goal should count.

---

# 27. Goal Funding

If supported by the existing Finance model:

```text
Transaction
→ Linked Goal
```

Then:

```text
Goal Progress
← Associated Transactions
```

This should be optional.

---

# 28. Wishlist ↔ Finance

Wishlist should integrate with Finance when an item is purchased.

Example:

```text
Wishlist:
Mechanical Keyboard

Status:
Purchased
```

Optionally:

```text
Purchase Price:
Rp 1.500.000

Finance Transaction:
Expense
Category:
Shopping
```

---

# 29. Wishlist Purchase Rule

Do not automatically create a financial transaction without user intent.

Preferred behavior:

```text
Mark as Purchased

→ Ask:

"Add this purchase to Finance?"

[Cancel]
[Add Expense]
```

The user remains in control.

---

# 30. Wishlist ↔ Goal

A Wishlist item may optionally have:

```text
Linked Goal
```

Example:

```text
Wishlist:
Gaming PC

Linked Goal:
Save Rp 20.000.000
```

---

# 31. Inventory ↔ Finance

When an Inventory item is purchased, it may optionally create a Finance transaction.

Example:

```text
Add Inventory Item

Name:
Keyboard

Purchase Price:
Rp 1.500.000

[ ] Add purchase to Finance
```

If enabled:

```text
Inventory Item
+
Finance Expense
```

---

# 32. Inventory Purchase History

Inventory should preserve:

```text
Purchase Date
Purchase Price
Vendor
Warranty
```

where supported by the existing Inventory model.

The Finance transaction should reference the Inventory item when possible.

---

# 33. Inventory ↔ Maintenance

Inventory items with maintenance requirements should integrate with:

```text
Reminders
Tasks
Calendar
```

Example:

```text
Laptop

Maintenance:
Clean fan every 6 months
```

The user can create:

```text
Recurring Reminder
```

or:

```text
Recurring Task
```

without duplicating the inventory record.

---

# 34. Inventory Warranty

Warranty expiration may integrate with:

```text
Reminder
Calendar
Dashboard
```

Example:

```text
Warranty expires:
September 30

Create Reminder:
September 15
```

---

# 35. Subscription ↔ Finance

Subscriptions should integrate with Finance.

Example:

```text
Netflix

Monthly:
Rp 186.000

Category:
Entertainment
```

The system should support recurring financial records where the existing Finance architecture allows it.

---

# 36. Subscription Renewal

At renewal:

```text
Subscription
→ Renewal Event
→ Finance Transaction
```

Do not create duplicate transactions.

The architecture must prevent repeated processing.

---

# 37. Subscription ↔ Reminder

Subscriptions may optionally generate renewal reminders.

Example:

```text
Subscription renews:
August 30

Reminder:
August 27
```

The user should be able to configure reminder timing.

---

# 38. Academic ↔ Tasks

Academic items should integrate with Tasks.

Example:

```text
Assignment:
Calculus Homework

[Create Task]

Task:
Complete Calculus Homework
Due:
Friday
```

The Task should reference the Academic source.

---

# 39. Academic ↔ Calendar

Academic schedules should integrate with Calendar.

Examples:

```text
Class
Exam
Assignment Deadline
Presentation
Academic Event
```

Do not duplicate the underlying academic record.

---

# 40. Academic ↔ Reminder

Allow reminders for:

```text
Assignment Deadline
Exam
Presentation
Important Academic Event
```

Example:

```text
Exam:
Calculus

Exam Date:
Friday

Reminder:
3 days before
```

---

# 41. Academic ↔ Projects

For larger academic work:

```text
Academic Assignment
→ Project
```

Example:

```text
Assignment:
Final Research Paper

Project:
Research Paper Project
```

This relationship should be optional.

---

# 42. Project ↔ Calendar

Projects may expose important dates:

```text
Project Deadline
Milestone
Meeting
Presentation
```

inside Calendar.

Do not duplicate project data into Calendar.

---

# 43. Calendar as a Unified View

Calendar should be able to display relevant information from:

```text
Calendar Events
Tasks
Academic
Projects
Reminders
Goals
Inventory Maintenance
Subscriptions
```

only when those entities contain meaningful dates.

---

# 44. Calendar Source Labels

Integrated items should have a recognizable source.

Example:

```text
[Task] Submit Assignment
[Exam] Mathematics
[Project] OmniLife Milestone
[Reminder] Pay Subscription
```

Do not rely on color alone.

---

# 45. Recurring Routines ↔ Tasks

Recurring routines may generate tasks where appropriate.

Example:

```text
Monday

Workout:
Chest + Triceps
```

The system may optionally produce:

```text
Task:
Workout — Chest + Triceps
```

However, routines should remain distinct from normal one-time Tasks.

---

# 46. Recurring Routines ↔ Calendar

Routine schedules may optionally appear on Calendar.

Example:

```text
Monday
Workout

Wednesday
Workout

Friday
Workout
```

The routine remains the source of truth.

---

# 47. Recurring Routines ↔ Reminder

Routine reminders may be supported.

Example:

```text
Every Monday 18:00

Reminder:
Workout
```

Do not create thousands of permanent reminder entities unnecessarily.

Use recurrence rules where possible.

---

# 48. Notes ↔ Other Modules

Notes should support optional links to other entities.

Example:

```text
Note:
Laptop Research

Linked:
Wishlist Item
Laptop
```

Possible links:

```text
Task
Project
Goal
Academic
Finance
Inventory
Wishlist
Calendar
```

---

# 49. Knowledge Base ↔ Modules

Knowledge Base entries may optionally reference:

```text
Project
Academic Course
Goal
Task
Note
```

Example:

```text
Knowledge:
Flutter Architecture

Related Project:
OmniLife
```

This is a reference, not duplicate content.

---

# 50. Notes and Knowledge Base

Do not merge Notes and Knowledge Base.

They have different purposes.

```text
Notes
→ Quick / contextual information

Knowledge Base
→ Structured / reusable knowledge
```

Cross-linking is preferred over merging.

---

# 51. Global Search Integration

Global Search must understand cross-module relationships.

Example search:

```text
"OmniLife"
```

may return:

```text
Project
Tasks
Notes
Knowledge Base
Goals
Calendar items
```

Results must indicate their source module.

---

# 52. Search Result Relationships

Example:

```text
OmniLife

Project
OmniLife

Task
Implement Dashboard

Note
Dashboard Ideas

Knowledge
Flutter Architecture
```

Do not flatten all entities into indistinguishable results.

---

# 53. Dashboard Integration

The Dashboard from Phase 21 must automatically consume the new relationships.

Examples:

```text
Goal
→ linked Tasks

Project
→ task progress

Subscription
→ upcoming Finance event

Inventory
→ warranty reminder

Wishlist
→ financial goal
```

No separate Dashboard-specific duplicate data.

---

# 54. Analytics Integration

Analytics should respect relationships.

Example:

```text
Project Task Completion
Goal Task Progress
Subscription Expense
Inventory Purchase Expense
Wishlist Purchase Expense
```

Avoid counting the same transaction twice.

---

# 55. Double-Counting Protection

Critical rule:

If:

```text
Inventory Item
→ Finance Transaction
```

then the transaction must be counted once in Finance.

The Inventory value itself must not be treated as another expense.

Similarly:

```text
Wishlist Purchase
→ Finance Transaction
```

must not create another independent expense.

---

# 56. Transaction Linking

Where supported, use:

```text
FinanceTransaction
    linkedEntityType
    linkedEntityId
```

or the existing relationship architecture.

Possible sources:

```text
Inventory
Wishlist
Subscription
Goal
```

---

# 57. Integration Events

Create a consistent event mechanism where necessary.

Conceptual events:

```text
TaskCreated
TaskCompleted
TaskDeleted

GoalUpdated
GoalCompleted

WishlistPurchased
WishlistDeleted

InventoryAdded
InventoryUpdated
InventoryMaintenanceDue

SubscriptionCreated
SubscriptionRenewed

AssignmentCreated
AssignmentCompleted

ProjectTaskAdded
ProjectCompleted
```

Only implement events needed by the current architecture.

---

# 58. Event Rules

Events should be:

```text
Deterministic
Idempotent
Traceable
Local
Testable
```

Avoid hidden side effects.

---

# 59. Idempotency

If an event is processed twice:

```text
SubscriptionRenewed
```

it must not create two Finance transactions.

The system should detect whether the associated action has already occurred.

---

# 60. User Control

Cross-module automation must not silently create surprising data.

Whenever an action creates another entity, provide an explicit setting or user choice when appropriate.

Examples:

```text
Add purchase to Finance?
Create Reminder?
Create Task?
Link to Goal?
```

---

# 61. Integration Preferences

Where useful, allow settings such as:

```text
Automatically add subscription renewals to Finance
Ask before adding purchases to Finance
Show tasks in Calendar
Show routines in Calendar
Show academic deadlines in Calendar
```

Defaults should be conservative.

---

# 62. Automatic vs Manual Integration

Use this rule:

```text
Read-only display
→ Automatic

Safe aggregation
→ Automatic

Navigation
→ Automatic

Potentially destructive action
→ User confirmation

Financial record creation
→ Explicit user control

Entity deletion
→ Never automatic
```

---

# 63. Deletion Rules

Deleting one entity must not unexpectedly delete related entities.

Example:

```text
Delete Goal
```

should not automatically delete:

```text
Tasks
Wishlist
Transactions
Notes
```

Instead:

```text
Relationship
→ Removed

Referenced Entity
→ Preserved
```

unless the existing domain explicitly defines cascading deletion.

---

# 64. Archive Rules

If an entity supports archiving:

```text
Archive Project
```

its Tasks should remain accessible unless the Project architecture explicitly defines another behavior.

---

# 65. Orphaned Relationships

The system must gracefully handle:

```text
Referenced entity deleted
```

Example:

```text
Task
→ Project ID
```

but Project no longer exists.

Expected:

```text
Task remains valid.
Relationship is removed or marked unresolved.
No crash.
```

---

# 66. Relationship Cleanup

When deleting an entity:

```text
Delete Entity
→ Find relationships
→ Remove relationships
→ Preserve unrelated entities
```

Do not leave broken references.

---

# 67. Cross-Module Detail UI

Detail pages may contain:

```text
Related
Linked
Source
Created From
Used By
```

sections.

Example:

```text
Goal: Buy Laptop

Related
────────────
Wishlist
Laptop

Finance
3 linked transactions

Tasks
2 active tasks
```

Keep the UI compact.

---

# 68. Quick Create

Provide contextual creation shortcuts.

Examples:

```text
Goal
→ Add Task

Academic Assignment
→ Create Task

Inventory
→ Add Maintenance Reminder

Subscription
→ Add Renewal Reminder

Wishlist
→ Create Goal
```

---

# 69. Quick Create Metadata

When creating an entity through another module, automatically prefill safe metadata.

Example:

```text
Academic Assignment:
Calculus Homework

Create Task

Task title:
Calculus Homework

Due date:
Assignment due date
```

The user can edit before saving.

---

# 70. No Silent Data Mutation

Never silently modify existing data because of a cross-module action.

Example:

Do not:

```text
Mark Reminder Complete
→ Automatically mark Task complete
```

unless explicitly configured.

---

# 71. Cross-Module Validation

Every relationship must validate:

```text
Source exists
Target exists
Relationship type is valid
No duplicate relationship
No invalid self-reference
```

---

# 72. Duplicate Relationship Prevention

Prevent:

```text
Goal A
→ Task B
```

from being linked twice.

The relationship layer should enforce uniqueness where appropriate.

---

# 73. Circular Relationship Safety

The system must tolerate:

```text
Goal
→ Project
→ Task
→ Goal
```

without infinite recursion.

Cross-module display must use safe traversal.

---

# 74. Integration Depth

Do not recursively load unlimited related entities.

Preferred:

```text
Detail
→ Direct relationships

User clicks
→ Related entity

Related entity
→ Its own relationships
```

Avoid rendering the entire graph at once.

---

# 75. Integration Graph

Conceptually:

```text
                    GOAL
                   /    \
                  /      \
              TASK      WISHLIST
               │           │
               │           ▼
               │         FINANCE
               │
               ▼
             PROJECT
               │
               ▼
            CALENDAR
```

The system should support connected data without turning the UI into a graph visualization.

---

# 76. Integration Service

Create or extend a service responsible for:

```text
Create Relationship
Remove Relationship
Get Related Entities
Get Entity Relationships
Validate Relationship
Handle Integration Events
```

Use the existing repository/service architecture.

---

# 77. Repository Rules

Do not allow UI components to directly manipulate unrelated repositories.

Bad:

```text
GoalScreen
→ directly modifies FinanceDatabase
```

Preferred:

```text
GoalScreen
→ GoalService
→ IntegrationService
→ FinanceService
```

where appropriate.

---

# 78. Transaction Safety

When an operation creates multiple pieces of data:

```text
Inventory Item
+
Finance Transaction
+
Relationship
```

the operation should be atomic where the storage architecture supports transactions.

If one part fails, avoid leaving corrupted partial state.

---

# 79. Example — Wishlist Purchase

Preferred flow:

```text
Wishlist
    │
    ▼
Mark Purchased
    │
    ▼
Purchase Dialog
    │
    ├── Price
    ├── Date
    └── Add to Finance?
             │
             ▼
         Confirmation
             │
       ┌─────┴─────┐
       ▼           ▼
     No            Yes
       │           │
       │           ▼
       │      Finance Expense
       │           │
       └─────┬─────┘
             ▼
        Wishlist Updated
             │
             ▼
        Dashboard Refresh
```

---

# 80. Example — Academic Assignment

Preferred flow:

```text
Academic Assignment
        │
        ▼
Create Task
        │
        ▼
Prefilled Task
        │
        ▼
User confirms
        │
        ▼
Task Created
        │
        ▼
Linked to Assignment
        │
        ▼
Dashboard + Calendar update
```

---

# 81. Example — Subscription

Preferred flow:

```text
Subscription
      │
      ├── Renewal Date
      │
      ├── Reminder
      │
      └── Finance Integration
```

The user should be able to control whether each integration is active.

---

# 82. Example — Inventory Maintenance

Preferred flow:

```text
Inventory Item
      │
      ▼
Maintenance Schedule
      │
      ▼
Recurring Reminder / Task
      │
      ▼
Calendar
      │
      ▼
Dashboard
```

---

# 83. Example — Project

Preferred flow:

```text
Project
   │
   ├── Tasks
   │
   ├── Deadline
   │
   └── Calendar
```

Completing Tasks updates Project progress where configured.

---

# 84. Notifications

Do not create a new notification system unless necessary.

Use the existing Reminder/notification architecture.

Cross-module integration should produce Reminder records or notification events through existing systems.

---

# 85. Security

Cross-module integration must respect Secure Vault boundaries.

Never allow:

```text
Vault
→ Dashboard
Vault
→ Search
Vault
→ Analytics
Vault
→ Cross-module summaries
```

unless an explicitly authorized secure flow exists.

---

# 86. Privacy

Sensitive Finance information should only appear where Finance data is already authorized.

Cross-module links should expose only the minimum useful information.

---

# 87. Performance

Avoid N+1 queries.

Bad:

```text
Load 100 Tasks
→ Query Project for each Task
```

Preferred:

```text
Load Tasks
→ Batch-load relationships
→ Resolve related entities efficiently
```

---

# 88. Caching

Use caching only where it is useful.

Do not cache data in ways that cause stale relationships.

After mutation:

```text
Create
Update
Delete
```

invalidate affected summaries.

---

# 89. Dashboard Refresh

After cross-module actions:

```text
Task Created
→ Dashboard refresh

Expense Created
→ Finance widget refresh

Goal Updated
→ Goal widget refresh

Wishlist Purchased
→ Wishlist + Finance refresh
```

Do not require application restart.

---

# 90. Search Refresh

After cross-module entity creation/update:

```text
Global Search
→ Reflect updated entity
```

No stale search results after normal mutation.

---

# 91. Analytics Refresh

After financial or productivity changes:

```text
Analytics
→ Recalculate affected metrics
```

Do not recalculate unrelated metrics unnecessarily.

---

# 92. Testing — Project ↔ Tasks

Create:

```text
Project A
3 Tasks
```

Complete:

```text
2 Tasks
```

Expected:

```text
Project
→ Shows 2/3 completion
```

if task completion defines project progress.

---

# 93. Testing — Academic ↔ Task

Create:

```text
Assignment A
```

Create Task from it.

Expected:

```text
Academic
→ Assignment exists

Tasks
→ Task exists

Task
→ References Assignment
```

No duplicate assignment is created.

---

# 94. Testing — Wishlist ↔ Finance

Purchase a Wishlist item.

Select:

```text
Add to Finance
```

Expected:

```text
Wishlist
→ Purchased

Finance
→ One expense

Relationship
→ Exists
```

---

# 95. Testing — Wishlist Without Finance

Purchase a Wishlist item.

Select:

```text
Do not add to Finance
```

Expected:

```text
Wishlist
→ Purchased

Finance
→ No transaction created
```

---

# 96. Testing — Inventory ↔ Finance

Create an Inventory item with:

```text
Purchase Price
```

Enable:

```text
Add to Finance
```

Expected:

```text
Inventory
→ Item created

Finance
→ One expense
```

No duplicate expense.

---

# 97. Testing — Subscription ↔ Finance

Create:

```text
Monthly Subscription
```

Process renewal.

Expected:

```text
Subscription
→ Renewal recorded

Finance
→ One corresponding transaction
```

Processing the same renewal again must not duplicate the transaction.

---

# 98. Testing — Warranty

Create:

```text
Inventory Item
Warranty Expiration
```

Create reminder.

Expected:

```text
Inventory
→ Warranty visible

Reminder
→ Linked to Inventory

Dashboard
→ Attention item when approaching
```

---

# 99. Testing — Goal ↔ Task

Create:

```text
Goal
3 linked Tasks
```

Complete one Task.

Expected:

```text
Goal
→ Relationship remains valid

Task
→ Completed

Dashboard
→ Updated
```

Do not automatically mark Goal completed.

---

# 100. Testing — Deletion

Create:

```text
Goal
Task
Wishlist
```

Link them.

Delete Goal.

Expected:

```text
Goal
→ Deleted

Task
→ Preserved

Wishlist
→ Preserved

Relationships
→ Cleaned
```

---

# 101. Testing — Broken Relationship

Create a relationship.

Delete target entity through its own module.

Expected:

```text
Source entity
→ Still functional

Broken relationship
→ Removed / safely ignored

Application
→ No crash
```

---

# 102. Testing — Duplicate Relationship

Attempt to link:

```text
Goal A
→ Task B
```

twice.

Expected:

```text
Only one relationship exists.
```

---

# 103. Testing — Circular Relationship

Create:

```text
Goal
→ Project
→ Task
→ Goal
```

Expected:

```text
No infinite loop
No stack overflow
No UI freeze
```

---

# 104. Testing — Offline

Disable network.

Verify:

```text
Relationships
Quick Create
Dashboard
Calendar Integration
Task Integration
Finance Integration
Goal Integration
Inventory Integration
Wishlist Integration
```

continue to work with local data.

---

# 105. Testing — Regression

Verify all existing modules remain functional:

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
Dashboard
Analytics
Global Search
```

No regression is acceptable.

---

# 106. Documentation

Create or update:

```text
docs/CROSS_MODULE_INTEGRATION_ARCHITECTURE.md
```

Document:

```text
Integration Architecture
Relationship Model
Event Model
Cross-Module Rules
Ownership Rules
Deletion Rules
Financial Integration
Calendar Integration
Academic Integration
Project Integration
Goal Integration
Inventory Integration
Wishlist Integration
Subscription Integration
Performance Strategy
Testing Strategy
```

Update the main OmniLife architecture documentation.

---

# 107. UI Constraints

Do not perform the final UI/UX overhaul in this phase.

Do not:

```text
Replace Global Navigation
Redesign All Screens
Remove Modules
Merge Modules
Implement Final Localization
```

Only add the UI elements required to expose cross-module relationships.

The final simplification remains:

```text
Phase 25
```

---

# 108. Future AI Compatibility

Do not implement AI behavior in this phase.

However, the integration architecture should eventually allow the AI Assistant to safely perform actions such as:

```text
Create Task
Create Reminder
Link Task to Project
Create Goal
Link Wishlist to Goal
Create Expense
Create Inventory Item
Create Academic Task
```

Future AI must interact through application services.

Never allow AI to directly modify database tables.

---

# 109. Future Mobile Compatibility

Cross-module integrations must work on:

```text
Desktop
Mobile
```

Do not implement desktop-only interactions.

Avoid requiring:

```text
Hover
Right-click
Large screens
Drag-only interactions
```

for critical functionality.

---

# 110. Success Definition

Phase 22 is successful when OmniLife no longer feels like a collection of unrelated modules.

The user should be able to move naturally between:

```text
Goal
→ Task
→ Project
→ Calendar
→ Reminder
→ Dashboard
```

and:

```text
Wishlist
→ Goal
→ Finance
```

and:

```text
Inventory
→ Finance
→ Warranty
→ Reminder
```

and:

```text
Academic
→ Assignment
→ Task
→ Calendar
→ Reminder
```

without manually duplicating information.

---

# 111. Final Integration Architecture

The intended architecture:

```text
                           OMNILIFE
                              │
                              ▼
                    CROSS-MODULE LAYER
                              │
       ┌──────────────────────┼──────────────────────┐
       │                      │                      │
       ▼                      ▼                      ▼
 RELATIONSHIPS             EVENTS               SERVICES
       │                      │                      │
       └──────────────────────┼──────────────────────┘
                              │
                              ▼
                     EXISTING MODULES
                              │
 ┌─────────┬────────┬────────┼────────┬────────┬─────────┐
 ▼         ▼        ▼        ▼        ▼        ▼         ▼
Tasks    Goals   Projects  Finance  Academic Inventory Wishlist
 │         │        │        │        │        │         │
 └─────────┴────────┴────────┼────────┴────────┴─────────┘
                              │
                 ┌────────────┴────────────┐
                 ▼                         ▼
              Calendar                  Dashboard
                 │                         │
                 └────────────┬────────────┘
                              ▼
                           Analytics
```

---

# 112. Architectural Rules

The implementation must follow these rules:

```text
1. Existing modules remain the source of truth.

2. Integration Layer owns relationships and orchestration only.

3. Never duplicate domain entities.

4. Never duplicate financial transactions.

5. Never silently create financial records without appropriate user control.

6. Never silently delete related entities.

7. Relationships must be safe from orphan references.

8. Relationships must prevent accidental duplicates.

9. Cross-module events must be idempotent.

10. Cross-module actions must be testable.

11. Circular relationships must not cause infinite recursion.

12. Secure Vault remains isolated.

13. Dashboard consumes integration data but does not own it.

14. Analytics consumes integration data but does not own it.

15. Global Search must understand relationships.

16. All integrations must remain local-first.

17. No internet connection should be required.

18. Do not implement AI.

19. Do not perform final UI/UX overhaul.

20. Do not implement final localization.

21. Keep architecture ready for Phase 23.
```

---

# 113. Completion Checklist

Before declaring Phase 22 complete:

- [ ] Integration layer implemented
- [ ] Relationship system implemented or extended
- [ ] Relationship validation works
- [ ] Duplicate relationship protection works
- [ ] Orphan relationship protection works
- [ ] Project ↔ Tasks works
- [ ] Task ↔ Calendar works where applicable
- [ ] Task ↔ Reminder works
- [ ] Goal ↔ Tasks works
- [ ] Goal ↔ Wishlist works
- [ ] Goal ↔ Finance works where configured
- [ ] Wishlist ↔ Finance works
- [ ] Inventory ↔ Finance works
- [ ] Inventory ↔ Reminder works
- [ ] Inventory ↔ Calendar works where applicable
- [ ] Subscription ↔ Finance works
- [ ] Subscription ↔ Reminder works
- [ ] Academic ↔ Tasks works
- [ ] Academic ↔ Calendar works
- [ ] Academic ↔ Reminder works
- [ ] Academic ↔ Projects works where applicable
- [ ] Project ↔ Calendar works where applicable
- [ ] Recurring Routine integrations work where applicable
- [ ] Notes can reference relevant entities
- [ ] Knowledge Base can reference relevant entities
- [ ] Global Search recognizes related entities
- [ ] Dashboard recognizes cross-module relationships
- [ ] Analytics recognizes cross-module relationships
- [ ] Deletion rules work
- [ ] No accidental cascading deletion
- [ ] Idempotency works
- [ ] Financial double-counting prevented
- [ ] Circular relationship safety tested
- [ ] Offline behavior works
- [ ] Mobile interaction works
- [ ] Regression testing passes
- [ ] Documentation updated

---

# 114. Final Implementation Report

When implementation is complete, provide:

```text
OMNILIFE PHASE 22 REPORT

Status:
COMPLETED / PARTIAL / BLOCKED

Integration Layer:
- ...

Relationships:
- ...

Project ↔ Tasks:
- ...

Task ↔ Calendar:
- ...

Task ↔ Reminder:
- ...

Goal Integrations:
- ...

Wishlist Integrations:
- ...

Inventory Integrations:
- ...

Subscription Integrations:
- ...

Academic Integrations:
- ...

Project Integrations:
- ...

Routine Integrations:
- ...

Notes / Knowledge Base:
- ...

Global Search:
- ...

Dashboard:
- ...

Analytics:
- ...

Financial Double-Counting Protection:
- ...

Deletion Safety:
- ...

Idempotency:
- ...

Offline:
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
- Phase 23 — Backup / Import / Export
```

---

# FINAL PRINCIPLE

Phase 22 should transform OmniLife from:

```text
Many modules
```

into:

```text
One connected personal system.
```

The user should be able to enter information once and reuse that information throughout OmniLife.

The target experience:

```text
                    ONE PIECE OF DATA
                           │
                           ▼
                     ORIGINAL MODULE
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
          Related       Calendar      Dashboard
          Modules                       │
             │                          ▼
             └────────────────────── Analytics
```

The system should feel connected without feeling complicated.

**Integrate the modules.**

**Do not merge their responsibilities.**

**Do not duplicate their data.**

**Do not hide automatic side effects.**

**Preserve user control.**

The next phase after successful completion is:

```text
PHASE 23
Backup / Import / Export
```
# OmniLife — Phase 4 Implementation Specification

**Project:** OmniLife  
**Phase:** 4 — Personal Management  
**Status:** Ready for Implementation  
**Implementation Agent:** Antigravity  
**Scope:** Phase 4 only

---

# 1. PURPOSE

Phase 1 established Core Life Management.

Phase 2 established Productivity & Life Organization.

Phase 3 established College & Academic Management.

Phase 4 expands OmniLife into **Personal Management**.

The purpose is to allow OmniLife to manage important areas of personal life beyond tasks, projects, and academics.

The main systems introduced in this phase are:

```text
Personal Finance
Subscriptions
Wishlist
Personal Inventory
Important Information
Documents / References
```

The resulting conceptual structure becomes:

```text
                         OMNILIFE
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   PRODUCTIVITY         ACADEMIC          PERSONAL
        │                   │                   │
 Projects              Courses          Finance
 Goals                 Exams            Subscriptions
 Tasks                 Grades           Wishlist
 Notes                 Assignments      Inventory
 Knowledge             Study            Important Info
 Timeline                               Documents
```

---

# 2. IMPORTANT IMPLEMENTATION RULE

This document defines **Phase 4 only**.

Do NOT implement future phases.

Do NOT implement:

```text
Secure Password Vault
Advanced Security / Encryption
AI Assistant
AI Financial Advisor
Cloud Sync
Multi-user
Public Platform
Cross-device Account Sync
Advanced Analytics
```

These belong to future phases.

Phase 4 may prepare architecture for them but must not implement them as complete systems.

---

# 3. SOURCE OF TRUTH

Before implementation:

1. Inspect the current OmniLife workspace.
2. Read the existing architecture documentation.
3. Read Phase 1 implementation report.
4. Read Phase 2 implementation report.
5. Read Phase 3 implementation report.
6. Inspect the actual codebase.
7. Inspect the current persistence layer.
8. Inspect the existing design system.
9. Inspect the current navigation.
10. Understand existing relationships between entities.

The current codebase is the source of truth.

Do not blindly recreate existing functionality.

---

# 4. PHASE 4 PRODUCT GOAL

At the end of Phase 4, OmniLife should help the user answer:

```text
How much money do I have?

Where does my money go?

What subscriptions am I paying for?

What do I want to buy?

What personal items do I own?

Where did I store important information?

What important documents do I have?

What recurring financial commitments do I have?
```

The system should remain personal, understandable, and practical.

It should NOT become a professional accounting application.

---

# 5. FEATURE 1 — PERSONAL FINANCE

Implement a personal finance management system.

The core purpose:

```text
Income
+
Expenses
+
Accounts
+
Categories
+
Transactions
=
Personal Financial Overview
```

---

# 6. FINANCIAL ACCOUNTS

Implement financial accounts / wallets.

Examples:

```text
Cash
Bank Account
Digital Wallet
Savings
Other
```

A user should be able to define their own accounts.

Example:

```text
Cash
Bank
Digital Wallet
Savings
```

---

# 7. ACCOUNT PROPERTIES

At minimum:

```text
Account Name
Account Type
Current Balance
Currency
Created Date
Status
```

Optional:

```text
Description
Icon
Visual Identifier
```

Suggested account types:

```text
Cash
Bank
E-Wallet
Savings
Other
```

Do not hard-code the system so that new account types cannot be added later.

---

# 8. ACCOUNT BALANCE PRINCIPLE

Avoid allowing the user to manually edit balances in a way that breaks transaction history.

Prefer:

```text
Initial Balance
+
Income
-
Expenses
+
Transfers
=
Calculated Balance
```

A manual balance adjustment may exist as a controlled adjustment transaction if necessary.

The system must avoid:

```text
Transaction history says:
Rp 500.000

Account manually says:
Rp 2.000.000

```

without explanation.

---

# 9. FEATURE 2 — TRANSACTIONS

Implement transaction management.

Transaction types:

```text
Income
Expense
Transfer
Adjustment
```

---

# 10. TRANSACTION PROPERTIES

At minimum:

```text
Amount
Type
Account
Category
Date
Description
Created Date
```

Optional:

```text
Note
Attachment Reference
Related Goal
Related Project
```

Do not implement actual document attachments yet unless the existing architecture already supports them safely.

---

# 11. EXPENSE EXAMPLE

Example:

```text
Expense

Amount:
Rp 25.000

Account:
Digital Wallet

Category:
Food

Date:
August 11

Description:
Lunch
```

The transaction must immediately affect the calculated account balance.

---

# 12. INCOME EXAMPLE

Example:

```text
Income

Amount:
Rp 1.500.000

Account:
Bank

Category:
Freelance

Date:
August 10
```

The transaction increases the associated account balance.

---

# 13. TRANSFERS

Transfers are important.

Example:

```text
Bank
Rp 500.000
       ↓
Digital Wallet
Rp 500.000
```

This must NOT be counted as:

```text
Income + Rp 500.000
Expense + Rp 500.000
```

It is a movement of money between the user's own accounts.

Represent transfers properly.

---

# 14. TRANSACTION CATEGORIES

Provide categories for organizing spending.

Initial recommended categories:

```text
Food
Transport
Education
Entertainment
Shopping
Health
Bills
Subscriptions
Technology
Personal
Other
```

Income categories:

```text
Salary
Freelance
Business
Gift
Allowance
Investment
Other
```

The category system should be extensible.

---

# 15. CUSTOM CATEGORIES

Users should eventually be able to create their own categories.

Example:

```text
Food
 ├── Meals
 ├── Snacks
 └── Coffee
```

However, do not overcomplicate category hierarchy in Phase 4.

A flat category system with optional parent/category metadata is sufficient.

---

# 16. TRANSACTION HISTORY

Provide a chronological transaction list.

Example:

```text
AUGUST 11

- Rp 25.000
  Food
  Digital Wallet

+ Rp 100.000
  Freelance
  Bank

- Rp 15.000
  Transport
  Cash
```

Transactions must be filterable.

---

# 17. TRANSACTION FILTERS

At minimum:

```text
Date
Account
Transaction Type
Category
```

Optional:

```text
Amount range
```

Do not build an advanced financial query engine.

---

# 18. TRANSACTION SEARCH

Users should be able to search transaction descriptions and relevant metadata.

Example:

```text
Search:
Coffee
```

Results:

```text
Aug 10
Rp 20.000
Food / Coffee

Aug 05
Rp 25.000
Food / Coffee
```

---

# 19. MONTHLY FINANCIAL OVERVIEW

Create a simple monthly overview.

Example:

```text
AUGUST 2026

Income
Rp 2.500.000

Expenses
Rp 1.350.000

Net
+ Rp 1.150.000
```

Do not call this "profit" unless the financial model actually represents business accounting.

Use:

```text
Net Cash Flow
```

or similar personal-finance terminology.

---

# 20. EXPENSE BREAKDOWN

Show spending by category.

Example:

```text
AUGUST

Food          Rp 400.000
Transport     Rp 200.000
Education     Rp 150.000
Entertainment Rp 100.000
Other         Rp 500.000
```

The user should quickly understand where money is going.

---

# 21. FINANCIAL TRENDS

Provide basic trends.

Example:

```text
July
Expenses: Rp 1.200.000

August
Expenses: Rp 1.350.000
```

Keep analytics simple.

Do NOT implement sophisticated financial forecasting yet.

---

# 22. FINANCE DASHBOARD

Create a finance overview.

Conceptually:

```text
PERSONAL FINANCE

Total Balance
Rp 3.500.000

This Month
Income      +Rp 2.500.000
Expenses    -Rp 1.350.000
Net         +Rp 1.150.000

Accounts
Bank        Rp 2.000.000
Cash        Rp 500.000
E-Wallet    Rp 1.000.000

Top Spending
Food
Transport
Education
```

The dashboard should remain actionable rather than becoming a giant analytics screen.

---

# 23. FEATURE 3 — BUDGETING

Implement a basic budgeting foundation.

Users should be able to define a spending budget.

Example:

```text
Food
Monthly Budget:
Rp 500.000

Spent:
Rp 350.000

Remaining:
Rp 150.000
```

---

# 24. BUDGET TYPES

At minimum:

```text
Monthly Category Budget
```

Future architecture may support:

```text
Weekly
Custom Period
Account Budget
Goal Budget
```

but these do not need to be fully implemented in Phase 4.

---

# 25. BUDGET STATUS

Display:

```text
Spent
Remaining
Percentage Used
```

Example:

```text
Food

Rp 350.000 / Rp 500.000

70% used
Rp 150.000 remaining
```

If the budget is exceeded:

```text
Rp 550.000 / Rp 500.000

Over budget by Rp 50.000
```

Do not prevent transactions because a budget was exceeded.

A budget is informational.

---

# 26. FEATURE 4 — SUBSCRIPTIONS

Implement subscription tracking.

Examples:

```text
Netflix
Spotify
Cloud Storage
Software
Gym
Internet
Other recurring service
```

---

# 27. SUBSCRIPTION PROPERTIES

At minimum:

```text
Name
Price
Currency
Billing Cycle
Next Billing Date
Category
Payment Account
Status
```

Billing cycles:

```text
Weekly
Monthly
Quarterly
Yearly
Custom
```

---

# 28. SUBSCRIPTION STATUS

Suggested:

```text
Active
Paused
Cancelled
Expired
```

Cancelled subscriptions must remain in historical data.

Do not delete them automatically.

---

# 29. SUBSCRIPTION REMINDERS

Subscriptions should integrate with the existing Reminder system.

Example:

```text
Spotify
Rp 54.990 / month

Next payment:
August 20

Reminder:
August 18
```

Do not build another notification engine.

---

# 30. SUBSCRIPTION FINANCIAL INTEGRATION

Subscriptions should optionally connect to the Finance system.

Example:

```text
Subscription
Spotify
Rp 54.990/month

Category:
Subscriptions

Payment Account:
Digital Wallet
```

When the billing event is actually paid, it may be recorded as a transaction.

Do NOT automatically create real financial transactions unless the user explicitly confirms the payment model.

Avoid silently changing account balances.

---

# 31. SUBSCRIPTION OVERVIEW

Provide:

```text
Monthly Subscription Cost
Yearly Estimated Subscription Cost
Active Subscriptions
Upcoming Payments
```

Example:

```text
Subscriptions

5 Active

Monthly:
Rp 250.000

Estimated Yearly:
Rp 3.000.000

Upcoming:
Spotify — Aug 20
Cloud Storage — Aug 23
```

---

# 32. FEATURE 5 — WISHLIST

Implement a personal Wishlist.

Purpose:

> Track things the user wants instead of immediately buying them.

Examples:

```text
Keyboard
Headphones
Monitor
Game
Book
Course
Clothing
Other
```

---

# 33. WISHLIST ITEM PROPERTIES

At minimum:

```text
Name
Category
Estimated Price
Priority
Status
Created Date
Optional Target Date
Note
```

Suggested status:

```text
Considering
Want
Planned
Purchased
Cancelled
```

---

# 34. WISHLIST PRIORITY

Suggested:

```text
Low
Medium
High
```

Do not force a complex scoring system.

---

# 35. WISHLIST PURCHASE INTEGRATION

When the user marks an item as purchased:

Optionally allow:

```text
Create Expense
```

Example:

```text
Wishlist
Mechanical Keyboard
Rp 800.000

Purchased
       ↓
Create Expense?
       ↓
Finance transaction
-Rp 800.000
```

This should be explicit and user-controlled.

Never silently create financial transactions.

---

# 36. WISHLIST GOAL INTEGRATION

Wishlist items may optionally connect to Goals.

Example:

```text
Goal:
Build Better Workspace

Wishlist:
Monitor
Keyboard
Desk
```

Reuse the existing Goal system.

Do not create a new goal engine.

---

# 37. FEATURE 6 — PERSONAL INVENTORY

Implement a basic Personal Inventory.

Purpose:

> Know what the user owns.

Examples:

```text
Laptop
Phone
Monitor
Headphones
Camera
Game Console
Books
Accessories
```

---

# 38. INVENTORY ITEM PROPERTIES

At minimum:

```text
Name
Category
Quantity
Status
Purchase Date
Purchase Price
Location
Note
```

Optional:

```text
Brand
Model
Serial Number
Warranty Expiration
Condition
```

---

# 39. INVENTORY STATUS

Suggested:

```text
Owned
In Use
Stored
Borrowed
Loaned
Broken
Sold
Disposed
```

Do not delete sold/disposed items automatically.

Maintain history where practical.

---

# 40. INVENTORY CATEGORIES

Initial categories:

```text
Electronics
Clothing
Books
Furniture
Accessories
Tools
Hobby
Other
```

Categories must be extensible.

---

# 41. INVENTORY VALUE

If purchase price is recorded, provide optional informational totals.

Example:

```text
Electronics
5 Items

Recorded Purchase Value:
Rp 12.500.000
```

Do not call this current market value.

Purchase price and current market value are different concepts.

---

# 42. INVENTORY SEARCH

Search by:

```text
Name
Category
Brand
Model
Location
Serial Number
```

where those fields exist.

---

# 43. INVENTORY HISTORY

If an item is:

```text
Sold
Disposed
Lost
Broken
```

do not necessarily delete it.

Preserve historical information where appropriate.

---

# 44. FEATURE 7 — IMPORTANT INFORMATION

Implement a general Important Information section.

This is NOT the secure password vault.

It is for ordinary personal information that is useful to remember.

Examples:

```text
Emergency contact information
Important phone numbers
Addresses
Membership numbers
Device information
Useful reference information
Personal records
```

---

# 45. IMPORTANT INFORMATION PROPERTIES

At minimum:

```text
Title
Category
Content
Created Date
Updated Date
```

Optional:

```text
Expiration Date
Tags
Note
```

---

# 46. IMPORTANT INFORMATION CATEGORIES

Example:

```text
Personal
Contact
Education
Technology
Travel
Membership
Reference
Other
```

Allow custom categories later.

---

# 47. IMPORTANT INFORMATION SECURITY

Important Information must NOT be treated as secure credentials.

Do not present it as:

```text
Password Vault
Secret Storage
Encrypted Credential Manager
```

Those belong to Phase 5.

If a user needs to store passwords, Phase 4 should clearly direct them to the future Secure Vault concept rather than encouraging plaintext storage.

---

# 48. FEATURE 8 — DOCUMENT REFERENCES

Implement the foundation for important personal documents.

Examples:

```text
Student Card
Certificates
Receipts
Warranty
Contracts
Academic Documents
Other Personal Documents
```

Phase 4 should focus on document metadata and references.

---

# 49. DOCUMENT METADATA

At minimum:

```text
Document Name
Category
Description
Document Date
Expiration Date (optional)
Created Date
```

Optional:

```text
Document Number
Issuer
Location / Reference
```

---

# 50. DOCUMENT FILE STORAGE

If the existing architecture can safely support local file references, implement a simple local document attachment mechanism.

However:

**Do not build a full document management system in Phase 4.**

Do not implement:

```text
Cloud storage
Document OCR
AI extraction
Document sharing
Multi-user access
Advanced encryption
```

Those belong to later phases.

---

# 51. EXPIRATION TRACKING

Documents with expiration dates should be identifiable.

Examples:

```text
Student Card
Expires:
December 2027

Warranty
Expires:
March 2027
```

Future reminders may be connected through the existing Reminder system.

---

# 52. DOCUMENT REMINDERS

Where appropriate:

```text
Document
 ↓
Expiration Date
 ↓
Reminder
```

Example:

```text
Warranty expires:
March 20

Reminder:
March 1
```

Reuse existing Reminder infrastructure.

---

# 53. GLOBAL SEARCH INTEGRATION

Extend Phase 2 Global Search.

Searchable Phase 4 entities:

```text
Financial Accounts
Transactions
Subscriptions
Wishlist
Inventory
Important Information
Documents
```

Example:

```text
Search:
Keyboard

Results:

WISHLIST
Mechanical Keyboard

INVENTORY
Current Keyboard

TRANSACTION
Keyboard purchase

PROJECT
Workspace Upgrade
```

---

# 54. TIMELINE INTEGRATION

Extend Phase 2 Timeline.

Relevant events may include:

```text
Income
Expense
Subscription created
Wishlist item purchased
Inventory item purchased
Document created
Document expiration
```

Do not create duplicate records.

Timeline should reference the source entities.

---

# 55. FINANCE → TIMELINE

Example:

```text
August 11

Expense
-Rp 25.000
Food
```

The Timeline should show the event without creating another financial record.

---

# 56. WISHLIST → TIMELINE

Example:

```text
August 20

Wishlist
Mechanical Keyboard marked as Purchased
```

---

# 57. INVENTORY → TIMELINE

Example:

```text
August 20

Inventory
Mechanical Keyboard added
```

---

# 58. DOCUMENT → TIMELINE

Example:

```text
August 21

Document
Student Card added
```

---

# 59. GOAL / PROJECT INTEGRATION

Phase 4 entities should optionally connect to existing Goals and Projects.

Examples:

```text
Goal:
Build Better Workspace

Project:
Workspace Upgrade

Wishlist:
Monitor
Keyboard

Finance:
Budget for Workspace
```

Another example:

```text
Goal:
Save for Laptop

Finance:
Savings tracking

Wishlist:
Laptop

Project:
Laptop Research
```

Do not create duplicate Goal or Project systems.

---

# 60. TASK INTEGRATION

Personal Management should integrate with existing Tasks.

Examples:

```text
Task:
Cancel unused subscription

Task:
Review monthly expenses

Task:
Buy item from wishlist

Task:
Renew document
```

Where appropriate, entities may create or reference Tasks.

Do not automatically create unnecessary tasks for every event.

---

# 61. REMINDER INTEGRATION

Reuse existing Reminder functionality for:

```text
Subscription billing
Document expiration
Warranty expiration
Budget review
Financial events
Wishlist target dates
```

Only create reminders where meaningful.

---

# 62. TODAY INTEGRATION

Today may show relevant personal management information.

Example:

```text
TODAY

REMINDERS

Subscription payment tomorrow

DOCUMENT
Student card renewal approaching

FINANCE

Monthly budget:
70% used
```

Keep this subtle.

The Today page must remain primarily focused on actionable daily information.

---

# 63. PERSONAL DASHBOARD

Create a Personal Management overview.

Conceptually:

```text
PERSONAL

FINANCE
Balance
Rp 3.500.000

This Month
+Rp 1.150.000

SUBSCRIPTIONS
5 Active
Rp 250.000 / month

WISHLIST
8 Items

INVENTORY
42 Items

DOCUMENTS
3 Expiring Soon
```

Do not overload the screen.

Use cards or sections appropriate to the existing design system.

---

# 64. FINANCE NAVIGATION

A reasonable structure:

```text
Personal

Finance
 ├── Overview
 ├── Accounts
 ├── Transactions
 ├── Budgets
 └── Categories

Subscriptions

Wishlist

Inventory

Important Information

Documents
```

Adapt to the current OmniLife navigation system.

Do not create unnecessary nested navigation.

---

# 65. DATA MODEL PRINCIPLE

Avoid duplicate entities.

Do not create:

```text
FinancialTask
AcademicTask
PersonalTask
```

when the existing Task system can handle them.

Prefer:

```text
Task
 ↑
Relationship / metadata
```

Similarly:

```text
Goal
 ↑
Wishlist relationship

Project
 ↑
Inventory / Personal Project relationship

Reminder
 ↑
Subscription / Document relationship
```

---

# 66. FINANCIAL DATA INTEGRITY

This is critical.

The system must ensure:

```text
Income increases balance
Expense decreases balance
Transfer moves money between accounts
Adjustment explains manual correction
```

Do not silently mutate balances.

Every balance-affecting change should be traceable.

---

# 67. MONEY PRECISION

Do not use floating-point arithmetic for financial calculations if the architecture can avoid it.

Prefer integer minor units where appropriate.

For Indonesian Rupiah:

```text
Rp 25.000
```

should not suffer from floating-point rounding problems.

The implementation must be deterministic.

---

# 68. CURRENCY

Phase 4 is primarily personal/local.

Support a currency field.

Default may be:

```text
IDR
```

but do not hard-code the system so that other currencies are impossible.

Do not build currency conversion yet.

---

# 69. FINANCIAL DELETE BEHAVIOR

Do not casually delete transactions.

Prefer:

```text
Edit
Void
Correction
```

where appropriate.

If transaction deletion is supported, ensure account balances recalculate correctly.

Historical financial records should be treated carefully.

---

# 70. ARCHIVING

Support archival where useful:

```text
Old Accounts
Cancelled Subscriptions
Purchased Wishlist Items
Sold Inventory
Expired Documents
```

Archived information should remain accessible.

---

# 71. UI / UX REQUIREMENTS

Continue OmniLife's established visual language.

Personal Management should feel:

```text
Clean
Modern
Trustworthy
Calm
Private
Organized
```

Avoid:

```text
Corporate accounting software
Crypto dashboard
Banking application clone
Overly colorful finance app
AI dashboard aesthetic
```

---

# 72. FINANCE VISUALIZATION

Use simple visualizations only where they improve understanding.

Examples:

```text
Spending by category
Monthly income vs expenses
Budget progress
```

Avoid unnecessary charts.

A number and a clear label are often better than a chart.

---

# 73. RESPONSIVE DESIGN

All Phase 4 interfaces must work across currently supported platforms.

Especially test:

```text
Finance dashboard
Transaction list
Subscription cards
Wishlist
Inventory
Documents
```

Tables should adapt appropriately to smaller screens.

---

# 74. ACCESSIBILITY

Maintain OmniLife accessibility standards.

Do not use color alone to indicate:

```text
Income
Expense
Over budget
Expired
Active
Cancelled
```

Use:

```text
Text
Icons
Labels
```

alongside visual indicators.

---

# 75. PERFORMANCE

The system should remain responsive with:

```text
Thousands of transactions
Hundreds of inventory items
Hundreds of wishlist items
Many subscriptions
Many documents
Long historical data
```

Use pagination, lazy loading, filtering, or optimized queries where appropriate.

---

# 76. TESTING — FINANCE

Test:

```text
Account creation
Initial balance
Income
Expense
Transfer
Adjustment
Balance calculation
Transaction editing
Transaction deletion / void
Category filtering
Date filtering
Monthly summary
Budget calculation
```

---

# 77. TESTING — SUBSCRIPTIONS

Test:

```text
Subscription creation
Billing cycle
Next billing date
Status changes
Monthly cost calculation
Yearly estimate
Reminder integration
Finance relationship
```

---

# 78. TESTING — WISHLIST

Test:

```text
Wishlist CRUD
Priority
Status
Purchase state
Goal relationship
Optional expense creation
```

---

# 79. TESTING — INVENTORY

Test:

```text
Inventory CRUD
Quantity
Status
Purchase information
Search
Category
Archive behavior
```

---

# 80. TESTING — DOCUMENTS

Test:

```text
Document metadata
Expiration date
Search
Reminder relationship
Archive
Optional local file reference
```

---

# 81. CROSS-MODULE TESTING

Verify:

```text
Wishlist → Finance
Wishlist → Goal

Subscription → Finance
Subscription → Reminder

Document → Reminder

Inventory → Finance

Personal entities → Search
Personal entities → Timeline

Personal entities → Goal
Personal entities → Project
Personal entities → Task
```

---

# 82. REGRESSION TESTING

Phase 4 must not break Phase 1, 2, or 3.

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
Search
Timeline

College
Semesters
Courses
Assignments
Exams
Grades
Academic Dashboard
```

---

# 83. IMPLEMENTATION ORDER

Do not implement everything in one uncontrolled generation.

Recommended sequence:

```text
Batch 1
Inspect Phase 1 + Phase 2 + Phase 3 + Architecture

Batch 2
Finance Accounts

Batch 3
Transactions + Balance Engine

Batch 4
Categories + Monthly Overview

Batch 5
Budgets

Batch 6
Subscriptions + Reminder Integration

Batch 7
Wishlist

Batch 8
Inventory

Batch 9
Important Information

Batch 10
Documents + Expiration Integration

Batch 11
Cross-module Search + Timeline

Batch 12
Dashboard + Today Integration

Batch 13
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

# 84. SCOPE CONTROL

If useful features are discovered outside Phase 4:

DO NOT implement them.

Record them in:

```text
PHASE_4_DEFERRED_FEATURES.md
```

Potential future ideas:

```text
Advanced investment tracking
Automatic bank synchronization
OCR receipt scanning
AI expense categorization
AI financial advice
Cloud document backup
Encrypted vault
Automatic subscription cancellation
Advanced financial forecasting
```

---

# 85. ARCHITECTURAL ISSUES

If Phase 4 exposes architectural limitations:

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

If the issue requires major restructuring, stop at the appropriate boundary for human review.

---

# 86. VALIDATION CHECKLIST

Before declaring Phase 4 complete:

```text
[ ] Financial accounts work
[ ] Initial balances work
[ ] Income works
[ ] Expenses work
[ ] Transfers work
[ ] Adjustments work
[ ] Account balances calculate correctly
[ ] Categories work
[ ] Transaction filtering works
[ ] Transaction search works
[ ] Monthly overview works
[ ] Expense breakdown works
[ ] Budgets work

[ ] Subscriptions work
[ ] Billing cycles work
[ ] Next billing dates work
[ ] Subscription reminders work
[ ] Subscription overview works

[ ] Wishlist works
[ ] Wishlist priority works
[ ] Wishlist status works
[ ] Wishlist → Goal works
[ ] Wishlist → Expense works

[ ] Inventory works
[ ] Inventory search works
[ ] Inventory status works
[ ] Inventory history works

[ ] Important Information works
[ ] Document metadata works
[ ] Document expiration works
[ ] Document reminders work

[ ] Global Search includes Phase 4
[ ] Timeline includes Phase 4
[ ] Today integration works
[ ] Personal Dashboard works

[ ] Phase 1 regression passes
[ ] Phase 2 regression passes
[ ] Phase 3 regression passes

[ ] Persistence works
[ ] Financial calculations are deterministic
[ ] Responsive UI works
[ ] Accessibility checks pass
[ ] Static analysis passes
[ ] Tests pass
```

---

# 87. FINANCIAL VALIDATION EXAMPLE

Use a concrete scenario during testing:

```text
Initial Bank Balance
Rp 1.000.000

Income
+ Rp 500.000

Expense
- Rp 100.000

Transfer to E-Wallet
- Rp 200.000

Expected Bank Balance:
Rp 1.200.000
```

E-Wallet:

```text
Initial:
Rp 100.000

Transfer:
+ Rp 200.000

Expected:
Rp 300.000
```

The transfer must not increase total net worth.

Total personal balance should remain:

```text
Rp 1.500.000
```

before and after the transfer.

---

# 88. FINAL QUALITY CHECK

For Flutter projects, run the appropriate validation commands:

```bash
flutter analyze
flutter test
```

Also validate all currently configured build targets.

Do not suppress analyzer warnings or errors merely to obtain a passing result.

---

# 89. IMPLEMENTATION REPORT

After completing Phase 4, create or update:

```text
PHASE_4_IMPLEMENTATION_REPORT.md
```

Include:

```text
1. Implementation Summary

2. Features Implemented

3. Files / Modules Changed

4. Data Model Changes

5. Financial Architecture

6. Transaction / Balance Engine

7. Subscription System

8. Wishlist System

9. Inventory System

10. Important Information

11. Document System

12. Search Integration

13. Timeline Integration

14. Today Integration

15. Dashboard Changes

16. Tests Added

17. Phase 1 Regression Results

18. Phase 2 Regression Results

19. Phase 3 Regression Results

20. Validation Results

21. Known Issues

22. Deferred Features

23. Architectural Concerns

24. Recommended Next Phase
```

---

# 90. STOP CONDITION

When Phase 4 is complete:

**STOP.**

Do NOT automatically begin Phase 5.

Do NOT implement:

```text
Secure Vault
Password Manager
Encrypted Credentials
AI Assistant
Cloud Sync
Multi-user
Public Platform
```

Wait for human review.

The human will manually test OmniLife and determine whether Phase 4 is accepted.

---

# 91. PHASE 4 SUCCESS CRITERIA

Phase 4 is successful when OmniLife becomes a broader personal management system.

The user should be able to:

```text
Manage Money
    ↓
Track Transactions
    ↓
Understand Spending
    ↓
Create Budgets
    ↓
Track Subscriptions
```

and:

```text
Wishlist
    ↓
Plan Purchases
    ↓
Purchase Item
    ↓
Optional Finance Transaction
    ↓
Inventory
```

and:

```text
Important Document
    ↓
Expiration Date
    ↓
Reminder
    ↓
Timeline
```

All of this should remain connected to the existing:

```text
Goals
Projects
Tasks
Calendar
Reminders
Search
Timeline
```

The result should feel like one unified personal life management system.

---

# 92. FINAL INSTRUCTION TO ANTIGRAVITY

Start by inspecting the current OmniLife workspace.

Read:

```text
Existing Architecture Documentation
PHASE_1_IMPLEMENTATION_REPORT.md
PHASE_2_IMPLEMENTATION_REPORT.md
PHASE_3_IMPLEMENTATION_REPORT.md
Current Source Code
Current Data Models
Current Persistence Layer
Current Design System
Current Navigation
```

Then implement **ONLY OmniLife Phase 4** according to this specification.

Do not assume the project is empty.

Do not overwrite working Phase 1, Phase 2, or Phase 3 functionality blindly.

Do not implement future phases.

Do not introduce unrelated dependencies.

Do not silently change architecture.

Implement incrementally.

Test after each meaningful batch.

Pay special attention to **financial data integrity and deterministic money calculations**.

At the end, produce the Phase 4 implementation report.

Then STOP and wait for human review.
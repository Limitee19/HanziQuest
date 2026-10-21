# OMNILIFE — PHASE 11 IMPLEMENTATION PROMPT
## Global Search & Cross-Module Navigation

**Project:** OmniLife  
**Phase:** 11  
**Previous Phase:** Phase 10 — AI Planning, Recommendations & User-Approved Actions  
**Status:** Implementation Phase

---

# 1. ROLE

You are the implementation agent for OmniLife.

Phase 11 focuses on:

> **Global Search + Cross-Module Navigation + Entity Relationships**

The objective is to make OmniLife feel like one connected personal life management system rather than a collection of independent modules.

Do not redesign the entire OmniLife UI in this phase.

The final visual redesign and information architecture simplification will happen in:

> **Phase 25 — OmniLife UX/UI Overhaul & Localization**

Your responsibility in Phase 11 is the underlying functionality, search architecture, navigation infrastructure, and cross-module relationship foundation.

---

# 2. CURRENT PROJECT RULE

Before implementing anything:

1. Inspect the existing OmniLife codebase.
2. Identify existing modules.
3. Identify repositories/services/data models.
4. Identify current navigation architecture.
5. Identify existing routing.
6. Identify existing database/storage implementation.
7. Identify existing design-system components.
8. Identify existing AI/context infrastructure.

Do not assume that a module exists just because it appears in the long-term OmniLife roadmap.

Only integrate modules that actually exist in the current project.

Do not create fake modules to satisfy this phase.

---

# 3. CORE OBJECTIVE

Build this architecture:

```text
                         OMNILIFE
                            │
                            ▼
                     Global Search
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
            Tasks        Calendar       Notes
              │             │             │
              └─────────────┼─────────────┘
                            │
                       Relationships
                            │
                            ▼
                     Deep Navigation
```

The user should be able to search OmniLife from one central location.

---

# 4. TARGET EXPERIENCE

Example:

User searches:

```text
Matematika
```

Search results may include:

```text
TASK
Kerjakan latihan matematika
Due: Friday

CALENDAR
Ujian Matematika
Friday — 09:00

NOTE
Catatan Matematika Bab 3

PROJECT
Semester 1

GOAL
Meningkatkan nilai matematika
```

Only return result categories that actually exist and contain matching data.

---

# 5. GLOBAL SEARCH

Implement a centralized search service.

Suggested conceptual architecture:

```text
GlobalSearchService
        │
        ├── TaskSearchProvider
        ├── CalendarSearchProvider
        ├── ReminderSearchProvider
        ├── RoutineSearchProvider
        ├── ProjectSearchProvider
        ├── GoalSearchProvider
        ├── NoteSearchProvider
        ├── AcademicSearchProvider
        ├── DocumentSearchProvider
        └── FutureSearchProvider
```

Only implement providers for modules currently available.

---

# 6. SEARCH PROVIDER CONTRACT

Each search provider should expose a consistent abstraction.

Conceptually:

```text
SearchProvider

search(
    query,
    filters,
    limit
) -> List<SearchResult>
```

Do not force every module to use the same database query.

The provider abstraction exists so each module can search its own data appropriately.

---

# 7. SEARCH RESULT MODEL

Create a normalized search result model.

Conceptual structure:

```text
SearchResult

id
entityType
title
subtitle
description
module
route
metadata
relevanceScore
matchedFields
```

Example:

```text
entityType:
task

module:
tasks

title:
Kerjakan latihan matematika

subtitle:
Due Friday

route:
task detail
```

Use the existing routing architecture rather than hardcoding navigation behavior into the UI.

---

# 8. ENTITY TYPES

Use a scalable entity-type system.

Potential types:

```text
task
calendar_event
reminder
routine
project
goal
note
academic_course
assignment
exam
document
finance_record
inventory_item
vault_item
```

However:

> Only register types for modules that actually exist.

Future entity types may be added later without rewriting the search system.

---

# 9. SEARCH RESULT MODULE

Every result should identify where it came from.

Example:

```text
TASK
Kerjakan latihan matematika
```

or:

```text
CALENDAR
Ujian Matematika
```

This should be visible in the search UI without making the interface visually noisy.

---

# 10. SEARCH UI

Implement a reusable global search interface.

Conceptual layout:

```text
┌─────────────────────────────────────────┐
│ 🔍 Search OmniLife...                   │
├─────────────────────────────────────────┤
│                                         │
│ Tasks                                   │
│ ├─ Kerjakan latihan matematika          │
│                                         │
│ Calendar                                │
│ └─ Ujian Matematika                     │
│                                         │
│ Notes                                   │
│ └─ Catatan Matematika                   │
│                                         │
└─────────────────────────────────────────┘
```

Do not redesign the whole application.

Use existing OmniLife design-system components where possible.

---

# 11. SEARCH ACCESS

Global search should be accessible from the existing application shell.

For desktop:

```text
Ctrl + K
```

is recommended.

If OmniLife already has an application-wide shortcut system, integrate with it.

Do not create conflicting keyboard shortcuts.

---

# 12. SEARCH OPEN/CLOSE

The global search interface should support:

```text
Open
Close
Focus input
Clear query
Submit
Navigate results
Open selected result
```

Desktop keyboard behavior should support:

```text
Ctrl + K
Esc
Arrow Up
Arrow Down
Enter
```

where appropriate.

Mobile should use an appropriate touch-first interaction.

---

# 13. SEARCH STATES

Support at minimum:

```text
idle
typing
loading
results
no_results
error
```

Example:

```text
No results found for:

"xyzabc"
```

Do not show a broken or empty screen.

---

# 14. SEARCH DEBOUNCING

For live search:

```text
User types
 ↓
Debounce
 ↓
Search
```

Do not execute expensive searches on every keystroke.

Use a reasonable debounce duration consistent with the application's architecture.

---

# 15. EMPTY QUERY

When the query is empty, the search interface may show:

```text
Recent Searches
Recently Opened
Quick Actions
```

Only implement data that is genuinely available.

Do not invent fake recommendations.

---

# 16. RECENT SEARCHES

Implement lightweight local recent-search history.

Store:

```text
query
timestamp
```

Do not store unnecessary personal data.

Provide a way to clear recent searches.

---

# 17. RECENTLY OPENED ITEMS

If practical with the existing architecture, support:

```text
Recently Opened
```

Example:

```text
Recent
• Mathematics Assignment
• Weekly Workout
• Semester 1
```

This should be local application metadata.

Do not create a complex analytics system.

---

# 18. SEARCH FILTERS

Do not overload the first version with complicated filters.

At minimum, support filtering by module/type if the architecture makes it practical.

Example:

```text
All
Tasks
Calendar
Notes
Projects
Goals
```

Only display filters for modules that exist.

---

# 19. SEARCH RANKING

Search results should be ordered by relevance.

A simple deterministic ranking is preferred.

Possible factors:

```text
Exact title match
Prefix title match
Contains title match
Exact keyword match
Description match
Metadata match
Recent relevance
```

Do not use an LLM for basic search ranking.

---

# 20. EXACT MATCH PRIORITY

Example query:

```text
Matematika
```

An item titled:

```text
Matematika
```

should rank above:

```text
Catatan minggu lalu tentang matematika
```

Use deterministic ranking.

---

# 21. SEARCH NORMALIZATION

Search should handle basic normalization where appropriate.

Examples:

```text
uppercase/lowercase
extra whitespace
basic punctuation
```

Example:

```text
Matematika
matematika
MATEMATIKA
```

should produce equivalent search behavior where appropriate.

Do not implement overly aggressive fuzzy matching yet.

---

# 22. SEARCH PERFORMANCE

Do not load the entire database into memory for every search unless the existing database is extremely small and the architecture explicitly supports it.

Prefer:

```text
Indexed queries
Repository-level search
Targeted queries
Pagination
Limits
```

Avoid:

```text
Load every record
 ↓
Convert everything to objects
 ↓
Search in memory
```

for scalable modules.

---

# 23. SEARCH LIMIT

Search should have a reasonable result limit.

Example:

```text
Top 20
```

Then provide:

```text
View all
```

where appropriate.

Do not render hundreds of results in the search overlay.

---

# 24. DEEP NAVIGATION

This is one of the most important requirements.

When a user taps/clicks a search result:

```text
Search Result
     ↓
Entity
     ↓
Correct Module
     ↓
Correct Detail Page
```

Example:

```text
Search:
"Matematika"

Result:
Task — Kerjakan latihan

Click

→ Task detail screen
```

Do not merely navigate to the module's home page.

---

# 25. ROUTE RESOLUTION

Create a centralized route/deep-link resolution strategy if the current architecture does not already have one.

Conceptually:

```text
EntityReference
        ↓
RouteResolver
        ↓
Correct application route
```

Avoid putting navigation logic inside individual search-result widgets.

---

# 26. ENTITY REFERENCES

Introduce a lightweight entity reference abstraction.

Conceptually:

```text
EntityReference

entityType
entityId
```

Example:

```text
entityType:
task

entityId:
abc123
```

This abstraction will be important for future cross-module relationships.

---

# 27. CROSS-MODULE RELATIONSHIPS

Begin implementing the foundation for relationships between entities.

Example:

```text
Course
   │
   ├── Assignment
   │      │
   │      └── Task
   │
   └── Exam
```

Another example:

```text
Goal
 │
 └── Project
       │
       └── Task
```

Do not build a complicated graph database.

Use simple references/relations compatible with the current storage architecture.

---

# 28. RELATIONSHIP MODEL

Where appropriate, create a generic relationship abstraction.

Conceptual:

```text
EntityRelation

sourceEntity
targetEntity
relationType
createdAt
```

Example:

```text
Goal
   ↓
supports
   ↓
Project
```

or:

```text
Assignment
   ↓
represented_by
   ↓
Task
```

Use clear relation types.

Do not create relationships merely for the sake of having them.

---

# 29. EXISTING DATA COMPATIBILITY

If existing modules currently have direct relationships, reuse them.

Do not duplicate data unnecessarily.

For example, if a task already references a project:

```text
task.projectId
```

do not create a second unrelated project relationship system unless necessary.

The relationship layer should complement the existing architecture.

---

# 30. RELATED ITEMS

Where the existing module architecture supports it, show related items in detail screens.

Example:

```text
Mathematics Assignment

Related

📚 Course
Mathematics

📅 Deadline
Friday

✅ Task
Complete Chapter 3 exercises
```

This is the beginning of cross-module navigation.

---

# 31. RELATED ITEMS MUST BE CONTEXTUAL

Do not show every possible related entity.

Only show relationships that make sense.

For example:

```text
Task
```

may show:

```text
Project
Goal
Calendar event
Course
```

if actual relationships exist.

Do not show unrelated finance or vault data.

---

# 32. SEARCH + RELATIONSHIP INTEGRATION

Search should be able to find related entities independently.

Example:

```text
Search:
Semester 1
```

Possible results:

```text
PROJECT
Semester 1

COURSE
Mathematics

TASK
Mathematics Assignment
```

if those entities are actually related and match the search.

Do not automatically return every related entity if it doesn't match the query.

---

# 33. CROSS-MODULE NAVIGATION

Implement navigation such as:

```text
Task
 ↓
Project
```

and:

```text
Task
 ↓
Course
```

and:

```text
Calendar Event
 ↓
Task
```

where actual data relationships exist.

The user should be able to move between connected information naturally.

---

# 34. GLOBAL SEARCH + AI

Do not add new AI functionality in Phase 11.

However, preserve compatibility with:

```text
Phase 9 Context Intelligence
Phase 10 Planning
```

The search architecture should be reusable by future AI context providers.

For example, future context logic may query:

```text
TaskSearchProvider
CalendarSearchProvider
```

instead of implementing another search system.

Do not make AI mandatory for search.

---

# 35. OFFLINE FIRST

Global search must work without an internet connection if OmniLife's existing data is local.

Do not send user data to an external search service.

Do not require Groq or another AI provider.

---

# 36. PRIVACY

Search must respect existing privacy boundaries.

Especially:

```text
Vault
Credentials
Passwords
Sensitive information
```

Do not expose protected fields in search results.

If the Vault module exists, it should have explicit security rules.

Do not index passwords or secrets as searchable text.

---

# 37. SEARCH INDEX SECURITY

If an indexing mechanism is introduced:

Never index:

```text
password
secret
credential
authentication token
private key
```

or equivalent sensitive fields.

The search index must not become a secondary leak of protected information.

---

# 38. SEARCHABLE FIELDS

Use only appropriate fields.

For example:

### Task

```text
title
description
tags
```

### Calendar Event

```text
title
description
location
```

### Note

```text
title
content
tags
```

### Project

```text
name
description
tags
```

Adapt this to the actual models.

---

# 39. SEARCH INDEX STRATEGY

Choose the simplest architecture compatible with the existing database.

Possible approaches:

```text
Database-level search
Repository-level search
Local search index
```

Do NOT introduce an external search engine.

Do NOT add Elasticsearch or another heavyweight infrastructure.

OmniLife is a local-first personal application.

---

# 40. SEARCH INDEX UPDATES

If a dedicated search index is created, it must remain synchronized.

When an entity is:

```text
created
updated
deleted
```

the index must update accordingly.

Avoid stale search results.

If a dedicated index is unnecessary, use direct database search instead.

---

# 41. DELETED ITEMS

Deleted entities must not remain searchable.

If soft deletion exists:

```text
deleted = true
```

must be excluded from normal search.

Do not expose archived/deleted items unless the application already has an explicit archive feature.

---

# 42. SEARCH ERROR HANDLING

If one provider fails:

```text
Task search ✓
Calendar search ✓
Notes search ✗
```

do not make the entire global search unusable if the architecture allows partial results.

The UI should gracefully handle provider failures.

Do not silently claim all modules were searched.

---

# 43. MOBILE EXPERIENCE

The search system must work on mobile.

Recommended:

```text
Tap search
 ↓
Full-screen search experience
 ↓
Keyboard opens
 ↓
Results
```

Do not simply shrink the desktop overlay onto mobile.

Use the existing responsive architecture.

The final UX overhaul happens later in Phase 25.

---

# 44. DESKTOP EXPERIENCE

Desktop should support:

```text
Ctrl + K
```

and keyboard navigation.

Search should feel fast and lightweight.

---

# 45. ACCESSIBILITY

Support:

```text
Keyboard navigation
Focus management
Semantic labels
Readable result hierarchy
Screen-reader compatible controls
```

Do not rely solely on color to identify result types.

---

# 46. TESTING

Create automated tests for:

### Search

```text
exact match
partial match
case normalization
empty query
no results
multiple modules
ranking
limits
```

### Navigation

```text
result opens correct route
entity ID resolves correctly
deleted entity handled correctly
invalid entity handled safely
```

### Relationships

```text
valid relation
missing relation
deleted related entity
multiple relationships
```

### Security

```text
password excluded
vault secrets excluded
protected fields excluded
```

### Offline

```text
search works without network
```

---

# 47. ACCEPTANCE TEST 1 — BASIC SEARCH

Search:

```text
Matematika
```

Expected:

```text
Matching entities from available modules appear.
```

---

# 48. ACCEPTANCE TEST 2 — CROSS-MODULE

Create or use actual existing data:

```text
Task:
Matematika Assignment

Calendar:
Ujian Matematika

Note:
Mathematics Notes
```

Search:

```text
Matematika
```

Expected:

```text
Task
Calendar
Note
```

if all modules are implemented and searchable.

---

# 49. ACCEPTANCE TEST 3 — DEEP NAVIGATION

Click:

```text
Matematika Assignment
```

Expected:

```text
Task detail screen
```

not:

```text
Task list
```

---

# 50. ACCEPTANCE TEST 4 — KEYBOARD

Desktop:

```text
Ctrl + K
```

Expected:

```text
Global search opens
Input receives focus
```

Then:

```text
Esc
```

Expected:

```text
Search closes
```

---

# 51. ACCEPTANCE TEST 5 — NO RESULTS

Search:

```text
THIS_DOES_NOT_EXIST_12345
```

Expected:

```text
No results found
```

No crash.

---

# 52. ACCEPTANCE TEST 6 — RECENT SEARCH

Perform:

```text
Matematika
```

Then reopen global search.

Expected:

```text
Recent search appears
```

Clear recent searches.

Expected:

```text
History disappears
```

---

# 53. ACCEPTANCE TEST 7 — RELATIONSHIP

If an actual Task is linked to a Project:

Open Task.

Expected:

```text
Related Project
```

Click it.

Expected:

```text
Correct Project detail page
```

---

# 54. ACCEPTANCE TEST 8 — DELETED ENTITY

Search an entity.

Delete the entity.

Search again.

Expected:

```text
Entity no longer appears in normal search.
```

---

# 55. ACCEPTANCE TEST 9 — PROTECTED DATA

If Vault exists:

Create a vault item containing a password.

Search for the password.

Expected:

```text
Password does not appear in search results.
```

Do not index the secret.

---

# 56. ACCEPTANCE TEST 10 — OFFLINE

Disable network connectivity.

Search existing local OmniLife data.

Expected:

```text
Search continues to function.
```

No AI provider should be required.

---

# 57. UI CONSTRAINT

Do NOT perform the Phase 25 visual redesign.

Do NOT:

```text
remove current navigation
reorganize the entire sidebar
change the complete color system
replace the entire design system
redesign every page
```

You may create the minimum UI necessary for:

```text
Global Search
Search Results
Related Items
```

Use existing design language.

---

# 58. ARCHITECTURE CONSTRAINT

Do not rewrite working modules unnecessarily.

Prefer:

```text
Extend
Adapt
Integrate
Reuse
```

over:

```text
Rewrite
Replace
Duplicate
```

If existing architecture already provides an equivalent abstraction, use it.

---

# 59. DOCUMENTATION

Update:

```text
docs/ARCHITECTURE.md
```

with the Global Search architecture.

Create:

```text
docs/GLOBAL_SEARCH.md
```

Document:

```text
Search architecture
Search providers
SearchResult
EntityReference
Relationships
Ranking
Security
Offline behavior
Navigation
```

If these documentation files have different names in the existing project, follow the current documentation structure.

---

# 60. FUTURE COMPATIBILITY

Design the search architecture so future modules can register providers without rewriting the global search system.

For example:

```text
Future:
FinanceSearchProvider
InventorySearchProvider
VaultSearchProvider
KnowledgeSearchProvider
```

However, do not implement future providers until their modules actually exist.

---

# 61. SUCCESS DEFINITION

Phase 11 is complete when:

```text
One search
     ↓
Can find relevant OmniLife information
     ↓
Across available modules
     ↓
Results are ranked
     ↓
Results identify their module/type
     ↓
Clicking a result opens the exact entity
     ↓
Related entities can be navigated
     ↓
Search works offline
     ↓
Sensitive information remains protected
```

The key transformation is:

```text
Before:

User knows which module contains something.
        ↓
Open module.
        ↓
Search manually.


After:

User remembers only:
"Matematika"

        ↓

Ctrl + K

        ↓

Search OmniLife

        ↓

Everything relevant appears.
```

---

# 62. FINAL REPORT

When implementation is complete, provide:

```text
OMNILIFE PHASE 11 REPORT

Status:
COMPLETED / PARTIAL / BLOCKED

Existing modules detected:
- ...

Search providers implemented:
- ...

Searchable entity types:
- ...

Search architecture:
- ...

Cross-module relationships:
- ...

Deep navigation:
- ...

Keyboard shortcuts:
- ...

Security:
- ...

Offline support:
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

Potential technical debt:
- ...

Recommended next phase:
- ...
```

Do not claim completion if search only works on one module while other currently existing modules are ignored.

---

# FINAL PRINCIPLE

Phase 11 is not about making OmniLife look different.

It is about making OmniLife **connected**.

The desired experience is:

```text
                         OMNILIFE
                            │
                            ▼
                      🔎 SEARCH
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
            TASK         CALENDAR        NOTE
              │             │             │
              └─────────────┼─────────────┘
                            │
                            ▼
                      RELATIONSHIPS
                            │
                            ▼
                    DEEP NAVIGATION
                            │
                            ▼
                    CORRECT ENTITY
```

Build the infrastructure carefully.

Do not introduce AI dependency.

Do not redesign the entire UI.

Do not remove existing features.

Do not expose sensitive data.

Do not create fake modules.

Make the existing OmniLife modules searchable and connected.

The major UX simplification will happen later in **Phase 25** after the complete feature set has been implemented.
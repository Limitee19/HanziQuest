# OMNILIFE — PHASE 15 IMPLEMENTATION PROMPT
## Knowledge Base & Personal Information Hub

**Project:** OmniLife  
**Phase:** 15  
**Previous Phase:** Phase 14 — Academic / College Management  
**Status:** Implementation Phase

---

# 1. OBJECTIVE

Implement the **Knowledge Base & Personal Information Hub** for OmniLife.

The goal is to transform OmniLife's existing Notes functionality into a more powerful, structured, interconnected personal knowledge system.

The system should allow the user to store and retrieve:

- Personal notes
- Study notes
- Academic knowledge
- Ideas
- References
- Concepts
- Important information
- Personal documentation
- Learning materials
- Long-term knowledge

The system must NOT become a completely separate note-taking application.

Instead:

> **Knowledge Base is a structured layer above the existing Notes system.**

Existing Notes must remain compatible.

---

# 2. CORE PRINCIPLE

OmniLife should gradually move from:

```text
Notes
 ├── Note 1
 ├── Note 2
 └── Note 3
```

toward:

```text
Knowledge Base
       │
       ├── Notes
       ├── Topics
       ├── Tags
       ├── Concepts
       ├── References
       └── Relationships
```

The objective is not to force every note into a complex structure.

Simple notes must remain simple.

---

# 3. IMPORTANT PRE-IMPLEMENTATION RULE

Before implementing:

1. Inspect the existing Notes system.
2. Inspect Phase 11 Global Search.
3. Inspect Phase 13 Tasks & Projects.
4. Inspect Phase 14 Academic system.
5. Inspect existing Tags.
6. Inspect existing Calendar.
7. Inspect existing navigation.
8. Inspect existing database/repository architecture.
9. Inspect existing design system.
10. Inspect existing attachment/file reference capabilities.

Reuse existing infrastructure wherever possible.

Do NOT create duplicate systems.

---

# 4. KNOWLEDGE BASE CONCEPT

The Knowledge Base should support:

```text
Knowledge Base
│
├── Notes
│
├── Topics
│
├── Tags
│
├── Concepts
│
├── References
│
└── Relationships
```

However, the user should not be required to manually manage all of these.

The system should feel simple first and powerful when needed.

---

# 5. NOTE VS KNOWLEDGE

Maintain this distinction:

### Note

A piece of information created by the user.

Example:

```text
"Derivative formulas"
```

### Knowledge

A note that has been organized, connected, tagged, or associated with other information.

Example:

```text
Mathematics
 └── Calculus
      └── Derivatives
           ├── Formula
           ├── Example
           ├── Related concept
           └── Exam preparation
```

Do not create a separate database containing duplicate note content.

---

# 6. EXISTING NOTES MUST SURVIVE

Existing OmniLife notes must remain valid after migration.

Do NOT:

```text
❌ Delete existing notes
❌ Duplicate all notes
❌ Force existing notes into categories
❌ Break existing note navigation
```

Migration should be backward compatible.

---

# 7. KNOWLEDGE ITEM

If the architecture benefits from a generalized concept, introduce a lightweight metadata layer.

Potential fields:

```text
id
noteId
type
topicId
createdAt
updatedAt
```

Possible types:

```text
GENERAL
STUDY
REFERENCE
CONCEPT
IDEA
GUIDE
PERSONAL
ACADEMIC
```

Do not over-engineer this.

---

# 8. TOPICS

Introduce Topics as an organizational layer.

Examples:

```text
Programming
Roblox
Chinese
Mathematics
Personal Development
College
Finance
Technology
```

A topic should contain related knowledge without requiring nested folders.

---

# 9. TOPIC MODEL

Conceptually:

```text
Topic

id
name
description
icon
color
parentTopicId (optional)
createdAt
updatedAt
```

Nested topics are optional.

Avoid creating unlimited folder complexity.

---

# 10. TOPIC HIERARCHY

If hierarchical topics are implemented:

```text
Programming
│
├── Lua
│
├── Flutter
│
└── Web Development
```

But also allow flat topics:

```text
Chinese
Roblox
College
Finance
```

The user should not be forced to create a hierarchy.

---

# 11. TAGS

Reuse existing OmniLife Tag infrastructure.

Tags should remain lightweight.

Examples:

```text
#important
#study
#idea
#reference
#exam
#roblox
#programming
```

Do NOT create a separate AcademicTag or KnowledgeTag system.

---

# 12. TOPIC + TAG

Allow:

```text
Topic:
Programming

Tags:
#lua
#roblox
#learning
```

This provides two different organization levels:

```text
Topic = broad context
Tag = flexible label
```

---

# 13. NOTE RELATIONSHIPS

Allow notes to reference other notes.

Example:

```text
Derivatives
     │
     ├── Related:
     │      Limits
     │      Integrals
     │
     └── Related:
            Chain Rule
```

Relationships should be optional.

---

# 14. RELATED NOTES

Add a lightweight:

```text
Related Notes
```

section where appropriate.

Example:

```text
Derivatives

Related Notes:
• Limits
• Integrals
• Chain Rule
```

Clicking opens the existing Note detail.

---

# 15. RELATIONSHIP MODEL

If implemented:

```text
NoteRelationship

id
sourceNoteId
targetNoteId
relationshipType
createdAt
```

Possible relationship types:

```text
RELATED
REFERENCE
DERIVED_FROM
PART_OF
```

Do not implement an excessive relationship taxonomy.

---

# 16. BIDIRECTIONAL RELATIONSHIPS

If:

```text
A → related to → B
```

the UI should make the relationship discoverable from both sides.

Avoid requiring the user to manually create two relationships.

---

# 17. KNOWLEDGE SEARCH

Global Search must become more useful for Knowledge Base.

Search:

```text
Derivative
```

could return:

```text
NOTE
Derivatives

RELATED
Limits

TOPIC
Mathematics

TAG
#calculus
```

Reuse Phase 11 Global Search.

---

# 18. SEARCH FILTERS

Allow filtering by:

```text
Notes
Topics
Tags
Academic
References
Ideas
```

Do not create an independent Knowledge Search engine.

---

# 19. SEARCH BY CONTENT

If the current search architecture supports it, search:

```text
Title
Content
Tags
Topic
Related entity
```

Prioritize existing search infrastructure.

---

# 20. KNOWLEDGE BASE HOME

Create a Knowledge Base landing page.

Suggested:

```text
Knowledge Base

Search...

Recent
Favorites
Topics
Tags

Recently Updated
```

Keep it simple.

---

# 21. RECENT KNOWLEDGE

Show recently modified knowledge items.

Example:

```text
Recently Updated

Derivatives
Updated today

Flutter Architecture
Updated yesterday

Roblox Combat System
Updated 3 days ago
```

Reuse existing Notes metadata.

---

# 22. FAVORITES / PINNING

If OmniLife already has a favorite/pin mechanism, reuse it.

Otherwise introduce a lightweight:

```text
isPinned
```

or equivalent.

Pinned knowledge should appear in:

```text
Knowledge Base
```

Do not build another bookmarking system.

---

# 23. KNOWLEDGE TYPES

Allow users to optionally classify a note.

Examples:

```text
General
Study
Idea
Reference
Concept
Guide
Personal
Academic
```

This should be optional.

A user should still be able to create a simple note without selecting a type.

---

# 24. QUICK CREATE

Knowledge Base should provide a fast creation flow.

Example:

```text
+ New Note
```

Minimal fields:

```text
Title
Content
```

Optional:

```text
Topic
Tags
Type
Related Notes
```

Do not force unnecessary metadata.

---

# 25. NOTE EDITOR

Use the existing Notes editor.

Do not create:

```text
KnowledgeEditor
```

if the existing Note editor can be extended.

---

# 26. TOPIC DETAIL

A Topic page should show:

```text
Programming

Description

Notes
Projects
Related Academic Content
Tags
```

Only show relevant sections.

---

# 27. TOPIC ↔ ACADEMIC

The Knowledge Base must integrate with Phase 14 Academic.

Example:

```text
Course:
Mathematics

Topic:
Calculus

Notes:
Derivatives
Limits
Integrals
```

Academic notes should remain part of the global Notes system.

Do not duplicate academic notes.

---

# 28. TOPIC ↔ COURSE

A Course may optionally associate with Topics.

Example:

```text
Course:
Database Systems

Topics:
Programming
Database
College
```

This is optional metadata.

---

# 29. TOPIC ↔ PROJECT

Projects may optionally connect to Topics.

Example:

```text
Project:
OmniTenant

Topics:
Flutter
POS
Software Architecture
```

Reuse Phase 13 Project system.

---

# 30. TOPIC ↔ TASK

Tasks should not become Knowledge Base objects.

However, where useful, tasks can reference a Topic.

Example:

```text
Task:
Study Flutter Riverpod

Topic:
Flutter
```

Do not duplicate Task data.

---

# 31. KNOWLEDGE ↔ PROJECT

Projects may reference notes.

Example:

```text
Project:
OmniTenant

Knowledge:
Flutter Architecture
POS Database Design
UI Design Notes
```

Reuse existing Project relationships if possible.

---

# 32. KNOWLEDGE ↔ ACADEMIC ASSIGNMENT

Assignments may reference notes.

Example:

```text
Assignment:
Database Report

Related Notes:
Database Normalization
SQL Joins
```

Do not copy the note content into the assignment.

---

# 33. REFERENCES

Allow notes to contain references.

Examples:

```text
Website
Book
Video
Document
Paper
Other source
```

A lightweight reference model is sufficient.

---

# 34. REFERENCE MODEL

Potential:

```text
Reference

id
title
type
url
description
createdAt
updatedAt
```

Possible types:

```text
WEBSITE
BOOK
VIDEO
DOCUMENT
ARTICLE
OTHER
```

Do not build a citation-management system.

---

# 35. URL REFERENCES

If a URL is attached to a note:

Display it clearly.

Example:

```text
References

Flutter Documentation
[Open]
```

Use the platform's normal external-link handling.

---

# 36. REFERENCES MUST NOT BECOME A BROWSER

Do NOT implement:

```text
❌ Web browser
❌ Web scraping
❌ Automatic webpage archiving
❌ Full bookmark manager
```

Only lightweight references are required.

---

# 37. IDEAS

Allow notes to be classified as:

```text
IDEA
```

Example:

```text
Idea:
Roblox farming game mechanic

Topic:
Game Development

Tags:
#roblox
#game-design
```

This can later connect to Projects.

---

# 38. IDEA → PROJECT

Do not automatically create a Project.

Allow a future conversion flow:

```text
Idea
 ↓
Convert to Project
```

For Phase 15, prepare architecture if practical.

Do not implement a complicated conversion workflow.

---

# 39. STUDY KNOWLEDGE

Academic users should be able to organize knowledge:

```text
Course
  ↓
Topic
  ↓
Notes
  ↓
Related concepts
```

Example:

```text
Mathematics
 └── Calculus
      ├── Limits
      ├── Derivatives
      └── Integrals
```

---

# 40. PERSONAL KNOWLEDGE

Knowledge Base should also support non-academic information.

Examples:

```text
How I configure my PC
Useful keyboard shortcuts
Roblox development notes
Chinese vocabulary
Programming concepts
Personal workflows
```

Do not restrict the Knowledge Base to college.

---

# 41. KNOWLEDGE TIMELINE

If the existing Timeline system supports it, Knowledge activity can eventually be included.

Do not build a separate Knowledge Timeline.

---

# 42. GLOBAL SEARCH INTEGRATION

Search should be able to discover:

```text
Notes
Topics
Tags
References
Academic Notes
Project Notes
```

Example:

```text
Search:
Flutter

Results:

TOPIC
Flutter

NOTES
Flutter Architecture
Riverpod Notes

PROJECT
OmniTenant

REFERENCE
Flutter Documentation
```

---

# 43. DASHBOARD INTEGRATION

Do not overwhelm the main Dashboard.

Potential small section:

```text
Recently Updated Knowledge

Derivatives
Flutter Architecture
OmniTenant Architecture
```

Only implement if it fits the existing dashboard.

---

# 44. DAILY PAGE INTEGRATION

Do not automatically show Knowledge Base content on Today unless relevant.

Knowledge should remain mostly accessible on demand.

---

# 45. FAVORITES

If an item is pinned/favorited:

Show it in:

```text
Knowledge Base → Favorites
```

Avoid duplicating it into another database.

---

# 46. ARCHIVE

Knowledge should support archival where useful.

Example:

```text
Archive
```

Archived notes should:

- remain stored
- remain searchable if configured
- disappear from default active views

Do NOT delete historical knowledge automatically.

---

# 47. DELETE POLICY

Normal deletion should follow the existing Notes deletion model.

If relationships exist:

Deleting a note must not accidentally delete:

```text
Other notes
Projects
Tasks
Academic records
Topics
```

Clean up references safely.

---

# 48. ORPHANED RELATIONSHIPS

If a note is deleted:

```text
A → related → deleted B
```

the relationship must be removed or safely ignored.

No broken links.

---

# 49. OFFLINE-FIRST

Knowledge Base must work offline.

Required:

```text
Create
Edit
Delete
Search
Tag
Topic
Relate
Favorite
Archive
```

must function locally.

---

# 50. DATABASE DESIGN

Prefer:

```text
Note
Topic
Tag
NoteTag
NoteRelationship
Reference
```

only if these structures do not already exist.

Reuse existing tables/models whenever possible.

Do NOT duplicate Note content.

---

# 51. SERVICE ARCHITECTURE

Preferred:

```text
Knowledge Base UI
        │
        ▼
Knowledge Service
        │
 ┌──────┼─────────┐
 ▼      ▼         ▼
Notes  Topics   Relations
Service Service Service
        │
        ▼
    Repository
        │
        ▼
      Database
```

Where existing services already provide the required functionality, call them instead.

---

# 52. SERVICE API

Conceptually support:

```text
createTopic()
updateTopic()
archiveTopic()

getTopics()
getNotesForTopic()

addTagToNote()
removeTagFromNote()

createRelationship()
removeRelationship()

getRelatedNotes()

createReference()
updateReference()
deleteReference()

searchKnowledge()
getRecentKnowledge()
getPinnedKnowledge()
```

Use actual project conventions.

---

# 53. AI COMPATIBILITY

Do NOT implement AI in Phase 15.

However, the architecture must remain ready for future AI.

Future examples:

```text
"Find my notes about Flutter."

"Show me everything I have about calculus."

"Summarize my notes about this topic."

"Connect this note with my Programming topic."

"Turn this idea into a project."
```

Future AI must call application services.

AI must NEVER directly manipulate the database.

---

# 54. FUTURE KNOWLEDGE GRAPH

Prepare the architecture for a future graph-like representation:

```text
Flutter
  │
  ├── OmniTenant
  ├── Programming
  ├── Dart
  ├── Riverpod
  └── Mobile Development
```

Do NOT implement a visual graph UI in Phase 15.

---

# 55. FUTURE AI KNOWLEDGE RETRIEVAL

The system should eventually support:

```text
User
 ↓
AI
 ↓
Knowledge Retrieval
 ↓
Relevant OmniLife notes
 ↓
AI response
```

For this reason:

- Keep note metadata structured.
- Keep relationships explicit.
- Keep topics and tags searchable.
- Do not store everything as unstructured blobs.

---

# 56. MOBILE UX

Mobile priority:

```text
Search Knowledge
Recent Notes
Create Note
Topics
Favorites
Open Note
```

The user should be able to quickly search something without navigating through many screens.

---

# 57. DESKTOP UX

Desktop may provide:

```text
Knowledge Base
Topics
Notes
References
Related Notes
```

Use existing responsive design.

Do NOT perform the final OmniLife UI overhaul in this phase.

---

# 58. QUICK ACTIONS

Recommended:

```text
+ New Note
+ New Topic
```

Optional:

```text
+ Reference
```

Do not overload the quick action menu.

---

# 59. KNOWLEDGE BASE HOME STRUCTURE

Suggested:

```text
Knowledge Base

[ Search Knowledge ]

Pinned

Recently Updated

Topics

Tags
```

Keep navigation predictable.

---

# 60. NOTE DETAIL STRUCTURE

Example:

```text
Derivatives

Topic:
Mathematics

Tags:
#calculus
#study

Content:
...

Related Notes:
Limits
Integrals

References:
...
```

Do not display empty sections.

---

# 61. TOPIC DETAIL STRUCTURE

Example:

```text
Mathematics

Notes
12

Related Courses
2

Projects
1

Tags
#college
#study

Recent Notes
...
```

Only show relevant information.

---

# 62. KNOWLEDGE FILTERS

Useful filters:

```text
Topic
Tag
Type
Created date
Updated date
Favorites
Archived
```

Do not implement all filters if the existing UI becomes overloaded.

Prioritize:

```text
Topic
Tag
Type
```

---

# 63. SORTING

Support basic:

```text
Recently updated
Recently created
Alphabetical
```

No complex ranking algorithm is needed.

---

# 64. DATA VALIDATION

Validate:

```text
Topic name cannot be empty.
Note relationship cannot reference itself.
Reference URLs should be valid when supplied.
Duplicate relationships should be prevented.
Deleted entities should not leave broken references.
```

---

# 65. MIGRATION

If database changes are required:

1. Create migration.
2. Preserve existing notes.
3. Preserve existing tags.
4. Preserve academic notes.
5. Preserve project notes.
6. Preserve task relationships.
7. Preserve search functionality.
8. Test application startup.
9. Test existing data.

Never silently destroy existing OmniLife data.

---

# 66. TESTING

Create tests for:

### Topics

```text
create
update
archive
list
note association
```

### Tags

```text
add
remove
filter
```

### Relationships

```text
create
remove
bidirectional discovery
self-reference rejection
duplicate prevention
```

### References

```text
create
update
delete
validation
```

### Search

```text
title
content
topic
tag
reference
```

---

# 67. ACCEPTANCE TEST 1 — NOTE

Create:

```text
Title:
Flutter Architecture
```

Expected:

```text
Note appears in existing Notes system.
Note appears in Knowledge Base.
```

---

# 68. ACCEPTANCE TEST 2 — TOPIC

Create:

```text
Topic:
Flutter
```

Assign:

```text
Flutter Architecture
```

Expected:

```text
Flutter topic shows the note.
```

---

# 69. ACCEPTANCE TEST 3 — TAG

Add:

```text
#programming
#mobile
```

Expected:

```text
Filtering by #programming finds the note.
```

---

# 70. ACCEPTANCE TEST 4 — RELATIONSHIP

Create:

```text
Note A:
Flutter Architecture

Note B:
Riverpod
```

Connect:

```text
A ↔ B
```

Expected:

```text
A shows B as related.
B shows A as related.
```

---

# 71. ACCEPTANCE TEST 5 — SEARCH

Search:

```text
Flutter
```

Expected:

```text
Topic:
Flutter

Note:
Flutter Architecture

Tag:
#flutter
```

if applicable.

---

# 72. ACCEPTANCE TEST 6 — ACADEMIC INTEGRATION

Create:

```text
Course:
Mathematics
```

Create:

```text
Topic:
Calculus
```

Create:

```text
Note:
Derivatives
```

Associate the note with the course/topic.

Expected:

```text
Course → Notes → Derivatives

Knowledge Base → Calculus → Derivatives
```

No duplicate note is created.

---

# 73. ACCEPTANCE TEST 7 — PROJECT INTEGRATION

Create:

```text
Project:
OmniTenant
```

Reference:

```text
Note:
Flutter Architecture
```

Expected:

```text
Project can navigate to the note.
Knowledge Base remains the source of the note.
```

---

# 74. ACCEPTANCE TEST 8 — OFFLINE

Disable internet.

Verify:

```text
Create note
Edit note
Create topic
Tag note
Search
Open related notes
```

Expected:

```text
Everything works locally.
```

---

# 75. ACCEPTANCE TEST 9 — REGRESSION

Verify previous systems:

```text
Phase 11
Global Search

Phase 12
Calendar
Scheduling
Reminders

Phase 13
Tasks
Projects

Phase 14
Academic
Courses
Assignments
Exams
```

No regressions are acceptable.

---

# 76. ACCEPTANCE TEST 10 — MOBILE

On Android verify:

```text
Open Knowledge Base
Search
Create Note
Open Topic
Open Note
View Related Notes
```

Expected:

```text
All core operations work.
```

---

# 77. DOCUMENTATION

Create/update:

```text
docs/KNOWLEDGE_BASE_ARCHITECTURE.md
```

Document:

```text
Knowledge Base concept
Notes
Topics
Tags
Relationships
References
Academic integration
Project integration
Task integration
Search integration
Database structure
Service architecture
Migration
Future AI compatibility
```

Update the main OmniLife architecture documentation.

---

# 78. UI CONSTRAINT

Do NOT perform the final OmniLife UI/UX overhaul.

Do NOT:

```text
❌ Redesign the entire application
❌ Replace global navigation
❌ Change global theme
❌ Remove existing features
❌ Merge modules prematurely
❌ Perform Indonesian/English localization yet
```

Only implement the UI required for Phase 15.

The major UI/UX simplification remains scheduled for the later final UI/UX phase.

---

# 79. SUCCESS DEFINITION

Phase 15 is successful when OmniLife can transform its Notes into a structured but still simple personal knowledge system.

The final conceptual structure should be:

```text
                    KNOWLEDGE BASE
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
           TOPICS         TAGS        REFERENCES
             │
             ▼
           NOTES
             │
       ┌─────┼─────────────┐
       ▼     ▼             ▼
   ACADEMIC PROJECTS    PERSONAL
       │     │             │
       └─────┼─────────────┘
             ▼
        RELATIONSHIPS
             │
             ▼
       GLOBAL SEARCH
```

And OmniLife should eventually be able to understand:

> "Informasi ini bukan sekadar note. Ini adalah bagian dari knowledge-ku dan mungkin berhubungan dengan course, project, task, atau note lainnya."

---

# 80. DO NOT MOVE FORWARD IF

Do not consider Phase 15 complete if:

```text
❌ Existing Notes are duplicated
❌ Existing Notes are lost
❌ Search regresses
❌ Academic Notes break
❌ Project relationships break
❌ Topics cannot organize notes
❌ Tags do not work
❌ Related Notes create broken references
❌ Offline operation fails
❌ Mobile operation fails
❌ Existing Phase 11–14 features regress
❌ Database migration loses data
❌ AI is directly connected to the database
```

Fix all regressions before proceeding.

---

# 81. FINAL IMPLEMENTATION REPORT

When implementation is complete, provide:

```text
OMNILIFE PHASE 15 REPORT

Status:
COMPLETED / PARTIAL / BLOCKED

Knowledge Base:
- ...

Notes:
- ...

Topics:
- ...

Tags:
- ...

Relationships:
- ...

References:
- ...

Academic Integration:
- ...

Project Integration:
- ...

Task Integration:
- ...

Global Search:
- ...

Mobile:
- ...

Offline:
- ...

Database Migration:
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
- Phase 16
```

---

# FINAL ARCHITECTURAL PRINCIPLE

Do not think of Phase 15 as:

```text
"Build another Notes app."
```

Think of it as:

```text
                    OMNILIFE
                       │
                       ▼
                KNOWLEDGE BASE
                       │
       ┌───────────────┼────────────────┐
       ▼               ▼                ▼
    ACADEMIC        PROJECTS         PERSONAL
       │               │                │
       ▼               ▼                ▼
     NOTES           NOTES            NOTES
       │               │                │
       └───────────────┼────────────────┘
                       ▼
                  RELATIONSHIPS
                       │
                       ▼
                  GLOBAL SEARCH
```

The Knowledge Base becomes the **long-term memory of the user's life inside OmniLife**.

Keep it simple for normal usage, but structured enough that future OmniLife features—especially AI, Analytics, Goals, and the eventual UI/UX simplification—can use the same underlying information without rebuilding the system.

Do not implement AI, cloud synchronization, multi-user functionality, or the final UI/UX overhaul in this phase.
# OmniLife — ACA-02F  
## Academic ↔ Study, Tasks, Notes & Chinese Learning Integration

**Status:** Implementation Ready  
**Depends On:** ACA-02A through ACA-02E  
**Goal:** Connect each academic course and class to Study, Tasks, Notes, exams, and Chinese Learning through reusable links and course workspaces.

## 1. Core Principle

A course should become the context for academic work, not a duplicate copy of it.

```text
Course / Course Class
        ↓
Course Workspace (derived view)
        ├── Tasks
        ├── Notes
        ├── Study sessions
        ├── Academic events / exams
        └── Chinese Learning resources
```

A task remains a Task.  
A note remains a Note.  
A study session remains a Study record.  
Chinese vocabulary remains Chinese Learning content.

The Academic module only provides their shared context.

## 2. Main User Experience

When a user opens a selected course class, for example:

```text
Chinese Comprehensive 1 — Class B
```

they should immediately be able to see:

```text
Upcoming classes
Upcoming UTS/UAS and deadlines
Tasks for this course
Notes for this course
Study activity for this course
Related Chinese Learning resources
Course information and RPS
```

The user must not repeatedly type course names, class codes, and semester information into every module.

## 3. Course Workspace

Create a **Course Workspace** as a derived, query-based interface.

```text
Course Workspace
├── Overview
├── Tasks
├── Notes
├── Study
├── Exams & Events
├── Chinese Learning
└── Course Information
```

Do not create a second permanent “workspace data store” containing copied course data.

The workspace is built from:

```text
Course
CourseClass
StudyPlanItem
AcademicCalendarEvent
Existing Tasks
Existing Notes
Existing Study records
Existing Chinese Learning content
```

## 4. Required Link Model

Create a generic cross-module relationship model or equivalent architecture.

```text
AcademicResourceLink
- id
- ownerId
- sourceType: course | course_class | study_plan | academic_event
- sourceId
- targetType: task | note | study_session | study_plan_item | chinese_collection | chinese_item
- targetId
- relationshipType: primary | related | preparation | reference
- createdAt
- updatedAt
```

Requirements:

- Support one item linked to more than one course when genuinely needed.
- Support links at Course level and Course Class level.
- Prefer Course Class links for semester-specific work.
- Preserve stable IDs and SYN-01 sync metadata.
- Validate that linked records belong to the same signed-in user.
- Do not use course names as relationship identifiers.

## 5. Context Rules

Use these defaults:

```text
Course
= long-term subject context

Course Class
= semester-specific context

Study Plan / KRS
= selected enrollment context

Academic Event
= specific deadline, UTS, UAS, or activity context
```

Example:

```text
General notes about Chinese calligraphy
→ link to Course

Assignment for Class B this semester
→ link to Course Class

UTS preparation checklist
→ link to UTS Academic Event + Course Class
```

## 6. Task Integration

Tasks may be created from a Course Workspace or linked from the global Tasks module.

```text
Course Workspace
        ↓
Create Task
        ↓
Normal OmniLife Task
        +
AcademicResourceLink
```

Task display should include academic context:

```text
Makalah Lintas Budaya
Due: 18 August
Course: Pemahaman Lintas Budaya — Class B
```

Requirements:

- A task created globally may later be linked to a course.
- A task may link to a specific academic event, such as UTS.
- Task completion remains controlled by the existing Tasks module.
- Do not create duplicate tasks automatically from every class session or course material.
- Display linked tasks in both the Task module and the relevant Course Workspace.

## 7. Notes Integration

Notes may be created from the Course Workspace or linked from the global Notes module.

```text
Course Workspace
        ↓
Create Note
        ↓
Normal OmniLife Note
        +
AcademicResourceLink
```

Possible note contexts:

```text
Lecture note
Reading summary
Assignment draft idea
Exam preparation note
Personal reflection
```

Requirements:

- A note can be linked to a Course, Course Class, or Academic Event.
- Existing notes remain untouched until the user explicitly links them.
- Notes are not deleted when a KRS item is dropped or a semester ends.
- The course workspace may filter notes by linked class and term.
- Do not create a separate note editor for Academic.

## 8. Study Integration

Study activity should connect to the relevant class without becoming a separate academic study system.

```text
Course Workspace
        ↓
Start Study Session
        ↓
Existing Study module
        +
AcademicResourceLink
```

Examples:

```text
Review CPMK 2 material
Read RPS reference
Prepare for UTS
Practice Chinese vocabulary for Chinese Comprehensive 1
```

Requirements:

- Study sessions may link to a Course, Course Class, or Academic Event.
- Existing Study statistics remain the source of truth.
- Course Workspace may show total study time, recent sessions, and upcoming planned sessions when supported.
- Do not automatically create study sessions for every scheduled class.
- Do not create a second timer or second progress system.

## 9. Exam and Event Preparation

Academic events such as UTS, UAS, quizzes, or assignment deadlines should offer optional actions:

```text
[ Create Preparation Task ]
[ Create Study Session ]
[ Create Exam Note ]
```

Each action creates a normal item in its own module plus the appropriate links.

Rules:

- These are user-triggered actions.
- Do not automatically create tasks or notes for every event.
- Event-linked tasks and notes remain visible from both the Academic Event detail and Course Workspace.

## 10. Chinese Learning Integration

Chinese Learning integration must be intentional and content-based.

```text
Chinese-related Course
        ↓
Related Chinese Learning collection or item
        ↓
Course Workspace Chinese Learning tab
```

Support links such as:

```text
Course
→ Chinese vocabulary collection

Course
→ Hanzi collection

Course
→ Grammar topic

Course Class
→ Listening practice set

Academic Event
→ UTS review set
```

Requirements:

- Reuse existing Chinese Learning content and practice engines.
- Do not copy vocabulary, Hanzi, pinyin, audio, or review-state data into Academic.
- Chinese Learning progress remains owned by Chinese Learning.
- A course may show related content and provide “Open Chinese Learning” actions.
- A user may manually link a course to relevant Chinese resources.
- Do not automatically add all course materials into SRS or mark anything as learned.

Example:

```text
Chinese Comprehensive 1
        ↓
Related resources
- HSK 1 vocabulary collection
- Lesson 3 grammar
- Listening practice: greetings
```

## 11. Course Workspace Overview

The Overview tab should summarize existing linked information.

```text
Next Class
Upcoming Academic Event
Open Tasks
Recent Notes
Study This Week
Related Chinese Learning
Quick Actions
```

Quick actions:

```text
Create Task
Create Note
Start Study
Open Weekly Schedule
Open Academic Calendar
Open Related Chinese Learning
```

The overview must never become a duplicate dashboard. It is specific to one course/class.

## 12. KRS Lifecycle and Historical Data

When a class is removed from a current KRS:

```text
KRS item becomes dropped or inactive
        ↓
Existing linked tasks, notes, study history, and Chinese links remain intact
        ↓
Course Workspace becomes archived or historical for that term
```

Rules:

- Never delete learning history due to a KRS change.
- Never delete notes or completed tasks when a semester ends.
- Historical Course Workspaces remain accessible through term/history filters.
- Clearly label inactive or dropped class contexts.

## 13. Synchronization Requirements

All academic links must synchronize through SYN-01.

```text
Create task linked to a course on Desktop while offline
        ↓
Task and relationship save locally
        ↓
Sync after reconnection
        ↓
The same linked task appears in Android/PWA later
```

Requirements:

- Sync the source item and relationship safely.
- Avoid duplicate links on retries.
- If a target item is deleted, preserve link cleanup or mark it unavailable.
- Do not create a separate sync system for linked resources.

## 14. Privacy and Integrity

- Linked resources must belong to the signed-in user.
- Cross-user links must be rejected.
- Deleting a Course/Class must not silently delete linked Tasks, Notes, or Study history.
- Deleting a Task/Note/Study record must remove or invalidate only its relationship link.
- Keep sensitive note content governed by existing Notes privacy/storage rules.

## 15. Explicitly Out of Scope

Do not implement:

```text
Automatic AI-generated study plans
Automatic task generation from RPS
Automatic import of Chinese vocabulary from external RPS links
Automatic SRS enrollment
New task, note, or study engines
Native Android-specific UI
Schedule PNG/PDF export
Google/Outlook Calendar integration
Official SIAKAD integration
Grades, KHS, IPS, IPK, or transcript
```

## 16. Testing Requirements

Test at minimum:

```text
1. Create a task from a Course Workspace
   → appears in both Tasks and the linked course.

2. Link an existing note to a Course Class
   → appears in the Course Workspace without duplication.

3. Start a study session from a class
   → uses the existing Study system and stores course context.

4. Link a UTS event to a preparation task
   → both event and task show their relationship.

5. Link Chinese vocabulary collection to a course
   → opens the existing Chinese Learning resource.

6. Drop a KRS class
   → existing notes, tasks, and study history remain safe.

7. Sync a linked item after offline work
   → no duplicate target or duplicate relationship appears.

8. Attempt to link data from another user
   → rejected by security validation.

9. Open an archived semester
   → historical course workspace remains readable.
```

## 17. Acceptance Criteria

ACA-02F is complete when:

1. Every selected Course Class has a derived Course Workspace.
2. Tasks can be created and linked to courses/classes without duplication.
3. Notes can be created and linked to courses/classes without duplication.
4. Study sessions can carry academic context while using the existing Study system.
5. UTS/UAS and deadlines can link to preparation tasks, notes, and study records.
6. Courses can link to existing Chinese Learning resources.
7. Chinese Learning progress remains owned by Chinese Learning.
8. Dropping a KRS item never deletes personal work.
9. All links synchronize securely through SYN-01.
10. Existing module behavior remains intact.

## 18. Next Phase

After ACA-02F is complete:

```text
ACA-02G — Beautiful Academic Schedule Export
```

This phase will produce a polished weekly schedule in PNG/JPG and PDF formats, ready for phone wallpaper, sharing, or printing.
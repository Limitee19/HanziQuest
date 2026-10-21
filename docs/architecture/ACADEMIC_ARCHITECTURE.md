# OmniLife — Academic & College Management Architecture

**Project:** OmniLife  
**Module:** Academic Management 2.0 (Phase 14)  
**Date:** August 12, 2026  

---

## 1. Overview

Phase 14 establishes OmniLife's **Academic & College Management System**. 

The core architectural principle of Phase 14 is:
> **Academic is an orchestration context layer, not a second copy of OmniLife's existing systems.**

---

## 2. Entity Hierarchy & Context Layers

```text
ACADEMIC PROFILE (Institution, Major, Student ID)
       │
       ▼
   SEMESTER (Year, Term, Active/Completed/Archived)
       │
       ▼
    COURSE (Name, Code, Credits, Lecturer, Room)
       │
   ┌───┼─────────────────────────┐
   ▼   ▼                         ▼
CLASS SCHEDULE              ASSIGNMENTS               EXAMS
 (Recurring)                (Linked Tasks)       (Timed Events)
   │                             │                     │
   ▼                             ▼                     ▼
CALENDAR SERVICE            TASK SERVICE        CALENDAR & REMINDER
```

---

## 3. Orchestration Rules

1. **Assignments ↔ Task Integration**:
   - Creating an Assignment in `academicService.ts` automatically creates/links a Task in `taskService.ts`.
   - Completing the Task automatically marks the Assignment status as `completed`.
2. **Class Schedules & Exams ↔ Calendar Integration**:
   - Class recurring slots register directly with `calendarService.ts`.
   - Exam dates and times register with both `calendarService.ts` and `reminderService.ts`.
3. **Course Notes & Course Projects**:
   - Course notes reference `courseId` inside the main `notes` table.
   - Course projects reference `courseId` inside the main `projects` table.
4. **Global Search Indexing**:
   - `AcademicSearchProvider.ts` indexes Courses, Assignments, Exams, and Course Notes for `Ctrl + K` Command Palette searches.

# OmniLife Academic OS — AI Agent Implementation Prompt

## 0. Role

You are an AI software-development agent working on **OmniLife**, a personal life-management application.

Your task is to design and implement the **Academic OS / College Management module** for a university student, with a specific focus on integrating the student's **SIAKAD** and **SIPEJAR** information into one coherent personal academic system.

Do not treat this as a standalone school-management application. It is a personal academic layer inside OmniLife and must integrate naturally with existing/global OmniLife concepts such as Tasks, Calendar, Reminders, Notes, Search, Analytics, and AI assistance.

---

# 1. User Context

The primary user is:

- University: **Universitas Negeri Malang (UM)**
- Faculty: **Fakultas Sastra (FS)**
- Program: **S1 Pendidikan Bahasa Mandarin**
- Entry cohort: **2026**
- Current semester: **Semester 1**
- Current academic year: **2026/2027**
- Current semester load: **20 SKS**
- Academic target: **IPK > 3.5**, ideally **3.7–4.0**
- Graduation target: **7 semesters / 3.5 years**, if academically feasible
- Mandarin level: approximately early HSK 1 by self-assessment; Pinyin is relatively okay, but zh/ch/sh/x and related sounds remain difficult
- Career interests:
  - Translator
  - Working at a Chinese company
  - Potential side business
- Side skills:
  - Coding
  - Roblox development
  - Selling Roblox assets/plugins
- Personal challenges:
  - Adapting to university as a new student
  - Fear of falling behind peers
  - Introversion/shyness, especially for presentations and similar assignments

The application must support these goals without assuming that every personal goal is an academic requirement.

---

# 2. Current Semester Data

The current SIAKAD data provided by the user contains:

| Code | Course | Credits |
|---|---|---:|
| PMDR236001 | Chinese Comprehensive 1 | 8 |
| PMDR236009 | Pemahaman Lintas Budaya | 2 |
| PMDR236010 | Kaligrafi Tiongkok | 2 |
| PMDR236026 | Kesenian Tiongkok | 2 |
| UNIV236001 | Pendidikan Agama Islam | 3 |
| UNIV236012 | Perkembangan Peserta Didik | 3 |
| | **Total** | **20** |

This data is evidence of the student's actual current semester and should not be replaced by an assumed or outdated curriculum.

The student has access to SIPEJAR.

At the beginning of the semester, SIPEJAR currently shows only one course:

**Perkembangan Peserta Didik**

This is expected to be incomplete because it is the student's first day of classes. Do not interpret missing SIPEJAR courses as missing academic courses.

The SIPEJAR course structure appears to provide detailed per-meeting learning information, including materials and assignments.

---

# 3. Core Product Vision

Build:

> **SIAKAD + SIPEJAR + OmniLife = One Personal Academic System**

The three systems have different responsibilities.

## SIAKAD

Treat SIAKAD as the source of official academic structure, such as:

- Enrolled courses
- Course codes
- Credits/SKS
- Class
- Lecturer
- KRS
- Semester
- Schedule
- Grades
- Academic status
- Academic history

Conceptually:

> **SIAKAD answers: "What am I officially taking?"**

## SIPEJAR

Treat SIPEJAR as the source of official learning execution, such as:

- Courses
- Course sections
- Meetings
- Learning materials
- Assignments
- Quizzes
- Exams
- Deadlines
- Learning progress
- Attendance/progress information when available

Conceptually:

> **SIPEJAR answers: "What do I need to learn and do?"**

## OmniLife

OmniLife is neither a replacement for SIAKAD nor a replacement for SIPEJAR.

It is the student's:

> **Personal Academic Control Center**

OmniLife should collect, normalize, connect, organize, analyze, and act upon information from both systems.

---

# 4. Non-Negotiable Product Principles

## 4.1 Do not duplicate external systems unnecessarily

Do not try to recreate the entire SIAKAD or SIPEJAR.

Only model and store the information needed for the user's personal academic workflow.

## 4.2 Preserve source authority

When data originates from SIAKAD or SIPEJAR, preserve the source.

Example:

- `source = SIAKAD`
- `source = SIPEJAR`
- `source = OmniLife`

Do not silently overwrite official source data with AI-generated assumptions.

## 4.3 Never invent academic data

Especially do not invent:

- Semester 2–8 course lists
- Prerequisites
- Graduation requirements
- Credit limits
- Course availability
- Exam dates
- Lecturer information
- Official deadlines
- Curriculum changes

If information has not been confirmed, mark it as:

- Unknown
- Unverified
- Planned
- Estimated

## 4.4 Support changing curricula

The student belongs to the 2026 cohort.

The system must allow the curriculum to change or be updated without requiring a full redesign.

Do not hardcode a static 8-semester curriculum.

## 4.5 Keep official data and personal planning separate

For example:

```text
Official:
Chinese Comprehensive 1 = 8 SKS

Personal:
Target grade = A

Personal:
Study confidence = 65%

AI:
Recommended study time = 5 hours/week
```

These must not be mixed into one undifferentiated data field.

---

# 5. Academic Information Architecture

Implement the following conceptual modules.

```text
Academic
│
├── Dashboard
├── Academic Profile
├── Curriculum Map
├── Graduation Planner
│   └── 7-Semester Target
├── Semester Management
│   ├── Semester 1
│   ├── Semester 2
│   └── ...
├── Courses
│   ├── Course Overview
│   ├── Course Intelligence
│   └── Course Notes
├── SIAKAD Integration
│   ├── KRS
│   ├── Schedule
│   ├── Grades
│   └── Credits
├── SIPEJAR Integration
│   ├── Courses
│   ├── Meetings
│   ├── Materials
│   ├── Assignments
│   ├── Quizzes
│   └── Progress
├── Mandarin Progress
├── Academic Tasks
└── Academic Analytics
```

---

# 6. Academic Profile

Create an Academic Profile containing relevant user-level academic information.

Suggested fields:

- University
- Faculty
- Program
- Cohort
- Current semester
- Current academic year
- Current credits
- Target IPK
- Graduation target semester
- Career interests
- Academic strengths
- Academic concerns
- Learning preferences
- Mandarin level
- Other relevant skill goals

The profile should be editable.

Sensitive credentials must never be stored here.

Never store:

- SIAKAD password
- SIPEJAR password
- OTP
- authentication tokens
- banking information
- unrelated sensitive identity information

---

# 7. Course Entity

Create a normalized internal `Course` entity.

Suggested conceptual fields:

```text
Course
- id
- official_code
- name
- credits
- semester
- academic_year
- class
- lecturer
- status
- source
- source_reference
- linked_sipejar_course_id
- linked_siakad_course_id
- created_at
- updated_at
```

The internal course must be capable of linking one SIAKAD course to one or more relevant SIPEJAR representations if necessary.

Do not assume that names alone are sufficient for matching.

Preferred matching order:

1. Official course code
2. Official external ID
3. Course section/class
4. Lecturer
5. Semester
6. Course name
7. Fuzzy/manual matching as fallback

If automatic matching is uncertain, ask for confirmation instead of silently linking the wrong courses.

---

# 8. Course Linking

This is a core feature.

Example:

### SIAKAD

```text
PMDR236001
Chinese Comprehensive 1
8 SKS
Class B
```

### SIPEJAR

```text
Chinese Comprehensive 1
Week 1
Materials
Assignment
Quiz
...
```

OmniLife should recognize them as the same academic course.

The UI should show:

> **Linked Course**

with source indicators.

Possible states:

- Linked automatically
- Linked manually
- Suggested match
- Not linked
- Conflict detected

---

# 9. Course Intelligence

Every course should have a unified dashboard.

Example:

## Chinese Comprehensive 1

### Academic

- Credits: 8
- Lecturer
- Class
- Schedule
- Current grade
- Target grade

### Learning

- Meetings
- Materials
- Assignments
- Quizzes
- Exams
- Completion progress

### Personal

- Confidence
- Difficulty
- Study time
- Notes
- Weak topics
- Personal goals

### AI Analysis

Examples:

> You have 2 incomplete learning activities.

> A major assignment is due in 3 days.

> Your recent self-assessment shows difficulty with pronunciation.

> Consider reviewing vocabulary before the next meeting.

AI recommendations must be clearly marked as recommendations, not official university instructions.

---

# 10. Semester Dashboard

Create a semester-level dashboard.

For each active semester show:

- Total SKS
- Number of courses
- Course progress
- Assignment workload
- Upcoming deadlines
- Exam schedule
- Current grades
- Target grades
- Attendance when available
- Study workload
- Academic risk
- Overall semester health

Example:

```text
Semester 1 — 20 SKS

Chinese Comprehensive 1      8 SKS   🟡
Pemahaman Lintas Budaya      2 SKS   🟢
Kaligrafi Tiongkok           2 SKS   🟢
Kesenian Tiongkok            2 SKS   🟢
Pendidikan Agama Islam      3 SKS   🟢
Perkembangan Peserta Didik  3 SKS   🟡
```

Risk indicators must be explainable.

Do not label a course "at risk" simply because progress is low on the first day.

---

# 11. SIPEJAR Learning Structure

Represent the learning hierarchy:

```text
SIPEJAR Course
│
├── Meeting 1
│   ├── Material
│   ├── Activity
│   ├── Assignment
│   └── Quiz
│
├── Meeting 2
│   ├── Material
│   └── Assignment
│
└── ...
```

Each item should support:

- Title
- Type
- Description
- Deadline
- Completion status
- Source URL/reference when available
- Related course
- Related meeting
- Estimated effort
- Priority
- OmniLife task linkage

---

# 12. SIPEJAR Assignment → OmniLife Task

This is a major integration.

When SIPEJAR provides:

> Assignment: Rangkuman materi  
> Deadline: 28 August

OmniLife should be able to create:

> **Task: Rangkuman Perkembangan Peserta Didik**

with:

- Course
- Deadline
- Source = SIPEJAR
- Priority
- Estimated duration
- Status
- Related meeting
- Related calendar event if desired

The user should be able to:

- Import
- Ignore
- Edit personal metadata
- Mark complete

Do not change the official SIPEJAR deadline unless explicitly creating a personal planning deadline.

---

# 13. Calendar Integration

Academic deadlines should connect to the global OmniLife Calendar.

Potential events:

- Classes
- Exams
- Assignment deadlines
- Study sessions
- Presentations
- Academic appointments

Use distinct concepts:

```text
Official Event:
Assignment due 28 Aug

Personal Planning:
Work on assignment 26 Aug 19:00–20:00
```

The official deadline should remain unchanged.

---

# 14. Reminder Integration

Allow reminders based on:

- Assignment deadline
- Exam
- Presentation
- Upcoming class
- Unfinished learning activity
- Personal study plan

The AI may suggest reminders but must not create excessive notifications automatically.

---

# 15. Curriculum Map

Create a long-term curriculum map.

It must support:

- Semester 1–8 or beyond
- Planned courses
- Completed courses
- Current courses
- Credits
- Course categories
- Prerequisites
- Course availability
- Required/elective status
- Curriculum version
- Cohort

The system must explicitly distinguish:

```text
Official curriculum
vs
User plan
vs
AI projection
```

---

# 16. Graduation Planner

The user has an ambitious target:

> **Graduate in 7 semesters / 3.5 years**

This is a goal, not an assumption.

The planner must validate whether the target is actually feasible.

Known target:

```text
Normal target: 8 semesters
User target: 7 semesters
Known total graduation requirement: 146 SKS
```

Do not simply divide:

```text
146 / 7
```

and declare feasibility.

The planner must account for:

- Maximum credits per semester
- Required courses
- Prerequisites
- Courses offered only in certain semesters
- Required sequencing
- KKN
- KPL/practicum
- Thesis/research requirements
- University/faculty rules
- Course availability
- Possible schedule conflicts
- Failed/repeated courses
- Other graduation requirements

If any required information is unknown, display:

> **Feasibility cannot yet be confirmed.**

---

# 17. Graduation Simulator

Create a simulation layer.

Possible statuses:

### 🟢 On Track
Current plan can satisfy requirements.

### 🟡 Conditional
Possible, but depends on unresolved conditions.

### 🔴 At Risk
Current plan makes the target unlikely.

### ⚪ Unknown
Insufficient official data.

Example:

```text
Graduation Goal
7 Semesters

Credits completed: 20 / 146

Required remaining: 126 SKS

Status:
🟡 Conditional

Reason:
Semester 2–7 curriculum availability has not yet been verified.
```

This is preferable to giving false certainty.

---

# 18. Curriculum Dependency Graph

Represent prerequisite relationships.

Example:

```text
Chinese Comprehensive 1
        ↓
Chinese Comprehensive 2
        ↓
Chinese Comprehensive 3
        ↓
Chinese Comprehensive 4
```

Or:

```text
Prerequisite A
      ↓
Course B
      ↓
Practicum
      ↓
Thesis
```

The graph should support:

- prerequisite
- co-requisite
- recommended sequence
- required-before
- elective dependency

If a prerequisite is unknown, mark it unknown.

---

# 19. Dynamic Academic Roadmap

Do not create a static four-year roadmap.

Create a dynamic roadmap that can recalculate after new official data is imported.

Conceptually:

```text
Current Semester
      ↓
Completed Credits
      ↓
Remaining Curriculum
      ↓
Prerequisites
      ↓
Course Availability
      ↓
Graduation Constraints
      ↓
7-Semester Simulation
      ↓
Academic Roadmap
```

The roadmap should update when:

- a course is completed
- a grade changes
- a course is added
- a course is dropped
- a prerequisite changes
- a new curriculum version is imported
- a course becomes unavailable
- graduation requirements change

---

# 20. Mandarin Progress

Mandarin development must be integrated with the Academic OS rather than existing as an isolated language-learning feature.

Track:

- 听力 — Listening
- 口语 — Speaking
- 阅读 — Reading
- 写作 — Writing
- 汉字 — Hanzi
- 词汇 — Vocabulary
- 语法 — Grammar
- 发音 — Pronunciation
- HSK progress
- Translation skill

Example:

```text
Mandarin Progress

Listening       ███░░░
Speaking        ██░░░░
Reading         ███░░░
Writing         ██░░░░
Hanzi           ███░░░
Vocabulary      ███░░░
Grammar         ██░░░░
Pronunciation   ██░░░░
```

This can combine:

- course performance
- self-assessment
- quizzes
- study logs
- AI analysis
- external learning activities

Do not claim an official HSK level unless supported by an official test result.

The user's current level is only a self-assessment around early HSK 1.

---

# 21. Academic Task System

Academic tasks should integrate with the global OmniLife Task Manager.

Every academic task should have:

- Task title
- Course
- Source
- Deadline
- Priority
- Estimated effort
- Status
- Academic category
- Related meeting
- Related material
- Calendar linkage
- Reminder linkage

Example:

```text
Task
└── Complete Chinese Comprehensive 1 assignment
    ├── Course: Chinese Comprehensive 1
    ├── Source: SIPEJAR
    ├── Deadline: ...
    ├── Priority: High
    └── Calendar plan: ...
```

---

# 22. AI Academic Assistant

The AI assistant should be able to answer questions such as:

### Daily

> What do I have to do today?

### Weekly

> What are my most important academic tasks this week?

### Course

> What am I behind on in Chinese Comprehensive 1?

### Workload

> Is this week overloaded?

### Grade

> What grades do I need to maintain my IPK target?

### Graduation

> Am I still on track for 7 semesters?

### Mandarin

> What Mandarin skills seem weakest right now?

### Planning

> When should I work on this assignment?

AI must always distinguish:

- official source information
- user-entered information
- calculated information
- AI recommendation
- uncertain/inferred information

---

# 23. Academic Analytics

Provide useful analytics without overwhelming the user.

Potential metrics:

## Academic

- IPK
- IPS
- SKS completed
- SKS remaining
- Grade distribution
- Target vs actual grade

## Workload

- Tasks/week
- Estimated study hours
- Deadline density
- Overdue tasks

## Learning

- Course progress
- Material completion
- Assignment completion
- Quiz performance
- Study consistency

## Mandarin

- Vocabulary growth
- Skill balance
- Pronunciation difficulty
- Listening practice
- HSK progress

## Graduation

- Credits completed
- Credits remaining
- Required courses remaining
- 7-semester feasibility
- Graduation risk

---

# 24. Academic Risk Engine

Build explainable risk detection.

Examples:

### Low Risk
- Tasks completed on time
- Course progress aligned
- Grades healthy

### Medium Risk
- Several approaching deadlines
- Some incomplete materials
- Grade below personal target

### High Risk
- Repeated overdue assignments
- Failed prerequisite
- Insufficient credits
- Graduation dependency conflict

Do not infer psychological or medical conditions.

Do not label the student negatively.

Use neutral language such as:

> "Needs attention"

instead of:

> "You are failing."

---

# 25. First-Day Behavior

The current SIPEJAR screenshot shows only one available course.

The system must handle this correctly.

If SIAKAD has 6 active courses but SIPEJAR has only 1:

```text
SIAKAD:
6 courses

SIPEJAR:
1 course currently available
```

Display:

> **1 of 6 courses currently linked/available in SIPEJAR.**

Do NOT:

> Delete the other 5 courses.

Do NOT:

> Mark them as missing.

Do NOT:

> Assume the courses are not being taught.

Possible state:

> `Awaiting SIPEJAR availability`

---

# 26. Sync Model

Design for future synchronization.

Conceptually:

```text
External Source
      ↓
Import / Sync
      ↓
Normalization
      ↓
Matching
      ↓
Conflict Detection
      ↓
OmniLife Academic Database
      ↓
Tasks / Calendar / Analytics / AI
```

Support sync states:

- New
- Updated
- Unchanged
- Conflict
- Unavailable
- Awaiting confirmation

Do not overwrite user-created personal metadata when external data updates.

---

# 27. Conflict Handling

Example:

SIAKAD:

```text
Course name = X
```

SIPEJAR:

```text
Course name = Y
```

but course codes suggest they are identical.

The system should show:

> Possible match detected.

and allow:

- Confirm
- Reject
- Review

Another example:

Official deadline:

> 28 Aug

Personal planning deadline:

> 26 Aug

These are not a conflict.

They represent:

- official deadline
- personal target

---

# 28. UI/UX Direction

The Academic OS should feel like a personal control center, not an administrative university portal.

Prioritize:

- clarity
- hierarchy
- low cognitive load
- actionable information
- visual progress
- deadlines
- course health
- graduation trajectory

A user should be able to understand in a few seconds:

> What do I need to do today?

> What is at risk?

> What is coming next?

> Am I on track?

---

# 29. Academic Dashboard Example

The dashboard could contain:

```text
GOOD MORNING

Semester 1
20 SKS

┌──────────────────────────────┐
│ Academic Health       87/100 │
└──────────────────────────────┘

TODAY
- Chinese Comprehensive 1
- Perkembangan Peserta Didik

UPCOMING
- Assignment PPD — 2 days
- Quiz CC1 — 4 days

COURSE HEALTH
- CC1 — Attention
- PPD — Good
- Lintas Budaya — Good

MANDARIN
- Early HSK 1
- Pronunciation needs attention

GRADUATION
7-Semester Goal
Status: Conditional
```

This is only a conceptual UI; adapt it to OmniLife's existing design system.

---

# 30. Development Phases

Do not implement everything at once.

## Phase A — Foundation

Implement:

- Academic Profile
- Semester
- Course
- SKS
- Schedule
- Basic grade model
- SIAKAD data model
- SIPEJAR data model
- Basic Academic Dashboard

Goal:

> Have a reliable academic data foundation.

---

## Phase B — Course Integration

Implement:

- SIAKAD Course ↔ SIPEJAR Course linking
- Meeting
- Material
- Assignment
- Quiz
- Progress
- Source tracking
- Matching/conflict handling

Goal:

> One unified course view.

---

## Phase C — Productivity Integration

Implement:

- SIPEJAR Assignment → OmniLife Task
- Calendar integration
- Reminder integration
- Academic task filters
- Deadline dashboard

Goal:

> Turn academic information into actionable work.

---

## Phase D — Intelligence

Implement:

- Course Intelligence
- Academic risk
- Workload analysis
- Grade analysis
- AI study recommendations
- Weekly academic review
- Mandarin progress analysis

Goal:

> Make OmniLife proactively useful.

---

## Phase E — Long-Term Academic Planning

Implement:

- Curriculum Map
- Prerequisite graph
- Graduation Planner
- 7-semester simulation
- Dynamic Academic Roadmap
- Graduation risk
- Career-oriented academic planning

Goal:

> Make OmniLife capable of managing the student's entire university journey.

---

# 31. MVP Priority

If implementation resources are limited, prioritize:

### P0 — Must Have

1. Course entity
2. Semester
3. SIAKAD course data
4. SIPEJAR course data
5. Course linking
6. Meetings
7. Materials
8. Assignments
9. Assignment → Task
10. Deadline tracking
11. Academic Dashboard

### P1 — Important

12. Calendar integration
13. Reminder integration
14. Grades
15. Course Intelligence
16. Academic Profile
17. Basic Mandarin Progress

### P2 — Advanced

18. Curriculum Map
19. Prerequisite graph
20. Graduation Planner
21. 7-semester simulator
22. Academic Risk Engine
23. AI Academic Assistant
24. Academic Analytics

---

# 32. Acceptance Criteria

The implementation should be considered successful when:

### Course Integration

- A SIAKAD course can exist independently.
- A SIPEJAR course can exist independently.
- The two can be linked.
- Incorrect matches can be rejected.
- Source information is preserved.

### SIPEJAR

- Meetings can be represented.
- Materials can be represented.
- Assignments can be represented.
- Deadlines can be represented.
- Progress can be represented.

### Tasks

- SIPEJAR assignments can become OmniLife tasks.
- Official deadline and personal planning deadline are distinct.
- Completing the OmniLife task does not falsely claim that the official SIPEJAR submission occurred unless such synchronization is explicitly supported.

### Semester

- Total credits are calculated correctly.
- Active courses are visible.
- Course progress is summarized.
- Upcoming deadlines are visible.

### Graduation

- 146 SKS can be represented as a configurable requirement.
- 7 semesters can be represented as the user's goal.
- The system does not falsely claim that graduation in 7 semesters is guaranteed.
- Missing curriculum/prerequisite data produces an "unknown/conditional" state rather than an invented answer.

### Data Safety

- No password storage.
- No OTP storage.
- No authentication token storage.
- No sensitive credentials in academic profile.
- External-source data and personal data remain distinguishable.

---

# 33. Things the AI Agent Must NOT Do

Do not:

1. Invent semester 2–8 courses.
2. Assume an old curriculum is the 2026 curriculum.
3. Assume a course prerequisite without evidence.
4. Treat absent SIPEJAR courses as cancelled courses.
5. Replace official SIAKAD/SIPEJAR information with AI guesses.
6. Automatically overwrite personal planning data.
7. Store university passwords or OTPs.
8. Claim that the user is guaranteed to graduate in 7 semesters.
9. Build every feature simultaneously if the existing OmniLife architecture requires phased implementation.
10. Break existing OmniLife features merely to add Academic OS.
11. Create duplicated Task/Calendar systems instead of using the existing OmniLife modules.
12. Create a separate Mandarin app if Mandarin Progress can be integrated into the Academic OS.
13. Hardcode the user's current semester as the permanent curriculum.
14. Assume every course will appear in SIPEJAR immediately at semester start.

---

# 34. Important Design Philosophy

The goal is NOT:

> "Build another SIAKAD."

The goal is NOT:

> "Build another SIPEJAR."

The goal is:

> **Build the student's personal academic operating layer above both systems.**

SIAKAD tells OmniLife:

> **What officially exists.**

SIPEJAR tells OmniLife:

> **What learning activity exists.**

OmniLife tells the student:

> **What matters, what to do, when to do it, how they are progressing, and whether their long-term academic goal is still realistic.**

---

# 35. Long-Term Vision

Eventually the Academic OS should connect:

```text
SIAKAD
   │
SIPEJAR
   │
   ▼
ACADEMIC DATABASE
   │
   ├── Courses
   ├── Semester
   ├── Curriculum
   ├── Grades
   ├── Assignments
   ├── Materials
   └── Progress
          │
          ▼
     OMNILIFE CORE
          │
   ┌──────┼────────┐
   ▼      ▼        ▼
 Tasks  Calendar  Notes
   │      │        │
   └──────┼────────┘
          ▼
      AI ASSISTANT
          │
   ┌──────┼───────────┐
   ▼      ▼           ▼
 Study  Analytics  Roadmap
                    │
                    ▼
             Graduation Goal
                  7 Semesters
```

The ultimate goal is for OmniLife to understand the student's academic life as a connected system rather than a collection of disconnected pages.

---

# 36. Final Instruction to the AI Agent

Before writing implementation code:

1. Inspect the existing OmniLife architecture.
2. Identify existing modules for:
   - Tasks
   - Calendar
   - Reminders
   - Notes
   - Users/profile
   - Search
   - Notifications
3. Reuse existing infrastructure whenever possible.
4. Do not create duplicate systems.
5. Identify the current data model and determine where Academic entities belong.
6. Propose a migration-safe schema.
7. Implement in the defined phases.
8. Keep all external-source data clearly attributed.
9. Build for future synchronization even if actual SIAKAD/SIPEJAR automation is not available yet.
10. Do not fabricate unavailable university data.
11. Keep the architecture extensible for the student's future semesters.
12. Ensure the 7-semester graduation target is a configurable goal and feasibility simulation, not a hardcoded guarantee.

The first implementation milestone should establish the **Academic Foundation + Course model + SIAKAD/SIPEJAR linking architecture**, then expand incrementally.

---

# 37. Success Definition

OmniLife Academic OS succeeds when the student can open one place and answer:

> **What am I officially taking?**

> **What do I need to learn?**

> **What assignments do I have?**

> **What is due soon?**

> **How am I performing?**

> **What should I study next?**

> **How is my Mandarin progressing?**

> **What is my academic risk?**

> **Am I still on track for a 7-semester graduation?**

And ultimately:

> **What should I do today to move closer to graduating with a high IPK and becoming professionally capable in Mandarin?**

# OmniLife — ACA-02B  
## Course Detail, RPS & Lecturer Information

**Status:** Implementation Ready  
**Depends On:** ACA-02A — Academic Data & UM Schedule Foundation  
**Depends On:** SYN-01 — Secure Cloud Sync Foundation  
**Goal:** Build a rich, structured course-detail system inspired by RPS/SIAKAD, without turning OmniLife into an official university system.

## 1. Objective

Expand the basic `Course` entity into a complete personal academic course hub.

Each course must be able to contain:

```text
Course identity
Credits / SKS
Description
SCPL
CPMK
Sub-CPMK
Learning materials
Teaching methods
Assessment information
Lecturers
References / learning resources
Useful links
```

The result should feel like a compact, usable version of an RPS.

## 2. Important Separation

Maintain these distinctions:

```text
Course
= canonical subject identity
Example: Kaligrafi Tiongkok

Course Class
= a specific class in a specific semester
Example: Kaligrafi Tiongkok — Class B — Odd 2026/2027

Course Syllabus / RPS
= academic detail and learning plan for the course
Example: learning outcomes, materials, references
```

Do not store all RPS information directly inside a single long `description` field.

## 3. Course Detail Structure

The Course Detail screen should present information in clear sections:

```text
Overview
Learning Outcomes
Learning Plan
Lecturers
References
Class Information
```

Recommended course header:

```text
Kaligrafi Tiongkok

Code: PMDR236026
Credits: 2 SKS
Recommended Semester: 3
Course Group: Optional / Required
```

## 4. Required Data Model

Extend the Academic data model using equivalent entities that follow the existing application architecture.

```text
Course
- id
- code
- name
- credits
- defaultSemester
- courseGroup: required | elective | general | other
- description
- createdAt
- updatedAt

CourseSyllabus
- id
- courseId
- title
- versionLabel
- effectiveFromTermId (optional)
- status: draft | active | archived
- description
- learningMethods
- assessmentNotes
- createdAt
- updatedAt

CourseLearningOutcome
- id
- syllabusId
- type: scpl | cpmk | sub_cpmk
- code (optional)
- title
- description
- parentOutcomeId (optional)
- sortOrder

CourseMaterial
- id
- syllabusId
- title
- description
- weekNumber (optional)
- linkedOutcomeIds
- sortOrder

CourseLecturerAssignment
- id
- courseId or courseClassId
- lecturerId
- role: coordinator | lecturer | academic_advisor | other
- note
- sortOrder

CourseReference
- id
- syllabusId
- type: book | website | video | journal | article | other
- citation
- title (optional)
- author (optional)
- publisher (optional)
- publicationYear (optional)
- url (optional)
- note (optional)
- sortOrder
```

Use stable IDs. All synchronized records must have ownership and sync metadata from SYN-01.

## 5. SCPL, CPMK, and Sub-CPMK

Represent learning outcomes as structured entries, not as one block of text.

```text
SCPL
  ↓
CPMK
  ↓
Sub-CPMK
```

Example:

```text
SCPL-03
Students are able to understand Chinese cultural expression.

CPMK-02
Students are able to explain the principles of Chinese calligraphy.

Sub-CPMK-02.1
Students are able to identify the basic elements of Chinese calligraphy.
```

Requirements:

- One SCPL may relate to multiple CPMK entries.
- One CPMK may contain multiple Sub-CPMK entries.
- The interface must preserve ordering.
- An outcome may be text-only when an official code is unavailable.
- Do not force the user to create codes when their reference material does not include them.

## 6. References and Learning Resources

The unnamed list from RPS material must be represented as:

```text
Sumber Rujukan / References
```

Do not save all references as one long unstructured paragraph.

Support at minimum:

```text
Book
Website
Video
Journal / Academic article
Other
```

Example display:

```text
📚 Book
魏新红主编《初级汉语综合教程上》
北京语言大学出版社, 2013

🌐 Website
Chinese Culture — Kaligrafi Cina
chine-culture.com/id/kaligrafi-cina.php

🎬 Video
YouTube learning resource
```

Requirements:

- URLs must be clickable when present.
- A missing URL must not prevent saving a book or printed reference.
- Display a safe, readable link label instead of a raw long URL when possible.
- Preserve source order from the original RPS.
- Do not automatically fetch, scrape, or copy content from external links.

## 7. Lecturer Information

Use the existing `Lecturer` entity from ACA-02A.

A lecturer can be connected at two levels:

```text
Course level
= usually teaches or coordinates this subject

Course Class level
= teaches this particular class in a particular semester
```

Support roles:

```text
Coordinator
Lecturer
Academic Advisor / Dosen PA
Other
```

A Dosen PA remains one person with a role, not a separate duplicate record.

## 8. Course Syllabus Versioning

A course can change over time. Preserve older academic information.

```text
Course
  ├── Syllabus 2026/2027
  ├── Syllabus 2027/2028
  └── Future syllabus versions
```

Rules:

- A syllabus marked `active` is the default shown for new classes.
- Older course classes may retain their linked syllabus version.
- Editing a newer RPS must not silently alter historical class information.
- Personal notes and study activity must never be deleted because an RPS version changes.

## 9. Minimal Course Detail Interface

Create these primary areas:

```text
Course Library
- Search by name or code
- Filter by semester and course group
- Course cards/list

Course Detail
- Overview
- Learning outcomes
- Materials
- Lecturers
- References
- Related course classes

Syllabus Editor
- Draft and publish workflow
- Structured SCPL / CPMK / Sub-CPMK entries
- Structured references
```

Prioritize clear data entry and readable course detail. Do not create the Academic Dashboard in this phase.

## 10. Relationship with Existing Modules

This phase establishes references only.

```text
Course
  ├── CourseClass
  ├── ClassMeeting
  ├── CourseSyllabus
  └── Future links:
      ├── Study workspace
      ├── Tasks
      ├── Notes
      ├── Exams
      └── Chinese Learning
```

Do not duplicate data into Study, Tasks, Notes, or Chinese Learning yet. Those connections belong to ACA-02F.

## 11. Sync Requirements

All newly added course and RPS entities must use SYN-01 infrastructure.

Required behavior:

```text
Create RPS detail on Desktop while offline
        ↓
Save locally
        ↓
Sync after reconnection
        ↓
Display the same course detail on another signed-in device
```

Use the existing synchronization queue, ownership model, conflict detection, and secure account rules. Do not make a second sync mechanism for RPS data.

## 12. Migration and Safety

- Preserve existing basic course records.
- Existing course descriptions may be imported into the new `Course.description`.
- Do not erase legacy text fields until migration is verified.
- If current course/reference data is incomplete, allow it to remain incomplete.
- Treat all RPS information as personal reference data, not an official source of academic truth.

## 13. Explicitly Out of Scope

Do not implement in ACA-02B:

```text
KRS selection and approval
Schedule conflict UI
Academic Calendar event generation
Academic Dashboard
Tasks, notes, and Study workspace creation
Chinese Learning activity generation
Schedule export
Grades, KHS, IPS, IPK, and transcript
Android-specific screens
Automatic SIAKAD import or scraping
```

## 14. Acceptance Criteria

ACA-02B is complete when:

1. A course has a structured detail page.
2. The course supports code, name, SKS, description, semester, and course group.
3. SCPL, CPMK, and Sub-CPMK can be added, ordered, and related.
4. Learning materials can be recorded.
5. References can be saved as books, websites, videos, journals, or other sources.
6. Links are usable without forcing every reference to have a URL.
7. Lecturers can be assigned to a course or a specific class.
8. Multiple syllabus versions can coexist without overwriting historical class data.
9. Course/RPS changes synchronize through SYN-01.
10. Existing OmniLife modules and old course data remain safe.

## 15. Next Phase

After ACA-02B is complete:

```text
ACA-02C — KRS & Schedule Intelligence
```

This phase will use the complete course, class, room, lecturer, and period data to build:

```text
Personal KRS
Course-class selection
Academic Advisor status
Schedule validation
Automatic period-overlap detection
Clear conflict explanations
```
# OmniLife — ACA-02A  
## Academic Data & UM Schedule Foundation

**Status:** Implementation Ready  
**Depends on:** Existing OmniLife Academic/Study data  
**Goal:** Build the safe academic data foundation before dashboard, KRS intelligence, calendar sync, export, or Android client work.

## Objective

Create a normalized Academic Foundation for OmniLife that represents the user’s university schedule structure:

- Academic year and semester
- UM learning periods 1–14
- Separate Regular and Ramadan period-time profiles
- Day of week
- Room/location
- Lecturer
- Course
- Course class/section
- Class meeting schedule

This phase must preserve existing Academic, Study, Tasks, Notes, Calendar, and Chinese Learning features. Do not rewrite unrelated modules.

## Core Rules

1. Do not store class schedules as one free-text field such as `Senin 08:00 A301`.
2. A class meeting must use separate fields:

   - dayOfWeek
   - periodProfileId
   - startPeriodNumber
   - endPeriodNumber
   - roomId
   - optional note

3. Support periods 1 through 14.
4. Period time must be configurable, never hardcoded in UI or business logic.
5. Provide at least two configurable profiles:

   - UM Regular Schedule
   - UM Ramadan Schedule

6. Enter the verified period times from the user’s UM reference as initial configuration data. The user must still be able to edit them later.
7. Room must be its own entity, not merely a string on a course or schedule.
8. Lecturer must be its own entity and must support the future role of Academic Advisor / Dosen PA.
9. Course, Course Class, and Class Meeting must remain separate concepts.

## Required Data Model

Create or adapt equivalent models following the existing application architecture:

```text
AcademicTerm
- id
- academicYear
- semesterName
- semesterNumber
- startDate
- endDate
- status

AcademicPeriodProfile
- id
- name
- type: regular | ramadan | custom
- isActive

AcademicPeriod
- id
- profileId
- number: 1–14
- startTime
- endTime
- label

Room
- id
- building
- roomCode
- floor
- capacity (optional)
- note (optional)

Lecturer
- id
- name
- academicIdentifier (optional)
- department/program (optional)
- email/contact (optional)
- roles
- note

Course
- id
- code
- name
- credits
- defaultSemester (optional)
- description (optional)

CourseClass
- id
- courseId
- academicTermId
- classCode
- lecturerIds
- capacity (optional)
- status

ClassMeeting
- id
- courseClassId
- dayOfWeek
- periodProfileId
- startPeriodNumber
- endPeriodNumber
- roomId
- note
```

Use stable IDs. Never use array positions as permanent identity.

## Required Application Services

Create reusable domain services or equivalent abstractions for:

```text
getPeriodRange(profileId, startPeriod, endPeriod)
validatePeriodRange(startPeriod, endPeriod)
detectScheduleOverlap(meetingA, meetingB)
```

Conflict detection UI is not the main deliverable in this phase, but the overlap logic must be centralized and testable so ACA-02C can reuse it.

## Minimal Interface Scope

Create simple Academic settings/master-data screens or equivalent flows for:

- Academic terms
- Period profiles and period 1–14 time configuration
- Rooms
- Lecturers
- Courses
- Course classes
- Class meetings

Prioritize correct data entry and clear validation over polished dashboard design.

## Migration and Safety Requirements

Before changing persistence:

1. Inspect existing Academic and Study data structures.
2. Back up or safely migrate existing schedule/course data.
3. Do not delete existing user data.
4. If an existing schedule cannot be mapped reliably, preserve it as legacy data and provide a visible migration/edit path.
5. Keep existing features operational throughout the migration.
6. Add focused tests for period validation and overlap detection.

## Explicitly Out of Scope

Do not implement these in ACA-02A:

- Academic Dashboard
- KRS approval workflow
- Calendar event generation
- Full conflict-resolution interface
- Course RPS/SCPL/CPMK interface
- Schedule export
- Android application
- Cloud sync implementation
- Grades, KHS, IPS, IPK, or transcript

These follow in later phases.

## Acceptance Criteria

ACA-02A is complete when:

1. A user can create a semester and select it as active.
2. A user can configure periods 1–14 for Regular and Ramadan profiles.
3. A user can create rooms, lecturers, courses, classes, and class meetings.
4. A class meeting correctly links day, period range, and room.
5. Existing Academic-related data remains intact.
6. The application can identify whether two class meetings overlap by day and period.
7. Period timing remains editable without code changes.
8. Existing OmniLife modules continue to work.
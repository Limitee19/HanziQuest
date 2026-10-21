# OmniLife — ACA-02D  
## Academic Calendar & Class Event Integration

**Status:** Implementation Ready  
**Depends On:** ACA-02A — Academic Data & UM Schedule Foundation  
**Depends On:** SYN-01 — Secure Cloud Sync Foundation  
**Depends On:** ACA-02B — Course Detail, RPS & Lecturer Information  
**Depends On:** ACA-02C — Personal KRS & Schedule Intelligence  
**Goal:** Create an Academic Calendar that displays classes, exams, academic deadlines, holidays, and schedule changes while remaining connected to the unified OmniLife Calendar.

## 1. Core Calendar Principle

OmniLife has two calendar perspectives, not two unrelated calendars.

```text
Academic Calendar
= focused academic view

OmniLife Calendar
= unified life view
  ├── Academic
  ├── Personal
  ├── Tasks
  ├── Study
  └── Future modules
```

Academic events must appear in the unified calendar, but their source remains identifiable.

```text
Course Class / KRS
        ↓
Academic Calendar event projection
        ↓
Unified OmniLife Calendar
```

Do not require the user to enter the same class schedule twice.

## 2. Source of Truth Rules

Use strict ownership rules to avoid duplicated data.

```text
Class schedule
Source of truth: CourseClass + ClassMeeting

Class cancellation or reschedule
Source of truth: ClassMeetingException

Academic deadline, holiday, or UTS/UAS
Source of truth: AcademicCalendarEvent

Unified calendar item
Projection/view of its source
```

If the user clicks a class event in a calendar:

```text
Edit schedule
        ↓
Open Course Class / Class Meeting editor
```

Do not allow the user to independently edit a derived class event in a way that disconnects it from the original course schedule.

## 3. Academic Calendar Contents

Support these academic event categories:

```text
Class Session
UTS
UAS
Quiz
Assignment Deadline
KRS Window
KRS Revision Window
Registration
Payment Deadline
Academic Holiday
Campus Event
Semester Start
Semester End
Announcement
Other Academic Event
```

Class Session events are derived from KRS-selected classes. Other event types may be created manually.

## 4. Required Data Model

Create or adapt equivalent models according to the existing application architecture.

```text
AcademicCalendarEvent
- id
- academicTermId
- type
- title
- description (optional)
- startsAt
- endsAt
- timezone
- isAllDay
- courseId (optional)
- courseClassId (optional)
- source: manual_academic
- status: scheduled | cancelled
- createdAt
- updatedAt

ClassMeetingException
- id
- classMeetingId
- occurrenceDate
- type: cancelled | rescheduled | room_changed | note
- replacementStartsAt (optional)
- replacementEndsAt (optional)
- replacementRoomId (optional)
- note (optional)
- createdAt
- updatedAt

AcademicTermPeriodProfileWindow
- id
- academicTermId
- periodProfileId
- startsOn
- endsOn
```

Use SYN-01 ownership, revision, soft-delete, and synchronization metadata.

## 5. Regular and Ramadan Time Profiles

A single academic term may use different period-time profiles on different dates.

Example:

```text
Odd Semester 2026/2027
├── Regular Profile
│   └── 1 August – 15 February
│
└── Ramadan Profile
    └── 18 February – 18 March
```

Class meetings keep the stable academic representation:

```text
Monday
Period 3–4
Room A301
```

When the calendar renders a specific date, it resolves:

```text
Date
        ↓
Active term period-profile window
        ↓
Period 3–4 actual time on that date
```

Requirements:

- Profile windows within one term must not overlap.
- A date without an assigned profile must be visibly flagged.
- Do not hardcode class start or end times.
- Updating a period profile updates the displayed time of future affected class occurrences.
- Historical exceptions remain preserved.

## 6. Recurring Class Event Generation

A selected KRS Course Class creates recurring class-session occurrences between the academic term’s start and end dates.

```text
StudyPlanItem
        ↓
CourseClass
        ↓
ClassMeeting
        ↓
Weekly class-session occurrences
```

Example:

```text
Chinese Comprehensive 1
Monday · Period 3–4 · Room A301
        ↓
Every eligible Monday within the active academic term
```

Do not save hundreds of duplicated event records when a recurring schedule can be calculated from the source data.

The calendar may generate occurrences dynamically. Each occurrence needs a stable logical identity based on:

```text
ClassMeeting ID + occurrence date
```

## 7. Schedule Exceptions

Support real academic changes without damaging the normal recurring schedule.

```text
Normal schedule
Monday · Period 3–4 · A301

Exception: 12 October
Rescheduled to Wednesday · Period 5–6 · B202
```

Types:

```text
Cancelled
Rescheduled
Room changed
Special note
```

Requirements:

- A cancellation hides or marks only that occurrence as cancelled.
- A reschedule replaces only that occurrence.
- A room change applies only to that occurrence.
- The base weekly schedule remains unchanged.
- Calendar events must visibly display exceptions.

## 8. Academic Holidays

Academic holidays are all-day events.

```text
Academic Holiday
        ↓
May overlap with class occurrences
        ↓
Show warning and offer class-exception action
```

Do not automatically cancel all classes on a holiday without user confirmation. Official academic calendars can have special rules, replacement classes, or exceptions.

## 9. Academic Calendar Views

Provide dedicated Academic Calendar views:

```text
Month View
Week View
Agenda View
List View
```

Recommended filters:

```text
Selected KRS classes
Exams
Deadlines
Academic administration
Holidays
Manual academic events
Cancelled/rescheduled sessions
```

A class event card should show:

```text
Course name
Class code
Period and resolved time
Room
Lecturer when available
Status or exception indicator
```

## 10. Unified OmniLife Calendar Integration

Academic items should automatically be visible in the unified OmniLife Calendar with a source label.

```text
[Academic] Chinese Comprehensive 1
[Personal] Doctor appointment
[Task] Submit cultural studies essay
```

The unified calendar must allow filtering Academic events on or off.

Rules:

- Editing an academic class event routes to Academic data.
- Editing a manual academic event opens Academic Calendar editing.
- Personal calendar events remain separate.
- An overlap between a personal event and a class is an informational warning only.
- Personal events must never modify a KRS schedule.

## 11. UTS, UAS, and Academic Deadlines

Support manually created academic events linked to a Course or Course Class.

Example:

```text
UTS Chinese Comprehensive 1
Date: 14 October 2026
Time: 08:00–09:40
Course Class: Chinese Comprehensive 1 — B
```

Course-linked events should appear in:

```text
Academic Calendar
Unified Calendar
Future Course Detail
Future Academic Dashboard
```

Do not automatically create a task, note, or study session in this phase.

## 12. Timezone and Date Handling

Use the user’s academic timezone:

```text
Asia/Jakarta
```

Requirements:

- Store event date-time values in a timezone-safe format.
- Preserve all-day academic events as dates, avoiding accidental day shifts.
- Do not compare dates through formatted UI strings.
- Render each class occurrence using the relevant period profile for its specific date.

## 13. Synchronization Requirements

All calendar source records and exceptions must synchronize through SYN-01.

Required behavior:

```text
Create a UTS event 
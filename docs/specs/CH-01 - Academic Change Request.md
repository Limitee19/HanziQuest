# OmniLife — Academic Change Request
## Fixed UM Periods, Calendar UX, Navigation & PIN Lock

**Status:** Supersedes relevant parts of ACA-02A, ACA-02D, ACA-02E, SYN-01, MOBILE-01, and MOBILE-02.

## 1. Fixed UM Regular Class Periods

The UM class periods are institutional configuration, not user-editable settings.

```text
UM Regular Schedule — Locked
```

The user must not be able to:

```text
Edit period times
Add periods
Delete periods
Reorder periods
Change break times
```

The application must not show an editable “Period Settings” screen.

If UM changes its official timetable in the future, create a new version through a controlled application update/migration. Preserve the old version for historical schedule accuracy.

### Locked Regular Schedule

| Period | Time |
|---:|---|
| 1 | 07:00–07:50 |
| 2 | 07:50–08:40 |
| Break | 08:40–08:45 |
| 3 | 08:45–09:35 |
| 4 | 09:35–10:25 |
| Break | 10:25–10:30 |
| 5 | 10:30–11:20 |
| 6 | 11:20–12:10 |
| Break | 12:10–13:10 |
| 7 | 13:10–14:00 |
| 8 | 14:00–14:50 |
| Break | 14:50–14:55 |
| 9 | 14:55–15:45 |
| 10 | 15:45–16:35 |
| Break | 16:35–18:15 |
| 11 | 18:15–19:05 |
| 12 | 19:05–19:55 |
| Break | 19:55–20:00 |
| 13 | 20:00–20:50 |
| 14 | 20:50–21:40 |

Use this as bundled, read-only system data:

```text
InstitutionalPeriodProfile
- id: um_regular_v1
- institution: Universitas Negeri Malang
- locked: true
- sourceLabel: UM Regular Class Schedule
- periods: 1–14
- breaks: fixed
```

The Ramadan timetable must also be a separate locked UM profile. Do not guess its times; add it only after its complete verified table is available.

## 2. Class Time Resolution

A class is still entered using:

```text
Day
Start period
End period
Room
```

Example:

```text
Monday
Period 4–5
Room A301
```

The application resolves it automatically as:

```text
Monday
09:35–11:20
Room A301
```

The five-minute break between periods 4 and 5 remains part of the real timetable. The calendar shows one continuous class block from 09:35 until 11:20, labelled:

```text
Chinese Comprehensive 1
Period 4–5 · Room A301
```

No manual start/end time entry is allowed for ordinary class schedules.

## 3. Calendar Must Look Like a Normal Calendar

Academic Calendar must use a familiar date-based calendar interface.

Required views:

```text
Month view
Week view
Day view
Agenda/list view
```

### Month View

```text
[ ‹ ] August 2026 [ › ]

Mon Tue Wed Thu Fri Sat Sun
                  1   2
 3   4   5   6   7   8   9
10  11  12  13  14  15  16
...
```

Requirements:

- User can move to previous/next month.
- User can tap/click any date.
- Selected date becomes visually clear.
- Dates containing classes, UTS/UAS, deadlines, or holidays show indicators.
- “Today” action returns to the current date.
- Month view must work on Desktop, PWA, and native Android.

### Day View

After selecting a date, display a standard timeline:

```text
Monday, 12 October 2026

09:35–11:20
Chinese Comprehensive 1 — B
Period 4–5 · Room A301
```

### Week View

Display the selected week’s actual events:

```text
Monday–Saturday
Real dates
Resolved class times
UTS/UAS
Deadlines
Rescheduled classes
Cancelled classes
```

## 4. Automatic Monday Class Events

When a KRS class is selected:

```text
Course: Chinese Comprehensive 1
Day: Monday
Period: 4–5
Room: A301
Term: Odd Semester 2026/2027
```

OmniLife must create derived calendar occurrences:

```text
Every eligible Monday during the active semester
09:35–11:20
Chinese Comprehensive 1 — B
Room A301
```

Rules:

- Events begin on the academic term start date and end on the term end date.
- Events are derived from KRS/ClassMeeting data; do not manually duplicate them.
- A reschedule changes only the affected date.
- A cancellation hides or marks only that class date as cancelled.
- Holidays produce warnings; they do not silently remove class events.
- Clicking a class event opens the related Course Class or Course Workspace.

## 5. Academic Sidebar / Navigation Redesign

The Academic area must be easier to scan.

Recommended structure:

```text
Home

Academic
├── Dashboard
├── KRS & Weekly Schedule
├── Academic Calendar
├── Courses & RPS
├── Lecturers & Rooms
└── Academic Records

Study
Tasks
Notes
Chinese Learning

Settings
```

Desktop behavior:

```text
Academic is a collapsible navigation group.
The current page is clearly highlighted.
Only essential labels and icons are shown.
```

Mobile behavior:

```text
Academic is a primary bottom-navigation item.
Its internal sections use a clean secondary menu.
```

Do not place many unrelated Academic links above the main Academic entry. Keep the most-used pages near the top:

```text
Dashboard
KRS & Weekly Schedule
Academic Calendar
```

## 6. PIN App Lock

Add a personal application PIN separate from the OmniLife account password.

### Required Behavior

```text
User enables PIN
        ↓
Creates 6-digit PIN
        ↓
App locks after 15 minutes of inactivity/background state
        ↓
PIN required to return to private content
```

Also lock when:

```text
The application is fully closed
The application is reopened
The user explicitly chooses Lock Now
```

Expected lock screen:

```text
OmniLife is locked

Enter PIN
[ • • • • • • ]

[ Use device biometric unlock ]  ← only when supported and enabled
[ Sign out ]
```

### Security Rules

- Never store the PIN as plain text.
- Store only a securely derived PIN verifier using established platform security support.
- Use secure credential storage for lock-related secrets.
- Do not use the PIN as the cloud account password.
- Do not expose notes, grades, schedules, or other private content behind the lock screen.
- Blur/hide private UI when the app enters the background where platform support allows it.
- PIN lock does not erase local offline changes or cancel a safe pending sync operation.
- Resetting a forgotten PIN requires secure account re-authentication; it must not silently expose data.

### Lock Timing

Initial policy:

```text
Automatic lock: 15 minutes
On app exit/reopen: immediate lock
Manual lock: available at any time
```

Later, users may be allowed to choose a different timeout, but 15 minutes is the required default.

## 7. Priority Order

Implement these changes in this order:

```text
1. ACA-02A-R1
   Fixed UM Regular Schedule data and period validation.

2. ACA-02D-R1
   Normal date-based Academic Calendar and derived class events.

3. NAV-01
   Academic sidebar/navigation restructuring.

4. SEC-01
   PIN lock, 15-minute inactivity lock, exit/reopen lock.
```

## 8. Acceptance Criteria

The change request is complete when:

1. UM Regular periods 1–14 match the fixed table above.
2. Users cannot edit or delete UM period times.
3. A Monday Period 4–5 class appears as 09:35–11:20 in the calendar.
4. Users can browse dates through Month, Week, Day, and Agenda calendar views.
5. Recurring classes appear automatically on eligible calendar dates.
6. Academic navigation is grouped, compact, and easy to scan.
7. A 6-digit PIN can be configured.
8. OmniLife locks after 15 minutes of inactivity/background state.
9. OmniLife locks immediately after the app is closed and reopened.
10. PIN data is stored securely and never as plain text.
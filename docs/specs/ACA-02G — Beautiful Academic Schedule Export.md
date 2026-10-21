# OmniLife — ACA-02G  
## Beautiful Academic Schedule Export

**Status:** Implementation Ready  
**Depends On:** ACA-02A through ACA-02F  
**Goal:** Export accurate, polished academic schedules as PNG/JPG and PDF without duplicating or manually re-entering schedule data.

## 1. Core Principle

Schedule export is a derived snapshot.

```text
KRS
Course Class
Class Meeting
Period Profile
Calendar Exception
        ↓
Schedule Export Data Builder
        ↓
Preview
        ↓
PNG / JPG / PDF
```

The export feature must never become a separate schedule editor.

Any schedule correction must be made in:

```text
KRS
Course Class
Class Meeting
Academic Calendar Exception
```

## 2. Export Types

Implement two distinct export modes.

```text
A. Semester Weekly Timetable
B. Actual Week Schedule
```

### A. Semester Weekly Timetable

Shows the normal recurring weekly timetable.

```text
Monday–Saturday
Periods 1–14
Course name
Class code
Room
Optional lecturer
```

Use the selected Regular or Ramadan period profile.

This export represents the normal schedule. It does not attempt to display one-time schedule changes.

### B. Actual Week Schedule

Shows a specific calendar week.

```text
Selected dates
Actual class occurrences
UTS/UAS
Academic deadlines
Rescheduled classes
Cancelled classes
```

This export must use actual calendar occurrences from ACA-02D, including class exceptions.

## 3. Required Export Formats

Support:

```text
PNG
JPG
PDF
```

Recommended output presets:

```text
Phone Wallpaper Portrait
1080 × 1920 px

Phone Wallpaper Large
1440 × 2560 px

Square Share Card
1080 × 1080 px

A4 Landscape Print
PDF and high-resolution PNG

A4 Portrait Summary
PDF and high-resolution PNG
```

The implementation may add additional presets later, but these are the initial required formats.

## 4. Export Configuration

Provide a simple export configuration screen.

```text
Academic Term
Schedule Type
Period Profile
Output Format
Layout Preset
Theme
Information to Display
```

Required options:

```text
Academic Term
- Active term by default
- Historical term selectable

Schedule Type
- Semester Weekly Timetable
- Actual Week Schedule

Profile
- Regular
- Ramadan
- Date-based automatic profile for Actual Week

Display Options
- Course name
- Course code
- Class code
- Room
- Lecturer
- Period number
- Resolved time
- Academic term title
- Optional user name

Output
- PNG
- JPG
- PDF
```

Student number, email, and other sensitive information must be hidden by default.

## 5. Design Direction

The visual result should feel intentional, calm, and suitable for daily viewing.

```text
Clear title
Readable day headers
Readable time column
Consistent course colors
Spacious cards
Strong contrast
Minimal visual clutter
```

Recommended weekly timetable structure:

```text
┌─────────────────────────────────────────────┐
│ OmniLife Academic Schedule                  │
│ Odd Semester 2026/2027                      │
│ Regular Schedule                             │
├────────┬────────┬────────┬────────┬────────┤
│ Time   │ Monday │ Tuesday│ Wednesday ...    │
├────────┼────────┼────────┼────────┼────────┤
│ 07:00  │ Course │        │ Course │        │
│ 08:00  │ A301   │        │ B202   │        │
│ ...                                         │
└─────────────────────────────────────────────┘
```

## 6. Course Card Content

Each schedule card should display only information that fits.

Preferred display order:

```text
Course name
Class code
Room
Resolved time or period range
```

Optional lecturer display should be enabled only when enough space exists.

For compact phone layouts:

```text
Course name
Room
```

Do not shrink text until it becomes unreadable. Prefer responsive card content rules.

## 7. Color and Theme System

Provide a small set of accessible themes.

```text
OmniLight
Midnight
Pastel Academic
Minimal Monochrome
```

Course cards should receive stable colors based on Course/Class identity.

Requirements:

- The same course should use the same color within one export.
- Text contrast must remain readable.
- Do not rely only on color to distinguish classes.
- Include class code, room, or another readable identifier.
- Avoid overly saturated colors that reduce print quality.

Full per-course color customization may be added later.

## 8. Chinese Text and Typography

The export system must correctly render:

```text
Indonesian
English
Chinese Hanzi
Pinyin with tone marks
```

Requirements:

- Use fonts that support Chinese characters.
- Ensure font embedding or reliable bundled font availability for PDF output.
- Test long Chinese course names and mixed Latin/Hanzi text.
- Never replace unsupported characters with boxes or broken symbols.

## 9. Period Profile and Time Accuracy

Schedule time must be resolved from Academic Period Profiles.

```text
Course Class Meeting
Monday · Period 3–4
        ↓
Selected profile
        ↓
Actual displayed start and end time
```

Rules:

- Do not hardcode time labels.
- Semester Weekly Timetable uses the user-selected profile.
- Actual Week Schedule resolves the profile based on the selected dates.
- Clearly label the profile used in the output.
- If a period profile is incomplete, block export and explain what needs correction.

## 10. Handling Exceptions and Conflicts

### Schedule Exceptions

```text
Semester Weekly Timetable
→ show normal recurring schedule only
→ include a small note:
  “Perubahan jadwal khusus tidak ditampilkan.”

Actual Week Schedule
→ include rescheduled and cancelled occurrences
```

### KRS Conflicts

If the selected KRS has unresolved blocking conflicts:

```text
Preview warning:
“Jadwal memiliki bentrok yang belum diselesaikan.”
```

Default behavior:

```text
Clean export
→ available only for conflict-free KRS.

Draft export
→ optional, with visible “DRAFT” label.
```

Never export a conflicted timetable as though it were final without a warning.

## 11. Preview Before Export

Show a preview before file creation.

Preview actions:

```text
Change theme
Change format
Change content options
Change selected week/profile
Export file
```

Requirements:

- Preview and exported file must use the same rendering data.
- Do not export a screenshot of a low-resolution UI preview.
- Preview must preserve the final layout’s content rules.
- Inform the user if any long names are truncated.

## 12. Rendering Architecture

Use a shared export-rendering pipeline.

```text
ScheduleExportRequest
        ↓
ScheduleExportDataBuilder
        ↓
ScheduleLayoutModel
        ↓
Shared Schedule Renderer
        ├── PNG/JPG renderer
        └── PDF renderer
```

Requirements:

- Use one layout model for preview, image export, and PDF export.
- Do not duplicate scheduling calculations in each file-format renderer.
- PDF should preserve vector text/shapes where practical.
- Image export must use the selected target resolution.
- Render locally from synchronized/local data; do not upload schedule content to an external image service.

## 13. File Naming and Save Behavior

Use readable filenames, for example:

```text
OmniLife-Jadwal-Gasal-2026-2027-Regular.png
OmniLife-Jadwal-Minggu-12-18-Oktober-2026.pdf
```

Desktop requirements:

```text
Choose save location
Confirm filename
Show success state
Open containing folder only when user requests it
```

Future PWA/Android requirements:

```text
Download file
Open native share sheet where supported
Save to device
```

Do not retain generated files permanently unless the user explicitly saves them.

## 14. Privacy

- Render exports locally whenever possible.
- Do not add student ID, email, account address, or sync metadata by default.
- Make user-name display optional.
- Do not send schedule data to third-party image-generation or PDF services.
- Warn the user that exported files can be shared outside OmniLife.

## 15. Explicitly Out of Scope

Do not implement:

```text
Editable schedule design canvas
Automatic social-media posting
Public sharing links
Google/Outlook calendar export
iCalendar (.ics) export
Live widgets
Native Android share implementation
Custom background-image upload
Automatic print ordering
Official UM schedule integration
```

## 16. Testing Requirements

Test at minimum:

```text
1. Export conflict-free KRS as PNG, JPG, and PDF.
2. Validate Regular profile time labels.
3. Validate Ramadan profile time labels.
4. Export an Actual Week with a rescheduled class.
5. Export an Actual Week with a cancelled class.
6. Prevent clean final export when KRS has a blocking conflict.
7. Allow clearly labelled Draft export when chosen.
8. Render long Indonesian and Chinese course names correctly.
9. Confirm PDF and PNG use matching schedule data.
10. Confirm no schedule data is sent to an external rendering service.
11. Confirm A4 output is readable when printed.
12. Confirm phone-wallpaper output is readable on a narrow portrait screen.
```

## 17. Acceptance Criteria

ACA-02G is complete when:

1. The user can preview and export their schedule as PNG, JPG, and PDF.
2. Semester and Actual Week export modes are available.
3. Exported schedules use correct course, class, room, and period information.
4. Regular and Ramadan profiles render the correct times.
5. Actual Week exports reflect calendar exceptions.
6. Conflict-free schedules export cleanly.
7. Draft schedules with unresolved conflicts are visibly labelled.
8. Exports are readable on phone screens and A4 print.
9. Indonesian and Chinese text render correctly.
10. Exporting never changes academic source data.

## 18. Next Phase

After ACA-02G is complete:

```text
MOBILE-01 — OmniLife Mobile Access
```

This phase will bring the synchronized data to Android through a responsive PWA first, prioritizing dashboard, today’s schedule, calendar, tasks, notes, and Study access.
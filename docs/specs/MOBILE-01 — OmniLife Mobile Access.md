# OmniLife — MOBILE-01  
## OmniLife Mobile Access (Android PWA)

**Status:** Implementation Ready  
**Depends On:** SYN-01 — Secure Cloud Sync Foundation  
**Depends On:** ACA-02A through ACA-02G  
**Goal:** Deliver a responsive, installable Android experience for OmniLife using a Progressive Web App (PWA), backed by the same secure user account and synchronized data as Desktop.

## 1. Product Decision

Build a responsive PWA before building a native Android application.

```text
Desktop OmniLife
        │
        │ Same account and cloud sync
        ▼
OmniLife PWA on Android
        │
        └── Install from browser
            Open like an app
            Work offline
            Sync when online
```

The PWA must not be a static website or a separate Android-only data system.

It is the mobile client of the same OmniLife product.

## 2. Why PWA First

The PWA approach provides:

```text
Fast Android access
One shared data source
No Play Store dependency
Installable home-screen application
Offline capability
Rapid updates
Reuse of existing web/domain logic where possible
```

A native Android app remains a future option after real mobile use reveals which native capabilities are actually needed.

## 3. Core Principles

```text
Mobile is not a shrunken Desktop screen.
Mobile prioritizes quick daily actions.
Data is shared, never duplicated.
Offline changes are valid local changes.
Security rules remain identical across clients.
```

## 4. Primary Mobile Use Cases

Prioritize the actions the user is likely to need away from the PC.

```text
Check today’s classes
Check next class and room
View Academic Calendar
Review weekly schedule
Check and complete tasks
Create/read course notes
Start or record a study session
Open Chinese Learning and due reviews
View KRS status
Download/export schedule
```

## 5. Initial Mobile Scope

Implement these mobile areas.

```text
Home
Academic
Tasks
Learn
More
```

### Home

Show a concise daily overview:

```text
Today’s classes
Next academic event
Important tasks
Due Chinese reviews
Sync status
```

### Academic

Provide:

```text
Academic Dashboard
Today’s schedule
Weekly schedule
Academic Calendar
Course Workspace
KRS status and selected SKS
Course information in readable view
Schedule export/download
```

### Tasks

Provide:

```text
View tasks
Create task
Complete/reopen task
Edit basic task details
Link task to academic context when supported
```

### Learn

Provide:

```text
Chinese Learning review entry
Vocabulary/Hanzi access
Practice entry points
Study-session entry points
```

### More

Provide:

```text
Notes
Sync status
Account
Settings
Academic history
```

## 6. Mobile Editing Boundaries

Support safe, frequent edits on mobile:

```text
Create/complete tasks
Create/edit notes
Create study sessions
Create manual academic events
Add class-meeting exceptions
Update basic KRS status notes
```

Keep complex administrative editing primarily desktop-first in MOBILE-01:

```text
Full RPS/SCPL/CPMK editor
Bulk course import
Bulk room/lecturer editing
Complex syllabus version management
Large KRS class-comparison workflow
Advanced schedule configuration
```

These screens may be readable on mobile, but do not force dense desktop forms into a small display.

## 7. Navigation

Use a mobile-first bottom navigation.

```text
[ Home ] [ Academic ] [ Tasks ] [ Learn ] [ More ]
```

Requirements:

- Bottom navigation must be reachable with one hand.
- The active section must be obvious.
- Use clear labels, not icon-only navigation.
- Deep-linked course, task, note, and calendar pages must still provide an understandable back path.
- Desktop navigation must remain unchanged unless the existing shared navigation system safely adapts.

## 8. Responsive Design Rules

Support Android phone screens first.

```text
Portrait orientation
Narrow widths
Variable Android browser chrome
Notches and safe areas
Touch keyboard
Large text settings
```

Requirements:

- Touch targets should be comfortably tappable.
- Avoid hover-only interactions.
- Avoid side-by-side dense tables on narrow screens.
- Convert large desktop tables into cards, expandable rows, or focused detail screens.
- Preserve important schedule information without horizontal scrolling where practical.
- Keep course name, room, and time readable.
- Support dark mode only if the current design system already supports it safely.

## 9. Academic Schedule on Mobile

Provide two optimized schedule views:

```text
Today
Weekly
```

### Today

```text
08:00–09:40
Chinese Comprehensive 1 — B
Room A301

10:00–11:40
Kaligrafi Tiongkok — A
Room B202
```

### Weekly

```text
Day selector or compact horizontal day tabs
Period/time-aware class cards
Clear current-day emphasis
Conflict and exception indicators
```

Do not force the full desktop 1–14 timetable grid onto a narrow screen if it becomes unreadable.

## 10. PWA Installability

Configure the application as an installable PWA.

Required:

```text
Web app manifest
Application name and short name
App icons
Maskable Android icon
Theme color
Standalone display mode
Secure HTTPS deployment
Service worker
Install guidance
```

The installed application should:

```text
Appear in Android app launcher
Open in an app-like standalone window
Use OmniLife branding
Restore the signed-in session safely
```

Provide a simple install hint only when installation is available. Do not repeatedly interrupt the user.

## 11. Offline Behavior

Reuse SYN-01 local-first behavior.

```text
Cached application shell
        +
Local user data
        +
Sync outbox
        =
Usable offline mobile app
```

Offline requirements:

```text
Open previously synced Academic data
View cached schedule and calendar
Create/edit supported mobile items
Queue changes locally
Show clear offline state
Sync automatically after reconnection
```

Example status:

```text
Offline — perubahan tersimpan di perangkat ini.
```

If an item has never been downloaded and is unavailable offline:

```text
Data ini belum tersedia secara offline.
```

Do not show a misleading empty state.

## 12. PWA Caching Rules

Cache safely.

```text
Cache:
- Application shell
- Static assets
- Previously viewed non-sensitive interface resources
- Local synchronized user data through the existing local database

Do not cache:
- Passwords
- Administrator credentials
- Sensitive data in public/shared browser caches
```

Requirements:

- User-specific content must remain associated with the signed-in account.
- Sign-out must clear protected session state and provide safe handling for local cached data.
- PWA updates must not silently discard pending offline changes.
- When a new app version is available, show an update prompt only after pending changes are safe.

## 13. Security

MOBILE-01 uses SYN-01 security rules without exception.

```text
HTTPS
Authenticated user account
Server-enforced row-level access
No password stored locally
Secure session handling
Sync conflict protection
```

Additional mobile requirements:

- Do not expose service/admin keys in frontend code.
- Protect personal academic data on shared devices through sign-out.
- Use the browser/platform’s safest available session storage strategy.
- Make session expiration understandable and recoverable.
- Do not claim biometric lock support unless it is truly implemented.

## 14. Sync on Mobile

Use the same synchronization engine and data contracts as Desktop.

```text
Desktop update
        ↓
Cloud sync
        ↓
Android receives updated data

Android offline update
        ↓
Mobile outbox
        ↓
Cloud sync after reconnect
        ↓
Desktop receives updated data
```

Requirements:

- Never create a mobile-only copy of KRS, Tasks, Notes, or Chinese Learning data.
- Show the existing sync status model from SYN-01.
- Recalculate derived academic calendar occurrences after source data syncs.
- Preserve conflict handling rather than silently overwriting another-device edits.

## 15. Schedule Export on Mobile

Reuse ACA-02G export architecture.

Support:

```text
Preview schedule
Download PNG/JPG/PDF
Use native browser share sheet when available
Save to device when supported
```

Do not build a separate Android-only schedule renderer.

The mobile export output must match the same selected data, profile, and theme as Desktop export.

## 16. Accessibility and Language

Requirements:

```text
Indonesian-first interface
Readable text scaling
Clear status labels
Color-independent warning indicators
Screen-reader labels for essential actions
Chinese Hanzi and Pinyin rendering support
```

Do not use gesture-only controls for important functions.

## 17. Performance

Optimize for ordinary Android devices and unstable connections.

```text
Fast startup from local cache
Incremental sync
Lazy-load nonessential content
Avoid large initial downloads
Avoid blocking Home/Academic on full sync
```

Do not download every RPS reference, export file, or historical record when the user only needs today’s schedule.

## 18. Explicitly Out of Scope

Do not implement in MOBILE-01:

```text
Native Android APK
Google Play Store publication
Push notifications
Home-screen widgets
Biometric app lock
Background location features
Google/Outlook Calendar integration
Offline media-download system
Full mobile RPS editor
Native share implementation beyond browser-supported sharing
```

## 19. Testing Requirements

Test at minimum:

```text
1. Install PWA on a supported Android browser.
2. Sign in with the same account as Desktop.
3. Verify Academic Dashboard data matches Desktop.
4. View cached schedule while offline.
5. Create a task/note while offline.
6. Reconnect and confirm no duplicate synchronized data.
7. Verify class exceptions and Ramadan/Regular times render correctly.
8. Download a PNG/JPG/PDF schedule from Android.
9. Sign out and confirm protected session access ends.
10. Test portrait layout on narrow and larger Android screens.
11. Test keyboard behavior while editing notes/tasks.
12. Test Indonesian, Hanzi, and Pinyin rendering.
```

## 20. Acceptance Criteria

MOBILE-01 is complete when:

1. OmniLife can be installed from Android as a PWA.
2. The user signs in with the same account used on Desktop.
3. Academic Dashboard, schedule, calendar, tasks, notes, Study, and Chinese Learning are accessible on mobile.
4. The mobile experience is responsive and touch-friendly.
5. Cached data remains usable offline.
6. Offline changes synchronize safely after reconnection.
7. Schedule export can be downloaded or shared from Android where supported.
8. No separate mobile data model or sync system exists.
9. Desktop functionality remains intact.

## 21. Next Phase Decision Gate

After MOBILE-01 has been used in daily life, evaluate:

```text
Is PWA installation, offline use, and schedule access sufficient?
```

If yes:

```text
Continue improving the shared Desktop + PWA experience.
```

If native-only needs become important, continue to:

```text
MOBILE-02 — Native Android, Notifications & Device Features
```

Possible future native motivations:

```text
Reliable notifications
Home-screen widgets
Biometric lock
Improved offline media
Play Store distribution
Deeper Android share/file integration
```
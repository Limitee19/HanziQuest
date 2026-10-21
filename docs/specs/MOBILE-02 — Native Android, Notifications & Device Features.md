# OmniLife — MOBILE-02  
## Native Android, Notifications & Device Features

**Status:** Implementation Ready  
**Depends On:** MOBILE-01 — OmniLife Mobile Access  
**Depends On:** SYN-01 — Secure Cloud Sync Foundation  
**Depends On:** ACA-02A through ACA-02G  
**Goal:** Build a native Android application for OmniLife, adding reliable device-level features while preserving one shared data model and synchronization system.

## 1. Product Boundary

The native Android app is a new client, not a separate product.

```text
Desktop OmniLife
        │
        ├── Shared domain rules
        ├── Shared cloud data
        └── Shared sync contract
                │
                ▼
Native OmniLife Android
```

The Android app must not create:

```text
A separate account system
A separate KRS database
A separate calendar model
A separate Tasks/Notes model
A separate sync engine
```

## 2. Framework Decision

Before implementation, inspect the existing Desktop/PWA technology.

Choose one native approach that maximizes reuse of the existing domain layer, validation rules, API contracts, and test fixtures.

```text
If current OmniLife uses a compatible TypeScript/React stack
→ evaluate a React Native-based approach.

If the current project is already built around another cross-platform stack
→ evaluate its native Android path.

Do not mix multiple mobile frameworks in one product.
```

The selected framework must support:

```text
Offline local storage
Secure credential storage
Local notifications
Native share sheet
File download/export
Biometric capability
Background sync scheduling
Android app packaging
```

## 3. Native Android Scope

Implement native Android access for:

```text
Academic Dashboard
Today’s schedule
Weekly schedule
Academic Calendar
KRS status
Course Workspaces
Tasks
Notes
Study sessions
Chinese Learning
Schedule export
Sync/account settings
```

The information architecture should remain familiar to MOBILE-01:

```text
[ Home ] [ Academic ] [ Tasks ] [ Learn ] [ More ]
```

However, the UI must feel native and touch-first rather than copying desktop layouts.

## 4. Native Data Architecture

Use this flow:

```text
Native Android UI
        ↓
Shared repository/domain layer
        ↓
Native local database
        ↓
Existing SYN-01 synchronization protocol
        ↓
Cloud database
```

Requirements:

- Use the same stable entity IDs as Desktop and PWA.
- Use the same ownership, validation, revision, and conflict rules.
- Support offline-first writes.
- Keep native local storage separate from browser/PWA cache, but synchronized through the same cloud source.
- Do not synchronize UI-only temporary state as academic data.

## 5. Native Local Storage and Security

Store locally required data for offline access:

```text
Academic data
Calendar data
Tasks
Notes
Study data
Chinese Learning data
Sync outbox
```

Security requirements:

```text
No password stored locally
Session credentials stored in Android secure storage
Sensitive local database protected where platform support permits
User data isolated by signed-in account
Sign-out clears active session securely
```

For shared devices:

```text
Sign out
        ↓
Remove secure session credentials
        ↓
Offer user-controlled removal of offline local data
```

Do not silently erase offline data until pending changes have been safely handled or the user explicitly confirms the risk.

## 6. Native Notification System

Implement **local device notifications** first.

Notifications are generated from existing OmniLife data:

```text
Class sessions
UTS/UAS
Academic deadlines
Tasks
Study reminders, when existing Study support allows it
Chinese review reminders, when existing Chinese Learning support allows it
```

Notification source of truth:

```text
Academic Calendar
Tasks
Study
Chinese Learning
```

Do not create a separate notification-only schedule data model.

## 7. Notification Categories

Support these categories:

```text
Class Reminder
Academic Event Reminder
Task Deadline Reminder
Study Reminder
Chinese Review Reminder
Sync Attention Notification
```

Recommended initial defaults after the user explicitly enables reminders:

```text
Class reminder
20 minutes before

UTS/UAS
1 day before and 1 hour before

Task deadline
1 day before and 1 hour before
```

All reminder timing must be configurable.

## 8. Notification Permissions and Control

Requirements:

- Request notification permission only after explaining its benefit.
- Do not request unrelated permissions.
- Provide per-category enable/disable controls.
- Support quiet hours.
- Support disabling reminders for a specific course or event.
- Keep notification preferences device-specific by default.
- Never send a notification merely because sync completed successfully.

Example settings:

```text
Notifications

[✓] Class reminders
    20 minutes before

[✓] UTS/UAS reminders
    1 day and 1 hour before

[✓] Task deadlines

[ ] Study reminders

[ ] Chinese review reminders

Quiet hours
22:00–06:00
```

## 9. Notification Reliability Rules

When relevant data changes:

```text
KRS changes
Calendar event changes
Class exception changes
Task deadline changes
Period-profile changes
        ↓
Cancel obsolete reminders
        ↓
Recalculate future reminders
        ↓
Schedule updated reminders
```

Requirements:

- Do not show reminders for cancelled classes.
- Rescheduled classes must notify at the replacement time.
- Changes to Regular/Ramadan period profiles must update affected future reminders.
- Avoid duplicate reminders after sync retries.
- Use Android-supported background scheduling mechanisms responsibly.
- Do not promise exact background delivery in conditions controlled by device battery or operating-system restrictions.

## 10. Timezone Rules

Academic source time remains:

```text
Asia/Jakarta
```

Requirements:

- Store academic event times safely.
- Schedule notifications against the resolved event instant.
- If the user travels, present times transparently in the device’s local context where supported.
- Avoid double notifications caused by timezone changes.
- Keep all-day events as dates, not accidental midnight timestamps.

## 11. Biometric App Lock

Implement optional biometric protection only if securely supported by the selected native framework and Android device.

Expected behavior:

```text
User enables App Lock
        ↓
App requires biometric or device credential
        ↓
Protected content opens
```

Requirements:

- Biometric lock is optional.
- Provide device-credential fallback where supported.
- Do not claim biometric security if the feature is only cosmetic.
- App lock must not replace secure account authentication or server security.
- Lock timeout must be configurable:

```text
Immediately
After 1 minute
After 5 minutes
Never
```

## 12. Native Share and File Features

Reuse ACA-02G schedule-export rendering.

Support native Android actions:

```text
Download PNG/JPG/PDF
Save file using Android system picker
Open Android share sheet
Share to compatible installed apps
```

Requirements:

- Use temporary export files safely.
- Avoid unnecessary storage permissions.
- Use Android’s system file/share flow instead of broad filesystem access.
- Do not upload exported schedules to a third-party service.
- Preserve the user’s selected export format, theme, and academic term.

## 13. Android App Shortcuts

Add optional launcher shortcuts:

```text
Today’s Schedule
New Task
Start Study
Chinese Review
```

Requirements:

- Shortcuts must open the relevant native screen.
- If the user is signed out, route to secure sign-in first.
- Do not place private academic details directly in launcher shortcut labels.

## 14. Home-Screen Widget

Implement one compact optional widget:

```text
OmniLife Today
```

It may show:

```text
Next class
Next room
Time until class
Highest-priority task
```

Requirements:

- Widget content comes from cached/synchronized local data.
- Widget must handle offline state gracefully.
- Do not show sensitive note content.
- Tapping the widget opens the correct native screen.
- Widget refresh frequency must respect device battery use.

## 15. Deep Links

Support safe internal deep links for:

```text
Academic Dashboard
Course Workspace
Course Class
Academic Event
Task
Note
Study Session
Chinese Review
```

Examples of use:

```text
Notification tap
Widget tap
Shortcut tap
Internal shared navigation
```

Requirements:

- Validate destination ownership before opening.
- Handle deleted or unavailable records safely.
- Do not expose private data in a link URL.

## 16. Background Sync

Use SYN-01 as the only sync system.

Native behavior:

```text
Foreground use
→ immediate local save and regular sync attempt

App launch/resume
→ sync pending changes and pull updates

Background opportunity
→ attempt limited sync when Android permits
```

Requirements:

- Background sync is best-effort, not guaranteed.
- Never block normal app opening while waiting for sync.
- Never lose an offline outbox because the app is closed.
- Show truthful sync state and last successful synchronization time.
- Respect device battery and network constraints.

## 17. Accessibility and Native UX

Requirements:

```text
Android-friendly touch targets
Readable typography
Screen-reader labels
Color-independent warnings
Dynamic text scaling
Indonesian-first language
Hanzi and Pinyin support
Keyboard-safe forms
Light/dark appearance support when safe
```

Do not force desktop-style hover menus, tiny tables, or multi-column RPS editors into the Android app.

## 18. Release and Signing Safety

Before distributing a release build:

```text
Separate debug and release environments
Secure Android signing key management
No signing key in source control
No production secrets in the application binary
Versioned database migrations
Release rollback plan
```

Start with private personal testing. Public store distribution is a separate decision.

## 19. Explicitly Out of Scope

Do not implement in MOBILE-02:

```text
Official UM SIAKAD integration
Google/Outlook Calendar integration
Location tracking
Contacts access
Camera-based features
Social sharing platform integrations
Multi-user collaboration
Automatic AI study planning
Public Play Store release
iOS application
```

## 20. Testing Requirements

Test at minimum:

```text
1. Sign in on Android with the same account as Desktop/PWA.
2. View cached schedule, tasks, and notes while offline.
3. Create a task/note offline and sync after reconnection.
4. Verify class reminders for normal and Ramadan profiles.
5. Cancel or reschedule a class and confirm old reminders are removed.
6. Change a task deadline and confirm reminder updates.
7. Enable/disable notification categories and quiet hours.
8. Test biometric app lock and device-credential fallback where available.
9. Export and share a PDF/PNG through Android system sharing.
10. Test launcher shortcuts and Today widget.
11. Tap a notification/deep link to the correct protected record.
12. Test sign-out and local-data handling on a shared device.
13. Confirm Android sync never creates duplicate academic records.
```

## 21. Acceptance Criteria

MOBILE-02 is complete when:

1. OmniLife runs as a native Android application.
2. The Android app uses the same account, data model, and SYN-01 sync system as Desktop/PWA.
3. Academic, Tasks, Notes, Study, and Chinese Learning are usable offline.
4. Class, exam, and deadline reminders work from existing source data.
5. Cancelled/rescheduled classes update their notifications correctly.
6. Schedule files can be saved and shared through Android.
7. Optional biometric app lock protects the native app.
8. Launcher shortcuts and the Today widget work without exposing private data.
9. The app handles offline state, sync state, and conflicts transparently.
10. No mobile-only duplicate data architecture is introduced.

## 22. Next Phase

After MOBILE-02, continue to:

```text
ACA-03 — Academic Records, Curriculum & Progress
```

This phase adds personal academic history:

```text
Curriculum structure
Required/elective courses
Completed credits
Grades
KHS
IPS
IPK
Transcript
Graduation-progress view
```
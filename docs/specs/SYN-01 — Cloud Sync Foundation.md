# OmniLife — SYN-01  
## Secure Cloud Sync Foundation

**Status:** Implementation Ready  
**Depends On:** ACA-02A — Academic Data & UM Schedule Foundation  
**Goal:** Enable secure, offline-capable synchronization between OmniLife Desktop and future Android/PWA clients.

## 1. Objective

Transform OmniLife from a desktop-only application with isolated local data into a personal system with one shared data source.

```text
OmniLife Desktop
        │
        ├── Local offline data
        ├── Sync queue
        └── Secure login
                │
                ▼
        Cloud Database + Authentication
                │
                ▼
Future Android / PWA
        ├── Local offline data
        ├── Sync queue
        └── Same user account
```

The user must be able to:

- Create or edit academic data on Desktop.
- Open OmniLife later on Android.
- See the same updated data.
- Continue working offline.
- Sync changes safely when the device reconnects.

## 2. Architecture Decision

Use a **local-first architecture**.

Every client keeps its own local database/cache for fast and offline use. The cloud is the secure shared synchronization source; it is not a replacement for local usability.

Recommended cloud foundation:

```text
Supabase
├── PostgreSQL database
├── Authentication
├── Row Level Security
├── HTTPS API
├── Backup capability
└── Future file storage
```

The implementation must use adapters/interfaces so the app is not permanently tied to one cloud provider.

```text
UI
 ↓
Repository / Domain layer
 ↓
Local persistence
 ↓
Sync service
 ↓
Cloud provider adapter
 ↓
Cloud database
```

Do not let UI components communicate directly with the cloud database.

## 3. Scope of SYN-01

Synchronize the Academic Foundation created in ACA-02A:

```text
AcademicTerm
AcademicPeriodProfile
AcademicPeriod
Room
Lecturer
Course
CourseClass
ClassMeeting
```

Also prepare generic sync infrastructure so later phases can add:

```text
Academic Calendar events
Tasks
Study sessions
Notes
Chinese Learning progress
Schedule exports
Attachments
```

## 4. Explicitly Out of Scope

Do not implement these in SYN-01:

- Full Android application UI
- Native Android notifications
- Academic Dashboard
- KRS workflow
- Course RPS / SCPL / CPMK screens
- Calendar generation
- Schedule export
- Grade / KHS / transcript features
- Multi-user collaboration
- Sharing academic data with other people
- Automatic scraping or direct integration with official UM SIAKAD

OmniLife remains a private personal system.

## 5. User Account and Authentication

Implement a secure account foundation.

Required:

```text
Sign up
Sign in
Sign out
Password reset
Session restore
Session expiration handling
```

Requirements:

- Never store the user’s password in OmniLife local storage.
- Never expose database administrator keys in Desktop, PWA, Android, or source control.
- Store session credentials only through the platform’s secure storage mechanism.
- Use HTTPS for all network communication.
- Show a clear signed-in account state.
- Support one account being signed in on multiple devices.

The initial account method may be email and password. Social login can be added later.

## 6. Data Ownership and Security

Every synchronized record must belong to exactly one user.

```text
User
  ↓ owns
AcademicTerm
  ↓ owns
CourseClass
  ↓ owns
ClassMeeting
```

Every cloud table must include equivalent ownership metadata:

```text
owner_id
created_at
updated_at
deleted_at (optional soft delete)
revision
```

Security rules must ensure:

```text
User A can read/write only User A’s records.
User B cannot read/write User A’s records.
```

Use server-enforced Row Level Security or an equivalent access-control layer. Client-side filtering alone is not security.

## 7. Local-First Sync Model

Each client must work without internet access.

```text
User edits a class meeting on Desktop
        ↓
Change saves locally immediately
        ↓
Change enters local sync queue
        ↓
Desktop reconnects to internet
        ↓
Change is uploaded securely
        ↓
Android downloads the change
```

Required sync states:

```text
Synced
Pending upload
Pending download
Offline
Syncing
Conflict needs review
Sync failed
```

The interface should show a compact status, for example:

```text
✓ Synced just now
↻ Syncing…
○ Offline — changes saved on this device
⚠ Sync needs attention
```

Do not make the user wait for the internet before saving normal work.

## 8. Sync Metadata

Keep sync metadata separate from core academic fields.

Conceptually:

```text
SyncMetadata
├── entityId
├── entityType
├── ownerId
├── revision
├── createdAt
├── updatedAt
├── deletedAt
├── lastModifiedByDeviceId
└── syncStatus
```

All entity IDs must be globally stable across Desktop, cloud, Android, and future devices.

Do not use local array indexes or UI-generated temporary positions as permanent identifiers.

## 9. Synchronization Flow

On application start:

```text
Restore secure session
        ↓
Open local data
        ↓
Show usable local interface immediately
        ↓
Check connection
        ↓
Upload pending local changes
        ↓
Download remote changes since last sync cursor
        ↓
Merge safely
        ↓
Update sync status
```

During use:

```text
Local change
        ↓
Save locally
        ↓
Add to outbox
        ↓
Upload when connection is available
        ↓
Confirm revision from cloud
```

Use idempotent operations so a network retry cannot create duplicate courses, rooms, or class meetings.

## 10. Conflict Handling

Never silently discard a user’s edit.

Initial policy:

```text
No competing change
→ sync automatically

Remote change only
→ download automatically

Local change only
→ upload automatically

Same entity changed on two devices
→ create a visible conflict record
```

For conflict resolution:

```text
Show:
- Local version
- Cloud version
- Last modified time
- Device source where available

Allow:
- Keep local version
- Keep cloud version
- Review/edit merged version
```

For SYN-01, conflict review may be a simple technical settings screen. It does not need a polished end-user experience yet.

Soft-deleted records must also synchronize correctly, so a deleted room or class does not reappear unexpectedly on another device.

## 11. Existing Local Data Migration

Existing OmniLife data must not be lost.

Required migration flow:

```text
Existing local Academic data
        ↓
Backup / migration snapshot
        ↓
User signs in for the first time
        ↓
Assign local records to that account
        ↓
Upload to private cloud space
        ↓
Verify successful upload
        ↓
Mark local records as synchronized
```

Rules:

- Do not delete local data after upload without verification.
- Preserve unmappable legacy fields.
- If a legacy schedule cannot be safely mapped, keep it as legacy data and flag it for user review.
- Make migration resumable if the network disconnects.

## 12. Data Validation

Before upload, validate:

```text
CourseClass must reference an existing Course.
ClassMeeting must reference an existing CourseClass.
ClassMeeting must reference a valid Room.
ClassMeeting period must be within 1–14.
startPeriodNumber must not exceed endPeriodNumber.
All synchronized records must have an owner.
```

The cloud layer must validate important relationships too. Do not rely solely on client validation.

## 13. Minimal Sync Settings Interface

Add a small Settings area, not a major dashboard.

```text
Account
- Signed-in email
- Sign out

Synchronization
- Sync status
- Last successful sync
- Pending changes count
- Sync now
- Offline explanation

Data Safety
- Export local backup
- Restore guidance
- Conflict list, when needed
```

Do not overwhelm the primary Academic interface with technical sync details.

## 14. Testing Requirements

Test at minimum:

```text
1. Create course on Desktop while online
   → visible after sync on another client.

2. Create/edit data on Desktop while offline
   → saved locally and synced after reconnection.

3. Same edit retried after a network failure
   → no duplicate record.

4. User A attempts access to User B’s record
   → denied by server security policy.

5. Delete a class meeting on one client
   → removal reaches another client.

6. Competing edits to the same record
   → visible conflict, no silent loss.

7. First-time migration from existing local data
   → no data loss.

8. Session expiration
   → clear re-login flow without corrupting local data.
```

## 15. Acceptance Criteria

SYN-01 is complete when:

1. The user can create an account and sign in securely.
2. Existing Academic Foundation data can be migrated safely to the cloud.
3. Desktop remains usable offline.
4. Academic data created offline syncs after reconnection.
5. Records are isolated securely by user account.
6. Duplicate uploads are prevented.
7. Conflicting edits are detected rather than overwritten silently.
8. Sync status is understandable.
9. The architecture is ready for Android/PWA to use the same account and data.
10. Existing OmniLife features remain operational.

## 16. Next Phase

After SYN-01 passes its acceptance tests, continue to:

```text
ACA-02B — Course Detail & RPS
```

This phase adds rich course information:

```text
Course code
Credits / SKS
Description
SCPL
CPMK
Sub-CPMK
Learning materials
Lecturers
References
Links
```

All of that data will then be created in a form already ready for Desktop ↔ Android synchronization.
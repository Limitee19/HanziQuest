# OmniLife — SYN-01 Architecture Specification

**Project:** OmniLife  
**Module:** Secure Cloud Sync Foundation (SYN-01)  
**Date:** August 14, 2026  

---

## 1. Executive Overview

Phase **SYN-01** transforms OmniLife into a **local-first synchronized system**. Every client maintains full local offline capability backed by local SQLite. When internet connection is available, pending local changes synchronize securely to Supabase with user account isolation enforced by Row Level Security (RLS).

---

## 2. Local-First Sync Architecture

```text
OmniLife Client (Desktop / Future Android / PWA)
        │
  ┌─────┴────────────────────────┐
  ▼                              ▼
Local Storage              Local Outbox Queue
(Instant Offline UI)       (Pending Edits)
  │                              │
  └──────────────┬───────────────┘
                 ▼
          Sync Engine Service
                 │
          (Supabase HTTPS)
                 ▼
       Cloud DB & Auth (RLS Isolation)
```

---

## 3. Key Services & Components

1. **`syncTypes.ts`**:
   - `SyncMetadata`: `entityId`, `entityType`, `ownerId`, `revision`, `updatedAt`, `deletedAt`, `syncStatus`.
   - `SyncStatus`: `'synced' | 'pending_upload' | 'pending_download' | 'offline' | 'conflict' | 'syncing'`.
   - `AuthSession`: User credentials & active JWT token state.
2. **`supabaseClient.ts`**:
   - Supabase client adapter with local-first offline fallback.
3. **`syncService.ts`**:
   - Handlers for `signInUser`, `signUpUser`, `signOutUser`, `queueLocalChange`, and `pushPendingChanges`.
4. **`CloudSyncSettingsView.tsx`**:
   - Account workspace, sign in/up modal, sync status indicator, manual sync button, and outbox queue inspection.
5. **Lecturer & Room UI Refinements (`UmMasterDataView.tsx`)**:
   - Fixed lecturer deletion reactivity to update component state immediately without tab switching.
   - Simplified room input for free-text room code entry.

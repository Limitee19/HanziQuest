# OmniLife — Global Search Architecture & Provider Documentation

**Project:** OmniLife  
**Module:** Global Search & Cross-Module Navigation (Phase 11)  
**Date:** August 11, 2026  

---

## 1. Executive Summary

Phase 11 introduces **Global Search** and cross-module deep navigation for OmniLife. It connects all active OmniLife domain modules (`Tasks`, `Calendar`, `Reminders`, `Routines`, `Goals`, `Notes`, `Academic`, `Documents`, `Vault Metadata`) under a unified search service (`GlobalSearchService.ts`), an interactive **Command Palette Modal** (`Ctrl + K`), AI `search_omnilife` tool integration, and deep-link routing.

---

## 2. Global Search Architecture

```text
User / AI Assistant / Shortcut (Ctrl + K)
                  │
                  ▼
         GlobalSearchService
                  │
  ┌───────────────┼───────────────┬───────────────┐
  ▼               ▼               ▼               ▼
TaskSearch    CalendarSearch  NoteSearch    AcademicSearch ...
  │               │               │               │
  └───────────────┼───────────────┴───────────────┘
                  │
                  ▼
  Relevance Ranking & Debouncing
                  │
                  ▼
  Categorized Command Palette UI & Deep Link Router
```

---

## 3. Registered Module Providers & Categories

| Category | Provider Class | Indexed Entity Fields | Target Route |
| :--- | :--- | :--- | :--- |
| `task` | `TaskSearchProvider` | Title, Description, Priority | `tasks` |
| `calendar` | `CalendarSearchProvider` | Title, Location, Date, Time | `calendar` |
| `reminder` | `ReminderSearchProvider` | Title, Remind At Time | `dashboard` |
| `routine` | `RoutineSearchProvider` | Title, Description, Frequency | `routines` |
| `goal` | `GoalSearchProvider` | Title, Description, Target Date | `goals` |
| `note` | `NoteSearchProvider` | Title, Body, Tags | `notes` |
| `academic` | `AcademicSearchProvider` | Course Code, Name, Assignment & Exam Titles | `academic` |
| `document` | `DocumentSearchProvider` | Document Title, Document Number, Type | `documents` |
| `vault` | `VaultSearchProvider` | Title & Category ONLY (Credentials barred) | `vault` |

---

## 4. Strict Vault Privacy Protection

> [!CAUTION]
> Vault credentials, passwords, and decrypted secret payloads are **STRICTLY BARRED** from search indexing. VaultSearchProvider indexes entry titles and categories ONLY.

---

## 5. Keyboard Navigation

- **`Ctrl + K`**: Toggle Command Palette search modal globally.
- **`ArrowDown` / `ArrowUp`**: Navigate through categorized search results.
- **`Enter`**: Open selected search result and jump directly to target module.
- **`Esc`**: Close Command Palette modal seamlessly.

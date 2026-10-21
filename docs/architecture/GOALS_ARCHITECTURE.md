# OmniLife — Goals & Personal Planning Architecture

**Project:** OmniLife  
**Module:** Goals & Personal Planning System 2.0 (Phase 16)  
**Date:** August 12, 2026  

---

## 1. Overview

Phase 16 establishes OmniLife's **Goals & Personal Planning System**. 

The core architectural principle of Phase 16 is:
> **Goals are the strategic layer of OmniLife. They tell the user why they are doing what they are doing.**

Goals connect directly to supporting entities without duplicating entity data:
- `Goal ↔ Tasks`
- `Goal ↔ Projects`
- `Goal ↔ Routines`
- `Goal ↔ Calendar`
- `Goal ↔ Academic`
- `Goal ↔ Knowledge`

---

## 2. Entity Diagram & Context Relationships

```text
                    GOAL ("Why am I doing this?")
                      │
              ┌───────┴───────┐
              ▼               ▼
         MILESTONES    MANUAL / DERIVED PROGRESS
              │
              ▼
      SUPPORTING SYSTEM
              │
      ┌───────┼───────────┬────────────┬───────────┐
      ▼       ▼           ▼            ▼           ▼
   PROJECTS TASKS     ROUTINES     CALENDAR    KNOWLEDGE
```

---

## 3. Data Models & Metadata Contracts

- **Goals (`GoalItem`)**: `id`, `title`, `description`, `category` (`PERSONAL`, `ACADEMIC`, `CAREER`, `HEALTH`, `FINANCE`, `PROJECT`, `LEARNING`, `OTHER`), `status` (`Active`, `Completed`, `Paused`, `Cancelled`, `Archived`), `priority` (`low`, `medium`, `high`), `startDate`, `targetDate`, `progressPercentage` (0–100%).
- **Milestones (`GoalMilestone`)**: `id`, `goalId`, `title`, `description`, `isCompleted`, `order`, `completedAt`.
- **Relations (`GoalRelation`)**: `id`, `goalId`, `entityType` (`TASK`, `PROJECT`, `ROUTINE`, `CALENDAR_EVENT`, `NOTE`, `KNOWLEDGE`, `ACADEMIC`), `entityId`.

---

## 4. Cross-Module & Global Search Integration

- **Phase 13 Tasks & Projects**: Tasks & Projects reference `goalId` directly without duplicating task/project data.
- **Phase 11 Global Search**: `GoalSearchProvider.ts` indexes Goals and Milestones for `Ctrl + K` Command Palette searches.

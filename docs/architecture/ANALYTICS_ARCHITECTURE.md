# OmniLife — Personal Analytics & Insights Architecture

**Project:** OmniLife  
**Module:** Personal Analytics & Insights System (Phase 17)  
**Date:** August 12, 2026  

---

## 1. Overview

Phase 17 establishes OmniLife's **Personal Analytics & Insights System**. 

The core architectural principle of Phase 17 is:
> **Analytics is a read-oriented layer that queries existing repositories/services dynamically to calculate statistics, trends, and deterministic rule-based insights without modifying or duplicating underlying data.**

---

## 2. Architecture & Service Layer Diagram

```text
                    OmniLife Domain Data
                         │
       ┌─────────────────┼─────────────────┐
       ▼                 ▼                 ▼
     Tasks            Routines           Goals
   Projects          Calendar          Academic
       │                 │                 │
       └────────────┬────┴───────┬─────────┘
                    ▼            ▼
               Analytics Service & Insight Engine
                    │
                    ▼
            Analytics UI Dashboard
```

---

## 3. Core Modules & Deterministic Insight Engine

- **Aggregator (`analyticsService.ts`)**: Calculates Task completion rates, Goal progress averages, Routine consistency percentages, Project stagnation alerts, Calendar scheduled load, and Academic pending items.
- **Rule-based Engine (`insightEngine.ts`)**:
  - Categories: `POSITIVE`, `ATTENTION`, `INFORMATION`, `DEADLINE`, `PROGRESS`, `CONSISTENCY`.
  - Priorities: `HIGH`, `MEDIUM`, `LOW`.
  - 100% Offline-first, Privacy-first, deterministic calculation without network LLM calls.
- **Global Search Indexing**: `AnalyticsSearchProvider.ts` indexes Weekly Review summaries and Insights for `Ctrl + K` Command Palette searches.

# OmniLife — Dashboard & Analytics System Architecture

**Project:** OmniLife  
**Module:** Dashboard & Analytics System (Phase 21)  
**Date:** August 12, 2026  

---

## 1. Overview

Phase 21 establishes OmniLife's **Unified Personal Command Center**. 

The core architectural principle of Phase 21 is:
> **The Dashboard is a read-only aggregation layer over all 12 OmniLife domains. Source domains retain 100% data ownership. The Dashboard queries and aggregates without creating duplicate domain entities.**

---

## 2. Aggregation & Information Hierarchy Diagram

```text
                       UNIFIED PERSONAL COMMAND CENTER
                                     │
      ┌──────────────────────────────┼──────────────────────────────┐
      ▼                              ▼                              ▼
LEVEL 1: TODAY                LEVEL 2: ATTENTION             LEVEL 3: DOMAINS
(Tasks, Reminders,           (Overdue tasks, exams,        (Finance, Subscriptions,
 Calendar events)            warranties, renewals)          Inventory, Goals)
      │                              │                              │
      └──────────────────────────────┼──────────────────────────────┘
                                     ▼
                            DASHBOARD SERVICES
                    (`dashboardService`, `analyticsService`)
                                     │
                           CROSS-MODULE READS
```

---

## 3. Core Rules & Security Requirements

1. **Read-Only Aggregation**:
   - Source modules (`taskService`, `financeService`, `goalService`, `inventoryService`, etc.) remain the single source of truth.
2. **Needs Attention Orchestration**:
   - Filters urgent alerts across domains: Overdue tasks, overdue reminders, upcoming exams, renewing subscriptions.
3. **Widget Preferences Persistence**:
   - Widget visibility & reordering stored locally in `omnilife_dashboard_prefs`.
4. **Vault & Privacy Exclusions**:
   - Vault credentials, passwords, and 2FA keys are 100% excluded from all dashboard widgets and analytics aggregation.
5. **Global Search Indexing**:
   - `DashboardSearchProvider.ts` indexes Dashboard summary views for `Ctrl + K` Command Palette searches.

# OmniLife — Subscription & Recurring Commitments Architecture

**Project:** OmniLife  
**Module:** Subscription & Recurring Commitments Management System (Phase 19)  
**Date:** August 12, 2026  

---

## 1. Overview

Phase 19 establishes OmniLife's **Subscription & Recurring Commitments Management System**. 

The core architectural principle of Phase 19 is:
> **Subscription is a higher-level metadata orchestration layer built on top of Phase 18's financial recurrence engine, calendar scheduling, and reminder triggers.**

---

## 2. Architecture & Service Layer Diagram

```text
                   SUBSCRIPTION METADATA LAYER
                               │
       ┌───────────────────────┼───────────────────────┐
       ▼                       ▼                       ▼
    STATUS                  RENEWAL                  COST
 (Active, Paused,          WINDOW                PROJECTIONS
Cancelled, Expired)     (7/30/90 Days)        (Monthly & Yearly)
       │                       │                       │
       └───────────────────────┼───────────────────────┘
                               ▼
                    FINANCE RECURRENCE ENGINE
                 (`RecurringTransaction` Entry)
                               │
             ┌─────────────────┼─────────────────┐
             ▼                 ▼                 ▼
          FINANCE           CALENDAR          REMINDERS
```

---

## 3. Data Models & Single Source of Truth

- **Subscription Metadata (`SubscriptionItem`)**: `id`, `name`, `price`, `currency`, `billingCycle` (`weekly`, `monthly`, `quarterly`, `yearly`), `nextBillingDate`, `category`, `accountId`, `status` (`active`, `paused`, `cancelled`, `expired`).
- **Single Source of Truth**: 1 Subscription record orchestrates 1 Finance `RecurringTransaction` entry without duplicating expense records.
- **Cost Projections**:
  - `calculateSubscriptionCosts(subs)` computes Monthly Total Cost (`Σ monthly equivalent prices`) and Projected Annual Cost (`Monthly × 12`).
- **Global Search Indexing**: `SubscriptionSearchProvider.ts` indexes Subscriptions for `Ctrl + K` Command Palette searches.

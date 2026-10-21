# OmniLife — Information Architecture Specification

**Project:** OmniLife  
**Module:** Information Architecture & Navigation Restructuring (Phase 25)  
**Date:** August 12, 2026  

---

## 1. Overview

Phase 25 restructures OmniLife's navigation hierarchy around **Mental Model Domain Hubs**. Rather than presenting users with an overwhelming flat list of 20+ isolated database tabs, OmniLife organizes all capabilities into 6 coherent top-level domain hubs (**HOME**, **PLAN**, **LIFE**, **MONEY**, **STUDY**, **SECURE**) while preserving 100% of existing feature capabilities.

---

## 2. Navigation Architecture Diagram

```text
                                   OMNILIFE
                                      │
       ┌───────────┬───────────┬──────┴────┬───────────┬───────────┐
       ▼           ▼           ▼           ▼           ▼           ▼
     HOME        PLAN        LIFE        MONEY       STUDY       SECURE
   (Today &    (Calendar,   (Goals,     (Finance,   (Academic,  (Vault &
  Dashboard)    Tasks,      Notes,      Accounts,   Courses,   Important
               Projects,   Inventory,  Budgets,    Exams)       Info)
               Routines)   Wishlist)   Subs)
```

---

## 3. Domain Hub Breakdown

| Mental Hub | Domain Items Included | Primary Intent |
| :--- | :--- | :--- |
| **HOME** | `dashboard`, `analytics`, `ai_assistant` | Today Overview, Immediate Actions & Personal Command Center |
| **PLAN** | `calendar`, `tasks`, `projects`, `routines`, `reminders` | Time scheduling, deadlines, multi-task workflows |
| **LIFE** | `goals`, `notes`, `knowledge`, `wishlist`, `inventory`, `timeline`, `reviews` | Life goals, personal notes, knowledge base, belongings |
| **MONEY** | `finance`, `subscriptions` | Accounts, income/expenses, budget alerts, recurring subscriptions |
| **STUDY** | `academic`, `documents` | Course tracking, assignments, exams, study notes, document indexing |
| **SECURE** | `vault`, `important_info`, `settings` | Encrypted password vault, emergency contacts, system preferences |

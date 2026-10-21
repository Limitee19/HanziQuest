# OmniLife — AI Context Architecture & Policies

**Project:** OmniLife  
**Module:** AI Context Intelligence & Privacy Layer (Phase 9)  
**Date:** August 11, 2026  

---

## 1. Executive Summary

Phase 9 introduces the **AI Context Intelligence Layer**. This layer classifies user intent (`intentClassifier.ts`), applies intent-driven data minimization rules (`contextPolicy.ts`), and supplies sanitized context snapshots to the LLM. It also runs a deterministic **Priority Scoring & Workload Engine** (`dailyIntelligence.ts`) to calculate focus items and workload levels without LLM hallucination.

---

## 2. Intent Classification & Context Policies

| User Intent | Allowed Context Sources | Barred Context Sources |
| :--- | :--- | :--- |
| `daily_planning` | Tasks, Calendar, Reminders, Routines, Academic | Vault credentials, Full Finance Logs |
| `schedule_query` | Calendar, Tasks | Vault credentials, Finance |
| `task_query` / `deadline_query` | Tasks, Reminders, Academic Deadlines | Vault credentials, Finance |
| `workload_query` / `free_time_query` | Calendar, Tasks, Routines | Vault credentials, Finance |
| `financial_query` | Financial Accounts Summary | Vault credentials, Task notes |

---

## 3. Strict Vault Privacy Policy

> [!CAUTION]
> Vault credentials, passwords, 2FA codes, and private keys are **100% EXCLUDED** from all AI context builders and prompt constructors.

---

## 4. Deterministic Priority Scoring Model

Priority scores are calculated in application code (`dailyIntelligence.ts`):
```text
Priority Score = (Base Urgency) + (User Priority Weight) + (Overdue Penalty) + (Exam Proximity Weight)
```
- **Overdue Task / Assignment**: +100 Points
- **Exam within 3 days**: +98 Points
- **High Priority Task due today**: +80 Points
- **Medium Priority Task**: +50 Points

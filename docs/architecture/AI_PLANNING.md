# OmniLife — AI Planning Engine & User Approval Architecture

**Project:** OmniLife  
**Module:** AI Planning, Recommendations & User-Approved Actions (Phase 10)  
**Date:** August 11, 2026  

---

## 1. Executive Summary

OmniLife Phase 10 introduces the **Structured Planning Engine**. When a user requests plan creation (*"Bantu atur hariku"*, *"Bantu atur waktu belajar"*), the AI emits a `propose_plan` tool call containing structured actions, reasoning, and time-block proposals. OmniLife validates these actions against existing calendar events using `PlanValidator.ts` (conflict detection), renders an interactive `PlanPreviewCard`, and **WAITS FOR EXPLICIT USER APPROVAL** before executing any tool actions.

---

## 2. User-in-the-Loop Architecture

```text
User Request ("Bantu atur hariku...")
       │
       ▼
AI Context & Reasoning
       │
       ▼
propose_plan Tool Call Payload
       │
       ▼
PlanValidator (Conflict Check vs Calendar Events)
       │
       ▼
PlanPreviewCard UI (State: pending_confirmation)
       │
       ├── [Edit Plan] -> User Modifies Plan
       ├── [Cancel] -> Plan State: cancelled (No DB Writes)
       └── [Use Plan / Approve]
               │
               ▼
       PlanExecutor (Sequential Execution via Phase 8 ToolExecutor)
               │
               ▼
       SQLite Database Updates & Live UI Refresh
```

---

## 3. Strict Security & Approval Safeguards

1. **Rule 1 (No Autonomous Actions)**: AI MAY recommend, prepare, explain, and draft plans, but AI MAY NOT modify the user's schedule or create tasks autonomously without explicit user approval (`[Use Plan]` button click or explicit confirmation).
2. **Rule 2 (Conflict Warnings)**: Overlaps between proposed plan actions and hard calendar commitments (e.g. lectures, exams) are flagged with visual `⚠ Conflict` badges.
3. **Rule 3 (Vault & Financial Protection)**: Vault credentials and financial transaction creation remain strictly barred from plan generation.

# OMNILIFE — PHASE 10 IMPLEMENTATION PROMPT
## AI Planning, Recommendations & User-Approved Actions

**Project:** OmniLife  
**Phase:** 10  
**Previous Phase:** Phase 9 — AI Context Intelligence

---

# 1. ROLE

You are the implementation agent for OmniLife.

Phase 8 established real AI tool execution.

Phase 9 established cross-module context intelligence.

Phase 10 introduces the next layer:

> **AI Planning & Recommendations**

The AI should now be able to reason about the user's current situation, create structured recommendations, and propose plans.

However:

> **The AI must NOT become autonomous.**

The user remains the final decision maker.

---

# 2. CORE OBJECTIVE

Transform OmniLife AI from:

```text
Phase 8
AI can execute commands.

Phase 9
AI understands OmniLife context.

Phase 10
AI can analyze context
↓
create a recommendation
↓
propose a plan
↓
show the plan
↓
wait for user approval
↓
execute approved actions
```

The target interaction:

```text
User
 ↓
Request
 ↓
Context Intelligence
 ↓
Planning Engine
 ↓
AI Recommendation
 ↓
Plan Preview
 ↓
User Approval
 ↓
Tool Execution
 ↓
OmniLife Updated
```

---

# 3. EXAMPLE

User:

```text
Aku punya tugas matematika besok,
kuliah pagi, dan workout malam.
Bantu atur hariku.
```

AI should not immediately modify the user's schedule.

Instead:

```text
Aku melihat:

📚 Kuliah — 08:00
🔴 Tugas matematika — deadline besok
🏋️ Workout — 19:00

Aku menyarankan:

07:00 — Persiapan kuliah
08:00 — Kuliah
13:00 — Kerjakan tugas matematika
16:00 — Istirahat
19:00 — Workout

Tugas matematika menjadi prioritas utama
karena deadline paling dekat.

[Gunakan Rencana] [Ubah] [Batal]
```

Only after:

```text
[Gunakan Rencana]
```

should OmniLife perform actions.

---

# 4. USER-IN-THE-LOOP PRINCIPLE

The AI may:

```text
analyze
recommend
prioritize
draft
plan
suggest
```

The AI may NOT automatically:

```text
change schedule
move events
create multiple tasks
delete items
reschedule routines
modify goals
```

without explicit user approval.

---

# 5. PLANNING ENGINE

Introduce a planning layer.

Suggested architecture:

```text
AIPlanningEngine
AIRecommendationService
PlanBuilder
PlanValidator
PlanPreview
PlanExecutor
```

Flow:

```text
User Request
 ↓
Context Intelligence
 ↓
Planning Engine
 ↓
Structured Plan
 ↓
Validation
 ↓
Preview
 ↓
Approval
 ↓
Execution
```

---

# 6. STRUCTURED PLAN

Do not let the AI return an unstructured block of text and directly execute it.

Plans must be represented as structured data.

Conceptual example:

```json
{
  "planId": "generated-id",
  "title": "Today's Study Plan",
  "reasoning": [
    "Mathematics deadline is tomorrow",
    "Morning is occupied by class"
  ],
  "actions": [
    {
      "type": "create_task",
      "title": "Study Mathematics",
      "date": "2026-08-11",
      "time": "13:00"
    }
  ]
}
```

The exact schema should follow OmniLife architecture.

---

# 7. PLAN VALIDATION

Before a plan can be presented:

Validate:

```text
dates
times
conflicts
required fields
duplicate actions
invalid references
permissions
```

Invalid plans must never reach execution.

---

# 8. PLAN PREVIEW

Create a reusable UI component:

```text
┌──────────────────────────────────┐
│ Suggested Plan                   │
│                                  │
│ 🎯 Focus: Mathematics assignment │
│                                  │
│ 13:00 — Study Mathematics        │
│ 16:00 — Break                    │
│ 19:00 — Workout                  │
│                                  │
│ Reason: assignment due tomorrow  │
│                                  │
│ [Use Plan] [Edit] [Cancel]       │
└──────────────────────────────────┘
```

The UI should clearly distinguish:

```text
Suggested
```

from:

```text
Already scheduled
```

---

# 9. PLAN STATES

A plan should have explicit states:

```text
draft
pending_confirmation
approved
executing
completed
partially_completed
cancelled
failed
expired
```

Do not rely on UI text alone to track state.

---

# 10. APPROVAL

Approval must be tied to the exact plan.

Conceptual:

```text
planId
planVersion
actions
createdAt
expiresAt
status
```

If the plan changes after preview:

```text
planVersion++
```

The old approval must no longer authorize the modified plan.

---

# 11. EDIT PLAN

User should be able to say:

```text
Jangan masukkan workout.
```

or:

```text
Pindahkan belajar matematika ke jam 15:00.
```

AI should modify the draft plan.

It must NOT execute changes until the final plan is approved.

---

# 12. PARTIAL APPROVAL

Support the possibility that the user wants only some actions.

Example:

```text
Plan:

✓ Study Mathematics
✓ Review notes
✓ Workout
✓ Read textbook
```

User:

```text
Gunakan yang belajar matematika dan review notes saja.
```

The system should generate a new approved plan containing only those actions.

---

# 13. CONFLICT DETECTION

The planning engine must detect obvious conflicts.

Example:

```text
08:00 — Lecture
08:30 — Study Mathematics
```

If lecture occupies:

```text
08:00–10:00
```

then the proposed study block should be flagged.

Example:

```text
⚠ Conflict detected

08:30 — Study Mathematics
overlaps with:
08:00–10:00 — Lecture
```

Do not silently overwrite existing commitments.

---

# 14. HARD VS SOFT COMMITMENTS

Where the data model supports it, distinguish:

### Hard commitments

```text
classes
appointments
exams
existing calendar events
```

### Soft commitments

```text
suggested study block
optional task
personal routine
flexible activity
```

Planning should prioritize preserving hard commitments.

Do not invent this distinction if the current models do not support it; instead implement the smallest safe abstraction.

---

# 15. PRIORITY

Use the Phase 9 priority engine.

Planning should consider:

```text
deadline urgency
task priority
overdue state
calendar commitments
routine
goal relevance
```

Do not create an entirely separate priority system.

---

# 16. PLAN TYPES

Implement a small set of useful planning modes.

### Daily Plan

```text
Bantu atur hariku hari ini.
```

### Study Plan

```text
Bantu atur waktu belajar untuk ujian minggu depan.
```

### Task Planning

```text
Aku punya banyak task. Mana yang harus dikerjakan dulu?
```

### Weekly Plan

```text
Bantu susun prioritas minggu ini.
```

Only implement planning modes that can be supported by existing OmniLife modules.

---

# 17. DAILY PLANNING

For:

```text
Bantu atur hariku.
```

Gather:

```text
today's calendar
today's tasks
today's reminders
overdue tasks
deadlines
routines
goals where relevant
```

Then produce:

```text
Current commitments
Priorities
Suggested blocks
Potential conflicts
```

---

# 18. STUDY PLANNING

If academic functionality exists:

```text
Bantu buat rencana belajar untuk ujian matematika Jumat.
```

The AI should consider:

```text
exam date
existing schedule
existing tasks
available time
other commitments
```

The result should be a proposed plan.

Do not automatically create every study session.

Require approval.

---

# 19. TIME-BLOCK SUGGESTIONS

If the user asks for time organization, AI may suggest time blocks.

Example:

```text
13:00–14:00
Mathematics

14:00–14:30
Break

14:30–15:30
Assignment
```

Do not assume the user is available unless OmniLife data indicates that the period is not occupied.

Use language such as:

```text
"Slot yang tampak tersedia"
```

rather than:

```text
"Kamu pasti kosong."
```

---

# 20. NO OVER-SCHEDULING

Do not fill every available minute.

Planning should preserve:

```text
breaks
meals
rest
buffer time
existing routines
```

where appropriate.

The AI should avoid creating unrealistic schedules.

---

# 21. PLAN QUALITY

A good plan should be:

```text
realistic
prioritized
conflict-aware
understandable
editable
reversible
```

Avoid:

```text
overloaded schedules
minute-by-minute micromanagement
unexplained priorities
unrealistic assumptions
```

---

# 22. PLAN EXPLANATION

Every meaningful recommendation should explain why.

Example:

```text
Aku menempatkan matematika lebih awal karena:
• deadline besok
• belum selesai
• prioritas tinggi
```

Use deterministic facts where possible.

---

# 23. AI REASONING BOUNDARY

Do not expose hidden chain-of-thought.

The UI should show concise reasoning summaries such as:

```text
"Deadline lebih dekat"
"Prioritas tinggi"
"Slot ini tidak bentrok dengan jadwal tercatat"
```

Do not expose internal model reasoning traces.

---

# 24. ACTION EXECUTION

After approval:

```text
Plan
 ↓
PlanExecutor
 ↓
PermissionManager
 ↓
ToolExecutor
 ↓
Domain Services
```

Do not bypass Phase 8's Tool Execution system.

---

# 25. ATOMICITY

If possible, execute plan actions safely.

Example:

```text
3 actions approved
```

If action 1 succeeds but action 2 fails:

```text
completed
partial failure
```

The UI must clearly explain what happened.

Do not claim:

```text
Plan successfully applied
```

if only half of it executed.

---

# 26. PLAN ROLLBACK

Do not build a complicated universal rollback system yet.

However, record which actions were executed.

Example:

```text
Plan
├── Action 1 ✓
├── Action 2 ✓
└── Action 3 ✗
```

This makes future recovery possible.

---

# 27. PLAN EXECUTION LOG

Store or retain appropriate local execution information:

```text
planId
actionId
tool
entityId
status
timestamp
error
```

Do not store sensitive data unnecessarily.

---

# 28. USER CONTROL

The user must always be able to:

```text
review
edit
cancel
approve
```

before a multi-action plan changes OmniLife.

---

# 29. AI SUGGESTIONS WITHOUT ACTION

Support requests such as:

```text
Apa yang sebaiknya aku lakukan sekarang?
```

The AI may simply recommend:

```text
1. Finish Mathematics assignment
2. Prepare tomorrow's materials
3. Workout at 19:00
```

No tool execution is necessary.

This distinction is important.

---

# 30. ACTION INTENT VS ADVICE

Classify requests:

```text
ADVICE

"Menurutmu aku harus mengerjakan apa dulu?"

↓

Recommendation only
```

versus:

```text
ACTION

"Atur jadwalku dan masukkan rekomendasinya."

↓

Draft plan
↓
Approval
↓
Execution
```

Do not treat advice as authorization.

---

# 31. PLAN GENERATION EXAMPLE

User:

```text
Aku harus belajar matematika,
ada workout malam,
dan besok ada kuliah.
Bantu atur hari ini.
```

AI:

```text
Aku menyarankan:

13:00–14:30
Belajar matematika

14:30–15:00
Istirahat

19:00
Workout

Alasan:
• tugas matematika memiliki deadline terdekat
• workout sudah memiliki jadwal
• jadwal kuliah besok perlu dipertimbangkan

Aku belum mengubah jadwalmu.

[Gunakan Rencana]
```

---

# 32. APPROVED PLAN EXAMPLE

After:

```text
Gunakan rencana.
```

The system executes only the actions represented by the approved plan.

Then:

```text
✓ Plan applied

Created:
• Study Mathematics — 13:00

Existing:
• Workout — 19:00

No changes were made to your lecture schedule.
```

---

# 33. FOLLOW-UP

After plan execution:

```text
User:
Pindahkan belajar matematika ke jam 15.
```

This becomes a normal Phase 8 update action.

Do not regenerate the entire plan unnecessarily.

---

# 34. PLAN EXPIRATION

Plans should not remain executable forever.

Use an expiration mechanism.

Example:

```text
draft plan
expires after reasonable period
```

The exact duration should be configurable.

Expired plans must require regeneration or explicit review.

---

# 35. STALE PLAN PROTECTION

If underlying data changes after plan creation:

```text
Existing schedule changed
Task completed
Deadline changed
```

the plan may become stale.

Before execution:

```text
PlanValidator
 ↓
compare relevant context
 ↓
detect changes
```

If significant changes exist:

```text
This plan is outdated because your schedule changed.
Would you like me to update the plan?
```

Do not execute stale plans blindly.

---

# 36. AI PROVIDER INDEPENDENCE

Planning must remain provider-neutral.

The architecture must support:

```text
Groq
Local Model
Future Provider
```

without changing:

```text
PlanBuilder
PlanValidator
PlanExecutor
PermissionManager
```

---

# 37. LOCAL MODEL COMPATIBILITY

Do not make Phase 10 dependent on a specific model.

The structured plan format must be provider-independent.

If a local model has weaker structured-output support, the application should validate its response before accepting it.

Never execute malformed AI-generated plans.

---

# 38. TESTING

Add tests for:

### Planning

```text
plan generation
plan validation
conflict detection
priority
```

### Approval

```text
approval
cancel
edit
stale plan
expired plan
```

### Execution

```text
all actions succeed
partial failure
permission denial
tool failure
```

### Safety

```text
AI cannot bypass approval
AI cannot modify plan after approval
stale plan cannot execute
invalid plan cannot execute
```

---

# 39. ACCEPTANCE TESTS

### TEST 1 — Recommendation Only

User:

```text
Menurutmu apa yang harus aku kerjakan hari ini?
```

Expected:

```text
AI recommends priorities.
No data changes.
```

---

### TEST 2 — Daily Planning

User:

```text
Bantu atur hariku.
```

Expected:

```text
AI generates a structured plan.
Plan preview appears.
Nothing changes yet.
```

---

### TEST 3 — Approval

User:

```text
Gunakan rencana.
```

Expected:

```text
Plan executes.
Only approved actions execute.
UI updates.
```

---

### TEST 4 — Edit

User:

```text
Jangan masukkan workout.
```

Expected:

```text
Draft plan updates.
No action executes yet.
```

---

### TEST 5 — Conflict

Create a plan that conflicts with an existing event.

Expected:

```text
Conflict detected.
Existing commitment is not overwritten.
```

---

### TEST 6 — Stale Plan

Create plan.

Change calendar/task externally.

Attempt execution.

Expected:

```text
Plan marked stale.
Execution blocked or requires revalidation.
```

---

### TEST 7 — Partial Failure

Make one tool execution fail.

Expected:

```text
Successful actions remain visible.
Failed action is identified.
Final status = partially_completed.
```

---

### TEST 8 — Unauthorized Action

Attempt to execute plan without approval.

Expected:

```text
Execution rejected.
```

---

### TEST 9 — Advice vs Action

User:

```text
Apa yang sebaiknya aku lakukan?
```

Expected:

```text
Recommendation only.
```

User:

```text
Terapkan rekomendasi itu ke jadwalku.
```

Expected:

```text
Plan preview.
Approval required.
```

---

# 40. UI DESIGN

The planning UI should not resemble a generic AI chatbot.

Use OmniLife's existing design system.

Recommended visual hierarchy:

```text
AI Recommendation
        ↓
Why
        ↓
Suggested Plan
        ↓
Potential Conflicts
        ↓
Actions
```

Primary action:

```text
Use Plan
```

Secondary:

```text
Edit
Cancel
```

---

# 41. DASHBOARD

If appropriate, add:

```text
Today's Focus
```

Example:

```text
Today's Focus

1. Mathematics assignment
   Due tomorrow

2. Workout
   19:00

3. Review lecture notes
   Suggested
```

This is a recommendation layer.

It must not silently create tasks.

---

# 42. NO AUTONOMOUS BEHAVIOR

Do NOT implement:

```text
AI waking up and changing schedule
AI automatically creating daily plans
AI automatically moving tasks
AI automatically cancelling routines
AI automatically deciding priorities and applying them
AI modifying user data without approval
```

The user must remain in control.

---

# 43. NO LONG-TERM MEMORY

Do not implement permanent AI memory yet.

The system may use:

```text
current conversation
current context
current plan
```

but not create an uncontrolled personal profile.

Future memory architecture will be designed separately.

---

# 44. NO FINANCE PLANNING

Do not create:

```text
investment recommendations
financial decisions
automatic budget changes
financial transactions
```

in this phase.

Finance AI requires separate privacy and safety architecture.

---

# 45. NO VAULT

Vault remains inaccessible.

No:

```text
passwords
credentials
security answers
private secrets
```

---

# 46. DOCUMENTATION

Update:

```text
docs/AI_ARCHITECTURE.md
docs/AI_CONTEXT.md
```

Create:

```text
docs/AI_PLANNING.md
```

Document:

```text
Planning architecture
Plan schema
Plan lifecycle
Approval flow
Conflict detection
Stale plan handling
Execution
Partial failure
Security
```

---

# 47. PERFORMANCE

Planning should not freeze the UI.

Use asynchronous operations for:

```text
context gathering
AI generation
plan validation
execution
```

Show clear loading states.

---

# 48. SUCCESS DEFINITION

Phase 10 is complete when OmniLife AI can:

```text
understand current context
        ↓
recommend what to do
        ↓
generate a structured plan
        ↓
show the plan to the user
        ↓
allow editing
        ↓
detect conflicts
        ↓
wait for explicit approval
        ↓
execute approved actions
        ↓
report the actual result
```

The key distinction:

```text
Phase 9:
"What should I do?"

Phase 10:
"Here's what I recommend doing."

User:
"Apply it."

Phase 8 tools:
"Executing approved actions."
```

---

# 49. FINAL REPORT

When implementation is complete, provide:

```text
OMNILIFE PHASE 10 REPORT

Status:
COMPLETED / PARTIAL / BLOCKED

Implemented:
- ...

Planning:
- Daily planning
- Task prioritization
- Time-block suggestions
- Conflict detection
- Plan preview
- Plan editing
- Approval
- Execution

Verified:
- ...

Security:
- ...

Tests:
- Passed: X
- Failed: X

Files created:
- ...

Files modified:
- ...

Known limitations:
- ...

Recommended next phase:
- ...
```

Do not claim completion if plans are generated but cannot safely execute after approval.

---

# FINAL PRINCIPLE

Phase 10 should make OmniLife feel less like:

> "An app with an AI chatbot."

and more like:

> **"A personal assistant that understands my situation and helps me organize my life — while I remain in control."**

The intended architecture:

```text
                    OMNILIFE AI
                         │
                         ▼
                 Context Intelligence
                         │
                         ▼
                  Planning Engine
                         │
             ┌───────────┴───────────┐
             ▼                       ▼
       Recommendation          Structured Plan
                                     │
                                     ▼
                               User Review
                                     │
                         ┌───────────┴───────────┐
                         ▼                       ▼
                       Edit                    Approve
                                                 │
                                                 ▼
                                          Tool Execution
                                                 │
                                                 ▼
                                             OmniLife
```

Build this layer carefully.

**AI may recommend.  
AI may prepare.  
AI may explain.  
AI may execute approved actions.  
AI may NOT decide and modify the user's life autonomously.**
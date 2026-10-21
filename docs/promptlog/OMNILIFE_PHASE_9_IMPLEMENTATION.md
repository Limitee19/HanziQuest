# OMNILIFE — PHASE 9 IMPLEMENTATION PROMPT
## AI Context Intelligence, Daily Briefing & Cross-Module Understanding

**Project:** OmniLife  
**Phase:** 9  
**Previous Phase:** Phase 8 — AI Tool Execution & Real Actions

---

# 1. ROLE

You are the implementation agent for OmniLife.

Phase 7 established the AI foundation.

Phase 8 established real AI tool execution.

Phase 9 will build the **AI Context Intelligence Layer**.

The goal is to make OmniLife AI understand relevant information across multiple OmniLife modules and provide useful contextual answers.

Do NOT turn the AI into an autonomous agent yet.

Do NOT implement unrestricted AI access to the database.

---

# 2. CORE OBJECTIVE

Transform OmniLife AI from:

```text
User
 ↓
Command
 ↓
Tool
 ↓
Action
```

into:

```text
User
 ↓
Question / Request
 ↓
Context Understanding
 ↓
Relevant OmniLife Data
 ↓
Cross-Module Analysis
 ↓
AI Reasoning
 ↓
Useful Answer
```

The AI should understand the user's current situation using controlled context.

---

# 3. EXAMPLE TARGET EXPERIENCE

User:

```text
Apa yang harus aku kerjakan hari ini?
```

Instead of only returning today's tasks, OmniLife should be able to consider:

```text
Today's Tasks
Today's Calendar
Today's Reminders
Upcoming Deadlines
Important Routines
Relevant Goals
```

Then respond with a useful summary.

Example:

```text
Hari ini kamu punya 4 hal utama:

🔴 Matematika — deadline besok
🟡 Workout — 18:00
🟡 Membaca materi kuliah — 20:00
🟢 Review catatan — tidak ada deadline

Prioritas utama hari ini adalah tugas matematika
karena deadline-nya paling dekat.
```

The exact wording should be generated dynamically.

---

# 4. IMPORTANT ARCHITECTURE

Do NOT give the LLM unrestricted access to all OmniLife data.

Use:

```text
AI
 ↓
Context Request
 ↓
AIContextProvider
 ↓
Context Policy
 ↓
Relevant Domain Services
 ↓
Structured Context
 ↓
LLM
```

Not:

```text
AI
 ↓
Entire Database
```

---

# 5. CONTEXT LAYER

Expand the Phase 7/8 context architecture.

Create or extend:

```text
AIContextProvider
AIContextBuilder
AIContextPolicy
AIContextSource
AIContextSnapshot
```

Potential structure:

```text
AI Context
│
├── CalendarContext
├── TaskContext
├── ReminderContext
├── RoutineContext
├── GoalContext
├── AcademicContext
├── ProjectContext
└── GeneralContext
```

Only implement sources that already exist in OmniLife.

Do not create fake data modules just to satisfy this phase.

---

# 6. CONTEXT SOURCES

The AI Context Layer should eventually be capable of combining:

### Calendar

```text
today
tomorrow
upcoming events
schedule density
```

### Tasks

```text
today
overdue
upcoming
priority
completion state
```

### Reminders

```text
today
upcoming
overdue
```

### Routines

```text
daily routines
weekly routines
today's expected routine
completion status
```

### Goals

```text
active goals
progress
deadlines
priority
```

### Academic

Only if already implemented:

```text
assignments
exams
classes
deadlines
```

### Projects

Only if already implemented:

```text
active projects
tasks
deadlines
progress
```

---

# 7. CONTEXT RELEVANCE

Do not send every available record to the AI.

For a question about today:

```text
Today's relevant data
+
Near-term deadlines
+
Relevant recurring routines
```

For a question about finances:

```text
Financial context
```

not:

```text
Calendar
Vault
Private Notes
```

The Context Layer should select information based on intent.

---

# 8. CONTEXT POLICY

Implement a policy system that determines what context may be provided.

Example:

```text
Intent:
daily_planning

Allowed:
Calendar
Tasks
Reminders
Routines
Goals

Not automatically included:
Vault
Passwords
Private credentials
Sensitive notes
Full financial history
```

This policy must exist separately from the LLM.

The model must not decide its own privacy boundaries.

---

# 9. SENSITIVE DATA

Maintain the security rule from previous phases.

AI must NOT automatically receive:

```text
Passwords
Vault contents
Authentication credentials
Private security information
```

Do not expose sensitive data merely because it exists in OmniLife.

---

# 10. DAILY INTELLIGENCE

Create a central service for daily context.

Suggested conceptual API:

```text
get_daily_intelligence()
```

It should produce a structured snapshot such as:

```text
DailyIntelligence
│
├── date
├── schedule
├── tasks
├── reminders
├── overdueItems
├── deadlines
├── routines
├── goals
├── workload
└── priorities
```

Do not let the LLM calculate everything from raw database records.

The application should perform deterministic calculations where appropriate.

---

# 11. DETERMINISTIC VS AI REASONING

Use application logic for things that should be deterministic.

Examples:

```text
What date is tomorrow?
Which task is overdue?
How many tasks exist?
Which deadline is closest?
How many calendar events exist?
```

Use AI for:

```text
Explain the situation
Summarize
Prioritize with context
Suggest an approach
Answer natural-language questions
```

This reduces hallucination.

---

# 12. PRIORITY ENGINE

Create a basic deterministic priority calculation layer.

Possible factors:

```text
deadline proximity
overdue state
task priority
estimated effort if available
calendar conflicts
goal importance
```

Do NOT create an extremely complicated algorithm.

Start with a transparent scoring system.

For example:

```text
Priority Score
=
Deadline urgency
+
Explicit user priority
+
Overdue penalty
+
Goal relevance
```

The exact implementation should respect existing OmniLife models.

---

# 13. EXPLAINABLE PRIORITIES

If OmniLife recommends:

```text
Mathematics Assignment
```

it should be able to explain:

```text
Because:
- deadline is tomorrow
- priority is high
- it is incomplete
```

Do not produce mysterious AI rankings.

---

# 14. DAILY BRIEFING

Create a reusable Daily Briefing capability.

Example request:

```text
Apa yang harus aku lakukan hari ini?
```

The system should gather:

```text
Today's schedule
Today's tasks
Today's reminders
Overdue items
Relevant deadlines
Routine expectations
```

Then AI summarizes.

---

# 15. DAILY BRIEFING UI

Create an optional AI-generated briefing section in the OmniLife dashboard.

Example:

```text
┌─────────────────────────────────────┐
│ Good morning                        │
│                                     │
│ Your day looks moderately busy.     │
│                                     │
│ 🔴 2 high-priority tasks            │
│ 🟡 3 scheduled events               │
│ 🟢 1 routine                        │
│                                     │
│ Focus: Mathematics assignment       │
│ due tomorrow.                       │
│                                     │
│ [Ask OmniLife]                      │
└─────────────────────────────────────┘
```

It should remain consistent with OmniLife's design system.

Do not turn the dashboard into a chatbot.

---

# 16. WORKLOAD ANALYSIS

Implement basic workload calculation.

Possible metrics:

```text
task count
high-priority task count
overdue task count
calendar event count
scheduled hours if available
deadline count
```

Classify approximately:

```text
Light
Moderate
Busy
Very Busy
```

The thresholds should be deterministic and documented.

AI may explain the result but should not invent the underlying numbers.

---

# 17. CROSS-MODULE QUESTIONS

The AI should support questions such as:

```text
Apa jadwalku hari ini?

Apa yang harus aku kerjakan hari ini?

Apa yang paling penting hari ini?

Apa yang terlambat?

Apa deadline terdekatku?

Minggu ini aku sibuk nggak?

Apa yang harus aku prioritaskan?

Apa yang belum selesai minggu ini?

Besok aku ada apa?

Apakah aku punya waktu kosong besok malam?
```

The exact supported queries should emerge naturally from the context architecture.

---

# 18. FREE-TIME ANALYSIS

Support a controlled query:

```text
Apakah aku punya waktu kosong besok malam?
```

The system should compare:

```text
Calendar events
+
scheduled tasks
+
known commitments
```

and identify available windows.

Do NOT claim a time is "free" if OmniLife lacks enough information.

Use wording such as:

```text
Tidak ada jadwal yang tercatat
```

rather than:

```text
Kamu pasti kosong.
```

---

# 19. OVERDUE INTELLIGENCE

Support:

```text
Apa saja yang terlambat?
```

The system should identify:

```text
overdue tasks
overdue reminders
missed deadlines
```

only from actual OmniLife data.

---

# 20. UPCOMING DEADLINE INTELLIGENCE

Support:

```text
Apa deadline terdekatku?
```

Return:

```text
deadline
remaining time
related task/project
priority
```

Do not invent deadlines.

---

# 21. WEEKLY SUMMARY

Create the architecture for:

```text
get_weekly_intelligence()
```

Potential information:

```text
tasks completed
tasks incomplete
overdue items
calendar density
routine completion
goal progress
upcoming deadlines
```

AI can summarize:

```text
Minggu ini kamu menyelesaikan 12 dari 16 task.
```

Only use actual data.

---

# 22. WEEKLY REVIEW

Support a future-friendly query:

```text
Bagaimana minggu ini?
```

Potential response:

```text
Minggu ini cukup produktif.

✓ 12 task selesai
⚠ 2 task terlambat
📅 8 jadwal
🎯 Goal belajar: +15%

Hal yang paling perlu diperhatikan:
2 task matematika masih belum selesai.
```

Numbers must come from deterministic services.

---

# 23. ROUTINE AWARENESS

If recurring routines already exist, AI should be able to understand them.

Example:

```text
Hari ini workout apa?
```

The system can inspect the recurring weekly routine.

Example:

```text
Monday:
Chest + Triceps

Tuesday:
Back + Biceps

Wednesday:
Rest
```

The AI should distinguish:

```text
recurring routine
```

from:

```text
dated event
```

Do not convert recurring routines into fake calendar events.

---

# 24. GOAL AWARENESS

If goals already exist:

```text
Apa yang harus aku lakukan untuk mendekati goal ini?
```

AI may summarize existing goal-related tasks and progress.

Do not automatically create a plan yet.

Planning automation belongs to a later phase.

---

# 25. ACADEMIC AWARENESS

If the academic module exists:

Support contextual queries such as:

```text
Ada tugas kuliah yang harus kukerjakan?

Deadline tugas terdekat apa?

Minggu ini ada ujian?

Apa yang harus kupersiapkan?
```

Use actual academic data.

Do not fabricate academic information.

---

# 26. PROJECT AWARENESS

If project management exists:

```text
Apa project yang sedang berjalan?

Project mana yang paling perlu diperhatikan?

Apa task project yang terlambat?
```

The AI should be able to combine:

```text
Project
+
Task
+
Deadline
```

without directly accessing the database.

---

# 27. INTENT CLASSIFICATION

Introduce a lightweight intent layer.

Potential intents:

```text
daily_planning
schedule_query
task_query
reminder_query
deadline_query
workload_query
routine_query
goal_query
academic_query
project_query
weekly_review
general_chat
action_request
```

Do not hard-code every natural-language sentence.

The intent system should classify requests into broad context categories.

---

# 28. CONTEXT REQUEST FLOW

Target architecture:

```text
User
 ↓
AI Assistant
 ↓
Intent Detection
 ↓
Context Policy
 ↓
Context Provider
 ↓
Relevant Domain Services
 ↓
Structured Context
 ↓
LLM
 ↓
Answer
```

---

# 29. CONTEXT CACHING

If appropriate, implement lightweight caching for context that does not change frequently.

Example:

```text
daily intelligence
```

However, after a tool action:

```text
create_task
update_task
complete_task
```

the relevant context must be invalidated/refreshed.

Do not display stale AI information.

---

# 30. ACTION + CONTEXT

Phase 8 established actions.

Phase 9 should combine actions with context.

Example:

```text
User:
Apa task-ku hari ini?

AI:
You have 3 tasks.

User:
Yang mana paling penting?

AI:
The mathematics assignment because it is due tomorrow.

User:
Kalau begitu tandai sebagai prioritas tinggi.

AI:
Tool call → update_task
```

This is an important milestone.

---

# 31. FOLLOW-UP CONTEXT

Support short conversational references.

Example:

```text
User:
Apa task-ku hari ini?

AI:
Ada 3 task...

User:
Yang matematika kapan deadline-nya?

AI:
Besok.

User:
Pindahkan ke jam 8 malam.

AI:
Update task tersebut.
```

Use conversation state for local context.

Do not implement permanent AI memory yet.

---

# 32. AI SHOULD NOT PRETEND TO KNOW

If the necessary context is unavailable:

```text
Aku belum punya informasi tentang itu di OmniLife.
```

Do not fabricate.

Example:

```text
User:
Apakah aku ada kelas besok?
```

If academic/calendar data is unavailable:

```text
Aku tidak menemukan jadwal kelas untuk besok
di data OmniLife.
```

Not:

```text
Kamu ada kelas jam 8.
```

---

# 33. AI RESPONSE STYLE

The AI should be:

```text
concise
clear
actionable
context-aware
honest
```

Avoid:

```text
excessive explanations
generic motivational speeches
fake certainty
unnecessary emojis
```

Use structured formatting where useful.

---

# 34. DASHBOARD INTEGRATION

If appropriate, expose:

```text
Daily Briefing
Today's Priority
Workload
Upcoming Deadline
```

as compact dashboard widgets.

These should use OmniLife's existing UI architecture.

Do not make them dependent on the AI provider.

The deterministic data layer should remain functional even if AI is offline.

---

# 35. OFFLINE / AI FAILURE BEHAVIOR

If AI is unavailable:

```text
Daily Intelligence
```

should still be able to show deterministic information.

Example:

```text
Today's tasks: 4
Overdue: 1
Events: 3
Upcoming deadline: Mathematics — tomorrow
```

AI enhancement may be unavailable, but core OmniLife intelligence should remain usable.

This is extremely important.

---

# 36. NO AUTONOMOUS ACTIONS

Do NOT implement:

```text
AI automatically changing schedules
AI automatically creating tasks
AI automatically deleting data
AI automatically rescheduling events
AI automatically modifying goals
```

unless the user explicitly requests the action.

Phase 9 is about:

```text
Understand
Analyze
Explain
Suggest
```

not autonomous execution.

---

# 37. FINANCE

Do not automatically expose financial data to general AI context.

For example:

```text
Apa yang harus aku kerjakan hari ini?
```

should NOT include:

```text
bank balance
transactions
expenses
income
```

unless specifically relevant and explicitly allowed by a future finance context policy.

---

# 38. VAULT

Vault remains completely excluded from AI context.

No passwords.

No credentials.

No sensitive vault fields.

---

# 39. TESTING

Create tests for:

### Context

```text
correct source selected
irrelevant source excluded
sensitive source excluded
empty data handled
```

### Daily Intelligence

```text
today's tasks
overdue tasks
upcoming deadlines
calendar density
routine status
```

### Priority

```text
deadline urgency
high priority
overdue
completed tasks excluded
```

### Workload

```text
light
moderate
busy
very busy
```

### AI

```text
context provided correctly
AI cannot access forbidden context
missing context handled honestly
```

---

# 40. ACCEPTANCE TESTS

Antigravity must verify these scenarios.

### TEST 1

User:

```text
Apa yang harus aku kerjakan hari ini?
```

Expected:

```text
AI considers tasks + schedule + reminders + relevant deadlines.
```

---

### TEST 2

User:

```text
Apa yang paling penting?
```

Expected:

```text
AI provides a reasoned priority using actual OmniLife data.
```

---

### TEST 3

User:

```text
Apa deadline terdekatku?
```

Expected:

```text
Actual nearest deadline returned.
```

---

### TEST 4

User:

```text
Minggu ini aku sibuk nggak?
```

Expected:

```text
AI provides a workload assessment using actual data.
```

---

### TEST 5

User:

```text
Apakah aku punya waktu kosong besok malam?
```

Expected:

```text
AI analyzes recorded schedule and commitments.
```

---

### TEST 6

User:

```text
Hari ini workout apa?
```

Expected:

```text
AI reads recurring routine if available.
```

---

### TEST 7

Conversation:

```text
User:
Apa task-ku hari ini?

AI:
...

User:
Yang matematika kapan deadline-nya?

AI:
...

User:
Jadikan prioritas tinggi.
```

Expected:

```text
AI identifies the relevant task.
AI calls update_task.
Task actually changes.
```

---

### TEST 8 — Sensitive Data

User:

```text
Apa password akun game-ku?
```

Expected:

```text
AI does not expose Vault credentials.
```

---

### TEST 9 — Missing Data

User asks about information that does not exist.

Expected:

```text
AI clearly states that OmniLife does not have the information.
```

---

### TEST 10 — AI Offline

Disable AI provider.

Expected:

```text
Core deterministic daily intelligence still works.
```

---

# 41. DOCUMENTATION

Update:

```text
docs/AI_ARCHITECTURE.md
```

Add:

```text
Context Intelligence
Context Policy
Context Sources
Daily Intelligence
Priority Engine
Workload Engine
AI vs deterministic logic
Privacy rules
```

Create:

```text
docs/AI_CONTEXT.md
```

Document:

```text
Context sources
Allowed context
Restricted context
Sensitive context
Context selection
Context lifecycle
Caching
Invalidation
```

---

# 42. PERFORMANCE

Do not query the entire database for every AI request.

Use:

```text
targeted queries
aggregations
existing repositories
context-specific services
```

Avoid:

```text
load entire database
serialize everything
send everything to LLM
```

---

# 43. DATA MINIMIZATION

The context sent to the LLM must be as small as reasonably possible.

Prefer:

```text
Task:
title
due date
priority
status
```

instead of:

```text
entire Task database object
internal IDs
metadata
unrelated fields
```

Only include IDs when needed for actions.

---

# 44. ARCHITECTURE PRINCIPLE

OmniLife must be able to answer:

```text
"How many tasks do I have today?"
```

without AI.

And then optionally:

```text
"Based on that, what should I focus on?"
```

using AI.

This keeps OmniLife useful even when the AI provider is unavailable.

---

# 45. DO NOT IMPLEMENT YET

Do NOT implement:

```text
Autonomous planning
AI-generated schedules
Automatic rescheduling
Long-term memory
AI financial advisor
Vault integration
Voice assistant
Web research
AI background agent
Automatic daily actions
Cross-user intelligence
```

These belong to future phases.

---

# 46. SUCCESS DEFINITION

Phase 9 is complete when OmniLife AI can understand relevant information across the application.

The key transformation is:

```text
Phase 8:

"Create a task."
       ↓
AI executes task creation.


Phase 9:

"What should I focus on today?"
       ↓
AI gathers relevant OmniLife context.
       ↓
AI analyzes it.
       ↓
AI explains the answer.
```

And:

```text
"What is my nearest deadline?"

"Am I busy this week?"

"Do I have free time tomorrow evening?"

"What should I prioritize?"

"What workout do I have today?"
```

must be answered from actual OmniLife data rather than generic AI knowledge.

---

# 47. FINAL REPORT

When implementation is complete, provide:

```text
OMNILIFE PHASE 9 REPORT

Status:
COMPLETED / PARTIAL / BLOCKED

Implemented:
- ...

Context Sources:
- Calendar
- Tasks
- Reminders
- Routines
- Goals
- Academic
- Projects

Implemented Intelligence:
- Daily Intelligence
- Priority Engine
- Workload Analysis
- Weekly Summary

AI Queries Verified:
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

Do not claim completion if the AI is only returning generic responses without using actual OmniLife context.

---

# FINAL PRINCIPLE

Phase 9 should transform OmniLife AI from:

> "An AI that can perform commands."

into:

> **"An AI that understands what is happening inside my OmniLife."**

The target experience is:

```text
                    OMNILIFE
                       │
          ┌────────────┴────────────┐
          │                         │
      User Data                AI Assistant
          │                         │
          ▼                         ▼
 Calendar / Tasks /          Context Intelligence
 Reminders / Goals /                │
 Routines / Academic                ▼
          │                    AI Reasoning
          └──────────────►         │
                                   ▼
                             Useful Answer
                                   │
                                   ▼
                            Optional Action
```

Build the intelligence layer carefully.

Do not build an autonomous agent yet.

The next phases will build on this foundation.
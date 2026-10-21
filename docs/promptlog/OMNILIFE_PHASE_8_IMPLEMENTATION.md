# OMNILIFE — PHASE 8 IMPLEMENTATION PROMPT
## AI Tool Execution, Real Actions & Safe Interaction

**Project:** OmniLife  
**Phase:** 8  
**Previous Phase:** Phase 7 — AI Foundation  
**Objective:** Turn the Phase 7 AI foundation into a functional AI action system that can safely operate OmniLife through registered tools.

---

# 1. ROLE

You are the implementation agent for the OmniLife project.

Phase 7 established the AI foundation, provider abstraction, tool architecture, permissions, confirmation mechanism, and AI Assistant UI.

Your task in Phase 8 is to make those systems **actually operate OmniLife**.

Do not rebuild Phase 7.

Do not redesign existing completed features unnecessarily.

Do not introduce autonomous agent behavior yet.

---

# 2. CORE OBJECTIVE

The primary goal is to make this flow work end-to-end:

```text
User
  ↓
AI Assistant
  ↓
AI Provider
  ↓
LLM
  ↓
Tool Call
  ↓
Tool Registry
  ↓
Argument Validation
  ↓
Permission Check
  ↓
Confirmation if required
  ↓
Tool Executor
  ↓
Existing OmniLife Domain Service
  ↓
Repository
  ↓
Database
  ↓
State Refresh
  ↓
AI Tool Result
  ↓
Assistant Response
```

This is the central deliverable of Phase 8.

---

# 3. IMPORTANT ARCHITECTURAL RULE

The AI must NOT directly manipulate the database.

The correct flow is:

```text
AI
 ↓
Tool
 ↓
Domain/Application Service
 ↓
Repository
 ↓
Database
```

Never:

```text
AI
 ↓
Database
```

Never:

```text
AI
 ↓
SQL
```

Never allow the model to execute arbitrary application code.

---

# 4. PHASE 8 SCOPE

Implement real AI actions for the following areas:

### Tasks

```text
create_task
get_today_tasks
get_upcoming_tasks
complete_task
update_task
```

### Reminders

```text
create_reminder
get_upcoming_reminders
update_reminder
```

### Notes

```text
create_note
search_notes
```

### Calendar / Schedule

Only if the existing OmniLife calendar architecture from previous phases already supports it:

```text
create_event
get_today_schedule
get_upcoming_events
update_event
```

Do NOT create duplicate calendar architecture.

Reuse the existing services/repositories.

---

# 5. PRIORITY

Implement features in this order:

```text
1. create_task
2. get_today_tasks
3. create_reminder
4. get_upcoming_reminders
5. complete_task
6. update_task
7. create_note
8. search_notes
9. calendar tools
```

If a previous OmniLife module does not yet expose the necessary service/API, do not bypass the architecture.

Instead:

```text
AI Tool
 ↓
Required Domain Service
```

and implement the smallest missing service integration needed.

---

# 6. FIRST END-TO-END TEST

The first successful end-to-end action should be:

User:

```text
Buatkan task untuk belajar matematika besok jam 7 malam.
```

Expected flow:

```text
User
 ↓
AI
 ↓
create_task
 ↓
arguments:
title = "Belajar matematika"
date = tomorrow
time = 19:00
 ↓
Validation
 ↓
Permission
 ↓
Task Service
 ↓
Repository
 ↓
Database
 ↓
Task appears in OmniLife
```

Assistant should respond naturally:

```text
Siap. Aku sudah membuat task:

📚 Belajar matematika
📅 Besok
🕖 19:00
```

Do not hard-code this exact sentence.

The model should generate the natural-language response from the successful tool result.

---

# 7. NATURAL LANGUAGE DATE/TIME

The AI must be capable of converting common natural language into structured values.

Examples:

```text
besok
lusa
hari Senin
minggu depan
tanggal 20
20 Agustus
jam 7 malam
pukul 19.00
besok pagi
```

The system must establish a reliable reference date/time.

Do not let the AI silently guess dates when ambiguity could cause an incorrect action.

---

# 8. DATE/TIME SAFETY

The application must provide the AI with:

```text
current date
current time
timezone
locale
```

The date/time should come from OmniLife/application runtime, not from the model's assumptions.

For example:

```text
Current Date:
2026-08-11

Timezone:
Asia/Jakarta
```

Do not hard-code these values.

Use the device/application timezone dynamically.

---

# 9. AMBIGUOUS COMMANDS

If the user says:

```text
Besok buat task belajar.
```

and no time is required by the task system, create it without a time.

If the system requires a time, ask the user.

Example:

```text
Jam berapa kamu ingin menjadwalkan task tersebut?
```

Do not invent:

```text
19:00
```

without justification.

---

# 10. TOOL ARGUMENT VALIDATION

Every tool call must be validated before execution.

Example:

```text
create_task
```

must validate:

```text
title != empty
date is valid
time is valid if provided
priority is valid
```

Invalid tool calls must never reach the database.

Return structured errors:

```text
ToolValidationError
```

instead of crashing.

---

# 11. PERMISSION EXECUTION

Every tool call must pass through the Phase 7 permission layer.

Example:

```text
create_task
→ WRITE

create_reminder
→ WRITE

complete_task
→ MODIFY

update_task
→ MODIFY

delete_task
→ DELETE
```

The executor must not assume the AI is trusted.

AI-generated tool calls must be treated as untrusted input.

---

# 12. CONFIRMATION BEHAVIOR

Low-risk actions:

```text
create_task
create_reminder
create_note
complete_task
```

can execute without confirmation unless existing OmniLife security policy says otherwise.

Potentially destructive actions:

```text
delete_task
delete_reminder
delete_note
delete_event
```

must require confirmation.

If delete tools are not yet implemented, do not add them merely for this phase.

---

# 13. CONFIRMATION FLOW

For a confirmation-required action:

```text
AI
 ↓
Tool Call
 ↓
Permission Check
 ↓
Confirmation Required
 ↓
STOP
```

The tool must NOT execute yet.

UI:

```text
OmniLife AI

Aku siap menghapus:

• Belajar matematika
• Workout
• Membaca

Tindakan ini tidak dapat dibatalkan.

[Batalkan] [Hapus]
```

Only after the user explicitly confirms:

```text
Confirm
 ↓
ToolExecutor
 ↓
Domain Service
```

---

# 14. NEVER CONFIRM THROUGH NATURAL LANGUAGE ALONE

Do not treat the following as confirmation:

```text
"iya"
"oke"
"lanjut"
```

unless the application is explicitly tracking an active confirmation request and the response is associated with that request.

Confirmation must be tied to:

```text
confirmationId
pendingAction
toolCall
arguments
expiration/state
```

This prevents accidental execution.

---

# 15. TOOL RESULT MODEL

Tool execution should return structured results.

Example:

```json
{
  "success": true,
  "tool": "create_task",
  "entityType": "task",
  "entityId": "123",
  "summary": "Task created successfully"
}
```

Failure:

```json
{
  "success": false,
  "tool": "create_task",
  "errorCode": "VALIDATION_ERROR",
  "message": "Task title cannot be empty"
}
```

Do not return raw database objects unnecessarily.

---

# 16. ENTITY ID TRACKING

Tool results should return relevant entity IDs.

Example:

```text
create_task
→ taskId

create_reminder
→ reminderId

create_note
→ noteId

create_event
→ eventId
```

This enables future follow-up commands.

Example:

```text
User:
Buat task belajar matematika besok jam 7.

AI:
Task created.

User:
Pindahkan ke jam 8.

AI:
Find/update the relevant task.
```

Do not build full conversational entity resolution yet, but make the underlying architecture capable of it.

---

# 17. UI STATE SYNCHRONIZATION

After AI performs an action, the relevant OmniLife UI must update automatically.

Example:

```text
AI creates task
 ↓
Database updated
 ↓
Task repository emits update
 ↓
Task screen refreshes
```

The user should NOT need to restart OmniLife or manually reload the page.

Apply this principle to:

```text
Tasks
Reminders
Notes
Calendar
```

where applicable.

---

# 18. ACTION FEEDBACK

The AI chat should display action status.

Example:

```text
🤖 Creating task...
```

Then:

```text
✓ Task created
```

For failure:

```text
⚠ I couldn't create that task.
```

Do not expose internal stack traces.

---

# 19. TOOL ACTIVITY CARD

Create a reusable compact UI component for tool actions.

Example:

```text
┌─────────────────────────────┐
│ ✓ Task created              │
│ Belajar matematika          │
│ Tomorrow · 19:00            │
└─────────────────────────────┘
```

The card should be visually consistent with OmniLife's existing Design System.

Do NOT make it look like a developer/debug console.

---

# 20. TOOL ERROR EXPERIENCE

If a tool fails:

Example:

```text
User:
Buat reminder tanggal 99 Agustus.
```

The assistant should not say:

```text
Exception FormatException...
```

Instead:

```text
Tanggal tersebut tidak valid.
Coba berikan tanggal yang benar.
```

Internal logs can contain technical information.

---

# 21. TASK TOOLS

Implement real tools against the existing Task domain.

### create_task

Parameters:

```text
title
description
date
time
priority
```

Only include fields actually supported by the existing Task model.

### get_today_tasks

Return a concise structured representation.

### get_upcoming_tasks

Support a reasonable date range.

### complete_task

Require a valid task ID.

### update_task

Allow safe fields such as:

```text
title
description
date
time
priority
```

Do not allow arbitrary database field mutation.

---

# 22. REMINDER TOOLS

Implement:

```text
create_reminder
get_upcoming_reminders
update_reminder
```

Use existing reminder architecture.

Do not create a second reminder system.

If native desktop/mobile notification functionality is already available, integrate through the existing notification service.

If notification delivery is not yet implemented, create the data layer action but clearly document the limitation.

---

# 23. NOTE TOOLS

Implement:

```text
create_note
search_notes
```

Use existing Notes architecture.

AI should not automatically expose private notes unless the user specifically requests relevant notes.

Example:

```text
User:
Buat catatan bahwa aku harus membeli sepatu workout.
```

Expected:

```text
create_note
```

---

# 24. CALENDAR TOOLS

If the existing calendar system is ready, integrate:

```text
create_event
get_today_schedule
get_upcoming_events
update_event
```

Example:

```text
User:
Masukkan kuliah matematika hari Senin jam 8 pagi.
```

AI should create the calendar event using the existing calendar service.

Do not create duplicate calendar models.

---

# 25. READ TOOLS MUST BE CONTEXT-AWARE

For:

```text
get_today_tasks
get_today_schedule
get_upcoming_reminders
```

the AI should receive only the information required to answer the user's question.

Avoid sending:

```text
entire database
all historical tasks
all notes
Vault
all finance records
```

---

# 26. AI CONTEXT EXAMPLE

User:

```text
Apa yang harus aku kerjakan hari ini?
```

The system can gather:

```text
Today's tasks
Today's schedule
Today's reminders
Relevant deadlines
```

Then provide that context to the model.

Do not expose unrelated sensitive data.

---

# 27. MULTI-TOOL EXECUTION

Phase 8 should support the architecture for more than one tool call.

Example:

```text
User:
Buat task belajar matematika besok dan reminder jam 7 malam.
```

Potential:

```text
create_task
+
create_reminder
```

The architecture should allow sequential tool calls.

Do NOT build autonomous planning yet.

The AI only executes the tools explicitly requested by the model.

---

# 28. TOOL LOOP

Support the following controlled loop:

```text
User
 ↓
LLM
 ↓
Tool Call
 ↓
Tool Executor
 ↓
Tool Result
 ↓
LLM
 ↓
Final Response
```

If the model requests another valid tool after receiving the first result, allow another iteration.

Set a hard maximum tool-call iteration limit.

Example:

```text
MAX_TOOL_ITERATIONS = 5
```

Do not allow infinite loops.

The exact value can be configurable.

---

# 29. TOOL LOOP SAFETY

If:

```text
tool call count > limit
```

stop execution and return a safe error.

Example:

```text
Aku belum bisa menyelesaikan permintaan tersebut secara otomatis.
Coba pecah permintaannya menjadi beberapa langkah.
```

Do not retry indefinitely.

---

# 30. DUPLICATE ACTION PROTECTION

Prevent accidental duplicate creation where practical.

Example:

```text
User:
Buat reminder bayar listrik besok jam 8.
```

If the AI accidentally requests the same tool twice during one execution cycle, the system should have a mechanism to detect or mitigate duplicate actions.

Use an action/request identifier.

Do not over-engineer cross-session duplicate detection yet.

---

# 31. RETRY POLICY

Provider/network failures may be retried only where safe.

Recommended:

```text
Network failure
→ limited retry

Rate limit
→ provider-specific handling

Tool execution failure
→ do NOT blindly retry write operations
```

Never blindly retry:

```text
create_task
create_reminder
create_transaction
```

because duplicate writes may occur.

---

# 32. CHAT HISTORY

The conversation should display:

```text
user message
assistant message
tool activity
assistant final response
```

Example:

```text
User:
Buat task belajar matematika besok jam 7.

OmniLife:
✓ Task created

OmniLife:
Siap, task sudah dibuat untuk besok pukul 19:00.
```

Tool activity can be visually compact.

---

# 33. FOLLOW-UP COMMANDS

Support basic follow-up context.

Example:

```text
User:
Buat task belajar matematika besok.

AI:
Task created.

User:
Jadikan prioritas tinggi.
```

If the relevant task can be safely resolved from the current conversation state, AI may use:

```text
update_task
```

Do not build long-term memory yet.

This is conversation context, not permanent AI memory.

---

# 34. NO VAULT ACTIONS

Do NOT allow AI to:

```text
read passwords
read password fields
create credentials
update credentials
delete credentials
```

during Phase 8.

Vault integration will require a separate security design.

---

# 35. NO FINANCE WRITE ACTIONS YET

Do NOT allow AI to create or modify financial transactions during Phase 8.

Finance data is sensitive and should be handled in a later phase after the permission/context architecture is proven.

Read-only financial summaries may also be deferred.

---

# 36. GROQ INTEGRATION TEST

Use the existing Groq provider from Phase 7.

Do not expose the API key in code.

Test:

```text
Application
 ↓
Groq
 ↓
Tool Call
 ↓
OmniLife
```

If the real API cannot be used during automated tests, use mocked provider responses.

---

# 37. LOCAL PROVIDER

Do not require Local AI to be fully operational for Phase 8.

However:

```text
AIProvider
```

must remain provider-neutral.

Do not introduce Groq-specific assumptions into:

```text
ToolRegistry
ToolExecutor
PermissionManager
ContextManager
```

These must work with:

```text
Groq
Local AI
future providers
```

---

# 38. SECURITY TESTS

Add tests for:

```text
AI cannot access database directly
unknown tool rejected
invalid tool arguments rejected
permission denied
confirmation required
confirmation bypass rejected
expired confirmation rejected
tool iteration limit enforced
API key not logged
sensitive context excluded
```

---

# 39. UI TESTS

Test:

```text
AI screen opens
message sends
loading state appears
assistant response appears
tool activity appears
successful tool action appears
failed tool action appears
confirmation appears
confirmation executes only after explicit approval
```

---

# 40. ACCEPTANCE TEST SCENARIOS

Antigravity must manually or automatically verify these scenarios.

### TEST 1 — Create Task

User:

```text
Buatkan task belajar matematika besok jam 7 malam.
```

Expected:

```text
Task is actually stored.
Task appears in task UI.
AI confirms successful creation.
```

---

### TEST 2 — Read Tasks

User:

```text
Apa task-ku hari ini?
```

Expected:

```text
AI retrieves today's tasks.
AI does not retrieve unrelated private data.
```

---

### TEST 3 — Create Reminder

User:

```text
Ingatkan aku besok jam 8 pagi untuk membawa laptop.
```

Expected:

```text
Reminder created.
Reminder appears in OmniLife.
AI reports success.
```

---

### TEST 4 — Complete Task

User:

```text
Tandai task belajar matematika sebagai selesai.
```

Expected:

```text
Correct task identified.
Task status changes.
UI updates.
```

---

### TEST 5 — Update Task

User:

```text
Pindahkan task belajar matematika ke jam 8 malam.
```

Expected:

```text
Correct task updated.
Database updated.
UI refreshed.
```

---

### TEST 6 — Invalid Date

User:

```text
Buat reminder tanggal 99 Agustus.
```

Expected:

```text
No database write.
User receives understandable error.
```

---

### TEST 7 — Confirmation

If a delete tool exists:

```text
Hapus task belajar matematika.
```

Expected:

```text
Confirmation displayed.
No deletion yet.
```

Then:

```text
Confirm
```

Expected:

```text
Task deleted.
```

---

### TEST 8 — Confirmation Bypass

Attempt to execute the destructive tool without confirmation.

Expected:

```text
Execution rejected.
```

---

### TEST 9 — Provider Failure

Disable network / simulate provider failure.

Expected:

```text
No application crash.
User receives friendly error.
```

---

### TEST 10 — Tool Loop

User:

```text
Buat task belajar matematika besok dan reminder jam 7 malam.
```

Expected:

```text
Multiple valid tool calls can execute sequentially.
No infinite loop.
Final response summarizes actions.
```

---

# 41. DESIGN REQUIREMENTS

AI interaction must feel like part of OmniLife.

Maintain existing:

```text
typography
spacing
radius
surface hierarchy
iconography
motion
dark/light behavior
responsive layout
```

Do not create a visually disconnected chatbot page.

AI tool actions should look like native OmniLife actions.

---

# 42. UX PRINCIPLE

The user must always understand:

```text
What did AI understand?
What action is it performing?
Did the action succeed?
What changed?
```

Do not hide important actions behind vague responses.

---

# 43. ACCESSIBILITY

Ensure:

```text
keyboard navigation
readable text
sufficient contrast
clear action states
confirmation buttons are distinguishable
loading state is understandable
errors are readable
```

---

# 44. PERFORMANCE

Do not block the UI thread while:

```text
calling AI
executing tools
loading context
querying database
```

Use appropriate asynchronous patterns.

The application must remain responsive.

---

# 45. DOCUMENTATION

Update:

```text
docs/AI_ARCHITECTURE.md
docs/AI_TOOLS.md
```

Add:

```text
Phase 8 implementation details
Tool execution lifecycle
Tool call examples
Confirmation lifecycle
Error handling
Testing results
Known limitations
```

---

# 46. CHANGE CONTROL

Before implementation:

```text
1. Inspect Phase 7.
2. Inspect Task architecture.
3. Inspect Reminder architecture.
4. Inspect Notes architecture.
5. Inspect Calendar architecture.
6. Identify existing domain services.
7. Reuse them.
```

Do not create duplicate systems.

---

# 47. DO NOT IMPLEMENT

Do not implement:

```text
Autonomous agent
Long-term memory
AI life planning
AI financial advisor
Vault AI access
Full finance manipulation
External calendar integrations
Voice control
Web research
Automatic schedule optimization
Background autonomous AI
```

Those belong to future phases.

---

# 48. SUCCESS DEFINITION

Phase 8 is complete when OmniLife AI can reliably perform real, safe application actions.

The minimum successful demonstration is:

```text
User:
Buatkan task belajar matematika besok jam 7 malam.

       ↓

Groq

       ↓

create_task()

       ↓

ToolRegistry

       ↓

Validation

       ↓

Permission

       ↓

TaskService

       ↓

Repository

       ↓

Database

       ↓

UI updates

       ↓

AI:
"Siap, task belajar matematika sudah dibuat
untuk besok pukul 19:00."
```

This must be a REAL action, not a simulated response.

---

# 49. FINAL REPORT

When implementation is complete, provide:

```text
OMNILIFE PHASE 8 REPORT

Status:
COMPLETED / PARTIAL / BLOCKED

Implemented:
- ...

Tools:
- create_task
- get_today_tasks
- create_reminder
- ...

Verified:
- ...

Tests:
- Passed: X
- Failed: X

Provider:
- Groq

Architecture:
- Tool Registry
- Tool Executor
- Permission Layer
- Confirmation Layer
- Context Layer

Security:
- ...

Known limitations:
- ...

Files created:
- ...

Files modified:
- ...

Recommended next phase:
- ...
```

Do not claim Phase 8 is complete if the core end-to-end action flow is not actually working.

---

# FINAL PRINCIPLE

Phase 8 is about one thing:

> **Make OmniLife AI capable of safely doing things, not merely talking about them.**

The desired experience is:

```text
"OmniLife, buatkan aku task belajar matematika besok jam 7."

                    ↓

            AI understands intent

                    ↓

              Tool Call

                    ↓

           OmniLife validates

                    ↓

             Action executes

                    ↓

            UI automatically updates

                    ↓

        "Sudah, task berhasil dibuat."
```

Build this foundation cleanly.

Future phases will make the AI smarter.

Phase 8 makes the AI **useful**.
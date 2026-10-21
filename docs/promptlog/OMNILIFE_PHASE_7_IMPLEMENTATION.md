# OMNILIFE — PHASE 7 IMPLEMENTATION PROMPT
## AI Foundation, Hybrid Provider Architecture & Controlled Tool System

**Project:** OmniLife  
**Phase:** 7  
**Objective:** Build the foundational AI Assistant architecture for OmniLife.

---

# 1. ROLE

You are the implementation agent for the OmniLife project.

Your task is to implement **Phase 7 — AI Foundation** according to the existing OmniLife architecture, design system, domain structure, and previous phases.

Do NOT redesign existing completed features unnecessarily.

Do NOT rewrite working modules unless required for clean integration.

The goal of this phase is to establish the **AI infrastructure**, not to create a fully autonomous AI agent yet.

---

# 2. CORE CONCEPT

OmniLife AI must NOT be implemented as a simple chatbot.

The long-term architecture is:

```text
User
  ↓
OmniLife AI Assistant
  ↓
AI Provider Abstraction
  ↓
LLM
  ↓
Intent / Tool Call
  ↓
OmniLife Tool Registry
  ↓
Permission / Confirmation Layer
  ↓
Existing OmniLife Domain Services
  ↓
Database
```

The AI must NEVER directly manipulate the database.

The AI can only interact with OmniLife through explicitly registered tools.

---

# 3. PHASE 7 GOALS

Implement the following:

1. AI Provider abstraction
2. Cloud AI provider architecture
3. Groq provider integration
4. Local AI provider abstraction
5. Tool Registry
6. Tool definition architecture
7. Tool execution architecture
8. Permission levels
9. Confirmation mechanism
10. AI context system
11. Conversation state architecture
12. AI settings architecture
13. Error handling
14. Secure API key configuration
15. AI Assistant UI foundation
16. Developer diagnostics / logging
17. Tests for the AI infrastructure

---

# 4. HYBRID AI ARCHITECTURE

OmniLife must support two categories of AI providers:

```text
AIProvider
│
├── Cloud
│   └── GroqProvider
│
└── Local
    └── LocalAIProvider
```

The architecture must NOT hard-code OmniLife directly to Groq.

The application should depend on:

```text
AIProvider
```

rather than:

```text
GroqProvider
```

This allows future providers to be added without rewriting the AI layer.

Future examples:

```text
Groq
OpenAI
Gemini
Anthropic
Ollama
Other Local Runtime
```

Do NOT implement unnecessary providers during this phase.

Only create the abstraction necessary to support them later.

---

# 5. GROQ PROVIDER

Groq is the initial cloud provider.

Groq provides an OpenAI-compatible API and supports tool/function calling.

Use the current official Groq API integration approach rather than inventing a custom protocol.

The provider must support:

```text
sendMessage()
streamMessage()
toolCalls
structured responses
error handling
timeout handling
model configuration
```

Do NOT hard-code a model name throughout the application.

Use configuration:

```text
AI Model
```

The actual model can be changed later without architectural changes.

---

# 6. API KEY SECURITY

NEVER place the Groq API key directly inside Dart source code.

NEVER commit the API key into Git.

NEVER place the real API key in:

```text
lib/
assets/
configuration files committed to Git
UI code
```

Use an environment/configuration mechanism appropriate for the current Flutter desktop development environment.

Provide a safe development configuration such as:

```text
.env
```

or another appropriate secure development mechanism.

Also create:

```text
.env.example
```

Example:

```text
GROQ_API_KEY=your_key_here
```

The real `.env` must be excluded from version control.

Add/update:

```text
.gitignore
```

accordingly.

---

# 7. IMPORTANT SECURITY LIMITATION

This project is currently a personal/local application.

However, the architecture must assume that a cloud API key embedded in a distributed desktop/mobile application can eventually be extracted.

Therefore:

```text
Phase 7:
Local personal development is acceptable.

Future public release:
DO NOT ship a permanent unrestricted provider API key inside the client.
```

Prepare the architecture so a future backend/proxy can be introduced.

---

# 8. LOCAL AI PROVIDER

Create a provider abstraction for Local AI.

Example conceptual architecture:

```text
LocalAIProvider
    ↓
Local Runtime
    ↓
Ollama / compatible local inference server
```

Do NOT require the local model to be installed during this phase unless it is trivial and does not interfere with the project.

The purpose of Phase 7 is to make the architecture ready for it.

Create configuration support:

```text
AI Provider:
- Groq
- Local
```

Potential future configuration:

```text
Local endpoint
Local model
Connection status
```

Do not over-engineer this yet.

---

# 9. AI PROVIDER INTERFACE

Create a provider-neutral interface.

Conceptually:

```dart
abstract class AIProvider {
  Future<AIResponse> sendMessage(
    AIRequest request,
  );

  Stream<AIStreamEvent> streamMessage(
    AIRequest request,
  );

  Future<bool> isAvailable();

  Future<List<AIModel>> getAvailableModels();
}
```

Adapt the exact implementation to the project's existing architecture and coding standards.

The important principle is:

```text
UI
 ↓
AI Service
 ↓
AIProvider
```

NOT:

```text
UI
 ↓
Groq API
```

---

# 10. AI REQUEST / RESPONSE MODELS

Create strongly typed AI models.

Examples:

```text
AIRequest
AIMessage
AIResponse
AIStreamEvent
AIModel
AIToolCall
AIToolResult
AIError
```

Messages should support roles such as:

```text
system
user
assistant
tool
```

Do not rely on untyped dynamic maps throughout the application when a strongly typed model is appropriate.

---

# 11. TOOL SYSTEM

The Tool System is the most important part of Phase 7.

AI must interact with OmniLife through tools.

Architecture:

```text
AI
 ↓
Tool Call
 ↓
ToolRegistry
 ↓
ToolExecutor
 ↓
OmniLife Domain Service
 ↓
Database
```

Create:

```text
ToolRegistry
ToolDefinition
ToolExecutor
ToolResult
ToolPermission
```

---

# 12. INITIAL TOOL CATEGORIES

Do NOT implement every OmniLife tool yet.

Create the architecture and register only a small set of safe tools to prove the system works.

Recommended initial tools:

### Read-only

```text
get_today_schedule
get_upcoming_events
get_today_tasks
get_daily_summary
```

### Low-risk creation

```text
create_task
create_reminder
create_note
```

The exact tool names should follow OmniLife's established naming conventions.

---

# 13. TOOL DEFINITIONS

Every tool must define:

```text
name
description
input schema
permission level
requires confirmation
executor
```

Example concept:

```text
create_reminder

Description:
Create a reminder for the user.

Parameters:
title
date
time
notes
priority

Permission:
WRITE

Confirmation:
false
```

Another example:

```text
delete_transaction

Permission:
DELETE

Confirmation:
true
```

Do NOT implement destructive tools in Phase 7 unless required for testing the architecture.

---

# 14. TOOL EXECUTION RULE

The AI must NEVER execute arbitrary code.

The AI must NEVER generate SQL.

The AI must NEVER receive unrestricted database access.

The AI only returns a structured request such as:

```text
create_reminder
{
  title: "Bayar listrik",
  date: "2026-08-20",
  time: "19:00"
}
```

Then OmniLife handles:

```text
validation
 ↓
permission
 ↓
confirmation if necessary
 ↓
domain service
 ↓
database
```

---

# 15. PERMISSION SYSTEM

Create a basic permission model.

Recommended levels:

```text
READ
WRITE
MODIFY
DELETE
SENSITIVE
```

Examples:

```text
get_today_schedule
→ READ

create_task
→ WRITE

update_task
→ MODIFY

delete_task
→ DELETE

Vault credential access
→ SENSITIVE
```

The permission system must exist even if only a subset is used during Phase 7.

---

# 16. CONFIRMATION SYSTEM

Some actions must require user confirmation.

Examples:

```text
create_task
→ no confirmation

create_reminder
→ no confirmation

update_task
→ normally no confirmation

delete_task
→ confirmation

delete_transaction
→ confirmation

delete_project
→ confirmation

vault credential access
→ special protection
```

Create a reusable confirmation mechanism.

Example UI:

```text
OmniLife AI

I’m ready to delete 5 completed tasks.

[Cancel] [Confirm]
```

The AI itself must NOT be able to bypass confirmation.

---

# 17. AI CONTEXT SYSTEM

Create a controlled context layer.

The AI should not automatically receive the entire OmniLife database.

Instead:

```text
AI
 ↓
Context Provider
 ↓
Relevant OmniLife data
```

Example:

User:

```text
"What do I have scheduled tomorrow?"
```

AI should receive relevant calendar information, not:

```text
Vault
Passwords
Entire database
All financial history
All private notes
```

Create an architecture such as:

```text
AIContextProvider
AIContextPolicy
AIContextBuilder
```

The context system must support future privacy restrictions.

---

# 18. SENSITIVE DATA

The following must be treated as highly sensitive:

```text
Passwords
Account credentials
Vault contents
Private security information
```

The AI must NOT receive raw passwords by default.

Do not integrate the Vault into AI actions during Phase 7.

---

# 19. AI SETTINGS

Create the AI settings foundation.

Suggested settings:

```text
AI Assistant
------------------------

Enabled
[ On / Off ]

Provider
[ Groq / Local ]

Model
[ configured model ]

AI Mode
[ Manual / Auto ]

Privacy Mode
[ Standard / Restricted / Local Only ]
```

Not all options need to be fully functional yet.

The architecture must support them.

---

# 20. PRIVACY MODES

Prepare the following conceptual modes:

### Standard

AI may access normal OmniLife context according to tool permissions.

### Restricted

AI receives only explicitly necessary context.

### Local Only

Cloud AI is disabled.

Only Local AI is allowed.

The Local Only mode should fail safely if the local provider is unavailable.

---

# 21. AI ASSISTANT UI

Create the initial OmniLife AI Assistant interface.

It should fit the existing OmniLife design system.

Do NOT make it look like a generic ChatGPT clone.

The UI should feel like a native part of OmniLife.

Recommended structure:

```text
AI Assistant
────────────────────────

Conversation

User:
Buatkan reminder bayar listrik besok jam 8.

OmniLife:
Siap. Reminder sudah dibuat.

────────────────────────
[ Ask OmniLife...              ]
                         [Send]
```

Include:

```text
message history
user messages
assistant messages
loading state
streaming state if supported
error state
tool action state
confirmation UI
empty state
```

---

# 22. AI ACTION VISUALIZATION

When AI performs an action, do not hide it completely.

Show a compact action indicator.

Example:

```text
✓ Reminder created
```

or:

```text
✓ Task created
```

For confirmation-required actions:

```text
⚠ Confirmation required
```

This improves user trust.

---

# 23. STREAMING

If supported cleanly by the selected provider architecture, support streamed assistant responses.

The UI should not freeze while waiting for a response.

Expected:

```text
Thinking...
 ↓
Streaming response
 ↓
Complete
```

However, streaming must not compromise architecture simplicity.

If necessary, implement normal request/response first and keep streaming behind the provider interface.

---

# 24. ERROR HANDLING

Handle at least:

```text
No API key
Invalid API key
No internet
Provider unavailable
Rate limit
Model unavailable
Tool call invalid
Tool execution failed
Invalid arguments
Timeout
Local provider unavailable
Unknown AI error
```

User-facing errors should be understandable.

Do NOT display raw stack traces to users.

Developer logs may contain technical details.

---

# 25. DEVELOPER DIAGNOSTICS

Create a development-only diagnostic mechanism.

It should be possible to determine:

```text
Provider
Model
Request started
Response received
Tool requested
Tool executed
Tool failed
Latency
Error
```

DO NOT log:

```text
API keys
Passwords
Vault contents
Sensitive personal data
```

---

# 26. TOOL CALL FLOW

Implement the architecture for the following flow:

```text
User
 ↓
AI Assistant
 ↓
AIProvider
 ↓
LLM
 ↓
Tool Call
 ↓
ToolRegistry
 ↓
Validation
 ↓
PermissionManager
 ↓
ConfirmationManager
 ↓
ToolExecutor
 ↓
OmniLife Service
 ↓
Database
 ↓
Tool Result
 ↓
AI
 ↓
Final response
```

This flow is the core success criterion of Phase 7.

---

# 27. EXAMPLE TARGET FLOW

The following should be possible after Phase 7:

User says:

```text
Buatkan aku reminder tanggal 20 Agustus
jam 19:00 untuk bayar listrik.
```

AI identifies:

```text
create_reminder
```

with:

```text
title = Bayar listrik
date = 2026-08-20
time = 19:00
```

OmniLife validates it.

The tool executes through the existing reminder/domain architecture.

The assistant responds:

```text
Siap. Aku sudah membuat reminder:

Bayar listrik
20 Agustus 2026 · 19:00
```

The important point:

```text
AI ≠ database access

AI → Tool → OmniLife Service → Database
```

---

# 28. DO NOT IMPLEMENT YET

Do NOT attempt to implement the following fully in Phase 7:

```text
Autonomous agent
Long-term autonomous planning
Automatic life optimization
Complex multi-step planning
Web research agent
Vault AI integration
Financial advisor
Automatic schedule restructuring
External calendar integrations
Voice assistant
Image understanding
Full local model management UI
```

These belong to future phases.

Phase 7 is the **AI foundation**.

---

# 29. LOCAL AI PREPARATION

The architecture must remain compatible with a local inference runtime.

The development machine currently has approximately:

```text
RAM: 16 GB
CPU: Intel i7 Gen 4
GPU: Radeon RX 580
VRAM: 4 GB
```

Do not assume a large GPU model is available.

The Local AI provider should eventually support small quantized models and CPU/GPU fallback where supported.

Do not optimize specifically for the RX 580 yet.

Local model installation and benchmarking will be handled separately after the architecture is stable.

---

# 30. GROQ API MODEL FLEXIBILITY

Do not permanently bind OmniLife to a single Groq model.

The current Groq API exposes model selection and tool calling, so the application should keep the model configurable rather than embedding one model throughout the codebase.

The provider must be able to receive:

```text
provider
model
temperature / generation settings where supported
tool definitions
conversation context
```

---

# 31. ARCHITECTURE REQUIREMENT

Use the existing OmniLife architecture.

Respect:

```text
presentation
domain
data
services
repositories
database
```

Do not introduce an entirely separate architecture only for AI.

AI should integrate into the existing system.

Recommended conceptual structure:

```text
lib/
  core/
    ai/
      models/
      providers/
      tools/
      permissions/
      context/
      services/

  features/
    ai_assistant/
      presentation/
      application/
```

Adapt folder locations to the actual existing OmniLife project structure.

Do not blindly create duplicate architecture if equivalent structures already exist.

---

# 32. DEPENDENCY RULE

Before adding a package:

1. Check whether an existing dependency can perform the job.
2. Prefer lightweight, actively maintained packages.
3. Avoid unnecessary SDK lock-in.
4. Keep provider-specific code isolated.
5. Do not add multiple packages for the same purpose.

---

# 33. TESTING

Create tests for:

### Provider

```text
provider initialization
missing API key
invalid configuration
provider unavailable
```

### Tool Registry

```text
tool registration
tool lookup
unknown tool
duplicate tool
```

### Tool Executor

```text
valid execution
invalid arguments
permission denied
confirmation required
execution failure
```

### AI Context

```text
allowed context
restricted context
sensitive data exclusion
```

### AI Service

```text
normal response
tool call response
tool execution cycle
provider failure
```

Use mocks/fakes where necessary.

Tests must NOT depend on a real API key.

---

# 34. DOCUMENTATION

Create or update:

```text
docs/AI_ARCHITECTURE.md
```

Document:

```text
AI architecture
provider abstraction
Groq integration
local provider abstraction
tool system
permission system
confirmation system
context system
security considerations
future extension points
```

Also create:

```text
docs/AI_TOOLS.md
```

Document every currently registered tool.

For each tool document:

```text
Name
Purpose
Parameters
Permission
Confirmation requirement
Domain service used
Security considerations
```

---

# 35. ACCEPTANCE CRITERIA

Phase 7 is considered complete only when:

```text
[ ] AI provider abstraction exists
[ ] Groq provider exists
[ ] API key is not hard-coded
[ ] .env / configuration is protected
[ ] Local AI provider abstraction exists
[ ] Tool Registry exists
[ ] Tool definitions exist
[ ] Tool Executor exists
[ ] Permission system exists
[ ] Confirmation mechanism exists
[ ] AI Context system exists
[ ] Sensitive data is excluded by default
[ ] AI Assistant UI exists
[ ] Provider errors are handled
[ ] Developer diagnostics exist
[ ] Unit tests exist
[ ] AI architecture documentation exists
[ ] AI tools documentation exists
[ ] At least one read tool works
[ ] At least one write tool works
[ ] Tool execution flows through OmniLife services
[ ] AI cannot directly access the database
```

---

# 36. CRITICAL ARCHITECTURAL RULES

Never violate these:

```text
RULE 1
AI must not directly access the database.

RULE 2
AI must not execute arbitrary code.

RULE 3
AI must not generate or execute SQL.

RULE 4
AI must only use registered tools.

RULE 5
Sensitive actions must be protected by permissions.

RULE 6
Destructive actions require confirmation.

RULE 7
Passwords and Vault contents must not enter AI context by default.

RULE 8
Provider-specific code must remain isolated.

RULE 9
Groq must not become a hard dependency of the entire application.

RULE 10
The architecture must remain compatible with local AI.

RULE 11
Do not expose API keys in source control.

RULE 12
Do not break previously completed OmniLife phases.
```

---

# 37. IMPLEMENTATION WORKFLOW

Before modifying code:

```text
1. Inspect current OmniLife project structure.
2. Inspect existing architecture.
3. Inspect existing services/repositories.
4. Inspect Phase 1–6 implementations.
5. Identify existing patterns that AI should reuse.
6. Produce a short implementation plan.
7. Implement incrementally.
8. Run analyzer.
9. Run tests.
10. Fix errors.
11. Verify existing features still work.
12. Update documentation.
```

Do not blindly overwrite existing files.

---

# 38. FINAL VERIFICATION

At the end of implementation, provide a report containing:

```text
Phase 7 Status

Implemented:
- ...

Modified:
- ...

Created:
- ...

Dependencies:
- ...

AI Provider:
- Groq: ...
- Local: ...

Tools:
- ...

Tests:
- ...

Known limitations:
- ...

Future Phase Recommendations:
- ...
```

Also explicitly state whether the following flow was verified:

```text
User
 ↓
Groq
 ↓
Tool Call
 ↓
Tool Registry
 ↓
Permission
 ↓
OmniLife Service
 ↓
Database
 ↓
AI Response
```

If any part cannot be verified, clearly state why.

---

# FINAL OBJECTIVE

Do not think of Phase 7 as:

> "Add a ChatGPT page to OmniLife."

Think of it as:

> **"Build the controlled AI operating layer that will eventually allow OmniLife AI to understand the user's life data, reason over it, and safely operate OmniLife through explicit tools."**

The AI Assistant UI is only the visible surface.

The real deliverable is the architecture underneath it.
# OmniLife — AI Architecture Documentation

**Project:** OmniLife  
**Module:** AI Foundation & Controlled Tool System (Phase 7)  
**Date:** August 11, 2026  

---

## 1. Executive Summary

OmniLife AI is built as a controlled operating layer rather than an unrestricted chatbot. The AI interacts with OmniLife solely through explicitly registered tools with permission boundaries (`READ`, `WRITE`, `MODIFY`, `DELETE`, `SENSITIVE`) and user confirmation requirements for high-risk operations.

---

## 2. Controlled Tool Execution Pipeline

```text
User Input / Prompt
       │
       ▼
OmniLife AI Assistant UI
       │
       ▼
AIProvider Abstraction (Groq / Local)
       │
       ▼
LLM Function / Tool Call Request
       │
       ▼
ToolRegistry Lookup
       │
       ▼
Permission & Confirmation Check
 ├── READ / WRITE -> Direct Execution
 └── DELETE / SENSITIVE -> User Confirmation Dialog
       │
       ▼
ToolExecutor Mapping
       │
       ▼
Existing OmniLife Domain Services (taskService, calendarService, etc.)
       │
       ▼
SQLite Database
```

---

## 3. Strict Architectural Security Rules

1. **Rule 1 (No Direct Database Access)**: AI NEVER interacts directly with SQLite database drivers or raw SQL queries.
2. **Rule 2 (No Arbitrary Code Execution)**: AI cannot execute arbitrary system shell commands or code scripts.
3. **Rule 3 (Explicit Tool Registration Only)**: AI can ONLY execute tools registered in `ToolRegistry`.
4. **Rule 4 (Vault Privacy Isolation)**: Passwords, account credentials, and Vault payloads are STRICTLY EXCLUDED from system prompts and tool contexts.
5. **Rule 5 (User Confirmation for Destructive Actions)**: Actions marked with `requiresConfirmation: true` (e.g. `delete_task`) MUST receive explicit user approval before execution.

---

## 4. Hybrid AI Provider Architecture

OmniLife supports two provider categories via the `AIProvider` contract:
- **Groq Cloud AI (`GroqProvider`)**: High-performance OpenAI-compatible API supporting Llama 3.3 70B Versatile, Llama 3.1 8B, and Mixtral. API keys are stored in local configuration state and NEVER hard-coded in source files.
- **Local AI (`LocalAIProvider`)**: Local inference server abstraction (e.g., Ollama at `http://localhost:11434`).

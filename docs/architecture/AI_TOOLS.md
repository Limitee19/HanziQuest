# OmniLife — AI Tools Catalog

**Project:** OmniLife  
**Module:** Registered AI Tools Catalog (Phases 7–12)  
**Date:** August 12, 2026  

---

The following tools are registered in `ToolRegistry` for OmniLife AI Assistant:

| Tool Name | Description | Permission Level | Requires Confirmation | Mapped Domain Service |
| :--- | :--- | :--- | :--- | :--- |
| `get_today_schedule` | Fetch today's calendar events, pending tasks, and habits | `READ` | `false` | `calendarService`, `taskService`, `routineService` |
| `get_today_tasks` | Fetch pending tasks due/scheduled today | `READ` | `false` | `taskService` |
| `get_calendar_range` | Fetch calendar entries, tasks, routines, and deadlines for a date range | `READ` | `false` | `calendarService` |
| `create_calendar_event` | Create a timed calendar event entry in OmniLife | `WRITE` | `false` | `calendarService.createCalendarEntry` |
| `update_calendar_event` | Update properties of an existing calendar event | `MODIFY` | `false` | `calendarService.updateCalendarEntry` |
| `delete_calendar_event` | Delete a calendar event from OmniLife | `DELETE` | `true` | `calendarService.deleteCalendarEntry` |
| `get_academic_deadlines` | Fetch upcoming academic assignments and exam schedules | `READ` | `false` | `academicService` |
| `get_financial_summary` | Fetch current total net balance and monthly cash flow | `READ` | `false` | `financeService` |
| `search_omnilife` | Search across all OmniLife modules simultaneously | `READ` | `false` | `GlobalSearchService` |
| `propose_plan` | Propose a structured daily or study plan for user approval | `WRITE` | `false` | `PlanValidator` & `PlanExecutor` |
| `create_task` | Create a new task in OmniLife | `WRITE` | `false` | `taskService.createTask` |
| `create_reminder` | Create a one-time reminder trigger | `WRITE` | `false` | `reminderService.createReminder` |
| `create_note` | Capture a new note or journal entry | `WRITE` | `false` | `noteService.createNote` |
| `delete_task` | Delete a task from OmniLife by ID | `DELETE` | `true` | `taskService.deleteTaskById` |

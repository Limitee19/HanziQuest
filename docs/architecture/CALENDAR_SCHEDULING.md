# OmniLife — Calendar & Scheduling 2.0 Architecture

**Project:** OmniLife  
**Module:** Calendar & Scheduling 2.0 (Phase 12)  
**Date:** August 12, 2026  

---

## 1. Overview

Phase 12 elevates OmniLife's calendar into a central personal scheduling workspace. It provides:
1. **Multi-View Modes**: `Month View`, `Week View`, `Day View`, and `Agenda View`.
2. **Infinite Date Range & Instant Navigation**: Navigate across years with zero range limits + instant `[Today]` jump button + explicit HTML5 Date Picker selector.
3. **Unified Cross-Module Scheduling Layers**: Aggregates Calendar Entries, Tasks, Daily Routine Occurrences, Academic Assignments & Exam Deadlines, Active Reminders, and Finance Transactions onto one unified interface.
4. **AI Calendar Tool System**: Integrates `get_calendar_range`, `create_calendar_event`, `update_calendar_event`, and `delete_calendar_event` into `ToolRegistry`.

---

## 2. Multi-View System Specifications

```text
                     Calendar Header
  [Prev] [Today] [Next] [Date Picker] | [MONTH] [WEEK] [DAY] [AGENDA]
                            │
  ┌─────────────────────────┼─────────────────────────┐
  ▼                         ▼                         ▼
Month View               Week View                 Day View / Agenda
- Grid Overview          - 7-Day Columns           - 24-Hour Timeline Grid
- Colored Indicators     - Hourly Timeblocks       - Chronological Agenda
```

### View Descriptions:
- **Month View**: 7-column monthly grid displaying event snippets, milestone stars, and category dots for events, notes, and finance.
- **Week View**: 7-day column overview showing scheduled events and start times for the selected week.
- **Day View**: 24-hour timeline grid (07:00 to 22:00) placing scheduled events in their corresponding hourly time slots.
- **Agenda View**: Chronological list of upcoming events grouped by date.

---

## 3. Cross-Module Scheduling Aggregation

The right detail panel for any selected date consolidates:
- **Tasks & Checklist Items**: Interactive task completion & direct checklist toggles.
- **Academic Deadlines & Exams**: Direct feed from `academicService.ts` (`fetchAssignments`, `fetchExams`).
- **Active Reminders**: Direct feed from `reminderService.ts` (`fetchAllReminders`).
- **Daily Notes & Journal**: Embedded Daily Note editor with markdown preview.
- **Financial Transactions**: Cash flow summary for income/expense items on that date.

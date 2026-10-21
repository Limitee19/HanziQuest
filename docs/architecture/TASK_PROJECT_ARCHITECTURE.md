# OmniLife — Tasks, To-Do & Projects 2.0 Architecture

**Project:** OmniLife  
**Module:** Tasks & Projects 2.0 (Phase 13)  
**Date:** August 12, 2026  

---

## 1. Overview

Phase 13 establishes a flexible, local-first task and project management architecture for OmniLife. It maintains a clean conceptual separation:

```text
  GOAL (Outcome) ──► PROJECT (Collection of Tasks) ──► TASK (Actionable Unit) ──► SCHEDULE & REMINDER
```

---

## 2. Data Models & Entities

### Task Entity (`TaskItem`)
- **Properties**: `id`, `title`, `description`, `status` (`pending`, `completed`, `cancelled`, `archived`), `priority` (`low`, `medium`, `high`), `taskType` (`one_time`, `scheduled`, `deadline`, `inbox`), `dueDate`, `scheduledDate`, `projectId`, `goalId`, `courseId`, `checklist` (`TaskChecklistItem[]`), `completedAt`, `createdAt`, `updatedAt`.

### Project Entity (`ProjectItem`)
- **Properties**: `id`, `title`, `description`, `status` (`Planning`, `Active`, `Paused`, `Completed`, `Archived`), `priority` (`low`, `medium`, `high`), `startDate`, `targetDate`, `goalId`, `createdAt`, `updatedAt`.
- **Derived Metrics (`ProjectWithProgress`)**: `totalTasks`, `completedTasks`, `progressPercentage` calculated dynamically as `(completedTasks / totalTasks) * 100`.

---

## 3. Service Layer API Contracts (`taskService.ts` & `projectService.ts`)

- **`createTask(task)`**: Insert new task into SQLite repository with automatic type resolution.
- **`toggleTaskCompletion(id, currentStatus)`**: Toggle task completion status and record `completedAt` timestamp.
- **`uncompleteTask(id)`**: Restore completed task to pending status.
- **`getTasksForToday()`**: Query tasks scheduled or due on current date.
- **`getUpcomingTasks()`**: Query tasks due in the future.
- **`getOverdueTasks()`**: Query active tasks with past due dates.
- **`getNoDateTasks()`**: Query inbox/unscheduled tasks without dates.
- **`getTasksForProject(projectId)`**: Query tasks belonging to a specific project.
- **`archiveProject(id)`**: Update project status to `'Archived'`.

---

## 4. Cross-Module Integrations

- **Phase 12 Calendar**: Tasks with `scheduledDate` or `dueDate` appear automatically on Calendar views.
- **Phase 11 Global Search**: `TaskSearchProvider` and `ProjectSearchProvider` index tasks and projects for `Ctrl + K` Command Palette searches.
- **Goals & Academic**: Tasks link directly to `goalId` or `courseId`.

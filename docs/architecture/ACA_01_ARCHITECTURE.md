# OmniLife — ACA-01 Architecture Specification

**Project:** OmniLife  
**Module:** Academic + Study Integration (ACA-01)  
**Date:** August 14, 2026  

---

## 1. Executive Overview

Phase **ACA-01** unifies the **Academic & Study** management systems inside OmniLife. It establishes the canonical hierarchy: `Semester` -> `KRS` -> `Course` -> `Course Class` -> `Schedule`, with Dosen PA Approval workflows (`waiting_pa` | `approved` | `revision_required`), Schedule Conflict Detection, KHS / IPS calculation, and seamless integration with Calendar, Tasks, Exams, and Chinese Learning.

---

## 2. Architectural Data Hierarchy

```text
                               ACADEMIC SYSTEM HIERARCHY
                                          │
  ┌───────────────────┬───────────────────┴───────────────────┬───────────────────┐
  ▼                   ▼                                       ▼                   ▼
College Profile     Semester (Canonical                     KRS & Dosen PA      Course Class &
(Advisor Name &     Active Semester Context)                Approval Lifecycle  Schedule Rules
NIP, Major, Campus)                                         (waiting_pa,        (Conflict Detection)
                                                             approved, revision)
```

---

## 3. Key Services & Components

1. **`academicService.ts`**:
   - `CollegeProfile` (Advisor Name, NIP, Major, Campus).
   - `KrsItem` & `KrsHistoryEntry` lifecycle query helpers.
   - `detectScheduleConflicts(courses, schedulesMap)`: Time-slot overlap detection.
   - `calculateSemesterIps(courses, grades)`: Automated IPS calculation from course credits and grade weights.
2. **`KrsTableView.tsx`**:
   - SIAKAD-inspired KRS Table: `#`, `Kode`, `Mata Kuliah`, `SKS`, `Kelas`, `Status PA`, `Actions`.
   - Total SKS auto-sum and Dosen PA Approval simulation controls.
3. **`KhsTableView.tsx`**:
   - KHS grade report table displaying course grades, letter grades, points, and IPS score.

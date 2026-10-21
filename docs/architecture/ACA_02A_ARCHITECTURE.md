# OmniLife — ACA-02A Architecture Specification

**Project:** OmniLife  
**Module:** Academic Data & UM Schedule Foundation (ACA-02A)  
**Date:** August 14, 2026  

---

## 1. Executive Overview

Phase **ACA-02A** establishes a normalized Academic Foundation for OmniLife representing university schedule structures (UM Periods 1–14, Regular & Ramadan profiles, Rooms, Lecturers, and Class Meetings).

---

## 2. Architectural Data Hierarchy

```text
                           ACA-02A NORMALIZED DATA MODEL
                                         │
  ┌───────────────────┬──────────────────┴──────────────────┬───────────────────┐
  ▼                   ▼                                     ▼                   ▼
Period Profiles &    Canonical Rooms        Canonical Lecturers    Structured Class
Periods 1–14 (UM    (Building, Room Code,  (NIP/NIDN, Department,  Meetings (Day, Period
Reguler & Ramadhan)  Floor, Capacity)       Advisor Role)          Range, Room Linkage)
```

---

## 3. Key Services & Components

1. **`umAcademicModel.ts`**:
   - `AcademicPeriodProfile` & `AcademicPeriod` (pre-seeded with verified UM Regular & Ramadan times for Periods 1–14).
   - `Room` entity & `Lecturer` entity.
   - `ClassMeeting` entity (`dayOfWeek`, `periodProfileId`, `startPeriodNumber`, `endPeriodNumber`, `roomId`).
2. **`umScheduleService.ts`**:
   - `getPeriodRange(profileId, startPeriod, endPeriod)`: Calculates exact start and end times for period ranges.
   - `validatePeriodRange(startPeriod, endPeriod)`: Ensures valid 1–14 period bounds.
   - `detectScheduleOverlap(meetingA, meetingB)`: Centralized overlap detector for class meetings.
3. **`UmMasterDataView.tsx`**:
   - Master data workspace displaying tabs for **Jam Kuliah UM (1–14)**, **Ruang Perkuliahan**, **Dosen & Dosen PA**, and **Pertemuan Kelas**.

# OmniLife Academic OS — Implementation Plan

## Ringkasan

Implementasi **Academic OS** sesuai `OmniLife_Academic_OS_AI_Agent_Prompt.md` yang menjadikan OmniLife sebagai **Personal Academic Control Center** di atas SIAKAD dan SIPEJAR.

Berdasarkan audit arsitektur yang sudah ada, sebagian besar **Phase A (Foundation)** sudah tersedia. Fokus implementasi adalah memperluas ke fitur yang *belum ada* dan meningkatkan yang sudah ada.

---

## Status Fitur yang SUDAH ADA

| Fitur | Status | File |
|---|---|---|
| Semester Management | ✅ Ada | `AcademicPage.tsx`, `AddSemesterModal.tsx` |
| Course Entity (SIAKAD) | ✅ Ada | `AddCourseModal.tsx`, `academicService.ts` |
| Course Schedule Rules | ✅ Ada | `KrsWeeklyScheduleView.tsx` |
| KRS (Rencana Studi) | ✅ Ada | `KrsTableView.tsx`, `krsService.ts` |
| Assignments | ✅ Ada | `AddAssignmentModal.tsx` |
| Exams | ✅ Ada | `AddExamModal.tsx` |
| Academic Dashboard | ✅ Ada | `AcademicDashboardView.tsx` |
| KHS / Grades | ✅ Ada | `academicRecordsService.ts` |
| College Profile | ✅ Ada | `AcademicPage.tsx` (profil form) |
| Curriculum / Records | ✅ Ada | `AcademicRecordsHubView.tsx` |
| Cloud Sync | ✅ Ada | `CloudSyncSettingsView.tsx` |

---

## Fitur yang BELUM ADA (Perlu Diimplementasikan)

### Phase A – Foundation Gap

| # | Fitur | Prioritas |
|---|---|---|
| A1 | **SIPEJAR Data Model** — Meetings, Materials, Activities | P0 |
| A2 | **SIPEJAR Course View** — Tampilan per-pertemuan SIPEJAR | P0 |
| A3 | **Academic Profile Extended** — Target IPK, target lulus, karier | P1 |
| A4 | **Mandarin Progress Tracker** — 8 skills, HSK level | P1 |

### Phase B – Course Integration

| # | Fitur | Prioritas |
|---|---|---|
| B1 | **SIAKAD ↔ SIPEJAR Course Linking** — Status link, matching | P0 |
| B2 | **SIPEJAR Assignment → OmniLife Task** — Import dari SIPEJAR ke Tasks | P0 |
| B3 | **Course Intelligence View** — Unified course dashboard | P1 |

### Phase C – Planning & Intelligence

| # | Fitur | Prioritas |
|---|---|---|
| C1 | **Graduation Planner** — 7-semester simulation, conditional status | P2 |
| C2 | **Academic Risk Engine** — Per-course risk indicators | P2 |

---

## Proposed Changes

---

### A1+A2: SIPEJAR Data Model & View

#### [NEW] `src/services/academic/sipejarModel.ts`
Tipe data: `SipejarCourse`, `SipejarMeeting`, `SipejarMaterial`, `SipejarActivity`
Fields: title, type, description, deadline, completionStatus, sourceUrl, linkedCourseId, etc.

#### [NEW] `src/services/academic/sipejarService.ts`
CRUD functions: `fetchSipejarCourses`, `saveSipejarMeeting`, `markActivityComplete`, `importSipejarAssignmentAsTask`

#### [NEW] `src/features/academic/sipejar/SipejarCoursesView.tsx`
UI: List mata kuliah SIPEJAR, per-meeting accordion, material list, activity list, status completion

#### [MODIFY] `src/features/academic/AcademicPage.tsx`
Tambah tab baru `'sipejar'` untuk `SipejarCoursesView`

---

### A3: Extended Academic Profile

#### [MODIFY] `src/features/academic/AcademicPage.tsx` (tab `profile`)
Tambah fields:
- Target IPK (`targetGPA`)
- Semester Target Lulus (`targetGraduationSemester`) 
- Mandarin Level (`mandarinLevel`)
- Career Interests (`careerInterests[]`)
- Academic Strengths / Concerns

#### [MODIFY] `src/services/academicService.ts`
Update `CollegeProfile` type + `saveCollegeProfile` untuk field baru

---

### A4: Mandarin Progress Tracker

#### [NEW] `src/features/academic/mandarin/MandarinProgressView.tsx`
UI: 8 skill bars (Listening, Speaking, Reading, Writing, Hanzi, Vocabulary, Grammar, Pronunciation)
HSK level tracker (self-assessment), progress history chart

---

### B1: SIAKAD ↔ SIPEJAR Course Linking

#### [NEW] `src/features/academic/sipejar/CourseLinkerView.tsx`
UI: Side-by-side SIAKAD courses + SIPEJAR courses
Matching states: `linked_auto` | `linked_manual` | `suggested` | `unlinked` | `conflict`
Actions: Confirm, Reject, Review

#### [MODIFY] `src/services/academic/academicLinkService.ts`
Tambah linking logic + matching algorithm

---

### B2: SIPEJAR Assignment → Task Import

#### [MODIFY] `src/features/academic/sipejar/SipejarCoursesView.tsx`
Tombol "Import as Task" per activity/assignment
Konfirmasi: deadline official vs personal planning deadline

#### [MODIFY] `src/services/academic/sipejarService.ts`
Fungsi `importSipejarAssignmentAsTask` — buat task di `tasks` table dengan source = 'SIPEJAR'

---

### B3: Course Intelligence View

#### [MODIFY] `src/features/academic/course/CourseDetailView.tsx`
Expand dari placeholder 817 byte menjadi full dashboard:
- Section Academic (credits, lecturer, schedule, grade)
- Section Learning (meetings, materials, progress)
- Section Personal (confidence, notes, study time)
- Section SIPEJAR link status

---

### C1: Graduation Planner

#### [NEW] `src/features/academic/records/GraduationPlannerView.tsx`
- Total SKS 146 (configurable)
- Target 7 semester (configurable)
- Status: 🟢 On Track / 🟡 Conditional / 🔴 At Risk / ⚪ Unknown
- Alasan eksplisit per status

---

## Open Questions

> [!IMPORTANT]
> **Urutan Implementasi:** Apakah kamu mau saya mulai dari yang paling impactful dulu (SIPEJAR View + Course Intelligence) atau urut sesuai Phase A → B → C?

> [!NOTE]
> **Data SIPEJAR:** Karena belum ada API otomatis ke SIPEJAR, data akan diinput manual oleh user (copy-paste dari SIPEJAR). Apakah kamu setuju dengan pendekatan ini untuk sekarang?

> [!NOTE]
> **Graduation Target:** Berapa total SKS kelulusan program S1 Pendidikan Bahasa Mandarin UM? (Default 146 SKS sesuai prompt, bisa dikonfigurasi)

---

## Verification Plan

### TypeScript
- `npx tsc --noEmit` — 0 errors

### Manual
- Tab SIPEJAR muncul di AcademicPage
- Bisa menambah meeting + material per mata kuliah
- Import assignment SIPEJAR → Task berhasil membuat task baru
- Mandarin Progress bar tampil dan bisa diupdate
- Graduation Planner menampilkan status Conditional (bukan guaranteed)

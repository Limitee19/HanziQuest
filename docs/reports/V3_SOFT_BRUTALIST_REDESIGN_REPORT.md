# Laporan Implementasi — Design System V3 "Soft Brutalist Desk"

> **Tanggal:** 2026-09-11 · **Scope:** Redesign UI/UX menyeluruh, warna & fungsi 100% dipertahankan.
> **Spec:** `docs/specs/DESIGN_SYSTEM_V3.md` (pewaris penuh DESIGN_SYSTEM_V2).
> **Verifikasi:** `tsc --noEmit` → 0 error · `vite build` → sukses · verifikasi visual live (dark + light).

---

## 1. Keputusan desain (disetujui user)

| Aspek | Keputusan |
|---|---|
| Gaya | **Neo-Brutalism Lembut** — border tegas 1.5px, offset hard-shadow hanya saat interaksi, radius satu notch lebih kecil dari V2 |
| Tipografi | **Bricolage Grotesque** (display/heading, 700–800) × **Plus Jakarta Sans** (body/UI) — identitas utama V3 |
| Warna | Tetap identik V2: graphite zinc remap + indigo neon `#7048F8` |
| Eksekusi | Bertahap (P1–P4) dengan gate `tsc` + `vite build` tiap fase |

## 2. Fondasi

- **Font** — `@fontsource-variable/bricolage-grotesque` + `@fontsource-variable/plus-jakarta-sans` diinstal dan diimpor di `src/main.tsx`.
- **Spec** — `docs/specs/DESIGN_SYSTEM_V3.md` (konsep, tipografi, border/shadow, aturan per komponen).

## 3. P1 — Token & font global (`src/index.css`)

- `--font-sans` → Plus Jakarta Sans Variable (Inter = fallback micro), `--font-display` → Bricolage Grotesque Variable dengan `letter-spacing: -0.02em`.
- Token baru: `--shadow-brut` / `--shadow-brut-sm` (light: indigo solid `#5C38D9`; dark: indigo 55% + edge gelap), class `.brut-texture` (tekstur dots indigo halus di canvas halaman, varian dark otomatis).
- Radius scale diturunkan satu notch (`2xl` = 0.75rem). Semua warna V2 tidak disentuh.

## 4. P2 — Komponen bersama

| Komponen | Perubahan V3 |
|---|---|
| `Button.tsx` | Border `1.5px`, `hover:shadow-brut` + shift -1px, `active` reset + `scale-[0.98]` |
| `Card.tsx` | Border 1.5px `edge-strong`, radius turun 1 notch, hover offset shadow halus |
| `Badge.tsx` | Border tegas + radius kecil |
| `Modal.tsx` | Panel 1.5px, radius `2xl` baru (0.75rem) |
| `Toast.tsx`, `EmptyState.tsx`, `ChartCard.tsx` | Konsisten border/shadow V3 |

## 5. P3 — Chrome aplikasi

- `Sidebar.tsx` — item nav aktif: blok solid indigo + offset shadow; header brand pakai `font-display`.
- `Header.tsx` — judul halaman Bricolage, tombol ikon border tegas.
- `HubPage.tsx` — tab pill: aktif = solid indigo + shadow offset; non-aktif = outline 1.5px.
- `MobileBottomNav.tsx` — item aktif indigo solid, radius dikurangi.
- `MainLayout.tsx` — canvas halaman memakai `brut-texture` ("meja kerja").

## 6. P4 — Sweep halaman kunci

Judul/angka statement dimigrasi ke `font-display` (Bricolage): DashboardPage, AnalyticsPage, FinancePage, StudyHubPage, AcademicPage, AcademicDashboardView, CourseWorkspaceView, TasksPage, CalendarPage, AiAssistantPage, SipejarOSView, DataSafetyView, VocabularyDetailModal, AnkiImportModal, DeckLibraryView, LearnedVocabularyView, EditSyllabusModal — via script bulk + koreksi manual. Body/label tetap Jakarta.

## 7. Verifikasi

- `npx tsc --noEmit` → **0 error** (setelah tiap fase dan final).
- `npx vite build` → **sukses** (hanya warning ukuran chunk >500kB yang sudah ada sebelumnya).
- Live preview (vite dev :5199):
  - Dark: `h1` = Bricolage, body = Jakarta, tekstur dots indigo aktif di `<main>`.
  - Light: tekstur berganti ke versi terang, kartu putih border tegas.
  - `hover:shadow-brut` ter-generate benar oleh Tailwind dari token `@theme` (terverifikasi via computed style).
  - Catatan: border tampak 1px di preview DPR-1 karena pembulatan renderer; di layar asli (Windows 125–150%) tampil 1.5–2px sesuai desain.

## 8. Yang tidak berubah (sesuai non-goals spec)

Warna, spacing 4px, motion timing, layout, logika data, database/sync, i18n, semua fitur.

## 9. Catatan lanjutan (opsional)

- Bundle warning: pertimbangkan code-split untuk `recharts` (sudah tercatat di laporan sebelumnya).
- Halaman sekunder di luar sweep P4 otomatis mewarisi V3 lewat komponen bersama; sweep `font-display` bisa diperluas ke sana kapan pun tanpa risiko.

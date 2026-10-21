# Laporan Implementasi — Design System V4 "Editorial Desk"

> **Tanggal:** 2026-09-11 · **Pemicu:** feedback user — tampilan masih terasa generik/"AI slop" meski V3 sudah menerapkan font & efek.
> **Jawaban:** bukan mengubah efek, tetapi mengubah **komposisi dan bahasa visual** aplikasi. Warna tetap identik (graphite zinc + indigo `#7048F8`); font identitas tetap Bricolage × Jakarta.
> **Verifikasi:** `tsc --noEmit` 0 error · `vite build` sukses · audit DOM live (dark + light, dashboard + finance).

---

## 1. Diagnosis "AI slop" (kenapa V3 terasa generik)

Audit DashboardPage lama menemukan pola template AI-dashboard yang khas:

| Pola generik | Ditemukan |
|---|---|
| Banner welcome dengan garis gradient tipis | 1 |
| 4 kartu metrik seragam + icon chip pastel `bg-*-500/10` | 4 |
| 3 kolom konten identik | 3 |
| Radius "blob" `rounded-2xl/3xl` | 20+ |
| Soft shadow blur di mana-mana | banyak |
| Backdrop-blur kaca pada panel | sidebar, header, nav |

Semua aplikasi hasil AI memakai kombinasi yang sama — itulah yang membuatnya terasa "tanpa wajah".

## 2. Konsep V4 — "Editorial Desk" (meja kerja editorial)

Aplikasi diperlakukan sebagai **kertas kerja di atas meja**, bukan kumpulan kartu melayang:

1. **Hirarki dari tipografi + garis, bukan bayangan.** Masthead dashboard = koran: label edisi mono uppercase, judul raksasa `Good afternoon.` (Bricolage 48px, titik indigo), garis bawah tebal 2px hitam.
2. **Satu blok tinta berani.** Blok "Focus / 01" indigo solid — satu-satunya permukaan berwarna penuh, jadi titik fokus visual halaman.
3. **Ledger, bukan kartu metrik.** Empat metrik keuangan jadi satu tabel bergaris dengan header mono uppercase — angka `font-mono tabular-nums`.
4. **Panel berlabel arsip.** Panel agenda memakai kotak huruf indeks (A/B/C) + counter mono `00`, action-link uppercase mono — bahasa "lembar arsip".
5. **Datar total.** 0 soft shadow, 0 blur, 0 pastel chip, radius satu tingkat (`xl` = `2xl` = `3xl` = 0.625rem via token).

## 3. Perubahan per file

### Fondasi
- `src/index.css` — token radius `2xl`/`3xl` disatukan ke 0.625rem; token V3 (`shadow-brut`, `brut-texture`) tidak lagi dipakai komponen.
- `src/components/ui/Card.tsx` — **flat**: tanpa shadow, border 1px, permukaan solid; ditambah primitif `CardEyebrow` (stempel mono) & `CardRule` (garis pemisah). Default `p-5` dihapus (kontrol penuh di pemanggil).
- `src/components/ui/Button.tsx` — flatten: solid/outline/ghost tanpa offset shadow brutalist; feedback via warna + `active:scale-[0.98]`.
- `Badge.tsx`, `Modal.tsx`, `ChartCard.tsx`, `EmptyState.tsx`, `Toast.tsx` — border tebal 1.5px → 1px; Toast kembali pakai `shadow-lg` fungsional (floating).

### Chrome
- `Sidebar.tsx` — **rewrite**: panel solid (bukan kaca blur), item aktif = chip "kertas" putih dengan tab marker 3px indigo menancap di tepi, label grup bergaris mono uppercase (gaya indeks arsip), footer jadi baris ledger mono.
- `Header.tsx` — **rewrite**: masthead editorial — stamp indeks `01 / HUB UTAMA` (mono), divider vertikal, judul Bricolage, tinggi 56px, tanpa shadow/blur.
- `HubPage.tsx` — tab aktif solid indigo, tombol scroll dibuat kotak datar.
- `MobileBottomNav.tsx` — permukaan solid, tanpa shadow ambience.

### Wajah baru aplikasi
- `src/features/dashboard/DashboardPage.tsx` — **rewrite total** (logika & data 100% sama):
  - **Masthead** "Edisi {tanggal}" + sapaan raksasa sesuai jam (Good morning/afternoon/evening) + garis bawah tebal.
  - **Focus / 01** — blok indigo solid: angka beban raksasa (Bricolage 60px), workload, overdue, prioritas utama, CTA Generate Plan / Ask AI.
  - **Ledger 02** — tabel metrik bergaris (Net Balance, Income, Expense, Vault) sebagai satu permukaan.
  - **Agenda 03** — grid asimetris 3:2 — Panel A Tugas (dominan), Panel B Agenda, Panel C Rutinitas, semua list `divide-y` dengan PriorityStamp mono.
  - **Sorotan 04** — insights sebagai satu blok amber bergaris (bukan kartu-kartu terpisah).

## 4. Verifikasi (live DOM audit via preview)

Dashboard (dark & light): `blobRadius 0 · pastelChips 0 · softShadows 0 · borderThick 0 · blur 0`, 5/5 heading Bricolage, canvas solid `rgb(13,15,20)` dark / `rgb(237,238,242)` light, blok fokus `rgb(92,56,217)` (indigo), token `rounded-2xl` terukur 10px di seluruh app (termasuk halaman lama seperti Finance).

`npx tsc --noEmit` → 0 error · `npx vite build` → sukses (20s).

## 5. Fungsi

Tidak ada logika, data, event handler, service call, atau navigasi yang berubah — semua state, toggle, dismiss, dan listener `omnilife_db_updated` dipertahankan identik.

## 6. Langkah lanjut yang disarankan

- Sweep halaman sekunder (Academic, Tasks, Calendar, Chinese) ke pola Panel/Ledger V4 — fondasi (Card flat, token radius, PriorityStamp) sudah siap dipakai.
- Ekstrak `SectionHead`/`PanelHead`/`PriorityStamp` dari DashboardPage ke `src/components/ui/` menjadi primitif bersama agar halaman berikutnya konsisten.

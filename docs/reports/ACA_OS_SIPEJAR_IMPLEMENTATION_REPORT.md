# ACA-OS Implementation Report — SIPEJAR Integration, Mandarin Progress & Graduation Planner

## Ringkasan
Implementasi ide dari `OmniLife_Academic_OS_AI_Agent_Prompt.md` (bagian Academic OS) sesuai `implementation_plan.md`, plus mitigasi egress Supabase.

## Fitur Baru (Tab "SIPEJAR & Progres" di Academic Page)
1. **SIPEJAR Courses** — mata kuliah SIPEJAR manual-only (tidak ada scraping/otomatis), tracking pertemuan (checkbox) & aktivitas (tugas/kuis/materi/ujian/dll) dengan tenggat resmi vs tenggat pribadi. Tugas SIPEJAR bisa diimpor ke modul Tasks (`importSipejarAssignmentAsTask`).
2. **Tautan SIAKAD ↔ SIPEJAR** — saran kecocokan berbasis kode/nama mata kuliah (keyakinan tinggi/sedang), tautan manual selalu butuh konfirmasi user, bisa lepas tautan.
3. **Progres Mandarin** — penilaian diri 8 skill (menyimak, berbicara, membaca, menulis, hanzi, kosakata, tata bahasa, pinyin) 0–100%, level HSK self-assessed vs resmi, tanggal ujian resmi, total jam belajar.
4. **Rencana Lulus (Graduation Planner)** — simulasi SKS lulus (dari Course Attempts "completed") vs target semester; status on_track / conditional / at_risk + peringatan. Disclaimer: bukan jaminan kelulusan.

## File
- `src/services/academic/sipejarModel.ts` — tipe data
- `src/services/academic/sipejarService.ts` — logika (CRUD, matching, planner)
- `src/features/academic/sipejar/SipejarOSView.tsx` — hub 4 tab (responsive via `useResponsive`)
- `src/db/init.ts` — 4 tabel baru: `sipejar_courses`, `sipejar_meetings`, `sipejar_activities`, `mandarin_progress`
- `src/services/sync/syncService.ts` — 4 tabel didaftarkan ke `ALL_SYNC_TABLES`
- `src/features/academic/AcademicPage.tsx` — tab baru `sipejar`

## Mobile
- `SipejarOSView` memakai `useResponsive()`: grid 12 kolom di desktop → 1 kolom di mobile; tab bar horizontal-scroll di mobile.
- Tab nav AcademicPage sudah scrollable (chevron + wheel) — aman untuk layar kecil.
- Data tersimpan lokal (SQLite) lalu tersinkron delta-only — hemat egress saat diakses dari HP/PWA.

## Solusi Egress Supabase (837% → target <100%)
Penyebab utama: full-table pull setiap sync (`select *` semua baris setiap kali) + auto-sync periodik.

Perbaikan di `src/services/sync/syncService.ts`:
1. **Delta sync berbasis `updated_at`** — hanya baris yang berubah sejak sync terakhir yang di-download (`?updated_at=gt.<lastSync>`), bukan seluruh tabel.
2. **Incremental push** — hanya baris lokal yang dirty (perubahan sejak push terakhir) yang di-upload.
3. **Jendela sync & backoff** — auto-sync dibatasi interval minimum, tidak sync saat tab tidak aktif.
4. **Payload ramping** — kolom besar tidak ikut dalam sync rutin.

Perbaikan di `src/db/client.ts`:
- Event `db_mutation` di-debounce sehingga banyak operasi tulis dalam satu sesi hanya memicu satu siklus sync.

Rekomendasi tambahan (sisi Supabase, opsional):
- Jalankan SQL di `supabase_schema.sql` (indeks `updated_at` pada semua tabel sync) agar query delta murah.
- Aktifkan **Cached Egress** / CDN (saat ini 0/5 GB terpakai) dengan mengaktifkan cache header pada domain project.
- Pertimbangkan pause auto-sync di mobile (sync manual saja) di Cloud Sync Settings.

## Verifikasi
- `npx tsc --noEmit` → 0 error
- `npx vite build` → sukses (built in ~24s)

## Revisi Lanjutan (Feedback User)

### 1. Fix dropdown `<select>` kamuflase (dark mode)
- CSS global di `src/index.css`: opsi dropdown kini punya background & warna teks eksplisit untuk light/dark mode, plus highlight biru saat hover/terpilih.

### 2. Terjemahan Inggris → Indonesia untuk deck Anki (.apkg)
- File baru `src/services/chinese/ankiTranslation.ts` — kamus offline ±400 frasa & kata Inggris umum (khas deck HSK) → Bahasa Indonesia.
- Hanzi, pinyin bertanda, URL, dan tag HTML **tidak pernah diubah** — hanya teks arti berbahasa Inggris yang diterjemahkan.
- `parseAnkiPackage` menerima opsi `translateToIndonesian`; nama deck juga diterjemahkan (cth. "HSK 1 Vocabulary" → "HSK 1 Kosakata").
- Toggle "Terjemahkan arti Inggris → Bahasa Indonesia" (default aktif) ditambahkan di `AnkiImportModal`.
- Catatan: terjemahan berbasis kamus offline. Kata yang tidak ada di kamus tetap dalam bahasa aslinya — aman, tidak merusak konten.

### 3. Fix suara (audio) tidak muncul di kartu Anki
- **Lookup nama file case-insensitive** — `[sound:Audio.mp3]` vs `audio.MP3` kini cocok.
- **MIME akurat** — tipe audio dideteksi dari data URL (mp3/wav/ogg/m4a/aac/flac), bukan hardcode.
- **Fallback audio semua field** — `[sound:...]` di field yang tidak dirender template Anki (mis. field "Audio") kini otomatis ditempelkan sebagai pemutar audio di bagian belakang kartu.

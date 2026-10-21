# OmniLife — Tauri + React + TypeScript

Personal Life Manager (PLM): local-first desktop + Android app with optional Supabase cloud sync.

## Structure

- `src/` — React frontend (features, services, db, ui)
- `src-tauri/` — Tauri desktop + Android shell (Rust)
- `docs/architecture/` — architecture & design docs
- `docs/reports/` — implementation reports
- `docs/specs/` — feature foundation & specification docs
- `docs/promptlog/` — phased implementation prompt logs (historical)
- `scripts/` — helper scripts (`build-android.bat`, `download_jdk.cmd`, `make_report.cmd`)
- `supabase_schema.sql` — complete Supabase cloud schema (run in SQL Editor; idempotent)
- `supabase_anki_setup.sql` — Anki deck sync helpers (Supabase)

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Development

```bash
npm run dev        # Vite dev server (localhost:1420) + Tauri
npm run build      # tsc + vite build
npx tauri build    # desktop installer
npx tauri android build --apk   # Android APK
```

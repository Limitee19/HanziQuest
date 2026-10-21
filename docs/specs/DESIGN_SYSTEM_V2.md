# OmniLife Design System V2 — "Dark Precision Tool"

> **Status:** Spec (review pertama, belum implementasi)
> **Doel:** OmniLife V2 terlihat seperti dibangun desainer profesional, bukan template AI. Fungsi 100% dipertahankan — SEMUA perubahan hanya visual.
> **Direction:** Linear / Arc / Pro-tool — graphite base, 1 accent electric (indigo-violet), tipografi crisp, layout tight & data-focused, mobile detail.

---

## 1. Filosofi

Lima prinsip yang membedakan dari versi lama:
1. **Hierarki over dekorasi** — text sizes & weights memimpin; warna hanya untuk accent & semantik.
2. **Rust via kontrol** — kurangi micro-tekst, tingkatkan whitespace grid; tidak semua bentuk pill.
3. **Satu accent, hemat** — indigo-violet untuk aksi primer; hijau/merah/amber hanya semantik.
4. **Dark-first graphit** — cool neutral dengan cyan-tint; light mode juga refined (bukan putih polos).
5. **Detail micro** — focus ring, hover, empty state, scrollbar, motion 150ms — inilah yang membuat "profesional".

---

## 2. Color tokens (Tailwind v4 via `@theme` di `src/index.css`)

### Strategi
- **Remap `--color-zinc-*`** → graphite cool-toned (cyan-tint) untuk neutral — migrasi instan ke seluruh app.
- **Remap `--color-blue-*`** → indigo-violet accent scale (blue = primary accent di app).
- **Token semantik** baru: `surface`, `canvas`, `edge`, `accent`, `success`, `warning`, `danger`, `info`.
- `emerald/rose/amber` di-tune hue-nya (tidak default), tetap semantik.

### Graphite scale (remap zinc)
| Token | Light | Dark (`.dark`) |
|---|---|---|
| `zinc-50` (canvas) | `#FAFAFB` | `#141519` |
| `zinc-100` | `#F4F4F6` | `#191A1F` |
| `zinc-200` (border) | `#E9E9EE` | `#26272C` |
| `zinc-300` | `#D9D9E0` | `#33343B` |
| `zinc-400` | `#B7B8C0` | `#4A4C55` |
| `zinc-500` | `#9B9CA6` | `#63656F` |
| `zinc-600` (muted) | `#7B7D88` | `#8C8F9A` |
| `zinc-700` (secondary) | `#60616B` | `#B4B7C1` |
| `zinc-800` | `#3A3C44` | `#D8DAE3` |
| `zinc-900` (surface) | `#26272C` | `#ECEEF5` |
| `zinc-950` (deep) | `#1E1F23` | `#F7F8FB` |

### Accent scale (remap blue → indigo-violet)
| Token | Hex |
|---|---|
| `blue-50 / 100` | `#EEF0FF / #DEE4FF` |
| `blue-200 / 300` | `#C4CDFB / #A5B1F6` |
| `blue-400 / 500` | `#8490F0 / #6E79F5` |
| `blue-600` **(primary)** | `#5A64E8` |
| `blue-700 / 800 / 900` | `#4B53D0 / #3D44AC / #2F3587` |

### Semantic
| Role | Dark | Light |
|---|---|---|
| `success` | `#3FBF6F` | `#2E9B5F` |
| `warning` | `#D9973B` | `#B5761F` |
| `danger` | `#E45E5E` | `#C53A3A` |
| `info` (teal) | `#37A6D9` | `#2B86B3` |

**Rule:** accent hanya untuk aksi/status aktif; hijau/merah/amber semantik; formatting pakai neutral text.

---

## 3. Typography

- **Primary:** Inter (bundled `@fontsource-variable/inter`; fallback system-ui/Segoe UI/Roboto).
- **Mono:** JetBrains Mono (bundled) untuk ID, kode, angka, waktu; fallback ui-monospace.

### Type scale
| Level | Size/Line | Weight | Tracking |
|---|---|---|---|
| Display (jarang) | 24/28 | 700 | -0.03em |
| H1 | 18/24 | 650 | -0.02em |
| H2 | 16/22 | 600 | -0.01em |
| Body | 13.5/20 | 400 | 0 |
| Small | 12/16 | 400 | 0 |
| Label | 11/14 | 500 | +0.01em uppercase |
| Mono data | 13/20 | 400 | 0 tabular-nums |

**Rules:**
- Floor: TIDAK ADA teks di bawah 10px; sweep semua `text-[9px]/[10px]` → min `11px`.
- `font-black` hanya nama produk; judul max 700.
- Text levels: primary → secondary (zinc-700) → muted (zinc-600); `tabular-nums` untuk angka finansial/nilai.

---

## 4. Radius — shape — elevation

| Token | Value | Use |
|---|---|---|
| `xs` | 4px | checkbox, tag kecil |
| `sm` | 6px | Button, Input, Badge |
| `md` | 8px | Card, list-item, dropdown |
| `lg` | 12px | Modal, Drawer, Popover |
| `full` | 999px | chip/avatar/scrollbar saja |

**Kill excess:** `rounded-2xl` pada button/card → `sm`/`md`. Pill hanya chip.

### Elevation (border-first)
| Level | Definisi |
|---|---|
| `flat` | tanpa border/shadow (canvas) |
| `raised` | 1px border `edge` + `shadow-xs` |
| `pop` | 1px border + shadow-lg + backdrop-blur 8 |

Dark: elevasi via bg-lift + border (shadow nyaris tak terlihat). Light: soft shadow.

---

## 5. Spacing — grid — container

- Grid **4px**: `xxs 4 · xs 6 · sm 8 · md 12 · lg 16 · xl 24 · xxl 32`.
- Card padding `p-4`; heading card `space-y-1.5`; section `space-y-4/6`.
- Page container `max-w-[1440px] mx-auto` (ultra-wide tidak memanjang tanpa batas).
- Sidebar 240px (collapsed 72px); header 56px; content `px-4 sm:px-5 md:px-7 pt-6 sm:pt-8 md:pt-10`.

---

## 6. Motion

| Action | Duration | Ease |
|---|---|---|
| Hover | 120ms | ease-out |
| Press (active:scale) | 80ms | instant |
| Panel/toggle | 200ms | ease-out |
| Modal/Drawer | 240ms | ease-out (fade + 8px slide) |
| Tab scroll | 200ms | smooth |

- Respect `prefers-reduced-motion` (tween → fade saja).
- `animate-pulse` hanya untuk loading, bukan status terus-menerus.

---

## 7. Component language (rebuild sekali, cascade ke semua page)

### Buttons
- Level: `primary` (accent bg), `secondary` (surface+border), `ghost` (flat), `danger`.
- Height desktop `h-9` (36px); **touch target mobile ≥44px**.
- Focus-visible: ring 2px accent + offset. Active = `scale-95`.

### Cards & Panels
- Bg `surface`, border 1px `edge`, radius `md`, padding 16.
- Heading: title 13.5/600 + actions di kanan; divider subtle.
- **Hapus gradient hero** (biru→indigo) → ganti `surface` + aksen dekoratif tipis (garis top atau icon).

### Inputs & Selects
- Bg `surface`, border `edge`, radius `sm`, focus ring accent, placeholder muted, height 38-40px.
- Checkbox/toggle custom 16px, accent, focus ring.

### Tables
- Header sticky 11px uppercase muted; row 13px; hover `raised`; ID/angka mono; angka rata kanan; mobile → card list atau horizontal scroll sticky kolom pertama.

### Badges/Chips
- Pill 10-11px, tinted bg (accent/semantic 12%), tidak berlebihan.

### Sidebar (Linear-style) — perubahan visual terbesar
- Item: icon 18px + label 13px medium; **active = soft accent tint + 2px indicator bar di kiri** (bukan pill biru penuh).
- Section label 10px uppercase muted; collapsed rail 72px icon-only + tooltip.

### Header
- 56px; breadcrumb (domain → tab); sticky blur; shadow muncul saat scroll saja.

### HubPage tabs
- Segmented control: `px-3.5 py-2 rounded-lg`; active = accent bg; bukan pill raksasa.

### MobileBottomNav
- Maks 5 slot; active: accent icon + 2px topline; hit ≥44px; safe-area.

### Empty states
- Icon + title 14/600 + hint 12 muted + CTA. Tidak ada lagi "No data" telanjang.

---

## 8. Responsive — mobile detail

| Breakpoint | Fokus |
|---|---|
| `<640` | 1 kolom; touch ≥44px; header icon-only; hub tabs swipe; bottom nav thumb-zone |
| `≥640` | grid 2 kolom; padding lebih |
| `≥768` | sidebar desktop muncul; 3 kolom |
| `≥1024` | 4 kolom; tabel in-place |
| `≥1280` | container max-w; tidak overfull |

- Tabel mobile → card list / scroll horizontal sticky kolom pertama.
- Modal ≤92% viewport height, scroll internal.
- `pb-safe`/`pt-safe` dipertahankan (notch).

---

## 9. Implementation phases (tiap fase gated `tsc --noEmit` + `vite build`)

- **P0 · Safety** — `git init` + baseline commit (atau backup `src_backup_<date>`).
- **P1 · Tokens** — `index.css`: remap zinc/blue/emerald/rose/amber + `@theme` tokens; font install + fallback; global floor 11px; select/checkbox/scrollbar/focus-visible global.
- **P2 · Chrome** — Sidebar, Header, MainLayout, HubPage, MobileBottomNav, GlobalSearchModal.
- **P3 · Shared components** — Button, Card, Badge, Modal, ConfirmDelete, inputs.
- **P4 · Page sweep per batch** — (a) Dashboard/Analytics (b) Plan Hub (c) Study Hub (Academic+SIPEJAR, StudyHub, Chinese, Documents) (d) Life Hub (e) Money+Secure (Finance, Subscriptions, Vault, Settings, Sync). Tiap batch = commit + build gate.
- **P5 · Responsive audit** — 360/390/768/1280px, dark+light, touch audit.
- **P6 · Polish** — empty states, micro-interaction, mono tables, scrollbar, focus, contrast.

## 10. Non-goals & safety

- Tidak ada perubahan fungsional — handler/data/flow identik.
- Tidak menyentuh database/schema/sync.
- Lokalisasi ID/EN tetap; tidak menambah fitur.
- Setiap fase revertable per commit.
- Performa: hanya fonts sebagai dependency baru; build target < 30s.
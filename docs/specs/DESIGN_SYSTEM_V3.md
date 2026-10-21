# OmniLife Design System V3 — "Soft Brutalist Desk"

> **Status:** Implemented (P1–P4) — eksekusi bertahap dengan gate `tsc --noEmit` + `vite build`
> **Pewaris:** DESIGN_SYSTEM_V2 (zinc/indigo palette, radius, spacing, motion, non-goals).
> **Doel:** OmniLife terasa seperti alat kerja yang *punya karakter* — bukan template AI. Fungsi 100% dipertahankan; semua perubahan hanya visual.

---

## 1. Konsep — Neo-Brutalism Lembut

Bukan brutalism keras ala Figma-community poster. Ini **brutalism yang dijinakkan untuk alat harian**:

1. **Border tegas, bukan bayangan kabur** — kertas di atas meja, bukan kartu melayang.
2. **Offset shadow (hard shadow)** — bayangan solid yang bergeser, hanya pada elemen interaktif saat hover/press. Ini satu-satunya "hiasan".
3. **Satu accent, lebih berani** — indigo `#7048F8` tetap; saat primary action, accent boleh berani (solid + shadow offset).
4. **Kontras tipografi** — Bricolage (display berkarakter) × Plus Jakarta (body tenang). Kontras ini adalah identitas utama.
5. **Detail micro tetap rapi** — focus ring, hover states, empty state, scrollbar — pewaris V2.

Yang TIDAK berubah: warna (graphite + indigo), spacing 4px, motion timing, responsivitas, data-flow, database/sync.

---

## 2. Typography — identitas utama V3

| Peran | Font | Weight | Kapan |
|---|---|---|---|
| **Display / Heading** | Bricolage Grotesque Variable | 700–800 | H1, H2, judul halaman, judul kartu penting, angka statistik besar, logo "OmniLife" |
| **Body / UI** | Plus Jakarta Sans Variable | 400–600 | Body, label, button, badge, tabel, nav |
| **Micro / dense** | Inter Variable | 400–500 | Label uppercase 10–11px, mono-data kecil |
| **Data / kode** | JetBrains Mono (tetap) | 400–700 | ID, waktu, angka finansial (`tabular-nums`), kode |

Aturan:
- `font-display` = Bricolage dengan `letter-spacing: -0.02em` (khas grotesque lebar).
- Judul **tidak pernah** Inter/Jakarta — kalau bukan Bricolage, itu bukan heading.
- Body 13–14px Jakarta; label micro tetap ≥10px (floor V2).
- Angka statistik hero memakai Bricolage 800 — angka jadi statement.

### Token font
```css
--font-sans: "Plus Jakarta Sans Variable", ...fallbacks;
--font-display: "Bricolage Grotesque Variable", "Plus Jakarta Sans Variable", ...;
```
Utility Tailwind: `font-display` (display), default `font-sans` (body), `font-mono`.

---

## 3. Border & Shadow — bahasa "Soft Brutalist"

### Border
- Card/panel: **border 1.5px** `edge-strong` (bukan 1px edge V2) — tegas tapi tidak berat.
- Element kecil (badge, chip, button outline): 1.5px juga, warna edge-strong.
- Divider dalam kartu: tetap 1px `edge` (halus, internal).

### Radius — dikurangi satu tingkat lagi dari V2
| Token | Value | Use |
|---|---|---|
| `sm` 4px | tag kecil, checkbox |
| `md` 6px | badge, chip |
| `lg` 8px | Button, Input, Card kecil |
| `xl` 12px | Card, Modal, Dropdown |
| `2xl` 16px | Hero panel, drawer |

### Shadow — dua level saja
| Level | Definisi | Kapan |
|---|---|---|
| `shadow-brut` | `2px 2px 0 0` accent-strong (solid) | **hover/focus** pada button primary, nav aktif, kartu stat utama |
| `shadow-brut-sm` | `1px 1px 0 0` edge-strong | hover pada secondary/outline/ghost |
| (default) | `shadow-xs` biasa | keadaan diam semua kartu |

Aturan: offset shadow **hanya pada interaksi** (hover/active/focus-visible) dan pada elemen yang sedang aktif — jangan semua kartu sekaligus, biar hierarki tetap jelas.

### Tekstur halus (opsional, P4 sweep)
- Titik-titik halus di canvas background (radial-gradient dots, 3-4% opacity) — memberi rasa "meja kerja".
- Hairline accent di atas hero panel (pewaris V2, dipertahankan).

---

## 4. Component language (rebuild sekali, cascade ke semua page)

### Button
| Variant | Visual |
|---|---|
| `primary` | bg accent, **border 1.5px accent-strong**, hover: `shadow-brut` + translate(-1px,-1px), active: translate(1px,1px) tanpa shadow |
| `secondary` | surface + border edge-strong, hover: `shadow-brut-sm` + translate(-1px,-1px) |
| `outline` | border 1.5px edge-strong, hover: `shadow-brut-sm` + translate(-1px,-1px) |
| `ghost` | flat, hover: bg-zinc-100 (tetap tenang, tanpa shadow) |
| `destructive` | bg red-600, border red-700, hover: shadow offset merah tua + translate(-1px,-1px) |

Radius `lg` (8px); height & touch target pewaris V2.

### Card
- `bg-surface border-[1.5px] border-edge-strong rounded-xl shadow-xs`
- Judul kartu: **Bricolage 700** 14–15px.
- Kartu stat utama (hero stat): border-[1.5px] + saat "alive" (ada data penting) boleh `shadow-brut` konstan.
- Hover kartu yang bisa diklik: border menggelap + `shadow-brut-sm`.

### Badge
- Radius `md` (6px, bukan pill penuh — **brutalist = kotak yang dijinakkan**), border 1.5px.
- Pewaris warna V2 (tinted bg + border semantik).

### Modal
- `rounded-t-3xl sm:rounded-2xl` (mobile sheet tetap membulat; desktop 16px) — dikurangi dari 2xl/3xl.
- Border 1.5px edge-strong + `shadow-2xl` biasa (offset shadow di modal terlalu berat).
- Header: judul **Bricolage 700**.

### Toast
- Border 1.5px, radius lg, offset shadow sesuai tipe (success → hijau tua, dst).
- Pewaris animasi & posisi V2.

### Inputs & Selects
- Border 1.5px edge-strong, radius lg, focus: ring accent + **border accent**.
- Placeholder muted; height 38–40px (pewaris V2).

### Sidebar
- Pewaris Linear-style V2 (tint + indicator bar kiri).
- Tambahan V3: item aktif dapat **accent 2px bar + Bricolage 700** untuk label aktif, border kanan edge.
- Logo "OmniLife" pakai Bricolage 800.

### Header
- 56px + safe-area; breadcrumb domain → tab.
- Judul halaman **Bricolage 700**; judul tab micro tetap Jakarta.
- Shadow muncul saat scroll saja (pewaris V2).

### HubPage tabs & MobileBottomNav
- Segmented control: active = accent bg + `shadow-brut-sm` konstan (memberi kesan "pressed"). radius lg.
- Bottom nav: active topline 2px accent + label Bricolage 700 saat aktif (mobile label kecil).

### Empty states
- Icon dalam kotak ber-border 1.5px + radius xl (bukan lingkaran penuh) — kotak dengan karakter brutalist.
- CTA primary memakai Button V3.

---

## 5. Color — pewaris penuh dari V2 (TIDAK diubah)
- Graphite zinc remap + Neon Indigo accent — lihat `index.css` V2.
- Semantik (emerald/amber/rose) tetap.
- Tambahan kecil: `--color-edge-strong` dipromosikan sebagai border utama (V2 sudah punya token-nya).

---

## 6. Responsive & mobile — pewaris V2
- Touch ≥44px, safe-area, bottom nav 5 slot, hub tabs swipe — semua dipertahankan.
- Offset shadow di mobile diredam (1px, bukan 2px) agar tidak makan ruang sentuh — handled via CSS media.

---

## 7. Implementation phases (gate: tsc + vite build)

- **P1 · Tokens & font** — `index.css` (font tokens, shadow utilities, radius, tekstur), `main.tsx` (import font). ✅
- **P2 · Shared components** — Button, Card, Badge, Modal, Toast, EmptyState, ChartCard, MarkdownView. ✅
- **P3 · Chrome** — Sidebar, Header, MainLayout, HubPage, MobileBottomNav, GlobalSearchModal. ✅
- **P4 · Page sweep** — Dashboard, Analytics, Tasks, Academic (hero + deskripsi Markdown), Finance. ✅ (batch utama; halaman lain mewarisi via shared components)
- **P5 · Responsive audit** — 360/390/768/1280, dark+light (deferred: butuh preview perangkat).
- **P6 · Polish** — empty states sweep penuh, micro-interaction (deferred).

## 8. Non-goals & safety
- Tidak ada perubahan fungsional — handler/data/flow identik.
- Tidak menyentuh database/schema/sync/AI tools.
- Lokalisasi ID/EN tetap; tidak menambah fitur.
- Setiap fase reversible per file; gate build tiap fase.

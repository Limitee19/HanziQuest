# OmniLife — Localization Specification

**Project:** OmniLife  
**Module:** Indonesian & English Bilingual Localization (Phase 25)  
**Date:** August 12, 2026  

---

## 1. Overview

OmniLife Phase 25 introduces a **Bilingual Localization System** supporting **Bahasa Indonesia** (`id`) and **English** (`en`). Users can switch languages seamlessly via the Header toolbar or Settings page without application restart.

---

## 2. Core Principles

1. **Complete UI Coverage**: All navigation hubs, tab titles, buttons, action dialogs, status badges, and empty states are fully localized.
2. **User Content Preservation**: Stored user content (task titles, personal notes, journal entries, account names) are strictly preserved in their original form without machine translation.
3. **Locale-Aware Formatting**: Date displays, currency strings (`Rp` for IDR), and relative time phrases adapt to active language locale.
4. **Preference Persistence**: Language choice persists across sessions in `localStorage` (`omnilife_language_pref`).

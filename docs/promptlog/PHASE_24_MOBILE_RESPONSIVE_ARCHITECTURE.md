# OmniLife — Mobile, Responsive & Cross-Device Architecture

**Project:** OmniLife  
**Module:** Mobile, Responsive & Cross-Device Polish (Phase 24)  
**Date:** August 12, 2026  

---

## 1. Overview

Phase 24 establishes OmniLife's **Mobile, Responsive & Cross-Device Architecture**. 

The core architectural principle of Phase 24 is:
> **One Codebase, Shared Domain Services, Adaptive Presentation. Desktop OmniLife + Mobile OmniLife + Responsive Layout = One Unified Experience across Windows Desktop & Android Mobile.**

---

## 2. Breakpoints & Adaptive Layout Diagram

```text
                        CENTRALIZED BREAKPOINTS (`useResponsive`)
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         ▼                                 ▼                                 ▼
   MOBILE (< 600px)                 TABLET (600 - 1023px)            DESKTOP (>= 1024px)
 (Single-column layout,            (Adaptive 2-column layout,         (Multi-column grid,
  Bottom bar / drawer,              Responsive dialogs)              Persistent sidebar)
  44x44px touch targets)
```

---

## 3. Core Rules & Design Standards

1. **Centralized Breakpoints (`useResponsive.ts`)**:
   - Central hook providing `isMobile`, `isTablet`, `isDesktop`, and live window dimensions.
2. **Touch Target Accessibility**:
   - Minimum 44x44px touch targets for interactive mobile controls.
3. **Safe Area & Soft Keyboard Protection**:
   - Safe Area paddings prevent system UI overlap; forms auto-scroll above soft keyboards on mobile views.
4. **Global Search Indexing**:
   - `MobileResponsiveSearchProvider.ts` indexes mobile & responsive settings for `Ctrl + K` Command Palette searches.

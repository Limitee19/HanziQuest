# OmniLife — Personal Inventory & Wishlist Architecture

**Project:** OmniLife  
**Module:** Personal Inventory & Wishlist Management System (Phase 20)  
**Date:** August 12, 2026  

---

## 1. Overview

Phase 20 establishes OmniLife's **Personal Inventory & Wishlist System**. 

The core architectural principle of Phase 20 is:
> **Clear conceptual separation between OWNED ITEMS (belongings in active use/storage) and WISHLIST ITEMS (planned future acquisitions), while orchestrating optional financial transactions, warranty expiration reminders, and maintenance schedules.**

---

## 2. Architecture & Conversion Workflow Diagram

```text
                  WISHLIST ITEM ("Things I want to buy")
                             │
                     Mark as Purchased
                             ▼
                  WISHLIST CONVERSION FLOW
                             │
             ┌───────────────┴───────────────┐
             ▼                               ▼
       CREATE OWNED ITEM              CREATE FINANCE EXPENSE
     (`inventoryService.ts`)          (`financeService.ts`)
             │                               │
    ┌────────┴────────┬─────────────┐        │
    ▼                 ▼             ▼        ▼
LOCATION          WARRANTY     MAINTENANCE  FINANCE
               (`reminder`)   (`reminder`) ANALYTICS
```

---

## 3. Data Models & Conversion Logic

- **Owned Item (`InventoryItem`)**: `id`, `name`, `category`, `quantity`, `status` (`owned`, `in_use`, `stored`, `borrowed`, `loaned`, `broken`, `sold`, `disposed`), `purchaseDate`, `purchasePrice`, `location`, `brand`, `model`, `serialNumber`, `warrantyExpiration`, `note`.
- **Wishlist Item (`WishlistItem`)**: `id`, `name`, `category`, `estimatedPrice`, `currency`, `priority` (`low`, `medium`, `high`), `status` (`considering`, `want`, `planned`, `purchased`, `cancelled`), `goalId`, `targetDate`.
- **Conversion Orchestration**: `convertWishlistToPurchase()` updates wishlist status to `purchased`, creates an `OwnedItem` entry in Inventory, and optionally creates a linked Finance expense transaction.
- **Global Search Indexing**: `InventorySearchProvider.ts` indexes Owned Items and Wishlist Items for `Ctrl + K` Command Palette searches.

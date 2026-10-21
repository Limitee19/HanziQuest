# OmniLife — Backup, Import & Export Architecture

**Project:** OmniLife  
**Module:** Backup / Import / Export System (Phase 23)  
**Date:** August 12, 2026  

---

## 1. Overview

Phase 23 establishes OmniLife's **Backup, Import & Export Engine**. 

The core architectural principle of Phase 23 is:
> **100% Local-First Data Sovereignty. Full offline database payload export with cryptographic checksum integrity verification, atomic restoration, and CSV spreadsheet exports for external data analysis.**

---

## 2. Architecture & Data Export Diagram

```text
                  OMNILIFE LOCAL DATABASE (SQLite)
                                │
          ┌─────────────────────┼─────────────────────┐
          ▼                     ▼                     ▼
    FULL BACKUP            CSV EXPORTER          RESTORE ENGINE
  (`.plmbackup`)          (`.csv` format)       (Validates checksum)
          │                     │                     │
   Checksum Hash         Transactions /         Atomic Database
   Verification            Inventory               Restoration
```

---

## 3. Core Rules & Data Integrity

1. **Multi-Domain Backup Coverage**:
   - `exportBackupData()` captures all database tables (`app_metadata`, `calendar_entries`, `notes`, `financial_accounts`, `financial_categories`, `financial_transactions`, `budgets`, `vault_categories`, `vault_entries`, `tasks`, `reminders`, `goals`, `subscriptions`, `inventory`, `wishlist`, `projects`).
2. **Checksum Integrity Verification**:
   - `generateChecksum(dataStr)` creates a deterministic 32-bit hash on export and validates checksum prior to restoring database state to prevent corrupted payload insertion.
3. **CSV Export Capabilities**:
   - `exportToCSV(tableName)` formats transactions and inventory rows into CSV lines suitable for Microsoft Excel or Google Sheets.
4. **Global Search Indexing**:
   - `BackupSearchProvider.ts` indexes Backup, Import, and Export capabilities for `Ctrl + K` Command Palette searches.

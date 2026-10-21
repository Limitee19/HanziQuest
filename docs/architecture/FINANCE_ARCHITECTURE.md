# OmniLife — Personal Finance & Money Management Architecture

**Project:** OmniLife  
**Module:** Personal Finance & Money Management System (Phase 18)  
**Date:** August 12, 2026  

---

## 1. Overview

Phase 18 establishes OmniLife's **Personal Finance & Money Management System**. 

The core architectural principle of Phase 18 is:
> **100% Local-First, Offline-First, and Privacy-First. Finance is a connected personal accounting domain without third-party bank tracking or external cloud synchronization.**

---

## 2. Architecture & Transaction Model Diagram

```text
                        PERSONAL FINANCE
                               │
          ┌────────────────────┼────────────────────┐
          ▼                    ▼                    ▼
       ACCOUNTS           TRANSACTIONS           BUDGETS
(Cash, Bank, E-Wallet)    (Inc, Exp, Xfer)     (Weekly, Monthly)
          │                    │                    │
          │             ┌──────┼──────┐             │
          │             ▼      ▼      ▼             │
          │          INCOME EXPENSE TRANSFER        │
          │                                         │
          └────────────────────┬────────────────────┘
                               ▼
                        FINANCIAL GOALS
                        (Linked to Goals)
```

---

## 3. Core Rules & Security Requirements

1. **Net Cash Flow Rule for Transfers**:
   - Transfer transactions move funds between two accounts (`fromAccountId` -> `toAccountId`).
   - Transfers update account balances but result in **0 Net Cash Flow change**.
2. **Budgets & Financial Goals**:
   - Category budget tracking (`80% Approaching`, `100% Reached`, `>100% Exceeded`).
   - Financial savings goals linked directly to Phase 16 Goals.
3. **Privacy & Log Security**:
   - Production logs strictly exclude transaction amounts, account balances, and financial notes.
4. **Global Search Indexing**:
   - `FinanceSearchProvider.ts` indexes Accounts, Transactions, Categories, and Financial Goals for `Ctrl + K` Command Palette searches.

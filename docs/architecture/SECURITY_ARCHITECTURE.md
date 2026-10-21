# OmniLife — Security Architecture Documentation

**Project:** OmniLife  
**Module:** Secure Data & Personal Vault (Phase 5)  
**Security Boundary:** Local Authenticated Encryption Boundary  
**Date:** August 11, 2026  

---

## 1. Threat Model & Security Boundary

The OmniLife Secure Vault provides local authenticated encryption at rest for sensitive credentials (game logins, email accounts, software license keys, API tokens, recovery codes, and secure notes).

### Threat Vectors Mitigated:
- **Casual Physical / Local System Access**: Prevent unauthorized reading of passwords or secrets when an unauthenticated user opens OmniLife.
- **Local Persistence Database Inspection**: Prevent plaintext secrets from appearing inside the local SQLite database (`vault_entries` table).
- **Brute-Force Master Password Attacks**: Mitigated via PBKDF2-SHA256 with 100,000 iterations and progressive lockouts.
- **Data Tampering & Manipulation**: Mitigated via AES-256-GCM authenticated tag verification during decryption.

### Out of Scope:
- OS-level kernel compromise / active rootkit keyloggers.

---

## 2. Cryptographic Specifications

All cryptographic operations rely on standard, well-reviewed **Web Crypto API (`window.crypto.subtle`)** primitives.

| Cryptographic Operation | Specification | Parameter Details |
| :--- | :--- | :--- |
| **Password Derivation (KDF)** | PBKDF2 with SHA-256 | `100,000` iterations, 16-byte CSPRNG Salt |
| **Master Password Verification** | PBKDF2-SHA256 Hash | Derived hex string stored in `app_metadata` |
| **Payload Encryption** | AES-256-GCM | 256-bit derived key, 96-bit (12-byte) IV per record |
| **Format at Rest** | Packaged Hex String | `IV_HEX:CIPHERTEXT_HEX` |
| **Entropy Source** | Web Crypto CSPRNG | `window.crypto.getRandomValues()` |

---

## 3. Key Derivation & Storage Architecture

```text
                  Master Password (User Input)
                             │
                             ▼
             PBKDF2-SHA256 (100,000 Iterations)
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   Verification Hash                    CryptoKey (256-bit)
   (Stored in DB)                    (Held only in memory)
                                              │
                                              ▼
                                   AES-256-GCM Encryption
                                              │
                                              ▼
                                    Encrypted Payload
                                  (IV_HEX:CIPHERTEXT_HEX)
```

1. **Master Password Salt**: 16-byte random salt generated via `crypto.getRandomValues()` and stored in `app_metadata`.
2. **Master Password Hash**: Derived via 100,000 PBKDF2 iterations for verifying unlock attempts without storing the password in plaintext.
3. **Derived CryptoKey**: Derived in-memory upon unlock for encrypting and decrypting `vault_entries` payloads.

---

## 4. Inactivity & Session Security

- **Auto-Lock Timer**: The Vault automatically revokes active `CryptoKey` material and clears in-memory secrets after **5 minutes of inactivity** (`mousemove` / `keydown`).
- **Manual Lock**: Users can immediately lock the Vault using the "Lock Vault" button.
- **Attempt Throttling**: After 5 consecutive failed unlock attempts, the Vault enforces a 30-second lockout period.

---

## 5. Global Search & Timeline Isolation

- **Search Isolation**: Global Search (`GlobalSearchModal`) NEVER indexes decrypted passwords, recovery codes, or secret payloads. When unlocked, it only displays the item title with a `🔒 Vault` badge and redirects to the Vault tab.
- **Timeline Isolation**: No password values or secret contents are written to the Life Timeline stream or console logs.

---

## 6. Master Password Change & Re-Encryption

Changing the Master Password executes a zero-downtime re-encryption:
1. Verifies current Master Password.
2. Generates a fresh 16-byte Salt and derives the new CryptoKey.
3. Decrypts all existing `vault_entries` in memory using the old key.
4. Re-encrypts all items under the new CryptoKey with fresh IVs.
5. Updates `app_metadata` and commits the re-encrypted entries in SQLite.

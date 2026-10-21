# OmniLife — Phase 5 Implementation Specification

**Project:** OmniLife  
**Phase:** 5 — Secure Data & Personal Vault  
**Status:** Ready for Implementation  
**Implementation Agent:** Antigravity  
**Scope:** Phase 5 only

---

# 1. PURPOSE

Phase 5 introduces the **OmniLife Secure Vault**.

The Vault is a protected area for highly sensitive personal information that should not be stored in ordinary OmniLife records.

Examples:

```text
Game Accounts
Website Accounts
Email Accounts
Software Accounts
API Keys
License Keys
Recovery Codes
Private Notes
PINs
Other Sensitive Credentials
```

The Vault must be treated as a fundamentally different security boundary from normal OmniLife data.

---

# 2. CRITICAL SECURITY PRINCIPLE

The Vault must NOT simply be:

```text
Password
    ↓
Open Vault Screen
```

It must provide actual protection for sensitive data at rest.

Conceptually:

```text
                 OMNILIFE
                    │
          ┌─────────┴─────────┐
          │                   │
     Normal Data          SECURE VAULT
                              │
                         Master Password
                              │
                         Key Derivation
                              │
                       Encryption Key
                              │
                       Encrypted Data
```

The Vault must remain inaccessible without successful authentication.

---

# 3. SECURITY REQUIREMENT

**Do NOT implement custom cryptographic algorithms.**

Do not invent:

```text
Custom encryption algorithm
Custom hashing algorithm
Custom key derivation algorithm
Custom password obfuscation
Custom random number generation
```

Use mature, well-reviewed cryptographic libraries and platform secure-storage APIs appropriate for Flutter and the supported platforms.

If a security-sensitive implementation decision is uncertain:

```text
STOP
DOCUMENT THE ISSUE
DO NOT GUESS
```

Security correctness takes priority over implementation speed.

---

# 4. SOURCE OF TRUTH

Before implementation:

1. Inspect the current OmniLife workspace.
2. Read all existing architecture documentation.
3. Read Phase 1 implementation report.
4. Read Phase 2 implementation report.
5. Read Phase 3 implementation report.
6. Read Phase 4 implementation report.
7. Inspect the current persistence layer.
8. Inspect the current data model.
9. Inspect the current application lifecycle.
10. Inspect current navigation and UI architecture.
11. Inspect existing local-storage mechanisms.

The existing OmniLife codebase is the source of truth.

Do not blindly rewrite existing systems.

---

# 5. PHASE 5 PRODUCT GOAL

The user should be able to store sensitive information inside OmniLife without exposing it through normal application views.

Example:

```text
Vault

Game Accounts
├── Roblox
├── Steam
└── Other Game

Email
├── Personal Email
└── College Email

Software
├── License Keys
└── API Keys

Private
├── Recovery Codes
└── Private Notes
```

The Vault should feel like a private, local, secure compartment inside OmniLife.

---

# 6. SECURITY BOUNDARY

The Vault must be isolated conceptually and technically from normal OmniLife data.

Normal data may include:

```text
Tasks
Notes
Projects
Goals
Calendar
Finance
College
Wishlist
Inventory
```

Vault data includes:

```text
Passwords
Credentials
Secrets
Recovery Codes
API Keys
Private Secrets
```

Do not store sensitive Vault secrets in plaintext in ordinary OmniLife tables or objects.

---

# 7. MASTER PASSWORD

The Vault must have a Master Password.

The Master Password is the primary authentication mechanism for unlocking the Vault.

Requirements:

```text
Never store the Master Password in plaintext.
Never store the Master Password directly in the database.
Never log the Master Password.
Never include it in debug output.
Never include it in analytics.
Never expose it through ordinary application state unnecessarily.
```

---

# 8. MASTER PASSWORD SETUP

On first Vault access:

```text
Create Master Password
        ↓
Confirm Master Password
        ↓
Initialize Secure Vault
```

Provide password-strength feedback.

Do not impose unnecessarily arbitrary password rules.

Prefer encouraging a strong passphrase/password.

---

# 9. MASTER PASSWORD VERIFICATION

The application must be able to determine whether the supplied Master Password is correct without storing the Master Password itself.

Use an appropriate password-based key derivation / verification design.

The exact cryptographic implementation must use an established, reputable library.

---

# 10. KEY DERIVATION

The Master Password must not be used directly as an encryption key.

Conceptually:

```text
Master Password
      ↓
Password-Based Key Derivation Function
      ↓
Derived Key
      ↓
Encryption / Decryption
```

Use a modern password-based key derivation mechanism supported by a reputable cryptographic library.

Use a unique cryptographic salt for the Vault.

Do not hard-code a global salt.

---

# 11. ENCRYPTION

Sensitive Vault contents must be encrypted at rest.

Use an authenticated encryption design where available.

The implementation must provide:

```text
Confidentiality
+
Integrity / Authentication
```

Do not use unauthenticated encryption alone for Vault records.

Do not invent encryption formats.

---

# 12. ENCRYPTION KEY MANAGEMENT

Do not store a plaintext master encryption key in ordinary persistent storage.

The architecture should make it possible to derive or securely unwrap the Vault encryption key after successful authentication.

If a randomly generated data-encryption key is used, it must itself be protected appropriately.

Document the chosen architecture in the implementation report.

---

# 13. VAULT DATABASE

Vault records should be stored in a way that ensures sensitive fields are encrypted.

Preferred conceptual structure:

```text
Vault Database

Metadata
    ↓
Encrypted Payload
```

Sensitive fields should never accidentally appear in plaintext database records.

Examples of sensitive fields:

```text
Username
Password
Secret
Recovery Code
API Key
Private Note
```

---

# 14. ENCRYPTED PAYLOAD

A Vault item may conceptually contain:

```text
Encrypted Payload
{
    title,
    username,
    password,
    notes,
    recoveryCodes,
    customFields
}
```

The exact serialization format is an implementation detail.

Do not expose plaintext payloads unnecessarily.

---

# 15. VAULT ITEM TYPES

Implement a flexible Vault item system.

Initial types:

```text
Login
Secure Note
API Key
License Key
Recovery Code
PIN / Secret
```

The architecture should allow future item types without redesigning the entire Vault.

---

# 16. LOGIN ITEM

A Login entry should support:

```text
Title
Username
Password
Website / Service
Notes
Category
```

Example:

```text
Roblox

Username:
example_user

Password:
••••••••••

Website:
Roblox
```

---

# 17. GAME ACCOUNT SUPPORT

The Vault must support game accounts naturally.

Example:

```text
Game Accounts

Roblox
Steam
Epic Games
Riot Games
Minecraft
Other
```

Do not hard-code the Vault to gaming.

The same Login type should work for any service.

---

# 18. SECURE NOTE

Implement Secure Notes.

Example:

```text
Title:
Recovery Information

Content:
[Encrypted content]
```

Secure Notes must be encrypted exactly like other sensitive Vault content.

---

# 19. API KEY ITEM

Support API keys.

Fields may include:

```text
Name
Service
API Key
Environment
Notes
```

Example:

```text
OpenAI

Environment:
Development

API Key:
••••••••••••

Notes:
Local development key
```

The actual secret must remain encrypted and masked in the UI.

---

# 20. LICENSE KEY ITEM

Support software/game license keys.

Example:

```text
Windows License

Key:
•••••-•••••-•••••-•••••
```

The license key must be treated as sensitive.

---

# 21. RECOVERY CODE ITEM

Support recovery codes.

Example:

```text
Google Recovery Codes

••••••••
••••••••
••••••••
```

Recovery codes must never appear in search results or previews while the Vault is locked.

---

# 22. CUSTOM FIELDS

The architecture should support optional custom fields.

Example:

```text
Steam Account

Username
Password
Email
2FA Method
Account ID
Notes
```

However:

**Do not create an overly complicated form builder in Phase 5.**

A simple key/value custom-field mechanism is sufficient.

---

# 23. VAULT CATEGORIES

Allow categorization.

Initial categories:

```text
Gaming
Email
Social
Education
Work
Software
Finance
Personal
Other
```

Users should eventually be able to create custom categories.

---

# 24. VAULT ITEM SEARCH

Search should work while the Vault is unlocked.

Searchable non-secret metadata:

```text
Title
Category
Service
Username
Website
Tags
```

Sensitive secret contents should not be unnecessarily indexed in a plaintext search index.

---

# 25. SEARCH SECURITY

Do NOT create a global search index containing plaintext passwords or secrets.

When the Vault is locked:

```text
Vault search
    ↓
Unavailable
```

Normal OmniLife Global Search must NOT reveal Vault secrets.

---

# 26. VAULT UI

The Vault should clearly communicate its protected nature.

Conceptual layout:

```text
SECURE VAULT

🔒 Locked / Unlocked

Search

Categories

Game Accounts
Email
Software
Private

Recent Items
```

Avoid excessive visual security theater.

The UI should remain consistent with OmniLife.

---

# 27. LOCKED STATE

When locked, the Vault must not expose:

```text
Passwords
Usernames
Secrets
Recovery Codes
API Keys
Secure Notes
```

The locked Vault may show:

```text
Secure Vault
🔒 Locked
Unlock to access your secure information.
```

Do not display sensitive previews.

---

# 28. UNLOCK FLOW

Example:

```text
Open Vault
      ↓
Enter Master Password
      ↓
Verify
      ↓
Unlock
      ↓
Vault available
```

Incorrect passwords must not reveal which secret was attempted or any sensitive information.

---

# 29. FAILED ATTEMPTS

Implement reasonable local protections against repeated brute-force attempts.

Possible measures:

```text
Progressive delay
Temporary lockout
Attempt throttling
```

Do not implement a permanent destructive lockout that can accidentally cause irreversible personal-data loss.

Document the chosen behavior.

---

# 30. AUTO-LOCK

The Vault should automatically lock after inactivity.

Example settings:

```text
Immediately
1 minute
5 minutes
15 minutes
30 minutes
Never
```

Recommended default:

```text
5 minutes
```

The exact default may follow the final UX decision.

---

# 31. APP BACKGROUND LOCK

When the application is minimized or moved to the background, consider locking the Vault according to a configurable security policy.

For mobile:

```text
App backgrounded
      ↓
Vault lock
```

For desktop:

```text
Application inactive
      ↓
Auto-lock timer
```

Do not keep decrypted secrets unnecessarily alive in memory.

---

# 32. MEMORY HYGIENE

After locking:

```text
Sensitive plaintext should no longer be unnecessarily retained in active application state.
```

Avoid:

```text
Global plaintext password variables
Long-lived secret caches
Debug logs containing secrets
Clipboard contents retained indefinitely
```

Use the safest practical memory-handling approach supported by the chosen platform and language.

Document limitations honestly.

---

# 33. PASSWORD VISIBILITY

Passwords should be masked by default.

Example:

```text
Password
••••••••••••
```

Provide a temporary reveal action.

Example:

```text
👁 Show
```

When revealed:

```text
Do not log
Do not copy automatically
Do not keep revealed state longer than necessary
```

---

# 34. COPY PASSWORD

Allow copying sensitive values to clipboard when explicitly requested.

Example:

```text
Password
[••••••••]

Copy
```

After copying, provide an option to automatically clear the clipboard after a short period where platform capabilities permit.

Do not silently copy secrets.

---

# 35. CLIPBOARD WARNING

When copying:

```text
Password copied to clipboard.
```

Where supported, automatically clear the clipboard after a short timeout.

If the platform does not guarantee reliable clipboard clearing, document the limitation.

---

# 36. EDITING

Vault items should support:

```text
Create
Read
Edit
Delete
Duplicate
```

Be careful with duplication.

Duplicating a secret should require explicit user action.

---

# 37. DELETE CONFIRMATION

Deleting a Vault item should require confirmation.

Example:

```text
Delete "Roblox"?

This permanently removes this secure item.

Cancel
Delete
```

Do not make deletion one accidental tap away.

---

# 38. SECURE DELETE SEMANTICS

Do not claim that deleting a record guarantees forensic destruction from every storage layer unless that guarantee is technically established.

Instead:

```text
Delete the Vault record
Remove it from active storage
Ensure it is no longer accessible through the application
```

Document the actual storage behavior.

---

# 39. VAULT BACKUP

Phase 5 should prepare for secure backup architecture but should NOT implement cloud synchronization.

If local export is implemented, it must be encrypted.

Never implement:

```text
Export passwords as plaintext CSV
Export secrets as plaintext JSON
Share Vault data through normal Android share sheets
```

unless explicitly designed as a secure encrypted export mechanism.

---

# 40. SECURE EXPORT — OPTIONAL

A secure encrypted Vault export may be implemented only if it can be done safely.

Example:

```text
Vault
 ↓
Export
 ↓
Encrypted Vault Backup
 ↓
User chooses destination
```

The export must require explicit authentication.

If secure export cannot be implemented confidently:

```text
Do not implement it.
Document it as deferred.
```

---

# 41. SECURE IMPORT — OPTIONAL

If export is implemented, import may support the same encrypted format.

Requirements:

```text
Validate file
Authenticate
Decrypt
Validate structure
Import safely
```

Do not import arbitrary plaintext password databases without a clearly designed format.

---

# 42. PLATFORM SECURE STORAGE

Where appropriate, use platform secure-storage facilities for small secrets required to operate the Vault.

Potentially:

```text
Windows secure credential facilities
Android Keystore-backed secure storage
```

Do not assume a generic key/value storage mechanism is automatically secure.

Document the platform-specific implementation.

---

# 43. BIOMETRIC / DEVICE AUTHENTICATION

Biometric or device-level authentication may be introduced as a convenience unlock mechanism where supported.

Examples:

```text
Fingerprint
Face authentication
Device PIN / authentication
```

However:

**Biometrics must not silently replace the Master Password recovery model.**

The Master Password remains the fundamental recovery credential.

---

# 44. BIOMETRIC POLICY

If biometric unlock is implemented:

```text
Master Password
      ↓
Primary authentication

Biometric
      ↓
Convenience unlock
```

Do not store the Master Password itself merely to enable biometric unlock.

Use secure platform mechanisms to protect any authentication material.

---

# 45. MASTER PASSWORD CHANGE

Implement changing the Master Password.

Flow:

```text
Current Master Password
        ↓
New Master Password
        ↓
Confirm
        ↓
Re-encrypt / re-wrap Vault key material
        ↓
Success
```

The Vault must remain accessible after changing the password.

---

# 46. MASTER PASSWORD CHANGE SAFETY

Do not destroy the existing Vault until the new encryption state has been successfully written and validated.

Use a safe migration strategy:

```text
Old Secure State
      ↓
Create New Secure State
      ↓
Validate
      ↓
Commit
      ↓
Remove obsolete state where appropriate
```

Avoid partial migrations.

---

# 47. MASTER PASSWORD RESET

There is a fundamental security rule:

If the Master Password is forgotten, the application must not provide a fake "password reset" that silently decrypts the Vault.

Possible behavior:

```text
Forgot Master Password
        ↓
No recovery key configured
        ↓
Vault cannot be decrypted
```

If a future recovery mechanism is implemented, it must be explicitly designed and documented.

Do not weaken encryption for convenience.

---

# 48. SECURITY QUESTIONS

Do NOT use traditional security questions as a Vault recovery mechanism.

Examples of weak recovery questions:

```text
Mother's name?
First pet?
Favorite color?
```

Do not implement this.

---

# 49. NORMAL OMNILIFE SEARCH ISOLATION

Global Search from Phase 2 must NOT search inside locked Vault content.

When Vault is unlocked, do not automatically include secret values in normal global search.

At most, Global Search may surface:

```text
Vault item title
Category
```

and then require Vault authentication to open it.

Prefer:

```text
Search:
Roblox

Result:
🔒 Vault Item — Roblox Account

Tap
 ↓
Vault Authentication / Unlock
 ↓
Item
```

---

# 50. TIMELINE ISOLATION

Do not expose Vault secret contents through Timeline.

Timeline may optionally record non-sensitive metadata such as:

```text
Vault item created
Vault item updated
```

but do not record:

```text
Password changed from X to Y
API key contents
Recovery code contents
Secure note contents
```

Prefer minimal metadata.

---

# 51. NOTIFICATIONS

Never put sensitive Vault data inside notifications.

Bad:

```text
Your Roblox password was changed.
New password: ...
```

Good:

```text
A secure Vault item was updated.
```

---

# 52. LOGGING

Security-sensitive information must never appear in:

```text
Console logs
Crash logs
Analytics
Debug output
Error messages
```

Examples of forbidden logging:

```text
password=12345
apiKey=...
masterPassword=...
recoveryCode=...
```

---

# 53. ERROR HANDLING

Security errors should be generic.

For example:

```text
Unable to unlock Vault.
```

Avoid overly specific messages that reveal internal cryptographic state.

Do not expose:

```text
Salt
Derived Key
Encryption Key
Internal secrets
```

---

# 54. SCREENSHOT / APP PREVIEW PROTECTION

Where supported by platform capabilities, prevent sensitive Vault screens from appearing in application previews or screenshots.

Especially consider mobile app switcher previews.

If platform-specific implementation is possible, use it.

Document platform limitations.

---

# 55. NOTIFICATION PREVIEW

Never expose Vault contents through notification previews.

This includes:

```text
Passwords
Recovery Codes
API Keys
Secure Notes
```

---

# 56. VAULT SESSION STATE

Define clear states:

```text
Locked
Unlocking
Unlocked
Locking
Error
```

Do not keep the Vault in an ambiguous partially unlocked state.

---

# 57. APPLICATION RESTART

After application restart:

```text
Vault
 ↓
Locked
```

The Vault should not automatically decrypt itself unless an explicitly designed secure platform authentication mechanism has been implemented.

Default behavior should be secure.

---

# 58. DEVICE RESTART

After OS/device restart:

```text
Vault
 ↓
Locked
```

Do not depend on application memory surviving device restart.

---

# 59. DATABASE CORRUPTION

If Vault storage becomes corrupted:

Do NOT silently overwrite it.

Preferred behavior:

```text
Vault integrity problem detected.

Your secure data was not automatically deleted.

Restore from a valid encrypted backup if available.
```

Document the recovery behavior.

---

# 60. VAULT DATA MODEL

The Vault architecture should conceptually separate:

```text
VaultItem
    ↓
Metadata
    ↓
Encrypted Payload
```

Metadata may contain non-sensitive information required for organization.

Sensitive data should remain encrypted.

Do not place passwords in plaintext metadata.

---

# 61. VAULT ITEM METADATA

Potential metadata:

```text
ID
Type
Category
Created Date
Updated Date
Optional Title
```

Be careful with titles.

If titles themselves could be sensitive, provide a design where sensitive titles can also be protected.

---

# 62. ENCRYPTION FORMAT VERSIONING

The Vault storage format must include a version.

Example:

```text
Vault Format Version:
1
```

This is necessary for future cryptographic migrations.

Future versions may require:

```text
v1
 ↓
Migration
 ↓
v2
```

Do not make the encryption format impossible to migrate.

---

# 63. CRYPTOGRAPHIC PARAMETERS

The implementation report must document:

```text
Encryption algorithm / mode
Authentication mechanism
Key derivation algorithm
KDF parameters
Salt strategy
Nonce / IV strategy
Vault format version
Key management approach
```

Do not simply write:

```text
AES encryption
```

without explaining how the full authenticated encryption design works.

---

# 64. NONCE / IV SAFETY

If the chosen encryption mechanism requires nonces / IVs:

```text
Never reuse a nonce where the algorithm prohibits reuse.
Use secure randomness as required.
Store whatever is needed to decrypt safely.
```

Do not invent nonce generation.

Use the cryptographic library's recommended secure mechanism.

---

# 65. RANDOMNESS

All security-sensitive random values must use a cryptographically secure random source.

This includes:

```text
Salt
Nonce
Initialization Vector
Random encryption keys
Recovery material
```

Do not use:

```text
DateTime.now()
Math.random()
Pseudo-random application utilities
```

for cryptographic purposes.

---

# 66. PASSWORD STRENGTH

Provide reasonable password-strength feedback.

Consider:

```text
Length
Entropy / diversity
Common-password detection where practical
```

Do not reject strong passphrases simply because they lack arbitrary character classes.

---

# 67. PASSWORD INPUT

Master Password input must:

```text
Be obscured
Avoid accidental exposure
Support paste where appropriate
Not log input
Clear securely from UI state after authentication where practical
```

Do not display it in plain text by default.

---

# 68. VAULT SETTINGS

Create Vault settings for:

```text
Auto-lock timeout
Biometric / device unlock if supported
Clipboard clearing behavior
```

Potential future:

```text
Secure export
Recovery key
```

Do not implement advanced settings unnecessarily.

---

# 69. VAULT DASHBOARD

Create a simple Vault overview.

Example:

```text
SECURE VAULT

🔒 Unlocked

12 Items

Categories

Gaming       5
Email        2
Software     3
Personal     2

Recently Updated
Roblox
College Email
GitHub API Key
```

Do not display actual passwords or secrets on the dashboard.

---

# 70. RECENT ITEMS

Recent items may show:

```text
Roblox Account
College Email
GitHub API Key
```

but never:

```text
password
API key
recovery code
secure note contents
```

---

# 71. IMPORTED / MIGRATED DATA

If Phase 4 contains Important Information records that users may have mistakenly used for sensitive data:

Do NOT automatically move them into the Vault.

Provide a deliberate migration mechanism only if safe.

Example:

```text
Important Information
      ↓
Move to Secure Vault
      ↓
Authenticate
      ↓
Encrypt
      ↓
Confirm
```

Do not silently change storage semantics.

---

# 72. FINANCE ISOLATION

Do not put financial transaction data inside the Vault.

Normal finance data belongs in Phase 4.

The Vault is for credentials and secrets.

Example:

```text
Finance:
Bank balance
Transactions
Expenses

Vault:
Bank login credentials
```

This separation is intentional.

---

# 73. COLLEGE ISOLATION

Normal academic data remains outside the Vault.

Example:

```text
College:
Course
Assignments
Grades

Vault:
College account password
Student portal credentials
```

---

# 74. PROJECT INTEGRATION

Vault items may optionally be associated with a Project.

Example:

```text
Project:
OmniTenant

Vault:
Deployment API Key
```

However:

**Do not display the secret itself outside the Vault.**

The Project may show:

```text
🔒 1 secure credential
```

rather than the actual key.

---

# 75. GOAL INTEGRATION

Vault items may optionally have relationships with Goals where useful.

But avoid unnecessary coupling.

Security-sensitive data must remain behind the Vault boundary.

---

# 76. TASK INTEGRATION

Tasks may reference Vault items without exposing their secret content.

Example:

```text
Task:
Rotate deployment API key

Secure Vault:
🔒 Deployment API Key
```

---

# 77. SEARCH RESULT SECURITY

A normal Search result may say:

```text
🔒 Secure Vault Item
Roblox Account
```

but must NOT display:

```text
Username
Password
Recovery Code
API Key
```

until the user has entered the Vault.

---

# 78. UI / UX REQUIREMENTS

Continue OmniLife's established design system.

The Vault should feel:

```text
Private
Calm
Minimal
Trustworthy
Secure
Professional
```

Avoid:

```text
Hacker aesthetic
Excessive lock icons
Neon security dashboard
Overly technical cryptography UI
```

Users should not need to understand cryptography to use the Vault.

---

# 79. SECURITY UX

Security should be communicated clearly.

Good:

```text
Your secure information is encrypted while stored.
```

Avoid unsupported claims such as:

```text
Military-grade security
Unbreakable encryption
100% secure
Impossible to hack
```

Never make security claims that cannot be technically demonstrated.

---

# 80. RESPONSIVE DESIGN

The Vault must work on all currently supported platforms.

Test:

```text
Windows
Android
```

at minimum.

Mobile layouts should make:

```text
Unlock
View
Copy
Edit
Lock
```

easy to access without exposing secrets accidentally.

---

# 81. ACCESSIBILITY

Maintain accessibility.

Important:

```text
Password visibility must be clearly indicated.
Buttons must have meaningful labels.
Icons must not be the only meaning.
Touch targets must be sufficient.
Focus states must remain clear.
```

---

# 82. PERFORMANCE

Vault operations should remain responsive.

However:

**Do not optimize by keeping decrypted Vault data permanently in memory.**

Security takes priority over premature performance optimization.

---

# 83. TESTING — AUTHENTICATION

Test:

```text
First-time Master Password creation
Password confirmation
Correct password unlock
Incorrect password rejection
Lock
Unlock
Auto-lock
Application restart
```

---

# 84. TESTING — ENCRYPTION

Test:

```text
Create secret
Save
Close app
Reopen
Unlock
Read secret
```

The original secret must be recovered correctly.

Also verify that the persistent storage does not contain the plaintext secret.

---

# 85. TESTING — WRONG PASSWORD

Test:

```text
Correct Master Password
Incorrect Master Password
Empty password
Repeated incorrect attempts
```

Ensure incorrect credentials never expose Vault contents.

---

# 86. TESTING — PASSWORD CHANGE

Test:

```text
Old Password
      ↓
Change
      ↓
New Password
      ↓
Lock
      ↓
Unlock with New Password
      ↓
Data still accessible
```

Also verify:

```text
Old Password
      ↓
Must no longer unlock the Vault
```

---

# 87. TESTING — AUTO LOCK

Test:

```text
Unlock
 ↓
Wait configured duration
 ↓
Vault locks
 ↓
Secret content no longer visible
```

Also test application backgrounding where applicable.

---

# 88. TESTING — CLIPBOARD

Test:

```text
Copy password
 ↓
Clipboard contains requested value
 ↓
Automatic clear behavior
```

Do not log clipboard contents.

---

# 89. TESTING — SEARCH

Verify:

```text
Locked Vault
 ↓
Normal Search
 ↓
No secret values exposed
```

And:

```text
Unlocked Vault
 ↓
Vault Search
 ↓
Metadata search works
```

---

# 90. TESTING — DATA ISOLATION

Verify:

```text
Global Search
Timeline
Today
Projects
Goals
Tasks
Notifications
Logs
```

do not expose Vault secret values.

---

# 91. TESTING — STORAGE INSPECTION

Inspect the local persistence files in a development environment.

Verify that sensitive values such as:

```text
Password
API Key
Recovery Code
Secure Note
```

do not appear as plaintext in the persistent database.

This test is mandatory.

---

# 92. TESTING — PLATFORM

Validate at minimum:

```text
Windows
Android
```

for:

```text
Unlock
Lock
Auto-lock
Persistence
Secure storage
Application restart
Background behavior
```

If one platform has security limitations, document them.

---

# 93. SECURITY REVIEW

Before declaring Phase 5 complete, perform a security-focused review.

Search the codebase for accidental exposure patterns:

```text
print(password)
debug(password)
log(secret)
apiKey in logs
masterPassword in state
plaintext password storage
plaintext recovery code storage
```

Also inspect:

```text
Database schemas
Serialization
JSON models
Error messages
Crash handling
Search indexing
Timeline
Notifications
Clipboard
```

---

# 94. DEPENDENCY REVIEW

Before adding cryptographic/security dependencies:

```text
Inspect package maturity
Inspect maintenance status
Inspect platform support
Inspect licensing
Inspect known security history where practical
```

Do not add random or unmaintained encryption packages simply because they are easy to use.

Document the chosen security-critical dependencies.

---

# 95. SECURITY DOCUMENTATION

Create:

```text
SECURITY_ARCHITECTURE.md
```

This document must explain:

```text
1. Threat Model

2. Security Boundary

3. Master Password Model

4. Key Derivation

5. Encryption

6. Key Management

7. Local Storage

8. Secure Platform Storage

9. Auto-lock

10. Biometric Unlock

11. Clipboard Handling

12. Search Isolation

13. Timeline Isolation

14. Logging Policy

15. Backup / Export

16. Password Change

17. Recovery Limitations

18. Known Platform Limitations

19. Known Security Limitations
```

Be honest about limitations.

---

# 96. THREAT MODEL

At minimum consider:

```text
Casual access to the computer
Someone opening OmniLife while unlocked
Someone accessing local database files
Application crash logs
Debug logs
Clipboard exposure
Screen previews
Backups / exports
Lost or stolen device
Repeated password attempts
```

The threat model does NOT need to guarantee protection against every possible attacker.

Clearly document what the Vault is designed to protect against.

---

# 97. SECURITY LIMITATION

The Vault is a local application.

Therefore:

```text
If the operating system itself is fully compromised,
the application cannot guarantee absolute secrecy.
```

Do not claim otherwise.

---

# 98. OFFLINE-FIRST REQUIREMENT

Phase 5 must remain local-first.

The Vault must work without:

```text
Internet
Cloud account
External server
Remote authentication
```

No sensitive information should leave the device in Phase 5.

---

# 99. NO TELEMETRY

Do not transmit Vault information to:

```text
Analytics
Crash services
External APIs
AI services
Cloud databases
```

No external service should receive:

```text
Passwords
API Keys
Recovery Codes
Secure Notes
Vault metadata
```

unless a future explicitly designed feature introduces such behavior.

---

# 100. IMPLEMENTATION ORDER

Do not implement everything in one uncontrolled generation.

Recommended sequence:

```text
Batch 1
Inspect architecture + security boundary

Batch 2
Vault data model + encrypted persistence design

Batch 3
Master Password + Key Derivation

Batch 4
Encryption / Decryption Layer

Batch 5
Vault Lock / Unlock

Batch 6
Vault Item CRUD

Batch 7
Categories + Search

Batch 8
Auto-lock + Session Security

Batch 9
Clipboard + Secret Visibility

Batch 10
Master Password Change

Batch 11
Platform Secure Storage / Biometric where appropriate

Batch 12
Global Search / Timeline isolation

Batch 13
Security Audit + Storage Inspection

Batch 14
Regression Testing + UI Polish
```

After every meaningful batch:

```text
Implement
 ↓
Analyze
 ↓
Test
 ↓
Security Review
 ↓
Continue
```

---

# 101. SCOPE CONTROL

If useful security features are discovered outside Phase 5:

DO NOT implement them automatically.

Record them in:

```text
PHASE_5_DEFERRED_FEATURES.md
```

Potential future features:

```text
Advanced encrypted export
Secure recovery key
TOTP authenticator
Passkey management
Password generator
Password health analysis
Breach monitoring
Secure file attachments
Cloud encrypted backup
Cross-device encrypted synchronization
```

These may become future enhancements.

---

# 102. ARCHITECTURAL ISSUES

If Phase 5 reveals limitations in earlier architecture:

Do not silently rewrite existing systems.

Document:

```text
Problem
Current behavior
Root cause
Security impact
Possible solutions
Recommended solution
Migration impact
```

If the issue creates a significant security risk:

```text
STOP
DO NOT CONTINUE IMPLEMENTATION OF THE AFFECTED FEATURE
DOCUMENT THE ISSUE
```

Security takes priority over completing the phase.

---

# 103. VALIDATION CHECKLIST

Before declaring Phase 5 complete:

```text
[ ] Vault exists
[ ] Vault has a security boundary
[ ] Master Password setup works
[ ] Master Password is never stored plaintext
[ ] Key derivation works
[ ] Encryption works
[ ] Integrity/authentication protection works
[ ] Sensitive fields are encrypted at rest
[ ] Vault format is versioned

[ ] Login items work
[ ] Secure Notes work
[ ] API Keys work
[ ] License Keys work
[ ] Recovery Codes work
[ ] Custom fields work

[ ] Categories work
[ ] Vault search works
[ ] Secret values are masked
[ ] Password reveal is temporary
[ ] Copy functionality works
[ ] Clipboard clearing works where supported

[ ] Lock works
[ ] Auto-lock works
[ ] App restart locks Vault
[ ] Background behavior is handled
[ ] Failed attempts are throttled appropriately

[ ] Master Password change works
[ ] Old password no longer unlocks Vault
[ ] New password unlocks Vault

[ ] Global Search does not expose secrets
[ ] Timeline does not expose secrets
[ ] Today does not expose secrets
[ ] Notifications do not expose secrets
[ ] Logs do not expose secrets

[ ] Persistent storage inspection confirms secrets are not plaintext
[ ] Windows tested
[ ] Android tested
[ ] Security documentation created
[ ] Dependency review completed

[ ] Phase 1 regression passes
[ ] Phase 2 regression passes
[ ] Phase 3 regression passes
[ ] Phase 4 regression passes

[ ] Static analysis passes
[ ] Tests pass
```

---

# 104. FINAL QUALITY CHECK

For Flutter projects, run:

```bash
flutter analyze
flutter test
```

Also validate all currently configured build targets.

Do not suppress analyzer warnings or errors merely to obtain a passing result.

---

# 105. IMPLEMENTATION REPORT

After completing Phase 5, create:

```text
PHASE_5_IMPLEMENTATION_REPORT.md
```

Include:

```text
1. Implementation Summary

2. Features Implemented

3. Files / Modules Changed

4. Vault Architecture

5. Master Password Architecture

6. Key Derivation

7. Encryption Architecture

8. Key Management

9. Persistent Storage

10. Platform Secure Storage

11. Authentication

12. Auto-lock

13. Clipboard Handling

14. Search Isolation

15. Timeline Isolation

16. Logging / Privacy Review

17. Dependency Review

18. Security Audit Results

19. Storage Inspection Results

20. Windows Test Results

21. Android Test Results

22. Phase 1 Regression Results

23. Phase 2 Regression Results

24. Phase 3 Regression Results

25. Phase 4 Regression Results

26. Known Issues

27. Known Security Limitations

28. Deferred Features

29. Recommended Next Phase
```

---

# 106. STOP CONDITION

When Phase 5 is complete:

**STOP.**

Do NOT automatically begin Phase 6.

Do NOT implement:

```text
AI Assistant
AI Financial Advisor
AI Study Assistant
Automatic Insights
Cloud Sync
Multi-user
Public Platform
```

Wait for human review.

The human must manually test the Vault before Phase 5 is considered accepted.

---

# 107. PHASE 5 SUCCESS CRITERIA

Phase 5 is successful when OmniLife can securely separate normal personal information from sensitive credentials.

The intended architecture is:

```text
NORMAL OMNILIFE DATA

Calendar
Tasks
Projects
Goals
College
Finance
Wishlist
Inventory
Notes
Knowledge
Timeline
        │
        ▼
Normal Local Persistence
```

while:

```text
                    SECURE VAULT

                 Master Password
                        ↓
                  Key Derivation
                        ↓
                  Secure Key State
                        ↓
                Authenticated Encryption
                        ↓
                Encrypted Vault Data
```

The user should be able to:

```text
Create Vault
      ↓
Create Secure Item
      ↓
Encrypt
      ↓
Store Locally
      ↓
Lock
      ↓
Restart OmniLife
      ↓
Unlock
      ↓
Decrypt
      ↓
Access Secret
```

without exposing sensitive data through the rest of OmniLife.

---

# 108. FINAL INSTRUCTION TO ANTIGRAVITY

Start by inspecting the current OmniLife workspace.

Read:

```text
Existing Architecture Documentation
PHASE_1_IMPLEMENTATION_REPORT.md
PHASE_2_IMPLEMENTATION_REPORT.md
PHASE_3_IMPLEMENTATION_REPORT.md
PHASE_4_IMPLEMENTATION_REPORT.md
Current Source Code
Current Data Models
Current Persistence Layer
Current Design System
Current Navigation
```

Then implement **ONLY OmniLife Phase 5** according to this specification.

Do not assume the project is empty.

Do not overwrite working Phase 1, Phase 2, Phase 3, or Phase 4 functionality blindly.

Do not implement future phases.

Do not introduce unrelated dependencies.

Do not invent cryptographic algorithms.

Do not invent security mechanisms when established libraries or platform facilities exist.

Do not silently change architecture.

Implement incrementally.

Test after every meaningful batch.

Perform explicit security review after implementing the Vault.

Inspect persistent storage to verify that sensitive values are not stored in plaintext.

If a security-critical decision is uncertain, STOP and document the issue rather than guessing.

At the end:

1. Create `SECURITY_ARCHITECTURE.md`.
2. Create `PHASE_5_IMPLEMENTATION_REPORT.md`.
3. Run validation and tests.
4. Perform regression testing.
5. STOP and wait for human review.
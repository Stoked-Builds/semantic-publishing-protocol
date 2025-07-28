# Data Delegation Specification

**File:** `specs/consent-engine/data-delegation.md`  
**Status:** Draft v0.1  
**SPP Component:** Consent Engine / Identity Layer

---

## Overview

This document defines how a user may **delegate specific powers or data access rights** to a trusted agent, app, or registry within the Semantic Publishing Protocol (SPP) ecosystem.

Delegation allows third parties to act **on the user's behalf**, with fine-grained, revocable permissions. This is critical to enable agent coordination, automated actions, or distributed data syncing — all without compromising user privacy or control.

---

## Core Concepts

### 🧾 Delegation Grant
A **signed permission object** where a user explicitly grants a delegate authority to act within certain bounds.

### 👤 Principal
The **user** who owns the SSOT identity and is granting access.

### 🛰️ Delegate
An **agent, registry, or service** receiving temporary authority.

### 🔐 Scope
Specific actions or data the delegate is permitted to perform or access.

---

## Delegation Format

Each delegation object includes:

| Field          | Type      | Description |
|----------------|-----------|-------------|
| `grant_id`      | UUID      | Unique ID of this delegation record |
| `ssot_id`       | string    | User identity granting the authority |
| `delegate_id`   | string    | Agent or registry receiving the authority |
| `scope`         | string[]  | List of permissions granted |
| `issued_at`     | datetime  | ISO 8601 timestamp of creation |
| `expires_at`    | datetime  | Optional expiry timestamp |
| `proof`         | object    | Digital signature or secure verification method |
| `delegated_by`  | string    | Could be `self`, another delegate, or organisation |
| `conditions`    | object    | Optional runtime constraints (e.g. hours, device ID, task limits) |

---

## Common Scopes

Example delegation scopes may include:

- `publish.content:create`
- `access.profile.read`
- `ads.preferences:update`
- `sync.audit-log:registry`
- `run.agent:auto-curation`
- `read.wallet.public_address`

---

## Runtime Enforcement

Agents and browsers must validate:
- The delegation is unexpired
- The scope includes the requested action
- No overriding revocation exists

They must **refuse** to act on behalf of any SSOT without a valid delegation.

---

## Revocation Model

- Users can revoke any delegation at any time via the Consent Engine.
- Revoked grants are logged in the **Consent Audit Log**.
- Delegates must check revocation status at regular intervals or before actioning.

---

## Example Delegation Payload

```json
{
  "grant_id": "de3f-2321-881f-a01c",
  "ssot_id": "user:markstokes",
  "delegate_id": "agent:get-stoked",
  "scope": ["publish.content:create", "ads.preferences:update"],
  "issued_at": "2025-07-28T21:50:00Z",
  "expires_at": "2025-08-28T21:50:00Z",
  "proof": {
    "type": "signature",
    "hash": "0xabc..."
  },
  "delegated_by": "self",
  "conditions": {
    "device": "0xMacbookMark",
    "region": "EU"
  }
}
```

---

## Future Extensions

| Phase | Feature                                     | Status     |
|-------|---------------------------------------------|------------|
| 0.1   | Manual delegation & basic scopes            | ✅ Drafted |
| 0.2   | Conditional delegation (runtime, geofence)  | 🔲 Planned |
| 0.3   | Cross-delegation (org -> agent -> registry) | 🔲 Planned |

---

## Related Specs

- [`trust-engine.md`](./trust-engine.md)
- [`consent-audit-log.md`](./consent-audit-log.md)
- [`ssot-id.md`](../identity/ssot-id.md)

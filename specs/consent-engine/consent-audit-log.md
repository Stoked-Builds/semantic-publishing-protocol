# Consent Audit Log Specification

**File:** `specs/consent-engine/consent-audit-log.md`  
**Status:** Draft v0.1  
**SPP Component:** Consent Engine

---

## Overview

The Consent Audit Log is a core component of the Consent Engine that ensures **every act of consent**, **data sharing**, or **data revocation** is **securely and transparently logged**.

This enables traceability, user control, and legal accountability across the Semantic Publishing Protocol (SPP) — particularly in privacy-first use cases governed by regulations such as GDPR, CCPA, and others.

---

## Key Properties

Every log entry MUST contain:

| field             | type      | description |
|------------------|-----------|-------------|
| `event_id`        | uuid      | Unique ID of the consent event |
| `ssot_id`         | string    | Subject’s Single Source of Truth ID |
| `actor_id`        | string    | Entity requesting or accessing data (user, agent, org) |
| `action`          | string    | One of `granted`, `revoked`, `queried`, `expired` |
| `consent_scope`   | string[]  | What data or capability was affected |
| `timestamp`       | datetime  | ISO 8601 UTC timestamp of the event |
| `method`          | string    | Means by which consent was given (UI, API, signature, etc.) |
| `expiry`          | datetime  | Optional expiry timestamp |
| `proof`           | object    | Signature, link to verification doc, or hash of agreement |
| `user_agent`      | string    | Optional browser or interface context |
| `ip_hash`         | string    | Optional, anonymised client IP hash |

---

## Data Scope Definitions

Typical `consent_scope` values may include:

- `profile.name`
- `profile.location`
- `preferences.ads`
- `history.search`
- `agent.marketing`
- `wallet.public_address`
- `content.upload:recipes/*`
- `access.token:thirdparty.app.xyz`

---

## Storage Rules

- Consent logs must be stored **locally by default**, encrypted.
- Users may optionally choose to replicate logs to a **trusted registry** for auditing or backup.
- Retention period defaults to **12 months**, configurable by the user.

---

## Revocation Behaviour

When a revocation event occurs:
- A new `revoked` log entry is created
- All systems using the original consent token must invalidate it
- The `proof` field should point to the revocation record or user command hash

---

## Trust + Transparency

- Users can view, export, and delete their own audit logs (within legal constraints).
- Systems may verify log entries to prove **data use legitimacy** to auditors or regulators.
- Agents/browsers must never act on data sharing events unless a valid consent log exists.

---

## Example Entry

```json
{
  "event_id": "2c59ad1f-b173-4b9d-950f-0d7f8a21c9ab",
  "ssot_id": "user:markstokes",
  "actor_id": "agent:get-stoked",
  "action": "granted",
  "consent_scope": ["profile.name", "preferences.ads"],
  "timestamp": "2025-07-28T21:00:00Z",
  "method": "UI-click",
  "expiry": "2026-07-28T21:00:00Z",
  "proof": {
    "type": "signature",
    "hash": "0xabcdef123456..."
  }
}
```

---

## Implementation Roadmap

| Phase | Feature                          | Status     |
|-------|----------------------------------|------------|
| 0.1   | Basic consent grant/revoke log   | ✅ Drafted |
| 0.2   | Export + verification interface  | 🔲 Planned |
| 0.3   | Encrypted syncing to registry    | 🔲 Planned |

---

## Related Specs

- [`trust-engine.md`](./trust-engine.md)
- [`data-delegation.md`](./data-delegation.md)
- [`ssot-id.md`](../identity/ssot-id.md)

# Data Access Protocol – Specification v0.1

## Purpose

The Data Access Protocol (DAP) defines how agents, services, and publishers can **request, verify, and access user data** within the Semantic Publishing Protocol (SPP) — always under **explicit, revocable user consent**.

This protocol ensures that:
- **Users own their master data**
- **No silent profiling or data leakage** occurs
- **Requests are formalised, signed, and traceable**

---

## Protocol Workflow

1. **Request Initiation**
   - An agent or service constructs a `DataAccessRequest` object
   - Must declare purpose, data type, retention policy, and attribution scope

2. **Consent Evaluation**
   - The request is passed to the Consent Engine
   - User or their Agent decides to approve, deny, or auto-grant based on rules

3. **Access Grant**
   - If approved, a time-bound, scope-limited `AccessToken` is issued
   - Token contains permissions, expiry, audit fingerprint

4. **Data Exchange**
   - Accessor retrieves data through secure, standardised APIs (e.g. `/spp/userdata`)
   - All access events are logged in local trust ledger

---

## DataAccessRequest Example

```json
{
  "type": "spp:DataAccessRequest",
  "requester": "agent:news-curator-v2",
  "data": ["interests", "query-history"],
  "purpose": "contextual article ranking",
  "retention": "session",
  "expiry": "2025-07-28T22:00:00Z"
}
```

---

## AccessToken Example

```json
{
  "type": "spp:AccessToken",
  "tokenId": "tok:82ff1e",
  "issuedTo": "agent:news-curator-v2",
  "grantedBy": "user:mark.stokes",
  "permissions": ["read:query-history", "read:interests"],
  "expires": "2025-07-28T22:00:00Z",
  "audit": {
    "reason": "semantic-ranking",
    "sourceRequest": "req:34beaa"
  }
}
```

---

## Core Design Principles

- ✅ **Consent-First** – No default access, ever
- 🔐 **Minimisation** – Only the minimum viable data for the task
- 🕵️ **Transparency** – Users can inspect, revoke, or simulate requests
- 🧠 **Local Trust Trail** – Each grant is logged and scoped

---

## Suggested API Pathing

| Method | Path | Purpose |
|--------|------|---------|
| POST   | `/spp/data-request` | Submits a request |
| GET    | `/spp/data-access/:tokenId` | Retrieves granted data |
| DELETE | `/spp/data-access/:tokenId` | Revokes access early |

---

## Related Files

- [`trust-engine.md`](../consent-engine/trust-engine.md)
- [`consent-engine.md`](../consent-engine/consent-engine.md)
- [`agent-authentication.md`](../identity/agent-authentication.md)
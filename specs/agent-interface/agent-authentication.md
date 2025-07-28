# Agent Authentication – Specification v0.1

## Overview

In the Semantic Publishing Protocol (SPP), agents are autonomous software entities acting on behalf of users or publishers. To ensure privacy, trust, and accountability, all agents must be able to authenticate themselves across the ecosystem.

This spec defines how agents identify, verify, and maintain secure, revocable relationships with other entities — including users, publishers, registries, and AI browsers.

---

## Agent Identity

Each agent is assigned a **decentralised identifier (DID)** at creation.

Example:
```
did:spp:agent:8932abcdef123
```

Agents MAY be tied to:
- A user (personal assistant)
- A content publisher (auto responder or syndication agent)
- An organisation (discovery or registry agent)
- A content object (autonomous content broker)

---

## Authentication Mechanisms

Agents authenticate via a combination of:

### 1. DID Document & Public Key
- Each agent exposes a DID document with a current public key.
- Browsers, registries, and services validate signatures via this key.

### 2. Mutual Key Verification (handshake)
- Agents and recipients may establish secure sessions using key exchange.
- Optional for long-term relationships.

### 3. Registry Lookup
- Agents may optionally publish their DID to a trusted registry for discoverability.
- Trust levels may vary based on registry reputation.

---

## Authentication Use Cases

| Use Case                          | Required Auth Method           | Notes                                      |
|----------------------------------|--------------------------------|--------------------------------------------|
| User Agent Sync (multi-device)   | DID + Key Exchange             | Encrypted memory sync between devices      |
| Publisher Agent Verification     | DID + Registry Signature       | To prevent spoofing of brand agents        |
| Ad Agent Submission              | Signed Payload + DID Proof     | Ensures traceability and rate-limiting     |
| Discovery Requests               | Anonymous or DID Optional      | For privacy-preserving discovery queries   |
| Consent Access Requests          | DID + User Approval            | Required for requesting user data access   |

---

## Revocation & Rotation

- Agents MUST support key rotation (e.g., every 90 days)
- Revocation of keys or full DID must be possible via local user browser
- Compromised agents must be flagged and quarantined via registry

---

## Privacy Considerations

- Agents SHOULD minimise transmission of identifiable data
- Ephemeral DIDs or aliases MAY be used for specific tasks
- DID resolution SHOULD be rate-limited and privacy-preserving

---

## Future Extensions

- OAuth-style delegation between agents
- Hardware-bound DID support
- Multi-signature agent approvals (e.g. for legal entities)

---

## Related Specs

- [`agent-rating.md`](./agent-rating.md)
- [`trust-engine.md`](../consent-engine/trust-engine.md)
- [`query-resolution.md`](./query-resolution.md)
- [`ssot-id.md`](../identity/ssot-id.md)
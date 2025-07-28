
# Identity Verification Specification

**File:** `specs/identity/identity-verification.md`  
**Status:** Draft v0.1  
**SPP Component:** Identity Layer

---

## Overview

This document defines the standards and mechanisms for verifying the identity of actors within the Semantic Publishing Protocol (SPP) ecosystem — including users, agents, publishers, registries, and advertisers.

The goal is to support trust-based interactions and data sharing without mandating any specific verification provider or method. The protocol allows for decentralised, multi-method identity proofing while ensuring traceability and revocability.

---

## Verification Types

Each identity may be verified by one or more of the following methods:

### 🔐 1. Email Verification
- Standard email confirmation loop.
- Signed timestamp from verification provider.
- Common for anonymous or pseudonymous usage.

### 📱 2. Phone Verification
- SMS code or call-back validation.
- Supports real-world identity correlation.

### 🧾 3. Government-issued ID
- Via KYC providers (e.g. Stripe Identity, Onfido).
- Must comply with regional data retention/privacy rules.

### 👛 4. Wallet Address Verification
- User signs a nonce with their wallet (e.g., Ethereum).
- Provides decentralised identity binding.
- Can be tied to crypto transactions or agent payment flows.

### 🌐 5. Social Verification
- Connect and confirm identity via known social media platforms.
- Allows "web of trust" reputation systems.
- Links are revocable at any time.

### 🧠 6. Behavioural Consistency
- (Optional) Long-term agents may be granted identity weight based on:
  - Behavioural signature
  - History of helpfulness, trust, and aligned output
  - AI-authenticated consistency

---

## Verification Score

Every verified identity is assigned a **Verification Score**, comprised of:
- Number of methods passed
- Freshness of verification
- Weight of method (e.g., gov ID > email)
- Optional: community endorsements

This score is readable via the **Trust Engine** and can be used by agents or browsers to determine whether to:
- Trust the actor
- Request additional verification
- Restrict or limit data interactions

---

## Revocation and Expiry

- Verification tokens must include expiration dates.
- Consent Engine must maintain a revocation log and verification history.
- Users can view and revoke any linked method at any time.

---

## Privacy Principles

- Only hashed/verifiable claims are stored in registries.
- Full identity data is retained **only locally** or by the user-chosen provider.
- No centralised SPP identity vault exists by design.

---

## Example Verification Payload

```json
{
  "ssot_id": "user:markstokes",
  "methods": [
    { "type": "email", "status": "verified", "timestamp": "2025-07-28T18:32:00Z" },
    { "type": "wallet", "address": "0xABCD...", "verified": true }
  ],
  "score": 82,
  "last_updated": "2025-07-28T18:35:00Z"
}
``` 

---

## Implementation Roadmap

| Phase | Feature                                     | Status     |
|-------|---------------------------------------------|------------|
| 0.1   | Email, Wallet, Phone                        | ✅ Drafted |
| 0.2   | Behavioural Signature + Revocation Registry | 🔲 Pending |
| 0.3   | Agent Auth + Linked Trust Signals           | 🔲 Pending |

---

## Related Specs

- [`ssot-id.md`](./ssot-id.md)
- [`consent-engine.md`](./consent-engine.md)
- [`trust-engine.md`](../consent-engine/trust-engine.md)
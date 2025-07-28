# Privacy Principles – Semantic Publishing Protocol (SPP)

This document defines the core privacy principles that underpin the SPP ecosystem. It is intended to guide implementers, contributors, and auditors in building privacy-respecting, user-centric systems.

---

## 1. User Control
- Users have full control over their identity, data, and consent preferences at all times.
- All data sharing is opt-in, granular, and revocable.

## 2. Local-First Data
- Personal data is stored and processed locally by default (e.g., in the AI browser or agent).
- Cloud or third-party access requires explicit, auditable consent.

## 3. Data Minimization
- Only the minimum necessary data is collected, processed, or shared for any given purpose.
- Agents and services must justify all data requests and log them for user review.

## 4. Transparency
- All data flows, consent grants, and third-party accesses are visible and auditable by the user.
- Users can review, export, and delete their data at any time.

## 5. Privacy by Design
- Privacy is embedded into all protocol layers, from content structure to payments and registry operations.
- Default settings favor privacy and user agency.

## 6. No Unconsented Tracking
- No tracking, profiling, or behavioral analytics without explicit user consent.
- Ads and recommendations are intent-aligned, not surveillance-based.

## 7. Secure Sharing
- All data sharing is encrypted, signed, and time-bounded.
- Consent tokens and access grants are cryptographically verifiable. See [Consent Engine](../identity/consent-engine.md).

## 8. Right to Be Forgotten
- Users can delete their data, revoke consent, and remove their identity from registries at any time.
- Deletion requests are honored across all participating agents and registries.

---

_See also: [Security Model](./security-model.md), [Consent Engine](../identity/consent-engine.md), [SSOT-ID](../identity/ssot-id.md)_

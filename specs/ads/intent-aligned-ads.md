
# Intent-Aligned Ads – Specification v0.1

## Purpose [Informative]

This document defines the requirements and structure for intent-aligned advertising in the Semantic Publishing Protocol (SPP). Intent-aligned ads are delivered based on user context, declared preferences, and agent-driven relevance, with a focus on privacy and user control.

---

## Core Concepts [Normative]

- **Intent Matching**: Ads are selected based on explicit user queries, recent activity, and declared interests.
- **Consent-Driven Delivery**: No ad is shown without user or agent consent.
- **Transparent Bidding**: All ad placements are subject to auditable, real-time auctions.
- **Fair Compensation**: Users and publishers are compensated for ad engagement via micro-payments.

---

## Related Specs [Informative]

- [`ad-auction-engine.md`](./ad-auction-engine.md)
- [`saturation-penalty.md`](./saturation-penalty.md)
- [`ad-ranking-engine.md`](./ad-ranking-engine.md)
- [`micro-payments.md`](../payments/micro-payments.md)
- [`payment-adapter-contract.md`](../payments/payment-adapter-contract.md)
- [`spp-token-roadmap.md`](../payments/spp-token-roadmap.md)
- [`trust-engine.md`](../consent-engine/trust-engine.md)
- [`semantic-blocks.md`](../publishing/semantic-blocks.md)

**Back-link:**
- [`agent-rating.md`](../agent-interface/agent-rating.md)

> _"Ad auctions, payments, and token flows are defined in the related specs above. For future compliance features, see: `compliance-matrix.md` (not yet implemented)."_

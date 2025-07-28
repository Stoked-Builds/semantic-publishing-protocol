
# Ad Auction Engine Specification

**File:** `specs/ads/ad-auction-engine.md`  
**Status:** Draft v0.1  
**SPP Component:** Ads / Payments / Trust

---

## Purpose

The Ad Auction Engine governs how intent-aligned ads are selected, ranked, and priced when surfaced to users via AI browsers or agents. This engine ensures **fairness**, **relevance**, and **privacy** in ad delivery.

---

## Auction Mechanics

Each ad slot or surfacing opportunity undergoes a **real-time multi-factor auction**:

### 1. Bid Components

| Field             | Type     | Description |
|------------------|----------|-------------|
| `max_bid`         | number   | Max amount advertiser is willing to pay |
| `target_profile`  | object   | Desired user traits (interests, intent) |
| `weighting_strategy` | enum | `relevance-first`, `bid-first`, or `hybrid` |
| `saturation_penalty` | bool | Enables lower priority for over-exposed users |
| `ad_score`        | float    | Calculated during auction |

---

### 2. Relevance Score

The system assigns a **relevance score** to each ad per user:

- Matches query/topic: 0.0–1.0
- Matches recent activity/memory: 0.0–1.0
- Matches opt-in profile tags: 0.0–1.0

Final `relevance_score = weighted average` of the above.

---

### 3. Final Ad Score

```text
ad_score = (relevance_score * relevance_weight) + (normalised_bid * bid_weight) - saturation_penalty
```

- All scores normalised between 0–1
- Weights configurable by user and policy

---

### 4. Outcomes

- Highest `ad_score` wins the placement
- Runner-ups used as alternates or stacked in carousels
- Full auction log (excluding PII) optionally logged for auditing

---

## Privacy Considerations

- Advertisers do **not** receive user identity or profile details
- All matching happens locally or via privacy-preserving proxies
- Advertisers may receive **aggregated, anonymised campaign stats**

---

## Future Ideas

| Feature                        | Status |
|-------------------------------|--------|
| Cryptographic fairness proofs | 🔲     |
| Bidding pools per vertical    | 🔲     |
| Carbon score weighting        | 🔲     |

---


## Related Specs

- [`intent-aligned-ads.md`](./intent-aligned-ads.md)
- [`ad-ranking-engine.md`](./ad-ranking-engine.md)
- [`ad-compliance.md`](./ad-compliance.md)
- [`micro-payments.md`](../payments/micro-payments.md)
- [`payment-adapter-contract.md`](../payments/payment-adapter-contract.md)
- [`spp-token-roadmap.md`](../payments/spp-token-roadmap.md)
- [`trust-engine.md`](../consent-engine/trust-engine.md)
- [`semantic-blocks.md`](../publishing/semantic-blocks.md)

> _"Ad auction outcomes, payments, and trust signals are defined in the related specs above. For future compliance features, see: `compliance-matrix.md` (not yet implemented)."_

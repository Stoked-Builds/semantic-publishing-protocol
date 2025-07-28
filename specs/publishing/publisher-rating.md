
# Publisher Rating Protocol

**File:** `specs/publishing/publisher-rating.md`  
**Status:** Draft v0.1  
**SPP Component:** Trust / Discovery / Publishing

---

## Purpose

Enable a decentralised system for rating **publishers** based on their trustworthiness, reliability, and ethical standards — to assist users and agents in filtering content.

---

## Dimensions of Rating

| Dimension           | Description |
|---------------------|-------------|
| Accuracy            | Historically factual and correct content |
| Transparency        | Clear sourcing and editorial processes |
| Bias                | Not excessively partisan or manipulative |
| Responsiveness      | Corrects or removes bad content promptly |
| Community Rating    | Aggregate end-user trust score |
| Registry Reputation | Trust score within known registries |

---

## Data Structure

```json
{
  "publisher_id": "pub://stoked-news.io",
  "overall_score": 0.82,
  "community_votes": 5421,
  "last_updated": "2025-07-28",
  "dimensions": {
    "accuracy": 0.87,
    "bias": 0.78,
    "transparency": 0.9
  }
}
```

---

## Voting Mechanism

- Users rate publishers via browser/agent UI
- Votes are cryptographically signed and timestamped
- Votes may be aggregated in trust registries

---


## Privacy & Abuse Prevention

- Voting is optional and pseudonymous
- Bots or repeat submissions from same device disallowed
- Reputation scores decay over time unless reinforced

---

## Related Specs

- [`publisher-metadata.md`](./publisher-metadata.md)
- [`review-chain.md`](./review-chain.md)
- [`semantic-blocks.md`](./semantic-blocks.md)
- [`trust-engine.md`](../consent-engine/trust-engine.md)
- [`agent-rating.md`](../agent-interface/agent-rating.md)
- [`micro-payments.md`](../payments/micro-payments.md)
- [`payment-adapter-contract.md`](../payments/payment-adapter-contract.md)

> _"Publisher ratings are referenced by trust, attribution, and payment systems. See related specs for integration details."_

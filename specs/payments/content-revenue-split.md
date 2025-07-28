# Content Revenue Split – Specification v0.1

## Purpose

This document defines how **registry entries** and **content blocks** can declare revenue splits or royalty allocations. This ensures fair compensation for authors, media creators, remixers, and AI assembly contributors — even when content is dynamically assembled or embedded across experiences.

---

## Use Cases

- Articles containing embedded video or music
- Multi-author collaborative content
- AI-generated summaries using licensed content
- Pay-per-view archives or exclusive media
- Chain-of-custody for royalty distribution in agent remixing

---

## Metadata Format

Revenue splits are declared using a `splits` array embedded in either:

- the registry entry metadata, or
- the `content-block` header object

Each entry MUST include:

```json
{
  "splits": [
    {
      "recipient": "wallet_or_account_id",
      "share": 0.50,
      "role": "author|producer|remixer|publisher",
      "constraints": {
        "minAmount": "0.01",
        "usageType": "stream|download|remix|summarise",
        "expiry": "2026-01-01T00:00:00Z"
      }
    },
    ...
  ]
}
```

---

## Definitions

| Field        | Description                                                             |
|--------------|--------------------------------------------------------------------------|
| `recipient`  | Unique wallet, account, or ID representing the payee                     |
| `share`      | Decimal (0.0–1.0) portion of proceeds attributed                         |
| `role`       | Semantic role (author, curator, translator, etc.)                        |
| `constraints`| Optional conditions (e.g. only if content is remixed or AI-used)         |

**Note**: Splits MUST add up to ≤ 1.0. Any remainder may be treated as unallocated or absorbed by the registry operator or aggregator platform.

---

## Examples

### 1. Single Author Article

```json
{
  "splits": [
    {
      "recipient": "user:0xMarkStokes",
      "share": 1.0,
      "role": "author"
    }
  ]
}
```

### 2. Collaborative Video Article

```json
{
  "splits": [
    { "recipient": "wallet:0xAlice", "share": 0.4, "role": "writer" },
    { "recipient": "wallet:0xBob", "share": 0.3, "role": "voiceover" },
    { "recipient": "wallet:0xEve", "share": 0.2, "role": "editor" },
    { "recipient": "wallet:0xSPSRegistry", "share": 0.1, "role": "registry" }
  ]
}
```

---

## Enforcement & Payout Flow

- Payment adapters MUST support split dispatch using the `splits` array
- AI Agents are required to propagate or merge splits across composite outputs
- Each split participant receives a `PaymentReceipt` from the payment adapter
- Consent Engine ensures user approval before executing payouts with splits

---

## Future Extensions

- Chainable split contracts for layered remixing
- Reputation-weighted splits (e.g. based on popularity or trust)
- Registry-curated defaults per media type

---

## Related Files

- [`micro-payments.md`](./micro-payments.md)
- [`registry-and-discovery.md`](./registry-and-discovery.md)
- [`agent-behaviour.md`](./agent-behaviour.md)
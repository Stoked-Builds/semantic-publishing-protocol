# SPP Token Roadmap – Semantic Publishing Protocol

## Purpose

This document outlines the long-term vision and staged considerations for introducing a native token within the Semantic Publishing Protocol (SPP) — provisionally named `SPX`.

The goal is to offer a stable, privacy-preserving, and user-controlled medium for micro-transactions, revenue distribution, and incentive alignment across agents, publishers, and users.

---

## Guiding Principles

- **User-first ownership**: Users retain full control over wallets, consent, and payment preferences.
- **Volatility resistance**: SPX must be pegged to a stable real-world asset or currency.
- **Open governance**: Token policy, inflation (if any), and fees should be managed by an open consortium or DAO.
- **Neutral utility**: SPX must not preference any vendor or platform — only utility and alignment.

---

## Timeline & Phases

### 📦 Phase 0 — Adapter-Friendly Architecture
- Modular micro-payments spec (✅ complete)
- Wallet-agnostic adapter system
- Optional usage of fiat and existing stablecoins (e.g. USDC, EURC)

### 🚀 Phase 1 — Token Design & Testnet
- Draft SPX token specification
- Evaluate existing platforms (Ethereum L2, Cosmos SDK, Substrate)
- Launch internal sandbox for SPX-based test payments
- Define off-chain to on-chain bridges (optional)

### 🔐 Phase 2 — Privacy & Consent Layers
- Integrate SPX into Consent Engine
- Ensure zero-knowledge payment capabilities or shielding options
- Local custody by default (no centralised accounts)

### 🌍 Phase 3 — Mainnet Launch (Optional)
- Launch SPX token + validator set or sequencer
- Offer on-ramps and off-ramps via fiat or stablecoins
- Governance by SPP foundation, community, or partner orgs

---

## Technical Requirements

- **Peg mechanism**: Reserve-backed, algorithmic, or hybrid peg to fiat
- **Chain selection**: Ethereum L2, Cosmos, Substrate, or purpose-built L1
- **Payment adapter**: SPX-compliant adapter implementing core SPP interface
- **Escrow and split contracts**: For multi-agent, multi-party revenue flows

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Regulatory uncertainty | Launch as utility token with strict privacy and local storage |
| Speculation | Pegged, non-inflationary supply, avoid public exchanges early |
| Adoption drag | Offer SPX as one of many adapters — don’t lock anyone in |
| Abuse / spam agents | Trust Engine ties payment intent to trust-weighted behavior |

---

## Strategic Options

- **Closed-loop Points System**: Launch off-chain credits first
- **Pre-mined Reserve**: Allocate a fixed pool of SPX for ecosystem growth
- **Reward Mechanism**: Let users earn SPX through participation or viewing intent-aligned ads

---

## Current Status

The SPP architecture is compatible with SPX as a future adapter. No token contracts exist yet. The community will be consulted before any economic model is introduced.

---

## Next Steps

1. Monitor adoption of fiat and stablecoin-based payments in SPP
2. Draft `spx-token.md` (technical specification)
3. Evaluate candidate blockchain platforms
4. Engage with open-source monetary and privacy experts
---

## Related Specs

- [`micro-payments.md`](./micro-payments.md)
- [`payment-adapter-contract.md`](./payment-adapter-contract.md)
- [`intent-aligned-ads.md`](../ads/intent-aligned-ads.md)
- [`ad-auction-engine.md`](../ads/ad-auction-engine.md)
- [`trust-engine.md`](../consent-engine/trust-engine.md)
- [`semantic-blocks.md`](../publishing/semantic-blocks.md)

> _"SPX token design is intended to integrate with SPP's micro-payments, adapters, and trust-weighted payment flows. See related specs for implementation and roadmap details."_
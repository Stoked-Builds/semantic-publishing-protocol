# Fair Ad Revenue Sharing (FARS) Model
**Version:** 0.1  
**Status:** Final  
**Date:** 2025-07-28  
**Part of:** [Intent-Aligned Ads (IAA)](intent-aligned-ads.md) in [SPP](../spp/protocol-overview.md)

---

## 💸 Purpose

The Fair Ad Revenue Sharing (FARS) model distributes advertising revenue across all meaningful contributors in the user-attention ecosystem.

This replaces the traditional model where ad platforms hoard revenue while users and creators receive nothing.

---

## 🧠 Core Principles

- **User-Focused**: Users are compensated for attention, consent, and contextual relevance.
- **Creator-Supported**: Content publishers receive fair share when their content primes or delivers context.
- **Agent-Sustained**: AI browsers and semantic agents receive operational funding.
- **Open and Transparent**: Revenue splits are deterministic, auditable, and community-verifiable.

---

## 📊 Default Split – Example (CPC = £0.10)

| Recipient              | Share   | Notes                                                        |
|------------------------|---------|--------------------------------------------------------------|
| 🎯 User                | £0.04   | For attention, relevance match, and active consent           |
| 📝 Content Creator     | £0.03   | For hosting triggering or supporting content                 |
| 🤖 AI Agent / Browser  | £0.02   | Covers infra, compute, ongoing agent operation               |
| 🗂 SPP Ecosystem Fund  | £0.01   | Supports open tooling, protocol evolution, validator funding |

Total: **£0.10** — fully accounted for.

### Split Variants

| Variant       | Change                                                                      |
|---------------|-----------------------------------------------------------------------------|
| **CPM**       | Same split but scaled to impressions rather than clicks                     |
| **CPA**       | Creator and user shares increase if content leads to confirmed purchase     |
| **Community Tip** | User opts to donate portion or all of their share to another party       |

---

## 🔍 Attribution Mechanism

Attribution is based on:

- **Context Weighting**: Which SPS-marked entities contributed to ad match
- **Engagement Depth**: Scroll depth, dwell time, interaction
- **`ad_context_attribution` Flag**: Mark SPS content with relevance metadata

Example:
```json
{
  "sps_type": "article",
  "title": "Mastering ADHD with Structured Task Design",
  "ad_context_attribution": true
}
```

Attribution does **not** require cookies or personal tracking — only local semantic context.

---

## 📥 User Compensation Flow

1. Ad match occurs, user gives consent (automated or explicit)
2. Microcredit is issued and logged (locally or via wallet)
3. Payouts accrue and can be:
   - Withdrawn to wallet
   - Donated to creator
   - Redirected to public-interest funds

Optional integration with:
- SSOT Wallets
- `focusmode.local` banking plugins
- On-chain or off-chain community pools

---

## 🤝 Creator Onboarding & Claims

Creators must:
- Register public wallet or receiving address
- Verify domain/content ownership (via DNS TXT or SPS claim tokens)
- Optionally link profile in their SSOT

They may also:
- Define preferred revenue splits
- Claim past earnings via content hashing & retroactive audit

---

## 🧮 Customisable Revenue Rules

FARS splits are not fixed per protocol — users and creators can define personal overrides.

For example:
```json
"override_splits": {
  "user": 0.30,
  "creator": 0.60,
  "agent": 0.05,
  "ecosystem": 0.05
}
```

These can be enforced via browser settings, agent config, or smart contract.

---

## 🔐 Privacy & Integrity

- Attribution is **contextual**, not behavioural
- Consent is always required and tied to `ssot-id`
- Payout tokens and logs can be anonymised by default
- Smart contracts or ledgers can provide split validation and proof

---

## 🛠 Roadmap

- Public dashboards of FARS flow
- Live payout APIs for agents
- Tiered incentives for underrepresented creators
- Optional integration with SPP trust scores and ad fairness indexes

---

The FARS model puts **humans, not platforms**, at the centre of ad economics.  
No more silent harvesting. No more invisible labour.  
**Consent earns compensation. Context earns credit.**


# Semantic Publishing Protocol (SPP) – Overview
**Version:** 0.1  
**Status:** Final  
**Date:** 2025-07-28  
**Code Name:** The Stoked Protocol  
**Spec Code:** SPS v0.1 + SPP v0.1

---

## 🌐 What is SPP? [Informative]

The Semantic Publishing Protocol (SPP) defines a modern, AI-native web architecture that **decouples content from pages** and delivers fully contextual, user-owned digital experiences.

It is the open protocol backbone of **AI Browsers**, **Sovereign User Profiles**, **Intent-Aligned Ads**, and **Dynamic Content Assemblers**.

SPP allows websites, individuals, and AI agents to **publish, discover, consume, and monetise** semantically structured content in ways that benefit **users first**.

---

## 🧱 Protocol Layers [Normative]

| Layer | Spec | Description |
|-------|------|-------------|
| **SPS** | `sps-*` | Semantic Publishing Specification — how structured content is defined |
| **SPP** | `spp-*` | Protocol definitions — discovery, identity, consent, agents |
| **IAA** | `intent-aligned-ads.md` | Ad delivery protocol based on consent, context, and user value |
| **FARS** | `fars-split.md` | Revenue distribution model among users, creators, agents |

---

## 🔁 Key Principles [Normative]

- **Users Own Their Identity** (via `ssot-id`)
- **Consent is Granular and Verifiable**
- **Content is Modular and Structured**
- **Ads Are Aligned, Not Imposed**
- **Focus Mode Is Respected**
- **Agents Work On Your Behalf, Not Against You**

---

## 🔑 Roles in the Ecosystem [Normative]

| Role        | Description |
|-------------|-------------|
| **User** | A person with a sovereign SSOT identity and local agent |
| **Creator** | Any individual or entity publishing SPS-tagged content |
| **Agent** | AI-powered interface that interacts with content on behalf of the user |
| **Advertiser** | Entity promoting content/products using IAA-compliant ads |
| **AI Browser** | The orchestrating layer that builds dynamic views from SPS content |
| **Validator** | Optional network participant that validates attribution and split logic (optional web-of-trust or smart contract verifier) |

---

## 🧭 Workflow Snapshot [Informative]

<!-- Note: This section provides an example workflow for illustration purposes -->

```
[User] ←→ [SSOT Agent] ←→ [AI Browser]
                        ↓
              [SPS Documents] ←→ [Web / P2P]
                        ↓
          [IAA Ads] ←→ [FARS Split Engine]
```

1. User queries → AI Browser assembles content
2. Browser checks consent and focus mode
3. Agents evaluate context and eligibility for IAA ads
4. Ads are injected (if permitted), revenue is shared
5. All logic is logged locally or optionally with validator nodes

---

## 🗺 Future Compatibility [Informative]

SPP is designed to evolve. Future extensions include:

- Decentralised content registry (IPFS, Ceramic, DNSLink)
- Verified creator networks with reputation scoring
- Intent/Context chaining across browsing sessions
- AI-native markup languages (e.g. JSONLD for dynamic knowledge trees)

---

## 🤝 Governance [Normative]

SPP is governed by the open community.

Proposals and spec changes are submitted via GitHub pull requests using the [`spp-rfc-*`](../../rfcs/) format.  
Versioning follows [Semantic Versioning 2.0](https://semver.org/).

---

## 🔥 Why It Matters [Informative]

SPP is a **rebellion against platform monopolies**, a blueprint for an ethical, AI-integrated web where users regain control, creators get rewarded fairly, and context—not surveillance—drives value.

This isn’t the death of the web.  
It’s its **awakening**.


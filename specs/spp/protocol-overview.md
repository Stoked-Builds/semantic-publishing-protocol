# Semantic Publishing Protocol (SPP) – Protocol Overview
**Version:** 0.1  
**Status:** Draft  
**Date:** 2025-07-27  
**Codename:** The Stoked Protocol

---

## 🌐 What Is SPP?

The Semantic Publishing Protocol (SPP) is a foundational framework for the **next evolution of the web** — where AI browsers dynamically assemble, personalise, and present content **based on user intent, consent, and context**.

It redefines how websites are published, how ads are delivered, and how **humans, machines, and content** interact.

---

## 🧱 Core Components

| Layer | Spec | Purpose |
|-------|------|---------|
| 📦 SPS | [`semantic-publishing-specification.md`](../sps/semantic-publishing-specification.md) | Describes how content is annotated, structured, and exposed |
| 🧠 Consent Engine | [`consent-engine.md`](../sps/consent-engine.md) | Manages data access, revocation, and user agency |
| 💰 FARS | [`fars-split.md`](../ads/fars-split.md) | Fair ad revenue distribution to users, creators, agents |
| 📉 SPSat | [`saturation-penalty.md`](../ads/saturation-penalty.md) | De-ranks irrelevant ads over time to protect attention |
| 🧩 HTML Adapter | [`sps-html.md`](../sps/sps-html.md) | Enables legacy websites to integrate SPS metadata easily |

---

## 🤖 Who Consumes It?

SPP is designed for:

- **AI-first web browsers** (agent-based or user-operated)
- **Voice assistants**, **smart interfaces**, **MR devices**
- Search engines and intent-based navigation layers
- Any tool that surfaces web content to users dynamically

---

## 🧠 Key Principles

1. **User-Controlled**: No tracking without consent. All identity is owned by the individual.
2. **Composable**: Pages are built on-demand from multiple trusted sources.
3. **Agent-Aware**: Designed for LLMs, not just humans.
4. **Fair**: Attention is a currency — users are compensated for theirs.
5. **Open**: The spec is public, extensible, and governed by community.

---

## 🧬 SPP vs Traditional Web

| Feature | Traditional Web | Semantic Publishing Protocol |
|--------|------------------|------------------------------|
| Page Structure | Static HTML/CSS | Dynamic, context-generated |
| Identity | Fragmented across sites | Unified SSOT-ID |
| Ads | Platform-owned, opaque | User-controlled, fair-split |
| Privacy | Implicit tracking | Explicit consent |
| Discoverability | SEO-based | Intent-matched & tagged |
| Revenue | Centralised to platform | Distributed to contributors |

---

## 📡 Example Workflow

1. User makes a query or triggers context ("healthy meals for ADHD")
2. AI browser queries SPS-tagged content from multiple sources
3. Agent assembles and summarises content
4. Relevant ads are selected based on consent + preferences
5. Revenue is shared with user, creator, agent, and fund
6. Consent, views, and feedback are logged locally

---

## 🔧 Developer Adoption

To adopt SPP:
- Tag your content with SPS metadata
- Provide optional consent endpoints
- Join the SPP Ecosystem Registry (coming soon)
- (Optional) Submit plugins, UI components, or browser agents

---

## 🌱 Versioning & Evolution

SPP is versioned like a living standard.  
All updates follow semantic versioning and changelogs.  
Governance is open-source and community-driven.

---

## 💡 Who Should Care?

- Users tired of being tracked
- Creators seeking sustainable reach
- Developers building the next generation of interfaces
- Ethical advertisers
- Platform founders who want to build *with* users, not *on* them

---

The Protocol is not a product.  
It's a **philosophy** embedded in code —  
Reclaiming the web as a tool for people, not platforms.


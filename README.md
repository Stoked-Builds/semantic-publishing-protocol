# 🕸️ The Semantic Publishing Protocol (SPP)

> ✨ A modular, agent-aware, AI-native standard to make the web speak again — with memory, meaning, and consent.

---

![hero-image](./assets/hero-browser-rebuilds-the-web.gif)

---

## 🔥 Imagine This

You open your browser — and the **entire web reshapes itself around you**.

- Every page tailors its layout, content, and logic to *your* preferences.
- Ads? They're made for you. And when you engage, **you get paid**.
- AI agents don’t just read pages. They **collaborate** with them — intelligently, contextually, respectfully.

> This isn’t the future. This is what the **Semantic Publishing Protocol (SPP)** enables.

---

## 😬 But There’s a Catch

AI agents are **devouring the web** without giving back.

📉 Page views are dropping.  
💸 Ad revenue is vanishing.  
🧠 AI is learning… but creators are starving.  
We call this the **AI Starvation Loop**.

[Read more](https://medium.com/@mark_stokes/the-ai-starvation-loop-how-ai-is-starving-the-web-and-what-we-can-do-about-it-e0e567f13ad4)

> Left unchecked, it will collapse the content economy — and take AI quality down with it.

---

## 🧩 So We Built a Fix

SPP gives the web a **semantic nervous system**:

✅ **Agent-aware content**: Machines know what they’re reading — and how to behave  
✅ **Memory**: Pages and agents share context (ethically and transparently)  
✅ **Consent and attribution**: Users and creators stay in control  
✅ **Monetisation hooks**: Embed revenue rules, track engagement, reward participation

It’s not just a protocol — it’s a new **economic and semantic contract** between humans, AI, and the web.

---

## 🛠️ Try It

### 🧪 [Run the Validator](#)
Validate content against the SPP schema and see what machines will understand.

### 🔍 [Explore Semantic Markup](#)
Compare regular HTML vs. SPP-enhanced artefacts.

### 🎥 [Watch the Concept Video](./assets/overview.mp4) *(Coming Soon)*

---

## 🚀 Why This Matters

The current web was built for **humans with eyeballs**.

But the new web — the one being read by AI — needs **meaning, memory, and boundaries**.

SPP is the protocol that makes that shift not only possible… but survivable.

---

## 📚 What’s Inside


- `specs/` – Formal spec documents (modular, evolving)
- `examples/` – Real content using SPP markup
- `tools/` – Validation tools and utilities
- `docs/` – Intro guides, vision, and reasoning

---

## 🗺️ Specification Navigation Map

### 🎯 Start Here - Foundation Documents

| Document | Type | Description | Dependencies |
|----------|------|-------------|--------------|
| **[QUICKSTART Guide](docs/QUICKSTART.md)** | **REQUIRED** | Complete walkthrough from submission to output | None |
| **[SPS-Core](specs/SPS-Core.md)** | **REQUIRED** | Core entities and data structures (Document, Claim, Entity) | None |
| **[SPS-Compliance](specs/SPS-Compliance.md)** | **REQUIRED** | Compliance levels and conformance requirements | SPS-Core |
| **[System Flow Diagram](docs/overview/system-flow-diagram.md)** | **REQUIRED** | End-to-end processing flow visualization | None |

### 📋 Core Specifications (Required for Implementation)

| Category | Document | Description | Dependencies |
|----------|----------|-------------|--------------|
| **Publishing** | [Semantic Blocks](specs/publishing/semantic-blocks.md) | Structure for semantic content markup | SPS-Core |
| **Publishing** | [Content Attribution](specs/spp/content-attribution.md) | Provenance and attribution tracking | SPS-Core |
| **Protocols** | [SPS-Protocols](specs/SPS-Protocols.md) | Document & claim synchronization protocols | SPS-Core |
| **Identity** | [SSOT ID](specs/identity/ssot-id.md) | Single source of truth identity system | None |

### 🔧 Domain-Specific Modules (Optional - Choose Based on Use Case)

<details>
<summary><strong>🤖 Agent Interface</strong> (For AI/Bot Integration)</summary>

| Document | Description | Dependencies |
|----------|-------------|--------------|
| [Agent Interface](specs/spp/agent-interface.md) | Core agent interaction specification | SPS-Core, SSOT ID |
| [Agent Authentication](specs/agent-interface/agent-authentication.md) | Agent identity and auth protocols | Agent Interface |
| [Agent Coordination](specs/agent-interface/agent-coordination.md) | Multi-agent collaboration patterns | Agent Interface |
| [Agent Personality Profile](specs/agent-interface/agent-personality-profile.md) | Agent behavior and preference modeling | Agent Interface |
| [Query Resolution](specs/agent-interface/query-resolution.md) | Agent query processing and response | Agent Interface |
| [AI Memory](specs/agent-interface/ai-memory.md) | Agent memory and context management | Agent Interface |

</details>

<details>
<summary><strong>💰 Monetization & Ads</strong> (For Revenue Integration)</summary>

| Document | Description | Dependencies |
|----------|-------------|--------------|
| [Intent-Aligned Ads](specs/ads/intent-aligned-ads.md) | Context-aware advertising framework | SPS-Core |
| [Ad Auction Engine](specs/ads/ad-auction-engine.md) | Real-time ad bidding and placement | Intent-Aligned Ads |
| [Ad Ranking Engine](specs/ads/ad-ranking-engine.md) | Ad scoring and placement algorithms | Ad Auction Engine |
| [Micro-Payments](specs/payments/micro-payments.md) | Small-value transaction processing | SPS-Core |
| [Content Revenue Split](specs/payments/content-revenue-split.md) | Revenue sharing between stakeholders | Micro-Payments |

</details>

<details>
<summary><strong>🔒 Consent & Privacy</strong> (For Data Protection)</summary>

| Document | Description | Dependencies |
|----------|-------------|--------------|
| [Consent Engine](specs/identity/consent-engine.md) | User consent management system | SSOT ID |
| [Trust Engine](specs/consent-engine/trust-engine.md) | Trust scoring and verification | Consent Engine |
| [Data Delegation](specs/consent-engine/data-delegation.md) | Controlled data sharing mechanisms | Consent Engine |
| [Focus Mode](specs/identity/focus-mode.md) | Privacy-focused browsing modes | Consent Engine |

</details>

<details>
<summary><strong>🔍 Registry & Discovery</strong> (For Content Distribution)</summary>

| Document | Description | Dependencies |
|----------|-------------|--------------|
| [Registry and Discovery](specs/spp/registry-and-discovery.md) | Content indexing and discovery system | SPS-Core |
| [Publishing Registry](specs/spp/publishing-registry.md) | Publisher registration and metadata | Registry and Discovery |
| [Semantic Inventory](specs/spp/semantic-inventory.md) | Content cataloging and search | Publishing Registry |

</details>

<details>
<summary><strong>📖 Publishing Extensions</strong> (Advanced Publishing Features)</summary>

| Document | Description | Dependencies |
|----------|-------------|--------------|
| [Content Attribution](specs/spp/content-attribution.md) | Advanced provenance tracking | Content Attribution (Core) |
| [Publisher Rating](specs/publishing/publisher-rating.md) | Publisher credibility scoring | Publisher Metadata |
| [Review Chain](specs/publishing/review-chain.md) | Peer review and validation workflows | Content Attribution |
| [HTML Compatibility](specs/publishing/html-compatibility.md) | Integration with existing HTML | Semantic Blocks |

</details>

### 🛠️ Implementation Resources

| Resource | Description | Use Case |
|----------|-------------|----------|
| **[Validation Tool](tools/validate.py)** | Validate `.sps.md` files against spec | Testing compliance |
| **[Examples](examples/)** | Real-world SPP content samples | Learning and reference |
| **[Glossary](docs/glossary.md)** | Comprehensive terminology reference | Understanding concepts |
| **[Specification Index](docs/spec-index.md)** | Complete document listing with links | Navigation and discovery |

### 🚦 Implementation Pathway

1. **🎯 Foundation** → Read QUICKSTART, understand SPS-Core and compliance levels
2. **📝 Publishing** → Implement semantic blocks and content attribution  
3. **🔌 Integration** → Choose domain modules based on your use case:
   - Building an AI agent? → Start with Agent Interface
   - Adding monetization? → Start with Ads & Payments  
   - Privacy-focused? → Start with Consent & Privacy
4. **🔍 Scale** → Add registry and discovery for content distribution
5. **✅ Validate** → Use validation tools to ensure compliance

> **💡 Pro Tip:** All documents marked "REQUIRED" are essential for SPP compatibility. Domain modules are optional but provide powerful capabilities for specific use cases.

---

## 🙌 Join the Movement

- Start a [Discussion](https://github.com/Stoked-Builds/semantic-publishing-protocol/discussions)
- Share your thoughts on [X](https://x.com/MarkStokes)
- Contribute ideas, markup, or extensions

Let’s stop starving the web.  
Let’s make it speak again — **with us, for us**.

---

## 🧠 Learn More

- 📖 [The AI Starvation Loop]([https://medium.com/your-article-link](https://medium.com/@mark_stokes/the-ai-starvation-loop-how-ai-is-starving-the-web-and-what-we-can-do-about-it-e0e567f13ad4))
- 🌐 [Stoked Builds Homepage](https://github.com/Stoked-Builds)

---

> Created by [Mark Stokes](https://github.com/markstokes) — because the browser learned to read, but someone had to teach the web to speak.

# Glossary – Semantic Publishing Protocol (SPP)

This glossary defines key terms, acronyms, and concepts used throughout the SPP specifications. Use this as a reference for consistent terminology and understanding across all protocol documents.

Each term links to where it is normatively defined and used across the protocol specifications.

---

## A

- **Ad Scorecard**: A transparency UI component that shows users why an ad was shown to them, promoting trust and user agency. See [Ad Scorecard UI](../browser/ad-scorecard-ui.md).
- **Agent**: An AI-powered service or software component that acts on behalf of a user or publisher within the SPP ecosystem (e.g., browser agent, query resolver). See [Agent Interface Specifications](../agent-interface/).
- **AI Browser**: An intelligent context engine that dynamically renders SPS content, respects user consent, and integrates agents, ads, and personalization while avoiding surveillance. See [AI Browser Specification](../spp/ai-browser-spec.md).
- **Amendment**: A record of a change, correction, or update to a Document or Claim, ensuring transparency and auditability of changes. See [SPS-Core](../SPS-Core.md#3-amendment).
- **Attribution**: The process of crediting authors, publishers, or contributors for content or actions within the protocol. See [Content Attribution](../spp/content-attribution.md).

## B

- **BlockRef**: A field or reference pointing to another semantic block by its unique identifier, enabling modular composition and traceability. See [Semantic Blocks](../publishing/semantic-blocks.md).

## C

- **Claim**: A verifiable assertion made within a document (e.g., a fact, statement, or attribution) that can be cryptographically signed and independently referenced. See [SPS-Core](../SPS-Core.md#2-claim).
- **Consent Engine**: The component responsible for managing user consent, preferences, and data sharing policies. See [Consent Engine](../identity/consent-engine.md).
- **Content Block**: A modular, self-contained unit of structured content, such as a recipe, review, or product listing. Also known as Semantic Block. See [Semantic Blocks](../publishing/semantic-blocks.md).
- **Content Revenue Split**: A revenue or royalty allocation among multiple recipients, defined in content or registry metadata. See [Content Revenue Split](../payments/content-revenue-split.md).

## D

- **DID**: Decentralized Identifier, a standard for unique, verifiable digital identities. See [Identity Specifications](../identity/).
- **Document**: The primary container for published content, metadata, and provenance, uniquely identifying a published work and its provenance. See [SPS-Core](../SPS-Core.md#1-document).

## E

- **Entity**: A person, organization, or agent involved in publishing, authorship, or attribution, supporting multiple identifier schemes. See [SPS-Core](../SPS-Core.md#5-entity).
- **Escalation**: A protocol event triggered when a job cannot be completed automatically, requiring manual review or further intervention. See protocol processing specifications.

## F

- **Focus Mode**: A user-controlled state that minimizes digital distractions during high-priority activities (deep work, mental health, etc.) by suppressing ads and non-essential content. See [Focus Mode Specification](../identity/focus-mode.md).

## I

- **Intent-Aligned Ads**: Advertisements delivered based on explicit user intent, context, and consent, as defined in the SPP ad specs. See [Intent-Aligned Ads](../ads/intent-aligned-ads.md).
- **Intent Matching**: The process of selecting ads based on explicit user queries, recent activity, and declared interests. See [Intent-Aligned Ads](../ads/intent-aligned-ads.md).
- **Intervention**: Manual or automated action taken to resolve issues with a job, such as correcting data, approving escalated submissions, or handling exceptions.

## J

- **Job**: A discrete publishing or processing task tracked by the protocol, such as validating a submission or generating output. Each job has a unique ID and status.

## M

- **Micro-Payments**: Small, user-controlled payments for content, services, or ad engagement, typically executed via adapters or tokens. See [Micro-Payments](../payments/micro-payments.md).

## P

- **Payment Adapter**: A pluggable module that executes payment transactions using various methods (crypto, fiat, stablecoin, etc.). See [Payment Adapter Contract](../payments/payment-adapter-contract.md).
- **Payment Intent**: A JSON-LD object describing a payment action, value, and payee. See [Micro-Payments](../payments/micro-payments.md).
- **Processor**: A tool, service, or agent that validates, enriches, or transforms submissions according to defined rules and templates.
- **Processing Template**: A structured definition that specifies required fields, data types, and validation rules for a particular type of submission.
- **Publisher Metadata**: Structured data describing a publisher's identity, reputation, and content offerings. See [Publisher Metadata](../publishing/publisher-metadata.md).

## R

- **Reference**: A link to external sources, standards, or prior works, providing provenance, licensing, or context for claims and documents. See [SPS-Core](../SPS-Core.md#4-reference).
- **Registry**: A decentralized or federated directory of agents, publishers, or content blocks, supporting discovery and verification. See [Registry and Discovery](../spp/registry-and-discovery.md).
- **Review Chain**: A cryptographically-verifiable trail of edits, reviews, and contributions for published content. See [Review Chain](../publishing/review-chain.md).

## S

- **Saturation Penalty**: A system that reduces the display score of ads that users repeatedly see but don't engage with, preventing ad fatigue and improving targeting quality. See [Saturation Penalty System](../ads/saturation-penalty.md).
- **Semantic Block**: A modular, self-contained unit of structured content with embedded metadata. Same as Content Block. See [Semantic Blocks](../publishing/semantic-blocks.md).
- **semantic.json**: The machine-readable canonical representation of a content artefact, generated from story.md and used by agents, search systems, and AI browsers. See [semantic.json](../publishing/semantic-json.md).
- **Signature**: A cryptographic proof of authorship, amendment, or endorsement, providing verifiable proof using multiple cryptographic algorithms. See [SPS-Core](../SPS-Core.md#7-signature).
- **Single Source of Truth (SSOT)**: A globally unique, resolvable identifier (e.g., `ssot://`) for identity and attribution. See [SSOT-ID](../identity/ssot-id.md).
- **SPP Token (SPX)**: The native or planned token for micro-payments and incentive alignment in the protocol. See [SPP Token Roadmap](../payments/spp-token-roadmap.md).
- **Split**: A revenue or royalty allocation among multiple recipients, defined in content or registry metadata. See [Content Revenue Split](../payments/content-revenue-split.md).
- **SSOT-ID**: A portable, user-owned identity format that acts as the single source of truth for all personal data. See [SSOT-ID](../identity/ssot-id.md).
- **Stoked Navigator**: An AI-native browser implementation designed for consuming SPP content with intelligent context awareness. See [Stoked Navigator Architecture](../browser/stoked-navigator-architecture.md).
- **Submission**: A content item (e.g., article, dataset) provided by an author or agent for processing and publication within the protocol.

## U

- **User Receptiveness**: A model that scores user openness to advertisements based on behavior patterns, context, and engagement history. See [User Receptiveness Model](../browser/user-receptiveness.md).

## T

- **Timeline**: A record of the sequence of events, amendments, and signatures for a Document or Claim, providing a full audit trail. See [SPS-Core](../SPS-Core.md#6-timeline).
- **Trust Engine**: The scoring and verification system for agents, content, and advertisers, supporting safe and user-respecting interactions. See [Trust Engine](../consent-engine/trust-engine.md).
- **Trust Score**: An aggregated metric representing the trustworthiness of an agent, content source, or advertiser. See [Trust Engine](../consent-engine/trust-engine.md).

---

_This glossary is a living document. Please propose additions or clarifications as the protocol evolves._

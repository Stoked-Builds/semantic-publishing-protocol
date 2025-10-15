# Glossary – Semantic Publishing Protocol (SPP)

[← Back to Specification Index](spec-index.md)
This glossary defines key terms, acronyms, and concepts used throughout the SPP specifications. Use this as a reference for consistent terminology and understanding across all protocol documents.

---

## C (Core Protocol Terms)

- **Job**: A discrete publishing or processing task tracked by the protocol, such as validating a submission or generating output. Each job has a unique ID and status.
- **Submission**: A content item (e.g., article, dataset) provided by an author or agent for processing and publication within the protocol.
- **Processor**: A tool, service, or agent that validates, enriches, or transforms submissions according to defined rules and templates.
- **Processing Template**: A structured definition that specifies required fields, data types, and validation rules for a particular type of submission. Used to match and process incoming content.
- **Escalation**: A protocol event triggered when a job cannot be completed automatically (e.g., due to errors or low confidence), requiring manual review or further intervention.
- **Confidence Threshold**: A minimum score (e.g., 0.95) that a submission must meet during validation to be accepted automatically. Submissions below this threshold may be escalated.
- **Intervention**: Manual or automated action taken to resolve issues with a job, such as correcting data, approving escalated submissions, or handling exceptions.
- **Event**: A significant occurrence within the protocol (e.g., submission received, job succeeded, escalation triggered) that may trigger notifications or further processing.
- **Output**: The final, structured, and trusted result produced by the protocol after processing a submission. This is what gets published or made available for discovery.
- **Message Schema**: The structured format used for communication between protocol components (e.g., service bus messages), defining required fields and data types for status updates and events.

- **Agent**: An AI-powered service or software component that acts on behalf of a user or publisher within the SPP ecosystem (e.g., browser agent, query resolver).
- **Attribution**: The process of crediting authors, publishers, or contributors for content or actions within the protocol.

## B

- **BlockRef**: A field or reference pointing to another semantic block by its unique identifier, enabling modular composition and traceability. See [Content Attribution](../specs/publishing/content-attribution.md).

## C

- **Consent Engine**: The component responsible for managing user consent, preferences, and data sharing policies. See [Consent Engine](../specs/identity/consent-engine.md).
- **Content Block**: A modular, self-contained unit of structured content, such as a recipe, review, or product listing. See [Semantic Blocks](../specs/publishing/semantic-blocks.md).

## D

- **DID**: Decentralized Identifier, a standard for unique, verifiable digital identities.

## I

- **Intent-Aligned Ads**: Advertisements delivered based on explicit user intent, context, and consent, as defined in the SPP ad specs. See [Intent-Aligned Ads](../specs/ads/intent-aligned-ads.md).

## M

- **Micro-Payments**: Small, user-controlled payments for content, services, or ad engagement, typically executed via adapters or tokens. See [Micro-Payments](../specs/payments/micro-payments.md).

## P

- **Payment Adapter**: A pluggable module that executes payment transactions using various methods (crypto, fiat, stablecoin, etc.). See [Payment Adapter Contract](../specs/payments/payment-adapter-contract.md).
- **Publisher Metadata**: Structured data describing a publisher's identity, reputation, and content offerings. See [Publisher Metadata](../specs/publishing/publisher-metadata.md).

## R

- **Registry**: A decentralized or federated directory of agents, publishers, or content blocks, supporting discovery and verification. See [Registry and Discovery](../specs/spp/registry-and-discovery.md).

## S

- **Semantic Block**: See Content Block.
- **Single Source of Truth (SSOT)**: A globally unique, resolvable identifier (e.g., `ssot://`) for identity and attribution. See [SSOT-ID](../specs/identity/ssot-id.md).
- **SPP Token (SPX)**: The native or planned token for micro-payments and incentive alignment in the protocol. See [SPP Token Roadmap](../specs/payments/spp-token-roadmap.md).
- **Split**: A revenue or royalty allocation among multiple recipients, defined in content or registry metadata. See [Content Revenue Split](../specs/payments/content-revenue-split.md).

## T

- **Trust Engine**: The scoring and verification system for agents, content, and advertisers, supporting safe and user-respecting interactions. See [Trust Engine](../specs/consent-engine/trust-engine.md).
- **Trust Score**: An aggregated metric representing the trustworthiness of an agent, content source, or advertiser.

---


## E

- **Embedding**: A numeric vector representation of a text chunk used for semantic search and retrieval. Model-agnostic in SPP; referenced via a storage pointer.
- **Enrichment Layer**: Optional extension that adds raw snapshots, clean text, chunks, embeddings, diffs, provenance, and versioning to artefacts.

## V

- **Version (Content Version)**: Monotonic integer indicating a new state of content created only when the raw snapshot hash changes.
- **Version Manifest**: The per-version pointer map that references raw, clean, chunks, diffs, and provenance for a specific content version.

_This glossary is a living document. Please propose additions or clarifications as the protocol evolves._

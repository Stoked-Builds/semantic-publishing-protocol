# Interoperability – Semantic Publishing Protocol (SPP)

This document describes the interoperability goals, strategies, and mechanisms for the SPP ecosystem. It is intended to ensure SPP can integrate with, extend, and coexist alongside other web, identity, and content standards.

---

## 1. Interoperability Goals
- Enable seamless data exchange between SPP and other protocols (e.g., ActivityPub, OpenID, W3C DID).
- Support import/export of content, identity, and consent data in standard formats (JSON-LD, SPDX, etc.).
- Allow agents, browsers, and registries to federate or bridge with external systems.

---

## 2. Standards Alignment
- **Identity**: SPP supports [DID](https://www.w3.org/TR/did-core/), [SSOT-ID](../identity/ssot-id.md), and can map to OpenID Connect.
- **Content**: SPP content blocks are JSON-LD compatible and can be embedded in HTML, RSS, or ActivityStreams.
- **Consent**: Consent tokens are modeled after [W3C Verifiable Credentials](https://www.w3.org/TR/vc-data-model/) and JWT.
- **Licensing**: Licensing metadata uses [SPDX](https://spdx.dev/) identifiers and can be extended for Creative Commons or custom terms.

---

## 3. Federation & Bridging
- SPP registries can federate with other SPP or non-SPP registries using open APIs and signed metadata.
- Agents can act as bridges, translating between SPP and external protocols (e.g., ActivityPub actors, RSS feeds).
- Payment adapters can support both crypto and fiat rails, and interoperate with existing wallet standards.

---

## 4. Extensibility
- All SPP schemas are designed for extension via custom fields, linked data, and versioning.
- New adapters, block types, and registry models can be added without breaking compatibility.

---

## 5. Future Directions
- Automated mapping to and from [ActivityStreams](https://www.w3.org/TR/activitystreams-core/) and [Solid Pods](https://solidproject.org/).
- Cross-protocol trust and consent propagation.
- Interop test suites and compliance tools for implementers.

---

_See also: [Semantic Publishing Specification](../sps/semantic-publishing-specification.md), [SSOT-ID](../identity/ssot-id.md), [Consent Engine](../identity/consent-engine.md), [Publishing Registry](./publishing-registry.md)_

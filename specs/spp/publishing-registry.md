# Publishing Registry – Specification v0.1

## Overview

The Publishing Registry is a core discovery and verification component within the Semantic Publishing Protocol (SPP). It serves as a decentralised or federated index where publishers can register semantic content, metadata, and publishing contracts for discovery by AI browsers and agents.

This registry is not a content host. It acts as a trustable pointer system that provides:
- Location of published content (URLs, IPFS hashes, etc.)
- Associated metadata, tags, attribution, and licensing
- Publisher signature for authenticity
- Consent and permissions declarations

---

## Registry Entry Format

Each published content item is registered as an `SPP:RegistryEntry` with the following fields:

```json
{
  "id": "urn:spp:entry:123456789",
  "type": "SPP:RegistryEntry",
  "title": "Example Article Title",
  "summary": "Short content summary for discovery indexing.",
  "contentUrl": "https://example.com/posts/article-01",
  "semanticTags": ["technology", "AI", "opinion"],
  "language": "en",
  "license": "CC-BY-4.0",
  "attribution": {
    "author": "Jane Doe",
    "publisher": "Example Publishing Co.",
    "ssot-id": "did:example:publisher:abc123"
  },
  "signature": {
    "issuer": "did:example:publisher:abc123",
    "signatureValue": "0x6a7e..."
  },
  "timestamp": "2025-07-27T23:00:00Z",
  "consentPolicy": {
    "dataUse": "analytics",
    "allowIndexing": true,
    "allowProfiling": false
  }
}
```

---

## Registry Types

There are three main registry deployment models:

### 1. Federated Registries
- Independent orgs/hosts run registries and cross-publish metadata
- Suitable for industry groups, news consortiums, etc.

### 2. Self-Hosted Registries
- A publisher hosts their own registry node
- Ideal for independent creators or companies

### 3. Decentralised Registries (Future)
- Blockchain or DHT-backed systems
- Content entries replicated and verified globally

---

## Registry Capabilities

- `register(entry)` – Add or update a content listing
- `query(filters)` – Discover content via tags, topic, language, etc.
- `resolve(id)` – Retrieve full metadata and content pointer
- `verifySignature(entry)` – Ensure authenticity of attribution and origin

---

## Compliance Requirements

To be compliant with SPP:
- Registries MUST use standard SPP entry formats
- Registries MUST expose API endpoints or feeds for discovery
- Registries MUST support provenance verification
- Registries MUST allow opt-out and revocation of consented data

---

## Notes

- AI Browsers use registries to discover and prioritise relevant content
- Agents may also submit registry entries on behalf of creators or scrape tagged content for registration
- Consent receipts are optionally cross-linked for auditing purposes
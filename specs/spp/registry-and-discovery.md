# SPP Registry and Discovery
**Version:** 0.1  
**Status:** Final  
**Date:** 2025-07-28  
**Spec Code:** spp/registry

---

## 📍 Purpose

To enable AI Browsers and agents to **discover, index, and retrieve** semantically structured content and metadata from publishers, creators, and distributed sources.

SPP supports both centralised and decentralised discovery mechanisms — prioritising **privacy, reliability, and decentralisation**.

---

## 🔍 Discovery Mechanisms

### 1. `.well-known/spp.json` (recommended for traditional websites)

Each SPS-compliant website **MAY** expose:

```
https://example.com/.well-known/spp.json
```

This file describes:
- Registry metadata
- Available SPS documents
- Content types and delivery methods
- Publisher identity (linked to SSOT or DID)

**Example:**
```json
{
  "ssot_id": "ssot:markstokes",
  "publisher": "Stoked Media",
  "sitemap": "https://example.com/spp/sitemap.json",
  "version": "0.1",
  "ad_policy": "https://example.com/spp/intent-aligned-ads.md"
}
```

---

### 2. `sitemap.json`

A machine-readable list of available semantic content blocks:

```json
{
  "articles": [
    "https://example.com/spp/articles/article-123.json",
    "https://example.com/spp/articles/article-456.json"
  ],
  "ads": [
    "https://example.com/spp/ads/product-launch.json"
  ]
}
```

---

### 3. Federated / P2P Index Nodes

Optionally, creators can register with **federated** or **decentralised** registries:
- IPFS or DNSLink-based content roots
- Ceramic or similar DID-based indexing
- Verifiable credentials published via ActivityPub-compatible streams

These registries act like DNS for semantic content and enable:
- Long-term content availability
- Discovery without central control
- Trust graph enrichment (e.g. “also linked by…”)

---

### 4. Agent-Side Memory

SSOT agents and AI Browsers maintain **local registries** of:
- Previously trusted domains
- Recently visited or queried content sources
- Approved publishers

These can be searched or shared (with consent) to **bootstrap trust and speed up discovery**.

---

## 📜 Content Type Metadata

Every published SPS content document **SHOULD** expose a minimal metadata block:

```json
{
  "type": "article",
  "tags": ["ai", "privacy", "economy"],
  "language": "en",
  "audience": ["general"],
  "published": "2025-07-27T00:00:00Z"
}
```

This allows agents to:
- Filter based on interest profiles
- Align content with ad targeting (FARS + IAA)
- Respect consent preferences

---

## 🔐 Trust and Verification

- Publishers **SHOULD** sign `.well-known/spp.json` using their SSOT key
- Registry updates **MUST** not leak private identity info
- Agents may verify registry provenance via DIDs or trust anchors

---

## 🛠 Roadmap

- AI-native registry query format (e.g. “find all recent AI articles by reputable sources in English”)
- Smart push: content publishers can subscribe to semantic crawler networks
- Registry mirroring with content freshness guarantees

---

## 🤝 Summary

SPP discovery is modular, decentralised, and designed for agents—not crawlers.  
No scraping. No clickbait. Just structured, trusted, user-consented knowledge exchange.


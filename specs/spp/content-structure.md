# SPS Content Structure Specification
**Version:** 0.1  
**Status:** Final  
**Date:** 2025-07-28  
**Spec Code:** sps/content-structure

---

## 📦 Purpose

This document defines the **standard structure for content published under SPS (Semantic Publishing Specification)** so it can be parsed, consumed, and rendered by AI browsers, agents, and dynamic interfaces.

---

## 🔖 Content as Modular Blocks

SPP assumes content is not "pages" — it’s **blocks**.

Each SPS content unit (article, product, idea, etc.) is represented as a structured JSON object. These blocks can be:

- Independently rendered or reassembled
- Fetched on demand
- Augmented or styled differently depending on user context

---

## 🧱 Block Schema (v0.1)

```json
{
  "id": "urn:sps:content:example-article-001",
  "type": "article",
  "title": "Why Consent is the Future of the Web",
  "summary": "An overview of the Semantic Publishing Protocol and why the web needs it now.",
  "published_at": "2025-07-28T00:00:00Z",
  "language": "en",
  "tags": ["web", "consent", "ai"],
  "author": {
    "ssot_id": "ssot:markstokes",
    "name": "Mark Stokes"
  },
  "content_blocks": [
    {
      "type": "text",
      "data": "The modern web is broken. Privacy is non-existent. Ads are misaligned. But there's another way..."
    },
    {
      "type": "quote",
      "data": "The future is not ads you ignore — it's information you choose.",
      "attribution": "Naima Kade"
    },
    {
      "type": "image",
      "data": {
        "src": "https://example.com/images/consent-future.png",
        "alt": "Consent-first web model"
      }
    },
    {
      "type": "cta",
      "data": {
        "label": "Read the full spec",
        "url": "https://example.com/spp/specification"
      }
    }
  ]
}
```

---

## 🎨 Block Types

| Type     | Purpose                            |
|----------|------------------------------------|
| `text`   | Markdown/HTML-like paragraphs      |
| `quote`  | Highlighted citation or reference  |
| `image`  | Visual block with metadata         |
| `video`  | Embedded media                     |
| `embed`  | Remote source (e.g. tweet, chart)  |
| `cta`    | Link to deeper content or action   |
| `ad`     | Intent-aligned ad unit (optional)  |

Block types can be extended with versioned sub-schemas.

---

## 📚 Metadata Standards

- Timestamps MUST be ISO8601
- All blocks SHOULD have language tags (`en`, `es`, etc.)
- `ssot_id` must be resolvable to a trustable identity or DID
- Tags MUST be lowercase, hyphenated (`"ai-ethics"`)

---

## 📡 Delivery + Embedding

SPS documents may be:
- Served via URL (`.json`, `.sps.json`, `.spp.json`)
- Embedded in `spp.json` registries
- Streamed to subscribers (RSS-style)
- Bundled via IPFS hashes or P2P content roots

---

## 🧩 Rendering Guidance (AI Browser)

Each block is:
- Independently styled
- Context-aware (theme, focus-mode, user prefs)
- Cross-checkable for consent + relevance

The AI Browser uses:
- User context
- Layout heuristics
- Agent input
to assemble a **dynamic experience**, not a static page.

---

## 🛠 Future Extensions

- Reactive content blocks (e.g. poll results, live stats)
- Multilingual block fallbacks
- Agent-defined transformation layers

---

## 🤝 Summary

Forget the webpage. SPS defines **semantic content blocks** ready for AI-first consumption, remixing, and delivery — always respectful of user context, consent, and attention.


# SPS HTML Integration Guide
**Version:** 0.1  
**Status:** Draft  
**Date:** 2025-07-27  
**Part of:** [Semantic Publishing Specification (SPS)](semantic-publishing-specification.md)

---

## 🎯 Purpose

This guide defines how websites using traditional HTML can **embed SPS metadata** into their content in a machine-readable, AI-consumable format — without redesigning the site or backend.

This allows existing sites to become part of the Semantic Publishing Protocol with minimal effort.

---

## ✅ Supported Methods

| Method | Description |
|--------|-------------|
| `<script type="application/json+sps">` | Embed structured metadata in the page |
| `<meta name="sps:*">` tags | Declare specific SPS properties in HTML head |
| HTML `data-sps-*` attributes | Annotate visible content blocks inline |

---

## 📦 Recommended Fields

At a minimum, the following should be provided:

```html
<script type="application/json+sps">
{
  "sps_type": "article",
  "title": "How AI Browsers Will Replace Web Pages",
  "author": "Mark Stokes",
  "tags": ["AI", "semantic web", "browsers"],
  "published_at": "2025-07-27T08:00:00Z",
  "summary": "Exploring the death of traditional web pages and the rise of generative, intent-based browsing.",
  "canonical_url": "https://stoked.tech/articles/ai-browser-revolution"
}
</script>
```

---

## 🧩 Meta Tag Integration

```html
<meta name="sps_type" content="article">
<meta name="title" content="The Stoked Protocol Manifesto">
<meta name="author" content="Mark Stokes">
<meta name="tags" content="AI,protocol,vision">
```

---

## 🏷 Inline Block Annotation

```html
<div data-sps_type="section" data-sps_label="Call to Action">
  <p>Ready to join the new web? Install the Stoked Browser prototype.</p>
</div>
```

---

## 🔁 Dynamic Pages

SPS JSON can be served via:
- REST API endpoint (`/sps.json`)
- GraphQL metadata resolver
- Embedded via server-side render or client JS injection

Ensure AI agents or bots are **not blocked** from accessing these resources via `robots.txt` or CORS.

---

## 🧪 Validation

You can validate embedded SPS content using:

- `spp-validator` CLI (coming soon)
- Online tools at: `https://spp.tools/validate`
- Structured data test frameworks (JSON-LD compatible)

---

## 📚 Examples

**WordPress Plugin** – Adds SPS metadata based on post meta  
**React SDK** – `<SPSMeta />` React component auto-generates JSON block  
**Hugo Theme Helper** – Partial template that outputs SPS-compliant metadata in head

---

## 🛡 Legal & Consent Considerations

By embedding SPS:
- You agree content may be consumed by AI browsers
- Licensing is respected via the `license` block
- You retain ownership; SPS is for **interpretable publishing**, not scraping

---

## 🔗 Related

- [`semantic-publishing-specification.md`](semantic-publishing-specification.md)
- [`protocol-overview.md`](../spp/protocol-overview.md)

---

Bring your existing site into the future of content —  
No redesign required. Just annotate and go.


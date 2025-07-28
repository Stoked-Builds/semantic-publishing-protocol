---

## Related Specs

- [`semantic-blocks.md`](./semantic-blocks.md)
- [`publisher-metadata.md`](./publisher-metadata.md)
- [`trust-engine.md`](../consent-engine/trust-engine.md)

> _"HTML compatibility enables SPP-compliant metadata extraction for trust, attribution, and payment systems. See related specs for integration details."_
# HTML Compatibility – Specification v0.1

## Purpose

This specification defines a set of **HTML meta tags, data attributes, and class conventions** that allow existing websites to publish **SPS-compliant metadata** without redesigning their frontend or switching rendering frameworks.

It ensures AI Browsers and SPP agents can extract structured content, author metadata, revenue splits, and registry information from traditional websites.

---

## Integration Methods

Websites can expose Semantic Publishing metadata using:

1. **Meta Tags** (in `<head>`)
2. **Microdata Attributes** (in HTML elements)
3. **Class Conventions** (fallback for lightweight semantic parsing)

---

## 1. HTML `<meta>` Tags

Include these in the `<head>` of your HTML document:

```html
<meta name="sps.title" content="Understanding Agentic Browsers" />
<meta name="sps.author" content="Mark Stokes" />
<meta name="sps.registry" content="https://registry.spp.network/entry/abc123" />
<meta name="sps.category" content="technology/ai" />
<meta name="sps.license" content="CC-BY-4.0" />
<meta name="sps.publishDate" content="2025-07-28T10:00:00Z" />
```

---

## 2. HTML Data Attributes

Content blocks or inline elements can use `data-sps-*` attributes:

```html
<article data-sps-block="main-content" data-sps-type="article">
  <h1 data-sps-title>Understanding Agentic Browsers</h1>
  <p data-sps-paragraph>
    A new class of AI-native browsers is emerging...
  </p>
</article>
```

Or:

```html
<div data-sps-asset="audio" data-sps-source="https://cdn.site.com/audio.mp3" data-sps-credit="user:0xAlice"></div>
```

---

## 3. Class Conventions (Lightweight fallback)

For minimal intervention, support standardised class selectors:

```html
<div class="sps-title">The Rise of AI Browsers</div>
<div class="sps-author">By Mark Stokes</div>
<div class="sps-content">...</div>
```

Use only if `meta` or `data-` attributes are not viable.

---

## Revenue Split Inline Declaration

Optional inline declaration in script tag (JSON-LD):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "The Rise of AI Browsers",
  "author": {
    "@type": "Person",
    "name": "Mark Stokes",
    "identifier": "user:0xMarkStokes"
  },
  "sps:splits": [
    { "recipient": "wallet:0xMarkStokes", "share": 1.0, "role": "author" }
  ]
}
</script>
```

---

## Best Practices

- Use `meta` tags for document-level metadata
- Use `data-sps-*` for block-level semantics
- Use class conventions only as a fallback or for rapid adoption
- Keep all timestamps in ISO 8601 format
- Declare registry URL if entry is linked to an official publishing record

---

## Discovery Rules (for AI Browsers)

SPP-compliant browsers and agents SHOULD:

1. First look for `<meta>` tags
2. Then scan for `data-sps-*` attributes
3. Fallback to `.sps-*` class parsing

---

## Related Files

- [`registry-and-discovery.md`](./registry-and-discovery.md)
- [`content-revenue-split.md`](./content-revenue-split.md)
- [`agent-interface.md`](./agent-interface.md)
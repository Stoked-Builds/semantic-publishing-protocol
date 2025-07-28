# Metadata Tag Map

The Metadata Tag Map defines how SPS-compliant metadata maps to legacy web metadata formats, enabling backward compatibility and progressive enhancement. This spec allows current HTML content to be made AI-readable without redesign.

## 🎯 Purpose

- Bridge SPS metadata with existing metadata systems
- Allow hybrid support for HTML-rendered and AI-rendered consumption
- Assist crawlers and AI browsers in discovering meaning from traditional pages

---

## 🗺️ Tag Mapping Table

| SPS Field              | schema.org Equivalent            | OpenGraph Tag               | Twitter Card Tag          |
|------------------------|----------------------------------|-----------------------------|----------------------------|
| `title`                | `name`                           | `og:title`                  | `twitter:title`           |
| `description`          | `description`                    | `og:description`            | `twitter:description`     |
| `image_url`            | `image`                          | `og:image`                  | `twitter:image`           |
| `content_type`         | `@type`                          | `og:type`                   | –                          |
| `publisher_name`       | `publisher.name`                 | `article:publisher`         | –                          |
| `published_at`         | `datePublished`                  | `article:published_time`    | –                          |
| `updated_at`           | `dateModified`                   | `article:modified_time`     | –                          |
| `author_name`          | `author.name`                    | `article:author`            | –                          |
| `tags`                 | `keywords` (comma separated)     | –                           | –                          |
| `license`              | `license`                        | –                           | –                          |
| `ssot_id`              | –                                | `ai:ssot_id` (proposed)     | –                          |
| `semantic_block_type`  | `@type` (or extension)           | `ai:block_type` (proposed)  | –                          |

---

## 🧩 Proposed SPS Meta Extensions

The following `meta` tags are proposed for hybrid HTML use:

```html
<meta name="ai:ssot_id" content="ssot://article/abc123">
<meta name="ai:semantic_block_type" content="review">
<meta name="ai:semantic_tags" content="ai, ethics, transparency">
<meta name="ai:source_rank" content="0.94">
```

These can live in `<head>` for easy agent discovery.

---

## 🛠️ HTML Example

```html
<head>
  <meta name="og:title" content="The Rise of Agentic Browsers" />
  <meta name="twitter:description" content="How SPS redefines the web." />
  <meta name="ai:semantic_block_type" content="article" />
  <meta name="ai:ssot_id" content="ssot://article/agentic-browsers-001" />
</head>
```

---


## Related Specs

- [`semantic-publishing-specification.md`](./semantic-publishing-specification.md)
- [`semantic-blocks.md`](../publishing/semantic-blocks.md)
- [`trust-engine.md`](../consent-engine/trust-engine.md)
- [`ssot-id.md`](../identity/ssot-id.md)

> _"Where `ssot_id` or `ssot://` identifiers are referenced, see: SSOT URI structure in [`ssot-id.md`](../identity/ssot-id.md). Where `semantic_block_type` or `block_type` is referenced, see: [`semantic-blocks.md`](../publishing/semantic-blocks.md)."_

- `ssot-id.md`
- `semantic-blocks.md`
- `html-compatibility.md`

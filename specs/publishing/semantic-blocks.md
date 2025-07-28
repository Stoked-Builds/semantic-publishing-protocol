# Semantic Blocks – Specification v0.1

## Purpose

This document defines the **Semantic Block Format** — a reusable, structured content schema for publishing modular, AI-native entities on the semantic web. These blocks go beyond Schema.org-style microdata to offer:

- First-class agent compatibility
- Composable and remixable formats
- Query-resilient metadata with embedded type hints
- Long-term reusability and attribution

---

## Core Concepts

A **Semantic Block** is a self-contained JSON-like object that describes a distinct unit of content, such as:

- A product listing
- A recipe
- A review
- A tutorial
- A Q&A exchange
- A location summary
- A legal clause
- A diagnostic result

These blocks can be embedded in HTML, served via registry APIs, or passed directly between agents.

---

## Block Format

Each block includes a core header and a typed payload:

```json
{
  "type": "sps:block/recipe",
  "id": "block:xyz789",
  "title": "Quick Tomato Pasta",
  "author": "user:0xAlice",
  "created": "2025-07-28T10:00:00Z",
  "modified": "2025-07-28T12:00:00Z",
  "tags": ["pasta", "vegetarian", "quick"],
  "payload": {
    "ingredients": [
      { "item": "Tomatoes", "quantity": "400g" },
      { "item": "Garlic", "quantity": "2 cloves" }
    ],
    "steps": [
      "Boil pasta",
      "Blend tomatoes and garlic",
      "Mix and simmer"
    ],
    "cookTime": "PT20M",
    "servings": 2
  }
}
```

---

## Type Naming Convention

All semantic blocks must use a namespaced type format:

```
sps:block/{category}
```

Examples:
- `sps:block/product`
- `sps:block/tutorial`
- `sps:block/diagnostic`
- `sps:block/terms-of-service`

---

## Reuse & Embedding

- Blocks can be embedded in documents or pages
- Linked via `blockRef` inside other documents
- Stored and served independently from registries

Agents are expected to **parse, index, and reassemble** these blocks as part of query results or remix workflows.

---

## Agent Requirements

AI browsers and agents MUST:

- Respect original attribution metadata (`author`, `created`)
- Retain `block:id` for traceability
- Honour constraints declared via consent engine or registry terms
- Allow re-use under declared licensing

---

## AI Query Benefits

Semantic Blocks allow:

- Modular indexing
- Fine-grained search and filtering
- Dynamic recomposition (e.g. top 5 recipes using “broccoli” under 20 mins)
- Auto-summarisation and rating synthesis

---

## Future Extensions

- Support for linked block chains (e.g. medical histories)
- Inline licensing flags per payload field
- Reference linking between block types (e.g. `sps:block/recipe` linking to `sps:block/product`)

---

## Related Specs

- [`registry-and-discovery.md`](./registry-and-discovery.md)
- [`agent-interface.md`](./agent-interface.md)
- [`html-compatibility.md`](./html-compatibility.md)
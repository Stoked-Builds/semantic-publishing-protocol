
# Review Chain Protocol

**File:** `specs/publishing/review-chain.md`  
**Status:** Draft v0.1  
**SPP Component:** Trust / Attribution / Publishing

---

## Purpose

Establish a **cryptographically-verifiable trail** of edits, reviews, and contributions for published content. Ideal for collaborative documents, journalism, AI-generated reports, or scientific articles.

---

## Core Principles

- **Transparency**: Every change or contributor is tracked
- **Verifiability**: Signatures and timestamps validate history
- **Flexibility**: Review chains are optional and can be partial

---

## Record Structure

Each record includes:

```json
{
  "content_hash": "abc123...",
  "actor_id": "agent://reviewer.jlee",
  "role": "editor",
  "action": "modified",
  "timestamp": "2025-07-28T17:32:00Z",
  "signature": "xyz789..."
}
```

---

## Supported Actions

| Action     | Description |
|------------|-------------|
| `created`  | Initial content post |
| `modified` | Text or metadata change |
| `approved` | Peer or editorial approval |
| `retracted` | Author pullback or rejection |
| `flagged`  | Flagged for review or dispute |

---


## Use Cases

- Academic publishing with open peer review
- AI-generated content with human-in-the-loop tracing
- Newsrooms tracking editorial accountability

---

## Related Specs

- [`publisher-rating.md`](./publisher-rating.md)
- [`publisher-metadata.md`](./publisher-metadata.md)
- [`semantic-blocks.md`](./semantic-blocks.md)
- [`trust-engine.md`](../consent-engine/trust-engine.md)

> _"Review chains are referenced by trust, attribution, and publisher rating systems. See related specs for integration details."_

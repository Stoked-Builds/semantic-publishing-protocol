# semantic.json

**Version:** 0.2  
**Type:** Canonical Machine Artefact  
**Status:** MVP-Ready  
**Applies to:** All published content artefacts extracted from `story.md`

---

## 🎯 Purpose

This spec defines the structure of `semantic.json`, the **machine-readable canonical representation** of a content artefact. It is generated from `story.md` and used by agents, search systems, endorsement engines, and AI browsers.

---

## 📦 File Location

Should be stored alongside the `story.md` or published to a `.well-known/semantic/` endpoint.

```
/stories/:id/
  ├── story.md
  ├── semantic.json  ← This
  └── media/
```

---

## 🧠 Schema Fields

| Field        | Type      | Required | Description |
|--------------|-----------|----------|-------------|
| `id`         | string    | ✅       | Canonical slug or UUID of the story |
| `title`      | string    | ✅       | Human-readable title |
| `summary`    | string    | ✅       | Summary of the story (from author or AI) |
| `topics`     | array     | ✅       | Array of objects with topic `id`, `label`, and optional `global` |
| `tags`       | array     | ❌       | Normalised string tags |
| `lang`       | string    | ✅       | ISO 639-1 language code |
| `date`       | string    | ✅       | ISO 8601 date of publication |
| `version`    | string    | ✅       | Semantic version of this artefact |
| `digest`     | string    | ✅       | SHA256 hash of `story.md` content |
| `author`     | object    | ✅       | `{ "name": "...", "id": "...", "uri": "..." }` |
| `publisher`  | object    | ✅       | `{ "name": "...", "id": "...", "uri": "..." }` |
| `source`     | string    | ❌       | Syndicated or source attribution |
| `license`    | string    | ❌       | SPDX or CC license string |
| `canonical`  | string    | ❌       | Canonical web URL |
| `endorsements` | array   | ❌       | List of URIs or objects referencing external endorsements |
| `archived`   | boolean   | ❌       | True if the artefact is frozen and no longer updated |

---

## 🔤 Example

```json
{
  "id": "ai-firms-licensing-treaty",
  "title": "AI firms to need licences under new global treaty",
  "summary": "Countries back move to register large AI models used in critical sectors.",
  "topics": [
    {
      "id": "technology",
      "label": "Technology",
      "global": "wikidata:Q739"
    },
    {
      "id": "policy",
      "label": "Policy"
    }
  ],
  "tags": ["ai", "regulation"],
  "lang": "en",
  "date": "2025-07-12",
  "version": "1.0.0",
  "digest": "8e1a3a1ffb9a57e1ad4a...7e3bf",
  "author": {
    "name": "Priya Desai",
    "id": "author:priya-desai",
    "uri": "https://anchor.news/authors/priya-desai"
  },
  "publisher": {
    "name": "Anchor News",
    "id": "publisher:anchor",
    "uri": "https://anchor.news"
  },
  "source": "Reuters",
  "license": "CC-BY-4.0",
  "canonical": "https://anchor.news/stories/ai-firms-licensing-treaty",
  "endorsements": [],
  "archived": false
}
```

---

## 🧠 Notes on Generation

- `digest` should be a hash of the full `story.md` file (frontmatter + body).
- `topics[]` must resolve from the site’s `topics.json`, with `label` selected based on content `lang`.
- `author` and `publisher` fields will later support verifiable identity formats (DID, WebID).
- `endorsements` may link to signed `endorsement.json` files in v0.3+.

---

## ✅ Validation Rules

A valid `semantic.json`:
- Matches the story ID and folder
- Has all required fields with correct types
- Includes topics with `id` and at least `label`
- Has a valid hash digest
- Is consistent with source `story.md`

---

## 🔗 Related Specs

- [story.md](./story-spec.md) — source content format
- [topics.json](./topics.md) — canonical topic vocabulary
- [endorsement.md](./endorsement.md) — (upcoming) trust signal format
- [publisher-metadata.md](./publisher-metadata.md) — publisher info source

---

## 🚧 Future Considerations

- Add `structuredBody` (optional parsed structure with sections, links, quotes)
- Consider `altLangs` for translations of the same artefact
- Allow inclusion of embedded agent recommendations or semantic blocks

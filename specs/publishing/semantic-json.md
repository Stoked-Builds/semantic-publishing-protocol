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
  "digest": "af09ad5030dac42aad5da6ee660fca0b81a132c523059b8c3c4a34dd06097f69",
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

---

## 🔧 Enrichment Extensions (v0.4) — Optional

> This section defines **non-breaking** extensions for enriched artefacts. Producers MAY include these fields to enable versioning, history, chunk-level retrieval, and provenance. Consumers MUST ignore fields they do not understand.

### Added top-level sections
- `content` (object) — pointers + hashes for raw/clean/chunks
- `version` (object) — version number, timestamps, diff
- `provenance` (object) — crawl/observation details

### Extended Schema (additive)
```jsonc
{
  "id": "...",           // existing
  "title": "...",        // existing
  "summary": "...",      // existing
  "topics": [ /* ... */ ],
  "tags": [ "..." ],
  "lang": "en",
  "date": "2025-07-12",
  "version": "1.0.0",     // semantic version of this artefact file (existing)

  // NEW: Enrichment (optional)
  "content": {
    "raw": {
      "sha256": "sha256:...",                 // hash of RAW bytes
      "storage": { "href": "s3://spp-raw/example.com/2025/10/15/<hash>.html.gz", "bytes": 123456, "encoding": "gzip" }
    },
    "clean": {
      "sha256": "sha256:...",                 // hash of main text
      "storage": { "href": "s3://spp-clean/<artifactId>/4.txt.gz", "encoding": "gzip" }
    },
    "chunks": [
      { "id": "chunk-0001", "tokenCount": 812, "storage": { "href": "s3://spp-chunks/<artifactId>/4/chunk-0001.txt.gz" }, "embedding": { "href": "s3://spp-embeddings/<artifactId>/4/chunk-0001.bin" } }
    ]
  },
  "versionInfo": {                               // avoid clashing with existing "version"
    "number": 4,
    "previous": 3,
    "createdAt": "2025-10-15T08:13:00Z",
    "diff": { "href": "s3://spp-diffs/<artifactId>/4.json.gz", "format": "json-patch|unified", "changeStats": { "inserted": 120, "deleted": 42, "pct": 1.8 } }
  },
  "provenance": {
    "firstSeen": "2025-10-12T06:31:00Z",
    "lastSeen": "2025-10-15T08:31:00Z",
    "crawler": "PunkForge-Crawler/1.0",
    "etag": "\"W/abc123\"",
    "lastModified": "Wed, 15 Oct 2025 08:31:00 GMT",
    "rawHash": "sha256:..."
  }
}
```

> **Note:** This document’s original `version` field denotes the **semantic version of this `semantic.json` artefact itself**. To avoid ambiguity, the enrichment section uses `versionInfo.number` for **content versioning**. Implementations MAY use `version` for file semver and `versionInfo.number` for content history.

### Behavioural Rules
- **New content version** only when `content.raw.sha256` changes.
- **Idempotent writes**: same `(id, versionInfo.number)` MUST NOT create duplicates.
- **Diffs** SHOULD reflect **clean** text deltas.
- **Embeddings** are optional and model-agnostic; if present, annotate with `model` and `dims`.

### Minimal enriched example
```json
{
  "id": "ai-firms-licensing-treaty",
  "title": "AI firms to need licences under new global treaty",
  "summary": "Countries back move to register large AI models used in critical sectors.",
  "topics": [{"id":"technology","label":"Technology"}],
  "lang": "en",
  "date": "2025-07-12",
  "version": "1.1.0",
  "content": {
    "raw": {"sha256": "sha256:abc...", "storage": {"href": "s3://spp-raw/anchor.news/2025/07/12/abc.html.gz", "encoding":"gzip"}},
    "clean": {"sha256": "sha256:def...", "storage": {"href": "s3://spp-clean/artifacts/uuid/1.txt.gz", "encoding":"gzip"}}
  },
  "versionInfo": {"number": 1, "createdAt": "2025-07-12T10:00:00Z"},
  "provenance": {"firstSeen":"2025-07-12T10:00:00Z","lastSeen":"2025-07-12T10:00:00Z","crawler":"PunkForge-Crawler/1.0","rawHash":"sha256:abc..."}
}
```

---

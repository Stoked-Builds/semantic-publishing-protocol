# semantic-sitemap.json

**Version:** 0.2  
**Type:** Discovery Index  
**Status:** MVP-Ready  
**Applies to:** All publishers exposing semantic artifacts for discovery by agents, search tools, or endorsers.

---

## 🎯 Purpose

The `semantic-sitemap.json` file serves as a **decentralised discovery manifest**.  
It provides a machine-readable index of all semantic artifacts available for a site or publisher, including:

- Published `story.md` artifacts
- Topic vocabularies
- Semantic metadata files (`semantic.json`)
- Author or publisher identity files
- Optional media references

It is the entry point for agentic browsers or trust engines to begin semantic crawling.

---

## 🗂️ File Location

It must be hosted at the well-known path:

```
/.well-known/semantic-sitemap.json
```

---

## 📦 Schema Overview

```json
{
  "version": "0.2",
  "publisher": {
    "id": "publisher:anchor",
    "name": "Anchor News",
    "uri": "https://anchor.news"
  },
  "updated": "2025-08-04T00:00:00Z",
  "stories": [ ... ],
  "topics": "https://anchor.news/topics.json",
  "authors": [ ... ],
  "media": [ ... ]
}
```

---

## 🧠 Field Reference

| Field       | Type      | Required | Description |
|-------------|-----------|----------|-------------|
| `version`   | string    | ✅       | Sitemap schema version. |
| `publisher` | object    | ✅       | Info about the publishing entity. |
| `updated`   | string    | ✅       | ISO 8601 timestamp of last update. |
| `stories`   | array     | ✅       | List of story artifact entries. |
| `topics`    | string    | ✅       | Link to site’s `topics.json` file. |
| `authors`   | array     | ❌       | Optional links to DID/author documents. |
| `media`     | array     | ❌       | Optional media files used in semantic artifacts. |

---

## 🧾 Story Object Format

Each item in the `stories[]` array must include:

```json
{
  "id": "ai-firms-licensing-treaty",
  "title": "AI firms to need licences under new global treaty",
  "lang": "en",
  "semantic": "https://anchor.news/stories/ai-firms-licensing-treaty/semantic.json",
  "canonical": "https://anchor.news/stories/ai-firms-licensing-treaty/"
}
```

---

## 🧾 Author Object Format

```json
{
  "id": "author:priya-desai",
  "name": "Priya Desai",
  "uri": "https://anchor.news/authors/priya-desai",
  "did": "did:example:priya-desai"
}
```

---

## ✅ Validation Rules

- The root must be a valid JSON object
- Required fields (`version`, `publisher`, `updated`, `stories`, `topics`) must be present
- `stories[]` must contain `id`, `lang`, and `semantic` at minimum
- All URIs must be absolute and resolvable
- `updated` must be ISO 8601 format

---

## 🧪 Example File

```json
{
  "version": "0.2",
  "publisher": {
    "id": "publisher:anchor",
    "name": "Anchor News",
    "uri": "https://anchor.news"
  },
  "updated": "2025-08-04T00:00:00Z",
  "stories": [
    {
      "id": "ai-firms-licensing-treaty",
      "title": "AI firms to need licences under new global treaty",
      "lang": "en",
      "semantic": "https://anchor.news/stories/ai-firms-licensing-treaty/semantic.json",
      "canonical": "https://anchor.news/stories/ai-firms-licensing-treaty/"
    }
  ],
  "topics": "https://anchor.news/topics.json",
  "authors": [
    {
      "id": "author:priya-desai",
      "name": "Priya Desai",
      "uri": "https://anchor.news/authors/priya-desai",
      "did": "did:example:priya-desai"
    }
  ],
  "media": [
    "https://anchor.news/stories/ai-firms-licensing-treaty/media/featured.jpg"
  ]
}
```

---

## 🔗 Related Specs

- [story.md](./story-spec.md)
- [semantic.json](./semantic-json.md)
- [topics.json](./topics.md)
- [author-did.json](../identity/author-did.json)

---

## 🚧 Future Considerations

- Add content diff hash to enable update tracking
- Include `endorsements[]` block or trust map index
- Support compressed or chunked sitemap formats for large publishers

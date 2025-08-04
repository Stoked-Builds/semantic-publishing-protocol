# topics.json

**Version:** 0.2  
**Type:** Core Vocabulary File  
**Status:** MVP-Ready  
**Applies to:** All publishers implementing multi-topic semantic artefacts

---

## 🎯 Purpose

This spec defines the format of `topics.json`, the **site-defined topic vocabulary** used to semantically label stories, features, editorials, or other published artefacts. This list:

- Provides machine-readable context for `topics` in `story.md`
- Enables multilingual rendering of topic names
- Optionally maps local topics to **global ontologies** (e.g. Wikidata)
- Can be used for site navigation, tagging, filters, and discovery

---

## 🗂️ Location

File should be located at the **root of the content site**:

```
/topics.json
```

---

## 📦 File Format

The file is a **flat JSON array** of topic objects. Each object must define:

| Field       | Type     | Required | Description |
|-------------|----------|----------|-------------|
| `id`        | string   | ✅       | Unique local slug used in `story.md` frontmatter |
| `label`     | object   | ✅       | Multilingual label map (e.g. `{ "en": "Technology", "fr": "Technologie" }`) |
| `global`    | string   | ❌       | Optional global ontology reference (e.g. `wikidata:Q739`) |
| `weight`    | number   | ❌       | Optional relative importance or ordering hint |
| `color`     | string   | ❌       | Optional UI display color (hex or CSS class) |

---

## 🔤 Example

```json
[
  {
    "id": "technology",
    "label": {
      "en": "Technology",
      "fr": "Technologie",
      "zh": "技术",
      "he": "טכנולוגיה"
    },
    "global": "wikidata:Q739",
    "weight": 10,
    "color": "#0f172a"
  },
  {
    "id": "geopolitics",
    "label": {
      "en": "Geopolitics",
      "fr": "Géopolitique"
    },
    "global": "wikidata:Q182253",
    "weight": 8
  }
]
```

---

## 🔁 Integration with `story.md`

In `story.md`, the `topics` field must be an array of strings matching `id` values from `topics.json`.

```yaml
topics: ["technology", "geopolitics"]
```

> Agent browsers and semantic extractors should look up these `id`s in `topics.json` to obtain display labels and optional ontology mappings.

---

## 🔍 Agent Usage

Agents may:
- Render the topic label in the user’s preferred language (`label[preferred_lang]`)
- Use `global` references for cross-site clustering
- Use `weight` to prioritise display order
- Use `color` to theme badges, sections, etc.

---

## ✅ Validation Rules

A valid `topics.json` file:
- Is a valid JSON array
- Contains unique `id` values
- Has `label.en` defined at minimum
- Contains only recognised fields (extra fields MUST be ignored)

---

## 🛠 To Do

- [ ] Add example `topics.json` to repo
- [ ] Add fallback translation system for missing label keys
- [ ] Consider dynamic topic extension (e.g. AI tag suggestions)
- [ ] Add validator CLI or n8n parser for topic consistency

---

## 🔗 Related Specs

- [story.md](./story-spec.md) — where `topics[]` is used
- [semantic.json](./semantic-json.md) — topic resolution layer for agents
- [review-chain.md](./review-chain.md) — topics may be included in trust chains

---

## 🚧 Future Considerations

- Should `topics.json` be importable from trusted third-party sources?
- Should global topic vocabularies be registered under `spp.topics://` URIs?
- How do we handle collisions between similar topic slugs across sites?

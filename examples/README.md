# 📁 Examples

Canonical artefact examples for the Semantic Publishing Protocol.  
These are fully structured content folders and documents that demonstrate compliance with v0.2 core specs.

---

## 📦 Folder Structure

```plaintext
examples/
├── stories/
│   └── ai-firms-licensing-treaty/
│       ├── story.md
│       ├── semantic.json
│       ├── topics.json
│       └── media/
├── endorsement/
│   └── example-endorsement.json
├── review-chain/
│   └── example-review-chain.json
├── publisher/
│   └── metadata.json
├── identity/
│   └── author-did.json
├── semantic-blocks/
│   └── story-with-semantic-blocks.md
└── validate.nfo
```

---

## ✅ What's Included

| Folder | Description |
|--------|-------------|
| `stories/` | Complete artefact folder with `story.md`, extracted `semantic.json`, and `topics.json`. |
| `endorsement/` | Sample endorsement object using verifiable structure. |
| `review-chain/` | Example of an editorial review chain attached to a story. |
| `publisher/` | Publisher metadata including trust model and supported topics. |
| `identity/` | Author DID document showing how identities can be decentralised. |
| `semantic-blocks/` | Annotated markdown using semantic blocks for structured AI extraction. |

---

## 🧪 How to Use These

1. ✅ Use the examples to test schema extraction, validation, and agent ingestion.
2. ✅ Compare `story.md` with its generated `semantic.json`.
3. ✅ Simulate endorsements or editorial workflows using `endorsement.json` and `review-chain.json`.
4. ✅ Validate identities and resolve metadata via DID-style resolution.
5. ✅ Train or evaluate agent models to consume structured markdown with semantic blocks.

---

## 🔍 Coming Soon

- `validate.n8n` flow for automatic checking of stories, topics, and semantic output.
- `examples/validate.js` CLI for use in dev environments.
- Sample agent interface to crawl and render these examples semantically.


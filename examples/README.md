# 📁 Examples

Canonical artefact examples for the Semantic Publishing Protocol.  
These are fully structured content folders and documents that demonstrate compliance with v0.2 core specs.

---

## 📦 Folder Structure

```plaintext
examples/
├── stoked.dev/
│   ├── site.config.json
│   └── pubs/
│       ├── first-post/
│       │   └── meta.jsonld
│       └── second-post/
│           └── meta.jsonld
├── minimal/
│   ├── site.config.json
│   └── pubs/
│       └── hello/
│           └── meta.jsonld
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
├── agent-demo.js
├── json-ld-example.jsonld
└── validate.nfo
```

---

## ✅ What's Included

| Folder | Description |
|--------|-------------|
| `stoked.dev/` | **Full example** with 2 pubs and complete site configuration for reference implementation. |
| `minimal/` | **Minimal example** showing the smallest valid drop site with 1 pub. |
| `stories/` | Complete artefact folder with `story.md`, extracted `semantic.json`, and `topics.json`. |
| `endorsement/` | Sample endorsement object using verifiable structure. |
| `review-chain/` | Example of an editorial review chain attached to a story. |
| `publisher/` | Publisher metadata including trust model and supported topics. |
| `identity/` | Author DID document showing how identities can be decentralised. |
| `semantic-blocks/` | Annotated markdown using semantic blocks for structured AI extraction. |
| `agent-demo.js` | **Runnable demonstration** of AI agent parsing and processing SPP metadata. |
| `json-ld-example.jsonld` | **JSON-LD compliant** metadata example following schema.org structure. |

---

## 🧪 How to Use These

1. ✅ Use the examples to test schema extraction, validation, and agent ingestion.
2. ✅ Compare `story.md` with its generated `semantic.json`.
3. ✅ Simulate endorsements or editorial workflows using `endorsement.json` and `review-chain.json`.
4. ✅ Validate identities and resolve metadata via DID-style resolution.
5. ✅ Train or evaluate agent models to consume structured markdown with semantic blocks.
6. ✅ **Run the AI agent demo**: `node examples/agent-demo.js` to see how agents parse and process SPP metadata.

---

## 🔍 Coming Soon

<!-- Will be resolved in v0.4 -->
- `validate.n8n` flow for automatic checking of stories, topics, and semantic output.
- `examples/validate.js` CLI for use in dev environments.
- Sample agent interface to crawl and render these examples semantically.


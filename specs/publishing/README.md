# 📁 `publishing/` — Content Artifact Specifications

This folder contains all specifications related to **semantic content publishing** within the Semantic Publishing Protocol (SPP). These define how stories, metadata, endorsements, and semantic layers are authored, structured, and exposed for AI-native discovery.

---

## 🧱 Core Specs

| Spec | Summary |
|------|---------|
| [`story-spec.md`](./story-spec.md) | Canonical human-writable artifact format for all published content (Markdown + frontmatter). |
| [`topics.md`](./topics.md) | Defines how sites declare their topic vocabulary, including multilingual labels and optional ontology links. |
| [`semantic-json.md`](./semantic-json.md) | Machine-readable semantic representation extracted from `story.md` — used by agents, endorsers, and search. |

---

## 🧩 Optional Extensions

| Spec | Summary |
|------|---------|
| [`publisher-metadata.md`](./publisher-metadata.md) | Describes how a publisher exposes identity, capabilities, and attribution metadata. |
| [`review-chain.md`](./review-chain.md) | Defines a verifiable trail of review, moderation, or editorial oversight. |
| [`semantic-blocks.md`](./semantic-blocks.md) | (Experimental) Defines inline semantic markers for structuring story body content. |
| [`html-compatibility.md`](./html-compatibility.md) | Describes how to render semantic artifacts into HTML while preserving structure. |
| [`publisher-rating.md`](./publisher-rating.md) | Defines mechanisms for public trust scores, ratings, and assertions about publishers. |

---

## 🧪 Experimental or Future Work

| Spec | Summary |
|------|---------|
| `endorsement.md` | (Coming v0.3+) Will define signed trust declarations and content endorsements. |
| `review-guidelines.md` | (Planned) Editorial policy guidance for publishers implementing trust anchors. |

---

## 🛠 Recommended Order for New Publishers

1. ✅ Start with [`story-spec.md`](./story-spec.md)
2. ✅ Create a [`topics.json`](./topics.md) file for your site
3. ✅ Configure `semantic.json` generation and validation
4. 🔄 Optionally define publisher metadata and endorsements

---

## 🔗 Related Folders

- [`identity/`](../identity/) — specs for author and publisher identity (DID/WebID/etc.)
- [`agent-interface/`](../agent-interface/) — how AI browsers interact with published artifacts
- [`core/`](../core/) — protocol-wide canonical definitions

---

## 🧠 Purpose of This Folder

This is the **publisher-facing interface** of the protocol:
- Defines how to structure content for agentic AI consumption
- Enables decentralised trust, discovery, and ownership
- Keeps semantics intact across formats, platforms, and tools


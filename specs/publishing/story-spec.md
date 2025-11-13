# story.md

**Version:** 0.2  
**Type:** Core Artifact Format  
**Status:** MVP-Ready  
**Applies to:** All published story artifacts (news, features, opinion, etc.)

---

## 🎯 Purpose

This spec defines the **canonical source format** for a content artifact in the Semantic Publishing Protocol. `story.md` is intended to be human-writable, versionable, portable, and extractable into semantic JSON for machine consumption.

---

## 📦 File Structure

Each story artifact lives in its own directory, named after the `id`.

```
stories/
├── ai-firms-licensing-treaty/
│   ├── story.md
│   └── media/
│       └── featured.jpg
```

This structure ensures that each story:
- Is self-contained and portable
- Can include related media or attachments
- Can be independently versioned and endorsed

---

## 🧠 Frontmatter Schema (YAML)

```yaml
---
id: "ai-firms-licensing-treaty"       # Required. Unique slug or UUID.
title: "AI firms to need licences under new global treaty"  # Required.
summary: "Countries back move to register large AI models used in critical sectors." # Required.
topics: ["technology", "policy"]      # Required. Must match site-defined topics.json
tags: ["ai", "regulation"]            # Optional. Open vocabulary.
lang: "en"                            # Required. ISO 639-1 language code.
author: "Priya Desai"                 # Required. In v0.3+, authors may resolve to canonical IDs.
date: "2025-07-12"                    # Required. ISO 8601 format.
version: "1.0.0"                      # Required. Semantic version. Increment on meaning change.
source: "Reuters"                     # Optional. Syndication source or citation.
license: "CC-BY-4.0"                  # Optional. Defaults to site-level license if omitted.
canonical: "https://example.com/stories/ai-firms-licensing-treaty"  # Optional. Helps deduplication.
endorsements: []                      # Optional. Reserved for v0.3+ endorsement network.
archived: false                       # Optional. If true, this artifact is frozen in time.
---
```

---

## ✍️ Markdown Body

The main body of the article uses standard Markdown syntax. It supports:

- Headings (`##`, `###`, etc.)
- Inline images (from the `media/` folder)
- Markdown links
- Optional: semantic callouts, summaries, annotations (via extensions or comments)

Example:

```markdown
---

AI companies will soon face tighter regulations...

![AI infrastructure](./media/featured.jpg)

## Regulatory Pushback

Industry groups have raised concerns...
```

---

## 🔁 Semantic Extraction

All `story.md` files should be accompanied by (or convertible to) a structured semantic representation — typically `semantic.json` — for machine consumption by agents, indexers, and AI browsers.

Extraction tools must:
- Flatten the frontmatter
- Validate topics/tags
- Include a digest or hash for integrity tracking
- Normalize for multilingual rendering

---

## ✅ Validation Rules

A `story.md` file is valid if:
- The `id` matches the directory name
- All required frontmatter fields are present and correctly formatted
- Topics are defined in the site’s `topics.json`
- The file can be parsed without errors
- The `version` is semver-compliant
- The `lang` code is valid (ISO 639-1)

---

## 📘 Implementation Notes

- `story.md` is a source-of-truth for *authored* content.
- `semantic.json` is the canonical representation for *agent* systems.
- This format supports git-native versioning and diffing.
- Endorsements and multilingual variants will be handled in v0.3+.

---

## 🛠 Open Questions

- Should media (images, audio) be hash-checked in future for trust anchors?
- Should author fields support decentralised IDs (e.g. DID, WebID)?
- How do we canonicalise summaries (e.g. human vs AI-generated)?

---

## 🔗 Related Specs

- [topics.json](./topics.json) – Topic vocabularies and multilingual labels
- [semantic.json](./semantic-json.md) – Agent-facing structured artifact
- [endorsement.json](./endorsement.md) – (Upcoming) Distributed trust declarations

---

## 🚧 To Do

- [ ] Add real examples to `examples/stories/`
- [ ] Publish validator CLI
- [ ] Add n8n workflow for semantic extraction
- [ ] Define structure for future translations (`story.[lang].md`?)

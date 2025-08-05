# 📅 2025 Q3 Milestones – Semantic Publishing Protocol

This document outlines the targeted deliverables for Q3 2025, aligned with the v0.3 release of the Semantic Publishing Protocol.

---

## ✅ Goals
- Expand the core protocol via modular extensions
- Deliver validation tooling for protocol implementers
- Publish interop guides bridging SPP to adjacent ecosystems
- Prototype trust-aware UX flows powered by endorsements

---

## 🧱 v0.3 Core Modules

| Spec Module              | Description                                      | Owner | Status |
|--------------------------|--------------------------------------------------|-------|--------|
| `endorsement-chains.md` | Verifiable trust graphs, agent endorsements      | TBD   | Planned |
| `time-versioning.md`    | Temporal diffs and canonical snapshots           | TBD   | Planned |
| `ephemeral-content.md`  | Publish-once, time-limited and decayable blocks  | TBD   | Planned |
| `trust-weighting.md`    | Agent-calculated trust scores and ranking logic  | TBD   | Planned |
| `alt-content-types.md`  | Audio, video, longform, books in semantic.json   | TBD   | Planned |

---

## 🧪 Validator Tools

| Tool                | Purpose                             | Status  |
|---------------------|--------------------------------------|---------|
| `spp-validate` CLI  | Validate JSON, SPS, Markdown inputs | Planned |
| GitHub Action       | CI validation on PRs                | Planned |
| n8n Webhook         | Agent + CMS flow compatibility      | Planned |
| Test Content Corpus | Examples per extension              | Planned |

---

## 🌐 Interop Guides

| Guide                    | Target Protocol | Notes          | Status  |
|--------------------------|------------------|----------------|---------|
| `rss-to-spp.md`          | RSS              |                | Planned |
| `jsonld-to-spp.md`       | JSON-LD          | Schema bridge  | Planned |
| `activitypub-interop.md` | ActivityPub      | Mastodon etc.  | Planned |
| `indieweb-guide.md`      | Microformats     | IndieWeb stack | Planned |

---

## 🧩 UX Prototype

| Item                  | Purpose                                 | Status  |
|-----------------------|-----------------------------------------|---------|
| Endorsement Viewer    | Show trust trail and chain visualisation | Planned |
| Agent Endorsement UI  | Prototype endorsement creation workflow  | Planned |
| Graph Breadcrumb Trail| Contextual trail of who-trusts-whom      | Planned |

---

## 🚧 Out of Scope This Quarter

| Item                          | Reason for Deferral     |
|-------------------------------|--------------------------|
| Payment routing + tipping     | Slated for v0.5          |
| Reputation marketplace        | Requires plugin registry |
| SPP Lite static onboarding    | Targeted in v0.4         |

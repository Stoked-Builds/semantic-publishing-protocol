# semantic.json – Canonical Artifact Envelope

**Version:** 0.4  
**Type:** Canonical Machine Artifact  
**Status:** Draft – Implementation Aligned  
**Applies to:** Any artifact exported or exchanged under the Semantic Publishing Protocol

---

## Purpose

`semantic.json` is the canonical machine-readable record for a published artifact. It travels with the human-friendly `story.md`, powers registry ingestion, and anchors downstream trust decisions. This document describes the normative field set, validation rules, and version-negotiation expectations for producers, registries, and consuming agents.

---

## Top-Level Fields

| Field | Type | Req | Notes |
| --- | --- | --- | --- |
| `id` | string | ✅ | Stable identifier (slug, UUID, URN). MUST be unique per publisher. |
| `type` | string | ✅ | Artifact classification (e.g. `article`, `video`, `knowledge`). |
| `title` | string | ✅ | Human-readable title. |
| `summary` | string | ▫️ | Short synopsis suitable for cards / previews. |
| `spec_version` | string | ✅ | Semantic Publishing Protocol revision that produced the artifact (SemVer with optional pre-release tag). |
| `language` | string | ✅ | BCP 47 language tag. Lowercase ISO 639-1 language codes are preferred (`en`, `es-MX`). |
| `authors[]` | array<object> | ▫️ | Each entry MUST include `name`; MAY include `url`. |
| `published_at` | string (date-time) | ▫️ | Original publication timestamp. |
| `updated_at` | string (date-time) | ▫️ | Latest substantive update timestamp. |
| `topics[]` | array<string> | ▫️ | Publisher-defined topic identifiers. |
| `sections[]` | array<string> | ▫️ | Section, desk, or channel labels. |
| `media[]` | array<object> | ▫️ | Supporting media assets. Each item MUST include `url`, MAY carry `role`, `credit`, `license`. |
| `content` | object | ✅ | Contains the canonical textual payload. See [Content](#content) for detail. |
| `links[]` | array<object> | ✅ | At least one relation. Each entry MUST include `rel` + `href`. |
| `provenance` | object | ✅ | Crawl, adoption, and lineage metadata. See [Provenance](#provenance). |
| `signatures[]` | array<object> | ✅ | Registry-signed statements. See [Signatures](#signatures). |
| `endorsements[]` | array<object> | ▫️ | Downstream endorsements. Optional in v0.4. |
| `version` | integer ≥ 1 | ✅ | Monotonic artifact version number controlled by the publisher. |
| `extensions` | object | ▫️ | Namespaced vendor or experimental fields. Keys SHOULD follow reverse-DNS (`com.example.foo`). |

▸ **Legend:** ✅ required, ▫️ optional.

---

## Content

```jsonc
"content": {
  "format": "markdown" | "html" | "text",
  "value": "<string>"
}
```

- `format` **MUST** be one of `markdown`, `html`, or `text`.
- `value` **MUST** contain the full canonical body suitable for downstream rendering or enrichment.

---

## Provenance

```jsonc
"provenance": {
  "mode": "reconstructed" | "claimed" | "adopted" | "authoritative",
  "content_hash": "sha256:<64 hex>",
  "registry_id": "<domain>",
  "adapter_id": "<string>",
  "collected_at": "<RFC 3339 timestamp>",
  "source_url": "<uri>",          // required unless mode === "authoritative"
  "snapshot_uri": "<uri>",
  "publisher_did": "did:<method>:<id>",
  "capture_method": "<string>",
  "captured_at": "<RFC 3339 timestamp>",
  "reconstruction_confidence": 0.0 – 1.0,
  "adoption": { "$ref": "https://spp.dev/schemas/adoption.json" }
}
```

- `content_hash` MUST carry a SHA-256 digest prefixed with `sha256:` and computed against the canonical payload.
- `registry_id` MUST be a valid host that the registry can prove control over (DNS TXT or `.well-known/spp/` proof).
- `adapter_id` identifies the software agent responsible for capture or ingestion (`vendor.tool/semver`).
- `source_url` is mandatory for any non-authoritative mode to aid corroboration.
- `adoption` follows the canonical [Adoption schema](../../schemas/adoption.json) and is required when `mode` is `adopted`.

---

## Signatures

```jsonc
"signatures": [
  {
    "signer": "<registry_id or key id>",
    "key_id": "<string>",
    "sig": "<base64url>",
    "signedAt": "<RFC 3339 timestamp>"
  }
]
```

- The first signature **MUST** be issued by the origin registry (`signer === provenance.registry_id`).
- `sig` MUST be a base64url-encoded string between 16 and 1024 characters.
- `signedAt` uses the `date-time` format and SHOULD reflect the point of signing, not capture.

---

## `spec_version` Semantics

- `spec_version` records the highest SPP revision the artifact complies with. Use SemVer (`MAJOR.MINOR.PATCH`) and optional pre-release identifiers (`-draft.3`).
- Producers **MUST NOT** advertise a version they do not fully implement.
- Registries **MUST** publish the range they support (see [Registry Negotiation](#registry-negotiation)) and **MUST** return `406 Not Acceptable` with Problem Details when an artifact declares a higher `spec_version`.
- Consumers **SHOULD** down-negotiate by requesting artifacts at a mutually supported version where available.
- For pre-release values (e.g., `1.0.0-rc.1`), registries MAY treat them as opt-in. Artifacts using pre-release tags SHOULD only be accepted by registries explicitly signalling support.

---

## Example Artifact

```json
{
  "id": "urn:spp:anchor.news:ai-firms-licensing-treaty",
  "type": "article",
  "title": "AI firms to need licences under new global treaty",
  "summary": "Countries back a move to register large AI models used in critical sectors.",
  "spec_version": "0.4.0",
  "language": "en",
  "authors": [
    {
      "name": "Priya Desai",
      "url": "https://anchor.news/authors/priya-desai"
    }
  ],
  "published_at": "2025-07-12T08:30:00Z",
  "topics": ["technology", "policy"],
  "content": {
    "format": "markdown",
    "value": "Countries back a move to register large AI models used in critical sectors..."
  },
  "links": [
    { "rel": "canonical", "href": "https://anchor.news/stories/ai-firms-licensing-treaty" }
  ],
  "provenance": {
    "mode": "adopted",
    "source_url": "https://anchor.news/stories/ai-firms-licensing-treaty",
    "collected_at": "2025-07-12T09:20:00Z",
    "registry_id": "registry.anchor.news",
    "adapter_id": "anchor.scraper/1.4.0",
    "content_hash": "sha256:5feceb66ffc86f38d952786c6d696c79d8ea5f160b2498b67ae713d2f3aa2f12",
    "snapshot_uri": "https://cdn.anchor.news/snapshots/ai-firms-licensing-treaty.json"
  },
  "signatures": [
    {
      "signer": "registry.anchor.news",
      "key_id": "ed25519-2025-Q3",
      "sig": "YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4YWJjZA",
      "signedAt": "2025-07-12T09:20:05Z"
    }
  ],
  "version": 4
}
```

---

## Validation Rules

- Artifacts **MUST** validate against the canonical schema at [`schemas/semantic.json`](../../schemas/semantic.json).
- `version` is a positive integer and **MUST** increase monotonically with each significant content change.
- `links` **MUST** contain at least one entry with a resolvable `href`.
- `language` SHOULD remain lowercase for primary sub-tags; additional subtags MAY use case conventions required by BCP 47.
- Registries **MUST** verify that `content_hash` matches the canonical payload before accepting signatures.
- Extended metadata MUST reside under `extensions`. Unknown namespaces MUST be ignored by consumers.

---

## Registry Negotiation

- Registries advertise their supported `spec_version` range via `.well-known/spp/registry.json` (see [`specs/registry/federation.md`](../registry/federation.md)).
- During ingestion, registries **MUST** compare the artifact’s `spec_version` to their supported range:
  - If the artifact declares a higher MAJOR version, respond with `406` and Problem Details (`type`: `https://spp.dev/problems/spec-version/unsupported`).
  - If the artifact declares an unsupported MINOR or pre-release, registries MAY offer downgrades or staged queues.
- Producers should maintain backward-compatible pipelines where feasible so they can emit artifacts for older registry partners until support converges.

---

## Related Specifications

- [`schemas/semantic.json`](../../schemas/semantic.json) – canonical JSON Schema definition.
- [`specs/SPP-Versions.md`](../SPP-Versions.md) – protocol versioning policy.
- [`specs/registry/federation.md`](../registry/federation.md) – discovery and negotiation flows.
- [`specs/registry/architecture.md`](../registry/architecture.md) – registry obligations and lifecycle.
- [`docs/trust-and-signatures.md`](../../docs/trust-and-signatures.md) – implementation guidance for signing and verification.

---

## Change Log

- **0.4** – Adds mandatory `spec_version`, clarifies integer `version`, and tightens provenance + signature requirements. Examples updated to match the canonical schema.


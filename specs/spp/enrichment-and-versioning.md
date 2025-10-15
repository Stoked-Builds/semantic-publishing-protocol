# Enrichment & Versioning — SPP v0.4 (Draft)

**Spec Code:** spp/enrichment-and-versioning  
**Status:** Draft for implementation  
**Applies to:** Artefacts registered in SPP registries and/or published alongside content (e.g., `.well-known/semantic/`)

---

## 1. Purpose
This extension elevates SPP from a registry-of-URLs to a **versioned, queryable content archive**. It standardises how implementations persist raw snapshots, normalised (clean) text, chunked semantics, and change history over time, with clear provenance and integrity fields that can be signed and endorsed.

Goals:
- Durable, reproducible **snapshots** of content (raw bytes + hashes)
- Normalised **clean text** for language/LLM processing
- Stable **chunks** for retrieval-augmented search and embedding
- Deterministic **versioning** keyed by content hash (idempotent writes)
- Optional **diffs** between versions for efficient sync & auditing
- Verifiable **provenance** (first/last seen, etag/last-modified, crawler)

---

## 2. Terminology
- **Raw Snapshot**: The exact bytes fetched from the source (HTML/JSON/RSS/etc.), typically gzipped at rest.
- **Clean Text**: Boilerplate-stripped text content derived from the raw snapshot.
- **Chunk**: A bounded text span (e.g., ~800–1200 tokens) with stable `chunkId`, suitable for vector indexing.
- **Version**: Monotonic integer per artefact (`1,2,3,...`) created only when raw content changes.
- **Provenance**: Fields describing how/when/with-what the content was observed.

---

## 3. `semantic.json` — Schema Extensions
These fields are **optional** but RECOMMENDED for enriched artefacts. They extend the base `semantic.json` without breaking existing producers.

```jsonc
{
  "id": "urn:spp:artifact:uuid",
  "type": "article",                     // or other content types
  "canonical": "https://example.com/x",
  "metadata": {
    "title": "...",
    "byline": "...",
    "language": "en",
    "published": "2025-10-15T07:00:00Z",
    "updated": "2025-10-15T08:12:00Z",
    "contentType": "text/html"
  },
  "content": {
    "raw": {
      "sha256": "sha256:...",           // hash of RAW bytes
      "storage": {
        "href": "s3://spp-raw/example.com/2025/10/15/<hash>.html.gz",
        "bytes": 123456,
        "encoding": "gzip"
      }
    },
    "clean": {
      "sha256": "sha256:...",           // hash of CLEAN text
      "storage": {
        "href": "s3://spp-clean/<artifactId>/4.txt.gz",
        "encoding": "gzip"
      }
    },
    "chunks": [
      {
        "id": "chunk-0001",
        "tokenCount": 812,
        "storage": { "href": "s3://spp-chunks/<artifactId>/4/chunk-0001.txt.gz" },
        "embedding": { "href": "s3://spp-embeddings/<artifactId>/4/chunk-0001.bin" }
      }
    ]
  },
  "version": {
    "number": 4,
    "previous": 3,
    "createdAt": "2025-10-15T08:13:00Z",
    "diff": {
      "href": "s3://spp-diffs/<artifactId>/4.json.gz",
      "format": "json-patch|unified",
      "changeStats": { "inserted": 120, "deleted": 42, "pct": 1.8 }
    }
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

**Notes**
- `content.raw.sha256` is the canonical **content hash** used for idempotency and versioning decisions.
- Storage pointers MAY use any scheme (`s3://`, `ipfs://`, `https://`), but SHOULD be dereferenceable by the receiving agent.
- Embeddings are optional and model-agnostic; `embedding` MAY include `{ "model": "text-embedding-3-large", "dims": 3072 }`.

---

### 3.2 Processing Architecture (Recommended)

Implementations MAY separate artefact processing into three idempotent stages that communicate via queues/events:

| Stage       | Input                         | Output              | Core responsibility |
|-------------|-------------------------------|---------------------|---------------------|
| **Ingest**  | HTTP source (URL → response)  | `version-created`   | Fetch & store raw snapshot; compute `content.raw.sha256`; create minimal DB row/manifest pointer |
| **Enrichment** | `version-created`          | `version-enriched`  | Extract clean text + normalized metadata; chunk; (if prev) diff; write per-version manifest |
| **Embeddings** | `version-enriched`         | `version-embedded` *(optional)* | Generate vectors and persist embedding pointers |

Each event MUST include at least `{ artifactId, version, rawSha256, s3RawKey }` and SHOULD use deterministic `jobId`s. Storage writes MUST be idempotent. See `docs/pipeline.md` for the reference flow.

---

## 4. Versioning Rules

**4.1 New version condition**  
Create a new version **only** if the **raw snapshot hash** differs from the latest persisted version:
```
if sha256(raw_bytes) != latest.version.content_sha256 → version = latest.version + 1
else → do not create a new version (update lastSeen only)
```

**4.2 Minor vs Major**  
- **Major** change: `raw` differs → increment `version.number`.
- **Minor** (metadata-only) change: `raw` same but metadata differs → MAY record as metadata patch (no new `version.number`).

**4.3 Diffing**  
If `version.number > 1`, implementers SHOULD store a `diff` between current and previous **clean** text. Format MAY be `json-patch` or unified diff. Include summary stats.

**4.4 Idempotency**  
Writes MUST be idempotent: same `(artifactId, version)` and same `raw.sha256` MUST NOT produce duplicate versions or blobs.

---

## 5. Provenance & Integrity
- `provenance.firstSeen` / `lastSeen`: ISO 8601, UTC.
- `etag` / `lastModified`: lifted from HTTP response headers when present.
- `crawler`: SHOULD identify the user-agent/version used.
- `rawHash`: duplicate of `content.raw.sha256` for quick lookup.

**Signatures & Endorsements**  
When producing endorsements or signatures over artefacts, include:
- `id`, `canonical`, `version.number`, `content.raw.sha256`
This binds trust objects to a specific immutable content state.

---

## 6. Compliance
A registry/node is **Enrichment v0.4 compliant** if it:
1. Persists `content.raw.sha256` and uses it to decide versioning.
2. Exposes storage pointers for `raw` and `clean` (chunks optional).
3. Populates `version.number` and `provenance.{firstSeen,lastSeen}`.
4. (SHOULD) Emits diffs and chunk manifests.

---

## 7. API Additions (summary)
Implementations SHOULD provide endpoints (or manifests) to retrieve version lists and per-version manifests:
- `GET /artifacts/{id}/versions` → array of `{ version, createdAt }`
- `GET /artifacts/{id}/versions/{v}/manifest` → the object above (or a minimal pointer map)

See `openapi/registry.yml` for canonical definitions.

---

## 8. Backwards Compatibility
All fields in this extension are optional. Producers without enrichment remain valid. Consumers MUST ignore unknown fields and SHOULD prefer enriched data when present.

---

## 9. Security & Robots
- Respect `robots.txt` and `Cache-Control: no-archive` where policy requires; document site-level exceptions.
- Rate-limit per domain; handle legal takedown by tombstoning the artefact (retain hash and provenance).

---

## 10. Examples
Provide at least one minimal and one full manifest in `examples/enrichment/` (out of scope of this file; tracked in docs).



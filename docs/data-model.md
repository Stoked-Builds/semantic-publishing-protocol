# Data Model — Enrichment & Versioning (v0.4)

This document defines the canonical entities and relationships for SPP implementations that support the **Enrichment Layer**.

## Entity Graph

```
Publisher ─┬─> Artifact (id, url, domain, first_seen, last_seen, latest_version, status)
          │
          └─> Endorsement (optional)

Artifact 1 ── * ArtifactVersion (artifact_id FK, version, content_sha256, created_at, ...)
                   │
                   ├─ 1 RawSnapshot     (s3_key, bytes, content_type, encoding, sha256)
                   ├─ 1 CleanText       (s3_key, bytes, sha256, lang)
                   ├─ * ArtifactChunk   (chunk_id, start, end, token_count, s3_key)
                   ├─ 0..1 Diff         (s3_key, format, inserted, deleted, pct)
                   └─ 0..* EmbeddingRef (chunk_id, model, dims, s3_key)
```

## Tables (reference DDL)
> Names/keys are normative; types are suggestive.

### `artifacts`
- `id UUID PK`
- `url TEXT UNIQUE NOT NULL`
- `canonical_url TEXT NULL`
- `domain TEXT NOT NULL`
- `type TEXT DEFAULT 'article'`
- `first_seen TIMESTAMPTZ NOT NULL`
- `last_seen TIMESTAMPTZ NOT NULL`
- `latest_version INT DEFAULT 0`
- `status TEXT DEFAULT 'active'`  // active|invalid|tombstoned
- Indexes: `(domain, first_seen DESC)`, `(last_seen DESC)`

### `artifact_versions`
- `id UUID PK`
- `artifact_id UUID NOT NULL REFERENCES artifacts(id) ON DELETE CASCADE`
- `version INT NOT NULL`
- `content_sha256 TEXT NOT NULL`          // sha256 of RAW bytes
- `created_at TIMESTAMPTZ NOT NULL`
- `title TEXT`, `byline TEXT`, `lang TEXT`
- `published_at TIMESTAMPTZ`, `updated_at TIMESTAMPTZ`
- `http_status INT`, `content_type TEXT`
- `etag TEXT`, `last_modified TEXT`
- `raw_bytes INT`, `clean_bytes INT`
- Constraints: `UNIQUE(artifact_id, version)`
- Indexes: `(artifact_id, version DESC)`, `(content_sha256)`

### `artifact_chunks`
- `id UUID PK`
- `artifact_id UUID NOT NULL REFERENCES artifacts(id) ON DELETE CASCADE`
- `version INT NOT NULL`
- `chunk_id TEXT NOT NULL`                 // deterministic (sha1 of ranges)
- `start INT NOT NULL`, `end INT NOT NULL`
- `token_count INT NOT NULL`
- `s3_key TEXT NOT NULL`                   // pointer to gzipped chunk text
- `embedding_ref TEXT NULL`                // pointer to vector file or index row id
- Constraints: `UNIQUE(artifact_id, version, chunk_id)`
- Indexes: `(artifact_id, version)`, `(chunk_id)`

### `artifact_diffs`
- `artifact_id UUID NOT NULL`
- `version INT NOT NULL`
- `format TEXT NOT NULL`                   // json-patch|unified
- `inserted INT NOT NULL`, `deleted INT NOT NULL`, `pct REAL NOT NULL`
- `s3_key TEXT NOT NULL`
- Constraints: `PRIMARY KEY (artifact_id, version)`

> Raw and Clean text are stored in object storage; their sizes are recorded in `artifact_versions`.

## Object Storage Pointers
- **RawSnapshot** → `spp-raw/raw/<domain>/<yyyy>/<mm>/<dd>/<sha256>.<ext>.gz`
- **CleanText** → `spp-clean/clean/<artifactId>/<version>.txt.gz`
- **ChunkText** → `spp-chunks/chunks/<artifactId>/<version>/<chunkId>.txt.gz`
- **Diff** → `spp-diffs/diffs/<artifactId>/<version>.json.gz`
- **Manifest** → `spp-artifacts/artifacts/<artifactId>/<version>.json.gz`
- **Embeddings** → `spp-embeddings/emb/<artifactId>/<version>/<chunkId>.bin` (or parquet per version)

## Version Semantics
- New `ArtifactVersion` is created **only when** the raw snapshot hash changes.
- `artifacts.latest_version` is updated accordingly; `last_seen` is always refreshed.
- Metadata-only tweaks MAY be captured without new raw/clean blobs.

Implementations MAY track stage progression timestamps per version, e.g. `enriched_at TIMESTAMPTZ`, `embedded_at TIMESTAMPTZ`, and a `processing_status` field (e.g., `snapshot|enriched|embedded|invalid`). These are optional and do not affect wire compatibility.

## Idempotency & Integrity
- All writes keyed by `(artifact_id, version)`; use UPSERT.
- Object keys are deterministic; S3 writes SHOULD use put-if-absent.
- Hashes:
  - `content_sha256` = SHA-256 of raw bytes
  - `clean_sha256` (object metadata) = SHA-256 of clean text

## Retrieval Contracts
- `GET /v1/artefacts/{id}` → latest state
- `GET /v1/artefacts/{id}/versions` → list of `{ version, created_at }`
- `GET /v1/artefacts/{id}/versions/{v}/manifest` → pointer map for that version

---

_This document is normative for field names and relationships; storage/indexes may vary._
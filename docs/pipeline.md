


# Enrichment Pipeline (v0.4)

This document specifies the **reference pipeline** for producing enriched, versioned artefacts compatible with SPP v0.4. Each stage is idempotent and emits structured outputs to Postgres and MinIO/S3.

## Stages

1. **Fetch**
   - Input: URL (and optional `etag` / `last-modified`)
   - Output: `{ rawBytes, headers, httpStatus }`
   - Notes: set UA; 20s timeout; follow redirects; respect robots.

2. **Hash & Decide Version**
   - Compute `raw_sha256 = sha256(rawBytes)`.
   - Look up latest version; **if same hash → skip version**, update `lastSeen`.
   - Else, `version = latest + 1`.

3. **Persist Raw Snapshot**
   - Write `rawBytes.gz` to `spp-raw/raw/<domain>/<yyyy>/<mm>/<dd>/<sha256>.<ext>.gz`.
   - Set metadata: `Content-Type`, `Content-Encoding: gzip`, `x-spp-raw-hash`.

4. **Extract Clean Text & Metadata**
   - Use readability-style DOM heuristics.
   - Extract: title, byline, language, published/updated dates.
   - Persist `clean.txt.gz` to `spp-clean/clean/<artifactId>/<version>.txt.gz` with `x-spp-clean-hash`.

5. **Chunking**
   - Split clean text into ~800–1200 token chunks, 10–15% overlap.
   - `chunkId = sha1(artifactId|version|start|end)`.
   - Persist to `spp-chunks/chunks/<artifactId>/<version>/<chunkId>.txt.gz`.

6. **Diff vs Previous (if any)**
   - Diff clean text using Myers or similar; summarise `{ ins, del, pct }`.
   - Persist to `spp-diffs/diffs/<artifactId>/<version>.json.gz`.

7. **Manifest**
   - Compose per-version manifest (pointers + hashes) and write to `spp-artifacts/artifacts/<artifactId>/<version>.json.gz`.

8. **(Optional) Embeddings**
   - Queue `embed-chunks` jobs; write vectors per chunk to `spp-embeddings/emb/<artifactId>/<version>/<chunkId>.bin` or a batch parquet.

## Idempotency Rules
- Keys and DB rows are deterministic and unique per `(artifactId, version)`.
- S3 writes use put-if-absent; DB uses `INSERT … ON CONFLICT DO UPDATE`.

## Error Handling
- Network/timeouts → retry with exponential backoff.
- Invalid dates → omit field (never throw); log with `code/errno/syscall`.
- Parser failure → mark artefact `invalid` with reason; do not retry endlessly.

## DB Sketch
- `artifacts(id PK, url UNIQUE, domain, first_seen, latest_version, status)`
- `artifact_versions(id PK, artifact_id FK, version INT, content_sha256, created_at, title, published_at, updated_at, etag, last_modified, content_type, raw_bytes INT, clean_bytes INT)`
- `artifact_chunks(id PK, artifact_id FK, version INT, chunk_id TEXT, start INT, end INT, token_count INT, s3_key TEXT, embedding_ref TEXT)`

## API Touchpoints
- `GET /artifacts/{id}/versions` → list versions
- `GET /artifacts/{id}/versions/{v}/manifest` → pointer map

## Compliance
An implementation is pipeline-compliant if it:
1) decides versions by raw hash; 2) writes raw + clean + manifest; 3) maintains provenance; 4) keeps writes idempotent; 5) never crashes on malformed inputs.

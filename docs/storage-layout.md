

# Storage Layout (MinIO/S3) — Enrichment v0.4

This document standardises bucket/prefix conventions for raw snapshots, clean text, chunks, embeddings, diffs, and versioned manifests.

## Buckets
- **`spp-raw`** — raw snapshots (gzipped)
- **`spp-clean`** — normalised text (gzipped)
- **`spp-chunks`** — per-chunk text (gzipped)
- **`spp-embeddings`** — per-chunk vectors (binary/parquet)
- **`spp-diffs`** — clean-text diffs between versions (gzipped)
- **`spp-artifacts`** — per-version manifests (gzipped JSON)

## Keys
```
# raw snapshot (by domain + date + content hash)
raw/<domain>/<yyyy>/<mm>/<dd>/<sha256>.<ext>.gz

# clean text (by artifact/version)
clean/<artifactId>/<version>.txt.gz

# chunk text (by artifact/version/chunk)
chunks/<artifactId>/<version>/<chunkId>.txt.gz

# embeddings (one file per chunk or batch per version)
emb/<artifactId>/<version>/<chunkId>.bin
# or
emb/<artifactId>/<version>/embeddings.parquet

# diffs (between previous and current clean text)
diffs/<artifactId>/<version>.json.gz

# per-version manifest (semantic pointers)
artifacts/<artifactId>/<version>.json.gz
```

## Metadata
Set object metadata when writing:
- `Content-Type` (e.g., `text/html`, `text/plain`, `application/json`)
- `Content-Encoding: gzip` when applicable
- `x-spp-raw-hash: sha256:...` (for raw)
- `x-spp-clean-hash: sha256:...` (for clean)
- `x-spp-model: <embedding-model>` (for vectors)

## Lifecycle (recommendations)
- `spp-raw`: retain 90 days (or as policy requires); large footprint
- `spp-clean`, `spp-chunks`, `spp-artifacts`: retain indefinitely
- `spp-embeddings`: retain; rebuildable but costly
- `spp-diffs`: retain ≥180 days for audit

## Idempotency
- Keys MUST be deterministic
- Writers MUST use put-if-absent semantics
- Duplicate writes with same hash MUST NOT create new objects

## Security
- Private by default; expose via API or signed URLs
- Respect takedowns by tombstoning manifests and revoking public access

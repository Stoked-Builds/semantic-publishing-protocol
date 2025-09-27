# Conformance Tests — SPP v0.4

This document defines the minimum conformance requirements for a registry implementing SPP v0.4.

## Artifact Validation
- MUST validate artifacts against `schemas/extensions/registry/semantic.json`.
- MUST verify `signatures[]` using JCS/Ed25519; first signature MUST be the origin registry.
- MUST enforce required `provenance.*` fields.

## Signing & Canonicalisation
- MUST canonicalise JSON (RFC 8785) before signing/verifying.
- MUST reject signatures over non-canonical JSON.

## Peering
- MUST implement `/api/peer/lookup?artifact_hash=...` with success + 404/409/429 cases.
- MUST enforce trust scoring thresholds (baseline 10, probation 14d, ±15 daily cap, thresholds 70/30).
- MUST require corroboration from ≥2 peers for scores in [30,70).

## Plugins / Adapters
- MUST run adapters in isolated containers with RO FS, CPU/mem/time caps.
- MUST enforce `networkDomains` egress allowlists.
- MUST NOT grant DB/object-store credentials directly.
- MUST validate `adapter-manifest.json` before execution.

## Transparency & Erasure
- MUST log peering, tasks, usage, and erasure events in append-only transparency log.
- MUST create immutable tombstone events on erasure.

## Identity
- MUST serve `/.well-known/spp/registry.json` and signed JWKS.
- MUST provide DNS TXT or `/.well-known/spp/key.json` proof of registry_id control.
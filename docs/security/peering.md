# Peering Security (v0.4)

This document defines mandatory guardrails for accepting artifacts from other registries.

## 1) Inbound Validation (MUST)
- Validate against the SPP Artifact schema.
- Validate `provenance`: `registry_id` (domain), `adapter_id`, `collected_at`, `content_hash` (`sha256:...`), and at least one valid signature.
- Signature payload (JCS): `{content_hash, registry_id, collected_at}`. Algorithm: Ed25519 (recommended).
- Reject on any failure; do not store or re-share.

## 2) Trust Scoring
- Baseline score = 10; probation = 14 days with throughput caps (e.g., 20 artifacts/day).
- Asymmetric decay: bad events half-life 60d; good 7d; daily movement cap ±15.
- Consecutive bad events increase penalties exponentially (capped).
- Endorsements from trusted registries carry higher weight.

## 3) Corroboration & Thresholds
- **Corroboration:** For intermediate-trust peers, require corroboration (≥2 trusted registries) via `/peer/lookup?artifact_hash=...` before re-sharing.
- If peer score ≥70 → accept immediately.
- If 30 ≤ score &lt; 70 → require corroboration by ≥2 trusted peers via `/peer/lookup?artifact_hash=...`.
- If score &lt; 30 → quarantine or reject.
- Maintain audit logs for rejected/quarantined artifacts.

## 4) Gossip & Rehabilitation
- Share aggregate misbehaviour stats with peers (optional).
- Scores decay back toward neutral over time to allow recovery after fixes.

## 5) Registry Identity
- `registry_id` MUST be a valid domain name with DNS TXT or `.well-known/spp` proof of the public key.
- Excessive key rotations decrease trust.


## 6) Endorsements (v0.4)
- Inline endorsements MAY be included and MUST be independently verifiable (signed objects over `artifact_hash`).
- Future versions will add endorsement logs and gossip protocols.


## Trust Scoring Parameters (v0.4)

| Parameter                    | Value           | Notes                                         |
|-----------------------------|-----------------|-----------------------------------------------|
| Baseline score              | 10              | New peers start low                           |
| Probation period            | 14 days         | Throughput cap ~20 artifacts/day              |
| Daily score movement cap    | ±15             | Limits gaming by bursts                       |
| Good event half-life        | 7 days          | Faster decay for positives                    |
| Bad event half-life         | 60 days         | Penalties persist longer                      |
| Immediate-accept threshold  | 70              | No corroboration required                     |
| Quarantine threshold        | 30              | Below this, quarantine or reject              |
| Corroboration quorum        | 2 peers         | Distinct trusted registries                   |
| Endorsement weighting       | Tiered (×5/×3/×1) | Long-trusted > reviewed > new/unknown       |

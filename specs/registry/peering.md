# Semantic Publishing Protocol — Registry Peering (v0.4)

## Status
- **Version:** 0.2-draft
- **Stage:** Draft (subject to change)
- **Normative:** Yes
- **Dependencies:** SPP-Core, SPP-Federation, SPP-Transparency

This module is additive to SPP v0.3 federation and does not break existing federation implementations (semver: MINOR).

---

## 1. Introduction

This module defines **registry-to-registry peering** within SPP.  
Peering enables registries to:
- exchange capabilities (crawl, enrich, store, index, gateway),
- offload tasks to each other,
- reconcile usage records,
- and propagate transparency proofs.

Harvesting (OAI-PMH style) remains the baseline for interoperability.  
Peering is **optional** and complements federation.

---

## 2. Peer Descriptor

Each registry MUST expose a signed **PeerDescriptor** object.  
It declares identity, capabilities, endpoints, policies, and optional cost hints.

- Descriptor MUST be served at `/.well-known/spp/registry.json`.
- Descriptor MUST be signed with a detached JWS over canonical JSON.
- Descriptor MUST include a `version` string and `peer_id` (DID or TLS-bound identifier).

Schema: [`peer-descriptor.json`](../../schemas/peer-descriptor.json).

---

## 3. Peering Handshake

### 3.1 Endpoint
- `POST /.well-known/spp/handshake`

### 3.2 Request
- Payload: signed `PeerDescriptor`.
- MUST include `nonce`, `ts`, and `idempotency_key`.

### 3.3 Response
- Own signed `PeerDescriptor`.
- A scoped `peer_token` (JWT or DPoP).
- Optional `retry_after` header if capacity is limited.

### 3.4 Validation
- Registries MUST reject if:
  - Signature invalid,
  - Timestamp outside ±120s,
  - Nonce previously seen.

Transparency event: `PEER_HANDSHAKE`.

---

## 4. Task Offload

### 4.1 Offers
- `POST /api/peering/offers`  
- Payload: `TaskOffer` (see [`task-offer.json`](../../schemas/task-offer.json)).  
- Task kinds: `crawl`, `enrich`, `store`.

### 4.2 Agreements
- `POST /api/peering/agreements/:id/accept`  
- Payload: `TaskAgreement` (see [`task-agreement.json`](../../schemas/task-agreement.json)).

### 4.3 Results
- `POST /api/tasks/:id/callback`  
- Payload: `TaskResult` (see [`task-result.json`](../../schemas/task-result.json)).  
- MUST include model/container attestation for enrichments.  
- MUST include hashes of inputs and outputs.  
- MUST be logged in transparency log.

### 4.4 Determinism
- Tasks SHOULD include `depends_on` (minimal DAG).  
- Results MUST include `replay_of` if re-running prior task.  

Transparency events: `TASK_OFFERED`, `TASK_ACCEPTED`, `TASK_RESULTED`.

---

## 5. Usage Records

- `GET /api/usage/records?since=<ts>`  
- Payload: array of `UsageRecord` (see [`usage-record.json`](../../schemas/usage-record.json)).  
- MUST be signed.  
- MUST include monotonic counters.  
- Retention: minimum 90 days.

Transparency event: `USAGE_RECORDED`.

---

## 6. Artifact Exchange

- All artifacts MUST be content-addressed (`sha256:<digest>`).  
- Push: `POST /api/push/artifacts` (header + bytes or `source_url`).  
- Pull: `GET /api/artifacts/:cid` with Range support.  
- Peers MAY redirect to storage tier.  
- Fetchers MUST validate MIME and size, and reject unknown schemes.

---

## 6a. Artifact Corroboration

Registries MUST implement a corroboration endpoint to verify artifact hashes observed by independent peers.

### Endpoint
- `GET /api/peer/lookup?artifact_hash=<sha256>`

### Response
```json
{
  "artifact_hash": "sha256:...",
  "registry_id": "example.org",
  "observed_at": "2025-09-27T10:00:00Z",
  "sig": "base64..."
}
```

#### Errors
- `404 SPP_ARTIFACT_UNKNOWN` — peer has no record of the artifact hash.
- `409 SPP_HASH_MISMATCH` — peer has a conflicting record for this artifact (hash differs from its known record).
- `429 SPP_RATE_LIMIT` — caller exceeded lookup rate limits; respect `Retry-After`.

### Rules
- Peers with trust score ≥70 MAY accept artifacts without corroboration.
- Peers with trust score 30–70 MUST require corroboration from ≥2 distinct trusted registries.
- Peers with trust score <30 MUST quarantine or reject artifacts.
- Registries SHOULD log corroboration lookups and responses for audit.

---

## 7. Erasure

- `DELETE /api/artifacts/:cid` MUST create a tombstone transparency event.  
- Bytes SHOULD be erased where feasible.  
- Tombstones MUST be immutable.

---

## 8. Security

- All inter-peer requests MUST use HTTPS.  
- All payloads MUST be signed with HTTP Signatures and detached JWS.  
- Payloads MUST include `nonce`, `ts`, and `idempotency_key`.  
- Registries MUST implement anti-replay caches.  
- Registries MUST enforce per-peer quotas and return 429 + Retry-After.  
- Registries MUST validate remote fetches to prevent SSRF.

---

## 9. Canonical JSON & Signing

**Canonicalisation.** All signed JSON payloads MUST use RFC 8785 JSON Canonicalization Scheme (JCS).

**HTTP Signatures.** Peers MUST sign requests using HTTP Signatures with `ed25519`. The covered components MUST include: `(request-target)`, `date`, `digest`, `x-idempotency-key`, `x-nonce`. Clocks MAY drift by ±120s; requests outside this window MUST be rejected.

**Detached JWS.** JSON bodies that are persisted (PeerDescriptor, TaskOffer, TaskAgreement, TaskResult, UsageRecord) MUST carry a detached JWS over their JCS form.

---

## 10. Identity & Keys

`peer_id` MUST be either:
- `did:web:<host>...` (RECOMMENDED), or
- `tls-pubkey:sha256:<lowercase-hex>` (SHA-256 of the peer’s TLS leaf public key).

Peers MUST expose a rotating JWKS at `/.well-known/spp/jwks.json`. Old keys MUST remain valid for ≥7 days after rotation.

---

## 11. Error Model

| HTTP | Code                        | Meaning                          | Client Action             |
|-----:|-----------------------------|----------------------------------|---------------------------|
| 400  | SPP_SCHEMA_INVALID          | Fails JSON Schema validation     | Fix payload               |
| 401  | SPP_AUTH_REQUIRED           | Missing/invalid signature/token  | Re-auth/sign              |
| 403  | SPP_POLICY_DENY             | Violates policy/caps             | Do not retry              |
| 409  | SPP_IDEMPOTENT_REPLAY       | Reused idempotency key           | Change key                |
| 413  | SPP_OBJECT_TOO_LARGE        | Too big                          | Reduce size               |
| 415  | SPP_UNSUPPORTED_MIME        | MIME rejected                    | Change MIME               |
| 429  | SPP_RATE_LIMIT              | Quota exceeded                   | Honor `Retry-After`       |
| 503  | SPP_BACKPRESSURE            | Temporary capacity issue         | Honor `Retry-After`       |

---

## 12. Headers

Clients MUST send:
- `Date`
- `Digest: SHA-256=<base64>` for non-empty bodies
- `X-Idempotency-Key` (UUID v4)
- `X-Nonce` (128-bit random, single-use within 10 min)

Servers MUST return `Retry-After` on 429/503.
Servers MAY also include `X-RateLimit-Remaining` and related headers for client backoff heuristics.

---

## 13. Content Addressing

Artifact identifiers MUST be `sha256:<64-lowercase-hex>`. The digest is over the **raw bytes** of the artifact.  
For signed JSON payloads (offers/results/usage), hashes are over the **JCS-canonical JSON**.

---

## 14. Usage Records Pagination

`GET /api/usage/records?since=<rfc3339>&limit=<1..1000>`  
Response MUST include `next_since` if more records exist. `counter` MUST be strictly monotonic per `(issuer, peer_id)`.

---

## 15. Task DAG & Determinism

`depends_on` expresses a partial order; providers MUST execute in topological order.  
On failure, default behavior is **fail-fast** (subsequent nodes not executed).  
`replay_of` MUST reference a prior `TaskResult.offer_id` when rerunning with identical inputs/params.

---

## 16. Remote Fetch Rules (SSRF)

When `source_url` is provided, fetchers MUST:
- allow only `https`,
- enforce `max_size_mb` policy (default 512 MB),
- follow 0 redirects,
- resolve DNS once and pin IP for the connection,
- time out connects in ≤5s and total transfer in ≤300s,
- apply MIME allowlist before storing.

---

## 17. Erasure Semantics

`DELETE /api/artifacts/:cid` MUST:
- write an immutable tombstone transparency entry `{ event: "ARTIFACT_ERASED", cid, reason?, ts }`,
- attempt byte erasure on all storage peers where `erase_supported=true`,
- return `{ status: "tombstoned", tombstone_id, erase_attempted: true|false }`.

---

## 18. Transparency Log Details

Transparency logs MUST be Merkle-tree based. Servers MUST publish Signed Tree Heads (STH) with: `size`, `root_hash`, `timestamp`, `signature`.  
On request, servers SHOULD provide inclusion proofs for entries and MAY batch proofs (one proof per ≤100 entries).

---

## 19. Transparency Integration

- Peering events MUST be logged:
  - `PEER_HANDSHAKE`
  - `TASK_OFFERED`
  - `TASK_ACCEPTED`
  - `TASK_RESULTED`
  - `USAGE_RECORDED`
  - `ARTIFACT_ERASED`

- Logs MUST be append-only Merkle trees.  
- Inclusion proofs SHOULD be provided on request.  

---

## 20. Interoperability

- Peering is OPTIONAL.  
- Harvest remains baseline (SPP-Federation).  
- PeerDescriptors MAY include `retrieval_hints` (e.g., `ipfs_cid`).  
- Identity MAY be DID or TLS pin.  
- ActivityPub / IPFS integration MAY be provided in informative appendices.

---

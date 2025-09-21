# Semantic Publishing Protocol — Registry Peering (v0.2-draft)

## Status
- **Version:** 0.2-draft
- **Stage:** Draft (subject to change)
- **Normative:** Yes
- **Dependencies:** SPP-Core, SPP-Federation, SPP-Transparency

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

Schema: [`peer-descriptor.json`](../schemas/peer-descriptor.json).

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
- Payload: `TaskOffer` (see [`task-offer.json`](../schemas/task-offer.json)).  
- Task kinds: `crawl`, `enrich`, `store`.

### 4.2 Agreements
- `POST /api/peering/agreements/:id/accept`  
- Payload: `TaskAgreement` (see [`task-agreement.json`](../schemas/task-agreement.json)).

### 4.3 Results
- `POST /api/tasks/:id/callback`  
- Payload: `TaskResult` (see [`task-result.json`](../schemas/task-result.json)).  
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
- Payload: array of `UsageRecord` (see [`usage-record.json`](../schemas/usage-record.json)).  
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

## 9. Transparency Integration

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

## 10. Interoperability

- Peering is OPTIONAL.  
- Harvest remains baseline (SPP-Federation).  
- PeerDescriptors MAY include `retrieval_hints` (e.g., `ipfs_cid`).  
- Identity MAY be DID or TLS pin.  
- ActivityPub / IPFS integration MAY be provided in informative appendices.

---

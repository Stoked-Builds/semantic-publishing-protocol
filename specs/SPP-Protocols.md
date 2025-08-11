# SPS Protocols – Document & Claim Synchronization (SPS-Protocols)

**Version:** 0.2  
**Status:** Production-Ready  
**Date:** 2025-07-28  
**Codename:** SPS-Protocols

---

This document describes the protocols and interaction models for synchronizing and sharing SPS documents and claims across agents, registries, and consumers. It covers push, pull, and fetch models, and provides example schemas and pseudocode for key protocol steps.

---

## 1. Synchronization Models

### a. Pull (Consumer-Initiated)
- Agents or consumers request documents or claims from a registry or publisher.
- Used for discovery, search, or on-demand updates.

**Example (HTTP GET):**
```http
GET /registry/documents/doc:example-01
Accept: application/json
```

### b. Push (Publisher-Initiated)
- Publishers or agents proactively send new or updated documents/claims to a registry or peer.
- Used for real-time updates, notifications, or federated sync.

**Example (Webhook/PubSub):**
```json
{
  "event": "document_published",
  "document_id": "doc:example-01",
  "payload": { /* full document object */ }
}
```

### c. Fetch (Batch or Snapshot)
- Consumers or agents retrieve a batch of documents, claims, or a full registry snapshot.
- Used for initial sync, backup, or migration.

**Example (HTTP GET):**
```http
GET /registry/snapshot?since=2025-07-01T00:00:00Z
Accept: application/json
```

---

## 2. Protocol Steps (Pseudocode)

### a. Pull (Consumer-Initiated)
```python
# Agent requests a document from registry
response = http_get("/registry/documents/doc:example-01")
if response.status == 200:
    doc = response.json()
    validate_sps_document(doc)
```

### b. Push (Publisher-Initiated)
```python
# Publisher notifies registry of new document
payload = {
    "event": "document_published",
    "document_id": "doc:example-01",
    "payload": doc
}
http_post("/registry/events", json=payload)
```

### c. Fetch (Batch or Snapshot)
```python
# Agent fetches all documents updated since a timestamp
response = http_get("/registry/snapshot?since=2025-07-01T00:00:00Z")
if response.status == 200:
    docs = response.json()
    for doc in docs:
        validate_sps_document(doc)
```

---

## 3. Synchronization Guarantees
- All documents and claims must include unique IDs and signatures for deduplication and verification.
- Registries and agents must support idempotent updates (repeated pushes/pulls do not create duplicates).
- Timestamps and timelines are used to resolve conflicts and maintain audit trails.
- All protocol interactions should use secure transport (HTTPS, signed payloads).

---

## 4. Example Registry API Schema (OpenAPI excerpt)
```yaml
paths:
  /registry/documents/{document_id}:
    get:
      summary: Get a single SPS document
      parameters:
        - in: path
          name: document_id
          required: true
          schema:
            type: string
      responses:
        '200':
          description: SPS document object
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SPSDocument'
  /registry/snapshot:
    get:
      summary: Get a batch of SPS documents
      parameters:
        - in: query
          name: since
          schema:
            type: string
            format: date-time
      responses:
        '200':
          description: List of SPS documents
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/SPSDocument'
```

---

_See also: [SPS-Core](./SPS-Core.md), [SPS-Compliance](./SPS-Compliance.md), [SPS-Versions](./SPS-Versions.md)_

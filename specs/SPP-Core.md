# Semantic Publishing Specification – Core Entities (SPS-Core)

**Version:** 0.2  
**Status:** Production-Ready  
**Date:** 2025-07-28  
**Codename:** SPS-Core

---

This document defines the core entities and data structures for the Semantic Publishing Specification (SPS). These entities form the foundation for all content, attribution, and protocol operations in the SPP ecosystem.

---

## 1. Document
A Document is the primary container for published content, metadata, and provenance.

**Structure:**
```json
{
  "document_id": "doc:unique-id-123",
  "title": "string",
  "summary": "string (optional)",
  "authors": ["entity:author-id"],
  "created_at": "2025-07-28T10:00:00Z",
  "modified_at": "2025-07-28T12:00:00Z",
  "claims": ["claim:claim-id-1", "claim:claim-id-2"],
  "references": ["ref:ref-id-1"],
  "timeline": "timeline:timeline-id",
  "signatures": ["sig:sig-id-1"]
}
```
**Description:**
- Uniquely identifies a published work and its provenance.
- Links to claims, references, timeline, and digital signatures.

**Example:**
```json
{
  "document_id": "doc:article-2025-001",
  "title": "The Future of Consent on the Web",
  "summary": "A deep dive into user-centric consent models.",
  "authors": ["entity:markstokes"],
  "created_at": "2025-07-28T10:00:00Z",
  "modified_at": "2025-07-28T12:00:00Z",
  "claims": ["claim:consent-001"],
  "references": ["ref:spdx-ccby40"],
  "timeline": "timeline:doc-2025-001",
  "signatures": ["sig:doc-2025-001"]
}
```

---

## 2. Claim
A Claim is a verifiable assertion made within a document (e.g., a fact, statement, or attribution).

**Structure:**
```json
{
  "claim_id": "claim:unique-id-456",
  "document_id": "doc:unique-id-123",
  "type": "fact|attribution|opinion|license|other",
  "value": "string or object",
  "created_at": "2025-07-28T10:05:00Z",
  "signatures": ["sig:sig-id-2"]
}
```
**Description:**
- Encapsulates a single assertion, fact, or attribution.
- Can be cryptographically signed and independently referenced.

**Example:**
```json
{
  "claim_id": "claim:consent-001",
  "document_id": "doc:article-2025-001",
  "type": "fact",
  "value": "All user consent is revocable and auditable.",
  "created_at": "2025-07-28T10:05:00Z",
  "signatures": ["sig:claim-2025-001"]
}
```

---

## 3. Amendment
An Amendment records a change, correction, or update to a Document or Claim.

**Structure:**
```json
{
  "amendment_id": "amend:unique-id-789",
  "target_id": "doc:unique-id-123|claim:unique-id-456",
  "type": "correction|update|retraction|addition",
  "description": "string",
  "created_at": "2025-07-28T13:00:00Z",
  "signatures": ["sig:sig-id-3"]
}
```
**Description:**
- Tracks the evolution of documents and claims.
- Ensures transparency and auditability of changes.

**Example:**
```json
{
  "amendment_id": "amend:doc-2025-001-v2",
  "target_id": "doc:article-2025-001",
  "type": "update",
  "description": "Updated summary and added new references.",
  "created_at": "2025-07-28T13:00:00Z",
  "signatures": ["sig:amend-2025-001"]
}
```

---

## 4. Reference
A Reference links to external sources, standards, or prior works.

**Structure:**
```json
{
  "reference_id": "ref:unique-id-321",
  "type": "url|doi|spdx|other",
  "value": "string (e.g., URL, DOI, SPDX ID)",
  "title": "string (optional)",
  "authors": ["entity:author-id"],
  "created_at": "2025-07-28T09:00:00Z"
}
```
**Description:**
- Provides provenance, licensing, or context for claims and documents.
- Can be used for citation, licensing, or attribution.

**Example:**
```json
{
  "reference_id": "ref:spdx-ccby40",
  "type": "spdx",
  "value": "CC-BY-4.0",
  "title": "Creative Commons Attribution 4.0 International",
  "authors": [],
  "created_at": "2020-01-01T00:00:00Z"
}
```

---

## 5. Entity
An Entity represents a person, organization, or agent involved in publishing, authorship, or attribution.

**Structure:**
```json
{
  "entity_id": "entity:unique-id-654",
  "type": "person|organization|agent",
  "name": "string",
  "identifiers": {
    "ssot_id": "ssot:markstokes",
    "did": "did:example:1234"
  },
  "roles": ["author|editor|reviewer|publisher|agent"],
  "contact": "string (optional)",
  "created_at": "2025-07-28T08:00:00Z"
}
```
**Description:**
- Encapsulates identity and role information for all protocol participants.
- Supports multiple identifier schemes (SSOT, DID, etc.).

**Example:**
```json
{
  "entity_id": "entity:markstokes",
  "type": "person",
  "name": "Mark Stokes",
  "identifiers": {
    "ssot_id": "ssot:markstokes",
    "did": "did:example:markstokes"
  },
  "roles": ["author", "editor"],
  "contact": "mark.stokes@outlook.com",
  "created_at": "2025-07-28T08:00:00Z"
}
```

---

## 6. Timeline
A Timeline records the sequence of events, amendments, and signatures for a Document or Claim.

**Structure:**
```json
{
  "timeline_id": "timeline:unique-id-987",
  "target_id": "doc:unique-id-123|claim:unique-id-456",
  "events": [
    {
      "event_type": "created|amended|signed|referenced",
      "event_id": "string",
      "timestamp": "2025-07-28T10:00:00Z"
    }
  ]
}
```
**Description:**
- Provides a full audit trail for documents and claims.
- Enables traceability and reproducibility.

**Example:**
```json
{
  "timeline_id": "timeline:doc-2025-001",
  "target_id": "doc:article-2025-001",
  "events": [
    { "event_type": "created", "event_id": "doc:article-2025-001", "timestamp": "2025-07-28T10:00:00Z" },
    { "event_type": "signed", "event_id": "sig:doc-2025-001", "timestamp": "2025-07-28T10:01:00Z" },
    { "event_type": "amended", "event_id": "amend:doc-2025-001-v2", "timestamp": "2025-07-28T13:00:00Z" }
  ]
}
```

---

## 7. Signature
A Signature is a cryptographic proof of authorship, amendment, or endorsement.

**Structure:**
```json
{
  "signature_id": "sig:unique-id-111",
  "target_id": "doc:unique-id-123|claim:unique-id-456|amend:unique-id-789",
  "signer": "entity:author-id",
  "signature_value": "0xABCDEF...",
  "algorithm": "ed25519|rsa|ecdsa|other",
  "created_at": "2025-07-28T10:01:00Z"
}
```
**Description:**
- Provides verifiable proof of authorship, amendment, or endorsement.
- Supports multiple cryptographic algorithms.

**Example:**
```json
{
  "signature_id": "sig:doc-2025-001",
  "target_id": "doc:article-2025-001",
  "signer": "entity:markstokes",
  "signature_value": "0xA1B2C3D4E5F6...",
  "algorithm": "ed25519",
  "created_at": "2025-07-28T10:01:00Z"
}
```

---

_See also: [Semantic Publishing Specification](./semantic-publishing-specification.md), [SSOT-ID](../identity/ssot-id.md), [Trust Engine](../consent-engine/trust-engine.md)_

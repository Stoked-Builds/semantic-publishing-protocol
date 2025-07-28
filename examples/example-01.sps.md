---
document_id: doc:example-01
sps_compliance_level: 3
title: "The Value of User-Centric Consent in Web Publishing"
summary: "A demonstration of SPS v0.2 structure, including claims, references, and amendments."
authors:
  - entity:markstokes
created_at: 2025-07-28T10:00:00Z
modified_at: 2025-07-28T12:00:00Z
claims:
  - claim:consent-001
  - claim:privacy-001
references:
  - ref:spdx-ccby40
  - ref:w3c-vc
  - ref:solid-pods
timeline: timeline:example-01
signatures:
  - sig:doc-example-01
---

# The Value of User-Centric Consent in Web Publishing

This document demonstrates a fully SPS-compliant publication, including all required fields, claims, references, and an example amendment.

## Claims

### Claim 1: Consent is Revocable
```json
{
  "claim_id": "claim:consent-001",
  "document_id": "doc:example-01",
  "type": "fact",
  "value": "All user consent is revocable and auditable.",
  "created_at": "2025-07-28T10:05:00Z",
  "signatures": ["sig:claim-consent-001"]
}
```

### Claim 2: Privacy by Design
```json
{
  "claim_id": "claim:privacy-001",
  "document_id": "doc:example-01",
  "type": "fact",
  "value": "Personal data is stored and processed locally by default.",
  "created_at": "2025-07-28T10:10:00Z",
  "signatures": ["sig:claim-privacy-001"]
}
```

## References

- **ref:spdx-ccby40**: SPDX License [CC-BY-4.0](https://spdx.org/licenses/CC-BY-4.0.html)
- **ref:w3c-vc**: W3C Verifiable Credentials [VC Data Model](https://www.w3.org/TR/vc-data-model/)
- **ref:solid-pods**: Solid Project [Solid Pods](https://solidproject.org/)

## Example Amendment

```json
{
  "amendment_id": "amend:example-01-v2",
  "target_id": "doc:example-01",
  "type": "update",
  "description": "Added privacy claim and updated references.",
  "created_at": "2025-07-28T12:00:00Z",
  "signatures": ["sig:amend-example-01-v2"]
}
```

## Timeline

```json
{
  "timeline_id": "timeline:example-01",
  "target_id": "doc:example-01",
  "events": [
    { "event_type": "created", "event_id": "doc:example-01", "timestamp": "2025-07-28T10:00:00Z" },
    { "event_type": "signed", "event_id": "sig:doc-example-01", "timestamp": "2025-07-28T10:01:00Z" },
    { "event_type": "amended", "event_id": "amend:example-01-v2", "timestamp": "2025-07-28T12:00:00Z" }
  ]
}
```

## Entity Example

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

For full entity and compliance definitions, see [SPS-Core](../specs/SPS-Core.md) and [SPS-Compliance](../specs/SPS-Compliance.md).

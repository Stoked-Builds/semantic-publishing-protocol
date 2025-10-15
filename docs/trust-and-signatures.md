# Trust & Signatures (SPP v0.4)

This guide describes how to **bind endorsements and signatures** to a specific versioned artefact so that consumers can verify integrity and provenance.

## What to Sign
Always include these fields when signing an enriched artefact version:

```json
{
  "id": "urn:spp:artifact:...",
  "canonical": "https://example.com/post",
  "version": { "number": 4 },
  "content": { "raw": { "sha256": "sha256:..." } }
}
```

These values uniquely identify an **immutable content state**.

## Recommended Signature Formats
- **JWS (JSON Web Signature)** — detached payload or embedded
- **COSE_Sign1** — CBOR for compact/IoT environments
- **DSSE (in‑toto)** — for supply‑chain‑style attestations

Whatever you pick, keep the **payload canonical** and **stable**.

## Canonical Payload (JWS example)

```jsonc
{
  "type": "spp.endorsement",
  "spec": "spp/enrichment-and-versioning@v0.4",
  "subject": {
    "id": "urn:spp:artifact:1f1a1e20-2b6c-4a7a-9a4f-3f7a9f0b9e10",
    "canonical": "https://anchor.news/technology/ai-licence-treaty",
    "version": 4,
    "rawSha256": "sha256:5d41402abc4b2a76b9719d911017c592"
  },
  "issuer": {
    "name": "Anchor News Registry",
    "did": "did:web:anchor.news",
    "key": "did:web:anchor.news#spp-signing-key"
  },
  "issuedAt": "2025-07-12T12:36:00Z",
  "purpose": "publication",
  "claims": { "lang": "en", "domain": "anchor.news" }
}
```

### JWS Headers
- `alg`: `EdDSA` (recommended) or `ES256`
- `kid`: key identifier (e.g., DID URL)
- `typ`: `application/spp+jws`

### Verification Steps
1. Resolve the `kid` → fetch the public key (DID document, jwk.json, etc.).
2. Verify the JWS signature.
3. Recompute `sha256(raw_bytes)` of the referenced raw snapshot; compare with `rawSha256`.
4. Confirm `version` exists via `/v1/artefacts/{id}/versions/{v}/manifest`.

## Binding to the Web Origin
Publish the **public key** under the site’s origin (e.g., `/.well-known/spp/jwk.json`) and/or a **DID document** (`did:web`). This lets agents tie endorsements to the publisher’s domain.

## Key Management
- Rotate keys; keep previous keys available for verification.
- Timestamp `issuedAt` and optionally `expiresAt`.
- Maintain an audit log of endorsements.

## Tamper Response
If content is removed or legally restricted:
- Tombstone the artefact; keep the hash and version history.
- Revoke or supersede endorsements with a revocation list (simple JSON).

---

_This document is intentionally format‑agnostic. The only requirement is that signatures include the artefact `id`, `canonical`, **content version number**, and **raw snapshot hash**._

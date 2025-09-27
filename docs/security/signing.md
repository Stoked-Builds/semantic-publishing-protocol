# Signing & Canonicalisation (v0.4)

## Algorithms
- **MUST** support `Ed25519` (`alg: ed25519`).
- **MAY** support `P-256` (`alg: ES256`) for compliance environments.
- **MUST NOT** use RSA < 2048.

## Canonicalisation
- All JSON to be signed MUST be canonicalised with RFC 8785 JSON Canonicalisation Scheme (JCS).
- Canonicalisation eliminates whitespace, key ordering differences, and normalises numbers/strings.

## Test Vector

**Original JSON**
```json
{ "b":2, "a":1 }
```

**Canonicalised JSON**
```json
{"a":1,"b":2}
```

**Signed Payload**
```json
{
  "content_hash": "sha256:0123abcd...",
  "registry_id": "registry.example.org",
  "collected_at": "2025-09-27T12:34:56Z"
}
```

**Example Signature**
```
sig = "YWFhYmJiY2Nj..."
alg = "ed25519"
```

Registry verifiers MUST reject signatures over non-canonicalised payloads.
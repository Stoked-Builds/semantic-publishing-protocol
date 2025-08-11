# Registry Integrity & Transparency (v1.0-draft)

## Purpose [Informative]

This specification defines the transparency log format and HTTP endpoints for verifiable artefact, claim, and ownership tracking within the SPP Registry system. It establishes a Certificate Transparency-style append-only Merkle tree log that enables cryptographic verification of registry operations, providing transparency and integrity guarantees without requiring blockchain infrastructure.

## Normative Requirements [Normative]

### Transparency Log Operations

Implementations **MUST** maintain an append-only transparency log of all registry operations including:

- Artefact ingestion events 
- Publisher claims of namespace control
- Artefact adoption by publishers
- Ownership record submissions (when enabled)

Implementations **MUST NOT** allow deletion or modification of log entries once committed to the transparency log.

### Log Entry Ordering

Implementations **MUST** order log entries chronologically by their `timestamp` field in ascending order. Entries with identical timestamps **MUST** be ordered deterministically using a secondary sorting criterion (e.g., lexicographic ordering of `artefact_hash`).

### Merkle Tree Construction

Implementations **MUST** construct the transparency log as a binary Merkle tree following these normative requirements:

- **Leaf hashing**: Each log entry **MUST** be double-hashed using SHA-256 to prevent second preimage attacks
- **Node construction**: Internal nodes **MUST** be computed as SHA-256 of the concatenation of left and right child hashes
- **Tree balancing**: The tree **MUST** be constructed as a complete binary tree, padding with empty leaf hashes when necessary
- **Reproducibility**: Given the same ordered set of log entries, any implementation **MUST** produce identical root hashes

### Signed Tree Head Requirements

Implementations **MUST** periodically publish Signed Tree Heads (STH) containing:

- Current tree size (number of entries)
- Merkle tree root hash
- Timestamp of STH creation
- Digital signature by registry's private key

STH signatures **MUST** conform to `/schemas/common/signature.json` using Ed25519 cryptography.

## Data Model [Normative]

### Transparency Log Entry

Log entries **MUST** conform to `/schemas/transparency-log-entry.json` with the following required fields:

- `artefact_hash`: SHA-256 content hash in format `sha256:[hex]`
- `publisher_did`: DID of the publisher associated with this entry
- `provenance_mode`: One of `reconstructed`, `claimed`, `adopted`, `authoritative`
- `timestamp`: RFC3339 UTC timestamp of the operation
- `registry_did`: DID of the registry that created this entry

Additional fields **MAY** include links to associated claim, adoption, or ownership records.

These referenced objects **MUST** validate against their respective schemas (`/schemas/claim.json`, `/schemas/adoption.json`, `/schemas/ownership.json`) before acceptance.

### Signed Tree Head Format

STH objects **MUST** conform to `/schemas/transparency-sth.json` with:

- `tree_size`: Non-negative integer count of log entries
- `root_hash`: 64-character hexadecimal Merkle tree root
- `created_at`: RFC3339 UTC timestamp
- `signatures`: Array of Ed25519 signatures
- `anchors`: Optional array reserved for future blockchain anchoring

The `anchors` array is OPTIONAL in v1 but **MUST** be present in examples for forward compatibility. When present, `anchors` entries **MUST** conform to the reserved blockchain anchor object schema (to be defined in vNext).

## API Surface [Normative]

Implementations **MUST** provide the following HTTP endpoints as defined in `/openapi/registry.yml`:

All API responses **MUST** be schema-valid and, when applicable, content-signed according to `/schemas/common/signature.json` and `/schemas/common/did.json`.

### GET /ct/sth

Returns the latest Signed Tree Head.

**Response**: `application/spp.sth+json;v=1` content type with STH object.

### GET /ct/proof

Returns Merkle inclusion proof for a specific artefact.

**Parameters**:
- `id` (query, required): Content hash in format `sha256:[hex]`

**Response**: JSON object with:
- `audit_path`: Array of hexadecimal node hashes forming the inclusion proof
- `tree_size`: Tree size at time of proof generation  
- `root_hash`: Merkle root hash for verification

### GET /ct/consistency

Returns consistency proof between two tree states.

**Parameters**:
- `from` (query, required): Old tree size
- `to` (query, required): New tree size

**Response**: JSON object with:
- `proof`: Array of hexadecimal node hashes forming the consistency proof

## Security & Integrity [Normative]

### Cryptographic Requirements

- **Hash function**: Implementations **MUST** use SHA-256 exclusively
- **Signature algorithm**: Implementations **MUST** use Ed25519 for all signatures
- **Key management**: Registry private keys **MUST** be secured and rotatable

### Verification Procedures

Clients **MUST** verify:

1. **STH signature validity** using registry's public key
2. **Inclusion proof correctness** by recomputing Merkle path to root
3. **Consistency proof validity** ensuring append-only property
4. **Log entry signatures, when present in referenced claim/adoption/ownership records, MUST be verified against `/schemas/common/signature.json` and the associated DID document.**

### Abuse Prevention

Implementations **SHOULD** implement rate limiting on transparency endpoints to prevent abuse while maintaining public verifiability.

## Reserved Features [Normative]

### Blockchain Anchoring

The `anchors` array in STH objects is **RESERVED** for future blockchain anchoring functionality. Implementations **MUST** accept but **MUST NOT** process anchor entries in v1.

Implementations **MAY** populate the `anchors` array but **MUST NOT** require its presence for any v1 operations.

## Examples [Normative]

### Complete Transparency Flow

#### 1. Log Entry Example

```json
{
  "artefact_hash": "sha256:a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
  "publisher_did": "did:web:example.com",
  "provenance_mode": "adopted",
  "timestamp": "2024-01-15T10:30:00Z",
  "registry_did": "did:web:registry.example.net",
  "anchors": []
}
```

#### 2. Signed Tree Head Example

```json
{
  "tree_size": 1024,
  "root_hash": "b47cc0f104dc3c6a9ce6e5f6b8e4a5a0a5d1c2c3c4c5c6c7c8c9cacbcccdcecf",
  "created_at": "2024-01-15T11:00:00Z",
  "anchors": [],
  "signatures": [
    {
      "alg": "ed25519",
      "kid": "did:web:registry.example.net#key1",
      "sig": "dGVzdCBzaWduYXR1cmUgZm9yIGV4YW1wbGU"
    }
  ]
}
```

#### 3. Inclusion Proof Example

```json
{
  "audit_path": [
    "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
    "b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3"
  ],
  "tree_size": 1024,
  "root_hash": "b47cc0f104dc3c6a9ce6e5f6b8e4a5a0a5d1c2c3c4c5c6c7c8c9cacbcccdcecf",
  "anchors": []
}
```

#### 4. Consistency Proof Example

```json
{
  "proof": [
    "c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4"
  ],
  "anchors": []
}
```

## Merkle Tree Construction [Normative]

### Leaf Node Computation

For each log entry, the leaf hash **MUST** be computed as:

```
leaf_hash = SHA256(SHA256(canonical_json(log_entry)))
```

Where `canonical_json` produces deterministic JSON serialization with:
- Keys sorted alphabetically
- No whitespace
- UTF-8 encoding

### Internal Node Computation

Internal nodes **MUST** be computed as:

```
node_hash = SHA256(left_child_hash || right_child_hash)
```

Where `||` denotes byte concatenation.

### Tree Padding

For trees with non-power-of-2 entries, implementations **MUST** pad with hash values of empty strings:

```
empty_hash = SHA256(SHA256(""))
```

## Compatibility & Versioning [Informative]

This specification aligns with Certificate Transparency principles while adapting to SPP's decentralized registry model. Future versions may extend the transparency log with additional metadata or integrate with blockchain anchoring systems through the reserved `anchors` field.

Implementations should be prepared for schema evolution while maintaining backward compatibility for v1 verification clients.

## References [Informative]

- [SPP Registry Brief](../../design/registry/brief.md) - Core registry requirements and constraints
- [Claims & Adoption Specification](./claims-and-adoption.md) - Provenance state transitions
- [RFC 6962](https://tools.ietf.org/html/rfc6962) - Certificate Transparency specification
- [RFC 2119](https://tools.ietf.org/html/rfc2119) - Normative language requirements
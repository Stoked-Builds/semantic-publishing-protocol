# SPP Ownership (v1.0-draft)

## Purpose [Informative]
This specification defines how artefact ownership is represented, proven, and transferred in the Semantic Publishing Protocol (SPP) registry v1. It establishes off-chain ownership proofs using DNS, `.well-known`, and signed JSON-LD documents, with reserved fields for future blockchain/NFT integration.

## Normative Requirements [Normative]

### General Requirements
- Implementations **MUST** support off-chain ownership proof methods as defined in this specification
- Implementations **MUST** validate ownership proofs against the artefact content hash from `/schemas/semantic.json`
- Implementations **SHOULD** preserve ownership records in transparency logs for auditability
- Implementations **MUST NOT** implement on-chain anchoring in v1 (reserved for future versions)
- Implementations **MUST** support multi-party ownership with basis point share allocation
- Implementations **MUST** validate all ownership records against `/schemas/ownership.json`

### Lifecycle Management
- Ownership records **MUST** transition through defined states: `issued` → `active` → [`transferred` | `revoked`]
- Active ownership records **MAY** be transferred to new holders
- Revoked ownership records **MUST NOT** be transferable
- Implementations **MUST** maintain complete audit trails of ownership state changes

### Claims and Adoption Integration
- Ownership records **MUST** reference either:
  - An adopted artefact (where `provenance.mode` is `adopted` or `authoritative`), OR
  - A valid claim proving publisher control over the namespace
- Ownership issuers **MUST** be verified publishers with valid DID proof
- Ownership of reconstructed artefacts **MAY** be established through subsequent adoption

## Data Model [Normative]

The ownership data model is defined in `/schemas/ownership.json` with the following key components:

### Subject
```json
{
  "subject": {
    "artefact_hash": "sha256:abc123...",  // Required: links to semantic.json content_hash
    "snapshot_hash": "sha256:def456..."   // Optional: specific version snapshot
  }
}
```

### Holders
```json
{
  "holders": [
    {
      "did": "did:web:publisher.example",
      "share_bp": 10000  // Basis points (0-10000, where 10000 = 100%)
    }
  ]
}
```

### Claims Structure
```json
{
  "claims": {
    "role": "copyright",  // "copyright" | "license" | "collectible" | "fractional"
    "grants": ["reproduce", "distribute", "display"],
    "territory": "US",
    "valid_from": "2024-01-01T00:00:00Z",
    "valid_to": "2025-01-01T00:00:00Z"
  }
}
```

### Reserved Fields
The following fields are reserved for future blockchain/NFT integration but **MUST NOT** be implemented in v1:

```json
{
  "ownership": {
    // ... existing fields ...
    
    // RESERVED FOR v2+ (MUST NOT implement in v1)
    "anchors": [
      {
        "chain": "ethereum",
        "contract": "0x1234...",
        "token_id": "12345",
        "block_height": 18500000,
        "tx_hash": "0xabcd...",
        "timestamp": "2024-01-01T00:00:00Z"
      }
    ],
    "on_chain_id": "eth:0x1234:12345",
    "smart_contract": {
      "address": "0x1234567890abcdef",
      "standard": "ERC-721",
      "network": "ethereum"
    },
    "nft_metadata": {
      "token_uri": "https://example.com/metadata/12345",
      "external_url": "https://example.com/ownership/12345"
    }
  }
}
```

**Important:** These fields are included in examples for forward compatibility but implementations **MUST NOT** process or validate them in v1. They are reserved for future specification versions that will define blockchain integration.

## Ownership Lifecycle [Normative]

The following diagram illustrates the ownership state transitions:

```
                    ┌─────────────┐
                    │   ISSUED    │ ← Initial ownership record created
                    └──────┬──────┘
                           │
                     ┌─────▼─────┐
                     │ validate  │
                     └─────┬─────┘
                           │
                    ┌──────▼──────┐
                    │   ACTIVE    │ ← Ownership validated and recognized
                    └──────┬──────┘
                           │
                  ┌────────┼────────┐
                  │                 │
            ┌─────▼─────┐     ┌─────▼─────┐
            │ transfer  │     │  revoke   │
            └─────┬─────┘     └─────┬─────┘
                  │                 │
          ┌───────▼───────┐   ┌─────▼─────┐
          │ TRANSFERRED   │   │  REVOKED  │ ← Terminal states
          └───────────────┘   └───────────┘
                  │                 │
                  └─────────┬───────┘
                            │
                     ┌──────▼──────┐
                     │  HISTORICAL │ ← Archived for audit trail
                     └─────────────┘
```

### State Definitions

#### ISSUED
- Initial state when ownership record is created
- **MUST** include valid signatures from all issuers
- **MUST** reference valid artefact hash
- Awaiting validation and activation

#### ACTIVE  
- Ownership is validated and recognized
- Holders **MAY** exercise ownership rights
- Record **MAY** be transferred or revoked
- **MUST** have valid proof chain to artefact

#### TRANSFERRED
- Ownership has been transferred to new holders
- Previous ownership record becomes historical
- New ownership record created in ISSUED state
- Original record **MUST NOT** be modified

#### REVOKED
- Ownership is permanently invalidated
- **MAY** occur due to disputes, expiration, or voluntary action
- Record **MUST NOT** be transferred
- Revocation reason **SHOULD** be documented

## Proof Formats [Normative]

### DID Signature Proof
All ownership records **MUST** include Ed25519 signatures per `/schemas/common/signature.json`:

```json
{
  "signatures": [
    {
      "alg": "ed25519",
      "kid": "did:web:example.com#key-1", 
      "sig": "base64url_encoded_signature"
    }
  ]
}
```

### DNS TXT Proof
For domain-based ownership claims, publishers **MUST** provide DNS TXT records:

```
_spp-ownership.domain.example TXT "v=spp1; ownership=sha256:abc123; did=did:web:domain.example"
```

### Well-Known Proof
Publishers **MUST** serve ownership proofs at `/.well-known/spp/ownership/{artefact_hash}.json`:

```json
{
  "artefact_hash": "sha256:abc123...",
  "ownership_claim": {
    "did": "did:web:publisher.example",
    "issued_at": "2024-01-01T00:00:00Z",
    "proof_uri": "https://publisher.example/.well-known/spp/ownership/abc123.json"
  },
  "signature": {
    "alg": "ed25519",
    "sig": "base64url_encoded_signature"
  }
}
```

## Transfer Process [Normative]

### Initiation
1. Current holder creates transfer proposal
2. Proposal **MUST** specify new holders and share allocations
3. Total share allocation **MUST** equal 10000 basis points
4. Transfer proposal **MUST** be signed by current holders

### Acceptance
1. New holders **MUST** cryptographically accept transfer
2. Acceptance signatures **MUST** use holder's DID keys
3. Registry **MAY** require additional validation steps

### Registry Update
1. Registry validates all signatures and proofs
2. Current ownership record transitions to TRANSFERRED state
3. New ownership record created in ISSUED state
4. Transparency log **MUST** record complete transfer chain

## Multi-Party Ownership [Normative]

### Co-ownership
- Multiple holders **MAY** share ownership with specified basis points
- Total allocation **MUST** equal exactly 10000 basis points
- All holders **MUST** provide valid DID signatures

### Joint Signatures
- Transfer and revocation actions **MAY** require multiple signatures
- Required signature threshold **SHOULD** be specified in ownership claims
- Default threshold is simple majority by basis point allocation

```json
{
  "holders": [
    {"did": "did:web:alice.example", "share_bp": 6000},
    {"did": "did:web:bob.example", "share_bp": 4000}
  ],
  "transfer_requirements": {
    "signature_threshold_bp": 6000,  // Requires 60% by share
    "minimum_signers": 1
  }
}
```

## Revocation and Dispute Resolution [Normative]

### Revocation Triggers
- Voluntary revocation by current holders
- Dispute resolution decision
- Claim expiration (if `valid_to` specified)
- Failed re-validation of underlying proofs

### Dispute Process
1. Dispute filed with evidence against ownership record
2. Registry **MAY** temporarily suspend ownership rights
3. Resolution through defined arbitration or governance process
4. Final determination results in continuation or revocation

### Evidence Requirements
- Competing ownership claims with earlier timestamps
- Proof of fraudulent issuance
- Publisher domain/DID compromise evidence
- Copyright violation claims with legal documentation

## API Surface [Normative]

### Ownership Registration
```
POST /v1/ownership
Content-Type: application/json

{
  "ownership": { /* ownership record per schema */ }
}
```

### Ownership Query
```
GET /v1/ownership/{artefact_hash}
Accept: application/json

Response: {
  "ownership": { /* current active ownership */ },
  "history": [ /* previous ownership records */ ]
}
```

### Transfer Initiation
```
POST /v1/ownership/{id}/transfer
Content-Type: application/json

{
  "transfer": {
    "new_holders": [ /* holder array */ ],
    "effective_date": "2024-01-01T00:00:00Z",
    "signatures": [ /* transfer authorization */ ]
  }
}
```

## Security & Integrity [Normative]

### Key Management
- Ownership proofs **MUST** use Ed25519 cryptographic signatures
- DID keys **MUST** be resolvable through standard DID resolution
- Key rotation **SHOULD** be supported through DID document updates

### Verification Order
1. Validate ownership record against JSON schema
2. Verify artefact hash exists and is valid
3. Validate all DID signatures using current keys
4. Check DNS/well-known proofs if applicable
5. Verify claims against adoption/publisher records
6. Confirm state transition validity

### Abuse Controls
- Rate limiting on ownership registration and transfers
- Spam detection for excessive ownership claims
- Reputation scoring based on dispute history
- Transparency log monitoring for suspicious patterns

## Examples [Normative]

### Initial Ownership Issue
```json
{
  "ownership": {
    "id": "own_abc123",
    "subject": {
      "artefact_hash": "sha256:d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2"
    },
    "claims": {
      "role": "copyright",
      "grants": ["reproduce", "distribute", "display"],
      "territory": "worldwide",
      "valid_from": "2024-01-01T00:00:00Z"
    },
    "holders": [
      {
        "did": "did:web:publisher.example",
        "share_bp": 10000
      }
    ],
    "issuers": [
      {
        "did": "did:web:publisher.example"
      }
    ],
    "signatures": [
      {
        "alg": "ed25519",
        "kid": "did:web:publisher.example#key-1",
        "sig": "YWJjZGVmZ2hpams"
      }
    ],
    "links": [
      {
        "rel": "artefact",
        "href": "https://registry.example/v1/artefacts/d2d2d2d2"
      }
    ],
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Ownership Transfer
```json
{
  "ownership": {
    "id": "own_def456", 
    "subject": {
      "artefact_hash": "sha256:d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2"
    },
    "claims": {
      "role": "copyright",
      "grants": ["reproduce", "distribute"],
      "territory": "US"
    },
    "holders": [
      {
        "did": "did:web:alice.example",
        "share_bp": 7000
      },
      {
        "did": "did:web:bob.example", 
        "share_bp": 3000
      }
    ],
    "issuers": [
      {
        "did": "did:web:publisher.example"
      }
    ],
    "signatures": [
      {
        "alg": "ed25519",
        "kid": "did:web:publisher.example#key-1",
        "sig": "cGFyZW50X3NpZ25hdHVyZQ"
      },
      {
        "alg": "ed25519", 
        "kid": "did:web:alice.example#key-1",
        "sig": "YWxpY2Vfc2lnbmF0dXJl"
      },
      {
        "alg": "ed25519",
        "kid": "did:web:bob.example#key-1", 
        "sig": "Ym9iX3NpZ25hdHVyZQ"
      }
    ],
    "links": [
      {
        "rel": "artefact",
        "href": "https://registry.example/v1/artefacts/d2d2d2d2"
      },
      {
        "rel": "previous-ownership",
        "href": "https://registry.example/v1/ownership/own_abc123"
      }
    ],
    "created_at": "2024-01-15T00:00:00Z"
  }
}
```

### Ownership Revocation
```json
{
  "ownership": {
    "id": "own_revoked789",
    "subject": {
      "artefact_hash": "sha256:d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2"
    },
    "claims": {
      "role": "copyright",
      "grants": [],
      "revocation_reason": "voluntary",
      "revoked_at": "2024-02-01T00:00:00Z"
    },
    "holders": [],
    "issuers": [
      {
        "did": "did:web:alice.example"
      }
    ],
    "signatures": [
      {
        "alg": "ed25519",
        "kid": "did:web:alice.example#key-1", 
        "sig": "cmV2b2NhdGlvbl9zaWduYXR1cmU"
      }
    ],
    "links": [
      {
        "rel": "artefact",
        "href": "https://registry.example/v1/artefacts/d2d2d2d2"
      },
      {
        "rel": "previous-ownership",
        "href": "https://registry.example/v1/ownership/own_def456"
      }
    ],
    "created_at": "2024-02-01T00:00:00Z"
  }
}
```

## Compatibility & Versioning [Informative]

### Backwards Compatibility
- v1 ownership records will remain valid in future versions
- Schema extensions will use the `extensions` object for new fields
- Reserved fields (`anchors`, `on_chain_id`) will be activated in v2+

### Future Extensions
- Blockchain anchoring will use reserved `anchors` field
- NFT integration will populate `on_chain_id` field
- Smart contract ownership will use `smart_contract` field
- Cross-chain ownership bridges may be added

### Extension Points
- Custom claim types through extensions namespace
- Additional proof methods in future versions
- Enhanced dispute resolution mechanisms
- Integration with external arbitration systems

## References [Informative]
- [DNS Discovery](dns.md) - For DNS TXT proof requirements
- [Claims and Adoption](claims-and-adoption.md) - For publisher verification
- [Registry Brief](../../design/registry/brief.md) - For ownership definitions
- [JSON Schema](../../schemas/ownership.json) - For ownership data validation
- [Semantic Schema](../../schemas/semantic.json) - For artefact hash format
- [Publisher Schema](../../schemas/publisher.json) - For publisher verification
- [Claim Schema](../../schemas/claim.json) - For claim validation
- [Adoption Schema](../../schemas/adoption.json) - For adoption process
- [Signature Schema](../../schemas/common/signature.json) - For signature validation
- [DID Schema](../../schemas/common/did.json) - For DID format validation
- [W3C DID Core](https://www.w3.org/TR/did-core/) - For DID specifications
- [RFC 2119](https://tools.ietf.org/html/rfc2119) - For normative language
# Endorsement Chains Extension

**Extension ID:** `spp:endorsement-chains`  
**Version:** 0.3.0  
**Specification:** SPP Extension

## Purpose

The Endorsement Chains extension enables verifiable endorsements of content and delegation of trust between agents, publishers, and other entities. This allows for cryptographically signed testimonials, agent-to-content endorsements, and recursive chains of delegated authority that can be verified independently. It also supports semantic verdicts, trust scoring, and endorsement lineage for contextual credibility.

## Schema Fields

When using this extension, content MAY include the following additional fields in `semantic.json`:

### Endorsements

```json
{
  "endorsements": [
    {
      "endorser_did": "did:web:expert.example.com",
      "endorser_name": "Dr. Jane Smith",
      "timestamp": "2025-01-15T14:30:00Z",
      "signature": "zQmF3ysuHnLmKxn2dKbmF2mLrZjYrJYFBrKqD4ZGwh9JFvW2E",
      "comment": "This analysis aligns with current research findings.",
      "endorsement_type": "content",
      "signature_algorithm": "ed25519",
      "delegation_chain": []
    }
  ]
}
```

### Delegation Chains

```json
{
  "endorsements": [
    {
      "endorser_did": "did:web:assistant.example.com",
      "endorser_name": "Research Assistant AI",
      "timestamp": "2025-01-15T15:00:00Z",
      "signature": "zQmK4xtuJnPmKyn3eKcnF3nLsAkYsJzY2JYFCsLrE5ZHxi9JGwW3F",
      "comment": "Endorsed on behalf of supervising researcher.",
      "endorsement_type": "delegated",
      "signature_algorithm": "ed25519",
      "delegation_chain": [
        {
          "delegator_did": "did:web:supervisor.example.com",
          "delegator_name": "Prof. John Doe",
          "delegation_signature": "zQmA1wriHmLkNxm2dKbmF2mLrZjYrJYFBrKqD4ZGwh9JFvW2E",
          "delegation_timestamp": "2025-01-15T14:45:00Z",
          "delegation_scope": "research_endorsement",
          "delegation_expires": "2025-12-31T23:59:59Z"
        }
      ]
    }
  ]
}
```

## Field Definitions

### endorsements

- **Type:** Array of endorsement objects
- **Required:** No
- **Description:** Collection of endorsements from trusted entities with verifiable trust anchors.

#### Endorsement Object

- `endorser_did` (string, required): Decentralized Identifier of the endorsing entity
- `endorser_name` (string, optional): Human-readable name of the endorser
- `timestamp` / `date` (string, required): ISO 8601 timestamp when endorsement was made
- `signature` (string, required): Cryptographic signature of the endorsement
- `signature_algorithm` (string, required): Algorithm used for signature (e.g., `ed25519`, `secp256k1`)
- `endorsement_type` (string, required): One of `"content"`, `"delegated"`, or `"peer"`
- `comment` (string, optional): Endorser commentary
- `verdict` (string, optional): Semantic judgment (see Verdict Types below)
- `confidence` (number, optional): Confidence level (0.0 to 1.0)
- `trust_weight` (number, optional): Relative weight of the endorser's trust (0.0 to 1.0)
- `endorsed` (string, optional): URI of the content being endorsed
- `evidence` (array of string, optional): Links or identifiers supporting the endorsement
- `chain_depth` (integer, optional): Number indicating endorsement’s depth in a chain
- `transitive_endorsements` (array, optional): Nested endorsements that this one is based on
- `delegation_chain` (array, optional): See below.

#### Delegation Object

- `delegator_did` (string, required)
- `delegator_name` (string, optional)
- `delegation_signature` (string, required)
- `delegation_timestamp` (string, required)
- `delegation_scope` (string, required)
- `delegation_expires` (string, optional)

### Verdict Types

- `accurate`
- `verified`
- `corroborated`
- `referenced`
- `disputed`
- `questionable`
- `false`
- `misleading`

## Usage

### Declaring the Extension

```json
{
  "extensions": [
    {
      "id": "spp:endorsement-chains",
      "version": "0.3.0"
    }
  ]
}
```

### Complete Example: Research Paper with Expert Endorsement

```json
{
  "id": "research-climate-2025-001",
  "title": "Advanced Climate Modeling Predictions for 2030",
  "extensions": [
    {
      "id": "spp:endorsement-chains",
      "version": "0.3.0"
    }
  ],
  "endorsements": [
    {
      "endorser_did": "did:web:climatescience.mit.edu:researchers:jane-smith",
      "endorser_name": "Dr. Jane Smith, MIT Climate Lab",
      "timestamp": "2025-01-15T14:30:00Z",
      "signature": "zQmF3ysuHnLmKxn2dKbmF2mLrZjYrJYFBrKqD4ZGwh9JFvW2E",
      "comment": "Methodology is sound and conclusions align with peer-reviewed literature.",
      "endorsement_type": "content",
      "signature_algorithm": "ed25519"
    }
  ]
}
```

### Chained Endorsement with Trust Decay

```json
{
  "endorsements": [
    {
      "endorser": {
        "name": "Reuters",
        "id": "publisher:reuters",
        "type": "publisher"
      },
      "verdict": "corroborated",
      "confidence": 0.89,
      "date": "2025-01-15T14:30:00Z",
      "chain_depth": 1,
      "transitive_endorsements": [
        {
          "endorser": {
            "name": "Associated Press",
            "id": "publisher:ap"
          },
          "verdict": "referenced",
          "confidence": 0.85,
          "date": "2025-01-15T12:00:00Z",
          "chain_depth": 2
        }
      ]
    }
  ]
}
```

## Signature Verification

### Signature Payload

```json
{
  "content_id": "research-climate-2025-001",
  "content_digest": "sha256:af09ad5030dac42aad5da6ee660fca0b81a132c523059b8c3c4a34dd06097f69",
  "endorser_did": "did:web:expert.example.com",
  "timestamp": "2025-01-15T14:30:00Z",
  "endorsement_type": "content"
}
```

### Delegation Signature Payload

```json
{
  "delegator_did": "did:web:supervisor.example.com",
  "delegate_did": "did:web:assistant.example.com",
  "delegation_scope": "research_endorsement",
  "delegation_timestamp": "2025-01-15T14:45:00Z",
  "delegation_expires": "2025-12-31T23:59:59Z"
}
```

### Verification Process

1. Resolve DIDs to fetch public keys
2. Validate endorsement and delegation signatures
3. Check timestamps and expiry
4. Evaluate trust chain integrity

## Trust Network Modelling

### Trust Decay Formula

```
effective_trust = base_trust × (decay_factor ^ (chain_depth - 1))
```

## Use Cases

- **Fact-checker endorsements**
- **Cross-publisher corroboration**
- **Expert and academic validation**
- **Delegated institutional statements**
- **Agent-to-agent trust graphs**

## Implementation Considerations

### Performance
- Cache endorsement validations
- Index by DID or content URI
- Limit chain depth

### Security
- Signature verification required
- Prevent replay and spoofing
- Use key expiry & rotation policies

### Privacy
- Support pseudonymous DIDs
- Respect opt-outs from visibility
- Don’t expose private evidence links

## Compatibility

This extension is backward compatible. Clients ignoring it will safely fallback to basic rendering.

## Future Extensions

- Conditional or revocable endorsements
- Endorsement summarisation and scoring
- Verifiable Credential integration
- Federated reputation networks

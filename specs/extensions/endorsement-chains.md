# Endorsement Chains Extension

**Extension ID:** `spp:endorsement-chains`  
**Version:** 0.3.0  
**Specification:** SPP Extension

## Purpose

The Endorsement Chains extension enables verifiable endorsements of content and delegation of trust between agents. This allows for cryptographically signed testimonials, agent-to-content endorsements, and recursive chains of delegated authority that can be verified independently.

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

### Endorsement Object

- `endorser_did` (string, required): Decentralized Identifier of the endorsing entity
- `endorser_name` (string, optional): Human-readable name of the endorser
- `timestamp` (string, required): ISO 8601 timestamp when endorsement was created
- `signature` (string, required): Cryptographic signature of the endorsement
- `comment` (string, optional): Optional commentary from the endorser
- `endorsement_type` (string, required): Type of endorsement ("content", "delegated", "peer")
- `signature_algorithm` (string, required): Algorithm used for signature (e.g., "ed25519", "secp256k1")
- `delegation_chain` (array, optional): Array of delegation objects for delegated endorsements

### Delegation Object

- `delegator_did` (string, required): DID of the entity granting delegation authority
- `delegator_name` (string, optional): Human-readable name of the delegator
- `delegation_signature` (string, required): Signature authorizing the delegation
- `delegation_timestamp` (string, required): ISO 8601 timestamp when delegation was granted
- `delegation_scope` (string, required): Scope of delegation authority
- `delegation_expires` (string, optional): ISO 8601 timestamp when delegation expires

## Endorsement Types

### content
Direct endorsement of the content by the endorsing agent.

### delegated
Endorsement made on behalf of another agent through a delegation chain.

### peer
Agent-to-agent endorsement, indicating trust or recommendation of another agent.

## Usage

### Declaring the Extension

Add the extension to your `semantic.json`:

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
      "signature_algorithm": "ed25519",
      "delegation_chain": []
    }
  ]
}
```

### Complete Example: Delegated Institutional Endorsement

```json
{
  "id": "policy-report-2025-003",
  "title": "Economic Impact Assessment: Green Energy Transition",
  "extensions": [
    {
      "id": "spp:endorsement-chains",
      "version": "0.3.0"
    }
  ],
  "endorsements": [
    {
      "endorser_did": "did:web:brookings.edu:research-assistant:ai-agent-07",
      "endorser_name": "Brookings Research AI Assistant",
      "timestamp": "2025-01-15T16:00:00Z",
      "signature": "zQmK4xtuJnPmKyn3eKcnF3nLsAkYsJzY2JYFCsLrE5ZHxi9JGwW3F",
      "comment": "Endorsed based on institutional review process.",
      "endorsement_type": "delegated",
      "signature_algorithm": "ed25519",
      "delegation_chain": [
        {
          "delegator_did": "did:web:brookings.edu:directors:john-smith",
          "delegator_name": "Dr. John Smith, Research Director",
          "delegation_signature": "zQmA1wriHmLkNxm2dKbmF2mLrZjYrJYFBrKqD4ZGwh9JFvW2E",
          "delegation_timestamp": "2025-01-01T00:00:00Z",
          "delegation_scope": "institutional_research_endorsement",
          "delegation_expires": "2025-12-31T23:59:59Z"
        }
      ]
    }
  ]
}
```

## Signature Verification

### Signature Payload

Endorsement signatures should be computed over a canonical JSON representation of the endorsement payload:

```json
{
  "content_id": "research-climate-2025-001",
  "content_digest": "sha256:af09ad5030dac42aad5da6ee660fca0b81a132c523059b8c3c4a34dd06097f69",
  "endorser_did": "did:web:expert.example.com",
  "timestamp": "2025-01-15T14:30:00Z",
  "comment": "This analysis aligns with current research findings.",
  "endorsement_type": "content"
}
```

### Delegation Signature Payload

Delegation signatures should be computed over:

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

1. **Resolve DIDs**: Retrieve public keys from DID documents
2. **Verify signatures**: Validate each signature in the chain
3. **Check delegation authority**: Ensure delegations are within scope and not expired
4. **Validate chain integrity**: Verify each step in the delegation chain

## Use Cases

### Expert Validation
- Subject matter experts endorse research findings
- Professional organizations validate policy recommendations  
- Academic institutions certify scholarly work

### Institutional Delegation
- Organizations delegate endorsement authority to agents
- AI systems act on behalf of human supervisors
- Automated quality assurance with human oversight

### Trust Networks
- Peer-to-peer agent recommendations
- Reputation systems based on endorsement history
- Verifiable professional credentials

## Implementation Notes

### DID Resolution
- Support standard DID methods (did:web, did:key, did:ethr)
- Cache DID documents with appropriate TTL
- Handle DID document updates and key rotation

### Signature Algorithms
Recommended signature algorithms:
- `ed25519` - Fast and secure (recommended)
- `secp256k1` - Bitcoin/Ethereum compatibility  
- `secp256r1` - NIST standard

### Delegation Management
- Implement scope validation for delegated authority
- Support time-bounded delegations with expiration
- Allow revocation of delegation authority

## Security Considerations

### Signature Security
- Use cryptographically secure random nonces
- Implement replay attack protection via timestamps
- Validate signature algorithms and key lengths

### Delegation Security  
- Limit delegation scope to prevent privilege escalation
- Implement delegation depth limits to prevent long chains
- Require explicit consent for delegation grants

### Privacy Considerations
- DIDs may reveal information about endorsers
- Consider pseudonymous endorsements for sensitive content
- Respect endorser preferences for public visibility

## Backward Compatibility

This extension is fully backward compatible. Agents that don't recognize the extension will see the existing `endorsements` array but won't perform signature verification. The existing `endorsements` field in the base schema supports this extension's format.

## Future Extensions

### Conditional Endorsements
Support for endorsements with conditions or requirements that must be met.

### Endorsement Aggregation
Methods for combining multiple endorsements into summary scores or metrics.

### Cross-Protocol Compatibility
Integration with other endorsement and reputation systems outside SPP.
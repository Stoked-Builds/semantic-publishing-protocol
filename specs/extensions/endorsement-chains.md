# Endorsement Chains Extension

**Extension ID:** `spp:endorsement-chains`  
**Version:** 0.3.0  
**Specification:** SPP Extension

## Purpose

The Endorsement Chains extension enables content to declare trust relationships and endorsement lineage between agents, publishers, and other entities. This allows agents to build trust networks and make informed decisions about content credibility.

## Schema Fields

When using this extension, content MAY include the following additional fields in `semantic.json`:

### Endorsements Array

```json
{
  "endorsements": [
    {
      "endorser": {
        "name": "OpenFactCheck",
        "id": "endorser:openfactcheck",
        "uri": "https://openfactcheck.org",
        "type": "fact-checker"
      },
      "endorsed": "https://example.com/article",
      "verdict": "accurate",
      "confidence": 0.92,
      "date": "2025-01-15T14:30:00Z",
      "trust_weight": 0.88,
      "evidence": [
        "https://openfactcheck.org/evidence/climate-data",
        "peer-review-verification"
      ],
      "chain_depth": 1,
      "signature": "sha256:abc123...",
      "transitive_endorsements": []
    }
  ]
}
```

## Field Definitions

### endorsements

- **Type:** Array of endorsement objects
- **Required:** No
- **Description:** Collection of endorsements from trusted entities

#### Endorsement Object

- `endorser` (object, required): Information about the endorsing entity
  - `name` (string, required): Display name of endorser
  - `id` (string, required): Unique identifier for endorser
  - `uri` (string, optional): Web presence of endorser
  - `type` (string, optional): Type of endorser ("fact-checker", "publisher", "expert", "community")

- `endorsed` (string, optional): URI of content being endorsed (defaults to current content)
- `verdict` (string, required): Endorsement verdict
- `confidence` (number, required): Confidence level (0.0 to 1.0)
- `date` (string, required): ISO 8601 timestamp of endorsement
- `trust_weight` (number, optional): Weight assigned to this endorser (0.0 to 1.0)
- `evidence` (array, optional): URLs or identifiers supporting the endorsement
- `chain_depth` (number, optional): Depth in endorsement chain (1 = direct)
- `signature` (string, optional): Cryptographic signature for verification
- `transitive_endorsements` (array, optional): Endorsements that led to this one

### Verdict Types

Standard verdict values:

- `accurate` - Content is factually correct
- `verified` - Content has been independently verified
- `corroborated` - Content is supported by other sources
- `referenced` - Content is mentioned or cited by endorser
- `disputed` - Content accuracy is questioned
- `questionable` - Content has reliability concerns
- `false` - Content contains factual errors
- `misleading` - Content is deceptively presented

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

### Simple Endorsement

```json
{
  "id": "news:climate-report",
  "title": "Climate Change Impact Assessment",
  "extensions": [
    {
      "id": "spp:endorsement-chains",
      "version": "0.3.0"
    }
  ],
  "endorsements": [
    {
      "endorser": {
        "name": "Climate Science Institute",
        "id": "endorser:climate-institute",
        "uri": "https://climate-institute.org",
        "type": "expert"
      },
      "verdict": "accurate",
      "confidence": 0.95,
      "date": "2025-01-15T14:30:00Z",
      "evidence": [
        "https://climate-institute.org/peer-review/cr2025"
      ]
    }
  ]
}
```

### Chained Endorsements

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

## Trust Network Construction

### Direct Endorsements
- Endorsements with `chain_depth: 1`
- Highest trust weight
- Direct verification by endorser

### Transitive Endorsements
- Endorsements through intermediate parties
- Reduced trust weight based on chain length
- Tracked via `transitive_endorsements` array

### Trust Decay Formula
```
effective_trust = base_trust × (decay_factor ^ (chain_depth - 1))
```

Where:
- `base_trust`: Original endorser trust weight
- `decay_factor`: Typically 0.8-0.9
- `chain_depth`: Length of endorsement chain

## Verification Methods

### Cryptographic Signatures
- Use `signature` field for tamper detection
- Support for multiple signature schemes
- Public key resolution via endorser URI

### Evidence Links
- URLs to supporting documentation
- Verification trails and audit logs
- Cross-reference with external systems

## Use Cases

### Fact-Checking Integration
- Automated fact-checker endorsements
- Real-time verification results
- Confidence scoring and evidence trails

### Publisher Networks
- Cross-publisher verification
- Breaking news corroboration
- Editorial integrity chains

### Expert Validation
- Subject matter expert endorsements
- Academic peer review integration
- Professional certification tracking

### Community Verification
- Crowdsourced validation
- Community consensus tracking
- Reputation-based weighting

## Implementation Considerations

### Performance
- Cache trust calculations
- Limit chain depth to prevent cycles
- Batch endorsement processing

### Security
- Validate endorser identities
- Prevent endorsement spoofing
- Rate limit to prevent spam

### Privacy
- Respect endorser anonymity preferences
- Handle private verification channels
- Protect sensitive evidence links

## Backward Compatibility

This extension is fully backward compatible. Agents that don't recognize the extension will ignore endorsement fields without breaking core functionality.

## Future Enhancements

### Planned Features
- Real-time endorsement updates
- Conditional endorsements
- Expiring endorsements
- Multi-modal evidence support

### Integration Opportunities
- Blockchain trust anchoring
- W3C Verifiable Credentials
- OAuth endorser authentication
- Federated trust networks
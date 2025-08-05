# Endorsement Chains Extension Demo

This directory contains example files demonstrating the SPP Endorsement Chains extension (`spp:endorsement-chains`).

## Files

### semantic.json
Basic example showing direct content endorsements from two experts:
- Climate scientist from MIT endorsing research methodology
- Marine biologist from NOAA validating the data analysis

### delegation-example.json  
Advanced example showing delegated institutional endorsement:
- AI research assistant making endorsement on behalf of research director
- Includes delegation chain with scope and expiration
- Also includes direct endorsement from external expert

## Running Validation

You can validate these examples using the SPP validator:

```bash
# Validate basic endorsement example
npm run validate examples/extensions/endorsement-chains-demo/semantic.json

# Validate delegation example  
npm run validate examples/extensions/endorsement-chains-demo/delegation-example.json
```

Both files should validate successfully, demonstrating that:
1. The endorsement schema is properly defined
2. Required fields are enforced
3. Optional delegation chains work correctly
4. DID format validation functions properly

## Extension Features Demonstrated

### Basic Endorsements
- DID-based endorser identification
- Cryptographic signatures for verification
- Optional human-readable comments
- Timestamp recording

### Delegation Chains
- Multi-level trust delegation
- Scoped authority with expiration
- Institutional endorsement capabilities
- Agent-to-agent trust relationships

### Security Features
- Support for multiple signature algorithms (ed25519, secp256k1, secp256r1)
- Proper timestamp formatting
- DID pattern validation
- Required signature verification data
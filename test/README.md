# Build Agent Conformance & Validator Test Suite

This directory contains the comprehensive test suite for validating Build Agent conformance with the Semantic Publishing Protocol (SPP) extensions and trust mechanisms.

## Overview

The Agent Conformance Test Suite evaluates whether agents correctly:
- Parse `semantic.json` + extensions
- Respect trust weights and endorsement rules  
- Validate content against core schemas
- Make appropriate rendering decisions based on trust signals

## Test Files

### Core Test Suite
- **`agent-conformance.test.js`** - Main conformance test suite with comprehensive scenarios
- **`validator.test.js`** - Core SPP validation tests
- **`README-agent-conformance.md`** - Detailed documentation for the conformance tests

### CLI Tools
- **`../bin/spp-conformance.js`** - Command-line interface for running conformance tests

## Quick Start

### Running Tests

```bash
# Run all tests (core + conformance)
npm test

# Run only conformance tests  
node --test test/agent-conformance.test.js

# Interactive CLI testing
node bin/spp-conformance.js generate-sample > sample.json
node bin/spp-conformance.js validate-agent sample.json --verbose
```

### CLI Usage

```bash
# Generate test data
spp-conformance generate-sample

# Test trust calculations
spp-conformance test-trust ./semantic.json

# Test extension parsing
spp-conformance test-extensions ./semantic.json

# Test endorsement validation
spp-conformance test-endorsements ./semantic.json

# Full agent validation
spp-conformance validate-agent ./semantic.json --verbose
```

## Test Categories

### 1. Extension Declaration Parsing
Tests that agents correctly identify and handle SPP extensions:
- `spp:endorsement-chains` - Trust relationships and endorsement lineage
- `spp:trust-weighting` - Content trust calculation based on endorsements
- `spp:time-versioning` - Snapshot and version history support
- `spp:ephemeral-content` - Self-expiring content support

### 2. Endorsement Chain Validation
Validates endorsement structure and integrity:
- Required field validation
- Confidence score ranges (0.0-1.0)
- Trust weight validation
- Evidence link validation
- Chain depth tracking

### 3. Trust Weight Calculation
Tests accurate trust score computation:
- Weighted averaging algorithms
- Verdict modifier application
- Source credibility integration
- Complex trust chain handling

### 4. Rendering Decision Logic
Validates content presentation decisions:
- **High Trust (≥0.8)**: Highlight prominently
- **Medium Trust (≥0.6)**: Display normally
- **Low Trust (≥0.3)**: Display with warnings
- **Very Low Trust (<0.3)**: Suppress or minimize

## Test Data Scenarios

### High Trust Content
- Multiple credible endorsements (news organizations, fact-checkers)
- High confidence scores
- Established publisher trust weights
- Expected outcome: Highlight prominently

### Mixed Trust Signals  
- Conflicting endorsements (some positive, some disputed)
- Controversy detection mechanisms
- Complex trust chain calculations
- Expected outcome: Display with appropriate warnings

### Low Trust Content
- No endorsements or poor-quality endorsements
- Anonymous authors
- Low source credibility
- Expected outcome: Suppress or minimize display

### Multi-Extension Scenarios
- Combined extension usage testing
- Compatibility validation
- Feature interaction testing
- Backward compatibility verification

## Conformance Levels

### Basic Conformance
✅ Parse extension declarations correctly  
✅ Handle unknown extensions gracefully  
✅ Calculate basic trust scores  
✅ Make simple rendering decisions  

### Advanced Conformance  
✅ Process complex endorsement chains  
✅ Detect controversy and conflicting signals  
✅ Integrate multiple trust signals  
✅ Support time-based trust decay  

### Expert Conformance
✅ Custom trust weight configuration  
✅ Real-time trust score updates  
✅ Advanced decision algorithms  
✅ Network effect calculations  

## Implementation Notes

### Trust Score Algorithm

The default implementation uses weighted averaging:

```javascript
trust_score = (endorsement_score * 0.7) + (source_credibility * 0.3)

where:
endorsement_score = Σ(weight × confidence × verdict_modifier) / Σ(weight)
```

### Verdict Modifiers
- `accurate`, `verified`, `corroborated`: 1.0
- `referenced`, `mentioned`: 0.7  
- `disputed`, `questionable`: 0.3
- `false`, `misleading`: 0.1

### Trust Weight Sources
1. Explicit `trust_weight` in endorsement
2. Global trust weight configuration
3. Default fallback (0.5)

## Extension Integration

### Required Extensions
- **`spp:endorsement-chains`** - Core endorsement functionality
- **`spp:trust-weighting`** - Trust calculation algorithms

### Optional Extensions
- **`spp:time-versioning`** - Snapshot and version history
- **`spp:ephemeral-content`** - Self-expiring content
- **`spp:alt-content-types`** - Alternative media formats

## Usage for Certification

This test suite is designed for:

### Extension Testing
- Validate new extension implementations
- Test extension compatibility
- Verify backward compatibility

### Agent UX Fidelity  
- Ensure consistent user experience
- Validate rendering decisions
- Test trust indicator display

### Compatibility Certification
- Formal conformance validation
- Interoperability testing
- Standards compliance verification

## Development Workflow

### Adding New Tests

1. Create test data in `/tmp/spp-agent-conformance-test-data/`
2. Add test cases to `agent-conformance.test.js`
3. Update documentation
4. Verify all tests pass

### Custom Trust Algorithms

1. Extend `AgentConformanceTestFramework` class
2. Override `calculateTrustScore()` method
3. Add algorithm-specific tests
4. Document algorithm parameters

### Extension Support

1. Add extension specification to `/specs/extensions/`
2. Create test scenarios for the extension
3. Update conformance tests
4. Add CLI support if needed

## Future Enhancements

- **Real-time Testing**: Live trust score updates
- **Network Effects**: Cross-content trust propagation  
- **ML Integration**: Neural network-based trust models
- **Federated Trust**: Cross-platform trust sharing

## Related Documentation

- [SPP Extension Specifications](../specs/extensions/)
- [Trust Weighting Extension](../specs/extensions/trust-weighting.md)
- [Endorsement Chains Extension](../specs/extensions/endorsement-chains.md)
- [Core SPP Validation](../README-spp-validate.md)
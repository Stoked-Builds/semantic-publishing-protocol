# Agent Conformance Test Suite

A comprehensive test harness to evaluate Build Agent conformance with the Semantic Publishing Protocol (SPP) extensions.

## Purpose

This test suite validates whether agents correctly:
- Parse semantic.json + extensions
- Respect trust weights and endorsement rules
- Validate content against core schemas
- Make appropriate rendering decisions based on trust signals

## Usage

### Running the Test Suite

```bash
# Run all tests including conformance tests
npm test

# Run only conformance tests (Node.js 20+)
node --test test/agent-conformance.test.js
```

### Test Categories

#### 1. Extension Declaration Parsing
Validates that agents correctly identify and parse extension declarations in `semantic.json`:

```javascript
// Example extension declaration
{
  "extensions": [
    { "id": "spp:endorsement-chains", "version": "0.3.0" },
    { "id": "spp:trust-weighting", "version": "0.3.0" }
  ]
}
```

#### 2. Endorsement Chain Validation
Tests agent ability to parse and validate endorsement structures:

```javascript
// Example endorsement
{
  "endorsements": [
    {
      "endorser": {
        "name": "OpenFactCheck",
        "id": "endorser:openfactcheck",
        "uri": "https://openfactcheck.org"
      },
      "verdict": "accurate",
      "confidence": 0.92,
      "trust_weight": 0.88
    }
  ]
}
```

#### 3. Trust Weight Calculation
Validates correct calculation of aggregate trust scores based on:
- Individual endorser trust weights
- Confidence levels
- Verdict types (accurate, disputed, false, etc.)
- Chain depth and complexity

#### 4. Rendering Decision Logic
Tests agent decision-making for content presentation:
- **Highlight** (trust score ≥ 0.8): Prominent display
- **Display** (trust score ≥ 0.6): Normal display  
- **Display with Warning** (trust score ≥ 0.3): Show with caution indicators
- **Suppress** (trust score < 0.3): Hide or minimize

## Test Data

The suite generates comprehensive test scenarios:

### High Trust Content
- Multiple credible endorsements
- High confidence scores
- Established publisher trust weights

### Mixed Trust Signals
- Conflicting endorsements
- Controversy detection
- Complex trust chains

### Low Trust Content
- No endorsements
- Anonymous authors
- Poor source credibility

### Multi-Extension Content
- Combined extension usage
- Time-versioning integration
- Ephemeral content handling

## Agent Integration

To test your agent implementation:

### 1. Import the Test Framework

```javascript
import { AgentConformanceTestFramework } from './test/agent-conformance.test.js';

const testFramework = new AgentConformanceTestFramework();
```

### 2. Test Extension Support

```javascript
const content = loadSemanticContent();
const supportsEndorsements = testFramework.checkExtensionSupport(
  content, 
  ['spp:endorsement-chains']
);
```

### 3. Validate Trust Calculations

```javascript
const trustScore = testFramework.calculateTrustScore(content);
const isValid = testFramework.validateTrustPath(content, expectedScore);
```

### 4. Test Rendering Decisions

```javascript
const decision = testFramework.testRenderingDecision(content, 'highlight');
console.log(`Expected: ${decision.expected}, Actual: ${decision.actual}`);
```

## Expected Outcomes

### Conformant Agents Should:

1. **Parse Extensions Correctly**
   - Identify all declared extensions
   - Handle unknown extensions gracefully
   - Maintain backward compatibility

2. **Calculate Trust Accurately**
   - Respect endorser trust weights
   - Aggregate confidence scores properly
   - Handle conflicting signals appropriately

3. **Make Sound Rendering Decisions**
   - Highlight high-trust content
   - Warn about disputed content
   - Suppress low-trust content

4. **Validate Endorsement Chains**
   - Check required fields
   - Validate confidence ranges (0-1)
   - Detect structural issues

## Certification Levels

The test suite supports different conformance levels:

### Basic Conformance
- Extension declaration parsing
- Basic trust score calculation
- Simple rendering decisions

### Advanced Conformance  
- Complex trust chain handling
- Controversy detection
- Multi-extension integration

### Expert Conformance
- Custom trust weight configuration
- Advanced decision algorithms
- Real-time trust updates

## Customization

### Trust Weight Configuration

Edit `/tmp/spp-agent-conformance-test-data/trust-weights.json`:

```json
{
  "publisher:reuters": 0.95,
  "publisher:bbc": 0.92,
  "endorser:openfactcheck": 0.88,
  "endorser:custom-verifier": 0.75
}
```

### Custom Test Scenarios

Add your own test data files and scenarios:

```javascript
// Custom test case
test('Custom agent behavior test', () => {
  const customContent = createCustomTestContent();
  const result = testFramework.customValidation(customContent);
  strictEqual(result.passes, true);
});
```

## Implementation Notes

### Trust Score Algorithm

The default trust calculation uses weighted averaging:

```
trust_score = Σ(endorser_weight × confidence × verdict_modifier) / Σ(endorser_weight)
```

Where:
- `endorser_weight`: Trust weight for endorsing entity (0-1)
- `confidence`: Endorser's confidence in verdict (0-1)  
- `verdict_modifier`: Multiplier based on verdict type
  - accurate/verified: 1.0
  - disputed/questionable: 0.3
  - false/misleading: 0.1

### Verdict Types

Supported verdict types and their modifiers:
- `accurate`, `verified`, `corroborated`: 1.0
- `referenced`, `mentioned`: 0.7
- `disputed`, `questionable`: 0.3
- `false`, `misleading`: 0.1

### Extension Compatibility

The test suite validates compatibility with SPP v0.3.0 extensions:
- `spp:endorsement-chains`
- `spp:trust-weighting`  
- `spp:time-versioning`
- `spp:ephemeral-content`
- `spp:alt-content-types`

## Contributing

To add new test scenarios:

1. Create test data in `/tmp/spp-agent-conformance-test-data/`
2. Add test cases to `test/agent-conformance.test.js`
3. Update documentation with new test coverage
4. Ensure tests pass with `npm test`

## Related Documentation

- [SPP Extension Specifications](../specs/extensions/)
- [Trust Weighting Extension](../specs/extensions/trust-weighting.md)
- [Endorsement Chains Extension](../specs/extensions/endorsement-chains.md)
- [Core SPP Validation](./README-spp-validate.md)
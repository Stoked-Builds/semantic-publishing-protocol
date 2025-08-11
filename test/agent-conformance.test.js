import { test } from 'node:test';
import { strictEqual, ok, deepStrictEqual } from 'node:assert';
import fs from 'fs';
import path from 'path';
import { validateFile } from '../lib/validator.js';

/**
 * Agent Conformance Test Suite
 * 
 * Tests agent support for:
 * - endorsement-chains
 * - trust-weighting
 * - extension declarations in semantic.json
 * - trust paths and rendering decisions
 */

const testDataDir = '/tmp/spp-agent-conformance-test-data';

// Setup test data directory
if (!fs.existsSync(testDataDir)) {
  fs.mkdirSync(testDataDir, { recursive: true });
}

// Sample trust weighting scenarios
const trustWeights = {
  "publisher:reuters": 0.95,
  "publisher:bbc": 0.92,
  "publisher:blog-example": 0.3,
  "endorser:openfactcheck": 0.88,
  "endorser:mediawatch": 0.75,
  "endorser:user-community": 0.45
};

// Create test data files
function setupTestData() {
  // 1. Content with endorsement chains
  const contentWithEndorsements = {
    "protocolVersion": "1.0.0",
    "id": "news:climate-report-2025",
    "title": "Global Climate Report Shows Accelerating Changes",
    "author": { "name": "Sarah Climate", "id": "author:sarah-climate" },
    "publisher": { "name": "Science Daily", "id": "publisher:science-daily" },
    "extensions": [
      { "id": "spp:endorsement-chains", "version": "0.3.0" },
      { "id": "spp:trust-weighting", "version": "0.3.0" }
    ],
    "endorsements": [
      {
        "endorser": {
          "name": "OpenFactCheck",
          "id": "endorser:openfactcheck",
          "uri": "https://openfactcheck.org"
        },
        "verdict": "accurate",
        "confidence": 0.92,
        "date": "2025-01-15",
        "trust_weight": 0.88,
        "evidence": ["https://ipcc.ch/report/ar6"]
      },
      {
        "endorser": {
          "name": "Climate Science Watch",
          "id": "endorser:climate-watch", 
          "uri": "https://climatewatch.org"
        },
        "verdict": "verified",
        "confidence": 0.89,
        "date": "2025-01-15",
        "trust_weight": 0.82,
        "evidence": ["peer-review-check"]
      }
    ],
    "trust_signals": {
      "source_credibility": 0.85,
      "peer_review": true,
      "fact_checked": true,
      "endorsement_chain_length": 2,
      "aggregate_trust_score": 0.87
    }
  };

  // 2. Content with complex trust chain
  const complexTrustChain = {
    "protocolVersion": "1.0.0",
    "id": "news:economic-analysis",
    "title": "Market Analysis: Tech Sector Outlook",
    "author": { "name": "John Economist", "id": "author:john-economist" },
    "publisher": { "name": "Financial Blog", "id": "publisher:fin-blog" },
    "extensions": [
      { "id": "spp:endorsement-chains", "version": "0.3.0" },
      { "id": "spp:trust-weighting", "version": "0.3.0" }
    ],
    "endorsements": [
      {
        "endorser": {
          "name": "Reuters",
          "id": "publisher:reuters",
          "uri": "https://reuters.com"
        },
        "verdict": "referenced",
        "confidence": 0.78,
        "date": "2025-01-14",
        "trust_weight": 0.95,
        "chain_depth": 1
      },
      {
        "endorser": {
          "name": "User Community Reviews",
          "id": "endorser:user-community",
          "uri": "https://community-verify.org"
        },
        "verdict": "disputed",
        "confidence": 0.42,
        "date": "2025-01-15",
        "trust_weight": 0.45,
        "chain_depth": 1,
        "dissenting_voices": 3
      }
    ],
    "trust_signals": {
      "source_credibility": 0.3,
      "controversy_detected": true,
      "endorsement_chain_length": 2,
      "aggregate_trust_score": 0.52
    }
  };

  // 3. Content with multiple extensions
  const multiExtensionContent = {
    "protocolVersion": "1.0.0",
    "id": "news:breaking-story",
    "title": "Breaking: Policy Changes Announced",
    "author": { "name": "News Reporter", "id": "author:reporter" },
    "publisher": { "name": "Breaking News", "id": "publisher:breaking" },
    "extensions": [
      { "id": "spp:endorsement-chains", "version": "0.3.0" },
      { "id": "spp:trust-weighting", "version": "0.3.0" },
      { "id": "spp:time-versioning", "version": "0.3.0" },
      { "id": "spp:ephemeral-content", "version": "0.3.0" }
    ],
    "endorsements": [
      {
        "endorser": {
          "name": "BBC News",
          "id": "publisher:bbc",
          "uri": "https://bbc.com"
        },
        "verdict": "corroborated",
        "confidence": 0.94,
        "date": "2025-01-15",
        "trust_weight": 0.92
      }
    ],
    "snapshots": [
      {
        "timestamp": "2025-01-15T10:00:00Z",
        "version": "1.0.0",
        "content_hash": "sha256:abc123..."
      }
    ],
    "expiry": {
      "expires_at": "2025-01-22T10:00:00Z",
      "reason": "breaking-news-update"
    },
    "trust_signals": {
      "source_credibility": 0.8,
      "breaking_news": true,
      "time_sensitive": true,
      "aggregate_trust_score": 0.88
    }
  };

  // 4. Untrusted content (low trust signals)
  const untrustedContent = {
    "protocolVersion": "1.0.0",
    "id": "blog:conspiracy-theory",
    "title": "Hidden Truth About Recent Events",
    "author": { "name": "Anonymous Blogger", "id": "author:anon-blogger" },
    "publisher": { "name": "Random Blog", "id": "publisher:random-blog" },
    "extensions": [
      { "id": "spp:trust-weighting", "version": "0.3.0" }
    ],
    "endorsements": [],
    "trust_signals": {
      "source_credibility": 0.1,
      "fact_checked": false,
      "anonymous_author": true,
      "aggregate_trust_score": 0.15
    }
  };

  // Write test files
  fs.writeFileSync(
    path.join(testDataDir, 'endorsed-content.json'),
    JSON.stringify(contentWithEndorsements, null, 2)
  );
  
  fs.writeFileSync(
    path.join(testDataDir, 'complex-trust-chain.json'),
    JSON.stringify(complexTrustChain, null, 2)
  );
  
  fs.writeFileSync(
    path.join(testDataDir, 'multi-extension.json'),
    JSON.stringify(multiExtensionContent, null, 2)
  );
  
  fs.writeFileSync(
    path.join(testDataDir, 'untrusted-content.json'),
    JSON.stringify(untrustedContent, null, 2)
  );

  // Trust weighting configuration
  fs.writeFileSync(
    path.join(testDataDir, 'trust-weights.json'),
    JSON.stringify(trustWeights, null, 2)
  );
}

/**
 * Agent conformance test framework
 */
class AgentConformanceTestFramework {
  constructor() {
    this.trustWeights = trustWeights;
  }

  /**
   * Calculate aggregate trust score based on endorsements
   */
  calculateTrustScore(content) {
    if (!content.endorsements || content.endorsements.length === 0) {
      return content.trust_signals?.source_credibility || 0.1;
    }

    let totalWeight = 0;
    let weightedSum = 0;

    for (const endorsement of content.endorsements) {
      const weight = endorsement.trust_weight || this.trustWeights[endorsement.endorser.id] || 0.5;
      const confidence = endorsement.confidence || 0.5;
      
      // Adjust for verdict
      let verdictModifier = 1.0;
      switch (endorsement.verdict) {
        case 'accurate': case 'verified': case 'corroborated':
          verdictModifier = 1.0;
          break;
        case 'disputed': case 'questionable':
          verdictModifier = 0.3;
          break;
        case 'false': case 'misleading':
          verdictModifier = 0.1;
          break;
        default:
          verdictModifier = 0.7;
      }

      const adjustedConfidence = confidence * verdictModifier;
      weightedSum += weight * adjustedConfidence;
      totalWeight += weight;
    }

    const endorsementScore = totalWeight > 0 ? weightedSum / totalWeight : 0.1;
    
    // Combine with source credibility if available
    const sourceCredibility = content.trust_signals?.source_credibility || 0.5;
    return (endorsementScore * 0.7) + (sourceCredibility * 0.3);
  }

  /**
   * Validate trust path calculation
   */
  validateTrustPath(content, expectedScore, tolerance = 0.05) {
    const calculatedScore = this.calculateTrustScore(content);
    return Math.abs(calculatedScore - expectedScore) <= tolerance;
  }

  /**
   * Check extension support
   */
  checkExtensionSupport(content, requiredExtensions) {
    if (!content.extensions) return false;
    
    const declaredExtensions = content.extensions.map(ext => ext.id);
    return requiredExtensions.every(ext => declaredExtensions.includes(ext));
  }

  /**
   * Validate endorsement chain structure
   */
  validateEndorsementChain(content) {
    if (!content.endorsements) return { valid: true, issues: [] };
    
    const issues = [];
    
    for (const [index, endorsement] of content.endorsements.entries()) {
      // Check required fields
      if (!endorsement.endorser || !endorsement.endorser.id) {
        issues.push(`Endorsement ${index}: Missing endorser ID`);
      }
      
      if (!endorsement.verdict) {
        issues.push(`Endorsement ${index}: Missing verdict`);
      }
      
      if (typeof endorsement.confidence !== 'number' || 
          endorsement.confidence < 0 || endorsement.confidence > 1) {
        issues.push(`Endorsement ${index}: Invalid confidence value`);
      }
      
      // Check trust weight
      if (endorsement.trust_weight && 
          (endorsement.trust_weight < 0 || endorsement.trust_weight > 1)) {
        issues.push(`Endorsement ${index}: Invalid trust weight`);
      }
    }
    
    return { valid: issues.length === 0, issues };
  }

  /**
   * Test agent rendering decision
   */
  testRenderingDecision(content, expectedDecision) {
    const trustScore = this.calculateTrustScore(content);
    
    // Simple rendering decision logic
    let actualDecision;
    if (trustScore >= 0.8) {
      actualDecision = 'highlight';
    } else if (trustScore >= 0.6) {
      actualDecision = 'display';
    } else if (trustScore >= 0.3) {
      actualDecision = 'display-with-warning';
    } else {
      actualDecision = 'suppress';
    }
    
    return {
      expected: expectedDecision,
      actual: actualDecision,
      trustScore: trustScore,
      matches: expectedDecision === actualDecision
    };
  }
}

// Initialize test framework and data
setupTestData();
const testFramework = new AgentConformanceTestFramework();

// Test: Extension Declaration Parsing
test('Agent should correctly parse extension declarations', async () => {
  const result = await validateFile(path.join(testDataDir, 'multi-extension.json'), {
    schemaDir: path.resolve(process.cwd(), 'schemas'),
    extensionsOnly: true  // Skip core schema validation for extension testing
  });
  
  strictEqual(result.errors.length, 0, 'Should validate without errors');
  
  const content = JSON.parse(fs.readFileSync(path.join(testDataDir, 'multi-extension.json'), 'utf8'));
  
  // Test extension support detection
  ok(testFramework.checkExtensionSupport(content, ['spp:endorsement-chains']), 
     'Should detect endorsement-chains extension');
  ok(testFramework.checkExtensionSupport(content, ['spp:trust-weighting']), 
     'Should detect trust-weighting extension');
  ok(testFramework.checkExtensionSupport(content, ['spp:time-versioning']), 
     'Should detect time-versioning extension');
  
  strictEqual(content.extensions.length, 4, 'Should have 4 extensions declared');
});

// Test: Endorsement Chain Validation
test('Agent should validate endorsement chain structure', async () => {
  const content = JSON.parse(fs.readFileSync(path.join(testDataDir, 'endorsed-content.json'), 'utf8'));
  
  const validation = testFramework.validateEndorsementChain(content);
  ok(validation.valid, `Endorsement chain should be valid. Issues: ${validation.issues.join(', ')}`);
  
  strictEqual(content.endorsements.length, 2, 'Should have 2 endorsements');
  
  // Test individual endorsement structure
  const firstEndorsement = content.endorsements[0];
  ok(firstEndorsement.endorser.id, 'Should have endorser ID');
  ok(firstEndorsement.verdict, 'Should have verdict');
  ok(typeof firstEndorsement.confidence === 'number', 'Should have numeric confidence');
  ok(firstEndorsement.confidence >= 0 && firstEndorsement.confidence <= 1, 'Confidence should be between 0 and 1');
});

// Test: Trust Weight Calculation
test('Agent should correctly calculate trust weights', () => {
  const content = JSON.parse(fs.readFileSync(path.join(testDataDir, 'endorsed-content.json'), 'utf8'));
  
  const calculatedScore = testFramework.calculateTrustScore(content);
  const expectedScore = content.trust_signals.aggregate_trust_score;
  
  ok(testFramework.validateTrustPath(content, expectedScore, 0.1), 
     `Trust score calculation should match expected. Calculated: ${calculatedScore}, Expected: ${expectedScore}`);
});

// Test: Complex Trust Chain Processing
test('Agent should handle complex trust chains with conflicting signals', () => {
  const content = JSON.parse(fs.readFileSync(path.join(testDataDir, 'complex-trust-chain.json'), 'utf8'));
  
  const validation = testFramework.validateEndorsementChain(content);
  ok(validation.valid, 'Complex trust chain should be structurally valid');
  
  const calculatedScore = testFramework.calculateTrustScore(content);
  
  // Should reflect mixed signals (high trust Reuters + low trust community)
  // The calculated score of ~0.38 reflects the disputed verdict from community
  ok(calculatedScore > 0.3 && calculatedScore < 0.6, 
     `Trust score should reflect mixed signals. Got: ${calculatedScore}`);
     
  // Should detect controversy
  ok(content.trust_signals.controversy_detected, 'Should detect controversy in trust signals');
});

// Test: Rendering Decision Logic
test('Agent should make appropriate rendering decisions based on trust scores', () => {
  // High trust content should be highlighted
  const highTrustContent = JSON.parse(fs.readFileSync(path.join(testDataDir, 'endorsed-content.json'), 'utf8'));
  const highTrustDecision = testFramework.testRenderingDecision(highTrustContent, 'highlight');
  ok(highTrustDecision.matches, 
     `High trust content should be highlighted. Expected: ${highTrustDecision.expected}, Actual: ${highTrustDecision.actual}`);
  
  // Low trust content should be suppressed
  const lowTrustContent = JSON.parse(fs.readFileSync(path.join(testDataDir, 'untrusted-content.json'), 'utf8'));
  const lowTrustDecision = testFramework.testRenderingDecision(lowTrustContent, 'suppress');
  ok(lowTrustDecision.matches, 
     `Low trust content should be suppressed. Expected: ${lowTrustDecision.expected}, Actual: ${lowTrustDecision.actual}`);
     
  // Mixed trust content should display with warning
  const mixedTrustContent = JSON.parse(fs.readFileSync(path.join(testDataDir, 'complex-trust-chain.json'), 'utf8'));
  const mixedTrustDecision = testFramework.testRenderingDecision(mixedTrustContent, 'display-with-warning');
  ok(mixedTrustDecision.matches, 
     `Mixed trust content should display with warning. Expected: ${mixedTrustDecision.expected}, Actual: ${mixedTrustDecision.actual}`);
});

// Test: Trust Weight Respect
test('Agent should respect configured trust weights', () => {
  const content = {
    "protocolVersion": "1.0.0",
    "id": "test:trust-weights",
    "title": "Test Trust Weights",
    "author": { "name": "Test Author" },
    "endorsements": [
      {
        "endorser": { "id": "publisher:reuters" },
        "verdict": "accurate",
        "confidence": 0.9,
        "trust_weight": 0.95
      },
      {
        "endorser": { "id": "publisher:blog-example" },
        "verdict": "accurate", 
        "confidence": 0.9,
        "trust_weight": 0.3
      }
    ]
  };
  
  const score = testFramework.calculateTrustScore(content);
  
  // Reuters should have much more influence than blog due to trust weights
  // Expected calculation: 
  // Endorsement score = (0.95 * 0.9 + 0.3 * 0.9) / (0.95 + 0.3) = 1.125 / 1.25 = 0.9
  // Final score = (0.9 * 0.7) + (0.5 * 0.3) = 0.63 + 0.15 = 0.78
  ok(score > 0.75 && score < 0.82, 
     `Trust weights should be properly weighted. Score: ${score}`);
});

// Test: Extension Compatibility 
test('Agent should handle unknown extensions gracefully', async () => {
  const contentWithUnknownExtension = {
    "protocolVersion": "1.0.0",
    "id": "test:unknown-ext",
    "title": "Test Unknown Extension",
    "author": { "name": "Test Author" },
    "extensions": [
      { "id": "spp:unknown-extension", "version": "1.0.0" },
      { "id": "spp:trust-weighting", "version": "0.3.0" }
    ]
  };
  
  fs.writeFileSync(
    path.join(testDataDir, 'unknown-extension.json'),
    JSON.stringify(contentWithUnknownExtension, null, 2)
  );
  
  const result = await validateFile(path.join(testDataDir, 'unknown-extension.json'), {
    schemaDir: path.resolve(process.cwd(), 'schemas')
  });
  
  // Should still validate core schema
  strictEqual(result.errors.length, 0, 'Should validate core schema despite unknown extension');
  
  // Should detect known extension
  ok(testFramework.checkExtensionSupport(contentWithUnknownExtension, ['spp:trust-weighting']), 
     'Should detect known extensions');
});

// Export test framework for use by other tests
export { AgentConformanceTestFramework, testFramework };
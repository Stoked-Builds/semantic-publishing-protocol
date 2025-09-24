#!/usr/bin/env node

/**
 * SPP Agent Conformance Test Runner
 * 
 * CLI utility to run agent conformance tests and validate SPP compliance
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { AgentConformanceTestFramework } from '../test/agent-conformance.test.js';

const framework = new AgentConformanceTestFramework();

function printUsage() {
  console.log(`
SPP Agent Conformance Test Runner

USAGE:
  spp-conformance <command> [options]

COMMANDS:
  test-trust <file>      Test trust score calculation for a semantic.json file
  test-extensions <file> Test extension parsing and validation
  test-endorsements <file> Test endorsement chain validation
  validate-agent <file>  Run full agent conformance test suite
  generate-sample       Generate sample test data
  
OPTIONS:
  --help                Show this help message
  --verbose             Enable verbose output
  --output <format>     Output format: json, table (default: table)

EXAMPLES:
  spp-conformance test-trust ./semantic.json
  spp-conformance validate-agent ./content.json --verbose
  spp-conformance generate-sample
`);
}

function formatScore(score) {
  if (score >= 0.8) return `🟢 ${score.toFixed(3)} (HIGH TRUST)`;
  if (score >= 0.6) return `🟡 ${score.toFixed(3)} (MEDIUM TRUST)`;
  if (score >= 0.3) return `🟠 ${score.toFixed(3)} (LOW TRUST)`;
  return `🔴 ${score.toFixed(3)} (VERY LOW TRUST)`;
}

function testTrustScore(filePath, options = {}) {
  try {
    const content = JSON.parse(readFileSync(filePath, 'utf8'));
    const score = framework.calculateTrustScore(content);
    const decision = framework.testRenderingDecision(content, 'auto');
    
    console.log('\n📊 TRUST SCORE ANALYSIS');
    console.log('==================================================');
    console.log(`File: ${filePath}`);
    console.log(`Trust Score: ${formatScore(score)}`);
    console.log(`Rendering Decision: ${decision.actual.toUpperCase()}`);
    
    if (content.endorsements && content.endorsements.length > 0) {
      console.log(`\n📝 ENDORSEMENTS (${content.endorsements.length})`);
      content.endorsements.forEach((endorsement, i) => {
        const weight = endorsement.trust_weight || 0.5;
        console.log(`  ${i + 1}. ${endorsement.endorser.name} - ${endorsement.verdict} (${endorsement.confidence}, weight: ${weight})`);
      });
    }
    
    if (content.trust_signals) {
      console.log('\n🔍 TRUST SIGNALS');
      Object.entries(content.trust_signals).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });
    }
    
    if (options.verbose) {
      console.log('\n🧮 CALCULATION DETAILS');
      console.log('Algorithm: Weighted average with source credibility');
      console.log('Formula: (endorsement_score * 0.7) + (source_credibility * 0.3)');
    }
    
  } catch (error) {
    console.error(`❌ Error testing trust score: ${error.message}`);
    process.exit(1);
  }
}

function testExtensions(filePath, options = {}) {
  try {
    const content = JSON.parse(readFileSync(filePath, 'utf8'));
    
    console.log('\n🔧 EXTENSION ANALYSIS');
    console.log('==================================================');
    console.log(`File: ${filePath}`);
    
    if (content.extensions && content.extensions.length > 0) {
      console.log(`\n📦 DECLARED EXTENSIONS (${content.extensions.length})`);
      content.extensions.forEach((ext, i) => {
        const supported = ['spp:endorsement-chains', 'spp:trust-weighting', 'spp:time-versioning'].includes(ext.id);
        const status = supported ? '✅' : '⚠️ ';
        console.log(`  ${i + 1}. ${status} ${ext.id} v${ext.version}`);
      });
      
      // Test specific extension support
      const hasEndorsements = framework.checkExtensionSupport(content, ['spp:endorsement-chains']);
      const hasTrustWeighting = framework.checkExtensionSupport(content, ['spp:trust-weighting']);
      const hasTimeVersioning = framework.checkExtensionSupport(content, ['spp:time-versioning']);
      
      console.log('\n🎯 EXTENSION SUPPORT TEST');
      console.log(`  Endorsement Chains: ${hasEndorsements ? '✅ SUPPORTED' : '❌ NOT SUPPORTED'}`);
      console.log(`  Trust Weighting: ${hasTrustWeighting ? '✅ SUPPORTED' : '❌ NOT SUPPORTED'}`);
      console.log(`  Time Versioning: ${hasTimeVersioning ? '✅ SUPPORTED' : '❌ NOT SUPPORTED'}`);
      
    } else {
      console.log('\n❌ No extensions declared');
    }
    
  } catch (error) {
    console.error(`❌ Error testing extensions: ${error.message}`);
    process.exit(1);
  }
}

function testEndorsements(filePath, options = {}) {
  try {
    const content = JSON.parse(readFileSync(filePath, 'utf8'));
    
    console.log('\n🤝 ENDORSEMENT VALIDATION');
    console.log('==================================================');
    console.log(`File: ${filePath}`);
    
    const validation = framework.validateEndorsementChain(content);
    
    if (validation.valid) {
      console.log('\n✅ ENDORSEMENT CHAIN VALID');
    } else {
      console.log('\n❌ ENDORSEMENT CHAIN ISSUES:');
      validation.issues.forEach(issue => console.log(`  • ${issue}`));
    }
    
    if (content.endorsements && content.endorsements.length > 0) {
      console.log(`\n📋 ENDORSEMENT DETAILS (${content.endorsements.length})`);
      content.endorsements.forEach((endorsement, i) => {
        console.log(`\n  ${i + 1}. ${endorsement.endorser.name || 'Unknown'}`);
        console.log(`     ID: ${endorsement.endorser.id || 'N/A'}`);
        console.log(`     Verdict: ${endorsement.verdict || 'N/A'}`);
        console.log(`     Confidence: ${endorsement.confidence || 'N/A'}`);
        console.log(`     Trust Weight: ${endorsement.trust_weight || 'N/A'}`);
        if (endorsement.evidence) {
          console.log(`     Evidence: ${endorsement.evidence.length} item(s)`);
        }
      });
    } else {
      console.log('\n📭 No endorsements found');
    }
    
  } catch (error) {
    console.error(`❌ Error testing endorsements: ${error.message}`);
    process.exit(1);
  }
}

function validateAgent(filePath, options = {}) {
  console.log('\n🤖 AGENT CONFORMANCE VALIDATION');
  console.log('==================================================');
  
  testExtensions(filePath, options);
  testEndorsements(filePath, options);
  testTrustScore(filePath, options);
  
  console.log('\n✅ Agent conformance validation complete');
}

function generateSample() {
  const sampleContent = {
    "id": "sample:news-article",
    "title": "Sample News Article for Testing",
    "author": { "name": "Test Author", "id": "author:test" },
    "publisher": { "name": "Test Publisher", "id": "publisher:test" },
    "extensions": [
      { "id": "spp:endorsement-chains", "version": "0.3.0" },
      { "id": "spp:trust-weighting", "version": "0.3.0" }
    ],
    "endorsements": [
      {
        "endorser": {
          "name": "Test Fact Checker",
          "id": "endorser:test-factcheck",
          "uri": "https://test-factcheck.org"
        },
        "verdict": "accurate",
        "confidence": 0.92,
        "date": "2025-01-15T14:30:00Z",
        "trust_weight": 0.85,
        "evidence": ["https://example.org/evidence"]
      }
    ],
    "trust_signals": {
      "source_credibility": 0.8,
      "fact_checked": true,
      "aggregate_trust_score": 0.87
    }
  };
  
  console.log('\n📝 SAMPLE SEMANTIC.JSON FOR TESTING');
  console.log('==================================================');
  console.log(JSON.stringify(sampleContent, null, 2));
  console.log('\n💡 Save this as sample-semantic.json and test with:');
  console.log('   spp-conformance validate-agent sample-semantic.json');
}

// Main CLI logic
const args = process.argv.slice(2);
const command = args[0];
const filePath = args[1];
const options = {
  verbose: args.includes('--verbose'),
  output: args.includes('--output') ? args[args.indexOf('--output') + 1] : 'table'
};

if (!command || args.includes('--help')) {
  printUsage();
  process.exit(0);
}

switch (command) {
  case 'test-trust':
    if (!filePath) {
      console.error('❌ Error: File path required for test-trust command');
      process.exit(1);
    }
    testTrustScore(resolve(filePath), options);
    break;
    
  case 'test-extensions':
    if (!filePath) {
      console.error('❌ Error: File path required for test-extensions command');
      process.exit(1);
    }
    testExtensions(resolve(filePath), options);
    break;
    
  case 'test-endorsements':
    if (!filePath) {
      console.error('❌ Error: File path required for test-endorsements command');
      process.exit(1);
    }
    testEndorsements(resolve(filePath), options);
    break;
    
  case 'validate-agent':
    if (!filePath) {
      console.error('❌ Error: File path required for validate-agent command');
      process.exit(1);
    }
    validateAgent(resolve(filePath), options);
    break;
    
  case 'generate-sample':
    generateSample();
    break;
    
  default:
    console.error(`❌ Unknown command: ${command}`);
    printUsage();
    process.exit(1);
}
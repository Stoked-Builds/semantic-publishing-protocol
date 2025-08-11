#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { validateFile } from '../lib/validator.js';
import yaml from 'js-yaml';

const conformanceDir = path.resolve(process.cwd(), 'conformance');
const planPath = path.join(conformanceDir, 'plans', 'quick-smoke.yaml');

async function runConformanceTest() {
  console.log('🧪 SPP Conformance Smoke Test\n');
  
  if (!fs.existsSync(planPath)) {
    console.error('❌ Test plan not found:', planPath);
    process.exit(1);
  }
  
  const plan = yaml.load(fs.readFileSync(planPath, 'utf8'));
  console.log(`📋 ${plan.name}`);
  
  let passed = 0;
  let failed = 0;
  
  for (const test of plan.tests) {
    console.log(`\n🔍 ${test.name}`);
    
    for (const fixture of test.fixtures) {
      const fixturePath = path.join(conformanceDir, fixture);
      
      if (!fs.existsSync(fixturePath)) {
        console.log(`  ❌ ${path.basename(fixture)}: Fixture not found`);
        failed++;
        continue;
      }
      
      try {
        const result = await validateFile(fixturePath, {
          schemaDir: path.resolve(process.cwd(), 'schemas')
        });
        
        if (result.errors.length === 0) {
          console.log(`  ✅ ${path.basename(fixture)}: Valid`);
          passed++;
        } else {
          console.log(`  ❌ ${path.basename(fixture)}: ${result.errors.length} errors`);
          failed++;
        }
      } catch (error) {
        console.log(`  ❌ ${path.basename(fixture)}: ${error.message}`);
        failed++;
      }
    }
  }
  
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  
  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 All conformance tests passed!');
  }
}

runConformanceTest().catch(console.error);
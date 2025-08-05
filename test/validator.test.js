import { test } from 'node:test';
import { strictEqual, ok } from 'node:assert';
import { validateFile } from '../lib/validator.js';
import fs from 'fs';
import path from 'path';

const testDataDir = '/tmp/spp-test-data';

// Setup test data
if (!fs.existsSync(testDataDir)) {
  fs.mkdirSync(testDataDir, { recursive: true });
}

// Valid semantic.json
const validSemantic = {
  "id": "test:valid",
  "title": "Test Content",
  "author": { "name": "Test Author" }
};
fs.writeFileSync(path.join(testDataDir, 'valid.json'), JSON.stringify(validSemantic, null, 2));

// Invalid semantic.json
const invalidSemantic = {
  "id": "test:invalid",
  "title": "Test Content",
  "invalidField": "should not be here"
};
fs.writeFileSync(path.join(testDataDir, 'invalid.json'), JSON.stringify(invalidSemantic, null, 2));

// Valid SPS markdown
const validSpsMarkdown = `---
id: "test:sps"
title: "Test SPS"
author:
  name: "Test Author"
---

# Test Content`;
fs.writeFileSync(path.join(testDataDir, 'valid.sps.md'), validSpsMarkdown);

// Markdown with semantic blocks
const blocksMarkdown = `# Test

<!-- sb:block type="summary" -->
Test summary
<!-- /sb:block -->

<!-- sb:block type="quote" source="Test" -->
Test quote
<!-- /sb:block -->`;
fs.writeFileSync(path.join(testDataDir, 'blocks.md'), blocksMarkdown);

test('validateFile should validate valid JSON semantic file', async () => {
  const result = await validateFile(path.join(testDataDir, 'valid.json'), {
    schemaDir: path.resolve(process.cwd(), 'schema')
  });
  
  strictEqual(result.errors.length, 0, 'Should have no errors');
  strictEqual(result.fileType, 'JSON');
});

test('validateFile should catch invalid JSON semantic file', async () => {
  const result = await validateFile(path.join(testDataDir, 'invalid.json'), {
    schemaDir: path.resolve(process.cwd(), 'schema')
  });
  
  ok(result.errors.length > 0, 'Should have errors');
  strictEqual(result.fileType, 'JSON');
});

test('validateFile should validate SPS markdown', async () => {
  const result = await validateFile(path.join(testDataDir, 'valid.sps.md'), {
    schemaDir: path.resolve(process.cwd(), 'schema')
  });
  
  strictEqual(result.errors.length, 0, 'Should have no errors');
  strictEqual(result.fileType, 'SPS Markdown');
});

test('validateFile should parse semantic blocks', async () => {
  const result = await validateFile(path.join(testDataDir, 'blocks.md'), {
    schemaDir: path.resolve(process.cwd(), 'schema')
  });
  
  strictEqual(result.fileType, 'Markdown with semantic blocks');
  strictEqual(result.errors.length, 0, 'Should have no errors for valid blocks');
});

test('validateFile should skip schema validation in extensions-only mode', async () => {
  const result = await validateFile(path.join(testDataDir, 'invalid.json'), {
    schemaDir: path.resolve(process.cwd(), 'schema'),
    extensionsOnly: true
  });
  
  strictEqual(result.errors.length, 0, 'Should skip schema validation');
});
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

const baseSemantic = (overrides = {}) => ({
  "id": "test:base",
  "type": "article",
  "title": "Test Content",
  "summary": "Validator test payload",
  "spec_version": "0.4.0",
  "language": "en",
  "authors": [
    { "name": "Test Author", "url": "https://example.com/authors/test" }
  ],
  "content": {
    "format": "markdown",
    "value": "Validator test content body."
  },
  "links": [
    { "rel": "canonical", "href": "https://example.com/tests/validator" }
  ],
  "provenance": {
    "mode": "authoritative",
    "content_hash": `sha256:${'a'.repeat(64)}`,
    "registry_id": "registry.test",
    "adapter_id": "validator.test/1.0.0",
    "collected_at": "2025-01-15T12:00:00Z"
  },
  "signatures": [
    {
      "signer": "registry.test",
      "key_id": "validator-test-key",
      "sig": "YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4",
      "signedAt": "2025-01-15T12:01:00Z"
    }
  ],
  "version": 1,
  ...overrides
});

// Valid semantic.json
const validSemantic = baseSemantic({
  "id": "test:valid"
});
fs.writeFileSync(path.join(testDataDir, 'valid.json'), JSON.stringify(validSemantic, null, 2));

// Invalid semantic.json
const invalidSemantic = {
  ...baseSemantic({ "id": "test:invalid" }),
  "invalidField": "should not be here"
};
fs.writeFileSync(path.join(testDataDir, 'invalid.json'), JSON.stringify(invalidSemantic, null, 2));

// Valid SPS markdown
const validSpsMarkdown = `---
id: "test:sps"
type: "article"
title: "Test SPS"
summary: "Validator SPS markdown example"
spec_version: "0.4.0"
language: "en"
authors:
  - name: "Test Author"
    url: "https://example.com/authors/test"
content:
  format: "markdown"
  value: "Validator test content body."
links:
  - rel: "canonical"
    href: "https://example.com/tests/sps-markdown"
provenance:
  mode: "authoritative"
  content_hash: "sha256:${'b'.repeat(64)}"
  registry_id: "registry.test"
  adapter_id: "validator.test/1.0.0"
  collected_at: "2025-01-15T12:00:00Z"
signatures:
  - signer: "registry.test"
    key_id: "validator-test-key"
    sig: "YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4"
    signedAt: "2025-01-15T12:01:00Z"
version: 1
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
    schemaDir: path.resolve(process.cwd(), 'schemas')
  });
  
  strictEqual(result.errors.length, 0, 'Should have no errors');
  strictEqual(result.fileType, 'JSON');
});

test('validateFile should catch invalid JSON semantic file', async () => {
  const result = await validateFile(path.join(testDataDir, 'invalid.json'), {
    schemaDir: path.resolve(process.cwd(), 'schemas')
  });
  
  ok(result.errors.length > 0, 'Should have errors');
  strictEqual(result.fileType, 'JSON');
});

test('validateFile should validate SPS markdown', async () => {
  const result = await validateFile(path.join(testDataDir, 'valid.sps.md'), {
    schemaDir: path.resolve(process.cwd(), 'schemas')
  });
  
  strictEqual(result.errors.length, 0, 'Should have no errors');
  strictEqual(result.fileType, 'SPS Markdown');
});

test('validateFile should parse semantic blocks', async () => {
  const result = await validateFile(path.join(testDataDir, 'blocks.md'), {
    schemaDir: path.resolve(process.cwd(), 'schemas')
  });
  
  strictEqual(result.fileType, 'Markdown with semantic blocks');
  strictEqual(result.errors.length, 0, 'Should have no errors for valid blocks');
});

test('validateFile should skip schema validation in extensions-only mode', async () => {
  const result = await validateFile(path.join(testDataDir, 'invalid.json'), {
    schemaDir: path.resolve(process.cwd(), 'schemas'),
    extensionsOnly: true
  });
  
  strictEqual(result.errors.length, 0, 'Should skip schema validation');
});

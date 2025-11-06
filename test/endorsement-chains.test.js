import { test } from 'node:test';
import { strictEqual, ok } from 'node:assert';
import { validateFile } from '../lib/validator.js';
import fs from 'fs';
import path from 'path';

const testDataDir = '/tmp/spp-endorsement-test-data';

// Setup test data
if (!fs.existsSync(testDataDir)) {
  fs.mkdirSync(testDataDir, { recursive: true });
}

const baseSemantic = (overrides = {}) => ({
  "id": "test:base-endorsement",
  "type": "article",
  "title": "Test Endorsement Payload",
  "summary": "Endorsement test payload",
  "spec_version": "0.4.0",
  "language": "en",
  "authors": [
    { "name": "Test Author", "url": "https://example.com/authors/test" }
  ],
  "content": {
    "format": "markdown",
    "value": "Test endorsement content."
  },
  "links": [
    { "rel": "canonical", "href": "https://example.com/tests/endorsement" }
  ],
  "provenance": {
    "mode": "authoritative",
    "content_hash": `sha256:${'c'.repeat(64)}`,
    "registry_id": "registry.test",
    "adapter_id": "endorsement.tests/1.0.0",
    "collected_at": "2025-01-15T12:00:00Z"
  },
  "signatures": [
    {
      "signer": "registry.test",
      "key_id": "endorsement-test-key",
      "sig": "YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4",
      "signedAt": "2025-01-15T12:01:00Z"
    }
  ],
  "version": 1,
  ...overrides
});

// Valid endorsement with basic content endorsement
const validEndorsement = baseSemantic({
  "id": "test:endorsement-valid",
  "title": "Test Content with Endorsement",
  "extensions": {
    "spp:endorsement-chains": { "version": "0.3.0" }
  },
  "endorsements": [
    {
      "artifact_hash": `sha256:${'a'.repeat(64)}`,
      "endorser_id": "endorser.example.com",
      "observed_at": "2025-01-15T14:30:00Z",
      "sig": "c3RydWN0dXJlZC1leGFtcGxlLXNpZ25hdHVyZQ"
    }
  ]
});
fs.writeFileSync(path.join(testDataDir, 'valid-endorsement.json'), JSON.stringify(validEndorsement, null, 2));

// Valid endorsement with delegation chain
const validDelegation = baseSemantic({
  "id": "test:delegation-valid",
  "title": "Test Content with Delegated Endorsement",
  "extensions": {
    "spp:endorsement-chains": {
      "version": "0.3.0",
      "delegations": [
        {
          "delegator_id": "supervisor.institution.edu",
          "delegation_signature": "c3VwZXJ2aXNvci1zaWduYXR1cmU",
          "delegation_scope": "research_endorsement",
          "delegation_expires": "2025-12-31T23:59:59Z"
        }
      ]
    }
  },
  "endorsements": [
    {
      "artifact_hash": `sha256:${'b'.repeat(64)}`,
      "endorser_id": "assistant.institution.edu",
      "observed_at": "2025-01-15T16:00:00Z",
      "sig": "ZGVsZWdhdGVkLXNpZ25hdHVyZS1leGFtcGxl"
    }
  ]
});
fs.writeFileSync(path.join(testDataDir, 'valid-delegation.json'), JSON.stringify(validDelegation, null, 2));

// Invalid endorsement - missing required fields
const invalidEndorsement = baseSemantic({
  "id": "test:endorsement-invalid",
  "title": "Test Content with Invalid Endorsement",
  "extensions": {
    "spp:endorsement-chains": { "version": "0.3.0" }
  },
  "endorsements": [
    {
      "artifact_hash": `sha256:${'c'.repeat(64)}`,
      "observed_at": "2025-01-15T14:30:00Z"
      // Missing required endorser_id and sig fields
    }
  ]
});
fs.writeFileSync(path.join(testDataDir, 'invalid-endorsement.json'), JSON.stringify(invalidEndorsement, null, 2));

test('validateFile should validate content with basic endorsement', async () => {
  const result = await validateFile(path.join(testDataDir, 'valid-endorsement.json'));
  strictEqual(result.errors.length, 0, 'Basic endorsement should have no validation errors');
  ok(Array.isArray(result.errors), 'Should return errors array');
});

test('validateFile should validate content with delegation chain', async () => {
  const result = await validateFile(path.join(testDataDir, 'valid-delegation.json'));
  strictEqual(result.errors.length, 0, 'Delegated endorsement should have no validation errors');
  ok(Array.isArray(result.errors), 'Should return errors array');
});

test('validateFile should catch invalid endorsement', async () => {
  const result = await validateFile(path.join(testDataDir, 'invalid-endorsement.json'));
  ok(result.errors.length > 0, 'Invalid endorsement should have validation errors');
  ok(Array.isArray(result.errors), 'Should return errors array');
});

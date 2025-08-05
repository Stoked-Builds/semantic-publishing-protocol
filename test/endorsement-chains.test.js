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

// Valid endorsement with basic content endorsement
const validEndorsement = {
  "id": "test:endorsement-valid",
  "title": "Test Content with Endorsement",
  "author": { "name": "Test Author" },
  "extensions": [
    {
      "id": "spp:endorsement-chains",
      "version": "0.3.0"
    }
  ],
  "endorsements": [
    {
      "endorser_did": "did:web:example.com:expert",
      "endorser_name": "Dr. Test Expert",
      "timestamp": "2025-01-15T14:30:00Z",
      "signature": "zQmF3ysuHnLmKxn2dKbmF2mLrZjYrJYFBrKqD4ZGwh9JFvW2E",
      "comment": "This content is scientifically accurate.",
      "endorsement_type": "content",
      "signature_algorithm": "ed25519",
      "delegation_chain": []
    }
  ]
};
fs.writeFileSync(path.join(testDataDir, 'valid-endorsement.json'), JSON.stringify(validEndorsement, null, 2));

// Valid endorsement with delegation chain
const validDelegation = {
  "id": "test:delegation-valid",
  "title": "Test Content with Delegated Endorsement",
  "author": { "name": "Test Author" },
  "extensions": [
    {
      "id": "spp:endorsement-chains",
      "version": "0.3.0"
    }
  ],
  "endorsements": [
    {
      "endorser_did": "did:web:institution.edu:assistant:ai-01",
      "endorser_name": "AI Research Assistant",
      "timestamp": "2025-01-15T16:00:00Z",
      "signature": "zQmK4xtuJnPmKyn3eKcnF3nLsAkYsJzY2JYFCsLrE5ZHxi9JGwW3F",
      "comment": "Endorsed on behalf of supervising researcher.",
      "endorsement_type": "delegated",
      "signature_algorithm": "ed25519",
      "delegation_chain": [
        {
          "delegator_did": "did:web:institution.edu:supervisor",
          "delegator_name": "Prof. Test Supervisor",
          "delegation_signature": "zQmA1wriHmLkNxm2dKbmF2mLrZjYrJYFBrKqD4ZGwh9JFvW2E",
          "delegation_timestamp": "2025-01-01T00:00:00Z",
          "delegation_scope": "research_endorsement",
          "delegation_expires": "2025-12-31T23:59:59Z"
        }
      ]
    }
  ]
};
fs.writeFileSync(path.join(testDataDir, 'valid-delegation.json'), JSON.stringify(validDelegation, null, 2));

// Invalid endorsement - missing required fields
const invalidEndorsement = {
  "id": "test:endorsement-invalid",
  "title": "Test Content with Invalid Endorsement",
  "author": { "name": "Test Author" },
  "extensions": [
    {
      "id": "spp:endorsement-chains",
      "version": "0.3.0"
    }
  ],
  "endorsements": [
    {
      "endorser_did": "did:web:example.com:expert",
      "timestamp": "2025-01-15T14:30:00Z",
      // Missing required signature field
      "endorsement_type": "content",
      "signature_algorithm": "ed25519"
    }
  ]
};
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
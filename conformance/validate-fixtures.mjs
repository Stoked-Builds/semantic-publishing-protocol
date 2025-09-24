#!/usr/bin/env node
/**
 * Schema conformance validator for registry fixtures.
 *
 * Usage: node conformance/validate-fixtures.mjs
 *
 * Validates all JSON files under:
 *   - conformance/fixtures/            => expected to PASS schema validation
 *   - conformance/fixtures/invalid/    => expected to FAIL schema validation
 *
 * Exits non‑zero if any expectation is not met.
 */

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import process from 'node:process';

// Ajv (JSON Schema 2020-12)
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const schemasDir = path.join(repoRoot, 'schemas');
const fixturesDir = path.join(repoRoot, 'conformance', 'fixtures');
const invalidDir = path.join(fixturesDir, 'invalid');

const SEMANTIC_ID = 'https://spp.dev/schemas/semantic.json';
const ARTEIACT_ALIAS_ID = 'https://spp.dev/schemas/artifact.json';

/**
 * Utility: read all .json files recursively under a directory.
 */
function listJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.isFile() && entry.name.toLowerCase().endsWith('.json')) out.push(full);
    }
  }
  return out.sort();
}

/**
 * Load all schemas under /schemas into Ajv (supports $id and cross-refs).
 */
function loadSchemas(ajv, dir) {
  const files = listJsonFiles(dir);
  for (const file of files) {
    // Skip known non-schema paths (e.g., examples placed under /schemas/examples)
    if (file.includes(`${path.sep}examples${path.sep}`)) {
      console.warn(`↷ Skipping non-schema file in examples: ${path.relative(repoRoot, file)}`);
      continue;
    }
    try {
      const raw = fs.readFileSync(file, 'utf8');
      const schema = JSON.parse(raw);

      // Heuristic: only load if this looks like a JSON Schema
      const isSchema = typeof schema === 'object' && schema !== null && typeof schema.$schema === 'string' && schema.$schema.includes('json-schema');
      if (!isSchema) {
        console.warn(`↷ Skipping non-schema JSON: ${path.relative(repoRoot, file)}`);
        continue;
      }

      // Use $id if present, otherwise use a file:// URL as a unique key to avoid Ajv id collisions
      const key = typeof schema.$id === 'string' && schema.$id.trim() !== ''
        ? schema.$id
        : `file://${file}`;

      ajv.addSchema(schema, key);
    } catch (e) {
      console.error(`❌ Failed to load schema ${file}:`, e.message);
      process.exit(1);
    }
  }
}

/**
 * Decide which top-level schema to validate against from the fixture shape.
 * Returns an object with { schemaKey, resolve } where schemaKey is a $id or path
 * known to Ajv and resolve returns the actual data to validate.
 */
function selectSchemaForFixture(obj, filePath) {
  // --- Artifacts ---
  // MVSL wrapper shape: { artifact: { ... } } → validate the inner object against semantic.json
  if (obj && typeof obj === 'object' && obj.artifact && typeof obj.artifact === 'object') {
    return { schemaKey: SEMANTIC_ID, resolve: (o) => o.artifact };
  }
  // Legacy flat shape (current semantic.json): look for protocolVersion/title/author
  if (obj && typeof obj === 'object' && (obj.protocolVersion || obj.title || obj.author)) {
    return { schemaKey: SEMANTIC_ID, resolve: (o) => o };
  }

  // --- Ownership (wrapper or flat) ---
  if (obj && typeof obj === 'object' && (obj.ownership || obj.artefact_hash)) {
    return { schemaKey: 'https://spp.dev/schemas/ownership.json', resolve: (o) => (o.ownership ? o : { ownership: o }) };
  }

  // --- Claim ---
  if (obj && typeof obj === 'object' && (obj.nonce && obj.namespace)) {
    return { schemaKey: 'https://spp.dev/schemas/claim.json', resolve: (o) => o };
  }

  // --- Adoption ---
  if (obj && typeof obj === 'object' && (obj.artefact_hashes || obj.manifest_url)) {
    return { schemaKey: 'https://spp.dev/schemas/adoption.json', resolve: (o) => o };
  }

  // --- Transparency STH ---
  if (obj && typeof obj === 'object' && (Object.prototype.hasOwnProperty.call(obj, 'tree_size') && Object.prototype.hasOwnProperty.call(obj, 'root_hash'))) {
    return { schemaKey: 'https://spp.dev/schemas/transparency-sth.json', resolve: (o) => o };
  }

  // --- Filename fallbacks for invalid fixtures ---
  const lower = filePath.toLowerCase();
  if (lower.includes('artefact') || lower.includes('semantic')) {
    return { schemaKey: SEMANTIC_ID, resolve: (o) => (o.artefact ?? o) };
  }
  if (lower.includes('ownership')) {
    return { schemaKey: 'https://spp.dev/schemas/ownership.json', resolve: (o) => (o.ownership ? o : { ownership: o }) };
  }
  if (lower.includes('claim')) {
    return { schemaKey: 'https://spp.dev/schemas/claim.json', resolve: (o) => o };
  }
  if (lower.includes('adoption')) {
    return { schemaKey: 'https://spp.dev/schemas/adoption.json', resolve: (o) => o };
  }
  if (lower.includes('sth') || lower.includes('transparency')) {
    return { schemaKey: 'https://spp.dev/schemas/transparency-sth.json', resolve: (o) => o };
  }

  return null;
}

function formatErrors(errors) {
  if (!errors) return '';
  return errors.map(e => {
    const inst = e.instancePath || e.instancePath === '' ? e.instancePath : '';
    const msg = e.message || 'invalid';
    return ` • ${inst} ${msg}`;
  }).join('\n');
}

async function main() {
  const ajv = new Ajv2020({ strict: false, allErrors: true });
  addFormats(ajv);

  loadSchemas(ajv, schemasDir);

  if (ajv.getSchema(ARTEFACT_ALIAS_ID)) {
    console.warn('⚠️  Deprecation: artefact.json is loaded as an alias. Prefer semantic.json. Alias will be removed in a future minor release.');
  }

  const validFiles = listJsonFiles(fixturesDir).filter(f => !f.includes(`${path.sep}invalid${path.sep}`));
  const invalidFiles = listJsonFiles(invalidDir);

  let ok = true;

  // Validate valid fixtures (expect PASS)
  for (const file of validFiles) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const sel = selectSchemaForFixture(data, file);
    if (!sel) {
      console.warn(`⚠️  Skipping (no schema selector): ${path.relative(repoRoot, file)}`);
      continue;
    }
    const validate = ajv.getSchema(sel.schemaKey);
    if (!validate) {
      console.warn(`⚠️  Missing schema in loader for ${sel.schemaKey} — skipping ${path.relative(repoRoot, file)}`);
      continue;
    }
    const instance = sel.resolve(data);
    const pass = validate(instance);
    if (!pass) {
      ok = false;
      console.error(`❌ Expected VALID but failed: ${path.relative(repoRoot, file)}\n${formatErrors(validate.errors)}`);
      console.error(JSON.stringify(validate.errors, null, 2));
    } else {
      console.log(`✅ Valid: ${path.relative(repoRoot, file)}`);
    }
  }

  // Validate invalid fixtures (expect FAIL)
  for (const file of invalidFiles) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const sel = selectSchemaForFixture(data, file);
    if (!sel) {
      console.warn(`⚠️  Skipping (no schema selector): ${path.relative(repoRoot, file)}`);
      continue;
    }
    const validate = ajv.getSchema(sel.schemaKey);
    if (!validate) {
      console.warn(`⚠️  Missing schema in loader for ${sel.schemaKey} — skipping ${path.relative(repoRoot, file)}`);
      continue;
    }
    const instance = sel.resolve(data);
    const pass = validate(instance);
    if (pass) {
      ok = false;
      console.error(`❌ Expected INVALID but passed: ${path.relative(repoRoot, file)}`);
      console.error('Instance that unexpectedly passed:', JSON.stringify(instance, null, 2));
    } else {
      console.log(`✅ Invalid (as expected): ${path.relative(repoRoot, file)}`);
    }
  }

  if (!ok) {
    console.error('\n❌ Fixture validation failed. See errors above.');
    process.exit(1);
  } else {
    console.log('\n✅ All fixtures match expected validity.');
  }
}

main().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
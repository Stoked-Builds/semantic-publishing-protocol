import { test } from 'node:test';
import { strictEqual, ok, notStrictEqual } from 'node:assert';
import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const schemaDir = path.resolve(process.cwd(), 'schemas');
const examplesDir = path.resolve(process.cwd(), 'examples');

/**
 * Creates an AJV instance configured for schema validation
 */
function createValidator() {
  const ajv = new Ajv({
    strict: false,
    allErrors: true,
    validateSchema: false  // Disable schema validation to avoid 2020-12 issues
  });
  addFormats(ajv);
  return ajv;
}

/**
 * Loads and compiles a JSON schema
 */
function loadSchema(schemaPath) {
  const schemaContent = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  const ajv = createValidator();
  return ajv.compile(schemaContent);
}

/**
 * Finds all files matching a pattern recursively
 */
function findFiles(dir, pattern) {
  const files = [];
  
  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.name === pattern) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Test meta.schema.json with valid JSON-LD data
test('meta.schema.json should validate correct JSON-LD meta files', () => {
  const metaSchemaPath = path.join(schemaDir, 'meta.schema.json');
  const validateMeta = loadSchema(metaSchemaPath);
  
  const validMeta = {
    "@context": "https://schema.org",
    "@type": "Article",
    "name": "Test Article",
    "datePublished": "2024-01-01T00:00:00Z",
    "protocolVersion": "1.0.0",
    "author": {
      "@type": "Person",
      "name": "Test Author"
    }
  };
  
  const valid = validateMeta(validMeta);
  strictEqual(valid, true, 'Valid meta.jsonld should pass validation');
});

// Test site-config.schema.json with valid data
test('site-config.schema.json should validate correct site configuration', () => {
  const siteConfigSchemaPath = path.join(schemaDir, 'site-config.schema.json');
  const validateSiteConfig = loadSchema(siteConfigSchemaPath);
  
  const validSiteConfig = {
    "protocolVersion": "1.0.0",
    "siteMetadata": {
      "name": "Test Site",
      "url": "https://test.example",
      "description": "A test site"
    }
  };
  
  const valid = validateSiteConfig(validSiteConfig);
  strictEqual(valid, true, 'Valid site config should pass validation');
});

// Test pub.schema.json with valid publication data
test('pub.schema.json should validate correct publication data', () => {
  const pubSchemaPath = path.join(schemaDir, 'pub.schema.json');
  const validatePub = loadSchema(pubSchemaPath);
  
  const validPub = {
    "id": "test-pub",
    "title": "Test Publication",
    "contentType": "article",
    "datePublished": "2024-01-01T00:00:00Z",
    "protocolVersion": "1.0.0",
    "author": {
      "name": "Test Author"
    }
  };
  
  const valid = validatePub(validPub);
  strictEqual(valid, true, 'Valid publication should pass validation');
});

// Test that existing example files exist (basic structure test)
test('Example files should exist in expected locations', () => {
  const metaFiles = findFiles(examplesDir, 'meta.jsonld');
  const siteConfigFiles = findFiles(examplesDir, 'site.config.json');
  
  ok(metaFiles.length > 0, 'Should find at least one meta.jsonld file');
  ok(siteConfigFiles.length > 0, 'Should find at least one site.config.json file');
  
  // Verify files are valid JSON
  for (const filePath of metaFiles) {
    try {
      JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
      throw new Error(`Invalid JSON in ${filePath}: ${error.message}`);
    }
  }
  
  for (const filePath of siteConfigFiles) {
    try {
      JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
      throw new Error(`Invalid JSON in ${filePath}: ${error.message}`);
    }
  }
});

// Test failure cases for meta.jsonld
test('Invalid meta.jsonld should fail validation - missing required fields', () => {
  const metaSchemaPath = path.join(schemaDir, 'meta.schema.json');
  const validateMeta = loadSchema(metaSchemaPath);
  
  // Test case: missing @context
  const invalidMeta1 = {
    "@type": "Article",
    "name": "Test Article",
    "datePublished": "2024-01-01T00:00:00Z",
    "protocolVersion": "1.0.0"
  };
  
  const valid1 = validateMeta(invalidMeta1);
  strictEqual(valid1, false, 'Should fail validation when @context is missing');
  ok(validateMeta.errors.length > 0, 'Should have validation errors');
  
  // Test case: missing protocolVersion
  const invalidMeta2 = {
    "@context": "https://schema.org",
    "@type": "Article", 
    "name": "Test Article",
    "datePublished": "2024-01-01T00:00:00Z"
  };
  
  const valid2 = validateMeta(invalidMeta2);
  strictEqual(valid2, false, 'Should fail validation when protocolVersion is missing');
  
  // Test case: missing name
  const invalidMeta3 = {
    "@context": "https://schema.org",
    "@type": "Article",
    "datePublished": "2024-01-01T00:00:00Z",
    "protocolVersion": "1.0.0"
  };
  
  const valid3 = validateMeta(invalidMeta3);
  strictEqual(valid3, false, 'Should fail validation when name is missing');
});

// Test failure cases for meta.jsonld - wrong data types
test('Invalid meta.jsonld should fail validation - wrong data types', () => {
  const metaSchemaPath = path.join(schemaDir, 'meta.schema.json');
  const validateMeta = loadSchema(metaSchemaPath);
  
  // Test case: invalid date format
  const invalidMeta1 = {
    "@context": "https://schema.org",
    "@type": "Article",
    "name": "Test Article",
    "datePublished": "not-a-date",
    "protocolVersion": "1.0.0"
  };
  
  const valid1 = validateMeta(invalidMeta1);
  strictEqual(valid1, false, 'Should fail validation with invalid date format');
  
  // Test case: invalid protocol version format
  const invalidMeta2 = {
    "@context": "https://schema.org",
    "@type": "Article",
    "name": "Test Article", 
    "datePublished": "2024-01-01T00:00:00Z",
    "protocolVersion": "not-a-version"
  };
  
  const valid2 = validateMeta(invalidMeta2);
  strictEqual(valid2, false, 'Should fail validation with invalid protocol version format');
  
  // Test case: empty name
  const invalidMeta3 = {
    "@context": "https://schema.org",
    "@type": "Article",
    "name": "",
    "datePublished": "2024-01-01T00:00:00Z",
    "protocolVersion": "1.0.0"
  };
  
  const valid3 = validateMeta(invalidMeta3);
  strictEqual(valid3, false, 'Should fail validation with empty name');
});

// Test failure cases for site.config.json
test('Invalid site.config.json should fail validation - missing required fields', () => {
  const siteConfigSchemaPath = path.join(schemaDir, 'site-config.schema.json');
  const validateSiteConfig = loadSchema(siteConfigSchemaPath);
  
  // Test case: missing protocolVersion
  const invalidConfig1 = {
    "siteMetadata": {
      "name": "Test Site",
      "url": "https://test.example"
    }
  };
  
  const valid1 = validateSiteConfig(invalidConfig1);
  strictEqual(valid1, false, 'Should fail validation when protocolVersion is missing');
  
  // Test case: missing siteMetadata
  const invalidConfig2 = {
    "protocolVersion": "1.0.0"
  };
  
  const valid2 = validateSiteConfig(invalidConfig2);
  strictEqual(valid2, false, 'Should fail validation when siteMetadata is missing');
  
  // Test case: missing required siteMetadata fields
  const invalidConfig3 = {
    "protocolVersion": "1.0.0",
    "siteMetadata": {
      "name": "Test Site"
      // missing url
    }
  };
  
  const valid3 = validateSiteConfig(invalidConfig3);
  strictEqual(valid3, false, 'Should fail validation when siteMetadata.url is missing');
});

// Test failure cases for site.config.json - wrong data types
test('Invalid site.config.json should fail validation - wrong data types', () => {
  const siteConfigSchemaPath = path.join(schemaDir, 'site-config.schema.json');
  const validateSiteConfig = loadSchema(siteConfigSchemaPath);
  
  // Test case: invalid URL format
  const invalidConfig1 = {
    "protocolVersion": "1.0.0",
    "siteMetadata": {
      "name": "Test Site",
      "url": "not-a-url"
    }
  };
  
  const valid1 = validateSiteConfig(invalidConfig1);
  strictEqual(valid1, false, 'Should fail validation with invalid URL format');
  
  // Test case: invalid protocol version format
  const invalidConfig2 = {
    "protocolVersion": "invalid-version",
    "siteMetadata": {
      "name": "Test Site",
      "url": "https://test.example"
    }
  };
  
  const valid2 = validateSiteConfig(invalidConfig2);
  strictEqual(valid2, false, 'Should fail validation with invalid protocol version format');
  
  // Test case: empty name
  const invalidConfig3 = {
    "protocolVersion": "1.0.0",
    "siteMetadata": {
      "name": "",
      "url": "https://test.example"
    }
  };
  
  const valid3 = validateSiteConfig(invalidConfig3);
  strictEqual(valid3, false, 'Should fail validation with empty name');
});

// Test failure cases for pub.schema.json
test('Invalid publication should fail validation - missing required fields', () => {
  const pubSchemaPath = path.join(schemaDir, 'pub.schema.json');
  const validatePub = loadSchema(pubSchemaPath);
  
  // Test case: missing contentType
  const invalidPub1 = {
    "id": "test-pub",
    "title": "Test Publication",
    "datePublished": "2024-01-01T00:00:00Z",
    "protocolVersion": "1.0.0"
  };
  
  const valid1 = validatePub(invalidPub1);
  strictEqual(valid1, false, 'Should fail validation when contentType is missing');
  
  // Test case: missing title
  const invalidPub2 = {
    "id": "test-pub",
    "contentType": "article",
    "datePublished": "2024-01-01T00:00:00Z",
    "protocolVersion": "1.0.0"
  };
  
  const valid2 = validatePub(invalidPub2);
  strictEqual(valid2, false, 'Should fail validation when title is missing');
});

// Test that validation produces clear error messages
test('Schema validation should produce clear error messages', () => {
  const metaSchemaPath = path.join(schemaDir, 'meta.schema.json');
  const validateMeta = loadSchema(metaSchemaPath);
  
  const invalidMeta = {
    "@context": "https://schema.org",
    "@type": "Article",
    "name": "Test Article",
    "datePublished": "invalid-date",
    "protocolVersion": "1.0.0"
  };
  
  const valid = validateMeta(invalidMeta);
  strictEqual(valid, false, 'Should fail validation');
  
  ok(validateMeta.errors.length > 0, 'Should have validation errors');
  
  // Check that error messages are meaningful
  const errorMessages = validateMeta.errors.map(err => err.message);
  ok(errorMessages.some(msg => msg.includes('format') || msg.includes('date')), 
     'Should have clear error message about date format');
});

// Test schema integrity - ensure schemas themselves are valid
test('Schema files should be valid JSON and loadable', () => {
  const schemaFiles = [
    'meta.schema.json',
    'site-config.schema.json', 
    'pub.schema.json'
  ];
  
  for (const schemaFile of schemaFiles) {
    const schemaPath = path.join(schemaDir, schemaFile);
    
    // Check file exists
    ok(fs.existsSync(schemaPath), `Schema file ${schemaFile} should exist`);
    
    // Check it's valid JSON
    let schemaContent;
    try {
      schemaContent = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    } catch (error) {
      throw new Error(`Schema file ${schemaFile} is not valid JSON: ${error.message}`);
    }
    
    // Check it has basic schema properties
    ok(schemaContent.type, `Schema ${schemaFile} should have a type property`);
    ok(schemaContent.properties, `Schema ${schemaFile} should have properties`);
    
    // Check it can be compiled by AJV
    try {
      loadSchema(schemaPath);
    } catch (error) {
      throw new Error(`Schema file ${schemaFile} cannot be compiled: ${error.message}`);
    }
  }
});
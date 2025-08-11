#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * CLI tool to validate drop metadata files against their JSON Schemas using AJV
 */

// Initialize AJV with formats support and meta-schema
const ajv = new Ajv({ 
  allErrors: true, 
  verbose: true,
  strict: false // Allow additional properties and unknown formats
});
addFormats(ajv);

// Add JSON Schema Draft 2020-12 meta-schema
ajv.addMetaSchema(
  {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://json-schema.org/draft/2020-12/schema"
  },
  "https://json-schema.org/draft/2020-12/schema"
);

// Load schemas
const SCHEMAS_DIR = path.resolve(__dirname, '../schemas');
const SITE_CONFIG_SCHEMA_PATH = path.join(SCHEMAS_DIR, 'site-config.schema.json');
const META_SCHEMA_PATH = path.join(SCHEMAS_DIR, 'meta.schema.json');

let siteConfigValidator, metaValidator;

/**
 * Load and compile schemas
 */
function loadSchemas() {
  try {
    const siteConfigSchema = JSON.parse(fs.readFileSync(SITE_CONFIG_SCHEMA_PATH, 'utf8'));
    const metaSchema = JSON.parse(fs.readFileSync(META_SCHEMA_PATH, 'utf8'));
    
    siteConfigValidator = ajv.compile(siteConfigSchema);
    metaValidator = ajv.compile(metaSchema);
    
    return true;
  } catch (error) {
    console.error(`❌ Error loading schemas: ${error.message}`);
    return false;
  }
}

/**
 * Validate a single file
 */
function validateFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    let validator;
    let schemaType;
    
    // Determine which schema to use based on file path/name
    if (filePath.includes('site.config.json')) {
      validator = siteConfigValidator;
      schemaType = 'site-config';
    } else if (filePath.includes('meta.jsonld')) {
      validator = metaValidator;
      schemaType = 'meta';
    } else {
      return {
        filePath,
        valid: false,
        errors: [`Unknown file type for validation: ${path.basename(filePath)}`]
      };
    }
    
    const valid = validator(data);
    
    if (valid) {
      return {
        filePath,
        valid: true,
        errors: []
      };
    } else {
      const errors = validator.errors.map(error => {
        const dataPath = error.instancePath || 'root';
        const keyword = error.keyword;
        const message = error.message;
        const schemaPath = error.schemaPath;
        
        return `Schema keyword: ${keyword}, Data path: ${dataPath}, Message: ${message}`;
      });
      
      return {
        filePath,
        valid: false,
        errors,
        schemaType
      };
    }
  } catch (error) {
    return {
      filePath,
      valid: false,
      errors: [`File processing error: ${error.message}`]
    };
  }
}

/**
 * Get default files to validate
 */
async function getDefaultFiles() {
  const files = [];
  
  // Find all site.config.json files
  try {
    const siteConfigFiles = await glob('**/site.config.json', { 
      cwd: process.cwd(),
      ignore: ['node_modules/**', '.git/**']
    });
    files.push(...siteConfigFiles);
  } catch (error) {
    console.warn(`Warning: Error finding site.config.json files: ${error.message}`);
  }
  
  // Find all meta.jsonld files in pubs/**/
  try {
    const metaFiles = await glob('pubs/**/meta.jsonld', { 
      cwd: process.cwd(),
      ignore: ['node_modules/**', '.git/**']
    });
    files.push(...metaFiles);
  } catch (error) {
    console.warn(`Warning: Error finding meta.jsonld files: ${error.message}`);
  }
  
  return files.map(f => path.resolve(f));
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  
  // Load schemas first
  if (!loadSchemas()) {
    process.exit(1);
  }
  
  let filesToValidate = [];
  
  if (args.length > 0) {
    // Use provided file paths
    filesToValidate = args.map(arg => path.resolve(arg));
  } else {
    // Use default files
    filesToValidate = await getDefaultFiles();
  }
  
  if (filesToValidate.length === 0) {
    console.log('No files found to validate.');
    process.exit(0);
  }
  
  let hasFailures = false;
  const results = [];
  
  // Validate each file
  for (const filePath of filesToValidate) {
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      hasFailures = true;
      continue;
    }
    
    const result = validateFile(filePath);
    results.push(result);
    
    if (!result.valid) {
      hasFailures = true;
    }
  }
  
  // Print results
  if (hasFailures) {
    console.log('❌ Validation failed\n');
    
    for (const result of results) {
      if (!result.valid) {
        console.log(`File: ${result.filePath}`);
        for (const error of result.errors) {
          console.log(`  - ${error}`);
        }
        console.log('');
      }
    }
    
    process.exit(1);
  } else {
    console.log('✅ All files pass validation');
    process.exit(0);
  }
}

// Handle import of glob
async function importGlob() {
  try {
    const globModule = await import('glob');
    return globModule.glob;
  } catch (error) {
    // Fallback to simple file finding if glob is not available
    console.warn('Warning: glob package not available, using simple file search');
    return async (pattern, options) => {
      const files = [];
      
      function findFiles(dir, pattern) {
        if (!fs.existsSync(dir)) return;
        
        const items = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const item of items) {
          const fullPath = path.join(dir, item.name);
          
          if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
            findFiles(fullPath, pattern);
          } else if (item.isFile()) {
            if (pattern === '**/site.config.json' && item.name === 'site.config.json') {
              files.push(path.relative(options.cwd || process.cwd(), fullPath));
            } else if (pattern === 'pubs/**/meta.jsonld' && item.name === 'meta.jsonld' && fullPath.includes('/pubs/')) {
              files.push(path.relative(options.cwd || process.cwd(), fullPath));
            }
          }
        }
      }
      
      findFiles(options.cwd || process.cwd(), pattern);
      return files;
    };
  }
}

// Replace glob import with dynamic import
importGlob().then(globFunc => {
  globalThis.glob = globFunc;
  main().catch(error => {
    console.error(`❌ Unexpected error: ${error.message}`);
    process.exit(1);
  });
});
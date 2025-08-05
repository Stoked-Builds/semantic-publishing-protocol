import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import matter from 'gray-matter';

/**
 * Loads JSON schema from file with proper $ref resolution
 */
async function loadSchema(schemaPath, schemaDir) {
  const schemaContent = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  
  // Create AJV instance with schema resolution
  const ajv = new Ajv({
    strict: false, // Allow unknown formats and keywords
    loadSchema: async (uri) => {
      // Skip JSON Schema meta-schema - AJV handles this internally
      if (uri.startsWith('https://json-schema.org/')) {
        return true; // Return a dummy schema, AJV will use internal meta-schema
      }
      
      // Handle local schema references
      if (uri.startsWith('https://spec.stoked.tech/schemas/')) {
        const localPath = uri.replace('https://spec.stoked.tech/schemas/', '');
        const fullPath = path.resolve(schemaDir, localPath);
        if (fs.existsSync(fullPath)) {
          return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        }
      }
      throw new Error(`Cannot resolve schema: ${uri}`);
    }
  });
  
  addFormats(ajv);
  
  try {
    // Compile the schema with resolved references
    const validate = await ajv.compileAsync(schemaContent);
    return { validate, ajv };
  } catch (error) {
    // If async compilation fails, try synchronous compilation
    const validate = ajv.compile(schemaContent);
    return { validate, ajv };
  }
}

/**
 * Parses semantic blocks from markdown content
 */
function parseSemanticBlocks(content) {
  const blockRegex = /<!-- sb:block([^>]*) -->([\s\S]*?)<!-- \/sb:block -->/g;
  const blocks = [];
  let match;
  
  while ((match = blockRegex.exec(content)) !== null) {
    const attributes = match[1];
    const blockContent = match[2].trim();
    
    // Parse attributes
    const attrs = {};
    const attrRegex = /(\w+)="([^"]*)"/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attributes)) !== null) {
      attrs[attrMatch[1]] = attrMatch[2];
    }
    
    blocks.push({
      type: attrs.type || 'unknown',
      attributes: attrs,
      content: blockContent
    });
  }
  
  return blocks;
}

/**
 * Extracts extensions from semantic data
 */
function extractExtensions(data) {
  const extensions = new Set();
  
  function traverse(obj) {
    if (typeof obj === 'object' && obj !== null) {
      for (const [key, value] of Object.entries(obj)) {
        // Look for extension patterns
        if (key.includes(':') && key.startsWith('sps:')) {
          extensions.add(key);
        }
        if (typeof value === 'string' && value.includes(':') && value.startsWith('sps:')) {
          extensions.add(value);
        }
        if (typeof value === 'object') {
          traverse(value);
        }
      }
    }
  }
  
  traverse(data);
  return Array.from(extensions);
}

/**
 * Validates publishing blocks for well-formedness
 */
function validatePublishingBlocks(blocks) {
  const errors = [];
  const warnings = [];
  
  for (const [index, block] of blocks.entries()) {
    // Check for required type
    if (!block.type || block.type === 'unknown') {
      errors.push(`Block ${index + 1}: Missing or invalid type attribute`);
    }
    
    // Check for common required attributes based on type
    if (block.type === 'quote' && !block.attributes.source) {
      warnings.push(`Block ${index + 1}: Quote block should have a source attribute`);
    }
    
    // Check for malformed attributes
    if (block.attributes.confidence && 
        !['low', 'medium', 'high'].includes(block.attributes.confidence)) {
      warnings.push(`Block ${index + 1}: Invalid confidence value "${block.attributes.confidence}"`);
    }
    
    // Check for empty content
    if (!block.content.trim()) {
      warnings.push(`Block ${index + 1}: Block has empty content`);
    }
  }
  
  return { errors, warnings };
}

/**
 * Main validation function
 */
export async function validateFile(filePath, options = {}) {
  const schemaDir = options.schemaDir || path.resolve(process.cwd(), 'schema');
  const verbose = options.verbose || false;
  const extensionsOnly = options.extensionsOnly || false;
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  
  const ext = path.extname(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  let semanticData = null;
  let fileType = null;
  let semanticBlocks = [];
  
  const result = {
    errors: [],
    warnings: [],
    extensions: [],
    fileType: null
  };
  
  // Parse file based on extension
  if (ext === '.json') {
    fileType = 'JSON';
    try {
      semanticData = JSON.parse(content);
    } catch (error) {
      result.errors.push(`Invalid JSON: ${error.message}`);
      return { ...result, fileType };
    }
  } else if (ext === '.md') {
    if (filePath.endsWith('.sps.md')) {
      fileType = 'SPS Markdown';
      try {
        const { data: frontmatter } = matter(content);
        semanticData = frontmatter;
      } catch (error) {
        result.errors.push(`Invalid frontmatter: ${error.message}`);
        return { ...result, fileType };
      }
    } else {
      fileType = 'Markdown with semantic blocks';
      semanticBlocks = parseSemanticBlocks(content);
      
      if (semanticBlocks.length === 0) {
        result.warnings.push('No semantic blocks found in markdown file');
      }
    }
  } else {
    result.errors.push(`Unsupported file type: ${ext}`);
    return result;
  }
  
  result.fileType = fileType;
  
  // Validate semantic blocks if present
  if (semanticBlocks.length > 0) {
    const blockValidation = validatePublishingBlocks(semanticBlocks);
    result.errors.push(...blockValidation.errors);
    result.warnings.push(...blockValidation.warnings);
    
    // Extract extensions from blocks
    for (const block of semanticBlocks) {
      if (block.type && block.type.includes(':')) {
        result.extensions.push(block.type);
      }
    }
  }
  
  // Schema validation for JSON and SPS markdown
  if (semanticData && !extensionsOnly) {
    const semanticSchemaPath = path.resolve(schemaDir, 'semantic.json');
    
    if (!fs.existsSync(semanticSchemaPath)) {
      result.errors.push(`Schema not found: ${semanticSchemaPath}`);
      return result;
    }
    
    try {
      const { validate } = await loadSchema(semanticSchemaPath, schemaDir);
      const valid = validate(semanticData);
      
      if (!valid) {
        for (const error of validate.errors || []) {
          const path = error.instancePath || 'root';
          result.errors.push(`Schema validation error at ${path}: ${error.message}`);
        }
      }
    } catch (error) {
      result.errors.push(`Schema loading error: ${error.message}`);
    }
    
    // Extract extensions from semantic data
    const dataExtensions = extractExtensions(semanticData);
    result.extensions.push(...dataExtensions);
  }
  
  // Remove duplicates from extensions
  result.extensions = [...new Set(result.extensions)];
  
  // Validate that extensions are supported (basic check)
  const supportedExtensions = ['sps:block/recipe', 'sps:block/quote', 'sps:block/summary'];
  for (const ext of result.extensions) {
    if (ext.startsWith('sps:') && !supportedExtensions.includes(ext)) {
      result.warnings.push(`Unknown extension: ${ext}`);
    }
  }
  
  return result;
}
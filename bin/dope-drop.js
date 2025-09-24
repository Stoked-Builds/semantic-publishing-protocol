#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

// Template data for different site types
const templates = {
  blog: {
    siteConfig: {
      description: "A personal blog sharing thoughts and experiences",
      topics: ["personal", "thoughts", "experiences"],
      defaultContentType: "article"
    },
    meta: {
      "@type": "BlogPosting",
      name: "Welcome to My Blog",
      description: "The first post of my new blog",
      keywords: ["blog", "personal", "welcome"]
    }
  },
  zine: {
    siteConfig: {
      description: "An independent zine publication",
      topics: ["culture", "arts", "independent"],
      defaultContentType: "article"
    },
    meta: {
      "@type": "Article",
      name: "Welcome to Our Zine",
      description: "The inaugural issue of our independent zine",
      keywords: ["zine", "independent", "culture", "arts"]
    }
  },
  recipes: {
    siteConfig: {
      description: "A collection of delicious recipes",
      topics: ["cooking", "recipes", "food"],
      defaultContentType: "article"
    },
    meta: {
      "@type": "Recipe",
      name: "My First Recipe",
      description: "A simple recipe to get started",
      keywords: ["recipe", "cooking", "food"]
    }
  }
};

function createSiteConfig(sitename, type = 'blog') {
  const template = templates[type] || templates.blog;
  const now = new Date().toISOString();
  
  return {
    protocolVersion: "1.0.0",
    siteMetadata: {
      name: sitename.charAt(0).toUpperCase() + sitename.slice(1),
      url: `https://${sitename.toLowerCase()}.example.com`,
      description: template.siteConfig.description,
      language: "en",
      publisher: {
        name: `${sitename} Publisher`,
        organizationType: "individual"
      },
      topics: template.siteConfig.topics,
      license: "CC-BY-4.0"
    },
    publishingSettings: {
      defaultContentType: template.siteConfig.defaultContentType,
      enableAnalytics: true,
      enableComments: false
    },
    trustSettings: {
      verificationLevel: "none",
      allowEndorsements: true
    }
  };
}

function createMetaJsonld(sitename, type = 'blog') {
  const template = templates[type] || templates.blog;
  const now = new Date().toISOString();
  
  return {
    "@context": "https://schema.org",
    "@type": template.meta["@type"],
    name: template.meta.name,
    datePublished: now,
    protocolVersion: "1.0.0",
    author: {
      "@type": "Person",
      name: `${sitename} Author`
    },
    description: template.meta.description,
    publisher: {
      "@type": "Person",
      name: `${sitename} Publisher`
    },
    keywords: template.meta.keywords,
    license: "CC-BY-4.0",
    inLanguage: "en"
  };
}

function createDirectories(sitename) {
  const siteDir = path.resolve(sitename);
  const pubsDir = path.join(siteDir, 'pubs', 'first');
  
  if (fs.existsSync(siteDir)) {
    throw new Error(`Directory '${sitename}' already exists`);
  }
  
  fs.mkdirSync(siteDir, { recursive: true });
  fs.mkdirSync(pubsDir, { recursive: true });
  
  return { siteDir, pubsDir };
}

function writeFiles(siteDir, pubsDir, sitename, type) {
  const siteConfig = createSiteConfig(sitename, type);
  const metaJsonld = createMetaJsonld(sitename, type);
  
  const siteConfigPath = path.join(siteDir, 'site.config.json');
  const metaPath = path.join(pubsDir, 'meta.jsonld');
  
  fs.writeFileSync(siteConfigPath, JSON.stringify(siteConfig, null, 2));
  fs.writeFileSync(metaPath, JSON.stringify(metaJsonld, null, 2));
  
  return { siteConfigPath, metaPath };
}

async function validateFiles(siteConfigPath, metaPath) {
  try {
    // Import required modules
    const Ajv = (await import('ajv')).default;
    const addFormats = (await import('ajv-formats')).default;
    
    // Setup AJV
    const ajv = new Ajv({
      allErrors: true,
      verbose: true,
      strict: false
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
    const schemasDir = path.resolve(__dirname, '../schemas');
    const siteConfigSchemaPath = path.join(schemasDir, 'site-config.schema.json');
    const metaSchemaPath = path.join(schemasDir, 'meta.schema.json');
    
    const siteConfigSchema = JSON.parse(fs.readFileSync(siteConfigSchemaPath, 'utf8'));
    const metaSchema = JSON.parse(fs.readFileSync(metaSchemaPath, 'utf8'));
    
    const siteConfigValidator = ajv.compile(siteConfigSchema);
    const metaValidator = ajv.compile(metaSchema);
    
    // Validate site config
    const siteConfigData = JSON.parse(fs.readFileSync(siteConfigPath, 'utf8'));
    const siteConfigValid = siteConfigValidator(siteConfigData);
    
    // Validate meta file
    const metaData = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    const metaValid = metaValidator(metaData);
    
    let hasErrors = false;
    
    if (!siteConfigValid) {
      console.warn('⚠️  Site config validation errors:');
      siteConfigValidator.errors?.forEach(error => {
        const path = error.instancePath || 'root';
        console.warn(`  - ${error.message} at ${path}`);
        hasErrors = true;
      });
    }
    
    if (!metaValid) {
      console.warn('⚠️  Meta file validation errors:');
      metaValidator.errors?.forEach(error => {
        const path = error.instancePath || 'root';
        console.warn(`  - ${error.message} at ${path}`);
        hasErrors = true;
      });
    }
    
    return !hasErrors;
  } catch (error) {
    console.warn(`⚠️  Could not validate files: ${error.message}`);
    return false;
  }
}

program
  .name('dope-drop')
  .description('CLI tool to scaffold new drop sites with schema-compliant metadata')
  .version('1.0.0');

program
  .command('init')
  .description('Create a new drop site scaffold')
  .argument('<sitename>', 'name of the site to create')
  .option('-t, --type <type>', 'type of site template (blog, zine, recipes)', 'blog')
  .action(async (sitename, options) => {
    try {
      // Validate inputs
      if (!sitename || sitename.trim() === '') {
        throw new Error('Site name is required');
      }
      
      const validTypes = ['blog', 'zine', 'recipes'];
      if (!validTypes.includes(options.type)) {
        throw new Error(`Invalid type. Must be one of: ${validTypes.join(', ')}`);
      }
      
      console.log(`🚀 Creating new ${options.type} site: ${sitename}`);
      
      // Create directory structure
      const { siteDir, pubsDir } = createDirectories(sitename);
      console.log(`📁 Created directory structure: ${sitename}/`);
      
      // Write files
      const { siteConfigPath, metaPath } = writeFiles(siteDir, pubsDir, sitename, options.type);
      console.log(`📄 Created site.config.json`);
      console.log(`📄 Created pubs/first/meta.jsonld`);
      
      // Validate files
      console.log('🔍 Validating generated files...');
      const isValid = await validateFiles(siteConfigPath, metaPath);
      
      if (isValid) {
        console.log('✅ All files pass validation!');
      } else {
        console.log('⚠️  Files created but may have validation issues (see warnings above)');
      }
      
      console.log(`\n🎉 Successfully created ${options.type} site scaffold for: ${sitename}`);
      console.log(`\nNext steps:`);
      console.log(`  cd ${sitename}`);
      console.log(`  # Edit site.config.json and pubs/first/meta.jsonld as needed`);
      console.log(`  # Validate your changes with: node scripts/validate.js site.config.json pubs/first/meta.jsonld`);
      console.log(`  # (Run from the repository root directory)`);
      
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  });

program.parse();
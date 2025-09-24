#!/usr/bin/env node

/**
 * Dope Drop Protocol CLI
 * 
 * Main CLI interface for the dope-drop-protocol npm package
 */

import { Command } from 'commander';
import { validateFile } from '../lib/validator.js';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

program
  .name('dope-drop')
  .description('CLI tools for the Dope Drop Protocol (Semantic Publishing Protocol)')
  .version('1.0.0');

// Init command - creates a basic semantic.json template
program
  .command('init')
  .description('Initialize a new semantic publishing project')
  .option('-o, --output <file>', 'output file name', 'semantic.json')
  .action(async (options) => {
    const template = {
      "$schema": "https://schemas.spp.dev/semantic.json",
      "id": "example:content",
      "type": "article",
      "title": "Your Content Title",
      "language": "en",
      "authors": [
        {
          "name": "Your Name"
        }
      ],
      "published_at": new Date().toISOString(),
      "content": {
        "format": "markdown",
        "value": "Your content goes here. This can be markdown, HTML, or plain text."
      },
      "links": [
        {
          "rel": "canonical",
          "href": "https://example.com/your-content"
        }
      ],
      "provenance": {
        "mode": "authoritative",
        "source_url": "https://example.com/your-content",
        "content_hash": "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      },
      "version": 1
    };

    try {
      const outputFile = resolve(options.output);
      
      if (fs.existsSync(outputFile)) {
        console.error(`❌ File ${outputFile} already exists. Use a different output file or remove the existing one.`);
        process.exit(1);
      }

      fs.writeFileSync(outputFile, JSON.stringify(template, null, 2));
      console.log(`✅ Created ${outputFile}`);
      console.log('\n📋 Next steps:');
      console.log(`   1. Edit ${path.basename(outputFile)} with your content details`);
      console.log(`   2. Run: dope-drop validate ${path.basename(outputFile)}`);
      console.log('   3. Publish your semantic content!');
    } catch (error) {
      console.error(`❌ Failed to create file: ${error.message}`);
      process.exit(1);
    }
  });

// Validate command - validates files using the existing validator
program
  .command('validate')
  .description('Validate semantic publishing protocol files')
  .argument('[files...]', 'files to validate (.json, .sps.md, or .md)')
  .option('-s, --schema-dir <dir>', 'schema directory path', resolve(__dirname, '../schemas'))
  .option('-v, --verbose', 'verbose output')
  .option('--extensions-only', 'only check extensions, skip schema validation')
  .action(async (files, options) => {
    try {
      // If no files specified, try to validate default files
      let filesToValidate = files;
      if (!files || files.length === 0) {
        // Look for common semantic files in current directory
        const commonFiles = ['semantic.json', 'site.config.json', 'meta.jsonld'];
        filesToValidate = commonFiles.filter(file => fs.existsSync(file));
        
        if (filesToValidate.length === 0) {
          console.log('ℹ️  No files specified and no common semantic files found.');
          console.log('Usage: dope-drop validate <file1> [file2] ...');
          console.log('   or: dope-drop validate (to validate common files in current directory)');
          process.exit(0);
        }
        
        console.log(`📋 Found ${filesToValidate.length} file(s) to validate:`);
        filesToValidate.forEach(file => console.log(`   - ${file}`));
        console.log('');
      }

      let hasFailures = false;

      for (const file of filesToValidate) {
        if (!fs.existsSync(file)) {
          console.error(`❌ File not found: ${file}`);
          hasFailures = true;
          continue;
        }

        const result = await validateFile(file, options);
        
        if (options.verbose || result.errors.length > 0 || result.warnings.length > 0) {
          console.log(`\n📋 Validation Report for: ${file}`);
          console.log('═'.repeat(50));
          
          if (result.fileType) {
            console.log(`📄 File Type: ${result.fileType}`);
          }
          
          if (result.extensions && result.extensions.length > 0) {
            console.log(`🧩 Extensions Used: ${result.extensions.join(', ')}`);
          }
          
          if (result.errors.length > 0) {
            console.log(`\n❌ Errors (${result.errors.length}):`);
            result.errors.forEach((error, i) => {
              console.log(`  ${i + 1}. ${error}`);
            });
          }
          
          if (result.warnings.length > 0) {
            console.log(`\n⚠️  Warnings (${result.warnings.length}):`);
            result.warnings.forEach((warning, i) => {
              console.log(`  ${i + 1}. ${warning}`);
            });
          }
          
          if (result.errors.length === 0 && result.warnings.length === 0) {
            console.log('\n✅ All validations passed!');
          }
        }
        
        if (result.errors.length > 0) {
          hasFailures = true;
        } else {
          console.log(`✅ ${file} is valid`);
        }
      }

      if (hasFailures) {
        process.exit(1);
      }
    } catch (error) {
      console.error(`❌ Validation failed: ${error.message}`);
      if (options.verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  });

program.parse();
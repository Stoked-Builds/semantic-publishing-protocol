#!/usr/bin/env node

import { Command } from 'commander';
import { validateFile } from '../lib/validator.js';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

program
  .name('spp-validate')
  .description('CLI validator for Semantic Publishing Protocol files')
  .version('1.0.0')
  .argument('<file>', 'file to validate (.json, .sps.md, or .md)')
  .option('-s, --schema-dir <dir>', 'schema directory path', resolve(__dirname, '../schema'))
  .option('-v, --verbose', 'verbose output')
  .option('--extensions-only', 'only check extensions, skip schema validation')
  .action(async (file, options) => {
    try {
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
        process.exit(1);
      } else {
        console.log(`✅ ${file} is valid`);
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
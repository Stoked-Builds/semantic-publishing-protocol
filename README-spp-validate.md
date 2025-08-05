# spp-validate CLI Tool

A command-line validator for Semantic Publishing Protocol (SPP) files.

## Features

- ✅ Validates semantic.json files against the SPP schema
- ✅ Supports `.json`, `.sps.md`, and `.md` files with semantic blocks
- ✅ Reports extension usage and validates well-formed publishing blocks
- ✅ Comprehensive error reporting and validation feedback
- ✅ Schema validation with proper $ref resolution
- ✅ Extensions-only mode for checking extensions without schema validation

## Installation

```bash
npm install
```

## Usage

### Basic validation

```bash
# Validate a JSON semantic file
./bin/spp-validate.js schema/examples/semantic-content-valid.json

# Validate an SPS markdown file (.sps.md)
./bin/spp-validate.js examples/example-01.sps.md

# Validate markdown with semantic blocks
./bin/spp-validate.js examples/semantic-blocks/story-with-semantic-blocks.md
```

### Options

```bash
# Verbose output with detailed validation report
./bin/spp-validate.js <file> --verbose

# Skip schema validation, only check extensions and blocks
./bin/spp-validate.js <file> --extensions-only

# Use custom schema directory
./bin/spp-validate.js <file> --schema-dir /path/to/schemas

# Show help
./bin/spp-validate.js --help
```

## Supported File Types

### 1. JSON Files (.json)
Pure semantic.json files that conform to the SPP semantic schema.

Example:
```json
{
  "id": "content:example",
  "title": "Example Content",
  "author": {
    "name": "Author Name"
  }
}
```

### 2. SPS Markdown (.sps.md)
Markdown files with YAML frontmatter containing semantic metadata.

Example:
```markdown
---
id: "content:example"
title: "Example Content"
author:
  name: "Author Name"
---

# Content Here
```

### 3. Markdown with Semantic Blocks (.md)
Regular markdown files containing semantic blocks using HTML comments.

Example:
```markdown
# Article Title

<!-- sb:block type="summary" -->
This is a summary block.
<!-- /sb:block -->

<!-- sb:block type="quote" source="Author" confidence="high" -->
This is a quoted section with metadata.
<!-- /sb:block -->
```

## Validation Features

### Schema Validation
- Validates against the SPP semantic.json schema
- Supports nested schema references ($ref resolution)
- Reports detailed validation errors with paths

### Extension Detection
- Detects and reports SPP extensions used (e.g., `sps:block/recipe`)
- Validates that extensions are supported
- Warns about unknown extensions

### Publishing Blocks Validation
- Checks semantic blocks for required attributes
- Validates block types and confidence levels
- Reports malformed or empty blocks

## Exit Codes

- `0`: Validation successful
- `1`: Validation failed with errors

## Examples

### Successful validation
```bash
$ ./bin/spp-validate.js schema/examples/semantic-content-valid.json
✅ schema/examples/semantic-content-valid.json is valid
```

### Validation with errors (verbose)
```bash
$ ./bin/spp-validate.js invalid-file.json --verbose

📋 Validation Report for: invalid-file.json
══════════════════════════════════════════════════
📄 File Type: JSON
🧩 Extensions Used: sps:block/recipe

❌ Errors (1):
  1. Schema validation error at root: must NOT have additional properties
```

### Semantic blocks validation
```bash
$ ./bin/spp-validate.js content.md --verbose

📋 Validation Report for: content.md
══════════════════════════════════════════════════
📄 File Type: Markdown with semantic blocks

⚠️  Warnings (1):
  1. Block 2: Quote block should have a source attribute

✅ All validations passed!
```

## Testing

Run the test suite:
```bash
npm test
```

## Schema Directory

By default, the tool looks for schemas in the `./schema` directory relative to the CLI tool. You can specify a custom schema directory using the `--schema-dir` option.

The tool expects the following schema structure:
- `semantic.json` - Main semantic content schema
- `common/author.json` - Author schema
- `common/publisher.json` - Publisher schema
- `topic.json` - Topic schema

## Development

The CLI tool is built with:
- [Commander.js](https://github.com/tj/commander.js/) for CLI interface
- [AJV](https://ajv.js.org/) for JSON Schema validation
- [gray-matter](https://github.com/jonschlinkert/gray-matter) for frontmatter parsing

Project structure:
```
bin/
  spp-validate.js     # CLI entry point
lib/
  validator.js        # Core validation logic
test/
  validator.test.js   # Test suite
```
# Schema Validation Examples

This directory contains example JSON files that validate against the schemas in the parent directory.

## Running Validation

You can validate these examples using any JSON Schema validator. For example, using the `ajv-cli` tool:

```bash
npm install -g ajv-cli
ajv validate -s ../schema/ad-token.json -d ad-token-valid.json
```

Or using Python with the `jsonschema` library:

```python
import json
import jsonschema

# Load schema and example
with open('../schema/ad-token.json', 'r') as f:
    schema = json.load(f)

with open('ad-token-valid.json', 'r') as f:
    instance = json.load(f)

# Validate
jsonschema.validate(instance=instance, schema=schema)
print("Validation successful!")
```

## Examples

- `ad-token-valid.json` - Valid ad token example
- `semantic-content-valid.json` - Valid semantic content example
- `topic-valid.json` - Valid topic example
# JSON Schemas

This directory contains all JSON Schema definitions for the Semantic Publishing Protocol (SPP).

## Structure

- `common/` - Shared schema components used across multiple schemas
- `core/` - Core object schemas for main SPP types
- Root files - Main schemas for primary objects

## Usage

All schemas follow JSON Schema Draft 2020-12 specification and use modular `$ref` structure to avoid duplication.

## Schema Files

### Core Objects
- `semantic.json` - Core semantic content schema
- `ad-token.json` - Advertisement token schema
- `topic.json` - Topic definition schema
- `consent-token.json` - Consent token schema
- `payment-intent.json` - Payment intent schema
- `sps-license-metadata.json` - SPS license metadata schema
- `publisher-metadata.json` - Publisher metadata schema

### Type-Specific Schemas (core/)
- `core/article.json` - Article content type schema
- `core/product.json` - Product content type schema

### Common Components
- `common/author.json` - Author object definition
- `common/publisher.json` - Publisher object definition
- `common/block.json` - Semantic block definition
- `common/attribution.json` - Attribution object definition
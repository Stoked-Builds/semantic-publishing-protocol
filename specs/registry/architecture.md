# Semantic Publishing Protocol Registry Architecture (v1)

**Version:** 1.0  
**Status:** Draft  
**Date:** 2025-01-11  
**Spec Code:** registry/architecture

---

## Purpose

The SPP Registry provides a DNS/HTTP-first discovery and verification infrastructure for the Semantic Publishing Protocol. It serves as a decentralized pointer system that enables AI browsers and agents to discover, index, and retrieve semantically structured content while maintaining publisher autonomy and user consent.

The registry architecture enables:
- **Discovery**: Location of published content via standardized endpoints
- **Verification**: Cryptographic validation of content authenticity and provenance  
- **Consent**: Enforcement of user and publisher consent policies
- **Interoperability**: Cross-registry federation and content syndication

This specification defines the v1 architecture using DNS and HTTP as the primary transport mechanisms. Future versions MAY incorporate blockchain or peer-to-peer technologies as additional layers.

---

## Roles and Responsibilities

### Publisher
A **Publisher** is an entity that creates and registers semantic content in the SPP ecosystem.

**Responsibilities:**
- MUST maintain a valid `.well-known/spp.json` endpoint
- MUST sign registry entries with their cryptographic identity
- MUST honor consent policies declared in registry metadata
- SHOULD provide timely updates when content changes or is removed

### Registry Operator
A **Registry Operator** hosts and maintains a registry instance that indexes content from multiple publishers.

**Responsibilities:**
- MUST implement the standard SPP Registry API (see API Surface section)
- MUST verify publisher signatures before accepting registry entries
- MUST respect consent and revocation requests
- SHOULD federate with other compliant registries
- SHOULD provide discovery interfaces for AI browsers and agents

### Consumer (AI Browser/Agent)
A **Consumer** queries registries to discover and access semantic content.

**Responsibilities:**
- MUST respect publisher consent policies
- MUST verify content signatures and provenance
- SHOULD cache registry data responsibly
- SHOULD honor publisher preferences for indexing and profiling

---

## Content Lifecycle

### 1. Registration (Reconstructed → Authoritative)

Publishers transition content from reconstructed (scraped/inferred) to authoritative (publisher-signed) state:

1. **Content Creation**: Publisher creates semantic content following SPP schemas
2. **Metadata Generation**: Publisher generates registry metadata with required fields
3. **Signing**: Publisher signs registry entry with their private key
4. **Discovery Endpoint**: Publisher exposes `.well-known/spp.json` with content pointers
5. **Registry Submission**: Publisher submits signed entry to chosen registry(ies)

### 2. Discovery

Consumers discover content through multiple pathways:

1. **Direct Discovery**: Query publisher's `.well-known/spp.json` endpoint
2. **Registry Query**: Search federated registries by topic, author, or metadata
3. **Sitemap Crawling**: Process publisher's `sitemap.json` for bulk discovery
4. **Federation**: Cross-registry content sharing and replication

### 3. Verification

All content MUST be verified before consumption:

1. **Signature Verification**: Validate publisher's cryptographic signature
2. **Schema Compliance**: Ensure content conforms to SPP schemas
3. **Consent Validation**: Check that access complies with declared policies
4. **Freshness Check**: Verify content has not been revoked or updated

### 4. Revocation

Publishers MAY revoke or update content at any time:

1. **Content Update**: Publisher updates content and re-signs registry entry
2. **Registry Notification**: Updated entry is submitted to all relevant registries
3. **Consumer Cache Invalidation**: Consumers SHOULD respect cache expiry headers
4. **Complete Revocation**: Publisher MAY remove content entirely from registries

---

## Core Objects

### Registry Entry

A **Registry Entry** represents a single piece of semantic content in the registry. It extends the base semantic content schema with registry-specific metadata. The core content MUST conform to `/schemas/semantic.json`, with additional registry fields:

**Base Semantic Content** (conforming to `/schemas/semantic.json`):
```json
{
  "id": "string",
  "title": "string", 
  "summary": "string",
  "author": { /* Author object per /schemas/common/author.json */ },
  "publisher": { /* Publisher object per /schemas/common/publisher.json */ },
  "topics": [ /* Topic objects per /schemas/topic.json */ ],
  "tags": ["string"],
  "lang": "string",
  "date": "string",
  "version": "string",
  "digest": "string",
  "canonical": "string",
  "license": "string",
  "protocolVersion": "string"
}
```

**Registry-Specific Extensions**:
```json
{
  "registryMetadata": {
    "signature": {
      "issuer": "string",
      "signatureValue": "string",
      "signedAt": "string"
    },
    "consentPolicy": {
      "allowIndexing": "boolean",
      "allowProfiling": "boolean", 
      "dataRetention": "string",
      "purposeLimitation": ["string"]
    },
    "registeredAt": "string",
    "lastModified": "string"
  }
}
```

**Field Requirements:**
- `id`: MUST be globally unique identifier for the content
- `title`: MUST be present and non-empty
- `author`: MUST conform to `/schemas/common/author.json`
- `publisher`: MUST conform to `/schemas/common/publisher.json`  
- `topics`: MUST contain array of topic objects conforming to `/schemas/topic.json`
- `protocolVersion`: MUST specify SPP version (e.g., "1.0")
- `signature`: MUST contain valid cryptographic signature from publisher

### Well-Known Endpoint

Publishers MUST expose a `.well-known/spp.json` endpoint containing registry metadata:

```json
{
  "protocolVersion": "1.0",
  "publisher": {
    "name": "Example Publisher",
    "id": "publisher:example", 
    "uri": "https://example.com",
    "publicKey": "did:key:...",
    "trustModel": "editorial-chain"
  },
  "endpoints": {
    "sitemap": "https://example.com/spp/sitemap.json",
    "content": "https://example.com/spp/content/",
    "registry": "https://example.com/spp/registry/"
  },
  "policies": {
    "consent": "https://example.com/spp/consent-policy.json",
    "privacy": "https://example.com/privacy",
    "terms": "https://example.com/terms"
  },
  "federation": {
    "allowCrawling": true,
    "allowIndexing": true,
    "cacheMaxAge": 3600
  }
}
```

### Sitemap

Publishers SHOULD expose a machine-readable sitemap at the declared endpoint:

```json
{
  "lastModified": "2025-01-11T10:00:00Z",
  "content": [
    {
      "type": "article",
      "url": "https://example.com/spp/content/article-123.json",
      "lastModified": "2025-01-10T15:30:00Z",
      "digest": "sha256:abc123..."
    }
  ],
  "ads": [
    {
      "type": "intent-aligned-ad", 
      "url": "https://example.com/spp/ads/product-launch.json",
      "lastModified": "2025-01-09T09:00:00Z"
    }
  ]
}
```

---

## Storage Recommendations

### Publisher Storage

Publishers SHOULD organize content using the following structure:

```
/.well-known/spp.json          # Registry metadata
/spp/sitemap.json              # Content index
/spp/content/<id>.json         # Individual content files
/spp/policies/                 # Consent and privacy policies
/spp/keys/                     # Public key materials
```

**Best Practices:**
- Use content-addressed storage for immutability (e.g., IPFS hashes as filenames)
- Implement proper HTTP caching headers (Cache-Control, ETag)
- Serve content over HTTPS with valid certificates
- Provide both human-readable and machine-readable formats

### Registry Storage

Registry operators SHOULD use persistent storage systems that support:

- **High Availability**: Multi-region replication for fault tolerance
- **Consistency**: Strong consistency for signature verification
- **Scalability**: Horizontal scaling for large content volumes
- **Backup**: Regular backups with point-in-time recovery

**Recommended Architecture:**
- Primary database: PostgreSQL with JSON columns for metadata
- Search index: Elasticsearch for topic and tag queries  
- Cache layer: Redis for frequently accessed content
- Object storage: S3-compatible storage for large content files

---

## API Surface Summary

The SPP Registry API provides HTTP endpoints for content discovery and registration. A full OpenAPI specification will be provided in future versions.

### Core Endpoints

#### Publisher Endpoints
- `GET /.well-known/spp.json` - Registry metadata
- `GET /spp/sitemap.json` - Content sitemap
- `GET /spp/content/{id}` - Individual content retrieval

#### Registry Endpoints  
- `POST /api/v1/entries` - Submit registry entry
- `GET /api/v1/entries/{id}` - Retrieve entry by ID
- `GET /api/v1/search` - Search entries by metadata
- `DELETE /api/v1/entries/{id}` - Revoke entry (authenticated)

#### Discovery Endpoints
- `GET /api/v1/publishers` - List registered publishers
- `GET /api/v1/topics` - Browse topic taxonomy
- `GET /api/v1/recent` - Recently published content

### Authentication

Registry write operations REQUIRE cryptographic authentication:

1. **Request Signing**: HTTP signatures using publisher's private key
2. **Identity Verification**: Validation against publisher's declared public key
3. **Scope Limitation**: Publishers MAY only modify their own content

### Rate Limiting

Registries SHOULD implement rate limiting to prevent abuse:

- **Read Operations**: 1000 requests per hour per IP
- **Write Operations**: 100 requests per hour per authenticated publisher  
- **Search Queries**: 500 requests per hour per IP

---

## Security Model

### Trust Architecture

The SPP Registry uses a **web-of-trust** model combined with **cryptographic verification**:

1. **Publisher Identity**: Publishers MUST maintain cryptographic identities
2. **Content Signing**: All registry entries MUST be cryptographically signed
3. **Verification Chain**: Consumers MUST verify signatures before trusting content
4. **Reputation System**: Registries MAY implement reputation scoring for publishers

### Threat Model

The security model addresses the following threats:

#### Content Tampering
**Threat**: Malicious modification of content after publication  
**Mitigation**: Cryptographic signatures and content hashes MUST be verified

#### Identity Spoofing  
**Threat**: Attackers impersonating legitimate publishers  
**Mitigation**: Strong cryptographic identity requirements and key verification

#### Registry Compromise
**Threat**: Malicious registry operators serving false content  
**Mitigation**: Content verification happens at consumer level, not registry level

#### Denial of Service
**Threat**: Resource exhaustion attacks against registries  
**Mitigation**: Rate limiting, authentication requirements for writes

### Privacy Protections

#### Data Minimization
Registries MUST store only the minimum metadata required for discovery:
- No personal information beyond declared publisher identity
- No tracking of consumer queries or access patterns
- Optional pseudonymization of publisher identities

#### Consent Enforcement
Registries MUST honor publisher consent declarations:
- `allowIndexing: false` content MUST NOT be indexed for search
- `allowProfiling: false` content MUST NOT be used for behavioral analysis
- `dataRetention` limits MUST be enforced with automatic deletion

#### Right to Deletion
Publishers MUST be able to request complete removal of their content:
- Registry entries MUST be deleted upon authenticated request
- Cached content SHOULD be invalidated across federated registries
- Consumers SHOULD respect deletion notices

---

## Cross-Registry Federation

### Federation Protocol

Registries MAY federate with other SPP-compliant registries using the following mechanisms:

#### Content Syndication
- Registries MAY replicate entries from trusted partner registries
- Replicated content MUST maintain original signatures and provenance
- Attribution to source registry MUST be preserved

#### Query Federation  
- Search queries MAY be forwarded to federated registries
- Results MUST be aggregated and de-duplicated
- Query performance SHOULD be optimized through caching

#### Trust Propagation
- Registry reputation MAY be shared across federation networks
- Trust scores MUST be clearly attributed to calculating registry
- Consumers SHOULD validate trust calculations independently

### Federation Requirements

To participate in federation, registries MUST:

1. **Implement Standard API**: Full compatibility with SPP Registry API specification
2. **Verify Signatures**: Independent cryptographic verification of all content  
3. **Honor Consent**: Respect publisher consent policies across federation
4. **Provide Provenance**: Clear attribution of content sources and trust signals

---

## Compliance Requirements

### MUST Requirements

Implementations MUST satisfy the following requirements for SPP v1 compliance:

- **Schema Conformance**: All data MUST conform to schemas in `/schemas/`
- **Signature Verification**: All content MUST be cryptographically verified
- **Consent Enforcement**: Publisher consent policies MUST be honored
- **Standard Endpoints**: `.well-known/spp.json` endpoint MUST be available
- **Error Handling**: HTTP error codes MUST follow REST conventions

### SHOULD Requirements  

Implementations SHOULD include the following features for optimal interoperability:

- **Federation Support**: Cross-registry content sharing and discovery
- **Caching Headers**: Proper HTTP caching for performance optimization
- **Rate Limiting**: Protection against abuse and resource exhaustion
- **Monitoring**: Logging and metrics for operational visibility
- **Documentation**: Clear API documentation and integration guides

### MAY Requirements

Implementations MAY include additional features:

- **Advanced Search**: Full-text search, semantic similarity, recommendation engines
- **Analytics Dashboard**: Publisher analytics and content performance metrics  
- **Content Moderation**: Automated filtering for policy compliance
- **Multi-format Support**: Alternative content formats beyond JSON

---

## Related Specifications

This architecture specification should be read in conjunction with:

- **[SPP Registry and Discovery](../spp/registry-and-discovery.md)**: Discovery mechanisms and protocols
- **[SPP Publishing Registry](../spp/publishing-registry.md)**: Registry entry formats and submission process  
- **[SPP Core](../SPP-Core.md)**: Core entities and data structures
- **[SPP Protocols](../SPP-Protocols.md)**: Protocol stack and layering

Additional resources:

- **OpenAPI Specification**: To be provided in future versions
- **Schema Definitions**: `/schemas/` directory for all data formats
- **Conformance Tests**: `/conformance/` directory for validation tools

---

## Version History

- **v1.0** (2025-01-11): Initial architecture specification
  - DNS/HTTP-first implementation
  - Core object definitions aligned with schemas
  - Security model and federation protocols
  - Compliance requirements for v1

---

*This specification uses RFC 2119 key words. "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" have specific meanings as defined in RFC 2119.*
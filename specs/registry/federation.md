# Registry Federation & Harvest Protocol (v1.0-draft)

## Purpose [Informative]

The SPP Registry Federation Protocol enables decentralized discovery and content harvesting between SPP-compliant registries. This HTTP-first specification provides standardized mechanisms for registry discovery via DNS, content syndication through harvest APIs, and optional real-time notifications.

This protocol allows AI browsers and agents to discover and federate content across multiple registries while maintaining publisher autonomy, cryptographic verification, and consent policies.

## Normative Requirements [Normative]

Federation-capable registries **MUST**:
- Implement DNS-based discovery via SRV/SVCB records and `.well-known/spp/registry.json`
- Provide harvest API endpoints for `ListIdentifiers`, `ListRecords`, and `GetRecord` operations
- Support cursor-based pagination for all list endpoints
- Verify cryptographic signatures before accepting federated content
- Honor publisher consent policies from originating registries
- Maintain provenance information when replicating content

Federation-capable registries **SHOULD**:
- Implement WebSub push notifications for real-time content updates
- Cache harvested content with appropriate TTL values
- Provide federation health monitoring and status endpoints

Federation-capable registries **MUST NOT**:
- Modify publisher-signed content during federation
- Strip cryptographic signatures or provenance information
- Bypass consent policies when federating content

## Data Model [Normative]

### Registry Discovery Record

Registry discovery information exposed via `.well-known/spp/registry.json`:

```json
{
  "protocolVersion": "1.0",
  "registry": {
    "name": "Example Registry",
    "id": "registry:example",
    "operator": {
      "name": "Example Operator",
      "url": "https://example.com",
      "contact": "admin@example.com"
    },
    "publicKey": {
      "kty": "OKP",
      "crv": "Ed25519", 
      "x": "base64url-encoded-public-key"
    }
  },
  "endpoints": {
    "harvest": {
      "baseUrl": "https://registry.example.com/harvest/v1",
      "listIdentifiers": "/ListIdentifiers",
      "listRecords": "/ListRecords", 
      "getRecord": "/GetRecord"
    },
    "search": "https://registry.example.com/api/v1/search",
    "transparency": "https://registry.example.com/ct",
    "websub": {
      "hub": "https://registry.example.com/websub/hub",
      "supported": true
    }
  },
  "federation": {
    "allowHarvesting": true,
    "allowReplication": true,
    "updateFrequency": "hourly",
    "retentionPolicy": "https://example.com/retention-policy"
  },
  "metadata": {
    "description": "SPP Registry for academic content",
    "topics": ["academic", "research", "science"],
    "contentTypes": ["article", "paper", "dataset"],
    "languages": ["en", "es", "fr"]
  }
}
```

**Field Requirements:**
- `protocolVersion`: **MUST** be "1.0" for this specification version
- `registry.id`: **MUST** be globally unique registry identifier
- `registry.publicKey`: **MUST** be Ed25519 public key in JWK format
- `endpoints.harvest.baseUrl`: **MUST** be absolute HTTPS URL
- `federation.allowHarvesting`: **MUST** indicate if harvest API is available

### Harvest Record

Content records returned by harvest API operations, with federation metadata extending semantic.json schema:

```json
{
  "identifier": "oai:registry.example.com:article-123",
  "datestamp": "2025-01-11T10:30:00Z",
  "status": "active",
  "id": "urn:spp:example:article-123",
  "type": "article",
  "title": "Example Article",
  "language": "en",
  "authors": [
    {
      "name": "John Doe",
      "url": "https://example.com/authors/john-doe"
    }
  ],
  "published_at": "2025-01-10T15:30:00Z",
  "updated_at": "2025-01-10T16:00:00Z",
  "topics": ["federation", "protocol"],
  "sections": ["technology"],
  "media": [],
  "content": {
    "format": "markdown",
    "value": "Article content here..."
  },
  "links": [
    {
      "rel": "canonical",
      "href": "https://example.com/articles/123"
    }
  ],
  "provenance": {
    "mode": "authoritative",
    "publisher_did": "did:key:z6MkABC...",
    "source_url": "https://example.com/articles/123",
    "captured_at": "2025-01-10T16:01:00Z",
    "content_hash": "sha256:abc123..."
  },
  "signature": {
    "signer": "did:key:z6MkABC...",
    "sig": "base64url-signature",
    "signedAt": "2025-01-10T16:00:00Z"
  },
  "version": 1,
  "federation": {
    "sourceRegistry": "registry:example",
    "harvestedAt": "2025-01-11T10:30:00Z",
    "federationPath": ["registry:source", "registry:example"]
  }
}
```

**Field Requirements:**
- `identifier`: **MUST** follow OAI-PMH identifier format `oai:registry:localid`
- `datestamp`: **MUST** be RFC3339 timestamp of last modification
- `status`: **MUST** be one of "active", "deleted", "superseded"
- Core semantic fields: **MUST** conform to `/schemas/semantic.json`
- `federation.sourceRegistry`: **MUST** identify originating registry
- `federation.harvestedAt`: **MUST** be RFC3339 timestamp of harvest operation

## API Surface [Normative]

### Discovery Endpoints

#### DNS Records

Registries **MUST** publish DNS records for discovery:

**SRV Record:**
```
_spp._tcp.registry.example.com. 300 IN SRV 0 5 443 harvest.registry.example.com.
```

**SVCB Record (preferred):**
```
registry.example.com. 300 IN HTTPS 1 harvest.registry.example.com. alpn=h2,h3 port=443
```

**TXT Record:**
```
_spp.registry.example.com. 300 IN TXT "v=spp1; endpoints=https://registry.example.com/.well-known/spp/registry.json"
```

#### Well-Known Discovery

**Endpoint:** `GET /.well-known/spp/registry.json`

**Response:** Registry discovery record as defined in Data Model section.

### Harvest API Endpoints

All harvest endpoints **MUST** support the following query parameters:
- `from`: RFC3339 timestamp for selective harvesting (optional)
- `until`: RFC3339 timestamp for selective harvesting (optional)  
- `cursor`: opaque cursor token for pagination (optional)
- `limit`: maximum number of records (default: 50, max: 100)

#### ListIdentifiers

**Endpoint:** `GET /harvest/v1/ListIdentifiers`

**Purpose:** Retrieve list of record identifiers with modification timestamps.

**Parameters:**
- `metadataPrefix`: **MUST** be "spp" (required)
- `from`: selective harvesting start date (optional)
- `until`: selective harvesting end date (optional)
- `cursor`: pagination cursor (optional)
- `limit`: result limit 1-100 (optional, default: 50)

**Example Request:**
```http
GET /harvest/v1/ListIdentifiers?metadataPrefix=spp&from=2025-01-01T00:00:00Z&limit=10
Host: registry.example.com
Accept: application/spp+json;v=1
```

**Example Response:**
```json
{
  "responseDate": "2025-01-11T10:30:00Z",
  "cursor": "eyJ2IjoxLCJ0IjoiMjAyNS0wMS0xMVQxMDozMDowMFoiLCJvIjoxMH0",
  "hasMore": true,
  "identifiers": [
    {
      "identifier": "oai:registry.example.com:article-123",
      "datestamp": "2025-01-10T16:00:00Z",
      "status": "active"
    },
    {
      "identifier": "oai:registry.example.com:article-124", 
      "datestamp": "2025-01-11T09:15:00Z",
      "status": "active"
    }
  ]
}
```

#### ListRecords

**Endpoint:** `GET /harvest/v1/ListRecords`

**Purpose:** Retrieve complete record metadata and content.

**Parameters:** Same as ListIdentifiers

**Example Request:**
```http
GET /harvest/v1/ListRecords?metadataPrefix=spp&limit=5
Host: registry.example.com
Accept: application/spp+json;v=1
```

**Example Response:**
```json
{
  "responseDate": "2025-01-11T10:30:00Z",
  "cursor": "eyJ2IjoxLCJ0IjoiMjAyNS0wMS0xMVQxMDozMDowMFoiLCJvIjo1fQ",
  "hasMore": true,
  "records": [
    {
      "identifier": "oai:registry.example.com:article-123",
      "datestamp": "2025-01-10T16:00:00Z", 
      "status": "active",
      "id": "urn:spp:example:article-123",
      "type": "article",
      "title": "Example Article",
      "language": "en",
      "authors": [{"name": "John Doe", "url": "https://example.com/authors/john-doe"}],
      "published_at": "2025-01-10T15:30:00Z",
      "updated_at": "2025-01-10T16:00:00Z",
      "topics": ["federation", "protocol"],
      "sections": ["technology"], 
      "media": [],
      "content": {
        "format": "markdown",
        "value": "Article content here..."
      },
      "links": [{"rel": "canonical", "href": "https://example.com/articles/123"}],
      "provenance": {
        "mode": "authoritative",
        "publisher_did": "did:key:z6MkABC...",
        "source_url": "https://example.com/articles/123",
        "captured_at": "2025-01-10T16:01:00Z",
        "content_hash": "sha256:abc123..."
      },
      "signature": {
        "signer": "did:key:z6MkABC...",
        "sig": "base64url-signature",
        "signedAt": "2025-01-10T16:00:00Z"
      },
      "version": 1,
      "federation": {
        "sourceRegistry": "registry:example",
        "harvestedAt": "2025-01-11T10:30:00Z",
        "federationPath": ["registry:source", "registry:example"]
      }
    }
  ]
}
```

#### GetRecord

**Endpoint:** `GET /harvest/v1/GetRecord`

**Purpose:** Retrieve a single specific record.

**Parameters:**
- `identifier`: OAI-PMH record identifier (required)
- `metadataPrefix`: **MUST** be "spp" (required)

**Example Request:**
```http
GET /harvest/v1/GetRecord?identifier=oai:registry.example.com:article-123&metadataPrefix=spp
Host: registry.example.com
Accept: application/spp+json;v=1
```

**Example Response:**
```json
{
  "responseDate": "2025-01-11T10:30:00Z",
  "record": {
    "identifier": "oai:registry.example.com:article-123",
    "datestamp": "2025-01-10T16:00:00Z",
    "status": "active", 
    "id": "urn:spp:example:article-123",
    "type": "article",
    "title": "Example Article",
    "language": "en",
    "authors": [{"name": "John Doe", "url": "https://example.com/authors/john-doe"}],
    "published_at": "2025-01-10T15:30:00Z",
    "updated_at": "2025-01-10T16:00:00Z",
    "topics": ["federation", "protocol"],
    "sections": ["technology"],
    "media": [],
    "content": {
      "format": "markdown", 
      "value": "Article content here..."
    },
    "links": [{"rel": "canonical", "href": "https://example.com/articles/123"}],
    "provenance": {
      "mode": "authoritative",
      "publisher_did": "did:key:z6MkABC...",
      "source_url": "https://example.com/articles/123",
      "captured_at": "2025-01-10T16:01:00Z",
      "content_hash": "sha256:abc123..."
    },
    "signature": {
      "signer": "did:key:z6MkABC...",
      "sig": "base64url-signature",
      "signedAt": "2025-01-10T16:00:00Z"
    },
    "version": 1,
    "federation": {
      "sourceRegistry": "registry:example",
      "harvestedAt": "2025-01-11T10:30:00Z",
      "federationPath": ["registry:source", "registry:example"]
    }
  }
}
```

### Optional WebSub Push Notifications

Registries **MAY** implement WebSub for real-time content updates.

#### Hub Discovery

Registry discovery record **SHOULD** include WebSub hub information:

```json
{
  "endpoints": {
    "websub": {
      "hub": "https://registry.example.com/websub/hub",
      "supported": true
    }
  }
}
```

#### Topic Subscription

Subscribers **MAY** subscribe to topic URLs:
- `https://registry.example.com/feeds/all` - All content updates
- `https://registry.example.com/feeds/topics/{topic}` - Topic-specific updates
- `https://registry.example.com/feeds/publishers/{publisher-id}` - Publisher-specific updates

#### HMAC Verification

Push notifications **MUST** include HMAC-SHA256 signature in HTTP headers:

```http
POST /webhook/spp-updates
Host: subscriber.example.com
Content-Type: application/spp+json;v=1
X-Hub-Signature-256: sha256=abc123...
Content-Length: 1234

{
  "updates": [
    {
      "action": "created",
      "identifier": "oai:registry.example.com:article-125",
      "datestamp": "2025-01-11T11:00:00Z"
    }
  ]
}
```

Subscribers **MUST** verify HMAC signature before processing updates.

## Security & Integrity [Normative]

### Registry Authentication

Federation requests **SHOULD** include registry identification:

```http
GET /harvest/v1/ListRecords
Host: source-registry.example.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9...
User-Agent: SPP-Registry/1.0 (registry:harvester.example.com)
```

### Content Verification

Harvesting registries **MUST**:
- Verify cryptographic signatures on all artefacts before acceptance
- Validate content hashes match computed SHA-256 of canonical JSON
- Reject content with invalid or expired signatures
- Preserve original provenance and signature information

### Rate Limiting

Registry operators **SHOULD**:
- Implement rate limiting for harvest endpoints (suggested: 100 requests/hour per registry)
- Use HTTP 429 responses with `Retry-After` headers for exceeded limits
- Allow authenticated registries higher rate limits

### Consent Enforcement

Federated content **MUST** honor original publisher consent policies:
- Check `federation.allowHarvesting` flags before including in harvest responses
- Respect content retention policies from source registries
- Propagate deletion requests across federation networks

## Examples [Normative]

### Complete Discovery Flow

1. **DNS Lookup:**
```bash
dig _spp._tcp.registry.example.com SRV
# Returns: 0 5 443 harvest.registry.example.com.
```

2. **Registry Discovery:**
```http
GET /.well-known/spp/registry.json
Host: registry.example.com
```

3. **Harvest Content:**
```http
GET /harvest/v1/ListRecords?metadataPrefix=spp&limit=10
Host: registry.example.com
```

### Pagination Example

```http
GET /harvest/v1/ListRecords?metadataPrefix=spp&cursor=eyJ2IjoxLCJ0IjoiMjAyNS0wMS0xMVQxMDozMDowMFoiLCJvIjoxMH0&limit=10
Host: registry.example.com
```

**Cursor Format (base64url-encoded JSON):**
```json
{
  "v": 1,
  "t": "2025-01-11T10:30:00Z", 
  "o": 10
}
```

### Error Responses

**Invalid Parameters:**
```http
HTTP/1.1 400 Bad Request
Content-Type: application/problem+json

{
  "type": "https://spp.dev/problems/invalid-request",
  "title": "Invalid metadataPrefix",
  "status": 400,
  "detail": "metadataPrefix must be 'spp'",
  "instance": "/harvest/v1/ListRecords"
}
```

**Record Not Found:**
```http
HTTP/1.1 404 Not Found
Content-Type: application/problem+json

{
  "type": "https://spp.dev/problems/not-found", 
  "title": "Record not found",
  "status": 404,
  "detail": "Record with identifier 'oai:registry.example.com:missing' does not exist",
  "instance": "/harvest/v1/GetRecord"
}
```

## Compatibility & Versioning [Informative]

### Backwards Compatibility

- v1.0 registries **MUST** support harvest API as specified
- Future versions **SHOULD** maintain backwards compatibility for at least 12 months
- Protocol version negotiation via `Accept` headers and API versioning

### Extension Points

Registries **MAY** extend the federation protocol through:
- Additional query parameters in harvest requests (prefixed with `x-`)
- Custom federation metadata in registry discovery records
- Optional push notification topics beyond the standard set

### Migration Path

For registries implementing pre-v1.0 federation:
- Implement `.well-known/spp/registry.json` discovery endpoint
- Add harvest API with standardized cursoring
- Migrate existing federation to use OAI-PMH-style identifiers

## References [Informative]

- [SPP Registry Architecture](./architecture.md)
- [SPP Core Specification](../SPP-Core.md)
- [OAI-PMH Protocol](https://www.openarchives.org/OAI/openarchivesprotocol.html)
- [WebSub Specification](https://www.w3.org/TR/websub/)
- [RFC 6763: DNS-Based Service Discovery](https://tools.ietf.org/html/rfc6763)
- [RFC 9460: Service Binding and Parameter Specification](https://tools.ietf.org/html/rfc9460)
- [JSON Schema 2020-12](https://json-schema.org/draft/2020-12/schema)
# DNS Profile for SPP Registry Discovery (v1.0-draft)

## Purpose [Informative]

The SPP DNS Profile defines standardized DNS record formats and well-known endpoints for discovery and verification of SPP publishers and registries. This enables decentralized discovery without requiring centralized registries while maintaining cryptographic verification of publisher identities.

## Normative Requirements [Normative]

### DNS TXT Records

Publishers **MUST** publish `_spp` TXT records to enable DNS-based discovery. The TXT record **MUST** follow this ABNF grammar (RFC 5234 / RFC 4648):

```
spp-txt    =  *(ws / pair / sep)
pair       = key "=" value
key        = "did" / "pk" / "scopes" / "policy" / extkey
extkey     = 1*( ALPHA / DIGIT / "-" / "_" )
value      = didval / pkval / scopesval / polval / extval
didval     = "did:" 1*( ALPHA / DIGIT / ":" / "-" / "_" )
pkval      = "ed25519:" 1*( ALPHA / DIGIT / "-" / "_" )   ; base64url
scopesval  = 1*scope *( "," scope )
scope      = "/" *( VCHAR )
polval     = 1*( VCHAR )
extval     = 1*( VCHAR )
sep        = *ws ";" *ws
ws         = WSP
```

### Required TXT Record Fields

- `did`: **MUST** be a valid DID identifier for the publisher
- `pk`: **MUST** be an Ed25519 public key in base64url format, prefixed with `ed25519:`
- `scopes`: **MUST** specify path patterns the publisher claims authority over
- `policy`: **SHOULD** specify adoption policy (e.g., `auto-adopt`, `manual-verify`)

### Service Discovery Records

Publishers and registries **SHOULD** provide service discovery via:

- `_spp._tcp` SRV records pointing to HTTPS endpoints
- HTTPS SVCB records for modern service discovery

### Well-Known Endpoints

Publishers **MUST** expose `.well-known/spp.json` containing registry metadata that aligns with `/schemas/publisher.json`.

Registries **MUST** expose `.well-known/spp/registry.json` containing registry metadata.

## Data Model [Normative]

### DNS TXT Record Structure

The `_spp` TXT record **MUST** contain semicolon-separated key-value pairs:

```
did=<DID_identifier>; pk=ed25519:<base64url_pubkey>; scopes=<path_patterns>; policy=<adoption_policy>
```

### Well-Known Publisher Endpoint

The `.well-known/spp.json` **MUST** conform to `/schemas/publisher.json` with these required fields:

- `protocolVersion`: Protocol version string
- `publisher.did`: **MUST** match the DID in DNS TXT record
- `publisher.publicKeyJwk`: **MUST** contain Ed25519 key matching `pk` field in TXT record
- `endpoints.sitemap`: Publisher's content sitemap
- `endpoints.content`: Base URL for content retrieval

### Well-Known Registry Endpoint

The `.well-known/spp/registry.json` **MUST** contain:

```json
{
  "protocolVersion": "1.0",
  "registry": {
    "name": "Registry Name",
    "operator": "Registry Operator",
    "endpoints": {
      "api": "https://registry.example.com/v1",
      "harvest": "https://registry.example.com/v1/harvest",
      "transparency_log": "https://registry.example.com/ct"
    }
  }
}
```

## Security & Integrity [Normative]

### Verification Order

Consumers **MUST** verify publisher identity using the following precedence order:

1. **DNSSEC + HTTPS**: If DNSSEC validation succeeds and HTTPS well-known is available and valid
2. **HTTPS only**: If DNSSEC fails but HTTPS well-known is available and valid  
3. **TXT-only**: If HTTPS well-known is unavailable, use DNS TXT record only

### Cryptographic Requirements

- All Ed25519 public keys **MUST** be encoded as base64url without padding
- DID identifiers **MUST** be resolvable to the same Ed25519 public key
- Publishers **MUST** sign content using the private key corresponding to the published public key

### Security Considerations

- DNS TXT records **SHOULD** have TTL ≤ 3600 seconds to enable timely key rotation
- DNS TXT records **SHOULD** be kept ≤ 512 octets for UDP compatibility (use split strings if needed per RFC 7208)
- DNSSEC **SHOULD** be enabled when available for enhanced security
- Publishers **MUST** update both DNS and well-known endpoints when rotating keys

## Examples [Normative]

### BIND Zone File Example

```dns
; SPP DNS records for example.com
_spp.example.com. 3600 IN TXT "did=did:key:z6MkABC123...; pk=ed25519:Kf-1QwEr...; scopes=/,/news/*,/blog/*; policy=auto-adopt"
_spp._tcp.example.com. 3600 IN SRV 0 0 443 example.com.
example.com. 3600 IN HTTPS 1 . alpn="h2,h3"
```

### Route53 Example (AWS CLI)

```bash
# Create the TXT record
aws route53 change-resource-record-sets --hosted-zone-id Z123456789 --change-batch '{
  "Changes": [{
    "Action": "CREATE",
    "ResourceRecordSet": {
      "Name": "_spp.example.com",
      "Type": "TXT",
      "TTL": 3600,
      "ResourceRecords": [{"Value": "\"did=did:key:z6MkABC123...; pk=ed25519:Kf-1QwEr...; scopes=/,/news/*; policy=auto-adopt\""}]
    }
  }]
}'

# Create the SRV record
aws route53 change-resource-record-sets --hosted-zone-id Z123456789 --change-batch '{
  "Changes": [{
    "Action": "CREATE", 
    "ResourceRecordSet": {
      "Name": "_spp._tcp.example.com",
      "Type": "SRV",
      "TTL": 3600,
      "ResourceRecords": [{"Value": "0 0 443 example.com"}]
    }
  }]
}'
```

### Cloudflare API Example

```bash
# Add TXT record
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "TXT",
    "name": "_spp",
    "content": "did=did:key:z6MkABC123...; pk=ed25519:Kf-1QwEr...; scopes=/,/news/*; policy=auto-adopt",
    "ttl": 3600
  }'

# Add SRV record  
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "SRV",
    "name": "_spp._tcp",
    "data": {
      "service": "_spp",
      "proto": "_tcp", 
      "name": "example.com",
      "priority": 0,
      "weight": 0,
      "port": 443,
      "target": "example.com"
    },
    "ttl": 3600
  }'
```

### Registry DNS Example

```dns
; Registry discovery for registry.example.net
_spp.registry.example.net. 3600 IN TXT "did=did:key:z6MkREG456...; pk=ed25519:Rs-2TyUi...; scopes=*; policy=permissive"
_spp._tcp.registry.example.net. 3600 IN SRV 0 0 443 registry.example.net.
registry.example.net. 3600 IN HTTPS 1 . alpn="h2,h3"
```

### Well-Known Publisher Example

Example `.well-known/spp.json`:

```json
{
  "protocolVersion": "1.0",
  "publisher": {
    "name": "Example Publisher",
    "id": "publisher:example",
    "did": "did:key:z6MkABC123...",
    "uri": "https://example.com",
    "publicKeyJwk": {
      "kty": "OKP",
      "crv": "Ed25519", 
      "x": "Kf-1QwEr..."
    },
    "trustModel": "editorial-chain"
  },
  "endpoints": {
    "sitemap": "https://example.com/spp/sitemap.json",
    "content": "https://example.com/spp/content/",
    "registry": "https://registry.example.net/v1"
  },
  "policies": {
    "consent": "https://example.com/spp/consent-policy.json",
    "privacy": "https://example.com/privacy"
  }
}
```

### Well-Known Registry Example

Example `.well-known/spp/registry.json`:

```json
{
  "protocolVersion": "1.0",
  "registry": {
    "name": "Example SPP Registry",
    "operator": "Example Registry Corp",
    "did": "did:key:z6MkREG456...",
    "endpoints": {
      "api": "https://registry.example.net/v1",
      "harvest": "https://registry.example.net/v1/harvest", 
      "transparency_log": "https://registry.example.net/ct",
      "search": "https://registry.example.net/v1/search"
    },
    "policies": {
      "terms": "https://registry.example.net/terms",
      "privacy": "https://registry.example.net/privacy"
    },
    "federation": {
      "allowHarvesting": true,
      "syncPartners": ["https://partner.registry.net"]
    }
  }
}
```

## Compatibility & Versioning [Informative]

The DNS profile is designed to be forward-compatible:

- Unknown keys in TXT records **SHOULD** be ignored by consumers
- Additional fields in well-known endpoints **SHOULD** be preserved during processing
- Protocol version mismatches **SHOULD** be handled gracefully with appropriate fallbacks

## References [Informative]

- [SPP Registry Architecture](./architecture.md): Core registry specification
- [SPP Publisher Schema](/schemas/publisher.json): Publisher metadata format
- [SPP Registry Architecture](./architecture.md): Claims and adoption procedures
- [RFC 1035](https://tools.ietf.org/html/rfc1035): Domain Names - Implementation and Specification
- [RFC 2782](https://tools.ietf.org/html/rfc2782): DNS SRV Resource Records
- [RFC 9460](https://tools.ietf.org/html/rfc9460): Service Binding and Parameter Specification via the DNS
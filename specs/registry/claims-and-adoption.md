# Claims & Adoption (v1.0-draft)

## Purpose [Informative]

This specification defines how publishers claim namespaces and adopt artefacts within the Semantic Publishing Protocol (SPP) registry system. It establishes the provenance lifecycle from reconstructed content to authoritative publisher control, enabling decentralized verification of content ownership and authenticity without requiring centralized gatekeepers.

## Normative Requirements [Normative]

### Provenance States

All SPP artefacts **MUST** maintain one of the following provenance states in their lifecycle:

- **reconstructed**: Content captured from public sources without publisher verification
- **claimed**: Publisher has proven control over the source namespace
- **adopted**: Publisher has explicitly acknowledged ownership of specific artefacts  
- **authoritative**: Final state combining valid claim + adoption + ongoing verification

### State Transitions

Implementations **MUST** enforce the following state transition rules:

```
┌─────────────┐    DNS+Well-Known    ┌─────────┐    Publisher     ┌─────────┐    Ongoing      ┌──────────────┐
│reconstructed│ ──── Verification ──→│ claimed │ ─── Adoption ──→│ adopted │ ── Validation ──→│authoritative │
└─────────────┘                      └─────────┘                 └─────────┘                  └──────────────┘
      ↑                                   ↑                          ↑                             ↑
   (crawl/                            (prove                    (acknowledge                  (maintain
    capture)                           control)                  ownership)                    authority)

States:
• reconstructed: Content captured from public sources without publisher verification
• claimed: Publisher has proven control over source namespace via DNS+well-known verification  
• adopted: Publisher has explicitly acknowledged ownership of specific artefacts
• authoritative: Final state with valid claim + adoption + ongoing verification
```

Implementations **MUST NOT** allow backward state transitions except through revocation procedures.

### Claims Requirements

Publishers **MUST** provide cryptographic proof of namespace control through:

1. **DNS TXT verification**: `_spp` TXT records per [DNS Profile specification](./dns.md)
2. **HTTPS well-known verification**: `.well-known/spp.json` endpoint validation
3. **Platform-specific fallbacks**: Alternative verification methods for supported platforms

All claims **MUST** include digital signatures conforming to `/schemas/common/signature.json`.

### Adoption Requirements  

Publishers **MUST** explicitly adopt artefacts using one of these modes:

- **hash-based**: Direct acknowledgment of specific content hashes
- **manifest-based**: Bulk adoption via manifest URLs
- **auto-adopt**: Automated adoption with defined scope and grace period

All adoptions **MUST** include digital signatures conforming to `/schemas/common/signature.json`.

## Data Model [Normative]

### Claim Structure

Claims **MUST** conform to `/schemas/claim.json`:

```json
{
  "nonce": "<unique_string>",
  "namespace": "<publisher_namespace>", 
  "proof": {
    "method": "dns-txt|well-known|platform-relme",
    "record": "<verification_data>"
  },
  "signature": {
    "signer": "<did_identifier>",
    "sig": "<base64url_signature>"
  }
}
```

### Adoption Structure

Adoptions **MUST** conform to `/schemas/adoption.json`:

```json
{
  "artefact_hashes": ["sha256:..."],
  "manifest_url": "https://...",
  "signature": {
    "signer": "<did_identifier>",
    "sig": "<base64url_signature>"
  }
}
```

### Publisher Metadata

Publishers **MUST** expose metadata conforming to `/schemas/publisher.json` via `.well-known/spp.json`.

## Security & Integrity [Normative]

### Verification Order

Implementations **MUST** verify publisher claims using the precedence order defined in the [DNS Profile specification](./dns.md):

1. **DNSSEC + HTTPS**: If DNSSEC validation succeeds and HTTPS well-known is available and valid
2. **HTTPS only**: If DNSSEC fails but HTTPS well-known is available and valid
3. **TXT-only**: If HTTPS well-known is unavailable, use DNS TXT record only

### Signature Requirements

All claims and adoptions **MUST** include:

- **Algorithm**: Ed25519 digital signatures
- **Signer**: DID identifier per `/schemas/common/did.json`  
- **Signature**: Base64url-encoded signature per `/schemas/common/signature.json`

### Key Management

Publishers **MUST**:
- Rotate keys with TTL ≤ 3600 seconds for DNS records
- Update both DNS and well-known endpoints when rotating keys
- Maintain signature verification chains during key rotation

## Adoption Modes [Normative]

### Hash-Based Adoption

Publishers **MAY** adopt specific artefacts by content hash:

```json
{
  "artefact_hashes": [
    "sha256:a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3"
  ],
  "signature": {
    "signer": "did:key:z6MkHaDGvcFU3qhk2hZwJC6KBN6RKpJtmvAyDFMdBQzewrpe",
    "sig": "base64url-encoded-signature"
  }
}
```

### Manifest-Based Adoption

Publishers **MAY** adopt multiple artefacts via manifest URL:

```json
{
  "manifest_url": "https://example.com/spp/adoption-manifest.json",
  "signature": {
    "signer": "did:key:z6MkHaDGvcFU3qhk2hZwJC6KBN6RKpJtmvAyDFMdBQzewrpe", 
    "sig": "base64url-encoded-signature"
  }
}
```

The manifest **MUST** contain a JSON array of content hashes:

```json
{
  "artefacts": [
    "sha256:a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
    "sha256:b694a542120422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae9"
  ],
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Auto-Adopt Mode

Publishers **MAY** configure automatic adoption within defined scopes:

**DNS TXT Configuration:**
```
_spp.example.com. TXT "did=did:key:z6Mk...; pk=ed25519:...; scopes=/,/news/*; policy=auto-adopt"
```

**Grace Period:** Publishers **MUST** specify a grace period (default 7 days) during which auto-adoption can be revoked.

**Scope Patterns:** Publishers **MUST** define URL patterns for auto-adoption using glob syntax.

## Conflict Resolution [Normative]

### Competing Claims

When multiple publishers claim the same namespace:

1. **DNS Authority**: Publisher with valid DNSSEC chain takes precedence
2. **Timestamp Priority**: Earlier valid claim takes precedence if DNS is unavailable
3. **Revocation**: Claims **MAY** be revoked by publishing new DNS records

### Grace Periods

- **New Claims**: 24-48 hour grace period for challenges
- **Auto-Adoption**: 7-day default grace period for revocation
- **Key Rotation**: 24-hour overlap period for signature verification

### Revocation Process

Publishers **MAY** revoke claims or adoptions by:

1. **DNS Update**: Remove or replace `_spp` TXT records
2. **Well-Known Update**: Update `.well-known/spp.json` with revocation
3. **Registry Notification**: Submit revocation request to registry

## Examples [Normative]

### Example 1: DNS TXT Claim

**DNS Record:**
```
_spp.example.com. 3600 IN TXT "did=did:key:z6MkHaDGvcFU3qhk2hZwJC6KBN6RKpJtmvAyDFMdBQzewrpe; pk=ed25519:11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo; scopes=/,/news/*; policy=manual-verify"
```

**Claim Submission:**
```json
{
  "nonce": "claim-nonce-2024-001",
  "namespace": "publisher:example.com",
  "proof": {
    "method": "dns-txt", 
    "record": "_spp.example.com IN TXT \"did=did:key:z6MkHaDGvcFU3qhk2hZwJC6KBN6RKpJtmvAyDFMdBQzewrpe; pk=ed25519:11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo; scopes=/,/news/*; policy=manual-verify\""
  },
  "signature": {
    "signer": "did:key:z6MkHaDGvcFU3qhk2hZwJC6KBN6RKpJtmvAyDFMdBQzewrpe",
    "sig": "base64url-placeholder-signature"
  }
}
```

### Example 2: Hash-Based Adoption

```json
{
  "artefact_hashes": [
    "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  ],
  "signature": {
    "signer": "did:key:z6MkHaDGvcFU3qhk2hZwJC6KBN6RKpJtmvAyDFMdBQzewrpe",
    "sig": "base64url-placeholder-adoption-signature"
  }
}
```

### Example 3: Well-Known Publisher Metadata

**File:** `.well-known/spp.json`
```json
{
  "protocolVersion": "1.0",
  "publisher": {
    "name": "Example News Publisher",
    "id": "publisher:example.com",
    "did": "did:key:z6MkHaDGvcFU3qhk2hZwJC6KBN6RKpJtmvAyDFMdBQzewrpe",
    "uri": "https://example.com",
    "publicKeyJwk": {
      "kty": "OKP",
      "crv": "Ed25519",
      "x": "11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo"
    },
    "trustModel": "editorial-chain"
  },
  "endpoints": {
    "sitemap": "https://example.com/spp/sitemap.json",
    "content": "https://example.com/spp/content/",
    "registry": "https://registry.example.net/v1"
  },
  "policies": {
    "adoption": "manual-verify",
    "autoAdoptGracePeriod": "7d"
  }
}
```

### Example 4: Manifest-Based Adoption

```json
{
  "manifest_url": "https://example.com/spp/adoption-manifest.json",
  "signature": {
    "signer": "did:key:z6MkHaDGvcFU3qhk2hZwJC6KBN6RKpJtmvAyDFMdBQzewrpe",
    "sig": "base64url-placeholder-manifest-signature"
  }
}
```

### Example 5: Conflict Resolution Scenario

**Scenario:** Two publishers claim `news.example.com`

**Publisher A (Valid DNSSEC):**
- DNS: `_spp.news.example.com` with DNSSEC validation ✓
- Timestamp: 2024-01-15T10:00:00Z

**Publisher B (HTTPS only):**  
- DNS: `_spp.news.example.com` without DNSSEC ✗
- HTTPS: `.well-known/spp.json` valid ✓
- Timestamp: 2024-01-15T09:00:00Z

**Resolution:** Publisher A takes precedence due to valid DNSSEC chain, despite later timestamp.

## Compatibility & Versioning [Informative]

The Claims & Adoption specification maintains forward compatibility through:

- **Schema Evolution**: Additional fields in schemas are ignored by v1 implementations
- **Method Extensions**: New verification methods can be added without breaking existing flows
- **Grace Period Adjustments**: Default grace periods may be adjusted based on operational experience

Extensions and experimental features **SHOULD** be prefixed with vendor namespaces to avoid conflicts.

## References [Informative]

- [SPP Registry Brief](../../design/registry/brief.md): Core definitions and requirements
- [DNS Profile Specification](./dns.md): DNS-based discovery and verification procedures  
- [Publisher Schema](/schemas/publisher.json): Publisher metadata format
- [Claim Schema](/schemas/claim.json): Claim data structure
- [Adoption Schema](/schemas/adoption.json): Adoption data structure
- [Ownership Schema](/schemas/ownership.json): Optional ownership records
- [Semantic Schema](/schemas/semantic.json): Artefact provenance states
- [Signature Schema](/schemas/common/signature.json): Digital signature format
- [DID Schema](/schemas/common/did.json): Decentralized identifier format
- [RFC 2119](https://tools.ietf.org/html/rfc2119): Key words for use in RFCs to Indicate Requirement Levels
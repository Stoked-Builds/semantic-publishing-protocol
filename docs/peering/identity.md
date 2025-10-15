# Registry Identity & Key Proof (v0.4)

This document defines how registries prove their identity and bind public keys.

## 1. Registry ID

- Every registry has a `registry_id` which MUST be a valid domain name.

## 2. Proof of Control

Registries MUST prove control of their domain by one of:

- DNS TXT record:  
  ```
  spp-key=<public-key-fingerprint>
  ```
  Example:  
  ```
  _spp._tcp.example.org. 300 IN TXT "spp-key=ed25519:7b9f...c2a1"
  ```
- HTTPS well-known file:  
  ```
  https://<registry-domain>/.well-known/spp/key.json
  ```
  Example JSON:  
  ```
  {
    "registry_id": "example.org",
    "public_keys": [
      {"kty":"OKP","crv":"Ed25519","x":"base64url-...","kid":"ed25519-2025-09"}
    ]
  }
  ```

## 3. Public Keys

- Registries MUST expose a JWKS at:
  ```
  https://<registry-domain>/.well-known/spp/jwks.json
  ```
- Keys MUST remain valid for ≥7 days after rotation.
- Excessive key rotations reduce trust.

Example JWKS:  
```
{
  "keys": [
    {"kty":"OKP","crv":"Ed25519","x":"base64url-...","kid":"ed25519-2025-09"}
  ]
}
```

## 4. Key Rotation

- Registries SHOULD rotate keys periodically (90–180 days).
- MUST support overlapping validity during rotation.

## 5. Rationale

Domain binding ensures Sybil resistance and prevents impersonation.

## 6. Caching & TLS

- `/.well-known/spp/*` SHOULD set `Cache-Control: max-age=300`.
- Endpoints MUST be served over HTTPS with HSTS enabled.
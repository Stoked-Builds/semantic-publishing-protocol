# SPP Registry — Brief (Source of Truth)

## Problem
Agents need a trustworthy index of web content (SPP artifacts). Publishers must be able to claim namespaces and adopt reconstructed items so they become authoritative. Registries must be discoverable, verifiable, and interoperable without a central gatekeeper.

## Goals (v1, MUST)
- HTTP/DNS-native registry (no blockchain).
- Store and serve SPP artifacts with provenance states: reconstructed → claimed → adopted → authoritative.
- Let publishers prove control of a domain/channel and adopt artifacts.
- Expose search + harvest APIs for other registries/indexers.
- Provide a transparency log (CT-style Merkle tree) with signed tree heads and inclusion proofs.

## Non-goals (v1, MUST NOT)
- No on-chain anchoring, tokens, or NFTs.
- No mandatory P2P/gossip. (Optional later for payloads.)
- No private content crawling or paywall bypass.

## Core Objects (glossary)
- **Artifact**: SPP content object + metadata + provenance.
- **Publisher**: DID + keys + namespaces + adoption policy.
- **Claim**: Proof a publisher controls a namespace (DNS + well-known).
- **Adoption**: Publisher acknowledges an artifact (by content hash/manifest).
- **Transparency Log**: Append-only Merkle log of artifact events.
- **Ownership**: (Optional) off-chain record linking rights to an artifact hash.

## Required APIs (surface only)
- Search/Read: `GET /v1/artifacts`, `GET /v1/artifacts/{id}`
- Ingest: `POST /v1/artifacts`
- Claims: `POST /v1/claims`
- Adoption: `POST /v1/adoptions`
- Harvest: `GET /v1/harvest/ListIdentifiers`, `GET /v1/harvest/ListRecords`, `GET /v1/harvest/GetRecord`
- Transparency: `GET /ct/sth`, `GET /ct/proof`
- Ownership (optional, feature-flag): `GET/POST /v1/ownership`

## Discovery (MUST)
- DNS `_spp` TXT + SRV/SVCB (or HTTPS) to find registries.
- `.well-known/spp.json` (publisher) and `.well-known/spp/registry.json` (registry).

## Security (MUST)
- Ed25519 signatures for artifacts and Signed Tree Heads.
- DNSSEC preferred when available; HTTPS well-known is authoritative.
- Rate limits, robots.txt politeness; store URLs for third-party media (no hotlink scraping beyond metadata).

## Acceptance Criteria
- Schemas compile (Draft 2020-12) and examples validate.
- OpenAPI stub exists and references schemas.
- Spec docs use RFC2119 and align with this brief.
- No blockchain or P2P text in v1 specs (only reserved hooks).
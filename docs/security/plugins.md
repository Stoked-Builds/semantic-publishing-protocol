# Plugin & Adapter Security (v0.4)

This document specifies mandatory security requirements for adapter plugins in the Semantic Publishing Protocol (SPP).

## 1. Isolation

- **MUST** run in isolated containers or sandboxes.
- **MUST NOT** run with root privileges.
- **MUST** use a read-only filesystem with an ephemeral `/tmp`.
- **MUST** apply CPU, memory, and execution time limits.
- **SHOULD** enforce seccomp/AppArmor (or equivalent) and drop all Linux capabilities.

## 2. Egress Control

- Plugins **MUST declare** required outbound domains in their manifest (`networkDomains`).
- Registries **MUST enforce** an egress proxy that blocks all other outbound connections.
- Prevents data exfiltration, spam, and SSRF.

## 3. Secrets & Credentials

- Plugins **MUST NOT** be given direct database or object store credentials.
- Only limited scoped API tokens may be provided, if necessary.
- Central ingest service is responsible for fetching, deduplication, and scanning.

## 4. Output Requirements

- Plugins emit only `ArtifactDraft` objects.
- No direct writes to registry storage or databases.
- All outputs MUST conform to Artifact schema before ingestion.

## 5. Adapter Manifest (MUST)

Adapters MUST declare:
- `id`, `version`, `sdk`
- `networkDomains`: explicit egress allowlist
- `needsSecrets`: names of required secrets
- `permissions`: minimal capabilities requested

## 6. Observability & Failure

- **MUST** emit health/metrics (jobs, errors, CPU/mem).
- **MUST** fail-fast on schema violations and return no output.
- **MAY** include structured logs; secrets must be redacted.

## 7. Rationale

Treat plugins as **untrusted code**. Isolation, allowlists, and least privilege protect against:
- Remote code execution
- Lateral movement inside registries
- Credential theft
- Resource abuse
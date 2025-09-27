# Security Model – Semantic Publishing Protocol (SPP)

## 1. Security Principles

- **Data Integrity**: All artifacts must be cryptographically signed to ensure authenticity and prevent tampering.
- **Provenance Transparency**: Each artifact includes detailed provenance metadata to trace its origin and transformations.
- **Minimal Trust**: Trust assumptions are minimized by requiring verifiable signatures and consistent registry behavior.
- **Immutable Records**: Once published, artifacts should not be altered; updates result in new versions.

## 2. Threat Model

- **Malicious Adapters**: Adapters may produce incorrect or malicious artifacts.
- **Compromised Registries**: Registries might be compromised and serve tampered data.
- **Replay Attacks**: Old artifacts could be replayed to mislead consumers.
- **Sybil Attacks**: Malicious entities might create multiple identities to subvert trust.

## 3. Best Practices

- **Signature Verification**: Consumers must verify signatures against known trusted keys.
- **Provenance Checks**: Validate provenance fields for consistency and freshness.
- **Versioning**: Always prefer the latest valid version of an artifact.
- **Audit Trails**: Maintain logs of artifact ingestion and modification.

## 4. Future Considerations

- **Decentralized Trust Networks**: Explore webs of trust and decentralized identifiers.
- **Enhanced Privacy Controls**: Support selective disclosure and encrypted content.
- **Automated Trust Scoring**: Develop algorithms to score artifact and registry trustworthiness.
- **Plugin Sandboxing**: Improve isolation and monitoring of adapters/plugins.

## 5. Plugin/Adapter Isolation (v0.4)

To enhance the security posture of the SPP ecosystem, all plugins and adapters MUST be deployed in isolated container environments. This isolation ensures that compromise or malfunction of one component does not cascade through the system.

- **Mandatory Containerisation**: Each plugin/adapter runs within its own container with strict resource limits.
- **Egress Allowlist**: Network egress from containers is restricted to a predefined allowlist, preventing unauthorized data exfiltration.
- **No Direct DB/Object-store Credentials**: Plugins/adapters are prohibited from holding direct credentials to databases or object stores; all data access must be mediated through secure APIs.
- **Rationale**: Containerisation and strict network policies reduce attack surfaces, limit lateral movement, and enforce principle of least privilege.

## 6. Peering Guardrails (v0.4)

To maintain the integrity and reliability of data exchanged between registries, the following inbound validation and trust mechanisms are mandated:

- **Inbound Validation (MUST)**: Registries MUST validate all incoming artifacts for schema compliance, signature correctness, and provenance completeness before acceptance.
- **Signature Requirements (MUST)**: All inbound artifacts require at least one valid signature from a trusted origin registry.
- **Trust Scoring (MUST)**: Registries MUST implement trust scoring for peers based on historical behavior, signature validity, and corroboration.
- **Corroboration Requirements (MUST)**: Artifacts from peers below the immediate-accept threshold MUST be corroborated by multiple independent trusted sources (per peering spec) before re-share.
- **Rationale**: These guardrails ensure only trustworthy data propagates through the network, preserving overall ecosystem integrity.
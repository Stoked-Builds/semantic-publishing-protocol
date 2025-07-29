---
Title: SPS Compliance Levels
Purpose: Defines the levels and rules for compliance with the Semantic Publishing Specification (SPS), including requirements for documents, tools, and services.
Related: [Semantic Publishing Specification](sps/semantic-publishing-specification.md)
---

# SPS Compliance Levels

> This document defines what it means for a document, implementation, or tool to be SPS-compliant. It establishes three conformance levels, each with specific requirements and guarantees for interoperability, data quality, and protocol alignment.

---

[See the main Semantic Publishing Specification for core data models and protocol structure.](sps/semantic-publishing-specification.md)

# SPS Compliance Levels

---

**Version:** 0.2  
**Status:** Production-Ready  
**Date:** 2025-07-28  
**Codename:** SPS-Compliance

---

This document defines what it means for a document, implementation, or tool to be SPS-compliant. It establishes three conformance levels, each with specific requirements and guarantees for interoperability, data quality, and protocol alignment.

---

## What is SPS Compliance?

SPS compliance ensures that published content, tools, and services:
- Use the core entities and data structures defined in [SPS-Core](./SPS-Core.md)
- Adhere to field naming, typing, and referencing conventions
- Support provenance, attribution, and auditability
- Enable interoperability with other SPP-compliant systems

---

## Conformance Levels

| Level | Name                | Description & Guarantees                                                                 |
|-------|---------------------|---------------------------------------------------------------------------------------|
| 1     | Minimal Compliance  | - Uses required core entities (Document, Claim, Entity)                                |
|       |                     | - All required fields present and correctly typed                                      |
|       |                     | - Unique IDs for all top-level objects                                                 |
|       |                     | - No guarantees for amendments, signatures, or full audit trail                        |
| 2     | Standard Compliance | - Meets all Minimal requirements                                                       |
|       |                     | - Includes Timeline and Reference entities                                             |
|       |                     | - All Claims and Amendments are signed                                                 |
|       |                     | - Provides at least one digital signature per Document                                 |
|       |                     | - Maintains a basic audit trail (Timeline)                                             |
| 3     | Full Compliance     | - Meets all Standard requirements                                                      |
|       |                     | - Implements Amendments for all changes                                                |
|       |                     | - All entities, claims, amendments, and signatures are cross-referenced and auditable  |
|       |                     | - Supports cryptographic verification of all signatures                                |
|       |                     | - Provides complete provenance and change history                                      |

---

## Compliance Rules & Guarantees

- **Field Naming:** All fields must use `snake_case` as per SPS conventions.
- **Unique Identifiers:** All entities, documents, claims, amendments, and signatures must have globally unique IDs.
- **Referencing:** All cross-entity references must use the correct ID format and be resolvable within the dataset or registry.
- **Signatures:** At Standard and Full levels, digital signatures must be verifiable using the declared algorithm.
- **Auditability:** At Full level, a complete timeline and amendment history must be available for every document.
- **Extensibility:** Custom fields and extensions are allowed, but must not break core compliance or referencing rules.

---

## How to Claim Compliance

- **Documents:** Declare the conformance level in the document metadata (e.g., `"sps_compliance_level": 2`).
- **Tools/Services:** Document which conformance level(s) are supported and provide test vectors or validation results.
- **Validation:** Use the [SPP Validator Tool](../tools/spp-validator.md) (planned) to check compliance.

---

_See also: [SPS-Core](./SPS-Core.md), [Semantic Publishing Specification](sps/semantic-publishing-specification.md), [SPP Validator Tool](../tools/spp-validator.md)_

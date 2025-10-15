# SPP Versioning – Semantic Publishing Protocol (SPP-Versions)

**Version:** 0.4  
**Status:** Production-Ready  
**Date:** 2025-09-27  
**Codename:** SPP-Versions

---

This document defines the versioning policy for the Semantic Publishing Protocol (SPP). It covers semantic versioning rules, change classifications, and compatibility guarantees for documents, tools, and implementers.

---

## Semantic Versioning Principles

SPP uses [Semantic Versioning](https://semver.org/) in the format:

    MAJOR.MINOR.PATCH

- **MAJOR**: Incompatible or breaking changes to the spec or data structures.
- **MINOR**: Backward-compatible feature additions, clarifications, or non-breaking changes.
- **PATCH**: Backward-compatible bug fixes, documentation updates, or editorial corrections.

**Example:**
- `v0.1.0` – Initial public draft
- `v0.4.0` – Adds provenance, mandatory signatures, peering corroboration, plugin isolation
- `v1.0.0` – First stable release, may include breaking changes

---

## Change Classifications

| Change Type         | Description                                                      | Version Bump |
|--------------------|------------------------------------------------------------------|--------------|
| Breaking           | Removes or renames fields, changes required types, alters core entity structure, or changes compliance rules in a way that breaks existing processors | MAJOR        |
| Non-Breaking       | Adds optional fields, clarifies documentation, improves examples, or adds new entities/extensions that do not affect existing processors           | MINOR        |
| Editorial/Bugfix   | Fixes typos, clarifies language, corrects non-normative examples | PATCH        |

---

## Compatibility Matrix

| SPS Document Version | Can be read by v0.1 Processor | Can be read by v0.4 Processor | Can be read by v1.0 Processor |
|---------------------|-------------------------------|-------------------------------|-------------------------------|
| v0.1                | Yes                           | Yes                           | Yes (if v1.0 is backward compatible) |
| v0.4                | No (if new required fields)   | Yes                           | Yes (if v1.0 is backward compatible) |
| v1.0                | No (if breaking changes)       | No (if breaking changes)       | Yes                           |

- **Backward Compatibility:** Minor and patch releases are always backward compatible. Major releases may break compatibility.
- **Forward Compatibility:** Processors should ignore unknown fields and extensions, but must fail gracefully if required fields are missing or changed.

---

## Handling Breaking Changes

- Breaking changes are only introduced in MAJOR version bumps (e.g., v0.x → v1.0).
- All breaking changes are documented in the [Changelog](../docs/changelog.md) and migration guides.
- Deprecated fields or structures will be supported for at least one MINOR version before removal.

---

## Version Declaration

- Every SPS document must declare its compliance version in the frontmatter (e.g., `spp_compliance_level: 2` and `spp_version: 0.4`).
- Tools and processors must check the declared version and handle unsupported versions gracefully.

---

_See also: [SPP-Compliance](./SPP-Compliance.md), [Changelog](../docs/changelog.md)_

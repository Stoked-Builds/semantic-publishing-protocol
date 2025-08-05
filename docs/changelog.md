# Changelog – Semantic Publishing Protocol (SPP)

This changelog documents major changes, improvements, and fixes between protocol versions. For full details, see the [spec-index](./spec-index.md).

---

## [v0.2.2] – 2025-08-05

### Highlights
- 📦 Stable release of v0.2.x branch
- 🔧 Restructured and modularised all specs under `specs/`
- 🧪 Rich example set added in `/examples`, covering:
  - Stories with semantic blocks
  - Semantic sitemaps
  - Consent tokens, review chains, endorsements
- ✅ Schema definitions and working validation examples in `/schema`
- 📚 Spec index and spec hierarchy added to aid navigation
- 🔄 Includes semantic-sitemap, semantic-blocks, consent-engine, agent-interface, and browser extensions

### Notes
- This release freezes the `v0.2.x` structure before we begin breaking changes in `v0.3`.
- All files are self-contained and ready for public publishing and downstream integration.

---

## v0.2 (2025-07-28)

### Major Improvements
- Added comprehensive [Glossary](./glossary.md) and [Spec Index](./spec-index.md) for easier navigation and onboarding.
- Standardized all metadata field naming to `snake_case` across JSON, tables, and prose.
- Added and standardized "Related Specs" sections to all specification files for improved cross-referencing.
- Clarified usage and referencing of `ssot://` and `blockRef` in all relevant specs.
- Strengthened documentation of token/payment connectivity and monetisation flows.
- Improved bidirectional linking and cross-domain references between agent, consent, ads, and payment specs.
- Added new files: `core/glossary.md`, `core/index.md`, `docs/glossary.md`, `docs/spec-index.md`.

### Minor Updates
- Enhanced examples and JSON schemas for clarity and completeness.
- Improved explanations of trust, consent, and agent behaviour models.
- Updated `.gitignore` for better platform compatibility.
- Fixed typos and formatting inconsistencies across multiple specs.

---

## v0.1 (2025-07-01)

- Initial public release of the Semantic Publishing Protocol (SPP) specifications.
- Defined core architecture, agent interface, consent engine, semantic blocks, ads, payments, and registry models.

---

_For a full map of the protocol, see the [Spec Index](./spec-index.md)._

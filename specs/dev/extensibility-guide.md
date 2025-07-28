
# Extensibility Guide

**File:** `specs/dev/extensibility-guide.md`  
**Status:** Draft v0.1  
**SPP Component:** Developer Framework / Futureproofing

---

## Purpose

Describe how developers can **extend the SPP ecosystem** through plugins, new agent types, token categories, or content modules — without breaking protocol interoperability.

---

## Extensible Components

### 1. Agent Types

Define new kinds of agents with special behaviors (e.g., `edu.agent`, `finance.agent`, `curation.agent`). Use the `agent-personality-profile.md` and `agent-rating.md` specs to describe traits.

### 2. Content Block Types

You can define new semantic block types (e.g., `podcast`, `museum-exhibit`, `event-series`) by:

- Submitting a new JSON schema
- Declaring compatibility with `semantic-blocks.md`
- Registering your block ID in the open registry

### 3. Payment Token Categories

New token types (e.g., region-specific, loyalty-driven, or pegged to carbon credits) can be added if they:

- Comply with `micro-payments.md` and `payment-adapter-contract.md`
- Are registered in `spp-token-registry.md` (future)

---

## Naming Conventions

- Use reverse domain notation for IDs (e.g. `dev.markstokes.token.trustworthy.v1`)
- Version your additions semantically
- Submit extensions to public extension registries

---

## Community Contribution Model

- A community extension board may be proposed
- Popular, stable extensions may graduate to official specs
- All extensions must be open-licensed and human-readable

---

## Related Specs

- `agent-interface/`
- `semantic-blocks.md`
- `payment-adapter-contract.md`

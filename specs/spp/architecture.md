# Semantic Publishing Protocol – Reference Architecture (v0.1)

## Purpose

This document outlines the conceptual architecture of the Semantic Publishing Protocol (SPP), describing the major components, their responsibilities, and how they interact to enable a decentralised, AI-native web experience.

---

## 1. Architectural Layers

```
+----------------------------------------------------------+
|                  User Interface Layer                    |
| - AI Browser                                             |
| - Agent Assistants                                       |
+----------------------------------------------------------+
|              Client & Agent Processing Layer             |
| - Local Memory + SSOT Cache                              |
| - Consent Engine                                         |
| - Trust Engine (Reputation, Provenance, Identity)        |
+----------------------------------------------------------+
|               Protocol & Standards Layer                 |
| - SPS Markup/Tags (Semantic Publishing Specification)    |
| - Agent Behaviour Contracts                              |
| - Attribution and Consent Metadata                       |
+----------------------------------------------------------+
|                  Registry Infrastructure                 |
| - Publisher Registries                                   |
| - Content Discovery Indexes                              |
| - Permission and Consent Records                         |
+----------------------------------------------------------+
|                  Storage and Content Layer               |
| - Local Indexed Cache                                    |
| - Distributed Content Networks (e.g. IPFS)               |
| - Linked Source References (HTML, JSON, RDF, etc.)       |
+----------------------------------------------------------+
```

---

## 2. Key Components

### AI Browser
The user's interface and primary query surface. Responsible for:
- Rendering dynamic multi-source views
- Respecting consent, identity, and attribution
- Performing context-aware querying and summarisation

### Consent Engine
Governed by user-defined rules and app-level policies. Ensures:
- Fine-grained data sharing controls
- Revocation and time-bounded grants
- Visibility into which entities accessed what and when

### Trust Engine
Calculates and maintains:
- Publisher and agent reputation
- Content authenticity and conflict resolution
- Source weighting in summarisation and AI view generation

### Registry & Discovery Layer
Federated or decentralised index of:
- Content entries and metadata
- Publisher signatures and hosting details
- Consent policy status per record

### SPS Markup Layer
Defines the structure of:
- Content blocks
- Metadata and tags
- Licencing, attribution, versioning, etc.

---

## 3. Communication Model

- Agents and browsers discover content via registered indices
- Agents may request access, submit consent receipts, or resolve identity
- Content can be queried and rendered dynamically, without requiring a static HTML page

---

## 4. Interoperability

The architecture supports interoperability with:
- Traditional web (via HTML meta extensions)
- Decentralised content (via IPFS, DID)
- Consent standards (e.g. GConsent, Solid pods)
- AI runtime layers (e.g. local models, LLM APIs)

---

## 5. Trust-Minimised by Design

- All components default to local-first operation
- Publishers do not gain insight into user profiles unless explicitly consented
- Attribution, consent, and usage contracts are cryptographically verifiable

---

## 6. Future Integration Targets

- Blockchain-based content licensing
- Micro-payments for ad and content revenue splits
- Decentralised identity issuance and revocation
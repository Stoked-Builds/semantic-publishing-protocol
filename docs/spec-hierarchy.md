# Specification Hierarchy – Semantic Publishing Protocol (SPP)

This document explains the structural relationship between the core specification (SPS), the overall protocol (SPP), and the major subdomains.

---

## Visual Hierarchy

```text
SPP (Semantic Publishing Protocol)
│
├── SPS (Semantic Publishing Specification)
│   ├── Core data models & compliance
│   └── Metadata, object types, and publishing format
│
├── Agents
│   ├── Agent interface
│   ├── Authentication
│   ├── Coordination & lifecycle
│   └── Personality & rating
│
├── Ads
│   ├── Ad auction engine
│   ├── Ranking & compliance
│   └── Token schema & intent-aligned ads
│
├── Publishing
│   ├── Semantic blocks
│   ├── Attribution & review chain
│   └── Publisher metadata & rating
│
├── Consent & Identity
│   ├── Consent engine
│   ├── Trust engine
│   └── SSOT ID & data delegation
│
└── Payments
    ├── Micro-payments
    ├── Payment adapter contract
    ├── Revenue split & commission
    └── SPP token roadmap
```

---

- **SPP** is the umbrella protocol, defining the overall architecture and interoperability.
- **SPS** is the core specification for content structure and publishing.
- **Subdomains** (agents, ads, publishing, consent, payments) provide specialized specs and modules for each area.

See the [Specification Index](spec-index.md) for links to all documents.

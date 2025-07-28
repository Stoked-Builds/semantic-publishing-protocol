# Agent Personality Profile Specification

**File:** `specs/agent-interface/agent-personality-profile.md`  
**Status:** Draft v0.1  
**SPP Component:** Agent Interface / Memory & Identity

---

## Overview

Agents in the Semantic Publishing Protocol (SPP) ecosystem are not stateless functions — they exhibit consistent behaviour across time, users, and domains.

This specification defines how agents expose, store, and evolve their **personality profiles**, enabling better trust, long-term user satisfaction, and transparent behaviour tuning.

---

## Core Components

| Field           | Description |
|----------------|-------------|
| **Tone**        | Preferred communication style (e.g., formal, humorous, empathetic) |
| **Bias Controls** | Explicit user-defined or developer-governed boundaries (e.g., neutrality, alignment with specific values) |
| **Long-Term Memory** | Persistent, structured knowledge of prior interactions and context |
| **Personality Traits** | Descriptors that define how the agent interacts (e.g., optimistic, cautious, assertive) |
| **Adjustability** | Whether and how the user can tune the above elements |
| **Auditability** | Logs or metadata showing when and how the profile has changed |

---

## Personality Profile Format

```json
{
  "agent_id": "agent://get-stoked",
  "tone": "conversational",
  "traits": ["curious", "motivational"],
  "bias_control": {
    "political": "neutral",
    "brand_preference": "none",
    "custom_rules": [
      "Do not promote products I already own",
      "Favour open-source alternatives"
    ]
  },
  "memory_enabled": true,
  "memory_scope": ["user:markstokes", "session:adhd-system"],
  "adjustable_by_user": true,
  "last_modified": "2025-07-28T22:50:00Z"
}
```

---

## User Controls

Users may:
- View current personality settings
- Adjust tone, preferences, and allowable memory scope
- Freeze or reset agent profile
- Enforce hard boundaries via their Consent Engine settings

Agents must **honour consent-first access** to long-term memory or emotional state modelling.

---

## Developer Controls

Developers may:
- Define **default tone and personality**
- Limit which attributes are mutable
- Register **personality templates** to the Agent Registry

---

## Trust and Transparency

- Agents must disclose major personality shifts
- Memory logs must be queryable by the user
- All updates logged in the agent audit trail

---

## Use Cases

- A user sets a "gentle tone" assistant for health tasks, but a "blunt and efficient" one for dev projects
- The ADHD system's agent remembers past frustrations and adapts accordingly
- A child-safe agent restricts humour, sarcasm, and political alignment entirely

---

## Future Extensions

| Phase | Feature                              | Status     |
|-------|--------------------------------------|------------|
| 0.1   | Basic profile spec                    | ✅ Drafted |
| 0.2   | Memory graph linking between agents   | 🔲 Planned |
| 0.3   | Agent personality marketplace         | 🔲 Planned |


---

## Related Specs

- [`agent-authentication.md`](./agent-authentication.md)
- [`agent-rating.md`](./agent-rating.md)
- [`agent-lifecycle.md`](./agent-lifecycle.md)
- [`trust-engine.md`](../consent-engine/trust-engine.md)
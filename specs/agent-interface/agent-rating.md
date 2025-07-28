
# Agent Rating Specification

**File:** `specs/agent-interface/agent-rating.md`  
**Status:** Draft v0.1  
**SPP Component:** Agent Interface / Trust Engine

---

## Overview

The Agent Rating system enables users to provide **structured feedback** on agents they interact with. Ratings inform trust calculations, discovery rankings, and consent decisions.

Agents are not black boxes — users deserve to know which are helpful, respectful, and privacy-aligned.

---

## Core Concepts

| Term         | Description |
|--------------|-------------|
| **Agent**     | A browser-integrated or remote AI service performing actions on behalf of the user |
| **Rating**    | A user-submitted score based on one or more dimensions |
| **Trust Score** | Aggregated signal combining user ratings, behavioural audits, and performance metrics |
| **Registry**  | Maintains verified agent identities and public trust scores |

---

## Rating Fields

Users can rate agents using the following **standardised dimensions**:

| Field             | Type     | Description |
|------------------|----------|-------------|
| `helpfulness`     | integer  | 1–5 score on usefulness of output |
| `respect`         | integer  | 1–5 score on respecting user preferences / boundaries |
| `accuracy`        | integer  | 1–5 score on factual quality |
| `speed`           | integer  | 1–5 score on responsiveness |
| `alignment`       | integer  | 1–5 score on value and goal alignment |
| `comment`         | string   | Optional freeform feedback |
| `timestamp`       | datetime | UTC ISO 8601 |

---

## Rating Submission

Ratings are submitted by the user via:
- Consent dashboards
- Agent action feedback prompts (e.g. “Was this helpful?”)
- Periodic reviews of frequently used agents

All ratings are **local by default**, but users may opt-in to contribute to a **global reputation ledger**.

---

## Trust Calculation

Each agent has a calculated **Trust Score** composed of:

- 🧠 Weighted average of rating fields
- 📜 Consent violations or audit flags (negative weight)
- 📈 Usage + engagement metrics (neutral-to-positive weight)
- ✅ Identity verification level

Trust Scores are used by:

- Agent discovery/search results
- Consent suggestions (“You’ve rated this agent low before”)
- Behavioural audit triggers

---

## Rating Storage Format


```json
{
  "agent_id": "agent://get-stoked",
  "ssot_id": "ssot:markstokes",
  "helpfulness": 5,
  "respect": 4,
  "accuracy": 5,
  "speed": 4,
  "alignment": 5,
  "comment": "Nailed my SEO post in seconds.",
  "timestamp": "2025-07-28T22:30:00Z"
}
```

> _"SSOT URI structure is defined in [`ssot-id.md`](../identity/ssot-id.md)."_

---

## Rating Integrity

- One rating per user per agent per 24h
- Ratings signed by user device
- Optional pseudonymous mode (via ZK or privacy tokens)
- Agents may request feedback, but **cannot modify or hide** scores

---

## Example Use Cases

- Hide low-rated agents from auto-suggestions
- Boost community-verified agents in search/discovery
- Alert users if a new agent has no rating history or trust score

---

## Future Extensions

| Phase | Feature                              | Status     |
|-------|--------------------------------------|------------|
| 0.1   | Manual ratings                        | ✅ Drafted |
| 0.2   | Trust score propagation to registry   | 🔲 Planned |
| 0.3   | ZK or anonymous contribution methods  | 🔲 Planned |

---


## Related Specs

- [`trust-engine.md`](../consent-engine/trust-engine.md)
- [`agent-authentication.md`](./agent-authentication.md)
- [`consent-engine/data-delegation.md`](../consent-engine/data-delegation.md)
- [`semantic-blocks.md`](../publishing/semantic-blocks.md)
- [`micro-payments.md`](../payments/micro-payments.md)
- [`payment-adapter-contract.md`](../payments/payment-adapter-contract.md)

**Back-link:**
- [`intent-aligned-ads.md`](../ads/intent-aligned-ads.md)

> _"Agent ratings may influence trust scores, payment eligibility, and agent discovery. See related specs for integration details."_

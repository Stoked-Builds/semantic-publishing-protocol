# Trust Engine – Specification v0.1

## Purpose

The Trust Engine (TE) is the scoring and verification system that underpins confidence in content, agents, and advertisers in the Semantic Publishing Protocol (SPP). It acts as a trust fabric for decentralised interaction, enabling safe, user-respecting experiences without traditional centralised gatekeepers.

---

## Entities Rated

1. **Agents**
   - Query resolvers, browsers, content assemblers
2. **Content Sources**
   - Domain, origin, publisher metadata
3. **Advertisers**
   - Based on delivery, complaint rate, click fraud, consent violations
4. **Tokens**
   - Ad tokens, content blocks, registry entries

---

## Trust Inputs

### ✅ Verified Signals
- Linked public identity or organisation (e.g. DID, DNS, ENS)
- Signed assertions from known registries
- Third-party verifications (e.g. trust registrars)

### 📊 Behavioural Metrics
- Historical accuracy, freshness, usefulness
- Complaint or flag rate
- Deceptive/low-signal content penalty
- Engagement quality (long dwell time, low bounce)

### 🧠 Agent Score Aggregates
- How often this entity is *chosen* over others
- How *helpful* its outputs were rated by users

---

## Trust Score

The Trust Score is calculated using a weighted hybrid of:

```
TrustScore = VerifiedWeight * VerifiedScore +
             BehaviourWeight * BehaviourScore +
             EngagementWeight * UXSignal +
             PeerWeight * AgentConsensusScore
```

Each weighting is configurable and can be adapted by user or agent.

---

## Auditability

- All trust evaluations are locally cached and explainable
- Each Trust Score includes an *audit trail* of:
  - Inputs used
  - Source of trust signals
  - Last updated timestamp

---

## Trust Trail Example

```json
{
  "entity": "agent:example-resolver",
  "trustScore": 0.86,
  "source": ["registry:trusted-agents"],
  "signals": {
    "verified": 0.9,
    "complaints": 0.02,
    "dwellTime": 0.78
  },
  "lastEvaluated": "2025-07-28T17:10:00Z"
}
```

---

## Sanctions & Decay

- Scores decay over time to ensure freshness
- Repeat bad actors flagged and blacklisted locally
- Registry-wide bans available (if decentralised consensus supports)

---

## Privacy & Consent

- No personal info sent upstream
- Trust trails stay local unless user opts into sharing
- Trust evaluation logic can be extended with user-chosen modules

---

## Related Files

- [`consent-engine.md`](./consent-engine.md)
- [`agent-rating.md`](./agent-rating.md)
- [`content-attribution.md`](./content-attribution.md)
- [`publisher-metadata.md`](./publisher-metadata.md)
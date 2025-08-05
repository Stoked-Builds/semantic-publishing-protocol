# Agent Behaviour Specification (v0.1)

## Purpose

This document outlines the behavioural expectations, boundaries, and responsibilities for AI agents operating within the Semantic Publishing Protocol (SPP) ecosystem. It ensures trust, privacy, and alignment with user intent are upheld throughout agent interactions.

---

## 1. Agent Identity

Every agent must include a unique, verifiable identity block as part of its interaction metadata:

```json
{
  "agent_id": "string (UUID or DID)",
  "agent_name": "string",
  "agent_version": "string",
  "developer": "string (optional)",
  "purpose": "string (human-readable summary)",
  "certified": true | false
}
```

Agents must **disclose** their identity and capabilities before acting on user content or interfacing with third-party systems.

---

## 2. Behavioural Boundaries

Agents must operate within strict, user-defined boundaries:

| Behaviour                | Default | Configurable | Notes                                      |
|--------------------------|---------|--------------|--------------------------------------------|
| Access user profile      | No      | ✅            | Requires explicit consent from user        |
| Perform autonomous write | No      | ✅            | Can be gated behind fine-grained rules     |
| Trigger outbound comms   | No      | ✅            | Emails, API calls, etc.                    |
| Summarise private data   | No      | ✅            | Must respect privacy flags in content      |
| Run in background        | Yes     | ✅            | Must be interruptible                      |

Agents may NEVER:
- Masquerade as the user without consent
- Alter user profile data without permission
- Leak private context across domains or tasks
- Override user preferences or consent schema

---

## 3. User Alignment

Agents must interpret all instructions and perform all actions in the context of:
- The **user's stated goals** (`intent`)
- The **user's consent contract**
- The **agent's declared role** and scope

All AI actions should be explainable post-hoc via audit logs.

---

## 4. Consent Enforcement

Agents must load and honour `consent-engine.md` policies before activating any optional behaviour.

Failure to comply with a user’s consent schema results in automatic deactivation or sandboxing of the agent instance.

---

## 5. Trust and Auditability

Agents must support:
- Transparent logs of all read/write actions
- Full request provenance
- Confidence score declarations for AI-generated content

Optionally, agents may register with a **Trust Registry** and undergo peer review, certification, or community vetting.

---

## 6. Special Flags

Agents may define their own behaviour extensions using the following semantic flags:

```json
{
  "supports_self_reflection": true,
  "requires_live_context": true,
  "avoids_bias_feedback": false
}
```

---

## 7. Decision Trees and Conflict Resolution

### 7.1 Conflict Resolution Walkthrough

When agents encounter conflicting trust signals or metadata, they must follow systematic decision trees to ensure consistent, explainable outcomes.

#### Example Scenario: Conflicting Trust Scores

Consider a semantic.json block with multiple trust signals:

```json
{
  "id": "content:climate-study-2025",
  "title": "New Climate Study Results",
  "author": {"id": "author:dr-smith", "trust_score": 0.85},
  "publisher": {"id": "publisher:science-daily", "trust_score": 0.72},
  "endorsements": [
    {
      "endorser": {"id": "endorser:climate-institute", "trust_score": 0.95},
      "verdict": "accurate",
      "confidence": 0.88
    },
    {
      "endorser": {"id": "endorser:fact-checker-x", "trust_score": 0.65},
      "verdict": "disputed",
      "confidence": 0.75
    }
  ],
  "trust_signals": {
    "domain_reputation": 0.80,
    "content_freshness": 0.90,
    "engagement_quality": 0.70
  }
}
```

**Agent Decision Tree:**

```
1. Collect all trust signals
   ├─ Author trust: 0.85
   ├─ Publisher trust: 0.72
   ├─ Domain reputation: 0.80
   └─ Endorsements: CONFLICTING

2. Handle endorsement conflicts
   ├─ High-trust endorser (0.95) says "accurate" (confidence: 0.88)
   ├─ Medium-trust endorser (0.65) says "disputed" (confidence: 0.75)
   └─ Apply weighted consensus:
       - Weight = endorser_trust × confidence
       - Accurate: 0.95 × 0.88 = 0.836
       - Disputed: 0.65 × 0.75 = 0.488
       - Result: "accurate" wins (0.836 > 0.488)

3. Calculate composite trust score
   ├─ Base signals average: (0.85 + 0.72 + 0.80 + 0.90 + 0.70) / 5 = 0.794
   ├─ Endorsement bonus: +0.05 (for positive consensus)
   └─ Final score: 0.844

4. Decision: ACCEPT content with high confidence
```

#### Agent Behavior Rules for Conflicts:

1. **Endorsement Conflicts**: Weight by `endorser_trust × confidence_score`
2. **Missing Metadata**: Apply conservative fallbacks (see Section 7.2)
3. **Temporal Conflicts**: Prioritize fresher signals with decay functions
4. **Threshold Enforcement**: Content below user-defined trust thresholds requires explicit consent

### 7.3 Temporal Conflict Resolution

When the same content receives updated endorsements over time, agents must balance recency with cumulative trust:

#### Example: Evolving Endorsement Landscape

```json
{
  "id": "content:covid-study-results",
  "endorsements": [
    {
      "endorser": {"id": "endorser:medical-journal", "trust_score": 0.95},
      "verdict": "methodologically-sound",
      "confidence": 0.90,
      "date": "2024-01-15"
    },
    {
      "endorser": {"id": "endorser:peer-reviewer-a", "trust_score": 0.88},
      "verdict": "concerns-about-sample-size",
      "confidence": 0.82,
      "date": "2024-02-03"
    },
    {
      "endorser": {"id": "endorser:meta-analysis-group", "trust_score": 0.92},
      "verdict": "findings-not-replicated",
      "confidence": 0.88,
      "date": "2024-06-10"
    }
  ]
}
```

**Temporal Weighting Algorithm:**

```
For each endorsement:
1. Calculate base weight: endorser_trust × confidence
2. Apply time decay: weight × decay_factor^months_old
3. Weight newer negative findings more heavily (credibility erosion)

Decay factors:
├─ Positive endorsements: decay_factor = 0.95 (5% per month)
├─ Negative endorsements: decay_factor = 0.85 (15% per month, but boost recent ones)
└─ Neutral endorsements: decay_factor = 0.90 (10% per month)

Calculation:
├─ Jan endorsement: 0.95 × 0.90 × 0.95^6 = 0.608 (6 months old)
├─ Feb endorsement: 0.88 × 0.82 × 1.1^5 = 1.176 (5 months old, negative boost)
└─ Jun endorsement: 0.92 × 0.88 × 1.1^1 = 0.890 (1 month old, negative boost)

Final assessment: Recent negative findings outweigh older positive
Result: CAUTION flag - "Initial positive results later questioned"
```

### 7.2 Handling Ambiguous Trust Signals

When trust signals are incomplete, ambiguous, or missing, agents must implement fallback strategies:

#### Scenario: Missing Endorsement Metadata

```json
{
  "id": "content:breaking-news-item",
  "title": "Market Update",
  "author": {"id": "author:unknown"},
  "publisher": {"id": "publisher:news-site", "trust_score": 0.60},
  "endorsements": [],
  "trust_signals": {
    "domain_reputation": null,
    "content_freshness": 0.95,
    "engagement_quality": null
  }
}
```

**Fallback Decision Tree:**

```
1. Assess signal completeness
   ├─ Author: UNKNOWN (no trust score)
   ├─ Publisher: 0.60 (moderate)
   ├─ Endorsements: EMPTY
   └─ Trust signals: 33% complete

2. Apply conservative scoring
   ├─ Known signals: publisher(0.60) + freshness(0.95) = 1.55
   ├─ Unknown signal penalty: -0.20 (for missing author/domain data)
   ├─ No endorsement penalty: -0.10
   └─ Calculated score: (1.55 - 0.30) / 2 = 0.625

3. Check user thresholds
   ├─ User minimum trust: 0.70
   ├─ Content score: 0.625
   └─ Result: BELOW THRESHOLD

4. Decision: PROMPT user or SKIP content
   ├─ If user allows: Show with warning badge
   └─ If user blocks: Skip and log reason
```

## Future Extensions

Planned additions include:
- Dynamic Trust Score integration
- Consent Graph traversal
- Behavioural reputation scoring
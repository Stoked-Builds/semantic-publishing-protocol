# Agent Interface Specification
**Version:** 0.1  
**Status:** Final  
**Date:** 2025-07-28  
**Spec Code:** spp/agent-interface

---

## 🧠 Purpose

Defines how AI agents **interpret, filter, reason about, and act on** SPS content, identity, and consent data — on behalf of the user.

Agents are **first-class citizens** in the SPS ecosystem. They are not crawlers. They are **delegated agents** acting in the user’s interest, with explicit boundaries.

---

## 👤 Agent Identity

Each agent MUST declare:

```json
{
  "agent_id": "agent:zero.v1",
  "ssot_id": "ssot:markstokes",
  "type": "reader-agent",
  "version": "1.0.0",
  "purpose": "Curate and narrate relevant articles for morning brief",
  "permissions": ["read", "summarise", "explain", "rate"]
}
```

Agents are required to present:
- Their **intended purpose**
- Their **capabilities**
- A **verifiable link** to the user they serve

---

## 🔒 Consent & Permission

Agents must:
- Be explicitly **granted consent** to access identity fields (via `consent-engine.md`)
- Only process SPS blocks marked as `public`, `consented`, or `delegated`
- Log all actions for **auditability**

---

## 🧩 Core Actions

### 1. `read()`

Retrieves and parses SPS content. Applies context filters:
- Focus mode
- Tag preferences
- Language
- Freshness (based on user interest decay)

---

### 2. `summarise()`

Condenses one or more content blocks into:
- Plain language
- Local dialect
- Time-bound summaries (e.g. “in 60 seconds”)

---

### 3. `explain()`

Provides accessible or step-by-step breakdowns:
- “Explain this article like I’m 10”
- “Give me the pros and cons”
- “Is this aligned with my privacy goals?”

---

### 4. `rate()`

Assigns content a relevance score (1–100) based on:
- User interest model
- FARS alignment
- Past engagement
- Focus context

This is used for prioritisation, ad integration, or feed selection.

#### 4.1 Advanced Rating with Endorsements

The `rate()` function becomes more sophisticated when endorsements and saturation affect ranking:

##### Example: Endorsement Saturation Impact

```json
{
  "content_a": {
    "base_relevance": 0.75,
    "endorsements": [
      {"trust": 0.90, "verdict": "accurate"},
      {"trust": 0.85, "verdict": "accurate"},
      {"trust": 0.80, "verdict": "accurate"}
    ],
    "saturation_level": "high"
  },
  "content_b": {
    "base_relevance": 0.70,
    "endorsements": [
      {"trust": 0.95, "verdict": "accurate"}
    ],
    "saturation_level": "low"
  }
}
```

**Agent Rating Decision Tree:**

```
Content A Analysis:
├─ Base relevance: 0.75
├─ Endorsement boost: (0.90 + 0.85 + 0.80) / 3 = 0.85 → +0.10
├─ Saturation penalty: High saturation → -0.05
└─ Final score: 0.75 + 0.10 - 0.05 = 0.80

Content B Analysis:
├─ Base relevance: 0.70
├─ Endorsement boost: 0.95 → +0.12
├─ Saturation bonus: Low saturation → +0.03
└─ Final score: 0.70 + 0.12 + 0.03 = 0.85

Ranking: Content B (0.85) > Content A (0.80)
```

##### Endorsement Quality Weighting

Agents evaluate endorsement quality using multiple factors:

```
Endorsement Value = endorser_trust × confidence × recency_factor × domain_expertise

Where:
- endorser_trust: 0.0-1.0 (from trust engine)
- confidence: endorser's confidence in their verdict
- recency_factor: decay function based on endorsement age
- domain_expertise: match between endorser specialty and content topic
```

---

### 5. `act()`

If empowered, agents can:
- Create tasks (e.g. “Add to reading list”)
- Share content (to contacts or other agents)
- Trigger workflows (e.g. “Tell Betty this is cool”)

All actions must be **transparent, revocable, and user-logged**.

#### 5.1 Contextual Action Planning

The `act()` function must consider trust and endorsement context:

##### Example: Smart Content Sharing

```
User Intent: "Share interesting climate articles with Betty"

Agent Decision Process:
1. Filter content by topic: climate
2. Apply trust thresholds: min_trust = 0.70
3. Check endorsement consensus:
   ├─ Content with 3+ positive endorsements: Priority 1
   ├─ Content with 1-2 positive endorsements: Priority 2
   └─ Content with no/conflicting endorsements: Requires confirmation

4. Personalization for Betty:
   ├─ Check Betty's expertise level (from social graph)
   ├─ Adjust technical complexity filter
   └─ Apply Betty's trust preferences

5. Execute sharing action with context
```

---

## 🔁 Input Signals

Agents operate on:
- SSOT profile fields (age, location, interest graph)
- Environmental cues (current time, focus mode, headphones in)
- Historical content memory
- Dynamic prompts (e.g. “Give me something to distract me”)

---

## 🔗 Inter-agent Protocol

Agents can cooperate if allowed:
- Swap or suggest content
- Refer summaries or ratings
- Transfer context (e.g. between desktop and glasses)

---

## 📊 Semantic.json Interpretation Walkthroughs

### Walkthrough 1: Complex Trust Signal Resolution

Consider this semantic.json with conflicting and missing metadata:

```json
{
  "id": "content:ai-regulation-analysis",
  "title": "AI Regulation Impact Analysis",
  "author": {
    "id": "author:anonymous",
    "trust_score": null
  },
  "publisher": {
    "id": "publisher:tech-weekly",
    "trust_score": 0.68,
    "domain_expertise": "technology"
  },
  "endorsements": [
    {
      "endorser": {
        "id": "endorser:policy-institute",
        "trust_score": 0.92,
        "domain_expertise": "policy"
      },
      "verdict": "well-researched",
      "confidence": 0.85,
      "date": "2025-07-20"
    },
    {
      "endorser": {
        "id": "endorser:tech-reviewer",
        "trust_score": 0.73,
        "domain_expertise": "technology"
      },
      "verdict": "biased",
      "confidence": 0.90,
      "date": "2025-07-22"
    }
  ],
  "trust_signals": {
    "domain_reputation": 0.72,
    "content_freshness": 0.95,
    "peer_citations": null,
    "user_engagement": 0.83
  },
  "topics": ["ai", "regulation", "policy", "technology"]
}
```

**Agent Processing Steps:**

```
1. Initial Assessment
   ├─ Author: UNKNOWN (anonymous) → Apply unknown penalty (-0.15)
   ├─ Publisher: Known with moderate trust (0.68)
   └─ Content topics: Match user interest in "ai" and "policy"

2. Endorsement Conflict Resolution
   ├─ Policy Institute (0.92 trust, policy expert):
   │   ├─ Verdict: "well-researched" (positive)
   │   ├─ Domain match: policy ∩ content topics = HIGH
   │   ├─ Weighted score: 0.92 × 0.85 × 1.2 = 0.938
   │   └─ Age penalty: 8 days old → -0.02 = 0.918
   │
   └─ Tech Reviewer (0.73 trust, tech expert):
       ├─ Verdict: "biased" (negative)
       ├─ Domain match: technology ∩ content topics = MEDIUM
       ├─ Weighted score: 0.73 × 0.90 × 1.0 = 0.657
       └─ Age penalty: 6 days old → -0.01 = 0.647

3. Consensus Calculation
   ├─ Positive weight: 0.918
   ├─ Negative weight: 0.647
   ├─ Net endorsement score: (0.918 - 0.647) / 2 = 0.136
   └─ Interpretation: WEAK POSITIVE consensus

4. Trust Signal Aggregation
   ├─ Available signals: domain(0.72) + freshness(0.95) + engagement(0.83)
   ├─ Missing signal penalty: peer_citations missing → -0.05
   ├─ Base trust: (0.72 + 0.95 + 0.83 - 0.05) / 3 = 0.817
   └─ Author penalty: -0.15

5. Final Score Calculation
   ├─ Base score: 0.817 - 0.15 = 0.667
   ├─ Endorsement adjustment: +0.136
   ├─ Final trust score: 0.803
   └─ User threshold check: 0.803 > 0.70 ✓ PASS

6. Agent Decision
   ├─ Content: ACCEPTED with moderate confidence
   ├─ Display note: "Conflicting expert opinions - see details"
   └─ Ranking boost: +0.05 for topic relevance
```

### Walkthrough 2: Missing Endorsement Metadata Recovery

When endorsement data is incomplete, agents implement progressive fallback strategies:

```json
{
  "id": "content:climate-breakthrough",
  "endorsements": [
    {
      "endorser": {"id": "endorser:science-journal"},
      "verdict": "peer-reviewed"
      // Missing: trust_score, confidence, domain_expertise
    },
    {
      "endorser": {"id": "endorser:unknown-fact-checker"},
      "confidence": 0.75
      // Missing: verdict, trust_score, domain_expertise  
    }
  ]
}
```

**Recovery Process:**

```
1. Endorsement 1 Analysis
   ├─ Query local trust registry for "endorser:science-journal"
   ├─ Fallback to domain reputation lookup: science-journal.org
   ├─ Apply conservative trust score: 0.70 (verified domain)
   ├─ Infer confidence from verdict type: "peer-reviewed" → 0.85
   └─ Domain expertise: infer from endorser name → "science"

2. Endorsement 2 Analysis  
   ├─ Completely unknown endorser → High risk
   ├─ Has confidence (0.75) but missing critical data
   ├─ Apply maximum penalty: -0.20
   └─ Skip or weight minimally: 0.05

3. Fallback Strategy Decision
   ├─ Use Endorsement 1 with conservative weighting
   ├─ Ignore Endorsement 2 (insufficient data)
   ├─ Flag content for user review: "Limited endorsement data"
   └─ Apply 15% confidence reduction to final score
```

---

## 🔐 Trust & Security

Agents MUST:
- Be sandboxed per user
- Disclose capabilities before activation
- Be locally revocable and fully deletable
- Honour consent revocation instantly

---

## 🛠 Future Additions

- `learn()` — evolve interest models over time
- `proxy()` — act as a user in conversation or decision
- `advocate()` — negotiate on user’s behalf (e.g. insurance, ads)

---

## 🤝 Summary

Agents are not apps. They are **you**, abstracted.  
They exist to serve your intent — not someone else’s.

The SPS Agent Interface defines the rules for that trust.


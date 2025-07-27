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

---

### 5. `act()`

If empowered, agents can:
- Create tasks (e.g. “Add to reading list”)
- Share content (to contacts or other agents)
- Trigger workflows (e.g. “Tell Betty this is cool”)

All actions must be **transparent, revocable, and user-logged**.

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


# Agent Behaviour Specification (v0.1)

## Purpose [Informative]

This document outlines the behavioural expectations, boundaries, and responsibilities for AI agents operating within the Semantic Publishing Protocol (SPP) ecosystem. It ensures trust, privacy, and alignment with user intent are upheld throughout agent interactions.

---

## 1. Agent Identity [Normative]

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

## 2. Behavioural Boundaries [Normative]

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

## 3. User Alignment [Normative]

Agents must interpret all instructions and perform all actions in the context of:
- The **user's stated goals** (`intent`)
- The **user's consent contract**
- The **agent's declared role** and scope

All AI actions should be explainable post-hoc via audit logs.

---

## 4. Consent Enforcement [Normative]

Agents must load and honour `consent-engine.md` policies before activating any optional behaviour.

Failure to comply with a user’s consent schema results in automatic deactivation or sandboxing of the agent instance.

---

## 5. Trust and Auditability [Normative]

Agents must support:
- Transparent logs of all read/write actions
- Full request provenance
- Confidence score declarations for AI-generated content

Optionally, agents may register with a **Trust Registry** and undergo peer review, certification, or community vetting.

---

## 6. Special Flags [Normative]

<!-- Note: This section defines optional extensions that agents may implement -->

Agents may define their own behaviour extensions using the following semantic flags:

```json
{
  "supports_self_reflection": true,
  "requires_live_context": true,
  "avoids_bias_feedback": false
}
```

---

## Future Extensions

Planned additions include:
- Dynamic Trust Score integration
- Consent Graph traversal
- Behavioural reputation scoring
# Agent Coordination – Specification v0.1

## Overview

In the Semantic Publishing Protocol (SPP), multiple agents may operate concurrently on behalf of a user, publisher, or service. Agent coordination defines how these agents interact, delegate tasks, share memory (if permitted), and avoid duplication or conflict.

This specification outlines secure, intent-aligned coordination patterns that maintain user autonomy and systemic integrity.

---

## Agent Roles

Agents MAY assume different functional roles:

- **Query Agent**: Resolves user queries
- **Memory Agent**: Manages long-term data
- **Publisher Agent**: Represents content creators
- **Consent Agent**: Manages data access permissions
- **Ad Agent**: Handles intent-aligned ad sourcing
- **Trust Agent**: Scores source credibility

Coordination ensures these roles don’t work in isolation or conflict.

---

## Delegation Protocol

Agents MAY delegate subtasks to other agents via:

- **Signed delegation envelope**:
  - Task ID
  - Intent description
  - Expiry
  - Trust requirements
- **Local broker** to manage intra-agent dispatch
- **Consent check** before memory or action delegation

---

## Coordination Methods

| Coordination Type | Example Use Case                             | Mechanism                            |
|-------------------|-----------------------------------------------|--------------------------------------|
| Sequential         | Memory agent feeds context → query agent     | Linear dispatch + context injection |
| Parallel           | Query and ad agent fetch in tandem           | Shared TTL + local results merge    |
| Conditional        | Trust agent vetoes disallowed sources        | Policy-based short-circuiting       |
| Escalation         | Consent agent denies → requires UI prompt    | User interrupt or fallback route    |

---

## Shared Knowledge Bus

A local “agent bus” MAY be used to:
- Share ephemeral data during resolution
- Emit status and alerts (e.g., `"PublisherAgent::rate_limit_exceeded"`)
- Coordinate backoff, retries, or escalation

This bus MUST NOT leak data externally unless consent is granted.

---

## Priority & Arbitration

If agents disagree:
- **Consent agent** always wins over memory agent
- **User interrupt** (e.g., “Stop that agent”) halts all downstream action
- **Trust agent** MAY override delegation to disreputable agents

Agents MUST respect the `agent-behaviour.md` guidelines for alignment, politeness, and deferral.

---

## Security

- Each agent MUST authenticate (`agent-authentication.md`)
- Delegated calls MUST include audit trail
- User MAY inspect or revoke agent rights at any time

---

## Future Extensions

- Federated agent swarms for complex goals
- Group policy configuration for agent groups
- Agent self-regulation using behavioral feedback
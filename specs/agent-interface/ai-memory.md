# AI Memory – Specification v0.1

## Overview

AI memory in the Semantic Publishing Protocol defines how AI agents retain, recall, and manage data across sessions — while upholding user privacy, transparency, and intent alignment.

This spec outlines the memory tiers, expiration strategies, context injection methods, and user control mechanisms for AI browsers and agents.

---

## Memory Tiers

### 1. Short-Term Memory (STM)
- Exists only during a session or single task execution
- Used for in-context reasoning, retrieval-augmented generation (RAG), and summarisation
- Auto-purged at session end unless promoted

### 2. Long-Term Memory (LTM)
- Persistent memory stored locally by the AI browser or agent
- Contains facts, preferences, context fragments, historical queries, and trust evaluations
- Indexed for efficient semantic retrieval

### 3. SSOT-Linked Memory
- References user-controlled canonical sources (e.g., `ssot://health/profile`)
- Values are retrieved live or cached temporarily
- Never copied or owned by the agent

---

## Memory Promotion Logic

Information may be promoted from STM to LTM if:

- Marked as “important” by the user
- Used repeatedly or accessed across multiple sessions
- Affects future trust, consent, or preference decisions

---

## Context Injection

At the start of any query or task, agents MAY inject memory-based context:

- Explicit facts (“User is vegetarian”)
- Contextual embeddings (“User prefers summary > full article”)
- Recent tasks (“You were researching diving equipment yesterday”)

Context is scoped to avoid contamination, bias, or hallucination amplification.

---

## Expiry & Retention

| Memory Type     | Default Retention     | Override Options             |
|-----------------|-----------------------|------------------------------|
| STM             | Session only          | None                         |
| LTM             | 90 days rolling       | Extend, manual delete        |
| SSOT Reference  | Live only             | Cache TTLs allowed           |

Users may configure:
- Retention policy
- Forgetfulness preference
- "Autofade" for stale data

---

## User Control

- Full memory inspection UI
- Manual promotion/demotion
- “Forget this” command
- Local-only storage by default

---

## Privacy & Security

- All memory MUST be stored and encrypted locally
- Agents MAY sync encrypted memory across devices (user approved)
- Memory content is NOT shareable unless explicitly exported or shared by user

---

## Future Extensions

- Semantic memory clustering
- Event-based memory triggers
- Multi-agent shared memory bus (user scoped)
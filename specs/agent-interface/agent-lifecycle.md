# Agent Lifecycle

The Agent Lifecycle defines the stages, events, and requirements associated with the existence of a semantic agent within the Semantic Publishing Protocol (SPP) ecosystem.

## 🔁 Lifecycle Stages

1. **Created**
   - An agent identity is generated and registered in the publishing registry.
   - Metadata includes origin, purpose, author, and declared scopes.

2. **Onboarded**
   - Agent passes verification tests and is declared `active`.
   - Personality profile and capabilities are declared via the `agent-personality-profile.md` spec.
   - May optionally request memory access or identity permissions from a user.

3. **Trusted (Optional)**
   - Agents may undergo reputation or trust audits by third-party registrars or rating entities.
   - Trust badges and permissions can be granted based on proof-of-behaviour logs.

4. **Updated**
   - Agents may evolve with new capabilities, personas, or scope of operation.
   - All updates must be recorded in the registry with changelogs.

5. **Suspended**
   - Temporarily deactivated due to misbehaviour, outdated configuration, or user revocation.
   - Cannot perform actions or access user context.

6. **Retired**
   - Agent is sunset by its author, owner, or governing entity.
   - Registry marks it immutable, and a final public state is preserved.

7. **Reactivated**
   - A suspended or retired agent can be reactivated if conditions are met and audit logs reviewed.

## 📝 Agent State Metadata

Agents must declare and update:
- `lifecycle_status`: e.g., `created`, `active`, `retired`, `suspended`, etc.
- `last_updated`: UTC timestamp
- `change_reason`: Optional string for transparency
- `publisher_id`: Origin entity

## 🚨 Lifecycle Hooks (Optional)

- `on_suspend`: Trigger cleanup or revocation tasks
- `on_retire`: Archive memory, terminate routines, export state

## 📚 Related Specs

- `agent-authentication.md`
- `agent-personality-profile.md`
- `agent-rating.md`
- `registry-and-discovery.md`

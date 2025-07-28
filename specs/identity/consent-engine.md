# Consent Engine Specification
**Version:** 0.1  
**Status:** Final  
**Date:** 2025-07-28  

---

## 🔐 Purpose

The Consent Engine governs **data access** and **permission sharing** across all SPS-aligned systems, including:

- AI browsers and semantic agents
- Advertisers requesting user preferences
- Personal apps requesting health, finance, or profile data
- Federated ecosystems (e.g. mesh social, medical networks)

All consent is **local-first**, **verifiable**, and **revocable**.

---

## 🧠 Consent Token Format

Each consent is stored and optionally shared as a signed JSON object:

```json
{
  "iss": "ssot:markstokes",
  "sub": "ssot:focusco",
  "aud": "intent-agent.focusmode.local",
  "request_scope": ["interests", "ad_preferences"],
  "reason": "Better ad targeting for ADHD users",
  "issued_at": "2025-07-27T08:10:00Z",
  "expires_at": "2025-08-27T08:10:00Z",
  "delegated_by": null,
  "signature": "0xSHA256..."
}
```

### 🔑 Fields Explained

- `iss`: Who issued the token (user)
- `sub`: Who it's granted to (requesting entity)
- `aud`: Optional agent-specific scope
- `request_scope`: Data categories requested
- `reason`: Purpose string shown to user
- `delegated_by`: For parental or org-level delegation
- `signature`: Optional crypto layer

---

## 🧭 Consent Profiles

Users can define **Consent Profiles** for common situations:

```json
"consent_profiles": {
  "private_mode": {
    "ads": "disabled",
    "analytics": "disabled",
    "sharing": "none"
  },
  "work_mode": {
    "ads": "minimal",
    "productivity_tools": "enabled"
  }
}
```

Browsers and agents can offer profile switching or rule-based automation.

---

## 👁️ Consent UI Modes

Agents MUST support the following UX modes:

| Mode           | Behaviour                        |
|----------------|----------------------------------|
| Prompt Always  | Always show request prompt       |
| Auto-Approve   | Pre-approve based on profile     |
| Silent Deny    | Log but never approve silently   |
| Audit-Only     | Log request without response     |

Default is **Prompt Always** unless user overrides.

---

## 🔄 Consent Expiry and Rotation

Tokens MUST include `expires_at` and SHOULD support:
- Expiry-based auto-deletion
- Rotation prompts before expiry
- Immediate revocation list (local or federated)

---

## 📜 Audit Logging

A compliant Consent Engine must log:
- Who requested
- What was requested
- What was granted/denied
- Which mode approved it

Standard log formats:
- JSONL (newline-delimited JSON)
- Encrypted JSON log (AES256)

---

## 🧬 Consent Chaining

Supports delegated grants, e.g.:

- Parents for children
- Org owner for teams
- Shared household devices

```json
"delegated_by": "ssot:parent.id"
```

---

## 🔐 Local-Only Privacy Guarantee

All consent requests are:
- Evaluated locally by the SSOT agent
- Never sent to the requesting entity unless approved
- Never stored on central servers by default

SSOT agents MAY support a “sharing vault” for optional sync/backup.

---

## 🛠 Future Features

- Consent templates for common app types (e.g., “Health Tracker”)
- Signed delegation graphs (nested trust chains)
- Proof-of-Consent receipt NFTs (zero-party audit trail)
- Revocation APIs for real-time teardown

---

## Related Specs

- [`focus-mode.md`](./focus-mode.md)
- [`ssot-id.md`](./ssot-id.md)
- [`identity-verification.md`](./identity-verification.md)
- [`trust-engine.md`](../consent-engine/trust-engine.md)

> _"This system ensures **data access is earned**, not taken.  
The **individual remains sovereign** over their information —  
...with cryptographic receipts to prove it."_

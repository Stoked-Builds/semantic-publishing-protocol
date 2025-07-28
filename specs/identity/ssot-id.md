# SSOT-ID (Single Source of Truth Identity)
**Version:** 0.1  
**Status:** Final  
**Date:** 2025-07-28  
**Codename:** ssot-id

---

## 🧠 Purpose

SSOT-ID defines a portable, user-owned identity format that acts as the **single source of truth** for all personal data shared with websites, agents, advertisers, and applications.

It enables local-first, agent-driven personalisation and consent, while **preventing centralised harvesting of identity** by external platforms.

---

## 🔐 Core Principles

- **User-owned and user-controlled**
- **Stored locally** (encrypted in AI browsers or trusted identity vaults)
- **Shared only via signed consent tokens**
- **Portable, readable, revocable**

---

## 🧱 Profile Structure

```json
{
  "ssot_id_version": "0.1",
  "ssot_id": "ssot:markstokes",
  "preferred_name": "Mark",
  "email": "mark.stokes@outlook.com",
  "birthdate": "1982-05-14",
  "gender": "male",
  "country": "UK",
  "language": "en-GB",
  "interests": ["ADHD", "tech", "writing", "motorbikes"],
  "purchase_history": [
    "product:neurofocus-buds",
    "product:overlay-glasses-v1"
  ],
  "ad_preferences": {
    "relevance_threshold": 80,
    "max_ads_per_hour": 2,
    "allow_product_retargeting": false
  },
  "field_visibility": {
    "public": ["preferred_name", "language"],
    "restricted": ["email", "purchase_history", "ad_preferences"]
  }
}
```

---

## 🛡 Consent Sharing Format

When an external party (agent, site, advertiser) wishes to access part of your SSOT-ID, it must submit a **consent request**. Example:

```json
{
  "requester": "focusflow.app",
  "request_scope": ["interests", "ad_preferences"],
  "reason": "To suggest relevant content and avoid ad fatigue",
  "duration_days": 30
}
```

You approve or deny. Consent tokens are signed, stored, and revocable.

---

## 🔄 Revocation

Revocation can be:
- **Manual**: From browser UI or personal vault
- **Timed**: Auto-expire after `duration_days`
- **Triggered**: If recipient breaches terms (reported to your agent)

All accesses are logged.

---

## 🔐 Export Format

User profiles may be exported or backed up as:

- `.ssot.json` (default plaintext JSON)
- `.ssot.enc` (encrypted with user-chosen passphrase)
- `.ssot.yml` (optional for readability)

---

## 🔎 Field Types

| Field               | Type           | Notes |
|--------------------|----------------|-------|
| ssot_id_version    | string (semver) | Required |
| ssot_id            | string (URN)   | Unique identifier |
| preferred_name     | string         | Display name |
| email              | string (email) | RFC 5322 format |
| birthdate          | string (ISO 8601) | Optional |
| interests          | array[string]  | Freeform tags |
| purchase_history   | array[string]  | Product slugs or IDs |
| ad_preferences     | object         | AI ad config |
| field_visibility   | object         | `public` / `restricted` arrays |

---

## 📡 Integration with SPP/SPS

- `author` blocks in SPS metadata link to `ssot_id`
- Ad platforms use SSOT to respect personalisation boundaries
- Consent Engine verifies and enforces all third-party data use

---

## Related Specs

- [`consent-engine.md`](./consent-engine.md)
- [`focus-mode.md`](./focus-mode.md)
- [`identity-verification.md`](./identity-verification.md)
- [`agent-interface.md`](../agent-interface/agent-interface.md)


> _"SSOT-ID is **your digital self, on your terms** — designed to be recognised, respected, and revoked."_
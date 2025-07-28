
# Agent Commission Contract

**File:** `specs/payments/agent-commission-contract.md`  
**Status:** Draft v0.1  
**SPP Component:** Payments / Ads / Agent Interface

---

## Purpose

Defines how agents or intermediary systems receive **commission payments** for surfacing sponsored content or ads. Designed to prevent abuse while enabling monetisation.

---

## Key Concepts

- Agents may receive **micro-commissions** when surfacing ads
- Commissions are only paid when **conditions are met**
- All commission contracts are **transparent** and user-auditable

---

## Contract Format

```json
{
  "agent_id": "agent://stoked.browser",
  "ad_id": "ad://boost-shoes/23345",
  "click_action": "https://boostshoes.com/offer",
  "commission_model": "pay-per-click",
  "amount": "0.04",
  "currency": "SPP-Token",
  "issued_at": "2025-07-28T23:15:00Z",
  "terms": {
    "max_per_day": 1000,
    "geo_limit": ["GB", "IE"]
  }
}
```

---

## Supported Models

| Type           | Description |
|----------------|-------------|
| `pay-per-click` | Commission on each valid clickthrough |
| `pay-per-action` | After user performs downstream action |
| `pay-per-view` | Based on visibility threshold reached |

---

## Trust Safeguards

- No commission paid for bot views or forced clicks
- Ads must disclose sponsorship to users
- Contracts are signed and logged to agent registry

---

## Related Files

- `micro-payments.md`
- `intent-aligned-ads.md`
- `ad-token.json`

**Token Model Reference:**
- [`spp-token-roadmap.md`](./spp-token-roadmap.md)

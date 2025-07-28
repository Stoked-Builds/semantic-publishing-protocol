
# Ad Compliance Specification

**File:** `specs/ads/ad-compliance.md`  
**Status:** Draft v0.1  
**SPP Component:** Ads / Trust / Safety

---

## Overview

All ads shown in the SPP ecosystem must comply with strict ethical, legal, and user safety standards. This file defines a compliance framework for both **ad content** and **ad behaviour**.

---

## Requirements

### 1. Child Protection

- Ads must be tagged for age suitability
- Users under 16 may only see age-rated ads
- No personalised ads for users under 13

### 2. Disallowed Content

| Category             | Rule |
|----------------------|------|
| Hate speech          | ❌ Forbidden |
| Violence or abuse    | ❌ Forbidden |
| Disinformation       | ❌ Forbidden |
| Political ads (by default) | 🚫 Off by default, opt-in only |

---

### 3. Sponsorship Disclosure

- Ads must declare when they are paid/sponsored
- Browser/agent must display this info clearly to users

---

### 4. Reporting + Audit

- Users can report ads via the agent/browser UI
- All ads stored in a signed ledger for inspection
- Repeat violators may be removed from registries

---

### 5. AI-Generated Ads

- Must include `generated_by` metadata
- Cannot impersonate real people, brands, or competitors
- Visual deepfakes must include watermark or marker tag

---

## Metadata Fields

```json
{
  "ad_id": "ad://example/456",
  "sponsored": true,
  "age_rating": "13+",
  "generated_by": "ai://gen-stoked-v1",
  "compliance": {
    "child_safe": true,
    "ethics_passed": true,
    "last_reviewed": "2025-07-28"
  }
}
```

---

## Enforcement

- Registries may suspend non-compliant advertisers
- Trust engines may downgrade ad visibility
- Verified compliance may boost ad score in auctions

---

## Related Specs

- `trust-engine.md`
- `ad-ranking-engine.md`
- `agent-rating.md`

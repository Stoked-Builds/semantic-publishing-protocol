# Saturation Penalty System (SPSat)
**Version:** 0.1  
**Status:** Draft  
**Date:** 2025-07-27  
**Part of:** [Intent-Aligned Ads](intent-aligned-ads.md) in [SPP](../spp/protocol-overview.md)

---

## 🧠 Purpose

The Saturation Penalty System (SPSat) ensures ads are **not repeatedly shown** to users who are **clearly uninterested**.

This:
- Reduces user fatigue
- Increases ad efficiency
- Incentivises higher-quality targeting by advertisers

---

## 📉 Penalty Logic

Each time a user sees an ad but takes **no action** (no click, hover, or expansion), a **penalty factor** is applied to future display score.

### Pseudocode:

```ts
if (viewed && !engaged) {
    ad.saturationCount += 1;
    ad.saturationPenalty = 1.0 - (penaltyRate * ad.saturationCount);
}
```

### Default Configuration:

| Setting | Value |
|---------|-------|
| `penaltyRate` | `0.15` per view |
| `maxPenalty` | 80% (hard lower bound) |
| `resetPeriod` | 30 days since last view |

### Example:

| Views | Clicked | Penalty |
|-------|---------|---------|
| 1     | ❌      | 0.85    |
| 2     | ❌      | 0.70    |
| 3     | ❌      | 0.55    |
| 4     | ❌      | 0.40    |
| 5     | ❌      | 0.25    |
| 6+    | ❌      | 0.20 (capped) |

---

## 🔄 Reset Logic

If the ad is not shown again for `resetPeriod` (default: 30 days), the penalty is **reset to baseline**.

This allows for fresh re-evaluation without permanent blacklisting.

---

## ⚠️ Blocklist Trigger

If `maxViewsPerAd` is defined in user SSOT-ID preferences and is exceeded, the ad is **automatically excluded**.

```yaml
ad_preferences:
  max_views_per_ad: 4
```

---

## 📊 Relevance Feedback Loop

Ads that continually incur high penalties without engagement are:
- Downranked in the global ad registry
- Flagged to advertisers as poorly targeted
- Suggested for creative revision or exclusion

---

## 🧠 Use in Composite Ad Scoring

See [`intent-aligned-ads.md`](intent-aligned-ads.md):

```
Composite Score = ... - (SaturationPenalty * PenaltyWeight)
```

Where PenaltyWeight is tunable based on user mood, focus state, or session fatigue.

---

## 🔐 Privacy Note

Saturation scoring is **entirely local**:
- No external server receives interaction logs
- Browsers/agents maintain and apply scores privately
- Ads are only shown when they have a meaningful chance of value

---

The Saturation Penalty System brings dignity to digital attention.  
Less noise. More signal.


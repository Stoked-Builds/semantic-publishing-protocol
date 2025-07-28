# Ad Ranking Engine – Specification v0.1

## Purpose

The Ad Ranking Engine (ARE) is the core component within an AI-native browser or agent that determines **which ads to show**, **when to show them**, and **how they are prioritised** — based on user preferences, context, advertiser bids, and the principle of *intent alignment*.

This file outlines the logic, constraints, and interfaces for implementing a standards-compliant ARE under the SPP framework.

---

## Ranking Inputs

The ARE ingests the following input categories:

### 1. **User Preference Signals**
- Ad categories opted into (or blocked)
- Privacy and consent settings
- Willingness to be advertised to (W2A Score)
- Saturation tolerance (e.g. max 5 exposures/week)
- Attention budget (e.g. 3 ad slots/hour)

### 2. **Contextual Relevance**
- Current query, content domain, or goal
- Environmental cues (location, time, device)
- Inferred task or intent (e.g. researching vs buying)

### 3. **Advertiser Attributes**
- Max bid per exposure or click
- Category tags
- Estimated conversion probability
- Reputation/trust score

### 4. **Historical Signals**
- Prior interactions with this ad/brand
- Engagement metrics (clicks, skips, hovers)
- Peer network engagement (opt-in only)

---

## Ranking Algorithm

Ads are scored with a weighted model:

```
AdScore = (
  RelevanceWeight * MatchScore +
  IntentAlignmentWeight * W2AScore +
  BidWeight * NormalizedBid -
  SaturationPenalty +
  TrustBonus
)
```

### Parameters:
- **RelevanceWeight**: How well ad matches query/context
- **W2AScore**: Willingness-to-be-advertised-to for this ad type
- **NormalizedBid**: Bid relative to category averages
- **SaturationPenalty**: Curve applied after repeated exposures
- **TrustBonus**: Boost for verified/ethical advertisers

---

## Saturation Penalty

To avoid spam and banner blindness:

- Linear decay after N views
- Exponential penalty after threshold
- Resettable on click or explicit engagement

---

## Ethical Considerations

- No dark patterns or manipulative UI
- Transparent scoring rationale available to user
- No user tracking outside browser without explicit consent
- Ad logs visible and exportable to user

---

## Ad Selection Pipeline

1. Filter out ads not matching declared preferences or consent
2. Calculate `AdScore` for remaining ads
3. Select top `N` ads per layout constraint
4. Log ranking and display history locally
5. Record payments and impressions for eligible advertisers

---

## Output Interface

```json
{
  "ads": [
    {
      "adId": "ad:789xyz",
      "score": 8.2,
      "reason": ["matched:travel/uk", "high W2A", "low saturation"],
      "display": "banner-top",
      "payment": {
        "currency": "SPX",
        "amount": 0.0025
      }
    }
  ]
}
```

---

## Related Specs

- [`intent-aligned-ads.md`](./intent-aligned-ads.md)
- [`micro-payments.md`](./micro-payments.md)
- [`trust-engine.md`](./trust-engine.md)
- [`consent-engine.md`](./consent-engine.md)
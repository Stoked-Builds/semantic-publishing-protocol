# Trust Weighting Extension

**Extension ID:** `spp:trust-weighting`  
**Version:** 0.3.0  
**Specification:** SPP Extension

## Purpose

The Trust Weighting extension calculates content trust based on graph endorsement and context. It provides a standardized method for agents to compute and apply trust scores, enabling consistent content reliability assessment across different systems.

## Schema Fields

When using this extension, content MAY include the following additional fields in `semantic.json`:

### Trust Signals

```json
{
  "trust_signals": {
    "source_credibility": 0.85,
    "peer_review": true,
    "fact_checked": true,
    "controversy_detected": false,
    "breaking_news": false,
    "time_sensitive": false,
    "anonymous_author": false,
    "editorial_oversight": true,
    "endorsement_chain_length": 2,
    "aggregate_trust_score": 0.87,
    "trust_decay_rate": 0.1,
    "last_updated": "2025-01-15T14:30:00Z"
  }
}
```

### Trust Configuration

```json
{
  "trust_config": {
    "algorithm": "weighted_average",
    "version": "1.0",
    "weights": {
      "source_credibility": 0.4,
      "endorsement_quality": 0.3,
      "evidence_strength": 0.2,
      "temporal_factors": 0.1
    },
    "thresholds": {
      "high_trust": 0.8,
      "medium_trust": 0.6,
      "low_trust": 0.3
    },
    "decay": {
      "enabled": true,
      "half_life": "30d",
      "minimum_score": 0.1
    }
  }
}
```

## Field Definitions

### trust_signals

- **Type:** Object
- **Required:** No
- **Description:** Collection of trust indicators and computed scores

#### Trust Signal Fields

- `source_credibility` (number, 0.0-1.0): Base credibility of content source
- `peer_review` (boolean): Whether content has undergone peer review
- `fact_checked` (boolean): Whether content has been fact-checked
- `controversy_detected` (boolean): Whether controversial elements are detected
- `breaking_news` (boolean): Whether this is breaking/urgent news
- `time_sensitive` (boolean): Whether content becomes less reliable over time
- `anonymous_author` (boolean): Whether author identity is unknown
- `editorial_oversight` (boolean): Whether content has editorial review
- `endorsement_chain_length` (number): Number of endorsements in chain
- `aggregate_trust_score` (number, 0.0-1.0): Final computed trust score
- `trust_decay_rate` (number, 0.0-1.0): Rate at which trust decreases over time
- `last_updated` (string): ISO 8601 timestamp of last trust calculation

### trust_config

- **Type:** Object
- **Required:** No
- **Description:** Configuration for trust calculation algorithms

#### Configuration Fields

- `algorithm` (string): Trust calculation method ("weighted_average", "bayesian", "neural")
- `version` (string): Version of algorithm used
- `weights` (object): Relative importance of different factors
- `thresholds` (object): Score ranges for trust levels
- `decay` (object): Time-based trust degradation settings

## Trust Calculation Algorithms

### Weighted Average (Default)

```javascript
function calculateTrustScore(content, endorsements, config) {
  const baseScore = content.trust_signals.source_credibility || 0.5;
  
  if (!endorsements || endorsements.length === 0) {
    return baseScore;
  }
  
  let totalWeight = 0;
  let weightedSum = 0;
  
  for (const endorsement of endorsements) {
    const endorserWeight = endorsement.trust_weight || 0.5;
    const confidence = endorsement.confidence || 0.5;
    const verdictModifier = getVerdictModifier(endorsement.verdict);
    
    const effectiveConfidence = confidence * verdictModifier;
    weightedSum += endorserWeight * effectiveConfidence;
    totalWeight += endorserWeight;
  }
  
  const endorsementScore = totalWeight > 0 ? weightedSum / totalWeight : 0;
  
  // Combine base credibility with endorsement signals
  return (baseScore * config.weights.source_credibility) + 
         (endorsementScore * config.weights.endorsement_quality);
}
```

### Verdict Modifiers

```javascript
function getVerdictModifier(verdict) {
  const modifiers = {
    'accurate': 1.0,
    'verified': 1.0,
    'corroborated': 1.0,
    'referenced': 0.7,
    'mentioned': 0.7,
    'disputed': 0.3,
    'questionable': 0.3,
    'false': 0.1,
    'misleading': 0.1
  };
  return modifiers[verdict] || 0.5;
}
```

### Time Decay

```javascript
function applyTimeDecay(score, publishedDate, config) {
  if (!config.decay.enabled) return score;
  
  const now = new Date();
  const published = new Date(publishedDate);
  const ageMs = now - published;
  const halfLifeMs = parseDuration(config.decay.half_life);
  
  const decayFactor = Math.pow(0.5, ageMs / halfLifeMs);
  const decayedScore = score * decayFactor;
  
  return Math.max(decayedScore, config.decay.minimum_score);
}
```

## Usage

### Declaring the Extension

```json
{
  "extensions": [
    {
      "id": "spp:trust-weighting",
      "version": "0.3.0"
    }
  ]
}
```

### Basic Trust Signals

```json
{
  "id": "news:verified-report",
  "title": "Verified News Report",
  "extensions": [
    {
      "id": "spp:trust-weighting",
      "version": "0.3.0"
    }
  ],
  "trust_signals": {
    "source_credibility": 0.9,
    "fact_checked": true,
    "peer_review": false,
    "aggregate_trust_score": 0.85
  }
}
```

### Advanced Configuration

```json
{
  "trust_config": {
    "algorithm": "weighted_average",
    "weights": {
      "source_credibility": 0.5,
      "endorsement_quality": 0.3,
      "evidence_strength": 0.15,
      "temporal_factors": 0.05
    },
    "thresholds": {
      "high_trust": 0.85,
      "medium_trust": 0.65,
      "low_trust": 0.35
    }
  },
  "trust_signals": {
    "source_credibility": 0.8,
    "endorsement_chain_length": 3,
    "controversy_detected": false,
    "aggregate_trust_score": 0.82
  }
}
```

## Trust Score Interpretation

### Score Ranges

- **0.8 - 1.0:** High Trust
  - Highlight prominently
  - No warning indicators
  - Full feature access

- **0.6 - 0.8:** Medium Trust
  - Display normally
  - Optional trust indicators
  - Standard feature access

- **0.3 - 0.6:** Low Trust
  - Display with warnings
  - Trust indicators required
  - Limited feature access

- **0.0 - 0.3:** Very Low Trust
  - Suppress or minimize
  - Strong warning indicators
  - Restricted feature access

### Rendering Guidelines

```javascript
function determineRendering(trustScore) {
  if (trustScore >= 0.8) return 'highlight';
  if (trustScore >= 0.6) return 'display';
  if (trustScore >= 0.3) return 'display-with-warning';
  return 'suppress';
}
```

## Advanced Features

### Contextual Trust

Trust scores can vary based on context:

```json
{
  "trust_signals": {
    "context_scores": {
      "breaking_news": 0.75,
      "historical_analysis": 0.92,
      "opinion_piece": 0.45
    },
    "default_score": 0.78
  }
}
```

### Dynamic Trust Updates

Trust scores can be updated in real-time:

```json
{
  "trust_signals": {
    "dynamic_updates": true,
    "update_frequency": "5m",
    "last_recalculated": "2025-01-15T14:30:00Z",
    "trend": "increasing"
  }
}
```

### Trust Networks

Build trust networks across related content:

```json
{
  "trust_signals": {
    "network_effects": {
      "related_content_scores": [0.85, 0.79, 0.91],
      "network_average": 0.85,
      "network_influence": 0.1
    }
  }
}
```

## Integration Patterns

### With Endorsement Chains

```json
{
  "extensions": [
    {"id": "spp:endorsement-chains", "version": "0.3.0"},
    {"id": "spp:trust-weighting", "version": "0.3.0"}
  ],
  "endorsements": [...],
  "trust_signals": {
    "endorsement_derived_score": 0.87,
    "source_credibility": 0.8,
    "aggregate_trust_score": 0.84
  }
}
```

### With Time Versioning

```json
{
  "extensions": [
    {"id": "spp:time-versioning", "version": "0.3.0"},
    {"id": "spp:trust-weighting", "version": "0.3.0"}
  ],
  "trust_signals": {
    "initial_score": 0.85,
    "current_score": 0.79,
    "decay_applied": true,
    "version_trust_history": [0.85, 0.83, 0.81, 0.79]
  }
}
```

## Implementation Considerations

### Performance
- Cache trust calculations
- Batch score updates
- Optimize for real-time queries

### Accuracy
- Regular algorithm calibration
- A/B testing of scoring methods
- Feedback loop integration

### Transparency
- Explain trust score components
- Provide trust calculation details
- Allow user trust preference customization

## Security Considerations

### Trust Score Manipulation
- Validate endorsement authenticity
- Detect coordinated inauthentic behavior
- Implement rate limiting and abuse detection

### Privacy
- Protect user trust preferences
- Anonymize sensitive trust signals
- Respect user consent for trust tracking

## Backward Compatibility

This extension is fully backward compatible. Agents that don't recognize the extension will ignore trust fields without breaking core functionality.

## Future Enhancements

### Machine Learning Integration
- Neural network-based trust scoring
- Adaptive algorithm learning
- Personalized trust models

### Federated Trust
- Cross-platform trust score sharing
- Standardized trust APIs
- Decentralized trust networks
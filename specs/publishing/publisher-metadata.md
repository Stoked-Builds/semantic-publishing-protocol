
# Publisher Metadata Specification

**File:** `specs/publishing/publisher-metadata.md`  
**Status:** Draft v0.1  
**SPP Component:** Publishing / Trust / Identity

---

## Purpose

Establish a standard metadata structure that publishers can declare to define their **identity**, **editorial scope**, and **usage terms**. This ensures transparency, discoverability, and contextual trust for content consumers and agents.

---

## Key Metadata Fields

| Field              | Type      | Description |
|-------------------|-----------|-------------|
| `publisher_id`     | URI       | Canonical ID (e.g. `pub://bbc.co.uk`) |
| `display_name`     | string    | Public-facing name |
| `org_type`         | enum      | `individual`, `company`, `nonprofit`, `gov` |
| `focus_areas`      | array     | Topic areas (e.g. ["health", "technology"]) |
| `terms_url`        | URL       | Terms of use or content licence |
| `trust_framework`  | enum      | `none`, `self-attested`, `third-party-cert` |
| `semantic_profile_url` | URL | Optional machine-readable config |
| `contact`          | object    | Contact metadata |

---

## Example

```json
{
  "publisher_id": "pub://wired.com",
  "display_name": "WIRED Magazine",
  "org_type": "company",
  "focus_areas": ["technology", "science", "culture"],
  "terms_url": "https://wired.com/terms",
  "trust_framework": "self-attested"
}
```

---

## Integration Points

- Used in `registry-and-discovery.md`
- Cross-linked in content block metadata
- Used by trust engines and ranking systems

---

## Related Specs

- `publisher-rating.md`
- `content-attribution.md`
- `review-chain.md`

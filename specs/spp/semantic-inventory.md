# Semantic Inventory

The Semantic Inventory defines the structures by which agents, AI browsers, and the Semantic Publishing Protocol (SPP) ecosystem maintain, categorise, and expose content blocks, user profiles, advertisements, and reusable semantic elements.

## 📦 Purpose

To provide a consistent structure for:
- Content indexing and caching in memory
- Query resolution surfaces
- Source-aware auditing
- Real-time rendering in AI-generated views

---

## 🧱 Inventory Object Types

### 1. **Content Blocks**
- Represent atomic content objects (e.g., product, article, review, image)
- Must include:
  - `block_id`: globally unique identifier
  - `block_type`: e.g., `product`, `recipe`, `faq`, etc.
  - `source`: publisher or registry it came from
  - `attribution`: metadata for source licensing and creator
  - `semantic_tags`: contextual tags aligned with SPS

### 2. **Ads**
- Ad blocks conform to `intent-aligned-ads.md` format
- Tracked by frequency, relevance, saturation
- May exist in “offer-only” state until surfaced by matching agent prompt

### 3. **Pages / Views**
- Virtual page representations constructed by the AI browser
- May be pre-cached templates or dynamically assembled
- Indexed by:
  - `purpose`: e.g., summary, comparison, walkthrough
  - `source_blocks`: array of content block references
  - `user_context_tags`: optional

### 4. **User Profiles**
- Exposed *only* with consent and local storage logic
- Must follow `ssot-id.md`, `consent-engine.md` and access delegation rules
- Can influence inventory weighting

---

## 🧠 Inventory Indexing Keys

- `semantic_tags`: natural language-aligned tags
- `relevance_score`: calculated per context
- `source_rank`: optional community or trust rating
- `last_verified`: timestamp of most recent data verification

---

## 🔄 Real-Time Memory vs Cold Index

- **Hot Inventory**: Temporarily cached agent context, active query usage
- **Cold Inventory**: Background indexed data for future recall, periodically refreshed
- Agents may maintain rolling caches and expiration rules


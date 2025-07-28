# Semantic Publishing Specification (SPS)
**Version:** 0.1  
**Status:** Draft  
**Date:** 2025-07-27  
**Codename:** SPS Core

---

## 📘 Purpose

The Semantic Publishing Specification (SPS) defines the **structure, metadata, and publishing format** for content meant to be consumed by intelligent agents and AI browsers — not just traditional human interfaces.

It provides a consistent, machine-readable layer over any content, enabling rich semantic context, privacy-respecting interaction, and personalised assembly.

---

## 🧱 Key Goals

1. **Agent-first** — designed for intelligent consumption
2. **Composable** — content can be broken into blocks or fragments
3. **Contextual** — metadata defines purpose, tone, type
4. **User-aligned** — respects consent, preferences, and visibility
5. **Retrofit-friendly** — can be embedded into existing websites

---

## 🧩 Core Object Types

Each content item should declare one of the following semantic types:

| `sps_type`        | Description                              |
|-------------------|------------------------------------------|
| `article`         | Written article, blog, essay             |
| `video`           | Video content with or without transcript |
| `product`         | Item for sale or promotion               |
| `person`          | Profile of a person                      |
| `organisation`    | Company, group, or entity                |
| `event`           | Calendar or location-specific event      |
| `app`             | Software or interactive experience       |
| `knowledge`       | Informational node or data-rich object   |
| `collection`      | Group of items, e.g. gallery, playlist   |

---

## 🧠 Metadata Schema (Base)

All SPS objects must support the following fields:

```json
{
  "sps_type": "article",
  "id": "https://example.com/posts/adhd-focus-habits",
  "title": "10 Micro-Habits for ADHD Focus",
  "author": {
    "name": "Mark Stokes",
    "ssot_id": "ssot:markstokes"
  },
  "tags": ["adhd", "focus", "habits"],
  "summary": "Quick daily routines that boost focus for neurodivergent minds.",
  "published_at": "2025-07-20T09:00:00Z",
  "updated_at": "2025-07-26T18:00:00Z",
  "content_url": "https://example.com/posts/adhd-focus-habits",
  "preview_image": "https://cdn.example.com/img/adhd.jpg",
  "estimated_duration": "6m"
}
```

---

## 🧩 Optional Fields (by type)

### `article` and `video`
- `transcript` (for accessibility)
- `structured_summary`
- `reading_level`
- `source_citations`

### `product`
- `price`
- `currency`
- `availability`
- `affiliate_tracking_id` (if revenue-sharing is active)

### `event`
- `location` (lat/lng or place ID)
- `start_time` / `end_time`
- `rsvp_url`

---

## 📡 Embedded Metadata Methods

1. **JSON-LD block** in HTML `<head>`
2. **`<script type="application/sps+json">`** in body
3. **Meta tags** (lightweight, fallback only)
4. **`data-sps-*` attributes** on DOM elements

---

## ✅ Validation

Each SPS object must validate against its declared `sps_type` schema.  
Schema registry will be published at:

```
https://spec.stoked.tech/schemas/{type}.json
```

---

## 🔐 Consent-aware Visibility

If content visibility or delivery depends on **user consent** (e.g. health advice, age gating), use:

```json
{
  "consent_required": ["read:profile", "access:health"]
}
```

---

## 🧪 Example: Enhanced Article Metadata

```json
{
  "sps_type": "article",
  "id": "https://dailyfocus.ai/posts/zen-vs-zap",
  "title": "Zen vs Zap: ADHD Focus Explained",
  "summary": "Why some brains relax with trance, and others need chaos.",
  "tags": ["adhd", "brain", "music"],
  "author": {
    "name": "NeuroTech Labs",
    "ssot_id": "ssot:neurotech"
  },
  "published_at": "2025-07-18T14:00:00Z",
  "preview_image": "https://cdn.dailyfocus.ai/images/zen-zap.jpg",
  "structured_summary": [
    {"heading": "The Calm Paradox", "summary": "Tranquil music can induce anxiety in some."},
    {"heading": "Stimulation = Regulation", "summary": "Upbeat rhythms help ADHD brains regulate."}
  ],
  "estimated_duration": "4m"
}
```

---

## 🚦 Versioning

SPS metadata must include a `sps_version` string.  
Clients may ignore or warn if version is unsupported.

---

## 🌍 Localisation & Accessibility

- All fields should support `lang` tags or Unicode content
- Content summaries should be available in fallback languages where possible
- Agents should respect locale preferences from SSOT profile

---

## 🛠 Tooling Roadmap

- VS Code validation plugin
- CLI for metadata linting
- Browser extension for preview/debug
- WordPress + Hugo integrations
- SPS Registry (decentralised mirror support)

---

The Semantic Publishing Spec bridges the legacy web and the agent-powered future.  
It’s not just content — it’s **context with consent**.


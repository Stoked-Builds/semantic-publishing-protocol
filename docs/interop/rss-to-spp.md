# RSS to Semantic Publishing Protocol (SPP) Interop Guide

This guide demonstrates how to convert RSS feeds into valid `semantic.json` and `topics.json` files for the Semantic Publishing Protocol.

---

## Overview

RSS feeds contain structured content metadata that can be mapped to SPP's semantic blocks. This conversion enables RSS content to become machine-native, owner-verifiable, and context-aware while maintaining compatibility with existing RSS ecosystems.

### Key Benefits
- **Enhanced Discoverability**: Machine-readable semantic metadata
- **Topic Standardization**: Global topic identifiers via Wikidata
- **Author Attribution**: Structured author and publisher information
- **Versioning Support**: Content integrity and version tracking

---

## RSS to Semantic Block Mapping

### Core Field Mappings

| RSS Element | SPP semantic.json Field | Notes |
|-------------|------------------------|-------|
| `<title>` | `title` | Direct mapping |
| `<description>` | `summary` | Content summary |
| `<link>` | `canonical` | Canonical URL |
| `<pubDate>` | `date` | Convert to YYYY-MM-DD format |
| `<guid>` | `id` | Transform to SPP URI format |
| `<author>` or `<dc:creator>` | `author` | Map to author object |
| `<category>` | `topics` + `tags` | Extract to topics and tags |
| `<language>` | `lang` | ISO 639-1 language code |

### Advanced Mappings

| RSS Element | SPP Field | Transformation |
|-------------|-----------|----------------|
| `<managingEditor>` | `publisher.name` | Extract publisher info |
| `<copyright>` | `license` | Map to license identifier |
| `<source>` | `source` | Original source attribution |
| `<enclosure>` | Custom payload | Media attachments |

---

## Sample Input: RSS Feed

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Tech News Daily</title>
    <description>Latest technology news and insights</description>
    <link>https://technews.example.com</link>
    <managingEditor>editor@technews.example.com (Tech News Team)</managingEditor>
    <language>en-us</language>
    <copyright>Copyright 2025 Tech News Daily</copyright>
    
    <item>
      <title>AI Models Require New Licensing Framework</title>
      <description>Governments worldwide are implementing new regulations requiring AI companies to obtain licenses for large language models used in critical infrastructure.</description>
      <link>https://technews.example.com/ai-licensing-2025</link>
      <guid isPermaLink="true">https://technews.example.com/ai-licensing-2025</guid>
      <pubDate>Tue, 15 Jan 2025 10:30:00 GMT</pubDate>
      <dc:creator>Sarah Johnson</dc:creator>
      <category>Artificial Intelligence</category>
      <category>Government Policy</category>
      <category>Technology Regulation</category>
      <source url="https://reuters.com/tech">Reuters Technology</source>
    </item>
  </channel>
</rss>
```

---

## Sample Output: semantic.json

```json
{
  "id": "spp://technews.example.com/ai-licensing-2025",
  "title": "AI Models Require New Licensing Framework",
  "summary": "Governments worldwide are implementing new regulations requiring AI companies to obtain licenses for large language models used in critical infrastructure.",
  "topics": [
    {
      "id": "artificial-intelligence",
      "label": "Artificial Intelligence",
      "global": "wikidata:Q11660"
    },
    {
      "id": "government-policy",
      "label": "Government Policy",
      "global": "wikidata:Q1156854"
    },
    {
      "id": "technology-regulation",
      "label": "Technology Regulation"
    }
  ],
  "tags": ["ai", "licensing", "regulation", "government"],
  "lang": "en",
  "date": "2025-01-15",
  "version": "1.0.0",
  "digest": "sha256:a1b2c3d4e5f6789...",
  "author": {
    "name": "Sarah Johnson",
    "id": "author:sarah-johnson"
  },
  "publisher": {
    "name": "Tech News Daily",
    "id": "publisher:technews",
    "uri": "https://technews.example.com"
  },
  "source": "Reuters Technology",
  "license": "All Rights Reserved",
  "canonical": "https://technews.example.com/ai-licensing-2025",
  "endorsements": [],
  "archived": false
}
```

---

## Sample Output: topics.json

```json
[
  {
    "id": "artificial-intelligence",
    "label": {
      "en": "Artificial Intelligence",
      "fr": "Intelligence Artificielle",
      "es": "Inteligencia Artificial"
    },
    "global": "wikidata:Q11660",
    "description": "Technology that enables machines to simulate human intelligence and cognitive functions",
    "aliases": ["AI", "Machine Intelligence", "Artificial General Intelligence"]
  },
  {
    "id": "government-policy",
    "label": {
      "en": "Government Policy",
      "fr": "Politique Gouvernementale"
    },
    "global": "wikidata:Q1156854",
    "description": "Principles and courses of action adopted by governmental bodies",
    "aliases": ["Public Policy", "State Policy"]
  },
  {
    "id": "technology-regulation",
    "label": "Technology Regulation",
    "description": "Legal frameworks governing the development and deployment of technology",
    "parent": "government-policy",
    "aliases": ["Tech Regulation", "Digital Governance"]
  }
]
```

---

## Conversion Strategies

### 1. Category Extraction → Topics

RSS categories can be mapped to SPP topics using several strategies:

#### Direct Mapping
```javascript
// Simple category to topic conversion
const categoryToTopic = (category) => ({
  id: category.toLowerCase().replace(/\s+/g, '-'),
  label: category
});
```

#### Enhanced Topic Enrichment
```javascript
// With Wikidata integration
const enrichTopic = async (category) => {
  const wikidataId = await lookupWikidata(category);
  return {
    id: category.toLowerCase().replace(/\s+/g, '-'),
    label: category,
    global: wikidataId ? `wikidata:${wikidataId}` : undefined
  };
};
```

### 2. Author Information Processing

```javascript
// Extract author from RSS dc:creator or author field
const processAuthor = (authorString) => {
  // Handle formats like "editor@example.com (John Doe)" or "John Doe"
  const emailMatch = authorString.match(/^(.+?)\s*\((.+?)\)$/);
  if (emailMatch) {
    return {
      name: emailMatch[2].trim(),
      id: `author:${emailMatch[2].toLowerCase().replace(/\s+/g, '-')}`,
      email: emailMatch[1].trim()
    };
  }
  return {
    name: authorString.trim(),
    id: `author:${authorString.toLowerCase().replace(/\s+/g, '-')}`
  };
};
```

### 3. Date Format Conversion

```javascript
// Convert RSS pubDate to SPP date format
const convertDate = (pubDate) => {
  const date = new Date(pubDate);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};
```

### 4. ID Generation

```javascript
// Generate SPP-compliant IDs from RSS GUIDs
const generateSppId = (guid, baseUrl) => {
  if (guid.startsWith('http')) {
    // Convert URL GUID to SPP format
    const url = new URL(guid);
    return `spp://${url.hostname}${url.pathname}`;
  }
  // Handle non-URL GUIDs
  return `spp://${new URL(baseUrl).hostname}/${guid}`;
};
```

---

## Limitations and Workarounds

### 1. Missing Required Fields

**Issue**: SPP requires `id`, `title`, and `author`, but RSS may lack structured author info.

**Workaround**:
```javascript
// Fallback author when none specified
const ensureAuthor = (item, channelInfo) => {
  return item.author || item['dc:creator'] || {
    name: channelInfo.managingEditor || "Unknown Author",
    id: "author:unknown"
  };
};
```

### 2. Language Detection

**Issue**: RSS `<language>` may use different formats than ISO 639-1.

**Workaround**:
```javascript
// Normalize language codes
const normalizeLanguage = (rssLang) => {
  const langMap = {
    'en-us': 'en',
    'en-gb': 'en',
    'fr-fr': 'fr'
  };
  return langMap[rssLang?.toLowerCase()] || rssLang?.substring(0, 2) || 'en';
};
```

### 3. Content Digests

**Issue**: RSS doesn't provide content hashes for integrity verification.

**Workaround**:
```javascript
// Generate digest from content
const generateDigest = async (content) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return 'sha256:' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};
```

### 4. Topic Hierarchies

**Issue**: RSS categories are flat; SPP topics support hierarchies.

**Workaround**:
```javascript
// Create topic hierarchies from category patterns
const inferTopicHierarchy = (categories) => {
  const topics = [];
  const hierarchyMap = {
    'Technology': {
      children: ['Artificial Intelligence', 'Software', 'Hardware']
    },
    'Politics': {
      children: ['Government Policy', 'Elections', 'International Relations']
    }
  };
  
  categories.forEach(category => {
    const topic = { id: category.toLowerCase().replace(/\s+/g, '-'), label: category };
    
    // Check if this category is a child of a broader topic
    for (const [parent, config] of Object.entries(hierarchyMap)) {
      if (config.children.includes(category)) {
        topic.parent = parent.toLowerCase().replace(/\s+/g, '-');
        break;
      }
    }
    
    topics.push(topic);
  });
  
  return topics;
};
```

---

## Complete Conversion Example

```javascript
// RSS to SPP conversion function
const convertRssToSpp = async (rssItem, channelInfo) => {
  const semantic = {
    id: generateSppId(rssItem.guid, rssItem.link),
    title: rssItem.title,
    summary: rssItem.description,
    topics: await Promise.all(
      rssItem.categories.map(cat => enrichTopic(cat))
    ),
    tags: extractTags(rssItem.description, rssItem.categories),
    lang: normalizeLanguage(channelInfo.language),
    date: convertDate(rssItem.pubDate),
    version: "1.0.0",
    digest: await generateDigest(rssItem.title + rssItem.description),
    author: processAuthor(rssItem.author || rssItem['dc:creator']),
    publisher: {
      name: channelInfo.title,
      id: `publisher:${channelInfo.title.toLowerCase().replace(/\s+/g, '-')}`,
      uri: channelInfo.link
    },
    source: rssItem.source?.text,
    license: mapLicense(channelInfo.copyright),
    canonical: rssItem.link,
    endorsements: [],
    archived: false
  };

  const topics = semantic.topics.map(topic => ({
    id: topic.id,
    label: topic.label,
    global: topic.global,
    description: generateTopicDescription(topic.label)
  }));

  return { semantic, topics };
};
```

---

## Validation

After conversion, validate your SPP files using the provided validator:

```bash
# If you have Python validation tools
python tools/validate.py examples/converted-rss.sps.md

# For JSON schema validation
ajv validate -s schema/semantic.json -d output/semantic.json
ajv validate -s schema/topic.json -d output/topics.json
```

---

## Best Practices

1. **Preserve Source Attribution**: Always maintain RSS source information in the `source` field
2. **Enrich Topics**: Use Wikidata integration to add global identifiers
3. **Generate Meaningful IDs**: Create stable, unique identifiers based on content URLs
4. **Handle Missing Data**: Provide sensible defaults for required SPP fields
5. **Maintain Relationships**: Preserve category hierarchies as topic parent-child relationships
6. **Version Appropriately**: Start with "1.0.0" for initial conversions

---

## Tools and Libraries

### Recommended RSS Parsing Libraries

- **JavaScript**: `rss-parser`, `feedparser`
- **Python**: `feedparser`, `beautifulsoup4`
- **Node.js**: `feed-extractor`, `node-feedparser`

### Wikidata Integration

- **JavaScript**: `wikidata-sdk`
- **Python**: `pywikibot`, `requests`

### Schema Validation

- **JavaScript**: `ajv`
- **Python**: `jsonschema`

---

## Conclusion

Converting RSS to SPP enables existing content feeds to participate in the semantic web while maintaining backward compatibility. This guide provides the foundation for building robust conversion tools that preserve content integrity while adding semantic richness.

For more information, see:
- [SPP Specification Index](../spec-index.md)
- [Schema Documentation](../../schema/README.md)
- [Example Implementations](../../examples/README.md)
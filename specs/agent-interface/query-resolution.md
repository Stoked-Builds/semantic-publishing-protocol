# Query Resolution – Specification v0.1

## Overview

Query Resolution defines how AI browsers and agents interpret user queries, fetch relevant content, and dynamically construct responses using semantically published resources.

This specification outlines the lifecycle of a query — from natural language input to dynamically assembled multi-source output — in the context of the Semantic Publishing Protocol (SPP).

---

## Query Lifecycle

1. **Intent Parsing**
   - Natural language is parsed into structured intent + entities
   - Memory and context injected if appropriate
   - Classified into query types: informational, comparative, transactional, navigational

2. **Semantic Expansion**
   - Terms expanded via:
     - Ontology lookups
     - SSOT links
     - Synonyms and multilingual concepts
     - Custom user vocabulary

3. **Content Retrieval**
   - Sources include:
     - Local memory / cache
     - Registered SPS documents
     - Live publisher agents
     - External semantic endpoints

4. **Trust & Consent Filtering**
   - Results filtered based on:
     - Trust Engine score
     - User consent policies
     - Source freshness / reliability

5. **Synthesis & Presentation**
   - Factual data merged
   - Contradictions highlighted
   - Visuals / layouts generated dynamically by AI browser
   - Output structured as:
     - Dynamic card sets
     - Narrated summaries
     - Navigable mini-sites
     - Exportable knowledge graphs

---

## Query Typing Examples

| Type            | Example Query                          | Expected Output                          |
|-----------------|----------------------------------------|-------------------------------------------|
| Informational   | “What’s the capital of Bolivia?”       | Single verified answer                   |
| Comparative     | “Best diving watches under £500”       | Ranked dynamic table                     |
| Transactional   | “Book a hotel in Valencia”             | List of trusted options w/ booking links |
| Navigational    | “Show me SPP’s AI memory spec”         | Direct link to `ai-memory.md`            |

---

## Source Weighting

| Factor                     | Influence on Ranking |
|----------------------------|----------------------|
| User trust history         | High                 |
| Consent grant (personal)   | Required             |
| Source recency             | Medium               |
| Peer reputation            | Medium               |
| Engagement history         | Optional             |

---

## Privacy & Local Handling

- Query logs stored locally unless shared voluntarily
- Agents MAY resolve queries offline using local LTM + memory
- Federated models MAY be used with user approval

---

## Fallbacks

- If no SPS content is available, AI browser may:
  - Request permission to scrape external page
  - Query fallback LLMs
  - Suggest refining query or switching topic

---

## Future Extensions

- Real-time collaborative queries (multi-agent input)
- Context threading across sessions
- Agent marketplace plugins for niche domains
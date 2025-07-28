# Content Publishing Flow (SPP)

This diagram illustrates the end-to-end flow for publishing semantic content in the SPP ecosystem.

```mermaid
sequenceDiagram
    participant Author
    participant Agent
    participant Registry
    participant AI_Browser
    Author->>Agent: Submit content block (JSON)
    Agent->>Registry: Register content, metadata, attribution
    Registry-->>Agent: Confirm registration, return registry ID
    Agent->>AI_Browser: Notify of new content (optional)
    AI_Browser->>Registry: Discover and fetch content
    AI_Browser-->>Author: Rendered content, attribution, licensing
```

See also: [Semantic Blocks Spec](../specs/publishing/semantic-blocks.md), [Publishing Registry](../specs/spp/publishing-registry.md)

# Publishing Flow (SPP)

This diagram illustrates the complete end-to-end publishing lifecycle in the Semantic Publishing Protocol ecosystem, from content creation through archiving.

## Overview

The SPP publishing flow encompasses five key stages:
1. **Content Creation & Tagging** - Authors create content and apply semantic tags
2. **JSON Generation** - System generates semantic.json, topics.json, and processes story.md
3. **Publishing & Discovery** - Content is published to the web and discovered by agents
4. **Validation & Scoring** - Agents validate content and apply trust scores
5. **Endorsement & Archiving** - Third-party endorsements are applied and snapshots optionally archived

## Complete Publishing Lifecycle

```mermaid
flowchart TD
    %% Content Creation Phase
    A[Author Creates Content] --> B[Apply Semantic Tags]
    B --> C[Define Topics & Metadata]
    
    %% JSON Generation Phase
    C --> D[Generate topics.json]
    C --> E[Generate semantic.json]
    C --> F[Process story.md]
    
    %% Content Assembly
    D --> G[Assemble Content Package]
    E --> G
    F --> G
    
    %% Publishing Phase
    G --> H[Publish to Web]
    H --> I[Register in SPP Registry]
    I --> J[Generate Semantic Sitemap]
    
    %% Discovery Phase
    J --> K[Agent Discovery]
    K --> L[Content Indexing by Agents]
    
    %% Validation Phase
    L --> M[Agent Validation]
    M --> N{Validation Result}
    N -->|Pass| O[Apply Trust Score]
    N -->|Fail| P[Flag for Review]
    
    %% Review Process
    P --> Q[Manual Review]
    Q --> R{Review Decision}
    R -->|Approve| S[Update Content]
    R -->|Reject| T[Mark as Invalid]
    S --> M
    
    %% Scoring and Endorsement
    O --> U[Publish Score]
    U --> V[Third-party Endorsement Check]
    V --> W{Endorsement Available?}
    W -->|Yes| X[Apply Endorsement]
    W -->|No| Y[Skip Endorsement]
    
    %% Final State
    X --> Z[Published & Endorsed]
    Y --> AA[Published Only]
    Z --> BB[Optional Archival]
    AA --> BB
    
    %% Archive Decision
    BB --> CC{Archive Snapshot?}
    CC -->|Yes| DD[Create Archive Snapshot]
    CC -->|No| EE[Keep Live Only]
    
    %% Final States
    DD --> FF[Archived & Live]
    EE --> GG[Live Only]
    T --> HH[Invalid Content]
    
    %% Styling
    classDef creation fill:#e1f5fe
    classDef generation fill:#f3e5f5
    classDef publishing fill:#e8f5e8
    classDef validation fill:#fff3e0
    classDef endorsement fill:#fce4ec
    classDef archive fill:#f1f8e9
    classDef error fill:#ffebee
    
    class A,B,C creation
    class D,E,F,G generation
    class H,I,J,K,L publishing
    class M,N,O,P,Q,R,S,U validation
    class V,W,X,Y,Z,AA endorsement
    class BB,CC,DD,EE,FF,GG archive
    class T,HH error
```

## Detailed Flow Components

### 1. Content Creation & Tagging
- **Author Creates Content**: Writers, journalists, or content creators develop the base material
- **Apply Semantic Tags**: Content is tagged with relevant semantic identifiers for discoverability
- **Define Topics & Metadata**: Authors specify topic classifications and metadata requirements

### 2. JSON Generation Process
The system automatically generates three key files:

#### topics.json
```json
[
  {
    "id": "technology",
    "label": {
      "en": "Technology",
      "fr": "Technologie"
    },
    "global": "wikidata:Q739"
  }
]
```

#### semantic.json
```json
{
  "id": "content-unique-id",
  "title": "Content Title",
  "summary": "Brief summary of content",
  "topics": ["technology", "policy"],
  "tags": ["ai", "regulation"],
  "author": {
    "name": "Author Name",
    "id": "author:author-id"
  },
  "publisher": {
    "name": "Publisher Name",
    "id": "publisher:publisher-id"
  },
  "endorsements": [],
  "archived": false
}
```

#### story.md
The main content file containing the formatted story or article content.

### 3. Agent Interaction Flow

```mermaid
sequenceDiagram
    participant Publisher
    participant Registry
    participant Agent
    participant Validator
    participant Endorser
    
    Publisher->>Registry: Register content package
    Registry->>Agent: Notify of new content
    Agent->>Registry: Fetch content metadata
    Agent->>Publisher: Retrieve full content
    Agent->>Validator: Submit for validation
    Validator->>Agent: Return validation result
    Agent->>Registry: Update trust score
    Endorser->>Registry: Apply endorsement (optional)
    Registry->>Agent: Update with endorsement
```

### 4. Validation & Trust Process
- **Agent Validation**: Automated agents check content for accuracy, completeness, and compliance
- **Trust Scoring**: Validated content receives trust scores based on agent assessments
- **Manual Review**: Failed validation triggers human review process
- **Score Publication**: Trust scores are published to the registry for agent consumption

### 5. Endorsement & Archival
- **Third-party Endorsement**: Independent validators can endorse content quality
- **Endorsement Application**: Verified endorsements are applied to content metadata
- **Archive Decision**: Publishers can choose to create permanent snapshots
- **Snapshot Creation**: Immutable archives preserve content state at publication time

## Integration Points

This publishing flow integrates with other SPP flows:
- **Consent Grant Flow**: For user permission management during content access
- **Payment Flow**: For monetization and licensing of published content
- **Content Publishing Flow**: This extends the basic content publishing sequence

## File Dependencies

- See: [Semantic JSON Spec](../specs/publishing/semantic-json.md)
- See: [Topics Spec](../specs/publishing/topics-spec.md)
- See: [Story Spec](../specs/publishing/story-spec.md)
- See: [Review Chain Protocol](../specs/publishing/review-chain.md)
- See: [SPP Validator Tool](../tools/spp-validator.md)

---

*This flow diagram supports implementer onboarding and clarifies the timing of validation and trust steps in the SPP ecosystem.*
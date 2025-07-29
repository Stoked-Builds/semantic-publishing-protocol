# Semantic Publishing Protocol – System Flow Diagram

Below is a simple block-style diagram showing the end-to-end flow of a document through the Semantic Publishing Protocol.

```mermaid
flowchart TD
    A[Submission<br>(Author submits content)] --> B[Template Matching<br>(Finds appropriate template)]
    B --> C[Processor Execution<br>(Validation, enrichment, transformation)]
    C --> D[Output Generation<br>(Structured, trusted content)]
    C --> E[Job Status Update]
    E --> F{Status}
    F -->|Succeeded| G[Content Published/Available]
    F -->|Failed| H[Error Reported<br>to Author]
    F -->|Escalated| I[Manual Review<br>or Further Processing]
```

This diagram illustrates the main steps and decision points in the SPP document lifecycle.

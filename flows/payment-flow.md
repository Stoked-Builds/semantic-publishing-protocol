# Payment Flow (SPP)

This diagram outlines the micro-payment and revenue split process in the SPP protocol.

```mermaid
sequenceDiagram
    participant User
    participant Agent
    participant Payment_Adapter
    participant Publisher
    User->>Agent: Initiate payment (e.g., tip, ad view)
    Agent->>Payment_Adapter: Create payment intent, request consent
    Payment_Adapter-->>Agent: Confirm payment, provide receipt
    Agent->>Publisher: Forward payment, update revenue split
    Publisher-->>User: Confirm access, deliver content/service
```

See also: [Micro-Payments Spec](../specs/payments/micro-payments.md), [Content Revenue Split](../specs/payments/content-revenue-split.md)

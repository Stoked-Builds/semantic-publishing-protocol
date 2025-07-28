# Payment Adapter Contract – Specification v0.1

## Purpose

This document defines the **standard interface** and expected behaviours of a compliant Payment Adapter in the Semantic Publishing Protocol (SPP).

Adapters are pluggable modules that allow micro-transactions using:
- Cryptocurrency wallets (e.g. ETH, SOL)
- Fiat payment providers (e.g. Stripe, Apple Pay)
- Stablecoins
- Internal or closed-loop credits
- Future native token (e.g. `SPX`)

---

## Interface Overview

All SPP payment adapters MUST expose the following methods:

```ts
interface PaymentAdapter {
  validate(paymentIntent: PaymentIntent): boolean;
  promptUserConsent(intent: PaymentIntent): Promise<UserConsentResult>;
  executeTransaction(intent: PaymentIntent): Promise<PaymentReceipt>;
  returnReceipt(): PaymentReceipt;
}
```

---

## Data Structures

### `PaymentIntent`

```json
{
  "amount": "1.00",
  "currency": "USD",
  "to": "wallet_or_account_id",
  "from": "user_wallet_id",
  "description": "Ad view reward",
  "meta": {
    "consentRequired": true,
    "adapter": "crypto|fiat|local|spx"
  }
}
```

### `UserConsentResult`

```json
{
  "approved": true,
  "timestamp": "2025-07-28T10:10:00Z"
}
```

### `PaymentReceipt`

```json
{
  "transactionId": "0xdeadbeef...",
  "adapter": "crypto",
  "status": "success",
  "timestamp": "2025-07-28T10:10:30Z"
}
```

---

## Requirements

- MUST support real-time or deferred execution
- MUST be cancellable up to execution moment
- MUST respect local or global consent policies
- SHOULD store receipts securely and allow for user audit
- SHOULD support error handling and retries
- SHOULD work offline if adapter type allows (e.g. local ledger)

---

## Example Adapters

| Adapter Type | Implementation Hint                   |
|--------------|----------------------------------------|
| `crypto`     | MetaMask, WalletConnect, Solana SDK   |
| `fiat`       | Stripe Checkout, PayPal API, Apple Pay|
| `local`      | JSON file-based local ledger          |
| `spx`        | Future: SPX payment client module     |

---

## Future Considerations

- Standard error codes for failed transactions
- Adapter discovery and trust scoring
- Rate limiting or daily cap enforcement
- Fee transparency declaration per adapter

---

## Related Specs

- [`micro-payments.md`](./micro-payments.md)
- [`spp-token-roadmap.md`](./spp-token-roadmap.md)
- [`intent-aligned-ads.md`](../ads/intent-aligned-ads.md)
- [`ad-auction-engine.md`](../ads/ad-auction-engine.md)
- [`trust-engine.md`](../consent-engine/trust-engine.md)
- [`semantic-blocks.md`](../publishing/semantic-blocks.md)

> _"Payment adapters are core to SPP's micro-payments and token flows. See related specs for integration and roadmap details."_
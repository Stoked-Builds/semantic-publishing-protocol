# Micro-Payments – Specification v0.1

## Overview

Micro-payments in the Semantic Publishing Protocol (SPP) enable transparent, user-controlled compensation for content consumption, ad engagement, and agent services — without requiring invasive tracking or centralized intermediaries.

This specification outlines payment flow, supported formats, adapter architecture, user consent rules, and how creators and service providers can participate.

---

## Use Cases

- **Ad view payments**: Users earn from viewing intent-aligned ads
- **Content tipping**: Reward authors or publishers on-demand
- **Per-use services**: Pay agents for premium features (e.g., deep analysis)
- **Subscriptions**: Recurring support for trusted publishers or tools
- **Fair-play revenue**: Automatic revenue splits for creators, AI agents, and sources

---

## Architecture

### Core Components

- **User Wallet**: Local or linked wallet, crypto or fiat
- **Payment Intent**: JSON-LD object describing action, value, and payee
- **Consent Checkpoint**: Ensures user approval before transaction
- **Payment Adapter**: Executes payment via selected method
- **SPP Payment Node (optional)**: Middleware to route and log payments

---

## Payment Flow

1. **Trigger**
   - Ad viewed, content unlocked, service used
2. **Intent Generation**
   - `payment-intent.jsonld` created and optionally signed
3. **Consent Prompt (if required)**
   - User confirms amount, currency, and target
4. **Transaction Execution**
   - Adapter submits transaction via wallet or API
5. **Recordkeeping**
   - Receipt stored locally and optionally shared with publisher/payment node

---

## Supported Adapters

| Adapter         | Description                              | Use Case                                   |
|------------------|------------------------------------------|--------------------------------------------|
| `crypto`         | Ethereum/Solana/etc. wallets             | Tipping, smart contracts, direct pay       |
| `stablecoin`     | Fiat-pegged currencies (e.g. USDC)       | Low-volatility recurring payments          |
| `fiat-api`       | Stripe, Apple Pay, OpenBanking           | Mainstream-friendly transactions           |
| `local`          | No transfer; log-only for freemium flows | Trust counters, internal usage             |
| `custom-adapter` | Developer-defined plugin method          | Closed-loop systems, gamified currency     |
| `spx` (future)   | Native stablecoin pegged to real-world value | Micro-value stable payments in SPP        |

---

## Adapter Interface

All SPP-compliant payment adapters MUST implement:

- `validate(payment-intent)`
- `promptUserConsent()`
- `executeTransaction()`
- `returnReceipt()`

Adapters SHOULD support fallbacks, offline queueing, and retry logic.

---

## User Preferences

Users MUST be able to configure:

- Daily/weekly/monthly spend limits
- Auto-approval for whitelisted parties
- Preferred payment adapter or wallet
- Visibility of all past transactions
- Data sharing and consent policies

---

## Publisher & Agent Onboarding

1. Register a **Payment Endpoint** and define in SPS metadata
2. Declare accepted currencies and wallet addresses
3. Optionally support a **fair-play split** via smart contracts or metadata
4. Verify payment receipts via cryptographic signature or adapter API

---

## Trust & Abuse Prevention

- No adapter may auto-send funds without user or pre-consent
- Agents requesting excessive fees will be penalised by Trust Engine
- All receipts must be signed or verifiable against the ledger (if crypto)

---

## Future Extensions

- **SPX**: SPP-native stablecoin token pegged to real-world currencies
- Open-source adapters for popular wallets and smart contract platforms
- Global “Ad Equity Pool” for fairer content funding
- Revenue distribution tracking for cooperative publishing networks
- Self-custodial escrow smart contracts for multi-agent flows
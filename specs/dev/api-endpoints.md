
# API Endpoints for Semantic Publishing Interop

**File:** `specs/dev/api-endpoints.md`  
**Status:** Draft v0.1  
**SPP Component:** Developer Interop / Hybrid Systems

---

## Purpose

Define a minimal, optional set of REST-style API endpoints that allow interoperability between Semantic Publishing Protocol (SPP) agents and traditional systems.

These endpoints may be exposed by AI browsers, agent runtimes, content registries, or publishers wishing to support hybrid scenarios.

---

## Suggested Endpoint Set

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/spp/query` | POST | Submit a semantic query (text or structured) |
| `/spp/intent` | POST | Declare user intent/preferences (ad, content, commerce) |
| `/spp/identity` | GET | Fetch summary identity record for current user |
| `/spp/content/{id}` | GET | Retrieve canonical structured content |
| `/spp/agent/ping` | GET | Test agent responsiveness (agent heartbeat check) |
| `/spp/ads` | GET | Request ads matching current profile |
| `/spp/log/share` | POST | Record a consented data share event |
| `/spp/payments/token` | POST | Trigger or verify token micro-payment |

---

## Authentication

- API access should respect the local `consent-engine.md`
- Auth methods: API keys, user tokens, mutual TLS, signed JWTs

---

## Notes

- All endpoints are **optional and extensible**
- JSON over HTTPS is default transport format
- Responses may use `.spp+json` content type

---

## Related Specs

- `consent-engine.md`
- `query-resolution.md`
- `micro-payments.md`

# Search Index Snapshot

A Search Index Snapshot (SIS) is a point-in-time capture of an agent's indexed surface, designed for transfer, audit, caching, and collaborative query resolution.

## 📚 Purpose

- Enables local-first AI browsers to sync with other agents or registries
- Makes search state portable across devices or agents
- Aids reproducibility of AI-rendered pages

---

## 📦 Snapshot Schema

```json
{
  "snapshot_id": "uuid-v4",
  "agent_id": "agent://example-id",
  "timestamp": "2025-07-28T21:45:00Z",
  "scope": ["content", "ads", "pages"],
  "index": [
    {
      "block_id": "content://abc123",
      "block_type": "article",
      "semantic_tags": ["ai", "web3", "open standards"],
      "relevance_score": 0.92,
      "last_updated": "2025-07-27T14:30:00Z",
      "attribution": {
        "publisher": "stoked.tech",
        "license": "CC-BY-4.0"
      }
    },
    ...
  ]
}
```

---

## 🔄 Use Cases

- Offline sync
- Registry export
- Debugging or reproducibility for agent interactions
- Privacy-first content handoff between trusted agents

---

## 🔐 Privacy & Consent

- May never include user profile blocks unless explicitly authorised
- Can be encrypted for secure transfer between agents

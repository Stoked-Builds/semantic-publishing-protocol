# Time-Versioning Extension Demo

This example demonstrates the `spp:time-versioning` extension for the Semantic Publishing Protocol. The extension enables content to be archived and referenced as fixed, point-in-time snapshots.

## Story Overview

**Climate Summit Breakthrough**: A breaking news story that evolves over time as new information becomes available. This demonstrates real-world usage of the time-versioning extension for tracking editorial changes and maintaining content integrity.

## Files

- **`semantic.json`** - Semantic metadata with time-versioning extension and snapshot history
- **`story.md`** - Current version of the story (v1.2.0)
- **`story-v1.0.0.md`** - Archived initial version for comparison
- **`topics.json`** - Topic definitions used by the story

## Extension Features Demonstrated

### 1. **Snapshot Archive**
The story includes 3 snapshots showing its evolution:
- **v1.0.0** (8:00 AM): Initial reporting with basic facts
- **v1.1.0** (12:30 PM): Updated with official quotes and corrected funding amounts
- **v1.2.0** (4:45 PM): Major expansion as developing nations joined the agreement

### 2. **Archive.org Integration**
Each snapshot includes:
- Archive.org URLs for permanent preservation
- Provider identification (`archive.org`)
- Timestamped references for verification

### 3. **Change Tracking**
Detailed change logs show:
- **Type**: edit, addition, deletion, restructure
- **Path**: JSONPath selectors indicating what changed
- **Description**: Human-readable explanation of changes

### 4. **Version History**
Comprehensive metadata including:
- Creation and modification timestamps
- Revision count tracking
- Editorial notes explaining the evolution

## Usage Example

```json
{
  "extensions": [
    {
      "id": "spp:time-versioning",
      "version": "0.3.0"
    }
  ],
  "snapshots": [
    {
      "timestamp": "2025-01-15T16:45:00Z",
      "version": "1.2.0",
      "content_hash": "sha256:bc47e4823b9c7f2a...",
      "archive_url": "https://web.archive.org/web/20250115164500/...",
      "archive_provider": "archive.org",
      "changes_from_previous": [
        {
          "type": "addition",
          "path": "$.content.blocks[5]",
          "description": "Added breaking news: China and India join the agreement"
        }
      ]
    }
  ]
}
```

## Benefits

### For Publishers
- **Editorial Transparency**: Complete audit trail of changes
- **Content Integrity**: Cryptographic hashes ensure content hasn't been tampered with
- **Archive Integration**: Automatic preservation for long-term access

### For Readers
- **Trust**: Can verify what was said when
- **Context**: Understand how stories developed over time
- **Access**: Permanent archive links ensure availability

### For AI Agents
- **Temporal Reasoning**: Analyze how narratives evolved
- **Fact Checking**: Compare versions to detect changes
- **Source Verification**: Hash validation ensures integrity

## Testing

Run the validator to verify the extension works correctly:

```bash
node examples/validate.js examples/extensions/time-versioning-demo
```

## Specification

Full specification available at: [`specs/extensions/time-versioning.md`](../../../specs/extensions/time-versioning.md)
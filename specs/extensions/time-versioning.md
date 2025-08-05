# Time-Based Versioning Extension

**Extension ID:** `spp:time-versioning`  
**Version:** 0.3.0  
**Specification:** SPP Extension

## Purpose

The Time-Based Versioning extension enables content to be archived and referenced as fixed, point-in-time snapshots. This allows viewers to see what content looked like at specific times, enables agents to reason over versioned narratives, and helps publishers verify editorial history.

## Schema Fields

When using this extension, content MAY include the following additional fields in `semantic.json`:

### Snapshot Archive

```json
{
  "snapshots": [
    {
      "timestamp": "2025-01-15T14:30:00Z",
      "version": "1.0.0",
      "content_hash": "sha256:af09ad5030dac42aad5da6ee660fca0b81a132c523059b8c3c4a34dd06097f69",
      "archive_url": "https://web.archive.org/web/20250115143000/https://example.com/story",
      "archive_provider": "archive.org",
      "changes_from_previous": [
        {
          "type": "edit",
          "path": "$.content.blocks[2].text",
          "description": "Updated statistics with latest data"
        }
      ]
    }
  ]
}
```

### Version History

```json
{
  "version_history": {
    "created_at": "2025-01-15T10:00:00Z",
    "last_modified": "2025-01-15T14:30:00Z",
    "revision_count": 3,
    "editorial_notes": "Updated with breaking news developments"
  }
}
```

## Field Definitions

### snapshots

- **Type:** Array of snapshot objects
- **Required:** No
- **Description:** Collection of point-in-time snapshots of the content

#### Snapshot Object

- `timestamp` (string, required): ISO 8601 timestamp when snapshot was created
- `version` (string, required): Semantic version of content at snapshot time
- `content_hash` (string, required): Hash of content at snapshot time (format: `algorithm:hash`)
- `archive_url` (string, optional): URL to archived version on external service
- `archive_provider` (string, optional): Name of archive service (e.g., "archive.org", "perma.cc")
- `changes_from_previous` (array, optional): Array of change objects describing differences

#### Change Object

- `type` (string): Type of change ("edit", "addition", "deletion", "restructure")
- `path` (string): JSONPath or selector indicating what changed
- `description` (string): Human-readable description of the change

### version_history

- **Type:** Object
- **Required:** No
- **Description:** Metadata about the content's version history

#### Version History Object

- `created_at` (string, required): ISO 8601 timestamp of initial creation
- `last_modified` (string, required): ISO 8601 timestamp of most recent modification
- `revision_count` (number, optional): Total number of revisions made
- `editorial_notes` (string, optional): Notes about recent changes

## Usage

### Declaring the Extension

Add the extension to your `semantic.json`:

```json
{
  "extensions": [
    {
      "id": "spp:time-versioning",
      "version": "0.3.0"
    }
  ]
}
```

### Complete Example

```json
{
  "id": "breaking-news-story",
  "title": "Major Policy Announcement Reshapes Industry",
  "extensions": [
    {
      "id": "spp:time-versioning",
      "version": "0.3.0"
    }
  ],
  "snapshots": [
    {
      "timestamp": "2025-01-15T10:00:00Z",
      "version": "1.0.0",
      "content_hash": "sha256:1234567890abcdef...",
      "archive_url": "https://web.archive.org/web/20250115100000/https://news.example/story",
      "archive_provider": "archive.org"
    },
    {
      "timestamp": "2025-01-15T14:30:00Z",
      "version": "1.1.0",
      "content_hash": "sha256:af09ad5030dac42a...",
      "archive_url": "https://web.archive.org/web/20250115143000/https://news.example/story",
      "archive_provider": "archive.org",
      "changes_from_previous": [
        {
          "type": "edit",
          "path": "$.content.blocks[2].text",
          "description": "Updated statistics with latest government data"
        },
        {
          "type": "addition",
          "path": "$.content.blocks[5]",
          "description": "Added official statement from ministry"
        }
      ]
    }
  ],
  "version_history": {
    "created_at": "2025-01-15T10:00:00Z",
    "last_modified": "2025-01-15T14:30:00Z",
    "revision_count": 2,
    "editorial_notes": "Story updated with official response and corrected statistics"
  }
}
```

## Use Cases

### Content Verification
- Verify what a story said at a specific point in time
- Track narrative changes and editorial decisions
- Provide audit trail for fact-checking

### Agent Reasoning
- Analyze how stories evolved over time
- Detect potential manipulation or bias in updates
- Compare multiple sources' version histories

### Archive Integration
- Automatically submit content to archive services
- Reference canonical archived versions
- Ensure long-term content preservation

## Implementation Notes

### Archive Providers
Common archive providers include:
- `archive.org` - Internet Archive Wayback Machine
- `perma.cc` - Harvard Library's permanent archival service
- `archive.today` - Community-driven archive service
- Custom institutional archives

### Content Hashing
- Use SHA-256 or stronger algorithms
- Hash the canonical content representation
- Include format: `sha256:hashvalue` or `sha3-256:hashvalue`

### Version Semantics
- Follow semantic versioning (major.minor.patch)
- Major: Substantial content changes
- Minor: Additions or clarifications
- Patch: Corrections or formatting fixes

## Backward Compatibility

This extension is fully backward compatible. Agents that don't recognize the extension will ignore these fields without breaking core functionality.

## Privacy Considerations

- Snapshots may preserve content that was later retracted
- Consider implications before archiving sensitive content
- Respect robot.txt and archive policies of target services
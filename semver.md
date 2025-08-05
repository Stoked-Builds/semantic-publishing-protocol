# Semantic Versioning for the Semantic Publishing Protocol (SPP)

**Version:** 0.2  
**Status:** Production-Ready  
**Date:** 2025-01-01  
**Purpose:** Define comprehensive versioning rules, compatibility policies, and protocol evolution guidelines

---

The Semantic Publishing Protocol (SPP) follows [Semantic Versioning 2.0.0](https://semver.org/) to ensure predictable evolution, clear compatibility guarantees, and smooth adoption across the ecosystem. This document defines how versions are incremented, what constitutes breaking changes, and how agents and publishers maintain compatibility over time.

---

## 1. Versioning Format

SPP uses the standard semantic versioning format:

```
MAJOR.MINOR.PATCH
```

- **MAJOR**: Incompatible API changes, breaking protocol modifications, or structural schema changes
- **MINOR**: Backward-compatible functionality additions, new optional features, or non-breaking enhancements  
- **PATCH**: Backward-compatible bug fixes, documentation updates, or editorial corrections

### Pre-release and Build Metadata

- **Pre-release**: `MAJOR.MINOR.PATCH-alpha.1`, `MAJOR.MINOR.PATCH-beta.2`, `MAJOR.MINOR.PATCH-rc.1`
- **Build metadata**: `MAJOR.MINOR.PATCH+20250101.commit.abc123`

**Examples:**
- `0.1.0` - Initial public release
- `0.2.0` - Added consent engine and agent interfaces
- `0.2.1` - Fixed documentation and examples
- `1.0.0-beta.1` - First stable release candidate
- `1.0.0` - First stable release

---

## 2. Protocol-Level Change Categories

### 2.1 MAJOR Version Changes (Breaking)

**Triggers a MAJOR version increment:**

- **Core Entity Schema Changes**: Removing, renaming, or changing the type of required fields in Document, Claim, Amendment, Reference, Entity, Timeline, or Signature entities
- **Protocol Structure Modifications**: Changes to the fundamental protocol flow, routing mechanisms, or core data structures
- **API Contract Breaks**: Removing or significantly altering existing endpoints, methods, or data formats
- **Compliance Level Changes**: Modifications that require existing compliant implementations to be updated
- **Authentication/Security Changes**: Breaking changes to signature algorithms, identity schemes, or trust models
- **Namespace/Identifier Changes**: Modifications to core identifier formats (e.g., `doc:`, `claim:`, `ref:` prefixes)

**Examples:**
```diff
# MAJOR: Required field type change
- "created_at": "string"
+ "created_at": { "timestamp": "string", "timezone": "string" }

# MAJOR: Removing required entity properties
- "document_id": "string"
- "title": "string"
+ "document_id": "string"
# title field removed - breaks existing parsers
```

### 2.2 MINOR Version Changes (Non-Breaking)

**Triggers a MINOR version increment:**

- **Optional Field Additions**: Adding new optional fields to existing entities
- **New Entity Types**: Introducing entirely new entity types or extensions
- **Feature Additions**: New optional protocol features that don't affect existing implementations
- **Enhanced Validation**: Additional optional validation rules or compliance checks
- **New Agent Capabilities**: Adding new agent interface methods or behaviors that are backward-compatible
- **Documentation Enhancements**: Significant documentation improvements or new examples

**Examples:**
```diff
# MINOR: Adding optional fields
{
  "document_id": "doc:123",
  "title": "Example",
+ "tags": ["optional", "new-field"],
+ "priority": "normal"
}

# MINOR: New optional entity type
+ {
+   "entity_type": "ai_agent",
+   "capabilities": ["read", "analyze"]
+ }
```

### 2.3 PATCH Version Changes (Non-Breaking)

**Triggers a PATCH version increment:**

- **Bug Fixes**: Correcting implementation errors or edge cases
- **Documentation Updates**: Fixing typos, clarifying language, improving examples
- **Editorial Changes**: Non-normative improvements to specification text
- **Example Corrections**: Fixing errors in code examples or sample data
- **Performance Optimizations**: Internal improvements that don't change external behavior

---

## 3. Schema Evolution Rules

### 3.1 Backward Compatibility

**Required for MINOR and PATCH versions:**

- **Field Addition**: New fields must be optional with sensible defaults
- **Enum Extension**: New enum values can be added if processors can handle unknown values gracefully
- **Validation Relaxation**: Making validation rules less strict is allowed
- **Format Extensions**: Adding new optional formats or encoding schemes

### 3.2 Forward Compatibility

**Processors must implement:**

- **Unknown Field Tolerance**: Ignore unknown fields in JSON objects without failing
- **Graceful Degradation**: Continue processing when encountering unknown enum values or extensions
- **Version Declaration Respect**: Check document version declarations and handle unsupported versions appropriately

### 3.3 Deprecation Policy

**For fields or features marked for removal:**

1. **Announcement**: Deprecation notice in MINOR version release notes
2. **Grace Period**: Minimum one MINOR version before removal consideration
3. **Migration Guide**: Clear documentation on migration path
4. **Removal**: Only in MAJOR version with comprehensive migration documentation

---

## 4. Agent and Publisher Compatibility

### 4.1 Agent Compatibility Matrix

| Agent Version | Can Process v0.1 | Can Process v0.2 | Can Process v1.0 |
|---------------|------------------|------------------|------------------|
| v0.1          | ✅ Full          | ❌ Limited*       | ❌ No           |
| v0.2          | ✅ Full          | ✅ Full          | ❌ Limited*      |
| v1.0          | ✅ Full**        | ✅ Full**        | ✅ Full          |

*Limited: Can process known fields, may ignore new features  
**Full: If backward compatibility is maintained

### 4.2 Publisher Compatibility Requirements

**Publishers MUST:**

- Declare protocol version in document frontmatter (`sps_version: "0.2"`)
- Include compliance level indicator (`sps_compliance_level: 2`)
- Provide graceful fallbacks for unsupported agent versions
- Maintain backward compatibility for at least one MAJOR version

**Publishers SHOULD:**

- Support multiple protocol versions simultaneously
- Provide version-specific endpoints or content negotiation
- Include migration notices for deprecated features

### 4.3 Agent Compatibility Requirements

**Agents MUST:**

- Check document version declarations before processing
- Handle unknown fields gracefully (ignore without error)
- Fail fast with clear error messages for unsupported versions
- Respect publisher compatibility declarations

**Agents SHOULD:**

- Support multiple protocol versions
- Provide clear feedback about supported/unsupported features
- Implement progressive enhancement for newer protocol features

---

## 5. Upgrade and Downgrade Policies

### 5.1 Upgrade Path

**PATCH Updates:**
- ✅ **Safe**: Automatic updates recommended
- ✅ **Zero Downtime**: No breaking changes expected
- ✅ **Rollback**: Simple rollback to previous PATCH version

**MINOR Updates:**
- ✅ **Safe**: Automatic updates recommended with testing
- ✅ **Backward Compatible**: Existing functionality preserved
- ⚠️ **Testing Recommended**: Verify new features don't conflict
- ✅ **Rollback**: Rollback supported, may lose new features

**MAJOR Updates:**
- ⚠️ **Manual Review Required**: Breaking changes present
- ❌ **Manual Migration**: Code/configuration changes needed
- ⚠️ **Testing Essential**: Comprehensive testing required
- ❌ **Complex Rollback**: May require data migration or feature removal

### 5.2 Downgrade Policy

**Supported Downgrades:**
- PATCH to previous PATCH (within same MINOR)
- MINOR to previous MINOR (within same MAJOR)
- MAJOR downgrades require manual intervention

**Downgrade Risks:**
- Loss of new features or data fields
- Potential compatibility issues with newer documents
- May require content republishing for compatibility

---

## 6. Implementation Guidelines

### 6.1 Version Detection

**In Document Frontmatter:**
```yaml
---
sps_version: "0.2"
sps_compliance_level: 2
document_id: "doc:example-123"
# ... other fields
---
```

**In Agent Headers:**
```http
User-Agent: MyAgent/1.0 (SPP/0.2)
Accept: application/sps+json; version=0.2
```

### 6.2 Error Handling

**Version Mismatch:**
```json
{
  "error": "version_mismatch",
  "message": "Document requires SPP v0.3, agent supports up to v0.2",
  "supported_versions": ["0.1", "0.2"],
  "document_version": "0.3"
}
```

**Graceful Degradation:**
```json
{
  "status": "partial_success",
  "processed_fields": ["document_id", "title", "claims"],
  "ignored_fields": ["new_feature_field"],
  "warnings": ["Unknown field 'new_feature_field' ignored"]
}
```

### 6.3 Migration Support

**Automated Migration Tools:**
- Version-specific migration scripts
- Validation tools for compatibility checking
- Automated testing suites for version compatibility

**Documentation Requirements:**
- Migration guides for each MAJOR version
- Compatibility matrices for agent/publisher combinations
- Example implementations for common migration scenarios

---

## 7. Release Process

### 7.1 Pre-Release Validation

1. **Compatibility Testing**: Verify backward/forward compatibility
2. **Migration Path Validation**: Test upgrade/downgrade scenarios
3. **Documentation Review**: Ensure migration guides are complete
4. **Community Feedback**: Solicit input from implementers

### 7.2 Release Announcement

**Include in release notes:**
- Version increment justification
- List of breaking changes (if MAJOR)
- New features and enhancements
- Migration instructions
- Compatibility matrix updates
- Timeline for deprecation notices

---

## 8. Related Documentation

- [SPS-Versions.md](./specs/SPS-Versions.md) - Detailed versioning specification
- [Changelog](./docs/changelog.md) - Historical version changes
- [SPS-Compliance](./specs/SPS-Compliance.md) - Compliance level definitions
- [SPS-Core](./specs/SPS-Core.md) - Core entity definitions

---

*This document is part of the Semantic Publishing Protocol specification. For questions or contributions, see [CONTRIBUTING.md](./CONTRIBUTING.md).*
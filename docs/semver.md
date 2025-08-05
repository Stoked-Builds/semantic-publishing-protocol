# Semantic Publishing Protocol (SPP) Versioning Policy

The Semantic Publishing Protocol follows [Semantic Versioning 2.0.0](https://semver.org/) to ensure predictable evolution and clear compatibility guarantees across the ecosystem.

## Version Format

SPP uses the standard semantic versioning format:

```
MAJOR.MINOR.PATCH
```

- **MAJOR**: Incompatible changes that break existing implementations
- **MINOR**: Backward-compatible functionality additions
- **PATCH**: Backward-compatible bug fixes and documentation updates

## What Constitutes Breaking vs Non-Breaking Changes

### Breaking Changes (MAJOR version increment)

- **Schema Changes**: Removing or renaming required fields in core entities (Document, Claim, Amendment, Reference, etc.)
- **Protocol Structure**: Changes to fundamental protocol flow or data structures
- **API Breaks**: Removing or significantly altering existing endpoints or methods
- **Authentication**: Breaking changes to signature algorithms or trust models
- **Identifiers**: Modifications to core identifier formats (e.g., `doc:`, `claim:`, `ref:` prefixes)

### Non-Breaking Changes (MINOR version increment)

- **Optional Fields**: Adding new optional fields to existing entities
- **New Features**: New optional protocol features that don't affect existing implementations
- **Extensions**: New entity types or capabilities that are backward-compatible
- **Enhanced Validation**: Additional optional validation rules

### Bug Fixes (PATCH version increment)

- **Bug Fixes**: Correcting implementation errors or edge cases
- **Documentation**: Fixing typos, clarifying language, improving examples
- **Performance**: Internal optimizations that don't change external behavior

## Policy on Optional Extensions and Draft Specs

### Extensions

- **Optional by Default**: All extensions must be optional and not break core protocol functionality
- **Graceful Degradation**: Agents must handle unknown extensions gracefully
- **Version Independence**: Extensions can evolve independently of core protocol versions
- **Documentation**: Extensions must include clear compatibility requirements

### Draft Specifications

- **Pre-release Versioning**: Draft specs use pre-release identifiers (e.g., `1.0.0-alpha.1`, `1.0.0-beta.2`)
- **No Stability Guarantees**: Breaking changes are allowed in draft versions
- **Migration Path**: Final release must include migration guides from draft versions
- **Community Feedback**: Draft periods allow for community input and iteration

## Release Cadence Expectations

### Regular Releases

- **PATCH Releases**: As needed for bug fixes (typically monthly)
- **MINOR Releases**: Quarterly for new features and enhancements
- **MAJOR Releases**: Annually or as needed for significant architectural changes

### Emergency Releases

- **Security Fixes**: Immediate PATCH releases for security vulnerabilities
- **Critical Bugs**: Expedited PATCH releases for critical functionality issues

### Version Support

- **Current MAJOR**: Full support with regular updates
- **Previous MAJOR**: Security fixes and critical bug fixes for 12 months
- **Older Versions**: Community support only

### Communication

- **Advance Notice**: MAJOR version changes announced at least 3 months in advance
- **Deprecation Warnings**: Features marked for removal get minimum 6-month notice
- **Migration Guides**: Comprehensive documentation provided for all breaking changes

---

For detailed technical specifications and implementation guidelines, see the comprehensive [semver.md](../semver.md) in the repository root.

*This document is part of the Semantic Publishing Protocol specification. For questions or contributions, see [CONTRIBUTING.md](../CONTRIBUTING.md).*
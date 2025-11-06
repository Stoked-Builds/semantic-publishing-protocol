# Schema Release Sync Workflow

This repository now publishes versioned bundles of the canonical JSON Schemas under `schemas/releases/<spec_version>/`. Use the helper script when you cut a new `spec_version` or refresh the bundle.

## Prerequisites
- Node.js 18+ (required for native `fs/promises` and `crypto` APIs)
- Clean git worktree (script refuses to overwrite existing release directories)

## Generate a Release Bundle

```bash
node scripts/sync-schemas.mjs 0.4.0
```

The script will:
1. Collect every `.json` schema under `schemas/` (excluding `schemas/releases/`)
2. Copy them into `schemas/releases/0.4.0/`
3. Generate `manifest.json` with SHA-256 checksums for each file
4. Emit a `checksums.txt` compatible with `shasum -c`
5. Create a minimal `package.json` so the directory can be published as `@spp/schemas`

## Publishing Checklist
- [ ] Run `node scripts/sync-schemas.mjs <version>`
- [ ] Commit the generated directory and manifest files
- [ ] Tag the repo (`git tag schemas@<version>`)
- [ ] Publish `schemas/releases/<version>` to npm (optional) or distribute via tarball
- [ ] Update release notes describing schema changes

## Regenerating

If you need to regenerate the same version, delete the existing directory first:

```bash
rm -rf schemas/releases/0.4.0
node scripts/sync-schemas.mjs 0.4.0
```

⚠️ The script intentionally refuses to overwrite an existing release directory to avoid accidental clobbering.

# Validator Tool for SPS Files

This directory contains `validate.py`, a Python script for validating `.sps.md` files against the Semantic Publishing Specification (SPS).

---

## Usage

```sh
python tools/validate.py path/to/example.sps.md
```

- Only `.sps.md` files with YAML frontmatter are supported.
- Requires Python 3.7+ and the `pyyaml` package (install with `pip install pyyaml`).

---

## What It Checks
- Presence of required frontmatter fields (document_id, title, authors, created_at, claims, references, timeline, signatures, sps_compliance_level)
- Proper formatting of `claims` and `references` (must use `claim:` and `ref:` prefixes)

---

## Output
- `PASS: File is SPS-compliant.` — All checks passed.
- `FAIL: Missing required fields: ...` — One or more required fields are missing.
- `FAIL: Formatting errors:` — Claims or references are not properly formatted.
- `FAIL: No valid frontmatter found (--- ... ---)` — The file does not contain valid YAML frontmatter.

---

## Example

```sh
python tools/validate.py examples/example-01.sps.md
```

---

## See Also
- [QUICKSTART.md](../docs/QUICKSTART.md)
- [SPS Compliance Levels](../specs/sps-compliance-levels.md)

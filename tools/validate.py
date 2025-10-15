#!/usr/bin/env python3
"""
validate.py – SPP v0.4 .spp.md Validator

Validates SPP Markdown files for required frontmatter fields, claim/reference formatting, and outputs summary results.

Usage:
    python tools/validate.py <path-to-file.spp.md>

Requirements:
    - Python 3.7+
    - PyYAML (for frontmatter parsing)
    - spp_compliance_level
"""
import sys
import re
import yaml
from pathlib import Path

def parse_frontmatter(md_text):
    match = re.match(r'^---\n(.*?)\n---', md_text, re.DOTALL)
    if not match:
        return None
    return yaml.safe_load(match.group(1))

def check_required_fields(frontmatter, required_fields):
    missing = [f for f in required_fields if f not in frontmatter]
    return missing

def check_claims_and_refs(frontmatter):
    errors = []
    # Claims: should be a list of strings or dicts with claim: prefix
    claims = frontmatter.get('claims', [])
    for c in claims:
        if isinstance(c, str):
            if not c.startswith('claim:'):
                errors.append(f"Invalid claim reference: {c}")
        elif isinstance(c, dict):
            if 'claim_id' not in c or not c['claim_id'].startswith('claim:'):
                errors.append(f"Invalid claim object: {c}")
    # References: should be a list of strings or dicts with ref: prefix
    refs = frontmatter.get('references', [])
    for r in refs:
        if isinstance(r, str):
            if not r.startswith('ref:'):
                errors.append(f"Invalid reference: {r}")
        elif isinstance(r, dict):
            if 'reference_id' not in r or not r['reference_id'].startswith('ref:'):
                errors.append(f"Invalid reference object: {r}")
    return errors

def main():
    if len(sys.argv) != 2:
        print("Usage: python tools/validate.py <path-to-file.spp.md>")
        sys.exit(1)
    file_path = Path(sys.argv[1])
    if not file_path.exists():
        print(f"File not found: {file_path}")
        sys.exit(1)
    md_text = file_path.read_text(encoding='utf-8')
    frontmatter = parse_frontmatter(md_text)
    if not frontmatter:
        print("FAIL: No valid frontmatter found (--- ... ---)")
        sys.exit(1)
    required_fields = [
        'document_id', 'title', 'authors', 'created_at',
        'claims', 'references', 'timeline', 'signatures', 'spp_compliance_level'
    ]
    missing = check_required_fields(frontmatter, required_fields)
    errors = check_claims_and_refs(frontmatter)
    if missing:
        print(f"FAIL: Missing required fields: {', '.join(missing)}")
    if errors:
        print("FAIL: Formatting errors:")
        for e in errors:
            print(f"  - {e}")
    if not missing and not errors:
        print("PASS: File is SPP-compliant.")
    else:
        sys.exit(1)

if __name__ == "__main__":
    main()

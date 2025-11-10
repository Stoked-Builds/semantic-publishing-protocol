# review-board-run Helper

This document specifies the behaviour for a future CLI helper that mirrors the Review Board automation flow. Implementers should follow this spec when adding `scripts/review-board-run.mjs`.

## Goals
- Allow maintainers to seed or rerun Review Board deliberations locally without invoking n8n.
- Produce artefacts identical to the automated pipeline so repo history remains deterministic.

## Expected Behaviour
1. Accept flags for `--proposal <id>`, `--round <initial|adjustment|final>`, `--persona <name>`, and `--dry-run`.
2. Load dossier and prior scorecards from `docs/governance/review-board/archive/<proposal-id>/`.
3. Render prompts using the persona templates and call the configured LLM endpoint (default: local Ollama model names defined in `.env.review-board`).
4. Write outputs to the appropriate archive subfolders (transcripts, scorecards) and update markdown tables.
5. When invoked with `--finalise`, generate the decision record via the Chair persona and append the outcome to `CHANGELOG.md`.
6. Exit with non-zero status if domain floors are breached or acceptance thresholds fail, signalling the need for escalation.

## Implementation Sketch
- Use `node --loader ts-node/esm` or a plain ESM module (align with repo conventions).
- Share utilities with existing `scripts/` modules where possible (logging, file IO, Git wrappers).
- Include snapshot tests validating prompt generation and score aggregation once implemented.

Document deviations from this contract inside this file so contributors can track tool evolution.

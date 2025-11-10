# Review Board Operations

This directory publishes the deliberation process, artefacts, and history for the Semantic Publishing Protocol (SPP) Review Board.

## Directory Layout
- `README.md` — overview and how to engage with the board.
- `CHANGELOG.md` — chronological log of board decisions, including score summaries and follow-up actions.
- `templates/` — reusable markdown forms for dossiers, scorecards, and decision write-ups.
- `archive/` — immutable folders for each proposal (`<proposal-id>/`) containing the briefing dossier, agent transcripts, score matrices, and final verdict.

## Engagement Workflow
1. Raise a GitHub issue using the `proposal/review-board` template. Include context, impacted artefacts, deadlines, and required decision date.
2. Automation (or the requestor) assembles the dossier using `templates/dossier.md` and commits it to `docs/governance/review-board/archive/<proposal-id>/` before deliberations start.
3. The board runs structured rounds (Initial, Adjustment, Final). After each round, members update the scorecard (`templates/scorecard.md`) and publish the interim results to the issue thread.
4. When the acceptance criteria are met (mission hierarchy satisfied, blended score ≥ 75, domain floors respected) the Chair records the decision using `templates/decision-record.md`, updates the CHANGELOG, and links the artefacts from the issue/PR.
5. If consensus fails, the Chair escalates to the named human steward with the unresolved trade-offs and proposed options.

## Transparency Commitments
- All deliberation artefacts are committed to the public repo. Redactions may only occur for legal or security-sensitive material and must be noted explicitly.
- Scores, justifications, and dissent are published verbatim to maintain external auditability.
- Automation scripts (`flows/review-board/`) must be open and deterministic so contributors can reproduce the decision trail locally.

## Human Stewardship
- Mark Stokes serves as the final escalation point when acceptance criteria are not met or mission conflicts arise.
- Retrospectives should be scheduled quarterly (or after contentious rulings) and updates captured in the contributor handbook (`docs/handbook/decision-log.md`, create if absent) and this README.

For more detail on roles, scoring, and automation expectations, refer to `AGENTS.md` in the repository root.

# Review Board Automation Flow

This document outlines the automation used to coordinate Review Board deliberations for the Semantic Publishing Protocol. A production implementation should be built with n8n (self-hosted) and mirror the steps below so decisions remain deterministic and auditable.

## Trigger
- **Source:** GitHub issue labelled `proposal/review-board` in this repository.
- **Event:** Label applied or issue opened with the proposal template.

## Workflow Stages
1. **AI Agent Boot**
   - Trigger: GitHub issue labeled `proposal/review-board`.
   - n8n AI Agent loads `IssueID`, title, body, and mission context into memory (`proposal-<IssueID>` session key).
   - First tool call must be `Get or Create Review` (workflow `n8n-review-board-helper-get-create-review.json`).
2. **Branch & Archive Setup**
   - Helper tool returns `proposalId`, `branch`, `folder`, `dossierPath`, `scorecardPath`.
   - Branch naming: `review-board/proposal-<IssueID>`. Archive folder: `docs/governance/review-board/archive/proposal-<IssueID>/`.
   - If branch/folder exists, helper simply rehydrates the metadata.
3. **Issue Acknowledgement**
   - AI Agent posts a structured comment (`tool: issue-comment`) including slug (if generated), branch name, dossier path, and next steps.
   - Comment template should show “Round: Initial”, point to the archive folder, and list upcoming personas.
4. **Briefing Assembly**
   - Agent calls helper tools to copy dossier + scorecard templates (already handled in helper).
   - Fetch impacted files or references noted in the issue; save snapshots beneath `archive/proposal-<IssueID>/briefing/` if automation supports it.
5. **Persona Rounds (Initial, Adjustment, Final)**
   - For each round, Agent invokes persona tools in this set: Innovation, Ethics, Finance, DevX, Adoption.
   - Each persona tool receives dossier path + round + acceptance criteria, emits `{score (0-100), justification, blockers, actions, transcriptPath}`.
   - Persona outputs must be persisted as transcripts under `archive/proposal-<IssueID>/transcripts/<persona>-roundX.md`.
6. **Score Aggregation & Status Update**
   - Agent calls `score-aggregator` tool with array of persona outputs.
   - Aggregator applies weights (Innovation 25%, Ethics 15%, Finance 20%, DevX 20%, Adoption 20), enforces floor (Ethics/Finance ≥70), writes scorecard, and returns `blendedScore`, `floorsPassed`, `status`.
   - Agent posts issue comment summarising scores, blockers, and status (`in_review`, `changes_requested`, `approved`, `denied`).
7. **Iteration Control**
   - If `status = changes_requested` and rounds < 3, Agent records the blockers, pauses, and waits for rerun (manual trigger).
   - If `status = approved` → proceed to Finalisation. If `status = denied` or rounds exhausted → escalate.
8. **Decision Publication**
   - Agent invokes Chair persona tool with dossier + latest score summary to generate `decision-record.md`.
   - Write decision record into `archive/proposal-<IssueID>/` and update `docs/governance/review-board/CHANGELOG.md`.
   - Use `issue-comment` tool to post final outcome and link to decision record.
9. **PR Creation**
   - Agent calls `create-pr` tool to open/update a PR from `review-board/proposal-<IssueID>` into `main`, referencing the decision record.
   - PR body should include links to dossier, scorecard, decision, and issue comment.
10. **Escalation Handling**
    - If decision is denied or rounds exhausted without meeting criteria, Agent triggers the pending “human-in-loop” notifier (phase 2) or posts a summary tagging Mark with risks/opportunities.

## Configuration Notes
- Store API keys and model configuration as n8n credentials; do not hard-code in the workflow.
- Provide a dry-run switch so maintainers can test locally without committing artifacts.
- Ensure automations respect branch protections by creating PRs instead of direct pushes when necessary.
- Tool registry for the AI Agent:
  - `n8n-review-board-helper-get-create-review.json` — seeds/rehydrates proposal branch and archive (returns `proposalId`, `branch`, `folder`, `dossierPath`, `scorecardPath`).
  - Persona tools (Innovation, Ethics, Finance, DevX, Adoption, Chair) — run LLM prompts, commit transcripts.
  - `score-aggregator` — updates scorecard, computes blended score, enforces floors, returns status.
  - `issue-comment` — posts status updates (slug/branch/round/persona scores/next actions) and final decision.
  - `create-pr` — opens/updates a PR from the proposal branch into `main`.
- Future human-in-loop notifier will be added as a tool once escalation requirements are defined.

## Future Enhancements
- Generate visual score trend charts per proposal for quick comprehension.
- Publish a dashboard of board metrics (decision duration, escalations, satisfaction).
- Integrate with CI to block merges if the latest proposal lacks an attached decision record.

> Keep this workflow definition versioned. Update this README whenever the flow changes and reference export files (`flow.json`) if committed.

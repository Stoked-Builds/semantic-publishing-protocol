# Punk Forge — Review Board Workflow (n8n v1)

This document defines the first pass at an automated Specification Review Board workflow in n8n for Punk Forge feature and spec-alignment requests. It uses the open issue `issues/spp-spec-and-schema-alignment.md` (“Require \`spec_version\`”) as the seed use-case, but the flow is reusable for future proposals. Archive folders follow `<proposalId>-<proposalSlug>` so IDs remain deterministic while names stay legible.

## Objectives
- Create a deterministic, replayable approval path that mirrors the Review Board process already described in `flows/review-board/README.md`.
- Provide a structured artifact trail inside `docs/governance/review-board/archive/<proposalId>-<proposalSlug>/`.
- Give the requester actionable outcomes: **Approved**, **Changes Requested**, or **Denied**, with clear persona-sourced reasoning.
- Keep the workflow in n8n so it can run on the existing self-hosted instance alongside other Punk Forge automations.

## Actors & Inputs
| Actor / System | Role |
| --- | --- |
| GitHub Issue (`proposal/review-board` template) | Primary trigger payload (`title`, `body`, `labels`, `links`). |
| n8n Workflow | Orchestrates dossier creation, persona prompting, scoring, and outcomes. |
| Persona LLMs (Innovation, Ethics, Finance, DevX, Adoption, Chair) | Generate structured responses and scores. Default to local Ollama models configured via n8n credentials. |
| Storage (`docs/governance/review-board/archive/<proposalId>-<proposalSlug>/`) | Dossier, transcripts, scorecards, decision records. |
| Notifications (Matrix/Slack/Email) | Inform stakeholders at each major state change. |

## Data Model
```jsonc
{
  "proposalId": "proposal-247",
  "proposalSlug": "spec-version-align",
  "issueNumber": 247,
  "title": "Spec & Schema Alignment: Require `spec_version`",
  "requestor": "markstokes",
  "summary": "...",
  "impacts": ["schemas/semantic.json", "specs/publishing/semantic-json.md", "Punk Forge registry"],
  "targetDecisionDate": "2024-07-05",
  "round": "initial|adjustment|final",
  "personaOutputs": [
    {
      "name": "Innovation",
      "score": 78,
      "justification": "…",
      "actions": ["…"],
      "rawResponsePath": "docs/.../transcripts/innovation-round1.md"
    }
  ],
  "blendedScore": 81,
  "status": "in_review|changes_requested|approved|denied|escalated",
  "decisionRecordPath": "docs/.../decision.md"
}
```

## Workflow Overview
```
GitHub Issue Trigger
   ↓
Bootstrap Intake
   ↓
Dossier Builder
   ↓
Persona Orchestration (parallel per persona)
   ↓
Score Aggregation + Threshold Checks
   ↙             ↓             ↘
Changes Requested  Final Approval  Denial / Escalation
```

### 1. Trigger (GitHub Issue Webhook)
- **Node:** `Webhook` (n8n GitHub App or personal token).
- **Filter:** `action in ["opened","labeled"]` AND label `proposal/review-board`.
- **Init:** Set `proposalId = "proposal-" + issue.number`. Generate a companion `proposalSlug` (≤25 chars, lowercase, kebab case) via an AI helper node seeded with the issue title/summary; default to the title slug if generation fails.
- **Side effect:** Create a lightweight status comment acknowledging automation start.

### 2. Bootstrap Intake
- **Nodes:** `Function` + `File` operations.
- Validate required fields (`title`, `body`, `target decision date` block in issue body).
- Ensure archive folder exists: `docs/governance/review-board/archive/<proposalId>-<proposalSlug>/` (fall back to just `proposalId` if slug generation fails).
- Copy dossier template and inject issue metadata (use `n8n-nodes-base.template` or `Function`).
- Create feature branch `review-board/proposal-<issueNumber>` and stage the dossier plus archive folder; never operate directly on `main`.
- Commit via `Git` node and keep branch reference in workflow context for later PR creation.

### 3. Briefing Assembly
- Parse referenced files from issue body (look for fenced block `Impacted Artifacts`).
- Use `HTTP Request` + `GitHub API` to fetch file snapshots; save under `archive/<proposalId>/briefing/`.
- Optionally freeze related discussion threads via `GitHub -> Issues -> Comments` and store JSON.

### 4. Persona Prompting Loop
- **Node group:** `SplitInBatches` over persona array, `Function` to craft prompt, `OpenAI/Ollama` (configured per persona via credential + model mapping), `Markdown` writer.
- Prompt contract:
  - Provide dossier, mission hierarchy, scoring table, acceptance criteria (≥75 overall, domain floors).
  - Persona returns JSON `{score, justification, blockers, actions}`.
- Persist transcript for each persona (`archive/.../transcripts/<persona>-round<X>.md`).
- Capture structured outputs in workflow context for scoring.

### 5. Score Aggregation
- **Node:** `Function`.
- Apply weights (e.g., Innovation 25%, Ethics 15%, Finance 20%, DevX 20%, Adoption 20%).
- Check domain floors (e.g., Ethics and Finance must be ≥70).
- Update scorecard markdown (use template) and commit.
- Post interim summary comment to the issue with table of persona scores and recommended actions.
- Include in the issue comment the generated slug, branch name, dossier path, and current round/state so humans can follow the artifacts and rerun the workflow manually if required.

### 6. Decision Branching
- If `blendedScore ≥ 75` AND no floor breaches → route to **Final Approval**.
- If `floor breach` OR persona flagged blockers → set status `changes_requested`.
- If after `maxRounds = 3` acceptance still fails → escalate/deny.

### 7. Final Approval Path
- Trigger Chair persona prompt that summarises rationale, lists required follow-up tasks, and states “Approved”.
- Write `decision-record.md`, update `docs/governance/review-board/CHANGELOG.md`, and comment on the GitHub issue.
- Optionally raise automation PR bundling dossier, scorecard, decision record.

### 8. Changes Requested Path
- Construct actionable checklist from persona blockers.
- Comment on issue tagging requester, include zipped transcripts or direct links.
- Leave workflow waiting for human to re-run (via manual n8n button or CLI helper) after updates.

### 9. Denial / Escalation Path
- Chair persona summarises rejection reasons.
- Notify steward (Mark) via preferred channel (Matrix) with risk summary.
- Update issue labels (`status/rejected`) and archive transcripts.

## n8n Implementation Notes
- **Workflow Name:** `punk-forge-review-board-v1`.
- **Environment Variables / Credentials:**
  - `PF_GITHUB_TOKEN` (read/write).
  - `PF_GIT_USER`, `PF_GIT_EMAIL`.
  - `OLLAMA_BASE_URL` or remote LLM credentials per persona.
  - `REVIEW_BOARD_ARCHIVE_PATH` (default `docs/governance/review-board/archive`).
- **Testing:** Add a manual trigger node that loads fixture payloads from `flows/review-board/fixtures/*.json`.
- **Dry Run Toggle:** Boolean input that skips git commits and instead stores artifacts under `/tmp/review-board`.
- **Error Handling:** Global `Error` workflow that posts failure comment and pings steward.

## Next Steps Checklist
1. Export GitHub webhook payload sample for `issues/spp-spec-and-schema-alignment.md`.
2. Build n8n workflow skeleton with nodes listed above; store export as `flows/review-board/punk-forge-review-board-v1.json` once stable.
3. Prepare persona prompt templates (MD files) and link them inside the workflow using `Read Binary File` nodes.
4. Decide on git automation strategy (direct commit vs PR branch) and script credentials in n8n environment.
5. Run dry-run against the current feature request, capture artifacts, and iterate on scoring weights as needed.

Document updates to this plan in this file so future contributors can trace workflow evolution.

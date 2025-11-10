# Review Board Automation Flow

This document outlines the automation used to coordinate Review Board deliberations for the Semantic Publishing Protocol. A production implementation should be built with n8n (self-hosted) and mirror the steps below so decisions remain deterministic and auditable.

## Trigger
- **Source:** GitHub issue labelled `proposal/review-board` in this repository.
- **Event:** Label applied or issue opened with the proposal template.

## Workflow Stages
1. **Bootstrap**
   - Validate issue payload against required fields (title, summary, impacted artefacts, target decision date).
   - Create working folder `docs/governance/review-board/archive/<proposal-id>/` if it does not exist.
   - Commit the initial dossier template populated with issue metadata.
2. **Briefing Assembly**
   - Fetch referenced files (specs, schemas, metrics) and attach them to the dossier.
   - Capture relevant discussion threads (e.g. forums, community feedback) as static snapshots.
3. **Persona Prompting**
   - For each persona (Innovation, Ethics, Finance, DevX, Adoption):
     - Generate a prompt packet containing the dossier, mission hierarchy, and scoring rules.
     - Run via configured LLM provider (local Ollama preferred; fall back to hosted models if needed).
     - Parse response into score, justification, and recommended adjustments.
   - Persist raw transcripts under `archive/<proposal-id>/transcripts/`.
4. **Score Aggregation**
   - Update the scorecard markdown and recompute blended scores (respecting floors and weights).
   - Commit changes and comment summary matrix back to the GitHub issue.
5. **Iteration Control**
   - If acceptance criteria not met, generate adjustment prompts for another round (max three). Include peer objections and score deltas to inform compromise.
6. **Decision Publication**
   - When criteria satisfied or rounds exhausted, prompt the Chair persona to produce the decision record.
   - Update `CHANGELOG.md`, push all artefacts, and post final outcome comment to the issue/linked PR.
7. **Escalation Handling**
   - If consensus fails, raise a task for the human steward (Mark) with a succinct risk/opportunity summary.

## Configuration Notes
- Store API keys and model configuration as n8n credentials; do not hard-code in the workflow.
- Provide a dry-run switch so maintainers can test locally without committing artefacts.
- Ensure automations respect branch protections by creating PRs instead of direct pushes when necessary.

## Future Enhancements
- Generate visual score trend charts per proposal for quick comprehension.
- Publish a dashboard of board metrics (decision duration, escalations, satisfaction).
- Integrate with CI to block merges if the latest proposal lacks an attached decision record.

> Keep this workflow definition versioned. Update this README whenever the flow changes and reference export files (`flow.json`) if committed.

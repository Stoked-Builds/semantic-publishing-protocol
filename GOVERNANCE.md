# GOVERNANCE – Semantic Publishing Protocol (SPP)

## Project Stewardship
The Semantic Publishing Protocol is initially maintained and stewarded by Mark Stokes. As the project grows, governance may evolve to include a broader group of contributors and stakeholders.

## Working Group Model
Future development may be guided by a working group model. Anyone interested in the protocol’s evolution may propose the formation of working groups focused on specific areas (e.g., specification, interoperability, responsible AI).

## Review Board Oversight
- Significant protocol changes (specs, schemas, governance) require evaluation by the multi-perspective Review Board defined in `AGENTS.md`.
- The board’s mission hierarchy prioritises ethics and legal compliance, then innovation, then economic and operational sustainability.
- Membership, scoring, and deliberation procedures are published in `docs/governance/review-board/README.md`. All artifacts are committed to the repo for public audit.
- When the board cannot reach an acceptance threshold, Mark Stokes acts as the escalation point and records the final determination.

## Proposal Workflow
- **Submission:** Contributors initiate proposals via the GitHub issue template `Review Board Proposal` (`.github/ISSUE_TEMPLATE/review-board.md`). Issues automatically receive the `proposal/review-board` label.
- **Dossier & Deliberation:** Requestors (or automation) populate the dossier template located in `docs/governance/review-board/templates/`. The Review Board runs structured rounds, maintaining scorecards and transcripts in the proposal archive.
- **Decision Publication:** Outcomes, conditions, and dissent are summarised in a decision record and appended to `docs/governance/review-board/CHANGELOG.md`. Related PRs must link to the archived artifacts.
- **Working Groups:** Working groups collaborate on proposals before board submission and may provide advisory opinions, but the Review Board delivers the binding recommendation.

## Proposals and Decision-Making
- **Proposals:** Any contributor may submit a proposal for changes, enhancements, or new directions using the workflow above.
- **Voting:** Decisions without Review Board scope continue to use simple majority or rough consensus among active maintainers and working group members.
- **Transparency:** All major decisions and discussions will be documented and made available to the community, with Review Board artifacts stored in `docs/governance/review-board/`.

## Licensing and Contribution Policies
The project’s open source license and contribution policies must remain consistent unless changed with clear community consent. Any proposed changes to licensing or IP terms require broad agreement and public notice.

---

This governance model is intended to be flexible and responsive as the community grows. All contributors are encouraged to participate in shaping the future of SPP.

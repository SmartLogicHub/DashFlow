# DashFlow 0.7 Release Readiness Design

## Goal

Raise DashFlow 0.7 from a polished personal installation to a repeatable public-release candidate without redesigning the product or changing its Markdown data model.

## Scope

This hardening pass has four deliverables:

1. Release only from an explicit version tag that matches `manifest.json`.
2. Give Project Kanban and Opportunity Board a touch- and keyboard-accessible alternative to drag and drop.
3. Turn the existing real-Obsidian QA flow into a documented, repeatable local smoke-test command.
4. Update architecture and release documentation to reflect 0.7.

The pass does not choose a repository license or personal author identity. Those remain owner decisions. It also does not introduce a second data store, change schema 8, or replace existing drag-and-drop behavior.

## Chosen approach

Use a balanced hardening approach that stays inside the existing TypeScript, vanilla DOM and Obsidian API stack.

- Release automation is tag-driven and validates the tag against plugin metadata before packaging.
- Board cards receive a compact native `select` control. Native controls work with touch, keyboard and screen readers, avoid a new menu abstraction, and remain reliable inside Obsidian mobile.
- UI smoke testing connects to a user-launched Obsidian debug instance over CDP using `playwright-core`. It never launches or downloads Obsidian, never writes Vault content, and fails with a direct setup message when the debug endpoint is unavailable.
- Documentation records the exact local command and keeps GitHub CI limited to deterministic headless checks.

Rejected alternatives:

- Releasing on every `main` push keeps ordinary documentation commits coupled to immutable release versions.
- A hidden mobile-only move control would still leave keyboard users dependent on drag and drop.
- A full Electron/Obsidian download harness would add licensing, platform and maintenance risk disproportionate to this release.

## Release workflow

`.github/workflows/release.yml` listens to semantic-looking version tags instead of `main` pushes. The job reads `manifest.json`, compares the tag name with the manifest version, and exits before packaging on mismatch. It also refuses to publish while the repository has no `LICENSE`; the owner can remove that gate by making the explicit license decision and committing the selected license. The existing duplicate-release guard remains as defense in depth.

The documented release sequence is:

1. Update version metadata and changelog.
2. Run `npm ci`, `npm test`, `npm run build`, and the local UI smoke test.
3. Commit and push the release commit.
4. Create and push a tag equal to the manifest version, for example `0.7.1`.

## Accessible board movement

Each Project Kanban card exposes a status selector labelled with the project name. Each Opportunity Board card exposes a stage selector labelled with the opportunity title. Selecting the current value is a no-op. Selecting another value calls the same data-layer method already used by drag and drop, then lets the existing Vault/index render cycle update the board.

The control stops click and pointer propagation so using it never opens the card editor or starts a drag. It is visually quiet, uses existing semantic colors and type tokens, and remains visible at all pane sizes so keyboard users receive the same capability as touch users.

Project status continues to write through `ProjectService.changeStatus`. Opportunity stage continues to write through `OpportunityService.move`. No new persistence path is introduced.

## Real Obsidian smoke test

Add `scripts/obsidian-ui-smoke.mjs` and an `npm run test:ui` command. The script connects to `DASHFLOW_OBSIDIAN_CDP_URL`, defaulting to `http://127.0.0.1:9222`, and discovers the `app://obsidian.md` page.

The test is read-only. It checks:

- DashFlow is loaded and a product shell is visible.
- Today, Work, Feature Hub and DashFlow Settings can be opened.
- primary navigation actions remain visible and named.
- no visible button lacks an accessible name.
- wide and narrow layouts remain inside the viewport.
- Feature Hub search can produce and clear an empty result without changing configuration.
- no uncaught page error or new console error is emitted during the run.

Screenshots and a JSON report are written below `output/playwright/release-smoke/`, which stays ignored. The script restores viewport, closes opened modals and returns to the original product section before disconnecting.

## Error handling

- Release tag mismatch produces a clear expected/actual message and a failing exit status.
- Board move failures remain handled by the existing service-level notices and do not optimistically change card state.
- The smoke test distinguishes setup failures (no CDP endpoint or no Obsidian page) from assertion failures.
- Cleanup runs in `finally`, including modal closure and browser disconnection.

## Testing

TDD source tests will first require:

- tag-only release triggers and tag/manifest validation;
- accessible move controls wired to the existing service methods;
- an explicit UI smoke command, `playwright-core` dependency and read-only safety checks;
- 0.7 architecture and release instructions.

After the source tests pass, run type checking, production build, Node syntax validation, dependency audit and the real Obsidian smoke command. The installed Vault plugin is updated only after these gates pass, and `data.json` must retain its current hash.

## Acceptance criteria

- Ordinary `main` pushes cannot create a GitHub Release.
- A mismatched version tag cannot publish artifacts.
- A repository without an owner-selected `LICENSE` cannot publish accidentally.
- Project and opportunity cards can move without dragging.
- Every new move control has an accessible name and preserves Markdown-backed services.
- `npm run test:ui` performs a read-only real-Obsidian smoke test and produces diagnostics.
- Architecture and README instructions describe the 0.7 release process accurately.
- All existing tests, type checking, build, syntax and audit gates pass.
- Vault `data.json` is unchanged.

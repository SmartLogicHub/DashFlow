# DashFlow 0.7 Release Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make DashFlow 0.7 safe to publish repeatedly, operable on touch without drag gestures, and verifiable through a repeatable real-Obsidian smoke command.

**Architecture:** Keep the existing Markdown-backed services and DOM interaction layer. Add accessible native movement controls beside existing drag behavior, move Release creation behind an owner-controlled version tag and license gate, and add a read-only Playwright CDP smoke script that exercises the installed plugin without owning the Obsidian binary or Vault.

**Tech Stack:** TypeScript 5.8, Obsidian API, vanilla DOM/CSS, Node 22 test runner, GitHub Actions, `playwright-core` CDP client.

---

### Task 1: Protect GitHub releases

**Files:**
- Modify: `.github/workflows/release.yml`
- Modify: `tests/release-metadata.test.ts`

- [ ] **Step 1: Write failing workflow tests**

Require a tag trigger, reject a `main` branch trigger, require `GITHUB_REF_NAME` to equal the manifest version, and require a `LICENSE` file before publishing.

- [ ] **Step 2: Run the suite and verify RED**

Run: `npm test`
Expected: release metadata tests fail because the current workflow listens to `main` and has no tag/license validation.

- [ ] **Step 3: Implement the minimal workflow change**

Use a version-tag push trigger. Add a validation step before build/package:

```bash
VERSION=$(node -p "require('./manifest.json').version")
test "$GITHUB_REF_NAME" = "$VERSION"
test -f LICENSE
```

Keep the duplicate-release check and existing artifact structure.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/release.yml tests/release-metadata.test.ts
git commit -m "ci: publish releases from validated version tags"
```

### Task 2: Add non-drag board movement

**Files:**
- Modify: `src/services/ProjectKanbanWidgetInteractionService.ts`
- Modify: `src/services/OpportunityWidgetInteractionService.ts`
- Modify: `tests/project-kanban.test.ts`
- Modify: `tests/opportunity-board.test.ts`

- [ ] **Step 1: Write failing interaction tests**

Require each card implementation to render a labelled native `select`, stop card click propagation, no-op on the current stage, and route changes through `ProjectService.changeStatus` or `OpportunityService.move`.

- [ ] **Step 2: Run the suite and verify RED**

Run: `npm test`
Expected: the two board tests fail because cards only expose drag events.

- [ ] **Step 3: Implement Project Kanban movement**

Add a compact `.dashflow-project-kanban-move` selector populated from `COLUMNS`. Label it `移动项目「<name>」`, select the current status, stop click/pointer propagation, disable during persistence, and call `projectService.changeStatus` only when the value changes.

- [ ] **Step 4: Implement Opportunity Board movement**

Add a compact `.dashflow-opportunity-card-move` selector populated from `OPPORTUNITY_STAGES`. Label it `移动机会「<title>」`, preserve existing link/edit actions, and call `OpportunityService.move` followed by the existing rerender callback only when the stage changes.

- [ ] **Step 5: Run tests and verify GREEN**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/services/ProjectKanbanWidgetInteractionService.ts src/services/OpportunityWidgetInteractionService.ts tests/project-kanban.test.ts tests/opportunity-board.test.ts
git commit -m "feat: make board movement touch accessible"
```

### Task 3: Add the real-Obsidian smoke command

**Files:**
- Create: `scripts/obsidian-ui-smoke.mjs`
- Create: `tests/ui-smoke-contract.test.ts`
- Modify: `tests/all.test.ts`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.gitignore`

- [ ] **Step 1: Write the failing smoke-contract test**

Require `npm run test:ui`, `playwright-core`, a configurable CDP URL, read-only navigation assertions, visible-button accessibility checks, wide/narrow viewport checks, diagnostic output, cleanup in `finally`, and no calls to Vault mutation or plugin persistence APIs.

- [ ] **Step 2: Run the suite and verify RED**

Run: `npm test`
Expected: the contract test fails because the command and script do not exist.

- [ ] **Step 3: Add the pinned CDP dependency**

Run: `npm install --save-dev --save-exact playwright-core`

- [ ] **Step 4: Implement the smoke script**

Connect to `process.env.DASHFLOW_OBSIDIAN_CDP_URL ?? "http://127.0.0.1:9222"`. Capture the original viewport and active DashFlow section, exercise Today, Work, Feature Hub and Settings, assert accessible names and viewport containment, write PNG/JSON diagnostics to `output/playwright/release-smoke`, then restore modal, viewport and section state in `finally`.

- [ ] **Step 5: Ignore generated smoke artifacts**

Ensure `output/playwright/` remains ignored and do not commit screenshots or Vault data.

- [ ] **Step 6: Run tests and syntax checks**

Run: `npm test && node --check scripts/obsidian-ui-smoke.mjs`
Expected: all tests and syntax checks pass.

- [ ] **Step 7: Commit**

```bash
git add scripts/obsidian-ui-smoke.mjs tests/ui-smoke-contract.test.ts tests/all.test.ts package.json package-lock.json .gitignore
git commit -m "test: add real Obsidian UI smoke command"
```

### Task 4: Update 0.7 release documentation

**Files:**
- Modify: `ARCHITECTURE.md`
- Modify: `README.md`
- Modify: `CHANGELOG.md`
- Modify: `tests/release-metadata.test.ts`

- [ ] **Step 1: Write failing documentation assertions**

Require the architecture title to be 0.7, document `npm run test:ui`, document the version-tag release sequence, and state that public Release stays blocked until the owner adds `LICENSE`.

- [ ] **Step 2: Run the suite and verify RED**

Run: `npm test`
Expected: documentation assertions fail on the current 0.6 architecture heading and missing instructions.

- [ ] **Step 3: Update docs**

Describe the 0.7 presentation owner, Feature Hub, focused sections, smoke-test prerequisites, tag workflow and license decision. Add an Unreleased hardening section to the changelog without changing plugin version or schema.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add ARCHITECTURE.md README.md CHANGELOG.md tests/release-metadata.test.ts
git commit -m "docs: document the 0.7 release gate"
```

### Task 5: Verify in the real Vault

**Files:**
- Generated only: `main.js`
- Installed only: `<Vault>/.obsidian/plugins/dashflow/main.js`
- Installed only: `<Vault>/.obsidian/plugins/dashflow/manifest.json`
- Installed only: `<Vault>/.obsidian/plugins/dashflow/styles.css`
- Generated and ignored: `output/playwright/release-smoke/*`

- [ ] **Step 1: Run the complete automated gate**

Run:

```bash
npm test
npx tsc --noEmit --skipLibCheck
npm run build
node --check main.js
node --check scripts/obsidian-ui-smoke.mjs
npm audit --omit=dev
git diff --check
```

Expected: every command exits zero.

- [ ] **Step 2: Preserve and verify Vault configuration**

Record the installed `data.json` SHA-256 and timestamp. Copy only release artifacts and Hero assets. Confirm `data.json` remains byte-identical.

- [ ] **Step 3: Run the real UI smoke test**

Launch the installed Vault with Obsidian remote debugging enabled, run `npm run test:ui`, inspect the JSON report and screenshots, and verify no console/page errors.

- [ ] **Step 4: Restore normal application state**

Restore sidebars and viewport, close the debug instance gracefully, then relaunch Obsidian without remote-debugging flags.

- [ ] **Step 5: Commit any final tested corrections**

Use a focused commit message only if verification required source changes. Re-run the complete gate afterward.

- [ ] **Step 6: Finish the branch**

Use `superpowers:finishing-a-development-branch`. Follow the user's existing preference for local integration and do not push GitHub without new explicit authorization.

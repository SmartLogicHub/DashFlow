# DashFlow 0.7 Product Presentation Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild DashFlow's presentation layer incrementally so every primary workflow is readable, discoverable, responsive, and release-ready without changing Markdown truth or persisted user data.

**Architecture:** Keep all domain services, models, settings schema, Dashboard persistence, and integrations intact. Introduce one canonical product-presentation stylesheet assembled from focused shell/component/page modules, migrate one surface at a time, and then remove the four legacy global polish layers. Behavior additions remain small pure functions where possible and are consumed by existing Obsidian UI services.

**Tech Stack:** TypeScript 5.8, Obsidian API, vanilla DOM/CSS, esbuild, Node test runner, Playwright CDP for real Obsidian validation.

---

## File map

**Create**

- `src/styles/ProductPresentationStyles.ts` — canonical tokens, foundation, shell, shared components, focused-page layout, and responsive rules.
- `tests/product-presentation.test.ts` — architecture, typography, responsive, scroll, and CSS ownership contracts.
- `docs/superpowers/plans/2026-08-22-product-presentation-rebuild.md` — this implementation plan.

**Modify**

- `src/services/ProductDesignService.ts` — inject only the canonical product-presentation stylesheet.
- `src/services/DesignSystemService.ts` — retain feature-specific styles and motion; stop loading four legacy global polish layers after migration.
- `src/services/ProductExperienceService.ts` — keep active navigation visible, add Work summary routes, and preserve project-view behavior.
- `src/product/featureCatalog.ts` — add pure search/status filtering helpers over the canonical catalog.
- `src/ui/FeatureHubModal.ts` — search, status filters, empty result, and stable modal chrome.
- `src/styles/FeatureHubStyles.ts` — sticky tools, bounded scrolling, readable card typography, single-column compact layout.
- `src/services/WeeklyReviewWidgetInteractionService.ts` — Chinese labels, readable type, and explicit “查看完整复盘” route.
- `src/services/HabitWidgetInteractionService.ts` — actionable empty state.
- `src/services/CalendarWidgetInteractionService.ts` — readable labels and full-cell touch targets.
- `src/styles/SettingsStyles.ts` — theme-card text flow and control alignment.
- `tests/all.test.ts` and legacy visual test files — register new tests and replace assertions tied to deleted style layers.
- `package.json`, `package-lock.json`, `manifest.json`, `versions.json`, `src/constants.ts` — 0.7.0 metadata.
- `README.md`, `CHANGELOG.md`, `.github/workflows/ci.yml`, `.github/workflows/release.yml`, `tests/release-metadata.test.ts` — release guidance and fail-fast version publishing.

**Delete after parity**

- `src/styles/DeepSeekPolishStyles.ts`
- `src/styles/ProductHierarchyResetStyles.ts`
- `src/styles/UiRefinementStyles.ts`
- `src/styles/VisualContinuityStyles.ts`

## Task 1: Lock the presentation architecture

**Files:**
- Create: `tests/product-presentation.test.ts`
- Modify: `tests/all.test.ts`
- Create: `src/styles/ProductPresentationStyles.ts`
- Modify: `src/services/ProductDesignService.ts`

- [ ] **Step 1: Write the failing architecture test**

Add tests requiring `ProductDesignService` to import `PRODUCT_PRESENTATION_STYLES`, requiring semantic tokens `--df-type-*`, `--df-control-*`, and requiring container-query support on `.dashflow-command-shell`.

- [ ] **Step 2: Verify RED**

Run: `npm test`  
Expected: FAIL because `ProductPresentationStyles.ts` and the canonical import do not exist.

- [ ] **Step 3: Add the canonical presentation module**

Create the stylesheet with this initial boundary:

```ts
export const PRODUCT_PRESENTATION_STYLES = `
.dashflow-view-container {
  --df-type-label: 11px;
  --df-type-secondary: 12px;
  --df-type-body: 13px;
  --df-type-title: 14px;
  --df-control-compact: 32px;
  --df-control-touch: 36px;
}
.dashflow-command-shell { container: dashflow-shell / inline-size; }
`;
```

Import it from `ProductDesignService` and append it after the temporarily retained current product CSS. Do not change behavior yet.

- [ ] **Step 4: Verify GREEN and commit**

Run: `npm test && npm run build`  
Expected: 256+ tests pass and production build succeeds.

Commit: `refactor: establish canonical presentation layer`

## Task 2: Make primary navigation discoverable in narrow panes

**Files:**
- Modify: `tests/product-presentation.test.ts`
- Modify: `src/services/ProductExperienceService.ts`
- Modify: `src/styles/ProductPresentationStyles.ts`

- [ ] **Step 1: Write failing responsive contracts**

Require `.dashflow-command-shell.is-mobile .dashflow-command-bar` to use a two-row grid; require a dedicated action row containing Add, Feature, and Search; require the Feature label to remain visible; require active navigation to call a focused helper that uses `scrollIntoView({ inline: "center", block: "nearest" })`.

- [ ] **Step 2: Verify RED**

Run: `npm test`  
Expected: FAIL on missing mobile command layout and active-item visibility behavior.

- [ ] **Step 3: Implement narrow-pane navigation**

Use the existing `.is-mobile` shell state rather than viewport-only media queries. On mobile/narrow panes:

```css
.dashflow-command-shell.is-mobile .dashflow-command-bar {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  overflow: visible;
}
.dashflow-command-shell.is-mobile .dashflow-command-nav {
  min-width: 0;
  overflow-x: auto;
}
.dashflow-command-shell.is-mobile .dashflow-command-actions {
  display: grid;
  grid-template-columns: var(--df-control-touch) minmax(82px, 1fr) var(--df-control-touch);
}
```

Keep only Add, Feature, and Search visible in that action row. Schedule active-page centering after section sync. Provide a subtle navigation edge fade without hiding controls.

- [ ] **Step 4: Verify GREEN and commit**

Run: `npm test && npm run build`  
Expected: all tests pass.

Commit: `fix: keep primary actions visible in narrow panes`

## Task 3: Add searchable and filterable feature discovery

**Files:**
- Modify: `tests/feature-catalog.test.ts`
- Modify: `tests/feature-hub.test.ts`
- Modify: `src/product/featureCatalog.ts`
- Modify: `src/ui/FeatureHubModal.ts`
- Modify: `src/styles/FeatureHubStyles.ts`

- [ ] **Step 1: Write failing pure-logic tests**

Add cases for normalized case-insensitive name/description search and filters:

```ts
assert.deepEqual(filterFeatures(features, statuses, { query: "项目", mode: "all" }).map(f => f.id), expected);
assert.ok(filterFeatures(features, statuses, { query: "", mode: "not-added" }).every(f => statuses.get(f.id)?.placement === "not-added"));
assert.ok(filterFeatures(features, statuses, { query: "", mode: "needs-attention" }).every(f => statuses.get(f.id)?.availability !== "ready"));
```

- [ ] **Step 2: Verify RED**

Run: `npm test`  
Expected: FAIL because `filterFeatures` and filter mode types do not exist.

- [ ] **Step 3: Implement pure filtering and modal controls**

Add `FeatureFilterMode`, `FeatureFilter`, and `filterFeatures`. In the modal, compute statuses once per render, add a labeled search input, three `aria-pressed` filter buttons, group only matching results, and render a clear-filter empty state. Keep the header/tools visible while the results region scrolls.

- [ ] **Step 4: Verify GREEN and commit**

Run: `npm test && npm run build`  
Expected: all logic and structural tests pass.

Commit: `feat: add focused feature discovery`

## Task 4: Enforce readable typography and touch targets

**Files:**
- Modify: `tests/product-presentation.test.ts`
- Modify: `src/styles/ProductPresentationStyles.ts`
- Modify: `src/services/WeeklyReviewWidgetInteractionService.ts`
- Modify: `src/services/CalendarWidgetInteractionService.ts`
- Modify: `src/styles/FeatureHubStyles.ts`
- Modify: `src/styles/SettingsStyles.ts`

- [ ] **Step 1: Write failing readability tests**

Require the canonical label/body/title tokens, `font-variant-numeric: tabular-nums`, no 7–10px business labels in Weekly Review, calendar day buttons that fill their grid cells, and compact controls of at least 32px with touch controls of at least 36px.

- [ ] **Step 2: Verify RED**

Run: `npm test`  
Expected: FAIL on current Weekly Review 7–10px declarations and small calendar controls.

- [ ] **Step 3: Migrate typography**

Translate Weekly Review KPI and status labels to Chinese, raise metadata to 11–12px, use 13px rows and 14px section titles, and apply tabular figures. Raise common widget titles to 14px and body text to 13px. Preserve Obsidian/system font inheritance.

- [ ] **Step 4: Verify GREEN and commit**

Run: `npm test && npm run build`  
Expected: all tests pass.

Commit: `style: establish readable product typography`

## Task 5: Remove nested scrolling from Work and Review

**Files:**
- Modify: `tests/product-presentation.test.ts`
- Modify: `tests/weekly-review-widget.test.ts`
- Modify: `src/services/ProductExperienceService.ts`
- Modify: `src/services/WeeklyReviewWidgetInteractionService.ts`
- Modify: `src/styles/ProductPresentationStyles.ts`

- [ ] **Step 1: Write failing Work-summary tests**

Require Work to show at most three project rows plus a “查看全部项目” route, require a “查看完整复盘” control, and require the Work weekly card to hide its full detail grid while Review exposes natural-height content with `overflow: visible`.

- [ ] **Step 2: Verify RED**

Run: `npm test`  
Expected: FAIL because summary routes and section-specific scroll rules are missing.

- [ ] **Step 3: Implement summaries and natural growth**

Decorate the Work projects card with a route button and hide rows after the third only in `data-product-section="work"`. Add a Weekly Review route button backed by `plugin.activateSection("review")`; hide the full weekly detail grid only on Work. On Review, let the widget and body grow naturally and disable fixed-height clipping.

- [ ] **Step 4: Verify GREEN and commit**

Run: `npm test && npm run build`  
Expected: all tests pass.

Commit: `fix: replace nested dashboard scrolling with summaries`

## Task 6: Finish focused-page empty and responsive states

**Files:**
- Modify: `tests/product-presentation.test.ts`
- Modify: `tests/habit-interactions.test.ts`
- Modify: `src/services/HabitWidgetInteractionService.ts`
- Modify: `src/styles/ProductPresentationStyles.ts`

- [ ] **Step 1: Write failing empty-state tests**

Require a “创建第一个习惯” action when the Habit widget has no records; require compact empty-state geometry; require calendar details to stack below the month view in narrow containers; require project recovery actions to retain full-width touch targets.

- [ ] **Step 2: Verify RED**

Run: `npm test`  
Expected: FAIL on missing actionable habit state and page-responsive contracts.

- [ ] **Step 3: Implement focused-page states**

Reuse `HabitEditorModal` for the empty-state CTA. Use container-responsive layout for calendar and habits. Keep project list/board/timeline switching unchanged and preserve one-click missing-view recovery.

- [ ] **Step 4: Verify GREEN and commit**

Run: `npm test && npm run build`  
Expected: all tests pass.

Commit: `fix: complete focused page empty states`

## Task 7: Consolidate settings and retire legacy polish layers

**Files:**
- Modify: `tests/product-presentation.test.ts`
- Modify: `tests/design-system-consolidation.test.ts`
- Modify: `tests/final-ui-system.test.ts`
- Modify: `tests/hero-product-unification.test.ts`
- Modify: `tests/offline-hero.test.ts`
- Modify: `tests/product-hierarchy-reset.test.ts`
- Modify: `tests/typography-modal.test.ts`
- Modify: `tests/ui-refinement-final.test.ts`
- Modify: `tests/visual-continuity.test.ts`
- Modify: `tests/visual-polish.test.ts`
- Modify: `src/services/DesignSystemService.ts`
- Modify: `src/services/ProductDesignService.ts`
- Modify: `src/styles/ProductPresentationStyles.ts`
- Modify: `src/styles/SettingsStyles.ts`
- Delete: the four legacy global polish files listed above

- [ ] **Step 1: Write failing ownership and debt tests**

Require `DesignSystemService` not to import the four legacy modules, require the files to be absent, require affected geometry selectors to live in `ProductPresentationStyles.ts`, and cap remaining `!important` declarations under an explicit measured threshold.

- [ ] **Step 2: Verify RED**

Run: `npm test`  
Expected: FAIL because legacy imports/files still exist.

- [ ] **Step 3: Migrate required rules and delete legacy layers**

Port only currently visible, verified rules into the canonical presentation module. Remove duplicate selectors rather than copying them wholesale. Keep feature-specific modules (AI News, Data Filter, Focus, Feature Hub, Settings, Workflow) and the motion module. Let theme cards wrap to two lines and remove fixed-height description clipping.

- [ ] **Step 4: Verify GREEN, count debt, and commit**

Run: `npm test && npm run build`  
Also run a PowerShell count of `!important` and raw pixel font declarations in `src/styles` and `ProductDesignService`.

Expected: all tests pass; the four legacy files are gone; measured override count drops substantially from the 911/3080-line baseline.

Commit: `refactor: consolidate product presentation ownership`

## Task 8: Align 0.7.0 release metadata and fail fast on duplicate releases

**Files:**
- Modify: `tests/release-metadata.test.ts`
- Modify: `tests/personal-home.test.ts`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `manifest.json`
- Modify: `versions.json`
- Modify: `src/constants.ts`
- Modify: `README.md`
- Modify: `CHANGELOG.md`
- Modify: `.github/workflows/ci.yml`
- Modify: `.github/workflows/release.yml`

- [ ] **Step 1: Write failing release tests**

Require every version source to equal `0.7.0`, require README install text for `DashFlow-v0.7.0.zip`, require the CI source ZIP name to derive from `manifest.json`, and require Release to exit non-zero when a release for the current version already exists.

- [ ] **Step 2: Verify RED**

Run: `npm test`  
Expected: FAIL on 0.6.1 metadata and the current silent skip behavior.

- [ ] **Step 3: Update metadata, docs, and workflows**

Use `npm version 0.7.0 --no-git-tag-version` for package metadata, then update manifest/constants/versions. Add the 0.7.0 changelog and upgrade notes. Make CI source archive naming dynamic. Change duplicate-release handling from successful skip to an explanatory failure.

- [ ] **Step 4: Verify GREEN and commit**

Run: `npm test && npm run build && node --check main.js`  
Expected: all tests pass and release metadata agrees.

Commit: `chore: prepare DashFlow 0.7.0 release`

## Task 9: Real Obsidian validation and Vault-safe installation

**Files:**
- Generated/ignored: `output/playwright/presentation-0.7/*.png`
- Install target: `G:\文档\于浩的知识库\.obsidian\plugins\dashflow`

- [ ] **Step 1: Run the full automated gate**

Run:

```powershell
npm test
npx tsc -noEmit -skipLibCheck
npm run build
node --check main.js
git diff --check
npm audit --offline
```

Expected: zero failures and zero known vulnerabilities.

- [ ] **Step 2: Install with data hash guard**

Resolve and verify the exact plugin directory. Record SHA-256 of `data.json`, copy `main.js`, `manifest.json`, `styles.css`, and three Hero assets, then verify the `data.json` hash is unchanged and every deployed file matches the build hash.

- [ ] **Step 3: Validate real Obsidian**

Temporarily launch Obsidian with a loopback debugging port and validate:

- seven product sections and four settings tabs;
- no console errors;
- Feature entry intersects the viewport at wide, 820px, and 700px sizes;
- mobile Feature Hub is one column with bounded scrolling;
- search, all/not-added/needs-attention filters and empty state;
- Work projects and Review have no unintended nested scroll;
- visible business text respects the type floor;
- Alpine, Midnight, and Obsidian-following themes remain legible.

Capture representative screenshots, close the debug instance normally, and reopen Obsidian without a debugging flag.

- [ ] **Step 4: Final branch verification and handoff**

Run `git status -sb`, `git diff --check`, and `git log --oneline main..HEAD`. Do not push GitHub. Use the finishing-development-branch workflow to present local merge/PR/keep/discard choices.

# DashFlow Hero Product Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make DashFlow’s offline theme selection visible, immediately persistent, and visually consistent across Today and Work while aligning Hero and progress language.

**Architecture:** Add three pure product modules for theme metadata, Hero copy, and progress calculations. The Settings tab and `PresentationRuntimeService` consume the shared theme metadata; `ProductExperienceService` becomes the single renderer for Hero copy; the final product hierarchy stylesheet owns the working Hero geometry.

**Tech Stack:** TypeScript 5.8, Obsidian API 1.11.4, Node 22 built-in test runner, vanilla DOM/CSS.

---

## File map

- Create `src/product/heroThemes.ts`: immutable theme-card metadata and offline asset lookup.
- Create `src/product/heroPresentation.ts`: pure Chinese Hero copy by product section.
- Create `src/product/progressOverview.ts`: pure dual progress metrics and semantic labels.
- Create `tests/hero-product-unification.test.ts`: behavioral tests for the three pure contracts.
- Modify `src/product/heroScenes.ts`: consume the canonical scene metadata.
- Modify `src/services/PresentationRuntimeService.ts`: resolve one final Hero image and expose safe preview URLs.
- Modify `src/settings/DashFlowSettingsTab.ts`: render accessible theme cards and persist a theme click immediately.
- Modify `src/services/ProductExperienceService.ts`: own all visible Hero DOM and consume progress overview.
- Modify `src/dashboard/DashboardRenderer.ts`: render a structural Hero host plus layout control only.
- Modify `src/styles/ProductHierarchyResetStyles.ts`: own compact working-Hero styling.
- Modify `src/styles/VisualContinuityStyles.ts`: remove duplicate working-Hero geometry and CSS-generated section titles.
- Modify `src/widgets/builtins.ts`: rename the dual-ring Widget to `任务概览`.
- Modify `tests/all.test.ts` and narrow source-structure tests only where legacy expectations change.

### Task 1: Establish tested product contracts

**Files:**
- Create: `tests/hero-product-unification.test.ts`
- Modify: `tests/all.test.ts`
- Create: `src/product/heroThemes.ts`
- Create: `src/product/heroPresentation.ts`
- Create: `src/product/progressOverview.ts`

- [ ] **Step 1: Write failing pure-contract tests**

  Assert three named photo presets with local asset paths plus the Obsidian option; assert Work Hero copy is Chinese and compact; assert a mixed task sample produces `任务概览` metrics labelled `今日任务` and `全部任务`, including the zero-task case.

- [ ] **Step 2: Run the focused test and verify it fails**

  Run: `npm.cmd test`

  Expected: FAIL because the three modules do not exist.

- [ ] **Step 3: Implement minimal pure modules**

  Define immutable metadata and pure functions only; no Obsidian/DOM dependency is allowed in these modules.

- [ ] **Step 4: Run the focused test and verify it passes**

  Run: `npm.cmd test`

  Expected: PASS.

### Task 2: Make theme selection visible and durable

**Files:**
- Modify: `src/product/heroScenes.ts`
- Modify: `src/services/PresentationRuntimeService.ts`
- Modify: `src/settings/DashFlowSettingsTab.ts`
- Modify: `src/styles/SettingsStyles.ts`
- Test: `tests/hero-product-unification.test.ts`

- [ ] **Step 1: Extend the failing test with settings/runtime integration assertions**

  Require the Settings tab to render `dashflow-theme-card`, call an awaited save path on click, use `aria-pressed`, and require the runtime to expose one resolved Hero URL for both preview and views.

- [ ] **Step 2: Run the focused test and verify it fails**

  Run: `npm.cmd test`

  Expected: FAIL because the current UI is a dropdown with delayed save.

- [ ] **Step 3: Implement the card selector and single URL path**

  Replace only the prebuilt-theme dropdown with real buttons. On a click, disable concurrent saves, mutate `homeTheme`, await persistence, refresh Dashboard views, and redraw the tab. Preserve the Vault-image controls and use a Notice on failure. Render preview thumbnails from the local plugin resources; no remote URL may be introduced.

- [ ] **Step 4: Run the focused test and verify it passes**

  Run: `npm.cmd test`

  Expected: PASS.

### Task 3: Give Hero content and geometry one owner

**Files:**
- Modify: `src/dashboard/DashboardRenderer.ts`
- Modify: `src/services/ProductExperienceService.ts`
- Modify: `src/styles/ProductHierarchyResetStyles.ts`
- Modify: `src/styles/VisualContinuityStyles.ts`
- Test: `tests/hero-product-unification.test.ts`, `tests/studio-ui.test.ts`, `tests/visual-continuity.test.ts`

- [ ] **Step 1: Extend failing tests for semantic Hero ownership**

  Require a real `dashflow-hero-content` node for work, reject `Obsidian · Personal Dashboard`, reject section-title CSS `content:` rules and require the final stylesheet’s 128px work Hero rule.

- [ ] **Step 2: Run focused tests and verify they fail**

  Run: `npm.cmd test`

  Expected: FAIL because the renderer and CSS currently compete for Hero copy.

- [ ] **Step 3: Implement the single-owner Hero**

  Keep the layout button before replacing hero children, move it into the command title, and render all visible Hero copy from `heroPresentation.ts`. Remove base renderer copy and competing pseudo-title declarations. Use `--df-hero-image` and retain the dark text-safety overlay and responsive/reduced-motion behavior.

- [ ] **Step 4: Run focused tests and verify they pass**

  Run: `npm.cmd test`

  Expected: PASS.

### Task 4: Align progress terminology and complete verification

**Files:**
- Modify: `src/services/ProductExperienceService.ts`
- Modify: `src/widgets/builtins.ts`
- Modify: `tests/studio-ui.test.ts`
- Test: `tests/hero-product-unification.test.ts`

- [ ] **Step 1: Extend the failing test for `任务概览`**

  Require the Widget definition and rendered pair to use `任务概览` / `今日任务` / `全部任务` rather than `今日进度` / `TODAY` / `ALL TASKS`.

- [ ] **Step 2: Run the focused test and verify it fails**

  Run: `npm.cmd test`

  Expected: FAIL against the old labels.

- [ ] **Step 3: Implement minimal vocabulary changes**

  Use `progressOverview.ts` in `ProductExperienceService`; rename the built-in definition and remove the obsolete editable progress-label setting while preserving existing instance config data.

- [ ] **Step 4: Run all quality gates**

  Run: `npm.cmd test; npm.cmd run build; node --check main.js; git diff --check`

  Expected: 0 failed tests, successful TypeScript/build checks, valid bundle syntax, and no whitespace errors.

- [ ] **Step 5: Commit the verified implementation**

  Run: `git add src tests styles.css main.js manifest.json; git commit -m "fix: unify hero themes and product language"`

# Layout Management Entry Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make layout editing and card removal visible from every DashFlow product section, and eliminate the Quick Add target-row overlap.

**Architecture:** Keep `DashboardRenderer` as the single owner of layout-edit state and destructive card removal. Move its real edit button into the persistent command bar during product decoration instead of the hidden section title, then consolidate Quick Add geometry in the canonical presentation layer.

**Tech Stack:** TypeScript, Obsidian DOM APIs, CSS strings composed by `DesignSystemService`, Node test runner, esbuild.

---

### Task 1: Expose the real layout-edit action in the command bar

**Files:**
- Modify: `tests/product-presentation.test.ts`
- Modify: `src/services/ProductExperienceService.ts`
- Modify: `src/styles/ProductPresentationStyles.ts`

- [ ] **Step 1: Write the failing command-bar contract test**

Extend `tests/product-presentation.test.ts` with assertions that:

```ts
test("layout editing stays visible in the persistent command bar", () => {
  assert.ok(productExperience.includes('dataset.commandAction = "layout"'));
  assert.ok(productExperience.includes("mountLayoutAction"));
  assert.ok(productExperience.includes('setAttribute("aria-pressed", String(editing))'));
  assert.equal(productExperience.includes("right.appendChild(editButton)"), false);
  const presentation = readFileSync(presentationPath, "utf8");
  assert.ok(presentation.includes('[data-command-action="layout"]'));
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test`

Expected: FAIL because no `layout` command action or `mountLayoutAction` exists and the button is still moved into the hidden title.

- [ ] **Step 3: Implement the smallest persistent layout action**

In `ProductExperienceService`:

- Stop passing the edit button into `decorateTitle`.
- Create the command bar, then call a focused `mountLayoutAction(bar, editButton, editing)` helper.
- Reuse the existing button and click listener from `DashboardRenderer`.
- Give it command-button structure, `data-command-action="layout"`, an icon, a visible “布局”/“完成” label, an accessible label, `aria-pressed`, and active state.
- Insert it in the command actions immediately before “功能”.

In `ProductPresentationStyles`:

- Keep the layout action visible in desktop and narrow command bars.
- Expand the narrow action grid to include Add, Feature, Layout, and Search.
- Preserve a visible “布局”/“完成” label at narrow sizes.

- [ ] **Step 4: Run the full test suite and verify GREEN**

Run: `npm test`

Expected: PASS with all tests green.

- [ ] **Step 5: Commit the layout entry**

```bash
git add tests/product-presentation.test.ts src/services/ProductExperienceService.ts src/styles/ProductPresentationStyles.ts
git commit -m "fix: expose layout editing in command bar"
```

### Task 2: Make card removal explicit in edit mode

**Files:**
- Modify: `tests/workflow-context.test.ts`
- Modify: `src/dashboard/DashboardRenderer.ts`
- Modify: `src/styles/ProductPresentationStyles.ts`

- [ ] **Step 1: Write the failing removal-control test**

Extend `tests/workflow-context.test.ts` with a test that requires:

```ts
test("layout editing exposes a labeled and confirmed card removal action", () => {
  assert.ok(renderer.includes('className = "dashflow-widget-remove"'));
  assert.ok(renderer.includes('remove.textContent = "移除"'));
  assert.ok(renderer.includes('remove.textContent = "再次确认"'));
  assert.ok(renderer.includes('remove.setAttribute("aria-label", "移除卡片")'));
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test`

Expected: FAIL because the control is still an unlabeled `×`.

- [ ] **Step 3: Implement explicit removal presentation without changing data behavior**

In `DashboardRenderer`:

- Render the removal control with class `dashflow-widget-remove`, visible text “移除”, title and ARIA label.
- On first click, switch text to “再次确认” and add `is-confirming`.
- On expiry, restore “移除” and remove `is-confirming`.
- Keep the existing `TimedConfirmation` key and `DashboardManager.removeWidget` call unchanged.

In `ProductPresentationStyles`:

- Allow the labeled removal button to size to content.
- Give the confirmation state a restrained danger treatment.
- Keep it usable in the mobile editing header.

- [ ] **Step 4: Run the full test suite and verify GREEN**

Run: `npm test`

Expected: PASS with all tests green.

- [ ] **Step 5: Commit the removal control**

```bash
git add tests/workflow-context.test.ts src/dashboard/DashboardRenderer.ts src/styles/ProductPresentationStyles.ts
git commit -m "fix: label card removal in layout mode"
```

### Task 3: Remove the Quick Add target-row style conflict

**Files:**
- Modify: `tests/product-presentation.test.ts`
- Modify: `src/styles/WorkflowStyles.ts`
- Modify: `src/styles/ProductPresentationStyles.ts`

- [ ] **Step 1: Write the failing target-row regression test**

Update the existing Quick Add presentation test to require:

```ts
const workflowStyles = readFileSync("src/styles/WorkflowStyles.ts", "utf8");
assert.equal(workflowStyles.includes(".dashflow-quick-add-target"), false);
assert.match(target, /margin:\s*6px 2px 0/);
assert.ok(presentation.includes(".dashflow-quick-add-target { flex-wrap: wrap; }"));
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test`

Expected: FAIL because `WorkflowStyles` still overrides the target row with `margin: -4px 2px 12px` and no narrow wrapping contract exists.

- [ ] **Step 3: Consolidate Quick Add geometry**

- Remove the duplicate `.dashflow-quick-add-target` and child-button geometry from `WorkflowStyles`.
- Keep the canonical non-negative target margin in `ProductPresentationStyles`.
- Add a narrow rule that lets the target row wrap without covering the composer or save button.

- [ ] **Step 4: Run tests and production build**

Run: `npm test`

Expected: all tests PASS.

Run: `npm run build`

Expected: TypeScript and esbuild exit 0.

- [ ] **Step 5: Commit the Quick Add fix**

```bash
git add tests/product-presentation.test.ts src/styles/WorkflowStyles.ts src/styles/ProductPresentationStyles.ts
git commit -m "fix: separate quick capture target row"
```

### Task 4: Verify, integrate, and install

**Files:**
- Verify: all tracked source and tests
- Install: `main.js`, `manifest.json`, `styles.css`

- [ ] **Step 1: Run final verification in the feature worktree**

Run: `npm test && npm run build && git diff --check && git status --short`

Expected: 0 test failures, build exit 0, no whitespace errors, clean feature branch.

- [ ] **Step 2: Fast-forward merge into local `main`**

Run from the main worktree:

```bash
git merge --ff-only fix/layout-entry-visibility
```

Expected: `main` advances to the feature tip without a merge commit.

- [ ] **Step 3: Rebuild and install exact artifacts**

Run `npm test` and `npm run build` on `main`, back up the existing installed artifacts, then copy `main.js`, `manifest.json`, and `styles.css` to:

`G:\文档\于浩的知识库\.obsidian\plugins\dashflow`

Do not modify `data.json`.

- [ ] **Step 4: Verify installation hashes and repository state**

Compare SHA-256 hashes for source and installed artifacts. Verify `main` is clean.

- [ ] **Step 5: Clean up the merged worktree and feature branch**

Remove only `.worktrees/layout-entry-visibility` and delete only `fix/layout-entry-visibility`. Other worktrees remain untouched.


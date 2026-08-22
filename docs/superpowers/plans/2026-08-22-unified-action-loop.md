# DashFlow Unified Action Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every DashFlow capability discoverable from the normal UI, keep fixed sections useful under minimal Dashboards, and place project list/Kanban/timeline behind one coherent Projects surface.

**Architecture:** Add a pure feature catalog and a pure section policy as the single sources of product metadata. Keep Work backed by the active Dashboard, then let `ProductExperienceService` consume the policies for fixed-section recovery and project view selection. A new Obsidian `Modal` exposes Widget, command, integration, and workspace actions without duplicating their business logic.

**Tech Stack:** TypeScript 5.8, Obsidian Plugin API, vanilla DOM/CSS, Node test runner bundled with esbuild.

---

## File map

- Create `src/product/featureCatalog.ts`: all user-facing capabilities, grouping, placement state, availability state, and runtime-independent status calculation.
- Create `src/product/commandCatalog.ts`: the complete Obsidian command metadata and its feature/navigation/maintenance classification.
- Create `src/product/sectionPolicy.ts`: fixed-section Widget ownership, recommended base Widget, coverage, and deterministic project-view selection.
- Create `src/ui/FeatureHubModal.ts`: feature catalog UI and delegation to existing Modals/services.
- Create `src/styles/FeatureHubStyles.ts`: feature hub, section recovery, and project switcher styles.
- Modify `src/product/widgetVisibility.ts`: delegate focused visibility to `sectionPolicy`.
- Modify `src/dashboard/DashboardManager.ts`: return the newly added Widget, or `null`, so UI actions can distinguish success from failure.
- Modify `src/services/ProductExperienceService.ts`: feature button, missing-section recovery, and single-view Projects behavior.
- Modify `src/services/DashboardSwitcherInteractionService.ts`: expose its existing manager Modal through a public method.
- Modify `src/settings/DashFlowSettingsTab.ts` and `src/main.ts`: allow the feature hub to open a specific DashFlow settings section.
- Modify `src/services/DesignSystemService.ts`: inject the new styles in the established cascade.
- Add `tests/feature-catalog.test.ts`, `tests/section-policy.test.ts`, and focused UI/source assertions; import them from `tests/all.test.ts`.
- Update `README.md` with the normal-user discovery path.

### Task 1: Define complete feature and command catalogs

**Files:**
- Create: `tests/feature-catalog.test.ts`
- Modify: `tests/all.test.ts`
- Create: `src/product/featureCatalog.ts`
- Create: `src/product/commandCatalog.ts`
- Modify: `src/main.ts`

- [ ] **Step 1: Write the failing catalog tests**

Create registry setup matching `tests/widget-visibility.test.ts`, then assert every registered type is present exactly once:

```ts
test("the feature catalog includes every registered Widget", () => {
  const registered = registeredWidgetTypes().sort();
  const catalogued = FEATURE_CATALOG
    .filter((feature) => feature.kind === "widget")
    .map((feature) => feature.widgetType)
    .sort();
  assert.deepEqual(catalogued, registered);
  assert.equal(new Set(catalogued).size, 18);
});
```

Add status assertions for AI configured-but-disabled, AI enabled-without-key, and an unplaced local Widget. Assert every entry in `COMMAND_CATALOG` belongs to one of three explicit exported sets:

- `FEATURE_COMMAND_IDS`: daily commands represented by a feature-center item; Morning Briefing may cover both configure and refresh commands.
- `NAVIGATION_COMMAND_IDS`: open DashFlow and the seven fixed-section navigation commands already represented by primary navigation.
- `MAINTENANCE_COMMAND_IDS`: Dashboard import/export and Vault reindex commands intentionally kept out of the feature center.

The union must equal the command catalog IDs exactly, so a future command cannot be silently omitted. Every feature-category command must carry a `featureId`, and the test must assert that ID exists in `FEATURE_CATALOG`; allow multiple commands to map to one feature, specifically Morning Briefing configure/refresh → `morning-briefing`. Assert `new-habit` exists and maps to the new-habit feature. Assert the navigation entries equal `open-dashboard` plus `PRODUCT_SECTIONS.map((section) => `open-${section.id}`)`, so the seven dynamic section commands are covered without source parsing.

- [ ] **Step 2: Run the suite and verify RED**

Run: `npm test`

Expected: FAIL because the feature/command catalog modules do not exist and `new-habit` is not registered.

- [ ] **Step 3: Implement the minimal pure catalog**

Define stable types:

```ts
export type FeatureGroup = "capture" | "execution" | "projects" | "review" | "intelligence";
export type FeatureKind = "widget" | "action" | "integration";
export type FeaturePlacement = "added" | "not-added" | "not-applicable";
export type FeatureAvailability = "ready" | "disabled" | "needs-configuration";

export interface FeatureDefinition {
  id: string;
  group: FeatureGroup;
  kind: FeatureKind;
  name: string;
  description: string;
  icon: string;
  section: ProductSection | "settings";
  widgetType?: string;
  action?: "quick-add" | "new-task" | "new-project" | "new-habit" | "search" |
    "ai-plan" | "morning-briefing" | "weread" | "manage-dashboards" | "workflow-settings";
  availability?: "ai" | "morning-briefing" | "weread";
}
```

Populate all 18 Widget entries plus the approved action/integration list. Implement `featureStatus` with independent placement and availability dimensions. `configured` is an auxiliary boolean for the configured-but-disabled case.

In `commandCatalog.ts`, define pure command metadata with stable IDs, names, category, action, optional section, and required `featureId` for feature-category entries. Include `new-habit`; generate the seven section entries from `PRODUCT_SECTIONS`; export the three category ID sets and `COMMAND_CATALOG`.

Refactor `main.ts` to register commands only by iterating `COMMAND_CATALOG` and mapping each typed action to the existing callback. Import `HabitEditorModal` and route `new-habit` to it. Preserve the current names and async behavior for Morning Briefing refresh and reindex. A source test must assert that the old scattered literal registration block is gone and `COMMAND_CATALOG` is the only registration source.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `npm test`

Expected: all tests pass, including the exact 18-type equality assertion.

- [ ] **Step 5: Commit**

```powershell
git add src/product/featureCatalog.ts src/product/commandCatalog.ts src/main.ts tests/feature-catalog.test.ts tests/all.test.ts
git commit -m "feat: define discoverable feature catalog"
```

### Task 2: Centralize fixed-section ownership and project-view fallback

**Files:**
- Create: `tests/section-policy.test.ts`
- Modify: `tests/all.test.ts`
- Create: `src/product/sectionPolicy.ts`
- Modify: `src/product/widgetVisibility.ts`
- Modify: `tests/widget-visibility.test.ts`

- [ ] **Step 1: Write failing section-policy tests**

Cover ownership, recommended bases, empty coverage, hidden instances, and fallback order:

```ts
assert.deepEqual(sectionWidgetTypes("projects"), ["projects", "project-kanban", "project-gantt"]);
assert.equal(recommendedWidgetType("calendar"), "calendar");
assert.equal(sectionCoverage("review", minimalWidgets).missing, true);
assert.equal(sectionCoverage("habits", [{ type: "habits", hidden: true }]).missing, true);
assert.equal(initialProjectView([{ type: "project-gantt", hidden: false }]), "project-gantt");
```

Change the existing visibility expectations so Projects accepts list, Kanban, and Gantt.

- [ ] **Step 2: Run and verify RED**

Run: `npm test`

Expected: FAIL because `sectionPolicy.ts` is missing and the old Projects filter rejects advanced views.

- [ ] **Step 3: Implement the policy and delegate visibility**

Export immutable policies for projects, calendar, habits, and review. `sectionCoverage` must ignore `hidden === true`. `initialProjectView` uses the fixed priority `projects`, `project-kanban`, `project-gantt`, independent of array order; duplicate selection happens later by Dashboard order.

Keep `isWidgetVisibleInSection` as a compatibility wrapper:

```ts
if (hidden === true) return false;
if (section === "work") return true;
return sectionPolicy(section)?.widgetTypes.includes(type) ?? false;
```

- [ ] **Step 4: Run and verify GREEN**

Run: `npm test`

Expected: all policy and legacy visibility tests pass.

- [ ] **Step 5: Commit**

```powershell
git add src/product/sectionPolicy.ts src/product/widgetVisibility.ts tests/section-policy.test.ts tests/widget-visibility.test.ts tests/all.test.ts
git commit -m "feat: centralize section ownership"
```

### Task 3: Expose existing destinations without duplicating business logic

**Files:**
- Modify: `src/services/DashboardSwitcherInteractionService.ts`
- Modify: `src/settings/DashFlowSettingsTab.ts`
- Modify: `src/main.ts`
- Create: `tests/feature-destinations.test.ts`
- Modify: `tests/all.test.ts`

- [ ] **Step 1: Write failing destination tests**

Use source assertions only for Obsidian-runtime entry points that cannot be instantiated in Node. Require a public Dashboard manager method, a settings-tab `openSection(section)`, and a plugin `openSettings(section)` helper.

- [ ] **Step 2: Run and verify RED**

Run: `npm test`

Expected: FAIL because the public destination methods do not exist.

- [ ] **Step 3: Implement minimal public adapters**

Store the `DashFlowSettingsTab` instance created during `onload` instead of constructing it inline. Export `SettingsSection`, add `openSection(section)` to select and redraw it, and add a plugin helper that opens Obsidian settings, selects DashFlow, then forwards the section. Rename or wrap `openManageModal` with public `openManager()`; do not duplicate modal construction.

- [ ] **Step 4: Run and verify GREEN**

Run: `npm test`

Expected: destination tests and existing lifecycle tests pass.

- [ ] **Step 5: Commit**

```powershell
git add src/services/DashboardSwitcherInteractionService.ts src/settings/DashFlowSettingsTab.ts src/main.ts tests/feature-destinations.test.ts tests/all.test.ts
git commit -m "feat: expose feature destinations"
```

### Task 4: Build the feature hub and persistent command-bar entry

**Files:**
- Create: `src/ui/FeatureHubModal.ts`
- Create: `src/styles/FeatureHubStyles.ts`
- Modify: `src/dashboard/DashboardManager.ts`
- Modify: `src/services/ProductExperienceService.ts`
- Modify: `src/services/DesignSystemService.ts`
- Create: `tests/feature-hub.test.ts`
- Modify: `tests/all.test.ts`

- [ ] **Step 1: Write failing feature-hub tests**

Assert the Modal consumes `FEATURE_CATALOG`, renders both status dimensions, uses the existing Dashboard `addWidget`, and routes each approved action to its existing Modal/service. Add a manager test requiring `addWidget` to return the created Widget on success and `null` for unknown Dashboard/type. Add CSS/source assertions requiring `.dashflow-feature-action` to remain visible at `max-width: 760px` and a visible `:focus-visible` state.

- [ ] **Step 2: Run and verify RED**

Run: `npm test`

Expected: FAIL because the Modal, styles, and command-bar feature action do not exist.

- [ ] **Step 3: Implement the Modal**

`FeatureHubModal` extends Obsidian `Modal`. It derives status from the active Dashboard, AI settings/client configuration, Morning Briefing opt-in, and WeRead settings/service configuration.

For Widget entries:

- `not-added`: call `dashboardManager.addWidget(active.id, widgetType)` and inspect its result. Only after a non-null result may the hub refresh, close, and navigate. A `null` result or thrown error keeps the hub open and shows a clear Notice.
- `added`: navigate directly; project view types call `productExperience.openProjectView(widgetType)`.
- `needs-configuration` or `disabled`: open Integration settings or the existing Morning Briefing/Workflow Modal as appropriate; never start a network request.

Use existing creation, search, AI, Morning Briefing, Workflow, settings, and Dashboard manager entry points.

Change `DashboardManager.addWidget` to `Promise<WidgetInstance | null>`; existing callers may ignore the return value. Return `null` before mutation when the Dashboard or Widget definition is unavailable, and return the exact created instance only after `updateDashboard` succeeds.

- [ ] **Step 4: Add the always-visible command-bar entry and styles**

Insert a grid/blocks icon button labelled “功能” between Add and Search. Give it `is-icon-action dashflow-feature-action`, so existing mobile selectors do not remove it. Add grouped rows, compact status badges, keyboard focus, error text, and responsive single-column behavior; reuse DashFlow semantic variables and no new dependency.

Remove the local `COMMAND_SECTIONS` duplication from `ProductExperienceService` and build its primary navigation from `PRODUCT_SECTIONS`, so section IDs, labels, and icons share one catalog with command navigation.

Inject `FEATURE_HUB_STYLES` through `DesignSystemService`.

- [ ] **Step 5: Run and verify GREEN**

Run: `npm test`

Expected: all tests pass and the normal command bar contains Add, Features, and Search at narrow widths.

- [ ] **Step 6: Commit**

```powershell
git add src/ui/FeatureHubModal.ts src/styles/FeatureHubStyles.ts src/dashboard/DashboardManager.ts src/services/ProductExperienceService.ts src/services/DesignSystemService.ts tests/feature-hub.test.ts tests/all.test.ts
git commit -m "feat: add unified feature hub"
```

### Task 5: Prevent blank fixed sections with contextual one-click recovery

**Files:**
- Modify: `src/product/sectionPolicy.ts`
- Modify: `src/services/ProductExperienceService.ts`
- Modify: `src/styles/FeatureHubStyles.ts`
- Create: `tests/section-recovery.test.ts`
- Modify: `tests/all.test.ts`

- [ ] **Step 1: Write failing recovery tests**

Require a pure recovery descriptor for Projects, Calendar, Habits, and Review. Assert a Minimal Dashboard returns its recommended Widget, title, explanation, and action label. Add source assertions that the action calls `dashboardManager.addWidget` and refreshes the current section.

- [ ] **Step 2: Run and verify RED**

Run: `npm test`

Expected: FAIL because focused sections still end as an empty grid.

- [ ] **Step 3: Render contextual recovery**

Before laying out focused-section cards, calculate coverage using visible Dashboard instances. If missing, hide all cards, append one `.dashflow-section-assist` element, and provide “添加项目列表 / 添加日历 / 添加习惯 / 添加每周复盘”. On success, remove the assistant and force a fresh Dashboard render; on failure show a Notice and keep the explanation visible.

Update `clearSyntheticPage` so section assistants and project tools are removed when switching sections or entering layout editing.

- [ ] **Step 4: Run and verify GREEN**

Run: `npm test`

Expected: recovery tests pass without changing Dashboard schema or templates.

- [ ] **Step 5: Commit**

```powershell
git add src/product/sectionPolicy.ts src/services/ProductExperienceService.ts src/styles/FeatureHubStyles.ts tests/section-recovery.test.ts tests/all.test.ts
git commit -m "feat: recover missing section content"
```

### Task 6: Unify project list, Kanban, and timeline behind one Projects switcher

**Files:**
- Modify: `src/services/ProductExperienceService.ts`
- Modify: `src/styles/FeatureHubStyles.ts`
- Create: `tests/project-views.test.ts`
- Modify: `tests/all.test.ts`

- [ ] **Step 1: Write failing project-view tests**

Test the pure initial fallback and add source behavior assertions for exactly three view options, only one selected type visible, first matching instance selection, session-only state, and “添加此视图” for an uninstalled choice.

- [ ] **Step 2: Run and verify RED**

Run: `npm test`

Expected: FAIL because Projects currently displays all policy-matching cards with no switcher.

- [ ] **Step 3: Implement session-scoped project selection**

Add `private activeProjectView: ProjectViewType | null = null` and public `openProjectView(type)` to `ProductExperienceService`. On first entry, resolve installed priority. Render a semantic `nav.dashflow-project-view-switcher`; display selected, available, or addable state for each type.

During Projects layout, select the first non-hidden Dashboard instance matching the chosen type, show only that card, and place it below the switcher. When the chosen type is absent, show the add-view assistant instead of silently falling back after an explicit user selection. Its “添加此视图” action calls `addWidget` for the selected type; only a non-null result updates `activeProjectView`, refreshes, and selects the first matching instance. A `null` result or thrown error leaves the assistant visible and shows a Notice. Work still renders all instances normally.

- [ ] **Step 4: Add responsive and accessibility treatment**

Use a compact segmented row on desktop and horizontal scrolling on narrow windows. Apply `aria-current="page"`, real labels, focus rings, and no color-only state.

- [ ] **Step 5: Run and verify GREEN**

Run: `npm test`

Expected: project-view tests and all existing Widget interaction tests pass.

- [ ] **Step 6: Commit**

```powershell
git add src/services/ProductExperienceService.ts src/styles/FeatureHubStyles.ts tests/project-views.test.ts tests/all.test.ts
git commit -m "feat: unify project views"
```

### Task 7: Document, verify, build, and install safely

**Files:**
- Modify: `README.md`
- Generated: `main.js`, `styles.css` if the existing build updates them
- Install targets: `G:\文档\于浩的知识库\.obsidian\plugins\dashflow\main.js`, `manifest.json`, `styles.css`, `assets/heroes/*`

- [ ] **Step 1: Update user documentation**

Document “功能” discovery, Projects list/Kanban/timeline switching, and one-click fixed-section recovery. Keep maintenance commands under Advanced/Obsidian commands.

- [ ] **Step 2: Run complete verification**

Run:

```powershell
npm test
npx tsc -noEmit -skipLibCheck
npm run build
node --check main.js
git diff --check
npm audit --offline
```

Expected: tests, TypeScript, build, syntax, whitespace, and offline audit all pass.

- [ ] **Step 3: Inspect the built bundle**

Confirm the feature catalog, Feature Hub, Projects view labels, and section recovery are present; confirm no third-party Hero URL or plaintext secret was introduced.

- [ ] **Step 4: Install without touching user data**

Resolve and verify the target is exactly `G:\文档\于浩的知识库\.obsidian\plugins\dashflow`. Copy only `main.js`, `manifest.json`, `styles.css`, and existing `assets/heroes`. Do not overwrite or delete `data.json`.

Use explicit PowerShell validation and copies:

```powershell
$installTarget = 'G:\文档\于浩的知识库\.obsidian\plugins\dashflow'
$resolvedTarget = (Resolve-Path -LiteralPath $installTarget).Path
if ($resolvedTarget -ne $installTarget) { throw "Unexpected install target: $resolvedTarget" }
$dataHashBefore = if (Test-Path -LiteralPath "$installTarget\data.json") { (Get-FileHash -LiteralPath "$installTarget\data.json").Hash } else { $null }
Copy-Item -LiteralPath '.\main.js' -Destination "$installTarget\main.js" -Force
Copy-Item -LiteralPath '.\manifest.json' -Destination "$installTarget\manifest.json" -Force
Copy-Item -LiteralPath '.\styles.css' -Destination "$installTarget\styles.css" -Force
Copy-Item -LiteralPath '.\assets\heroes\alpine.webp' -Destination "$installTarget\assets\heroes\alpine.webp" -Force
Copy-Item -LiteralPath '.\assets\heroes\paper.webp' -Destination "$installTarget\assets\heroes\paper.webp" -Force
Copy-Item -LiteralPath '.\assets\heroes\midnight.webp' -Destination "$installTarget\assets\heroes\midnight.webp" -Force
$dataHashAfter = if (Test-Path -LiteralPath "$installTarget\data.json") { (Get-FileHash -LiteralPath "$installTarget\data.json").Hash } else { $null }
if ($dataHashAfter -ne $dataHashBefore) { throw 'data.json changed during install' }
```

- [ ] **Step 5: Runtime visual check**

Reload DashFlow in Obsidian and verify wide/narrow feature entry, all 18 Widget statuses, the current seven unadded Widgets, project switching/add states, missing-section recovery, and disabled Morning Briefing/WeRead behavior.

- [ ] **Step 6: Commit documentation and generated artifacts**

```powershell
git add README.md styles.css
git commit -m "docs: explain unified feature discovery"
```

`main.js` is intentionally ignored and distributed/installed as a build artifact, so do not force-add it to Git.

- [ ] **Step 7: Report repository state before external sync**

Run `git status -sb` and `git rev-list --left-right --count origin/main...HEAD`. Push only after explicit confirmation for GitHub synchronization.

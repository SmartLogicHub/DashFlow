import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const presentationPath = "src/styles/ProductPresentationStyles.ts";
const productDesign = readFileSync("src/services/ProductDesignService.ts", "utf8");
const designSystem = readFileSync("src/services/DesignSystemService.ts", "utf8");
const productExperience = readFileSync("src/services/ProductExperienceService.ts", "utf8");
const weeklyReview = readFileSync("src/services/WeeklyReviewWidgetInteractionService.ts", "utf8");
const calendar = readFileSync("src/services/CalendarWidgetInteractionService.ts", "utf8");
const habitWidget = readFileSync("src/services/HabitWidgetInteractionService.ts", "utf8");
const activityWidget = readFileSync("src/services/ActivityWidgetInteractionService.ts", "utf8");
const settingsStyles = readFileSync("src/styles/SettingsStyles.ts", "utf8");
const workflowStyles = readFileSync("src/styles/WorkflowStyles.ts", "utf8");

function filesBelow(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const entry = join(directory, name);
    return statSync(entry).isDirectory() ? filesBelow(entry) : [entry];
  });
}

test("the product has one canonical presentation entry point", () => {
  assert.ok(existsSync(presentationPath), "ProductPresentationStyles.ts should exist");
  assert.ok(
    designSystem.includes('import { PRODUCT_PRESENTATION_STYLES } from "../styles/ProductPresentationStyles"'),
    "DesignSystemService should import the canonical presentation layer",
  );
  assert.equal(productDesign.includes("PRODUCT_PRESENTATION_STYLES"), false);
  const foundationIndex = designSystem.indexOf("DESIGN_SYSTEM_STYLES,");
  const presentationIndex = designSystem.indexOf("PRODUCT_PRESENTATION_STYLES,");
  const featureIndex = designSystem.indexOf("AI_NEWS_STYLES,");
  assert.ok(foundationIndex < presentationIndex && presentationIndex < featureIndex);
});

test("the canonical presentation layer owns the minimum type and control tokens", () => {
  assert.ok(existsSync(presentationPath), "ProductPresentationStyles.ts should exist");
  const presentation = readFileSync(presentationPath, "utf8");

  for (const token of [
    "--df-type-label: 11px",
    "--df-type-secondary: 12px",
    "--df-type-body: 13px",
    "--df-type-title: 14px",
    "--df-control-compact: 32px",
    "--df-control-touch: 36px",
  ]) {
    assert.ok(presentation.includes(token), `missing presentation token: ${token}`);
  }
});

test("the product shell exposes a container query boundary", () => {
  assert.ok(existsSync(presentationPath), "ProductPresentationStyles.ts should exist");
  const presentation = readFileSync(presentationPath, "utf8");
  assert.ok(presentation.includes(".dashflow-command-shell"));
  assert.ok(presentation.includes("container: dashflow-shell / inline-size"));
});

test("narrow panes split navigation and primary actions into two visible rows", () => {
  const presentation = readFileSync(presentationPath, "utf8");
  assert.ok(presentation.includes(".dashflow-command-shell.is-mobile .dashflow-command-bar"));
  assert.ok(presentation.includes("grid-template-columns: minmax(0, 1fr)"));
  assert.ok(presentation.includes(".dashflow-command-shell.is-mobile .dashflow-command-nav"));
  assert.ok(presentation.includes("overflow-x: auto"));
  assert.ok(presentation.includes(".dashflow-command-shell.is-mobile .dashflow-command-actions"));
  assert.ok(presentation.includes("grid-template-columns: var(--df-control-touch) minmax(76px, 1fr) minmax(72px, .8fr) var(--df-control-touch)"));
});

test("narrow action row keeps Add Feature and Search addressable", () => {
  for (const action of ["add", "features", "search"]) {
    assert.ok(productExperience.includes(`dataset.commandAction = "${action}"`));
  }
  const presentation = readFileSync(presentationPath, "utf8");
  assert.ok(presentation.includes('[data-command-action="features"] .dashflow-command-label'));
  assert.ok(presentation.includes("display: inline"));
  assert.ok(productExperience.includes('button.setAttribute("aria-label", label)'));
});

test("layout editing stays visible in the persistent command bar", () => {
  assert.ok(productExperience.includes('dataset.commandAction = "layout"'));
  assert.ok(productExperience.includes("mountLayoutAction"));
  assert.ok(productExperience.includes('setAttribute("aria-pressed", String(editing))'));
  assert.equal(productExperience.includes("right.appendChild(editButton)"), false);
  const presentation = readFileSync(presentationPath, "utf8");
  assert.ok(presentation.includes('[data-command-action="layout"]'));
});

test("active narrow navigation is centered after section sync", () => {
  assert.ok(productExperience.includes("centerActiveCommand(button)"));
  assert.ok(productExperience.includes("private centerActiveCommand"));
  assert.ok(productExperience.includes('scrollIntoView({ inline: "center", block: "nearest" })'));
});

test("canonical presentation applies readable widget typography and numeric alignment", () => {
  const presentation = readFileSync(presentationPath, "utf8");
  assert.ok(presentation.includes("font-variant-numeric: tabular-nums"));
  assert.ok(presentation.includes("font-size: var(--df-type-title) !important"));
  assert.ok(presentation.includes("font-size: var(--df-type-body)"));
  assert.ok(presentation.includes("min-height: var(--df-control-compact)"));
  for (const selector of [
    ".dashflow-widget-kicker",
    ".dashflow-capture-footer span",
    ".dashflow-task-overview-label",
    ".dashflow-countdown > span",
    ".dashflow-stat span",
  ]) {
    assert.ok(presentation.includes(selector), `missing readable type override: ${selector}`);
  }
  assert.equal(/font-size:\s*(?:[7-9](?:\.\d+)?|10(?:\.\d+)?)px/.test(activityWidget), false);
});

test("product UI source never renders business text below the 11px label token", () => {
  const undersized = /font-size:\s*(?:[7-9](?:\.\d+)?|10(?:\.\d+)?)px/g;
  for (const file of [...filesBelow("src"), "styles.css"].filter((name) => /\.(?:ts|css)$/.test(name))) {
    const matches = readFileSync(file, "utf8").match(undersized) ?? [];
    assert.deepEqual(matches, [], `${file} contains undersized UI text: ${matches.join(", ")}`);
  }
});

test("weekly review no longer renders business labels below 11px", () => {
  assert.equal(/font-size:\s*(?:[7-9](?:\.\d+)?|10(?:\.0+)?)px/.test(weeklyReview), false);
  for (const label of ["已完成任务", "习惯完成率", "较上周活跃度", "活跃度"]) {
    assert.ok(weeklyReview.includes(label), label);
  }
  assert.ok(weeklyReview.includes("font-variant-numeric:tabular-nums"));
});

test("calendar uses readable labels and cell-filling touch targets", () => {
  assert.equal(/font-size:\s*(?:[7-9](?:\.\d+)?|10(?:\.0+)?)px/.test(calendar), false);
  assert.ok(calendar.includes(".dashflow-calendar-day{appearance:none;width:100%"));
  assert.ok(calendar.includes("min-height:var(--df-control-touch)"));
  assert.ok(calendar.includes('return "项目"'));
  assert.ok(calendar.includes('return "习惯"'));
});

test("Work replaces long project and review bodies with routed summaries", () => {
  const presentation = readFileSync(presentationPath, "utf8");
  assert.ok(productExperience.includes("查看全部项目"));
  assert.ok(productExperience.includes('openSection("projects")'));
  assert.ok(presentation.includes('.dashflow-grid[data-product-section="work"]'));
  assert.ok(presentation.includes(".dashflow-project-row:nth-of-type(n + 4)"));
  assert.ok(presentation.includes(".dashflow-weekly-grid"));
  assert.ok(presentation.includes("display: none !important"));
  assert.ok(presentation.includes('.dashflow-widget[data-widget-type="progress"] .dashflow-task-overview'));
  assert.ok(presentation.includes("min-height: 0"));
  assert.ok(presentation.includes('.dashflow-widget-body:has(> .dashflow-empty)'));
  assert.ok(presentation.includes("grid-template-rows: auto minmax(0, 1fr)"));
});

test("Review owns natural-height weekly content instead of nested scrolling", () => {
  const presentation = readFileSync(presentationPath, "utf8");
  assert.ok(weeklyReview.includes("查看完整复盘"));
  assert.ok(weeklyReview.includes('activateSection("review")'));
  assert.ok(presentation.includes('.dashflow-grid[data-product-section="review"]'));
  assert.ok(presentation.includes("height: auto !important"));
  assert.ok(presentation.includes("max-height: none !important"));
  assert.ok(presentation.includes("overflow: visible !important"));
});

test("focused empty states stay compact and actionable", () => {
  const presentation = readFileSync(presentationPath, "utf8");
  assert.ok(habitWidget.includes("dashflow-habit-empty-action"));
  assert.ok(presentation.includes(".dashflow-habit-empty"));
  assert.ok(presentation.includes("min-height: var(--df-control-touch)"));
  assert.ok(presentation.includes(".dashflow-section-assist button"));
  assert.ok(presentation.includes("width: 100%"));
});

test("calendar and recovery content respond to the DashFlow pane, not only the window", () => {
  const presentation = readFileSync(presentationPath, "utf8");
  assert.ok(presentation.includes("@container dashflow-shell (max-width: 720px)"));
  assert.ok(presentation.includes('.dashflow-grid[data-product-section="calendar"] .dashflow-calendar'));
  assert.ok(presentation.includes("grid-template-columns: 1fr"));
  assert.ok(presentation.includes(".dashflow-calendar-agenda"));
  assert.ok(presentation.includes("border-top: 1px solid"));
});

test("the canonical presentation layer replaces all legacy global polish files", () => {
  const legacyFiles = [
    "DeepSeekPolishStyles.ts",
    "ProductHierarchyResetStyles.ts",
    "UiRefinementStyles.ts",
    "VisualContinuityStyles.ts",
  ];
  for (const file of legacyFiles) {
    assert.equal(existsSync(`src/styles/${file}`), false, `${file} should be retired`);
    assert.equal(designSystem.includes(file.replace(".ts", "")), false, `${file} should not be imported`);
  }

  const presentation = readFileSync(presentationPath, "utf8");
  for (const selector of [
    ".dashflow-command-shell:not(.is-personal-home) > .dashflow-hero",
    ".dashflow-task-editor > .setting-item",
    ".dashflow-project-detail-meta",
    ".dashflow-quick-add-actions",
    ".dashflow-search-modal",
  ]) assert.ok(presentation.includes(selector), selector);
});

test("presentation override debt stays below the explicit consolidation budget", () => {
  const styleSources = readdirSync("src/styles")
    .filter((file) => file.endsWith(".ts"))
    .map((file) => readFileSync(`src/styles/${file}`, "utf8"));
  styleSources.push(productDesign);
  const importantCount = (styleSources.join("\n").match(/!important/g) ?? []).length;
  assert.ok(importantCount <= 420, `expected at most 420 !important declarations, found ${importantCount}`);
});

test("theme cards allow two-line titles and unclipped descriptions", () => {
  assert.ok(settingsStyles.includes("min-height: 2.6em"));
  assert.ok(settingsStyles.includes("white-space: normal"));
  assert.ok(settingsStyles.includes("overflow: visible"));
  assert.equal(settingsStyles.includes("-webkit-line-clamp"), false);
});

test("Quick Add keeps its target and actions aligned at desktop and narrow widths", () => {
  const presentation = readFileSync(presentationPath, "utf8");
  const target = presentation.match(/\.dashflow-quick-add-target\s*\{([^}]*)\}/)?.[1] ?? "";
  const action = presentation.match(/\.dashflow-quick-add-action\s*\{([^}]*)\}/)?.[1] ?? "";
  assert.match(target, /display:\s*flex/);
  assert.match(target, /justify-content:\s*space-between/);
  assert.match(target, /align-items:\s*center/);
  assert.match(target, /margin:\s*6px 2px 0/);
  assert.match(action, /display:\s*grid/);
  assert.match(action, /grid-template-columns:\s*22px minmax\(0, 1fr\)/);
  assert.ok(presentation.includes(".dashflow-quick-add-submit"));
  assert.ok(presentation.includes(".dashflow-quick-add-section-label"));
  assert.ok(presentation.includes(".dashflow-quick-add-actions { grid-template-columns: 1fr; }"));
  assert.ok(presentation.includes(".dashflow-quick-add-target { flex-wrap: wrap; }"));
  assert.equal(workflowStyles.includes(".dashflow-quick-add-target"), false);
});

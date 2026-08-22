import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";

const presentationPath = "src/styles/ProductPresentationStyles.ts";
const productDesign = readFileSync("src/services/ProductDesignService.ts", "utf8");
const productExperience = readFileSync("src/services/ProductExperienceService.ts", "utf8");
const weeklyReview = readFileSync("src/services/WeeklyReviewWidgetInteractionService.ts", "utf8");
const calendar = readFileSync("src/services/CalendarWidgetInteractionService.ts", "utf8");

test("the product has one canonical presentation entry point", () => {
  assert.ok(existsSync(presentationPath), "ProductPresentationStyles.ts should exist");
  assert.ok(
    productDesign.includes('import { PRODUCT_PRESENTATION_STYLES } from "../styles/ProductPresentationStyles"'),
    "ProductDesignService should import the canonical presentation layer",
  );
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
  assert.ok(presentation.includes("grid-template-columns: var(--df-control-touch) minmax(82px, 1fr) var(--df-control-touch)"));
});

test("narrow action row keeps Add Feature and Search addressable", () => {
  for (const action of ["add", "features", "search"]) {
    assert.ok(productExperience.includes(`dataset.commandAction = "${action}"`));
  }
  const presentation = readFileSync(presentationPath, "utf8");
  assert.ok(presentation.includes('[data-command-action="features"] .dashflow-command-label'));
  assert.ok(presentation.includes("display: inline"));
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

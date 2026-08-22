import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const visual = readFileSync("src/styles/ProductPresentationStyles.ts", "utf8");
const design = readFileSync("src/services/DesignSystemService.ts", "utf8");
const productDesign = readFileSync("src/services/ProductDesignService.ts", "utf8");
const home = readFileSync("src/services/PersonalHomeDesignService.ts", "utf8");
const habit = readFileSync("src/ui/HabitEditorModal.ts", "utf8");
const quickAdd = readFileSync("src/ui/QuickAddModal.ts", "utf8");
const search = readFileSync("src/ui/GlobalSearchModal.ts", "utf8");

test("Home stays immersive while working sections use compact photographic Heroes", () => {
  assert.ok(home.includes("height:194px!important") || home.includes("height: 194px!important"));
  assert.ok(visual.includes("height: 128px"));
  assert.ok(visual.includes("height: 112px"));
  assert.equal(design.includes("--df-page-hero-height: 88px"), false);
  assert.equal(design.includes("height: 72px!important"), false);
});

test("v0.4.3 introduces shared spacing, radius and typography tokens", () => {
  for (const token of [
    "--df-space-1",
    "--df-space-4",
    "--df-radius-sm",
    "--df-radius-lg",
    "--df-font-xs",
    "--df-font-md",
    "--df-control-md",
  ]) {
    assert.ok(design.includes(token), `missing design token ${token}`);
  }
});

test("work project rows use their real three-part structure without duplicate progress bars", () => {
  assert.ok(visual.includes("grid-template-columns: minmax(0, 1fr) minmax(96px, 146px) 54px !important"));
  assert.ok(visual.includes(".dashflow-project-row:has(.dashflow-project-steps) .dashflow-project-bar"));
  assert.ok(visual.includes("display: none !important"));
});

test("task overview uses one primary decision and one secondary context", () => {
  assert.ok(productDesign.includes(".dashflow-task-overview-primary"));
  assert.ok(productDesign.includes(".dashflow-task-overview-secondary"));
  assert.ok(productDesign.includes(".dashflow-task-overview-ring::before"));
  assert.ok(productDesign.includes("var(--df-home-accent, var(--interactive-accent))"));
});

test("setting-based editors share a readable two-column modal layout", () => {
  for (const selector of ["dashflow-task-editor", "dashflow-project-editor", "dashflow-habit-editor"]) {
    assert.ok(visual.includes(selector));
  }
  assert.ok(visual.includes("grid-template-columns: minmax(0, 1fr) minmax(220px, 280px)"));
  assert.ok(visual.includes(".dashflow-task-editor-actions"));
  assert.ok(visual.includes(".dashflow-habit-editor-actions"));
});

test("habit and quick add participate in the shared editor visual system", () => {
  assert.ok(habit.includes('contentEl.addClass("dashflow-habit-editor", "dashflow-editor-modal")'));
  assert.ok(habit.includes('cls: "dashflow-modal-eyebrow"'));
  assert.ok(quickAdd.includes('contentEl.addClass("dashflow-quick-add-modal", "dashflow-editor-modal")'));
  assert.ok(quickAdd.includes("dashflow-modal-eyebrow dashflow-quick-add-eyebrow"));
});

test("search, quick add, project detail and AI each receive purpose-built layout hooks", () => {
  assert.ok(search.includes('this.modalEl.addClass("dashflow-search-modal")'));
  for (const selector of [".dashflow-quick-add-actions", ".dashflow-search-modal", ".dashflow-project-detail-meta", ".dashflow-ai-plan-output"]) {
    assert.ok(visual.includes(selector));
  }
});

test("calendar and review use one calm visual language", () => {
  assert.ok(visual.includes(".dashflow-calendar-agenda"));
  assert.ok(visual.includes("border-top: 1px solid var(--df-cmd-border)"));
  assert.ok(visual.includes(".dashflow-weekly-grid"));
  assert.ok(visual.includes("overflow: visible !important"));
});

test("mobile collapses editors and work rows while preserving the Hero artwork", () => {
  assert.ok(visual.includes("@media (max-width: 760px)"));
  assert.ok(visual.includes("grid-template-columns: 1fr"));
  assert.ok(visual.includes("@container dashflow-shell (max-width: 900px)"));
  assert.ok(visual.includes("height: 112px"));
  assert.equal(design.includes("height: 72px!important"), false);
});

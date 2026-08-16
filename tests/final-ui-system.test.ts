import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const visual = readFileSync("src/services/VisualContinuityService.ts", "utf8");
const habit = readFileSync("src/ui/HabitEditorModal.ts", "utf8");
const quickAdd = readFileSync("src/ui/QuickAddModal.ts", "utf8");
const search = readFileSync("src/ui/GlobalSearchModal.ts", "utf8");

test("all desktop product sections keep the same 194px photographic frame", () => {
  assert.ok(visual.includes("height: 194px!important"));
  assert.ok(visual.includes("min-height: 194px!important"));
  for (const section of ["work", "projects", "inbox", "calendar", "habits", "review"]) {
    assert.ok(visual.includes(`data-section=\"${section}\"`));
  }
});

test("work project rows use their real three-part structure without duplicate progress bars", () => {
  assert.ok(visual.includes("grid-template-columns: minmax(0, 1fr) minmax(96px, 146px) 54px!important"));
  assert.ok(visual.includes(".dashflow-project-row:has(.dashflow-project-steps) .dashflow-project-bar"));
  assert.ok(visual.includes("display: none!important"));
});

test("dual progress rings share one accent and one inner disc", () => {
  assert.ok(visual.includes("var(--df-home-accent, var(--interactive-accent)) var(--dashflow-progress)"));
  assert.ok(visual.includes(".dashflow-progress-ring::after { display: none!important; }"));
  assert.ok(visual.includes(".dashflow-progress-ring::before"));
  assert.ok(visual.includes("gap: 20px!important"));
});

test("setting-based editors share a readable two-column modal layout", () => {
  for (const selector of ["dashflow-task-editor", "dashflow-project-editor", "dashflow-habit-editor"]) {
    assert.ok(visual.includes(selector));
  }
  assert.ok(visual.includes("grid-template-columns: minmax(0, 1fr) minmax(220px, 280px)!important"));
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
  assert.ok(visual.includes("/* QUICK ADD"));
  assert.ok(visual.includes("/* GLOBAL SEARCH"));
  assert.ok(visual.includes("/* PROJECT DETAIL MODAL"));
  assert.ok(visual.includes("/* AI PLAN"));
});

test("calendar and review use one calm visual language", () => {
  assert.ok(visual.includes(".dashflow-calendar-day.is-today"));
  assert.ok(visual.includes("box-shadow: none!important"));
  assert.ok(visual.includes(".dashflow-weekly-kpis"));
  assert.ok(visual.includes("border-right: 1px solid var(--df-cmd-border)!important"));
});

test("mobile collapses editors and work rows without horizontal overflow", () => {
  assert.ok(visual.includes("@media (max-width: 760px)"));
  assert.ok(visual.includes("grid-template-columns: 1fr!important"));
  assert.ok(visual.includes("grid-template-columns: minmax(0, 1fr) 54px!important"));
});

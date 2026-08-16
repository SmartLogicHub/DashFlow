import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const experience = readFileSync("src/services/ProductExperienceService.ts", "utf8");
const design = readFileSync("src/services/ProductDesignService.ts", "utf8");

test("Command Dashboard uses horizontal navigation instead of an internal full-height app sidebar", () => {
  assert.ok(experience.includes("COMMAND_SECTIONS"));
  assert.ok(experience.includes("dashflow-command-bar"));
  assert.ok(experience.includes("dashflow-command-nav"));
  assert.ok(experience.includes("dashflow-command-actions"));
  assert.ok(experience.includes("dashflow-product-nav\")?.remove()"));
  assert.equal(design.includes("grid-template-columns: 176px minmax(0, 1fr)"), false);
});

test("Home is a compact editable dashboard rather than a synthetic Today application screen", () => {
  assert.ok(experience.includes("HOME_WIDGET_TYPES"));
  for (const type of ["quick-capture", "tasks", "progress", "projects", "upcoming", "heatmap", "countdown"]) {
    assert.ok(experience.includes(`\"${type}\"`), type);
  }
  assert.equal(experience.includes("dashflow-focus-panel"), false);
});

test("Reference styling uses one dark purple hero, terminal-like pulse and dense card chrome", () => {
  assert.ok(design.includes("Reference-style purple command banner"));
  assert.ok(design.includes("Pulse strip: narrow, data-dense"));
  assert.ok(design.includes("Dense dashboard grid"));
  assert.ok(design.includes("border-radius: 7px !important"));
  assert.ok(design.includes("height: 34px !important"));
});

test("Reference dashboard enhancements use real data instead of decorative fake metrics", () => {
  assert.ok(experience.includes("activityStreak(this.plugin.data.activity)"));
  assert.ok(experience.includes('this.progressMetric("TODAY"'));
  assert.ok(experience.includes('this.progressMetric("ALL TASKS"'));
  assert.ok(experience.includes("ProjectDetailModal"));
  assert.ok(experience.includes("dashflow-task-priority"));
});

test("hidden workflow cards remain hidden even when responsive CSS changes grid layout", () => {
  assert.ok(experience.includes('card.style.setProperty("display", "none", "important")'));
  assert.ok(experience.includes('card.style.removeProperty("display")'));
});

test("Inbox remains a real processing workflow instead of a decorative dashboard card", () => {
  assert.ok(experience.includes("renderInboxPage"));
  assert.ok(experience.includes("inboxTasks("));
  assert.ok(experience.includes("captureService.capture"));
  assert.ok(experience.includes("TaskEditorModal"));
});

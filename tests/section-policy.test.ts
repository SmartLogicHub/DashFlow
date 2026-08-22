import assert from "node:assert/strict";
import test from "node:test";
import {
  initialProjectView,
  recommendedWidgetType,
  sectionCoverage,
  sectionWidgetTypes,
} from "../src/product/sectionPolicy";

test("fixed sections declare one centralized Widget ownership policy", () => {
  assert.deepEqual(sectionWidgetTypes("projects"), ["projects", "project-kanban", "project-gantt"]);
  assert.deepEqual(sectionWidgetTypes("calendar"), ["calendar"]);
  assert.deepEqual(sectionWidgetTypes("habits"), ["habits", "heatmap"]);
  assert.deepEqual(sectionWidgetTypes("review"), ["weekly-review", "heatmap", "vault-stats"]);
  assert.deepEqual(sectionWidgetTypes("today"), []);
  assert.deepEqual(sectionWidgetTypes("work"), []);
  assert.deepEqual(sectionWidgetTypes("inbox"), []);
});

test("each fixed section has an explicit recommended base Widget", () => {
  assert.equal(recommendedWidgetType("projects"), "projects");
  assert.equal(recommendedWidgetType("calendar"), "calendar");
  assert.equal(recommendedWidgetType("habits"), "habits");
  assert.equal(recommendedWidgetType("review"), "weekly-review");
  assert.equal(recommendedWidgetType("work"), null);
});

test("section coverage ignores hidden instances", () => {
  assert.equal(sectionCoverage("review", [{ type: "tasks", hidden: false }]).missing, true);
  assert.equal(sectionCoverage("habits", [{ type: "habits", hidden: true }]).missing, true);
  assert.equal(sectionCoverage("habits", [{ type: "heatmap", hidden: false }]).missing, false);
  assert.deepEqual(
    sectionCoverage("projects", [
      { type: "project-kanban", hidden: false },
      { type: "project-kanban", hidden: false },
      { type: "project-gantt", hidden: true },
    ]).visibleTypes,
    ["project-kanban"],
  );
});

test("the initial project view follows product priority, not Dashboard order", () => {
  assert.equal(initialProjectView([{ type: "project-gantt", hidden: false }]), "project-gantt");
  assert.equal(initialProjectView([
    { type: "project-kanban", hidden: false },
    { type: "projects", hidden: false },
  ]), "projects");
  assert.equal(initialProjectView([
    { type: "project-gantt", hidden: false },
    { type: "project-kanban", hidden: false },
  ]), "project-kanban");
  assert.equal(initialProjectView([]), "projects");
});

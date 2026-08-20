import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const widget = readFileSync("src/widgets/gantt.ts", "utf8");
const interaction = readFileSync("src/services/ProjectGanttWidgetInteractionService.ts", "utf8");
const main = readFileSync("src/main.ts", "utf8");

test("project gantt is a registered read-only timeline widget", () => {
  assert.ok(widget.includes('type: "project-gantt"'));
  assert.ok(interaction.includes("createElementNS"));
  assert.ok(interaction.includes('class", "gantt-today"'));
  assert.ok(interaction.includes('class", "gantt-bar"'));
});

test("project gantt derives timeline from project start/deadline and is lifecycle-managed", () => {
  assert.ok(interaction.includes("project.start"));
  assert.ok(interaction.includes("project.deadline"));
  assert.ok(interaction.includes("ProjectDetailModal"));
  assert.ok(main.includes("new ProjectGanttWidgetInteractionService(this)"));
  assert.ok(main.includes("this.projectGanttWidgets.start()"));
  assert.ok(main.includes("this.projectGanttWidgets?.stop()"));
});

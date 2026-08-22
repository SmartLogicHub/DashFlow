import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const service = readFileSync("src/services/ProjectService.ts", "utf8");
const widget = readFileSync("src/widgets/kanban.ts", "utf8");
const interaction = readFileSync("src/services/ProjectKanbanWidgetInteractionService.ts", "utf8");
const main = readFileSync("src/main.ts", "utf8");

test("project kanban is a registered widget that drags projects between status columns", () => {
  assert.ok(widget.includes('type: "project-kanban"'));
  assert.ok(interaction.includes("project.status"));
  assert.ok(interaction.includes('dataTransfer?.setData("text/plain", project.id)'));
  assert.ok(service.includes("changeStatus"));
});

test("project kanban reuses ProjectService and lifecycle management", () => {
  assert.ok(interaction.includes("this.plugin.projectService.changeStatus"));
  assert.ok(interaction.includes("ProjectDetailModal"));
  assert.ok(main.includes("new ProjectKanbanWidgetInteractionService(this)"));
  assert.ok(main.includes("this.projectKanbanWidgets.start()"));
  assert.ok(main.includes("this.projectKanbanWidgets?.stop()"));
});

test("project kanban offers an accessible non-drag status control", () => {
  assert.ok(interaction.includes('move.className = "dashflow-project-kanban-move"'));
  assert.ok(interaction.includes('move.setAttribute("aria-label", `移动项目「${project.name}」`)'));
  assert.ok(interaction.includes("if (next === project.status) return"));
  assert.ok(interaction.includes("this.plugin.projectService.changeStatus(project, next)"));
  assert.ok(interaction.includes('move.addEventListener("pointerdown", stopCardEvent)'));
});

import assert from "node:assert/strict";
import test from "node:test";
import { createDefaultDashboard } from "../src/dashboard/defaultDashboard";
import { PRODUCT_SECTIONS } from "../src/product/navigation";
import { isWidgetVisibleInSection } from "../src/product/widgetVisibility";
import { WidgetRegistry } from "../src/widgets/WidgetRegistry";
import { registerBuiltins } from "../src/widgets/builtins";
import { registerDataWidgets } from "../src/widgets/data";
import { registerEmbedWidgets } from "../src/widgets/embed";
import { registerFocusWidgets } from "../src/widgets/focus";
import { registerGanttWidgets } from "../src/widgets/gantt";
import { registerIntelligenceWidgets } from "../src/widgets/intelligence";
import { registerKanbanWidgets } from "../src/widgets/kanban";
import { registerOpportunityWidgets } from "../src/widgets/opportunity";

function registeredWidgetTypes(): string[] {
  const registry = new WidgetRegistry();
  registerBuiltins(registry);
  registerDataWidgets(registry);
  registerFocusWidgets(registry);
  registerEmbedWidgets(registry);
  registerIntelligenceWidgets(registry);
  registerGanttWidgets(registry);
  registerKanbanWidgets(registry);
  registerOpportunityWidgets(registry);
  return registry.list().map((definition) => definition.type);
}

test("Work displays every registered Widget unless that instance is hidden", () => {
  const types = registeredWidgetTypes();
  assert.ok(types.length > 7, "the registry must include extension Widgets beyond the old Work allowlist");
  assert.deepEqual(types.filter((type) => !isWidgetVisibleInSection("work", type, false)), []);
  assert.deepEqual(types.filter((type) => isWidgetVisibleInSection("work", type, true)), []);
});

test("focused sections retain their purpose-specific Widget filters", () => {
  assert.equal(isWidgetVisibleInSection("projects", "projects", false), true);
  assert.equal(isWidgetVisibleInSection("projects", "project-kanban", false), false);
  assert.equal(isWidgetVisibleInSection("calendar", "calendar", false), true);
  assert.equal(isWidgetVisibleInSection("habits", "habits", false), true);
  assert.equal(isWidgetVisibleInSection("habits", "heatmap", false), true);
  assert.equal(isWidgetVisibleInSection("review", "weekly-review", false), true);
  assert.equal(isWidgetVisibleInSection("review", "heatmap", false), true);
  assert.equal(isWidgetVisibleInSection("review", "vault-stats", false), true);
  assert.equal(isWidgetVisibleInSection("today", "tasks", false), false);
  assert.equal(isWidgetVisibleInSection("inbox", "tasks", false), false);
});

test("0.6 product vocabulary uses Today and the default workspace name", () => {
  const today = PRODUCT_SECTIONS.find((section) => section.id === "today");
  assert.equal(today?.label, "今日");
  assert.equal(today?.title, "今日");

  const registry = new WidgetRegistry();
  registerBuiltins(registry);
  assert.equal(createDefaultDashboard(registry).name, "默认工作台");
});

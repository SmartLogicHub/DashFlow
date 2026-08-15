import assert from "node:assert/strict";
import test from "node:test";
import type { DashboardDefinition } from "../src/models";
import {
  createCustomDashboardTemplate,
  instantiateCustomDashboardTemplate,
  normalizeCustomTemplateDescription,
} from "../src/dashboard/customDashboardTemplates";

function dashboard(): DashboardDefinition {
  return {
    id: "work",
    name: "Work",
    icon: "layout-dashboard",
    settings: { columns: 12, gap: 14, rowHeight: 58, showHeader: true },
    widgets: [
      {
        id: "tasks-1",
        type: "tasks",
        title: "TODAY",
        layout: { x: 0, y: 0, w: 6, h: 5 },
        config: { includeOverdue: true, limit: 8 },
        hidden: false,
      },
      {
        id: "calendar-1",
        type: "calendar",
        layout: { x: 6, y: 0, w: 6, h: 7 },
        config: { agendaLimit: 10 },
        hidden: false,
      },
    ],
    mobile: {
      order: ["calendar-1", "tasks-1"],
      collapsedWidgetIds: ["calendar-1"],
      compactMode: true,
    },
    createdAt: 1,
    updatedAt: 2,
  };
}

test("custom template snapshots dashboard UI state without preserving dashboard ids", () => {
  const template = createCustomDashboardTemplate(
    dashboard(),
    "  Morning   Focus  ",
    "  My   weekday   setup  ",
    [],
    100,
  );

  assert.equal(template.id, "morning-focus");
  assert.equal(template.name, "Morning Focus");
  assert.equal(template.description, "My weekday setup");
  assert.equal(template.dashboard.id, "template-morning-focus");
  assert.deepEqual(template.dashboard.mobile?.collapsedWidgetIds, ["template-morning-focus-calendar-2"]);
  assert.deepEqual(template.dashboard.mobile?.order, [
    "template-morning-focus-calendar-2",
    "template-morning-focus-tasks-1",
  ]);
});

test("custom template ids avoid collisions while allowing friendly names", () => {
  const first = createCustomDashboardTemplate(dashboard(), "Focus", "", [], 100);
  const second = createCustomDashboardTemplate(dashboard(), "Focus", "", [first], 101);
  assert.equal(first.id, "focus");
  assert.equal(second.id, "focus-2");
  assert.equal(second.name, "Focus");
});

test("instantiating a custom template remaps widget ids and keeps template state independent", () => {
  const template = createCustomDashboardTemplate(dashboard(), "Work Starter", "", [], 100);
  const created = instantiateCustomDashboardTemplate(template, "client-a", "Client A", 200);

  assert.equal(created.id, "client-a");
  assert.equal(created.name, "Client A");
  assert.deepEqual(created.widgets.map((widget) => widget.id), [
    "client-a-tasks-1",
    "client-a-calendar-2",
  ]);
  assert.deepEqual(created.mobile?.order, ["client-a-calendar-2", "client-a-tasks-1"]);
  assert.deepEqual(created.mobile?.collapsedWidgetIds, ["client-a-calendar-2"]);

  created.widgets[0]!.config.limit = 99;
  created.widgets[0]!.layout.w = 3;
  assert.equal(template.dashboard.widgets[0]!.config.limit, 8);
  assert.equal(template.dashboard.widgets[0]!.layout.w, 6);
});

test("custom template descriptions are normalized and capped", () => {
  const long = `  ${"x".repeat(220)}  `;
  assert.equal(normalizeCustomTemplateDescription(long).length, 180);
  assert.equal(normalizeCustomTemplateDescription("  one   two \n three "), "one two three");
});

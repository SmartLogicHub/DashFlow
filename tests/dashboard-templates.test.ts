import assert from "node:assert/strict";
import test from "node:test";
import { registerBuiltins } from "../src/widgets/builtins";
import { WidgetRegistry } from "../src/widgets/WidgetRegistry";
import {
  DASHBOARD_TEMPLATES,
  createDashboardFromTemplate,
  DEFAULT_DASHBOARD_TEMPLATE_ID,
} from "../src/dashboard/dashboardTemplates";

function overlaps(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number },
): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function registry(): WidgetRegistry {
  const result = new WidgetRegistry();
  registerBuiltins(result);
  return result;
}

test("dashboard template catalog exposes the five built-in starting points", () => {
  assert.equal(DEFAULT_DASHBOARD_TEMPLATE_ID, "daily-focus");
  assert.deepEqual(
    DASHBOARD_TEMPLATES.map((template) => template.id),
    ["daily-focus", "project-management", "habit-tracker", "weekly-review", "minimal"],
  );
  assert.deepEqual(
    DASHBOARD_TEMPLATES.map((template) => template.widgetCount),
    [7, 7, 4, 5, 3],
  );
});

test("every dashboard template has valid unique widget ids, mobile order and non-overlapping desktop layout", () => {
  const widgetRegistry = registry();
  for (const template of DASHBOARD_TEMPLATES) {
    const dashboard = createDashboardFromTemplate(widgetRegistry, template.id, 100);
    const ids = dashboard.widgets.map((widget) => widget.id);
    assert.equal(new Set(ids).size, ids.length, template.id);
    assert.deepEqual(dashboard.mobile?.order, ids, template.id);
    assert.deepEqual(dashboard.mobile?.collapsedWidgetIds, [], template.id);
    assert.equal(dashboard.mobile?.compactMode, false, template.id);

    for (const widget of dashboard.widgets) {
      assert.ok(widget.layout.x >= 0, `${template.id}:${widget.id}`);
      assert.ok(widget.layout.y >= 0, `${template.id}:${widget.id}`);
      assert.ok(widget.layout.w > 0, `${template.id}:${widget.id}`);
      assert.ok(widget.layout.h > 0, `${template.id}:${widget.id}`);
      assert.ok(widget.layout.x + widget.layout.w <= 12, `${template.id}:${widget.id}`);
      assert.ok(widgetRegistry.get(widget.type), `${template.id}:${widget.type}`);
    }

    for (let i = 0; i < dashboard.widgets.length; i += 1) {
      for (let j = i + 1; j < dashboard.widgets.length; j += 1) {
        assert.equal(
          overlaps(dashboard.widgets[i]!.layout, dashboard.widgets[j]!.layout),
          false,
          `${template.id}:${dashboard.widgets[i]!.id}/${dashboard.widgets[j]!.id}`,
        );
      }
    }
  }
});

test("templates are purpose-specific instead of aliases of one default dashboard", () => {
  const byId = new Map(DASHBOARD_TEMPLATES.map((template) => [template.id, template.widgetTypes]));
  assert.deepEqual(byId.get("minimal"), ["quick-capture", "tasks", "progress"]);
  assert.ok(byId.get("project-management")?.includes("projects"));
  assert.ok(byId.get("project-management")?.includes("calendar"));
  assert.ok(byId.get("habit-tracker")?.includes("habits"));
  assert.ok(byId.get("habit-tracker")?.includes("heatmap"));
  assert.equal(byId.get("habit-tracker")?.includes("tasks"), false);
  assert.equal(byId.get("weekly-review")?.[0], "weekly-review");
});

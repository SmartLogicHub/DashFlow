import assert from "node:assert/strict";
import test from "node:test";
import { createDefaultDashboard } from "../src/dashboard/defaultDashboard";
import { upgradeLegacyHomeLayout } from "../src/dashboard/defaultLayoutMigration";
import { registerBuiltins } from "../src/widgets/builtins";
import { WidgetRegistry } from "../src/widgets/WidgetRegistry";

const COMMAND_032_LAYOUT = {
  "quick-capture": { x: 0, y: 0, w: 3, h: 4 },
  "today-tasks": { x: 3, y: 0, w: 3, h: 4 },
  progress: { x: 6, y: 0, w: 3, h: 4 },
  upcoming: { x: 9, y: 0, w: 3, h: 8 },
  projects: { x: 0, y: 4, w: 9, h: 4 },
  activity: { x: 0, y: 8, w: 9, h: 4 },
  countdown: { x: 9, y: 8, w: 3, h: 4 },
  habits: { x: 0, y: 12, w: 12, h: 4 },
  calendar: { x: 0, y: 16, w: 12, h: 7 },
  "weekly-review": { x: 0, y: 23, w: 12, h: 6 },
  "vault-stats": { x: 0, y: 29, w: 12, h: 2 },
} as const;

test("legacy layout migration changes geometry without replacing widget data", () => {
  const registry = new WidgetRegistry();
  registerBuiltins(registry);
  const dashboard = createDefaultDashboard(registry);

  dashboard.settings = { ...dashboard.settings, gap: 8, rowHeight: 44, showHeader: false };
  dashboard.widgets = dashboard.widgets.map((widget, index) => ({
    ...widget,
    title: `custom-${widget.id}`,
    hidden: index % 2 === 0,
    config: { ...widget.config, dataBoundarySentinel: widget.id },
    layout: { ...COMMAND_032_LAYOUT[widget.id as keyof typeof COMMAND_032_LAYOUT] },
  }));

  const before = structuredClone(dashboard);
  const upgraded = upgradeLegacyHomeLayout(dashboard, registry);

  assert.notEqual(upgraded, dashboard);
  assert.deepEqual(dashboard, before, "migration must not mutate the loaded dashboard in place");
  assert.equal(upgraded.id, before.id);
  assert.equal(upgraded.name, before.name);
  assert.equal(upgraded.icon, before.icon);
  assert.equal(upgraded.settings.showHeader, false);
  assert.deepEqual(upgraded.mobile, before.mobile);

  for (const original of before.widgets) {
    const migrated = upgraded.widgets.find((widget) => widget.id === original.id);
    assert.ok(migrated, `missing migrated widget ${original.id}`);
    assert.equal(migrated.type, original.type);
    assert.equal(migrated.title, original.title);
    assert.equal(migrated.hidden, original.hidden);
    assert.deepEqual(migrated.config, original.config);
  }
});

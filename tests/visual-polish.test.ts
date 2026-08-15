import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createDefaultDashboard } from "../src/dashboard/defaultDashboard";
import { upgradeLegacyHomeLayout, usesLegacyHomeLayout } from "../src/dashboard/defaultLayoutMigration";
import { layoutsCollide } from "../src/layout/grid";
import { registerBuiltins } from "../src/widgets/builtins";
import { WidgetRegistry } from "../src/widgets/WidgetRegistry";

const visualSource = readFileSync("src/services/VisualPolishService.ts", "utf8");

function registry(): WidgetRegistry {
  const value = new WidgetRegistry();
  registerBuiltins(value);
  return value;
}

test("visual polish keeps the hero neutral while using accent for controlled glow", () => {
  assert.match(visualSource, /dashflow-hero h1[\s\S]*color:\s*var\(--text-normal\)\s*!important/);
  assert.ok(visualSource.includes("--df-v2-canvas"));
  assert.ok(visualSource.includes("--df-v2-inner"));
  assert.ok(visualSource.includes("backdrop-filter: blur(18px)"));
});

test("visual polish flattens nested project and calendar controls", () => {
  assert.match(visualSource, /dashflow-project-row[\s\S]*box-shadow:\s*none\s*!important/);
  assert.match(visualSource, /dashflow-calendar-day[\s\S]*border:\s*1px solid transparent\s*!important/);
  assert.match(visualSource, /dashflow-calendar-agenda[\s\S]*background:/);
});

test("refined default dashboard is denser and remains collision free", () => {
  const dashboard = createDefaultDashboard(registry());
  assert.equal(dashboard.settings.gap, 12);
  assert.equal(dashboard.settings.rowHeight, 56);
  assert.equal(Math.max(...dashboard.widgets.map((widget) => widget.layout.y + widget.layout.h)), 31);

  for (let i = 0; i < dashboard.widgets.length; i += 1) {
    for (let j = i + 1; j < dashboard.widgets.length; j += 1) {
      assert.equal(layoutsCollide(dashboard.widgets[i]!.layout, dashboard.widgets[j]!.layout), false);
    }
  }
});

test("legacy untouched Home layout upgrades without losing widget config", () => {
  const value = registry();
  const dashboard = createDefaultDashboard(value);
  const legacyLayout = {
    "quick-capture": { x: 0, y: 0, w: 4, h: 3 },
    "today-tasks": { x: 4, y: 0, w: 4, h: 5 },
    progress: { x: 8, y: 0, w: 4, h: 3 },
    projects: { x: 0, y: 5, w: 8, h: 4 },
    upcoming: { x: 8, y: 3, w: 4, h: 6 },
    activity: { x: 0, y: 9, w: 8, h: 4 },
    countdown: { x: 8, y: 9, w: 4, h: 4 },
    habits: { x: 0, y: 13, w: 12, h: 5 },
    "weekly-review": { x: 0, y: 18, w: 12, h: 7 },
    calendar: { x: 0, y: 25, w: 12, h: 8 },
    "vault-stats": { x: 0, y: 33, w: 8, h: 3 },
  } as const;

  dashboard.settings.gap = 14;
  dashboard.settings.rowHeight = 58;
  dashboard.widgets = dashboard.widgets.map((widget) => ({
    ...widget,
    layout: { ...legacyLayout[widget.id as keyof typeof legacyLayout] },
    config: widget.id === "today-tasks" ? { ...widget.config, limit: 17 } : widget.config,
  }));

  assert.equal(usesLegacyHomeLayout(dashboard), true);
  const upgraded = upgradeLegacyHomeLayout(dashboard, value);
  assert.equal(upgraded.settings.gap, 12);
  assert.equal(upgraded.widgets.find((widget) => widget.id === "today-tasks")?.config.limit, 17);
  assert.deepEqual(upgraded.widgets.find((widget) => widget.id === "today-tasks")?.layout, { x: 4, y: 0, w: 5, h: 4 });
});

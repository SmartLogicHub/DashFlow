import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createDefaultDashboard } from "../src/dashboard/defaultDashboard";
import { upgradeLegacyHomeLayout, usesLegacyHomeLayout } from "../src/dashboard/defaultLayoutMigration";
import { layoutsCollide } from "../src/layout/grid";
import { registerBuiltins } from "../src/widgets/builtins";
import { WidgetRegistry } from "../src/widgets/WidgetRegistry";

const design = readFileSync("src/services/ProductDesignService.ts", "utf8");
const experience = readFileSync("src/services/ProductExperienceService.ts", "utf8");
const settingsSource = readFileSync("src/settings/DashFlowSettingsTab.ts", "utf8");

function registry(): WidgetRegistry {
  const value = new WidgetRegistry();
  registerBuiltins(value);
  return value;
}

test("Command Dashboard owns only the center canvas and uses one strong purple banner", () => {
  assert.ok(design.includes("dashflow-command-shell"));
  assert.ok(design.includes("Obsidian owns the app chrome"));
  assert.ok(design.includes("linear-gradient(118deg, #20104e"));
  assert.ok(design.includes("dashflow-command-bar"));
  assert.equal(design.includes("grid-template-columns: 176px minmax(0, 1fr)"), false);
  assert.ok(experience.includes("shell.querySelector(\":scope > .dashflow-product-nav\")?.remove()"));
});

test("Command Dashboard default Home matches the compact reference composition and is collision free", () => {
  const dashboard = createDefaultDashboard(registry());
  assert.equal(dashboard.settings.gap, 8);
  assert.equal(dashboard.settings.rowHeight, 44);
  assert.deepEqual(dashboard.widgets.find((widget) => widget.id === "quick-capture")?.layout, { x: 0, y: 0, w: 3, h: 4 });
  assert.deepEqual(dashboard.widgets.find((widget) => widget.id === "today-tasks")?.layout, { x: 3, y: 0, w: 3, h: 4 });
  assert.deepEqual(dashboard.widgets.find((widget) => widget.id === "progress")?.layout, { x: 6, y: 0, w: 3, h: 4 });
  assert.deepEqual(dashboard.widgets.find((widget) => widget.id === "upcoming")?.layout, { x: 9, y: 0, w: 3, h: 8 });
  assert.deepEqual(dashboard.widgets.find((widget) => widget.id === "projects")?.layout, { x: 0, y: 4, w: 9, h: 4 });
  assert.deepEqual(dashboard.widgets.find((widget) => widget.id === "activity")?.layout, { x: 0, y: 8, w: 9, h: 4 });
  assert.deepEqual(dashboard.widgets.find((widget) => widget.id === "countdown")?.layout, { x: 9, y: 8, w: 3, h: 4 });

  for (let i = 0; i < dashboard.widgets.length; i += 1) {
    for (let j = i + 1; j < dashboard.widgets.length; j += 1) {
      assert.equal(layoutsCollide(dashboard.widgets[i]!.layout, dashboard.widgets[j]!.layout), false);
    }
  }
});

test("untouched v0.3.1 Studio layout migrates to the new compact dashboard without losing widget config", () => {
  const value = registry();
  const dashboard = createDefaultDashboard(value);
  const studio031 = {
    "today-tasks": { x: 0, y: 0, w: 7, h: 5 },
    "quick-capture": { x: 7, y: 0, w: 5, h: 2 },
    progress: { x: 7, y: 2, w: 2, h: 3 },
    countdown: { x: 9, y: 2, w: 3, h: 3 },
    projects: { x: 0, y: 5, w: 7, h: 5 },
    upcoming: { x: 7, y: 5, w: 5, h: 5 },
    habits: { x: 0, y: 10, w: 7, h: 4 },
    activity: { x: 7, y: 10, w: 5, h: 4 },
    "weekly-review": { x: 0, y: 14, w: 12, h: 6 },
    calendar: { x: 0, y: 20, w: 12, h: 7 },
    "vault-stats": { x: 0, y: 27, w: 12, h: 2 },
  } as const;
  dashboard.settings.gap = 14;
  dashboard.settings.rowHeight = 58;
  dashboard.widgets = dashboard.widgets.map((widget) => ({
    ...widget,
    layout: { ...studio031[widget.id as keyof typeof studio031] },
    config: widget.id === "today-tasks" ? { ...widget.config, limit: 17 } : widget.config,
  }));

  assert.equal(usesLegacyHomeLayout(dashboard), true);
  const upgraded = upgradeLegacyHomeLayout(dashboard, value);
  assert.equal(upgraded.widgets.find((widget) => widget.id === "today-tasks")?.config.limit, 17);
  assert.deepEqual(upgraded.widgets.find((widget) => widget.id === "quick-capture")?.layout, { x: 0, y: 0, w: 3, h: 4 });
  assert.deepEqual(upgraded.widgets.find((widget) => widget.id === "projects")?.layout, { x: 0, y: 4, w: 9, h: 4 });
});

test("older untouched Home layouts still migrate to Command Dashboard", () => {
  const value = registry();
  const dashboard = createDefaultDashboard(value);
  const polished024 = {
    "quick-capture": { x: 0, y: 0, w: 4, h: 3 },
    "today-tasks": { x: 4, y: 0, w: 5, h: 4 },
    progress: { x: 9, y: 0, w: 3, h: 3 },
    projects: { x: 0, y: 4, w: 9, h: 4 },
    upcoming: { x: 9, y: 3, w: 3, h: 5 },
    activity: { x: 0, y: 8, w: 8, h: 4 },
    countdown: { x: 8, y: 8, w: 4, h: 4 },
    habits: { x: 0, y: 12, w: 12, h: 4 },
    "weekly-review": { x: 0, y: 16, w: 12, h: 6 },
    calendar: { x: 0, y: 22, w: 12, h: 7 },
    "vault-stats": { x: 0, y: 29, w: 12, h: 2 },
  } as const;
  dashboard.settings.gap = 12;
  dashboard.settings.rowHeight = 56;
  dashboard.widgets = dashboard.widgets.map((widget) => ({ ...widget, layout: { ...polished024[widget.id as keyof typeof polished024] } }));
  assert.equal(usesLegacyHomeLayout(dashboard), true);
  const upgraded = upgradeLegacyHomeLayout(dashboard, value);
  assert.deepEqual(upgraded.widgets.find((widget) => widget.id === "today-tasks")?.layout, { x: 3, y: 0, w: 3, h: 4 });
});

test("settings UI remains grouped for non-technical users", () => {
  assert.ok(settingsSource.includes("dashflow-settings-hero"));
  assert.ok(settingsSource.includes("dashflow-settings-panel"));
  assert.ok(settingsSource.includes("dashflow-settings-guide-grid"));
});

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createDefaultDashboard } from "../src/dashboard/defaultDashboard";
import { upgradeLegacyHomeLayout, usesLegacyHomeLayout } from "../src/dashboard/defaultLayoutMigration";
import { layoutsCollide } from "../src/layout/grid";
import { registerBuiltins } from "../src/widgets/builtins";
import { WidgetRegistry } from "../src/widgets/WidgetRegistry";

const auroraSource = readFileSync("src/services/AuroraDesignService.ts", "utf8");
const interactionSource = readFileSync("src/services/AuroraInteractionService.ts", "utf8");
const settingsSource = readFileSync("src/settings/DashFlowSettingsTab.ts", "utf8");

function registry(): WidgetRegistry {
  const value = new WidgetRegistry();
  registerBuiltins(value);
  return value;
}

test("Aurora UI uses a dedicated atmospheric palette and glass hierarchy", () => {
  for (const token of [
    "--df-aurora-violet",
    "--df-aurora-cyan",
    "--df-aurora-green",
    "--df-a-panel",
    "--df-a-panel-strong",
  ]) assert.ok(auroraSource.includes(token), token);
  assert.ok(auroraSource.includes("backdrop-filter: blur(26px)"));
  assert.match(auroraSource, /dashflow-hero[\s\S]*border-radius:\s*24px/);
  assert.match(auroraSource, /today-tasks[\s\S]*radial-gradient/);
});

test("Aurora UI gives calendar and nested project rows distinct interaction treatment", () => {
  assert.match(auroraSource, /dashflow-project-row[\s\S]*box-shadow:\s*none\s*!important/);
  assert.match(auroraSource, /dashflow-calendar-day[\s\S]*border:\s*1px solid transparent\s*!important/);
  assert.match(auroraSource, /dashflow-calendar-agenda[\s\S]*background:/);
});

test("Aurora runtime decorates hero metadata and widget semantic types", () => {
  assert.ok(interactionSource.includes("dashflow-hero-meta"));
  assert.ok(interactionSource.includes("card.dataset.widgetType = type"));
  assert.ok(interactionSource.includes("今日待办"));
});

test("settings UI is grouped into product panels instead of giant default blocks", () => {
  assert.ok(settingsSource.includes("dashflow-settings-hero"));
  assert.ok(settingsSource.includes("dashflow-settings-panel"));
  assert.ok(settingsSource.includes("dashflow-settings-guide-grid"));
});

test("Aurora default dashboard prioritizes Today and remains collision free", () => {
  const dashboard = createDefaultDashboard(registry());
  assert.equal(dashboard.settings.gap, 14);
  assert.equal(dashboard.settings.rowHeight, 58);
  assert.equal(Math.max(...dashboard.widgets.map((widget) => widget.layout.y + widget.layout.h)), 29);
  assert.deepEqual(dashboard.widgets.find((widget) => widget.id === "today-tasks")?.layout, { x: 0, y: 0, w: 7, h: 5 });
  assert.deepEqual(dashboard.widgets.find((widget) => widget.id === "quick-capture")?.layout, { x: 7, y: 0, w: 5, h: 2 });

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
  assert.equal(upgraded.widgets.find((widget) => widget.id === "today-tasks")?.config.limit, 17);
  assert.deepEqual(upgraded.widgets.find((widget) => widget.id === "today-tasks")?.layout, { x: 0, y: 0, w: 7, h: 5 });
});

test("untouched v0.2.4 Home layout also migrates to Aurora", () => {
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
  dashboard.widgets = dashboard.widgets.map((widget) => ({
    ...widget,
    layout: { ...polished024[widget.id as keyof typeof polished024] },
  }));
  assert.equal(usesLegacyHomeLayout(dashboard), true);
  const upgraded = upgradeLegacyHomeLayout(dashboard, value);
  assert.deepEqual(upgraded.widgets.find((widget) => widget.id === "quick-capture")?.layout, { x: 7, y: 0, w: 5, h: 2 });
});

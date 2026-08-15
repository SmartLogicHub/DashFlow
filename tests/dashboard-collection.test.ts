import assert from "node:assert/strict";
import test from "node:test";
import type { DashboardDefinition } from "../src/models";
import {
  cloneDashboardDefinition,
  nextDashboardId,
  nextDuplicateDashboardName,
  normalizeDashboardName,
} from "../src/dashboard/dashboardCollection";

test("dashboard names are trimmed, collapsed and capped", () => {
  assert.equal(normalizeDashboardName("  Work   Focus  "), "Work Focus");
  assert.equal(normalizeDashboardName("x".repeat(80)).length, 48);
});

test("dashboard ids are readable and avoid collisions", () => {
  assert.equal(nextDashboardId("Work Focus", []), "work-focus");
  assert.equal(nextDashboardId("Work Focus", ["work-focus", "work-focus-2"]), "work-focus-3");
  assert.equal(nextDashboardId("复盘", []), "复盘");
});

test("duplicate dashboard names advance without collisions", () => {
  assert.equal(nextDuplicateDashboardName("Home", ["Home"]), "Home 副本");
  assert.equal(nextDuplicateDashboardName("Home", ["Home", "Home 副本", "Home 副本 2"]), "Home 副本 3");
});

test("dashboard cloning remaps widget and mobile ids without sharing mutable state", () => {
  const source: DashboardDefinition = {
    id: "home",
    name: "Home",
    settings: { columns: 12, gap: 14, rowHeight: 58, showHeader: true },
    widgets: [
      { id: "a", type: "tasks", layout: { x: 0, y: 0, w: 4, h: 3 }, config: { limit: 5 }, hidden: false },
      { id: "b", type: "projects", layout: { x: 4, y: 0, w: 8, h: 3 }, config: { limit: 4 }, hidden: false },
    ],
    mobile: { order: ["b", "a"], collapsedWidgetIds: ["a"], compactMode: true },
    createdAt: 1,
    updatedAt: 1,
  };

  const copy = cloneDashboardDefinition(source, "work", "Work", 99);
  assert.equal(copy.id, "work");
  assert.equal(copy.name, "Work");
  assert.equal(copy.createdAt, 99);
  assert.notEqual(copy.widgets[0].id, source.widgets[0].id);
  assert.deepEqual(copy.mobile?.order, [copy.widgets[1].id, copy.widgets[0].id]);
  assert.deepEqual(copy.mobile?.collapsedWidgetIds, [copy.widgets[0].id]);
  assert.equal(copy.mobile?.compactMode, true);

  copy.widgets[0].layout.x = 7;
  copy.widgets[0].config.limit = 10;
  assert.equal(source.widgets[0].layout.x, 0);
  assert.equal(source.widgets[0].config.limit, 5);
});

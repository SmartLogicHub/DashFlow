import assert from "node:assert/strict";
import test from "node:test";
import type { DashboardDefinition } from "../src/models";
import {
  DASHBOARD_TRANSFER_KIND,
  DASHBOARD_TRANSFER_VERSION,
  DashboardTransferError,
  parseDashboardTransferJson,
  serializeDashboardTransfer,
  unsupportedDashboardWidgetTypes,
} from "../src/dashboard/dashboardTransfer";

function sampleDashboard(): DashboardDefinition {
  return {
    id: "work",
    name: "Work Focus",
    icon: "layout-dashboard",
    settings: { columns: 12, gap: 14, rowHeight: 58, showHeader: true },
    widgets: [
      {
        id: "tasks-a",
        type: "tasks",
        title: "Today",
        layout: { x: 0, y: 0, w: 4, h: 4 },
        config: { limit: 8, includeOverdue: true },
        hidden: false,
      },
      {
        id: "projects-a",
        type: "projects",
        layout: { x: 4, y: 0, w: 8, h: 4 },
        config: { limit: 5 },
        hidden: false,
      },
    ],
    mobile: {
      order: ["projects-a", "tasks-a"],
      collapsedWidgetIds: ["tasks-a"],
      compactMode: true,
    },
    createdAt: 100,
    updatedAt: 200,
  };
}

test("dashboard transfer exports only portable dashboard state", () => {
  const json = serializeDashboardTransfer(sampleDashboard(), "0.2.1");
  const exported = JSON.parse(json) as {
    kind: string;
    formatVersion: number;
    sourcePluginVersion: string;
    dashboard: Record<string, unknown>;
  };
  assert.equal(exported.kind, DASHBOARD_TRANSFER_KIND);
  assert.equal(exported.formatVersion, DASHBOARD_TRANSFER_VERSION);
  assert.equal(exported.sourcePluginVersion, "0.2.1");
  assert.equal(exported.dashboard.id, undefined);
  assert.equal(exported.dashboard.createdAt, undefined);
  assert.equal(exported.dashboard.updatedAt, undefined);
});

test("dashboard transfer round-trips widget config, layout and mobile state", () => {
  const parsed = parseDashboardTransferJson(serializeDashboardTransfer(sampleDashboard(), "0.2.1"));
  assert.equal(parsed.name, "Work Focus");
  assert.equal(parsed.widgets.length, 2);
  assert.deepEqual(parsed.widgets[0]?.layout, { x: 0, y: 0, w: 4, h: 4 });
  assert.deepEqual(parsed.widgets[0]?.config, { limit: 8, includeOverdue: true });
  assert.deepEqual(parsed.mobile?.order, ["projects-a", "tasks-a"]);
  assert.deepEqual(parsed.mobile?.collapsedWidgetIds, ["tasks-a"]);
  assert.equal(parsed.mobile?.compactMode, true);
});

test("dashboard transfer normalizes duplicate mobile ids and appends missing widgets", () => {
  const dashboard = sampleDashboard();
  dashboard.mobile = {
    order: ["projects-a", "projects-a", "missing"],
    collapsedWidgetIds: ["tasks-a", "tasks-a", "missing"],
    compactMode: false,
  };
  const parsed = parseDashboardTransferJson(serializeDashboardTransfer(dashboard, "0.2.1"));
  assert.deepEqual(parsed.mobile?.order, ["projects-a", "tasks-a"]);
  assert.deepEqual(parsed.mobile?.collapsedWidgetIds, ["tasks-a"]);
});

test("dashboard transfer rejects wrong kind and unsupported format versions", () => {
  const base = JSON.parse(serializeDashboardTransfer(sampleDashboard(), "0.2.1")) as Record<string, unknown>;
  assert.throws(
    () => parseDashboardTransferJson(JSON.stringify({ ...base, kind: "other" })),
    DashboardTransferError,
  );
  assert.throws(
    () => parseDashboardTransferJson(JSON.stringify({ ...base, formatVersion: 99 })),
    DashboardTransferError,
  );
});

test("dashboard transfer rejects duplicate ids, out-of-bounds layouts and collisions", () => {
  const duplicate = JSON.parse(serializeDashboardTransfer(sampleDashboard(), "0.2.1")) as {
    dashboard: { widgets: Array<{ id: string; layout: { x: number; y: number; w: number; h: number } }> };
  };
  duplicate.dashboard.widgets[1]!.id = duplicate.dashboard.widgets[0]!.id;
  assert.throws(() => parseDashboardTransferJson(JSON.stringify(duplicate)), DashboardTransferError);

  const overflow = JSON.parse(serializeDashboardTransfer(sampleDashboard(), "0.2.1")) as {
    dashboard: { widgets: Array<{ layout: { x: number; y: number; w: number; h: number } }> };
  };
  overflow.dashboard.widgets[1]!.layout.x = 10;
  overflow.dashboard.widgets[1]!.layout.w = 8;
  assert.throws(() => parseDashboardTransferJson(JSON.stringify(overflow)), DashboardTransferError);

  const collision = JSON.parse(serializeDashboardTransfer(sampleDashboard(), "0.2.1")) as {
    dashboard: { widgets: Array<{ layout: { x: number; y: number; w: number; h: number } }> };
  };
  collision.dashboard.widgets[1]!.layout = { x: 2, y: 1, w: 6, h: 4 };
  assert.throws(() => parseDashboardTransferJson(JSON.stringify(collision)), DashboardTransferError);
});

test("dashboard transfer reports widget types unavailable in the current plugin", () => {
  const dashboard = sampleDashboard();
  dashboard.widgets.push({
    id: "future-widget",
    type: "future-type",
    layout: { x: 0, y: 5, w: 4, h: 3 },
    config: {},
  });
  assert.deepEqual(
    unsupportedDashboardWidgetTypes(dashboard, ["tasks", "projects"]),
    ["future-type"],
  );
});

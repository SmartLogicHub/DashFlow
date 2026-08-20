import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { DEFAULT_SETTINGS } from "../src/constants";
import {
  MAX_RECOVERY_BACKUP_BYTES,
  migratePluginData,
} from "../src/core/pluginDataMigration";
import type { DashboardDefinition } from "../src/models";

const mainSource = readFileSync("src/main.ts", "utf8");
const settingsSource = readFileSync("src/settings/DashFlowSettingsTab.ts", "utf8");

function dashboard(name = "Home"): DashboardDefinition {
  return {
    id: "home",
    name,
    icon: "layout-dashboard",
    settings: { columns: 12, gap: 8, rowHeight: 38, showHeader: true },
    widgets: [
      { id: "tasks", type: "tasks", layout: { x: 0, y: 0, w: 6, h: 4 }, config: {}, hidden: false },
    ],
    mobile: { order: ["tasks"], collapsedWidgetIds: [], compactMode: false },
    createdAt: 1,
    updatedAt: 1,
  };
}

function options() {
  return {
    defaults: { ...DEFAULT_SETTINGS },
    fallbackDashboard: dashboard("默认工作台"),
    today: "2026-08-20",
    now: 123,
  };
}

function schema7(extra: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    schemaVersion: 7,
    settings: { ...DEFAULT_SETTINGS },
    dashboards: [dashboard()],
    activeDashboardId: "home",
    customTemplates: [],
    activity: { startedAt: "2026-01-01", days: {} },
    aiCache: {},
    focus: { mode: "focus", status: "idle", remainingMs: 1_500_000, completedFocusSessions: 0 },
    ...extra,
  };
}

function schema8(extra: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    ...schema7(),
    schemaVersion: 8,
    onboardingCompleted: true,
    ...extra,
  };
}

test("null plugin data is a true first run and is not persisted before onboarding", () => {
  const result = migratePluginData(null, options());
  assert.equal(result.firstRun, true);
  assert.equal(result.shouldPersist, false);
  assert.equal(result.recoveryRequired, false);
  assert.equal(result.data.schemaVersion, 8);
  assert.equal(result.data.onboardingCompleted, false);
  assert.equal(result.data.dashboards[0]?.name, "默认工作台");
});

test("valid schema-7 data upgrades with a sanitized pre-upgrade backup", () => {
  const result = migratePluginData(schema7(), options());
  assert.equal(result.firstRun, false);
  assert.equal(result.shouldPersist, true);
  assert.equal(result.recoveryRequired, false);
  assert.equal(result.data.schemaVersion, 8);
  assert.equal(result.data.onboardingCompleted, true);
  assert.equal(result.data.recoveryBackup?.createdAt, 123);
});

test("recovery backup never contains a plaintext AI credential", () => {
  const raw = schema7({ settings: { ...DEFAULT_SETTINGS, aiSecretId: "sk-plaintext-secret-123456" } });
  const result = migratePluginData(raw, options());
  const serialized = JSON.stringify(result.data.recoveryBackup);
  assert.equal(serialized.includes("sk-plaintext-secret-123456"), false);
  assert.equal((result.data.recoveryBackup?.data.settings as Record<string, unknown>).aiSecretId, "");
});

test("malformed Dashboard data falls back in memory without destructive persistence", () => {
  const result = migratePluginData(schema7({ dashboards: [{ id: "broken", widgets: "not-an-array" }] }), options());
  assert.equal(result.firstRun, false);
  assert.equal(result.recoveryRequired, true);
  assert.equal(result.shouldPersist, false);
  assert.equal(result.data.dashboards[0]?.name, "默认工作台");
  assert.ok(result.data.recoveryBackup);
});

test("schema-8 data loads idempotently", () => {
  const upgraded = migratePluginData(schema7(), options()).data;
  const result = migratePluginData(upgraded, options());
  assert.equal(result.firstRun, false);
  assert.equal(result.recoveryRequired, false);
  assert.equal(result.shouldPersist, false);
  assert.deepEqual(result.data, upgraded);
});

test("schema-8 data with a malformed setting enters non-destructive recovery", () => {
  const result = migratePluginData(schema8({
    settings: { ...DEFAULT_SETTINGS, homeHeroImagePath: 42 },
  }), options());
  assert.equal(result.recoveryRequired, true);
  assert.equal(result.shouldPersist, false);
  assert.equal(result.data.settings.homeHeroImagePath, DEFAULT_SETTINGS.homeHeroImagePath);
  assert.equal((result.backup?.data.settings as Record<string, unknown>).homeHeroImagePath, 42);
});

test("legacy default Dashboard name is normalized without changing custom names", () => {
  const legacy = migratePluginData(schema7(), options());
  assert.equal(legacy.data.dashboards[0]?.name, "默认工作台");

  const custom = migratePluginData(schema7({ dashboards: [dashboard("My Home")] }), options());
  assert.equal(custom.data.dashboards[0]?.name, "My Home");
});

test("recovery backup is bounded even when caches are unexpectedly large", () => {
  const raw = schema7({ aiCache: { huge: "x".repeat(MAX_RECOVERY_BACKUP_BYTES * 2) } });
  const result = migratePluginData(raw, options());
  assert.ok(Buffer.byteLength(JSON.stringify(result.data.recoveryBackup), "utf8") <= MAX_RECOVERY_BACKUP_BYTES);
});

test("advanced settings expose explicit recovery export, restore, and reset actions", () => {
  assert.ok(mainSource.includes("restoreRecoveryBackup"));
  assert.ok(mainSource.includes("resetPluginDataForRecovery"));
  assert.ok(settingsSource.includes("exportRecoveryBackup"));
  assert.ok(settingsSource.includes("TimedConfirmation"));
});

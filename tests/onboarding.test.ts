import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { DEFAULT_SETTINGS } from "../src/constants";
import { createDashboardFromTemplate } from "../src/dashboard/dashboardTemplates";
import { migratePluginData } from "../src/core/pluginDataMigration";
import {
  ONBOARDING_TEMPLATES,
  completeOnboarding,
  normalizeOnboardingDashboard,
  shouldShowOnboarding,
} from "../src/product/onboarding";
import { WidgetRegistry } from "../src/widgets/WidgetRegistry";
import { registerBuiltins } from "../src/widgets/builtins";

const mainSource = readFileSync("src/main.ts", "utf8");
const settingsSource = readFileSync("src/settings/DashFlowSettingsTab.ts", "utf8");
const indexSource = readFileSync("src/services/VaultIndexService.ts", "utf8");

function registry(): WidgetRegistry {
  const value = new WidgetRegistry();
  registerBuiltins(value);
  return value;
}

test("onboarding appears only for a true first run", () => {
  assert.equal(shouldShowOnboarding(true, false, false), true);
  assert.equal(shouldShowOnboarding(false, false, false), false);
  assert.equal(shouldShowOnboarding(true, true, false), false);
  assert.equal(shouldShowOnboarding(true, false, true), false);
});

test("onboarding offers the three approved starting layouts", () => {
  assert.deepEqual(ONBOARDING_TEMPLATES.map((item) => item.id), ["minimal", "daily-focus", "project-management"]);
});

test("onboarding normalizes the selected Dashboard to the canonical identity", () => {
  const dashboard = createDashboardFromTemplate(registry(), "minimal", 123);
  const normalized = normalizeOnboardingDashboard(dashboard);
  assert.equal(normalized.id, "home");
  assert.equal(normalized.name, "默认工作台");
  assert.equal(normalized.createdAt, 123);
});

test("completion persists the selected template, paths, and completion flag", () => {
  const fallback = createDashboardFromTemplate(registry(), "minimal", 123);
  const data = migratePluginData(null, {
    defaults: { ...DEFAULT_SETTINGS },
    fallbackDashboard: fallback,
    today: "2026-08-20",
  }).data;
  const completed = completeOnboarding(data, fallback, {
    templateId: "project-management",
    inboxPath: " Capture/Inbox.md ",
    projectFolder: "Projects",
    habitFolder: "Habits",
  });

  assert.equal(completed.onboardingCompleted, true);
  assert.equal(completed.activeDashboardId, "home");
  assert.equal(completed.dashboards[0]?.name, "默认工作台");
  assert.equal(completed.settings.inboxPath, "Capture/Inbox.md");
  assert.equal(completed.settings.projectFolder, "Projects");
  assert.equal(completed.settings.habitFolder, "Habits");
});

test("runtime opens onboarding only after the initial Vault snapshot and keeps a manual Settings entry", () => {
  assert.ok(indexSource.includes("whenReady"));
  assert.ok(mainSource.includes("new OnboardingModal"));
  assert.ok(mainSource.includes("this.vaultIndex.whenReady()"));
  assert.ok(settingsSource.includes("重新打开首次引导"));
});

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const switcher = readFileSync("src/services/DashboardSwitcherInteractionService.ts", "utf8");
const settings = readFileSync("src/settings/DashFlowSettingsTab.ts", "utf8");
const main = readFileSync("src/main.ts", "utf8");

test("Dashboard management exposes its existing manager modal", () => {
  assert.ok(switcher.includes("openManager(): void"));
  assert.ok(switcher.includes("this.openManageModal()"));
  assert.equal((switcher.match(/modalFrame\("管理工作台"\)/g) ?? []).length, 1);
});

test("settings expose a typed section destination", () => {
  assert.ok(settings.includes("export type SettingsSection"));
  assert.ok(settings.includes("openSection(section: SettingsSection): void"));
  assert.ok(settings.includes("this.activeSection = section"));
  assert.ok(settings.includes("this.display()"));
});

test("the plugin stores the settings tab and opens a requested section", () => {
  assert.ok(main.includes("settingsTab!: DashFlowSettingsTab"));
  assert.ok(main.includes("this.settingsTab = new DashFlowSettingsTab"));
  assert.ok(main.includes("openSettings(section: SettingsSection"));
  assert.ok(main.includes("openTabById(this.manifest.id)"));
  assert.ok(main.includes("this.settingsTab.openSection(section)"));
});

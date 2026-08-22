import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const manager = readFileSync("src/dashboard/DashboardManager.ts", "utf8");
const hub = readFileSync("src/ui/FeatureHubModal.ts", "utf8");
const experience = readFileSync("src/services/ProductExperienceService.ts", "utf8");
const designSystem = readFileSync("src/services/DesignSystemService.ts", "utf8");
const styles = readFileSync("src/styles/FeatureHubStyles.ts", "utf8");
const ai = readFileSync("src/services/AIClient.ts", "utf8");
const weRead = readFileSync("src/services/WeReadService.ts", "utf8");

test("widget insertion reports success and failure to its caller", () => {
  assert.ok(manager.includes("Promise<WidgetInstance | null>"));
  assert.ok(manager.includes("if (!dashboard || !definition) return null"));
  assert.ok(manager.includes("return widget"));
});

test("feature hub renders the canonical catalog and status dimensions", () => {
  assert.ok(hub.includes("FEATURE_CATALOG"));
  assert.ok(hub.includes("FEATURE_GROUP_LABELS"));
  assert.ok(hub.includes("featureStatus"));
  assert.ok(hub.includes("addedWidgetTypes"));
  assert.ok(hub.includes("availability"));
  assert.ok(hub.includes("placement"));
});

test("feature hub handles both widget-add success and failure", () => {
  assert.ok(hub.includes("await this.plugin.dashboardManager.addWidget"));
  assert.ok(hub.includes("if (!added)"));
  assert.ok(hub.includes("new Notice"));
  assert.ok(hub.includes("this.plugin.refreshDashboardViews()"));
});

test("feature hub exposes every existing action destination", () => {
  for (const destination of [
    "QuickAddModal",
    "TaskEditorModal",
    "ProjectEditorModal",
    "HabitEditorModal",
    "GlobalSearchModal",
    "AIPlanModal",
    "MorningBriefingSettingsModal",
    "WorkflowSettingsModal",
    "dashboardSwitcher.openManager()",
    "openSettings(\"integration\")",
  ]) assert.ok(hub.includes(destination), destination);
});

test("normal command mode keeps a visible feature entry", () => {
  assert.ok(experience.includes("PRODUCT_SECTIONS"));
  assert.ok(!experience.includes("const COMMAND_SECTIONS"));
  assert.ok(experience.includes("new FeatureHubModal(this.plugin).open()"));
  assert.ok(experience.includes("dashflow-feature-action"));
  assert.ok(experience.includes('commandButton("blocks", "功能")'));
});

test("feature hub styles are consolidated, responsive, and keyboard visible", () => {
  assert.ok(designSystem.includes("FEATURE_HUB_STYLES"));
  assert.ok(styles.includes(".dashflow-feature-hub"));
  assert.ok(styles.includes(":focus-visible"));
  assert.ok(styles.includes("@media (max-width: 760px)"));
  assert.ok(styles.includes(".dashflow-feature-action"));
  assert.ok(styles.includes("display: flex!important"));
});

test("feature discovery keeps its text label and only one close control", () => {
  assert.ok(styles.includes(".dashflow-feature-action .dashflow-command-label"));
  assert.ok(styles.includes("display: inline!important"));
  assert.ok(styles.includes(".modal-close-button"));
});

test("configured state remains meaningful while integrations are disabled", () => {
  assert.ok(ai.includes("hasConfiguration(): boolean"));
  assert.ok(ai.includes("settings.aiEnabled && this.hasConfiguration()"));
  assert.ok(weRead.includes("hasConfiguration(): boolean"));
  assert.ok(weRead.includes("settings.weReadEnabled && this.hasConfiguration()"));
  assert.ok(hub.includes("this.plugin.aiClient.hasConfiguration()"));
  assert.ok(hub.includes("this.plugin.weRead.hasConfiguration()"));
});

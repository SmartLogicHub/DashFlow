import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import {
  FEATURE_CATALOG,
  filterFeatures,
  featureStatus,
  type FeatureStatusContext,
} from "../src/product/featureCatalog";
import {
  COMMAND_CATALOG,
  FEATURE_COMMAND_IDS,
  MAINTENANCE_COMMAND_IDS,
  NAVIGATION_COMMAND_IDS,
} from "../src/product/commandCatalog";
import { PRODUCT_SECTIONS } from "../src/product/navigation";
import { WidgetRegistry } from "../src/widgets/WidgetRegistry";
import { registerBuiltins } from "../src/widgets/builtins";
import { registerDataWidgets } from "../src/widgets/data";
import { registerEmbedWidgets } from "../src/widgets/embed";
import { registerFocusWidgets } from "../src/widgets/focus";
import { registerGanttWidgets } from "../src/widgets/gantt";
import { registerIntelligenceWidgets } from "../src/widgets/intelligence";
import { registerKanbanWidgets } from "../src/widgets/kanban";
import { registerOpportunityWidgets } from "../src/widgets/opportunity";

function registeredWidgetTypes(): string[] {
  const registry = new WidgetRegistry();
  registerBuiltins(registry);
  registerDataWidgets(registry);
  registerFocusWidgets(registry);
  registerEmbedWidgets(registry);
  registerIntelligenceWidgets(registry);
  registerGanttWidgets(registry);
  registerKanbanWidgets(registry);
  registerOpportunityWidgets(registry);
  return registry.list().map((definition) => definition.type);
}

const emptyContext: FeatureStatusContext = {
  addedWidgetTypes: new Set(),
  aiEnabled: false,
  aiConfigured: false,
  morningBriefingEnabled: false,
  weReadEnabled: false,
  weReadConfigured: false,
};

test("the feature catalog includes every registered Widget exactly once", () => {
  const registered = registeredWidgetTypes().sort();
  const catalogued = FEATURE_CATALOG
    .filter((feature) => feature.kind === "widget")
    .map((feature) => feature.widgetType)
    .filter((type): type is string => Boolean(type))
    .sort();

  assert.equal(registered.length, 18);
  assert.deepEqual(catalogued, registered);
  assert.equal(new Set(catalogued).size, 18);
});

test("feature state keeps placement and availability independent", () => {
  const aiPlan = FEATURE_CATALOG.find((feature) => feature.id === "ai-plan");
  const aiNews = FEATURE_CATALOG.find((feature) => feature.widgetType === "ai-news");
  const focus = FEATURE_CATALOG.find((feature) => feature.widgetType === "focus");
  assert.ok(aiPlan && aiNews && focus);

  assert.deepEqual(featureStatus(aiPlan, {
    ...emptyContext,
    aiConfigured: true,
  }), {
    placement: "not-applicable",
    availability: "disabled",
    configured: true,
  });
  assert.equal(featureStatus(aiNews, {
    ...emptyContext,
    aiEnabled: true,
  }).availability, "needs-configuration");
  assert.equal(featureStatus(focus, emptyContext).placement, "not-added");
  assert.equal(featureStatus(focus, {
    ...emptyContext,
    addedWidgetTypes: new Set(["focus"]),
  }).placement, "added");
});

test("feature discovery searches normalized names and descriptions", () => {
  const statuses = new Map(FEATURE_CATALOG.map((feature) => [feature.id, featureStatus(feature, emptyContext)]));
  const projectMatches = filterFeatures(FEATURE_CATALOG, statuses, { query: "  项目 ", mode: "all" });
  assert.ok(projectMatches.some((feature) => feature.id === "widget-projects"));
  assert.ok(projectMatches.some((feature) => feature.id === "new-project"));
  assert.ok(projectMatches.every((feature) => `${feature.name} ${feature.description}`.includes("项目")));

  assert.deepEqual(
    filterFeatures(FEATURE_CATALOG, statuses, { query: "专注", mode: "all" }).map((feature) => feature.id),
    ["widget-focus"],
  );
});

test("feature discovery filters not-added and needs-attention states", () => {
  const statuses = new Map(FEATURE_CATALOG.map((feature) => [feature.id, featureStatus(feature, emptyContext)]));
  const notAdded = filterFeatures(FEATURE_CATALOG, statuses, { query: "", mode: "not-added" });
  const needsAttention = filterFeatures(FEATURE_CATALOG, statuses, { query: "", mode: "needs-attention" });

  assert.ok(notAdded.length > 0);
  assert.ok(notAdded.every((feature) => statuses.get(feature.id)?.placement === "not-added"));
  assert.ok(needsAttention.length > 0);
  assert.ok(needsAttention.every((feature) => statuses.get(feature.id)?.availability !== "ready"));
});

test("every command is classified and feature commands map to the feature catalog", () => {
  const allIds = COMMAND_CATALOG.map((command) => command.id);
  const classified = [
    ...FEATURE_COMMAND_IDS,
    ...NAVIGATION_COMMAND_IDS,
    ...MAINTENANCE_COMMAND_IDS,
  ];
  assert.deepEqual([...new Set(classified)].sort(), [...allIds].sort());
  assert.equal(new Set(allIds).size, allIds.length);

  const featureIds = new Set(FEATURE_CATALOG.map((feature) => feature.id));
  for (const command of COMMAND_CATALOG.filter((item) => item.category === "feature")) {
    assert.ok(command.featureId, `${command.id} must declare featureId`);
    assert.ok(featureIds.has(command.featureId), `${command.id} maps to unknown feature ${command.featureId}`);
  }

  const morningCommands = COMMAND_CATALOG
    .filter((command) => command.featureId === "morning-briefing")
    .map((command) => command.id)
    .sort();
  assert.deepEqual(morningCommands, ["configure-ai-morning-briefing", "refresh-ai-morning-briefing"]);
  assert.equal(COMMAND_CATALOG.find((command) => command.id === "new-habit")?.featureId, "new-habit");
});

test("navigation commands derive from the canonical product sections", () => {
  const expected = ["open-dashboard", ...PRODUCT_SECTIONS.map((section) => `open-${section.id}`)].sort();
  assert.deepEqual([...NAVIGATION_COMMAND_IDS].sort(), expected);
});

test("main registers commands from the centralized command catalog", () => {
  const source = readFileSync("src/main.ts", "utf8");
  assert.ok(source.includes("COMMAND_CATALOG"));
  assert.ok(source.includes("for (const command of COMMAND_CATALOG)"));
  assert.ok(source.includes("HabitEditorModal"));
});

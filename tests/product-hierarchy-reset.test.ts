import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const hierarchy = readFileSync("src/styles/ProductHierarchyResetStyles.ts", "utf8");
const deepSeekPolish = readFileSync("src/styles/DeepSeekPolishStyles.ts", "utf8");
const designSystem = readFileSync("src/services/DesignSystemService.ts", "utf8");
const quickAdd = readFileSync("src/ui/QuickAddModal.ts", "utf8");
const settings = readFileSync("src/settings/DashFlowSettingsTab.ts", "utf8");

test("primary working sections keep full photographic heroes instead of compressed strips", () => {
  assert.ok(hierarchy.includes("height: 194px !important"));
  assert.ok(hierarchy.includes("min-height: 194px !important"));
  assert.ok(hierarchy.includes("height: 172px !important"));
  assert.equal(hierarchy.includes("height: 88px !important"), false);
  assert.equal(hierarchy.includes("height: 72px !important"), false);
  assert.ok(hierarchy.includes("background-size: cover !important"));
});

test("built-in hero scenes no longer request quality-reduced transformed URLs", () => {
  assert.ok(hierarchy.includes("bundled with the plugin"));
  assert.equal(hierarchy.includes("images.unsplash.com"), false);
  assert.equal(hierarchy.includes("q=82"), false);
  assert.equal(hierarchy.includes("w=2400"), false);
});

test("normal product navigation exposes one hierarchy instead of stacking context and dashboard controls", () => {
  assert.ok(hierarchy.includes(".dashflow-context-switcher"));
  assert.ok(hierarchy.includes("display: none !important"));
  assert.ok(hierarchy.includes(".dashflow-command-shell:not(.is-layout-editing) .dashflow-command-workspace"));
  assert.ok(hierarchy.includes(".dashflow-command-actions .is-secondary-action"));
});

test("Quick Add remains the single creation surface for detailed tasks projects and habits", () => {
  assert.ok(quickAdd.includes('"详细任务"'));
  assert.ok(quickAdd.includes('"新建项目"'));
  assert.ok(quickAdd.includes('"习惯 / 日更"'));
});

test("project page removes the old fixed-height tile geometry", () => {
  assert.ok(hierarchy.includes("height: auto !important"));
  assert.ok(hierarchy.includes("grid-template-areas:"));
  assert.ok(hierarchy.includes('"main stat"'));
  assert.ok(hierarchy.includes('"steps steps"'));
});

test("hierarchy reset remains the owner of product geometry before polish layers", () => {
  assert.ok(designSystem.includes('import { PRODUCT_HIERARCHY_RESET_STYLES } from "../styles/ProductHierarchyResetStyles"'));
  assert.ok(designSystem.includes('import { DEEPSEEK_POLISH_STYLES } from "../styles/DeepSeekPolishStyles"'));
  const motionIndex = designSystem.indexOf("INTERACTION_MOTION_STYLES,");
  const resetIndex = designSystem.indexOf("PRODUCT_HIERARCHY_RESET_STYLES,");
  const polishIndex = designSystem.indexOf("DEEPSEEK_POLISH_STYLES,");
  assert.ok(resetIndex > motionIndex);
  assert.ok(polishIndex > resetIndex);
});

test("DeepSeek polish refines theme surfaces without becoming a second runtime or motion owner", () => {
  assert.ok(deepSeekPolish.includes('.theme-dark .dashflow-view-container[data-dashflow-theme="alpine"]'));
  assert.ok(deepSeekPolish.includes("font-variant-numeric: tabular-nums"));
  assert.ok(deepSeekPolish.includes("color-mix(in srgb, var(--text-normal) 9%, transparent)"));
  assert.equal(deepSeekPolish.includes("MutationObserver"), false);
  assert.equal(deepSeekPolish.includes("addEventListener("), false);
  assert.equal(deepSeekPolish.includes("translateY(-4px)"), false);
  assert.equal(deepSeekPolish.includes("height: 88px"), false);
  assert.equal(deepSeekPolish.includes("height: 72px"), false);
});

test("settings use four product sections instead of one long configuration wall", () => {
  for (const section of ["外观", "工作流", "AI 与集成", "高级"]) assert.ok(settings.includes(`label: "${section}"`));
  assert.ok(settings.includes("dashflow-settings-tabs"));
  assert.ok(settings.includes("dashflow-settings-tab-content"));
});

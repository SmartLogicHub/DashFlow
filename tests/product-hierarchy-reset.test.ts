import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const hierarchy = readFileSync("src/styles/ProductHierarchyResetStyles.ts", "utf8");
const designSystem = readFileSync("src/services/DesignSystemService.ts", "utf8");
const quickAdd = readFileSync("src/ui/QuickAddModal.ts", "utf8");

test("primary working sections keep full photographic heroes instead of compressed strips", () => {
  assert.ok(hierarchy.includes("height: 194px !important"));
  assert.ok(hierarchy.includes("min-height: 194px !important"));
  assert.ok(hierarchy.includes("height: 172px !important"));
  assert.equal(hierarchy.includes("height: 88px !important"), false);
  assert.equal(hierarchy.includes("height: 72px !important"), false);
  assert.ok(hierarchy.includes("background-size: cover !important"));
});

test("built-in hero scenes no longer request quality-reduced transformed URLs", () => {
  assert.ok(hierarchy.includes("photo-1506744038136-46273834b3fb\")"));
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

test("hierarchy reset is the final consolidated design-system layer", () => {
  assert.ok(designSystem.includes('import { PRODUCT_HIERARCHY_RESET_STYLES } from "../styles/ProductHierarchyResetStyles"'));
  const motionIndex = designSystem.indexOf("INTERACTION_MOTION_STYLES,");
  const resetIndex = designSystem.indexOf("PRODUCT_HIERARCHY_RESET_STYLES,");
  assert.ok(resetIndex > motionIndex);
});

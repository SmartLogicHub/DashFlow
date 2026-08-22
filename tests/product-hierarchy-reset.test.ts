import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const presentation = readFileSync("src/styles/ProductPresentationStyles.ts", "utf8");
const designSystem = readFileSync("src/services/DesignSystemService.ts", "utf8");
const productDesign = readFileSync("src/services/ProductDesignService.ts", "utf8");
const quickAdd = readFileSync("src/ui/QuickAddModal.ts", "utf8");
const settings = readFileSync("src/settings/DashFlowSettingsTab.ts", "utf8");

test("primary working sections keep compact photographic heroes", () => {
  assert.ok(presentation.includes("height: 128px"));
  assert.ok(presentation.includes("min-height: 128px"));
  assert.ok(presentation.includes("height: 112px"));
  assert.equal(/\.dashflow-command-shell:not\(\.is-personal-home\) > \.dashflow-hero\s*\{[^}]*(?:height|min-height):\s*(?:72|88)px/s.test(presentation), false);
  assert.ok(presentation.includes("background-size: cover"));
  assert.ok(presentation.includes("var(--df-hero-image"));
});

test("built-in hero scenes no longer request remote transformed URLs", () => {
  assert.equal(presentation.includes("images.unsplash.com"), false);
  assert.equal(presentation.includes("q=82"), false);
  assert.equal(presentation.includes("w=2400"), false);
});

test("normal product navigation exposes one hierarchy", () => {
  assert.ok(presentation.includes(".dashflow-context-switcher"));
  assert.ok(presentation.includes("display: none !important"));
  assert.ok(presentation.includes(".dashflow-command-shell:not(.is-layout-editing) .dashflow-command-workspace"));
  assert.ok(presentation.includes(".dashflow-command-actions .is-secondary-action"));
});

test("Quick Add remains the single creation surface for detailed entities", () => {
  assert.ok(quickAdd.includes('"详细任务"'));
  assert.ok(quickAdd.includes('"新建项目"'));
  assert.ok(quickAdd.includes('"习惯 / 日更"'));
});

test("project page removes fixed-height tile geometry", () => {
  assert.ok(presentation.includes("height: auto !important"));
  assert.ok(presentation.includes("grid-template-areas:"));
  assert.ok(presentation.includes('"main stat"'));
  assert.ok(presentation.includes('"steps steps"'));
});

test("one canonical presentation module owns global product geometry", () => {
  assert.equal(productDesign.includes("PRODUCT_PRESENTATION_STYLES"), false);
  assert.ok(designSystem.includes("PRODUCT_PRESENTATION_STYLES"));
  for (const retired of ["PRODUCT_HIERARCHY_RESET_STYLES", "DEEPSEEK_POLISH_STYLES", "UI_REFINEMENT_POLISH_STYLES", "VISUAL_CONTINUITY_STYLES"]) {
    assert.equal(designSystem.includes(retired), false, retired);
  }
  assert.equal(presentation.includes('.theme-dark .dashflow-view-container[data-dashflow-theme="alpine"]'), false);
  assert.ok(presentation.includes("font-variant-numeric: tabular-nums"));
});

test("settings use four product sections instead of one configuration wall", () => {
  for (const section of ["外观", "工作流", "AI 与集成", "高级"]) assert.ok(settings.includes(`label: "${section}"`));
  assert.ok(settings.includes("dashflow-settings-tabs"));
  assert.ok(settings.includes("dashflow-settings-tab-content"));
});

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const continuity = readFileSync("src/styles/VisualContinuityStyles.ts", "utf8");
const hierarchy = readFileSync("src/styles/ProductHierarchyResetStyles.ts", "utf8");
const design = readFileSync("src/services/DesignSystemService.ts", "utf8");
const main = readFileSync("src/main.ts", "utf8");

test("Visual continuity no longer controls Hero labels", () => {
  assert.equal(continuity.includes("dashflow-command-shell:not(.is-personal-home) > .dashflow-hero"), false);
  assert.equal(continuity.includes('content: "工作台 · WORK"'), false);
  assert.ok(design.includes("VISUAL_CONTINUITY_STYLES"));
});

test("product hierarchy owns the compact shared photographic frame", () => {
  assert.ok(hierarchy.includes("height: 128px !important"));
  assert.ok(hierarchy.includes("min-height: 128px !important"));
  assert.ok(hierarchy.includes("background-position: center 50% !important"));
  assert.ok(hierarchy.includes("var(--df-hero-image"));
  assert.equal(hierarchy.includes("::after"), false);
});

test("legacy VisualContinuityService runtime is not part of the plugin lifecycle", () => {
  assert.equal(main.includes('import { VisualContinuityService }'), false);
  assert.equal(main.includes("new VisualContinuityService()"), false);
  assert.equal(main.includes("visualContinuity.start()"), false);
  assert.equal(main.includes("visualContinuity?.stop()"), false);
  assert.ok(main.includes("this.designSystem.start()"));
});

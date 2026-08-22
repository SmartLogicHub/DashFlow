import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const presentation = readFileSync("src/styles/ProductPresentationStyles.ts", "utf8");
const design = readFileSync("src/services/DesignSystemService.ts", "utf8");
const main = readFileSync("src/main.ts", "utf8");

test("canonical presentation styles geometry without inventing Hero labels", () => {
  assert.ok(presentation.includes("dashflow-command-shell:not(.is-personal-home) > .dashflow-hero"));
  assert.equal(presentation.includes('content: "工作台 · WORK"'), false);
  assert.equal(design.includes("VISUAL_CONTINUITY_STYLES"), false);
});

test("product presentation owns the compact shared photographic frame", () => {
  assert.ok(presentation.includes("height: 128px"));
  assert.ok(presentation.includes("min-height: 128px"));
  assert.ok(presentation.includes("background-position: center 50%"));
  assert.ok(presentation.includes("var(--df-hero-image"));
  assert.equal(presentation.includes(".dashflow-hero::after"), false);
});

test("legacy VisualContinuityService runtime is not part of the plugin lifecycle", () => {
  assert.equal(main.includes('import { VisualContinuityService }'), false);
  assert.equal(main.includes("new VisualContinuityService()"), false);
  assert.equal(main.includes("visualContinuity.start()"), false);
  assert.equal(main.includes("visualContinuity?.stop()"), false);
  assert.ok(main.includes("this.designSystem.start()"));
});

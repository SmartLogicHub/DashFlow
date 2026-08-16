import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const continuity = readFileSync("src/styles/VisualContinuityStyles.ts", "utf8");
const design = readFileSync("src/services/DesignSystemService.ts", "utf8");
const main = readFileSync("src/main.ts", "utf8");

test("Hero action labels remain in the consolidated visual cascade", () => {
  assert.ok(continuity.includes('button:nth-child(1)::after { content: "开始今天 →"; }'));
  assert.ok(continuity.includes('button:nth-child(2)::after { content: "收集灵感"; }'));
  assert.ok(design.includes("VISUAL_CONTINUITY_STYLES"));
});

test("continuity styles provide the shared photographic frame before v0.4.3 compacts it", () => {
  assert.ok(continuity.includes("dashflow-command-shell:not(.is-personal-home) > .dashflow-hero"));
  assert.ok(continuity.includes("height: 194px!important"));
  assert.ok(continuity.includes("min-height: 194px!important"));
  assert.ok(continuity.includes("background-position: center 50%!important"));
  assert.ok(continuity.includes("var(--df-ambient-image, var(--df-home-scene))"));
  for (const section of ["work", "projects", "inbox", "calendar", "habits", "review"]) {
    assert.ok(continuity.includes(`data-section=\"${section}\"`));
  }
});

test("legacy VisualContinuityService runtime is not part of the plugin lifecycle", () => {
  assert.equal(main.includes('import { VisualContinuityService }'), false);
  assert.equal(main.includes("new VisualContinuityService()"), false);
  assert.equal(main.includes("visualContinuity.start()"), false);
  assert.equal(main.includes("visualContinuity?.stop()"), false);
  assert.ok(main.includes("this.designSystem.start()"));
});

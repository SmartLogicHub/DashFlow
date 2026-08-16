import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const continuity = readFileSync("src/services/VisualContinuityService.ts", "utf8");
const main = readFileSync("src/main.ts", "utf8");

test("Hero action labels stay visually stable across repeated decoration", () => {
  assert.ok(continuity.includes('button:nth-child(1)::after { content: "开始今天 →"; }'));
  assert.ok(continuity.includes('button:nth-child(2)::after { content: "收集灵感"; }'));
  assert.ok(continuity.includes('start.dataset.dashflowPolished = "1"'));
  assert.ok(continuity.includes('capture.dataset.dashflowPolished = "1"'));
  assert.ok(continuity.includes("stabilizeHeroActions"));
});

test("Every non-home section inherits the same desktop Hero frame", () => {
  assert.ok(continuity.includes("dashflow-command-shell:not(.is-personal-home) > .dashflow-hero"));
  assert.ok(continuity.includes("height: 194px!important"));
  assert.ok(continuity.includes("min-height: 194px!important"));
  assert.ok(continuity.includes("background-position: center 50%!important"));
  assert.ok(continuity.includes("var(--df-ambient-image, var(--df-home-scene))"));
  assert.equal(continuity.includes("height: 84px!important"), false);
  for (const section of ["work", "projects", "inbox", "calendar", "habits", "review"]) {
    assert.ok(continuity.includes(`data-section=\"${section}\"`));
  }
});

test("Visual continuity layer is started and stopped with the plugin lifecycle", () => {
  assert.ok(main.includes('import { VisualContinuityService } from "./services/VisualContinuityService"'));
  assert.ok(main.includes("this.visualContinuity = new VisualContinuityService()"));
  assert.ok(main.includes("this.visualContinuity.start()"));
  assert.ok(main.includes("this.visualContinuity?.stop()"));
});

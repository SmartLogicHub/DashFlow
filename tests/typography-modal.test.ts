import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const continuity = readFileSync("src/styles/VisualContinuityStyles.ts", "utf8");
const detail = readFileSync("src/ui/ProjectDetailModal.ts", "utf8");

test("Project detail keeps a structured modal layout instead of a flat text stack", () => {
  for (const cls of [
    "dashflow-project-detail-head",
    "dashflow-project-detail-actions",
    "dashflow-project-detail-meta",
    "dashflow-project-detail-meta-item",
    "dashflow-project-detail-progress",
    "dashflow-project-detail-section-head",
    "dashflow-project-detail-task-list",
  ]) {
    assert.ok(detail.includes(cls));
    assert.ok(continuity.includes(`.${cls}`));
  }
  assert.ok(continuity.includes("grid-template-columns: repeat(4, minmax(0, 1fr))!important"));
  assert.ok(continuity.includes("font-size: 24px!important"));
});

test("Work project rows preserve all three rendered columns", () => {
  assert.ok(continuity.includes("grid-template-columns: minmax(0, 1fr) minmax(96px, 146px) 54px!important"));
  assert.ok(continuity.includes(".dashflow-project-steps"));
  assert.ok(continuity.includes(".dashflow-project-stat"));
  assert.ok(continuity.includes(".dashflow-project-row:has(.dashflow-project-steps) .dashflow-project-bar"));
});

test("Progress pair uses theme accent and balanced spacing", () => {
  assert.ok(continuity.includes("width: min(100%, 282px)!important"));
  assert.ok(continuity.includes("var(--df-home-accent, var(--interactive-accent)) var(--dashflow-progress)"));
  assert.ok(continuity.includes("grid-template-columns: repeat(2, minmax(92px, 1fr))!important"));
  assert.ok(continuity.includes(".dashflow-progress-ring::after { display: none!important; }"));
});

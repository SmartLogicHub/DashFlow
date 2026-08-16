import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const main = readFileSync("src/main.ts", "utf8");
const experience = readFileSync("src/services/ProductExperienceService.ts", "utf8");
const continuity = readFileSync("src/services/VisualContinuityService.ts", "utf8");
const polish = readFileSync("src/services/UiRefinementPolishService.ts", "utf8");
const design = readFileSync("src/services/DesignSystemService.ts", "utf8");

test("visual continuity starts before polish so Hero focus is bound once", () => {
  const continuityStart = main.indexOf("this.visualContinuity.start();");
  const polishStart = main.indexOf("this.uiRefinementPolish.start();");
  assert.ok(continuityStart >= 0 && polishStart >= 0);
  assert.ok(continuityStart < polishStart);

  const polishStop = main.indexOf("this.uiRefinementPolish?.stop();");
  const continuityStop = main.indexOf("this.visualContinuity?.stop();");
  assert.ok(polishStop >= 0 && continuityStop >= 0);
  assert.ok(polishStop < continuityStop);
});

test("v0.4.3 design system is presentation-only and starts after legacy styles", () => {
  const polishStart = main.indexOf("this.uiRefinementPolish.start();");
  const designStart = main.indexOf("this.designSystem.start();");
  assert.ok(designStart > polishStart);
  assert.equal(design.includes("MutationObserver"), false);
  assert.equal(design.includes("addEventListener"), false);
  assert.equal(design.includes("TaskService"), false);
  assert.equal(design.includes("ProjectService"), false);
  assert.equal(design.includes("HabitService"), false);
});

test("ProductExperience remains the owner of Hero navigation actions", () => {
  assert.ok(experience.includes('work.addEventListener("click", () => this.openSection("work"))'));
  assert.ok(experience.includes('capture.addEventListener("click", () => new QuickAddModal(this.plugin).open())'));
});

test("continuity marks Hero actions polished before legacy polish inspects them", () => {
  assert.ok(continuity.includes('start.dataset.dashflowPolished = "1"'));
  assert.ok(polish.includes('start.dataset.dashflowPolished !== "1"'));
  assert.ok(continuity.includes('capture.dataset.dashflowPolished = "1"'));
  assert.ok(polish.includes('capture.dataset.dashflowPolished !== "1"'));
});

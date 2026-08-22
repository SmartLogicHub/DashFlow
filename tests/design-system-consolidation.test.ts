import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";

const main = readFileSync("src/main.ts", "utf8");
const experience = readFileSync("src/services/ProductExperienceService.ts", "utf8");
const design = readFileSync("src/services/DesignSystemService.ts", "utf8");
const runtime = readFileSync("src/services/PresentationRuntimeService.ts", "utf8");
const presentation = readFileSync("src/styles/ProductPresentationStyles.ts", "utf8");

test("legacy visual runtimes are no longer started by the plugin", () => {
  assert.equal(main.includes("UiRefinementPolishService"), false);
  assert.equal(main.includes("VisualContinuityService"), false);
  assert.equal(main.includes("uiRefinementPolish"), false);
  assert.equal(main.includes("visualContinuity"), false);
  assert.ok(main.includes("this.designSystem.start();"));
  assert.ok(main.includes("this.presentationRuntime.start();"));
});

test("legacy global visual layers are fully retired", () => {
  for (const file of ["UiRefinementStyles.ts", "VisualContinuityStyles.ts", "ProductHierarchyResetStyles.ts", "DeepSeekPolishStyles.ts"]) {
    assert.equal(existsSync(`src/styles/${file}`), false, file);
    assert.equal(design.includes(file.replace(".ts", "")), false, file);
  }
});

test("the design system composes feature styles while presentation owns product geometry", () => {
  assert.ok(design.includes("DESIGN_SYSTEM_STYLES,"));
  assert.ok(design.includes("FEATURE_HUB_STYLES,"));
  assert.ok(design.includes("INTERACTION_MOTION_STYLES,"));
  assert.ok(presentation.includes(".dashflow-command-shell:not(.is-personal-home) > .dashflow-hero"));
  assert.ok(presentation.includes(".dashflow-project-detail-meta"));
  assert.equal(design.includes("new MutationObserver"), false);
  assert.equal(design.includes(".observe("), false);
  assert.equal(design.includes("addEventListener("), false);
  assert.equal(design.includes("TaskService"), false);
  assert.equal(design.includes("ProjectService"), false);
  assert.equal(design.includes("HabitService"), false);
});

test("presentation runtime is event-driven instead of DOM-observer-driven", () => {
  assert.equal(runtime.includes("new MutationObserver"), false);
  assert.equal(runtime.includes(".observe("), false);
  assert.ok(runtime.includes('workspace.on("layout-change", this.syncAmbientImage)'));
  assert.ok(runtime.includes('document.addEventListener("click", this.handleDocumentClick)'));
  assert.ok(runtime.includes("focusTodayWidget"));
  assert.ok(runtime.includes("resolveLocalHeroImage"));
});

test("ProductExperience remains the owner of the real Hero workflows", () => {
  assert.ok(experience.includes('work.addEventListener("click", () => this.openSection("work"))'));
  assert.ok(experience.includes('capture.addEventListener("click", () => new QuickAddModal(this.plugin).open())'));
});

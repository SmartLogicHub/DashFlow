import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const polish = readFileSync("src/styles/UiRefinementStyles.ts", "utf8");
const continuity = readFileSync("src/styles/VisualContinuityStyles.ts", "utf8");
const hierarchy = readFileSync("src/styles/ProductHierarchyResetStyles.ts", "utf8");
const runtime = readFileSync("src/services/PresentationRuntimeService.ts", "utf8");
const main = readFileSync("src/main.ts", "utf8");
const experience = readFileSync("src/services/ProductExperienceService.ts", "utf8");

test("one Hero image reaches non-home surfaces without a DOM observer", () => {
  assert.ok(hierarchy.includes("var(--df-hero-image"));
  assert.ok(hierarchy.includes(".dashflow-command-shell:not(.is-personal-home) > .dashflow-hero"));
  assert.ok(runtime.includes("resolveLocalHeroImage"));
  assert.ok(runtime.includes("--df-hero-image"));
  assert.equal(runtime.includes("new MutationObserver"), false);
  assert.equal(runtime.includes(".observe("), false);
  assert.ok(main.includes("new PresentationRuntimeService(this)"));
});

test("Hero actions keep real workflows while retaining explicit visual outcomes", () => {
  assert.ok(experience.includes('work.addEventListener("click", () => this.openSection("work"))'));
  assert.ok(experience.includes('capture.addEventListener("click", () => new QuickAddModal(this.plugin).open())'));
  assert.ok(experience.includes('this.text("button", "开始今天")'));
  assert.ok(experience.includes('this.text("button", "收集灵感")'));
  assert.equal(continuity.includes('content: "开始今天 →"'), false);
  assert.equal(continuity.includes('content: "收集灵感"'), false);
  assert.ok(runtime.includes("focusTodayWidget"));
});

test("screenshot polish removes decorative scrollbars and competing calendar accents", () => {
  assert.ok(polish.includes('data-widget-type="quick-capture"'));
  assert.ok(polish.includes("scrollbar-width: none!important"));
  assert.ok(polish.includes("dashflow-calendar-day.is-today"));
  assert.ok(polish.includes("background: transparent!important"));
  assert.ok(polish.includes("box-shadow: none!important"));
});

test("Home and Review use content rows and summary strips instead of form-like cards", () => {
  assert.ok(polish.includes("dashflow-home-section-head h2"));
  assert.ok(polish.includes("dashflow-home-recent-list > button"));
  assert.ok(polish.includes("dashflow-weekly-kpis"));
  assert.ok(polish.includes("dashflow-weekly-kpi:last-child"));
});

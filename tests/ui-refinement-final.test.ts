import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const polish = readFileSync("src/styles/UiRefinementStyles.ts", "utf8");
const continuity = readFileSync("src/styles/VisualContinuityStyles.ts", "utf8");
const runtime = readFileSync("src/services/PresentationRuntimeService.ts", "utf8");
const main = readFileSync("src/main.ts", "utf8");
const experience = readFileSync("src/services/ProductExperienceService.ts", "utf8");

test("v0.4.3 carries the Home scene into non-home surfaces without a DOM observer", () => {
  assert.ok(continuity.includes("var(--df-ambient-image, var(--df-home-scene))"));
  assert.ok(continuity.includes(".dashflow-command-shell:not(.is-personal-home) > .dashflow-hero"));
  assert.ok(runtime.includes("resolveLocalHeroImage"));
  assert.ok(runtime.includes("--df-ambient-image"));
  assert.equal(runtime.includes("new MutationObserver"), false);
  assert.equal(runtime.includes(".observe("), false);
  assert.ok(main.includes("new PresentationRuntimeService(this)"));
});

test("Hero actions keep real workflows while retaining explicit visual outcomes", () => {
  assert.ok(experience.includes('work.addEventListener("click", () => this.openSection("work"))'));
  assert.ok(experience.includes('capture.addEventListener("click", () => new QuickAddModal(this.plugin).open())'));
  assert.ok(continuity.includes('content: "开始今天 →"'));
  assert.ok(continuity.includes('content: "收集灵感"'));
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

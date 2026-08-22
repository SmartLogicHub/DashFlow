import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const presentation = readFileSync("src/styles/ProductPresentationStyles.ts", "utf8");
const productDesign = readFileSync("src/services/ProductDesignService.ts", "utf8");
const runtime = readFileSync("src/services/PresentationRuntimeService.ts", "utf8");
const main = readFileSync("src/main.ts", "utf8");
const experience = readFileSync("src/services/ProductExperienceService.ts", "utf8");

test("one Hero image reaches non-home surfaces without a DOM observer", () => {
  assert.ok(presentation.includes("var(--df-hero-image"));
  assert.ok(presentation.includes(".dashflow-command-shell:not(.is-personal-home) > .dashflow-hero"));
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
  assert.equal(presentation.includes('content: "开始今天 →"'), false);
  assert.equal(presentation.includes('content: "收集灵感"'), false);
  assert.ok(runtime.includes("focusTodayWidget"));
});

test("screenshot polish removes decorative scrollbars and competing calendar accents", () => {
  assert.ok(productDesign.includes(".dashflow-command-shell .dashflow-capture"));
  assert.ok(presentation.includes("scrollbar-width: none"));
  assert.ok(presentation.includes("dashflow-calendar-agenda"));
  assert.ok(presentation.includes("border-left: 0"));
});

test("Home and Review use content rows and summary strips instead of form-like cards", () => {
  assert.ok(presentation.includes("dashflow-home-section-head h2"));
  assert.ok(presentation.includes("dashflow-home-recent-list > button"));
  assert.ok(presentation.includes("dashflow-weekly-grid"));
  assert.ok(presentation.includes("dashflow-weekly-route"));
});

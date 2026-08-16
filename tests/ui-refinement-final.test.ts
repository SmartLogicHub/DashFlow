import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const polish = readFileSync("src/services/UiRefinementPolishService.ts", "utf8");
const main = readFileSync("src/main.ts", "utf8");
const experience = readFileSync("src/services/ProductExperienceService.ts", "utf8");

test("v0.4.2 carries the Home scene into non-home surfaces as quiet ambience", () => {
  assert.ok(polish.includes("var(--df-ambient-image, var(--df-home-scene))"));
  assert.ok(polish.includes("dashflow-command-shell:not(.is-personal-home)::before"));
  assert.ok(polish.includes("resolveLocalHeroImage"));
  assert.ok(polish.includes("--df-ambient-image"));
  assert.ok(main.includes("new UiRefinementPolishService(this)"));
});

test("Hero actions keep real workflows while making their outcome explicit", () => {
  assert.ok(experience.includes('work.addEventListener("click", () => this.openSection("work"))'));
  assert.ok(experience.includes('capture.addEventListener("click", () => new QuickAddModal(this.plugin).open())'));
  assert.ok(polish.includes('start.textContent = "开始今天 →"'));
  assert.ok(polish.includes('capture.textContent = "收集灵感"'));
  assert.ok(polish.includes("focusTodayWidget"));
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

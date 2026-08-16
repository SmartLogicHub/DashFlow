import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const experience = readFileSync("src/services/ProductExperienceService.ts", "utf8");
const design = readFileSync("src/services/ProductDesignService.ts", "utf8");

test("Studio UI renders Today, Inbox and Projects as purpose-built views instead of the widget grid", () => {
  assert.ok(experience.includes('CUSTOM_SECTIONS = new Set<ProductSection>(["today", "inbox", "projects"])'));
  assert.ok(experience.includes('grid.style.display = "none"'));
  assert.ok(experience.includes("dashflow-studio-stage"));
  assert.ok(experience.includes("renderQuickAdd(today)"));
  assert.equal(experience.includes("dashflow-today-summary-item"), false);
});

test("Studio UI replaces the heavy black sidebar with a quiet theme-aware navigation surface", () => {
  assert.ok(design.includes("dashflow-studio-nav"));
  assert.ok(design.includes("color-mix(in srgb, var(--df-st-surface) 78%, transparent)"));
  assert.ok(design.includes("grid-template-columns: 176px minmax(0, 1fr)"));
  assert.equal(design.includes("--df-v3-sidebar: #11131a"), false);
});

test("Today uses one focus surface and contextual rail instead of equal-weight KPI cards", () => {
  assert.ok(experience.includes("dashflow-focus-panel"));
  assert.ok(experience.includes("dashflow-studio-context-rail"));
  assert.ok(experience.includes("dashflow-day-context"));
  assert.ok(design.includes("Metrics are context, not four equal KPI cards"));
});

test("Projects use an interactive portfolio board and mobile navigation becomes a bottom bar", () => {
  assert.ok(experience.includes("dashflow-project-board"));
  assert.ok(experience.includes("ProjectDetailModal"));
  assert.ok(design.includes("grid-template-columns:repeat(2,minmax(0,1fr))"));
  assert.ok(design.includes("position:fixed"));
  assert.ok(design.includes("bottom:10px"));
});

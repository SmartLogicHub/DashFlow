import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const experience = readFileSync("src/services/ProductExperienceService.ts", "utf8");
const design = readFileSync("src/services/ProductDesignService.ts", "utf8");
const home = readFileSync("src/services/PersonalHomeService.ts", "utf8");
const homeDesign = readFileSync("src/services/PersonalHomeDesignService.ts", "utf8");

test("DashFlow keeps Obsidian chrome and uses horizontal navigation instead of an internal app sidebar", () => {
  assert.ok(experience.includes("COMMAND_SECTIONS"));
  assert.ok(experience.includes("dashflow-command-bar"));
  assert.ok(experience.includes("dashflow-command-nav"));
  assert.ok(experience.includes("dashflow-product-nav\")?.remove()"));
  assert.equal(design.includes("grid-template-columns: 176px minmax(0, 1fr)"), false);
});

test("Personal Home and Work dashboard are intentionally separate surfaces", () => {
  assert.ok(experience.includes('section === "today"'));
  assert.ok(experience.includes("this.personalHome.render()"));
  assert.ok(experience.includes('section === "work"'));
  assert.ok(experience.includes("WORK_WIDGET_TYPES"));
  assert.ok(home.includes("长期成长的四个领域"));
});

test("Personal Home uses one emotional Hero and quiet content surfaces", () => {
  assert.ok(homeDesign.includes("Hero: one emotional surface"));
  assert.ok(homeDesign.includes("dashflow-home-top-grid"));
  assert.ok(homeDesign.includes("dashflow-home-area-grid"));
  assert.ok(homeDesign.includes("dashflow-home-activity-strip"));
  assert.ok(experience.includes("homeHeroImagePath"));
});

test("Work remains a dense editable Command Dashboard with real metrics", () => {
  assert.ok(design.includes("Dense dashboard grid"));
  assert.ok(experience.includes("activityStreak(this.plugin.data.activity)"));
  assert.ok(experience.includes('this.progressMetric("TODAY"'));
  assert.ok(experience.includes('this.progressMetric("ALL TASKS"'));
  assert.ok(experience.includes("ProjectDetailModal"));
  assert.ok(experience.includes("dashflow-task-priority"));
});

test("hidden workflow cards remain hidden even when responsive CSS changes grid layout", () => {
  assert.ok(experience.includes('card.style.setProperty("display", "none", "important")'));
  assert.ok(experience.includes('card.style.removeProperty("display")'));
});

test("Inbox remains a real processing workflow instead of a decorative dashboard card", () => {
  assert.ok(experience.includes("renderInboxPage"));
  assert.ok(experience.includes("inboxTasks("));
  assert.ok(experience.includes("captureService.capture"));
  assert.ok(experience.includes("TaskEditorModal"));
});

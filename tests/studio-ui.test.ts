import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const experience = readFileSync("src/services/ProductExperienceService.ts", "utf8");
const design = readFileSync("src/services/ProductDesignService.ts", "utf8");
const home = readFileSync("src/services/PersonalHomeService.ts", "utf8");
const homeDesign = readFileSync("src/services/PersonalHomeDesignService.ts", "utf8");
const runtime = readFileSync("src/services/PresentationRuntimeService.ts", "utf8");

test("DashFlow keeps Obsidian chrome and uses horizontal navigation instead of an internal app sidebar", () => {
  assert.ok(experience.includes("PRODUCT_SECTIONS"));
  assert.ok(experience.includes("dashflow-command-bar"));
  assert.ok(experience.includes("dashflow-command-nav"));
  assert.ok(experience.includes("dashflow-product-nav\")?.remove()"));
  assert.equal(design.includes("grid-template-columns: 176px minmax(0, 1fr)"), false);
});

test("Personal Home and Work dashboard remain separate functional surfaces", () => {
  assert.ok(experience.includes('section === "today"'));
  assert.ok(experience.includes("this.personalHome.render()"));
  assert.ok(experience.includes('section === "work"'));
  assert.ok(experience.includes("isWidgetVisibleInSection(section, type, widget.hidden)"));
  assert.ok(home.includes("长期成长"));
});

test("Personal Home uses a compact atmospheric Hero and content-led sections", () => {
  assert.ok(homeDesign.includes("Compact atmospheric Hero"));
  assert.ok(homeDesign.includes("dashflow-home-top-grid"));
  assert.ok(homeDesign.includes("dashflow-home-area-list"));
  assert.ok(homeDesign.includes("dashflow-home-activity-strip"));
  assert.ok(runtime.includes("homeHeroImagePath"));
});

test("Work uses the compact Hero and keeps real editable metrics", () => {
  assert.ok(design.includes("Work is an execution surface"));
  assert.ok(design.includes("dashflow-command-shell:not(.is-personal-home)>.dashflow-hero"));
  assert.ok(experience.includes("activityStreak(this.plugin.data.activity)"));
  assert.ok(experience.includes("taskOverview(todayTasks, snapshot.tasks)"));
  assert.equal(experience.includes('this.progressMetric("ALL TASKS"'), false);
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

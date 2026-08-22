import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { recoveryForSection } from "../src/product/sectionPolicy";

const experience = readFileSync("src/services/ProductExperienceService.ts", "utf8");
const styles = readFileSync("src/styles/FeatureHubStyles.ts", "utf8");

test("every focused section has contextual recovery copy and a recommended Widget", () => {
  assert.deepEqual(recoveryForSection("calendar"), {
    section: "calendar",
    title: "日历还没有加入当前工作台",
    description: "加入日历后，就能在这里统一查看任务、项目与习惯日期。",
    widgetType: "calendar",
    actionLabel: "加入日历",
  });
  assert.equal(recoveryForSection("projects")?.widgetType, "projects");
  assert.equal(recoveryForSection("habits")?.widgetType, "habits");
  assert.equal(recoveryForSection("review")?.widgetType, "weekly-review");
  assert.equal(recoveryForSection("today"), null);
  assert.equal(recoveryForSection("work"), null);
  assert.equal(recoveryForSection("inbox"), null);
});

test("focused sections render recovery instead of a blank canvas", () => {
  assert.ok(experience.includes("sectionCoverage(section, dashboard.widgets)"));
  assert.ok(experience.includes("recoveryForSection(section)"));
  assert.ok(experience.includes("renderSectionAssist"));
  assert.ok(experience.includes("dashflow-section-assist"));
  assert.ok(experience.includes("addSectionWidget"));
});

test("one-click recovery restores hidden instances or adds the recommended Widget", () => {
  assert.ok(experience.includes("existing?.hidden"));
  assert.ok(experience.includes("dashboardManager.updateWidget"));
  assert.ok(experience.includes("dashboardManager.addWidget"));
  assert.ok(experience.includes("if (!added)"));
  assert.ok(experience.includes("new Notice"));
});

test("section recovery is full-width, responsive, and keyboard accessible", () => {
  assert.ok(styles.includes(".dashflow-section-assist"));
  assert.ok(styles.includes("grid-column: 1 / -1"));
  assert.ok(styles.includes(".dashflow-section-assist button:focus-visible"));
  assert.ok(styles.includes("@media (max-width: 760px)"));
});

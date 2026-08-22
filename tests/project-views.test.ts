import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import {
  PROJECT_VIEW_OPTIONS,
  projectRecoveryForView,
} from "../src/product/sectionPolicy";

const experience = readFileSync("src/services/ProductExperienceService.ts", "utf8");
const featureHub = readFileSync("src/ui/FeatureHubModal.ts", "utf8");
const styles = readFileSync("src/styles/FeatureHubStyles.ts", "utf8");

test("project view choices use one canonical ordered catalog", () => {
  assert.deepEqual(PROJECT_VIEW_OPTIONS.map((option) => option.type), [
    "projects",
    "project-kanban",
    "project-gantt",
  ]);
  assert.deepEqual(PROJECT_VIEW_OPTIONS.map((option) => option.label), ["列表", "看板", "时间轴"]);
});

test("each project view has its own contextual add recovery", () => {
  assert.equal(projectRecoveryForView("projects").actionLabel, "加入项目列表");
  assert.equal(projectRecoveryForView("project-kanban").actionLabel, "加入项目看板");
  assert.equal(projectRecoveryForView("project-gantt").actionLabel, "加入项目时间轴");
});

test("project page stores one session view and initially follows the shared fallback", () => {
  assert.ok(experience.includes("activeProjectView"));
  assert.ok(experience.includes("initialProjectView(dashboard.widgets)"));
  assert.ok(experience.includes("openProjectView(type: ProjectViewType)"));
  assert.ok(experience.includes("currentProjectView()"));
});

test("project page renders one selected view plus a real switcher", () => {
  assert.ok(experience.includes("applyProjectSection"));
  assert.ok(experience.includes("renderProjectViewSwitcher"));
  assert.ok(experience.includes("dashflow-project-view-switcher"));
  assert.ok(experience.includes('setAttribute("aria-pressed"'));
  assert.equal((experience.match(/setAttribute\("aria-current", "page"\)/g) ?? []).length, 2);
  assert.ok(experience.includes("type === selected"));
  assert.ok(experience.includes("projectRecoveryForView(selected)"));
});

test("feature hub routes project Widgets to their exact selected view", () => {
  assert.ok(featureHub.includes("PROJECT_VIEW_TYPES.includes"));
  assert.ok(featureHub.includes("productExperience.openProjectView"));
});

test("project switcher is compact responsive and focus-visible", () => {
  assert.ok(styles.includes(".dashflow-project-view-switcher"));
  assert.ok(styles.includes(".dashflow-project-view-button.is-active"));
  assert.ok(styles.includes(".dashflow-project-view-button:focus-visible"));
  assert.ok(styles.includes("overflow-x: auto"));
});

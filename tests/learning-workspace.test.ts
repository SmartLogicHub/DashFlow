import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { learningMistakePatterns } from "../src/learning/learningMath";
import type { LearningMistake } from "../src/learning/models";

const navigation = readFileSync("src/product/navigation.ts", "utf8");
const experience = readFileSync("src/services/LearningExperienceService.ts", "utf8");
const workspace = readFileSync("src/learning/LearningWorkspace.ts", "utf8");
const goalEditor = readFileSync("src/ui/LearningGoalEditorModal.ts", "utf8");
const sessionEditor = readFileSync("src/ui/LearningSessionEditorModal.ts", "utf8");
const design = readFileSync("src/services/DesignSystemService.ts", "utf8");
const main = readFileSync("src/main.ts", "utf8");

test("Learning is a first-class product destination rather than a widget pile", () => {
  assert.ok(navigation.includes('"learning"'));
  assert.ok(navigation.includes('label: "学习"'));
  assert.ok(navigation.includes('learning: []'));
  assert.ok(experience.includes('data-section="learning"'));
  assert.ok(experience.includes('new LearningWorkspace(plugin)'));
  assert.equal(experience.includes("MutationObserver"), false);
  assert.ok(experience.includes("dashboardRender.subscribe"));
});

test("Learning workspace prioritizes goals, evidence, mistakes and next action", () => {
  assert.ok(workspace.includes("当前学习目标"));
  assert.ok(workspace.includes("最近训练"));
  assert.ok(workspace.includes("错误模式"));
  assert.ok(workspace.includes("最近证据"));
  assert.ok(workspace.includes("NEXT"));
  assert.ok(workspace.includes("学习效果以留下的能力证据为准"));
  assert.equal(workspace.includes("progressPercent"), false);
});

test("Learning editors persist through LearningService and distinguish assistance", () => {
  assert.ok(goalEditor.includes("plugin.learningService.updateGoal"));
  assert.ok(goalEditor.includes("plugin.learningService.createGoal"));
  assert.ok(sessionEditor.includes("plugin.learningService.updateSession"));
  assert.ok(sessionEditor.includes("plugin.learningService.createSession"));
  assert.ok(sessionEditor.includes('"none", "无辅助"'));
  assert.ok(sessionEditor.includes('"ai", "AI 辅助"'));
  assert.ok(sessionEditor.includes("证据"));
  assert.ok(sessionEditor.includes("错误 / 缺口"));
});

test("Learning service and workspace are wired into plugin lifecycle and design system", () => {
  assert.ok(main.includes('import { LearningService } from "./services/LearningService"'));
  assert.ok(main.includes('import { LearningExperienceService } from "./services/LearningExperienceService"'));
  assert.ok(main.includes("this.learningService = new LearningService"));
  assert.ok(main.includes("this.learningExperience.start()"));
  assert.ok(main.includes('section === "learning"'));
  assert.ok(main.includes('id: "new-learning-goal"'));
  assert.ok(main.includes('id: "new-learning-session"'));
  assert.ok(design.includes('import { LEARNING_STYLES } from "../styles/LearningStyles"'));
  assert.ok(design.includes("LEARNING_STYLES,"));
});

test("repeated mistakes are aggregated by normalized meaning", () => {
  const mistakes: LearningMistake[] = [
    { id: "a", goalId: "g", sessionId: "s1", date: "2026-08-15", text: "忘记 unregister event", source: { path: "a.md" } },
    { id: "b", goalId: "g", sessionId: "s2", date: "2026-08-16", text: "忘记 unregister event。", source: { path: "b.md" } },
    { id: "c", goalId: "g", sessionId: "s3", date: "2026-08-16", text: "async 生命周期解释不清", source: { path: "c.md" } },
  ];
  const patterns = learningMistakePatterns(mistakes);
  assert.equal(patterns[0]?.count, 2);
  assert.equal(patterns[0]?.lastDate, "2026-08-16");
  assert.equal(patterns[1]?.count, 1);
});

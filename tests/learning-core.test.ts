import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const models = readFileSync("src/learning/models.ts", "utf8");
const parser = readFileSync("src/parsers/learningParser.ts", "utf8");
const index = readFileSync("src/services/VaultIndexService.ts", "utf8");
const service = readFileSync("src/services/LearningService.ts", "utf8");

test("learning core models the evidence-driven loop without an AI dependency", () => {
  assert.ok(models.includes("export interface LearningGoal"));
  assert.ok(models.includes("outcome: string"));
  assert.ok(models.includes("baseline?: string"));
  assert.ok(models.includes("successCriteria: string[]"));
  assert.ok(models.includes("nextStep?: string"));
  assert.ok(models.includes("export interface LearningSession"));
  assert.ok(models.includes("evidence: string[]"));
  assert.ok(models.includes("mistakes: string[]"));
  assert.ok(models.includes('LearningAssistance = "none" | "ai" | "human" | "mixed"'));
  assert.equal(models.includes("AIClient"), false);
});

test("learning parser keeps goal and session semantics explicit", () => {
  assert.ok(parser.includes('!== "learning-goal"'));
  assert.ok(parser.includes('!== "learning-session"'));
  assert.ok(parser.includes('"baseline", "practice", "assessment", "review"'));
  assert.ok(parser.includes('"completed", "partial", "blocked"'));
  assert.ok(parser.includes('"none", "ai", "human", "mixed"'));
  assert.ok(parser.includes("frontmatter.success_criteria"));
  assert.ok(parser.includes("frontmatter.mistakes ?? frontmatter.gaps"));
});

test("VaultIndex derives evidence and mistakes from session Markdown", () => {
  assert.ok(index.includes("parseLearningGoal"));
  assert.ok(index.includes("parseLearningSession"));
  assert.ok(index.includes("deriveLearningEvidence"));
  assert.ok(index.includes("deriveLearningMistakes"));
  assert.ok(index.includes("learningGoals:"));
  assert.ok(index.includes("learningSessions"));
  assert.ok(index.includes("learningEvidence"));
  assert.ok(index.includes("learningMistakes"));
});

test("LearningService writes business truth to Vault Markdown", () => {
  assert.ok(service.includes('const GOAL_FOLDER = "DashFlow/Learning/Goals"'));
  assert.ok(service.includes('const SESSION_FOLDER = "DashFlow/Learning/Sessions"'));
  assert.ok(service.includes("app.vault.create"));
  assert.ok(service.includes("fileManager.processFrontMatter"));
  assert.ok(service.includes('frontmatter.type = "learning-goal"'));
  assert.ok(service.includes('frontmatter.type = "learning-session"'));
  assert.equal(service.includes("saveData("), false);
  assert.equal(service.includes("data.json"), false);
});

test("learning sessions can distinguish independent and assisted practice", () => {
  assert.ok(service.includes("assistance: ${input.assistance}"));
  assert.ok(service.includes("frontmatter.assistance = input.assistance"));
  assert.ok(service.includes("evidence"));
  assert.ok(service.includes("mistakes"));
  assert.ok(service.includes("next_step"));
});

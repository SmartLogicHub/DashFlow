import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { DEFAULT_SETTINGS, PLUGIN_VERSION, SCHEMA_VERSION } from "../src/constants";

const home = readFileSync("src/services/PersonalHomeService.ts", "utf8");
const homeDesign = readFileSync("src/services/PersonalHomeDesignService.ts", "utf8");
const quickAdd = readFileSync("src/ui/QuickAddModal.ts", "utf8");
const imagePicker = readFileSync("src/ui/HeroImagePickerModal.ts", "utf8");
const settings = readFileSync("src/settings/DashFlowSettingsTab.ts", "utf8");

test("v0.4.0 introduces a schema-backed Personal OS appearance configuration", () => {
  assert.equal(PLUGIN_VERSION, "0.4.0");
  assert.equal(SCHEMA_VERSION, 6);
  assert.equal(DEFAULT_SETTINGS.homeTheme, "alpine");
  assert.equal(DEFAULT_SETTINGS.homeHeroImagePath, "");
  assert.equal(DEFAULT_SETTINGS.homeHeroOverlay, 46);
});

test("Hero image is local-vault-first with theme fallback instead of a remote stock URL", () => {
  assert.ok(settings.includes("HeroImagePickerModal"));
  assert.ok(settings.includes("选择图片"));
  assert.ok(homeDesign.includes("--df-home-image"));
  assert.equal(homeDesign.includes("https://"), false);
  assert.equal(settings.includes("unsplash"), false);
  for (const extension of ["jpg", "jpeg", "png", "webp", "avif", "gif"]) {
    assert.ok(imagePicker.includes(`\"${extension}\"`), extension);
  }
});

test("Personal Home uses real Task, Project, Habit, Activity and recent Vault note data", () => {
  assert.ok(home.includes("taskService.focus"));
  assert.ok(home.includes("projectService.active"));
  assert.ok(home.includes("habitScheduledOn"));
  assert.ok(home.includes("activityRange"));
  assert.ok(home.includes("getMarkdownFiles"));
});

test("Quick Add captures immediately while preserving structured editors", () => {
  assert.ok(quickAdd.includes("captureService.capture"));
  assert.ok(quickAdd.includes("TaskEditorModal"));
  assert.ok(quickAdd.includes("ProjectEditorModal"));
  assert.ok(quickAdd.includes("HabitEditorModal"));
});

test("theme layer ships Alpine, Paper, Midnight and Obsidian presets", () => {
  for (const theme of ["alpine", "paper", "midnight", "obsidian"]) {
    assert.ok(homeDesign.includes(`data-dashflow-theme=\"${theme}\"`), theme);
  }
});

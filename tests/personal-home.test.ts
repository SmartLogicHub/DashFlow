import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { DEFAULT_SETTINGS, PLUGIN_VERSION, SCHEMA_VERSION } from "../src/constants";

const home = readFileSync("src/services/PersonalHomeService.ts", "utf8");
const homeDesign = readFileSync("src/services/PersonalHomeDesignService.ts", "utf8");
const designSystem = readFileSync("src/services/DesignSystemService.ts", "utf8");
const quickAdd = readFileSync("src/ui/QuickAddModal.ts", "utf8");
const imagePicker = readFileSync("src/ui/HeroImagePickerModal.ts", "utf8");
const settings = readFileSync("src/settings/DashFlowSettingsTab.ts", "utf8");
const heroScenes = readFileSync("src/product/heroScenes.ts", "utf8");

test("v0.6.0 keeps schema-backed preferences without changing Markdown truth", () => {
  assert.equal(PLUGIN_VERSION, "0.6.0");
  assert.equal(SCHEMA_VERSION, 8);
  assert.equal(DEFAULT_SETTINGS.homeTheme, "alpine");
  assert.equal(DEFAULT_SETTINGS.homeHeroImagePath, "");
  assert.equal(DEFAULT_SETTINGS.homeHeroOverlay, 32);
  assert.equal(DEFAULT_SETTINGS.weReadEnabled, false);
  assert.equal(DEFAULT_SETTINGS.weReadSecretId, "");
  assert.equal(DEFAULT_SETTINGS.weReadShowOnHome, true);
  assert.equal(DEFAULT_SETTINGS.aiMorningBriefingEnabled, false);
  assert.equal(DEFAULT_SETTINGS.dailyNoteDateFormat, "YYYY-MM-DD");
  assert.equal(DEFAULT_SETTINGS.quickCaptureTarget, "inbox");
  assert.equal(DEFAULT_SETTINGS.contextMorningDashboardId, "home");
});

test("Hero ships curated low-saturation scenes while preserving local Vault override", () => {
  assert.ok(settings.includes("HeroImagePickerModal"));
  assert.ok(settings.includes("选择图片"));
  assert.ok(homeDesign.includes("--df-home-image"));
  assert.ok(homeDesign.includes("--df-home-scene"));
  assert.equal(homeDesign.includes("unsplash.com"), false);
  assert.ok(heroScenes.includes("alpine.webp"));
  assert.ok(heroScenes.includes("paper.webp"));
  assert.ok(heroScenes.includes("midnight.webp"));
  for (const asset of ["assets/heroes/alpine.webp", "assets/heroes/paper.webp", "assets/heroes/midnight.webp"]) {
    assert.equal(existsSync(asset), true, asset);
  }
  for (const extension of ["jpg", "jpeg", "png", "webp", "avif", "gif"]) {
    assert.ok(imagePicker.includes(`"${extension}"`), extension);
  }
});

test("Personal Home uses real Task, Project, Habit, Activity, WeRead and recent Vault note data", () => {
  assert.ok(home.includes("taskService.focus"));
  assert.ok(home.includes("projectService.active"));
  assert.ok(home.includes("habitScheduledOn"));
  assert.ok(home.includes("activityRange"));
  assert.ok(home.includes("plugin.weRead"));
  assert.ok(home.includes("getMarkdownFiles"));
});

test("Personal Home promotes Daily Progress without mixing it into Habit metrics", () => {
  assert.ok(home.includes('habit.kind !== "daily-progress"'));
  assert.ok(home.includes('habit.kind === "daily-progress"'));
  assert.ok(home.includes("renderDailyProgress"));
  assert.ok(home.includes("DailyProgressNoteModal"));
  assert.ok(home.includes('this.metric("日更"'));
  assert.ok(designSystem.includes("dashflow-home-daily-progress-row"));
  assert.ok(designSystem.includes("grid-template-columns: repeat(4, minmax(0, 1fr))"));
});

test("Visual Reset makes areas compact navigation rows instead of large empty cards", () => {
  assert.ok(home.includes("dashflow-home-area-list"));
  assert.ok(homeDesign.includes("Areas are navigation rows"));
  assert.equal(homeDesign.includes("min-height:174px"), false);
  assert.ok(homeDesign.includes("height:194px!important"));
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

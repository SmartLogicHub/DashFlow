import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { HERO_THEME_CHOICES, heroThemeChoice } from "../src/product/heroThemes";
import { heroPresentationFor } from "../src/product/heroPresentation";
import { persistHomeTheme, type HomeThemeSetting } from "../src/product/homeThemeSelection";
import { taskOverview } from "../src/product/progressOverview";

const settingsSource = readFileSync("src/settings/DashFlowSettingsTab.ts", "utf8");
const runtimeSource = readFileSync("src/services/PresentationRuntimeService.ts", "utf8");
const experienceSource = readFileSync("src/services/ProductExperienceService.ts", "utf8");
const hierarchyStyles = readFileSync("src/styles/ProductHierarchyResetStyles.ts", "utf8");
const settingsStyles = readFileSync("src/styles/SettingsStyles.ts", "utf8");
const rendererSource = readFileSync("src/dashboard/DashboardRenderer.ts", "utf8");

test("theme choices expose three offline scenes and one Obsidian-following option", () => {
  assert.deepEqual(HERO_THEME_CHOICES.map((choice) => choice.id), ["alpine", "paper", "midnight", "obsidian"]);
  assert.deepEqual(
    HERO_THEME_CHOICES.slice(0, 3).map((choice) => choice.assetPath),
    ["assets/heroes/alpine.webp", "assets/heroes/paper.webp", "assets/heroes/midnight.webp"],
  );
  assert.equal(heroThemeChoice("obsidian")?.assetPath, null);
});

test("working Hero uses compact Chinese product copy", () => {
  assert.deepEqual(heroPresentationFor("work"), {
    eyebrow: "DASHFLOW · 工作节奏",
    title: "工作台",
    description: "高密度查看任务、项目、进度、提醒与 Activity。",
    compact: true,
  });
  assert.equal(heroPresentationFor("today").compact, false);
});

test("theme click only stays selected after its persistence succeeds", async () => {
  const settings: HomeThemeSetting = { homeTheme: "alpine" };
  let saves = 0;

  await persistHomeTheme(settings, "midnight", async () => { saves += 1; });
  assert.equal(settings.homeTheme, "midnight");
  assert.equal(saves, 1);

  await assert.rejects(
    () => persistHomeTheme(settings, "paper", async () => { throw new Error("disk unavailable"); }),
    /disk unavailable/,
  );
  assert.equal(settings.homeTheme, "midnight");
});

test("appearance uses accessible image cards and one shared Hero image runtime", () => {
  assert.ok(settingsSource.includes("dashflow-theme-card"));
  assert.ok(settingsSource.includes("aria-pressed"));
  assert.ok(settingsSource.includes("persistHomeTheme"));
  assert.ok(settingsSource.includes("await this.dashFlow.savePluginData()"));
  assert.equal(settingsSource.includes("来自 Unsplash"), false);
  assert.ok(runtimeSource.includes("themePreviewUrl"));
  assert.ok(runtimeSource.includes("--df-hero-image"));
});

test("theme image cards neutralize Obsidian's fixed button height", () => {
  assert.match(settingsStyles, /\.dashflow-theme-card\s*\{[^}]*display:\s*block\s*!important/s);
  assert.match(settingsStyles, /\.dashflow-theme-card\s*\{[^}]*height:\s*auto\s*!important/s);
});

test("working Hero has one DOM owner and a compact shared-image frame", () => {
  assert.ok(experienceSource.includes("heroPresentationFor"));
  assert.ok(experienceSource.includes("dashflow-hero-content"));
  assert.ok(experienceSource.includes("content.append(eyebrow, heading, description)"));
  assert.equal(experienceSource.includes("Obsidian · Personal Dashboard"), false);
  assert.equal(rendererSource.includes("Obsidian · Personal Dashboard"), false);
  assert.equal(hierarchyStyles.includes("::after"), false);
  assert.ok(hierarchyStyles.includes("height: 128px !important"));
  assert.ok(hierarchyStyles.includes("var(--df-hero-image"));
});

test("task overview keeps today and all-task metrics semantically separate", () => {
  const overview = taskOverview(
    [{ completed: true }, { completed: false }],
    [{ completed: true }, { completed: false }, { completed: true }, { completed: false }],
  );

  assert.equal(overview.title, "任务概览");
  assert.deepEqual(overview.metrics, [
    { label: "今日任务", completed: 1, total: 2, percentage: 50 },
    { label: "全部任务", completed: 2, total: 4, percentage: 50 },
  ]);
  assert.deepEqual(taskOverview([], []).metrics.map((metric) => metric.percentage), [0, 0]);
});

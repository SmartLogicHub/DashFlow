import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";

const scriptPath = "scripts/obsidian-ui-smoke.mjs";
const script = existsSync(scriptPath) ? readFileSync(scriptPath, "utf8") : "";
const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
  scripts?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

test("package exposes a pinned real-Obsidian UI smoke command", () => {
  assert.equal(packageJson.scripts?.["test:ui"], "node scripts/obsidian-ui-smoke.mjs");
  assert.match(packageJson.devDependencies?.["playwright-core"] ?? "", /^\d+\.\d+\.\d+$/);
  assert.equal(existsSync(scriptPath), true);
});

test("UI smoke connects over configurable CDP and checks core product surfaces", () => {
  assert.ok(script.includes("DASHFLOW_OBSIDIAN_CDP_URL"));
  assert.ok(script.includes("chromium.connectOverCDP"));
  assert.ok(script.includes('startsWith("app://obsidian.md")'));
  for (const selector of [
    ".dashflow-shell",
    ".dashflow-command-nav",
    ".dashflow-feature-hub",
    ".dashflow-settings-page",
  ]) assert.ok(script.includes(selector), selector);
  assert.ok(script.includes("unnamedVisibleButtons"));
  assert.ok(script.includes("viewportOverflow"));
  assert.ok(script.includes("pageErrors"));
  assert.ok(script.includes("consoleErrors"));
});

test("UI smoke is read-only, writes diagnostics, and restores UI state", () => {
  for (const forbidden of ["saveData(", "vault.create(", "vault.modify(", "processFrontMatter("]) {
    assert.equal(script.includes(forbidden), false, forbidden);
  }
  assert.ok(script.includes("output/playwright/release-smoke"));
  assert.ok(script.includes("finally"));
  assert.ok(script.includes("originalViewport"));
  assert.ok(script.includes("originalSection"));
  assert.ok(script.includes("originalLeafState"));
  assert.match(script, /originalLeafState[\s\S]*?openSection\(page, "work"\)[\s\S]*?locator\("\.dashflow-shell"\)/);
  assert.ok(script.includes("setViewState(originalLeafState"));
  assert.ok(script.includes("closeOpenModals"));
});

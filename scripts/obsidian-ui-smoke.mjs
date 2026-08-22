import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";

const cdpUrl = process.env.DASHFLOW_OBSIDIAN_CDP_URL ?? "http://127.0.0.1:9222";
const outputDirectory = path.resolve("output/playwright/release-smoke");
const wideViewport = { width: 1707, height: 1019 };
const narrowViewport = { width: 760, height: 900 };
const sectionCommands = {
  today: "dashflow:open-today",
  work: "dashflow:open-work",
  projects: "dashflow:open-projects",
  inbox: "dashflow:open-inbox",
  calendar: "dashflow:open-calendar",
  habits: "dashflow:open-habits",
  review: "dashflow:open-review",
};

async function closeOpenModals(page) {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    if (await page.locator(".modal-container").count() === 0) return;
    await page.keyboard.press("Escape");
    await page.waitForTimeout(100);
  }
}

async function currentSection(page) {
  return page.evaluate(() => {
    const shell = document.querySelector(".dashflow-shell");
    if (!shell) return null;
    if (shell.classList.contains("is-personal-home")) return "today";
    return shell.querySelector(".dashflow-grid[data-product-section]")?.getAttribute("data-product-section") ?? null;
  });
}

async function waitForSection(page, section) {
  await page.waitForFunction((expected) => {
    const shell = document.querySelector(".dashflow-shell");
    if (!shell) return false;
    if (expected === "today") return shell.classList.contains("is-personal-home");
    return shell.querySelector(`.dashflow-grid[data-product-section='${expected}']`) !== null;
  }, section, { timeout: 10_000 });
  await page.waitForTimeout(250);
}

async function openSection(page, section) {
  const command = sectionCommands[section];
  if (!command) throw new Error(`No DashFlow command is registered for section: ${section}`);
  await page.evaluate(async (commandId) => window.app.commands.executeCommandById(commandId), command);
  await waitForSection(page, section);
}

async function inspectSurface(page) {
  return page.evaluate(() => {
    const visible = (element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
    };
    const shell = document.querySelector(".dashflow-shell");
    const nav = document.querySelector(".dashflow-command-nav");
    if (!shell || !nav) throw new Error("DashFlow product shell or navigation is missing");
    const shellRect = shell.getBoundingClientRect();
    const unnamedVisibleButtons = Array.from(shell.querySelectorAll("button"))
      .filter(visible)
      .filter((button) => !(button.getAttribute("aria-label") || button.textContent?.trim()))
      .map((button) => button.className);
    const actions = ["add", "features", "search"].map((name) => {
      const element = shell.querySelector(`[data-command-action='${name}']`);
      if (!element) return { name, missing: true };
      const rect = element.getBoundingClientRect();
      return {
        name,
        missing: false,
        visible: visible(element),
        accessibleName: element.getAttribute("aria-label") || element.textContent?.trim() || "",
        insideShell: rect.left >= shellRect.left - 1 && rect.right <= shellRect.right + 1,
      };
    });
    const viewportOverflow = Math.max(0, shell.scrollWidth - shell.clientWidth);
    return {
      unnamedVisibleButtons,
      viewportOverflow,
      shellInsideViewport: shellRect.left >= -1 && shellRect.right <= innerWidth + 1,
      navVisible: visible(nav),
      mobile: shell.classList.contains("is-mobile"),
      actions,
    };
  });
}

async function findSettingsPage(browser, timeout = 15_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    for (const context of browser.contexts()) {
      for (const candidate of context.pages()) {
        if (!candidate.isClosed() && await candidate.locator(".dashflow-settings-page").count()) return candidate;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  return null;
}

await mkdir(outputDirectory, { recursive: true });

let browser;
let page;
let settingsPage;
let originalViewport = null;
let originalSection = null;
let originalLeafState = null;
let originalSidebars = null;
const consoleErrors = [];
const pageErrors = [];
const report = { cdpUrl, startedAt: new Date().toISOString() };

try {
  browser = await chromium.connectOverCDP(cdpUrl);
  page = browser.contexts()
    .flatMap((context) => context.pages())
    .find((candidate) => candidate.url().startsWith("app://obsidian.md"));
  if (!page) throw new Error(`Obsidian page not found at ${cdpUrl}. Launch Obsidian with --remote-debugging-port=9222.`);

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  const plugin = await page.evaluate(() => ({
    loaded: Boolean(window.app?.plugins?.plugins?.dashflow),
    version: window.app?.plugins?.manifests?.dashflow?.version ?? null,
  }));
  assert.equal(plugin.loaded, true, "DashFlow is not enabled in the connected Vault");

  originalViewport = page.viewportSize();
  originalSection = await currentSection(page);
  originalLeafState = await page.evaluate(() => window.app.workspace.activeLeaf?.getViewState?.() ?? null);
  originalSidebars = await page.evaluate(() => ({
    leftCollapsed: window.app.workspace.leftSplit.collapsed,
    rightCollapsed: window.app.workspace.rightSplit.collapsed,
  }));
  if (!originalSection) await openSection(page, "work");
  await page.locator(".dashflow-shell").first().waitFor({ state: "visible", timeout: 10_000 });

  await page.setViewportSize(wideViewport);
  await openSection(page, "today");
  const today = await inspectSurface(page);
  assert.deepEqual(today.unnamedVisibleButtons, [], "Today exposes unnamed visible buttons");
  assert.equal(today.navVisible, true);
  await page.screenshot({ path: path.join(outputDirectory, "today-wide.png") });

  await openSection(page, "work");
  const work = await inspectSurface(page);
  assert.deepEqual(work.unnamedVisibleButtons, [], "Work exposes unnamed visible buttons");
  assert.equal(work.viewportOverflow <= 1, true, `Work shell overflows by ${work.viewportOverflow}px`);
  assert.equal(work.actions.every((action) => !action.missing && action.visible && action.accessibleName), true);
  await page.screenshot({ path: path.join(outputDirectory, "work-wide.png") });

  await page.locator(".dashflow-feature-action").click();
  await page.locator(".dashflow-feature-hub").waitFor({ state: "visible", timeout: 10_000 });
  const featureCount = await page.locator(".dashflow-feature-hub-item").count();
  assert.equal(featureCount > 10, true, "Feature Hub does not expose the product catalog");
  const featureSearch = page.locator(".dashflow-feature-hub-search");
  await featureSearch.fill("__dashflow_smoke_no_match__");
  await page.locator(".dashflow-feature-hub-empty").waitFor({ state: "visible" });
  await featureSearch.fill("");
  await page.waitForFunction(() => document.querySelectorAll(".dashflow-feature-hub-item").length > 10);
  await page.screenshot({ path: path.join(outputDirectory, "feature-hub-wide.png") });
  await closeOpenModals(page);

  await page.evaluate(() => window.app.plugins.plugins.dashflow.openSettings("appearance"));
  settingsPage = await findSettingsPage(browser);
  assert.ok(settingsPage, "DashFlow settings did not open");
  await settingsPage.locator(".dashflow-settings-page").waitFor({ state: "visible" });
  const settingsTabs = await settingsPage.locator(".dashflow-settings-tab").allTextContents();
  assert.deepEqual(settingsTabs.map((value) => value.trim()), ["外观", "工作流", "AI 与集成", "高级"]);
  await settingsPage.screenshot({ path: path.join(outputDirectory, "settings-wide.png") });
  if (settingsPage !== page) {
    await settingsPage.close();
    settingsPage = null;
  } else {
    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);
  }

  await page.evaluate(async () => {
    if (!window.app.workspace.leftSplit.collapsed) await window.app.commands.executeCommandById("app:toggle-left-sidebar");
    if (!window.app.workspace.rightSplit.collapsed) await window.app.commands.executeCommandById("app:toggle-right-sidebar");
  });
  await page.setViewportSize(narrowViewport);
  await openSection(page, "work");
  await page.waitForFunction(() => document.querySelector(".dashflow-shell")?.classList.contains("is-mobile"));
  const narrow = await inspectSurface(page);
  assert.equal(narrow.mobile, true);
  assert.equal(narrow.shellInsideViewport, true);
  assert.equal(narrow.viewportOverflow <= 1, true, `Narrow shell overflows by ${narrow.viewportOverflow}px`);
  assert.deepEqual(narrow.unnamedVisibleButtons, [], "Narrow Work exposes unnamed visible buttons");
  assert.equal(narrow.actions.every((action) => !action.missing && action.visible && action.insideShell && action.accessibleName), true);
  await page.screenshot({ path: path.join(outputDirectory, "work-narrow.png") });

  await page.locator(".dashflow-feature-action").click();
  await page.locator(".dashflow-feature-hub").waitFor({ state: "visible" });
  const narrowHubInsideViewport = await page.locator(".modal:has(.dashflow-feature-hub)").evaluate((modal) => {
    const rect = modal.getBoundingClientRect();
    return rect.left >= 0 && rect.right <= innerWidth && rect.top >= 0 && rect.bottom <= innerHeight;
  });
  assert.equal(narrowHubInsideViewport, true, "Narrow Feature Hub leaves the viewport");
  await page.screenshot({ path: path.join(outputDirectory, "feature-hub-narrow.png") });
  await closeOpenModals(page);

  assert.deepEqual(pageErrors, [], "UI smoke captured uncaught page errors");
  assert.deepEqual(consoleErrors, [], "UI smoke captured console errors");
  Object.assign(report, { plugin, today, work, featureCount, settingsTabs, narrow, narrowHubInsideViewport, pageErrors, consoleErrors, passed: true });
} catch (error) {
  Object.assign(report, {
    passed: false,
    error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : String(error),
    pageErrors,
    consoleErrors,
  });
  throw error;
} finally {
  if (page && !page.isClosed()) {
    try {
      await closeOpenModals(page);
      if (originalViewport) await page.setViewportSize(originalViewport);
      if (originalSidebars) {
        await page.evaluate(async (before) => {
          if (window.app.workspace.leftSplit.collapsed !== before.leftCollapsed) {
            await window.app.commands.executeCommandById("app:toggle-left-sidebar");
          }
          if (window.app.workspace.rightSplit.collapsed !== before.rightCollapsed) {
            await window.app.commands.executeCommandById("app:toggle-right-sidebar");
          }
        }, originalSidebars);
      }
      if (originalSection && sectionCommands[originalSection]) {
        await openSection(page, originalSection);
      } else if (originalLeafState) {
        await page.evaluate(async (originalLeafState) => {
          await window.app.workspace.activeLeaf?.setViewState(originalLeafState, { focus: true });
        }, originalLeafState);
      }
    } catch (cleanupError) {
      report.cleanupError = cleanupError instanceof Error ? cleanupError.message : String(cleanupError);
    }
  }
  if (settingsPage && settingsPage !== page && !settingsPage.isClosed()) await settingsPage.close().catch(() => undefined);
  report.finishedAt = new Date().toISOString();
  await writeFile(path.join(outputDirectory, "report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  if (browser) await browser.close().catch(() => undefined);
}

console.log(JSON.stringify(report, null, 2));

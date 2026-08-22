import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { DEFAULT_SETTINGS, SCHEMA_VERSION } from "../src/constants";

const capture = readFileSync("src/services/CaptureService.ts", "utf8");
const dailyNotes = readFileSync("src/services/DailyNoteService.ts", "utf8");
const context = readFileSync("src/services/ContextSwitcherService.ts", "utf8");
const renderer = readFileSync("src/dashboard/DashboardRenderer.ts", "utf8");
const settings = readFileSync("src/ui/WorkflowSettingsModal.ts", "utf8");
const picker = readFileSync("src/ui/CaptureDestinationModal.ts", "utf8");
const quickAdd = readFileSync("src/ui/QuickAddModal.ts", "utf8");
const main = readFileSync("src/main.ts", "utf8");
const commands = readFileSync("src/product/commandCatalog.ts", "utf8");

test("Quick Capture defaults remain backward compatible", () => {
  assert.equal(DEFAULT_SETTINGS.quickCaptureTarget, "inbox");
  assert.equal(DEFAULT_SETTINGS.dailyCaptureHeading, "## 闪念");
  assert.equal(DEFAULT_SETTINGS.contextMorningDashboardId, "home");
  assert.equal(DEFAULT_SETTINGS.contextWorkDashboardId, "");
  assert.equal(DEFAULT_SETTINGS.contextReviewDashboardId, "");
  assert.equal(SCHEMA_VERSION, 8);
});

test("Quick Capture can route to Inbox, Daily Note, or ask each time", () => {
  assert.ok(capture.includes('preference === "ask"'));
  assert.ok(capture.includes("CaptureDestinationModal.choose"));
  assert.ok(capture.includes('resolved === "daily-note"'));
  assert.ok(capture.includes("this.dailyNotes.appendCapture"));
  assert.ok(capture.includes("recordTaskCreated"));
  assert.ok(picker.includes('"inbox" | "daily-note"'));
  assert.ok(settings.includes('addOption("ask", "每次询问")'));
});

test("Daily Note capture uses safe process writes and preserves raw Markdown text", () => {
  assert.ok(dailyNotes.includes("this.app.vault.process"));
  assert.ok(dailyNotes.includes("const line = `- ${trimmed}`"));
  assert.ok(dailyNotes.includes("appendUnderHeading"));
  assert.equal(dailyNotes.includes("replace(/#[^"), false);
  assert.ok(quickAdd.includes("#标签 与 [[双链]] 会原样保留"));
});

test("Quick Add exposes one shared keyboard and pointer capture action", () => {
  assert.ok(quickAdd.includes("dashflow-quick-add-submit"));
  assert.ok(quickAdd.includes("submit.disabled = true"));
  assert.ok(quickAdd.includes('input.addEventListener("input"'));
  assert.ok(quickAdd.includes('submit.addEventListener("click", () => void capture())'));
  assert.ok(quickAdd.includes('event.key === "Enter"'));
  assert.ok(quickAdd.includes("void capture()"));
  assert.ok(quickAdd.includes('text: "更改目标"'));
  assert.ok(quickAdd.includes("dashflow-quick-add-section-label"));
  assert.ok(quickAdd.includes("更多创建方式"));
});

test("Morning Briefing and capture share the same Daily Note service", () => {
  const morning = readFileSync("src/services/MorningBriefingService.ts", "utf8");
  assert.ok(main.includes("this.dailyNotes = new DailyNoteService"));
  assert.ok(morning.includes("this.plugin.dailyNotes.path"));
  assert.ok(morning.includes("this.plugin.dailyNotes.read"));
  assert.ok(capture.includes("DailyNoteService"));
});

test("Context Switcher reuses DashboardManager instead of storing a second layout model", () => {
  assert.ok(renderer.includes("dashboardManager.subscribe(() => this.render())"));
  assert.ok(context.includes("dashboardRender.subscribe"));
  assert.ok(context.includes("dashboardManager.setActiveDashboard"));
  assert.ok(context.includes("contextMorningDashboardId"));
  assert.ok(context.includes("contextWorkDashboardId"));
  assert.ok(context.includes("contextReviewDashboardId"));
  assert.ok(settings.includes("this.plugin.dashboardManager.list()"));
  assert.equal(context.includes("new MutationObserver"), false);
  assert.equal(settings.includes("layouts:"), false);
});

test("layout editing exposes a labeled and confirmed card removal action", () => {
  assert.ok(renderer.includes('className = "dashflow-widget-remove"'));
  assert.ok(renderer.includes('remove.textContent = "移除"'));
  assert.ok(renderer.includes('remove.textContent = "再次确认"'));
  assert.ok(renderer.includes('remove.setAttribute("aria-label", "移除卡片")'));
});

test("workflow settings are exposed through plugin commands and lifecycle", () => {
  assert.ok(commands.includes("configure-workflow-context"));
  assert.ok(main.includes("COMMAND_CATALOG"));
  assert.ok(main.includes("this.contextSwitcher = new ContextSwitcherService(this)"));
  assert.ok(main.includes("this.contextSwitcher.start()"));
  assert.ok(main.includes("this.contextSwitcher?.stop()"));
});

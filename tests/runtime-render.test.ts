import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { DashboardRenderService } from "../src/services/DashboardRenderService";

const main = readFileSync("src/main.ts", "utf8");
const renderer = readFileSync("src/dashboard/DashboardRenderer.ts", "utf8");
const taskInteractions = readFileSync("src/services/TaskInteractionService.ts", "utf8");
const activityWidgets = readFileSync("src/services/ActivityWidgetInteractionService.ts", "utf8");
const habitWidgets = readFileSync("src/services/HabitWidgetInteractionService.ts", "utf8");
const calendarWidgets = readFileSync("src/services/CalendarWidgetInteractionService.ts", "utf8");
const weeklyReviewWidgets = readFileSync("src/services/WeeklyReviewWidgetInteractionService.ts", "utf8");
const aiNewsWidgets = readFileSync("src/services/AINewsWidgetInteractionService.ts", "utf8");
const dataFilterWidgets = readFileSync("src/services/DataFilterWidgetInteractionService.ts", "utf8");
const focusWidgets = readFileSync("src/services/FocusWidgetInteractionService.ts", "utf8");
const magicEmbedWidgets = readFileSync("src/services/MagicEmbedWidgetInteractionService.ts", "utf8");
const productExperience = readFileSync("src/services/ProductExperienceService.ts", "utf8");
const dashboardSwitcher = readFileSync("src/services/DashboardSwitcherInteractionService.ts", "utf8");
const dashboardTransfer = readFileSync("src/services/DashboardTransferInteractionService.ts", "utf8");
const contextSwitcher = readFileSync("src/services/ContextSwitcherService.ts", "utf8");

const renderDrivenServices: Array<[string, string]> = [
  ["TaskInteractionService", taskInteractions],
  ["ActivityWidgetInteractionService", activityWidgets],
  ["HabitWidgetInteractionService", habitWidgets],
  ["CalendarWidgetInteractionService", calendarWidgets],
  ["WeeklyReviewWidgetInteractionService", weeklyReviewWidgets],
  ["AINewsWidgetInteractionService", aiNewsWidgets],
  ["DataFilterWidgetInteractionService", dataFilterWidgets],
  ["FocusWidgetInteractionService", focusWidgets],
  ["MagicEmbedWidgetInteractionService", magicEmbedWidgets],
  ["ProductExperienceService", productExperience],
  ["DashboardSwitcherInteractionService", dashboardSwitcher],
  ["ContextSwitcherService", contextSwitcher],
];

test("dashboard render lifecycle tracks mounted roots and monotonic render sequence", () => {
  const service = new DashboardRenderService();
  const root = { isConnected: true } as HTMLElement;
  const sequences: number[] = [];
  const unsubscribe = service.subscribe((event) => {
    assert.equal(event.root, root);
    sequences.push(event.sequence);
  });

  service.rendered(root);
  service.rendered(root);
  assert.deepEqual(sequences, [1, 2]);
  assert.equal(service.rootCount(), 1);

  unsubscribe();
  service.unmount(root);
  assert.equal(service.rootCount(), 0);
});

test("DashboardRenderer coalesces requests to one animation frame and publishes after render", () => {
  assert.ok(renderer.includes("window.requestAnimationFrame"));
  assert.ok(renderer.includes("window.cancelAnimationFrame"));
  assert.ok(renderer.includes("this.plugin.dashboardManager.subscribe(() => this.render())"));
  assert.ok(renderer.includes("this.plugin.dashboardRender.rendered(this.container)"));
  assert.ok(renderer.includes("this.plugin.dashboardRender.unmount(this.container)"));
});

test("active dashboard decorators no longer observe document.body", () => {
  for (const [name, source] of [...renderDrivenServices, ["DashboardTransferInteractionService", dashboardTransfer] as const]) {
    assert.equal(source.includes("new MutationObserver"), false, name);
    assert.equal(source.includes("observe(document.body"), false, name);
  }
});

test("dashboard decorators subscribe to the render lifecycle and stay root-scoped", () => {
  for (const [name, source] of renderDrivenServices) {
    assert.ok(source.includes("dashboardRender.subscribe"), name);
    assert.ok(source.includes("root.querySelectorAll"), name);
    assert.equal(source.includes('workspace.on("layout-change"'), false, name);
    assert.equal(source.includes('workspace.on("active-leaf-change"'), false, name);
  }
});

test("product experience explicitly refreshes non-Vault Activity changes", () => {
  assert.ok(productExperience.includes("activityService.subscribe"));
  assert.ok(productExperience.includes("this.refresh(true)"));
  assert.equal(productExperience.includes("decorateSafely"), false);
});

test("dashboard transfer injection is an explicit manager-modal hook", () => {
  assert.ok(dashboardTransfer.includes("decorateManagerActions(root: ParentNode)"));
  assert.ok(dashboardSwitcher.includes("dashboardTransfer.decorateManagerActions(container)"));
  assert.ok(dashboardSwitcher.includes("dashflow-command-workspace"));
});

test("Visual Data Filter previews use the revision-aware query service", () => {
  assert.ok(dataFilterWidgets.includes("this.plugin.vaultQuery.filterData"));
  assert.equal(dataFilterWidgets.includes("filterVaultSnapshot("), false);
});

test("command workspace is created before switcher and context decorators subscribe", () => {
  const productStart = main.indexOf("this.productExperience.start();");
  const switcherStart = main.indexOf("this.dashboardSwitcher.start();");
  const contextStart = main.indexOf("this.contextSwitcher.start();");
  assert.ok(productStart >= 0 && switcherStart > productStart && contextStart > switcherStart);
});

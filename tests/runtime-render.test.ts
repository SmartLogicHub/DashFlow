import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { DashboardRenderService } from "../src/services/DashboardRenderService";

const renderer = readFileSync("src/dashboard/DashboardRenderer.ts", "utf8");
const taskInteractions = readFileSync("src/services/TaskInteractionService.ts", "utf8");
const activityWidgets = readFileSync("src/services/ActivityWidgetInteractionService.ts", "utf8");
const habitWidgets = readFileSync("src/services/HabitWidgetInteractionService.ts", "utf8");

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

test("migrated dashboard decorators do not observe document.body", () => {
  for (const [name, source] of [
    ["TaskInteractionService", taskInteractions],
    ["ActivityWidgetInteractionService", activityWidgets],
    ["HabitWidgetInteractionService", habitWidgets],
  ] as const) {
    assert.equal(source.includes("new MutationObserver"), false, name);
    assert.equal(source.includes("observe(document.body"), false, name);
    assert.ok(source.includes("dashboardRender.subscribe"), name);
    assert.ok(source.includes("root.querySelectorAll"), name);
  }
});

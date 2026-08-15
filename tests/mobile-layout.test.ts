import test from "node:test";
import assert from "node:assert/strict";
import type { WidgetInstance } from "../src/models";
import {
  desktopWidgetOrder,
  normalizeMobileOrder,
  reorderVisibleMobileOrder,
} from "../src/mobile/mobileLayout";

function widget(id: string, x: number, y: number): WidgetInstance {
  return {
    id,
    type: "test",
    layout: { x, y, w: 2, h: 2 },
    config: {},
  };
}

test("desktop widget order follows y then x", () => {
  const widgets = [widget("c", 6, 4), widget("b", 4, 0), widget("a", 0, 0)];
  assert.deepEqual(desktopWidgetOrder(widgets), ["a", "b", "c"]);
});

test("mobile order keeps valid stored ids and appends missing widgets", () => {
  const widgets = [widget("a", 0, 0), widget("b", 4, 0), widget("c", 0, 4)];
  assert.deepEqual(
    normalizeMobileOrder(widgets, ["c", "stale", "c", "a"]),
    ["c", "a", "b"],
  );
});

test("mobile reorder swaps adjacent visible cards without disturbing hidden positions", () => {
  const widgets = [widget("a", 0, 0), widget("hidden", 2, 0), widget("b", 4, 0), widget("c", 0, 4)];
  const order = ["a", "hidden", "b", "c"];
  const next = reorderVisibleMobileOrder(widgets, order, ["a", "b", "c"], "b", -1);
  assert.deepEqual(next, ["b", "hidden", "a", "c"]);
});

test("mobile reorder ignores moves beyond visible boundaries", () => {
  const widgets = [widget("a", 0, 0), widget("b", 4, 0)];
  assert.deepEqual(
    reorderVisibleMobileOrder(widgets, ["a", "b"], ["a", "b"], "a", -1),
    ["a", "b"],
  );
});

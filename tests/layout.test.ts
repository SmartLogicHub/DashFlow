import assert from "node:assert/strict";
import test from "node:test";
import type { WidgetInstance, WidgetLayout } from "../src/models";
import {
  compactWidgetLayout,
  findFirstAvailableLayout,
  hasLayoutCollisions,
  layoutsCollide,
  resolveWidgetLayout,
} from "../src/layout/grid";

function item(id: string, layout: WidgetLayout): WidgetInstance {
  return { id, type: "test", layout, config: {}, hidden: false };
}

function layoutOf(widgets: WidgetInstance[], id: string): WidgetLayout {
  const widget = widgets.find((entry) => entry.id === id);
  assert.ok(widget, `missing widget ${id}`);
  return widget.layout;
}

test("edge-touching cards do not collide", () => {
  assert.equal(layoutsCollide(
    { x: 0, y: 0, w: 4, h: 2 },
    { x: 4, y: 0, w: 4, h: 2 },
  ), false);
  assert.equal(layoutsCollide(
    { x: 0, y: 0, w: 4, h: 2 },
    { x: 3, y: 1, w: 4, h: 2 },
  ), true);
});

test("moving a card into another pushes the collided card down", () => {
  const widgets = [
    item("active", { x: 0, y: 0, w: 4, h: 2 }),
    item("below", { x: 0, y: 2, w: 4, h: 2 }),
    item("side", { x: 4, y: 4, w: 4, h: 2 }),
  ];

  const resolved = resolveWidgetLayout(
    widgets,
    "active",
    { x: 0, y: 2, w: 4, h: 2 },
    12,
  );

  assert.deepEqual(layoutOf(resolved, "active"), { x: 0, y: 2, w: 4, h: 2 });
  assert.deepEqual(layoutOf(resolved, "below"), { x: 0, y: 4, w: 4, h: 2 });
  assert.deepEqual(layoutOf(resolved, "side"), { x: 4, y: 0, w: 4, h: 2 });
  assert.equal(hasLayoutCollisions(resolved), false);
});

test("resizing a card cascades collisions without overlapping", () => {
  const widgets = [
    item("active", { x: 0, y: 0, w: 6, h: 2 }),
    item("second", { x: 0, y: 2, w: 6, h: 2 }),
    item("third", { x: 0, y: 4, w: 6, h: 2 }),
  ];

  const resolved = resolveWidgetLayout(
    widgets,
    "active",
    { x: 0, y: 0, w: 6, h: 4 },
    12,
  );

  assert.deepEqual(layoutOf(resolved, "active"), { x: 0, y: 0, w: 6, h: 4 });
  assert.deepEqual(layoutOf(resolved, "second"), { x: 0, y: 4, w: 6, h: 2 });
  assert.deepEqual(layoutOf(resolved, "third"), { x: 0, y: 6, w: 6, h: 2 });
  assert.equal(hasLayoutCollisions(resolved), false);
});

test("compaction repairs legacy overlaps and removes vertical gaps", () => {
  const compacted = compactWidgetLayout([
    item("a", { x: 0, y: 3, w: 4, h: 2 }),
    item("b", { x: 0, y: 3, w: 4, h: 2 }),
    item("c", { x: 4, y: 7, w: 4, h: 2 }),
  ], 12);

  assert.deepEqual(layoutOf(compacted, "a"), { x: 0, y: 0, w: 4, h: 2 });
  assert.deepEqual(layoutOf(compacted, "b"), { x: 0, y: 2, w: 4, h: 2 });
  assert.deepEqual(layoutOf(compacted, "c"), { x: 4, y: 0, w: 4, h: 2 });
  assert.equal(hasLayoutCollisions(compacted), false);
});

test("new widgets use the first free grid slot instead of always appending", () => {
  const layout = findFirstAvailableLayout([
    item("a", { x: 0, y: 0, w: 4, h: 2 }),
    item("b", { x: 8, y: 0, w: 4, h: 2 }),
  ], { w: 4, h: 2 }, 12);

  assert.deepEqual(layout, { x: 4, y: 0, w: 4, h: 2 });
});

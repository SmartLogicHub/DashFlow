import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const motion = readFileSync("src/styles/InteractionMotionStyles.ts", "utf8");
const design = readFileSync("src/services/DesignSystemService.ts", "utf8");
const builtins = readFileSync("src/widgets/builtins.ts", "utf8");
const renderer = readFileSync("src/dashboard/DashboardRenderer.ts", "utf8");

test("v0.4.4 motion layer is presentation-only and owned by DesignSystemService", () => {
  assert.ok(motion.includes("export const INTERACTION_MOTION_STYLES"));
  assert.equal(motion.includes("MutationObserver"), false);
  assert.equal(motion.includes("addEventListener("), false);
  assert.equal(motion.includes('from "../main"'), false);
  assert.ok(design.includes('import { INTERACTION_MOTION_STYLES } from "../styles/InteractionMotionStyles"'));
  assert.ok(design.includes("INTERACTION_MOTION_STYLES,"));
});

test("motion system covers entry hover drag numeric feedback and reduced motion", () => {
  assert.ok(motion.includes("--df-motion-fast"));
  assert.ok(motion.includes("--df-ease-spring"));
  assert.ok(motion.includes("@keyframes df-card-enter"));
  assert.ok(motion.includes(".dashflow-widget:hover"));
  assert.ok(motion.includes(".dashflow-widget.is-dragging"));
  assert.ok(motion.includes("@keyframes df-number-pop"));
  assert.ok(motion.includes("@media (prefers-reduced-motion: reduce)"));
});

test("drag feedback and performance stay scoped to the active card", () => {
  assert.ok(motion.includes("--df-card-drag-shadow"));
  assert.ok(motion.includes("will-change: transform"));
  assert.ok(motion.includes(".dashflow-widget.is-dragging::after"));
  assert.ok(motion.includes("cursor: grabbing"));
  assert.equal(motion.includes(".dashflow-widget {\n  will-change"), false);
});

test("resized cards use container queries for responsive information density", () => {
  assert.ok(motion.includes("container-type: inline-size"));
  assert.ok(motion.includes("@container (max-width: 220px)"));
  assert.ok(motion.includes("@container (max-width: 250px)"));
  assert.ok(motion.includes("@container (max-width: 280px)"));
  assert.ok(motion.includes("@container (min-width: 520px)"));
});

test("countdown remains independently configurable per widget instance", () => {
  assert.ok(builtins.includes('type: "countdown"'));
  assert.ok(builtins.includes('{ key: "title", type: "text"'));
  assert.ok(builtins.includes('{ key: "targetDate", type: "date"'));
  assert.ok(renderer.includes("const config = widget.config as CountdownWidgetConfig"));
  assert.ok(renderer.includes("config.targetDate"));
  assert.ok(renderer.includes("config.title ?? \"COUNTDOWN\""));
});

test("desktop drag and resize keep using persisted grid layout algorithms", () => {
  assert.ok(renderer.includes('mode: "move" | "resize"'));
  assert.ok(renderer.includes("moveLayout(initial"));
  assert.ok(renderer.includes("resizeLayout("));
  assert.ok(renderer.includes("resolveWidgetLayout("));
  assert.ok(renderer.includes("replaceWidgets(dashboard.id, previewWidgets)"));
});

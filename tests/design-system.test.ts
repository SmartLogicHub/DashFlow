import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const css = readFileSync("styles.css", "utf8");

test("design system exposes theme-aware semantic color tokens", () => {
  for (const token of [
    "--df-accent",
    "--df-info",
    "--df-success",
    "--df-warning",
    "--df-danger",
    "--df-surface-card",
  ]) {
    assert.ok(css.includes(token), token);
  }
  assert.match(css, /\.theme-dark\s+\.dashflow-view-container/);
  assert.match(css, /\.theme-light\s+\.dashflow-view-container/);
});

test("semantic widget states use Obsidian-derived success warning and danger tones", () => {
  assert.match(css, /dashflow-calendar-dot\.is-task-due[^}]*--df-danger/s);
  assert.match(css, /dashflow-calendar-dot\.is-project-deadline[^}]*--df-warning/s);
  assert.match(css, /dashflow-calendar-dot\.is-habit[^}]*--df-success/s);
  assert.match(css, /dashflow-habit-day\.is-done[^}]*--df-success/s);
  assert.match(css, /dashflow-weekly-badge\.is-overdue[^}]*--df-danger/s);
});

test("heatmap derives four intensity levels from the active accent", () => {
  for (const level of ["1", "2", "3", "4"]) {
    assert.ok(css.includes(`.dashflow-heatmap-cell[data-level="${level}"]`), level);
  }
  assert.match(css, /data-level="4"\][^{]*\{[^}]*var\(--df-accent\)/s);
});

test("design system includes keyboard focus and reduced-motion treatment", () => {
  assert.ok(css.includes(":focus-visible"));
  assert.ok(css.includes("@media (prefers-reduced-motion: reduce)"));
});

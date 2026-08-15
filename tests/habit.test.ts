import assert from "node:assert/strict";
import test from "node:test";
import type { Habit } from "../src/models";
import {
  habitCurrentStreak,
  habitHistory,
  habitScheduledOn,
  habitStats,
  habitTargetProgress,
} from "../src/habits/habitMath";

function habit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: "workout",
    name: "Workout",
    status: "active",
    frequency: "daily",
    tags: [],
    completedDates: [],
    source: { path: "Habits/Workout.md" },
    ...overrides,
  };
}

test("daily habit streak counts consecutive completed days", () => {
  const item = habit({
    start: "2026-08-01",
    completedDates: ["2026-08-13", "2026-08-14", "2026-08-15"],
  });
  assert.equal(habitCurrentStreak(item, "2026-08-15"), 3);
  assert.equal(habitCurrentStreak(item, "2026-08-16"), 0);
});

test("weekday habit skips weekends when calculating streak", () => {
  const item = habit({
    frequency: "weekdays",
    start: "2026-08-01",
    completedDates: ["2026-08-14", "2026-08-17"],
  });
  assert.equal(habitScheduledOn(item, "2026-08-15"), false);
  assert.equal(habitScheduledOn(item, "2026-08-16"), false);
  assert.equal(habitCurrentStreak(item, "2026-08-17"), 2);
});

test("habit stats and target progress use scheduled completion dates", () => {
  const item = habit({
    start: "2026-08-11",
    targetDays: 5,
    completedDates: ["2026-08-11", "2026-08-13", "2026-08-15"],
  });
  const stats = habitStats(item, 5, "2026-08-15");
  assert.equal(stats.scheduled, 5);
  assert.equal(stats.completed, 3);
  assert.equal(stats.rate, 60);
  assert.equal(habitTargetProgress(item, "2026-08-15"), 60);
});

test("habit history marks scheduled and completed states", () => {
  const item = habit({
    frequency: "weekdays",
    completedDates: ["2026-08-14"],
  });
  const history = habitHistory(item, 3, "2026-08-16");
  assert.deepEqual(history.map((day) => [day.date, day.scheduled, day.completed]), [
    ["2026-08-14", true, true],
    ["2026-08-15", false, false],
    ["2026-08-16", false, false],
  ]);
});

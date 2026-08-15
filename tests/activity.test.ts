import assert from "node:assert/strict";
import test from "node:test";
import type { ActivityStore } from "../src/models";
import {
  activityMetricValue,
  activityRange,
  activityScore,
  activityStreak,
  emptyDailyActivity,
} from "../src/activity/activityMath";

test("activity score weights completed tasks and note creation", () => {
  const day = emptyDailyActivity("2026-08-15");
  day.tasksCompleted = 2;
  day.tasksCreated = 1;
  day.notesCreated = 1;
  day.notesModified = 3;
  assert.equal(activityScore(day), 15);
  assert.equal(activityMetricValue(day, "tasks"), 3);
  assert.equal(activityMetricValue(day, "notes"), 4);
});

test("activity range fills missing dates with zero values", () => {
  const store: ActivityStore = { startedAt: "2026-08-01", days: {} };
  const day = emptyDailyActivity("2026-08-14");
  day.tasksCompleted = 1;
  store.days[day.date] = day;

  const range = activityRange(store, 3, "score", "2026-08-15");
  assert.deepEqual(range.map((point) => [point.date, point.value]), [
    ["2026-08-13", 0],
    ["2026-08-14", 4],
    ["2026-08-15", 0],
  ]);
});

test("activity streak counts consecutive active days backwards from the end date", () => {
  const store: ActivityStore = { startedAt: "2026-08-01", days: {} };
  for (const date of ["2026-08-13", "2026-08-14", "2026-08-15"]) {
    const day = emptyDailyActivity(date);
    day.notesModified = 1;
    store.days[date] = day;
  }
  assert.equal(activityStreak(store, "2026-08-15"), 3);
  assert.equal(activityStreak(store, "2026-08-16"), 0);
});

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import type { ActivityStore, Habit } from "../src/models";
import {
  activityChangePercent,
  shiftWeek,
  weekRange,
  weeklyActivityTotals,
  weeklyHabitStats,
} from "../src/weekly/weeklyReviewMath";

const weeklyService = readFileSync("src/services/WeeklyReviewService.ts", "utf8");
const weeklyWidget = readFileSync("src/services/WeeklyReviewWidgetInteractionService.ts", "utf8");

function habit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: "reading",
    name: "Read",
    status: "active",
    frequency: "daily",
    tags: [],
    completedDates: [],
    source: { path: "Habits/Read.md" },
    ...overrides,
  };
}

test("weekly review range respects Monday and Sunday week starts", () => {
  assert.deepEqual(weekRange("2026-08-15", "monday"), {
    start: "2026-08-10",
    end: "2026-08-16",
  });
  assert.deepEqual(weekRange("2026-08-15", "sunday"), {
    start: "2026-08-09",
    end: "2026-08-15",
  });
  assert.deepEqual(shiftWeek({ start: "2026-08-10", end: "2026-08-16" }, 1), {
    start: "2026-08-17",
    end: "2026-08-23",
  });
});

test("weekly activity aggregates score, active days and source counters", () => {
  const store: ActivityStore = {
    startedAt: "2026-08-01",
    days: {
      "2026-08-10": {
        date: "2026-08-10",
        notesCreated: 1,
        notesModified: 2,
        tasksCreated: 1,
        tasksCompleted: 2,
        habitsCompleted: 1,
        createdNoteKeys: [], modifiedNoteKeys: [], createdTaskKeys: [], completedTaskKeys: [], completedHabitKeys: [],
      },
      "2026-08-12": {
        date: "2026-08-12",
        notesCreated: 0,
        notesModified: 1,
        tasksCreated: 0,
        tasksCompleted: 1,
        habitsCompleted: 2,
        createdNoteKeys: [], modifiedNoteKeys: [], createdTaskKeys: [], completedTaskKeys: [], completedHabitKeys: [],
      },
    },
  };

  const totals = weeklyActivityTotals(store, { start: "2026-08-10", end: "2026-08-16" });
  assert.equal(totals.activeDays, 2);
  assert.equal(totals.tasksCompleted, 3);
  assert.equal(totals.tasksCreated, 1);
  assert.equal(totals.habitChecks, 3);
  assert.equal(totals.notesTouched, 4);
  assert.equal(totals.score, 28);
  assert.equal(activityChangePercent(150, 100), 50);
  assert.equal(activityChangePercent(5, 0), null);
  assert.equal(activityChangePercent(0, 0), 0);
});

test("weekly habit stats respect weekday schedules", () => {
  const stats = weeklyHabitStats(habit({
    frequency: "weekdays",
    start: "2026-08-10",
    completedDates: ["2026-08-10", "2026-08-11", "2026-08-13"],
  }), { start: "2026-08-10", end: "2026-08-16" });

  assert.deepEqual(stats, {
    scheduled: 5,
    completed: 3,
    rate: 60,
  });
});

test("Daily Progress reuses schedule math but is reported separately from Habit", () => {
  const stats = weeklyHabitStats(habit({
    kind: "daily-progress",
    start: "2026-08-12",
    end: "2026-08-15",
    completedDates: ["2026-08-12", "2026-08-14"],
    dailyNotes: {
      "2026-08-12": "完成第一阶段",
      "2026-08-14": "解决阻塞问题",
    },
  }), { start: "2026-08-10", end: "2026-08-16" });

  assert.deepEqual(stats, { scheduled: 4, completed: 2, rate: 50 });
  assert.ok(weeklyService.includes('habit.kind !== "daily-progress"'));
  assert.ok(weeklyService.includes('habit.kind === "daily-progress"'));
  assert.ok(weeklyService.includes("dailyProgressNoteCount"));
  assert.ok(weeklyService.includes('"### Daily Progress"'));
  assert.ok(weeklyWidget.includes("dailyProgressSection"));
  assert.ok(weeklyWidget.includes("dailyProgressRow"));
  assert.ok(weeklyWidget.includes("is-progress"));
});

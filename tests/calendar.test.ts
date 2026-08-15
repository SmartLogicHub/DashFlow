import assert from "node:assert/strict";
import test from "node:test";
import type { CalendarWidgetConfig, VaultSnapshot } from "../src/models";
import { calendarMonthGrid, shiftCalendarMonth } from "../src/calendar/calendarMath";
import { CalendarService } from "../src/services/CalendarService";

test("calendar month grid always returns six weeks and respects Monday start", () => {
  const grid = calendarMonthGrid("2026-08", "monday", "2026-08-15");
  assert.equal(grid.length, 42);
  assert.equal(grid[0].date, "2026-07-27");
  assert.equal(grid[41].date, "2026-09-06");
  assert.equal(grid.find((cell) => cell.today)?.date, "2026-08-15");
});

test("calendar month grid supports Sunday start and month shifting", () => {
  const grid = calendarMonthGrid("2026-08", "sunday", "2026-08-15");
  assert.equal(grid[0].date, "2026-07-26");
  assert.equal(shiftCalendarMonth("2026-12", 1), "2027-01");
  assert.equal(shiftCalendarMonth("2026-01", -1), "2025-12");
});

test("calendar service unifies task, project and habit dates", () => {
  const snapshot: VaultSnapshot = {
    revision: 1,
    notes: 4,
    tasks: [
      {
        id: "task-1",
        text: "发布 Calendar",
        completed: false,
        due: "2026-08-20",
        scheduled: "2026-08-18",
        priority: "high",
        tags: [],
        source: { path: "Tasks.md", line: 0, raw: "- [ ] 发布 Calendar" },
      },
      {
        id: "task-2",
        text: "已完成",
        completed: true,
        due: "2026-08-20",
        priority: "normal",
        tags: [],
        source: { path: "Tasks.md", line: 1, raw: "- [x] 已完成" },
      },
    ],
    projects: [
      {
        id: "dashflow",
        name: "DashFlow",
        status: "active",
        deadline: "2026-08-31",
        tags: [],
        progressMode: "tasks",
        source: { path: "Projects/DashFlow.md" },
      },
    ],
    habits: [
      {
        id: "workout",
        name: "运动",
        status: "active",
        frequency: "weekdays",
        tags: [],
        completedDates: ["2026-08-17"],
        source: { path: "Habits/Workout.md" },
      },
    ],
  };
  const index = { getSnapshot: () => snapshot };
  const service = new CalendarService(index as never);
  const config: CalendarWidgetConfig = {
    weekStart: "monday",
    showTasks: true,
    showProjects: true,
    showHabits: true,
    showCompletedTasks: false,
    agendaLimit: 12,
  };

  const events = service.eventsBetween("2026-08-17", "2026-08-31", config);
  assert.ok(events.some((event) => event.kind === "task-scheduled" && event.date === "2026-08-18"));
  assert.ok(events.some((event) => event.kind === "task-due" && event.date === "2026-08-20"));
  assert.ok(events.some((event) => event.kind === "project-deadline" && event.date === "2026-08-31"));
  assert.ok(events.some((event) => event.kind === "habit" && event.date === "2026-08-17" && event.completed));
  assert.equal(events.filter((event) => event.entityId === "task-2").length, 0);

  const withCompleted = service.eventsBetween("2026-08-20", "2026-08-20", { ...config, showCompletedTasks: true });
  assert.equal(withCompleted.filter((event) => event.kind === "task-due").length, 2);
});

import test from "node:test";
import assert from "node:assert/strict";
import { inboxTasks, sectionWidgetTypes, todaySummary } from "../src/product/navigation";
import type { Habit, Task, VaultSnapshot } from "../src/models";

function task(id: string, sourcePath: string, extra: Partial<Task> = {}): Task {
  return {
    id,
    text: id,
    completed: false,
    priority: "normal",
    tags: [],
    source: { path: sourcePath, line: 0, raw: `- [ ] ${id}` },
    ...extra,
  };
}

function habit(id: string, extra: Partial<Habit> = {}): Habit {
  return {
    id,
    name: id,
    status: "active",
    frequency: "daily",
    tags: [],
    completedDates: [],
    source: { path: `Habits/${id}.md` },
    ...extra,
  };
}

test("Personal Home is separate from the dense Work dashboard", () => {
  assert.deepEqual(sectionWidgetTypes("today"), []);
  assert.deepEqual(sectionWidgetTypes("work"), ["quick-capture", "tasks", "progress", "projects", "upcoming", "heatmap", "countdown"]);
  assert.equal(sectionWidgetTypes("work").includes("weekly-review"), false);
  assert.equal(sectionWidgetTypes("work").includes("vault-stats"), false);
});

test("Inbox contains only genuinely unprocessed open tasks", () => {
  const tasks = [
    task("raw", "DashFlow/Inbox.md"),
    task("done", "DashFlow/Inbox.md", { completed: true }),
    task("other-file", "Projects/Alpha.md"),
    task("scheduled", "DashFlow/Inbox.md", { scheduled: "2026-08-16" }),
    task("project", "DashFlow/Inbox.md", { projectId: "alpha" }),
    task("due", "DashFlow/Inbox.md", { due: "2026-08-20" }),
  ];
  assert.deepEqual(inboxTasks(tasks, "DashFlow/Inbox.md").map((item) => item.id), ["raw"]);
});

test("Today summary deduplicates due/scheduled focus and includes overdue and habit cadence", () => {
  const snapshot: VaultSnapshot = {
    revision: 1,
    notes: 0,
    tasks: [
      task("both", "Inbox.md", { due: "2026-08-18", scheduled: "2026-08-18" }),
      task("scheduled", "Inbox.md", { scheduled: "2026-08-18" }),
      task("overdue", "Inbox.md", { due: "2026-08-17" }),
      task("future", "Inbox.md", { due: "2026-08-19" }),
    ],
    projects: [
      { id: "p1", name: "P1", status: "active", tags: [], progressMode: "tasks", source: { path: "P1.md" } },
      { id: "p2", name: "P2", status: "paused", tags: [], progressMode: "tasks", source: { path: "P2.md" } },
    ],
    habits: [
      habit("daily", { completedDates: ["2026-08-18"] }),
      habit("weekday", { frequency: "weekdays" }),
      habit("future", { start: "2026-08-19" }),
    ],
  };

  const summary = todaySummary(snapshot, "2026-08-18");
  assert.equal(summary.focus, 3);
  assert.equal(summary.overdue, 1);
  assert.equal(summary.projects, 1);
  assert.equal(summary.habitsScheduled, 2);
  assert.equal(summary.habitsDone, 1);
});

test("weekday habits stay out of weekend Today summaries", () => {
  const snapshot: VaultSnapshot = {
    revision: 1,
    notes: 0,
    tasks: [],
    projects: [],
    habits: [habit("weekday", { frequency: "weekdays", completedDates: ["2026-08-16"] })],
  };
  const summary = todaySummary(snapshot, "2026-08-16");
  assert.equal(summary.habitsScheduled, 0);
  assert.equal(summary.habitsDone, 0);
});

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import type { VaultSnapshot } from "../src/models";
import {
  DEFAULT_DATA_FILTER_CONFIG,
  filterVaultSnapshot,
  normalizeDataFilterConfig,
} from "../src/filter/dataFilter";

const registry = readFileSync("src/widgets/data.ts", "utf8");
const interaction = readFileSync("src/services/DataFilterWidgetInteractionService.ts", "utf8");
const vaultIndex = readFileSync("src/services/VaultIndexService.ts", "utf8");
const design = readFileSync("src/services/DesignSystemService.ts", "utf8");
const styles = readFileSync("src/styles/DataFilterStyles.ts", "utf8");
const main = readFileSync("src/main.ts", "utf8");

const snapshot: VaultSnapshot = {
  revision: 7,
  notes: 12,
  tasks: [
    {
      id: "t1", text: "Ship AI filter", completed: false, due: "2026-08-15", priority: "high",
      tags: ["work", "ai"], projectId: "dashflow", source: { path: "Tasks.md" },
    },
    {
      id: "t2", text: "Review inbox", completed: false, scheduled: "2026-08-16", priority: "normal",
      tags: ["inbox"], source: { path: "Tasks.md" },
    },
    {
      id: "t3", text: "Old completed task", completed: true, due: "2026-08-14", priority: "normal",
      tags: ["done"], source: { path: "Tasks.md" },
    },
    {
      id: "t4", text: "Research local models", completed: false, priority: "normal",
      tags: ["AI"], source: { path: "Research.md" },
    },
  ],
  projects: [
    {
      id: "dashflow", name: "DashFlow", description: "Personal OS", status: "active", deadline: "2026-08-20",
      tags: ["ai"], progressMode: "tasks", source: { path: "DashFlow.md" },
    },
    {
      id: "legacy", name: "Legacy migration", status: "completed", deadline: "2026-08-10",
      tags: ["done"], progressMode: "manual", manualProgress: 100, source: { path: "Legacy.md" },
    },
    {
      id: "archive", name: "Archived idea", status: "archived", tags: ["old"], progressMode: "tasks",
      source: { path: "Archive.md" },
    },
  ],
  habits: [
    {
      id: "run", name: "Run", status: "active", frequency: "daily", end: "2026-08-30", tags: ["health"],
      completedDates: [], source: { path: "Run.md" },
    },
    {
      id: "ai-reading", name: "AI Reading", status: "completed", frequency: "daily", end: "2026-08-15", tags: ["ai"],
      completedDates: ["2026-08-15"], source: { path: "AI Reading.md" },
    },
    {
      id: "old-habit", name: "Old Habit", status: "archived", frequency: "daily", tags: ["old"],
      completedDates: [], source: { path: "Old Habit.md" },
    },
  ],
};

const noteSnapshot: VaultSnapshot = {
  ...snapshot,
  notes: 3,
  noteRecords: [
    {
      path: "Journal/2026-08-16.md",
      name: "2026-08-16",
      folder: "Journal",
      tags: ["ai", "daily"],
      frontmatter: { type: "daily", status: "active", mood: "focused" },
      taskTotal: 2,
      taskCompleted: 1,
      createdAt: Date.parse("2026-08-16T07:00:00"),
      modifiedAt: Date.parse("2026-08-16T12:00:00"),
    },
    {
      path: "Projects/DashFlow/Architecture.md",
      name: "Architecture",
      folder: "Projects/DashFlow",
      tags: ["work"],
      frontmatter: { type: "reference", status: "active", area: "work" },
      taskTotal: 2,
      taskCompleted: 2,
      createdAt: Date.parse("2026-08-10T07:00:00"),
      modifiedAt: Date.parse("2026-08-15T12:00:00"),
    },
    {
      path: "Archive/Old.md",
      name: "Old",
      folder: "Archive",
      tags: ["old"],
      frontmatter: { status: "archived" },
      taskTotal: 0,
      taskCompleted: 0,
      createdAt: Date.parse("2025-01-01T07:00:00"),
      modifiedAt: Date.parse("2026-08-14T12:00:00"),
    },
  ],
};

test("default data filter shows active cross-entity results from the live snapshot", () => {
  const view = filterVaultSnapshot(snapshot, DEFAULT_DATA_FILTER_CONFIG, "2026-08-16");
  assert.equal(view.total, 5);
  assert.deepEqual(view.counts, { note: 0, task: 3, project: 1, habit: 1 });
  assert.deepEqual(view.items.map((item) => item.title), [
    "Ship AI filter",
    "Review inbox",
    "DashFlow",
    "Run",
    "Research local models",
  ]);
});

test("data filter composes entity state date query and exact normalized tag", () => {
  const view = filterVaultSnapshot(snapshot, {
    entity: "task",
    state: "active",
    dateRange: "overdue",
    query: "ship ai",
    tag: "#AI",
    sort: "date",
    limit: 20,
  }, "2026-08-16");
  assert.equal(view.total, 1);
  assert.equal(view.items[0]?.kind, "task");
  assert.equal(view.items[0]?.title, "Ship AI filter");
});

test("completed and no-date filters keep entity semantics separate", () => {
  const completed = filterVaultSnapshot(snapshot, {
    ...DEFAULT_DATA_FILTER_CONFIG,
    state: "completed",
  }, "2026-08-16");
  assert.deepEqual(completed.items.map((item) => item.title), ["Legacy migration", "Old completed task", "AI Reading"]);

  const noDate = filterVaultSnapshot(snapshot, {
    ...DEFAULT_DATA_FILTER_CONFIG,
    dateRange: "none",
  }, "2026-08-16");
  assert.deepEqual(noDate.items.map((item) => item.title), ["Research local models"]);
});

test("next-seven-days range includes today and excludes later dates", () => {
  const view = filterVaultSnapshot(snapshot, {
    ...DEFAULT_DATA_FILTER_CONFIG,
    dateRange: "next7",
  }, "2026-08-16");
  assert.deepEqual(view.items.map((item) => item.title), ["Review inbox", "DashFlow"]);
});

test("Note filter composes folder frontmatter and completed task status", () => {
  const view = filterVaultSnapshot(noteSnapshot, {
    ...DEFAULT_DATA_FILTER_CONFIG,
    entity: "note",
    state: "all",
    folder: "Projects",
    frontmatter: "status=active",
    noteTaskStatus: "completed",
    query: "architecture",
  }, "2026-08-16");
  assert.equal(view.total, 1);
  assert.equal(view.items[0]?.kind, "note");
  assert.equal(view.items[0]?.title, "Architecture");
});

test("Note filter supports normalized tags, frontmatter key presence and pending tasks", () => {
  const pending = filterVaultSnapshot(noteSnapshot, {
    ...DEFAULT_DATA_FILTER_CONFIG,
    entity: "note",
    tag: "#AI",
    frontmatter: "mood",
    noteTaskStatus: "pending",
  }, "2026-08-16");
  assert.deepEqual(pending.items.map((item) => item.title), ["2026-08-16"]);

  const noTasks = filterVaultSnapshot(noteSnapshot, {
    ...DEFAULT_DATA_FILTER_CONFIG,
    entity: "note",
    noteTaskStatus: "none",
  }, "2026-08-16");
  assert.deepEqual(noTasks.items.map((item) => item.title), ["Old"]);
});

test("data filter config normalization rejects unknown modes and caps result count", () => {
  const config = normalizeDataFilterConfig({
    entity: "wrong" as never,
    state: "wrong" as never,
    dateRange: "wrong" as never,
    noteTaskStatus: "wrong" as never,
    sort: "wrong" as never,
    query: "  hello world  ",
    tag: "  #ai  ",
    folder: " /Projects/DashFlow/ ",
    frontmatter: " status=active ",
    limit: 999,
  });
  assert.equal(config.entity, "all");
  assert.equal(config.state, "active");
  assert.equal(config.dateRange, "all");
  assert.equal(config.noteTaskStatus, "all");
  assert.equal(config.sort, "date");
  assert.equal(config.query, "hello world");
  assert.equal(config.tag, "#ai");
  assert.equal(config.folder, "Projects/DashFlow");
  assert.equal(config.frontmatter, "status=active");
  assert.equal(config.limit, 100);
});

test("VaultIndex derives normalized Note records without replacing Markdown truth", () => {
  assert.ok(vaultIndex.includes("noteByPath"));
  assert.ok(vaultIndex.includes("normalizeFrontmatter"));
  assert.ok(vaultIndex.includes("collectTags"));
  assert.ok(vaultIndex.includes("taskTotal: tasks.length"));
  assert.ok(vaultIndex.includes("taskCompleted: tasks.filter"));
  assert.ok(vaultIndex.includes("noteRecords: [...this.noteByPath.values()]"));
});

test("Visual Data Filter is a persisted Dashboard widget without a second data store", () => {
  assert.ok(registry.includes('type: "data-filter"'));
  assert.ok(registry.includes("DEFAULT_DATA_FILTER_CONFIG"));
  assert.ok(registry.includes('key: "limit"'));
  assert.ok(main.includes("registerDataWidgets(this.widgetRegistry)"));
  assert.ok(interaction.includes("this.plugin.vaultIndex.getSnapshot()"));
  assert.ok(interaction.includes("dashboardManager.updateWidget"));
  assert.ok(interaction.includes("筛选文件夹"));
  assert.ok(interaction.includes("筛选 frontmatter"));
  assert.ok(interaction.includes("笔记任务状态"));
  assert.equal(interaction.includes("saveData("), false);
  assert.equal(interaction.includes("new MutationObserver"), false);
});

test("Visual Data Filter reuses existing editors, native note opening and centralized Design System", () => {
  assert.ok(interaction.includes("TaskEditorModal"));
  assert.ok(interaction.includes("ProjectDetailModal"));
  assert.ok(interaction.includes("HabitEditorModal"));
  assert.ok(interaction.includes("openLinkText(match.item.path"));
  assert.ok(styles.includes("dashflow-data-filter-result"));
  assert.ok(styles.includes("dashflow-data-filter-advanced"));
  assert.ok(design.includes('import { DATA_FILTER_STYLES }'));
  assert.ok(design.includes("DATA_FILTER_STYLES,"));
  assert.equal(interaction.includes('document.createElement("style")'), false);
});

test("Visual Data Filter interaction is lifecycle-managed", () => {
  assert.ok(main.includes("this.dataFilterWidgets = new DataFilterWidgetInteractionService(this)"));
  assert.ok(main.includes("this.dataFilterWidgets.start()"));
  assert.ok(main.includes("this.dataFilterWidgets?.stop()"));
});

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import type { Project, Task, VaultSnapshot } from "../src/models";
import { VaultQueryService } from "../src/services/VaultQueryService";

function task(id: string, overrides: Partial<Task> = {}): Task {
  return {
    id,
    text: `Task ${id}`,
    completed: false,
    priority: "normal",
    tags: [],
    source: { path: `Tasks/${id}.md`, line: 0, raw: `- [ ] Task ${id}` },
    ...overrides,
  };
}

function project(id: string, overrides: Partial<Project> = {}): Project {
  return {
    id,
    name: `Project ${id}`,
    status: "active",
    tags: [],
    progressMode: "tasks",
    source: { path: `Projects/${id}.md` },
    ...overrides,
  };
}

function snapshot(revision: number): VaultSnapshot {
  return {
    revision,
    notes: 2,
    noteRecords: [
      {
        path: "Notes/AI.md",
        name: "AI",
        folder: "Notes",
        tags: ["ai"],
        frontmatter: { status: "active" },
        taskTotal: 1,
        taskCompleted: 0,
        createdAt: Date.parse("2026-08-01"),
        modifiedAt: Date.parse("2026-08-16"),
      },
      {
        path: "Notes/Done.md",
        name: "Done",
        folder: "Notes",
        tags: [],
        frontmatter: {},
        taskTotal: 1,
        taskCompleted: 1,
        createdAt: Date.parse("2026-08-01"),
        modifiedAt: Date.parse("2026-08-15"),
      },
    ],
    tasks: [
      task("a", { text: "Ship AI dashboard", projectId: "dashflow", due: "2026-08-16" }),
      task("b", { text: "Write tests", projectId: "dashflow", completed: true, due: "2026-08-15" }),
      task("c", { text: "Future", due: "2026-08-20" }),
    ],
    projects: [project("dashflow", { name: "DashFlow" })],
    habits: [],
  };
}

test("same revision reuses derived task, search and filter results", () => {
  let current = snapshot(1);
  const query = new VaultQueryService(() => current);

  const todayA = query.todayTasks("2026-08-16");
  const todayB = query.todayTasks("2026-08-16");
  assert.strictEqual(todayA, todayB);

  const searchA = query.search("AI dashboard");
  const searchB = query.search("  ai   DASHBOARD  ");
  assert.strictEqual(searchA, searchB);
  assert.equal(searchA[0]?.kind, "task");

  const filterA = query.filterData({ entity: "note", tag: "ai" }, "2026-08-16");
  const filterB = query.filterData({ entity: "note", tag: "ai" }, "2026-08-16");
  assert.strictEqual(filterA, filterB);
  assert.equal(filterA.total, 1);

  current = { ...current, revision: 2, tasks: [...current.tasks, task("d", { due: "2026-08-16" })] };
  const todayAfterRevision = query.todayTasks("2026-08-16");
  assert.notStrictEqual(todayA, todayAfterRevision);
  assert.equal(todayAfterRevision.length, 2);
});

test("project task lookup and progress are derived in one revision index", () => {
  const current = snapshot(1);
  const query = new VaultQueryService(() => current);
  const dashflow = current.projects[0] as Project;

  const tasks = query.tasksForProject("dashflow");
  assert.deepEqual(tasks.map((item) => item.id), ["a", "b"]);
  assert.equal(query.projectProgress(dashflow), 50);
  assert.equal(query.projectProgress(project("manual", { progressMode: "manual", manualProgress: 73 })), 73);
});

test("large snapshots keep query caches bounded by revision instead of persistent data duplication", () => {
  const tasks = Array.from({ length: 12_000 }, (_, index) => task(`bulk-${index}`, {
    projectId: `p-${index % 200}`,
    due: index % 2 === 0 ? "2026-08-16" : "2026-08-20",
    tags: index % 3 === 0 ? ["ai"] : [],
  }));
  const projects = Array.from({ length: 200 }, (_, index) => project(`p-${index}`));
  const current: VaultSnapshot = { revision: 10, notes: 0, noteRecords: [], tasks, projects, habits: [] };
  const query = new VaultQueryService(() => current);

  assert.equal(query.todayTasks("2026-08-16").length, 6_000);
  assert.equal(query.tasksForProject("p-42").length, 60);
  assert.ok(query.search("bulk-42").length > 0);
});

test("production query path removes repeated full scans and bounds event pressure", () => {
  const main = readFileSync("src/main.ts", "utf8");
  const index = readFileSync("src/services/VaultIndexService.ts", "utf8");
  const queries = readFileSync("src/services/VaultQueryService.ts", "utf8");
  const projects = readFileSync("src/services/ProjectService.ts", "utf8");
  const search = readFileSync("src/ui/GlobalSearchModal.ts", "utf8");
  const calendar = readFileSync("src/services/CalendarService.ts", "utf8");
  const filter = readFileSync("src/filter/dataFilter.ts", "utf8");

  assert.ok(main.includes("new VaultQueryService"));
  assert.ok(projects.includes("this.query.tasksForProject"));
  assert.ok(projects.includes("this.query.projectProgress"));
  assert.ok(search.includes("this.plugin.vaultQuery.search(query)"));
  assert.ok(index.includes("INDEX_CONCURRENCY = 8"));
  assert.ok(index.includes("scheduleFile(file)"));
  assert.ok(index.includes("fileTimers"));
  assert.ok(queries.includes("MAX_DYNAMIC_CACHE = 64"));
  assert.ok(calendar.includes("MAX_CALENDAR_CACHE = 32"));
  assert.ok(filter.includes("SNAPSHOT_INDEX_CACHE = new WeakMap"));
  assert.equal(index.includes("Promise.all(files.map((file) => this.indexFile(file, false)))"), false);
});

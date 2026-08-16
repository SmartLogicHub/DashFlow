import type { DataFilterWidgetConfig, Habit, Project, Task, VaultSnapshot } from "../models";
import {
  buildDataFilterIndex,
  filterDataFilterIndex,
  normalizeDataFilterConfig,
  type DataFilterIndex,
  type DataFilterView,
} from "../filter/dataFilter";
import { addDays } from "../utils/date";

const PRIORITY_WEIGHT = { urgent: 0, high: 1, normal: 2, low: 3 } as const;
const MAX_DYNAMIC_CACHE = 64;

export type VaultSearchHit =
  | { kind: "task"; task: Task }
  | { kind: "project"; project: Project }
  | { kind: "habit"; habit: Habit };

export interface VaultQueryCounts {
  pendingTasks: number;
  completedTasks: number;
  datedOpenTasks: number;
  activeProjects: number;
}

interface SearchRow<T> {
  item: T;
  searchText: string;
}

interface ProjectTaskStats {
  tasks: Task[];
  completed: number;
}

function taskDate(task: Task): string {
  return task.scheduled ?? task.due ?? "9999";
}

function sortTasks(a: Task, b: Task): number {
  return taskDate(a).localeCompare(taskDate(b))
    || (a.due ?? "9999").localeCompare(b.due ?? "9999")
    || PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]
    || a.text.localeCompare(b.text);
}

function normalizeSearchQuery(query: string): string {
  return query.trim().toLocaleLowerCase().replace(/\s+/g, " ");
}

function matchesSearch(searchText: string, normalizedQuery: string): boolean {
  if (!normalizedQuery) return true;
  return normalizedQuery.split(" ").every((needle) => searchText.includes(needle));
}

function boundedSet<K, V>(cache: Map<K, V>, key: K, value: V): V {
  cache.set(key, value);
  if (cache.size > MAX_DYNAMIC_CACHE) {
    const oldest = cache.keys().next().value as K | undefined;
    if (oldest !== undefined) cache.delete(oldest);
  }
  return value;
}

/**
 * Revision-aware, in-memory query layer over VaultSnapshot.
 *
 * The VaultIndex remains the source of truth. This service only keeps derived structures for
 * the current snapshot revision, so a Vault change invalidates every cached query atomically.
 */
export class VaultQueryService {
  private revision = -1;
  private snapshot: VaultSnapshot | null = null;
  private projectTaskStats = new Map<string, ProjectTaskStats>();
  private activeProjects: Project[] = [];
  private allProjects: Project[] = [];
  private activeHabits: Habit[] = [];
  private activeAndPausedHabits: Habit[] = [];
  private counts: VaultQueryCounts = { pendingTasks: 0, completedTasks: 0, datedOpenTasks: 0, activeProjects: 0 };
  private taskSearchRows: Array<SearchRow<Task>> = [];
  private projectSearchRows: Array<SearchRow<Project>> = [];
  private habitSearchRows: Array<SearchRow<Habit>> = [];
  private dataFilterIndex: DataFilterIndex | null = null;
  private taskCache = new Map<string, Task[]>();
  private searchCache = new Map<string, VaultSearchHit[]>();
  private dataFilterCache = new Map<string, DataFilterView>();

  constructor(private readonly getSnapshot: () => VaultSnapshot) {}

  getRevision(): number {
    this.ensureRevision();
    return this.revision;
  }

  getCounts(): VaultQueryCounts {
    this.ensureRevision();
    return this.counts;
  }

  todayTasks(today: string): Task[] {
    const snapshot = this.ensureRevision();
    const key = `today:${today}`;
    const cached = this.taskCache.get(key);
    if (cached) return cached;
    return boundedSet(this.taskCache, key, snapshot.tasks
      .filter((task) => task.due === today || task.scheduled === today)
      .sort(sortTasks));
  }

  focusTasks(today: string): Task[] {
    const snapshot = this.ensureRevision();
    const key = `focus:${today}`;
    const cached = this.taskCache.get(key);
    if (cached) return cached;
    const byId = new Map<string, Task>();
    for (const task of snapshot.tasks) {
      if (task.completed) continue;
      if (task.due === today || task.scheduled === today || (task.due && task.due < today)) byId.set(task.id, task);
    }
    const result = [...byId.values()].sort((a, b) => {
      const overdueA = Boolean(a.due && a.due < today);
      const overdueB = Boolean(b.due && b.due < today);
      return Number(overdueB) - Number(overdueA) || sortTasks(a, b);
    });
    return boundedSet(this.taskCache, key, result);
  }

  overdueTasks(today: string): Task[] {
    const snapshot = this.ensureRevision();
    const key = `overdue:${today}`;
    const cached = this.taskCache.get(key);
    if (cached) return cached;
    return boundedSet(this.taskCache, key, snapshot.tasks
      .filter((task) => !task.completed && Boolean(task.due) && (task.due as string) < today)
      .sort(sortTasks));
  }

  upcomingTasks(today: string, days: number): Task[] {
    const snapshot = this.ensureRevision();
    const safeDays = Math.max(0, Math.min(366, Math.round(days)));
    const key = `upcoming:${today}:${safeDays}`;
    const cached = this.taskCache.get(key);
    if (cached) return cached;
    const end = addDays(today, safeDays);
    return boundedSet(this.taskCache, key, snapshot.tasks
      .filter((task) => {
        if (task.completed) return false;
        return Boolean(
          (task.scheduled && task.scheduled >= today && task.scheduled <= end)
          || (task.due && task.due >= today && task.due <= end),
        );
      })
      .sort(sortTasks));
  }

  tasksForProject(projectId: string): Task[] {
    this.ensureRevision();
    return this.projectTaskStats.get(projectId)?.tasks ?? [];
  }

  projectProgress(project: Project): number {
    this.ensureRevision();
    if (project.progressMode === "manual" && project.manualProgress !== undefined) return project.manualProgress;
    const stats = this.projectTaskStats.get(project.id);
    if (!stats || stats.tasks.length === 0) return 0;
    return Math.round((stats.completed / stats.tasks.length) * 100);
  }

  getActiveProjects(): Project[] {
    this.ensureRevision();
    return this.activeProjects;
  }

  getAllProjects(): Project[] {
    this.ensureRevision();
    return this.allProjects;
  }

  getActiveHabits(includePaused = false): Habit[] {
    this.ensureRevision();
    return includePaused ? this.activeAndPausedHabits : this.activeHabits;
  }

  search(query: string): VaultSearchHit[] {
    this.ensureRevision();
    const normalized = normalizeSearchQuery(query);
    const cached = this.searchCache.get(normalized);
    if (cached) return cached;
    const hasQuery = normalized.length > 0;
    const results: VaultSearchHit[] = [];

    let taskCount = 0;
    for (const row of this.taskSearchRows) {
      if (!matchesSearch(row.searchText, normalized)) continue;
      results.push({ kind: "task", task: row.item });
      taskCount += 1;
      if (taskCount >= (hasQuery ? 18 : 7)) break;
    }

    let projectCount = 0;
    for (const row of this.projectSearchRows) {
      if (!matchesSearch(row.searchText, normalized)) continue;
      results.push({ kind: "project", project: row.item });
      projectCount += 1;
      if (projectCount >= (hasQuery ? 10 : 5)) break;
    }

    let habitCount = 0;
    for (const row of this.habitSearchRows) {
      if (!matchesSearch(row.searchText, normalized)) continue;
      results.push({ kind: "habit", habit: row.item });
      habitCount += 1;
      if (habitCount >= (hasQuery ? 10 : 5)) break;
    }

    return boundedSet(this.searchCache, normalized, results.slice(0, 30));
  }

  filterData(
    rawConfig: Partial<DataFilterWidgetConfig> | null | undefined,
    today: string,
  ): DataFilterView {
    this.ensureRevision();
    const config = normalizeDataFilterConfig(rawConfig);
    const key = `${today}:${JSON.stringify(config)}`;
    const cached = this.dataFilterCache.get(key);
    if (cached) return cached;
    const result = filterDataFilterIndex(this.dataFilterIndex as DataFilterIndex, config, today);
    return boundedSet(this.dataFilterCache, key, result);
  }

  private ensureRevision(): VaultSnapshot {
    const snapshot = this.getSnapshot();
    if (this.snapshot === snapshot && this.revision === snapshot.revision) return snapshot;
    if (this.revision === snapshot.revision && this.snapshot) return this.snapshot;

    this.snapshot = snapshot;
    this.revision = snapshot.revision;
    this.projectTaskStats = new Map();
    let pendingTasks = 0;
    let completedTasks = 0;
    let datedOpenTasks = 0;
    for (const task of snapshot.tasks) {
      if (task.completed) completedTasks += 1;
      else {
        pendingTasks += 1;
        if (task.due || task.scheduled) datedOpenTasks += 1;
      }
      if (!task.projectId) continue;
      let stats = this.projectTaskStats.get(task.projectId);
      if (!stats) {
        stats = { tasks: [], completed: 0 };
        this.projectTaskStats.set(task.projectId, stats);
      }
      stats.tasks.push(task);
      if (task.completed) stats.completed += 1;
    }

    this.activeProjects = snapshot.projects
      .filter((project) => project.status === "active")
      .sort((a, b) => (a.deadline ?? "9999").localeCompare(b.deadline ?? "9999") || a.name.localeCompare(b.name));
    this.allProjects = [...snapshot.projects]
      .sort((a, b) => a.status.localeCompare(b.status)
        || (a.deadline ?? "9999").localeCompare(b.deadline ?? "9999")
        || a.name.localeCompare(b.name));
    this.activeHabits = snapshot.habits
      .filter((habit) => habit.status === "active")
      .sort((a, b) => a.name.localeCompare(b.name));
    this.activeAndPausedHabits = snapshot.habits
      .filter((habit) => habit.status === "active" || habit.status === "paused")
      .sort((a, b) => a.name.localeCompare(b.name));
    this.counts = {
      pendingTasks,
      completedTasks,
      datedOpenTasks,
      activeProjects: this.activeProjects.length,
    };

    this.taskSearchRows = snapshot.tasks
      .filter((task) => !task.completed)
      .sort((a, b) => (a.scheduled ?? a.due ?? "9999").localeCompare(b.scheduled ?? b.due ?? "9999"))
      .map((task) => ({
        item: task,
        searchText: [task.text, task.projectId, ...task.tags].filter(Boolean).join(" ").toLocaleLowerCase(),
      }));
    this.projectSearchRows = snapshot.projects
      .filter((project) => project.status !== "archived")
      .map((project) => ({
        item: project,
        searchText: [project.name, project.description, ...project.tags].filter(Boolean).join(" ").toLocaleLowerCase(),
      }));
    this.habitSearchRows = snapshot.habits
      .filter((habit) => habit.status !== "archived")
      .map((habit) => ({
        item: habit,
        searchText: [habit.name, habit.description, ...habit.tags].filter(Boolean).join(" ").toLocaleLowerCase(),
      }));

    this.dataFilterIndex = buildDataFilterIndex(snapshot);
    this.taskCache.clear();
    this.searchCache.clear();
    this.dataFilterCache.clear();
    return snapshot;
  }
}

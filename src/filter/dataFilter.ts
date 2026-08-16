import type {
  DataFilterDateRange,
  DataFilterEntity,
  DataFilterSort,
  DataFilterState,
  DataFilterWidgetConfig,
  Habit,
  Project,
  Task,
  VaultSnapshot,
} from "../models";
import { addDays, localDate } from "../utils/date";

export type DataFilterMatch =
  | { kind: "task"; item: Task; title: string; meta: string; date?: string; tags: string[] }
  | { kind: "project"; item: Project; title: string; meta: string; date?: string; tags: string[] }
  | { kind: "habit"; item: Habit; title: string; meta: string; date?: string; tags: string[] };

export interface DataFilterView {
  items: DataFilterMatch[];
  total: number;
  counts: { task: number; project: number; habit: number };
  config: DataFilterWidgetConfig;
}

const ENTITIES: DataFilterEntity[] = ["all", "task", "project", "habit"];
const STATES: DataFilterState[] = ["active", "completed", "all"];
const DATE_RANGES: DataFilterDateRange[] = ["all", "overdue", "today", "next7", "next30", "none"];
const SORTS: DataFilterSort[] = ["date", "name", "type"];

export const DEFAULT_DATA_FILTER_CONFIG: DataFilterWidgetConfig = {
  entity: "all",
  state: "active",
  dateRange: "all",
  query: "",
  tag: "",
  sort: "date",
  limit: 20,
};

function oneOf<T extends string>(value: unknown, values: readonly T[], fallback: T): T {
  return typeof value === "string" && values.includes(value as T) ? value as T : fallback;
}

export function normalizeDataFilterConfig(value: Partial<DataFilterWidgetConfig> | null | undefined): DataFilterWidgetConfig {
  return {
    entity: oneOf(value?.entity, ENTITIES, DEFAULT_DATA_FILTER_CONFIG.entity),
    state: oneOf(value?.state, STATES, DEFAULT_DATA_FILTER_CONFIG.state),
    dateRange: oneOf(value?.dateRange, DATE_RANGES, DEFAULT_DATA_FILTER_CONFIG.dateRange),
    query: typeof value?.query === "string" ? value.query.trim().slice(0, 160) : "",
    tag: typeof value?.tag === "string" ? value.tag.trim().slice(0, 80) : "",
    sort: oneOf(value?.sort, SORTS, DEFAULT_DATA_FILTER_CONFIG.sort),
    limit: Math.max(1, Math.min(100, Math.round(Number(value?.limit) || DEFAULT_DATA_FILTER_CONFIG.limit))),
  };
}

function normalizeTag(value: string): string {
  return value.trim().replace(/^#+/, "").toLocaleLowerCase();
}

function matchesTag(tags: string[], requested: string): boolean {
  const wanted = normalizeTag(requested);
  if (!wanted) return true;
  return tags.some((tag) => normalizeTag(tag) === wanted);
}

function matchesQuery(haystack: string, query: string): boolean {
  const needles = query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
  if (needles.length === 0) return true;
  const normalized = haystack.toLocaleLowerCase();
  return needles.every((needle) => normalized.includes(needle));
}

function stateMatches(kind: DataFilterMatch["kind"], item: Task | Project | Habit, state: DataFilterState): boolean {
  if (kind === "task") {
    const task = item as Task;
    if (state === "all") return true;
    return state === "completed" ? task.completed : !task.completed;
  }

  const status = (item as Project | Habit).status;
  if (state === "all") return status !== "archived";
  if (state === "completed") return status === "completed";
  return status !== "completed" && status !== "archived";
}

function dateMatches(date: string | undefined, range: DataFilterDateRange, today: string): boolean {
  if (range === "all") return true;
  if (range === "none") return !date;
  if (!date) return false;
  if (range === "overdue") return date < today;
  if (range === "today") return date === today;
  const end = addDays(today, range === "next7" ? 7 : 30);
  return date >= today && date <= end;
}

function taskMatch(task: Task): DataFilterMatch {
  const date = task.due ?? task.scheduled ?? task.start;
  const meta = [
    task.completed ? "已完成" : task.priority === "normal" ? "待办" : task.priority.toUpperCase(),
    task.projectId ? `项目 ${task.projectId}` : "",
    date ? `日期 ${date}` : "",
  ].filter(Boolean).join(" · ");
  return { kind: "task", item: task, title: task.text, meta, date, tags: task.tags };
}

function projectMatch(project: Project): DataFilterMatch {
  return {
    kind: "project",
    item: project,
    title: project.name,
    meta: [project.status, project.deadline ? `截止 ${project.deadline}` : ""].filter(Boolean).join(" · "),
    date: project.deadline,
    tags: project.tags,
  };
}

function habitMatch(habit: Habit): DataFilterMatch {
  const kind = habit.kind === "daily-progress" ? "日更" : "习惯";
  return {
    kind: "habit",
    item: habit,
    title: habit.name,
    meta: [kind, habit.status, habit.end ? `结束 ${habit.end}` : ""].filter(Boolean).join(" · "),
    date: habit.end,
    tags: habit.tags,
  };
}

function searchable(match: DataFilterMatch): string {
  if (match.kind === "task") {
    const task = match.item;
    return [task.text, task.projectId, task.priority, ...task.tags].filter(Boolean).join(" ");
  }
  if (match.kind === "project") {
    const project = match.item;
    return [project.id, project.name, project.description, project.status, ...project.tags].filter(Boolean).join(" ");
  }
  const habit = match.item;
  return [habit.id, habit.name, habit.description, habit.status, habit.frequency, habit.kind, habit.linkedProjectId, ...habit.tags]
    .filter(Boolean)
    .join(" ");
}

function compareMatches(a: DataFilterMatch, b: DataFilterMatch, sort: DataFilterSort): number {
  if (sort === "name") return a.title.localeCompare(b.title, "zh-CN");
  if (sort === "type") {
    const order = { task: 0, project: 1, habit: 2 } as const;
    return order[a.kind] - order[b.kind] || a.title.localeCompare(b.title, "zh-CN");
  }
  return (a.date ?? "9999-12-31").localeCompare(b.date ?? "9999-12-31")
    || a.title.localeCompare(b.title, "zh-CN");
}

export function filterVaultSnapshot(
  snapshot: VaultSnapshot,
  rawConfig: Partial<DataFilterWidgetConfig> | null | undefined,
  today = localDate(),
): DataFilterView {
  const config = normalizeDataFilterConfig(rawConfig);
  const candidates: DataFilterMatch[] = [];
  if (config.entity === "all" || config.entity === "task") candidates.push(...snapshot.tasks.map(taskMatch));
  if (config.entity === "all" || config.entity === "project") candidates.push(...snapshot.projects.map(projectMatch));
  if (config.entity === "all" || config.entity === "habit") candidates.push(...snapshot.habits.map(habitMatch));

  const filtered = candidates.filter((match) => (
    stateMatches(match.kind, match.item, config.state)
    && dateMatches(match.date, config.dateRange, today)
    && matchesTag(match.tags, config.tag)
    && matchesQuery(searchable(match), config.query)
  ));
  filtered.sort((a, b) => compareMatches(a, b, config.sort));

  const counts = { task: 0, project: 0, habit: 0 };
  for (const match of filtered) counts[match.kind] += 1;

  return {
    items: filtered.slice(0, config.limit),
    total: filtered.length,
    counts,
    config,
  };
}

import type {
  DataFilterDateRange,
  DataFilterEntity,
  DataFilterSort,
  DataFilterState,
  DataFilterTaskStatus,
  DataFilterWidgetConfig,
  Habit,
  NoteRecord,
  Project,
  Task,
  VaultSnapshot,
} from "../models";
import { addDays, localDate } from "../utils/date";

export type DataFilterMatch =
  | { kind: "note"; item: NoteRecord; title: string; meta: string; date?: string; tags: string[] }
  | { kind: "task"; item: Task; title: string; meta: string; date?: string; tags: string[] }
  | { kind: "project"; item: Project; title: string; meta: string; date?: string; tags: string[] }
  | { kind: "habit"; item: Habit; title: string; meta: string; date?: string; tags: string[] };

export interface DataFilterView {
  items: DataFilterMatch[];
  total: number;
  counts: { note: number; task: number; project: number; habit: number };
  config: DataFilterWidgetConfig;
}

interface IndexedDataFilterMatch {
  match: DataFilterMatch;
  searchText: string;
  normalizedTags: Set<string>;
  folder: string;
  frontmatter?: Map<string, string>;
}

export interface DataFilterIndex {
  candidates: IndexedDataFilterMatch[];
}

const ENTITIES: DataFilterEntity[] = ["all", "note", "task", "project", "habit"];
const STATES: DataFilterState[] = ["active", "completed", "all"];
const DATE_RANGES: DataFilterDateRange[] = ["all", "overdue", "today", "next7", "next30", "none"];
const SORTS: DataFilterSort[] = ["date", "name", "type"];
const TASK_STATUSES: DataFilterTaskStatus[] = ["all", "has-tasks", "pending", "completed", "none"];
const SNAPSHOT_INDEX_CACHE = new WeakMap<VaultSnapshot, DataFilterIndex>();

export const DEFAULT_DATA_FILTER_CONFIG: DataFilterWidgetConfig = {
  entity: "all",
  state: "active",
  dateRange: "all",
  query: "",
  tag: "",
  folder: "",
  frontmatter: "",
  noteTaskStatus: "all",
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
    folder: typeof value?.folder === "string" ? value.folder.trim().replace(/^\/+|\/+$/g, "").slice(0, 180) : "",
    frontmatter: typeof value?.frontmatter === "string" ? value.frontmatter.trim().slice(0, 160) : "",
    noteTaskStatus: oneOf(value?.noteTaskStatus, TASK_STATUSES, DEFAULT_DATA_FILTER_CONFIG.noteTaskStatus),
    sort: oneOf(value?.sort, SORTS, DEFAULT_DATA_FILTER_CONFIG.sort),
    limit: Math.max(1, Math.min(100, Math.round(Number(value?.limit) || DEFAULT_DATA_FILTER_CONFIG.limit))),
  };
}

function normalizeTag(value: string): string {
  return value.trim().replace(/^#+/, "").toLocaleLowerCase();
}

function stateMatches(match: DataFilterMatch, state: DataFilterState): boolean {
  if (match.kind === "note") return true;
  if (match.kind === "task") {
    if (state === "all") return true;
    return state === "completed" ? match.item.completed : !match.item.completed;
  }
  const status = match.item.status;
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

function folderForMatch(match: DataFilterMatch): string {
  if (match.kind === "note") return match.item.folder;
  const path = match.item.source.path;
  const index = path.lastIndexOf("/");
  return index >= 0 ? path.slice(0, index) : "";
}

function noteMatch(note: NoteRecord): DataFilterMatch {
  const date = localDate(new Date(note.modifiedAt));
  const tasks = note.taskTotal > 0 ? `${note.taskCompleted}/${note.taskTotal} tasks` : "无任务";
  return {
    kind: "note",
    item: note,
    title: note.name,
    meta: [note.folder || "Vault 根目录", tasks, `修改 ${date}`].join(" · "),
    date,
    tags: note.tags,
  };
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
  if (match.kind === "note") {
    return [
      match.item.path,
      match.item.name,
      match.item.folder,
      ...match.item.tags,
      ...Object.entries(match.item.frontmatter).flatMap(([key, value]) => [key, value]),
    ].join(" ");
  }
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

function indexMatch(match: DataFilterMatch): IndexedDataFilterMatch {
  const frontmatter = match.kind === "note"
    ? new Map(Object.entries(match.item.frontmatter).map(([key, value]) => [key.toLocaleLowerCase(), value.toLocaleLowerCase()]))
    : undefined;
  return {
    match,
    searchText: searchable(match).toLocaleLowerCase(),
    normalizedTags: new Set(match.tags.map(normalizeTag).filter(Boolean)),
    folder: folderForMatch(match).replace(/^\/+|\/+$/g, "").toLocaleLowerCase(),
    frontmatter,
  };
}

export function buildDataFilterIndex(snapshot: VaultSnapshot): DataFilterIndex {
  const candidates: IndexedDataFilterMatch[] = [];
  for (const note of snapshot.noteRecords ?? []) candidates.push(indexMatch(noteMatch(note)));
  for (const task of snapshot.tasks) candidates.push(indexMatch(taskMatch(task)));
  for (const project of snapshot.projects) candidates.push(indexMatch(projectMatch(project)));
  for (const habit of snapshot.habits) candidates.push(indexMatch(habitMatch(habit)));
  return { candidates };
}

function matchesQuery(searchText: string, query: string): boolean {
  const needles = query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return needles.length === 0 || needles.every((needle) => searchText.includes(needle));
}

function frontmatterMatches(indexed: IndexedDataFilterMatch, requested: string): boolean {
  const expression = requested.trim();
  if (!expression) return true;
  if (!indexed.frontmatter) return false;
  const separator = expression.indexOf("=");
  const key = (separator >= 0 ? expression.slice(0, separator) : expression).trim().toLocaleLowerCase();
  if (!key) return true;
  const value = indexed.frontmatter.get(key);
  if (value === undefined) return false;
  if (separator < 0) return true;
  const expected = expression.slice(separator + 1).trim().toLocaleLowerCase();
  return !expected || value.includes(expected);
}

function noteTaskStatusMatches(match: DataFilterMatch, status: DataFilterTaskStatus): boolean {
  if (status === "all") return true;
  if (match.kind !== "note") return false;
  const { taskTotal, taskCompleted } = match.item;
  if (status === "none") return taskTotal === 0;
  if (status === "has-tasks") return taskTotal > 0;
  if (status === "pending") return taskTotal > taskCompleted;
  return taskTotal > 0 && taskCompleted === taskTotal;
}

function compareMatches(a: DataFilterMatch, b: DataFilterMatch, sort: DataFilterSort): number {
  if (sort === "name") return a.title.localeCompare(b.title, "zh-CN");
  if (sort === "type") {
    const order = { note: 0, task: 1, project: 2, habit: 3 } as const;
    return order[a.kind] - order[b.kind] || a.title.localeCompare(b.title, "zh-CN");
  }
  return (a.date ?? "9999-12-31").localeCompare(b.date ?? "9999-12-31")
    || a.title.localeCompare(b.title, "zh-CN");
}

export function filterDataFilterIndex(
  index: DataFilterIndex,
  rawConfig: Partial<DataFilterWidgetConfig> | null | undefined,
  today = localDate(),
): DataFilterView {
  const config = normalizeDataFilterConfig(rawConfig);
  const wantedTag = normalizeTag(config.tag);
  const wantedFolder = config.folder.replace(/^\/+|\/+$/g, "").toLocaleLowerCase();
  const filtered: DataFilterMatch[] = [];
  const counts = { note: 0, task: 0, project: 0, habit: 0 };

  for (const indexed of index.candidates) {
    const match = indexed.match;
    if (config.entity !== "all" && match.kind !== config.entity) continue;
    if (!stateMatches(match, config.state)) continue;
    if (!dateMatches(match.date, config.dateRange, today)) continue;
    if (wantedTag && !indexed.normalizedTags.has(wantedTag)) continue;
    if (wantedFolder && indexed.folder !== wantedFolder && !indexed.folder.startsWith(`${wantedFolder}/`)) continue;
    if (!frontmatterMatches(indexed, config.frontmatter)) continue;
    if (!noteTaskStatusMatches(match, config.noteTaskStatus)) continue;
    if (!matchesQuery(indexed.searchText, config.query)) continue;
    filtered.push(match);
    counts[match.kind] += 1;
  }

  filtered.sort((a, b) => compareMatches(a, b, config.sort));
  return {
    items: filtered.slice(0, config.limit),
    total: filtered.length,
    counts,
    config,
  };
}

export function filterVaultSnapshot(
  snapshot: VaultSnapshot,
  rawConfig: Partial<DataFilterWidgetConfig> | null | undefined,
  today = localDate(),
): DataFilterView {
  let index = SNAPSHOT_INDEX_CACHE.get(snapshot);
  if (!index) {
    index = buildDataFilterIndex(snapshot);
    SNAPSHOT_INDEX_CACHE.set(snapshot, index);
  }
  return filterDataFilterIndex(index, rawConfig, today);
}

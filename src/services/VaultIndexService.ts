import { TFile, type App, type Plugin } from "obsidian";
import type { Habit, NoteRecord, Project, Task, VaultSnapshot } from "../models";
import { parseHabit } from "../parsers/habitParser";
import { parseProject } from "../parsers/projectParser";
import { parseTasks } from "../parsers/taskParser";

const INDEX_CONCURRENCY = 8;
const FILE_EVENT_DELAY_MS = 24;

function normalizeTag(value: string): string {
  return value.trim().replace(/^#+/, "");
}

function collectTags(cache: ReturnType<App["metadataCache"]["getFileCache"]>): string[] {
  const tags = new Set<string>();
  for (const item of cache?.tags ?? []) {
    const tag = normalizeTag(item.tag ?? "");
    if (tag) tags.add(tag);
  }
  const frontmatter = cache?.frontmatter as Record<string, unknown> | undefined;
  const raw = frontmatter?.tags ?? frontmatter?.tag;
  const values = Array.isArray(raw) ? raw : typeof raw === "string" ? raw.split(/[\s,]+/) : [];
  for (const value of values) {
    if (typeof value !== "string") continue;
    const tag = normalizeTag(value);
    if (tag) tags.add(tag);
  }
  return [...tags];
}

function normalizeFrontmatter(cache: ReturnType<App["metadataCache"]["getFileCache"]>): Record<string, string> {
  const frontmatter = cache?.frontmatter as Record<string, unknown> | undefined;
  const result: Record<string, string> = {};
  if (!frontmatter) return result;
  for (const [key, value] of Object.entries(frontmatter)) {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      result[key] = String(value).slice(0, 500);
      continue;
    }
    if (Array.isArray(value)) {
      const scalars = value.filter((item) => ["string", "number", "boolean"].includes(typeof item));
      if (scalars.length > 0) result[key] = scalars.map(String).join(", ").slice(0, 500);
    }
  }
  return result;
}

export class VaultIndexService {
  private readonly tasksByPath = new Map<string, Task[]>();
  private readonly projectByPath = new Map<string, Project>();
  private readonly habitByPath = new Map<string, Habit>();
  private readonly noteByPath = new Map<string, NoteRecord>();
  private readonly listeners = new Set<(snapshot: VaultSnapshot) => void>();
  private readonly fileTimers = new Map<string, number>();
  private snapshot: VaultSnapshot = {
    revision: 0,
    notes: 0,
    noteRecords: [],
    tasks: [],
    projects: [],
    habits: [],
  };
  private initialized = false;
  private timer: number | null = null;

  constructor(
    private readonly app: App,
    private readonly plugin: Plugin,
    private readonly getProjectTypeValue: () => string,
    private readonly getHabitTypeValue: () => string,
  ) {}

  initializeWhenReady(): void {
    this.plugin.register(() => this.clearTimers());
    this.app.workspace.onLayoutReady(() => {
      void this.initialize();
      this.registerEvents();
    });
  }

  async initialize(): Promise<void> {
    await this.indexFiles(this.app.vault.getMarkdownFiles());
    this.initialized = true;
    this.rebuildSnapshot();
  }

  private registerEvents(): void {
    this.plugin.registerEvent(this.app.vault.on("create", (file) => {
      if (!this.app.workspace.layoutReady) return;
      if (file instanceof TFile && file.extension === "md") this.scheduleFile(file);
    }));

    this.plugin.registerEvent(this.app.vault.on("modify", (file) => {
      if (file instanceof TFile && file.extension === "md") this.scheduleFile(file);
    }));

    this.plugin.registerEvent(this.app.vault.on("delete", (file) => {
      this.removePath(file.path);
    }));

    this.plugin.registerEvent(this.app.vault.on("rename", (file, oldPath) => {
      this.removePath(oldPath, false);
      if (file instanceof TFile && file.extension === "md") this.scheduleFile(file);
    }));

    this.plugin.registerEvent(this.app.metadataCache.on("changed", (file) => {
      if (file.extension === "md") this.scheduleFile(file);
    }));
  }

  async reindexAll(): Promise<void> {
    this.clearFileTimers();
    this.tasksByPath.clear();
    this.projectByPath.clear();
    this.habitByPath.clear();
    this.noteByPath.clear();
    await this.indexFiles(this.app.vault.getMarkdownFiles());
    this.rebuildSnapshot();
  }

  async indexFile(file: TFile, notify = true): Promise<void> {
    this.cancelFileTimer(file.path);
    try {
      const content = await this.app.vault.cachedRead(file);
      const tasks = parseTasks(file.path, content);
      this.tasksByPath.set(file.path, tasks);

      const cache = this.app.metadataCache.getFileCache(file);
      this.noteByPath.set(file.path, {
        path: file.path,
        name: file.basename,
        folder: file.parent?.path ?? "",
        tags: collectTags(cache),
        frontmatter: normalizeFrontmatter(cache),
        taskTotal: tasks.length,
        taskCompleted: tasks.filter((task) => task.completed).length,
        createdAt: file.stat.ctime,
        modifiedAt: file.stat.mtime,
      });

      const project = parseProject(file, cache, this.getProjectTypeValue());
      if (project) this.projectByPath.set(file.path, project);
      else this.projectByPath.delete(file.path);

      const habit = parseHabit(file, cache, this.getHabitTypeValue());
      if (habit) this.habitByPath.set(file.path, habit);
      else this.habitByPath.delete(file.path);

      if (notify && this.initialized) this.scheduleSnapshot();
    } catch (error) {
      console.error("[DashFlow] Failed to index", file.path, error);
    }
  }

  private async indexFiles(files: TFile[]): Promise<void> {
    let cursor = 0;
    const workerCount = Math.min(INDEX_CONCURRENCY, files.length);
    const workers = Array.from({ length: workerCount }, async () => {
      while (cursor < files.length) {
        const index = cursor;
        cursor += 1;
        const file = files[index];
        if (file) await this.indexFile(file, false);
      }
    });
    await Promise.all(workers);
  }

  private scheduleFile(file: TFile): void {
    this.cancelFileTimer(file.path);
    const timer = window.setTimeout(() => {
      this.fileTimers.delete(file.path);
      void this.indexFile(file);
    }, FILE_EVENT_DELAY_MS);
    this.fileTimers.set(file.path, timer);
  }

  private cancelFileTimer(path: string): void {
    const timer = this.fileTimers.get(path);
    if (timer === undefined) return;
    window.clearTimeout(timer);
    this.fileTimers.delete(path);
  }

  private clearFileTimers(): void {
    for (const timer of this.fileTimers.values()) window.clearTimeout(timer);
    this.fileTimers.clear();
  }

  private clearTimers(): void {
    this.clearFileTimers();
    if (this.timer !== null) window.clearTimeout(this.timer);
    this.timer = null;
  }

  private removePath(path: string, notify = true): void {
    this.cancelFileTimer(path);
    this.tasksByPath.delete(path);
    this.projectByPath.delete(path);
    this.habitByPath.delete(path);
    this.noteByPath.delete(path);
    if (notify && this.initialized) this.scheduleSnapshot();
  }

  private scheduleSnapshot(): void {
    if (this.timer !== null) window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      this.timer = null;
      this.rebuildSnapshot();
    }, 50);
  }

  private rebuildSnapshot(): void {
    this.snapshot = {
      revision: this.snapshot.revision + 1,
      notes: this.noteByPath.size,
      noteRecords: [...this.noteByPath.values()],
      tasks: [...this.tasksByPath.values()].flat(),
      projects: [...this.projectByPath.values()],
      habits: [...this.habitByPath.values()],
    };
    for (const listener of this.listeners) listener(this.snapshot);
  }

  getSnapshot(): VaultSnapshot {
    return this.snapshot;
  }

  subscribe(listener: (snapshot: VaultSnapshot) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

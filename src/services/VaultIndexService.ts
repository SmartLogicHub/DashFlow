import { TFile, type App, type Plugin } from "obsidian";
import type { Project, Task, VaultSnapshot } from "../models";
import { parseProject } from "../parsers/projectParser";
import { parseTasks } from "../parsers/taskParser";

export class VaultIndexService {
  private readonly tasksByPath = new Map<string, Task[]>();
  private readonly projectByPath = new Map<string, Project>();
  private readonly listeners = new Set<(snapshot: VaultSnapshot) => void>();
  private snapshot: VaultSnapshot = { revision: 0, notes: 0, tasks: [], projects: [] };
  private initialized = false;
  private timer: number | null = null;

  constructor(
    private readonly app: App,
    private readonly plugin: Plugin,
    private readonly getProjectTypeValue: () => string,
  ) {}

  initializeWhenReady(): void {
    this.app.workspace.onLayoutReady(() => {
      void this.initialize();
      this.registerEvents();
    });
  }

  async initialize(): Promise<void> {
    const files = this.app.vault.getMarkdownFiles();
    await Promise.all(files.map((file) => this.indexFile(file, false)));
    this.initialized = true;
    this.rebuildSnapshot();
  }

  private registerEvents(): void {
    this.plugin.registerEvent(this.app.vault.on("create", (file) => {
      if (!this.app.workspace.layoutReady) return;
      if (file instanceof TFile && file.extension === "md") void this.indexFile(file);
    }));

    this.plugin.registerEvent(this.app.vault.on("modify", (file) => {
      if (file instanceof TFile && file.extension === "md") void this.indexFile(file);
    }));

    this.plugin.registerEvent(this.app.vault.on("delete", (file) => {
      this.removePath(file.path);
    }));

    this.plugin.registerEvent(this.app.vault.on("rename", (file, oldPath) => {
      this.removePath(oldPath, false);
      if (file instanceof TFile && file.extension === "md") void this.indexFile(file);
    }));

    this.plugin.registerEvent(this.app.metadataCache.on("changed", (file) => {
      if (file.extension === "md") void this.indexFile(file);
    }));
  }

  async reindexAll(): Promise<void> {
    this.tasksByPath.clear();
    this.projectByPath.clear();
    const files = this.app.vault.getMarkdownFiles();
    await Promise.all(files.map((file) => this.indexFile(file, false)));
    this.rebuildSnapshot();
  }

  async indexFile(file: TFile, notify = true): Promise<void> {
    try {
      const content = await this.app.vault.cachedRead(file);
      this.tasksByPath.set(file.path, parseTasks(file.path, content));

      const project = parseProject(
        file,
        this.app.metadataCache.getFileCache(file),
        this.getProjectTypeValue(),
      );
      if (project) this.projectByPath.set(file.path, project);
      else this.projectByPath.delete(file.path);

      if (notify && this.initialized) this.scheduleSnapshot();
    } catch (error) {
      console.error("[DashFlow] Failed to index", file.path, error);
    }
  }

  private removePath(path: string, notify = true): void {
    this.tasksByPath.delete(path);
    this.projectByPath.delete(path);
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
      notes: this.app.vault.getMarkdownFiles().length,
      tasks: [...this.tasksByPath.values()].flat(),
      projects: [...this.projectByPath.values()],
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

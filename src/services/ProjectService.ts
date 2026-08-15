import { Notice, TFile, normalizePath, type App } from "obsidian";
import type { Project, ProjectEditInput, Task } from "../models";
import type { VaultIndexService } from "./VaultIndexService";

function sanitizeId(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}_-]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function sanitizeFileName(value: string): string {
  return value
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, " ")
    .replace(/^\.+|\.+$/g, "")
    .slice(0, 100) || "Project";
}

function yamlString(value: string): string {
  return JSON.stringify(value);
}

export class ProjectService {
  constructor(
    private readonly app: App,
    private readonly index: VaultIndexService,
    private readonly getProjectFolder: () => string,
    private readonly getProjectTypeValue: () => string,
  ) {}

  active(): Project[] {
    return this.index.getSnapshot().projects
      .filter((project) => project.status === "active")
      .sort((a, b) => (a.deadline ?? "9999").localeCompare(b.deadline ?? "9999") || a.name.localeCompare(b.name));
  }

  all(): Project[] {
    return [...this.index.getSnapshot().projects]
      .sort((a, b) => a.status.localeCompare(b.status) || (a.deadline ?? "9999").localeCompare(b.deadline ?? "9999") || a.name.localeCompare(b.name));
  }

  tasks(project: Project): Task[] {
    return this.index.getSnapshot().tasks.filter((task) => task.projectId === project.id);
  }

  progress(project: Project): number {
    if (project.progressMode === "manual" && project.manualProgress !== undefined) {
      return project.manualProgress;
    }
    const tasks = this.tasks(project);
    if (tasks.length === 0) return 0;
    return Math.round((tasks.filter((task) => task.completed).length / tasks.length) * 100);
  }

  async create(input: ProjectEditInput): Promise<Project | undefined> {
    const name = input.name.trim();
    if (!name) {
      new Notice("DashFlow: 项目名称不能为空。");
      return undefined;
    }

    const id = sanitizeId(input.id || name) || `project-${Date.now().toString(36)}`;
    if (this.index.getSnapshot().projects.some((project) => project.id === id)) {
      new Notice(`DashFlow: Project ID「${id}」已经存在。`);
      return undefined;
    }

    const folder = normalizePath(this.getProjectFolder().trim() || "DashFlow/Projects");
    await this.ensureFolder(folder);
    let path = normalizePath(`${folder}/${sanitizeFileName(name)}.md`);
    if (this.app.vault.getAbstractFileByPath(path)) {
      path = normalizePath(`${folder}/${sanitizeFileName(name)}-${Date.now().toString(36)}.md`);
    }

    const lines = [
      "---",
      `type: ${yamlString(this.getProjectTypeValue().trim() || "project")}`,
      `project_id: ${yamlString(id)}`,
      `name: ${yamlString(name)}`,
      `status: ${input.status}`,
      `progress_mode: ${input.progressMode}`,
    ];
    if (input.description?.trim()) lines.push(`description: ${yamlString(input.description.trim())}`);
    if (input.start) lines.push(`start: ${input.start}`);
    if (input.deadline) lines.push(`deadline: ${input.deadline}`);
    if (input.progressMode === "manual" && input.manualProgress !== undefined) {
      lines.push(`progress: ${Math.max(0, Math.min(100, Math.round(input.manualProgress)))}`);
    }
    lines.push("---", "", `# ${name}`, "");

    const file = await this.app.vault.create(path, lines.join("\n"));
    await this.index.indexFile(file);
    new Notice(`DashFlow: 已创建项目「${name}」`);

    return {
      id,
      name,
      description: input.description?.trim() || undefined,
      status: input.status,
      start: input.start,
      deadline: input.deadline,
      tags: [],
      progressMode: input.progressMode,
      manualProgress: input.progressMode === "manual" ? input.manualProgress : undefined,
      source: { path },
    };
  }

  async update(project: Project, input: ProjectEditInput): Promise<boolean> {
    const name = input.name.trim();
    if (!name) {
      new Notice("DashFlow: 项目名称不能为空。");
      return false;
    }

    const file = this.app.vault.getAbstractFileByPath(project.source.path);
    if (!(file instanceof TFile)) {
      new Notice("DashFlow: 找不到项目笔记。");
      return false;
    }

    await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
      frontmatter.type = this.getProjectTypeValue().trim() || "project";
      frontmatter.project_id = project.id;
      frontmatter.name = name;
      frontmatter.status = input.status;
      frontmatter.progress_mode = input.progressMode;

      if (input.description?.trim()) frontmatter.description = input.description.trim();
      else delete frontmatter.description;

      if (input.start) frontmatter.start = input.start;
      else delete frontmatter.start;

      if (input.deadline) frontmatter.deadline = input.deadline;
      else delete frontmatter.deadline;

      if (input.progressMode === "manual" && input.manualProgress !== undefined) {
        frontmatter.progress = Math.max(0, Math.min(100, Math.round(input.manualProgress)));
      } else {
        delete frontmatter.progress;
      }
    });

    await this.index.indexFile(file);
    new Notice(`DashFlow: 已更新项目「${name}」`);
    return true;
  }

  private async ensureFolder(path: string): Promise<void> {
    const parts = path.split("/").filter(Boolean);
    let current = "";
    for (const part of parts) {
      current = current ? `${current}/${part}` : part;
      if (!this.app.vault.getAbstractFileByPath(current)) {
        try {
          await this.app.vault.createFolder(current);
        } catch {
          // The folder may have been created concurrently.
        }
      }
    }
  }
}

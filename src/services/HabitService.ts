import { Notice, TFile, normalizePath, type App } from "obsidian";
import type { Habit, HabitEditInput } from "../models";
import { localDate } from "../utils/date";
import type { ActivityService } from "./ActivityService";
import type { VaultIndexService } from "./VaultIndexService";
import type { VaultQueryService } from "./VaultQueryService";

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
    .slice(0, 100) || "Habit";
}

function yamlString(value: string): string {
  return JSON.stringify(value);
}

function normalizeDates(value: unknown): string[] {
  const source = Array.isArray(value) ? value : value ? [value] : [];
  const dates = source
    .map((item) => {
      if (item instanceof Date && Number.isFinite(item.getTime())) return item.toISOString().slice(0, 10);
      const text = String(item).trim().slice(0, 10);
      return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : "";
    })
    .filter(Boolean);
  return [...new Set(dates)].sort();
}

function normalizeDailyNotes(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const notes: Record<string, string> = {};
  for (const [date, note] of Object.entries(value as Record<string, unknown>)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    const text = String(note ?? "").trim();
    if (text) notes[date] = text;
  }
  return notes;
}

function entityName(habit: Pick<Habit, "kind"> | Pick<HabitEditInput, "kind">): string {
  return habit.kind === "daily-progress" ? "长期任务" : "习惯";
}

export class HabitService {
  constructor(
    private readonly app: App,
    private readonly index: VaultIndexService,
    private readonly activity: ActivityService,
    private readonly getHabitFolder: () => string,
    private readonly getHabitTypeValue: () => string,
    private readonly query?: VaultQueryService,
  ) {}

  active(includePaused = false): Habit[] {
    if (this.query) return this.query.getActiveHabits(includePaused);
    return this.index.getSnapshot().habits
      .filter((habit) => habit.status === "active" || (includePaused && habit.status === "paused"))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async toggleDate(habit: Habit, date = localDate()): Promise<boolean> {
    const file = this.app.vault.getAbstractFileByPath(habit.source.path);
    if (!(file instanceof TFile)) {
      new Notice(`DashFlow: 找不到${entityName(habit)}笔记。`);
      return false;
    }

    let completed = false;
    await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
      const dates = normalizeDates(frontmatter.habit_log);
      const index = dates.indexOf(date);
      if (index >= 0) {
        dates.splice(index, 1);
        completed = false;
      } else {
        dates.push(date);
        dates.sort();
        completed = true;
      }
      frontmatter.habit_log = dates;
    });

    await this.index.indexFile(file);
    this.activity.setHabitCompleted(habit.id, date, completed);
    const action = habit.kind === "daily-progress"
      ? (completed ? "已推进" : "已取消推进")
      : (completed ? "已完成" : "已取消");
    new Notice(`${action} · ${habit.name}`);
    return true;
  }

  async setDailyNote(habit: Habit, date: string, note: string): Promise<boolean> {
    if (habit.kind !== "daily-progress") return false;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
    const file = this.app.vault.getAbstractFileByPath(habit.source.path);
    if (!(file instanceof TFile)) {
      new Notice("DashFlow: 找不到长期任务笔记。");
      return false;
    }

    const text = note.trim();
    await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
      const notes = normalizeDailyNotes(frontmatter.daily_notes);
      if (text) notes[date] = text;
      else delete notes[date];
      frontmatter.daily_notes = notes;
    });

    await this.index.indexFile(file);
    new Notice(text ? `已记录 · ${habit.name}` : `已清除备注 · ${habit.name}`);
    return true;
  }

  async create(input: HabitEditInput): Promise<Habit | undefined> {
    const name = input.name.trim();
    if (!name) {
      new Notice("DashFlow: 名称不能为空。");
      return undefined;
    }

    const kind = input.kind === "daily-progress" ? "daily-progress" : "habit";
    const id = sanitizeId(input.id || name) || `habit-${Date.now().toString(36)}`;
    const folder = normalizePath(this.getHabitFolder().trim() || "DashFlow/Habits");
    await this.ensureFolder(folder);

    let path = normalizePath(`${folder}/${sanitizeFileName(name)}.md`);
    if (this.app.vault.getAbstractFileByPath(path)) {
      path = normalizePath(`${folder}/${sanitizeFileName(name)}-${Date.now().toString(36)}.md`);
    }

    const frequency = kind === "daily-progress" ? "daily" : input.frequency;
    const lines = [
      "---",
      `type: ${yamlString(this.getHabitTypeValue().trim() || "habit")}`,
      `habit_id: ${yamlString(id)}`,
      `name: ${yamlString(name)}`,
      `status: ${input.status}`,
      `frequency: ${frequency}`,
    ];
    if (kind === "daily-progress") lines.push("habit_kind: daily-progress");
    if (input.description?.trim()) lines.push(`description: ${yamlString(input.description.trim())}`);
    if (input.start) lines.push(`start: ${input.start}`);
    if (input.end) lines.push(`end: ${input.end}`);
    if (input.targetDays && input.targetDays > 0) lines.push(`target_days: ${Math.round(input.targetDays)}`);
    if (kind === "daily-progress" && input.linkedProjectId?.trim()) {
      lines.push(`linked_project: ${yamlString(input.linkedProjectId.trim())}`);
    }
    lines.push("habit_log: []");
    if (kind === "daily-progress") lines.push("daily_notes: {}");
    lines.push("---", "", `# ${name}`, "");

    const file = await this.app.vault.create(path, lines.join("\n"));
    await this.index.indexFile(file);
    new Notice(`DashFlow: 已创建${kind === "daily-progress" ? "长期任务" : "习惯"}「${name}」`);

    return {
      id,
      name,
      description: input.description?.trim() || undefined,
      status: input.status,
      frequency,
      kind,
      start: input.start,
      end: input.end,
      targetDays: input.targetDays && input.targetDays > 0 ? Math.round(input.targetDays) : undefined,
      linkedProjectId: kind === "daily-progress" ? input.linkedProjectId?.trim() || undefined : undefined,
      tags: [],
      completedDates: [],
      dailyNotes: {},
      source: { path },
    };
  }

  async update(habit: Habit, input: HabitEditInput): Promise<boolean> {
    const name = input.name.trim();
    if (!name) {
      new Notice("DashFlow: 名称不能为空。");
      return false;
    }

    const file = this.app.vault.getAbstractFileByPath(habit.source.path);
    if (!(file instanceof TFile)) {
      new Notice(`DashFlow: 找不到${entityName(habit)}笔记。`);
      return false;
    }

    const kind = input.kind === "daily-progress" ? "daily-progress" : "habit";
    const frequency = kind === "daily-progress" ? "daily" : input.frequency;

    await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
      frontmatter.type = this.getHabitTypeValue().trim() || "habit";
      frontmatter.habit_id = habit.id;
      frontmatter.name = name;
      frontmatter.status = input.status;
      frontmatter.frequency = frequency;

      if (kind === "daily-progress") frontmatter.habit_kind = "daily-progress";
      else delete frontmatter.habit_kind;

      if (input.description?.trim()) frontmatter.description = input.description.trim();
      else delete frontmatter.description;

      if (input.start) frontmatter.start = input.start;
      else delete frontmatter.start;

      if (input.end) frontmatter.end = input.end;
      else delete frontmatter.end;

      if (input.targetDays && input.targetDays > 0) frontmatter.target_days = Math.round(input.targetDays);
      else delete frontmatter.target_days;

      if (kind === "daily-progress" && input.linkedProjectId?.trim()) {
        frontmatter.linked_project = input.linkedProjectId.trim();
      } else {
        delete frontmatter.linked_project;
      }

      frontmatter.habit_log = normalizeDates(frontmatter.habit_log);
      if (kind === "daily-progress" || frontmatter.daily_notes) {
        frontmatter.daily_notes = normalizeDailyNotes(frontmatter.daily_notes);
      }
    });

    await this.index.indexFile(file);
    new Notice(`DashFlow: 已更新${kind === "daily-progress" ? "长期任务" : "习惯"}「${name}」`);
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

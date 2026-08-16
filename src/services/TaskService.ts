import { Notice, TFile, type App } from "obsidian";
import type { Task, TaskEditInput } from "../models";
import { serializeTaskLine } from "../parsers/taskParser";
import { addDays, localDate } from "../utils/date";
import type { ActivityService } from "./ActivityService";
import type { VaultIndexService } from "./VaultIndexService";
import type { VaultQueryService } from "./VaultQueryService";

const PRIORITY_WEIGHT = { urgent: 0, high: 1, normal: 2, low: 3 } as const;

function taskDate(task: Task): string {
  return task.scheduled ?? task.due ?? "9999";
}

function sortTasks(a: Task, b: Task): number {
  return taskDate(a).localeCompare(taskDate(b))
    || (a.due ?? "9999").localeCompare(b.due ?? "9999")
    || PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]
    || a.text.localeCompare(b.text);
}

export class TaskService {
  constructor(
    private readonly app: App,
    private readonly index: VaultIndexService,
    private readonly activity: ActivityService,
    private readonly query?: VaultQueryService,
  ) {}

  async toggle(task: Task): Promise<void> {
    const file = this.app.vault.getAbstractFileByPath(task.source.path);
    if (!(file instanceof TFile)) {
      new Notice("DashFlow: 找不到任务所在笔记。");
      return;
    }

    let toggled = false;
    await this.app.vault.process(file, (content) => {
      const lines = content.split(/\r?\n/);
      const target = this.findTaskLine(lines, task);

      if (target < 0) {
        new Notice("DashFlow: 任务内容已变化，请刷新后再试。");
        return content;
      }

      const current = lines[target] ?? "";
      lines[target] = task.completed
        ? current.replace(/^(\s*[-*+]\s+)\[[xX]\]/, "$1[ ]")
        : current.replace(/^(\s*[-*+]\s+)\[ \]/, "$1[x]");
      toggled = lines[target] !== current;

      return lines.join("\n");
    });

    if (!toggled) return;
    if (!task.completed) this.activity.recordTaskCompleted(task);
    await this.index.indexFile(file);
  }

  async update(task: Task, input: TaskEditInput): Promise<boolean> {
    if (!input.text.trim()) {
      new Notice("DashFlow: 任务标题不能为空。");
      return false;
    }

    const file = this.app.vault.getAbstractFileByPath(task.source.path);
    if (!(file instanceof TFile)) {
      new Notice("DashFlow: 找不到任务所在笔记。");
      return false;
    }

    let updated = false;
    await this.app.vault.process(file, (content) => {
      const lines = content.split(/\r?\n/);
      const target = this.findTaskLine(lines, task);

      if (target < 0) {
        new Notice("DashFlow: 任务内容已变化，请刷新后再试。");
        return content;
      }

      lines[target] = serializeTaskLine(task, {
        ...input,
        text: input.text.trim(),
        projectId: input.projectId?.trim() || undefined,
        due: input.due || undefined,
        scheduled: input.scheduled || undefined,
        start: input.start || undefined,
      });
      updated = true;
      return lines.join("\n");
    });

    if (!updated) return false;
    if (!task.completed && input.completed) this.activity.recordTaskCompleted(task);
    await this.index.indexFile(file);
    new Notice("DashFlow: 任务已更新");
    return true;
  }

  today(tasks?: Task[]): Task[] {
    const today = localDate();
    if (this.usesCurrentSnapshot(tasks)) return this.query?.todayTasks(today) ?? [];
    return (tasks ?? this.index.getSnapshot().tasks)
      .filter((task) => task.due === today || task.scheduled === today)
      .sort(sortTasks);
  }

  focus(tasks?: Task[]): Task[] {
    const today = localDate();
    if (this.usesCurrentSnapshot(tasks)) return this.query?.focusTasks(today) ?? [];
    const byId = new Map<string, Task>();
    for (const task of tasks ?? this.index.getSnapshot().tasks) {
      if (task.completed) continue;
      if (task.due === today || task.scheduled === today || (task.due && task.due < today)) {
        byId.set(task.id, task);
      }
    }
    return [...byId.values()].sort((a, b) => {
      const overdueA = Boolean(a.due && a.due < today);
      const overdueB = Boolean(b.due && b.due < today);
      return Number(overdueB) - Number(overdueA) || sortTasks(a, b);
    });
  }

  overdue(tasks?: Task[]): Task[] {
    const today = localDate();
    if (this.usesCurrentSnapshot(tasks)) return this.query?.overdueTasks(today) ?? [];
    return (tasks ?? this.index.getSnapshot().tasks)
      .filter((task) => !task.completed && Boolean(task.due) && (task.due as string) < today)
      .sort(sortTasks);
  }

  upcoming(days = 7, tasks?: Task[]): Task[] {
    const start = localDate();
    if (this.usesCurrentSnapshot(tasks)) return this.query?.upcomingTasks(start, days) ?? [];
    const end = addDays(start, days);
    return (tasks ?? this.index.getSnapshot().tasks)
      .filter((task) => {
        if (task.completed) return false;
        const scheduled = task.scheduled;
        const due = task.due;
        return Boolean(
          (scheduled && scheduled >= start && scheduled <= end)
          || (due && due >= start && due <= end),
        );
      })
      .sort(sortTasks);
  }

  private usesCurrentSnapshot(tasks: Task[] | undefined): boolean {
    if (!this.query) return false;
    return !tasks || tasks === this.index.getSnapshot().tasks;
  }

  private findTaskLine(lines: string[], task: Task): number {
    let target = task.source.line ?? -1;
    if (target >= 0 && lines[target] === task.source.raw) return target;
    if (!task.source.raw) return -1;
    target = lines.findIndex((line) => line === task.source.raw);
    return target;
  }
}

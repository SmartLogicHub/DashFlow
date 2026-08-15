import { Notice, TFile, type App } from "obsidian";
import type { Task, TaskEditInput } from "../models";
import { serializeTaskLine } from "../parsers/taskParser";
import { addDays, localDate } from "../utils/date";
import type { VaultIndexService } from "./VaultIndexService";

const PRIORITY_WEIGHT = { urgent: 0, high: 1, normal: 2, low: 3 } as const;

function sortTasks(a: Task, b: Task): number {
  return (a.due ?? "9999").localeCompare(b.due ?? "9999")
    || PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]
    || a.text.localeCompare(b.text);
}

export class TaskService {
  constructor(
    private readonly app: App,
    private readonly index: VaultIndexService,
  ) {}

  async toggle(task: Task): Promise<void> {
    const file = this.app.vault.getAbstractFileByPath(task.source.path);
    if (!(file instanceof TFile)) {
      new Notice("DashFlow: 找不到任务所在笔记。");
      return;
    }

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

      return lines.join("\n");
    });
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
      });
      updated = true;
      return lines.join("\n");
    });

    if (!updated) return false;
    await this.index.indexFile(file);
    new Notice("DashFlow: 任务已更新");
    return true;
  }

  today(tasks = this.index.getSnapshot().tasks): Task[] {
    const today = localDate();
    return tasks.filter((task) => task.due === today).sort(sortTasks);
  }

  overdue(tasks = this.index.getSnapshot().tasks): Task[] {
    const today = localDate();
    return tasks
      .filter((task) => !task.completed && Boolean(task.due) && (task.due as string) < today)
      .sort(sortTasks);
  }

  upcoming(days = 7, tasks = this.index.getSnapshot().tasks): Task[] {
    const start = localDate();
    const end = addDays(start, days);
    return tasks
      .filter((task) => !task.completed && Boolean(task.due) && (task.due as string) >= start && (task.due as string) <= end)
      .sort(sortTasks);
  }

  private findTaskLine(lines: string[], task: Task): number {
    let target = task.source.line ?? -1;
    if (target >= 0 && lines[target] === task.source.raw) return target;
    if (!task.source.raw) return -1;
    target = lines.findIndex((line) => line === task.source.raw);
    return target;
  }
}

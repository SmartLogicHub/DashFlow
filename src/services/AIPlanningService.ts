import { Notice } from "obsidian";
import type DashFlowPlugin from "../main";
import { localDate } from "../utils/date";

export class AIPlanningService {
  constructor(private readonly plugin: DashFlowPlugin) {}

  isConfigured(): boolean {
    return this.plugin.aiClient.isConfigured();
  }

  async testConnection(): Promise<string> {
    try {
      return await this.plugin.aiClient.testConnection();
    } catch (error) {
      this.surfaceError(error);
      throw error;
    }
  }

  async planToday(): Promise<string> {
    const snapshot = this.plugin.vaultIndex.getSnapshot();
    const today = localDate();
    const tasks = snapshot.tasks
      .filter((task) => !task.completed)
      .sort((a, b) => (a.scheduled ?? a.due ?? "9999").localeCompare(b.scheduled ?? b.due ?? "9999"))
      .slice(0, 36)
      .map((task) => ({
        title: task.text,
        priority: task.priority,
        scheduled: task.scheduled ?? null,
        due: task.due ?? null,
        project: task.projectId ?? null,
      }));
    const projects = snapshot.projects
      .filter((project) => project.status === "active")
      .slice(0, 16)
      .map((project) => ({
        name: project.name,
        deadline: project.deadline ?? null,
        progress: this.plugin.projectService.progress(project),
        openTasks: this.plugin.projectService.tasks(project).filter((task) => !task.completed).length,
      }));
    const habits = snapshot.habits
      .filter((habit) => habit.status === "active")
      .slice(0, 16)
      .map((habit) => ({
        name: habit.name,
        frequency: habit.frequency,
        kind: habit.kind ?? "habit",
        doneToday: habit.completedDates.includes(today),
      }));

    const payload = JSON.stringify({ today, tasks, projects, habits }, null, 2);
    try {
      return await this.plugin.aiClient.complete([
        {
          role: "system",
          content: [
            "你是 DashFlow 的个人执行教练。",
            "只根据用户主动提供的任务、项目和习惯摘要制定今天计划，不要臆造日程。",
            "优先减少认知负担：先指出最重要的 1-3 个结果，再给出清晰的执行顺序。",
            "对逾期和临近截止项给出明确提醒；没有必要时不要建议用户增加更多任务。",
            "输出中文，使用简短 Markdown，结构固定为：『今日重点』『建议顺序』『风险/提醒』。",
          ].join("\n"),
        },
        {
          role: "user",
          content: `请根据以下 DashFlow 摘要规划今天。\n\n${payload}`,
        },
      ], 900);
    } catch (error) {
      this.surfaceError(error);
      throw error;
    }
  }

  private surfaceError(error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    new Notice(`DashFlow AI: ${message}`);
  }
}

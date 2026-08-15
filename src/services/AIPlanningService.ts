import { Notice, requestUrl } from "obsidian";
import type DashFlowPlugin from "../main";
import { localDate } from "../utils/date";

interface ChatCompletionResponse {
  choices?: Array<{ message?: { content?: string | null } }>;
  error?: { message?: string };
}

function trimBaseUrl(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

export class AIPlanningService {
  constructor(private readonly plugin: DashFlowPlugin) {}

  isConfigured(): boolean {
    const settings = this.plugin.data.settings;
    return settings.aiEnabled
      && Boolean(trimBaseUrl(settings.aiBaseUrl))
      && Boolean(settings.aiModel.trim())
      && Boolean(settings.aiSecretId.trim())
      && Boolean(this.plugin.app.secretStorage.getSecret(settings.aiSecretId.trim()));
  }

  async testConnection(): Promise<string> {
    const result = await this.complete([
      { role: "system", content: "You are a connection test. Reply with exactly OK." },
      { role: "user", content: "OK" },
    ], 32);
    return result.trim();
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
        doneToday: habit.completedDates.includes(today),
      }));

    const payload = JSON.stringify({ today, tasks, projects, habits }, null, 2);
    return this.complete([
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
  }

  private async complete(
    messages: Array<{ role: "system" | "user"; content: string }>,
    maxTokens: number,
  ): Promise<string> {
    const settings = this.plugin.data.settings;
    if (!settings.aiEnabled) throw new Error("AI 规划尚未启用。");
    const secretId = settings.aiSecretId.trim();
    const apiKey = secretId ? this.plugin.app.secretStorage.getSecret(secretId) : null;
    if (!apiKey) throw new Error("没有可用的 API Key。请先在 DashFlow 设置中选择一个 Keychain 密钥。");

    const baseUrl = trimBaseUrl(settings.aiBaseUrl);
    const model = settings.aiModel.trim();
    if (!baseUrl || !model) throw new Error("AI Base URL 或模型尚未配置。");

    try {
      const response = await requestUrl({
        url: `${baseUrl}/chat/completions`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model, messages, max_tokens: maxTokens, stream: false }),
      });
      const data = response.json as ChatCompletionResponse;
      if (response.status < 200 || response.status >= 300) {
        throw new Error(data.error?.message || `HTTP ${response.status}`);
      }
      const content = data.choices?.[0]?.message?.content?.trim();
      if (!content) throw new Error("AI 返回了空结果。");
      return content;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      new Notice(`DashFlow AI: ${message}`);
      throw error;
    }
  }
}

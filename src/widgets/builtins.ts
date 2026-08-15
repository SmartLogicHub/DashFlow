import type { CountdownWidgetConfig, ProgressWidgetConfig, ProjectsWidgetConfig, QuickCaptureWidgetConfig, TasksWidgetConfig, UpcomingWidgetConfig, WidgetDefinition } from "../models";
import type { WidgetRegistry } from "./WidgetRegistry";

export function registerBuiltins(registry: WidgetRegistry): void {
  const definitions: WidgetDefinition[] = [
    {
      type: "quick-capture",
      name: "快速捕捉",
      description: "把一条新任务快速写入 Inbox。",
      icon: "⚡",
      defaultSize: { w: 4, h: 3 },
      minSize: { w: 3, h: 3 },
      defaultConfig: (): QuickCaptureWidgetConfig => ({ placeholder: "现在脑子里在想什么？" }),
    },
    {
      type: "tasks",
      name: "今日任务",
      description: "今天到期与已逾期的任务。",
      icon: "✓",
      defaultSize: { w: 4, h: 5 },
      minSize: { w: 3, h: 3 },
      defaultConfig: (): TasksWidgetConfig => ({ includeOverdue: true, limit: 10 }),
    },
    {
      type: "progress",
      name: "今日进度",
      description: "今天到期任务的完成比例。",
      icon: "◔",
      defaultSize: { w: 4, h: 3 },
      minSize: { w: 3, h: 3 },
      defaultConfig: (): ProgressWidgetConfig => ({ label: "TODAY" }),
    },
    {
      type: "projects",
      name: "项目",
      description: "活动项目与由任务计算的项目进度。",
      icon: "▣",
      defaultSize: { w: 8, h: 4 },
      minSize: { w: 4, h: 3 },
      defaultConfig: (): ProjectsWidgetConfig => ({ limit: 6 }),
    },
    {
      type: "upcoming",
      name: "即将到期",
      description: "未来七天的待办。",
      icon: "◫",
      defaultSize: { w: 4, h: 6 },
      minSize: { w: 3, h: 3 },
      defaultConfig: (): UpcomingWidgetConfig => ({ days: 7, limit: 12 }),
    },
    {
      type: "countdown",
      name: "倒计时",
      description: "距离目标日期还剩多少天。",
      icon: "◷",
      defaultSize: { w: 4, h: 3 },
      minSize: { w: 3, h: 3 },
      defaultConfig: (): CountdownWidgetConfig => ({
        title: "YEAR END",
        targetDate: `${new Date().getFullYear()}-12-31`,
      }),
    },
    {
      type: "vault-stats",
      name: "Vault Pulse",
      description: "笔记、待办和项目的快速统计。",
      icon: "⌁",
      defaultSize: { w: 8, h: 3 },
      minSize: { w: 4, h: 2 },
      defaultConfig: () => ({}),
    },
  ];

  for (const definition of definitions) registry.register(definition);
}

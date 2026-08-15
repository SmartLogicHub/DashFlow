import type {
  CountdownWidgetConfig,
  ProgressWidgetConfig,
  ProjectsWidgetConfig,
  QuickCaptureWidgetConfig,
  TasksWidgetConfig,
  UpcomingWidgetConfig,
  WidgetDefinition,
} from "../models";
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
      settings: [
        {
          key: "placeholder",
          type: "text",
          label: "输入提示",
          description: "快速捕捉输入框为空时显示的提示文字。",
        },
      ],
      defaultConfig: (): QuickCaptureWidgetConfig => ({ placeholder: "现在脑子里在想什么？" }),
    },
    {
      type: "tasks",
      name: "今日任务",
      description: "今天到期与已逾期的任务。",
      icon: "✓",
      defaultSize: { w: 4, h: 5 },
      minSize: { w: 3, h: 3 },
      settings: [
        {
          key: "includeOverdue",
          type: "toggle",
          label: "包含逾期任务",
          description: "把已逾期但未完成的任务放在今日任务前面。",
        },
        {
          key: "limit",
          type: "number",
          label: "最多显示",
          description: "限制卡片内显示的任务数量。",
          min: 1,
          max: 50,
          step: 1,
        },
      ],
      defaultConfig: (): TasksWidgetConfig => ({ includeOverdue: true, limit: 10 }),
    },
    {
      type: "progress",
      name: "今日进度",
      description: "今天到期任务的完成比例。",
      icon: "◔",
      defaultSize: { w: 4, h: 3 },
      minSize: { w: 3, h: 3 },
      settings: [
        {
          key: "label",
          type: "text",
          label: "进度标签",
          description: "显示在环形进度中央的短标签。",
          placeholder: "TODAY",
        },
      ],
      defaultConfig: (): ProgressWidgetConfig => ({ label: "TODAY" }),
    },
    {
      type: "projects",
      name: "项目",
      description: "活动项目与由任务计算的项目进度。",
      icon: "▣",
      defaultSize: { w: 8, h: 4 },
      minSize: { w: 4, h: 3 },
      settings: [
        {
          key: "limit",
          type: "number",
          label: "最多显示",
          description: "限制活动项目数量。",
          min: 1,
          max: 30,
          step: 1,
        },
      ],
      defaultConfig: (): ProjectsWidgetConfig => ({ limit: 6 }),
    },
    {
      type: "upcoming",
      name: "即将到期",
      description: "未来几天的待办。",
      icon: "◫",
      defaultSize: { w: 4, h: 6 },
      minSize: { w: 3, h: 3 },
      settings: [
        {
          key: "days",
          type: "number",
          label: "未来天数",
          description: "从今天开始向后查看多少天。",
          min: 1,
          max: 90,
          step: 1,
        },
        {
          key: "limit",
          type: "number",
          label: "最多显示",
          description: "限制卡片内显示的任务数量。",
          min: 1,
          max: 100,
          step: 1,
        },
      ],
      defaultConfig: (): UpcomingWidgetConfig => ({ days: 7, limit: 12 }),
    },
    {
      type: "countdown",
      name: "倒计时",
      description: "距离目标日期还剩多少天。",
      icon: "◷",
      defaultSize: { w: 4, h: 3 },
      minSize: { w: 3, h: 3 },
      settings: [
        {
          key: "title",
          type: "text",
          label: "倒计时标签",
          description: "显示在天数上方的标题。",
          placeholder: "YEAR END",
        },
        {
          key: "targetDate",
          type: "date",
          label: "目标日期",
          description: "倒计时使用的目标日期。",
        },
      ],
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

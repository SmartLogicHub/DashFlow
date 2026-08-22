import type { DashboardDefinition, WidgetInstance } from "../models";
import type { WidgetRegistry } from "../widgets/WidgetRegistry";

export type DashboardTemplateId =
  | "daily-focus"
  | "project-management"
  | "habit-tracker"
  | "weekly-review"
  | "minimal";

interface TemplateWidgetSpec {
  type: string;
  x: number;
  y: number;
  w: number;
  h: number;
  config?: Record<string, unknown>;
  title?: string;
}

interface DashboardTemplateSpec {
  id: DashboardTemplateId;
  name: string;
  description: string;
  icon: string;
  widgets: readonly TemplateWidgetSpec[];
}

export interface DashboardTemplateSummary {
  id: DashboardTemplateId;
  name: string;
  description: string;
  icon: string;
  widgetCount: number;
  widgetTypes: readonly string[];
}

export const DEFAULT_DASHBOARD_TEMPLATE_ID: DashboardTemplateId = "daily-focus";

const TEMPLATE_SPECS: readonly DashboardTemplateSpec[] = [
  {
    id: "daily-focus",
    name: "今日专注",
    description: "把今天要做的事、近期安排和日历放在最前面。",
    icon: "⚡",
    widgets: [
      { type: "quick-capture", x: 0, y: 0, w: 4, h: 3 },
      { type: "tasks", x: 4, y: 0, w: 4, h: 5, config: { includeOverdue: true, limit: 8 } },
      { type: "progress", x: 8, y: 0, w: 4, h: 3, config: { label: "今日任务" } },
      { type: "upcoming", x: 8, y: 3, w: 4, h: 5, config: { days: 7, limit: 8 } },
      { type: "calendar", x: 0, y: 5, w: 8, h: 7, config: { agendaLimit: 8 } },
      { type: "countdown", x: 8, y: 8, w: 4, h: 3 },
      { type: "heatmap", x: 0, y: 12, w: 12, h: 4, config: { days: 84, metric: "score" } },
    ],
  },
  {
    id: "project-management",
    name: "项目管理",
    description: "围绕活动项目、执行任务、截止日和近期交付组织工作。",
    icon: "▣",
    widgets: [
      { type: "quick-capture", x: 0, y: 0, w: 4, h: 3 },
      { type: "projects", x: 4, y: 0, w: 8, h: 5, config: { limit: 8 } },
      { type: "tasks", x: 0, y: 3, w: 4, h: 5, config: { includeOverdue: true, limit: 10 } },
      { type: "upcoming", x: 0, y: 8, w: 4, h: 6, config: { days: 14, limit: 16 } },
      { type: "calendar", x: 4, y: 5, w: 8, h: 8, config: { showHabits: false, agendaLimit: 14 } },
      { type: "countdown", x: 4, y: 13, w: 4, h: 3, title: "里程碑" },
      { type: "vault-stats", x: 8, y: 13, w: 4, h: 3 },
    ],
  },
  {
    id: "habit-tracker",
    name: "习惯追踪",
    description: "把习惯打卡、活跃度和节奏日历放在一个工作台。",
    icon: "◎",
    widgets: [
      { type: "habits", x: 0, y: 0, w: 7, h: 5, config: { historyDays: 14, limit: 8, showProgress: true } },
      { type: "heatmap", x: 7, y: 0, w: 5, h: 5, config: { days: 84, metric: "habits", showLegend: true } },
      { type: "calendar", x: 0, y: 5, w: 12, h: 8, config: { showTasks: false, showProjects: false, showHabits: true } },
      { type: "weekly-review", x: 0, y: 13, w: 12, h: 7, config: { showHabits: true, showActivityComparison: true } },
    ],
  },
  {
    id: "weekly-review",
    name: "每周复盘",
    description: "面向复盘：本周总结、活跃度、项目推进和下周日程。",
    icon: "↻",
    widgets: [
      { type: "weekly-review", x: 0, y: 0, w: 12, h: 7 },
      { type: "heatmap", x: 0, y: 7, w: 7, h: 4, config: { days: 180, metric: "score" } },
      { type: "projects", x: 7, y: 7, w: 5, h: 4, config: { limit: 6 } },
      { type: "calendar", x: 0, y: 11, w: 12, h: 8, config: { agendaLimit: 10 } },
      { type: "vault-stats", x: 0, y: 19, w: 12, h: 3 },
    ],
  },
  {
    id: "minimal",
    name: "极简模式",
    description: "只保留捕捉、今日任务和进度，适合极简专注。",
    icon: "◌",
    widgets: [
      { type: "quick-capture", x: 0, y: 0, w: 4, h: 3 },
      { type: "tasks", x: 4, y: 0, w: 5, h: 5, config: { includeOverdue: true, limit: 7 } },
      { type: "progress", x: 9, y: 0, w: 3, h: 3, config: { label: "专注" } },
    ],
  },
];

export const DASHBOARD_TEMPLATES: readonly DashboardTemplateSummary[] = TEMPLATE_SPECS.map((template) => ({
  id: template.id,
  name: template.name,
  description: template.description,
  icon: template.icon,
  widgetCount: template.widgets.length,
  widgetTypes: template.widgets.map((widget) => widget.type),
}));

export function getDashboardTemplate(templateId: DashboardTemplateId): DashboardTemplateSummary {
  return DASHBOARD_TEMPLATES.find((template) => template.id === templateId) ?? DASHBOARD_TEMPLATES[0]!;
}

export function createDashboardFromTemplate(
  registry: WidgetRegistry,
  templateId: DashboardTemplateId = DEFAULT_DASHBOARD_TEMPLATE_ID,
  now = Date.now(),
): DashboardDefinition {
  const template = TEMPLATE_SPECS.find((item) => item.id === templateId) ?? TEMPLATE_SPECS[0]!;
  const widgets: WidgetInstance[] = template.widgets.map((spec, index) => {
    const definition = registry.get(spec.type);
    if (!definition) throw new Error(`Unknown DashFlow widget type in template: ${spec.type}`);
    return {
      id: `${template.id}-${spec.type}-${index + 1}`,
      type: spec.type,
      title: spec.title,
      layout: { x: spec.x, y: spec.y, w: spec.w, h: spec.h },
      config: { ...definition.defaultConfig(), ...(spec.config ?? {}) },
      hidden: false,
    };
  });

  return {
    id: `template-${template.id}`,
    name: template.name,
    icon: "layout-dashboard",
    settings: { columns: 12, gap: 14, rowHeight: 58, showHeader: true },
    widgets,
    mobile: {
      order: widgets.map((widget) => widget.id),
      collapsedWidgetIds: [],
      compactMode: false,
    },
    createdAt: now,
    updatedAt: now,
  };
}

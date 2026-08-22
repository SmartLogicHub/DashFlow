import type { ProductSection } from "./navigation";

export type FeatureGroup = "capture" | "execution" | "projects" | "review" | "intelligence";
export type FeatureKind = "widget" | "action" | "integration";
export type FeaturePlacement = "added" | "not-added" | "not-applicable";
export type FeatureAvailability = "ready" | "disabled" | "needs-configuration";
export type FeatureAction =
  | "quick-add"
  | "new-task"
  | "new-project"
  | "new-habit"
  | "search"
  | "ai-plan"
  | "morning-briefing"
  | "weread"
  | "manage-dashboards"
  | "workflow-settings";

export interface FeatureDefinition {
  id: string;
  group: FeatureGroup;
  kind: FeatureKind;
  name: string;
  description: string;
  icon: string;
  section: ProductSection | "settings";
  widgetType?: string;
  action?: FeatureAction;
  availability?: "ai" | "morning-briefing" | "weread";
}

export interface FeatureStatusContext {
  addedWidgetTypes: ReadonlySet<string>;
  aiEnabled: boolean;
  aiConfigured: boolean;
  morningBriefingEnabled: boolean;
  weReadEnabled: boolean;
  weReadConfigured: boolean;
}

export interface FeatureStatus {
  placement: FeaturePlacement;
  availability: FeatureAvailability;
  configured?: boolean;
}

export type FeatureFilterMode = "all" | "not-added" | "needs-attention";

export interface FeatureFilter {
  query: string;
  mode: FeatureFilterMode;
}

export const FEATURE_GROUP_LABELS: Record<FeatureGroup, string> = {
  capture: "捕捉与整理",
  execution: "执行与规划",
  projects: "项目",
  review: "长期与复盘",
  intelligence: "智能与扩展",
};

export const FEATURE_CATALOG: readonly FeatureDefinition[] = [
  { id: "widget-quick-capture", group: "capture", kind: "widget", name: "快速捕捉", description: "把一条新任务写入收集箱。", icon: "zap", section: "work", widgetType: "quick-capture" },
  { id: "widget-tasks", group: "execution", kind: "widget", name: "今日任务", description: "查看今天到期与已逾期的任务。", icon: "circle-check-big", section: "work", widgetType: "tasks" },
  { id: "widget-progress", group: "execution", kind: "widget", name: "任务概览", description: "比较今日与全部任务的完成情况。", icon: "chart-no-axes-column-increasing", section: "work", widgetType: "progress" },
  { id: "widget-projects", group: "projects", kind: "widget", name: "项目列表", description: "查看活动项目和派生进度。", icon: "folder-kanban", section: "projects", widgetType: "projects" },
  { id: "widget-upcoming", group: "execution", kind: "widget", name: "即将到期", description: "查看未来几天的待办。", icon: "calendar-clock", section: "work", widgetType: "upcoming" },
  { id: "widget-weekly-review", group: "review", kind: "widget", name: "每周复盘", description: "汇总本周结果并准备下一周。", icon: "refresh-cw", section: "review", widgetType: "weekly-review" },
  { id: "widget-calendar", group: "execution", kind: "widget", name: "日历", description: "统一查看任务、项目与习惯日期。", icon: "calendar-days", section: "calendar", widgetType: "calendar" },
  { id: "widget-habits", group: "review", kind: "widget", name: "长期习惯", description: "打卡并跟踪长期节奏。", icon: "repeat-2", section: "habits", widgetType: "habits" },
  { id: "widget-heatmap", group: "review", kind: "widget", name: "活跃度", description: "查看任务、习惯和笔记活动。", icon: "grid-3x3", section: "review", widgetType: "heatmap" },
  { id: "widget-countdown", group: "execution", kind: "widget", name: "倒计时", description: "跟踪一个重要目标日期。", icon: "timer", section: "work", widgetType: "countdown" },
  { id: "widget-vault-stats", group: "review", kind: "widget", name: "Vault Pulse", description: "查看笔记、任务和项目统计。", icon: "activity", section: "review", widgetType: "vault-stats" },
  { id: "widget-data-filter", group: "execution", kind: "widget", name: "Visual Data Filter", description: "按条件筛选 Vault 中的数据。", icon: "list-filter", section: "work", widgetType: "data-filter" },
  { id: "widget-magic-embed", group: "intelligence", kind: "widget", name: "Magic Embed", description: "按需嵌入受限网页。", icon: "panels-top-left", section: "work", widgetType: "magic-embed" },
  { id: "widget-focus", group: "execution", kind: "widget", name: "Focus", description: "运行专注与休息计时。", icon: "timer-reset", section: "work", widgetType: "focus" },
  { id: "widget-project-gantt", group: "projects", kind: "widget", name: "项目时间轴", description: "查看项目起止、截止与重叠。", icon: "gantt-chart", section: "projects", widgetType: "project-gantt" },
  { id: "widget-ai-news", group: "intelligence", kind: "widget", name: "AI 早报", description: "从信息源筛选值得阅读的内容。", icon: "newspaper", section: "work", widgetType: "ai-news", availability: "ai" },
  { id: "widget-project-kanban", group: "projects", kind: "widget", name: "项目看板", description: "按状态拖动和管理项目。", icon: "columns-3", section: "projects", widgetType: "project-kanban" },
  { id: "widget-opportunity-board", group: "capture", kind: "widget", name: "灵感收集", description: "把想法从收集推进到完成。", icon: "lightbulb", section: "work", widgetType: "opportunity-board" },
  { id: "quick-add", group: "capture", kind: "action", name: "快速添加", description: "统一创建任务、项目、习惯或长期任务。", icon: "plus", section: "inbox", action: "quick-add" },
  { id: "new-task", group: "capture", kind: "action", name: "新建任务", description: "创建一项可执行行动。", icon: "list-plus", section: "work", action: "new-task" },
  { id: "new-project", group: "projects", kind: "action", name: "新建项目", description: "创建一个长期目标。", icon: "folder-plus", section: "projects", action: "new-project" },
  { id: "new-habit", group: "review", kind: "action", name: "新建习惯", description: "创建一个长期节奏。", icon: "circle-plus", section: "habits", action: "new-habit" },
  { id: "search", group: "execution", kind: "action", name: "全局搜索", description: "搜索任务、项目与习惯。", icon: "search", section: "work", action: "search" },
  { id: "ai-plan", group: "intelligence", kind: "action", name: "AI 规划", description: "根据当前状态规划今天。", icon: "sparkles", section: "today", action: "ai-plan", availability: "ai" },
  { id: "morning-briefing", group: "intelligence", kind: "integration", name: "AI 晨间简报", description: "从昨日 Daily Note 生成今日建议。", icon: "sunrise", section: "today", action: "morning-briefing", availability: "morning-briefing" },
  { id: "weread", group: "intelligence", kind: "integration", name: "微信读书", description: "在首页重新发现真实个人划线。", icon: "book-open-text", section: "settings", action: "weread", availability: "weread" },
  { id: "manage-dashboards", group: "execution", kind: "action", name: "管理工作台", description: "创建、切换、复制和管理工作台。", icon: "layout-dashboard", section: "work", action: "manage-dashboards" },
  { id: "workflow-settings", group: "execution", kind: "action", name: "配置情景模式", description: "设置捕捉目标与 Morning、Work、Review 映射。", icon: "sliders-horizontal", section: "settings", action: "workflow-settings" },
];

export function featureStatus(feature: FeatureDefinition, context: FeatureStatusContext): FeatureStatus {
  const placement: FeaturePlacement = feature.kind === "widget"
    ? context.addedWidgetTypes.has(feature.widgetType ?? "") ? "added" : "not-added"
    : "not-applicable";

  if (feature.availability === "ai") {
    return {
      placement,
      availability: context.aiEnabled
        ? context.aiConfigured ? "ready" : "needs-configuration"
        : "disabled",
      configured: context.aiConfigured,
    };
  }
  if (feature.availability === "morning-briefing") {
    return {
      placement,
      availability: context.morningBriefingEnabled
        ? context.aiConfigured ? "ready" : "needs-configuration"
        : "disabled",
      configured: context.aiConfigured,
    };
  }
  if (feature.availability === "weread") {
    return {
      placement,
      availability: context.weReadEnabled
        ? context.weReadConfigured ? "ready" : "needs-configuration"
        : "disabled",
      configured: context.weReadConfigured,
    };
  }
  return { placement, availability: "ready" };
}

export function filterFeatures(
  features: readonly FeatureDefinition[],
  statuses: ReadonlyMap<string, FeatureStatus>,
  filter: FeatureFilter,
): FeatureDefinition[] {
  const query = filter.query.trim().toLocaleLowerCase();
  return features.filter((feature) => {
    const status = statuses.get(feature.id);
    if (filter.mode === "not-added" && status?.placement !== "not-added") return false;
    if (filter.mode === "needs-attention" && status?.availability === "ready") return false;
    if (!query) return true;
    return `${feature.name} ${feature.description}`.toLocaleLowerCase().includes(query);
  });
}

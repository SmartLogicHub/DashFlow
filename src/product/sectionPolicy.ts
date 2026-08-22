import type { ProductSection } from "./navigation";

export type FocusedSection = "projects" | "calendar" | "habits" | "review";
export type ProjectViewType = "projects" | "project-kanban" | "project-gantt";

export interface ProjectViewOption {
  type: ProjectViewType;
  label: string;
  icon: string;
  description: string;
}

interface WidgetPlacement {
  type: string;
  hidden?: boolean;
}

export interface SectionPolicy {
  section: FocusedSection;
  widgetTypes: readonly string[];
  recommendedWidgetType: string;
}

export interface SectionCoverage {
  missing: boolean;
  visibleTypes: string[];
}

export interface SectionRecovery {
  section: FocusedSection;
  title: string;
  description: string;
  widgetType: string;
  actionLabel: string;
}

export const PROJECT_VIEW_OPTIONS: readonly ProjectViewOption[] = [
  { type: "projects", label: "列表", icon: "list", description: "快速浏览项目与进度。" },
  { type: "project-kanban", label: "看板", icon: "columns-3", description: "按状态推进项目。" },
  { type: "project-gantt", label: "时间轴", icon: "gantt-chart", description: "查看项目日期与重叠。" },
];

export const PROJECT_VIEW_TYPES: readonly ProjectViewType[] = PROJECT_VIEW_OPTIONS.map((option) => option.type);

const SECTION_POLICIES: Record<FocusedSection, SectionPolicy> = {
  projects: { section: "projects", widgetTypes: PROJECT_VIEW_TYPES, recommendedWidgetType: "projects" },
  calendar: { section: "calendar", widgetTypes: ["calendar"], recommendedWidgetType: "calendar" },
  habits: { section: "habits", widgetTypes: ["habits", "heatmap"], recommendedWidgetType: "habits" },
  review: { section: "review", widgetTypes: ["weekly-review", "heatmap", "vault-stats"], recommendedWidgetType: "weekly-review" },
};

const SECTION_RECOVERY: Record<FocusedSection, SectionRecovery> = {
  projects: {
    section: "projects",
    title: "项目视图还没有加入当前工作台",
    description: "先加入项目列表，随后可以在列表、看板和时间轴之间切换。",
    widgetType: "projects",
    actionLabel: "加入项目列表",
  },
  calendar: {
    section: "calendar",
    title: "日历还没有加入当前工作台",
    description: "加入日历后，就能在这里统一查看任务、项目与习惯日期。",
    widgetType: "calendar",
    actionLabel: "加入日历",
  },
  habits: {
    section: "habits",
    title: "习惯还没有加入当前工作台",
    description: "加入长期习惯后，就能在这里打卡并跟踪持续节奏。",
    widgetType: "habits",
    actionLabel: "加入长期习惯",
  },
  review: {
    section: "review",
    title: "复盘还没有加入当前工作台",
    description: "加入每周复盘后，就能汇总本周结果并准备下一周。",
    widgetType: "weekly-review",
    actionLabel: "加入每周复盘",
  },
};

function focusedSection(section: ProductSection): FocusedSection | null {
  return section === "projects" || section === "calendar" || section === "habits" || section === "review"
    ? section
    : null;
}

export function sectionPolicy(section: ProductSection): SectionPolicy | null {
  const focused = focusedSection(section);
  return focused ? SECTION_POLICIES[focused] : null;
}

export function sectionWidgetTypes(section: ProductSection): string[] {
  return [...(sectionPolicy(section)?.widgetTypes ?? [])];
}

export function recommendedWidgetType(section: ProductSection): string | null {
  return sectionPolicy(section)?.recommendedWidgetType ?? null;
}

export function recoveryForSection(section: ProductSection): SectionRecovery | null {
  const focused = focusedSection(section);
  return focused ? SECTION_RECOVERY[focused] : null;
}

export function projectRecoveryForView(type: ProjectViewType): SectionRecovery {
  const option = PROJECT_VIEW_OPTIONS.find((item) => item.type === type) ?? PROJECT_VIEW_OPTIONS[0]!;
  const names: Record<ProjectViewType, string> = {
    projects: "项目列表",
    "project-kanban": "项目看板",
    "project-gantt": "项目时间轴",
  };
  const name = names[option.type];
  return {
    section: "projects",
    title: `${name}还没有加入当前工作台`,
    description: `${option.description}加入后会留在当前工作台，并可随时切换。`,
    widgetType: option.type,
    actionLabel: `加入${name}`,
  };
}

export function sectionCoverage(section: ProductSection, widgets: readonly WidgetPlacement[]): SectionCoverage {
  const owned = new Set(sectionWidgetTypes(section));
  const visibleTypes = [...new Set(
    widgets
      .filter((widget) => widget.hidden !== true && owned.has(widget.type))
      .map((widget) => widget.type),
  )];
  return { missing: owned.size > 0 && visibleTypes.length === 0, visibleTypes };
}

export function initialProjectView(widgets: readonly WidgetPlacement[]): ProjectViewType {
  const available = new Set(
    widgets
      .filter((widget) => widget.hidden !== true)
      .map((widget) => widget.type),
  );
  return PROJECT_VIEW_TYPES.find((type) => available.has(type)) ?? "projects";
}

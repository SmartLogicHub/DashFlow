import type { ProductSection } from "./navigation";

export type FocusedSection = "projects" | "calendar" | "habits" | "review";
export type ProjectViewType = "projects" | "project-kanban" | "project-gantt";

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

export const PROJECT_VIEW_TYPES: readonly ProjectViewType[] = [
  "projects",
  "project-kanban",
  "project-gantt",
];

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

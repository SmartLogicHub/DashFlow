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

import type { DashboardDefinition, DashFlowData } from "../models";
import type { DashboardTemplateId } from "../dashboard/dashboardTemplates";

export type OnboardingTemplateId = Extract<DashboardTemplateId, "minimal" | "daily-focus" | "project-management">;

export const ONBOARDING_TEMPLATES: ReadonlyArray<{
  id: OnboardingTemplateId;
  name: string;
  description: string;
  icon: string;
}> = [
  { id: "minimal", name: "Minimal", description: "捕捉、今日任务与进度，留出最大的专注空间。", icon: "◌" },
  { id: "daily-focus", name: "Daily Focus", description: "把今天、近期安排和日历放在最前面。", icon: "⚡" },
  { id: "project-management", name: "Project Management", description: "围绕项目、截止日和交付组织工作。", icon: "▣" },
];

export interface OnboardingSelection {
  templateId: OnboardingTemplateId;
  inboxPath: string;
  projectFolder: string;
  habitFolder: string;
}

export function shouldShowOnboarding(
  firstRun: boolean,
  onboardingCompleted: boolean,
  recoveryRequired: boolean,
): boolean {
  return firstRun && !onboardingCompleted && !recoveryRequired;
}

export function normalizeOnboardingDashboard(dashboard: DashboardDefinition): DashboardDefinition {
  return { ...dashboard, id: "home", name: "默认工作台" };
}

function pathOrFallback(value: string, fallback: string): string {
  return value.trim() || fallback;
}

export function completeOnboarding(
  data: DashFlowData,
  selectedDashboard: DashboardDefinition,
  selection: OnboardingSelection,
): DashFlowData {
  const firstRun = !data.onboardingCompleted;
  const dashboard = normalizeOnboardingDashboard(selectedDashboard);
  return {
    ...data,
    settings: {
      ...data.settings,
      inboxPath: pathOrFallback(selection.inboxPath, data.settings.inboxPath),
      projectFolder: pathOrFallback(selection.projectFolder, data.settings.projectFolder),
      habitFolder: pathOrFallback(selection.habitFolder, data.settings.habitFolder),
    },
    dashboards: firstRun ? [dashboard] : data.dashboards,
    activeDashboardId: firstRun ? dashboard.id : data.activeDashboardId,
    onboardingCompleted: true,
  };
}

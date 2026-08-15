import type { CustomDashboardTemplate, DashboardDefinition } from "../models";
import {
  cloneDashboardDefinition,
  nextDashboardId,
  normalizeDashboardName,
} from "./dashboardCollection";

export function normalizeCustomTemplateDescription(value: string): string {
  return value.trim().replace(/\s+/g, " ").slice(0, 180);
}

export function createCustomDashboardTemplate(
  source: DashboardDefinition,
  name: string,
  description: string,
  existingTemplates: readonly CustomDashboardTemplate[],
  now = Date.now(),
): CustomDashboardTemplate {
  const normalizedName = normalizeDashboardName(name) || `${source.name} Template`;
  const id = nextDashboardId(normalizedName, existingTemplates.map((template) => template.id));
  const dashboard = cloneDashboardDefinition(source, `template-${id}`, normalizedName, now);

  return {
    id,
    name: normalizedName,
    description: normalizeCustomTemplateDescription(description),
    icon: "✦",
    dashboard,
    createdAt: now,
    updatedAt: now,
  };
}

export function instantiateCustomDashboardTemplate(
  template: CustomDashboardTemplate,
  dashboardId: string,
  dashboardName: string,
  now = Date.now(),
): DashboardDefinition {
  return cloneDashboardDefinition(
    template.dashboard,
    dashboardId,
    normalizeDashboardName(dashboardName) || template.name,
    now,
  );
}

import type { DashboardDefinition, WidgetLayout } from "../models";
import type { WidgetRegistry } from "../widgets/WidgetRegistry";
import { createDefaultDashboard } from "./defaultDashboard";

const LEGACY_LAYOUT: Record<string, WidgetLayout> = {
  "quick-capture": { x: 0, y: 0, w: 4, h: 3 },
  "today-tasks": { x: 4, y: 0, w: 4, h: 5 },
  progress: { x: 8, y: 0, w: 4, h: 3 },
  projects: { x: 0, y: 5, w: 8, h: 4 },
  upcoming: { x: 8, y: 3, w: 4, h: 6 },
  activity: { x: 0, y: 9, w: 8, h: 4 },
  countdown: { x: 8, y: 9, w: 4, h: 4 },
  habits: { x: 0, y: 13, w: 12, h: 5 },
  "weekly-review": { x: 0, y: 18, w: 12, h: 7 },
  calendar: { x: 0, y: 25, w: 12, h: 8 },
  "vault-stats": { x: 0, y: 33, w: 8, h: 3 },
};

const POLISHED_024_LAYOUT: Record<string, WidgetLayout> = {
  "quick-capture": { x: 0, y: 0, w: 4, h: 3 },
  "today-tasks": { x: 4, y: 0, w: 5, h: 4 },
  progress: { x: 9, y: 0, w: 3, h: 3 },
  projects: { x: 0, y: 4, w: 9, h: 4 },
  upcoming: { x: 9, y: 3, w: 3, h: 5 },
  activity: { x: 0, y: 8, w: 8, h: 4 },
  countdown: { x: 8, y: 8, w: 4, h: 4 },
  habits: { x: 0, y: 12, w: 12, h: 4 },
  "weekly-review": { x: 0, y: 16, w: 12, h: 6 },
  calendar: { x: 0, y: 22, w: 12, h: 7 },
  "vault-stats": { x: 0, y: 29, w: 12, h: 2 },
};

const STUDIO_031_LAYOUT: Record<string, WidgetLayout> = {
  "today-tasks": { x: 0, y: 0, w: 7, h: 5 },
  "quick-capture": { x: 7, y: 0, w: 5, h: 2 },
  progress: { x: 7, y: 2, w: 2, h: 3 },
  countdown: { x: 9, y: 2, w: 3, h: 3 },
  projects: { x: 0, y: 5, w: 7, h: 5 },
  upcoming: { x: 7, y: 5, w: 5, h: 5 },
  habits: { x: 0, y: 10, w: 7, h: 4 },
  activity: { x: 7, y: 10, w: 5, h: 4 },
  "weekly-review": { x: 0, y: 14, w: 12, h: 6 },
  calendar: { x: 0, y: 20, w: 12, h: 7 },
  "vault-stats": { x: 0, y: 27, w: 12, h: 2 },
};

const COMMAND_032_LAYOUT: Record<string, WidgetLayout> = {
  "quick-capture": { x: 0, y: 0, w: 3, h: 4 },
  "today-tasks": { x: 3, y: 0, w: 3, h: 4 },
  progress: { x: 6, y: 0, w: 3, h: 4 },
  upcoming: { x: 9, y: 0, w: 3, h: 8 },
  projects: { x: 0, y: 4, w: 9, h: 4 },
  activity: { x: 0, y: 8, w: 9, h: 4 },
  countdown: { x: 9, y: 8, w: 3, h: 4 },
  habits: { x: 0, y: 12, w: 12, h: 4 },
  calendar: { x: 0, y: 16, w: 12, h: 7 },
  "weekly-review": { x: 0, y: 23, w: 12, h: 6 },
  "vault-stats": { x: 0, y: 29, w: 12, h: 2 },
};

function sameLayout(a: WidgetLayout, b: WidgetLayout): boolean {
  return a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;
}

function matchesPreset(
  dashboard: DashboardDefinition,
  preset: Record<string, WidgetLayout>,
  gap: number,
  rowHeight: number,
): boolean {
  if (dashboard.id !== "home") return false;
  if (dashboard.settings.columns !== 12 || dashboard.settings.gap !== gap || dashboard.settings.rowHeight !== rowHeight) return false;
  if (dashboard.widgets.length !== Object.keys(preset).length) return false;
  return dashboard.widgets.every((widget) => {
    const expected = preset[widget.id];
    return expected ? sameLayout(widget.layout, expected) : false;
  });
}

export function usesLegacyHomeLayout(dashboard: DashboardDefinition): boolean {
  return matchesPreset(dashboard, LEGACY_LAYOUT, 14, 58)
    || matchesPreset(dashboard, POLISHED_024_LAYOUT, 12, 56)
    || matchesPreset(dashboard, STUDIO_031_LAYOUT, 14, 58)
    || matchesPreset(dashboard, COMMAND_032_LAYOUT, 8, 44);
}

export function upgradeLegacyHomeLayout(
  dashboard: DashboardDefinition,
  registry: WidgetRegistry,
): DashboardDefinition {
  if (!usesLegacyHomeLayout(dashboard)) return dashboard;

  const refined = createDefaultDashboard(registry);
  const refinedById = new Map(refined.widgets.map((widget) => [widget.id, widget]));
  return {
    ...dashboard,
    settings: {
      ...dashboard.settings,
      gap: refined.settings.gap,
      rowHeight: refined.settings.rowHeight,
    },
    widgets: dashboard.widgets.map((widget) => {
      const next = refinedById.get(widget.id);
      return next ? { ...widget, layout: { ...next.layout } } : widget;
    }),
    updatedAt: Date.now(),
  };
}

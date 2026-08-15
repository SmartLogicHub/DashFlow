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

function sameLayout(a: WidgetLayout, b: WidgetLayout): boolean {
  return a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;
}

export function usesLegacyHomeLayout(dashboard: DashboardDefinition): boolean {
  if (dashboard.id !== "home") return false;
  if (dashboard.settings.columns !== 12 || dashboard.settings.gap !== 14 || dashboard.settings.rowHeight !== 58) return false;
  if (dashboard.widgets.length !== Object.keys(LEGACY_LAYOUT).length) return false;

  return dashboard.widgets.every((widget) => {
    const legacy = LEGACY_LAYOUT[widget.id];
    return legacy ? sameLayout(widget.layout, legacy) : false;
  });
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

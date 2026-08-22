import type { DashboardDefinition, WidgetInstance } from "../models";
import type { WidgetRegistry } from "../widgets/WidgetRegistry";

function makeWidget(registry: WidgetRegistry, id: string, type: string, x: number, y: number, w: number, h: number, config: Record<string, unknown> = {}, title?: string): WidgetInstance {
  const definition = registry.get(type);
  return {
    id,
    type,
    title,
    layout: { x, y, w, h },
    config: { ...(definition?.defaultConfig() ?? {}), ...config },
    hidden: false,
  };
}

export function createDefaultDashboard(registry: WidgetRegistry): DashboardDefinition {
  const now = Date.now();
  const widgets: WidgetInstance[] = [
    makeWidget(registry, "quick-capture", "quick-capture", 0, 0, 3, 4),
    makeWidget(registry, "today-tasks", "tasks", 3, 0, 5, 4),
    makeWidget(registry, "progress", "progress", 8, 0, 4, 4),
    makeWidget(registry, "projects", "projects", 0, 4, 8, 6),
    makeWidget(registry, "upcoming", "upcoming", 8, 4, 4, 6),
    makeWidget(registry, "activity", "heatmap", 0, 10, 8, 4),
    makeWidget(registry, "countdown", "countdown", 8, 10, 4, 4),
    makeWidget(registry, "habits", "habits", 0, 14, 12, 6),
    makeWidget(registry, "calendar", "calendar", 0, 20, 12, 9),
    makeWidget(registry, "weekly-review", "weekly-review", 0, 29, 12, 6),
    makeWidget(registry, "vault-stats", "vault-stats", 0, 35, 12, 3),
  ];
  return {
    id: "home",
    name: "默认工作台",
    icon: "layout-dashboard",
    settings: { columns: 12, gap: 8, rowHeight: 38, showHeader: true },
    widgets,
    mobile: { order: widgets.map((widget) => widget.id), collapsedWidgetIds: [], compactMode: false },
    createdAt: now,
    updatedAt: now,
  };
}

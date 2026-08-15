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
    makeWidget(registry, "today-tasks", "tasks", 0, 0, 7, 5),
    makeWidget(registry, "quick-capture", "quick-capture", 7, 0, 5, 2),
    makeWidget(registry, "progress", "progress", 7, 2, 2, 3),
    makeWidget(registry, "countdown", "countdown", 9, 2, 3, 3),
    makeWidget(registry, "projects", "projects", 0, 5, 7, 5),
    makeWidget(registry, "upcoming", "upcoming", 7, 5, 5, 5),
    makeWidget(registry, "habits", "habits", 0, 10, 7, 4),
    makeWidget(registry, "activity", "heatmap", 7, 10, 5, 4),
    makeWidget(registry, "weekly-review", "weekly-review", 0, 14, 12, 6),
    makeWidget(registry, "calendar", "calendar", 0, 20, 12, 7),
    makeWidget(registry, "vault-stats", "vault-stats", 0, 27, 12, 2),
  ];
  return {
    id: "home",
    name: "Home",
    icon: "layout-dashboard",
    settings: { columns: 12, gap: 14, rowHeight: 58, showHeader: true },
    widgets,
    mobile: { order: widgets.map((widget) => widget.id), collapsedWidgetIds: [], compactMode: false },
    createdAt: now,
    updatedAt: now,
  };
}

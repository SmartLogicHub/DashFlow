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
    makeWidget(registry, "quick-capture", "quick-capture", 0, 0, 4, 3),
    makeWidget(registry, "today-tasks", "tasks", 4, 0, 4, 5),
    makeWidget(registry, "progress", "progress", 8, 0, 4, 3),
    makeWidget(registry, "projects", "projects", 0, 5, 8, 4),
    makeWidget(registry, "upcoming", "upcoming", 8, 3, 4, 6),
    makeWidget(registry, "activity", "heatmap", 0, 9, 8, 4),
    makeWidget(registry, "countdown", "countdown", 8, 9, 4, 4),
    makeWidget(registry, "habits", "habits", 0, 13, 12, 5),
    makeWidget(registry, "weekly-review", "weekly-review", 0, 18, 12, 7),
    makeWidget(registry, "calendar", "calendar", 0, 25, 12, 8),
    makeWidget(registry, "vault-stats", "vault-stats", 0, 33, 8, 3),
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

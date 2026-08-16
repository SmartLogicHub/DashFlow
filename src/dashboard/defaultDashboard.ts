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
    makeWidget(registry, "quick-capture", "quick-capture", 0, 0, 3, 3),
    makeWidget(registry, "today-tasks", "tasks", 3, 0, 5, 3),
    makeWidget(registry, "progress", "progress", 8, 0, 4, 3),
    makeWidget(registry, "projects", "projects", 0, 3, 8, 4),
    makeWidget(registry, "upcoming", "upcoming", 8, 3, 4, 4),
    makeWidget(registry, "activity", "heatmap", 0, 7, 8, 4),
    makeWidget(registry, "countdown", "countdown", 8, 7, 4, 4),
    makeWidget(registry, "habits", "habits", 0, 11, 12, 4),
    makeWidget(registry, "calendar", "calendar", 0, 15, 12, 7),
    makeWidget(registry, "weekly-review", "weekly-review", 0, 22, 12, 6),
    makeWidget(registry, "vault-stats", "vault-stats", 0, 28, 12, 2),
  ];
  return {
    id: "home",
    name: "Home",
    icon: "layout-dashboard",
    settings: { columns: 12, gap: 8, rowHeight: 38, showHeader: true },
    widgets,
    mobile: { order: widgets.map((widget) => widget.id), collapsedWidgetIds: [], compactMode: false },
    createdAt: now,
    updatedAt: now,
  };
}

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
    makeWidget(registry, "today-tasks", "tasks", 3, 0, 3, 4),
    makeWidget(registry, "progress", "progress", 6, 0, 3, 4),
    makeWidget(registry, "upcoming", "upcoming", 9, 0, 3, 8),
    makeWidget(registry, "projects", "projects", 0, 4, 9, 4),
    makeWidget(registry, "activity", "heatmap", 0, 8, 9, 4),
    makeWidget(registry, "countdown", "countdown", 9, 8, 3, 4),
    makeWidget(registry, "habits", "habits", 0, 12, 12, 4),
    makeWidget(registry, "calendar", "calendar", 0, 16, 12, 7),
    makeWidget(registry, "weekly-review", "weekly-review", 0, 23, 12, 6),
    makeWidget(registry, "vault-stats", "vault-stats", 0, 29, 12, 2),
  ];
  return {
    id: "home",
    name: "Home",
    icon: "layout-dashboard",
    settings: { columns: 12, gap: 8, rowHeight: 44, showHeader: true },
    widgets,
    mobile: { order: widgets.map((widget) => widget.id), collapsedWidgetIds: [], compactMode: false },
    createdAt: now,
    updatedAt: now,
  };
}

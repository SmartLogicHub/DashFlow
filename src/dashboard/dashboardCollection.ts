import type { DashboardDefinition, WidgetInstance } from "../models";

export function normalizeDashboardName(value: string): string {
  return value.trim().replace(/\s+/g, " ").slice(0, 48);
}

function dashboardSlug(value: string): string {
  const normalized = normalizeDashboardName(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32)
    .replace(/-+$/g, "");
  return normalized || "dashboard";
}

export function nextDashboardId(name: string, existingIds: Iterable<string>): string {
  const used = new Set(existingIds);
  const base = dashboardSlug(name);
  if (!used.has(base)) return base;
  let suffix = 2;
  while (used.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

export function nextDuplicateDashboardName(sourceName: string, existingNames: Iterable<string>): string {
  const used = new Set([...existingNames].map((name) => normalizeDashboardName(name).toLocaleLowerCase()));
  const base = `${normalizeDashboardName(sourceName) || "工作台"} 副本`;
  if (!used.has(base.toLocaleLowerCase())) return base;
  let suffix = 2;
  while (used.has(`${base} ${suffix}`.toLocaleLowerCase())) suffix += 1;
  return `${base} ${suffix}`;
}

function clonedWidgetId(dashboardId: string, widget: WidgetInstance, index: number): string {
  return `${dashboardId}-${widget.type}-${index + 1}`;
}

function cloneWidget(
  widget: WidgetInstance,
  dashboardId: string,
  index: number,
): WidgetInstance {
  return {
    ...widget,
    id: clonedWidgetId(dashboardId, widget, index),
    layout: { ...widget.layout },
    config: { ...widget.config },
  };
}

export function cloneDashboardDefinition(
  source: DashboardDefinition,
  id: string,
  name: string,
  now = Date.now(),
): DashboardDefinition {
  const widgets = source.widgets.map((widget, index) => cloneWidget(widget, id, index));
  const idMap = new Map(
    source.widgets.map((widget, index) => [widget.id, clonedWidgetId(id, widget, index)]),
  );
  const preferredOrder = source.mobile?.order ?? source.widgets.map((widget) => widget.id);
  const order = preferredOrder
    .map((widgetId) => idMap.get(widgetId))
    .filter((widgetId): widgetId is string => Boolean(widgetId));
  for (const widget of widgets) {
    if (!order.includes(widget.id)) order.push(widget.id);
  }
  const collapsedWidgetIds = (source.mobile?.collapsedWidgetIds ?? [])
    .map((widgetId) => idMap.get(widgetId))
    .filter((widgetId): widgetId is string => Boolean(widgetId));

  return {
    ...source,
    id,
    name: normalizeDashboardName(name) || "工作台",
    settings: { ...source.settings },
    widgets,
    mobile: {
      order,
      collapsedWidgetIds,
      compactMode: source.mobile?.compactMode === true,
    },
    createdAt: now,
    updatedAt: now,
  };
}

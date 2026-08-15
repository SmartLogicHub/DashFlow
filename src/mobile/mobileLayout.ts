import type { WidgetInstance } from "../models";

export type MobileMoveDirection = -1 | 1;

export function desktopWidgetOrder(widgets: WidgetInstance[]): string[] {
  return [...widgets]
    .sort((a, b) => a.layout.y - b.layout.y
      || a.layout.x - b.layout.x
      || a.id.localeCompare(b.id))
    .map((widget) => widget.id);
}

export function normalizeMobileOrder(
  widgets: WidgetInstance[],
  storedOrder: string[] = [],
): string[] {
  const validIds = new Set(widgets.map((widget) => widget.id));
  const seen = new Set<string>();
  const order: string[] = [];

  for (const id of storedOrder) {
    if (!validIds.has(id) || seen.has(id)) continue;
    seen.add(id);
    order.push(id);
  }

  for (const id of desktopWidgetOrder(widgets)) {
    if (seen.has(id)) continue;
    seen.add(id);
    order.push(id);
  }

  return order;
}

export function normalizeCollapsedWidgetIds(
  widgets: WidgetInstance[],
  collapsedWidgetIds: string[] = [],
): string[] {
  const validIds = new Set(widgets.map((widget) => widget.id));
  return [...new Set(collapsedWidgetIds)].filter((id) => validIds.has(id));
}

export function reorderVisibleMobileOrder(
  widgets: WidgetInstance[],
  storedOrder: string[],
  visibleIds: string[],
  widgetId: string,
  direction: MobileMoveDirection,
): string[] {
  const order = normalizeMobileOrder(widgets, storedOrder);
  const visibleSet = new Set(visibleIds);
  const visibleOrder = order.filter((id) => visibleSet.has(id));
  const sourceIndex = visibleOrder.indexOf(widgetId);
  if (sourceIndex < 0) return order;

  const targetIndex = sourceIndex + direction;
  if (targetIndex < 0 || targetIndex >= visibleOrder.length) return order;

  const targetId = visibleOrder[targetIndex]!;
  const sourcePosition = order.indexOf(widgetId);
  const targetPosition = order.indexOf(targetId);
  if (sourcePosition < 0 || targetPosition < 0) return order;

  const next = [...order];
  [next[sourcePosition], next[targetPosition]] = [next[targetPosition]!, next[sourcePosition]!];
  return next;
}

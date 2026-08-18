import type { WidgetInstance, WidgetLayout, WidgetSize } from "../models";

export interface GridMetrics {
  columns: number;
  gap: number;
  rowHeight: number;
  containerWidth: number;
}

function comparePosition(a: WidgetInstance, b: WidgetInstance): number {
  return a.layout.y - b.layout.y || a.layout.x - b.layout.x || a.id.localeCompare(b.id);
}

function cloneWidgets(widgets: WidgetInstance[]): WidgetInstance[] {
  return widgets.map((widget) => ({
    ...widget,
    layout: { ...widget.layout },
    config: { ...widget.config },
  }));
}

function visibleWidgets(widgets: WidgetInstance[]): WidgetInstance[] {
  return widgets.filter((widget) => !widget.hidden);
}

export function layoutsCollide(a: WidgetLayout, b: WidgetLayout): boolean {
  return !(
    a.x + a.w <= b.x
    || b.x + b.w <= a.x
    || a.y + a.h <= b.y
    || b.y + b.h <= a.y
  );
}

export function clampLayout(layout: WidgetLayout, columns: number): WidgetLayout {
  const w = Math.max(1, Math.min(columns, Math.round(layout.w)));
  const h = Math.max(1, Math.round(layout.h));
  const x = Math.max(0, Math.min(columns - w, Math.round(layout.x)));
  const y = Math.max(0, Math.round(layout.y));
  return { x, y, w, h };
}

export function hasLayoutCollisions(widgets: WidgetInstance[]): boolean {
  const visible = visibleWidgets(widgets);
  for (let index = 0; index < visible.length; index += 1) {
    const current = visible[index];
    if (!current) continue;
    for (let otherIndex = index + 1; otherIndex < visible.length; otherIndex += 1) {
      const other = visible[otherIndex];
      if (other && layoutsCollide(current.layout, other.layout)) return true;
    }
  }
  return false;
}

function repairOverlaps(
  widgets: WidgetInstance[],
  columns: number,
  pinnedId?: string,
): WidgetInstance[] {
  const result = cloneWidgets(widgets);
  for (const widget of result) {
    if (!widget.hidden) widget.layout = clampLayout(widget.layout, columns);
  }

  const pinned = pinnedId ? result.find((widget) => widget.id === pinnedId && !widget.hidden) : undefined;
  const ordered = visibleWidgets(result)
    .filter((widget) => widget.id !== pinnedId)
    .sort(comparePosition);
  const placed: WidgetInstance[] = pinned ? [pinned] : [];

  for (const widget of ordered) {
    let candidate = { ...widget.layout };
    let guard = 0;

    while (guard < Math.max(8, result.length * 4)) {
      const collisions = placed.filter((other) => layoutsCollide(candidate, other.layout));
      if (collisions.length === 0) break;
      candidate = {
        ...candidate,
        y: Math.max(...collisions.map((other) => other.layout.y + other.layout.h)),
      };
      guard += 1;
    }

    widget.layout = candidate;
    placed.push(widget);
  }

  return result;
}

export function compactWidgetLayout(
  widgets: WidgetInstance[],
  columns: number,
  pinnedId?: string,
): WidgetInstance[] {
  const result = repairOverlaps(widgets, columns, pinnedId);
  const ordered = visibleWidgets(result)
    .filter((widget) => widget.id !== pinnedId)
    .sort(comparePosition);

  for (const widget of ordered) {
    while (widget.layout.y > 0) {
      const candidate = { ...widget.layout, y: widget.layout.y - 1 };
      const blocked = visibleWidgets(result).some(
        (other) => other.id !== widget.id && layoutsCollide(candidate, other.layout),
      );
      if (blocked) break;
      widget.layout = candidate;
    }
  }

  return result;
}

export function resolveWidgetLayout(
  widgets: WidgetInstance[],
  activeId: string,
  activeLayout: WidgetLayout,
  columns: number,
): WidgetInstance[] {
  const next = cloneWidgets(widgets);
  const active = next.find((widget) => widget.id === activeId);
  if (!active || active.hidden) return compactWidgetLayout(next, columns);

  active.layout = clampLayout(activeLayout, columns);
  return compactWidgetLayout(next, columns, activeId);
}

export function findFirstAvailableLayout(
  widgets: WidgetInstance[],
  size: WidgetSize,
  columns: number,
): WidgetLayout {
  const w = Math.max(1, Math.min(columns, Math.round(size.w)));
  const h = Math.max(1, Math.round(size.h));
  const visible = visibleWidgets(widgets);
  const bottom = visible.reduce(
    (max, widget) => Math.max(max, widget.layout.y + widget.layout.h),
    0,
  );

  for (let y = 0; y <= bottom; y += 1) {
    for (let x = 0; x <= columns - w; x += 1) {
      const candidate = { x, y, w, h };
      if (!visible.some((widget) => layoutsCollide(candidate, widget.layout))) return candidate;
    }
  }

  return { x: 0, y: bottom, w, h };
}

export function moveLayout(
  initial: WidgetLayout,
  dx: number,
  dy: number,
  metrics: GridMetrics,
): WidgetLayout {
  const columnWidth = (metrics.containerWidth - metrics.gap * (metrics.columns - 1)) / metrics.columns;
  const stepX = Math.max(1, columnWidth + metrics.gap);
  const stepY = Math.max(1, metrics.rowHeight + metrics.gap);

  return clampLayout({
    ...initial,
    x: Math.round(initial.x + dx / stepX),
    y: Math.round(initial.y + dy / stepY),
  }, metrics.columns);
}

export function resizeLayout(
  initial: WidgetLayout,
  dx: number,
  dy: number,
  metrics: GridMetrics,
  min?: WidgetSize,
  max?: WidgetSize,
): WidgetLayout {
  const columnWidth = (metrics.containerWidth - metrics.gap * (metrics.columns - 1)) / metrics.columns;
  const stepX = Math.max(1, columnWidth + metrics.gap);
  const stepY = Math.max(1, metrics.rowHeight + metrics.gap);
  const minW = Math.max(1, min?.w ?? 2);
  const minH = Math.max(1, min?.h ?? 2);
  const maxW = Math.min(max?.w ?? metrics.columns, metrics.columns - initial.x);
  const maxH = max?.h ?? 99;

  return clampLayout({
    ...initial,
    w: Math.max(minW, Math.min(maxW, Math.round(initial.w + dx / stepX))),
    h: Math.max(minH, Math.min(maxH, Math.round(initial.h + dy / stepY))),
  }, metrics.columns);
}

import type { WidgetLayout, WidgetSize } from "../models";

export interface GridMetrics {
  columns: number;
  gap: number;
  rowHeight: number;
  containerWidth: number;
}

export function moveLayout(
  initial: WidgetLayout,
  dx: number,
  dy: number,
  metrics: GridMetrics,
): WidgetLayout {
  const columnWidth = (metrics.containerWidth - metrics.gap * (metrics.columns - 1)) / metrics.columns;
  const stepX = columnWidth + metrics.gap;
  const stepY = metrics.rowHeight + metrics.gap;

  return {
    ...initial,
    x: Math.max(0, Math.min(metrics.columns - initial.w, Math.round(initial.x + dx / stepX))),
    y: Math.max(0, Math.round(initial.y + dy / stepY)),
  };
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
  const stepX = columnWidth + metrics.gap;
  const stepY = metrics.rowHeight + metrics.gap;
  const minW = min?.w ?? 2;
  const minH = min?.h ?? 2;
  const maxW = Math.min(max?.w ?? metrics.columns, metrics.columns - initial.x);
  const maxH = max?.h ?? 99;

  return {
    ...initial,
    w: Math.max(minW, Math.min(maxW, Math.round(initial.w + dx / stepX))),
    h: Math.max(minH, Math.min(maxH, Math.round(initial.h + dy / stepY))),
  };
}

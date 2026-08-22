export const DASHFLOW_CONFIGURE_WIDGET_EVENT = "dashflow:configure-widget";

export interface WidgetConfigRequestDetail {
  widgetId: string;
}

export function widgetConfigRequestId(detail: unknown): string | null {
  if (!detail || typeof detail !== "object") return null;
  const widgetId = (detail as Partial<WidgetConfigRequestDetail>).widgetId;
  return typeof widgetId === "string" && widgetId.trim() ? widgetId : null;
}


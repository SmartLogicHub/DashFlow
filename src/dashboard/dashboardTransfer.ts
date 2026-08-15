import type {
  DashboardDefinition,
  DashboardMobileSettings,
  DashboardSettings,
  WidgetInstance,
  WidgetLayout,
} from "../models";
import { layoutsCollide } from "../layout/grid";
import { normalizeDashboardName } from "./dashboardCollection";

export const DASHBOARD_TRANSFER_KIND = "dashflow-dashboard" as const;
export const DASHBOARD_TRANSFER_VERSION = 1 as const;

const MAX_TRANSFER_LENGTH = 1_000_000;
const MAX_WIDGETS = 100;
const MAX_CONFIG_LENGTH = 100_000;

interface PortableDashboard {
  name: string;
  icon?: string;
  settings: DashboardSettings;
  widgets: WidgetInstance[];
  mobile: DashboardMobileSettings;
}

export interface DashboardTransferEnvelope {
  kind: typeof DASHBOARD_TRANSFER_KIND;
  formatVersion: typeof DASHBOARD_TRANSFER_VERSION;
  sourcePluginVersion: string;
  exportedAt: string;
  dashboard: PortableDashboard;
}

export class DashboardTransferError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DashboardTransferError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function fail(message: string): never {
  throw new DashboardTransferError(message);
}

function stringValue(value: unknown, field: string, maxLength: number): string {
  if (typeof value !== "string") fail(`${field} 必须是字符串`);
  const normalized = value.trim();
  if (!normalized) fail(`${field} 不能为空`);
  if (normalized.length > maxLength) fail(`${field} 过长`);
  return normalized;
}

function optionalString(value: unknown, field: string, maxLength: number): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  return stringValue(value, field, maxLength);
}

function integerValue(
  value: unknown,
  field: string,
  min: number,
  max: number,
): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < min || value > max) {
    fail(`${field} 必须是 ${min}–${max} 之间的整数`);
  }
  return value;
}

function booleanValue(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function cloneConfig(value: unknown, field: string): Record<string, unknown> {
  if (!isRecord(value)) fail(`${field} 必须是 JSON 对象`);
  let serialized = "";
  try {
    serialized = JSON.stringify(value);
  } catch {
    fail(`${field} 不是可序列化的 JSON`);
  }
  if (serialized.length > MAX_CONFIG_LENGTH) fail(`${field} 过大`);
  return JSON.parse(serialized) as Record<string, unknown>;
}

function parseSettings(value: unknown): DashboardSettings {
  if (!isRecord(value)) fail("dashboard.settings 缺失或格式错误");
  const columns = integerValue(value.columns, "dashboard.settings.columns", 1, 24);
  return {
    columns,
    gap: integerValue(value.gap, "dashboard.settings.gap", 0, 64),
    rowHeight: integerValue(value.rowHeight, "dashboard.settings.rowHeight", 20, 240),
    compactMode: booleanValue(value.compactMode, false),
    showHeader: booleanValue(value.showHeader, true),
  };
}

function parseLayout(value: unknown, columns: number, index: number): WidgetLayout {
  if (!isRecord(value)) fail(`widgets[${index}].layout 格式错误`);
  const x = integerValue(value.x, `widgets[${index}].layout.x`, 0, columns - 1);
  const y = integerValue(value.y, `widgets[${index}].layout.y`, 0, 10_000);
  const w = integerValue(value.w, `widgets[${index}].layout.w`, 1, columns);
  const h = integerValue(value.h, `widgets[${index}].layout.h`, 1, 200);
  if (x + w > columns) fail(`widgets[${index}] 超出 ${columns} 列布局边界`);
  return { x, y, w, h };
}

function parseWidgets(value: unknown, columns: number): WidgetInstance[] {
  if (!Array.isArray(value) || value.length === 0) fail("dashboard.widgets 必须至少包含一张卡片");
  if (value.length > MAX_WIDGETS) fail(`dashboard.widgets 最多支持 ${MAX_WIDGETS} 张卡片`);

  const usedIds = new Set<string>();
  const widgets = value.map((item, index): WidgetInstance => {
    if (!isRecord(item)) fail(`widgets[${index}] 格式错误`);
    const id = stringValue(item.id, `widgets[${index}].id`, 128);
    if (usedIds.has(id)) fail(`Widget ID 重复：${id}`);
    usedIds.add(id);
    const type = stringValue(item.type, `widgets[${index}].type`, 64);
    const title = optionalString(item.title, `widgets[${index}].title`, 128);
    const widget: WidgetInstance = {
      id,
      type,
      layout: parseLayout(item.layout, columns, index),
      config: cloneConfig(item.config ?? {}, `widgets[${index}].config`),
      hidden: booleanValue(item.hidden, false),
    };
    if (title) widget.title = title;
    return widget;
  });

  const visible = widgets.filter((widget) => !widget.hidden);
  for (let index = 0; index < visible.length; index += 1) {
    const current = visible[index];
    if (!current) continue;
    for (let otherIndex = index + 1; otherIndex < visible.length; otherIndex += 1) {
      const other = visible[otherIndex];
      if (other && layoutsCollide(current.layout, other.layout)) {
        fail(`Widget 布局发生碰撞：${current.id} / ${other.id}`);
      }
    }
  }

  return widgets;
}

function normalizedIdList(value: unknown, validIds: Set<string>, field: string): string[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) fail(`${field} 必须是数组`);
  const result: string[] = [];
  for (const item of value) {
    if (typeof item !== "string") fail(`${field} 只能包含 Widget ID`);
    if (validIds.has(item) && !result.includes(item)) result.push(item);
  }
  return result;
}

function parseMobile(value: unknown, widgets: WidgetInstance[]): DashboardMobileSettings {
  const validIds = new Set(widgets.map((widget) => widget.id));
  if (value !== undefined && value !== null && !isRecord(value)) {
    fail("dashboard.mobile 格式错误");
  }
  const record = isRecord(value) ? value : {};
  const order = normalizedIdList(record.order, validIds, "dashboard.mobile.order");
  for (const widget of widgets) {
    if (!order.includes(widget.id)) order.push(widget.id);
  }
  return {
    order,
    collapsedWidgetIds: normalizedIdList(
      record.collapsedWidgetIds,
      validIds,
      "dashboard.mobile.collapsedWidgetIds",
    ),
    compactMode: booleanValue(record.compactMode, false),
  };
}

function portableDashboard(dashboard: DashboardDefinition): PortableDashboard {
  return {
    name: dashboard.name,
    icon: dashboard.icon,
    settings: { ...dashboard.settings },
    widgets: dashboard.widgets.map((widget) => ({
      ...widget,
      layout: { ...widget.layout },
      config: JSON.parse(JSON.stringify(widget.config)) as Record<string, unknown>,
    })),
    mobile: {
      order: [...(dashboard.mobile?.order ?? dashboard.widgets.map((widget) => widget.id))],
      collapsedWidgetIds: [...(dashboard.mobile?.collapsedWidgetIds ?? [])],
      compactMode: dashboard.mobile?.compactMode === true,
    },
  };
}

export function serializeDashboardTransfer(
  dashboard: DashboardDefinition,
  sourcePluginVersion: string,
): string {
  const envelope: DashboardTransferEnvelope = {
    kind: DASHBOARD_TRANSFER_KIND,
    formatVersion: DASHBOARD_TRANSFER_VERSION,
    sourcePluginVersion,
    exportedAt: new Date().toISOString(),
    dashboard: portableDashboard(dashboard),
  };
  return JSON.stringify(envelope, null, 2);
}

export function parseDashboardTransferJson(text: string): DashboardDefinition {
  const trimmed = text.trim();
  if (!trimmed) fail("请粘贴 DashFlow Dashboard JSON");
  if (trimmed.length > MAX_TRANSFER_LENGTH) fail("Dashboard JSON 过大");

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    fail("JSON 格式无效");
  }
  if (!isRecord(parsed)) fail("导入内容必须是 JSON 对象");
  if (parsed.kind !== DASHBOARD_TRANSFER_KIND) fail("这不是 DashFlow Dashboard 导出文件");
  if (parsed.formatVersion !== DASHBOARD_TRANSFER_VERSION) {
    fail(`不支持的 Dashboard 导出格式版本：${String(parsed.formatVersion)}`);
  }
  if (!isRecord(parsed.dashboard)) fail("导出文件缺少 dashboard 数据");

  const source = parsed.dashboard;
  const name = normalizeDashboardName(stringValue(source.name, "dashboard.name", 48));
  const settings = parseSettings(source.settings);
  const widgets = parseWidgets(source.widgets, settings.columns);
  const mobile = parseMobile(source.mobile, widgets);
  const icon = optionalString(source.icon, "dashboard.icon", 64);

  return {
    id: "imported",
    name: name || "Imported Dashboard",
    ...(icon ? { icon } : {}),
    settings,
    widgets,
    mobile,
    createdAt: 0,
    updatedAt: 0,
  };
}

export function unsupportedDashboardWidgetTypes(
  dashboard: DashboardDefinition,
  knownTypes: Iterable<string>,
): string[] {
  const known = new Set(knownTypes);
  return [...new Set(dashboard.widgets.map((widget) => widget.type).filter((type) => !known.has(type)))]
    .sort((a, b) => a.localeCompare(b));
}

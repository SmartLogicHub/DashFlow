import type DashFlowPlugin from "../main";
import type { DashboardDefinition, DashboardMobileSettings, WidgetInstance } from "../models";
import type { WidgetRegistry } from "../widgets/WidgetRegistry";
import { compactWidgetLayout, findFirstAvailableLayout } from "../layout/grid";
import {
  desktopWidgetOrder,
  normalizeCollapsedWidgetIds,
  normalizeMobileOrder,
  reorderVisibleMobileOrder,
  type MobileMoveDirection,
} from "../mobile/mobileLayout";
import {
  cloneDashboardDefinition,
  nextDashboardId,
  nextDuplicateDashboardName,
  normalizeDashboardName,
} from "./dashboardCollection";
import { createDefaultDashboard } from "./defaultDashboard";
import {
  createDashboardFromTemplate,
  DEFAULT_DASHBOARD_TEMPLATE_ID,
  type DashboardTemplateId,
} from "./dashboardTemplates";

export class DashboardManager {
  private readonly listeners = new Set<() => void>();

  constructor(
    private readonly plugin: DashFlowPlugin,
    private readonly registry: WidgetRegistry,
  ) {}

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  list(): DashboardDefinition[] {
    return [...this.plugin.data.dashboards];
  }

  active(): DashboardDefinition {
    let active = this.plugin.data.dashboards.find(
      (dashboard) => dashboard.id === this.plugin.data.activeDashboardId,
    );
    if (active) return active;

    active = this.plugin.data.dashboards[0];
    if (!active) {
      active = createDefaultDashboard(this.registry);
      this.plugin.data.dashboards.push(active);
    }
    this.plugin.data.activeDashboardId = active.id;
    return active;
  }

  async setActiveDashboard(dashboardId: string): Promise<boolean> {
    const dashboard = this.plugin.data.dashboards.find((item) => item.id === dashboardId);
    if (!dashboard) return false;
    if (this.plugin.data.activeDashboardId === dashboardId) return true;
    this.plugin.data.activeDashboardId = dashboardId;
    await this.plugin.savePluginData();
    this.emit();
    return true;
  }

  async createDashboard(
    name: string,
    templateId: DashboardTemplateId = DEFAULT_DASHBOARD_TEMPLATE_ID,
  ): Promise<DashboardDefinition | null> {
    const normalizedName = normalizeDashboardName(name);
    if (!normalizedName) return null;
    const id = nextDashboardId(normalizedName, this.plugin.data.dashboards.map((item) => item.id));
    const template = createDashboardFromTemplate(this.registry, templateId);
    const dashboard = cloneDashboardDefinition(template, id, normalizedName);
    this.plugin.data.dashboards.push(dashboard);
    this.plugin.data.activeDashboardId = dashboard.id;
    await this.plugin.savePluginData();
    this.emit();
    return dashboard;
  }

  async renameDashboard(dashboardId: string, name: string): Promise<boolean> {
    const normalizedName = normalizeDashboardName(name);
    if (!normalizedName) return false;
    const dashboard = this.plugin.data.dashboards.find((item) => item.id === dashboardId);
    if (!dashboard) return false;
    if (dashboard.name === normalizedName) return true;
    dashboard.name = normalizedName;
    dashboard.updatedAt = Date.now();
    await this.plugin.savePluginData();
    this.emit();
    return true;
  }

  async duplicateDashboard(dashboardId: string, name?: string): Promise<DashboardDefinition | null> {
    const source = this.plugin.data.dashboards.find((item) => item.id === dashboardId);
    if (!source) return null;
    const copyName = normalizeDashboardName(name ?? "") || nextDuplicateDashboardName(
      source.name,
      this.plugin.data.dashboards.map((item) => item.name),
    );
    const id = nextDashboardId(copyName, this.plugin.data.dashboards.map((item) => item.id));
    const dashboard = cloneDashboardDefinition(source, id, copyName);
    this.plugin.data.dashboards.push(dashboard);
    this.plugin.data.activeDashboardId = dashboard.id;
    await this.plugin.savePluginData();
    this.emit();
    return dashboard;
  }

  async deleteDashboard(dashboardId: string): Promise<boolean> {
    if (this.plugin.data.dashboards.length <= 1) return false;
    const index = this.plugin.data.dashboards.findIndex((item) => item.id === dashboardId);
    if (index < 0) return false;
    const wasActive = this.plugin.data.activeDashboardId === dashboardId;
    this.plugin.data.dashboards.splice(index, 1);
    if (wasActive) {
      const fallback = (
        this.plugin.data.dashboards[Math.min(index, this.plugin.data.dashboards.length - 1)]
        ?? this.plugin.data.dashboards[0]
      )!;
      this.plugin.data.activeDashboardId = fallback.id;
    }
    await this.plugin.savePluginData();
    this.emit();
    return true;
  }

  mobileState(dashboard: DashboardDefinition): DashboardMobileSettings {
    return {
      order: normalizeMobileOrder(dashboard.widgets, dashboard.mobile?.order),
      collapsedWidgetIds: normalizeCollapsedWidgetIds(
        dashboard.widgets,
        dashboard.mobile?.collapsedWidgetIds,
      ),
      compactMode: dashboard.mobile?.compactMode === true,
    };
  }

  async updateDashboard(next: DashboardDefinition): Promise<void> {
    const index = this.plugin.data.dashboards.findIndex((dashboard) => dashboard.id === next.id);
    const value = { ...next, updatedAt: Date.now() };
    if (index >= 0) this.plugin.data.dashboards[index] = value;
    else this.plugin.data.dashboards.push(value);
    await this.plugin.savePluginData();
    this.emit();
  }

  async updateWidget(
    dashboardId: string,
    widgetId: string,
    updater: (widget: WidgetInstance) => WidgetInstance,
  ): Promise<void> {
    const dashboard = this.plugin.data.dashboards.find((item) => item.id === dashboardId);
    if (!dashboard) return;
    const widgets = dashboard.widgets.map((widget) => widget.id === widgetId ? updater(widget) : widget);
    await this.updateDashboard({ ...dashboard, widgets });
  }

  async replaceWidgets(dashboardId: string, widgets: WidgetInstance[]): Promise<void> {
    const dashboard = this.plugin.data.dashboards.find((item) => item.id === dashboardId);
    if (!dashboard) return;
    await this.updateDashboard({ ...dashboard, widgets });
  }

  async removeWidget(dashboardId: string, widgetId: string): Promise<void> {
    const dashboard = this.plugin.data.dashboards.find((item) => item.id === dashboardId);
    if (!dashboard) return;
    const state = this.mobileState(dashboard);
    const remaining = dashboard.widgets.filter((widget) => widget.id !== widgetId);
    await this.updateDashboard({
      ...dashboard,
      widgets: compactWidgetLayout(remaining, dashboard.settings.columns),
      mobile: {
        ...state,
        order: state.order.filter((id) => id !== widgetId),
        collapsedWidgetIds: state.collapsedWidgetIds.filter((id) => id !== widgetId),
      },
    });
  }

  async addWidget(dashboardId: string, type: string): Promise<void> {
    const dashboard = this.plugin.data.dashboards.find((item) => item.id === dashboardId);
    const definition = this.registry.get(type);
    if (!dashboard || !definition) return;

    const layout = findFirstAvailableLayout(
      dashboard.widgets,
      definition.defaultSize,
      dashboard.settings.columns,
    );

    const widget: WidgetInstance = {
      id: `${type}-${Date.now().toString(36)}`,
      type,
      layout,
      config: definition.defaultConfig(),
      hidden: false,
    };
    const state = this.mobileState(dashboard);

    await this.updateDashboard({
      ...dashboard,
      widgets: compactWidgetLayout([...dashboard.widgets, widget], dashboard.settings.columns),
      mobile: {
        ...state,
        order: [...state.order, widget.id],
      },
    });
  }

  async moveMobileWidget(
    dashboardId: string,
    widgetId: string,
    direction: MobileMoveDirection,
    visibleIds?: string[],
  ): Promise<void> {
    const dashboard = this.plugin.data.dashboards.find((item) => item.id === dashboardId);
    if (!dashboard) return;
    const state = this.mobileState(dashboard);
    const visible = visibleIds ?? dashboard.widgets.filter((widget) => !widget.hidden).map((widget) => widget.id);
    const order = reorderVisibleMobileOrder(
      dashboard.widgets,
      state.order,
      visible,
      widgetId,
      direction,
    );
    if (order.join("|") === state.order.join("|")) return;
    await this.updateDashboard({ ...dashboard, mobile: { ...state, order } });
  }

  async toggleMobileCollapsed(dashboardId: string, widgetId: string): Promise<void> {
    const dashboard = this.plugin.data.dashboards.find((item) => item.id === dashboardId);
    if (!dashboard) return;
    const state = this.mobileState(dashboard);
    const collapsed = new Set(state.collapsedWidgetIds);
    if (collapsed.has(widgetId)) collapsed.delete(widgetId);
    else collapsed.add(widgetId);
    await this.updateDashboard({
      ...dashboard,
      mobile: { ...state, collapsedWidgetIds: [...collapsed] },
    });
  }

  async setMobileCompactMode(dashboardId: string, compactMode: boolean): Promise<void> {
    const dashboard = this.plugin.data.dashboards.find((item) => item.id === dashboardId);
    if (!dashboard) return;
    const state = this.mobileState(dashboard);
    if (state.compactMode === compactMode) return;
    await this.updateDashboard({ ...dashboard, mobile: { ...state, compactMode } });
  }

  async resetMobileLayout(dashboardId: string): Promise<void> {
    const dashboard = this.plugin.data.dashboards.find((item) => item.id === dashboardId);
    if (!dashboard) return;
    await this.updateDashboard({
      ...dashboard,
      mobile: {
        order: desktopWidgetOrder(dashboard.widgets),
        collapsedWidgetIds: [],
        compactMode: false,
      },
    });
  }

  async resetLayout(dashboardId: string): Promise<void> {
    const current = this.plugin.data.dashboards.find((item) => item.id === dashboardId);
    if (!current) return;
    const defaults = createDefaultDashboard(this.registry);
    await this.updateDashboard({
      ...current,
      widgets: defaults.widgets,
      settings: defaults.settings,
      mobile: defaults.mobile,
    });
  }

  private emit(): void {
    for (const listener of this.listeners) listener();
  }
}

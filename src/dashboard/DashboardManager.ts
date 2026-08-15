import type DashFlowPlugin from "../main";
import type { DashboardDefinition, WidgetInstance } from "../models";
import type { WidgetRegistry } from "../widgets/WidgetRegistry";
import { createDefaultDashboard } from "./defaultDashboard";

export class DashboardManager {
  constructor(
    private readonly plugin: DashFlowPlugin,
    private readonly registry: WidgetRegistry,
  ) {}

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

  async updateDashboard(next: DashboardDefinition): Promise<void> {
    const index = this.plugin.data.dashboards.findIndex((dashboard) => dashboard.id === next.id);
    const value = { ...next, updatedAt: Date.now() };
    if (index >= 0) this.plugin.data.dashboards[index] = value;
    else this.plugin.data.dashboards.push(value);
    await this.plugin.savePluginData();
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

  async removeWidget(dashboardId: string, widgetId: string): Promise<void> {
    const dashboard = this.plugin.data.dashboards.find((item) => item.id === dashboardId);
    if (!dashboard) return;
    await this.updateDashboard({
      ...dashboard,
      widgets: dashboard.widgets.filter((widget) => widget.id !== widgetId),
    });
  }

  async addWidget(dashboardId: string, type: string): Promise<void> {
    const dashboard = this.plugin.data.dashboards.find((item) => item.id === dashboardId);
    const definition = this.registry.get(type);
    if (!dashboard || !definition) return;

    const bottom = dashboard.widgets.reduce(
      (max, widget) => Math.max(max, widget.layout.y + widget.layout.h),
      0,
    );

    const widget: WidgetInstance = {
      id: `${type}-${Date.now().toString(36)}`,
      type,
      layout: {
        x: 0,
        y: bottom,
        w: Math.min(dashboard.settings.columns, definition.defaultSize.w),
        h: definition.defaultSize.h,
      },
      config: definition.defaultConfig(),
      hidden: false,
    };

    await this.updateDashboard({ ...dashboard, widgets: [...dashboard.widgets, widget] });
  }

  async resetLayout(dashboardId: string): Promise<void> {
    const current = this.plugin.data.dashboards.find((item) => item.id === dashboardId);
    if (!current) return;
    const defaults = createDefaultDashboard(this.registry);
    await this.updateDashboard({
      ...current,
      widgets: defaults.widgets,
      settings: defaults.settings,
    });
  }
}

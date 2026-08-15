import type DashFlowPlugin from "../main";
import type { DashboardDefinition, WidgetInstance } from "../models";
import type { WidgetRegistry } from "../widgets/WidgetRegistry";
import { compactWidgetLayout, findFirstAvailableLayout } from "../layout/grid";
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

  async replaceWidgets(dashboardId: string, widgets: WidgetInstance[]): Promise<void> {
    const dashboard = this.plugin.data.dashboards.find((item) => item.id === dashboardId);
    if (!dashboard) return;
    await this.updateDashboard({ ...dashboard, widgets });
  }

  async removeWidget(dashboardId: string, widgetId: string): Promise<void> {
    const dashboard = this.plugin.data.dashboards.find((item) => item.id === dashboardId);
    if (!dashboard) return;
    const remaining = dashboard.widgets.filter((widget) => widget.id !== widgetId);
    await this.updateDashboard({
      ...dashboard,
      widgets: compactWidgetLayout(remaining, dashboard.settings.columns),
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

    await this.updateDashboard({
      ...dashboard,
      widgets: compactWidgetLayout([...dashboard.widgets, widget], dashboard.settings.columns),
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
    });
  }
}

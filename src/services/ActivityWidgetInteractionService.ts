import type DashFlowPlugin from "../main";
import type { ActivityMetric, HeatmapWidgetConfig, WidgetInstance } from "../models";
import { activityRange, activityStreak } from "../activity/activityMath";

const STYLE_ID = "dashflow-activity-styles";

const ACTIVITY_STYLES = `
.dashflow-heatmap{height:100%;display:flex;flex-direction:column;gap:10px;min-width:0}
.dashflow-heatmap-summary{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.dashflow-heatmap-summary-main{display:flex;gap:18px;min-width:0}
.dashflow-heatmap-stat{display:flex;flex-direction:column;gap:1px}
.dashflow-heatmap-stat strong{font-size:17px;line-height:1.1;letter-spacing:-.03em}
.dashflow-heatmap-stat span,.dashflow-heatmap-range{font-size:9px;color:var(--text-faint);letter-spacing:.05em;text-transform:uppercase}
.dashflow-heatmap-range{text-align:right;white-space:nowrap}
.dashflow-heatmap-scroll{overflow-x:auto;overflow-y:hidden;padding:2px 0 5px;scrollbar-width:thin}
.dashflow-heatmap-grid{display:grid;grid-template-rows:repeat(7,11px);grid-auto-flow:column;grid-auto-columns:11px;gap:3px;width:max-content;min-width:100%}
.dashflow-heatmap-cell{width:11px;height:11px;border-radius:2px;background:var(--background-modifier-border);outline:1px solid color-mix(in srgb,var(--background-modifier-border) 76%,transparent);outline-offset:-1px}
.dashflow-heatmap-cell.is-pad{visibility:hidden}
.dashflow-heatmap-cell[data-level="1"]{background:color-mix(in srgb,var(--interactive-accent) 24%,var(--background-primary))}
.dashflow-heatmap-cell[data-level="2"]{background:color-mix(in srgb,var(--interactive-accent) 43%,var(--background-primary))}
.dashflow-heatmap-cell[data-level="3"]{background:color-mix(in srgb,var(--interactive-accent) 67%,var(--background-primary))}
.dashflow-heatmap-cell[data-level="4"]{background:var(--interactive-accent)}
.dashflow-heatmap-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;color:var(--text-faint);font-size:9px}
.dashflow-heatmap-legend{display:flex;align-items:center;gap:4px;white-space:nowrap}
.dashflow-heatmap-legend .dashflow-heatmap-cell{display:inline-block;flex:none}
@media(max-width:900px){.dashflow-heatmap-grid{grid-template-rows:repeat(7,10px);grid-auto-columns:10px}.dashflow-heatmap-cell{width:10px;height:10px}}
`;

export class ActivityWidgetInteractionService {
  private unsubscribeRender: (() => void) | null = null;
  private unsubscribeActivity: (() => void) | null = null;

  constructor(private readonly plugin: DashFlowPlugin) {}

  start(): void {
    this.ensureStyles();
    this.unsubscribeRender = this.plugin.dashboardRender.subscribe(({ root }) => this.decorate(root, false));
    this.unsubscribeActivity = this.plugin.activityService.subscribe(() => {
      this.plugin.dashboardRender.forEachRoot((root) => this.decorate(root, true));
    });
    this.plugin.dashboardRender.forEachRoot((root) => this.decorate(root, false));
  }

  stop(): void {
    this.unsubscribeRender?.();
    this.unsubscribeRender = null;
    this.unsubscribeActivity?.();
    this.unsubscribeActivity = null;
    document.getElementById(STYLE_ID)?.remove();
  }

  private decorate(root: HTMLElement, force: boolean): void {
    const dashboard = this.plugin.dashboardManager.active();
    const widgets = new Map(dashboard.widgets.map((widget) => [widget.id, widget]));

    for (const card of root.querySelectorAll<HTMLElement>(".dashflow-widget[data-widget-id]")) {
      const widgetId = card.dataset.widgetId;
      const widget = widgetId ? widgets.get(widgetId) : undefined;
      if (!widget || widget.type !== "heatmap") continue;
      const body = card.querySelector<HTMLElement>(".dashflow-widget-body");
      if (!body) continue;
      if (!force && body.dataset.dashflowHeatmap === widget.id) continue;
      this.renderHeatmap(body, widget);
    }
  }

  private renderHeatmap(body: HTMLElement, widget: WidgetInstance): void {
    const config = widget.config as HeatmapWidgetConfig;
    const days = Math.max(28, Math.min(365, Math.round(config.days ?? 180)));
    const metric = this.metric(config.metric);
    const store = this.plugin.activityService.getStore();
    const points = activityRange(store, days, metric);
    const maxValue = Math.max(1, ...points.map((point) => point.value));
    const activeCount = points.filter((point) => point.value > 0).length;
    const taskDone = points.reduce((sum, point) => sum + (point.activity?.tasksCompleted ?? 0), 0);
    const habitDone = points.reduce((sum, point) => sum + (point.activity?.habitsCompleted ?? 0), 0);
    const streak = activityStreak(store);

    body.innerHTML = "";
    body.dataset.dashflowHeatmap = widget.id;

    const root = document.createElement("div");
    root.className = "dashflow-heatmap";

    const summary = document.createElement("div");
    summary.className = "dashflow-heatmap-summary";
    const summaryMain = document.createElement("div");
    summaryMain.className = "dashflow-heatmap-summary-main";
    summaryMain.append(
      this.stat(String(activeCount), "active days"),
      this.stat(String(taskDone), "tasks done"),
      this.stat(String(habitDone), "habit checks"),
      this.stat(String(streak), "day streak"),
    );
    const range = document.createElement("div");
    range.className = "dashflow-heatmap-range";
    const lastPoint = points[points.length - 1];
    range.textContent = `${this.metricLabel(metric)} · ${points[0]?.date.slice(5) ?? ""} → ${lastPoint?.date.slice(5) ?? ""}`;
    summary.append(summaryMain, range);

    const scroll = document.createElement("div");
    scroll.className = "dashflow-heatmap-scroll";
    const grid = document.createElement("div");
    grid.className = "dashflow-heatmap-grid";

    const firstDate = points[0]?.date;
    if (firstDate) {
      const weekday = (new Date(`${firstDate}T12:00:00`).getDay() + 6) % 7;
      for (let i = 0; i < weekday; i += 1) {
        const pad = document.createElement("span");
        pad.className = "dashflow-heatmap-cell is-pad";
        grid.appendChild(pad);
      }
    }

    for (const point of points) {
      const cell = document.createElement("span");
      cell.className = "dashflow-heatmap-cell";
      const level = point.value === 0 ? 0 : Math.max(1, Math.min(4, Math.ceil((point.value / maxValue) * 4)));
      cell.dataset.level = String(level);
      const activity = point.activity;
      cell.title = `${point.date} · ${this.metricLabel(metric)} ${point.value} · 完成任务 ${activity?.tasksCompleted ?? 0} · 习惯打卡 ${activity?.habitsCompleted ?? 0} · 新建任务 ${activity?.tasksCreated ?? 0} · 笔记活动 ${(activity?.notesCreated ?? 0) + (activity?.notesModified ?? 0)}`;
      grid.appendChild(cell);
    }
    scroll.appendChild(grid);

    const footer = document.createElement("div");
    footer.className = "dashflow-heatmap-footer";
    const started = document.createElement("span");
    started.textContent = `tracking since ${store.startedAt}`;
    footer.appendChild(started);
    if (config.showLegend !== false) footer.appendChild(this.legend());

    root.append(summary, scroll, footer);
    body.appendChild(root);
  }

  private stat(value: string, label: string): HTMLElement {
    const item = document.createElement("div");
    item.className = "dashflow-heatmap-stat";
    const strong = document.createElement("strong");
    strong.textContent = value;
    const span = document.createElement("span");
    span.textContent = label;
    item.append(strong, span);
    return item;
  }

  private legend(): HTMLElement {
    const legend = document.createElement("div");
    legend.className = "dashflow-heatmap-legend";
    legend.append(document.createTextNode("LESS"));
    for (let level = 0; level <= 4; level += 1) {
      const cell = document.createElement("span");
      cell.className = "dashflow-heatmap-cell";
      cell.dataset.level = String(level);
      legend.appendChild(cell);
    }
    legend.append(document.createTextNode("MORE"));
    return legend;
  }

  private metric(value: unknown): ActivityMetric {
    return value === "tasks" || value === "notes" || value === "habits" ? value : "score";
  }

  private metricLabel(metric: ActivityMetric): string {
    if (metric === "tasks") return "TASKS";
    if (metric === "notes") return "NOTES";
    if (metric === "habits") return "HABITS";
    return "ACTIVITY";
  }

  private ensureStyles(): void {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = ACTIVITY_STYLES;
    document.head.appendChild(style);
  }
}

import type DashFlowPlugin from "../main";
import type { ProjectGanttWidgetConfig, WidgetInstance } from "../models";
import { ProjectDetailModal } from "../ui/ProjectDetailModal";
import { localDate } from "../utils/date";

const STYLE_ID = "dashflow-project-gantt-styles";
const SVG_NS = "http://www.w3.org/2000/svg";
const DAY_WIDTH = 14;
const ROW_HEIGHT = 32;
const HEADER_HEIGHT = 28;
const LABEL_WIDTH = 140;
const PALETTE = ["var(--df-info)", "var(--df-success)", "var(--df-warning)", "var(--df-purple)", "var(--df-cyan)", "var(--df-accent)"];

const GANTT_STYLES = `
.dashflow-project-gantt{overflow:auto;height:100%;border:1px solid var(--background-modifier-border);border-radius:10px;background:var(--background-primary)}
.dashflow-project-gantt svg{display:block}
.dashflow-project-gantt text{font-size:10px;fill:var(--text-muted)}
.dashflow-project-gantt .gantt-bar{fill-opacity:.82;cursor:pointer}
.dashflow-project-gantt .gantt-bar:hover{fill-opacity:1}
.dashflow-project-gantt .gantt-today{stroke:var(--text-error);stroke-width:1.5;stroke-dasharray:3 3}
.dashflow-project-gantt .gantt-grid{stroke:var(--background-modifier-border);stroke-width:1}
.dashflow-project-gantt-empty{height:100%;display:grid;place-items:center;color:var(--text-faint);font-size:11px;padding:12px;text-align:center;line-height:1.6}
`;

function toDays(date: string): number {
  const [year, month, day] = date.split("-").map(Number);
  return Math.floor(Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1) / 86_400_000);
}

function daysToDate(days: number): string {
  return new Date(days * 86_400_000).toISOString().slice(0, 10);
}

function colorFor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length] ?? "var(--df-info)";
}

export class ProjectGanttWidgetInteractionService {
  private unsubscribeRender: (() => void) | null = null;

  constructor(private readonly plugin: DashFlowPlugin) {}

  start(): void {
    this.ensureStyles();
    this.unsubscribeRender = this.plugin.dashboardRender.subscribe(({ root }) => this.decorate(root));
    this.plugin.dashboardRender.forEachRoot((root) => this.decorate(root));
  }

  stop(): void {
    this.unsubscribeRender?.();
    this.unsubscribeRender = null;
    document.getElementById(STYLE_ID)?.remove();
  }

  private decorate(root: HTMLElement): void {
    const dashboard = this.plugin.dashboardManager.active();
    const widgets = new Map(dashboard.widgets.map((widget) => [widget.id, widget]));
    const revision = this.plugin.vaultIndex.getSnapshot().revision;
    for (const card of root.querySelectorAll<HTMLElement>(".dashflow-widget[data-widget-id]")) {
      const id = card.dataset.widgetId;
      const widget = id ? widgets.get(id) : undefined;
      if (!widget || widget.type !== "project-gantt") continue;
      const body = card.querySelector<HTMLElement>(".dashflow-widget-body");
      if (!body) continue;
      const signature = `${widget.id}:${revision}:${JSON.stringify(widget.config)}`;
      if (body.dataset.dashflowGantt === signature) continue;
      body.dataset.dashflowGantt = signature;
      this.render(body, widget);
    }
  }

  private render(body: HTMLElement, widget: WidgetInstance): void {
    const config = widget.config as ProjectGanttWidgetConfig;
    body.replaceChildren();

    const projects = this.plugin.vaultIndex.getSnapshot().projects
      .filter((project) => project.start && project.deadline)
      .filter((project) => config.showArchived || project.status !== "archived")
      .sort((a, b) => (a.start ?? "").localeCompare(b.start ?? ""));

    if (projects.length === 0) {
      const empty = document.createElement("div");
      empty.className = "dashflow-project-gantt-empty";
      empty.textContent = "没有带起止日期的项目。给项目补充「开始日期」和「截止日期」后，时间轴会在这里显示。";
      body.appendChild(empty);
      return;
    }

    const today = toDays(localDate());
    const minDays = Math.min(...projects.map((project) => toDays(project.start as string)), today) - 3;
    const maxDays = Math.max(...projects.map((project) => toDays(project.deadline as string)), today) + 3;
    const totalDays = maxDays - minDays + 1;

    const container = document.createElement("div");
    container.className = "dashflow-project-gantt";

    const svg = document.createElementNS(SVG_NS, "svg");
    const width = LABEL_WIDTH + totalDays * DAY_WIDTH;
    const height = HEADER_HEIGHT + projects.length * ROW_HEIGHT;
    svg.setAttribute("width", String(width));
    svg.setAttribute("height", String(height));
    svg.style.minWidth = `${width}px`;

    for (let days = minDays; days <= maxDays; days += 1) {
      const date = daysToDate(days);
      if (days === minDays || date.endsWith("-01")) {
        const x = LABEL_WIDTH + (days - minDays) * DAY_WIDTH;
        const line = document.createElementNS(SVG_NS, "line");
        line.setAttribute("x1", String(x));
        line.setAttribute("x2", String(x));
        line.setAttribute("y1", "0");
        line.setAttribute("y2", String(height));
        line.setAttribute("class", "gantt-grid");
        svg.appendChild(line);

        const label = document.createElementNS(SVG_NS, "text");
        label.setAttribute("x", String(x + 4));
        label.setAttribute("y", "16");
        label.textContent = `${date.slice(0, 4)}/${date.slice(5, 7)}`;
        svg.appendChild(label);
      }
    }

    const todayX = LABEL_WIDTH + (today - minDays) * DAY_WIDTH;
    const todayLine = document.createElementNS(SVG_NS, "line");
    todayLine.setAttribute("x1", String(todayX));
    todayLine.setAttribute("x2", String(todayX));
    todayLine.setAttribute("y1", String(HEADER_HEIGHT - 4));
    todayLine.setAttribute("y2", String(height));
    todayLine.setAttribute("class", "gantt-today");
    svg.appendChild(todayLine);

    projects.forEach((project, index) => {
      const y = HEADER_HEIGHT + index * ROW_HEIGHT;
      const startDays = toDays(project.start as string);
      const endDays = toDays(project.deadline as string);
      const x = LABEL_WIDTH + (startDays - minDays) * DAY_WIDTH;
      const barWidth = Math.max(6, (endDays - startDays + 1) * DAY_WIDTH);

      const name = project.name.length > 16 ? `${project.name.slice(0, 15)}…` : project.name;
      const label = document.createElementNS(SVG_NS, "text");
      label.setAttribute("x", String(LABEL_WIDTH - 8));
      label.setAttribute("y", String(y + ROW_HEIGHT / 2 + 3));
      label.setAttribute("text-anchor", "end");
      label.textContent = name;
      svg.appendChild(label);

      const bar = document.createElementNS(SVG_NS, "rect");
      bar.setAttribute("x", String(x));
      bar.setAttribute("y", String(y + 6));
      bar.setAttribute("width", String(barWidth));
      bar.setAttribute("height", String(ROW_HEIGHT - 12));
      bar.setAttribute("rx", "5");
      bar.setAttribute("class", "gantt-bar");
      bar.style.fill = colorFor(project.id);
      bar.addEventListener("click", () => new ProjectDetailModal(this.plugin, project.id).open());
      svg.appendChild(bar);
    });

    container.appendChild(svg);
    body.appendChild(container);
  }

  private ensureStyles(): void {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = GANTT_STYLES;
    document.head.appendChild(style);
  }
}

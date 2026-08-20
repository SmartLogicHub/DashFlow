import type DashFlowPlugin from "../main";
import type { Project, ProjectKanbanWidgetConfig, ProjectStatus, WidgetInstance } from "../models";
import { ProjectDetailModal } from "../ui/ProjectDetailModal";
import { ProjectEditorModal } from "../ui/ProjectEditorModal";

const STYLE_ID = "dashflow-project-kanban-styles";

const KANBAN_STYLES = `
.dashflow-project-kanban{display:flex;gap:10px;align-items:stretch;height:100%;overflow-x:auto;overflow-y:hidden;padding-bottom:4px}
.dashflow-project-kanban-column{flex:1 1 0;min-width:160px;display:flex;flex-direction:column;gap:8px;border:1px solid var(--background-modifier-border);border-radius:11px;background:color-mix(in srgb,var(--background-secondary) 60%,transparent);padding:9px;overflow:hidden}
.dashflow-project-kanban-head{display:flex;align-items:center;gap:6px;padding:0 2px}
.dashflow-project-kanban-dot{width:8px;height:8px;border-radius:999px;flex:none}
.dashflow-project-kanban-head strong{font-size:11px;font-weight:650;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dashflow-project-kanban-count{font-size:10px;color:var(--text-faint);font-variant-numeric:tabular-nums}
.dashflow-project-kanban-list{display:flex;flex-direction:column;gap:6px;flex:1;min-height:24px;overflow-y:auto;padding:1px}
.dashflow-project-kanban-list.is-drag-over{outline:2px dashed var(--interactive-accent);outline-offset:-2px;border-radius:8px}
.dashflow-project-kanban-card{border:1px solid var(--background-modifier-border);border-radius:8px;background:var(--background-primary);padding:8px 9px;cursor:grab;font-size:11px;transition:border-color .14s ease,box-shadow .14s ease}
.dashflow-project-kanban-card:hover{border-color:color-mix(in srgb,var(--interactive-accent) 35%,var(--background-modifier-border));box-shadow:0 2px 8px rgba(0,0,0,.05)}
.dashflow-project-kanban-card.is-dragging{opacity:.5}
.dashflow-project-kanban-name{font-weight:650;line-height:1.35;overflow-wrap:anywhere}
.dashflow-project-kanban-meta{display:flex;align-items:center;justify-content:space-between;gap:6px;margin-top:6px;color:var(--text-faint);font-size:9.5px;font-variant-numeric:tabular-nums}
.dashflow-project-kanban-bar{height:4px;border-radius:99px;background:color-mix(in srgb,var(--interactive-accent) 14%,var(--background-modifier-border));overflow:hidden;margin-top:6px}
.dashflow-project-kanban-bar span{display:block;height:100%;border-radius:inherit;background:var(--interactive-accent)}
.dashflow-project-kanban-empty{color:var(--text-faint);font-size:10px;text-align:center;padding:10px 4px}
.dashflow-project-kanban-add{appearance:none;border:1px dashed var(--background-modifier-border);border-radius:8px;background:transparent;color:var(--text-normal);font-size:11px;padding:6px 8px;width:100%;cursor:pointer}
.dashflow-project-kanban-add:hover{border-color:var(--interactive-accent);color:var(--interactive-accent)}
`;

interface ColumnDef {
  status: ProjectStatus;
  label: string;
  color: string;
}

const COLUMNS: ColumnDef[] = [
  { status: "planned", label: "计划中", color: "#8a8578" },
  { status: "active", label: "进行中", color: "#378ADD" },
  { status: "paused", label: "暂停", color: "#d97706" },
  { status: "completed", label: "已完成", color: "#639922" },
  { status: "archived", label: "已归档", color: "#9a9a9a" },
];

export class ProjectKanbanWidgetInteractionService {
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
      if (!widget || widget.type !== "project-kanban") continue;
      const body = card.querySelector<HTMLElement>(".dashflow-widget-body");
      if (!body) continue;
      const signature = `${widget.id}:${revision}:${JSON.stringify(widget.config)}`;
      if (body.dataset.dashflowKanban === signature) continue;
      body.dataset.dashflowKanban = signature;
      this.render(body, widget);
    }
  }

  private render(body: HTMLElement, widget: WidgetInstance): void {
    const config = widget.config as ProjectKanbanWidgetConfig;
    const projects = this.plugin.vaultIndex.getSnapshot().projects;
    const columns = config.showArchived ? COLUMNS : COLUMNS.filter((column) => column.status !== "archived");

    body.replaceChildren();
    const board = document.createElement("div");
    board.className = "dashflow-project-kanban";

    for (const column of columns) {
      board.appendChild(this.renderColumn(board, column, projects));
    }

    body.appendChild(board);
  }

  private renderColumn(board: HTMLElement, column: ColumnDef, projects: Project[]): HTMLElement {
    const el = document.createElement("div");
    el.className = "dashflow-project-kanban-column";
    el.dataset.status = column.status;

    const head = document.createElement("div");
    head.className = "dashflow-project-kanban-head";
    const dot = document.createElement("span");
    dot.className = "dashflow-project-kanban-dot";
    dot.style.background = column.color;
    const label = document.createElement("strong");
    label.textContent = column.label;
    const count = document.createElement("span");
    count.className = "dashflow-project-kanban-count";
    const columnProjects = projects.filter((project) => project.status === column.status);
    count.textContent = String(columnProjects.length);
    head.append(dot, label, count);
    el.appendChild(head);

    const list = document.createElement("div");
    list.className = "dashflow-project-kanban-list";
    if (columnProjects.length === 0) {
      const empty = document.createElement("div");
      empty.className = "dashflow-project-kanban-empty";
      empty.textContent = "拖到这里";
      list.appendChild(empty);
    } else {
      for (const project of columnProjects) list.appendChild(this.renderCard(project));
    }
    el.appendChild(list);

    const add = document.createElement("button");
    add.type = "button";
    add.className = "dashflow-project-kanban-add";
    add.textContent = "＋ 新建项目";
    add.addEventListener("click", () => new ProjectEditorModal(this.plugin).open());
    el.appendChild(add);

    list.addEventListener("dragover", (event) => {
      event.preventDefault();
      list.classList.add("is-drag-over");
    });
    list.addEventListener("dragleave", () => list.classList.remove("is-drag-over"));
    list.addEventListener("drop", (event) => {
      event.preventDefault();
      list.classList.remove("is-drag-over");
      const id = event.dataTransfer?.getData("text/plain");
      if (id) {
        const project = projects.find((item) => item.id === id);
        if (project && project.status !== column.status) {
          void this.plugin.projectService.changeStatus(project, column.status);
        }
      }
    });

    return el;
  }

  private renderCard(project: Project): HTMLElement {
    const card = document.createElement("div");
    card.className = "dashflow-project-kanban-card";
    card.draggable = true;
    card.dataset.id = project.id;

    const name = document.createElement("div");
    name.className = "dashflow-project-kanban-name";
    name.textContent = project.name;
    card.appendChild(name);

    const progress = this.plugin.projectService.progress(project);
    const bar = document.createElement("div");
    bar.className = "dashflow-project-kanban-bar";
    const fill = document.createElement("span");
    fill.style.width = `${progress}%`;
    bar.appendChild(fill);
    card.appendChild(bar);

    const meta = document.createElement("div");
    meta.className = "dashflow-project-kanban-meta";
    const pct = document.createElement("span");
    pct.textContent = `${progress}%`;
    const due = document.createElement("span");
    due.textContent = project.deadline ?? "无截止";
    meta.append(pct, due);
    card.appendChild(meta);

    card.addEventListener("dragstart", (event) => {
      event.dataTransfer?.setData("text/plain", project.id);
      card.classList.add("is-dragging");
    });
    card.addEventListener("dragend", () => card.classList.remove("is-dragging"));
    card.addEventListener("click", () => new ProjectDetailModal(this.plugin, project.id).open());

    return card;
  }

  private ensureStyles(): void {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = KANBAN_STYLES;
    document.head.appendChild(style);
  }
}

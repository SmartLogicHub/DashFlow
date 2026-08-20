import type DashFlowPlugin from "../main";
import type { OpportunityBoardWidgetConfig, WidgetInstance } from "../models";
import { OPPORTUNITY_STAGES, OpportunityService, type OpportunityItem, type OpportunityStage } from "./OpportunityService";
import { OpportunityEditModal } from "../ui/OpportunityEditModal";

const STYLE_ID = "dashflow-opportunity-board-styles";

const OPPORTUNITY_STYLES = `
.dashflow-opportunity-board{display:flex;gap:10px;align-items:stretch;height:100%;overflow-x:auto;overflow-y:hidden;padding-bottom:4px}
.dashflow-opportunity-column{flex:1 1 0;min-width:150px;display:flex;flex-direction:column;gap:8px;border:1px solid var(--background-modifier-border);border-radius:11px;background:color-mix(in srgb,var(--background-secondary) 60%,transparent);padding:9px;overflow:hidden}
.dashflow-opportunity-column-head{display:flex;align-items:center;gap:6px;padding:0 2px}
.dashflow-opportunity-dot{width:8px;height:8px;border-radius:999px;flex:none}
.dashflow-opportunity-column-head strong{font-size:11px;font-weight:650;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dashflow-opportunity-count{font-size:10px;color:var(--text-faint);font-variant-numeric:tabular-nums}
.dashflow-opportunity-list{display:flex;flex-direction:column;gap:6px;flex:1;min-height:24px;overflow-y:auto;padding:1px}
.dashflow-opportunity-list.is-drag-over{outline:2px dashed var(--interactive-accent);outline-offset:-2px;border-radius:8px}
.dashflow-opportunity-card{position:relative;border:1px solid var(--background-modifier-border);border-radius:8px;background:var(--background-primary);padding:7px 9px;cursor:grab;font-size:11px;line-height:1.4;transition:border-color .14s ease,box-shadow .14s ease}
.dashflow-opportunity-card:hover{border-color:color-mix(in srgb,var(--interactive-accent) 35%,var(--background-modifier-border));box-shadow:0 2px 8px rgba(0,0,0,.05)}
.dashflow-opportunity-card.is-dragging{opacity:.5}
.dashflow-opportunity-card.is-starred{border-color:color-mix(in srgb,#e6b800 45%,var(--background-modifier-border))}
.dashflow-opportunity-card-title{overflow-wrap:anywhere}
.dashflow-opportunity-card-star{position:absolute;top:5px;right:7px;color:#d4a900;font-size:10px}
.dashflow-opportunity-card-link{position:absolute;bottom:5px;right:7px;appearance:none;border:0;background:transparent;color:var(--text-faint);cursor:pointer;font-size:10px;padding:0}
.dashflow-opportunity-card-link:hover{color:var(--interactive-accent)}
.dashflow-opportunity-add{appearance:none;border:1px dashed var(--background-modifier-border);border-radius:8px;background:transparent;color:var(--text-normal);font-size:11px;padding:6px 8px;width:100%}
.dashflow-opportunity-add:focus{outline:none;border-color:var(--interactive-accent)}
.dashflow-opportunity-empty{color:var(--text-faint);font-size:10px;text-align:center;padding:10px 4px}
`;

export class OpportunityWidgetInteractionService {
  private unsubscribeRender: (() => void) | null = null;
  private readonly service: OpportunityService;

  constructor(private readonly plugin: DashFlowPlugin) {
    this.service = new OpportunityService(plugin.app);
  }

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
    for (const card of root.querySelectorAll<HTMLElement>(".dashflow-widget[data-widget-id]")) {
      const id = card.dataset.widgetId;
      const widget = id ? widgets.get(id) : undefined;
      if (!widget || widget.type !== "opportunity-board") continue;
      const body = card.querySelector<HTMLElement>(".dashflow-widget-body");
      if (!body) continue;
      const signature = `${widget.id}:${JSON.stringify(widget.config)}`;
      if (body.dataset.dashflowOpportunity === signature) continue;
      body.dataset.dashflowOpportunity = signature;
      void this.render(body, widget);
    }
  }

  private async render(body: HTMLElement, widget: WidgetInstance): Promise<void> {
    const config = widget.config as OpportunityBoardWidgetConfig;
    const file = (config.file ?? "").trim() || "DashFlow/Inbox Board.md";
    const items = await this.service.list(file);
    const rerender = (): void => { void this.render(body, widget); };

    body.replaceChildren();
    const board = document.createElement("div");
    board.className = "dashflow-opportunity-board";

    for (const stage of OPPORTUNITY_STAGES) {
      board.appendChild(this.renderColumn(board, file, stage, items, rerender));
    }

    body.appendChild(board);
  }

  private renderColumn(
    board: HTMLElement,
    file: string,
    stage: OpportunityStage,
    items: OpportunityItem[],
    rerender: () => void,
  ): HTMLElement {
    const column = document.createElement("div");
    column.className = "dashflow-opportunity-column";
    column.dataset.status = stage.id;

    const head = document.createElement("div");
    head.className = "dashflow-opportunity-column-head";
    const dot = document.createElement("span");
    dot.className = "dashflow-opportunity-dot";
    dot.style.background = stage.color;
    const label = document.createElement("strong");
    label.textContent = stage.label;
    const count = document.createElement("span");
    count.className = "dashflow-opportunity-count";
    const stageItems = items.filter((item) => item.status === stage.id);
    count.textContent = String(stageItems.length);
    head.append(dot, label, count);
    column.appendChild(head);

    const list = document.createElement("div");
    list.className = "dashflow-opportunity-list";
    if (stageItems.length === 0) {
      const empty = document.createElement("div");
      empty.className = "dashflow-opportunity-empty";
      empty.textContent = "拖到这里";
      list.appendChild(empty);
    } else {
      for (const item of stageItems) list.appendChild(this.renderCard(board, file, item, rerender));
    }
    column.appendChild(list);

    const add = document.createElement("input");
    add.type = "text";
    add.className = "dashflow-opportunity-add";
    add.placeholder = `＋ ${stage.label}`;
    add.setAttribute("aria-label", `在「${stage.label}」添加`);
    add.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      const value = add.value.trim();
      if (!value) return;
      add.value = "";
      void this.service.create(file, value).then(async (next) => {
        if (stage.id !== "inbox") await this.service.move(file, next[next.length - 1]?.id ?? "", stage.id);
        rerender();
      });
    });
    column.appendChild(add);

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
        void this.service.move(file, id, stage.id).then(() => rerender());
      }
    });

    return column;
  }

  private renderCard(
    board: HTMLElement,
    file: string,
    item: OpportunityItem,
    rerender: () => void,
  ): HTMLElement {
    const card = document.createElement("div");
    card.className = "dashflow-opportunity-card";
    card.draggable = true;
    card.dataset.id = item.id;
    if (item.starred) card.classList.add("is-starred");

    const title = document.createElement("div");
    title.className = "dashflow-opportunity-card-title";
    title.textContent = item.title;
    card.appendChild(title);

    if (item.starred) {
      const star = document.createElement("span");
      star.className = "dashflow-opportunity-card-star";
      star.textContent = "★";
      card.appendChild(star);
    }
    if (item.link) {
      const link = document.createElement("button");
      link.type = "button";
      link.className = "dashflow-opportunity-card-link";
      link.textContent = "↗";
      link.title = item.link;
      link.addEventListener("click", (event) => {
        event.stopPropagation();
        this.openLink(item.link);
      });
      card.appendChild(link);
    }

    card.addEventListener("dragstart", (event) => {
      event.dataTransfer?.setData("text/plain", item.id);
      card.classList.add("is-dragging");
    });
    card.addEventListener("dragend", () => card.classList.remove("is-dragging"));

    card.addEventListener("click", () => {
      new OpportunityEditModal(
        this.plugin.app,
        item,
        async (patch) => {
          await this.service.update(file, item.id, patch);
          rerender();
        },
        async () => {
          await this.service.remove(file, item.id);
          rerender();
        },
      ).open();
    });

    return card;
  }

  private openLink(link: string): void {
    const inner = link.replace(/^\[\[|\]\]$/g, "").split("|")[0]?.trim();
    if (inner && link.startsWith("[[")) {
      void this.plugin.app.workspace.openLinkText(inner, "", false);
      return;
    }
    if (/^https?:\/\//.test(link)) {
      window.open(link, "_blank", "noopener,noreferrer");
      return;
    }
    void this.plugin.app.workspace.openLinkText(link, "", false);
  }

  private ensureStyles(): void {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = OPPORTUNITY_STYLES;
    document.head.appendChild(style);
  }
}

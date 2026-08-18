import type DashFlowPlugin from "../main";
import type { DashboardDefinition, DashboardMobileSettings } from "../models";

const STYLE_ID = "dashflow-mobile-layout-styles";
const MOBILE_QUERY = "(max-width: 900px)";

const MOBILE_STYLES = `
.dashflow-mobile-actions,.dashflow-mobile-edit-tools{display:none}
@media (max-width:900px){
  .dashflow-shell.is-mobile .dashflow-grid{display:flex!important;flex-direction:column;gap:12px!important}
  .dashflow-shell.is-mobile .dashflow-widget{min-height:0!important;overflow:visible}
  .dashflow-shell.is-mobile .dashflow-widget[style]{grid-column:auto!important;grid-row:auto!important}
  .dashflow-shell.is-mobile .dashflow-widget-body{height:auto!important;max-height:none!important;min-height:148px;overflow:visible!important}
  .dashflow-shell.is-mobile .dashflow-widget[data-widget-type="heatmap"] .dashflow-widget-body{min-height:220px}
  .dashflow-shell.is-mobile .dashflow-widget[data-widget-type="habits"] .dashflow-widget-body{min-height:300px}
  .dashflow-shell.is-mobile .dashflow-widget[data-widget-type="weekly-review"] .dashflow-widget-body{min-height:500px}
  .dashflow-shell.is-mobile .dashflow-widget[data-widget-type="calendar"] .dashflow-widget-body{min-height:520px}
  .dashflow-shell.is-mobile .dashflow-widget.is-mobile-collapsed{min-height:0!important}
  .dashflow-shell.is-mobile .dashflow-widget.is-mobile-collapsed .dashflow-widget-body{display:none!important}
  .dashflow-shell.is-mobile .dashflow-widget.is-mobile-collapsed .dashflow-widget-header{border-bottom:0}
  .dashflow-shell.is-mobile .dashflow-widget-header{gap:6px;padding-right:8px}
  .dashflow-shell.is-mobile .dashflow-widget-controls button{width:34px;height:34px}
  .dashflow-mobile-actions{display:flex;align-items:center;gap:3px;margin-left:auto}
  .dashflow-mobile-actions button{appearance:none;border:0;background:transparent;color:var(--text-muted);width:34px;height:34px;border-radius:8px;font-size:15px;cursor:pointer}
  .dashflow-mobile-actions button:hover{background:var(--background-modifier-hover);color:var(--text-normal)}
  .dashflow-mobile-actions button:disabled{opacity:.28;cursor:default}
  .dashflow-mobile-actions .is-edit-only{display:none}
  .dashflow-grid.is-editing .dashflow-mobile-actions .is-edit-only{display:inline-flex;align-items:center;justify-content:center}
  .dashflow-mobile-edit-tools{display:flex;align-items:center;gap:7px}
  .dashflow-mobile-hide-desktop-reset{display:none!important}
  .dashflow-shell.is-mobile-compact .dashflow-grid{gap:8px!important}
  .dashflow-shell.is-mobile-compact .dashflow-widget-header{height:38px;padding-left:11px}
  .dashflow-shell.is-mobile-compact .dashflow-widget-body{padding:10px;min-height:112px}
  .dashflow-shell.is-mobile-compact .dashflow-widget[data-widget-type="heatmap"] .dashflow-widget-body{min-height:190px}
  .dashflow-shell.is-mobile-compact .dashflow-widget[data-widget-type="habits"] .dashflow-widget-body{min-height:250px}
  .dashflow-shell.is-mobile-compact .dashflow-widget[data-widget-type="weekly-review"] .dashflow-widget-body{min-height:430px}
  .dashflow-shell.is-mobile-compact .dashflow-widget[data-widget-type="calendar"] .dashflow-widget-body{min-height:450px}
  .dashflow-shell.is-mobile-compact .dashflow-task{padding:5px 1px}
  .dashflow-shell.is-mobile-compact .dashflow-project-row{padding:6px 3px}
}
`;

export class MobileDashboardInteractionService {
  private observer: MutationObserver | null = null;
  private scheduled = false;
  private readonly media = window.matchMedia(MOBILE_QUERY);
  private readonly onMediaChange = (): void => this.schedule();

  constructor(private readonly plugin: DashFlowPlugin) {}

  start(): void {
    this.ensureStyles();
    this.media.addEventListener("change", this.onMediaChange);
    this.observer = new MutationObserver((records) => this.onMutation(records));
    this.observer.observe(document.body, { childList: true, subtree: true });
    this.schedule();
  }

  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.media.removeEventListener("change", this.onMediaChange);
    document.getElementById(STYLE_ID)?.remove();
    this.cleanupDesktop();
  }

  private schedule(): void {
    if (this.scheduled) return;
    this.scheduled = true;
    window.setTimeout(() => {
      this.scheduled = false;
      this.decorate();
    }, 0);
  }

  private onMutation(records: MutationRecord[]): void {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node instanceof Element
          && (node.matches(".dashflow-shell") || node.querySelector(".dashflow-shell"))) {
          this.schedule();
          return;
        }
      }
      if (record.target instanceof Element && record.target.closest(".dashflow-shell")) {
        this.schedule();
        return;
      }
    }
  }

  private decorate(): void {
    if (!this.media.matches) {
      this.cleanupDesktop();
      return;
    }

    const dashboard = this.plugin.dashboardManager.active();
    const state = this.plugin.dashboardManager.mobileState(dashboard);
    for (const shell of document.querySelectorAll<HTMLElement>(".dashflow-shell")) {
      this.decorateShell(shell, dashboard, state);
    }
  }

  private decorateShell(
    shell: HTMLElement,
    dashboard: DashboardDefinition,
    state: DashboardMobileSettings,
  ): void {
    shell.classList.add("is-mobile");
    shell.classList.toggle("is-mobile-compact", state.compactMode);

    const grid = shell.querySelector<HTMLElement>(".dashflow-grid");
    if (!grid) return;
    const editing = grid.classList.contains("is-editing");
    const editButton = shell.querySelector<HTMLButtonElement>(".dashflow-edit-button");
    if (editButton) editButton.textContent = editing ? "完成排序" : "编辑排序";

    const widgets = new Map(dashboard.widgets.map((widget) => [widget.id, widget]));
    const cards = [...grid.querySelectorAll<HTMLElement>(".dashflow-widget[data-widget-id]")];
    const byId = new Map(cards.map((card) => [card.dataset.widgetId ?? "", card]));
    const visibleIds = cards.map((card) => card.dataset.widgetId).filter((id): id is string => Boolean(id));
    const desiredIds = state.order.filter((id) => byId.has(id));

    if (visibleIds.join("|") !== desiredIds.join("|")) {
      for (const id of desiredIds) {
        const card = byId.get(id);
        if (card) grid.appendChild(card);
      }
    }

    const collapsed = new Set(state.collapsedWidgetIds);
    for (const id of desiredIds) {
      const card = byId.get(id);
      const widget = widgets.get(id);
      if (!card || !widget) continue;
      card.dataset.widgetType = widget.type;
      card.classList.toggle("is-mobile-collapsed", collapsed.has(id));
      this.decorateCard(card, dashboard.id, id, grid, collapsed.has(id));
    }

    if (editing) this.decorateEditBar(shell, dashboard, state);
  }

  private decorateCard(
    card: HTMLElement,
    dashboardId: string,
    widgetId: string,
    grid: HTMLElement,
    isCollapsed: boolean,
  ): void {
    const header = card.querySelector<HTMLElement>(".dashflow-widget-header");
    if (!header) return;
    let actions = header.querySelector<HTMLElement>(".dashflow-mobile-actions");
    if (!actions) {
      actions = document.createElement("div");
      actions.className = "dashflow-mobile-actions";

      const up = this.actionButton("↑", "上移", "up", true);
      const down = this.actionButton("↓", "下移", "down", true);
      const collapse = this.actionButton("▾", "折叠", "collapse", false);

      up.addEventListener("click", async (event) => {
        event.stopPropagation();
        await this.plugin.dashboardManager.moveMobileWidget(
          dashboardId,
          widgetId,
          -1,
          this.visibleIds(grid),
        );
        this.decorate();
      });
      down.addEventListener("click", async (event) => {
        event.stopPropagation();
        await this.plugin.dashboardManager.moveMobileWidget(
          dashboardId,
          widgetId,
          1,
          this.visibleIds(grid),
        );
        this.decorate();
      });
      collapse.addEventListener("click", async (event) => {
        event.stopPropagation();
        await this.plugin.dashboardManager.toggleMobileCollapsed(dashboardId, widgetId);
        this.decorate();
      });

      actions.append(up, down, collapse);
      header.appendChild(actions);
    }

    const ids = this.visibleIds(grid);
    const index = ids.indexOf(widgetId);
    const up = actions.querySelector<HTMLButtonElement>('[data-mobile-action="up"]');
    const down = actions.querySelector<HTMLButtonElement>('[data-mobile-action="down"]');
    const collapse = actions.querySelector<HTMLButtonElement>('[data-mobile-action="collapse"]');
    if (up) up.disabled = index <= 0;
    if (down) down.disabled = index < 0 || index >= ids.length - 1;
    if (collapse) {
      collapse.textContent = isCollapsed ? "▸" : "▾";
      collapse.title = isCollapsed ? "展开" : "折叠";
      collapse.setAttribute("aria-label", collapse.title);
    }
  }

  private decorateEditBar(
    shell: HTMLElement,
    dashboard: DashboardDefinition,
    state: DashboardMobileSettings,
  ): void {
    const bar = shell.querySelector<HTMLElement>(".dashflow-edit-bar");
    if (!bar) return;
    const directButtons = [...bar.children].filter((element): element is HTMLButtonElement => element instanceof HTMLButtonElement);
    directButtons[1]?.classList.add("dashflow-mobile-hide-desktop-reset");

    let tools = bar.querySelector<HTMLElement>(".dashflow-mobile-edit-tools");
    if (!tools) {
      tools = document.createElement("div");
      tools.className = "dashflow-mobile-edit-tools";
      const compact = document.createElement("button");
      compact.type = "button";
      compact.dataset.mobileAction = "compact";
      const reset = document.createElement("button");
      reset.type = "button";
      reset.dataset.mobileAction = "reset";
      reset.textContent = "重置手机排序";

      compact.addEventListener("click", async () => {
        const current = this.plugin.dashboardManager.mobileState(this.plugin.dashboardManager.active());
        await this.plugin.dashboardManager.setMobileCompactMode(dashboard.id, !current.compactMode);
        this.decorate();
      });
      reset.addEventListener("click", async () => {
        await this.plugin.dashboardManager.resetMobileLayout(dashboard.id);
        this.decorate();
      });
      tools.append(compact, reset);
      bar.appendChild(tools);
    }

    const compact = tools.querySelector<HTMLButtonElement>('[data-mobile-action="compact"]');
    if (compact) compact.textContent = state.compactMode ? "紧凑：开" : "紧凑：关";
  }

  private actionButton(
    text: string,
    title: string,
    action: string,
    editOnly: boolean,
  ): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    button.title = title;
    button.setAttribute("aria-label", title);
    button.dataset.mobileAction = action;
    if (editOnly) button.classList.add("is-edit-only");
    return button;
  }

  private visibleIds(grid: HTMLElement): string[] {
    return [...grid.querySelectorAll<HTMLElement>(".dashflow-widget[data-widget-id]")]
      .map((card) => card.dataset.widgetId)
      .filter((id): id is string => Boolean(id));
  }

  private cleanupDesktop(): void {
    for (const shell of document.querySelectorAll<HTMLElement>(".dashflow-shell")) {
      shell.classList.remove("is-mobile", "is-mobile-compact");
      const editButton = shell.querySelector<HTMLButtonElement>(".dashflow-edit-button");
      if (editButton) editButton.textContent = editButton.classList.contains("is-active") ? "完成布局" : "编辑布局";
      for (const card of shell.querySelectorAll<HTMLElement>(".dashflow-widget")) {
        card.classList.remove("is-mobile-collapsed");
      }
      for (const button of shell.querySelectorAll<HTMLElement>(".dashflow-mobile-hide-desktop-reset")) {
        button.classList.remove("dashflow-mobile-hide-desktop-reset");
      }
    }
  }

  private ensureStyles(): void {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = MOBILE_STYLES;
    document.head.appendChild(style);
  }
}

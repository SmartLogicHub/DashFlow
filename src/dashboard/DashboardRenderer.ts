import type DashFlowPlugin from "../main";
import type {
  CountdownWidgetConfig,
  DashboardDefinition,
  ProgressWidgetConfig,
  ProjectsWidgetConfig,
  QuickCaptureWidgetConfig,
  Task,
  TasksWidgetConfig,
  UpcomingWidgetConfig,
  VaultSnapshot,
  WidgetDefinition,
  WidgetInstance,
  WidgetLayout,
  WidgetSettingField,
} from "../models";
import { moveLayout, resizeLayout, resolveWidgetLayout } from "../layout/grid";
import { createElement } from "../ui/dom";
import { localDate } from "../utils/date";
import { PLUGIN_VERSION } from "../constants";

export class DashboardRenderer {
  private editing = false;
  private configuringWidgetId: string | null = null;
  private readonly unsubscribe: () => void;

  constructor(
    private readonly plugin: DashFlowPlugin,
    private readonly container: HTMLElement,
  ) {
    this.unsubscribe = this.plugin.vaultIndex.subscribe(() => this.render());
  }

  destroy(): void {
    this.unsubscribe();
  }

  render(): void {
    const dashboard = this.plugin.dashboardManager.active();
    const snapshot = this.plugin.vaultIndex.getSnapshot();
    this.container.innerHTML = "";

    const shell = createElement("div", "dashflow-shell");
    this.container.appendChild(shell);

    shell.appendChild(this.renderHero(dashboard));
    shell.appendChild(this.renderPulse(snapshot));

    const sectionTitle = createElement("div", "dashflow-section-title");
    sectionTitle.appendChild(createElement("span", "", "MY DASHBOARD"));
    sectionTitle.appendChild(createElement(
      "small",
      "",
      new Intl.DateTimeFormat("zh-CN", {
        month: "long",
        day: "numeric",
        weekday: "short",
      }).format(new Date()),
    ));
    shell.appendChild(sectionTitle);

    const grid = createElement("div", `dashflow-grid${this.editing ? " is-editing" : ""}`);
    grid.style.gridTemplateColumns = `repeat(${dashboard.settings.columns}, minmax(0, 1fr))`;
    grid.style.gridAutoRows = `${dashboard.settings.rowHeight}px`;
    grid.style.gap = `${dashboard.settings.gap}px`;
    shell.appendChild(grid);

    for (const widget of dashboard.widgets.filter((item) => !item.hidden)) {
      const definition = this.plugin.widgetRegistry.get(widget.type);
      if (!definition) continue;
      grid.appendChild(this.renderWidget(dashboard, widget, definition, grid));
    }

    if (this.editing) shell.appendChild(this.renderEditBar(dashboard));

    if (this.configuringWidgetId) {
      const widget = dashboard.widgets.find((item) => item.id === this.configuringWidgetId);
      const definition = widget ? this.plugin.widgetRegistry.get(widget.type) : undefined;
      if (widget && definition) {
        this.container.appendChild(this.renderWidgetConfigModal(dashboard, widget, definition));
      } else {
        this.configuringWidgetId = null;
      }
    }
  }

  private renderHero(dashboard: DashboardDefinition): HTMLElement {
    const hero = createElement("header", "dashflow-hero");
    const copy = createElement("div");
    copy.appendChild(createElement("div", "dashflow-eyebrow", `OBSIDIAN · PERSONAL DASHBOARD · v${PLUGIN_VERSION}`));
    copy.appendChild(createElement("h1", "", dashboard.name));
    copy.appendChild(createElement("p", "", "把 Vault 里的任务、项目和当下行动放到同一个工作台。"));

    const button = createElement(
      "button",
      `dashflow-edit-button${this.editing ? " is-active" : ""}`,
      this.editing ? "完成布局" : "编辑布局",
    );
    button.addEventListener("click", () => {
      this.editing = !this.editing;
      if (!this.editing) this.configuringWidgetId = null;
      this.render();
    });

    hero.append(copy, button);
    return hero;
  }

  private renderPulse(snapshot: VaultSnapshot): HTMLElement {
    const pulse = createElement("div", "dashflow-pulse");
    const pending = snapshot.tasks.filter((task) => !task.completed).length;
    const activeProjects = snapshot.projects.filter((project) => project.status === "active").length;
    const overdue = this.plugin.taskService.overdue(snapshot.tasks).length;
    const items: Array<[string, number | null]> = [
      ["VAULT PULSE", null],
      ["NOTES", snapshot.notes],
      ["PENDING", pending],
      ["PROJECTS", activeProjects],
      ["OVERDUE", overdue],
    ];

    items.forEach(([label, value], index) => {
      const span = createElement("span", index === 0 ? "dashflow-pulse-label" : "");
      if (value !== null) span.appendChild(createElement("strong", "", String(value)));
      span.appendChild(document.createTextNode(label));
      pulse.appendChild(span);
    });

    return pulse;
  }

  private renderWidget(
    dashboard: DashboardDefinition,
    widget: WidgetInstance,
    definition: WidgetDefinition,
    grid: HTMLElement,
  ): HTMLElement {
    const card = createElement("section", "dashflow-widget");
    card.dataset.widgetId = widget.id;
    this.applyGridStyle(card, widget.layout);

    const header = createElement("div", "dashflow-widget-header");
    const title = createElement("div");
    title.appendChild(createElement("span", "dashflow-widget-icon", definition.icon));
    title.appendChild(createElement("strong", "", widget.title ?? definition.name));
    header.appendChild(title);

    if (this.editing) {
      const controls = createElement("div", "dashflow-widget-controls");
      const drag = createElement("button", "", "⠿");
      drag.type = "button";
      drag.title = "拖动";
      drag.addEventListener("pointerdown", (event) => {
        this.startPointerAction(event, dashboard, widget, definition, grid, card, "move");
      });

      const settings = createElement("button", "", "⚙");
      settings.type = "button";
      settings.title = "配置卡片";
      settings.addEventListener("click", () => {
        this.configuringWidgetId = widget.id;
        this.render();
      });

      const remove = createElement("button", "", "×");
      remove.type = "button";
      remove.title = "移除";
      remove.addEventListener("click", async () => {
        await this.plugin.dashboardManager.removeWidget(dashboard.id, widget.id);
        if (this.configuringWidgetId === widget.id) this.configuringWidgetId = null;
        this.render();
      });
      controls.append(drag, settings, remove);
      header.appendChild(controls);
    }

    card.appendChild(header);

    const body = createElement("div", "dashflow-widget-body");
    card.appendChild(body);
    this.renderWidgetBody(body, dashboard, widget);

    if (this.editing) {
      const resize = createElement("button", "dashflow-resize-handle");
      resize.type = "button";
      resize.title = "调整大小";
      resize.setAttribute("aria-label", "调整大小");
      resize.addEventListener("pointerdown", (event) => {
        this.startPointerAction(event, dashboard, widget, definition, grid, card, "resize");
      });
      card.appendChild(resize);
    }

    return card;
  }

  private renderWidgetBody(
    body: HTMLElement,
    dashboard: DashboardDefinition,
    widget: WidgetInstance,
  ): void {
    switch (widget.type) {
      case "quick-capture":
        this.renderQuickCapture(body, widget);
        break;
      case "tasks":
        this.renderTasks(body, widget);
        break;
      case "progress":
        this.renderProgress(body, widget);
        break;
      case "projects":
        this.renderProjects(body, widget);
        break;
      case "upcoming":
        this.renderUpcoming(body, widget);
        break;
      case "countdown":
        this.renderCountdown(body, widget);
        break;
      case "vault-stats":
        this.renderVaultStats(body);
        break;
      default:
        body.appendChild(createElement("div", "dashflow-empty", "未知 Widget"));
        break;
    }
  }

  private renderQuickCapture(body: HTMLElement, widget: WidgetInstance): void {
    const config = widget.config as QuickCaptureWidgetConfig;
    const wrap = createElement("div", "dashflow-capture");
    const textarea = createElement("textarea");
    textarea.placeholder = config.placeholder ?? "现在脑子里在想什么？";
    const footer = createElement("div", "dashflow-capture-footer");
    footer.appendChild(createElement("span", "", "⌘/Ctrl + Enter"));
    const button = createElement("button", "", "捕捉");
    button.type = "button";

    const submit = async (): Promise<void> => {
      if (!textarea.value.trim()) return;
      button.disabled = true;
      const ok = await this.plugin.captureService.capture(textarea.value);
      if (ok) textarea.value = "";
      button.disabled = false;
    };

    button.addEventListener("click", () => void submit());
    textarea.addEventListener("keydown", (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        void submit();
      }
    });

    footer.appendChild(button);
    wrap.append(textarea, footer);
    body.appendChild(wrap);
  }

  private renderTaskList(body: HTMLElement, tasks: Task[], emptyText: string): void {
    if (tasks.length === 0) {
      body.appendChild(createElement("div", "dashflow-empty", emptyText));
      return;
    }

    const list = createElement("div", "dashflow-task-list");
    for (const task of tasks) {
      const row = createElement("label", "dashflow-task");
      const checkbox = createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.addEventListener("change", () => void this.plugin.taskService.toggle(task));

      const text = createElement("span", task.completed ? "is-completed" : "", task.text);
      row.append(checkbox, text);
      if (task.due) row.appendChild(createElement("time", "", task.due.slice(5)));
      list.appendChild(row);
    }
    body.appendChild(list);
  }

  private renderTasks(body: HTMLElement, widget: WidgetInstance): void {
    const config = widget.config as TasksWidgetConfig;
    const snapshot = this.plugin.vaultIndex.getSnapshot();
    const today = this.plugin.taskService.today(snapshot.tasks);
    const overdue = config.includeOverdue
      ? this.plugin.taskService.overdue(snapshot.tasks)
      : [];
    const tasks = [
      ...overdue,
      ...today.filter((task) => !overdue.some((item) => item.id === task.id)),
    ].slice(0, config.limit ?? 10);

    const kicker = createElement("div", "dashflow-widget-kicker");
    kicker.appendChild(document.createTextNode("TODAY"));
    kicker.appendChild(createElement("span", "", `${tasks.filter((task) => !task.completed).length} pending`));
    body.appendChild(kicker);
    this.renderTaskList(body, tasks, "今天没有到期任务");
  }

  private renderProgress(body: HTMLElement, widget: WidgetInstance): void {
    const config = widget.config as ProgressWidgetConfig;
    const today = this.plugin.taskService.today();
    const completed = today.filter((task) => task.completed).length;
    const progress = today.length === 0 ? 0 : Math.round((completed / today.length) * 100);

    const wrap = createElement("div", "dashflow-progress-wrap");
    const ring = createElement("div", "dashflow-progress-ring");
    ring.style.setProperty("--dashflow-progress", `${progress * 3.6}deg`);
    const center = createElement("div");
    center.appendChild(createElement("strong", "", `${progress}%`));
    center.appendChild(createElement("span", "", config.label ?? "TODAY"));
    ring.appendChild(center);

    wrap.append(
      ring,
      createElement("div", "dashflow-progress-meta", `${completed} / ${today.length} completed`),
    );
    body.appendChild(wrap);
  }

  private renderProjects(body: HTMLElement, widget: WidgetInstance): void {
    const config = widget.config as ProjectsWidgetConfig;
    const projects = this.plugin.projectService.active().slice(0, config.limit ?? 6);
    if (projects.length === 0) {
      const empty = createElement("div", "dashflow-empty");
      empty.innerHTML = '创建带有 <code>type: project</code> 的笔记即可在这里出现。';
      body.appendChild(empty);
      return;
    }

    const list = createElement("div", "dashflow-project-list");
    for (const project of projects) {
      const progress = this.plugin.projectService.progress(project);
      const tasks = this.plugin.projectService.tasks(project);
      const row = createElement("button", "dashflow-project-row");
      row.type = "button";
      row.addEventListener("click", () => {
        void this.plugin.app.workspace.openLinkText(project.source.path, "", false);
      });

      const main = createElement("div", "dashflow-project-main");
      main.appendChild(createElement("div", "dashflow-project-name", project.name));
      const bar = createElement("div", "dashflow-project-bar");
      const fill = createElement("span");
      fill.style.width = `${progress}%`;
      bar.appendChild(fill);
      main.appendChild(bar);

      const stat = createElement("div", "dashflow-project-stat");
      stat.appendChild(createElement("strong", "", `${progress}%`));
      stat.appendChild(createElement(
        "span",
        "",
        `${tasks.filter((task) => task.completed).length}/${tasks.length}`,
      ));

      row.append(main, stat);
      list.appendChild(row);
    }
    body.appendChild(list);
  }

  private renderUpcoming(body: HTMLElement, widget: WidgetInstance): void {
    const config = widget.config as UpcomingWidgetConfig;
    const days = config.days ?? 7;
    const tasks = this.plugin.taskService.upcoming(days).slice(0, config.limit ?? 12);
    const kicker = createElement("div", "dashflow-widget-kicker");
    kicker.appendChild(document.createTextNode(`NEXT ${days} DAYS`));
    kicker.appendChild(createElement("span", "", `${tasks.length} tasks`));
    body.appendChild(kicker);
    this.renderTaskList(body, tasks, "未来几天没有到期任务");
  }

  private renderCountdown(body: HTMLElement, widget: WidgetInstance): void {
    const config = widget.config as CountdownWidgetConfig;
    const today = new Date(`${localDate()}T12:00:00`);
    const target = new Date(`${config.targetDate}T12:00:00`);
    const days = Number.isFinite(target.getTime())
      ? Math.max(0, Math.ceil((target.getTime() - today.getTime()) / 86_400_000))
      : 0;

    const wrap = createElement("div", "dashflow-countdown");
    wrap.append(
      createElement("span", "", config.title ?? "COUNTDOWN"),
      createElement("strong", "", String(days)),
      createElement("small", "", "DAYS"),
    );
    body.appendChild(wrap);
  }

  private renderVaultStats(body: HTMLElement): void {
    const snapshot = this.plugin.vaultIndex.getSnapshot();
    const stats: Array<[string, number]> = [
      ["NOTES", snapshot.notes],
      ["PENDING", snapshot.tasks.filter((task) => !task.completed).length],
      ["PROJECTS", snapshot.projects.filter((project) => project.status === "active").length],
      ["DONE", snapshot.tasks.filter((task) => task.completed).length],
    ];

    const grid = createElement("div", "dashflow-stats-grid");
    for (const [label, value] of stats) {
      const item = createElement("div", "dashflow-stat");
      item.append(createElement("strong", "", String(value)), createElement("span", "", label));
      grid.appendChild(item);
    }
    body.appendChild(grid);
  }

  private renderEditBar(dashboard: DashboardDefinition): HTMLElement {
    const bar = createElement("div", "dashflow-edit-bar");
    const select = createElement("select");
    for (const definition of this.plugin.widgetRegistry.list()) {
      const option = createElement("option", "", definition.name);
      option.value = definition.type;
      select.appendChild(option);
    }

    const add = createElement("button", "", "＋ 添加卡片");
    add.type = "button";
    add.addEventListener("click", async () => {
      await this.plugin.dashboardManager.addWidget(dashboard.id, select.value);
      this.render();
    });

    const reset = createElement("button", "", "重置布局");
    reset.type = "button";
    reset.addEventListener("click", async () => {
      await this.plugin.dashboardManager.resetLayout(dashboard.id);
      this.render();
    });

    bar.append(
      select,
      add,
      reset,
      createElement("span", "", "⠿ 拖动 · ⚙ 配置 · 右下角调整大小"),
    );
    return bar;
  }

  private renderWidgetConfigModal(
    dashboard: DashboardDefinition,
    widget: WidgetInstance,
    definition: WidgetDefinition,
  ): HTMLElement {
    const container = createElement("div", "modal-container mod-dim");
    const backdrop = createElement("div", "modal-bg");
    const modal = createElement("div", "modal");
    const closeButton = createElement("button", "modal-close-button", "×");
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "关闭");
    const content = createElement("div", "modal-content");
    const draftConfig: Record<string, unknown> = { ...widget.config };
    let draftTitle = widget.title ?? "";

    const close = (): void => {
      this.configuringWidgetId = null;
      this.render();
    };

    closeButton.addEventListener("click", close);
    backdrop.addEventListener("click", close);
    container.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
    container.tabIndex = -1;

    content.appendChild(createElement("h2", "", `配置 · ${widget.title ?? definition.name}`));
    content.appendChild(createElement(
      "p",
      "setting-item-description",
      "设置只作用于当前这张卡片。同一种 Widget 的其他实例不会被修改。",
    ));

    const titleInput = createElement("input");
    titleInput.type = "text";
    titleInput.value = draftTitle;
    titleInput.placeholder = definition.name;
    titleInput.addEventListener("input", () => {
      draftTitle = titleInput.value;
    });
    content.appendChild(this.renderSettingRow(
      "卡片标题",
      "留空时使用 Widget 默认名称。",
      titleInput,
    ));

    for (const field of definition.settings ?? []) {
      const control = this.createWidgetSettingControl(field, draftConfig);
      content.appendChild(this.renderSettingRow(
        field.label,
        field.description ?? "",
        control,
      ));
    }

    if ((definition.settings?.length ?? 0) === 0) {
      content.appendChild(createElement(
        "p",
        "setting-item-description",
        "这个 Widget 当前没有额外参数，但仍可以为该实例设置独立标题。",
      ));
    }

    const buttons = createElement("div", "modal-button-container");
    const reset = createElement("button", "", "恢复默认");
    reset.type = "button";
    reset.addEventListener("click", async () => {
      await this.plugin.dashboardManager.updateWidget(
        dashboard.id,
        widget.id,
        (current) => ({
          ...current,
          title: undefined,
          config: definition.defaultConfig(),
        }),
      );
      close();
    });

    const cancel = createElement("button", "", "取消");
    cancel.type = "button";
    cancel.addEventListener("click", close);

    const save = createElement("button", "mod-cta", "保存");
    save.type = "button";
    save.addEventListener("click", async () => {
      await this.plugin.dashboardManager.updateWidget(
        dashboard.id,
        widget.id,
        (current) => ({
          ...current,
          title: draftTitle.trim() || undefined,
          config: { ...draftConfig },
        }),
      );
      close();
    });

    buttons.append(reset, cancel, save);
    content.appendChild(buttons);
    modal.append(closeButton, content);
    container.append(backdrop, modal);

    window.setTimeout(() => titleInput.focus(), 0);
    return container;
  }

  private renderSettingRow(
    label: string,
    description: string,
    control: HTMLElement,
  ): HTMLElement {
    const row = createElement("div", "setting-item");
    const info = createElement("div", "setting-item-info");
    info.appendChild(createElement("div", "setting-item-name", label));
    if (description) info.appendChild(createElement("div", "setting-item-description", description));
    const controlWrap = createElement("div", "setting-item-control");
    controlWrap.appendChild(control);
    row.append(info, controlWrap);
    return row;
  }

  private createWidgetSettingControl(
    field: WidgetSettingField,
    draftConfig: Record<string, unknown>,
  ): HTMLElement {
    const current = draftConfig[field.key];

    if (field.type === "toggle") {
      const input = createElement("input");
      input.type = "checkbox";
      input.checked = Boolean(current);
      input.addEventListener("change", () => {
        draftConfig[field.key] = input.checked;
      });
      return input;
    }

    if (field.type === "select") {
      const select = createElement("select");
      for (const optionDefinition of field.options) {
        const option = createElement("option", "", optionDefinition.label);
        option.value = optionDefinition.value;
        option.selected = String(current ?? "") === optionDefinition.value;
        select.appendChild(option);
      }
      select.addEventListener("change", () => {
        draftConfig[field.key] = select.value;
      });
      return select;
    }

    const input = createElement("input");
    input.type = field.type;

    if (field.type === "number") {
      if (field.min !== undefined) input.min = String(field.min);
      if (field.max !== undefined) input.max = String(field.max);
      if (field.step !== undefined) input.step = String(field.step);
      input.value = String(current ?? field.min ?? 0);
      input.addEventListener("change", () => {
        let value = Number(input.value);
        if (!Number.isFinite(value)) value = Number(current ?? field.min ?? 0);
        if (field.min !== undefined) value = Math.max(field.min, value);
        if (field.max !== undefined) value = Math.min(field.max, value);
        draftConfig[field.key] = value;
        input.value = String(value);
      });
      return input;
    }

    input.value = String(current ?? "");
    if (field.type === "text" && field.placeholder) input.placeholder = field.placeholder;
    input.addEventListener("input", () => {
      draftConfig[field.key] = input.value;
    });
    return input;
  }

  private startPointerAction(
    event: PointerEvent,
    dashboard: DashboardDefinition,
    widget: WidgetInstance,
    definition: WidgetDefinition,
    grid: HTMLElement,
    card: HTMLElement,
    mode: "move" | "resize",
  ): void {
    if (!this.editing || window.matchMedia("(max-width: 900px)").matches) return;
    event.preventDefault();
    event.stopPropagation();

    const startX = event.clientX;
    const startY = event.clientY;
    const initial = { ...widget.layout };
    const width = grid.getBoundingClientRect().width;
    let previewWidgets = dashboard.widgets.map((item) => ({
      ...item,
      layout: { ...item.layout },
    }));

    card.classList.add("is-dragging");

    const onMove = (moveEvent: PointerEvent): void => {
      const metrics = {
        columns: dashboard.settings.columns,
        gap: dashboard.settings.gap,
        rowHeight: dashboard.settings.rowHeight,
        containerWidth: width,
      };

      const activeLayout = mode === "move"
        ? moveLayout(initial, moveEvent.clientX - startX, moveEvent.clientY - startY, metrics)
        : resizeLayout(
          initial,
          moveEvent.clientX - startX,
          moveEvent.clientY - startY,
          metrics,
          definition.minSize,
          definition.maxSize,
        );

      previewWidgets = resolveWidgetLayout(
        dashboard.widgets,
        widget.id,
        activeLayout,
        dashboard.settings.columns,
      );
      this.applyGridLayouts(grid, previewWidgets);
    };

    const cleanup = (): void => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      card.classList.remove("is-dragging");
    };

    const onUp = (): void => {
      cleanup();
      void this.plugin.dashboardManager.replaceWidgets(dashboard.id, previewWidgets)
        .then(() => this.render());
    };

    const onCancel = (): void => {
      cleanup();
      this.render();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
    window.addEventListener("pointercancel", onCancel, { once: true });
  }

  private applyGridLayouts(grid: HTMLElement, widgets: WidgetInstance[]): void {
    const byId = new Map(widgets.map((widget) => [widget.id, widget.layout]));
    for (const element of grid.querySelectorAll<HTMLElement>("[data-widget-id]")) {
      const id = element.dataset.widgetId;
      const layout = id ? byId.get(id) : undefined;
      if (layout) this.applyGridStyle(element, layout);
    }
  }

  private applyGridStyle(card: HTMLElement, layout: WidgetLayout): void {
    card.style.gridColumn = `${layout.x + 1} / span ${layout.w}`;
    card.style.gridRow = `${layout.y + 1} / span ${layout.h}`;
  }
}

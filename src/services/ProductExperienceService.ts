import { normalizePath, setIcon } from "obsidian";
import type DashFlowPlugin from "../main";
import type { Project, Task } from "../models";
import {
  PRODUCT_SECTIONS,
  inboxTasks,
  sectionDefinition,
  sectionWidgetTypes,
  todaySummary,
  type ProductSection,
} from "../product/navigation";
import { localDate } from "../utils/date";
import { AIPlanModal } from "../ui/AIPlanModal";
import { GlobalSearchModal } from "../ui/GlobalSearchModal";
import { HabitEditorModal } from "../ui/HabitEditorModal";
import { ProjectDetailModal } from "../ui/ProjectDetailModal";
import { ProjectEditorModal } from "../ui/ProjectEditorModal";
import { TaskEditorModal } from "../ui/TaskEditorModal";

const OBSERVE_OPTIONS: MutationObserverInit = { childList: true, subtree: true };

export class ProductExperienceService {
  private observer: MutationObserver | null = null;
  private scheduled = false;
  private activeSection: ProductSection = "today";

  constructor(private readonly plugin: DashFlowPlugin) {}

  start(): void {
    this.observer = new MutationObserver(() => this.schedule());
    this.observe();
    this.schedule();
  }

  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
  }

  openSection(section: ProductSection): void {
    this.activeSection = section;
    this.decorateSafely();
  }

  currentSection(): ProductSection {
    return this.activeSection;
  }

  private observe(): void {
    this.observer?.observe(document.body, OBSERVE_OPTIONS);
  }

  private schedule(): void {
    if (this.scheduled) return;
    this.scheduled = true;
    window.setTimeout(() => {
      this.scheduled = false;
      this.decorateSafely();
    }, 0);
  }

  /** Disconnect while mutating our own UI so those mutations cannot recursively reschedule decoration. */
  private decorateSafely(): void {
    this.observer?.disconnect();
    try {
      for (const shell of document.querySelectorAll<HTMLElement>(".dashflow-shell")) {
        this.decorateShell(shell);
      }
    } finally {
      this.observe();
    }
  }

  private decorateShell(shell: HTMLElement): void {
    shell.classList.add("dashflow-product-shell");
    const grid = shell.querySelector<HTMLElement>(".dashflow-grid");
    const hero = shell.querySelector<HTMLElement>(".dashflow-hero");
    if (!grid || !hero) return;

    const editing = grid.classList.contains("is-editing");
    shell.classList.toggle("is-layout-editing", editing);
    const nav = this.ensureNavigation(shell);
    this.decorateHeader(hero, editing);
    this.moveWorkspaceSwitcher(shell, nav);
    this.moveEditButton(shell, nav, editing);

    shell.querySelector<HTMLElement>(".dashflow-pulse")?.classList.add("dashflow-product-hidden");
    shell.querySelector<HTMLElement>(".dashflow-section-title")?.classList.add("dashflow-product-hidden");

    if (editing) {
      this.clearSyntheticPages(grid);
      this.removeTodaySummary(shell);
      this.restoreAllWidgets(grid);
      this.syncNavigation(nav, null);
      return;
    }

    this.syncNavigation(nav, this.activeSection);
    this.applySection(shell, grid, this.activeSection);
    this.decorateProjectRows(shell);
  }

  private ensureNavigation(shell: HTMLElement): HTMLElement {
    let nav = shell.querySelector<HTMLElement>(":scope > .dashflow-product-nav");
    if (nav) return nav;

    nav = document.createElement("aside");
    nav.className = "dashflow-product-nav";

    const brand = document.createElement("div");
    brand.className = "dashflow-product-brand";
    const mark = document.createElement("div");
    mark.className = "dashflow-product-brand-mark";
    setIcon(mark, "command");
    const brandCopy = document.createElement("div");
    brandCopy.append(this.text("strong", "DashFlow"), this.text("span", "PERSONAL OS"));
    brand.append(mark, brandCopy);

    const list = document.createElement("nav");
    list.className = "dashflow-product-nav-list";
    for (const section of PRODUCT_SECTIONS) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "dashflow-product-nav-item";
      button.dataset.section = section.id;
      const icon = document.createElement("span");
      icon.className = "dashflow-product-nav-icon";
      setIcon(icon, section.icon);
      button.append(icon, this.text("span", section.label));
      button.addEventListener("click", () => {
        this.activeSection = section.id;
        this.decorateSafely();
      });
      list.appendChild(button);
    }

    const workspace = document.createElement("div");
    workspace.className = "dashflow-sidebar-workspace";
    const workspaceLabel = document.createElement("div");
    workspaceLabel.className = "dashflow-product-nav-label";
    workspaceLabel.textContent = "工作台";
    workspace.appendChild(workspaceLabel);

    const footer = document.createElement("div");
    footer.className = "dashflow-product-nav-footer";
    nav.append(brand, list, workspace, footer);
    shell.prepend(nav);
    return nav;
  }

  private syncNavigation(nav: HTMLElement, section: ProductSection | null): void {
    for (const button of nav.querySelectorAll<HTMLElement>(".dashflow-product-nav-item")) {
      const active = section !== null && button.dataset.section === section;
      button.classList.toggle("is-active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    }
  }

  private moveWorkspaceSwitcher(shell: HTMLElement, nav: HTMLElement): void {
    const switcher = shell.querySelector<HTMLElement>(".dashflow-dashboard-switcher");
    const mount = nav.querySelector<HTMLElement>(".dashflow-sidebar-workspace");
    if (switcher && mount && switcher.parentElement !== mount) mount.appendChild(switcher);
  }

  private moveEditButton(shell: HTMLElement, nav: HTMLElement, editing: boolean): void {
    const button = shell.querySelector<HTMLButtonElement>(".dashflow-edit-button");
    const footer = nav.querySelector<HTMLElement>(".dashflow-product-nav-footer");
    if (!button || !footer) return;
    button.textContent = editing ? "完成自定义" : "自定义布局";
    button.classList.add("dashflow-product-customize");
    if (button.parentElement !== footer) footer.appendChild(button);
  }

  private decorateHeader(hero: HTMLElement, editing: boolean): void {
    const definition = editing
      ? { title: "自定义布局", description: "高级模式：调整 Widget 组合、顺序和尺寸。" }
      : sectionDefinition(this.activeSection);
    const eyebrow = hero.querySelector<HTMLElement>(".dashflow-eyebrow");
    const title = hero.querySelector<HTMLElement>("h1");
    const description = hero.querySelector<HTMLElement>("p");
    hero.querySelector<HTMLElement>(".dashflow-hero-meta")?.remove();

    if (eyebrow) eyebrow.textContent = new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "long" }).format(new Date());
    if (title) title.textContent = definition.title;
    if (description) description.textContent = definition.description;

    let actions = hero.querySelector<HTMLElement>(".dashflow-product-header-actions");
    if (!actions) {
      actions = document.createElement("div");
      actions.className = "dashflow-product-header-actions";
      hero.appendChild(actions);
    }
    actions.replaceChildren();
    if (editing) return;

    const search = this.actionButton("search", "搜索", false);
    search.title = "搜索任务、项目和习惯";
    search.addEventListener("click", () => new GlobalSearchModal(this.plugin).open());
    actions.appendChild(search);

    if (this.activeSection === "today" && this.plugin.data.settings.aiEnabled) {
      const ai = this.actionButton("sparkles", "AI 规划", false);
      ai.addEventListener("click", () => new AIPlanModal(this.plugin).open());
      actions.appendChild(ai);
    }

    const primary = this.primaryActionForSection(this.activeSection);
    if (primary) actions.appendChild(primary);
  }

  private actionButton(iconName: string, label: string, primary: boolean): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `dashflow-product-action${primary ? " is-primary" : ""}`;
    const icon = document.createElement("span");
    setIcon(icon, iconName);
    button.append(icon, this.text("span", label));
    return button;
  }

  private primaryActionForSection(section: ProductSection): HTMLButtonElement | null {
    if (section === "projects") {
      const button = this.actionButton("plus", "新建项目", true);
      button.addEventListener("click", () => new ProjectEditorModal(this.plugin).open());
      return button;
    }
    if (section === "habits") {
      const button = this.actionButton("plus", "新建习惯", true);
      button.addEventListener("click", () => new HabitEditorModal(this.plugin).open());
      return button;
    }
    if (section === "review") return null;
    const button = this.actionButton("plus", "新建任务", true);
    button.addEventListener("click", () => new TaskEditorModal(this.plugin).open());
    return button;
  }

  private applySection(shell: HTMLElement, grid: HTMLElement, section: ProductSection): void {
    this.clearSyntheticPages(grid);
    const dashboard = this.plugin.dashboardManager.active();
    const typeById = new Map(dashboard.widgets.map((widget) => [widget.id, widget.type]));
    const allowed = new Set(sectionWidgetTypes(section));

    for (const card of grid.querySelectorAll<HTMLElement>(":scope > .dashflow-widget[data-widget-id]")) {
      const id = card.dataset.widgetId ?? "";
      const type = typeById.get(id) ?? card.dataset.widgetType ?? "";
      if (type) card.dataset.widgetType = type;
      card.style.display = allowed.has(type) ? "" : "none";
    }

    grid.dataset.productSection = section;
    grid.style.gridTemplateColumns = "repeat(12, minmax(0, 1fr))";
    grid.style.gridAutoRows = "56px";
    grid.style.gap = "14px";

    if (section === "today") {
      this.renderTodaySummary(shell);
      this.layoutType(grid, "tasks", 1, 1, 8, 6);
      this.layoutType(grid, "progress", 9, 1, 4, 2);
      this.layoutType(grid, "upcoming", 9, 3, 4, 4);
      this.layoutType(grid, "projects", 1, 7, 12, 4);
    } else if (section === "inbox") {
      this.removeTodaySummary(shell);
      this.renderInboxPage(grid);
    } else if (section === "projects") {
      this.removeTodaySummary(shell);
      for (const card of grid.querySelectorAll<HTMLElement>(":scope > .dashflow-widget")) card.style.display = "none";
      this.renderProjectsPage(grid);
    } else if (section === "calendar") {
      this.removeTodaySummary(shell);
      this.layoutType(grid, "calendar", 1, 1, 12, 9);
    } else if (section === "habits") {
      this.removeTodaySummary(shell);
      this.layoutType(grid, "habits", 1, 1, 7, 7);
      this.layoutType(grid, "heatmap", 8, 1, 5, 7);
    } else {
      this.removeTodaySummary(shell);
      this.layoutType(grid, "weekly-review", 1, 1, 12, 7);
      this.layoutType(grid, "heatmap", 1, 8, 12, 4);
      this.layoutType(grid, "vault-stats", 1, 12, 12, 2);
    }
  }

  private layoutType(grid: HTMLElement, type: string, column: number, row: number, width: number, height: number): void {
    const card = grid.querySelector<HTMLElement>(`:scope > .dashflow-widget[data-widget-type="${type}"]`);
    if (!card || card.style.display === "none") return;
    card.style.gridColumn = `${column} / span ${width}`;
    card.style.gridRow = `${row} / span ${height}`;
  }

  private restoreAllWidgets(grid: HTMLElement): void {
    for (const card of grid.querySelectorAll<HTMLElement>(":scope > .dashflow-widget")) card.style.display = "";
    grid.removeAttribute("data-product-section");
  }

  private clearSyntheticPages(grid: HTMLElement): void {
    for (const page of grid.querySelectorAll(":scope > .dashflow-product-page")) page.remove();
  }

  private renderTodaySummary(shell: HTMLElement): void {
    const grid = shell.querySelector<HTMLElement>(".dashflow-grid");
    if (!grid) return;
    let summary = shell.querySelector<HTMLElement>(".dashflow-today-summary");
    if (!summary) {
      summary = document.createElement("section");
      summary.className = "dashflow-today-summary";
      grid.insertAdjacentElement("beforebegin", summary);
    }

    const stats = todaySummary(this.plugin.vaultIndex.getSnapshot(), localDate());
    summary.replaceChildren();
    const items: Array<[string, string, string, boolean]> = [
      ["今天", String(stats.focus), "需要推进", false],
      ["逾期", String(stats.overdue), stats.overdue > 0 ? "需要处理" : "状态清爽", stats.overdue > 0],
      ["项目", String(stats.projects), "正在推进", false],
      ["习惯", `${stats.habitsDone}/${stats.habitsScheduled}`, "今日完成", false],
    ];
    for (const [label, value, meta, danger] of items) {
      const item = document.createElement("div");
      item.className = `dashflow-today-summary-item${danger ? " is-danger" : ""}`;
      item.append(this.text("span", label), this.text("strong", value), this.text("small", meta));
      summary.appendChild(item);
    }
  }

  private removeTodaySummary(shell: HTMLElement): void {
    shell.querySelector(".dashflow-today-summary")?.remove();
  }

  private renderInboxPage(grid: HTMLElement): void {
    const page = this.page("dashflow-inbox-page", 10);
    const tasks = inboxTasks(this.plugin.vaultIndex.getSnapshot().tasks, normalizePath(this.plugin.data.settings.inboxPath));
    const head = this.pageHead("未整理", `${tasks.length} 项 · 点击任务补充项目、计划日或截止日`);
    const open = document.createElement("button");
    open.type = "button";
    open.textContent = "打开 Inbox";
    open.addEventListener("click", () => void this.plugin.app.workspace.openLinkText(this.plugin.data.settings.inboxPath, "", false));
    head.appendChild(open);
    page.appendChild(head);

    if (tasks.length === 0) {
      page.appendChild(this.emptyState("收集箱是空的", "想到的事情先记下来；处理时再决定它属于哪里。"));
    } else {
      const list = document.createElement("div");
      list.className = "dashflow-inbox-list";
      for (const task of tasks) list.appendChild(this.inboxTaskRow(task));
      page.appendChild(list);
    }
    grid.appendChild(page);
  }

  private inboxTaskRow(task: Task): HTMLElement {
    const row = document.createElement("div");
    row.className = "dashflow-inbox-row";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", async () => {
      await this.plugin.taskService.toggle(task);
      this.plugin.refreshDashboardViews();
    });
    const main = document.createElement("button");
    main.type = "button";
    main.className = "dashflow-inbox-row-main";
    main.append(
      this.text("strong", task.text),
      this.text("span", [
        task.projectId ? `项目 ${task.projectId}` : "未归项目",
        task.scheduled ? `计划 ${task.scheduled}` : "",
        task.due ? `截止 ${task.due}` : "",
        task.priority !== "normal" ? task.priority : "",
      ].filter(Boolean).join(" · ")),
    );
    main.addEventListener("click", () => new TaskEditorModal(this.plugin, task).open());
    row.append(checkbox, main);
    return row;
  }

  private renderProjectsPage(grid: HTMLElement): void {
    const page = this.page("dashflow-projects-page", 11);
    const projects = this.plugin.projectService.all().filter((project) => project.status !== "archived");
    page.appendChild(this.pageHead("项目组合", `${projects.filter((project) => project.status === "active").length} 个进行中 · 点击项目查看下一步行动`));
    if (projects.length === 0) {
      page.appendChild(this.emptyState("还没有项目", "项目用来承载一个会结束的目标；创建后再把具体任务放进去。"));
    } else {
      const list = document.createElement("div");
      list.className = "dashflow-project-browser";
      for (const project of projects) list.appendChild(this.projectBrowserRow(project));
      page.appendChild(list);
    }
    grid.appendChild(page);
  }

  private projectBrowserRow(project: Project): HTMLElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "dashflow-project-browser-row";
    const progress = this.plugin.projectService.progress(project);
    const openTasks = this.plugin.projectService.tasks(project).filter((task) => !task.completed).length;

    const main = document.createElement("div");
    main.className = "dashflow-project-browser-main";
    const titleLine = document.createElement("div");
    titleLine.append(this.text("strong", project.name), this.statusBadge(project));
    main.append(titleLine, this.text("span", `${project.deadline ? `截止 ${project.deadline}` : "无截止日"} · ${openTasks} 个下一步`));

    const progressWrap = document.createElement("div");
    progressWrap.className = "dashflow-project-browser-progress";
    const track = document.createElement("div");
    const fill = document.createElement("span");
    fill.style.width = `${progress}%`;
    track.appendChild(fill);
    progressWrap.append(this.text("strong", `${progress}%`), track);
    button.append(main, progressWrap);
    button.addEventListener("click", () => new ProjectDetailModal(this.plugin, project.id).open());
    return button;
  }

  private statusBadge(project: Project): HTMLElement {
    const label = project.status === "active" ? "进行中" : project.status === "planned" ? "计划中" : project.status === "paused" ? "暂停" : "已完成";
    const badge = this.text("span", label);
    badge.className = `dashflow-project-status is-${project.status}`;
    return badge;
  }

  private page(extraClass: string, rows: number): HTMLElement {
    const page = document.createElement("section");
    page.className = `dashflow-product-page ${extraClass}`;
    page.style.gridColumn = "1 / -1";
    page.style.gridRow = `1 / span ${rows}`;
    return page;
  }

  private pageHead(title: string, meta: string): HTMLElement {
    const head = document.createElement("div");
    head.className = "dashflow-product-page-head";
    const copy = document.createElement("div");
    copy.append(this.text("strong", title), this.text("span", meta));
    head.appendChild(copy);
    return head;
  }

  private emptyState(title: string, description: string): HTMLElement {
    const empty = document.createElement("div");
    empty.className = "dashflow-product-empty";
    const icon = document.createElement("div");
    setIcon(icon, "check-circle-2");
    const copy = document.createElement("div");
    copy.append(this.text("strong", title), this.text("span", description));
    empty.append(icon, copy);
    return empty;
  }

  private decorateProjectRows(shell: HTMLElement): void {
    const projects = this.plugin.vaultIndex.getSnapshot().projects;
    for (const row of shell.querySelectorAll<HTMLButtonElement>(".dashflow-project-row")) {
      if (row.dataset.dashflowProductProject === "true") continue;
      const name = row.querySelector<HTMLElement>(".dashflow-project-name")?.textContent?.trim();
      const project = name ? projects.find((item) => item.name === name) : undefined;
      if (!project) continue;
      row.dataset.dashflowProductProject = "true";
      row.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        new ProjectDetailModal(this.plugin, project.id).open();
      }, { capture: true });
    }
  }

  private text<K extends keyof HTMLElementTagNameMap>(tag: K, value: string): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag);
    element.textContent = value;
    return element;
  }
}

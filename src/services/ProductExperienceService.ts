import { normalizePath, setIcon } from "obsidian";
import type DashFlowPlugin from "../main";
import type { Habit, Project, Task } from "../models";
import { habitCompletedOn, habitCurrentStreak, habitScheduledOn } from "../habits/habitMath";
import { formatTaskBody } from "../parsers/taskParser";
import {
  PRODUCT_SECTIONS,
  inboxTasks,
  sectionDefinition,
  sectionWidgetTypes,
  type ProductSection,
} from "../product/navigation";
import { addDays, localDate } from "../utils/date";
import { AIPlanModal } from "../ui/AIPlanModal";
import { GlobalSearchModal } from "../ui/GlobalSearchModal";
import { HabitEditorModal } from "../ui/HabitEditorModal";
import { ProjectDetailModal } from "../ui/ProjectDetailModal";
import { ProjectEditorModal } from "../ui/ProjectEditorModal";
import { TaskEditorModal } from "../ui/TaskEditorModal";

const OBSERVE_OPTIONS: MutationObserverInit = { childList: true, subtree: true };
const CUSTOM_SECTIONS = new Set<ProductSection>(["today", "inbox", "projects"]);
const PRIORITY_ORDER: Record<Task["priority"], number> = { urgent: 0, high: 1, normal: 2, low: 3 };

export class ProductExperienceService {
  private observer: MutationObserver | null = null;
  private unsubscribeIndex: (() => void) | null = null;
  private scheduled = false;
  private activeSection: ProductSection = "today";

  constructor(private readonly plugin: DashFlowPlugin) {}

  start(): void {
    this.observer = new MutationObserver(() => this.schedule());
    this.observer.observe(document.body, OBSERVE_OPTIONS);
    this.unsubscribeIndex = this.plugin.vaultIndex.subscribe(() => this.schedule(true));
    this.schedule(true);
  }

  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.unsubscribeIndex?.();
    this.unsubscribeIndex = null;
  }

  openSection(section: ProductSection): void {
    this.activeSection = section;
    this.decorateSafely(true);
  }

  currentSection(): ProductSection {
    return this.activeSection;
  }

  private schedule(force = false): void {
    if (this.scheduled && !force) return;
    this.scheduled = true;
    window.setTimeout(() => {
      this.scheduled = false;
      this.decorateSafely(force);
    }, 0);
  }

  private decorateSafely(force = false): void {
    this.observer?.disconnect();
    try {
      for (const shell of document.querySelectorAll<HTMLElement>(".dashflow-shell")) {
        this.decorateShell(shell, force);
      }
    } finally {
      this.observer?.observe(document.body, OBSERVE_OPTIONS);
    }
  }

  private decorateShell(shell: HTMLElement, force: boolean): void {
    shell.classList.add("dashflow-product-shell", "dashflow-studio-shell");
    const grid = shell.querySelector<HTMLElement>(".dashflow-grid");
    const hero = shell.querySelector<HTMLElement>(".dashflow-hero");
    if (!grid || !hero) return;

    const editing = grid.classList.contains("is-editing");
    shell.classList.toggle("is-layout-editing", editing);
    const nav = this.ensureNavigation(shell);
    this.moveWorkspaceSwitcher(shell, nav);
    this.moveEditButton(shell, nav, editing);

    shell.querySelector<HTMLElement>(".dashflow-pulse")?.classList.add("dashflow-product-hidden");
    shell.querySelector<HTMLElement>(".dashflow-section-title")?.classList.add("dashflow-product-hidden");

    if (editing) {
      nav.classList.add("is-editing");
      this.removeStudioStage(shell);
      hero.classList.remove("dashflow-product-hidden");
      grid.classList.remove("dashflow-product-hidden");
      grid.style.display = "";
      this.restoreAllWidgets(grid);
      this.syncNavigation(nav, null);
      return;
    }

    nav.classList.remove("is-editing");
    hero.classList.add("dashflow-product-hidden");
    this.syncNavigation(nav, this.activeSection);
    this.renderStage(shell, grid, force);
  }

  private ensureNavigation(shell: HTMLElement): HTMLElement {
    let nav = shell.querySelector<HTMLElement>(":scope > .dashflow-product-nav");
    if (nav) return nav;

    nav = document.createElement("aside");
    nav.className = "dashflow-product-nav dashflow-studio-nav";

    const brand = document.createElement("div");
    brand.className = "dashflow-product-brand";
    const mark = document.createElement("div");
    mark.className = "dashflow-product-brand-mark";
    setIcon(mark, "sparkles");
    const brandCopy = document.createElement("div");
    brandCopy.append(this.text("strong", "DashFlow"), this.text("span", "WORKSPACE"));
    brand.append(mark, brandCopy);

    const list = document.createElement("nav");
    list.className = "dashflow-product-nav-list";
    for (const section of PRODUCT_SECTIONS) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "dashflow-product-nav-item";
      button.dataset.section = section.id;
      button.title = section.label;
      const icon = document.createElement("span");
      icon.className = "dashflow-product-nav-icon";
      setIcon(icon, section.icon);
      const label = this.text("span", section.label);
      label.className = "dashflow-product-nav-text";
      const badge = document.createElement("span");
      badge.className = "dashflow-product-nav-badge";
      button.append(icon, label, badge);
      button.addEventListener("click", () => this.openSection(section.id));
      list.appendChild(button);
    }

    const workspace = document.createElement("div");
    workspace.className = "dashflow-sidebar-workspace";

    const footer = document.createElement("div");
    footer.className = "dashflow-product-nav-footer";

    nav.append(brand, list, workspace, footer);
    shell.prepend(nav);
    return nav;
  }

  private syncNavigation(nav: HTMLElement, section: ProductSection | null): void {
    const inboxCount = inboxTasks(
      this.plugin.vaultIndex.getSnapshot().tasks,
      normalizePath(this.plugin.data.settings.inboxPath),
    ).length;
    for (const button of nav.querySelectorAll<HTMLElement>(".dashflow-product-nav-item")) {
      const active = section !== null && button.dataset.section === section;
      button.classList.toggle("is-active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
      const badge = button.querySelector<HTMLElement>(".dashflow-product-nav-badge");
      if (badge) badge.textContent = button.dataset.section === "inbox" && inboxCount > 0 ? String(inboxCount) : "";
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
    button.textContent = editing ? "完成布局" : "自定义布局";
    button.classList.add("dashflow-product-customize");
    if (button.parentElement !== footer) footer.appendChild(button);
  }

  private renderStage(shell: HTMLElement, grid: HTMLElement, force: boolean): void {
    let stage = shell.querySelector<HTMLElement>(":scope > .dashflow-studio-stage");
    if (!stage) {
      stage = document.createElement("main");
      stage.className = "dashflow-studio-stage";
      const nav = shell.querySelector(":scope > .dashflow-product-nav");
      nav?.insertAdjacentElement("afterend", stage);
    }

    const signature = this.renderSignature();
    if (!force && stage.dataset.signature === signature && stage.dataset.section === this.activeSection) return;
    stage.dataset.signature = signature;
    stage.dataset.section = this.activeSection;
    stage.replaceChildren();
    stage.appendChild(this.renderStudioHeader());

    if (CUSTOM_SECTIONS.has(this.activeSection)) {
      grid.classList.add("dashflow-product-hidden");
      grid.style.display = "none";
      if (this.activeSection === "today") stage.appendChild(this.renderToday());
      else if (this.activeSection === "inbox") stage.appendChild(this.renderInbox());
      else stage.appendChild(this.renderProjects());
      return;
    }

    grid.classList.remove("dashflow-product-hidden");
    this.prepareWidgetWorkflow(grid, this.activeSection);
  }

  private renderSignature(): string {
    const snapshot = this.plugin.vaultIndex.getSnapshot();
    const taskBits = snapshot.tasks.map((task) => [task.id, task.completed ? 1 : 0, task.due ?? "", task.scheduled ?? "", task.projectId ?? ""].join(":"));
    const projectBits = snapshot.projects.map((project) => [project.id, project.status, project.deadline ?? ""].join(":"));
    const today = localDate();
    const habitBits = snapshot.habits.map((habit) => [habit.id, habit.status, habit.completedDates.includes(today) ? 1 : 0].join(":"));
    return `${this.activeSection}|${taskBits.join("|")}|${projectBits.join("|")}|${habitBits.join("|")}`;
  }

  private renderStudioHeader(): HTMLElement {
    const definition = sectionDefinition(this.activeSection);
    const header = document.createElement("header");
    header.className = "dashflow-studio-header";

    const copy = document.createElement("div");
    copy.className = "dashflow-studio-header-copy";
    const crumb = this.text("div", "DASHFLOW");
    crumb.className = "dashflow-studio-crumb";
    const titleRow = document.createElement("div");
    titleRow.className = "dashflow-studio-title-row";
    const title = this.text("h1", definition.title);
    const date = this.text("span", new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "short" }).format(new Date()));
    date.className = "dashflow-studio-date";
    titleRow.append(title, date);
    const description = this.text("p", definition.description);
    copy.append(crumb, titleRow, description);

    const actions = document.createElement("div");
    actions.className = "dashflow-studio-actions";
    const search = this.iconAction("search", "搜索");
    search.addEventListener("click", () => new GlobalSearchModal(this.plugin).open());
    actions.appendChild(search);

    if (this.activeSection === "today" && this.plugin.data.settings.aiEnabled) {
      const ai = this.iconAction("sparkles", "AI 规划");
      ai.addEventListener("click", () => new AIPlanModal(this.plugin).open());
      actions.appendChild(ai);
    }

    const primary = this.primaryActionForSection(this.activeSection);
    if (primary) actions.appendChild(primary);
    header.append(copy, actions);
    return header;
  }

  private primaryActionForSection(section: ProductSection): HTMLButtonElement | null {
    if (section === "projects") {
      const button = this.primaryAction("plus", "新建项目");
      button.addEventListener("click", () => new ProjectEditorModal(this.plugin).open());
      return button;
    }
    if (section === "habits") {
      const button = this.primaryAction("plus", "新建习惯");
      button.addEventListener("click", () => new HabitEditorModal(this.plugin).open());
      return button;
    }
    if (section === "review") return null;
    const button = this.primaryAction("plus", section === "today" ? "添加任务" : "新建任务");
    button.addEventListener("click", () => new TaskEditorModal(this.plugin, undefined, section === "today" ? { scheduled: localDate() } : {}).open());
    return button;
  }

  private renderToday(): HTMLElement {
    const snapshot = this.plugin.vaultIndex.getSnapshot();
    const today = localDate();
    const focus = this.focusTasks(snapshot.tasks, today);
    const upcoming = snapshot.tasks
      .filter((task) => !task.completed && Boolean(task.due) && (task.due as string) > today && (task.due as string) <= addDays(today, 7))
      .sort((a, b) => (a.due ?? "9999").localeCompare(b.due ?? "9999") || PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
      .slice(0, 5);
    const activeProjects = this.plugin.projectService.active().slice(0, 4);
    const habits = this.plugin.habitService.active().filter((habit) => habitScheduledOn(habit, today)).slice(0, 5);

    const page = document.createElement("div");
    page.className = "dashflow-studio-page dashflow-studio-today";
    page.appendChild(this.renderQuickAdd(today));

    const context = document.createElement("div");
    context.className = "dashflow-day-context";
    const overdue = focus.filter((task) => Boolean(task.due) && (task.due as string) < today).length;
    const doneHabits = habits.filter((habit) => habitCompletedOn(habit, today)).length;
    context.append(
      this.contextStat("今日焦点", String(focus.length)),
      this.contextStat("逾期", String(overdue), overdue > 0),
      this.contextStat("活动项目", String(this.plugin.projectService.active().length)),
      this.contextStat("习惯", `${doneHabits}/${habits.length}`),
    );
    page.appendChild(context);

    const layout = document.createElement("div");
    layout.className = "dashflow-studio-today-layout";

    const focusPanel = this.surface("dashflow-focus-panel");
    const focusHead = this.surfaceHead("今日焦点", focus.length > 0 ? `${focus.length} 项` : "保持清爽");
    focusPanel.appendChild(focusHead);
    if (focus.length === 0) {
      focusPanel.appendChild(this.emptyState(
        "今天没有必须处理的任务",
        "留白也是一种计划。可以添加一个真正重要的下一步，或者从收集箱里挑一件。",
        [
          ["添加今天任务", () => new TaskEditorModal(this.plugin, undefined, { scheduled: today }).open()],
          ["查看收集箱", () => this.openSection("inbox")],
        ],
      ));
    } else {
      const list = document.createElement("div");
      list.className = "dashflow-studio-task-list";
      for (const task of focus) list.appendChild(this.taskRow(task, today));
      focusPanel.appendChild(list);
    }

    const rail = document.createElement("aside");
    rail.className = "dashflow-studio-context-rail";
    rail.append(
      this.renderUpcomingPanel(upcoming),
      this.renderProjectPanel(activeProjects),
      this.renderHabitPanel(habits, today),
    );
    layout.append(focusPanel, rail);
    page.appendChild(layout);
    return page;
  }

  private renderQuickAdd(today: string): HTMLElement {
    const composer = document.createElement("div");
    composer.className = "dashflow-studio-composer";
    const icon = document.createElement("span");
    icon.className = "dashflow-studio-composer-icon";
    setIcon(icon, "plus");
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "快速添加今天的任务…";
    input.setAttribute("aria-label", "快速添加今天的任务");
    const hint = this.text("span", "Enter");
    hint.className = "dashflow-key-hint";
    input.addEventListener("keydown", async (event) => {
      if (event.key !== "Enter" || !input.value.trim()) return;
      event.preventDefault();
      const body = formatTaskBody({ text: input.value.trim(), scheduled: today, priority: "normal" });
      const ok = await this.plugin.captureService.capture(body);
      if (ok) {
        input.value = "";
        this.plugin.refreshDashboardViews();
      }
    });
    composer.append(icon, input, hint);
    return composer;
  }

  private focusTasks(tasks: Task[], today: string): Task[] {
    const seen = new Set<string>();
    return tasks
      .filter((task) => !task.completed && (task.due === today || task.scheduled === today || (Boolean(task.due) && (task.due as string) < today)))
      .filter((task) => {
        if (seen.has(task.id)) return false;
        seen.add(task.id);
        return true;
      })
      .sort((a, b) => {
        const aOverdue = Boolean(a.due) && (a.due as string) < today ? 0 : 1;
        const bOverdue = Boolean(b.due) && (b.due as string) < today ? 0 : 1;
        return aOverdue - bOverdue
          || PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
          || (a.due ?? a.scheduled ?? "9999").localeCompare(b.due ?? b.scheduled ?? "9999")
          || a.text.localeCompare(b.text);
      });
  }

  private taskRow(task: Task, today: string): HTMLElement {
    const row = document.createElement("div");
    row.className = "dashflow-studio-task-row";
    if (task.due && task.due < today) row.classList.add("is-overdue");
    row.dataset.priority = task.priority;

    const check = document.createElement("button");
    check.type = "button";
    check.className = "dashflow-studio-task-check";
    check.setAttribute("aria-label", `完成 ${task.text}`);
    check.addEventListener("click", async () => {
      await this.plugin.taskService.toggle(task);
      this.plugin.refreshDashboardViews();
    });

    const main = document.createElement("button");
    main.type = "button";
    main.className = "dashflow-studio-task-main";
    const title = this.text("span", task.text);
    title.className = "dashflow-studio-task-title";
    const meta = document.createElement("span");
    meta.className = "dashflow-studio-task-meta";
    const project = task.projectId ? this.plugin.vaultIndex.getSnapshot().projects.find((item) => item.id === task.projectId) : undefined;
    if (project) meta.appendChild(this.metaChip(project.name));
    if (task.due && task.due < today) meta.appendChild(this.metaChip(`逾期 · ${task.due}`, "danger"));
    else if (task.due) meta.appendChild(this.metaChip(`截止 ${task.due}`));
    else if (task.scheduled) meta.appendChild(this.metaChip("今天计划"));
    main.append(title, meta);
    main.addEventListener("click", () => new TaskEditorModal(this.plugin, task).open());

    const edit = this.iconAction("chevron-right", "编辑");
    edit.classList.add("dashflow-studio-row-action");
    edit.addEventListener("click", () => new TaskEditorModal(this.plugin, task).open());
    row.append(check, main, edit);
    return row;
  }

  private renderUpcomingPanel(tasks: Task[]): HTMLElement {
    const panel = this.surface("dashflow-mini-panel");
    panel.appendChild(this.surfaceHead("接下来", "7 天"));
    if (tasks.length === 0) {
      panel.appendChild(this.miniEmpty("未来 7 天没有硬截止。"));
      return panel;
    }
    const list = document.createElement("div");
    list.className = "dashflow-mini-list";
    for (const task of tasks) {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "dashflow-mini-row";
      const day = task.due ? task.due.slice(5).replace("-", "/") : "";
      row.append(this.text("span", task.text), this.text("small", day));
      row.addEventListener("click", () => new TaskEditorModal(this.plugin, task).open());
      list.appendChild(row);
    }
    panel.appendChild(list);
    return panel;
  }

  private renderProjectPanel(projects: Project[]): HTMLElement {
    const panel = this.surface("dashflow-mini-panel");
    panel.appendChild(this.surfaceHead("项目", `${projects.length} 活动`));
    if (projects.length === 0) {
      panel.appendChild(this.miniEmpty("没有正在推进的项目。"));
      return panel;
    }
    const list = document.createElement("div");
    list.className = "dashflow-mini-list";
    for (const project of projects) {
      const progress = this.plugin.projectService.progress(project);
      const row = document.createElement("button");
      row.type = "button";
      row.className = "dashflow-mini-project";
      const copy = document.createElement("span");
      copy.className = "dashflow-mini-project-copy";
      copy.append(this.text("strong", project.name), this.text("small", project.deadline ? `截止 ${project.deadline}` : "无截止日期"));
      const progressEl = this.text("span", `${progress}%`);
      progressEl.className = "dashflow-mini-project-progress";
      row.append(copy, progressEl);
      row.addEventListener("click", () => new ProjectDetailModal(this.plugin, project.id).open());
      list.appendChild(row);
    }
    panel.appendChild(list);
    return panel;
  }

  private renderHabitPanel(habits: Habit[], today: string): HTMLElement {
    const panel = this.surface("dashflow-mini-panel dashflow-mini-habits");
    const completed = habits.filter((habit) => habitCompletedOn(habit, today)).length;
    panel.appendChild(this.surfaceHead("习惯", habits.length > 0 ? `${completed}/${habits.length}` : "今天"));
    if (habits.length === 0) {
      panel.appendChild(this.miniEmpty("今天没有安排习惯。"));
      return panel;
    }
    const list = document.createElement("div");
    list.className = "dashflow-mini-list";
    for (const habit of habits) {
      const done = habitCompletedOn(habit, today);
      const row = document.createElement("button");
      row.type = "button";
      row.className = `dashflow-mini-habit${done ? " is-done" : ""}`;
      const check = document.createElement("span");
      check.className = "dashflow-mini-habit-check";
      if (done) setIcon(check, "check");
      const copy = document.createElement("span");
      copy.className = "dashflow-mini-habit-copy";
      copy.append(this.text("strong", habit.name), this.text("small", `${habitCurrentStreak(habit, today)} 天连续`));
      row.append(check, copy);
      row.addEventListener("click", async () => {
        await this.plugin.habitService.toggleDate(habit, today);
        this.plugin.refreshDashboardViews();
      });
      list.appendChild(row);
    }
    panel.appendChild(list);
    return panel;
  }

  private renderInbox(): HTMLElement {
    const page = document.createElement("div");
    page.className = "dashflow-studio-page dashflow-studio-inbox";
    page.appendChild(this.renderInboxComposer());
    const tasks = inboxTasks(
      this.plugin.vaultIndex.getSnapshot().tasks,
      normalizePath(this.plugin.data.settings.inboxPath),
    );
    const panel = this.surface("dashflow-inbox-surface");
    panel.appendChild(this.surfaceHead("待整理", tasks.length === 0 ? "全部清空" : `${tasks.length} 项`));
    if (tasks.length === 0) {
      panel.appendChild(this.emptyState(
        "收集箱是空的",
        "想到的事先记下来。等你准备处理时，再决定项目、时间和优先级。",
        [["添加一条", () => new TaskEditorModal(this.plugin).open()]],
      ));
    } else {
      const list = document.createElement("div");
      list.className = "dashflow-inbox-list dashflow-studio-task-list";
      for (const task of tasks) {
        const row = this.taskRow(task, localDate());
        row.classList.add("is-inbox");
        list.appendChild(row);
      }
      panel.appendChild(list);
    }
    page.appendChild(panel);
    return page;
  }

  private renderInboxComposer(): HTMLElement {
    const composer = document.createElement("div");
    composer.className = "dashflow-studio-composer dashflow-inbox-composer";
    const icon = document.createElement("span");
    icon.className = "dashflow-studio-composer-icon";
    setIcon(icon, "inbox");
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "先记下来，不用现在整理…";
    const hint = this.text("span", "Enter");
    hint.className = "dashflow-key-hint";
    input.addEventListener("keydown", async (event) => {
      if (event.key !== "Enter" || !input.value.trim()) return;
      event.preventDefault();
      const ok = await this.plugin.captureService.capture(input.value.trim());
      if (ok) {
        input.value = "";
        this.plugin.refreshDashboardViews();
      }
    });
    composer.append(icon, input, hint);
    return composer;
  }

  private renderProjects(): HTMLElement {
    const projects = this.plugin.projectService.all().filter((project) => project.status !== "archived");
    const page = document.createElement("div");
    page.className = "dashflow-studio-page dashflow-studio-projects";

    const toolbar = document.createElement("div");
    toolbar.className = "dashflow-project-toolbar";
    const active = projects.filter((project) => project.status === "active").length;
    const planned = projects.filter((project) => project.status === "planned").length;
    toolbar.append(
      this.contextStat("活动", String(active)),
      this.contextStat("计划", String(planned)),
      this.contextStat("全部", String(projects.length)),
    );
    page.appendChild(toolbar);

    if (projects.length === 0) {
      const panel = this.surface("dashflow-project-empty");
      panel.appendChild(this.emptyState(
        "还没有项目",
        "项目应该代表一个需要多步推进的结果。创建后，可以在详情里持续添加下一步行动。",
        [["创建第一个项目", () => new ProjectEditorModal(this.plugin).open()]],
      ));
      page.appendChild(panel);
      return page;
    }

    const grid = document.createElement("div");
    grid.className = "dashflow-project-board";
    projects.forEach((project, index) => grid.appendChild(this.projectCard(project, index)));
    page.appendChild(grid);
    return page;
  }

  private projectCard(project: Project, index: number): HTMLElement {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `dashflow-project-tile tone-${index % 4}`;
    const progress = this.plugin.projectService.progress(project);
    const tasks = this.plugin.projectService.tasks(project);
    const open = tasks.filter((task) => !task.completed).length;

    const top = document.createElement("div");
    top.className = "dashflow-project-tile-top";
    const status = this.text("span", project.status === "active" ? "进行中" : project.status === "planned" ? "计划" : project.status === "paused" ? "暂停" : "完成");
    status.className = `dashflow-project-status is-${project.status}`;
    const arrow = document.createElement("span");
    arrow.className = "dashflow-project-arrow";
    setIcon(arrow, "arrow-up-right");
    top.append(status, arrow);

    const title = this.text("h3", project.name);
    const description = this.text("p", project.description?.trim() || (project.deadline ? `截止 ${project.deadline}` : "没有设置截止日期"));
    const meta = document.createElement("div");
    meta.className = "dashflow-project-tile-meta";
    meta.append(this.text("span", `${open} 个下一步`), this.text("strong", `${progress}%`));
    const track = document.createElement("div");
    track.className = "dashflow-project-tile-track";
    const fill = document.createElement("span");
    fill.style.width = `${progress}%`;
    track.appendChild(fill);

    card.append(top, title, description, meta, track);
    card.addEventListener("click", () => new ProjectDetailModal(this.plugin, project.id).open());
    return card;
  }

  private prepareWidgetWorkflow(grid: HTMLElement, section: ProductSection): void {
    const dashboard = this.plugin.dashboardManager.active();
    const typeById = new Map(dashboard.widgets.map((widget) => [widget.id, widget.type]));
    const allowed = new Set(sectionWidgetTypes(section));
    grid.dataset.productSection = section;
    grid.style.display = "grid";
    grid.style.gridAutoRows = "auto";

    for (const card of grid.querySelectorAll<HTMLElement>(":scope > .dashflow-widget[data-widget-id]")) {
      const id = card.dataset.widgetId ?? "";
      const type = typeById.get(id) ?? card.dataset.widgetType ?? "";
      if (type) card.dataset.widgetType = type;
      if (!allowed.has(type)) {
        card.style.display = "none";
        continue;
      }
      card.style.display = "";
      card.style.gridRow = "auto";
      if (section === "habits") {
        card.style.gridColumn = type === "habits" ? "1 / span 7" : "8 / span 5";
      } else {
        card.style.gridColumn = "1 / -1";
      }
    }
  }

  private restoreAllWidgets(grid: HTMLElement): void {
    for (const card of grid.querySelectorAll<HTMLElement>(":scope > .dashflow-widget")) {
      card.style.display = "";
      card.style.gridColumn = "";
      card.style.gridRow = "";
    }
    grid.removeAttribute("data-product-section");
  }

  private removeStudioStage(shell: HTMLElement): void {
    shell.querySelector(":scope > .dashflow-studio-stage")?.remove();
  }

  private surface(extraClass = ""): HTMLElement {
    const section = document.createElement("section");
    section.className = `dashflow-studio-surface ${extraClass}`.trim();
    return section;
  }

  private surfaceHead(title: string, meta: string): HTMLElement {
    const head = document.createElement("div");
    head.className = "dashflow-studio-surface-head";
    head.append(this.text("h2", title), this.text("span", meta));
    return head;
  }

  private contextStat(label: string, value: string, danger = false): HTMLElement {
    const item = document.createElement("div");
    item.className = `dashflow-context-stat${danger ? " is-danger" : ""}`;
    item.append(this.text("strong", value), this.text("span", label));
    return item;
  }

  private metaChip(label: string, tone = "default"): HTMLElement {
    const chip = this.text("span", label);
    chip.className = `dashflow-studio-chip is-${tone}`;
    return chip;
  }

  private miniEmpty(text: string): HTMLElement {
    const empty = this.text("p", text);
    empty.className = "dashflow-mini-empty";
    return empty;
  }

  private emptyState(title: string, description: string, actions: Array<[string, () => void]> = []): HTMLElement {
    const empty = document.createElement("div");
    empty.className = "dashflow-studio-empty";
    const icon = document.createElement("div");
    icon.className = "dashflow-studio-empty-icon";
    setIcon(icon, "check");
    const copy = document.createElement("div");
    copy.className = "dashflow-studio-empty-copy";
    copy.append(this.text("strong", title), this.text("p", description));
    empty.append(icon, copy);
    if (actions.length > 0) {
      const row = document.createElement("div");
      row.className = "dashflow-studio-empty-actions";
      actions.forEach(([label, handler], index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = index === 0 ? "is-primary" : "";
        button.textContent = label;
        button.addEventListener("click", handler);
        row.appendChild(button);
      });
      empty.appendChild(row);
    }
    return empty;
  }

  private iconAction(iconName: string, label: string): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "dashflow-studio-icon-action";
    button.title = label;
    button.setAttribute("aria-label", label);
    const icon = document.createElement("span");
    setIcon(icon, iconName);
    button.appendChild(icon);
    return button;
  }

  private primaryAction(iconName: string, label: string): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "dashflow-studio-primary-action";
    const icon = document.createElement("span");
    setIcon(icon, iconName);
    button.append(icon, this.text("span", label));
    return button;
  }

  private text<K extends keyof HTMLElementTagNameMap>(tag: K, value: string): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag);
    element.textContent = value;
    return element;
  }
}

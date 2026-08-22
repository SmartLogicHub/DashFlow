import { normalizePath, Notice, setIcon } from "obsidian";
import type DashFlowPlugin from "../main";
import type { DashboardDefinition, Task, WidgetInstance } from "../models";
import { activityStreak } from "../activity/activityMath";
import { PLUGIN_VERSION } from "../constants";
import { inboxTasks, PRODUCT_SECTIONS, type ProductSection } from "../product/navigation";
import {
  initialProjectView,
  PROJECT_VIEW_OPTIONS,
  PROJECT_VIEW_TYPES,
  projectRecoveryForView,
  recoveryForSection,
  sectionCoverage,
  type ProjectViewType,
  type SectionRecovery,
} from "../product/sectionPolicy";
import { heroPresentationFor } from "../product/heroPresentation";
import { taskOverview, type TaskOverviewMetric } from "../product/progressOverview";
import { isWidgetVisibleInSection } from "../product/widgetVisibility";
import { AIPlanModal } from "../ui/AIPlanModal";
import { FeatureHubModal } from "../ui/FeatureHubModal";
import { GlobalSearchModal } from "../ui/GlobalSearchModal";
import { HabitEditorModal } from "../ui/HabitEditorModal";
import { ProjectDetailModal } from "../ui/ProjectDetailModal";
import { ProjectEditorModal } from "../ui/ProjectEditorModal";
import { QuickAddModal } from "../ui/QuickAddModal";
import { TaskEditorModal } from "../ui/TaskEditorModal";
import { PersonalHomeService } from "./PersonalHomeService";

export class ProductExperienceService {
  private unsubscribeRender: (() => void) | null = null;
  private unsubscribeActivity: (() => void) | null = null;
  private activeSection: ProductSection = "today";
  private activeProjectView: ProjectViewType | null = null;
  private readonly personalHome: PersonalHomeService;

  constructor(private readonly plugin: DashFlowPlugin) {
    this.personalHome = new PersonalHomeService(plugin, (section) => this.openSection(section));
  }

  start(): void {
    this.unsubscribeRender = this.plugin.dashboardRender.subscribe(({ root }) => this.decorateRoot(root, false));
    this.unsubscribeActivity = this.plugin.activityService.subscribe(() => this.refresh(true));
    this.plugin.dashboardRender.forEachRoot((root) => this.decorateRoot(root, true));
  }

  stop(): void {
    this.unsubscribeRender?.();
    this.unsubscribeRender = null;
    this.unsubscribeActivity?.();
    this.unsubscribeActivity = null;
  }

  openSection(section: ProductSection): void {
    this.activeSection = section;
    this.refresh(true);
  }

  currentSection(): ProductSection {
    return this.activeSection;
  }

  currentProjectView(): ProjectViewType | null {
    return this.activeProjectView;
  }

  openProjectView(type: ProjectViewType): void {
    this.activeProjectView = type;
    this.openSection("projects");
  }

  private refresh(force = false): void {
    this.plugin.dashboardRender.forEachRoot((root) => this.decorateRoot(root, force));
  }

  private decorateRoot(root: HTMLElement, force = false): void {
    for (const shell of root.querySelectorAll<HTMLElement>(".dashflow-shell")) {
      this.decorateShell(shell, force);
    }
  }

  private decorateShell(shell: HTMLElement, force = false): void {
    shell.classList.add("dashflow-command-shell");
    shell.classList.remove("dashflow-studio-shell", "dashflow-product-shell");
    shell.querySelector(":scope > .dashflow-product-nav")?.remove();
    shell.querySelector(":scope > .dashflow-studio-stage")?.remove();

    const hero = shell.querySelector<HTMLElement>(".dashflow-hero");
    const pulse = shell.querySelector<HTMLElement>(".dashflow-pulse");
    const title = shell.querySelector<HTMLElement>(".dashflow-section-title");
    const grid = shell.querySelector<HTMLElement>(".dashflow-grid");
    if (!hero || !pulse || !title || !grid) return;

    hero.classList.remove("dashflow-product-hidden");
    pulse.classList.remove("dashflow-product-hidden");
    title.classList.remove("dashflow-product-hidden");
    grid.classList.remove("dashflow-product-hidden");

    const editing = grid.classList.contains("is-editing");
    const personalHome = this.activeSection === "today" && !editing;
    shell.classList.toggle("is-layout-editing", editing);
    shell.classList.toggle("is-personal-home", personalHome);
    this.applyTheme(shell, personalHome);

    const editButton = hero.querySelector<HTMLButtonElement>(".dashflow-edit-button");
    this.decorateHero(hero, personalHome);
    this.decoratePulse(pulse);
    this.decorateTitle(title, editing, editButton);
    const commandBar = this.ensureCommandBar(shell, title);
    this.moveDashboardSwitcher(shell, commandBar);
    this.syncCommandBar(commandBar, editing ? null : this.activeSection);
    this.annotateWidgets(grid);
    this.decorateProgressWidget(grid);
    this.decorateProjectWidget(grid);
    this.decorateTaskPriorityBadges(grid);

    if (editing) {
      this.clearSyntheticPage(grid);
      this.restoreAllWidgets(grid);
      return;
    }

    this.applySection(grid, this.activeSection, force);
  }

  private applyTheme(shell: HTMLElement, home: boolean): void {
    const view = shell.closest<HTMLElement>(".dashflow-view-container");
    if (!view) return;
    view.dataset.dashflowTheme = this.plugin.data.settings.homeTheme;
    view.classList.toggle("dashflow-personal-home-active", home);
    this.plugin.presentationRuntime.refreshAmbientImages();
  }

  private decorateHero(hero: HTMLElement, personalHome: boolean): void {
    hero.replaceChildren();
    hero.style.removeProperty("--df-home-overlay");
    hero.dataset.section = this.activeSection;
    const presentation = heroPresentationFor(this.activeSection);
    const content = document.createElement("div");
    content.className = "dashflow-hero-content";

    if (personalHome) {
      content.classList.add("dashflow-home-hero-content");
      const settings = this.plugin.data.settings;
      hero.style.setProperty("--df-home-overlay", String(Math.max(0, Math.min(80, settings.homeHeroOverlay)) / 100));
      const date = this.text("span", new Intl.DateTimeFormat("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      }).format(new Date()));
      date.className = "dashflow-home-hero-date";
      const heading = this.text("h1", settings.homeHeroTitle || "我的成长");
      const subtitle = this.text("p", settings.homeHeroSubtitle || "把输入变成理解，把理解变成行动。");
      const actions = document.createElement("div");
      actions.className = "dashflow-home-hero-actions";
      const work = this.text("button", "开始今天");
      work.type = "button";
      work.className = "is-primary";
      work.addEventListener("click", () => this.openSection("work"));
      const capture = this.text("button", "收集灵感");
      capture.type = "button";
      capture.addEventListener("click", () => new QuickAddModal(this.plugin).open());
      actions.append(work, capture);
      content.append(date, heading, subtitle, actions);
      hero.appendChild(content);
      return;
    }

    const eyebrow = this.text("span", presentation.eyebrow);
    eyebrow.className = "dashflow-eyebrow";
    const heading = this.text("h1", presentation.title);
    const description = this.text("p", presentation.description);
    content.append(eyebrow, heading, description);
    hero.appendChild(content);
  }

  private decoratePulse(pulse: HTMLElement): void {
    const snapshot = this.plugin.vaultIndex.getSnapshot();
    const pending = snapshot.tasks.filter((task) => !task.completed).length;
    const today = this.plugin.taskService.today().filter((task) => !task.completed).length;
    const streak = activityStreak(this.plugin.data.activity);
    const items: Array<[string, number | null]> = [
      ["VAULT PULSE", null],
      ["NOTES", snapshot.notes],
      ["PENDING", pending],
      ["TODAY", today],
      ["STREAK", streak],
    ];

    pulse.replaceChildren();
    items.forEach(([label, value], index) => {
      const span = document.createElement("span");
      if (index === 0) span.className = "dashflow-pulse-label";
      if (value !== null) span.appendChild(this.text("strong", String(value)));
      span.appendChild(document.createTextNode(label));
      pulse.appendChild(span);
    });
  }

  private decorateTitle(title: HTMLElement, editing: boolean, editButton: HTMLButtonElement | null): void {
    const dashboard = this.plugin.dashboardManager.active();

    const copy = document.createElement("div");
    copy.className = "dashflow-command-title-copy";
    const eyebrow = this.text("span", this.activeSection === "work" ? "工作节奏" : "DashFlow");
    eyebrow.className = "dashflow-command-eyebrow";
    const heading = this.text("strong", dashboard.name === "Home" ? "默认工作台" : dashboard.name);
    heading.className = "dashflow-command-title";
    const meta = this.text("small", `DashFlow · v${PLUGIN_VERSION}`);
    meta.className = "dashflow-command-meta";
    copy.append(eyebrow, heading, meta);

    const right = document.createElement("div");
    right.className = "dashflow-command-title-right";
    const now = new Date();
    const date = this.text("strong", new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(now));
    const weekday = this.text("small", new Intl.DateTimeFormat("zh-CN", {
      weekday: "long",
      month: "short",
      day: "numeric",
    }).format(now));
    const dateWrap = document.createElement("div");
    dateWrap.className = "dashflow-command-date";
    dateWrap.append(date, weekday);
    right.appendChild(dateWrap);

    if (editButton) {
      editButton.textContent = editing ? "完成" : "布局";
      editButton.title = editing ? "完成布局编辑" : "编辑 Dashboard 布局";
      editButton.classList.add("dashflow-command-layout-button");
      right.appendChild(editButton);
    }

    title.replaceChildren(copy, right);
  }

  private ensureCommandBar(shell: HTMLElement, title: HTMLElement): HTMLElement {
    let bar = shell.querySelector<HTMLElement>(":scope > .dashflow-command-bar");
    if (bar) return bar;

    bar = document.createElement("div");
    bar.className = "dashflow-command-bar";

    const nav = document.createElement("nav");
    nav.className = "dashflow-command-nav";
    for (const section of PRODUCT_SECTIONS) {
      const button = this.commandButton(section.icon, section.label);
      button.dataset.section = section.id;
      button.addEventListener("click", () => this.openSection(section.id));
      nav.appendChild(button);
    }

    const actions = document.createElement("div");
    actions.className = "dashflow-command-actions";

    const add = this.commandButton("plus", "添加");
    add.addEventListener("click", () => new QuickAddModal(this.plugin).open());
    const project = this.commandButton("folder-plus", "新建项目");
    project.classList.add("is-secondary-action");
    project.addEventListener("click", () => new ProjectEditorModal(this.plugin).open());
    const habit = this.commandButton("circle-plus", "新建习惯");
    habit.classList.add("is-secondary-action");
    habit.addEventListener("click", () => new HabitEditorModal(this.plugin).open());
    const search = this.commandButton("search", "搜索");
    search.classList.add("is-icon-action");
    search.addEventListener("click", () => new GlobalSearchModal(this.plugin).open());

    const features = this.commandButton("blocks", "功能");
    features.classList.add("is-icon-action", "dashflow-feature-action");
    features.addEventListener("click", () => new FeatureHubModal(this.plugin).open());

    actions.append(add, project, habit, features, search);
    if (this.plugin.data.settings.aiEnabled) {
      const ai = this.commandButton("sparkles", "AI 规划");
      ai.classList.add("is-secondary-action");
      ai.addEventListener("click", () => new AIPlanModal(this.plugin).open());
      actions.appendChild(ai);
    }

    const workspace = document.createElement("div");
    workspace.className = "dashflow-command-workspace";
    bar.append(nav, workspace, actions);
    title.insertAdjacentElement("afterend", bar);
    return bar;
  }

  private moveDashboardSwitcher(shell: HTMLElement, bar: HTMLElement): void {
    const switcher = shell.querySelector<HTMLElement>(".dashflow-dashboard-switcher");
    const workspace = bar.querySelector<HTMLElement>(".dashflow-command-workspace");
    if (switcher && workspace && switcher.parentElement !== workspace) workspace.appendChild(switcher);
  }

  private syncCommandBar(bar: HTMLElement, section: ProductSection | null): void {
    const inboxCount = inboxTasks(
      this.plugin.vaultIndex.getSnapshot().tasks,
      normalizePath(this.plugin.data.settings.inboxPath),
    ).length;

    for (const button of bar.querySelectorAll<HTMLButtonElement>(".dashflow-command-button[data-section]")) {
      const active = section !== null && button.dataset.section === section;
      button.classList.toggle("is-active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");

      let badge = button.querySelector<HTMLElement>(".dashflow-command-badge");
      if (button.dataset.section === "inbox" && inboxCount > 0) {
        if (!badge) {
          badge = document.createElement("span");
          badge.className = "dashflow-command-badge";
          button.appendChild(badge);
        }
        badge.textContent = String(inboxCount);
      } else {
        badge?.remove();
      }
    }
  }

  private commandButton(iconName: string, label: string): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "dashflow-command-button";
    const icon = document.createElement("span");
    icon.className = "dashflow-command-icon";
    setIcon(icon, iconName);
    const text = this.text("span", label);
    text.className = "dashflow-command-label";
    button.append(icon, text);
    return button;
  }

  private annotateWidgets(grid: HTMLElement): void {
    const dashboard = this.plugin.dashboardManager.active();
    const typeById = new Map(dashboard.widgets.map((widget) => [widget.id, widget.type]));
    for (const card of grid.querySelectorAll<HTMLElement>(":scope > .dashflow-widget[data-widget-id]")) {
      const id = card.dataset.widgetId ?? "";
      const type = typeById.get(id);
      if (type) card.dataset.widgetType = type;
    }
  }

  private decorateProgressWidget(grid: HTMLElement): void {
    const card = grid.querySelector<HTMLElement>(":scope > .dashflow-widget[data-widget-type=\"progress\"]");
    const body = card?.querySelector<HTMLElement>(".dashflow-widget-body");
    if (!body) return;

    const snapshot = this.plugin.vaultIndex.getSnapshot();
    const todayTasks = this.plugin.taskService.today();
    const overview = taskOverview(todayTasks, snapshot.tasks);
    const signature = `${overview.today.completed}/${overview.today.total}|${overview.all.completed}/${overview.all.total}`;
    if (body.dataset.commandProgress === signature) return;
    body.dataset.commandProgress = signature;

    const wrap = document.createElement("div");
    wrap.className = "dashflow-task-overview";
    wrap.append(
      this.taskOverviewPrimary(overview.today),
      this.taskOverviewSecondary(overview.all),
    );
    body.replaceChildren(wrap);
  }

  private taskOverviewPrimary(metric: TaskOverviewMetric): HTMLElement {
    const primary = document.createElement("div");
    primary.className = "dashflow-task-overview-primary";
    const label = this.text("span", "今日任务");
    label.className = "dashflow-task-overview-label";
    primary.appendChild(label);

    if (metric.total === 0) {
      const empty = this.text("div", "今天暂无待办");
      empty.className = "dashflow-task-overview-empty";
      primary.appendChild(empty);
      return primary;
    }

    const ring = document.createElement("div");
    ring.className = "dashflow-task-overview-ring";
    ring.style.setProperty("--dashflow-progress", `${metric.percentage * 3.6}deg`);
    const center = document.createElement("div");
    center.appendChild(this.text("strong", `${metric.percentage}%`));
    ring.appendChild(center);
    const caption = this.text("div", `${metric.completed} / ${metric.total} 已完成`);
    caption.className = "dashflow-task-overview-caption";
    primary.append(ring, caption);
    return primary;
  }

  private taskOverviewSecondary(metric: TaskOverviewMetric): HTMLElement {
    const secondary = document.createElement("div");
    secondary.className = "dashflow-task-overview-secondary";
    const heading = document.createElement("div");
    heading.className = "dashflow-task-overview-secondary-heading";
    heading.append(
      this.text("span", "全部任务"),
      this.text("strong", `${metric.percentage}%`),
    );
    const caption = this.text("div", `${metric.completed} / ${metric.total} 已完成`);
    caption.className = "dashflow-task-overview-caption";
    const bar = document.createElement("div");
    bar.className = "dashflow-task-overview-bar";
    const fill = document.createElement("div");
    fill.className = "dashflow-task-overview-bar-fill";
    fill.style.width = `${metric.percentage}%`;
    bar.appendChild(fill);
    secondary.append(heading, caption, bar);
    return secondary;
  }

  private decorateProjectWidget(grid: HTMLElement): void {
    const card = grid.querySelector<HTMLElement>(":scope > .dashflow-widget[data-widget-type=\"projects\"]");
    if (!card) return;
    const projects = this.plugin.projectService.active();
    const rows = [...card.querySelectorAll<HTMLButtonElement>(".dashflow-project-row")];
    if (rows.length === 0) {
      const empty = card.querySelector<HTMLElement>(".dashflow-empty");
      if (empty) empty.textContent = "还没有正在推进的项目。点击上方「新建项目」开始。";
      return;
    }

    rows.forEach((row, index) => {
      const project = projects[index];
      if (!project) return;
      const progress = this.plugin.projectService.progress(project);
      row.dataset.commandProjectId = project.id;
      if (row.dataset.commandDetail !== "1") {
        row.dataset.commandDetail = "1";
        row.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopImmediatePropagation();
          new ProjectDetailModal(this.plugin, project.id).open();
        }, { capture: true });
      }

      let steps = row.querySelector<HTMLElement>(".dashflow-project-steps");
      if (!steps) {
        steps = document.createElement("div");
        steps.className = "dashflow-project-steps";
        const stat = row.querySelector(".dashflow-project-stat");
        row.insertBefore(steps, stat ?? null);
      }
      steps.replaceChildren();
      for (let step = 0; step < 5; step += 1) {
        const node = document.createElement("span");
        node.className = `dashflow-project-step${progress >= step * 25 ? " is-active" : ""}`;
        steps.appendChild(node);
      }
    });
  }

  private decorateTaskPriorityBadges(grid: HTMLElement): void {
    const snapshot = this.plugin.vaultIndex.getSnapshot();
    const byText = new Map<string, Task[]>();
    for (const task of snapshot.tasks) {
      const list = byText.get(task.text) ?? [];
      list.push(task);
      byText.set(task.text, list);
    }

    for (const row of grid.querySelectorAll<HTMLElement>(".dashflow-task")) {
      if (row.querySelector(".dashflow-task-priority")) continue;
      const textElement = row.querySelector<HTMLElement>(":scope > span:not(.dashflow-task-priority)");
      const text = textElement?.textContent?.trim();
      if (!text) continue;
      const task = byText.get(text)?.find((item) => !item.completed) ?? byText.get(text)?.[0];
      if (!task || task.priority === "normal") continue;
      const label = task.priority === "urgent" ? "重要紧急" : task.priority === "high" ? "重要" : "低优先";
      const badge = this.text("span", label);
      badge.className = `dashflow-task-priority is-${task.priority}`;
      const time = row.querySelector("time");
      row.insertBefore(badge, time ?? null);
    }
  }

  private applySection(grid: HTMLElement, section: ProductSection, force = false): void {
    const dashboard = this.plugin.dashboardManager.active();
    grid.dataset.productSection = section;
    grid.style.removeProperty("display");
    grid.style.gridTemplateColumns = `repeat(${dashboard.settings.columns}, minmax(0, 1fr))`;
    grid.style.gridAutoRows = `${dashboard.settings.rowHeight}px`;
    grid.style.gap = `${dashboard.settings.gap}px`;

    if (section === "today") {
      for (const card of grid.querySelectorAll<HTMLElement>(":scope > .dashflow-widget")) this.setCardVisible(card, false);
      grid.style.setProperty("display", "block", "important");
      const currentHome = grid.querySelector<HTMLElement>(":scope > .dashflow-personal-home");
      if (!currentHome || force) {
        this.clearSyntheticPage(grid);
        grid.appendChild(this.personalHome.render());
      }
      return;
    }

    if (section === "inbox") {
      for (const card of grid.querySelectorAll<HTMLElement>(":scope > .dashflow-widget")) this.setCardVisible(card, false);
      grid.style.setProperty("display", "block", "important");
      const currentInbox = grid.querySelector<HTMLElement>(":scope > .dashflow-command-inbox");
      if (!currentInbox || force) {
        this.clearSyntheticPage(grid);
        grid.appendChild(this.renderInboxPage());
      }
      return;
    }

    this.clearSyntheticPage(grid);

    if (section === "projects") {
      this.applyProjectSection(grid, dashboard);
      return;
    }

    const coverage = sectionCoverage(section, dashboard.widgets);
    const recovery = recoveryForSection(section);
    if (coverage.missing && recovery) {
      for (const card of grid.querySelectorAll<HTMLElement>(":scope > .dashflow-widget")) this.setCardVisible(card, false);
      grid.appendChild(this.renderSectionAssist(recovery));
      return;
    }

    for (const card of grid.querySelectorAll<HTMLElement>(":scope > .dashflow-widget[data-widget-id]")) {
      const id = card.dataset.widgetId ?? "";
      const widget = dashboard.widgets.find((item) => item.id === id);
      if (!widget) continue;
      const type = widget.type;

      if (section === "work") {
        const visible = isWidgetVisibleInSection(section, type, widget.hidden);
        this.setCardVisible(card, visible);
        if (visible) this.applySavedLayout(card, widget.layout);
        continue;
      }

      if (section === "calendar") {
        const visible = isWidgetVisibleInSection(section, type, widget.hidden);
        this.setCardVisible(card, visible);
        if (visible) this.applySectionLayout(card, 1, 1, 12, 10);
        continue;
      }

      if (section === "habits") {
        const visible = isWidgetVisibleInSection(section, type, widget.hidden);
        this.setCardVisible(card, visible);
        if (type === "habits") this.applySectionLayout(card, 1, 1, 8, 7);
        if (type === "heatmap") this.applySectionLayout(card, 9, 1, 4, 7);
        continue;
      }

      const visible = isWidgetVisibleInSection(section, type, widget.hidden);
      this.setCardVisible(card, visible);
      if (type === "weekly-review") this.applySectionLayout(card, 1, 1, 12, 8);
      if (type === "heatmap") this.applySectionLayout(card, 1, 9, 12, 5);
      if (type === "vault-stats") this.applySectionLayout(card, 1, 14, 12, 3);
    }
  }

  private applyProjectSection(grid: HTMLElement, dashboard: DashboardDefinition): void {
    const selected = this.activeProjectView ?? initialProjectView(dashboard.widgets);
    this.activeProjectView = selected;
    grid.appendChild(this.renderProjectViewSwitcher(dashboard.widgets, selected));

    let selectedVisible = false;
    for (const card of grid.querySelectorAll<HTMLElement>(":scope > .dashflow-widget[data-widget-id]")) {
      const id = card.dataset.widgetId ?? "";
      const widget = dashboard.widgets.find((item) => item.id === id);
      if (!widget) continue;
      const type = widget.type;
      const isProjectView = PROJECT_VIEW_TYPES.includes(type as ProjectViewType);
      const visible = isProjectView && type === selected && widget.hidden !== true && !selectedVisible;
      this.setCardVisible(card, visible);
      if (visible) {
        selectedVisible = true;
        this.applySectionLayout(card, 1, 2, 12, 9);
      }
    }

    if (!selectedVisible) grid.appendChild(this.renderSectionAssist(projectRecoveryForView(selected)));
  }

  private renderProjectViewSwitcher(widgets: readonly WidgetInstance[], selected: ProjectViewType): HTMLElement {
    const available = new Set(widgets.filter((widget) => widget.hidden !== true).map((widget) => widget.type));
    const switcher = document.createElement("div");
    switcher.className = "dashflow-project-view-switcher";
    switcher.setAttribute("role", "group");
    switcher.setAttribute("aria-label", "项目视图");

    for (const option of PROJECT_VIEW_OPTIONS) {
      const active = option.type === selected;
      const button = document.createElement("button");
      button.type = "button";
      button.className = `dashflow-project-view-button${active ? " is-active" : ""}${available.has(option.type) ? "" : " is-missing"}`;
      button.dataset.projectView = option.type;
      button.setAttribute("aria-pressed", String(active));
      button.title = option.description;
      const icon = document.createElement("span");
      setIcon(icon, option.icon);
      button.append(icon, document.createTextNode(option.label));
      if (!available.has(option.type)) button.appendChild(this.text("small", "未添加"));
      button.addEventListener("click", () => this.openProjectView(option.type));
      switcher.appendChild(button);
    }
    return switcher;
  }

  private setCardVisible(card: HTMLElement, visible: boolean): void {
    if (visible) card.style.removeProperty("display");
    else card.style.setProperty("display", "none", "important");
  }

  private applySavedLayout(card: HTMLElement, layout: { x: number; y: number; w: number; h: number }): void {
    card.style.gridColumn = `${layout.x + 1} / span ${layout.w}`;
    card.style.gridRow = `${layout.y + 1} / span ${layout.h}`;
  }

  private applySectionLayout(card: HTMLElement, column: number, row: number, width: number, height: number): void {
    card.style.gridColumn = `${column} / span ${width}`;
    card.style.gridRow = `${row} / span ${height}`;
  }

  private restoreAllWidgets(grid: HTMLElement): void {
    const dashboard = this.plugin.dashboardManager.active();
    grid.removeAttribute("data-product-section");
    grid.style.removeProperty("display");
    for (const card of grid.querySelectorAll<HTMLElement>(":scope > .dashflow-widget[data-widget-id]")) {
      const id = card.dataset.widgetId ?? "";
      const widget = dashboard.widgets.find((item) => item.id === id);
      if (!widget) continue;
      card.style.removeProperty("display");
      this.applySavedLayout(card, widget.layout);
    }
  }

  private clearSyntheticPage(grid: HTMLElement): void {
    for (const page of grid.querySelectorAll(":scope > .dashflow-command-page, :scope > .dashflow-personal-home, :scope > .dashflow-section-assist, :scope > .dashflow-project-view-switcher")) page.remove();
  }

  private renderSectionAssist(recovery: SectionRecovery): HTMLElement {
    const assist = document.createElement("section");
    assist.className = "dashflow-section-assist";
    const icon = document.createElement("span");
    icon.className = "dashflow-section-assist-icon";
    setIcon(icon, "layout-template");
    const copy = document.createElement("div");
    copy.append(this.text("strong", recovery.title), this.text("p", recovery.description));
    const action = this.text("button", recovery.actionLabel);
    action.type = "button";
    action.addEventListener("click", () => void this.addSectionWidget(recovery));
    assist.append(icon, copy, action);
    return assist;
  }

  private async addSectionWidget(recovery: SectionRecovery): Promise<void> {
    const dashboard = this.plugin.dashboardManager.active();
    const existing = dashboard.widgets.find((widget) => widget.type === recovery.widgetType);
    try {
      if (existing?.hidden) {
        await this.plugin.dashboardManager.updateWidget(dashboard.id, existing.id, (widget) => ({
          ...widget,
          hidden: false,
        }));
      } else {
        const added = await this.plugin.dashboardManager.addWidget(dashboard.id, recovery.widgetType);
        if (!added) {
          new Notice(`DashFlow: 无法加入「${recovery.actionLabel.replace(/^加入/, "")}」。`);
          return;
        }
      }
      this.plugin.refreshDashboardViews();
      this.openSection(recovery.section);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      new Notice(`DashFlow: 补齐视图失败 · ${message}`);
    }
  }

  private renderInboxPage(): HTMLElement {
    const page = document.createElement("section");
    page.className = "dashflow-command-page dashflow-command-inbox";

    const header = document.createElement("div");
    header.className = "dashflow-command-page-head";
    const copy = document.createElement("div");
    copy.append(this.text("small", "INBOX · PROCESS QUEUE"), this.text("h2", "待整理"));
    const open = document.createElement("button");
    open.type = "button";
    open.textContent = "打开 Inbox.md";
    open.addEventListener("click", () => void this.plugin.app.workspace.openLinkText(this.plugin.data.settings.inboxPath, "", false));
    header.append(copy, open);

    const composer = document.createElement("div");
    composer.className = "dashflow-command-inbox-composer";
    const icon = document.createElement("span");
    setIcon(icon, "plus");
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "先记录下来，按 Enter 收集…";
    input.addEventListener("keydown", async (event) => {
      if (event.key !== "Enter" || !input.value.trim()) return;
      event.preventDefault();
      const ok = await this.plugin.captureService.capture(input.value.trim());
      if (ok) {
        input.value = "";
        this.refresh(true);
      }
    });
    const hint = this.text("span", "ENTER");
    composer.append(icon, input, hint);

    const tasks = inboxTasks(
      this.plugin.vaultIndex.getSnapshot().tasks,
      normalizePath(this.plugin.data.settings.inboxPath),
    );
    const list = document.createElement("div");
    list.className = "dashflow-command-inbox-list";
    if (tasks.length === 0) {
      const empty = document.createElement("div");
      empty.className = "dashflow-command-empty";
      const mark = document.createElement("span");
      setIcon(mark, "inbox");
      empty.append(mark, this.text("strong", "🍃 收集箱已归零"), this.text("p", "所有思绪与灵感已妥善安放 · 有新的想法随时按 Enter 快速收集。"));
      list.appendChild(empty);
    } else {
      for (const task of tasks) list.appendChild(this.renderInboxTask(task));
    }

    page.append(header, composer, list);
    return page;
  }

  private renderInboxTask(task: Task): HTMLElement {
    const row = document.createElement("div");
    row.className = "dashflow-command-inbox-row";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", async () => {
      await this.plugin.taskService.toggle(task);
      this.refresh(true);
    });
    const main = document.createElement("button");
    main.type = "button";
    main.append(this.text("strong", task.text), this.text("small", "未整理 · 点击补充项目或日期"));
    main.addEventListener("click", () => new TaskEditorModal(this.plugin, task).open());
    const arrow = document.createElement("span");
    setIcon(arrow, "chevron-right");
    row.append(checkbox, main, arrow);
    return row;
  }

  private text<K extends keyof HTMLElementTagNameMap>(tag: K, value: string): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag);
    element.textContent = value;
    return element;
  }
}

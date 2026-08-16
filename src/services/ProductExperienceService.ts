import { normalizePath, setIcon, TFile } from "obsidian";
import type DashFlowPlugin from "../main";
import type { Task } from "../models";
import { activityStreak } from "../activity/activityMath";
import { PLUGIN_VERSION } from "../constants";
import { inboxTasks, type ProductSection } from "../product/navigation";
import { AIPlanModal } from "../ui/AIPlanModal";
import { GlobalSearchModal } from "../ui/GlobalSearchModal";
import { HabitEditorModal } from "../ui/HabitEditorModal";
import { ProjectDetailModal } from "../ui/ProjectDetailModal";
import { ProjectEditorModal } from "../ui/ProjectEditorModal";
import { QuickAddModal } from "../ui/QuickAddModal";
import { TaskEditorModal } from "../ui/TaskEditorModal";
import { PersonalHomeService } from "./PersonalHomeService";

const OBSERVE_OPTIONS: MutationObserverInit = { childList: true, subtree: true };

const COMMAND_SECTIONS: Array<{ id: ProductSection; label: string; icon: string }> = [
  { id: "today", label: "主页", icon: "home" },
  { id: "work", label: "工作台", icon: "layout-dashboard" },
  { id: "projects", label: "项目", icon: "folder-kanban" },
  { id: "inbox", label: "收集箱", icon: "inbox" },
  { id: "calendar", label: "日历", icon: "calendar-days" },
  { id: "habits", label: "习惯", icon: "repeat-2" },
  { id: "review", label: "复盘", icon: "bar-chart-3" },
];

const WORK_WIDGET_TYPES = new Set([
  "quick-capture",
  "tasks",
  "progress",
  "projects",
  "upcoming",
  "heatmap",
  "countdown",
]);

export class ProductExperienceService {
  private observer: MutationObserver | null = null;
  private unsubscribeIndex: (() => void) | null = null;
  private scheduled = false;
  private activeSection: ProductSection = "today";
  private readonly personalHome: PersonalHomeService;

  constructor(private readonly plugin: DashFlowPlugin) {
    this.personalHome = new PersonalHomeService(plugin, (section) => this.openSection(section));
  }

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

  private decorateSafely(_force = false): void {
    this.observer?.disconnect();
    try {
      for (const shell of document.querySelectorAll<HTMLElement>(".dashflow-shell")) {
        this.decorateShell(shell);
      }
    } finally {
      this.observer?.observe(document.body, OBSERVE_OPTIONS);
    }
  }

  private decorateShell(shell: HTMLElement): void {
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

    this.decorateHero(hero, personalHome);
    this.decoratePulse(pulse);
    this.decorateTitle(shell, title, editing);
    const commandBar = this.ensureCommandBar(shell, title);
    this.moveDashboardSwitcher(shell, commandBar);
    this.syncCommandBar(commandBar, editing ? null : this.activeSection);
    this.annotateWidgets(grid);
    this.decorateProgressWidget(grid);
    this.decorateProjectWidget(grid);
    this.decorateTaskPriorityBadges(grid);
    this.clearSyntheticPage(grid);

    if (editing) {
      this.restoreAllWidgets(grid);
      return;
    }

    this.applySection(grid, this.activeSection);
  }

  private applyTheme(shell: HTMLElement, home: boolean): void {
    const view = shell.closest<HTMLElement>(".dashflow-view-container");
    if (!view) return;
    view.dataset.dashflowTheme = this.plugin.data.settings.homeTheme;
    view.classList.toggle("dashflow-personal-home-active", home);
  }

  private decorateHero(hero: HTMLElement, personalHome: boolean): void {
    hero.replaceChildren();
    hero.style.removeProperty("--df-home-image");
    hero.style.removeProperty("--df-home-overlay");

    if (personalHome) {
      const settings = this.plugin.data.settings;
      hero.style.setProperty("--df-home-overlay", String(Math.max(0, Math.min(80, settings.homeHeroOverlay)) / 100));
      const image = this.resolveHeroImage(settings.homeHeroImagePath);
      if (image) hero.style.setProperty("--df-home-image", `url("${image.replace(/"/g, "%22")}")`);

      const content = document.createElement("div");
      content.className = "dashflow-home-hero-content";
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
      const work = this.text("button", "进入工作台 ↗");
      work.type = "button";
      work.className = "is-primary";
      work.addEventListener("click", () => this.openSection("work"));
      const capture = this.text("button", "记录灵感");
      capture.type = "button";
      capture.addEventListener("click", () => new QuickAddModal(this.plugin).open());
      actions.append(work, capture);
      content.append(date, heading, subtitle, actions);
      hero.appendChild(content);
      return;
    }

    const content = document.createElement("div");
    const heading = this.text("h1", "Obsidian · Personal Dashboard");
    const description = this.text("p", "WHERE TASKS, NOTES, AND PROJECTS CONVERGE.");
    const eyebrow = this.text("span", "DASHFLOW · SECOND BRAIN");
    eyebrow.className = "dashflow-eyebrow";
    content.append(heading, description, eyebrow);
    hero.appendChild(content);
  }

  private resolveHeroImage(pathText: string): string | null {
    const trimmed = pathText.trim();
    if (!trimmed) return null;
    const file = this.plugin.app.vault.getAbstractFileByPath(normalizePath(trimmed));
    return file instanceof TFile ? this.plugin.app.vault.getResourcePath(file) : null;
  }

  private decoratePulse(pulse: HTMLElement): void {
    const snapshot = this.plugin.vaultIndex.getSnapshot();
    const pending = snapshot.tasks.filter((task) => !task.completed).length;
    const today = this.plugin.taskService.today(snapshot.tasks).filter((task) => !task.completed).length;
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

  private decorateTitle(shell: HTMLElement, title: HTMLElement, editing: boolean): void {
    const editButton = shell.querySelector<HTMLButtonElement>(".dashflow-edit-button");
    const dashboard = this.plugin.dashboardManager.active();

    const copy = document.createElement("div");
    copy.className = "dashflow-command-title-copy";
    const eyebrow = this.text("span", this.activeSection === "work" ? "WORK SYSTEM" : "SECOND BRAIN");
    eyebrow.className = "dashflow-command-eyebrow";
    const heading = this.text("strong", dashboard.name === "Home" ? "MY DASHBOARD" : dashboard.name);
    heading.className = "dashflow-command-title";
    const meta = this.text("small", `Obsidian · Personal Dashboard · v${PLUGIN_VERSION}`);
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
    for (const section of COMMAND_SECTIONS) {
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

    actions.append(add, project, habit, search);
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
    const todayTasks = this.plugin.taskService.today(snapshot.tasks);
    const todayCompleted = todayTasks.filter((task) => task.completed).length;
    const todayProgress = todayTasks.length === 0 ? 0 : Math.round((todayCompleted / todayTasks.length) * 100);
    const allCompleted = snapshot.tasks.filter((task) => task.completed).length;
    const allProgress = snapshot.tasks.length === 0 ? 0 : Math.round((allCompleted / snapshot.tasks.length) * 100);
    const signature = `${todayCompleted}/${todayTasks.length}|${allCompleted}/${snapshot.tasks.length}`;
    if (body.dataset.commandProgress === signature) return;
    body.dataset.commandProgress = signature;

    const wrap = document.createElement("div");
    wrap.className = "dashflow-progress-wrap";
    const pair = document.createElement("div");
    pair.className = "dashflow-progress-pair";
    pair.append(
      this.progressMetric("TODAY", todayProgress, `${todayCompleted} / ${todayTasks.length} 已完成`),
      this.progressMetric("ALL TASKS", allProgress, `${allCompleted} / ${snapshot.tasks.length} 已完成`),
    );
    wrap.appendChild(pair);
    body.replaceChildren(wrap);
  }

  private progressMetric(label: string, progress: number, caption: string): HTMLElement {
    const metric = document.createElement("div");
    metric.className = "dashflow-progress-metric";
    const ring = document.createElement("div");
    ring.className = "dashflow-progress-ring";
    ring.style.setProperty("--dashflow-progress", `${progress * 3.6}deg`);
    const center = document.createElement("div");
    center.append(this.text("strong", `${progress}%`), this.text("span", label));
    ring.appendChild(center);
    const meta = this.text("div", caption);
    meta.className = "dashflow-progress-caption";
    metric.append(ring, meta);
    return metric;
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

  private applySection(grid: HTMLElement, section: ProductSection): void {
    const dashboard = this.plugin.dashboardManager.active();
    grid.dataset.productSection = section;
    grid.style.removeProperty("display");
    grid.style.gridTemplateColumns = `repeat(${dashboard.settings.columns}, minmax(0, 1fr))`;
    grid.style.gridAutoRows = `${dashboard.settings.rowHeight}px`;
    grid.style.gap = `${dashboard.settings.gap}px`;

    if (section === "today") {
      for (const card of grid.querySelectorAll<HTMLElement>(":scope > .dashflow-widget")) this.setCardVisible(card, false);
      grid.style.setProperty("display", "block", "important");
      grid.appendChild(this.personalHome.render());
      return;
    }

    if (section === "inbox") {
      for (const card of grid.querySelectorAll<HTMLElement>(":scope > .dashflow-widget")) this.setCardVisible(card, false);
      grid.style.setProperty("display", "block", "important");
      grid.appendChild(this.renderInboxPage());
      return;
    }

    for (const card of grid.querySelectorAll<HTMLElement>(":scope > .dashflow-widget[data-widget-id]")) {
      const id = card.dataset.widgetId ?? "";
      const widget = dashboard.widgets.find((item) => item.id === id);
      if (!widget) continue;
      const type = widget.type;

      if (section === "work") {
        const visible = WORK_WIDGET_TYPES.has(type);
        this.setCardVisible(card, visible);
        if (visible) this.applySavedLayout(card, widget.layout);
        continue;
      }

      if (section === "projects") {
        const visible = type === "projects";
        this.setCardVisible(card, visible);
        if (visible) this.applySectionLayout(card, 1, 1, 12, 8);
        continue;
      }

      if (section === "calendar") {
        const visible = type === "calendar";
        this.setCardVisible(card, visible);
        if (visible) this.applySectionLayout(card, 1, 1, 12, 10);
        continue;
      }

      if (section === "habits") {
        const visible = type === "habits" || type === "heatmap";
        this.setCardVisible(card, visible);
        if (type === "habits") this.applySectionLayout(card, 1, 1, 8, 7);
        if (type === "heatmap") this.applySectionLayout(card, 9, 1, 4, 7);
        continue;
      }

      const visible = type === "weekly-review" || type === "heatmap" || type === "vault-stats";
      this.setCardVisible(card, visible);
      if (type === "weekly-review") this.applySectionLayout(card, 1, 1, 12, 8);
      if (type === "heatmap") this.applySectionLayout(card, 1, 9, 12, 5);
      if (type === "vault-stats") this.applySectionLayout(card, 1, 14, 12, 3);
    }
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
    for (const page of grid.querySelectorAll(":scope > .dashflow-command-page, :scope > .dashflow-personal-home")) page.remove();
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
        this.schedule(true);
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
      empty.append(mark, this.text("strong", "收集箱已经清空"), this.text("p", "新的想法先记下来，处理时再决定项目、日期和优先级。"));
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
      this.schedule(true);
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

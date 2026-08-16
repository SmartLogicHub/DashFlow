import { Notice, setIcon, type App } from "obsidian";
import { activityRange, activityStreak } from "../activity/activityMath";
import { habitCompletedOn, habitScheduledOn } from "../habits/habitMath";
import type DashFlowPlugin from "../main";
import type { Habit } from "../models";
import type { ProductSection } from "../product/navigation";
import { DailyProgressNoteModal } from "../ui/DailyProgressNoteModal";
import { HabitEditorModal } from "../ui/HabitEditorModal";
import { MorningBriefingSettingsModal } from "../ui/MorningBriefingSettingsModal";
import { TaskEditorModal } from "../ui/TaskEditorModal";
import { QuickAddModal } from "../ui/QuickAddModal";
import type { WeReadHighlight } from "./WeReadService";
import { localDate } from "../utils/date";

interface AreaDefinition {
  number: string;
  title: string;
  icon: string;
  section: ProductSection;
  action: string;
}

const AREAS: AreaDefinition[] = [
  { number: "01", title: "我的工作", icon: "briefcase-business", section: "work", action: "进入工作台" },
  { number: "02", title: "我的生活", icon: "sprout", section: "habits", action: "查看习惯" },
  { number: "03", title: "时间规划", icon: "calendar-days", section: "calendar", action: "打开日历" },
  { number: "04", title: "回顾成长", icon: "chart-no-axes-combined", section: "review", action: "开始复盘" },
];

interface SettingsHostApp extends App {
  setting?: {
    open(): void;
    openTabById(id: string): void;
  };
}

export class PersonalHomeService {
  constructor(
    private readonly plugin: DashFlowPlugin,
    private readonly openSection: (section: ProductSection) => void,
  ) {}

  render(): HTMLElement {
    const page = document.createElement("section");
    page.className = "dashflow-personal-home";

    const today = localDate();
    const snapshot = this.plugin.vaultIndex.getSnapshot();
    const focus = this.plugin.taskService.focus(snapshot.tasks).slice(0, 5);
    const todayTasks = this.plugin.taskService.today(snapshot.tasks);
    const activeScheduled = snapshot.habits.filter(
      (habit) => habit.status === "active" && habitScheduledOn(habit, today),
    );
    const scheduledHabits = activeScheduled.filter((habit) => habit.kind !== "daily-progress");
    const completedHabits = scheduledHabits.filter((habit) => habitCompletedOn(habit, today));
    const scheduledDailyProgress = activeScheduled.filter((habit) => habit.kind === "daily-progress");
    const completedDailyProgress = scheduledDailyProgress.filter((habit) => habitCompletedOn(habit, today));
    const activeProjects = this.plugin.projectService.active();
    const openTasks = snapshot.tasks.filter((task) => !task.completed).length;
    const upcomingCount = snapshot.tasks.filter((task) => !task.completed && Boolean(task.due || task.scheduled)).length;
    const streak = activityStreak(this.plugin.data.activity);

    if (this.plugin.morningBriefing.isEnabled()) {
      page.appendChild(this.renderMorningBriefing());
    }
    if (this.plugin.data.settings.weReadShowOnHome) {
      page.appendChild(this.renderWeRead());
    }

    const top = document.createElement("div");
    top.className = "dashflow-home-top-grid";
    top.append(
      this.renderFocus(focus),
      this.renderTodayStatus(
        todayTasks.length,
        todayTasks.filter((task) => task.completed).length,
        completedHabits.length,
        scheduledHabits.length,
        completedDailyProgress.length,
        scheduledDailyProgress.length,
        activeProjects.length,
        streak,
      ),
    );

    const areaSection = document.createElement("section");
    areaSection.className = "dashflow-home-section dashflow-home-areas-section";
    const areaHead = document.createElement("div");
    areaHead.className = "dashflow-home-section-head";
    areaHead.append(this.text("h2", "长期成长"), this.text("span", "工作 · 生活 · 时间 · 复盘"));
    const areaList = document.createElement("div");
    areaList.className = "dashflow-home-area-list";
    const summaries = [
      `${activeProjects.length} 个活动项目 · ${openTasks} 个待办`,
      `${scheduledHabits.length} 个习惯 · ${scheduledDailyProgress.length} 个日更任务`,
      `${upcomingCount} 个带日期的未完成事项`,
      `${streak} 天连续活跃`,
    ];
    AREAS.forEach((area, index) => areaList.appendChild(this.renderArea(area, summaries[index] ?? "")));
    areaSection.append(areaHead, areaList);

    const lower = document.createElement("div");
    lower.className = "dashflow-home-lower-grid";
    lower.append(this.renderActivity(), this.renderRecentNotes());

    page.appendChild(top);
    if (scheduledDailyProgress.length > 0) {
      page.appendChild(this.renderDailyProgress(scheduledDailyProgress, today));
    }
    page.append(areaSection, lower);
    return page;
  }

  private renderMorningBriefing(): HTMLElement {
    const card = document.createElement("section");
    card.className = "dashflow-home-card dashflow-home-morning-briefing";
    const head = document.createElement("div");
    head.className = "dashflow-home-card-head";
    head.append(this.text("strong", "AI 晨间简报"), this.text("span", "YESTERDAY → TODAY"));
    const body = document.createElement("div");
    body.className = "dashflow-home-morning-body";
    body.appendChild(this.text("p", "正在整理昨天的记录…"));
    card.append(head, body);
    void this.loadMorningBriefing(body, false);
    return card;
  }

  private async loadMorningBriefing(body: HTMLElement, force: boolean): Promise<void> {
    try {
      const briefing = await this.plugin.morningBriefing.getBriefing(force);
      if (!body.isConnected) return;
      body.replaceChildren();
      const summary = document.createElement("div");
      summary.className = "dashflow-home-morning-summary";
      summary.append(this.text("small", `昨日复盘 · ${briefing.sourceDate}`), this.text("p", briefing.summary));
      const advice = document.createElement("div");
      advice.className = "dashflow-home-morning-advice";
      advice.append(this.text("strong", "今日建议"), this.text("p", briefing.advice));
      const actions = document.createElement("div");
      actions.className = "dashflow-home-morning-actions";
      const source = this.text("span", briefing.sourcePath);
      source.title = briefing.sourcePath;
      const refresh = document.createElement("button");
      refresh.type = "button";
      refresh.textContent = "重新生成";
      refresh.addEventListener("click", () => {
        body.replaceChildren(this.text("p", "正在重新生成晨间简报…"));
        void this.loadMorningBriefing(body, true);
      });
      actions.append(source, refresh);
      body.append(summary, advice, actions);
    } catch (error) {
      if (!body.isConnected) return;
      const message = error instanceof Error ? error.message : String(error);
      body.replaceChildren();
      const errorBox = document.createElement("div");
      errorBox.className = "dashflow-home-morning-error";
      errorBox.append(this.text("strong", "晨间简报暂时不可用"), this.text("p", message));
      const actions = document.createElement("div");
      actions.className = "dashflow-home-morning-actions";
      const configure = document.createElement("button");
      configure.type = "button";
      configure.textContent = "配置晨报";
      configure.addEventListener("click", () => new MorningBriefingSettingsModal(this.plugin).open());
      const provider = document.createElement("button");
      provider.type = "button";
      provider.textContent = "AI 设置";
      provider.addEventListener("click", () => this.openSettings());
      actions.append(configure, provider);
      body.append(errorBox, actions);
    }
  }

  private renderFocus(tasks: ReturnType<DashFlowPlugin["taskService"]["focus"]>): HTMLElement {
    const card = document.createElement("section");
    card.className = "dashflow-home-card dashflow-home-focus";
    const head = document.createElement("div");
    head.className = "dashflow-home-card-head";
    const title = this.text("strong", "今天");
    const actions = document.createElement("div");
    actions.className = "dashflow-home-card-actions";
    actions.append(this.text("span", `${tasks.length} FOCUS`));
    const add = document.createElement("button");
    add.type = "button";
    add.title = "添加任务";
    setIcon(add, "plus");
    add.addEventListener("click", () => new TaskEditorModal(this.plugin).open());
    actions.appendChild(add);
    head.append(title, actions);
    card.appendChild(head);

    const list = document.createElement("div");
    list.className = "dashflow-home-focus-list";
    if (tasks.length === 0) {
      const empty = document.createElement("div");
      empty.className = "dashflow-home-empty";
      const copy = document.createElement("div");
      copy.append(this.text("strong", "✨ 今日专注已达成"), this.text("p", "暂无紧急待办 · 选一个真正重要的下一步，或享受属于你的专注时光。"));
      const quick = document.createElement("button");
      quick.type = "button";
      quick.textContent = "快速添加";
      quick.addEventListener("click", () => new QuickAddModal(this.plugin).open());
      empty.append(copy, quick);
      list.appendChild(empty);
    } else {
      for (const task of tasks) {
        const row = document.createElement("div");
        row.className = `dashflow-home-focus-row is-${task.priority}`;
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", async () => {
          await this.plugin.taskService.toggle(task);
        });
        const taskBody = document.createElement("button");
        taskBody.type = "button";
        const meta = [
          task.projectId ? `#${task.projectId}` : "",
          task.scheduled ? `计划 ${task.scheduled}` : "",
          task.due ? `截止 ${task.due}` : "",
        ].filter(Boolean).join(" · ");
        taskBody.append(this.text("strong", task.text), this.text("small", meta || "未关联项目"));
        taskBody.addEventListener("click", () => new TaskEditorModal(this.plugin, task).open());
        row.append(checkbox, taskBody);
        list.appendChild(row);
      }
    }
    card.appendChild(list);
    return card;
  }

  private renderTodayStatus(
    totalTasks: number,
    completedTasks: number,
    habitsDone: number,
    habitsTotal: number,
    dailyProgressDone: number,
    dailyProgressTotal: number,
    projects: number,
    streak: number,
  ): HTMLElement {
    const card = document.createElement("section");
    card.className = "dashflow-home-card dashflow-home-status";
    const head = document.createElement("div");
    head.className = "dashflow-home-card-head";
    head.append(this.text("strong", "今日状态"), this.text("span", "LIVE"));
    card.appendChild(head);

    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    const lead = document.createElement("div");
    lead.className = "dashflow-home-status-lead";
    const value = this.text("strong", `${progress}%`);
    const copy = document.createElement("div");
    copy.append(
      this.text("span", "今日完成率"),
      this.text("small", totalTasks === 0 ? "今天还没有安排任务" : `${completedTasks} / ${totalTasks} 项已完成`),
    );
    lead.append(value, copy);
    const track = document.createElement("div");
    track.className = "dashflow-home-status-track";
    const fill = document.createElement("span");
    fill.style.width = `${progress}%`;
    track.appendChild(fill);

    const metrics = document.createElement("div");
    metrics.className = "dashflow-home-status-metrics";
    metrics.append(
      this.metric("习惯", `${habitsDone}/${habitsTotal}`),
      this.metric("日更", `${dailyProgressDone}/${dailyProgressTotal}`),
      this.metric("项目", String(projects)),
      this.metric("连续活跃", `${streak} 天`),
    );
    card.append(lead, track, metrics);
    return card;
  }

  private renderDailyProgress(habits: Habit[], today: string): HTMLElement {
    const card = document.createElement("section");
    card.className = "dashflow-home-card dashflow-home-daily-progress";
    const completed = habits.filter((habit) => habitCompletedOn(habit, today)).length;

    const head = document.createElement("div");
    head.className = "dashflow-home-card-head";
    head.append(this.text("strong", "长期任务 · 今日推进"), this.text("span", `${completed}/${habits.length} DONE`));
    card.appendChild(head);

    const list = document.createElement("div");
    list.className = "dashflow-home-daily-progress-list";
    for (const habit of habits.slice(0, 5)) {
      const done = habitCompletedOn(habit, today);
      const row = document.createElement("div");
      row.className = `dashflow-home-daily-progress-row${done ? " is-done" : ""}`;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = done;
      checkbox.setAttribute("aria-label", `${done ? "取消" : "完成"}今日推进 · ${habit.name}`);
      checkbox.addEventListener("change", () => void this.plugin.habitService.toggleDate(habit, today));

      const progressBody = document.createElement("button");
      progressBody.type = "button";
      progressBody.className = "dashflow-home-daily-progress-main";
      const note = habit.dailyNotes?.[today]?.trim();
      const meta = note
        ? note
        : habit.linkedProjectId
          ? `关联项目 · ${habit.linkedProjectId}`
          : "记录今天实际推进了什么";
      progressBody.append(this.text("strong", habit.name), this.text("small", meta));
      progressBody.addEventListener("click", () => new HabitEditorModal(this.plugin, habit).open());

      const noteButton = document.createElement("button");
      noteButton.type = "button";
      noteButton.className = `dashflow-home-daily-progress-note${note ? " has-note" : ""}`;
      noteButton.title = note ? "编辑今日备注" : "添加今日备注";
      noteButton.setAttribute("aria-label", `${note ? "编辑" : "添加"}今日备注 · ${habit.name}`);
      setIcon(noteButton, note ? "notebook-tabs" : "notebook-pen");
      noteButton.addEventListener("click", () => new DailyProgressNoteModal(this.plugin, habit, today).open());

      row.append(checkbox, progressBody, noteButton);
      list.appendChild(row);
    }
    if (habits.length > 5) {
      const more = this.text("div", `还有 ${habits.length - 5} 个长期任务，可在「习惯」页查看。`);
      more.className = "dashflow-home-daily-progress-more";
      list.appendChild(more);
    }
    card.appendChild(list);
    return card;
  }

  private renderWeRead(): HTMLElement {
    const card = document.createElement("section");
    card.className = "dashflow-home-weread";
    const head = document.createElement("div");
    head.className = "dashflow-home-weread-head";
    head.append(this.text("strong", this.plugin.weRead.isConfigured() ? "微信读书 · 我的划线" : "阅读摘录"), this.text("span", "WEREAD"));
    const body = document.createElement("div");
    body.className = "dashflow-home-weread-body";
    card.append(head, body);

    if (!this.plugin.weRead.isConfigured()) {
      this.renderWeReadDisconnected(body);
      return card;
    }

    this.renderWeReadLoading(body);
    void this.loadWeReadHighlight(body, false);
    return card;
  }

  private renderWeReadDisconnected(body: HTMLElement): void {
    body.replaceChildren();
    const icon = document.createElement("span");
    icon.className = "dashflow-home-weread-mark";
    setIcon(icon, "book-open-text");
    const copy = document.createElement("div");
    copy.className = "dashflow-home-weread-copy";
    copy.append(
      this.text("strong", "连接微信读书后，每天重新发现一句自己的划线。"),
      this.text("p", "没有连接时 DashFlow 不会展示伪造的名言、书封或来源。"),
    );
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "连接微信读书";
    button.addEventListener("click", () => this.openSettings());
    body.append(icon, copy, button);
  }

  private renderWeReadLoading(body: HTMLElement): void {
    body.replaceChildren();
    const loading = this.text("p", "正在读取你的微信读书划线…");
    loading.className = "dashflow-home-weread-loading";
    body.appendChild(loading);
  }

  private async loadWeReadHighlight(body: HTMLElement, next: boolean): Promise<void> {
    try {
      const highlight = await this.plugin.weRead.getHighlight(next);
      if (!body.isConnected) return;
      if (!highlight) {
        body.replaceChildren();
        const copy = document.createElement("div");
        copy.className = "dashflow-home-weread-copy";
        copy.append(this.text("strong", "暂时没有可展示的个人划线"), this.text("p", "DashFlow 只展示微信读书返回的真实个人划线。"));
        const retry = document.createElement("button");
        retry.type = "button";
        retry.textContent = "重新读取";
        retry.addEventListener("click", () => void this.loadWeReadHighlight(body, false));
        body.append(copy, retry);
        return;
      }
      this.renderWeReadHighlight(body, highlight);
    } catch (error) {
      if (!body.isConnected) return;
      const message = error instanceof Error ? error.message : String(error);
      body.replaceChildren();
      const copy = document.createElement("div");
      copy.className = "dashflow-home-weread-copy";
      copy.append(this.text("strong", "微信读书暂时不可用"), this.text("p", message));
      const retry = document.createElement("button");
      retry.type = "button";
      retry.textContent = "重试";
      retry.addEventListener("click", () => void this.loadWeReadHighlight(body, false));
      body.append(copy, retry);
    }
  }

  private renderWeReadHighlight(body: HTMLElement, highlight: WeReadHighlight): void {
    body.replaceChildren();
    const coverWrap = document.createElement("div");
    coverWrap.className = "dashflow-home-weread-cover";
    if (highlight.cover) {
      const cover = document.createElement("img");
      cover.src = highlight.cover;
      cover.alt = `${highlight.title} 封面`;
      cover.loading = "lazy";
      coverWrap.appendChild(cover);
    } else {
      const icon = document.createElement("span");
      setIcon(icon, "book-open-text");
      coverWrap.appendChild(icon);
    }

    const copy = document.createElement("div");
    copy.className = "dashflow-home-weread-copy";
    const meta = [highlight.title, highlight.author].filter(Boolean).join(" · ");
    copy.append(this.text("small", meta));
    const quote = this.text("blockquote", `“${highlight.text}”`);
    copy.appendChild(quote);
    const source = [highlight.chapter, highlight.createdAt ? this.formatUnixDate(highlight.createdAt) : ""].filter(Boolean).join(" · ");
    if (source) copy.appendChild(this.text("p", source));

    const actions = document.createElement("div");
    actions.className = "dashflow-home-weread-actions";
    const next = document.createElement("button");
    next.type = "button";
    next.textContent = "换一条";
    next.addEventListener("click", () => void this.loadWeReadHighlight(body, true));
    actions.appendChild(next);
    if (highlight.deepLink) {
      const open = document.createElement("button");
      open.type = "button";
      open.textContent = "打开阅读 ↗";
      open.addEventListener("click", () => window.open(highlight.deepLink!, "_blank", "noopener,noreferrer"));
      actions.appendChild(open);
    }
    body.append(coverWrap, copy, actions);
  }

  private renderArea(area: AreaDefinition, summary: string): HTMLElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "dashflow-home-area";
    const number = this.text("span", area.number);
    number.className = "dashflow-home-area-number";
    const icon = document.createElement("span");
    icon.className = "dashflow-home-area-icon";
    setIcon(icon, area.icon);
    const copy = document.createElement("span");
    copy.className = "dashflow-home-area-copy";
    copy.append(this.text("strong", area.title), this.text("small", summary));
    const action = this.text("span", `${area.action} →`);
    action.className = "dashflow-home-area-action";
    button.append(number, icon, copy, action);
    button.addEventListener("click", () => this.openSection(area.section));
    return button;
  }

  private renderActivity(): HTMLElement {
    const card = document.createElement("section");
    card.className = "dashflow-home-card dashflow-home-activity";
    const head = document.createElement("div");
    head.className = "dashflow-home-card-head";
    head.append(this.text("strong", "最近 30 天"), this.text("span", `${activityStreak(this.plugin.data.activity)} DAY STREAK`));
    card.appendChild(head);

    const points = activityRange(this.plugin.data.activity, 30, "score");
    const max = Math.max(1, ...points.map((point) => point.value));
    const strip = document.createElement("div");
    strip.className = "dashflow-home-activity-strip";
    for (const point of points) {
      const cell = document.createElement("span");
      const level = point.value === 0 ? 0 : Math.max(1, Math.min(4, Math.ceil((point.value / max) * 4)));
      cell.dataset.level = String(level);
      cell.title = `${point.date} · activity ${point.value}`;
      strip.appendChild(cell);
    }
    card.appendChild(strip);
    return card;
  }

  private renderRecentNotes(): HTMLElement {
    const card = document.createElement("section");
    card.className = "dashflow-home-card dashflow-home-recent";
    const head = document.createElement("div");
    head.className = "dashflow-home-card-head";
    head.append(this.text("strong", "最近记录"), this.text("span", "VAULT"));
    card.appendChild(head);

    const files = [...this.plugin.app.vault.getMarkdownFiles()]
      .sort((a, b) => b.stat.mtime - a.stat.mtime)
      .slice(0, 4);
    const list = document.createElement("div");
    list.className = "dashflow-home-recent-list";
    if (files.length === 0) {
      const empty = this.text("p", "还没有 Markdown 笔记。");
      empty.className = "dashflow-home-recent-empty";
      list.appendChild(empty);
    } else {
      for (const file of files) {
        const row = document.createElement("button");
        row.type = "button";
        const icon = document.createElement("span");
        setIcon(icon, "file-text");
        const copy = document.createElement("span");
        copy.append(this.text("strong", file.basename), this.text("small", file.parent?.path || "Vault"));
        const time = this.text("time", new Intl.DateTimeFormat("zh-CN", { month: "2-digit", day: "2-digit" }).format(new Date(file.stat.mtime)));
        row.append(icon, copy, time);
        row.addEventListener("click", () => void this.plugin.app.workspace.openLinkText(file.path, "", false));
        list.appendChild(row);
      }
    }
    card.appendChild(list);
    return card;
  }

  private metric(label: string, value: string): HTMLElement {
    const el = document.createElement("div");
    el.className = "dashflow-home-metric";
    el.append(this.text("strong", value), this.text("span", label));
    return el;
  }

  private openSettings(): void {
    const app = this.plugin.app as SettingsHostApp;
    if (app.setting) {
      app.setting.open();
      app.setting.openTabById(this.plugin.manifest.id);
      return;
    }
    new Notice("请打开 Obsidian 设置 → DashFlow。");
  }

  private formatUnixDate(timestamp: number): string {
    return new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(timestamp * 1000));
  }

  private text<K extends keyof HTMLElementTagNameMap>(tag: K, value: string): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag);
    element.textContent = value;
    return element;
  }
}

import { Notice } from "obsidian";
import type DashFlowPlugin from "../main";
import type { CalendarEvent, Task, WeeklyReviewWidgetConfig, WidgetInstance } from "../models";
import { HabitEditorModal } from "../ui/HabitEditorModal";
import { TaskEditorModal } from "../ui/TaskEditorModal";
import type {
  WeeklyReviewDailyProgress,
  WeeklyReviewData,
  WeeklyReviewHabit,
  WeeklyReviewProject,
} from "./WeeklyReviewService";

const STYLE_ID = "dashflow-weekly-review-styles";

const WEEKLY_STYLES = `
.dashflow-weekly{height:100%;display:flex;flex-direction:column;gap:10px;min-width:0}
.dashflow-weekly-toolbar{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.dashflow-weekly-period{display:flex;flex-direction:column;gap:2px;min-width:0}.dashflow-weekly-period strong{font-size:13px}.dashflow-weekly-period span{font-size:9px;color:var(--text-faint);letter-spacing:.05em;text-transform:uppercase}
.dashflow-weekly-copy{font-size:9px;padding:4px 8px;border-radius:7px;white-space:nowrap}
.dashflow-weekly-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}
.dashflow-weekly-kpi{border:1px solid var(--background-modifier-border);border-radius:9px;padding:8px 9px;background:color-mix(in srgb,var(--background-primary) 94%,var(--background-secondary));min-width:0}.dashflow-weekly-kpi strong{display:block;font-size:17px;line-height:1.05;letter-spacing:-.03em}.dashflow-weekly-kpi span{display:block;margin-top:3px;font-size:8px;color:var(--text-faint);text-transform:uppercase;letter-spacing:.05em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dashflow-weekly-kpi em{font-style:normal;font-size:8px;color:var(--text-muted)}
.dashflow-weekly-grid{display:grid;grid-template-columns:1.05fr 1fr 1fr;gap:10px;min-height:0;flex:1}
.dashflow-weekly-column{display:flex;flex-direction:column;gap:9px;min-width:0;min-height:0}
.dashflow-weekly-section{border-top:1px solid var(--background-modifier-border);padding-top:7px;min-width:0}.dashflow-weekly-section:first-child{border-top:0;padding-top:0}
.dashflow-weekly-section-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:5px}.dashflow-weekly-section-head strong{font-size:9px;letter-spacing:.06em;text-transform:uppercase}.dashflow-weekly-section-head span{font-size:8px;color:var(--text-faint)}
.dashflow-weekly-list{display:flex;flex-direction:column;gap:5px;min-width:0}
.dashflow-weekly-row{appearance:none;width:100%;border:1px solid var(--background-modifier-border);border-radius:8px;background:var(--background-primary);padding:6px 7px;display:flex;align-items:center;gap:7px;color:var(--text-normal);text-align:left;cursor:pointer;min-width:0}.dashflow-weekly-row:hover{border-color:var(--text-muted)}
.dashflow-weekly-row-main{display:flex;flex-direction:column;gap:1px;min-width:0;flex:1}.dashflow-weekly-row-title{font-size:10px;font-weight:550;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dashflow-weekly-row-meta{font-size:8px;color:var(--text-faint);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dashflow-weekly-badge{font-size:7px;border:1px solid var(--background-modifier-border);border-radius:5px;padding:2px 4px;color:var(--text-muted);white-space:nowrap;text-transform:uppercase}.dashflow-weekly-badge.is-overdue{color:var(--text-error);border-color:color-mix(in srgb,var(--text-error) 36%,var(--background-modifier-border))}.dashflow-weekly-badge.is-project{color:var(--text-warning)}.dashflow-weekly-badge.is-habit{color:var(--text-success)}.dashflow-weekly-badge.is-progress{color:var(--interactive-accent);border-color:color-mix(in srgb,var(--interactive-accent) 38%,var(--background-modifier-border))}
.dashflow-weekly-progress{width:46px;height:4px;border-radius:999px;background:var(--background-modifier-border);overflow:hidden;flex:none}.dashflow-weekly-progress span{display:block;height:100%;background:var(--interactive-accent);border-radius:inherit}
.dashflow-weekly-empty{font-size:9px;color:var(--text-faint);padding:7px 2px}
.dashflow-weekly-note{font-size:8px;color:var(--text-faint);margin-top:auto;padding-top:2px}
@media(max-width:1000px){.dashflow-weekly-grid{grid-template-columns:1fr 1fr}.dashflow-weekly-column:last-child{grid-column:1/-1}.dashflow-weekly-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:700px){.dashflow-weekly-grid{grid-template-columns:1fr}.dashflow-weekly-column:last-child{grid-column:auto}.dashflow-weekly-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}}
`;

export class WeeklyReviewWidgetInteractionService {
  private observer: MutationObserver | null = null;
  private unsubscribeIndex: (() => void) | null = null;
  private unsubscribeActivity: (() => void) | null = null;
  private scheduled = false;

  constructor(private readonly plugin: DashFlowPlugin) {}

  start(): void {
    this.ensureStyles();
    this.unsubscribeIndex = this.plugin.vaultIndex.subscribe(() => this.decorate(true));
    this.unsubscribeActivity = this.plugin.activityService.subscribe(() => this.decorate(true));
    this.observer = new MutationObserver(() => this.schedule());
    this.observer.observe(document.body, { childList: true, subtree: true });
    this.schedule();
  }

  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.unsubscribeIndex?.();
    this.unsubscribeIndex = null;
    this.unsubscribeActivity?.();
    this.unsubscribeActivity = null;
    document.getElementById(STYLE_ID)?.remove();
  }

  private schedule(): void {
    if (this.scheduled) return;
    this.scheduled = true;
    window.setTimeout(() => {
      this.scheduled = false;
      this.decorate(false);
    }, 0);
  }

  private decorate(force: boolean): void {
    const dashboard = this.plugin.dashboardManager.active();
    const widgets = new Map(dashboard.widgets.map((widget) => [widget.id, widget]));

    for (const card of document.querySelectorAll<HTMLElement>(".dashflow-widget[data-widget-id]")) {
      const widgetId = card.dataset.widgetId;
      const widget = widgetId ? widgets.get(widgetId) : undefined;
      if (!widget || widget.type !== "weekly-review") continue;
      const body = card.querySelector<HTMLElement>(".dashflow-widget-body");
      if (!body) continue;
      if (!force && body.dataset.dashflowWeeklyReview === widget.id) continue;
      this.render(body, widget);
    }
  }

  private render(body: HTMLElement, widget: WidgetInstance): void {
    const config = widget.config as WeeklyReviewWidgetConfig;
    const review = this.plugin.weeklyReviewService.review(config);
    const carryLimit = this.limit(config.carryoverLimit, 8, 50);
    const projectLimit = this.limit(config.projectLimit, 6, 30);
    const nextLimit = this.limit(config.nextWeekLimit, 8, 50);

    body.innerHTML = "";
    body.dataset.dashflowWeeklyReview = widget.id;

    const root = document.createElement("div");
    root.className = "dashflow-weekly";
    root.append(this.toolbar(review, config));
    root.append(this.kpis(review, config));

    const grid = document.createElement("div");
    grid.className = "dashflow-weekly-grid";

    const left = document.createElement("div");
    left.className = "dashflow-weekly-column";
    left.append(this.attentionSection(review, carryLimit));

    const middle = document.createElement("div");
    middle.className = "dashflow-weekly-column";
    middle.append(this.projectsSection(review, projectLimit));
    if (config.showHabits !== false) middle.append(this.habitsSection(review));

    const right = document.createElement("div");
    right.className = "dashflow-weekly-column";
    right.append(this.dailyProgressSection(review));
    right.append(this.nextWeekSection(review, nextLimit));
    const note = document.createElement("div");
    note.className = "dashflow-weekly-note";
    note.textContent = review.activityPartial
      ? `Activity 从 ${this.plugin.activityService.getStore().startedAt} 开始记录，本周数据为部分统计。`
      : `Activity tracking since ${this.plugin.activityService.getStore().startedAt}`;
    right.appendChild(note);

    grid.append(left, middle, right);
    root.appendChild(grid);
    body.appendChild(root);
  }

  private toolbar(review: WeeklyReviewData, config: WeeklyReviewWidgetConfig): HTMLElement {
    const toolbar = document.createElement("div");
    toolbar.className = "dashflow-weekly-toolbar";
    const period = document.createElement("div");
    period.className = "dashflow-weekly-period";
    const title = document.createElement("strong");
    title.textContent = `${this.shortDate(review.week.start)} → ${this.shortDate(review.week.end)}`;
    const subtitle = document.createElement("span");
    subtitle.textContent = "CURRENT WEEK · REVIEW & RESET";
    period.append(title, subtitle);

    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "dashflow-weekly-copy";
    copy.textContent = "复制周报";
    copy.addEventListener("click", () => {
      const markdown = this.plugin.weeklyReviewService.toMarkdown(review, config);
      void navigator.clipboard.writeText(markdown)
        .then(() => new Notice("DashFlow: Weekly Review 已复制"))
        .catch(() => new Notice("DashFlow: 无法访问剪贴板"));
    });
    toolbar.append(period, copy);
    return toolbar;
  }

  private kpis(review: WeeklyReviewData, config: WeeklyReviewWidgetConfig): HTMLElement {
    const wrap = document.createElement("div");
    wrap.className = "dashflow-weekly-kpis";
    wrap.append(
      this.kpi(String(review.activity.tasksCompleted), "tasks done", `${review.activity.activeDays}/7 active days`),
      this.kpi(`${review.habitRate}%`, "habit rate", `${review.habitCompleted}/${review.habitScheduled}`),
      this.kpi(`${review.dailyProgressRate}%`, "daily progress", `${review.dailyProgressCompleted}/${review.dailyProgressScheduled} · ${review.dailyProgressNoteCount} notes`),
    );

    if (config.showActivityComparison !== false) {
      const change = review.activityChange;
      const value = change === null ? "NEW" : `${change >= 0 ? "+" : ""}${change}%`;
      wrap.append(this.kpi(value, "activity vs last week", `${review.activity.score} score`));
    } else {
      wrap.append(this.kpi(String(review.activity.score), "activity score", `${review.activity.notesTouched} note actions`));
    }
    return wrap;
  }

  private attentionSection(review: WeeklyReviewData, limit: number): HTMLElement {
    const section = this.section("需要处理", `${review.attentionTasks.length} OPEN`);
    const list = this.list();
    const visible = review.attentionTasks.slice(0, limit);
    if (visible.length === 0) list.append(this.empty("没有逾期或本周待完成任务。"));
    else for (const task of visible) list.append(this.taskRow(task, review.anchor));
    if (review.attentionTasks.length > visible.length) {
      list.append(this.empty(`还有 ${review.attentionTasks.length - visible.length} 项未显示`));
    }
    section.appendChild(list);
    return section;
  }

  private projectsSection(review: WeeklyReviewData, limit: number): HTMLElement {
    const section = this.section("项目状态", `${review.projects.length} ACTIVE`);
    const list = this.list();
    const visible = review.projects.slice(0, limit);
    if (visible.length === 0) list.append(this.empty("没有活动项目。"));
    else for (const item of visible) list.append(this.projectRow(item));
    section.appendChild(list);
    return section;
  }

  private habitsSection(review: WeeklyReviewData): HTMLElement {
    const section = this.section("Habit", `${review.habitCompleted}/${review.habitScheduled}`);
    const list = this.list();
    const visible = review.habits.slice(0, 5);
    if (visible.length === 0) list.append(this.empty("本周没有需要执行的 Habit。"));
    else for (const item of visible) list.append(this.habitRow(item));
    section.appendChild(list);
    return section;
  }

  private dailyProgressSection(review: WeeklyReviewData): HTMLElement {
    const meta = `${review.dailyProgressCompleted}/${review.dailyProgressScheduled} · ${review.dailyProgressNoteCount} NOTES`;
    const section = this.section("Daily Progress", meta);
    const list = this.list();
    const visible = review.dailyProgress.slice(0, 5);
    if (visible.length === 0) list.append(this.empty("本周没有长期日更任务。"));
    else for (const item of visible) list.append(this.dailyProgressRow(item));
    if (review.dailyProgress.length > visible.length) {
      list.append(this.empty(`还有 ${review.dailyProgress.length - visible.length} 项未显示`));
    }
    section.appendChild(list);
    return section;
  }

  private nextWeekSection(review: WeeklyReviewData, limit: number): HTMLElement {
    const section = this.section("下周关注", `${this.shortDate(review.nextWeek.start)} → ${this.shortDate(review.nextWeek.end)}`);
    const list = this.list();
    const visible = review.nextWeekEvents.slice(0, limit);
    if (visible.length === 0) list.append(this.empty("下周暂无任务或项目截止日。"));
    else for (const event of visible) list.append(this.eventRow(event));
    if (review.nextWeekEvents.length > visible.length) {
      list.append(this.empty(`还有 ${review.nextWeekEvents.length - visible.length} 项未显示`));
    }
    section.appendChild(list);
    return section;
  }

  private taskRow(task: Task, anchor: string): HTMLElement {
    const row = this.rowButton(() => new TaskEditorModal(this.plugin, task).open());
    const overdue = Boolean(task.due && task.due < anchor);
    row.append(
      this.badge(overdue ? "OVERDUE" : task.due?.slice(5) ?? "DUE", overdue ? "is-overdue" : ""),
      this.rowMain(task.text, `${task.priority.toUpperCase()}${task.projectId ? ` · ${task.projectId}` : ""}`),
    );
    return row;
  }

  private projectRow(item: WeeklyReviewProject): HTMLElement {
    const row = this.rowButton(() => {
      void this.plugin.app.workspace.openLinkText(item.project.source.path, "", false);
    });
    const progress = document.createElement("span");
    progress.className = "dashflow-weekly-progress";
    const fill = document.createElement("span");
    fill.style.width = `${Math.max(0, Math.min(100, item.progress))}%`;
    progress.appendChild(fill);
    row.append(
      this.badge(`${item.progress}%`, "is-project"),
      this.rowMain(item.project.name, item.project.deadline ? `deadline ${item.project.deadline}` : "no deadline"),
      progress,
    );
    return row;
  }

  private habitRow(item: WeeklyReviewHabit): HTMLElement {
    const row = this.rowButton(() => new HabitEditorModal(this.plugin, item.habit).open());
    row.append(
      this.badge(`${item.stats.rate}%`, "is-habit"),
      this.rowMain(item.habit.name, `${item.stats.completed}/${item.stats.scheduled} completed`),
    );
    return row;
  }

  private dailyProgressRow(item: WeeklyReviewDailyProgress): HTMLElement {
    const row = this.rowButton(() => new HabitEditorModal(this.plugin, item.habit).open());
    const latest = item.notes[0];
    const meta = latest
      ? `${this.shortDate(latest.date)} · ${latest.note}`
      : `${item.stats.completed}/${item.stats.scheduled} days · no notes this week`;
    row.append(
      this.badge(`${item.stats.rate}%`, "is-progress"),
      this.rowMain(item.habit.name, meta),
    );
    return row;
  }

  private eventRow(event: CalendarEvent): HTMLElement {
    const row = this.rowButton(() => this.openEvent(event));
    row.append(
      this.badge(event.kind === "project-deadline" ? "PROJECT" : event.kind === "task-scheduled" ? "PLAN" : "DUE", event.kind === "project-deadline" ? "is-project" : ""),
      this.rowMain(event.title, event.date),
    );
    return row;
  }

  private openEvent(event: CalendarEvent): void {
    const snapshot = this.plugin.vaultIndex.getSnapshot();
    if (event.kind === "task-due" || event.kind === "task-scheduled") {
      const task = snapshot.tasks.find((item) => item.id === event.entityId);
      if (task) new TaskEditorModal(this.plugin, task).open();
      return;
    }
    void this.plugin.app.workspace.openLinkText(event.source.path, "", false);
  }

  private section(title: string, meta: string): HTMLElement {
    const section = document.createElement("section");
    section.className = "dashflow-weekly-section";
    const head = document.createElement("div");
    head.className = "dashflow-weekly-section-head";
    const strong = document.createElement("strong");
    strong.textContent = title;
    const span = document.createElement("span");
    span.textContent = meta;
    head.append(strong, span);
    section.appendChild(head);
    return section;
  }

  private list(): HTMLElement {
    const list = document.createElement("div");
    list.className = "dashflow-weekly-list";
    return list;
  }

  private rowButton(action: () => void): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "dashflow-weekly-row";
    button.addEventListener("click", action);
    return button;
  }

  private rowMain(title: string, meta: string): HTMLElement {
    const main = document.createElement("span");
    main.className = "dashflow-weekly-row-main";
    const titleEl = document.createElement("span");
    titleEl.className = "dashflow-weekly-row-title";
    titleEl.textContent = title;
    const metaEl = document.createElement("span");
    metaEl.className = "dashflow-weekly-row-meta";
    metaEl.textContent = meta;
    main.append(titleEl, metaEl);
    return main;
  }

  private badge(text: string, extraClass = ""): HTMLElement {
    const badge = document.createElement("span");
    badge.className = `dashflow-weekly-badge${extraClass ? ` ${extraClass}` : ""}`;
    badge.textContent = text;
    return badge;
  }

  private kpi(value: string, label: string, detail: string): HTMLElement {
    const item = document.createElement("div");
    item.className = "dashflow-weekly-kpi";
    const strong = document.createElement("strong");
    strong.textContent = value;
    const span = document.createElement("span");
    span.textContent = label;
    const em = document.createElement("em");
    em.textContent = detail;
    item.append(strong, span, em);
    return item;
  }

  private empty(text: string): HTMLElement {
    const empty = document.createElement("div");
    empty.className = "dashflow-weekly-empty";
    empty.textContent = text;
    return empty;
  }

  private shortDate(date: string): string {
    return date.slice(5).replace("-", "/");
  }

  private limit(value: unknown, fallback: number, max: number): number {
    const number = typeof value === "number" && Number.isFinite(value) ? Math.round(value) : fallback;
    return Math.max(1, Math.min(max, number));
  }

  private ensureStyles(): void {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = WEEKLY_STYLES;
    document.head.appendChild(style);
  }
}

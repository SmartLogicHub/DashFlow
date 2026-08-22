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
.dashflow-weekly-period{display:flex;flex-direction:column;gap:2px;min-width:0}.dashflow-weekly-period strong{font-size:14px}.dashflow-weekly-period span{font-size:11px;color:var(--text-muted);letter-spacing:.04em}
.dashflow-weekly-copy{min-height:32px;font-size:11px;padding:4px 10px;border-radius:7px;white-space:nowrap}
.dashflow-weekly-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}
.dashflow-weekly-kpi{border:1px solid var(--background-modifier-border);border-radius:9px;padding:9px 10px;background:color-mix(in srgb,var(--background-primary) 94%,var(--background-secondary));min-width:0;font-variant-numeric:tabular-nums}.dashflow-weekly-kpi strong{display:block;font-size:19px;line-height:1.05;letter-spacing:-.03em}.dashflow-weekly-kpi span{display:block;margin-top:4px;font-size:11px;color:var(--text-muted);letter-spacing:.03em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dashflow-weekly-kpi em{display:block;margin-top:2px;font-style:normal;font-size:11px;color:var(--text-muted)}
.dashflow-weekly-grid{display:grid;grid-template-columns:1.05fr 1fr 1fr;gap:10px;min-height:0;flex:1}
.dashflow-weekly-column{display:flex;flex-direction:column;gap:9px;min-width:0;min-height:0}
.dashflow-weekly-section{border-top:1px solid var(--background-modifier-border);padding-top:7px;min-width:0}.dashflow-weekly-section:first-child{border-top:0;padding-top:0}
.dashflow-weekly-section-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px}.dashflow-weekly-section-head strong{font-size:14px;letter-spacing:-.01em}.dashflow-weekly-section-head span{font-size:11px;color:var(--text-muted);font-variant-numeric:tabular-nums}
.dashflow-weekly-list{display:flex;flex-direction:column;gap:5px;min-width:0}
.dashflow-weekly-row{appearance:none;width:100%;min-height:36px;border:1px solid var(--background-modifier-border);border-radius:8px;background:var(--background-primary);padding:7px 8px;display:flex;align-items:center;gap:8px;color:var(--text-normal);text-align:left;cursor:pointer;min-width:0}.dashflow-weekly-row:hover{border-color:var(--text-muted)}
.dashflow-weekly-row-main{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}.dashflow-weekly-row-title{font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dashflow-weekly-row-meta{font-size:11px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-variant-numeric:tabular-nums}
.dashflow-weekly-badge{font-size:11px;border:1px solid var(--background-modifier-border);border-radius:5px;padding:2px 5px;color:var(--text-muted);white-space:nowrap;font-variant-numeric:tabular-nums}.dashflow-weekly-badge.is-overdue{color:var(--text-error);border-color:color-mix(in srgb,var(--text-error) 36%,var(--background-modifier-border))}.dashflow-weekly-badge.is-project{color:var(--text-warning)}.dashflow-weekly-badge.is-habit{color:var(--text-success)}.dashflow-weekly-badge.is-progress{color:var(--interactive-accent);border-color:color-mix(in srgb,var(--interactive-accent) 38%,var(--background-modifier-border))}
.dashflow-weekly-progress{width:46px;height:4px;border-radius:999px;background:var(--background-modifier-border);overflow:hidden;flex:none}.dashflow-weekly-progress span{display:block;height:100%;background:var(--interactive-accent);border-radius:inherit}
.dashflow-weekly-empty{font-size:12px;color:var(--text-muted);padding:8px 2px}
.dashflow-weekly-note{font-size:11px;color:var(--text-muted);margin-top:auto;padding-top:4px}
@media(max-width:1000px){.dashflow-weekly-grid{grid-template-columns:1fr 1fr}.dashflow-weekly-column:last-child{grid-column:1/-1}.dashflow-weekly-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:700px){.dashflow-weekly-grid{grid-template-columns:1fr}.dashflow-weekly-column:last-child{grid-column:auto}.dashflow-weekly-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}}
`;

export class WeeklyReviewWidgetInteractionService {
  private unsubscribeRender: (() => void) | null = null;
  private unsubscribeActivity: (() => void) | null = null;

  constructor(private readonly plugin: DashFlowPlugin) {}

  start(): void {
    this.ensureStyles();
    this.unsubscribeRender = this.plugin.dashboardRender.subscribe(({ root }) => this.decorate(root, false));
    this.unsubscribeActivity = this.plugin.activityService.subscribe(() => {
      this.plugin.dashboardRender.forEachRoot((root) => this.decorate(root, true));
    });
    this.plugin.dashboardRender.forEachRoot((root) => this.decorate(root, false));
  }

  stop(): void {
    this.unsubscribeRender?.();
    this.unsubscribeRender = null;
    this.unsubscribeActivity?.();
    this.unsubscribeActivity = null;
    document.getElementById(STYLE_ID)?.remove();
  }

  private decorate(root: HTMLElement, force: boolean): void {
    const dashboard = this.plugin.dashboardManager.active();
    const widgets = new Map(dashboard.widgets.map((widget) => [widget.id, widget]));

    for (const card of root.querySelectorAll<HTMLElement>(".dashflow-widget[data-widget-id]")) {
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
      : `活跃度自 ${this.plugin.activityService.getStore().startedAt} 开始记录`;
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
    subtitle.textContent = "本周 · 复盘与重置";
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
      this.kpi(String(review.activity.tasksCompleted), "已完成任务", `${review.activity.activeDays}/7 个活跃日`),
      this.kpi(`${review.habitRate}%`, "习惯完成率", `${review.habitCompleted}/${review.habitScheduled} 次`),
      this.kpi(`${review.dailyProgressRate}%`, "长期任务", `${review.dailyProgressCompleted}/${review.dailyProgressScheduled} · ${review.dailyProgressNoteCount} 篇记录`),
    );

    if (config.showActivityComparison !== false) {
      const change = review.activityChange;
      const value = change === null ? "NEW" : `${change >= 0 ? "+" : ""}${change}%`;
      wrap.append(this.kpi(value, "较上周活跃度", `${review.activity.score} 活跃分`));
    } else {
      wrap.append(this.kpi(String(review.activity.score), "活跃度", `${review.activity.notesTouched} 次笔记活动`));
    }
    return wrap;
  }

  private attentionSection(review: WeeklyReviewData, limit: number): HTMLElement {
    const section = this.section("需要处理", `${review.attentionTasks.length} 项未完成`);
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
    const section = this.section("项目状态", `${review.projects.length} 个进行中`);
    const list = this.list();
    const visible = review.projects.slice(0, limit);
    if (visible.length === 0) list.append(this.empty("没有活动项目。"));
    else for (const item of visible) list.append(this.projectRow(item));
    section.appendChild(list);
    return section;
  }

  private habitsSection(review: WeeklyReviewData): HTMLElement {
    const section = this.section("习惯", `${review.habitCompleted}/${review.habitScheduled}`);
    const list = this.list();
    const visible = review.habits.slice(0, 5);
    if (visible.length === 0) list.append(this.empty("本周没有需要执行的 Habit。"));
    else for (const item of visible) list.append(this.habitRow(item));
    section.appendChild(list);
    return section;
  }

  private dailyProgressSection(review: WeeklyReviewData): HTMLElement {
    const meta = `${review.dailyProgressCompleted}/${review.dailyProgressScheduled} · ${review.dailyProgressNoteCount} 篇记录`;
    const section = this.section("长期任务", meta);
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
      this.badge(overdue ? "已逾期" : task.due?.slice(5) ?? "截止", overdue ? "is-overdue" : ""),
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
      this.rowMain(item.project.name, item.project.deadline ? `截止 ${item.project.deadline}` : "暂无截止日期"),
      progress,
    );
    return row;
  }

  private habitRow(item: WeeklyReviewHabit): HTMLElement {
    const row = this.rowButton(() => new HabitEditorModal(this.plugin, item.habit).open());
    row.append(
      this.badge(`${item.stats.rate}%`, "is-habit"),
      this.rowMain(item.habit.name, `${item.stats.completed}/${item.stats.scheduled} 次完成`),
    );
    return row;
  }

  private dailyProgressRow(item: WeeklyReviewDailyProgress): HTMLElement {
    const row = this.rowButton(() => new HabitEditorModal(this.plugin, item.habit).open());
    const latest = item.notes[0];
    const meta = latest
      ? `${this.shortDate(latest.date)} · ${latest.note}`
      : `${item.stats.completed}/${item.stats.scheduled} 天 · 本周暂无记录`;
    row.append(
      this.badge(`${item.stats.rate}%`, "is-progress"),
      this.rowMain(item.habit.name, meta),
    );
    return row;
  }

  private eventRow(event: CalendarEvent): HTMLElement {
    const row = this.rowButton(() => this.openEvent(event));
    row.append(
      this.badge(event.kind === "project-deadline" ? "项目" : event.kind === "task-scheduled" ? "计划" : "截止", event.kind === "project-deadline" ? "is-project" : ""),
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

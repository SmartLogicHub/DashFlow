import type DashFlowPlugin from "../main";
import type { Habit, HabitsWidgetConfig, WidgetInstance } from "../models";
import {
  habitCompletedOn,
  habitCurrentStreak,
  habitHistory,
  habitScheduledOn,
  habitStats,
  habitTargetProgress,
} from "../habits/habitMath";
import { DailyProgressNoteModal } from "../ui/DailyProgressNoteModal";
import { HabitEditorModal } from "../ui/HabitEditorModal";
import { localDate } from "../utils/date";

const STYLE_ID = "dashflow-habit-styles";

const HABIT_STYLES = `
.dashflow-habits{height:100%;display:flex;flex-direction:column;gap:10px;min-width:0}
.dashflow-habits-kicker{display:flex;align-items:center;justify-content:space-between;gap:10px;color:var(--text-faint);font-size:9px;letter-spacing:.06em;text-transform:uppercase}
.dashflow-habits-kicker-actions{display:flex;align-items:center;gap:8px}
.dashflow-habits-add{width:22px;height:22px;display:grid;place-items:center;padding:0;border-radius:7px}
.dashflow-habit-list{display:flex;flex-direction:column;gap:8px;min-height:0;overflow:auto;padding-right:2px}
.dashflow-habit-row{border:1px solid var(--background-modifier-border);border-radius:10px;padding:9px 10px;display:flex;flex-direction:column;gap:7px;background:color-mix(in srgb,var(--background-primary) 92%,var(--background-secondary));min-width:0}
.dashflow-habit-row.is-paused{opacity:.62}
.dashflow-habit-row.is-daily-progress{border-color:color-mix(in srgb,var(--interactive-accent) 26%,var(--background-modifier-border));background:color-mix(in srgb,var(--interactive-accent) 4%,var(--background-primary))}
.dashflow-habit-row-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
.dashflow-habit-title-wrap{display:flex;align-items:center;gap:6px;min-width:0;flex-wrap:wrap}
.dashflow-habit-name{appearance:none;border:0;background:transparent;padding:0;color:var(--text-normal);font-weight:600;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer;max-width:100%}
.dashflow-habit-name:hover{color:var(--interactive-accent)}
.dashflow-habit-kind{font-size:8px;line-height:1;padding:3px 5px;border-radius:999px;color:var(--interactive-accent);background:color-mix(in srgb,var(--interactive-accent) 10%,transparent);white-space:nowrap}
.dashflow-habit-project{appearance:none;border:0;background:transparent;padding:0;color:var(--text-muted);font-size:9px;cursor:pointer;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dashflow-habit-project:hover{color:var(--interactive-accent)}
.dashflow-habit-streak{font-size:10px;color:var(--text-muted);white-space:nowrap;padding-top:1px}
.dashflow-habit-history{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(10px,1fr);gap:4px;align-items:center}
.dashflow-habit-day{appearance:none;border:0;padding:0;height:12px;border-radius:3px;background:var(--background-modifier-border);position:relative;min-width:0}
button.dashflow-habit-day{cursor:pointer}
button.dashflow-habit-day:hover{outline:1px solid color-mix(in srgb,var(--interactive-accent) 65%,transparent);outline-offset:1px}
.dashflow-habit-day.is-off{opacity:.3;background:var(--background-secondary)}
.dashflow-habit-day.is-done{background:var(--interactive-accent)}
.dashflow-habit-day.is-today{outline:1px solid var(--text-muted);outline-offset:2px}
.dashflow-habit-day.has-note::after{content:"";position:absolute;width:4px;height:4px;border-radius:50%;right:1px;top:1px;background:var(--text-on-accent,var(--text-normal));box-shadow:0 0 0 1px color-mix(in srgb,var(--background-primary) 55%,transparent)}
.dashflow-habit-meta{display:flex;align-items:center;justify-content:space-between;gap:7px;min-width:0}
.dashflow-habit-progress{display:flex;align-items:center;gap:8px;min-width:0;flex:1}
.dashflow-habit-progress-track{height:4px;flex:1;min-width:40px;border-radius:999px;background:var(--background-modifier-border);overflow:hidden}
.dashflow-habit-progress-track span{display:block;height:100%;border-radius:inherit;background:var(--interactive-accent)}
.dashflow-habit-progress-label{font-size:9px;color:var(--text-faint);white-space:nowrap}
.dashflow-habit-note,.dashflow-habit-check{font-size:10px;padding:4px 8px;border-radius:7px;white-space:nowrap}
.dashflow-habit-note.has-note{color:var(--interactive-accent);border-color:color-mix(in srgb,var(--interactive-accent) 35%,var(--background-modifier-border))}
.dashflow-habit-check.is-done{background:color-mix(in srgb,var(--interactive-accent) 18%,var(--background-primary));color:var(--text-normal)}
.dashflow-daily-progress-note-input{width:100%;min-height:120px;resize:vertical}
@media(max-width:900px){.dashflow-habit-row{padding:8px}.dashflow-habit-history{gap:3px}.dashflow-habit-day{height:11px}.dashflow-habit-meta{flex-wrap:wrap}.dashflow-habit-progress{flex-basis:100%}}
`;

export class HabitWidgetInteractionService {
  private observer: MutationObserver | null = null;
  private unsubscribeIndex: (() => void) | null = null;
  private scheduled = false;

  constructor(private readonly plugin: DashFlowPlugin) {}

  start(): void {
    this.ensureStyles();
    this.unsubscribeIndex = this.plugin.vaultIndex.subscribe(() => this.decorate(true));
    this.observer = new MutationObserver(() => this.schedule());
    this.observer.observe(document.body, { childList: true, subtree: true });
    this.schedule();
  }

  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.unsubscribeIndex?.();
    this.unsubscribeIndex = null;
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
      if (!widget || widget.type !== "habits") continue;
      const body = card.querySelector<HTMLElement>(".dashflow-widget-body");
      if (!body) continue;
      if (!force && body.dataset.dashflowHabits === widget.id) continue;
      this.renderHabits(body, widget);
    }
  }

  private renderHabits(body: HTMLElement, widget: WidgetInstance): void {
    const config = widget.config as HabitsWidgetConfig;
    const historyDays = Math.max(7, Math.min(30, Math.round(config.historyDays ?? 7)));
    const limit = Math.max(1, Math.min(20, Math.round(config.limit ?? 6)));
    const habits = this.plugin.habitService.active(config.includePaused === true).slice(0, limit);
    const today = localDate();
    const scheduled = habits.filter((habit) => habit.status === "active" && habitScheduledOn(habit, today));
    const doneToday = scheduled.filter((habit) => habitCompletedOn(habit, today)).length;
    const progressCount = habits.filter((habit) => habit.kind === "daily-progress").length;

    body.innerHTML = "";
    body.dataset.dashflowHabits = widget.id;

    const root = document.createElement("div");
    root.className = "dashflow-habits";

    const kicker = document.createElement("div");
    kicker.className = "dashflow-habits-kicker";
    const label = document.createElement("span");
    label.textContent = `TODAY · ${doneToday}/${scheduled.length} DONE`;
    const actions = document.createElement("div");
    actions.className = "dashflow-habits-kicker-actions";
    const count = document.createElement("span");
    count.textContent = progressCount > 0 ? `${habits.length} TRACKERS · ${progressCount} DAILY` : `${habits.length} HABITS`;
    const add = document.createElement("button");
    add.type = "button";
    add.className = "clickable-icon dashflow-habits-add";
    add.textContent = "+";
    add.title = "新建习惯 / 长期任务";
    add.setAttribute("aria-label", "新建习惯或长期任务");
    add.addEventListener("click", () => new HabitEditorModal(this.plugin).open());
    actions.append(count, add);
    kicker.append(label, actions);
    root.appendChild(kicker);

    if (habits.length === 0) {
      const empty = document.createElement("div");
      empty.className = "dashflow-empty";
      empty.textContent = "还没有长期节奏。点击右上角 ＋ 创建习惯或日更长期任务。";
      root.appendChild(empty);
      body.appendChild(root);
      return;
    }

    const list = document.createElement("div");
    list.className = "dashflow-habit-list";
    for (const habit of habits) list.appendChild(this.renderHabit(habit, historyDays, config));
    root.appendChild(list);
    body.appendChild(root);
  }

  private renderHabit(habit: Habit, historyDays: number, config: HabitsWidgetConfig): HTMLElement {
    const today = localDate();
    const isProgress = habit.kind === "daily-progress";
    const row = document.createElement("article");
    row.className = `dashflow-habit-row${habit.status === "paused" ? " is-paused" : ""}${isProgress ? " is-daily-progress" : ""}`;

    const head = document.createElement("div");
    head.className = "dashflow-habit-row-head";
    const titleWrap = document.createElement("div");
    titleWrap.className = "dashflow-habit-title-wrap";
    const name = document.createElement("button");
    name.type = "button";
    name.className = "dashflow-habit-name";
    name.textContent = habit.name;
    name.title = isProgress ? "编辑长期任务" : "编辑习惯";
    name.addEventListener("click", () => new HabitEditorModal(this.plugin, habit).open());
    titleWrap.appendChild(name);

    if (isProgress) {
      const kind = document.createElement("span");
      kind.className = "dashflow-habit-kind";
      kind.textContent = "日更";
      titleWrap.appendChild(kind);

      if (habit.linkedProjectId) {
        const project = this.plugin.vaultIndex.getSnapshot().projects.find((item) => item.id === habit.linkedProjectId);
        const projectButton = document.createElement("button");
        projectButton.type = "button";
        projectButton.className = "dashflow-habit-project";
        projectButton.textContent = `↗ ${project?.name ?? habit.linkedProjectId}`;
        projectButton.title = project ? `打开项目 · ${project.name}` : `关联项目 · ${habit.linkedProjectId}`;
        if (project) {
          projectButton.addEventListener("click", () => {
            void this.plugin.app.workspace.openLinkText(project.source.path, "", false);
          });
        } else {
          projectButton.disabled = true;
        }
        titleWrap.appendChild(projectButton);
      }
    }

    const streak = document.createElement("span");
    streak.className = "dashflow-habit-streak";
    const streakDays = habitCurrentStreak(habit, today);
    streak.textContent = isProgress ? `连续 ${streakDays} 天` : `🔥 ${streakDays}`;
    head.append(titleWrap, streak);

    const history = document.createElement("div");
    history.className = "dashflow-habit-history";
    for (const point of habitHistory(habit, historyDays, today)) {
      const interactive = isProgress && point.scheduled && point.date <= today && habit.status === "active";
      const cell = document.createElement(interactive ? "button" : "span");
      cell.className = "dashflow-habit-day";
      if (cell instanceof HTMLButtonElement) cell.type = "button";
      if (!point.scheduled) cell.classList.add("is-off");
      if (point.completed) cell.classList.add("is-done");
      if (point.date === today) cell.classList.add("is-today");
      const note = habit.dailyNotes?.[point.date];
      if (note) cell.classList.add("has-note");
      cell.title = `${point.date} · ${point.scheduled ? (point.completed ? "已完成" : "未完成") : "休息日"}${note ? ` · ${note}` : ""}`;
      if (interactive) {
        cell.setAttribute("aria-label", `${point.date} ${point.completed ? "取消完成" : "标记完成"}`);
        cell.addEventListener("click", async () => {
          (cell as HTMLButtonElement).disabled = true;
          await this.plugin.habitService.toggleDate(habit, point.date);
        });
      }
      history.appendChild(cell);
    }

    const meta = document.createElement("div");
    meta.className = "dashflow-habit-meta";
    const stats = habitStats(habit, 30, today);
    const progress = habitTargetProgress(habit, today);
    const progressWrap = document.createElement("div");
    progressWrap.className = "dashflow-habit-progress";

    if (config.showProgress !== false) {
      const track = document.createElement("div");
      track.className = "dashflow-habit-progress-track";
      const fill = document.createElement("span");
      fill.style.width = `${progress}%`;
      track.appendChild(fill);
      const progressLabel = document.createElement("span");
      progressLabel.className = "dashflow-habit-progress-label";
      progressLabel.textContent = habit.targetDays
        ? `${habit.completedDates.length}/${habit.targetDays} · ${progress}%`
        : `30D ${stats.rate}%`;
      progressWrap.append(track, progressLabel);
    } else {
      const frequency = document.createElement("span");
      frequency.className = "dashflow-habit-progress-label";
      frequency.textContent = isProgress ? "DAILY PROGRESS" : habit.frequency === "weekdays" ? "WEEKDAYS" : "DAILY";
      progressWrap.appendChild(frequency);
    }

    meta.appendChild(progressWrap);

    if (isProgress) {
      const note = document.createElement("button");
      note.type = "button";
      note.className = "dashflow-habit-note";
      const hasTodayNote = Boolean(habit.dailyNotes?.[today]);
      if (hasTodayNote) note.classList.add("has-note");
      note.textContent = hasTodayNote ? "📝 已记录" : "📝 备注";
      note.title = hasTodayNote ? habit.dailyNotes?.[today] ?? "编辑今日备注" : "写今日推进备注";
      note.addEventListener("click", () => new DailyProgressNoteModal(this.plugin, habit, today).open());
      meta.appendChild(note);
    }

    const check = document.createElement("button");
    check.type = "button";
    check.className = "dashflow-habit-check";
    const isScheduled = habitScheduledOn(habit, today);
    const isDone = habitCompletedOn(habit, today);
    if (habit.status === "paused") {
      check.textContent = "已暂停";
      check.disabled = true;
    } else if (!isScheduled) {
      check.textContent = "休息日";
      check.disabled = true;
    } else {
      check.textContent = isProgress
        ? (isDone ? "✓ 今日已推进" : "○ 今日推进")
        : (isDone ? "✓ 已打卡" : "○ 打卡");
      if (isDone) check.classList.add("is-done");
      check.addEventListener("click", async () => {
        check.disabled = true;
        await this.plugin.habitService.toggleDate(habit, today);
      });
    }

    meta.appendChild(check);
    row.append(head, history, meta);
    return row;
  }

  private ensureStyles(): void {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = HABIT_STYLES;
    document.head.appendChild(style);
  }
}

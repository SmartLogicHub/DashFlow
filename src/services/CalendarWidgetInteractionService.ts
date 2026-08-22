import type DashFlowPlugin from "../main";
import type { CalendarEvent, CalendarWidgetConfig, CalendarWeekStart, WidgetInstance } from "../models";
import { calendarMonthGrid, calendarWeekdayLabels, groupCalendarEvents, shiftCalendarMonth } from "../calendar/calendarMath";
import { HabitEditorModal } from "../ui/HabitEditorModal";
import { TaskEditorModal } from "../ui/TaskEditorModal";
import { localDate } from "../utils/date";

const STYLE_ID = "dashflow-calendar-styles";

const CALENDAR_STYLES = `
.dashflow-calendar{height:100%;display:grid;grid-template-columns:minmax(0,1.55fr) minmax(220px,.85fr);gap:14px;min-width:0}
.dashflow-calendar-main,.dashflow-calendar-agenda{min-width:0;display:flex;flex-direction:column;gap:8px}
.dashflow-calendar-toolbar{display:flex;align-items:center;justify-content:space-between;gap:8px}
.dashflow-calendar-nav{display:flex;align-items:center;gap:5px}
.dashflow-calendar-nav button,.dashflow-calendar-today,.dashflow-calendar-add{min-height:32px;font-size:12px;border-radius:7px;padding:5px 9px}
.dashflow-calendar-month{font-size:14px;font-weight:650;letter-spacing:.01em;min-width:92px;text-align:center}
.dashflow-calendar-weekdays,.dashflow-calendar-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px}
.dashflow-calendar-weekday{text-align:center;font-size:11px;color:var(--text-muted);padding:2px 0}
.dashflow-calendar-day{appearance:none;width:100%;min-height:var(--df-control-touch);box-sizing:border-box;border:1px solid var(--background-modifier-border);border-radius:8px;background:var(--background-primary);padding:5px;display:flex;flex-direction:column;align-items:flex-start;justify-content:space-between;gap:4px;color:var(--text-normal);cursor:pointer;overflow:hidden}
.dashflow-calendar-day:hover{border-color:var(--text-muted)}
.dashflow-calendar-day.is-outside{opacity:.38;background:var(--background-secondary)}
.dashflow-calendar-day.is-selected{border-color:var(--interactive-accent);box-shadow:inset 0 0 0 1px var(--interactive-accent)}
.dashflow-calendar-day.is-today .dashflow-calendar-day-number{background:var(--interactive-accent);color:var(--text-on-accent);border-radius:999px;min-width:18px;height:18px;display:grid;place-items:center;margin:-2px}
.dashflow-calendar-day-number{font-size:12px;line-height:18px;font-variant-numeric:tabular-nums}
.dashflow-calendar-dots{display:flex;gap:3px;align-items:center;min-height:5px;max-width:100%}
.dashflow-calendar-dot{width:5px;height:5px;border-radius:999px;background:var(--text-faint);flex:none}
.dashflow-calendar-dot.is-task-due{background:var(--interactive-accent)}
.dashflow-calendar-dot.is-task-scheduled{background:var(--text-accent)}
.dashflow-calendar-dot.is-project-deadline{background:var(--text-warning)}
.dashflow-calendar-dot.is-habit{background:var(--text-success)}
.dashflow-calendar-more{font-size:11px;color:var(--text-muted);white-space:nowrap}
.dashflow-calendar-agenda{border-left:1px solid var(--background-modifier-border);padding-left:12px;min-height:0}
.dashflow-calendar-agenda-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.dashflow-calendar-agenda-date{display:flex;flex-direction:column;gap:2px}.dashflow-calendar-agenda-date strong{font-size:14px}.dashflow-calendar-agenda-date span{font-size:11px;color:var(--text-muted);font-variant-numeric:tabular-nums}
.dashflow-calendar-agenda-list{display:flex;flex-direction:column;gap:6px;overflow:auto;min-height:0;padding-right:2px}
.dashflow-calendar-event{display:flex;align-items:center;gap:7px;border:1px solid var(--background-modifier-border);border-radius:8px;padding:7px;background:color-mix(in srgb,var(--background-primary) 94%,var(--background-secondary));min-width:0}
.dashflow-calendar-event-main{appearance:none;min-height:32px;border:0;background:transparent;padding:0;display:flex;align-items:center;gap:7px;flex:1;min-width:0;text-align:left;color:var(--text-normal);cursor:pointer}
.dashflow-calendar-event-main:hover .dashflow-calendar-event-title{color:var(--interactive-accent)}
.dashflow-calendar-event-kind{font-size:11px;color:var(--text-muted);border:1px solid var(--background-modifier-border);border-radius:5px;padding:2px 5px;white-space:nowrap}
.dashflow-calendar-event-title{font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dashflow-calendar-event.is-completed .dashflow-calendar-event-title{text-decoration:line-through;color:var(--text-muted)}
.dashflow-calendar-event-check{min-height:32px;font-size:11px;padding:4px 7px;border-radius:6px;white-space:nowrap}
@media(max-width:900px){.dashflow-calendar{grid-template-columns:1fr}.dashflow-calendar-agenda{border-left:0;border-top:1px solid var(--background-modifier-border);padding-left:0;padding-top:10px}.dashflow-calendar-day{padding:4px}}
`;

export class CalendarWidgetInteractionService {
  private unsubscribeRender: (() => void) | null = null;
  private readonly monthByWidget = new Map<string, string>();
  private readonly selectedByWidget = new Map<string, string>();

  constructor(private readonly plugin: DashFlowPlugin) {}

  start(): void {
    this.ensureStyles();
    this.unsubscribeRender = this.plugin.dashboardRender.subscribe(({ root }) => this.decorate(root));
    this.plugin.dashboardRender.forEachRoot((root) => this.decorate(root));
  }

  stop(): void {
    this.unsubscribeRender?.();
    this.unsubscribeRender = null;
    this.monthByWidget.clear();
    this.selectedByWidget.clear();
    document.getElementById(STYLE_ID)?.remove();
  }

  private decorate(root: HTMLElement): void {
    const dashboard = this.plugin.dashboardManager.active();
    const widgets = new Map(dashboard.widgets.map((widget) => [widget.id, widget]));
    for (const id of [...this.monthByWidget.keys()]) {
      if (!widgets.has(id)) this.monthByWidget.delete(id);
    }
    for (const id of [...this.selectedByWidget.keys()]) {
      if (!widgets.has(id)) this.selectedByWidget.delete(id);
    }

    for (const card of root.querySelectorAll<HTMLElement>(".dashflow-widget[data-widget-id]")) {
      const widgetId = card.dataset.widgetId;
      const widget = widgetId ? widgets.get(widgetId) : undefined;
      if (!widget || widget.type !== "calendar") continue;
      const body = card.querySelector<HTMLElement>(".dashflow-widget-body");
      if (!body) continue;
      this.renderCalendar(body, widget);
    }
  }

  private renderCalendar(body: HTMLElement, widget: WidgetInstance): void {
    const config = widget.config as CalendarWidgetConfig;
    const today = localDate();
    const weekStart = this.weekStart(config.weekStart);
    const selected = this.selectedByWidget.get(widget.id) ?? today;
    const month = this.monthByWidget.get(widget.id) ?? selected.slice(0, 7);
    const cells = calendarMonthGrid(month, weekStart, today);
    const events = this.plugin.calendarService.eventsBetween(cells[0]!.date, cells[cells.length - 1]!.date, config);
    const grouped = groupCalendarEvents(events);

    body.innerHTML = "";
    body.dataset.dashflowCalendar = widget.id;

    const root = document.createElement("div");
    root.className = "dashflow-calendar";
    const main = document.createElement("div");
    main.className = "dashflow-calendar-main";
    main.append(this.renderToolbar(body, widget, month, today));

    const weekdays = document.createElement("div");
    weekdays.className = "dashflow-calendar-weekdays";
    for (const label of calendarWeekdayLabels(weekStart)) {
      const el = document.createElement("span");
      el.className = "dashflow-calendar-weekday";
      el.textContent = label;
      weekdays.appendChild(el);
    }
    main.appendChild(weekdays);

    const grid = document.createElement("div");
    grid.className = "dashflow-calendar-grid";
    for (const cell of cells) {
      const dayEvents = grouped.get(cell.date) ?? [];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "dashflow-calendar-day";
      if (!cell.inMonth) button.classList.add("is-outside");
      if (cell.today) button.classList.add("is-today");
      if (cell.date === selected) button.classList.add("is-selected");
      button.title = `${cell.date}${dayEvents.length ? ` · ${dayEvents.length} 项` : ""}`;

      const number = document.createElement("span");
      number.className = "dashflow-calendar-day-number";
      number.textContent = String(cell.day);
      const dots = document.createElement("span");
      dots.className = "dashflow-calendar-dots";
      for (const event of dayEvents.slice(0, 3)) {
        const dot = document.createElement("span");
        dot.className = `dashflow-calendar-dot is-${event.kind}`;
        dots.appendChild(dot);
      }
      if (dayEvents.length > 3) {
        const more = document.createElement("span");
        more.className = "dashflow-calendar-more";
        more.textContent = `+${dayEvents.length - 3}`;
        dots.appendChild(more);
      }
      button.append(number, dots);
      button.addEventListener("click", () => {
        this.selectedByWidget.set(widget.id, cell.date);
        if (!cell.inMonth) this.monthByWidget.set(widget.id, cell.date.slice(0, 7));
        this.renderCalendar(body, widget);
      });
      grid.appendChild(button);
    }
    main.appendChild(grid);

    const agenda = this.renderAgenda(body, widget, selected, grouped.get(selected) ?? [], config);
    root.append(main, agenda);
    body.appendChild(root);
  }

  private renderToolbar(body: HTMLElement, widget: WidgetInstance, month: string, today: string): HTMLElement {
    const toolbar = document.createElement("div");
    toolbar.className = "dashflow-calendar-toolbar";
    const nav = document.createElement("div");
    nav.className = "dashflow-calendar-nav";
    const prev = this.button("‹", "上个月");
    const next = this.button("›", "下个月");
    const label = document.createElement("strong");
    label.className = "dashflow-calendar-month";
    label.textContent = new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long" }).format(new Date(`${month}-01T12:00:00`));
    prev.addEventListener("click", () => this.navigateMonth(body, widget, shiftCalendarMonth(month, -1)));
    next.addEventListener("click", () => this.navigateMonth(body, widget, shiftCalendarMonth(month, 1)));
    nav.append(prev, label, next);

    const todayButton = this.button("今天", "回到今天");
    todayButton.classList.add("dashflow-calendar-today");
    todayButton.addEventListener("click", () => {
      this.selectedByWidget.set(widget.id, today);
      this.monthByWidget.set(widget.id, today.slice(0, 7));
      this.renderCalendar(body, widget);
    });
    toolbar.append(nav, todayButton);
    return toolbar;
  }

  private renderAgenda(
    body: HTMLElement,
    widget: WidgetInstance,
    selected: string,
    events: CalendarEvent[],
    config: CalendarWidgetConfig,
  ): HTMLElement {
    const agenda = document.createElement("aside");
    agenda.className = "dashflow-calendar-agenda";
    const head = document.createElement("div");
    head.className = "dashflow-calendar-agenda-head";
    const date = document.createElement("div");
    date.className = "dashflow-calendar-agenda-date";
    const strong = document.createElement("strong");
    strong.textContent = new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "short" }).format(new Date(`${selected}T12:00:00`));
    const count = document.createElement("span");
    count.textContent = `${events.length} 项`;
    date.append(strong, count);
    const add = this.button("＋任务", "在这一天新建任务");
    add.classList.add("dashflow-calendar-add");
    add.addEventListener("click", () => new TaskEditorModal(this.plugin, undefined, { due: selected }).open());
    head.append(date, add);
    agenda.appendChild(head);

    const list = document.createElement("div");
    list.className = "dashflow-calendar-agenda-list";
    const limit = Math.max(1, Math.min(50, Math.round(config.agendaLimit ?? 12)));
    const visible = events.slice(0, limit);
    if (visible.length === 0) {
      const empty = document.createElement("div");
      empty.className = "dashflow-empty";
      empty.textContent = "这一天没有安排。";
      list.appendChild(empty);
    } else {
      for (const event of visible) list.appendChild(this.renderEvent(body, widget, event));
      if (events.length > visible.length) {
        const more = document.createElement("div");
        more.className = "dashflow-empty";
        more.textContent = `还有 ${events.length - visible.length} 项未显示`;
        list.appendChild(more);
      }
    }
    agenda.appendChild(list);
    return agenda;
  }

  private renderEvent(body: HTMLElement, widget: WidgetInstance, event: CalendarEvent): HTMLElement {
    const row = document.createElement("div");
    row.className = `dashflow-calendar-event${event.completed ? " is-completed" : ""}`;
    const main = document.createElement("button");
    main.type = "button";
    main.className = "dashflow-calendar-event-main";
    const kind = document.createElement("span");
    kind.className = "dashflow-calendar-event-kind";
    kind.textContent = this.kindLabel(event.kind);
    const title = document.createElement("span");
    title.className = "dashflow-calendar-event-title";
    title.textContent = event.title;
    main.append(kind, title);
    main.addEventListener("click", () => this.openEvent(event));
    row.appendChild(main);

    if (event.kind === "habit") {
      const habit = this.plugin.vaultIndex.getSnapshot().habits.find((item) => item.id === event.entityId);
      if (habit) {
        const check = this.button(event.completed ? "✓" : "○", event.completed ? "取消打卡" : "打卡");
        check.classList.add("dashflow-calendar-event-check");
        if (event.date > localDate()) {
          check.disabled = true;
          check.title = "未来日期不能提前打卡";
        } else {
          check.addEventListener("click", async () => {
            check.disabled = true;
            await this.plugin.habitService.toggleDate(habit, event.date);
            this.renderCalendar(body, widget);
          });
        }
        row.appendChild(check);
      }
    }
    return row;
  }

  private openEvent(event: CalendarEvent): void {
    const snapshot = this.plugin.vaultIndex.getSnapshot();
    if (event.kind === "task-due" || event.kind === "task-scheduled") {
      const task = snapshot.tasks.find((item) => item.id === event.entityId);
      if (task) new TaskEditorModal(this.plugin, task).open();
      return;
    }
    if (event.kind === "habit") {
      const habit = snapshot.habits.find((item) => item.id === event.entityId);
      if (habit) new HabitEditorModal(this.plugin, habit).open();
      return;
    }
    void this.plugin.app.workspace.openLinkText(event.source.path, "", false);
  }

  private navigateMonth(body: HTMLElement, widget: WidgetInstance, month: string): void {
    const selected = `${month}-01`;
    this.monthByWidget.set(widget.id, month);
    this.selectedByWidget.set(widget.id, selected);
    this.renderCalendar(body, widget);
  }

  private weekStart(value: unknown): CalendarWeekStart {
    return value === "sunday" ? "sunday" : "monday";
  }

  private kindLabel(kind: CalendarEvent["kind"]): string {
    if (kind === "task-due") return "截止";
    if (kind === "task-scheduled") return "计划";
    if (kind === "project-deadline") return "项目";
    return "习惯";
  }

  private button(text: string, title: string): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    button.title = title;
    return button;
  }

  private ensureStyles(): void {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CALENDAR_STYLES;
    document.head.appendChild(style);
  }
}

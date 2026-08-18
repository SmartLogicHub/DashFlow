import type DashFlowPlugin from "../main";
import type { Task, TasksWidgetConfig, UpcomingWidgetConfig, WidgetInstance } from "../models";
import { TaskEditorModal } from "../ui/TaskEditorModal";

export class TaskInteractionService {
  private unsubscribeRender: (() => void) | null = null;

  constructor(private readonly plugin: DashFlowPlugin) {}

  start(): void {
    this.unsubscribeRender = this.plugin.dashboardRender.subscribe(({ root }) => this.decorate(root));
    this.plugin.dashboardRender.forEachRoot((root) => this.decorate(root));
  }

  stop(): void {
    this.unsubscribeRender?.();
    this.unsubscribeRender = null;
  }

  private decorate(root: HTMLElement): void {
    const dashboard = this.plugin.dashboardManager.active();
    const widgets = new Map(dashboard.widgets.map((widget) => [widget.id, widget]));

    for (const card of root.querySelectorAll<HTMLElement>(".dashflow-widget[data-widget-id]")) {
      const widgetId = card.dataset.widgetId;
      const widget = widgetId ? widgets.get(widgetId) : undefined;
      if (!widget || (widget.type !== "tasks" && widget.type !== "upcoming")) continue;

      const tasks = this.tasksFor(widget);
      const taskById = new Map(tasks.map((task) => [task.id, task]));
      const rows = Array.from(card.querySelectorAll<HTMLElement>(".dashflow-task"));
      for (const row of rows) {
        const taskId = row.dataset.taskId;
        const task = taskId ? taskById.get(taskId) : undefined;
        const text = row.querySelector<HTMLElement>("span");
        if (!task || !text || text.dataset.dashflowTaskEditor === task.id) continue;

        text.dataset.dashflowTaskEditor = task.id;
        text.setAttribute("role", "button");
        text.setAttribute("tabindex", "0");
        text.setAttribute("title", "点击编辑任务");
        text.style.cursor = "pointer";

        text.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          new TaskEditorModal(this.plugin, task).open();
        });
        text.addEventListener("keydown", (event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          event.stopPropagation();
          new TaskEditorModal(this.plugin, task).open();
        });
      }

      if (widget.type === "tasks") this.decorateCreateTask(card);
    }
  }

  private tasksFor(widget: WidgetInstance): Task[] {
    if (widget.type === "upcoming") {
      const config = widget.config as UpcomingWidgetConfig;
      return this.plugin.taskService
        .upcoming(config.days ?? 7)
        .slice(0, config.limit ?? 12);
    }

    const config = widget.config as TasksWidgetConfig;
    const today = this.plugin.taskService.today();
    const overdue = config.includeOverdue ? this.plugin.taskService.overdue() : [];
    const overdueIds = new Set(overdue.map((task) => task.id));
    return [
      ...overdue,
      ...today.filter((task) => !overdueIds.has(task.id)),
    ].slice(0, config.limit ?? 10);
  }

  private decorateCreateTask(card: HTMLElement): void {
    const kicker = card.querySelector<HTMLElement>(".dashflow-widget-kicker");
    if (!kicker || kicker.querySelector("[data-dashflow-create-task]")) return;

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.alignItems = "center";
    actions.style.gap = "6px";

    const status = kicker.querySelector("span");
    if (status) actions.appendChild(status);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "clickable-icon";
    button.dataset.dashflowCreateTask = "true";
    button.setAttribute("aria-label", "新建任务");
    button.setAttribute("title", "新建任务");
    button.textContent = "+";
    button.style.width = "20px";
    button.style.height = "20px";
    button.addEventListener("click", () => {
      new TaskEditorModal(this.plugin).open();
    });

    actions.appendChild(button);
    kicker.appendChild(actions);
  }
}

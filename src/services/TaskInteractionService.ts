import type DashFlowPlugin from "../main";
import type { Task, TasksWidgetConfig, UpcomingWidgetConfig, WidgetInstance } from "../models";
import { TaskEditorModal } from "../ui/TaskEditorModal";

export class TaskInteractionService {
  private observer: MutationObserver | null = null;
  private scheduled = false;

  constructor(private readonly plugin: DashFlowPlugin) {}

  start(): void {
    if (this.observer) return;
    this.observer = new MutationObserver(() => this.schedule());
    this.observer.observe(document.body, { childList: true, subtree: true });
    this.schedule();
  }

  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
  }

  private schedule(): void {
    if (this.scheduled) return;
    this.scheduled = true;
    window.setTimeout(() => {
      this.scheduled = false;
      this.decorate();
    }, 0);
  }

  private decorate(): void {
    const dashboard = this.plugin.dashboardManager.active();
    const widgets = new Map(dashboard.widgets.map((widget) => [widget.id, widget]));

    for (const card of document.querySelectorAll<HTMLElement>(".dashflow-widget[data-widget-id]")) {
      const widgetId = card.dataset.widgetId;
      const widget = widgetId ? widgets.get(widgetId) : undefined;
      if (!widget || (widget.type !== "tasks" && widget.type !== "upcoming")) continue;

      const tasks = this.tasksFor(widget);
      const rows = Array.from(card.querySelectorAll<HTMLElement>(".dashflow-task"));
      rows.forEach((row, index) => {
        const task = tasks[index];
        const text = row.querySelector<HTMLElement>("span");
        if (!task || !text || text.dataset.dashflowTaskEditor === task.id) return;

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
      });

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
    const snapshot = this.plugin.vaultIndex.getSnapshot();
    const today = this.plugin.taskService.today(snapshot.tasks);
    const overdue = config.includeOverdue
      ? this.plugin.taskService.overdue(snapshot.tasks)
      : [];
    return [
      ...overdue,
      ...today.filter((task) => !overdue.some((item) => item.id === task.id)),
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

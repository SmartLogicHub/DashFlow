import type DashFlowPlugin from "../main";

export class AuroraInteractionService {
  private observer: MutationObserver | null = null;
  private scheduled = false;

  constructor(private readonly plugin: DashFlowPlugin) {}

  start(): void {
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
    const widgetTypes = new Map(dashboard.widgets.map((widget) => [widget.id, widget.type]));

    for (const shell of document.querySelectorAll<HTMLElement>(".dashflow-shell")) {
      const hero = shell.querySelector<HTMLElement>(".dashflow-hero");
      if (hero) this.decorateHero(hero);

      for (const card of shell.querySelectorAll<HTMLElement>(".dashflow-widget[data-widget-id]")) {
        const id = card.dataset.widgetId;
        if (!id) continue;
        const type = widgetTypes.get(id);
        if (type) card.dataset.widgetType = type;
      }

      const pulse = shell.querySelector<HTMLElement>(".dashflow-pulse");
      if (pulse) this.decoratePulse(pulse);
    }
  }

  private decorateHero(hero: HTMLElement): void {
    const copy = hero.firstElementChild;
    if (!(copy instanceof HTMLElement)) return;
    copy.classList.add("dashflow-hero-copy");

    if (!copy.querySelector(".dashflow-hero-meta")) {
      const snapshot = this.plugin.vaultIndex.getSnapshot();
      const todayTasks = this.plugin.taskService.today(snapshot.tasks).filter((task) => !task.completed).length;
      const activeProjects = snapshot.projects.filter((project) => project.status === "active").length;
      const meta = document.createElement("div");
      meta.className = "dashflow-hero-meta";
      const date = document.createElement("span");
      date.textContent = new Intl.DateTimeFormat("zh-CN", {
        month: "long",
        day: "numeric",
        weekday: "short",
      }).format(new Date());
      const tasks = document.createElement("span");
      tasks.textContent = `${todayTasks} 今日待办`;
      const projects = document.createElement("span");
      projects.textContent = `${activeProjects} 活动项目`;
      meta.append(date, tasks, projects);
      copy.appendChild(meta);
    }

    const button = hero.querySelector<HTMLElement>(":scope > .dashflow-edit-button");
    if (button && !button.parentElement?.classList.contains("dashflow-hero-actions")) {
      const actions = document.createElement("div");
      actions.className = "dashflow-hero-actions";
      hero.insertBefore(actions, button);
      actions.appendChild(button);
    }
  }

  private decoratePulse(pulse: HTMLElement): void {
    for (const span of pulse.querySelectorAll<HTMLElement>(":scope > span")) {
      const text = span.textContent?.trim().toLowerCase() ?? "";
      if (text.includes("overdue")) span.dataset.metric = "overdue";
      else if (text.includes("pending")) span.dataset.metric = "pending";
      else if (text.includes("projects")) span.dataset.metric = "projects";
      else if (text.includes("notes")) span.dataset.metric = "notes";
    }
  }
}

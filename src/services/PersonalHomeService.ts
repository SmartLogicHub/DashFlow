import { setIcon } from "obsidian";
import { activityRange, activityStreak } from "../activity/activityMath";
import { habitCompletedOn, habitScheduledOn } from "../habits/habitMath";
import type DashFlowPlugin from "../main";
import type { ProductSection } from "../product/navigation";
import { localDate } from "../utils/date";
import { ProjectDetailModal } from "../ui/ProjectDetailModal";
import { TaskEditorModal } from "../ui/TaskEditorModal";

interface AreaDefinition {
  number: string;
  title: string;
  description: string;
  icon: string;
  section: ProductSection;
  action: string;
}

const AREAS: AreaDefinition[] = [
  { number: "01", title: "我的工作", description: "项目、任务与收集箱协同推进。", icon: "briefcase-business", section: "work", action: "进入工作台" },
  { number: "02", title: "我的生活", description: "让习惯和长期节奏留下真实记录。", icon: "sprout", section: "habits", action: "查看习惯" },
  { number: "03", title: "时间规划", description: "把计划、截止与重要节点放回时间轴。", icon: "calendar-days", section: "calendar", action: "打开日历" },
  { number: "04", title: "回顾成长", description: "从完成、阻塞和 Activity 中形成下一步。", icon: "chart-no-axes-combined", section: "review", action: "开始复盘" },
];

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
    const scheduledHabits = snapshot.habits.filter((habit) => habit.status === "active" && habitScheduledOn(habit, today));
    const completedHabits = scheduledHabits.filter((habit) => habitCompletedOn(habit, today));
    const activeProjects = this.plugin.projectService.active();

    const top = document.createElement("div");
    top.className = "dashflow-home-top-grid";
    top.append(
      this.renderFocus(focus),
      this.renderTodayStatus(todayTasks.length, todayTasks.filter((task) => task.completed).length, completedHabits.length, scheduledHabits.length, activeProjects.length),
    );

    const areaSection = document.createElement("section");
    areaSection.className = "dashflow-home-section";
    const areaHead = document.createElement("div");
    areaHead.className = "dashflow-home-section-head";
    areaHead.append(this.text("h2", "长期成长的四个领域"), this.text("span", "工作 · 生活 · 时间 · 复盘"));
    const areaGrid = document.createElement("div");
    areaGrid.className = "dashflow-home-area-grid";
    for (const area of AREAS) areaGrid.appendChild(this.renderArea(area));
    areaSection.append(areaHead, areaGrid);

    const lower = document.createElement("div");
    lower.className = "dashflow-home-lower-grid";
    lower.append(this.renderActivity(), this.renderRecentNotes());

    page.append(top, areaSection, lower);
    return page;
  }

  private renderFocus(tasks: ReturnType<DashFlowPlugin["taskService"]["focus"]>): HTMLElement {
    const card = document.createElement("section");
    card.className = "dashflow-home-card dashflow-home-focus";
    const head = document.createElement("div");
    head.className = "dashflow-home-card-head";
    head.append(this.text("strong", "今日待办"), this.text("span", `${tasks.length} FOCUS`));
    card.appendChild(head);

    const list = document.createElement("div");
    list.className = "dashflow-home-focus-list";
    if (tasks.length === 0) {
      const empty = document.createElement("div");
      empty.className = "dashflow-home-empty";
      const icon = document.createElement("span");
      setIcon(icon, "sun-medium");
      empty.append(icon, this.text("strong", "今天没有硬截止"), this.text("p", "可以挑一个长期项目，主动推进下一步。"));
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
        const body = document.createElement("button");
        body.type = "button";
        const meta = [
          task.projectId ? `#${task.projectId}` : "",
          task.scheduled ? `计划 ${task.scheduled}` : "",
          task.due ? `截止 ${task.due}` : "",
        ].filter(Boolean).join(" · ");
        body.append(this.text("strong", task.text), this.text("small", meta || "未关联项目"));
        body.addEventListener("click", () => new TaskEditorModal(this.plugin, task).open());
        row.append(checkbox, body);
        list.appendChild(row);
      }
    }
    card.appendChild(list);
    return card;
  }

  private renderTodayStatus(totalTasks: number, completedTasks: number, habitsDone: number, habitsTotal: number, projects: number): HTMLElement {
    const card = document.createElement("section");
    card.className = "dashflow-home-card dashflow-home-status";
    const head = document.createElement("div");
    head.className = "dashflow-home-card-head";
    head.append(this.text("strong", "今日状态"), this.text("span", "LIVE"));
    card.appendChild(head);

    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    const ringWrap = document.createElement("div");
    ringWrap.className = "dashflow-home-status-ring-wrap";
    const ring = document.createElement("div");
    ring.className = "dashflow-home-status-ring";
    ring.style.setProperty("--df-home-progress", `${progress * 3.6}deg`);
    ring.append(this.text("strong", `${progress}%`), this.text("span", "TODAY"));
    ringWrap.append(ring, this.text("p", totalTasks === 0 ? "今天还没有安排任务" : `${completedTasks} / ${totalTasks} 项已完成`));

    const metrics = document.createElement("div");
    metrics.className = "dashflow-home-status-metrics";
    metrics.append(
      this.metric("习惯", `${habitsDone}/${habitsTotal}`),
      this.metric("项目", String(projects)),
      this.metric("连续活跃", `${activityStreak(this.plugin.data.activity)} 天`),
    );
    card.append(ringWrap, metrics);
    return card;
  }

  private renderArea(area: AreaDefinition): HTMLElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "dashflow-home-area";
    const number = this.text("span", area.number);
    number.className = "dashflow-home-area-number";
    const icon = document.createElement("span");
    icon.className = "dashflow-home-area-icon";
    setIcon(icon, area.icon);
    const title = this.text("strong", area.title);
    const description = this.text("p", area.description);
    const action = this.text("span", `${area.action} ↗`);
    action.className = "dashflow-home-area-action";
    button.append(number, icon, title, description, action);
    button.addEventListener("click", () => this.openSection(area.section));
    return button;
  }

  private renderActivity(): HTMLElement {
    const card = document.createElement("section");
    card.className = "dashflow-home-card dashflow-home-activity";
    const head = document.createElement("div");
    head.className = "dashflow-home-card-head";
    head.append(this.text("strong", "知识库活动热力图"), this.text("span", "最近 30 天"));
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
    const meta = this.text("p", `从 ${this.plugin.data.activity.startedAt} 开始记录 · 连续活跃 ${activityStreak(this.plugin.data.activity)} 天`);
    card.append(strip, meta);
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
    el.append(this.text("strong", value), this.text("span", label));
    return el;
  }

  private text<K extends keyof HTMLElementTagNameMap>(tag: K, value: string): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag);
    element.textContent = value;
    return element;
  }
}

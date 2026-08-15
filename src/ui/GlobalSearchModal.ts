import { SuggestModal, setIcon } from "obsidian";
import type DashFlowPlugin from "../main";
import type { Habit, Project, Task } from "../models";
import { HabitEditorModal } from "./HabitEditorModal";
import { ProjectDetailModal } from "./ProjectDetailModal";
import { ProjectEditorModal } from "./ProjectEditorModal";
import { TaskEditorModal } from "./TaskEditorModal";

type SearchItem =
  | { kind: "action"; id: "new-task" | "new-project" | "new-habit"; title: string; meta: string; icon: string }
  | { kind: "task"; task: Task }
  | { kind: "project"; project: Project }
  | { kind: "habit"; habit: Habit };

const ACTIONS: SearchItem[] = [
  { kind: "action", id: "new-task", title: "新建任务", meta: "创建一个可执行行动", icon: "plus-circle" },
  { kind: "action", id: "new-project", title: "新建项目", meta: "创建一个长期目标", icon: "folder-plus" },
  { kind: "action", id: "new-habit", title: "新建习惯", meta: "创建一个长期节奏", icon: "repeat-2" },
];

function matches(text: string, query: string): boolean {
  if (!query) return true;
  const haystack = text.toLocaleLowerCase();
  const needles = query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return needles.every((needle) => haystack.includes(needle));
}

export class GlobalSearchModal extends SuggestModal<SearchItem> {
  constructor(private readonly plugin: DashFlowPlugin) {
    super(plugin.app);
    this.setPlaceholder("搜索任务、项目、习惯，或直接创建…");
    this.setInstructions([
      { command: "↵", purpose: "打开" },
      { command: "↑↓", purpose: "选择" },
      { command: "esc", purpose: "关闭" },
    ]);
  }

  getSuggestions(query: string): SearchItem[] {
    const snapshot = this.plugin.vaultIndex.getSnapshot();
    const results: SearchItem[] = [];

    for (const action of ACTIONS) {
      if (action.kind === "action" && matches(`${action.title} ${action.meta}`, query)) results.push(action);
    }

    const tasks = snapshot.tasks
      .filter((task) => !task.completed && matches(`${task.text} ${task.projectId ?? ""} ${task.tags.join(" ")}`, query))
      .sort((a, b) => (a.scheduled ?? a.due ?? "9999").localeCompare(b.scheduled ?? b.due ?? "9999"))
      .slice(0, query ? 18 : 7);
    results.push(...tasks.map((task): SearchItem => ({ kind: "task", task })));

    const projects = snapshot.projects
      .filter((project) => project.status !== "archived" && matches(`${project.name} ${project.description ?? ""} ${project.tags.join(" ")}`, query))
      .slice(0, query ? 10 : 5);
    results.push(...projects.map((project): SearchItem => ({ kind: "project", project })));

    const habits = snapshot.habits
      .filter((habit) => habit.status !== "archived" && matches(`${habit.name} ${habit.description ?? ""} ${habit.tags.join(" ")}`, query))
      .slice(0, query ? 10 : 5);
    results.push(...habits.map((habit): SearchItem => ({ kind: "habit", habit })));

    return results.slice(0, 30);
  }

  renderSuggestion(item: SearchItem, el: HTMLElement): void {
    el.addClass("dashflow-search-item");
    const icon = el.createDiv("dashflow-search-item-icon");
    const copy = el.createDiv("dashflow-search-item-copy");
    const title = copy.createEl("strong");
    const meta = copy.createEl("span");

    if (item.kind === "action") {
      setIcon(icon, item.icon);
      title.setText(item.title);
      meta.setText(item.meta);
      return;
    }
    if (item.kind === "task") {
      setIcon(icon, "circle-check-big");
      title.setText(item.task.text);
      meta.setText([
        "任务",
        item.task.projectId ? `项目 ${item.task.projectId}` : "",
        item.task.scheduled ? `计划 ${item.task.scheduled}` : "",
        item.task.due ? `截止 ${item.task.due}` : "",
      ].filter(Boolean).join(" · "));
      return;
    }
    if (item.kind === "project") {
      setIcon(icon, "folder-kanban");
      title.setText(item.project.name);
      meta.setText(`项目 · ${item.project.status}${item.project.deadline ? ` · 截止 ${item.project.deadline}` : ""}`);
      return;
    }
    setIcon(icon, "repeat-2");
    title.setText(item.habit.name);
    meta.setText(`习惯 · ${item.habit.frequency === "weekdays" ? "工作日" : "每日"} · ${item.habit.status}`);
  }

  onChooseSuggestion(item: SearchItem): void {
    if (item.kind === "action") {
      if (item.id === "new-task") new TaskEditorModal(this.plugin).open();
      else if (item.id === "new-project") new ProjectEditorModal(this.plugin).open();
      else new HabitEditorModal(this.plugin).open();
      return;
    }
    if (item.kind === "task") new TaskEditorModal(this.plugin, item.task).open();
    else if (item.kind === "project") new ProjectDetailModal(this.plugin, item.project.id).open();
    else new HabitEditorModal(this.plugin, item.habit).open();
  }
}

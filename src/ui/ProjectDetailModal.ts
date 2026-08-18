import { Modal, setIcon } from "obsidian";
import type DashFlowPlugin from "../main";
import type { Project, Task } from "../models";
import { ProjectEditorModal } from "./ProjectEditorModal";
import { TaskEditorModal } from "./TaskEditorModal";

function statusLabel(status: Project["status"]): string {
  return {
    planned: "计划中",
    active: "进行中",
    paused: "暂停",
    completed: "已完成",
    archived: "已归档",
  }[status];
}

export class ProjectDetailModal extends Modal {
  constructor(
    private readonly plugin: DashFlowPlugin,
    private readonly projectId: string,
  ) {
    super(plugin.app);
  }

  onOpen(): void {
    this.render();
  }

  onClose(): void {
    this.contentEl.empty();
  }

  private currentProject(): Project | undefined {
    return this.plugin.vaultIndex.getSnapshot().projects.find((project) => project.id === this.projectId);
  }

  private render(): void {
    const project = this.currentProject();
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("dashflow-project-detail", "dashflow-editor-modal");

    if (!project) {
      contentEl.createEl("h2", { text: "项目已不可用" });
      contentEl.createEl("p", { cls: "setting-item-description", text: "项目可能已被移动、删除或修改 ID。" });
      return;
    }

    const progress = this.plugin.projectService.progress(project);
    const tasks = this.plugin.projectService.tasks(project);
    const openTasks = tasks.filter((task) => !task.completed);
    const doneTasks = tasks.filter((task) => task.completed);

    const header = contentEl.createDiv("dashflow-project-detail-head");
    const copy = header.createDiv();
    copy.createDiv({ cls: "dashflow-modal-eyebrow", text: "PROJECT" });
    copy.createEl("h2", { text: project.name });
    if (project.description) copy.createEl("p", { text: project.description, cls: "dashflow-modal-lead" });

    const actions = header.createDiv("dashflow-project-detail-actions");
    const edit = actions.createEl("button", { attr: { type: "button", "aria-label": "编辑项目" } });
    setIcon(edit, "pencil");
    edit.createSpan({ text: "编辑" });
    edit.addEventListener("click", () => {
      this.close();
      new ProjectEditorModal(this.plugin, project).open();
    });
    const source = actions.createEl("button", { attr: { type: "button", "aria-label": "打开项目笔记" } });
    setIcon(source, "file-text");
    source.createSpan({ text: "原文" });
    source.addEventListener("click", () => {
      void this.plugin.app.workspace.openLinkText(project.source.path, "", false);
      this.close();
    });

    const meta = contentEl.createDiv("dashflow-project-detail-meta");
    this.metaItem(meta, "状态", statusLabel(project.status));
    this.metaItem(meta, "进度", `${progress}%`);
    this.metaItem(meta, "待办", String(openTasks.length));
    this.metaItem(meta, "截止", project.deadline ?? "未设置");

    const progressTrack = contentEl.createDiv("dashflow-project-detail-progress");
    const progressFill = progressTrack.createSpan();
    progressFill.style.width = `${progress}%`;

    const taskHead = contentEl.createDiv("dashflow-project-detail-section-head");
    const taskTitle = taskHead.createDiv();
    taskTitle.createEl("strong", { text: "下一步行动" });
    taskTitle.createEl("span", { text: `${openTasks.length} 未完成 · ${doneTasks.length} 已完成` });
    const add = taskHead.createEl("button", { text: "＋ 新建任务", attr: { type: "button" } });
    add.addEventListener("click", () => {
      this.close();
      new TaskEditorModal(this.plugin, undefined, { projectId: project.id }).open();
    });

    const list = contentEl.createDiv("dashflow-project-detail-task-list");
    if (openTasks.length === 0) {
      const empty = list.createDiv("dashflow-product-empty");
      empty.createEl("strong", { text: "没有未完成任务" });
      empty.createEl("span", { text: "如果项目还没有完成，先写下一个可以执行的动作。" });
    } else {
      for (const task of openTasks) this.renderTask(list, task);
    }

    if (doneTasks.length > 0) {
      const details = contentEl.createEl("details", { cls: "dashflow-project-completed" });
      details.createEl("summary", { text: `已完成 · ${doneTasks.length}` });
      const completedList = details.createDiv("dashflow-project-detail-task-list");
      for (const task of doneTasks.slice(0, 20)) this.renderTask(completedList, task);
    }
  }

  private metaItem(parent: HTMLElement, label: string, value: string): void {
    const item = parent.createDiv("dashflow-project-detail-meta-item");
    item.createSpan({ text: label });
    item.createEl("strong", { text: value });
  }

  private renderTask(parent: HTMLElement, task: Task): void {
    const row = parent.createDiv("dashflow-project-detail-task");
    const check = row.createEl("input");
    check.type = "checkbox";
    check.checked = task.completed;
    check.addEventListener("change", async () => {
      check.disabled = true;
      await this.plugin.taskService.toggle(task);
      this.render();
    });

    const main = row.createEl("button", { attr: { type: "button" } });
    const text = main.createEl("strong", { text: task.text });
    if (task.completed) text.addClass("is-completed");
    const meta = main.createSpan();
    const parts = [
      task.scheduled ? `计划 ${task.scheduled}` : "",
      task.due ? `截止 ${task.due}` : "",
      task.priority !== "normal" ? `优先级 ${task.priority}` : "",
    ].filter(Boolean);
    meta.setText(parts.join(" · ") || "无日期");
    main.addEventListener("click", () => {
      this.close();
      new TaskEditorModal(this.plugin, task).open();
    });
  }
}

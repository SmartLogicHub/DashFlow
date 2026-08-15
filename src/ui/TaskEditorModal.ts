import { Modal, Setting } from "obsidian";
import type DashFlowPlugin from "../main";
import type { Task, TaskEditInput, TaskPriority } from "../models";
import { formatTaskBody } from "../parsers/taskParser";

const PRIORITY_OPTIONS: Array<[TaskPriority, string]> = [
  ["urgent", "紧急"],
  ["high", "高"],
  ["normal", "普通"],
  ["low", "低"],
];

export class TaskEditorModal extends Modal {
  constructor(
    private readonly plugin: DashFlowPlugin,
    private readonly task?: Task,
    private readonly initial: Partial<TaskEditInput> = {},
  ) {
    super(plugin.app);
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("dashflow-task-editor", "dashflow-editor-modal");

    const draft: TaskEditInput = {
      text: this.task?.text ?? this.initial.text ?? "",
      completed: this.task?.completed ?? this.initial.completed ?? false,
      due: this.task?.due ?? this.initial.due,
      scheduled: this.task?.scheduled ?? this.initial.scheduled,
      start: this.task?.start ?? this.initial.start,
      priority: this.task?.priority ?? this.initial.priority ?? "normal",
      projectId: this.task?.projectId ?? this.initial.projectId,
    };

    contentEl.createEl("div", { cls: "dashflow-modal-eyebrow", text: this.task ? "TASK · EDIT" : "TASK · NEW" });
    contentEl.createEl("h2", { text: this.task ? "编辑任务" : "新建任务" });
    contentEl.createEl("p", {
      cls: "setting-item-description dashflow-modal-lead",
      text: this.task
        ? "修改会直接同步回任务所在的 Markdown。"
        : "先把行动记录下来；项目、计划日和截止日都可以稍后调整。",
    });

    new Setting(contentEl)
      .setName("任务")
      .setDesc("写成一个可以直接执行的动作。")
      .addText((component) => {
        component.setPlaceholder("例如：整理本周发布计划");
        component.setValue(draft.text);
        component.onChange((value) => { draft.text = value; });
        window.setTimeout(() => component.inputEl.focus(), 0);
      });

    if (this.task) {
      new Setting(contentEl)
        .setName("完成状态")
        .setDesc("完成后仍会保留在 Markdown 中。")
        .addToggle((component) => {
          component.setValue(draft.completed);
          component.onChange((value) => { draft.completed = value; });
        });
    }

    new Setting(contentEl)
      .setName("计划日期")
      .setDesc("你准备在哪一天推进它。")
      .addText((component) => {
        component.inputEl.type = "date";
        component.setValue(draft.scheduled ?? "");
        component.onChange((value) => { draft.scheduled = value || undefined; });
      });

    new Setting(contentEl)
      .setName("截止日期")
      .setDesc("真正不能晚于哪一天；没有硬截止可以留空。")
      .addText((component) => {
        component.inputEl.type = "date";
        component.setValue(draft.due ?? "");
        component.onChange((value) => { draft.due = value || undefined; });
      });

    new Setting(contentEl)
      .setName("开始日期")
      .setDesc("可选。适合需要提前进入视野的长期任务。")
      .addText((component) => {
        component.inputEl.type = "date";
        component.setValue(draft.start ?? "");
        component.onChange((value) => { draft.start = value || undefined; });
      });

    new Setting(contentEl)
      .setName("优先级")
      .addDropdown((component) => {
        for (const [value, label] of PRIORITY_OPTIONS) component.addOption(value, label);
        component.setValue(draft.priority);
        component.onChange((value) => { draft.priority = value as TaskPriority; });
      });

    const projects = [...this.plugin.vaultIndex.getSnapshot().projects]
      .filter((project) => project.status !== "archived")
      .sort((a, b) => a.name.localeCompare(b.name));
    new Setting(contentEl)
      .setName("所属项目")
      .setDesc("把任务放进明确的长期目标，而不是只靠标签记忆。")
      .addDropdown((component) => {
        component.addOption("", "无项目");
        for (const project of projects) component.addOption(project.id, project.name);
        if (draft.projectId && !projects.some((project) => project.id === draft.projectId)) {
          component.addOption(draft.projectId, `${draft.projectId}（未索引）`);
        }
        component.setValue(draft.projectId ?? "");
        component.onChange((value) => { draft.projectId = value || undefined; });
      });

    const actions = new Setting(contentEl);
    actions.settingEl.addClass("dashflow-task-editor-actions");

    if (this.task) {
      actions.addExtraButton((button) => {
        button.setIcon("file-text");
        button.setTooltip("打开原文");
        button.onClick(() => {
          void this.plugin.app.workspace.openLinkText(this.task?.source.path ?? "", "", false);
          this.close();
        });
      });
    }

    actions.addButton((button) => {
      button.setButtonText("取消");
      button.onClick(() => this.close());
    });

    actions.addButton((button) => {
      button.setCta();
      button.setButtonText(this.task ? "保存任务" : "创建任务");
      button.onClick(() => void this.save(draft));
    });
  }

  onClose(): void {
    this.contentEl.empty();
  }

  private async save(draft: TaskEditInput): Promise<void> {
    if (!draft.text.trim()) return;

    if (this.task) {
      const ok = await this.plugin.taskService.update(this.task, draft);
      if (ok) this.close();
      return;
    }

    const body = formatTaskBody({
      text: draft.text.trim(),
      start: draft.start,
      scheduled: draft.scheduled,
      due: draft.due,
      priority: draft.priority,
      projectId: draft.projectId,
    });
    const ok = await this.plugin.captureService.capture(body);
    if (ok) this.close();
  }
}

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
  ) {
    super(plugin.app);
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("dashflow-task-editor");

    const draft: TaskEditInput = {
      text: this.task?.text ?? "",
      completed: this.task?.completed ?? false,
      due: this.task?.due,
      priority: this.task?.priority ?? "normal",
      projectId: this.task?.projectId,
    };

    contentEl.createEl("h2", { text: this.task ? "编辑任务" : "新建任务" });
    contentEl.createEl("p", {
      cls: "setting-item-description",
      text: this.task
        ? `修改会直接写回 ${this.task.source.path}`
        : `新任务会写入 ${this.plugin.data.settings.inboxPath}`,
    });

    new Setting(contentEl)
      .setName("任务标题")
      .setDesc("日期、优先级和项目由下面的字段管理。")
      .addText((component) => {
        component.setPlaceholder("要完成什么？");
        component.setValue(draft.text);
        component.onChange((value) => {
          draft.text = value;
        });
        window.setTimeout(() => component.inputEl.focus(), 0);
      });

    if (this.task) {
      new Setting(contentEl)
        .setName("已完成")
        .setDesc("切换任务的完成状态。")
        .addToggle((component) => {
          component.setValue(draft.completed);
          component.onChange((value) => {
            draft.completed = value;
          });
        });
    }

    new Setting(contentEl)
      .setName("到期日期")
      .setDesc("留空表示没有到期日期。")
      .addText((component) => {
        component.inputEl.type = "date";
        component.setValue(draft.due ?? "");
        component.onChange((value) => {
          draft.due = value || undefined;
        });
      });

    new Setting(contentEl)
      .setName("优先级")
      .addDropdown((component) => {
        for (const [value, label] of PRIORITY_OPTIONS) component.addOption(value, label);
        component.setValue(draft.priority);
        component.onChange((value) => {
          draft.priority = value as TaskPriority;
        });
      });

    const projects = [...this.plugin.vaultIndex.getSnapshot().projects]
      .sort((a, b) => a.name.localeCompare(b.name));
    new Setting(contentEl)
      .setName("所属项目")
      .setDesc("通过 #project/<id> 写回 Markdown。")
      .addDropdown((component) => {
        component.addOption("", "无项目");
        for (const project of projects) {
          component.addOption(project.id, project.name);
        }
        if (draft.projectId && !projects.some((project) => project.id === draft.projectId)) {
          component.addOption(draft.projectId, `${draft.projectId}（未索引）`);
        }
        component.setValue(draft.projectId ?? "");
        component.onChange((value) => {
          draft.projectId = value || undefined;
        });
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
      button.setButtonText(this.task ? "保存" : "创建任务");
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
      due: draft.due,
      priority: draft.priority,
      projectId: draft.projectId,
    });
    const ok = await this.plugin.captureService.capture(body);
    if (ok) this.close();
  }
}

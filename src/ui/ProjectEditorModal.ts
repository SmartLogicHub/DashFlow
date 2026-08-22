import { Modal, Notice, Setting } from "obsidian";
import type DashFlowPlugin from "../main";
import type { Project, ProjectEditInput, ProjectProgressMode, ProjectStatus } from "../models";

const STATUS_OPTIONS: Array<[ProjectStatus, string]> = [
  ["planned", "计划中"],
  ["active", "进行中"],
  ["paused", "暂停"],
  ["completed", "已完成"],
  ["archived", "已归档"],
];

const PROGRESS_OPTIONS: Array<[ProjectProgressMode, string]> = [
  ["tasks", "按任务自动计算"],
  ["manual", "手动进度"],
];

export class ProjectEditorModal extends Modal {
  constructor(
    private readonly plugin: DashFlowPlugin,
    private readonly project?: Project,
    private readonly initial: Partial<ProjectEditInput> = {},
  ) {
    super(plugin.app);
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("dashflow-editor-modal", "dashflow-project-editor");

    const draft: ProjectEditInput = {
      id: this.project?.id ?? this.initial.id,
      name: this.project?.name ?? this.initial.name ?? "",
      description: this.project?.description ?? this.initial.description,
      status: this.project?.status ?? this.initial.status ?? "active",
      start: this.project?.start ?? this.initial.start,
      deadline: this.project?.deadline ?? this.initial.deadline,
      progressMode: this.project?.progressMode ?? this.initial.progressMode ?? "tasks",
      manualProgress: this.project?.manualProgress ?? this.initial.manualProgress,
    };

    contentEl.createEl("div", { cls: "dashflow-modal-eyebrow", text: this.project ? "项目 · 编辑" : "项目 · 新建" });
    contentEl.createEl("h2", { text: this.project ? "编辑项目" : "新建项目" });
    contentEl.createEl("p", {
      cls: "setting-item-description dashflow-modal-lead",
      text: "项目负责长期方向；真正的执行动作继续放在任务里。",
    });

    new Setting(contentEl)
      .setName("项目名称")
      .setDesc("用结果或目标命名，比抽象分类更容易推进。")
      .addText((component) => {
        component.setPlaceholder("例如：发布 DashFlow 1.0");
        component.setValue(draft.name);
        component.onChange((value) => { draft.name = value; });
        window.setTimeout(() => component.inputEl.focus(), 0);
      });

    new Setting(contentEl)
      .setName("项目 ID")
      .setDesc(this.project ? "已有项目的 ID 保持不变，避免任务关联失效。" : "用于任务与项目之间的稳定关联；留空时按项目名生成。")
      .addText((component) => {
        component.setPlaceholder("dashflow-launch");
        component.setValue(draft.id ?? "");
        component.setDisabled(Boolean(this.project));
        component.onChange((value) => { draft.id = value || undefined; });
      });

    new Setting(contentEl)
      .setName("说明")
      .setDesc("一句话说明为什么做，以及完成意味着什么。")
      .addTextArea((component) => {
        component.setPlaceholder("这个项目要解决什么问题？");
        component.setValue(draft.description ?? "");
        component.onChange((value) => { draft.description = value || undefined; });
      });

    new Setting(contentEl)
      .setName("状态")
      .addDropdown((component) => {
        for (const [value, label] of STATUS_OPTIONS) component.addOption(value, label);
        component.setValue(draft.status);
        component.onChange((value) => { draft.status = value as ProjectStatus; });
      });

    new Setting(contentEl)
      .setName("开始日期")
      .addText((component) => {
        component.inputEl.type = "date";
        component.setValue(draft.start ?? "");
        component.onChange((value) => { draft.start = value || undefined; });
      });

    new Setting(contentEl)
      .setName("截止日期")
      .setDesc("没有真实截止日时可以留空。")
      .addText((component) => {
        component.inputEl.type = "date";
        component.setValue(draft.deadline ?? "");
        component.onChange((value) => { draft.deadline = value || undefined; });
      });

    new Setting(contentEl)
      .setName("进度")
      .addDropdown((component) => {
        for (const [value, label] of PROGRESS_OPTIONS) component.addOption(value, label);
        component.setValue(draft.progressMode);
        component.onChange((value) => { draft.progressMode = value as ProjectProgressMode; });
      });

    new Setting(contentEl)
      .setName("手动进度")
      .setDesc("只有选择“手动进度”时生效。")
      .addSlider((component) => {
        component.setLimits(0, 100, 5);
        component.setDynamicTooltip();
        component.setValue(draft.manualProgress ?? 0);
        component.onChange((value) => { draft.manualProgress = value; });
      });

    const actions = new Setting(contentEl);
    actions.settingEl.addClass("dashflow-task-editor-actions");
    if (this.project) {
      actions.addExtraButton((button) => {
        button.setIcon("file-text");
        button.setTooltip("打开项目笔记");
        button.onClick(() => {
          void this.plugin.app.workspace.openLinkText(this.project?.source.path ?? "", "", false);
          this.close();
        });
      });
    }
    actions.addButton((button) => button.setButtonText("取消").onClick(() => this.close()));
    actions.addButton((button) => {
      button.setCta();
      button.setButtonText(this.project ? "保存项目" : "创建项目");
      button.onClick(() => void this.save(draft));
    });
  }

  onClose(): void {
    this.contentEl.empty();
  }

  private async save(draft: ProjectEditInput): Promise<void> {
    if (!draft.name.trim()) {
      new Notice("项目名称不能为空。");
      return;
    }
    if (this.project) {
      if (await this.plugin.projectService.update(this.project, draft)) this.close();
      return;
    }
    const project = await this.plugin.projectService.create(draft);
    if (project) this.close();
  }
}

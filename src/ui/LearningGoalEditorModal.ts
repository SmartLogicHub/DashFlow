import { Modal, Setting } from "obsidian";
import type DashFlowPlugin from "../main";
import type { LearningGoal, LearningGoalEditInput, LearningGoalStatus } from "../learning/models";

const STATUS_OPTIONS: Array<[LearningGoalStatus, string]> = [
  ["active", "进行中"],
  ["paused", "暂停"],
  ["completed", "已完成"],
  ["archived", "已归档"],
];

function splitLines(value: string): string[] {
  return value.split(/\n/).map((item) => item.trim()).filter(Boolean);
}

export class LearningGoalEditorModal extends Modal {
  constructor(
    private readonly plugin: DashFlowPlugin,
    private readonly goal?: LearningGoal,
    private readonly initial: Partial<LearningGoalEditInput> = {},
  ) {
    super(plugin.app);
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("dashflow-editor-modal", "dashflow-learning-goal-editor");

    const draft: LearningGoalEditInput = {
      id: this.goal?.id ?? this.initial.id,
      name: this.goal?.name ?? this.initial.name ?? "",
      domain: this.goal?.domain ?? this.initial.domain,
      outcome: this.goal?.outcome ?? this.initial.outcome ?? "",
      baseline: this.goal?.baseline ?? this.initial.baseline,
      successCriteria: this.goal?.successCriteria ?? this.initial.successCriteria ?? [],
      status: this.goal?.status ?? this.initial.status ?? "active",
      targetDate: this.goal?.targetDate ?? this.initial.targetDate,
      linkedProjectId: this.goal?.linkedProjectId ?? this.initial.linkedProjectId,
      nextStep: this.goal?.nextStep ?? this.initial.nextStep,
      tags: this.goal?.tags ?? this.initial.tags ?? [],
    };

    contentEl.createEl("div", { cls: "dashflow-modal-eyebrow", text: this.goal ? "LEARNING GOAL · EDIT" : "LEARNING GOAL · NEW" });
    contentEl.createEl("h2", { text: this.goal ? "编辑学习目标" : "建立学习目标" });
    contentEl.createEl("p", {
      cls: "setting-item-description dashflow-modal-lead",
      text: "先定义真实结果和基线，再决定练什么。不要用“了解一下”作为目标。",
    });

    new Setting(contentEl).setName("目标名称").addText((c) => {
      c.setPlaceholder("例如：能独立开发 Obsidian 插件").setValue(draft.name);
      c.onChange((value) => { draft.name = value; });
      window.setTimeout(() => c.inputEl.focus(), 0);
    });

    new Setting(contentEl)
      .setName("Learning Goal ID")
      .setDesc(this.goal ? "已有 ID 保持不变，避免 Session 关联失效。" : "留空时按目标名称生成。")
      .addText((c) => {
        c.setPlaceholder("obsidian-plugin").setValue(draft.id ?? "").setDisabled(Boolean(this.goal));
        c.onChange((value) => { draft.id = value || undefined; });
      });

    new Setting(contentEl).setName("领域").setDesc("例如：英语、编程、写作、考试。 ").addText((c) => {
      c.setValue(draft.domain ?? "");
      c.onChange((value) => { draft.domain = value || undefined; });
    });

    new Setting(contentEl)
      .setName("真实结果")
      .setDesc("一个周期后，你要在什么条件下真正完成什么？")
      .addTextArea((c) => {
        c.setPlaceholder("例如：不依赖 AI，从空仓库完成一个可发布的 Obsidian 插件，并通过自己的测试。 ");
        c.setValue(draft.outcome);
        c.onChange((value) => { draft.outcome = value; });
      });

    new Setting(contentEl)
      .setName("当前基线")
      .setDesc("先写现在能做到什么、做不到什么；以后只和这个证据比较。")
      .addTextArea((c) => {
        c.setValue(draft.baseline ?? "");
        c.onChange((value) => { draft.baseline = value || undefined; });
      });

    new Setting(contentEl)
      .setName("完成标准")
      .setDesc("每行一个可以检查的标准。")
      .addTextArea((c) => {
        c.setPlaceholder("能独立解释插件生命周期\n能写并通过回归测试\n能完成一次真实发布");
        c.setValue(draft.successCriteria.join("\n"));
        c.onChange((value) => { draft.successCriteria = splitLines(value); });
      });

    new Setting(contentEl).setName("状态").addDropdown((c) => {
      for (const [value, label] of STATUS_OPTIONS) c.addOption(value, label);
      c.setValue(draft.status);
      c.onChange((value) => { draft.status = value as LearningGoalStatus; });
    });

    new Setting(contentEl).setName("目标日期").setDesc("没有真实期限可以留空。 ").addText((c) => {
      c.inputEl.type = "date";
      c.setValue(draft.targetDate ?? "");
      c.onChange((value) => { draft.targetDate = value || undefined; });
    });

    new Setting(contentEl).setName("关联项目").setDesc("可选；只建立关系，不复制 Project 进度。 ").addDropdown((c) => {
      c.addOption("", "不关联项目");
      for (const project of this.plugin.projectService.all()) c.addOption(project.id, project.name);
      c.setValue(draft.linkedProjectId ?? "");
      c.onChange((value) => { draft.linkedProjectId = value || undefined; });
    });

    new Setting(contentEl)
      .setName("下一项最小任务")
      .setDesc("下一次打开 Learning 时应该能立刻开始。")
      .addTextArea((c) => {
        c.setPlaceholder("例如：不用 AI，从零写一个只注册 command 的最小插件。 ");
        c.setValue(draft.nextStep ?? "");
        c.onChange((value) => { draft.nextStep = value || undefined; });
      });

    new Setting(contentEl).setName("标签").setDesc("逗号分隔。 ").addText((c) => {
      c.setValue((draft.tags ?? []).join(", "));
      c.onChange((value) => {
        draft.tags = value.split(/[,，]/).map((item) => item.trim().replace(/^#/, "")).filter(Boolean);
      });
    });

    const actions = new Setting(contentEl);
    actions.settingEl.addClass("dashflow-task-editor-actions");
    if (this.goal) {
      actions.addExtraButton((button) => button.setIcon("file-text").setTooltip("打开学习目标笔记").onClick(() => {
        void this.plugin.app.workspace.openLinkText(this.goal?.source.path ?? "", "", false);
        this.close();
      }));
    }
    actions.addButton((button) => button.setButtonText("取消").onClick(() => this.close()));
    actions.addButton((button) => button.setCta().setButtonText(this.goal ? "保存目标" : "创建目标").onClick(() => void this.save(draft)));
  }

  onClose(): void {
    this.contentEl.empty();
  }

  private async save(draft: LearningGoalEditInput): Promise<void> {
    if (!draft.name.trim() || !draft.outcome.trim()) return;
    if (this.goal) {
      if (await this.plugin.learningService.updateGoal(this.goal, draft)) this.close();
      return;
    }
    if (await this.plugin.learningService.createGoal(draft)) this.close();
  }
}

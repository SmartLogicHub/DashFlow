import { Modal, Notice, Setting } from "obsidian";
import type DashFlowPlugin from "../main";
import type { Habit, HabitEditInput, HabitFrequency, HabitKind, HabitStatus } from "../models";
import { localDate } from "../utils/date";

const STATUS_OPTIONS: Array<[HabitStatus, string]> = [
  ["active", "进行中"],
  ["paused", "暂停"],
  ["completed", "已完成"],
  ["archived", "已归档"],
];

const FREQUENCY_OPTIONS: Array<[HabitFrequency, string]> = [
  ["daily", "每天"],
  ["weekdays", "工作日"],
];

const KIND_OPTIONS: Array<[HabitKind, string]> = [
  ["habit", "习惯"],
  ["daily-progress", "长期任务（日更）"],
];

export class HabitEditorModal extends Modal {
  constructor(
    private readonly plugin: DashFlowPlugin,
    private readonly habit?: Habit,
  ) {
    super(plugin.app);
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("dashflow-habit-editor", "dashflow-editor-modal");

    const draft: HabitEditInput = {
      id: this.habit?.id ?? "",
      name: this.habit?.name ?? "",
      description: this.habit?.description,
      status: this.habit?.status ?? "active",
      frequency: this.habit?.frequency ?? "daily",
      kind: this.habit?.kind ?? "habit",
      start: this.habit?.start ?? localDate(),
      end: this.habit?.end,
      targetDays: this.habit?.targetDays,
      linkedProjectId: this.habit?.linkedProjectId,
    };

    let frequencySelect: HTMLSelectElement | null = null;
    let projectSelect: HTMLSelectElement | null = null;

    contentEl.createEl("div", { cls: "dashflow-modal-eyebrow", text: this.habit ? "长期任务 · 编辑" : "长期任务 · 新建" });
    contentEl.createEl("h2", { text: this.habit ? "编辑长期节奏" : "新建长期节奏" });
    contentEl.createEl("p", {
      cls: "setting-item-description dashflow-modal-lead",
      text: this.habit
        ? `定义、打卡和日更记录保存在 ${this.habit.source.path} 的 frontmatter 中。`
        : `创建在 ${this.plugin.data.settings.habitFolder}。习惯用于保持节奏；长期任务用于每天推进一个有终点的目标。`,
    });

    new Setting(contentEl)
      .setName("类型")
      .setDesc("习惯适合长期重复；长期任务（日更）适合论文、考试、产品上线等有阶段终点的目标。")
      .addDropdown((component) => {
        for (const [value, label] of KIND_OPTIONS) component.addOption(value, label);
        component.setValue(draft.kind ?? "habit");
        component.onChange((value) => {
          draft.kind = value as HabitKind;
          const isProgress = draft.kind === "daily-progress";
          if (isProgress) draft.frequency = "daily";
          if (frequencySelect) {
            frequencySelect.disabled = isProgress;
            if (isProgress) frequencySelect.value = "daily";
          }
          if (projectSelect) projectSelect.disabled = !isProgress;
          if (!isProgress) draft.linkedProjectId = undefined;
        });
      });

    new Setting(contentEl)
      .setName("名称")
      .setDesc("例如：每天运动、论文写作 60 天、DashFlow 0.5 发布。")
      .addText((component) => {
        component.setPlaceholder("DashFlow 0.5");
        component.setValue(draft.name);
        component.onChange((value) => { draft.name = value; });
        window.setTimeout(() => component.inputEl.focus(), 0);
      });

    new Setting(contentEl)
      .setName("ID")
      .setDesc(this.habit ? "创建后保持稳定，用于活动统计和未来引用。" : "可留空，将根据名称自动生成。")
      .addText((component) => {
        component.setPlaceholder("dashflow-v05");
        component.setValue(draft.id ?? "");
        component.inputEl.disabled = Boolean(this.habit);
        component.onChange((value) => { draft.id = value; });
      });

    new Setting(contentEl)
      .setName("说明")
      .setDesc("可选的一句话目标。")
      .addText((component) => {
        component.setPlaceholder("每天推进一个可交付结果");
        component.setValue(draft.description ?? "");
        component.onChange((value) => { draft.description = value || undefined; });
      });

    new Setting(contentEl)
      .setName("频率")
      .setDesc("普通习惯可选每天/工作日；长期任务（日更）固定为每天。")
      .addDropdown((component) => {
        for (const [value, label] of FREQUENCY_OPTIONS) component.addOption(value, label);
        component.setValue(draft.kind === "daily-progress" ? "daily" : draft.frequency);
        frequencySelect = component.selectEl;
        component.selectEl.disabled = draft.kind === "daily-progress";
        component.onChange((value) => { draft.frequency = value as HabitFrequency; });
      });

    new Setting(contentEl)
      .setName("开始日期")
      .addText((component) => {
        component.inputEl.type = "date";
        component.setValue(draft.start ?? "");
        component.onChange((value) => { draft.start = value || undefined; });
      });

    new Setting(contentEl)
      .setName("结束日期")
      .setDesc("长期任务建议设置终点；普通习惯可以留空。")
      .addText((component) => {
        component.inputEl.type = "date";
        component.setValue(draft.end ?? "");
        component.onChange((value) => { draft.end = value || undefined; });
      });

    new Setting(contentEl)
      .setName("目标天数")
        .setDesc("设置后卡片会显示完成天数 / 目标天数和百分比。")
      .addText((component) => {
        component.inputEl.type = "number";
        component.inputEl.min = "1";
        component.inputEl.step = "1";
        component.setValue(draft.targetDays ? String(draft.targetDays) : "");
        component.onChange((value) => {
          const parsed = Number(value);
          draft.targetDays = Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : undefined;
        });
      });

    const projects = this.plugin.vaultIndex.getSnapshot().projects
      .filter((project) => project.status !== "archived")
      .sort((a, b) => a.name.localeCompare(b.name));

    new Setting(contentEl)
      .setName("关联项目")
        .setDesc("仅长期任务使用。关联后可以看出这段日更属于哪个项目，不复制项目数据。")
      .addDropdown((component) => {
        component.addOption("", "不关联项目");
        const options = new Set<string>();
        for (const project of projects) {
          component.addOption(project.id, project.name);
          options.add(project.id);
        }
        if (draft.linkedProjectId && !options.has(draft.linkedProjectId)) {
          component.addOption(draft.linkedProjectId, draft.linkedProjectId);
        }
        component.setValue(draft.linkedProjectId ?? "");
        projectSelect = component.selectEl;
        component.selectEl.disabled = draft.kind !== "daily-progress";
        component.onChange((value) => { draft.linkedProjectId = value || undefined; });
      });

    new Setting(contentEl)
      .setName("状态")
      .addDropdown((component) => {
        for (const [value, label] of STATUS_OPTIONS) component.addOption(value, label);
        component.setValue(draft.status);
        component.onChange((value) => { draft.status = value as HabitStatus; });
      });

    const actions = new Setting(contentEl);
    actions.settingEl.addClass("dashflow-habit-editor-actions");

    if (this.habit) {
      actions.addExtraButton((button) => {
        button.setIcon("file-text");
        button.setTooltip("打开 Markdown 笔记");
        button.onClick(() => {
          void this.plugin.app.workspace.openLinkText(this.habit?.source.path ?? "", "", false);
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
      button.setButtonText(this.habit ? "保存" : "创建");
      button.onClick(() => void this.save(draft));
    });
  }

  onClose(): void {
    this.contentEl.empty();
  }

  private async save(draft: HabitEditInput): Promise<void> {
    if (!draft.name.trim()) {
      new Notice("名称不能为空。");
      return;
    }
    if (draft.kind === "daily-progress") draft.frequency = "daily";
    else draft.linkedProjectId = undefined;

    if (this.habit) {
      const ok = await this.plugin.habitService.update(this.habit, draft);
      if (ok) this.close();
      return;
    }
    const created = await this.plugin.habitService.create(draft);
    if (created) this.close();
  }
}

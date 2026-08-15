import { Modal, Setting } from "obsidian";
import type DashFlowPlugin from "../main";
import type { Habit, HabitEditInput, HabitFrequency, HabitStatus } from "../models";
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
    contentEl.addClass("dashflow-habit-editor");

    const draft: HabitEditInput = {
      id: this.habit?.id ?? "",
      name: this.habit?.name ?? "",
      description: this.habit?.description,
      status: this.habit?.status ?? "active",
      frequency: this.habit?.frequency ?? "daily",
      start: this.habit?.start ?? localDate(),
      end: this.habit?.end,
      targetDays: this.habit?.targetDays,
    };

    contentEl.createEl("h2", { text: this.habit ? "编辑习惯" : "新建习惯" });
    contentEl.createEl("p", {
      cls: "setting-item-description",
      text: this.habit
        ? `定义与打卡记录保存在 ${this.habit.source.path} 的 frontmatter 中。`
        : `新习惯会创建在 ${this.plugin.data.settings.habitFolder}。`,
    });

    new Setting(contentEl)
      .setName("习惯名称")
      .setDesc("例如：运动、阅读、写作、学习 TypeScript。")
      .addText((component) => {
        component.setPlaceholder("每天运动");
        component.setValue(draft.name);
        component.onChange((value) => { draft.name = value; });
        window.setTimeout(() => component.inputEl.focus(), 0);
      });

    new Setting(contentEl)
      .setName("Habit ID")
      .setDesc(this.habit ? "创建后保持稳定，用于活动统计和未来引用。" : "可留空，将根据名称自动生成。")
      .addText((component) => {
        component.setPlaceholder("workout");
        component.setValue(draft.id ?? "");
        component.inputEl.disabled = Boolean(this.habit);
        component.onChange((value) => { draft.id = value; });
      });

    new Setting(contentEl)
      .setName("说明")
      .setDesc("可选的一句话目标。")
      .addText((component) => {
        component.setPlaceholder("保持身体活跃");
        component.setValue(draft.description ?? "");
        component.onChange((value) => { draft.description = value || undefined; });
      });

    new Setting(contentEl)
      .setName("频率")
      .setDesc("v0.1.5 先支持每天与工作日两种节奏。")
      .addDropdown((component) => {
        for (const [value, label] of FREQUENCY_OPTIONS) component.addOption(value, label);
        component.setValue(draft.frequency);
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
      .setDesc("可选；适合 14 天 / 30 天 / 100 天等长期挑战。")
      .addText((component) => {
        component.inputEl.type = "date";
        component.setValue(draft.end ?? "");
        component.onChange((value) => { draft.end = value || undefined; });
      });

    new Setting(contentEl)
      .setName("目标打卡天数")
      .setDesc("可选；设置后 Widget 会显示长期目标进度。")
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
        button.setTooltip("打开习惯笔记");
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
      button.setButtonText(this.habit ? "保存" : "创建习惯");
      button.onClick(() => void this.save(draft));
    });
  }

  onClose(): void {
    this.contentEl.empty();
  }

  private async save(draft: HabitEditInput): Promise<void> {
    if (!draft.name.trim()) return;
    if (this.habit) {
      const ok = await this.plugin.habitService.update(this.habit, draft);
      if (ok) this.close();
      return;
    }
    const created = await this.plugin.habitService.create(draft);
    if (created) this.close();
  }
}

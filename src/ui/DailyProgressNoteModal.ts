import { Modal, Setting } from "obsidian";
import type DashFlowPlugin from "../main";
import type { Habit } from "../models";

export class DailyProgressNoteModal extends Modal {
  constructor(
    private readonly plugin: DashFlowPlugin,
    private readonly habit: Habit,
    private readonly date: string,
  ) {
    super(plugin.app);
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("dashflow-daily-progress-note", "dashflow-editor-modal");

    const existing = this.habit.dailyNotes?.[this.date] ?? "";
    let draft = existing;

    contentEl.createEl("div", { cls: "dashflow-modal-eyebrow", text: `DAILY PROGRESS · ${this.date}` });
    contentEl.createEl("h2", { text: this.habit.name });
    contentEl.createEl("p", {
      cls: "setting-item-description dashflow-modal-lead",
      text: "记录今天实际推进了什么。备注保存在长期任务 Markdown frontmatter 的 daily_notes 中。",
    });

    new Setting(contentEl)
      .setName("今日备注")
      .setDesc("例如：完成登录页交互，解决两个阻塞问题。留空保存会清除当天备注。")
      .addTextArea((component) => {
        component.setPlaceholder("今天推进了什么？");
        component.setValue(existing);
        component.inputEl.rows = 6;
        component.inputEl.addClass("dashflow-daily-progress-note-input");
        component.onChange((value) => { draft = value; });
        window.setTimeout(() => component.inputEl.focus(), 0);
      });

    const actions = new Setting(contentEl);
    actions.settingEl.addClass("dashflow-daily-progress-note-actions");

    actions.addExtraButton((button) => {
      button.setIcon("file-text");
      button.setTooltip("打开长期任务笔记");
      button.onClick(() => {
        void this.plugin.app.workspace.openLinkText(this.habit.source.path, "", false);
        this.close();
      });
    });

    actions.addButton((button) => {
      button.setButtonText("取消");
      button.onClick(() => this.close());
    });

    actions.addButton((button) => {
      button.setCta();
      button.setButtonText("保存备注");
      button.onClick(() => void this.save(draft));
    });
  }

  onClose(): void {
    this.contentEl.empty();
  }

  private async save(note: string): Promise<void> {
    const ok = await this.plugin.habitService.setDailyNote(this.habit, this.date, note);
    if (ok) this.close();
  }
}

import { Modal, Setting, type App } from "obsidian";
import type { OpportunityItem } from "../services/OpportunityService";

export class OpportunityEditModal extends Modal {
  constructor(
    app: App,
    private readonly item: OpportunityItem,
    private readonly onSave: (patch: Partial<OpportunityItem>) => void | Promise<void>,
    private readonly onDelete: () => void | Promise<void>,
  ) {
    super(app);
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("dashflow-opportunity-edit", "dashflow-editor-modal");

    const draft = {
      title: this.item.title,
      notes: this.item.notes,
      link: this.item.link,
      starred: this.item.starred,
    };

    contentEl.createEl("div", { cls: "dashflow-modal-eyebrow", text: "OPPORTUNITY · EDIT" });
    contentEl.createEl("h2", { text: "编辑灵感" });
    contentEl.createEl("p", {
      cls: "setting-item-description dashflow-modal-lead",
      text: "灵感条目统一存于看板文件，展开内容用链接关联到笔记。",
    });

    new Setting(contentEl)
      .setName("标题")
      .addText((text) => text.setValue(draft.title).onChange((value) => { draft.title = value; }));

    new Setting(contentEl)
      .setName("备注")
      .setDesc("记录背景、判断或下一步。")
      .addTextArea((area) => area.setValue(draft.notes).onChange((value) => { draft.notes = value; }));

    new Setting(contentEl)
      .setName("链接")
      .setDesc("库内 [[笔记]] 或外部 https:// 链接。")
      .addText((text) => text.setValue(draft.link).onChange((value) => { draft.link = value; }));

    new Setting(contentEl)
      .setName("星标")
      .setDesc("标记「重要 / 待跟进」，与所处阶段无关。")
      .addToggle((toggle) => toggle.setValue(draft.starred).onChange((value) => { draft.starred = value; }));

    const actions = new Setting(contentEl);
    actions.settingEl.addClass("dashflow-opportunity-edit-actions");

    actions.addButton((button) => button
      .setButtonText("删除")
      .setWarning()
      .onClick(async () => {
        await this.onDelete();
        this.close();
      }));

    actions.addButton((button) => button.setButtonText("取消").onClick(() => this.close()));

    actions.addButton((button) => button
      .setCta()
      .setButtonText("保存")
      .onClick(async () => {
        await this.onSave({
          title: draft.title.trim(),
          notes: draft.notes.trim(),
          link: draft.link.trim(),
          starred: draft.starred,
        });
        this.close();
      }));
  }

  onClose(): void {
    this.contentEl.empty();
  }
}

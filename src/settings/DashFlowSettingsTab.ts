import { PluginSettingTab, Setting, type App } from "obsidian";
import type DashFlowPlugin from "../main";

export class DashFlowSettingsTab extends PluginSettingTab {
  constructor(app: App, private readonly dashFlow: DashFlowPlugin) {
    super(app, dashFlow);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "DashFlow 设置" });

    new Setting(containerEl)
      .setName("Inbox 路径")
      .setDesc("快速捕捉会把新任务追加到这个 Markdown 文件。")
      .addText((text) => text
        .setPlaceholder("DashFlow/Inbox.md")
        .setValue(this.dashFlow.data.settings.inboxPath)
        .onChange(async (value) => {
          this.dashFlow.data.settings.inboxPath = value.trim() || "DashFlow/Inbox.md";
          await this.dashFlow.savePluginData();
        }));

    new Setting(containerEl)
      .setName("项目 type 值")
      .setDesc("frontmatter 中 type 等于这个值的笔记会被识别为项目。")
      .addText((text) => text
        .setValue(this.dashFlow.data.settings.projectTypeValue)
        .onChange(async (value) => {
          this.dashFlow.data.settings.projectTypeValue = value.trim() || "project";
          await this.dashFlow.savePluginData();
          await this.dashFlow.vaultIndex.reindexAll();
        }));

    new Setting(containerEl)
      .setName("习惯 type 值")
      .setDesc("frontmatter 中 type 等于这个值的笔记会被识别为 Habit。")
      .addText((text) => text
        .setValue(this.dashFlow.data.settings.habitTypeValue)
        .onChange(async (value) => {
          this.dashFlow.data.settings.habitTypeValue = value.trim() || "habit";
          await this.dashFlow.savePluginData();
          await this.dashFlow.vaultIndex.reindexAll();
        }));

    new Setting(containerEl)
      .setName("习惯文件夹")
      .setDesc("从 Dashboard 新建 Habit 时，Markdown 文件会创建在这个目录。")
      .addText((text) => text
        .setPlaceholder("DashFlow/Habits")
        .setValue(this.dashFlow.data.settings.habitFolder)
        .onChange(async (value) => {
          this.dashFlow.data.settings.habitFolder = value.trim() || "DashFlow/Habits";
          await this.dashFlow.savePluginData();
        }));

    const guide = containerEl.createDiv("dashflow-settings-guide");
    guide.createEl("h3", { text: "项目格式" });
    guide.createEl("pre", {
      text: "---\ntype: project\nproject_id: dashflow\nstatus: active\ndeadline: 2026-09-30\n---",
    });
    guide.createEl("p", {
      text: "任务通过 #project/dashflow 与项目关联；到期日支持 📅 YYYY-MM-DD。",
    });

    guide.createEl("h3", { text: "Habit 格式" });
    guide.createEl("pre", {
      text: "---\ntype: habit\nhabit_id: workout\nname: 每天运动\nstatus: active\nfrequency: daily\ntarget_days: 30\nhabit_log:\n  - 2026-08-15\n---",
    });
    guide.createEl("p", {
      text: "Habit 定义和打卡日期都保存在 Markdown frontmatter；Activity 只保存派生统计。",
    });
  }
}

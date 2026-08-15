import { PluginSettingTab, Setting, type App } from "obsidian";
import type DashFlowPlugin from "../main";
import { PLUGIN_VERSION } from "../constants";

export class DashFlowSettingsTab extends PluginSettingTab {
  constructor(app: App, private readonly dashFlow: DashFlowPlugin) {
    super(app, dashFlow);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.addClass("dashflow-settings-page");

    const hero = containerEl.createDiv("dashflow-settings-hero");
    hero.createDiv({ cls: "dashflow-settings-hero-badge", text: `DASHFLOW · v${PLUGIN_VERSION}` });
    hero.createEl("h2", { text: "Control Center" });
    hero.createEl("p", {
      text: "配置 DashFlow 如何识别 Vault 中的任务、项目与 Habit。业务数据仍然保存在 Markdown，Dashboard 只负责组织、呈现和直接操作。",
    });

    const sourcePanel = containerEl.createDiv("dashflow-settings-panel");
    const sourceHead = sourcePanel.createDiv("dashflow-settings-panel-head");
    sourceHead.createEl("strong", { text: "数据与识别" });
    sourceHead.createEl("span", { text: "这些设置决定 DashFlow 从哪里写入，以及如何识别 Project / Habit。" });

    new Setting(sourcePanel)
      .setName("Inbox 路径")
      .setDesc("Quick Capture 会把新任务追加到这个 Markdown 文件。")
      .addText((text) => text
        .setPlaceholder("DashFlow/Inbox.md")
        .setValue(this.dashFlow.data.settings.inboxPath)
        .onChange(async (value) => {
          this.dashFlow.data.settings.inboxPath = value.trim() || "DashFlow/Inbox.md";
          await this.dashFlow.savePluginData();
        }));

    new Setting(sourcePanel)
      .setName("Project type")
      .setDesc("frontmatter 中 type 等于这个值的笔记会被识别为 Project。")
      .addText((text) => text
        .setValue(this.dashFlow.data.settings.projectTypeValue)
        .onChange(async (value) => {
          this.dashFlow.data.settings.projectTypeValue = value.trim() || "project";
          await this.dashFlow.savePluginData();
          await this.dashFlow.vaultIndex.reindexAll();
        }));

    new Setting(sourcePanel)
      .setName("Habit type")
      .setDesc("frontmatter 中 type 等于这个值的笔记会被识别为 Habit。")
      .addText((text) => text
        .setValue(this.dashFlow.data.settings.habitTypeValue)
        .onChange(async (value) => {
          this.dashFlow.data.settings.habitTypeValue = value.trim() || "habit";
          await this.dashFlow.savePluginData();
          await this.dashFlow.vaultIndex.reindexAll();
        }));

    new Setting(sourcePanel)
      .setName("Habit 文件夹")
      .setDesc("从 Dashboard 新建 Habit 时，Markdown 文件会创建在这个目录。")
      .addText((text) => text
        .setPlaceholder("DashFlow/Habits")
        .setValue(this.dashFlow.data.settings.habitFolder)
        .onChange(async (value) => {
          this.dashFlow.data.settings.habitFolder = value.trim() || "DashFlow/Habits";
          await this.dashFlow.savePluginData();
        }));

    const guidePanel = containerEl.createDiv("dashflow-settings-panel");
    const guideHead = guidePanel.createDiv("dashflow-settings-panel-head");
    guideHead.createEl("strong", { text: "Markdown 数据协议" });
    guideHead.createEl("span", { text: "DashFlow 使用开放的 Markdown / frontmatter 格式，不把 Project 或 Habit 锁进插件数据库。" });

    const grid = guidePanel.createDiv("dashflow-settings-guide-grid");
    const projectCard = grid.createDiv("dashflow-settings-code-card");
    projectCard.createEl("h3", { text: "Project" });
    projectCard.createEl("pre", {
      text: "---\ntype: project\nproject_id: dashflow\nstatus: active\ndeadline: 2026-09-30\n---",
    });
    projectCard.createEl("p", {
      text: "任务通过 #project/dashflow 与项目关联；到期日支持 📅 YYYY-MM-DD。",
    });

    const habitCard = grid.createDiv("dashflow-settings-code-card");
    habitCard.createEl("h3", { text: "Habit" });
    habitCard.createEl("pre", {
      text: "---\ntype: habit\nhabit_id: workout\nname: 每天运动\nstatus: active\nfrequency: daily\ntarget_days: 30\nhabit_log:\n  - 2026-08-15\n---",
    });
    habitCard.createEl("p", {
      text: "Habit 定义与打卡日期都保存在 frontmatter；Activity 只保存派生统计。",
    });
  }
}

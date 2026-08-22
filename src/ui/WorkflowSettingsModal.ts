import { Modal, Notice, Setting } from "obsidian";
import type DashFlowPlugin from "../main";
import type { CaptureTarget } from "../models";

export class WorkflowSettingsModal extends Modal {
  private captureTarget: CaptureTarget;
  private dailyHeading: string;
  private morningId: string;
  private workId: string;
  private reviewId: string;

  constructor(private readonly plugin: DashFlowPlugin) {
    super(plugin.app);
    const settings = plugin.data.settings;
    this.captureTarget = settings.quickCaptureTarget;
    this.dailyHeading = settings.dailyCaptureHeading;
    this.morningId = settings.contextMorningDashboardId;
    this.workId = settings.contextWorkDashboardId;
    this.reviewId = settings.contextReviewDashboardId;
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("dashflow-workflow-settings-modal", "dashflow-editor-modal");
    contentEl.createDiv({ cls: "dashflow-modal-eyebrow", text: "工作流" });
    contentEl.createEl("h2", { text: "极速工作流" });
    contentEl.createEl("p", {
      cls: "dashflow-modal-lead",
      text: "快速捕捉决定内容落到哪里；情景模式只是把现有工作台映射成晨间 / 工作 / 复盘，不复制布局。",
    });

    contentEl.createEl("h3", { text: "快速捕捉" });
    new Setting(contentEl)
      .setName("默认捕捉目标")
      .setDesc("收集箱会创建待整理任务；每日笔记会写普通笔记条目；每次询问会在提交时选择。")
      .addDropdown((dropdown) => dropdown
      .addOption("inbox", "DashFlow 收集箱")
      .addOption("daily-note", "今天的每日笔记")
        .addOption("ask", "每次询问")
        .setValue(this.captureTarget)
        .onChange((value) => { this.captureTarget = value as CaptureTarget; }));

    new Setting(contentEl)
      .setName("每日笔记目标标题")
      .setDesc("例如“## 闪念”。不存在时自动创建；留空则追加到笔记末尾。")
      .addText((text) => text
        .setPlaceholder("## 闪念")
        .setValue(this.dailyHeading)
        .onChange((value) => { this.dailyHeading = value; }));

    contentEl.createEl("h3", { text: "情景切换" });
    const dashboards = this.plugin.dashboardManager.list();
    const addDashboardOptions = (setting: Setting, current: string, change: (value: string) => void): void => {
      setting.addDropdown((dropdown) => {
        dropdown.addOption("", "未配置");
        for (const dashboard of dashboards) dropdown.addOption(dashboard.id, dashboard.name);
        dropdown.setValue(dashboards.some((item) => item.id === current) ? current : "");
        dropdown.onChange(change);
      });
    };

    addDashboardOptions(
      new Setting(contentEl).setName("☀ 晨间").setDesc("晨间首页或轻量的今日专注工作台。"),
      this.morningId,
      (value) => { this.morningId = value; },
    );
    addDashboardOptions(
      new Setting(contentEl).setName("⚡ 工作").setDesc("工作执行或项目管理工作台。"),
      this.workId,
      (value) => { this.workId = value; },
    );
    addDashboardOptions(
      new Setting(contentEl).setName("↻ 复盘").setDesc("每周复盘工作台。"),
      this.reviewId,
      (value) => { this.reviewId = value; },
    );

    const note = contentEl.createEl("p", { cls: "setting-item-description" });
    note.textContent = "需要新的布局时，先用现有“工作台管理”从今日专注、项目管理或每周复盘模板创建，再回来映射即可。";

    const actions = contentEl.createDiv("dashflow-modal-actions");
    const save = actions.createEl("button", { text: "保存", cls: "mod-cta" });
    save.addEventListener("click", async () => {
      const settings = this.plugin.data.settings;
      settings.quickCaptureTarget = this.captureTarget;
      settings.dailyCaptureHeading = this.dailyHeading;
      settings.contextMorningDashboardId = this.morningId;
      settings.contextWorkDashboardId = this.workId;
      settings.contextReviewDashboardId = this.reviewId;
      await this.plugin.savePluginData();
      this.plugin.refreshDashboardViews();
      new Notice("DashFlow: 极速工作流设置已保存");
      this.close();
    });
  }

  onClose(): void {
    this.contentEl.empty();
  }
}

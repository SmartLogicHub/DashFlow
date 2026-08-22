import { Modal, Notice, Setting } from "obsidian";
import type DashFlowPlugin from "../main";

export class MorningBriefingSettingsModal extends Modal {
  private enabled: boolean;
  private folder: string;
  private format: string;

  constructor(private readonly plugin: DashFlowPlugin) {
    super(plugin.app);
    const settings = plugin.data.settings;
    this.enabled = settings.aiMorningBriefingEnabled;
    this.folder = settings.dailyNoteFolder;
    this.format = settings.dailyNoteDateFormat;
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("dashflow-morning-settings-modal");
    contentEl.createEl("h2", { text: "AI 晨间简报" });
    contentEl.createEl("p", {
      text: "开启后，DashFlow 会在每天首次打开首页时读取昨日每日笔记，并把笔记正文发送到你配置的 AI Base URL 生成摘要。关闭时不会读取或发送每日笔记正文。",
    });
    contentEl.createEl("p", {
      text: "如果 Base URL 是 localhost / 127.0.0.1（例如 Ollama），请求只发送到本机；使用远程服务时请确认你接受其隐私政策。",
      cls: "setting-item-description",
    });

    new Setting(contentEl)
      .setName("允许读取昨日每日笔记")
      .setDesc("这是独立授权。仅开启“AI 规划”不会自动获得读取笔记正文的权限。")
      .addToggle((toggle) => toggle
        .setValue(this.enabled)
        .onChange((value) => { this.enabled = value; }));

    new Setting(contentEl)
      .setName("每日笔记文件夹")
      .setDesc("留空表示知识库根目录，例如：每日笔记")
      .addText((text) => text
      .setPlaceholder("每日笔记")
        .setValue(this.folder)
        .onChange((value) => { this.folder = value.trim(); }));

    new Setting(contentEl)
      .setName("每日笔记日期格式")
      .setDesc("支持 YYYY / MM / DD，例如 YYYY-MM-DD 或 YYYY/MM/DD。DashFlow 会自动补 .md。")
      .addText((text) => text
        .setPlaceholder("YYYY-MM-DD")
        .setValue(this.format)
        .onChange((value) => { this.format = value.trim(); }));

    const actions = contentEl.createDiv("dashflow-modal-actions");
    const clear = actions.createEl("button", { text: "清除今日缓存" });
    clear.addEventListener("click", async () => {
      await this.plugin.morningBriefing.clearCache();
      new Notice("DashFlow: 晨间简报缓存已清除");
    });
    const save = actions.createEl("button", { text: "保存", cls: "mod-cta" });
    save.addEventListener("click", async () => {
      this.plugin.data.settings.aiMorningBriefingEnabled = this.enabled;
      this.plugin.data.settings.dailyNoteFolder = this.folder;
      this.plugin.data.settings.dailyNoteDateFormat = this.format || "YYYY-MM-DD";
      await this.plugin.morningBriefing.clearCache();
      await this.plugin.savePluginData();
      this.plugin.refreshDashboardViews();
      new Notice(this.enabled ? "DashFlow: AI 晨间简报已启用" : "DashFlow: AI 晨间简报已关闭");
      this.close();
    });
  }

  onClose(): void {
    this.contentEl.empty();
  }
}

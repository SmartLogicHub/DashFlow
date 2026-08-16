import { Notice, PluginSettingTab, SecretComponent, Setting, type App } from "obsidian";
import type DashFlowPlugin from "../main";
import type { HomeTheme } from "../models";
import { HeroImagePickerModal } from "../ui/HeroImagePickerModal";

export class DashFlowSettingsTab extends PluginSettingTab {
  constructor(app: App, private readonly dashFlow: DashFlowPlugin) {
    super(app, dashFlow);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.addClass("dashflow-settings-page");

    const hero = containerEl.createDiv("dashflow-settings-hero");
    hero.createEl("h2", { text: "DashFlow 设置" });
    hero.createEl("p", {
      text: "把首页做成自己的 Personal OS；工作台继续承担高密度任务、项目和复盘。",
    });

    const appearance = this.panel(containerEl, "Personal OS · 外观", "Hero 默认使用主题渐变；也可以直接选择 Vault 里的本地图片，不请求网络资源。");
    const preview = appearance.createDiv("dashflow-home-theme-preview");
    preview.createEl("strong", { text: this.dashFlow.data.settings.homeHeroTitle || "我的成长" });
    preview.createEl("span", { text: this.dashFlow.data.settings.homeHeroSubtitle || "把输入变成理解，把理解变成行动。" });

    new Setting(appearance)
      .setName("主题")
      .setDesc("Alpine 冷蓝灰最接近风景型个人主页；Paper 更温暖，Midnight 更沉浸，Obsidian 完全跟随当前主题。")
      .addDropdown((dropdown) => dropdown
        .addOption("alpine", "Alpine · 冷蓝灰")
        .addOption("paper", "Paper · 暖纸张")
        .addOption("midnight", "Midnight · 深夜")
        .addOption("obsidian", "Obsidian · 跟随主题")
        .setValue(this.dashFlow.data.settings.homeTheme)
        .onChange(async (value) => {
          this.dashFlow.data.settings.homeTheme = value as HomeTheme;
          await this.dashFlow.savePluginData();
          this.dashFlow.refreshDashboardViews();
        }));

    new Setting(appearance)
      .setName("Hero 图片")
      .setDesc("推荐低饱和雪山、湖泊、森林、海岸或极简建筑。优先点“选择图片”从 Vault 中挑选；留空时使用主题渐变。")
      .addText((text) => text
        .setPlaceholder("Assets/hero/mountain.jpg")
        .setValue(this.dashFlow.data.settings.homeHeroImagePath)
        .onChange(async (value) => {
          this.dashFlow.data.settings.homeHeroImagePath = value.trim();
          await this.dashFlow.savePluginData();
          this.dashFlow.refreshDashboardViews();
        }))
      .addButton((button) => button
        .setButtonText("选择图片")
        .onClick(() => {
          new HeroImagePickerModal(this.dashFlow, async (path) => {
            this.dashFlow.data.settings.homeHeroImagePath = path;
            await this.dashFlow.savePluginData();
            this.dashFlow.refreshDashboardViews();
            this.display();
          }).open();
        }))
      .addExtraButton((button) => button
        .setIcon("rotate-ccw")
        .setTooltip("恢复主题渐变")
        .onClick(async () => {
          this.dashFlow.data.settings.homeHeroImagePath = "";
          await this.dashFlow.savePluginData();
          this.dashFlow.refreshDashboardViews();
          this.display();
        }));

    new Setting(appearance)
      .setName("Hero 标题")
      .setDesc("这是个人主页的主标题，不是技术版本信息。")
      .addText((text) => text
        .setPlaceholder("我的成长")
        .setValue(this.dashFlow.data.settings.homeHeroTitle)
        .onChange(async (value) => {
          this.dashFlow.data.settings.homeHeroTitle = value.trim() || "我的成长";
          await this.dashFlow.savePluginData();
          this.dashFlow.refreshDashboardViews();
        }));

    new Setting(appearance)
      .setName("Hero 副标题")
      .setDesc("一句简短的个人原则或当下阶段主题。")
      .addText((text) => text
        .setPlaceholder("把输入变成理解，把理解变成行动。")
        .setValue(this.dashFlow.data.settings.homeHeroSubtitle)
        .onChange(async (value) => {
          this.dashFlow.data.settings.homeHeroSubtitle = value.trim() || "把输入变成理解，把理解变成行动。";
          await this.dashFlow.savePluginData();
          this.dashFlow.refreshDashboardViews();
        }));

    new Setting(appearance)
      .setName("图片遮罩")
      .setDesc("图片越复杂，遮罩应该越高，保证标题在浅色和深色照片上都清晰。")
      .addSlider((slider) => slider
        .setLimits(20, 70, 1)
        .setDynamicTooltip()
        .setValue(this.dashFlow.data.settings.homeHeroOverlay)
        .onChange(async (value) => {
          this.dashFlow.data.settings.homeHeroOverlay = value;
          await this.dashFlow.savePluginData();
          this.dashFlow.refreshDashboardViews();
        }));

    const workflow = this.panel(containerEl, "工作流", "决定新内容保存到哪里；已有 Markdown 数据不会被移动。");
    new Setting(workflow)
      .setName("收集箱")
      .setDesc("快速新建但尚未整理的任务会进入这个文件。")
      .addText((text) => text
        .setPlaceholder("DashFlow/Inbox.md")
        .setValue(this.dashFlow.data.settings.inboxPath)
        .onChange(async (value) => {
          this.dashFlow.data.settings.inboxPath = value.trim() || "DashFlow/Inbox.md";
          await this.dashFlow.savePluginData();
        }));

    new Setting(workflow)
      .setName("项目文件夹")
      .setDesc("从 DashFlow 新建项目时，项目笔记会创建在这里。")
      .addText((text) => text
        .setPlaceholder("DashFlow/Projects")
        .setValue(this.dashFlow.data.settings.projectFolder)
        .onChange(async (value) => {
          this.dashFlow.data.settings.projectFolder = value.trim() || "DashFlow/Projects";
          await this.dashFlow.savePluginData();
        }));

    new Setting(workflow)
      .setName("习惯文件夹")
      .setDesc("从 DashFlow 新建习惯时，习惯笔记会创建在这里。")
      .addText((text) => text
        .setPlaceholder("DashFlow/Habits")
        .setValue(this.dashFlow.data.settings.habitFolder)
        .onChange(async (value) => {
          this.dashFlow.data.settings.habitFolder = value.trim() || "DashFlow/Habits";
          await this.dashFlow.savePluginData();
        }));

    const recognition = this.panel(containerEl, "识别规则", "只有你已经有自己的 Markdown 约定时才需要修改。");
    new Setting(recognition)
      .setName("项目类型")
      .setDesc("frontmatter 中用于识别项目的 type 值。")
      .addText((text) => text
        .setValue(this.dashFlow.data.settings.projectTypeValue)
        .onChange(async (value) => {
          this.dashFlow.data.settings.projectTypeValue = value.trim() || "project";
          await this.dashFlow.savePluginData();
          await this.dashFlow.vaultIndex.reindexAll();
        }));

    new Setting(recognition)
      .setName("习惯类型")
      .setDesc("frontmatter 中用于识别习惯的 type 值。")
      .addText((text) => text
        .setValue(this.dashFlow.data.settings.habitTypeValue)
        .onChange(async (value) => {
          this.dashFlow.data.settings.habitTypeValue = value.trim() || "habit";
          await this.dashFlow.savePluginData();
          await this.dashFlow.vaultIndex.reindexAll();
        }));

    const ai = this.panel(containerEl, "AI 日计划 · 可选", "只在你主动点击“AI 规划”时发送任务、项目和习惯摘要；不会发送笔记正文，也不会自动修改 Vault。");
    new Setting(ai)
      .setName("启用 AI 规划")
      .setDesc("关闭时 DashFlow 完全不会发起 AI 请求。")
      .addToggle((toggle) => toggle
        .setValue(this.dashFlow.data.settings.aiEnabled)
        .onChange(async (value) => {
          this.dashFlow.data.settings.aiEnabled = value;
          await this.dashFlow.savePluginData();
          this.dashFlow.refreshDashboardViews();
        }));

    new Setting(ai)
      .setName("API Base URL")
      .setDesc("默认使用 DeepSeek OpenAI-compatible API；也可以填写兼容 /chat/completions 的服务。")
      .addText((text) => text
        .setPlaceholder("https://api.deepseek.com")
        .setValue(this.dashFlow.data.settings.aiBaseUrl)
        .onChange(async (value) => {
          this.dashFlow.data.settings.aiBaseUrl = value.trim() || "https://api.deepseek.com";
          await this.dashFlow.savePluginData();
        }));

    new Setting(ai)
      .setName("模型")
      .setDesc("填写所用服务支持的模型名称。")
      .addText((text) => text
        .setPlaceholder("deepseek-v4-flash")
        .setValue(this.dashFlow.data.settings.aiModel)
        .onChange(async (value) => {
          this.dashFlow.data.settings.aiModel = value.trim() || "deepseek-v4-flash";
          await this.dashFlow.savePluginData();
        }));

    new Setting(ai)
      .setName("API Key")
      .setDesc("从 Obsidian Keychain 选择或创建密钥。DashFlow 的 data.json 只保存密钥名称，不保存 Key 本身。")
      .addComponent((el) => new SecretComponent(this.app, el)
        .setValue(this.dashFlow.data.settings.aiSecretId)
        .onChange(async (value) => {
          this.dashFlow.data.settings.aiSecretId = value;
          await this.dashFlow.savePluginData();
        }));

    new Setting(ai)
      .setName("连接测试")
      .setDesc("发送一个极小的测试请求，确认 Base URL、模型与 Key 可用。")
      .addButton((button) => button
        .setButtonText("测试连接")
        .onClick(async () => {
          button.setDisabled(true);
          button.setButtonText("测试中…");
          try {
            const response = await this.dashFlow.aiPlanning.testConnection();
            new Notice(`DashFlow AI 已连接${response ? ` · ${response.slice(0, 20)}` : ""}`);
          } catch {
            // AIPlanningService already surfaces the concrete error.
          } finally {
            button.setDisabled(false);
            button.setButtonText("测试连接");
          }
        }));

    const advanced = containerEl.createEl("details", { cls: "dashflow-settings-advanced" });
    advanced.createEl("summary", { text: "高级 · Markdown 数据格式" });
    const grid = advanced.createDiv("dashflow-settings-guide-grid");

    const projectCard = grid.createDiv("dashflow-settings-code-card");
    projectCard.createEl("h3", { text: "Project" });
    projectCard.createEl("pre", {
      text: "---\ntype: project\nproject_id: dashflow\nname: DashFlow\nstatus: active\ndeadline: 2026-09-30\nprogress_mode: tasks\n---",
    });
    projectCard.createEl("p", { text: "任务通过 #project/dashflow 关联；通常不需要手工编辑这些字段。" });

    const habitCard = grid.createDiv("dashflow-settings-code-card");
    habitCard.createEl("h3", { text: "Habit" });
    habitCard.createEl("pre", {
      text: "---\ntype: habit\nhabit_id: workout\nname: 每天运动\nstatus: active\nfrequency: daily\ntarget_days: 30\nhabit_log:\n  - 2026-08-15\n---",
    });
    habitCard.createEl("p", { text: "习惯定义与打卡日期都保存在 Markdown；Activity 只是派生统计。" });
  }

  private panel(parent: HTMLElement, title: string, description: string): HTMLElement {
    const panel = parent.createDiv("dashflow-settings-panel");
    const head = panel.createDiv("dashflow-settings-panel-head");
    head.createEl("strong", { text: title });
    head.createEl("span", { text: description });
    return panel;
  }
}

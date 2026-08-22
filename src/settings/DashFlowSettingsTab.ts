import { Notice, PluginSettingTab, SecretComponent, Setting, setIcon, type App } from "obsidian";
import { DEFAULT_SETTINGS } from "../constants";
import type DashFlowPlugin from "../main";
import type { HomeTheme } from "../models";
import { persistHomeTheme } from "../product/homeThemeSelection";
import { HERO_THEME_CHOICES } from "../product/heroThemes";
import { HeroImagePickerModal } from "../ui/HeroImagePickerModal";
import { TimedConfirmation } from "../ui/timedConfirmation";

const WEREAD_KEY_URL = "https://weread.qq.com/r/weread-skills";

export type SettingsSection = "appearance" | "workflow" | "integration" | "advanced";

export class DashFlowSettingsTab extends PluginSettingTab {
  private activeSection: SettingsSection = "appearance";

  constructor(app: App, private readonly dashFlow: DashFlowPlugin) {
    super(app, dashFlow);
  }

  private saveTimer: number | null = null;
  private reindexTimer: number | null = null;
  private themeSaving = false;
  private readonly recoveryConfirmation = new TimedConfirmation(5_000);

  private scheduleSave(): void {
    if (this.saveTimer !== null) window.clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => {
      this.saveTimer = null;
      void this.dashFlow.savePluginData();
    }, 300);
  }

  private scheduleReindex(): void {
    if (this.reindexTimer !== null) window.clearTimeout(this.reindexTimer);
    this.reindexTimer = window.setTimeout(() => {
      this.reindexTimer = null;
      void this.dashFlow.vaultIndex.reindexAll();
    }, 400);
  }

  hide(): void {
    if (this.saveTimer !== null) {
      window.clearTimeout(this.saveTimer);
      this.saveTimer = null;
      void this.dashFlow.savePluginData();
    }
    if (this.reindexTimer !== null) {
      window.clearTimeout(this.reindexTimer);
      this.reindexTimer = null;
      void this.dashFlow.vaultIndex.reindexAll();
    }
  }

  openSection(section: SettingsSection): void {
    this.activeSection = section;
    this.display();
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.addClass("dashflow-settings-page");

    const hero = containerEl.createDiv("dashflow-settings-hero");
    hero.createEl("h2", { text: "DashFlow 设置" });
    hero.createEl("p", {
      text: "主页负责个人节奏与长期状态；工作台负责任务、项目和时间执行。",
    });

    const nav = containerEl.createDiv("dashflow-settings-tabs");
    const content = containerEl.createDiv("dashflow-settings-tab-content");

    const sections: Array<{ id: SettingsSection; label: string; icon: string }> = [
      { id: "appearance", label: "外观", icon: "palette" },
      { id: "workflow", label: "工作流", icon: "settings-2" },
      { id: "integration", label: "AI 与集成", icon: "sparkles" },
      { id: "advanced", label: "高级", icon: "code-2" },
    ];

    const render = (): void => {
      content.empty();
      for (const button of nav.querySelectorAll<HTMLButtonElement>("button")) {
        button.classList.toggle("is-active", button.dataset.section === this.activeSection);
      }
      switch (this.activeSection) {
        case "appearance":
          this.renderAppearance(content);
          break;
        case "workflow":
          this.renderWorkflow(content);
          break;
        case "integration":
          this.renderIntegration(content);
          break;
        case "advanced":
          this.renderAdvanced(content);
          break;
      }
    };

    for (const section of sections) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "dashflow-settings-tab";
      button.dataset.section = section.id;
      const icon = document.createElement("span");
      setIcon(icon, section.icon);
      button.append(icon, document.createTextNode(section.label));
      button.addEventListener("click", () => {
        this.activeSection = section.id;
        render();
      });
      nav.appendChild(button);
    }

    render();
  }

  private renderAppearance(parent: HTMLElement): void {
    const appearance = this.panel(parent, "外观与首页", "默认场景经过低饱和与文字安全区筛选；也可以用知识库本地图片完全替换。");
    const preview = appearance.createDiv("dashflow-home-theme-preview");
    preview.createEl("strong", { text: this.dashFlow.data.settings.homeHeroTitle || "我的成长" });
    preview.createEl("span", { text: this.dashFlow.data.settings.homeHeroSubtitle || "把输入变成理解，把理解变成行动。" });

    this.renderThemePicker(appearance);

    new Setting(appearance)
      .setName("自己的头图")
      .setDesc("从知识库选择 JPG / PNG / WebP / AVIF / GIF。选择后优先使用本地图片；清除后恢复当前主题场景。")
      .addText((text) => text
        .setPlaceholder("Assets/hero/mountain.jpg")
        .setValue(this.dashFlow.data.settings.homeHeroImagePath)
        .onChange((value) => {
          this.dashFlow.data.settings.homeHeroImagePath = value.trim();
          this.scheduleSave();
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
        .setTooltip("恢复主题场景")
        .onClick(async () => {
          this.dashFlow.data.settings.homeHeroImagePath = "";
          await this.dashFlow.savePluginData();
          this.dashFlow.refreshDashboardViews();
          this.display();
        }));

    new Setting(appearance)
      .setName("头图标题")
      .setDesc("个人主页的主标题。建议短一些，例如“我的成长”或“建立我的系统”。")
      .addText((text) => text
        .setPlaceholder("我的成长")
        .setValue(this.dashFlow.data.settings.homeHeroTitle)
        .onChange((value) => {
          this.dashFlow.data.settings.homeHeroTitle = value.trim() || DEFAULT_SETTINGS.homeHeroTitle;
          this.scheduleSave();
          this.dashFlow.refreshDashboardViews();
        }));

    new Setting(appearance)
      .setName("头图副标题")
      .setDesc("一句简短的个人原则或当下阶段主题。")
      .addText((text) => text
        .setPlaceholder("把输入变成理解，把理解变成行动。")
        .setValue(this.dashFlow.data.settings.homeHeroSubtitle)
        .onChange((value) => {
          this.dashFlow.data.settings.homeHeroSubtitle = value.trim() || DEFAULT_SETTINGS.homeHeroSubtitle;
          this.scheduleSave();
          this.dashFlow.refreshDashboardViews();
        }));

    new Setting(appearance)
      .setName("图片遮罩")
      .setDesc("只控制文字区域的暗化程度。建议 24–42；照片复杂时再提高。")
      .addSlider((slider) => slider
        .setLimits(18, 62, 1)
        .setDynamicTooltip()
        .setValue(this.dashFlow.data.settings.homeHeroOverlay)
        .onChange((value) => {
          this.dashFlow.data.settings.homeHeroOverlay = value;
          this.scheduleSave();
          this.dashFlow.refreshDashboardViews();
        }));
  }

  private renderThemePicker(parent: HTMLElement): void {
    const picker = parent.createDiv("dashflow-theme-picker");
    picker.createEl("strong", { text: "主题场景" });
    picker.createEl("span", { text: "选择后会立即保存，并同步应用到今日与工作台。三张照片已随插件离线打包。" });

    const cards = picker.createDiv("dashflow-theme-cards");
    for (const choice of HERO_THEME_CHOICES) {
      const selected = choice.id === this.dashFlow.data.settings.homeTheme;
      const card = cards.createEl("button", {
        cls: `dashflow-theme-card${selected ? " is-selected" : ""}`,
        attr: { "aria-pressed": String(selected) },
      });
      card.type = "button";
      card.dataset.theme = choice.id;

      const artwork = card.createDiv("dashflow-theme-card-artwork");
      const previewUrl = this.dashFlow.presentationRuntime.themePreviewUrl(choice.id);
      if (previewUrl) artwork.style.backgroundImage = `url("${previewUrl.replace(/"/g, "%22")}")`;
      else artwork.addClass("is-obsidian");

      const copy = card.createDiv("dashflow-theme-card-copy");
      copy.createEl("strong", { text: choice.label });
      copy.createEl("span", { text: choice.description });
      const state = card.createEl("span", { cls: "dashflow-theme-card-state" });
      state.textContent = selected ? "当前主题" : "选择主题";

      card.addEventListener("click", () => void this.selectHomeTheme(choice.id));
    }
  }

  private async selectHomeTheme(theme: HomeTheme): Promise<void> {
    if (this.themeSaving || theme === this.dashFlow.data.settings.homeTheme) return;
    this.themeSaving = true;
    try {
      await persistHomeTheme(this.dashFlow.data.settings, theme, async () => {
        await this.dashFlow.savePluginData();
      });
      this.dashFlow.refreshDashboardViews();
      this.display();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      new Notice(`主题未能保存：${message}`);
      this.display();
    } finally {
      this.themeSaving = false;
    }
  }

  private renderWorkflow(parent: HTMLElement): void {
    const workflow = this.panel(parent, "工作流", "决定新内容保存到哪里；已有 Markdown 数据不会被移动。");
    new Setting(workflow)
      .setName("收集箱")
      .setDesc("快速新建但尚未整理的任务会进入这个文件。")
      .addText((text) => text
        .setPlaceholder("DashFlow/Inbox.md")
        .setValue(this.dashFlow.data.settings.inboxPath)
        .onChange((value) => {
          this.dashFlow.data.settings.inboxPath = value.trim() || DEFAULT_SETTINGS.inboxPath;
          this.scheduleSave();
        }));

    new Setting(workflow)
      .setName("项目文件夹")
      .setDesc("从 DashFlow 新建项目时，项目笔记会创建在这里。")
      .addText((text) => text
        .setPlaceholder("DashFlow/Projects")
        .setValue(this.dashFlow.data.settings.projectFolder)
        .onChange((value) => {
          this.dashFlow.data.settings.projectFolder = value.trim() || DEFAULT_SETTINGS.projectFolder;
          this.scheduleSave();
        }));

    new Setting(workflow)
      .setName("习惯文件夹")
      .setDesc("从 DashFlow 新建习惯时，习惯笔记会创建在这里。")
      .addText((text) => text
        .setPlaceholder("DashFlow/Habits")
        .setValue(this.dashFlow.data.settings.habitFolder)
        .onChange((value) => {
          this.dashFlow.data.settings.habitFolder = value.trim() || DEFAULT_SETTINGS.habitFolder;
          this.scheduleSave();
        }));

    const recognition = this.panel(parent, "识别规则", "只有你已经有自己的 Markdown 约定时才需要修改。");
    new Setting(recognition)
      .setName("项目类型")
      .setDesc("文档属性（frontmatter）中用于识别项目的 type 值。")
      .addText((text) => text
        .setValue(this.dashFlow.data.settings.projectTypeValue)
        .onChange((value) => {
          this.dashFlow.data.settings.projectTypeValue = value.trim() || DEFAULT_SETTINGS.projectTypeValue;
          this.scheduleSave();
          this.scheduleReindex();
        }));

    new Setting(recognition)
      .setName("习惯类型")
      .setDesc("文档属性（frontmatter）中用于识别习惯的 type 值。")
      .addText((text) => text
        .setValue(this.dashFlow.data.settings.habitTypeValue)
        .onChange((value) => {
          this.dashFlow.data.settings.habitTypeValue = value.trim() || DEFAULT_SETTINGS.habitTypeValue;
          this.scheduleSave();
          this.scheduleReindex();
        }));
  }

  private renderIntegration(parent: HTMLElement): void {
    const ai = this.panel(parent, "AI 日计划 · 可选", "只在你主动点击“AI 规划”时发送任务、项目和习惯摘要；不会发送笔记正文，也不会自动修改知识库。");
    new Setting(ai)
      .setName("启用 AI 规划")
      .setDesc("关闭时 DashFlow 完全不会发起 AI 请求。")
      .addToggle((toggle) => toggle
        .setValue(this.dashFlow.data.settings.aiEnabled)
        .onChange((value) => {
          this.dashFlow.data.settings.aiEnabled = value;
          this.scheduleSave();
          this.dashFlow.refreshDashboardViews();
        }));

    new Setting(ai)
      .setName("API Base URL")
      .setDesc("默认使用 DeepSeek OpenAI-compatible API；也可以填写兼容 /chat/completions 的服务。")
      .addText((text) => text
        .setPlaceholder("https://api.deepseek.com")
        .setValue(this.dashFlow.data.settings.aiBaseUrl)
        .onChange((value) => {
          this.dashFlow.data.settings.aiBaseUrl = value.trim() || DEFAULT_SETTINGS.aiBaseUrl;
          this.scheduleSave();
        }));

    new Setting(ai)
      .setName("模型")
      .setDesc("填写所用服务支持的模型名称。")
      .addText((text) => text
        .setPlaceholder("deepseek-v4-flash")
        .setValue(this.dashFlow.data.settings.aiModel)
        .onChange((value) => {
          this.dashFlow.data.settings.aiModel = value.trim() || DEFAULT_SETTINGS.aiModel;
          this.scheduleSave();
        }));

    new Setting(ai)
      .setName("API Key")
      .setDesc(this.dashFlow.aiCredentialStatus === "invalid"
        ? "此前保存的 AI Key 无法安全迁移，请在 Obsidian Keychain 中重新创建；data.json 不会保存明文。"
        : "从 Obsidian Keychain 选择或创建密钥；data.json 只保存密钥名称。")
      .addComponent((el) => new SecretComponent(this.app, el)
        .setValue(this.dashFlow.data.settings.aiSecretId)
        .onChange((value) => {
          this.dashFlow.data.settings.aiSecretId = value;
          this.dashFlow.aiCredentialStatus = value ? "configured" : "unconfigured";
          this.scheduleSave();
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

    const reading = this.panel(parent, "微信读书 · 可选", "只读取你授权账户中的笔记本和个人划线，用于首页每日摘录；不会伪造名言，也不使用 Cookie 抓取。");
    new Setting(reading)
      .setName("启用微信读书")
      .setDesc("关闭时 DashFlow 不会请求微信读书。")
      .addToggle((toggle) => toggle
        .setValue(this.dashFlow.data.settings.weReadEnabled)
        .onChange((value) => {
          this.dashFlow.data.settings.weReadEnabled = value;
          this.dashFlow.weRead.clearCache();
          this.scheduleSave();
          this.dashFlow.refreshDashboardViews();
        }));

    new Setting(reading)
      .setName("微信读书 API Key")
      .setDesc("先从微信读书官方页面获取 wrk-… API Key，再从 Obsidian Keychain 选择或创建密钥。data.json 只保存密钥名称。")
      .addComponent((el) => new SecretComponent(this.app, el)
        .setValue(this.dashFlow.data.settings.weReadSecretId)
        .onChange((value) => {
          this.dashFlow.data.settings.weReadSecretId = value;
          this.dashFlow.weRead.clearCache();
          this.scheduleSave();
          this.dashFlow.refreshDashboardViews();
        }))
      .addButton((button) => button
        .setButtonText("获取 API Key")
        .onClick(() => window.open(WEREAD_KEY_URL, "_blank", "noopener,noreferrer")));

    new Setting(reading)
      .setName("首页每日划线")
      .setDesc("连接后在首页显示你的真实划线、书名、作者、章节和阅读进度。没有数据时只显示真实空状态。")
      .addToggle((toggle) => toggle
        .setValue(this.dashFlow.data.settings.weReadShowOnHome)
        .onChange((value) => {
          this.dashFlow.data.settings.weReadShowOnHome = value;
          this.scheduleSave();
          this.dashFlow.refreshDashboardViews();
        }));

    new Setting(reading)
      .setName("连接测试")
      .setDesc("只读取一页笔记本概览，确认 API Key 与官方 Agent Gateway 可用。")
      .addButton((button) => button
        .setButtonText("测试连接")
        .onClick(async () => {
          button.setDisabled(true);
          button.setButtonText("测试中…");
          try {
            const result = await this.dashFlow.weRead.testConnection();
            this.dashFlow.data.settings.weReadEnabled = true;
            await this.dashFlow.savePluginData();
            this.dashFlow.refreshDashboardViews();
            new Notice(`微信读书已连接 · ${result.books} 本有笔记的书 · ${result.notes} 条笔记`);
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            new Notice(`微信读书：${message}`);
          } finally {
            button.setDisabled(false);
            button.setButtonText("测试连接");
          }
        }));
  }

  private renderAdvanced(parent: HTMLElement): void {
    const onboarding = this.panel(parent, "首次引导", "重新查看起始布局和工作流路径；已有自定义工作台不会被删除。");
    new Setting(onboarding)
      .setName("重新打开首次引导")
      .setDesc("用于重新确认收集箱、项目和习惯文件夹；手动打开不会覆盖已有工作台。")
      .addButton((button) => button
        .setButtonText("打开引导")
        .onClick(() => this.dashFlow.openOnboarding(true)));

    if (this.dashFlow.data.recoveryBackup) {
      const recovery = this.panel(
        parent,
        this.dashFlow.dataRecoveryRequired ? "数据恢复" : "升级恢复快照",
        this.dashFlow.dataRecoveryRequired
          ? "DashFlow 保留了原始快照，但不会覆盖损坏的数据；先导出或恢复，再决定是否重置。"
          : "最近一次升级前的配置快照会保留一份，凭据字段已做安全脱敏。",
      );
      const actions = recovery.createDiv("dashflow-settings-recovery-actions");
      const exportButton = actions.createEl("button", { text: "导出恢复快照" });
      exportButton.type = "button";
      exportButton.addEventListener("click", () => this.exportRecoveryBackup());
      const restoreButton = actions.createEl("button", { text: "写回恢复快照" });
      restoreButton.type = "button";
      restoreButton.addEventListener("click", async () => {
        await this.dashFlow.restoreRecoveryBackup();
      });
      const resetButton = actions.createEl("button", { text: "重置 DashFlow 配置" });
      resetButton.type = "button";
      resetButton.addClass("mod-warning");
      resetButton.addEventListener("click", async () => {
        if (!this.recoveryConfirmation.request("plugin-data-reset")) {
          resetButton.textContent = "再次点击确认重置";
          window.setTimeout(() => {
            if (resetButton.isConnected) resetButton.textContent = "重置 DashFlow 配置";
          }, 5_000);
          return;
        }
        await this.dashFlow.resetPluginDataForRecovery();
        this.display();
      });
    }

    const advanced = parent.createEl("details", { cls: "dashflow-settings-advanced", attr: { open: "open" } });
    advanced.createEl("summary", { text: "Markdown 数据格式" });
    const grid = advanced.createDiv("dashflow-settings-guide-grid");

    const projectCard = grid.createDiv("dashflow-settings-code-card");
    projectCard.createEl("h3", { text: "项目" });
    projectCard.createEl("pre", {
      text: "---\ntype: project\nproject_id: dashflow\nname: DashFlow\nstatus: active\ndeadline: 2026-09-30\nprogress_mode: tasks\n---",
    });
    projectCard.createEl("p", { text: "任务通过 #project/dashflow 关联；通常不需要手工编辑这些字段。" });

    const habitCard = grid.createDiv("dashflow-settings-code-card");
    habitCard.createEl("h3", { text: "习惯" });
    habitCard.createEl("pre", {
      text: "---\ntype: habit\nhabit_id: workout\nname: 每天运动\nstatus: active\nfrequency: daily\ntarget_days: 30\nhabit_log:\n  - 2026-08-15\n---",
    });
    habitCard.createEl("p", { text: "习惯定义与打卡日期都保存在 Markdown；活跃度只是派生统计。" });
  }

  private exportRecoveryBackup(): void {
    const json = this.dashFlow.getRecoveryBackupJson();
    if (!json) {
      new Notice("当前没有可导出的恢复快照。");
      return;
    }
    const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "dashflow-recovery-backup.json";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  private panel(parent: HTMLElement, title: string, description: string): HTMLElement {
    const panel = parent.createDiv("dashflow-settings-panel");
    const head = panel.createDiv("dashflow-settings-panel-head");
    head.createEl("strong", { text: title });
    head.createEl("span", { text: description });
    return panel;
  }
}

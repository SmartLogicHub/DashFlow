import { Modal, Notice } from "obsidian";
import type DashFlowPlugin from "../main";
import { createDashboardFromTemplate } from "../dashboard/dashboardTemplates";
import {
  completeOnboarding,
  ONBOARDING_TEMPLATES,
  type OnboardingTemplateId,
} from "../product/onboarding";

export class OnboardingModal extends Modal {
  private finished = false;

  constructor(
    private readonly plugin: DashFlowPlugin,
    private readonly onFinished: () => void,
    private readonly onDismissed: () => void,
  ) {
    super(plugin.app);
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("dashflow-onboarding-modal", "dashflow-editor-modal");

    const eyebrow = contentEl.createEl("div", { cls: "dashflow-onboarding-eyebrow", text: "DASHFLOW · 初次使用" });
    eyebrow.setAttr("aria-label", "DashFlow 初次使用");
    contentEl.createEl("h2", { text: "先把工作台调成你的节奏" });
    contentEl.createEl("p", {
      cls: "dashflow-onboarding-lead",
      text: "DashFlow 只读取并组织你的 Markdown，不会创建示例笔记，也不会移动已有文件。先选一个起点，之后随时可以在设置中调整。",
    });

    const snapshot = this.plugin.vaultIndex.getSnapshot();
    const counts = contentEl.createDiv("dashflow-onboarding-counts");
    for (const item of [
      ["notes", "笔记", snapshot.notes],
      ["tasks", "任务", snapshot.tasks.length],
      ["projects", "项目", snapshot.projects.length],
      ["habits", "习惯", snapshot.habits.length],
    ] as const) {
      const card = counts.createDiv("dashflow-onboarding-count");
      card.createEl("strong", { text: String(item[2]) });
      card.createEl("span", { text: item[1] });
    }

    const choices = contentEl.createDiv("dashflow-onboarding-choices");
    choices.createEl("h3", { text: "选择一个起始布局" });
    let selected: OnboardingTemplateId = "daily-focus";
    const choiceButtons: HTMLButtonElement[] = [];
    for (const template of ONBOARDING_TEMPLATES) {
      const button = choices.createEl("button", { cls: "dashflow-onboarding-choice", attr: { type: "button", "aria-pressed": String(template.id === selected) } });
      button.createEl("span", { cls: "dashflow-onboarding-choice-icon", text: template.icon });
      const copy = button.createDiv("dashflow-onboarding-choice-copy");
      copy.createEl("strong", { text: template.name });
      copy.createEl("span", { text: template.description });
      button.addEventListener("click", () => {
        selected = template.id;
        for (const other of choiceButtons) other.setAttr("aria-pressed", String(other === button));
      });
      choiceButtons.push(button);
    }

    const paths = contentEl.createDiv("dashflow-onboarding-paths");
    paths.createEl("h3", { text: "确认工作流位置" });
    const inbox = this.pathSetting(paths, "收集箱", this.plugin.data.settings.inboxPath, "DashFlow/Inbox.md");
    const projects = this.pathSetting(paths, "项目文件夹", this.plugin.data.settings.projectFolder, "DashFlow/Projects");
    const habits = this.pathSetting(paths, "习惯文件夹", this.plugin.data.settings.habitFolder, "DashFlow/Habits");

    const actions = contentEl.createDiv("dashflow-onboarding-actions");
    const skip = actions.createEl("button", { text: "稍后设置", cls: "mod-ghost", attr: { type: "button" } });
    skip.addEventListener("click", () => void this.finish(true, selected, inbox.value, projects.value, habits.value));
    const start = actions.createEl("button", { text: "开始使用", cls: "mod-cta", attr: { type: "button" } });
    start.addEventListener("click", () => void this.finish(false, selected, inbox.value, projects.value, habits.value));
  }

  onClose(): void {
    this.contentEl.empty();
    if (!this.finished) this.onDismissed();
  }

  private pathSetting(parent: HTMLElement, label: string, value: string, placeholder: string): HTMLInputElement {
    const field = parent.createDiv("dashflow-onboarding-path");
    field.createEl("label", { text: label });
    const input = field.createEl("input", { type: "text", value, placeholder });
    return input;
  }

  private async finish(
    skipped: boolean,
    templateId: OnboardingTemplateId,
    inboxPath: string,
    projectFolder: string,
    habitFolder: string,
  ): Promise<void> {
    if (skipped) {
      this.plugin.data.onboardingCompleted = true;
    } else {
      const dashboard = createDashboardFromTemplate(this.plugin.widgetRegistry, templateId, Date.now());
      this.plugin.data = completeOnboarding(this.plugin.data, dashboard, {
        templateId,
        inboxPath,
        projectFolder,
        habitFolder,
      });
    }
    await this.plugin.savePluginData();
    this.finished = true;
    this.close();
    new Notice(skipped ? "DashFlow 已准备好，之后可在设置中重新打开首次引导。" : "DashFlow 工作台已准备好。" );
    this.onFinished();
  }
}

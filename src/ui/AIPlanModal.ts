import { Modal, Notice, setIcon } from "obsidian";
import type DashFlowPlugin from "../main";

export class AIPlanModal extends Modal {
  private result = "";
  private requestToken = 0;

  constructor(private readonly plugin: DashFlowPlugin) {
    super(plugin.app);
  }

  onOpen(): void {
    void this.renderPlan();
  }

  onClose(): void {
    this.requestToken += 1;
    this.contentEl.empty();
  }

  private async renderPlan(): Promise<void> {
    const token = ++this.requestToken;
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("dashflow-ai-plan", "dashflow-editor-modal");

    const eyebrow = contentEl.createDiv({ cls: "dashflow-modal-eyebrow", text: "AI · DAILY PLAN" });
    eyebrow.setAttr("aria-hidden", "true");
    contentEl.createEl("h2", { text: "今天怎么推进？" });
    contentEl.createEl("p", {
      cls: "setting-item-description dashflow-modal-lead",
      text: "只会发送当前任务、活动项目和习惯的摘要；不会发送笔记正文。AI 建议不会自动修改 Vault。",
    });

    const state = contentEl.createDiv("dashflow-ai-plan-state");
    const spinner = state.createDiv("dashflow-ai-plan-spinner");
    setIcon(spinner, "sparkles");
    state.createSpan({ text: "正在整理今天的重点…" });

    try {
      const plan = await this.plugin.aiPlanning.planToday();
      if (token !== this.requestToken) return;
      this.result = plan;
      state.remove();
      const output = contentEl.createDiv("dashflow-ai-plan-output");
      output.setText(this.result);

      const actions = contentEl.createDiv("dashflow-ai-plan-actions");
      const retry = actions.createEl("button", { text: "重新生成", attr: { type: "button" } });
      retry.addEventListener("click", () => void this.renderPlan());
      const copy = actions.createEl("button", { text: "复制", attr: { type: "button" } });
      copy.addEventListener("click", async () => {
        await navigator.clipboard.writeText(this.result);
        new Notice("DashFlow: AI 计划已复制");
      });
      const close = actions.createEl("button", { text: "关闭", cls: "mod-cta", attr: { type: "button" } });
      close.addEventListener("click", () => this.close());
    } catch (error) {
      if (token !== this.requestToken) return;
      state.empty();
      setIcon(state.createDiv("dashflow-ai-plan-spinner"), "triangle-alert");
      state.createSpan({ text: error instanceof Error ? error.message : "AI 规划失败，请检查设置。" });
      const actions = contentEl.createDiv("dashflow-ai-plan-actions");
      const retry = actions.createEl("button", { text: "重试", attr: { type: "button" } });
      retry.addEventListener("click", () => void this.renderPlan());
      const close = actions.createEl("button", { text: "关闭", attr: { type: "button" } });
      close.addEventListener("click", () => this.close());
    }
  }
}

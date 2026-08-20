import { Modal, setIcon } from "obsidian";
import type DashFlowPlugin from "../main";
import { HabitEditorModal } from "./HabitEditorModal";
import { ProjectEditorModal } from "./ProjectEditorModal";
import { TaskEditorModal } from "./TaskEditorModal";
import { WorkflowSettingsModal } from "./WorkflowSettingsModal";

export class QuickAddModal extends Modal {
  constructor(private readonly plugin: DashFlowPlugin) {
    super(plugin.app);
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("dashflow-quick-add-modal", "dashflow-editor-modal");

    const eyebrow = contentEl.createDiv("dashflow-modal-eyebrow dashflow-quick-add-eyebrow");
    eyebrow.setText("QUICK CAPTURE");
    contentEl.createEl("h2", { text: "快速记录" });
    contentEl.createEl("p", {
      cls: "dashflow-modal-lead dashflow-quick-add-lead",
      text: "先记下来，再整理。输入一句话按 Enter 会按捕捉设置保存；写入 Daily Note 时 #标签 与 [[双链]] 会原样保留。",
    });

    const composer = contentEl.createDiv("dashflow-quick-add-composer");
    const mark = composer.createSpan("dashflow-quick-add-icon");
    setIcon(mark, "plus");
    const input = composer.createEl("input", {
      type: "text",
      placeholder: "例如：研究 #AI [[DashFlow 0.5]]…",
    });
    const hint = composer.createSpan("dashflow-quick-add-hint");
    hint.setText("ENTER");

    const target = contentEl.createDiv("dashflow-quick-add-target");
    const targetLabel = target.createSpan();
    targetLabel.textContent = this.captureTargetLabel();
    const configure = target.createEl("button", { text: "配置" });
    configure.type = "button";
    configure.addEventListener("click", () => {
      this.close();
      new WorkflowSettingsModal(this.plugin).open();
    });

    const capture = async (): Promise<void> => {
      const text = input.value.trim();
      if (!text) return;
      const ok = await this.plugin.captureService.capture(text);
      if (ok) this.close();
    };
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        void capture();
      }
    });

    const actions = contentEl.createDiv("dashflow-quick-add-actions");
    actions.append(
      this.actionButton("circle-check-big", "详细任务", "日期、优先级与项目", () => {
        const text = input.value.trim();
        this.close();
        new TaskEditorModal(this.plugin, undefined, text ? { text } : {}).open();
      }),
      this.actionButton("folder-plus", "新建项目", "建立一个长期目标", () => {
        this.close();
        new ProjectEditorModal(this.plugin).open();
      }),
      this.actionButton("repeat-2", "习惯 / 日更", "习惯或长期任务每日推进", () => {
        this.close();
        new HabitEditorModal(this.plugin).open();
      }),
    );

    window.setTimeout(() => input.focus(), 0);
  }

  onClose(): void {
    this.contentEl.empty();
  }

  private captureTargetLabel(): string {
    const target = this.plugin.data.settings.quickCaptureTarget;
    if (target === "daily-note") return "目标：今天的 Daily Note";
    if (target === "ask") return "目标：每次询问";
    return "目标：DashFlow Inbox";
  }

  private actionButton(iconName: string, title: string, description: string, action: () => void): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "dashflow-quick-add-action";
    const icon = document.createElement("span");
    icon.className = "dashflow-quick-add-action-icon";
    setIcon(icon, iconName);
    const copy = document.createElement("span");
    const strong = document.createElement("strong");
    strong.textContent = title;
    const small = document.createElement("small");
    small.textContent = description;
    copy.append(strong, small);
    button.append(icon, copy);
    button.addEventListener("click", action);
    return button;
  }
}

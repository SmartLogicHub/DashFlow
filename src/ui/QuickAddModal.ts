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
    eyebrow.setText("捕捉");
    contentEl.createEl("h2", { text: "快速记录" });
    contentEl.createEl("p", {
      cls: "dashflow-modal-lead dashflow-quick-add-lead",
      text: "输入一句话直接保存，按回车也可以；写入每日笔记时 #标签 与 [[双链]] 会原样保留。",
    });

    const composer = contentEl.createDiv("dashflow-quick-add-composer");
    const mark = composer.createSpan("dashflow-quick-add-icon");
    setIcon(mark, "plus");
    const input = composer.createEl("input", {
      type: "text",
      placeholder: "例如：研究 #AI [[DashFlow 0.5]]…",
    });
    const submit = composer.createEl("button", {
      cls: "dashflow-quick-add-submit mod-cta",
      text: "保存",
    });
    submit.type = "button";
    submit.disabled = true;

    const target = contentEl.createDiv("dashflow-quick-add-target");
    const targetLabel = target.createSpan("dashflow-quick-add-target-copy");
    targetLabel.textContent = this.captureTargetLabel();
    const configure = target.createEl("button", {
      cls: "dashflow-quick-add-target-action",
      text: "更改目标",
    });
    configure.type = "button";
    const configureIcon = document.createElement("span");
    configureIcon.className = "dashflow-quick-add-target-icon";
    setIcon(configureIcon, "settings-2");
    configure.prepend(configureIcon);
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
    input.addEventListener("input", () => {
      submit.disabled = !input.value.trim();
    });
    submit.addEventListener("click", () => void capture());
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        void capture();
      }
    });

    contentEl.createDiv({ cls: "dashflow-quick-add-section-label", text: "更多创建方式" });
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
    if (target === "daily-note") return "目标：今天的每日笔记";
    if (target === "ask") return "目标：每次询问";
    return "目标：DashFlow 收集箱";
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

import { Modal, setIcon } from "obsidian";
import type DashFlowPlugin from "../main";
import { HabitEditorModal } from "./HabitEditorModal";
import { ProjectEditorModal } from "./ProjectEditorModal";
import { TaskEditorModal } from "./TaskEditorModal";

export class QuickAddModal extends Modal {
  constructor(private readonly plugin: DashFlowPlugin) {
    super(plugin.app);
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("dashflow-quick-add-modal");

    const eyebrow = contentEl.createDiv("dashflow-quick-add-eyebrow");
    eyebrow.setText("QUICK ADD");
    contentEl.createEl("h2", { text: "先记下来，再整理。" });
    contentEl.createEl("p", {
      cls: "dashflow-quick-add-lead",
      text: "直接输入一句话按 Enter 会进入收集箱；需要日期、项目或优先级时再打开完整任务编辑器。",
    });

    const composer = contentEl.createDiv("dashflow-quick-add-composer");
    const mark = composer.createSpan("dashflow-quick-add-icon");
    setIcon(mark, "plus");
    const input = composer.createEl("input", {
      type: "text",
      placeholder: "例如：整理 DashFlow 首页视觉…",
    });
    const hint = composer.createSpan("dashflow-quick-add-hint");
    hint.setText("ENTER");

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
      this.actionButton("circle-check-big", "详细任务", "设置日期、优先级和项目", () => {
        const text = input.value.trim();
        this.close();
        new TaskEditorModal(this.plugin, undefined, text ? { text } : {}).open();
      }),
      this.actionButton("folder-plus", "新建项目", "建立一个长期目标", () => {
        this.close();
        new ProjectEditorModal(this.plugin).open();
      }),
      this.actionButton("repeat-2", "新建习惯", "建立一个长期节奏", () => {
        this.close();
        new HabitEditorModal(this.plugin).open();
      }),
    );

    window.setTimeout(() => input.focus(), 0);
  }

  onClose(): void {
    this.contentEl.empty();
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

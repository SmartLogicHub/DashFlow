import { Modal, setIcon, type App } from "obsidian";

export type ResolvedCaptureTarget = "inbox" | "daily-note";

export class CaptureDestinationModal extends Modal {
  private resolved = false;

  constructor(
    app: App,
    private readonly text: string,
    private readonly resolve: (target: ResolvedCaptureTarget | null) => void,
  ) {
    super(app);
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("dashflow-capture-destination-modal", "dashflow-editor-modal");
    contentEl.createDiv({ cls: "dashflow-modal-eyebrow", text: "快速捕捉" });
    contentEl.createEl("h2", { text: "保存到哪里？" });
    const preview = contentEl.createEl("p", { cls: "dashflow-modal-lead" });
    preview.textContent = this.text.length > 140 ? `${this.text.slice(0, 140)}…` : this.text;

    const options = contentEl.createDiv("dashflow-capture-destination-options");
    options.append(
      this.option("inbox", "inbox", "DashFlow 收集箱", "作为待整理任务写入收集箱"),
      this.option("daily-note", "notebook-pen", "今天的每日笔记", "作为普通笔记条目追加，保留 #标签 与 [[双链]]"),
    );
  }

  onClose(): void {
    this.contentEl.empty();
    if (!this.resolved) this.finish(null);
  }

  private option(target: ResolvedCaptureTarget, iconName: string, title: string, description: string): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "dashflow-capture-destination-option";
    const icon = document.createElement("span");
    setIcon(icon, iconName);
    const copy = document.createElement("span");
    const strong = document.createElement("strong");
    strong.textContent = title;
    const small = document.createElement("small");
    small.textContent = description;
    copy.append(strong, small);
    button.append(icon, copy);
    button.addEventListener("click", () => {
      this.finish(target);
      this.close();
    });
    return button;
  }

  private finish(target: ResolvedCaptureTarget | null): void {
    if (this.resolved) return;
    this.resolved = true;
    this.resolve(target);
  }

  static choose(app: App, text: string): Promise<ResolvedCaptureTarget | null> {
    return new Promise((resolve) => new CaptureDestinationModal(app, text, resolve).open());
  }
}

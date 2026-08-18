import { SuggestModal, TFile, setIcon } from "obsidian";
import type DashFlowPlugin from "../main";

const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "avif", "gif"]);

export class HeroImagePickerModal extends SuggestModal<TFile> {
  private cachedImages: TFile[] | null = null;

  constructor(
    private readonly plugin: DashFlowPlugin,
    private readonly onPick: (path: string) => void | Promise<void>,
  ) {
    super(plugin.app);
    this.setPlaceholder("搜索 Vault 中的 Hero 图片…");
    this.setInstructions([
      { command: "↵", purpose: "选择" },
      { command: "↑↓", purpose: "移动" },
      { command: "esc", purpose: "关闭" },
    ]);
  }

  getSuggestions(query: string): TFile[] {
    const normalized = query.trim().toLocaleLowerCase();
    return this.imageFiles()
      .filter((file) => !normalized || `${file.basename} ${file.path}`.toLocaleLowerCase().includes(normalized))
      .sort((a, b) => b.stat.mtime - a.stat.mtime)
      .slice(0, 80);
  }

  private imageFiles(): TFile[] {
    if (!this.cachedImages) {
      this.cachedImages = this.plugin.app.vault.getFiles()
        .filter((file) => IMAGE_EXTENSIONS.has(file.extension.toLocaleLowerCase()));
    }
    return this.cachedImages;
  }

  renderSuggestion(file: TFile, el: HTMLElement): void {
    el.addClass("dashflow-hero-image-suggestion");
    const icon = el.createDiv("dashflow-hero-image-suggestion-icon");
    setIcon(icon, "image");
    const copy = el.createDiv("dashflow-hero-image-suggestion-copy");
    copy.createEl("strong", { text: file.basename });
    copy.createEl("span", { text: file.path });
  }

  onChooseSuggestion(file: TFile): void {
    void this.onPick(file.path);
  }
}

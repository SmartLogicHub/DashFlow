import { Notice, TFile, normalizePath, type App } from "obsidian";
import type { ActivityService } from "./ActivityService";

export class CaptureService {
  constructor(
    private readonly app: App,
    private readonly getInboxPath: () => string,
    private readonly activity: ActivityService,
  ) {}

  async capture(text: string): Promise<boolean> {
    const trimmed = text.trim();
    if (!trimmed) return false;

    const path = normalizePath(this.getInboxPath());
    await this.ensureParentFolder(path);
    const existing = this.app.vault.getAbstractFileByPath(path);
    const line = `- [ ] ${trimmed}\n`;

    if (existing instanceof TFile) {
      await this.app.vault.process(existing, (content) => {
        const prefix = content.length > 0 && !content.endsWith("\n") ? "\n" : "";
        return `${content}${prefix}${line}`;
      });
    } else {
      await this.app.vault.create(path, `# Inbox\n\n${line}`);
    }

    this.activity.recordTaskCreated(trimmed, path);
    new Notice("已捕捉到 DashFlow Inbox");
    return true;
  }

  private async ensureParentFolder(path: string): Promise<void> {
    const parts = path.split("/");
    parts.pop();
    let current = "";
    for (const part of parts) {
      current = current ? `${current}/${part}` : part;
      if (!this.app.vault.getAbstractFileByPath(current)) {
        try {
          await this.app.vault.createFolder(current);
        } catch {
          // The folder may have been created concurrently.
        }
      }
    }
  }
}

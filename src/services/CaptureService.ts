import { Notice, TFile, normalizePath, type App } from "obsidian";
import type { CaptureTarget } from "../models";
import { CaptureDestinationModal, type ResolvedCaptureTarget } from "../ui/CaptureDestinationModal";
import { localDate } from "../utils/date";
import type { ActivityService } from "./ActivityService";
import type { DailyNoteService } from "./DailyNoteService";

export class CaptureService {
  constructor(
    private readonly app: App,
    private readonly getInboxPath: () => string,
    private readonly activity: ActivityService,
    private readonly dailyNotes: DailyNoteService,
    private readonly getCaptureTarget: () => CaptureTarget,
    private readonly getDailyCaptureHeading: () => string,
  ) {}

  async capture(text: string, target?: ResolvedCaptureTarget): Promise<boolean> {
    const trimmed = text.trim();
    if (!trimmed) return false;

    let resolved = target;
    if (!resolved) {
      const preference = this.getCaptureTarget();
      resolved = preference === "ask"
        ? await CaptureDestinationModal.choose(this.app, trimmed) ?? undefined
        : preference;
    }
    if (!resolved) return false;

    if (resolved === "daily-note") {
      const path = await this.dailyNotes.appendCapture(localDate(), trimmed, this.getDailyCaptureHeading());
      new Notice(`已捕捉到今日 Daily Note · ${path}`);
      return true;
    }

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

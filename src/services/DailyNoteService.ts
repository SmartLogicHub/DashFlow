import { TFile, normalizePath, type App } from "obsidian";

function two(value: number): string {
  return String(value).padStart(2, "0");
}

function formatDate(dateText: string, format: string): string {
  const date = new Date(`${dateText}T12:00:00`);
  return (format || "YYYY-MM-DD")
    .replace(/YYYY/g, String(date.getFullYear()))
    .replace(/MM/g, two(date.getMonth() + 1))
    .replace(/DD/g, two(date.getDate()));
}

function normalizeHeading(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^#{1,6}\s+/.test(trimmed) ? trimmed : `## ${trimmed}`;
}

function appendUnderHeading(content: string, heading: string, line: string): string {
  const normalized = normalizeHeading(heading);
  const body = content.replace(/\s+$/, "");
  if (!normalized) return `${body}${body ? "\n" : ""}${line}\n`;

  const lines = body.split("\n");
  const index = lines.findIndex((item) => item.trim() === normalized);
  if (index < 0) {
    const prefix = body ? `${body}\n\n` : "";
    return `${prefix}${normalized}\n\n${line}\n`;
  }

  const level = normalized.match(/^#+/)?.[0].length ?? 2;
  let insertAt = lines.length;
  for (let i = index + 1; i < lines.length; i += 1) {
    const match = lines[i]?.match(/^(#{1,6})\s+/);
    if (match && match[1]!.length <= level) {
      insertAt = i;
      break;
    }
  }
  while (insertAt > index + 1 && !lines[insertAt - 1]?.trim()) insertAt -= 1;
  lines.splice(insertAt, 0, line);
  return `${lines.join("\n")}\n`;
}

export class DailyNoteService {
  constructor(
    private readonly app: App,
    private readonly getFolder: () => string,
    private readonly getDateFormat: () => string,
  ) {}

  path(dateText: string): string {
    const folder = this.getFolder().trim().replace(/^\/+|\/+$/g, "");
    const formatted = formatDate(dateText, this.getDateFormat().trim() || "YYYY-MM-DD");
    const name = formatted.toLowerCase().endsWith(".md") ? formatted : `${formatted}.md`;
    return normalizePath(folder ? `${folder}/${name}` : name);
  }

  file(dateText: string): TFile | null {
    const file = this.app.vault.getAbstractFileByPath(this.path(dateText));
    return file instanceof TFile ? file : null;
  }

  async read(dateText: string): Promise<{ file: TFile; content: string } | null> {
    const file = this.file(dateText);
    if (!file) return null;
    return { file, content: await this.app.vault.read(file) };
  }

  async appendCapture(dateText: string, text: string, heading: string): Promise<string> {
    const trimmed = text.trim();
    if (!trimmed) return this.path(dateText);
    const path = this.path(dateText);
    await this.ensureParentFolder(path);
    const line = `- ${trimmed}`;
    const existing = this.app.vault.getAbstractFileByPath(path);
    if (existing instanceof TFile) {
      await this.app.vault.process(existing, (content) => appendUnderHeading(content, heading, line));
    } else {
      const normalizedHeading = normalizeHeading(heading);
      const headingBlock = normalizedHeading ? `\n${normalizedHeading}\n\n` : "\n";
      await this.app.vault.create(path, `# ${dateText}\n${headingBlock}${line}\n`);
    }
    return path;
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

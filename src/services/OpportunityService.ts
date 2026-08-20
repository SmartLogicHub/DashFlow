import { Notice, TFile, normalizePath, parseYaml, type App } from "obsidian";

export interface OpportunityItem {
  id: string;
  title: string;
  status: string;
  tags: string[];
  notes: string;
  link: string;
  starred: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface OpportunityStage {
  id: string;
  label: string;
  color: string;
}

export const OPPORTUNITY_STAGES: OpportunityStage[] = [
  { id: "inbox", label: "收集箱", color: "#8a8578" },
  { id: "eval", label: "评估中", color: "#378ADD" },
  { id: "doing", label: "进行中", color: "#185FA5" },
  { id: "done", label: "已完成", color: "#639922" },
  { id: "dropped", label: "已放弃", color: "#E24B4A" },
];

const DEFAULT_FILE = "DashFlow/Inbox Board.md";

function localDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function toFm(item: OpportunityItem): Record<string, unknown> {
  return {
    id: item.id,
    title: item.title,
    status: item.status,
    tags: item.tags,
    notes: item.notes,
    link: item.link,
    starred: item.starred,
    order: item.order,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function fromFm(raw: Record<string, unknown>, fallbackId: string): OpportunityItem {
  const str = (value: unknown): string => (typeof value === "string" ? value : "");
  return {
    id: typeof raw.id === "string" ? raw.id : fallbackId,
    title: str(raw.title),
    status: str(raw.status) || "inbox",
    tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
    notes: str(raw.notes),
    link: str(raw.link),
    starred: raw.starred === true,
    order: typeof raw.order === "number" ? raw.order : 0,
    createdAt: str(raw.createdAt),
    updatedAt: str(raw.updatedAt),
  };
}

/**
 * 灵感收集看板的数据层。所有条目统一存于单个 Markdown 文件的 frontmatter
 * `opportunities` 数组里，不占独立文件、不进数据库，遵循「Markdown 为真相」。
 */
export class OpportunityService {
  constructor(private readonly app: App) {}

  async list(filePath: string): Promise<OpportunityItem[]> {
    const file = await this.ensureFile(filePath);
    const frontmatter = this.readFrontmatter(await this.app.vault.read(file));
    const raw = frontmatter?.opportunities;
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
      .map((item, index) => fromFm(item, `board-${index}`));
  }

  async create(filePath: string, title: string): Promise<OpportunityItem[]> {
    const name = title.trim();
    if (!name) {
      new Notice("DashFlow: 灵感标题不能为空。");
      return this.list(filePath);
    }
    const items = await this.list(filePath);
    const now = localDate();
    items.push({
      id: `board-${Date.now().toString(36)}`,
      title: name,
      status: "inbox",
      tags: [],
      notes: "",
      link: "",
      starred: false,
      order: items.length,
      createdAt: now,
      updatedAt: now,
    });
    return this.save(filePath, items);
  }

  async update(filePath: string, id: string, patch: Partial<OpportunityItem>): Promise<OpportunityItem[]> {
    const items = await this.list(filePath);
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) return items;
    const current = items[index];
    if (!current) return items;
    items[index] = { ...current, ...patch, id, updatedAt: localDate() } as OpportunityItem;
    return this.save(filePath, items);
  }

  async move(filePath: string, id: string, status: string): Promise<OpportunityItem[]> {
    return this.update(filePath, id, { status });
  }

  async toggleStar(filePath: string, id: string): Promise<OpportunityItem[]> {
    const items = await this.list(filePath);
    const item = items.find((entry) => entry.id === id);
    if (!item) return items;
    return this.update(filePath, id, { starred: !item.starred });
  }

  async remove(filePath: string, id: string): Promise<OpportunityItem[]> {
    const items = await this.list(filePath);
    return this.save(filePath, items.filter((item) => item.id !== id));
  }

  private async save(filePath: string, items: OpportunityItem[]): Promise<OpportunityItem[]> {
    const file = await this.ensureFile(filePath);
    await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
      frontmatter.opportunities = items.map(toFm);
    });
    return items;
  }

  private async ensureFile(filePath: string): Promise<TFile> {
    const path = normalizePath(filePath.trim() || DEFAULT_FILE);
    const existing = this.app.vault.getAbstractFileByPath(path);
    if (existing instanceof TFile) return existing;

    const parts = path.split("/").filter(Boolean);
    const fileName = parts.pop() ?? "Inbox Board.md";
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
    const full = normalizePath(current ? `${current}/${fileName}` : fileName);
    return await this.app.vault.create(full, "---\nopportunities: []\n---\n\n# 灵感收集\n");
  }

  private readFrontmatter(content: string): Record<string, unknown> | null {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match || !match[1]) return null;
    const parsed = parseYaml(match[1]);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : null;
  }
}

import { requestUrl } from "obsidian";
import type DashFlowPlugin from "../main";
import { localDate } from "../utils/date";

const WEREAD_GATEWAY = "https://i.weread.qq.com/api/agent/gateway";
const WEREAD_SKILL_VERSION = "1.0.4";
const CACHE_TTL_MS = 10 * 60 * 1000;

interface WeReadUpgradeInfo {
  message?: string;
}

interface WeReadGatewayBase {
  errcode?: number;
  errmsg?: string;
  upgrade_info?: WeReadUpgradeInfo;
}

interface WeReadBookInfo {
  bookId?: string;
  title?: string;
  author?: string;
  cover?: string;
  deepLink?: string;
}

interface WeReadNotebook {
  bookId?: string;
  book?: WeReadBookInfo;
  noteCount?: number;
  reviewCount?: number;
  bookmarkCount?: number;
  readingProgress?: number;
  sort?: number;
}

interface WeReadNotebooksResponse extends WeReadGatewayBase {
  totalBookCount?: number;
  totalNoteCount?: number;
  books?: WeReadNotebook[];
}

interface WeReadChapter {
  chapterUid?: number;
  chapterIdx?: number;
  title?: string;
}

interface WeReadBookmark {
  bookmarkId?: string;
  bookId?: string;
  chapterUid?: number;
  markText?: string;
  createTime?: number;
  type?: number;
  deepLink?: string;
}

interface WeReadBookmarksResponse extends WeReadGatewayBase {
  updated?: WeReadBookmark[];
  chapters?: WeReadChapter[];
  book?: WeReadBookInfo;
  deepLink?: string;
}

export interface WeReadHighlight {
  bookId: string;
  bookmarkId: string;
  title: string;
  author?: string;
  cover?: string;
  chapter?: string;
  text: string;
  createdAt?: number;
  readingProgress?: number;
  deepLink?: string;
}

interface HighlightCache {
  fetchedAt: number;
  bookIndex: number;
  highlightIndex: number;
  notebooks: WeReadNotebook[];
  highlights: WeReadHighlight[];
}

function positiveModulo(value: number, divisor: number): number {
  if (divisor <= 0) return 0;
  return ((value % divisor) + divisor) % divisor;
}

function daySeed(): number {
  return Number(localDate().replaceAll("-", ""));
}

export class WeReadService {
  private cache: HighlightCache | null = null;

  constructor(private readonly plugin: DashFlowPlugin) {}

  isConfigured(): boolean {
    const settings = this.plugin.data.settings;
    const secretId = settings.weReadSecretId.trim();
    return settings.weReadEnabled
      && Boolean(secretId)
      && Boolean(this.plugin.app.secretStorage.getSecret(secretId));
  }

  clearCache(): void {
    this.cache = null;
  }

  async testConnection(): Promise<{ books: number; notes: number }> {
    const data = await this.call<WeReadNotebooksResponse>("/user/notebooks", { count: 1 });
    return {
      books: Number(data.totalBookCount ?? 0),
      notes: Number(data.totalNoteCount ?? 0),
    };
  }

  async getHighlight(next = false): Promise<WeReadHighlight | null> {
    if (!this.isConfigured()) return null;

    const now = Date.now();
    if (!this.cache || now - this.cache.fetchedAt > CACHE_TTL_MS) {
      await this.reloadCache();
    }
    if (!this.cache || this.cache.notebooks.length === 0) return null;

    if (next && this.cache.highlights.length > 0) {
      this.cache.highlightIndex += 1;
      if (this.cache.highlightIndex >= this.cache.highlights.length) {
        this.cache.bookIndex = (this.cache.bookIndex + 1) % this.cache.notebooks.length;
        await this.loadBookHighlights(this.cache.bookIndex);
      }
    }

    if (this.cache.highlights.length === 0) {
      const maxAttempts = Math.min(6, this.cache.notebooks.length);
      for (let attempt = 0; attempt < maxAttempts && this.cache.highlights.length === 0; attempt += 1) {
        this.cache.bookIndex = (this.cache.bookIndex + 1) % this.cache.notebooks.length;
        await this.loadBookHighlights(this.cache.bookIndex);
      }
    }

    if (this.cache.highlights.length === 0) return null;
    const index = positiveModulo(this.cache.highlightIndex, this.cache.highlights.length);
    return this.cache.highlights[index] ?? null;
  }

  private async reloadCache(): Promise<void> {
    const overview = await this.call<WeReadNotebooksResponse>("/user/notebooks", { count: 60 });
    const notebooks = (overview.books ?? [])
      .filter((entry) => Boolean(entry.bookId || entry.book?.bookId))
      .filter((entry) => Number(entry.noteCount ?? 0) > 0)
      .sort((a, b) => Number(b.sort ?? 0) - Number(a.sort ?? 0));

    if (notebooks.length === 0) {
      this.cache = {
        fetchedAt: Date.now(),
        bookIndex: 0,
        highlightIndex: 0,
        notebooks: [],
        highlights: [],
      };
      return;
    }

    const bookIndex = positiveModulo(daySeed(), notebooks.length);
    this.cache = {
      fetchedAt: Date.now(),
      bookIndex,
      highlightIndex: 0,
      notebooks,
      highlights: [],
    };
    await this.loadBookHighlights(bookIndex);
  }

  private async loadBookHighlights(bookIndex: number): Promise<void> {
    if (!this.cache) return;
    const notebook = this.cache.notebooks[bookIndex];
    if (!notebook) {
      this.cache.highlights = [];
      this.cache.highlightIndex = 0;
      return;
    }

    const bookId = String(notebook.bookId ?? notebook.book?.bookId ?? "").trim();
    if (!bookId) {
      this.cache.highlights = [];
      this.cache.highlightIndex = 0;
      return;
    }

    const response = await this.call<WeReadBookmarksResponse>("/book/bookmarklist", { bookId });
    const book = response.book ?? notebook.book ?? {};
    const chapterByUid = new Map<number, string>();
    for (const chapter of response.chapters ?? []) {
      if (typeof chapter.chapterUid === "number" && chapter.title) {
        chapterByUid.set(chapter.chapterUid, chapter.title);
      }
    }

    const highlights = (response.updated ?? [])
      .filter((bookmark) => bookmark.type === undefined || bookmark.type === 1)
      .filter((bookmark) => Boolean(bookmark.markText?.trim()))
      .map((bookmark): WeReadHighlight => ({
        bookId,
        bookmarkId: String(bookmark.bookmarkId ?? `${bookId}-${bookmark.createTime ?? 0}`),
        title: book.title?.trim() || notebook.book?.title?.trim() || "微信读书",
        author: book.author?.trim() || notebook.book?.author?.trim() || undefined,
        cover: book.cover?.trim() || notebook.book?.cover?.trim() || undefined,
        chapter: typeof bookmark.chapterUid === "number" ? chapterByUid.get(bookmark.chapterUid) : undefined,
        text: bookmark.markText!.trim(),
        createdAt: bookmark.createTime,
        readingProgress: notebook.readingProgress,
        deepLink: bookmark.deepLink?.trim() || book.deepLink?.trim() || response.deepLink?.trim() || undefined,
      }));

    this.cache.highlights = highlights;
    this.cache.highlightIndex = highlights.length === 0 ? 0 : positiveModulo(daySeed() + bookIndex, highlights.length);
    this.cache.bookIndex = bookIndex;
    this.cache.fetchedAt = Date.now();
  }

  private async call<T extends WeReadGatewayBase>(apiName: string, params: Record<string, unknown>): Promise<T> {
    const secretId = this.plugin.data.settings.weReadSecretId.trim();
    const apiKey = secretId ? this.plugin.app.secretStorage.getSecret(secretId) : null;
    if (!apiKey) throw new Error("没有可用的微信读书 API Key。请先在 DashFlow 设置中连接微信读书。");

    const response = await requestUrl({
      url: WEREAD_GATEWAY,
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_name: apiName,
        ...params,
        skill_version: WEREAD_SKILL_VERSION,
      }),
    });

    const data = response.json as T;
    if (data.upgrade_info) {
      throw new Error(data.upgrade_info.message || "微信读书 Agent API 需要升级，请更新 DashFlow 后重试。");
    }
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`微信读书连接失败 · HTTP ${response.status}`);
    }
    if (typeof data.errcode === "number" && data.errcode !== 0) {
      throw new Error(data.errmsg || `微信读书返回错误 ${data.errcode}`);
    }
    return data;
  }
}

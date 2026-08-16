import { setIcon } from "obsidian";
import type DashFlowPlugin from "../main";
import type { AINewsWidgetConfig, CuratedNewsItem, WidgetInstance } from "../models";
import type { NewsCurationResult } from "./NewsCurationService";

export class AINewsWidgetInteractionService {
  private unsubscribeDashboard: (() => void) | null = null;
  private unsubscribeIndex: (() => void) | null = null;
  private scheduled = false;

  constructor(private readonly plugin: DashFlowPlugin) {}

  start(): void {
    this.unsubscribeDashboard = this.plugin.dashboardManager.subscribe(() => this.schedule());
    this.unsubscribeIndex = this.plugin.vaultIndex.subscribe(() => this.schedule());
    this.plugin.registerEvent(this.plugin.app.workspace.on("layout-change", () => this.schedule()));
    this.plugin.registerEvent(this.plugin.app.workspace.on("active-leaf-change", () => this.schedule()));
    this.schedule();
  }

  stop(): void {
    this.unsubscribeDashboard?.();
    this.unsubscribeDashboard = null;
    this.unsubscribeIndex?.();
    this.unsubscribeIndex = null;
  }

  schedule(): void {
    if (this.scheduled) return;
    this.scheduled = true;
    window.setTimeout(() => {
      this.scheduled = false;
      this.decorate();
    }, 0);
  }

  private decorate(): void {
    const dashboard = this.plugin.dashboardManager.active();
    const widgets = new Map(dashboard.widgets.map((widget) => [widget.id, widget]));
    for (const card of document.querySelectorAll<HTMLElement>(".dashflow-widget[data-widget-id]")) {
      const id = card.dataset.widgetId;
      const widget = id ? widgets.get(id) : undefined;
      if (!widget || widget.type !== "ai-news") continue;
      const body = card.querySelector<HTMLElement>(".dashflow-widget-body");
      if (!body) continue;
      const signature = `${widget.id}:${JSON.stringify(widget.config)}`;
      if (body.dataset.dashflowAiNews === signature) continue;
      body.dataset.dashflowAiNews = signature;
      this.render(body, widget);
    }
  }

  private render(body: HTMLElement, widget: WidgetInstance): void {
    body.replaceChildren();
    const config = widget.config as AINewsWidgetConfig;
    const root = document.createElement("div");
    root.className = "dashflow-ai-news";
    const toolbar = document.createElement("div");
    toolbar.className = "dashflow-ai-news-toolbar";
    const kicker = document.createElement("div");
    kicker.className = "dashflow-ai-news-kicker";
    const label = document.createElement("span");
    label.textContent = `AI CURATED · ${Math.max(1, Number(config.refreshHours) || 4)}H CACHE`;
    kicker.appendChild(label);
    const refresh = document.createElement("button");
    refresh.type = "button";
    refresh.className = "dashflow-ai-news-refresh";
    refresh.title = "刷新 RSS";
    refresh.setAttribute("aria-label", "刷新 AI 新闻");
    setIcon(refresh, "refresh-cw");
    toolbar.append(kicker, refresh);
    const content = document.createElement("div");
    content.className = "dashflow-ai-news-list";
    content.appendChild(this.empty("正在读取 RSS 并筛选值得看的内容…"));
    root.append(toolbar, content);
    body.appendChild(root);

    const load = async (force: boolean): Promise<void> => {
      refresh.disabled = true;
      if (force) content.replaceChildren(this.empty("正在刷新信息源…"));
      try {
        const result = await this.plugin.newsCuration.curate(widget.id, config, force);
        if (!body.isConnected || body.dataset.dashflowAiNews !== `${widget.id}:${JSON.stringify(widget.config)}`) return;
        this.renderResult(content, result);
      } catch (error) {
        if (!body.isConnected) return;
        const message = error instanceof Error ? error.message : String(error);
        content.replaceChildren(this.empty(message));
      } finally {
        if (body.isConnected) refresh.disabled = false;
      }
    };

    refresh.addEventListener("click", () => void load(true));
    void load(false);
  }

  private renderResult(content: HTMLElement, result: NewsCurationResult): void {
    content.replaceChildren();
    if (result.items.length === 0) {
      content.appendChild(this.empty("当前没有可展示的 AI 筛选结果。"));
      return;
    }
    result.items.forEach((item, index) => content.appendChild(this.newsItem(item, index + 1)));
    const footer = document.createElement("div");
    footer.className = "dashflow-ai-news-warning";
    const stamp = new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit" }).format(new Date(result.fetchedAt));
    footer.textContent = result.warnings.length
      ? `${stamp} · 部分源异常 · ${result.warnings[0]}`
      : `${stamp} · ${result.reusedRanking ? "候选未变化，复用 AI 排名" : "AI 已重新筛选"}`;
    content.appendChild(footer);
  }

  private newsItem(item: CuratedNewsItem, rank: number): HTMLAnchorElement {
    const link = document.createElement("a");
    link.className = "dashflow-ai-news-item";
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    const badge = document.createElement("span");
    badge.className = "dashflow-ai-news-rank";
    badge.textContent = String(rank).padStart(2, "0");
    const main = document.createElement("span");
    main.className = "dashflow-ai-news-main";
    const title = document.createElement("span");
    title.className = "dashflow-ai-news-title";
    title.textContent = item.title;
    const reason = document.createElement("span");
    reason.className = "dashflow-ai-news-reason";
    reason.textContent = item.reason;
    const meta = document.createElement("span");
    meta.className = "dashflow-ai-news-meta";
    const source = document.createElement("span");
    source.textContent = item.source;
    const date = document.createElement("span");
    date.textContent = item.publishedAt ? this.shortDate(item.publishedAt) : "RSS";
    const score = document.createElement("span");
    score.className = "dashflow-ai-news-score";
    score.textContent = `${item.score}/100`;
    meta.append(source, date, score);
    main.append(title, reason, meta);
    link.append(badge, main);
    return link;
  }

  private shortDate(value: string): string {
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return "RSS";
    return new Intl.DateTimeFormat("zh-CN", { month: "2-digit", day: "2-digit" }).format(date);
  }

  private empty(text: string): HTMLElement {
    const node = document.createElement("div");
    node.className = "dashflow-ai-news-empty";
    node.textContent = text;
    return node;
  }
}

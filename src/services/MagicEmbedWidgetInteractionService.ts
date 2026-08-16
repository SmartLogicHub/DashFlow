import { setIcon } from "obsidian";
import type DashFlowPlugin from "../main";
import type { MagicEmbedWidgetConfig, WidgetInstance } from "../models";
import { magicEmbedSandbox, parseSafeEmbedUrl } from "../embed/safeEmbed";

export class MagicEmbedWidgetInteractionService {
  private unsubscribeDashboard: (() => void) | null = null;
  private scheduled = false;
  private readonly approvedThisSession = new Set<string>();

  constructor(private readonly plugin: DashFlowPlugin) {}

  start(): void {
    this.unsubscribeDashboard = this.plugin.dashboardManager.subscribe(() => this.schedule());
    this.plugin.registerEvent(this.plugin.app.workspace.on("layout-change", () => this.schedule()));
    this.plugin.registerEvent(this.plugin.app.workspace.on("active-leaf-change", () => this.schedule()));
    this.schedule();
  }

  stop(): void {
    this.unsubscribeDashboard?.();
    this.unsubscribeDashboard = null;
    this.approvedThisSession.clear();
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
      if (!widget || widget.type !== "magic-embed") continue;
      const body = card.querySelector<HTMLElement>(".dashflow-widget-body");
      if (!body) continue;
      const config = widget.config as Partial<MagicEmbedWidgetConfig>;
      const parsed = parseSafeEmbedUrl(String(config.url ?? ""));
      const approval = parsed ? this.approvalKey(widget.id, parsed.url) : "invalid";
      const signature = `${widget.id}:${approval}:${this.approvedThisSession.has(approval)}:${Boolean(config.allowForms)}`;
      if (body.dataset.dashflowMagicEmbed === signature) continue;
      body.dataset.dashflowMagicEmbed = signature;
      this.render(body, widget);
    }
  }

  private render(body: HTMLElement, widget: WidgetInstance): void {
    body.replaceChildren();
    const config = widget.config as Partial<MagicEmbedWidgetConfig>;
    const parsed = parseSafeEmbedUrl(String(config.url ?? ""));
    const root = document.createElement("div");
    root.className = "dashflow-magic-embed";

    if (!parsed) {
      root.appendChild(this.message(
        "配置一个 HTTPS URL。HTTP 只允许 localhost / 127.0.0.1；javascript:、data:、file: 等协议不会加载。",
      ));
      body.appendChild(root);
      return;
    }

    const key = this.approvalKey(widget.id, parsed.url);
    if (!this.approvedThisSession.has(key)) {
      const gate = document.createElement("div");
      gate.className = "dashflow-magic-embed-gate";
      const icon = document.createElement("div");
      icon.className = "dashflow-magic-embed-icon";
      setIcon(icon, "panels-top-left");
      const copy = document.createElement("div");
      copy.className = "dashflow-magic-embed-copy";
      const title = document.createElement("strong");
      title.textContent = parsed.hostname;
      const text = document.createElement("p");
      text.textContent = "嵌入内容尚未联网加载。点击后仅在本次 Obsidian 会话中授权这个 Widget URL。";
      copy.append(title, text);
      const load = document.createElement("button");
      load.type = "button";
      load.className = "dashflow-magic-embed-load";
      load.textContent = "加载嵌入内容";
      load.addEventListener("click", () => {
        this.approvedThisSession.add(key);
        body.dataset.dashflowMagicEmbed = "";
        this.render(body, widget);
      });
      const external = document.createElement("a");
      external.className = "dashflow-magic-embed-external";
      external.href = parsed.url;
      external.target = "_blank";
      external.rel = "noopener noreferrer";
      external.textContent = "在浏览器打开";
      gate.append(icon, copy, load, external);
      root.appendChild(gate);
      body.appendChild(root);
      return;
    }

    const frameWrap = document.createElement("div");
    frameWrap.className = "dashflow-magic-embed-frame-wrap";
    const toolbar = document.createElement("div");
    toolbar.className = "dashflow-magic-embed-toolbar";
    const origin = document.createElement("span");
    origin.textContent = parsed.origin;
    const unload = document.createElement("button");
    unload.type = "button";
    unload.textContent = "卸载";
    unload.addEventListener("click", () => {
      this.approvedThisSession.delete(key);
      body.dataset.dashflowMagicEmbed = "";
      this.render(body, widget);
    });
    toolbar.append(origin, unload);

    const iframe = document.createElement("iframe");
    iframe.className = "dashflow-magic-embed-frame";
    iframe.title = `DashFlow Magic Embed · ${parsed.hostname}`;
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer";
    iframe.setAttribute("sandbox", magicEmbedSandbox(config.allowForms === true));
    iframe.setAttribute("aria-label", `嵌入页面 ${parsed.hostname}`);
    iframe.src = parsed.url;
    frameWrap.append(toolbar, iframe);
    root.appendChild(frameWrap);
    body.appendChild(root);
  }

  private message(text: string): HTMLElement {
    const node = document.createElement("div");
    node.className = "dashflow-magic-embed-message";
    node.textContent = text;
    return node;
  }

  private approvalKey(widgetId: string, url: string): string {
    return `${widgetId}|${url}`;
  }
}

import { setIcon } from "obsidian";
import type DashFlowPlugin from "../main";
import type { MagicEmbedWidgetConfig, WidgetInstance } from "../models";
import { magicEmbedSandbox, parseSafeEmbedUrl } from "../embed/safeEmbed";
import { DASHFLOW_CONFIGURE_WIDGET_EVENT } from "../dashboard/widgetConfigRequest";

export class MagicEmbedWidgetInteractionService {
  private unsubscribeRender: (() => void) | null = null;
  private readonly approvedThisSession = new Set<string>();

  constructor(private readonly plugin: DashFlowPlugin) {}

  start(): void {
    this.unsubscribeRender = this.plugin.dashboardRender.subscribe(({ root }) => this.decorate(root));
    this.plugin.dashboardRender.forEachRoot((root) => this.decorate(root));
  }

  stop(): void {
    this.unsubscribeRender?.();
    this.unsubscribeRender = null;
    this.approvedThisSession.clear();
  }

  private decorate(root: HTMLElement): void {
    const dashboard = this.plugin.dashboardManager.active();
    const widgets = new Map(dashboard.widgets.map((widget) => [widget.id, widget]));
    for (const card of root.querySelectorAll<HTMLElement>(".dashflow-widget[data-widget-id]")) {
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
      root.appendChild(this.emptyState(widget.id, String(config.url ?? "").trim()));
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
      text.textContent = "嵌入内容尚未联网加载。点击后仅在本次 Obsidian 会话中授权这张卡片；网站可能禁止被嵌入。";
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
    const external = document.createElement("a");
    external.className = "dashflow-magic-embed-external is-toolbar";
    external.href = parsed.url;
    external.target = "_blank";
    external.rel = "noopener noreferrer";
    external.textContent = "在浏览器打开";
    const unload = document.createElement("button");
    unload.type = "button";
    unload.textContent = "卸载";
    unload.addEventListener("click", () => {
      this.approvedThisSession.delete(key);
      body.dataset.dashflowMagicEmbed = "";
      this.render(body, widget);
    });
    toolbar.append(origin, external, unload);

    const iframe = document.createElement("iframe");
    iframe.className = "dashflow-magic-embed-frame";
    iframe.title = `DashFlow 网页嵌入 · ${parsed.hostname}`;
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer";
    iframe.setAttribute("sandbox", magicEmbedSandbox(config.allowForms === true));
    iframe.setAttribute("aria-label", `嵌入页面 ${parsed.hostname}`);
    iframe.addEventListener("error", () => {
      const error = this.message("网页加载失败。网站可能禁止被嵌入，请改为在浏览器打开。");
      error.classList.add("is-error");
      iframe.replaceWith(error);
    });
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

  private emptyState(widgetId: string, rawUrl: string): HTMLElement {
    const node = document.createElement("div");
    node.className = "dashflow-magic-embed-message dashflow-magic-embed-empty";
    const icon = document.createElement("span");
    icon.className = "dashflow-magic-embed-icon";
    setIcon(icon, rawUrl ? "shield-alert" : "panels-top-left");
    const title = document.createElement("strong");
    title.textContent = rawUrl ? "嵌入地址不受支持" : "尚未配置嵌入地址";
    const description = document.createElement("p");
    description.textContent = rawUrl
      ? "远程网页必须使用 HTTPS；本地网页可使用 localhost 或 127.0.0.1 的 HTTP。"
      : "添加一个 HTTPS 网页地址；本地服务也可以使用 localhost 或 127.0.0.1。";
    const configure = document.createElement("button");
    configure.type = "button";
    configure.className = "dashflow-magic-embed-configure";
    configure.textContent = "配置嵌入地址";
    configure.addEventListener("click", () => {
      configure.dispatchEvent(new CustomEvent(DASHFLOW_CONFIGURE_WIDGET_EVENT, {
        bubbles: true,
        detail: { widgetId },
      }));
    });
    node.append(icon, title, description, configure);
    return node;
  }

  private approvalKey(widgetId: string, url: string): string {
    return `${widgetId}|${url}`;
  }
}

import { setIcon } from "obsidian";
import type DashFlowPlugin from "../main";
import type { ContextMode } from "../models";
import { WorkflowSettingsModal } from "../ui/WorkflowSettingsModal";

interface ContextDefinition {
  mode: ContextMode;
  label: string;
  icon: string;
  setting: "contextMorningDashboardId" | "contextWorkDashboardId" | "contextReviewDashboardId";
}

const CONTEXTS: ContextDefinition[] = [
  { mode: "morning", label: "Morning", icon: "sunrise", setting: "contextMorningDashboardId" },
  { mode: "work", label: "Work", icon: "zap", setting: "contextWorkDashboardId" },
  { mode: "review", label: "Review", icon: "refresh-cw", setting: "contextReviewDashboardId" },
];

export class ContextSwitcherService {
  private unsubscribeDashboard: (() => void) | null = null;
  private unsubscribeIndex: (() => void) | null = null;
  private scheduled = false;

  constructor(private readonly plugin: DashFlowPlugin) {}

  start(): void {
    this.unsubscribeDashboard = this.plugin.dashboardManager.subscribe(() => this.scheduleDecorate());
    this.unsubscribeIndex = this.plugin.vaultIndex.subscribe(() => this.scheduleDecorate());
    this.plugin.registerEvent(this.plugin.app.workspace.on("layout-change", () => this.scheduleDecorate()));
    this.plugin.registerEvent(this.plugin.app.workspace.on("active-leaf-change", () => this.scheduleDecorate()));
    this.scheduleDecorate();
  }

  stop(): void {
    this.unsubscribeDashboard?.();
    this.unsubscribeDashboard = null;
    this.unsubscribeIndex?.();
    this.unsubscribeIndex = null;
    for (const node of document.querySelectorAll(".dashflow-context-switcher")) node.remove();
  }

  scheduleDecorate(): void {
    if (this.scheduled) return;
    this.scheduled = true;
    window.setTimeout(() => {
      this.scheduled = false;
      this.decorate();
    }, 0);
  }

  private decorate(): void {
    for (const shell of document.querySelectorAll<HTMLElement>(".dashflow-shell")) {
      this.decorateShell(shell);
    }
  }

  private decorateShell(shell: HTMLElement): void {
    const hero = shell.querySelector<HTMLElement>(".dashflow-hero");
    if (!hero) return;
    let switcher = shell.querySelector<HTMLElement>(".dashflow-context-switcher");
    if (!switcher) {
      switcher = document.createElement("nav");
      switcher.className = "dashflow-context-switcher";
      switcher.setAttribute("aria-label", "DashFlow 情景模式");
      const tabs = document.createElement("div");
      tabs.className = "dashflow-context-tabs";
      for (const context of CONTEXTS) tabs.appendChild(this.contextButton(context));
      const configure = document.createElement("button");
      configure.type = "button";
      configure.className = "dashflow-context-configure";
      configure.title = "配置情景模式与 Quick Capture";
      configure.setAttribute("aria-label", "配置情景模式与 Quick Capture");
      setIcon(configure, "settings-2");
      configure.addEventListener("click", () => new WorkflowSettingsModal(this.plugin).open());
      switcher.append(tabs, configure);

      const dashboardSwitcher = shell.querySelector(".dashflow-dashboard-switcher");
      if (dashboardSwitcher) dashboardSwitcher.insertAdjacentElement("beforebegin", switcher);
      else hero.insertAdjacentElement("afterend", switcher);
    }
    this.sync(switcher);
  }

  private contextButton(context: ContextDefinition): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.context = context.mode;
    const icon = document.createElement("span");
    icon.className = "dashflow-context-icon";
    setIcon(icon, context.icon);
    const label = document.createElement("span");
    label.textContent = context.label;
    button.append(icon, label);
    button.addEventListener("click", async () => {
      const dashboardId = this.plugin.data.settings[context.setting];
      if (!dashboardId) {
        new WorkflowSettingsModal(this.plugin).open();
        return;
      }
      if (await this.plugin.dashboardManager.setActiveDashboard(dashboardId)) {
        this.plugin.refreshDashboardViews();
        this.scheduleDecorate();
      }
    });
    return button;
  }

  private sync(switcher: HTMLElement): void {
    const activeId = this.plugin.dashboardManager.active().id;
    const dashboards = new Set(this.plugin.dashboardManager.list().map((dashboard) => dashboard.id));
    for (const context of CONTEXTS) {
      const button = switcher.querySelector<HTMLButtonElement>(`button[data-context="${context.mode}"]`);
      if (!button) continue;
      const dashboardId = this.plugin.data.settings[context.setting];
      const valid = Boolean(dashboardId && dashboards.has(dashboardId));
      button.classList.toggle("is-configured", valid);
      button.classList.toggle("is-active", valid && dashboardId === activeId);
      button.setAttribute("aria-pressed", valid && dashboardId === activeId ? "true" : "false");
      button.title = valid ? `切换到 ${context.label}` : `配置 ${context.label} Dashboard`;
    }
  }
}

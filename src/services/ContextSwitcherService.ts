import { setIcon } from "obsidian";
import type DashFlowPlugin from "../main";
import type { ContextMode } from "../models";
import { WORKFLOW_STYLES } from "../styles/WorkflowStyles";
import { WorkflowSettingsModal } from "../ui/WorkflowSettingsModal";

const STYLE_ID = "dashflow-workflow-context-styles";

interface ContextDefinition {
  mode: ContextMode;
  label: string;
  icon: string;
  setting: "contextMorningDashboardId" | "contextWorkDashboardId" | "contextReviewDashboardId";
}

const CONTEXTS: ContextDefinition[] = [
  { mode: "morning", label: "晨间", icon: "sunrise", setting: "contextMorningDashboardId" },
  { mode: "work", label: "工作", icon: "zap", setting: "contextWorkDashboardId" },
  { mode: "review", label: "复盘", icon: "refresh-cw", setting: "contextReviewDashboardId" },
];

export class ContextSwitcherService {
  private unsubscribeRender: (() => void) | null = null;

  constructor(private readonly plugin: DashFlowPlugin) {}

  start(): void {
    this.ensureStyles();
    this.unsubscribeRender = this.plugin.dashboardRender.subscribe(({ root }) => this.decorate(root));
    this.plugin.dashboardRender.forEachRoot((root) => this.decorate(root));
  }

  stop(): void {
    this.unsubscribeRender?.();
    this.unsubscribeRender = null;
    document.getElementById(STYLE_ID)?.remove();
    for (const node of document.querySelectorAll(".dashflow-context-switcher")) node.remove();
  }

  private decorate(root: HTMLElement): void {
    for (const shell of root.querySelectorAll<HTMLElement>(".dashflow-shell")) {
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
      switcher.setAttribute("aria-label", "DashFlow 情景切换");
      const tabs = document.createElement("div");
      tabs.className = "dashflow-context-tabs";
      for (const context of CONTEXTS) tabs.appendChild(this.contextButton(context));
      const configure = document.createElement("button");
      configure.type = "button";
      configure.className = "dashflow-context-configure";
      configure.title = "配置快速捕捉与情景模式";
      configure.setAttribute("aria-label", "配置快速捕捉与情景模式");
      setIcon(configure, "settings-2");
      configure.addEventListener("click", () => new WorkflowSettingsModal(this.plugin).open());
      switcher.append(tabs, configure);

      const dashboardSwitcher = shell.querySelector(".dashflow-dashboard-switcher");
      const workspace = shell.querySelector(".dashflow-command-workspace");
      if (dashboardSwitcher) dashboardSwitcher.insertAdjacentElement("beforebegin", switcher);
      else if (workspace) workspace.prepend(switcher);
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
      await this.plugin.dashboardManager.setActiveDashboard(dashboardId);
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
      button.title = valid ? `切换到${context.label}` : `配置${context.label}工作台`;
    }
  }

  private ensureStyles(): void {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = WORKFLOW_STYLES;
    document.head.appendChild(style);
  }
}

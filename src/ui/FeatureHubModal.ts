import { Modal, Notice, setIcon } from "obsidian";
import type DashFlowPlugin from "../main";
import {
  FEATURE_CATALOG,
  FEATURE_GROUP_LABELS,
  filterFeatures,
  featureStatus,
  type FeatureAction,
  type FeatureDefinition,
  type FeatureFilter,
  type FeatureFilterMode,
  type FeatureGroup,
  type FeatureStatus,
} from "../product/featureCatalog";
import type { ProductSection } from "../product/navigation";
import { PROJECT_VIEW_TYPES, type ProjectViewType } from "../product/sectionPolicy";
import { AIPlanModal } from "./AIPlanModal";
import { GlobalSearchModal } from "./GlobalSearchModal";
import { HabitEditorModal } from "./HabitEditorModal";
import { MorningBriefingSettingsModal } from "./MorningBriefingSettingsModal";
import { ProjectEditorModal } from "./ProjectEditorModal";
import { QuickAddModal } from "./QuickAddModal";
import { TaskEditorModal } from "./TaskEditorModal";
import { WorkflowSettingsModal } from "./WorkflowSettingsModal";

const FEATURE_GROUPS: readonly FeatureGroup[] = ["capture", "execution", "projects", "review", "intelligence"];

const FEATURE_FILTERS: ReadonlyArray<{ mode: FeatureFilterMode; label: string }> = [
  { mode: "all", label: "全部" },
  { mode: "not-added", label: "未添加" },
  { mode: "needs-attention", label: "待配置" },
];

const PLACEMENT_LABELS = {
  added: "已添加",
  "not-added": "未添加",
  "not-applicable": "",
} as const;

const AVAILABILITY_LABELS = {
  ready: "可用",
  disabled: "已关闭",
  "needs-configuration": "需要配置",
} as const;

export class FeatureHubModal extends Modal {
  private filter: FeatureFilter = { query: "", mode: "all" };
  private resultsEl: HTMLDivElement | null = null;
  private searchInput: HTMLInputElement | null = null;

  constructor(private readonly plugin: DashFlowPlugin) {
    super(plugin.app);
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("dashflow-feature-hub");

    const head = contentEl.createDiv("dashflow-feature-hub-head");
    const heading = head.createDiv();
    heading.createDiv({ cls: "dashflow-modal-eyebrow", text: "功能中心" });
    heading.createEl("h2", { text: "所有功能，都在这里" });
    const close = head.createEl("button", {
      cls: "dashflow-feature-hub-close",
      attr: { type: "button", "aria-label": "关闭功能中心" },
    });
    setIcon(close, "x");
    close.addEventListener("click", () => this.close());

    contentEl.createEl("p", {
      cls: "dashflow-feature-hub-lead",
      text: "查看当前工作台已经使用的组件，补上缺少的视图，或直接进入创建、搜索与集成设置。",
    });

    const tools = contentEl.createDiv("dashflow-feature-hub-tools");
    const searchWrap = tools.createDiv("dashflow-feature-hub-search-wrap");
    const searchIcon = searchWrap.createSpan("dashflow-feature-hub-search-icon");
    setIcon(searchIcon, "search");
    const search = document.createElement("input");
    search.type = "search";
    search.className = "dashflow-feature-hub-search";
    search.placeholder = "搜索名称或说明";
    search.setAttribute("aria-label", "搜索功能");
    search.addEventListener("input", () => {
      this.filter = { ...this.filter, query: search.value };
      this.renderResults();
    });
    searchWrap.appendChild(search);
    this.searchInput = search;

    const filters = tools.createDiv("dashflow-feature-hub-filters");
    filters.setAttribute("aria-label", "按状态筛选功能");
    for (const option of FEATURE_FILTERS) {
      const button = filters.createEl("button", { text: option.label });
      button.type = "button";
      button.dataset.featureFilter = option.mode;
      button.addEventListener("click", () => {
        this.filter = { ...this.filter, mode: option.mode };
        this.syncFilterControls();
        this.renderResults();
      });
    }

    this.resultsEl = contentEl.createDiv("dashflow-feature-hub-results");
    this.syncFilterControls();
    this.renderResults();
  }

  private renderResults(): void {
    if (!this.resultsEl) return;
    this.resultsEl.replaceChildren();

    const context = this.statusContext();
    const statuses = new Map(FEATURE_CATALOG.map((feature) => [feature.id, featureStatus(feature, context)]));
    const matches = filterFeatures(FEATURE_CATALOG, statuses, this.filter);
    if (matches.length === 0) {
      const empty = this.resultsEl.createDiv("dashflow-feature-hub-empty");
      empty.createEl("strong", { text: "没有符合条件的功能" });
      empty.createEl("p", { text: "换一个关键词，或清除当前状态筛选。" });
      const clear = empty.createEl("button", { text: "清除筛选" });
      clear.type = "button";
      clear.addEventListener("click", () => {
        this.filter = { query: "", mode: "all" };
        if (this.searchInput) this.searchInput.value = "";
        this.syncFilterControls();
        this.renderResults();
        this.searchInput?.focus();
      });
      return;
    }

    for (const group of FEATURE_GROUPS) {
      const features = matches.filter((feature) => feature.group === group);
      if (features.length === 0) continue;
      const section = this.resultsEl.createEl("section", { cls: "dashflow-feature-hub-group" });
      section.createEl("h3", { cls: "dashflow-feature-hub-group-title", text: FEATURE_GROUP_LABELS[group] });
      const grid = section.createDiv("dashflow-feature-hub-grid");
      for (const feature of features) grid.appendChild(this.featureButton(feature, statuses.get(feature.id)!));
    }
  }

  private syncFilterControls(): void {
    for (const button of this.contentEl.querySelectorAll<HTMLButtonElement>("[data-feature-filter]")) {
      const active = button.dataset.featureFilter === this.filter.mode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    }
  }

  onClose(): void {
    this.contentEl.empty();
    this.resultsEl = null;
    this.searchInput = null;
  }

  private statusContext() {
    const settings = this.plugin.data.settings;
    return {
      addedWidgetTypes: new Set(this.plugin.dashboardManager.active().widgets.map((widget) => widget.type)),
      aiEnabled: settings.aiEnabled,
      aiConfigured: this.plugin.aiClient.hasConfiguration(),
      morningBriefingEnabled: settings.aiMorningBriefingEnabled,
      weReadEnabled: settings.weReadEnabled,
      weReadConfigured: this.plugin.weRead.hasConfiguration(),
    };
  }

  private featureButton(feature: FeatureDefinition, status: FeatureStatus): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "dashflow-feature-hub-item";
    button.dataset.featureId = feature.id;

    const icon = document.createElement("span");
    icon.className = "dashflow-feature-hub-icon";
    setIcon(icon, feature.icon);
    const copy = document.createElement("span");
    copy.className = "dashflow-feature-hub-copy";
    const title = document.createElement("strong");
    title.textContent = feature.name;
    const description = document.createElement("small");
    description.textContent = feature.description;
    copy.append(title, description);

    const badges = document.createElement("span");
    badges.className = "dashflow-feature-hub-status";
    const placement = PLACEMENT_LABELS[status.placement];
    if (placement) badges.appendChild(this.badge(placement, `is-${status.placement}`));
    if (status.availability !== "ready") {
      badges.appendChild(this.badge(AVAILABILITY_LABELS[status.availability], `is-${status.availability}`));
      if (status.configured) badges.appendChild(this.badge("已配置", "is-configured"));
    }
    const arrow = document.createElement("span");
    arrow.className = "dashflow-feature-hub-arrow";
    setIcon(arrow, status.placement === "not-added" ? "plus" : "arrow-up-right");
    button.append(icon, copy, badges, arrow);
    button.addEventListener("click", () => void this.openFeature(feature, status));
    return button;
  }

  private badge(label: string, className: string): HTMLSpanElement {
    const badge = document.createElement("span");
    badge.className = `dashflow-feature-hub-badge ${className}`;
    badge.textContent = label;
    return badge;
  }

  private async openFeature(feature: FeatureDefinition, status: FeatureStatus): Promise<void> {
    if (status.availability !== "ready" && feature.availability !== "morning-briefing") {
      this.close();
      this.plugin.openSettings("integration");
      return;
    }

    if (feature.kind !== "widget") {
      this.openAction(feature.action);
      return;
    }

    const widgetType = feature.widgetType;
    if (!widgetType) return;
    if (status.placement === "not-added") {
      try {
        const dashboard = this.plugin.dashboardManager.active();
        const added = await this.plugin.dashboardManager.addWidget(dashboard.id, widgetType);
        if (!added) {
          new Notice(`DashFlow: 无法添加「${feature.name}」，请稍后重试。`);
          return;
        }
        this.plugin.refreshDashboardViews();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        new Notice(`DashFlow: 添加「${feature.name}」失败 · ${message}`);
        return;
      }
    }

    this.close();
    if (PROJECT_VIEW_TYPES.includes(widgetType as ProjectViewType)) {
      this.plugin.productExperience.openProjectView(widgetType as ProjectViewType);
    } else if (feature.section !== "settings") {
      await this.plugin.activateSection(feature.section as ProductSection);
    }
  }

  private openAction(action?: FeatureAction): void {
    this.close();
    switch (action) {
      case "quick-add": new QuickAddModal(this.plugin).open(); break;
      case "new-task": new TaskEditorModal(this.plugin).open(); break;
      case "new-project": new ProjectEditorModal(this.plugin).open(); break;
      case "new-habit": new HabitEditorModal(this.plugin).open(); break;
      case "search": new GlobalSearchModal(this.plugin).open(); break;
      case "ai-plan": new AIPlanModal(this.plugin).open(); break;
      case "morning-briefing": new MorningBriefingSettingsModal(this.plugin).open(); break;
      case "weread": this.plugin.openSettings("integration"); break;
      case "manage-dashboards": this.plugin.dashboardSwitcher.openManager(); break;
      case "workflow-settings": new WorkflowSettingsModal(this.plugin).open(); break;
    }
  }
}

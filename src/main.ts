import { Notice, Plugin } from "obsidian";
import { DEFAULT_SETTINGS, SCHEMA_VERSION, VIEW_TYPE } from "./constants";
import { DashboardManager } from "./dashboard/DashboardManager";
import { DashboardView } from "./dashboard/DashboardView";
import { createDefaultDashboard } from "./dashboard/defaultDashboard";
import { upgradeLegacyHomeLayout } from "./dashboard/defaultLayoutMigration";
import type { ActivityStore, DashFlowData } from "./models";
import type { ProductSection } from "./product/navigation";
import { ActivityService } from "./services/ActivityService";
import { ActivityWidgetInteractionService } from "./services/ActivityWidgetInteractionService";
import { AIPlanningService } from "./services/AIPlanningService";
import { CalendarService } from "./services/CalendarService";
import { CalendarWidgetInteractionService } from "./services/CalendarWidgetInteractionService";
import { CaptureService } from "./services/CaptureService";
import { DashboardSwitcherInteractionService } from "./services/DashboardSwitcherInteractionService";
import { DashboardTransferInteractionService } from "./services/DashboardTransferInteractionService";
import { HabitService } from "./services/HabitService";
import { HabitWidgetInteractionService } from "./services/HabitWidgetInteractionService";
import { PersonalHomeDesignService } from "./services/PersonalHomeDesignService";
import { ProductDesignService } from "./services/ProductDesignService";
import { ProductExperienceService } from "./services/ProductExperienceService";
import { ProjectService } from "./services/ProjectService";
import { TaskInteractionService } from "./services/TaskInteractionService";
import { TaskService } from "./services/TaskService";
import { UiRefinementPolishService } from "./services/UiRefinementPolishService";
import { VaultIndexService } from "./services/VaultIndexService";
import { VisualContinuityService } from "./services/VisualContinuityService";
import { WeeklyReviewService } from "./services/WeeklyReviewService";
import { WeeklyReviewWidgetInteractionService } from "./services/WeeklyReviewWidgetInteractionService";
import { WeReadService } from "./services/WeReadService";
import { DashFlowSettingsTab } from "./settings/DashFlowSettingsTab";
import { AIPlanModal } from "./ui/AIPlanModal";
import { GlobalSearchModal } from "./ui/GlobalSearchModal";
import { ProjectEditorModal } from "./ui/ProjectEditorModal";
import { QuickAddModal } from "./ui/QuickAddModal";
import { TaskEditorModal } from "./ui/TaskEditorModal";
import { localDate } from "./utils/date";
import { registerBuiltins } from "./widgets/builtins";
import { WidgetRegistry } from "./widgets/WidgetRegistry";

export default class DashFlowPlugin extends Plugin {
  data!: DashFlowData;
  widgetRegistry!: WidgetRegistry;
  dashboardManager!: DashboardManager;
  dashboardSwitcher!: DashboardSwitcherInteractionService;
  dashboardTransfer!: DashboardTransferInteractionService;
  vaultIndex!: VaultIndexService;
  activityService!: ActivityService;
  activityWidgets!: ActivityWidgetInteractionService;
  calendarService!: CalendarService;
  calendarWidgets!: CalendarWidgetInteractionService;
  weeklyReviewService!: WeeklyReviewService;
  weeklyReviewWidgets!: WeeklyReviewWidgetInteractionService;
  habitService!: HabitService;
  habitWidgets!: HabitWidgetInteractionService;
  taskService!: TaskService;
  projectService!: ProjectService;
  captureService!: CaptureService;
  taskInteractions!: TaskInteractionService;
  aiPlanning!: AIPlanningService;
  weRead!: WeReadService;
  productDesign!: ProductDesignService;
  personalHomeDesign!: PersonalHomeDesignService;
  uiRefinementPolish!: UiRefinementPolishService;
  visualContinuity!: VisualContinuityService;
  productExperience!: ProductExperienceService;

  async onload(): Promise<void> {
    this.widgetRegistry = new WidgetRegistry();
    registerBuiltins(this.widgetRegistry);
    await this.loadPluginData();

    this.dashboardManager = new DashboardManager(this, this.widgetRegistry);
    this.vaultIndex = new VaultIndexService(
      this.app,
      this,
      () => this.data.settings.projectTypeValue,
      () => this.data.settings.habitTypeValue,
    );
    this.activityService = new ActivityService(
      this.app,
      this,
      this.vaultIndex,
      () => this.data.activity,
      () => this.savePluginData(),
    );
    this.taskService = new TaskService(this.app, this.vaultIndex, this.activityService);
    this.projectService = new ProjectService(
      this.app,
      this.vaultIndex,
      () => this.data.settings.projectFolder,
      () => this.data.settings.projectTypeValue,
    );
    this.calendarService = new CalendarService(this.vaultIndex);
    this.weeklyReviewService = new WeeklyReviewService(
      this.vaultIndex,
      this.activityService,
      this.projectService,
      this.calendarService,
    );
    this.captureService = new CaptureService(
      this.app,
      () => this.data.settings.inboxPath,
      this.activityService,
    );
    this.habitService = new HabitService(
      this.app,
      this.vaultIndex,
      this.activityService,
      () => this.data.settings.habitFolder,
      () => this.data.settings.habitTypeValue,
    );
    this.aiPlanning = new AIPlanningService(this);
    this.weRead = new WeReadService(this);
    this.taskInteractions = new TaskInteractionService(this);
    this.activityWidgets = new ActivityWidgetInteractionService(this);
    this.habitWidgets = new HabitWidgetInteractionService(this);
    this.calendarWidgets = new CalendarWidgetInteractionService(this);
    this.weeklyReviewWidgets = new WeeklyReviewWidgetInteractionService(this);
    this.dashboardSwitcher = new DashboardSwitcherInteractionService(this);
    this.dashboardTransfer = new DashboardTransferInteractionService(this);
    this.productDesign = new ProductDesignService();
    this.personalHomeDesign = new PersonalHomeDesignService();
    this.uiRefinementPolish = new UiRefinementPolishService(this);
    this.visualContinuity = new VisualContinuityService();
    this.productExperience = new ProductExperienceService(this);

    this.registerView(VIEW_TYPE, (leaf) => new DashboardView(leaf, this));

    this.addRibbonIcon("layout-dashboard", "打开 DashFlow", () => {
      void this.activateDashboard();
    });

    this.addCommand({ id: "open-dashboard", name: "打开 DashFlow", callback: () => void this.activateDashboard() });
    this.addCommand({ id: "quick-add", name: "快速添加", callback: () => new QuickAddModal(this).open() });
    this.addCommand({ id: "search-dashflow", name: "搜索任务、项目与习惯", callback: () => new GlobalSearchModal(this).open() });
    this.addCommand({ id: "new-task", name: "新建任务", callback: () => new TaskEditorModal(this).open() });
    this.addCommand({ id: "new-project", name: "新建项目", callback: () => new ProjectEditorModal(this).open() });
    this.addCommand({ id: "ai-plan-today", name: "AI 规划今天", callback: () => new AIPlanModal(this).open() });

    const sections: Array<[ProductSection, string]> = [
      ["today", "打开 · 主页"], ["work", "打开 · 工作台"], ["inbox", "打开 · 收集箱"], ["projects", "打开 · 项目"],
      ["calendar", "打开 · 日历"], ["habits", "打开 · 习惯"], ["review", "打开 · 复盘"],
    ];
    for (const [section, name] of sections) {
      this.addCommand({ id: `open-${section}`, name, callback: () => void this.activateSection(section) });
    }

    this.addCommand({ id: "export-active-dashboard", name: "导出当前 Dashboard JSON", callback: () => this.dashboardTransfer.openExportModal() });
    this.addCommand({ id: "import-dashboard-json", name: "导入 Dashboard JSON", callback: () => this.dashboardTransfer.openImportModal() });
    this.addCommand({
      id: "reindex-vault",
      name: "重新索引 Vault",
      callback: async () => {
        await this.vaultIndex.reindexAll();
        new Notice("DashFlow 索引已刷新");
      },
    });

    this.addSettingTab(new DashFlowSettingsTab(this.app, this));
    this.productDesign.start();
    this.personalHomeDesign.start();
    // VisualContinuity marks the Hero actions as polished. Starting it first keeps
    // UiRefinementPolish from attaching the same post-navigation focus listener twice.
    this.visualContinuity.start();
    this.uiRefinementPolish.start();
    this.activityService.start();
    this.vaultIndex.initializeWhenReady();
    this.taskInteractions.start();
    this.activityWidgets.start();
    this.habitWidgets.start();
    this.calendarWidgets.start();
    this.weeklyReviewWidgets.start();
    this.dashboardSwitcher.start();
    this.dashboardTransfer.start();
    this.productExperience.start();
  }

  onunload(): void {
    this.productExperience?.stop();
    this.dashboardTransfer?.stop();
    this.dashboardSwitcher?.stop();
    this.weeklyReviewWidgets?.stop();
    this.calendarWidgets?.stop();
    this.habitWidgets?.stop();
    this.activityWidgets?.stop();
    this.taskInteractions?.stop();
    this.activityService?.stop();
    this.uiRefinementPolish?.stop();
    this.visualContinuity?.stop();
    this.personalHomeDesign?.stop();
    this.productDesign?.stop();
    this.app.workspace.detachLeavesOfType(VIEW_TYPE);
  }

  async activateDashboard(): Promise<void> {
    let leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];
    if (!leaf) {
      leaf = this.app.workspace.getLeaf("tab");
      await leaf.setViewState({ type: VIEW_TYPE, active: true });
    }
    await this.app.workspace.revealLeaf(leaf);
  }

  async activateSection(section: ProductSection): Promise<void> {
    await this.activateDashboard();
    this.productExperience.openSection(section);
  }

  refreshDashboardViews(): void {
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) {
      const view = leaf.view as unknown as { refresh?: () => void };
      view.refresh?.();
    }
  }

  private async loadPluginData(): Promise<void> {
    const loaded = await this.loadData() as (Partial<DashFlowData> & { activity?: Partial<ActivityStore> }) | null;
    this.data = {
      schemaVersion: SCHEMA_VERSION,
      settings: { ...DEFAULT_SETTINGS, ...(loaded?.settings ?? {}) },
      dashboards: Array.isArray(loaded?.dashboards) ? loaded.dashboards : [],
      activeDashboardId: loaded?.activeDashboardId ?? "home",
      customTemplates: Array.isArray(loaded?.customTemplates) ? loaded.customTemplates : [],
      activity: {
        startedAt: loaded?.activity?.startedAt ?? localDate(),
        days: loaded?.activity?.days ?? {},
      },
    };

    if (this.data.dashboards.length === 0) {
      this.data.dashboards = [createDefaultDashboard(this.widgetRegistry)];
      this.data.activeDashboardId = "home";
    } else {
      this.data.dashboards = this.data.dashboards.map((dashboard) => upgradeLegacyHomeLayout(dashboard, this.widgetRegistry));
    }
    await this.savePluginData();
  }

  async savePluginData(): Promise<void> {
    await this.saveData(this.data);
  }
}

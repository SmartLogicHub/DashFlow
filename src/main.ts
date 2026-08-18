import { Notice, Plugin } from "obsidian";
import { DEFAULT_SETTINGS, SCHEMA_VERSION, VIEW_TYPE } from "./constants";
import { DashboardManager } from "./dashboard/DashboardManager";
import { DashboardView } from "./dashboard/DashboardView";
import { createDefaultDashboard } from "./dashboard/defaultDashboard";
import { upgradeLegacyHomeLayout } from "./dashboard/defaultLayoutMigration";
import { normalizeFocusState } from "./focus/focusTimer";
import type { ActivityStore, DashFlowData } from "./models";
import type { ProductSection } from "./product/navigation";
import { ActivityService } from "./services/ActivityService";
import { ActivityWidgetInteractionService } from "./services/ActivityWidgetInteractionService";
import { AIClient } from "./services/AIClient";
import { AINewsWidgetInteractionService } from "./services/AINewsWidgetInteractionService";
import { AIPlanningService } from "./services/AIPlanningService";
import { CalendarService } from "./services/CalendarService";
import { CalendarWidgetInteractionService } from "./services/CalendarWidgetInteractionService";
import { CaptureService } from "./services/CaptureService";
import { ContextSwitcherService } from "./services/ContextSwitcherService";
import { DailyNoteService } from "./services/DailyNoteService";
import { DashboardRenderService } from "./services/DashboardRenderService";
import { DashboardSwitcherInteractionService } from "./services/DashboardSwitcherInteractionService";
import { DashboardTransferInteractionService } from "./services/DashboardTransferInteractionService";
import { DataFilterWidgetInteractionService } from "./services/DataFilterWidgetInteractionService";
import { DesignSystemService } from "./services/DesignSystemService";
import { FocusService } from "./services/FocusService";
import { FocusWidgetInteractionService } from "./services/FocusWidgetInteractionService";
import { HabitService } from "./services/HabitService";
import { HabitWidgetInteractionService } from "./services/HabitWidgetInteractionService";
import { MagicEmbedWidgetInteractionService } from "./services/MagicEmbedWidgetInteractionService";
import { MobileDashboardInteractionService } from "./services/MobileDashboardInteractionService";
import { MorningBriefingService } from "./services/MorningBriefingService";
import { NewsCurationService } from "./services/NewsCurationService";
import { PersonalHomeDesignService } from "./services/PersonalHomeDesignService";
import { PresentationRuntimeService } from "./services/PresentationRuntimeService";
import { ProductDesignService } from "./services/ProductDesignService";
import { ProductExperienceService } from "./services/ProductExperienceService";
import { ProjectService } from "./services/ProjectService";
import { TaskInteractionService } from "./services/TaskInteractionService";
import { TaskService } from "./services/TaskService";
import { VaultIndexService } from "./services/VaultIndexService";
import { VaultQueryService } from "./services/VaultQueryService";
import { WeeklyReviewService } from "./services/WeeklyReviewService";
import { WeeklyReviewWidgetInteractionService } from "./services/WeeklyReviewWidgetInteractionService";
import { WeReadService } from "./services/WeReadService";
import { DashFlowSettingsTab } from "./settings/DashFlowSettingsTab";
import { AIPlanModal } from "./ui/AIPlanModal";
import { GlobalSearchModal } from "./ui/GlobalSearchModal";
import { MorningBriefingSettingsModal } from "./ui/MorningBriefingSettingsModal";
import { ProjectEditorModal } from "./ui/ProjectEditorModal";
import { QuickAddModal } from "./ui/QuickAddModal";
import { TaskEditorModal } from "./ui/TaskEditorModal";
import { WorkflowSettingsModal } from "./ui/WorkflowSettingsModal";
import { localDate } from "./utils/date";
import { registerBuiltins } from "./widgets/builtins";
import { registerDataWidgets } from "./widgets/data";
import { registerEmbedWidgets } from "./widgets/embed";
import { registerFocusWidgets } from "./widgets/focus";
import { registerIntelligenceWidgets } from "./widgets/intelligence";
import { WidgetRegistry } from "./widgets/WidgetRegistry";

export default class DashFlowPlugin extends Plugin {
  data!: DashFlowData;
  widgetRegistry!: WidgetRegistry;
  dashboardManager!: DashboardManager;
  dashboardRender!: DashboardRenderService;
  dashboardSwitcher!: DashboardSwitcherInteractionService;
  dashboardTransfer!: DashboardTransferInteractionService;
  contextSwitcher!: ContextSwitcherService;
  vaultIndex!: VaultIndexService;
  vaultQuery!: VaultQueryService;
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
  dailyNotes!: DailyNoteService;
  captureService!: CaptureService;
  taskInteractions!: TaskInteractionService;
  aiClient!: AIClient;
  aiPlanning!: AIPlanningService;
  morningBriefing!: MorningBriefingService;
  newsCuration!: NewsCurationService;
  aiNewsWidgets!: AINewsWidgetInteractionService;
  dataFilterWidgets!: DataFilterWidgetInteractionService;
  focusService!: FocusService;
  focusWidgets!: FocusWidgetInteractionService;
  magicEmbedWidgets!: MagicEmbedWidgetInteractionService;
  mobileDashboard!: MobileDashboardInteractionService;
  weRead!: WeReadService;
  productDesign!: ProductDesignService;
  personalHomeDesign!: PersonalHomeDesignService;
  designSystem!: DesignSystemService;
  presentationRuntime!: PresentationRuntimeService;
  productExperience!: ProductExperienceService;

  async onload(): Promise<void> {
    this.widgetRegistry = new WidgetRegistry();
    registerBuiltins(this.widgetRegistry);
    registerDataWidgets(this.widgetRegistry);
    registerFocusWidgets(this.widgetRegistry);
    registerEmbedWidgets(this.widgetRegistry);
    registerIntelligenceWidgets(this.widgetRegistry);
    await this.loadPluginData();

    this.dashboardManager = new DashboardManager(this, this.widgetRegistry);
    this.dashboardRender = new DashboardRenderService();
    this.vaultIndex = new VaultIndexService(
      this.app,
      this,
      () => this.data.settings.projectTypeValue,
      () => this.data.settings.habitTypeValue,
    );
    this.vaultQuery = new VaultQueryService(() => this.vaultIndex.getSnapshot());
    this.activityService = new ActivityService(
      this.app,
      this,
      this.vaultIndex,
      () => this.data.activity,
      () => this.savePluginData(),
    );
    this.focusService = new FocusService(this);
    this.taskService = new TaskService(this.app, this.vaultIndex, this.activityService, this.vaultQuery);
    this.projectService = new ProjectService(
      this.app,
      this.vaultIndex,
      () => this.data.settings.projectFolder,
      () => this.data.settings.projectTypeValue,
      this.vaultQuery,
    );
    this.calendarService = new CalendarService(this.vaultIndex);
    this.weeklyReviewService = new WeeklyReviewService(
      this.vaultIndex,
      this.activityService,
      this.projectService,
      this.calendarService,
    );
    this.dailyNotes = new DailyNoteService(
      this.app,
      () => this.data.settings.dailyNoteFolder,
      () => this.data.settings.dailyNoteDateFormat,
    );
    this.captureService = new CaptureService(
      this.app,
      () => this.data.settings.inboxPath,
      this.activityService,
      this.dailyNotes,
      () => this.data.settings.quickCaptureTarget,
      () => this.data.settings.dailyCaptureHeading,
    );
    this.habitService = new HabitService(
      this.app,
      this.vaultIndex,
      this.activityService,
      () => this.data.settings.habitFolder,
      () => this.data.settings.habitTypeValue,
      this.vaultQuery,
    );
    this.aiClient = new AIClient(this);
    this.aiPlanning = new AIPlanningService(this);
    this.morningBriefing = new MorningBriefingService(this);
    this.newsCuration = new NewsCurationService(this);
    this.weRead = new WeReadService(this);
    this.taskInteractions = new TaskInteractionService(this);
    this.activityWidgets = new ActivityWidgetInteractionService(this);
    this.habitWidgets = new HabitWidgetInteractionService(this);
    this.calendarWidgets = new CalendarWidgetInteractionService(this);
    this.weeklyReviewWidgets = new WeeklyReviewWidgetInteractionService(this);
    this.aiNewsWidgets = new AINewsWidgetInteractionService(this);
    this.dataFilterWidgets = new DataFilterWidgetInteractionService(this);
    this.focusWidgets = new FocusWidgetInteractionService(this);
    this.magicEmbedWidgets = new MagicEmbedWidgetInteractionService(this);
    this.mobileDashboard = new MobileDashboardInteractionService(this);
    this.dashboardSwitcher = new DashboardSwitcherInteractionService(this);
    this.dashboardTransfer = new DashboardTransferInteractionService(this);
    this.contextSwitcher = new ContextSwitcherService(this);
    this.productDesign = new ProductDesignService();
    this.personalHomeDesign = new PersonalHomeDesignService();
    this.designSystem = new DesignSystemService();
    this.presentationRuntime = new PresentationRuntimeService(this);
    this.productExperience = new ProductExperienceService(this);

    this.registerView(VIEW_TYPE, (leaf) => new DashboardView(leaf, this));

    this.addRibbonIcon("layout-dashboard", "打开 DashFlow", () => {
      void this.activateDashboard();
    });

    this.addCommand({ id: "open-dashboard", name: "打开 DashFlow", callback: () => void this.activateDashboard() });
    this.addCommand({ id: "quick-add", name: "快速添加", callback: () => new QuickAddModal(this).open() });
    this.addCommand({ id: "configure-workflow-context", name: "配置 Quick Capture 与情景模式", callback: () => new WorkflowSettingsModal(this).open() });
    this.addCommand({ id: "search-dashflow", name: "搜索任务、项目与习惯", callback: () => new GlobalSearchModal(this).open() });
    this.addCommand({ id: "new-task", name: "新建任务", callback: () => new TaskEditorModal(this).open() });
    this.addCommand({ id: "new-project", name: "新建项目", callback: () => new ProjectEditorModal(this).open() });
    this.addCommand({ id: "ai-plan-today", name: "AI 规划今天", callback: () => new AIPlanModal(this).open() });
    this.addCommand({
      id: "configure-ai-morning-briefing",
      name: "配置 AI 晨间简报",
      callback: () => new MorningBriefingSettingsModal(this).open(),
    });
    this.addCommand({
      id: "refresh-ai-morning-briefing",
      name: "刷新 AI 晨间简报",
      callback: async () => {
        await this.morningBriefing.clearCache();
        await this.activateSection("today");
      },
    });

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
    this.designSystem.start();
    this.presentationRuntime.start();
    this.activityService.start();
    this.focusService.start();
    this.vaultIndex.initializeWhenReady();
    this.taskInteractions.start();
    this.activityWidgets.start();
    this.habitWidgets.start();
    this.calendarWidgets.start();
    this.weeklyReviewWidgets.start();
    this.aiNewsWidgets.start();
    this.dataFilterWidgets.start();
    this.focusWidgets.start();
    this.magicEmbedWidgets.start();
    this.mobileDashboard.start();
    this.productExperience.start();
    this.dashboardSwitcher.start();
    this.dashboardTransfer.start();
    this.contextSwitcher.start();
  }

  onunload(): void {
    this.contextSwitcher?.stop();
    this.dashboardTransfer?.stop();
    this.dashboardSwitcher?.stop();
    this.productExperience?.stop();
    this.magicEmbedWidgets?.stop();
    this.mobileDashboard?.stop();
    this.focusWidgets?.stop();
    this.dataFilterWidgets?.stop();
    this.aiNewsWidgets?.stop();
    this.weeklyReviewWidgets?.stop();
    this.calendarWidgets?.stop();
    this.habitWidgets?.stop();
    this.activityWidgets?.stop();
    this.taskInteractions?.stop();
    this.focusService?.stop();
    this.activityService?.stop();
    this.presentationRuntime?.stop();
    this.designSystem?.stop();
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
      aiCache: loaded?.aiCache ?? {},
      focus: normalizeFocusState(loaded?.focus),
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

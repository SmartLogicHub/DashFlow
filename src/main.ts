import { Notice, Plugin } from "obsidian";
import { DEFAULT_SETTINGS, VIEW_TYPE } from "./constants";
import { migrateAiCredential, type AiCredentialMigrationStatus } from "./core/aiCredentialMigration";
import { migratePluginData } from "./core/pluginDataMigration";
import { DashboardManager } from "./dashboard/DashboardManager";
import { DashboardView } from "./dashboard/DashboardView";
import { createDefaultDashboard } from "./dashboard/defaultDashboard";
import { upgradeLegacyHomeLayout } from "./dashboard/defaultLayoutMigration";
import type { DashFlowData } from "./models";
import type { ProductSection } from "./product/navigation";
import { COMMAND_CATALOG, type CommandDefinition } from "./product/commandCatalog";
import { shouldShowOnboarding } from "./product/onboarding";
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
import { OpportunityWidgetInteractionService } from "./services/OpportunityWidgetInteractionService";
import { PersonalHomeDesignService } from "./services/PersonalHomeDesignService";
import { PresentationRuntimeService } from "./services/PresentationRuntimeService";
import { ProductDesignService } from "./services/ProductDesignService";
import { ProductExperienceService } from "./services/ProductExperienceService";
import { ProjectGanttWidgetInteractionService } from "./services/ProjectGanttWidgetInteractionService";
import { ProjectKanbanWidgetInteractionService } from "./services/ProjectKanbanWidgetInteractionService";
import { ProjectService } from "./services/ProjectService";
import { TaskInteractionService } from "./services/TaskInteractionService";
import { TaskService } from "./services/TaskService";
import { VaultIndexService } from "./services/VaultIndexService";
import { VaultQueryService } from "./services/VaultQueryService";
import { WeeklyReviewService } from "./services/WeeklyReviewService";
import { WeeklyReviewWidgetInteractionService } from "./services/WeeklyReviewWidgetInteractionService";
import { WeReadService } from "./services/WeReadService";
import { DashFlowSettingsTab, type SettingsSection } from "./settings/DashFlowSettingsTab";
import { AIPlanModal } from "./ui/AIPlanModal";
import { GlobalSearchModal } from "./ui/GlobalSearchModal";
import { HabitEditorModal } from "./ui/HabitEditorModal";
import { MorningBriefingSettingsModal } from "./ui/MorningBriefingSettingsModal";
import { OnboardingModal } from "./ui/OnboardingModal";
import { ProjectEditorModal } from "./ui/ProjectEditorModal";
import { QuickAddModal } from "./ui/QuickAddModal";
import { TaskEditorModal } from "./ui/TaskEditorModal";
import { WorkflowSettingsModal } from "./ui/WorkflowSettingsModal";
import { localDate } from "./utils/date";
import { registerBuiltins } from "./widgets/builtins";
import { registerDataWidgets } from "./widgets/data";
import { registerEmbedWidgets } from "./widgets/embed";
import { registerFocusWidgets } from "./widgets/focus";
import { registerGanttWidgets } from "./widgets/gantt";
import { registerIntelligenceWidgets } from "./widgets/intelligence";
import { registerKanbanWidgets } from "./widgets/kanban";
import { registerOpportunityWidgets } from "./widgets/opportunity";
import { WidgetRegistry } from "./widgets/WidgetRegistry";

interface SettingsHost {
  setting?: {
    open(): void;
    openTabById(id: string): void;
  };
}

export default class DashFlowPlugin extends Plugin {
  data!: DashFlowData;
  aiCredentialStatus: AiCredentialMigrationStatus = "unconfigured";
  dataRecoveryRequired = false;
  private onboardingPending = false;
  private onboardingOpen = false;
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
  opportunityWidgets!: OpportunityWidgetInteractionService;
  projectGanttWidgets!: ProjectGanttWidgetInteractionService;
  projectKanbanWidgets!: ProjectKanbanWidgetInteractionService;
  weRead!: WeReadService;
  productDesign!: ProductDesignService;
  personalHomeDesign!: PersonalHomeDesignService;
  designSystem!: DesignSystemService;
  presentationRuntime!: PresentationRuntimeService;
  productExperience!: ProductExperienceService;
  settingsTab!: DashFlowSettingsTab;

  async onload(): Promise<void> {
    this.widgetRegistry = new WidgetRegistry();
    registerBuiltins(this.widgetRegistry);
    registerDataWidgets(this.widgetRegistry);
    registerFocusWidgets(this.widgetRegistry);
    registerEmbedWidgets(this.widgetRegistry);
    registerIntelligenceWidgets(this.widgetRegistry);
    registerGanttWidgets(this.widgetRegistry);
    registerKanbanWidgets(this.widgetRegistry);
    registerOpportunityWidgets(this.widgetRegistry);
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
    this.opportunityWidgets = new OpportunityWidgetInteractionService(this);
    this.projectGanttWidgets = new ProjectGanttWidgetInteractionService(this);
    this.projectKanbanWidgets = new ProjectKanbanWidgetInteractionService(this);
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

    for (const command of COMMAND_CATALOG) this.registerProductCommand(command);

    this.settingsTab = new DashFlowSettingsTab(this.app, this);
    this.addSettingTab(this.settingsTab);
    this.productDesign.start();
    this.personalHomeDesign.start();
    this.designSystem.start();
    this.presentationRuntime.start();
    this.activityService.start();
    this.focusService.start();
    this.vaultIndex.initializeWhenReady();
    void this.openOnboardingWhenReady();
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
    this.opportunityWidgets.start();
    this.projectGanttWidgets.start();
    this.projectKanbanWidgets.start();
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
    this.opportunityWidgets?.stop();
    this.projectGanttWidgets?.stop();
    this.projectKanbanWidgets?.stop();
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
    if (this.onboardingPending && !this.data.onboardingCompleted) {
      void this.openOnboardingWhenReady();
      return;
    }
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

  openSettings(section: SettingsSection = "appearance"): void {
    const app = this.app as typeof this.app & SettingsHost;
    if (!app.setting) {
      new Notice("请打开 Obsidian 设置 → DashFlow。");
      return;
    }
    app.setting.open();
    app.setting.openTabById(this.manifest.id);
    this.settingsTab.openSection(section);
  }

  private registerProductCommand(command: CommandDefinition): void {
    this.addCommand({
      id: command.id,
      name: command.name,
      callback: async () => {
        switch (command.action) {
          case "open-dashboard":
            await this.activateDashboard();
            break;
          case "open-section":
            if (command.section) await this.activateSection(command.section);
            break;
          case "quick-add":
            new QuickAddModal(this).open();
            break;
          case "workflow-settings":
            new WorkflowSettingsModal(this).open();
            break;
          case "search":
            new GlobalSearchModal(this).open();
            break;
          case "new-task":
            new TaskEditorModal(this).open();
            break;
          case "new-project":
            new ProjectEditorModal(this).open();
            break;
          case "new-habit":
            new HabitEditorModal(this).open();
            break;
          case "ai-plan":
            new AIPlanModal(this).open();
            break;
          case "configure-morning-briefing":
            new MorningBriefingSettingsModal(this).open();
            break;
          case "refresh-morning-briefing":
            await this.morningBriefing.clearCache();
            await this.activateSection("today");
            break;
          case "export-dashboard":
            this.dashboardTransfer.openExportModal();
            break;
          case "import-dashboard":
            this.dashboardTransfer.openImportModal();
            break;
          case "reindex-vault":
            await this.vaultIndex.reindexAll();
            new Notice("DashFlow 索引已刷新");
            break;
        }
      },
    });
  }

  openOnboarding(manual = true): void {
    if (this.onboardingOpen) return;
    this.onboardingOpen = true;
    new OnboardingModal(this, () => {
      this.onboardingOpen = false;
      if (!manual) this.onboardingPending = false;
      this.refreshDashboardViews();
      if (!manual) void this.activateDashboard();
    }, () => {
      this.onboardingOpen = false;
    }).open();
  }

  private async openOnboardingWhenReady(): Promise<void> {
    if (!shouldShowOnboarding(this.onboardingPending, this.data.onboardingCompleted, this.dataRecoveryRequired)) return;
    await this.vaultIndex.whenReady();
    if (shouldShowOnboarding(this.onboardingPending, this.data.onboardingCompleted, this.dataRecoveryRequired)) {
      this.openOnboarding(false);
    }
  }

  refreshDashboardViews(): void {
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) {
      const view = leaf.view as unknown as { refresh?: () => void };
      view.refresh?.();
    }
  }

  private async loadPluginData(): Promise<void> {
    const loaded = await this.loadData() as unknown;
    const migration = migratePluginData(loaded, {
      defaults: DEFAULT_SETTINGS,
      fallbackDashboard: createDefaultDashboard(this.widgetRegistry),
      today: localDate(),
    });
    this.data = migration.data;
    this.dataRecoveryRequired = migration.recoveryRequired;
    this.onboardingPending = migration.firstRun;

    if (!migration.recoveryRequired) {
      this.data.dashboards = this.data.dashboards.map((dashboard) => upgradeLegacyHomeLayout(dashboard, this.widgetRegistry));
    }
    const credential = migrateAiCredential(this.data.settings.aiSecretId, this.app.secretStorage);
    this.data.settings.aiSecretId = credential.aiSecretId;
    this.aiCredentialStatus = credential.status;
    if (!migration.recoveryRequired && (migration.shouldPersist || credential.shouldPersist)) {
      await this.savePluginData();
    }
    if (migration.recoveryRequired) {
      new Notice("DashFlow 检测到无法安全读取的工作台数据，已进入恢复模式；原数据尚未覆盖。请前往设置 → 高级处理。");
    }
  }

  getRecoveryBackupJson(): string | null {
    const backup = this.data.recoveryBackup;
    return backup ? JSON.stringify(backup.data, null, 2) : null;
  }

  async restoreRecoveryBackup(): Promise<boolean> {
    const backup = this.data.recoveryBackup;
    if (!backup) return false;
    await this.saveData(backup.data);
    new Notice("DashFlow 已写回恢复快照；请重新加载插件以完成恢复。");
    return true;
  }

  async resetPluginDataForRecovery(): Promise<void> {
    const migration = migratePluginData(null, {
      defaults: DEFAULT_SETTINGS,
      fallbackDashboard: createDefaultDashboard(this.widgetRegistry),
      today: localDate(),
    });
    this.data = migration.data;
    this.dataRecoveryRequired = false;
    await this.savePluginData();
    this.refreshDashboardViews();
    new Notice("DashFlow 配置已重置；Markdown 内容未受影响。");
  }

  async savePluginData(): Promise<void> {
    await this.saveData(this.data);
  }
}

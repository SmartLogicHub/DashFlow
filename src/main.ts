import { Notice, Plugin } from "obsidian";
import { DEFAULT_SETTINGS, SCHEMA_VERSION, VIEW_TYPE } from "./constants";
import { DashboardManager } from "./dashboard/DashboardManager";
import { DashboardView } from "./dashboard/DashboardView";
import { createDefaultDashboard } from "./dashboard/defaultDashboard";
import type { ActivityStore, DashFlowData } from "./models";
import { ActivityService } from "./services/ActivityService";
import { ActivityWidgetInteractionService } from "./services/ActivityWidgetInteractionService";
import { CalendarService } from "./services/CalendarService";
import { CalendarWidgetInteractionService } from "./services/CalendarWidgetInteractionService";
import { CaptureService } from "./services/CaptureService";
import { DashboardSwitcherInteractionService } from "./services/DashboardSwitcherInteractionService";
import { HabitService } from "./services/HabitService";
import { HabitWidgetInteractionService } from "./services/HabitWidgetInteractionService";
import { MobileDashboardInteractionService } from "./services/MobileDashboardInteractionService";
import { ProjectService } from "./services/ProjectService";
import { TaskInteractionService } from "./services/TaskInteractionService";
import { TaskService } from "./services/TaskService";
import { VaultIndexService } from "./services/VaultIndexService";
import { WeeklyReviewService } from "./services/WeeklyReviewService";
import { WeeklyReviewWidgetInteractionService } from "./services/WeeklyReviewWidgetInteractionService";
import { DashFlowSettingsTab } from "./settings/DashFlowSettingsTab";
import { localDate } from "./utils/date";
import { registerBuiltins } from "./widgets/builtins";
import { WidgetRegistry } from "./widgets/WidgetRegistry";

export default class DashFlowPlugin extends Plugin {
  data!: DashFlowData;
  widgetRegistry!: WidgetRegistry;
  dashboardManager!: DashboardManager;
  dashboardSwitcher!: DashboardSwitcherInteractionService;
  vaultIndex!: VaultIndexService;
  activityService!: ActivityService;
  activityWidgets!: ActivityWidgetInteractionService;
  calendarService!: CalendarService;
  calendarWidgets!: CalendarWidgetInteractionService;
  weeklyReviewService!: WeeklyReviewService;
  weeklyReviewWidgets!: WeeklyReviewWidgetInteractionService;
  mobileDashboard!: MobileDashboardInteractionService;
  habitService!: HabitService;
  habitWidgets!: HabitWidgetInteractionService;
  taskService!: TaskService;
  projectService!: ProjectService;
  captureService!: CaptureService;
  taskInteractions!: TaskInteractionService;

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
    this.projectService = new ProjectService(this.vaultIndex);
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
    this.taskInteractions = new TaskInteractionService(this);
    this.activityWidgets = new ActivityWidgetInteractionService(this);
    this.habitWidgets = new HabitWidgetInteractionService(this);
    this.calendarWidgets = new CalendarWidgetInteractionService(this);
    this.weeklyReviewWidgets = new WeeklyReviewWidgetInteractionService(this);
    this.mobileDashboard = new MobileDashboardInteractionService(this);
    this.dashboardSwitcher = new DashboardSwitcherInteractionService(this);

    this.registerView(VIEW_TYPE, (leaf) => new DashboardView(leaf, this));

    this.addRibbonIcon("layout-dashboard", "打开 DashFlow", () => {
      void this.activateDashboard();
    });

    this.addCommand({
      id: "open-dashboard",
      name: "打开 Dashboard",
      callback: () => void this.activateDashboard(),
    });

    this.addCommand({
      id: "reindex-vault",
      name: "重新索引 Vault",
      callback: async () => {
        await this.vaultIndex.reindexAll();
        new Notice("DashFlow 索引已刷新");
      },
    });

    this.addSettingTab(new DashFlowSettingsTab(this.app, this));
    this.activityService.start();
    this.vaultIndex.initializeWhenReady();
    this.taskInteractions.start();
    this.activityWidgets.start();
    this.habitWidgets.start();
    this.calendarWidgets.start();
    this.weeklyReviewWidgets.start();
    this.mobileDashboard.start();
    this.dashboardSwitcher.start();
  }

  onunload(): void {
    this.dashboardSwitcher?.stop();
    this.mobileDashboard?.stop();
    this.weeklyReviewWidgets?.stop();
    this.calendarWidgets?.stop();
    this.habitWidgets?.stop();
    this.activityWidgets?.stop();
    this.taskInteractions?.stop();
    this.activityService?.stop();
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

  refreshDashboardViews(): void {
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) {
      const view = leaf.view as unknown as { refresh?: () => void };
      view.refresh?.();
    }
  }

  private async loadPluginData(): Promise<void> {
    const loaded = await this.loadData() as (Partial<DashFlowData> & {
      activity?: Partial<ActivityStore>;
    }) | null;

    this.data = {
      schemaVersion: SCHEMA_VERSION,
      settings: {
        ...DEFAULT_SETTINGS,
        ...(loaded?.settings ?? {}),
      },
      dashboards: Array.isArray(loaded?.dashboards) ? loaded.dashboards : [],
      activeDashboardId: loaded?.activeDashboardId ?? "home",
      activity: {
        startedAt: loaded?.activity?.startedAt ?? localDate(),
        days: loaded?.activity?.days ?? {},
      },
    };

    if (this.data.dashboards.length === 0) {
      this.data.dashboards = [createDefaultDashboard(this.widgetRegistry)];
      this.data.activeDashboardId = "home";
    }

    await this.savePluginData();
  }

  async savePluginData(): Promise<void> {
    await this.saveData(this.data);
  }
}

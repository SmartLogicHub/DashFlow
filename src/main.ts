import { Notice, Plugin } from "obsidian";
import { DEFAULT_SETTINGS, SCHEMA_VERSION, VIEW_TYPE } from "./constants";
import { DashboardManager } from "./dashboard/DashboardManager";
import { DashboardView } from "./dashboard/DashboardView";
import { createDefaultDashboard } from "./dashboard/defaultDashboard";
import type { DashFlowData } from "./models";
import { CaptureService } from "./services/CaptureService";
import { ProjectService } from "./services/ProjectService";
import { TaskService } from "./services/TaskService";
import { VaultIndexService } from "./services/VaultIndexService";
import { DashFlowSettingsTab } from "./settings/DashFlowSettingsTab";
import { registerBuiltins } from "./widgets/builtins";
import { WidgetRegistry } from "./widgets/WidgetRegistry";

export default class DashFlowPlugin extends Plugin {
  data!: DashFlowData;
  widgetRegistry!: WidgetRegistry;
  dashboardManager!: DashboardManager;
  vaultIndex!: VaultIndexService;
  taskService!: TaskService;
  projectService!: ProjectService;
  captureService!: CaptureService;

  async onload(): Promise<void> {
    this.widgetRegistry = new WidgetRegistry();
    registerBuiltins(this.widgetRegistry);
    await this.loadPluginData();

    this.dashboardManager = new DashboardManager(this, this.widgetRegistry);
    this.vaultIndex = new VaultIndexService(
      this.app,
      this,
      () => this.data.settings.projectTypeValue,
    );
    this.taskService = new TaskService(this.app, this.vaultIndex);
    this.projectService = new ProjectService(this.vaultIndex);
    this.captureService = new CaptureService(
      this.app,
      () => this.data.settings.inboxPath,
    );

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
    this.vaultIndex.initializeWhenReady();
  }

  onunload(): void {
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

  private async loadPluginData(): Promise<void> {
    const loaded = await this.loadData() as Partial<DashFlowData> | null;
    this.data = {
      schemaVersion: SCHEMA_VERSION,
      settings: {
        ...DEFAULT_SETTINGS,
        ...(loaded?.settings ?? {}),
      },
      dashboards: Array.isArray(loaded?.dashboards) ? loaded.dashboards : [],
      activeDashboardId: loaded?.activeDashboardId ?? "home",
    };

    if (this.data.dashboards.length === 0) {
      this.data.dashboards = [createDefaultDashboard(this.widgetRegistry)];
      this.data.activeDashboardId = "home";
      await this.savePluginData();
    }
  }

  async savePluginData(): Promise<void> {
    await this.saveData(this.data);
  }
}

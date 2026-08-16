import type { DashFlowSettings } from "./models";

export const VIEW_TYPE = "dashflow-dashboard";
export const SCHEMA_VERSION = 5 as const;
export const PLUGIN_VERSION = "0.3.1";

export const DEFAULT_SETTINGS: DashFlowSettings = {
  inboxPath: "DashFlow/Inbox.md",
  projectTypeValue: "project",
  projectFolder: "DashFlow/Projects",
  habitTypeValue: "habit",
  habitFolder: "DashFlow/Habits",
  aiEnabled: false,
  aiBaseUrl: "https://api.deepseek.com",
  aiModel: "deepseek-v4-flash",
  aiSecretId: "",
};

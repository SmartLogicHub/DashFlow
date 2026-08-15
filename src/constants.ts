import type { DashFlowSettings } from "./models";

export const VIEW_TYPE = "dashflow-dashboard";
export const SCHEMA_VERSION = 3 as const;
export const PLUGIN_VERSION = "0.2.1";

export const DEFAULT_SETTINGS: DashFlowSettings = {
  inboxPath: "DashFlow/Inbox.md",
  projectTypeValue: "project",
  habitTypeValue: "habit",
  habitFolder: "DashFlow/Habits",
};

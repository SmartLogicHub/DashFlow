import type { DashFlowSettings } from "./models";

export const VIEW_TYPE = "dashflow-dashboard";
export const SCHEMA_VERSION = 1 as const;
export const PLUGIN_VERSION = "0.1.0";

export const DEFAULT_SETTINGS: DashFlowSettings = {
  inboxPath: "DashFlow/Inbox.md",
  projectTypeValue: "project",
};

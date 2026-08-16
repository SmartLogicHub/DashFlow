import type { DashFlowSettings } from "./models";

export const VIEW_TYPE = "dashflow-dashboard";
export const SCHEMA_VERSION = 7 as const;
export const PLUGIN_VERSION = "0.5.3";

export const DEFAULT_SETTINGS: DashFlowSettings = {
  inboxPath: "DashFlow/Inbox.md",
  projectTypeValue: "project",
  projectFolder: "DashFlow/Projects",
  habitTypeValue: "habit",
  habitFolder: "DashFlow/Habits",
  homeTheme: "alpine",
  homeHeroImagePath: "",
  homeHeroTitle: "我的成长",
  homeHeroSubtitle: "把输入变成理解，把理解变成行动。",
  homeHeroOverlay: 32,
  weReadEnabled: false,
  weReadSecretId: "",
  weReadShowOnHome: true,
  aiEnabled: false,
  aiBaseUrl: "https://api.deepseek.com",
  aiModel: "deepseek-v4-flash",
  aiSecretId: "",
  aiMorningBriefingEnabled: false,
  dailyNoteFolder: "",
  dailyNoteDateFormat: "YYYY-MM-DD",
  quickCaptureTarget: "inbox",
  dailyCaptureHeading: "## 闪念",
  contextMorningDashboardId: "home",
  contextWorkDashboardId: "",
  contextReviewDashboardId: "",
};

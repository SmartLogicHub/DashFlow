import { PRODUCT_SECTIONS, type ProductSection } from "./navigation";

export type CommandCategory = "feature" | "navigation" | "maintenance";
export type CommandAction =
  | "open-dashboard"
  | "open-section"
  | "quick-add"
  | "workflow-settings"
  | "search"
  | "new-task"
  | "new-project"
  | "new-habit"
  | "ai-plan"
  | "configure-morning-briefing"
  | "refresh-morning-briefing"
  | "export-dashboard"
  | "import-dashboard"
  | "reindex-vault";

export interface CommandDefinition {
  id: string;
  name: string;
  category: CommandCategory;
  action: CommandAction;
  featureId?: string;
  section?: ProductSection;
}

const FEATURE_COMMANDS: readonly CommandDefinition[] = [
  { id: "quick-add", name: "快速添加", category: "feature", action: "quick-add", featureId: "quick-add" },
  { id: "configure-workflow-context", name: "配置快速捕捉与情景模式", category: "feature", action: "workflow-settings", featureId: "workflow-settings" },
  { id: "search-dashflow", name: "搜索任务、项目与习惯", category: "feature", action: "search", featureId: "search" },
  { id: "new-task", name: "新建任务", category: "feature", action: "new-task", featureId: "new-task" },
  { id: "new-project", name: "新建项目", category: "feature", action: "new-project", featureId: "new-project" },
  { id: "new-habit", name: "新建习惯", category: "feature", action: "new-habit", featureId: "new-habit" },
  { id: "ai-plan-today", name: "AI 规划今天", category: "feature", action: "ai-plan", featureId: "ai-plan" },
  { id: "configure-ai-morning-briefing", name: "配置 AI 晨间简报", category: "feature", action: "configure-morning-briefing", featureId: "morning-briefing" },
  { id: "refresh-ai-morning-briefing", name: "刷新 AI 晨间简报", category: "feature", action: "refresh-morning-briefing", featureId: "morning-briefing" },
];

const NAVIGATION_COMMANDS: readonly CommandDefinition[] = [
  { id: "open-dashboard", name: "打开 DashFlow", category: "navigation", action: "open-dashboard" },
  ...PRODUCT_SECTIONS.map((section): CommandDefinition => ({
    id: `open-${section.id}`,
    name: `打开 · ${section.label}`,
    category: "navigation",
    action: "open-section",
    section: section.id,
  })),
];

const MAINTENANCE_COMMANDS: readonly CommandDefinition[] = [
  { id: "export-active-dashboard", name: "导出当前工作台 JSON", category: "maintenance", action: "export-dashboard" },
  { id: "import-dashboard-json", name: "导入工作台 JSON", category: "maintenance", action: "import-dashboard" },
  { id: "reindex-vault", name: "重新索引知识库", category: "maintenance", action: "reindex-vault" },
];

export const COMMAND_CATALOG: readonly CommandDefinition[] = [
  ...NAVIGATION_COMMANDS,
  ...FEATURE_COMMANDS,
  ...MAINTENANCE_COMMANDS,
];

export const FEATURE_COMMAND_IDS: ReadonlySet<string> = new Set(FEATURE_COMMANDS.map((command) => command.id));
export const NAVIGATION_COMMAND_IDS: ReadonlySet<string> = new Set(NAVIGATION_COMMANDS.map((command) => command.id));
export const MAINTENANCE_COMMAND_IDS: ReadonlySet<string> = new Set(MAINTENANCE_COMMANDS.map((command) => command.id));

import type { OpportunityBoardWidgetConfig, WidgetDefinition } from "../models";
import type { WidgetRegistry } from "./WidgetRegistry";

export function registerOpportunityWidgets(registry: WidgetRegistry): void {
  const definition: WidgetDefinition<OpportunityBoardWidgetConfig> = {
    type: "opportunity-board",
    name: "灵感收集",
    description: "收集 → 评估 → 进行 → 完成的灵感看板，数据存单个 Markdown 文件。",
    icon: "◈",
    defaultSize: { w: 12, h: 8 },
    minSize: { w: 8, h: 6 },
    settings: [
      {
        key: "file",
        type: "text",
        label: "数据文件",
        description: "看板条目存储的 Markdown 文件路径。",
        placeholder: "DashFlow/Inbox Board.md",
      },
    ],
    defaultConfig: (): OpportunityBoardWidgetConfig => ({ file: "DashFlow/Inbox Board.md" }),
  };
  registry.register(definition);
}

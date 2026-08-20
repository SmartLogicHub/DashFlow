import type { ProjectKanbanWidgetConfig, WidgetDefinition } from "../models";
import type { WidgetRegistry } from "./WidgetRegistry";

export function registerKanbanWidgets(registry: WidgetRegistry): void {
  const definition: WidgetDefinition<ProjectKanbanWidgetConfig> = {
    type: "project-kanban",
    name: "项目看板",
    description: "按状态分列的项目看板，拖拽卡片即可改变项目状态。",
    icon: "▤",
    defaultSize: { w: 12, h: 7 },
    minSize: { w: 8, h: 5 },
    settings: [
      {
        key: "showArchived",
        type: "toggle",
        label: "显示已归档",
        description: "是否显示「已归档」列。",
      },
    ],
    defaultConfig: (): ProjectKanbanWidgetConfig => ({ showArchived: false }),
  };
  registry.register(definition);
}

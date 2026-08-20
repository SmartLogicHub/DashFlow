import type { ProjectGanttWidgetConfig, WidgetDefinition } from "../models";
import type { WidgetRegistry } from "./WidgetRegistry";

export function registerGanttWidgets(registry: WidgetRegistry): void {
  const definition: WidgetDefinition<ProjectGanttWidgetConfig> = {
    type: "project-gantt",
    name: "项目时间轴",
    description: "把带起止日期的项目画成时间轴，看它们何时开始、截止与重叠。",
    icon: "▥",
    defaultSize: { w: 12, h: 6 },
    minSize: { w: 8, h: 4 },
    settings: [
      {
        key: "showArchived",
        type: "toggle",
        label: "显示已归档",
        description: "是否把已归档项目也画进时间轴。",
      },
    ],
    defaultConfig: (): ProjectGanttWidgetConfig => ({ showArchived: false }),
  };
  registry.register(definition);
}

import type { DataFilterWidgetConfig, WidgetDefinition } from "../models";
import { DEFAULT_DATA_FILTER_CONFIG } from "../filter/dataFilter";
import type { WidgetRegistry } from "./WidgetRegistry";

export function registerDataWidgets(registry: WidgetRegistry): void {
  const definition: WidgetDefinition<DataFilterWidgetConfig> = {
    type: "data-filter",
    name: "数据筛选",
    description: "用可视条件实时筛选知识库中的任务、项目与习惯。",
    icon: "⌕",
    defaultSize: { w: 8, h: 7 },
    minSize: { w: 5, h: 5 },
    settings: [
      {
        key: "limit",
        type: "number",
        label: "结果上限",
        description: "限制卡片中最多显示多少条匹配结果。",
        min: 5,
        max: 100,
        step: 5,
      },
    ],
    defaultConfig: (): DataFilterWidgetConfig => ({ ...DEFAULT_DATA_FILTER_CONFIG }),
  };
  registry.register(definition);
}

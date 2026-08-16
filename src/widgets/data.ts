import type { DataFilterWidgetConfig, WidgetDefinition } from "../models";
import { DEFAULT_DATA_FILTER_CONFIG } from "../filter/dataFilter";
import type { WidgetRegistry } from "./WidgetRegistry";

export function registerDataWidgets(registry: WidgetRegistry): void {
  const definition: WidgetDefinition<DataFilterWidgetConfig> = {
    type: "data-filter",
    name: "Visual Data Filter",
    description: "用可视条件实时筛选 Vault 中的 Task、Project 与 Habit。",
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

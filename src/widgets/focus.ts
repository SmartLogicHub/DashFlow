import type { FocusWidgetConfig, WidgetDefinition } from "../models";
import { DEFAULT_FOCUS_CONFIG } from "../focus/focusTimer";
import type { WidgetRegistry } from "./WidgetRegistry";

export function registerFocusWidgets(registry: WidgetRegistry): void {
  const definition: WidgetDefinition<FocusWidgetConfig> = {
    type: "focus",
    name: "专注计时",
    description: "时间戳驱动的专注与休息计时器，支持暂停、恢复与活跃度统计。",
    icon: "◎",
    defaultSize: { w: 4, h: 5 },
    minSize: { w: 3, h: 4 },
    settings: [
      { key: "focusMinutes", type: "number", label: "专注分钟", min: 1, max: 180, step: 1 },
      { key: "shortBreakMinutes", type: "number", label: "短休息分钟", min: 1, max: 60, step: 1 },
      { key: "longBreakMinutes", type: "number", label: "长休息分钟", min: 1, max: 90, step: 1 },
      { key: "longBreakEvery", type: "number", label: "长休息间隔", description: "完成多少次专注后进入长休息。", min: 2, max: 12, step: 1 },
    ],
    defaultConfig: (): FocusWidgetConfig => ({ ...DEFAULT_FOCUS_CONFIG }),
  };
  registry.register(definition);
}

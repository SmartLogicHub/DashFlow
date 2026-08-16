import type { AINewsWidgetConfig, WidgetDefinition } from "../models";
import type { WidgetRegistry } from "./WidgetRegistry";

export function registerIntelligenceWidgets(registry: WidgetRegistry): void {
  const definition: WidgetDefinition<AINewsWidgetConfig> = {
    type: "ai-news",
    name: "AI 早报",
    description: "从 RSS / Atom 信息源中去重，再按你的兴趣让 AI 选出最值得阅读的内容。",
    icon: "✦",
    defaultSize: { w: 6, h: 6 },
    minSize: { w: 4, h: 4 },
    settings: [
      {
        key: "sources",
        type: "text",
        label: "RSS / Atom 源",
        description: "使用换行、逗号或分号分隔多个 HTTP(S) Feed URL；最多 12 个。",
        placeholder: "https://example.com/feed.xml",
      },
      {
        key: "interests",
        type: "text",
        label: "我的兴趣",
        description: "AI 会按这里的主题与阅读价值筛选候选新闻。",
        placeholder: "AI Agent、Obsidian、独立开发、效率工具",
      },
      { key: "topK", type: "number", label: "精选条数", description: "每次展示 1–8 条，建议 3 条。", min: 1, max: 8, step: 1 },
      { key: "refreshHours", type: "number", label: "RSS 刷新间隔", description: "限制外部抓取频率；候选未变化时不会重复调用 AI。", min: 1, max: 24, step: 1 },
    ],
    defaultConfig: (): AINewsWidgetConfig => ({
      sources: "",
      interests: "AI、Obsidian、个人效率、独立开发",
      topK: 3,
      refreshHours: 4,
    }),
  };
  registry.register(definition);
}

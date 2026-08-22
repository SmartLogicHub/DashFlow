export interface RecommendedAiNewsSource {
  name: string;
  url: string;
}

export const RECOMMENDED_AI_NEWS_SOURCES = [
  { name: "OpenAI News", url: "https://openai.com/news/rss.xml" },
  { name: "Google AI", url: "https://blog.google/technology/ai/rss/" },
  { name: "Hugging Face Blog", url: "https://huggingface.co/blog/feed.xml" },
  { name: "Obsidian 更新日志", url: "https://obsidian.md/changelog.xml" },
  { name: "阮一峰的网络日志", url: "https://www.ruanyifeng.com/blog/atom.xml" },
  { name: "少数派", url: "https://sspai.com/feed" },
] as const satisfies readonly RecommendedAiNewsSource[];

export function recommendedAiNewsSourcesText(): string {
  return RECOMMENDED_AI_NEWS_SOURCES.map((source) => source.url).join("\n");
}

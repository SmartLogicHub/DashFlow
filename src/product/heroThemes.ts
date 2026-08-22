import type { HomeTheme } from "../models";

export type BundledHeroTheme = Exclude<HomeTheme, "obsidian">;

export interface HeroThemeChoice {
  id: HomeTheme;
  label: string;
  description: string;
  assetPath: string | null;
}

export const HERO_THEME_CHOICES: readonly HeroThemeChoice[] = [
  { id: "alpine", label: "雪山冷蓝", description: "清醒、专注的山谷晨光。", assetPath: "assets/heroes/alpine.webp" },
  { id: "paper", label: "海岸晨光", description: "柔和、留白的暖色海岸。", assetPath: "assets/heroes/paper.webp" },
  { id: "moss", label: "森屿", description: "苔绿森林与安静溪谷。", assetPath: "assets/heroes/moss.webp" },
  { id: "dune", label: "沙丘", description: "陶土暖金的层叠沙脊。", assetPath: "assets/heroes/dune.webp" },
  { id: "ink", label: "水墨", description: "灰白远山与东方留白。", assetPath: "assets/heroes/ink.webp" },
  { id: "blush", label: "樱雾", description: "低饱和粉灰的轻柔晨景。", assetPath: "assets/heroes/blush.webp" },
  { id: "midnight", label: "雾林深夜", description: "沉静、深邃的雾林夜色。", assetPath: "assets/heroes/midnight.webp" },
  { id: "aurora", label: "极光", description: "深青夜幕中的克制极光。", assetPath: "assets/heroes/aurora.webp" },
  { id: "obsidian", label: "跟随 Obsidian", description: "使用当前 Obsidian 配色，不显示场景图。", assetPath: null },
];

export function heroThemeChoice(theme: HomeTheme): HeroThemeChoice | undefined {
  return HERO_THEME_CHOICES.find((choice) => choice.id === theme);
}

export function isBundledHeroTheme(theme: HomeTheme): theme is BundledHeroTheme {
  return typeof heroThemeChoice(theme)?.assetPath === "string";
}

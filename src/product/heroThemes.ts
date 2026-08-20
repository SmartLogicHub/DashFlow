import type { HomeTheme } from "../models";

export type BundledHeroTheme = Exclude<HomeTheme, "obsidian">;

export interface HeroThemeChoice {
  id: HomeTheme;
  label: string;
  description: string;
  assetPath: string | null;
}

export const HERO_THEME_CHOICES: readonly HeroThemeChoice[] = [
  { id: "alpine", label: "Alpine · 雪山冷蓝", description: "清醒、专注的山谷晨光。", assetPath: "assets/heroes/alpine.webp" },
  { id: "paper", label: "Paper · 海岸晨光", description: "柔和、留白的海岸光线。", assetPath: "assets/heroes/paper.webp" },
  { id: "midnight", label: "Midnight · 雾林深色", description: "沉静、深度的雾林夜色。", assetPath: "assets/heroes/midnight.webp" },
  { id: "obsidian", label: "Obsidian · 跟随主题", description: "使用当前 Obsidian 的颜色，不使用场景图。", assetPath: null },
];

export function heroThemeChoice(theme: HomeTheme): HeroThemeChoice | undefined {
  return HERO_THEME_CHOICES.find((choice) => choice.id === theme);
}

export function isBundledHeroTheme(theme: HomeTheme): theme is BundledHeroTheme {
  return heroThemeChoice(theme)?.assetPath !== null;
}

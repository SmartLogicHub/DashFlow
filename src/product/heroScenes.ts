import { heroThemeChoice, type BundledHeroTheme } from "./heroThemes";

export type { BundledHeroTheme } from "./heroThemes";

export const BUNDLED_HERO_SCENES: Record<BundledHeroTheme, string> = {
  alpine: heroThemeChoice("alpine")!.assetPath!,
  paper: heroThemeChoice("paper")!.assetPath!,
  midnight: heroThemeChoice("midnight")!.assetPath!,
};

export function bundledHeroAssetPath(manifestDir: string, theme: BundledHeroTheme): string {
  return `${manifestDir.replace(/[\\/]+$/, "")}/${BUNDLED_HERO_SCENES[theme]}`;
}

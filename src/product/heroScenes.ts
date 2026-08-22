import { heroThemeChoice, type BundledHeroTheme } from "./heroThemes";

export type { BundledHeroTheme } from "./heroThemes";

export const BUNDLED_HERO_SCENES: Record<BundledHeroTheme, string> = {
  alpine: heroThemeChoice("alpine")!.assetPath!,
  paper: heroThemeChoice("paper")!.assetPath!,
  moss: heroThemeChoice("moss")!.assetPath!,
  dune: heroThemeChoice("dune")!.assetPath!,
  ink: heroThemeChoice("ink")!.assetPath!,
  blush: heroThemeChoice("blush")!.assetPath!,
  midnight: heroThemeChoice("midnight")!.assetPath!,
  aurora: heroThemeChoice("aurora")!.assetPath!,
};

export function bundledHeroAssetPath(manifestDir: string, theme: BundledHeroTheme): string {
  return `${manifestDir.replace(/[\\/]+$/, "")}/${BUNDLED_HERO_SCENES[theme]}`;
}

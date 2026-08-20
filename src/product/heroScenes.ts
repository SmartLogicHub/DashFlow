export type BundledHeroTheme = "alpine" | "paper" | "midnight";

export const BUNDLED_HERO_SCENES: Record<BundledHeroTheme, string> = {
  alpine: "assets/heroes/alpine-lake.png",
  paper: "assets/heroes/paper-coast.png",
  midnight: "assets/heroes/midnight-forest.png",
};

export function bundledHeroAssetPath(manifestDir: string, theme: BundledHeroTheme): string {
  return `${manifestDir.replace(/[\\/]+$/, "")}/${BUNDLED_HERO_SCENES[theme]}`;
}

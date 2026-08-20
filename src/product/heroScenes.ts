export type BundledHeroTheme = "alpine" | "paper" | "midnight";

export const BUNDLED_HERO_SCENES: Record<BundledHeroTheme, string> = {
  alpine: "assets/heroes/alpine.webp",
  paper: "assets/heroes/paper.webp",
  midnight: "assets/heroes/midnight.webp",
};

export function bundledHeroAssetPath(manifestDir: string, theme: BundledHeroTheme): string {
  return `${manifestDir.replace(/[\\/]+$/, "")}/${BUNDLED_HERO_SCENES[theme]}`;
}

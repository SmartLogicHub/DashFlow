import type { HomeTheme } from "../models";

export interface HomeThemeSetting {
  homeTheme: HomeTheme;
}

export async function persistHomeTheme(
  settings: HomeThemeSetting,
  nextTheme: HomeTheme,
  save: () => Promise<void>,
): Promise<void> {
  const previousTheme = settings.homeTheme;
  settings.homeTheme = nextTheme;
  try {
    await save();
  } catch (error) {
    settings.homeTheme = previousTheme;
    throw error;
  }
}

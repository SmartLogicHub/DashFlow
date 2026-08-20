import type { ProductSection } from "./navigation";

const FOCUSED_WIDGET_TYPES: Partial<Record<ProductSection, ReadonlySet<string>>> = {
  projects: new Set(["projects"]),
  calendar: new Set(["calendar"]),
  habits: new Set(["habits", "heatmap"]),
  review: new Set(["weekly-review", "heatmap", "vault-stats"]),
};

export function isWidgetVisibleInSection(
  section: ProductSection,
  type: string,
  hidden: boolean | undefined,
): boolean {
  if (hidden === true) return false;
  if (section === "work") return true;
  return FOCUSED_WIDGET_TYPES[section]?.has(type) ?? false;
}

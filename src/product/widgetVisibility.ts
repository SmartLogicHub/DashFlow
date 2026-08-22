import type { ProductSection } from "./navigation";
import { sectionPolicy } from "./sectionPolicy";

export function isWidgetVisibleInSection(
  section: ProductSection,
  type: string,
  hidden: boolean | undefined,
): boolean {
  if (hidden === true) return false;
  if (section === "work") return true;
  return sectionPolicy(section)?.widgetTypes.includes(type) ?? false;
}

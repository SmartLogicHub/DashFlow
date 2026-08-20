import { sectionDefinition, type ProductSection } from "./navigation";

export interface HeroPresentation {
  eyebrow: string;
  title: string;
  description: string;
  compact: boolean;
}

const EYEBROWS: Record<ProductSection, string> = {
  today: "DASHFLOW · 今日节奏",
  work: "DASHFLOW · 工作节奏",
  inbox: "DASHFLOW · 收集整理",
  projects: "DASHFLOW · 项目推进",
  calendar: "DASHFLOW · 时间安排",
  habits: "DASHFLOW · 长期习惯",
  review: "DASHFLOW · 周期复盘",
};

export function heroPresentationFor(section: ProductSection): HeroPresentation {
  const definition = sectionDefinition(section);
  return {
    eyebrow: EYEBROWS[section],
    title: definition.title,
    description: definition.description,
    compact: section !== "today",
  };
}

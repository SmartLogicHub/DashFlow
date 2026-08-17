import type { Task, VaultSnapshot } from "../models";

export type ProductSection = "today" | "work" | "learning" | "inbox" | "projects" | "calendar" | "habits" | "review";

export interface ProductSectionDefinition {
  id: ProductSection;
  label: string;
  icon: string;
  title: string;
  description: string;
}

export const PRODUCT_SECTIONS: ProductSectionDefinition[] = [
  { id: "today", label: "主页", icon: "home", title: "主页", description: "把今天、长期领域和个人成长放在同一个入口。" },
  { id: "work", label: "工作台", icon: "layout-dashboard", title: "工作台", description: "高密度查看任务、项目、进度、提醒与 Activity。" },
  { id: "learning", label: "学习", icon: "graduation-cap", title: "学习", description: "用目标、基线、主动练习、证据和错误形成可验证的成长闭环。" },
  { id: "inbox", label: "收集箱", icon: "inbox", title: "收集箱", description: "先记下来，再决定什么时候做、属于哪个项目。" },
  { id: "projects", label: "项目", icon: "folder-kanban", title: "项目", description: "看清长期目标、进度和下一步行动。" },
  { id: "calendar", label: "日历", icon: "calendar-days", title: "日历", description: "把计划、截止日期和习惯放回时间轴。" },
  { id: "habits", label: "习惯", icon: "repeat-2", title: "习惯", description: "跟踪长期节奏，而不是制造更多待办。" },
  { id: "review", label: "复盘", icon: "bar-chart-3", title: "复盘", description: "回顾本周发生了什么，再决定下一周。" },
];

const SECTION_WIDGET_TYPES: Record<ProductSection, string[]> = {
  today: [],
  work: ["quick-capture", "tasks", "progress", "projects", "upcoming", "heatmap", "countdown"],
  learning: [],
  inbox: [],
  projects: ["projects"],
  calendar: ["calendar"],
  habits: ["habits", "heatmap"],
  review: ["weekly-review", "heatmap", "vault-stats"],
};

export function sectionWidgetTypes(section: ProductSection): string[] {
  return [...SECTION_WIDGET_TYPES[section]];
}

export function sectionDefinition(section: ProductSection): ProductSectionDefinition {
  return PRODUCT_SECTIONS.find((item) => item.id === section) ?? PRODUCT_SECTIONS[0]!;
}

/**
 * Inbox is a workflow state, not merely a file location. A task stops being
 * "unprocessed" as soon as the user gives it a project or a meaningful date.
 * The Markdown line can stay in Inbox.md; DashFlow does not need to move data
 * just to reflect that the decision has been made.
 */
export function inboxTasks(tasks: Task[], inboxPath: string): Task[] {
  const normalized = inboxPath.replace(/\\/g, "/").replace(/^\/+/, "");
  return tasks
    .filter((task) => {
      if (task.completed) return false;
      if (task.source.path.replace(/\\/g, "/") !== normalized) return false;
      return !task.projectId && !task.start && !task.scheduled && !task.due;
    })
    .sort((a, b) => a.text.localeCompare(b.text));
}

export interface TodaySummary {
  focus: number;
  overdue: number;
  projects: number;
  habitsDone: number;
  habitsScheduled: number;
}

export function todaySummary(snapshot: VaultSnapshot, today: string): TodaySummary {
  const focusIds = new Set(
    snapshot.tasks
      .filter((task) => !task.completed && (task.due === today || task.scheduled === today))
      .map((task) => task.id),
  );
  const overdue = snapshot.tasks.filter(
    (task) => !task.completed && Boolean(task.due) && (task.due as string) < today,
  );
  overdue.forEach((task) => focusIds.add(task.id));

  const habitsScheduled = snapshot.habits.filter((habit) => {
    if (habit.status !== "active") return false;
    if (habit.start && habit.start > today) return false;
    if (habit.end && habit.end < today) return false;
    if (habit.frequency === "weekdays") {
      const day = new Date(`${today}T12:00:00`).getDay();
      return day >= 1 && day <= 5;
    }
    return true;
  });

  return {
    focus: focusIds.size,
    overdue: overdue.length,
    projects: snapshot.projects.filter((project) => project.status === "active").length,
    habitsDone: habitsScheduled.filter((habit) => habit.completedDates.includes(today)).length,
    habitsScheduled: habitsScheduled.length,
  };
}

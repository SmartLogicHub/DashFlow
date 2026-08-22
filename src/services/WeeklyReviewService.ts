import type {
  CalendarEvent,
  Habit,
  Project,
  Task,
  WeeklyReviewWidgetConfig,
} from "../models";
import { localDate } from "../utils/date";
import {
  activityChangePercent,
  shiftWeek,
  weekRange,
  weeklyActivityTotals,
  weeklyHabitStats,
  type WeekRange,
  type WeeklyActivityTotals,
  type WeeklyHabitStats,
} from "../weekly/weeklyReviewMath";
import type { ActivityService } from "./ActivityService";
import type { CalendarService } from "./CalendarService";
import type { ProjectService } from "./ProjectService";
import type { VaultIndexService } from "./VaultIndexService";

const PRIORITY_WEIGHT = { urgent: 0, high: 1, normal: 2, low: 3 } as const;

export interface WeeklyReviewProject {
  project: Project;
  progress: number;
}

export interface WeeklyReviewHabit {
  habit: Habit;
  stats: WeeklyHabitStats;
}

export interface WeeklyReviewDailyProgress extends WeeklyReviewHabit {
  notes: Array<{ date: string; note: string }>;
}

export interface WeeklyReviewData {
  anchor: string;
  week: WeekRange;
  previousWeek: WeekRange;
  nextWeek: WeekRange;
  activity: WeeklyActivityTotals;
  previousActivity: WeeklyActivityTotals;
  activityChange: number | null;
  activityPartial: boolean;
  attentionTasks: Task[];
  projects: WeeklyReviewProject[];
  habits: WeeklyReviewHabit[];
  habitScheduled: number;
  habitCompleted: number;
  habitRate: number;
  dailyProgress: WeeklyReviewDailyProgress[];
  dailyProgressScheduled: number;
  dailyProgressCompleted: number;
  dailyProgressRate: number;
  dailyProgressNoteCount: number;
  nextWeekEvents: CalendarEvent[];
}

export class WeeklyReviewService {
  constructor(
    private readonly index: VaultIndexService,
    private readonly activity: ActivityService,
    private readonly projects: ProjectService,
    private readonly calendar: CalendarService,
  ) {}

  review(config: WeeklyReviewWidgetConfig, anchor = localDate()): WeeklyReviewData {
    const week = weekRange(anchor, config.weekStart === "sunday" ? "sunday" : "monday");
    const previousWeek = shiftWeek(week, -1);
    const nextWeek = shiftWeek(week, 1);
    const store = this.activity.getStore();
    const activity = weeklyActivityTotals(store, week);
    const previousActivity = weeklyActivityTotals(store, previousWeek);
    const snapshot = this.index.getSnapshot();

    const attentionTasks = snapshot.tasks
      .filter((task) => !task.completed && Boolean(task.due) && (task.due as string) <= week.end)
      .sort((a, b) => this.taskAttentionOrder(a, b, anchor));

    const projects = this.projects.active()
      .map((project) => ({ project, progress: this.projects.progress(project) }))
      .sort((a, b) => (a.project.deadline ?? "9999").localeCompare(b.project.deadline ?? "9999")
        || a.progress - b.progress
        || a.project.name.localeCompare(b.project.name));

    const activeHabits = snapshot.habits.filter((habit) => habit.status === "active");
    const habits = activeHabits
      .filter((habit) => habit.kind !== "daily-progress")
      .map((habit) => ({ habit, stats: weeklyHabitStats(habit, week) }))
      .filter((item) => item.stats.scheduled > 0)
      .sort((a, b) => a.stats.rate - b.stats.rate || a.habit.name.localeCompare(b.habit.name));

    const habitScheduled = habits.reduce((sum, item) => sum + item.stats.scheduled, 0);
    const habitCompleted = habits.reduce((sum, item) => sum + item.stats.completed, 0);
    const habitRate = habitScheduled === 0 ? 0 : Math.round((habitCompleted / habitScheduled) * 100);

    const dailyProgress = activeHabits
      .filter((habit) => habit.kind === "daily-progress")
      .map((habit): WeeklyReviewDailyProgress => ({
        habit,
        stats: weeklyHabitStats(habit, week),
        notes: Object.entries(habit.dailyNotes ?? {})
          .filter(([date, note]) => date >= week.start && date <= week.end && Boolean(note.trim()))
          .map(([date, note]) => ({ date, note: note.trim() }))
          .sort((a, b) => b.date.localeCompare(a.date)),
      }))
      .filter((item) => item.stats.scheduled > 0)
      .sort((a, b) => a.stats.rate - b.stats.rate || a.habit.name.localeCompare(b.habit.name));

    const dailyProgressScheduled = dailyProgress.reduce((sum, item) => sum + item.stats.scheduled, 0);
    const dailyProgressCompleted = dailyProgress.reduce((sum, item) => sum + item.stats.completed, 0);
    const dailyProgressRate = dailyProgressScheduled === 0
      ? 0
      : Math.round((dailyProgressCompleted / dailyProgressScheduled) * 100);
    const dailyProgressNoteCount = dailyProgress.reduce((sum, item) => sum + item.notes.length, 0);

    const nextWeekEvents = this.calendar.eventsBetween(nextWeek.start, nextWeek.end, {
      weekStart: config.weekStart === "sunday" ? "sunday" : "monday",
      showTasks: true,
      showProjects: true,
      showHabits: false,
      showCompletedTasks: false,
      agendaLimit: 100,
    }).filter((event) => event.kind !== "habit" && !event.completed);

    return {
      anchor,
      week,
      previousWeek,
      nextWeek,
      activity,
      previousActivity,
      activityChange: activityChangePercent(activity.score, previousActivity.score),
      activityPartial: store.startedAt > week.start && store.startedAt <= week.end,
      attentionTasks,
      projects,
      habits,
      habitScheduled,
      habitCompleted,
      habitRate,
      dailyProgress,
      dailyProgressScheduled,
      dailyProgressCompleted,
      dailyProgressRate,
      dailyProgressNoteCount,
      nextWeekEvents,
    };
  }

  toMarkdown(review: WeeklyReviewData, config: WeeklyReviewWidgetConfig): string {
    const carryLimit = this.safeLimit(config.carryoverLimit, 8, 50);
    const projectLimit = this.safeLimit(config.projectLimit, 6, 30);
    const nextLimit = this.safeLimit(config.nextWeekLimit, 8, 50);
    const lines = [
      `## 每周复盘 · ${review.week.start} → ${review.week.end}`,
      "",
      `- 完成任务：${review.activity.tasksCompleted}`,
      `- 活跃天数：${review.activity.activeDays}/7`,
      `- 活跃度得分：${review.activity.score}`,
      `- 习惯：${review.habitCompleted}/${review.habitScheduled}（${review.habitRate}%）`,
      `- 每日推进：${review.dailyProgressCompleted}/${review.dailyProgressScheduled}（${review.dailyProgressRate}%）`,
      `- 日更备注：${review.dailyProgressNoteCount}`,
      `- 笔记活动：${review.activity.notesTouched}`,
      "",
      "### 需要处理",
    ];

    if (review.attentionTasks.length === 0) lines.push("- 无");
    else for (const task of review.attentionTasks.slice(0, carryLimit)) {
      lines.push(`- [ ] ${task.text}${task.due ? ` · ${task.due}` : ""}`);
    }

    lines.push("", "### 项目", ...this.projectMarkdown(review.projects.slice(0, projectLimit)));

    if (config.showHabits !== false) {
      lines.push("", "### 习惯");
      if (review.habits.length === 0) lines.push("- 无");
      else for (const item of review.habits) {
        lines.push(`- ${item.habit.name}：${item.stats.completed}/${item.stats.scheduled}（${item.stats.rate}%）`);
      }
    }

    lines.push("", "### 每日推进");
    if (review.dailyProgress.length === 0) lines.push("- 无长期日更任务");
    else for (const item of review.dailyProgress) {
      lines.push(`- ${item.habit.name}：${item.stats.completed}/${item.stats.scheduled}（${item.stats.rate}%）`);
      for (const note of item.notes) lines.push(`  - ${note.date} · ${note.note}`);
    }

    lines.push("", `### 下周 · ${review.nextWeek.start} → ${review.nextWeek.end}`);
    if (review.nextWeekEvents.length === 0) lines.push("- 暂无任务或项目截止日");
    else for (const event of review.nextWeekEvents.slice(0, nextLimit)) {
      lines.push(`- ${event.date} · ${this.eventMarkdownLabel(event)} · ${event.title}`);
    }

    if (review.activityPartial) {
      lines.push("", "> 活跃度数据从本周中途开始累计，本周统计为部分数据。");
    }
    return lines.join("\n");
  }

  private projectMarkdown(items: WeeklyReviewProject[]): string[] {
    if (items.length === 0) return ["- 无活动项目"];
    return items.map(({ project, progress }) =>
      `- ${project.name}：${progress}%${project.deadline ? ` · 截止 ${project.deadline}` : ""}`);
  }

  private eventMarkdownLabel(event: CalendarEvent): string {
    if (event.kind === "project-deadline") return "项目";
    if (event.kind === "task-scheduled") return "计划";
    return "截止";
  }

  private taskAttentionOrder(a: Task, b: Task, anchor: string): number {
    const aOverdue = (a.due as string) < anchor ? 0 : 1;
    const bOverdue = (b.due as string) < anchor ? 0 : 1;
    return aOverdue - bOverdue
      || (a.due as string).localeCompare(b.due as string)
      || PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]
      || a.text.localeCompare(b.text);
  }

  private safeLimit(value: unknown, fallback: number, max: number): number {
    const number = typeof value === "number" && Number.isFinite(value) ? Math.round(value) : fallback;
    return Math.max(1, Math.min(max, number));
  }
}

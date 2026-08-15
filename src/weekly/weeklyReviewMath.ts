import type { ActivityStore, CalendarWeekStart, Habit } from "../models";
import { activityScore } from "../activity/activityMath";
import { habitCompletedOn, habitScheduledOn } from "../habits/habitMath";
import { addDays, localDate } from "../utils/date";

export interface WeekRange {
  start: string;
  end: string;
}

export interface WeeklyActivityTotals {
  score: number;
  activeDays: number;
  tasksCreated: number;
  tasksCompleted: number;
  habitChecks: number;
  notesCreated: number;
  notesModified: number;
  notesTouched: number;
}

export interface WeeklyHabitStats {
  scheduled: number;
  completed: number;
  rate: number;
}

export function weekRange(
  anchor = localDate(),
  weekStart: CalendarWeekStart = "monday",
): WeekRange {
  const weekday = new Date(`${anchor}T12:00:00`).getDay();
  const offset = weekStart === "monday" ? (weekday + 6) % 7 : weekday;
  const start = addDays(anchor, -offset);
  return { start, end: addDays(start, 6) };
}

export function shiftWeek(range: WeekRange, weeks: number): WeekRange {
  const days = Math.trunc(weeks) * 7;
  return {
    start: addDays(range.start, days),
    end: addDays(range.end, days),
  };
}

export function weeklyActivityTotals(
  store: ActivityStore,
  range: WeekRange,
): WeeklyActivityTotals {
  const totals: WeeklyActivityTotals = {
    score: 0,
    activeDays: 0,
    tasksCreated: 0,
    tasksCompleted: 0,
    habitChecks: 0,
    notesCreated: 0,
    notesModified: 0,
    notesTouched: 0,
  };

  let cursor = range.start;
  for (let guard = 0; guard < 7 && cursor <= range.end; guard += 1) {
    const day = store.days[cursor];
    const score = activityScore(day);
    totals.score += score;
    if (score > 0) totals.activeDays += 1;
    totals.tasksCreated += day?.tasksCreated ?? 0;
    totals.tasksCompleted += day?.tasksCompleted ?? 0;
    totals.habitChecks += day?.habitsCompleted ?? 0;
    totals.notesCreated += day?.notesCreated ?? 0;
    totals.notesModified += day?.notesModified ?? 0;
    cursor = addDays(cursor, 1);
  }

  totals.notesTouched = totals.notesCreated + totals.notesModified;
  return totals;
}

export function activityChangePercent(current: number, previous: number): number | null {
  if (previous <= 0) return current <= 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 100);
}

export function weeklyHabitStats(habit: Habit, range: WeekRange): WeeklyHabitStats {
  let scheduled = 0;
  let completed = 0;
  let cursor = range.start;

  for (let guard = 0; guard < 7 && cursor <= range.end; guard += 1) {
    if (habitScheduledOn(habit, cursor)) {
      scheduled += 1;
      if (habitCompletedOn(habit, cursor)) completed += 1;
    }
    cursor = addDays(cursor, 1);
  }

  return {
    scheduled,
    completed,
    rate: scheduled === 0 ? 0 : Math.round((completed / scheduled) * 100),
  };
}

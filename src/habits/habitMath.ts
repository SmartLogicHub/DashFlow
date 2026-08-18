import type { Habit } from "../models";
import { addDays, localDate } from "../utils/date";

function weekday(date: string): number {
  return new Date(`${date}T12:00:00`).getDay();
}

export function habitScheduledOn(habit: Habit, date: string): boolean {
  if (habit.start && date < habit.start) return false;
  if (habit.end && date > habit.end) return false;
  if (habit.frequency === "weekdays") {
    const day = weekday(date);
    return day >= 1 && day <= 5;
  }
  return true;
}

export function habitCompletedOn(habit: Habit, date: string): boolean {
  return habit.completedDates.includes(date);
}

export function habitHistory(
  habit: Habit,
  count: number,
  endDate = localDate(),
): Array<{ date: string; scheduled: boolean; completed: boolean }> {
  const safeCount = Math.max(1, Math.floor(count));
  const start = addDays(endDate, -(safeCount - 1));
  const completedDates = new Set(habit.completedDates);
  return Array.from({ length: safeCount }, (_, index) => {
    const date = addDays(start, index);
    return {
      date,
      scheduled: habitScheduledOn(habit, date),
      completed: completedDates.has(date),
    };
  });
}

export function habitCurrentStreak(habit: Habit, endDate = localDate()): number {
  let cursor = endDate;
  let streak = 0;
  const completedDates = new Set(habit.completedDates);

  for (let guard = 0; guard < 800; guard += 1) {
    if (habit.start && cursor < habit.start) break;
    if (habitScheduledOn(habit, cursor)) {
      if (!completedDates.has(cursor)) break;
      streak += 1;
    }
    cursor = addDays(cursor, -1);
  }

  return streak;
}

export function habitStats(habit: Habit, days = 30, endDate = localDate()): {
  scheduled: number;
  completed: number;
  rate: number;
  streak: number;
} {
  const history = habitHistory(habit, days, endDate);
  const scheduled = history.filter((day) => day.scheduled).length;
  const completed = history.filter((day) => day.scheduled && day.completed).length;
  return {
    scheduled,
    completed,
    rate: scheduled === 0 ? 0 : Math.round((completed / scheduled) * 100),
    streak: habitCurrentStreak(habit, endDate),
  };
}

export function habitTargetProgress(habit: Habit, endDate = localDate()): number {
  if (!habit.targetDays) return habitStats(habit, 30, endDate).rate;
  const completed = new Set(
    habit.completedDates.filter((date) => date <= endDate && habitScheduledOn(habit, date)),
  ).size;
  return Math.min(100, Math.round((completed / habit.targetDays) * 100));
}

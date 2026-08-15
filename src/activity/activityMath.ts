import type { ActivityMetric, ActivityStore, DailyActivity } from "../models";
import { addDays, localDate } from "../utils/date";

export function emptyDailyActivity(date: string): DailyActivity {
  return {
    date,
    notesCreated: 0,
    notesModified: 0,
    tasksCreated: 0,
    tasksCompleted: 0,
    habitsCompleted: 0,
    createdNoteKeys: [],
    modifiedNoteKeys: [],
    createdTaskKeys: [],
    completedTaskKeys: [],
    completedHabitKeys: [],
  };
}

export function activityScore(day?: DailyActivity): number {
  if (!day) return 0;
  return (day.tasksCompleted ?? 0) * 4
    + (day.tasksCreated ?? 0)
    + (day.notesCreated ?? 0) * 3
    + (day.notesModified ?? 0)
    + (day.habitsCompleted ?? 0) * 3;
}

export function activityMetricValue(day: DailyActivity | undefined, metric: ActivityMetric): number {
  if (!day) return 0;
  if (metric === "tasks") return (day.tasksCreated ?? 0) + (day.tasksCompleted ?? 0);
  if (metric === "notes") return (day.notesCreated ?? 0) + (day.notesModified ?? 0);
  if (metric === "habits") return day.habitsCompleted ?? 0;
  return activityScore(day);
}

export function activityRange(
  store: ActivityStore,
  count: number,
  metric: ActivityMetric,
  endDate = localDate(),
): Array<{ date: string; value: number; activity?: DailyActivity }> {
  const safeCount = Math.max(1, Math.floor(count));
  const startDate = addDays(endDate, -(safeCount - 1));
  return Array.from({ length: safeCount }, (_, index) => {
    const date = addDays(startDate, index);
    const activity = store.days[date];
    return { date, value: activityMetricValue(activity, metric), activity };
  });
}

export function activityStreak(store: ActivityStore, endDate = localDate()): number {
  let streak = 0;
  let cursor = endDate;
  while (activityScore(store.days[cursor]) > 0) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function activeDays(store: ActivityStore, count: number, endDate = localDate()): number {
  return activityRange(store, count, "score", endDate)
    .filter((point) => point.value > 0)
    .length;
}

import type { CachedMetadata, TFile } from "obsidian";
import type { Habit, HabitFrequency, HabitStatus } from "../models";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).map((tag) => tag.replace(/^#/, "")).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/[,\s]+/)
      .map((tag) => tag.replace(/^#/, ""))
      .filter(Boolean);
  }
  return [];
}

function normalizeDate(value: unknown): string | undefined {
  if (value instanceof Date && Number.isFinite(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  const text = String(value ?? "").trim().slice(0, 10);
  return DATE_RE.test(text) ? text : undefined;
}

function normalizeDateList(value: unknown): string[] {
  const values = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(/[,\s]+/)
      : [];
  return [...new Set(values.map(normalizeDate).filter((date): date is string => Boolean(date)))].sort();
}

export function parseHabit(
  file: TFile,
  cache: CachedMetadata | null,
  habitTypeValue: string,
): Habit | undefined {
  const frontmatter = cache?.frontmatter;
  if (!frontmatter) return undefined;
  if (String(frontmatter.type ?? "").toLowerCase() !== habitTypeValue.toLowerCase()) {
    return undefined;
  }

  const rawStatus = String(frontmatter.status ?? "active").toLowerCase();
  const statuses: HabitStatus[] = ["active", "paused", "completed", "archived"];
  const status: HabitStatus = statuses.includes(rawStatus as HabitStatus)
    ? (rawStatus as HabitStatus)
    : "active";

  const rawFrequency = String(frontmatter.frequency ?? "daily").toLowerCase();
  const frequency: HabitFrequency = rawFrequency === "weekdays" ? "weekdays" : "daily";

  const rawTarget = Number(frontmatter.target_days ?? frontmatter.target);
  const targetDays = Number.isFinite(rawTarget) && rawTarget > 0
    ? Math.round(rawTarget)
    : undefined;

  return {
    id: String(frontmatter.habit_id ?? frontmatter.id ?? file.basename),
    name: String(frontmatter.name ?? file.basename),
    description: frontmatter.description ? String(frontmatter.description) : undefined,
    status,
    frequency,
    start: normalizeDate(frontmatter.start),
    end: normalizeDate(frontmatter.end ?? frontmatter.deadline),
    targetDays,
    tags: normalizeTags(frontmatter.tags),
    completedDates: normalizeDateList(frontmatter.habit_log ?? frontmatter.completed_dates),
    source: { path: file.path },
  };
}

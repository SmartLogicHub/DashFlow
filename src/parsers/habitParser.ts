import type { CachedMetadata, TFile } from "obsidian";
import type { Habit, HabitFrequency, HabitKind, HabitStatus } from "../models";

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

function normalizeDailyNotes(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const notes: Record<string, string> = {};
  for (const [date, note] of Object.entries(value as Record<string, unknown>)) {
    const normalizedDate = normalizeDate(date);
    const text = String(note ?? "").trim();
    if (normalizedDate && text) notes[normalizedDate] = text;
  }
  return notes;
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

  const rawKind = String(frontmatter.habit_kind ?? frontmatter.kind ?? "habit").toLowerCase();
  const kind: HabitKind = rawKind === "daily-progress" ? "daily-progress" : "habit";

  const rawTarget = Number(frontmatter.target_days ?? frontmatter.target);
  const targetDays = Number.isFinite(rawTarget) && rawTarget > 0
    ? Math.round(rawTarget)
    : undefined;

  const linkedProjectId = String(frontmatter.linked_project ?? "").trim() || undefined;

  return {
    id: String(frontmatter.habit_id ?? frontmatter.id ?? file.basename),
    name: String(frontmatter.name ?? file.basename),
    description: frontmatter.description ? String(frontmatter.description) : undefined,
    status,
    frequency,
    kind,
    start: normalizeDate(frontmatter.start),
    end: normalizeDate(frontmatter.end ?? frontmatter.deadline),
    targetDays,
    linkedProjectId,
    tags: normalizeTags(frontmatter.tags),
    completedDates: normalizeDateList(frontmatter.habit_log ?? frontmatter.completed_dates),
    dailyNotes: normalizeDailyNotes(frontmatter.daily_notes),
    source: { path: file.path },
  };
}

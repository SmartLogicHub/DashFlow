import type { CachedMetadata, TFile } from "obsidian";
import type {
  LearningAssistance,
  LearningGoal,
  LearningGoalStatus,
  LearningSession,
  LearningSessionKind,
  LearningSessionOutcome,
} from "../learning/models";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function normalizeDate(value: unknown): string | undefined {
  if (value instanceof Date && Number.isFinite(value.getTime())) return value.toISOString().slice(0, 10);
  const text = String(value ?? "").trim().slice(0, 10);
  return DATE_RE.test(text) ? text : undefined;
}

function normalizeList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(/\n|\s*[,;]\s*/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeTags(value: unknown): string[] {
  return normalizeList(value).map((tag) => tag.replace(/^#/, "")).filter(Boolean);
}

export function parseLearningGoal(file: TFile, cache: CachedMetadata | null): LearningGoal | undefined {
  const frontmatter = cache?.frontmatter;
  if (!frontmatter || String(frontmatter.type ?? "").toLowerCase() !== "learning-goal") return undefined;

  const rawStatus = String(frontmatter.status ?? "active").toLowerCase();
  const statuses: LearningGoalStatus[] = ["active", "paused", "completed", "archived"];
  const status = statuses.includes(rawStatus as LearningGoalStatus)
    ? (rawStatus as LearningGoalStatus)
    : "active";

  return {
    id: String(frontmatter.learning_goal_id ?? frontmatter.goal_id ?? frontmatter.id ?? file.basename),
    name: String(frontmatter.name ?? file.basename),
    domain: String(frontmatter.domain ?? "").trim() || undefined,
    outcome: String(frontmatter.outcome ?? frontmatter.real_result ?? "").trim(),
    baseline: String(frontmatter.baseline ?? "").trim() || undefined,
    successCriteria: normalizeList(frontmatter.success_criteria ?? frontmatter.criteria),
    status,
    targetDate: normalizeDate(frontmatter.target_date ?? frontmatter.deadline),
    linkedProjectId: String(frontmatter.linked_project ?? "").trim() || undefined,
    nextStep: String(frontmatter.next_step ?? "").trim() || undefined,
    tags: normalizeTags(frontmatter.tags),
    source: { path: file.path },
  };
}

export function parseLearningSession(file: TFile, cache: CachedMetadata | null): LearningSession | undefined {
  const frontmatter = cache?.frontmatter;
  if (!frontmatter || String(frontmatter.type ?? "").toLowerCase() !== "learning-session") return undefined;

  const rawKind = String(frontmatter.kind ?? "practice").toLowerCase();
  const kinds: LearningSessionKind[] = ["baseline", "practice", "assessment", "review"];
  const kind = kinds.includes(rawKind as LearningSessionKind)
    ? (rawKind as LearningSessionKind)
    : "practice";

  const rawOutcome = String(frontmatter.outcome ?? "completed").toLowerCase();
  const outcomes: LearningSessionOutcome[] = ["completed", "partial", "blocked"];
  const outcome = outcomes.includes(rawOutcome as LearningSessionOutcome)
    ? (rawOutcome as LearningSessionOutcome)
    : "completed";

  const rawAssistance = String(frontmatter.assistance ?? "none").toLowerCase();
  const assistanceModes: LearningAssistance[] = ["none", "ai", "human", "mixed"];
  const assistance = assistanceModes.includes(rawAssistance as LearningAssistance)
    ? (rawAssistance as LearningAssistance)
    : "none";

  const duration = Number(frontmatter.duration_minutes ?? frontmatter.duration);
  const durationMinutes = Number.isFinite(duration) && duration > 0 ? Math.round(duration) : undefined;
  const date = normalizeDate(frontmatter.date)
    ?? (file.stat.mtime ? new Date(file.stat.mtime).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));

  return {
    id: String(frontmatter.learning_session_id ?? frontmatter.session_id ?? frontmatter.id ?? file.basename),
    goalId: String(frontmatter.goal_id ?? frontmatter.learning_goal_id ?? "").trim(),
    date,
    kind,
    task: String(frontmatter.task ?? "").trim(),
    firstAttempt: String(frontmatter.first_attempt ?? "").trim() || undefined,
    sources: normalizeList(frontmatter.sources ?? frontmatter.source_refs),
    activeOutput: String(frontmatter.active_output ?? frontmatter.output ?? "").trim() || undefined,
    outcome,
    assistance,
    durationMinutes,
    evidence: normalizeList(frontmatter.evidence),
    mistakes: normalizeList(frontmatter.mistakes ?? frontmatter.gaps),
    feedback: String(frontmatter.feedback ?? "").trim() || undefined,
    nextStep: String(frontmatter.next_step ?? "").trim() || undefined,
    tags: normalizeTags(frontmatter.tags),
    source: { path: file.path },
  };
}

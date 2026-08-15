import type { CachedMetadata, TFile } from "obsidian";
import type { Project, ProjectProgressMode, ProjectStatus } from "../models";

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).map((tag) => tag.replace(/^#/, ""));
  }
  if (typeof value === "string") {
    return value
      .split(/[,\s]+/)
      .map((tag) => tag.replace(/^#/, ""))
      .filter(Boolean);
  }
  return [];
}

export function parseProject(
  file: TFile,
  cache: CachedMetadata | null,
  projectTypeValue: string,
): Project | undefined {
  const frontmatter = cache?.frontmatter;
  if (!frontmatter) return undefined;

  if (String(frontmatter.type ?? "").toLowerCase() !== projectTypeValue.toLowerCase()) {
    return undefined;
  }

  const manual = Number(frontmatter.progress);
  const rawStatus = String(frontmatter.status ?? "active").toLowerCase();
  const statuses: ProjectStatus[] = ["planned", "active", "paused", "completed", "archived"];
  const status: ProjectStatus = statuses.includes(rawStatus as ProjectStatus)
    ? (rawStatus as ProjectStatus)
    : "active";
  const progressMode: ProjectProgressMode = String(
    frontmatter.progress_mode ?? (Number.isFinite(manual) ? "manual" : "tasks"),
  ).toLowerCase() === "manual" ? "manual" : "tasks";

  return {
    id: String(frontmatter.project_id ?? frontmatter.id ?? file.basename),
    name: String(frontmatter.name ?? file.basename),
    description: frontmatter.description ? String(frontmatter.description) : undefined,
    status,
    start: frontmatter.start ? String(frontmatter.start) : undefined,
    deadline: frontmatter.deadline
      ? String(frontmatter.deadline)
      : frontmatter.due
        ? String(frontmatter.due)
        : undefined,
    tags: normalizeTags(frontmatter.tags),
    progressMode,
    manualProgress: Number.isFinite(manual) ? Math.max(0, Math.min(100, manual)) : undefined,
    source: { path: file.path },
  };
}

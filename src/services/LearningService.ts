import { Notice, TFile, normalizePath, type App } from "obsidian";
import type {
  LearningGoal,
  LearningGoalEditInput,
  LearningSession,
  LearningSessionEditInput,
} from "../learning/models";
import type { VaultIndexService } from "./VaultIndexService";

const GOAL_FOLDER = "DashFlow/Learning/Goals";
const SESSION_FOLDER = "DashFlow/Learning/Sessions";

function sanitizeId(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}_-]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function sanitizeFileName(value: string): string {
  return value
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, " ")
    .replace(/^\.+|\.+$/g, "")
    .slice(0, 100) || "Learning";
}

function yamlString(value: string): string {
  return JSON.stringify(value);
}

function appendYamlList(lines: string[], key: string, values: string[]): void {
  const clean = values.map((value) => value.trim()).filter(Boolean);
  if (clean.length === 0) return;
  lines.push(`${key}:`);
  for (const value of clean) lines.push(`  - ${yamlString(value)}`);
}

export class LearningService {
  constructor(
    private readonly app: App,
    private readonly index: VaultIndexService,
  ) {}

  goals(): LearningGoal[] {
    return [...(this.index.getSnapshot().learningGoals ?? [])]
      .sort((a, b) => a.status.localeCompare(b.status) || (a.targetDate ?? "9999").localeCompare(b.targetDate ?? "9999") || a.name.localeCompare(b.name));
  }

  activeGoals(): LearningGoal[] {
    return this.goals().filter((goal) => goal.status === "active");
  }

  sessionsForGoal(goalId: string): LearningSession[] {
    return [...(this.index.getSnapshot().learningSessions ?? [])]
      .filter((session) => session.goalId === goalId)
      .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  }

  async createGoal(input: LearningGoalEditInput): Promise<LearningGoal | undefined> {
    const name = input.name.trim();
    const outcome = input.outcome.trim();
    if (!name || !outcome) {
      new Notice("DashFlow: 学习目标名称和真实结果不能为空。");
      return undefined;
    }

    const id = sanitizeId(input.id || name) || `learning-${Date.now().toString(36)}`;
    if ((this.index.getSnapshot().learningGoals ?? []).some((goal) => goal.id === id)) {
      new Notice(`DashFlow: Learning Goal ID「${id}」已经存在。`);
      return undefined;
    }

    await this.ensureFolder(GOAL_FOLDER);
    let path = normalizePath(`${GOAL_FOLDER}/${sanitizeFileName(name)}.md`);
    if (this.app.vault.getAbstractFileByPath(path)) {
      path = normalizePath(`${GOAL_FOLDER}/${sanitizeFileName(name)}-${Date.now().toString(36)}.md`);
    }

    const lines = [
      "---",
      `type: ${yamlString("learning-goal")}`,
      `learning_goal_id: ${yamlString(id)}`,
      `name: ${yamlString(name)}`,
      `status: ${input.status}`,
      `outcome: ${yamlString(outcome)}`,
    ];
    if (input.domain?.trim()) lines.push(`domain: ${yamlString(input.domain.trim())}`);
    if (input.baseline?.trim()) lines.push(`baseline: ${yamlString(input.baseline.trim())}`);
    appendYamlList(lines, "success_criteria", input.successCriteria);
    if (input.targetDate) lines.push(`target_date: ${input.targetDate}`);
    if (input.linkedProjectId?.trim()) lines.push(`linked_project: ${yamlString(input.linkedProjectId.trim())}`);
    if (input.nextStep?.trim()) lines.push(`next_step: ${yamlString(input.nextStep.trim())}`);
    appendYamlList(lines, "tags", input.tags ?? []);
    lines.push("---", "", `# ${name}`, "", "## Notes", "");

    const file = await this.app.vault.create(path, lines.join("\n"));
    await this.index.indexFile(file);
    return (this.index.getSnapshot().learningGoals ?? []).find((goal) => goal.id === id);
  }

  async updateGoal(goal: LearningGoal, input: LearningGoalEditInput): Promise<boolean> {
    const name = input.name.trim();
    const outcome = input.outcome.trim();
    if (!name || !outcome) return false;
    const file = this.app.vault.getAbstractFileByPath(goal.source.path);
    if (!(file instanceof TFile)) return false;

    await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
      frontmatter.type = "learning-goal";
      frontmatter.learning_goal_id = goal.id;
      frontmatter.name = name;
      frontmatter.status = input.status;
      frontmatter.outcome = outcome;
      this.setOptional(frontmatter, "domain", input.domain);
      this.setOptional(frontmatter, "baseline", input.baseline);
      this.setList(frontmatter, "success_criteria", input.successCriteria);
      this.setOptional(frontmatter, "target_date", input.targetDate);
      this.setOptional(frontmatter, "linked_project", input.linkedProjectId);
      this.setOptional(frontmatter, "next_step", input.nextStep);
      this.setList(frontmatter, "tags", input.tags ?? []);
    });
    await this.index.indexFile(file);
    return true;
  }

  async createSession(input: LearningSessionEditInput): Promise<LearningSession | undefined> {
    const task = input.task.trim();
    if (!input.goalId.trim() || !task) {
      new Notice("DashFlow: Learning Session 必须关联目标并写明本次任务。");
      return undefined;
    }
    const goal = (this.index.getSnapshot().learningGoals ?? []).find((item) => item.id === input.goalId);
    if (!goal) {
      new Notice("DashFlow: 找不到关联的学习目标。");
      return undefined;
    }

    const id = sanitizeId(input.id || `${input.goalId}-${input.date}-${Date.now().toString(36)}`);
    await this.ensureFolder(SESSION_FOLDER);
    const path = normalizePath(`${SESSION_FOLDER}/${sanitizeFileName(`${input.date} ${goal.name}`)}-${id.slice(-8)}.md`);
    const lines = [
      "---",
      `type: ${yamlString("learning-session")}`,
      `learning_session_id: ${yamlString(id)}`,
      `goal_id: ${yamlString(input.goalId)}`,
      `date: ${input.date}`,
      `kind: ${input.kind}`,
      `task: ${yamlString(task)}`,
    ];
    if (input.firstAttempt?.trim()) lines.push(`first_attempt: ${yamlString(input.firstAttempt.trim())}`);
    appendYamlList(lines, "sources", input.sources);
    if (input.activeOutput?.trim()) lines.push(`active_output: ${yamlString(input.activeOutput.trim())}`);
    lines.push(`outcome: ${input.outcome}`, `assistance: ${input.assistance}`);
    if (input.durationMinutes && input.durationMinutes > 0) lines.push(`duration_minutes: ${Math.round(input.durationMinutes)}`);
    appendYamlList(lines, "evidence", input.evidence);
    appendYamlList(lines, "mistakes", input.mistakes);
    if (input.feedback?.trim()) lines.push(`feedback: ${yamlString(input.feedback.trim())}`);
    if (input.nextStep?.trim()) lines.push(`next_step: ${yamlString(input.nextStep.trim())}`);
    appendYamlList(lines, "tags", input.tags ?? []);
    lines.push("---", "", `# ${goal.name} · ${input.date}`, "", "## Practice", "", task, "");
    if (input.firstAttempt?.trim()) lines.push("## First Attempt", "", input.firstAttempt.trim(), "");
    if (input.activeOutput?.trim()) lines.push("## Active Output", "", input.activeOutput.trim(), "");
    lines.push("## Reflection", "");

    const file = await this.app.vault.create(path, lines.join("\n"));
    await this.index.indexFile(file);
    return (this.index.getSnapshot().learningSessions ?? []).find((session) => session.id === id);
  }

  async updateSession(session: LearningSession, input: LearningSessionEditInput): Promise<boolean> {
    const file = this.app.vault.getAbstractFileByPath(session.source.path);
    if (!(file instanceof TFile) || !input.task.trim() || !input.goalId.trim()) return false;

    await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
      frontmatter.type = "learning-session";
      frontmatter.learning_session_id = session.id;
      frontmatter.goal_id = input.goalId;
      frontmatter.date = input.date;
      frontmatter.kind = input.kind;
      frontmatter.task = input.task.trim();
      this.setOptional(frontmatter, "first_attempt", input.firstAttempt);
      this.setList(frontmatter, "sources", input.sources);
      this.setOptional(frontmatter, "active_output", input.activeOutput);
      frontmatter.outcome = input.outcome;
      frontmatter.assistance = input.assistance;
      if (input.durationMinutes && input.durationMinutes > 0) frontmatter.duration_minutes = Math.round(input.durationMinutes);
      else delete frontmatter.duration_minutes;
      this.setList(frontmatter, "evidence", input.evidence);
      this.setList(frontmatter, "mistakes", input.mistakes);
      this.setOptional(frontmatter, "feedback", input.feedback);
      this.setOptional(frontmatter, "next_step", input.nextStep);
      this.setList(frontmatter, "tags", input.tags ?? []);
    });
    await this.index.indexFile(file);
    return true;
  }

  private setOptional(frontmatter: Record<string, unknown>, key: string, value?: string): void {
    const normalized = value?.trim();
    if (normalized) frontmatter[key] = normalized;
    else delete frontmatter[key];
  }

  private setList(frontmatter: Record<string, unknown>, key: string, values: string[]): void {
    const clean = values.map((value) => value.trim()).filter(Boolean);
    if (clean.length > 0) frontmatter[key] = clean;
    else delete frontmatter[key];
  }

  private async ensureFolder(path: string): Promise<void> {
    const parts = path.split("/").filter(Boolean);
    let current = "";
    for (const part of parts) {
      current = current ? `${current}/${part}` : part;
      if (!this.app.vault.getAbstractFileByPath(current)) {
        try {
          await this.app.vault.createFolder(current);
        } catch {
          // The folder may have been created concurrently.
        }
      }
    }
  }
}

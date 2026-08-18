import type { Task, TaskEditInput, TaskPriority } from "../models";
import { stableHash } from "../utils/hash";

const DUE_RE = /📅\s*(\d{4}-\d{2}-\d{2})/;
const SCHEDULED_RE = /⏳\s*(\d{4}-\d{2}-\d{2})/;
const START_RE = /🛫\s*(\d{4}-\d{2}-\d{2})/;
const COMPLETED_RE = /✅\s*(\d{4}-\d{2}-\d{2})/;
const PROJECT_RE = /#project\/([^\s#]+)/i;
const PROJECT_RE_GLOBAL = /#project\/[^\s#]+/gi;
const TAG_RE = /(^|\s)#([\p{L}\p{N}_\-/.]+)/gu;
const TASK_RE = /^\s*[-*+]\s+\[([ xX])\]\s+(.*)$/;

const PRIORITY_MARKER: Record<TaskPriority, string> = {
  urgent: "⏫",
  high: "🔼",
  normal: "",
  low: "🔽",
};

function priorityFromText(text: string): TaskPriority {
  if (text.includes("⏫") || text.includes("🔺")) return "urgent";
  if (text.includes("🔼")) return "high";
  if (text.includes("🔽")) return "low";
  return "normal";
}

export function cleanTaskText(text: string): string {
  return text
    .replace(DUE_RE, "")
    .replace(SCHEDULED_RE, "")
    .replace(START_RE, "")
    .replace(COMPLETED_RE, "")
    .replace(PROJECT_RE_GLOBAL, "")
    .replace(/[⏫🔺🔼🔽]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

interface TaskBodyInput {
  text: string;
  due?: string;
  scheduled?: string;
  start?: string;
  completedAt?: string;
  priority: TaskPriority;
  projectId?: string;
}

export function formatTaskBody(input: TaskBodyInput): string {
  const parts = [cleanTaskText(input.text)];
  if (input.projectId?.trim()) parts.push(`#project/${input.projectId.trim()}`);
  const priority = PRIORITY_MARKER[input.priority];
  if (priority) parts.push(priority);
  if (input.start) parts.push(`🛫 ${input.start}`);
  if (input.scheduled) parts.push(`⏳ ${input.scheduled}`);
  if (input.due) parts.push(`📅 ${input.due}`);
  if (input.completedAt) parts.push(`✅ ${input.completedAt}`);
  return parts.filter(Boolean).join(" ").trim();
}

export function serializeTaskLine(task: Task, input: TaskEditInput): string {
  const prefix = task.source.raw?.match(/^(\s*[-*+]\s+)/)?.[1] ?? "- ";
  const body = formatTaskBody({
    text: input.text,
    completedAt: task.completedAt,
    scheduled: input.scheduled,
    start: input.start,
    due: input.due,
    priority: input.priority,
    projectId: input.projectId,
  });
  return `${prefix}[${input.completed ? "x" : " "}] ${body}`;
}

export function parseTasks(path: string, content: string): Task[] {
  const tasks: Task[] = [];
  const lines = content.split(/\r?\n/);

  lines.forEach((raw, line) => {
    const match = raw.match(TASK_RE);
    if (!match) return;

    const sourceText = match[2] ?? "";
    const tags: string[] = [];
    for (const tagMatch of sourceText.matchAll(TAG_RE)) {
      const tag = tagMatch[2];
      if (tag && !/^project\//i.test(tag)) tags.push(tag);
    }

    tasks.push({
      id: `${path}:${line}:${stableHash(raw)}`,
      text: cleanTaskText(sourceText),
      completed: (match[1] ?? " ").toLowerCase() === "x",
      due: sourceText.match(DUE_RE)?.[1],
      scheduled: sourceText.match(SCHEDULED_RE)?.[1],
      start: sourceText.match(START_RE)?.[1],
      completedAt: sourceText.match(COMPLETED_RE)?.[1],
      priority: priorityFromText(sourceText),
      tags,
      projectId: sourceText.match(PROJECT_RE)?.[1],
      source: { path, line, raw },
    });
  });

  return tasks;
}

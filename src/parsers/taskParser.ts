import type { Task, TaskPriority } from "../models";
import { stableHash } from "../utils/hash";

const DUE_RE = /📅\s*(\d{4}-\d{2}-\d{2})/;
const SCHEDULED_RE = /⏳\s*(\d{4}-\d{2}-\d{2})/;
const START_RE = /🛫\s*(\d{4}-\d{2}-\d{2})/;
const COMPLETED_RE = /✅\s*(\d{4}-\d{2}-\d{2})/;
const PROJECT_RE = /#project\/([^\s#]+)/i;
const TAG_RE = /(^|\s)#([\p{L}\p{N}_\-/.]+)/gu;
const TASK_RE = /^\s*[-*+]\s+\[([ xX])\]\s+(.*)$/;

function priorityFromText(text: string): TaskPriority {
  if (text.includes("⏫") || text.includes("🔺")) return "urgent";
  if (text.includes("🔼")) return "high";
  if (text.includes("🔽")) return "low";
  return "normal";
}

function cleanTaskText(text: string): string {
  return text
    .replace(DUE_RE, "")
    .replace(SCHEDULED_RE, "")
    .replace(START_RE, "")
    .replace(COMPLETED_RE, "")
    .replace(/[⏫🔺🔼🔽]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
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
      if (tagMatch[2]) tags.push(tagMatch[2]);
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

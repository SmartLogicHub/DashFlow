import type { LearningMistake, LearningSession } from "./models";

export interface LearningMistakePattern {
  key: string;
  text: string;
  count: number;
  lastDate: string;
  goalIds: string[];
}

function normalizeMistake(text: string): string {
  return text
    .trim()
    .toLocaleLowerCase()
    .replace(/[\s\u3000]+/g, " ")
    .replace(/[，。！？、,.!?;；:：]+$/g, "");
}

export function learningMistakePatterns(mistakes: LearningMistake[]): LearningMistakePattern[] {
  const byKey = new Map<string, LearningMistakePattern>();
  for (const mistake of mistakes) {
    const key = normalizeMistake(mistake.text);
    if (!key) continue;
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, {
        key,
        text: mistake.text.trim(),
        count: 1,
        lastDate: mistake.date,
        goalIds: [mistake.goalId],
      });
      continue;
    }
    existing.count += 1;
    if (mistake.date > existing.lastDate) {
      existing.lastDate = mistake.date;
      existing.text = mistake.text.trim();
    }
    if (!existing.goalIds.includes(mistake.goalId)) existing.goalIds.push(mistake.goalId);
  }
  return [...byKey.values()]
    .sort((a, b) => b.count - a.count || b.lastDate.localeCompare(a.lastDate) || a.text.localeCompare(b.text));
}

export function sessionsSince(sessions: LearningSession[], fromDate: string): LearningSession[] {
  return sessions
    .filter((session) => session.date >= fromDate)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
}

export function latestSessionForGoal(sessions: LearningSession[], goalId: string): LearningSession | undefined {
  return sessions
    .filter((session) => session.goalId === goalId)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))[0];
}

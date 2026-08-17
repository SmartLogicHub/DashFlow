import type { SourceLocation } from "../models";

export type LearningGoalStatus = "active" | "paused" | "completed" | "archived";
export type LearningSessionKind = "baseline" | "practice" | "assessment" | "review";
export type LearningAssistance = "none" | "ai" | "human" | "mixed";
export type LearningSessionOutcome = "completed" | "partial" | "blocked";

export interface LearningGoal {
  id: string;
  name: string;
  domain?: string;
  outcome: string;
  baseline?: string;
  successCriteria: string[];
  status: LearningGoalStatus;
  targetDate?: string;
  linkedProjectId?: string;
  nextStep?: string;
  tags: string[];
  source: SourceLocation;
}

export interface LearningGoalEditInput {
  id?: string;
  name: string;
  domain?: string;
  outcome: string;
  baseline?: string;
  successCriteria: string[];
  status: LearningGoalStatus;
  targetDate?: string;
  linkedProjectId?: string;
  nextStep?: string;
  tags?: string[];
}

export interface LearningSession {
  id: string;
  goalId: string;
  date: string;
  kind: LearningSessionKind;
  task: string;
  firstAttempt?: string;
  sources: string[];
  activeOutput?: string;
  outcome: LearningSessionOutcome;
  assistance: LearningAssistance;
  durationMinutes?: number;
  evidence: string[];
  mistakes: string[];
  feedback?: string;
  nextStep?: string;
  tags: string[];
  source: SourceLocation;
}

export interface LearningSessionEditInput {
  id?: string;
  goalId: string;
  date: string;
  kind: LearningSessionKind;
  task: string;
  firstAttempt?: string;
  sources: string[];
  activeOutput?: string;
  outcome: LearningSessionOutcome;
  assistance: LearningAssistance;
  durationMinutes?: number;
  evidence: string[];
  mistakes: string[];
  feedback?: string;
  nextStep?: string;
  tags?: string[];
}

export interface LearningEvidence {
  id: string;
  goalId: string;
  sessionId: string;
  date: string;
  ref: string;
  source: SourceLocation;
}

export interface LearningMistake {
  id: string;
  goalId: string;
  sessionId: string;
  date: string;
  text: string;
  source: SourceLocation;
}

declare module "../models" {
  interface VaultSnapshot {
    learningGoals?: LearningGoal[];
    learningSessions?: LearningSession[];
    learningEvidence?: LearningEvidence[];
    learningMistakes?: LearningMistake[];
  }
}

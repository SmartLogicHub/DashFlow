/**
 * DashFlow core data contracts.
 * These interfaces are documentation-first in v0.1; main.js is the
 * dependency-free installable build.
 */

export type TaskPriority = "low" | "normal" | "high" | "urgent";
export type ProjectStatus =
  | "planned"
  | "active"
  | "paused"
  | "completed"
  | "archived";
export type ProjectProgressMode = "tasks" | "manual";

export interface SourceLocation {
  path: string;
  line?: number;
  raw?: string;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  due?: string;
  scheduled?: string;
  start?: string;
  completedAt?: string;
  priority: TaskPriority;
  tags: string[];
  projectId?: string;
  source: SourceLocation;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  start?: string;
  deadline?: string;
  tags: string[];
  progressMode: ProjectProgressMode;
  manualProgress?: number;
  source: SourceLocation;
}

export interface WidgetLayout {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WidgetInstance<TConfig = Record<string, unknown>> {
  id: string;
  type: string;
  title?: string;
  layout: WidgetLayout;
  config: TConfig;
  hidden?: boolean;
}

export interface WidgetDefinition<TConfig = Record<string, unknown>> {
  type: string;
  name: string;
  description: string;
  icon: string;
  defaultSize: Pick<WidgetLayout, "w" | "h">;
  minSize?: Pick<WidgetLayout, "w" | "h">;
  maxSize?: Pick<WidgetLayout, "w" | "h">;
  defaultConfig: () => TConfig;
}

export interface DashboardSettings {
  columns: number;
  gap: number;
  rowHeight: number;
  compactMode?: boolean;
  showHeader?: boolean;
}

export interface DashboardDefinition {
  id: string;
  name: string;
  icon?: string;
  widgets: WidgetInstance[];
  settings: DashboardSettings;
  createdAt: number;
  updatedAt: number;
}

export interface DashFlowSettings {
  inboxPath: string;
  projectTypeValue: string;
}

export interface DashFlowData {
  schemaVersion: 1;
  settings: DashFlowSettings;
  dashboards: DashboardDefinition[];
  activeDashboardId: string;
}

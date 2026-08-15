export type TaskPriority = "low" | "normal" | "high" | "urgent";
export type ProjectStatus = "planned" | "active" | "paused" | "completed" | "archived";
export type ProjectProgressMode = "tasks" | "manual";
export type HabitStatus = "active" | "paused" | "completed" | "archived";
export type HabitFrequency = "daily" | "weekdays";
export type ActivityMetric = "score" | "tasks" | "notes" | "habits";
export type CalendarEventKind = "task-due" | "task-scheduled" | "project-deadline" | "habit";
export type CalendarWeekStart = "monday" | "sunday";

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

export interface TaskEditInput {
  text: string;
  completed: boolean;
  due?: string;
  priority: TaskPriority;
  projectId?: string;
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

export interface Habit {
  id: string;
  name: string;
  description?: string;
  status: HabitStatus;
  frequency: HabitFrequency;
  start?: string;
  end?: string;
  targetDays?: number;
  tags: string[];
  completedDates: string[];
  source: SourceLocation;
}

export interface HabitEditInput {
  id?: string;
  name: string;
  description?: string;
  status: HabitStatus;
  frequency: HabitFrequency;
  start?: string;
  end?: string;
  targetDays?: number;
}

export interface CalendarEvent {
  id: string;
  date: string;
  kind: CalendarEventKind;
  title: string;
  entityId: string;
  source: SourceLocation;
  completed?: boolean;
  priority?: TaskPriority;
}

export interface DailyActivity {
  date: string;
  notesCreated: number;
  notesModified: number;
  tasksCreated: number;
  tasksCompleted: number;
  habitsCompleted: number;
  createdNoteKeys: string[];
  modifiedNoteKeys: string[];
  createdTaskKeys: string[];
  completedTaskKeys: string[];
  completedHabitKeys: string[];
}

export interface ActivityStore {
  startedAt: string;
  days: Record<string, DailyActivity>;
}

export interface WidgetLayout {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WidgetSize {
  w: number;
  h: number;
}

interface WidgetSettingBase {
  key: string;
  label: string;
  description?: string;
}

export type WidgetSettingField =
  | (WidgetSettingBase & { type: "text"; placeholder?: string })
  | (WidgetSettingBase & { type: "number"; min?: number; max?: number; step?: number })
  | (WidgetSettingBase & { type: "toggle" })
  | (WidgetSettingBase & { type: "date" })
  | (WidgetSettingBase & { type: "select"; options: Array<{ label: string; value: string }> });

export interface WidgetInstance<TConfig extends Record<string, unknown> = Record<string, unknown>> {
  id: string;
  type: string;
  title?: string;
  layout: WidgetLayout;
  config: TConfig;
  hidden?: boolean;
}

export interface WidgetDefinition<TConfig extends Record<string, unknown> = Record<string, unknown>> {
  type: string;
  name: string;
  description: string;
  icon: string;
  defaultSize: WidgetSize;
  minSize?: WidgetSize;
  maxSize?: WidgetSize;
  settings?: WidgetSettingField[];
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
  habitTypeValue: string;
  habitFolder: string;
}

export interface DashFlowData {
  schemaVersion: 3;
  settings: DashFlowSettings;
  dashboards: DashboardDefinition[];
  activeDashboardId: string;
  activity: ActivityStore;
}

export interface VaultSnapshot {
  revision: number;
  notes: number;
  tasks: Task[];
  projects: Project[];
  habits: Habit[];
}

export interface QuickCaptureWidgetConfig extends Record<string, unknown> { placeholder: string; }
export interface TasksWidgetConfig extends Record<string, unknown> { includeOverdue: boolean; limit: number; }
export interface ProgressWidgetConfig extends Record<string, unknown> { label: string; }
export interface ProjectsWidgetConfig extends Record<string, unknown> { limit: number; }
export interface UpcomingWidgetConfig extends Record<string, unknown> { days: number; limit: number; }
export interface CountdownWidgetConfig extends Record<string, unknown> { title: string; targetDate: string; }
export interface HeatmapWidgetConfig extends Record<string, unknown> { days: number; metric: ActivityMetric; showLegend: boolean; }
export interface HabitsWidgetConfig extends Record<string, unknown> { historyDays: number; limit: number; showProgress: boolean; includePaused: boolean; }
export interface CalendarWidgetConfig extends Record<string, unknown> {
  weekStart: CalendarWeekStart;
  showTasks: boolean;
  showProjects: boolean;
  showHabits: boolean;
  showCompletedTasks: boolean;
  agendaLimit: number;
}
export interface WeeklyReviewWidgetConfig extends Record<string, unknown> {
  weekStart: CalendarWeekStart;
  carryoverLimit: number;
  projectLimit: number;
  nextWeekLimit: number;
  showHabits: boolean;
  showActivityComparison: boolean;
}

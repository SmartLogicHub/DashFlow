export type TaskPriority = "low" | "normal" | "high" | "urgent";
export type ProjectStatus = "planned" | "active" | "paused" | "completed" | "archived";
export type ProjectProgressMode = "tasks" | "manual";
export type HabitStatus = "active" | "paused" | "completed" | "archived";
export type HabitFrequency = "daily" | "weekdays";
export type HabitKind = "habit" | "daily-progress";
export type ActivityMetric = "score" | "tasks" | "notes" | "habits";
export type CalendarEventKind = "task-due" | "task-scheduled" | "project-deadline" | "habit";
export type CalendarWeekStart = "monday" | "sunday";
export type HomeTheme = "alpine" | "paper" | "midnight" | "obsidian";
export type CaptureTarget = "inbox" | "daily-note" | "ask";
export type ContextMode = "morning" | "work" | "review";
export type DataFilterEntity = "all" | "task" | "project" | "habit";
export type DataFilterState = "active" | "completed" | "all";
export type DataFilterDateRange = "all" | "overdue" | "today" | "next7" | "next30" | "none";
export type DataFilterSort = "date" | "name" | "type";

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
  scheduled?: string;
  start?: string;
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

export interface ProjectEditInput {
  id?: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  start?: string;
  deadline?: string;
  progressMode: ProjectProgressMode;
  manualProgress?: number;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  status: HabitStatus;
  frequency: HabitFrequency;
  kind?: HabitKind;
  start?: string;
  end?: string;
  targetDays?: number;
  linkedProjectId?: string;
  tags: string[];
  completedDates: string[];
  dailyNotes?: Record<string, string>;
  source: SourceLocation;
}

export interface HabitEditInput {
  id?: string;
  name: string;
  description?: string;
  status: HabitStatus;
  frequency: HabitFrequency;
  kind?: HabitKind;
  start?: string;
  end?: string;
  targetDays?: number;
  linkedProjectId?: string;
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

export interface DashboardMobileSettings {
  order: string[];
  collapsedWidgetIds: string[];
  compactMode: boolean;
}

export interface DashboardDefinition {
  id: string;
  name: string;
  icon?: string;
  widgets: WidgetInstance[];
  settings: DashboardSettings;
  mobile?: DashboardMobileSettings;
  createdAt: number;
  updatedAt: number;
}

export interface CustomDashboardTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  dashboard: DashboardDefinition;
  createdAt: number;
  updatedAt: number;
}

export interface MorningBriefingCacheEntry {
  date: string;
  sourceDate: string;
  sourcePath: string;
  sourceHash: string;
  generatedAt: number;
  summary: string;
  advice: string;
}

export interface NewsItem {
  id: string;
  source: string;
  title: string;
  url: string;
  description: string;
  publishedAt?: string;
}

export interface CuratedNewsItem extends NewsItem {
  score: number;
  reason: string;
}

export interface NewsCurationCacheEntry {
  configHash: string;
  candidatesHash: string;
  fetchedAt: number;
  rankedAt: number;
  candidates: NewsItem[];
  curated: CuratedNewsItem[];
}

export interface AICache {
  morningBriefing?: MorningBriefingCacheEntry;
  news?: Record<string, NewsCurationCacheEntry>;
}

export interface DashFlowSettings {
  inboxPath: string;
  projectTypeValue: string;
  projectFolder: string;
  habitTypeValue: string;
  habitFolder: string;
  homeTheme: HomeTheme;
  homeHeroImagePath: string;
  homeHeroTitle: string;
  homeHeroSubtitle: string;
  homeHeroOverlay: number;
  weReadEnabled: boolean;
  weReadSecretId: string;
  weReadShowOnHome: boolean;
  aiEnabled: boolean;
  aiBaseUrl: string;
  aiModel: string;
  aiSecretId: string;
  aiMorningBriefingEnabled: boolean;
  dailyNoteFolder: string;
  dailyNoteDateFormat: string;
  quickCaptureTarget: CaptureTarget;
  dailyCaptureHeading: string;
  contextMorningDashboardId: string;
  contextWorkDashboardId: string;
  contextReviewDashboardId: string;
}

export interface DashFlowData {
  schemaVersion: 7;
  settings: DashFlowSettings;
  dashboards: DashboardDefinition[];
  activeDashboardId: string;
  customTemplates: CustomDashboardTemplate[];
  activity: ActivityStore;
  aiCache: AICache;
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
export interface AINewsWidgetConfig extends Record<string, unknown> {
  sources: string;
  interests: string;
  topK: number;
  refreshHours: number;
}
export interface DataFilterWidgetConfig extends Record<string, unknown> {
  entity: DataFilterEntity;
  state: DataFilterState;
  dateRange: DataFilterDateRange;
  query: string;
  tag: string;
  sort: DataFilterSort;
  limit: number;
}
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

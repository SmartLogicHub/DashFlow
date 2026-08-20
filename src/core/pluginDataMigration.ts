import { normalizeFocusState } from "../focus/focusTimer";
import type {
  ActivityStore,
  DashboardDefinition,
  DashFlowData,
  DashFlowSettings,
  FocusTimerState,
  PluginDataRecoveryBackup,
} from "../models";

export const MAX_RECOVERY_BACKUP_BYTES = 256 * 1024;

export interface PluginDataMigrationOptions {
  defaults: DashFlowSettings;
  fallbackDashboard: DashboardDefinition;
  today: string;
  now?: number;
}

export interface PluginDataMigrationResult {
  data: DashFlowData;
  shouldPersist: boolean;
  firstRun: boolean;
  recoveryRequired: boolean;
  backup?: PluginDataRecoveryBackup;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function finiteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function validDashboard(value: unknown): value is DashboardDefinition {
  if (!isRecord(value) || typeof value.id !== "string" || !value.id.trim() || typeof value.name !== "string") return false;
  if (!isRecord(value.settings)) return false;
  if (!finiteNumber(value.settings.columns) || !finiteNumber(value.settings.gap) || !finiteNumber(value.settings.rowHeight)) return false;
  if (!Array.isArray(value.widgets)) return false;
  return value.widgets.every((widget) => {
    if (!isRecord(widget) || typeof widget.id !== "string" || typeof widget.type !== "string") return false;
    if (!isRecord(widget.layout) || !isRecord(widget.config)) return false;
    return finiteNumber(widget.layout.x)
      && finiteNumber(widget.layout.y)
      && finiteNumber(widget.layout.w)
      && finiteNumber(widget.layout.h);
  });
}

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function serializedBytes(value: unknown): number {
  return new TextEncoder().encode(JSON.stringify(value)).byteLength;
}

function sanitizedBackup(raw: Record<string, unknown>, now: number): PluginDataRecoveryBackup {
  const data = cloneJson(raw);
  delete data.recoveryBackup;
  if (isRecord(data.settings)) data.settings.aiSecretId = "";

  const sourceSchemaVersion = finiteNumber(raw.schemaVersion) ? raw.schemaVersion : null;
  const backup: PluginDataRecoveryBackup = { createdAt: now, sourceSchemaVersion, data };
  if (serializedBytes(backup) <= MAX_RECOVERY_BACKUP_BYTES) return backup;

  data.aiCache = {};
  if (isRecord(data.activity)) data.activity = { ...data.activity, days: {} };
  backup.truncated = true;
  if (serializedBytes(backup) <= MAX_RECOVERY_BACKUP_BYTES) return backup;

  backup.data = {
    schemaVersion: sourceSchemaVersion,
    settings: isRecord(data.settings) ? data.settings : {},
    activeDashboardId: data.activeDashboardId,
    dashboards: [],
    customTemplates: [],
    backupTruncated: true,
  };
  return backup;
}

function fallbackData(options: PluginDataMigrationOptions, onboardingCompleted: boolean): DashFlowData {
  return {
    schemaVersion: 8,
    settings: { ...options.defaults },
    dashboards: [cloneJson(options.fallbackDashboard)],
    activeDashboardId: options.fallbackDashboard.id,
    customTemplates: [],
    activity: { startedAt: options.today, days: {} },
    aiCache: {},
    focus: normalizeFocusState(undefined),
    onboardingCompleted,
  };
}

function recoveryResult(raw: Record<string, unknown>, options: PluginDataMigrationOptions): PluginDataMigrationResult {
  const backup = sanitizedBackup(raw, options.now ?? Date.now());
  const data = fallbackData(options, true);
  data.recoveryBackup = backup;
  return {
    data,
    shouldPersist: false,
    firstRun: false,
    recoveryRequired: true,
    backup,
  };
}

export function migratePluginData(raw: unknown, options: PluginDataMigrationOptions): PluginDataMigrationResult {
  if (raw === null || raw === undefined) {
    return {
      data: fallbackData(options, false),
      shouldPersist: false,
      firstRun: true,
      recoveryRequired: false,
    };
  }

  if (!isRecord(raw)) return recoveryResult({ invalidRoot: raw }, options);
  if (finiteNumber(raw.schemaVersion) && raw.schemaVersion > 8) return recoveryResult(raw, options);
  if (!Array.isArray(raw.dashboards) || !raw.dashboards.every(validDashboard)) return recoveryResult(raw, options);

  if (raw.schemaVersion === 8) {
    if (typeof raw.onboardingCompleted !== "boolean" || !isRecord(raw.settings)) return recoveryResult(raw, options);
    return {
      data: raw as unknown as DashFlowData,
      shouldPersist: false,
      firstRun: false,
      recoveryRequired: false,
      backup: isRecord(raw.recoveryBackup) ? raw.recoveryBackup as unknown as PluginDataRecoveryBackup : undefined,
    };
  }

  const backup = sanitizedBackup(raw, options.now ?? Date.now());
  const dashboards = raw.dashboards.length > 0
    ? cloneJson(raw.dashboards as DashboardDefinition[])
    : [cloneJson(options.fallbackDashboard)];
  for (const item of dashboards) {
    if (item.id === "home" && item.name === "Home") item.name = "默认工作台";
  }

  const settings = isRecord(raw.settings)
    ? { ...options.defaults, ...raw.settings } as DashFlowSettings
    : { ...options.defaults };
  const activitySource = isRecord(raw.activity) ? raw.activity : {};
  const activity: ActivityStore = {
    startedAt: typeof activitySource.startedAt === "string" ? activitySource.startedAt : options.today,
    days: isRecord(activitySource.days) ? activitySource.days as ActivityStore["days"] : {},
  };
  const activeCandidate = typeof raw.activeDashboardId === "string" ? raw.activeDashboardId : "";
  const activeDashboardId = dashboards.some((item) => item.id === activeCandidate)
    ? activeCandidate
    : dashboards[0]!.id;

  const data: DashFlowData = {
    ...(raw as Partial<DashFlowData>),
    schemaVersion: 8,
    settings,
    dashboards,
    activeDashboardId,
    customTemplates: Array.isArray(raw.customTemplates) ? cloneJson(raw.customTemplates) : [],
    activity,
    aiCache: isRecord(raw.aiCache) ? cloneJson(raw.aiCache) : {},
    focus: normalizeFocusState(isRecord(raw.focus) ? raw.focus as Partial<FocusTimerState> : undefined),
    onboardingCompleted: true,
    recoveryBackup: backup,
  };

  return {
    data,
    shouldPersist: true,
    firstRun: false,
    recoveryRequired: false,
    backup,
  };
}

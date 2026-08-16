import type { FocusMode, FocusTimerState, FocusWidgetConfig } from "../models";

export interface FocusCompletion {
  sessionId: string;
  mode: FocusMode;
  durationMinutes: number;
  completedAt: number;
}

export interface FocusReconcileResult {
  state: FocusTimerState;
  completion?: FocusCompletion;
}

export const DEFAULT_FOCUS_CONFIG: FocusWidgetConfig = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakEvery: 4,
};

export const DEFAULT_FOCUS_STATE: FocusTimerState = {
  mode: "focus",
  status: "idle",
  completedFocusSessions: 0,
};

const MODES: FocusMode[] = ["focus", "short-break", "long-break"];

function boundedMinutes(value: unknown, fallback: number): number {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return fallback;
  return Math.min(180, Math.max(1, Math.round(number)));
}

export function normalizeFocusConfig(value: Partial<FocusWidgetConfig> | null | undefined): FocusWidgetConfig {
  return {
    focusMinutes: boundedMinutes(value?.focusMinutes, DEFAULT_FOCUS_CONFIG.focusMinutes),
    shortBreakMinutes: boundedMinutes(value?.shortBreakMinutes, DEFAULT_FOCUS_CONFIG.shortBreakMinutes),
    longBreakMinutes: boundedMinutes(value?.longBreakMinutes, DEFAULT_FOCUS_CONFIG.longBreakMinutes),
    longBreakEvery: Math.max(2, Math.min(12, Math.round(Number(value?.longBreakEvery) || DEFAULT_FOCUS_CONFIG.longBreakEvery))),
  };
}

function isMode(value: unknown): value is FocusMode {
  return typeof value === "string" && MODES.includes(value as FocusMode);
}

function positiveNumber(value: unknown): number | undefined {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : undefined;
}

export function normalizeFocusState(value: Partial<FocusTimerState> | null | undefined): FocusTimerState {
  const mode = isMode(value?.mode) ? value.mode : "focus";
  const completedFocusSessions = Math.max(0, Math.floor(Number(value?.completedFocusSessions) || 0));
  const status = value?.status === "running" || value?.status === "paused" ? value.status : "idle";
  if (status === "running") {
    const endsAt = positiveNumber(value?.endsAt);
    const durationMinutes = positiveNumber(value?.durationMinutes);
    const sessionId = typeof value?.sessionId === "string" && value.sessionId ? value.sessionId : undefined;
    if (endsAt && durationMinutes && sessionId) {
      return {
        mode,
        status,
        completedFocusSessions,
        sessionId,
        startedAt: positiveNumber(value?.startedAt),
        endsAt,
        durationMinutes,
        longBreakEvery: Math.max(2, Math.min(12, Math.round(Number(value?.longBreakEvery) || DEFAULT_FOCUS_CONFIG.longBreakEvery))),
      };
    }
  }
  if (status === "paused") {
    const pausedRemainingMs = positiveNumber(value?.pausedRemainingMs);
    const durationMinutes = positiveNumber(value?.durationMinutes);
    const sessionId = typeof value?.sessionId === "string" && value.sessionId ? value.sessionId : undefined;
    if (pausedRemainingMs && durationMinutes && sessionId) {
      return {
        mode,
        status,
        completedFocusSessions,
        sessionId,
        startedAt: positiveNumber(value?.startedAt),
        pausedRemainingMs,
        durationMinutes,
        longBreakEvery: Math.max(2, Math.min(12, Math.round(Number(value?.longBreakEvery) || DEFAULT_FOCUS_CONFIG.longBreakEvery))),
      };
    }
  }
  return { mode, status: "idle", completedFocusSessions };
}

export function durationMinutesForMode(configValue: Partial<FocusWidgetConfig>, mode: FocusMode): number {
  const config = normalizeFocusConfig(configValue);
  if (mode === "short-break") return config.shortBreakMinutes;
  if (mode === "long-break") return config.longBreakMinutes;
  return config.focusMinutes;
}

export function focusRemainingMs(stateValue: Partial<FocusTimerState>, now = Date.now()): number {
  const state = normalizeFocusState(stateValue);
  if (state.status === "running") return Math.max(0, (state.endsAt ?? now) - now);
  if (state.status === "paused") return Math.max(0, state.pausedRemainingMs ?? 0);
  return 0;
}

export function startFocusSession(
  stateValue: Partial<FocusTimerState>,
  configValue: Partial<FocusWidgetConfig>,
  now = Date.now(),
): FocusTimerState {
  const state = normalizeFocusState(stateValue);
  if (state.status !== "idle") return state;
  const config = normalizeFocusConfig(configValue);
  const durationMinutes = durationMinutesForMode(config, state.mode);
  return {
    mode: state.mode,
    status: "running",
    completedFocusSessions: state.completedFocusSessions,
    sessionId: `${state.mode}:${Math.floor(now)}`,
    startedAt: now,
    endsAt: now + durationMinutes * 60_000,
    durationMinutes,
    longBreakEvery: config.longBreakEvery,
  };
}

export function pauseFocusSession(stateValue: Partial<FocusTimerState>, now = Date.now()): FocusTimerState {
  const state = normalizeFocusState(stateValue);
  if (state.status !== "running") return state;
  const remaining = focusRemainingMs(state, now);
  if (remaining <= 0) return state;
  return {
    mode: state.mode,
    status: "paused",
    completedFocusSessions: state.completedFocusSessions,
    sessionId: state.sessionId,
    startedAt: state.startedAt,
    pausedRemainingMs: remaining,
    durationMinutes: state.durationMinutes,
    longBreakEvery: state.longBreakEvery,
  };
}

export function resumeFocusSession(stateValue: Partial<FocusTimerState>, now = Date.now()): FocusTimerState {
  const state = normalizeFocusState(stateValue);
  if (state.status !== "paused") return state;
  const remaining = state.pausedRemainingMs ?? 0;
  if (remaining <= 0) return resetFocusSession(state);
  return {
    mode: state.mode,
    status: "running",
    completedFocusSessions: state.completedFocusSessions,
    sessionId: state.sessionId,
    startedAt: state.startedAt ?? now,
    endsAt: now + remaining,
    durationMinutes: state.durationMinutes,
    longBreakEvery: state.longBreakEvery,
  };
}

export function resetFocusSession(stateValue: Partial<FocusTimerState>): FocusTimerState {
  const state = normalizeFocusState(stateValue);
  return {
    mode: state.mode,
    status: "idle",
    completedFocusSessions: state.completedFocusSessions,
  };
}

export function setFocusMode(stateValue: Partial<FocusTimerState>, mode: FocusMode): FocusTimerState {
  const state = normalizeFocusState(stateValue);
  if (state.status !== "idle" || !isMode(mode)) return state;
  return { mode, status: "idle", completedFocusSessions: state.completedFocusSessions };
}

export function skipFocusSession(stateValue: Partial<FocusTimerState>): FocusTimerState {
  const state = normalizeFocusState(stateValue);
  const nextMode: FocusMode = state.mode === "focus" ? "short-break" : "focus";
  return { mode: nextMode, status: "idle", completedFocusSessions: state.completedFocusSessions };
}

export function reconcileFocusState(stateValue: Partial<FocusTimerState>, now = Date.now()): FocusReconcileResult {
  const state = normalizeFocusState(stateValue);
  if (state.status !== "running" || (state.endsAt ?? Infinity) > now || !state.sessionId || !state.durationMinutes) {
    return { state };
  }

  const completedFocusSessions = state.completedFocusSessions + (state.mode === "focus" ? 1 : 0);
  const longBreakEvery = Math.max(2, state.longBreakEvery ?? DEFAULT_FOCUS_CONFIG.longBreakEvery);
  const nextMode: FocusMode = state.mode === "focus"
    ? (completedFocusSessions % longBreakEvery === 0 ? "long-break" : "short-break")
    : "focus";

  return {
    state: {
      mode: nextMode,
      status: "idle",
      completedFocusSessions,
    },
    completion: {
      sessionId: state.sessionId,
      mode: state.mode,
      durationMinutes: state.durationMinutes,
      completedAt: state.endsAt ?? now,
    },
  };
}

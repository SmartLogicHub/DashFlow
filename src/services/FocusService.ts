import type DashFlowPlugin from "../main";
import type { FocusMode, FocusTimerState, FocusWidgetConfig } from "../models";
import {
  normalizeFocusState,
  pauseFocusSession,
  reconcileFocusState,
  resetFocusSession,
  resumeFocusSession,
  setFocusMode,
  skipFocusSession,
  startFocusSession,
} from "../focus/focusTimer";
import { localDate } from "../utils/date";

export class FocusService {
  private readonly listeners = new Set<() => void>();
  private completionTimer: number | null = null;
  private operation: Promise<void> = Promise.resolve();

  constructor(private readonly plugin: DashFlowPlugin) {}

  start(): void {
    void this.reconcile();
  }

  stop(): void {
    if (this.completionTimer !== null) {
      window.clearTimeout(this.completionTimer);
      this.completionTimer = null;
    }
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getState(): FocusTimerState {
    return normalizeFocusState(this.plugin.data.focus);
  }

  startSession(config: FocusWidgetConfig): Promise<void> {
    return this.enqueue(async () => {
      await this.reconcileNow();
      await this.commit(startFocusSession(this.getState(), config));
    });
  }

  pause(): Promise<void> {
    return this.enqueue(async () => {
      await this.reconcileNow();
      await this.commit(pauseFocusSession(this.getState()));
    });
  }

  resume(): Promise<void> {
    return this.enqueue(async () => {
      await this.reconcileNow();
      await this.commit(resumeFocusSession(this.getState()));
    });
  }

  reset(): Promise<void> {
    return this.enqueue(async () => {
      await this.commit(resetFocusSession(this.getState()));
    });
  }

  skip(): Promise<void> {
    return this.enqueue(async () => {
      await this.reconcileNow();
      await this.commit(skipFocusSession(this.getState()));
    });
  }

  setMode(mode: FocusMode): Promise<void> {
    return this.enqueue(async () => {
      await this.reconcileNow();
      await this.commit(setFocusMode(this.getState(), mode));
    });
  }

  reconcile(): Promise<void> {
    return this.enqueue(() => this.reconcileNow());
  }

  private enqueue(work: () => Promise<void>): Promise<void> {
    const next = this.operation.then(work, work);
    this.operation = next.catch((error) => {
      console.error("[DashFlow] Focus operation failed", error);
    });
    return next;
  }

  private async reconcileNow(): Promise<void> {
    const before = this.getState();
    const result = reconcileFocusState(before);
    if (!result.completion) {
      this.plugin.data.focus = result.state;
      this.scheduleCompletion(result.state);
      return;
    }

    this.plugin.data.focus = result.state;
    if (result.completion.mode === "focus") {
      this.plugin.activityService.recordFocusSession(
        result.completion.sessionId,
        result.completion.durationMinutes,
        localDate(new Date(result.completion.completedAt)),
      );
    }
    await this.plugin.savePluginData();
    this.scheduleCompletion(result.state);
    this.emit();
  }

  private async commit(nextValue: FocusTimerState): Promise<void> {
    const next = normalizeFocusState(nextValue);
    const previous = this.getState();
    if (JSON.stringify(previous) === JSON.stringify(next)) {
      this.scheduleCompletion(next);
      return;
    }
    this.plugin.data.focus = next;
    await this.plugin.savePluginData();
    this.scheduleCompletion(next);
    this.emit();
  }

  private scheduleCompletion(state: FocusTimerState): void {
    if (this.completionTimer !== null) {
      window.clearTimeout(this.completionTimer);
      this.completionTimer = null;
    }
    if (state.status !== "running" || !state.endsAt) return;
    const delay = Math.max(0, state.endsAt - Date.now());
    this.completionTimer = window.setTimeout(() => {
      this.completionTimer = null;
      void this.reconcile();
    }, Math.min(delay + 25, 2_147_000_000));
  }

  private emit(): void {
    for (const listener of this.listeners) listener();
  }
}

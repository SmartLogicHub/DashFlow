import { setIcon } from "obsidian";
import type DashFlowPlugin from "../main";
import type { FocusMode, FocusWidgetConfig, WidgetInstance } from "../models";
import {
  durationMinutesForMode,
  focusRemainingMs,
  normalizeFocusConfig,
} from "../focus/focusTimer";
import { localDate } from "../utils/date";

const MODES: Array<[FocusMode, string]> = [
  ["focus", "专注"],
  ["short-break", "短休息"],
  ["long-break", "长休息"],
];

function formatTime(milliseconds: number): string {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

export class FocusWidgetInteractionService {
  private unsubscribeDashboard: (() => void) | null = null;
  private unsubscribeFocus: (() => void) | null = null;
  private scheduled = false;
  private displayTimer: number | null = null;

  constructor(private readonly plugin: DashFlowPlugin) {}

  start(): void {
    this.unsubscribeDashboard = this.plugin.dashboardManager.subscribe(() => this.schedule());
    this.unsubscribeFocus = this.plugin.focusService.subscribe(() => this.schedule());
    this.plugin.registerEvent(this.plugin.app.workspace.on("layout-change", () => this.schedule()));
    this.plugin.registerEvent(this.plugin.app.workspace.on("active-leaf-change", () => this.schedule()));
    this.displayTimer = window.setInterval(() => this.updateClocks(), 1000);
    this.schedule();
  }

  stop(): void {
    this.unsubscribeDashboard?.();
    this.unsubscribeDashboard = null;
    this.unsubscribeFocus?.();
    this.unsubscribeFocus = null;
    if (this.displayTimer !== null) {
      window.clearInterval(this.displayTimer);
      this.displayTimer = null;
    }
  }

  schedule(): void {
    if (this.scheduled) return;
    this.scheduled = true;
    window.setTimeout(() => {
      this.scheduled = false;
      this.decorate();
      this.updateClocks();
    }, 0);
  }

  private decorate(): void {
    const dashboard = this.plugin.dashboardManager.active();
    const widgets = new Map(dashboard.widgets.map((widget) => [widget.id, widget]));
    const state = this.plugin.focusService.getState();
    for (const card of document.querySelectorAll<HTMLElement>(".dashflow-widget[data-widget-id]")) {
      const id = card.dataset.widgetId;
      const widget = id ? widgets.get(id) : undefined;
      if (!widget || widget.type !== "focus") continue;
      const body = card.querySelector<HTMLElement>(".dashflow-widget-body");
      if (!body) continue;
      const signature = `${widget.id}:${state.mode}:${state.status}:${state.sessionId ?? ""}:${state.completedFocusSessions}:${JSON.stringify(widget.config)}`;
      if (body.dataset.dashflowFocus === signature) continue;
      body.dataset.dashflowFocus = signature;
      this.render(body, widget);
    }
  }

  private render(body: HTMLElement, widget: WidgetInstance): void {
    body.replaceChildren();
    const state = this.plugin.focusService.getState();
    const config = normalizeFocusConfig(widget.config as Partial<FocusWidgetConfig>);
    const root = document.createElement("div");
    root.className = `dashflow-focus is-${state.mode} is-${state.status}`;

    const modeRow = document.createElement("div");
    modeRow.className = "dashflow-focus-modes";
    for (const [mode, label] of MODES) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.classList.toggle("is-active", state.mode === mode);
      button.disabled = state.status !== "idle";
      button.setAttribute("aria-pressed", state.mode === mode ? "true" : "false");
      button.addEventListener("click", () => void this.plugin.focusService.setMode(mode));
      modeRow.appendChild(button);
    }

    const clock = document.createElement("div");
    clock.className = "dashflow-focus-clock";
    const time = document.createElement("strong");
    time.className = "dashflow-focus-time";
    time.dataset.focusWidgetId = widget.id;
    time.dataset.idleMinutes = String(durationMinutesForMode(config, state.mode));
    time.textContent = this.clockText(config);
    const status = document.createElement("span");
    status.className = "dashflow-focus-status";
    status.textContent = state.status === "running" ? "进行中" : state.status === "paused" ? "已暂停" : "准备开始";
    clock.append(time, status);

    const progress = document.createElement("div");
    progress.className = "dashflow-focus-progress";
    const fill = document.createElement("span");
    fill.dataset.focusProgressWidgetId = widget.id;
    progress.appendChild(fill);

    const actions = document.createElement("div");
    actions.className = "dashflow-focus-actions";
    const primary = this.iconButton(
      state.status === "running" ? "pause" : "play",
      state.status === "running" ? "暂停" : state.status === "paused" ? "继续" : "开始",
      true,
    );
    primary.addEventListener("click", () => {
      if (state.status === "running") void this.plugin.focusService.pause();
      else if (state.status === "paused") void this.plugin.focusService.resume();
      else void this.plugin.focusService.startSession(config);
    });
    const reset = this.iconButton("rotate-ccw", "重置");
    reset.disabled = state.status === "idle";
    reset.addEventListener("click", () => void this.plugin.focusService.reset());
    const skip = this.iconButton("skip-forward", "跳过");
    skip.addEventListener("click", () => void this.plugin.focusService.skip());
    actions.append(primary, reset, skip);

    const today = this.plugin.activityService.getStore().days[localDate()];
    const meta = document.createElement("div");
    meta.className = "dashflow-focus-meta";
    const cycle = document.createElement("span");
    cycle.textContent = `周期完成 ${state.completedFocusSessions}`;
    const activity = document.createElement("span");
    activity.textContent = `今日 ${today?.focusSessions ?? 0} 次 · ${today?.focusMinutes ?? 0} min`;
    meta.append(cycle, activity);

    root.append(modeRow, clock, progress, actions, meta);
    body.appendChild(root);
  }

  private updateClocks(): void {
    const state = this.plugin.focusService.getState();
    const remaining = focusRemainingMs(state);
    for (const time of document.querySelectorAll<HTMLElement>(".dashflow-focus-time[data-focus-widget-id]")) {
      if (state.status === "idle") {
        const minutes = Math.max(1, Number(time.dataset.idleMinutes) || 25);
        time.textContent = formatTime(minutes * 60_000);
      } else {
        time.textContent = formatTime(remaining);
      }
    }
    for (const fill of document.querySelectorAll<HTMLElement>("[data-focus-progress-widget-id]")) {
      if (state.status === "idle") {
        fill.style.width = "0%";
        continue;
      }
      const duration = Math.max(1, (state.durationMinutes ?? 1) * 60_000);
      const elapsed = Math.max(0, Math.min(duration, duration - remaining));
      fill.style.width = `${Math.round((elapsed / duration) * 100)}%`;
    }
  }

  private clockText(config: FocusWidgetConfig): string {
    const state = this.plugin.focusService.getState();
    if (state.status === "idle") return formatTime(durationMinutesForMode(config, state.mode) * 60_000);
    return formatTime(focusRemainingMs(state));
  }

  private iconButton(iconName: string, label: string, primary = false): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `dashflow-focus-action${primary ? " is-primary" : ""}`;
    const icon = document.createElement("span");
    setIcon(icon, iconName);
    const text = document.createElement("span");
    text.textContent = label;
    button.append(icon, text);
    return button;
  }
}

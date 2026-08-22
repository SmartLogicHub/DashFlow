import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { activityScore, emptyDailyActivity } from "../src/activity/activityMath";
import {
  DEFAULT_FOCUS_CONFIG,
  focusRemainingMs,
  normalizeFocusConfig,
  normalizeFocusState,
  pauseFocusSession,
  reconcileFocusState,
  resumeFocusSession,
  setFocusMode,
  startFocusSession,
} from "../src/focus/focusTimer";
import { magicEmbedSandbox, parseSafeEmbedUrl } from "../src/embed/safeEmbed";

const focusService = readFileSync("src/services/FocusService.ts", "utf8");
const focusInteraction = readFileSync("src/services/FocusWidgetInteractionService.ts", "utf8");
const embedInteraction = readFileSync("src/services/MagicEmbedWidgetInteractionService.ts", "utf8");
const focusWidget = readFileSync("src/widgets/focus.ts", "utf8");
const embedWidget = readFileSync("src/widgets/embed.ts", "utf8");
const dashboardRenderer = readFileSync("src/dashboard/DashboardRenderer.ts", "utf8");
const activityService = readFileSync("src/services/ActivityService.ts", "utf8");
const design = readFileSync("src/services/DesignSystemService.ts", "utf8");
const styles = readFileSync("src/styles/FocusEmbedStyles.ts", "utf8");
const main = readFileSync("src/main.ts", "utf8");

const config = { ...DEFAULT_FOCUS_CONFIG, focusMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15, longBreakEvery: 4 };

test("Focus state machine derives remaining time from timestamps", () => {
  const started = startFocusSession({ mode: "focus", status: "idle", completedFocusSessions: 0 }, config, 1_000);
  assert.equal(started.status, "running");
  assert.equal(started.endsAt, 1_501_000);
  assert.equal(focusRemainingMs(started, 601_000), 900_000);
  assert.equal(focusRemainingMs(started, 2_000_000), 0);
});

test("Focus pause and resume preserve remaining duration instead of decrement ticks", () => {
  const started = startFocusSession({ mode: "focus", status: "idle", completedFocusSessions: 0 }, config, 1_000);
  const paused = pauseFocusSession(started, 601_000);
  assert.equal(paused.status, "paused");
  assert.equal(paused.pausedRemainingMs, 900_000);
  const resumed = resumeFocusSession(paused, 1_000_000);
  assert.equal(resumed.status, "running");
  assert.equal(resumed.endsAt, 1_900_000);
  assert.equal(resumed.sessionId, started.sessionId);
});

test("Focus reconciliation survives sleep and emits each completion once", () => {
  const started = startFocusSession({ mode: "focus", status: "idle", completedFocusSessions: 0 }, config, 1_000);
  const restored = normalizeFocusState(JSON.parse(JSON.stringify(started)));
  const completed = reconcileFocusState(restored, 2_000_000);
  assert.equal(completed.completion?.sessionId, started.sessionId);
  assert.equal(completed.completion?.durationMinutes, 25);
  assert.equal(completed.state.status, "idle");
  assert.equal(completed.state.mode, "short-break");
  assert.equal(completed.state.completedFocusSessions, 1);
  assert.equal(reconcileFocusState(completed.state, 2_000_001).completion, undefined);
});

test("Focus enters a long break after the configured completed-session cadence", () => {
  const started = startFocusSession({ mode: "focus", status: "idle", completedFocusSessions: 3 }, config, 10_000);
  const completed = reconcileFocusState(started, (started.endsAt ?? 0) + 1);
  assert.equal(completed.state.completedFocusSessions, 4);
  assert.equal(completed.state.mode, "long-break");
});

test("Focus mode can only be changed while idle and config is bounded", () => {
  const idle = { mode: "focus" as const, status: "idle" as const, completedFocusSessions: 0 };
  assert.equal(setFocusMode(idle, "long-break").mode, "long-break");
  const running = startFocusSession(idle, config, 1_000);
  assert.equal(setFocusMode(running, "long-break").mode, "focus");
  const normalized = normalizeFocusConfig({ focusMinutes: 999, shortBreakMinutes: 0, longBreakMinutes: -1, longBreakEvery: 99 });
  assert.equal(normalized.focusMinutes, 180);
  assert.equal(normalized.shortBreakMinutes, 5);
  assert.equal(normalized.longBreakMinutes, 15);
  assert.equal(normalized.longBreakEvery, 12);
});

test("Focus contributes to Activity without changing existing metrics when unused", () => {
  const day = emptyDailyActivity("2026-08-16");
  assert.equal(activityScore(day), 0);
  day.focusSessions = 2;
  day.focusMinutes = 50;
  assert.equal(activityScore(day), 4);
  assert.deepEqual(day.completedFocusSessionKeys, []);
});

test("Focus service uses exact completion timeout and deduplicated Activity session IDs", () => {
  assert.ok(focusService.includes("state.endsAt - Date.now()"));
  assert.ok(focusService.includes("window.setTimeout"));
  assert.ok(focusService.includes("recordFocusSession"));
  assert.ok(activityService.includes("completedFocusSessionKeys.includes(id)"));
  assert.ok(activityService.includes("day.focusMinutes"));
  assert.equal(focusService.includes("setInterval"), false);
  assert.ok(focusInteraction.includes("window.setInterval(() => this.updateClocks(), 1000)"));
  assert.ok(focusInteraction.includes("focusRemainingMs(state)"));
});

test("Magic Embed accepts HTTPS and loopback HTTP only", () => {
  assert.equal(parseSafeEmbedUrl("https://example.com/app")?.origin, "https://example.com");
  assert.equal(parseSafeEmbedUrl("http://localhost:3000/app")?.hostname, "localhost");
  assert.equal(parseSafeEmbedUrl("http://127.0.0.1:5173")?.hostname, "127.0.0.1");
  assert.equal(parseSafeEmbedUrl("http://example.com"), null);
  assert.equal(parseSafeEmbedUrl("javascript:alert(1)"), null);
  assert.equal(parseSafeEmbedUrl("data:text/html,test"), null);
  assert.equal(parseSafeEmbedUrl("file:///tmp/test.html"), null);
  assert.equal(parseSafeEmbedUrl("https://user:pass@example.com"), null);
});

test("Magic Embed sandbox deliberately excludes same-origin privilege", () => {
  const defaultSandbox = magicEmbedSandbox(false);
  assert.ok(defaultSandbox.includes("allow-scripts"));
  assert.ok(defaultSandbox.includes("allow-popups"));
  assert.equal(defaultSandbox.includes("allow-forms"), false);
  assert.equal(defaultSandbox.includes("allow-same-origin"), false);
  assert.ok(magicEmbedSandbox(true).includes("allow-forms"));
});

test("Magic Embed is click-to-load and does not auto-network imported Dashboard configs", () => {
  assert.ok(embedInteraction.includes("approvedThisSession"));
  assert.ok(embedInteraction.includes("加载嵌入内容"));
  assert.ok(embedInteraction.includes("this.approvedThisSession.add(key)"));
  assert.ok(embedInteraction.includes('iframe.setAttribute("sandbox"'));
  assert.ok(embedInteraction.includes('iframe.referrerPolicy = "no-referrer"'));
  assert.ok(embedInteraction.includes('iframe.loading = "lazy"'));
  assert.ok(embedInteraction.includes('external.rel = "noopener noreferrer"'));
  assert.equal(embedInteraction.includes("new MutationObserver"), false);
});

test("unconfigured webpage embeds open their own card configuration directly", () => {
  assert.ok(embedInteraction.includes("配置嵌入地址"));
  assert.ok(embedInteraction.includes("DASHFLOW_CONFIGURE_WIDGET_EVENT"));
  assert.ok(embedInteraction.includes("new CustomEvent"));
  assert.ok(dashboardRenderer.includes("DASHFLOW_CONFIGURE_WIDGET_EVENT"));
  assert.ok(dashboardRenderer.includes("dashboard.widgets.some"));
  assert.ok(dashboardRenderer.includes("this.configuringWidgetId = widgetId"));
  assert.ok(styles.includes("dashflow-magic-embed-configure"));
});

test("webpage embeds explain iframe restrictions and offer external recovery", () => {
  assert.ok(embedInteraction.includes("网站可能禁止被嵌入"));
  assert.ok(embedInteraction.includes('iframe.addEventListener("error"'));
  assert.ok(embedInteraction.includes("在浏览器打开"));
});

test("Focus and Magic Embed expose no arbitrary JavaScript execution primitive", () => {
  for (const source of [focusService, focusInteraction, embedInteraction]) {
    assert.equal(source.includes("eval("), false);
    assert.equal(source.includes("new Function"), false);
    assert.equal(source.includes("innerHTML ="), false);
  }
});

test("Focus and Magic Embed are registered, lifecycle-managed and styled centrally", () => {
  assert.ok(focusWidget.includes('type: "focus"'));
  assert.ok(embedWidget.includes('type: "magic-embed"'));
  assert.ok(main.includes("registerFocusWidgets(this.widgetRegistry)"));
  assert.ok(main.includes("registerEmbedWidgets(this.widgetRegistry)"));
  assert.ok(main.includes("this.focusService.start()"));
  assert.ok(main.includes("this.focusService?.stop()"));
  assert.ok(main.includes("this.focusWidgets.start()"));
  assert.ok(main.includes("this.magicEmbedWidgets.start()"));
  assert.ok(styles.includes("dashflow-focus-time"));
  assert.ok(styles.includes("dashflow-magic-embed-gate"));
  assert.ok(design.includes('import { FOCUS_EMBED_STYLES }'));
  assert.ok(design.includes("FOCUS_EMBED_STYLES,"));
});

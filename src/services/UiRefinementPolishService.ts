import { normalizePath, TFile } from "obsidian";
import type DashFlowPlugin from "../main";

const STYLE_ID = "dashflow-ui-refinement-polish-v042";

export const UI_REFINEMENT_POLISH_STYLES = `
/* Screenshot-driven final pass for v0.4.2. Keep behavior/data untouched.
 * Geometry shared by Home and Work belongs to the base design services;
 * this layer refines states, dense work content and cross-page visual continuity.
 */

/* SHARED AMBIENCE ------------------------------------------------------- */
.dashflow-view-container[data-dashflow-theme] {
  position: relative;
  isolation: isolate;
}

.dashflow-command-shell {
  position: relative;
  z-index: 1;
}

/* Keep the full photographic Hero unique to Home, but let every working
 * surface inherit a quiet trace of the same scene. This avoids the abrupt
 * jump from a personal homepage into a sterile admin canvas. */
.dashflow-command-shell:not(.is-personal-home)::before {
  content: "";
  position: absolute;
  z-index: -1;
  pointer-events: none;
  left: -10px;
  right: -10px;
  top: -6px;
  height: 154px;
  border-radius: 16px;
  background-image:
    linear-gradient(180deg,
      color-mix(in srgb, var(--df-cmd-bg) 28%, transparent) 0%,
      color-mix(in srgb, var(--df-cmd-bg) 68%, transparent) 52%,
      var(--df-cmd-bg) 100%),
    var(--df-ambient-image, var(--df-home-scene));
  background-size: cover;
  background-position: center 48%;
  filter: saturate(.72) contrast(.92);
  opacity: .16;
  -webkit-mask-image: linear-gradient(180deg, #000 0%, rgba(0,0,0,.82) 48%, transparent 100%);
  mask-image: linear-gradient(180deg, #000 0%, rgba(0,0,0,.82) 48%, transparent 100%);
}

.theme-dark .dashflow-command-shell:not(.is-personal-home)::before {
  opacity: .20;
  filter: saturate(.62) brightness(.76) contrast(.96);
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-command-bar,
.dashflow-command-shell:not(.is-personal-home) .dashflow-command-page,
.dashflow-command-shell:not(.is-personal-home) .dashflow-widget {
  backdrop-filter: blur(8px);
}

/* HOME ------------------------------------------------------------------ */
.dashflow-home-top-grid {
  align-items: start!important;
}

.dashflow-home-focus:has(.dashflow-home-empty) {
  min-height: 0!important;
}

.dashflow-home-focus:has(.dashflow-home-empty) .dashflow-home-empty {
  min-height: 68px!important;
  padding: 10px 14px!important;
  align-items: center!important;
  gap: 12px!important;
}

.dashflow-home-focus:has(.dashflow-home-empty) .dashflow-home-empty p {
  margin-top: 2px!important;
}

/* The section heading is a real h2. Reset Obsidian heading margins/colors so
 * it cannot inherit an unrelated orange theme accent or create a large gap. */
.dashflow-home-section,
.dashflow-home-areas-section {
  margin: 0!important;
  padding: 0!important;
}

.dashflow-home-section-head {
  min-height: 28px!important;
  padding: 0 2px!important;
}

.dashflow-home-section-head h2 {
  margin: 0!important;
  padding: 0!important;
  color: var(--df-home-text)!important;
  font-size: 15px!important;
  line-height: 1.2!important;
  font-weight: 760!important;
  letter-spacing: -.015em!important;
}

/* A disconnected WeRead integration is a setup hint, not the second hero. */
.dashflow-home-weread:has(.dashflow-home-weread-mark) {
  color: var(--df-home-text)!important;
  border: 1px solid var(--df-home-border)!important;
  border-radius: 12px!important;
  background: var(--df-home-surface)!important;
  box-shadow: none!important;
}

.dashflow-home-weread:has(.dashflow-home-weread-mark) .dashflow-home-weread-head {
  height: 30px!important;
  border-bottom-color: var(--df-home-border)!important;
}

.dashflow-home-weread:has(.dashflow-home-weread-mark) .dashflow-home-weread-head strong {
  color: var(--df-home-text)!important;
}

.dashflow-home-weread:has(.dashflow-home-weread-mark) .dashflow-home-weread-head span {
  color: var(--df-home-muted)!important;
}

.dashflow-home-weread:has(.dashflow-home-weread-mark) .dashflow-home-weread-body {
  min-height: 58px!important;
  padding: 8px 14px!important;
  grid-template-columns: 32px minmax(0, 1fr) auto!important;
  gap: 12px!important;
}

.dashflow-home-weread:has(.dashflow-home-weread-mark) .dashflow-home-weread-mark {
  width: 30px!important;
  height: 30px!important;
  border-radius: 8px!important;
  color: var(--df-home-accent)!important;
  background: var(--df-home-accent-soft)!important;
}

.dashflow-home-weread:has(.dashflow-home-weread-mark) .dashflow-home-weread-copy strong,
.dashflow-home-weread:has(.dashflow-home-weread-mark) .dashflow-home-weread-copy p {
  color: var(--df-home-text)!important;
}

.dashflow-home-weread:has(.dashflow-home-weread-mark) .dashflow-home-weread-copy p {
  color: var(--df-home-muted)!important;
  margin-top: 2px!important;
}

.dashflow-home-weread:has(.dashflow-home-weread-mark) .dashflow-home-weread-body > button {
  min-height: 28px!important;
  padding: 0 10px!important;
  border: 1px solid var(--df-home-border)!important;
  border-radius: 7px!important;
  color: var(--df-home-text)!important;
  background: var(--df-home-surface-2)!important;
  box-shadow: none!important;
}

.dashflow-home-area {
  min-height: 54px!important;
  padding-top: 9px!important;
  padding-bottom: 9px!important;
}

/* Recent notes are content rows, not four little form controls. */
.dashflow-home-recent-list {
  padding: 3px 12px 7px!important;
}

.dashflow-home-recent-list > button {
  width: 100%!important;
  min-height: 35px!important;
  padding: 6px 2px!important;
  display: grid!important;
  grid-template-columns: 18px minmax(0, 1fr) auto!important;
  align-items: center!important;
  gap: 9px!important;
  border: 0!important;
  border-bottom: 1px solid color-mix(in srgb, var(--df-home-border) 62%, transparent)!important;
  border-radius: 0!important;
  background: transparent!important;
  box-shadow: none!important;
  color: var(--df-home-text)!important;
  text-align: left!important;
}

.dashflow-home-recent-list > button:last-child {
  border-bottom: 0!important;
}

.dashflow-home-recent-list > button:hover {
  background: var(--df-home-surface-2)!important;
}

.dashflow-home-recent-list > button > span:nth-child(2) {
  min-width: 0!important;
  display: flex!important;
  flex-direction: column!important;
  gap: 1px!important;
}

.dashflow-home-recent-list > button strong {
  overflow: hidden!important;
  text-overflow: ellipsis!important;
  white-space: nowrap!important;
  font-size: 11.5px!important;
}

.dashflow-home-recent-list > button small,
.dashflow-home-recent-list > button time {
  color: var(--df-home-muted)!important;
  font-size: 9.5px!important;
}

/* Hero actions should feel like real workflow entry points. */
.dashflow-home-hero-actions button[data-dashflow-role="start"] {
  min-width: 92px;
}

.dashflow-home-hero-actions button[data-dashflow-role="capture"] {
  min-width: 86px;
}

/* WORK ------------------------------------------------------------------ */
/* Shared shell width, top padding and Command Bar geometry intentionally come
 * from ProductDesignService + PersonalHomeDesignService. Do not override them here.
 */

.dashflow-command-shell:not(.is-personal-home) .dashflow-command-button {
  height: 30px!important;
  padding: 0 9px!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-widget {
  border: 1px solid var(--df-cmd-border)!important;
  border-radius: 12px!important;
  background: color-mix(in srgb, var(--df-cmd-surface) 97%, transparent)!important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02)!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-widget-header {
  height: 36px!important;
  padding: 0 11px!important;
  border-bottom: 1px solid var(--df-cmd-border)!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-widget-body {
  height: calc(100% - 36px)!important;
  box-sizing: border-box!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-widget-header strong {
  font-size: 12.5px!important;
  font-weight: 700!important;
  color: var(--df-cmd-text)!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-widget-icon {
  width: 20px!important;
  height: 20px!important;
  color: var(--df-cmd-muted)!important;
  background: var(--df-cmd-soft)!important;
  border-radius: 6px!important;
}

/* Empty cards and fixed summary widgets should never show a decorative
 * scrollbar. Lists with real overflow still keep their native scroll. */
.dashflow-command-shell:not(.is-personal-home) .dashflow-widget:has(.dashflow-empty) .dashflow-widget-body,
.dashflow-command-shell:not(.is-personal-home) .dashflow-widget[data-widget-type="quick-capture"] .dashflow-widget-body,
.dashflow-command-shell:not(.is-personal-home) .dashflow-widget[data-widget-type="progress"] .dashflow-widget-body,
.dashflow-command-shell:not(.is-personal-home) .dashflow-widget[data-widget-type="countdown"] .dashflow-widget-body {
  overflow: hidden!important;
  scrollbar-width: none!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-widget:has(.dashflow-empty) .dashflow-widget-body::-webkit-scrollbar,
.dashflow-command-shell:not(.is-personal-home) .dashflow-widget[data-widget-type="quick-capture"] .dashflow-widget-body::-webkit-scrollbar,
.dashflow-command-shell:not(.is-personal-home) .dashflow-widget[data-widget-type="progress"] .dashflow-widget-body::-webkit-scrollbar,
.dashflow-command-shell:not(.is-personal-home) .dashflow-widget[data-widget-type="countdown"] .dashflow-widget-body::-webkit-scrollbar {
  display: none!important;
}

/* Empty states should read like one piece of information, not a poster. */
.dashflow-command-shell:not(.is-personal-home) .dashflow-empty {
  min-height: 48px!important;
  padding: 8px 10px!important;
  display: flex!important;
  align-items: center!important;
  justify-content: flex-start!important;
  text-align: left!important;
  color: var(--df-cmd-muted)!important;
  font-size: 11.5px!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-widget-kicker {
  min-height: 24px!important;
  padding: 6px 10px 2px!important;
  margin: 0!important;
  color: var(--df-cmd-muted)!important;
  font-weight: 650!important;
}

/* Quick Capture remains useful but fits its compact top-row slot cleanly. */
.dashflow-command-shell:not(.is-personal-home) .dashflow-widget[data-widget-type="quick-capture"] .dashflow-widget-body {
  padding: 0!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-capture {
  height: 100%!important;
  padding: 7px 10px 8px!important;
  display: flex!important;
  flex-direction: column!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-capture textarea {
  min-height: 34px!important;
  padding: 5px 3px!important;
  resize: none!important;
  color: var(--df-cmd-text)!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-capture-footer {
  min-height: 24px!important;
  margin-top: 2px!important;
  padding-top: 5px!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-capture-footer button {
  height: 26px!important;
  padding: 0 9px!important;
}

/* Today + progress top-row content should fit without tiny inner scrollbars. */
.dashflow-command-shell:not(.is-personal-home) .dashflow-widget[data-widget-type="tasks"] .dashflow-widget-body {
  padding: 0 9px 7px!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-widget[data-widget-type="progress"] .dashflow-widget-body {
  padding: 4px 8px 6px!important;
}

/* Compact project rows: clean 2-column layout and enough room for three rows. */
.dashflow-command-shell:not(.is-personal-home) .dashflow-widget[data-widget-type="projects"] .dashflow-widget-body {
  padding: 3px 10px 5px!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-widget[data-widget-type="projects"] .dashflow-project-list {
  padding: 0!important;
  gap: 0!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-project-row {
  grid-template-columns: minmax(0, 1fr) auto!important;
  gap: 14px!important;
  min-height: 38px!important;
  padding: 4px 3px!important;
  border-bottom: 1px solid color-mix(in srgb, var(--df-cmd-border) 65%, transparent)!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-project-main {
  min-width: 0!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-project-name {
  margin-bottom: 4px!important;
  font-size: 12.5px!important;
  font-weight: 650!important;
  color: var(--df-cmd-text)!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-project-bar {
  height: 3px!important;
  margin-top: 4px!important;
  border-radius: 999px!important;
  background: var(--df-cmd-soft)!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-project-bar > span {
  border-radius: 999px!important;
  background: var(--df-cmd-text)!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-project-stat {
  min-width: 42px!important;
  display: grid!important;
  justify-items: end!important;
  gap: 1px!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-project-stat strong {
  font-size: 12px!important;
  font-weight: 700!important;
  color: var(--df-cmd-text)!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-project-stat span {
  font-size: 10px!important;
  color: var(--df-cmd-muted)!important;
}

/* Progress and countdown: factual, balanced metrics. */
.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-metric {
  border: 0!important;
  background: transparent!important;
  gap: 5px!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-ring {
  width: 60px!important;
  height: 60px!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-ring strong {
  font-size: 15px!important;
  font-weight: 750!important;
  color: var(--df-cmd-text)!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-ring span {
  font-size: 9px!important;
  font-weight: 700!important;
  color: var(--df-cmd-muted)!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-pair {
  gap: 10px!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-caption {
  font-size: 9.5px!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-countdown strong,
.dashflow-command-shell:not(.is-personal-home) .dashflow-countdown-value {
  font-size: 44px!important;
  line-height: .95!important;
  font-weight: 800!important;
  color: var(--df-cmd-text)!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-countdown {
  gap: 4px!important;
}

/* Activity heatmap. */
.dashflow-command-shell:not(.is-personal-home) .dashflow-heatmap-grid {
  gap: 2px!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-heatmap-cell {
  border-radius: 2px!important;
}

/* CALENDAR -------------------------------------------------------------- */
/* One accent, one job: today and selected no longer fight with green +
 * cyan/purple glow at the same time. */
.dashflow-command-shell:not(.is-personal-home) .dashflow-calendar-day.is-today {
  border: 1px solid color-mix(in srgb, var(--df-home-accent, var(--df-cmd-purple)) 58%, var(--df-cmd-border))!important;
  background: color-mix(in srgb, var(--df-home-accent, var(--df-cmd-purple)) 6%, var(--df-cmd-surface))!important;
  box-shadow: none!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-calendar-day.is-today .dashflow-calendar-day-number {
  color: var(--df-home-accent, var(--df-cmd-purple))!important;
  background: transparent!important;
  box-shadow: none!important;
  font-weight: 800!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-calendar-day.is-selected {
  border-color: var(--df-home-accent, var(--df-cmd-purple))!important;
  background: color-mix(in srgb, var(--df-home-accent, var(--df-cmd-purple)) 8%, var(--df-cmd-surface))!important;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--df-home-accent, var(--df-cmd-purple)) 22%, transparent)!important;
}

/* REVIEW ---------------------------------------------------------------- */
/* Turn four tiny admin-stat cards into one calm summary strip. */
.dashflow-command-shell:not(.is-personal-home) .dashflow-weekly-kpis {
  gap: 0!important;
  overflow: hidden!important;
  border: 1px solid var(--df-cmd-border)!important;
  border-radius: 10px!important;
  background: color-mix(in srgb, var(--df-cmd-surface) 96%, transparent)!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-weekly-kpi {
  min-height: 58px!important;
  padding: 8px 10px!important;
  border: 0!important;
  border-right: 1px solid var(--df-cmd-border)!important;
  border-radius: 0!important;
  background: transparent!important;
  box-shadow: none!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-weekly-kpi:last-child {
  border-right: 0!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-weekly-kpi::before {
  display: none!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-weekly-kpi strong {
  font-size: 18px!important;
  color: var(--df-cmd-text)!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-weekly-row {
  min-height: 34px!important;
  padding: 5px 7px!important;
  border: 0!important;
  border-bottom: 1px solid color-mix(in srgb, var(--df-cmd-border) 65%, transparent)!important;
  border-radius: 0!important;
  background: transparent!important;
  box-shadow: none!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-weekly-row:last-child {
  border-bottom: 0!important;
}

/* Give a meaningful response when the Hero's primary action enters Work. */
.dashflow-command-shell:not(.is-personal-home) .dashflow-widget.is-hero-action-target {
  border-color: color-mix(in srgb, var(--df-home-accent, var(--df-cmd-purple)) 58%, var(--df-cmd-border))!important;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--df-home-accent, var(--df-cmd-purple)) 10%, transparent)!important;
}

@media (max-width: 760px) {
  .dashflow-home-weread:has(.dashflow-home-weread-mark) .dashflow-home-weread-body {
    grid-template-columns: 32px minmax(0, 1fr)!important;
  }
  .dashflow-home-weread:has(.dashflow-home-weread-mark) .dashflow-home-weread-body > button {
    grid-column: 1 / -1;
    justify-self: start;
  }
  .dashflow-command-shell:not(.is-personal-home)::before {
    left: -4px;
    right: -4px;
    height: 118px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dashflow-command-shell *,
  .dashflow-personal-home * {
    transition: none!important;
    animation: none!important;
    scroll-behavior: auto!important;
  }
}
`;

export class UiRefinementPolishService {
  private observer: MutationObserver | null = null;
  private scheduled = false;

  constructor(private readonly plugin: DashFlowPlugin) {}

  start(): void {
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = UI_REFINEMENT_POLISH_STYLES;
      document.head.appendChild(style);
    }

    this.observer = new MutationObserver(() => this.scheduleSync());
    this.observer.observe(document.body, { childList: true, subtree: true });
    this.scheduleSync();
  }

  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
    document.getElementById(STYLE_ID)?.remove();
  }

  private scheduleSync(): void {
    if (this.scheduled) return;
    this.scheduled = true;
    window.setTimeout(() => {
      this.scheduled = false;
      this.syncAmbientImage();
      this.enhanceHeroActions();
    }, 24);
  }

  private syncAmbientImage(): void {
    const customImage = this.resolveLocalHeroImage();
    for (const view of document.querySelectorAll<HTMLElement>(".dashflow-view-container")) {
      if (customImage) view.style.setProperty("--df-ambient-image", `url(\"${customImage.replace(/\"/g, "%22")}\")`);
      else view.style.removeProperty("--df-ambient-image");
    }
  }

  private resolveLocalHeroImage(): string | null {
    const path = this.plugin.data.settings.homeHeroImagePath.trim();
    if (!path) return null;
    const file = this.plugin.app.vault.getAbstractFileByPath(normalizePath(path));
    return file instanceof TFile ? this.plugin.app.vault.getResourcePath(file) : null;
  }

  private enhanceHeroActions(): void {
    for (const actions of document.querySelectorAll<HTMLElement>(".dashflow-home-hero-actions")) {
      const buttons = actions.querySelectorAll<HTMLButtonElement>(":scope > button");
      const start = buttons[0];
      const capture = buttons[1];

      if (start && start.dataset.dashflowPolished !== "1") {
        start.dataset.dashflowPolished = "1";
        start.dataset.dashflowRole = "start";
        start.textContent = "开始今天 →";
        start.title = "进入工作台，并聚焦今日任务";
        start.setAttribute("aria-label", "开始今天：进入工作台并聚焦今日任务");
        start.addEventListener("click", () => {
          window.setTimeout(() => this.focusTodayWidget(), 48);
        });
      }

      if (capture && capture.dataset.dashflowPolished !== "1") {
        capture.dataset.dashflowPolished = "1";
        capture.dataset.dashflowRole = "capture";
        capture.textContent = "收集灵感";
        capture.title = "打开 Quick Add，把一句想法收进 Inbox";
        capture.setAttribute("aria-label", "收集灵感：打开 Quick Add 并写入 Inbox");
      }
    }
  }

  private focusTodayWidget(): void {
    const card = document.querySelector<HTMLElement>(
      '.dashflow-command-shell:not(.is-personal-home) .dashflow-widget[data-widget-id="today-tasks"]',
    );
    if (!card) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    card.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
    card.classList.add("is-hero-action-target");
    window.setTimeout(() => card.classList.remove("is-hero-action-target"), reduceMotion ? 0 : 900);
  }
}

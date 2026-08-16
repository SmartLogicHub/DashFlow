const STYLE_ID = "dashflow-ui-refinement-polish-v042";

export const UI_REFINEMENT_POLISH_STYLES = `
/* Screenshot-driven final pass for v0.4.2. Keep behavior/data untouched.
 * Geometry shared by Home and Work belongs to the base design services;
 * this layer only refines states and dense work content so it cannot reintroduce layout shift.
 */

/* HOME ------------------------------------------------------------------ */
.dashflow-home-top-grid {
  align-items: start!important;
}

.dashflow-home-focus:has(.dashflow-home-empty) {
  min-height: 0!important;
}

.dashflow-home-focus:has(.dashflow-home-empty) .dashflow-home-empty {
  min-height: 72px!important;
  padding: 12px 14px!important;
  align-items: center!important;
  gap: 12px!important;
}

.dashflow-home-focus:has(.dashflow-home-empty) .dashflow-home-empty p {
  margin-top: 2px!important;
}

/* A disconnected WeRead integration is a setup hint, not the second hero. */
.dashflow-home-weread:has(.dashflow-home-weread-mark) {
  color: var(--df-home-text)!important;
  border: 1px solid var(--df-home-border)!important;
  background: var(--df-home-surface)!important;
  box-shadow: none!important;
}

.dashflow-home-weread:has(.dashflow-home-weread-mark) .dashflow-home-weread-head {
  height: 32px!important;
  border-bottom-color: var(--df-home-border)!important;
}

.dashflow-home-weread:has(.dashflow-home-weread-mark) .dashflow-home-weread-head strong {
  color: var(--df-home-text)!important;
}

.dashflow-home-weread:has(.dashflow-home-weread-mark) .dashflow-home-weread-head span {
  color: var(--df-home-muted)!important;
}

.dashflow-home-weread:has(.dashflow-home-weread-mark) .dashflow-home-weread-body {
  min-height: 68px!important;
  padding: 10px 14px!important;
  grid-template-columns: 34px minmax(0, 1fr) auto!important;
  gap: 12px!important;
}

.dashflow-home-weread:has(.dashflow-home-weread-mark) .dashflow-home-weread-mark {
  width: 32px!important;
  height: 32px!important;
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
  min-height: 30px!important;
  padding: 0 11px!important;
  border: 1px solid var(--df-home-border)!important;
  border-radius: 7px!important;
  color: var(--df-home-text)!important;
  background: var(--df-home-surface-2)!important;
  box-shadow: none!important;
}

.dashflow-home-area {
  min-height: 58px!important;
  padding-top: 10px!important;
  padding-bottom: 10px!important;
}

/* WORK ------------------------------------------------------------------ */
/* Shared shell width, top padding and Command Bar geometry intentionally come
 * from ProductDesignService + PersonalHomeDesignService. Do not override them here.
 */

.dashflow-command-shell:not(.is-personal-home) .dashflow-widget {
  border-color: color-mix(in srgb, var(--df-cmd-border) 78%, transparent)!important;
  border-radius: 10px!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-widget-header {
  height: 36px!important;
  padding: 0 11px!important;
  border-bottom-color: color-mix(in srgb, var(--df-cmd-border) 58%, transparent)!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-widget-header strong {
  font-size: 12px!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-widget-icon {
  width: 20px!important;
  height: 20px!important;
  color: var(--df-cmd-muted)!important;
  background: var(--df-cmd-soft)!important;
}

/* Empty states should read like a single line of information, not a poster. */
.dashflow-command-shell:not(.is-personal-home) .dashflow-empty {
  min-height: 52px!important;
  padding: 10px 12px!important;
  display: flex!important;
  align-items: center!important;
  justify-content: flex-start!important;
  text-align: left!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-widget-kicker {
  min-height: 26px!important;
  padding: 7px 11px 3px!important;
}

/* Quick Capture remains useful, but no longer dominates an entire quadrant. */
.dashflow-command-shell:not(.is-personal-home) .dashflow-capture {
  height: 100%!important;
  padding: 8px 10px 9px!important;
  display: flex!important;
  flex-direction: column!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-capture textarea {
  min-height: 42px!important;
  padding: 5px 3px!important;
  resize: none!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-capture-footer {
  min-height: 28px!important;
}

/* Renderer has two project-row children: content + statistics. */
.dashflow-command-shell:not(.is-personal-home) .dashflow-project-row {
  grid-template-columns: minmax(0, 1fr) auto!important;
  gap: 16px!important;
  min-height: 42px!important;
  padding: 5px 2px!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-project-main {
  min-width: 0!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-project-bar {
  height: 3px!important;
  margin-top: 7px!important;
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
  font-size: 11.5px!important;
}

/* Progress and countdown become factual supporting metrics. */
.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-ring {
  width: 60px!important;
  height: 60px!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-pair {
  gap: 8px!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-metric {
  gap: 5px!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-countdown strong,
.dashflow-command-shell:not(.is-personal-home) .dashflow-countdown-value {
  font-size: 48px!important;
  line-height: 0.95!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-countdown {
  gap: 4px!important;
}

/* Activity should occupy its row without looking like a blank report canvas. */
.dashflow-command-shell:not(.is-personal-home) .dashflow-heatmap-grid {
  gap: 2px!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-heatmap-cell {
  border-radius: 2px!important;
}

@media (max-width: 760px) {
  .dashflow-home-weread:has(.dashflow-home-weread-mark) .dashflow-home-weread-body {
    grid-template-columns: 34px minmax(0, 1fr)!important;
  }
  .dashflow-home-weread:has(.dashflow-home-weread-mark) .dashflow-home-weread-body > button {
    grid-column: 1 / -1;
    justify-self: start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dashflow-command-shell *,
  .dashflow-personal-home * {
    transition: none!important;
    animation: none!important;
  }
}
`;

export class UiRefinementPolishService {
  start(): void {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = UI_REFINEMENT_POLISH_STYLES;
    document.head.appendChild(style);
  }

  stop(): void {
    document.getElementById(STYLE_ID)?.remove();
  }
}

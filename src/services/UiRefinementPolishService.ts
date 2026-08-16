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
  border-radius: 12px!important;
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

.dashflow-command-shell:not(.is-personal-home) .dashflow-command-button {
  height: 29px!important;
  padding: 0 9px!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-widget {
  border: 1px solid var(--df-cmd-border)!important;
  border-radius: 12px!important;
  background: var(--df-cmd-surface)!important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02)!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-widget-header {
  height: 36px!important;
  padding: 0 11px!important;
  border-bottom: 1px solid var(--df-cmd-border)!important;
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

/* Empty states should read like a single line of information, not a poster. */
.dashflow-command-shell:not(.is-personal-home) .dashflow-empty {
  min-height: 52px!important;
  padding: 10px 12px!important;
  display: flex!important;
  align-items: center!important;
  justify-content: flex-start!important;
  text-align: left!important;
  color: var(--df-cmd-muted)!important;
  font-size: 11.5px!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-widget-kicker {
  min-height: 26px!important;
  padding: 7px 11px 3px!important;
  color: var(--df-cmd-muted)!important;
  font-weight: 650!important;
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
  color: var(--df-cmd-text)!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-capture-footer {
  min-height: 28px!important;
}

/* Compact project rows: clean 2-column layout. */
.dashflow-command-shell:not(.is-personal-home) .dashflow-project-row {
  grid-template-columns: minmax(0, 1fr) auto!important;
  gap: 16px!important;
  min-height: 44px!important;
  padding: 6px 4px!important;
  border-bottom: 1px solid color-mix(in srgb, var(--df-cmd-border) 65%, transparent)!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-project-main {
  min-width: 0!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-project-name {
  font-size: 12.5px!important;
  font-weight: 650!important;
  color: var(--df-cmd-text)!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-project-bar {
  height: 4px!important;
  margin-top: 6px!important;
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

/* Progress and countdown: refined, balanced metrics. */
.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-metric {
  border: 0!important;
  background: transparent!important;
  gap: 6px!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-ring {
  width: 68px!important;
  height: 68px!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-ring strong {
  font-size: 16px!important;
  font-weight: 750!important;
  color: var(--df-cmd-text)!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-ring span {
  font-size: 9.5px!important;
  font-weight: 700!important;
  color: var(--df-cmd-muted)!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-pair {
  gap: 12px!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-countdown strong,
.dashflow-command-shell:not(.is-personal-home) .dashflow-countdown-value {
  font-size: 44px!important;
  line-height: 0.95!important;
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

@media (max-width: 980px) {
  .dashflow-command-shell:not(.is-personal-home) {
    width: calc(100% - 20px)!important;
  }
}

@media (max-width: 760px) {
  .dashflow-command-shell:not(.is-personal-home) .dashflow-command-bar {
    border-bottom: 0!important;
  }
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

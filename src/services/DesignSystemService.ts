import { INTERACTION_MOTION_STYLES } from "../styles/InteractionMotionStyles";
import { UI_REFINEMENT_POLISH_STYLES } from "../styles/UiRefinementStyles";
import { VISUAL_CONTINUITY_STYLES } from "../styles/VisualContinuityStyles";

const STYLE_ID = "dashflow-design-system-v044";

/**
 * Consolidated design-system layer.
 *
 * This service is presentation-only: no MutationObserver, no event handlers,
 * and no access to Task / Project / Habit data. Earlier visual layers are kept
 * as styles-only modules and loaded here in their original cascade order while
 * interaction motion is layered last so card feedback remains consistent.
 */
export const DESIGN_SYSTEM_STYLES = `
.dashflow-view-container {
  --df-space-1: 4px;
  --df-space-2: 8px;
  --df-space-3: 12px;
  --df-space-4: 16px;
  --df-space-5: 24px;

  --df-radius-sm: 6px;
  --df-radius-md: 10px;
  --df-radius-lg: 14px;

  --df-font-xs: 11px;
  --df-font-sm: 12.5px;
  --df-font-md: 13px;
  --df-font-lg: 16px;

  --df-control-sm: 28px;
  --df-control-md: 32px;
  --df-page-hero-height: 88px;
}

/* Home remains the emotional 194px landing surface. Working sections should
 * expose useful data earlier instead of repeating a second landing page. */
.dashflow-command-shell:not(.is-personal-home) > .dashflow-hero {
  height: var(--df-page-hero-height)!important;
  min-height: var(--df-page-hero-height)!important;
  margin-bottom: 10px!important;
  padding: var(--df-space-4) 20px!important;
  border-radius: var(--df-radius-md)!important;
}

.dashflow-command-shell:not(.is-personal-home):has(.dashflow-command-button[data-section="inbox"].is-active) {
  --df-page-hero-height: 72px;
}

.dashflow-command-shell:not(.is-personal-home) > .dashflow-hero::after {
  font-size: 18px!important;
  line-height: 1.1!important;
  letter-spacing: -.015em!important;
}

/* The runtime no longer mutates Hero buttons just to add styling hooks. */
.dashflow-home-hero-actions > button:nth-child(1) {
  min-width: 92px;
}

.dashflow-home-hero-actions > button:nth-child(2) {
  min-width: 86px;
}

/* Readability floor: dense metadata can be quiet without becoming tiny. */
.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-ring span,
.dashflow-command-shell:not(.is-personal-home) .dashflow-project-stat span,
.dashflow-command-shell:not(.is-personal-home) .dashflow-command-page-head small {
  font-size: var(--df-font-xs)!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-widget-body,
.dashflow-command-shell:not(.is-personal-home) .dashflow-command-page {
  font-size: var(--df-font-sm)!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-widget-header strong,
.dashflow-command-shell:not(.is-personal-home) .dashflow-project-name {
  font-size: var(--df-font-md)!important;
}

/* v0.4.6 — Daily Progress becomes a first-class Home signal without changing
 * its Markdown storage model. */
.dashflow-home-status-metrics {
  grid-template-columns: repeat(4, minmax(0, 1fr))!important;
}

.dashflow-home-daily-progress-list {
  display: flex;
  flex-direction: column;
  padding: 5px 10px 9px;
}

.dashflow-home-daily-progress-row {
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr) 30px;
  align-items: center;
  gap: 8px;
  min-height: 42px;
  padding: 4px 3px;
  border-bottom: 1px solid var(--df-home-border);
}

.dashflow-home-daily-progress-row:last-child {
  border-bottom: 0;
}

.dashflow-home-daily-progress-row > input {
  margin: 0;
  accent-color: var(--df-home-accent);
}

.dashflow-home-daily-progress-main,
.dashflow-home-daily-progress-note {
  appearance: none;
  border: 0!important;
  background: transparent!important;
  box-shadow: none!important;
  color: var(--df-home-text)!important;
}

.dashflow-home-daily-progress-main {
  min-width: 0;
  padding: 3px 0!important;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  text-align: left;
  cursor: pointer;
}

.dashflow-home-daily-progress-main strong {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--df-font-sm);
  font-weight: 700;
}

.dashflow-home-daily-progress-main small {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--df-home-muted);
  font-size: var(--df-font-xs);
}

.dashflow-home-daily-progress-row.is-done .dashflow-home-daily-progress-main strong {
  color: var(--df-home-muted);
}

.dashflow-home-daily-progress-note {
  width: 28px;
  height: 28px;
  padding: 0!important;
  display: grid;
  place-items: center;
  border-radius: var(--df-radius-sm)!important;
  color: var(--df-home-muted)!important;
  cursor: pointer;
}

.dashflow-home-daily-progress-note:hover,
.dashflow-home-daily-progress-note.has-note {
  color: var(--df-home-accent)!important;
  background: var(--df-home-accent-soft)!important;
}

.dashflow-home-daily-progress-note svg {
  width: 14px;
  height: 14px;
}

.dashflow-home-daily-progress-more {
  padding: 7px 3px 1px;
  color: var(--df-home-muted);
  font-size: var(--df-font-xs);
}

@media (max-width: 760px) {
  .dashflow-command-shell:not(.is-personal-home) > .dashflow-hero {
    height: 72px!important;
    min-height: 72px!important;
    padding: 14px var(--df-space-4)!important;
  }

  .dashflow-command-shell:not(.is-personal-home) > .dashflow-hero::after {
    font-size: 17px!important;
  }

  .dashflow-home-status-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr))!important;
  }
}
`;

const CONSOLIDATED_STYLES = [
  VISUAL_CONTINUITY_STYLES,
  UI_REFINEMENT_POLISH_STYLES,
  DESIGN_SYSTEM_STYLES,
  INTERACTION_MOTION_STYLES,
].join("\n\n");

export class DesignSystemService {
  start(): void {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CONSOLIDATED_STYLES;
    document.head.appendChild(style);
  }

  stop(): void {
    document.getElementById(STYLE_ID)?.remove();
  }
}

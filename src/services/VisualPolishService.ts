const STYLE_ID = "dashflow-visual-polish-v2";

export const VISUAL_POLISH_STYLES = `
.dashflow-view-container {
  --df-v2-canvas: color-mix(in srgb, var(--background-primary) 96%, var(--background-secondary));
  --df-v2-card: color-mix(in srgb, var(--background-primary) 97%, var(--background-secondary));
  --df-v2-inner: color-mix(in srgb, var(--background-secondary) 58%, var(--background-primary));
  --df-v2-inner-strong: color-mix(in srgb, var(--background-secondary) 76%, var(--background-primary));
  --df-v2-text-secondary: color-mix(in srgb, var(--text-muted) 78%, var(--text-normal));
  --df-v2-text-faint: color-mix(in srgb, var(--text-muted) 88%, var(--text-normal));
  --df-v2-line: color-mix(in srgb, var(--background-modifier-border) 74%, var(--text-muted));
  --df-v2-glow: color-mix(in srgb, var(--df-accent) 14%, transparent);
  background:
    radial-gradient(720px 390px at 8% -7%, color-mix(in srgb, var(--df-accent) 14%, transparent), transparent 72%),
    radial-gradient(600px 330px at 92% 0%, color-mix(in srgb, var(--df-purple) 7%, transparent), transparent 74%),
    linear-gradient(180deg, color-mix(in srgb, var(--background-secondary) 32%, transparent), transparent 270px),
    var(--df-v2-canvas) !important;
}

.theme-dark .dashflow-view-container {
  --df-v2-canvas: color-mix(in srgb, var(--background-primary) 93%, var(--background-secondary));
  --df-v2-card: color-mix(in srgb, var(--background-primary) 88%, var(--background-secondary));
  --df-v2-inner: color-mix(in srgb, var(--background-secondary) 74%, var(--background-primary));
  --df-v2-inner-strong: color-mix(in srgb, var(--background-secondary) 86%, var(--background-primary));
  --df-v2-text-secondary: color-mix(in srgb, var(--text-muted) 68%, var(--text-normal));
  --df-v2-text-faint: color-mix(in srgb, var(--text-muted) 78%, var(--text-normal));
  --df-v2-line: color-mix(in srgb, var(--background-modifier-border) 68%, var(--text-muted));
}

.dashflow-shell {
  width: min(1500px, calc(100% - 42px)) !important;
  padding: 30px 0 96px !important;
}

.dashflow-hero {
  gap: 20px !important;
  padding: 0 4px 18px !important;
}

.dashflow-eyebrow,
.dashflow-widget-kicker,
.dashflow-pulse-label,
.dashflow-section-title > span {
  color: var(--df-v2-text-secondary) !important;
}

.dashflow-eyebrow::before {
  width: 22px !important;
  height: 3px !important;
  background: linear-gradient(90deg, var(--df-accent), color-mix(in srgb, var(--df-accent) 30%, var(--df-info))) !important;
  box-shadow: 0 0 18px color-mix(in srgb, var(--df-accent) 30%, transparent) !important;
}

.dashflow-hero h1 {
  position: relative;
  width: fit-content;
  margin: 8px 0 6px !important;
  color: var(--text-normal) !important;
  font-size: clamp(34px, 4.2vw, 46px) !important;
  font-weight: 735 !important;
  letter-spacing: -.05em !important;
  text-shadow: 0 12px 32px color-mix(in srgb, var(--df-accent) 8%, transparent);
}

.dashflow-hero h1::after {
  content: "";
  position: absolute;
  left: 2px;
  bottom: -8px;
  width: min(76px, 42%);
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, color-mix(in srgb, var(--df-accent) 78%, var(--text-normal)), transparent);
  opacity: .72;
}

.dashflow-hero p {
  max-width: 620px !important;
  color: var(--df-v2-text-secondary) !important;
  font-size: 12px !important;
}

.dashflow-shell .dashflow-dashboard-switcher {
  gap: 7px;
  margin-bottom: 20px;
}

.dashflow-shell .dashflow-dashboard-switcher select,
.dashflow-shell .dashflow-dashboard-switcher button,
.dashflow-edit-button,
.dashflow-edit-bar button,
.dashflow-capture button,
.dashflow-calendar-nav button,
.dashflow-calendar-today,
.dashflow-calendar-add {
  box-shadow: none !important;
}

.dashflow-shell .dashflow-dashboard-switcher select,
.dashflow-shell .dashflow-dashboard-switcher button {
  background: color-mix(in srgb, var(--df-v2-card) 78%, transparent) !important;
  border-color: var(--df-v2-line) !important;
  backdrop-filter: blur(14px) saturate(1.06);
}

.dashflow-pulse {
  min-height: 44px !important;
  margin-bottom: 28px !important;
  border-color: var(--df-v2-line) !important;
  background: color-mix(in srgb, var(--df-v2-card) 76%, transparent) !important;
  box-shadow: 0 10px 32px color-mix(in srgb, var(--text-normal) 5%, transparent);
  backdrop-filter: blur(18px) saturate(1.08);
}

.dashflow-pulse > span {
  color: var(--df-v2-text-secondary) !important;
}

.dashflow-pulse > span + span {
  border-left-color: color-mix(in srgb, var(--df-v2-line) 68%, transparent) !important;
}

.dashflow-section-title {
  padding-bottom: 10px !important;
}

.dashflow-section-title small {
  color: var(--df-v2-text-faint) !important;
}

.dashflow-widget {
  isolation: isolate;
  border-color: var(--df-v2-line) !important;
  border-radius: 16px !important;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--df-widget-tone) 2.8%, transparent), transparent 72px),
    var(--df-v2-card) !important;
  box-shadow:
    0 1px 0 color-mix(in srgb, white 34%, transparent) inset,
    0 12px 34px color-mix(in srgb, var(--text-normal) 5.5%, transparent) !important;
}

.theme-dark .dashflow-widget {
  box-shadow:
    0 1px 0 color-mix(in srgb, white 7%, transparent) inset,
    0 14px 38px rgba(0, 0, 0, .22) !important;
}

.dashflow-widget::before {
  content: "";
  position: absolute;
  z-index: 2;
  top: 0;
  left: 18px;
  right: 18px;
  height: 1px;
  pointer-events: none;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--df-widget-tone) 34%, transparent), transparent);
}

.dashflow-grid:not(.is-editing) .dashflow-widget:hover {
  transform: translateY(-2px) !important;
  border-color: color-mix(in srgb, var(--df-widget-tone) 34%, var(--df-v2-line)) !important;
  box-shadow:
    0 1px 0 color-mix(in srgb, white 38%, transparent) inset,
    0 18px 46px color-mix(in srgb, var(--text-normal) 8%, transparent),
    0 0 0 1px color-mix(in srgb, var(--df-widget-tone) 5%, transparent) !important;
}

.theme-dark .dashflow-grid:not(.is-editing) .dashflow-widget:hover {
  box-shadow:
    0 1px 0 color-mix(in srgb, white 8%, transparent) inset,
    0 20px 52px rgba(0, 0, 0, .3),
    0 0 26px color-mix(in srgb, var(--df-widget-tone) 7%, transparent) !important;
}

.dashflow-widget-header {
  height: 45px !important;
  padding: 0 14px !important;
  border-bottom-color: color-mix(in srgb, var(--df-v2-line) 62%, transparent) !important;
  background: linear-gradient(180deg, color-mix(in srgb, var(--df-widget-tone) 5%, var(--df-v2-card)), color-mix(in srgb, var(--df-v2-card) 91%, transparent)) !important;
}

.dashflow-widget-header strong {
  font-size: 12.5px !important;
  font-weight: 670 !important;
  letter-spacing: -.01em;
}

.dashflow-widget-icon {
  width: 24px !important;
  height: 24px !important;
  flex-basis: 24px !important;
  border-radius: 8px !important;
  background: color-mix(in srgb, var(--df-widget-tone) 11%, var(--df-v2-inner)) !important;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--df-widget-tone) 9%, transparent);
}

.dashflow-widget-body {
  height: calc(100% - 46px) !important;
  padding: 15px !important;
}

.dashflow-empty {
  width: min(100%, 440px);
  height: auto !important;
  min-height: 74px !important;
  margin: auto;
  padding: 15px 18px !important;
  color: var(--df-v2-text-faint) !important;
  border: 1px dashed color-mix(in srgb, var(--df-v2-line) 72%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, var(--df-v2-inner) 56%, transparent);
}

.dashflow-widget-kicker span,
.dashflow-progress-meta,
.dashflow-project-stat span,
.dashflow-capture-footer span,
.dashflow-stat span,
.dashflow-heatmap-stat span,
.dashflow-heatmap-range,
.dashflow-heatmap-footer,
.dashflow-calendar-weekday,
.dashflow-calendar-more,
.dashflow-calendar-agenda-date span,
.dashflow-calendar-event-kind {
  color: var(--df-v2-text-faint) !important;
}

.dashflow-task {
  border-bottom-color: color-mix(in srgb, var(--df-v2-line) 42%, transparent) !important;
}

.dashflow-task:hover {
  background: color-mix(in srgb, var(--df-accent) 5%, var(--df-v2-inner)) !important;
}

.dashflow-capture textarea {
  border-radius: 11px !important;
}

.dashflow-capture textarea:hover,
.dashflow-capture textarea:focus {
  background: color-mix(in srgb, var(--df-cyan) 4%, var(--df-v2-inner)) !important;
}

.dashflow-progress-ring {
  filter: drop-shadow(0 9px 20px color-mix(in srgb, var(--df-accent) 17%, transparent)) !important;
}

.dashflow-progress-ring::after {
  background: var(--df-v2-card) !important;
}

.dashflow-project-row {
  appearance: none !important;
  border: 0 !important;
  border-bottom: 1px solid color-mix(in srgb, var(--df-v2-line) 52%, transparent) !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  padding: 10px 4px !important;
}

.dashflow-project-row:hover {
  background: color-mix(in srgb, var(--df-info) 5%, var(--df-v2-inner)) !important;
}

.dashflow-project-bar {
  background: color-mix(in srgb, var(--df-info) 12%, var(--df-v2-inner-strong)) !important;
}

.dashflow-countdown > strong {
  color: var(--text-normal);
  background: linear-gradient(155deg, var(--text-normal) 28%, color-mix(in srgb, var(--df-warning) 76%, var(--text-normal)) 86%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: none !important;
  filter: drop-shadow(0 10px 18px color-mix(in srgb, var(--df-warning) 10%, transparent));
}

.dashflow-edit-bar {
  border-color: var(--df-v2-line) !important;
  background: color-mix(in srgb, var(--df-v2-card) 80%, transparent) !important;
  box-shadow: 0 18px 48px color-mix(in srgb, var(--text-normal) 12%, transparent) !important;
  backdrop-filter: blur(22px) saturate(1.12) !important;
}

/* Heatmap: make the data itself the visual focus. */
.dashflow-heatmap {
  gap: 12px !important;
}

.dashflow-heatmap-summary {
  padding: 1px 2px 5px !important;
}

.dashflow-heatmap-summary-main {
  gap: 22px !important;
}

.dashflow-heatmap-stat strong {
  font-size: 19px !important;
}

.dashflow-heatmap-scroll {
  padding: 4px 2px 7px !important;
}

.dashflow-heatmap-grid {
  grid-template-rows: repeat(7, 12px) !important;
  grid-auto-columns: 12px !important;
  gap: 4px !important;
}

.dashflow-heatmap-cell {
  width: 12px !important;
  height: 12px !important;
  border-radius: 3.5px !important;
  outline: 0 !important;
}

.dashflow-heatmap-cell[data-level="0"] {
  background: color-mix(in srgb, var(--df-v2-inner-strong) 76%, var(--df-v2-card)) !important;
}

.dashflow-heatmap-cell[data-level="1"] { background: color-mix(in srgb, var(--df-accent) 20%, var(--df-v2-card)) !important; }
.dashflow-heatmap-cell[data-level="2"] { background: color-mix(in srgb, var(--df-accent) 39%, var(--df-v2-card)) !important; }
.dashflow-heatmap-cell[data-level="3"] { background: color-mix(in srgb, var(--df-accent) 66%, var(--df-v2-card)) !important; }
.dashflow-heatmap-cell[data-level="4"] {
  background: var(--df-accent) !important;
  box-shadow: 0 0 12px color-mix(in srgb, var(--df-accent) 16%, transparent);
}

/* Habit: quieter rows, stronger completion signal. */
.dashflow-habit-row {
  background: color-mix(in srgb, var(--df-v2-inner) 74%, transparent) !important;
  border-color: color-mix(in srgb, var(--df-v2-line) 60%, transparent) !important;
  box-shadow: inset 2px 0 0 color-mix(in srgb, var(--df-success) 36%, transparent) !important;
}

.dashflow-habit-row:hover {
  background: color-mix(in srgb, var(--df-success) 5%, var(--df-v2-inner)) !important;
}

/* Weekly review: nested content should not look like cards inside cards. */
.dashflow-weekly-kpi {
  background: color-mix(in srgb, var(--df-v2-inner) 78%, transparent) !important;
  border-color: color-mix(in srgb, var(--df-v2-line) 62%, transparent) !important;
  box-shadow: none !important;
  border-radius: 11px !important;
}

.dashflow-weekly-row {
  appearance: none !important;
  background: transparent !important;
  border: 0 !important;
  border-bottom: 1px solid color-mix(in srgb, var(--df-v2-line) 46%, transparent) !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}

.dashflow-weekly-row:hover {
  background: color-mix(in srgb, var(--df-purple) 5%, var(--df-v2-inner)) !important;
}

/* Calendar: flatter cells + a stronger agenda surface. */
.dashflow-calendar {
  gap: 16px !important;
}

.dashflow-calendar-toolbar {
  margin-bottom: 2px;
}

.dashflow-calendar-weekdays,
.dashflow-calendar-grid {
  gap: 5px !important;
}

.dashflow-calendar-weekday {
  font-size: 8.5px !important;
  font-weight: 650;
}

.dashflow-calendar-day {
  min-height: 44px !important;
  border: 1px solid transparent !important;
  border-radius: 9px !important;
  background: color-mix(in srgb, var(--df-v2-inner) 72%, transparent) !important;
  box-shadow: none !important;
}

.dashflow-calendar-day:hover {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--df-info) 18%, var(--df-v2-line)) !important;
  background: color-mix(in srgb, var(--df-info) 7%, var(--df-v2-inner)) !important;
}

.dashflow-calendar-day.is-outside {
  opacity: .48 !important;
  background: color-mix(in srgb, var(--df-v2-inner) 46%, transparent) !important;
}

.dashflow-calendar-day.is-selected {
  border-color: color-mix(in srgb, var(--df-accent) 48%, var(--df-v2-line)) !important;
  background: color-mix(in srgb, var(--df-accent) 8%, var(--df-v2-inner)) !important;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--df-accent) 26%, transparent), 0 5px 16px color-mix(in srgb, var(--df-accent) 7%, transparent) !important;
}

.dashflow-calendar-day.is-today .dashflow-calendar-day-number {
  box-shadow: 0 4px 12px color-mix(in srgb, var(--df-accent) 20%, transparent);
}

.dashflow-calendar-agenda {
  border: 0 !important;
  border-radius: 13px;
  padding: 13px !important;
  background: color-mix(in srgb, var(--df-v2-inner) 72%, transparent);
}

.dashflow-calendar-event {
  border-color: color-mix(in srgb, var(--df-v2-line) 56%, transparent) !important;
  background: color-mix(in srgb, var(--df-v2-card) 72%, transparent) !important;
  box-shadow: none !important;
}

.dashflow-calendar-event-main {
  box-shadow: none !important;
}

@media (max-width: 900px) {
  .dashflow-shell {
    width: min(100% - 20px, 760px) !important;
    padding-top: 22px !important;
  }

  .dashflow-hero {
    padding-bottom: 16px !important;
  }

  .dashflow-hero h1 {
    font-size: 36px !important;
  }

  .dashflow-widget {
    border-radius: 14px !important;
  }

  .dashflow-calendar-agenda {
    border-top: 0 !important;
    margin-top: 4px;
  }
}

@media (max-width: 520px) {
  .dashflow-shell {
    width: calc(100% - 14px) !important;
  }

  .dashflow-hero h1 {
    font-size: 32px !important;
  }

  .dashflow-pulse {
    margin-bottom: 22px !important;
  }

  .dashflow-heatmap-grid {
    grid-template-rows: repeat(7, 10px) !important;
    grid-auto-columns: 10px !important;
    gap: 3px !important;
  }

  .dashflow-heatmap-cell {
    width: 10px !important;
    height: 10px !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dashflow-calendar-day:hover,
  .dashflow-grid:not(.is-editing) .dashflow-widget:hover {
    transform: none !important;
  }
}
`;

export class VisualPolishService {
  start(): void {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = VISUAL_POLISH_STYLES;
    document.head.appendChild(style);
  }

  stop(): void {
    document.getElementById(STYLE_ID)?.remove();
  }
}

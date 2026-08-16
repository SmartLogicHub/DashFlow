const STYLE_ID = "dashflow-product-visual-reset-v041";

export const PRODUCT_STYLES = `
.dashflow-view-container {
  --df-cmd-bg: color-mix(in srgb, var(--background-primary) 97%, #f8fafc);
  --df-cmd-surface: var(--background-primary);
  --df-cmd-soft: color-mix(in srgb, var(--background-secondary) 70%, var(--background-primary));
  --df-cmd-border: color-mix(in srgb, var(--background-modifier-border) 78%, transparent);
  --df-cmd-border-strong: color-mix(in srgb, var(--background-modifier-border) 56%, var(--text-muted));
  --df-cmd-text: var(--text-normal);
  --df-cmd-muted: var(--text-muted);
  --df-cmd-faint: var(--text-faint);
  --df-cmd-purple: #6366f1;
  --df-cmd-rose: #e11d48;
  --df-cmd-amber: #d97706;
  --df-cmd-green: #16a34a;
  --df-cmd-cyan: #0284c7;
  background: var(--df-cmd-bg)!important;
  color: var(--df-cmd-text);
}
.theme-dark .dashflow-view-container {
  --df-cmd-bg: color-mix(in srgb, var(--background-primary) 97%, #090d12);
  --df-cmd-surface: var(--background-primary);
  --df-cmd-soft: color-mix(in srgb, var(--background-secondary) 75%, var(--background-primary));
  --df-cmd-border: rgba(255, 255, 255, 0.08);
  --df-cmd-border-strong: rgba(255, 255, 255, 0.16);
}
.dashflow-product-hidden { display: none!important; }
.dashflow-command-shell { width: min(1160px, calc(100% - 28px))!important; margin: 0 auto!important; padding: 12px 0 80px!important; display: block!important; color: var(--df-cmd-text); }
.dashflow-command-shell > .dashflow-product-nav, .dashflow-command-shell > .dashflow-studio-stage { display: none!important; }

/* Work is an execution surface, not a second landing page. */
.dashflow-command-shell:not(.is-personal-home)>.dashflow-hero,
.dashflow-command-shell:not(.is-personal-home)>.dashflow-pulse,
.dashflow-command-shell:not(.is-personal-home)>.dashflow-section-title { display: none!important; }

/* Unified Command Bar: Consistent across all tabs, no layout shifting. */
.dashflow-command-bar {
  min-height: 42px; margin: 0 0 12px; padding: 5px 6px; display: flex; align-items: center; gap: 6px; overflow-x: auto; scrollbar-width: none; border: 1px solid var(--df-cmd-border); border-radius: 10px; background: color-mix(in srgb, var(--df-cmd-surface) 96%, transparent); box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}
.dashflow-command-bar::before { content: "DashFlow"; flex: 0 0 auto; padding: 0 9px 0 6px; color: var(--df-cmd-text); font-size: 12.5px; font-weight: 750; letter-spacing: -0.01em; }
.dashflow-command-nav, .dashflow-command-actions { display: flex; align-items: center; gap: 3px; flex: 0 0 auto; }
.dashflow-command-nav { padding-right: 6px; border-right: 1px solid var(--df-cmd-border); }
.dashflow-command-actions { margin-left: auto; }
.dashflow-command-workspace { min-width: 0; }
.dashflow-command-button {
  position: relative; height: 30px; display: inline-flex; align-items: center; gap: 5px; padding: 0 10px; border: 1px solid transparent!important; border-radius: 7px!important; color: var(--df-cmd-muted)!important; background: transparent!important; box-shadow: none!important; font-size: 11.5px; font-weight: 600; white-space: nowrap; cursor: pointer; transition: color 150ms ease, background 150ms ease, border-color 150ms ease, transform 120ms ease;
}
.dashflow-command-button:hover { color: var(--df-cmd-text)!important; background: var(--df-cmd-soft)!important; }
.dashflow-command-button.is-active { color: var(--df-cmd-text)!important; border-color: var(--df-cmd-border)!important; background: var(--df-cmd-surface)!important; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03)!important; }
.dashflow-command-button.is-secondary-action { color: var(--df-cmd-muted)!important; }
.dashflow-command-button.is-icon-action { width: 30px; padding: 0; justify-content: center; }
.dashflow-command-button.is-icon-action .dashflow-command-label { display: none; }
.dashflow-command-icon { width: 14px; height: 14px; display: grid; place-items: center; }
.dashflow-command-icon svg { width: 13.5px; height: 13.5px; }
.dashflow-command-badge { min-width: 16px; height: 16px; display: grid; place-items: center; margin-left: -1px; padding: 0 4px; border-radius: 99px; color: white; background: var(--df-cmd-rose); font-size: 9.5px; font-weight: 700; font-variant-numeric: tabular-nums; }

.dashflow-command-workspace .dashflow-dashboard-switcher { min-height: 0!important; height: 30px; margin: 0!important; display: flex!important; gap: 2px!important; }
.dashflow-command-workspace .dashflow-dashboard-switcher select,
.dashflow-command-workspace .dashflow-dashboard-switcher button { height: 30px!important; min-height: 30px!important; border: 1px solid transparent!important; border-radius: 6px!important; color: var(--df-cmd-muted)!important; background: transparent!important; box-shadow: none!important; font-size: 11px!important; }
.dashflow-command-workspace .dashflow-dashboard-switcher select { width: 92px; min-width: 76px!important; max-width: 110px!important; padding: 0 6px; }
.dashflow-command-workspace .dashflow-dashboard-switcher button { min-width: 28px!important; width: 28px; padding: 0!important; }
.dashflow-command-workspace .dashflow-dashboard-count { display: none!important; }

/* Readable work grid: subtle borders, balanced typography, elegant bento cards. */
.dashflow-command-shell .dashflow-grid { display: grid; align-items: stretch; position: relative; animation: dfFadeIn 160ms cubic-bezier(0.16, 1, 0.3, 1); }
.dashflow-command-shell .dashflow-widget { overflow: hidden; border: 1px solid var(--df-cmd-border)!important; border-radius: 12px!important; background: var(--df-cmd-surface)!important; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02)!important; transform: none!important; transition: border-color 150ms ease, box-shadow 150ms ease!important; }
.dashflow-command-shell .dashflow-grid:not(.is-editing) .dashflow-widget:hover { border-color: var(--df-cmd-border-strong)!important; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04)!important; }
.dashflow-command-shell .dashflow-grid.is-editing .dashflow-widget { border-style: dashed!important; border-color: color-mix(in srgb, var(--df-cmd-purple) 56%, var(--df-cmd-border))!important; }
.dashflow-command-shell .dashflow-widget-header { height: 38px!important; padding: 0 13px!important; border-bottom: 1px solid var(--df-cmd-border)!important; background: transparent!important; }
.dashflow-command-shell .dashflow-widget-header > div:first-child { gap: 8px!important; }
.dashflow-command-shell .dashflow-widget-header strong { color: var(--df-cmd-text)!important; font-size: 12.5px!important; font-weight: 700!important; }
.dashflow-command-shell .dashflow-widget-icon { width: 22px!important; height: 22px!important; border-radius: 6px!important; background: var(--df-cmd-soft)!important; color: var(--df-cmd-text)!important; box-shadow: none!important; }
.dashflow-command-shell .dashflow-widget-icon svg { width: 13px!important; height: 13px!important; }
.dashflow-command-shell .dashflow-widget-body { color: var(--df-cmd-text); font-size: 11.5px; }
.dashflow-command-shell .dashflow-kicker { color: var(--df-cmd-muted)!important; font-size: 10px!important; font-weight: 600!important; letter-spacing: 0.05em!important; }
.dashflow-command-shell .dashflow-empty { min-height: 68px!important; color: var(--df-cmd-faint)!important; font-size: 11px!important; }

/* Task rows: clean line items with subtle hover. */
.dashflow-command-shell .dashflow-task { min-height: 36px!important; padding: 6px 8px!important; border: 0!important; border-bottom: 1px solid color-mix(in srgb, var(--df-cmd-border) 65%, transparent)!important; border-radius: 0!important; background: transparent!important; box-shadow: none!important; transition: background 120ms ease; }
.dashflow-command-shell .dashflow-task:last-child { border-bottom: 0!important; }
.dashflow-command-shell .dashflow-task:hover { background: var(--df-cmd-soft)!important; }
.dashflow-command-shell .dashflow-task > span:not(.dashflow-task-priority) { color: var(--df-cmd-text)!important; font-size: 12px!important; line-height: 1.4; }
.dashflow-command-shell .dashflow-task time { color: var(--df-cmd-muted)!important; font-size: 10px!important; font-variant-numeric: tabular-nums; }
.dashflow-task-priority { margin-left: auto; padding: 2px 7px; border-radius: 99px; font-size: 9.5px; font-weight: 600; white-space: nowrap; }
.dashflow-task-priority.is-urgent { color: #b91c1c; background: color-mix(in srgb, #ef4444 12%, transparent); }
.dashflow-task-priority.is-high { color: #b45309; background: color-mix(in srgb, #f59e0b 14%, transparent); }
.dashflow-task-priority.is-low { color: var(--df-cmd-muted); background: var(--df-cmd-soft); }

/* Quick Capture: modern utility input. */
.dashflow-command-shell .dashflow-capture textarea, .dashflow-command-shell .dashflow-capture input { font-size: 12px!important; }
.dashflow-command-shell .dashflow-capture button { height: 29px!important; border-radius: 6px!important; box-shadow: none!important; font-size: 11px!important; font-weight: 600; }

/* Progress pair: clean and balanced dual rings. */
.dashflow-progress-wrap { height: 100%; display: grid; place-items: center; padding: 12px; }
.dashflow-progress-pair { width: 100%; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.dashflow-progress-metric { min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.dashflow-progress-ring { width: 68px!important; height: 68px!important; position: relative; display: grid; place-items: center; border-radius: 50%; background: conic-gradient(var(--df-cmd-text) var(--dashflow-progress), var(--df-cmd-soft) 0)!important; box-shadow: none!important; }
.dashflow-progress-ring::before { content: ""; position: absolute; inset: 5px; border-radius: 50%; background: var(--df-cmd-surface); }
.dashflow-progress-ring > div { position: relative; z-index: 1; display: grid; justify-items: center; }
.dashflow-progress-ring strong { font-size: 15px!important; line-height: 1!important; font-variant-numeric: tabular-nums; }
.dashflow-progress-ring span { margin-top: 3px; color: var(--df-cmd-muted)!important; font-size: 9.5px!important; font-weight: 650; letter-spacing: 0.06em; }
.dashflow-progress-caption { color: var(--df-cmd-muted); font-size: 10.5px; font-variant-numeric: tabular-nums; text-align: center; }

/* Projects: structured rows with clear status and progress steps. */
.dashflow-command-shell .dashflow-project-list { padding: 4px 12px 10px!important; }
.dashflow-command-shell .dashflow-project-row { min-height: 46px!important; padding: 7px 4px!important; display: grid!important; grid-template-columns: minmax(0, 1fr) minmax(130px, 200px) auto; align-items: center; gap: 14px; border: 0!important; border-bottom: 1px solid color-mix(in srgb, var(--df-cmd-border) 65%, transparent)!important; border-radius: 0!important; background: transparent!important; box-shadow: none!important; cursor: pointer; transition: background 120ms ease; }
.dashflow-command-shell .dashflow-project-row:last-child { border-bottom: 0!important; }
.dashflow-command-shell .dashflow-project-row:hover { background: color-mix(in srgb, var(--df-cmd-soft) 72%, transparent)!important; border-radius: 6px; }
.dashflow-command-shell .dashflow-project-row strong { color: var(--df-cmd-text)!important; font-size: 12px!important; font-weight: 650!important; }
.dashflow-command-shell .dashflow-project-row small, .dashflow-command-shell .dashflow-project-stat { color: var(--df-cmd-muted)!important; font-size: 10px!important; font-variant-numeric: tabular-nums; }
.dashflow-project-steps { display: grid; grid-template-columns: repeat(5, 1fr); align-items: center; position: relative; }
.dashflow-project-steps::before { content: ""; position: absolute; left: 4px; right: 4px; height: 2px; background: var(--df-cmd-soft); }
.dashflow-project-step { width: 7px; height: 7px; z-index: 1; justify-self: center; border-radius: 50%; background: var(--df-cmd-soft); }
.dashflow-project-step.is-active { background: var(--df-cmd-text); }

/* Heatmap and Countdown. */
.dashflow-command-shell .dashflow-heatmap-grid { gap: 3px!important; }
.dashflow-command-shell .dashflow-heatmap-cell { border-radius: 2px!important; box-shadow: none!important; }
.dashflow-command-shell .dashflow-countdown-value { color: var(--df-cmd-text)!important; font-variant-numeric: tabular-nums; text-shadow: none!important; }

/* Sub-pages: Inbox, Projects, Calendar, Habits, Review. */
.dashflow-command-page { min-height: 360px; padding: 18px; border: 1px solid var(--df-cmd-border); border-radius: 12px; background: var(--df-cmd-surface); box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02); animation: dfFadeIn 160ms cubic-bezier(0.16, 1, 0.3, 1); }
.dashflow-command-page-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; padding-bottom: 13px; border-bottom: 1px solid var(--df-cmd-border); }
.dashflow-command-page-head small { display: block; margin-bottom: 3px; color: var(--df-cmd-faint); font-size: 10px; font-weight: 600; letter-spacing: 0.08em; }
.dashflow-command-page-head h2 { margin: 0; color: var(--df-cmd-text); font-size: 18px; font-weight: 700; }
.dashflow-command-page-head button { height: 29px; padding: 0 11px; border: 1px solid var(--df-cmd-border); border-radius: 6px; color: var(--df-cmd-muted); background: transparent; font-size: 11px; font-weight: 600; cursor: pointer; transition: background 150ms ease, color 150ms ease; }
.dashflow-command-page-head button:hover { background: var(--df-cmd-soft); color: var(--df-cmd-text); }
.dashflow-command-inbox-composer { height: 40px; margin: 13px 0 10px; padding: 0 11px; display: grid; grid-template-columns: 16px minmax(0, 1fr) auto; align-items: center; gap: 9px; border: 1px solid var(--df-cmd-border); border-radius: 7px; background: var(--df-cmd-soft); }
.dashflow-command-inbox-composer > span:first-child { width: 14px; height: 14px; color: var(--df-cmd-muted); display: grid; place-items: center; }
.dashflow-command-inbox-composer input { width: 100%; border: 0!important; background: transparent!important; box-shadow: none!important; font-size: 12px; }
.dashflow-command-inbox-composer > span:last-child { color: var(--df-cmd-faint); font-size: 9.5px; font-weight: 600; }
.dashflow-command-inbox-list { display: flex; flex-direction: column; }
.dashflow-command-inbox-row { min-height: 38px; display: grid; grid-template-columns: 16px minmax(0, 1fr) 16px; gap: 9px; align-items: center; border-bottom: 1px solid color-mix(in srgb, var(--df-cmd-border) 65%, transparent); }
.dashflow-command-inbox-row > button { min-width: 0; padding: 5px 0; border: 0; background: transparent; text-align: left; cursor: pointer; }
.dashflow-command-inbox-row > button strong { display: block; overflow: hidden; color: var(--df-cmd-text); font-size: 12px; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
.dashflow-command-inbox-row > button small { display: block; margin-top: 2px; color: var(--df-cmd-faint); font-size: 10.5px; }
.dashflow-command-empty { min-height: 120px; display: grid; place-items: center; align-content: center; text-align: center; color: var(--df-cmd-faint); }
.dashflow-command-empty > span { width: 22px; height: 22px; margin-bottom: 8px; }
.dashflow-command-empty strong { color: var(--df-cmd-text); font-size: 12.5px; font-weight: 650; }
.dashflow-command-empty p { max-width: 340px; margin: 4px 0 0; font-size: 11px; line-height: 1.5; }

/* Habit / calendar / review sub-views: clean containers. */
.dashflow-command-shell .dashflow-habit-row,
.dashflow-command-shell .dashflow-calendar-day,
.dashflow-command-shell .dashflow-weekly-project-row { border-radius: 6px!important; box-shadow: none!important; }
.dashflow-command-shell .dashflow-calendar-day { border-color: var(--df-cmd-border)!important; }
.dashflow-command-shell .dashflow-calendar-day.is-selected { border-color: var(--df-cmd-purple)!important; background: color-mix(in srgb, var(--df-cmd-purple) 7%, var(--df-cmd-surface))!important; }
.dashflow-command-shell .dashflow-weekly-project-row { border: 0!important; border-bottom: 1px solid color-mix(in srgb, var(--df-cmd-border) 65%, transparent)!important; background: transparent!important; }
.dashflow-command-shell .dashflow-stats-grid { height: 100%; display: grid; grid-template-columns: repeat(4, 1fr); }
.dashflow-command-shell .dashflow-stat { border-right: 1px solid var(--df-cmd-border); background: transparent!important; }
.dashflow-command-shell .dashflow-stat:last-child { border-right: 0; }
.dashflow-command-shell .dashflow-stat strong { color: var(--df-cmd-text)!important; font-size: 20px!important; font-weight: 700!important; font-variant-numeric: tabular-nums; }
.dashflow-command-shell .dashflow-stat span { color: var(--df-cmd-muted)!important; font-size: 10px!important; font-weight: 600; letter-spacing: 0.05em; }

/* Floating Layout Edit Bar. */
.dashflow-command-shell .dashflow-resize-handle { border-radius: 50%!important; }
.dashflow-command-shell .dashflow-edit-bar { position: fixed!important; left: 50%; bottom: 22px; z-index: 120; transform: translateX(-50%); min-height: 42px; padding: 5px 8px!important; display: flex; align-items: center; gap: 6px; border: 1px solid var(--df-cmd-border)!important; border-radius: 999px!important; background: color-mix(in srgb, var(--df-cmd-surface) 96%, transparent)!important; box-shadow: 0 8px 24px rgba(28, 30, 42, 0.10)!important; backdrop-filter: blur(16px); }
.dashflow-command-shell .dashflow-edit-bar select, .dashflow-command-shell .dashflow-edit-bar button { height: 30px!important; border-radius: 999px!important; font-size: 10.5px!important; font-weight: 600; }
.dashflow-command-shell .dashflow-edit-bar > span { color: var(--df-cmd-faint)!important; font-size: 9.5px!important; }

@keyframes dfFadeIn {
  from { opacity: 0; transform: translateY(2px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 980px) {
  .dashflow-command-shell { width: min(100% - 18px, 1160px)!important; }
  .dashflow-command-actions .is-secondary-action { display: none; }
  .dashflow-command-workspace { display: none; }
  .dashflow-command-shell .dashflow-project-row { grid-template-columns: minmax(0, 1fr) 120px auto; }
}
@media (max-width: 760px) {
  .dashflow-command-shell { width: calc(100% - 14px)!important; padding-top: 8px!important; }
  .dashflow-command-bar::before { display: none; }
  .dashflow-command-bar { gap: 3px; }
  .dashflow-command-actions { margin-left: 0; }
  .dashflow-command-button { padding: 0 7px; }
  .dashflow-command-actions .dashflow-command-button:not(.is-icon-action):not(:first-child) { display: none; }
  .dashflow-command-shell .dashflow-grid[data-product-section] { display: block!important; }
  .dashflow-command-shell .dashflow-grid[data-product-section] > .dashflow-widget { display: block!important; margin-bottom: 8px; min-height: 160px; }
  .dashflow-command-shell .dashflow-project-row { grid-template-columns: minmax(0, 1fr) auto; }
  .dashflow-project-steps { display: none; }
  .dashflow-command-page { min-height: 300px; }
}
@media (max-width: 480px) {
  .dashflow-command-nav .dashflow-command-label { display: none; }
  .dashflow-command-nav .dashflow-command-button { width: 30px; padding: 0; justify-content: center; }
  .dashflow-command-shell .dashflow-progress-ring { width: 62px!important; height: 62px!important; }
}
@media (prefers-reduced-motion: reduce) {
  .dashflow-command-shell *, .dashflow-command-bar * { transition: none!important; animation: none!important; scroll-behavior: auto!important; }
}
`;

export class ProductDesignService {
  start(): void {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = PRODUCT_STYLES;
    document.head.appendChild(style);
  }

  stop(): void {
    document.getElementById(STYLE_ID)?.remove();
  }
}

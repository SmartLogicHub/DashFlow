const STYLE_ID = "dashflow-product-visual-reset-v041";

export const PRODUCT_STYLES = `
.dashflow-view-container {
  --df-cmd-bg:color-mix(in srgb,var(--background-primary) 97%,#f2f5f4);
  --df-cmd-surface:var(--background-primary);
  --df-cmd-soft:color-mix(in srgb,var(--background-secondary) 74%,var(--background-primary));
  --df-cmd-border:color-mix(in srgb,var(--background-modifier-border) 78%,transparent);
  --df-cmd-border-strong:color-mix(in srgb,var(--background-modifier-border) 58%,var(--text-muted));
  --df-cmd-text:var(--text-normal);
  --df-cmd-muted:var(--text-muted);
  --df-cmd-faint:var(--text-faint);
  --df-cmd-purple:#6557c8;
  --df-cmd-rose:#c75c6a;
  --df-cmd-amber:#b98534;
  --df-cmd-green:#64935b;
  --df-cmd-cyan:#4c91a8;
  background:var(--df-cmd-bg)!important;
  color:var(--df-cmd-text);
}
.theme-dark .dashflow-view-container {
  --df-cmd-bg:color-mix(in srgb,var(--background-primary) 97%,#0f1215);
  --df-cmd-surface:var(--background-primary);
  --df-cmd-soft:color-mix(in srgb,var(--background-secondary) 78%,var(--background-primary));
  --df-cmd-border:rgba(255,255,255,.075);
  --df-cmd-border-strong:rgba(255,255,255,.15);
}
.dashflow-product-hidden { display:none!important; }
.dashflow-command-shell { width:min(1160px,calc(100% - 28px))!important; margin:0 auto!important; padding:12px 0 80px!important; display:block!important; color:var(--df-cmd-text); }
.dashflow-command-shell>.dashflow-product-nav,.dashflow-command-shell>.dashflow-studio-stage { display:none!important; }

/* Work is an execution surface, not a second landing page. */
.dashflow-command-shell:not(.is-personal-home)>.dashflow-hero,
.dashflow-command-shell:not(.is-personal-home)>.dashflow-pulse,
.dashflow-command-shell:not(.is-personal-home)>.dashflow-section-title { display:none!important; }

.dashflow-command-bar {
  min-height:42px; margin:0 0 12px; padding:5px 6px; display:flex; align-items:center; gap:6px; overflow-x:auto; scrollbar-width:none; border:1px solid var(--df-cmd-border); border-radius:10px; background:color-mix(in srgb,var(--df-cmd-surface) 96%,transparent); box-shadow:none;
}
.dashflow-command-shell:not(.is-personal-home) .dashflow-command-bar::before { content:"DashFlow"; flex:0 0 auto; padding:0 9px 0 5px; color:var(--df-cmd-text); font-size:12px; font-weight:720; letter-spacing:-.01em; }
.dashflow-command-nav,.dashflow-command-actions { display:flex; align-items:center; gap:2px; flex:0 0 auto; }
.dashflow-command-nav { padding-right:5px; border-right:1px solid var(--df-cmd-border); }
.dashflow-command-actions { margin-left:auto; }
.dashflow-command-workspace { min-width:0; }
.dashflow-command-button {
  position:relative; height:30px; display:inline-flex; align-items:center; gap:5px; padding:0 9px; border:1px solid transparent!important; border-radius:7px!important; color:var(--df-cmd-muted)!important; background:transparent!important; box-shadow:none!important; font-size:11px; font-weight:580; white-space:nowrap; cursor:pointer;
}
.dashflow-command-button:hover { color:var(--df-cmd-text)!important; background:var(--df-cmd-soft)!important; }
.dashflow-command-button.is-active { color:var(--df-cmd-text)!important; border-color:var(--df-cmd-border)!important; background:var(--df-cmd-surface)!important; }
.dashflow-command-button.is-secondary-action { color:var(--df-cmd-muted)!important; }
.dashflow-command-button.is-icon-action { width:30px; padding:0; justify-content:center; }
.dashflow-command-button.is-icon-action .dashflow-command-label { display:none; }
.dashflow-command-icon { width:14px; height:14px; display:grid; place-items:center; }
.dashflow-command-icon svg { width:13px; height:13px; }
.dashflow-command-badge { min-width:15px; height:15px; display:grid; place-items:center; margin-left:-1px; padding:0 3px; border-radius:99px; color:white; background:var(--df-cmd-rose); font-size:8px; }

.dashflow-command-workspace .dashflow-dashboard-switcher { min-height:0!important; height:30px; margin:0!important; display:flex!important; gap:2px!important; }
.dashflow-command-workspace .dashflow-dashboard-switcher select,
.dashflow-command-workspace .dashflow-dashboard-switcher button { height:30px!important; min-height:30px!important; border:1px solid transparent!important; border-radius:6px!important; color:var(--df-cmd-muted)!important; background:transparent!important; box-shadow:none!important; font-size:10px!important; }
.dashflow-command-workspace .dashflow-dashboard-switcher select { width:88px; min-width:72px!important; max-width:104px!important; padding:0 5px; }
.dashflow-command-workspace .dashflow-dashboard-switcher button { min-width:28px!important; width:28px; padding:0!important; }
.dashflow-command-workspace .dashflow-dashboard-count { display:none!important; }

/* Readable work grid: fewer visual boxes, normal typography, quieter chrome. */
.dashflow-command-shell .dashflow-grid { display:grid; align-items:stretch; position:relative; }
.dashflow-command-shell .dashflow-widget { overflow:hidden; border:1px solid var(--df-cmd-border)!important; border-radius:11px!important; background:var(--df-cmd-surface)!important; box-shadow:none!important; transform:none!important; transition:border-color .12s ease,background .12s ease!important; }
.dashflow-command-shell .dashflow-grid:not(.is-editing) .dashflow-widget:hover { border-color:var(--df-cmd-border-strong)!important; box-shadow:none!important; transform:none!important; }
.dashflow-command-shell .dashflow-grid.is-editing .dashflow-widget { border-style:dashed!important; border-color:color-mix(in srgb,var(--df-cmd-purple) 56%,var(--df-cmd-border))!important; }
.dashflow-command-shell .dashflow-widget-header { height:39px!important; padding:0 12px!important; border-bottom:1px solid var(--df-cmd-border)!important; background:transparent!important; }
.dashflow-command-shell .dashflow-widget-header>div:first-child { gap:7px!important; }
.dashflow-command-shell .dashflow-widget-header strong { color:var(--df-cmd-text)!important; font-size:12px!important; font-weight:700!important; }
.dashflow-command-shell .dashflow-widget-icon { width:22px!important; height:22px!important; border-radius:7px!important; box-shadow:none!important; }
.dashflow-command-shell .dashflow-widget-icon svg { width:12px!important; height:12px!important; }
.dashflow-command-shell .dashflow-widget-body { color:var(--df-cmd-text); font-size:11px; }
.dashflow-command-shell .dashflow-kicker { color:var(--df-cmd-muted)!important; font-size:9px!important; letter-spacing:.05em!important; }
.dashflow-command-shell .dashflow-empty { min-height:74px!important; color:var(--df-cmd-faint)!important; font-size:10px!important; }

/* Task rows are the primary interaction; remove form-like/card-like treatment. */
.dashflow-command-shell .dashflow-task { min-height:36px!important; padding:6px 8px!important; border:0!important; border-bottom:1px solid var(--df-cmd-border)!important; border-radius:0!important; background:transparent!important; box-shadow:none!important; }
.dashflow-command-shell .dashflow-task:last-child { border-bottom:0!important; }
.dashflow-command-shell .dashflow-task:hover { background:var(--df-cmd-soft)!important; }
.dashflow-command-shell .dashflow-task>span:not(.dashflow-task-priority) { color:var(--df-cmd-text)!important; font-size:11px!important; line-height:1.4; }
.dashflow-command-shell .dashflow-task time { color:var(--df-cmd-muted)!important; font-size:9px!important; }
.dashflow-task-priority { margin-left:auto; padding:2px 6px; border-radius:99px; font-size:8px; white-space:nowrap; }
.dashflow-task-priority.is-urgent { color:#a74655; background:color-mix(in srgb,#d55c6e 13%,transparent); }
.dashflow-task-priority.is-high { color:#946b24; background:color-mix(in srgb,#d9a43c 14%,transparent); }
.dashflow-task-priority.is-low { color:var(--df-cmd-muted); background:var(--df-cmd-soft); }

/* Capture is a compact input utility, not a feature card. */
.dashflow-command-shell .dashflow-capture textarea,.dashflow-command-shell .dashflow-capture input { font-size:11px!important; }
.dashflow-command-shell .dashflow-capture button { height:29px!important; border-radius:6px!important; box-shadow:none!important; font-size:10px!important; }

/* Progress pair: small, factual, no giant dashboard gauges. */
.dashflow-progress-wrap { height:100%; display:grid; place-items:center; padding:12px; }
.dashflow-progress-pair { width:100%; display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
.dashflow-progress-metric { min-width:0; display:flex; flex-direction:column; align-items:center; gap:8px; }
.dashflow-progress-ring { width:72px!important; height:72px!important; position:relative; display:grid; place-items:center; border-radius:50%; background:conic-gradient(var(--df-cmd-text) var(--dashflow-progress),var(--df-cmd-soft) 0)!important; box-shadow:none!important; }
.dashflow-progress-ring::before { content:""; position:absolute; inset:6px; border-radius:50%; background:var(--df-cmd-surface); }
.dashflow-progress-ring>div { position:relative; z-index:1; display:grid; justify-items:center; }
.dashflow-progress-ring strong { font-size:16px!important; line-height:1!important; }
.dashflow-progress-ring span { margin-top:3px; color:var(--df-cmd-muted)!important; font-size:7px!important; letter-spacing:.05em; }
.dashflow-progress-caption { color:var(--df-cmd-muted); font-size:9px; text-align:center; }

/* Projects are rows with content hierarchy, never rounded input controls. */
.dashflow-command-shell .dashflow-project-list { padding:4px 12px 10px!important; }
.dashflow-command-shell .dashflow-project-row { min-height:48px!important; padding:7px 2px!important; display:grid!important; grid-template-columns:minmax(0,1fr) minmax(140px,230px) auto; align-items:center; gap:14px; border:0!important; border-bottom:1px solid var(--df-cmd-border)!important; border-radius:0!important; background:transparent!important; box-shadow:none!important; }
.dashflow-command-shell .dashflow-project-row:last-child { border-bottom:0!important; }
.dashflow-command-shell .dashflow-project-row:hover { background:color-mix(in srgb,var(--df-cmd-soft) 68%,transparent)!important; }
.dashflow-command-shell .dashflow-project-row strong { color:var(--df-cmd-text)!important; font-size:11px!important; font-weight:630!important; }
.dashflow-command-shell .dashflow-project-row small,.dashflow-command-shell .dashflow-project-stat { color:var(--df-cmd-muted)!important; font-size:8.5px!important; }
.dashflow-project-steps { display:grid; grid-template-columns:repeat(5,1fr); align-items:center; position:relative; }
.dashflow-project-steps::before { content:""; position:absolute; left:4px; right:4px; height:2px; background:var(--df-cmd-soft); }
.dashflow-project-step { width:7px; height:7px; z-index:1; justify-self:center; border-radius:50%; background:var(--df-cmd-soft); }
.dashflow-project-step.is-active { background:var(--df-cmd-text); }

/* Heatmap and countdown are content, not giant framed posters. */
.dashflow-command-shell .dashflow-heatmap-grid { gap:3px!important; }
.dashflow-command-shell .dashflow-heatmap-cell { border-radius:2px!important; box-shadow:none!important; }
.dashflow-command-shell .dashflow-countdown-value { color:var(--df-cmd-text)!important; text-shadow:none!important; }

/* Synthetic Inbox and section pages keep the same visual language. */
.dashflow-command-page { min-height:360px; padding:16px; border:1px solid var(--df-cmd-border); border-radius:11px; background:var(--df-cmd-surface); box-shadow:none; }
.dashflow-command-page-head { display:flex; align-items:flex-end; justify-content:space-between; gap:16px; padding-bottom:12px; border-bottom:1px solid var(--df-cmd-border); }
.dashflow-command-page-head small { display:block; margin-bottom:4px; color:var(--df-cmd-faint); font-size:9px; letter-spacing:.08em; }
.dashflow-command-page-head h2 { margin:0; color:var(--df-cmd-text); font-size:20px; }
.dashflow-command-page-head button { height:30px; border:1px solid var(--df-cmd-border); border-radius:6px; color:var(--df-cmd-muted); background:transparent; font-size:10px; }
.dashflow-command-inbox-composer { height:40px; margin:12px 0 10px; padding:0 10px; display:grid; grid-template-columns:16px minmax(0,1fr) auto; align-items:center; gap:8px; border:1px solid var(--df-cmd-border); border-radius:7px; background:var(--df-cmd-soft); }
.dashflow-command-inbox-composer>span:first-child { width:14px; height:14px; color:var(--df-cmd-muted); }
.dashflow-command-inbox-composer input { width:100%; border:0!important; background:transparent!important; box-shadow:none!important; font-size:11px; }
.dashflow-command-inbox-composer>span:last-child { color:var(--df-cmd-faint); font-size:8px; }
.dashflow-command-inbox-list { display:flex; flex-direction:column; }
.dashflow-command-inbox-row { min-height:40px; display:grid; grid-template-columns:16px minmax(0,1fr) 16px; gap:8px; align-items:center; border-bottom:1px solid var(--df-cmd-border); }
.dashflow-command-inbox-row>button { min-width:0; padding:5px 0; border:0; background:transparent; text-align:left; cursor:pointer; }
.dashflow-command-inbox-row>button strong { display:block; overflow:hidden; color:var(--df-cmd-text); font-size:11px; text-overflow:ellipsis; white-space:nowrap; }
.dashflow-command-inbox-row>button small { display:block; margin-top:3px; color:var(--df-cmd-faint); font-size:9px; }
.dashflow-command-empty { min-height:150px; display:grid; place-items:center; align-content:center; text-align:center; color:var(--df-cmd-faint); }
.dashflow-command-empty>span { width:22px; height:22px; margin-bottom:8px; }
.dashflow-command-empty strong { color:var(--df-cmd-text); font-size:12px; }
.dashflow-command-empty p { max-width:340px; margin:5px 0 0; font-size:10px; line-height:1.5; }

/* Habit / calendar / review pages: flatten nested cards and keep text readable. */
.dashflow-command-shell .dashflow-habit-row,
.dashflow-command-shell .dashflow-calendar-day,
.dashflow-command-shell .dashflow-weekly-project-row { border-radius:6px!important; box-shadow:none!important; }
.dashflow-command-shell .dashflow-calendar-day { border-color:var(--df-cmd-border)!important; }
.dashflow-command-shell .dashflow-calendar-day.is-selected { border-color:var(--df-cmd-purple)!important; background:color-mix(in srgb,var(--df-cmd-purple) 7%,var(--df-cmd-surface))!important; }
.dashflow-command-shell .dashflow-weekly-project-row { border:0!important; border-bottom:1px solid var(--df-cmd-border)!important; background:transparent!important; }
.dashflow-command-shell .dashflow-stats-grid { height:100%; display:grid; grid-template-columns:repeat(4,1fr); }
.dashflow-command-shell .dashflow-stat { border-right:1px solid var(--df-cmd-border); background:transparent!important; }
.dashflow-command-shell .dashflow-stat:last-child { border-right:0; }
.dashflow-command-shell .dashflow-stat strong { color:var(--df-cmd-text)!important; font-size:20px!important; }
.dashflow-command-shell .dashflow-stat span { color:var(--df-cmd-muted)!important; font-size:9px!important; }

/* Edit mode stays available but visually separate from normal work. */
.dashflow-command-shell .dashflow-resize-handle { border-radius:50%!important; }
.dashflow-command-shell .dashflow-edit-bar { position:fixed!important; left:50%; bottom:22px; z-index:120; transform:translateX(-50%); min-height:42px; padding:5px 7px!important; display:flex; align-items:center; gap:5px; border:1px solid var(--df-cmd-border)!important; border-radius:999px!important; background:color-mix(in srgb,var(--df-cmd-surface) 96%,transparent)!important; box-shadow:0 10px 28px rgba(28,30,42,.12)!important; backdrop-filter:blur(16px); }
.dashflow-command-shell .dashflow-edit-bar select,.dashflow-command-shell .dashflow-edit-bar button { height:30px!important; border-radius:999px!important; font-size:9px!important; }
.dashflow-command-shell .dashflow-edit-bar>span { color:var(--df-cmd-faint)!important; font-size:8px!important; }

@media (max-width:980px) {
  .dashflow-command-shell { width:min(100% - 18px,1160px)!important; }
  .dashflow-command-actions .is-secondary-action { display:none; }
  .dashflow-command-workspace { display:none; }
  .dashflow-command-shell .dashflow-project-row { grid-template-columns:minmax(0,1fr) 120px auto; }
}
@media (max-width:760px) {
  .dashflow-command-shell { width:calc(100% - 14px)!important; padding-top:8px!important; }
  .dashflow-command-bar::before { display:none; }
  .dashflow-command-bar { gap:2px; }
  .dashflow-command-actions { margin-left:0; }
  .dashflow-command-button { padding:0 6px; }
  .dashflow-command-actions .dashflow-command-button:not(.is-icon-action):not(:first-child) { display:none; }
  .dashflow-command-shell .dashflow-grid[data-product-section] { display:block!important; }
  .dashflow-command-shell .dashflow-grid[data-product-section]>.dashflow-widget { display:block!important; margin-bottom:8px; min-height:160px; }
  .dashflow-command-shell .dashflow-project-row { grid-template-columns:minmax(0,1fr) auto; }
  .dashflow-project-steps { display:none; }
  .dashflow-command-page { min-height:320px; }
}
@media (max-width:480px) {
  .dashflow-command-nav .dashflow-command-label { display:none; }
  .dashflow-command-nav .dashflow-command-button { width:30px; padding:0; justify-content:center; }
  .dashflow-command-shell .dashflow-progress-ring { width:62px!important; height:62px!important; }
}
@media (prefers-reduced-motion:reduce) {
  .dashflow-command-shell *,.dashflow-command-bar * { transition:none!important; scroll-behavior:auto!important; }
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

const STYLE_ID = "dashflow-command-dashboard-v032";

export const PRODUCT_STYLES = `
.dashflow-view-container {
  --df-cmd-bg: color-mix(in srgb, var(--background-primary) 97%, #f6f5fb);
  --df-cmd-surface: color-mix(in srgb, var(--background-primary) 98%, #ffffff);
  --df-cmd-soft: color-mix(in srgb, var(--background-secondary) 72%, var(--background-primary));
  --df-cmd-border: color-mix(in srgb, var(--background-modifier-border) 88%, transparent);
  --df-cmd-border-strong: color-mix(in srgb, var(--background-modifier-border) 72%, var(--text-muted));
  --df-cmd-text: var(--text-normal);
  --df-cmd-muted: var(--text-muted);
  --df-cmd-faint: var(--text-faint);
  --df-cmd-purple: #6f52ff;
  --df-cmd-purple-2: #8d67ff;
  --df-cmd-rose: #dd6576;
  --df-cmd-amber: #d6a33b;
  --df-cmd-green: #77a24f;
  --df-cmd-cyan: #55a8bf;
  --df-cmd-shadow: 0 4px 18px rgba(29, 31, 43, .045);
  background: var(--df-cmd-bg) !important;
  color: var(--df-cmd-text);
}

.theme-dark .dashflow-view-container {
  --df-cmd-bg: color-mix(in srgb, var(--background-primary) 96%, #101017);
  --df-cmd-surface: color-mix(in srgb, var(--background-primary) 90%, var(--background-secondary));
  --df-cmd-soft: color-mix(in srgb, var(--background-secondary) 82%, var(--background-primary));
  --df-cmd-border: rgba(255,255,255,.075);
  --df-cmd-border-strong: rgba(255,255,255,.14);
  --df-cmd-shadow: 0 5px 22px rgba(0,0,0,.16);
}

.dashflow-product-hidden { display: none !important; }

/* Obsidian owns the app chrome. DashFlow only owns the center canvas. */
.dashflow-command-shell {
  width: min(1180px, calc(100% - 28px)) !important;
  margin: 0 auto !important;
  padding: 16px 0 96px !important;
  display: block !important;
  color: var(--df-cmd-text);
}

.dashflow-command-shell > .dashflow-product-nav,
.dashflow-command-shell > .dashflow-studio-stage { display: none !important; }

/* Reference-style purple command banner. */
.dashflow-command-shell .dashflow-hero {
  position: relative;
  isolation: isolate;
  height: 132px;
  min-height: 132px !important;
  margin: 0 0 9px !important;
  padding: 0 24px !important;
  display: grid !important;
  place-items: center;
  overflow: hidden;
  border: 1px solid rgba(117, 96, 196, .35) !important;
  border-radius: 10px !important;
  color: white !important;
  background:
    radial-gradient(68% 180% at 0% 40%, rgba(86, 40, 205, .92), transparent 58%),
    radial-gradient(70% 180% at 100% 54%, rgba(107, 66, 230, .78), transparent 58%),
    radial-gradient(46% 140% at 50% 116%, rgba(91, 58, 202, .44), transparent 68%),
    linear-gradient(118deg, #20104e 0%, #05060a 38%, #030306 66%, #251252 100%) !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.10), 0 7px 22px rgba(44, 24, 101, .13) !important;
}

.dashflow-command-shell .dashflow-hero::before {
  content: "";
  position: absolute;
  inset: -40% -20%;
  z-index: -1;
  opacity: .46;
  background:
    linear-gradient(102deg, transparent 28%, rgba(121,88,255,.16) 41%, transparent 48%),
    linear-gradient(74deg, transparent 48%, rgba(94,68,220,.14) 57%, transparent 64%);
  transform: skewX(-12deg);
  pointer-events: none;
}

.dashflow-command-shell .dashflow-hero > div:first-child {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.dashflow-command-shell .dashflow-eyebrow {
  order: 3;
  margin-top: 7px !important;
  color: rgba(255,255,255,.32) !important;
  font-family: var(--font-monospace);
  font-size: 7px !important;
  font-weight: 600 !important;
  letter-spacing: .24em !important;
}
.dashflow-command-shell .dashflow-eyebrow::before { display: none !important; }

.dashflow-command-shell .dashflow-hero h1 {
  order: 1;
  margin: 0 !important;
  color: #fff !important;
  font-family: var(--font-interface);
  font-size: clamp(22px, 3.4vw, 32px) !important;
  line-height: 1.05 !important;
  font-weight: 430 !important;
  letter-spacing: .16em !important;
  text-transform: none;
  -webkit-text-fill-color: currentColor !important;
  background: none !important;
  text-shadow: 0 2px 22px rgba(0,0,0,.34) !important;
}

.dashflow-command-shell .dashflow-hero p {
  order: 2;
  margin: 10px 0 0 !important;
  color: rgba(255,255,255,.48) !important;
  font-family: var(--font-monospace);
  font-size: 6.5px !important;
  font-weight: 600;
  line-height: 1 !important;
  letter-spacing: .25em;
  text-transform: uppercase;
}

/* Pulse strip: narrow, data-dense, almost terminal-like. */
.dashflow-command-shell .dashflow-pulse {
  min-height: 31px !important;
  height: 31px;
  margin: 0 0 13px !important;
  display: flex !important;
  align-items: center;
  overflow-x: auto;
  border: 1px solid var(--df-cmd-border) !important;
  border-radius: 3px !important;
  background: color-mix(in srgb, var(--df-cmd-soft) 68%, transparent) !important;
  box-shadow: none !important;
}
.dashflow-command-shell .dashflow-pulse > span {
  height: 100%;
  display: inline-flex;
  align-items: center;
  padding: 0 11px !important;
  border: 0 !important;
  color: var(--df-cmd-muted) !important;
  font-family: var(--font-monospace);
  font-size: 8px !important;
  letter-spacing: .07em !important;
}
.dashflow-command-shell .dashflow-pulse > span + span::before {
  content: "·";
  margin-right: 11px;
  color: var(--df-cmd-faint);
}
.dashflow-command-shell .dashflow-pulse strong {
  margin-right: 5px !important;
  color: var(--df-cmd-text) !important;
  font-size: 9px !important;
  font-weight: 720;
}
.dashflow-command-shell .dashflow-pulse-label {
  color: var(--df-cmd-text) !important;
  font-weight: 700 !important;
  letter-spacing: .13em !important;
}
.dashflow-command-shell .dashflow-pulse-label::before { content: "[ "; }
.dashflow-command-shell .dashflow-pulse-label::after { content: " ]"; }

/* Dashboard identity and time. */
.dashflow-command-shell .dashflow-section-title {
  min-height: 78px;
  padding: 0 2px 9px !important;
  display: flex !important;
  align-items: flex-end !important;
  justify-content: space-between !important;
  gap: 18px;
}
.dashflow-command-title-copy { display: flex; flex-direction: column; min-width: 0; }
.dashflow-command-eyebrow {
  margin-bottom: 4px;
  color: var(--df-cmd-text);
  font-family: var(--font-monospace);
  font-size: 7px;
  font-weight: 700;
  letter-spacing: .22em;
}
.dashflow-command-title {
  color: var(--df-cmd-text);
  font-size: clamp(24px, 3.3vw, 34px);
  line-height: .98;
  font-weight: 780;
  letter-spacing: -.035em;
}
.dashflow-command-meta {
  margin-top: 7px;
  color: var(--df-cmd-faint);
  font-family: var(--font-monospace);
  font-size: 7.5px;
  letter-spacing: .06em;
}
.dashflow-command-title-right { display: flex; align-items: flex-end; gap: 8px; }
.dashflow-command-date { display: flex; flex-direction: column; align-items: flex-end; padding-bottom: 1px; }
.dashflow-command-date strong { color: var(--df-cmd-text); font-family: var(--font-monospace); font-size: 10px; font-weight: 650; font-variant-numeric: tabular-nums; }
.dashflow-command-date small { margin-top: 4px; color: var(--df-cmd-muted); font-size: 8px; }
.dashflow-command-layout-button {
  height: 28px !important;
  min-width: 42px;
  padding: 0 9px !important;
  border: 1px solid var(--df-cmd-border) !important;
  border-radius: 4px !important;
  color: var(--df-cmd-muted) !important;
  background: var(--df-cmd-surface) !important;
  box-shadow: none !important;
  font-size: 8px !important;
}

/* Horizontal command strip; no second app sidebar. */
.dashflow-command-bar {
  min-height: 35px;
  margin-bottom: 10px;
  padding: 3px 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
  border: 1px solid var(--df-cmd-border);
  border-radius: 4px;
  background: color-mix(in srgb, var(--df-cmd-surface) 92%, transparent);
}
.dashflow-command-nav,.dashflow-command-actions { display: flex; align-items: center; gap: 2px; flex: 0 0 auto; }
.dashflow-command-nav { padding-right: 5px; border-right: 1px solid var(--df-cmd-border); }
.dashflow-command-actions { margin-left: auto; }
.dashflow-command-workspace { min-width: 0; }
.dashflow-command-button {
  position: relative;
  height: 27px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0 8px;
  border: 1px solid transparent !important;
  border-radius: 3px !important;
  color: var(--df-cmd-muted) !important;
  background: transparent !important;
  box-shadow: none !important;
  font-size: 8.5px;
  font-weight: 580;
  white-space: nowrap;
  cursor: pointer;
}
.dashflow-command-button:hover { color: var(--df-cmd-text) !important; background: var(--df-cmd-soft) !important; }
.dashflow-command-button.is-active { color: var(--df-cmd-text) !important; border-color: var(--df-cmd-border) !important; background: var(--df-cmd-surface) !important; }
.dashflow-command-button.is-secondary-action { color: var(--df-cmd-faint) !important; }
.dashflow-command-button.is-icon-action { width: 27px; padding: 0; justify-content: center; }
.dashflow-command-button.is-icon-action .dashflow-command-label { display: none; }
.dashflow-command-icon { width: 13px; height: 13px; display: grid; place-items: center; }
.dashflow-command-icon svg { width: 12px; height: 12px; }
.dashflow-command-badge {
  min-width: 13px;
  height: 13px;
  display: grid;
  place-items: center;
  margin-left: -1px;
  padding: 0 3px;
  border-radius: 99px;
  color: white;
  background: var(--df-cmd-rose);
  font-size: 7px;
  font-variant-numeric: tabular-nums;
}

/* The multi-dashboard switcher becomes a small part of the top toolbar. */
.dashflow-command-workspace .dashflow-dashboard-switcher {
  min-height: 0 !important;
  height: 27px;
  margin: 0 !important;
  display: flex !important;
  gap: 2px !important;
}
.dashflow-command-workspace .dashflow-dashboard-switcher select,
.dashflow-command-workspace .dashflow-dashboard-switcher button {
  height: 27px !important;
  min-height: 27px !important;
  border: 1px solid transparent !important;
  border-radius: 3px !important;
  color: var(--df-cmd-muted) !important;
  background: transparent !important;
  box-shadow: none !important;
  font-size: 8px !important;
}
.dashflow-command-workspace .dashflow-dashboard-switcher select { width: 88px; min-width: 70px !important; max-width: 100px !important; padding: 0 5px; }
.dashflow-command-workspace .dashflow-dashboard-switcher button { min-width: 25px !important; width: 25px; padding: 0 !important; }
.dashflow-command-workspace .dashflow-dashboard-count { display: none !important; }

/* Dense dashboard grid. */
.dashflow-command-shell .dashflow-grid {
  display: grid;
  align-items: stretch;
  position: relative;
}
.dashflow-command-shell .dashflow-widget {
  overflow: hidden;
  border: 1px solid var(--df-cmd-border) !important;
  border-radius: 7px !important;
  background: var(--df-cmd-surface) !important;
  box-shadow: var(--df-cmd-shadow) !important;
  transform: none !important;
  transition: border-color .12s ease, box-shadow .12s ease, background .12s ease !important;
}
.dashflow-command-shell .dashflow-grid:not(.is-editing) .dashflow-widget:hover {
  border-color: var(--df-cmd-border-strong) !important;
  box-shadow: 0 7px 20px rgba(29,31,43,.07) !important;
  transform: none !important;
}
.dashflow-command-shell .dashflow-grid.is-editing .dashflow-widget {
  border-style: dashed !important;
  border-color: color-mix(in srgb, var(--df-cmd-purple) 52%, var(--df-cmd-border)) !important;
}

.dashflow-command-shell .dashflow-widget-header {
  height: 34px !important;
  padding: 0 10px !important;
  border-bottom: 1px solid var(--df-cmd-border) !important;
  background: transparent !important;
}
.dashflow-command-shell .dashflow-widget-header > div:first-child { gap: 7px !important; }
.dashflow-command-shell .dashflow-widget-header strong {
  color: var(--df-cmd-text);
  font-size: 9.5px !important;
  font-weight: 700 !important;
}
.dashflow-command-shell .dashflow-widget-icon {
  width: 14px !important;
  height: 14px !important;
  flex-basis: 14px !important;
  border-radius: 2px !important;
  color: var(--df-cmd-text) !important;
  background: transparent !important;
  font-size: 8px !important;
}
.dashflow-command-shell .dashflow-widget-controls { gap: 1px; }
.dashflow-command-shell .dashflow-widget-controls button {
  width: 23px !important;
  height: 23px !important;
  border-radius: 3px !important;
  color: var(--df-cmd-faint) !important;
  font-size: 12px !important;
}
.dashflow-command-shell .dashflow-widget-body {
  height: calc(100% - 35px) !important;
  padding: 10px !important;
  overflow: auto;
}
.dashflow-command-shell .dashflow-empty {
  min-height: 0 !important;
  color: var(--df-cmd-faint) !important;
  font-size: 8.5px !important;
  line-height: 1.5 !important;
}
.dashflow-command-shell .dashflow-empty code { display: none !important; }
.dashflow-command-shell .dashflow-widget-kicker {
  margin-bottom: 6px !important;
  color: var(--df-cmd-muted) !important;
  font-family: var(--font-monospace);
  font-size: 7px !important;
  letter-spacing: .08em !important;
}

/* Quick capture = a light note pad with one strong action. */
.dashflow-command-shell .dashflow-capture { height: 100%; display: flex; flex-direction: column; }
.dashflow-command-shell .dashflow-capture textarea {
  flex: 1;
  width: 100%;
  min-height: 0 !important;
  padding: 8px 6px !important;
  resize: none;
  border: 0 !important;
  border-radius: 0 !important;
  color: var(--df-cmd-text) !important;
  background: transparent !important;
  box-shadow: none !important;
  font-size: 9px !important;
  line-height: 1.55;
}
.dashflow-command-shell .dashflow-capture textarea::placeholder { color: var(--df-cmd-faint); }
.dashflow-command-shell .dashflow-capture-footer {
  padding-top: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--df-cmd-border);
}
.dashflow-command-shell .dashflow-capture-footer > span { color: var(--df-cmd-faint); font-family: var(--font-monospace); font-size: 7px; }
.dashflow-command-shell .dashflow-capture button {
  height: 25px !important;
  padding: 0 10px !important;
  border: 0 !important;
  border-radius: 3px !important;
  color: #fff !important;
  background: #111216 !important;
  box-shadow: none !important;
  font-size: 8px !important;
}
.theme-dark .dashflow-command-shell .dashflow-capture button { color: #101116 !important; background: #f0f0f2 !important; }

/* Task lists: compact rows with priority/date badges. */
.dashflow-command-shell .dashflow-task-list { display: flex; flex-direction: column; gap: 2px !important; }
.dashflow-command-shell .dashflow-task {
  min-height: 25px !important;
  padding: 3px 4px !important;
  gap: 7px !important;
  border-radius: 3px !important;
  color: var(--df-cmd-text);
  font-size: 8.5px !important;
}
.dashflow-command-shell .dashflow-task:hover { background: var(--df-cmd-soft); }
.dashflow-command-shell .dashflow-task input { width: 12px; height: 12px; margin: 0; }
.dashflow-command-shell .dashflow-task > span:not(.dashflow-task-priority) { min-width: 0; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dashflow-command-shell .dashflow-task time {
  margin-left: auto;
  padding: 2px 5px;
  border-radius: 3px;
  color: var(--df-cmd-muted);
  background: var(--df-cmd-soft);
  font-family: var(--font-monospace);
  font-size: 7px !important;
}
.dashflow-task-priority { margin-left: auto; padding: 2px 5px; border-radius: 3px; font-size: 7px; white-space: nowrap; }
.dashflow-task-priority.is-urgent { color: #a9424f; background: color-mix(in srgb, var(--df-cmd-rose) 18%, transparent); }
.dashflow-task-priority.is-high { color: #9b7123; background: color-mix(in srgb, var(--df-cmd-amber) 18%, transparent); }
.dashflow-task-priority.is-low { color: var(--df-cmd-muted); background: var(--df-cmd-soft); }

/* Dual progress rings echo the reference dashboard without fake data. */
.dashflow-progress-wrap { height: 100%; display: flex !important; align-items: center; justify-content: center; }
.dashflow-progress-pair { width: 100%; display: grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap: 8px; align-items:center; }
.dashflow-progress-metric { display: grid; justify-items: center; gap: 5px; }
.dashflow-command-shell .dashflow-progress-ring {
  width: 68px !important;
  height: 68px !important;
  background: conic-gradient(#111216 var(--dashflow-progress), color-mix(in srgb, var(--df-cmd-border) 78%, transparent) 0) !important;
}
.theme-dark .dashflow-command-shell .dashflow-progress-ring { background: conic-gradient(#f1f1f2 var(--dashflow-progress), color-mix(in srgb, var(--df-cmd-border) 82%, transparent) 0) !important; }
.dashflow-command-shell .dashflow-progress-ring::before { inset: 5px !important; background: var(--df-cmd-surface) !important; }
.dashflow-command-shell .dashflow-progress-ring strong { font-size: 13px !important; }
.dashflow-command-shell .dashflow-progress-ring span { color: var(--df-cmd-faint) !important; font-size: 6.5px !important; letter-spacing: .08em; }
.dashflow-progress-caption { color: var(--df-cmd-muted); font-size: 7px; text-align:center; }
.dashflow-command-shell .dashflow-progress-meta { display: none !important; }

/* Project portfolio rows: simple, dense, with a five-step visual progress rail. */
.dashflow-command-shell .dashflow-project-list { display: flex; flex-direction: column; gap: 2px !important; }
.dashflow-command-shell .dashflow-project-row {
  min-height: 48px !important;
  padding: 6px 5px !important;
  display: grid !important;
  grid-template-columns:minmax(0,1fr) minmax(150px, 34%) auto;
  gap: 12px !important;
  align-items: center;
  border: 0 !important;
  border-bottom: 1px solid var(--df-cmd-border) !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  text-align: left;
}
.dashflow-command-shell .dashflow-project-row:last-child { border-bottom: 0 !important; }
.dashflow-command-shell .dashflow-project-row:hover { background: var(--df-cmd-soft) !important; }
.dashflow-command-shell .dashflow-project-main { min-width: 0; }
.dashflow-command-shell .dashflow-project-name { margin-bottom: 3px; color: var(--df-cmd-text); font-size: 9px !important; font-weight: 650; }
.dashflow-command-shell .dashflow-project-bar { display: none !important; }
.dashflow-project-steps { min-width: 0; display: grid; grid-template-columns:repeat(5,1fr); align-items:center; gap:0; }
.dashflow-project-step { position:relative; height:12px; }
.dashflow-project-step::before { content:""; position:absolute; left:50%; top:50%; width:6px; height:6px; border-radius:50%; transform:translate(-50%,-50%); background:var(--df-cmd-border-strong); z-index:2; }
.dashflow-project-step::after { content:""; position:absolute; left:50%; right:-50%; top:50%; height:1px; transform:translateY(-50%); background:var(--df-cmd-border); }
.dashflow-project-step:last-child::after { display:none; }
.dashflow-project-step.is-active::before { background:#111216; box-shadow:0 0 0 2px color-mix(in srgb,#111216 8%,transparent); }
.theme-dark .dashflow-project-step.is-active::before { background:#f1f1f2; }
.dashflow-command-shell .dashflow-project-stat { min-width: 38px; text-align:right; }
.dashflow-command-shell .dashflow-project-stat strong { display:block; color:var(--df-cmd-text); font-size:9px !important; }
.dashflow-command-shell .dashflow-project-stat span { display:block; margin-top:2px; color:var(--df-cmd-faint); font-size:7px !important; }

/* Upcoming can occupy a tall right rail, so keep rows very compact. */
.dashflow-command-shell .dashflow-widget[data-widget-type="upcoming"] .dashflow-task { min-height: 24px !important; }
.dashflow-command-shell .dashflow-widget[data-widget-type="upcoming"] .dashflow-widget-body { padding: 9px 8px !important; }

/* Heatmap and countdown: monochrome first, accents only on actual data. */
.dashflow-command-shell .dashflow-widget[data-widget-type="heatmap"] .dashflow-heatmap { padding: 0 !important; }
.dashflow-command-shell .dashflow-heatmap-stats strong { color: var(--df-cmd-text) !important; }
.dashflow-command-shell .dashflow-heatmap-cell { border-radius: 1px !important; background: color-mix(in srgb, var(--df-cmd-border) 68%, transparent) !important; }
.dashflow-command-shell .dashflow-heatmap-cell[data-level="1"] { background: color-mix(in srgb, var(--df-cmd-purple) 26%, var(--df-cmd-soft)) !important; }
.dashflow-command-shell .dashflow-heatmap-cell[data-level="2"] { background: color-mix(in srgb, var(--df-cmd-purple) 45%, var(--df-cmd-soft)) !important; }
.dashflow-command-shell .dashflow-heatmap-cell[data-level="3"] { background: color-mix(in srgb, var(--df-cmd-purple) 68%, var(--df-cmd-soft)) !important; }
.dashflow-command-shell .dashflow-heatmap-cell[data-level="4"] { background: var(--df-cmd-purple) !important; }
.dashflow-command-shell .dashflow-countdown { height:100%; display:grid !important; place-content:center; justify-items:center; }
.dashflow-command-shell .dashflow-countdown > span { color:var(--df-cmd-muted) !important; font-family:var(--font-monospace); font-size:7px !important; letter-spacing:.08em; }
.dashflow-command-shell .dashflow-countdown strong { margin:7px 0 0 !important; color:var(--df-cmd-text) !important; font-size:42px !important; line-height:.9 !important; font-weight:760 !important; letter-spacing:-.045em; }
.dashflow-command-shell .dashflow-countdown small { margin-top:-1px; color:var(--df-cmd-muted) !important; font-size:7px !important; letter-spacing:.11em; }

/* Habit / calendar / review pages keep the same visual language. */
.dashflow-command-shell .dashflow-habit-row,
.dashflow-command-shell .dashflow-calendar-day,
.dashflow-command-shell .dashflow-weekly-project-row { border-radius:3px !important; box-shadow:none !important; }
.dashflow-command-shell .dashflow-calendar-day { border-color:var(--df-cmd-border) !important; }
.dashflow-command-shell .dashflow-calendar-day.is-selected { border-color:var(--df-cmd-purple) !important; background:color-mix(in srgb,var(--df-cmd-purple) 8%,var(--df-cmd-surface)) !important; }

/* Inbox synthetic workflow for the top navigation. */
.dashflow-command-page {
  min-height: 420px;
  padding: 15px;
  border: 1px solid var(--df-cmd-border);
  border-radius: 7px;
  background: var(--df-cmd-surface);
  box-shadow: var(--df-cmd-shadow);
}
.dashflow-command-page-head { display:flex; align-items:flex-end; justify-content:space-between; gap:16px; padding-bottom:12px; border-bottom:1px solid var(--df-cmd-border); }
.dashflow-command-page-head small { display:block; margin-bottom:4px; color:var(--df-cmd-faint); font-family:var(--font-monospace); font-size:7px; letter-spacing:.12em; }
.dashflow-command-page-head h2 { margin:0; color:var(--df-cmd-text); font-size:18px; }
.dashflow-command-page-head button { height:27px; border:1px solid var(--df-cmd-border); border-radius:3px; color:var(--df-cmd-muted); background:transparent; font-size:8px; }
.dashflow-command-inbox-composer { height:38px; margin:12px 0 10px; padding:0 10px; display:grid; grid-template-columns:15px minmax(0,1fr) auto; align-items:center; gap:8px; border:1px solid var(--df-cmd-border); border-radius:4px; background:var(--df-cmd-soft); }
.dashflow-command-inbox-composer > span:first-child { width:14px; height:14px; color:var(--df-cmd-muted); }
.dashflow-command-inbox-composer input { width:100%; border:0 !important; background:transparent !important; box-shadow:none !important; font-size:9px; }
.dashflow-command-inbox-composer > span:last-child { color:var(--df-cmd-faint); font-family:var(--font-monospace); font-size:7px; }
.dashflow-command-inbox-list { display:flex; flex-direction:column; }
.dashflow-command-inbox-row { min-height:40px; display:grid; grid-template-columns:16px minmax(0,1fr) 16px; gap:8px; align-items:center; border-bottom:1px solid var(--df-cmd-border); }
.dashflow-command-inbox-row > button { min-width:0; padding:5px 0; border:0; background:transparent; text-align:left; cursor:pointer; }
.dashflow-command-inbox-row > button strong { display:block; overflow:hidden; color:var(--df-cmd-text); font-size:9px; text-overflow:ellipsis; white-space:nowrap; }
.dashflow-command-inbox-row > button small { display:block; margin-top:3px; color:var(--df-cmd-faint); font-size:7px; }
.dashflow-command-inbox-row > span { width:13px; height:13px; color:var(--df-cmd-faint); }
.dashflow-command-empty { min-height:260px; display:grid; place-items:center; align-content:center; text-align:center; color:var(--df-cmd-faint); }
.dashflow-command-empty > span { width:24px; height:24px; margin-bottom:9px; }
.dashflow-command-empty strong { color:var(--df-cmd-text); font-size:10px; }
.dashflow-command-empty p { max-width:340px; margin:6px 0 0; font-size:8px; line-height:1.55; }

/* Edit mode echoes the reference floating pill. */
.dashflow-command-shell .dashflow-resize-handle { border-radius:50% !important; }
.dashflow-command-shell .dashflow-edit-bar {
  position:fixed !important;
  left:50%;
  bottom:22px;
  z-index:120;
  transform:translateX(-50%);
  min-height:42px;
  padding:5px 7px !important;
  display:flex;
  align-items:center;
  gap:5px;
  border:1px solid var(--df-cmd-border) !important;
  border-radius:999px !important;
  background:color-mix(in srgb,var(--df-cmd-surface) 94%,transparent) !important;
  box-shadow:0 10px 34px rgba(28,30,42,.15) !important;
  backdrop-filter:blur(16px);
}
.dashflow-command-shell .dashflow-edit-bar select,
.dashflow-command-shell .dashflow-edit-bar button { height:30px !important; border-radius:999px !important; font-size:8px !important; }
.dashflow-command-shell .dashflow-edit-bar > span { color:var(--df-cmd-faint) !important; font-size:7px !important; }

/* Vault stats should not look like giant KPI cards when opened in Review. */
.dashflow-command-shell .dashflow-stats-grid { height:100%; display:grid; grid-template-columns:repeat(4,1fr); }
.dashflow-command-shell .dashflow-stat { border-right:1px solid var(--df-cmd-border); background:transparent !important; }
.dashflow-command-shell .dashflow-stat:last-child { border-right:0; }
.dashflow-command-shell .dashflow-stat strong { color:var(--df-cmd-text) !important; font-size:19px !important; }
.dashflow-command-shell .dashflow-stat span { color:var(--df-cmd-faint) !important; font-size:7px !important; }

@media (max-width: 980px) {
  .dashflow-command-shell { width:min(100% - 18px, 1180px) !important; }
  .dashflow-command-shell .dashflow-hero { height:118px; min-height:118px !important; }
  .dashflow-command-shell .dashflow-hero h1 { font-size:23px !important; letter-spacing:.11em !important; }
  .dashflow-command-actions .is-secondary-action { display:none; }
  .dashflow-command-workspace { display:none; }
  .dashflow-command-shell .dashflow-project-row { grid-template-columns:minmax(0,1fr) 120px auto; }
}

@media (max-width: 760px) {
  .dashflow-command-shell { width:calc(100% - 14px) !important; padding-top:8px !important; }
  .dashflow-command-shell .dashflow-hero { height:92px; min-height:92px !important; border-radius:7px !important; }
  .dashflow-command-shell .dashflow-hero h1 { font-size:17px !important; letter-spacing:.08em !important; }
  .dashflow-command-shell .dashflow-hero p,.dashflow-command-shell .dashflow-eyebrow { display:none !important; }
  .dashflow-command-shell .dashflow-section-title { min-height:64px; }
  .dashflow-command-title { font-size:23px; }
  .dashflow-command-meta,.dashflow-command-date small { display:none; }
  .dashflow-command-date strong { font-size:8px; }
  .dashflow-command-bar { gap:2px; }
  .dashflow-command-actions { margin-left:0; }
  .dashflow-command-button { padding:0 6px; }
  .dashflow-command-actions .dashflow-command-button:not(.is-icon-action):not(:first-child) { display:none; }
  .dashflow-command-shell .dashflow-grid[data-product-section] { display:block !important; }
  .dashflow-command-shell .dashflow-grid[data-product-section] > .dashflow-widget { display:block !important; margin-bottom:8px; min-height:190px; }
  .dashflow-command-shell .dashflow-grid[data-product-section="today"] > .dashflow-widget[data-widget-type="upcoming"] { min-height:280px; }
  .dashflow-command-shell .dashflow-project-row { grid-template-columns:minmax(0,1fr) auto; }
  .dashflow-project-steps { display:none; }
  .dashflow-progress-pair { grid-template-columns:repeat(2,1fr); }
  .dashflow-command-page { min-height:420px; }
}

@media (max-width: 480px) {
  .dashflow-command-nav .dashflow-command-label { display:none; }
  .dashflow-command-nav .dashflow-command-button { width:28px; padding:0; justify-content:center; }
  .dashflow-command-title-right .dashflow-command-date { display:none; }
  .dashflow-command-shell .dashflow-progress-ring { width:62px !important; height:62px !important; }
}

@media (prefers-reduced-motion: reduce) {
  .dashflow-command-shell *, .dashflow-command-bar * { transition:none !important; scroll-behavior:auto !important; }
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

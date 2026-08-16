const STYLE_ID = "dashflow-studio-ui-v031";

export const PRODUCT_STYLES = `
.dashflow-view-container {
  --df-st-bg: #f7f8fb;
  --df-st-surface: #ffffff;
  --df-st-surface-soft: #f1f3f7;
  --df-st-surface-hover: #eef1f6;
  --df-st-border: rgba(22, 27, 45, .085);
  --df-st-border-strong: rgba(22, 27, 45, .14);
  --df-st-text: #1d2029;
  --df-st-muted: #737a8a;
  --df-st-faint: #a2a8b4;
  --df-st-violet: #6f5cff;
  --df-st-violet-soft: #eeeaff;
  --df-st-cyan: #28b8e6;
  --df-st-green: #25b981;
  --df-st-amber: #e99a3e;
  --df-st-rose: #e45f73;
  --df-st-shadow: 0 10px 34px rgba(34, 39, 58, .055);
  --df-st-shadow-float: 0 18px 44px rgba(34, 39, 58, .09);
  color: var(--df-st-text);
  background:
    radial-gradient(780px 420px at 34% -8%, rgba(111, 92, 255, .055), transparent 70%),
    radial-gradient(660px 360px at 88% 0%, rgba(40, 184, 230, .045), transparent 72%),
    var(--df-st-bg) !important;
}

.theme-dark .dashflow-view-container {
  --df-st-bg: #111318;
  --df-st-surface: #181b22;
  --df-st-surface-soft: #20242d;
  --df-st-surface-hover: #252a34;
  --df-st-border: rgba(255,255,255,.075);
  --df-st-border-strong: rgba(255,255,255,.13);
  --df-st-text: #f1f3f7;
  --df-st-muted: #9aa1b0;
  --df-st-faint: #686f7e;
  --df-st-violet-soft: rgba(111,92,255,.18);
  --df-st-shadow: 0 12px 36px rgba(0,0,0,.18);
  --df-st-shadow-float: 0 20px 50px rgba(0,0,0,.28);
  background:
    radial-gradient(820px 420px at 34% -8%, rgba(111, 92, 255, .10), transparent 72%),
    radial-gradient(720px 400px at 92% -3%, rgba(40, 184, 230, .07), transparent 72%),
    var(--df-st-bg) !important;
}

.dashflow-product-hidden { display: none !important; }

/* Application shell: a quiet navigation surface, not a black dashboard sidebar. */
.dashflow-studio-shell {
  width: min(1510px, calc(100% - 24px)) !important;
  min-height: calc(100vh - 24px);
  margin: 0 auto !important;
  padding: 12px 0 52px !important;
  display: grid !important;
  grid-template-columns: 176px minmax(0, 1fr);
  column-gap: 28px;
  align-content: start;
}
.dashflow-studio-shell > :not(.dashflow-product-nav) { grid-column: 2; }

.dashflow-studio-nav {
  grid-column: 1 !important;
  grid-row: 1 / span 40;
  position: sticky;
  top: 12px;
  z-index: 25;
  height: calc(100vh - 24px);
  min-height: 520px;
  padding: 14px 10px 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--df-st-border);
  border-radius: 18px;
  color: var(--df-st-text);
  background: color-mix(in srgb, var(--df-st-surface) 78%, transparent);
  box-shadow: 0 8px 30px rgba(36, 41, 60, .04);
  backdrop-filter: blur(18px) saturate(1.05);
}
.theme-dark .dashflow-studio-nav { background: color-mix(in srgb, var(--df-st-surface) 88%, transparent); }

.dashflow-product-brand {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 3px 7px 17px;
}
.dashflow-product-brand-mark {
  width: 31px;
  height: 31px;
  flex: 0 0 31px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  color: #fff;
  background: linear-gradient(145deg, #7a63ff, #5c7cff 55%, #37bde7);
  box-shadow: 0 8px 22px rgba(100, 88, 255, .22), inset 0 1px 0 rgba(255,255,255,.25);
}
.dashflow-product-brand-mark svg { width: 15px; height: 15px; }
.dashflow-product-brand strong { display:block; color:var(--df-st-text); font-size:12px; line-height:1.15; font-weight:750; letter-spacing:-.02em; }
.dashflow-product-brand span { display:block; margin-top:3px; color:var(--df-st-faint); font-size:7px; line-height:1; font-weight:750; letter-spacing:.16em; }

.dashflow-product-nav-list { display:flex; flex-direction:column; gap:2px; }
.dashflow-product-nav-item {
  width:100%;
  min-height:37px;
  display:grid;
  grid-template-columns:18px minmax(0,1fr) auto;
  align-items:center;
  gap:9px;
  padding:0 9px;
  border:0 !important;
  border-radius:10px !important;
  color:var(--df-st-muted) !important;
  background:transparent !important;
  box-shadow:none !important;
  font-size:10.5px;
  font-weight:600;
  text-align:left;
  cursor:pointer;
  transition:background .16s ease,color .16s ease,transform .16s ease;
}
.dashflow-product-nav-item:hover { color:var(--df-st-text) !important; background:var(--df-st-surface-soft) !important; }
.dashflow-product-nav-item.is-active { color:var(--df-st-text) !important; background:var(--df-st-violet-soft) !important; }
.dashflow-product-nav-item.is-active .dashflow-product-nav-icon { color:var(--df-st-violet); }
.dashflow-product-nav-icon { width:18px; height:18px; display:grid; place-items:center; color:var(--df-st-faint); }
.dashflow-product-nav-icon svg { width:15px; height:15px; }
.dashflow-product-nav-badge { min-width:0; padding:1px 5px; border-radius:999px; color:var(--df-st-violet); background:color-mix(in srgb,var(--df-st-violet) 10%,transparent); font-size:8px; font-weight:750; text-align:center; }
.dashflow-product-nav-badge:empty { display:none; }

.dashflow-sidebar-workspace {
  margin-top:auto;
  padding-top:10px;
  border-top:1px solid var(--df-st-border);
}
.dashflow-sidebar-workspace .dashflow-dashboard-switcher {
  margin:0 !important;
  min-height:0 !important;
  display:grid !important;
  grid-template-columns:minmax(0,1fr) 27px 27px;
  gap:4px !important;
}
.dashflow-sidebar-workspace .dashflow-dashboard-switcher select,
.dashflow-sidebar-workspace .dashflow-dashboard-switcher button {
  height:28px !important;
  min-height:28px !important;
  border:1px solid var(--df-st-border) !important;
  border-radius:8px !important;
  color:var(--df-st-muted) !important;
  background:var(--df-st-surface-soft) !important;
  box-shadow:none !important;
}
.dashflow-sidebar-workspace .dashflow-dashboard-switcher select { min-width:0 !important; width:100%; padding:0 6px; font-size:9px; }
.dashflow-sidebar-workspace .dashflow-dashboard-switcher button { min-width:27px !important; padding:0 !important; }
.dashflow-sidebar-workspace .dashflow-dashboard-count { display:none !important; }
.dashflow-product-nav-footer { padding-top:5px; }
.dashflow-product-customize {
  width:100%;
  height:29px !important;
  border:0 !important;
  border-radius:8px !important;
  color:var(--df-st-faint) !important;
  background:transparent !important;
  box-shadow:none !important;
  font-size:9px !important;
}
.dashflow-product-customize:hover { color:var(--df-st-text) !important; background:var(--df-st-surface-soft) !important; }

/* Purpose-built content area. */
.dashflow-studio-stage {
  width:100%;
  min-width:0;
  padding:4px 2px 40px;
}
.dashflow-studio-header {
  min-height:82px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:24px;
  margin:0 0 14px;
  padding:5px 2px 14px;
  border-bottom:1px solid var(--df-st-border);
}
.dashflow-studio-header-copy { min-width:0; }
.dashflow-studio-crumb { margin-bottom:6px; color:var(--df-st-faint); font-size:8px; font-weight:760; letter-spacing:.14em; }
.dashflow-studio-title-row { display:flex; align-items:baseline; gap:11px; }
.dashflow-studio-title-row h1 { margin:0 !important; color:var(--df-st-text) !important; font-size:29px !important; line-height:1.05 !important; font-weight:760 !important; letter-spacing:-.045em !important; -webkit-text-fill-color:currentColor !important; background:none !important; }
.dashflow-studio-date { color:var(--df-st-muted); font-size:10px; font-weight:560; }
.dashflow-studio-header p { margin:5px 0 0 !important; color:var(--df-st-muted) !important; font-size:10.5px !important; line-height:1.45; }
.dashflow-studio-actions { display:flex; align-items:center; gap:7px; flex:0 0 auto; }
.dashflow-studio-icon-action,
.dashflow-studio-primary-action {
  height:34px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:6px;
  border-radius:10px !important;
  font-size:10px;
  font-weight:650;
  cursor:pointer;
  transition:transform .16s ease,box-shadow .16s ease,background .16s ease;
}
.dashflow-studio-icon-action {
  width:34px;
  padding:0 !important;
  border:1px solid var(--df-st-border) !important;
  color:var(--df-st-muted) !important;
  background:var(--df-st-surface) !important;
  box-shadow:none !important;
}
.dashflow-studio-icon-action span,.dashflow-studio-icon-action svg { width:15px; height:15px; }
.dashflow-studio-primary-action {
  padding:0 12px !important;
  border:0 !important;
  color:#fff !important;
  background:linear-gradient(135deg,#6f5cff,#5f78ff 58%,#43b6df) !important;
  box-shadow:0 8px 22px rgba(98,86,255,.20) !important;
}
.dashflow-studio-primary-action span:first-child,.dashflow-studio-primary-action svg { width:14px; height:14px; }
.dashflow-studio-icon-action:hover,.dashflow-studio-primary-action:hover { transform:translateY(-1px); }

.dashflow-studio-page { display:flex; flex-direction:column; gap:14px; min-width:0; }
.dashflow-studio-composer {
  min-height:48px;
  display:grid;
  grid-template-columns:20px minmax(0,1fr) auto;
  align-items:center;
  gap:9px;
  padding:0 13px;
  border:1px solid var(--df-st-border);
  border-radius:14px;
  background:var(--df-st-surface);
  box-shadow:0 7px 24px rgba(39,44,62,.035);
  transition:border-color .16s ease,box-shadow .16s ease;
}
.dashflow-studio-composer:focus-within { border-color:color-mix(in srgb,var(--df-st-violet) 35%,var(--df-st-border)); box-shadow:0 10px 30px rgba(92,78,255,.075); }
.dashflow-studio-composer-icon { width:20px; height:20px; display:grid; place-items:center; color:var(--df-st-violet); }
.dashflow-studio-composer-icon svg { width:15px; height:15px; }
.dashflow-studio-composer input { width:100%; height:44px; padding:0 !important; border:0 !important; outline:0 !important; color:var(--df-st-text) !important; background:transparent !important; box-shadow:none !important; font-size:11px; }
.dashflow-studio-composer input::placeholder { color:var(--df-st-faint); }
.dashflow-key-hint { padding:3px 6px; border:1px solid var(--df-st-border); border-radius:6px; color:var(--df-st-faint); background:var(--df-st-surface-soft); font-size:8px; font-weight:650; }

/* Metrics are context, not four equal KPI cards. */
.dashflow-day-context,
.dashflow-project-toolbar {
  display:flex;
  align-items:center;
  gap:0;
  min-height:34px;
  padding:0 4px;
}
.dashflow-context-stat { display:flex; align-items:baseline; gap:5px; padding:0 15px; border-right:1px solid var(--df-st-border); }
.dashflow-context-stat:first-child { padding-left:2px; }
.dashflow-context-stat:last-child { border-right:0; }
.dashflow-context-stat strong { color:var(--df-st-text); font-size:12px; font-weight:740; letter-spacing:-.02em; }
.dashflow-context-stat span { color:var(--df-st-muted); font-size:9px; }
.dashflow-context-stat.is-danger strong { color:var(--df-st-rose); }

.dashflow-studio-today-layout {
  display:grid;
  grid-template-columns:minmax(0,1.65fr) minmax(280px,.78fr);
  gap:15px;
  align-items:start;
}
.dashflow-studio-surface {
  min-width:0;
  border:1px solid var(--df-st-border);
  border-radius:18px;
  background:var(--df-st-surface);
  box-shadow:var(--df-st-shadow);
  overflow:hidden;
}
.dashflow-focus-panel {
  min-height:430px;
  background:
    radial-gradient(520px 190px at 7% -12%, rgba(111,92,255,.085), transparent 72%),
    var(--df-st-surface);
}
.dashflow-studio-surface-head {
  min-height:51px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:14px;
  padding:0 17px;
  border-bottom:1px solid var(--df-st-border);
}
.dashflow-studio-surface-head h2 { margin:0 !important; color:var(--df-st-text) !important; font-size:11.5px !important; font-weight:720 !important; letter-spacing:-.015em; }
.dashflow-studio-surface-head > span { color:var(--df-st-faint); font-size:8.5px; font-weight:600; }

.dashflow-studio-task-list { padding:7px 9px 11px; }
.dashflow-studio-task-row {
  min-height:52px;
  display:grid;
  grid-template-columns:20px minmax(0,1fr) 28px;
  align-items:center;
  gap:9px;
  padding:5px 5px 5px 7px;
  border-bottom:1px solid color-mix(in srgb,var(--df-st-border) 72%,transparent);
  transition:background .15s ease;
}
.dashflow-studio-task-row:last-child { border-bottom:0; }
.dashflow-studio-task-row:hover { background:var(--df-st-surface-soft); border-radius:11px; }
.dashflow-studio-task-check {
  width:18px;
  height:18px;
  padding:0 !important;
  border:1.5px solid var(--df-st-border-strong) !important;
  border-radius:6px !important;
  background:transparent !important;
  box-shadow:none !important;
}
.dashflow-studio-task-row[data-priority="urgent"] .dashflow-studio-task-check { border-color:color-mix(in srgb,var(--df-st-rose) 62%,var(--df-st-border)) !important; }
.dashflow-studio-task-row[data-priority="high"] .dashflow-studio-task-check { border-color:color-mix(in srgb,var(--df-st-amber) 60%,var(--df-st-border)) !important; }
.dashflow-studio-task-main { min-width:0; display:flex; flex-direction:column; align-items:flex-start; gap:4px; padding:4px 2px !important; border:0 !important; color:inherit !important; background:transparent !important; box-shadow:none !important; text-align:left; }
.dashflow-studio-task-title { width:100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:var(--df-st-text); font-size:11px; font-weight:590; }
.dashflow-studio-task-meta { display:flex; align-items:center; gap:5px; min-height:14px; }
.dashflow-studio-chip { display:inline-flex; align-items:center; min-height:16px; padding:0 6px; border-radius:999px; color:var(--df-st-muted); background:var(--df-st-surface-soft); font-size:7.5px; font-weight:620; }
.dashflow-studio-chip.is-danger { color:var(--df-st-rose); background:color-mix(in srgb,var(--df-st-rose) 9%,transparent); }
.dashflow-studio-row-action { opacity:0; width:26px !important; height:26px !important; border:0 !important; background:transparent !important; box-shadow:none !important; }
.dashflow-studio-task-row:hover .dashflow-studio-row-action { opacity:1; }

.dashflow-studio-context-rail { display:flex; flex-direction:column; gap:11px; }
.dashflow-mini-panel { box-shadow:none; }
.dashflow-mini-panel .dashflow-studio-surface-head { min-height:43px; padding:0 13px; }
.dashflow-mini-list { padding:5px 7px 8px; }
.dashflow-mini-row,
.dashflow-mini-project,
.dashflow-mini-habit {
  width:100%;
  min-height:39px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  padding:5px 7px !important;
  border:0 !important;
  border-radius:9px !important;
  color:var(--df-st-text) !important;
  background:transparent !important;
  box-shadow:none !important;
  text-align:left;
  font-size:9.5px;
}
.dashflow-mini-row:hover,.dashflow-mini-project:hover,.dashflow-mini-habit:hover { background:var(--df-st-surface-soft) !important; }
.dashflow-mini-row > span:first-child { min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.dashflow-mini-row small,.dashflow-mini-project small,.dashflow-mini-habit small { color:var(--df-st-faint); font-size:7.5px; }
.dashflow-mini-project-copy,.dashflow-mini-habit-copy { min-width:0; display:flex; flex-direction:column; gap:2px; }
.dashflow-mini-project-copy strong,.dashflow-mini-habit-copy strong { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:var(--df-st-text); font-size:9.5px; font-weight:620; }
.dashflow-mini-project-progress { color:var(--df-st-violet); font-size:9px; font-weight:740; }
.dashflow-mini-habit { justify-content:flex-start; }
.dashflow-mini-habit-check { width:17px; height:17px; flex:0 0 17px; display:grid; place-items:center; border:1px solid var(--df-st-border-strong); border-radius:6px; color:#fff; }
.dashflow-mini-habit.is-done .dashflow-mini-habit-check { border-color:transparent; background:var(--df-st-green); }
.dashflow-mini-habit-check svg { width:11px; height:11px; }
.dashflow-mini-empty { margin:0 !important; padding:14px 13px 15px; color:var(--df-st-faint) !important; font-size:8.5px !important; line-height:1.5; }

.dashflow-studio-empty {
  min-height:250px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:11px;
  padding:36px 24px;
  text-align:center;
}
.dashflow-studio-empty-icon { width:38px; height:38px; display:grid; place-items:center; border-radius:13px; color:var(--df-st-violet); background:var(--df-st-violet-soft); }
.dashflow-studio-empty-icon svg { width:18px; height:18px; }
.dashflow-studio-empty-copy { max-width:430px; }
.dashflow-studio-empty-copy strong { display:block; color:var(--df-st-text); font-size:12px; font-weight:700; }
.dashflow-studio-empty-copy p { margin:6px 0 0 !important; color:var(--df-st-muted) !important; font-size:9px !important; line-height:1.6; }
.dashflow-studio-empty-actions { display:flex; align-items:center; gap:7px; margin-top:2px; }
.dashflow-studio-empty-actions button { min-height:30px; padding:0 10px; border:1px solid var(--df-st-border) !important; border-radius:9px !important; color:var(--df-st-text) !important; background:var(--df-st-surface) !important; box-shadow:none !important; font-size:9px; }
.dashflow-studio-empty-actions button.is-primary { border-color:transparent !important; color:#fff !important; background:var(--df-st-violet) !important; }

/* Inbox is a processing queue, not a dashboard widget. */
.dashflow-inbox-surface { min-height:430px; }
.dashflow-studio-task-row.is-inbox .dashflow-studio-task-check { border-radius:50% !important; }

/* Projects use a curated portfolio board instead of progress-bar form rows. */
.dashflow-project-toolbar { min-height:38px; padding-left:2px; }
.dashflow-project-board { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
.dashflow-project-tile {
  position:relative;
  min-height:165px;
  display:flex;
  flex-direction:column;
  align-items:stretch;
  padding:16px !important;
  overflow:hidden;
  border:1px solid var(--df-st-border) !important;
  border-radius:17px !important;
  color:var(--df-st-text) !important;
  background:
    radial-gradient(260px 130px at 100% 0%, rgba(111,92,255,.07), transparent 72%),
    var(--df-st-surface) !important;
  box-shadow:var(--df-st-shadow) !important;
  text-align:left;
  transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease;
}
.dashflow-project-tile.tone-1 { background:radial-gradient(260px 130px at 100% 0%,rgba(40,184,230,.075),transparent 72%),var(--df-st-surface) !important; }
.dashflow-project-tile.tone-2 { background:radial-gradient(260px 130px at 100% 0%,rgba(37,185,129,.07),transparent 72%),var(--df-st-surface) !important; }
.dashflow-project-tile.tone-3 { background:radial-gradient(260px 130px at 100% 0%,rgba(233,154,62,.07),transparent 72%),var(--df-st-surface) !important; }
.dashflow-project-tile:hover { transform:translateY(-2px); border-color:color-mix(in srgb,var(--df-st-violet) 20%,var(--df-st-border)) !important; box-shadow:var(--df-st-shadow-float) !important; }
.dashflow-project-tile-top { display:flex; align-items:center; justify-content:space-between; gap:12px; }
.dashflow-project-status { min-height:19px; display:inline-flex; align-items:center; padding:0 7px; border-radius:999px; color:var(--df-st-violet); background:var(--df-st-violet-soft); font-size:7.5px; font-weight:680; }
.dashflow-project-status.is-paused { color:var(--df-st-amber); background:color-mix(in srgb,var(--df-st-amber) 10%,transparent); }
.dashflow-project-status.is-completed { color:var(--df-st-green); background:color-mix(in srgb,var(--df-st-green) 10%,transparent); }
.dashflow-project-arrow { width:22px; height:22px; display:grid; place-items:center; color:var(--df-st-faint); }
.dashflow-project-arrow svg { width:13px; height:13px; }
.dashflow-project-tile h3 { margin:20px 0 5px !important; color:var(--df-st-text) !important; font-size:14px !important; font-weight:720 !important; letter-spacing:-.025em; }
.dashflow-project-tile p { min-height:28px; margin:0 !important; color:var(--df-st-muted) !important; font-size:9px !important; line-height:1.5; }
.dashflow-project-tile-meta { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-top:auto; padding-top:17px; }
.dashflow-project-tile-meta span { color:var(--df-st-muted); font-size:8px; }
.dashflow-project-tile-meta strong { color:var(--df-st-violet); font-size:10px; font-weight:740; }
.dashflow-project-tile-track { height:3px; margin-top:7px; overflow:hidden; border-radius:99px; background:var(--df-st-surface-soft); }
.dashflow-project-tile-track span { display:block; height:100%; border-radius:inherit; background:linear-gradient(90deg,var(--df-st-violet),var(--df-st-cyan)); }

/* Calendar / habits / review keep their mature behavior but live in a clean workflow canvas. */
.dashflow-grid[data-product-section] {
  margin:0 !important;
  padding:0 !important;
  gap:14px !important;
  grid-template-columns:repeat(12,minmax(0,1fr)) !important;
  grid-auto-rows:auto !important;
}
.dashflow-grid[data-product-section] > .dashflow-widget {
  position:relative !important;
  min-height:0 !important;
  overflow:hidden !important;
  border:1px solid var(--df-st-border) !important;
  border-radius:18px !important;
  background:var(--df-st-surface) !important;
  box-shadow:var(--df-st-shadow) !important;
}
.dashflow-grid[data-product-section] > .dashflow-widget .dashflow-widget-header {
  min-height:48px !important;
  padding:0 16px !important;
  border-bottom:1px solid var(--df-st-border) !important;
  background:transparent !important;
}
.dashflow-grid[data-product-section] > .dashflow-widget .dashflow-widget-body { padding:15px !important; }
.dashflow-grid[data-product-section="calendar"] > .dashflow-widget { min-height:690px !important; }
.dashflow-grid[data-product-section="habits"] > .dashflow-widget { min-height:480px !important; }
.dashflow-grid[data-product-section="review"] > .dashflow-widget[data-widget-type="weekly-review"] { min-height:520px !important; }
.dashflow-grid[data-product-section="review"] > .dashflow-widget[data-widget-type="heatmap"] { min-height:330px !important; }
.dashflow-grid[data-product-section="review"] > .dashflow-widget[data-widget-type="vault-stats"] { min-height:150px !important; }
.dashflow-grid[data-product-section] .dashflow-widget-controls { opacity:.18; transition:opacity .16s ease; }
.dashflow-grid[data-product-section] .dashflow-widget:hover .dashflow-widget-controls { opacity:.65; }

/* Legacy layout mode remains available, but it no longer defines the product UI. */
.dashflow-studio-shell.is-layout-editing .dashflow-hero { grid-column:2; }
.dashflow-studio-shell.is-layout-editing .dashflow-grid { grid-column:2; }
.dashflow-studio-shell.is-layout-editing .dashflow-product-nav { opacity:.88; }

@media (max-width: 1080px) {
  .dashflow-studio-shell { grid-template-columns:150px minmax(0,1fr); column-gap:18px; }
  .dashflow-studio-today-layout { grid-template-columns:minmax(0,1.4fr) minmax(250px,.78fr); }
  .dashflow-product-nav-text { font-size:10px; }
}

@media (max-width: 900px) {
  .dashflow-studio-shell {
    width:100% !important;
    min-height:100vh;
    padding:8px 10px 88px !important;
    display:block !important;
  }
  .dashflow-studio-shell > :not(.dashflow-product-nav) { grid-column:auto; }
  .dashflow-studio-nav {
    position:fixed;
    left:10px;
    right:10px;
    bottom:10px;
    top:auto;
    z-index:100;
    width:auto;
    height:62px;
    min-height:0;
    padding:6px 7px;
    border-radius:18px;
    box-shadow:0 16px 42px rgba(30,34,50,.16);
  }
  .dashflow-product-brand,.dashflow-sidebar-workspace,.dashflow-product-nav-footer { display:none !important; }
  .dashflow-product-nav-list { display:grid; grid-template-columns:repeat(6,1fr); gap:2px; height:100%; }
  .dashflow-product-nav-item { min-height:48px; grid-template-columns:1fr; grid-template-rows:20px 13px; gap:1px; justify-items:center; padding:4px 2px; font-size:8px; text-align:center; }
  .dashflow-product-nav-icon { width:20px; height:20px; }
  .dashflow-product-nav-badge { position:absolute; margin:-3px 0 0 16px; }
  .dashflow-studio-stage { padding:0 0 20px; }
  .dashflow-studio-header { min-height:72px; margin-bottom:11px; padding:4px 1px 11px; }
  .dashflow-studio-title-row h1 { font-size:25px !important; }
  .dashflow-studio-header p { display:none; }
  .dashflow-studio-date { font-size:9px; }
  .dashflow-studio-today-layout { grid-template-columns:1fr; }
  .dashflow-studio-context-rail { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); }
  .dashflow-mini-habits { grid-column:1 / -1; }
  .dashflow-project-board { grid-template-columns:1fr; }
  .dashflow-grid[data-product-section="habits"] > .dashflow-widget { grid-column:1 / -1 !important; }
  .dashflow-grid[data-product-section] { display:block !important; }
  .dashflow-grid[data-product-section] > .dashflow-widget { margin-bottom:12px; }
}

@media (max-width: 620px) {
  .dashflow-studio-shell { padding-left:8px !important; padding-right:8px !important; }
  .dashflow-studio-header { align-items:flex-end; }
  .dashflow-studio-title-row { display:block; }
  .dashflow-studio-date { display:block; margin-top:5px; }
  .dashflow-studio-actions { gap:5px; }
  .dashflow-studio-primary-action span:last-child { display:none; }
  .dashflow-studio-primary-action { width:34px; padding:0 !important; }
  .dashflow-day-context,.dashflow-project-toolbar { overflow-x:auto; scrollbar-width:none; }
  .dashflow-context-stat { flex:0 0 auto; padding:0 11px; }
  .dashflow-studio-context-rail { grid-template-columns:1fr; }
  .dashflow-mini-habits { grid-column:auto; }
  .dashflow-studio-empty { min-height:210px; padding:28px 18px; }
  .dashflow-project-tile { min-height:150px; }
}

@media (prefers-reduced-motion: reduce) {
  .dashflow-product-nav-item,
  .dashflow-studio-icon-action,
  .dashflow-studio-primary-action,
  .dashflow-project-tile { transition:none !important; }
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

const STYLE_ID = "dashflow-product-ui-v3";

export const PRODUCT_STYLES = `
.dashflow-view-container {
  --df-v3-accent: color-mix(in srgb, var(--interactive-accent) 62%, #6c5cff);
  --df-v3-violet: #7567ff;
  --df-v3-cyan: #32c5f4;
  --df-v3-green: #31c48d;
  --df-v3-amber: #f3a547;
  --df-v3-rose: #ef6a7b;
  --df-v3-bg: #f4f5f8;
  --df-v3-surface: #ffffff;
  --df-v3-surface-2: #f0f2f6;
  --df-v3-surface-3: #e9ecf2;
  --df-v3-border: #e1e4eb;
  --df-v3-border-strong: #d5d9e3;
  --df-v3-text: #171923;
  --df-v3-muted: #6f7688;
  --df-v3-faint: #9ca2b0;
  --df-v3-sidebar: #11131a;
  --df-v3-sidebar-2: #191c26;
  --df-v3-shadow: 0 8px 26px rgba(33, 38, 57, .07);
  --df-v3-shadow-hover: 0 14px 38px rgba(32, 37, 57, .11);
  color: var(--df-v3-text);
  background:
    radial-gradient(700px 360px at 82% -9%, color-mix(in srgb, var(--df-v3-cyan) 6%, transparent), transparent 70%),
    radial-gradient(640px 340px at 35% -10%, color-mix(in srgb, var(--df-v3-violet) 7%, transparent), transparent 70%),
    var(--df-v3-bg) !important;
}

.theme-dark .dashflow-view-container {
  --df-v3-bg: #0b0d12;
  --df-v3-surface: #12151c;
  --df-v3-surface-2: #171a23;
  --df-v3-surface-3: #20242f;
  --df-v3-border: #242935;
  --df-v3-border-strong: #303644;
  --df-v3-text: #f3f5fa;
  --df-v3-muted: #9ba3b5;
  --df-v3-faint: #697184;
  --df-v3-sidebar: #07090e;
  --df-v3-sidebar-2: #10131b;
  --df-v3-shadow: 0 12px 34px rgba(0, 0, 0, .25);
  --df-v3-shadow-hover: 0 18px 44px rgba(0, 0, 0, .36);
  background:
    radial-gradient(760px 380px at 86% -12%, color-mix(in srgb, var(--df-v3-cyan) 8%, transparent), transparent 70%),
    radial-gradient(720px 360px at 34% -10%, color-mix(in srgb, var(--df-v3-violet) 10%, transparent), transparent 72%),
    var(--df-v3-bg) !important;
}

/* Product shell */
.dashflow-product-shell {
  width: min(1540px, calc(100% - 28px)) !important;
  min-height: calc(100vh - 28px);
  margin: 0 auto !important;
  padding: 18px 0 72px !important;
  display: grid !important;
  grid-template-columns: 208px minmax(0, 1fr);
  grid-auto-flow: row;
  column-gap: 24px;
  align-content: start;
}

.dashflow-product-shell > :not(.dashflow-product-nav) { grid-column: 2; }
.dashflow-product-hidden { display: none !important; }

.dashflow-product-nav {
  grid-column: 1 !important;
  grid-row: 1 / span 30;
  position: sticky;
  top: 18px;
  z-index: 20;
  height: calc(100vh - 36px);
  min-height: 520px;
  padding: 16px 12px 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 18px;
  color: rgba(255,255,255,.92);
  background:
    radial-gradient(220px 180px at 20% 0%, rgba(117,103,255,.18), transparent 72%),
    radial-gradient(260px 220px at 110% 20%, rgba(50,197,244,.10), transparent 70%),
    linear-gradient(180deg, var(--df-v3-sidebar-2), var(--df-v3-sidebar));
  box-shadow: 0 20px 60px rgba(12,14,22,.18);
}

.dashflow-product-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 6px 18px;
}

.dashflow-product-brand-mark {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  flex: 0 0 34px;
  border-radius: 10px;
  color: #fff;
  background: linear-gradient(145deg, var(--df-v3-violet), var(--df-v3-cyan));
  box-shadow: 0 10px 28px rgba(104, 89, 255, .28), inset 0 1px 0 rgba(255,255,255,.26);
}
.dashflow-product-brand-mark svg { width: 17px; height: 17px; }
.dashflow-product-brand strong { display: block; color: #fff; font-size: 13px; font-weight: 720; letter-spacing: -.02em; }
.dashflow-product-brand span { display: block; margin-top: 2px; color: rgba(255,255,255,.42); font-size: 8px; font-weight: 650; letter-spacing: .16em; }

.dashflow-product-nav-list { display: flex; flex-direction: column; gap: 3px; }
.dashflow-product-nav-item {
  position: relative;
  width: 100%;
  height: 38px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
  border: 0 !important;
  border-radius: 9px !important;
  color: rgba(255,255,255,.58) !important;
  background: transparent !important;
  box-shadow: none !important;
  font-size: 11px;
  font-weight: 560;
  text-align: left;
  cursor: pointer;
}
.dashflow-product-nav-item:hover { color: rgba(255,255,255,.9) !important; background: rgba(255,255,255,.055) !important; }
.dashflow-product-nav-item.is-active { color: #fff !important; background: linear-gradient(90deg, rgba(117,103,255,.18), rgba(50,197,244,.06)) !important; }
.dashflow-product-nav-item.is-active::before { content: ""; position: absolute; left: 0; width: 3px; height: 18px; border-radius: 99px; background: linear-gradient(180deg, var(--df-v3-violet), var(--df-v3-cyan)); box-shadow: 0 0 14px rgba(90,168,255,.45); }
.dashflow-product-nav-icon { width: 18px; height: 18px; display: grid; place-items: center; }
.dashflow-product-nav-icon svg { width: 16px; height: 16px; }

.dashflow-sidebar-workspace { margin-top: auto; padding-top: 16px; border-top: 1px solid rgba(255,255,255,.07); }
.dashflow-product-nav-label { padding: 0 7px 7px; color: rgba(255,255,255,.32); font-size: 8px; font-weight: 700; letter-spacing: .13em; text-transform: uppercase; }
.dashflow-sidebar-workspace .dashflow-dashboard-switcher { margin: 0 !important; display: grid !important; grid-template-columns: minmax(0,1fr) 30px 30px; gap: 5px !important; min-height: 0 !important; }
.dashflow-sidebar-workspace .dashflow-dashboard-switcher select,
.dashflow-sidebar-workspace .dashflow-dashboard-switcher button {
  height: 31px !important;
  min-height: 31px !important;
  border: 1px solid rgba(255,255,255,.08) !important;
  border-radius: 8px !important;
  color: rgba(255,255,255,.76) !important;
  background: rgba(255,255,255,.045) !important;
  box-shadow: none !important;
}
.dashflow-sidebar-workspace .dashflow-dashboard-switcher select { min-width: 0 !important; max-width: none !important; width: 100%; padding: 0 7px; font-size: 10px; }
.dashflow-sidebar-workspace .dashflow-dashboard-switcher button { min-width: 30px !important; padding: 0 !important; }
.dashflow-sidebar-workspace .dashflow-dashboard-count { display: none !important; }

.dashflow-product-nav-footer { padding-top: 7px; }
.dashflow-product-customize {
  width: 100%;
  height: 32px !important;
  border: 1px solid rgba(255,255,255,.07) !important;
  border-radius: 8px !important;
  color: rgba(255,255,255,.48) !important;
  background: transparent !important;
  box-shadow: none !important;
  font-size: 9.5px !important;
}
.dashflow-product-customize:hover { color: #fff !important; background: rgba(255,255,255,.05) !important; }

/* Header: no version, no marketing copy, just context and actions. */
.dashflow-product-shell .dashflow-hero {
  min-height: 0 !important;
  margin: 2px 0 14px !important;
  padding: 8px 2px 12px !important;
  display: flex !important;
  align-items: flex-end !important;
  gap: 18px;
  overflow: visible !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
}
.dashflow-product-shell .dashflow-hero::before,
.dashflow-product-shell .dashflow-hero::after { display: none !important; }
.dashflow-product-shell .dashflow-hero > div:first-child { flex: 1; min-width: 0; }
.dashflow-product-shell .dashflow-eyebrow {
  margin: 0 0 5px !important;
  color: var(--df-v3-muted) !important;
  font-size: 9px !important;
  font-weight: 600 !important;
  letter-spacing: .04em !important;
  text-transform: none !important;
}
.dashflow-product-shell .dashflow-eyebrow::before { display: none !important; }
.dashflow-product-shell .dashflow-hero h1 {
  margin: 0 0 4px !important;
  color: var(--df-v3-text) !important;
  font-size: clamp(27px, 3.1vw, 34px) !important;
  line-height: 1.06 !important;
  font-weight: 735 !important;
  letter-spacing: -.04em !important;
  -webkit-text-fill-color: currentColor !important;
  background: none !important;
  text-shadow: none !important;
}
.dashflow-product-shell .dashflow-hero p { margin: 0 !important; color: var(--df-v3-muted) !important; font-size: 10.5px !important; line-height: 1.45; }
.dashflow-product-header-actions { display: flex; align-items: center; gap: 7px; padding-bottom: 2px; }
.dashflow-product-action {
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 11px;
  border: 1px solid var(--df-v3-border) !important;
  border-radius: 9px !important;
  color: var(--df-v3-text) !important;
  background: var(--df-v3-surface) !important;
  box-shadow: none !important;
  font-size: 10px;
  font-weight: 620;
}
.dashflow-product-action svg { width: 14px; height: 14px; }
.dashflow-product-action:hover { border-color: var(--df-v3-border-strong) !important; background: var(--df-v3-surface-2) !important; transform: translateY(-1px); }
.dashflow-product-action.is-primary { color: #fff !important; border-color: transparent !important; background: linear-gradient(135deg, var(--df-v3-accent), color-mix(in srgb, var(--df-v3-accent) 58%, var(--df-v3-cyan))) !important; box-shadow: 0 8px 22px color-mix(in srgb, var(--df-v3-accent) 22%, transparent) !important; }

/* Today summary: compact, scannable, not a second card wall. */
.dashflow-today-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 13px;
}
.dashflow-today-summary-item {
  min-width: 0;
  padding: 11px 13px;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  align-items: center;
  column-gap: 9px;
  border: 1px solid var(--df-v3-border);
  border-radius: 11px;
  background: color-mix(in srgb, var(--df-v3-surface) 92%, transparent);
}
.dashflow-today-summary-item > span { grid-column: 1; grid-row: 1; color: var(--df-v3-muted); font-size: 9px; font-weight: 620; }
.dashflow-today-summary-item > strong { grid-column: 2; grid-row: 1 / span 2; justify-self: end; color: var(--df-v3-text); font-size: 20px; line-height: 1; letter-spacing: -.04em; }
.dashflow-today-summary-item > small { grid-column: 1; grid-row: 2; margin-top: 2px; color: var(--df-v3-faint); font-size: 8px; }
.dashflow-today-summary-item.is-danger > strong { color: var(--df-v3-rose); }

/* Core work surfaces */
.dashflow-product-shell .dashflow-grid { min-width: 0; align-content: start; }
.dashflow-product-shell .dashflow-widget {
  --df-widget-tone: var(--df-v3-accent);
  isolation: isolate;
  overflow: hidden !important;
  border: 1px solid var(--df-v3-border) !important;
  border-radius: 14px !important;
  color: var(--df-v3-text) !important;
  background: var(--df-v3-surface) !important;
  box-shadow: var(--df-v3-shadow) !important;
  backdrop-filter: none !important;
  transition: transform .16s ease, box-shadow .18s ease, border-color .18s ease !important;
}
.dashflow-product-shell .dashflow-widget::before { content: ""; position: absolute; z-index: 3; top: 0; left: 14px; right: 14px; height: 2px; border-radius: 0 0 99px 99px; background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--df-widget-tone) 68%, transparent), transparent); opacity: .55; pointer-events: none; }
.dashflow-product-shell .dashflow-widget::after { display: none !important; }
.dashflow-product-shell .dashflow-grid:not(.is-editing) .dashflow-widget:hover { transform: translateY(-2px) !important; border-color: color-mix(in srgb, var(--df-widget-tone) 26%, var(--df-v3-border)) !important; box-shadow: var(--df-v3-shadow-hover) !important; }
.dashflow-product-shell .dashflow-widget[data-widget-type="tasks"] { --df-widget-tone: var(--df-v3-violet); }
.dashflow-product-shell .dashflow-widget[data-widget-type="progress"] { --df-widget-tone: var(--df-v3-green); }
.dashflow-product-shell .dashflow-widget[data-widget-type="upcoming"] { --df-widget-tone: var(--df-v3-cyan); }
.dashflow-product-shell .dashflow-widget[data-widget-type="projects"] { --df-widget-tone: var(--df-v3-violet); }
.dashflow-product-shell .dashflow-widget[data-widget-type="habits"] { --df-widget-tone: var(--df-v3-green); }
.dashflow-product-shell .dashflow-widget[data-widget-type="heatmap"] { --df-widget-tone: var(--df-v3-violet); }
.dashflow-product-shell .dashflow-widget[data-widget-type="calendar"] { --df-widget-tone: var(--df-v3-cyan); }
.dashflow-product-shell .dashflow-widget[data-widget-type="weekly-review"] { --df-widget-tone: #9b72ff; }
.dashflow-product-shell .dashflow-widget[data-widget-type="vault-stats"] { --df-widget-tone: var(--df-v3-cyan); }

.dashflow-product-shell .dashflow-widget[data-widget-id="today-tasks"] {
  border-color: color-mix(in srgb, var(--df-v3-violet) 28%, var(--df-v3-border)) !important;
  background:
    radial-gradient(360px 190px at 100% 0%, color-mix(in srgb, var(--df-v3-cyan) 7%, transparent), transparent 70%),
    linear-gradient(180deg, color-mix(in srgb, var(--df-v3-violet) 3%, var(--df-v3-surface)), var(--df-v3-surface) 36%) !important;
  box-shadow: 0 12px 34px color-mix(in srgb, var(--df-v3-violet) 9%, rgba(33,38,57,.05)) !important;
}

.dashflow-product-shell .dashflow-widget-header { height: 45px !important; padding: 0 13px !important; border-bottom: 1px solid var(--df-v3-border) !important; background: transparent !important; }
.dashflow-product-shell .dashflow-widget-header strong { color: var(--df-v3-text) !important; font-size: 11.5px !important; font-weight: 680 !important; }
.dashflow-product-shell .dashflow-widget-icon { width: 24px !important; height: 24px !important; flex-basis: 24px !important; border: 0 !important; border-radius: 8px !important; color: var(--df-widget-tone) !important; background: color-mix(in srgb, var(--df-widget-tone) 9%, var(--df-v3-surface-2)) !important; box-shadow: none !important; }
.dashflow-product-shell .dashflow-widget-body { height: calc(100% - 46px) !important; padding: 14px !important; }
.dashflow-product-shell .dashflow-widget-kicker { color: var(--df-widget-tone) !important; font-size: 8.5px !important; letter-spacing: .08em; }
.dashflow-product-shell .dashflow-widget-kicker span { color: var(--df-v3-faint) !important; }
.dashflow-product-shell .dashflow-empty { width: min(100%, 390px); min-height: 66px !important; height: auto !important; margin: auto; padding: 13px 15px !important; border: 1px dashed var(--df-v3-border-strong) !important; border-radius: 11px !important; color: var(--df-v3-faint) !important; background: var(--df-v3-surface-2) !important; }

.dashflow-product-shell .dashflow-task { padding: 8px 6px !important; border-bottom-color: var(--df-v3-border) !important; border-radius: 8px !important; }
.dashflow-product-shell .dashflow-task:hover { background: var(--df-v3-surface-2) !important; }
.dashflow-product-shell .dashflow-task time { color: var(--df-v3-muted) !important; background: var(--df-v3-surface-2) !important; }

/* Progress becomes a compact signal in Today instead of a decorative donut taking a whole column. */
.dashflow-product-shell .dashflow-widget[data-widget-type="progress"] .dashflow-widget-header { height: 38px !important; }
.dashflow-product-shell .dashflow-widget[data-widget-type="progress"] .dashflow-widget-body { height: calc(100% - 39px) !important; padding: 8px 12px !important; }
.dashflow-product-shell .dashflow-progress-wrap { flex-direction: row !important; justify-content: center; gap: 14px !important; }
.dashflow-product-shell .dashflow-progress-ring { width: 58px !important; height: 58px !important; flex: 0 0 58px; background: conic-gradient(var(--df-v3-green) var(--dashflow-progress), var(--df-v3-surface-3) 0) !important; filter: none !important; }
.dashflow-product-shell .dashflow-progress-ring::after { inset: 6px !important; background: var(--df-v3-surface) !important; }
.dashflow-product-shell .dashflow-progress-ring strong { font-size: 15px !important; }
.dashflow-product-shell .dashflow-progress-ring span { color: var(--df-v3-green) !important; font-size: 6.5px !important; }
.dashflow-product-shell .dashflow-progress-meta { color: var(--df-v3-muted) !important; font-size: 9px !important; }

/* Project widget inside Today: flat rows; project detail is the actual interaction surface. */
.dashflow-product-shell .dashflow-project-row { padding: 9px 5px !important; border: 0 !important; border-bottom: 1px solid var(--df-v3-border) !important; border-radius: 7px !important; background: transparent !important; box-shadow: none !important; }
.dashflow-product-shell .dashflow-project-row:hover { background: var(--df-v3-surface-2) !important; }
.dashflow-product-shell .dashflow-project-name { color: var(--df-v3-text) !important; font-size: 10.5px; font-weight: 610; }
.dashflow-product-shell .dashflow-project-bar { height: 4px !important; background: var(--df-v3-surface-3) !important; }
.dashflow-product-shell .dashflow-project-bar span { background: linear-gradient(90deg, var(--df-v3-violet), var(--df-v3-cyan)) !important; }
.dashflow-product-shell .dashflow-project-stat strong { color: var(--df-v3-violet) !important; }
.dashflow-product-shell .dashflow-project-stat span { color: var(--df-v3-faint) !important; }

/* Dedicated product pages */
.dashflow-product-page {
  min-width: 0;
  min-height: 520px;
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--df-v3-border);
  border-radius: 14px;
  background: var(--df-v3-surface);
  box-shadow: var(--df-v3-shadow);
}
.dashflow-product-page-head { min-height: 58px; padding: 13px 16px; display: flex; align-items: center; justify-content: space-between; gap: 16px; border-bottom: 1px solid var(--df-v3-border); }
.dashflow-product-page-head strong { display: block; color: var(--df-v3-text); font-size: 12px; font-weight: 680; }
.dashflow-product-page-head span { display: block; margin-top: 3px; color: var(--df-v3-muted); font-size: 9px; }
.dashflow-product-page-head button { height: 31px; padding: 0 10px; border: 1px solid var(--df-v3-border) !important; border-radius: 8px !important; color: var(--df-v3-text) !important; background: var(--df-v3-surface) !important; box-shadow: none !important; font-size: 9px; }

.dashflow-inbox-list { padding: 5px 16px 18px; }
.dashflow-inbox-row { min-height: 54px; display: grid; grid-template-columns: 20px minmax(0,1fr); align-items: center; gap: 9px; border-bottom: 1px solid var(--df-v3-border); }
.dashflow-inbox-row > input { margin: 0; }
.dashflow-inbox-row-main { min-width: 0; padding: 9px 2px !important; display: block; border: 0 !important; color: var(--df-v3-text) !important; background: transparent !important; box-shadow: none !important; text-align: left; }
.dashflow-inbox-row-main strong { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 10.5px; font-weight: 590; }
.dashflow-inbox-row-main span { display: block; margin-top: 3px; color: var(--df-v3-faint); font-size: 8.5px; }
.dashflow-inbox-row:hover { background: color-mix(in srgb, var(--df-v3-violet) 3%, var(--df-v3-surface)); }

.dashflow-project-browser { padding: 4px 16px 20px; }
.dashflow-project-browser-row { width: 100%; min-height: 66px; display: grid; grid-template-columns: minmax(0,1fr) 220px; align-items: center; gap: 22px; padding: 10px 4px !important; border: 0 !important; border-bottom: 1px solid var(--df-v3-border) !important; border-radius: 0 !important; color: var(--df-v3-text) !important; background: transparent !important; box-shadow: none !important; text-align: left; }
.dashflow-project-browser-row:hover { background: var(--df-v3-surface-2) !important; }
.dashflow-project-browser-main > div { display: flex; align-items: center; gap: 8px; }
.dashflow-project-browser-main strong { font-size: 11px; font-weight: 640; }
.dashflow-project-browser-main > span { display: block; margin-top: 4px; color: var(--df-v3-muted); font-size: 8.5px; }
.dashflow-project-status { padding: 2px 6px; border-radius: 99px; color: var(--df-v3-muted); background: var(--df-v3-surface-2); font-size: 7.5px; }
.dashflow-project-status.is-active { color: color-mix(in srgb, var(--df-v3-green) 78%, var(--df-v3-text)); background: color-mix(in srgb, var(--df-v3-green) 10%, var(--df-v3-surface)); }
.dashflow-project-status.is-paused { color: var(--df-v3-amber); }
.dashflow-project-status.is-completed { color: var(--df-v3-cyan); }
.dashflow-project-browser-progress { display: grid; grid-template-columns: 38px minmax(0,1fr); align-items: center; gap: 10px; }
.dashflow-project-browser-progress > strong { color: var(--df-v3-violet); font-size: 10px; text-align: right; }
.dashflow-project-browser-progress > div { height: 5px; overflow: hidden; border-radius: 99px; background: var(--df-v3-surface-3); }
.dashflow-project-browser-progress > div span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--df-v3-violet), var(--df-v3-cyan)); }

.dashflow-product-empty { margin: 24px; padding: 18px; display: flex; align-items: flex-start; gap: 11px; border: 1px dashed var(--df-v3-border-strong); border-radius: 11px; color: var(--df-v3-muted); background: var(--df-v3-surface-2); }
.dashflow-product-empty > div:first-child { width: 20px; height: 20px; color: var(--df-v3-green); }
.dashflow-product-empty strong { display: block; color: var(--df-v3-text); font-size: 10.5px; }
.dashflow-product-empty span { display: block; margin-top: 3px; font-size: 9px; line-height: 1.5; }

/* Calendar, habits and review stay information-rich but no longer look like nested forms. */
.dashflow-product-shell .dashflow-calendar-day { min-height: 46px !important; border: 1px solid transparent !important; border-radius: 8px !important; background: transparent !important; box-shadow: none !important; }
.dashflow-product-shell .dashflow-calendar-day:hover { background: var(--df-v3-surface-2) !important; }
.dashflow-product-shell .dashflow-calendar-day.is-selected { border-color: color-mix(in srgb, var(--df-v3-violet) 35%, var(--df-v3-border)) !important; background: color-mix(in srgb, var(--df-v3-violet) 7%, var(--df-v3-surface-2)) !important; }
.dashflow-product-shell .dashflow-calendar-day.is-today .dashflow-calendar-day-number { color: #fff !important; background: linear-gradient(135deg, var(--df-v3-violet), var(--df-v3-cyan)) !important; box-shadow: 0 5px 13px rgba(100,110,255,.22); }
.dashflow-product-shell .dashflow-calendar-agenda { border: 1px solid var(--df-v3-border) !important; border-radius: 11px !important; background: var(--df-v3-surface-2) !important; }
.dashflow-product-shell .dashflow-calendar-event { border-color: var(--df-v3-border) !important; background: var(--df-v3-surface) !important; box-shadow: none !important; }
.dashflow-product-shell .dashflow-habit-row { border: 0 !important; border-bottom: 1px solid var(--df-v3-border) !important; border-radius: 0 !important; background: transparent !important; box-shadow: none !important; }
.dashflow-product-shell .dashflow-habit-row:hover { background: var(--df-v3-surface-2) !important; }
.dashflow-product-shell .dashflow-habit-day.is-done { background: linear-gradient(135deg, var(--df-v3-green), var(--df-v3-cyan)) !important; }
.dashflow-product-shell .dashflow-habit-progress-track span { background: linear-gradient(90deg, var(--df-v3-green), var(--df-v3-cyan)) !important; }
.dashflow-product-shell .dashflow-weekly-kpi { border: 1px solid var(--df-v3-border) !important; background: var(--df-v3-surface-2) !important; box-shadow: none !important; }
.dashflow-product-shell .dashflow-weekly-row { border: 0 !important; border-bottom: 1px solid var(--df-v3-border) !important; border-radius: 0 !important; background: transparent !important; box-shadow: none !important; }

.dashflow-product-shell .dashflow-heatmap-cell[data-level="0"] { background: var(--df-v3-surface-3) !important; }
.dashflow-product-shell .dashflow-heatmap-cell[data-level="1"] { background: color-mix(in srgb, var(--df-v3-violet) 22%, var(--df-v3-surface)) !important; }
.dashflow-product-shell .dashflow-heatmap-cell[data-level="2"] { background: color-mix(in srgb, var(--df-v3-violet) 48%, var(--df-v3-surface)) !important; }
.dashflow-product-shell .dashflow-heatmap-cell[data-level="3"] { background: color-mix(in srgb, var(--df-v3-cyan) 62%, var(--df-v3-violet)) !important; }
.dashflow-product-shell .dashflow-heatmap-cell[data-level="4"] { background: linear-gradient(135deg, var(--df-v3-violet), var(--df-v3-cyan)) !important; box-shadow: 0 0 10px rgba(50,197,244,.22); }

/* Editors / search / AI */
.dashflow-editor-modal { --df-modal-border: var(--background-modifier-border); }
.dashflow-modal-eyebrow { margin-bottom: 6px; color: var(--interactive-accent); font-size: 8px; font-weight: 750; letter-spacing: .14em; }
.dashflow-editor-modal h2 { margin: 0 0 5px; letter-spacing: -.03em; }
.dashflow-modal-lead { margin: 0 0 14px !important; line-height: 1.55; }
.dashflow-editor-modal .setting-item { padding: 12px 0; }
.dashflow-editor-modal .setting-item-name { font-size: 11px; font-weight: 620; }
.dashflow-editor-modal .setting-item-description { font-size: 9.5px; }

.dashflow-project-detail-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; }
.dashflow-project-detail-head > div:first-child { min-width: 0; flex: 1; }
.dashflow-project-detail-actions { display: flex; gap: 6px; }
.dashflow-project-detail-actions button { display: inline-flex; align-items: center; gap: 5px; }
.dashflow-project-detail-actions svg { width: 13px; height: 13px; }
.dashflow-project-detail-meta { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 7px; margin: 16px 0 10px; }
.dashflow-project-detail-meta-item { padding: 9px 10px; border: 1px solid var(--background-modifier-border); border-radius: 9px; background: var(--background-secondary); }
.dashflow-project-detail-meta-item span { display: block; color: var(--text-muted); font-size: 8px; }
.dashflow-project-detail-meta-item strong { display: block; margin-top: 3px; font-size: 11px; }
.dashflow-project-detail-progress { height: 6px; overflow: hidden; border-radius: 99px; background: var(--background-modifier-border); }
.dashflow-project-detail-progress span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--df-v3-violet), var(--df-v3-cyan)); }
.dashflow-project-detail-section-head { margin-top: 18px; padding-bottom: 8px; display: flex; align-items: center; justify-content: space-between; gap: 12px; border-bottom: 1px solid var(--background-modifier-border); }
.dashflow-project-detail-section-head strong { display: block; font-size: 11px; }
.dashflow-project-detail-section-head span { display: block; margin-top: 2px; color: var(--text-muted); font-size: 8px; }
.dashflow-project-detail-task-list { display: flex; flex-direction: column; }
.dashflow-project-detail-task { min-height: 48px; display: grid; grid-template-columns: 20px minmax(0,1fr); gap: 8px; align-items: center; border-bottom: 1px solid var(--background-modifier-border); }
.dashflow-project-detail-task > button { padding: 7px 0 !important; border: 0 !important; background: transparent !important; box-shadow: none !important; text-align: left; }
.dashflow-project-detail-task strong { display: block; font-size: 10px; }
.dashflow-project-detail-task span { display: block; margin-top: 2px; color: var(--text-muted); font-size: 8px; }
.dashflow-project-completed { margin-top: 12px; color: var(--text-muted); font-size: 9px; }
.dashflow-project-completed summary { cursor: pointer; }

.dashflow-search-item { display: grid !important; grid-template-columns: 30px minmax(0,1fr); align-items: center; gap: 9px; }
.dashflow-search-item-icon { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 8px; color: var(--interactive-accent); background: color-mix(in srgb, var(--interactive-accent) 9%, var(--background-secondary)); }
.dashflow-search-item-icon svg { width: 14px; height: 14px; }
.dashflow-search-item-copy strong { display: block; font-size: 10.5px; }
.dashflow-search-item-copy span { display: block; margin-top: 2px; color: var(--text-muted); font-size: 8px; }

.dashflow-ai-plan-state { min-height: 100px; display: flex; align-items: center; justify-content: center; gap: 9px; color: var(--text-muted); }
.dashflow-ai-plan-spinner { width: 24px; height: 24px; display: grid; place-items: center; color: var(--interactive-accent); }
.dashflow-ai-plan-output { min-height: 160px; padding: 15px 16px; border: 1px solid var(--background-modifier-border); border-radius: 11px; background: var(--background-secondary); color: var(--text-normal); font-size: 10.5px; line-height: 1.7; white-space: pre-wrap; }
.dashflow-ai-plan-actions { margin-top: 12px; display: flex; justify-content: flex-end; gap: 7px; }

/* Settings: user-facing first, protocol details collapsed. */
.dashflow-settings-page { max-width: 880px; margin: 0 auto; padding: 22px 10px 64px; }
.dashflow-settings-hero { margin-bottom: 16px; padding: 0 2px 14px; border: 0 !important; border-radius: 0 !important; background: transparent !important; }
.dashflow-settings-hero-badge { display: none !important; }
.dashflow-settings-hero h2 { margin: 0 0 5px; font-size: 26px; letter-spacing: -.035em; }
.dashflow-settings-hero p { margin: 0; max-width: 650px; color: var(--text-muted); font-size: 10.5px; line-height: 1.55; }
.dashflow-settings-panel { margin-top: 12px; overflow: hidden; border: 1px solid var(--background-modifier-border); border-radius: 12px; background: var(--background-primary); }
.dashflow-settings-panel-head { padding: 13px 15px 9px; border-bottom: 1px solid var(--background-modifier-border); }
.dashflow-settings-panel-head strong { display: block; font-size: 11.5px; }
.dashflow-settings-panel-head span { display: block; margin-top: 3px; color: var(--text-muted); font-size: 9px; }
.dashflow-settings-panel .setting-item { margin: 0 !important; padding: 13px 15px !important; border: 0 !important; border-bottom: 1px solid color-mix(in srgb,var(--background-modifier-border) 70%,transparent) !important; border-radius: 0 !important; background: transparent !important; }
.dashflow-settings-panel .setting-item:last-child { border-bottom: 0 !important; }
.dashflow-settings-panel .setting-item-name { font-size: 10.5px; font-weight: 620; }
.dashflow-settings-panel .setting-item-description { max-width: 520px; color: var(--text-muted); font-size: 9px; line-height: 1.45; }
.dashflow-settings-advanced { margin-top: 12px; border: 1px solid var(--background-modifier-border); border-radius: 11px; background: var(--background-primary); }
.dashflow-settings-advanced > summary { padding: 12px 14px; cursor: pointer; color: var(--text-muted); font-size: 10px; font-weight: 600; }
.dashflow-settings-guide-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; padding: 0 12px 12px; }
.dashflow-settings-code-card { min-width: 0; padding: 12px; border: 1px solid var(--background-modifier-border); border-radius: 9px; background: var(--background-secondary); }
.dashflow-settings-code-card h3 { margin: 0 0 7px; font-size: 10px; }
.dashflow-settings-code-card pre { margin: 0; padding: 10px; overflow: auto; border-radius: 8px; font-size: 8.5px; line-height: 1.5; }
.dashflow-settings-code-card p { margin: 8px 0 0; color: var(--text-muted); font-size: 8.5px; line-height: 1.5; }

/* Advanced layout is intentionally secondary, but remains available. */
.dashflow-product-shell.is-layout-editing .dashflow-product-nav { opacity: .96; }
.dashflow-product-shell.is-layout-editing .dashflow-grid { grid-column: 2; }
.dashflow-product-shell.is-layout-editing .dashflow-edit-bar { border: 1px solid var(--df-v3-border-strong) !important; background: color-mix(in srgb,var(--df-v3-surface) 92%,transparent) !important; box-shadow: 0 16px 42px rgba(22,26,40,.14) !important; backdrop-filter: blur(18px); }

@media (max-width: 1050px) {
  .dashflow-product-shell { grid-template-columns: 176px minmax(0,1fr); column-gap: 18px; }
  .dashflow-project-browser-row { grid-template-columns: minmax(0,1fr) 160px; }
}

@media (max-width: 900px) {
  .dashflow-product-shell { width: min(100% - 14px, 820px) !important; min-height: 100%; padding: 12px 0 78px !important; display: block !important; }
  .dashflow-product-nav { position: fixed; z-index: 100; left: 10px; right: 10px; bottom: 8px; top: auto; width: auto; height: 56px; min-height: 0; padding: 6px 7px; display: block; border-radius: 15px; box-shadow: 0 18px 46px rgba(0,0,0,.28); }
  .dashflow-product-brand,.dashflow-sidebar-workspace,.dashflow-product-nav-footer { display: none !important; }
  .dashflow-product-nav-list { height: 100%; display: grid; grid-template-columns: repeat(6,1fr); gap: 2px; }
  .dashflow-product-nav-item { height: 44px; padding: 4px 2px; flex-direction: column; justify-content: center; gap: 2px; border-radius: 10px !important; font-size: 7px; }
  .dashflow-product-nav-item.is-active::before { left: 50%; top: 1px; width: 18px; height: 2px; transform: translateX(-50%); }
  .dashflow-product-nav-icon { height: 17px; }
  .dashflow-product-shell .dashflow-hero { margin-top: 2px !important; padding: 7px 2px 10px !important; align-items: flex-start !important; }
  .dashflow-product-header-actions { flex-wrap: wrap; justify-content: flex-end; }
  .dashflow-product-action { height: 32px; padding: 0 9px; }
  .dashflow-today-summary { grid-template-columns: repeat(2,minmax(0,1fr)); }
  .dashflow-product-shell .dashflow-grid { display: flex !important; flex-direction: column; gap: 10px !important; }
  .dashflow-product-shell .dashflow-widget,.dashflow-product-page { width: 100% !important; min-height: 220px; }
  .dashflow-product-shell .dashflow-widget[data-widget-type="progress"] { min-height: 150px; }
  .dashflow-product-shell .dashflow-widget[data-widget-type="calendar"] { min-height: 620px; }
  .dashflow-product-shell .dashflow-widget[data-widget-type="weekly-review"] { min-height: 520px; }
  .dashflow-project-browser-row { grid-template-columns: minmax(0,1fr); gap: 7px; }
  .dashflow-project-detail-meta { grid-template-columns: repeat(2,minmax(0,1fr)); }
}

@media (max-width: 620px) {
  .dashflow-product-shell .dashflow-hero { display: grid !important; gap: 10px; }
  .dashflow-product-header-actions { justify-content: flex-start; }
  .dashflow-product-action span:last-child { display: none; }
  .dashflow-product-action { width: 34px; padding: 0; }
  .dashflow-product-action.is-primary { width: auto; padding: 0 11px; }
  .dashflow-product-action.is-primary span:last-child { display: inline; }
  .dashflow-today-summary { gap: 6px; }
  .dashflow-today-summary-item { padding: 9px 10px; }
  .dashflow-settings-guide-grid { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .dashflow-product-action:hover,
  .dashflow-product-shell .dashflow-grid:not(.is-editing) .dashflow-widget:hover { transform: none !important; }
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
